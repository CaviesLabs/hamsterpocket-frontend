import { FC, useEffect, useMemo, useState } from "react";

import { Input } from "@hamsterbox/ui-kit";
import { Collapse } from "react-collapse";
import { Avatar } from "antd";

import { BN } from "@project-serum/anchor";
import { PRICE_CONDITIONS } from "@/src/utils";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { DropdownSelect } from "@/src/components/select";
import { ErrorLabel } from "@/src/components/error-label";
import { UnCollapseArrowIcon } from "@/src/components/icons";
import { PriceConditionType } from "@/src/entities/pocket.entity";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";

import UtilsProvider from "@/src/utils/utils.provider";
import { multipleBigNumber } from "@/src/utils/evm.parser";

export const BuyConditionMobile: FC<{
  buyConditionDisplayed: boolean;
  disabled?: boolean;
  toggle(): void;
}> = (props) => {
  /**
   * @dev Injected context.
   */
  const { whiteLists } = useWhiteList();
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

  /**
   * @dev Collapse condition.
   */
  const [collapsed, setCollapsed] = useState(true);

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
      <p className="text-dark50 text-[20px] mobile:text-[14px] regular-text">
        Buy at market price if
      </p>
      {errorMsgs?.buyCondition && createdEnable && (
        <ErrorLabel message={errorMsgs.buyCondition} />
      )}
      <div className="bg-[#121320] rounded-[16px] py-[16px] px-[16px] mt-[16px]">
        <div
          className="flow-root cursor-pointer"
          onClick={() => {
            !buyCondition && props.toggle();
            setCollapsed(!collapsed);
          }}
        >
          <div className="float-left rounded-[50%] bg-dark3">
            <UnCollapseArrowIcon />
          </div>
          <p className="float-left text-[12px] text-dark50 normal-text ml-[12px] relative top-[4px]">
            Add condition
          </p>
          {!buyCondition ? (
            <button className="float-right bg-[#7886A033] px-[8px] py-[4px] rounded-[19px] normal-text text-dark50 text-[12px]">
              Clear
            </button>
          ) : (
            <button
              className="float-right bg-[#F4494933] px-[8px] py-[4px] rounded-[19px] normal-text text-red200 text-[12px]"
              onClick={() => {
                props.toggle();
                setCollapsed(true);
              }}
            >
              Clear
            </button>
          )}
        </div>
        <Collapse isOpened={!collapsed}>
          <div className="md:flex md:items-center mt-[16px] max-w-[100%]">
            <div className="relative flex items-center">
              <p className="text-dark45 text-[12px] normal-text mt-[10px] bold-text">
                Each batch (
                {`${UtilsProvider.formatLongNumber(batchVolume)} ${
                  whiteLists[baseTokenAddress[0]?.toBase58()?.toString()]
                    ?.symbol
                }`}
                ) can buy
              </p>
            </div>
            <div className="mobile:mt-[16px] md:px-[10px]">
              <DropdownSelect
                handleSelectValue={(val) =>
                  setBuyCondition({
                    ...buyCondition,
                    type: val as PriceConditionType,
                  })
                }
                value={buyCondition?.type}
                options={PRICE_CONDITIONS}
                className="w-full min-w-[230px] !bg-dark90"
              />
            </div>
            <div className="h-[63px] md:mr-6 relative md:flex md:items-center mobile:mt-[16px] mobile:inline-block mobile:w-full">
              {isTwoValue ? (
                <div className="flex items-center grid grid-cols-7">
                  <Input
                    containerClassName="app-input buy-condition !h-full col-span-3"
                    inputClassName="bg-dark90 !text-white w-full !h-full"
                    placeholder={isTwoValue ? "from value" : "value"}
                    onValueChange={(val) => {
                      if (parseFloat(val) < 0) return;
                      if (!isTwoValue) {
                        return setBuyCondition({
                          ...buyCondition,
                          value: new BN(
                            multipleBigNumber(
                              parseFloat(val) || 0,
                              Math.pow(10, targetTokenAddress?.[1])
                            )
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
                          multipleBigNumber(
                            parseFloat(val) || 0,
                            Math.pow(10, targetTokenAddress?.[1])
                          )
                        ),
                      });
                    }}
                  />
                  <p className="text-white mx-[5px] mobile:text-[14px] relative col-span-1 text-center">
                    Or
                  </p>
                  <Input
                    containerClassName="app-input buy-condition !h-full col-span-3"
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
                      setErrorMsgs({
                        ...errorMsgs,
                        buyCondition: isError(),
                      });
                      setBuyCondition({
                        ...buyCondition,
                        toValue: new BN(
                          multipleBigNumber(
                            parseFloat(val) || 0,
                            Math.pow(10, targetTokenAddress?.[1])
                          )
                        ),
                      });
                    }}
                  />
                </div>
              ) : (
                <Input
                  containerClassName="app-input buy-condition !mobile:w-full !h-full"
                  inputClassName="bg-dark90 !text-white w-full !h-full"
                  placeholder={isTwoValue ? "from value" : "value"}
                  onValueChange={(val) => {
                    if (parseFloat(val) < 0) return;
                    if (!isTwoValue) {
                      return setBuyCondition({
                        ...buyCondition,
                        value: new BN(
                          multipleBigNumber(
                            parseFloat(val) || 0,
                            Math.pow(10, targetTokenAddress?.[1])
                          )
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
                        multipleBigNumber(
                          parseFloat(val) || 0,
                          Math.pow(10, targetTokenAddress?.[1])
                        )
                      ),
                    });
                  }}
                />
              )}
              <div className="h-full flex items-center relative ml-[3px]">
                <Avatar
                  alt="Image"
                  className="!w-[24px] !h-[24px] flex justify-center items-center border-solid border-[2px] border-white text-[8px]"
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
          </div>
        </Collapse>
      </div>
    </div>
  );
};
