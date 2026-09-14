import { useState, useRef, useEffect, useCallback } from 'react'
import { useCycle } from '../context/CycleContext'
import { getPhaseConfig } from '../utils/cycleCalculator'
import { callAI, generateGreeting } from '../utils/aiChat'

const MODES = [
  { id: 'companion', label: '情绪陪伴', icon: '💬', desc: '和我聊聊吧' },
  { id: 'recommend', label: '今日推荐', icon: '🌟', desc: '今天适合做什么' },
  { id: 'analysis', label: '日志分析', icon: '🔍', desc: '看见自己的模式' },
  { id: 'advice', label: '运动饮食', icon: '🍃', desc: '基于时期的建议' },
]

function buildContext(cycleData) {
  const ctx = {}
  if (cycleData) {
    ctx.cycleData = {
      phase: cycleData.phase?.name || 'follicular',
      phaseLabel: cycleData.phase?.label || '卵泡期',
      cycleDay: cycleData.cycleDay || 1,
      lastPeriod: cycleData.lastPeriod || '',
      duration: cycleData.duration || 5,
    }
  }
  try {
    const emotions = JSON.parse(localStorage.getItem('xidao_emotions') || '[]')
    if (emotions.length > 0) ctx.emotions = emotions
  } catch {}
  try {
    const entries = JSON.parse(localStorage.getItem('xidao_calendar_entries') || '{}')
    if (Object.keys(entries).length > 0) ctx.calendarEntries = entries
  } catch {}
  try {
    const gym = JSON.parse(localStorage.getItem('xidao_gym_rewards') || '[]')
    if (gym.length > 0) ctx.gymRewards = gym
  } catch {}
  try {
    const kitchen = JSON.parse(localStorage.getItem('xidao_kitchen_rewards') || '[]')
    if (kitchen.length > 0) ctx.kitchenRewards = kitchen
  } catch {}
  return ctx
}

const phaseColors = {
  period: { user: '#64748b', ai: '#f1f5f9', aiText: '#334155', accent: '#94a3b8' },
  follicular: { user: '#eab308', ai: '#fef9c3', aiText: '#4a3f0a', accent: '#fde047' },
  ovulation: { user: '#0ea5e9', ai: '#e0f2fe', aiText: '#0c4a6e', accent: '#38bdf8' },
  luteal: { user: '#f97316', ai: '#ffedd5', aiText: '#4a1f03', accent: '#fb923c' },
}

export default function Lighthouse({ onBack, initialMode = 'companion' }) {
  const { cycleData } = useCycle()
  const phase = cycleData?.phase?.name || 'follicular'
  const colors = phaseColors[phase] || phaseColors.follicular
  const phaseConfig = getPhaseConfig(phase)

  const [mode, setMode] = useState(initialMode)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])

  // 首次进入 — 根据用户数据生成个性化问候
  const [greetingLoading, setGreetingLoading] = useState(true)
  useEffect(() => {
    let cancelled = false
    async function loadGreeting() {
      setGreetingLoading(true)
      setMessages([])
      setMode(initialMode)
      try {
        const context = buildContext(cycleData)
        const greeting = await generateGreeting(initialMode, context)
        if (!cancelled) {
          setMessages([{ role: 'assistant', content: greeting }])
        }
      } catch (e) {
        if (!cancelled) {
          setMessages([{
            role: 'assistant',
            content: '嗨，我是汐汐，汐岛的灯塔守护者。有什么想聊的吗？',
          }])
        }
      }
      if (!cancelled) setGreetingLoading(false)
    }
    loadGreeting()
    return () => { cancelled = true }
  }, [initialMode])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    setInput('')
    setError('')
    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const context = buildContext(cycleData)
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))

      const reply = await callAI({ mode, messages: apiMessages, context })
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (e) {
      const msg = e.message || '网络连接失败，请检查网络后重试'
      setError(msg.includes('API Key') ? msg : `网络连接失败：${msg}`)
    }
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleModeChange = async (newMode) => {
    setMode(newMode)
    setMessages([])
    setGreetingLoading(true)
    setError('')
    inputRef.current?.focus()
    try {
      const context = buildContext(cycleData)
      const greeting = await generateGreeting(newMode, context)
      setMessages([{ role: 'assistant', content: greeting }])
    } catch (e) {
      const modeInfo = MODES.find(m => m.id === newMode)
      setMessages([{
        role: 'assistant',
        content: `好的，切换到「${modeInfo.label}」模式。有什么想聊的吗？`,
      }])
    }
    setGreetingLoading(false)
  }

  const handleQuickAction = (prompt) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(170deg, ${phaseConfig.bgGradient[0]}22 0%, ${phaseConfig.bgGradient[2]}18 100%)`,
    }}>
      {/* 灯塔光束装饰 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '-30%', left: '50%',
          width: '120vw', height: '140vh',
          transform: 'translateX(-50%)',
          background: `radial-gradient(ellipse at 50% 0%, ${colors.accent}18 0%, transparent 70%)`,
          animation: 'pulseGlow 8s ease-in-out infinite',
        }} />
        {/* 浮游粒子 */}
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            borderRadius: '50%',
            background: colors.accent,
            opacity: 0.15 + Math.random() * 0.25,
            animation: `float ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite`,
          }} />
        ))}
      </div>

      {/* 主内容 */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        height: '100vh', maxWidth: '32rem', margin: '0 auto',
      }}>

        {/* 返回按钮 — 浮动左下角 */}
        <button
          onClick={onBack}
          className="btn-elegant"
          style={{
            position: 'absolute', bottom: '5.5rem', left: '1.25rem', zIndex: 30,
            padding: '0.5rem 1rem',
            borderRadius: '1.25rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
            border: '2px solid rgba(0,0,0,0.12)',
            cursor: 'pointer', fontSize: '0.85rem',
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            fontWeight: 700, color: '#334155',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(12px)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.18)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'
          }}
        >🏠 主页</button>
        {/* ---- Header ---- */}
        <div style={{
          padding: '0.9rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.78)',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          flexShrink: 0,
        }}>
          <div style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.user})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', boxShadow: `0 2px 10px ${colors.accent}40`,
            flexShrink: 0,
          }}>🗼</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', letterSpacing: '0.02em' }}>
              智慧灯塔
            </h2>
            <p style={{ margin: 0, fontSize: '0.68rem', color: '#94a3b8' }}>汐汐 · 用心倾听每一刻</p>
          </div>
        </div>

        {/* ---- Mode Tabs ---- */}
        <div style={{
          padding: '0.65rem 1rem',
          display: 'flex', gap: '0.4rem',
          overflowX: 'auto',
          background: 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.03)',
          flexShrink: 0,
          scrollbarWidth: 'none',
        }}>
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => handleModeChange(m.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                border: mode === m.id
                  ? `1.5px solid ${colors.user}`
                  : '1.5px solid rgba(0,0,0,0.08)',
                background: mode === m.id
                  ? `${colors.user}15`
                  : 'rgba(255,255,255,0.7)',
                color: mode === m.id ? colors.user : '#64748b',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: mode === m.id ? 600 : 400,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        {/* ---- Messages ---- */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '1rem 1.25rem',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
          background: 'rgba(255,255,255,0.15)',
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'fadeInUp 0.3s ease-out',
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{
                  width: '2rem', height: '2rem', borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.accent}, ${colors.user})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', flexShrink: 0, marginRight: '0.5rem', marginTop: '0.2rem',
                  boxShadow: `0 2px 10px ${colors.accent}50`,
                  border: '2px solid rgba(255,255,255,0.5)',
                }}>🗼</div>
              )}
              <div style={{
                maxWidth: '78%',
                padding: '0.75rem 1.1rem',
                borderRadius: msg.role === 'user'
                  ? '1.25rem 1.25rem 0.3rem 1.25rem'
                  : '1.25rem 1.25rem 1.25rem 0.3rem',
                background: msg.role === 'user'
                  ? `linear-gradient(135deg, ${colors.user}, ${colors.user}dd)`
                  : 'rgba(255,255,255,0.85)',
                color: msg.role === 'user' ? 'white' : colors.aiText,
                fontSize: '0.88rem',
                lineHeight: 1.7,
                boxShadow: msg.role === 'user'
                  ? `0 3px 14px ${colors.user}35`
                  : '0 2px 12px rgba(0,0,0,0.05)',
                border: msg.role === 'assistant' ? '1px solid rgba(0,0,0,0.04)' : 'none',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div style={{
                  width: '2rem', height: '2rem', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.7)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem', flexShrink: 0, marginLeft: '0.5rem', marginTop: '0.2rem',
                  border: '1.5px solid rgba(0,0,0,0.08)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>🐚</div>
              )}
            </div>
          ))}

          {/* Loading */}
          {(loading || greetingLoading) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 0', animation: 'fadeInUp 0.25s ease-out',
            }}>
              <div style={{
                width: '2rem', height: '2rem', borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.user})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.9rem',
                boxShadow: `0 2px 10px ${colors.accent}50`,
                border: '2px solid rgba(255,255,255,0.5)',
              }}>🗼</div>
              <div style={{
                display: 'flex', gap: '0.3rem', padding: '0.7rem 0.9rem',
                background: 'rgba(255,255,255,0.75)', borderRadius: '1.25rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}>
                {[0, 0.12, 0.24].map(delay => (
                  <div key={delay} style={{
                    width: '0.4rem', height: '0.4rem', borderRadius: '50%',
                    background: colors.accent,
                    animation: `pulseGlow 1.2s ease-in-out ${delay}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              textAlign: 'center', padding: '0.75rem 1rem',
              background: 'rgba(251,113,133,0.08)', borderRadius: '1rem',
              color: '#be123c', fontSize: '0.8rem',
              animation: 'fadeInUp 0.3s ease-out',
              border: '1px solid rgba(251,113,133,0.15)',
            }}>
              {error}
              <button
                onClick={() => setError('')}
                style={{
                  marginLeft: '0.6rem', background: 'transparent', border: 'none',
                  color: '#be123c', cursor: 'pointer', fontSize: '0.82rem',
                  textDecoration: 'underline',
                }}>关闭</button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ---- Quick Actions ---- */}
        {!greetingLoading && messages.length <= 1 && (
          <div style={{
            padding: '0 1.25rem 0.65rem',
            display: 'flex', gap: '0.45rem', flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {mode === 'companion' && (
              <>
                <QuickChip text="我今天心情不太好" onClick={handleQuickAction} />
                <QuickChip text="经期前总是很烦躁怎么办" onClick={handleQuickAction} />
                <QuickChip text="跟我说点什么吧" onClick={handleQuickAction} />
              </>
            )}
            {mode === 'recommend' && (
              <>
                <QuickChip text="今天适合做什么？" onClick={handleQuickAction} />
                <QuickChip text="推荐一个适合今天的学习计划" onClick={handleQuickAction} />
                <QuickChip text="想放松一下" onClick={handleQuickAction} />
              </>
            )}
            {mode === 'analysis' && (
              <>
                <QuickChip text="帮我分析最近的日志" onClick={handleQuickAction} />
                <QuickChip text="我最近的情绪有什么规律？" onClick={handleQuickAction} />
                <QuickChip text="给我一些生活建议" onClick={handleQuickAction} />
              </>
            )}
            {mode === 'advice' && (
              <>
                <QuickChip text="今天适合做什么运动？" onClick={handleQuickAction} />
                <QuickChip text="推荐今日食谱" onClick={handleQuickAction} />
                <QuickChip text="经期能运动吗？" onClick={handleQuickAction} />
              </>
            )}
          </div>
        )}

        {/* ---- Bottom Input ---- */}
        <div style={{
          padding: '0.75rem 1.25rem 1.25rem',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,0,0,0.04)',
        }}>
          <div style={{
            display: 'flex', gap: '0.5rem',
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '1.5rem',
            padding: '0.35rem 0.35rem 0.35rem 1.1rem',
            border: '1.5px solid rgba(0,0,0,0.06)',
            boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease',
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="给汐汐发消息…"
              disabled={loading}
              style={{
                flex: 1, border: 'none', outline: 'none',
                fontSize: '0.9rem', background: 'transparent',
                color: '#1e293b',
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: '2.75rem', height: '2.75rem', borderRadius: '50%',
                background: input.trim() && !loading
                  ? `linear-gradient(135deg, ${colors.user}, ${colors.accent})`
                  : 'rgba(0,0,0,0.05)',
                border: 'none',
                color: input.trim() && !loading ? 'white' : '#cbd5e1',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontSize: '1.1rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                boxShadow: input.trim() && !loading ? `0 3px 12px ${colors.user}40` : 'none',
              }}
            >➤</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickChip({ text, onClick }) {
  return (
    <button
      onClick={() => onClick(text)}
      style={{
        padding: '0.4rem 0.9rem',
        borderRadius: '9999px',
        background: 'rgba(255,255,255,0.75)',
        border: '1px solid rgba(0,0,0,0.05)',
        color: '#475569', fontSize: '0.73rem',
        cursor: 'pointer', whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        fontWeight: 500,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.95)'
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.75)'
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.05)'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >{text}</button>
  )
}
