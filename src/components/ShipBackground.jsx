export default function ShipBackground({ phase = 'follicular' }) {
  // 各周期阶段的背景图片
  const backgrounds = {
    period: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&q=80', // 阴天海洋
    follicular: 'https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=1920&q=80', // 晴朗海洋帆船
    ovulation: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80', // 阳光海洋
    luteal: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?w=1920&q=80', // 黄昏海洋
  }

  const bgUrl = backgrounds[phase] || backgrounds.follicular

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
      {/* 天空/海洋背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: phase === 'period' ? 'brightness(0.75) saturate(0.7)' : 'brightness(0.95) saturate(1.1)',
      }} />

      {/* 经期 - 阴天效果 */}
      {phase === 'period' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(100,116,139,0.4) 0%, rgba(71,85,105,0.3) 50%, rgba(51,65,85,0.4) 100%)',
        }} />
      )}

      {/* 黄体期 - 日落暖色 */}
      {phase === 'luteal' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,142,83,0.3) 0%, rgba(255,160,122,0.2) 50%, rgba(255,217,61,0.2) 100%)',
        }} />
      )}

      {/* 地平线光晕 */}
      <div style={{
        position: 'absolute',
        top: '35%',
        left: 0,
        right: 0,
        height: '20%',
        background: phase === 'luteal'
          ? 'linear-gradient(180deg, rgba(255,150,100,0.4) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(255,220,150,0.4) 0%, transparent 100%)',
        filter: 'blur(20px)',
      }} />

      {/* 太阳 */}
      {phase !== 'period' && (
        <div style={{
          position: 'absolute',
          top: '25%',
          right: '20%',
          width: '100px',
          height: '100px',
          background: phase === 'luteal'
            ? 'radial-gradient(circle, rgba(255,150,100,0.8) 0%, rgba(255,100,50,0.4) 40%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,240,200,0.9) 0%, rgba(255,200,100,0.4) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(5px)',
          animation: 'pulseGlow 5s ease-in-out infinite',
        }} />
      )}

      {/* 海洋叠层 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '55%',
        background: phase === 'period'
          ? 'linear-gradient(180deg, rgba(100,116,139,0.5) 0%, rgba(71,85,105,0.6) 50%, rgba(51,65,85,0.7) 100%)'
          : 'linear-gradient(180deg, rgba(93,173,226,0.4) 0%, rgba(41,128,185,0.6) 50%, rgba(31,97,141,0.8) 100%)',
      }} />

      {/* 反光 */}
      <div style={{
        position: 'absolute',
        top: '45%',
        left: 0,
        right: 0,
        height: '10%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,200,0.2) 30%, rgba(255,255,200,0.2) 70%, transparent)',
      }} />

      {/* 波浪 */}
      <svg viewBox="0 0 1440 120" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '100px', animation: 'waveFlow 6s ease-in-out infinite' }} preserveAspectRatio="none">
        <path d="M0 60C360 100 720 20 1080 60C1260 80 1380 70 1440 60V120H0V60Z" fill="rgba(255,255,255,0.1)" />
      </svg>
      <svg viewBox="0 0 1440 100" style={{ position: 'absolute', bottom: 10, left: 0, width: '200%', height: '80px', animation: 'waveFlow 8s ease-in-out infinite reverse' }} preserveAspectRatio="none">
        <path d="M0 50C360 90 720 10 1080 50C1260 70 1380 60 1440 50V100H0V50Z" fill="rgba(255,255,255,0.08)" />
      </svg>
    </div>
  )
}
