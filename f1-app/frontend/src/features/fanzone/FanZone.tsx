import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { raceApi, userApi } from '../../services/apiService';
import { useAuthStore } from '../../stores/authStore';
import { useUserDataStore } from '../../stores/userDataStore';
import { Card, CardHeader, CardTitle, Badge, LoadingSpinner } from '../../components/ui';
import { X, Radio, Trophy, Users, ChevronRight, Coins, Check, AlertCircle, Loader } from 'lucide-react';
import clsx from 'clsx';

const TABS = [
  { id: 'predictions', label: 'Predictions', icon: Trophy },
  { id: 'fantasy', label: 'Fantasy', icon: Users },
  { id: 'radio', label: 'Radio', icon: Radio },
] as const;

const BETTING_MARKETS = [
  { id: 'race_winner', label: 'Race Winner', odds: 8 },
  { id: 'fastest_lap', label: 'Fastest Lap', odds: 15 },
  { id: 'podium', label: 'Podium Finish', odds: 3 },
  { id: 'top_6', label: 'Top 6 Finish', odds: 2 },
];

export default function FanZone({ sessionKey, onClose }: { sessionKey: number; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('predictions');
  const { user } = useAuthStore();
  const { pitcoins } = useUserDataStore();

  return (
    <div className="w-96 bg-gray-900 border-l border-gray-700 flex flex-col animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div>
          <h2 className="font-f1 font-bold text-lg">Fan Zone</h2>
          <div className="flex items-center gap-1 text-sm">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-500 font-semibold">{user?.pitcoins || pitcoins}</span>
            <span className="text-gray-400">Pitcoins</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex border-b border-gray-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'text-f1-red border-b-2 border-f1-red'
                : 'text-gray-400 hover:text-white'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'predictions' && <PredictionsTab sessionKey={sessionKey} />}
        {activeTab === 'fantasy' && <FantasyTab sessionKey={sessionKey} />}
        {activeTab === 'radio' && <RadioTab sessionKey={sessionKey} />}
      </div>
    </div>
  );
}

function PredictionsTab({ sessionKey }: { sessionKey: number }) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const { data: drivers } = useQuery({
    queryKey: ['drivers', sessionKey],
    queryFn: () => raceApi.getDrivers(sessionKey),
  });

  const { data: userPredictions, isLoading: loadingPredictions } = useQuery({
    queryKey: ['userPredictions'],
    queryFn: userApi.getPredictions,
    enabled: !!user,
  });

  const [prediction, setPrediction] = useState({
    pole: 0,
    p2: 0,
    p3: 0,
    fastestLap: 0,
    dnf1: 0,
    dnf2: 0,
  });

  useEffect(() => {
    if (userPredictions && userPredictions.length > 0) {
      const latest = userPredictions.find((p: any) => p.sessionKey === sessionKey);
      if (latest) {
        setPrediction({
          pole: latest.pole,
          p2: latest.p2,
          p3: latest.p3,
          fastestLap: latest.fastestLap,
          dnf1: latest.dnf1,
          dnf2: latest.dnf2,
        });
      }
    }
  }, [userPredictions, sessionKey]);

  const saveMutation = useMutation({
    mutationFn: () => userApi.savePrediction(sessionKey, prediction),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPredictions'] });
    },
  });

  const predictionFields = [
    { key: 'pole', label: 'Pole Position', icon: '🏆' },
    { key: 'p2', label: 'P2', icon: '🥈' },
    { key: 'p3', label: 'P3', icon: '🥉' },
    { key: 'fastestLap', label: 'Fastest Lap', icon: '⏱️' },
    { key: 'dnf1', label: 'DNF #1', icon: '❌' },
    { key: 'dnf2', label: 'DNF #2', icon: '❌' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Race Predictions</CardTitle>
        </CardHeader>

        {loadingPredictions ? (
          <LoadingSpinner size="sm" />
        ) : (
          <div className="space-y-3">
            {predictionFields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm text-gray-400 mb-1">
                  {field.icon} {field.label}
                </label>
                <select
                  value={prediction[field.key as keyof typeof prediction]}
                  onChange={(e) => {
                    setPrediction({
                      ...prediction,
                      [field.key]: parseInt(e.target.value),
                    });
                  }}
                  className="input w-full"
                >
                  <option value={0}>Select driver</option>
                  {drivers?.slice(0, 10).map((driver: any) => (
                    <option key={driver.driver_number} value={driver.driver_number}>
                      {driver.name_acronym} - {driver.full_name}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending || Object.values(prediction).every(v => v === 0)}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
            >
              {saveMutation.isPending ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : saveMutation.isSuccess ? (
                <Check className="w-4 h-4" />
              ) : null}
              {saveMutation.isSuccess ? 'Saved!' : 'Submit Predictions'}
            </button>
          </div>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Betting</CardTitle>
        </CardHeader>
        <BettingSection sessionKey={sessionKey} />
      </Card>
    </div>
  );
}

function BettingSection({ sessionKey }: { sessionKey: number }) {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();
  const { pitcoins, setPitcoins } = useUserDataStore();
  
  const [selectedDriver, setSelectedDriver] = useState<number>(0);
  const [selectedMarket, setSelectedMarket] = useState<string>('');
  const [stake, setStake] = useState<number>(10);
  const [error, setError] = useState<string>('');

  const { data: drivers } = useQuery({
    queryKey: ['drivers', sessionKey],
    queryFn: () => raceApi.getDrivers(sessionKey),
  });

  const placeBetMutation = useMutation({
    mutationFn: () => userApi.placeBet(sessionKey, selectedMarket, selectedDriver, 
      BETTING_MARKETS.find(m => m.id === selectedMarket)?.odds || 1, stake),
    onSuccess: (data) => {
      setUser({ ...user!, pitcoins: data.pitcoins });
      setPitcoins(data.pitcoins);
      setError('');
      queryClient.invalidateQueries({ queryKey: ['userBets'] });
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to place bet');
    },
  });

  const handlePlaceBet = () => {
    if (!selectedDriver || !selectedMarket) {
      setError('Please select a driver and market');
      return;
    }
    if (stake > (user?.pitcoins || pitcoins)) {
      setError('Insufficient pitcoins');
      return;
    }
    placeBetMutation.mutate();
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Driver</label>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(parseInt(e.target.value))}
          className="input w-full"
        >
          <option value={0}>Select driver</option>
          {drivers?.slice(0, 10).map((driver: any) => (
            <option key={driver.driver_number} value={driver.driver_number}>
              {driver.name_acronym} - {driver.full_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Market</label>
        <div className="space-y-1">
          {BETTING_MARKETS.map((market) => (
            <button
              key={market.id}
              onClick={() => setSelectedMarket(market.id)}
              className={clsx(
                'w-full flex items-center justify-between p-2 rounded-lg transition-colors',
                selectedMarket === market.id
                  ? 'bg-f1-red/20 border border-f1-red'
                  : 'bg-gray-800/50 hover:bg-gray-800'
              )}
            >
              <span className="text-sm">{market.label}</span>
              <Badge variant={selectedMarket === market.id ? 'green' : 'blue'}>
                {market.odds}x
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">
          Stake: {stake} Pitcoins
        </label>
        <input
          type="range"
          min="10"
          max={user?.pitcoins || pitcoins}
          step="10"
          value={stake}
          onChange={(e) => setStake(parseInt(e.target.value))}
          className="w-full accent-f1-red"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-900/30 rounded text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <button
        onClick={handlePlaceBet}
        disabled={placeBetMutation.isPending || !selectedDriver || !selectedMarket}
        className="btn-primary w-full"
      >
        {placeBetMutation.isPending ? 'Placing bet...' : `Place Bet (Win ${stake * (BETTING_MARKETS.find(m => m.id === selectedMarket)?.odds || 1)} PC)`}
      </button>
    </div>
  );
}

function FantasyTab({ sessionKey }: { sessionKey: number }) {
  const queryClient = useQueryClient();
  
  const { data: drivers } = useQuery({
    queryKey: ['drivers', sessionKey],
    queryFn: () => raceApi.getDrivers(sessionKey),
  });

  const { data: fantasyTeams, isLoading } = useQuery({
    queryKey: ['fantasyTeams'],
    queryFn: userApi.getFantasyTeams,
  });

  const driverPrices: Record<number, number> = {
    1: 25, 11: 25, 16: 20, 55: 20, 44: 18, 63: 18, 4: 15, 81: 15, 14: 12, 18: 12,
  };

  const [selectedDrivers, setSelectedDrivers] = useState<number[]>([]);
  const [remainingBudget, setRemainingBudget] = useState(100);

  const existingTeam = fantasyTeams?.find((t: any) => t.sessionKey === sessionKey);
  
  useEffect(() => {
    if (existingTeam) {
      const drivers = JSON.parse(existingTeam.drivers);
      setSelectedDrivers(drivers);
      const usedBudget = drivers.reduce((sum: number, d: number) => sum + (driverPrices[d] || 10), 0);
      setRemainingBudget(100 - usedBudget);
    }
  }, [existingTeam]);

  const toggleDriver = (driverNumber: number) => {
    const price = driverPrices[driverNumber] || 10;
    
    if (selectedDrivers.includes(driverNumber)) {
      setSelectedDrivers(selectedDrivers.filter((d) => d !== driverNumber));
      setRemainingBudget(remainingBudget + price);
    } else if (remainingBudget >= price && selectedDrivers.length < 5) {
      setSelectedDrivers([...selectedDrivers, driverNumber]);
      setRemainingBudget(remainingBudget - price);
    }
  };

  const saveMutation = useMutation({
    mutationFn: () => userApi.saveFantasyTeam(sessionKey, selectedDrivers, remainingBudget),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fantasyTeams'] });
    },
  });

  if (isLoading) return <LoadingSpinner size="sm" />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Fantasy Team Builder</CardTitle>
          <div className="text-sm">
            <span className="text-gray-400">Budget: </span>
            <span className="font-bold text-green-500">${remainingBudget}M</span>
          </div>
        </CardHeader>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {drivers?.slice(0, 10).map((driver: any) => {
            const price = driverPrices[driver.driver_number] || 10;
            const isSelected = selectedDrivers.includes(driver.driver_number);
            const canAfford = remainingBudget >= price;

            return (
              <div
                key={driver.driver_number}
                onClick={() => toggleDriver(driver.driver_number)}
                className={clsx(
                  'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all',
                  isSelected
                    ? 'bg-gray-700 border border-f1-red'
                    : 'bg-gray-800/50 hover:bg-gray-800',
                  !canAfford && !isSelected && 'opacity-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: driver.team_colour }}
                  />
                  <div>
                    <span className="font-medium">{driver.name_acronym}</span>
                    <span className="text-xs text-gray-400 ml-2">{driver.team_name.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={isSelected ? 'green' : 'blue'}>
                    ${price}M
                  </Badge>
                  {isSelected && <ChevronRight className="w-4 h-4 text-f1-red" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400 mb-2">
            Selected: {selectedDrivers.length}/5 drivers
          </div>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || selectedDrivers.length === 0}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {saveMutation.isPending ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : saveMutation.isSuccess ? (
              <Check className="w-4 h-4" />
            ) : null}
            {saveMutation.isSuccess ? 'Team Saved!' : 'Save Team'}
          </button>
        </div>
      </Card>

      {fantasyTeams && fantasyTeams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Teams</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {fantasyTeams.slice(0, 5).map((team: any) => (
              <div key={team.id} className="p-2 bg-gray-800/50 rounded">
                <div className="flex justify-between text-sm">
                  <span>Session #{team.sessionKey}</span>
                  <span className="text-gray-400">${team.budget}M left</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function RadioTab({ sessionKey }: { sessionKey: number }) {
  const { data: teamRadio, isLoading } = useQuery({
    queryKey: ['teamRadio', sessionKey],
    queryFn: () => raceApi.getTeamRadio(sessionKey),
  });

  if (isLoading) return <LoadingSpinner />;

  if (!teamRadio || teamRadio.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Radio</CardTitle>
        </CardHeader>
        <div className="text-center py-8 text-gray-400">
          No team radio recordings available
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Radio ({teamRadio.length})</CardTitle>
        </CardHeader>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {teamRadio.map((radio: any, i: number) => (
            <div key={i} className="bg-gray-800/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Driver #{radio.driver_number}</span>
                <span className="text-xs text-gray-400">
                  {new Date(radio.date).toLocaleTimeString()}
                </span>
              </div>
              <audio
                controls
                className="w-full h-8"
                src={radio.recording_url}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
