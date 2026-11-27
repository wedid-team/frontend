import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { STEP_IDS, getStepDefinition, isStepId } from "@/src/features/planner/mocks/plannerMock";
import { StepView } from "@/src/features/step/components/stepView";

export function generateStaticParams() {
  return STEP_IDS.map((stepId) => ({ stepId }));
}

export async function generateMetadata({
  params,
}: PageProps<"/roadmap/[stepId]">): Promise<Metadata> {
  const { stepId } = await params;
  return { title: isStepId(stepId) ? `${getStepDefinition(stepId).title} | WEDID` : "WEDID" };
}

/** 주소(params)를 읽는 부분만 따로 떼서 Suspense 안에 둔다 → 페이지 틀은 클릭 즉시 보이고 내용이 이어서 채워진다 */
async function StepContent({ params }: { params: PageProps<"/roadmap/[stepId]">["params"] }) {
  const { stepId } = await params;
  if (!isStepId(stepId)) notFound();
  return <StepView stepId={stepId} />;
}

export default function StepPage({ params }: PageProps<"/roadmap/[stepId]">) {
  return (
    <Suspense fallback={<div aria-busy="true" style={{ minHeight: "60vh" }} />}>
      <StepContent params={params} />
    </Suspense>
  );
}
