<script>
  import { destroyRouter, initRouter, router } from "../core/router.svelte";
  import { onDestroy, onMount } from "svelte";

  onMount(() => {
    initRouter();
  });

  onDestroy(() => {
    destroyRouter();
  });

  const current = $derived(router.currentRoute);
  const Component = $derived(current?.component);
</script>

<main class="flex w-full h-screen flex-col">
  {#if Component}
    {#key current.route + JSON.stringify(current.params)}
      <Component currentRoute={current} />
    {/key}
  {/if}
</main>
