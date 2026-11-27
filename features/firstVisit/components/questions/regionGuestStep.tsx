import { Select, RadioCardGroup } from "@/src/components/common";
import { assets } from "../../assets";
import { guestOptions, regionOptions, type WeddingAnswers } from "../../model";
import { FlowIcon } from "../layout/flowUi";
import { QuestionField } from "./questionLayout";
import styles from "./question.module.css";

export function RegionGuestStep({
  answers,
  updateAnswers,
}: {
  answers: WeddingAnswers;
  updateAnswers: (patch: Partial<WeddingAnswers>) => void;
}) {
  return (
    <>
      <QuestionField
        number="Q1"
        title="어디에서 결혼식을 올릴 예정인가요?"
        description="지역마다 예식장, 스드메 가격이 달라요."
      >
        <div className={styles.regionSelect}>
          <Select
            aria-label="예식 지역"
            placeholder="지역을 선택해 주세요"
            options={regionOptions}
            value={answers.region}
            onChange={(event) => updateAnswers({ region: event.target.value })}
            required
          />
          <FlowIcon icon={assets.icons.selectChevron} className={styles.selectChevron} />
        </div>
        <p className={styles.fieldNote}>참가격 결혼서비스 통계의 14개 권역 기준이에요.</p>
      </QuestionField>
      <QuestionField
        number="Q2"
        title="하객은 몇 명 정도 예상하나요?"
        description="잘 모르겠으면 대략적으로 골라도 괜찮아요."
      >
        <div className={styles.guestChoices} role="group" aria-label="하객 수">
          <RadioCardGroup
            name="guests"
            value={answers.guests}
            options={guestOptions}
            onChange={(guests) => updateAnswers({ guests })}
          />
        </div>
      </QuestionField>
    </>
  );
}
