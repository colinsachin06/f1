import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import TopBar from './components/TopBar';
import TabNav from './components/TabNav';
import CareerArc from './components/tabs/CareerArc';
import ConstructorTracker from './components/tabs/ConstructorTracker';
import TrackDNA from './components/tabs/TrackDNA';
import SimBenchmarker from './components/tabs/SimBenchmarker';
import PredictionGame from './components/tabs/PredictionGame';
import SentimentTracker from './components/tabs/SentimentTracker';
import FantasyF1 from './components/tabs/FantasyF1';
import RadioReplay from './components/tabs/RadioReplay';
import PitStopChallenge from './components/tabs/PitStopChallenge';

function App() {
  const [activeTab, setActiveTab] = useState('career');
  const [drivers, setDrivers] = useState([]);
  const [constructors, setConstructors] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [driversRes, constructorsRes, circuitsRes] = await Promise.all([
          axios.get('/api/drivers'),
          axios.get('/api/constructors'),
          axios.get('/api/circuits')
        ]);
        setDrivers(driversRes.data);
        setConstructors(constructorsRes.data);
        setCircuits(circuitsRes.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'career':
        return <CareerArc drivers={drivers} loading={loading} error={error} />;
      case 'constructor':
        return <ConstructorTracker constructors={constructors} loading={loading} error={error} />;
      case 'track':
        return <TrackDNA circuits={circuits} loading={loading} error={error} />;
      case 'sim':
        return <SimBenchmarker circuits={circuits} circuitsLoading={loading} />;
      case 'predictions':
        return <PredictionGame />;
      case 'sentiment':
        return <SentimentTracker />;
      case 'fantasy':
        return <FantasyF1 />;
      case 'radio':
        return <RadioReplay />;
      case 'pitstop':
        return <PitStopChallenge />;
      default:
        return <CareerArc drivers={drivers} loading={loading} error={error} />;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar />
      <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main style={{ 
        flex: 1, 
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #15151e 100%)'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%' }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
