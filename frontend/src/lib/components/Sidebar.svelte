<script lang="ts">
  import { store } from '../stores.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import CreateListModal from './CreateListModal.svelte';
  import EditListModal from './EditListModal.svelte';
  import type { List } from '$lib/types';
  import { onMount } from 'svelte';

  let showCreateModal = $state(false);
  let editingList = $state<List | null>(null);

  // Check current path
  let currentId = $derived($page.params.id);

  function handleListClick(id: string) {
    goto(`/lists/${id}`);
  }

  onMount(() => {
    store.loadLists();
  });
</script>

<aside class="sidebar">
  <div class="brand">
    <h1>List-en-do</h1>
  </div>

  <nav class="lists">
    {#each store.lists as list}
      <div class="list-item-wrapper {currentId === list.id ? 'active' : ''}">
        <button 
          class="list-item" 
          onclick={() => handleListClick(list.id)}
        >
          <span class="icon">{list.icon}</span>
          <span class="name">{list.name}</span>
        </button>
        <button 
          class="gear-btn" 
          onclick={(e) => { e.stopPropagation(); editingList = list; }}
          title="Edit List Settings"
        >
          ⚙️
        </button>
      </div>
    {/each}
  </nav>

  <div class="actions">
    <button class="btn-ghost add-list" onclick={() => showCreateModal = true}>
      <span class="plus">+</span> New List
    </button>
  </div>
</aside>

{#if showCreateModal}
  <CreateListModal 
    onClose={() => showCreateModal = false} 
    onSave={async (data) => {
      await store.loadLists();
      showCreateModal = false;
    }} 
  />
{/if}

{#if editingList}
  <EditListModal 
    list={editingList}
    onClose={() => editingList = null}
    onSave={async () => {
      editingList = null;
      await store.loadLists();
    }}
  />
{/if}

<style>
  .sidebar {
    width: 260px;
    height: 100vh;
    background-color: var(--bg-secondary);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
  }

  .brand {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-light);
  }

  .brand h1 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .lists {
    flex: 1;
    overflow-y: auto;
    padding: 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .list-item-wrapper {
    display: flex;
    align-items: center;
    border-radius: 6px;
    position: relative;
  }

  .list-item-wrapper:hover {
    background-color: var(--bg-tertiary);
  }

  .list-item-wrapper.active {
    background-color: var(--accent-subtle);
  }

  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    color: var(--text-secondary);
    font-size: 14px;
    flex: 1;
    text-align: left;
    background: transparent;
    border: none;
  }

  .list-item-wrapper:hover .list-item {
    color: var(--text-primary);
  }

  .list-item-wrapper.active .list-item {
    color: var(--accent);
    font-weight: 500;
  }

  .gear-btn {
    opacity: 0;
    padding: 4px 8px;
    font-size: 12px;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .list-item-wrapper:hover .gear-btn {
    opacity: 0.7;
  }

  .gear-btn:hover {
    opacity: 1 !important;
  }

  .icon {
    font-size: 16px;
  }

  .actions {
    padding: 16px;
    border-top: 1px solid var(--border-light);
  }

  .add-list {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-secondary);
  }

  .add-list:hover {
    color: var(--text-primary);
  }

  .plus {
    font-size: 18px;
    font-weight: 400;
  }
</style>
