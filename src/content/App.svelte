<script lang="ts">
  import RouterMount from "$lib/components/RouterMount.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    document.body.className = "dark";
    document.body.style.colorScheme = "dark";
    document.documentElement.className = "";
    document.documentElement.setAttribute("style", "");
  });
</script>

<main class="min-h-screen w-full bg-background text-foreground">
  <RouterMount />
</main>
