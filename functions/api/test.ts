export async function onRequestGet() {
  return new Response(JSON.stringify({ message: 'Functions are working!' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
