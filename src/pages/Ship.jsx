import { useState } from 'react'
import { useCycle } from '../context/CycleContext'
import ShipBackground from '../components/ShipBackground'

const STORAGE_KEY = 'xidao_ship_logs'

const shipEmojis = {
  period: '🚢',
  follicular: '⛵',
  ovulation: '🚀',
  luteal: '⛴️',
}

const phaseTips = {
  period: '经期第一天，好好休息很重要。可以做一些轻度工作或阅读。',
  follicular: '卵泡期精力充沛，适合处理复杂任务和学习新知识。',
  ovulation: '排卵日是本月状态高峰期，适合重要会议和社交活动。',
  luteal: '黄体期适合整理和回顾，为下个周期做准备。',
}

export default function Ship({ onBack }) {
  const { cycleData } = useCycle()
  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [newLog, setNewLog] = useState('')
  const [showInput, setShowInput] = useState(false)

  const phase = cycleData?.phase?.name || 'follicular'

  const saveLogs = (newLogs) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs))
    setLogs(newLogs)
  }

  const handleAddLog = () => {
    if (!newLog.trim()) return
    const log = {
      id: Date.now(),
      text: newLog,
      date: new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }
    saveLogs([log, ...logs])
    setNewLog('')
    setShowInput(false)
  }

  return (
    <>
      <ShipBackground />

      <div style={{
        minHeight: '100vh',
        padding: '1.5rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.5rem',
          animation: 'fadeInUp 0.5s ease-out',
        }}>
          <button
            onClick={onBack}
            className="btn-elegant"
            style={{
              fontSize: '1.25rem',
              color: 'rgba(255,255,255,0.95)',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '50%',
              width: '2.75rem',
              height: '2.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            textAlign: 'center',
            flex: 1,
            color: 'white',
            textShadow: '0 2px 10px rgba(0,0,0,0.15)',
          }}>
            航海日志
          </h1>
          <div style={{ width: '2.75rem' }} />
        </div>

        {/* 船只展示 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          animation: 'fadeInUp 0.5s ease-out 0.1s both',
        }}>
          <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.15))' }}>
            {shipEmojis[phase]}
          </div>
        </div>

        {/* 提示卡片 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '1.25rem',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          animation: 'fadeInUp 0.5s ease-out 0.2s both',
        }}>
          <p style={{ color: '#374151', fontSize: '0.9rem', textAlign: 'center', lineHeight: 1.6 }}>
            💡 {phaseTips[phase]}
          </p>
        </div>

        {/* 输入卡片 */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '1.5rem',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
          animation: 'fadeInUp 0.5s ease-out 0.3s both',
        }}>
          {showInput ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <textarea
                value={newLog}
                onChange={(e) => setNewLog(e.target.value)}
                placeholder="记录今天的工作或学习成果..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '1rem',
                  border: '2px solid #e5e7eb',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#0891b2'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                rows={4}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleAddLog} className="btn-elegant" style={{ flex: 1, padding: '0.875rem', background: 'linear-gradient(135deg, #0891b2, #0e7490)', color: 'white', borderRadius: '0.875rem', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
                  保存
                </button>
                <button onClick={() => setShowInput(false)} className="btn-elegant" style={{ flex: 1, padding: '0.875rem', background: '#f3f4f6', color: '#374151', borderRadius: '0.875rem', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}>
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="btn-elegant"
              style={{
                width: '100%',
                padding: '1.25rem',
                border: '2px dashed #cbd5e1',
                borderRadius: '1rem',
                background: 'none',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              <span style={{ fontSize: '1.25rem' }}>+</span>
              <span>添加日志</span>
            </button>
          )}
        </div>

        {/* 日志列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.95)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
            历史记录
          </h3>
          {logs.map((log, index) => (
            <div
              key={log.id}
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '1.25rem',
                padding: '1.125rem 1.25rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                animation: `fadeInUp 0.4s ease-out ${0.4 + index * 0.05}s both`,
              }}
            >
              <p style={{ color: '#1f2937', fontSize: '0.95rem', lineHeight: 1.6 }}>{log.text}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f3f4f6' }}>
                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{log.date}</span>
                <span style={{ fontSize: '1rem' }}>🌊</span>
              </div>
            </div>
          ))}
          {logs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 0', animation: 'fadeInUp 0.5s ease-out 0.4s both' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem', opacity: 0.7 }}>📝</div>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>还没有日志记录</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', marginTop: '0.25rem' }}>点击上方按钮开始记录</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
