import { create } from 'zustand';
import type { Session, Driver, LeaderboardEntry } from '../types';

interface RaceState {
  currentSession: Session | null;
  drivers: Driver[];
  leaderboard: LeaderboardEntry[];
  selectedDriver: number | null;
  isLive: boolean;
  
  setCurrentSession: (session: Session | null) => void;
  setDrivers: (drivers: Driver[]) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setSelectedDriver: (driverNumber: number | null) => void;
  setIsLive: (isLive: boolean) => void;
}

export const useRaceStore = create<RaceState>((set) => ({
  currentSession: null,
  drivers: [],
  leaderboard: [],
  selectedDriver: null,
  isLive: false,
  
  setCurrentSession: (session) => set({ currentSession: session }),
  setDrivers: (drivers) => set({ drivers }),
  setLeaderboard: (leaderboard) => set({ leaderboard }),
  setSelectedDriver: (driverNumber) => set({ selectedDriver: driverNumber }),
  setIsLive: (isLive) => set({ isLive }),
}));
