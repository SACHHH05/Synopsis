"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { calculateWaitTime } from "./mmc";

export type QueueItem = {
  id: string;
  name: string;
  phone: string;
  crop: string;
  qty: string;
  status: 'waiting' | 'testing' | 'accepted' | 'rejected';
  waitTime: number;
  timestamp: string;
};

export type KioskState = {
  isOffline: boolean;
  syncedQueue: QueueItem[];
  offlineQueue: QueueItem[];
};

export type FarmerState = {
  isBooked: boolean;
  smsMessages: { id: string; text: string; time: string; type: 'info' | 'alert' | 'success' }[];
};

type AppState = {
  farmer: FarmerState;
  kiosk: KioskState;
  isHydrated: boolean;
  // actions
  addSms: (text: string, type: 'info' | 'alert' | 'success') => void;
  bookSlot: (name: string, phone: string, crop: string, qty: string) => void;
  toggleOffline: () => void;
  acceptLot: (id: string) => void;
  addQueueItem: (item: Omit<QueueItem, 'id' | 'status' | 'waitTime' | 'timestamp'>) => void;
};

const defaultState: AppState = {
  farmer: { isBooked: false, smsMessages: [] },
  kiosk: { isOffline: false, syncedQueue: [], offlineQueue: [] },
  isHydrated: false,
  addSms: () => {},
  bookSlot: () => {},
  toggleOffline: () => {},
  acceptLot: () => {},
  addQueueItem: () => {},
};

const StoreContext = createContext<AppState>(defaultState);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [farmer, setFarmer] = useState<FarmerState>(defaultState.farmer);
  const [kiosk, setKiosk] = useState<KioskState>(defaultState.kiosk);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedKiosk = localStorage.getItem('kisan_kyu_kiosk');
    if (savedKiosk) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setKiosk(JSON.parse(savedKiosk));
      } catch {
        console.error("Failed to parse local storage");
      }
    } else {
      // Seed initial data
      const initialQueue: QueueItem[] = [
        { id: "1001", name: "Ramesh K.", phone: "9876543210", crop: "Wheat", qty: "20Q", status: 'waiting', waitTime: 10, timestamp: new Date().toISOString() },
        { id: "1002", name: "Suresh S.", phone: "8765432109", crop: "Paddy", qty: "15Q", status: 'waiting', waitTime: 15, timestamp: new Date().toISOString() },
      ];
      setKiosk(prev => ({ ...prev, syncedQueue: initialQueue }));
    }
    
    const savedFarmer = localStorage.getItem('kisan_kyu_farmer');
    if (savedFarmer) {
      try {
        setFarmer(JSON.parse(savedFarmer));
      } catch {
        // ignore
      }
    }
    
    setIsHydrated(true);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'kisan_kyu_kiosk' && e.newValue) {
        try { setKiosk(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === 'kisan_kyu_farmer' && e.newValue) {
        try { setFarmer(JSON.parse(e.newValue)); } catch {}
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('kisan_kyu_kiosk', JSON.stringify(kiosk));
      localStorage.setItem('kisan_kyu_farmer', JSON.stringify(farmer));
    }
  }, [kiosk, farmer, isHydrated]);

  const addSms = (text: string, type: 'info' | 'alert' | 'success' = 'info') => {
    setFarmer(prev => ({
      ...prev,
      smsMessages: [
        { id: Date.now().toString(), text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), type },
        ...prev.smsMessages
      ]
    }));
  };

  const bookSlot = (name: string, phone: string, crop: string, qty: string) => {
    setFarmer(prev => ({ ...prev, isBooked: true }));
    
    // Total waiting
    const totalWaiting = kiosk.syncedQueue.length + kiosk.offlineQueue.length;
    // Assume lambda = 0.5 farmers/min, mu = 0.2 farmers/min/counter, c = 3 counters
    const estimatedWait = calculateWaitTime(0.5, 0.2, 3, totalWaiting);
    
    const now = new Date();
    const arrivalDate = new Date(now.getTime() + estimatedWait * 60000);
    const arrivalTime = arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // eslint-disable-next-line react-hooks/purity
    addSms(`[MQTT Simulated] Kisan Kyu: Your slot is confirmed! Token #${Date.now().toString().slice(-4)}. Arrive at Centre A by ${arrivalTime}. Wait time: ~${estimatedWait} mins.`, "success");
    addQueueItem({ name, phone, crop, qty });
  };

  const toggleOffline = () => {
    setKiosk(prev => {
      const newOffline = !prev.isOffline;
      
      // If going back online, sync the offline queue to the synced queue
      if (!newOffline && prev.offlineQueue.length > 0) {
        addSms("System Sync: Offline records have been updated to the central server.", "info");
        return { 
          ...prev, 
          isOffline: newOffline,
          syncedQueue: [...prev.syncedQueue, ...prev.offlineQueue],
          offlineQueue: []
        };
      }
      return { ...prev, isOffline: newOffline };
    });
  };

  const addQueueItem = (itemDetails: Omit<QueueItem, 'id' | 'status' | 'waitTime' | 'timestamp'>) => {
    setKiosk(prev => {
      const totalWaiting = prev.syncedQueue.length + prev.offlineQueue.length;
      const waitTime = calculateWaitTime(0.5, 0.2, 3, totalWaiting);
      
      const newItem: QueueItem = {
        ...itemDetails,
        id: Date.now().toString(),
        status: 'waiting',
        waitTime,
        timestamp: new Date().toISOString()
      };

      if (prev.isOffline) {
        return { ...prev, offlineQueue: [...prev.offlineQueue, newItem] };
      } else {
        return { ...prev, syncedQueue: [...prev.syncedQueue, newItem] };
      }
    });
  };

  const acceptLot = (id: string) => {
    setKiosk(prev => {
      const updateList = (list: QueueItem[]) => list.map(q => q.id === id ? { ...q, status: 'accepted' as const } : q);
      
      const isYou = [...prev.syncedQueue, ...prev.offlineQueue].find(q => q.id === id)?.name?.includes("Demo");
      
      if (isYou) {
        setTimeout(() => addSms("Kisan Kyu: Your lot has been accepted. Payment processing initiated.", "success"), 1000);
      }

      return {
        ...prev,
        syncedQueue: updateList(prev.syncedQueue),
        offlineQueue: updateList(prev.offlineQueue)
      };
    });
  };

  return (
    <StoreContext.Provider value={{ farmer, kiosk, isHydrated, addSms, bookSlot, toggleOffline, acceptLot, addQueueItem }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
