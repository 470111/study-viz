<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  values: number[] // >=0
  width?: number
  height?: number
}>()

const w = computed(() => props.width ?? 160)
const h = computed(() => props.height ?? 44)

const path = computed(() => {
  const vals = props.values.length ? props.values : [0]
  const max = Math.max(...vals, 1)
  const step = vals.length <= 1 ? 0 : w.value / (vals.length - 1)
  const pts = vals.map((v, i) => {
    const x = i * step
    const y = h.value - (v / max) * (h.value - 6) - 3
    return { x, y }
  })
  return pts
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ')
})
</script>

<template>
  <svg :width="w" :height="h" :viewBox="`0 0 ${w} ${h}`" class="svg" aria-hidden="true">
    <path :d="path" class="line" />
  </svg>
</template>

<style scoped>
.svg {
  display: block;
}
.line {
  fill: none;
  stroke: var(--text-h);
  stroke-opacity: 0.55;
  stroke-width: 2.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>

