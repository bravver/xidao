import { useState } from 'react'
import { useCycle } from '../context/CycleContext'
import islandPhoto from '../assets/island-photo.png'

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
      setError(err)
    }
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #64748b, #475569)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ padding: '2rem', background: '#fee2e2', borderRadius: '1rem', color: '#dc2626' }}>
          Error: {error.message}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(175deg, #0b3d5c 0%, #0c5a7a 20%, #0e7490 45%, #0a9396 65%, #0b5e6b 85%, #083d44 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ============================================
          背景大气层 — 柔光雾团
          ============================================ */}

      {/* 上层金色光晕 — 黎明破晓 */}
      <div style={{
        position: 'absolute',
        top: '-15%', left: '-20%',
        width: '70%', height: '60%',
        background: 'radial-gradient(ellipse at 30% 40%, rgba(255,220,160,0.18) 0%, rgba(255,180,100,0.08) 30%, rgba(255,160,80,0.03) 55%, transparent 75%)',
        filter: 'blur(40px)',
        animation: 'softBreath 8s ease-in-out infinite',
      }} />

      {/* 右侧暖光团 */}
      <div style={{
        position: 'absolute',
        top: '5%', right: '-18%',
        width: '55%', height: '50%',
        background: 'radial-gradient(ellipse at 70% 35%, rgba(255,200,140,0.15) 0%, rgba(255,170,100,0.06) 35%, transparent 65%)',
        filter: 'blur(50px)',
        animation: 'softBreath 9s ease-in-out infinite 2s',
      }} />

      {/* 中层海雾带 — 水平雾团层层叠加 */}
      <div style={{
        position: 'absolute',
        top: '25%', left: '-10%',
        width: '120%', height: '25%',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(180,210,230,0.2) 0%, rgba(150,200,220,0.1) 30%, transparent 70%)',
        filter: 'blur(35px)',
        animation: 'driftSlow 12s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        top: '35%', left: '-5%',
        width: '110%', height: '22%',
        background: 'radial-gradient(ellipse at 60% 50%, rgba(200,220,240,0.16) 0%, rgba(170,200,225,0.08) 40%, transparent 70%)',
        filter: 'blur(45px)',
        animation: 'driftSlow 14s ease-in-out infinite 3s',
      }} />
      <div style={{
        position: 'absolute',
        top: '45%', left: '-15%',
        width: '130%', height: '20%',
        background: 'radial-gradient(ellipse at 40% 50%, rgba(190,215,235,0.13) 0%, rgba(160,200,225,0.06) 35%, transparent 65%)',
        filter: 'blur(55px)',
        animation: 'driftSlow 16s ease-in-out infinite 5s',
      }} />

      {/* 底部深海光带 */}
      <div style={{
        position: 'absolute',
        bottom: '0', left: '-5%',
        width: '110%', height: '35%',
        background: 'radial-gradient(ellipse at 50% 80%, rgba(20,120,160,0.25) 0%, rgba(10,80,120,0.15) 30%, rgba(5,40,80,0.08) 60%, transparent 80%)',
        filter: 'blur(30px)',
      }} />

      {/* ============================================
          光线 — 斜射光束
          ============================================ */}

      {/* 主光束 — 从左上 */}
      <div style={{
        position: 'absolute',
        top: '-30%', left: '-10%',
        width: '70%', height: '130%',
        background: 'linear-gradient(160deg, rgba(255,240,210,0.1) 0%, rgba(255,220,170,0.05) 20%, transparent 50%, transparent 100%)',
        transform: 'skewX(-8deg)',
        filter: 'blur(15px)',
      }} />

      {/* 副光束 — 从左上更窄 */}
      <div style={{
        position: 'absolute',
        top: '-20%', left: '5%',
        width: '40%', height: '120%',
        background: 'linear-gradient(165deg, rgba(255,235,200,0.08) 0%, rgba(255,210,150,0.03) 25%, transparent 55%)',
        transform: 'skewX(-5deg)',
        filter: 'blur(20px)',
      }} />

      {/* 水面微光 — 横条光斑 */}
      <div style={{
        position: 'absolute',
        bottom: '20%', left: '15%',
        width: '25%', height: '4px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,240,0.15), rgba(255,255,240,0.2), rgba(255,255,240,0.1), transparent)',
        borderRadius: '2px',
        filter: 'blur(3px)',
        animation: 'tideLine 4s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '18%', right: '20%',
        width: '18%', height: '3px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,240,0.12), rgba(255,255,245,0.16), transparent)',
        borderRadius: '2px',
        filter: 'blur(2px)',
        animation: 'tideLine 5s ease-in-out infinite 2s',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '22%', left: '40%',
        width: '15%', height: '3px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,240,0.1), transparent)',
        borderRadius: '1px',
        filter: 'blur(2px)',
        animation: 'tideLine 4.5s ease-in-out infinite 1s',
      }} />

      {/* ============================================
          粒子 — 光尘 / 海沫
          ============================================ */}

      {/* 大光尘 — 缓慢漂移 */}
      {[...Array(8)].map((_, i) => (
        <div key={`mote-${i}`} style={{
          position: 'absolute',
          left: `${10 + (i * 11) % 85}%`,
          top: `${15 + (i * 10) % 70}%`,
          width: `${6 + (i % 3) * 8}px`,
          height: `${6 + (i % 3) * 8}px`,
          background: `radial-gradient(circle at 35% 35%, ${i % 3 === 0 ? 'rgba(255,240,210,0.7)' : i % 3 === 1 ? 'rgba(200,230,255,0.6)' : 'rgba(255,220,180,0.55)'}, transparent)`,
          borderRadius: '50%',
          filter: 'blur(2px)',
          animation: `floatMote ${6 + i * 1.5}s ease-in-out infinite ${i * 1.2}s`,
        }} />
      ))}

      {/* 小光点 — 密集微光 */}
      {[...Array(12)].map((_, i) => (
        <div key={`speck-${i}`} style={{
          position: 'absolute',
          left: `${8 + (i * 8.5) % 88}%`,
          top: `${8 + (i * 7.5) % 78}%`,
          width: `${2 + (i % 2) * 2}px`,
          height: `${2 + (i % 2) * 2}px`,
          background: 'rgba(255,255,250,0.7)',
          borderRadius: '50%',
          boxShadow: '0 0 6px rgba(255,255,240,0.5)',
          animation: `starTwinkle ${3 + i * 0.7}s ease-in-out infinite ${i * 0.6}s`,
        }} />
      ))}

      {/* ============================================
          主卡片
          ============================================ */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '2.25rem',
        padding: '2.5rem 2rem 2.25rem',
        maxWidth: '26rem',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,30,50,0.18), 0 0 0 1px rgba(255,255,255,0.4), 0 0 100px rgba(100,180,210,0.12)',
        position: 'relative',
        zIndex: 1,
        animation: 'scaleIn 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.5)',
      }}>
        {/* 顶端柔光条 */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '55%', height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(14,165,233,0.35), rgba(56,189,248,0.45), rgba(14,165,233,0.35), transparent)',
          borderRadius: '0 0 2px 2px',
        }} />

        {/* ---- 岛屿标识区 ---- */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>

          {/* 岛屿照片 — 悬浮在光晕中 */}
          <div style={{
            display: 'inline-block',
            position: 'relative',
            marginBottom: '1rem',
          }}>
            {/* 外层光晕 */}
            <div style={{
              position: 'absolute',
              inset: '-14px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(56,189,248,0.25) 0%, rgba(14,165,233,0.1) 40%, rgba(100,200,230,0.04) 65%, transparent 75%)',
              filter: 'blur(10px)',
              animation: 'pulseGlow 5s ease-in-out infinite',
            }} />
            {/* 中层暖光 */}
            <div style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,240,210,0.3) 0%, rgba(255,220,170,0.1) 50%, transparent 70%)',
              filter: 'blur(6px)',
            }} />
            {/* 照片 */}
            <img
              src={islandPhoto}
              alt="汐岛"
              style={{
                width: '5rem',
                height: '5rem',
                objectFit: 'cover',
                borderRadius: '50%',
                display: 'block',
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 6px 24px rgba(0,0,0,0.12), 0 0 0 3px rgba(255,255,255,0.5)',
              }}
            />
          </div>

          {/* 标题 */}
          <h1 style={{
            fontSize: '2.6rem',
            fontWeight: 700,
            background: 'linear-gradient(160deg, #0369a1 0%, #0a9396 35%, #0ea5e9 65%, #0284c7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.2rem',
            letterSpacing: '0.07em',
          }}>
            汐岛
          </h1>

          {/* 副标题 */}
          <p style={{
            color: '#5b7d8c',
            fontSize: '0.9rem',
            margin: 0,
            letterSpacing: '0.05em',
            fontWeight: 300,
          }}>
            潮汐之间，遇见自己
          </p>
        </div>

        {/* ---- 表单 ---- */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* 日期输入 */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.85rem', fontWeight: 600, color: '#334155',
              marginBottom: '0.45rem',
              letterSpacing: '0.02em',
            }}>
              <span style={{ fontSize: '1.05rem' }}>📅</span>
              最近一次月经开始日期
            </label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.95rem 1.15rem',
                borderRadius: '1rem',
                border: '1.5px solid #e0e8ed',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'all 0.3s ease',
                background: '#f7fafb',
                color: '#1e3b4c',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#0ea5e9'
                e.target.style.boxShadow = '0 0 0 4px rgba(14,165,233,0.08)'
                e.target.style.background = 'white'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e8ed'
                e.target.style.boxShadow = 'none'
                e.target.style.background = '#f7fafb'
              }}
            />
          </div>

          {/* 持续天数 */}
          <div>
            <label style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.85rem', fontWeight: 600, color: '#334155',
              marginBottom: '0.45rem',
              letterSpacing: '0.02em',
            }}>
              <span style={{ fontSize: '1.05rem' }}>⏱️</span>
              持续天数
            </label>
            <div style={{ display: 'flex', gap: '0.45rem' }}>
              {[3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className="btn-elegant"
                  style={{
                    flex: 1,
                    padding: '0.8rem 0.25rem',
                    borderRadius: '0.85rem',
                    border: duration === d ? '2px solid #0ea5e9' : '1.5px solid #e2e8f0',
                    background: duration === d
                      ? 'linear-gradient(150deg, #0ea5e9, #0891b2)'
                      : '#f8fafb',
                    color: duration === d ? 'white' : '#475569',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    boxShadow: duration === d ? '0 4px 14px rgba(14,165,233,0.22)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (duration !== d) {
                      e.target.style.background = '#eef4f7'
                      e.target.style.borderColor = '#cbd5e1'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (duration !== d) {
                      e.target.style.background = '#f8fafb'
                      e.target.style.borderColor = '#e2e8f0'
                    }
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
              padding: '1.05rem',
              background: 'linear-gradient(155deg, #0a9396 0%, #0ea5e9 40%, #0891b2 70%, #0369a1 100%)',
              color: 'white',
              borderRadius: '1rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 28px rgba(10,147,150,0.28)',
              marginTop: '0.4rem',
              letterSpacing: '0.04em',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 14px 35px rgba(10,147,150,0.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(10,147,150,0.28)'
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>登岛  🏝️</span>
            {/* 按钮光泽扫过 */}
            <div style={{
              position: 'absolute', top: 0, left: '-60%', width: '50%', height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
              transform: 'skewX(-20deg)',
              animation: 'shimmer 3.5s ease-in-out infinite',
            }} />
          </button>
        </form>
      </div>

      {/* ============================================
          CSS 动画
          ============================================ */}
      <style>{`
        @keyframes floatMote {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25% { transform: translateY(-18px) translateX(8px); opacity: 0.7; }
          50% { transform: translateY(-8px) translateX(-6px); opacity: 0.5; }
          75% { transform: translateY(-24px) translateX(4px); opacity: 0.6; }
        }
        @keyframes shimmer {
          0%, 100% { left: -60%; }
          50% { left: 100%; }
        }
      `}</style>
    </div>
  )
}
