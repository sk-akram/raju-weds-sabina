/// <reference lib="webworker" />

export interface Env {
  DB: D1Database;
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const url = new URL(context.request.url);
    const category = url.searchParams.get('category');

    let query = 'SELECT * FROM images ORDER BY uploaded_at DESC';
    const params: any[] = [];

    if (category && category !== 'all') {
      query = 'SELECT * FROM images WHERE category = ? ORDER BY uploaded_at DESC';
      params.push(category);
    }

    const result = await context.env.DB.prepare(query).bind(...params).all();
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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
