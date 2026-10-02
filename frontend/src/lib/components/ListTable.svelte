<script lang="ts">
  import type { Item, FieldDefinition } from '$lib/types';
  import ItemRow from './ItemRow.svelte';
  
  let { 
    items = [], 
    fieldDefinitions = [], 
    statusOptions = [],
    onRowClick
  } = $props<{
    items: Item[];
    fieldDefinitions: FieldDefinition[];
    statusOptions: string[];
    onRowClick?: (item: Item) => void;
  }>();

  let hasProgress = $derived(items.some((item: Item) => item.progress_total !== null));
</script>

<div class="table-container">
  <table>
    <thead>
      <tr>
        <th class="cover-col"></th>
        <th>Title</th>
        <th>Status</th>
        <th>Priority</th>
        <th>Tags</th>
        {#if hasProgress}
          <th>Progress</th>
        {/if}
        <th>Due Date</th>
        {#each fieldDefinitions as field}
          <th>{field.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if items.length === 0}
        <tr>
          <td colspan={100} class="empty">No items found.</td>
        </tr>
      {:else}
        {#each items as item (item.id)}
          <ItemRow {item} {fieldDefinitions} {statusOptions} {hasProgress} onClick={() => onRowClick?.(item)} />
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    width: 100%;
    overflow-x: auto;
  }

  table {
    min-width: 100%;
  }

  th {
    position: sticky;
    top: 0;
    background: var(--bg-primary);
    z-index: 1;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }

  .cover-col {
    width: 64px;
  }

  .empty {
    text-align: center;
    padding: 48px;
    color: var(--text-tertiary);
  }
</style>
