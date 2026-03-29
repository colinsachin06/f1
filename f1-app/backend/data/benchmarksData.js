const benchmarksData = {
  circuits: {
    bahrain: {
      f1RaceRecord: 90500,
      f1QualiRecord: 87447,
      f1AvgPace: 92000,
      simWorldRecord: 85200,
      sectors: { s1: 28500, s2: 29800, s3: 29147 },
      f1Sectors: { s1: 29200, s2: 30500, s3: 30047 }
    },
    monaco: {
      f1RaceRecord: 72909,
      f1QualiRecord: 70923,
      f1AvgPace: 74500,
      simWorldRecord: 68800,
      sectors: { s1: 23000, s2: 24909, s3: 25000 },
      f1Sectors: { s1: 23800, s2: 25600, s3: 25823 }
    },
    monza: {
      f1RaceRecord: 75294,
      f1QualiRecord: 75411,
      f1AvgPace: 76500,
      simWorldRecord: 71800,
      sectors: { s1: 24800, s2: 22100, s3: 28394 },
      f1Sectors: { s1: 25500, s2: 22700, s3: 29311 }
    },
    silverstone: {
      f1RaceRecord: 87369,
      f1QualiRecord: 86638,
      f1AvgPace: 88500,
      simWorldRecord: 83600,
      sectors: { s1: 27600, s2: 28100, s3: 31669 },
      f1Sectors: { s1: 28300, s2: 28800, s3: 32269 }
    },
    spa: {
      f1RaceRecord: 106286,
      f1QualiRecord: 103848,
      f1AvgPace: 108000,
      simWorldRecord: 99000,
      sectors: { s1: 32000, s2: 33800, s3: 40486 },
      f1Sectors: { s1: 32800, s2: 34500, s3: 41848 }
    },
    suzuka: {
      f1RaceRecord: 90983,
      f1QualiRecord: 89818,
      f1AvgPace: 92500,
      simWorldRecord: 86800,
      sectors: { s1: 28500, s2: 29800, s3: 32683 },
      f1Sectors: { s1: 29200, s2: 30500, s3: 33318 }
    },
    singapore: {
      f1RaceRecord: 95867,
      f1QualiRecord: 92284,
      f1AvgPace: 97000,
      simWorldRecord: 90500,
      sectors: { s1: 31000, s2: 31800, s3: 33067 },
      f1Sectors: { s1: 31800, s2: 32500, s3: 33667 }
    },
    'abu-dhabi': {
      f1RaceRecord: 83450,
      f1QualiRecord: 80450,
      f1AvgPace: 84500,
      simWorldRecord: 78200,
      sectors: { s1: 26500, s2: 27100, s3: 29850 },
      f1Sectors: { s1: 27200, s2: 27800, s3: 30584 }
    },
    austin: {
      f1RaceRecord: 96169,
      f1QualiRecord: 94623,
      f1AvgPace: 97500,
      simWorldRecord: 92100,
      sectors: { s1: 30500, s2: 31100, s3: 34569 },
      f1Sectors: { s1: 31200, s2: 31800, s3: 35269 }
    },
    interlagos: {
      f1RaceRecord: 70540,
      f1QualiRecord: 78106,
      f1AvgPace: 72000,
      simWorldRecord: 66500,
      sectors: { s1: 22000, s2: 23500, s3: 25040 },
      f1Sectors: { s1: 22800, s2: 24300, s3: 25740 }
    },
    baku: {
      f1RaceRecord: 100203,
      f1QualiRecord: 91928,
      f1AvgPace: 102000,
      simWorldRecord: 90500,
      sectors: { s1: 32000, s2: 33200, s3: 35003 },
      f1Sectors: { s1: 32800, s2: 34000, s3: 35928 }
    },
    zandvoort: {
      f1RaceRecord: 71097,
      f1QualiRecord: 67192,
      f1AvgPace: 72500,
      simWorldRecord: 66500,
      sectors: { s1: 22500, s2: 23800, s3: 24797 },
      f1Sectors: { s1: 23200, s2: 24500, s3: 25392 }
    }
  },
  platformFactors: {
    iRacing: { factor: 1.0, label: 'Most realistic' },
    'assetto-corsa': { factor: 1.02, label: 'Very realistic' },
    rfactor2: { factor: 1.03, label: 'Simulation' },
    custom: { factor: 1.05, label: 'Variable' }
  },
  skillLevels: {
    rookie: { minPct: 0, maxPct: 15, label: 'Rookie', strengthWeight: 0.3 },
    amateur: { minPct: 15, maxPct: 30, label: 'Amateur', strengthWeight: 0.5 },
    'semi-pro': { minPct: 30, maxPct: 50, label: 'Semi-Pro', strengthWeight: 0.7 },
    pro: { minPct: 50, maxPct: 70, label: 'Pro', strengthWeight: 0.85 }
  }
};

export default benchmarksData;
