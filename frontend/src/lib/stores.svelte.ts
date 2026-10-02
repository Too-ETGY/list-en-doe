import { api } from './api';
import type { List, Item, Tag } from './types';

class ListStore {
  lists = $state<List[]>([]);
  currentList = $state<List | null>(null);
  items = $state<Item[]>([]);
  tags = $state<Tag[]>([]);
  loading = $state(false);
  
  async loadLists() {
    this.loading = true;
    try {
      this.lists = await api.lists.getAll();
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  async loadList(id: string) {
    this.loading = true;
    try {
      this.currentList = await api.lists.getById(id);
    } catch (e) {
      console.error(e);
      this.currentList = null;
    } finally {
      this.loading = false;
    }
  }

  async loadItems(listId: string, params?: Record<string, string>) {
    this.loading = true;
    try {
      this.items = await api.items.getByList(listId, params);
    } catch (e) {
      console.error(e);
    } finally {
      this.loading = false;
    }
  }

  async loadTags() {
    try {
      this.tags = await api.tags.getAll();
    } catch (e) {
      console.error(e);
    }
  }

  async createItem(listId: string, item: Partial<Item>) {
    await api.items.create(listId, item);
  }

  async updateItem(id: string, item: Partial<Item>) {
    await api.items.update(id, item);
  }

  async updateItemStatus(id: string, status: string) {
    await api.items.updateStatus(id, status);
  }

  async deleteItem(id: string) {
    await api.items.delete(id);
  }

  async updateList(id: string, data: Partial<List>) {
    await api.lists.update(id, data);
    await this.loadLists();
    if (this.currentList?.id === id) {
      await this.loadList(id);
    }
  }

  async deleteList(id: string) {
    await api.lists.delete(id);
    await this.loadLists();
  }
}

export const store = new ListStore();
