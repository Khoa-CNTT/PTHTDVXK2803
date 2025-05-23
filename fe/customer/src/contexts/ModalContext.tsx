// ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalContextType = {
  modalStack: string[];
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  closeAll: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalStack, setModalStack] = useState<string[]>([]);

  const openModal = (id: string) => {
    setModalStack((prev) => [...prev, id]);
  };

  const closeModal = (id: string) => {
    setModalStack((prev) => prev.filter((mid) => mid !== id));
  };

  const closeAll = () => {
    setModalStack([]);
  };

  return (
    <ModalContext.Provider value={{ modalStack, openModal, closeModal, closeAll }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
