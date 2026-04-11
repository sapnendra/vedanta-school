// Client-side plain data interfaces (no Mongoose Document extension).
// Note: for API responses, prefer serializing documents with JSON.parse(JSON.stringify(doc))
// or explicit mapping to ensure _id becomes a string and no Mongoose internals leak.

export interface ISeminarData {
  id: string;
  title: string;
  description: string;
  badge: string;
  date: string;
  time: string;
  seatsTotal: number;
  seatsFilled: number;
  price: number;
  originalPrice: number;
  imageUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IExpertData {
  id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  credentials: string[];
  yearsMonk: number;
  livesHelped: number;
  seminars: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITestimonialData {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRegistrationData {
  id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  seminarId: string;
  seminarTitle: string;
  paymentId?: string;
  paymentStatus: "pending" | "captured" | "failed";
  createdAt?: string;
  updatedAt?: string;
}

export interface ISiteConfigData {
  id: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtext: string;
  heroDate: string;
  heroTime: string;
  heroPrice: number;
  heroOriginalPrice: number;
  heroSeminarId?: string;
  announcementText: string;
  showAnnouncement: boolean;
  createdAt?: string;
  updatedAt?: string;
}
