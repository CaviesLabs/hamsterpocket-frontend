import { FC, useEffect, useMemo } from "react";
import { Button, Input } from "@hamsterbox/ui-kit";
import { PlusIcon, DeleteIconCircle } from "@/src/components/icons";
// import { CurrencyInput } from "@/src/components/currency-input";
import { PRICE_CONDITIONS } from "@/src/utils";
import { DropdownSelect } from "@/src/components/select";
import { PriceConditionType } from "@/src/entities/pocket.entity";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
// import { motion } from "framer-motion";
import { BN } from "@project-serum/anchor";
import { ErrorLabel } from "@/src/components/error-label";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import classNames from "classnames";

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
    setBuyCondition,
    targetTokenAddress,
    baseTokenAddress,
    batchVolume,
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
      value: new BN(0 * Math.pow(10, targetTokenAddress?.[1])),
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
      <p className="text-dark10 text-[14px] normal-text">
        Buy at market price if
      </p>
      {errorMsgs?.buyCondition && (
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
        <div className="grid grid-cols-12 items-center justify-center mt-[16px] max-w-[100%]">
          <div className="col-span-1 items-center flex">
            <button onClick={props.toggle} className="relative top-[4px]">
              <DeleteIconCircle />
            </button>
          </div>
          <div className="col-span-3 relative flex items-center">
            <p className="text-dark10 text-[16px] normal-text mt-[10px] text-white bold-text">
              Each batch {`(${batchVolume}`}
            </p>
            <p className="text-dark10 text-[16px] normal-text mt-[10px] text-white bold-text ml-[3px]">
              {whiteLists[baseTokenAddress[0]?.toBase58()?.toString()]?.symbol}
            </p>
            <img
              src={
                whiteLists[baseTokenAddress[0]?.toBase58()?.toString()]?.image
              }
              alt="Image"
              className="w-[24px] h-[24px] ml-[7px] relative top-[4px]"
            />
            <p className="text-dark10 text-[16px] normal-text mt-[10px] text-white bold-text ml-[3px]">
              ) can buy
            </p>
          </div>
          <div className="col-span-2 pl-[10px]">
            <DropdownSelect
              handleSelectValue={(val) =>
                setBuyCondition({
                  ...buyCondition,
                  type: val as PriceConditionType,
                })
              }
              value={buyCondition?.type}
              options={PRICE_CONDITIONS}
              className="w-full"
            />
          </div>
          <div
            className={classNames(
              "col-span-1 pl-[10px] h-full relative flex items-center",
              {
                "!col-span-3": isTwoValue,
              }
            )}
          >
            <Input
              containerClassName="app-input w-[110px] !h-full"
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
                <p className="text-white mx-[5px]">Or</p>
                <Input
                  containerClassName="app-input w-[110px] !h-full"
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
          </div>
          <div className="col-span-2 pl-[10px] h-full flex items-center relative">
            <img
              src={
                whiteLists[targetTokenAddress[0]?.toBase58()?.toString()]?.image
              }
              alt="Image"
              className="w-[24px] h-[24px]"
            />
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
