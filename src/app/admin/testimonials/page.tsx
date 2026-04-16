import { Pencil, Plus, Star } from "lucide-react";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

import DeleteTestimonialButton from "@/components/admin/DeleteTestimonialButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

type TestimonialRow = {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  imageUrl: string;
  isActive: boolean;
};

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

const truncate = (text: string, length: number): string =>
  text.length > length ? `${text.slice(0, length)}...` : text;

export default async function AdminTestimonialsPage() {
  await connectDB();
  const testimonials = await Testimonial.find().sort({ createdAt: -1 }).lean();
  const data = serialize(testimonials) as TestimonialRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-white font-heading">Testimonials</h1>
        <Button asChild className="bg-saffron text-charcoal hover:bg-gold">
          <Link href="/admin/testimonials/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Link>
        </Button>
      </div>

      <Card className="border-saffron/10 bg-[#14110d]">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <img src={item.imageUrl} alt={item.name} className="h-10 w-10 rounded-full object-cover" />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.role}</TableCell>
                  <TableCell>{truncate(item.content, 80)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={index < item.rating ? "h-4 w-4 text-[#fbbf24]" : "h-4 w-4 text-white/20"}
                          fill={index < item.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.isActive ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/20">Active</Badge>
                    ) : (
                      <Badge className="bg-white/10 text-white/60 border-white/20">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/testimonials/${item._id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <DeleteTestimonialButton testimonialId={item._id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
