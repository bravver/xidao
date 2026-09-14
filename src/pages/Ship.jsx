import { useState, useMemo } from 'react'
import { useCycle } from '../context/CycleContext'
import { getPhaseForDate } from '../utils/cycleCalculator'
import ShipBackground from '../components/ShipBackground'

import shipPeriod from '../assets/ship-period.png'
import shipFollicular from '../assets/ship-follicular.png'
import shipOvulation from '../assets/ship-ovulation.png'
import shipLuteal from '../assets/ship-luteal.png'
import logPeriodImg from '../assets/log-images/1.png'
import logFollicularImg from '../assets/log-images/2.png'
import logOvulationImg from '../assets/log-images/3.png'
import logLutealImg from '../assets/log-images/4.png'
import logCollectionImg from '../assets/素材1，3，5/四个时期的日志/collection.png'

// 情绪封存物图标 — 用于日历格
import pebbleIcon from '../assets/2.4.素材收集/2.2情绪封存物图标/深色鹅卵石.png'
import shellIcon from '../assets/2.4.素材收集/2.2情绪封存物图标/贝壳.png'
import pearlIcon from '../assets/2.4.素材收集/2.2情绪封存物图标/发光珍珠贝.png'
import starfishIcon from '../assets/2.4.素材收集/2.2情绪封存物图标/棱角海星.png'

const STORAGE_KEY = 'xidao_calendar_entries'
const LEGACY_STORAGE_KEY = 'xidao_ship_logs'
const EMOTION_STORAGE_KEY = 'xidao_emotions'

const shipImages = {
  period: shipPeriod, follicular: shipFollicular,
  ovulation: shipOvulation, luteal: shipLuteal,
}

const shipNames = {
  period: '港湾号 · 入港休整', follicular: '晨风号 · 扬帆起航',
  ovulation: '破浪号 · 全速前进', luteal: '夕照号 · 薄雾巡航',
}

const logImages = {
  period: logPeriodImg, follicular: logFollicularImg,
  ovulation: logOvulationImg, luteal: logLutealImg,
}

const phaseTips = {
  period: '雌孕激素降至低谷，身心能量与耐力偏弱，不适合高强度攻坚。适合放慢节奏，专注复盘整理、查漏补缺，不必强行挑战高难度任务。',
  follicular: '雌激素持续上升，代谢、专注力与外向探索感同步提升。适合开启新计划、攻克难题、学习复杂知识，高效推进学业与工作。',
  ovulation: '睾酮达到周期峰值，身心能量、自信与表达能力全面爆发。适合深度思考、创作输出、公开演讲与商务社交，把握高光高效时刻。',
  luteal: '雌激素回落、黄体素占主导，易出现脑雾、专注力下滑、认知负担加重。不用强求创新突破，安稳完成基础工作、做好记录复盘、提前规划即可。',
}

const phaseCalendarColors = {
  period: { bg: '#f1f5f9', accent: '#64748b', dot: '#94a3b8', label: '经期' },
  follicular: { bg: '#fefce8', accent: '#eab308', dot: '#facc15', label: '卵泡期' },
  ovulation: { bg: '#f0f9ff', accent: '#0ea5e9', dot: '#38bdf8', label: '排卵日' },
  luteal: { bg: '#fff7ed', accent: '#f97316', dot: '#fb923c', label: '黄体期' },
}

const emotionTypeIcons = {
  period: pebbleIcon,
  follicular: shellIcon,
  ovulation: pearlIcon,
  luteal: starfishIcon,
}

const emotionLabels = ['平静', '愉悦', '焦虑', '疲惫', '低落', '兴奋', '烦躁', '敏感']

const letterPapers = {
  period: {
    name: '雨中信笺',
    bg: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 30%, #f8fafc 60%, #f1f5f9 100%)',
    accent: '#64748b', accentLight: '#94a3b8', text: '#334155', seal: '#475569',
    sealEmoji: '🌧️', envelopeBg: 'linear-gradient(135deg, #cbd5e1, #94a3b8)',
    envelopeFlap: 'linear-gradient(180deg, #b0bec5, #90a4ae)',
    decoration: '雨滴轻敲窗棂 · 船入港湾休憩', borderStyle: '3px double #cbd5e1',
  },
  follicular: {
    name: '晨光信笺',
    bg: 'linear-gradient(180deg, #fefce8 0%, #fef9c3 30%, #fffbeb 60%, #fefce8 100%)',
    accent: '#eab308', accentLight: '#fde047', text: '#4a3f0a', seal: '#ca8a04',
    sealEmoji: '🌅', envelopeBg: 'linear-gradient(135deg, #fde047, #fbbf24)',
    envelopeFlap: 'linear-gradient(180deg, #fcd34d, #f59e0b)',
    decoration: '晨光洒满海面 · 扬帆起航出发', borderStyle: '3px double #fde047',
  },
  ovulation: {
    name: '碧波信笺',
    bg: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 30%, #f8fafc 60%, #f0f9ff 100%)',
    accent: '#0ea5e9', accentLight: '#7dd3fc', text: '#0c4a6e', seal: '#0284c7',
    sealEmoji: '☀️', envelopeBg: 'linear-gradient(135deg, #7dd3fc, #38bdf8)',
    envelopeFlap: 'linear-gradient(180deg, #38bdf8, #0ea5e9)',
    decoration: '碧波万顷 · 破浪全速前进', borderStyle: '3px double #7dd3fc',
  },
  luteal: {
    name: '夕照信笺',
    bg: 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 30%, #fff8f1 60%, #fff7ed 100%)',
    accent: '#f97316', accentLight: '#fdba74', text: '#4a2508', seal: '#ea580c',
    sealEmoji: '🌅', envelopeBg: 'linear-gradient(135deg, #fdba74, #fb923c)',
    envelopeFlap: 'linear-gradient(180deg, #fb923c, #f97316)',
    decoration: '夕阳染红天边 · 薄雾中徐行', borderStyle: '3px double #fdba74',
  },
}

// === 自动分类：关键词 → 推荐时期 ===
const suggestionRules = [
  { phase: 'period', keywords: ['复习', '复盘', '整理', '检查', '查漏补缺', '回顾', '归档', '校对', '总结', '反思', '梳理', '修正', '阅读', '笔记'] },
  { phase: 'follicular', keywords: ['学习', '创作', '社交', '新项目', '开始', '尝试', '挑战', '创新', '探索', '计划', '设计', '写', '构思', '研究', '头脑风暴', '会议'] },
  { phase: 'ovulation', keywords: ['演讲', '决策', '面试', '发布', '展示', '汇报', '谈判', '比赛', '路演', '答辩', '公开', '主持', '主导', '拍板', '敲定'] },
  { phase: 'luteal', keywords: ['收尾', '记录', '归档', '整理资料', '填表', '报销', '回复邮件', '打扫', '清理', '归位', '交接', '备份', '整理文件', '查漏补缺'] },
]
const phaseLabelMap = { period: '经期', follicular: '卵泡期', ovulation: '排卵日', luteal: '黄体期' }
const phaseIconMap = { period: '🌧️', follicular: '🌅', ovulation: '☀️', luteal: '🌅' }

function suggestPhase(text) {
  const lower = text.toLowerCase()
  for (const rule of suggestionRules) {
    for (const kw of rule.keywords) {
      if (lower.includes(kw)) return rule.phase
    }
  }
  return null
}

// === 工具函数 ===

function formatDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function todayStr() {
  const t = new Date()
  return formatDateStr(t.getFullYear(), t.getMonth(), t.getDate())
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function parseEmotionDate(dateStr) {
  // dateStr format: "5月14日 14:30" from Chinese locale
  const m = dateStr.match(/(\d+)月(\d+)日/)
  if (!m) return null
  const now = new Date()
  return formatDateStr(now.getFullYear(), parseInt(m[1]) - 1, parseInt(m[2]))
}

// 数据迁移：旧 xidao_ship_logs → 新 xidao_calendar_entries
function migrateData() {
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!legacy) return
    const oldLogs = JSON.parse(legacy)
    if (!Array.isArray(oldLogs) || oldLogs.length === 0) return

    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')

    oldLogs.forEach((log) => {
      // 尝试解析旧日期: "2026年5月14日"
      let key = null
      const chineseMatch = log.date?.match(/(\d+)年(\d+)月(\d+)日/)
      if (chineseMatch) {
        key = formatDateStr(parseInt(chineseMatch[1]), parseInt(chineseMatch[2]) - 1, parseInt(chineseMatch[3]))
      }
      if (!key) {
        const isoMatch = log.date?.match(/(\d{4})-(\d{2})-(\d{2})/)
        if (isoMatch) key = log.date
      }
      if (!key) return

      if (!existing[key]) existing[key] = { logs: [], plans: [], emotions: [] }
      if (!existing[key].logs) existing[key].logs = []
      const alreadyMigrated = existing[key].logs.some((l) => l.id === log.id)
      if (!alreadyMigrated) {
        existing[key].logs.push({ id: log.id, text: log.text, time: log.time || '', phase: log.phase })
      }
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch (e) {
    console.error('Migration error:', e)
  }
}

// === 主组件 ===

export default function Ship({ onBack, onOpenLighthouse }) {
  const { cycleData } = useCycle()

  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showDayPanel, setShowDayPanel] = useState(false)
  const [panelTab, setPanelTab] = useState('logs')
  const [newText, setNewText] = useState('')
  const [newImage, setNewImage] = useState(null) // { dataUrl, name }
  const [selectedEnvelope, setSelectedEnvelope] = useState(null)
  const [letterAnimPhase, setLetterAnimPhase] = useState('closed')
  const [selectedCategory, setSelectedCategory] = useState(null)
  // { type: 'logs'|'plans'|'all', phase: 'period'|'follicular'|'ovulation'|'luteal' } | null

  // 初始化：迁移 + 读取数据
  const [calendarEntries, setCalendarEntries] = useState(() => {
    migrateData()
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })

  const [emotionEntries, setEmotionEntries] = useState(() => {
    try {
      const saved = localStorage.getItem(EMOTION_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const saveEntries = (newEntries) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries))
    setCalendarEntries(newEntries)
  }

  const lastPeriod = cycleData?.lastPeriod
  const duration = cycleData?.duration || 5
  const todayPhase = cycleData?.phase?.name || 'follicular'

  const shipImg = shipImages[todayPhase] || shipImages.follicular
  const shipName = shipNames[todayPhase] || shipNames.follicular

  // 构建情绪日期映射
  const emotionByDate = useMemo(() => {
    const map = {}
    emotionEntries.forEach((e) => {
      const d = parseEmotionDate(e.date)
      if (d) {
        if (!map[d]) map[d] = []
        map[d].push(e)
      }
    })
    return map
  }, [emotionEntries])

  // 刷新情绪数据（从 Beach 页面回来时）
  const refreshEmotions = () => {
    try {
      const saved = localStorage.getItem(EMOTION_STORAGE_KEY)
      setEmotionEntries(saved ? JSON.parse(saved) : [])
    } catch { setEmotionEntries([]) }
  }

  // === 日历数据 ===
  const calendarDays = useMemo(() => {
    const days = []
    const totalDays = daysInMonth(viewYear, viewMonth)
    const startDay = firstDayOfMonth(viewYear, viewMonth)
    const todayStrVal = todayStr()

    // 上月尾部填充
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear
    const prevTotalDays = daysInMonth(prevYear, prevMonth)
    for (let i = startDay - 1; i >= 0; i--) {
      const day = prevTotalDays - i
      const dateStr = formatDateStr(prevYear, prevMonth, day)
      const phase = lastPeriod ? getPhaseForDate(lastPeriod, dateStr, duration) : null
      days.push({ dateStr, day, phase, isCurrentMonth: false, isToday: dateStr === todayStrVal })
    }

    // 本月
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = formatDateStr(viewYear, viewMonth, d)
      const phase = lastPeriod ? getPhaseForDate(lastPeriod, dateStr, duration) : null
      days.push({ dateStr, day: d, phase, isCurrentMonth: true, isToday: dateStr === todayStrVal })
    }

    // 下月头部填充 — 补满最后一行
    const remaining = (7 - (days.length % 7)) % 7
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear
    for (let d = 1; d <= remaining; d++) {
      const dateStr = formatDateStr(nextYear, nextMonth, d)
      const phase = lastPeriod ? getPhaseForDate(lastPeriod, dateStr, duration) : null
      days.push({ dateStr, day: d, phase, isCurrentMonth: false, isToday: dateStr === todayStrVal })
    }

    return days
  }, [viewYear, viewMonth, lastPeriod, duration])

  // 聚合所有条目：按类型+时期分组
  const aggregatedEntries = useMemo(() => {
    const result = {
      logs: { period: [], follicular: [], ovulation: [], luteal: [] },
      plans: { period: [], follicular: [], ovulation: [], luteal: [] },
    }
    Object.entries(calendarEntries).forEach(([dateStr, dayData]) => {
      ;(dayData.logs || []).forEach(entry => {
        const phase = entry.phase || 'follicular'
        if (result.logs[phase]) result.logs[phase].push({ ...entry, date: dateStr })
      })
      ;(dayData.plans || []).forEach(entry => {
        const phase = entry.phase || 'follicular'
        if (result.plans[phase]) result.plans[phase].push({ ...entry, date: dateStr })
      })
    })
    return result
  }, [calendarEntries])

  const isPastDate = (dateStr) => dateStr < todayStr()
  const isFutureDate = (dateStr) => dateStr > todayStr()

  // === 操作 ===

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1) }
    else setViewMonth(viewMonth - 1)
  }

  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1) }
    else setViewMonth(viewMonth + 1)
  }

  const openDate = (dateStr) => {
    refreshEmotions()
    setSelectedDate(dateStr)
    setShowDayPanel(true)
    setPanelTab('logs')
    setNewText('')
    setNewImage(null)
  }

  const closePanel = () => {
    setShowDayPanel(false)
    setSelectedDate(null)
    setNewText('')
    setNewImage(null)
  }

  const handleAddEntry = () => {
    if (!newText.trim() || !selectedDate) return
    const datePhase = lastPeriod
      ? (getPhaseForDate(lastPeriod, selectedDate, duration)?.name || 'follicular')
      : 'follicular'

    const entry = {
      id: Date.now(),
      text: newText.trim(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      phase: datePhase,
    }

    // 对计划条目做自动分类
    if (panelTab === 'plans') {
      const suggested = suggestPhase(newText.trim())
      if (suggested && suggested !== datePhase) {
        entry.suggestedPhase = suggested
      }
    }

    // 附带图片
    if (newImage) {
      entry.image = newImage.dataUrl
    }

    const key = panelTab === 'logs' ? 'logs' : 'plans'
    const updated = { ...calendarEntries }
    if (!updated[selectedDate]) updated[selectedDate] = { logs: [], plans: [], emotions: [] }
    if (!updated[selectedDate][key]) updated[selectedDate][key] = []
    updated[selectedDate][key] = [entry, ...updated[selectedDate][key]]
    saveEntries(updated)
    setNewText('')
    setNewImage(null)
  }

  const handleImagePick = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxW = 600
        const scale = Math.min(1, maxW / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        setNewImage({ dataUrl: canvas.toDataURL('image/jpeg', 0.7), name: file.name })
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => setNewImage(null)

  const openEnvelope = (entry) => {
    setSelectedEnvelope(entry)
    setLetterAnimPhase('closed')
    setTimeout(() => setLetterAnimPhase('opening'), 50)
    setTimeout(() => setLetterAnimPhase('open'), 600)
  }

  const closeEnvelope = () => {
    setLetterAnimPhase('closing')
    setTimeout(() => { setSelectedEnvelope(null); setLetterAnimPhase('closed') }, 400)
  }

  // === 日详情面板中的条目 ===
  const selectedEntries = selectedDate ? (calendarEntries[selectedDate] || { logs: [], plans: [] }) : { logs: [], plans: [] }
  const selectedEmotions = selectedDate ? (emotionByDate[selectedDate] || []) : []
  const selectedDatePhase = selectedDate && lastPeriod
    ? (getPhaseForDate(lastPeriod, selectedDate, duration)?.name || 'follicular')
    : 'follicular'
  const writingPaper = letterPapers[selectedDatePhase] || letterPapers.follicular
  const selPhaseColors = phaseCalendarColors[selectedDatePhase] || phaseCalendarColors.follicular
  const displayEntries = panelTab === 'logs' ? (selectedEntries.logs || []) : (selectedEntries.plans || [])

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

  // === 渲染 ===
  return (
    <>
      <ShipBackground phase={todayPhase} />

      <div style={{ minHeight: '100vh', padding: '1rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem', animation: 'fadeInUp 0.5s ease-out' }}>
          <button onClick={onBack} className="btn-elegant" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '1rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', transition: 'all 0.25s ease' }}>
            🏠 主页
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', flex: 1, color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.12)', letterSpacing: '0.04em' }}>
            航海日志
          </h1>
          <button
            onClick={() => onOpenLighthouse?.('analysis')}
            title="AI 分析日志"
            style={{
              width: '2.75rem', height: '2.75rem', borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: '1.1rem',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.28)'
              e.currentTarget.style.transform = 'scale(1.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >✨</button>
        </div>

        {/* 时期提示语 */}
        <p style={{
          textAlign: 'center', color: 'rgba(255,255,255,0.9)',
          fontSize: '0.92rem', fontWeight: 500, lineHeight: 1.55, marginBottom: '0.6rem',
          padding: '0 0.5rem', animation: 'fadeInUp 0.5s ease-out 0.05s both',
          textShadow: '0 1px 6px rgba(0,0,0,0.2)',
        }}>
          {phaseTips[todayPhase]}
        </p>

        {/* === 时期日志封面（书脊装饰） === */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '0.65rem',
          marginBottom: '0.5rem',
          animation: 'fadeInUp 0.5s ease-out 0.1s both',
        }}>
          {['period', 'follicular', 'ovulation', 'luteal'].map(phase => {
            const logCount = (aggregatedEntries.logs[phase] || []).length
            const planCount = (aggregatedEntries.plans[phase] || []).length
            const totalCount = logCount + planCount
            const isSelected = selectedCategory?.phase === phase
            const paper = letterPapers[phase] || letterPapers.follicular
            return (
              <div
                key={'cover-' + phase}
                onClick={() => setSelectedCategory(isSelected ? null : { type: 'all', phase })}
                className="btn-elegant"
                title={`${phaseLabelMap[phase]}: ${logCount}日志 ${planCount}计划`}
                style={{
                  position: 'relative', cursor: 'pointer',
                  borderRadius: '0.35rem',
                  overflow: 'hidden',
                  width: '4.2rem', height: '6.5rem',
                  border: isSelected ? `2px solid ${paper.accent}` : '2px solid rgba(255,255,255,0.25)',
                  opacity: totalCount > 0 ? 1 : 0.55,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  flexShrink: 0,
                }}
              >
                <img src={logImages[phase]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {totalCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '3px', right: '3px',
                    background: paper.accent, color: 'white',
                    fontSize: '0.55rem', fontWeight: 700,
                    minWidth: '1rem', height: '1rem',
                    borderRadius: '9999px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}>{totalCount}</span>
                )}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(0,0,0,0.45)',
                  padding: '0.15rem 0.25rem',
                  textAlign: 'center',
                }}>
                  <span style={{ color: 'white', fontSize: '0.45rem', fontWeight: 600 }}>
                    {phaseIconMap[phase]} {phaseLabelMap[phase]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* === 船只居中 === */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          marginBottom: '0.35rem',
          animation: 'fadeInUp 0.5s ease-out 0.15s both',
        }}>
          <img src={shipImg} alt={shipName} style={{ width: '9rem', height: 'auto', maxHeight: '11rem', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.2))', animation: 'shipFloat 4s ease-in-out infinite' }} />
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 600, marginTop: '0.15rem', textShadow: '0 1px 4px rgba(0,0,0,0.15)', textAlign: 'center', lineHeight: 1.2 }}>
            {shipName}
          </p>
        </div>

        {/* === 分类条目面板 === */}
        {selectedCategory && (() => {
          const { type, phase } = selectedCategory
          const paper = letterPapers[phase] || letterPapers.follicular
          const logEntries = aggregatedEntries.logs[phase] || []
          const planEntries = aggregatedEntries.plans[phase] || []
          const allEntries = type === 'all'
            ? [
                ...logEntries.map(e => ({ ...e, entryType: 'log' })),
                ...planEntries.map(e => ({ ...e, entryType: 'plan' })),
              ].sort((a, b) => (b.id || 0) - (a.id || 0))
            : (aggregatedEntries[type][phase] || [])
          const catLabel = type === 'all' ? '日志与计划' : (type === 'logs' ? '日志' : '计划')
          return (
            <div style={{
              background: 'rgba(255,255,255,0.94)', borderRadius: '1rem',
              padding: '0.65rem', marginBottom: '0.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: `1px solid ${paper.accent}40`,
              animation: 'fadeInUp 0.25s ease-out',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: paper.accent, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {paper.sealEmoji} {phaseLabelMap[phase]} · {catLabel}
                  {allEntries.length > 0 && <span style={{ fontSize: '0.65rem', fontWeight: 500, color: paper.accentLight }}>({allEntries.length})</span>}
                </span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.7rem', color: '#6b7280' }}
                >✕</button>
              </div>
              {allEntries.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', textAlign: 'center', padding: '0.75rem 0' }}>
                  暂无{phaseLabelMap[phase]}的记录
                </p>
              ) : (
                <div
                  className="history-scroll-list"
                  style={{
                    maxHeight: 'min(30vh, 300px)',
                    overflowY: 'auto',
                    overscrollBehavior: 'contain',
                    WebkitOverflowScrolling: 'touch',
                    paddingRight: '0.25rem',
                    borderRadius: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {allEntries.map((entry, idx) => {
                      const entryPaper = letterPapers[entry.phase] || letterPapers.follicular
                      const isPlan = entry.entryType === 'plan'
                      return (
                        <div
                          key={entry.id + (entry.entryType || '')}
                          onClick={() => { setSelectedCategory(null); openEnvelope(entry) }}
                          className="module-card"
                          style={{
                            background: entryPaper.envelopeBg,
                            borderRadius: '0.6rem', padding: '0.4rem 0.65rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            flexShrink: 0,
                          }}
                        >
                          <span style={{ fontSize: '0.8rem' }}>{isPlan ? '📋' : entryPaper.sealEmoji}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: '0.7rem', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {entry.text.slice(0, 30)}{entry.text.length > 30 ? '…' : ''}
                            </p>
                            <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>
                              {entry.date ? `${entry.date.split('-')[1]}月${parseInt(entry.date.split('-')[2])}日` : ''} {entry.time || ''} {isPlan ? '· 计划' : ''}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.6rem', color: entryPaper.accentLight }}>拆开 ›</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })()}

        {/* === 日历（缩小版） === */}
        <div style={{ background: 'rgba(255,255,255,0.94)', borderRadius: '1.25rem', padding: '0.4rem 0.35rem', boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', border: '1px solid rgba(255,255,255,0.5)', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
          {/* 月份导航 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem', padding: '0 0.2rem' }}>
            <button onClick={goPrevMonth} className="btn-elegant" style={{ background: 'transparent', border: 'none', fontSize: '0.85rem', cursor: 'pointer', color: '#64748b', padding: '0.1rem 0.25rem' }}>◀</button>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1f2937' }}>{viewYear}年 {monthNames[viewMonth]}</span>
            <button onClick={goNextMonth} className="btn-elegant" style={{ background: 'transparent', border: 'none', fontSize: '0.85rem', cursor: 'pointer', color: '#64748b', padding: '0.1rem 0.25rem' }}>▶</button>
          </div>

          {/* 图例 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.25rem', flexWrap: 'wrap', fontSize: '0.6rem' }}>
            {Object.entries(phaseCalendarColors).map(([key, c]) => (
              <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.1rem', color: '#6b7280' }}>
                <span style={{ width: '0.35rem', height: '0.35rem', borderRadius: '2px', background: c.bg, border: `1px solid ${c.accent}40` }} />
                {c.label}
              </span>
            ))}
          </div>

          {/* 星期头 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.15rem' }}>
            {weekDays.map((w, i) => (
              <div key={w} style={{ fontSize: '0.65rem', fontWeight: 600, color: i === 0 || i === 6 ? '#94a3b8' : '#64748b', padding: '0.1rem 0' }}>{w}</div>
            ))}
          </div>

          {/* 日期网格 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', textAlign: 'center' }}>
            {calendarDays.map((d) => {
              const phaseColor = d.phase ? phaseCalendarColors[d.phase.name] : null
              const dayEntries = calendarEntries[d.dateStr] || { logs: [], plans: [] }
              const dayEmotions = emotionByDate[d.dateStr] || []
              const hasLogs = (dayEntries.logs || []).length > 0
              const hasPlans = (dayEntries.plans || []).length > 0
              const hasEmotions = dayEmotions.length > 0
              const hasContent = hasLogs || hasPlans || hasEmotions
              const isFuture = isFutureDate(d.dateStr)

              return (
                <div
                  key={d.dateStr}
                  onClick={() => openDate(d.dateStr)}
                  className="btn-elegant"
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: '0.35rem',
                    background: phaseColor ? phaseColor.bg : '#fafafa',
                    border: d.isToday
                      ? `1.5px solid ${phaseColor?.accent || '#0891b2'}`
                      : isFuture
                      ? '1px dashed rgba(0,0,0,0.12)'
                      : '1px solid transparent',
                    opacity: d.isCurrentMonth ? 1 : 0.35,
                    transition: 'all 0.15s ease',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.08)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: d.isToday ? 700 : 500,
                    color: d.isToday
                      ? (phaseColor?.accent || '#0891b2')
                      : (d.isCurrentMonth ? '#374151' : '#9ca3af'),
                  }}>
                    {d.day}
                  </span>
                  {hasContent ? (
                    <div style={{ display: 'flex', gap: '1px', marginTop: '0.5px', alignItems: 'center' }}>
                      {hasLogs && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: phaseColor?.dot || '#94a3b8' }} />}
                      {hasPlans && <span style={{ width: '4px', height: '4px', borderRadius: '1px', background: phaseColor?.accent || '#64748b' }} />}
                      {hasEmotions && d.phase && emotionTypeIcons[d.phase.name] && (
                        <img src={emotionTypeIcons[d.phase.name]} alt="" style={{ width: '7px', height: '7px', objectFit: 'contain' }} />
                      )}
                    </div>
                  ) : <div style={{ height: '4px' }} />}
                </div>
              )
            })}
          </div>

          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.6rem', marginTop: '0.4rem' }}>
            📮 点击日期查看或添加记录 · 虚线为未来日期可做计划
          </p>
        </div>
      </div>

      {/* ======== 日详情面板（底部抽屉） ======== */}
      {showDayPanel && selectedDate && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end' }}>
          {/* 遮罩 */}
          <div onClick={closePanel} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />

          {/* 面板 */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '30rem',
            margin: '0 auto',
            maxHeight: '80vh',
            background: 'white',
            borderRadius: '1.5rem 1.5rem 0 0',
            padding: '0 1.25rem 1.5rem',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeInUp 0.3s ease-out',
          }}>
            {/* 拖拽条 */}
            <div style={{ width: '2.5rem', height: '4px', background: '#e5e7eb', borderRadius: '2px', margin: '0.75rem auto' }} />

            {/* 头部 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* 日志本封面 */}
                {logImages[selectedDatePhase] && (
                  <img
                    src={logImages[selectedDatePhase]}
                    alt=""
                    style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  />
                )}
                <div>
                  <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', display: 'block' }}>
                    {selectedDate.split('-')[1]}月{parseInt(selectedDate.split('-')[2])}日
                  </span>
                  {selectedDatePhase && (
                    <span style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.5rem',
                      borderRadius: '9999px',
                      background: selPhaseColors.bg,
                      color: selPhaseColors.accent,
                      fontWeight: 600,
                      display: 'inline-block',
                      marginTop: '2px',
                    }}>
                      {phaseCalendarColors[selectedDatePhase]?.label}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={closePanel} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.875rem', color: '#6b7280' }}>✕</button>
            </div>

            {/* 情绪标签展示 */}
            {selectedEmotions.length > 0 && (
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.75rem', padding: '0.5rem 0.75rem', background: '#faf5ff', borderRadius: '0.75rem' }}>
                {selectedEmotions.map((em, i) => (
                  <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', background: 'white', padding: '0.2rem 0.6rem', borderRadius: '9999px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                    {em.labels.join(' · ')}
                    {em.note && <span style={{ color: '#9ca3af', fontSize: '0.65rem' }}>"{em.note.slice(0, 15)}{em.note.length > 15 ? '…' : ''}"</span>}
                  </span>
                ))}
              </div>
            )}

            {/* 日志/计划 标签切换 */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                onClick={() => setPanelTab('logs')}
                className="btn-elegant"
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '0.75rem', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  background: panelTab === 'logs' ? selPhaseColors.accent : '#f3f4f6',
                  color: panelTab === 'logs' ? 'white' : '#6b7280',
                }}
              >
                📝 日志 {selectedEntries.logs?.length > 0 && `(${selectedEntries.logs.length})`}
              </button>
              <button
                onClick={() => setPanelTab('plans')}
                className="btn-elegant"
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '0.75rem', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                  background: panelTab === 'plans' ? selPhaseColors.accent : '#f3f4f6',
                  color: panelTab === 'plans' ? 'white' : '#6b7280',
                }}
              >
                📋 计划 {selectedEntries.plans?.length > 0 && `(${selectedEntries.plans.length})`}
              </button>
            </div>

            {/* 写作区 */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{
                background: writingPaper.bg,
                borderRadius: '0.75rem',
                padding: '0.75rem',
                border: writingPaper.borderStyle,
                position: 'relative',
              }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', left: '0.75rem', right: '0.75rem', top: `${1.2 + i * 1.4}rem`, height: '1px', background: `${writingPaper.accentLight}50` }} />
                ))}
                <textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder={panelTab === 'logs' ? '记录今天的工作或想法...' : '为这天安排一个计划，系统会智能推荐最合适的时期...'}
                  style={{
                    width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.9rem',
                    fontFamily: '"Georgia", "Noto Serif SC", serif', resize: 'none', outline: 'none',
                    background: 'rgba(255,255,255,0.4)', lineHeight: 1.7, minHeight: '5rem',
                    position: 'relative', zIndex: 1, color: writingPaper.text,
                  }}
                  rows={3}
                />

                {/* 图片预览 */}
                {newImage && (
                  <div style={{ position: 'relative', zIndex: 2, marginTop: '0.5rem', display: 'inline-block' }}>
                    <img
                      src={newImage.dataUrl}
                      alt="预览"
                      style={{ maxWidth: '10rem', maxHeight: '8rem', objectFit: 'cover', borderRadius: '0.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                    <button
                      onClick={removeImage}
                      style={{
                        position: 'absolute', top: '-6px', right: '-6px',
                        width: '1.5rem', height: '1.5rem', borderRadius: '50%',
                        background: '#ef4444', color: 'white', border: 'none',
                        fontSize: '0.75rem', cursor: 'pointer', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      }}
                    >✕</button>
                  </div>
                )}

                {/* 图片选择按钮 */}
                <div style={{ position: 'relative', zIndex: 2, marginTop: '0.5rem' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagePick}
                    style={{ display: 'none' }}
                    id={`image-picker-${selectedDate}`}
                  />
                  <label
                    htmlFor={`image-picker-${selectedDate}`}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.35rem 0.75rem', borderRadius: '9999px',
                      background: 'rgba(255,255,255,0.7)', border: `1px dashed ${writingPaper.accentLight}`,
                      fontSize: '0.75rem', color: writingPaper.accent,
                      cursor: 'pointer', fontWeight: 500,
                    }}
                  >
                    📷 添加照片
                  </label>
                </div>
              </div>
              <button
                onClick={handleAddEntry}
                disabled={!newText.trim()}
                className="btn-elegant"
                style={{
                  width: '100%', marginTop: '0.5rem', padding: '0.65rem',
                  borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: newText.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                  background: newText.trim()
                    ? `linear-gradient(135deg, ${selPhaseColors.accent}, ${selPhaseColors.accent}dd)`
                    : '#e5e7eb',
                  color: newText.trim() ? 'white' : '#9ca3af',
                }}
              >
                ✉️ {panelTab === 'logs' ? '封存这封信' : '添加到计划'}
              </button>
            </div>

            {/* 条目列表 */}
            <div
              className="history-scroll-list"
              style={{
                overflowY: 'auto',
                maxHeight: 'min(40vh, 360px)',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                paddingRight: '0.5rem',
                borderRadius: '0.75rem',
              }}
            >
              {displayEntries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <img
                    src={logCollectionImg}
                    alt="空状态"
                    style={{ width: '6rem', height: 'auto', objectFit: 'contain', margin: '0 auto 0.5rem', borderRadius: '0.75rem', opacity: 0.7 }}
                  />
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                    {panelTab === 'logs' ? '这天还没有日志，写一封吧' : '这天还没有计划，安排一下吧'}
                  </p>
                </div>
              ) : (
                displayEntries.map((entry, idx) => {
                    const entryPhase = entry.phase || 'follicular'
                    const entryPaper = letterPapers[entryPhase] || letterPapers.follicular
                    const hasSuggestion = entry.suggestedPhase && entry.suggestedPhase !== entryPhase
                    const sugColors = hasSuggestion ? (phaseCalendarColors[entry.suggestedPhase] || phaseCalendarColors.follicular) : null
                    return (
                      <div
                        key={entry.id}
                        onClick={() => openEnvelope(entry)}
                        className="module-card"
                        style={{
                          background: entryPaper.envelopeBg,
                          borderRadius: '0.75rem',
                          padding: '0.65rem 0.85rem',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          position: 'relative',
                          flexShrink: 0,
                          marginBottom: idx < displayEntries.length - 1 ? '0.5rem' : 0,
                        }}
                      >
                        <span style={{ fontSize: '1.25rem' }}>{entryPaper.sealEmoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '0.8rem', color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {entry.text.slice(0, 40)}{entry.text.length > 40 ? '…' : ''}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                            {entry.time && <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>{entry.time}</span>}
                            {entry.image && <span style={{ fontSize: '0.65rem', color: '#9ca3af' }}>📷</span>}
                            {hasSuggestion && (
                              <span style={{
                                fontSize: '0.6rem',
                                padding: '0.1rem 0.4rem',
                                borderRadius: '9999px',
                                background: sugColors.bg,
                                color: sugColors.accent,
                                fontWeight: 600,
                                border: `1px solid ${sugColors.accent}40`,
                              }}>
                                💡 建议{phaseLabelMap[entry.suggestedPhase]}
                              </span>
                            )}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: entryPaper.accentLight }}>拆开 ›</span>
                      </div>
                    )
                  })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======== 信封弹窗 ======== */}
      {selectedEnvelope && (() => {
        const envPhase = selectedEnvelope.phase || 'follicular'
        const paper = letterPapers[envPhase] || letterPapers.follicular
        const textLen = selectedEnvelope.text ? selectedEnvelope.text.length : 0
        const ruledCount = Math.max(10, Math.ceil(textLen / 12) + 6)
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div onClick={closeEnvelope} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', transition: 'opacity 0.35s ease', opacity: letterAnimPhase === 'closing' ? 0 : 1 }} />
            <div style={{
              position: 'relative', width: '100%', maxWidth: '24rem', maxHeight: '90vh',
              display: 'flex', flexDirection: 'column',
              borderRadius: '1.5rem', background: paper.envelopeBg,
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              transform: letterAnimPhase === 'open' || letterAnimPhase === 'opening' ? 'scale(1) translateY(0)' : letterAnimPhase === 'closing' ? 'scale(0.85) translateY(40px)' : 'scale(0.7) translateY(60px)',
              opacity: letterAnimPhase === 'closing' ? 0 : 1,
              transition: letterAnimPhase === 'opening' ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease' : 'transform 0.35s ease-in, opacity 0.3s ease',
            }}>
              {/* 信封封盖 (absolute overlay) */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%', background: paper.envelopeFlap, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', transformOrigin: 'top center', transform: (letterAnimPhase === 'open' || letterAnimPhase === 'closing') ? 'rotateX(180deg)' : 'rotateX(0deg)', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
              {/* 信封底色 (absolute, behind everything) */}
              <div style={{ position: 'absolute', inset: 0, background: paper.envelopeBg, zIndex: 1 }} />

              {/* 信纸内容区（可滚动） */}
              <div style={{
                flex: 1, minHeight: 0,
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                position: 'relative', zIndex: 3,
                margin: '3rem 1.25rem 0',
                background: paper.bg, borderRadius: '0.5rem',
                padding: '1.75rem 1.25rem 1.5rem',
                border: paper.borderStyle,
                transform: letterAnimPhase === 'open' ? 'translateY(0)' : 'translateY(40px)',
                opacity: letterAnimPhase === 'open' ? 1 : 0,
                transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, opacity 0.35s ease 0.2s',
                boxShadow: `0 2px 12px ${paper.accent}20`,
              }}>
                {/* 标题区 */}
                <div style={{ textAlign: 'center', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: `1px solid ${paper.accentLight}50` }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{paper.sealEmoji}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: paper.accent, letterSpacing: '0.08em' }}>{paper.name}</div>
                </div>
                {/* 日期时间 */}
                {selectedEnvelope.time && (
                  <div style={{ fontSize: '0.7rem', color: paper.accentLight, marginBottom: '1rem', fontStyle: 'italic', fontFamily: '"Georgia", serif', textAlign: 'right' }}>
                    {selectedDate} · {selectedEnvelope.time}
                  </div>
                )}
                {/* 横线纸纹 */}
                {[...Array(ruledCount)].map((_, i) => (
                  <div key={i} style={{ position: 'absolute', left: '1.5rem', right: '1.5rem', top: `${6.5 + i * 2.5}rem`, height: '1px', background: `${paper.accentLight}30` }} />
                ))}
                {/* 正文 */}
                <div style={{ fontFamily: '"Georgia", "Noto Serif SC", "STKaiti", "KaiTi", serif', fontSize: '1rem', lineHeight: 2.5, color: paper.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '10rem', position: 'relative', zIndex: 1 }}>
                  {selectedEnvelope.text}
                </div>
                {/* 图片 */}
                {selectedEnvelope.image && (
                  <div style={{ position: 'relative', zIndex: 2, marginTop: '0.75rem', textAlign: 'center' }}>
                    <img
                      src={selectedEnvelope.image}
                      alt="附照"
                      style={{ maxWidth: '100%', maxHeight: '14rem', objectFit: 'contain', borderRadius: '0.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
                    />
                  </div>
                )}
                {/* 底部签名 */}
                <div style={{ marginTop: '1.5rem', paddingTop: '0.75rem', borderTop: `1px solid ${paper.accentLight}30`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: paper.accentLight }}>
                  <span>✧ 来自 {envPhase === 'period' ? '经期' : envPhase === 'follicular' ? '卵泡期' : envPhase === 'ovulation' ? '排卵日' : '黄体期'}的信</span>
                  <span>{paper.decoration}</span>
                </div>
              </div>

              {/* 合上按钮（固定在信封底部） */}
              <div style={{
                position: 'relative', zIndex: 10,
                display: 'flex', justifyContent: 'center',
                padding: '0.5rem 0 0.75rem',
                opacity: letterAnimPhase === 'open' ? 1 : 0,
                transition: 'opacity 0.3s ease 0.45s',
              }}>
                <button onClick={closeEnvelope} style={{
                  background: 'rgba(255,255,255,0.9)', border: `1px solid ${paper.accent}30`,
                  borderRadius: '9999px', padding: '0.5rem 1.5rem',
                  fontSize: '0.8rem', fontWeight: 600, color: paper.accent,
                  cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)'; }}
                >
                  ✕ 合上信封
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </>
  )
}
