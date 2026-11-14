import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPropertyDocument extends Document {
  title: string;
  category: 'Family' | 'Bachelor Male' | 'Bachelor Female' | 'Sublet' | 'Hostel' | 'Office';
  price: number;
  advance: number;
  serviceCharge?: number;
  location: {
    area: string;
    district: string;
    address?: string;
    mapQuery?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  details: {
    rooms: number;
    baths: number;
    balcony: boolean;
    floor?: number;
    sqft?: number;
    genderPreference?: string;
  };
  facilities: string[];
  description: string;
  contact: {
    phone: string;
    whatsapp?: string;
    ownerName?: string;
  };
  images: string[];
  status: 'available' | 'rented';
  featured: boolean;
  isVerified?: boolean;
  verificationBadge?: string;
  likes: number;
  comments: Array<{
    id: string;
    userName: string;
    userRole?: string;
    text: string;
    createdAt: string;
  }>;
  nearbyPlaces: Array<{
    name: string;
    category: string;
    distance: string;
    detail?: string;
  }>;
  postedBy?: {
    userId: string;
    name: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Family', 'Bachelor Male', 'Bachelor Female', 'Sublet', 'Hostel', 'Office'],
      index: true,
    },
    price: { type: Number, required: true, min: 0, index: true },
    advance: { type: Number, default: 0, min: 0 },
    serviceCharge: { type: Number, default: 0, min: 0 },
    location: {
      area: { type: String, required: true, trim: true, index: true },
      district: { type: String, required: true, default: 'Dhaka', trim: true, index: true },
      address: { type: String, trim: true },
      mapQuery: { type: String, trim: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    details: {
      rooms: { type: Number, default: 1, min: 0 },
      baths: { type: Number, default: 1, min: 0 },
      balcony: { type: Boolean, default: false },
      floor: { type: Number, default: 1 },
      sqft: { type: Number, default: 1000, min: 0 },
      genderPreference: { type: String, default: 'Any' },
    },
    facilities: [{ type: String }],
    description: { type: String, default: '', trim: true },
    contact: {
      phone: { type: String, required: true, trim: true },
      whatsapp: { type: String, trim: true },
      ownerName: { type: String, trim: true },
    },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['available', 'rented'],
      default: 'available',
      index: true,
    },
    featured: { type: Boolean, default: false, index: true },
    isVerified: { type: Boolean, default: true, index: true },
    verificationBadge: { type: String, default: 'physical_verified' },
    likes: { type: Number, default: 0, min: 0 },
    comments: [
      {
        id: { type: String },
        userName: { type: String },
        userRole: { type: String },
        text: { type: String },
        createdAt: { type: String },
      },
    ],
    nearbyPlaces: [
      {
        name: { type: String },
        category: { type: String },
        distance: { type: String },
        detail: { type: String },
      },
    ],
    postedBy: {
      userId: { type: String, index: true },
      name: { type: String },
      phone: { type: String },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        return ret;
      },
    },
  }
);

// Indexes for common search, filter, and sorting operations
PropertySchema.index({ status: 1, category: 1, 'location.district': 1, price: 1 });
PropertySchema.index({ 'location.district': 1, 'location.area': 1 });
PropertySchema.index({ createdAt: -1 });

// Full-text search index on Title, Area, and Description
PropertySchema.index(
  {
    title: 'text',
    'location.area': 'text',
    description: 'text',
  },
  {
    weights: {
      title: 10,
      'location.area': 5,
      description: 1,
    },
    name: 'PropertySearchTextIndex',
  }
);

export const Property: Model<IPropertyDocument> =
  (mongoose.models && mongoose.models.Property) ||
  mongoose.model<IPropertyDocument>('Property', PropertySchema);

export default Property;
