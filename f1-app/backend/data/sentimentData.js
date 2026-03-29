const races = ['Bahrain', 'Saudi Arabia', 'Australia', 'Japan', 'China', 'Miami', 'Emilia Romagna', 'Monaco', 'Canada', 'Spain'];

const driverSentiment = {
  VER: {
    currentScore: 74,
    label: 'Positive',
    teamColor: '#3671C6',
    breakdown: { positive: 68, neutral: 18, negative: 14 },
    timeline: [
      { race: 'Bahrain', practice: 82, quali: 85, raceDay: 90 },
      { race: 'Saudi Arabia', practice: 78, quali: 80, raceDay: 76 },
      { race: 'Australia', practice: 70, quali: 65, raceDay: 55 },
      { race: 'Japan', practice: 75, quali: 88, raceDay: 92 },
      { race: 'China', practice: 80, quali: 82, raceDay: 78 },
      { race: 'Miami', practice: 72, quali: 68, raceDay: 60 },
      { race: 'Emilia Romagna', practice: 65, quali: 70, raceDay: 74 },
      { race: 'Monaco', practice: 58, quali: 55, raceDay: 52 },
      { race: 'Canada', practice: 70, quali: 75, raceDay: 80 },
      { race: 'Spain', practice: 72, quali: 74, raceDay: 74 }
    ],
    trending: [
      { tag: '#VerstappenWDC', mentions: 24200, trend: 'up' },
      { tag: '#MaxFrustration', mentions: 18400, trend: 'down' },
      { tag: '#RedBullPace', mentions: 15800, trend: 'down' },
      { tag: '#DutchGP', mentions: 12100, trend: 'up' },
      { tag: '#SimRacing', mentions: 8900, trend: 'stable' }
    ],
    platforms: [
      { name: 'Twitter', score: 71, pct: 68 },
      { name: 'Reddit', score: 78, pct: 74 },
      { name: 'Sky Sports', score: 80, pct: 76 },
      { name: 'BBC Sport', score: 68, pct: 62 }
    ],
    recentEvents: [
      { time: '2h ago', source: 'TWITTER', text: 'Verstappen sets blistering pace in FP2', delta: 8 },
      { time: '5h ago', source: 'REDDIT', text: 'Discussion: Is Max losing his edge this season?', delta: -5 },
      { time: '1d ago', source: 'MEDIA', text: 'Sky Sports interview — relaxed and confident pre-race', delta: 6 },
      { time: '2d ago', source: 'TWITTER', text: 'Max shares sim lap — fans impressed by commitment', delta: 4 },
      { time: '3d ago', source: 'REDDIT', text: 'RB20 development stalling — concern threads trending', delta: -12 }
    ]
  },
  NOR: {
    currentScore: 88,
    label: 'Positive',
    teamColor: '#FF8000',
    breakdown: { positive: 82, neutral: 12, negative: 6 },
    timeline: [
      { race: 'Bahrain', practice: 65, quali: 68, raceDay: 72 },
      { race: 'Saudi Arabia', practice: 70, quali: 72, raceDay: 75 },
      { race: 'Australia', practice: 72, quali: 78, raceDay: 80 },
      { race: 'Japan', practice: 74, quali: 76, raceDay: 78 },
      { race: 'China', practice: 78, quali: 80, raceDay: 82 },
      { race: 'Miami', practice: 85, quali: 90, raceDay: 95 },
      { race: 'Emilia Romagna', practice: 82, quali: 85, raceDay: 88 },
      { race: 'Monaco', practice: 80, quali: 82, raceDay: 84 },
      { race: 'Canada', practice: 84, quali: 86, raceDay: 88 },
      { race: 'Spain', practice: 86, quali: 88, raceDay: 88 }
    ],
    trending: [
      { tag: '#NorrisWin', mentions: 31500, trend: 'up' },
      { tag: '#McLarenEra', mentions: 28200, trend: 'up' },
      { tag: '#LandoSZN', mentions: 22800, trend: 'up' },
      { tag: '#PapayaPower', mentions: 16400, trend: 'stable' },
      { tag: '#WDCContender', mentions: 14100, trend: 'up' }
    ],
    platforms: [
      { name: 'Twitter', score: 90, pct: 86 },
      { name: 'Reddit', score: 88, pct: 84 },
      { name: 'Sky Sports', score: 85, pct: 80 },
      { name: 'BBC Sport', score: 82, pct: 78 }
    ],
    recentEvents: [
      { time: '1h ago', source: 'TWITTER', text: 'Norris posts fastest sector 2 time in practice', delta: 12 },
      { time: '4h ago', source: 'MEDIA', text: 'McLaren confirms major upgrade package for Lando', delta: 10 },
      { time: '1d ago', source: 'REDDIT', text: 'Fan appreciation thread hits 15k upvotes', delta: 8 },
      { time: '2d ago', source: 'TWITTER', text: 'Lando charity stream raises $200k', delta: 15 },
      { time: '3d ago', source: 'MEDIA', text: 'Norris: "This is our year" — Sky interview', delta: 6 }
    ]
  },
  HAM: {
    currentScore: 70,
    label: 'Positive',
    teamColor: '#27F4D2',
    breakdown: { positive: 60, neutral: 22, negative: 18 },
    timeline: [
      { race: 'Bahrain', practice: 60, quali: 55, raceDay: 58 },
      { race: 'Saudi Arabia', practice: 58, quali: 60, raceDay: 62 },
      { race: 'Australia', practice: 62, quali: 65, raceDay: 68 },
      { race: 'Japan', practice: 60, quali: 58, raceDay: 55 },
      { race: 'China', practice: 64, quali: 66, raceDay: 70 },
      { race: 'Miami', practice: 68, quali: 72, raceDay: 74 },
      { race: 'Emilia Romagna', practice: 66, quali: 68, raceDay: 65 },
      { race: 'Monaco', practice: 70, quali: 72, raceDay: 68 },
      { race: 'Canada', practice: 72, quali: 74, raceDay: 76 },
      { race: 'Spain', practice: 68, quali: 70, raceDay: 70 }
    ],
    trending: [
      { tag: '#HamiltonLegacy', mentions: 20100, trend: 'stable' },
      { tag: '#StillWeRise', mentions: 18500, trend: 'up' },
      { tag: '#MercedesBounce', mentions: 14200, trend: 'down' },
      { tag: '#LH44', mentions: 12800, trend: 'stable' },
      { tag: '#GOAT', mentions: 9600, trend: 'up' }
    ],
    platforms: [
      { name: 'Twitter', score: 72, pct: 68 },
      { name: 'Reddit', score: 65, pct: 58 },
      { name: 'Sky Sports', score: 78, pct: 74 },
      { name: 'BBC Sport', score: 75, pct: 70 }
    ],
    recentEvents: [
      { time: '3h ago', source: 'TWITTER', text: 'Hamilton shares throwback to 2020 dominance', delta: 4 },
      { time: '6h ago', source: 'MEDIA', text: 'Sky: Mercedes still 0.3s off the pace in practice', delta: -6 },
      { time: '1d ago', source: 'REDDIT', text: 'Fan debate: Should Lewis retire?', delta: -8 },
      { time: '2d ago', source: 'TWITTER', text: 'Lewis at fashion week — 500k likes', delta: 5 },
      { time: '3d ago', source: 'MEDIA', text: 'Hamilton: "I believe we can win before the season ends"', delta: 7 }
    ]
  },
  LEC: {
    currentScore: 78,
    label: 'Positive',
    teamColor: '#E8002D',
    breakdown: { positive: 72, neutral: 16, negative: 12 },
    timeline: [
      { race: 'Bahrain', practice: 75, quali: 78, raceDay: 70 },
      { race: 'Saudi Arabia', practice: 72, quali: 74, raceDay: 68 },
      { race: 'Australia', practice: 80, quali: 82, raceDay: 85 },
      { race: 'Japan', practice: 76, quali: 78, raceDay: 74 },
      { race: 'China', practice: 74, quali: 72, raceDay: 70 },
      { race: 'Miami', practice: 70, quali: 68, raceDay: 72 },
      { race: 'Emilia Romagna', practice: 78, quali: 80, raceDay: 82 },
      { race: 'Monaco', practice: 90, quali: 92, raceDay: 88 },
      { race: 'Canada', practice: 74, quali: 76, raceDay: 78 },
      { race: 'Spain', practice: 76, quali: 78, raceDay: 78 }
    ],
    trending: [
      { tag: '#Leclerc', mentions: 19800, trend: 'up' },
      { tag: '#FerrariDream', mentions: 17200, trend: 'stable' },
      { tag: '#MonacoKing', mentions: 22400, trend: 'up' },
      { tag: '#CharlieWins', mentions: 11600, trend: 'up' },
      { tag: '#Tifosi', mentions: 9100, trend: 'stable' }
    ],
    platforms: [
      { name: 'Twitter', score: 80, pct: 76 },
      { name: 'Reddit', score: 76, pct: 72 },
      { name: 'Sky Sports', score: 74, pct: 70 },
      { name: 'BBC Sport', score: 72, pct: 68 }
    ],
    recentEvents: [
      { time: '2h ago', source: 'TWITTER', text: 'Leclerc fastest in FP1 — tifosi go wild', delta: 10 },
      { time: '5h ago', source: 'REDDIT', text: 'Ferrari strategy masterclass appreciation post', delta: 8 },
      { time: '1d ago', source: 'MEDIA', text: 'Binotto praises Charles consistency', delta: 5 },
      { time: '2d ago', source: 'TWITTER', text: 'Charles piano video goes viral — 2M views', delta: 12 },
      { time: '3d ago', source: 'MEDIA', text: 'Ferrari announce Monaco-spec upgrades', delta: 6 }
    ]
  },
  RUS: {
    currentScore: 65,
    label: 'Neutral',
    teamColor: '#27F4D2',
    breakdown: { positive: 52, neutral: 30, negative: 18 },
    timeline: [
      { race: 'Bahrain', practice: 58, quali: 62, raceDay: 60 },
      { race: 'Saudi Arabia', practice: 60, quali: 64, raceDay: 66 },
      { race: 'Australia', practice: 70, quali: 72, raceDay: 75 },
      { race: 'Japan', practice: 62, quali: 60, raceDay: 58 },
      { race: 'China', practice: 64, quali: 66, raceDay: 68 },
      { race: 'Miami', practice: 66, quali: 68, raceDay: 65 },
      { race: 'Emilia Romagna', practice: 60, quali: 62, raceDay: 64 },
      { race: 'Monaco', practice: 58, quali: 56, raceDay: 54 },
      { race: 'Canada', practice: 68, quali: 70, raceDay: 72 },
      { race: 'Spain', practice: 64, quali: 65, raceDay: 65 }
    ],
    trending: [
      { tag: '#Russell63', mentions: 8900, trend: 'stable' },
      { tag: '#MrSaturday', mentions: 7200, trend: 'down' },
      { tag: '#MercedesDrivers', mentions: 6800, trend: 'stable' },
      { tag: '#GeorgeRussell', mentions: 5400, trend: 'stable' },
      { tag: '#TeamOrders', mentions: 4100, trend: 'down' }
    ],
    platforms: [
      { name: 'Twitter', score: 64, pct: 60 },
      { name: 'Reddit', score: 62, pct: 56 },
      { name: 'Sky Sports', score: 70, pct: 66 },
      { name: 'BBC Sport', score: 68, pct: 64 }
    ],
    recentEvents: [
      { time: '4h ago', source: 'TWITTER', text: 'Russell P6 in practice — disappointing pace', delta: -4 },
      { time: '8h ago', source: 'REDDIT', text: 'Discussion thread: Is George being outperformed?', delta: -6 },
      { time: '1d ago', source: 'MEDIA', text: 'Wolff backs Russell to find pace in quali', delta: 3 },
      { time: '2d ago', source: 'TWITTER', text: 'George karting with young fans — wholesome content', delta: 8 },
      { time: '3d ago', source: 'MEDIA', text: 'Russell targeting podium at home race', delta: 4 }
    ]
  },
  ALO: {
    currentScore: 55,
    label: 'Neutral',
    teamColor: '#229971',
    breakdown: { positive: 40, neutral: 32, negative: 28 },
    timeline: [
      { race: 'Bahrain', practice: 72, quali: 70, raceDay: 68 },
      { race: 'Saudi Arabia', practice: 68, quali: 66, raceDay: 62 },
      { race: 'Australia', practice: 60, quali: 58, raceDay: 55 },
      { race: 'Japan', practice: 56, quali: 54, raceDay: 52 },
      { race: 'China', practice: 54, quali: 52, raceDay: 50 },
      { race: 'Miami', practice: 50, quali: 48, raceDay: 46 },
      { race: 'Emilia Romagna', practice: 52, quali: 54, raceDay: 56 },
      { race: 'Monaco', practice: 58, quali: 60, raceDay: 62 },
      { race: 'Canada', practice: 54, quali: 56, raceDay: 58 },
      { race: 'Spain', practice: 52, quali: 54, raceDay: 55 }
    ],
    trending: [
      { tag: '#ElPlan', mentions: 11200, trend: 'down' },
      { tag: '#Alonso', mentions: 9800, trend: 'stable' },
      { tag: '#AstonMartin', mentions: 7600, trend: 'down' },
      { tag: '#FernandoMagic', mentions: 5200, trend: 'down' },
      { tag: '#Retire?', mentions: 4800, trend: 'up' }
    ],
    platforms: [
      { name: 'Twitter', score: 52, pct: 48 },
      { name: 'Reddit', score: 58, pct: 54 },
      { name: 'Sky Sports', score: 60, pct: 56 },
      { name: 'BBC Sport', score: 56, pct: 52 }
    ],
    recentEvents: [
      { time: '3h ago', source: 'TWITTER', text: 'Alonso: 2024 car is "undriveable" in low-speed', delta: -8 },
      { time: '7h ago', source: 'REDDIT', text: 'Aston Martin development has completely stalled thread', delta: -10 },
      { time: '1d ago', source: 'MEDIA', text: 'Fernando shows fighting spirit despite car struggles', delta: 4 },
      { time: '2d ago', source: 'TWITTER', text: 'Classic Alonso overtake compilation — 1M views', delta: 8 },
      { time: '3d ago', source: 'MEDIA', text: 'Newey arrival gives hope for 2025 — Alonso stays', delta: 6 }
    ]
  },
  PIA: {
    currentScore: 84,
    label: 'Positive',
    teamColor: '#FF8000',
    breakdown: { positive: 78, neutral: 16, negative: 6 },
    timeline: [
      { race: 'Bahrain', practice: 60, quali: 62, raceDay: 65 },
      { race: 'Saudi Arabia', practice: 64, quali: 66, raceDay: 70 },
      { race: 'Australia', practice: 72, quali: 78, raceDay: 82 },
      { race: 'Japan', practice: 74, quali: 76, raceDay: 78 },
      { race: 'China', practice: 76, quali: 78, raceDay: 80 },
      { race: 'Miami', practice: 78, quali: 80, raceDay: 82 },
      { race: 'Emilia Romagna', practice: 80, quali: 82, raceDay: 84 },
      { race: 'Monaco', practice: 76, quali: 78, raceDay: 80 },
      { race: 'Canada', practice: 82, quali: 84, raceDay: 86 },
      { race: 'Spain', practice: 82, quali: 84, raceDay: 84 }
    ],
    trending: [
      { tag: '#OscarPiastri', mentions: 16800, trend: 'up' },
      { tag: '#PapaYoung', mentions: 12400, trend: 'up' },
      { tag: '#RookieOfTheYear', mentions: 10200, trend: 'stable' },
      { tag: '#McLarenDuo', mentions: 8800, trend: 'up' },
      { tag: '#FutureStar', mentions: 7600, trend: 'up' }
    ],
    platforms: [
      { name: 'Twitter', score: 86, pct: 82 },
      { name: 'Reddit', score: 88, pct: 84 },
      { name: 'Sky Sports', score: 80, pct: 76 },
      { name: 'BBC Sport', score: 78, pct: 74 }
    ],
    recentEvents: [
      { time: '2h ago', source: 'TWITTER', text: 'Piastri closes gap to Norris in FP2 — impressive pace', delta: 8 },
      { time: '6h ago', source: 'REDDIT', text: 'Oscar appreciation: most improved driver of 2024', delta: 10 },
      { time: '1d ago', source: 'MEDIA', text: 'McLaren extends Piastri contract through 2028', delta: 14 },
      { time: '2d ago', source: 'TWITTER', text: 'Oscar deadpan interview reactions compilation', delta: 6 },
      { time: '3d ago', source: 'MEDIA', text: 'Piastri: "I want to challenge for the title next year"', delta: 5 }
    ]
  },
  SAI: {
    currentScore: 72,
    label: 'Positive',
    teamColor: '#0093CC',
    breakdown: { positive: 64, neutral: 22, negative: 14 },
    timeline: [
      { race: 'Bahrain', practice: 68, quali: 70, raceDay: 65 },
      { race: 'Saudi Arabia', practice: 66, quali: 68, raceDay: 72 },
      { race: 'Australia', practice: 82, quali: 85, raceDay: 90 },
      { race: 'Japan', practice: 70, quali: 72, raceDay: 68 },
      { race: 'China', practice: 68, quali: 66, raceDay: 64 },
      { race: 'Miami', practice: 72, quali: 74, raceDay: 76 },
      { race: 'Emilia Romagna', practice: 70, quali: 72, raceDay: 74 },
      { race: 'Monaco', practice: 74, quali: 76, raceDay: 72 },
      { race: 'Canada', practice: 70, quali: 72, raceDay: 74 },
      { race: 'Spain', practice: 70, quali: 72, raceDay: 72 }
    ],
    trending: [
      { tag: '#Sainz55', mentions: 10400, trend: 'stable' },
      { tag: '#SmoothOperator', mentions: 9200, trend: 'stable' },
      { tag: '#WilliamsMove', mentions: 14800, trend: 'up' },
      { tag: '#CarlosSainz', mentions: 7600, trend: 'stable' },
      { tag: '#Underrated', mentions: 5800, trend: 'up' }
    ],
    platforms: [
      { name: 'Twitter', score: 70, pct: 66 },
      { name: 'Reddit', score: 74, pct: 70 },
      { name: 'Sky Sports', score: 72, pct: 68 },
      { name: 'BBC Sport', score: 70, pct: 66 }
    ],
    recentEvents: [
      { time: '3h ago', source: 'TWITTER', text: 'Sainz looking competitive in practice at Barcelona', delta: 6 },
      { time: '7h ago', source: 'MEDIA', text: 'Carlos calm about 2025 transition — focused on now', delta: 4 },
      { time: '1d ago', source: 'REDDIT', text: 'Sainz Australia win was peak 2024 — appreciation thread', delta: 8 },
      { time: '2d ago', source: 'TWITTER', text: 'Father-son interview with Carlos Sr. goes viral', delta: 5 },
      { time: '3d ago', source: 'MEDIA', text: 'Sainz: "I will prove my worth wherever I go"', delta: 6 }
    ]
  }
};

export default driverSentiment;
