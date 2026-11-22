import assert from "node:assert/strict";
import test from "node:test";
import {
  initialAnswers,
  selectMoods,
  hasRegionAnswers,
  hasTimingAnswers,
  sanitizeAnswers,
  timingLabel,
  daysUntilWedding,
  increaseBudgetInput,
  isValidBudget,
  parseBudgetInput,
} from "./model.ts";

test("지역은 필수이고 하객 수 미정은 유효하다", () => {
  assert.equal(hasRegionAnswers({ ...initialAnswers, guests: "아직 모르겠어요" }), false);
  assert.equal(
    hasRegionAnswers({ ...initialAnswers, region: "서울 강남권 외", guests: "아직 모르겠어요" }),
    true,
  );
});

test("상관없어요와 개별 분위기는 함께 선택될 수 없다", () => {
  assert.deepEqual(selectMoods(["화사한", "클래식"], ["화사한", "클래식", "상관없어요"]), [
    "상관없어요",
  ]);
  assert.deepEqual(selectMoods(["상관없어요"], ["상관없어요", "그리너리"]), ["그리너리"]);
  assert.deepEqual(selectMoods(["화사한"], []), []);
});

test("시기/예산 미정을 허용하고 선택한 날짜와 금액은 검증한다", () => {
  assert.equal(hasTimingAnswers(initialAnswers), true);
  assert.equal(
    hasTimingAnswers({ ...initialAnswers, timing: "month", year: "2027", month: "" }),
    false,
  );
  for (const month of ["1.5", "1e1", "0", "13"]) {
    assert.equal(
      hasTimingAnswers({ ...initialAnswers, timing: "month", year: "2027", month }),
      false,
    );
    assert.equal(
      daysUntilWedding({ ...initialAnswers, timing: "month", year: "2027", month }, new Date()),
      null,
    );
  }
  assert.equal(hasTimingAnswers({ ...initialAnswers, timing: "date", date: "2027-02-30" }), false);
  assert.equal(hasTimingAnswers({ ...initialAnswers, timing: "date", date: "2028-02-29" }), true);
  assert.equal(hasTimingAnswers({ ...initialAnswers, budgetUnknown: false, budget: "0" }), false);
  assert.equal(hasTimingAnswers({ ...initialAnswers, budgetUnknown: false, budget: "3000" }), true);
});

test("모드를 미정으로 바꾸면 이전 날짜를 결과와 D-day에 쓰지 않는다", () => {
  const answers = { ...initialAnswers, date: "2027-10-10", year: "2027", month: "10" };
  assert.equal(timingLabel(answers), "시기 미정");
  assert.equal(daysUntilWedding(answers, new Date("2026-11-23T12:00:00")), null);
  assert.equal(
    daysUntilWedding({ ...answers, timing: "date" }, new Date("2027-10-09T23:59:00")),
    1,
  );
});

test("손상된 저장 정보와 공유 정보에서 허용하지 않은 값을 제거한다", () => {
  const answers = sanitizeAnswers({
    region: "bad",
    guests: 200,
    timing: "anything",
    budget: "3,000",
    budgetUnknown: false,
    moods: ["화사한", "화사한", "bad"],
  });
  assert.equal(answers.region, "");
  assert.equal(answers.guests, "");
  assert.equal(answers.timing, "unknown");
  assert.equal(answers.budget, "3000");
  assert.deepEqual(answers.moods, ["화사한"]);
  assert.deepEqual(sanitizeAnswers(null), initialAnswers);
});

test("예산은 올바른 쉼표와 앞뒤 공백을 허용하고 100만 원부터 저장할 수 있다", () => {
  assert.deepEqual(parseBudgetInput(" 3,000 "), { amount: "3000" });
  assert.deepEqual(parseBudgetInput("100"), { amount: "100" });
  assert.deepEqual(parseBudgetInput(""), { amount: null });
  for (const low of ["0", "50", "99"]) {
    assert.deepEqual(parseBudgetInput(low), {
      amount: null,
      error: "100만 원 이상으로 입력해 주세요",
    });
  }
  assert.equal(isValidBudget(""), false);
  assert.equal(hasTimingAnswers({ ...initialAnswers, budget: "99", budgetUnknown: false }), false);
  assert.equal(hasTimingAnswers({ ...initialAnswers, budget: "100", budgetUnknown: false }), true);
  assert.equal(hasTimingAnswers(initialAnswers), true);
});

test("잘못된 예산 문자를 지우거나 자릿수를 잘라 다른 값으로 만들지 않는다", () => {
  for (const raw of ["100.5", "-500", "1e300", "1 000", "1,00", "3,000원", " ", "1000000000"]) {
    const { amount, error } = parseBudgetInput(raw);
    assert.equal(amount, null, raw);
    assert.ok(error, raw);
    assert.equal(sanitizeAnswers({ budget: raw }).budget, "", raw);
  }
  assert.deepEqual(parseBudgetInput("999,999,999"), { amount: "999999999" });
});

test("예산 빠른 입력은 올바른 숫자에만 더하고 잘못된 예산 원문을 그대로 둔다", () => {
  assert.equal(increaseBudgetInput("50", 500), "550");
  assert.equal(increaseBudgetInput("3,000", 500), "3,500");
  assert.equal(increaseBudgetInput("100.5", 500), "100.5");
  assert.equal(increaseBudgetInput("", 500), "500");
  assert.equal(parseBudgetInput(increaseBudgetInput("999,999,999", 500)).amount, null);
});
