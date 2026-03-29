import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

/* ───────── helpers ───────── */
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(() => {});
};

const rankMedal = (rank) => {
  if (rank === 1) return { emoji: '🥇', color: '#FFD700' };
  if (rank === 2) return { emoji: '🥈', color: '#C0C0C0' };
  if (rank === 3) return { emoji: '🥉', color: '#CD7F32' };
  return { emoji: '', color: 'transparent' };
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

/* ───────── styles ───────── */
const styles = {
  container: {
    display: 'flex',
    gap: '16px',
    height: '100%',
    padding: '16px',
    overflow: 'hidden',
  },
  /* LEFT PANEL */
  leftPanel: {
    width: '260px',
    minWidth: '260px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    overflow: 'hidden',
  },
  leftHeader: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2.5px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: '12px',
  },
  leaguesList: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingRight: '4px',
  },
  leagueCard: (isActive) => ({
    background: isActive ? 'rgba(232,0,45,0.08)' : 'var(--panel)',
    border: isActive ? '1px solid var(--red)' : '1px solid var(--border)',
    borderRadius: '4px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  leagueName: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '11px',
    fontWeight: 700,
    color: 'var(--text)',
    marginBottom: '8px',
    letterSpacing: '0.5px',
  },
  leagueRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  badge: (isPrivate) => ({
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '7px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    padding: '2px 8px',
    borderRadius: '2px',
    background: isPrivate ? 'rgba(191,0,255,0.15)' : 'rgba(0,207,255,0.15)',
    color: isPrivate ? 'var(--purple)' : 'var(--cyan)',
  }),
  memberCount: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '13px',
    color: 'var(--muted2)',
  },
  rankDisplay: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--red)',
  },
  pointsSmall: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '12px',
    color: 'var(--muted)',
  },
  joinBtn: {
    width: '100%',
    marginTop: '12px',
    padding: '10px',
    background: 'transparent',
    border: '1px dashed var(--border2)',
    borderRadius: '4px',
    color: 'var(--muted)',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  /* CENTER PANEL */
  centerPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  },
  dashHeader: {
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '16px 20px',
    marginBottom: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  dashTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '1px',
  },
  codeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  codeText: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '11px',
    color: 'var(--muted2)',
    letterSpacing: '2px',
  },
  copyBtn: {
    background: 'var(--panel2)',
    border: '1px solid var(--border)',
    borderRadius: '3px',
    padding: '4px 10px',
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '11px',
    color: 'var(--muted)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  membersBadge: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '13px',
    color: 'var(--muted2)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  innerTabs: {
    display: 'flex',
    gap: '0',
    marginBottom: '12px',
    flexShrink: 0,
  },
  innerTab: (isActive) => ({
    padding: '8px 20px',
    background: isActive ? 'rgba(232,0,45,0.06)' : 'transparent',
    border: 'none',
    borderBottom: isActive ? '2px solid var(--red)' : '2px solid var(--border)',
    color: isActive ? 'var(--text)' : 'var(--muted)',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '8px',
    fontWeight: 700,
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flex: 1,
  }),
  tabContent: {
    flex: 1,
    overflow: 'auto',
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '16px',
  },
  /* TABLE */
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '8px',
    fontWeight: 700,
    letterSpacing: '2px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    textAlign: 'left',
    padding: '10px 12px',
    borderBottom: '1px solid var(--border)',
  },
  td: (isCurrentUser) => ({
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '14px',
    color: 'var(--text)',
    padding: '12px',
    borderBottom: '1px solid var(--border)',
    background: isCurrentUser ? 'rgba(232,0,45,0.06)' : 'transparent',
  }),
  currentUserRow: {
    outline: '1px solid var(--red)',
    borderRadius: '2px',
  },
  /* RIGHT PANEL */
  rightPanel: {
    width: '260px',
    minWidth: '260px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflow: 'auto',
  },
  formPanel: {
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '16px',
  },
  formLabel: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '8px',
    fontWeight: 700,
    letterSpacing: '2px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: '6px',
    display: 'block',
  },
  formGroup: {
    marginBottom: '14px',
  },
  formInput: {
    width: '100%',
    fontFamily: 'Barlow Condensed, sans-serif',
    background: 'var(--panel2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
  },
  formSelect: {
    width: '100%',
    fontFamily: 'Barlow Condensed, sans-serif',
    background: 'var(--panel2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer',
  },
  privacyGroup: {
    display: 'flex',
    gap: '8px',
    marginBottom: '14px',
  },
  privacyBtn: (isActive) => ({
    flex: 1,
    padding: '8px',
    background: isActive ? 'rgba(232,0,45,0.12)' : 'var(--panel2)',
    border: isActive ? '1px solid var(--red)' : '1px solid var(--border)',
    borderRadius: '4px',
    color: isActive ? 'var(--text)' : 'var(--muted)',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '8px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  submitBtn: {
    width: '100%',
    padding: '10px',
    background: 'var(--red)',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '2px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  resultCard: {
    marginTop: '12px',
    background: 'rgba(57,255,20,0.06)',
    border: '1px solid var(--green)',
    borderRadius: '4px',
    padding: '12px',
    textAlign: 'center',
  },
  resultText: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '9px',
    color: 'var(--green)',
    letterSpacing: '1px',
  },
  resultCode: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text)',
    letterSpacing: '3px',
    marginTop: '6px',
  },
  /* WEEKLY */
  winnerCard: {
    background: 'linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(232,0,45,0.06) 100%)',
    border: '1px solid rgba(255,215,0,0.3)',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  winnerCrown: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  winnerName: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '14px',
    fontWeight: 700,
    color: '#FFD700',
    letterSpacing: '1px',
  },
  winnerPoints: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '16px',
    color: 'var(--muted2)',
    marginTop: '4px',
  },
  miniStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '10px',
    marginBottom: '20px',
  },
  miniStatCard: {
    background: 'var(--panel2)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    padding: '12px',
    textAlign: 'center',
  },
  miniStatLabel: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '7px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  miniStatValue: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '14px',
    color: 'var(--text)',
  },
  /* MEMBERS */
  memberRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 14px',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.15s',
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  memberAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--panel2)',
    border: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    color: 'var(--muted)',
  },
  memberUsername: {
    fontFamily: 'Barlow Condensed, sans-serif',
    fontSize: '15px',
    color: 'var(--text)',
  },
  ownerBadge: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '7px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    padding: '2px 6px',
    borderRadius: '2px',
    background: 'rgba(255,215,0,0.15)',
    color: '#FFD700',
    marginLeft: '8px',
  },
  statusDot: (active) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: active ? 'var(--green)' : 'var(--muted)',
  }),
  /* EMPTY */
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: '16px',
  },
  emptyIcon: {
    fontSize: '42px',
    opacity: 0.3,
  },
  emptyText: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '11px',
    color: 'var(--muted)',
    letterSpacing: '2px',
    textAlign: 'center',
  },
  sortToggle: {
    display: 'flex',
    gap: '4px',
    marginBottom: '12px',
  },
  sortBtn: (isActive) => ({
    padding: '4px 12px',
    background: isActive ? 'rgba(232,0,45,0.1)' : 'transparent',
    border: isActive ? '1px solid var(--red)' : '1px solid var(--border)',
    borderRadius: '3px',
    color: isActive ? 'var(--text)' : 'var(--muted)',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '7px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  streakBadge: (streak) => ({
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    color: streak >= 5 ? 'var(--green)' : streak >= 3 ? 'var(--yellow)' : 'var(--muted2)',
  }),
};

/* ───────── component ───────── */
function Leagues() {
  const [myLeagues, setMyLeagues] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState(null);
  const [leagueDetails, setLeagueDetails] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState(null);
  const [innerTab, setInnerTab] = useState('leaderboard');
  const [sortBy, setSortBy] = useState('total');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Create form
  const [createName, setCreateName] = useState('');
  const [createMax, setCreateMax] = useState(8);
  const [createPrivate, setCreatePrivate] = useState(false);
  const [createResult, setCreateResult] = useState(null);

  // Join form
  const [joinCode, setJoinCode] = useState('');
  const [joinResult, setJoinResult] = useState(null);
  const [joinError, setJoinError] = useState(null);

  // Fetch user leagues
  const fetchMyLeagues = useCallback(async () => {
    try {
      const res = await axios.get('/api/leagues');
      setMyLeagues(res.data);
      if (!selectedLeagueId && res.data.length > 0) {
        setSelectedLeagueId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch leagues', err);
    } finally {
      setLoading(false);
    }
  }, [selectedLeagueId]);

  // Fetch league details
  const fetchDetails = useCallback(async (id) => {
    try {
      const [detailsRes, weeklyRes] = await Promise.all([
        axios.get(`/api/leagues/${id}`),
        axios.get(`/api/leagues/${id}/weekly`),
      ]);
      setLeagueDetails(detailsRes.data);
      setWeeklyStats(weeklyRes.data);
    } catch (err) {
      console.error('Failed to fetch league details', err);
    }
  }, []);

  useEffect(() => {
    fetchMyLeagues();
  }, [fetchMyLeagues]);

  useEffect(() => {
    if (selectedLeagueId) fetchDetails(selectedLeagueId);
  }, [selectedLeagueId, fetchDetails]);

  // Handlers
  const handleCreate = async () => {
    if (!createName.trim()) return;
    try {
      const res = await axios.post('/api/leagues/create', {
        name: createName.trim(),
        maxMembers: createMax,
        isPrivate: createPrivate,
      });
      setCreateResult(res.data);
      setCreateName('');
      fetchMyLeagues();
    } catch (err) {
      console.error('Failed to create league', err);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) return;
    setJoinError(null);
    setJoinResult(null);
    try {
      const res = await axios.post('/api/leagues/join', { code: joinCode.trim() });
      if (res.data.error) {
        setJoinError(res.data.error);
      } else {
        setJoinResult(res.data);
        setJoinCode('');
        fetchMyLeagues();
      }
    } catch (err) {
      setJoinError(err.response?.data?.error || 'Failed to join');
    }
  };

  const handleCopy = (code) => {
    copyToClipboard(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Sort leaderboard
  const getSortedLeaderboard = () => {
    if (!leagueDetails?.leaderboard) return [];
    const lb = [...leagueDetails.leaderboard];
    if (sortBy === 'weekly') {
      lb.sort((a, b) => b.weeklyPoints - a.weeklyPoints);
      return lb.map((m, i) => ({ ...m, displayRank: i + 1 }));
    }
    return lb.map((m) => ({ ...m, displayRank: m.rank }));
  };

  /* ───────── render ───────── */
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={{ ...styles.emptyText, animation: 'pulse 1.5s infinite' }}>LOADING LEAGUES...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ═══ LEFT — MY LEAGUES ═══ */}
      <div style={styles.leftPanel}>
        <div style={styles.leftHeader}>MY LEAGUES</div>
        <div style={styles.leaguesList}>
          <AnimatePresence>
            {myLeagues.map((lg, i) => (
              <motion.div
                key={lg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.25 }}
                style={styles.leagueCard(selectedLeagueId === lg.id)}
                onClick={() => setSelectedLeagueId(lg.id)}
                onMouseEnter={(e) => { if (selectedLeagueId !== lg.id) e.currentTarget.style.borderColor = 'var(--border2)'; }}
                onMouseLeave={(e) => { if (selectedLeagueId !== lg.id) e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <div style={styles.leagueName}>{lg.name}</div>
                <div style={styles.leagueRow}>
                  <span style={styles.badge(lg.isPrivate)}>{lg.isPrivate ? 'PRIVATE' : 'PUBLIC'}</span>
                  <span style={styles.memberCount}>{lg.memberCount}/{lg.maxMembers} members</span>
                </div>
                <div style={{ ...styles.leagueRow, marginTop: '8px', marginBottom: 0 }}>
                  <span style={styles.rankDisplay}>#{lg.userRank}</span>
                  <span style={styles.pointsSmall}>{lg.userPoints} pts</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            style={styles.joinBtn}
            onClick={() => {
              const joinInput = document.getElementById('leagues-join-code-input');
              if (joinInput) joinInput.focus();
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}
          >
            + JOIN LEAGUE
          </button>
        </div>
      </div>

      {/* ═══ CENTER — LEAGUE DASHBOARD ═══ */}
      <div style={styles.centerPanel}>
        {!leagueDetails ? (
          <div style={{ ...styles.tabContent, ...styles.emptyState }}>
            <div style={styles.emptyIcon}>👥</div>
            <div style={styles.emptyText}>SELECT A LEAGUE TO VIEW DASHBOARD</div>
          </div>
        ) : (
          <>
            {/* Dashboard Header */}
            <motion.div
              style={styles.dashHeader}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <div style={styles.dashTitle}>{leagueDetails.name}</div>
                <div style={{ ...styles.codeContainer, marginTop: '6px' }}>
                  <span style={styles.codeText}>{leagueDetails.code}</span>
                  <button
                    style={styles.copyBtn}
                    onClick={() => handleCopy(leagueDetails.code)}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--red)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {copied ? '✓ COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
              <div style={styles.membersBadge}>
                <span style={{ fontSize: '16px' }}>👥</span>
                {leagueDetails.memberCount} members
              </div>
            </motion.div>

            {/* Inner Tabs */}
            <div style={styles.innerTabs}>
              {['leaderboard', 'weekly', 'members'].map((tab) => (
                <button
                  key={tab}
                  style={styles.innerTab(innerTab === tab)}
                  onClick={() => setInnerTab(tab)}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={innerTab}
                style={styles.tabContent}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
              >
                {/* ──── LEADERBOARD ──── */}
                {innerTab === 'leaderboard' && (
                  <>
                    <div style={styles.sortToggle}>
                      <button style={styles.sortBtn(sortBy === 'total')} onClick={() => setSortBy('total')}>TOTAL</button>
                      <button style={styles.sortBtn(sortBy === 'weekly')} onClick={() => setSortBy('weekly')}>WEEKLY</button>
                    </div>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Rank</th>
                          <th style={styles.th}>Player</th>
                          <th style={styles.th}>Total Pts</th>
                          <th style={styles.th}>Weekly Pts</th>
                          <th style={styles.th}>Streak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSortedLeaderboard().map((member, i) => {
                          const medal = rankMedal(member.displayRank);
                          return (
                            <motion.tr
                              key={member.id}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.04, duration: 0.2 }}
                              style={member.isCurrentUser ? styles.currentUserRow : {}}
                            >
                              <td style={styles.td(member.isCurrentUser)}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {medal.emoji && <span>{medal.emoji}</span>}
                                  <span style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: member.displayRank <= 3 ? medal.color : 'var(--muted2)',
                                  }}>
                                    {member.displayRank}
                                  </span>
                                </span>
                              </td>
                              <td style={styles.td(member.isCurrentUser)}>
                                <span style={{ fontWeight: member.isCurrentUser ? 600 : 400 }}>
                                  {member.username}
                                  {member.isCurrentUser && <span style={{ color: 'var(--red)', marginLeft: '6px', fontFamily: 'Orbitron', fontSize: '8px', letterSpacing: '1px' }}>YOU</span>}
                                </span>
                              </td>
                              <td style={styles.td(member.isCurrentUser)}>
                                <span style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 700 }}>{member.totalPoints}</span>
                              </td>
                              <td style={styles.td(member.isCurrentUser)}>
                                <span style={{ color: 'var(--cyan)' }}>{member.weeklyPoints}</span>
                              </td>
                              <td style={styles.td(member.isCurrentUser)}>
                                <span style={styles.streakBadge(member.streak)}>
                                  {member.streak > 0 ? `🔥 ${member.streak}` : '—'}
                                </span>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}

                {/* ──── WEEKLY ──── */}
                {innerTab === 'weekly' && weeklyStats && (
                  <>
                    {/* Winner of the Week */}
                    <div style={styles.winnerCard}>
                      <div style={styles.winnerCrown}>👑</div>
                      <div style={{ fontFamily: 'Orbitron', fontSize: '8px', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '6px' }}>WINNER OF THE WEEK</div>
                      <div style={styles.winnerName}>{weeklyStats.winner.username}</div>
                      <div style={styles.winnerPoints}>{weeklyStats.winner.points} points</div>
                    </div>

                    {/* Mini Stats */}
                    <div style={styles.miniStats}>
                      <div style={styles.miniStatCard}>
                        <div style={styles.miniStatLabel}>Highest Scorer</div>
                        <div style={styles.miniStatValue}>{weeklyStats.stats.highestScorer.username}</div>
                        <div style={{ fontFamily: 'Orbitron', fontSize: '11px', fontWeight: 700, color: 'var(--green)', marginTop: '4px' }}>{weeklyStats.stats.highestScorer.points} pts</div>
                      </div>
                      <div style={styles.miniStatCard}>
                        <div style={styles.miniStatLabel}>Most Consistent</div>
                        <div style={styles.miniStatValue}>{weeklyStats.stats.mostConsistent.username}</div>
                        <div style={{ fontFamily: 'Orbitron', fontSize: '11px', fontWeight: 700, color: 'var(--yellow)', marginTop: '4px' }}>🔥 {weeklyStats.stats.mostConsistent.streak}</div>
                      </div>
                      <div style={styles.miniStatCard}>
                        <div style={styles.miniStatLabel}>Biggest Jump</div>
                        <div style={styles.miniStatValue}>{weeklyStats.stats.biggestJump?.username || '—'}</div>
                        <div style={{ fontFamily: 'Orbitron', fontSize: '11px', fontWeight: 700, color: 'var(--cyan)', marginTop: '4px' }}>↑ {weeklyStats.stats.biggestJump?.positions || 0}</div>
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div style={{ height: '260px' }}>
                      <Bar
                        data={{
                          labels: weeklyStats.players.map((p) => p.username),
                          datasets: [{
                            label: 'Weekly Points',
                            data: weeklyStats.players.map((p) => p.weeklyPoints),
                            backgroundColor: weeklyStats.players.map((_, i) =>
                              i === 0 ? 'rgba(232,0,45,0.8)' : 'rgba(232,0,45,0.3)'
                            ),
                            borderColor: weeklyStats.players.map((_, i) =>
                              i === 0 ? '#E8002D' : 'rgba(232,0,45,0.5)'
                            ),
                            borderWidth: 1,
                            borderRadius: 3,
                          }],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          indexAxis: 'x',
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: '#111318',
                              borderColor: '#1C1F28',
                              borderWidth: 1,
                              titleFont: { family: 'Orbitron', size: 10 },
                              bodyFont: { family: 'Barlow Condensed', size: 13 },
                              titleColor: '#E0E2EA',
                              bodyColor: '#6A6E82',
                            },
                          },
                          scales: {
                            x: {
                              ticks: {
                                color: '#4E5266',
                                font: { family: 'Barlow Condensed', size: 10 },
                                maxRotation: 45,
                                minRotation: 45,
                              },
                              grid: { color: 'rgba(28,31,40,0.5)' },
                            },
                            y: {
                              ticks: {
                                color: '#4E5266',
                                font: { family: 'Barlow Condensed', size: 11 },
                              },
                              grid: { color: 'rgba(28,31,40,0.5)' },
                            },
                          },
                        }}
                      />
                    </div>
                  </>
                )}

                {/* ──── MEMBERS ──── */}
                {innerTab === 'members' && leagueDetails && (
                  <div>
                    {leagueDetails.leaderboard.map((member, i) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.2 }}
                        style={styles.memberRow}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--panel2)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <div style={styles.memberInfo}>
                          <div style={styles.memberAvatar}>
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={styles.memberUsername}>
                              {member.username}
                              {member.id === leagueDetails.ownerId && (
                                <span style={styles.ownerBadge}>OWNER</span>
                              )}
                              {member.isCurrentUser && (
                                <span style={{ color: 'var(--red)', marginLeft: '6px', fontFamily: 'Orbitron', fontSize: '8px', letterSpacing: '1px' }}>YOU</span>
                              )}
                            </div>
                            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '11px', color: 'var(--muted)' }}>
                              Joined {formatDate(member.joinedAt)}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontFamily: 'Orbitron', fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>#{member.rank}</div>
                            <div style={{ fontFamily: 'Barlow Condensed', fontSize: '11px', color: 'var(--muted)' }}>{member.totalPoints} pts</div>
                          </div>
                          <div style={styles.statusDot(member.active)} title={member.active ? 'Active' : 'Inactive'} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>

      {/* ═══ RIGHT — CREATE / JOIN ═══ */}
      <div style={styles.rightPanel}>
        {/* CREATE */}
        <div style={styles.formPanel}>
          <div style={styles.leftHeader}>CREATE LEAGUE</div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>League Name</label>
            <input
              id="leagues-create-name"
              style={styles.formInput}
              type="text"
              placeholder="Enter league name..."
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = 'var(--red)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Max Members</label>
            <select
              id="leagues-create-max"
              style={styles.formSelect}
              value={createMax}
              onChange={(e) => setCreateMax(Number(e.target.value))}
            >
              <option value={6}>6 Members</option>
              <option value={8}>8 Members</option>
              <option value={10}>10 Members</option>
              <option value={12}>12 Members</option>
            </select>
          </div>

          <div>
            <label style={{ ...styles.formLabel, marginBottom: '8px' }}>Privacy</label>
            <div style={styles.privacyGroup}>
              <button
                style={styles.privacyBtn(!createPrivate)}
                onClick={() => setCreatePrivate(false)}
              >
                PUBLIC
              </button>
              <button
                style={styles.privacyBtn(createPrivate)}
                onClick={() => setCreatePrivate(true)}
              >
                PRIVATE
              </button>
            </div>
          </div>

          <button
            id="leagues-create-btn"
            style={styles.submitBtn}
            onClick={handleCreate}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#cc0028'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--red)'; }}
          >
            CREATE LEAGUE
          </button>

          {createResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.resultCard}
            >
              <div style={styles.resultText}>LEAGUE CREATED!</div>
              <div style={styles.resultCode}>{createResult.inviteCode}</div>
              <div style={{ ...styles.resultText, marginTop: '6px', fontSize: '8px', opacity: 0.7 }}>Share this code with friends</div>
            </motion.div>
          )}
        </div>

        {/* JOIN */}
        <div style={styles.formPanel}>
          <div style={styles.leftHeader}>JOIN LEAGUE</div>

          <div style={styles.formGroup}>
            <label style={styles.formLabel}>League Code</label>
            <input
              id="leagues-join-code-input"
              style={{ ...styles.formInput, textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'Orbitron', fontSize: '12px' }}
              type="text"
              placeholder="ENTER CODE"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onFocus={(e) => { e.target.style.borderColor = 'var(--red)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
              onKeyDown={(e) => { if (e.key === 'Enter') handleJoin(); }}
            />
          </div>

          <button
            id="leagues-join-btn"
            style={styles.submitBtn}
            onClick={handleJoin}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#cc0028'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--red)'; }}
          >
            JOIN
          </button>

          {joinResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.resultCard}
            >
              <div style={styles.resultText}>JOINED {joinResult.leagueName}!</div>
            </motion.div>
          )}

          {joinError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ ...styles.resultCard, background: 'rgba(232,0,45,0.06)', borderColor: 'var(--red)' }}
            >
              <div style={{ ...styles.resultText, color: 'var(--red)' }}>{joinError}</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leagues;
