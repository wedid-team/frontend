import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

const hook = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && context.parentURL?.endsWith(".ts")) {
      return nextResolve(specifier + ".ts", context);
    }
    return nextResolve(specifier, context);
  },
});
const { usePlannerStore } = await import("./plannerStore.ts");
const { getNextStep, getProgressPercent, getSpentAmount } = await import("../utils/schedule.ts");
hook.deregister();

const key = "wedidUtPlannerPlan";

function mockPlanStorage(t) {
  const entries = new Map();
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (name) => entries.get(name) ?? null,
        setItem: (name, value) => entries.set(name, value),
        removeItem: (name) => entries.delete(name),
      },
    },
  });
  t.after(() => {
    usePlannerStore.setState(usePlannerStore.getInitialState(), true);
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else delete globalThis.window;
  });
  return entries;
}

test("새 계획과 진행 상태를 저장하고 복원해도 다시 저장하지 않는다", async (t) => {
  const store = usePlannerStore;
  const entries = mockPlanStorage(t);
  const initial = store.getInitialState();
  assert.equal(store.getState().hasSavedPlan, false);
  store.getState().loadScenario("complete", new Date());
  assert.equal(entries.has(key), false);

  const draft = {
    conditions: { regionLabel: "경기", guestLabel: null, moods: ["그리너리"] },
    weddingDate: { kind: "undecided" },
    budget: null,
    sdmTier: "premium",
  };
  await store.getState().savePlanIfMissing(draft, "google");
  const saved = JSON.parse(entries.get(key)).state;
  assert.equal(saved.budget, null);
  assert.deepEqual(saved.weddingDate, draft.weddingDate);
  assert.deepEqual(saved.conditions, draft.conditions);
  assert.equal(saved.me.loginProvider, "google");
  assert.equal(saved.partner, null);
  assert.deepEqual(saved.stepEstimates.sdm, { min: 350, max: 450 });
  assert.equal(saved.steps.agreement.status, "inProgress");
  assert.equal(
    saved.todos.some(({ isDone }) => isDone),
    false,
  );

  store.getState().completeStep("venue", 1700);
  store.getState().toggleTodo("t1");
  store.getState().setBudget(3500);
  const updated = entries.get(key);

  store.setState(initial, true);
  await store.persist.rehydrate();
  assert.equal(store.getState().hasSavedPlan, true);
  assert.equal(store.getState().budget, 3500);
  assert.equal(store.getState().steps.venue.actualAmount, 1700);
  assert.equal(store.getState().todos.find(({ id }) => id === "t1").isDone, true);

  store.setState(initial, true);
  await store.getState().savePlanIfMissing({ ...draft, budget: 9000 }, "kakao");
  store.getState().loadScenario("complete", new Date());
  assert.equal(store.getState().budget, 3500);
  assert.equal(store.getState().steps.venue.status, "complete");
  assert.equal(entries.get(key), updated);
});

test("예식장 선택을 복원하고 실제 계약 완료·수정·취소에만 지출을 반영한다", async (t) => {
  const store = usePlannerStore;
  const entries = mockPlanStorage(t);
  const read = store.getState;
  async function restore() {
    store.setState(store.getInitialState(), true);
    await store.persist.rehydrate();
  }

  assert.equal(read().selectVenue("aw-convention"), false);
  assert.equal(entries.has(key), false);
  await read().savePlanIfMissing(
    {
      conditions: {
        regionLabel: "서울 강남권 외",
        guestLabel: "하객 150~200명",
        moods: ["화사한"],
      },
      weddingDate: { kind: "undecided" },
      budget: 3500,
      sdmTier: "standard",
    },
    "kakao",
  );
  read().completeStep("agreement");

  const legacyPlan = JSON.parse(entries.get(key));
  delete legacyPlan.state.selectedVenueId;
  entries.set(key, JSON.stringify(legacyPlan));
  await restore();
  assert.equal(read().selectedVenueId, null);
  assert.equal(read().steps.agreement.status, "complete");

  assert.equal(read().selectVenue("aw-convention"), true);
  await restore();
  assert.equal(read().selectedVenueId, "aw-convention");
  assert.deepEqual(read().steps.venue, legacyPlan.state.steps.venue);
  assert.equal(getProgressPercent(read()), 17);
  assert.equal(getSpentAmount(read()), 0);
  assert.equal(read().budget, 3500);
  assert.equal(getNextStep(read()).id, "venue");

  read().completeStep("venue", 1975);
  await restore();
  assert.equal(read().steps.venue.actualAmount, 1975);
  assert.equal(read().steps.venue.status, "complete");
  assert.equal(read().budget - getSpentAmount(read()), 1525);
  assert.equal(getProgressPercent(read()), 33);
  assert.equal(getNextStep(read()).id, "sdm");

  read().updateAmount("venue", 2000);
  await restore();
  assert.equal(read().budget - getSpentAmount(read()), 1500);
  read().cancelComplete("venue");
  await restore();
  assert.equal(read().selectedVenueId, "aw-convention");
  assert.equal(read().steps.venue.status, "inProgress");
  assert.equal(read().steps.venue.actualAmount, 2000);
  assert.equal(getSpentAmount(read()), 0);
  assert.equal(getProgressPercent(read()), 17);
  assert.equal(getNextStep(read()).id, "venue");
});
