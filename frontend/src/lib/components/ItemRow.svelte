<script lang="ts">
  import type { Item, FieldDefinition } from '$lib/types';
  import StatusBadge from './StatusBadge.svelte';
  import PriorityBadge from './PriorityBadge.svelte';
  import TagBadge from './TagBadge.svelte';
  import ProgressBar from './ProgressBar.svelte';
  import { api } from '$lib/api';

  let { item, fieldDefinitions = [], statusOptions = [], hasProgress = false, onClick } = $props<{
    item: Item;
    fieldDefinitions: FieldDefinition[];
    statusOptions: string[];
    hasProgress?: boolean;
    onClick?: () => void;
  }>();

  async function handleStatusChange(e: any) {
    const newStatus = e.target.value;
    item.status = newStatus; // Optimistic update
    try {
      await api.items.updateStatus(item.id, newStatus);
    } catch (err) {
      console.error(err);
    }
  }

  function getCustomValue(key: string) {
    if (!item.custom_fields) return '-';
    return item.custom_fields[key] ?? '-';
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<tr class="item-row" onclick={onClick}>
  <td class="cover">
    {#if item.image_url}
      <img src={item.image_url} alt={item.title} class="thumbnail" />
    {:else}
      <div class="thumbnail-placeholder"></div>
    {/if}
  </td>
  
  <td class="title">
    <span class="title-text">{item.title}</span>
  </td>

  <td class="status">
    <div class="status-dropdown">
      <StatusBadge status={item.status || ''} {statusOptions} />
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <select class="hidden-select" value={item.status || ''} onchange={handleStatusChange} onclick={(e) => e.stopPropagation()}>
        <option value="">None</option>
        {#each statusOptions as opt}
          <option value={opt}>{opt}</option>
        {/each}
      </select>
    </div>
  </td>

  <td class="priority">
    <PriorityBadge priority={item.priority} />
  </td>

  <td class="tags">
    <div class="tags-container">
      {#each item.tags || [] as tag}
        <TagBadge {tag} />
      {/each}
    </div>
  </td>

  {#if hasProgress}
    <td class="progress">
      {#if item.progress_total !== null}
        <ProgressBar current={item.progress_current || 0} total={item.progress_total || 0} />
      {:else}
        <span class="muted">-</span>
      {/if}
    </td>
  {/if}

  <td class="due-date">
    {item.due_date || '-'}
  </td>

  {#each fieldDefinitions as field}
    <td class="custom-field">
      {getCustomValue(field.key)}
    </td>
  {/each}
</tr>

<style>
  .item-row {
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .item-row:hover {
    background-color: var(--bg-tertiary);
  }

  .cover {
    width: 64px;
    padding: 8px 12px;
  }

  .thumbnail, .thumbnail-placeholder {
    width: 40px;
    height: 56px;
    border-radius: 4px;
    object-fit: cover;
  }

  .thumbnail-placeholder {
    background-color: var(--bg-tertiary);
  }

  .title-text {
    font-weight: 500;
    color: var(--text-primary);
  }

  .status-dropdown {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .hidden-select {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .due-date, .custom-field {
    color: var(--text-secondary);
    font-size: 13px;
  }
</style>
