import { Pencil, Plus, Users } from "lucide-react";
import Link from "next/link";

/* eslint-disable @next/next/no-img-element */

import DeleteExpertButton from "@/components/admin/DeleteExpertButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { connectDB } from "@/lib/mongodb";
import Expert from "@/models/Expert";

type ExpertRow = {
  _id: string;
  name: string;
  title: string;
  credentials: string[];
  yearsMonk: number;
  livesHelped: number;
  seminars: number;
  imageUrl: string;
  isActive: boolean;
};

const serialize = (doc: unknown) => JSON.parse(JSON.stringify(doc));

export default async function AdminExpertsPage() {
  await connectDB();
  const experts = await Expert.find().sort({ createdAt: -1 }).lean();
  const data = serialize(experts) as ExpertRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl text-white font-heading">Experts</h1>
        <Button asChild className="bg-saffron text-charcoal hover:bg-gold">
          <Link href="/admin/experts/new" className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Expert
          </Link>
        </Button>
      </div>

      {data.length === 0 ? (
        <Card className="border-saffron/10 bg-[#14110d]">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-white/55">
            <Users className="h-8 w-8 text-saffron" />
            <p className="text-sm [font-family:var(--font-poppins)]">No experts yet</p>
            <Button asChild variant="outline">
              <Link href="/admin/experts/new">Add first expert</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.map((expert) => {
            const visibleCredentials = expert.credentials.slice(0, 3);
            const extraCredentials = Math.max(0, expert.credentials.length - 3);

            return (
              <Card key={expert._id} className="border-saffron/10 bg-[#14110d]">
                <CardHeader className="items-center text-center">
                  <img
                    src={expert.imageUrl}
                    alt={expert.name}
                    className="h-20 w-20 rounded-full border-2 border-saffron/30 object-cover"
                  />
                  <h3 className="mt-3 text-lg text-white font-heading">{expert.name}</h3>
                  <p className="text-sm text-white/60 [font-family:var(--font-poppins)]">{expert.title}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {visibleCredentials.map((credential) => (
                      <Badge key={credential} className="border-saffron/20 bg-saffron/10 text-xs text-saffron">
                        {credential}
                      </Badge>
                    ))}
                    {extraCredentials > 0 ? (
                      <Badge className="border-saffron/20 bg-saffron/10 text-xs text-saffron">+{extraCredentials} more</Badge>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs text-white/55 [font-family:var(--font-poppins)]">
                    <div>{expert.yearsMonk}y monk</div>
                    <div>{expert.livesHelped} helped</div>
                    <div>{expert.seminars} seminars</div>
                  </div>

                  <div>
                    {expert.isActive ? (
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/20">Active</Badge>
                    ) : (
                      <Badge className="bg-white/10 text-white/60 border-white/20">Inactive</Badge>
                    )}
                  </div>
                </CardContent>

                <div className="flex items-center justify-between px-6 pb-6">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/admin/experts/${expert._id}/edit`} className="inline-flex items-center gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <DeleteExpertButton expertId={expert._id} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
