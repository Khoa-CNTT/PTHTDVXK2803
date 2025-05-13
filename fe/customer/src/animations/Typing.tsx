import { useEffect, useState } from "react";
import style from "../styles/modules/animations/Typing.module.scss";

interface TypingProps {
  contentArr?: string[];
  title?: string;
}

const Typing = ({ contentArr = [], title }: TypingProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (contentArr.length === 0) return;

    // Cập nhật nội dung bằng biến CSS
    document.documentElement.style.setProperty("--content", `"${contentArr[currentIndex]}"`);

    // Cập nhật chữ sau mỗi 4 giây
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % contentArr.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [contentArr, currentIndex]);

  return (
    <div className={`${style["animated-text"]}`}>
      {title} <span className={style.content}></span>
    </div>
  );
};

export default Typing;
