"use client";

import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./common.module.css";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  suffix?: ReactNode;
};

export function TextField({
  "aria-describedby": externalDescribedBy,
  "aria-invalid": externalInvalid,
  className,
  disabled,
  error,
  hint,
  id,
  label,
  readOnly,
  suffix,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const message = error || hint;
  const messageId = message ? `${fieldId}-${error ? "error" : "hint"}` : undefined;
  const suffixId = suffix != null ? `${fieldId}-suffix` : undefined;
  const describedBy = [externalDescribedBy, messageId, suffixId].filter(Boolean).join(" ");
  const wrapperClasses = [
    styles.textInputWrap,
    error && styles["textInputWrap--error"],
    disabled && styles["textInputWrap--disabled"],
    readOnly && styles["textInputWrap--readOnly"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.field__label} htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className={wrapperClasses}>
        <input
          {...inputProps}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : externalInvalid}
          className={[styles.textInput, className].filter(Boolean).join(" ")}
          disabled={disabled}
          id={fieldId}
          readOnly={readOnly}
        />
        {suffix != null && (
          <span className={styles.textInput__suffix} id={suffixId}>
            {suffix}
          </span>
        )}
      </div>
      {message && (
        <span
          className={error ? styles.field__error : styles.field__hint}
          id={messageId}
          role={error ? "alert" : undefined}
        >
          {message}
        </span>
      )}
    </div>
  );
}
