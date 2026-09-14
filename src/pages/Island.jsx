import { useState, useRef, useMemo } from 'react'
import { useCycle } from '../context/CycleContext'
import { getRandomQuote } from '../data/quotes'
import useAmbientSound from '../hooks/useAmbientSound'
import IslandBackground from '../components/IslandBackground'
import islandPhoto from '../assets/island-photo.png'
import iconShip from '../assets/icon-ship.png'
import iconGym from '../assets/icon-gym.png'
import iconKitchen from '../assets/icon-kitchen.png'
import iconBeach from '../assets/icon-beach.png'
import hotCocoa from '../assets/2.4.素材收集/4.2食物成品图/热可可.png'
import bakedSweetPotato from '../assets/2.4.素材收集/4.2食物成品图/烤红薯.png'
import limeSlice from '../assets/2.4.素材收集/4.2食物成品图/青柠切片.png'
import mojitoFood from '../assets/2.4.素材收集/4.2食物成品图/莫吉托.png'
import seafoodFood from '../assets/2.4.素材收集/4.2食物成品图/海鲜大餐.png'
import honeyToastFood from '../assets/2.4.素材收集/4.2食物成品图/蜂蜜吐司.png'
import gingerWaterFood from '../assets/2.4.素材收集/4.2食物成品图/姜汁水.png'
import wholeLime from '../assets/2.4.素材收集/4.3食材原料图/完整青柠.png'
import Ship from './Ship'
import Gym from './Gym'
import Kitchen from './Kitchen'
import Beach from './Beach'
import Snorkeling from './Snorkeling'
import Lighthouse from './Lighthouse'

const gymRewardImageMap = {
  '🍫 可可豆': hotCocoa,
  '🍋 青柠': limeSlice,
  '🍹 莫吉托': mojitoFood,
  '🍞 吐司': honeyToastFood,
  '🦐 海鲜': seafoodFood,
  '🐟 鲜鱼': seafoodFood,
  '🥤 生姜汽水': gingerWaterFood,
};

const modules = [
  {
    id: 'ship', title: '海船', subtitle: '工作学习',
    icon: iconShip,
    accent: '#0ea5e9', accentSoft: '#e0f2fe',
    decor: '⛵',
  },
  {
    id: 'gym', title: '海边健身房', subtitle: '身体运动',
    icon: iconGym,
    accent: '#10b981', accentSoft: '#d1fae5',
    decor: '💪',
  },
  {
    id: 'kitchen', title: '海边厨房', subtitle: '饮食建议',
    icon: iconKitchen,
    accent: '#f59e0b', accentSoft: '#fef3c7',
    decor: '🍳',
  },
  {
    id: 'beach', title: '情绪海滩', subtitle: '心情记录',
    icon: iconBeach,
    accent: '#8b5cf6', accentSoft: '#ede9fe',
    decor: '🐚',
  },
]

const phaseConfig = {
  period: { name: '月经期', icon: '🌧️', greeting: '好好休息，身体最重要', hue: '#64748b' },
  follicular: { name: '卵泡期', icon: '🌅', greeting: '新周期开始，充满活力', hue: '#eab308' },
  ovulation: { name: '排卵日', icon: '☀️', greeting: '今日状态最佳，闪耀光芒', hue: '#0ea5e9' },
  luteal: { name: '黄体期', icon: '🌅', greeting: '注意休息，调整节奏', hue: '#f97316' },
}

export default function Island({ onLogout }) {
  const { cycleData, clearData, register } = useCycle()
  const [currentPage, setCurrentPage] = useState(null)
  const [lighthouseMode, setLighthouseMode] = useState('companion')
  const [showShare, setShowShare] = useState(false)
  const shareCanvasRef = useRef(null)
  const [shareShowFood, setShareShowFood] = useState(true)
  const [shareShowExercise, setShareShowExercise] = useState(true)

  const phase = cycleData?.phase?.name || 'follicular'
  const phaseInfo = phaseConfig[phase] || phaseConfig.follicular
  const todayQuote = useMemo(() => getRandomQuote(), [currentPage])
  const { toggle: toggleSound, setVolume } = useAmbientSound(phase)
  const [soundMuted, setSoundMuted] = useState(false)

  // Pre-compute share preview data to avoid IIFEs in JSX
  const sharePreview = useMemo(() => {
    const todayLocale = new Date().toLocaleDateString('zh-CN')
    let todayK = [], todayG = [], phaseK = [], phaseG = []
    try {
      const allK = JSON.parse(localStorage.getItem('xidao_kitchen_rewards') || '[]')
      const allG = JSON.parse(localStorage.getItem('xidao_gym_rewards') || '[]')
      todayK = allK.filter(r => r.date === todayLocale)
      todayG = allG.filter(r => r.date === todayLocale)
      const lastPeriod = cycleData?.lastPeriod
      if (lastPeriod) {
        const getDateFromStr = (s) => { const p = s.split('-'); return new Date(+p[0], +p[1]-1, +p[2]) }
        const lp = getDateFromStr(lastPeriod)
        const psd = { period: 1, follicular: (cycleData?.duration || 5) + 1, ovulation: 14, luteal: 15 }
        const ped = { period: cycleData?.duration || 5, follicular: 13, ovulation: 14, luteal: 28 }
        const ps = new Date(lp); ps.setDate(lp.getDate() + (psd[phase] || 1) - 1)
        const pe = new Date(lp); pe.setDate(lp.getDate() + (ped[phase] || 5) - 1)
        const t = new Date(); if (pe > t) pe.setTime(t.getTime())
        const fmt = (d) => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0')
        phaseK = allK.filter(r => r.date >= fmt(ps) && r.date <= fmt(pe))
        phaseG = allG.filter(r => r.date >= fmt(ps) && r.date <= fmt(pe))
      }
    } catch {}

    const foodImages = []
    if (shareShowFood) {
      todayK.forEach(d => {
        let matched = null
        const dn = d.name || ''
        if (dn.includes('热可可')) matched = hotCocoa
        else if (dn.includes('烤红薯')) matched = bakedSweetPotato
        else if (dn.includes('青柠')) matched = limeSlice
        else if (dn.includes('莫吉托')) matched = mojitoFood
        else if (dn.includes('海鲜')) matched = seafoodFood
        else if (dn.includes('蜂蜜吐司')) matched = honeyToastFood
        else if (dn.includes('姜汁')) matched = gingerWaterFood
        if (matched) foodImages.push({ src: matched, label: d.name, type: 'food' })
      })
    }
    if (shareShowExercise) {
      todayG.forEach(ex => {
        const img = gymRewardImageMap[ex.name]
        if (img) foodImages.push({ src: img, label: ex.name, type: 'gym' })
      })
    }
    return { todayK, todayG, phaseK, phaseG, foodImages }
  }, [shareShowFood, shareShowExercise, phase, cycleData?.lastPeriod, cycleData?.duration])

  const sharePhaseLabel = ({ period: '经期', follicular: '卵泡期', ovulation: '排卵期', luteal: '黄体期' })[phase] || ''

  const handleSoundToggle = () => {
    toggleSound()
    setSoundMuted(!soundMuted)
  }

  const handleLogout = () => {
    if (window.confirm('确定要离开小岛吗？')) {
      clearData()
      onLogout()
    }
  }

  const handleBack = () => setCurrentPage(null)

  const navigateToLighthouse = (mode = 'companion') => {
    setLighthouseMode(mode)
    setCurrentPage('lighthouse')
  }

  const handleShareDownload = async () => {
    const canvas = shareCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 600, H = 650

    const today = new Date()
    const todayLocale = today.toLocaleDateString('zh-CN')
    const lastPeriod = cycleData?.lastPeriod
    const getDateFromStr = (s) => { const p = s.split('-'); return new Date(+p[0], +p[1]-1, +p[2]) }

    const phaseStartDays = { period: 1, follicular: (cycleData?.duration || 5) + 1, ovulation: 14, luteal: 15 }
    const phaseEndDays = { period: cycleData?.duration || 5, follicular: 13, ovulation: 14, luteal: 28 }
    const phaseStartDay = phaseStartDays[phase] || 1
    const phaseEndDay = phaseEndDays[phase] || 5

    let phaseStartStr = todayLocale
    let phaseEndStr = todayLocale
    if (lastPeriod) {
      const lp = getDateFromStr(lastPeriod)
      const ps = new Date(lp); ps.setDate(lp.getDate() + phaseStartDay - 1)
      const pe = new Date(lp); pe.setDate(lp.getDate() + phaseEndDay - 1)
      const fmt = (d) => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0')
      phaseStartStr = fmt(ps)
      phaseEndStr = fmt(pe > today ? today : pe)
    }

    let allKitchen = [], allGym = []
    try {
      allKitchen = JSON.parse(localStorage.getItem('xidao_kitchen_rewards') || '[]')
      allGym = JSON.parse(localStorage.getItem('xidao_gym_rewards') || '[]')
    } catch {}

    const todayKitchen = allKitchen.filter(r => r.date === todayLocale)
    const todayGym = allGym.filter(r => r.date === todayLocale)
    const phaseKitchen = allKitchen.filter(r => r.date >= phaseStartStr && r.date <= phaseEndStr)
    const phaseGym = allGym.filter(r => r.date >= phaseStartStr && r.date <= phaseEndStr)

    const loadImage = (src) => new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = src
    })

    const envColors = {
      period: { bg: ['#475569', '#334155'], flap: ['#64748B', '#475569'], seal: '#64748b', sealBg: '#cbd5e1' },
      follicular: { bg: ['#eab308', '#ca8a04'], flap: ['#fde047', '#eab308'], seal: '#ca8a04', sealBg: '#fef9c3' },
      ovulation: { bg: ['#0284c7', '#0369a1'], flap: ['#38bdf8', '#0284c7'], seal: '#0284c7', sealBg: '#e0f2fe' },
      luteal: { bg: ['#f97316', '#c2410c'], flap: ['#fdba74', '#f97316'], seal: '#ea580c', sealBg: '#ffedd5' },
    }
    const ec = envColors[phase] || envColors.follicular

    const bg = ctx.createLinearGradient(0, 0, W, H)
    bg.addColorStop(0, ec.bg[0])
    bg.addColorStop(1, ec.bg[1])
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, W, H)

    ctx.fillStyle = ec.flap[1]
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(W / 2, 70)
    ctx.lineTo(W, 0)
    ctx.closePath()
    ctx.fill()
    const flapG = ctx.createLinearGradient(0, 0, 0, 70)
    flapG.addColorStop(0, ec.flap[0])
    flapG.addColorStop(1, ec.flap[1])
    ctx.fillStyle = flapG
    ctx.fill()

    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 2
    ctx.setLineDash([8, 4])
    ctx.strokeRect(20, 20, W - 40, H - 40)
    ctx.setLineDash([])

    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 8])
    ctx.strokeRect(30, 30, W - 60, H - 60)
    ctx.setLineDash([])

    const sealX = W - 60, sealY = 55
    ctx.beginPath()
    ctx.arc(sealX, sealY, 28, 0, Math.PI * 2)
    ctx.fillStyle = ec.sealBg
    ctx.fill()
    ctx.strokeStyle = ec.seal
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.font = '26px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(phaseInfo.icon, sealX, sealY + 9)

    ctx.fillStyle = 'white'
    ctx.font = 'bold 38px Georgia, "Noto Serif SC", serif'
    ctx.textAlign = 'center'
    ctx.fillText('汐岛', W / 2, 75)

    ctx.font = '13px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText(today.getFullYear() + '年' + (today.getMonth() + 1) + '月' + today.getDate() + '日', W / 2, 97)

    ctx.font = 'bold 20px system-ui, sans-serif'
    ctx.fillStyle = 'white'
    ctx.fillText(phaseInfo.icon + ' ' + phaseInfo.name + ' · 第' + (cycleData?.cycleDay || 1) + '天', W / 2, 128)

    ctx.font = '14px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fillText(phaseInfo.greeting, W / 2, 150)

    ctx.font = 'italic 13px "Noto Serif SC", Georgia, serif'
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    const quoteLine = '"' + todayQuote.text + '"'
    const maxQW = 440
    if (ctx.measureText(quoteLine).width > maxQW) {
      const mid = Math.floor(todayQuote.text.length / 2)
      ctx.fillText('"' + todayQuote.text.slice(0, mid) + '"', W / 2, 180)
      ctx.fillText(todayQuote.text.slice(mid) + '"', W / 2, 200)
    } else {
      ctx.fillText(quoteLine, W / 2, 190)
    }
    const quoteBottom = ctx.measureText(quoteLine).width > maxQW ? 220 : 210
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.fillText('—— ' + todayQuote.author, W / 2, quoteBottom)

    const dividerY = quoteBottom + 20
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(80, dividerY)
    ctx.lineTo(W - 80, dividerY)
    ctx.stroke()

    let sectionY = dividerY + 28

    // collect food/exercise images to show
    const foodImagesToShow = []
    if (shareShowFood) {
      todayKitchen.forEach((dish) => {
        let matchedImg = null
        const dn = dish.name || ''
        if (dn.includes('热可可')) matchedImg = hotCocoa
        else if (dn.includes('烤红薯')) matchedImg = bakedSweetPotato
        else if (dn.includes('青柠')) matchedImg = limeSlice
        else if (dn.includes('莫吉托')) matchedImg = mojitoFood
        else if (dn.includes('海鲜')) matchedImg = seafoodFood
        else if (dn.includes('蜂蜜吐司')) matchedImg = honeyToastFood
        else if (dn.includes('姜汁')) matchedImg = gingerWaterFood
        if (matchedImg) foodImagesToShow.push({ img: matchedImg, label: dish.name, type: 'kitchen' })
      })
    }
    if (shareShowExercise) {
      todayGym.forEach((ex) => {
        const img = gymRewardImageMap[ex.name]
        if (img) foodImagesToShow.push({ img, label: ex.name, type: 'gym' })
      })
    }

    if (foodImagesToShow.length > 0) {
      ctx.font = 'bold 14px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.textAlign = 'center'
      ctx.fillText('🌟 今日收获', W / 2, sectionY)
      sectionY += 22

      const imgSize = 56, imgGap = 14, maxPerRow = 6
      const toLoad = foodImagesToShow.slice(0, 12)
      const loadedImages = []
      for (let i = 0; i < toLoad.length; i++) {
        const img = await loadImage(toLoad[i].img)
        loadedImages.push({ ...toLoad[i], loadedImg: img })
      }

      loadedImages.forEach((fi, i) => {
        const row = Math.floor(i / maxPerRow)
        const col = i % maxPerRow
        const rowCount = Math.min(loadedImages.length, maxPerRow)
        const totalWidth = rowCount * imgSize + (rowCount - 1) * imgGap
        const startX = (W - totalWidth) / 2
        const x = startX + col * (imgSize + imgGap)
        const y = sectionY + row * (imgSize + imgGap + 14)

        ctx.fillStyle = 'rgba(255,255,255,0.92)'
        const rx = x - 2, ry = y - 2, rw = imgSize + 4, rh = imgSize + 4, radius = 10
        ctx.beginPath()
        ctx.moveTo(rx + radius, ry)
        ctx.lineTo(rx + rw - radius, ry)
        ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius)
        ctx.lineTo(rx + rw, ry + rh - radius)
        ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh)
        ctx.lineTo(rx + radius, ry + rh)
        ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius)
        ctx.lineTo(rx, ry + radius)
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry)
        ctx.closePath()
        ctx.fill()

        if (fi.loadedImg) {
          ctx.save()
          ctx.beginPath()
          ctx.moveTo(rx + radius, ry)
          ctx.lineTo(rx + rw - radius, ry)
          ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius)
          ctx.lineTo(rx + rw, ry + rh - radius)
          ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh)
          ctx.lineTo(rx + radius, ry + rh)
          ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius)
          ctx.lineTo(rx, ry + radius)
          ctx.quadraticCurveTo(rx, ry, rx + radius, ry)
          ctx.closePath()
          ctx.clip()
          ctx.drawImage(fi.loadedImg, x, y, imgSize, imgSize)
          ctx.restore()
        }

        ctx.fillStyle = fi.type === 'gym' ? '#10b981' : '#f59e0b'
        ctx.font = '20px system-ui, sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(fi.type === 'gym' ? '💪' : '🍳', x + imgSize / 2, y + imgSize + 18)
      })

      sectionY += Math.ceil(Math.min(loadedImages.length, 12) / maxPerRow) * (imgSize + imgGap + 14) + 10
    }

    if (foodImagesToShow.length > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(80, sectionY)
      ctx.lineTo(W - 80, sectionY)
      ctx.stroke()
      sectionY += 14
    }

    if (shareShowFood && todayKitchen.length > 0) {
      ctx.font = 'bold 14px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.textAlign = 'center'
      ctx.fillText('🍳 今日美食', W / 2, sectionY)
      sectionY += 22
      todayKitchen.slice(0, 4).forEach((dish) => {
        ctx.font = '13px system-ui, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.fillText('✅ ' + dish.name, W / 2, sectionY)
        sectionY += 21
      })
    } else if (shareShowFood) {
      ctx.font = 'bold 14px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.textAlign = 'center'
      ctx.fillText('🍳 今日美食', W / 2, sectionY)
      sectionY += 22
      ctx.font = '12px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText('今天还没有烹饪记录', W / 2, sectionY)
      sectionY += 18
    }

    if (shareShowExercise && todayGym.length > 0) {
      ctx.font = 'bold 14px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.9)'
      ctx.textAlign = 'center'
      ctx.fillText('💪 今日运动', W / 2, sectionY)
      sectionY += 22
      todayGym.slice(0, 4).forEach((ex) => {
        ctx.font = '13px system-ui, sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.75)'
        ctx.fillText('✅ ' + ex.name, W / 2, sectionY)
        sectionY += 21
      })
    } else if (shareShowExercise) {
      ctx.font = 'bold 14px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.textAlign = 'center'
      ctx.fillText('💪 今日运动', W / 2, sectionY)
      sectionY += 22
      ctx.font = '12px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.4)'
      ctx.fillText('今天还没有运动记录', W / 2, sectionY)
      sectionY += 18
    }

    const phaseLabelMap = { period: '经期', follicular: '卵泡期', ovulation: '排卵期', luteal: '黄体期' }
    if (phaseKitchen.length > 0 || phaseGym.length > 0) {
      sectionY += 14
      ctx.strokeStyle = 'rgba(255,255,255,0.12)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(80, sectionY)
      ctx.lineTo(W - 80, sectionY)
      ctx.stroke()
      sectionY += 16
      ctx.font = 'bold 13px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.85)'
      ctx.textAlign = 'center'
      ctx.fillText('📊 本期 ' + (phaseLabelMap[phase] || '') + ' 累计', W / 2, sectionY)
      sectionY += 20
      ctx.font = '12px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.fillText('🍳 美食 ' + phaseKitchen.length + ' 次  ·  💪 运动 ' + phaseGym.length + ' 次', W / 2, sectionY)
    }

    const ships = { period: '🚢 船入港停泊', follicular: '⛵ 扬帆起航', ovulation: '🚀 全速前进', luteal: '⛴️ 迷雾巡航' }
    ctx.font = '13px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.textAlign = 'center'
    ctx.fillText(ships[phase] || ships.follicular, W / 2, H - 30)
    ctx.font = '11px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillText('汐岛 · 潮汐之间，遇见自己', W / 2, H - 12)

    try {
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) {
            alert('生成图片失败，请重试')
            return
          }
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = 'xidao-' + phase + '.png'
          link.href = url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          setTimeout(() => URL.revokeObjectURL(url), 1000)
          setShowShare(false)
        }, 'image/png')
      } else {
        const link = document.createElement('a')
        link.download = 'xidao-' + phase + '.png'
        link.href = canvas.toDataURL('image/png')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setShowShare(false)
      }
    } catch (err) {
      console.error('下载分享卡失败:', err)
      alert('下载失败，请重试')
    }
  }

  if (currentPage === 'ship') return <div style={{ animation: 'fadeInUp 0.35s ease-out' }}><Ship onBack={handleBack} onOpenLighthouse={navigateToLighthouse} /></div>
  if (currentPage === 'gym') return <div style={{ animation: 'fadeInUp 0.35s ease-out' }}><Gym onBack={handleBack} onOpenLighthouse={navigateToLighthouse} /></div>
  if (currentPage === 'kitchen') return <div style={{ animation: 'fadeInUp 0.35s ease-out' }}><Kitchen onBack={handleBack} onOpenLighthouse={navigateToLighthouse} /></div>
  if (currentPage === 'beach') return <div style={{ animation: 'fadeInUp 0.35s ease-out' }}><Beach onBack={handleBack} onOpenLighthouse={navigateToLighthouse} /></div>
  if (currentPage === 'snorkeling') return <div style={{ animation: 'fadeInUp 0.35s ease-out' }}><Snorkeling onBack={handleBack} onOpenLighthouse={navigateToLighthouse} /></div>
  if (currentPage === 'lighthouse') return <div style={{ animation: 'fadeInUp 0.35s ease-out' }}><Lighthouse onBack={handleBack} initialMode={lighthouseMode} /></div>

  return (
    <>
      <IslandBackground phase={phase} />
      <canvas ref={shareCanvasRef} width={600} height={650} style={{ display: 'none' }} />

      {/* 声音按钮 */}
      <button
        onClick={handleSoundToggle}
        title={soundMuted ? '开启环境音' : '静音'}
        style={{
          position: 'fixed', top: '1rem', left: '1rem', zIndex: 20,
          width: '2.75rem', height: '2.75rem', borderRadius: '50%',
          background: soundMuted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: soundMuted ? '0 2px 10px rgba(0,0,0,0.04)' : '0 4px 20px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '1.1rem',
          transition: 'all 0.25s ease',
          opacity: soundMuted ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {soundMuted ? '🔇' : '🔊'}
      </button>

      {/* 分享按钮 */}
      <button
        onClick={() => setShowShare(true)}
        style={{
          position: 'fixed', top: '1rem', right: '1rem', zIndex: 20,
          width: '2.75rem', height: '2.75rem', borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: '1.1rem',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)'
          e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.14)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        📤
      </button>

      {/* 分享弹窗 — 信封样式 */}
      {showShare && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
            zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem', animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setShowShare(false)}
        >
          <div
            style={{
              background: 'white', borderRadius: '1.75rem', padding: '1.5rem',
              maxWidth: '23rem', width: '100%', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
              animation: 'scaleIn 0.3s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1f2937', marginBottom: '0.25rem' }}>
              ✉️ 生成分享卡
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.75rem' }}>
              信封样式 · 可自由选择展示内容
            </p>

            {/* toggle options */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <label style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 0.75rem', borderRadius: '0.75rem',
                background: shareShowFood ? '#fef3c7' : '#f9fafb',
                border: shareShowFood ? '1.5px solid #f59e0b' : '1.5px solid #e5e7eb',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                transition: 'all 0.2s ease',
              }}>
                <input type="checkbox" checked={shareShowFood} onChange={(e) => setShareShowFood(e.target.checked)}
                  style={{ accentColor: '#f59e0b', width: '1rem', height: '1rem' }} />
                🍳 美食记录 ({sharePreview.todayK.length})
              </label>
              <label style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.6rem 0.75rem', borderRadius: '0.75rem',
                background: shareShowExercise ? '#d1fae5' : '#f9fafb',
                border: shareShowExercise ? '1.5px solid #10b981' : '1.5px solid #e5e7eb',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
                transition: 'all 0.2s ease',
              }}>
                <input type="checkbox" checked={shareShowExercise} onChange={(e) => setShareShowExercise(e.target.checked)}
                  style={{ accentColor: '#10b981', width: '1rem', height: '1rem' }} />
                💪 运动记录 ({sharePreview.todayG.length})
              </label>
            </div>

            {/* preview envelope */}
            <div
              style={{
                width: '100%', height: '16rem', borderRadius: '0.75rem', marginBottom: '1rem',
                background: `linear-gradient(160deg, ${phase === 'period' ? '#475569, #334155' : phase === 'follicular' ? '#eab308, #ca8a04' : phase === 'ovulation' ? '#0284c7, #0369a1' : '#f97316, #c2410c'})`,
                color: 'white', padding: '0.75rem', overflow: 'hidden',
                display: 'flex', flexDirection: 'column', gap: '0.2rem',
                position: 'relative',
                border: '2px dashed rgba(255,255,255,0.18)',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '2.5rem',
                background: `linear-gradient(180deg, ${phase === 'period' ? 'rgba(100,116,139,0.5)' : phase === 'follicular' ? 'rgba(253,224,71,0.5)' : phase === 'ovulation' ? 'rgba(56,189,248,0.5)' : 'rgba(251,146,60,0.5)'}, transparent)`,
              }} />
              <div style={{
                position: 'absolute', top: '0.5rem', right: '0.75rem',
                width: '2rem', height: '2rem', borderRadius: '50%',
                border: `2px solid ${phase === 'period' ? '#64748b' : phase === 'follicular' ? '#ca8a04' : phase === 'ovulation' ? '#0284c7' : '#ea580c'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>{phaseInfo.icon}</div>
              <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>汐岛</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.65, marginLeft: '0.5rem' }}>{phaseInfo.name} · 第{cycleData?.cycleDay || 1}天</span>
              </div>
              <p style={{ fontSize: '0.68rem', opacity: 0.8, textAlign: 'center', margin: 0, fontStyle: 'italic' }}>
                "{todayQuote.text.slice(0, 30)}{todayQuote.text.length > 30 ? '…' : ''}"
              </p>

              {/* food image thumbnails */}
              <div style={{ flex: 1, overflow: 'hidden', marginTop: '0.25rem' }}>
                {sharePreview.foodImages.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', alignItems: 'flex-start' }}>
                    {sharePreview.foodImages.slice(0, 12).map((fi, i) => (
                      <div key={i} style={{
                        width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem',
                        background: 'rgba(255,255,255,0.9)', overflow: 'hidden',
                        border: '1.5px solid rgba(255,255,255,0.5)',
                        position: 'relative', flexShrink: 0,
                      }}>
                        <img src={fi.src} alt={fi.label} style={{
                          width: '100%', height: '100%', objectFit: 'cover',
                        }} />
                        <span style={{
                          position: 'absolute', bottom: 0, right: 0,
                          fontSize: '0.45rem', background: fi.type === 'gym' ? '#10b981' : '#f59e0b',
                          color: 'white', padding: '0 0.15rem', borderRadius: '0.15rem 0 0 0',
                        }}>{fi.type === 'gym' ? '💪' : '🍳'}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.62rem', opacity: 0.5, textAlign: 'center', margin: 0 }}>
                    勾选上方选项以预览
                  </p>
                )}
                {(sharePreview.phaseK.length > 0 || sharePreview.phaseG.length > 0) && (
                  <div style={{ fontSize: '0.62rem', opacity: 0.7, textAlign: 'center', marginTop: '0.25rem', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '0.2rem' }}>
                    📊 本期累计 · 🍳{sharePreview.phaseK.length}次 💪{sharePreview.phaseG.length}次
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleShareDownload}
                className="btn-elegant"
                style={{
                  flex: 1, padding: '0.75rem',
                  background: 'linear-gradient(135deg, #0891b2, #0e7490)',
                  color: 'white', borderRadius: '0.75rem', border: 'none',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem',
                }}
              >
                📥 下载图片
              </button>
              <button
                onClick={() => setShowShare(false)}
                className="btn-elegant"
                style={{
                  flex: 1, padding: '0.75rem', background: '#f3f4f6',
                  color: '#374151', borderRadius: '0.75rem', border: 'none',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem',
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ======== 主内容 ======== */}
      <div style={{
        minHeight: '100vh',
        padding: '1.5rem',
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* ---- Header ---- */}
        <div style={{
          textAlign: 'center',
          paddingTop: '2.5rem',
          paddingBottom: '1.75rem',
          animation: 'fadeInUp 0.6s ease-out',
        }}>
          {/* 岛屿照片 */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
            <div style={{
              position: 'absolute', inset: '-6px', borderRadius: '50%',
              background: `conic-gradient(from 0deg, ${phaseInfo.hue}40, ${phaseInfo.hue}20, ${phaseInfo.hue}40, transparent, ${phaseInfo.hue}40)`,
              animation: 'pulseGlow 4s linear infinite',
              filter: 'blur(8px)',
            }} />
            <img
              src={islandPhoto}
              alt="汐岛"
              style={{
                width: '5rem', height: '5rem', objectFit: 'cover',
                borderRadius: '50%', display: 'block', position: 'relative', zIndex: 1,
                boxShadow: '0 4px 24px rgba(0,0,0,0.18), 0 0 0 4px rgba(255,255,255,0.25)',
                filter: 'saturate(1.1)',
              }}
            />
          </div>

          {/* 标题 */}
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 700,
            color: 'white',
            textShadow: '0 2px 24px rgba(0,0,0,0.18)',
            letterSpacing: '0.06em',
            marginBottom: '0.15rem',
          }}>
            汐岛
          </h1>

          {/* 时期指示器 */}
          <div style={{
            marginTop: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.22)',
            backdropFilter: 'blur(14px)',
            padding: '0.45rem 1.25rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255,255,255,0.28)',
            boxShadow: `0 2px 16px ${phaseInfo.hue}20`,
          }}>
            <span style={{ fontSize: '1.2rem' }}>{phaseInfo.icon}</span>
            <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>{phaseInfo.name}</span>
            <span style={{
              color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem',
              background: 'rgba(255,255,255,0.12)', padding: '0.15rem 0.6rem', borderRadius: '9999px',
            }}>
              第{cycleData?.cycleDay || 1}天
            </span>
          </div>

          {/* 问候语 */}
          <p style={{
            marginTop: '0.6rem', color: 'rgba(255,255,255,0.9)',
            fontSize: '0.9rem', fontWeight: 300, letterSpacing: '0.03em',
          }}>
            {phaseInfo.greeting}
          </p>

          {/* 每日语录 */}
          <div style={{
            maxWidth: '28rem', margin: '0.9rem auto 0',
            padding: '0.8rem 1.25rem',
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(16px)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255,255,255,0.22)',
            animation: 'fadeInUp 0.5s ease-out 0.25s both',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* 引号装饰 */}
            <span style={{
              position: 'absolute', top: '0.2rem', left: '0.75rem',
              fontSize: '2.5rem', color: 'rgba(255,255,255,0.12)',
              fontFamily: 'Georgia, serif', lineHeight: 1,
            }}>&ldquo;</span>
            <p style={{
              color: 'rgba(255,255,255,0.95)', fontSize: '0.85rem',
              lineHeight: 1.7, margin: 0, fontStyle: 'italic',
              letterSpacing: '0.02em', position: 'relative', zIndex: 1,
              paddingLeft: '0.6rem',
            }}>
              {todayQuote.text}
            </p>
            <p style={{
              color: 'rgba(255,255,255,0.55)', fontSize: '0.7rem',
              marginTop: '0.35rem', marginBottom: 0, textAlign: 'right',
              position: 'relative', zIndex: 1,
            }}>
              —— {todayQuote.author}
            </p>
          </div>
        </div>

        {/* ---- 模块网格 ---- */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem',
          maxWidth: '28rem', margin: '0 auto', width: '100%',
          padding: '0 0.25rem',
        }}>
          {modules.map((m, index) => (
            <button
              key={m.id}
              onClick={() => setCurrentPage(m.id)}
              className="module-card"
              style={{
                background: 'rgba(255,255,255,0.94)',
                borderRadius: '1.5rem',
                padding: '1.35rem 1.1rem',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                boxShadow: '0 4px 20px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
                animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.15}s both`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* 顶部色条 */}
              <div style={{
                position: 'absolute', top: 0, left: '20%', right: '20%',
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${m.accent}60, ${m.accent}40, transparent)`,
                borderRadius: '0 0 3px 3px',
              }} />

              {/* 图标区 */}
              <div style={{
                width: '3.5rem', height: '3.5rem',
                marginBottom: '0.6rem',
                background: m.accentSoft,
                borderRadius: '1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.25s ease',
              }}>
                <img
                  src={m.icon} alt={m.title}
                  style={{ width: '2.25rem', height: '2.25rem', objectFit: 'contain' }}
                />
              </div>

              {/* 标题和副标题 */}
              <h3 style={{
                fontWeight: 700, fontSize: '1.05rem', color: '#1e293b',
                marginBottom: '0.15rem', letterSpacing: '0.02em',
              }}>
                {m.title}
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{m.subtitle}</p>

              {/* 小装饰 */}
              <span style={{
                position: 'absolute', bottom: '0.5rem', right: '0.75rem',
                fontSize: '1.1rem', opacity: 0.4,
              }}>{m.decor}</span>
            </button>
          ))}
        </div>

        {/* ---- 智慧灯塔入口 ---- */}
        <div style={{
          maxWidth: '28rem', margin: '1.25rem auto 0', width: '100%',
          padding: '0 0.25rem',
          animation: 'fadeInUp 0.5s ease-out 0.55s both',
        }}>
          <button
            onClick={() => navigateToLighthouse('companion')}
            className="module-card"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,243,199,0.5) 100%)',
              borderRadius: '1.5rem',
              padding: '1rem 1.3rem',
              border: '1px solid rgba(251,191,36,0.25)',
              cursor: 'pointer',
              textAlign: 'left',
              boxShadow: '0 4px 20px rgba(251,191,36,0.12), 0 1px 3px rgba(0,0,0,0.04)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', gap: '1rem',
            }}
          >
            {/* 顶部金光色条 */}
            <div style={{
              position: 'absolute', top: 0, left: '15%', right: '15%',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #fbbf24, #f59e0b, #fbbf24, transparent)',
              borderRadius: '0 0 3px 3px',
            }} />
            {/* 图标 */}
            <div style={{
              width: '3.2rem', height: '3.2rem',
              background: 'linear-gradient(135deg, #fef9c3, #fef3c7)',
              borderRadius: '1rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 12px rgba(251,191,36,0.2)',
            }}>
              <span style={{ fontSize: '1.6rem' }}>🗼</span>
            </div>
            {/* 文字 */}
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontWeight: 700, fontSize: '1.05rem', color: '#1e293b',
                marginBottom: '0.1rem', letterSpacing: '0.02em',
              }}>
                智慧灯塔
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
                AI 陪伴 · 日志分析 · 运动饮食建议
              </p>
            </div>
            {/* 箭头 */}
            <span style={{ fontSize: '1.2rem', color: '#fbbf24', flexShrink: 0 }}>→</span>
          </button>
        </div>

        {/* ---- 浮潜入口 ---- */}
        <div style={{
          textAlign: 'center', marginTop: '1.25rem',
          animation: 'fadeInUp 0.5s ease-out 0.6s both',
        }}>
          <button
            onClick={() => setCurrentPage('snorkeling')}
            className="btn-elegant"
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.22)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.8rem 2rem',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              letterSpacing: '0.03em',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🌊</span>
            <span>进入浮潜区 · 深海日志</span>
          </button>
        </div>

        {/* ---- 底部操作 ---- */}
        <div style={{
          textAlign: 'center', marginTop: 'auto', paddingTop: '2.5rem',
          paddingBottom: '1rem',
          animation: 'fadeInUp 0.5s ease-out 0.65s both',
        }}>
          {/* 日期显示 */}
          <div style={{
            color: 'rgba(255,255,255,0.55)',
            fontSize: '0.85rem',
            marginBottom: '0.6rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            fontFamily: '"Noto Serif SC", Georgia, STKaiti, KaiTi, serif',
          }}>
            {new Date().getFullYear()}年{new Date().getMonth() + 1}月{new Date().getDate()}日
          </div>
          <button
            onClick={() => {
              const newDate = prompt('请输入最近一次月经开始日期（格式：YYYY-MM-DD）：', cycleData?.lastPeriod || '')
              if (newDate && window.confirm(`确认将月经开始日期设置为 ${newDate}？`)) {
                register(newDate, cycleData?.duration || 5)
                window.location.reload()
              }
            }}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
              fontSize: '0.75rem', padding: '0.5rem 1rem',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          >
            📅 重新设置日期
          </button>
          <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 0.5rem' }}>|</span>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
              fontSize: '0.85rem', padding: '0.5rem 1rem',
              fontWeight: 600,
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.95)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >
            离开小岛
          </button>
        </div>
      </div>
    </>
  )
}
