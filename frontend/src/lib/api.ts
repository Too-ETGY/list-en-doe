import type { List, Item, Tag } from './types';

const API_BASE = '/api';

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(error || 'API Error');
  }
  return res.json();
}

export const api = {
  lists: {
    getAll: () => fetcher<List[]>('/lists'),
    getById: (id: string) => fetcher<List>(`/lists/${id}`),
    create: (data: Partial<List>) => fetcher<List>('/lists', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<List>) => fetcher<List>(`/lists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetcher<{ success: boolean }>(`/lists/${id}`, { method: 'DELETE' }),
    reorder: (updates: { id: string, sort_order: number }[]) => fetcher<{ success: boolean }>('/lists/reorder', { method: 'PUT', body: JSON.stringify({ updates }) })
  },
  items: {
    getByList: (listId: string, params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return fetcher<Item[]>(`/lists/${listId}/items${qs}`);
    },
    create: (listId: string, data: Partial<Item>) => fetcher<Item>(`/lists/${listId}/items`, { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Item>) => fetcher<Item>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetcher<{ success: boolean }>(`/items/${id}`, { method: 'DELETE' }),
    updateStatus: (id: string, status: string | null) => fetcher<Item>(`/items/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    updateProgress: (id: string, progress_current: number, progress_total?: number) => fetcher<Item>(`/items/${id}/progress`, { method: 'PATCH', body: JSON.stringify({ progress_current, progress_total }) })
  },
  tags: {
    getAll: () => fetcher<Tag[]>('/tags'),
    create: (data: Partial<Tag>) => fetcher<Tag>('/tags', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetcher<{ success: boolean }>(`/tags/${id}`, { method: 'DELETE' }),
    attachToItem: (itemId: string, tagId: string) => fetcher<{ success: boolean }>(`/items/${itemId}/tags`, { method: 'POST', body: JSON.stringify({ tag_id: tagId }) }),
    detachFromItem: (itemId: string, tagId: string) => fetcher<{ success: boolean }>(`/items/${itemId}/tags/${tagId}`, { method: 'DELETE' })
  }
};
