import { useState } from 'react'
import { useCycle } from '../context/CycleContext'

export default function Entry({ onRegister }) {
  const { register } = useCycle()
  const [lastPeriod, setLastPeriod] = useState('')
  const [duration, setDuration] = useState(5)
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!lastPeriod) return
    try {
      register(lastPeriod, duration)
      onRegister()
    } catch (err) {
      console.error('Register error:', err)
      setError(err)
    }
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #64748b, #475569)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        <div style={{ padding: '2rem', background: '#fee2e2', borderRadius: '1rem', color: '#dc2626' }}>
          Error: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景装饰 - 柔和光斑 */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(250, 204, 21, 0.3), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'pulseGlow 5s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-50px',
        left: '-50px',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3), transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'pulseGlow 6s ease-in-out infinite 1s',
      }} />

      {/* 浮游粒子 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${10 + i * 15}%`,
              bottom: `${-10 + (i % 3) * 20}%`,
              width: `${8 + (i % 3) * 4}px`,
              height: `${8 + (i % 3) * 4}px`,
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.7), rgba(255,255,255,0.1))',
              borderRadius: '50%',
              animation: `bubbleFloat ${10 + i}s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* 主卡片 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.96)',
        borderRadius: '2rem',
        padding: '2.5rem 2rem',
        maxWidth: '28rem',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        zIndex: 1,
        animation: 'scaleIn 0.5s ease-out',
        border: '1px solid rgba(255, 255, 255, 0.5)',
      }}>
        {/* Logo 区域 */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '4.5rem', marginBottom: '0.75rem' }}>
            🏝️
          </div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #0891b2, #0e7490)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            汐岛
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.95rem' }}>
            欢迎来到你的专属小岛
          </p>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* 日期输入 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
            }}>
              📅 最近一次月经开始日期
            </label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                borderRadius: '1rem',
                border: '2px solid #e5e7eb',
                fontSize: '1rem',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: 'white',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0891b2'
                e.target.style.boxShadow = '0 0 0 4px rgba(8, 145, 178, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* 持续天数 */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.5rem',
            }}>
              ⏱️ 持续天数
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className="btn-elegant"
                  style={{
                    flex: 1,
                    padding: '0.875rem',
                    borderRadius: '0.875rem',
                    border: 'none',
                    background: duration === d ? 'linear-gradient(135deg, #0891b2, #0e7490)' : '#f3f4f6',
                    color: duration === d ? 'white' : '#374151',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <button
            type="submit"
            className="btn-elegant"
            style={{
              width: '100%',
              padding: '1.125rem',
              background: 'linear-gradient(135deg, #0891b2, #0e7490)',
              color: 'white',
              borderRadius: '1rem',
              fontSize: '1.125rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(8, 145, 178, 0.3)',
              marginTop: '0.5rem',
              letterSpacing: '0.02em',
            }}
          >
            登岛 🌴
          </button>
        </form>
      </div>
    </div>
  )
}
