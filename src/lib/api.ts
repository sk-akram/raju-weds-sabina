/**
 * API client for D1 database operations
 */

const API_BASE_URL = window.location.origin;

export interface GuestbookEntry {
  id: string;
  name: string;
  relationship: string;
  message: string;
  likes: number;
  created_at: string;
}

export interface RSVPEntry {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  attendance: string;
  guests_count: number;
  dietary_pref: string;
  prayer: string | null;
  created_at: string;
}

// Guestbook API
export async function fetchGuestbook(): Promise<GuestbookEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/guestbook`);
    if (!response.ok) throw new Error('Failed to fetch guestbook');
    return await response.json();
  } catch (error) {
    console.error('Error fetching guestbook:', error);
    return [];
  }
}

export async function createGuestbookEntry(data: {
  name: string;
  relationship: string;
  message: string;
}): Promise<{ success: boolean; id?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/guestbook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create guestbook entry');
    return await response.json();
  } catch (error) {
    console.error('Error creating guestbook entry:', error);
    return { success: false };
  }
}

export async function likeGuestbookEntry(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/guestbook/like/${id}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to like guestbook entry');
    return await response.json();
  } catch (error) {
    console.error('Error liking guestbook entry:', error);
    return { success: false };
  }
}

// RSVP API
export async function fetchRSVPs(): Promise<RSVPEntry[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rsvp`);
    if (!response.ok) throw new Error('Failed to fetch RSVPs');
    return await response.json();
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return [];
  }
}

export async function saveRSVP(data: RSVPEntry): Promise<{ success: boolean; id?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to save RSVP');
    return await response.json();
  } catch (error) {
    console.error('Error saving RSVP:', error);
    return { success: false };
  }
}

export async function deleteRSVP(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/rsvp/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete RSVP');
    return await response.json();
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return { success: false };
  }
}
