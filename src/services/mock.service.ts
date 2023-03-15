import { StatisticEntity } from "@/src/entities/statistic.entity";
import { PortfolioEntity } from "@/src/entities/portfolio.entity";
import { PocketEntity } from "@/src/entities/pocket.entity";

export const StatisticMock: StatisticEntity = {
  users: 6.458,
  pockets: 17934,
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

export const ActivePocketsMock: PocketEntity[] = [];
