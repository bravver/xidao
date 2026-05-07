import { useState } from 'react'
import { useCycle } from '../context/CycleContext'
import BeachBackground from '../components/BeachBackground'

const STORAGE_KEY = 'xidao_emotions'

const emotionTypes = {
  period: { name: '深色鹅卵石', icon: '🪨' },
  follicular: { name: '马卡龙贝壳', icon: '🐚' },
  ovulation: { name: '发光珍珠贝', icon: '✨' },
  luteal: { name: '棱角海星', icon: '⭐' },
}

const emotionLabels = [
  { label: '平静', icon: '😌' },
  { label: '愉悦', icon: '😊' },
  { label: '焦虑', icon: '😰' },
  { label: '疲惫', icon: '😫' },
  { label: '低落', icon: '😔' },
  { label: '兴奋', icon: '🤩' },
  { label: '烦躁', icon: '😤' },
  { label: '敏感', icon: '🥺' },
]

const emotionTips = {
  period: '经期情绪波动是正常的，好好接纳自己的感受。',
  follicular: '卵泡期心情愉悦，适合记录美好的小确幸。',
  ovulation: '排卵日情绪高涨，适合和朋友分享快乐。',
  luteal: '黄体期可能会有情绪低落，写下来帮助释放压力。',
}

export default function Beach({ onBack }) {
  const { cycleData } = useCycle()
  const [emotions, setEmotions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [selectedLabels, setSelectedLabels] = useState([])
  const [note, setNote] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const phase = cycleData?.phase?.name || 'follicular'
  const currentEmotion = emotionTypes[phase]

  const saveEmotions = (newEmotions) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEmotions))
    setEmotions(newEmotions)
  }

  const toggleLabel = (label) => {
    setSelectedLabels(selectedLabels.includes(label) ? selectedLabels.filter((l) => l !== label) : [...selectedLabels, label])
  }

  const handleSave = () => {
    if (selectedLabels.length === 0) return
    const emotion = { id: Date.now(), labels: [...selectedLabels], note, date: new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    saveEmotions([emotion, ...emotions])
    setSelectedLabels([])
    setNote('')
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)
  }

  return (
    <>
      <BeachBackground phase={phase} />

      <div style={{ minHeight: '100vh', padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease-out' }}>
          <button onClick={onBack} className="btn-elegant" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.95)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '50%', width: '2.75rem', height: '2.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            ←
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', flex: 1, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
            情绪海滩
          </h1>
          <div style={{ width: '2.75rem' }} />
        </div>

        {/* 提示 */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.25rem', padding: '1rem 1.25rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
          <p style={{ color: '#374151', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.6 }}>💭 {emotionTips[phase]}</p>
        </div>

        {/* 情绪标签 */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.5rem', padding: '1rem', marginBottom: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.75rem' }}>选择此刻的心情：</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {emotionLabels.map((item) => (
              <button
                key={item.label}
                onClick={() => toggleLabel(item.label)}
                className="btn-elegant"
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  background: selectedLabels.includes(item.label) ? '#8b5cf6' : '#f3f4f6',
                  color: selectedLabels.includes(item.label) ? 'white' : '#374151',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 备注 */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.5rem', padding: '1rem', marginBottom: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="写下此刻的想法...（可选）" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: 'none', resize: 'none', fontSize: '0.875rem', background: 'transparent' }} rows={3} />
        </div>

        {/* 保存按钮 */}
        <button
          onClick={handleSave}
          disabled={selectedLabels.length === 0}
          className="btn-elegant"
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '1rem',
            fontSize: '1.125rem',
            fontWeight: 600,
            border: 'none',
            cursor: selectedLabels.length > 0 ? 'pointer' : 'not-allowed',
            background: selectedLabels.length > 0 ? 'linear-gradient(to right, #8b5cf6, #ec4899)' : '#d1d5db',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: selectedLabels.length > 0 ? '0 8px 24px rgba(139, 92, 246, 0.3)' : 'none',
            animation: 'fadeInUp 0.5s ease-out 0.4s both',
          }}
        >
          <span style={{ fontSize: '1.25rem' }}>{currentEmotion.icon}</span>
          <span>封存到{currentEmotion.name}</span>
        </button>

        {/* 成功提示 */}
        {showSuccess && (
          <div style={{ position: 'fixed', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(to right, #10b981, #059669)', color: 'white', padding: '1rem 2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 50 }}>
            <span style={{ fontSize: '1.25rem' }}>{currentEmotion.icon}</span>
            <span style={{ fontWeight: 600 }}>已封存</span>
          </div>
        )}

        {/* 历史记录 */}
        {emotions.length > 0 && (
          <div style={{ marginTop: '1.5rem', animation: 'fadeInUp 0.5s ease-out 0.5s both' }}>
            <h3 style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>历史记录</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '16rem', overflowY: 'auto' }}>
              {emotions.slice(0, 10).map((emotion) => (
                <div key={emotion.id} style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1rem', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {emotion.labels.map((l) => {
                      const item = emotionLabels.find((el) => el.label === l)
                      return <span key={l} style={{ background: '#f3e8ff', color: '#7c3aed', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.125rem' }}>{item?.icon} {l}</span>
                    })}
                  </div>
                  {emotion.note && <p style={{ fontSize: '0.875rem', color: '#374151' }}>{emotion.note}</p>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                    <span>{emotion.date}</span>
                    <span>{currentEmotion.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
