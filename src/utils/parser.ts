import { DurationObjectUnits } from "luxon";
import { BN } from "@project-serum/anchor";
import { StopConditions } from "@/src/entities/pocket.entity";
import { SideMethod } from "@/src/dto/pocket.dto";
import { useMediaQuery } from "usehooks-ts";

/** @dev Hook to check if breakpoint mobile. */
export const useMobileBreakpoint = () => useMediaQuery("(max-width:768px)");

/** @dev Hook to check if breakpoint desktop. */
export const useDesktopBreakpoint = () => useMediaQuery("(min-width:768px)");

/** @dev Export date arrays/ */
export const TIME_ARRAYS = Array.from(Array(24).keys())
  .map((item) => {
    const _fPlexig = item >= 10 ? "" : "0";
    return Array.from(Array(12).keys()).map((minute) => {
      const parseMinute = minute * 5;
      const _mPlexig = parseMinute >= 10 ? "" : "0";
      return `${_fPlexig}${item}:${_mPlexig}${parseMinute}`;
    });
  })
  .flat(1);

export const stringToColour = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

/**
 * @dev The function to convert frequency time to hours.
 * @param {DurationObjectUnits} duration Root duration which user selected.
 * */
export const convertDurationsTimeToHours = (
  duration: DurationObjectUnits
): { hours: BN } => {
  /** @dev Initilize duration result. */
  const swapDuration = (val: number) => {
    return {
      hours: new BN(val),
    };
  };

  /** @dev Condition for each  */
  if (duration.hours) {
    return swapDuration(duration.hours);
  } else if (duration.days) {
    return swapDuration(duration.days * 24);
  } else if (duration.weeks) {
    return swapDuration(duration.weeks * 7 * 24);
  } else if (duration.months) {
    return swapDuration(duration.months * 30 * 24);
  } else if (duration.years) {
    return swapDuration(duration.years * 365 * 24);
  }
};

/**
 * @dev The function to convert hours to frequency time.
 * @param {DurationObjectUnits} hour Root hour number which user selected.
 * */
export const convertHoursToDurationsTime = (
  hours: number
): DurationObjectUnits => {
  /** @dev Initialize duration result. */
  const result: DurationObjectUnits = {};

  /** @dev Condition for each  */
  if (hours >= 24 * 365) {
    result.years = Math.floor(hours / (365 * 24));
    hours = hours % (365 * 24);
  }
  if (hours >= 24 * 30) {
    result.months = Math.floor(hours / (30 * 24));
    hours = hours % (30 * 24);
  }
  if (hours >= 24 * 7) {
    result.weeks = Math.floor(hours / (24 * 7));
    hours = hours % (24 * 7);
  }
  if (hours >= 24) {
    result.days = Math.floor(hours / 24);
    hours = hours % 24;
  }
  if (hours > 0) {
    result.hours = hours;
  }

  return result;
};

/**
 * @dev The function to convert stopCondition to match with contract based on sideMethod.
 * @param {StopConditions} stopCondtions The root condition which user choose.
 * @return {StopConditions} The final condition which is processed.
 */
export const processStopConditions = (
  stopConditions: StopConditions,
  side: SideMethod
) => {
  /* @dev Create a copy of stopConditions */
  const processedConditions: StopConditions = { ...stopConditions };
  if (side.buy) {
    /**
     * @dev Map baseTokenAmountReach to quoteTokenAmountReach and delete baseTokenAmountReach
     * if side is buy.
     */
    if (processedConditions.quoteTokenAmountReach) {
      processedConditions.baseTokenAmountReach =
        processedConditions.quoteTokenAmountReach;
      delete processedConditions.quoteTokenAmountReach;
    }

    /**
     * @dev Map spentBaseTokenAmountReach to spentQuoteTokenAmountReach and delete
     * spentBaseTokenAmountReach if side is sell.
     */
    if (processedConditions.spentBaseTokenAmountReach) {
      processedConditions.spentQuoteTokenAmountReach =
        processedConditions.spentBaseTokenAmountReach;
      delete processedConditions.spentBaseTokenAmountReach;
    }
  }

  return processedConditions;
};
