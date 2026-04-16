export interface ISeminarData {
  _id: string;
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
}

export interface IExpertData {
  _id: string;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  credentials: string[];
  yearsMonk: number;
  livesHelped: number;
  seminars: number;
  isActive: boolean;
}

export interface ITestimonialData {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl: string;
  isActive: boolean;
}

export interface IRegistrationData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  occupation: string;
  seminarId: string;
  seminarTitle: string;
  paymentId?: string;
  paymentStatus: "pending" | "captured" | "failed";
}

export interface ISiteConfigData {
  _id: string;
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
}
