export const SETTLE_QUOTES = [
  '一章既竟，心火自明。',
  '落印成章，破局在胸。',
  '卷已毕，心魔退。',
  '此章已结，锋芒更进。',
  '墨落无声，功成有迹。',
  '章成一转，路更清。',
]

export function pickSettleQuote(): string {
  const i = Math.floor(Math.random() * SETTLE_QUOTES.length)
  return SETTLE_QUOTES[i] ?? '此章已结。'
}

