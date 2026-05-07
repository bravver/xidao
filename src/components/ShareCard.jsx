import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCycle } from '../context/CycleContext'
import { getPhaseConfig } from '../utils/cycleCalculator'

export default function ShareCard() {
  const [show, setShow] = useState(false)
  const { cycleData } = useCycle()
  const config = cycleData ? getPhaseConfig(cycleData.phase.name) : getPhaseConfig('period')
  const canvasRef = useRef(null)

  const phaseNames = {
    period: '月经期',
    follicular: '卵泡期',
    ovulation: '排卵日',
    luteal: '黄体期',
  }

  const phaseIcons = {
    period: '🌧️',
    follicular: '🌅',
    ovulation: '☀️',
    luteal: '🌅',
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 600, 400)
    if (cycleData?.phase.name === 'period') {
      gradient.addColorStop(0, '#64748B')
      gradient.addColorStop(1, '#334155')
    } else if (cycleData?.phase.name === 'follicular') {
      gradient.addColorStop(0, '#FCD34D')
      gradient.addColorStop(1, '#F9A8D4')
    } else if (cycleData?.phase.name === 'ovulation') {
      gradient.addColorStop(0, '#FDE047')
      gradient.addColorStop(1, '#3B82F6')
    } else {
      gradient.addColorStop(0, '#FB923C')
      gradient.addColorStop(1, '#A855F7')
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 600, 400)

    // Add decorative waves
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(0, 300 + i * 30)
      ctx.quadraticCurveTo(300, 280 + i * 30, 600, 300 + i * 30)
      ctx.lineTo(600, 400)
      ctx.lineTo(0, 400)
      ctx.fill()
    }

    // Title
    ctx.fillStyle = 'white'
    ctx.font = 'bold 48px Georgia, serif'
    ctx.textAlign = 'center'
    ctx.fillText('汐岛', 300, 80)

    // Island emoji
    ctx.font = '60px Arial'
    ctx.fillText('🏝️', 300, 150)

    // Phase
    ctx.font = 'bold 28px system-ui, sans-serif'
    const phaseText = `${phaseIcons[cycleData?.phase.name]} ${phaseNames[cycleData?.phase.name]}`
    ctx.fillText(phaseText, 300, 210)

    // Tip
    ctx.font = '18px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'

    // Wrap long text
    const tip = config.tip
    const maxWidth = 500
    const words = tip.split('')
    let line = ''
    let y = 260

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i]
      const metrics = ctx.measureText(testLine)
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 300, y)
        line = words[i]
        y += 28
      } else {
        line = testLine
      }
    }
    ctx.fillText(line, 300, y)

    // Ship status
    ctx.font = '16px system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.fillText(`⛵ ${config.ship}`, 300, 350)

    // Cycle day
    ctx.font = '14px system-ui, sans-serif'
    ctx.fillText(`第 ${cycleData?.cycleDay || 0} 天`, 300, 380)

    // Download
    const link = document.createElement('a')
    link.download = `xidao-${cycleData?.phase.name || 'share'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()

    setShow(false)
  }

  return (
    <>
      {/* Share Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShow(true)}
        className="fixed top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-xl z-30 hover:bg-white transition-colors"
      >
        📤
      </motion.button>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} width="600" height="400" className="hidden" />

      {/* Share Panel */}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 bg-white rounded-2xl p-5 shadow-xl z-30 max-w-xs w-64"
          >
            <h3 className="font-bold text-gray-800 mb-1">生成分享卡</h3>
            <p className="text-sm text-gray-500 mb-4">下载一张精美的图片分享</p>

            {/* Preview */}
            <div
              className="w-full h-32 rounded-xl mb-4 flex items-center justify-center text-white text-center p-4"
              style={{
                background: `linear-gradient(135deg, ${
                  cycleData?.phase.name === 'period' ? '#64748B, #334155' :
                  cycleData?.phase.name === 'follicular' ? '#FCD34D, #F9A8D4' :
                  cycleData?.phase.name === 'ovulation' ? '#FDE047, #3B82F6' :
                  '#FB923C, #A855F7'
                })`,
              }}
            >
              <div>
                <div className="text-3xl mb-1">🏝️</div>
                <div className="text-sm font-medium">
                  {phaseIcons[cycleData?.phase.name]} {phaseNames[cycleData?.phase.name]}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownload}
                className="flex-1 py-2.5 bg-gradient-to-r from-ocean-500 to-ocean-600 text-white rounded-xl text-sm font-medium"
              >
                下载图片
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShow(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm"
              >
                关闭
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}