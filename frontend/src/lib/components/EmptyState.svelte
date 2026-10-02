<script lang="ts">
  let { message, actionLabel, onAction } = $props<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  }>();
</script>

<div class="empty-state">
  <div class="icon-container">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <circle cx="9" cy="16" r="3"></circle>
      <path d="M11 18.5 13 21"></path>
      <path d="M7 13.5 5 11"></path>
    </svg>
  </div>
  <p>{message}</p>
  
  {#if actionLabel && onAction}
    <button class="btn-primary" onclick={onAction}>{actionLabel}</button>
  {/if}
</div>

<style>
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 32px;
    height: 100%;
    text-align: center;
  }

  .icon-container {
    color: var(--text-tertiary);
    margin-bottom: 24px;
  }

  p {
    color: var(--text-secondary);
    font-size: 16px;
    margin-bottom: 24px;
    max-width: 300px;
  }
</style>
