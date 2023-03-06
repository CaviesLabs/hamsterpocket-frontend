import { FC, MouseEvent, useCallback, useState } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { SuccessTransactionModal } from "@/src/components/success-modal.component";

export const PausePocketModal: FC<{
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
  pocket: PocketEntity;
}> = (props) => {
  /** @dev Inject propgram service to use. */
  const { programService, solanaWallet } = useWallet();

  /** @dev Process boolean. */
  const [loading, setLoading] = useState(false);

  /** @dev Define variable presenting for successful pocket close. */
  const [succcessClose, setSuccessClosed] = useState(false);

  /** @dev The function to handle close pocket. */
  const handleClosePocket = useCallback(async () => {
    try {
      if (!programService) throw new Error("Wallet not connected.");

      /** @dev Disable UX interaction when processing. */
      setLoading(true);

      /** @dev Execute transaction. */
      await programService.pausePocket(solanaWallet, props.pocket);

      /** @dev Callback function when close successfully. */
      setSuccessClosed(true);
    } catch (err) {
      console.log("Error", { err });
    } finally {
      setLoading(false);
    }
  }, [programService, solanaWallet, props.pocket]);

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
            src="/assets/images/pause-pocket.svg"
            alt="Close pocket"
            className="mx-auto"
          />

          <h2 className="mt-4 mb-2 font-bold text-white text-2xl text-center">
            Pause
          </h2>
          <p className="mb-2 regular-text text-white text-[16px] text-center">
            Confirm the transaction to pause Pocket{" "}
            <span className="text-green">{props.pocket.id}</span>
          </p>
          <Button
            shape="primary"
            size="large"
            onClick={handleClosePocket}
            text="Close pocket"
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
              console.log("can");
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
        message={`You have paused pocket ${props.pocket.id}`}
        okMessage="Done"
      />
    </Modal>
  );
};
