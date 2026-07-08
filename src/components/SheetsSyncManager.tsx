/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cloud, 
  CloudCheck, 
  CloudLightning, 
  Database, 
  ExternalLink, 
  HelpCircle, 
  Lock, 
  RefreshCw, 
  Settings, 
  Sparkles, 
  User, 
  X 
} from 'lucide-react';
import { useWeddingData, SPREADSHEET_ID } from '../lib/WeddingDataContext';
import { 
  googleSignIn, 
  initAuth, 
  logout, 
  checkIfSheetEmptyOrNew, 
  initializeSpreadsheet, 
  pushCurrentStateToSheet, 
  fetchAuthSheetData 
} from '../lib/sheetsSync';
import { User as FirebaseUser } from 'firebase/auth';

export default function SheetsSyncManager() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSheetEmpty, setIsSheetEmpty] = useState(false);
  const [isSheetOutdated, setIsSheetOutdated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  const { data, isSynced, refreshData, updateLocalData } = useWeddingData();

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, cachedToken) => {
        setCurrentUser(user);
        setToken(cachedToken);
        checkSpreadsheetState(cachedToken);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const checkSpreadsheetState = async (authToken: string) => {
    try {
      const isEmpty = await checkIfSheetEmptyOrNew(SPREADSHEET_ID, authToken);
      setIsSheetEmpty(isEmpty);
      if (!isEmpty) {
        const fetched = await fetchAuthSheetData(SPREADSHEET_ID, authToken);
        const isOutdated = ('chapter1_title' in fetched) && !('chapter3_title' in fetched);
        setIsSheetOutdated(isOutdated);
      } else {
        setIsSheetOutdated(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSignIn = async () => {
    setIsSyncing(true);
    setStatusMessage('Connecting with Google...');
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.accessToken);
        setSyncStatus('success');
        setStatusMessage(`Logged in as ${result.user.displayName}`);
        await checkSpreadsheetState(result.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatus('error');
      setStatusMessage(err?.message || 'Login failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setCurrentUser(null);
    setToken(null);
    setSyncStatus('idle');
    setStatusMessage('Logged out.');
  };

  const handleInitialize = async () => {
    if (!token) return;
    setIsInitializing(true);
    setStatusMessage('Writing initial wedding data template to Sheet1...');
    try {
      await initializeSpreadsheet(SPREADSHEET_ID, token);
      setIsSheetEmpty(false);
      setIsSheetOutdated(false);
      setSyncStatus('success');
      setStatusMessage('Spreadsheet initialized successfully! Try editing it now.');
      
      // Pull fresh data
      const fetched = await fetchAuthSheetData(SPREADSHEET_ID, token);
      updateLocalData(fetched);
    } catch (err: any) {
      console.error(err);
      setSyncStatus('error');
      setStatusMessage(err?.message || 'Failed to initialize sheet.');
    } finally {
      setIsInitializing(false);
    }
  };

  const handlePullData = async () => {
    if (!token) {
      // General refresh (no login needed)
      setIsSyncing(true);
      setStatusMessage('Fetching latest spreadsheet updates...');
      try {
        await refreshData();
        setSyncStatus('success');
        setStatusMessage('Website updated with the latest Google Sheet data!');
      } catch (err: any) {
        setSyncStatus('error');
        setStatusMessage('Could not update. Verify sheet is public or log in.');
      } finally {
        setIsSyncing(false);
      }
      return;
    }

    setIsSyncing(true);
    setStatusMessage('Syncing data from Sheet1...');
    try {
      const fetched = await fetchAuthSheetData(SPREADSHEET_ID, token);
      updateLocalData(fetched);
      setSyncStatus('success');
      setStatusMessage('Succeeded! Website is now fully in sync with Google Sheets.');
    } catch (err: any) {
      console.error(err);
      setSyncStatus('error');
      setStatusMessage(err?.message || 'Pull failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePushData = async () => {
    if (!token) return;
    const confirmed = window.confirm(
      'Are you sure you want to overwrite your Google Sheet content with the current website state?'
    );
    if (!confirmed) return;

    setIsSyncing(true);
    setStatusMessage('Pushing local content to Sheet1...');
    try {
      await pushCurrentStateToSheet(SPREADSHEET_ID, token, data);
      setSyncStatus('success');
      setStatusMessage('Google Sheet overwritten successfully with current website data!');
      setIsSheetEmpty(false);
      setIsSheetOutdated(false);
    } catch (err: any) {
      console.error(err);
      setSyncStatus('error');
      setStatusMessage(err?.message || 'Push failed.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      {/* FLOATING ACCESS BUTTON */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className={`p-3.5 rounded-full shadow-[0_4px_15px_rgba(207,155,58,0.25)] border transition-all duration-300 hover:scale-108 focus:outline-none flex items-center gap-2 group cursor-pointer ${
            isSynced 
              ? 'bg-emerald-900/90 border-gold-400 text-gold-300 hover:bg-emerald-800' 
              : 'bg-emerald-950/95 border-gold-500/30 text-gold-400 hover:bg-emerald-900'
          }`}
          title="Google Sheets Synchronization Panel"
          id="toggle-sheets-sync-panel"
        >
          {isSynced ? (
            <CloudCheck size={18} className="text-gold-300 animate-pulse" />
          ) : (
            <Cloud size={18} className="text-gold-400 group-hover:rotate-6 transition-transform" />
          )}
          <span className="text-xs font-mono font-bold tracking-wider uppercase hidden md:inline">
            {isSynced ? 'Sheets Active' : 'Sheets Sync'}
          </span>
        </button>
      </div>

      {/* PANELS MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-sm"
              id="sheets-panel-backdrop"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-emerald-950 border-2 border-gold-400/40 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden text-gold-100 z-10"
              id="sheets-sync-modal"
            >
              {/* Internal border styling */}
              <div className="absolute inset-2 border border-gold-400/10 rounded-2xl pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-gold-400/60 hover:text-gold-300 transition-colors p-1"
                id="close-sheets-panel"
              >
                <X size={20} />
              </button>

              {/* Title & Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-gold-400/10 border border-gold-400/25">
                  <Database className="text-gold-400" size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-gold-100 tracking-wide flex items-center gap-2">
                    Google Sheets Sync
                    <Sparkles size={14} className="text-gold-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] font-mono text-gold-300/60 uppercase tracking-widest">
                    Real-time Content Management
                  </p>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-emerald-900/40 border border-gold-300/15 rounded-2xl p-4 mb-5 text-sm">
                <div className="flex items-start gap-2.5">
                  {isSynced ? (
                    <CloudCheck className="text-emerald-400 mt-0.5 shrink-0" size={16} />
                  ) : (
                    <CloudLightning className="text-gold-400 mt-0.5 shrink-0" size={16} />
                  )}
                  <div>
                    <span className="font-serif font-bold block text-gold-200">
                      Current Live Status:
                    </span>
                    <p className="text-xs text-gold-100/80 mt-1">
                      {isSynced 
                        ? 'The website is actively reading customized texts, images, and maps directly from your Google Sheet.'
                        : 'Currently running on default premium values. Your Google Sheet hasn\'t been initialized or linked yet.'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gold-300/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-gold-400/70">Spreadsheet:</span>
                  <a 
                    href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="text-gold-300 hover:text-gold-400 flex items-center gap-1 font-semibold"
                  >
                    Open Google Sheet
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Action/Admin Console */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-gold-400 border-b border-gold-400/20 pb-1.5 flex items-center gap-1.5">
                  <Lock size={12} />
                  <span>Host / Admin Console</span>
                </div>

                {currentUser ? (
                  // LOGGED IN VIEW
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-emerald-950/60 border border-gold-400/20 rounded-xl px-3.5 py-2.5 text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gold-400/20 flex items-center justify-center border border-gold-400/40 overflow-hidden">
                          {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="Avatar" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          ) : (
                            <User size={12} className="text-gold-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-semibold block text-gold-200">{currentUser.displayName}</span>
                          <span className="text-[10px] text-gold-300/50 block">{currentUser.email}</span>
                        </div>
                      </div>
                      <button 
                        onClick={handleSignOut}
                        className="text-red-400 hover:text-red-300 font-mono text-[10px] uppercase font-bold border border-red-500/20 rounded-lg px-2.5 py-1 hover:bg-red-500/10"
                      >
                        Sign Out
                      </button>
                    </div>

                    {isSheetEmpty ? (
                      <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl p-3.5 text-xs text-amber-200">
                        <p className="font-bold flex items-center gap-1.5 mb-1 text-gold-300">
                          <HelpCircle size={14} /> Spreadsheet is Empty
                        </p>
                        Your connected spreadsheet is currently blank. Initialize it with our premium default template so you can begin editing!
                        <button
                          onClick={handleInitialize}
                          disabled={isInitializing}
                          className="mt-3 w-full bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-emerald-950 font-serif font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw size={12} className={isInitializing ? 'animate-spin' : ''} />
                          {isInitializing ? 'Initializing...' : 'Initialize Spreadsheet'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {isSheetOutdated && (
                          <div className="bg-amber-950/45 border border-amber-500/25 rounded-xl p-3.5 text-xs text-amber-200">
                            <p className="font-bold flex items-center gap-1.5 mb-1 text-gold-300">
                              <HelpCircle size={14} /> Outdated Sheet Structure
                            </p>
                            Your Google Sheet template is outdated. Please click <strong>"Overwrite Sheet"</strong> to upgrade it to support the latest timeline and gallery structure!
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={handlePullData}
                            disabled={isSyncing}
                            className="bg-emerald-900 border border-gold-400/50 hover:bg-emerald-800 disabled:bg-emerald-900/50 text-gold-100 font-serif font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                            Pull from Sheet
                          </button>

                          <button
                            onClick={handlePushData}
                            disabled={isSyncing}
                            className="bg-gold-500 hover:bg-gold-400 disabled:bg-gold-500/50 text-emerald-950 font-serif font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <CloudCheck size={13} />
                            Overwrite Sheet
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // LOGGED OUT VIEW
                  <div>
                    <p className="text-xs text-gold-300/70 mb-4 font-sans leading-relaxed">
                      Are you the wedding host? Connect your Google account to manage, initialize, or force pull/push updates between this digital invitation and your Google Sheet.
                    </p>
                    <button
                      onClick={handleSignIn}
                      disabled={isSyncing}
                      className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-sans font-semibold text-sm py-3 px-4 rounded-xl shadow-lg transition-all border border-gray-300 cursor-pointer disabled:opacity-50"
                      id="google-signin-btn"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Status Message Logs */}
              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 p-3 rounded-xl text-center text-xs font-mono border ${
                      syncStatus === 'success'
                        ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                        : syncStatus === 'error'
                          ? 'bg-red-950/40 border-red-500/30 text-red-300'
                          : 'bg-emerald-900/20 border-gold-400/20 text-gold-300'
                    }`}
                  >
                    {statusMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Guest Warning / Helper */}
              <div className="mt-6 text-[10px] text-center text-gold-400/50 font-serif leading-normal max-w-sm mx-auto">
                Any changes made to the Google Sheet tab "Sheet1" are fetched automatically by the invite website. Ensure columns remain Key and Value.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
