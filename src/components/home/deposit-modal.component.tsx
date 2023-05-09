import { FC, MouseEvent, useCallback, useState } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";
import { CurrencyInput } from "@/src/components/currency-input";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { SuccessTransactionModal } from "@/src/components/success-modal.component";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { BN } from "@project-serum/anchor";
import { BigNumber } from "ethers";

export const DepositModal: FC<{
  isModalOpen: boolean;
  handleOk(e?: MouseEvent<HTMLElement>): void;
  handleCancel(e?: MouseEvent<HTMLElement>): void;
  isLoading?: boolean;
  pocket: PocketEntity;
}> = (props) => {
  /** @dev Get pocket data from props. */
  const { pocket } = props;

  /** @dev Inject app wallet hooks to get chain info. */
  const { chain, walletAddress } = useAppWallet();

  /** @dev Inject propgram service to use. */
  const { programService, solanaWallet, solBalance } = useWallet();

  /** @dev Inject evm program service to use. */
  const {
    nativeBalance: ethSolBalance,
    depositPocket: depositPocketEvm,
    signer: evmSigner,
  } = useEvmWallet();

  /** @dev Inject whitelist provider to use. */
  const { whiteLists, findEntityByAddress, convertDecimalAmount } =
    useWhiteList();

  /** @dev Deposited amount. */
  const [depositedAmount, setDepositedAmount] = useState<BN>();
  const [isAmountSet, setIsAmountSet] = useState<boolean>(false);

  /** @dev Process boolean. */
  const [loading, setLoading] = useState(false);

  /** @dev Define variable presenting for successful pocket close. */
  const [succcessModal, setSuccessModal] = useState(false);

  /** @dev The function to handle close pocket. */
  const handleDeposit = useCallback(async () => {
    try {
      if (!walletAddress) throw new Error("Wallet not connected.");
      /** @dev Disable UX interaction when processing. */
      setLoading(true);

      if (chain === "SOL") {
        /** @dev Execute transaction. */
        await programService.depositPocket(
          solanaWallet,
          props.pocket,
          depositedAmount
        );
      } else {
        console.log("depsit in evm");
        /** @dev Execute transaction. */
        await depositPocketEvm(
          props.pocket.id || props.pocket._id,
          BigNumber.from(
            (
              (depositedAmount.toNumber() / Math.pow(10, baseToken?.decimals)) *
              Math.pow(10, baseToken?.realDecimals)
            ).toString()
          )
        );
      }

      /** @dev Callback function when close successfully. */
      setSuccessModal(true);
    } catch (err) {
      console.log("Error", { err });
    } finally {
      setLoading(false);
    }
  }, [
    programService,
    solanaWallet,
    props.pocket,
    depositedAmount,
    chain,
    evmSigner,
  ]);

  /** @dev Define base token **/
  const baseToken =
    whiteLists[pocket.baseTokenAddress] ||
    findEntityByAddress(pocket.baseTokenAddress);

  /** @dev Define the button text */
  const [buttonText, setButtonText] = useState<string>("Deposit");

  const baseBalance = convertDecimalAmount(pocket.baseTokenAddress, solBalance);

  const handleInputChange = (val: number) => {
    if (chain === "SOL") {
      if (val < 0.05) {
        setButtonText(`Minimum deposit is 0.05 ${baseToken.symbol}`);
      } else if (val > baseBalance) {
        setButtonText(`Insufficient ${baseToken.symbol} balance`);
      } else {
        setButtonText("Deposit");
      }
    } else {
      setButtonText("Deposit");
    }
    setIsAmountSet(!isNaN(val));
    setDepositedAmount(new BN(val * Math.pow(10, baseToken?.decimals || 0)));
  };

  const isDisabled = !isAmountSet || buttonText !== "Deposit";

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
          <p className="mb-2 text-white text-[16px] text-center">
            Please enter amount to deposit
          </p>
          <CurrencyInput
            addressSelected={pocket.baseTokenAddress}
            disableDropdown={true}
            inputClassName="gray-input !bg-[#353C4B]"
            onAmountChange={(val) => handleInputChange(val)}
            placeholder={`Enter ${baseToken?.symbol} amount`}
          />
          <p className="my-4 text-white text-[16px] flex">
            Your balance:
            <img
              src={baseToken.image}
              alt="token balance"
              className="w-6 mx-1 rounded"
            />
            {chain === "SOL" ? baseBalance.toFixed(4) : ethSolBalance}{" "}
            {baseToken.symbol}
          </p>
          <Button
            shape="primary"
            size="large"
            onClick={handleDeposit}
            text={buttonText}
            className="my-3"
            loading={loading}
            theme={{
              backgroundColor: isDisabled ? "gray" : "#B998FB",
              color: "#FFFFFF",
            }}
            disabled={isDisabled}
          />
        </div>
      </div>
      <SuccessTransactionModal
        isModalOpen={succcessModal}
        handleOk={() => props.handleOk()}
        handleCancel={() => props.handleOk()}
        message={`You have deposited ${convertDecimalAmount(
          pocket.baseTokenAddress,
          chain === "SOL"
            ? depositedAmount?.toNumber()
            : (depositedAmount?.toNumber() /
                Math.pow(10, baseToken?.decimals)) *
                Math.pow(10, baseToken?.realDecimals)
        )} ${baseToken?.symbol}`}
        okMessage="Done"
      />
    </Modal>
  );
};
