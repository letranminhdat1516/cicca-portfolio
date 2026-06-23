"use client";
import { useParams } from "next/navigation";
import { getEntity } from "@/lib/adminSchema";
import { EntityManager } from "@/components/admin/EntityManager";

export default function AdminModelPage() {
  const params = useParams<{ model: string }>();
  const schema = getEntity(params.model);

  if (!schema) {
    return <p className="text-[#ff2d9b]">Unknown section: {params.model}</p>;
  }
  return <EntityManager schema={schema} />;
}
