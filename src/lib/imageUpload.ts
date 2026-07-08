export async function uploadImage(file: File, category?: string, caption?: string): Promise<number> {
  const formData = new FormData();
  formData.append('file', file);
  if (category) formData.append('category', category);
  if (caption) formData.append('caption', caption);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json() as { success: boolean; id?: number; error?: string };

  if (result.success) {
    return result.id!;
  } else {
    throw new Error(result.error || 'Failed to upload image');
  }
}

export function getImageUrl(id: number): string {
  return `/api/images/${id}`;
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
