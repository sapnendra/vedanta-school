import bcrypt from "bcryptjs";

import { connectDB } from "../lib/mongodb";
import Admin from "../models/Admin";
import Expert from "../models/Expert";
import Seminar from "../models/Seminar";
import SiteConfig from "../models/SiteConfig";
import Testimonial from "../models/Testimonial";

async function seed() {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@vedantalifeschool.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await Admin.deleteMany({});
  await Seminar.deleteMany({});
  await Expert.deleteMany({});
  await Testimonial.deleteMany({});
  await SiteConfig.deleteMany({});

  await Admin.create({
    email: adminEmail,
    password: hashedPassword,
  });

  const seminars = await Seminar.create([
    {
      title: "Leadership from Bhagavad Gita",
      description: "Timeless leadership principles to lead teams with courage and clarity.",
      badge: "Leadership",
      date: "April 27, 2026",
      time: "7:00 PM - 9:00 PM IST",
      seatsTotal: 100,
      seatsFilled: 42,
      price: 199,
      originalPrice: 999,
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
    {
      title: "Decision Making with Gita Wisdom",
      description: "A practical framework to make fearless and value-aligned decisions.",
      badge: "Decisions",
      date: "May 4, 2026",
      time: "7:00 PM - 9:00 PM IST",
      seatsTotal: 100,
      seatsFilled: 27,
      price: 199,
      originalPrice: 999,
      imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
    {
      title: "Finding Your Dharma - Life Purpose Seminar",
      description: "Discover your purpose and align action with deeper meaning.",
      badge: "Purpose",
      date: "May 11, 2026",
      time: "7:00 PM - 9:00 PM IST",
      seatsTotal: 100,
      seatsFilled: 19,
      price: 199,
      originalPrice: 999,
      imageUrl: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?auto=format&fit=crop&w=1200&q=80",
      isActive: true,
    },
  ]);

  await Expert.create({
    name: "Dharmendra Krishna Das",
    title: "Monk, Corporate Trainer & Life Coach",
    bio: "Dedicated to making timeless Gita wisdom practical for modern professionals and students.",
    imageUrl: "https://res.cloudinary.com/dhmqkdh7w/image/upload/v1775828407/1_gzwfz2.jpg",
    credentials: [
      "ISKCON Monk - 10+ Years",
      "M.Tech from IIT",
      "Manager of IYF Bhopal",
      "EthicCraft Club Co-Professor",
    ],
    yearsMonk: 10,
    livesHelped: 10000,
    seminars: 50,
    isActive: true,
  });

  await Testimonial.create([
    {
      name: "Rohan Malhotra",
      role: "Product Manager, Bengaluru",
      content: "The Gita-based frameworks gave me career clarity in a way no coach ever could.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
      isActive: true,
    },
    {
      name: "Ananya Sharma",
      role: "Engineering Lead, Pune",
      content: "This seminar changed how I lead with calmness and conviction.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=240&q=80",
      isActive: true,
    },
    {
      name: "Vikram Nair",
      role: "Entrepreneur, Kochi",
      content: "Practical wisdom from the Gita helped me regain peace and focus daily.",
      rating: 5,
      imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80",
      isActive: true,
    },
  ]);

  await SiteConfig.create({
    heroTitle: "Feeling Lost in Life? Find Clarity Through",
    heroHighlight: "Bhagavad Gita Wisdom",
    heroSubtext: "Join India's most practical ancient wisdom seminar. Real answers. Real transformation.",
    heroDate: "April 27, 2026",
    heroTime: "7:00 PM - 9:00 PM IST",
    heroPrice: 199,
    heroOriginalPrice: 999,
    heroSeminarId: seminars[0]?._id?.toString(),
    announcementText: "🔥 Limited Seats Available",
    showAnnouncement: true,
  });

  console.log("Seeding completed successfully.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
