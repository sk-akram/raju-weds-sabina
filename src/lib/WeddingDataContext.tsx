/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SYNC_DATA, fetchPublicSheetData } from './sheetsSync';

export const SPREADSHEET_ID = '1PHUS1635C9Ybn4_TdHfQNLz8kVz1hRBJXrJ3e0FNIt4';

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

  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sanitizeSheetData = (sheetData: Record<string, string>): Record<string, string> => {
    return sheetData;
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const sheetData = await fetchPublicSheetData(SPREADSHEET_ID);
      if (sheetData && Object.keys(sheetData).length > 0) {
        const sanitized = sanitizeSheetData(sheetData);
        setData(prev => ({
          ...prev,
          ...sanitized
        }));
        setIsSynced(true);
        setError(null);
      } else {
        setIsSynced(false);
      }
    } catch (err: any) {
      console.error('Failed to auto-sync Google Sheets data:', err);
      setError(err?.message || 'Failed to sync');
      setIsSynced(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateLocalData = (newData: Record<string, string>) => {
    const sanitized = sanitizeSheetData(newData);
    setData(prev => ({
      ...prev,
      ...sanitized
    }));
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
