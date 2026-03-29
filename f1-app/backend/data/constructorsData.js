const constructorsData = [
  {
    id: 'red-bull',
    name: 'Red Bull Racing',
    color: '#3671C6',
    shortName: 'RBR',
    race2024: [
      { race: 'BHR', points: 44, position: 1 }, { race: 'SAU', points: 43, position: 1 },
      { race: 'AUS', points: 35, position: 2 }, { race: 'JPN', points: 44, position: 1 },
      { race: 'CHN', points: 44, position: 1 }, { race: 'MIA', points: 44, position: 1 },
      { race: 'IML', points: 44, position: 1 }, { race: 'MON', points: 36, position: 2 },
      { race: 'CAN', points: 43, position: 1 }, { race: 'ESP', points: 44, position: 1 },
      { race: 'AUT', points: 44, position: 1 }, { race: 'GBR', points: 44, position: 1 },
      { race: 'HUN', points: 44, position: 1 }, { race: 'BEL', points: 44, position: 1 },
      { race: 'NLD', points: 44, position: 1 }, { race: 'ITA', points: 44, position: 1 },
      { race: 'AZE', points: 44, position: 1 }, { race: 'SGP', points: 44, position: 1 },
      { race: 'USX', points: 43, position: 1 }, { race: 'MXC', points: 44, position: 1 },
      { race: 'SAO', points: 44, position: 1 }, { race: 'LVG', points: 44, position: 1 }
    ],
    engineProfile: {
      power: 92,
      fuelEfficiency: 88,
      reliability: 94,
      heatMgmt: 89,
      driveability: 85,
      recovery: 90
    },
    upgrades: [
      { race: 6, name: 'Spec B', lapTimeDelta: -0.32, complexity: 3 },
      { race: 13, name: 'Spec C', lapTimeDelta: -0.45, complexity: 4 }
    ],
    kpis: {
      position: 1,
      points: 860,
      wins: 21,
      reliabilityPct: 97.8,
      avgPointsPerRace: 39.1
    }
  },
  {
    id: 'ferrari',
    name: 'Ferrari',
    color: '#E8002D',
    shortName: 'FER',
    race2024: [
      { race: 'BHR', points: 30, position: 2 }, { race: 'SAU', points: 27, position: 2 },
      { race: 'AUS', points: 38, position: 1 }, { race: 'JPN', points: 24, position: 2 },
      { race: 'CHN', points: 25, position: 2 }, { race: 'MIA', points: 26, position: 2 },
      { race: 'IML', points: 26, position: 2 }, { race: 'MON', points: 35, position: 1 },
      { race: 'CAN', points: 26, position: 2 }, { race: 'ESP', points: 26, position: 2 },
      { race: 'AUT', points: 24, position: 2 }, { race: 'GBR', points: 26, position: 2 },
      { race: 'HUN', points: 24, position: 2 }, { race: 'BEL', points: 24, position: 2 },
      { race: 'NLD', points: 24, position: 2 }, { race: 'ITA', points: 28, position: 2 },
      { race: 'AZE', points: 26, position: 2 }, { race: 'SGP', points: 24, position: 2 },
      { race: 'USX', points: 24, position: 2 }, { race: 'MXC', points: 24, position: 2 },
      { race: 'SAO', points: 26, position: 2 }, { race: 'LVG', points: 24, position: 2 }
    ],
    engineProfile: {
      power: 95,
      fuelEfficiency: 82,
      reliability: 88,
      heatMgmt: 75,
      driveability: 88,
      recovery: 82
    },
    upgrades: [
      { race: 7, name: 'SF-24 Evo', lapTimeDelta: -0.28, complexity: 3 },
      { race: 15, name: 'Spec 3', lapTimeDelta: -0.38, complexity: 4 }
    ],
    kpis: {
      position: 2,
      points: 640,
      wins: 3,
      reliabilityPct: 94.2,
      avgPointsPerRace: 29.1
    }
  },
  {
    id: 'mercedes',
    name: 'Mercedes',
    color: '#27F4D2',
    shortName: 'MER',
    race2024: [
      { race: 'BHR', points: 27, position: 3 }, { race: 'SAU', points: 24, position: 3 },
      { race: 'AUS', points: 26, position: 3 }, { race: 'JPN', points: 26, position: 3 },
      { race: 'CHN', points: 26, position: 3 }, { race: 'MIA', points: 24, position: 3 },
      { race: 'IML', points: 24, position: 3 }, { race: 'MON', points: 24, position: 3 },
      { race: 'CAN', points: 24, position: 3 }, { race: 'ESP', points: 24, position: 3 },
      { race: 'AUT', points: 26, position: 3 }, { race: 'GBR', points: 24, position: 3 },
      { race: 'HUN', points: 26, position: 3 }, { race: 'BEL', points: 26, position: 3 },
      { race: 'NLD', points: 26, position: 3 }, { race: 'ITA', points: 24, position: 3 },
      { race: 'AZE', points: 24, position: 3 }, { race: 'SGP', points: 26, position: 3 },
      { race: 'USX', points: 26, position: 3 }, { race: 'MXC', points: 26, position: 3 },
      { race: 'SAO', points: 24, position: 3 }, { race: 'LVG', points: 26, position: 3 }
    ],
    engineProfile: {
      power: 90,
      fuelEfficiency: 92,
      reliability: 90,
      heatMgmt: 88,
      driveability: 92,
      recovery: 85
    },
    upgrades: [
      { race: 5, name: 'W15 Spec B', lapTimeDelta: -0.24, complexity: 2 },
      { race: 12, name: 'W15 Spec C', lapTimeDelta: -0.35, complexity: 3 }
    ],
    kpis: {
      position: 3,
      points: 585,
      wins: 3,
      reliabilityPct: 95.6,
      avgPointsPerRace: 26.6
    }
  },
  {
    id: 'mclaren',
    name: 'McLaren',
    color: '#FF8000',
    shortName: 'MCL',
    race2024: [
      { race: 'BHR', points: 16, position: 4 }, { race: 'SAU', points: 20, position: 4 },
      { race: 'AUS', points: 26, position: 4 }, { race: 'JPN', points: 26, position: 4 },
      { race: 'CHN', points: 26, position: 4 }, { race: 'MIA', points: 30, position: 4 },
      { race: 'IML', points: 30, position: 4 }, { race: 'MON', points: 24, position: 4 },
      { race: 'CAN', points: 30, position: 4 }, { race: 'ESP', points: 30, position: 4 },
      { race: 'AUT', points: 30, position: 4 }, { race: 'GBR', points: 30, position: 4 },
      { race: 'HUN', points: 30, position: 4 }, { race: 'BEL', points: 30, position: 4 },
      { race: 'NLD', points: 30, position: 4 }, { race: 'ITA', points: 30, position: 4 },
      { race: 'AZE', points: 30, position: 4 }, { race: 'SGP', points: 30, position: 4 },
      { race: 'USX', points: 30, position: 4 }, { race: 'MXC', points: 30, position: 4 },
      { race: 'SAO', points: 30, position: 4 }, { race: 'LVG', points: 30, position: 4 }
    ],
    engineProfile: {
      power: 88,
      fuelEfficiency: 90,
      reliability: 92,
      heatMgmt: 85,
      driveability: 90,
      recovery: 88
    },
    upgrades: [
      { race: 3, name: 'MCL60 Spec B', lapTimeDelta: -0.35, complexity: 3 },
      { race: 9, name: 'MCL60 Spec C', lapTimeDelta: -0.42, complexity: 4 }
    ],
    kpis: {
      position: 4,
      points: 580,
      wins: 4,
      reliabilityPct: 96.4,
      avgPointsPerRace: 26.4
    }
  },
  {
    id: 'aston-martin',
    name: 'Aston Martin',
    color: '#229971',
    shortName: 'AMR',
    race2024: [
      { race: 'BHR', points: 27, position: 4 }, { race: 'SAU', points: 16, position: 5 },
      { race: 'AUS', points: 16, position: 5 }, { race: 'JPN', points: 16, position: 5 },
      { race: 'CHN', points: 16, position: 5 }, { race: 'MIA', points: 16, position: 5 },
      { race: 'IML', points: 16, position: 5 }, { race: 'MON', points: 16, position: 5 },
      { race: 'CAN', points: 16, position: 5 }, { race: 'ESP', points: 16, position: 5 },
      { race: 'AUT', points: 16, position: 5 }, { race: 'GBR', points: 16, position: 5 },
      { race: 'HUN', points: 16, position: 5 }, { race: 'BEL', points: 16, position: 5 },
      { race: 'NLD', points: 16, position: 5 }, { race: 'ITA', points: 16, position: 5 },
      { race: 'AZE', points: 16, position: 5 }, { race: 'SGP', points: 16, position: 5 },
      { race: 'USX', points: 16, position: 5 }, { race: 'MXC', points: 16, position: 5 },
      { race: 'SAO', points: 16, position: 5 }, { race: 'LVG', points: 16, position: 5 }
    ],
    engineProfile: {
      power: 82,
      fuelEfficiency: 85,
      reliability: 88,
      heatMgmt: 82,
      driveability: 80,
      recovery: 78
    },
    upgrades: [
      { race: 4, name: 'AMR24 Spec B', lapTimeDelta: -0.18, complexity: 2 },
      { race: 11, name: 'AMR24 Spec C', lapTimeDelta: -0.25, complexity: 3 }
    ],
    kpis: {
      position: 5,
      points: 380,
      wins: 0,
      reliabilityPct: 93.2,
      avgPointsPerRace: 17.3
    }
  },
  {
    id: 'williams',
    name: 'Williams',
    color: '#64C4FF',
    shortName: 'WIL',
    race2024: [
      { race: 'BHR', points: 0, position: 8 }, { race: 'SAU', points: 0, position: 9 },
      { race: 'AUS', points: 4, position: 7 }, { race: 'JPN', points: 0, position: 9 },
      { race: 'CHN', points: 0, position: 10 }, { race: 'MIA', points: 4, position: 8 },
      { race: 'IML', points: 0, position: 9 }, { race: 'MON', points: 0, position: 10 },
      { race: 'CAN', points: 0, position: 10 }, { race: 'ESP', points: 0, position: 9 },
      { race: 'AUT', points: 0, position: 10 }, { race: 'GBR', points: 4, position: 8 },
      { race: 'HUN', points: 0, position: 9 }, { race: 'BEL', points: 4, position: 8 },
      { race: 'NLD', points: 0, position: 10 }, { race: 'ITA', points: 0, position: 9 },
      { race: 'AZE', points: 4, position: 8 }, { race: 'SGP', points: 0, position: 10 },
      { race: 'USX', points: 0, position: 9 }, { race: 'MXC', points: 0, position: 10 },
      { race: 'SAO', points: 4, position: 8 }, { race: 'LVG', points: 0, position: 9 }
    ],
    engineProfile: {
      power: 85,
      fuelEfficiency: 82,
      reliability: 80,
      heatMgmt: 75,
      driveability: 72,
      recovery: 70
    },
    upgrades: [
      { race: 3, name: 'FW46 Spec B', lapTimeDelta: -0.22, complexity: 2 },
      { race: 14, name: 'FW46 Spec C', lapTimeDelta: -0.30, complexity: 3 }
    ],
    kpis: {
      position: 8,
      points: 32,
      wins: 0,
      reliabilityPct: 88.5,
      avgPointsPerRace: 1.5
    }
  }
];

export default constructorsData;
