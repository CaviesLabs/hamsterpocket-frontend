import { FC, MouseEvent, useCallback, useState } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";
import { PocketEntity, PocketStatus } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { SuccessTransactionModal } from "@/src/components/success-modal.component";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";

export const ClosePocketModal: FC<{
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
  closed?: boolean;
  pocket: PocketEntity;
  withdrawFnc?: boolean;
}> = (props) => {
  /** @dev Inject propgram service to use. */
  const { programService, solanaWallet } = useWallet();

  /** @dev Process boolean. */
  const [loading, setLoading] = useState(false);

  /** @dev Define variable presenting for successful pocket close. */
  const [succcessClose, setSuccessClosed] = useState(false);

  const { closePocket: closePocketEvm, withdrawPocket: withdrawPocketEvm } =
    useEvmWallet();
  const { chain, walletAddress } = useAppWallet();

  /** @dev The function to handle close pocket. */
  const handleClosePocket = useCallback(async () => {
    try {
      if (!walletAddress) throw new Error("Wallet not connected.");

      /** @dev Disable UX interaction when processing. */
      setLoading(true);

      if (chain === "SOL") {
        /** @dev Execute transaction. */
        await programService.closePocket(solanaWallet, props.pocket);
      } else {
        if (props.pocket.status === PocketStatus.CLOSED) {
          await withdrawPocketEvm(props.pocket.id || props.pocket._id);
        } else {
          await closePocketEvm(props.pocket.id || props.pocket._id);
        }
      }

      /** @dev Callback function when close successfully. */
      setSuccessClosed(true);
    } catch (err) {
      console.log("Error", { err });
    } finally {
      setLoading(false);
    }
  }, [programService, solanaWallet, props.pocket, chain]);

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
            {props?.pocket?.status === PocketStatus.CLOSED
              ? "Withdraw"
              : "Close"}
          </h2>
          <p className="mb-2 regular-text text-white text-[16px] text-center">
            Confirm the transaction to{" "}
            {props?.pocket?.status === PocketStatus.CLOSED
              ? "withdraw"
              : "close "}{" "}
            Pocket{" "}
            <span className="text-green">
              #{props.pocket?.id || props.pocket?._id}
            </span>
          </p>
          <Button
            shape="primary"
            size="large"
            onClick={handleClosePocket}
            text={
              props?.pocket?.status === PocketStatus.CLOSED
                ? "Withdraw Pocket"
                : "Close Pocket"
            }
            className="mb-3"
            loading={loading}
            theme={{
              backgroundColor: "#B998FB",
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
            className="mb-3 !border-solid !border-purple !border-[2px]"
            theme={{
              backgroundColor: "transparent",
              color: "#B998FB",
              hoverColor: "#B998FB",
            }}
          />
        </div>
      </div>
      <SuccessTransactionModal
        isModalOpen={succcessClose}
        handleOk={() => props.handleOk()}
        handleCancel={() => props.handleOk()}
        message={`You have withdrawn your funds from Pocket ${props.pocket.id}`}
        okMessage="Done"
      />
    </Modal>
  );
};
