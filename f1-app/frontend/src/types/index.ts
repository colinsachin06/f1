export interface User {
  id: string;
  email: string;
  username: string;
  pitcoins: number;
  createdAt?: string;
}

export interface Session {
  session_key: number;
  meeting_key: number;
  session_name: string;
  session_type: string;
  year: number;
  country_name: string;
  location: string;
  circuit_short_name: string;
  date_start: string;
  date_end: string;
  meeting_name?: string;
  circuit_info_url?: string;
  circuit_image?: string;
}

export interface Driver {
  driver_number: number;
  first_name: string;
  last_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string;
  headshot_url?: string;
  session_key: number;
}

export interface LeaderboardEntry {
  position: number;
  driverNumber: number;
  driverName: string;
  teamName: string;
  teamColor: string;
  gapToLeader: number | null;
  interval: number | null;
}

export interface Lap {
  date_start: string;
  driver_number: number;
  lap_number: number;
  lap_duration: number;
  duration_sector_1: number;
  duration_sector_2: number;
  duration_sector_3: number;
  i1_speed: number;
  i2_speed: number;
  st_speed: number;
  is_pit_out_lap: boolean;
}

export interface Stint {
  stint_number: number;
  driver_number: number;
  lap_start: number;
  lap_end: number;
  compound: string;
  tyre_age_at_start: number;
}

export interface CarData {
  date: string;
  driver_number: number;
  speed: number;
  throttle: number;
  brake: number;
  n_gear: number;
  rpm: number;
  drs: number;
}

export interface Location {
  date: string;
  driver_number: number;
  x: number;
  y: number;
  z: number;
}

export interface PitStop {
  date: string;
  driver_number: number;
  lap_number: number;
  stop_duration: number;
  lane_duration: number;
}

export interface Weather {
  date: string;
  air_temperature: number;
  track_temperature: number;
  humidity: number;
  rainfall: boolean;
  wind_speed: number;
}

export interface Overtake {
  date: string;
  overtaking_driver_number: number;
  overtaken_driver_number: number;
  position: number;
}

export interface TeamRadio {
  date: string;
  driver_number: number;
  meeting_key: number;
  session_key: number;
  recording_url: string;
  transcription?: string;
}

export interface RaceControl {
  date: string;
  flag: string;
  category: string;
  message: string;
  driver_number?: number;
  scope: string;
  sector?: number;
  lap_number?: number;
}

export interface ChampionshipStanding {
  driver_number?: number;
  team_name?: string;
  position_current: number;
  position_start: number;
  points_current: number;
  points_start: number;
}

export interface FantasyTeam {
  id: string;
  sessionKey: number;
  drivers: number[];
  budget: number;
}

export interface Bet {
  id: string;
  sessionKey: number;
  market: string;
  driverNumber: number;
  odds: number;
  stake: number;
  payout?: number;
  won?: boolean;
  settled: boolean;
}

export interface Prediction {
  id: string;
  sessionKey: number;
  pole: number;
  p2: number;
  p3: number;
  fastestLap: number;
  dnf1: number;
  dnf2: number;
  points: number;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}
