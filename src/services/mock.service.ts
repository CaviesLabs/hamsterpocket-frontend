import { StatisticEntity } from "@/src/entities/statistic.entity";
import { HistoryType, PoolType } from "@/src/components/history";
import { PortfolioType } from "@/src/components/portfolio/types";
import {
  BuyConditionTypes,
  MainProgressTypes,
  PocketEntity,
  PocketStatus,
} from "../entities/pocket.entity";

export const StatisticMock: StatisticEntity = {
  users: "6.458",
  pockets: "17,934",
  totalVolume: "35,293.04",
};

export const HistoriesMock: HistoryType[] = [
  {
    id: "199499",
    name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
    token: {
      name: "ETH",
      address: "NFTUk...Mb7Nk",
    },
    type: PoolType.CREATE,
    nativeTokenAmount: 100.32,
    nativeTokenPrice: 20.31,
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
    createdAt: new Date(
      "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
    ),
  },
  {
    id: "199500",
    name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
    token: {
      name: "ENS",
      address: "NFTUk...Mb7Nk",
    },
    type: PoolType.PAUSE,
    nativeTokenAmount: 100.32,
    nativeTokenPrice: 20.31,
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
    createdAt: new Date(
      "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
    ),
  },
  {
    id: "199501",
    name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
    token: {
      name: "ENS",
      address: "NFTUk...Mb7Nk",
    },
    type: PoolType.CONTINUE,
    nativeTokenAmount: 100.32,
    nativeTokenPrice: 20.31,
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
    createdAt: new Date(
      "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
    ),
  },
  {
    id: "199502",
    name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
    token: {
      name: "ENS",
      address: "NFTUk...Mb7Nk",
    },
    type: PoolType.DEPOSIT,
    nativeTokenAmount: 100.32,
    nativeTokenPrice: 20.31,
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
    createdAt: new Date(
      "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
    ),
  },
  {
    id: "199503",
    name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
    token: {
      name: "ENS",
      address: "NFTUk...Mb7Nk",
    },
    type: PoolType.BUY,
    nativeTokenAmount: 100.32,
    nativeTokenPrice: 20.31,
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
    createdAt: new Date(
      "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
    ),
  },
  {
    id: "199504",
    name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
    token: {
      name: "ENS",
      address: "NFTUk...Mb7Nk",
    },
    type: PoolType.CLOSE,
    nativeTokenAmount: 100.32,
    nativeTokenPrice: 20.31,
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
    createdAt: new Date(
      "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
    ),
  },
  {
    id: "199505",
    name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
    token: {
      name: "ENS",
      address: "NFTUk...Mb7Nk",
    },
    type: PoolType.WITHDRAW,
    nativeTokenAmount: 100.32,
    nativeTokenPrice: 20.31,
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
    createdAt: new Date(
      "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
    ),
  },
  {
    id: "199506",
    name: "Name of pocket here, Name of pocket here, Name of pocket here, ",
    token: {
      name: "ENS",
      address: "NFTUk...Mb7Nk",
    },
    type: PoolType.BUY,
    nativeTokenAmount: 100.32,
    nativeTokenPrice: 20.31,
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
    createdAt: new Date(
      "Wed Feb 15 2023 22:38:32 GMT-0800 (Pacific Standard Time)"
    ),
  },
];

export const PortfoliosMock: PortfolioType[] = [
  {
    id: "1",
    token: {
      name: "RAY",
      fullname: "Raydium",
      address: "NFTUk...Mb7Nk",
      image:
        "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
    },
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
  },
  {
    id: "2",
    token: {
      name: "ETH",
      fullname: "Etherium",
      address: "NFTUk...Mb7Nk",
      image:
        "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/256/Ethereum-icon.png",
    },
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
  },
  {
    id: "3",
    token: {
      name: "ENS",
      fullname: "Ethereum Name Service",
      address: "NFTUk...Mb7Nk",
      image:
        "https://img.freepik.com/premium-vector/ens-ethereum-name-service-token-symbol-cryptocurrency-logo-circle-coin-icon-isolated-white-background_337410-1834.jpg",
    },
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
  },
  {
    id: "4",
    token: {
      name: "BNB",
      fullname: "Binance",
      address: "NFTUk...Mb7Nk",
      image:
        "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Binance-Coin-BNB-icon.png",
    },
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
  },
  {
    id: "5",
    token: {
      name: "RAY",
      fullname: "Raydium",
      address: "NFTUk...Mb7Nk",
      image:
        "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
    },
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
  },
  {
    id: "1",
    token: {
      name: "RAY",
      fullname: "Raydium",
      address: "NFTUk...Mb7Nk",
      image:
        "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
    },
    tokenAmount: 3293482.0,
    tokenPrice: 0.0000012,
  },
];

export const ActivePocketsMock: PocketEntity[] = [
  {
    id: "14623",
    address: "a11bd...cdasp",
    ownerAddress: "a11bd...cdasp",
    name: "Save money for the future",
    status: PocketStatus["POOL_STATUS::CREATED"],
    baseTokenAddress: "So11111111111111111111111111111111111111112",
    targetTokenAddress: "So11111111111111111111111111111111111111112",
    startTime: new Date("2023-02-20T08:13:13.901Z"),
    depositedAmount: 8.7,
    batchVolume: 10,
    frequency: {},
    buyCondition: {
      tokenAddress: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      type: BuyConditionTypes.GT,
      value: [0],
    },
    stopConditions: {
      endTime: new Date("2023-02-20T08:13:13.901Z"),
      baseTokenReach: 300,
      targetTokenReach: 1000000000,
      batchAmountReach: 10,
    },
    currentBaseToken: 120,
    remainingBaseTokenBalance: 180,
    currentTargetToken: 0,
    currentBatchAmount: 0,
    mainProgressBy: MainProgressTypes["MAIN_PROGRESS_BY::END_TIME"],
    progressPercent: 40.11,
  },
  {
    id: "14624",
    address: "a11bd...cdasp",
    ownerAddress: "a11bd...cdasp",
    name: "Pool name here 1",
    status: PocketStatus["POOL_STATUS::CREATED"],
    baseTokenAddress: "So11111111111111111111111111111111111111112",
    targetTokenAddress: "So11111111111111111111111111111111111111112",
    startTime: new Date("2023-02-20T08:13:13.901Z"),
    depositedAmount: 8.7,
    batchVolume: 10,
    frequency: {},
    buyCondition: {
      tokenAddress: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      type: BuyConditionTypes.GT,
      value: [0],
    },
    stopConditions: {
      endTime: new Date("2023-02-20T08:13:13.901Z"),
      baseTokenReach: 300,
      targetTokenReach: 1000000000,
      batchAmountReach: 10,
    },
    currentBaseToken: 120,
    remainingBaseTokenBalance: 180,
    currentTargetToken: 0,
    currentBatchAmount: 0,
    mainProgressBy: MainProgressTypes["MAIN_PROGRESS_BY::END_TIME"],
    progressPercent: 40.11,
  },
  {
    id: "14625",
    address: "a11bd...cdasp",
    ownerAddress: "a11bd...cdasp",
    name: "Pool name here",
    status: PocketStatus["POOL_STATUS::PAUSED"],
    baseTokenAddress: "So11111111111111111111111111111111111111112",
    targetTokenAddress: "So11111111111111111111111111111111111111112",
    startTime: new Date("2023-02-20T08:13:13.901Z"),
    depositedAmount: 8.7,
    batchVolume: 10,
    frequency: {},
    buyCondition: {
      tokenAddress: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      type: BuyConditionTypes.GT,
      value: [0],
    },
    stopConditions: {
      endTime: null,
      baseTokenReach: 0,
      targetTokenReach: 0,
      batchAmountReach: 0,
    },
    currentBaseToken: 120,
    remainingBaseTokenBalance: 180,
    currentTargetToken: 0,
    currentBatchAmount: 0,
    mainProgressBy: MainProgressTypes["MAIN_PROGRESS_BY::END_TIME"],
    progressPercent: 40.11,
  },
];
