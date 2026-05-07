import { useMemo } from 'react'

// 各周期阶段的精致配色
const weatherConfig = {
  period: {
    gradient: 'linear-gradient(180deg, #64748b 0%, #475569 50%, #334155 100%)',
    glowSpots: [
      { top: '10%', left: '20%', size: '300px', color: 'rgba(100, 116, 139, 0.3)' },
      { top: '60%', right: '10%', size: '250px', color: 'rgba(71, 85, 105, 0.25)' },
    ],
    particles: 'rain',
    particleColor: 'rgba(174, 194, 224, 0.5)',
    accentColor: '#94a3b8',
  },
  follicular: {
    gradient: 'linear-gradient(180deg, #fecdd3 0%, #fda4af 40%, #fb7185 100%)',
    glowSpots: [
      { top: '5%', right: '15%', size: '350px', color: 'rgba(253, 164, 175, 0.4)' },
      { top: '50%', left: '10%', size: '280px', color: 'rgba(251, 113, 133, 0.3)' },
    ],
    particles: 'dawn',
    particleColor: 'rgba(253, 164, 175, 0.6)',
    accentColor: '#fda4af',
  },
  ovulation: {
    gradient: 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 50%, #0ea5e9 100%)',
    glowSpots: [
      { top: '-10%', right: '10%', size: '400px', color: 'rgba(250, 204, 21, 0.25)' },
      { bottom: '20%', left: '5%', size: '300px', color: 'rgba(56, 189, 248, 0.3)' },
    ],
    particles: 'sunny',
    particleColor: 'rgba(250, 204, 21, 0.6)',
    accentColor: '#38bdf8',
  },
  luteal: {
    gradient: 'linear-gradient(180deg, #fdba74 0%, #fb923c 50%, #f97316 100%)',
    glowSpots: [
      { top: '10%', left: '20%', size: '320px', color: 'rgba(251, 146, 60, 0.35)' },
      { bottom: '10%', right: '15%', size: '280px', color: 'rgba(249, 115, 22, 0.3)' },
    ],
    particles: 'sunset',
    particleColor: 'rgba(251, 146, 60, 0.5)',
    accentColor: '#fb923c',
  },
}

// 雨滴效果
function RainEffect({ color }) {
  const drops = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: `${(i * 2.5) % 100}%`,
      delay: `${(i * 0.15) % 3}s`,
      duration: `${1 + (i * 0.05) % 1}s`,
      height: `${12 + (i % 10) * 8}px`,
    }))
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.6 }}>
      {drops.map((drop) => (
        <div
          key={drop.id}
          style={{
            position: 'absolute',
            left: drop.left,
            top: 0,
            width: '1.5px',
            height: drop.height,
            background: `linear-gradient(to bottom, transparent, ${color})`,
            animation: `rainFall ${drop.duration}s linear infinite`,
            animationDelay: drop.delay,
          }}
        />
      ))}
    </div>
  )
}

// 晨曦/日落光线
function LightRays({ color, count = 6 }) {
  const rays = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: -15 + i * (30 / (count - 1)),
      width: 20 + (i % 3) * 10,
      delay: `${i * 0.3}s`,
    }))
  }, [count])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.5 }}>
      {rays.map((ray) => (
        <div
          key={ray.id}
          style={{
            position: 'absolute',
            top: '-30%',
            left: `${20 + ray.id * 12}%`,
            width: `${ray.width}px`,
            height: '100%',
            background: `linear-gradient(to bottom, ${color}, transparent 70%)`,
            transform: `rotate(${ray.angle}deg)`,
            transformOrigin: 'top center',
            animation: 'softBreath 5s ease-in-out infinite',
            animationDelay: ray.delay,
          }}
        />
      ))}
    </div>
  )
}

// 阳光粒子
function SunnyEffect({ color }) {
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${5 + (i * 6.5) % 90}%`,
      top: `${5 + (i * 7) % 85}%`,
      size: `${2 + (i % 4)}px`,
      delay: `${(i * 0.4) % 3}s`,
    }))
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: color,
            borderRadius: '50%',
            animation: 'starTwinkle 2.5s ease-in-out infinite',
            animationDelay: p.delay,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
        />
      ))}
    </div>
  )
}

// 浮游粒子
function FloatingParticles({ color }) {
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: `${8 + i * 11}%`,
      bottom: `${-5 + (i % 3) * 15}%`,
      size: `${6 + (i % 4) * 3}px`,
      delay: `${i * 0.8}s`,
      duration: `${7 + i * 0.5}s`,
    }))
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.5 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), ${color})`,
            borderRadius: '50%',
            animation: `bubbleFloat ${p.duration}s ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

// 底部波浪装饰
function WaveDecoration({ color }) {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', overflow: 'hidden' }}>
      {/* 主波浪 */}
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        style={{ position: 'absolute', bottom: 0, width: '200%', height: '100%', animation: 'waveFlow 6s ease-in-out infinite' }}
        preserveAspectRatio="none"
      >
        <path
          d="M0 60C240 100 480 20 720 60C960 100 1200 20 1440 60V120H0V60Z"
          fill={color}
          fillOpacity="0.15"
        />
        <path
          d="M0 80C360 40 720 100 1080 60C1260 40 1350 50 1440 60V120H0V80Z"
          fill={color}
          fillOpacity="0.1"
        />
      </svg>
      {/* 叠加波浪 */}
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        style={{ position: 'absolute', bottom: 0, width: '200%', height: '80%', animation: 'waveFlow 8s ease-in-out infinite reverse', opacity: 0.6 }}
        preserveAspectRatio="none"
      >
        <path
          d="M0 70C360 30 720 90 1080 50C1260 30 1380 45 1440 60V120H0V70Z"
          fill={color}
          fillOpacity="0.12"
        />
      </svg>
    </div>
  )
}

// 主组件
export default function WeatherBackground({ phase = 'follicular' }) {
  const config = weatherConfig[phase] || weatherConfig.follicular

  const ParticleComponent = {
    rain: RainEffect,
    dawn: LightRays,
    sunny: SunnyEffect,
    sunset: LightRays,
  }[config.particles] || FloatingParticles

  const particleProps = config.particles === 'dawn' || config.particles === 'sunset'
    ? { color: config.particleColor, count: config.particles === 'dawn' ? 6 : 5 }
    : { color: config.particleColor }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
      {/* 主渐变背景 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: config.gradient,
          transition: 'background 1s ease',
        }}
      />

      {/* 装饰光斑 */}
      {config.glowSpots.map((spot, i) => (
        <div
          key={i}
          className="bg-glow-spot animate-pulse-glow"
          style={{
            top: spot.top,
            left: spot.left,
            right: spot.right,
            bottom: spot.bottom,
            width: spot.size,
            height: spot.size,
            background: spot.color,
          }}
        />
      ))}

      {/* 粒子效果 */}
      <ParticleComponent {...particleProps} />

      {/* 浮游粒子 */}
      <FloatingParticles color={config.particleColor} />

      {/* 底部波浪 */}
      <WaveDecoration color={config.accentColor} />

      {/* 顶部柔化层 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
        }}
      />
    </div>
  )
}
