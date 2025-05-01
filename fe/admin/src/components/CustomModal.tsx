import React, { ReactNode } from "react";
import { Modal } from "antd";
import styled from "../styles/customModal.module.scss";

interface CustomModalProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onCancel: () => void;
  footer?: ReactNode[];
}

const CustomModal: React.FC<CustomModalProps> = ({ open, title, children, onCancel, footer }) => {
  return (
    <Modal
      className={styled.modal}
      open={open}
      title={title}
      onCancel={onCancel}
      footer={
        footer ? (
          <div className={styled["custom-footer"]}>
            {footer.map((item, index) => (
              <div key={index}>{item}</div> // Thêm `key` cho mỗi phần tử trong footer
            ))}
          </div>
        ) : null
      }
      maskClosable={false}
      destroyOnClose={true}
      centered
    >
      {children}
    </Modal>
  );
};

export default CustomModal;
