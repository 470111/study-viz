import type { Cs408ChapterId } from '../domain/types'

export type Cs408Book = '数据结构' | '计组' | '操作系统' | '计网'

export const CS408_CHAPTERS: { id: Cs408ChapterId; book: Cs408Book; name: string }[] = [
  // 数据结构（严蔚敏体系）
  { id: 'ds-1', book: '数据结构', name: '绪论' },
  { id: 'ds-2', book: '数据结构', name: '线性表' },
  { id: 'ds-3', book: '数据结构', name: '栈与队列' },
  { id: 'ds-4', book: '数据结构', name: '串·数组·广义表' },
  { id: 'ds-5', book: '数据结构', name: '树与二叉树' },
  { id: 'ds-6', book: '数据结构', name: '图' },
  { id: 'ds-7', book: '数据结构', name: '查找' },
  { id: 'ds-8', book: '数据结构', name: '排序' },

  // 计算机组成原理（按 408 常用考点块组织）
  { id: 'coa-1', book: '计组', name: '系统概述与性能' },
  { id: 'coa-2', book: '计组', name: '数据表示与运算' },
  { id: 'coa-3', book: '计组', name: '存储系统' },
  { id: 'coa-4', book: '计组', name: '指令系统' },
  { id: 'coa-5', book: '计组', name: 'CPU 与流水' },
  { id: 'coa-6', book: '计组', name: '总线' },
  { id: 'coa-7', book: '计组', name: 'I/O 系统' },

  // 操作系统（汤小丹/汤子瀛体系，按 408 高频组织）
  { id: 'os-1', book: '操作系统', name: '引论与运行环境' },
  { id: 'os-2', book: '操作系统', name: '进程与线程' },
  { id: 'os-3', book: '操作系统', name: '调度与死锁' },
  { id: 'os-4', book: '操作系统', name: '内存管理' },
  { id: 'os-5', book: '操作系统', name: '虚拟内存' },
  { id: 'os-6', book: '操作系统', name: '文件系统' },
  { id: 'os-7', book: '操作系统', name: '磁盘管理' },
  { id: 'os-8', book: '操作系统', name: 'I/O 管理' },

  // 计算机网络（谢希仁体系）
  { id: 'cn-1', book: '计网', name: '概述与体系结构' },
  { id: 'cn-2', book: '计网', name: '物理层' },
  { id: 'cn-3', book: '计网', name: '数据链路层' },
  { id: 'cn-4', book: '计网', name: '网络层' },
  { id: 'cn-5', book: '计网', name: '传输层' },
  { id: 'cn-6', book: '计网', name: '应用层' },
]

