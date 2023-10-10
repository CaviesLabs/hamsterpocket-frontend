import { FC, MouseEvent, useCallback, useState } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { SuccessTransactionModal } from "@/src/components/success-modal.component";

export const ClaimFeeModal: FC<{
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
  pocket: PocketEntity;
}> = (props) => {
  /** @dev Inject propgram service to use. */
  const { programService } = useWallet();

  /** @dev Process boolean. */
  const [loading, setLoading] = useState(false);

  /** @dev Define variable presenting for successful pocket close. */
  const [succcessClose, setSuccessClosed] = useState(false);

  /** @dev The function to handle close pocket. */
  const handleClaimFee = useCallback(async () => {
    try {
      if (!programService) throw new Error("Wallet not connected.");

      /** @dev Disable UX interaction when processing. */
      setLoading(true);

      /** @dev Execute transaction. */
      await programService.claimPocketFee(props.pocket);

      /** @dev Callback function when close successfully. */
      setSuccessClosed(true);
    } catch (err) {
      console.log("Error", { err });
    } finally {
      setLoading(false);
    }
  }, [programService, props.pocket]);

  return (
    <Modal
      width={600}
      footer={null}
      onOk={props.handleOk}
      open={props.isModalOpen}
      onCancel={props.handleCancel}
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
            Claim Fee
          </h2>
          <p className="mb-2 regular-text text-white text-[16px] text-center">
            To claim the fee, please confirm the transaction. Once you've
            claimed the fee, the associated data will be removed from our
            database.
            <span className="text-green">{props.pocket.id}</span>
          </p>
          <Button
            shape="primary"
            size="large"
            onClick={handleClaimFee}
            text="Claim Fee"
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
        message={
          <>
            You have claimed{" "}
            <a
              target="_blank"
              className="text-purple300"
              href="https://docs.solana.com/developing/intro/rent"
            >
              the rent
            </a>{" "}
            for pocket {props.pocket.id}
          </>
        }
        okMessage="Done"
      />
    </Modal>
  );
};
