import { useState, useRef, useEffect } from 'react'
import { useCycle } from '../context/CycleContext'
import KitchenBackground from '../components/KitchenBackground'

// 4.2 食物成品图
import hotCocoa from '../assets/2.4.素材收集/4.2食物成品图/热可可.png'
import bakedSweetPotato from '../assets/2.4.素材收集/4.2食物成品图/烤红薯.png'
import limeSlice from '../assets/2.4.素材收集/4.2食物成品图/青柠切片.png'
import mojito from '../assets/2.4.素材收集/4.2食物成品图/莫吉托.png'
import seafood from '../assets/2.4.素材收集/4.2食物成品图/海鲜大餐.png'
import honeyToast from '../assets/2.4.素材收集/4.2食物成品图/蜂蜜吐司.png'
import gingerWater from '../assets/2.4.素材收集/4.2食物成品图/姜汁水.png'

// 4.3 食材原料图
import cocoaBean from '../assets/2.4.素材收集/4.3食材原料图/可可豆.png'
import sweetPotato from '../assets/2.4.素材收集/4.3食材原料图/红薯.png'
import wholeLime from '../assets/2.4.素材收集/4.3食材原料图/完整青柠.png'
import halfLime from '../assets/2.4.素材收集/4.3食材原料图/切半青柠.png'
import mintLeaf from '../assets/2.4.素材收集/4.3食材原料图/薄荷叶.png'
import shrimp from '../assets/2.4.素材收集/4.3食材原料图/虾.png'
import shellfish from '../assets/2.4.素材收集/4.3食材原料图/贝类.png'
import honey from '../assets/2.4.素材收集/4.3食材原料图/蜂蜜.png'
import ginger from '../assets/2.4.素材收集/4.3食材原料图/生姜.png'
import brownSugar from '../assets/2.4.素材收集/4.3食材原料图/红糖块.png'

// 4.4 厨房器具特写图
import grinder from '../assets/2.4.素材收集/4.4厨房器具特写图/可可豆研磨机.png'
import gingerCup from '../assets/2.4.素材收集/4.4厨房器具特写图/姜汁水杯.png'
import woodenPlate from '../assets/2.4.素材收集/4.4厨房器具特写图/木制餐盘.png'
import cuttingBoard from '../assets/2.4.素材收集/4.4厨房器具特写图/木头案板.png'
import oven from '../assets/2.4.素材收集/4.4厨房器具特写图/烤箱.png'
import fryingPan from '../assets/2.4.素材收集/4.4厨房器具特写图/煎锅.png'
import clayCup from '../assets/2.4.素材收集/4.4厨房器具特写图/粗陶杯.png'
import mojitoGlass from '../assets/2.4.素材收集/4.4厨房器具特写图/莫吉托玻璃杯.png'
import mojitoGlass2 from '../assets/2.4.素材收集/4.4厨房器具特写图/莫吉托玻璃杯2.png'

// 4.5 交互提示图
import gestureCircle from '../assets/2.4.素材收集/4.5交互提示图/画圈研磨手势.png'
import gestureChop from '../assets/2.4.素材收集/4.5交互提示图/快刀切水果手势.png'
import gestureDrag from '../assets/2.4.素材收集/4.5交互提示图/缓慢拖拽手势.png'
import gesturePress from '../assets/2.4.素材收集/4.5交互提示图/长按按压手势.png'

const STORAGE_KEY = 'xidao_kitchen_rewards'
const CUSTOM_STORAGE_KEY = 'xidao_kitchen_custom_recipes'

const COOK_TYPES = {
  heat: { label: '🔥 加热/烤制', icon: '🔥' },
  chop: { label: '🔪 切剁/切片', icon: '🔪' },
  grind: { label: '🔄 研磨/捣碎', icon: '🔄' },
  brew: { label: '🫖 冲泡/煮制', icon: '🫖' },
  spread: { label: '🧈 涂抹/搅拌', icon: '🧈' },
}

const FOOD_EMOJIS = ['🍰', '🍲', '🥗', '🍝', '🥩', '🍜', '🍛', '🥘', '🧁', '🍩', '🥪', '🍳', '🥞', '🍕', '🍔', '🌮', '🥙', '🍗', '🧆', '🫕']

const kitchenTips = {
  period: '经期代谢放缓、身体畏寒敏感，生冷和咖啡因易加重不适。建议多补充碳水与温热食物，清淡饮食、少冰少咖，暖胃养护身体。',
  follicular: '身体代谢旺盛、活力快速回升，营养消耗加快。建议多摄入优质蛋白，搭配清淡膳食，顺应高代谢状态调理体态。',
  ovulation: '代谢燃脂效率达到高点，是天然减脂增肌黄金期。适当控制食量与重油高糖，保证足量蛋白质，轻松塑形调理体态。',
  luteal: '代谢变慢、食欲自然上涨，过量咖啡因容易加剧焦虑烦躁。优选复合碳水、清淡饮食，减少高热量零食，后期逐步少摄入咖啡。',
}

const recipes = {
  period: {
    name: '热可可 + 烤红薯',
    icon: hotCocoa,
    tip: '经期喝热可可暖身舒缓，烤红薯富含纤维和维生素，温暖又营养。',
    steps: [
      {
        action: '研磨可可豆',
        description: '将可可豆放入研磨机，画圈研磨成细腻粉末',
        instruction: '用掌心按住研磨机，画圈转动，感受可可豆慢慢变成粉末。力度均匀，不要太快，享受这个过程。',
        type: 'hold',
        cookType: 'grind',
        gesture: gestureCircle,
        gestureLabel: '画圈研磨',
        ingredients: [{ img: cocoaBean, label: '可可豆' }],
        draggable: [{ img: cocoaBean, label: '可可豆' }],
        dropZoneLabel: '研磨机中',
        droppedMsg: '已放入研磨机',
        utensil: grinder,
        utensilLabel: '可可豆研磨机',
        secondaryUtensil: clayCup,
        secondaryUtensilLabel: '粗陶杯',
        color: '#92400e',
        ingredientStages: [
          { progress: 0, filter: 'brightness(1) saturate(0.8)', label: '整豆' },
          { progress: 50, filter: 'brightness(0.85) saturate(0.5)', label: '碎粒' },
          { progress: 100, filter: 'brightness(0.7) saturate(0.3)', label: '细粉' },
        ],
      },
      {
        action: '烤制红薯',
        description: '红薯放入烤箱，设定温度烤至软糯',
        instruction: '将红薯放入预热好的烤箱，耐心等待红薯烤出糖浆，香味飘满厨房。',
        type: 'tap',
        cookType: 'heat',
        gesture: gesturePress,
        gestureLabel: '点击放入',
        ingredients: [{ img: sweetPotato, label: '红薯' }],
        draggable: [{ img: sweetPotato, label: '红薯' }],
        dropZoneLabel: '烤箱中',
        droppedMsg: '已放入烤箱',
        utensil: oven,
        utensilLabel: '烤箱',
        color: '#ea580c',
        ingredientStages: [
          { progress: 0, filter: 'brightness(0.85) saturate(0.7)', label: '生' },
          { progress: 60, filter: 'brightness(1) saturate(0.9) hue-rotate(5deg)', label: '温热' },
          { progress: 100, filter: 'brightness(1.15) saturate(1.2) hue-rotate(10deg)', label: '烤出糖浆' },
        ],
      },
    ],
  },
  follicular: {
    name: '青柠莫吉托',
    icon: mojito,
    tip: '卵泡期来一杯清爽饮品，青柠富含维生素C，薄荷提神醒脑。',
    steps: [
      {
        action: '切青柠片',
        description: '青柠放在案板上，快刀切成薄片',
        instruction: '青柠对半切开，再切成薄片。刀刃要快，动作干脆利落，保留青柠的新鲜汁水。',
        type: 'tap',
        cookType: 'chop',
        gesture: gestureChop,
        gestureLabel: '快速切片',
        ingredients: [{ img: wholeLime, label: '完整青柠' }, { img: halfLime, label: '对半切开' }, { img: limeSlice, label: '切片成品' }],
        draggable: [{ img: wholeLime, label: '完整青柠' }],
        dropZoneLabel: '案板上',
        droppedMsg: '已放上案板',
        utensil: cuttingBoard,
        utensilLabel: '木头案板',
        color: '#65a30d',
        ingredientStages: [
          { progress: 0, filter: 'brightness(1) saturate(1)', label: '完整' },
          { progress: 50, filter: 'brightness(0.95) saturate(0.8)', label: '切开中' },
          { progress: 100, filter: 'brightness(1.05) saturate(1.1)', label: '薄片' },
        ],
      },
      {
        action: '捣薄荷调酒',
        description: '薄荷叶入杯捣碎，释放清新香气',
        instruction: '新鲜薄荷叶放入杯底，用捣棒轻轻按压旋转，释放薄荷精油。不要太用力，否则会发苦。',
        type: 'hold',
        cookType: 'grind',
        gesture: gesturePress,
        gestureLabel: '按压捣碎',
        ingredients: [{ img: mintLeaf, label: '薄荷叶' }],
        draggable: [{ img: mintLeaf, label: '薄荷叶' }],
        dropZoneLabel: '莫吉托杯中',
        droppedMsg: '已入杯',
        utensil: mojitoGlass2,
        utensilLabel: '莫吉托杯',
        color: '#16a34a',
        ingredientStages: [
          { progress: 0, filter: 'brightness(1) saturate(1)', label: '新鲜' },
          { progress: 50, filter: 'brightness(0.8) saturate(0.6) hue-rotate(10deg)', label: '出汁' },
          { progress: 100, filter: 'brightness(0.65) saturate(0.4) hue-rotate(25deg)', label: '翠绿汁' },
        ],
      },
    ],
  },
  ovulation: {
    name: '海鲜大餐',
    icon: seafood,
    tip: '排卵日补充优质蛋白，海鲜营养丰富，正是大展厨艺的好时机。',
    steps: [
      {
        action: '炙烤海鲜',
        description: '鲜虾贝类入锅，长按控制火候炙烤，滑动翻面',
        instruction: '先把虾和贝类拖入煎锅。然后长按锅柄控制火候，听到滋滋声后左右滑动翻面，烤至金黄微焦。',
        type: 'hold',
        cookType: 'heat',
        flipEnabled: true,
        flipTarget: 3,
        gesture: gestureDrag,
        gestureLabel: '控制火候+滑动翻面',
        ingredients: [{ img: shrimp, label: '鲜虾' }, { img: shellfish, label: '贝类' }],
        draggable: [{ img: shrimp, label: '鲜虾' }, { img: shellfish, label: '贝类' }],
        dropZoneLabel: '煎锅中',
        droppedMsg: '已入锅',
        utensil: fryingPan,
        utensilLabel: '煎锅',
        color: '#dc2626',
        ingredientStages: [
          { progress: 0, filter: 'brightness(0.9) saturate(0.6) hue-rotate(-5deg)', label: '生' },
          { progress: 35, filter: 'brightness(0.95) saturate(0.8) hue-rotate(2deg)', label: '变色中' },
          { progress: 70, filter: 'brightness(1.05) saturate(1.1) hue-rotate(8deg)', label: '半熟' },
          { progress: 100, filter: 'brightness(1.1) saturate(1.3) hue-rotate(15deg)', label: '金黄微焦' },
        ],
      },
    ],
  },
  luteal: {
    name: '蜂蜜吐司 + 姜汁水',
    icon: honeyToast,
    tip: '黄体期需要温暖的食物，蜂蜜舒缓情绪，生姜红糖水驱寒暖身。',
    steps: [
      {
        action: '涂抹蜂蜜',
        description: '蜂蜜慢慢涂抹在烤好的吐司上',
        instruction: '把蜂蜜拖到吐司上，按住缓慢涂抹，让每一寸都裹满金黄甜蜜。',
        type: 'hold',
        cookType: 'spread',
        gesture: gestureDrag,
        gestureLabel: '缓慢涂抹',
        ingredients: [{ img: honey, label: '蜂蜜' }],
        draggable: [{ img: honey, label: '蜂蜜' }],
        dropZoneLabel: '吐司上',
        droppedMsg: '已放上吐司',
        utensil: woodenPlate,
        utensilLabel: '木制餐盘',
        color: '#d97706',
        ingredientStages: [
          { progress: 0, filter: 'brightness(1) saturate(0.9)', label: '开始涂抹' },
          { progress: 50, filter: 'brightness(1.1) saturate(1.1) hue-rotate(3deg)', label: '半覆盖' },
          { progress: 100, filter: 'brightness(1.15) saturate(1.3) hue-rotate(8deg)', label: '金黄满溢' },
        ],
      },
      {
        action: '冲泡姜汁红糖水',
        description: '生姜切片加入红糖，热水冲泡',
        instruction: '把生姜和红糖拖入杯中，点击注入热水，看红糖慢慢融化，暖意升腾。',
        type: 'tap',
        cookType: 'brew',
        gesture: gesturePress,
        gestureLabel: '点击冲泡',
        ingredients: [{ img: ginger, label: '生姜' }, { img: brownSugar, label: '红糖' }],
        draggable: [{ img: ginger, label: '生姜' }, { img: brownSugar, label: '红糖' }],
        dropZoneLabel: '杯中',
        droppedMsg: '已入杯',
        utensil: gingerCup,
        utensilLabel: '姜汁水杯',
        color: '#b45309',
        ingredientStages: [
          { progress: 0, filter: 'brightness(0.95) saturate(0.8)', label: '放入' },
          { progress: 50, filter: 'brightness(1) saturate(0.9) hue-rotate(3deg)', label: '冲泡中' },
          { progress: 100, filter: 'brightness(1.05) saturate(1.1) hue-rotate(8deg)', label: '暖饮完成' },
        ],
      },
    ],
  },
}

const phaseQuotes = {
  period: '听从身体的暗涌，现在宜停泊蓄力。慢慢研磨，把压力变成香气。',
  follicular: '身体的四季正在回春。加一勺温甜，整理好帆布，向着阳光轻盈起航吧。',
  ovulation: '体内的潮汐正充满力量。去破浪疾驰吧，最热烈的盛宴正等你凯旋。',
  luteal: '虽然迷雾渐起，但意志决定航行。喝一口暖汤，稳住舵盘，我们平稳巡航。',
}

const phaseQuoteIcons = {
  period: '🌧️',
  follicular: '🌱',
  ovulation: '☀️',
  luteal: '🍂',
}

export default function Kitchen({ onBack, onOpenLighthouse }) {
  const { cycleData } = useCycle()
  const [dishRewards, setDishRewards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [tapCount, setTapCount] = useState(0)
  const holdIntervalRef = useRef(null)

  // 自定义菜单
  const [showCustomMenu, setShowCustomMenu] = useState(false)
  const customMenuRef = useRef(null)
  useEffect(() => {
    if (!showCustomMenu) return
    const handleClickOutside = (e) => {
      if (customMenuRef.current && !customMenuRef.current.contains(e.target)) {
        setShowCustomMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCustomMenu])

  // 自定义食谱
  const [customRecipes, setCustomRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [activeRecipeType, setActiveRecipeType] = useState('builtin') // 'builtin' | custom-id
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [editingCustomId, setEditingCustomId] = useState(null)
  const [customForm, setCustomForm] = useState({ name: '', emoji: '🍲', description: '', phase: '', cookType: 'heat', stepsText: '' })
  const [showManagePanel, setShowManagePanel] = useState(false)

  const saveCustomRecipes = (newData) => {
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(newData))
    setCustomRecipes(newData)
  }

  const handleAddCustomRecipe = () => {
    if (!customForm.name.trim() || !customForm.phase) return
    const steps = customForm.stepsText.trim()
      ? customForm.stepsText.split('\n').filter(s => s.trim()).map((text, i) => ({
          action: text.slice(0, 20) + (text.length > 20 ? '…' : ''),
          description: text,
          instruction: text,
          type: 'tap',
          cookType: customForm.cookType,
          gesture: null,
          gestureLabel: `点击推进`,
          ingredients: [],
          draggable: [],
          color: '#6366f1',
          ingredientStages: [
            { progress: 0, filter: 'brightness(1)', label: '开始' },
            { progress: 100, filter: 'brightness(1.1)', label: '完成' },
          ],
          tapProgressStep: Math.max(8, Math.floor(100 / Math.max(1, 3))),
        }))
      : [{
          action: customForm.name,
          description: customForm.description || '自定义烹饪',
          instruction: '点击烹饪区域推进进度，直到完成。',
          type: 'tap',
          cookType: customForm.cookType,
          gesture: null,
          gestureLabel: '点击推进',
          ingredients: [],
          draggable: [],
          color: '#6366f1',
          ingredientStages: [
            { progress: 0, filter: 'brightness(1)', label: '开始' },
            { progress: 100, filter: 'brightness(1.1)', label: '完成' },
          ],
          tapProgressStep: 10,
        }]

    const newRecipe = {
      id: Date.now(),
      name: customForm.name.trim(),
      icon: null,
      emoji: customForm.emoji,
      tip: customForm.description || '自定义食谱',
      steps,
      isCustom: true,
    }
    const phaseKey = customForm.phase
    const updated = { ...customRecipes, [phaseKey]: [...(customRecipes[phaseKey] || []), newRecipe] }
    saveCustomRecipes(updated)
    setShowCustomForm(false)
    setEditingCustomId(null)
    setCustomForm({ name: '', emoji: '🍲', description: '', phase: '', cookType: 'heat', stepsText: '' })
    setActiveRecipeType(newRecipe.id)
  }

  const handleEditCustomRecipe = (recipe) => {
    setCustomForm({
      name: recipe.name,
      emoji: recipe.emoji || '🍲',
      description: recipe.tip,
      phase: Object.keys(customRecipes).find(k => (customRecipes[k] || []).some(r => r.id === recipe.id)) || '',
      cookType: recipe.steps[0]?.cookType || 'heat',
      stepsText: recipe.steps.map(s => s.instruction || s.description).join('\n'),
    })
    setEditingCustomId(recipe.id)
    setShowCustomForm(true)
  }

  const handleDeleteCustomRecipe = (id) => {
    if (!window.confirm('确定要删除这个自定义食谱吗？')) return
    const updated = {}
    for (const key of Object.keys(customRecipes)) {
      updated[key] = customRecipes[key].filter(r => r.id !== id)
    }
    saveCustomRecipes(updated)
    if (activeRecipeType === id) setActiveRecipeType('builtin')
  }

  // === 拖拽状态 ===
  const [draggedIdx, setDraggedIdx] = useState(null)       // 正在拖拽的食材索引
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })   // 拖拽屏幕坐标
  const [droppedIndices, setDroppedIndices] = useState([])  // 已放入的食材索引列表
  const [isOverZone, setIsOverZone] = useState(false)       // 是否悬停在放置区
  const [dropAnimIdx, setDropAnimIdx] = useState(null)      // 刚放入的食材（触发弹入动画）
  const dropZoneRef = useRef(null)                          // 放置区 DOM ref
  const dragOffsetRef = useRef({ x: 0, y: 0 })             // 拖拽偏移

  // === 加热/翻面状态 ===
  const [flipCount, setFlipCount] = useState(0)              // 翻面次数
  const [flipAnim, setFlipAnim] = useState(false)            // 翻面动画触发
  const [heatRipples, setHeatRipples] = useState([])         // 热力波纹列表
  const [steamParticles, setSteamParticles] = useState([])   // 蒸汽粒子列表
  const lastSwipeXRef = useRef(0)
  const rippleTimerRef = useRef(null)
  const steamTimerRef = useRef(null)
  const cookingAreaRef = useRef(null)

  // === 滑动切菜状态 ===
  const [sliceTrails, setSliceTrails] = useState([])
  const [sliceCount, setSliceCount] = useState(0)
  const [sliceAnim, setSliceAnim] = useState(false)
  const sliceStartRef = useRef({ x: 0, y: 0 })
  const isSlicingRef = useRef(false)

  // === 滋滋声音引擎 ===
  const audioCtxRef = useRef(null)
  const sizzleNodesRef = useRef([])
  const sizzleTimerRef = useRef(null)
  const hissNodeRef = useRef(null)

  const ensureAudioCtx = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const startSizzle = (intensity = 0.3) => {
    try {
      const ctx = ensureAudioCtx()
      stopSizzle()
      const masterGain = ctx.createGain()
      masterGain.gain.value = 0.08 * intensity
      masterGain.connect(ctx.destination)
      sizzleNodesRef.current.push(masterGain)

      // 底层嘶嘶声：白噪声 highpass
      const bufferSize = ctx.sampleRate * 2
      const hissBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const hissData = hissBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) hissData[i] = Math.random() * 2 - 1
      const hissSrc = ctx.createBufferSource()
      hissSrc.buffer = hissBuffer
      hissSrc.loop = true
      const hissFilter = ctx.createBiquadFilter()
      hissFilter.type = 'highpass'
      hissFilter.frequency.value = 2500
      const hissGain = ctx.createGain()
      hissGain.gain.value = 0.06 * intensity
      hissSrc.connect(hissFilter)
      hissFilter.connect(hissGain)
      hissGain.connect(masterGain)
      hissSrc.start()
      sizzleNodesRef.current.push(hissSrc)
      hissNodeRef.current = { src: hissSrc, gain: hissGain }

      // 滋滋 crackle 调度
      const scheduleCrackle = () => {
        const delay = (0.03 + Math.random() * 0.12) / Math.max(intensity, 0.15)
        sizzleTimerRef.current = setTimeout(() => {
          const osc = ctx.createOscillator()
          osc.type = 'sawtooth'
          osc.frequency.value = 2000 + Math.random() * 5000
          const env = ctx.createGain()
          env.gain.setValueAtTime(0, ctx.currentTime)
          env.gain.linearRampToValueAtTime(0.015 + Math.random() * 0.05 * intensity, ctx.currentTime + 0.003)
          env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04 + Math.random() * 0.06)
          const bp = ctx.createBiquadFilter()
          bp.type = 'bandpass'
          bp.frequency.value = 3000 + Math.random() * 5000
          bp.Q.value = 1.5
          osc.connect(bp)
          bp.connect(env)
          env.connect(masterGain)
          osc.start(ctx.currentTime)
          osc.stop(ctx.currentTime + 0.25)
          sizzleNodesRef.current.push(osc)
          scheduleCrackle()
        }, delay * 1000)
      }
      scheduleCrackle()
    } catch {}
  }

  const updateSizzleIntensity = (intensity) => {
    if (hissNodeRef.current) {
      hissNodeRef.current.gain.gain.value = 0.06 * intensity
    }
  }

  const stopSizzle = () => {
    if (sizzleTimerRef.current) { clearTimeout(sizzleTimerRef.current); sizzleTimerRef.current = null }
    sizzleNodesRef.current.forEach(n => { try { n.stop?.(); n.disconnect?.() } catch {} })
    sizzleNodesRef.current = []
    hissNodeRef.current = null
  }

  // 清理音效
  const cleanupAudio = () => { stopSizzle(); if (audioCtxRef.current) { try { audioCtxRef.current.close() } catch {}; audioCtxRef.current = null } }

  const phase = cycleData?.phase?.name || 'follicular'
  const currentCustomRecipes = customRecipes[phase] || []
  const builtinRecipe = recipes[phase] || recipes.period
  const activeRecipe = activeRecipeType === 'builtin'
    ? builtinRecipe
    : (currentCustomRecipes.find(r => r.id === activeRecipeType) || builtinRecipe)
  const steps = activeRecipe.steps
  const currentStepData = steps[currentStep]

  // 当前食材阶段
  const currentStage = currentStepData?.ingredientStages
    ? currentStepData.ingredientStages.reduce((best, s) => progress >= s.progress ? s : best, currentStepData.ingredientStages[0])
    : null

  const saveDishRewards = (newRewards) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRewards))
    setDishRewards(newRewards)
  }

  // === 拖拽食材 ===
  const handleDragStart = (e, idx) => {
    e.preventDefault()
    const clientX = e.clientX || e.touches?.[0]?.clientX
    const clientY = e.clientY || e.touches?.[0]?.clientY
    const rect = e.currentTarget.getBoundingClientRect()
    dragOffsetRef.current = { x: clientX - rect.left, y: clientY - rect.top }
    setDraggedIdx(idx)
    setDragPos({ x: clientX, y: clientY })
  }

  const handleDragMove = (e) => {
    if (draggedIdx === null) return
    e.preventDefault()
    const clientX = e.clientX || e.touches?.[0]?.clientX
    const clientY = e.clientY || e.touches?.[0]?.clientY
    setDragPos({ x: clientX, y: clientY })
    // 检测是否悬停在放置区
    if (dropZoneRef.current) {
      const zoneRect = dropZoneRef.current.getBoundingClientRect()
      setIsOverZone(
        clientX >= zoneRect.left && clientX <= zoneRect.right &&
        clientY >= zoneRect.top && clientY <= zoneRect.bottom
      )
    }
  }

  const handleDragEnd = () => {
    if (draggedIdx !== null && isOverZone) {
      setDroppedIndices(prev => prev.includes(draggedIdx) ? prev : [...prev, draggedIdx])
      setDropAnimIdx(draggedIdx)
      setTimeout(() => setDropAnimIdx(null), 400)
    }
    setDraggedIdx(null)
    setIsOverZone(false)
  }

  // === 滑动切菜 ===
  const handleSliceStart = (e) => {
    if (!currentStepData || currentStepData.cookType !== 'chop' || !allDropped) return
    e.preventDefault()
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0
    sliceStartRef.current = { x: clientX, y: clientY }
    isSlicingRef.current = true
  }

  const handleSliceMove = (e) => {
    if (!isSlicingRef.current) return
    e.preventDefault()
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0
    const dx = clientX - sliceStartRef.current.x
    const dy = clientY - sliceStartRef.current.y
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      const rect = cookingAreaRef.current?.getBoundingClientRect()
      const trail = { id: Date.now(), x: clientX - (rect?.left || 0), y: clientY - (rect?.top || 0) }
      setSliceTrails(prev => [...prev.slice(-5), trail])
      setSliceCount(c => c + 1)
      setSliceAnim(true)
      setTimeout(() => setSliceAnim(false), 350)
      setProgress(p => {
        const newProgress = Math.min(p + 15, 100)
        if (newProgress >= 100) completeStep()
        return newProgress
      })
      sliceStartRef.current = { x: clientX, y: clientY }
    }
  }

  const handleSliceEnd = () => {
    isSlicingRef.current = false
  }

  // === 加热与翻面 ===
  const startHeat = (e) => {
    if (!currentStepData) return
    // tap 类型不支持加热
    if (currentStepData.type === 'tap' && currentStepData.cookType !== 'brew') return
    // 有拖拽食材但未全部放入时不允许加热
    if (currentStepData.draggable && currentStepData.draggable.length > 0 && droppedIndices.length < currentStepData.draggable.length) return
    setIsHolding(true)
    lastSwipeXRef.current = e.clientX || e.touches?.[0]?.clientX || 0
    // 启动滋滋声
    if (currentStepData.cookType === 'heat') startSizzle(0.3)
    // 启动热力波纹
    if (currentStepData.cookType === 'heat' || currentStepData.cookType === 'brew') {
      rippleTimerRef.current = setInterval(() => {
        setHeatRipples(prev => [...prev.slice(-4), Date.now()])
      }, 700)
      steamTimerRef.current = setInterval(() => {
        setSteamParticles(prev => [...prev.slice(-6), Date.now()])
      }, 500)
    }
    const interval = setInterval(() => {
      setProgress((p) => {
        const newProgress = Math.min(p + 2.5, 100)
        if (newProgress >= 100) {
          clearInterval(interval)
          holdIntervalRef.current = null
          completeStep()
          return 100
        }
        return newProgress
      })
    }, 50)
    holdIntervalRef.current = interval
  }

  const handleHeatMove = (e) => {
    if (!isHolding || !currentStepData?.flipEnabled) return
    const clientX = e.clientX || e.touches?.[0]?.clientX
    const delta = clientX - lastSwipeXRef.current
    if (Math.abs(delta) > 40) {
      setFlipCount(c => c + 1)
      setFlipAnim(true)
      setTimeout(() => setFlipAnim(false), 400)
      lastSwipeXRef.current = clientX
      // 翻面 bonus 进度
      setProgress(p => Math.min(p + 12, 100))
    }
  }

  const endHeat = () => {
    if (holdIntervalRef.current) { clearInterval(holdIntervalRef.current); holdIntervalRef.current = null }
    setIsHolding(false)
    if (rippleTimerRef.current) { clearInterval(rippleTimerRef.current); rippleTimerRef.current = null }
    if (steamTimerRef.current) { clearInterval(steamTimerRef.current); steamTimerRef.current = null }
    stopSizzle()
  }

  // tap 类型步骤的点击处理
  const handleTap = () => {
    if (!currentStepData) return
    if (currentStepData.type === 'hold' && currentStepData.cookType !== 'brew') return
    if (currentStepData.cookType === 'chop') return
    // 有拖拽食材但未全部放入
    if (currentStepData.draggable && currentStepData.draggable.length > 0 && droppedIndices.length < currentStepData.draggable.length) return
    const stepAmount = currentStepData.tapProgressStep || 12
    setTapCount((c) => c + 1)
    setProgress((p) => {
      const newProgress = Math.min(p + stepAmount, 100)
      if (newProgress >= 100) completeStep()
      return newProgress
    })
  }

  const completeStep = () => {
    if (holdIntervalRef.current) { clearInterval(holdIntervalRef.current); holdIntervalRef.current = null }
    setIsHolding(false)
    stopSizzle()
    if (rippleTimerRef.current) { clearInterval(rippleTimerRef.current); rippleTimerRef.current = null }
    if (steamTimerRef.current) { clearInterval(steamTimerRef.current); steamTimerRef.current = null }
    setHeatRipples([])
    setSteamParticles([])
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setProgress(0)
      setTapCount(0)
      setDroppedIndices([])
      setFlipCount(0)
      setHeatRipples([])
      setSteamParticles([])
      setSliceTrails([])
      setSliceCount(0)
    } else {
      setCompleted(true)
      cleanupAudio()
      saveDishRewards([...dishRewards, { id: Date.now(), name: activeRecipe.name, icon: activeRecipe.icon || null, emoji: activeRecipe.emoji || null, date: new Date().toLocaleDateString('zh-CN') }])
    }
  }

  const resetRecipe = () => {
    setCurrentStep(0); setCompleted(false); setProgress(0); setTapCount(0)
    setDroppedIndices([]); setFlipCount(0); setHeatRipples([]); setSteamParticles([])
    setSliceTrails([]); setSliceCount(0)
    cleanupAudio()
  }

  // 离开时清理
  const handleBack = () => { cleanupAudio(); onBack?.() }

  const circleR = 70
  const circleCircumference = 2 * Math.PI * circleR
  const circleDashoffset = circleCircumference * (1 - progress / 100)

  const allDropped = !currentStepData?.draggable || currentStepData.draggable.length === 0 || droppedIndices.length >= currentStepData.draggable.length

  // 全局拖拽事件
  useEffect(() => {
    const handleGlobalMove = (e) => { if (draggedIdx !== null) handleDragMove(e) }
    const handleGlobalEnd = () => { if (draggedIdx !== null) handleDragEnd() }
    window.addEventListener('mousemove', handleGlobalMove)
    window.addEventListener('mouseup', handleGlobalEnd)
    window.addEventListener('touchmove', handleGlobalMove, { passive: false })
    window.addEventListener('touchend', handleGlobalEnd)
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove)
      window.removeEventListener('mouseup', handleGlobalEnd)
      window.removeEventListener('touchmove', handleGlobalMove)
      window.removeEventListener('touchend', handleGlobalEnd)
    }
  }, [draggedIdx, isOverZone])

  // 清理
  useEffect(() => () => cleanupAudio(), [])

  const draggedIngredient = draggedIdx !== null && currentStepData?.draggable ? currentStepData.draggable[draggedIdx] : null

  return (
    <>
      <KitchenBackground />

      <div style={{ minHeight: '100vh', padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease-out' }}>
          <button onClick={handleBack} className="btn-elegant" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '1rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', transition: 'all 0.25s ease' }}>
            🏠 主页
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', flex: 1, color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.12)', letterSpacing: '0.04em' }}>
            海边厨房
          </h1>
          <button
            onClick={() => onOpenLighthouse?.('advice')}
            title="AI 饮食建议"
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
          >🤖</button>

          {/* 自定义菜单按钮 */}
          <div ref={customMenuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowCustomMenu(!showCustomMenu)}
              title="自定义菜单"
              style={{
                width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                background: showCustomMenu ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '1.1rem', color: 'white',
                transition: 'all 0.25s ease', marginLeft: '0.5rem',
              }}
              onMouseEnter={(e) => {
                if (!showCustomMenu) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.28)'
                  e.currentTarget.style.transform = 'scale(1.08)'
                }
              }}
              onMouseLeave={(e) => {
                if (!showCustomMenu) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
                  e.currentTarget.style.transform = 'scale(1)'
                }
              }}
            >⚙️</button>
            {showCustomMenu && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0,
                background: 'rgba(255,255,255,0.98)', borderRadius: '1rem',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.06)', padding: '0.5rem',
                minWidth: '13rem', zIndex: 50,
                animation: 'fadeInUp 0.2s ease-out',
              }}>
                {[
                  { icon: '✚', label: '添加自定义食谱', onClick: () => { setShowCustomMenu(false); setEditingCustomId(null); setCustomForm({ name: '', emoji: '🍲', description: '', phase, cookType: 'heat', stepsText: '' }); setShowCustomForm(true) } },
                  { icon: '📝', label: '管理我的自定义', onClick: () => { setShowCustomMenu(false); setShowManagePanel(true) } },
                ].map((item) => (
                  <div
                    key={item.label}
                    onClick={item.onClick}
                    style={{
                      padding: '0.55rem 0.75rem', borderRadius: '0.5rem',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                      fontSize: '0.85rem', color: '#374151', transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
                <div style={{ height: '1px', background: '#e5e7eb', margin: '0.25rem 0.5rem' }} />
                <div
                  onClick={() => setShowCustomMenu(false)}
                  style={{
                    padding: '0.55rem 0.75rem', borderRadius: '0.5rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.85rem', color: '#9ca3af', transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: '1rem' }}>❌</span>
                  <span>取消</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 时期提示语 */}
        <p style={{
          textAlign: 'center', color: 'rgba(255,255,255,0.92)',
          fontSize: '0.92rem', fontWeight: 500, lineHeight: 1.55, marginBottom: '0.6rem',
          padding: '0 0.5rem', animation: 'fadeInUp 0.5s ease-out 0.05s both',
          textShadow: '0 1px 6px rgba(0,0,0,0.2)',
        }}>
          🍳 {kitchenTips[phase]}
        </p>

        {/* 小汐定制建议提醒 */}
        <div
          onClick={() => onOpenLighthouse?.('advice')}
          style={{
            background: 'linear-gradient(135deg, #fef9c3, #fef3c7)',
            borderRadius: '1rem',
            padding: '0.75rem 1rem',
            marginBottom: '0.85rem',
            border: '2px dashed rgba(251,191,36,0.5)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            animation: 'fadeInUp 0.5s ease-out 0.12s both',
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
              💡 想要更适合你的专属饮食方案？去<strong>智慧灯塔</strong>找小汐获取定制化建议吧！
            </p>
          </div>
          <span style={{ fontSize: '1rem', color: '#f59e0b' }}>→</span>
        </div>

        {/* 食谱卡片 — 当前选中 */}
        <div style={{ background: 'rgba(255,255,255,0.94)', borderRadius: '1.25rem', padding: '0.85rem 1.25rem', marginBottom: '0.5rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.04)', border: `2px solid ${activeRecipeType === 'builtin' ? '#6366f1' : 'rgba(255,255,255,0.5)'}`, animation: 'fadeInUp 0.5s ease-out 0.1s both', display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer', transition: 'border 0.2s ease' }}
          onClick={() => { setActiveRecipeType('builtin'); resetRecipe() }}
        >
          {activeRecipeType === 'builtin' ? (
            <>
              <img src={builtinRecipe.icon} alt={builtinRecipe.name} style={{ width: '3rem', height: '3rem', objectFit: 'contain', flexShrink: 0 }} />
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>{builtinRecipe.name}</h2>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.15rem', lineHeight: 1.4 }}>{builtinRecipe.tip}</p>
              </div>
              {activeRecipeType === 'builtin' && <span style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: 600 }}>✓ 当前</span>}
            </>
          ) : (
            <>
              <span style={{ fontSize: '2.5rem', flexShrink: 0 }}>{activeRecipe.emoji || '🍲'}</span>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <h2 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937' }}>{activeRecipe.name}</h2>
                <p style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '0.15rem', lineHeight: 1.4 }}>{activeRecipe.tip}</p>
              </div>
              {activeRecipeType !== 'builtin' && <span style={{ color: '#6366f1', fontSize: '0.7rem', fontWeight: 600 }}>✓ 当前</span>}
            </>
          )}
        </div>

        {/* 自定义食谱快捷切换 */}
        {currentCustomRecipes.length > 0 && currentCustomRecipes.filter(r => r.id !== activeRecipeType).map(r => (
          <div key={r.id} onClick={() => { setActiveRecipeType(r.id); resetRecipe() }}
            style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '1rem', padding: '0.55rem 1rem', marginBottom: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 1px 6px rgba(0,0,0,0.03)', border: '1px solid rgba(255,255,255,0.5)', animation: 'fadeInUp 0.3s ease-out', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.95)'; e.currentTarget.style.borderColor = '#6366f1' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)' }}
          >
            <span style={{ fontSize: '1.6rem' }}>{r.emoji || '🍲'}</span>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151' }}>{r.name}</span>
              <span style={{ fontSize: '0.65rem', color: '#9ca3af', marginLeft: '0.5rem' }}>{r.steps.length}步</span>
            </div>
            <span style={{ fontSize: '0.65rem', color: '#6366f1', fontWeight: 500, opacity: 0.8 }}>点击切换</span>
          </div>
        ))}

        {/* 厨房场景 */}
        {!completed ? (
          <div style={{ background: 'rgba(255,255,255,0.93)', borderRadius: '1.5rem', padding: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)', animation: 'fadeInUp 0.5s ease-out 0.15s both' }}>
            {/* 阶段引语 */}
            {phaseQuotes[phase] && (
              <div style={{
                textAlign: 'center', marginBottom: '0.65rem',
                padding: '0.5rem 0.75rem',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))',
                borderRadius: '0.6rem', border: '1px solid rgba(255,255,255,0.4)',
              }}>
                <span style={{ fontSize: '1rem' }}>{phaseQuoteIcons[phase]}</span>
                <p style={{
                  color: '#4a3728', fontSize: '0.7rem', fontWeight: 500,
                  lineHeight: 1.6, letterSpacing: '0.02em',
                  fontFamily: '"Noto Serif SC", "STKaiti", "KaiTi", Georgia, serif',
                  marginTop: '0.1rem',
                }}>
                  {phaseQuotes[phase]}
                </p>
              </div>
            )}

            {/* 步骤指示器 */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              {steps.map((_, idx) => (
                <div key={idx} style={{
                  width: idx <= currentStep ? '1.5rem' : '0.35rem',
                  height: '0.35rem', borderRadius: '9999px',
                  background: idx < currentStep ? '#10b981' : idx === currentStep ? currentStepData.color : '#e5e7eb',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem', fontSize: '0.7rem' }}>
              <span style={{ color: '#6b7280', fontWeight: 600 }}>步骤 {currentStep + 1}/{steps.length}</span>
              <span style={{ color: currentStepData.color, fontWeight: 600 }}>{currentStage?.label && `🥩 ${currentStage.label}`}</span>
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', textAlign: 'center', marginBottom: '0.15rem' }}>
              {currentStepData.action}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', textAlign: 'center', marginBottom: '0.65rem' }}>
              {currentStepData.description}
            </p>

            {/* === 拖拽食材区 === */}
            {currentStepData.draggable && currentStepData.draggable.length > 0 && (
              <div style={{
                background: '#fffbeb', borderRadius: '0.65rem', padding: '0.6rem 0.75rem',
                marginBottom: '0.65rem', border: '1px solid rgba(251,191,36,0.2)',
              }}>
                <span style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 600 }}>
                  🥬 食材原料（拖拽入{currentStepData.dropZoneLabel || '锅'}）
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {currentStepData.draggable.map((ing, i) => {
                    const isDropped = droppedIndices.includes(i)
                    const isDragging = draggedIdx === i
                    const justDropped = dropAnimIdx === i
                    return (
                      <div
                        key={i}
                        onMouseDown={(e) => !isDropped && handleDragStart(e, i)}
                        onTouchStart={(e) => !isDropped && handleDragStart(e, i)}
                        style={{
                          textAlign: 'center', cursor: isDropped ? 'default' : 'grab',
                          opacity: isDragging ? 0.5 : 1,
                          transition: 'all 0.2s ease',
                          animation: justDropped ? 'dropBounce 0.4s ease-out' : 'none',
                        }}
                      >
                        <img src={ing.img} alt={ing.label} style={{
                          width: '3rem', height: '3rem', objectFit: 'contain',
                          borderRadius: '0.4rem', background: 'white', padding: '0.15rem',
                          border: isDropped ? `2px solid #10b981` : '2px dashed #d4a574',
                          filter: isDropped ? 'brightness(0.8) saturate(0.5)' : 'none',
                          transition: 'all 0.2s ease',
                        }} />
                        <div style={{ fontSize: '0.6rem', color: isDropped ? '#10b981' : '#78716c', marginTop: '0.1rem' }}>
                          {isDropped ? `✓ ${currentStepData.droppedMsg || '已放入'}` : `拖拽${ing.label}`}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* === 烹饪区（放置区 + 加热区） === */}
            <div
              ref={cookingAreaRef}
              style={{
                background: `linear-gradient(135deg, ${currentStepData.color}10, ${currentStepData.color}18)`,
                borderRadius: '1rem', padding: '0.75rem',
                marginBottom: '0.65rem',
                border: isOverZone
                  ? `2.5px dashed ${currentStepData.color}`
                  : isHolding
                  ? `2px solid ${currentStepData.color}60`
                  : `2px dashed ${currentStepData.color}40`,
                position: 'relative', overflow: 'hidden',
                transition: 'border 0.2s ease, box-shadow 0.2s ease',
                boxShadow: isHolding ? `0 0 25px ${currentStepData.color}30` : 'none',
                cursor: allDropped ? (currentStepData?.cookType === 'chop' ? 'ew-resize' : 'pointer') : 'default',
              }}
              onMouseDown={allDropped ? (currentStepData?.cookType === 'chop' ? handleSliceStart : startHeat) : undefined}
              onMouseUp={allDropped ? (currentStepData?.cookType === 'chop' ? handleSliceEnd : endHeat) : undefined}
              onMouseLeave={allDropped ? (currentStepData?.cookType === 'chop' ? handleSliceEnd : endHeat) : undefined}
              onMouseMove={allDropped ? (currentStepData?.cookType === 'chop' ? handleSliceMove : handleHeatMove) : undefined}
              onTouchStart={allDropped ? (e) => { e.preventDefault(); currentStepData?.cookType === 'chop' ? handleSliceStart(e) : startHeat(e) } : undefined}
              onTouchEnd={allDropped ? (currentStepData?.cookType === 'chop' ? handleSliceEnd : endHeat) : undefined}
              onTouchMove={allDropped ? (currentStepData?.cookType === 'chop' ? handleSliceMove : handleHeatMove) : undefined}
              onClick={currentStepData?.cookType !== 'chop' && currentStepData.type === 'tap' && allDropped ? handleTap : undefined}
            >
              {/* 热力波纹 */}
              {heatRipples.map(id => (
                <div key={id} style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: '60px', height: '60px',
                  borderRadius: '50%',
                  border: `2px solid ${currentStepData.color}40`,
                  animation: 'heatRipple 1.2s ease-out forwards',
                  pointerEvents: 'none',
                }} />
              ))}

              {/* 蒸汽 */}
              {steamParticles.map(id => (
                <div key={id} style={{
                  position: 'absolute', top: '30%', left: `${20 + Math.random() * 60}%`,
                  width: '16px', height: '16px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.4)',
                  filter: 'blur(6px)',
                  animation: 'steamRise 1.6s ease-out forwards',
                  pointerEvents: 'none',
                }} />
              ))}

              {/* 热浪扭曲 overlay */}
              {isHolding && currentStepData.cookType === 'heat' && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(90deg, transparent 0%, ${currentStepData.color}08 30%, ${currentStepData.color}12 50%, ${currentStepData.color}08 70%, transparent 100%)`,
                  backgroundSize: '200% 100%',
                  animation: 'heatShimmer 1.5s linear infinite',
                  pointerEvents: 'none',
                }} />
              )}

              {/* 切菜刀光轨迹 */}
              {currentStepData?.cookType === 'chop' && sliceTrails.map(trail => (
                <div key={trail.id} style={{
                  position: 'absolute', left: trail.x - 30, top: trail.y,
                  width: '60px', height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
                  borderRadius: '1px',
                  pointerEvents: 'none', zIndex: 5,
                  animation: 'sliceTrail 0.5s ease-out forwards',
                }} />
              ))}

              {/* 放置区内容 */}
              <div
                ref={dropZoneRef}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  minHeight: '5.5rem', position: 'relative', zIndex: 1,
                }}
              >
                {/* 器具图 */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <img
                    src={currentStepData.utensil}
                    alt={currentStepData.utensilLabel}
                    style={{
                      width: '5rem', height: '5rem', objectFit: 'contain',
                      borderRadius: '0.5rem', background: 'white', padding: '0.25rem',
                      transition: 'filter 0.3s ease',
                      filter: isHolding ? 'brightness(1.08) saturate(1.1)' : 'none',
                      animation: isHolding && currentStepData.cookType === 'heat' ? 'sizzlePop 0.15s ease-in-out infinite' : 'none',
                    }}
                  />
                  <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '0.1rem' }}>
                    {isOverZone ? '👇 松手放入！' : currentStepData.utensilLabel}
                  </div>
                </div>

                {/* 已放入的食材 */}
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  {currentStepData.draggable && currentStepData.draggable.map((ing, i) => {
                    if (!droppedIndices.includes(i)) return null
                    return (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <img
                          src={ing.img}
                          alt={ing.label}
                          style={{
                            width: '3rem', height: '3rem', objectFit: 'contain',
                            borderRadius: '0.4rem', background: 'white', padding: '0.15rem',
                            filter: currentStage?.filter || 'none',
                            transition: 'filter 0.5s ease',
                            animation: currentStepData?.cookType === 'chop' && sliceAnim ? 'ingredientSplit 0.35s ease-out' : flipAnim ? 'flipCard 0.4s ease-in-out' : 'none',
                          }}
                        />
                        <div style={{ fontSize: '0.55rem', color: '#78716c', marginTop: '0.05rem' }}>
                          {ing.label}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 未放入食材提示 */}
              {!allDropped && currentStepData.draggable && currentStepData.draggable.length > 0 && (
                <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.65rem', marginTop: '0.35rem', position: 'relative', zIndex: 1 }}>
                  👆 先把食材拖拽到{currentStepData.dropZoneLabel || '烹饪区'}
                </p>
              )}

              {/* 进度环 + 控制提示 */}
              {allDropped && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem', position: 'relative', zIndex: 1 }}>
                  <div style={{ position: 'relative', width: '4rem', height: '4rem' }}>
                    <svg width="4rem" height="4rem" style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx="2rem" cy="2rem" r="1.6rem" fill="none" stroke="#e5e7eb" strokeWidth="5" />
                      <circle cx="2rem" cy="2rem" r="1.6rem" fill="none"
                        stroke={isHolding ? '#ef4444' : currentStepData.color}
                        strokeWidth="5"
                        strokeDasharray={2 * Math.PI * 1.6 * 16}
                        strokeDashoffset={2 * Math.PI * 1.6 * 16 * (1 - progress / 100)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.1s ease' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '1rem' }}>
                        {isHolding ? '🔥' : currentStepData.type === 'hold' ? '🤏' : '👆'}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151' }}>{Math.round(progress)}%</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', textAlign: 'center', lineHeight: 1.5 }}>
                    {currentStepData.cookType === 'chop'
                      ? '👉 左右快速滑动切菜！'
                      : !isHolding
                        ? (currentStepData.type === 'hold'
                          ? `长按${currentStepData.gestureLabel}`
                          : `点击${currentStepData.gestureLabel}`)
                        : currentStepData.flipEnabled
                        ? `加热中… 左右滑动翻面！`
                        : `${currentStepData.gestureLabel}中…`
                    }
                    {currentStepData.flipEnabled && (
                      <span style={{ display: 'block', color: currentStepData.color, fontWeight: 600, marginTop: '0.15rem' }}>
                        🖐️ 翻面 {flipCount} 次
                      </span>
                    )}
                    {currentStepData.type === 'tap' && allDropped && currentStepData.cookType !== 'chop' && (
                      <span style={{ display: 'block', color: '#9ca3af' }}>{tapCount} 次点击</span>
                    )}
                    {currentStepData.cookType === 'chop' && allDropped && (
                      <span style={{ display: 'block', color: currentStepData.color, fontWeight: 600, marginTop: '0.15rem' }}>
                        🔪 已切 {sliceCount} 刀
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 烹饪指导 */}
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7, #fef9c3)',
              borderRadius: '0.65rem', padding: '0.6rem 0.85rem', marginBottom: '0.5rem',
              border: '1px solid rgba(251,191,36,0.3)',
            }}>
              <span style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 600 }}>📖 烹饪指导</span>
              <p style={{ fontSize: '0.72rem', color: '#78350f', marginTop: '0.25rem', lineHeight: 1.5 }}>
                {currentStepData.instruction}
              </p>
            </div>

            {/* 目标成品 */}
            <div style={{
              background: 'linear-gradient(135deg, #fff7ed, #fff1f2)',
              borderRadius: '0.65rem', padding: '0.5rem 0.75rem',
              border: '1.5px dashed rgba(251,146,60,0.3)',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
            }}>
              {activeRecipe.icon ? (
                <img src={activeRecipe.icon} alt={activeRecipe.name} style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain', borderRadius: '0.4rem', background: 'white', padding: '0.15rem', flexShrink: 0 }} />
              ) : (
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{activeRecipe.emoji || '🍲'}</span>
              )}
              <div>
                <span style={{ fontSize: '0.65rem', color: '#ea580c', fontWeight: 600 }}>🎯 目标成品</span>
                <p style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 700, marginTop: '0.05rem' }}>{activeRecipe.name}</p>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.94)', borderRadius: '1.75rem', padding: '2rem', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)', border: '1px solid rgba(255,255,255,0.5)', animation: 'fadeInUp 0.5s ease-out' }}>
            {activeRecipe.icon ? (
              <img src={activeRecipe.icon} alt={activeRecipe.name} style={{ width: '7rem', height: '7rem', objectFit: 'contain', margin: '0 auto 1rem' }} />
            ) : (
              <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{activeRecipe.emoji || '🍲'}</div>
            )}
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>🍽️ 制作完成！</h3>
            <p style={{ color: '#6b7280', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{activeRecipe.name}</p>
            <p style={{ color: '#9ca3af', marginBottom: '1.5rem', fontSize: '0.85rem' }}>用心烹饪的美食，好好享用吧 🌸</p>
            <button onClick={resetRecipe} className="btn-elegant" style={{ padding: '0.75rem 2rem', background: 'linear-gradient(to right, #ea580c, #c2410c)', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
              再做一份
            </button>
          </div>
        )}

        {/* 历史记录 */}
        {dishRewards.length > 0 && (
          <div style={{ marginTop: '1.5rem', animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
            <h3 style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>已制作的料理：</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {dishRewards.slice(-4).map((dish) => (
                <span key={dish.id} style={{ background: 'rgba(255,255,255,0.95)', padding: '0.5rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  {dish.icon ? <img src={dish.icon} alt={dish.name} style={{ width: '1.25rem', height: '1.25rem', objectFit: 'contain' }} /> : <span>{dish.emoji || '🍲'}</span>} {dish.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 拖拽中的浮动食材 */}
      {draggedIngredient && (
        <div style={{
          position: 'fixed', zIndex: 1000,
          left: dragPos.x - dragOffsetRef.current.x,
          top: dragPos.y - dragOffsetRef.current.y,
          pointerEvents: 'none', opacity: 0.85,
          transform: 'scale(1.1)',
          filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.25))',
        }}>
          <img
            src={draggedIngredient.img}
            alt={draggedIngredient.label}
            style={{ width: '4rem', height: '4rem', objectFit: 'contain', borderRadius: '0.5rem', background: 'white', padding: '0.2rem' }}
          />
          <div style={{ textAlign: 'center', fontSize: '0.6rem', color: '#374151', fontWeight: 600, marginTop: '0.1rem' }}>
            {draggedIngredient.label}
          </div>
        </div>
      )}

      {/* ======== 自定义食谱表单弹窗 ======== */}
      {showCustomForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => { setShowCustomForm(false); setEditingCustomId(null) }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: '26rem', maxHeight: '85vh', overflowY: 'auto', background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', animation: 'fadeInUp 0.25s ease-out' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>
              {editingCustomId ? '✏️ 编辑自定义食谱' : '✚ 添加自定义食谱'}
            </h3>

            {/* 名称 */}
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>食谱名称 *</label>
            <input value={customForm.name} onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
              placeholder="如：暖心红枣茶"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '0.9rem', marginBottom: '0.75rem', outline: 'none', boxSizing: 'border-box' }} />

            {/* Emoji 图标 */}
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>食谱图标</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {FOOD_EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => setCustomForm({ ...customForm, emoji })}
                  style={{
                    width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem', border: customForm.emoji === emoji ? '2px solid #6366f1' : '1px solid #e5e7eb',
                    background: customForm.emoji === emoji ? '#eef2ff' : 'white', fontSize: '1.1rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                  }}>{emoji}</button>
              ))}
            </div>

            {/* 选择时期 */}
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>适配时期 *</label>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {['period', 'follicular', 'ovulation', 'luteal'].map(p => (
                <button key={p} onClick={() => setCustomForm({ ...customForm, phase: p })}
                  style={{
                    padding: '0.4rem 0.75rem', borderRadius: '9999px', border: customForm.phase === p ? '2px solid #6366f1' : '1px solid #e5e7eb',
                    background: customForm.phase === p ? '#eef2ff' : 'white', fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                    color: customForm.phase === p ? '#4338ca' : '#6b7280', transition: 'all 0.15s ease',
                  }}>
                  {{ period: '🌑 经期', follicular: '🌱 卵泡期', ovulation: '☀️ 排卵期', luteal: '🍂 黄体期' }[p]}
                </button>
              ))}
            </div>

            {/* 烹饪方式 */}
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>烹饪方式</label>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              {Object.entries(COOK_TYPES).map(([key, val]) => (
                <button key={key} onClick={() => setCustomForm({ ...customForm, cookType: key })}
                  style={{
                    padding: '0.4rem 0.6rem', borderRadius: '9999px', border: customForm.cookType === key ? '2px solid #6366f1' : '1px solid #e5e7eb',
                    background: customForm.cookType === key ? '#eef2ff' : 'white', fontSize: '0.75rem', fontWeight: 500, cursor: 'pointer',
                    color: customForm.cookType === key ? '#4338ca' : '#6b7280', transition: 'all 0.15s ease',
                  }}>{val.label}</button>
              ))}
            </div>

            {/* 简短描述 */}
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>简短描述</label>
            <input value={customForm.description} onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
              placeholder="如：暖身养胃、清甜回甘"
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '0.9rem', marginBottom: '0.75rem', outline: 'none', boxSizing: 'border-box' }} />

            {/* 步骤列表 */}
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.25rem' }}>烹饪步骤（每行一步）</label>
            <textarea value={customForm.stepsText} onChange={(e) => setCustomForm({ ...customForm, stepsText: e.target.value })}
              placeholder={"准备食材：洗净切好备用\n开火烹饪：中火加热至沸腾\n调味装盘：加入调味料后出锅"}
              rows={4}
              style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontSize: '0.85rem', resize: 'none', outline: 'none', marginBottom: '1rem', boxSizing: 'border-box', lineHeight: 1.6 }} />

            {/* 按钮 */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={handleAddCustomRecipe}
                style={{ flex: 1, padding: '0.75rem', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', background: 'linear-gradient(to right, #6366f1, #4f46e5)', color: 'white' }}>
                💾 {editingCustomId ? '保存修改' : '添加食谱'}
              </button>
              <button onClick={() => { setShowCustomForm(false); setEditingCustomId(null) }}
                style={{ padding: '0.75rem 1.25rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem', background: '#f9fafb', color: '#374151' }}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======== 管理自定义食谱面板 ======== */}
      {showManagePanel && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setShowManagePanel(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'relative', width: '100%', maxWidth: '26rem', maxHeight: '80vh', overflowY: 'auto', background: 'white', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.25)', animation: 'fadeInUp 0.25s ease-out' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', marginBottom: '1rem' }}>📝 管理我的自定义食谱</h3>
            {Object.keys(customRecipes).length === 0 || Object.values(customRecipes).every(arr => arr.length === 0) ? (
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>还没有自定义食谱，点击"✚ 添加自定义食谱"开始创建吧</p>
            ) : (
              Object.entries(customRecipes).map(([phaseKey, recipeList]) => {
                if (!recipeList || recipeList.length === 0) return null
                const phaseName = { period: '经期', follicular: '卵泡期', ovulation: '排卵期', luteal: '黄体期' }[phaseKey] || phaseKey
                return (
                  <div key={phaseKey} style={{ marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6366f1', marginBottom: '0.5rem' }}>📌 {phaseName}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {recipeList.map(r => (
                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                          <span style={{ fontSize: '1.5rem' }}>{r.emoji || '🍲'}</span>
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1f2937' }}>{r.name}</span>
                            <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginLeft: '0.4rem' }}>{r.steps.length}步 · {r.tip}</span>
                          </div>
                          <button onClick={() => { setShowManagePanel(false); handleEditCustomRecipe(r) }}
                            style={{ padding: '0.3rem 0.6rem', borderRadius: '0.5rem', border: 'none', background: '#eef2ff', color: '#4338ca', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 500 }}
                          >✏️</button>
                          <button onClick={() => handleDeleteCustomRecipe(r.id)}
                            style={{ padding: '0.3rem 0.6rem', borderRadius: '0.5rem', border: 'none', background: '#fef2f2', color: '#dc2626', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 500 }}
                          >🗑️</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
            <button onClick={() => setShowManagePanel(false)}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', background: '#f9fafb', color: '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  )
}
