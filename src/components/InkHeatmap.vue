<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps<{
  // map YYYY-MM-DD -> minutes
  minutesByDay: Record<string, number>
  days?: number // default 42
}>()

const days = computed(() => props.days ?? 42)

const cells = computed(() => {
  const end = dayjs().startOf('day')
  const start = end.subtract(days.value - 1, 'day')
  const out: { ymd: string; v: number }[] = []
  for (let i = 0; i < days.value; i++) {
    const d = start.add(i, 'day')
    const ymd = d.format('YYYY-MM-DD')
    const v = props.minutesByDay[ymd] ?? 0
    out.push({ ymd, v })
  }
  const max = Math.max(1, ...out.map((x) => x.v))
  return { out, max }
})

function ink(v: number, max: number): number {
  const t = Math.min(1, Math.max(0, v / max))
  // softer at low end
  return 0.08 + t * 0.52
}
</script>

<template>
  <div class="grid" aria-label="墨迹日历">
    <div
      v-for="c in cells.out"
      :key="c.ymd"
      class="cell"
      :title="`${c.ymd} · ${c.v} 分`"
      :style="{ backgroundColor: `rgba(32,29,24, ${ink(c.v, cells.max)})` }"
    />
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(14, 1fr);
  gap: 6px;
}
.cell {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 6px;
  background: var(--ink-weak);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
  transition: background-color 220ms ease, transform 160ms ease;
}
.cell:hover {
  transform: translateY(-1px);
}
</style>

