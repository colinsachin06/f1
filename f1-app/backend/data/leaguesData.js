// Leagues mock data

const users = [
  { id: 'u1', username: 'VerstappenFan44', totalPoints: 842, weeklyPoints: 78, streak: 5, joinedAt: '2025-11-12', isCurrentUser: true, active: true },
  { id: 'u2', username: 'HamiltonLegacy', totalPoints: 891, weeklyPoints: 62, streak: 3, joinedAt: '2025-11-10', isCurrentUser: false, active: true },
  { id: 'u3', username: 'NorrisNinja', totalPoints: 810, weeklyPoints: 85, streak: 7, joinedAt: '2025-11-15', isCurrentUser: false, active: true },
  { id: 'u4', username: 'LeclercLion', totalPoints: 756, weeklyPoints: 54, streak: 2, joinedAt: '2025-12-01', isCurrentUser: false, active: true },
  { id: 'u5', username: 'PiastriPace', totalPoints: 728, weeklyPoints: 91, streak: 4, joinedAt: '2025-12-05', isCurrentUser: false, active: true },
  { id: 'u6', username: 'AlonsoAlways', totalPoints: 695, weeklyPoints: 48, streak: 1, joinedAt: '2025-12-10', isCurrentUser: false, active: false },
  { id: 'u7', username: 'SainzSmooth', totalPoints: 674, weeklyPoints: 72, streak: 6, joinedAt: '2025-11-20', isCurrentUser: false, active: true },
  { id: 'u8', username: 'RussellRocket', totalPoints: 651, weeklyPoints: 66, streak: 3, joinedAt: '2025-11-25', isCurrentUser: false, active: true },
  { id: 'u9', username: 'GaslyGrit', totalPoints: 612, weeklyPoints: 41, streak: 0, joinedAt: '2025-12-15', isCurrentUser: false, active: false },
  { id: 'u10', username: 'TsunodaTurbo', totalPoints: 589, weeklyPoints: 58, streak: 2, joinedAt: '2025-12-18', isCurrentUser: false, active: true },
  { id: 'u11', username: 'BearmanBrave', totalPoints: 534, weeklyPoints: 45, streak: 1, joinedAt: '2026-01-05', isCurrentUser: false, active: true },
  { id: 'u12', username: 'StrollSteady', totalPoints: 498, weeklyPoints: 33, streak: 0, joinedAt: '2026-01-10', isCurrentUser: false, active: false },
];

const leagues = [
  {
    id: 'lg1',
    name: 'Grid Legends',
    code: 'GRID2026',
    isPrivate: false,
    maxMembers: 12,
    members: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7', 'u8'],
    ownerId: 'u2',
    createdAt: '2025-11-10'
  },
  {
    id: 'lg2',
    name: 'Pit Lane Pros',
    code: 'PITPRO',
    isPrivate: true,
    maxMembers: 8,
    members: ['u1', 'u3', 'u5', 'u7', 'u10', 'u11'],
    ownerId: 'u1',
    createdAt: '2025-12-01'
  },
  {
    id: 'lg3',
    name: 'DRS Zone Kings',
    code: 'DRSKING',
    isPrivate: false,
    maxMembers: 10,
    members: ['u1', 'u4', 'u6', 'u9', 'u12'],
    ownerId: 'u4',
    createdAt: '2025-12-20'
  },
  {
    id: 'lg4',
    name: 'Apex Hunters',
    code: 'APEX26',
    isPrivate: true,
    maxMembers: 6,
    members: ['u1', 'u2', 'u8', 'u10'],
    ownerId: 'u8',
    createdAt: '2026-01-15'
  }
];

function getUserById(id) {
  return users.find(u => u.id === id);
}

function getLeagueMembers(league) {
  return league.members
    .map(id => getUserById(id))
    .filter(Boolean)
    .sort((a, b) => {
      if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
      return b.streak - a.streak;
    })
    .map((user, index) => ({ ...user, rank: index + 1 }));
}

function getUserLeagues(userId) {
  return leagues
    .filter(lg => lg.members.includes(userId))
    .map(lg => {
      const members = getLeagueMembers(lg);
      const userMember = members.find(m => m.id === userId);
      return {
        ...lg,
        memberCount: lg.members.length,
        userRank: userMember ? userMember.rank : null,
        userPoints: userMember ? userMember.totalPoints : 0
      };
    });
}

function getLeagueDetails(leagueId) {
  const league = leagues.find(lg => lg.id === leagueId);
  if (!league) return null;
  const members = getLeagueMembers(league);
  return { ...league, memberCount: league.members.length, leaderboard: members };
}

function getWeeklyStats(leagueId) {
  const league = leagues.find(lg => lg.id === leagueId);
  if (!league) return null;
  const members = getLeagueMembers(league);
  const weeklyRanked = [...members].sort((a, b) => b.weeklyPoints - a.weeklyPoints);
  const winner = weeklyRanked[0];
  const mostConsistent = [...members].sort((a, b) => b.streak - a.streak)[0];
  const biggestJump = members.reduce((best, m) => {
    const weeklyRank = weeklyRanked.findIndex(w => w.id === m.id) + 1;
    const jump = m.rank - weeklyRank;
    if (jump > (best ? best.jump : -Infinity)) return { ...m, jump };
    return best;
  }, null);

  return {
    players: weeklyRanked.map(m => ({ username: m.username, weeklyPoints: m.weeklyPoints })),
    winner: { username: winner.username, points: winner.weeklyPoints },
    stats: {
      highestScorer: { username: winner.username, points: winner.weeklyPoints },
      mostConsistent: { username: mostConsistent.username, streak: mostConsistent.streak },
      biggestJump: biggestJump ? { username: biggestJump.username, positions: biggestJump.jump } : null
    }
  };
}

function createLeague(name, maxMembers, isPrivate) {
  const id = 'lg' + (leagues.length + 1) + '_' + Date.now();
  const code = name.replace(/\s/g, '').substring(0, 6).toUpperCase() + Math.floor(Math.random() * 900 + 100);
  const league = {
    id,
    name,
    code,
    isPrivate,
    maxMembers,
    members: ['u1'],
    ownerId: 'u1',
    createdAt: new Date().toISOString().split('T')[0]
  };
  leagues.push(league);
  return { leagueId: league.id, inviteCode: league.code };
}

function joinLeague(code) {
  const league = leagues.find(lg => lg.code === code);
  if (!league) return { error: 'League not found' };
  if (league.members.length >= league.maxMembers) return { error: 'League is full' };
  if (league.members.includes('u1')) return { error: 'Already a member' };
  league.members.push('u1');
  return { success: true, leagueId: league.id, leagueName: league.name };
}

export {
  users,
  leagues,
  getUserLeagues,
  getLeagueDetails,
  getWeeklyStats,
  createLeague,
  joinLeague
};
