export type PetId =
  | 'mo-yu-he'
  | 'qing-ling-hu'
  | 'yun-meng-lu'
  | 'xiao-jin-long'
  | 'xuan-gui'
  | 'chi-yan-feng'
  | 'bai-ze'
  | 'lan-jing-ling'
  | 'hei-lin-ya'
  | 'zhi-zhu-xiao'
  | 'shui-yun-yu'
  | 'shan-jian-tu'

export type WeaponId =
  | 'tian-suan-jian'
  | 'mo-yun-jian'
  | 'zhu-yin-dao'
  | 'qing-feng-jian'
  | 'xuan-tie-qiang'
  | 'ji-shu-jian'
  | 'wen-xin-bi'
  | 'wan-yan-shan'
  | 'wu-fa-yin'
  | 'po-zhen-ge'
  | 'xin-jing-deng'
  | 'yu-zhen-ji'

export type Pet = {
  id: PetId
  name: string
  desc: string
}

export type Weapon = {
  id: WeaponId
  name: string
  desc: string
}

export const PETS: Pet[] = [
  { id: 'mo-yu-he', name: '墨羽鹤', desc: '随行不语，见你落笔便点头。' },
  { id: 'qing-ling-hu', name: '青灵狐', desc: '最喜破阵，一节一跃，尾光如丝。' },
  { id: 'yun-meng-lu', name: '云梦鹿', desc: '行功久则心静，踏云而不惊。' },
  { id: 'xiao-jin-long', name: '小金龙', desc: '爱攒锋芒，满则盘空一啸。' },
  { id: 'xuan-gui', name: '玄龟', desc: '斩心魔时最稳，护你不乱。' },
  { id: 'chi-yan-feng', name: '赤焰蜂', desc: '点卯不断，便绕你三匝。' },
  { id: 'bai-ze', name: '白泽', desc: '悟道成诀，它便记于角上。' },
  { id: 'lan-jing-ling', name: '蓝晶灵', desc: '喜收题影，光里有答案。' },
  { id: 'hei-lin-ya', name: '黑鳞鸦', desc: '专嗅薄弱之章，催你去结。' },
  { id: 'zhi-zhu-xiao', name: '纸蛛小', desc: '会把散乱的札记织成网。' },
  { id: 'shui-yun-yu', name: '水云鱼', desc: '随周报涨落，悠然自知。' },
  { id: 'shan-jian-tu', name: '山涧兔', desc: '轻快勤勉，最懂“今日不拖”。' },
]

export const WEAPONS: Weapon[] = [
  { id: 'tian-suan-jian', name: '天算剑', desc: '推演如风，剑走偏锋亦可回正。' },
  { id: 'mo-yun-jian', name: '墨云剑', desc: '墨起一线，断疑成路。' },
  { id: 'zhu-yin-dao', name: '朱印刀', desc: '落印即决，拖延自断。' },
  { id: 'qing-feng-jian', name: '青锋剑', desc: '破阵不怯，越练越利。' },
  { id: 'xuan-tie-qiang', name: '玄铁枪', desc: '重在系统，步步为营。' },
  { id: 'ji-shu-jian', name: '机枢简', desc: '一页一式，章章有据。' },
  { id: 'wen-xin-bi', name: '问心笔', desc: '悟道一诀，胜读十页。' },
  { id: 'wan-yan-shan', name: '万言扇', desc: '开合之间，文意自通。' },
  { id: 'wu-fa-yin', name: '万法印', desc: '随手一盖，诸事归一。' },
  { id: 'po-zhen-ge', name: '破阵戈', desc: '一节一斩，锋芒自生。' },
  { id: 'xin-jing-deng', name: '心镜灯', desc: '照见错因，心魔自退。' },
  { id: 'yu-zhen-ji', name: '御阵玑', desc: '守中见巧，稳中求胜。' },
]

