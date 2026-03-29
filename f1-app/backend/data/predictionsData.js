export const leaderboard = [
  { rank: 1, username: 'PitWallKing', correct: 34, points: 2840, streak: 7, isCurrentUser: false },
  { rank: 2, username: 'StrategyGuru', correct: 31, points: 2650, streak: 4, isCurrentUser: false },
  { rank: 3, username: 'ApexHunter', correct: 29, points: 2480, streak: 6, isCurrentUser: false },
  { rank: 4, username: 'You', correct: 27, points: 2310, streak: 4, isCurrentUser: true },
  { rank: 5, username: 'DRSzone', correct: 26, points: 2190, streak: 3, isCurrentUser: false },
  { rank: 6, username: 'UndercutMaster', correct: 24, points: 2050, streak: 2, isCurrentUser: false },
  { rank: 7, username: 'GridWalker', correct: 22, points: 1880, streak: 1, isCurrentUser: false },
  { rank: 8, username: 'TyreWhisperer', correct: 21, points: 1740, streak: 0, isCurrentUser: false },
  { rank: 9, username: 'SlipstreamAce', correct: 19, points: 1590, streak: 2, isCurrentUser: false },
  { rank: 10, username: 'CheckeredFlag', correct: 17, points: 1420, streak: 1, isCurrentUser: false }
];

export const currentRace = {
  gpName: '2025 Spanish Grand Prix',
  round: 9,
  circuit: 'Circuit de Barcelona-Catalunya',
  targetDate: '2025-06-01T14:00:00Z',
  questions: [
    {
      id: 'q1',
      label: 'RACE WINNER',
      points: 100,
      type: 'driver',
      options: ['VER', 'NOR', 'HAM', 'LEC', 'RUS', 'PIA', 'ALO', 'SAI']
    },
    {
      id: 'q2',
      label: 'POLE POSITION',
      points: 75,
      type: 'driver',
      options: ['VER', 'NOR', 'HAM', 'LEC', 'RUS', 'PIA', 'ALO', 'SAI']
    },
    {
      id: 'q3',
      label: 'FASTEST LAP',
      points: 50,
      type: 'driver',
      options: ['VER', 'NOR', 'HAM', 'LEC', 'RUS', 'PIA', 'ALO', 'SAI']
    },
    {
      id: 'q4',
      label: 'SAFETY CAR DEPLOYED?',
      points: 30,
      type: 'yesno',
      options: ['YES', 'NO']
    },
    {
      id: 'q5',
      label: 'WILL IT RAIN?',
      points: 20,
      type: 'yesno',
      options: ['YES', 'NO']
    }
  ]
};

export const previousResults = {
  q1: { answer: 'VER', result: 'NOR' },
  q2: { answer: 'NOR', result: 'NOR' },
  q3: { answer: 'VER', result: 'VER' },
  q4: { answer: 'YES', result: 'YES' },
  q5: { answer: 'NO', result: 'NO' }
};

export const driverTeamColors = {
  VER: '#3671C6',
  NOR: '#FF8000',
  HAM: '#27F4D2',
  LEC: '#E8002D',
  RUS: '#27F4D2',
  PIA: '#FF8000',
  ALO: '#229971',
  SAI: '#0093CC'
};
