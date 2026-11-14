import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import Property from '@/models/Property';
import { defaultProperties } from '@/lib/defaultData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const db = await connectToDatabase();
    if (!db) {
      const match = defaultProperties.find((p) => p.id === id || p._id === id);
      if (match) {
        return NextResponse.json({ success: true, data: match, fallback: true });
      }
      return NextResponse.json(
        { success: false, error: 'বাসাটির তথ্য ডাটাবেসে পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    let property = null;

    // 1. If valid MongoDB ObjectId, query by _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      property = await Property.findById(id);
    }

    // 2. Fallback check by custom legacy id if any
    if (!property) {
      property = await Property.findOne({ id: id });
    }

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'বাসাটির তথ্য ডাটাবেসে পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: property });
  } catch (err: any) {
    console.error(`MongoDB GET /api/properties/${id} error:`, err);
    return NextResponse.json(
      { success: false, error: `ডাটাবেস এরর: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'MongoDB Atlas ডাটাবেস সংযোগ অনুপলব্ধ। বিজ্ঞাপন আপডেট করা সম্ভব হয়নি।',
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Property.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!updated) {
      updated = await Property.findOneAndUpdate({ id: id }, body, {
        new: true,
        runValidators: true,
      });
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'আপডেট করার জন্য বিজ্ঞাপনটি পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error(`MongoDB PATCH /api/properties/${id} error:`, err);
    return NextResponse.json(
      { success: false, error: `আপডেট ব্যর্থ হয়েছে: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'MongoDB Atlas ডাটাবেস সংযোগ অনুপলব্ধ। বিজ্ঞাপন মোছা সম্ভব হয়নি।',
        },
        { status: 503 }
      );
    }

    let deleted = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      deleted = await Property.findByIdAndDelete(id);
    }

    if (!deleted) {
      deleted = await Property.findOneAndDelete({ id: id });
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'বিজ্ঞাপনটি খুঁজে পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'বিজ্ঞাপনটি ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলা হয়েছে।',
    });
  } catch (err: any) {
    console.error(`MongoDB DELETE /api/properties/${id} error:`, err);
    return NextResponse.json(
      { success: false, error: `বিজ্ঞাপন মোছা ব্যর্থ হয়েছে: ${err.message}` },
      { status: 500 }
    );
  }
}
