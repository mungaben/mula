import { create } from 'zustand';
import { ModuleStore } from '../schemas';
 // Adjust the path to where your types are defined

const useModuleStore = create<ModuleStore>((set) => ({
  depositModule: false,
  toggleDepositModule: () => set((state) => ({
    depositModule: !state.depositModule,
  })),

  withdrawModule: false,
  toggleWithdrawModule: () => set((state) => ({
    withdrawModule: !state.withdrawModule,
  })),

  redeemCodeModule: false,
  toggleRedeemCodeModule: () => set((state) => ({
    redeemCodeModule: !state.redeemCodeModule,
  })),

  referralLinkModule: false,
  toggleReferralLinkModule: () => set((state) => ({
    referralLinkModule: !state.referralLinkModule,
  })),
}));

export default useModuleStore;
