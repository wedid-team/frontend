import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { initialAnswers, unknownGuestCount } from "./model.ts";

const hook = registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(
      specifier === "./model" && context.parentURL === new URL("./plannerDraft.ts", import.meta.url).href
        ? "./model.ts"
        : specifier,
      context,
    );
  },
});
const { toPlannerDraft } = await import("./plannerDraft.ts");
hook.deregister();

const answers = {
  ...initialAnswers,
  region: "부산",
  guests: "200~250명",
  timing: "date",
  date: "2028-01-01",
  budget: "3500",
  budgetUnknown: false,
  moods: ["그리너리", "클래식"],
};

test("정확한 예식일 또는 연월과 나머지 조건을 로드맵에 전달한다", () => {
  assert.deepEqual(toPlannerDraft(answers, "premium"), {
    conditions: { regionLabel: "부산", guestLabel: "하객 200~250명", moods: ["그리너리", "클래식"] },
    weddingDate: { kind: "exact", date: "2028-01-01" },
    budget: 3500,
    sdmTier: "premium",
  });
  const monthly = toPlannerDraft({ ...answers, timing: "month", year: "2028", month: "01" }, "basic");
  assert.deepEqual(monthly.weddingDate, { kind: "month", year: 2028, month: 1 });
  assert.equal(monthly.sdmTier, "basic");
});

test("미정 조건에 이전 숫자와 날짜를 사용하지 않고 미완성 답변으로 계획을 만들지 않는다", () => {
  const draft = toPlannerDraft(
    { ...answers, guests: unknownGuestCount, timing: "unknown", budgetUnknown: true },
    "luxury",
  );
  assert.equal(draft.conditions.guestLabel, null);
  assert.deepEqual(draft.weddingDate, { kind: "undecided" });
  assert.equal(draft.budget, null);
  assert.equal(toPlannerDraft(initialAnswers, "standard"), null);
  assert.equal(toPlannerDraft({ ...answers, budget: "" }, "standard"), null);
});
