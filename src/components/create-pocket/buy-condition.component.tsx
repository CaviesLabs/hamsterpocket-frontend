import { FC, useEffect, useMemo } from "react";
import { Button, Input } from "@hamsterbox/ui-kit";
import { PlusIcon, DeleteIconCircle } from "@/src/components/icons";
import { PRICE_CONDITIONS } from "@/src/utils";
import { DropdownSelect } from "@/src/components/select";
import { PriceConditionType } from "@/src/entities/pocket.entity";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { BN } from "@project-serum/anchor";
import { ErrorLabel } from "@/src/components/error-label";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import UtilsProvider from "@/src/utils/utils.provider";
import { multipleBigNumber } from "@/src/utils/evm.parser";
import { Avatar } from "antd";

export const BuyCondition: FC<{
  buyConditionDisplayed: boolean;
  disabled?: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const {
    buyCondition,
    errorMsgs,
    createdEnable,
    targetTokenAddress,
    baseTokenAddress,
    batchVolume,
    setBuyCondition,
    setErrorMsgs,
  } = useCreatePocketPage();
  const { whiteLists } = useWhiteList();

  /** @dev Price */
  const isTwoValue = useMemo(
    () =>
      buyCondition?.type === PriceConditionType.BW ||
      buyCondition?.type === PriceConditionType.NBW,
    [buyCondition]
  );

  /**
   * @dev Initialize buy condition when click add condition button.
   */
  useEffect(() => {
    if (!props.buyConditionDisplayed) return;
    setBuyCondition({
      tokenAddress: targetTokenAddress[0]?.toBase58()?.toString(),
      type: PriceConditionType.GT,
      value: new BN(
        multipleBigNumber(0, Math.pow(10, targetTokenAddress?.[1]))
      ),
    });
  }, [props.buyConditionDisplayed]);

  /**
   * @dev Adjust changes.
   */
  useEffect(() => {
    if (isTwoValue === false && buyCondition?.fromValue !== undefined) {
      setBuyCondition({
        ...buyCondition,
        value: buyCondition.fromValue,
        fromValue: undefined,
        toValue: undefined,
      });
    }
    if (isTwoValue && buyCondition?.fromValue === undefined) {
      setBuyCondition({
        ...buyCondition,
        fromValue: new BN(0),
        toValue: buyCondition.value,
      });
    }
    (window as any).test = buyCondition;
  }, [isTwoValue, buyCondition]);

  return (
    <div className="mt-[24px] ">
      {/* animate={{ x: 0 }} initial={{ x: -100 }} */}
      <p className="text-dark10 text-[14px] regular-text">
        Buy at market price if
      </p>
      {errorMsgs?.buyCondition && createdEnable && (
        <ErrorLabel message={errorMsgs.buyCondition} />
      )}
      {!props.buyConditionDisplayed ? (
        <Button
          size="small"
          text="Add condition"
          className="!rounded-[100px] after:!rounded-[100px] !px-4 mt-[10px]"
          theme={{
            backgroundColor: "#7A6DFF",
            color: "#FFFFFF",
          }}
          icon={<PlusIcon />}
          onClick={props.toggle}
          disabled={props.disabled}
        />
      ) : (
        <div className="md:flex md:items-center mt-[16px] max-w-[100%]">
          <div className="md:mr-6 items-center flex">
            <button onClick={props.toggle} className="relative md:top-[4px]">
              <DeleteIconCircle className="mobile:hidden" />
            </button>
          </div>
          <div className="md:mr-6 relative flex items-center">
            <DeleteIconCircle
              className="md:hidden float-left mr-[5px] relative top-[3px]"
              size="34"
            />
            <p className="text-[14px] md:text-[16px] normal-text mt-[10px] text-white bold-text">
              Each batch {`(${UtilsProvider.formatLongNumber(batchVolume)}`}
            </p>
            <p className="text-[14px] md:text-[16px] normal-text mt-[10px] text-white bold-text ml-[3px]">
              {whiteLists[baseTokenAddress[0]?.toBase58()?.toString()]?.symbol}
            </p>
            <p className="text-[14px] md:text-[16px] normal-text mt-[10px] text-white bold-text ml-[3px]">
              ) can buy
            </p>
          </div>
          <div className="md:mr-6 mobile:mt-[16px]">
            <DropdownSelect
              handleSelectValue={(val) =>
                setBuyCondition({
                  ...buyCondition,
                  type: val as PriceConditionType,
                })
              }
              value={buyCondition?.type}
              options={PRICE_CONDITIONS}
              className="w-full min-w-[230px]"
            />
          </div>
          <div className="h-[63px] md:mr-6 relative flex items-center mobile:mt-[16px]">
            <Input
              containerClassName="app-input buy-condition w-52 !h-full"
              inputClassName="bg-dark90 !text-white w-full !h-full"
              placeholder={isTwoValue ? "from value" : "value"}
              onValueChange={(val) => {
                if (parseFloat(val) < 0) return;
                if (!isTwoValue) {
                  return setBuyCondition({
                    ...buyCondition,
                    value: new BN(
                      (parseFloat(val) || 0) *
                        Math.pow(10, targetTokenAddress?.[1])
                    ),
                  });
                }

                /** @dev Validate from value must be smaller from value. */
                const isError = () => {
                  if (!buyCondition.fromValue || !buyCondition.toValue)
                    return "Must enter from value and to value.";
                  if (
                    parseFloat(val) >=
                    buyCondition.toValue.toNumber() /
                      Math.pow(10, targetTokenAddress?.[1] || 0)
                  ) {
                    return "from value must be smaller than to value.";
                  }
                  return "";
                };

                /** @dev Raise error if having incorrect valid. */
                setErrorMsgs({ ...errorMsgs, buyCondition: isError() });

                /** @dev Set from value. */
                setBuyCondition({
                  ...buyCondition,
                  fromValue: new BN(
                    (parseFloat(val) || 0) *
                      Math.pow(10, targetTokenAddress?.[1])
                  ),
                });
              }}
            />
            {isTwoValue && (
              <>
                <p className="text-white mx-[5px] mobile:text-[14px] relative mobile:top-[-8px]">
                  Or
                </p>
                <Input
                  containerClassName="app-input buy-condition w-[110px] !h-full"
                  inputClassName="bg-dark90 !text-white w-full !h-full"
                  placeholder="to value"
                  onValueChange={(val) => {
                    /** @dev Validate from value must be smaller from value. */
                    const isError = () => {
                      if (!buyCondition.fromValue || !buyCondition.toValue)
                        return "Must enter from value and to value.";
                      if (
                        parseFloat(val) <=
                        buyCondition.fromValue.toNumber() /
                          Math.pow(10, targetTokenAddress?.[1] || 0)
                      ) {
                        return "from value must be smaller than to value.";
                      }
                      return "";
                    };

                    /** @dev Raise error if having incorrect valid. */
                    setErrorMsgs({ ...errorMsgs, buyCondition: isError() });
                    setBuyCondition({
                      ...buyCondition,
                      toValue: new BN(
                        (parseFloat(val) || 0) *
                          Math.pow(10, targetTokenAddress?.[1])
                      ),
                    });
                  }}
                />
              </>
            )}
            <div className="h-full flex items-center relative md:hidden top-[-10px] ml-[3px]">
              <Avatar
                className={
                  "w-[24px] h-[24px] flex items-center bg-dark70 border-solid border-[3px] border-white text-[8px]"
                }
                src={
                  whiteLists[targetTokenAddress[0]?.toBase58()?.toString()]
                    ?.image
                }
              >
                {
                  whiteLists[targetTokenAddress[0]?.toBase58()?.toString()]
                    ?.symbol
                }
              </Avatar>
              <p className="text-[16px] text-white ml-[5px]">
                {
                  whiteLists[targetTokenAddress[0]?.toBase58()?.toString()]
                    ?.symbol
                }
              </p>
            </div>
          </div>
          <div className="h-full flex items-center relative mobile:hidden">
            <Avatar
              className={
                "w-[24px] h-[24px] flex items-center bg-dark70 border-solid border-[3px] border-white text-[8px]"
              }
              src={
                whiteLists[targetTokenAddress[0]?.toBase58()?.toString()]?.image
              }
            >
              {
                whiteLists[targetTokenAddress[0]?.toBase58()?.toString()]
                  ?.symbol
              }
            </Avatar>
            <p className="text-[16px] text-white ml-[5px]">
              {
                whiteLists[targetTokenAddress[0]?.toBase58()?.toString()]
                  ?.symbol
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
