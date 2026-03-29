const circuitsData = [
  {
    id: 'bahrain',
    name: 'Bahrain International Circuit',
    country: 'Bahrain',
    flagEmoji: '🇧🇭',
    lapRecord: '1:31.447',
    lapRecordHolder: 'Pedro Piquet',
    lapRecordYear: 2020,
    length: 5.412,
    turns: 15,
    drsZones: 3,
    avgSpeed: 207.3,
    tyreWear: 3,
    weatherRisk: 'Clear',
    dna: {
      downforce: 75,
      topSpeed: 85,
      traction: 70,
      braking: 80,
      corneringSpeed: 75,
      streetCircuit: 0,
      overtaking: 80,
      tyreWear: 55
    },
    setup: {
      frontWing: 35,
      rearWing: 32,
      suspension: 45,
      brakeBias: 57
    },
    bestSuitedTeam: 'Red Bull Racing',
    bestSuitedReason: 'Exceptional traction and braking characteristics complement RB19s rear-limited driving style. Long full-throttle sections favor engine power advantage.',
    improvementTips: {
      rookie: ['Focus on braking stability into Turn 1', 'Master the hairpin exit to maximize lap 2 time'],
      amateur: ['Optimize DRS usage on the main straight', 'Work on sector 2 exit speeds'],
      semipro: ['Precise throttle application in low-traction zones', 'Embrace oversteer through Turn 4'],
      pro: ['Maximize slipstream benefit in DRS zones', 'Fine-tune brake cooling for qualifying']
    }
  },
  {
    id: 'monaco',
    name: 'Circuit de Monaco',
    country: 'Monaco',
    flagEmoji: '🇲🇨',
    lapRecord: '1:12.909',
    lapRecordHolder: 'Lewis Hamilton',
    lapRecordYear: 2023,
    length: 3.337,
    turns: 19,
    drsZones: 2,
    avgSpeed: 160.0,
    tyreWear: 2,
    weatherRisk: 'Variable',
    dna: {
      downforce: 95,
      topSpeed: 55,
      traction: 90,
      braking: 95,
      corneringSpeed: 90,
      streetCircuit: 100,
      overtaking: 25,
      tyreWear: 30
    },
    setup: {
      frontWing: 45,
      rearWing: 40,
      suspension: 65,
      brakeBias: 62
    },
    bestSuitedTeam: 'Ferrari',
    bestSuitedReason: 'Superb low-speed traction and braking from SF-23 suits narrow Monaco streets. Excellent drivability through slow corners gives Leclerc edge.',
    improvementTips: {
      rookie: ['Commit fully to every corner - hesitating costs time', 'Use the escape roads to learn the racing line'],
      amateur: ['Focus on exit quality over entry perfection', 'Manage throttle application in tunnel exit'],
      semipro: ['Push boundaries in Q3 - Monaco rewards commitment', 'Master the泳 complex rhythm sections'],
      pro: ['Optimize qualifying for pole position', 'Exploit team strategy for race wins']
    }
  },
  {
    id: 'monza',
    name: 'Autodromo Nazionale Monza',
    country: 'Italy',
    flagEmoji: '🇮🇹',
    lapRecord: '1:15.294',
    lapRecordHolder: 'Lewis Hamilton',
    lapRecordYear: 2020,
    length: 5.793,
    turns: 11,
    drsZones: 2,
    avgSpeed: 264.0,
    tyreWear: 3,
    weatherRisk: 'Clear',
    dna: {
      downforce: 35,
      topSpeed: 100,
      traction: 50,
      braking: 70,
      corneringSpeed: 60,
      streetCircuit: 0,
      overtaking: 85,
      tyreWear: 40
    },
    setup: {
      frontWing: 20,
      rearWing: 18,
      suspension: 25,
      brakeBias: 54
    },
    bestSuitedTeam: 'Ferrari',
    bestSuitedReason: 'Monza rewards raw top speed and low drag - Ferrari engine power advantage critical. Monoposto tradition favors Italian team.',
    improvementTips: {
      rookie: ['Stay flat through Variante Alta', 'Minimize time spent off-throttle in Curvo Grande'],
      amateur: ['Optimize slipstream on main straight', 'Braking stability key at Turn 1'],
      semipro: ['Push for slipstream battles', 'Maximize corner exit with minimal wings'],
      pro: ['Qualifying advantage crucial', 'Tire management for race distance']
    }
  },
  {
    id: 'silverstone',
    name: 'Silverstone Circuit',
    country: 'United Kingdom',
    flagEmoji: '🇬🇧',
    lapRecord: '1:27.369',
    lapRecordHolder: 'Max Verstappen',
    lapRecordYear: 2023,
    length: 5.891,
    turns: 18,
    drsZones: 2,
    avgSpeed: 232.0,
    tyreWear: 4,
    weatherRisk: 'Variable',
    dna: {
      downforce: 70,
      topSpeed: 90,
      traction: 75,
      braking: 85,
      corneringSpeed: 80,
      streetCircuit: 0,
      overtaking: 75,
      tyreWear: 65
    },
    setup: {
      frontWing: 32,
      rearWing: 28,
      suspension: 40,
      brakeBias: 56
    },
    bestSuitedTeam: 'Mercedes',
    bestSuitedReason: 'High-speed corners suit W14 stability. Maggots/Becketts complex demands front-end precision - Hamilton mastered this.',
    improvementTips: {
      rookie: ['Commit to Abbey and Farm', 'Learn the proper line through Maggots/Becketts'],
      amateur: ['Balance is key through high-speed corners', 'Manage tire temperature in Turn 1-2'],
      semipro: ['Use tow on the Wellington Straight', 'Push through Copse - its flat in F1'],
      pro: ['Qualifying crucial for race outcome', 'Weather can completely change strategy']
    }
  },
  {
    id: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    country: 'Belgium',
    flagEmoji: '🇧🇪',
    lapRecord: '1:46.286',
    lapRecordHolder: 'Max Verstappen',
    lapRecordYear: 2023,
    length: 7.004,
    turns: 19,
    drsZones: 3,
    avgSpeed: 223.0,
    tyreWear: 5,
    weatherRisk: 'High',
    dna: {
      downforce: 80,
      topSpeed: 95,
      traction: 65,
      braking: 75,
      corneringSpeed: 85,
      streetCircuit: 0,
      overtaking: 90,
      tyreWear: 90
    },
    setup: {
      frontWing: 38,
      rearWing: 35,
      suspension: 50,
      brakeBias: 55
    },
    bestSuitedTeam: 'Red Bull Racing',
    bestSuitedReason: 'Long straights favor engine power while Eau Rouge demands downforce - RB19 perfectly balanced. Rain adds unpredictability.',
    improvementTips: {
      rookie: ['Respect Eau Rouge - its harder than it looks', 'Learn Kemmel Straight DRS timing'],
      amateur: ['Focus on Les Combes exit', 'Rain strategy can win races here'],
      semipro: ['Push through Raidillon flat', 'Optimize tow on Kemmel Straight'],
      pro: ['Qualifying position critical but slipstream crucial', 'Tire management over race distance']
    }
  },
  {
    id: 'suzuka',
    name: 'Suzuka International Racing Course',
    country: 'Japan',
    flagEmoji: '🇯🇵',
    lapRecord: '1:30.983',
    lapRecordHolder: 'Lewis Hamilton',
    lapRecordYear: 2019,
    length: 5.807,
    turns: 18,
    drsZones: 2,
    avgSpeed: 209.0,
    tyreWear: 4,
    weatherRisk: 'Variable',
    dna: {
      downforce: 90,
      topSpeed: 80,
      traction: 85,
      braking: 90,
      corneringSpeed: 95,
      streetCircuit: 0,
      overtaking: 65,
      tyreWear: 70
    },
    setup: {
      frontWing: 40,
      rearWing: 36,
      suspension: 55,
      brakeBias: 58
    },
    bestSuitedTeam: 'Red Bull Racing',
    bestSuitedReason: 'Suzuka demands precision through 130R and Dragon Tail - Verstappen unmatched. Classic F1 circuit rewards experience.',
    improvementTips: {
      rookie: ['Commit to 130R - its flat in modern F1', 'Master the S Curves rhythm'],
      amateur: ['Focus on Degner curves exit', '130R requires full commitment'],
      semipro: ['Use DRS effectively on main straight', 'Optimize final corner exit for lap time'],
      pro: ['Qualifying crucial - passing difficult', 'Weather can change everything']
    }
  },
  {
    id: 'singapore',
    name: 'Marina Bay Street Circuit',
    country: 'Singapore',
    flagEmoji: '🇸🇬',
    lapRecord: '1:35.867',
    lapRecordHolder: 'Lewis Hamilton',
    lapRecordYear: 2023,
    length: 4.940,
    turns: 19,
    drsZones: 2,
    avgSpeed: 185.0,
    tyreWear: 5,
    weatherRisk: 'High',
    dna: {
      downforce: 95,
      topSpeed: 60,
      traction: 85,
      braking: 95,
      corneringSpeed: 80,
      streetCircuit: 100,
      overtaking: 30,
      tyreWear: 85
    },
    setup: {
      frontWig: 45,
      rearWing: 42,
      suspension: 70,
      brakeBias: 63
    },
    bestSuitedTeam: 'Ferrari',
    bestSuitedReason: 'Braking-heavy circuit suits Leclerc. Slow corners - Ferrari strength. Night race adds spectacle.',
    improvementTips: {
      rookie: ['Manage physical demands - its brutal', 'Stay cool in the wall'],
      amateur: ['Focus on exit quality from Turns 11-14', 'Managing heat is crucial'],
      semipro: ['Push through acceleration zones', 'Qualifying matters more here than most'],
      pro: ['Strategy flexibility key', 'Weather can create opportunities']
    }
  },
  {
    id: 'abu-dhabi',
    name: 'Yas Marina Circuit',
    country: 'UAE',
    flagEmoji: '🇦🇪',
    lapRecord: '1:23.450',
    lapRecordHolder: 'Max Verstappen',
    lapRecordYear: 2023,
    length: 5.281,
    turns: 16,
    drsZones: 3,
    avgSpeed: 205.0,
    tyreWear: 3,
    weatherRisk: 'Clear',
    dna: {
      downforce: 70,
      topSpeed: 90,
      traction: 70,
      braking: 75,
      corneringSpeed: 75,
      streetCircuit: 30,
      overtaking: 70,
      tyreWear: 45
    },
    setup: {
      frontWing: 33,
      rearWing: 30,
      suspension: 45,
      brakeBias: 56
    },
    bestSuitedTeam: 'Red Bull Racing',
    bestSuitedReason: 'Final race decider often - Verstappen dominates here. Long final straight perfect for overtakes.',
    improvementTips: {
      rookie: ['Master the hotel sector', 'Learn proper corner sequence in sector 3'],
      amateur: ['Use DRS effectively on long straight', 'Focus on Turn 8-9 complex'],
      semipro: ['Push for qualifying position', 'Tire degradation minor - push hard'],
      pro: ['Strategy critical in championship battles', 'Capitalize on any opponent mistakes']
    }
  },
  {
    id: 'austin',
    name: 'Circuit of the Americas',
    country: 'USA',
    flagEmoji: '🇺🇸',
    lapRecord: '1:36.169',
    lapRecordHolder: 'Lando Norris',
    lapRecordYear: 2023,
    length: 5.513,
    turns: 20,
    drsZones: 2,
    avgSpeed: 195.0,
    tyreWear: 4,
    weatherRisk: 'Clear',
    dna: {
      downforce: 75,
      topSpeed: 75,
      traction: 75,
      braking: 85,
      corneringSpeed: 80,
      streetCircuit: 0,
      overtaking: 75,
      tyreWear: 60
    },
    setup: {
      frontWing: 35,
      rearWing: 32,
      suspension: 50,
      brakeBias: 57
    },
    bestSuitedTeam: 'McLaren',
    bestSuitedReason: 'MCL38 excels through complexSector 1. US crowd favorite - Norris thrives under pressure.',
    improvementTips: {
      rookie: ['Commit to Turn 1 uphill', 'Master theesses sequence in sector 2'],
      amateur: ['Use DRS on main straight', 'Focus on exit speeds from Turns 9-10'],
      semipro: ['Push throughountain section flat', 'Qualifying advantage matters'],
      pro: ['Race pace crucial for podium', 'Strategy can overcome qualifying']
    }
  },
  {
    id: 'interlagos',
    name: 'Autodromo Jose Carlos Pace',
    country: 'Brazil',
    flagEmoji: '🇧🇷',
    lapRecord: '1:10.540',
    lapRecordHolder: 'Valtteri Bottas',
    lapRecordYear: 2022,
    length: 4.309,
    turns: 15,
    drsZones: 2,
    avgSpeed: 205.0,
    tyreWear: 4,
    weatherRisk: 'High',
    dna: {
      downforce: 80,
      topSpeed: 75,
      traction: 80,
      braking: 85,
      corneringSpeed: 85,
      streetCircuit: 0,
      overtaking: 85,
      tyreWear: 65
    },
    setup: {
      frontWing: 38,
      rearWing: 34,
      suspension: 55,
      brakeBias: 58
    },
    bestSuitedTeam: 'McLaren',
    bestSuitedReason: 'Interlagos rewards aggression - Norris style. Mixed conditions common, creating chaos.',
    improvementTips: {
      rookie: ['Respect Turns 1-2 - catching is easy', 'Learn Senna S oval properly'],
      amateur: ['Use tow on main straight', 'Focus on Turn 4 entry'],
      semipro: ['Push through Juncao flat', 'Qualifying important but overtakes possible'],
      pro: ['Rain creates opportunities', 'Starting tire choice critical']
    }
  },
  {
    id: 'baku',
    name: 'Baku City Circuit',
    country: 'Azerbaijan',
    flagEmoji: '🇦🇿',
    lapRecord: '1:40.203',
    lapRecordHolder: 'Charles Leclerc',
    lapRecordYear: 2023,
    length: 6.003,
    turns: 20,
    drsZones: 2,
    avgSpeed: 210.0,
    tyreWear: 3,
    weatherRisk: 'Clear',
    dna: {
      downforce: 60,
      topSpeed: 95,
      traction: 55,
      braking: 80,
      corneringSpeed: 65,
      streetCircuit: 75,
      overtaking: 55,
      tyreWear: 45
    },
    setup: {
      frontWing: 28,
      rearWing: 25,
      suspension: 35,
      brakeBias: 54
    },
    bestSuitedTeam: 'Ferrari',
    bestSuitedReason: 'Leclerc mastered this street circuit. Long straight favors top speed, but tight corners punish errors.',
    improvementTips: {
      rookie: ['Be careful at Turn 1 - walls are close', 'Learn the long straight DRS zone'],
      amateur: ['Focus on sector 2 technical section', 'Brake early into Turn 3'],
      semipro: ['Push through castle section', 'Capitalize on any safety car opportunities'],
      pro: ['Qualifying crucial - street circuit', 'Strategy flexibility matters']
    }
  },
  {
    id: 'zandvoort',
    name: 'Circuit Zandvoort',
    country: 'Netherlands',
    flagEmoji: '🇳🇱',
    lapRecord: '1:11.097',
    lapRecordHolder: 'Lando Norris',
    lapRecordYear: 2023,
    length: 4.259,
    turns: 14,
    drsZones: 2,
    avgSpeed: 205.0,
    tyreWear: 4,
    weatherRisk: 'Clear',
    dna: {
      downforce: 85,
      topSpeed: 70,
      traction: 80,
      braking: 90,
      corneringSpeed: 90,
      streetCircuit: 0,
      overtaking: 55,
      tyreWear: 70
    },
    setup: {
      frontWing: 42,
      rearWing: 38,
      suspension: 60,
      brakeBias: 60
    },
    bestSuitedTeam: 'Red Bull Racing',
    bestSuitedReason: 'Home race for Verstappen - Orange Army support. Arie Luyendijk banking adds unique challenge.',
    improvementTips: {
      rookie: ['Respect the banking - its tricky', 'Learn the proper line through Turn 3'],
      amateur: ['Use DRS on main straight', 'Focus on exit from Hugenholtz Bocht'],
      semipro: ['Push through banking flat if possible', 'Capitalize on home crowd energy'],
      pro: ['Qualifying crucial - overtakes difficult', 'Tire degradation significant']
    }
  }
];

export default circuitsData;
