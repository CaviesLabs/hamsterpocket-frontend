import { StatisticEntity } from "@/src/entities/statistic.entity";
import { PortfolioEntity } from "@/src/entities/portfolio.entity";
import {
  PriceConditionType,
  MainProgressBy,
  PocketEntity,
  PocketStatus,
} from "../entities/pocket.entity";

export const StatisticMock: StatisticEntity = {
  users: 6.458,
  pockets: 17.934,
  totalVolume: 35293.04,
};

export const PortfoliosMock: PortfolioEntity[] = [
  {
    tokenSymbol: "RAY",
    tokenName: "Raydium",
    ownerAddress: "NFTUk...Mb7Nk",
    tokenAddress: "NFTUk...Mb7Nk",
    image:
      "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
    total: 3293482.0,
    value: 0.0000012,
  },
  {
    tokenSymbol: "ETH",
    tokenName: "Etherium",
    ownerAddress: "NFTUk...Mb7Nk",
    tokenAddress: "NFTUk...Mb7Nk",
    image:
      "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency/256/Ethereum-icon.png",
    total: 3293482.0,
    value: 0.0000012,
  },
  {
    tokenSymbol: "ENS",
    tokenName: "Ethereum Name Service",
    ownerAddress: "NFTUk...Mb7Nk",
    tokenAddress: "NFTUk...Mb7Nk",
    image:
      "https://img.freepik.com/premium-vector/ens-ethereum-name-service-token-symbol-cryptocurrency-logo-circle-coin-icon-isolated-white-background_337410-1834.jpg",
    total: 3293482.0,
    value: 0.0000012,
  },
  {
    tokenSymbol: "BNB",
    tokenName: "Binance",
    ownerAddress: "NFTUk...Mb7Nk",
    tokenAddress: "NFTUk...Mb7Nk",
    image:
      "https://icons.iconarchive.com/icons/cjdowner/cryptocurrency-flat/256/Binance-Coin-BNB-icon.png",
    total: 3293482.0,
    value: 0.0000012,
  },
  {
    tokenSymbol: "RAY",
    tokenName: "Raydium",
    ownerAddress: "NFTUk...Mb7Nk",
    tokenAddress: "NFTUk...Mb7Nk",
    image:
      "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
    total: 3293482.0,
    value: 0.0000012,
  },
  {
    tokenSymbol: "RAY",
    tokenName: "Raydium",
    ownerAddress: "NFTUk...Mb7Nk",
    tokenAddress: "NFTUk...Mb7Nk",
    image:
      "https://thegivingblock.com/wp-content/uploads/2022/04/Raydium-RAY-coin.png",
    total: 3293482.0,
    value: 0.0000012,
  },
];

export const ActivePocketsMock: PocketEntity[] = [
  {
    id: "14623",
    address: "a11bd...cdasp",
    ownerAddress: "a11bd...cdasp",
    name: "Save money for the future",
    status: PocketStatus.ACTIVE,
    baseTokenAddress: "So11111111111111111111111111111111111111112",
    targetTokenAddress: "So11111111111111111111111111111111111111112",
    startTime: new Date("2023-02-20T08:13:13.901Z"),
    depositedAmount: 8.7,
    batchVolume: 10,
    frequency: {},
    buyCondition: {
      tokenAddress: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      type: PriceConditionType.GT,
      value: [1],
    },
    stopConditions: {
      endTime: new Date("2023-02-20T08:13:13.901Z"),
      baseTokenReach: 300,
      receivedTargetTokenReach: 1000000000,
      batchAmountReach: 10,
    },
    currentSpentBaseToken: 120,
    remainingBaseTokenBalance: 180,
    currentReceivedTargetToken: 0,
    currentBatchAmount: 0,
    mainProgressBy: MainProgressBy.END_TIME,
    progressPercent: 40.11,
  },
  {
    id: "14624",
    address: "a11bd...cdasp",
    ownerAddress: "a11bd...cdasp",
    name: "Pool name here 1",
    status: PocketStatus.ACTIVE,
    baseTokenAddress: "So11111111111111111111111111111111111111112",
    targetTokenAddress: "So11111111111111111111111111111111111111112",
    startTime: new Date("2023-02-20T08:13:13.901Z"),
    depositedAmount: 8.7,
    batchVolume: 10,
    frequency: {},
    buyCondition: {
      tokenAddress: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      type: PriceConditionType.GT,
      value: [1],
    },
    stopConditions: {
      endTime: new Date("2023-02-20T08:13:13.901Z"),
      baseTokenReach: 300,
      receivedTargetTokenReach: 1000000000,
      batchAmountReach: 10,
    },
    currentSpentBaseToken: 120,
    remainingBaseTokenBalance: 180,
    currentReceivedTargetToken: 0,
    currentBatchAmount: 0,
    mainProgressBy: MainProgressBy.END_TIME,
    progressPercent: 40.11,
  },
  {
    id: "14625",
    address: "a11bd...cdasp",
    ownerAddress: "a11bd...cdasp",
    name: "Pool name here",
    status: PocketStatus.PAUSED,
    baseTokenAddress: "So11111111111111111111111111111111111111112",
    targetTokenAddress: "So11111111111111111111111111111111111111112",
    startTime: new Date("2023-02-20T08:13:13.901Z"),
    depositedAmount: 8.7,
    batchVolume: 10,
    frequency: {},
    buyCondition: {
      tokenAddress: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
      type: PriceConditionType.GT,
      value: [1],
    },
    stopConditions: {
      endTime: new Date("2023-02-20T08:13:13.901Z"),
      baseTokenReach: 300,
      receivedTargetTokenReach: 1000000000,
      batchAmountReach: 10,
    },
    currentSpentBaseToken: 120,
    remainingBaseTokenBalance: 180,
    currentReceivedTargetToken: 0,
    currentBatchAmount: 0,
    mainProgressBy: MainProgressBy.END_TIME,
    progressPercent: 40.11,
  },
];
