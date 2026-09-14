import { useState } from 'react'

// 经期 - 炭火泥炉、暖橘吊灯、窗外细雨 (3张)
import kitchenPeriod1 from '../assets/2.4.素材收集/4.1背景图/炭火泥炉、暖橘吊灯、窗外细雨.avif'
import kitchenPeriod2 from '../assets/2.4.素材收集/4.1背景图/炭火泥炉、暖橘吊灯、窗外细雨2.avif'
import kitchenPeriod3 from '../assets/2.4.素材收集/4.1背景图/炭火泥炉、暖橘吊灯、窗外细雨3.avif'

// 卵泡期 - 蓝调晨光、百叶窗条纹影、洋甘菊 (2张)
import kitchenFollicular1 from '../assets/2.4.素材收集/4.1背景图/蓝调晨光、百叶窗条纹影、洋甘菊.avif'
import kitchenFollicular2 from '../assets/2.4.素材收集/4.1背景图/蓝调晨光、百叶窗条纹影、洋甘菊2.avif'

// 排卵日 - 过曝阳光、不锈钢台面、窗外青蓝海 (3张)
import kitchenOvulation1 from '../assets/2.4.素材收集/4.1背景图/过曝阳光、不锈钢台面、窗外青蓝海.avif'
import kitchenOvulation2 from '../assets/2.4.素材收集/4.1背景图/过曝阳光、不锈钢台面、窗外青蓝海2.avif'
import kitchenOvulation3 from '../assets/2.4.素材收集/4.1背景图/过曝阳光、不锈钢台面、窗外青蓝海3.avif'

// 黄体期 - 焦糖夕阳、粗麻布台面、薄雾窗外 (4张)
import kitchenLuteal1 from '../assets/2.4.素材收集/4.1背景图/焦糖夕阳、粗麻布台面、薄雾窗外.avif'
import kitchenLuteal2 from '../assets/2.4.素材收集/4.1背景图/焦糖夕阳、粗麻布台面、薄雾窗外2.avif'
import kitchenLuteal3 from '../assets/2.4.素材收集/4.1背景图/焦糖夕阳、粗麻布台面、薄雾窗外3.avif'
import kitchenLuteal4 from '../assets/2.4.素材收集/4.1背景图/焦糖夕阳、粗麻布台面、薄雾窗外4.avif'

const phaseVariants = {
  period: [kitchenPeriod1, kitchenPeriod2, kitchenPeriod3],
  follicular: [kitchenFollicular1, kitchenFollicular2],
  ovulation: [kitchenOvulation1, kitchenOvulation2, kitchenOvulation3],
  luteal: [kitchenLuteal1, kitchenLuteal2, kitchenLuteal3, kitchenLuteal4],
}

const phaseNames = {
  period: '炭火泥炉 · 暖橘吊灯 · 窗外细雨',
  follicular: '蓝调晨光 · 百叶窗条纹影 · 洋甘菊',
  ovulation: '过曝阳光 · 不锈钢台面 · 窗外青蓝海',
  luteal: '焦糖夕阳 · 粗麻布台面 · 薄雾窗外',
}

export default function KitchenBackground({ phase = 'follicular' }) {
  const [variantIndex] = useState(() =>
    Math.floor(Math.random() * (phaseVariants[phase]?.length || 1))
  )

  const variants = phaseVariants[phase] || phaseVariants.follicular
  const bgUrl = variants[variantIndex % variants.length]

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

      {/* 场景标签 */}
      <div style={{
        position: 'absolute',
        bottom: '0.5rem',
        right: '0.75rem',
        fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.4)',
        fontStyle: 'italic',
      }}>
        {phaseNames[phase]}
      </div>
    </div>
  )
}
