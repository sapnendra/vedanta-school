import { BookOpen, Pencil, Plus } from "lucide-react";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

import DeleteSeminarButton from "@/components/admin/DeleteSeminarButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { connectDB } from "@/lib/mongodb";
import Seminar from "@/models/Seminar";

type SeminarRow = {
  _id: string;
  imageUrl: string;
  title: string;
  badge: string;
  date: string;
  price: number;
  seatsFilled: number;
  seatsTotal: number;
  isActive: boolean;
};

export const dynamic = "force-dynamic";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export default async function AdminSeminarsPage() {
  await connectDB();
  const seminars = await Seminar.find().sort({ createdAt: -1 }).lean();
  const data = serialize(seminars) as SeminarRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-white font-heading">Seminars</h1>
        <Button asChild className="bg-saffron text-charcoal hover:bg-gold">
          <Link href="/admin/seminars/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Seminar
          </Link>
        </Button>
      </div>

      <Card className="border-saffron/10 bg-[#14110d]">
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-white/55">
              <BookOpen className="h-8 w-8 text-saffron" />
              <p className="text-sm [font-family:var(--font-poppins)]">No seminars yet</p>
              <Button asChild variant="outline">
                <Link href="/admin/seminars/new">Add first seminar</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Badge</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((seminar) => {
                  const percent = seminar.seatsTotal > 0 ? (seminar.seatsFilled / seminar.seatsTotal) * 100 : 0;
                  return (
                    <TableRow key={seminar._id}>
                      <TableCell>
                        <img src={seminar.imageUrl} alt={seminar.title} className="h-10 w-16 rounded object-cover" />
                      </TableCell>
                      <TableCell>{seminar.title}</TableCell>
                      <TableCell>
                        <Badge className="bg-saffron/20 text-saffron border-saffron/20">{seminar.badge}</Badge>
                      </TableCell>
                      <TableCell>{seminar.date}</TableCell>
                      <TableCell className="text-[#fbbf24]">₹{seminar.price}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-xs text-white/70">{seminar.seatsFilled}/{seminar.seatsTotal}</p>
                          <Progress value={percent} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {seminar.isActive ? (
                          <Badge className="bg-green-500/20 text-green-300 border-green-400/20">Active</Badge>
                        ) : (
                          <Badge className="bg-white/10 text-white/60 border-white/20">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/admin/seminars/${seminar._id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteSeminarButton seminarId={seminar._id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
