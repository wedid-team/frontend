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
