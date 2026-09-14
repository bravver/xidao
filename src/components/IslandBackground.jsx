import cloudyBeach from '../assets/2.4.素材收集/2.1背景图/阴天海滩背景.avif'
import sunnyBeach from '../assets/2.4.素材收集/2.1背景图/阳光海滩背景.jpg'
import freshOcean from '../assets/2.4.素材收集/2.1背景图/清爽海洋背景.avif'
import sunsetBeach from '../assets/2.4.素材收集/2.1背景图/日落海滩背景.jpg'
import sandForeground from '../assets/2.4.素材收集/2.1背景图/前景沙滩.avif'

// 四个时期的视觉图
import phasePeriod from '../assets/素材1，3，5/月经期视觉图GIF.gif'
import phaseFollicular from '../assets/phase-visuals/phase-follicular.png'
import phaseOvulation from '../assets/phase-visuals/phase-ovulation.png'
import phaseLuteal from '../assets/phase-visuals/phase-luteal.png'

export default function IslandBackground({ phase = 'follicular' }) {
  const beachBackgrounds = {
    period: cloudyBeach,
    follicular: sunnyBeach,
    ovulation: freshOcean,
    luteal: sunsetBeach,
  }

  const phaseVisuals = {
    period: phasePeriod,
    follicular: phaseFollicular,
    ovulation: phaseOvulation,
    luteal: phaseLuteal,
  }

  const bgUrl = beachBackgrounds[phase] || beachBackgrounds.follicular
  const visualUrl = phaseVisuals[phase] || phaseVisuals.follicular

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
      {/* 天空图片背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: phase === 'period' ? 'brightness(0.7) saturate(0.8)' : 'brightness(0.9)',
      }} />

      {/* 时期视觉图叠加层 — 经期用正常叠加避免 GIF 黑帧闪烁 */}
      <img
        src={visualUrl}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: phase === 'period' ? 0.45 : 0.6,
          mixBlendMode: phase === 'period' ? 'normal' : 'soft-light',
        }}
      />

      {/* 经期 - 雨天效果叠加 */}
      {phase === 'period' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(100,116,139,0.4) 0%, rgba(71,85,105,0.3) 50%, rgba(51,65,85,0.4) 100%)',
        }} />
      )}

      {/* 非经期 - 天空渐变叠加 */}
      {phase !== 'period' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: phase === 'luteal'
            ? 'linear-gradient(180deg, rgba(255,107,107,0.2) 0%, rgba(255,142,83,0.15) 40%, rgba(255,160,122,0.15) 100%)'
            : 'linear-gradient(180deg, rgba(135,206,235,0.2) 0%, rgba(255,255,255,0.15) 40%, rgba(176,224,230,0.2) 100%)',
        }} />
      )}

      {/* 太阳光晕 - 非经期显示 */}
      {phase !== 'period' && (
        <div style={{
          position: 'absolute',
          top: '5%',
          right: '15%',
          width: '100px',
          height: '100px',
          background: phase === 'luteal'
            ? 'radial-gradient(circle, rgba(255,150,100,0.6) 0%, rgba(255,100,50,0.3) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,220,100,0.8) 0%, rgba(255,200,50,0.3) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(10px)',
          animation: 'pulseGlow 4s ease-in-out infinite',
        }} />
      )}

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
      }} />

      {/* 海面渐变 */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: 0,
        right: 0,
        height: '15%',
        background: phase === 'period'
          ? 'linear-gradient(180deg, rgba(100,116,139,0.5) 0%, rgba(71,85,105,0.7) 100%)'
          : 'linear-gradient(180deg, rgba(74,144,164,0.5) 0%, rgba(46,139,139,0.7) 100%)',
      }} />

      {/* 海浪装饰 */}
      <svg viewBox="0 0 1440 80" style={{ position: 'absolute', bottom: '22%', left: 0, width: '200%', height: '60px', animation: 'waveFlow 6s ease-in-out infinite' }} preserveAspectRatio="none">
        <path d="M0 40C360 70 720 10 1080 40C1260 55 1380 50 1440 40V80H0V40Z" fill="rgba(255,255,255,0.15)" />
      </svg>

      {/* 前景波浪 */}
      <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '50px', animation: 'waveFlow 5s ease-in-out infinite reverse' }} preserveAspectRatio="none">
        <path d="M0 30C360 50 720 0 1080 30C1260 45 1380 40 1440 30V60H0V30Z" fill="rgba(255,255,255,0.2)" />
      </svg>
    </div>
  )
}
