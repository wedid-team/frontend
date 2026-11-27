"use client";

/** 로드맵 05 예식일 정하기 팝업 (E-15: 이번 달 ~ 2년 뒤) */
import { Button, RadioCardGroup, Select, TextField } from "@/src/components/common";
import { useMemo, useState } from "react";
import { Dialog } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import { usePlannerStore } from "../../planner/stores/plannerStore";
import styles from "./roadmap.module.css";

type Mode = "exact" | "month";

function toIsoDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function WeddingDateModal({ onClose, open }: { open: boolean; onClose: () => void }) {
  const current = usePlannerStore((state) => state.weddingDate);
  const setWeddingDate = usePlannerStore((state) => state.setWeddingDate);

  const today = useMemo(() => new Date(), []);
  const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxDate = new Date(today.getFullYear() + 2, today.getMonth() + 1, 0);
  const years = [today.getFullYear(), today.getFullYear() + 1, today.getFullYear() + 2];

  const [mode, setMode] = useState<Mode>(current.kind === "exact" ? "exact" : "month");
  const [exactDate, setExactDate] = useState(current.kind === "exact" ? current.date : "");
  const [year, setYear] = useState(
    current.kind === "month" ? current.year : today.getFullYear() + 1,
  );
  const [month, setMonth] = useState(
    current.kind === "month" ? current.month : today.getMonth() + 1,
  );

  const isMonthInRange = (y: number, m: number) => {
    const value = y * 12 + m;
    return (
      value >= minDate.getFullYear() * 12 + minDate.getMonth() + 1 &&
      value <= maxDate.getFullYear() * 12 + maxDate.getMonth() + 1
    );
  };
  const canSave = mode === "exact" ? Boolean(exactDate) : isMonthInRange(year, month);

  const save = () => {
    if (!canSave) return;
    setWeddingDate(
      mode === "exact" ? { kind: "exact", date: exactDate } : { kind: "month", year, month },
    );
    onClose();
  };

  return (
    <Dialog labelledBy="wedding-date-title" onClose={onClose} open={open}>
      <h2 className={ui.dialog__title} id="wedding-date-title">
        예식일 정하기
      </h2>
      <p className={ui.dialog__description}>예식일을 바꾸면 단계 일정과 D-day가 다시 계산돼요.</p>

      <div className={styles.dateModes}>
        <RadioCardGroup
          label="예식일 정하는 방법"
          name="wedding-date-mode"
          onChange={(value) => setMode(value as Mode)}
          options={[
            { value: "exact", label: "날짜가 정해졌어요" },
            { value: "month", label: "대략적인 달만 정했어요" },
          ]}
          value={mode}
        />
      </div>

      {mode === "exact" ? (
        <div className={styles.dateField}>
          <TextField
            aria-label="예식 날짜"
            max={toIsoDate(maxDate)}
            min={toIsoDate(minDate)}
            onChange={(event) => setExactDate(event.target.value)}
            type="date"
            value={exactDate}
          />
        </div>
      ) : (
        <div className={styles.dateSelects}>
          <Select
            aria-label="연도"
            onChange={(event) => setYear(Number(event.target.value))}
            options={years.map((item) => ({ label: String(item), value: String(item) }))}
            value={String(year)}
          />
          <Select
            aria-label="월"
            onChange={(event) => setMonth(Number(event.target.value))}
            options={Array.from({ length: 12 }, (_, index) => index + 1).map((item) => ({
              label: `${item}월`,
              value: String(item),
              disabled: !isMonthInRange(year, item),
            }))}
            value={String(month)}
          />
        </div>
      )}

      <div className={ui.dialog__actions}>
        <Button size="lg" variant="outline" onClick={onClose}>
          취소
        </Button>
        <Button size="lg" variant="primary" disabled={!canSave} onClick={save}>
          저장하기
        </Button>
      </div>
    </Dialog>
  );
}
