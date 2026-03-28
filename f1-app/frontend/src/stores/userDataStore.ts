import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FantasyTeam, Bet, Prediction } from '../types';

interface UserDataState {
  fantasyTeams: FantasyTeam[];
  bets: Bet[];
  predictions: Prediction[];
  pitcoins: number;
  
  setFantasyTeams: (teams: FantasyTeam[]) => void;
  setBets: (bets: Bet[]) => void;
  setPredictions: (predictions: Prediction[]) => void;
  setPitcoins: (pitcoins: number) => void;
  addFantasyTeam: (team: FantasyTeam) => void;
  addBet: (bet: Bet) => void;
  addPrediction: (prediction: Prediction) => void;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      fantasyTeams: [],
      bets: [],
      predictions: [],
      pitcoins: 1000,
      
      setFantasyTeams: (teams) => set({ fantasyTeams: teams }),
      setBets: (bets) => set({ bets }),
      setPredictions: (predictions) => set({ predictions }),
      setPitcoins: (pitcoins) => set({ pitcoins }),
      addFantasyTeam: (team) => set((state) => ({ fantasyTeams: [...state.fantasyTeams, team] })),
      addBet: (bet) => set((state) => ({ bets: [...state.bets, bet] })),
      addPrediction: (prediction) => set((state) => ({ predictions: [...state.predictions, prediction] })),
    }),
    {
      name: 'user-data-storage',
    }
  )
);
