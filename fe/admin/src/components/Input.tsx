import React, { forwardRef } from "react";
import styled from "../styles/input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  idHTML?: string;
  type?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  onValueChange?: (valueChange: string) => void;
  onFocus?: (event: React.FocusEvent) => void;
}
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ idHTML, type = "text", value, placeholder = "...", onValueChange }, ref) => {
    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      if (onValueChange) {
        onValueChange(inputValue);
      }
    };
    return (
      <>
        <input
          id={idHTML}
          className={styled["input-search"]}
          type={type}
          ref={ref}
          value={value}
          onChange={onChangeInput}
          placeholder={placeholder}
          // onFocus={handleFocus}
        />
      </>
    );
  }
);

export default Input;
