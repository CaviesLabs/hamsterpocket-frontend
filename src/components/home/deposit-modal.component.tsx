import { FC, MouseEvent, useCallback, useMemo, useState } from "react";
import { Modal } from "antd";
import { Button } from "@hamsterbox/ui-kit";
import { CurrencyInput } from "@/src/components/currency-input";
import { PocketEntity } from "@/src/entities/pocket.entity";
import { useWallet } from "@/src/hooks/useWallet";
import { useEvmWallet } from "@/src/hooks/useEvmWallet";
import { useAppWallet } from "@/src/hooks/useAppWallet";
import { usePlatformConfig } from "@/src/hooks/usePlatformConfig";
import { ChainId } from "@/src/entities/platform-config.entity";
import { SuccessTransactionModal } from "@/src/components/success-modal.component";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { BN } from "@project-serum/anchor";
import { useAptosWallet } from "@/src/hooks/useAptos";
import { convertBigNumber as convertAptosNumber } from "@/src/utils/aptos.parser";
import { multipleBigNumber } from "@/src/utils/evm.parser";

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
  const { walletAddress } = useAppWallet();
  const { chainId } = usePlatformConfig();

  /** @dev Inject propgram service to use. */
  const { programService, solBalance } = useWallet();

  /** @dev Inject evm program service to use. */
  const {
    signer: evmSigner,
    nativeBalance: ethSolBalance,
    depositPocket: depositPocketEvm,
  } = useEvmWallet();

  /** @dev Inject aptos program service to use. */
  const { depositPocket: depositPocketAptos, balance: aptosBalance } =
    useAptosWallet();

  /** @dev Inject whitelist provider to use. */
  const {
    whiteLists,
    findEntityByAddress,
    convertDecimalAmount,
    analyzeDecimals,
  } = useWhiteList();

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

      if (chainId === ChainId.sol) {
        /** @dev Execute transaction. */
        await programService.depositPocket(props.pocket, depositedAmount);
      } else if (chainId.includes("aptos")) {
        console.log("deposit in aptos", depositedAmount);
        await depositPocketAptos(
          props.pocket.id,
          baseToken?.address,
          convertAptosNumber(
            depositedAmount.toNumber() / Math.pow(10, baseToken?.decimals),
            Math.pow(10, baseToken?.realDecimals)
          )
        );
      } else {
        console.log("depsit in evm");
        /** @dev Execute transaction. */
        await depositPocketEvm(
          props.pocket.id || props.pocket._id,
          BigInt(
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
  }, [programService, props.pocket, depositedAmount, chainId, evmSigner]);

  /** @dev Define base token **/
  const baseToken =
    whiteLists[pocket.baseTokenAddress] ||
    findEntityByAddress(pocket.baseTokenAddress);

  /** @dev Define the button text */
  const [buttonText, setButtonText] = useState<string>("Deposit");

  const baseBalance = convertDecimalAmount(pocket.baseTokenAddress, solBalance);

  const handleInputChange = (val: number) => {
    if (chainId === ChainId.sol) {
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
    setDepositedAmount(
      new BN(multipleBigNumber(val, Math.pow(10, baseToken?.decimals || 0)))
    );
  };

  const isDisabled = !isAmountSet || buttonText !== "Deposit";

  const renderBalance = useMemo(() => {
    if (chainId === ChainId.sol) {
      return analyzeDecimals(baseBalance);
    } else if (chainId.includes("aptos")) {
      return analyzeDecimals(aptosBalance);
    } else {
      return analyzeDecimals(parseFloat(ethSolBalance));
    }
  }, [chainId, solBalance, ethSolBalance, aptosBalance]);

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
              src={baseToken?.image}
              alt="token balance"
              className="w-6 mx-1 rounded"
            />
            {renderBalance}
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
              backgroundColor: isDisabled ? "gray" : "#735CF7",
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
          chainId === ChainId.sol
            ? depositedAmount?.toNumber() || 0
            : (depositedAmount?.toNumber() /
                Math.pow(10, baseToken?.decimals)) *
                Math.pow(10, baseToken?.realDecimals) || 0
        )} ${baseToken?.symbol}`}
        okMessage="Done"
      />
    </Modal>
  );
};
