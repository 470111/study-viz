<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { SubjectId } from '../domain/types'
import { todayYmd } from '../lib/dates'
import { useRecordsStore } from '../stores/records'

const props = defineProps<{ subjectId: SubjectId }>()
const store = useRecordsStore()

const date = computed(() => todayYmd())
const existing = computed(() => store.checkinFor(props.subjectId, date.value))

const note = ref(existing.value?.note ?? '')
watch(
  () => existing.value?.note,
  (v) => (note.value = v ?? ''),
)

const isDone = computed(() => existing.value?.isDone ?? false)
</script>

<template>
  <section class="card">
    <div class="row">
      <div>
        <div class="kicker">点卯</div>
        <div class="value">
          <span v-if="isDone">今日已点卯</span>
          <span v-else>今日未点卯</span>
        </div>
      </div>
      <div class="btns">
        <button v-if="!isDone" class="btn primary" type="button" @click="store.setCheckin(subjectId, date, true, note)">
          立誓
        </button>
        <button v-else class="btn" type="button" @click="store.setCheckin(subjectId, date, false, note)">改判</button>
      </div>
    </div>
    <div class="note">
      <input v-model="note" class="input" placeholder="可书一语" @blur="store.setCheckin(subjectId, date, isDone, note)" />
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
  font-size: 16px;
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
.note {
  margin-top: 10px;
}
.input {
  width: 100%;
  box-sizing: border-box;
  border: none;
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  color: var(--text-h);
  padding: 10px 12px;
  border-radius: 16px;
}
</style>

