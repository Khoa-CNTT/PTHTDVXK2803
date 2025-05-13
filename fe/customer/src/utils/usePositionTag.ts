import { useCallback, useEffect } from "react";

const usePositionTag = (
  ref: React.RefObject<HTMLDivElement>,
  nameAnchorTop: string,
  nameAnchorLeft: string
) => {
  const updatePositionHotlineTrigger = useCallback(() => {
    let top: number = Number(ref.current?.offsetTop);
    let left: number = Number(ref.current?.offsetLeft);
    let parent: HTMLElement | null =
      ref.current?.offsetParent instanceof HTMLElement ? ref.current?.offsetParent : null;

    while (parent instanceof HTMLElement) {
      top += parent.offsetTop;
      left += parent.offsetLeft;
      parent = parent.offsetParent instanceof HTMLElement ? parent.offsetParent : null;
    }
    document.documentElement.style.setProperty(nameAnchorTop, `${top}px`);
    document.documentElement.style.setProperty(nameAnchorLeft, `${left}px`);
  }, [ref, nameAnchorTop, nameAnchorLeft]);

  useEffect(() => {
    updatePositionHotlineTrigger();
    window.addEventListener("resize", updatePositionHotlineTrigger);
    return () => window.removeEventListener("resize", updatePositionHotlineTrigger);
  }, [updatePositionHotlineTrigger]);
};

export default usePositionTag;
