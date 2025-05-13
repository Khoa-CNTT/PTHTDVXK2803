import CustomLink from "./CustomLink";
import style from "../styles/linkList.module.scss";
import { LinkListProps } from "../types/props";
const LinkList: React.FC<LinkListProps> = ({ linkList }) => {
  return (
    <ul className={style["link-list"]}>
      {linkList.map((item, index) => (
        <li className={style["link-item"]} key={index}>
          <CustomLink title={item.title} to={item.to} href={item.href} />
        </li>
      ))}
    </ul>
  );
};

export default LinkList;
