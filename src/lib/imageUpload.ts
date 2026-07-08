export async function uploadImage(file: File, category?: string, caption?: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  if (category) formData.append('category', category);
  if (caption) formData.append('caption', caption);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (result.success) {
    return result.url;
  } else {
    throw new Error(result.error || 'Failed to upload image');
  }
}

export function getImageUrl(key: string): string {
  return `/api/images/${key}`;
}

export async function getImages(category?: string): Promise<any[]> {
  const url = new URL('/api/images', window.location.origin);
  if (category && category !== 'all') {
    url.searchParams.append('category', category);
  }

  const response = await fetch(url.toString());
  const result = await response.json();
  return result as any[];
}
