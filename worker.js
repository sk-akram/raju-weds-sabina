/**
 * Cloudflare Worker for D1 Database API
 * Handles guestbook and RSVP operations
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Guestbook endpoints
    if (url.pathname === '/api/guestbook') {
      if (request.method === 'GET') {
        try {
          const { results } = await env.DB.prepare('SELECT * FROM guestbook ORDER BY created_at DESC').all();
          return new Response(JSON.stringify(results), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (request.method === 'POST') {
        try {
          const data = await request.json();
          const id = crypto.randomUUID();
          const created_at = new Date().toISOString();

          await env.DB.prepare(
            'INSERT INTO guestbook (id, name, relationship, message, likes, created_at) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(id, data.name, data.relationship, data.message, 0, created_at).run();

          return new Response(JSON.stringify({ success: true, id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // Guestbook like endpoint
    if (url.pathname.startsWith('/api/guestbook/like/') && request.method === 'POST') {
      try {
        const id = url.pathname.split('/').pop();
        await env.DB.prepare('UPDATE guestbook SET likes = likes + 1 WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // RSVP endpoints
    if (url.pathname === '/api/rsvp') {
      if (request.method === 'POST') {
        try {
          const data = await request.json();
          const id = data.id || crypto.randomUUID();
          const created_at = data.created_at || new Date().toISOString();

          // Check if RSVP exists
          const existing = await env.DB.prepare('SELECT * FROM rsvp WHERE id = ?').bind(id).first();

          if (existing) {
            // Update existing RSVP
            await env.DB.prepare(
              'UPDATE rsvp SET full_name = ?, email = ?, phone = ?, attendance = ?, guests_count = ?, dietary_pref = ?, prayer = ? WHERE id = ?'
            ).bind(data.full_name, data.email, data.phone, data.attendance, data.guests_count, data.dietary_pref, data.prayer, id).run();
          } else {
            // Insert new RSVP
            await env.DB.prepare(
              'INSERT INTO rsvp (id, full_name, email, phone, attendance, guests_count, dietary_pref, prayer, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
            ).bind(id, data.full_name, data.email, data.phone, data.attendance, data.guests_count, data.dietary_pref, data.prayer, created_at).run();
          }

          return new Response(JSON.stringify({ success: true, id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }
    }

    // RSVP delete endpoint
    if (url.pathname.startsWith('/api/rsvp/') && request.method === 'DELETE') {
      try {
        const id = url.pathname.split('/').pop();
        await env.DB.prepare('DELETE FROM rsvp WHERE id = ?').bind(id).run();
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
