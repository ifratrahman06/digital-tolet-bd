import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import Property from '@/models/Property';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const action: 'like' | 'unlike' = body.action === 'unlike' ? 'unlike' : 'like';

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'MongoDB Atlas ডাটাবেস সংযোগ অনুপলব্ধ। লাইক আপডেট করা সম্ভব হয়নি।',
        },
        { status: 503 }
      );
    }

    const increment = action === 'unlike' ? -1 : 1;
    let updated = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Property.findByIdAndUpdate(
        id,
        { $inc: { likes: increment } },
        { new: true }
      );
    }

    if (!updated) {
      updated = await Property.findOneAndUpdate(
        { id: id },
        { $inc: { likes: increment } },
        { new: true }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'বিজ্ঞাপনটি পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      likes: Math.max(0, updated.likes || 0),
    });
  } catch (err: any) {
    console.error(`MongoDB POST /api/properties/${id}/like error:`, err);
    return NextResponse.json(
      { success: false, error: `লাইক আপডেট ব্যর্থ হয়েছে: ${err.message}` },
      { status: 500 }
    );
  }
}
