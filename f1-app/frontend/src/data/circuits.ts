export interface CircuitDNA {
  HighDownforce: number;
  TopSpeed: number;
  Traction: number;
  Braking: number;
  CorneringSpeed: number;
  StreetCircuit: number;
  Overtaking: number;
  TyreWear: number;
}

export interface CarTypes {
  highDownforce: number;
  topSpeed: number;
  balanced: number;
}

export interface CircuitSetup {
  frontWing: number;
  rearWing: number;
  suspension: number;
  brakeBias: number;
}

export interface CircuitData {
  code: string;
  name: string;
  shortName: string;
  country: string;
  flag: string;
  length: number;
  turns: number;
  drs: number;
  lapRecord: string;
  lapRecordHolder: string;
  lapRecordYear: number;
  avgSpeed: number;
  tyreWear: number;
  weather: 'clear' | 'variable' | 'high';
  flags: string[];
  dna: CircuitDNA;
  carTypes: CarTypes;
  bestTeam: string;
  bestReason: string;
  setup: CircuitSetup;
}

export const circuitsData: Record<string, CircuitData> = {
  bahrain: {
    code: 'bahrain',
    name: 'Bahrain International Circuit',
    shortName: 'Bahrain',
    country: 'BHR',
    flag: '🇧🇭',
    length: 5.412,
    turns: 15,
    drs: 3,
    lapRecord: '1:31.447',
    lapRecordHolder: 'Hamilton',
    lapRecordYear: 2020,
    avgSpeed: 203,
    tyreWear: 3,
    weather: 'clear',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 7, TopSpeed: 5, Traction: 6, Braking: 8, CorneringSpeed: 7, StreetCircuit: 2, Overtaking: 6, TyreWear: 4 },
    carTypes: { highDownforce: 8, topSpeed: 4, balanced: 6 },
    bestTeam: 'RED BULL RACING',
    bestReason: 'High downforce requirement matches RB19\'s aerodynamic philosophy perfectly.',
    setup: { frontWing: 8, rearWing: 7, suspension: 6, brakeBias: 55 }
  },
  monaco: {
    code: 'monaco',
    name: 'Circuit de Monaco',
    shortName: 'Monaco',
    country: 'MCO',
    flag: '🇲🇨',
    length: 3.337,
    turns: 19,
    drs: 2,
    lapRecord: '1:12.909',
    lapRecordHolder: 'Hamilton',
    lapRecordYear: 2023,
    avgSpeed: 166,
    tyreWear: 5,
    weather: 'clear',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 10, TopSpeed: 2, Traction: 9, Braking: 10, CorneringSpeed: 10, StreetCircuit: 10, Overtaking: 2, TyreWear: 5 },
    carTypes: { highDownforce: 10, topSpeed: 2, balanced: 7 },
    bestTeam: 'RED BULL RACING',
    bestReason: 'Maximum downforce essential for tight Monaco corners and tunnel sections.',
    setup: { frontWing: 10, rearWing: 9, suspension: 9, brakeBias: 52 }
  },
  monza: {
    code: 'monza',
    name: 'Autodromo Monza',
    shortName: 'Monza',
    country: 'ITA',
    flag: '🇮🇹',
    length: 5.793,
    turns: 11,
    drs: 2,
    lapRecord: '1:15.294',
    lapRecordHolder: 'Hamilton',
    lapRecordYear: 2020,
    avgSpeed: 264,
    tyreWear: 2,
    weather: 'clear',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 2, TopSpeed: 10, Traction: 4, Braking: 6, CorneringSpeed: 3, StreetCircuit: 1, Overtaking: 7, TyreWear: 2 },
    carTypes: { highDownforce: 3, topSpeed: 10, balanced: 5 },
    bestTeam: 'FERRARI',
    bestReason: 'Monza rewards top speed and low drag - SF-23 excels on straights.',
    setup: { frontWing: 2, rearWing: 2, suspension: 3, brakeBias: 58 }
  },
  silverstone: {
    code: 'silverstone',
    name: 'Silverstone Circuit',
    shortName: 'Silverstone',
    country: 'GBR',
    flag: '🇬🇧',
    length: 5.891,
    turns: 18,
    drs: 2,
    lapRecord: '1:27.097',
    lapRecordHolder: 'Verstappen',
    lapRecordYear: 2023,
    avgSpeed: 233,
    tyreWear: 3,
    weather: 'variable',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 8, TopSpeed: 7, Traction: 7, Braking: 8, CorneringSpeed: 9, StreetCircuit: 1, Overtaking: 8, TyreWear: 3 },
    carTypes: { highDownforce: 8, topSpeed: 6, balanced: 8 },
    bestTeam: 'MERCEDES',
    bestReason: 'High-speed corners suit W15 balance and stability through Maggots/Becketts.',
    setup: { frontWing: 7, rearWing: 6, suspension: 5, brakeBias: 56 }
  },
  spa: {
    code: 'spa',
    name: 'Circuit de Spa-Francorchamps',
    shortName: 'Spa',
    country: 'BEL',
    flag: '🇧🇪',
    length: 7.004,
    turns: 19,
    drs: 3,
    lapRecord: '1:46.286',
    lapRecordHolder: 'Verstappen',
    lapRecordYear: 2023,
    avgSpeed: 223,
    tyreWear: 4,
    weather: 'high',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 7, TopSpeed: 8, Traction: 8, Braking: 6, CorneringSpeed: 9, StreetCircuit: 2, Overtaking: 8, TyreWear: 4 },
    carTypes: { highDownforce: 7, topSpeed: 8, balanced: 7 },
    bestTeam: 'RED BULL RACING',
    bestReason: 'Eau Rouge demands ultimate downforce - RB19 perfect for Raidillon commitment.',
    setup: { frontWing: 8, rearWing: 7, suspension: 6, brakeBias: 54 }
  },
  suzuka: {
    code: 'suzuka',
    name: 'Suzuka International',
    shortName: 'Suzuka',
    country: 'JPN',
    flag: '🇯🇵',
    length: 5.807,
    turns: 18,
    drs: 2,
    lapRecord: '1:30.983',
    lapRecordHolder: 'Russell',
    lapRecordYear: 2024,
    avgSpeed: 209,
    tyreWear: 4,
    weather: 'variable',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 9, TopSpeed: 5, Traction: 8, Braking: 8, CorneringSpeed: 10, StreetCircuit: 2, Overtaking: 5, TyreWear: 4 },
    carTypes: { highDownforce: 9, topSpeed: 4, balanced: 7 },
    bestTeam: 'RED BULL RACING',
    bestReason: 'Suzuka\'s 130R and Esses require RB19\'s high-speed stability.',
    setup: { frontWing: 9, rearWing: 8, suspension: 7, brakeBias: 55 }
  },
  singapore: {
    code: 'singapore',
    name: 'Marina Bay Street',
    shortName: 'Singapore',
    country: 'SGP',
    flag: '🇸🇬',
    length: 4.94,
    turns: 19,
    drs: 2,
    lapRecord: '1:35.867',
    lapRecordHolder: 'Hamilton',
    lapRecordYear: 2023,
    avgSpeed: 187,
    tyreWear: 5,
    weather: 'high',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 10, TopSpeed: 3, Traction: 9, Braking: 10, CorneringSpeed: 9, StreetCircuit: 10, Overtaking: 3, TyreWear: 5 },
    carTypes: { highDownforce: 10, topSpeed: 2, balanced: 7 },
    bestTeam: 'RED BULL RACING',
    bestReason: 'Street circuit demands downforce - RB19 dominant in tight corners.',
    setup: { frontWing: 10, rearWing: 9, suspension: 9, brakeBias: 53 }
  },
  abudhabi: {
    code: 'abudhabi',
    name: 'Yas Marina Circuit',
    shortName: 'Abu Dhabi',
    country: 'UAE',
    flag: '🇦🇪',
    length: 5.281,
    turns: 16,
    drs: 3,
    lapRecord: '1:24.319',
    lapRecordHolder: 'Verstappen',
    lapRecordYear: 2023,
    avgSpeed: 205,
    tyreWear: 2,
    weather: 'clear',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 5, TopSpeed: 8, Traction: 6, Braking: 6, CorneringSpeed: 5, StreetCircuit: 4, Overtaking: 7, TyreWear: 2 },
    carTypes: { highDownforce: 5, topSpeed: 8, balanced: 6 },
    bestTeam: 'MERCEDES',
    bestReason: 'Yas Marina\'s long straights suit Mercedes power unit advantage.',
    setup: { frontWing: 5, rearWing: 4, suspension: 4, brakeBias: 57 }
  },
  austin: {
    code: 'austin',
    name: 'COTA - Austin',
    shortName: 'Austin',
    country: 'USA',
    flag: '🇺🇸',
    length: 5.513,
    turns: 20,
    drs: 2,
    lapRecord: '1:36.523',
    lapRecordHolder: 'Hamilton',
    lapRecordYear: 2023,
    avgSpeed: 203,
    tyreWear: 3,
    weather: 'clear',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 7, TopSpeed: 6, Traction: 6, Braking: 9, CorneringSpeed: 8, StreetCircuit: 2, Overtaking: 7, TyreWear: 3 },
    carTypes: { highDownforce: 7, topSpeed: 5, balanced: 7 },
    bestTeam: 'RED BULL RACING',
    bestReason: 'Turn 1-2 complex demands RB19 aero efficiency for sector 1.',
    setup: { frontWing: 7, rearWing: 6, suspension: 6, brakeBias: 55 }
  },
  interlagos: {
    code: 'interlagos',
    name: 'Interlagos - Sao Paulo',
    shortName: 'Interlagos',
    country: 'BRA',
    flag: '🇧🇷',
    length: 4.309,
    turns: 15,
    drs: 3,
    lapRecord: '1:10.540',
    lapRecordHolder: 'Bottas',
    lapRecordYear: 2022,
    avgSpeed: 205,
    tyreWear: 4,
    weather: 'high',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 6, TopSpeed: 6, Traction: 7, Braking: 8, CorneringSpeed: 7, StreetCircuit: 3, Overtaking: 9, TyreWear: 4 },
    carTypes: { highDownforce: 6, topSpeed: 5, balanced: 7 },
    bestTeam: 'MCLAREN',
    bestReason: 'Interlagos overtaking opportunities favor McLaren drivability.',
    setup: { frontWing: 6, rearWing: 5, suspension: 5, brakeBias: 54 }
  },
  baku: {
    code: 'baku',
    name: 'Baku City Circuit',
    shortName: 'Baku',
    country: 'AZE',
    flag: '🇦🇿',
    length: 6.003,
    turns: 20,
    drs: 2,
    lapRecord: '1:40.203',
    lapRecordHolder: 'Verstappen',
    lapRecordYear: 2023,
    avgSpeed: 208,
    tyreWear: 3,
    weather: 'clear',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 5, TopSpeed: 10, Traction: 5, Braking: 8, CorneringSpeed: 4, StreetCircuit: 7, Overtaking: 6, TyreWear: 3 },
    carTypes: { highDownforce: 5, topSpeed: 9, balanced: 6 },
    bestTeam: 'FERRARI',
    bestReason: 'Baku\'s long straight favors Ferrari top end - perfect for DRS passes.',
    setup: { frontWing: 4, rearWing: 3, suspension: 4, brakeBias: 58 }
  },
  zandvoort: {
    code: 'zandvoort',
    name: 'Circuit Zandvoort',
    shortName: 'Zandvoort',
    country: 'NLD',
    flag: '🇳🇱',
    length: 4.259,
    turns: 14,
    drs: 2,
    lapRecord: '1:18.149',
    lapRecordHolder: 'Russell',
    lapRecordYear: 2023,
    avgSpeed: 194,
    tyreWear: 4,
    weather: 'variable',
    flags: ['Downforce Need', 'Top Speed', 'Traction', 'Braking', 'Cornering Speed', 'Street Circuit', 'Overtaking', 'Tyre Wear'],
    dna: { HighDownforce: 9, TopSpeed: 4, Traction: 8, Braking: 8, CorneringSpeed: 9, StreetCircuit: 2, Overtaking: 4, TyreWear: 4 },
    carTypes: { highDownforce: 9, topSpeed: 3, balanced: 7 },
    bestTeam: 'RED BULL RACING',
    bestReason: 'Arie Luyendijk banking suits RB19 high-downforce character.',
    setup: { frontWing: 9, rearWing: 8, suspension: 8, brakeBias: 53 }
  }
};

export const tipsData: Record<string, string[]> = {
  bahrain: ['Brake early into Turn 1 to maintain traction', 'Full throttle through the final sector', 'Use DRS on main straight for overtaking'],
  monaco: ['Commit to apex in tunnel - no brakes', 'Protect tires through Rascasse', 'Hill exit requires smooth throttle application'],
  monza: ['Monza is flat-out - minimize downforce', 'Pull hard out of Ascari for best exit', 'Parabolic corner exit sets up the run to Turn 1'],
  silverstone: ['Apex Maggots and Becketts in one motion', 'Copse corner demands late apex', 'Club Corner: trail brake to 50m board'],
  spa: ['Commit to full throttle at Eau Rouge', 'Compress suspension through Pouhon', 'Kemmel Straight: full push to the braking zone'],
  suzuka: ['130R can be flat with good tow', 'Degner curves: rear tire preservation', 'Hairpin exit: wait for 100m to accelerate'],
  singapore: ['Marina Bay sector 2: brake 100m early', 'Raffles Place: apex early for mid-corner rotation', 'Save tires for final sector charge'],
  abudhabi: ['Sector 2: manage energy deployment', 'Yas Viceroy Hotel: late apex works best', 'Final corner exit is critical for lap time'],
  austin: ['Turn 1: brake in straight line, turn in late', 'Sector 2: aggressive through the carousel', 'Triple apex: commit to first, carry speed through'],
  interlagos: ['Bigger is better at Juncao', 'Mergulho: late apex for best exit', 'Start/finish: use slipstream for position'],
  baku: ['Turn 2: brake late, keep revs high', 'Castle section: precise inputs required', 'Final corner: position for main straight'],
  zandvoort: ['Commit fully to the banking - no lift', 'Arie Luyendijk: patience on exit', 'Hugenholtz Bocht: full throttle commitment']
};
