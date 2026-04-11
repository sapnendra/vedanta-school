import { BookOpen, ClipboardList, Star, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { connectDB } from "@/lib/mongodb";
import Expert from "@/models/Expert";
import Registration from "@/models/Registration";
import Seminar from "@/models/Seminar";
import Testimonial from "@/models/Testimonial";

type PaymentStatus = "pending" | "captured" | "failed";

type RegistrationRow = {
  _id: string;
  name: string;
  email: string;
  seminarTitle: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
};

const statusClassMap: Record<PaymentStatus, string> = {
  captured: "bg-green-500/20 text-green-300 border-green-400/20",
  pending: "bg-yellow-500/20 text-yellow-300 border-yellow-400/20",
  failed: "bg-red-500/20 text-red-300 border-red-400/20",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function AdminDashboardPage() {
  await connectDB();

  const [seminarCount, expertCount, registrationCount, testimonialCount, recentRegistrations] = await Promise.all([
    Seminar.countDocuments(),
    Expert.countDocuments(),
    Registration.countDocuments(),
    Testimonial.countDocuments(),
    Registration.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const safeRegistrations = JSON.parse(JSON.stringify(recentRegistrations)) as RegistrationRow[];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl text-white font-heading">Dashboard</h1>
        <p className="mt-1 text-sm text-white/60 [font-family:var(--font-poppins)]">Welcome back, Admin 👋</p>
      </header>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-saffron/10 bg-[#14110d] transition hover:border-saffron/30">
          <CardHeader className="pb-2">
            <div className="flex justify-end">
              <BookOpen className="h-5 w-5 text-[#d97706]" />
            </div>
            <CardTitle className="text-4xl text-white font-heading">{seminarCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 [font-family:var(--font-poppins)]">Total Seminars</p>
          </CardContent>
        </Card>

        <Card className="border-saffron/10 bg-[#14110d] transition hover:border-saffron/30">
          <CardHeader className="pb-2">
            <div className="flex justify-end">
              <Users className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <CardTitle className="text-4xl text-white font-heading">{expertCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 [font-family:var(--font-poppins)]">Total Experts</p>
          </CardContent>
        </Card>

        <Card className="border-saffron/10 bg-[#14110d] transition hover:border-saffron/30">
          <CardHeader className="pb-2">
            <div className="flex justify-end">
              <ClipboardList className="h-5 w-5 text-[#d97706]" />
            </div>
            <CardTitle className="text-4xl text-white font-heading">{registrationCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 [font-family:var(--font-poppins)]">Registrations</p>
          </CardContent>
        </Card>

        <Card className="border-saffron/10 bg-[#14110d] transition hover:border-saffron/30">
          <CardHeader className="pb-2">
            <div className="flex justify-end">
              <Star className="h-5 w-5 text-[#fbbf24]" />
            </div>
            <CardTitle className="text-4xl text-white font-heading">{testimonialCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/60 [font-family:var(--font-poppins)]">Testimonials</p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-3 text-xl text-white font-heading">Recent Registrations</h2>
        <Card className="border-saffron/10 bg-[#14110d]">
          <CardContent className="p-0">
            {safeRegistrations.length === 0 ? (
              <div className="p-10 text-center text-sm text-white/50 [font-family:var(--font-poppins)]">No registrations yet</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Seminar</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeRegistrations.map((registration) => (
                    <TableRow key={registration._id}>
                      <TableCell>{registration.name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.seminarTitle}</TableCell>
                      <TableCell>
                        <Badge className={statusClassMap[registration.paymentStatus]}>{registration.paymentStatus}</Badge>
                      </TableCell>
                      <TableCell>{dateFormatter.format(new Date(registration.createdAt))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
