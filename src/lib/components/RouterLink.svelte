<script lang="ts">
  import { navigateTo } from '$lib/core/router.svelte';

  const {
    to,
    children,
    class: className
  } = $props<{
    to: string
    children?: any
    class?: string
  }>()

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    navigateTo(to);
  }
</script>

<a href={to} data-preload={to} class={className || 'text-blue-500 hover:underline'} onclick={handleClick}>
  {@render children?.()}
</a>
