import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { insertSupabaseFeedback, fetchSupabaseFeedbacks, isSupabaseConfigured } from '@/lib/supabase';
import mongoose, { Schema, Model } from 'mongoose';
import { getStoredFeedbacks, saveStoredFeedback } from '@/lib/storage';

// Feedback Mongoose Schema
const FeedbackSchema = new Schema(
  {
    name: { type: String, default: 'Anonymous User' },
    contact: { type: String, default: '' },
    category: { type: String, default: 'General' },
    rating: { type: Number, default: 5 },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Feedback: Model<any> =
  (mongoose.models && mongoose.models.Feedback) || mongoose.model('Feedback', FeedbackSchema);

export async function GET() {
  // 1. Try Supabase
  if (isSupabaseConfigured) {
    const supabaseData = await fetchSupabaseFeedbacks();
    if (supabaseData) {
      return NextResponse.json({
        success: true,
        source: 'supabase',
        count: supabaseData.length,
        data: supabaseData,
      });
    }
  }

  // 2. Try MongoDB
  try {
    const db = await connectToDatabase();
    if (db) {
      const items = await Feedback.find().sort({ createdAt: -1 }).limit(50);
      return NextResponse.json({
        success: true,
        source: 'mongodb',
        count: items.length,
        data: items,
      });
    }
  } catch (err: any) {
    console.warn('DB Fetch failed for feedback:', err.message);
  }

  // 3. Fallback to permanent disk storage
  const stored = await getStoredFeedbacks();
  return NextResponse.json({
    success: true,
    source: 'permanent_storage',
    count: stored.length,
    data: stored,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.message || !body.message.trim()) {
      return NextResponse.json(
        { success: false, error: 'দয়া করে আপনার মতামত লিখুন।' },
        { status: 400 }
      );
    }

    const payload = {
      name: body.name?.trim() || 'Anonymous User',
      contact: body.contact?.trim() || '',
      category: body.category || 'General',
      rating: Number(body.rating) || 5,
      message: body.message.trim(),
    };

    // 1. Try Supabase
    if (isSupabaseConfigured) {
      const supaResult = await insertSupabaseFeedback(payload);
      if (supaResult) {
        await saveStoredFeedback(payload);
        return NextResponse.json({ success: true, source: 'supabase', data: supaResult }, { status: 201 });
      }
    }

    // 2. Try MongoDB
    try {
      const db = await connectToDatabase();
      if (db) {
        const item = await Feedback.create(payload);
        await saveStoredFeedback(payload);
        return NextResponse.json({ success: true, source: 'mongodb', data: item }, { status: 201 });
      }
    } catch (err: any) {
      console.warn('MongoDB feedback insert failed:', err.message);
    }

    // 3. Save to Permanent Disk Storage
    const saved = await saveStoredFeedback(payload);
    return NextResponse.json({ success: true, source: 'permanent_storage', data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
