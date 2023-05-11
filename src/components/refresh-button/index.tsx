import { SyncOutlined } from "@ant-design/icons";
import { Tooltip as AntdTooltip } from "antd";

type RefreshButtonProps = {
  handleClick: () => void;
  loading: boolean;
};

export const RefreshButton = (props: RefreshButtonProps) => {
  return (
    <AntdTooltip
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
        border: "solid 1px #735CF7",
      }}
    >
      <button
        className="relative ml-4 border-solid border-[1px] border-purple300 text-purple300 hover:text-white rounded-full px-4 py-2 flex items-center"
        onClick={props.handleClick}
      >
        <SyncOutlined spin={props.loading} style={{ fontSize: 18 }} />
        <p className="regular-text ml-4">Sync</p>
      </button>
    </AntdTooltip>
  );
};
