<script lang="ts">
  import { api } from '$lib/api';
  import { store } from '$lib/stores.svelte';
  import type { List, FieldDefinition } from '$lib/types';
  import { goto } from '$app/navigation';

  let { list, onClose, onSave } = $props<{
    list: List;
    onClose: () => void;
    onSave: () => void;
  }>();

  let name = $state(list.name || '');
  let icon = $state(list.icon || '📝');
  let isSaving = $state(false);
  let isDeleting = $state(false);

  const emojis = ['🎬', '🍥', '📚', '✅', '🎮', '🎵', '📝', '🎯', '🏠', '🛒', '💡', '🔗'];

  function parseJSON<T>(val: any, fallback: T): T {
    if (!val) return fallback;
    if (typeof val === 'string') {
      try { return JSON.parse(val) as T; } catch { return fallback; }
    }
    if (Array.isArray(val)) {
      return val.map((item) => (typeof item === 'object' && item !== null ? { ...item } : item)) as unknown as T;
    }
    return fallback;
  }

  let fields = $state<FieldDefinition[]>(
    parseJSON(list?.field_definitions, [])
  );
  let statusOptions = $state<string[]>(
    parseJSON(list?.status_options, ['To Do', 'In Progress', 'Done'])
  );

  function addField() {
    fields = [...fields, { key: `field_${Date.now()}`, label: 'New Field', type: 'text' }];
  }

  function removeField(index: number) {
    fields = fields.filter((_, i) => i !== index);
  }

  function addStatus() {
    statusOptions = [...statusOptions, 'New Status'];
  }

  function removeStatus(index: number) {
    if (statusOptions.length <= 1) return;
    statusOptions = statusOptions.filter((_, i) => i !== index);
  }

  async function handleSave() {
    if (!name.trim()) return;
    isSaving = true;
    try {
      await api.lists.update(list.id, {
        name,
        icon,
        field_definitions: fields,
        status_options: statusOptions
      });
      onSave();
    } catch (e) {
      console.error(e);
    } finally {
      isSaving = false;
    }
  }

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${list.name}"? All items in this list will be permanently removed.`)) return;
    isDeleting = true;
    try {
      await store.deleteList(list.id);
      onSave();
      onClose();
      if (store.lists.length > 0) {
        goto(`/lists/${store.lists[0].id}`);
      } else {
        goto('/');
      }
    } catch (e) {
      console.error(e);
    } finally {
      isDeleting = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-overlay" onclick={onClose}>
  <div class="modal-content" onclick={(e) => e.stopPropagation()}>
    <header>
      <h2>Edit List Settings</h2>
      <button class="close-btn" onclick={onClose} type="button">×</button>
    </header>

    <div class="body">
      <div class="form-group">
        <label for="listNameEdit">List Name</label>
        <input id="listNameEdit" type="text" bind:value={name} placeholder="List Name" />
      </div>

      <div class="form-group">
        <label>Icon</label>
        <div class="emoji-grid">
          {#each emojis as emoji}
            <button 
              class="emoji-btn {icon === emoji ? 'active' : ''}" 
              onclick={() => icon = emoji}
              type="button"
            >
              {emoji}
            </button>
          {/each}
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3>Status Options</h3>
          <button class="btn-ghost small" onclick={addStatus} type="button">+ Add Status</button>
        </div>
        <div class="status-list">
          {#each statusOptions as opt, i}
            <div class="status-row">
              <input type="text" bind:value={statusOptions[i]} placeholder="Status name" />
              <button class="btn-danger small" onclick={() => removeStatus(i)} disabled={statusOptions.length <= 1} type="button">Remove</button>
            </div>
          {/each}
        </div>
      </div>

      <div class="section">
        <div class="section-header">
          <h3>Custom Fields</h3>
          <button class="btn-ghost small" onclick={addField} type="button">+ Add Field</button>
        </div>
        
        {#each fields as field, i}
          <div class="field-row">
            <input type="text" bind:value={field.label} placeholder="Field Label" />
            <select bind:value={field.type}>
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="url">URL</option>
              <option value="image">Image</option>
              <option value="select">Select</option>
              <option value="checkbox">Checkbox</option>
            </select>
            <button class="btn-danger small" onclick={() => removeField(i)} type="button">Remove</button>
          </div>
        {/each}
      </div>
    </div>

    <footer>
      <button class="btn-danger" onclick={handleDelete} disabled={isDeleting} type="button">
        {isDeleting ? 'Deleting...' : 'Delete List'}
      </button>

      <div class="footer-actions">
        <button class="btn-ghost" onclick={onClose} disabled={isSaving} type="button">Cancel</button>
        <button class="btn-primary" onclick={handleSave} disabled={!name.trim() || isSaving} type="button">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </footer>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
  }

  .modal-content {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border);
    border-radius: 12px;
    width: 100%;
    max-width: 580px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    overflow: hidden;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
  }

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .close-btn {
    font-size: 24px;
    color: var(--text-secondary);
    line-height: 1;
    padding: 4px;
  }
  .close-btn:hover {
    color: var(--text-primary);
  }

  .body {
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .emoji-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .emoji-btn {
    font-size: 20px;
    padding: 8px;
    border-radius: 6px;
    background: var(--bg-tertiary);
    border: 1px solid transparent;
  }
  .emoji-btn:hover {
    background: var(--border);
  }
  .emoji-btn.active {
    border-color: var(--accent);
    background: var(--accent-subtle);
  }

  .section {
    border-top: 1px solid var(--border-light);
    padding-top: 20px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .section-header h3 {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .status-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .status-row, .field-row {
    display: flex;
    gap: 12px;
    margin-bottom: 8px;
  }
  .status-row input {
    flex: 1;
  }
  .field-row input {
    flex: 2;
  }
  .field-row select {
    flex: 1;
  }

  .small {
    padding: 4px 8px;
    font-size: 12px;
  }

  footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-actions {
    display: flex;
    gap: 12px;
  }
</style>
