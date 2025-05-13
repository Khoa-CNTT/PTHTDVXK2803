import { forwardRef } from "react";
import styled from "../styles/contentHotline.module.scss";
import CustomLink from "./CustomLink";

interface ContentHotlineProps {
  show?: boolean;
}

const ContentHotLine = forwardRef<HTMLDivElement, ContentHotlineProps>(({ show = false }, ref) => {
  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
  };

  return (
    <div
      ref={ref}
      className={`${styled["content-hotline"]} ${show ? styled.show : ""}`}
      onClick={handleMouseDown}
    >
      <ul className={styled["list-hotline"]}>
        <li className={styled["item-hotline"]}>
          <CustomLink
            className={`${styled.phone} ${styled["font-size"]}`}
            to={"/"}
            title={"1900545541"}
          />{" "}
          <p className={`${styled.note} ${styled["font-size"]}`}>
            Để đặt dịch vụ thuê xe (Từ 07:00 - 21:00)
          </p>
        </li>
        <li className={styled["item-hotline"]}>
          <CustomLink
            className={`${styled.phone} ${styled["font-size"]}`}
            to={"/"}
            title={"1900969681"}
          />{" "}
          <p className={`${styled.note} ${styled["font-size"]}`}>
            Để phản hồi về dịch vụ và xử lý sự cố
          </p>
        </li>
        <li className={styled["item-hotline"]}>
          <CustomLink
            className={`${styled.phone} ${styled["font-size"]}`}
            to={"/"}
            title={"1900888684"}
          />{" "}
          <p className={`${styled.note} ${styled["font-size"]}`}>Để đặt vé qua điện thoại (24/7)</p>
        </li>
      </ul>
      <div className={styled.triangle}></div>
    </div>
  );
});

export default ContentHotLine;
