/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Auth Provider with Sheets scope
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // If logged in but token is not in memory, user must click sign-in to refresh access token
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Default template structure for the Google Sheet
export const DEFAULT_SYNC_DATA: Record<string, { val: string; category: string; desc: string }> = {
  groom_name: { val: "Sk Raju", category: "General", desc: "Full name of the Groom" },
  bride_name: { val: "Sabina Khatun", category: "General", desc: "Full name of the Bride" },
  wedding_date: { val: "Friday, August 7, 2026", category: "General", desc: "Wedding Ceremony Date text" },
  venue_name: { val: "Serampore Alcove, New Kolkata", category: "General", desc: "Name of the Venue" },
  venue_address: { val: "Serampore Alcove, New Kolkata, West Bengal, India", category: "General", desc: "Full Address of the Venue" },
  venue_lat: { val: "22.75", category: "General", desc: "Venue Latitude for Map (e.g. 22.75)" },
  venue_lng: { val: "88.34", category: "General", desc: "Venue Longitude for Map (e.g. 88.34)" },
  bismillah_text: { val: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ", category: "General", desc: "Bismillah Arabic greeting text" },
  bismillah_translation: { val: "In the name of Allah, the Most Gracious, the Most Merciful", category: "General", desc: "Bismillah English Translation" },
  scratch_reward_title: { val: "You are cordially invited to celebrate with us!", category: "General", desc: "Revealed message when card is scratched" },
  
  chapter1_title: { val: "Blessed Beginnings", category: "Storyline", desc: "Story Chapter 1 Title" },
  chapter1_period: { val: "First Connection", category: "Storyline", desc: "Story Chapter 1 Period/Meta info" },
  chapter1_date: { val: "March 02, 2026", category: "Storyline", desc: "Story Chapter 1 Date" },
  chapter1_badge: { val: "The Blessed Start", category: "Storyline", desc: "Story Chapter 1 Badge text" },
  chapter1_poetry: { val: "Two hearts, distant yet destined, whispering their first prayer into the spring breeze.", category: "Storyline", desc: "Story Chapter 1 Poetry quote" },
  chapter1_story: { val: "Our journeys quietly began to intertwine. What started as warm introductions and matching hopes grew rapidly into a deep sense of compatibility, guided by mutual respect and matching values. We realized that this beautiful connection was an answered prayer, starting our beautiful journey toward a shared life under the shade of Rahmah.", category: "Storyline", desc: "Story Chapter 1 Full Text description" },
  chapter1_image: { val: "https://lh3.googleusercontent.com/d/1pI_GTs-izEWW3rbApaRn1yht6RfkZ9Yb", category: "Storyline", desc: "Story Chapter 1 Image link" },

  chapter2_title: { val: "Shared Moments", category: "Storyline", desc: "Story Chapter 2 Title" },
  chapter2_period: { val: "Rajkot, Sights & Celebrations", category: "Storyline", desc: "Story Chapter 2 Period/Meta info" },
  chapter2_date: { val: "April & May 2026", category: "Storyline", desc: "Story Chapter 2 Date" },
  chapter2_badge: { val: "Shared Milestones", category: "Storyline", desc: "Story Chapter 2 Badge text" },
  chapter2_poetry: { val: "Like calm waters reflecting the sky, our dreams mirrored each other in perfect harmony and sweet joy.", category: "Storyline", desc: "Story Chapter 2 Poetry quote" },
  chapter2_story: { val: "From walking along the tranquil shores of Atal Sarovar to lovely coffee dates, movies, birthday surprises, and fine dining at The Heritage Palace, we discovered effortless laughter and endless comfort in each other. Every smile and quiet moment shared together strengthened the bridge of mutual trust and companionship.", category: "Storyline", desc: "Story Chapter 2 Full Text description" },
  chapter2_image: { val: "https://lh3.googleusercontent.com/d/1A3uzgkU3E-l2WvI7FVIwQ0S2yQyTePc1", category: "Storyline", desc: "Story Chapter 2 Image link" },

  chapter3_title: { val: "Engagement", category: "Storyline", desc: "Story Chapter 3 Title" },
  chapter3_period: { val: "Home, Baat Pakki", category: "Storyline", desc: "Story Chapter 3 Period/Meta info" },
  chapter3_date: { val: "June 19, 2026", category: "Storyline", desc: "Story Chapter 3 Date" },
  chapter3_badge: { val: "Shared Moments", category: "Storyline", desc: "Story Chapter 3 Badge text" },
  chapter3_poetry: { val: "Bound by a sacred covenant of love, respect, and mutual devotion under His divine blessings.", category: "Storyline", desc: "Story Chapter 3 Poetry quote" },
  chapter3_story: { val: "Surrounded by the warmth of our closest family, we celebrated our official Engagement (Baat Pakki). Exchanging rings and heartfelt prayers, we took a monumental step toward weaving our futures together. Our hearts are filled with gratitude and beautiful hope for the life we are going to build as companions for Jannah, Insha'Allah.", category: "Storyline", desc: "Story Chapter 3 Full Text description" },
  chapter3_image: { val: "https://lh3.googleusercontent.com/d/1RwPX-6FbXAGL3evEmdj8Nffl-muyBq6l", category: "Storyline", desc: "Story Chapter 3 Image link" },

  gallery1_url: { val: "https://lh3.googleusercontent.com/d/1RwPX-6FbXAGL3evEmdj8Nffl-muyBq6l", category: "Gallery", desc: "Image 1 URL" },
  gallery1_caption: { val: "The Blessed Couple entering the Grand Banquet Hall", category: "Gallery", desc: "Image 1 Caption" },
  gallery1_category: { val: "Engagement", category: "Gallery", desc: "Image 1 Category (Blessed Beginnings, Shared Moments, Engagement)" },

  gallery2_url: { val: "/images/nikah_stage.jpg", category: "Gallery", desc: "Image 2 URL" },
  gallery2_caption: { val: "Nikah Stage - Traditional Low Seating & Soft Drapes", category: "Gallery", desc: "Image 2 Caption" },
  gallery2_category: { val: "Blessed Beginnings", category: "Gallery", desc: "Image 2 Category" },

  gallery3_url: { val: "/images/walima_banquet.jpg", category: "Gallery", desc: "Image 3 URL" },
  gallery3_caption: { val: "Walima Reception Banquet - Emerald and Gold Tableware", category: "Gallery", desc: "Image 3 Caption" },
  gallery3_category: { val: "Shared Moments", category: "Gallery", desc: "Image 3 Category" },

  gallery4_url: { val: "/src/assets/images/wedding_hero_backdrop_1782331025471.jpg", category: "Gallery", desc: "Image 4 URL" },
  gallery4_caption: { val: "Golden Geometric Arches & Blush Wedding Roses", category: "Gallery", desc: "Image 4 Caption" },
  gallery4_category: { val: "Blessed Beginnings", category: "Gallery", desc: "Image 4 Category" },

  gallery5_url: { val: "https://picsum.photos/seed/weddingmehndi/800/1200", category: "Gallery", desc: "Image 5 URL" },
  gallery5_caption: { val: "Intricate Bridal Mehndi (Henna) Artistry", category: "Gallery", desc: "Image 5 Caption" },
  gallery5_category: { val: "Blessed Beginnings", category: "Gallery", desc: "Image 5 Category" },

  gallery6_url: { val: "https://picsum.photos/seed/weddingrings/1000/1000", category: "Gallery", desc: "Image 6 URL" },
  gallery6_caption: { val: "The Sacred Bands of Eternal Love and Respect", category: "Gallery", desc: "Image 6 Caption" },
  gallery6_category: { val: "Engagement", category: "Gallery", desc: "Image 6 Category" },

  gallery7_url: { val: "https://picsum.photos/seed/weddingdecor/1000/700", category: "Gallery", desc: "Image 7 URL" },
  gallery7_caption: { val: "Glowing Glass Lanterns and Warm Ambient Fairy Lights", category: "Gallery", desc: "Image 7 Caption" },
  gallery7_category: { val: "Shared Moments", category: "Gallery", desc: "Image 7 Category" },

  gallery8_url: { val: "https://picsum.photos/seed/weddingrose/800/1200", category: "Gallery", desc: "Image 8 URL" },
  gallery8_caption: { val: "Fresh White & Blush Roses representing Rahmah and Sakinah", category: "Gallery", desc: "Image 8 Caption" },
  gallery8_category: { val: "Shared Moments", category: "Gallery", desc: "Image 8 Category" },

  guestbook_entries: { val: "[]", category: "Guestbook", desc: "JSON array of guestbook entries" },

  rsvp_entries: { val: "[]", category: "RSVP", desc: "JSON array of RSVP entries" },

  nikah_theme_image: { val: "", category: "Theme", desc: "Google Drive URL for Nikah theme image" },
  walima_theme_image: { val: "", category: "Theme", desc: "Google Drive URL for Walima theme image" }
};

// Parse local memory values back from spreadsheet data
export function transformToSyncMap(rows: string[][]): Record<string, string> {
  const result: Record<string, string> = {};
  if (!rows || rows.length <= 1) return result;
  
  // Columns: 0 = Key, 1 = Value
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row && row[0]) {
      const key = row[0].trim();
      const val = row[1] !== undefined ? row[1].trim() : '';
      if (key) {
        result[key] = val;
      }
    }
  }
  return result;
}

// Parses raw downloaded CSV string robustly
export function parseCSV(csvText: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = csvText.split(/\r?\n/);
  
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex].trim();
    if (!line || lineIndex === 0) continue; // Skip empty and header row

    const cols: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    cols.push(current.trim());

    if (cols.length >= 2) {
      const key = cols[0].replace(/^"|"$/g, '').trim();
      const val = cols[1].replace(/^"|"$/g, '').trim();
      if (key) {
        result[key] = val;
      }
    }
  }
  return result;
}

/**
 * Fetch the Sheet CSV publicly (Anyone with the link can view)
 */
export async function fetchPublicSheetData(spreadsheetId: string): Promise<Record<string, string> | null> {
  try {
    // Add caching buster to avoid stale results
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&tq=select+A,B&_cb=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Sheet is private or invalid ID');
    const text = await res.text();
    const data = parseCSV(text);
    // Ensure we actually got some valid keys, otherwise it is empty/invalid
    if (Object.keys(data).length > 0) {
      return data;
    }
    return null;
  } catch (err) {
    console.warn('Public CSV sheet fetch skipped or failed: ', err);
    return null;
  }
}

/**
 * Fetch direct via Google Sheets API (Authenticated)
 */
export async function fetchAuthSheetData(spreadsheetId: string, accessToken: string): Promise<Record<string, string>> {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:D100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to retrieve spreadsheet. Ensure the sheet tab is named "Sheet1".');
  }
  const data = await response.json() as { values?: string[][] };
  return transformToSyncMap(data.values || []);
}

/**
 * Check if the Google Sheet is empty or uninitialized
 */
export async function checkIfSheetEmptyOrNew(spreadsheetId: string, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:D10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (!response.ok) return true; // Treat error as needing initialization
    const data = await response.json() as { values?: string[][] };
    return !data.values || data.values.length <= 1;
  } catch (e) {
    return true;
  }
}

/**
 * Initialize/write the template data directly to Sheet1 of the user's spreadsheet!
 */
export async function initializeSpreadsheet(spreadsheetId: string, accessToken: string): Promise<void> {
  const values: string[][] = [
    ['Key', 'Value', 'Category', 'Description']
  ];
  
  Object.entries(DEFAULT_SYNC_DATA).forEach(([key, item]) => {
    values.push([key, item.val, item.category, item.desc]);
  });

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:D100?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: 'Sheet1!A1:D100',
        majorDimension: 'ROWS',
        values: values,
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error('Initialization error details:', errText);
    throw new Error('Could not write data to the Google Sheet. Please check your sheet permissions.');
  }
}

/**
 * Pushes specific local edits back to Google Sheet
 */
export async function pushCurrentStateToSheet(
  spreadsheetId: string, 
  accessToken: string, 
  currentData: Record<string, string>
): Promise<void> {
  const values: string[][] = [
    ['Key', 'Value', 'Category', 'Description']
  ];
  
  Object.entries(DEFAULT_SYNC_DATA).forEach(([key, item]) => {
    const userVal = currentData[key] !== undefined ? currentData[key] : item.val;
    values.push([key, userVal, item.category, item.desc]);
  });

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:D100?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        range: 'Sheet1!A1:D100',
        majorDimension: 'ROWS',
        values: values,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update spreadsheet.');
  }
}
