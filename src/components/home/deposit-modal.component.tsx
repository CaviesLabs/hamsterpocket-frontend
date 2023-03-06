import { FC, MouseEvent, useCallback, useState } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";
import { CurrencyInput } from "@/src/components/currency-input";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { SuccessTransactionModal } from "@/src/components/success-modal.component";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { BN } from "@project-serum/anchor";

export const DepositModal: FC<{
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
  pocket: PocketEntity;
}> = (props) => {
  /** @dev Inject propgram service to use. */
  const { programService, solanaWallet } = useWallet();

  /** @dev Inject whitelist provider to use. */
  const { whiteLists, convertDecimalAmount } = useWhiteList();

  /** @dev Deposited amount. */
  const [depositedAmount, setDepositedAmount] = useState<BN>();

  /** @dev Process boolean. */
  const [loading, setLoading] = useState(false);

  /** @dev Define variable presenting for successful pocket close. */
  const [succcessModal, setSuccessModal] = useState(false);

  /** @dev The function to handle close pocket. */
  const handleDeposit = useCallback(async () => {
    try {
      if (!programService) throw new Error("Wallet not connected.");

      /** @dev Disable UX interaction when processing. */
      setLoading(true);

      /** @dev Execute transaction. */
      await programService.depositPocket(
        solanaWallet,
        props.pocket,
        depositedAmount
      );

      /** @dev Callback function when close successfully. */
      setSuccessModal(true);
    } catch (err) {
      console.log("Error", { err });
    } finally {
      setLoading(false);
    }
  }, [programService, solanaWallet, props.pocket, depositedAmount]);

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
            src="/assets/images/wallet.svg"
            alt="Deposit wallet"
            className="mx-auto"
          />

          <h2 className="mt-4 mb-2 font-bold text-white text-2xl text-center">
            Deposit
          </h2>
          <p className="mb-2 font-bold text-white text-[16px] text-center">
            Please enter amount to deposit
          </p>
          <CurrencyInput
            addressSelected={props.pocket.baseTokenAddress}
            disableDropdown={true}
            inputClassName="gray-input !bg-[#353C4B]"
            onAmountChange={(val) => {
              console.log(whiteLists[props.pocket.baseTokenAddress]?.decimals);
              setDepositedAmount(
                new BN(
                  val *
                    Math.pow(
                      10,
                      whiteLists[props.pocket.baseTokenAddress]?.decimals || 0
                    )
                )
              );
            }}
          />
          <Button
            shape="primary"
            size="large"
            onClick={handleDeposit}
            text="Deposit"
            className="my-3"
            loading={loading}
            theme={{
              backgroundColor: "#B998FB",
              color: "#FFFFFF",
            }}
          />
        </div>
      </div>
      <SuccessTransactionModal
        isModalOpen={succcessModal}
        handleOk={() => props.handleOk()}
        handleCancel={() => props.handleOk()}
        message={`You have deposited ${convertDecimalAmount(
          props.pocket.baseTokenAddress,
          depositedAmount?.toNumber()
        )} ${whiteLists[props.pocket.baseTokenAddress]?.symbol}`}
        okMessage="Done"
      />
    </Modal>
  );
};
