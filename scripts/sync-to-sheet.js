/**
 * Script to sync existing website data to Google Sheet
 * Run this locally to initialize the Google Sheet with all the data keys
 */

import { DEFAULT_SYNC_DATA, pushCurrentStateToSheet, googleSignIn, initAuth } from '../src/lib/sheetsSync.js';

const SPREADSHEET_ID = '1PHUS1635C9Ybn4_TdHfQNLz8kVz1hRBJXrJ3e0FNIt4';

async function syncToSheet() {
  console.log('🔄 Starting sync to Google Sheet...');
  console.log('📋 Spreadsheet ID:', SPREADSHEET_ID);
  
  // Prepare the current data from DEFAULT_SYNC_DATA
  const currentData = {};
  Object.entries(DEFAULT_SYNC_DATA).forEach(([key, item]) => {
    currentData[key] = item.val;
  });
  
  console.log('📦 Data keys to sync:', Object.keys(currentData).length);
  console.log('📝 Keys:', Object.keys(currentData).join(', '));
  
  // Set up auth listener
  let accessToken = null;
  
  const authListener = initAuth(
    (user, token) => {
      console.log('✅ Authenticated as:', user.displayName);
      accessToken = token;
    },
    () => {
      console.log('❌ Signed out');
      accessToken = null;
    }
  );
  
  // Sign in
  console.log('🔐 Signing in with Google...');
  try {
    const result = await googleSignIn();
    if (!result) {
      console.error('❌ Failed to sign in');
      process.exit(1);
    }
    accessToken = result.accessToken;
    console.log('✅ Signed in successfully');
  } catch (error) {
    console.error('❌ Sign in error:', error.message);
    process.exit(1);
  }
  
  // Wait a moment for auth to settle
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Push data to sheet
  console.log('⬆️ Pushing data to Google Sheet...');
  try {
    await pushCurrentStateToSheet(SPREADSHEET_ID, accessToken, currentData);
    console.log('✅ Successfully synced data to Google Sheet!');
    console.log('🌐 Open your sheet at:', `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
  } catch (error) {
    console.error('❌ Failed to push data to sheet:', error.message);
    process.exit(1);
  }
  
  // Cleanup
  authListener();
  console.log('🎉 Sync complete!');
}

syncToSheet().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
