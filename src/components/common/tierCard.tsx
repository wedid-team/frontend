"use client";

import { useId } from "react";
import styles from "./common.module.css";

export type TierCardOption = {
  label: string;
  value: string;
  amountRange: string;
  recommended?: boolean;
  disabled?: boolean;
};

type TierCardGroupProps = {
  name: string;
  label?: string;
  options: TierCardOption[];
  value: string;
  onChange: (value: string) => void;
};

export function TierCardGroup({ label, name, onChange, options, value }: TierCardGroupProps) {
  const groupId = useId();

  return (
    <fieldset className={styles.tierCardGroup}>
      {label && <legend className={styles.field__label}>{label}</legend>}
      <div className={styles.tierCardGroup__options}>
        {options.map((option, index) => {
          const checked = value === option.value;
          const classes = [
            styles.tierCard,
            checked && styles["tierCard--selected"],
            option.disabled && styles["tierCard--disabled"],
          ]
            .filter(Boolean)
            .join(" ");
          const optionId = `${groupId}-${index}`;

          return (
            <label className={classes} htmlFor={optionId} key={option.value}>
              {option.recommended && <span className={styles.tierCard__ribbon}>추천</span>}
              <input
                checked={checked}
                className={styles.tierCard__control}
                disabled={option.disabled}
                id={optionId}
                name={name}
                onChange={() => onChange(option.value)}
                type="radio"
                value={option.value}
              />
              <span className={styles.tierCard__content}>
                <span className={styles.tierCard__title}>{option.label}</span>
                <span className={styles.tierCard__range}>{option.amountRange}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
