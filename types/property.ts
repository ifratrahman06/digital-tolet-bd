export interface INearbyPlace {
  name: string;
  category: 'transport' | 'hospital' | 'market' | 'shopping' | 'education' | 'dining' | 'security' | 'nature' | 'mosque' | 'general';
  distance: string;
  detail?: string;
}

export interface IComment {
  id: string;
  userName: string;
  userRole?: 'tenant' | 'landlord' | 'verified_user';
  text: string;
  createdAt: string;
}

export interface IProperty {
  id?: string;
  _id?: string;
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
  featured?: boolean;
  isVerified?: boolean;
  verificationBadge?: 'nid_verified' | 'physical_verified' | 'top_rated' | 'premium';
  likes: number;
  comments: IComment[];
  nearbyPlaces: INearbyPlace[];
  postedBy?: {
    userId: string;
    name: string;
    phone: string;
  };
  createdAt?: string;
  updatedAt?: string;
}
