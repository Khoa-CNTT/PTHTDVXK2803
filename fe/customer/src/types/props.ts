import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface InputDropDownProps {
  searchTitle?: string;
  name: string;
  list: string[];
  contentPlaceholder?: string;
  valueIn?: string;
  location?: string;
  onSelected?: (selected: string) => void; //  Định nghĩa kiểu prop
  onChangeValue?: (value: string) => void;
}

export interface InputProps {
  type?: string;
  name: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  onChange?: (valueChange: string) => void;
  onFocus?: (focused: boolean) => void;
}

export interface CustomLinkProps {
  className?: string;
  to?: string;
  href?: string;
  title?: string;
  children?: React.ReactNode;
}

export interface LinkItem {
  title?: string;
  to: string;
  href?: string;
}

export interface LinkListProps {
  linkList: LinkItem[];
}

export interface LogoProps {
  width?: number;
  height?: number;
  hidden?: boolean;
  icon?: IconDefinition;
  image?: string;
}

export interface SliderArrType {
  title: string;
  content: string;
  image: string;
}

export type SlidersProps = {
  title: string;
  listSlider: SliderArrType[];
};
