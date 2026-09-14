import cloudyBeach from '../assets/2.4.素材收集/2.1背景图/阴天海滩背景.avif'
import sunnyBeach from '../assets/2.4.素材收集/2.1背景图/阳光海滩背景.jpg'
import freshOcean from '../assets/2.4.素材收集/2.1背景图/清爽海洋背景.avif'
import sunsetBeach from '../assets/2.4.素材收集/2.1背景图/日落海滩背景.jpg'
import sandForeground from '../assets/2.4.素材收集/2.1背景图/前景沙滩.avif'

export default function GymBackground({ phase = 'follicular' }) {
  const backgrounds = {
    period: cloudyBeach,
    follicular: sunsetBeach,
    ovulation: sunnyBeach,
    luteal: sunsetBeach,
  }

  const bgUrl = backgrounds[phase] || backgrounds.follicular

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
      {/* 日落天空背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: phase === 'period' ? 'brightness(0.85) saturate(0.9)' : 'brightness(0.9) saturate(1.2)',
      }} />

      {/* 经期 - 柔和效果 */}
      {phase === 'period' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,228,225,0.3) 0%, rgba(255,182,193,0.2) 50%, rgba(255,218,233,0.3) 100%)',
        }} />
      )}

      {/* 卵泡期 - 明亮效果 */}
      {phase === 'follicular' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,200,0.2) 0%, rgba(255,255,180,0.1) 50%, rgba(255,200,100,0.2) 100%)',
        }} />
      )}

      {/* 排卵日 - 阳光效果 */}
      {phase === 'ovulation' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,220,0.3) 0%, rgba(255,255,200,0.2) 50%, rgba(255,200,100,0.2) 100%)',
        }} />
      )}

      {/* 黄体期 - 温暖日落 */}
      {phase === 'luteal' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,107,107,0.3) 0%, rgba(255,142,83,0.2) 30%, rgba(255,160,122,0.2) 60%, rgba(255,217,61,0.3) 100%)',
        }} />
      )}

      {/* 太阳 */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: phase === 'ovulation' ? '140px' : '120px',
        height: phase === 'ovulation' ? '140px' : '120px',
        background: phase === 'luteal'
          ? 'radial-gradient(circle, rgba(255,150,100,1) 0%, rgba(255,100,50,0.6) 40%, transparent 70%)'
          : phase === 'ovulation'
          ? 'radial-gradient(circle, rgba(255,255,200,1) 0%, rgba(255,255,150,0.6) 40%, transparent 70%)'
          : 'radial-gradient(circle, rgba(255,220,100,1) 0%, rgba(255,180,50,0.6) 40%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(3px)',
        animation: 'pulseGlow 4s ease-in-out infinite',
      }} />

      {/* 沙滩前景 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '25%',
        backgroundImage: `url(${sandForeground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        filter: 'brightness(0.9)',
      }} />

      {/* 海洋 */}
      <div style={{
        position: 'absolute',
        bottom: '22%',
        left: 0,
        right: 0,
        height: '12%',
        background: phase === 'luteal'
          ? 'linear-gradient(180deg, rgba(255,127,80,0.5) 0%, rgba(255,99,71,0.6) 100%)'
          : 'linear-gradient(180deg, rgba(135,206,235,0.5) 0%, rgba(32,178,170,0.6) 100%)',
      }} />

      {/* 波浪 */}
      <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: '23%', left: 0, width: '200%', height: '50px', animation: 'waveFlow 6s ease-in-out infinite' }} preserveAspectRatio="none">
        <path d="M0 30C360 50 720 0 1080 30C1260 45 1380 40 1440 30V60H0V30Z" fill="rgba(255,255,255,0.2)" />
      </svg>

      {/* 前景沙滩波浪 */}
      <svg viewBox="0 0 1440 40" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '30px', animation: 'waveFlow 4s ease-in-out infinite reverse' }} preserveAspectRatio="none">
        <path d="M0 20C360 35 720 0 1080 20C1260 30 1380 25 1440 20V40H0V20Z" fill="rgba(255,255,255,0.15)" />
      </svg>
    </div>
  )
}
