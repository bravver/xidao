import { useMemo } from 'react'
import shallowSea from '../assets/素材1，3，5/浮潜/海底世界（浅）.png'
import deepSea from '../assets/素材1，3，5/浮潜/海底世界(深）.png'
import glowingCreature2 from '../assets/素材1，3，5/浮潜/海底发光生物2.png'

// 透明背景素材
import transparentCreature1 from '../assets/snorkeling/1.png'
import transparentCreature2 from '../assets/snorkeling/2.png'
import starsImg from '../assets/snorkeling/stars.png'
import bottleImg from '../assets/snorkeling/瓶子.png'
import starBottleImg from '../assets/snorkeling/装星星的瓶子.png'

// 不同深度海
import depth1 from '../assets/snorkeling/depths/1.png'
import depth2 from '../assets/snorkeling/depths/2.png'
import depth3 from '../assets/snorkeling/depths/3.png'

export default function SnorkelingBackground({ phase = 'follicular', depth = 0 }) {
  const depthBackgrounds = [depth1, depth2, depth3]
  const depthIndex = depth < 30 ? 0 : depth < 60 ? 1 : 2
  const depthBgUrl = depthBackgrounds[depthIndex]

  const bgUrl = phase === 'period' || phase === 'luteal' ? deepSea : shallowSea

  const caustics = useMemo(() => [
    { left: '10%', top: '5%', size: 120, delay: 0 },
    { left: '40%', top: '3%', size: 100, delay: 1 },
    { left: '70%', top: '8%', size: 90, delay: 2 },
    { left: '25%', top: '15%', size: 80, delay: 0.5 },
    { left: '60%', top: '12%', size: 70, delay: 1.5 },
  ], [])

  // 随机散布的星星
  const scatteredStars = useMemo(() =>
    Array.from({ length: 12 }, () => ({
      left: Math.random() * 90 + '%',
      top: Math.random() * 80 + '%',
      size: 15 + Math.random() * 25,
      delay: Math.random() * 3,
      duration: 1.5 + Math.random() * 2.5,
    })), []
  )

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
      {/* 海底背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: phase === 'period' ? 'brightness(0.6) saturate(0.7) hue-rotate(-20deg)' : phase === 'ovulation' ? 'brightness(1) saturate(1.2) hue-rotate(-5deg)' : 'brightness(0.8) saturate(1.1) hue-rotate(-10deg)',
      }} />

      {/* 深度层级背景 — 随着下潜变化 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${depthBgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: Math.min(depth / 100, 0.7),
        transition: 'opacity 0.6s ease',
      }} />

      {/* 深海渐变 */}
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

      {/* 散布的透明星星 */}
      {scatteredStars.map((s, i) => (
        <img
          key={`star-${i}`}
          src={starsImg}
          alt=""
          style={{
            position: 'absolute',
            left: s.left,
            top: s.top,
            width: s.size,
            opacity: 0.4 + (depth / 100) * 0.5,
            animation: `starTwinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
            transition: 'opacity 0.6s ease',
          }}
        />
      ))}

      {/* 海底生物 — 透明背景 */}
      <img src={transparentCreature1} alt="" style={{ position: 'absolute', bottom: '5%', left: '10%', width: '80px', opacity: 0.8, animation: 'floatSlow 4s ease-in-out infinite' }} />
      <img src={transparentCreature2} alt="" style={{ position: 'absolute', bottom: '8%', right: '15%', width: '70px', opacity: 0.85, animation: 'floatSlow 3s ease-in-out infinite 0.5s' }} />
      <img src={glowingCreature2} alt="" style={{ position: 'absolute', bottom: '15%', left: '30%', width: '50px', opacity: 0.6, animation: 'floatSlow 5s ease-in-out infinite 1s' }} />

      {/* 透明瓶子装饰 — 随深度渐显 */}
      <img src={bottleImg} alt="" style={{ position: 'absolute', bottom: '10%', right: '8%', width: '55px', opacity: Math.min(depth / 50, 0.7), transition: 'opacity 0.6s ease', animation: 'floatSlow 4s ease-in-out infinite 0.8s' }} />
      {depth > 35 && (
        <img src={bottleImg} alt="" style={{ position: 'absolute', bottom: '18%', left: '22%', width: '50px', opacity: Math.min((depth - 35) / 35, 0.6), transition: 'opacity 0.6s ease', animation: 'floatSlow 4.5s ease-in-out infinite 1.6s' }} />
      )}
      {depth > 40 && (
        <img src={starBottleImg} alt="" style={{ position: 'absolute', bottom: '25%', left: '12%', width: '55px', opacity: Math.min((depth - 40) / 30, 0.7), transition: 'opacity 0.6s ease', animation: 'floatSlow 5s ease-in-out infinite 1.2s' }} />
      )}
      {depth > 55 && (
        <img src={starBottleImg} alt="" style={{ position: 'absolute', bottom: '30%', right: '18%', width: '50px', opacity: Math.min((depth - 55) / 25, 0.7), transition: 'opacity 0.6s ease', animation: 'floatSlow 6s ease-in-out infinite 2s', filter: 'drop-shadow(0 0 12px rgba(100,200,255,0.5))' }} />
      )}
      {depth > 50 && (
        <img src={starsImg} alt="" style={{ position: 'absolute', bottom: '35%', right: '28%', width: '45px', opacity: Math.min((depth - 50) / 30, 0.65), transition: 'opacity 0.6s ease', animation: 'starTwinkle 2.5s ease-in-out infinite 0.3s' }} />
      )}

      {/* 水面波光 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '15%',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
      }} />

      {/* 深度暗角 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,20,${0.3 + (depth / 100) * 0.5}) 100%)`,
        transition: 'background 0.6s ease',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
