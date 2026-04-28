import type { MathChapterId } from '../domain/types'

export const MATH_CHAPTERS: { id: MathChapterId; name: string }[] = [
  { id: 'lim', name: '极限' },
  { id: 'diff', name: '微分' },
  { id: 'integ', name: '积分' },
  { id: 'mdiff', name: '多元微分' },
  { id: 'doubleInteg', name: '二重积分' },
  { id: 'ode', name: '微分方程' },
  { id: 'la-1', name: '线代·一' },
  { id: 'la-2', name: '线代·二' },
  { id: 'la-3', name: '线代·三' },
]

