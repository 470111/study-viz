import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type {
  DailyCheckin,
  DrillFirstAttemptTitle,
  DrillLog,
  Insight,
  Cs408ChapterId,
  MathChapterId,
  SourceType,
  StageId,
  SubjectId,
  TimerSession,
  UnitType,
  WeeklyMvpAction,
  WeeklyReport,
  WeeklyTier,
  WrongItem,
} from '../domain/types'
import { isBetweenYmd, minutesBetween, nowIso, todayYmd, weekEndYmd, weekStartYmd } from '../lib/dates'
import type { PetId, WeaponId } from '../lib/companions'
import { CS408_CHAPTERS } from '../lib/cs408Curriculum'

type ActiveTimer = {
  subjectId: SubjectId
  startedAt: string // ISO
  isRunning: boolean
}

type RecordsState = {
  activeTimer: ActiveTimer | null
  sessions: TimerSession[]
  checkins: DailyCheckin[]
  drills: DrillLog[]
  insights: Insight[]
  wrongItems: WrongItem[]
  stages: Record<SubjectId, { current: StageId; finished: StageId[] }>
  realmSeen?: RealmName
  chosen?: { petId: PetId; weaponId: WeaponId }
  petXp?: number
  weaponFeng?: number
  mathProgress: Record<
    StageId,
    Record<
      MathChapterId,
      {
        isDone: boolean
        doneAt?: string
        seals: { ke: boolean; juan: boolean; xin: boolean; wu: boolean }
        juanBySource: Partial<Record<SourceType, number>>
      }
    >
  >
  cs408Progress: Record<
    StageId,
    Record<
      Cs408ChapterId,
      {
        isDone: boolean
        doneAt?: string
        keCount: number
      }
    >
  >
}

const STORAGE_KEY = 'study-viz.records.v1'

function loadState(): RecordsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as RecordsState
    // shallow merge + fix nested defaults
    const base = emptyState()
    const merged: RecordsState = { ...base, ...parsed }
    merged.stages = { ...base.stages, ...(parsed as any).stages }
    merged.mathProgress = { ...base.mathProgress, ...(parsed as any).mathProgress }
    merged.cs408Progress = { ...base.cs408Progress, ...(parsed as any).cs408Progress }
    merged.realmSeen = (parsed as any).realmSeen ?? base.realmSeen
    merged.chosen = (parsed as any).chosen ?? base.chosen
    merged.petXp = (parsed as any).petXp ?? base.petXp
    merged.weaponFeng = (parsed as any).weaponFeng ?? base.weaponFeng
    // ensure each stage/chapter has seals
    for (const st of Object.keys(base.mathProgress) as StageId[]) {
      merged.mathProgress[st] = { ...base.mathProgress[st], ...(merged.mathProgress as any)[st] }
      for (const ch of Object.keys(base.mathProgress[st]) as MathChapterId[]) {
        const cur = (merged.mathProgress as any)[st]?.[ch]
        const def = (base.mathProgress as any)[st]?.[ch]
        ;(merged.mathProgress as any)[st][ch] = {
          ...def,
          ...cur,
          seals: { ...def.seals, ...(cur?.seals ?? {}) },
          juanBySource: { ...def.juanBySource, ...(cur?.juanBySource ?? {}) },
        }
      }
    }

    // ensure each cs408 stage/chapter exists
    for (const st of Object.keys(base.cs408Progress) as StageId[]) {
      merged.cs408Progress[st] = { ...base.cs408Progress[st], ...(merged.cs408Progress as any)[st] }
      for (const ch of Object.keys(base.cs408Progress[st]) as Cs408ChapterId[]) {
        const cur = (merged.cs408Progress as any)[st]?.[ch]
        const def = (base.cs408Progress as any)[st]?.[ch]
        ;(merged.cs408Progress as any)[st][ch] = { ...def, ...cur }
      }
    }
    return merged
  } catch {
    return emptyState()
  }
}

function saveState(s: RecordsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

function emptyState(): RecordsState {
  const emptyChapter = () => ({
    isDone: false,
    seals: { ke: false, juan: false, xin: false, wu: false },
    juanBySource: {},
  })
  const empty408 = () => ({
    isDone: false,
    keCount: 0,
  })
  const make408Stage = (): Record<Cs408ChapterId, { isDone: boolean; doneAt?: string; keCount: number }> =>
    Object.fromEntries(CS408_CHAPTERS.map((c) => [c.id, empty408()])) as any
  return {
    activeTimer: null,
    sessions: [],
    checkins: [],
    drills: [],
    insights: [],
    wrongItems: [],
    realmSeen: '炼气',
    chosen: { petId: 'mo-yu-he', weaponId: 'tian-suan-jian' },
    petXp: 0,
    weaponFeng: 0,
    stages: {
      math: { current: '开蒙篇', finished: [] },
      cs408: { current: '开蒙篇', finished: [] },
      english: { current: '开蒙篇', finished: [] },
      custom: { current: '开蒙篇', finished: [] },
    },
    mathProgress: {
      开蒙篇: {
        lim: emptyChapter(),
        diff: emptyChapter(),
        integ: emptyChapter(),
        mdiff: emptyChapter(),
        doubleInteg: emptyChapter(),
        ode: emptyChapter(),
        'la-1': emptyChapter(),
        'la-2': emptyChapter(),
        'la-3': emptyChapter(),
      },
      归真篇: {
        lim: emptyChapter(),
        diff: emptyChapter(),
        integ: emptyChapter(),
        mdiff: emptyChapter(),
        doubleInteg: emptyChapter(),
        ode: emptyChapter(),
        'la-1': emptyChapter(),
        'la-2': emptyChapter(),
        'la-3': emptyChapter(),
      },
      凝丹篇: {
        lim: emptyChapter(),
        diff: emptyChapter(),
        integ: emptyChapter(),
        mdiff: emptyChapter(),
        doubleInteg: emptyChapter(),
        ode: emptyChapter(),
        'la-1': emptyChapter(),
        'la-2': emptyChapter(),
        'la-3': emptyChapter(),
      },
      问劫篇: {
        lim: emptyChapter(),
        diff: emptyChapter(),
        integ: emptyChapter(),
        mdiff: emptyChapter(),
        doubleInteg: emptyChapter(),
        ode: emptyChapter(),
        'la-1': emptyChapter(),
        'la-2': emptyChapter(),
        'la-3': emptyChapter(),
      },
    },
    cs408Progress: {
      开蒙篇: make408Stage(),
      归真篇: make408Stage(),
      凝丹篇: make408Stage(),
      问劫篇: make408Stage(),
    },
  }
}

const STAGES: StageId[] = ['开蒙篇', '归真篇', '凝丹篇', '问劫篇']

function nextStage(stage: StageId): StageId | null {
  const idx = STAGES.indexOf(stage)
  if (idx < 0) return null
  return STAGES[idx + 1] ?? null
}

function allowedSources(stage: StageId): SourceType[] {
  if (stage === '开蒙篇') return ['课后题', '练习册']
  if (stage === '归真篇') return ['880']
  if (stage === '凝丹篇') return ['课后题', '练习册']
  return ['真题', '模拟']
}

function titleFromAccuracy(acc: number): DrillFirstAttemptTitle {
  if (acc >= 90) return '破阵真君'
  if (acc >= 80) return '破阵上人'
  if (acc >= 70) return '破阵行者'
  if (acc >= 60) return '破阵学徒'
  return '破阵磨剑'
}

function clamp100(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

function tierFromTotal(total: number): WeeklyTier {
  if (total >= 90) return '凌霄天（天选·极境）'
  if (total >= 80) return '紫宸天（天阙·上境）'
  if (total >= 70) return '青冥天（云路·中境）'
  if (total >= 60) return '白玉天（青云·下境）'
  if (total >= 40) return '赤霞天（蓄势·初境）'
  return '凡尘境（待启·未境）'
}

function bestTitle(a?: DrillFirstAttemptTitle, b?: DrillFirstAttemptTitle): DrillFirstAttemptTitle | undefined {
  const rank: Record<DrillFirstAttemptTitle, number> = {
    破阵真君: 5,
    破阵上人: 4,
    破阵行者: 3,
    破阵学徒: 2,
    破阵磨剑: 1,
  }
  if (!a) return b
  if (!b) return a
  return rank[b] > rank[a] ? b : a
}

function commentFromScores(g: number, p: number, l: number, recoveryRate: number): string {
  const max = Math.max(g, p, l)
  const min = Math.min(g, p, l)

  const praise =
    max === g ? '功行扎实，气血充盈。' : max === p ? '破阵有力，锋芒正盛。' : '炼心稳固，道基澄明。'

  let advice = ''
  if (recoveryRate < 30) {
    advice = '然心魔未尽；下周以斩心魔为先。'
  } else if (min === g) {
    advice = '但功行不足；下周先稳住行功节律。'
  } else if (min === p) {
    advice = '但破阵偏少；下周多演法破阵，并择机一场天劫试炼。'
  } else {
    advice = '但炼心尚欠；下周把错题回收率推到六成。'
  }

  return `${praise}${advice}`
}

function pickMvp(actions: Record<WeeklyMvpAction, number>): WeeklyMvpAction {
  let best: WeeklyMvpAction = '行功一周天'
  let bestV = -Infinity
  for (const [k, v] of Object.entries(actions) as [WeeklyMvpAction, number][]) {
    if (v > bestV) {
      bestV = v
      best = k
    }
  }
  return best
}

type RealmName =
  | '炼气'
  | '筑基'
  | '金丹'
  | '元婴'
  | '化神'
  | '炼虚'
  | '合体'
  | '大乘'
  | '渡劫'

const REALMS: { name: RealmName; need: number }[] = [
  { name: '炼气', need: 0 },
  { name: '筑基', need: 2000 },
  { name: '金丹', need: 6000 },
  { name: '元婴', need: 12000 },
  { name: '化神', need: 20000 },
  { name: '炼虚', need: 32000 },
  { name: '合体', need: 48000 },
  { name: '大乘', need: 70000 },
  { name: '渡劫', need: 98000 },
]

function realmFromXiuw(totalXiuw: number): { name: RealmName; step: '初境' | '中境' | '后境' | '圆满'; pct: number } {
  const x = Math.max(0, Math.floor(totalXiuw))
  let i = 0
  for (; i < REALMS.length - 1; i++) {
    if (x < REALMS[i + 1].need) break
  }
  const cur = REALMS[i]!
  const next = REALMS[i + 1] ?? null
  const span = Math.max(1, (next?.need ?? cur.need + 1) - cur.need)
  const t = Math.max(0, Math.min(0.999, (x - cur.need) / span))
  const q = t < 0.25 ? '初境' : t < 0.5 ? '中境' : t < 0.75 ? '后境' : '圆满'
  return { name: cur.name, step: q, pct: t }
}

export const useRecordsStore = defineStore('records', {
  state: (): RecordsState => loadState(),
  getters: {
    checkinFor:
      (s) =>
      (subjectId: SubjectId, date: string) =>
        s.checkins.find((c) => c.subjectId === subjectId && c.date === date) ?? null,
    activeTimerFor: (s) => (subjectId: SubjectId) => (s.activeTimer?.subjectId === subjectId ? s.activeTimer : null),
    stageFor: (s) => (subjectId: SubjectId) => s.stages[subjectId]?.current ?? '开蒙篇',
    allowedSourcesFor: (s) => (subjectId: SubjectId) =>
      subjectId === 'cs408' ? (['课后题'] as const) : allowedSources(s.stages[subjectId]?.current ?? '开蒙篇'),
    mathStageProgress: (s) => (stage: StageId) => s.mathProgress[stage],
    cs408StageProgress: (s) => (stage: StageId) => s.cs408Progress[stage],

    // 修为（全局）：行功 50 分钟 +10；破阵一节 +6；悟道 +12；斩心魔 +10；点卯 +15
    totalXiuw: (s) => {
      const gong = Math.floor(s.sessions.reduce((sum, x) => sum + x.minutes, 0) / 50) * 10
      const pozhen = s.drills.reduce((sum, d) => sum + (d.count ?? 0) * 6, 0)
      const wu = s.insights.length * 12
      const xin = s.wrongItems.filter((w) => Boolean(w.recoveredAt)).length * 10
      const miao = s.checkins.filter((c) => c.isDone).length * 15
      return gong + pozhen + wu + xin + miao
    },
    realm: (s): { name: RealmName; step: '初境' | '中境' | '后境' | '圆满'; pct: number } => {
      const gong = Math.floor(s.sessions.reduce((sum, x) => sum + x.minutes, 0) / 50) * 10
      const pozhen = s.drills.reduce((sum, d) => sum + (d.count ?? 0) * 6, 0)
      const wu = s.insights.length * 12
      const xin = s.wrongItems.filter((w) => Boolean(w.recoveredAt)).length * 10
      const miao = s.checkins.filter((c) => c.isDone).length * 15
      return realmFromXiuw(gong + pozhen + wu + xin + miao)
    },

    realmRank: (): Record<RealmName, number> => ({
      炼气: 0,
      筑基: 1,
      金丹: 2,
      元婴: 3,
      化神: 4,
      炼虚: 5,
      合体: 6,
      大乘: 7,
      渡劫: 8,
    }),

    chosenPetId: (s) => s.chosen?.petId ?? 'mo-yu-he',
    chosenWeaponId: (s) => s.chosen?.weaponId ?? 'tian-suan-jian',

    petLevel: (s) => Math.max(1, Math.floor((s.petXp ?? 0) / 120) + 1),
    petLevelPct: (s) => ((s.petXp ?? 0) % 120) / 120,
    weaponPct: (s) => Math.min(1, Math.max(0, (s.weaponFeng ?? 0) / 12)),
  },
  actions: {
    persist() {
      saveState(this.$state)
    },

    markRealmSeen(name: RealmName) {
      this.realmSeen = name
      this.persist()
    },

    choosePet(petId: PetId) {
      this.chosen ??= { petId: 'mo-yu-he', weaponId: 'tian-suan-jian' }
      this.chosen.petId = petId
      this.persist()
    },
    chooseWeapon(weaponId: WeaponId) {
      this.chosen ??= { petId: 'mo-yu-he', weaponId: 'tian-suan-jian' }
      this.chosen.weaponId = weaponId
      this.persist()
    },

    addPetXp(delta: number) {
      this.petXp = Math.max(0, Math.round((this.petXp ?? 0) + delta))
      this.persist()
    },
    addWeaponFeng(delta: number) {
      this.weaponFeng = Math.max(0, Math.round((this.weaponFeng ?? 0) + delta))
      this.persist()
    },
    consumeWeaponFeng() {
      this.weaponFeng = 0
      this.persist()
    },

    setCheckin(subjectId: SubjectId, date = todayYmd(), isDone: boolean, note?: string) {
      const existing = this.checkins.find((c) => c.subjectId === subjectId && c.date === date)
      if (existing) {
        existing.isDone = isDone
        existing.note = note
      } else {
        this.checkins.unshift({ id: nanoid(), subjectId, date, isDone, note })
      }
      this.persist()
      if (isDone) this.addPetXp(8)
    },

    startTimer(subjectId: SubjectId) {
      const now = nowIso()
      this.activeTimer = { subjectId, startedAt: now, isRunning: true }
      this.persist()
    },

    stopTimer(subjectId: SubjectId) {
      if (!this.activeTimer || this.activeTimer.subjectId !== subjectId) return null
      const endedAt = nowIso()
      const startedAt = this.activeTimer.startedAt
      const minutes = minutesBetween(startedAt, endedAt)
      this.activeTimer = null
      if (minutes > 0) {
        const session: TimerSession = { id: nanoid(), subjectId, startedAt, endedAt, minutes }
        this.sessions.unshift(session)
        this.persist()
        // 灵宠：行功每 50 分钟 +10 修为 → 同步给灵宠 10xp
        this.addPetXp(Math.floor(minutes / 50) * 10)
        return session
      }
      this.persist()
      return null
    },

    addInsight(subjectId: SubjectId, text: string) {
      const t = text.trim()
      if (!t) return
      this.insights.unshift({ id: nanoid(), subjectId, createdAt: nowIso(), text: t })
      this.persist()
      this.addPetXp(12)
    },

    addDrill(input: {
      subjectId: SubjectId
      date?: string
      source: SourceType
      unitType: UnitType
      unitName: string
      count: number
      accuracy: number
    }) {
      const date = input.date ?? todayYmd()
      const unitName = input.unitName.trim()
      const count = Math.max(0, Math.round(input.count))
      const accuracy = clamp100(input.accuracy)
      if (!unitName || count <= 0) return

      // 阶段解锁：上一阶段未结束不能记录下一阶段来源
      const stage = this.stages[input.subjectId]?.current ?? '开蒙篇'
      if (!allowedSources(stage).includes(input.source)) return

      // 首刷称号：同一“题册+章/套名”只产生一次
      const keyMatch = (d: DrillLog) =>
        d.subjectId === input.subjectId && d.source === input.source && d.unitType === input.unitType && d.unitName === unitName
      const already = this.drills.some(keyMatch)
      const firstAttemptTitle = already ? undefined : titleFromAccuracy(accuracy)

      const drill: DrillLog = {
        id: nanoid(),
        subjectId: input.subjectId,
        date,
        source: input.source,
        unitType: input.unitType,
        unitName,
        count,
        accuracy,
        firstAttemptTitle,
      }
      this.drills.unshift(drill)
      this.persist()
      return drill
    },

    addWrongItem(subjectId: SubjectId, prompt: string, wrongReason: string, module?: string) {
      const p = prompt.trim()
      const r = wrongReason.trim()
      this.wrongItems.unshift({
        id: nanoid(),
        subjectId,
        createdAt: nowIso(),
        module: module?.trim() || undefined,
        prompt: p || undefined,
        wrongReason: r || undefined,
        images: [],
      })
      this.persist()
    },

    attachWrongImages(id: string, images: { mime: string; dataUrl: string }[]) {
      const item = this.wrongItems.find((w) => w.id === id)
      if (!item) return
      item.images ??= []
      for (const img of images) {
        item.images.push({ id: nanoid(), mime: img.mime, dataUrl: img.dataUrl, createdAt: nowIso() })
      }
      this.persist()
    },

    recoverWrongItem(id: string, recoveryNote: string) {
      const item = this.wrongItems.find((w) => w.id === id)
      if (!item) return
      const note = recoveryNote.trim()
      if (!note) return
      item.recoveredAt = nowIso()
      item.recoveryNote = note
      this.persist()
      this.addPetXp(10)
    },

    weeklyReport(subjectId: SubjectId): WeeklyReport {
      const start = weekStartYmd()
      const end = weekEndYmd()

      const weekSessions = this.sessions.filter((x) => x.subjectId === subjectId && isBetweenYmd(x.startedAt.slice(0, 10), start, end))
      const totalMinutes = weekSessions.reduce((sum, s) => sum + s.minutes, 0)

      const weekDrills = this.drills.filter((d) => d.subjectId === subjectId && isBetweenYmd(d.date, start, end))
      const totalCounts = weekDrills.reduce((sum, d) => sum + (d.count ?? 0), 0)
      const accDen = weekDrills.reduce((sum, d) => sum + ((d.accuracy ?? null) === null ? 0 : (d.count ?? 0)), 0)
      const weightedAcc =
        accDen <= 0 ? 0 : weekDrills.reduce((sum, d) => sum + (d.accuracy ?? 0) * (d.count ?? 0), 0) / Math.max(1, accDen)

      const weekInsights = this.insights.filter((i) => i.subjectId === subjectId && isBetweenYmd(i.createdAt.slice(0, 10), start, end))

      const weekWrongsAdded = this.wrongItems.filter((w) => w.subjectId === subjectId && isBetweenYmd(w.createdAt.slice(0, 10), start, end))
      const weekWrongsRecovered = this.wrongItems.filter(
        (w) => w.subjectId === subjectId && w.recoveredAt && isBetweenYmd(w.recoveredAt.slice(0, 10), start, end),
      )
      const added = weekWrongsAdded.length
      const recovered = weekWrongsRecovered.length
      const recoveryRate = added === 0 ? 100 : Math.round((recovered / added) * 100)

      // 基准线（前期版本）
      const baseHours = 50
      const gongxing = clamp100((totalMinutes / 60 / baseHours) * 100)

      const baseChaptersOrSets = 12
      const quantityScore = clamp100((totalCounts / baseChaptersOrSets) * 100)
      const pozhen = clamp100(0.6 * quantityScore + 0.4 * weightedAcc)

      const baseInsights = 5
      const insightScore = clamp100((weekInsights.length / baseInsights) * 100)
      const lianxin = clamp100(0.7 * recoveryRate + 0.3 * insightScore)

      const total = clamp100(0.4 * gongxing + 0.3 * pozhen + 0.3 * lianxin)

      // 封顶规则
      let tier = tierFromTotal(total)
      if (recoveryRate < 30) {
        const capped: WeeklyTier = total >= 60 ? '白玉天（青云·下境）' : tier
        if (capped !== tier) tier = capped
      }

      const actions: Record<WeeklyMvpAction, number> = {
        '行功一周天': Math.round(totalMinutes / 50),
        '演法破阵': totalCounts,
        悟道: weekInsights.length,
        斩心魔: recovered,
        '天劫试炼': weekDrills
          .filter((d) => d.source === '真题' || d.source === '模拟')
          .reduce((sum, d) => sum + (d.count ?? 0) * 50, 0),
      }

      const mvp = pickMvp(actions)

      let best: DrillFirstAttemptTitle | undefined
      for (const d of weekDrills) best = bestTitle(best, d.firstAttemptTitle)

      const comment = commentFromScores(gongxing, pozhen, lianxin, recoveryRate)

      return {
        subjectId,
        weekStart: start,
        weekEnd: end,
        gongxing,
        pozhen,
        lianxin,
        total,
        tier,
        mvp,
        comment: best ? `${comment}本周获『${best}』。` : comment,
        bestFirstAttemptTitle: best,
      }
    },

    settleMathChapter(chapterId: MathChapterId) {
      const curStage = this.stages.math?.current ?? '开蒙篇'
      const chapter = this.mathProgress[curStage][chapterId]
      if (!chapter) return
      if (chapter.isDone) return
      const seals = chapter.seals
      if (!seals.ke || !seals.juan || !seals.xin || !seals.wu) return
      chapter.isDone = true
      chapter.doneAt = nowIso()

      const allDone = Object.values(this.mathProgress[curStage]).every((c) => c.isDone)
      if (allDone) {
        if (!this.stages.math.finished.includes(curStage)) this.stages.math.finished.push(curStage)
        const nxt = nextStage(curStage)
        if (nxt) this.stages.math.current = nxt
      }
      this.persist()
    },

    setMathSeal(chapterId: MathChapterId, seal: 'ke' | 'juan' | 'xin' | 'wu', on: boolean) {
      const curStage = this.stages.math?.current ?? '开蒙篇'
      const chapter = this.mathProgress[curStage][chapterId]
      if (!chapter) return
      if (chapter.isDone) return
      chapter.seals[seal] = on
      this.persist()
    },

    incMathJuan(chapterId: MathChapterId, source: SourceType, delta = 1) {
      const curStage = this.stages.math?.current ?? '开蒙篇'
      const chapter = this.mathProgress[curStage][chapterId]
      if (!chapter) return
      if (chapter.isDone) return
      const cur = chapter.juanBySource[source] ?? 0
      chapter.juanBySource[source] = Math.max(0, Math.round(cur + delta))
      if ((chapter.juanBySource[source] ?? 0) > 0) chapter.seals.juan = true

      // 记入七日小结口径：每次“破阵一节”都落一笔
      this.drills.unshift({
        id: nanoid(),
        subjectId: 'math',
        date: todayYmd(),
        source,
        chapterId,
        unitType: '章',
        unitName: chapterId,
        count: Math.max(0, Math.round(delta)),
      })
      // 兵器：每破阵一节攒锋芒
      this.addWeaponFeng(Math.max(0, Math.round(delta)))
      this.persist()
    },

    incCs408Ke(chapterId: Cs408ChapterId, delta = 1) {
      const curStage = this.stages.cs408?.current ?? '开蒙篇'
      const chapter = this.cs408Progress[curStage][chapterId]
      if (!chapter) return
      if (chapter.isDone) return
      chapter.keCount = Math.max(0, Math.round(chapter.keCount + delta))

      this.drills.unshift({
        id: nanoid(),
        subjectId: 'cs408',
        date: todayYmd(),
        source: '课后题',
        chapterId,
        unitType: '章',
        unitName: chapterId,
        count: Math.max(0, Math.round(delta)),
      })
      this.addWeaponFeng(Math.max(0, Math.round(delta)))
      this.persist()
    },

    settleCs408Chapter(chapterId: Cs408ChapterId) {
      const curStage = this.stages.cs408?.current ?? '开蒙篇'
      const chapter = this.cs408Progress[curStage][chapterId]
      if (!chapter) return
      if (chapter.isDone) return
      if ((chapter.keCount ?? 0) <= 0) return
      chapter.isDone = true
      chapter.doneAt = nowIso()

      const allDone = Object.values(this.cs408Progress[curStage]).every((c) => c.isDone)
      if (allDone) {
        if (!this.stages.cs408.finished.includes(curStage)) this.stages.cs408.finished.push(curStage)
        const nxt = nextStage(curStage)
        if (nxt) this.stages.cs408.current = nxt
      }
      this.persist()
    },
  },
})

