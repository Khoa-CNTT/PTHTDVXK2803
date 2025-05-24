import React, { ReactNode } from "react";
import { Modal } from "antd";

interface CustomModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onCancel: () => void;
  footer?: ReactNode[];
}

const CustomModal: React.FC<CustomModalProps> = ({ open, title, children, onCancel }) => {
  return (
    <Modal
      width={"fit-content"}
      open={open}
      title={title}
      onCancel={onCancel}
      footer={null}
      maskClosable={false}
      // getContainer={false}
      centered
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
