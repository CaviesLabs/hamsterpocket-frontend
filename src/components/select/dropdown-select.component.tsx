import { FC, useEffect, useMemo, useState } from "react";
import { Dropdown } from "antd";
import { DropdownSelectProps } from "./types";
import { ChevronDownIcon } from "@/src/components/icons";
import classnames from "classnames";

export const DropdownSelect: FC<DropdownSelectProps> = (props) => {
  /**
   * @dev Local value.
   */
  const [currentValue, setCurrentValue] = useState("");

  /**
   * @dev Update local value with global value.
   */
  useEffect(() => setCurrentValue(props.value), [props.value]);

  /**
   * @dev Initilize default local value.
   */
  useEffect(() => {
    if (props.autoValue) {
      const slot: any = props.options[0];
      setCurrentValue(slot?.value || slot);
    }
  }, []);

  return (
    <Dropdown
      // overlayStyle={{ height: "63px" }}
      className={classnames(
        "!bg-dark100 h-[63px] mobile:!h-[40px]",
        props.className
      )}
      menu={{
        items: props.options.map((item) => {
          /**
           * @dev Validate whether item is object array or string array.
           */
          const data = item as any;
          return {
            key: data?.value || data,
            label: (
              <div
                className="w-full px-4 py-2 text-sm mobile:!text-[14px] text-gray-700 text-center relative left-[-10px] regular-text !text-dark10"
                onClick={() => {
                  const value = data?.value || data;
                  props.handleSelectValue(value);
                  setCurrentValue(value);
                }}
              >
                {data?.label || data?.value || data}
              </div>
            ),
          };
        }),
      }}
      trigger={["click"]}
      placement="bottom"
      dropdownRender={(menu) => (
        <div
          className={`no-scrollbar h-52 bg-[#20242D] ${
            props.options.length > 10 ? "overflow-scroll" : ""
          }`}
        >
          {menu}
        </div>
      )}
    >
      <div className="flex items-center w-full rounded-[16px] cursor-pointer">
        <div className="flex items-center justify-center text-center !text-dark10 focus:ring-0 text-center regular-text rounded-[16px] !h-[63px] w-full !text-[16px] mobile:!text-[14px]">
          {useMemo(() => {
            if (!props.autoValue) {
              if (props.format) {
                return props.format(props.value);
              } else if (typeof props.options[0] === "string") {
                return props.value;
              }
            }

            const cur = (props.options as any).find(
              (item: any) =>
                item.value === (props.autoValue ? currentValue : props.value)
            );
            return cur?.label || cur?.value;
          }, [props.value, currentValue])}
        </div>
        <ChevronDownIcon className="w-5 text-gray-500 mr-3" />
      </div>
    </Dropdown>
  );
};
