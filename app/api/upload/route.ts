import { NextResponse } from 'next/server';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'কোনো ছবি আপলোড করা হয়নি।' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Option 1: If Cloudinary keys are configured with real credentials, upload to Cloudinary
    if (
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'demo'
    ) {
      try {
        const url = await uploadImageToCloudinary(buffer, 'digital_tolet');
        return NextResponse.json({ success: true, url });
      } catch (cloudErr: any) {
        console.warn('Cloudinary upload failed, falling back to disk storage:', cloudErr.message);
      }
    }

    // Option 2: Permanent local static file storage in public/uploads/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    // Clean filename
    const ext = path.extname(file.name) || '.jpg';
    const sanitizedBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFilename = `prop_${Date.now()}_${sanitizedBase}${ext}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFilename}`;
    return NextResponse.json({ success: true, url: publicUrl });
  } catch (error: any) {
    console.error('Image upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
