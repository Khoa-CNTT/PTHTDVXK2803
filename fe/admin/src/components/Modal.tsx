import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "../styles/modal.module.scss";

const modalRoot = document.getElementById("modal-root");

type ModalProp = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ isOpen, onClose, children }: ModalProp) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles["modal-overlay"]}>
      <div ref={modalRef} className={styles["modal-content"]}>
        <button type="button" className={styles["close-btn"]} onClick={onClose}>
          X
        </button>
        {children}
      </div>
    </div>,
    modalRoot!
  );
};

export default Modal;
