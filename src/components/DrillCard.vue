<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SourceType, SubjectId, UnitType } from '../domain/types'
import { useRecordsStore } from '../stores/records'
import InkSelect from './InkSelect.vue'

const props = defineProps<{ subjectId: SubjectId }>()
const store = useRecordsStore()

const source = ref<SourceType>('练习册')
const unitType = ref<UnitType>('章')
const unitName = ref('')
const count = ref<number>(1)
const accuracy = ref<number>(80)

const allowed = computed(() => store.allowedSourcesFor(props.subjectId))
const sourceOpts = computed(() => allowed.value.map((v) => ({ value: v, label: v })))
const unitOpts = computed(() => [{ value: '章' as UnitType, label: '章' }, { value: '套' as UnitType, label: '套' }])

const lastTitle = computed(() => {
  const d = store.drills.find((x) => x.subjectId === props.subjectId && x.firstAttemptTitle)
  return d?.firstAttemptTitle ?? null
})

function submit() {
  const drill = store.addDrill({
    subjectId: props.subjectId,
    source: source.value,
    unitType: unitType.value,
    unitName: unitName.value,
    count: count.value,
    accuracy: accuracy.value,
  })
  if (drill) {
    unitName.value = ''
    count.value = 1
  }
}
</script>

<template>
  <section class="card">
    <div class="top">
      <div>
        <div class="kicker">演法破阵（按套/章）</div>
        <div v-if="lastTitle" class="badge">近得称号：『{{ lastTitle }}』</div>
      </div>
      <button class="btn primary" type="button" @click="submit">立卷</button>
    </div>

    <div class="grid">
      <label class="field">
        <InkSelect v-model="source" label="卷册" :options="sourceOpts" />
      </label>

      <label class="field">
        <InkSelect v-model="unitType" label="章法" :options="unitOpts" />
      </label>

      <label class="field field-full">
        <div class="label">章/套题目（如：第三章 / 2008 数二真题）</div>
        <input v-model="unitName" class="input" placeholder="须填" />
      </label>

      <label class="field">
        <div class="label">章/套数</div>
        <input v-model.number="count" class="input" type="number" min="1" />
      </label>

      <label class="field">
        <div class="label">首试得法（0-100）</div>
        <input v-model.number="accuracy" class="input" type="number" min="0" max="100" />
      </label>
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
.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.kicker {
  font-size: 12px;
  opacity: 0.8;
}
.badge {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-h);
}
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field-full {
  grid-column: 1 / -1;
}
.label {
  font-size: 12px;
  opacity: 0.8;
}
.input {
  width: 100%;
  box-sizing: border-box;
  border: none;
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  color: var(--text-h);
  padding: 10px 12px;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
}
.btn {
  appearance: none;
  border: none;
  background: color-mix(in srgb, var(--bg) 72%, transparent);
  color: var(--text-h);
  padding: 10px 12px;
  border-radius: 16px;
  cursor: pointer;
  height: 40px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
}
.btn.primary {
  background: color-mix(in srgb, var(--accent-bg) 65%, var(--bg));
}
@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>

