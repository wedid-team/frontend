import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { initialAnswers } from "./model.ts";

// Node의 타입 제거 모드에서도 앱의 확장자 없는 TypeScript import를 로드한다.
const hook = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      specifier === "./model" &&
      context.parentURL === new URL("./store.ts", import.meta.url).href
    ) {
      return nextResolve("./model.ts", context);
    }
    return nextResolve(specifier, context);
  },
});
const { useFirstVisitStore } = await import("./store.ts");
hook.deregister();

test("잘못된 예산을 전달해도 현재 값과 세션에 저장된 예산을 교체하지 않는다", (t) => {
  const entries = new Map();
  const before = Object.getOwnPropertyDescriptor(globalThis, "window");
  t.after(() => {
    if (before) Object.defineProperty(globalThis, "window", before);
    else delete globalThis.window;
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      sessionStorage: {
        getItem: (key) => entries.get(key) ?? null,
        setItem: (key, value) => entries.set(key, value),
        removeItem: (key) => entries.delete(key),
      },
    },
  });
  const store = useFirstVisitStore;
  store.setState({ answers: initialAnswers });
  store.getState().updateAnswers({ budget: "3000", budgetUnknown: false });
  const original = entries.get("wedidFirstVisitDraft");
  assert.equal(JSON.parse(original).state.answers.budget, "3000");
  for (const budget of ["100.5", "-500", "99", "1000000000"]) {
    store.getState().updateAnswers({ budget, budgetUnknown: false });
    assert.equal(store.getState().answers.budget, "3000");
    assert.equal(entries.get("wedidFirstVisitDraft"), original);
  }
});

test("세션 저장소 접근이 막혀도 복원이 완료되고 현재 탭의 입력을 유지한다", async (t) => {
  const before = Object.getOwnPropertyDescriptor(globalThis, "window");
  t.after(() => {
    if (before) Object.defineProperty(globalThis, "window", before);
    else delete globalThis.window;
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      get sessionStorage() {
        throw new DOMException("저장소 차단", "SecurityError");
      },
    },
  });
  const store = useFirstVisitStore;
  store.setState({ answers: initialAnswers });
  await store.persist.rehydrate();
  assert.equal(store.persist.hasHydrated(), true);
  store.getState().updateAnswers({ budget: "4500", budgetUnknown: false });
  await store.persist.rehydrate();
  assert.equal(store.getState().answers.budget, "4500");
});
