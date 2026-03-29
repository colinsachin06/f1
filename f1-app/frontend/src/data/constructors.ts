export interface ConstructorKPI {
  pos: number;
  points: number;
  wins: number;
  reliability: number;
  avgPoints: number;
}

export interface ConstructorData {
  code: string;
  name: string;
  color: string;
  points: number[];
  kpi: ConstructorKPI;
}

export const constructorsData: Record<string, ConstructorData> = {
  redbull: {
    code: 'redbull',
    name: 'Red Bull Racing',
    color: '#1e41ff',
    points: [25, 18, 25, 19, 25, 25, 19, 15, 25, 25, 19, 25, 6, 25, 25, 18, 15, 19, 25, 25, 25, 18],
    kpi: { pos: 1, points: 860, wins: 21, reliability: 96.5, avgPoints: 39.1 }
  },
  ferrari: {
    code: 'ferrari',
    name: 'Ferrari',
    color: '#dc0000',
    points: [12, 15, 12, 18, 15, 12, 15, 18, 18, 12, 18, 12, 15, 18, 18, 25, 18, 12, 12, 18, 15, 12],
    kpi: { pos: 3, points: 652, wins: 6, reliability: 94.2, avgPoints: 29.6 }
  },
  mercedes: {
    code: 'mercedes',
    name: 'Mercedes',
    color: '#00d2be',
    points: [18, 12, 18, 15, 12, 18, 25, 12, 12, 18, 15, 18, 18, 15, 12, 12, 25, 25, 18, 12, 18, 15],
    kpi: { pos: 2, points: 652, wins: 4, reliability: 95.8, avgPoints: 29.6 }
  },
  mclaren: {
    code: 'mclaren',
    name: 'McLaren',
    color: '#ff8000',
    points: [8, 6, 8, 6, 18, 15, 12, 25, 15, 8, 12, 8, 25, 12, 25, 15, 12, 8, 8, 15, 12, 25],
    kpi: { pos: 4, points: 608, wins: 4, reliability: 93.2, avgPoints: 27.6 }
  },
  aston: {
    code: 'aston',
    name: 'Aston Martin',
    color: '#00584f',
    points: [6, 8, 6, 12, 8, 6, 8, 6, 6, 15, 6, 6, 12, 8, 6, 6, 6, 6, 6, 6, 8, 6],
    kpi: { pos: 5, points: 215, wins: 0, reliability: 91.8, avgPoints: 9.8 }
  },
  williams: {
    code: 'williams',
    name: 'Williams',
    color: '#64c4ff',
    points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    kpi: { pos: 9, points: 24, wins: 0, reliability: 88.5, avgPoints: 1.1 }
  }
};

export const raceNames = ['BHR', 'SAU', 'AUS', 'JPN', 'CHN', 'MIA', 'MON', 'CAN', 'ESP', 'AUT', 'GBR', 'HUN', 'BEL', 'NED', 'ITA', 'AZE', 'SIN', 'USA', 'MEX', 'BRA', 'LUS', 'ABU'];
