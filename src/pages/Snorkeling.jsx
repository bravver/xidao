import { useState, useRef, useMemo } from 'react'
import { useCycle } from '../context/CycleContext'
import SnorkelingBackground from '../components/SnorkelingBackground'
import bottleImg from '../assets/snorkeling/瓶子.png'
import starBottleImg from '../assets/snorkeling/装星星的瓶子.png'
import starsImg from '../assets/snorkeling/stars.png'
import communityBottles from '../data/communityBottles'

const STORAGE_KEY = 'xidao_bottles'
const COMMUNITY_SALTS_KEY = 'xidao_community_salts'
const COMMUNITY_REPLIES_KEY = 'xidao_community_replies'
const USER_REPLIES_KEY = 'xidao_user_replies'

export default function Snorkeling({ onBack, onOpenLighthouse }) {
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
  const [communitySalts, setCommunitySalts] = useState(() => {
    try { return JSON.parse(localStorage.getItem(COMMUNITY_SALTS_KEY) || '{}') }
    catch { return {} }
  })
  const [communityReplies, setCommunityReplies] = useState(() => {
    try { return JSON.parse(localStorage.getItem(COMMUNITY_REPLIES_KEY) || '{}') }
    catch { return {} }
  })
  const [userReplies, setUserReplies] = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_REPLIES_KEY) || '{}') }
    catch { return {} }
  })
  const [replyText, setReplyText] = useState('')
  const diveTimerRef = useRef(null)
  const surfaceTimerRef = useRef(null)
  const surfaceDelayRef = useRef(null)
  const pressStartTimeRef = useRef(null)
  const LONG_PRESS_THRESHOLD = 280
  const SURFACE_DELAY = 500

  // 合并用户瓶子 + 随机社区瓶子
  const allBottles = useMemo(() => {
    const selectedCommunity = [...communityBottles]
      .sort(() => 0.5 - Math.random())
      .slice(0, 6)
      .map(b => ({
        ...b,
        salts: b.salts + (communitySalts[b.id] || 0),
        isCommunity: true,
        replies: communityReplies[b.id] || [],
      }))
    const userBottles = bottles.map(b => ({ ...b, isCommunity: false, author: '我', replies: userReplies[b.id] || [] }))
    return [...userBottles, ...selectedCommunity].sort(() => 0.5 - Math.random())
  }, [bottles, communitySalts, communityReplies, userReplies, phase])

  const saveBottles = (newBottles) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBottles))
    setBottles(newBottles)
  }

  const handleDiveStart = (e) => {
    e.preventDefault()
    pressStartTimeRef.current = Date.now()
    setIsDiving(true)
    if (surfaceTimerRef.current) { clearInterval(surfaceTimerRef.current); surfaceTimerRef.current = null }
    if (surfaceDelayRef.current) { clearTimeout(surfaceDelayRef.current); surfaceDelayRef.current = null }
    diveTimerRef.current = setInterval(() => setDepth((d) => Math.min(d + 2, 100)), 50)
  }

  const handleDiveEnd = () => {
    const pressDuration = Date.now() - (pressStartTimeRef.current || 0)
    pressStartTimeRef.current = null
    if (diveTimerRef.current) { clearInterval(diveTimerRef.current); diveTimerRef.current = null }
    if (surfaceDelayRef.current) { clearTimeout(surfaceDelayRef.current); surfaceDelayRef.current = null }
    if (pressDuration < LONG_PRESS_THRESHOLD) {
      setShowWrite(true)
    } else {
      setIsDiving(false)
      surfaceDelayRef.current = setTimeout(() => {
        surfaceDelayRef.current = null
        surfaceTimerRef.current = setInterval(() => setDepth((d) => {
          if (d <= 0) { clearInterval(surfaceTimerRef.current); surfaceTimerRef.current = null; return 0 }
          return Math.max(0, d - 0.5)
        }), 30)
      }, SURFACE_DELAY)
    }
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
    if (typeof bottleId === 'string' && bottleId.startsWith('community-')) {
      const updated = { ...communitySalts, [bottleId]: (communitySalts[bottleId] || 0) + 1 }
      setCommunitySalts(updated)
      localStorage.setItem(COMMUNITY_SALTS_KEY, JSON.stringify(updated))
    } else {
      const updated = bottles.map((b) => b.id === bottleId ? { ...b, salts: (b.salts || 0) + 1 } : b)
      saveBottles(updated)
    }
    setShowBottle(null)
  }

  const handleReply = (bottleId, text) => {
    if (!text.trim()) return
    const reply = { text: text.trim(), date: new Date().toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }
    if (typeof bottleId === 'string' && bottleId.startsWith('community-')) {
      const updated = { ...communityReplies, [bottleId]: [...(communityReplies[bottleId] || []), reply] }
      setCommunityReplies(updated)
      localStorage.setItem(COMMUNITY_REPLIES_KEY, JSON.stringify(updated))
    } else {
      const updated = { ...userReplies, [bottleId]: [...(userReplies[bottleId] || []), reply] }
      setUserReplies(updated)
      localStorage.setItem(USER_REPLIES_KEY, JSON.stringify(updated))
    }
    setReplyText('')
  }

  return (
    <>
      <SnorkelingBackground phase={phase} depth={depth} />

      <div
        style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}
        onMouseDown={handleDiveStart}
        onMouseUp={handleDiveEnd}
        onMouseLeave={handleDiveEnd}
        onTouchStart={handleDiveStart}
        onTouchEnd={handleDiveEnd}
      >
        {/* 返回按钮 */}
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 20 }}>
          <button onClick={onBack} className="btn-elegant" style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '1rem', padding: '0.45rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', transition: 'all 0.25s ease' }}>
            🏠 主页
          </button>
        </div>

        {/* 深度指示 */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 20, color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '9999px' }}>
          <img src={starsImg} alt="" style={{ width: '1.25rem', height: '1.25rem', objectFit: 'contain' }} />
          <span>深度: {Math.round(depth)}%</span>
        </div>

        {/* 提示 */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', borderRadius: '9999px', padding: '0.6rem 1.25rem', color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', fontWeight: 500 }}>
            {depth < 30 && '⏸️ 长按下潜 / 点击书写'}
            {depth >= 30 && depth < 60 && '🌊 继续下潜探索...'}
            {depth >= 60 && '🔮 点击瓶子查看 / 点击书写留言'}
          </div>
        </div>

        {/* 海底瓶子 */}
        {depth > 60 && allBottles.length > 0 && (
          <div style={{ position: 'absolute', bottom: '5rem', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', padding: '0 1rem' }}>
            {allBottles.slice(0, 8).map((bottle) => (
              <div key={bottle.id} onClick={(e) => { e.stopPropagation(); setShowBottle(bottle) }} onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()} style={{ position: 'relative', cursor: 'pointer', animation: 'floatShell 3s ease-in-out infinite', filter: 'drop-shadow(0 4px 12px rgba(100, 200, 255, 0.3))' }}>
                <img
                  src={bottle.salts > 0 ? starBottleImg : bottleImg}
                  alt="深海瓶子"
                  style={{ width: '3.5rem', height: '5rem', objectFit: 'contain' }}
                />
                <div style={{ position: 'absolute', bottom: '-0.3rem', left: '50%', transform: 'translateX(-50%)', background: bottle.isCommunity ? 'rgba(14,165,233,0.85)' : 'rgba(255,255,255,0.85)', borderRadius: '9999px', padding: '0.1rem 0.4rem', fontSize: '0.55rem', color: bottle.isCommunity ? 'white' : '#1e293b', fontWeight: 600, whiteSpace: 'nowrap', backdropFilter: 'blur(4px)' }}>
                  {bottle.isCommunity ? bottle.author : '我'}
                </div>
                {bottle.salts > 0 && (
                  <div style={{ position: 'absolute', top: '-0.25rem', right: '-0.25rem', background: '#facc15', borderRadius: '50%', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold', color: '#78350f', boxShadow: '0 2px 8px rgba(250,204,21,0.4)' }}>
                    {bottle.salts}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 书写弹窗 */}
        {showWrite && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 30 }}
            onClick={() => setShowWrite(false)}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '1.5rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <img src={bottleImg} alt="" style={{ width: '4rem', height: '5.5rem', objectFit: 'contain', marginBottom: '0.5rem', filter: 'drop-shadow(0 4px 16px rgba(100,200,255,0.4))' }} />
                <h3 style={{ color: 'white', fontWeight: 600 }}>深海日记</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.25rem' }}>写下一段心声，封入瓶中沉入深海</p>
              </div>
              <textarea value={writingText} onChange={(e) => setWritingText(e.target.value)} placeholder="此刻，在深海中..." style={{ width: '100%', padding: '1rem', borderRadius: '1rem', background: 'rgba(71,85,105,0.5)', color: 'white', resize: 'none', fontSize: '1rem', fontFamily: 'inherit', border: '1px solid rgba(148,163,184,0.3)', outline: 'none', lineHeight: 1.6 }} rows={4} autoFocus />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button onClick={handleSeal} className="btn-elegant" style={{ flex: 1, padding: '0.75rem', background: 'linear-gradient(to right, #06b6d4, #3b82f6)', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>🛟 封存瓶子</button>
                <button onClick={() => setShowWrite(false)} className="btn-elegant" style={{ flex: 1, padding: '0.75rem', background: '#475569', color: 'white', borderRadius: '0.75rem', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>取消</button>
              </div>
            </div>
          </div>
        )}

        {/* 瓶子详情 */}
        {showBottle && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 30 }}
            onClick={() => { setShowBottle(null); setReplyText('') }}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div style={{ background: 'linear-gradient(to bottom, #1e293b, #0f172a)', borderRadius: '1.5rem', padding: '1.5rem', maxWidth: '28rem', width: '100%', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }} onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={showBottle.salts > 0 ? starBottleImg : bottleImg}
                  alt=""
                  style={{ width: '4rem', height: '5.5rem', objectFit: 'contain', marginBottom: '0.75rem', filter: 'drop-shadow(0 4px 16px rgba(100,200,255,0.3))' }}
                />
                <p style={{ color: 'white', fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '0.25rem' }}>{showBottle.text}</p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{showBottle.date}</span>
                  {showBottle.author && (
                    <span style={{ background: showBottle.isCommunity ? 'rgba(14,165,233,0.25)' : 'rgba(255,255,255,0.15)', borderRadius: '9999px', padding: '0.15rem 0.5rem', color: showBottle.isCommunity ? '#7dd3fc' : 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 600 }}>
                      {showBottle.isCommunity ? `— ${showBottle.author}` : '— 我'}
                    </span>
                  )}
                </div>
                {showBottle.salts > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem', marginBottom: '1rem' }}>
                    {[...Array(Math.min(showBottle.salts, 5))].map((_, i) => <span key={i} style={{ color: '#facc15', fontSize: '1.25rem' }}>🧂</span>)}
                  </div>
                )}
                <button onClick={() => handleLeaveSalt(showBottle.id)} className="btn-elegant" style={{ padding: '0.75rem 1.5rem', background: 'rgba(250,204,21,0.2)', color: '#fde047', borderRadius: '9999px', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>留下一颗海盐</span><span>🧂</span>
                </button>
              </div>

              {/* 回复区 — 所有瓶子均可留言 */}
              <div style={{ marginTop: '1.25rem', borderTop: '1px solid rgba(148,163,184,0.2)', paddingTop: '1rem' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem', fontWeight: 600 }}>留言 ({showBottle.replies?.length || 0})</p>
                {showBottle.replies && showBottle.replies.length > 0 && (
                  <div style={{ marginBottom: '0.75rem', maxHeight: '8rem', overflowY: 'auto' }}>
                    {showBottle.replies.map((r, i) => (
                      <div key={i} style={{ background: 'rgba(71,85,105,0.3)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem', marginBottom: '0.35rem' }}>
                        <p style={{ color: 'white', fontSize: '0.8rem', lineHeight: 1.4 }}>{r.text}</p>
                        <span style={{ color: '#64748b', fontSize: '0.65rem' }}>{r.date}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleReply(showBottle.id, replyText) }}
                    placeholder="留下你的回声..."
                    style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(71,85,105,0.5)', color: 'white', border: '1px solid rgba(148,163,184,0.3)', outline: 'none', fontSize: '0.8rem', fontFamily: 'inherit' }}
                  />
                  <button onClick={() => handleReply(showBottle.id, replyText)} className="btn-elegant" style={{ padding: '0.5rem 0.75rem', background: 'linear-gradient(to right, #06b6d4, #3b82f6)', color: 'white', borderRadius: '0.5rem', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    回复
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 封存成功 */}
        {showSeal && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 50 }}>
            <div style={{ background: 'rgba(30,41,59,0.95)', backdropFilter: 'blur(12px)', borderRadius: '1.5rem', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', textAlign: 'center' }}>
              <img src={bottleImg} alt="" style={{ width: '4rem', height: '5.5rem', objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(100,200,255,0.5))' }} />
              <p style={{ color: 'white', marginTop: '0.75rem', fontWeight: 600, fontSize: '1.1rem' }}>已封存到深海</p>
              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.25rem' }}>瓶子缓缓沉入海底...</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
