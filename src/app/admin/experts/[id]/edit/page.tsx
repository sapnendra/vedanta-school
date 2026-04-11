import { notFound } from "next/navigation";

import ExpertForm from "@/components/admin/ExpertForm";
import { connectDB } from "@/lib/mongodb";
import Expert from "@/models/Expert";

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

type EditExpertPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditExpertPage({ params }: EditExpertPageProps) {
  await connectDB();
  const { id } = await params;

  const expert = await Expert.findById(id).lean();
  if (!expert) {
    notFound();
  }

  return <ExpertForm mode="edit" expert={serialize(expert)} />;
}
