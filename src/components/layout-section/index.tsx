import { FC, ReactNode } from "react";
import { ComponentProps } from "../types";
import styles from "@/styles/Home.module.css";
import classnames from "classnames";

export const LayoutSection: FC<ComponentProps & { children: ReactNode }> = (
  props
) => {
  return (
    <div
      className={classnames(
        styles.container,
        props.className,
        `mx-auto md:max-w-[1140px] sm:px-6 pt-[20px] min-h-[70vh] pt-16 px-[12px] md:px-0`
      )}
    >
      {props.children}
    </div>
  );
};
