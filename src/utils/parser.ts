import { DurationObjectUnits } from "luxon";
import { BN } from "@project-serum/anchor";

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
  const swapDuration = (val: number) => ({
    hours: new BN(val),
  });

  /** @dev Condition for each  */
  if (duration.hours) {
    return swapDuration(duration.hours);
  } else if (duration.weeks) {
    return swapDuration(duration.weeks * 7 * 24);
  } else if (duration.months) {
    return swapDuration(duration.months * 30 * 24);
  } else if (duration.years) {
    return swapDuration(duration.years * 365 * 24);
  }
};
