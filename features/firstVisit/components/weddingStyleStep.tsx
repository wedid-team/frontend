import { CheckboxCardGroup } from "@/src/components/common";
import type { CSSProperties } from "react";
import { assets } from "../assets";
import { moodOptions, selectMoods, type WeddingAnswers } from "../model";
import { FlowIcon } from "./flowUi";
import { QuestionField } from "./questionLayout";
import styles from "./question.module.css";

export function WeddingStyleStep({
  answers,
  updateAnswers,
}: {
  answers: WeddingAnswers;
  updateAnswers: (patch: Partial<WeddingAnswers>) => void;
}) {
  return (
    <QuestionField
      number="Q5 · 선택"
      title="원하는 예식장 분위기가 있나요?"
      description="여러 개 골라도 돼요. 없으면 [상관없어요]를 눌러 주세요."
    >
      <div
        className={styles.moodChoices}
        role="group"
        aria-label="예식장 분위기"
        style={{ "--checkmarkImage": `url("${assets.images.checkmark}")` } as CSSProperties}
      >
        <CheckboxCardGroup
          name="moods"
          options={moodOptions}
          value={answers.moods}
          onChange={(next) => updateAnswers({ moods: selectMoods(answers.moods, next) })}
        />
      </div>
      <p className={styles.moodNote}>
        <FlowIcon icon={assets.icons.sparkle} />
        고른 분위기는 예식장 후보 순서에만 반영돼요. 예상 비용 계산에는 쓰지 않아요.
      </p>
    </QuestionField>
  );
}
