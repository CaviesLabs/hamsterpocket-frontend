import { FC, MouseEvent, useCallback, useState, useMemo } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { WhitelistEntity } from "@/src/entities/whitelist.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { SuccessTransactionModal } from "@/src/components/success-modal.component";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { useAptosWallet } from "@/src/hooks/useAptos";

export const ReversePocketModal: FC<{
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
  pocket: PocketEntity;
}> = (props) => {
  const { whiteLists, findEntityByAddress } = useWhiteList();

  /** @dev Inject propgram service to use. */
  const { programService } = useWallet();

  /** @dev Process boolean. */
  const [loading, setLoading] = useState(false);

  /** @dev Define variable presenting for successful pocket close. */
  const [succcessClose, setSuccessClosed] = useState(false);

  const { closePositionPocket: closePositionPocketEvm } = useEvmWallet();
  const { reversePocket: reversePocketAptos } = useAptosWallet();
  const { walletAddress } = useAppWallet();
  const { chainId } = usePlatformConfig();

  /** @dev Get base token database on address. */
  const baseToken = useMemo<WhitelistEntity>(
    () =>
      whiteLists[props.pocket.baseTokenAddress] ||
      findEntityByAddress(props.pocket.baseTokenAddress),
    [props, chainId, walletAddress]
  );

  /** @dev The function to handle close pocket. */
  const handleReversePocket = useCallback(async () => {
    try {
      if (!walletAddress) throw new Error("Wallet not connected.");

      /** @dev Disable UX interaction when processing. */
      setLoading(true);

      if (chainId === ChainId.sol) {
        /** @dev Execute transaction. */
        await programService.closePocket(props.pocket);
      } else if (chainId.includes("aptos")) {
        await reversePocketAptos(
          props.pocket.id,
          props.pocket.baseTokenAddress,
          props.pocket.targetTokenAddress
        );
      } else {
        await closePositionPocketEvm(props.pocket);
      }

      /** @dev Callback function when close successfully. */
      setSuccessClosed(true);
    } catch (err) {
      console.log("Error", { err });
    } finally {
      setLoading(false);
    }
  }, [programService, props.pocket, chainId]);

  return (
    <Modal
      open={props.isModalOpen}
      onOk={props.handleOk}
      onCancel={props.handleCancel}
      width={600}
      footer={null}
      className="hamster-modal"
    >
      <div className="py-6">
        <div className="mx-auto max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex flex-col justify-center">
          <img
            src="/assets/images/close-pocket.svg"
            alt="Close pocket"
            className="mx-auto"
          />

          <h2 className="mt-4 mb-2 font-bold text-white text-2xl text-center">
            Reverse to {baseToken?.symbol}
          </h2>
          <p className="mb-2 regular-text text-white text-[16px] text-center">
            Confirm the transaction to reverse funds from Pocket{" "}
            <span className="text-green">
              #{props.pocket?.id || props.pocket?._id}
            </span>
          </p>
          <Button
            shape="primary"
            size="large"
            onClick={handleReversePocket}
            text="Reverse Pocket"
            className="mb-3"
            loading={loading}
            theme={{
              backgroundColor: "#735CF7",
              color: "#FFFFFF",
            }}
          />
          <Button
            shape="primary"
            size="large"
            onClick={() => {
              props.handleCancel();
            }}
            text="Cancel"
            className="mb-3 !border-solid !border-purple300 !border-[2px]"
            theme={{
              backgroundColor: "transparent",
              color: "#735CF7",
              hoverColor: "#735CF7",
            }}
          />
        </div>
      </div>
      <SuccessTransactionModal
        isModalOpen={succcessClose}
        handleOk={() => props.handleOk()}
        handleCancel={() => props.handleOk()}
        message={`You have reverse your funds from Pocket: ${props.pocket.id}`}
        okMessage="Done"
      />
    </Modal>
  );
};
