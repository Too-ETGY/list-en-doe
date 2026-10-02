<script lang="ts">
  let { statusOptions = [], onFilterChange } = $props<{
    statusOptions: string[];
    onFilterChange: (filters: { search: string, status: string, priority: string }) => void;
  }>();

  let search = $state('');
  let status = $state('');
  let priority = $state('');

  let timeout: any;

  $effect(() => {
    // debounce search
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      onFilterChange({ search, status, priority });
    }, 300);
  });
</script>

<div class="filter-bar">
  <div class="search-input">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
    <input type="text" bind:value={search} placeholder="Search items..." />
  </div>

  <div class="dropdowns">
    <select bind:value={status}>
      <option value="">All Statuses</option>
      {#each statusOptions as opt}
        <option value={opt}>{opt}</option>
      {/each}
    </select>

    <select bind:value={priority}>
      <option value="">All Priorities</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  </div>
</div>

<style>
  .filter-bar {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-light);
    flex-wrap: wrap;
  }

  .search-input {
    position: relative;
    flex: 1;
    min-width: 200px;
    max-width: 400px;
  }

  .search-input svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }

  .search-input input {
    width: 100%;
    padding-left: 36px;
  }

  .dropdowns {
    display: flex;
    gap: 12px;
  }
</style>
