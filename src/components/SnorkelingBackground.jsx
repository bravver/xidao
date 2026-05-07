import { useMemo } from 'react'

export default function SnorkelingBackground({ phase = 'follicular' }) {
  // 各周期阶段的水下背景
  const backgrounds = {
    period: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1920&q=80', // 深沉海底
    follicular: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1920&q=80', // 清晰海底
    ovulation: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=80', // 明亮海底
    luteal: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1920&q=80', // 温暖海底
  }

  const bgUrl = backgrounds[phase] || backgrounds.follicular

  // 焦散光斑
  const caustics = useMemo(() => [
    { left: '10%', top: '5%', size: 120, delay: 0 },
    { left: '40%', top: '3%', size: 100, delay: 1 },
    { left: '70%', top: '8%', size: 90, delay: 2 },
    { left: '25%', top: '15%', size: 80, delay: 0.5 },
    { left: '60%', top: '12%', size: 70, delay: 1.5 },
  ], [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
      {/* 深海背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: phase === 'period' ? 'brightness(0.6) saturate(0.7) hue-rotate(-20deg)' : phase === 'ovulation' ? 'brightness(1) saturate(1.2) hue-rotate(-5deg)' : 'brightness(0.8) saturate(1.1) hue-rotate(-10deg)',
      }} />

      {/* 深海渐变 - 经期更暗 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: phase === 'period'
          ? 'linear-gradient(180deg, rgba(30,60,100,0.4) 0%, rgba(20,40,80,0.5) 30%, rgba(0,20,50,0.6) 70%, rgba(0,10,30,0.8) 100%)'
          : phase === 'luteal'
          ? 'linear-gradient(180deg, rgba(50,120,150,0.4) 0%, rgba(40,100,140,0.4) 30%, rgba(30,80,120,0.5) 70%, rgba(20,60,100,0.7) 100%)'
          : 'linear-gradient(180deg, rgba(30,144,255,0.3) 0%, rgba(65,105,225,0.4) 30%, rgba(0,0,139,0.5) 70%, rgba(0,0,51,0.7) 100%)',
      }} />

      {/* 焦散光斑 */}
      {caustics.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size * 0.6,
            background: 'radial-gradient(ellipse, rgba(200,230,255,0.25) 0%, rgba(200,230,255,0.1) 40%, transparent 70%)',
            borderRadius: '50%',
            animation: `causticMove ${5 + i}s ease-in-out infinite`,
            animationDelay: `${c.delay}s`,
            filter: 'blur(3px)',
          }}
        />
      ))}

      {/* 珊瑚礁 */}
      <svg viewBox="0 0 1440 200" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '25%' }} preserveAspectRatio="none">
        {/* 珊瑚群 */}
        <path d="M0 200 L0 150 Q50 100 80 130 Q100 80 130 120 Q160 60 200 110 Q240 80 280 130 Q320 90 360 140 L360 200 Z" fill="rgba(255,100,100,0.4)" />
        <path d="M400 200 L400 160 Q450 120 480 150 Q520 90 560 140 Q600 100 640 150 Q680 110 720 160 L720 200 Z" fill="rgba(255,150,100,0.35)" />
        <path d="M750 200 L750 140 Q800 80 850 130 Q900 70 950 120 Q1000 90 1050 140 Q1100 100 1150 150 Q1200 110 1250 160 Q1300 120 1350 150 L1350 200 Z" fill="rgba(255,200,150,0.3)" />
        <path d="M100 200 L100 170 Q150 130 180 160 Q220 110 260 150 L260 200 Z" fill="rgba(200,100,150,0.35)" />
        <path d="M600 200 L600 180 Q650 140 700 170 Q750 130 800 180 L800 200 Z" fill="rgba(150,100,200,0.3)" />
      </svg>

      {/* 水面波光 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '15%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
      }} />
    </div>
  )
}
