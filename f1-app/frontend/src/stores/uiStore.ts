import { create } from 'zustand';

type Tab = 'leaderboard' | 'track' | 'telemetry' | 'strategy' | 'delta' | 'whatif' | 'overtakes' | 'racecontrol' | 'championship' | 'results' | 'grid';
type FanZoneTab = 'predictions' | 'fantasy' | 'radio';

interface UIState {
  activeTab: Tab;
  fanZoneOpen: boolean;
  fanZoneTab: FanZoneTab;
  
  setActiveTab: (tab: Tab) => void;
  setFanZoneOpen: (open: boolean) => void;
  setFanZoneTab: (tab: FanZoneTab) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'leaderboard',
  fanZoneOpen: false,
  fanZoneTab: 'predictions',
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setFanZoneOpen: (open) => set({ fanZoneOpen: open }),
  setFanZoneTab: (tab) => set({ fanZoneTab: tab }),
}));
