<script lang="ts">
  let { priority } = $props<{ priority: string | null }>();

  let color = $derived(() => {
    switch (priority) {
      case 'high': return 'var(--priority-high)';
      case 'medium': return 'var(--priority-medium)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--text-tertiary)';
    }
  });

  let label = $derived(() => {
    if (!priority) return '-';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  });
</script>

<div class="priority">
  {#if priority}
    <span class="dot" style="background-color: {color()}"></span>
  {/if}
  <span style="color: {priority ? color() : 'var(--text-tertiary)'}">{label()}</span>
</div>

<style>
  .priority {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
  }
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
</style>
