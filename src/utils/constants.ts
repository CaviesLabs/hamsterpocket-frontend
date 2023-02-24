import type { OptionProps } from "@/src/components/select";
import { PriceConditionType } from "@/src/entities/pocket.entity";

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
    value: "Daily",
  },
  {
    value: "Weekly",
  },
  {
    value: "Every 2 Weeks",
  },
  {
    value: "Monthly",
  },
  {
    value: "Every 3 Months",
  },
  {
    value: "Every 6 Months",
  },
  {
    value: "Yearly",
  },
  {
    value: "Custom",
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

export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm (UTC)";

export const WSOL_ADDRESS = "So11111111111111111111111111111111111111112";
export const BONK_ADDRESS = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
export const USDC_ADDRESS = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

/**
 * @dev Host to storage user avatar by wallet address.
 */
export const AVATAR_ENDPOINT =
  "https://avatars.hamsterbox.xyz/api/images/beam/120";
