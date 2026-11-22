"use client";

import { useId } from "react";
import styles from "./common.module.css";
import type { SelectOption } from "./select";

export type ChoiceCardOption = SelectOption & {
  description?: string;
};

type ChoiceCardGroupLayout = "vertical" | "horizontal";

type RadioCardGroupProps = {
  name: string;
  label?: string;
  options: ChoiceCardOption[];
  value: string;
  onChange: (value: string) => void;
  direction?: ChoiceCardGroupLayout;
};

type CheckboxCardGroupProps = {
  name: string;
  label?: string;
  options: ChoiceCardOption[];
  value: string[];
  onChange: (value: string[]) => void;
  direction?: ChoiceCardGroupLayout;
};

type ChoiceCardProps = {
  option: ChoiceCardOption;
  optionId: string;
  name: string;
  type: "radio" | "checkbox";
  checked: boolean;
  onChange: () => void;
};

function ChoiceCard({ checked, name, onChange, option, optionId, type }: ChoiceCardProps) {
  const classes = [
    styles.choiceCard,
    checked && styles["choiceCard--selected"],
    option.disabled && styles["choiceCard--disabled"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={classes} htmlFor={optionId}>
      <input
        checked={checked}
        className={styles.choiceCard__control}
        disabled={option.disabled}
        id={optionId}
        name={name}
        onChange={onChange}
        type={type}
        value={option.value}
      />
      <span className={styles.choiceCard__copy}>
        <span className={styles.choiceCard__title}>{option.label}</span>
        {option.description && (
          <span className={styles.choiceCard__description}>{option.description}</span>
        )}
      </span>
    </label>
  );
}

export function RadioCardGroup({
  direction = "vertical",
  label,
  name,
  onChange,
  options,
  value,
}: RadioCardGroupProps) {
  const groupId = useId();

  return (
    <fieldset className={styles.choiceCardGroup}>
      {label && <legend className={styles.field__label}>{label}</legend>}
      <div className={styles[`choiceCardGroup--${direction}`]}>
        {options.map((option, index) => (
          <ChoiceCard
            checked={value === option.value}
            key={option.value}
            name={name}
            onChange={() => onChange(option.value)}
            option={option}
            optionId={`${groupId}-${index}`}
            type="radio"
          />
        ))}
      </div>
    </fieldset>
  );
}

export function CheckboxCardGroup({
  direction = "vertical",
  label,
  name,
  onChange,
  options,
  value,
}: CheckboxCardGroupProps) {
  const groupId = useId();

  return (
    <fieldset className={styles.choiceCardGroup}>
      {label && <legend className={styles.field__label}>{label}</legend>}
      <div className={styles[`choiceCardGroup--${direction}`]}>
        {options.map((option, index) => {
          const checked = value.includes(option.value);

          return (
            <ChoiceCard
              checked={checked}
              key={option.value}
              name={name}
              onChange={() => {
                onChange(
                  checked
                    ? value.filter((selectedValue) => selectedValue !== option.value)
                    : [...value, option.value],
                );
              }}
              option={option}
              optionId={`${groupId}-${index}`}
              type="checkbox"
            />
          );
        })}
      </div>
    </fieldset>
  );
}
