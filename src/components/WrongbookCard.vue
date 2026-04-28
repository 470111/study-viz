<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SubjectId } from '../domain/types'
import { useRecordsStore } from '../stores/records'

const props = defineProps<{ subjectId: SubjectId }>()
const store = useRecordsStore()

const module = ref('')
const pendingImages = ref<{ mime: string; dataUrl: string }[]>([])
const note = ref('')

const items = computed(() => store.wrongItems.filter((w) => w.subjectId === props.subjectId))

async function onPickNewImages(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  pendingImages.value = await Promise.all(files.map(fileToDataUrl))
  input.value = ''
}

async function onAttachMore(wrongId: string, e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  const imgs = await Promise.all(files.map(fileToDataUrl))
  store.attachWrongImages(wrongId, imgs)
  input.value = ''
}

function add() {
  if (pendingImages.value.length === 0) return
  store.addWrongItem(props.subjectId, '', note.value, module.value)
  const item = store.wrongItems.find((w) => w.subjectId === props.subjectId)
  if (item) store.attachWrongImages(item.id, pendingImages.value)
  module.value = ''
  pendingImages.value = []
  note.value = ''
}

async function fileToDataUrl(file: File): Promise<{ mime: string; dataUrl: string }> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('read failed'))
    reader.readAsDataURL(file)
  })
  return { mime: file.type || 'image/*', dataUrl }
}

const recoveryNote = ref<Record<string, string>>({})
function recover(id: string) {
  store.recoverWrongItem(id, recoveryNote.value[id] ?? '')
  recoveryNote.value[id] = ''
}
</script>

<template>
  <section class="card">
    <div class="top">
      <div class="kicker">错卷 · 斩心魔（题影为凭）</div>
      <button class="btn primary" type="button" :disabled="pendingImages.length === 0" @click="add">入册</button>
    </div>

    <div class="grid">
      <label class="field">
        <div class="label">门类（可空）</div>
        <input v-model="module" class="input" placeholder="如：极限 / 线代 / 计组..." />
      </label>
      <label class="field field-full">
        <div class="label">题影（须贴）</div>
        <label class="attach-btn">
          取题影
          <input
            class="file"
            type="file"
            accept="image/*"
            multiple
            @change="onPickNewImages"
          />
        </label>
        <div v-if="pendingImages.length" class="imgs">
          <img v-for="(img, idx) in pendingImages.slice(0, 4)" :key="idx" class="img" :src="img.dataUrl" alt="题影" />
        </div>
      </label>
      <label class="field field-full">
        <div class="label">札记（可空）</div>
        <textarea v-model="note" class="input" rows="2" placeholder="可记一语：何处失手 / 下次如何避" />
      </label>
    </div>

    <div v-if="items.length" class="list">
      <div v-for="w in items.slice(0, 6)" :key="w.id" class="item" :data-done="Boolean(w.recoveredAt)">
        <div class="meta">
          <div class="tag" v-if="w.module">{{ w.module }}</div>
          <div class="time">{{ w.createdAt.slice(0, 10) }}</div>
        </div>
        <div v-if="w.prompt" class="prompt">{{ w.prompt }}</div>
        <div v-if="w.wrongReason" class="reason">札记：{{ w.wrongReason }}</div>

        <div v-if="!w.recoveredAt" class="recover">
          <input
            v-model="recoveryNote[w.id]"
            class="input"
            placeholder="回收札记：改正要害（书毕再斩）"
          />
          <button class="btn" type="button" @click="recover(w.id)">斩</button>
        </div>
        <div v-if="w.images?.length" class="imgs">
          <img v-for="img in w.images.slice(0, 4)" :key="img.id" class="img" :src="img.dataUrl" alt="错题图片" />
        </div>
        <div v-if="!w.recoveredAt" class="attach">
          <label class="attach-btn">
            题影
            <input
              class="file"
              type="file"
              accept="image/*"
              multiple
              @change="(e) => onAttachMore(w.id, e)"
            />
          </label>
          <div class="attach-hint">存于此机</div>
        </div>
        <div v-else class="done">心魔已斩：{{ w.recoveredAt.slice(0, 10) }}</div>
      </div>
      <div class="more">（仅陈近六条）</div>
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
.list {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}
.item {
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
}
.item[data-done='true'] {
  opacity: 0.85;
}
.meta {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  opacity: 0.75;
}
.tag {
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 999px;
}
.prompt {
  margin-top: 8px;
  font-weight: 750;
  color: var(--text-h);
}
.reason {
  margin-top: 6px;
  font-size: 13px;
}
.recover {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.recover .input {
  flex: 1 1 auto;
}
.done {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-h);
}
.imgs {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}
.img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--border);
}
.attach {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.attach-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 10px;
  border-radius: 12px;
  border: 1px solid var(--border);
  cursor: pointer;
  color: var(--text-h);
  font-weight: 750;
}
.file {
  display: none;
}
.attach-hint {
  font-size: 12px;
  opacity: 0.7;
}
.more {
  font-size: 12px;
  opacity: 0.7;
  text-align: center;
}
@media (max-width: 520px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .recover {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

