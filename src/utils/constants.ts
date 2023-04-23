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
  {
    value: PriceConditionType.EQ,
    label: "Is equal to",
  },
  {
    value: PriceConditionType.NEQ,
    label: "Is not equal to",
  },
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

/**
 * @dev Host to storage user avatar by wallet address.
 */
export const AVATAR_ENDPOINT =
  "https://avatars.hamsterbox.xyz/api/images/beam/120";

// const allowCurrenciess = [
//   {
//     id: "So11111111111111111111111111111111111111112",
//     image:
//       "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
//     name: "Solana",
//     type: "token",
//     decimals: 9,
//     symbol: "SOL",
//   },
//   {
//     id: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
//     image: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
//     name: "Bonk",
//     type: "token",
//     decimals: 5,
//     symbol: "BONK",
//   },
//   {
//     id: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
//     image:
//       "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
//     name: "USD Coin",
//     type: "token",
//     decimals: 6,
//     symbol: "USDC",
//   },
// ];
