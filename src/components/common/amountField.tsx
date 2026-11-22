"use client";

import type { InputHTMLAttributes } from "react";
import { TextField } from "./textField";

type AmountFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  unit?: string;
};

export function AmountField({
  id,
  inputMode = "numeric",
  label,
  unit = "만 원",
  ...inputProps
}: AmountFieldProps) {
  return (
    <TextField
      {...inputProps}
      id={id}
      inputMode={inputMode}
      label={label}
      suffix={unit}
      type="text"
    />
  );
}
