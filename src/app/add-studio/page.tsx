import type { Metadata } from "next";
import HostStudios from "@/components/host-studios";

export const metadata: Metadata = {
  title: "Add New Studio | JUPITAR STUDIO",
};

export default function AddStudioPage() {
  return <HostStudios mode="add" />;
}
