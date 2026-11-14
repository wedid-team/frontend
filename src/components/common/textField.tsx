"use client";

import { useId, type InputHTMLAttributes } from "react";
import styles from "./common.module.css";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
};

export function TextField({ error, hint, id, label, ...inputProps }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const message = error ?? hint;
  const messageId = message ? `${fieldId}-message` : undefined;

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.field__label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <input
        aria-describedby={messageId}
        aria-invalid={Boolean(error)}
        className={styles.textInput}
        id={fieldId}
        {...inputProps}
      />
      {message && (
        <span className={error ? styles.field__error : styles.field__hint} id={messageId}>
          {message}
        </span>
      )}
    </div>
  );
}
