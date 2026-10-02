<script lang="ts">
  import { api } from '$lib/api';
  import type { FieldDefinition } from '$lib/types';

  let { onClose, onSave } = $props<{
    onClose: () => void;
    onSave: (data: any) => void;
  }>();

  let name = $state('');
  let icon = $state('📝');
  let userSelectedIcon = $state(false);
  let selectedTemplate = $state('Custom');
  let isSaving = $state(false);

  const emojis = ['🎬', '🍥', '📚', '✅', '🎮', '🎵', '📝', '🎯', '🏠', '🛒', '💡', '🔗'];
  const templates = ['Custom', 'Movie', 'Anime', 'Book', 'Task'];

  let fields = $state<FieldDefinition[]>([]);
  let statusOptions = $state<string[]>(['To Do', 'In Progress', 'Done']);

  function selectEmoji(emoji: string) {
    icon = emoji;
    userSelectedIcon = true;
  }

  function selectTemplate(tpl: string) {
    selectedTemplate = tpl;
    if (!userSelectedIcon) {
      if (tpl === 'Movie') icon = '🎬';
      else if (tpl === 'Anime') icon = '🍥';
      else if (tpl === 'Book') icon = '📚';
      else if (tpl === 'Task') icon = '✅';
      else icon = '📝';
    }

    if (tpl === 'Movie') {
      fields = [
        { key: 'director', label: 'Director', type: 'text' },
        { key: 'year', label: 'Release Year', type: 'number' },
        { key: 'rating', label: 'Rating (1-10)', type: 'number' }
      ];
      statusOptions = ['Plan to Watch', 'Watching', 'Completed', 'Dropped'];
    } else if (tpl === 'Anime') {
      fields = [
        { key: 'studio', label: 'Studio', type: 'text' },
        { key: 'episodes', label: 'Episodes', type: 'number' },
        { key: 'score', label: 'Score (1-10)', type: 'number' }
      ];
      statusOptions = ['Plan to Watch', 'Watching', 'Completed', 'Dropped'];
    } else if (tpl === 'Book') {
      fields = [
        { key: 'author', label: 'Author', type: 'text' },
        { key: 'pages', label: 'Pages', type: 'number' }
      ];
      statusOptions = ['Plan to Read', 'Reading', 'Completed', 'Dropped'];
    } else if (tpl === 'Task') {
      fields = [
        { key: 'assignee', label: 'Assignee', type: 'text' },
        { key: 'story_points', label: 'Story Points', type: 'number' }
      ];
      statusOptions = ['Todo', 'In Progress', 'Review', 'Done'];
    } else {
      fields = [];
      statusOptions = ['To Do', 'In Progress', 'Done'];
    }
  }

  function addField() {
    fields = [...fields, { key: `field_${Date.now()}`, label: 'New Field', type: 'text' }];
  }

  function removeField(index: number) {
    fields = fields.filter((_, i) => i !== index);
  }

  async function handleSave() {
    if (!name.trim()) return;
    isSaving = true;
    try {
      const newList = await api.lists.create({
        name,
        icon,
        template_type: selectedTemplate === 'Custom' ? null : selectedTemplate.toLowerCase(),
        field_definitions: fields,
        status_options: statusOptions
      });
      onSave(newList);
    } catch (e) {
      console.error(e);
    } finally {
      isSaving = false;
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
      <h2>Create New List</h2>
      <button class="close-btn" onclick={onClose} type="button">×</button>
    </header>

    <div class="body">
      <div class="form-group">
        <label for="listName">Name</label>
        <input id="listName" type="text" bind:value={name} placeholder="e.g. Movies to Watch" autofocus />
      </div>

      <div class="form-group">
        <label>Icon</label>
        <div class="emoji-grid">
          {#each emojis as emoji}
            <button 
              class="emoji-btn {icon === emoji ? 'active' : ''}" 
              onclick={() => selectEmoji(emoji)}
              type="button"
            >
              {emoji}
            </button>
          {/each}
        </div>
      </div>

      <div class="form-group">
        <label>Template</label>
        <div class="template-grid">
          {#each templates as tpl}
            <button 
              class="template-btn {selectedTemplate === tpl ? 'active' : ''}" 
              onclick={() => selectTemplate(tpl)}
              type="button"
            >
              {tpl}
            </button>
          {/each}
        </div>
      </div>

      {#if selectedTemplate === 'Custom'}
        <div class="custom-fields">
          <div class="section-header">
            <h3>Custom Fields</h3>
            <button class="btn-ghost small" onclick={addField} type="button">+ Add Field</button>
          </div>
          
          {#each fields as field, i}
            <div class="field-row">
              <input type="text" bind:value={field.label} placeholder="Field Label (e.g. Director)" />
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
      {/if}
    </div>

    <footer>
      <button class="btn-ghost" onclick={onClose} disabled={isSaving} type="button">Cancel</button>
      <button class="btn-primary" onclick={handleSave} disabled={!name.trim() || isSaving} type="button">
        {isSaving ? 'Creating...' : 'Create List'}
      </button>
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

  .template-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .template-btn {
    padding: 8px 16px;
    border-radius: 6px;
    background: var(--bg-tertiary);
    border: 1px solid transparent;
    font-size: 14px;
  }
  .template-btn:hover {
    background: var(--border);
  }
  .template-btn.active {
    border-color: var(--accent);
    background: var(--accent-subtle);
    color: var(--accent);
  }

  .custom-fields {
    border-top: 1px solid var(--border-light);
    padding-top: 24px;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  .section-header h3 {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .field-row {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
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
    justify-content: flex-end;
    gap: 12px;
  }
</style>
