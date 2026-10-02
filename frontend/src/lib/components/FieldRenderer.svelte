<script lang="ts">
  import type { FieldDefinition } from '$lib/types';
  
  let { field, value, onChange } = $props<{
    field: FieldDefinition;
    value: any;
    onChange: (val: any) => void;
  }>();

  function handleChange(e: any) {
    let val = e.target.value;
    if (field.type === 'number') {
      val = val === '' ? null : Number(val);
    } else if (field.type === 'checkbox') {
      val = e.target.checked;
    }
    onChange(val);
  }
</script>

<div class="field-container">
  {#if field.type === 'text'}
    <textarea 
      value={value || ''} 
      oninput={handleChange}
      placeholder="Enter text..."
      rows="3"
    ></textarea>
  {:else if field.type === 'number'}
    <input 
      type="number" 
      value={value ?? ''} 
      oninput={handleChange}
      placeholder="0" 
    />
  {:else if field.type === 'date'}
    <input 
      type="date" 
      value={value || ''} 
      oninput={handleChange} 
    />
  {:else if field.type === 'url'}
    <div class="url-input">
      <input 
        type="url" 
        value={value || ''} 
        oninput={handleChange}
        placeholder="https://" 
      />
      {#if value}
        <a href={value} target="_blank" rel="noopener noreferrer" class="link-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      {/if}
    </div>
  {:else if field.type === 'image'}
    <div class="image-input">
      <input 
        type="url" 
        value={value || ''} 
        oninput={handleChange}
        placeholder="Image URL..." 
      />
      {#if value}
        <div class="preview">
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img src={value} alt="Preview" />
        </div>
      {/if}
    </div>
  {:else if field.type === 'select'}
    <select value={value || ''} onchange={handleChange}>
      <option value="">Select option...</option>
      {#each field.options || [] as opt}
        <option value={opt}>{opt}</option>
      {/each}
    </select>
  {:else if field.type === 'checkbox'}
    <label class="checkbox-label">
      <input 
        type="checkbox" 
        checked={!!value} 
        onchange={handleChange} 
      />
      <span class="checkbox-text">{field.label}</span>
    </label>
  {:else}
    <input 
      type="text" 
      value={value || ''} 
      oninput={handleChange} 
    />
  {/if}
</div>

<style>
  .field-container {
    width: 100%;
  }

  textarea {
    width: 100%;
    resize: vertical;
  }
  
  input:not([type="checkbox"]), select {
    width: 100%;
  }

  .url-input {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .url-input input {
    flex: 1;
  }
  .link-btn {
    padding: 8px;
    background: var(--bg-tertiary);
    border-radius: 6px;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .link-btn:hover {
    color: var(--text-primary);
    background: var(--border);
  }

  .image-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .preview {
    width: 100%;
    max-height: 200px;
    border-radius: 6px;
    overflow: hidden;
    background: var(--bg-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .preview img {
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  .checkbox-text {
    font-size: 14px;
    color: var(--text-primary);
  }
</style>
