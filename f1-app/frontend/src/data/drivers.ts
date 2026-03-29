export interface SeasonData {
  year: number;
  team: string;
  teamColor: string;
  pos: number;
  points: number;
  wins: number;
}

export interface DriverStats {
  wins: number;
  podiums: number;
  poles: number;
  fl: number;
  dnf: number;
}

export interface DriverCareer {
  races: number;
  wins: number;
  championships: number;
  winPct: number;
  avgFinish: number;
}

export interface DriverData {
  code: string;
  name: string;
  nationality: string;
  number: string;
  team: string;
  teamColor: string;
  seasons: SeasonData[];
  stats: DriverStats;
  career: DriverCareer;
}

export const driversData: Record<string, DriverData> = {
  VER: {
    code: 'VER',
    name: 'Max Verstappen',
    nationality: 'NED',
    number: '1',
    team: 'Red Bull',
    teamColor: '#1e41ff',
    seasons: [
      { year: 2018, team: 'Red Bull', teamColor: '#1e41ff', pos: 4, points: 249, wins: 2 },
      { year: 2019, team: 'Red Bull', teamColor: '#1e41ff', pos: 3, points: 278, wins: 3 },
      { year: 2020, team: 'Red Bull', teamColor: '#1e41ff', pos: 2, points: 214, wins: 2 },
      { year: 2021, team: 'Red Bull', teamColor: '#1e41ff', pos: 1, points: 395, wins: 10 },
      { year: 2022, team: 'Red Bull', teamColor: '#1e41ff', pos: 1, points: 454, wins: 15 },
      { year: 2023, team: 'Red Bull', teamColor: '#1e41ff', pos: 1, points: 575, wins: 19 },
      { year: 2024, team: 'Red Bull', teamColor: '#1e41ff', pos: 1, points: 437, wins: 15 }
    ],
    stats: { wins: 66, podiums: 106, poles: 40, fl: 30, dnf: 32 },
    career: { races: 200, wins: 66, championships: 4, winPct: 33, avgFinish: 2.8 }
  },
  HAM: {
    code: 'HAM',
    name: 'Lewis Hamilton',
    nationality: 'GBR',
    number: '44',
    team: 'Mercedes',
    teamColor: '#00d2be',
    seasons: [
      { year: 2018, team: 'Mercedes', teamColor: '#00d2be', pos: 2, points: 408, wins: 5 },
      { year: 2019, team: 'Mercedes', teamColor: '#00d2be', pos: 1, points: 413, wins: 11 },
      { year: 2020, team: 'Mercedes', teamColor: '#00d2be', pos: 1, points: 347, wins: 11 },
      { year: 2021, team: 'Mercedes', teamColor: '#00d2be', pos: 2, points: 387, wins: 8 },
      { year: 2022, team: 'Mercedes', teamColor: '#00d2be', pos: 6, points: 158, wins: 0 },
      { year: 2023, team: 'Mercedes', teamColor: '#00d2be', pos: 3, points: 234, wins: 2 },
      { year: 2024, team: 'Mercedes', teamColor: '#00d2be', pos: 4, points: 374, wins: 2 }
    ],
    stats: { wins: 105, podiums: 195, poles: 104, fl: 67, dnf: 54 },
    career: { races: 339, wins: 105, championships: 7, winPct: 31, avgFinish: 3.9 }
  },
  LEC: {
    code: 'LEC',
    name: 'Charles Leclerc',
    nationality: 'MON',
    number: '16',
    team: 'Ferrari',
    teamColor: '#dc0000',
    seasons: [
      { year: 2018, team: 'Sauber', teamColor: '#00ff00', pos: 13, points: 10, wins: 0 },
      { year: 2019, team: 'Ferrari', teamColor: '#dc0000', pos: 4, points: 215, wins: 2 },
      { year: 2020, team: 'Ferrari', teamColor: '#dc0000', pos: 8, points: 98, wins: 0 },
      { year: 2021, team: 'Ferrari', teamColor: '#dc0000', pos: 7, points: 158, wins: 0 },
      { year: 2022, team: 'Ferrari', teamColor: '#dc0002', pos: 2, points: 308, wins: 3 },
      { year: 2023, team: 'Ferrari', teamColor: '#dc0000', pos: 5, points: 206, wins: 1 },
      { year: 2024, team: 'Ferrari', teamColor: '#dc0000', pos: 3, points: 291, wins: 3 }
    ],
    stats: { wins: 9, podiums: 39, poles: 26, fl: 14, dnf: 31 },
    career: { races: 124, wins: 9, championships: 0, winPct: 7.3, avgFinish: 7.2 }
  },
  NOR: {
    code: 'NOR',
    name: 'Lando Norris',
    nationality: 'GBR',
    number: '4',
    team: 'McLaren',
    teamColor: '#ff8000',
    seasons: [
      { year: 2019, team: 'McLaren', teamColor: '#ff8000', pos: 19, points: 0, wins: 0 },
      { year: 2020, team: 'McLaren', teamColor: '#ff8000', pos: 9, points: 32, wins: 0 },
      { year: 2021, team: 'McLaren', teamColor: '#ff8000', pos: 6, points: 112, wins: 0 },
      { year: 2022, team: 'McLaren', teamColor: '#ff8000', pos: 7, points: 122, wins: 0 },
      { year: 2023, team: 'McLaren', teamColor: '#ff8000', pos: 6, points: 205, wins: 0 },
      { year: 2024, team: 'McLaren', teamColor: '#ff8000', pos: 2, points: 374, wins: 4 }
    ],
    stats: { wins: 4, podiums: 24, poles: 4, fl: 6, dnf: 28 },
    career: { races: 118, wins: 4, championships: 0, winPct: 3.4, avgFinish: 7.8 }
  },
  ALO: {
    code: 'ALO',
    name: 'Fernando Alonso',
    nationality: 'ESP',
    number: '14',
    team: 'Aston Martin',
    teamColor: '#00584f',
    seasons: [
      { year: 2018, team: 'McLaren', teamColor: '#ff8000', pos: 15, points: 8, wins: 0 },
      { year: 2019, team: 'McLaren', teamColor: '#ff8000', pos: 17, points: 0, wins: 0 },
      { year: 2020, team: 'Renault', teamColor: '#fff500', pos: 10, points: 30, wins: 0 },
      { year: 2021, team: 'Alpine', teamColor: '#ff87bc', pos: 10, points: 81, wins: 0 },
      { year: 2022, team: 'Alpine', teamColor: '#ff87bc', pos: 9, points: 81, wins: 0 },
      { year: 2023, team: 'Aston Martin', teamColor: '#00584f', pos: 4, points: 200, wins: 0 },
      { year: 2024, team: 'Aston Martin', teamColor: '#00584f', pos: 9, points: 70, wins: 0 }
    ],
    stats: { wins: 32, podiums: 106, poles: 22, fl: 26, dnf: 85 },
    career: { races: 382, wins: 32, championships: 2, winPct: 8.4, avgFinish: 5.6 }
  }
};

export const gridAverage = { wins: 10.8, podiums: 35.6, poles: 11.8, fl: 9, dnf: 25.2 };
