import { Suspense } from "react";
import EditStudioForm from "@/components/edit-studio-form";

export const metadata = {
  title: "Edit Studio | JUPITAR STUDIO",
};

type Props = {
  params: Promise<{ id: string }>;
};

async function Editor({ params }: Props) {
  const { id } = await params;
  return <EditStudioForm key={id} id={id} />;
}

export default function EditStudioPage({ params }: Props) {
  return (
    <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="studio-heading text-5xl uppercase sm:text-7xl">
        Edit Studio
      </h1>

      <Suspense fallback={<p className="animate-pulse py-8">Loading studio…</p>}>
        <Editor params={params} />
      </Suspense>
    </main>
  );
}
