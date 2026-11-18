import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import Property from '@/models/Property';
import { IComment } from '@/types/property';

export async function GET(
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
          error: 'MongoDB Atlas ডাটাবেস সংযোগ অনুপলব্ধ। কমেন্ট লোড করা সম্ভব হয়নি।',
        },
        { status: 503 }
      );
    }

    let prop = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      prop = await Property.findById(id).select('comments');
    }

    if (!prop) {
      prop = await Property.findOne({ id: id }).select('comments');
    }

    if (!prop) {
      return NextResponse.json(
        { success: false, error: 'বিজ্ঞাপনটি খুঁজে পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    const comments = prop.comments || [];
    return NextResponse.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err: any) {
    console.error(`MongoDB GET /api/properties/${id}/comments error:`, err);
    return NextResponse.json(
      { success: false, error: `কমেন্ট লোড করতে সমস্যা হয়েছে: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  if (!body.text || !body.text.trim()) {
    return NextResponse.json(
      { success: false, error: 'মন্তব্য বা প্রশ্ন প্রদান করুন।' },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'MongoDB Atlas ডাটাবেস সংযোগ অনুপলব্ধ। মন্তব্য প্রকাশ করা সম্ভব হয়নি।',
        },
        { status: 503 }
      );
    }

    const newComment: IComment = {
      id: new mongoose.Types.ObjectId().toString(),
      userName: body.userName?.trim() || 'সম্মানিত অনুসন্ধানকারী',
      userRole: body.userRole === 'landlord' ? 'landlord' : 'tenant',
      text: body.text.trim(),
      createdAt: new Date().toISOString(),
    };

    let updated = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      updated = await Property.findByIdAndUpdate(
        id,
        { $push: { comments: { $each: [newComment], $position: 0 } } },
        { new: true }
      );
    }

    if (!updated) {
      updated = await Property.findOneAndUpdate(
        { id: id },
        { $push: { comments: { $each: [newComment], $position: 0 } } },
        { new: true }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'বিজ্ঞাপনটি খুঁজে পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated.comments,
    }, { status: 201 });
  } catch (err: any) {
    console.error(`MongoDB POST /api/properties/${id}/comments error:`, err);
    return NextResponse.json(
      { success: false, error: `মন্তব্য প্রকাশে ব্যর্থ হয়েছে: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { commentId, text } = body;

  if (!commentId || !text || !text.trim()) {
    return NextResponse.json(
      { success: false, error: 'কমেন্ট আইডি ও সংশোধিত লেখা প্রয়োজন।' },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'ডাটাবেস সংযোগ অনুপলব্ধ।' },
        { status: 503 }
      );
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };
    
    // Update the specific comment within the comments array
    const updated = await Property.findOneAndUpdate(
      {
        ...query,
        $or: [{ 'comments.id': commentId }, { 'comments._id': commentId }],
      },
      {
        $set: { 'comments.$.text': text.trim() },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'মন্তব্যটি খুঁজে পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'মন্তব্য সফলভাবে সংশোধন করা হয়েছে।',
      data: updated.comments,
    });
  } catch (err: any) {
    console.error(`MongoDB PATCH /api/properties/${id}/comments error:`, err);
    return NextResponse.json(
      { success: false, error: `মন্তব্য সম্পাদনায় সমস্যা: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  let commentId = searchParams.get('commentId');

  if (!commentId) {
    const body = await request.json().catch(() => ({}));
    commentId = body.commentId;
  }

  if (!commentId) {
    return NextResponse.json(
      { success: false, error: 'মুছে ফেলার জন্য কমেন্ট আইডি প্রদান করুন।' },
      { status: 400 }
    );
  }

  try {
    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'ডাটাবেস সংযোগ অনুপলব্ধ।' },
        { status: 503 }
      );
    }

    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };

    const updated = await Property.findOneAndUpdate(
      query,
      {
        $pull: {
          comments: {
            $or: [{ id: commentId }, { _id: commentId }],
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'বিজ্ঞাপন বা মন্তব্যটি খুঁজে পাওয়া যায়নি।' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'মন্তব্যটি সফলভাবে মুছে ফেলা হয়েছে।',
      data: updated.comments,
    });
  } catch (err: any) {
    console.error(`MongoDB DELETE /api/properties/${id}/comments error:`, err);
    return NextResponse.json(
      { success: false, error: `মন্তব্য মুছতে সমস্যা হয়েছে: ${err.message}` },
      { status: 500 }
    );
  }
}
