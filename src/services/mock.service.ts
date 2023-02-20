import { StatisticEntity } from "@/src/entities/statistic.entity";
import { HistoryType, PoolType } from "@/src/components/history";

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
