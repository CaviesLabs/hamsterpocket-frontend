import type { OptionProps } from "@/src/components/select";
import {
  PriceConditionType,
  FrequencyConditionType,
} from "@/src/entities/pocket.entity";

/**
 * @dev Define value data to sort NFTs.
 */
export const sortOptions = [
  { value: "Active", name: "Active" },
  { value: "Expired", name: "Expired" },
  { value: "Completed", name: "Completed" },
  { value: "Withdrawn", name: "Withdrawn" },
  { value: "Swapped", name: "Swapped" },
];

/**
 * @dev Define value datas to filter NFTs by category.
 */
export const categoryOptions = [
  { value: "top", name: "Top" },
  { value: "art", name: "Art" },
  { value: "collectibles", name: "Collectibles" },
  { value: "domain_names", name: "Domain Names" },
  { value: "music", name: "Music" },
  { value: "sports", name: "Sports" },
];

/**
 * @dev Define time option to select for buy condition or stop pool condition.
 */
export const TIME_CONDITIONS: OptionProps[] = [
  {
    label: "Hourly",
    value: FrequencyConditionType.HOURLY,
  },
  {
    label: "Daily",
    value: FrequencyConditionType.DAILY,
  },
  {
    label: "Weekly",
    value: FrequencyConditionType.WEEKLY,
  },
  {
    label: "Every 2 Weeks",
    value: FrequencyConditionType.E2W,
  },
  {
    label: "Monthly",
    value: FrequencyConditionType.MONTHLY,
  },
  {
    label: "Every 3 Months",
    value: FrequencyConditionType.E3M,
  },
  {
    label: "Every 6 Months",
    value: FrequencyConditionType.E6M,
  },
  {
    label: "Yearly",
    value: FrequencyConditionType.YEARLY,
  },
];

/**
 * @dev Define time option to select for buy condition or stop pool condition.
 */
export const PRICE_CONDITIONS: OptionProps[] = [
  {
    value: PriceConditionType.GT,
    label: "Greater than",
  },
  {
    value: PriceConditionType.GTE,
    label: "Greater than or equal to",
  },
  {
    value: PriceConditionType.LT,
    label: "Less than",
  },
  {
    value: PriceConditionType.LTE,
    label: "Less than or equal to",
  },
  // {
  //   value: PriceConditionType.EQ,
  //   label: "Is equal to",
  // },
  // {
  //   value: PriceConditionType.NEQ,
  //   label: "Is not equal to",
  // },
  {
    value: PriceConditionType.BW,
    label: "Is between",
  },
  {
    value: PriceConditionType.NBW,
    label: "Is not between",
  },
];

/**
 * @dev Define list of page which header will have purple background.
 */
export const PURPLE_HEADER_PAGES = [
  "proposal",
  // "transaction",
  // "create-proposal",
  // "profile",
];

export const SIGN_MESSAGE =
  "Welcome to HamsterSwap!\n" +
  "\n" +
  "Approve to sign in.\n" +
  "\n" +
  "This request will not trigger a blockchain transaction or cost any gas fees.\n" +
  "\n" +
  "Your authentication status will reset after 24 hours.";

export const DATE_TIME_FORMAT = "YYYY/MM/DD HH:mm";
export const DATE_DAY_FORMAT = "YYYY/MM/DD";
export const DATE_FORMAT = "YYYY-MM-DD";

export const WSOL_ADDRESS = "So11111111111111111111111111111111111111112";
export const BONK_ADDRESS = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
export const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const ALIAS_WMATIC_ADDRESS =
  "So11111111111111111111111111111111111111112";
export const ALIAS_UASDC_ADDRESS =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

export const MATIC_ADDRESS = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889";
export const ETH_USDC_ADDRESS = "0x6041fE60d443480F96546C927E0cE6E14A5741D4";

export const MATIC_UNIVERSAL_ROUTER =
  "0x4648a43B2C14Da09FdF82B161150d3F634f40491";
export const BSC_UNIVERSAL_ROUTER =
  "0x5Dc88340E1c5c6366864Ee415d6034cadd1A9897";

/**
 * @dev Host to storage user avatar by wallet address.
 */
export const AVATAR_ENDPOINT =
  "https://avatars.hamsterbox.xyz/api/images/beam/120";

/**
 * @dev Type of each function to take profit.
 */
export enum TAKE_PROFIT_TYPE {
  ATPRICE = "AT::PRICE",
  TOTALTRADINGVOLUME = "TOTAL::TRADING::VOLUME",
  TARGETPROFIT = "TARGET::PROFIT",
}

/**
 * @dev Expose range of kinds to take profit.
 */
export const TAKE_PROFIT_KIND_OPTIONS = [
  {
    label: "At price",
    value: TAKE_PROFIT_TYPE.ATPRICE,
  },
  {
    label: "Total trading volume (%)",
    value: TAKE_PROFIT_TYPE.TOTALTRADINGVOLUME,
  },
  {
    label: "Target profit (SOL)",
    value: TAKE_PROFIT_TYPE.TARGETPROFIT,
  },
];

export enum UNISWAP_CHAIN {
  POLYGON_MUMBAI = "polygon_mumbai",
  BNB = "bnb",
}

export const SOL_EXPLORE = "https://solscan.io";
export const MUMBAI_EXPLORE = "https://mumbai.polygonscan.com";
export const BSC_EXPLORE = "https://bscscan.com";
export const UNISWAP_EXPLORE = `https://app.uniswap.org/#/swap?chain=${
  process.env.EVM_CHAIN_ID === "matic"
    ? UNISWAP_CHAIN.POLYGON_MUMBAI
    : UNISWAP_CHAIN.BNB
}`;
export const RADYUM_EXPLORE = "https://raydium.io/swap";
