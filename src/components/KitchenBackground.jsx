export default function KitchenBackground({ phase = 'follicular' }) {
  // 各周期阶段的背景图片
  const backgrounds = {
    period: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80', // 温暖咖啡厅
    follicular: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80', // 明亮厨房
    ovulation: 'https://images.unsplash.com/photo-1466637574441-844b24afd14a?w=1920&q=80', // 清爽厨房
    luteal: 'https://images.unsplash.com/photo-1507048331197-7d4ac70811cf?w=1920&q=80', // 温馨厨房
  }

  const bgUrl = backgrounds[phase] || backgrounds.follicular

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden' }}>
      {/* 厨房背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${bgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: phase === 'period' ? 'brightness(0.85) saturate(0.9) sepia(0.1)' : 'brightness(0.95) saturate(1.1)',
      }} />

      {/* 经期 - 温暖柔和 */}
      {phase === 'period' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(139,90,43,0.3) 0%, rgba(121,85,72,0.2) 50%, rgba(188,170,164,0.3) 100%)',
        }} />
      )}

      {/* 卵泡期 - 明亮清新 */}
      {phase === 'follicular' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,245,230,0.4) 0%, rgba(255,228,196,0.3) 50%, rgba(255,218,185,0.4) 100%)',
        }} />
      )}

      {/* 排卵日 - 清爽明亮 */}
      {phase === 'ovulation' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(230,255,250,0.3) 0%, rgba(200,240,255,0.2) 50%, rgba(180,255,220,0.2) 100%)',
        }} />
      )}

      {/* 黄体期 - 温馨暖色 */}
      {phase === 'luteal' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,200,150,0.3) 0%, rgba(255,180,120,0.2) 50%, rgba(255,150,100,0.3) 100%)',
        }} />
      )}

      {/* 窗边光线 */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '200px',
        height: '250px',
        background: phase === 'luteal'
          ? 'radial-gradient(ellipse, rgba(255,150,100,0.5) 0%, transparent 70%)'
          : phase === 'ovulation'
          ? 'radial-gradient(ellipse, rgba(200,255,230,0.4) 0%, transparent 70%)'
          : 'radial-gradient(ellipse, rgba(255,220,150,0.4) 0%, transparent 70%)',
        filter: 'blur(20px)',
        animation: 'pulseGlow 5s ease-in-out infinite',
      }} />

      {/* 木桌区域 */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '15%',
        background: 'linear-gradient(180deg, rgba(222,184,135,0.8) 0%, rgba(210,105,30,0.9) 100%)',
      }} />
    </div>
  )
}
