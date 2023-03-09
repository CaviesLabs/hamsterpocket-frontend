import { FC, ReactNode } from "react";
import { Tooltip as AntdTooltip } from "antd";

export const TooltipPrimaryComponent: FC<{ children: ReactNode }> = (props) => {
  return (
    <AntdTooltip
      color="rgba(18, 19, 27, 0.9506)"
      placement="bottom"
      title="Choose progress bar follow by"
      className="ml-2 text-[12px]"
      overlayStyle={{
        maxWidth: 160,
        padding: 0,
      }}
      overlayInnerStyle={{
        fontSize: 12,
        textAlign: "center",
        padding: "20px 12px",
        border: "solid 1px rgba(255, 255, 255, 0.1985)",
      }}
    >
      {props.children}
    </AntdTooltip>
  );
};
