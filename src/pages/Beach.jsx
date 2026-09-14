import { useState } from 'react'
import { useCycle } from '../context/CycleContext'
import BeachBackground from '../components/BeachBackground'
import pebble1 from '../assets/2.4.素材收集/2.2情绪封存物图标/深色鹅卵石.png'
import pebble2 from '../assets/2.4.素材收集/2.2情绪封存物图标/深色鹅卵石3.png'
import shell1 from '../assets/2.4.素材收集/2.2情绪封存物图标/贝壳.png'
import shell2 from '../assets/2.4.素材收集/2.2情绪封存物图标/贝壳2.png'
import pearl from '../assets/2.4.素材收集/2.2情绪封存物图标/发光珍珠贝.png'
import starfish1 from '../assets/2.4.素材收集/2.2情绪封存物图标/棱角海星.png'
import iconPeace from '../assets/2.4.素材收集/2.3情绪标签图标/平静.png'
import iconHappy from '../assets/2.4.素材收集/2.3情绪标签图标/愉悦.png'
import iconAnxious from '../assets/2.4.素材收集/2.3情绪标签图标/焦虑.png'
import iconTired from '../assets/2.4.素材收集/2.3情绪标签图标/疲惫.png'
import iconDown from '../assets/2.4.素材收集/2.3情绪标签图标/低落.png'
import iconExcited from '../assets/2.4.素材收集/2.3情绪标签图标/兴奋.png'
import iconIrritable from '../assets/2.4.素材收集/2.3情绪标签图标/烦躁.png'
import iconSensitive from '../assets/2.4.素材收集/2.3情绪标签图标/敏感.png'

const STORAGE_KEY = 'xidao_emotions'

const emotionTypes = {
  period: { name: '深色鹅卵石', icon: pebble1 },
  follicular: { name: '马卡龙贝壳', icon: shell1 },
  ovulation: { name: '发光珍珠贝', icon: pearl },
  luteal: { name: '棱角海星', icon: starfish1 },
}

const emotionLabels = [
  { label: '平静', icon: iconPeace },
  { label: '愉悦', icon: iconHappy },
  { label: '焦虑', icon: iconAnxious },
  { label: '疲惫', icon: iconTired },
  { label: '低落', icon: iconDown },
  { label: '兴奋', icon: iconExcited },
  { label: '烦躁', icon: iconIrritable },
  { label: '敏感', icon: iconSensitive },
]

const emotionTips = {
  period: '激素进入低谷平稳期，容易安静内敛、情绪敏感低落。允许自己放慢脚步，接纳当下心境，安心记录情绪、自我和解疗愈。',
  follicular: '雌激素带动多巴胺分泌，心态轻松明快、逻辑与创造力在线。适合立目标、做规划，趁着状态正好，尝试一直犹豫的新尝试。',
  ovulation: '激素加持下自信果敢、气场外放，表现力与感染力拉满。大胆表达自我、主动挑战难题，尽情释放自身光芒与能力。',
  luteal: '激素节律切换，容易莫名疲惫、焦虑烦躁、情绪起伏变大。这是正常生理反应，放平心态减少内耗，静心蓄力、平稳度过周期波动。',
}

export default function Beach({ onBack, onOpenLighthouse }) {
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
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editLabels, setEditLabels] = useState([])
  const [editNote, setEditNote] = useState('')

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

  const openDetail = (emotion) => {
    setSelectedEmotion(emotion)
    setIsEditing(false)
    setEditLabels([...emotion.labels])
    setEditNote(emotion.note || '')
  }

  const handleEditSave = () => {
    if (!selectedEmotion || editLabels.length === 0) return
    const updated = emotions.map((e) => e.id === selectedEmotion.id ? { ...e, labels: editLabels, note: editNote } : e)
    saveEmotions(updated)
    setSelectedEmotion(null)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (!selectedEmotion) return
    if (window.confirm('确定要删除这条情绪记录吗？')) {
      saveEmotions(emotions.filter((e) => e.id !== selectedEmotion.id))
      setSelectedEmotion(null)
    }
  }

  const toggleEditLabel = (label) => {
    setEditLabels(editLabels.includes(label) ? editLabels.filter((l) => l !== label) : [...editLabels, label])
  }

  return (
    <>
      <BeachBackground phase={phase} />

      <div style={{ minHeight: '100vh', padding: '1.5rem', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', animation: 'fadeInUp 0.5s ease-out' }}>
          <button onClick={onBack} className="btn-elegant" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '1rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', transition: 'all 0.25s ease' }}>
            🏠 主页
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textAlign: 'center', flex: 1, color: 'white', textShadow: '0 2px 16px rgba(0,0,0,0.12)', letterSpacing: '0.04em' }}>
            情绪海滩
          </h1>
          <button
            onClick={() => onOpenLighthouse?.('companion')}
            title="AI 情绪陪伴"
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
          >💬</button>
        </div>

        {/* 提示 */}
        <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '1.25rem', padding: '1.15rem 1.5rem', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1.5px solid rgba(139,92,246,0.2)', animation: 'fadeInUp 0.5s ease-out 0.1s both' }}>
          <p style={{ color: '#475569', fontSize: '1.1rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.6, letterSpacing: '0.02em' }}>💭 {emotionTips[phase]}</p>
        </div>

        {/* 情绪标签 */}
        <div style={{ background: 'rgba(255,255,255,0.93)', borderRadius: '1.5rem', padding: '1.15rem', marginBottom: '0.85rem', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)', animation: 'fadeInUp 0.5s ease-out 0.2s both' }}>
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
                <img src={item.icon} alt={item.label} style={{ width: '1.25rem', height: '1.25rem', objectFit: 'contain' }} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 备注 */}
        <div style={{ background: 'rgba(255,255,255,0.93)', borderRadius: '1.5rem', padding: '1.15rem', marginBottom: '0.85rem', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.5)', animation: 'fadeInUp 0.5s ease-out 0.3s both' }}>
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
          <img src={currentEmotion.icon} alt={currentEmotion.name} style={{ width: '1.5rem', height: '1.5rem', objectFit: 'contain' }} />
          <span>封存到{currentEmotion.name}</span>
        </button>

        {/* 成功提示 */}
        {showSuccess && (
          <div style={{ position: 'fixed', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(to right, #10b981, #059669)', color: 'white', padding: '1rem 2rem', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 50 }}>
            <img src={currentEmotion.icon} alt="" style={{ width: '1.5rem', height: '1.5rem', objectFit: 'contain' }} />
            <span style={{ fontWeight: 600 }}>已封存</span>
          </div>
        )}

        {/* 历史记录 */}
        {emotions.length > 0 && (
          <div style={{ marginTop: '1.5rem', animation: 'fadeInUp 0.5s ease-out 0.5s both' }}>
            <h3 style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>历史记录 · 点击查看详情</h3>
            <div
              className="history-scroll-list"
              style={{
                maxHeight: 'min(50vh, 420px)',
                overflowY: 'auto',
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
                paddingRight: '0.5rem',
                borderRadius: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {emotions.map((emotion) => (
                  <div
                    key={emotion.id}
                    onClick={() => openDetail(emotion)}
                    style={{
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: '1rem',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0,
                    }}
                    className="module-card"
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      {emotion.labels.map((l) => {
                        const item = emotionLabels.find((el) => el.label === l)
                        return <span key={l} style={{ background: '#f3e8ff', color: '#7c3aed', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.125rem' }}><img src={item?.icon} alt={l} style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} /> {l}</span>
                      })}
                    </div>
                    {emotion.note && <p style={{ fontSize: '0.875rem', color: '#374151' }}>{emotion.note}</p>}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
                      <span>{emotion.date}</span>
                      <img src={currentEmotion.icon} alt="" style={{ width: '1.25rem', height: '1.25rem', objectFit: 'contain' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 情绪详情弹窗 */}
      {selectedEmotion && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 30 }} onClick={() => { setSelectedEmotion(null); setIsEditing(false) }}>
          <div style={{ background: 'rgba(255,255,255,0.98)', borderRadius: '1.5rem', padding: '1.5rem', maxWidth: '26rem', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            {isEditing ? (
              <>
                <h3 style={{ fontWeight: 700, color: '#1f2937', marginBottom: '0.75rem' }}>✏️ 编辑情绪记录</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                  {emotionLabels.map((item) => (
                    <button key={item.label} onClick={() => toggleEditLabel(item.label)} className="btn-elegant" style={{ padding: '0.4rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', background: editLabels.includes(item.label) ? '#8b5cf6' : '#f3f4f6', color: editLabels.includes(item.label) ? 'white' : '#374151' }}>
                      <img src={item.icon} alt={item.label} style={{ width: '1rem', height: '1rem', objectFit: 'contain' }} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
                <textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} placeholder="写下此刻的想法..." style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', resize: 'none', fontSize: '0.875rem', marginBottom: '1rem' }} rows={3} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleEditSave} className="btn-elegant" style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(to right, #8b5cf6, #7c3aed)', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>💾 保存</button>
                  <button onClick={() => setIsEditing(false)} className="btn-elegant" style={{ flex: 1, padding: '0.75rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>取消</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <img src={currentEmotion.icon} alt="" style={{ width: '3.5rem', height: '3.5rem', objectFit: 'contain', margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{selectedEmotion.date}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', justifyContent: 'center' }}>
                  {selectedEmotion.labels.map((l) => {
                    const item = emotionLabels.find((el) => el.label === l)
                    return <span key={l} style={{ background: '#f3e8ff', color: '#7c3aed', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><img src={item?.icon} alt={l} style={{ width: '1.1rem', height: '1.1rem', objectFit: 'contain' }} /> {l}</span>
                  })}
                </div>
                {selectedEmotion.note ? <p style={{ color: '#374151', fontSize: '0.95rem', lineHeight: 1.6, background: '#f9fafb', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>{selectedEmotion.note}</p> : <p style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem' }}>没有备注</p>}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => setIsEditing(true)} className="btn-elegant" style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(to right, #8b5cf6, #7c3aed)', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>✏️ 编辑</button>
                  <button onClick={handleDelete} className="btn-elegant" style={{ flex: 1, padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>🗑️ 删除</button>
                </div>
              </>
            )}
            <button onClick={() => { setSelectedEmotion(null); setIsEditing(false) }} className="btn-elegant" style={{ width: '100%', marginTop: '0.5rem', padding: '0.6rem', background: 'transparent', color: '#6b7280', borderRadius: '0.75rem', border: 'none', fontWeight: 500, cursor: 'pointer' }}>关闭</button>
          </div>
        </div>
      )}
    </>
  )
}
