<script lang="ts">
  import { api } from '$lib/api';
  import type { Item, List } from '$lib/types';
  import FieldRenderer from './FieldRenderer.svelte';
  
  let { item = null, list, onClose, onSave } = $props<{
    item: Item | null;
    list: List;
    onClose: () => void;
    onSave: () => void;
  }>();

  let isSaving = $state(false);

  // Form state
  let title = $state(item?.title || '');
  let image_url = $state(item?.image_url || '');
  let status = $state(item?.status || '');
  let priority = $state<Item['priority']>(item?.priority || null);
  let due_date = $state(item?.due_date || '');
  let progress_current = $state(item?.progress_current || null);
  let progress_total = $state(item?.progress_total || null);
  let custom_fields = $state<Record<string, any>>(item?.custom_fields ? { ...item.custom_fields } : {});
  
  async function handleSave() {
    if (!title.trim()) return;
    isSaving = true;
    
    const data = {
      title,
      image_url: image_url || null,
      status: status || null,
      priority,
      due_date: due_date || null,
      progress_current,
      progress_total,
      custom_fields
    };

    try {
      if (item) {
        await api.items.update(item.id, data);
      } else {
        await api.items.create(list.id, data);
      }
      onSave();
    } catch (e) {
      console.error(e);
    } finally {
      isSaving = false;
    }
  }

  async function handleDelete() {
    if (!item) return;
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await api.items.delete(item.id);
      onSave();
    } catch (e) {
      console.error(e);
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
      <input 
        class="title-input" 
        bind:value={title} 
        placeholder="Item Title" 
        autofocus 
      />
      <button class="close-btn" onclick={onClose} type="button">×</button>
    </header>

    <div class="body">
      <div class="main-content">
        <div class="form-group">
          <label for="imageUrlInput">Image URL</label>
          <div class="image-preview-input">
            {#if image_url}
              <!-- svelte-ignore a11y_img_redundant_alt -->
              <img src={image_url} alt="Cover" class="cover-preview" />
            {/if}
            <input id="imageUrlInput" type="url" bind:value={image_url} placeholder="https://..." />
          </div>
        </div>

        {#if list.field_definitions && list.field_definitions.length > 0}
          <div class="custom-fields">
            <h3>Properties</h3>
            {#each list.field_definitions as field}
              <div class="form-group row">
                <label for={`field-${field.key}`} class="field-label">{field.label}</label>
                <div class="field-input">
                  <FieldRenderer 
                    {field} 
                    value={custom_fields[field.key]} 
                    onChange={(val) => custom_fields[field.key] = val} 
                  />
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <aside class="sidebar">
        <div class="form-group">
          <label for="statusSelect">Status</label>
          <select id="statusSelect" bind:value={status}>
            <option value="">None</option>
            {#each list.status_options as opt}
              <option value={opt}>{opt}</option>
            {/each}
          </select>
        </div>

        <div class="form-group">
          <label>Priority</label>
          <div class="priority-selector">
            <label class="radio-label">
              <input type="radio" bind:group={priority} value={null} />
              <span>None</span>
            </label>
            <label class="radio-label high">
              <input type="radio" bind:group={priority} value="high" />
              <span>High</span>
            </label>
            <label class="radio-label medium">
              <input type="radio" bind:group={priority} value="medium" />
              <span>Medium</span>
            </label>
            <label class="radio-label low">
              <input type="radio" bind:group={priority} value="low" />
              <span>Low</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="dueDateInput">Due Date</label>
          <input id="dueDateInput" type="date" bind:value={due_date} />
        </div>

        <div class="form-group">
          <label>Progress</label>
          <div class="progress-inputs">
            <input type="number" bind:value={progress_current} placeholder="0" min="0" />
            <span>/</span>
            <input type="number" bind:value={progress_total} placeholder="0" min="0" />
          </div>
        </div>
      </aside>
    </div>

    <footer>
      {#if item}
        <button class="btn-danger" onclick={handleDelete} type="button">Delete</button>
      {:else}
        <div></div>
      {/if}
      
      <div class="actions">
        <button class="btn-ghost" onclick={onClose} type="button">Cancel</button>
        <button class="btn-primary" onclick={handleSave} disabled={!title.trim() || isSaving} type="button">
          {isSaving ? 'Saving...' : 'Save'}
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
    max-width: 800px;
    height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    overflow: hidden;
  }

  header {
    display: flex;
    align-items: flex-start;
    padding: 24px 24px 16px 24px;
    border-bottom: 1px solid var(--border-light);
  }

  .title-input {
    flex: 1;
    font-size: 24px;
    font-weight: 600;
    background: transparent;
    border: none;
    padding: 0;
    color: var(--text-primary);
  }
  .title-input:focus {
    outline: none;
  }
  .title-input::placeholder {
    color: var(--text-tertiary);
  }

  .close-btn {
    font-size: 24px;
    color: var(--text-secondary);
    line-height: 1;
    padding: 4px;
    margin-left: 16px;
  }

  .body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }

  .main-content {
    flex: 2;
    padding: 24px;
    overflow-y: auto;
    border-right: 1px solid var(--border-light);
  }

  .sidebar {
    flex: 1;
    min-width: 250px;
    padding: 24px;
    background: var(--bg-primary);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 16px;
    color: var(--text-secondary);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }

  .form-group.row {
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .field-label {
    width: 120px;
    flex-shrink: 0;
    padding-top: 8px;
  }

  .field-input {
    flex: 1;
  }

  label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .image-preview-input {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  .cover-preview {
    width: 60px;
    height: 84px;
    object-fit: cover;
    border-radius: 4px;
  }

  .priority-selector {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .radio-label.high span { color: var(--priority-high); }
  .radio-label.medium span { color: var(--priority-medium); }
  .radio-label.low span { color: var(--priority-low); }

  .progress-inputs {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .progress-inputs input {
    width: 80px;
  }

  footer {
    padding: 16px 24px;
    border-top: 1px solid var(--border-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .actions {
    display: flex;
    gap: 12px;
  }
</style>
