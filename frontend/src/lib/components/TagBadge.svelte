<script lang="ts">
  import type { Tag } from '$lib/types';
  
  let { tag, removable = false, onRemove } = $props<{
    tag: Tag;
    removable?: boolean;
    onRemove?: (id: string) => void;
  }>();

  // Convert hex to rgb for rgba background
  let bg = $derived(() => {
    let hex = tag.color.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map((c: string) => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  });
</script>

<span class="tag" style="background: {bg()}; color: {tag.color}; border: 1px solid {bg()}">
  {tag.name}
  {#if removable && onRemove}
    <button class="remove" onclick={(e) => { e.stopPropagation(); onRemove(tag.id); }} type="button">×</button>
  {/if}
</span>

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    gap: 4px;
    white-space: nowrap;
  }
  .remove {
    padding: 0;
    margin-left: 2px;
    font-size: 14px;
    line-height: 1;
    color: inherit;
    opacity: 0.7;
  }
  .remove:hover {
    opacity: 1;
  }
</style>
