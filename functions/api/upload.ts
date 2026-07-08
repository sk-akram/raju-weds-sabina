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
    const formData = await context.request.formData();
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
    const result = await context.env.DB.prepare(
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

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
