import { useState, useRef } from 'react'
import { useCycle } from '../context/CycleContext'
import SnorkelingBackground from '../components/SnorkelingBackground'

const STORAGE_KEY = 'xidao_bottles'

export default function Snorkeling({ onBack }) {
  const { cycleData } = useCycle()
  const phase = cycleData?.phase?.name || 'follicular'
  const [bottles, setBottles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [showWrite, setShowWrite] = useState(false)
  const [writingText, setWritingText] = useState('')
  const [depth, setDepth] = useState(0)
  const [showBottle, setShowBottle] = useState(null)
  const [showSeal, setShowSeal] = useState(false)
  const [isDiving, setIsDiving] = useState(false)
  const diveTimerRef = useRef(null)
  const surfaceTimerRef = useRef(null)

  const saveBottles = (newBottles) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBottles))
    setBottles(newBottles)
  }

  const handleDiveStart = () => {
    setIsDiving(true)
    if (surfaceTimerRef.current) clearInterval(surfaceTimerRef.current)
    diveTimerRef.current = setInterval(() => setDepth((d) => Math.min(d + 2, 100)), 50)
  }

  const handleDiveEnd = () => {
    setIsDiving(false)
    if (diveTimerRef.current) { clearInterval(diveTimerRef.current); diveTimerRef.current = null }
    surfaceTimerRef.current = setInterval(() => setDepth((d) => { if (d <= 0) { clearInterval(surfaceTimerRef.current); return 0 }; return d - 1 }), 30)
  }

  const handleSeal = () => {
    if (!writingText.trim()) return
    const bottle = { id: Date.now(), text: writingText, date: new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), salts: 0 }
    saveBottles([bottle, ...bottles])
    setWritingText('')
    setShowWrite(false)
    setShowSeal(true)
    setTimeout(() => setShowSeal(false), 2000)
  }

  const handleLeaveSalt = (bottleId) => {
    const updated = bottles.map((b) => b.id === bottleId ? { ...b, salts: (b.salts || 0) + 1 } : b)
    saveBottles(updated)
    setShowBottle(null)
  }

  return (
    <>
      <SnorkelingBackground phase={phase} />

      <div
        style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}
        onMouseDown={handleDiveStart}
        onMouseUp={handleDiveEnd}
        onMouseLeave={handleDiveEnd}
        onTouchStart={handleDiveStart}
        onTouchEnd={handleDiveEnd}
        onClick={() => setShowWrite(true)}
      >
        {/* 返回按钮 */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 20 }}>
          <button onClick={onBack} className="btn-elegant" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '2.75rem', height: '2.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            ←
          </button>
        </div>

        {/* 深度指示 */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 20, color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
          <span>🌊</span>
          <span>深度: {Math.round(depth)}%</span>
        </div>

        {/* 提示 */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)', borderRadius: '9999px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>
            {depth < 30 && '⏸️ 长按下潜 / 点击书写'}
            {depth >= 30 && depth < 60 && '🌊 继续下潜探索...'}
            {depth >= 60 && '🫙 点击瓶子查看 / 点击书写'}
          </div>
        </div>

        {/* 瓶子 */}
        {depth > 60 && bottles.length > 0 && (
          <div style={{ position: 'absolute', bottom: '5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
            {bottles.slice(0, 4).map((bottle) => (
              <div key={bottle.id} onClick={(e) => { e.stopPropagation(); setShowBottle(bottle) }} style={{ position: 'relative', cursor: 'pointer', fontSize: '2.5rem', animation: 'floatShell 3s ease-in-out infinite' }}>
                🫙
                {bottle.salts > 0 && (
                  <div style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', background: '#facc15', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {bottle.salts}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 书写弹窗 */}
        {showWrite && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 30 }} onClick={() => setShowWrite(false)}>
            <div style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '1.5rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🫙</div>
                <h3 style={{ color: 'white', fontWeight: 600 }}>深海日记</h3>
              </div>
              <textarea value={writingText} onChange={(e) => setWritingText(e.target.value)} placeholder="写下此刻的心情..." style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'rgba(71,85,105,0.5)', color: 'white', placeholder: '#94a3b8', resize: 'none', fontSize: '1rem', fontFamily: 'inherit' }} rows={4} autoFocus />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={handleSeal} className="btn-elegant" style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(to right, #06b6d4, #3b82f6)', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>🛟 封存</button>
                <button onClick={() => setShowWrite(false)} className="btn-elegant" style={{ flex: 1, padding: '0.75rem', background: '#475569', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer' }}>取消</button>
              </div>
            </div>
          </div>
        )}

        {/* 瓶子详情 */}
        {showBottle && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 30 }} onClick={() => setShowBottle(null)}>
            <div style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '1.5rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🫙</div>
                <p style={{ color: 'white', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{showBottle.text}</p>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>{showBottle.date}</p>
                {showBottle.salts > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                    {[...Array(Math.min(showBottle.salts, 5))].map((_, i) => <span key={i} style={{ color: '#facc15' }}>🧂</span>)}
                  </div>
                )}
                <button onClick={() => handleLeaveSalt(showBottle.id)} className="btn-elegant" style={{ padding: '0.75rem 1.5rem', background: 'rgba(250,204,21,0.2)', color: '#fde047', borderRadius: '9999px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>留下一颗海盐</span><span>🧂</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 封存成功 */}
        {showSeal && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 50 }}>
            <div style={{ background: 'rgba(30,41,59,0.95)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '3rem', textAlign: 'center' }}>🫙</div>
              <p style={{ color: 'white', textAlign: 'center', marginTop: '0.5rem', fontWeight: 600 }}>已封存到深海</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
