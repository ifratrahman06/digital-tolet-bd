import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Property from '@/models/Property';
import { defaultProperties } from '@/lib/defaultData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('q');
  const district = searchParams.get('district');
  const userId = searchParams.get('userId');

  try {
    const db = await connectToDatabase();

    if (!db) {
      console.warn('⚠️ MongoDB Atlas connected neither or MONGODB_URI missing. Falling back to default properties.');
      let filtered = [...defaultProperties];
      if (category && category !== 'all') {
        filtered = filtered.filter((p) => p.category === category);
      }
      if (district) {
        filtered = filtered.filter((p) => p.location.district.toLowerCase() === district.toLowerCase());
      }
      if (query && query.trim()) {
        const q = query.trim().toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.location.area.toLowerCase().includes(q) ||
            p.location.district.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
      }
      if (userId) {
        filtered = filtered.filter((p) => p.postedBy?.userId === userId);
      }

      return NextResponse.json({
        success: true,
        count: filtered.length,
        data: filtered,
        fallback: true,
      });
    }

    // Auto-seed initial realistic listings into MongoDB Atlas if the collection is empty
    const count = await Property.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial verified properties into MongoDB Atlas...');
      const seedList = defaultProperties.map((p) => {
        const { id, ...rest } = p;
        return rest;
      });
      await Property.insertMany(seedList);
    }

    // Build filter
    const filter: any = {};
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (district) {
      filter['location.district'] = new RegExp(`^${district}$`, 'i');
    }
    if (query && query.trim()) {
      const q = query.trim();
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { 'location.area': { $regex: q, $options: 'i' } },
        { 'location.district': { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (userId) {
      filter['postedBy.userId'] = userId;
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (err: any) {
    console.error('MongoDB GET /api/properties error:', err);
    return NextResponse.json(
      { success: false, error: `ডাটাবেস কুয়েরি ব্যর্থ হয়েছে: ${err.message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        {
          success: false,
          error: 'MongoDB Atlas ডাটাবেস সংযোগ অনুপলব্ধ। বিজ্ঞাপন ডাটাবেসে সংরক্ষণ করা সম্ভব হয়নি।',
        },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Strict validation of required fields
    if (!body.title || !body.price || !body.location?.area || !body.contact?.phone) {
      return NextResponse.json(
        { success: false, error: 'শিরোনাম, মাসিক ভাড়া, এলাকা এবং মোবাইল নম্বর অবশ্যই পূরণ করতে হবে।' },
        { status: 400 }
      );
    }

    const nearbyPlaces = Array.isArray(body.nearbyPlaces) && body.nearbyPlaces.length > 0
      ? body.nearbyPlaces
      : [
        { name: 'নিকটবর্তী বাস স্ট্যান্ড ও পরিবহন মোড়', category: 'transport', distance: '২০০ মিটার' },
        { name: 'স্থানীয় কাঁচাবাজার ও গ্রোসারি শপ', category: 'market', distance: '১৫০ মিটার' },
        { name: 'ফার্মেসি ও ক্লিনিক', category: 'hospital', distance: '৩০০ মিটার' },
        { name: 'জামে মসজিদ', category: 'mosque', distance: '১০০ মিটার' },
      ];

    const propertyPayload = {
      title: String(body.title).trim(),
      category: body.category || 'Family',
      price: Number(body.price),
      advance: Number(body.advance || 0),
      serviceCharge: Number(body.serviceCharge || 0),
      location: {
        area: String(body.location.area).trim(),
        district: String(body.location.district || 'Dhaka').trim(),
        address: body.location.address ? String(body.location.address).trim() : undefined,
        mapQuery: body.location.mapQuery || `${body.location.area}, ${body.location.district || 'Dhaka'}`,
        coordinates: body.location.coordinates || undefined,
      },
      details: {
        rooms: Number(body.details?.rooms || 1),
        baths: Number(body.details?.baths || 1),
        balcony: Boolean(body.details?.balcony),
        floor: Number(body.details?.floor || 1),
        sqft: Number(body.details?.sqft || 1000),
        genderPreference: body.details?.genderPreference || 'Any',
      },
      facilities: Array.isArray(body.facilities) ? body.facilities : ['Water', 'Security'],
      description: String(body.description || '').trim(),
      contact: {
        phone: String(body.contact.phone).trim(),
        whatsapp: body.contact.whatsapp ? String(body.contact.whatsapp).trim() : String(body.contact.phone).trim(),
        ownerName: body.contact.ownerName ? String(body.contact.ownerName).trim() : 'বাড়িওয়ালা',
      },
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80'],
      status: body.status === 'rented' ? 'rented' : 'available',
      featured: Boolean(body.featured),
      likes: 0,
      comments: [],
      nearbyPlaces,
      ...(body.postedBy ? { postedBy: body.postedBy } : {}),
    };

    // Save directly to MongoDB Atlas
    const newProperty = await Property.create(propertyPayload);

    return NextResponse.json({ success: true, data: newProperty }, { status: 201 });
  } catch (error: any) {
    console.error('MongoDB POST /api/properties error:', error);
    return NextResponse.json(
      { success: false, error: `বিজ্ঞাপন ডাটাবেসে সেভ করতে সমস্যা হয়েছে: ${error.message}` },
      { status: 500 }
    );
  }
}
