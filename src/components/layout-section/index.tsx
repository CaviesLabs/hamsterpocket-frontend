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
        `md:pl-[30px] md:pr-[30px] md:max-w-[1440px] sm:px-6 min-h-[70vh] pt-16 px-[12px] md:px-0 mobile:h-full`
      )}
    >
      {props.children}
    </div>
  );
};
