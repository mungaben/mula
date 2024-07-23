export interface Config {
    id: string;
    minWithdrawalAmount: number;
    withdrawalFeePercentage: number;
    minBalance: number;
    level1Percentage: number;
    level2Percentage: number;
    level3Percentage: number;
    linkLifetime: number;
    createdAt: Date;
    updatedAt: Date;
  }