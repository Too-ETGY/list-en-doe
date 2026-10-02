<script lang="ts">
  import '../app.css';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import { store } from '$lib/stores.svelte';
  import { onMount } from 'svelte';
  
  let { children } = $props<{ children: any }>();

  onMount(() => {
    store.loadLists();
    store.loadTags();
  });
</script>

<div class="layout">
  <Sidebar />
  <main class="content">
    {@render children()}
  </main>
</div>

<style>
  .layout {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
</style>
