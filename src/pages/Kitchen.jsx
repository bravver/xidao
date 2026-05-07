import { useState } from 'react'
import { useCycle } from '../context/CycleContext'
import KitchenBackground from '../components/KitchenBackground'

const STORAGE_KEY = 'xidao_kitchen_rewards'

const recipes = {
  period: { name: '热可可 + 烤红薯', icon: '🍫', tip: '经期喝热可可可以暖身舒缓，红薯富含纤维和维生素。' },
  follicular: { name: '青柠莫吉托', icon: '🍋', tip: '卵泡期适合清爽饮品，青柠富含维生素C。' },
  ovulation: { name: '海鲜大餐', icon: '🦐', tip: '排卵日是补充蛋白质的好时机，海鲜营养丰富。' },
  luteal: { name: '蜂蜜吐司 + 姜汁水', icon: '🍞', tip: '黄体期适合温热食物，生姜有助于缓解不适。' },
}

const cookingSteps = {
  period: [{ action: '研磨可可豆', description: '连续点击研磨可可', type: 'tap' }, { action: '放入红薯', description: '点击放入烤箱', type: 'tap' }],
  follicular: [{ action: '切青柠', description: '快速点击切片', type: 'tap' }, { action: '捣碎薄荷', description: '连续点击捣碎', type: 'tap' }],
  ovulation: [{ action: '炙烤海鲜', description: '长按控制火候', type: 'hold' }],
  luteal: [{ action: '涂抹蜂蜜', description: '缓慢拖拽涂抹', type: 'tap' }, { action: '倒入姜汁', description: '点击倒入', type: 'tap' }],
}

export default function Kitchen({ onBack }) {
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

  const phase = cycleData?.phase?.name || 'follicular'
  const recipe = recipes[phase] || recipes.period
  const steps = cookingSteps[phase] || cookingSteps.period
  const currentStepData = steps[currentStep]

  const saveDishRewards = (newRewards) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRewards))
    setDishRewards(newRewards)
  }

  const handleTap = () => {
    if (!currentStepData || currentStepData.type !== 'tap') return
    setProgress((p) => {
      const newProgress = Math.min(p + 15, 100)
      if (newProgress >= 100) completeStep()
      return newProgress
    })
  }

  const completeStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
      setProgress(0)
    } else {
      setCompleted(true)
      saveDishRewards([...dishRewards, { id: Date.now(), name: recipe.name, icon: recipe.icon, date: new Date().toLocaleDateString('zh-CN') }])
    }
  }

  const resetRecipe = () => { setCurrentStep(0); setCompleted(false); setProgress(0) }

  return (
    <>
      <KitchenBackground />

      <div style={{ minHeight: '100vh', padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease-out' }}>
          <button onClick={onBack} className="btn-elegant" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%', width: '2.75rem', height: '2.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            ←
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', flex: 1, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
            海边厨房
          </h1>
          <div style={{ width: '2.75rem' }} />
        </div>

        {/* 食谱卡片 */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{recipe.icon}</div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{recipe.name}</h2>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', lineHeight: 1.5 }}>{recipe.tip}</p>
        </div>

        {/* 厨房场景 */}
        {!completed ? (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.5rem', padding: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
              <span style={{ color: '#6b7280' }}>步骤 {currentStep + 1} / {steps.length}</span>
              <span style={{ color: '#9ca3af' }}>{currentStepData?.action}</span>
            </div>

            <div style={{ height: '0.75rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ height: '100%', background: 'linear-gradient(to right, #fb923c, #ea580c)', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.2s' }} />
            </div>

            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1f2937', textAlign: 'center', marginBottom: '0.25rem' }}>{currentStepData?.action}</h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem' }}>{currentStepData?.description}</p>

            <div onClick={handleTap} className="btn-elegant" style={{ height: '11rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'linear-gradient(to bottom, #ffedd5, #fed7aa)', fontSize: '3rem' }}>
              👆
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.5rem', padding: '2rem', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.5s ease-out' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{recipe.icon}</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>制作完成！</h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>好好享用吧 🌸</p>
            <button onClick={resetRecipe} className="btn-elegant" style={{ padding: '0.75rem 2rem', background: 'linear-gradient(to right, #ea580c, #c2410c)', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
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
                <span key={dish.id} style={{ background: 'rgba(255,255,255,0.95)', padding: '0.5rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem' }}>{dish.icon} {dish.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
