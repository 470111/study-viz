<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SubjectId } from '../domain/types'
import { useRecordsStore } from '../stores/records'

const props = defineProps<{ subjectId: SubjectId }>()
const store = useRecordsStore()

const text = ref('')
function add() {
  store.addInsight(props.subjectId, text.value)
  text.value = ''
}

const recent = computed(() => store.insights.filter((i) => i.subjectId === props.subjectId).slice(0, 3))
</script>

<template>
  <section class="card">
    <div class="top">
      <div class="kicker">悟道（七日五悟）</div>
      <button class="btn primary" type="button" @click="add">落笔</button>
    </div>
    <textarea v-model="text" class="input" rows="2" placeholder="可记一诀：法门/要害/易错" />

    <div v-if="recent.length" class="recent">
      <div v-for="i in recent" :key="i.id" class="item">
        <div class="t">{{ i.createdAt.slice(0, 10) }}</div>
        <div class="x">{{ i.text }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px;
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
.input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-h);
  padding: 10px 12px;
  border-radius: 12px;
}
.btn {
  appearance: none;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-h);
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  height: 40px;
}
.btn.primary {
  border-color: var(--accent-border);
  background: var(--accent-bg);
}
.recent {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}
.item {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 10px 12px;
}
.t {
  font-size: 12px;
  opacity: 0.7;
}
.x {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-h);
  white-space: pre-wrap;
}
</style>

