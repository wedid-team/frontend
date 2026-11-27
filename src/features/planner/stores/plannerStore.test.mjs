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
hook.deregister();

test("새 계획과 진행 상태를 저장하고 복원해도 다시 저장하지 않는다", async (t) => {
  const store = usePlannerStore;
  const entries = new Map();
  const key = "wedidUtPlannerPlan";
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
    if (previousWindow) Object.defineProperty(globalThis, "window", previousWindow);
    else delete globalThis.window;
  });

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
  assert.equal(saved.todos.some(({ isDone }) => isDone), false);

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
