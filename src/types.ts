/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum AttendanceStatus {
  NIKAH = 'nikah',
  WALIMA = 'walima',
  BOTH = 'both',
  DECLINE = 'decline',
}

export enum GuestRelationship {
  FRIEND = 'friend',
  FAMILY = 'family',
  GROOM_SIDE = 'groom_side',
  BRIDE_SIDE = 'bride_side',
  WELL_WISHER = 'well_wisher',
}

export interface RSVP {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  attendance: AttendanceStatus;
  guestsCount: number;
  dietaryPref: string;
  prayer?: string;
  createdAt: string;
}

export interface GuestbookMessage {
  id: string;
  name: string;
  relationship: GuestRelationship;
  message: string;
  createdAt: string;
  likes: number;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: string;
  category: 'all' | 'pre-wedding' | 'ceremony' | 'reception';
}
