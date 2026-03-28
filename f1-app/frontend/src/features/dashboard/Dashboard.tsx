import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { raceApi } from '../../services/apiService';
import { useRaceStore } from '../../stores/raceStore';
import { useUIStore } from '../../stores/uiStore';
import { LoadingSpinner } from '../../components/ui';
import Leaderboard from '../leaderboard/Leaderboard';
import TrackMap from '../track/TrackMap';
import Telemetry from '../telemetry/Telemetry';
import Strategy from '../strategy/Strategy';
import DeltaChart from '../delta/DeltaChart';
import WhatIf from '../whatif/WhatIf';
import OvertakesPanel from '../overtakes/OvertakesPanel';
import RaceControlPanel from '../racecontrol/RaceControlPanel';
import ChampionshipWidget from '../championship/ChampionshipWidget';
import SessionResults from '../results/SessionResults';
import StartingGrid from '../grid/StartingGrid';
import ChatWidget from '../chat/ChatWidget';
import FanZone from '../fanzone/FanZone';
import WeatherWidget from '../weather/WeatherWidget';
import { Map, Activity, Settings2, TrendingUp, Calculator, Zap, Flag, Trophy, MessageCircle, History } from 'lucide-react';
import clsx from 'clsx';

type TabId = 'leaderboard' | 'track' | 'telemetry' | 'strategy' | 'delta' | 'overtakes' | 'racecontrol' | 'championship' | 'results' | 'grid' | 'whatif';

const tabs: { id: TabId; label: string; icon: any }[] = [
  { id: 'leaderboard', label: 'Leaderboard', icon: Map },
  { id: 'track', label: 'Track', icon: Map },
  { id: 'telemetry', label: 'Telemetry', icon: Activity },
  { id: 'strategy', label: 'Strategy', icon: Settings2 },
  { id: 'delta', label: 'Lap Delta', icon: TrendingUp },
  { id: 'overtakes', label: 'Overtakes', icon: Flag },
  { id: 'racecontrol', label: 'Race Control', icon: Flag },
  { id: 'championship', label: 'Championship', icon: Trophy },
  { id: 'results', label: 'Results', icon: History },
  { id: 'grid', label: 'Grid', icon: History },
  { id: 'whatif', label: 'What-If', icon: Calculator },
];

export default function Dashboard() {
  const { sessionKey } = useParams<{ sessionKey: string }>();
  const { activeTab, setActiveTab, fanZoneOpen, setFanZoneOpen } = useUIStore();
  const [chatOpen, setChatOpen] = useState(false);
  const { setCurrentSession, setDrivers } = useRaceStore();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session', sessionKey],
    queryFn: () => raceApi.getSession(parseInt(sessionKey!)),
    enabled: !!sessionKey,
  });

  const { data: drivers } = useQuery({
    queryKey: ['drivers', sessionKey],
    queryFn: () => raceApi.getDrivers(parseInt(sessionKey!)),
    enabled: !!sessionKey,
  });

  useEffect(() => {
    if (session?.[0]) {
      setCurrentSession(session[0]);
    }
  }, [session, setCurrentSession]);

  useEffect(() => {
    if (drivers) {
      setDrivers(drivers);
    }
  }, [drivers, setDrivers]);

  if (sessionLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-900/50 border-b border-gray-700 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="font-f1 font-bold text-xl">
                  {session?.[0]?.circuit_short_name || 'Race Session'}
                </h2>
                <p className="text-sm text-gray-400">
                  {session?.[0]?.meeting_name} | {session?.[0]?.location}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <WeatherWidget sessionKey={parseInt(sessionKey!)} />
              
              <button
                onClick={() => setChatOpen(!chatOpen)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  chatOpen
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
              >
                <MessageCircle className="w-4 h-4" />
                AI Chat
              </button>
              
              <button
                onClick={() => setFanZoneOpen(!fanZoneOpen)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  fanZoneOpen
                    ? 'bg-f1-red text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                )}
              >
                <Zap className="w-4 h-4" />
                Fan Zone
              </button>
            </div>
          </div>
          
          <div className="flex gap-1 mt-4 overflow-x-auto pb-2 scrollbar-thin">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'tab-button whitespace-nowrap flex items-center gap-2',
                  activeTab === tab.id && 'active'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className={clsx(
              'col-span-12',
              fanZoneOpen ? 'xl:col-span-8' : 'lg:col-span-9',
              chatOpen && 'mr-96'
            )}>
              {activeTab === 'leaderboard' && <Leaderboard sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'track' && <TrackMap sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'telemetry' && <Telemetry sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'strategy' && <Strategy sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'delta' && <DeltaChart sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'whatif' && <WhatIf sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'overtakes' && <OvertakesPanel sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'racecontrol' && <RaceControlPanel sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'championship' && <ChampionshipWidget sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'results' && <SessionResults sessionKey={parseInt(sessionKey!)} />}
              {activeTab === 'grid' && <StartingGrid sessionKey={parseInt(sessionKey!)} />}
            </div>
            
            {activeTab === 'leaderboard' && (
              <div className="hidden xl:block xl:col-span-4">
                <div className="sticky top-4 space-y-4">
                  <RaceControlPanel sessionKey={parseInt(sessionKey!)} />
                  <ChampionshipWidget sessionKey={parseInt(sessionKey!)} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {fanZoneOpen && (
        <FanZone sessionKey={parseInt(sessionKey!)} onClose={() => setFanZoneOpen(false)} />
      )}

      {chatOpen && (
        <ChatWidget sessionKey={parseInt(sessionKey!)} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}
