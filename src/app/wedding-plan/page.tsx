import type { Metadata } from "next";
import { WeddingPlanIntro } from "@/features/firstVisit/components/weddingPlanIntro";

export const metadata: Metadata = {
  title: "웨딩 플랜 | WeDid",
  description: "우리 결혼 예상 비용과 준비 로드맵을 확인해 보세요.",
};

export default function WeddingPlanPage() {
  return <WeddingPlanIntro />;
}
