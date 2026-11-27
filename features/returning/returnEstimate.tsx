"use client";

import { guestRanges, moodOptions, regionsForSavedPlan } from "../mocks/weddingOptions";
import { defaultSdmTier, tierRanges } from "../sdm/sdmData";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  useReturnPlan,
  useReturnReady,
  type Conditions,
  conditionsDefault,
  estimateVenue,
  venueBudgetFor,
  steps,
} from "./returnPlan";
import { s } from "./returnUi";
import { money, range } from "../venues/venueData";

function EstimateForm({ edit }: { edit: boolean }) {
  const existing = useReturnPlan((state) => state.conditions);
  const setConditions = useReturnPlan((state) => state.setConditions);
  const [conditions, setDraft] = useState<Conditions>(
    edit ? existing : { month: "", region: "", guests: "", budget: "", mood: "" },
  );
  const [question, setQuestion] = useState(0);
  const router = useRouter();
  const keys = ["month", "region", "guests", "budget", "mood"] as const;
  const titles = [
    "언제 예식을 올릴 예정인가요?",
    "어느 지역에서 예식을 올릴 예정인가요?",
    "하객은 몇 명 정도 예상하나요?",
    "전체 예산은 얼마인가요?",
    "어떤 분위기의 예식을 원하나요?",
  ];
  const key = keys[question];
  const choices =
    key === "region"
      ? regionsForSavedPlan(edit ? existing.region : "")
      : key === "mood"
        ? moodOptions
        : key === "guests"
          ? guestRanges
          : null;
  if (question === keys.length) {
    const venue = estimateVenue(conditions);
    const [sdmMin, sdmMax] = tierRanges[defaultSdmTier];
    return (
      <section className={s.question}>
        <p className={s.eyebrow}>새 계획 초안</p>
        <h1>우리 결혼 예상 비용</h1>
        <p>
          {conditions.month} · {conditions.region} · 하객 {conditions.guests}명 · {conditions.mood}
        </p>
        <dl className={s.draftAmounts}>
          <div>
            <dt>예식장</dt>
            <dd>{venueBudgetFor(conditions)}</dd>
          </div>
          <div>
            <dt>스드메</dt>
            <dd>{range(sdmMin, sdmMax)}</dd>
          </div>
          <div>
            <dt>예상 총 비용</dt>
            <dd>{range(venue[0] + sdmMin, venue[1] + sdmMax)}</dd>
          </div>
          <div>
            <dt>설정한 예산</dt>
            <dd>{money(Number(conditions.budget))}</dd>
          </div>
        </dl>
        <details className={s.calculation}>
          <summary>새 준비 로드맵 보기</summary>
          <ol>
            {steps.map((item) => (
              <li key={item.id}>
                {item.title} · {item.timing}
              </li>
            ))}
          </ol>
        </details>
        <div className={s.actions}>
          <button className={s.button} onClick={() => setQuestion(0)}>
            조건 다시 입력
          </button>
          <Link className={s.primary} href="/home">
            기존 계획으로 돌아가기
          </Link>
        </div>
      </section>
    );
  }
  const value = conditions[key];
  function update(value: string) {
    setDraft((draft) => ({ ...draft, [key]: value }));
  }
  return (
    <section className={s.question}>
      <p className={s.eyebrow}>
        {edit ? "조건 수정" : "새 계획"} · 질문 {question + 1} / {keys.length}
      </p>
      <h1>{titles[question]}</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!value || (key === "budget" && Number(value) < 1)) return;
          if (question === keys.length - 1 && edit) {
            setConditions(conditions);
            router.push("/budget");
          } else setQuestion(question + 1);
        }}
      >
        <label>
          {key === "budget" ? "전체 예산 (만 원)" : titles[question]}
          {choices ? (
            <select required value={value} onChange={(event) => update(event.target.value)}>
              <option value="">선택해 주세요</option>
              {choices.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          ) : (
            <input
              required
              type={key === "month" ? "month" : "number"}
              min={key === "budget" ? 1 : undefined}
              max={key === "budget" ? 1000000 : undefined}
              value={value}
              onChange={(event) => update(event.target.value)}
              placeholder={key === "budget" ? conditionsDefault.budget : undefined}
            />
          )}
        </label>
        <div className={s.actions}>
          {question > 0 ? (
            <button className={s.button} type="button" onClick={() => setQuestion(question - 1)}>
              이전
            </button>
          ) : (
            <Link className={s.button} href={edit ? "/budget" : "/"}>
              취소
            </Link>
          )}
          <button type="submit" className={s.primary}>
            {question === keys.length - 1 ? (edit ? "조건 저장하기" : "예상 비용 보기") : "다음"}
          </button>
        </div>
      </form>
    </section>
  );
}

export function ReturnEstimate() {
  const edit = useSearchParams().get("mode") === "edit";
  const ready = useReturnReady();
  return ready ? (
    <EstimateForm key={String(edit)} edit={edit} />
  ) : (
    <p role="status">계획을 불러오는 중이에요.</p>
  );
}
