export type SubjectId = 'math' | 'cs408' | 'english' | 'custom'

export type SourceType = '课后题' | '练习册' | '880' | '真题' | '模拟'
export type UnitType = '章' | '套'

export type StageId = '开蒙篇' | '归真篇' | '凝丹篇' | '问劫篇'

export type MathChapterId =
  | 'lim'
  | 'diff'
  | 'integ'
  | 'mdiff'
  | 'doubleInteg'
  | 'ode'
  | 'la-1'
  | 'la-2'
  | 'la-3'

export type Cs408ChapterId =
  // 数据结构
  | 'ds-1'
  | 'ds-2'
  | 'ds-3'
  | 'ds-4'
  | 'ds-5'
  | 'ds-6'
  | 'ds-7'
  | 'ds-8'
  // 计组
  | 'coa-1'
  | 'coa-2'
  | 'coa-3'
  | 'coa-4'
  | 'coa-5'
  | 'coa-6'
  | 'coa-7'
  // 操作系统
  | 'os-1'
  | 'os-2'
  | 'os-3'
  | 'os-4'
  | 'os-5'
  | 'os-6'
  | 'os-7'
  | 'os-8'
  // 计算机网络
  | 'cn-1'
  | 'cn-2'
  | 'cn-3'
  | 'cn-4'
  | 'cn-5'
  | 'cn-6'

export type ChapterProgress = {
  isDone: boolean
  doneAt?: string // ISO
}

export type TimerSession = {
  id: string
  subjectId: SubjectId
  startedAt: string // ISO
  endedAt: string // ISO
  minutes: number
}

export type DailyCheckin = {
  id: string
  subjectId: SubjectId
  date: string // YYYY-MM-DD
  isDone: boolean
  note?: string
}

export type DrillFirstAttemptTitle =
  | '破阵真君'
  | '破阵上人'
  | '破阵行者'
  | '破阵学徒'
  | '破阵磨剑'

export type DrillLog = {
  id: string
  subjectId: SubjectId
  date: string // YYYY-MM-DD
  source: SourceType
  chapterId?: MathChapterId | Cs408ChapterId
  unitType?: UnitType // 兼容旧数据
  unitName?: string // 兼容旧数据
  count?: number // 兼容旧数据
  accuracy?: number // 兼容旧数据

  // 首刷称号：只在“该题册该章/该套第一次记录”时产生
  firstAttemptTitle?: DrillFirstAttemptTitle
}

export type Insight = {
  id: string
  subjectId: SubjectId
  createdAt: string // ISO
  text: string
}

export type WrongItem = {
  id: string
  subjectId: SubjectId
  createdAt: string // ISO
  module?: string // 极限/微分... 或 408 模块
  prompt?: string
  wrongReason?: string // 错因

  images?: {
    id: string
    mime: string
    dataUrl: string
    createdAt: string
  }[]

  // “斩心魔”口径：写错因 + 再做正确
  recoveredAt?: string // ISO
  recoveryNote?: string // 复盘/改正要点
}

export type WeeklyTier =
  | '凌霄天（天选·极境）'
  | '紫宸天（天阙·上境）'
  | '青冥天（云路·中境）'
  | '白玉天（青云·下境）'
  | '赤霞天（蓄势·初境）'
  | '凡尘境（待启·未境）'

export type WeeklyMvpAction =
  | '行功一周天'
  | '演法破阵'
  | '悟道'
  | '斩心魔'
  | '天劫试炼'

export type WeeklyReport = {
  subjectId: SubjectId
  weekStart: string // YYYY-MM-DD (Monday)
  weekEnd: string // YYYY-MM-DD (Sunday)

  gongxing: number // 0-100
  pozhen: number // 0-100
  lianxin: number // 0-100
  total: number // 0-100

  tier: WeeklyTier
  mvp: WeeklyMvpAction
  comment: string

  // 周内出现的最高首刷称号（可选）
  bestFirstAttemptTitle?: DrillFirstAttemptTitle
}

