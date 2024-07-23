interface Deposit {
    id: string;
    userId: string;
    simPhoneNumberId: string;
    amount: number;
    createdAt: string;
    status: string;
  }
  
  interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    balance: number;
    role: string;
    deposits: Deposit[];
  }
  
  interface WithdrawalRequest {
    id: string;
    userId: string;
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: User;
  }
  