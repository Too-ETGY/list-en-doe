<script lang="ts">
  import { store } from '$lib/stores.svelte';
  import { goto } from '$app/navigation';
  import EmptyState from '$lib/components/EmptyState.svelte';
  import CreateListModal from '$lib/components/CreateListModal.svelte';
  import { onMount } from 'svelte';

  let showCreateModal = $state(false);
  let initialized = $state(false);

  // Use effect to handle navigation after lists are loaded
  $effect(() => {
    if (!store.loading && store.lists.length > 0 && initialized) {
      goto(`/lists/${store.lists[0].id}`);
    }
  });

  onMount(() => {
    // We set initialized so we only redirect after first load
    initialized = true;
  });
</script>

<svelte:head>
  <title>List-en-do</title>
</svelte:head>

<div class="page-container">
  {#if store.loading && !initialized}
    <div class="loading">Loading...</div>
  {:else if store.lists.length === 0}
    <EmptyState 
      message="Welcome to List-en-do! Let's get started by creating your first list." 
      actionLabel="Create your first list" 
      onAction={() => showCreateModal = true} 
    />
  {/if}
</div>

{#if showCreateModal}
  <CreateListModal 
    onClose={() => showCreateModal = false} 
    onSave={async () => {
      await store.loadLists();
      showCreateModal = false;
    }} 
  />
{/if}

<style>
  .page-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .loading {
    color: var(--text-secondary);
  }
</style>
