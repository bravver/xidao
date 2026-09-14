import { useState, useEffect, useRef } from 'react'
import { useCycle } from '../context/CycleContext'
import GymBackground from '../components/GymBackground'
import meditationInhale from '../assets/素材1，3，5/冥想吸气.png'
import meditationExhale from '../assets/素材1，3，5/冥想呼气.png'
import coach from '../assets/素材1，3，5/角色正面.png'
import deadliftGuide from '../assets/素材1，3，5/罗马尼亚教学.png'
import lateralRaiseGuide from '../assets/素材1，3，5/哑铃侧平举教学.png'
import oceanShallow from '../assets/素材1，3，5/浮潜/海底世界（浅）.png'
import oceanDeep from '../assets/素材1，3，5/浮潜/海底世界(深）.png'
import yogaMat from '../assets/素材1，3，5/瑜伽垫.png'
import dumbbellImg from '../assets/素材1，3，5/哑铃.png'
import runIcon from '../assets/run.png'

// 分解动作帧 — 罗马尼亚硬拉 (3帧)
import deadliftFrame1 from '../assets/frames/romanian-deadlift/frame-1.png'
import deadliftFrame2 from '../assets/frames/romanian-deadlift/frame-2.png'
import deadliftFrame3 from '../assets/frames/romanian-deadlift/frame-3.png'

// 分解动作帧 — 哑铃侧平举 (3帧)
import lateralRaiseFrame1 from '../assets/frames/lateral-raise/frame-1.png'
import lateralRaiseFrame2 from '../assets/frames/lateral-raise/frame-2.png'
import lateralRaiseFrame3 from '../assets/frames/lateral-raise/frame-3.png'

// 分解动作帧 — 游泳 (4帧)
import swimFrame1 from '../assets/frames/swim/frame-1.png'
import swimFrame2 from '../assets/frames/swim/frame-2.png'
import swimFrame3 from '../assets/frames/swim/frame-3.png'
import swimFrame4 from '../assets/frames/swim/frame-4.png'

// 分解动作帧 — 慢跑 (2帧)
import runFrame1 from '../assets/frames/run/frame-1.png'
import runFrame2 from '../assets/frames/run/frame-2.png'

// 分解动作帧 — 跪姿俯卧撑 (2帧)
import kneelingPushupFrame1 from '../assets/frames/kneeling-pushup/frame-1.png'
import kneelingPushupFrame2 from '../assets/frames/kneeling-pushup/frame-2.png'

// 分解动作帧 — 俯身飞鸟 (2帧)
import bentOverFlyFrame1 from '../assets/frames/bent-over-fly/frame-1.png'
import bentOverFlyFrame2 from '../assets/frames/bent-over-fly/frame-2.png'

// 分解动作帧 — 臀推 (2帧)
import hipThrustFrame1 from '../assets/frames/hip-thrust/frame-1.png'
import hipThrustFrame2 from '../assets/frames/hip-thrust/frame-2.png'

const deadliftFrames = [deadliftFrame1, deadliftFrame2, deadliftFrame3]
const lateralRaiseFrames = [lateralRaiseFrame1, lateralRaiseFrame2, lateralRaiseFrame3]
const swimFrames = [swimFrame1, swimFrame2, swimFrame3, swimFrame4]
const runFrames = [runFrame1, runFrame2]
const kneelingPushupFrames = [kneelingPushupFrame1, kneelingPushupFrame2]
const bentOverFlyFrames = [bentOverFlyFrame1, bentOverFlyFrame2]
const hipThrustFrames = [hipThrustFrame1, hipThrustFrame2]

const STORAGE_KEY = 'xidao_gym_rewards'
const CUSTOM_EXERCISES_KEY = 'xidao_gym_custom_exercises'

const exercises = {
  period: [{ name: '冥想', icon: meditationInhale, description: '在软垫上静坐呼吸', reward: '🍫 可可豆', type: 'tap' }],
  follicular: [
    { name: '罗马尼亚硬拉', icon: deadliftFrame1, frames: deadliftFrames, frameMs: 500, teaching: deadliftGuide, description: '双手持哑铃向下，保持背部挺直', reward: '🍋 青柠', type: 'timed', duration: 30 },
    { name: '哑铃侧平举', icon: lateralRaiseFrame1, frames: lateralRaiseFrames, frameMs: 400, teaching: lateralRaiseGuide, description: '由中心向两侧画弧，肩膀控制发力', reward: '🍹 莫吉托', type: 'timed', duration: 25 },
    { name: '慢跑', icon: runIcon, frames: runFrames, frameMs: 400, description: '节奏稳定的慢跑，保持呼吸均匀', reward: '🍞 吐司', type: 'tap' },
  ],
  ovulation: [
    { name: '跪姿俯卧撑', icon: kneelingPushupFrame1, frames: kneelingPushupFrames, frameMs: 500, description: '双膝跪地，核心收紧，身体下压推起', reward: '🦐 海鲜', type: 'alternate' },
    { name: '游泳', icon: swimFrame1, frames: swimFrames, frameMs: 300, description: '划水前进，协调呼吸节奏', reward: '🐟 鲜鱼', type: 'alternate' },
  ],
  luteal: [
    { name: '俯身飞鸟', icon: bentOverFlyFrame1, frames: bentOverFlyFrames, frameMs: 500, description: '俯身持哑铃，双臂向两侧展开飞鸟', reward: '🥤 生姜汽水', type: 'alternate' },
    { name: '臀推', icon: hipThrustFrame1, frames: hipThrustFrames, frameMs: 500, description: '肩胛骨靠凳，臀部发力向上推起', reward: '🍞 吐司', type: 'alternate' },
  ],
}

const gymTips = {
  period: '身体处在能量低点，耐力和恢复能力下降，不宜剧烈运动。建议以舒缓瑜伽、拉伸、慢走为主，静养放松、温和自愈即可。',
  follicular: '身心能量稳步回升，体能与适应能力逐渐变强。可逐步增加运动时长和强度，练习轻重量塑形、学习新动作，慢慢恢复运动状态。',
  ovulation: '肌肉爆发力、体能状态整周期最佳，运动承受能力极强。可尝试大重量力量训练、游泳等高强度项目，突破自身运动上限。',
  luteal: '身体耐力尚可但易疲惫、心绪易躁动不安。适合温和增肌训练，后期搭配慢跑、舒缓有氧，平复情绪、稳定身体状态。',
}


const encouragementMessages = [
  '🔥 继续加油，你做得很好！',
  '💪 保持节奏，感受肌肉发力！',
  '🌟 专注呼吸，动作标准最重要！',
  '✨ 坚持下去，突破就在眼前！',
  '🏋️ 每一秒都在变强！',
  '🎯 稳住核心，完美姿势！',
  '⚡ 力量在增长，坚持住！',
  '💎 汗水不会骗你，继续！',
];
const meditationGuidance = {
  period: '🌧️ 经期冥想：轻柔缓慢地呼吸，感受腹部温暖，让身体在呼吸中得到抚慰。',
  follicular: '🌅 卵泡期冥想：深吸慢呼，想象清新的能量随着呼吸充满全身。',
  ovulation: '☀️ 排卵日冥想：饱满的呼吸节奏，感受身体处于巅峰状态的力量。',
  luteal: '🌅 黄体期冥想：缓缓呼气，把一周的疲惫和压力都呼出体外。',
}

const exerciseGuides = {
  '罗马尼亚硬拉': {
    technique: '双脚与髋同宽，膝盖微屈，背部挺直呈一条直线。哑铃贴紧小腿前侧下滑至膝盖下方，臀部向后推。核心始终收紧，感受大腿后侧腘绳肌和臀大肌的拉伸与收缩。',
    breathing: '下放时用鼻子吸气，感受后侧链的拉伸；站直时用嘴呼气，臀部向前推收紧。',
    focus: '全程保持背部挺直，不要弓腰；膝盖角度不变，运动只发生在髋关节；哑铃始终贴近身体。',
    phaseTips: {
      follicular: '卵泡期睾酮和雌激素协同上升，力量处于上升期。可适当增加负重，每组 10-12 次，感受肌肉的充分收缩。',
      default: '保持动作质量优先于负重，每组 8-12 次，做 3 组。',
    },
  },
  '哑铃侧平举': {
    technique: '站姿稳定，核心收紧，双手持哑铃置于身体两侧。肘关节微屈并保持角度固定，以肩关节为轴向上画弧至肩部高度，小拇指略高于大拇指如倒水。顶峰收缩 1 秒后缓慢下放。',
    breathing: '上举时呼气发力，感受三角肌中束收缩；下放时吸气控制，保持肌肉张力不放松。',
    focus: '不要借力甩动身体，躯干保持稳定；肘关节角度不变，用肩膀而非手臂发力；上举幅度以肩部高度为限，过高会带动斜方肌。',
    phaseTips: {
      follicular: '卵泡期神经肌肉协调性提升，适合中高次数训练。每组 12-15 次，控制节奏，上举 2 秒、下放 3 秒。',
      default: '每组 12-15 次，轻重量高次数，注重肌肉感受。',
    },
  },
  '跪姿俯卧撑': {
    technique: '双膝跪地，双手略宽于肩支撑，核心收紧保持身体呈一条直线。屈肘缓慢下放身体至胸部接近地面，停顿 1 秒后胸部发力推起至起始位置。全程保持背部平直，不要塌腰或弓背。',
    breathing: '身体下放时用鼻子吸气，感受胸部和手臂的拉伸；推起时用嘴呼气，感受胸部发力收缩。',
    focus: '核心始终收紧，背部保持平直；肘关节与身体呈约45度夹角；动作幅度完整，下放到位、推起到顶；视线看向地面，颈部自然放松。',
    phaseTips: {
      ovulation: '排卵日力量和耐力处于峰值，可以增加每组的次数和组数，充分刺激胸肌和三头肌。',
      default: '每组 10-15 次，做 2-3 组，组间休息 45 秒。',
    },
  },
  '游泳': {
    technique: '模拟自由泳划水动作，身体略微前倾，双臂交替划水。手臂前伸入水→抓水→推水→出水恢复，形成完整划水循环。肩膀带动手臂，核心稳定身体。',
    breathing: '每划 2-3 次水进行一次侧头换气。划水时呼气，换气时快速吸气。保持呼吸与划水节奏同步。',
    focus: '划水路线呈 S 形，增加有效划水距离；推水要加速到末尾，不要提前松劲；核心收紧减少身体左右摆动。',
    phaseTips: {
      ovulation: '排卵日耐力水平最高，可以增加划水频率和持续时间，感受流畅的运动节奏。',
      default: '保持匀速划水，每组持续 1-2 分钟，做 2-3 组。',
    },
  },
  '俯身飞鸟': {
    technique: '俯身站立，腰背挺直，膝盖微屈，躯干与地面约呈45度。双手持哑铃自然下垂，掌心相对。以肩关节为轴，双臂向两侧展开至与肩同高，顶峰收缩后缓慢下放回起始位置。',
    breathing: '展开双臂时用嘴呼气，感受三角肌后束和上背部的收缩；下放时用鼻子吸气，保持肌肉张力控制。',
    focus: '腰背始终挺直，不要弓腰或塌腰；动作幅度以手臂与肩同高为限，不要过度抬高；肘关节微屈保持固定角度，用肩部而非手臂发力。',
    phaseTips: {
      luteal: '黄体期适合中等重量多次数，动作节奏放慢，注重肌肉感受而非大重量。每组 12-15 次，做 2-3 组。',
      default: '轻重量为主，每组 10-15 次，做 2-3 组，组间休息 45 秒。',
    },
  },
  '臀推': {
    technique: '坐于地面，肩胛骨下缘靠在矮凳或沙发边缘。将哑铃或杠铃置于髋部，双脚与肩同宽踩实地面。臀部发力向上推起，至身体呈一条直线（肩-髋-膝），顶峰收缩臀大肌 1 秒后缓慢下放。',
    breathing: '向上推起时用嘴呼气，感受臀部充分收缩；下放时用鼻子吸气，控制下落速度。',
    focus: '全程收紧核心，不要过度弓腰；发力点在臀部而非腰部，想象用臀部向前顶；膝盖保持稳定，不要内扣或外翻；下巴微收，视线看向前方。',
    phaseTips: {
      luteal: '黄体期适合中等强度臀部训练，每组 12-15 次，注重顶峰收缩和离心控制。避免过重负荷导致腰背代偿。',
      default: '中等重量，每组 10-15 次，做 3 组，组间休息 60 秒。',
    },
  },
  '慢跑': {
    technique: '保持轻松自然的跑姿，身体略微前倾，步幅适中。前脚掌或全脚掌着地，膝盖微屈缓冲。手臂自然摆动，摆动幅度不宜过大，保持肩部放松。',
    breathing: '采用鼻吸口呼方式，节奏稳定的 3 步一吸 3 步一呼，保持呼吸均匀深长。',
    focus: '落地轻盈，避免沉重的脚步声；步频保持在每分钟 160-170 步；核心微收，骨盆稳定不要左右晃动。',
    phaseTips: {
      luteal: '黄体期体温略高，注意补水。以低强度慢跑为主，心率控制在最大心率的 60-70%，感到疲惫就停下来。',
      default: '保持轻松配速，持续 15-30 分钟，以能边跑边说话为宜。',
    },
  },
}

const breathingInstructions = {
  inhale: { text: '用鼻子缓缓吸气', detail: '感受腹部像气球一样鼓起', time: '4 秒' },
  exhale: { text: '用嘴巴轻轻呼气', detail: '感受腹部自然回落', time: '4 秒' },
}

export default function Gym({ onBack, onOpenLighthouse }) {
  const { cycleData } = useCycle()
  const [rewards, setRewards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [completed, setCompleted] = useState([])
  const [currentExercise, setCurrentExercise] = useState(null)
  const [progress, setProgress] = useState(0)
  const [showReward, setShowReward] = useState(null)
  const [lastDirection, setLastDirection] = useState(null)
  const [dragY, setDragY] = useState(0)
  const [dragPhase, setDragPhase] = useState('idle')
  const [repCount, setRepCount] = useState(0)
  const dragPeakYRef = useRef(0)
  const dragLastYRef = useRef(0)

  // === 计时运动模式 ===
  const [timedMode, setTimedMode] = useState(false)
  const [timedProgress, setTimedProgress] = useState(0)
  const [timedTotal, setTimedTotal] = useState(0)
  const [countdownPaused, setCountdownPaused] = useState(false)
  const [encouragementVisible, setEncouragementVisible] = useState(false)
  const [encouragement, setEncouragement] = useState('')
  const timedRef = useRef(null)

  const [breathingPhase, setBreathingPhase] = useState('inhale')
  const [breathingProgress, setBreathingProgress] = useState(0)
  const breathingTimerRef = useRef(null)
  const breathStartTimeRef = useRef(null)

  // 分解动作帧动画
  const [frameIndex, setFrameIndex] = useState(0)
  const frameTimerRef = useRef(null)

  const phase = cycleData?.phase?.name || 'follicular'
  const currentExercises = exercises[phase] || exercises.period

  // 自定义运动计划
  const [customExercises, setCustomExercises] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_EXERCISES_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customForm, setCustomForm] = useState({ name: '', duration: '', description: '', phase: phase })
  const currentCustomExercises = customExercises[phase] || []

  const saveCustomExercises = (newData) => {
    localStorage.setItem(CUSTOM_EXERCISES_KEY, JSON.stringify(newData))
    setCustomExercises(newData)
  }

  const handleAddCustomExercise = () => {
    if (!customForm.name.trim()) return
    const newExercise = {
      id: Date.now(),
      name: customForm.name.trim(),
      duration: customForm.duration.trim() || '10 分钟',
      description: customForm.description.trim() || '自定义运动',
      phase: customForm.phase,
      type: 'tap',
    }
    const phaseKey = customForm.phase
    const updated = { ...customExercises, [phaseKey]: [...(customExercises[phaseKey] || []), newExercise] }
    saveCustomExercises(updated)
    setShowCustomForm(false)
    setCustomForm({ name: '', duration: '', description: '', phase: phase })
  }

  const handleDeleteCustomExercise = (id) => {
    const updated = {}
    for (const key of Object.keys(customExercises)) {
      updated[key] = customExercises[key].filter(ex => ex.id !== id)
    }
    saveCustomExercises(updated)
  }

  // 解析自定义运动的时长（如 "15 分钟" → 900 秒）
  const parseDuration = (dur) => {
    const m = String(dur).match(/(\d+)/)
    return m ? parseInt(m[1]) * 60 : 600
  }

  const startCustomExercise = (exercise) => {
    const ex = {
      ...exercise,
      icon: exercise.icon || null,
      description: exercise.description || '自定义运动',
      reward: '⭐ 自定义奖励',
      type: 'tap',
      frames: null,
    }
    startExercise(ex)
  }

  // 冥想呼吸动画
  useEffect(() => {
    if (currentExercise?.name === '冥想') {
      const breathDuration = 4000
      breathStartTimeRef.current = performance.now()
      setBreathingProgress(0)
      setBreathingPhase('inhale')

      let rafId
      const animate = (timestamp) => {
        const elapsed = timestamp - breathStartTimeRef.current
        const cycleProgress = (elapsed % breathDuration) / breathDuration * 100

        if (Math.floor(elapsed / breathDuration) % 2 === 0) {
          setBreathingPhase('inhale')
          setBreathingProgress(cycleProgress)
        } else {
          setBreathingPhase('exhale')
          setBreathingProgress(cycleProgress)
        }

        rafId = requestAnimationFrame(animate)
      }

      rafId = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(rafId)
    }
  }, [currentExercise])

  // 分解动作帧动画 — 循环切换
  useEffect(() => {
    if (!currentExercise?.frames || currentExercise.frames.length <= 1) return
    setFrameIndex(0)
    const ms = currentExercise.frameMs || 400
    frameTimerRef.current = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % currentExercise.frames.length)
    }, ms)
    return () => clearInterval(frameTimerRef.current)
  }, [currentExercise])

  // 计时运动轮询 & 页面可见性监听
  useEffect(() => {
    if (!timedMode || countdownPaused) {
      clearInterval(timedRef.current)
      return
    }

    timedRef.current = setInterval(() => {
      setTimedProgress(prev => {
        const next = prev + 1
        if (next >= timedTotal) {
          clearInterval(timedRef.current)
          setTimedMode(false)
          completeExercise()
          return 0
        }
        setProgress((next / timedTotal) * 100)
        // 每隔几秒弹出鼓励话语
        if (next > 0 && next % 7 === 0) {
          const msg = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]
          setEncouragement(msg)
          setEncouragementVisible(true)
          setTimeout(() => setEncouragementVisible(false), 2800)
        }
        return next
      })
    }, 1000)

    const handleVisibility = () => {
      if (document.hidden) setCountdownPaused(true)
      else setCountdownPaused(false)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      clearInterval(timedRef.current)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [timedMode, countdownPaused, timedTotal])

  const saveRewards = (newRewards) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRewards))
    setRewards(newRewards)
  }

  const startTimedExercise = (exercise) => {
    const duration = exercise.duration || 30
    setCurrentExercise(exercise)
    setTimedMode(true)
    setTimedProgress(0)
    setTimedTotal(duration)
    setCountdownPaused(false)
    setProgress(0)
    setEncouragementVisible(false)
    setFrameIndex(0)
  }

  const cancelTimedExercise = () => {
    clearInterval(timedRef.current)
    setTimedMode(false)
    setTimedProgress(0)
    setTimedTotal(0)
    setCountdownPaused(false)
    setEncouragementVisible(false)
    setCurrentExercise(null)
    setProgress(0)
    setFrameIndex(0)
  }

  const startExercise = (exercise) => {
    if (exercise.type === 'timed') {
      startTimedExercise(exercise)
      return
    }
    setCurrentExercise(exercise)
    setProgress(0)
    setLastDirection(null)
    setBreathingPhase('inhale')
    setBreathingProgress(0)
    setDragY(0)
    setDragPhase('idle')
    setRepCount(0)
    dragPeakYRef.current = 0
    dragLastYRef.current = 0
  }

  const handleCancel = () => {
    if (frameTimerRef.current) clearInterval(frameTimerRef.current)
    setCurrentExercise(null)
    setProgress(0)
    setBreathingPhase('inhale')
    setBreathingProgress(0)
    setDragY(0)
    setDragPhase('idle')
    setRepCount(0)
    dragPeakYRef.current = 0
  }

  const handleInteraction = (direction) => {
    if (!currentExercise) return
    const exType = currentExercise.type || 'tap'
    if (exType === 'tap') {
      setProgress((p) => {
        const newProgress = Math.min(p + 12, 100)
        if (newProgress >= 100) completeExercise()
        return newProgress
      })
    } else if (exType === 'alternate') {
      if (direction !== lastDirection) {
        setProgress((p) => {
          const newProgress = Math.min(p + 8, 100)
          if (newProgress >= 100) completeExercise()
          return newProgress
        })
        setLastDirection(direction)
      }
    } else {
      setProgress((p) => {
        const newProgress = Math.min(p + 12, 100)
        if (newProgress >= 100) completeExercise()
        return newProgress
      })
    }
  }

  const handleDragMove = (e) => {
    if (!currentExercise || (currentExercise.type !== 'drag' && currentExercise.type !== 'arc')) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clientY = (e.clientY || e.touches?.[0]?.clientY) || 0
    const y = clientY - rect.top - rect.height / 2
    // arc类型（侧平举）：向上拖=发力
    const effectiveY = currentExercise.type === 'arc' ? -y : y
    setDragY(effectiveY)

    const goingDown = effectiveY > dragPeakYRef.current
    if (goingDown) {
      dragPeakYRef.current = effectiveY
      if (dragPhase !== 'down') setDragPhase('down')
    }
    // 反向判定：下阶段超过30px阈值后，回到中心30%以内 = 完成1次
    if (dragPhase === 'down' && dragPeakYRef.current > 30 && effectiveY < dragPeakYRef.current * 0.3) {
      setDragPhase('up')
      dragPeakYRef.current = 0
      handleInteraction('drag')
      setRepCount(c => c + 1)
    }
    dragLastYRef.current = effectiveY
  }

  const handleDragEnd = () => {
    setDragY(0)
    setDragPhase('idle')
    dragPeakYRef.current = 0
  }

  const completeExercise = () => {
    if (!currentExercise) return
    if (frameTimerRef.current) clearInterval(frameTimerRef.current)
    const newCompleted = [...completed, currentExercise.name]
    setCompleted(newCompleted)
    const newRewards = [...rewards, { id: Date.now(), name: currentExercise.reward, exercise: currentExercise.name, date: new Date().toLocaleDateString('zh-CN') }]
    saveRewards(newRewards)
    setShowReward(currentExercise.reward)
    setTimeout(() => { setShowReward(null); setCurrentExercise(null); setProgress(0); setLastDirection(null); setBreathingPhase('inhale'); setBreathingProgress(0); setDragY(0); setDragPhase('idle'); setRepCount(0); dragPeakYRef.current = 0 }, 1500)
  }

  const exType = currentExercise?.type || 'tap'
  const isMeditation = currentExercise?.name === '冥想'
  const guide = exerciseGuides[currentExercise?.name]
  const currentInstruction = breathingInstructions[breathingPhase]

  const breathingBarWidth = breathingPhase === 'inhale'
    ? breathingProgress
    : 100 - breathingProgress

  // 当前显示的动作图片 — 用循环帧，否则用icon
  const displayFrame = (() => {
    if (!currentExercise?.frames) return currentExercise?.icon
    return currentExercise.frames[frameIndex]
  })()

  return (
    <>
      <GymBackground />

      <div style={{ minHeight: '100vh', padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease-out' }}>
          <button onClick={onBack} className="btn-elegant" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '1rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', transition: 'all 0.25s ease' }}>
            🏠 主页
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', flex: 1, color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.12)', letterSpacing: '0.04em' }}>
            海边健身房
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <img src={coach} alt="教练" style={{ width: '2.75rem', height: '2.75rem', objectFit: 'contain', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', padding: '0.15rem', border: '1px solid rgba(255,255,255,0.2)' }} />
            <button
              onClick={() => onOpenLighthouse?.('advice')}
              title="AI 运动建议"
              style={{
                width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1rem',
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
            >🤖</button>
          </div>
        </div>

        {/* 提示 */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.25rem', padding: '1.15rem 1.5rem', marginBottom: '0.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1.5px solid rgba(16,185,129,0.2)', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
          <p style={{ color: '#475569', fontSize: '1.1rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.6, letterSpacing: '0.02em' }}>💪 {gymTips[phase]}</p>
        </div>

        {/* 小汐定制建议提醒 */}
        <div
          onClick={() => onOpenLighthouse?.('advice')}
          style={{
            background: 'linear-gradient(135deg, #fef9c3, #fef3c7)',
            borderRadius: '1rem',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            border: '2px dashed rgba(251,191,36,0.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeInUp 0.5s ease-out 0.15s both',
            transition: 'all 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #fef08a, #fde68a)'
            e.currentTarget.style.transform = 'scale(1.02)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #fef9c3, #fef3c7)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>🗼</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#92400e', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.5 }}>
              💡 想要更适合你的专属运动计划？去<strong>智慧灯塔</strong>找小汐获取定制化建议吧！
            </p>
          </div>
          <span style={{ fontSize: '1rem', color: '#f59e0b' }}>→</span>
        </div>

        {/* 奖励展示 */}
        {rewards.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.92)', borderRadius: '1.25rem', padding: '1rem', marginBottom: '1.5rem', boxShadow: '0 2px 14px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>已获得的食材：</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {rewards.slice(-5).map((r) => (
                <span key={r.id} style={{ background: '#d1fae5', color: '#047857', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>{r.name}</span>
              ))}
            </div>
          </div>
        )}

        {/* 运动区域 */}
        {currentExercise ? (
          timedMode ? (
            /* ===== 计时运动界面 ===== */
            <div style={{
              background: 'linear-gradient(to bottom, #ecfdf5, #d1fae5)',
              borderRadius: '1.5rem', padding: '1.5rem',
              animation: 'fadeInUp 0.5s ease-out',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              {/* 暂停遮罩 */}
              {countdownPaused && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 5,
                  background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)',
                  borderRadius: 'inherit',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '0.5rem',
                  animation: 'fadeIn 0.2s ease-out',
                }}>
                  <span style={{ fontSize: '2.5rem' }}>⏸️</span>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>计时已暂停</p>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>切换回该页面继续计时</p>
                </div>
              )}

              <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.25rem' }}>
                ⏱️ {currentExercise.name}
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{currentExercise.description}</p>

              {/* 帧动画 */}
              {currentExercise.frames && (
                <div style={{
                  width: '12rem', height: '12rem',
                  margin: '0 auto 0.75rem',
                  background: 'white', borderRadius: '1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                }}>
                  <img
                    src={displayFrame}
                    alt={currentExercise.name}
                    style={{
                      width: '10rem', height: '10rem',
                      objectFit: 'contain',
                      transition: 'opacity 0.15s ease',
                    }}
                  />
                </div>
              )}
              {!currentExercise.frames && (
                <img src={currentExercise.icon} alt={currentExercise.name} style={{
                  width: '8rem', height: '8rem', objectFit: 'contain', margin: '0 auto 0.75rem',
                }} />
              )}

              {/* 帧指示器 */}
              {currentExercise.frames && (
                <span style={{
                  display: 'inline-block',
                  marginBottom: '0.5rem',
                  fontSize: '0.65rem',
                  color: '#9ca3af',
                  background: '#f3f4f6',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                }}>
                  帧 {frameIndex + 1}/{currentExercise.frames.length}
                </span>
              )}

              {/* 鼓励话语弹出 */}
              {encouragementVisible && (
                <div style={{
                  animation: 'fadeInUp 0.3s ease-out',
                  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                  borderRadius: '1rem', padding: '0.6rem 1rem',
                  marginBottom: '0.75rem',
                  border: '2px solid rgba(251,191,36,0.3)',
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#92400e' }}>
                    {encouragement}
                  </span>
                </div>
              )}

              {/* 倒计时环 */}
              <div style={{
                width: '10rem', height: '10rem', borderRadius: '50%',
                margin: '0 auto 0.75rem',
                background: `conic-gradient(#10b981 ${(timedProgress / timedTotal) * 360}deg, #e5e7eb 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 24px rgba(16,185,129,0.2)',
              }}>
                <div style={{
                  width: '7.5rem', height: '7.5rem', borderRadius: '50%',
                  background: 'white',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1f2937', fontVariantNumeric: 'tabular-nums' }}>
                    {String(Math.floor((timedTotal - timedProgress) / 60)).padStart(2, '0')}:{String((timedTotal - timedProgress) % 60).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>剩余时间</span>
                </div>
              </div>

              {/* 进度条 */}
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{
                  width: '100%', height: '0.6rem',
                  background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    height: '100%', borderRadius: '9999px',
                    background: 'linear-gradient(to right, #34d399, #059669)',
                    width: `${progress}%`,
                    transition: 'width 1s linear',
                  }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.25rem', display: 'inline-block' }}>
                  {Math.round(progress)}% 已完成
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 600 }}>
                ⏳ 自动计时中，保持姿势...
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  onClick={() => {
                    if (window.confirm('确定退出吗？进度不会保存。')) {
                      if (frameTimerRef.current) clearInterval(frameTimerRef.current)
                      cancelTimedExercise()
                    }
                  }}
                  className="btn-elegant"
                  style={{
                    flex: 1, padding: '0.7rem',
                    background: '#fee2e2', color: '#dc2626',
                    borderRadius: '0.75rem', border: 'none',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                  }}
                >退出</button>
                <button
                  onClick={() => setCountdownPaused(!countdownPaused)}
                  className="btn-elegant"
                  style={{
                    flex: 1, padding: '0.7rem',
                    background: '#f3f4f6', color: '#374151',
                    borderRadius: '0.75rem', border: 'none',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                  }}
                >{countdownPaused ? '继续' : '暂停'}</button>
              </div>
            </div>
          ) : (
            /* ===== 交互式运动界面 ===== */
            <div style={{
            background: (phase === 'ovulation' && (currentExercise.name === '跪姿俯卧撑' || currentExercise.name === '游泳'))
              ? `url(${oceanShallow}) center/cover no-repeat, rgba(255,255,255,0.95)`
              : 'rgba(255,255,255,0.95)',
            backgroundBlendMode: 'overlay',
            borderRadius: '1.5rem', padding: '1.5rem', animation: 'fadeInUp 0.5s ease-out',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* 海洋背景叠加层 */}
            {(phase === 'ovulation' && (currentExercise.name === '跪姿俯卧撑' || currentExercise.name === '游泳')) && (
              <div style={{
                position: 'absolute', inset: 0,
                background: `url(${currentExercise.name === '跪姿俯卧撑' ? oceanShallow : oceanDeep}) center/cover no-repeat`,
                opacity: 0.12, borderRadius: 'inherit', pointerEvents: 'none', zIndex: 0,
              }} />
            )}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
              {/* 动作图片 — 使用分解帧动画 */}
              <img
                src={displayFrame || coach}
                alt={currentExercise.name}
                style={{
                  width: '14rem',
                  height: '14rem',
                  objectFit: 'contain',
                  margin: '0 auto 0.5rem',
                  transition: 'opacity 0.15s ease',
                }}
              />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{currentExercise.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>{currentExercise.description}</p>
              {currentExercise.frames && (
                <span style={{
                  display: 'inline-block',
                  marginTop: '0.25rem',
                  fontSize: '0.65rem',
                  color: '#9ca3af',
                  background: '#f3f4f6',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                }}>
                  帧 {frameIndex + 1}/{currentExercise.frames.length}
                </span>
              )}
            </div>

            {/* 教学参考图 */}
            {currentExercise.teaching && (
              <div style={{
                background: '#f8fafc',
                borderRadius: '0.75rem',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid rgba(148,163,184,0.2)',
                textAlign: 'center',
              }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>📋 标准动作参考</span>
                <img
                  src={currentExercise.teaching}
                  alt={`${currentExercise.name}教学`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '14rem',
                    objectFit: 'contain',
                    borderRadius: '0.5rem',
                  }}
                />
              </div>
            )}

            {/* 专业指导 */}
            {guide && (
              <div style={{
                background: 'linear-gradient(135deg, #eff6ff, #f0f9ff)',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                border: '1px solid rgba(59,130,246,0.15)',
              }}>
                <span style={{ fontSize: '0.7rem', color: '#2563eb', fontWeight: 600 }}>📖 专业指导</span>
                <div style={{ fontSize: '0.78rem', color: '#1e40af', lineHeight: 1.65, marginTop: '0.35rem' }}>
                  <p style={{ marginBottom: '0.35rem' }}><strong>动作要领：</strong>{guide.technique}</p>
                  <p style={{ marginBottom: '0.35rem' }}><strong>呼吸节奏：</strong>{guide.breathing}</p>
                  <p style={{ marginBottom: '0.35rem' }}><strong>注意事项：</strong>{guide.focus}</p>
                  <p style={{ color: '#7c3aed', background: 'rgba(124,58,237,0.06)', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', marginTop: '0.4rem' }}>
                    <strong>💡 时期建议：</strong>{guide.phaseTips[phase] || guide.phaseTips.default}
                  </p>
                </div>
              </div>
            )}

            {/* 运动进度条 */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', width: '8rem', height: '0.75rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(to right, #34d399, #059669)', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.15s' }} />
              </div>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>{progress < 100 ? '继续做动作...' : '✓ 完成！'}</p>

            {/* === 冥想专用界面 === */}
            {isMeditation ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                {/* 瑜伽垫背景 */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '1rem',
                  background: `url(${yogaMat}) center/cover no-repeat`,
                  opacity: 0.06, pointerEvents: 'none', zIndex: 0,
                }} />
                <div style={{
                  background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                  borderRadius: '1rem',
                  padding: '1rem 1.25rem',
                  border: '1px solid rgba(52,211,153,0.3)',
                  position: 'relative', zIndex: 1,
                }}>
                  <p style={{ color: '#065f46', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.7, fontWeight: 500 }}>
                    {meditationGuidance[phase]}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'stretch' }}>
                  <div style={{
                    flex: '0 0 8rem',
                    background: 'linear-gradient(to bottom, #d1fae5, #a7f3d0)',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.75rem',
                  }}>
                    <img
                      src={breathingPhase === 'inhale' ? meditationInhale : meditationExhale}
                      alt={breathingPhase === 'inhale' ? '吸气' : '呼气'}
                      style={{
                        width: '7rem',
                        height: '7rem',
                        objectFit: 'contain',
                        transform: `scale(${breathingPhase === 'inhale'
                          ? (0.92 + (breathingProgress / 100) * 0.16).toFixed(3)
                          : (1.08 - (breathingProgress / 100) * 0.16).toFixed(3)})`,
                      }}
                    />
                    <span style={{
                      fontSize: '1.1rem',
                      color: '#374151',
                      marginTop: '0.4rem',
                      fontWeight: 700,
                      transition: 'opacity 0.3s',
                    }}>
                      {breathingPhase === 'inhale' ? '🌬️ 吸气' : '💨 呼气'}
                    </span>
                  </div>

                  <div style={{
                    flex: 1,
                    background: '#f0fdf4',
                    borderRadius: '1rem',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    border: '1px solid rgba(52,211,153,0.2)',
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#065f46', transition: 'opacity 0.3s' }}>
                      {currentInstruction.text}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#047857', transition: 'opacity 0.3s' }}>
                      {currentInstruction.detail}
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      background: 'rgba(52,211,153,0.2)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      color: '#065f46',
                      fontWeight: 600,
                      alignSelf: 'flex-start',
                    }}>
                      ⏱ {currentInstruction.time}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#e5e7eb',
                  borderRadius: '9999px',
                  height: '1.5rem',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    height: '100%',
                    borderRadius: '9999px',
                    width: `${breathingBarWidth}%`,
                    background: breathingPhase === 'inhale'
                      ? 'linear-gradient(to right, #34d399, #10b981, #059669)'
                      : 'linear-gradient(to right, #6ee7b7, #34d399, #10b981)',
                    transition: 'width 0.1s linear',
                    position: 'relative',
                    boxShadow: '0 0 12px rgba(52,211,153,0.3)',
                  }} />
                  <span style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#374151',
                    textShadow: '0 1px 0 rgba(255,255,255,0.5)',
                  }}>
                    {breathingPhase === 'inhale' ? '⬅ 缓缓吸气 ➡' : '➡ 缓缓呼气 ⬅'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      style={{
                        width: '0.5rem',
                        height: '0.5rem',
                        borderRadius: '50%',
                        background: i < Math.ceil(breathingBarWidth / 20)
                          ? breathingPhase === 'inhale' ? '#34d399' : '#6ee7b7'
                          : '#e5e7eb',
                        transition: 'background 0.2s',
                      }}
                    />
                  ))}
                </div>

                <div
                  onClick={() => handleInteraction('tap')}
                  className="btn-elegant"
                  style={{
                    height: '5rem',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: 'linear-gradient(to bottom, #d1fae5, #a7f3d0)',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#065f46' }}>
                    👆 跟随节奏点击（已呼吸 {Math.round(progress / 12)} / {Math.ceil(100 / 12)} 轮）
                  </span>
                </div>
              </div>
            ) : exType === 'tap' ? (
              /* 慢跑/冥想 — 点击交互 */
              <div onClick={() => handleInteraction('tap')} className="btn-elegant" style={{ height: '12rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'linear-gradient(to bottom, #d1fae5, #a7f3d0)', position: 'relative', overflow: 'hidden' }}>
                {currentExercise.frames ? (
                  <img
                    src={displayFrame}
                    alt={currentExercise.name}
                    style={{
                      width: '10rem',
                      height: '10rem',
                      objectFit: 'contain',
                      transition: 'opacity 0.15s ease',
                    }}
                  />
                ) : (
                  <img src={currentExercise.icon} alt={currentExercise.name} style={{ width: '6rem', height: '6rem', objectFit: 'contain', opacity: 0.8 }} />
                )}
                <span style={{ fontSize: '1.25rem', color: '#374151', marginTop: '0.5rem', fontWeight: 600 }}>
                  👆 点击跟随节奏
                </span>
              </div>
            ) : exType === 'alternate' ? (
              <div style={{
                height: '12rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                background: currentExercise.name === '跪姿俯卧撑'
                  ? `url(${oceanShallow}) center/cover no-repeat, linear-gradient(to right, rgba(209,250,229,0.7), rgba(167,243,208,0.7), rgba(209,250,229,0.7))`
                  : 'linear-gradient(to right, #d1fae5, #a7f3d0, #d1fae5)',
                backgroundBlendMode: 'overlay',
                position: 'relative', overflow: 'hidden',
              }}>
                <div
                  style={{ position: 'absolute', left: 0, width: '30%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: lastDirection === 'left' ? 'rgba(52,211,153,0.3)' : 'transparent', transition: 'background 0.15s', zIndex: 1 }}
                  onClick={() => handleInteraction('left')}
                >
                  <span style={{ fontSize: '2.5rem', opacity: lastDirection === 'left' ? 1 : 0.5 }}>◀</span>
                </div>
                {/* 分解帧动画在主区域 */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%' }}>
                  {currentExercise.frames ? (
                    <img
                      src={displayFrame}
                      alt={currentExercise.name}
                      style={{
                        maxWidth: '11rem',
                        maxHeight: '10rem',
                        objectFit: 'contain',
                        transition: 'opacity 0.15s ease',
                        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.08))',
                      }}
                    />
                  ) : (
                    <img src={currentExercise.icon} alt={currentExercise.name} style={{
                      width: '7rem', height: '7rem', objectFit: 'contain',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
                    }} />
                  )}
                </div>
                <div
                  style={{ position: 'absolute', right: 0, width: '30%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: lastDirection === 'right' ? 'rgba(52,211,153,0.3)' : 'transparent', transition: 'background 0.15s', zIndex: 1 }}
                  onClick={() => handleInteraction('right')}
                >
                  <span style={{ fontSize: '2.5rem', opacity: lastDirection === 'right' ? 1 : 0.5 }}>▶</span>
                </div>
                <span style={{ position: 'absolute', bottom: '0.5rem', fontSize: '0.75rem', color: '#6b7288', zIndex: 1 }}>左右交替</span>
              </div>
            ) : (
              /* 拖拽/其他类型 — 点击交互回退 */
              <div onClick={() => handleInteraction('tap')} className="btn-elegant" style={{ height: '12rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'linear-gradient(to bottom, #d1fae5, #a7f3d0)', position: 'relative', overflow: 'hidden' }}>
                {currentExercise.frames ? (
                  <img
                    src={displayFrame}
                    alt={currentExercise.name}
                    style={{
                      width: '10rem',
                      height: '10rem',
                      objectFit: 'contain',
                      transition: 'opacity 0.15s ease',
                    }}
                  />
                ) : (
                  <img src={currentExercise.icon} alt={currentExercise.name} style={{ width: '6rem', height: '6rem', objectFit: 'contain', opacity: 0.8 }} />
                )}
                <span style={{ fontSize: '1.25rem', color: '#374151', marginTop: '0.5rem', fontWeight: 600 }}>
                  👆 点击跟随节奏
                </span>
              </div>
            )}

            <button onClick={handleCancel} className="btn-elegant" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
              取消
            </button>
          </div>
          )
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.875rem', fontWeight: 600 }}>选择动作：</h3>
              <button
                onClick={() => {
                  setCustomForm({ name: '', duration: '', description: '', phase })
                  setShowCustomForm(true)
                }}
                className="btn-elegant"
                style={{
                  width: '2.25rem', height: '2.25rem', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', fontSize: '1.2rem', color: 'white',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.35)'
                  e.currentTarget.style.transform = 'scale(1.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
                title="添加自定义运动"
              >+</button>
            </div>
            {currentExercises.map((exercise, index) => {
              const isCompleted = completed.includes(exercise.name)
              return (
                <button
                  key={exercise.name}
                  onClick={() => !isCompleted && startExercise(exercise)}
                  className="module-card"
                  style={{ background: 'rgba(255,255,255,0.93)', borderRadius: '1.5rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: isCompleted ? 'default' : 'pointer', opacity: isCompleted ? 0.7 : 1, boxShadow: '0 2px 14px rgba(0,0,0,0.05)', animation: `fadeInUp 0.4s ease-out ${0.3 + index * 0.1}s both` }}
                >
                  <div style={{ width: '4rem', height: '4rem', background: 'white', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <img src={exercise.icon} alt={exercise.name} style={{ width: '2.8rem', height: '2.8rem', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h4 style={{ fontWeight: 'bold', color: '#1f2937' }}>{exercise.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{exercise.description}</p>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#059669', background: '#d1fae5', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                        {exercise.type === 'timed' ? `⏱ ${exercise.duration || 30}s` : exercise.type === 'alternate' ? '⟷ 交替' : '👆 点击'}
                      </span>
                      {exercise.frames && (
                        <span style={{ fontSize: '0.65rem', color: '#6366f1', background: '#e0e7ff', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>
                          {exercise.frames.length}帧
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.875rem' }}>{exercise.reward}</span>
                    {isCompleted && <div style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.25rem' }}>✓ 已完成</div>}
                  </div>
                </button>
              )
            })}

            {/* 自定义运动列表 */}
            {currentCustomExercises.map((exercise, index) => {
              const isCompleted = completed.includes(exercise.name)
              return (
                <div
                  key={exercise.id}
                  style={{
                    background: 'rgba(255,255,255,0.88)',
                    borderRadius: '1.5rem',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    border: '2px dashed rgba(251,191,36,0.4)',
                    opacity: isCompleted ? 0.7 : 1,
                    boxShadow: '0 2px 14px rgba(0,0,0,0.05)',
                    animation: `fadeInUp 0.4s ease-out ${0.3 + (currentExercises.length + index) * 0.1}s both`,
                    position: 'relative',
                  }}
                >
                  <div style={{
                    width: '4rem', height: '4rem',
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    borderRadius: '1rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem',
                    flexShrink: 0,
                  }}>✏️</div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h4 style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '0.95rem' }}>{exercise.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{exercise.description}</p>
                    <span style={{ fontSize: '0.7rem', color: '#92400e', background: '#fef3c7', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
                      ⏱ {exercise.duration}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                    {isCompleted ? (
                      <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>✓ 已完成</div>
                    ) : (
                      <button
                        onClick={() => startCustomExercise(exercise)}
                        className="btn-elegant"
                        style={{
                          background: 'linear-gradient(to bottom, #d1fae5, #a7f3d0)',
                          border: 'none',
                          borderRadius: '0.6rem',
                          padding: '0.4rem 0.75rem',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#065f46',
                        }}
                      >▶ 开始</button>
                    )}
                    <button
                      onClick={() => handleDeleteCustomExercise(exercise.id)}
                      className="btn-elegant"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        color: '#ef4444',
                        opacity: 0.6,
                      }}
                      title="删除自定义运动"
                    >删除</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 自定义运动表单弹窗 */}
        {showCustomForm && (
          <div
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 45,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem',
              animation: 'fadeIn 0.2s ease-out',
            }}
            onClick={() => setShowCustomForm(false)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '1.5rem',
                padding: '1.5rem',
                maxWidth: '22rem',
                width: '100%',
                boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                animation: 'scaleIn 0.3s ease-out',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1f2937', marginBottom: '0.15rem' }}>
                ✏️ 自定义运动
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '1rem' }}>
                添加你自己的运动项目
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>运动名称</label>
                  <input
                    type="text"
                    placeholder="例如：跳绳、瑜伽…"
                    value={customForm.name}
                    onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                    style={{
                      width: '100%', padding: '0.6rem 0.75rem',
                      borderRadius: '0.75rem', border: '1px solid #d1d5db',
                      fontSize: '0.9rem', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>运动时长</label>
                  <input
                    type="text"
                    placeholder="例如：15 分钟"
                    value={customForm.duration}
                    onChange={(e) => setCustomForm({ ...customForm, duration: e.target.value })}
                    style={{
                      width: '100%', padding: '0.6rem 0.75rem',
                      borderRadius: '0.75rem', border: '1px solid #d1d5db',
                      fontSize: '0.9rem', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>简短描述</label>
                  <input
                    type="text"
                    placeholder="例如：有氧燃脂，注意膝盖"
                    value={customForm.description}
                    onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                    style={{
                      width: '100%', padding: '0.6rem 0.75rem',
                      borderRadius: '0.75rem', border: '1px solid #d1d5db',
                      fontSize: '0.9rem', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>适用时期</label>
                  <select
                    value={customForm.phase}
                    onChange={(e) => setCustomForm({ ...customForm, phase: e.target.value })}
                    style={{
                      width: '100%', padding: '0.6rem 0.75rem',
                      borderRadius: '0.75rem', border: '1px solid #d1d5db',
                      fontSize: '0.9rem', outline: 'none',
                      fontFamily: 'inherit', background: 'white',
                    }}
                  >
                    <option value="period">🌧️ 月经期</option>
                    <option value="follicular">🌅 卵泡期</option>
                    <option value="ovulation">☀️ 排卵期</option>
                    <option value="luteal">🌅 黄体期</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="btn-elegant"
                  style={{
                    flex: 1, padding: '0.75rem',
                    background: '#f3f4f6', color: '#374151',
                    borderRadius: '0.75rem', border: 'none',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem',
                  }}
                >
                  取消
                </button>
                <button
                  onClick={handleAddCustomExercise}
                  className="btn-elegant"
                  style={{
                    flex: 1, padding: '0.75rem',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: 'white', borderRadius: '0.75rem', border: 'none',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem',
                  }}
                >
                  添加 ✓
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 奖励弹窗 */}
        {showReward && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 50 }}>
            <div style={{ background: 'white', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{showReward.split(' ')[0]}</div>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>获得 {showReward}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
