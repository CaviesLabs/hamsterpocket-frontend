export type PortfolioDto = {
  id: string;
  token: {
    name: string;
    fullname: string;
    address: string;
    image: string;
  };
  tokenAmount: number;
  tokenPrice: number;
};
