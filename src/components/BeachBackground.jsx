export default function BeachBackground({ phase = 'follicular' }) {
  // 各周期阶段的背景图片
  const backgrounds = {
    period: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&q=80', // 阴天海滩
    follicular: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', // 阳光海滩
    ovulation: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80', // 清爽海洋
    luteal: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80', // 日落海滩
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
        filter: phase === 'period' ? 'brightness(0.75) saturate(0.8)' : 'brightness(0.95) saturate(1.1)',
      }} />

      {/* 经期 - 阴天效果 */}
      {phase === 'period' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(100,116,139,0.4) 0%, rgba(71,85,105,0.3) 50%, rgba(51,65,85,0.4) 100%)',
        }} />
      )}

      {/* 卵泡期 - 明亮效果 */}
      {phase === 'follicular' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,228,225,0.2) 0%, rgba(135,206,235,0.2) 40%, rgba(224,247,250,0.3) 100%)',
        }} />
      )}

      {/* 排卵日 - 清爽效果 */}
      {phase === 'ovulation' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(230,255,250,0.3) 0%, rgba(200,240,255,0.2) 40%, rgba(180,255,220,0.2) 100%)',
        }} />
      )}

      {/* 黄体期 - 温暖日落 */}
      {phase === 'luteal' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,107,107,0.3) 0%, rgba(255,142,83,0.2) 30%, rgba(255,160,122,0.2) 100%)',
        }} />
      )}

      {/* 太阳 */}
      <div style={{
        position: 'absolute',
        top: '8%',
        right: '20%',
        width: phase === 'ovulation' ? '100px' : '80px',
        height: phase === 'ovulation' ? '100px' : '80px',
        background: phase === 'luteal'
          ? 'radial-gradient(circle, rgba(255,150,100,1) 0%, rgba(255,100,50,0.5) 50%, transparent 70%)'
          : phase === 'ovulation'
          ? 'radial-gradient(circle, rgba(255,255,220,0.9) 0%, rgba(200,255,200,0.4) 50%, transparent 70%)'
          : 'radial-gradient(circle, rgba(255,240,200,0.9) 0%, rgba(255,200,100,0.4) 50%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(5px)',
        animation: 'pulseGlow 4s ease-in-out infinite',
      }} />

      {/* 海洋 */}
      <div style={{
        position: 'absolute',
        bottom: '22%',
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(180deg, rgba(135,206,235,0.5) 0%, rgba(0,206,209,0.6) 50%, rgba(32,178,170,0.7) 100%)',
      }} />

      {/* 多层波浪 */}
      <svg viewBox="0 0 1440 80" style={{ position: 'absolute', bottom: '25%', left: 0, width: '200%', height: '70px', animation: 'waveFlow 8s ease-in-out infinite' }} preserveAspectRatio="none">
        <path d="M0 40C360 70 720 10 1080 40C1260 55 1380 50 1440 40V80H0V40Z" fill="rgba(255,255,255,0.15)" />
      </svg>
      <svg viewBox="0 0 1440 60" style={{ position: 'absolute', bottom: '23%', left: 0, width: '200%', height: '50px', animation: 'waveFlow 6s ease-in-out infinite reverse' }} preserveAspectRatio="none">
        <path d="M0 30C360 50 720 0 1080 30C1260 45 1380 40 1440 30V60H0V30Z" fill="rgba(255,255,255,0.12)" />
      </svg>

      {/* 沙滩 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '24%',
        backgroundImage: 'url(https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }} />

      {/* 前景波浪 */}
      <svg viewBox="0 0 1440 40" style={{ position: 'absolute', bottom: 0, left: 0, width: '200%', height: '30px', animation: 'waveFlow 5s ease-in-out infinite' }} preserveAspectRatio="none">
        <path d="M0 20C360 35 720 0 1080 20C1260 30 1380 25 1440 20V40H0V20Z" fill="rgba(255,255,255,0.15)" />
      </svg>
    </div>
  )
}
