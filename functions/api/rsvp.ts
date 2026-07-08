/// <reference lib="webworker" />

export interface Env {
  DB: D1Database;
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data = await context.request.json() as any;
    
    const result = await context.env.DB.prepare(
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

export async function onRequestGet(context: { env: Env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const result = await context.env.DB.prepare('SELECT * FROM rsvps ORDER BY created_at DESC').all();
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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
