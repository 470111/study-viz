<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  value: number // 0..1
  size?: number
  label?: string
}>()

const size = computed(() => props.size ?? 74)
const stroke = computed(() => Math.max(6, Math.round(size.value * 0.12)))
const r = computed(() => (size.value - stroke.value) / 2)
const c = computed(() => 2 * Math.PI * r.value)
const dash = computed(() => Math.max(0, Math.min(1, props.value)) * c.value)
</script>

<template>
  <div class="wrap" :style="{ width: `${size}px` }">
    <svg :width="size" :height="size" viewBox="0 0 100 100" class="svg" aria-hidden="true">
      <defs>
        <linearGradient id="ink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--ink-strong)" />
          <stop offset="100%" stop-color="var(--accent)" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="42" class="track" />
      <circle
        cx="50"
        cy="50"
        r="42"
        class="arc"
        :style="{ strokeDasharray: `${dash} ${c}`, strokeDashoffset: `${c * 0.25}` }"
      />
    </svg>
    <div class="mid">
      <div class="pct">{{ Math.round(value * 100) }}%</div>
      <div v-if="label" class="lab">{{ label }}</div>
    </div>
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
}
.svg {
  display: block;
  width: 100%;
  height: auto;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.12));
}
.track {
  fill: none;
  stroke: var(--ink-weak);
  stroke-width: 12;
}
.arc {
  fill: none;
  stroke: url(#ink);
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dasharray 220ms ease;
}
.mid {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
}
.pct {
  font-weight: 900;
  color: var(--text-h);
}
.lab {
  margin-top: 2px;
  font-size: 12px;
  opacity: 0.75;
}
</style>

