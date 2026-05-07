import { useState } from 'react'
import { useCycle } from '../context/CycleContext'
import IslandBackground from '../components/IslandBackground'
import Ship from './Ship'
import Gym from './Gym'
import Kitchen from './Kitchen'
import Beach from './Beach'
import Snorkeling from './Snorkeling'

const modules = [
  { id: 'ship', title: '海船', subtitle: '工作学习', icon: '⛵' },
  { id: 'gym', title: '海边健身房', subtitle: '身体运动', icon: '🏖️' },
  { id: 'kitchen', title: '海边厨房', subtitle: '饮食建议', icon: '🍳' },
  { id: 'beach', title: '情绪海滩', subtitle: '心情记录', icon: '🏝️' },
]

const phaseConfig = {
  period: { name: '月经期', icon: '🌧️', greeting: '好好休息，身体最重要' },
  follicular: { name: '卵泡期', icon: '🌅', greeting: '新周期开始，充满活力' },
  ovulation: { name: '排卵日', icon: '☀️', greeting: '今日状态最佳' },
  luteal: { name: '黄体期', icon: '🌅', greeting: '注意休息，调整节奏' },
}

export default function Island({ onLogout }) {
  const { cycleData, clearData } = useCycle()
  const [currentPage, setCurrentPage] = useState(null)

  const phase = cycleData?.phase?.name || 'follicular'
  const phaseInfo = phaseConfig[phase] || phaseConfig.follicular

  const handleLogout = () => {
    if (window.confirm('确定要离开小岛吗？')) {
      clearData()
      onLogout()
    }
  }

  const handleBack = () => setCurrentPage(null)

  if (currentPage === 'ship') return <Ship onBack={handleBack} />
  if (currentPage === 'gym') return <Gym onBack={handleBack} />
  if (currentPage === 'kitchen') return <Kitchen onBack={handleBack} />
  if (currentPage === 'beach') return <Beach onBack={handleBack} />
  if (currentPage === 'snorkeling') return <Snorkeling onBack={handleBack} />

  return (
    <>
      <IslandBackground phase={phase} />

      <div style={{
        minHeight: '100vh',
        padding: '1.5rem',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          paddingTop: '2.5rem',
          paddingBottom: '2rem',
          animation: 'fadeInUp 0.6s ease-out',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>🏝️</div>
          <h1 style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
            letterSpacing: '0.05em',
          }}>
            汐岛
          </h1>

          <div style={{
            marginTop: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(12px)',
            padding: '0.5rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.3)',
          }}>
            <span style={{ fontSize: '1.25rem' }}>{phaseInfo.icon}</span>
            <span style={{ color: 'white', fontWeight: 600 }}>{phaseInfo.name}</span>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>· 第{cycleData?.cycleDay || 1}天</span>
          </div>

          <p style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.95)', fontSize: '0.9rem' }}>
            {phaseInfo.greeting}
          </p>
        </div>

        {/* 模块网格 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1rem',
          maxWidth: '28rem',
          margin: '0 auto',
          padding: '0 0.5rem',
        }}>
          {modules.map((m, index) => (
            <button
              key={m.id}
              onClick={() => setCurrentPage(m.id)}
              className="module-card"
              style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: '1.75rem',
                padding: '1.5rem 1.25rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.2}s both`,
              }}
            >
              <div style={{ fontSize: '2.75rem', marginBottom: '0.75rem' }}>{m.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1f2937', marginBottom: '0.25rem' }}>{m.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{m.subtitle}</p>
            </button>
          ))}
        </div>

        {/* 浮潜区入口 */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem', animation: 'fadeInUp 0.5s ease-out 0.6s both' }}>
          <button
            onClick={() => setCurrentPage('snorkeling')}
            className="btn-elegant"
            style={{
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.875rem 2rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            🌊
            <span>进入浮潜区 · 深海日志</span>
          </button>
        </div>

        {/* 底部离开 */}
        <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '3rem', animation: 'fadeInUp 0.5s ease-out 0.7s both' }}>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontSize: '0.75rem',
              padding: '0.5rem 1rem',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.4)'}
          >
            离开小岛
          </button>
        </div>
      </div>
    </>
  )
}
