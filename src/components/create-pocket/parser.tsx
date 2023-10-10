import { StopConditions } from "@/src/entities/pocket.entity";
import { DATE_TIME_FORMAT } from "@/src/utils";
import { useCreatePocketPage } from "@/src/hooks/pages/create-pocket";
import { useWhiteList } from "@/src/hooks/useWhitelist";
import { devideBigNumber } from "@/src/utils/evm.parser";
import dayjs from "dayjs";

/**
 * @dev The function to render human text base on stop conditions key.
 */
export const stopConditionHumanLabelParser = (key: string) => {
  switch (key) {
    case "endTimeReach":
      return "Time";
    case "spentBaseTokenAmountReach":
      return "Base Tokens Amount";
    case "quoteTokenAmountReach":
      return "Target Tokens Purchased";
  }
};

/**
 * @dev The function to render human text base on stop conditions key.
 * Must use in create-pocket provider.
 */
export const parseStopConditionHumanValue = (condition: StopConditions) => {
  /**
   * @dev Injected context.
   */
  const { baseTokenAddress, targetTokenAddress } = useCreatePocketPage();
  const { whiteLists, analyzeDecimals } = useWhiteList();

  /**
   * @dev Parse date value to human text.
   */
  if (condition.endTimeReach) {
    return dayjs(
      (condition.endTimeReach?.value as any)?.toNumber() * 1000
    ).format(DATE_TIME_FORMAT);
  }

  /**
   * @dev Parse token big number to human text.
   */
  if (condition.spentBaseTokenAmountReach) {
    return (
      <>
        {analyzeDecimals(
          devideBigNumber(
            condition.spentBaseTokenAmountReach?.value as any,
            Math.pow(10, baseTokenAddress?.[1])
          )
        )}
        {whiteLists[baseTokenAddress?.[0]?.toBase58()?.toString()]?.symbol}
      </>
    );
  }

  /**
   * @dev Parse token big number to human text.
   */
  if (condition.quoteTokenAmountReach) {
    return (
      <>
        {analyzeDecimals(
          devideBigNumber(
            condition.quoteTokenAmountReach?.value as any,
            Math.pow(10, targetTokenAddress?.[1])
          )
        )}
        {whiteLists[targetTokenAddress?.[0]?.toBase58()?.toString()]?.symbol}
      </>
    );
  }
};
