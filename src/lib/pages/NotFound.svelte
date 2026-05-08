<script lang="ts">
  import RouterLink from "$lib/components/RouterLink.svelte";
  import { ICurrentRoute } from "$lib/core/router.svelte";

  const {
    currentRoute,
  }: {
    currentRoute?: ICurrentRoute;
  } = $props();
</script>

<main class="flex w-full h-screen flex-col items-center justify-center gap-4">
  <p>The page you are looking for does not exist.</p>
  <RouterLink to="/">Go back to Home</RouterLink>
  {#if currentRoute?.params?.route}
    <p class="opacity-50 font-mono text-xs">
      Route: {currentRoute.params.route}
    </p>
  {/if}
</main>
