import { Suspense } from "react";
import { PublicEntry } from "./publicEntry";

export const metadata = {
  title: "WeDid | 우리 결혼, 얼마나 들까?",
  description: "결혼 조건을 입력하고 예상 비용과 준비 로드맵을 미리 확인하세요.",
};

export default function Home() {
  return (
    <Suspense>
      <PublicEntry />
    </Suspense>
  );
}
