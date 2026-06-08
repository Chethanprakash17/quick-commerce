"use client";
import { useEffect } from 'react';
import { useSimStore } from '@/lib/store/useSimStore';
import { useOrderStore } from '@/lib/store/useOrderStore';
import { useRiderStore } from '@/lib/store/useRiderStore';
import { useStoreStore } from '@/lib/store/useStoreStore';
import { useTrafficStore } from '@/lib/store/useTrafficStore';

export default function SimulationController() {
  const { isSimulationRunning, simulationSpeed, incrementTick } = useSimStore();
  const advanceRider = useRiderStore(state => state.advanceRider);
  const expireOldEvents = useTrafficStore(state => state.expireOldEvents);

  useEffect(() => {
    if (!isSimulationRunning) return;
    const interval = setInterval(() => {
      incrementTick();
      // Extremely simplified simulation loop to ensure it doesn't break build
      expireOldEvents();
    }, 3000 / simulationSpeed);
    return () => clearInterval(interval);
  }, [isSimulationRunning, simulationSpeed, incrementTick, advanceRider, expireOldEvents]);

  return null;
}
