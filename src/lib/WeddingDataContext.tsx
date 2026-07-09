/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_SYNC_DATA, fetchPublicSheetData, pushCurrentStateToSheet } from './sheetsSync';
import { googleSignIn, logout as firebaseLogout } from './sheetsSync';

export const SPREADSHEET_ID = '1PHUS1635C9Ybn4_TdHfQNLz8kVz1hRBJXrJ3e0FNIt4';

interface WeddingDataContextType {
  data: Record<string, string>;
  isLoading: boolean;
  isSynced: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateLocalData: (newData: Record<string, string>) => void;
  pushToSheet: () => Promise<boolean>;
  isAuthenticated: boolean;
  signIn: () => Promise<boolean>;
  signOut: () => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const sanitizeSheetData = (sheetData: Record<string, string>): Record<string, string> => {
    // Merge sheet data with DEFAULT_SYNC_DATA to preserve default values for missing keys
    const result: Record<string, string> = {};
    Object.entries(DEFAULT_SYNC_DATA).forEach(([key, item]) => {
      result[key] = sheetData[key] !== undefined ? sheetData[key] : item.val;
    });
    return result;
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const sheetData = await fetchPublicSheetData(SPREADSHEET_ID);
      if (sheetData && Object.keys(sheetData).length > 0) {
        const sanitized = sanitizeSheetData(sheetData);
        setData(sanitized);
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

  const signIn = async (): Promise<boolean> => {
    try {
      const result = await googleSignIn();
      if (result) {
        setAccessToken(result.accessToken);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Sign in failed:', error);
      return false;
    }
  };

  const signOut = async () => {
    await firebaseLogout();
    setAccessToken(null);
    setIsAuthenticated(false);
  };

  const pushToSheet = async (): Promise<boolean> => {
    if (!isAuthenticated || !accessToken) {
      return false;
    }
    try {
      await pushCurrentStateToSheet(SPREADSHEET_ID, accessToken, data);
      return true;
    } catch (error) {
      console.error('Push to sheet failed:', error);
      return false;
    }
  };

  return (
    <WeddingDataContext.Provider
      value={{
        data,
        isLoading,
        isSynced,
        error,
        refreshData: loadData,
        updateLocalData,
        pushToSheet,
        isAuthenticated,
        signIn,
        signOut
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
