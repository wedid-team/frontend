import { Suspense } from "react";
import { ReturnBudget } from "../../../../features/returning/returnBudget";

export default function Route() {
  return (
    <Suspense fallback={<p role="status">계획을 불러오는 중이에요.</p>}>
      <ReturnBudget />
    </Suspense>
  );
}
