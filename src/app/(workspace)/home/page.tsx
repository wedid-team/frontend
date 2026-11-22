import { Suspense } from "react";
import { ReturnHome } from "../../../../features/returning/returnHome";

export default function Route() {
  return (
    <Suspense fallback={<p role="status">계획을 불러오는 중이에요.</p>}>
      <ReturnHome />
    </Suspense>
  );
}
