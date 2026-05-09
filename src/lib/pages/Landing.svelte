<script lang="ts">
  import { gsap } from "gsap";
  import { onMount } from "svelte";
  import vrcLogoAsset from "../assets/VRC_Logo.webp";

  const CELL_SIZE = 64;

  let width = $state(window.innerWidth);
  let height = $state(window.innerHeight);

  const cols = $derived(Math.ceil(width / CELL_SIZE));
  const rows = $derived(Math.ceil(height / CELL_SIZE));
  const cellW = $derived(width / cols);
  const cellH = $derived(height / rows);

  let lastFired = 0;
  let doneAnimating = $state(false);

  function eatAt(squareX: number, squareY: number, radius = 5) {
    const targetHue = (Date.now() / 3) % 360;
    const targets: Element[] = [];
    for (let r = 0; r <= radius; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          if (Math.abs(dx) === r || Math.abs(dy) === r) {
            const el = document.querySelector(
              `[data-square-xy="${squareX + dx},${squareY + dy}"]`,
            );
            if (el && !gsap.isTweening(el)) targets.push(el);
          }
        }
      }
    }
    if (!targets.length) return;
    gsap.to(targets, {
      opacity: 0,
      backgroundColor: `hsl(${targetHue}deg, 60%, 55%)`,
      scale: 0,
      duration: 1.5,
      stagger: { amount: 1.0, from: "start" },
      ease: "expo.out",
      onComplete() {
        targets.forEach((el) => el.remove());
      },
    });
  }

  onMount(() => {
    setTimeout(() => {
      const interval = setInterval(() => {
        const remaining = document.querySelectorAll("[data-square-xy]");
        if (!remaining.length) {
          clearInterval(interval);
          doneAnimating = true;
          return;
        }
        const pick = remaining[Math.floor(Math.random() * remaining.length)];
        const [sx, sy] = pick
          .getAttribute("data-square-xy")!
          .split(",")
          .map(Number);
        eatAt(sx, sy);
      }, 100);
      gsap.to("[data-vrc-logo]", {
        opacity: 0,
        duration: 0.5,
      });
    }, 300);
  });
</script>

<svelte:window
  onresize={() => {
    width = window.innerWidth;
    height = window.innerHeight;
  }}
  onmousemove={(event) => {
    const now = Date.now();
    if (now - lastFired < 100) return;
    lastFired = now;

    const squareX = Math.floor(event.x / CELL_SIZE);
    const squareY = Math.floor(event.y / CELL_SIZE);
    eatAt(squareX, squareY);
  }}
/>

<div
  class="relative w-full h-screen overflow-hidden bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500"
>
  {#if !doneAnimating}
    {#each Array.from({ length: rows }) as _, y}
      {#each Array.from({ length: cols }) as _, x}
        <div
          class="border absolute"
          style="width: {cellW}px; height: {cellH}px; left: {x *
            cellW}px; top: {y * cellH}px; background: black;"
          data-square-xy="{x},{y}"
        ></div>
      {/each}
    {/each}

    <img
      src={vrcLogoAsset}
      class="absolute left-1/2 top-1/2 -translate-1/2 w-[50%] max-w-[50vh]"
      alt="VRChat Logo"
      data-vrc-logo
    />
  {/if}
</div>
