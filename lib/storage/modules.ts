import {create} from 'zustand';

interface ModuleState {
  redeemCodeModule: boolean;
  depositModule: boolean;
  withdrawModule: boolean;
  referralLinkModule: boolean;
  toggleRedeemCodeModule: () => void;
  toggleDepositModule: () => void;
  toggleWithdrawModule: () => void;
  toggleReferralLinkModule: () => void;
}

const useModuleStore = create<ModuleState>((set) => ({
  redeemCodeModule: false,
  depositModule: false,
  withdrawModule: false,
  referralLinkModule: false,
  toggleRedeemCodeModule: () => set((state) => ({ redeemCodeModule: !state.redeemCodeModule })),
  toggleDepositModule: () => set((state) => ({ depositModule: !state.depositModule })),
  toggleWithdrawModule: () => set((state) => ({ withdrawModule: !state.withdrawModule })),
  toggleReferralLinkModule: () => set((state) => ({ referralLinkModule: !state.referralLinkModule })),
}));

export default useModuleStore;
