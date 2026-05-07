import { useState } from 'react'
import { useCycle } from '../context/CycleContext'
import GymBackground from '../components/GymBackground'

const STORAGE_KEY = 'xidao_gym_rewards'

const exercises = {
  period: [{ name: '冥想', icon: '🧘', description: '在软垫上静坐呼吸', reward: '🍫 可可豆' }],
  follicular: [
    { name: '罗马尼亚硬拉', icon: '🏋️', description: '双手持哑铃向下', reward: '🍋 青柠' },
    { name: '弹力带侧步走', icon: '🦵', description: '左右交替迈步', reward: '🌿 薄荷' },
    { name: '哑铃侧平举', icon: '💪', description: '由中心向两侧画弧', reward: '🍹 莫吉托' },
  ],
  ovulation: [
    { name: '冲浪', icon: '🏄', description: '左右倾斜身体', reward: '🦐 海鲜' },
    { name: '游泳', icon: '🏊', description: '划水前进', reward: '🐟 鲜鱼' },
  ],
  luteal: [
    { name: '划艇', icon: '🛶', description: '左右交替划动', reward: '🥤 生姜汽水' },
    { name: '慢跑', icon: '🏃', description: '节奏稳定的慢跑', reward: '🍞 吐司' },
  ],
}

const gymTips = {
  period: '经期适合轻度运动，冥想和伸展是不错的选择。',
  follicular: '卵泡期体力充沛，可以尝试力量训练和有氧运动。',
  ovulation: '排卵日是本月运动高峰期，适合挑战性运动。',
  luteal: '黄体期适合舒缓运动，避免过度疲劳。',
}

export default function Gym({ onBack }) {
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

  const phase = cycleData?.phase?.name || 'follicular'
  const currentExercises = exercises[phase] || exercises.period

  const saveRewards = (newRewards) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newRewards))
    setRewards(newRewards)
  }

  const startExercise = (exercise) => {
    setCurrentExercise(exercise)
    setProgress(0)
  }

  const handleInteraction = () => {
    if (!currentExercise) return
    setProgress((p) => {
      const newProgress = Math.min(p + 15, 100)
      if (newProgress >= 100) completeExercise()
      return newProgress
    })
  }

  const completeExercise = () => {
    if (!currentExercise) return
    const newCompleted = [...completed, currentExercise.name]
    setCompleted(newCompleted)
    const newRewards = [...rewards, { id: Date.now(), name: currentExercise.reward, exercise: currentExercise.name, date: new Date().toLocaleDateString('zh-CN') }]
    saveRewards(newRewards)
    setShowReward(currentExercise.reward)
    setTimeout(() => { setShowReward(null); setCurrentExercise(null); setProgress(0) }, 1500)
  }

  return (
    <>
      <GymBackground />

      <div style={{ minHeight: '100vh', padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease-out' }}>
          <button onClick={onBack} className="btn-elegant" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%', width: '2.75rem', height: '2.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            ←
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', flex: 1, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
            海边健身房
          </h1>
          <div style={{ width: '2.75rem' }} />
        </div>

        {/* 提示 */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.25rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
          <p style={{ color: '#374151', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.6 }}>💪 {gymTips[phase]}</p>
        </div>

        {/* 奖励展示 */}
        {rewards.length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
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
          <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.5rem', padding: '1.5rem', animation: 'fadeInUp 0.5s ease-out' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{currentExercise.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>{currentExercise.name}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>{currentExercise.description}</p>
            </div>

            <div style={{ height: '1rem', background: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1rem' }}>
              <div style={{ height: '100%', background: 'linear-gradient(to right, #34d399, #059669)', borderRadius: '9999px', width: `${progress}%`, transition: 'width 0.2s' }} />
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>{progress < 100 ? '继续做动作...' : '✓ 完成！'}</p>

            <div onClick={handleInteraction} className="btn-elegant" style={{ height: '10rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'linear-gradient(to bottom, #d1fae5, #a7f3d0)', fontSize: '3rem' }}>
              👆 点击！
            </div>

            <button onClick={() => setCurrentExercise(null)} className="btn-elegant" style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
              取消
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.875rem', fontWeight: 600 }}>选择动作：</h3>
            {currentExercises.map((exercise, index) => {
              const isCompleted = completed.includes(exercise.name)
              return (
                <button
                  key={exercise.name}
                  onClick={() => !isCompleted && startExercise(exercise)}
                  className="module-card"
                  style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.5rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', border: 'none', cursor: isCompleted ? 'default' : 'pointer', opacity: isCompleted ? 0.7 : 1, animation: `fadeInUp 0.4s ease-out ${0.3 + index * 0.1}s both` }}
                >
                  <div style={{ fontSize: '3rem' }}>{exercise.icon}</div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <h4 style={{ fontWeight: 'bold', color: '#1f2937' }}>{exercise.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{exercise.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.875rem' }}>{exercise.reward}</span>
                    {isCompleted && <div style={{ color: '#10b981', fontSize: '0.75rem', marginTop: '0.25rem' }}>✓ 已完成</div>}
                  </div>
                </button>
              )
            })}
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
