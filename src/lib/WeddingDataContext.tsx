/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_SYNC_DATA } from './sheetsSync';

interface WeddingDataContextType {
  data: Record<string, string>;
  isLoading: boolean;
  isSynced: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateLocalData: (newData: Record<string, string>) => void;
}

const WeddingDataContext = createContext<WeddingDataContextType | undefined>(undefined);

export function WeddingDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.entries(DEFAULT_SYNC_DATA).forEach(([key, item]) => {
      initial[key] = item.val;
    });
    return initial;
  });

  const [isLoading] = useState(false);
  const [isSynced] = useState(false);
  const [error] = useState<string | null>(null);

  const updateLocalData = (newData: Record<string, string>) => {
    setData(prev => ({
      ...prev,
      ...newData
    }));
  };

  const loadData = async () => {
    // No-op - data is now static from DEFAULT_SYNC_DATA
    // Guestbook and RSVP use D1 database via API
  };

  return (
    <WeddingDataContext.Provider
      value={{
        data,
        isLoading,
        isSynced,
        error,
        refreshData: loadData,
        updateLocalData
      }}
    >
      {children}
    </WeddingDataContext.Provider>
  );
}

export function useWeddingData() {
  const context = useContext(WeddingDataContext);
  if (!context) {
    throw new Error('useWeddingData must be used within a WeddingDataProvider');
  }
  return context;
}
