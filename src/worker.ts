/// <reference lib="webworker" />

export interface Env {
  DB: D1Database;
  BUCKET: R2Bucket;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // RSVP endpoints
    if (path === '/api/rsvp' && request.method === 'POST') {
      try {
        const data = await request.json() as any;
        
        const result = await env.DB.prepare(
          'INSERT INTO rsvps (full_name, email, phone, attendance, guests_count, dietary_pref, prayer) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(
          data.full_name,
          data.email,
          data.phone,
          data.attendance,
          data.guests_count,
          data.dietary_pref,
          data.prayer
        ).run();

        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Failed to save RSVP' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Get RSVPs endpoint
    if (path === '/api/rsvps' && request.method === 'GET') {
      try {
        const result = await env.DB.prepare('SELECT * FROM rsvps ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(result.results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Failed to fetch RSVPs' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Guestbook endpoints
    if (path === '/api/guestbook' && request.method === 'POST') {
      try {
        const data = await request.json() as any;
        
        const result = await env.DB.prepare(
          'INSERT INTO guestbook (name, message) VALUES (?, ?)'
        ).bind(
          data.name,
          data.message
        ).run();

        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Failed to save guestbook entry' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Get guestbook entries endpoint
    if (path === '/api/guestbook' && request.method === 'GET') {
      try {
        const result = await env.DB.prepare('SELECT * FROM guestbook ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(result.results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Failed to fetch guestbook entries' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Get images by category endpoint
    if (path === '/api/images' && request.method === 'GET') {
      try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');

        let query = 'SELECT * FROM images ORDER BY uploaded_at DESC';
        const params: any[] = [];

        if (category && category !== 'all') {
          query = 'SELECT * FROM images WHERE category = ? ORDER BY uploaded_at DESC';
          params.push(category);
        }

        const result = await env.DB.prepare(query).bind(...params).all();
        return new Response(JSON.stringify(result.results), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Failed to fetch images' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Serve images from database
    if (path.startsWith('/api/images/') && request.method === 'GET') {
      try {
        const imageId = path.replace('/api/images/', '');
        
        const result = await env.DB.prepare(
          'SELECT * FROM images WHERE id = ?'
        ).bind(imageId).first();

        if (!result) {
          return new Response('Image not found', { status: 404 });
        }

        // Update last_accessed timestamp
        await env.DB.prepare(
          'UPDATE images SET last_accessed = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(imageId).run();

        const headers = new Headers();
        headers.set('Content-Type', result.content_type as string);
        headers.set('Content-Length', result.size as string);
        headers.set('Cache-Control', 'public, max-age=31536000');

        return new Response(result.image_data as ArrayBuffer, { headers });
      } catch (error) {
        return new Response('Failed to fetch image', { status: 500 });
      }
    }

    // Image upload endpoint
    if (path === '/api/upload' && request.method === 'POST') {
      try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const category = formData.get('category') as string || 'other';
        const caption = formData.get('caption') as string || '';

        if (!file) {
          return new Response(JSON.stringify({ success: false, error: 'No file provided' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Store binary data in database
        const result = await env.DB.prepare(
          'INSERT INTO images (filename, content_type, size, category, caption, image_data) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
          file.name,
          file.type,
          file.size,
          category,
          caption,
          arrayBuffer
        ).run();

        return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ success: false, error: 'Failed to upload image' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Serve static files
    return new Response('Not found', { status: 404 });
  }
};
