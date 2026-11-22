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
  assumedGuestRange,
  conditionLabel,
  createSharedEstimateUrl,
  increaseBudgetInput,
  isValidBudget,
  parseBudgetInput,
  readSharedEstimate,
  unknownGuestCount,
} from "./model.ts";
import { getMockEstimate } from "./mockEstimate.ts";

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

test("하객 미정은 가정값을 표시하고 선택한 하객 수와 구분한다", () => {
  const unknown = { ...initialAnswers, region: "서울 강남권 외", guests: unknownGuestCount };
  const selected = { ...unknown, guests: assumedGuestRange };
  assert.match(conditionLabel(unknown), /하객 수 미정 \(150~200명 기준\)/);
  assert.match(conditionLabel(selected), /하객 150~200명/);
  assert.equal(getMockEstimate(unknown, "standard").conditions.guests, unknownGuestCount);
  assert.equal(getMockEstimate(selected, "standard").conditions.guests, assumedGuestRange);
  assert.equal(
    getMockEstimate(unknown, "standard").totalRange,
    getMockEstimate(selected, "standard").totalRange,
  );
});

test("공유 링크의 조건은 별도 스냅샷으로 검증하며 기존 링크도 읽을 수 있다", () => {
  const own = {
    ...initialAnswers,
    region: "경기",
    guests: "300명 이상",
    moods: ["클래식"],
    budget: "3000",
    budgetUnknown: false,
    date: "2027-10-15",
    year: "2027",
    month: "10",
  };
  const payload = { answers: own, tier: "premium", sharedAt: "2026-11-15T00:00:00.000Z" };
  const snapshot = readSharedEstimate(JSON.stringify(payload));
  assert.deepEqual(snapshot.answers, {
    ...initialAnswers,
    region: own.region,
    guests: own.guests,
    moods: own.moods,
  });
  assert.equal(snapshot.sharedAt.toISOString(), payload.sharedAt);
  snapshot.answers.moods.push("화사한");
  assert.deepEqual(own.moods, ["클래식"]);
  assert.equal(
    readSharedEstimate(JSON.stringify({ answers: own, tier: "standard" })).sharedAt,
    null,
  );
  assert.equal(readSharedEstimate(JSON.stringify({ ...payload, tier: "invalid" })), null);
  assert.equal(readSharedEstimate(JSON.stringify({ ...payload, answers: {} })), null);
  assert.equal(readSharedEstimate("invalid JSON"), null);
});

test("공유 URL에는 화면에서 사용하는 값과 선택된 날짜 형식만 담긴다", () => {
  const own = {
    ...initialAnswers,
    region: "경기",
    guests: "300명 이상",
    date: "2027-10-15",
    year: "2027",
    month: "11",
    budget: "3000",
    budgetUnknown: false,
  };
  const sharedAt = new Date("2026-11-15T00:00:00.000Z");
  for (const [timing, dateFields] of [
    ["unknown", {}],
    ["date", { date: own.date }],
    ["month", { year: own.year, month: own.month }],
  ]) {
    const answers = { ...own, timing };
    const url = new URL(
      createSharedEstimateUrl("https://wedid.test/?private=1", answers, "standard", sharedAt),
    );
    const plan = url.searchParams.get("plan");
    assert.deepEqual([...url.searchParams.keys()], ["screen", "plan"]);
    assert.deepEqual(JSON.parse(plan), {
      answers: { region: own.region, guests: own.guests, moods: [], timing, ...dateFields },
      tier: "standard",
      sharedAt: sharedAt.toISOString(),
    });
    assert.deepEqual(readSharedEstimate(plan).answers, {
      ...initialAnswers,
      region: own.region,
      guests: own.guests,
      timing,
      ...dateFields,
    });
  }
});

test("스탠다드 단품 합산은 각 항목 범위의 합이고 예산대 예시 범위와 구분된다", () => {
  const standard = getMockEstimate(initialAnswers, "standard");
  assert.equal(
    standard.stylingBreakdown.total.min,
    standard.stylingBreakdown.items.reduce((sum, item) => sum + item.min, 0),
  );
  assert.equal(
    standard.stylingBreakdown.total.max,
    standard.stylingBreakdown.items.reduce((sum, item) => sum + item.max, 0),
  );
  assert.deepEqual(standard.stylingBreakdown.total, { min: 255, max: 320 });
  assert.equal(standard.stylingRange, "250만 ~ 350만원");
  for (const tier of ["basic", "premium", "luxury"]) {
    assert.equal(getMockEstimate(initialAnswers, tier).stylingBreakdown, null);
  }
});
