// Cycle phases: period(0-4), follicular(5-11), ovulation(12-13), luteal(14-27)
// Standard 28-day cycle: Period 1-5, Follicular 6-12, Ovulation 13-14, Luteal 15-28

export function calculatePhase(lastPeriodDate, duration = 5) {
  const last = new Date(lastPeriodDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  last.setHours(0, 0, 0, 0)

  const daysSince = Math.floor((today - last) / (1000 * 60 * 60 * 24))
  const cycleDay = daysSince % 28

  if (cycleDay < duration) {
    return { name: 'period', label: '月经期', weather: 'rain', icon: '🌧️' }
  }
  if (cycleDay < 12) {
    return { name: 'follicular', label: '卵泡期', weather: 'dawn', icon: '🌅' }
  }
  if (cycleDay < 14) {
    return { name: 'ovulation', label: '排卵日', weather: 'sunny', icon: '☀️' }
  }
  return { name: 'luteal', label: '黄体期', weather: 'sunset', icon: '🌅' }
}

export function getPhaseConfig(phase) {
  const configs = {
    period: {
      bg: 'from-slate-400 via-slate-500 to-slate-600',
      bgGradient: ['#64748B', '#475569', '#334155'],
      accent: '#F6AD55',
      accentLight: '#FBD38D',
      tip: '由于雌激素和孕激素都处于最低水平，能量较弱，耐力较差。适合进行复核与整理工作。',
      ship: '船入港停泊，港口检修',
      gymTip: '能量低点。避开高强度运动。适合轻柔瑜伽或散步。',
      kitchenTip: '能量耐力差，需摄入足量碳水和脂肪。少咖啡因，拒绝冰镇饮料。',
      emotionTip: '身体的“燃料”暂时耗尽，激素真空期可能导致情绪安静。这是自然的节能模式。',
      reward: ['🍫 可可豆', '🍠 红薯'],
      container: '🪨',
      containerColor: 'bg-slate-700',
    },
    follicular: {
      bg: 'from-amber-200 via-orange-300 to-pink-300',
      bgGradient: ['#FCD34D', '#FB923C', '#F9A8D4'],
      accent: '#FBD38D',
      accentLight: '#FEF3C7',
      tip: '雌激素水平升高，代谢提升，情绪和效率都处于高位。可以安排棘手的任务。',
      ship: '扬帆起航',
      gymTip: '能量耐力大幅提升。适合恢复校园跑，或小重量多次数锻炼。',
      kitchenTip: '代谢旺盛，适合摄入优质蛋白。',
      emotionTip: '雌激素稳步攀升，大脑中的多巴胺分泌随之活跃。这是天然的多巴胺礼包。',
      reward: ['🍋 青柠', '🌿 薄荷', '🍹 莫吉托'],
      container: '🐚',
      containerColor: 'bg-pink-200',
    },
    ovulation: {
      bg: 'from-yellow-300 via-cyan-400 to-blue-500',
      bgGradient: ['#FDE047', '#22D3EE', '#3B82F6'],
      accent: '#F6E05E',
      accentLight: '#FEF9C3',
      tip: '睾酮达到爆发高点，身心能量最强。这是你的高光期！适合深度吸收和整合产出。',
      ship: '全速前进',
      gymTip: '肌肉爆发力最强。可以尝试重型力量训练或游泳。',
      kitchenTip: '减脂增肌的好时候。适当减少饮食剂量，保证蛋白质摄入。',
      emotionTip: '睾酮达到峰值，带来了身心能量的爆发期。感到前所未有的自信和果敢。',
      reward: ['🦐 海鲜', '🐟 鱼类'],
      container: '✨',
      containerColor: 'bg-yellow-200',
    },
    luteal: {
      bg: 'from-orange-400 via-rose-400 to-purple-500',
      bgGradient: ['#FB923C', '#FB7185', '#A855F7'],
      accent: '#ED8936',
      accentLight: '#FED7AA',
      tip: '孕激素增加，能量逐步下降，可能出现"脑雾"。适合完成基础工作。',
      ship: '迷雾巡航，稳住舵盘',
      gymTip: '身体耐力尚可但易疲劳。适合增肌训练，后期配合舒缓慢跑。',
      kitchenTip: '代谢放缓，食欲增加。建议选复杂碳水，清淡饮食，后期减少咖啡因。',
      emotionTip: '雌激素回落，孕激素占据主导。可能出现脑雾、坐立不安或疲劳感。',
      reward: ['🥤 生姜汽水', '🍞 全麦蜜糖吐司'],
      container: '⭐',
      containerColor: 'bg-orange-300',
    },
  }
  return configs[phase] || configs.period
}

export function getCycleDay(lastPeriodDate) {
  const last = new Date(lastPeriodDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  last.setHours(0, 0, 0, 0)

  const daysSince = Math.floor((today - last) / (1000 * 60 * 60 * 24))
  return (daysSince % 28) + 1
}