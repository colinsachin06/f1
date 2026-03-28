import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { raceApi } from '../../services/apiService';
import { Calendar, MapPin, Flag, Trophy } from 'lucide-react';
import { Card, CardHeader, CardTitle, LoadingSpinner } from '../../components/ui';
import clsx from 'clsx';

export default function SessionSelector() {
  const [year, setYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions', year],
    queryFn: () => raceApi.getSessions(year),
  });

  const { data: latestSession } = useQuery({
    queryKey: ['latestSession'],
    queryFn: () => raceApi.getLatestSession(),
    refetchInterval: 60000,
  });

  const handleSessionSelect = (sessionKey: number) => {
    navigate(`/session/${sessionKey}`);
  };

  const groupSessionsByMeeting = (sessions: any[]) => {
    const grouped: Record<number, any[]> = {};
    sessions?.forEach((session) => {
      if (!grouped[session.meeting_key]) {
        grouped[session.meeting_key] = [];
      }
      grouped[session.meeting_key].push(session);
    });
    return Object.entries(grouped).map(([key, meetingSessions]: [string, any[]]): any => ({
      meeting_key: parseInt(key),
      ...meetingSessions[0],
      sessions: meetingSessions as any[],
    }));
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'Race':
        return <Flag className="w-4 h-4" />;
      case 'Qualifying':
      case 'Sprint Qualifying':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const isLive = (session: any) => {
    const now = new Date();
    const start = new Date(session.date_start);
    const end = new Date(session.date_end);
    return now >= start && now <= end;
  };

  const groupedSessions = groupSessionsByMeeting(sessions || []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-f1 font-bold text-3xl text-white mb-2">Select a Session</h1>
        <p className="text-gray-400">Choose a race weekend to explore F1 data</p>
      </div>

      <div className="flex gap-4 mb-6">
        {[2026, 2025, 2024, 2023].map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              year === y
                ? 'bg-f1-red text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            )}
          >
            {y}
          </button>
        ))}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6">
          {latestSession && latestSession.length > 0 && (
            <Card className="border-f1-red bg-f1-red/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-f1-red mb-1">
                    <span className="w-2 h-2 bg-f1-red rounded-full animate-pulse" />
                    <span className="font-semibold">LIVE NOW</span>
                  </div>
                  <CardTitle>{latestSession[0].meeting_name || latestSession[0].circuit_short_name}</CardTitle>
                  <p className="text-gray-400 mt-1">
                    {latestSession[0].session_name} - {latestSession[0].location}
                  </p>
                </div>
                <button
                  onClick={() => handleSessionSelect(latestSession[0].session_key)}
                  className="btn-primary"
                >
                  Watch Live
                </button>
              </div>
            </Card>
          )}

          {groupedSessions.map((meeting) => (
            <Card key={meeting.meeting_key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-f1-red/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-f1-red" />
                    </div>
                    <div>
                      <CardTitle>{meeting.circuit_short_name}</CardTitle>
                      <p className="text-sm text-gray-400">{meeting.location}, {meeting.country_name}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(meeting.date_start).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </CardHeader>

              <div className="space-y-2">
                {(meeting.sessions as any[]).map((session: any) => (
                  <button
                    key={session.session_key}
                    onClick={() => handleSessionSelect(session.session_key)}
                    className={clsx(
                      'w-full flex items-center justify-between p-3 rounded-lg transition-colors',
                      isLive(session)
                        ? 'bg-f1-red/20 border border-f1-red'
                        : 'bg-gray-800/50 hover:bg-gray-800'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-8 h-8 rounded-lg flex items-center justify-center',
                        isLive(session) ? 'bg-f1-red text-white' : 'bg-gray-700 text-gray-300'
                      )}>
                        {getSessionIcon(session.session_type)}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{session.session_name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(session.date_start).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    {isLive(session) && (
                      <span className="badge bg-red-900/50 text-red-300 border border-red-700">
                        LIVE
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          ))}

          {groupedSessions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No sessions found for {year}. Try selecting a different year.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
