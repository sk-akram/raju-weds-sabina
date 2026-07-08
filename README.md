# Wedding Invitation - Sk Raju & Sabina Khatun

A beautiful, interactive wedding invitation website for the marriage of Sk Raju and Sabina Khatun.

## Features

- **Dual Version Support**: 
  - Main route (`/`): Full Nikah + Walima celebration
  - Walima route (`/walima`): Walima-only celebration
- **Interactive Royal Envelope**: Animated envelope opening experience
- **Theme Customization**: 
  - Blushing Nikah theme (burgundy, blue, rose)
  - Walima Chic theme (navy blue, silver)
- **Countdown Timer**: With Google Calendar and iCal integration
- **Venue Map**: Interactive map with multiple venue locations
- **Photo Gallery**: Filterable gallery with lightbox
- **RSVP System**: Guest registration with attendance tracking
- **Guestbook**: Share blessings and prayers
- **Storyline**: Journey of the couple through chapters
- **Scratch Cards**: Interactive blessing reveal

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sk-akram/raju-dada-wedding.git
cd raju-dada-wedding
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
   - Main site: `http://localhost:3000`
   - Walima only: `http://localhost:3000/walima`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── App.tsx        # Main application
│   ├── ThemeSwitcher.tsx
│   ├── CountdownTimer.tsx
│   ├── VenueMap.tsx
│   ├── Gallery.tsx
│   ├── RSVPForm.tsx
│   ├── Guestbook.tsx
│   ├── Storyline.tsx
│   ├── ScratchCard.tsx
│   └── RoyalEnvelope.tsx
├── lib/               # Utilities and context
│   ├── WeddingDataContext.tsx
│   └── sheetsSync.ts
├── types.ts           # TypeScript type definitions
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Customization

### Wedding Data

The wedding data can be customized through the `WeddingDataContext` or by modifying the default values in the components.

### Themes

Themes are defined in `ThemeSwitcher.tsx`. You can modify colors, names, and add new themes by updating the `THEMES` array.

### Images

Replace placeholder images in the `src/assets/images/` directory with your own wedding photos.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Vite and configure the build settings
4. Deploy

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

### Cloudflare Pages

**Prerequisites:**
- Cloudflare account with D1 database and R2 bucket configured
- Database ID: `fc0a1720-029f-4917-bf65-4d80a76774c9`
- R2 bucket name: `wedding-images` (optional, images stored in database)

**Step 1: Initialize Database**

Run the database schema:
```bash
wrangler d1 execute raju-weds-sabina --file=schema.sql --remote
```

**Step 2: Deploy with Wrangler**

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy the worker
wrangler deploy
```

**Step 3: Configure Cloudflare Pages**

1. Go to Cloudflare Dashboard → Pages → Create a project
2. Connect to your GitHub repository
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. In Settings → Functions → D1 database bindings:
   - Variable name: `DB`
   - D1 database: `raju-weds-sabina`
5. Deploy

**Step 4: Upload Images**

After deployment, upload images using the API:
```bash
# Install form-data for multipart uploads
npm install form-data

# Upload images to your deployed worker
node scripts/upload-after-deploy.cjs https://your-worker.pages.dev
```

**Note**: The `_redirects` file in the `public` folder ensures proper client-side routing for the SPA.

## License

Created by [Akram](https://www.linkedin.com/in/skakram1/)

---

**Made with ❤️ for Sk Raju & Sabina Khatun**
