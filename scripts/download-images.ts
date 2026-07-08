/// <reference lib="webworker" />

export interface Env {
  DB: D1Database;
}

const imagesToDownload = [
  {
    url: "https://lh3.googleusercontent.com/d/1RwPX-6FbXAGL3evEmdj8Nffl-muyBq6l",
    filename: "gallery1_couple_banquet.jpg",
    category: "pre-wedding",
    caption: "The Blessed Couple entering the Grand Banquet Hall"
  },
  {
    url: "/src/assets/images/nikah_stage_1782331038747.jpg",
    filename: "gallery2_nikah_stage.jpg",
    category: "ceremony",
    caption: "Nikah Stage - Traditional Low Seating & Soft Drapes"
  },
  {
    url: "/src/assets/images/walima_banquet_1782331057014.jpg",
    filename: "gallery3_walima_banquet.jpg",
    category: "reception",
    caption: "Walima Reception Banquet - Emerald and Gold Tableware"
  }
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const results = [];

    for (const image of imagesToDownload) {
      try {
        // Download image from URL
        const response = await fetch(image.url);
        if (!response.ok) {
          throw new Error(`Failed to download: ${response.statusText}`);
        }

        const imageData = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';
        
        // Store in database
        const result = await env.DB.prepare(
          'INSERT INTO images (filename, content_type, size, category, caption, image_data) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
          image.filename,
          contentType,
          imageData.byteLength,
          image.category,
          image.caption,
          imageData
        ).run();

        results.push({
          filename: image.filename,
          status: 'success',
          id: result.meta.last_row_id,
          size: imageData.byteLength
        });
      } catch (error) {
        results.push({
          filename: image.filename,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return new Response(JSON.stringify(results, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
