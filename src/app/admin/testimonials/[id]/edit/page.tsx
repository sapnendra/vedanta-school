import { notFound } from "next/navigation";

import TestimonialForm from "@/components/admin/TestimonialForm";
import { connectDB } from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

type EditTestimonialPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditTestimonialPage({ params }: EditTestimonialPageProps) {
  await connectDB();
  const { id } = await params;

  const testimonial = await Testimonial.findById(id).lean();
  if (!testimonial) {
    notFound();
  }

  return <TestimonialForm mode="edit" testimonial={serialize(testimonial)} />;
}
