const driversData = [
  {
    id: 'ver',
    code: 'VER',
    name: 'Max Verstappen',
    number: 1,
    team: 'Red Bull Racing',
    teamColor: '#3671C6',
    nationality: 'NED',
    careerStats: {
      races: 197,
      wins: 62,
      poles: 40,
      podiums: 103,
      fastestLaps: 27,
      dnfs: 25,
      championships: 3,
      winPct: 31.5,
      avgFinish: 4.2
    },
    seasonHistory: [
      { year: 2024, team: 'Red Bull', teamColor: '#3671C6', position: 1, points: 437, wins: 19 },
      { year: 2023, team: 'Red Bull', teamColor: '#3671C6', position: 1, points: 575, wins: 19 },
      { year: 2022, team: 'Red Bull', teamColor: '#3671C6', position: 1, points: 454, wins: 15 },
      { year: 2021, team: 'Red Bull', teamColor: '#3671C6', position: 1, points: 395.5, wins: 10 },
      { year: 2020, team: 'Red Bull', teamColor: '#3671C6', position: 2, points: 214, wins: 2 },
      { year: 2019, team: 'Red Bull', teamColor: '#3671C6', position: 3, points: 278, wins: 3 },
      { year: 2018, team: 'Red Bull', teamColor: '#3671C6', position: 4, points: 249, wins: 2 }
    ],
    pointsTimeline: [
      { season: 2018, points: 249 },
      { season: 2019, points: 278 },
      { season: 2020, points: 214 },
      { season: 2021, points: 395.5 },
      { season: 2022, points: 454 },
      { season: 2023, points: 575 },
      { season: 2024, points: 437 }
    ]
  },
  {
    id: 'ham',
    code: 'HAM',
    name: 'Lewis Hamilton',
    number: 44,
    team: 'Mercedes',
    teamColor: '#27F4D2',
    nationality: 'GBR',
    careerStats: {
      races: 349,
      wins: 105,
      poles: 104,
      podiums: 195,
      fastestLaps: 67,
      dnfs: 53,
      championships: 7,
      winPct: 30.1,
      avgFinish: 4.8
    },
    seasonHistory: [
      { year: 2024, team: 'Mercedes', teamColor: '#27F4D2', position: 2, points: 374, wins: 2 },
      { year: 2023, team: 'Mercedes', teamColor: '#27F4D2', position: 3, points: 234, wins: 0 },
      { year: 2022, team: 'Mercedes', teamColor: '#27F4D2', position: 6, points: 215, wins: 0 },
      { year: 2021, team: 'Mercedes', teamColor: '#27F4D2', position: 2, points: 387.5, wins: 8 },
      { year: 2020, team: 'Mercedes', teamColor: '#27F4D2', position: 1, points: 413, wins: 11 },
      { year: 2019, team: 'Mercedes', teamColor: '#27F4D2', position: 1, points: 413, wins: 11 },
      { year: 2018, team: 'Mercedes', teamColor: '#27F4D2', position: 1, points: 408, wins: 11 }
    ],
    pointsTimeline: [
      { season: 2018, points: 408 },
      { season: 2019, points: 413 },
      { season: 2020, points: 413 },
      { season: 2021, points: 387.5 },
      { season: 2022, points: 215 },
      { season: 2023, points: 234 },
      { season: 2024, points: 374 }
    ]
  },
  {
    id: 'lec',
    code: 'LEC',
    name: 'Charles Leclerc',
    number: 16,
    team: 'Ferrari',
    teamColor: '#E8002D',
    nationality: 'MON',
    careerStats: {
      races: 120,
      wins: 5,
      poles: 8,
      podiums: 31,
      fastestLaps: 7,
      dnfs: 22,
      championships: 0,
      winPct: 4.2,
      avgFinish: 7.1
    },
    seasonHistory: [
      { year: 2024, team: 'Ferrari', teamColor: '#E8002D', position: 3, points: 345, wins: 3 },
      { year: 2023, team: 'Ferrari', teamColor: '#E8002D', position: 5, points: 206, wins: 0 },
      { year: 2022, team: 'Ferrari', teamColor: '#E8002D', position: 2, points: 308, wins: 3 },
      { year: 2021, team: 'Ferrari', teamColor: '#E8002D', position: 7, points: 159, wins: 0 },
      { year: 2020, team: 'Ferrari', teamColor: '#E8002D', position: 8, points: 98, wins: 0 },
      { year: 2019, team: 'Ferrari', teamColor: '#E8002D', position: 4, points: 215, wins: 2 },
      { year: 2018, team: 'Ferrari', teamColor: '#E8002D', position: 13, points: 39, wins: 0 }
    ],
    pointsTimeline: [
      { season: 2018, points: 39 },
      { season: 2019, points: 215 },
      { season: 2020, points: 98 },
      { season: 2021, points: 159 },
      { season: 2022, points: 308 },
      { season: 2023, points: 206 },
      { season: 2024, points: 345 }
    ]
  },
  {
    id: 'nor',
    code: 'NOR',
    name: 'Lando Norris',
    number: 4,
    team: 'McLaren',
    teamColor: '#FF8000',
    nationality: 'GBR',
    careerStats: {
      races: 110,
      wins: 1,
      poles: 4,
      podiums: 15,
      fastestLaps: 4,
      dnfs: 18,
      championships: 0,
      winPct: 0.9,
      avgFinish: 8.4
    },
    seasonHistory: [
      { year: 2024, team: 'McLaren', teamColor: '#FF8000', position: 4, points: 292, wins: 1 },
      { year: 2023, team: 'McLaren', teamColor: '#FF8000', position: 6, points: 205, wins: 0 },
      { year: 2022, team: 'McLaren', teamColor: '#FF8000', position: 7, points: 122, wins: 0 },
      { year: 2021, team: 'McLaren', teamColor: '#FF8000', position: 10, points: 44, wins: 0 },
      { year: 2020, team: 'McLaren', teamColor: '#FF8000', position: 9, points: 57, wins: 0 },
      { year: 2019, team: 'McLaren', teamColor: '#FF8000', position: 11, points: 49, wins: 0 },
      { year: 2018, team: 'McLaren', teamColor: '#FF8000', position: 21, points: 0, wins: 0 }
    ],
    pointsTimeline: [
      { season: 2018, points: 0 },
      { season: 2019, points: 49 },
      { season: 2020, points: 57 },
      { season: 2021, points: 44 },
      { season: 2022, points: 122 },
      { season: 2023, points: 205 },
      { season: 2024, points: 292 }
    ]
  },
  {
    id: 'alo',
    code: 'ALO',
    name: 'Fernando Alonso',
    number: 14,
    team: 'Aston Martin',
    teamColor: '#229971',
    nationality: 'ESP',
    careerStats: {
      races: 382,
      wins: 32,
      poles: 22,
      podiums: 106,
      fastestLaps: 26,
      dnfs: 73,
      championships: 2,
      winPct: 8.4,
      avgFinish: 6.2
    },
    seasonHistory: [
      { year: 2024, team: 'Aston Martin', teamColor: '#229971', position: 9, points: 70, wins: 0 },
      { year: 2023, team: 'Aston Martin', teamColor: '#229971', position: 4, points: 200, wins: 0 },
      { year: 2022, team: 'Alpine', teamColor: '#FF87BC', position: 9, points: 81, wins: 0 },
      { year: 2021, team: 'Alpine', teamColor: '#FF87BC', position: 10, points: 46, wins: 0 },
      { year: 2020, team: 'Renault', teamColor: '#FFF500', position: 13, points: 8, wins: 0 },
      { year: 2019, team: 'McLaren', teamColor: '#FF8000', position: 17, points: 0, wins: 0 },
      { year: 2018, team: 'McLaren', teamColor: '#FF8000', position: 15, points: 29, wins: 0 }
    ],
    pointsTimeline: [
      { season: 2018, points: 29 },
      { season: 2019, points: 0 },
      { season: 2020, points: 8 },
      { season: 2021, points: 46 },
      { season: 2022, points: 81 },
      { season: 2023, points: 200 },
      { season: 2024, points: 70 }
    ]
  },
  {
    id: 'rus',
    code: 'RUS',
    name: 'George Russell',
    number: 63,
    team: 'Mercedes',
    teamColor: '#27F4D2',
    nationality: 'GBR',
    careerStats: {
      races: 110,
      wins: 3,
      poles: 3,
      podiums: 13,
      fastestLaps: 5,
      dnfs: 15,
      championships: 0,
      winPct: 2.7,
      avgFinish: 8.9
    },
    seasonHistory: [
      { year: 2024, team: 'Mercedes', teamColor: '#27F4D2', position: 5, points: 245, wins: 1 },
      { year: 2023, team: 'Mercedes', teamColor: '#27F4D2', position: 2, points: 285, wins: 2 },
      { year: 2022, team: 'Mercedes', teamColor: '#27F4D2', position: 4, points: 275, wins: 1 },
      { year: 2021, team: 'Williams', teamColor: '#64C4FF', position: 15, points: 16, wins: 0 },
      { year: 2020, team: 'Williams', teamColor: '#64C4FF', position: 18, points: 3, wins: 0 },
      { year: 2019, team: 'Williams', teamColor: '#64C4FF', position: 19, points: 0, wins: 0 },
      { year: 2018, team: 'Williams', teamColor: '#64C4FF', position: 18, points: 0, wins: 0 }
    ],
    pointsTimeline: [
      { season: 2018, points: 0 },
      { season: 2019, points: 0 },
      { season: 2020, points: 3 },
      { season: 2021, points: 16 },
      { season: 2022, points: 275 },
      { season: 2023, points: 285 },
      { season: 2024, points: 245 }
    ]
  },
  {
    id: 'sai',
    code: 'SAI',
    name: 'Carlos Sainz',
    number: 55,
    team: 'Ferrari',
    teamColor: '#E8002D',
    nationality: 'ESP',
    careerStats: {
      races: 180,
      wins: 3,
      poles: 3,
      podiums: 18,
      fastestLaps: 8,
      dnfs: 28,
      championships: 0,
      winPct: 1.7,
      avgFinish: 8.6
    },
    seasonHistory: [
      { year: 2024, team: 'Ferrari', teamColor: '#E8002D', position: 6, points: 200, wins: 0 },
      { year: 2023, team: 'Ferrari', teamColor: '#E8002D', position: 7, points: 200, wins: 0 },
      { year: 2022, team: 'Ferrari', teamColor: '#E8002D', position: 5, points: 246, wins: 1 },
      { year: 2021, team: 'Ferrari', teamColor: '#E8002D', position: 8, points: 164.5, wins: 1 },
      { year: 2020, team: 'Renault', teamColor: '#FFF500', position: 10, points: 33, wins: 0 },
      { year: 2019, team: 'McLaren', teamColor: '#FF8000', position: 6, points: 96, wins: 0 },
      { year: 2018, team: 'Renault', teamColor: '#FFF500', position: 9, points: 53, wins: 0 }
    ],
    pointsTimeline: [
      { season: 2018, points: 53 },
      { season: 2019, points: 96 },
      { season: 2020, points: 33 },
      { season: 2021, points: 164.5 },
      { season: 2022, points: 246 },
      { season: 2023, points: 200 },
      { season: 2024, points: 200 }
    ]
  },
  {
    id: 'pia',
    code: 'PIA',
    name: 'Oscar Piastri',
    number: 81,
    team: 'McLaren',
    teamColor: '#FF8000',
    nationality: 'AUS',
    careerStats: {
      races: 44,
      wins: 2,
      poles: 2,
      podiums: 7,
      fastestLaps: 1,
      dnfs: 5,
      championships: 0,
      winPct: 4.5,
      avgFinish: 7.8
    },
    seasonHistory: [
      { year: 2024, team: 'McLaren', teamColor: '#FF8000', position: 6, points: 194, wins: 2 },
      { year: 2023, team: 'McLaren', teamColor: '#FF8000', position: 9, points: 56, wins: 0 },
      { year: 2022, team: 'McLaren', teamColor: '#FF8000', position: 21, points: 0, wins: 0 },
      { year: 2021, team: 'Prema', teamColor: '#6C3018', position: 1, points: 0, wins: 0 },
      { year: 2020, team: 'Prema', teamColor: '#6C3018', position: 1, points: 0, wins: 0 },
      { year: 2019, team: 'Prema', teamColor: '#6C3018', position: 2, points: 0, wins: 0 },
      { year: 2018, team: 'Prema', teamColor: '#6C3018', position: 3, points: 0, wins: 0 }
    ],
    pointsTimeline: [
      { season: 2018, points: 0 },
      { season: 2019, points: 0 },
      { season: 2020, points: 0 },
      { season: 2021, points: 0 },
      { season: 2022, points: 0 },
      { season: 2023, points: 56 },
      { season: 2024, points: 194 }
    ]
  },
  {
    id: 'str',
    code: 'STR',
    name: 'Lance Stroll',
    number: 18,
    team: 'Aston Martin',
    teamColor: '#229971',
    nationality: 'CAN',
    careerStats: {
      races: 150,
      wins: 0,
      poles: 0,
      podiums: 3,
      fastestLaps: 1,
      dnfs: 28,
      championships: 0,
      winPct: 0,
      avgFinish: 12.1
    },
    seasonHistory: [
      { year: 2024, team: 'Aston Martin', teamColor: '#229971', position: 12, points: 24, wins: 0 },
      { year: 2023, team: 'Aston Martin', teamColor: '#229971', position: 10, points: 74, wins: 0 },
      { year: 2022, team: 'Aston Martin', teamColor: '#229971', position: 15, points: 37, wins: 0 },
      { year: 2021, team: 'Aston Martin', teamColor: '#229971', position: 13, points: 34, wins: 0 },
      { year: 2020, team: 'Racing Point', teamColor: '#F596C8', position: 11, points: 30, wins: 0 },
      { year: 2019, team: 'Racing Point', teamColor: '#F596C8', position: 7, points: 84, wins: 0 },
      { year: 2018, team: 'Williams', teamColor: '#64C4FF', position: 17, points: 6, wins: 0 }
    ],
    pointsTimeline: [
      { season: 2018, points: 6 },
      { season: 2019, points: 84 },
      { season: 2020, points: 30 },
      { season: 2021, points: 34 },
      { season: 2022, points: 37 },
      { season: 2023, points: 74 },
      { season: 2024, points: 24 }
    ]
  },
  {
    id: 'gas',
    code: 'GAS',
    name: 'Pierre Gasly',
    number: 10,
    team: 'Alpine',
    teamColor: '#FF87BC',
    nationality: 'FRA',
    careerStats: {
      races: 150,
      wins: 1,
      poles: 0,
      podiums: 5,
      fastestLaps: 3,
      dnfs: 35,
      championships: 0,
      winPct: 0.7,
      avgFinish: 11.4
    },
    seasonHistory: [
      { year: 2024, team: 'Alpine', teamColor: '#FF87BC', position: 8, points: 84, wins: 0 },
      { year: 2023, team: 'Alpine', teamColor: '#FF87BC', position: 11, points: 62, wins: 0 },
      { year: 2022, team: 'AlphaTauri', teamColor: '#6692FF', position: 16, points: 23, wins: 0 },
      { year: 2021, team: 'AlphaTauri', teamColor: '#6692FF', position: 6, points: 110, wins: 1 },
      { year: 2020, team: 'AlphaTauri', teamColor: '#6692FF', position: 10, points: 75, wins: 0 },
      { year: 2019, team: ' Toro Rosso', teamColor: '#6692FF', position: 7, points: 92, wins: 0 },
      { year: 2018, team: 'Toro Rosso', teamColor: '#6692FF', position: 15, points: 29, wins: 0 }
    ],
    pointsTimeline: [
      { season: 2018, points: 29 },
      { season: 2019, points: 92 },
      { season: 2020, points: 75 },
      { season: 2021, points: 110 },
      { season: 2022, points: 23 },
      { season: 2023, points: 62 },
      { season: 2024, points: 84 }
    ]
  }
];

export default driversData;
