import { useRef, useEffect, useCallback } from 'react'

/**
 * 程序化环境白噪音 — 四相四种自然之声
 *
 * 月经期 → 雨声 (filtered white noise + droplet pings)
 * 卵泡期 → 晨间微风 + 风铃 (brown noise + random chimes)
 * 排卵日 → 海浪 (modulated pink noise with LFO wave cycle)
 * 黄体期 → 秋日柔风 (warm brown noise + layered breeze + gentle leaf rustle)
 */

const PHASE_SOUNDS = ['period', 'follicular', 'ovulation', 'luteal']

function createNoiseBuffer(ctx, duration = 2, type = 'white') {
  const sampleRate = ctx.sampleRate
  const length = sampleRate * duration
  const buffer = ctx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  // 用 IIR 近似的粉红/布朗噪声
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0

  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1

    if (type === 'white') {
      data[i] = white
    } else if (type === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11
      b6 = white * 0.115926
    } else if (type === 'brown') {
      // 布朗噪声: 积分白噪声
      data[i] = (b0 + white * 0.02)
      b0 = data[i]
      // 防止漂移
      if (Math.abs(data[i]) > 1) {
        data[i] = Math.max(-1, Math.min(1, data[i]))
        b0 *= 0.99
      }
    }
  }
  return buffer
}

// ======== 雨声引擎 (period) ========
function buildRainEngine(ctx, masterGain) {
  const nodes = []

  // 主雨声层: 白噪声 → 带通 → 增益
  const noiseBuf = createNoiseBuffer(ctx, 4, 'white')
  const rainSrc = ctx.createBufferSource()
  rainSrc.buffer = noiseBuf
  rainSrc.loop = true

  const rainBandpass = ctx.createBiquadFilter()
  rainBandpass.type = 'bandpass'
  rainBandpass.frequency.value = 800
  rainBandpass.Q.value = 0.5

  const rainHighpass = ctx.createBiquadFilter()
  rainHighpass.type = 'highpass'
  rainHighpass.frequency.value = 300

  const rainGain = ctx.createGain()
  rainGain.gain.value = 0.25

  rainSrc.connect(rainBandpass)
  rainBandpass.connect(rainHighpass)
  rainHighpass.connect(rainGain)
  rainGain.connect(masterGain)
  rainSrc.start()
  nodes.push(rainSrc)

  // 细雨层: 轻微调制
  const noiseBuf2 = createNoiseBuffer(ctx, 3, 'pink')
  const drizzleSrc = ctx.createBufferSource()
  drizzleSrc.buffer = noiseBuf2
  drizzleSrc.loop = true

  const drizzleFilter = ctx.createBiquadFilter()
  drizzleFilter.type = 'bandpass'
  drizzleFilter.frequency.value = 2000
  drizzleFilter.Q.value = 0.3

  const drizzleGain = ctx.createGain()
  drizzleGain.gain.value = 0.08

  // LFO 调制细雨层
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.3
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 300
  lfo.connect(lfoGain)
  lfoGain.connect(drizzleFilter.frequency)
  lfo.start()
  nodes.push(lfo, drizzleSrc)

  drizzleSrc.connect(drizzleFilter)
  drizzleFilter.connect(drizzleGain)
  drizzleGain.connect(masterGain)
  drizzleSrc.start()

  // 水滴叮咚 — 随机短促高音
  let dropletTimer
  function scheduleDroplet() {
    const delay = 0.6 + Math.random() * 2.5
    dropletTimer = setTimeout(() => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 800 + Math.random() * 1200
      const env = ctx.createGain()
      env.gain.setValueAtTime(0, ctx.currentTime)
      env.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.01)
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.connect(env)
      env.connect(masterGain)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
      nodes.push(osc)
      scheduleDroplet()
    }, delay * 1000)
  }
  scheduleDroplet()

  // 清理函数
  return () => {
    clearTimeout(dropletTimer)
    nodes.forEach((n) => {
      try { n.stop?.(); n.disconnect?.() } catch {}
    })
  }
}

// ======== 晨风 + 风铃引擎 (follicular) ========
function buildBreezeEngine(ctx, masterGain) {
  const nodes = []

  // 风声: 布朗噪声 → 低通
  const windBuf = createNoiseBuffer(ctx, 5, 'brown')
  const windSrc = ctx.createBufferSource()
  windSrc.buffer = windBuf
  windSrc.loop = true

  const windLowpass = ctx.createBiquadFilter()
  windLowpass.type = 'lowpass'
  windLowpass.frequency.value = 400
  windLowpass.Q.value = 0.5

  const windGain = ctx.createGain()
  windGain.gain.value = 0.20

  // 风力度 LFO
  const windLFO = ctx.createOscillator()
  windLFO.frequency.value = 0.06
  const windLFOGain = ctx.createGain()
  windLFOGain.gain.value = 0.06
  windLFO.connect(windLFOGain)
  windLFOGain.connect(windGain.gain)
  windLFO.start()
  nodes.push(windLFO)

  windSrc.connect(windLowpass)
  windLowpass.connect(windGain)
  windGain.connect(masterGain)
  windSrc.start()
  nodes.push(windSrc)

  // 风铃 — 随机轻柔音
  const chimeFreqs = [523, 659, 784, 880, 1047, 1175, 1319] // C5-E6 泛音列
  let chimeTimer
  function scheduleChime() {
    const delay = 4 + Math.random() * 8
    chimeTimer = setTimeout(() => {
      const freq = chimeFreqs[Math.floor(Math.random() * chimeFreqs.length)]
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const env = ctx.createGain()
      env.gain.setValueAtTime(0, ctx.currentTime)
      env.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.05)
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5)
      osc.connect(env)
      env.connect(masterGain)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 3)
      nodes.push(osc)
      scheduleChime()
    }, delay * 1000)
  }
  scheduleChime()

  return () => {
    clearTimeout(chimeTimer)
    nodes.forEach((n) => {
      try { n.stop?.(); n.disconnect?.() } catch {}
    })
  }
}

// ======== 海浪引擎 (ovulation) ========
function buildWaveEngine(ctx, masterGain) {
  const nodes = []

  // 主浪声: 粉红噪声 → 带通 → LFO 调制增益模拟潮汐
  const waveBuf = createNoiseBuffer(ctx, 6, 'pink')
  const waveSrc = ctx.createBufferSource()
  waveSrc.buffer = waveBuf
  waveSrc.loop = true

  const waveFilter = ctx.createBiquadFilter()
  waveFilter.type = 'lowpass'
  waveFilter.frequency.value = 900
  waveFilter.Q.value = 0.6

  // 潮汐 LFO 调制增益 — 模拟浪涌（柔化版）
  const tideLFO = ctx.createOscillator()
  tideLFO.type = 'sine'
  tideLFO.frequency.value = 0.07 // ~14秒一个浪周期，更舒缓

  const tideLFOGain = ctx.createGain()
  tideLFOGain.gain.value = 0.08

  const waveGain = ctx.createGain()
  waveGain.gain.value = 0.08 // 基础值降低

  tideLFO.connect(tideLFOGain)
  tideLFOGain.connect(waveGain.gain)
  tideLFO.start()
  nodes.push(tideLFO)

  waveSrc.connect(waveFilter)
  waveFilter.connect(waveGain)
  waveGain.connect(masterGain)
  waveSrc.start()
  nodes.push(waveSrc)

  // 浪花泡沫层: 白噪声 → 高通 → LFO 同步调制
  const foamBuf = createNoiseBuffer(ctx, 4, 'white')
  const foamSrc = ctx.createBufferSource()
  foamSrc.buffer = foamBuf
  foamSrc.loop = true

  const foamHighpass = ctx.createBiquadFilter()
  foamHighpass.type = 'highpass'
  foamHighpass.frequency.value = 2500 // 更高通，减少刺耳感

  const foamGain = ctx.createGain()
  foamGain.gain.value = 0.03 // 降低泡沫层音量

  // 同步 LFO 但相位错开
  const foamLFO = ctx.createOscillator()
  foamLFO.type = 'sine'
  foamLFO.frequency.value = 0.07
  const foamLFOGain = ctx.createGain()
  foamLFOGain.gain.value = 0.025
  foamLFO.connect(foamLFOGain)
  foamLFOGain.connect(foamGain.gain)
  foamLFO.start()
  nodes.push(foamLFO)

  foamSrc.connect(foamHighpass)
  foamHighpass.connect(foamGain)
  foamGain.connect(masterGain)
  foamSrc.start()
  nodes.push(foamSrc)

  // 远处低频海涌
  const deepBuf = createNoiseBuffer(ctx, 5, 'brown')
  const deepSrc = ctx.createBufferSource()
  deepSrc.buffer = deepBuf
  deepSrc.loop = true

  const deepLowpass = ctx.createBiquadFilter()
  deepLowpass.type = 'lowpass'
  deepLowpass.frequency.value = 150 // 更低通，更柔和

  const deepGain = ctx.createGain()
  deepGain.gain.value = 0.06 // 降低深层音量

  // 低频 LFO 更慢
  const deepLFO = ctx.createOscillator()
  deepLFO.type = 'sine'
  deepLFO.frequency.value = 0.04 // 更缓慢的深层呼吸
  const deepLFOGain = ctx.createGain()
  deepLFOGain.gain.value = 0.04
  deepLFO.connect(deepLFOGain)
  deepLFOGain.connect(deepGain.gain)
  deepLFO.start()
  nodes.push(deepLFO)

  deepSrc.connect(deepLowpass)
  deepLowpass.connect(deepGain)
  deepGain.connect(masterGain)
  deepSrc.start()
  nodes.push(deepSrc)

  return () => {
    nodes.forEach((n) => {
      try { n.stop?.(); n.disconnect?.() } catch {}
    })
  }
}

// ======== 秋日柔风引擎 (luteal) ========
// 温暖持续的低频风声 + 柔和树叶沙沙，避免突兀脉冲
function buildAutumnBreezeEngine(ctx, masterGain) {
  const nodes = []

  // 主风声: 布朗噪声 → 低通 → 温暖基底
  const windBuf = createNoiseBuffer(ctx, 5, 'brown')
  const windSrc = ctx.createBufferSource()
  windSrc.buffer = windBuf
  windSrc.loop = true

  const windLowpass = ctx.createBiquadFilter()
  windLowpass.type = 'lowpass'
  windLowpass.frequency.value = 350
  windLowpass.Q.value = 0.5

  const windGain = ctx.createGain()
  windGain.gain.value = 0.22

  // 缓慢呼吸式 LFO — 模拟风的自然起伏
  const windLFO = ctx.createOscillator()
  windLFO.type = 'sine'
  windLFO.frequency.value = 0.08
  const windLFOGain = ctx.createGain()
  windLFOGain.gain.value = 0.06
  windLFO.connect(windLFOGain)
  windLFOGain.connect(windGain.gain)
  windLFO.start()
  nodes.push(windLFO)

  // 第二层 LFO：更长周期的缓慢变化
  const slowLFO = ctx.createOscillator()
  slowLFO.type = 'sine'
  slowLFO.frequency.value = 0.035
  const slowLFOGain = ctx.createGain()
  slowLFOGain.gain.value = 0.04
  slowLFO.connect(slowLFOGain)
  slowLFOGain.connect(windGain.gain)
  slowLFO.start()
  nodes.push(slowLFO)

  windSrc.connect(windLowpass)
  windLowpass.connect(windGain)
  windGain.connect(masterGain)
  windSrc.start()
  nodes.push(windSrc)

  // 树叶沙沙层: 粉红噪声 → 带通 → 轻微调制
  const leafBuf = createNoiseBuffer(ctx, 4, 'pink')
  const leafSrc = ctx.createBufferSource()
  leafSrc.buffer = leafBuf
  leafSrc.loop = true

  const leafFilter = ctx.createBiquadFilter()
  leafFilter.type = 'bandpass'
  leafFilter.frequency.value = 1500
  leafFilter.Q.value = 0.4

  const leafGain = ctx.createGain()
  leafGain.gain.value = 0.06

  // 轻快的 LFO 模拟树叶簌簌
  const leafLFO = ctx.createOscillator()
  leafLFO.type = 'sine'
  leafLFO.frequency.value = 0.15
  const leafLFOGain = ctx.createGain()
  leafLFOGain.gain.value = 0.03
  leafLFO.connect(leafLFOGain)
  leafLFOGain.connect(leafGain.gain)
  leafLFO.start()
  nodes.push(leafLFO)

  leafSrc.connect(leafFilter)
  leafFilter.connect(leafGain)
  leafGain.connect(masterGain)
  leafSrc.start()
  nodes.push(leafSrc)

  // 远处低频暖意: 极低通布朗噪声
  const deepBuf = createNoiseBuffer(ctx, 5, 'brown')
  const deepSrc = ctx.createBufferSource()
  deepSrc.buffer = deepBuf
  deepSrc.loop = true

  const deepLowpass = ctx.createBiquadFilter()
  deepLowpass.type = 'lowpass'
  deepLowpass.frequency.value = 100

  const deepGain = ctx.createGain()
  deepGain.gain.value = 0.10

  const deepLFO = ctx.createOscillator()
  deepLFO.type = 'sine'
  deepLFO.frequency.value = 0.05
  const deepLFOGain = ctx.createGain()
  deepLFOGain.gain.value = 0.04
  deepLFO.connect(deepLFOGain)
  deepLFOGain.connect(deepGain.gain)
  deepLFO.start()
  nodes.push(deepLFO)

  deepSrc.connect(deepLowpass)
  deepLowpass.connect(deepGain)
  deepGain.connect(masterGain)
  deepSrc.start()
  nodes.push(deepSrc)

  // 偶尔的轻柔树叶翻转声 — 比篝火噼啪更柔和、更稀疏
  let rustleTimer
  function scheduleRustle() {
    const delay = 3 + Math.random() * 10
    rustleTimer = setTimeout(() => {
      const burstLen = 0.3 + Math.random() * 0.5
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 400 + Math.random() * 800
      const env = ctx.createGain()
      env.gain.setValueAtTime(0, ctx.currentTime)
      env.gain.linearRampToValueAtTime(0.008 + Math.random() * 0.015, ctx.currentTime + burstLen * 0.3)
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + burstLen)
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 600 + Math.random() * 2000
      bp.Q.value = 1.5
      osc.connect(bp)
      bp.connect(env)
      env.connect(masterGain)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + burstLen + 0.2)
      nodes.push(osc)
      scheduleRustle()
    }, delay * 1000)
  }
  scheduleRustle()

  return () => {
    clearTimeout(rustleTimer)
    nodes.forEach((n) => {
      try { n.stop?.(); n.disconnect?.() } catch {}
    })
  }
}

// ======== Hook ========

export default function useAmbientSound(phase = 'follicular') {
  const ctxRef = useRef(null)
  const masterGainRef = useRef(null)
  const cleanupRef = useRef(null)
  const currentPhaseRef = useRef(null)
  const isPlayingRef = useRef(false)

  // 初始化 AudioContext（惰性，首次用户交互后）
  const ensureContext = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      masterGainRef.current = ctxRef.current.createGain()
      masterGainRef.current.gain.value = 0.25
      masterGainRef.current.connect(ctxRef.current.destination)
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume()
    }
    return ctxRef.current
  }, [])

  // 停止当前声音
  const stopSound = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current()
      cleanupRef.current = null
    }
    currentPhaseRef.current = null
    isPlayingRef.current = false
  }, [])

  // 启动特定时期的声音
  const startSound = useCallback((targetPhase) => {
    if (!PHASE_SOUNDS.includes(targetPhase)) return

    // 如果已经在播这个相的声音，不重复启动
    if (currentPhaseRef.current === targetPhase && isPlayingRef.current) return

    stopSound()

    const ctx = ensureContext()
    const master = masterGainRef.current

    switch (targetPhase) {
      case 'period':
        cleanupRef.current = buildRainEngine(ctx, master)
        break
      case 'follicular':
        cleanupRef.current = buildBreezeEngine(ctx, master)
        break
      case 'ovulation':
        cleanupRef.current = buildWaveEngine(ctx, master)
        break
      case 'luteal':
        cleanupRef.current = buildAutumnBreezeEngine(ctx, master)
        break
      default:
        return
    }

    currentPhaseRef.current = targetPhase
    isPlayingRef.current = true
  }, [stopSound, ensureContext])

  // phase 变化时自动切换
  useEffect(() => {
    startSound(phase)
    return () => {
      // 组件卸载时清理
    }
  }, [phase, startSound])

  // 切换静音
  const toggle = useCallback(() => {
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (!ctx || !master) return

    if (isPlayingRef.current) {
      master.gain.setValueAtTime(0, ctx.currentTime)
      isPlayingRef.current = false
    } else {
      ensureContext()
      master.gain.setValueAtTime(0.25, ctx.currentTime)
      isPlayingRef.current = true
      // 如果之前没有启动过声音，启动一下
      if (!currentPhaseRef.current) {
        startSound(phase)
      }
    }
  }, [ensureContext, startSound, phase])

  // 设置音量 0-1
  const setVolume = useCallback((vol) => {
    const ctx = ctxRef.current
    const master = masterGainRef.current
    if (ctx && master) {
      master.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), ctx.currentTime)
    }
  }, [])

  // 组件卸载时完全清理
  useEffect(() => {
    return () => {
      stopSound()
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close()
      }
    }
  }, [stopSound])

  return { toggle, setVolume, isPlaying: isPlayingRef.current }
}
