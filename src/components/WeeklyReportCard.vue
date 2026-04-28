<script setup lang="ts">
import { computed } from 'vue'
import type { SubjectId } from '../domain/types'
import { useRecordsStore } from '../stores/records'

const props = defineProps<{ subjectId: SubjectId }>()
const store = useRecordsStore()

const report = computed(() => store.weeklyReport(props.subjectId))

function pct(n: number) {
  return `${Math.round(n)}%`
}
</script>

<template>
  <section class="card">
    <div class="top">
      <div>
        <div class="kicker">七日小结（{{ report.weekStart }} ~ {{ report.weekEnd }}）</div>
        <div class="tier">{{ report.tier }}</div>
        <div class="comment">{{ report.comment }}</div>
      </div>
      <div class="badge">
        <div class="badge-k">评章</div>
        <div class="badge-v">{{ report.total }}</div>
      </div>
    </div>

    <div class="bars">
      <div class="bar">
        <div class="bar-top"><span>功行</span><span>{{ pct(report.gongxing) }}</span></div>
        <div class="track"><div class="fill" :style="{ width: pct(report.gongxing) }" /></div>
      </div>
      <div class="bar">
        <div class="bar-top"><span>破阵</span><span>{{ pct(report.pozhen) }}</span></div>
        <div class="track"><div class="fill" :style="{ width: pct(report.pozhen) }" /></div>
      </div>
      <div class="bar">
        <div class="bar-top"><span>炼心</span><span>{{ pct(report.lianxin) }}</span></div>
        <div class="track"><div class="fill" :style="{ width: pct(report.lianxin) }" /></div>
      </div>
    </div>

    <div class="mvp">本周一技最精：<span class="mvp-v">{{ report.mvp }}</span></div>
  </section>
</template>

<style scoped>
.card {
  border: none;
  border-radius: 20px;
  padding: 14px;
  background: color-mix(in srgb, var(--paper-2) 55%, transparent);
  box-shadow: var(--shadow);
}
.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.kicker {
  font-size: 12px;
  opacity: 0.8;
}
.tier {
  margin-top: 6px;
  font-size: 16px;
  font-weight: 900;
  color: var(--text-h);
}
.comment {
  margin-top: 8px;
  font-size: 13px;
  opacity: 0.95;
}
.badge {
  border: none;
  border-radius: 14px;
  padding: 10px 12px;
  text-align: center;
  min-width: 78px;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
}
.badge-k {
  font-size: 12px;
  opacity: 0.75;
}
.badge-v {
  margin-top: 4px;
  font-size: 20px;
  font-weight: 900;
  color: var(--text-h);
}
.bars {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}
.bar-top {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.85;
}
.track {
  margin-top: 6px;
  height: 10px;
  border-radius: 999px;
  border: none;
  overflow: hidden;
  background: var(--ink-weak);
}
.fill {
  height: 100%;
  background: color-mix(in srgb, var(--accent) 85%, #000);
  opacity: 0.75;
}
.mvp {
  margin-top: 12px;
  font-size: 13px;
  opacity: 0.9;
}
.mvp-v {
  color: var(--text-h);
  font-weight: 850;
}
</style>

