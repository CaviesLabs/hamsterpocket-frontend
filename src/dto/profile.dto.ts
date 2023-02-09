/**
 * @dev Define hamster profile
 */
export class ProfileDto {
  id: string;
  avatar: string;
  walletAddress: string;

  ordersStat: {
    completedOrders: number;

    orders: number;
  };

  telegram: string;
  twitter: string;
}

/**
 * @dev Define update hamster profile
 */
export class hProfileContactDto {
  email: string;
  telegram: string;
  twitter: string;
}
