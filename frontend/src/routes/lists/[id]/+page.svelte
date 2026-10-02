<script lang="ts">
  import { page } from '$app/stores';
  import { store } from '$lib/stores.svelte';
  import FilterBar from '$lib/components/FilterBar.svelte';
  import ListTable from '$lib/components/ListTable.svelte';
  import ItemModal from '$lib/components/ItemModal.svelte';
  import EditListModal from '$lib/components/EditListModal.svelte';
  import type { Item } from '$lib/types';
  import { onMount } from 'svelte';

  let listId = $derived($page.params.id);
  
  let showModal = $state(false);
  let showEditListModal = $state(false);
  let editingItem = $state<Item | null>(null);

  // Watch route change to reload data
  $effect(() => {
    if (listId) {
      loadData(listId);
    }
  });

  let currentSort = $state('title');
  let currentOrder = $state<'asc' | 'desc'>('asc');

  async function loadData(id: string, params?: any) {
    await store.loadList(id);
    await store.loadItems(id, params);
  }

  function handleFilterChange(filters: any) {
    if (!listId) return;
    const params: any = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.priority) params.priority = filters.priority;
    loadData(listId, params);
  }

  function handleSort(column: string) {
    if (currentSort === column) {
      currentOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    } else {
      currentSort = column;
      currentOrder = 'asc';
    }
    if (listId) {
      loadData(listId, { sort: currentSort, order: currentOrder });
    }
  }

  function openCreateModal() {
    editingItem = null;
    showModal = true;
  }

  function handleItemClick(item: Item) {
    editingItem = item;
    showModal = true;
  }

  async function handleSaveItem(itemData: Partial<Item>) {
    if (itemData.id) {
      await store.updateItem(itemData.id, itemData);
    } else if (store.currentList) {
      await store.createItem(store.currentList.id, itemData);
    }
    if (listId) await loadData(listId);
  }

  async function handleStatusChange(item: Item, newStatus: string) {
    await store.updateItemStatus(item.id, newStatus);
    if (listId) await loadData(listId);
  }

  async function handleDeleteItem(itemId: string) {
    await store.deleteItem(itemId);
    if (listId) await loadData(listId);
  }
</script>

<svelte:head>
  <title>{store.currentList?.name || 'Loading...'} - List-en-do</title>
</svelte:head>

<div class="page">
  {#if store.loading && !store.currentList}
    <div class="loading">Loading...</div>
  {:else if store.currentList}
    <header class="list-header">
      <div class="title-section">
        <span class="icon">{store.currentList.icon}</span>
        <h1>{store.currentList.name}</h1>
        <button class="settings-btn" onclick={() => showEditListModal = true} type="button">
          ⚙️ Settings
        </button>
      </div>
    </header>

    <FilterBar 
      statusOptions={store.currentList.status_options} 
      onFilterChange={handleFilterChange} 
    />

    <div class="content">
      <ListTable 
        items={store.items} 
        fieldDefinitions={store.currentList.field_definitions} 
        statusOptions={store.currentList.status_options}
        onRowClick={handleItemClick}
      />
    </div>

    <button class="fab" onclick={openCreateModal} aria-label="Add Item">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  {/if}
</div>

{#if showModal && store.currentList}
  <ItemModal 
    item={editingItem}
    list={store.currentList}
    onClose={() => showModal = false}
    onSave={async () => {
      showModal = false;
      if (listId) await loadData(listId);
    }}
  />
{/if}

{#if showEditListModal && store.currentList}
  <EditListModal 
    list={store.currentList}
    onClose={() => showEditListModal = false}
    onSave={async () => {
      showEditListModal = false;
      if (listId) await loadData(listId);
    }}
  />
{/if}

<style>
  .page {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  .list-header {
    padding: 32px 24px 16px 24px;
    border-bottom: 1px solid var(--border-light);
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .settings-btn {
    padding: 6px;
    border-radius: 6px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .settings-btn:hover {
    color: var(--text-primary);
    background: var(--bg-tertiary);
  }

  .icon {
    font-size: 32px;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .content {
    flex: 1;
    overflow-y: auto;
  }

  .loading {
    padding: 32px;
    color: var(--text-secondary);
  }

  .fab {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background-color: var(--accent);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  .fab:hover {
    background-color: var(--accent-hover);
    transform: scale(1.05);
  }
</style>
