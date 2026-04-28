<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import type { SubjectId } from '../domain/types'
import { useRecordsStore } from '../stores/records'
import dayjs from 'dayjs'

const props = defineProps<{ subjectId: SubjectId }>()
const store = useRecordsStore()

const active = computed(() => store.activeTimerFor(props.subjectId))
const now = ref(Date.now())
const tick = window.setInterval(() => (now.value = Date.now()), 1000)
onBeforeUnmount(() => window.clearInterval(tick))

const elapsedMin = computed(() => {
  if (!active.value) return 0
  const started = dayjs(active.value.startedAt).valueOf()
  return Math.max(0, Math.floor((now.value - started) / 1000 / 60))
})
</script>

<template>
  <section class="card">
    <div class="row">
      <div>
        <div class="kicker">行功一周天</div>
        <div class="value">
          <span v-if="active">{{ elapsedMin }} 分钟</span>
          <span v-else>尚未行功</span>
        </div>
      </div>
      <div class="btns">
        <button v-if="!active" class="btn primary" type="button" @click="store.startTimer(subjectId)">起功</button>
        <button v-else class="btn" type="button" @click="store.stopTimer(subjectId)">收功</button>
      </div>
    </div>
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
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.kicker {
  font-size: 12px;
  opacity: 0.8;
}
.value {
  margin-top: 6px;
  font-size: 18px;
  font-weight: 800;
  color: var(--text-h);
}
.btns {
  display: flex;
  gap: 8px;
}
.btn {
  appearance: none;
  border: none;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  color: var(--text-h);
  padding: 10px 12px;
  border-radius: 16px;
  cursor: pointer;
}
.btn.primary {
  background: color-mix(in srgb, var(--accent-bg) 65%, var(--bg));
}
</style>

