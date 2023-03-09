import { SyncOutlined } from "@ant-design/icons";
import { Tooltip as AntdTooltip } from "antd";

type RefreshButtonProps = {
  handleClick: () => void;
  loading: boolean;
};

export const RefreshButton = (props: RefreshButtonProps) => {
  return (
    <AntdTooltip
      color="rgba(18, 19, 27, 0.9506)"
      placement="bottom"
      title="Click button to refresh the displayed data"
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
      <button
        className="relative ml-4 bg-dark90 text-dark40 hover:text-white rounded-full px-4 py-2 flex items-center"
        onClick={props.handleClick}
      >
        <SyncOutlined spin={props.loading} style={{ fontSize: 18 }} />
        <p className="font-normal ml-4">Refresh</p>
      </button>
    </AntdTooltip>
  );
};
