import { notFound } from "next/navigation";

import SeminarForm from "@/components/admin/SeminarForm";
import { connectDB } from "@/lib/mongodb";
import Seminar from "@/models/Seminar";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

type EditSeminarPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditSeminarPage({ params }: EditSeminarPageProps) {
  await connectDB();
  const { id } = await params;

  const seminar = await Seminar.findById(id).lean();
  if (!seminar) {
    notFound();
  }

  return <SeminarForm mode="edit" seminar={serialize(seminar)} />;
}
