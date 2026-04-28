import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'

dayjs.extend(isoWeek)
dayjs.extend(utc)

export function todayYmd(): string {
  return dayjs().format('YYYY-MM-DD')
}

export function weekStartYmd(d: dayjs.Dayjs = dayjs()): string {
  return d.isoWeekday(1).format('YYYY-MM-DD')
}

export function weekEndYmd(d: dayjs.Dayjs = dayjs()): string {
  return d.isoWeekday(7).format('YYYY-MM-DD')
}

export function isBetweenYmd(dateYmd: string, startYmd: string, endYmd: string): boolean {
  const d = dayjs(dateYmd, 'YYYY-MM-DD')
  const s = dayjs(startYmd, 'YYYY-MM-DD')
  const e = dayjs(endYmd, 'YYYY-MM-DD')
  return (d.isSame(s) || d.isAfter(s)) && (d.isSame(e) || d.isBefore(e))
}

export function nowIso(): string {
  return dayjs().toISOString()
}

export function minutesBetween(startIso: string, endIso: string): number {
  const s = dayjs(startIso)
  const e = dayjs(endIso)
  const diff = e.diff(s, 'minute', true)
  return Math.max(0, Math.round(diff))
}

