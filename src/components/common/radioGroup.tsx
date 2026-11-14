"use client";

import { useId } from "react";
import styles from "./common.module.css";
import type { SelectOption } from "./select";

type RadioGroupProps = {
  name: string;
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  direction?: "vertical" | "horizontal";
};

export function RadioGroup({
  direction = "vertical",
  label,
  name,
  onChange,
  options,
  value,
}: RadioGroupProps) {
  const groupId = useId();

  return (
    <fieldset className={styles.radioGroup}>
      {label && <legend className={styles.field__label}>{label}</legend>}
      <div className={styles[`radioGroup--${direction}`]}>
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <label className={styles.radioOption} htmlFor={optionId} key={option.value}>
              <input
                checked={value === option.value}
                className={styles.radioOption__control}
                disabled={option.disabled}
                id={optionId}
                name={name}
                onChange={() => onChange?.(option.value)}
                type="radio"
                value={option.value}
              />
              <span>{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
