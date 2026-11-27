"use client";

/** 단계 06 할 일 추가 (C-02 · R-09 최대 40자 · P-07 담당 나/짝꿍/함께) */
import { Button, Select, TextField } from "@/src/components/common";
import { useState } from "react";
import { PlusIcon } from "../../planner/components/icons";
import { ASSIGNEE_LABEL, Dialog, cx } from "../../planner/components/ui";
import ui from "../../planner/components/ui.module.css";
import { STEP_DEFINITIONS, isStepId } from "../../planner/mocks/plannerMock";
import { usePlannerStore } from "../../planner/stores/plannerStore";
import type { Assignee, StepId } from "../../planner/types";
import styles from "./step.module.css";

const TODO_MAX_LENGTH = 40;
const ASSIGNEES: Assignee[] = ["me", "partner", "together"];

export function AddTodoModal({
  defaultStepId,
  onClose,
  open,
}: {
  open: boolean;
  onClose: () => void;
  defaultStepId: StepId;
}) {
  const addTodo = usePlannerStore((state) => state.addTodo);
  const [stepId, setStepId] = useState<StepId>(defaultStepId);
  const [title, setTitle] = useState("");
  const [assignee, setAssignee] = useState<Assignee>("me");
  const canSubmit = title.trim().length > 0;

  const close = () => {
    setTitle("");
    onClose();
  };

  return (
    <Dialog labelledBy="add-todo-title" onClose={close} open={open}>
      <h2 className={ui.dialog__title} id="add-todo-title">
        할 일 추가
      </h2>
      <form
        className={styles.todoForm}
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) return;
          addTodo({ stepId, title, assignee });
          close();
        }}
      >
        <Select
          id="todo-step"
          label="단계"
          onChange={(event) => isStepId(event.target.value) && setStepId(event.target.value)}
          options={STEP_DEFINITIONS.map((step) => ({
            label: `${step.order}. ${step.title}`,
            value: step.id,
          }))}
          value={stepId}
        />

        <TextField
          hint={`${title.length}/${TODO_MAX_LENGTH}`}
          id="todo-title"
          label="내용"
          maxLength={TODO_MAX_LENGTH}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="예: 부모님께 후보 공유"
          value={title}
        />

        <fieldset className={styles.todoForm__fieldset}>
          <legend className={ui.fieldLabel}>담당</legend>
          <div className={ui.segmented}>
            {ASSIGNEES.map((option) => (
              <button
                aria-pressed={assignee === option}
                className={cx(
                  ui.segmented__option,
                  assignee === option && ui["segmented__option--selected"],
                )}
                key={option}
                onClick={() => setAssignee(option)}

                type="button"
              >
                {ASSIGNEE_LABEL[option]}
              </button>
            ))}
          </div>
        </fieldset>

        <Button
          size="lg"
          variant="primary"
          className={ui.fullWidth}
          disabled={!canSubmit}
          type="submit"
        >
          <PlusIcon size={16} />
          추가하기
        </Button>
      </form>
    </Dialog>
  );
}
