<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Cs408ChapterId, MathChapterId, SubjectId } from '../domain/types'
import { useRecordsStore } from '../stores/records'
import InkRing from './InkRing.vue'
import { MATH_CHAPTERS } from '../lib/mathCurriculum'
import InkSelect from './InkSelect.vue'
import { pickSettleQuote } from '../lib/settleQuotes'
import { CS408_CHAPTERS } from '../lib/cs408Curriculum'

const props = defineProps<{ subjectId: SubjectId }>()
const store = useRecordsStore()

const stage = computed(() => store.stageFor(props.subjectId))
const allowed = computed(() => store.allowedSourcesFor(props.subjectId))

const mathChapters = computed(() => MATH_CHAPTERS)
const mathProgress = computed(() => store.mathStageProgress(stage.value as any))
const cs408Chapters = computed(() => CS408_CHAPTERS)
const cs408Progress = computed(() => store.cs408StageProgress(stage.value as any))

const CS408_BOOKS = ['数据结构', '计组', '操作系统', '计网'] as const
type Cs408Book = (typeof CS408_BOOKS)[number]

const cs408ActiveBook = computed<Cs408Book>(() => {
  for (const b of CS408_BOOKS) {
    const chapters = cs408Chapters.value.filter((c) => c.book === b)
    const allDone = chapters.length > 0 && chapters.every((c) => Boolean((cs408Progress.value as any)?.[c.id]?.isDone))
    if (!allDone) return b
  }
  return CS408_BOOKS[CS408_BOOKS.length - 1]
})

const cs408VisibleChapters = computed(() => cs408Chapters.value.filter((c) => c.book === cs408ActiveBook.value))
const doneCount = computed(() => {
  if (props.subjectId === 'math') return Object.values(mathProgress.value ?? {}).filter((c: any) => c?.isDone).length
  if (props.subjectId === 'cs408') return Object.values(cs408Progress.value ?? {}).filter((c: any) => c?.isDone).length
  return 0
})
const totalChapters = computed(() => {
  if (props.subjectId === 'math') return 9
  if (props.subjectId === 'cs408') return cs408Chapters.value.length
  return 0
})
const pct = computed(() => (totalChapters.value > 0 ? doneCount.value / totalChapters.value : 0))

const sourcePick = ref<Record<string, any>>({})

const effect = ref<{ on: boolean; text: string; key: string }>({ on: false, text: '', key: '' })
function showEffect(key: string) {
  effect.value = { on: true, text: pickSettleQuote(), key }
  window.setTimeout(() => {
    if (effect.value.key === key) effect.value.on = false
  }, 2200)
}

function seal(chId: MathChapterId, k: 'ke' | 'juan' | 'xin' | 'wu') {
  return Boolean((mathProgress.value as any)?.[chId]?.seals?.[k])
}

function toggleSeal(chId: MathChapterId, k: 'ke' | 'juan' | 'xin' | 'wu') {
  store.setMathSeal(chId, k, !seal(chId, k))
}

function canSettle(chId: MathChapterId) {
  const s = (mathProgress.value as any)?.[chId]?.seals
  return Boolean(s?.ke && s?.juan && s?.xin && s?.wu)
}

function csDone(chId: Cs408ChapterId) {
  return Boolean((cs408Progress.value as any)?.[chId]?.isDone)
}
function csCount(chId: Cs408ChapterId) {
  return Number((cs408Progress.value as any)?.[chId]?.keCount ?? 0)
}
function csCanSettle(chId: Cs408ChapterId) {
  return !csDone(chId) && csCount(chId) > 0
}
</script>

<template>
  <section class="card">
    <div class="row">
      <div>
        <div class="kicker">修行篇章</div>
        <div class="value">{{ stage }}</div>
        <div class="hint">此篇可行：{{ allowed.join(' / ') }}</div>
      </div>
      <InkRing v-if="subjectId === 'math' || subjectId === 'cs408'" :value="pct" :size="78" label="本篇" />
    </div>

    <div v-if="subjectId === 'math'" class="chapters">
      <div
        v-for="ch in mathChapters"
        :key="ch.id"
        class="ch"
        :data-done="Boolean((mathProgress as any)?.[ch.id]?.isDone)"
      >
        <transition name="inkpop">
          <div v-if="effect.on && effect.key === ch.id" class="fx" aria-live="polite">
            {{ effect.text }}
          </div>
        </transition>

        <div class="ch-head">
          <div class="nm">{{ ch.name }}</div>
          <div class="st">{{ (mathProgress as any)?.[ch.id]?.isDone ? '已结' : '未结' }}</div>
        </div>

        <div class="juan">
          <InkSelect
            v-model="sourcePick[ch.id]"
            :options="allowed.map((v) => ({ value: v, label: v }))"
            label="卷册"
          />
          <button class="inc" type="button" @click="store.incMathJuan(ch.id, sourcePick[ch.id] ?? allowed[0], 1)">
            破阵一节
          </button>
          <div class="cnt">
            计：{{ (mathProgress as any)?.[ch.id]?.juanBySource?.[(sourcePick as any)[ch.id] ?? allowed[0]] ?? 0 }}
          </div>
        </div>

        <div class="seals" aria-label="四象印记">
          <button class="seal" type="button" :data-on="seal(ch.id, 'ke')" @click="toggleSeal(ch.id, 'ke')">课</button>
          <button class="seal" type="button" :data-on="seal(ch.id, 'juan')" @click="toggleSeal(ch.id, 'juan')">卷</button>
          <button class="seal" type="button" :data-on="seal(ch.id, 'xin')" @click="toggleSeal(ch.id, 'xin')">心</button>
          <button class="seal" type="button" :data-on="seal(ch.id, 'wu')" @click="toggleSeal(ch.id, 'wu')">悟</button>
        </div>

        <button
          class="settle"
          type="button"
          :disabled="Boolean((mathProgress as any)?.[ch.id]?.isDone) || !canSettle(ch.id)"
          @click="
            () => {
              store.settleMathChapter(ch.id)
              showEffect(ch.id)
            }
          "
        >
          结本章
        </button>
      </div>
    </div>

    <div v-else-if="subjectId === 'cs408'" class="chapters">
      <div class="cs-head">
        <div class="cs-book">当前修书：{{ cs408ActiveBook }}</div>
        <div class="cs-hint">此书未尽，不显后卷</div>
      </div>

      <div v-for="ch in cs408VisibleChapters" :key="ch.id" class="ch" :data-done="csDone(ch.id)">
        <transition name="inkpop">
          <div v-if="effect.on && effect.key === ch.id" class="fx" aria-live="polite">
            {{ effect.text }}
          </div>
        </transition>

        <div class="ch-head">
          <div class="nm">{{ ch.book }} · {{ ch.name }}</div>
          <div class="st">{{ csDone(ch.id) ? '已结' : '未结' }}</div>
        </div>

        <div class="juan">
          <button class="inc" type="button" @click="store.incCs408Ke(ch.id, 1)">课后一节</button>
          <div class="cnt">计：{{ csCount(ch.id) }}</div>
        </div>

        <button
          class="settle"
          type="button"
          :disabled="csDone(ch.id) || !csCanSettle(ch.id)"
          @click="
            () => {
              store.settleCs408Chapter(ch.id)
              showEffect(ch.id)
            }
          "
        >
          结本章
        </button>
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
  font-size: 16px;
  font-weight: 900;
  color: var(--text-h);
}
.hint {
  margin-top: 6px;
  font-size: 12px;
  opacity: 0.75;
}
.chapters {
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.cs-head {
  grid-column: 1 / -1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  padding: 2px 4px;
}
.cs-book {
  font-weight: 900;
  color: var(--text-h);
}
.cs-hint {
  font-size: 12px;
  opacity: 0.7;
}
.ch {
  appearance: none;
  border: none;
  background: color-mix(in srgb, var(--bg) 74%, transparent);
  text-align: left;
  padding: 12px 12px;
  border-radius: 18px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.12);
  display: grid;
  gap: 10px;
  transition: transform 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
}
.fx {
  font-family: var(--hand);
  font-size: 22px;
  color: var(--text-h);
  padding: 10px 12px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--paper-2) 55%, transparent);
  box-shadow: 0 26px 70px rgba(0, 0, 0, 0.22);
}
.inkpop-enter-active,
.inkpop-leave-active {
  transition: opacity 220ms ease, transform 220ms ease, filter 220ms ease;
}
.inkpop-enter-from,
.inkpop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
  filter: blur(4px);
}
.juan {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: end;
}
.inc {
  appearance: none;
  border: none;
  border-radius: 16px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  color: var(--text-h);
  background: color-mix(in srgb, var(--accent-bg) 70%, var(--bg));
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
}
.cnt {
  grid-column: 1 / -1;
  font-size: 12px;
  opacity: 0.75;
}
.ch[data-done='true'] {
  opacity: 0.8;
}
.ch:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 66px rgba(0, 0, 0, 0.16);
}
.ch-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}
.nm {
  font-weight: 850;
  color: var(--text-h);
}
.st {
  font-size: 12px;
  opacity: 0.75;
}
.seals {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.seal {
  appearance: none;
  border: none;
  border-radius: 14px;
  padding: 10px 0;
  cursor: pointer;
  font-family: var(--hand);
  font-size: 18px;
  color: var(--text-h);
  background: color-mix(in srgb, var(--ink-weak) 60%, transparent);
  transition: transform 140ms ease, background-color 140ms ease, opacity 140ms ease;
}
.seal[data-on='true'] {
  background: color-mix(in srgb, var(--accent-bg) 78%, transparent);
}
.seal:active {
  transform: translateY(1px) scale(0.99);
}
.settle {
  appearance: none;
  border: none;
  border-radius: 16px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 900;
  color: var(--text-h);
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.10);
  transition: transform 160ms ease, opacity 160ms ease, background-color 160ms ease;
}
.settle:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.settle:not(:disabled):active {
  transform: translateY(1px);
}
@media (max-width: 620px) {
  .chapters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>

