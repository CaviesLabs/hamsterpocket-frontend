import { FC, useMemo } from "react";
import { Dropdown, Input } from "antd";
import { DropdownSelectProps } from "./types";
import { ChevronDownIcon } from "@/src/components/icons";
import classnames from "classnames";

export const DropdownSelect: FC<DropdownSelectProps> = (props) => {
  return (
    <Dropdown
      overlayStyle={{ height: "40px" }}
      className={classnames("!bg-dark90", props.className)}
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
                className="w-full px-4 py-2 text-sm text-gray-700 text-center relative left-[-10px] regular-text !text-dark10"
                onClick={() => props.handleSelectValue(data?.value || data)}
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
        <div className="h-52 overflow-scroll">{menu}</div>
      )}
    >
      <div className="flex items-center w-40 rounded-[16px]">
        <Input
          disabled={true}
          bordered={false}
          className="text-center !text-dark10 focus:ring-0 text-center regular-text rounded-[16px] !h-[56px]"
          value={useMemo(
            () => (props.format ? props.format(props.value) : props.value),
            [props.value]
          )}
          onChange={(e) => props.handleSelectValue(e.target.value)}
        />
        <ChevronDownIcon className="w-5 text-gray-500 mr-3" />
      </div>
    </Dropdown>
  );
};
