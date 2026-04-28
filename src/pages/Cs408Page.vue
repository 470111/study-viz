<script setup lang="ts">
import SectHeader from '../components/SectHeader.vue'
import StageCard from '../components/StageCard.vue'
import TimerCard from '../components/TimerCard.vue'
import CheckinCard from '../components/CheckinCard.vue'
import InsightCard from '../components/InsightCard.vue'
import WrongbookCard from '../components/WrongbookCard.vue'
import WeeklyReportCard from '../components/WeeklyReportCard.vue'
import InkHeatmap from '../components/InkHeatmap.vue'
import InkSparkline from '../components/InkSparkline.vue'
import { useRecordsStore } from '../stores/records'
import { computed, ref } from 'vue'

const store = useRecordsStore()

const span = ref<'week' | 'month'>('month')
const spanDays = computed(() => (span.value === 'week' ? 7 : 35))

const minutesByDay = computed<Record<string, number>>(() => {
  const map: Record<string, number> = {}
  for (const s of store.sessions.filter((x) => x.subjectId === 'cs408')) {
    const ymd = s.startedAt.slice(0, 10)
    map[ymd] = (map[ymd] ?? 0) + s.minutes
  }
  return map
})

const last7 = computed(() => {
  const keys = Object.keys(minutesByDay.value).sort().slice(-7)
  return keys.map((k) => minutesByDay.value[k] ?? 0)
})
</script>

<template>
  <SectHeader sect="机枢阁" subtitle="408" subject-id="cs408" />
  <div class="stack">
    <section class="panel">
      <div class="p-head">
        <div class="p-title">墨迹图谱</div>
        <div class="tabs" role="tablist" aria-label="图谱跨度">
          <button class="tab" type="button" role="tab" :aria-selected="span === 'week'" :data-on="span === 'week'" @click="span = 'week'">
            周
          </button>
          <button
            class="tab"
            type="button"
            role="tab"
            :aria-selected="span === 'month'"
            :data-on="span === 'month'"
            @click="span = 'month'"
          >
            月
          </button>
        </div>
      </div>
      <InkHeatmap :minutes-by-day="minutesByDay" :days="spanDays" />
      <div class="mini">
        <div class="mini-lab">七日功行</div>
        <InkSparkline :values="last7" />
      </div>
    </section>
    <WeeklyReportCard subject-id="cs408" />
    <StageCard subject-id="cs408" />
    <TimerCard subject-id="cs408" />
    <CheckinCard subject-id="cs408" />
    <InsightCard subject-id="cs408" />
    <WrongbookCard subject-id="cs408" />
  </div>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 12px;
}
.panel {
  border: none;
  border-radius: 20px;
  padding: 14px;
  background: color-mix(in srgb, var(--paper-2) 55%, transparent);
  box-shadow: var(--shadow);
}
.p-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}
.p-title {
  font-weight: 900;
  color: var(--text-h);
}
.tabs {
  display: inline-flex;
  gap: 8px;
}
.tab {
  appearance: none;
  border: none;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  font-weight: 900;
  color: var(--text-h);
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
  opacity: 0.78;
}
.tab[data-on='true'] {
  background: color-mix(in srgb, var(--accent-bg) 70%, var(--bg));
  opacity: 1;
}
.mini {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.mini-lab {
  font-size: 12px;
  opacity: 0.75;
}
</style>

