import React, { useRef } from "react";
import styles from "../styles/otpInput.module.scss";
import { useLocation } from "react-router";

interface OTPInputProps {
  length: number;
  email: string;
  onsubmit: (data: { email: string; otp: string }) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, email, onsubmit }) => {
  const location = useLocation();
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === " ") {
      e.preventDefault();
    }
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    target.value = target.value.replace(/[^0-9]/g, ""); // Chỉ giữ lại số
  };

  const handleVerify = () => {
    const otp = inputRefs.current.map((input) => input.value).join("");
    const data = { email, otp };
    onsubmit(data);
  };

  return (
    <div className={styles["otp-input-container"]}>
      <div className={styles["otp-inputs"]}>
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            ref={(el) => {
              if (el) inputRefs.current[index] = el;
            }}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onInput={handleInput}
            className={styles["otp-input__box"]}
          />
        ))}
      </div>
      <button className={styles["otp-btn"]} type="button" onClick={handleVerify}>
        Kiểm tra
      </button>
    </div>
  );
};

export default OTPInput;
