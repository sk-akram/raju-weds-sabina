/// <reference lib="webworker" />

export interface Env {
  DB: D1Database;
}

export async function onRequestGet(context: { env: Env; params: { id: string } }) {
  try {
    const imageId = context.params.id;
    
    const result = await context.env.DB.prepare(
      'SELECT * FROM images WHERE id = ?'
    ).bind(imageId).first();

    if (!result) {
      return new Response('Image not found', { status: 404 });
    }

    // Update last_accessed timestamp
    await context.env.DB.prepare(
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
