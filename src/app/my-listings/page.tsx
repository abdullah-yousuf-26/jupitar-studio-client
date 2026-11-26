import type { Metadata } from "next";
import HostStudios from "@/components/host-studios";

export const metadata: Metadata = {
  title: "My Studio Listings | JUPITAR STUDIO",
};

export default function MyListingsPage() {
  return <HostStudios mode="list" />;
}

