<script lang="ts">
  let { current, total } = $props<{ current: number; total: number }>();

  let percent = $derived(() => {
    if (!total || total === 0) return 0;
    return Math.min(100, Math.max(0, (current / total) * 100));
  });

  let barColor = $derived(() => {
    if (percent() === 100) return 'var(--success)';
    return 'var(--accent)';
  });
</script>

<div class="progress-container">
  <div class="label">{current} / {total}</div>
  <div class="bar-bg">
    <div class="bar-fill" style="width: {percent()}%; background-color: {barColor()}"></div>
  </div>
</div>

<style>
  .progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-width: 100px;
  }
  .label {
    font-size: 12px;
    color: var(--text-secondary);
    min-width: 40px;
    text-align: right;
  }
  .bar-bg {
    flex: 1;
    height: 6px;
    background: var(--bg-tertiary);
    border-radius: 3px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease, background-color 0.3s ease;
  }
</style>
