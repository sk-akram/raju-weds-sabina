/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// This file is deprecated - Google Sheets sync has been removed
// All data is now stored in D1 database via the API in src/lib/api.ts

export const DEFAULT_SYNC_DATA: Record<string, { val: string; category: string; desc: string }> = {
  groom_name: { val: "Sk Raju", category: "General", desc: "Full name of the Groom" },
  bride_name: { val: "Sabina Khatun", category: "General", desc: "Full name of the Bride" },
  wedding_date: { val: "Friday, August 7, 2026", category: "General", desc: "Wedding Ceremony Date text" },
  venue_name: { val: "Gulmohar Garden, Pairagachha, Dankuni, West Bengal 712304", category: "General", desc: "Name of the Venue" },
  venue_address: { val: "Gulmohar Garden, Pairagachha, Dankuni, West Bengal 712304", category: "General", desc: "Full Address of the Venue" },
  venue_lat: { val: "22.7054674", category: "General", desc: "Venue Latitude for Map (e.g. 22.75)" },
  venue_lng: { val: "88.2616727", category: "General", desc: "Venue Longitude for Map (e.g. 88.34)" },
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
  gallery1_caption: { val: "The Sacred Ring Ceremony - Exchange of Eternal Vows", category: "Gallery", desc: "Image 1 Caption" },
  gallery1_category: { val: "Engagement", category: "Gallery", desc: "Image 1 Category (Blessed Beginnings, Shared Moments, Engagement)" },

  gallery2_url: { val: "/src/assets/images/wedding_hero_backdrop_1782331025471.jpg", category: "Gallery", desc: "Image 2 URL" },
  gallery2_caption: { val: "Golden Geometric Arches & Blush Wedding Roses", category: "Gallery", desc: "Image 2 Caption" },
  gallery2_category: { val: "Blessed Beginnings", category: "Gallery", desc: "Image 2 Category" },

  gallery3_url: { val: "https://picsum.photos/seed/weddingmehndi/800/1200", category: "Gallery", desc: "Image 3 URL" },
  gallery3_caption: { val: "Intricate Bridal Mehndi (Henna) Artistry", category: "Gallery", desc: "Image 3 Caption" },
  gallery3_category: { val: "Blessed Beginnings", category: "Gallery", desc: "Image 3 Category" },

  gallery4_url: { val: "https://picsum.photos/seed/weddingrings/1000/1000", category: "Gallery", desc: "Image 4 URL" },
  gallery4_caption: { val: "The Sacred Bands of Eternal Love and Respect", category: "Gallery", desc: "Image 4 Caption" },
  gallery4_category: { val: "Engagement", category: "Gallery", desc: "Image 4 Category" },

  gallery5_url: { val: "https://picsum.photos/seed/weddingdecor/1000/700", category: "Gallery", desc: "Image 5 URL" },
  gallery5_caption: { val: "Glowing Glass Lanterns and Warm Ambient Fairy Lights", category: "Gallery", desc: "Image 5 Caption" },
  gallery5_category: { val: "Shared Moments", category: "Gallery", desc: "Image 5 Category" },

  gallery6_url: { val: "https://picsum.photos/seed/weddingrose/800/1200", category: "Gallery", desc: "Image 6 URL" },
  gallery6_caption: { val: "Fresh White & Blush Roses representing Rahmah and Sakinah", category: "Gallery", desc: "Image 6 Caption" },
  gallery6_category: { val: "Shared Moments", category: "Gallery", desc: "Image 6 Category" },

  nikah_theme_image: { val: "https://lh3.googleusercontent.com/d/1GCLd0OaY3709XXdb2WPYpwY2GDANMIK6", category: "Theme", desc: "Google Drive URL for Nikah theme image" },
  walima_theme_image: { val: "https://lh3.googleusercontent.com/d/1yWnzNYBWJD4zYaJWxzi6SE2LyDKVUJtS", category: "Theme", desc: "Google Drive URL for Walima theme image" }
};
