// Generate realistic telemetry points for a lap
function generateTelemetryPoints(baseSpeed, skill) {
  const corners = [
    { dist: 0, type: 'start' },
    { dist: 200, type: 'straight' },
    { dist: 450, type: 'braking' },
    { dist: 520, type: 'corner' },
    { dist: 620, type: 'exit' },
    { dist: 900, type: 'straight' },
    { dist: 1150, type: 'braking' },
    { dist: 1220, type: 'corner' },
    { dist: 1350, type: 'exit' },
    { dist: 1600, type: 'straight' },
    { dist: 1850, type: 'braking' },
    { dist: 1920, type: 'corner' },
    { dist: 2050, type: 'exit' },
    { dist: 2400, type: 'straight' },
    { dist: 2700, type: 'braking' },
    { dist: 2780, type: 'corner' },
    { dist: 2900, type: 'exit' },
    { dist: 3200, type: 'straight' },
    { dist: 3500, type: 'braking' },
    { dist: 3580, type: 'corner' },
    { dist: 3700, type: 'exit' },
    { dist: 4000, type: 'straight' },
    { dist: 4300, type: 'braking' },
    { dist: 4380, type: 'corner' },
    { dist: 4500, type: 'exit' },
    { dist: 4800, type: 'straight' },
    { dist: 5050, type: 'braking' },
    { dist: 5120, type: 'corner' },
    { dist: 5250, type: 'exit' },
    { dist: 5500, type: 'finish' }
  ];

  return corners.map(c => {
    let speed, throttle, brake;
    const jitter = (Math.random() - 0.5) * 4 * skill;
    switch (c.type) {
      case 'start': speed = 0; throttle = 100; brake = 0; break;
      case 'straight': speed = baseSpeed + 10 + jitter; throttle = 98 + jitter / 10; brake = 0; break;
      case 'braking': speed = baseSpeed - 80 + jitter; throttle = 5; brake = 92 + jitter / 5; break;
      case 'corner': speed = baseSpeed - 180 + jitter; throttle = 30 + jitter; brake = 20 + jitter / 2; break;
      case 'exit': speed = baseSpeed - 100 + jitter; throttle = 85 + jitter / 3; brake = 0; break;
      case 'finish': speed = baseSpeed - 20 + jitter; throttle = 90; brake = 0; break;
      default: speed = baseSpeed; throttle = 70; brake = 10;
    }
    return {
      distance: c.dist,
      speed: Math.max(0, Math.round(speed)),
      throttle: Math.max(0, Math.min(100, Math.round(throttle))),
      brake: Math.max(0, Math.min(100, Math.round(brake)))
    };
  });
}

const driverProfiles = {
  VER: {
    driverName: 'Max Verstappen', team: 'Red Bull', teamColor: '#3671C6',
    baseSpeed: 340, skill: 1.0,
    sessions: {
      practice: {
        bestLap: '1:29.104', sectors: { s1: '29.312', s2: '31.710', s3: '28.082' },
        topSpeed: 338, minSpeed: 72, avgThrottle: 69, avgBrake: 22,
        deltaToTeammate: '-0.210', status: 'Data Gathering', ers: 78, drsCount: 4, fuelLoad: 'High',
        temps: { track: 40, air: 27 },
        lapTable: [
          { lap: 1, s1: '30.112', s2: '32.441', s3: '28.890', trap: 332, delta: '+1.339', tyres: 'H' },
          { lap: 2, s1: '29.801', s2: '32.102', s3: '28.541', trap: 335, delta: '+0.340', tyres: 'H' },
          { lap: 3, s1: '29.512', s2: '31.842', s3: '28.201', trap: 337, delta: '-0.549', tyres: 'M' },
          { lap: 4, s1: '29.312', s2: '31.710', s3: '28.082', trap: 338, delta: '-1.000', tyres: 'S' },
          { lap: 5, s1: '29.442', s2: '31.901', s3: '28.312', trap: 336, delta: '-0.449', tyres: 'S' },
          { lap: 6, s1: '29.890', s2: '32.201', s3: '28.551', trap: 334, delta: '+0.538', tyres: 'M' }
        ],
        insights: ['Exploring setup options with varying fuel loads.', 'Brake balance shifted forward for T4-T6 complex.', 'DRS efficiency looks strong on the main straight.']
      },
      qualifying: {
        bestLap: '1:28.742', sectors: { s1: '29.104', s2: '31.556', s3: '28.082' },
        topSpeed: 342, minSpeed: 74, avgThrottle: 71, avgBrake: 24,
        deltaToTeammate: '+0.184', status: 'Push Lap', ers: 84, drsCount: 6, fuelLoad: 'Low',
        temps: { track: 42, air: 28 },
        lapTable: [
          { lap: 1, s1: '29.501', s2: '31.864', s3: '28.340', trap: 338, delta: '+0.963', tyres: 'S' },
          { lap: 2, s1: '29.204', s2: '31.656', s3: '28.182', trap: 340, delta: '+0.300', tyres: 'S' },
          { lap: 3, s1: '29.104', s2: '31.556', s3: '28.082', trap: 342, delta: '+0.000', tyres: 'S' },
          { lap: 4, s1: '29.301', s2: '31.642', s3: '28.140', trap: 341, delta: '+0.341', tyres: 'S' },
          { lap: 5, s1: '29.512', s2: '31.901', s3: '28.320', trap: 339, delta: '+0.991', tyres: 'S' }
        ],
        insights: ['Strong exit traction in the final sector.', 'Lost time in the middle sector under braking.', 'Top speed remains competitive on the main straight.']
      },
      race: {
        bestLap: '1:29.218', sectors: { s1: '29.401', s2: '31.702', s3: '28.115' },
        topSpeed: 340, minSpeed: 76, avgThrottle: 70, avgBrake: 23,
        deltaToTeammate: '-0.342', status: 'Clean Air', ers: 80, drsCount: 8, fuelLoad: 'Medium',
        temps: { track: 44, air: 30 },
        lapTable: [
          { lap: 12, s1: '29.601', s2: '31.902', s3: '28.315', trap: 338, delta: '+0.600', tyres: 'M' },
          { lap: 13, s1: '29.501', s2: '31.802', s3: '28.215', trap: 339, delta: '+0.300', tyres: 'M' },
          { lap: 14, s1: '29.401', s2: '31.702', s3: '28.115', trap: 340, delta: '+0.000', tyres: 'M' },
          { lap: 15, s1: '29.451', s2: '31.752', s3: '28.165', trap: 340, delta: '+0.150', tyres: 'M' },
          { lap: 16, s1: '29.521', s2: '31.812', s3: '28.201', trap: 339, delta: '+0.316', tyres: 'M' },
          { lap: 17, s1: '29.611', s2: '31.892', s3: '28.290', trap: 338, delta: '+0.575', tyres: 'H' },
          { lap: 18, s1: '29.581', s2: '31.862', s3: '28.245', trap: 339, delta: '+0.470', tyres: 'H' }
        ],
        insights: ['Consistent pace in clean air, managing tyre wear.', 'ERS deployment optimised through the lap.', 'Overtaking speed advantage on the DRS straights.']
      }
    }
  },
  NOR: {
    driverName: 'Lando Norris', team: 'McLaren', teamColor: '#FF8000',
    baseSpeed: 338, skill: 0.95,
    sessions: {
      practice: {
        bestLap: '1:29.342', sectors: { s1: '29.401', s2: '31.801', s3: '28.140' },
        topSpeed: 336, minSpeed: 70, avgThrottle: 68, avgBrake: 23,
        deltaToTeammate: '-0.118', status: 'Cool Down', ers: 76, drsCount: 3, fuelLoad: 'High',
        temps: { track: 40, air: 27 },
        lapTable: [
          { lap: 1, s1: '30.201', s2: '32.501', s3: '28.901', trap: 330, delta: '+1.261', tyres: 'H' },
          { lap: 2, s1: '29.801', s2: '32.001', s3: '28.540', trap: 333, delta: '+0.000', tyres: 'M' },
          { lap: 3, s1: '29.601', s2: '31.901', s3: '28.340', trap: 335, delta: '-0.501', tyres: 'S' },
          { lap: 4, s1: '29.401', s2: '31.801', s3: '28.140', trap: 336, delta: '-1.000', tyres: 'S' },
          { lap: 5, s1: '29.550', s2: '31.950', s3: '28.290', trap: 334, delta: '-0.552', tyres: 'M' }
        ],
        insights: ['Working through aero balance adjustments.', 'Strong mid-corner speed through the technical section.', 'Brake temperature management looks well controlled.']
      },
      qualifying: {
        bestLap: '1:28.558', sectors: { s1: '29.012', s2: '31.442', s3: '28.104' },
        topSpeed: 340, minSpeed: 75, avgThrottle: 72, avgBrake: 25,
        deltaToTeammate: '-0.184', status: 'Push Lap', ers: 86, drsCount: 6, fuelLoad: 'Low',
        temps: { track: 42, air: 28 },
        lapTable: [
          { lap: 1, s1: '29.312', s2: '31.742', s3: '28.404', trap: 337, delta: '+0.900', tyres: 'S' },
          { lap: 2, s1: '29.112', s2: '31.542', s3: '28.204', trap: 339, delta: '+0.300', tyres: 'S' },
          { lap: 3, s1: '29.012', s2: '31.442', s3: '28.104', trap: 340, delta: '+0.000', tyres: 'S' },
          { lap: 4, s1: '29.102', s2: '31.522', s3: '28.184', trap: 340, delta: '+0.250', tyres: 'S' }
        ],
        insights: ['Exceptional turn-in speed through high-speed corners.', 'Gained significant time in S1 on the final attempt.', 'McLaren low-drag setup paying off on straights.']
      },
      race: {
        bestLap: '1:29.460', sectors: { s1: '29.501', s2: '31.812', s3: '28.147' },
        topSpeed: 338, minSpeed: 74, avgThrottle: 69, avgBrake: 22,
        deltaToTeammate: '+0.118', status: 'Traffic', ers: 82, drsCount: 10, fuelLoad: 'Medium',
        temps: { track: 44, air: 30 },
        lapTable: [
          { lap: 10, s1: '29.701', s2: '32.012', s3: '28.347', trap: 336, delta: '+0.600', tyres: 'M' },
          { lap: 11, s1: '29.601', s2: '31.912', s3: '28.247', trap: 337, delta: '+0.300', tyres: 'M' },
          { lap: 12, s1: '29.501', s2: '31.812', s3: '28.147', trap: 338, delta: '+0.000', tyres: 'M' },
          { lap: 13, s1: '29.551', s2: '31.862', s3: '28.197', trap: 338, delta: '+0.150', tyres: 'M' },
          { lap: 14, s1: '29.641', s2: '31.942', s3: '28.277', trap: 337, delta: '+0.400', tyres: 'H' },
          { lap: 15, s1: '29.601', s2: '31.902', s3: '28.237', trap: 337, delta: '+0.280', tyres: 'H' }
        ],
        insights: ['Traffic costing 0.3s per lap in sector 2.', 'Tyre management is excellent through long stints.', 'DRS usage higher than average — aggressive overtaking.']
      }
    }
  },
  HAM: {
    driverName: 'Lewis Hamilton', team: 'Ferrari', teamColor: '#E8002D',
    baseSpeed: 336, skill: 0.92,
    sessions: {
      practice: {
        bestLap: '1:29.612', sectors: { s1: '29.512', s2: '31.901', s3: '28.199' },
        topSpeed: 334, minSpeed: 68, avgThrottle: 67, avgBrake: 24,
        deltaToTeammate: '+0.142', status: 'Data Gathering', ers: 74, drsCount: 3, fuelLoad: 'High',
        temps: { track: 40, air: 27 },
        lapTable: [
          { lap: 1, s1: '30.312', s2: '32.601', s3: '29.001', trap: 328, delta: '+1.302', tyres: 'H' },
          { lap: 2, s1: '29.901', s2: '32.201', s3: '28.601', trap: 331, delta: '+0.091', tyres: 'M' },
          { lap: 3, s1: '29.612', s2: '31.901', s3: '28.299', trap: 333, delta: '-0.800', tyres: 'S' },
          { lap: 4, s1: '29.512', s2: '31.901', s3: '28.199', trap: 334, delta: '-1.000', tyres: 'S' }
        ],
        insights: ['Adapting to new car characteristics.', 'Smooth driving style suits the Ferrari platform.', 'Track limits under review at Turn 9.']
      },
      qualifying: {
        bestLap: '1:28.980', sectors: { s1: '29.210', s2: '31.608', s3: '28.162' },
        topSpeed: 338, minSpeed: 73, avgThrottle: 70, avgBrake: 24,
        deltaToTeammate: '+0.238', status: 'Push Lap', ers: 82, drsCount: 5, fuelLoad: 'Low',
        temps: { track: 42, air: 28 },
        lapTable: [
          { lap: 1, s1: '29.510', s2: '31.908', s3: '28.462', trap: 335, delta: '+1.100', tyres: 'S' },
          { lap: 2, s1: '29.310', s2: '31.708', s3: '28.262', trap: 337, delta: '+0.500', tyres: 'S' },
          { lap: 3, s1: '29.210', s2: '31.608', s3: '28.162', trap: 338, delta: '+0.000', tyres: 'S' }
        ],
        insights: ['Experience shows in tyre preparation laps.', 'Slight understeer limiting S2 performance.', 'Race pace looks stronger than single-lap speed.']
      },
      race: {
        bestLap: '1:29.670', sectors: { s1: '29.601', s2: '31.912', s3: '28.157' },
        topSpeed: 336, minSpeed: 75, avgThrottle: 69, avgBrake: 22,
        deltaToTeammate: '-0.142', status: 'Clean Air', ers: 79, drsCount: 6, fuelLoad: 'Medium',
        temps: { track: 44, air: 30 },
        lapTable: [
          { lap: 15, s1: '29.801', s2: '32.112', s3: '28.357', trap: 334, delta: '+0.600', tyres: 'M' },
          { lap: 16, s1: '29.701', s2: '32.012', s3: '28.257', trap: 335, delta: '+0.300', tyres: 'M' },
          { lap: 17, s1: '29.601', s2: '31.912', s3: '28.157', trap: 336, delta: '+0.000', tyres: 'M' },
          { lap: 18, s1: '29.651', s2: '31.962', s3: '28.207', trap: 336, delta: '+0.150', tyres: 'M' },
          { lap: 19, s1: '29.721', s2: '32.042', s3: '28.287', trap: 335, delta: '+0.380', tyres: 'H' }
        ],
        insights: ['Masterful tyre management extending stint windows.', 'Gaining time in the final sector on exits.', 'Consistent pace under pressure from behind.']
      }
    }
  },
  LEC: {
    driverName: 'Charles Leclerc', team: 'Ferrari', teamColor: '#E8002D',
    baseSpeed: 337, skill: 0.94,
    sessions: {
      practice: {
        bestLap: '1:29.470', sectors: { s1: '29.451', s2: '31.850', s3: '28.169' },
        topSpeed: 335, minSpeed: 69, avgThrottle: 68, avgBrake: 23,
        deltaToTeammate: '-0.142', status: 'Push Lap', ers: 76, drsCount: 4, fuelLoad: 'High',
        temps: { track: 40, air: 27 },
        lapTable: [
          { lap: 1, s1: '30.151', s2: '32.550', s3: '28.969', trap: 329, delta: '+1.200', tyres: 'H' },
          { lap: 2, s1: '29.751', s2: '32.050', s3: '28.469', trap: 332, delta: '+0.000', tyres: 'M' },
          { lap: 3, s1: '29.551', s2: '31.950', s3: '28.269', trap: 334, delta: '-0.500', tyres: 'S' },
          { lap: 4, s1: '29.451', s2: '31.850', s3: '28.169', trap: 335, delta: '-1.000', tyres: 'S' }
        ],
        insights: ['Aggressive on corner entry — carrying good speed.', 'Rear stability improved with setup changes.', 'Long run pace looks promising.']
      },
      qualifying: {
        bestLap: '1:28.742', sectors: { s1: '29.102', s2: '31.498', s3: '28.142' },
        topSpeed: 339, minSpeed: 74, avgThrottle: 71, avgBrake: 25,
        deltaToTeammate: '-0.238', status: 'Push Lap', ers: 85, drsCount: 6, fuelLoad: 'Low',
        temps: { track: 42, air: 28 },
        lapTable: [
          { lap: 1, s1: '29.402', s2: '31.798', s3: '28.442', trap: 336, delta: '+0.900', tyres: 'S' },
          { lap: 2, s1: '29.202', s2: '31.598', s3: '28.242', trap: 338, delta: '+0.300', tyres: 'S' },
          { lap: 3, s1: '29.102', s2: '31.498', s3: '28.142', trap: 339, delta: '+0.000', tyres: 'S' }
        ],
        insights: ['Stunning lap on the limit — maximising the Ferrari.', 'S2 improvement critical for pole position.', 'Tyre temperature window nailed on out-lap.']
      },
      race: {
        bestLap: '1:29.528', sectors: { s1: '29.551', s2: '31.862', s3: '28.115' },
        topSpeed: 337, minSpeed: 75, avgThrottle: 70, avgBrake: 23,
        deltaToTeammate: '+0.142', status: 'Push Lap', ers: 81, drsCount: 7, fuelLoad: 'Medium',
        temps: { track: 44, air: 30 },
        lapTable: [
          { lap: 14, s1: '29.751', s2: '32.062', s3: '28.315', trap: 335, delta: '+0.600', tyres: 'M' },
          { lap: 15, s1: '29.651', s2: '31.962', s3: '28.215', trap: 336, delta: '+0.300', tyres: 'M' },
          { lap: 16, s1: '29.551', s2: '31.862', s3: '28.115', trap: 337, delta: '+0.000', tyres: 'M' },
          { lap: 17, s1: '29.601', s2: '31.912', s3: '28.165', trap: 337, delta: '+0.150', tyres: 'M' },
          { lap: 18, s1: '29.681', s2: '31.992', s3: '28.245', trap: 336, delta: '+0.390', tyres: 'H' }
        ],
        insights: ['Aggressive strategy paying off in position.', 'Corner exit speed is a key strength.', 'Managing front tyre temps through the high-speed section.']
      }
    }
  },
  RUS: {
    driverName: 'George Russell', team: 'Mercedes', teamColor: '#27F4D2',
    baseSpeed: 335, skill: 0.90,
    sessions: {
      practice: {
        bestLap: '1:29.780', sectors: { s1: '29.601', s2: '31.980', s3: '28.199' },
        topSpeed: 333, minSpeed: 67, avgThrottle: 66, avgBrake: 22,
        deltaToTeammate: '-0.090', status: 'Data Gathering', ers: 73, drsCount: 3, fuelLoad: 'High',
        temps: { track: 40, air: 27 },
        lapTable: [
          { lap: 1, s1: '30.301', s2: '32.680', s3: '28.999', trap: 327, delta: '+1.200', tyres: 'H' },
          { lap: 2, s1: '29.901', s2: '32.280', s3: '28.599', trap: 330, delta: '+0.000', tyres: 'M' },
          { lap: 3, s1: '29.701', s2: '32.080', s3: '28.399', trap: 332, delta: '-0.600', tyres: 'S' },
          { lap: 4, s1: '29.601', s2: '31.980', s3: '28.199', trap: 333, delta: '-1.000', tyres: 'S' }
        ],
        insights: ['Setup work focused on low-speed mechanical grip.', 'Long run simulations show decent tyre life.', 'Floor performance still below expectations.']
      },
      qualifying: {
        bestLap: '1:29.142', sectors: { s1: '29.312', s2: '31.688', s3: '28.142' },
        topSpeed: 337, minSpeed: 72, avgThrottle: 69, avgBrake: 23,
        deltaToTeammate: '-0.162', status: 'Push Lap', ers: 83, drsCount: 5, fuelLoad: 'Low',
        temps: { track: 42, air: 28 },
        lapTable: [
          { lap: 1, s1: '29.612', s2: '31.988', s3: '28.442', trap: 334, delta: '+1.000', tyres: 'S' },
          { lap: 2, s1: '29.412', s2: '31.788', s3: '28.242', trap: 336, delta: '+0.400', tyres: 'S' },
          { lap: 3, s1: '29.312', s2: '31.688', s3: '28.142', trap: 337, delta: '+0.000', tyres: 'S' }
        ],
        insights: ['Mr Saturday delivers — strong qualifying pace.', 'Tyre warm-up technique giving early advantage.', 'Needs to convert qualifying speed into race results.']
      },
      race: {
        bestLap: '1:29.890', sectors: { s1: '29.701', s2: '32.042', s3: '28.147' },
        topSpeed: 335, minSpeed: 73, avgThrottle: 68, avgBrake: 22,
        deltaToTeammate: '+0.090', status: 'Traffic', ers: 78, drsCount: 5, fuelLoad: 'Medium',
        temps: { track: 44, air: 30 },
        lapTable: [
          { lap: 18, s1: '29.901', s2: '32.242', s3: '28.347', trap: 333, delta: '+0.600', tyres: 'M' },
          { lap: 19, s1: '29.801', s2: '32.142', s3: '28.247', trap: 334, delta: '+0.300', tyres: 'M' },
          { lap: 20, s1: '29.701', s2: '32.042', s3: '28.147', trap: 335, delta: '+0.000', tyres: 'M' },
          { lap: 21, s1: '29.751', s2: '32.092', s3: '28.197', trap: 335, delta: '+0.150', tyres: 'H' },
          { lap: 22, s1: '29.821', s2: '32.162', s3: '28.267', trap: 334, delta: '+0.360', tyres: 'H' }
        ],
        insights: ['Stuck in traffic losing time through dirty air.', 'Tyre degradation higher than expected on mediums.', 'Strong first stint but pace drops in dirty air.']
      }
    }
  },
  ALO: {
    driverName: 'Fernando Alonso', team: 'Aston Martin', teamColor: '#229971',
    baseSpeed: 333, skill: 0.88,
    sessions: {
      practice: {
        bestLap: '1:30.120', sectors: { s1: '29.801', s2: '32.101', s3: '28.218' },
        topSpeed: 330, minSpeed: 66, avgThrottle: 65, avgBrake: 21,
        deltaToTeammate: '-0.220', status: 'Cool Down', ers: 71, drsCount: 2, fuelLoad: 'High',
        temps: { track: 40, air: 27 },
        lapTable: [
          { lap: 1, s1: '30.501', s2: '32.801', s3: '29.018', trap: 325, delta: '+1.200', tyres: 'H' },
          { lap: 2, s1: '30.101', s2: '32.401', s3: '28.618', trap: 328, delta: '+0.000', tyres: 'M' },
          { lap: 3, s1: '29.901', s2: '32.201', s3: '28.418', trap: 329, delta: '-0.600', tyres: 'S' },
          { lap: 4, s1: '29.801', s2: '32.101', s3: '28.218', trap: 330, delta: '-1.000', tyres: 'S' }
        ],
        insights: ['Extracting maximum from the car through experience.', 'Low-speed traction is a weakness of the AMR24.', 'Running experimental rear wing configuration.']
      },
      qualifying: {
        bestLap: '1:29.510', sectors: { s1: '29.501', s2: '31.852', s3: '28.157' },
        topSpeed: 335, minSpeed: 71, avgThrottle: 68, avgBrake: 23,
        deltaToTeammate: '-0.280', status: 'Push Lap', ers: 80, drsCount: 5, fuelLoad: 'Low',
        temps: { track: 42, air: 28 },
        lapTable: [
          { lap: 1, s1: '29.801', s2: '32.152', s3: '28.457', trap: 332, delta: '+0.900', tyres: 'S' },
          { lap: 2, s1: '29.601', s2: '31.952', s3: '28.257', trap: 334, delta: '+0.300', tyres: 'S' },
          { lap: 3, s1: '29.501', s2: '31.852', s3: '28.157', trap: 335, delta: '+0.000', tyres: 'S' }
        ],
        insights: ['Vintage Alonso — finding time others cannot.', 'Car balance improved for qualifying trim.', 'Rain threat could play to his advantage.']
      },
      race: {
        bestLap: '1:30.210', sectors: { s1: '29.901', s2: '32.152', s3: '28.157' },
        topSpeed: 332, minSpeed: 72, avgThrottle: 67, avgBrake: 21,
        deltaToTeammate: '-0.220', status: 'Clean Air', ers: 76, drsCount: 4, fuelLoad: 'Medium',
        temps: { track: 44, air: 30 },
        lapTable: [
          { lap: 20, s1: '30.101', s2: '32.352', s3: '28.357', trap: 330, delta: '+0.600', tyres: 'M' },
          { lap: 21, s1: '30.001', s2: '32.252', s3: '28.257', trap: 331, delta: '+0.300', tyres: 'M' },
          { lap: 22, s1: '29.901', s2: '32.152', s3: '28.157', trap: 332, delta: '+0.000', tyres: 'M' },
          { lap: 23, s1: '29.951', s2: '32.202', s3: '28.207', trap: 332, delta: '+0.150', tyres: 'H' },
          { lap: 24, s1: '30.041', s2: '32.292', s3: '28.297', trap: 331, delta: '+0.420', tyres: 'H' }
        ],
        insights: ['Strategic masterclass keeping faster cars behind.', 'Tyre saving through corners extends stint length.', 'DRS defence strong despite straight-line deficit.']
      }
    }
  },
  PIA: {
    driverName: 'Oscar Piastri', team: 'McLaren', teamColor: '#FF8000',
    baseSpeed: 337, skill: 0.93,
    sessions: {
      practice: {
        bestLap: '1:29.460', sectors: { s1: '29.481', s2: '31.840', s3: '28.139' },
        topSpeed: 335, minSpeed: 69, avgThrottle: 67, avgBrake: 23,
        deltaToTeammate: '+0.118', status: 'Data Gathering', ers: 75, drsCount: 3, fuelLoad: 'High',
        temps: { track: 40, air: 27 },
        lapTable: [
          { lap: 1, s1: '30.181', s2: '32.540', s3: '28.939', trap: 329, delta: '+1.200', tyres: 'H' },
          { lap: 2, s1: '29.781', s2: '32.040', s3: '28.439', trap: 332, delta: '+0.000', tyres: 'M' },
          { lap: 3, s1: '29.581', s2: '31.940', s3: '28.339', trap: 334, delta: '-0.360', tyres: 'S' },
          { lap: 4, s1: '29.481', s2: '31.840', s3: '28.139', trap: 335, delta: '-1.000', tyres: 'S' }
        ],
        insights: ['Building confidence with each practice run.', 'Matching teammate pace on medium tyres.', 'Braking consistency improving through the session.']
      },
      qualifying: {
        bestLap: '1:28.890', sectors: { s1: '29.150', s2: '31.598', s3: '28.142' },
        topSpeed: 339, minSpeed: 74, avgThrottle: 71, avgBrake: 24,
        deltaToTeammate: '+0.332', status: 'Push Lap', ers: 84, drsCount: 6, fuelLoad: 'Low',
        temps: { track: 42, air: 28 },
        lapTable: [
          { lap: 1, s1: '29.450', s2: '31.898', s3: '28.442', trap: 336, delta: '+0.900', tyres: 'S' },
          { lap: 2, s1: '29.250', s2: '31.698', s3: '28.242', trap: 338, delta: '+0.300', tyres: 'S' },
          { lap: 3, s1: '29.150', s2: '31.598', s3: '28.142', trap: 339, delta: '+0.000', tyres: 'S' }
        ],
        insights: ['Smooth and precise — classic Piastri.', 'Closing the gap to Norris in qualifying trim.', 'Turn 4 approach angle giving extra mid-corner grip.']
      },
      race: {
        bestLap: '1:29.578', sectors: { s1: '29.551', s2: '31.882', s3: '28.145' },
        topSpeed: 337, minSpeed: 74, avgThrottle: 69, avgBrake: 22,
        deltaToTeammate: '-0.118', status: 'Clean Air', ers: 80, drsCount: 8, fuelLoad: 'Medium',
        temps: { track: 44, air: 30 },
        lapTable: [
          { lap: 11, s1: '29.751', s2: '32.082', s3: '28.345', trap: 335, delta: '+0.600', tyres: 'M' },
          { lap: 12, s1: '29.651', s2: '31.982', s3: '28.245', trap: 336, delta: '+0.300', tyres: 'M' },
          { lap: 13, s1: '29.551', s2: '31.882', s3: '28.145', trap: 337, delta: '+0.000', tyres: 'M' },
          { lap: 14, s1: '29.601', s2: '31.932', s3: '28.195', trap: 337, delta: '+0.150', tyres: 'M' },
          { lap: 15, s1: '29.681', s2: '32.012', s3: '28.275', trap: 336, delta: '+0.390', tyres: 'H' }
        ],
        insights: ['Clean air allowing natural pace to shine.', 'Tyre management maturity beyond his experience level.', 'Sector 3 exit speed matching the frontrunners.']
      }
    }
  },
  SAI: {
    driverName: 'Carlos Sainz', team: 'Williams', teamColor: '#0093CC',
    baseSpeed: 334, skill: 0.91,
    sessions: {
      practice: {
        bestLap: '1:29.920', sectors: { s1: '29.701', s2: '32.020', s3: '28.199' },
        topSpeed: 332, minSpeed: 67, avgThrottle: 66, avgBrake: 22,
        deltaToTeammate: '-0.190', status: 'Cool Down', ers: 72, drsCount: 3, fuelLoad: 'High',
        temps: { track: 40, air: 27 },
        lapTable: [
          { lap: 1, s1: '30.401', s2: '32.720', s3: '28.999', trap: 326, delta: '+1.200', tyres: 'H' },
          { lap: 2, s1: '30.001', s2: '32.320', s3: '28.599', trap: 329, delta: '+0.000', tyres: 'M' },
          { lap: 3, s1: '29.801', s2: '32.120', s3: '28.399', trap: 331, delta: '-0.600', tyres: 'S' },
          { lap: 4, s1: '29.701', s2: '32.020', s3: '28.199', trap: 332, delta: '-1.000', tyres: 'S' }
        ],
        insights: ['Getting acquainted with the Williams package.', 'Smooth operator style adapting to different car.', 'Sector 3 is the strongest area of the lap.']
      },
      qualifying: {
        bestLap: '1:29.304', sectors: { s1: '29.401', s2: '31.762', s3: '28.141' },
        topSpeed: 336, minSpeed: 72, avgThrottle: 69, avgBrake: 23,
        deltaToTeammate: '-0.350', status: 'Push Lap', ers: 81, drsCount: 5, fuelLoad: 'Low',
        temps: { track: 42, air: 28 },
        lapTable: [
          { lap: 1, s1: '29.701', s2: '32.062', s3: '28.441', trap: 333, delta: '+0.900', tyres: 'S' },
          { lap: 2, s1: '29.501', s2: '31.862', s3: '28.241', trap: 335, delta: '+0.300', tyres: 'S' },
          { lap: 3, s1: '29.401', s2: '31.762', s3: '28.141', trap: 336, delta: '+0.000', tyres: 'S' }
        ],
        insights: ['Extracting more from the car than expected.', 'Single-lap specialist mode engaged.', 'Impressive adaptation speed to the new team.']
      },
      race: {
        bestLap: '1:30.010', sectors: { s1: '29.801', s2: '32.062', s3: '28.147' },
        topSpeed: 334, minSpeed: 73, avgThrottle: 68, avgBrake: 22,
        deltaToTeammate: '-0.190', status: 'Clean Air', ers: 77, drsCount: 5, fuelLoad: 'Medium',
        temps: { track: 44, air: 30 },
        lapTable: [
          { lap: 16, s1: '30.001', s2: '32.262', s3: '28.347', trap: 332, delta: '+0.600', tyres: 'M' },
          { lap: 17, s1: '29.901', s2: '32.162', s3: '28.247', trap: 333, delta: '+0.300', tyres: 'M' },
          { lap: 18, s1: '29.801', s2: '32.062', s3: '28.147', trap: 334, delta: '+0.000', tyres: 'M' },
          { lap: 19, s1: '29.851', s2: '32.112', s3: '28.197', trap: 334, delta: '+0.150', tyres: 'H' },
          { lap: 20, s1: '29.941', s2: '32.202', s3: '28.287', trap: 333, delta: '+0.420', tyres: 'H' }
        ],
        insights: ['Consistent mid-pack pace keeping car in points.', 'Williams reliability holding up well.', 'Strong tyre longevity on both compounds.']
      }
    }
  }
};

// Build telemetry response for a specific query
function getTelemetryData(driverCode, session, lap) {
  const driver = driverProfiles[driverCode];
  if (!driver) return null;

  const sessionKey = session.toLowerCase();
  const sessionData = driver.sessions[sessionKey];
  if (!sessionData) return null;

  const lapLabel = lap === 'best' ? 'Best Lap' : lap === 'last' ? 'Last Lap' : 'Lap Comparison';
  const tyreCompound = sessionKey === 'qualifying' ? 'Soft' : sessionKey === 'race' ? 'Medium' : 'Hard';

  return {
    driverCode,
    driverName: driver.driverName,
    team: driver.team,
    teamColor: driver.teamColor,
    session: session.charAt(0).toUpperCase() + session.slice(1),
    lapLabel,
    bestLap: sessionData.bestLap,
    sectors: sessionData.sectors,
    temps: sessionData.temps,
    tyreCompound,
    ers: sessionData.ers,
    drsCount: sessionData.drsCount,
    fuelLoad: sessionData.fuelLoad,
    topSpeed: sessionData.topSpeed,
    minSpeed: sessionData.minSpeed,
    avgThrottle: sessionData.avgThrottle,
    avgBrake: sessionData.avgBrake,
    cornerEntrySpeed: sessionData.minSpeed + 28,
    cornerExitSpeed: sessionData.minSpeed + 52,
    deltaToTeammate: sessionData.deltaToTeammate,
    status: sessionData.status,
    telemetryPoints: generateTelemetryPoints(driver.baseSpeed, driver.skill),
    lapTable: sessionData.lapTable,
    insights: sessionData.insights
  };
}

export { driverProfiles, getTelemetryData };
export default getTelemetryData;
