"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ClientForm } from "@/components/ClientForm";
import { getClient } from "@/lib/mockData";

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const client = getClient(id);

  if (!client) {
    return (
      <div className="py-16 text-center">
        <p className="text-headline-sm text-on-surface">Client not found</p>
        <Link
          href="/clients"
          className="mt-3 inline-block text-body-lg font-semibold text-primary hover:underline"
        >
          Back to Clients
        </Link>
      </div>
    );
  }

  return <ClientForm existing={client} />;
}
