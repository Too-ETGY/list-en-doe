<script lang="ts">
  let { status, statusOptions = [] } = $props<{
    status: string;
    statusOptions: string[];
  }>();

  const colors = [
    { bg: 'rgba(124, 106, 239, 0.1)', text: '#7c6aef' }, // Purple
    { bg: 'rgba(56, 189, 248, 0.1)', text: '#38bdf8' }, // Blue
    { bg: 'rgba(250, 204, 21, 0.1)', text: '#facc15' }, // Yellow
    { bg: 'rgba(74, 222, 128, 0.1)', text: '#4ade80' }, // Green
    { bg: 'rgba(248, 113, 113, 0.1)', text: '#f87171' }, // Red
  ];

  let colorStyle = $derived(() => {
    if (!status) return { bg: 'var(--bg-tertiary)', text: 'var(--text-secondary)' };
    const index = statusOptions.indexOf(status);
    if (index === -1) return colors[0];
    return colors[index % colors.length];
  });
</script>

{#if status}
  <span class="badge" style="background: {colorStyle().bg}; color: {colorStyle().text}">
    {status}
  </span>
{:else}
  <span class="badge empty">-</span>
{/if}

<style>
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }
  .empty {
    background: var(--bg-tertiary);
    color: var(--text-tertiary);
  }
</style>
