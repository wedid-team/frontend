import type { Metadata } from "next";
import { RoadmapView } from "@/src/features/roadmap/components/roadmapView";

export const metadata: Metadata = {
  title: "준비 로드맵 | WEDID",
};

export default function RoadmapPage() {
  return <RoadmapView />;
}
