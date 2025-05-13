import React from "react";
import { Link } from "react-router";
import styled from "../styles/link.module.scss";
import { CustomLinkProps } from "../types/props";

const CustomLink: React.FC<CustomLinkProps> = ({ className, to, href, title, children }) => {
  if (!children && !title) {
    return null;
  } else {
    if (to) {
      return (
        <Link className={`${styled.link} ${className}`} to={to}>
          {children || title}
        </Link>
      );
    }
    if (href) {
      return (
        <a className={`${styled.link} ${className}`} href={href} target="_blank" rel="noopener">
          {children || title}
        </a>
      );
    }
  }
};

export default CustomLink;
