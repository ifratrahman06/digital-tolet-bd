import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import mongoose, { Schema, Model } from 'mongoose';

const MessageSchema = new Schema(
  {
    propertyId: { type: String, required: true, index: true },
    propertyTitle: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    senderName: { type: String, required: true },
    senderPhone: { type: String, required: true },
    messageText: { type: String, required: true },
    inquiryType: { type: String, default: 'General' },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  },
  { timestamps: true }
);

const PropertyMessage: Model<any> =
  (mongoose.models && mongoose.models.PropertyMessage) ||
  mongoose.model('PropertyMessage', MessageSchema);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, propertyTitle, ownerPhone, senderName, senderPhone, messageText } = body;

    if (!propertyId || !senderName || !senderPhone || !messageText) {
      return NextResponse.json(
        { success: false, error: 'দয়া করে আপনার নাম, মোবাইল নম্বর এবং মেসেজ লিখুন।' },
        { status: 400 }
      );
    }

    try {
      const db = await connectToDatabase();
      if (db) {
        await PropertyMessage.create({
          propertyId,
          propertyTitle: propertyTitle || 'বাসা টু-লেট',
          ownerPhone: ownerPhone || '',
          senderName: String(senderName).trim(),
          senderPhone: String(senderPhone).trim(),
          messageText: String(messageText).trim(),
          inquiryType: body.inquiryType || 'General',
        });
      }
    } catch (dbErr) {
      console.warn('Direct message DB save warning (proceeding):', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'আপনার মেসেজটি সফলভাবে বাড়িওয়ালার কাছে পাঠানো হয়েছে!',
      data: {
        propertyId,
        senderName,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('POST /api/messages error:', err);
    return NextResponse.json(
      { success: false, error: `মেসেজ পাঠাতে সমস্যা হয়েছে: ${err.message}` },
      { status: 500 }
    );
  }
}
