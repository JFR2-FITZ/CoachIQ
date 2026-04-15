import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

export default function CoachIQ() {
  const [launched, setLaunched] = useState(false)
  const [cfg, setCfg] = useState({ coach: 'Coach Regisford', team: 'Tolland Youth Football', primary: '#D0021B', secondary: '#002868' })
  const [page, setPage] = useState('home')
  const [sport, setSport] = useState('Football')
  const [iq, setIQ] = useState(847)
  const [schemes, setSchemes] = useState(0)
  const [gauntlets, setGauntlets] = useState(0)
  // Persistent playbook - survives tab switching
  const [playbook, setPlaybook] = useState({ Football: [], Basketball: [], Baseball: [] })
  const [schemeResult, setSchemeResult] = useState(null)
  const [schemeFields, setSchemeFields] = useState(null)
  const [schemeSport, setSchemeSport] = useState(null)
  const [genHistory, setGenHistory] = useState({ Football: [], Basketball: [], Baseball: [] })

  // Sport color personalities - each sport has its own identity
  const SPORT_COLORS = {
    Football: { primary: '#C0392B', secondary: '#1a3a1a', accent: '#e8f5e9', field: '#2d5a27', label: 'Football' },
    Basketball: { primary: '#D4600A', secondary: '#1a1208', accent: '#fff3e0', field: '#c8843c', label: 'Basketball' },
    Baseball: { primary: '#1B5E20', secondary: '#1a1208', accent: '#f1f8e9', field: '#8B6914', label: 'Baseball' },
  }
  const sportColors = SPORT_COLORS[sport] || SPORT_COLORS.Football
  const P = sportColors.primary
  const S = sportColors.secondary

  function al(hex, a) {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    return `rgba(${r},${g},${b},${a})`
  }
  function dk(hex, amt) {
    const r = parseInt(hex.slice(1,3),16)
    const g = parseInt(hex.slice(3,5),16)
    const b = parseInt(hex.slice(5,7),16)
    return '#' + [r,g,b].map(x => Math.max(0,x-amt).toString(16).padStart(2,'0')).join('')
  }

  async function callAI(prompt, imageData) {
    const messages = imageData
      ? [{ role: 'user', content: [{ type: 'image', source: { type: 'base64', media_type: imageData.mime, data: imageData.b64 } }, { type: 'text', text: prompt }] }]
      : [{ role: 'user', content: prompt }]
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ messages })
    })
    const d = await res.json()
    if (!res.ok) throw new Error(d.error || 'API error')
    return d.text
  }

  function parseJSON(raw) {
    const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
    const a = s.indexOf('{'), b = s.lastIndexOf('}')
    if (a < 0 || b <= a) throw new Error('No JSON in response')
    return JSON.parse(s.slice(a, b+1))
  }

  const lastName = cfg.coach.replace(/^Coach\s*/i,'').trim().split(' ').pop()

  if (!launched) return (
    <Onboarding onLaunch={(c) => { setCfg(c); if(c.sport) setSport(c.sport); setLaunched(true) }} />
  )

  return (
    <>
      <Head><title>CoachIQ</title></Head>
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#07090d', color:'#f2f4f8', fontFamily:"'DM Sans', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sacramento&family=Barlow+Condensed:wght@400;600;700&family=Big+Shoulders+Display:wght@500;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 0; }
          select option { background: #161922; }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes ticker { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
          @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(-22deg)} 33%{transform:translate(12px,-18px) rotate(-15deg)} 66%{transform:translate(-8px,10px) rotate(-28deg)} }
          @keyframes float2 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-14px,12px)} 75%{transform:translate(10px,-8px)} }
          @keyframes float3 { 0%,100%{transform:translate(0,0) rotate(12deg)} 40%{transform:translate(16px,-10px) rotate(20deg)} 80%{transform:translate(-6px,14px) rotate(6deg)} }
          @keyframes float4 { 0%,100%{transform:translate(0,0) rotate(10deg)} 50%{transform:translate(-10px,-16px) rotate(18deg)} }
          @keyframes float5 { 0%,100%{transform:translate(0,0)} 30%{transform:translate(8px,12px)} 70%{transform:translate(-12px,-6px)} }
          @keyframes float6 { 0%,100%{transform:translate(0,0)} 45%{transform:translate(14px,8px)} }
          @keyframes float7 { 0%,100%{transform:translate(0,0) rotate(-5deg)} 35%{transform:translate(-16px,6px) rotate(-12deg)} 70%{transform:translate(8px,-10px) rotate(0deg)} }
        `}</style>

        {/* TOPBAR */}
        <div style={{ background:'#07090d', borderBottom:`1px solid #0e1220`, padding:'10px 14px', display:'flex', alignItems:'center', gap:8, position:'relative', flexShrink:0 }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${P} 55%, ${cfg.secondary || '#002868'} 55%)` }} />
          {/* Sacramento logo - tight letter-spacing */}
          <div style={{ fontFamily:"'Sacramento',cursive", fontSize:22, letterSpacing:'-0.5px', lineHeight:1, whiteSpace:'nowrap', flexShrink:0 }}>
            <span style={{ color:P }}>C</span><span style={{ color:'#dde1f0' }}>oach</span><span style={{ color:P }}>IQ</span>
          </div>
          <div style={{ display:'flex', gap:3, marginLeft:2 }}>
            {[['FB','Football','🏈'],['BB','Basketball','🏀'],['BSB','Baseball','⚾']].map(([lbl,s,ico]) => (
              <button key={lbl} onClick={() => setSport(s)} style={{ padding:'3px 8px', borderRadius:2, fontSize:11, border:`1px solid ${sport===s?SPORT_COLORS[s].primary:al(SPORT_COLORS[s].primary,0.25)}`, background:sport===s?SPORT_COLORS[s].primary:'transparent', color:sport===s?'white':al(SPORT_COLORS[s].primary,0.7), cursor:'pointer', display:'flex', alignItems:'center', gap:3, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>
                <span style={{ fontSize:10 }}>{ico}</span><span>{lbl}</span>
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4, background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:2, padding:'3px 8px', marginLeft:'auto' }}>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:al(P,0.7), letterSpacing:1, textTransform:'uppercase' }}>IQ</span>
            <span style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:18, color:P, letterSpacing:1, lineHeight:1 }}>{iq}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, maxWidth:640, margin:'0 auto', width:'100%', padding:'14px 14px 90px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display: page==='home' ? 'contents' : 'none' }}><HomePage P={P} S={S} al={al} dk={dk} lastName={lastName} sport={sport} sportColors={SPORT_COLORS} schemes={schemes} iq={iq} gauntlets={gauntlets} callAI={callAI} parseJSON={parseJSON} onScheme={() => setSchemes(s=>s+1)} playbook={playbook} setPlaybook={setPlaybook} schemeResult={schemeResult} setSchemeResult={setSchemeResult} schemeFields={schemeFields} setSchemeFields={setSchemeFields} schemeSport={schemeSport} setSchemeSport={setSchemeSport} genHistory={genHistory} setGenHistory={setGenHistory} /></div>
          <div style={{ display: page==='playbook' ? 'contents' : 'none' }}><PlaybookPage P={P} S={S} al={al} dk={dk} cfg={cfg} setCfg={setCfg} playbook={playbook} sport={sport} callAI={callAI} parseJSON={parseJSON} /></div>
          <div style={{ display: page==='more' ? 'contents' : 'none' }}><MorePage P={P} S={S} al={al} dk={dk} cfg={cfg} setCfg={setCfg} playbook={playbook} sport={sport} callAI={callAI} parseJSON={parseJSON} /></div>
        </div>

        {/* BOTTOM NAV - 3 tabs, sharp corners, active line above icon */}
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:640, background:'#07090d', borderTop:'1px solid #0e1220', display:'flex', zIndex:50 }}>
          {[['home','🏠','HOME'],['playbook','📖','PLAYBOOK'],['more','⋯','MORE']].map(([p,ico,lbl]) => (
            <button key={p} onClick={() => setPage(p)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 4px 6px', cursor:'pointer', gap:2, background:'none', border:'none', position:'relative' }}>
              {page===p && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:32, height:2, background:P }} />}
              <span style={{ fontSize:16, color:page===p?P:'#3d4559' }}>{ico}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:page===p?P:'#3d4559', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>{lbl}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// -- ONBOARDING --
function Onboarding({ onLaunch }) {
  // AUTH FLOW: 'signin' | 'signup' | 'teams' | 'createTeam'
  const [screen, setScreen] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [coachName, setCoachName] = useState('')
  // Team creation state
  const [teamSport, setTeamSport] = useState('Football')
  const [teamName, setTeamName] = useState('')
  const [teamPrimary, setTeamPrimary] = useState('#C0392B')
  const [teamSecondary, setTeamSecondary] = useState('#002868')
  // Simulated saved teams (in real app, fetched from backend)
  const [teams, setTeams] = useState([
    { sport: 'Football', name: 'Tolland Youth Football', primary: '#C0392B', secondary: '#002868', coach: 'Coach Regisford', iq: 847, packages: 3 }
  ])

  const sportMeta = {
    Football: { emoji: '🏈', grad: ['#6b0000','#C0392B'], label: 'Football' },
    Basketball: { emoji: '🏀', grad: ['#7a3000','#D4600A'], label: 'Basketball' },
    Baseball: { emoji: '⚾', grad: ['#0a2a0a','#1B5E20'], label: 'Baseball' },
  }

  const colorOptions = {
    primary: ['#C0392B','#E8460C','#D4600A','#1B5E20','#0066CC','#7B1FA2','#C8A400','#1565C0','#880E4F'],
    secondary: ['#002868','#1a3a6b','#37474f','#1B5E20','#4a0070','#1a1a1a','#5c3a00','#004d40','#6b0010'],
  }

  // ⚡ TEST MODE: tap sign in button skips auth entirely
  // TODO: Remove bypass before launch — force real email/password validation
  function handleSignIn() {
    setScreen('teams')
  }

  function handleCreateTeam() {
    if (!teamName.trim()) return
    const newTeam = { sport: teamSport, name: teamName, primary: teamPrimary, secondary: teamSecondary, coach: coachName || 'Coach', iq: 500, packages: 0 }
    setTeams(prev => [...prev, newTeam])
    setScreen('teams')
    setTeamName('')
  }

  function enterTeam(team) {
    onLaunch({ coach: team.coach || 'Coach Regisford', team: team.name, primary: team.primary, secondary: team.secondary, sport: team.sport })
  }

  const S = {
    bg: '#07090d',
    surface: '#0d1117',
    card: '#0f1219',
    border: '#1e2330',
    text: '#f2f4f8',
    muted: '#6b7a96',
    dim: '#3d4559',
    red: '#C0392B',
  }

  // Shared Sacramento logo component
  const Logo = ({ size=42 }) => (
    <div style={{ fontFamily:"'Sacramento',cursive", fontSize:size, letterSpacing:'-1px', lineHeight:1, whiteSpace:'nowrap' }}>
      <span style={{ color:S.red }}>C</span><span style={{ color:'#dde1f0' }}>oach</span><span style={{ color:S.red }}>IQ</span>
    </div>
  )

  // Shared angular button style
  const BtnRed = { width:'100%', background:S.red, border:'none', borderRadius:4, padding:'13px', fontSize:13, fontWeight:700, color:'white', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'2px', textTransform:'uppercase', clipPath:'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)' }
  const BtnGhost = { width:'100%', background:'transparent', border:`1px solid ${S.border}`, borderRadius:4, padding:'12px', fontSize:12, color:S.text, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }

  // ── SPLASH / SIGN IN ─────────────────────────────────────────────────────
  if (screen === 'signin') return (
    <div style={{ minHeight:'100vh', background:S.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', fontFamily:"'DM Sans',sans-serif", position:'relative', overflow:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sacramento&family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(-22deg)} 33%{transform:translate(12px,-18px) rotate(-15deg)} 66%{transform:translate(-8px,10px) rotate(-28deg)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-14px,12px)} 75%{transform:translate(10px,-8px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0) rotate(12deg)} 40%{transform:translate(16px,-10px) rotate(20deg)} 80%{transform:translate(-6px,14px) rotate(6deg)} }
        @keyframes float4 { 0%,100%{transform:translate(0,0) rotate(10deg)} 50%{transform:translate(-10px,-16px) rotate(18deg)} }
        @keyframes float5 { 0%,100%{transform:translate(0,0)} 30%{transform:translate(8px,12px)} 70%{transform:translate(-12px,-6px)} }
        @keyframes float6 { 0%,100%{transform:translate(0,0)} 45%{transform:translate(14px,8px)} }
        @keyframes float7 { 0%,100%{transform:translate(0,0) rotate(-5deg)} 35%{transform:translate(-16px,6px) rotate(-12deg)} 70%{transform:translate(8px,-10px) rotate(0deg)} }
      `}</style>

      {/* Animated floating sport balls */}
      <div style={{ position:'absolute', left:'-5%', top:'8%', animation:'float1 7s ease-in-out infinite', opacity:0.1, zIndex:0 }}>
        <svg width="88" height="56" viewBox="0 0 88 56"><path d="M4 28 Q22 4 44 4 Q66 4 84 28 Q66 52 44 52 Q22 52 4 28Z" fill="#8B4513"/><path d="M4 28 Q22 6 44 4" stroke="white" strokeWidth="1.5" fill="none"/><path d="M84 28 Q66 6 44 4" stroke="white" strokeWidth="1.5" fill="none"/><path d="M4 28 Q22 50 44 52" stroke="white" strokeWidth="1.5" fill="none"/><path d="M84 28 Q66 50 44 52" stroke="white" strokeWidth="1.5" fill="none"/><line x1="38" y1="19" x2="50" y2="19" stroke="white" strokeWidth="2"/><line x1="38" y1="24" x2="50" y2="24" stroke="white" strokeWidth="2"/><line x1="38" y1="28" x2="50" y2="28" stroke="white" strokeWidth="2"/><line x1="38" y1="33" x2="50" y2="33" stroke="white" strokeWidth="2"/><line x1="44" y1="17" x2="44" y2="39" stroke="white" strokeWidth="1.5"/></svg>
      </div>
      <div style={{ position:'absolute', right:'5%', top:'18%', animation:'float2 9s ease-in-out infinite', opacity:0.1, zIndex:0 }}>
        <svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="35" r="32" fill="#C85A00"/><line x1="3" y1="35" x2="67" y2="35" stroke="#1a0a00" strokeWidth="2"/><line x1="35" y1="3" x2="35" y2="67" stroke="#1a0a00" strokeWidth="2"/><path d="M35 3 Q18 14 12 35 Q18 56 35 67" stroke="#1a0a00" strokeWidth="2" fill="none"/><path d="M35 3 Q52 14 58 35 Q52 56 35 67" stroke="#1a0a00" strokeWidth="2" fill="none"/></svg>
      </div>
      <div style={{ position:'absolute', left:'12%', bottom:'22%', animation:'float3 8s ease-in-out infinite', opacity:0.11, zIndex:0 }}>
        <svg width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="25" fill="#f8f4e8"/><path d="M13 9 Q5 28 13 47" stroke="#C0392B" strokeWidth="1.8" fill="none"/><path d="M43 9 Q51 28 43 47" stroke="#C0392B" strokeWidth="1.8" fill="none"/><line x1="13" y1="13" x2="19" y2="15" stroke="#C0392B" strokeWidth="1.2"/><line x1="10" y1="20" x2="16" y2="22" stroke="#C0392B" strokeWidth="1.2"/><line x1="8" y1="27" x2="14" y2="29" stroke="#C0392B" strokeWidth="1.2"/><line x1="10" y1="34" x2="16" y2="36" stroke="#C0392B" strokeWidth="1.2"/><line x1="13" y1="41" x2="19" y2="43" stroke="#C0392B" strokeWidth="1.2"/><line x1="43" y1="13" x2="37" y2="15" stroke="#C0392B" strokeWidth="1.2"/><line x1="46" y1="20" x2="40" y2="22" stroke="#C0392B" strokeWidth="1.2"/><line x1="48" y1="27" x2="42" y2="29" stroke="#C0392B" strokeWidth="1.2"/><line x1="46" y1="34" x2="40" y2="36" stroke="#C0392B" strokeWidth="1.2"/><line x1="43" y1="41" x2="37" y2="43" stroke="#C0392B" strokeWidth="1.2"/></svg>
      </div>
      <div style={{ position:'absolute', right:'15%', top:'5%', animation:'float4 11s ease-in-out infinite', opacity:0.09, zIndex:0 }}>
        <svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="#f0f0f0"/><polygon points="26,5 31,16 21,16" fill="#222"/><polygon points="9,17 19,15 17,25 8,27" fill="#222"/><polygon points="43,17 33,15 35,25 44,27" fill="#222"/><polygon points="12,40 17,30 25,34 25,44" fill="#222"/><polygon points="40,40 35,30 27,34 27,44" fill="#222"/></svg>
      </div>
      <div style={{ position:'absolute', left:'50%', top:'12%', animation:'float5 6.5s ease-in-out infinite', opacity:0.09, zIndex:0 }}>
        <svg width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="19" fill="#c8d400"/><path d="M3 14 Q21 21 3 30" stroke="white" strokeWidth="2" fill="none"/><path d="M39 14 Q21 21 39 30" stroke="white" strokeWidth="2" fill="none"/></svg>
      </div>
      <div style={{ position:'absolute', right:'8%', bottom:'28%', animation:'float6 10s ease-in-out infinite', opacity:0.09, zIndex:0 }}>
        <svg width="52" height="52" viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="#f0e8d0"/><path d="M3 19 Q26 26 3 35" stroke="#3a6ad4" strokeWidth="2" fill="none"/><path d="M49 19 Q26 26 49 35" stroke="#C0392B" strokeWidth="2" fill="none"/><path d="M10 5 Q26 14 42 5" stroke="#2a8a2a" strokeWidth="2" fill="none"/><line x1="3" y1="26" x2="49" y2="26" stroke="#888" strokeWidth="1.2"/></svg>
      </div>
      <div style={{ position:'absolute', left:'8%', top:'52%', animation:'float7 12s ease-in-out infinite', opacity:0.1, zIndex:0 }}>
        <svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="24" fill="#f0f0e8"/><circle cx="27" cy="27" r="24" fill="none" stroke="#d8d8d0" strokeWidth="1"/><circle cx="19" cy="15" r="1.8" fill="#d0d0c8"/><circle cx="27" cy="13" r="1.8" fill="#d0d0c8"/><circle cx="35" cy="15" r="1.8" fill="#d0d0c8"/><circle cx="15" cy="22" r="1.8" fill="#d0d0c8"/><circle cx="23" cy="20" r="1.8" fill="#d0d0c8"/><circle cx="31" cy="20" r="1.8" fill="#d0d0c8"/><circle cx="39" cy="22" r="1.8" fill="#d0d0c8"/><circle cx="13" cy="29" r="1.8" fill="#d0d0c8"/><circle cx="21" cy="27" r="1.8" fill="#d0d0c8"/><circle cx="29" cy="27" r="1.8" fill="#d0d0c8"/><circle cx="37" cy="27" r="1.8" fill="#d0d0c8"/><circle cx="41" cy="29" r="1.8" fill="#d0d0c8"/><circle cx="15" cy="36" r="1.8" fill="#d0d0c8"/><circle cx="23" cy="34" r="1.8" fill="#d0d0c8"/><circle cx="31" cy="34" r="1.8" fill="#d0d0c8"/><circle cx="39" cy="36" r="1.8" fill="#d0d0c8"/><circle cx="19" cy="41" r="1.8" fill="#d0d0c8"/><circle cx="27" cy="43" r="1.8" fill="#d0d0c8"/><circle cx="35" cy="41" r="1.8" fill="#d0d0c8"/><circle cx="21" cy="20" r="4" fill="rgba(255,255,255,0.25)"/></svg>
      </div>

      {/* Gradient fades top/bottom */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'30%', background:'linear-gradient(180deg,#07090d,transparent)', zIndex:1, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'30%', background:'linear-gradient(0deg,#07090d,transparent)', zIndex:1, pointerEvents:'none' }} />

      {/* Logo + tagline */}
      <div style={{ textAlign:'center', marginBottom:40, position:'relative', zIndex:2 }}>
        <Logo size={66} />
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:'4px', color:'#3a4260', marginTop:6, textTransform:'uppercase' }}>AI Coaching Intelligence</div>
      </div>

      {/* CTA buttons */}
      <div style={{ width:'100%', maxWidth:360, display:'flex', flexDirection:'column', gap:10, position:'relative', zIndex:2 }}>
        <button onClick={handleSignIn} style={BtnRed}>Get Started — Free</button>
        <button onClick={handleSignIn} style={BtnGhost}>Sign In</button>
        <div style={{ textAlign:'center', paddingTop:4 }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:S.red, fontWeight:600, cursor:'pointer', letterSpacing:'0.5px' }}>Preview first →</span>
        </div>
      </div>
    </div>
  )

  // ── SIGN UP ──────────────────────────────────────────────
  if (screen === 'signup') return (
    <div style={{ minHeight:'100vh', background:S.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 20px', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sacramento&family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing:border-box; margin:0; padding:0; }`}</style>
      <div style={{ textAlign:'center', marginBottom:28 }}>
        <Logo size={42} />
      </div>
      <div style={{ width:'100%', maxWidth:380, background:S.surface, border:`1px solid ${S.border}`, borderRadius:4, overflow:'hidden' }}>
        <div style={{ height:3, background:`linear-gradient(90deg,${S.red},transparent)` }} />
        <div style={{ padding:'28px 28px 24px' }}>
          <div style={{ fontSize:20, fontWeight:600, color:S.text, marginBottom:6 }}>Create your account</div>
          <div style={{ fontSize:13, color:S.muted, marginBottom:24 }}>Free to start. No credit card required.</div>
          {[['Your name','text',coachName,setCoachName,'Coach Regisford'],['Email','email',email,setEmail,'coach@yourteam.com'],['Password','password',password,setPassword,'Min 8 characters']].map(([lbl,type,val,set,ph]) => (
            <div key={lbl} style={{ marginBottom:14 }}>
              <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:S.muted, marginBottom:6 }}>{lbl}</div>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} style={{ width:'100%', background:S.card, border:`1px solid ${S.border}`, borderRadius:4, padding:'11px 14px', fontSize:13, color:S.text, outline:'none', fontFamily:'inherit' }} />
            </div>
          ))}
          <div style={{ marginBottom:22 }} />
          <button onClick={() => { setScreen('createTeam') }} style={{ ...BtnRed, borderRadius:4 }}>Create Account</button>
        </div>
        <div style={{ borderTop:`1px solid ${S.border}`, padding:'14px 28px', textAlign:'center', fontSize:12, color:S.muted }}>
          Already have an account?{' '}
          <span onClick={() => setScreen('signin')} style={{ color:S.red, cursor:'pointer', fontWeight:500 }}>Sign in</span>
        </div>
      </div>
    </div>
  )

  // ── CREATE TEAM ──────────────────────────────────────────
  if (screen === 'createTeam') return (
    <div style={{ minHeight:'100vh', background:S.bg, fontFamily:"'DM Sans',sans-serif", padding:'24px 20px 40px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sacramento&family=Barlow+Condensed:wght@600;700&family=Big+Shoulders+Display:wght@900&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing:border-box; margin:0; padding:0; }`}</style>
      <div style={{ maxWidth:440, margin:'0 auto' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28, paddingTop:16 }}>
          <button onClick={() => setScreen('teams')} style={{ background:'transparent', border:`1px solid ${S.border}`, borderRadius:4, padding:'5px 12px', color:S.muted, fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
          <Logo size={22} />
        </div>

        <div style={{ fontSize:10, letterSpacing:'2px', textTransform:'uppercase', color:S.muted, marginBottom:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Sport</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:22 }}>
          {Object.entries(sportMeta).map(([s,m]) => (
            <div key={s} onClick={() => setTeamSport(s)} style={{ borderRadius:4, overflow:'hidden', cursor:'pointer', border:`2px solid ${teamSport===s?m.grad[1]:'transparent'}` }}>
              <div style={{ background:`linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, padding:'14px 8px', textAlign:'center' }}>
                <div style={{ fontSize:28, lineHeight:1.2 }}>{m.emoji}</div>
                <div style={{ fontSize:10, fontWeight:700, color:'white', marginTop:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'1px' }}>{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize:10, letterSpacing:'2px', textTransform:'uppercase', color:S.muted, marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Team name</div>
        <input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder={`e.g. Tolland Youth ${teamSport}`} style={{ width:'100%', background:S.card, border:`1px solid ${teamPrimary}`, borderRadius:4, padding:'11px 14px', fontSize:13, color:S.text, outline:'none', fontFamily:'inherit', marginBottom:22 }} />

        <div style={{ fontSize:10, letterSpacing:'2px', textTransform:'uppercase', color:S.muted, marginBottom:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Primary color <span style={{ color:S.red }}>*</span></div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
          {colorOptions.primary.map(c => (
            <div key={c} onClick={() => setTeamPrimary(c)} style={{ width:32, height:32, borderRadius:4, background:c, border:`3px solid ${teamPrimary===c?'white':'transparent'}`, cursor:'pointer' }} />
          ))}
        </div>

        <div style={{ fontSize:10, letterSpacing:'2px', textTransform:'uppercase', color:S.muted, marginBottom:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Secondary color <span style={{ color:S.dim }}>optional</span></div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
          {colorOptions.secondary.map(c => (
            <div key={c} onClick={() => setTeamSecondary(c)} style={{ width:32, height:32, borderRadius:4, background:c, border:`3px solid ${teamSecondary===c?'white':'transparent'}`, cursor:'pointer' }} />
          ))}
        </div>

        {/* Live preview */}
        <div style={{ marginBottom:20, borderRadius:4, overflow:'hidden' }}>
          <div style={{ height:6, background:`linear-gradient(90deg,${teamPrimary} 55%,${teamSecondary} 55%)` }} />
          <div style={{ background:`linear-gradient(135deg,${teamPrimary}33,#07090d)`, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontFamily:"'Sacramento',cursive", fontSize:18, letterSpacing:'-0.5px', color:'white' }}>
              <span style={{ color:teamPrimary }}>C</span><span>oach</span><span style={{ color:teamPrimary }}>IQ</span>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
              {[['3','PKG'],['0','IQ']].map(([v,l]) => (
                <div key={l} style={{ background:'rgba(0,0,0,0.3)', padding:'4px 8px', clipPath:'polygon(3px 0,100% 0,calc(100% - 3px) 100%,0 100%)' }}>
                  <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:14, color:'white', lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:7, color:'rgba(255,255,255,0.4)', textTransform:'uppercase' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={handleCreateTeam} disabled={!teamName.trim()} style={{ width:'100%', background:teamName.trim()?teamPrimary:'#1e2330', border:'none', borderRadius:4, padding:'14px', fontSize:14, color:'white', cursor:teamName.trim()?'pointer':'not-allowed', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'2px', clipPath:'polygon(8px 0,100% 0,calc(100% - 8px) 100%,0 100%)' }}>
          Create Team
        </button>
      </div>
    </div>
  )

  // ── LOCKER ROOM ───────────────────────────────────────────
  return (
    <div style={{ minHeight:'100vh', background:S.bg, fontFamily:"'DM Sans',sans-serif", padding:'0 0 40px' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sacramento&family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing:border-box; margin:0; padding:0; }`}</style>
      <div style={{ padding:'20px 20px 16px', borderBottom:`1px solid ${S.border}`, display:'flex', alignItems:'center', gap:10 }}>
        <Logo size={28} />
        <div style={{ fontSize:12, color:S.muted, marginLeft:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'1px' }}>Your locker room</div>
      </div>

      <div style={{ padding:'20px 20px 0', maxWidth:440, margin:'0 auto' }}>
        <div style={{ fontSize:9, color:S.dim, letterSpacing:'2px', textTransform:'uppercase', marginBottom:12, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Your teams</div>

        {teams.map((team, i) => {
          const m = sportMeta[team.sport] || sportMeta.Football
          return (
            <div key={i} onClick={() => enterTeam(team)} style={{ borderRadius:4, overflow:'hidden', marginBottom:10, cursor:'pointer', border:`1px solid rgba(255,255,255,0.07)` }}>
              <div style={{ background:`linear-gradient(135deg,${m.grad[0]} 0%,${team.primary} 100%)`, padding:'16px 18px', display:'flex', alignItems:'center', gap:14, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', bottom:-4, right:-4, height:6, background:`linear-gradient(90deg,${team.primary} 55%,${team.secondary||'#002868'} 55%)`, left:0 }} />
                <div style={{ fontSize:32, lineHeight:1, flexShrink:0 }}>{m.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Sacramento',cursive", fontSize:18, color:'white', letterSpacing:'-0.5px' }}>{team.name}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2 }}>IQ {team.iq} · {team.packages} package{team.packages!==1?'s':''} · {team.coach}</div>
                </div>
                <div style={{ fontSize:20, color:'rgba(255,255,255,0.5)' }}>›</div>
              </div>
            </div>
          )
        })}

        {['Football','Basketball','Baseball'].filter(s => !teams.find(t=>t.sport===s)).map(s => {
          const m = sportMeta[s]
          return (
            <div key={s} onClick={() => { setTeamSport(s); setScreen('createTeam') }} style={{ borderRadius:4, overflow:'hidden', marginBottom:10, cursor:'pointer', opacity:0.5 }}>
              <div style={{ background:`linear-gradient(135deg,${m.grad[0]},${m.grad[1]})`, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ fontSize:26, lineHeight:1, flexShrink:0, opacity:0.6 }}>{m.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:'rgba(255,255,255,0.7)', fontFamily:"'Barlow Condensed',sans-serif" }}>Add {m.label} team</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Tap to set up</div>
                </div>
                <div style={{ fontSize:20, color:'rgba(255,255,255,0.3)' }}>+</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


function Card({ children, style={} }) {
  return <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, overflow:'hidden', animation:'fadeIn 0.3s ease', ...style }}>{children}</div>
}
function CardHead({ icon, title, tag, tagColor, accent, tagVariant }) {
  const tc = tagColor || '#C0392B'
  return (
    <div style={{ padding:'11px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${accent||'#C0392B'}` }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', color:'#f2f4f8', flex:1, textTransform:'uppercase' }}>{title}</span>
      {tag && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'1px', padding:'2px 7px', borderRadius:2, background:`rgba(${parseInt(tc.slice(1,3),16)},${parseInt(tc.slice(3,5),16)},${parseInt(tc.slice(5,7),16)},0.15)`, color:tc, textTransform:'uppercase' }}>{tag}</span>}
    </div>
  )
}
function PBtn({ onClick, disabled, children, color='#C0392B', style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width:'100%', background:disabled?'#3d4559':color, color:'white', border:'none', borderRadius:4, padding:12, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'2px', cursor:disabled?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:disabled?0.6:1, textTransform:'uppercase', ...style }}>
      {children}
    </button>
  )
}
function Sel({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}
function Shimmer() {
  return <div style={{ width:'100%', height:3, background:'linear-gradient(90deg,#C0392B,#002868,#C0392B)', backgroundSize:'200% 100%', borderRadius:0, margin:'10px 0', animation:'shimmer 1.2s linear infinite' }} />
}
function ErrBox({ msg }) {
  return <div style={{ marginTop:10, background:'#161922', border:'1px solid rgba(192,57,43,0.3)', borderRadius:4, padding:10, fontSize:11, color:'#6b7a96', wordBreak:'break-all' }}>Error: {msg}</div>
}
function Hero({ greet, left, right, P, S, dk, children }) {
  return (
    <div style={{ borderRadius:4, padding:'16px 15px', position:'relative', overflow:'hidden', border:'1px solid #1e2330', background:`linear-gradient(135deg,${dk(S,40)} 0%,#07090d 65%)` }}>
      <div style={{ position:'absolute', top:0, right:0, width:4, height:'100%', background:P }} />
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#6b7a96', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>{greet}</div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:26, letterSpacing:'1px', lineHeight:1, marginBottom:children?11:0, textTransform:'uppercase' }}>{left} <span style={{ color:P }}>{right}</span></div>
        {children}
      </div>
    </div>
  )
}

// -- SPORT CONFIG --
const SPORTS = {
  Football: {
    emoji:'FB',
    fields:[
      {id:'system',label:'Offensive System',opts:['Wing-T','Spread','I-Formation','Single Wing','Pistol','Power I','Double Wing','Flexbone','Run and Shoot']},
      {id:'personnel',label:'Your Best Personnel',opts:['Athletic QB / Dual Threat','Big Physical RB','Fast Skill Players','Strong Offensive Line','Well-Balanced','Small But Fast Team','Big But Slower Team']},
      {id:'age',label:'Age Group',opts:['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School JV','High School Varsity']},
      {id:'skill',label:'Team Skill Level',opts:['First Year / Beginner','2nd-3rd Year Average','Experienced / Athletic','Elite / Competitive']},
      {id:'focus',label:'Offensive Philosophy',opts:['Balanced Attack','Ground and Pound','Air It Out','Misdirection Heavy','Option / Read Heavy','Two Minute Drill']},
      {id:'defense',label:'Opponent Defense',opts:['Unknown / Surprise Me','4-3','3-4','5-2','6-2 Youth','4-2-5','46 Bear','Multiple / Varies']},
    ],
    positions:['Quarterback','Running Back','Wide Receiver','Offensive Line','Linebacker','Cornerback','Safety'],
    buildPrompt:(f)=>`You are an elite youth football coordinator. Generate a scheme package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. ${f.defense==='Unknown / Surprise Me'||f.defense==='Multiple / Varies'?'Generate the best all-around scheme for this teams personnel.':'Tailor to attack the '+f.defense+' defense.'} Return 6 plays mixing runs and passes. Use types like: RUN BASE, RUN PERIMETER, RUN MISDIRECTION, PASS PLAY ACTION, PASS QUICK GAME, RUN SHORT YARDAGE. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"play name","type":"TYPE","note":"when to use"},{"number":2,"name":"play name","type":"TYPE","note":"when to use"},{"number":3,"name":"play name","type":"TYPE","note":"when to use"},{"number":4,"name":"play name","type":"TYPE","note":"when to use"},{"number":5,"name":"play name","type":"TYPE","note":"when to use"},{"number":6,"name":"play name","type":"TYPE","note":"when to use"}],"defenseTip":"tip","coachingCue":"phrase"}`,
    scenarioPrompt:(diff)=>`You are a football coaching AI. Create a football coaching scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. 3RD AND 7 OWN 35 DOWN 4","phase":"OFFENSE or DEFENSE","question":"2-3 sentence scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct, randomize which letter, make wrong answers plausible.`,
  },
  Basketball: {
    emoji:'BB',
    fields:[
      {id:'system',label:'Offensive System',opts:['Motion Offense','Flex Offense','Horns','Pick and Roll','4-Out 1-In','Dribble Drive']},
      {id:'roster',label:'Roster Size',opts:['6-8 players','9-10 players','10-12 players']},
      {id:'age',label:'Age Group',opts:['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School']},
      {id:'skill',label:'Skill Level',opts:['Beginner','Average','Athletic']},
      {id:'focus',label:'Offensive Focus',opts:['Half Court','Press Break','Fast Break','End of Game','Zone Attack']},
      {id:'defense',label:'Opponent Defense',opts:['Unknown / Surprise Me','Man-to-Man','2-3 Zone','1-3-1 Zone','Full Court Press','Box-and-One','Multiple / Varies']},
    ],
    positions:['Point Guard','Shooting Guard','Small Forward','Power Forward','Center','Entire Team'],
    buildPrompt:(f)=>`You are an elite youth basketball coordinator. Generate a scheme package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Return 6 plays or sets. Use types like: SET PLAY HALF COURT, INBOUND BASELINE, PRESS BREAK, FAST BREAK, ZONE ATTACK, END OF GAME. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"play name","type":"TYPE","note":"when to use"},{"number":2,"name":"play name","type":"TYPE","note":"when to use"},{"number":3,"name":"play name","type":"TYPE","note":"when to use"},{"number":4,"name":"play name","type":"TYPE","note":"when to use"},{"number":5,"name":"play name","type":"TYPE","note":"when to use"},{"number":6,"name":"play name","type":"TYPE","note":"when to use"}],"defenseTip":"tip","coachingCue":"phrase"}`,
    scenarioPrompt:(diff)=>`You are a basketball coaching AI. Create a basketball coaching scenario using basketball terminology only. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. Q4 DOWN 2 BALL ON OWN 30 8 SECONDS LEFT","phase":"OFFENSE or DEFENSE or TIMEOUT or INBOUND","question":"2-3 sentence basketball scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation using basketball terms"} Rules: exactly 1 correct, randomize which letter, make wrong answers plausible.`,
  },
  Baseball: {
    emoji:'BSB',
    fields:[
      {id:'system',label:'Offensive Approach',opts:['Small Ball','Power Hitting','Speed and Baserunning','Balanced','Bunting Focus']},
      {id:'roster',label:'Roster Size',opts:['9-11 players','12-14 players','15+ players']},
      {id:'age',label:'Age Group',opts:['7-8 yrs Coach Pitch','9-10 yrs','11-12 yrs','13-14 yrs','High School']},
      {id:'skill',label:'Skill Level',opts:['Beginner','Average','Competitive']},
      {id:'focus',label:'Defensive Focus',opts:['Fundamentals First','Outfield Positioning','Infield Shifts','Pitching Strategy','Rundowns']},
      {id:'defense',label:'Batting Order',opts:['Traditional Best at 3-4','Speedy Leadoff Heavy','Power Through Lineup','Youth Everyone Hits']},
    ],
    positions:['Pitcher','Catcher','First Baseman','Shortstop','Outfielder','Batter','Entire Team'],
    buildPrompt:(f)=>`You are an elite youth baseball coordinator. Generate a game plan package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Return 6 situational strategies. Use types like: OFFENSE SITUATIONAL, DEFENSE ALIGNMENT, BASERUNNING RULE, PITCHING STRATEGY, INFIELD COVERAGE, BATTING APPROACH. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":2,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":3,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":4,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":5,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":6,"name":"strategy name","type":"TYPE","note":"when to use"}],"defenseTip":"tip","coachingCue":"phrase"}`,
    scenarioPrompt:(diff)=>`You are a baseball coaching AI. Create a baseball scenario using baseball manager terminology only. No football references. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. TOP 6TH RUNNER ON 2ND 1 OUT TIED 3-3","phase":"OFFENSE or PITCHING or DEFENSE or BULLPEN","question":"2-3 sentence baseball scenario for a manager","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation using baseball manager terms"} Rules: exactly 1 correct, randomize which letter, make wrong answers plausible.`,
  },
}


// -- PLAY CARD (collapsible, with animator + Q&A + step-by-step) --
function PlayCard({ play, P, S, al, callAI, parseJSON }) {
  const [expanded, setExpanded] = useState(false)
  const [showAnim, setShowAnim] = useState(false)
  const [steps, setSteps] = useState(null)
  const [stepsLoading, setStepsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [qaLoading, setQALoading] = useState(false)
  const [qaHistory, setQAHistory] = useState([])
  const [variations, setVariations] = useState(null)
  const [variationsLoading, setVariationsLoading] = useState(false)
  const [showVariations, setShowVariations] = useState(false)
  const [nflComp, setNflComp] = useState(null)
  const [nflLoading, setNflLoading] = useState(false)
  const [showNfl, setShowNfl] = useState(false)

  const pr = parseInt(P.slice(1,3),16)
  const pg = parseInt(P.slice(3,5),16)
  const pb = parseInt(P.slice(5,7),16)

  async function loadSteps() {
    if (steps) return
    setStepsLoading(true)
    try {
      const isFBPlay = !play.type || (!play.type.includes('COURT') && !play.type.includes('PRESS') && !play.type.includes('BREAK') && !play.type.includes('INBOUND') && !play.type.includes('SET PLAY') && !play.type.includes('FAST BREAK') && !play.type.includes('BATTING') && !play.type.includes('BASERUN') && !play.type.includes('PITCHING') && !play.type.includes('INFIELD') && !play.type.includes('OFFENSE SITUATIONAL') && !play.type.includes('DEFENSE ALIGN'))
      const isBBPlay = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('SET PLAY') || play.type.includes('FAST BREAK'))
      const isBSBPlay = !isFBPlay && !isBBPlay

      const isBBPlay2 = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('SET PLAY') || play.type.includes('FAST BREAK'))
      const isBSBPlay2 = !isBBPlay2 && play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING') || play.type.includes('OFFENSE SITUATIONAL') || play.type.includes('DEFENSE ALIGN'))
      const jsonSchema = '{"ballCarrier":"key player role","blockingScheme":"core concept","steps":["Step 1","Step 2","Step 3","Step 4","Step 5"],"keyCoachingPoints":["point 1","point 2","point 3"],"whyItWorks":"why this works tactically","playerRoles":[{"position":"pos1","job":"their job","whyTheyDoIt":"explain to a 12yr old why"},{"position":"pos2","job":"their job","whyTheyDoIt":"explain why"},{"position":"pos3","job":"their job","whyTheyDoIt":"explain why"}]}'
      const sportLabel = isBBPlay2 ? 'basketball' : isBSBPlay2 ? 'baseball' : 'football'
      const breakdownPrompt = 'You are a youth ' + sportLabel + ' coach educator. Break down this play: ' + play.name + ' (' + play.type + '). ' + play.note + ' Return ONLY valid JSON matching this structure: ' + jsonSchema + ' CRITICAL: For huddleCard, write one short action instruction per key position (use real position abbreviations like QB, RB, WR, OL, TE for football; PG/SG/SF/PF/C for basketball; P/C/1B/SS/OF/BAT for baseball). Each instruction must be one sentence max. For ANY jargon or technical term used (seal, kick out, drop step, curl, gap, zone, etc), add a brief plain-English clarification in termNote. This is what coaches read aloud in the huddle.'
      const raw = await callAI(breakdownPrompt)
      setSteps(parseJSON(raw))
    } catch(e) { setSteps({ error: e.message }) }
    setStepsLoading(false)
  }

  async function loadVariations() {
    if (variations) { setShowVariations(true); return }
    setVariationsLoading(true)
    try {
      const isBB = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('SET PLAY'))
      const isBSB = play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING') || play.type.includes('OFFENSE SITUATIONAL'))
      const sportName = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
      const raw = await callAI(
        'You are a ' + sportName + ' coordinator. The base play is: "' + play.name + '" (' + play.type + '). ' + play.note +
        ' Generate exactly 3 play variations that use the same core concept but change one element each time (different motion, personnel, direction, or timing). ' +
        'Return ONLY valid JSON: {"variations":[' +
        '{"name":"variation name","type":"' + play.type + '","note":"what is different from the base play and when to use it","changeFrom":"what changed"},' +
        '{"name":"variation name","type":"' + play.type + '","note":"what is different and when to use it","changeFrom":"what changed"},' +
        '{"name":"variation name","type":"' + play.type + '","note":"what is different and when to use it","changeFrom":"what changed"}' +
        ']}'
      )
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      const data = JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1))
      setVariations(data.variations || [])
      setShowVariations(true)
    } catch(e) { setVariations([]) }
    setVariationsLoading(false)
  }

  async function loadNflComp() {
    if (nflComp) { setShowNfl(true); return }
    setNflLoading(true)
    try {
      const isBB = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('SET PLAY'))
      const isBSB = play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING') || play.type.includes('OFFENSE SITUATIONAL'))
      const league = isBB ? 'NBA' : isBSB ? 'MLB' : 'NFL'
      const sportName = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
      const raw = await callAI(
        'You are an expert ' + sportName + ' analyst with deep knowledge of professional ' + league + ' playbooks. ' +
        'A youth coach is running this play: "' + play.name + '" (' + play.type + '). ' + play.note +
        ' Find the closest real ' + league + ' equivalent and explain the comparison. ' +
        'Return ONLY valid JSON: {' +
        '"proPlay":"exact name of the professional play or concept",' +
        '"proTeam":"team most known for running this or a famous example",' +
        '"famousExample":"a specific famous game moment or usage of this play in the pros, with year if known",' +
        '"whatMatches":"what the youth version gets right that mirrors the pro version",' +
        '"keyDifference":"main tactical difference between youth and pro execution",' +
        '"proTip":"one thing the pro version does that youth coaches can teach toward as players develop",' +
        '"watchFor":"what to search on YouTube to see this play executed at the pro level"' +
        '}'
      )
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      const data = JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1))
      setNflComp(data)
      setShowNfl(true)
    } catch(e) { setNflComp({ error: e.message }); setShowNfl(true) }
    setNflLoading(false)
  }

  async function askQuestion() {
    if (!question.trim()) return
    setQALoading(true)
    const q = question.trim()
    setQuestion('')
    try {
      const sportCtx = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('SET PLAY')) ? 'basketball' : play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING') || play.type.includes('OFFENSE SITUATIONAL')) ? 'baseball' : 'football'
      const history = qaHistory.map(item => 'Q: ' + item.q + '\nA: ' + item.a).join('\n\n')
      const context = history ? 'Previous questions about this play:\n' + history + '\n\n' : ''
      const raw = await callAI(
        'You are a youth ' + sportCtx + ' coach educator having an ongoing conversation about the play "' + play.name + '" (' + play.type + '). ' + play.note + '\n\n' + context + 'New question: "' + q + '"\n\nAnswer clearly in 2-4 sentences. If this is a follow-up question, reference what was discussed before. Use ' + sportCtx + ' terminology. Be direct and practical.'
      )
      setQAHistory(prev => [...prev, { q, a: raw.trim() }])
    } catch(e) {
      setQAHistory(prev => [...prev, { q, a: 'Error: ' + e.message }])
    }
    setQALoading(false)
  }

  return (
    <div style={{ borderBottom:'1px solid #1e2330' }}>
      {/* Play header row - always visible */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 0', cursor:'pointer' }} onClick={() => { const newExp = !expanded; setExpanded(newExp); if (newExp) { loadSteps(); } }}>
        <div style={{ width:22, height:22, minWidth:22, background:P, color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{play.number}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{play.name}</div>
          <div style={{ fontSize:10, color:'#6b7a96', fontFamily:"'DM Mono',monospace", marginTop:1 }}>{play.type}</div>
          <div style={{ fontSize:11, color:'#6b7a96', marginTop:3, lineHeight:1.4 }}>{play.note}</div>
          <div style={{ fontSize:10, color:P, marginTop:4, letterSpacing:0.5 }}>{expanded ? '▲ Tap to collapse' : '▼ Tap to expand breakdown + diagram'}</div>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
          <button
            onClick={e => { e.stopPropagation(); setShowAnim(a => !a); if (!expanded) setExpanded(true) }}
            style={{ padding:'4px 9px', background:showAnim ? P : `rgba(${pr},${pg},${pb},0.12)`, border:`1px solid ${P}`, borderRadius:6, color:showAnim?'white':P, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:0.5, whiteSpace:'nowrap' }}
          >
            {showAnim ? 'HIDE PLAY' : 'SHOW PLAY'}
          </button>
          <span style={{ fontSize:14, color:'#6b7a96', userSelect:'none' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div style={{ paddingBottom:14, animation:'fadeIn 0.2s ease' }}>

          {/* Play animator inline */}
          {showAnim && (
            <div style={{ marginBottom:12 }}>
              <PlayAnimator play={play} P={P} callAI={callAI} parseJSON={parseJSON} autoLoad={showAnim} key={showAnim?'shown':'hidden'} />
            </div>
          )}

          {/* Step by step breakdown */}
          {stepsLoading && (
            <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} />
              <div style={{ fontSize:12, color:'#6b7a96' }}>Generating step-by-step breakdown...</div>
            </div>
          )}

          {/* HUDDLE CARD - always visible once steps load, written for athletes */}
          {steps && steps.huddleCard && steps.huddleCard.length > 0 && (
            <div style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.04))', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, padding:12, marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                <span style={{ fontSize:14 }}>📋</span>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f59e0b', fontWeight:700 }}>Huddle Card — Read This in the Huddle</div>
              </div>
              <div style={{ fontSize:10, color:'#6b7a96', marginBottom:8, lineHeight:1.4 }}>One job per player. Plain language. Any technical term is explained in <span style={{ fontStyle:'italic' }}>italics</span>.</div>
              {steps.huddleCard.map((item, i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
                  <div style={{ minWidth:32, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:5, padding:'2px 4px', textAlign:'center', fontSize:9, fontWeight:800, color:'#f59e0b', flexShrink:0, marginTop:1 }}>{item.player}</div>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{item.instruction}</span>
                    {item.termNote && <span style={{ fontSize:11, color:'#6b7a96', fontStyle:'italic' }}> ({item.termNote})</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
          {steps && !steps.error && (
            <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, border:`1px solid ${al(P,0.2)}` }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:P, fontWeight:700, marginBottom:10 }}>Step-by-Step Breakdown</div>

              {/* Ball carrier */}
              <div style={{ display:'flex', gap:8, marginBottom:8, padding:'8px 10px', background:`rgba(${pr},${pg},${pb},0.1)`, borderRadius:8, border:`1px solid rgba(${pr},${pg},${pb},0.2)` }}>
                <span style={{ fontSize:11, fontWeight:700, color:P, flexShrink:0 }}>Key Player:</span>
                <span style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{steps.ballCarrier}</span>
              </div>

              {/* Blocking scheme */}
              <div style={{ display:'flex', gap:8, marginBottom:10, padding:'8px 10px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)' }}>
                <span style={{ fontSize:11, fontWeight:700, color:'#6b9fff', flexShrink:0 }}>Core Concept:</span>
                <span style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{steps.blockingScheme}</span>
              </div>

              {/* Steps */}
              {(steps.steps||[]).map((step, i) => (
                <div key={i} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:i < steps.steps.length-1 ? '1px solid #1e2330' : 'none' }}>
                  <div style={{ width:18, height:18, minWidth:18, background:'#0f1117', border:`1px solid ${P}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:P, flexShrink:0, marginTop:1 }}>{i+1}</div>
                  <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{step}</div>
                </div>
              ))}

              {/* Key coaching points */}
              {steps.keyCoachingPoints && steps.keyCoachingPoints.length > 0 && (
                <div style={{ marginTop:10, padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, border:'1px solid rgba(74,222,128,0.2)' }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#4ade80', fontWeight:700, marginBottom:6 }}>Key Coaching Points</div>
                  {steps.keyCoachingPoints.map((pt,i) => (
                    <div key={i} style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5, marginBottom:3 }}>• {pt}</div>
                  ))}
                </div>
              )}

              {/* WHY IT WORKS - concept explanation */}
              {steps.whyItWorks && (
                <div style={{ marginTop:10, padding:'10px 12px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)' }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:5 }}>Why This Works</div>
                  <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{steps.whyItWorks}</div>
                </div>
              )}

              {/* PLAYER ROLES - explain to kids */}
              {steps.playerRoles && steps.playerRoles.length > 0 && (
                <div style={{ marginTop:10 }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:8 }}>Player Roles — What to Tell Each Player</div>
                  {steps.playerRoles.map((role, i) => (
                    <div key={i} style={{ marginBottom:8, padding:'10px 12px', background:'rgba(245,158,11,0.06)', borderRadius:8, border:'1px solid rgba(245,158,11,0.15)' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <div style={{ width:26, height:26, minWidth:26, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', color:'#f59e0b', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>{role.position}</div>
                        <div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{role.job}</div>
                      </div>
                      <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.6, paddingLeft:34, fontStyle:'italic' }}>
                        "Tell your player: {role.whyTheyDoIt}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PLAY VARIATIONS */}
          <div style={{ marginBottom:12 }}>
            <button
              onClick={() => { if(showVariations) { setShowVariations(false) } else { loadVariations() } }}
              disabled={variationsLoading}
              style={{ width:'100%', padding:'10px 14px', background:showVariations?al(P,0.15):'#161922', border:`1px solid ${showVariations?P:'#1e2330'}`, borderRadius:10, color:showVariations?P:'#6b7a96', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, cursor:variationsLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}
            >
              <span>{variationsLoading ? 'GENERATING VARIATIONS...' : 'PLAY VARIATIONS & ADJUSTMENTS'}</span>
              <span style={{ fontSize:11 }}>{showVariations ? '▲ HIDE' : '▼ SHOW 3 VARIATIONS'}</span>
            </button>
            {showVariations && variations && (
              <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:10, animation:'fadeIn 0.2s ease' }}>
                <div style={{ fontSize:10, color:'#6b7a96', letterSpacing:1, padding:'4px 2px' }}>Same concept — different look. Each variation keeps the core idea but changes one key element.</div>
                {variations.map((v, i) => (
                  <div key={i} style={{ background:'#0f1117', border:`1px solid ${al(P,0.2)}`, borderRadius:10, overflow:'hidden' }}>
                    <div style={{ padding:'10px 13px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'flex-start', gap:10 }}>
                      <div style={{ width:22, height:22, minWidth:22, background:al(P,0.15), border:`1px solid ${P}`, color:P, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:1 }}>{i+1}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'#f2f4f8', marginBottom:2 }}>{v.name}</div>
                        <div style={{ fontSize:10, color:P, fontFamily:"'DM Mono',monospace", marginBottom:3 }}>CHANGE: {v.changeFrom}</div>
                        <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.4 }}>{v.note}</div>
                      </div>
                    </div>
                    <PlayAnimator play={v} P={P} callAI={callAI} parseJSON={parseJSON} autoLoad={false} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* NFL/NBA/MLB COMPARISON */}
          <div style={{ marginBottom:12 }}>
            <button
              onClick={() => showNfl ? setShowNfl(false) : loadNflComp()}
              disabled={nflLoading}
              style={{ width:'100%', padding:'10px 14px', background:showNfl?'rgba(255,215,0,0.1)':'#161922', border:`1px solid ${showNfl?'rgba(255,215,0,0.5)':'#1e2330'}`, borderRadius:10, color:showNfl?'#f59e0b':'#6b7a96', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, cursor:nflLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}
            >
              <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:16 }}>{play.type&&(play.type.includes('COURT')||play.type.includes('INBOUND')||play.type.includes('SET PLAY'))?'🏀':play.type&&(play.type.includes('BATTING')||play.type.includes('BASERUN')||play.type.includes('PITCHING'))?'⚾':'🏈'}</span>
                {nflLoading ? 'FINDING PRO EQUIVALENT...' : 'PRO COMPARISON'}
              </span>
              <span style={{ fontSize:11 }}>{showNfl ? '▲ HIDE' : '▼ SEE NFL/NBA/MLB VERSION'}</span>
            </button>
            {showNfl && nflComp && !nflComp.error && (
              <div style={{ marginTop:8, background:'linear-gradient(135deg,rgba(255,215,0,0.06),rgba(255,165,0,0.04))', border:'1px solid rgba(255,215,0,0.25)', borderRadius:10, padding:14, animation:'fadeIn 0.2s ease' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:3 }}>Pro Equivalent</div>
                    <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, letterSpacing:1, color:'#f2f4f8' }}>{nflComp.proPlay}</div>
                    <div style={{ fontSize:12, color:'#f59e0b', marginTop:2 }}>{nflComp.proTeam}</div>
                  </div>
                  <div style={{ width:44, height:44, background:'rgba(255,215,0,0.15)', border:'1px solid rgba(255,215,0,0.3)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>⭐</div>
                </div>
                {nflComp.famousExample && (
                  <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.3)', borderRadius:8, marginBottom:10, borderLeft:'3px solid #f59e0b' }}>
                    <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:3 }}>Famous Example</div>
                    <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{nflComp.famousExample}</div>
                  </div>
                )}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                  <div style={{ padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, border:'1px solid rgba(74,222,128,0.15)' }}>
                    <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#4ade80', fontWeight:700, marginBottom:4 }}>What Matches</div>
                    <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{nflComp.whatMatches}</div>
                  </div>
                  <div style={{ padding:'8px 10px', background:'rgba(208,2,27,0.06)', borderRadius:8, border:'1px solid rgba(208,2,27,0.15)' }}>
                    <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#ff6b6b', fontWeight:700, marginBottom:4 }}>Key Difference</div>
                    <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{nflComp.keyDifference}</div>
                  </div>
                </div>
                {nflComp.proTip && (
                  <div style={{ padding:'8px 10px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)', marginBottom:8 }}>
                    <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:4 }}>Pro Tip — Teach Toward This</div>
                    <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{nflComp.proTip}</div>
                  </div>
                )}
                {nflComp.watchFor && (
                  <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.3)', borderRadius:8, display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:16 }}>▶</span>
                    <div>
                      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:2 }}>Search on YouTube</div>
                      <div style={{ fontSize:12, color:'#f59e0b', fontWeight:600 }}>{nflComp.watchFor}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {showNfl && nflComp && nflComp.error && (
              <div style={{ marginTop:8, padding:10, background:'#161922', borderRadius:8, fontSize:11, color:'#6b7a96' }}>Could not load pro comparison. Try again.</div>
            )}
          </div>

          {/* Q&A section */}
          <div style={{ background:'#161922', borderRadius:10, padding:12 }}>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:8 }}>Ask About This Play</div>

            {/* Previous Q&A */}
            {qaHistory.map((item, i) => (
              <div key={i} style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:600, color:P, marginBottom:3 }}>Q: {item.q}</div>
                <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.6, padding:'6px 10px', background:'rgba(255,255,255,0.04)', borderRadius:6 }}>{item.a}</div>
              </div>
            ))}

            {qaLoading && <div style={{ fontSize:11, color:'#6b7a96', marginBottom:8 }}>Getting answer...</div>}

            <div style={{ display:'flex', gap:7 }}>
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && question.trim()) askQuestion() }}
                placeholder={qaHistory.length > 0 ? "Ask a follow-up question..." : "e.g. Who runs the ball? Why does the receiver go that way?"}
                style={{ flex:1, background:'#0f1117', border:'1px solid #1e2330', borderRadius:7, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }}
              />
              <button onClick={askQuestion} disabled={qaLoading || !question.trim()} style={{ padding:'0 12px', background:qaLoading||!question.trim()?'#3d4559':P, color:'white', border:'none', borderRadius:7, fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:1, cursor:qaLoading||!question.trim()?'not-allowed':'pointer', flexShrink:0 }}>ASK</button>
            </div>
            <div style={{ fontSize:10, color:'#6b7a96', marginTop:5 }}>Press Enter to ask. Examples: "Who carries the ball?" "Is this zone or man blocking?"</div>
          </div>
        </div>
      )}
    </div>
  )
}

// -- PLAY ANIMATOR --
function PlayAnimator({ play, P, callAI, parseJSON, autoLoad=false }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [parsed, setParsed] = useState(null)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [sportType, setSportType] = useState('football')
  const cacheKey = 'anim_' + (play.name||'').replace(/[^a-z0-9]/gi,'_').toLowerCase().slice(0,40)
  // Cache key: once generated for a play, same result shows every time

  const pr = parseInt(P.slice(1,3),16)
  const pg = parseInt(P.slice(3,5),16)
  const pb = parseInt(P.slice(5,7),16)

  useEffect(() => { if (autoLoad && !parsed) generateAnim() }, [autoLoad])

  async function generateAnim() {
    // Check cache first - same play always shows same diagram
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        const data = JSON.parse(cached)
        setParsed(data)
        setSportType(data._sportType || 'football')
        return
      }
    } catch(e) {}
    setLoading(true); setError(''); setParsed(null); setPlaying(false)
    const isBasketball = play.type && (
      play.type.includes('COURT') || play.type.includes('PRESS') ||
      play.type.includes('BREAK') || play.type.includes('INBOUND') ||
      play.type.includes('ZONE ATT') || play.type.includes('SET PLAY') ||
      play.type.includes('FAST BREAK') || play.type.includes('HALF COURT')
    )
    const isBaseball = play.type && (
      play.type.includes('BASERUN') || play.type.includes('PITCHING') ||
      play.type.includes('INFIELD') || play.type.includes('BATTING') ||
      play.type.includes('OFFENSE SITUATIONAL') || play.type.includes('DEFENSE ALIGN')
    )
    setSportType(isBasketball ? 'basketball' : isBaseball ? 'baseball' : 'football')

    const fbTemplate = '{"formation":"PLAYNAME","snapPoint":0.18,"duration":3000,"players":[{"id":"LT","label":"T","role":"off","routeType":"block","x":38,"y":38,"path":[[38,38],[35,34]],"routeName":"Block","routeYards":0},{"id":"LG","label":"G","role":"off","routeType":"block","x":42,"y":38,"path":[[42,38],[40,34]],"routeName":"Block","routeYards":0},{"id":"C","label":"C","role":"off","routeType":"block","x":50,"y":38,"path":[[50,38],[50,34]],"routeName":"Block","routeYards":0},{"id":"RG","label":"G","role":"off","routeType":"block","x":58,"y":38,"path":[[58,38],[60,34]],"routeName":"Block","routeYards":0},{"id":"RT","label":"T","role":"off","routeType":"block","x":62,"y":38,"path":[[62,38],[65,34]],"routeName":"Block","routeYards":0},{"id":"QB","label":"QB","role":"off","routeType":"block","x":50,"y":42,"path":[[50,42],[50,44]],"routeName":"Handoff","routeYards":0},{"id":"RB","label":"RB","role":"off","routeType":"route","x":50,"y":46,"path":[[50,46],[52,42],[58,36]],"routeName":"Run","routeYards":7},{"id":"X","label":"X","role":"off","routeType":"route","x":12,"y":38,"path":[[12,38],[12,30]],"routeName":"Go","routeYards":10},{"id":"Z","label":"Z","role":"off","routeType":"route","x":88,"y":38,"path":[[88,38],[88,30]],"routeName":"Go","routeYards":10},{"id":"TE","label":"Y","role":"off","routeType":"block","x":66,"y":38,"path":[[66,38],[66,34]],"routeName":"Block","routeYards":0},{"id":"D1","label":"D","role":"def","routeType":"block","x":42,"y":35,"path":[[42,35],[42,37]],"routeName":"","routeYards":0},{"id":"D2","label":"D","role":"def","routeType":"block","x":50,"y":35,"path":[[50,35],[50,37]],"routeName":"","routeYards":0},{"id":"D3","label":"D","role":"def","routeType":"block","x":58,"y":35,"path":[[58,35],[58,37]],"routeName":"","routeYards":0},{"id":"LB1","label":"LB","role":"def","routeType":"block","x":40,"y":30,"path":[[40,30],[40,32]],"routeName":"","routeYards":0},{"id":"LB2","label":"LB","role":"def","routeType":"block","x":60,"y":30,"path":[[60,30],[60,32]],"routeName":"","routeYards":0},{"id":"CB1","label":"CB","role":"def","routeType":"block","x":12,"y":30,"path":[[12,30],[12,32]],"routeName":"","routeYards":0},{"id":"CB2","label":"CB","role":"def","routeType":"block","x":88,"y":30,"path":[[88,30],[88,32]],"routeName":"","routeYards":0},{"id":"S1","label":"S","role":"def","routeType":"block","x":35,"y":22,"path":[[35,22],[35,24]],"routeName":"","routeYards":0},{"id":"S2","label":"S","role":"def","routeType":"block","x":65,"y":22,"path":[[65,22],[65,24]],"routeName":"","routeYards":0}]}'

    const bbTemplate = '{"formation":"PLAYNAME","snapPoint":0.15,"duration":3500,"players":[{"id":"PG","label":"1","role":"off","routeType":"route","x":50,"y":48,"path":[[50,48],[50,40]],"routeName":"Dribble","routeYards":0},{"id":"SG","label":"2","role":"off","routeType":"route","x":72,"y":44,"path":[[72,44],[78,32]],"routeName":"Cut","routeYards":0},{"id":"SF","label":"3","role":"off","routeType":"route","x":82,"y":38,"path":[[82,38],[85,26]],"routeName":"Wing","routeYards":0},{"id":"PF","label":"4","role":"off","routeType":"block","x":62,"y":22,"path":[[62,22],[62,22]],"routeName":"Screen","routeYards":0},{"id":"C5","label":"5","role":"off","routeType":"block","x":50,"y":17,"path":[[50,17],[50,17]],"routeName":"Post","routeYards":0},{"id":"d1","label":"D","role":"def","routeType":"block","x":50,"y":50,"path":[[50,50],[50,51]],"routeName":"","routeYards":0},{"id":"d2","label":"D","role":"def","routeType":"block","x":72,"y":46,"path":[[72,46],[72,47]],"routeName":"","routeYards":0},{"id":"d3","label":"D","role":"def","routeType":"block","x":82,"y":40,"path":[[82,40],[82,41]],"routeName":"","routeYards":0},{"id":"d4","label":"D","role":"def","routeType":"block","x":62,"y":24,"path":[[62,24],[62,25]],"routeName":"","routeYards":0},{"id":"d5","label":"D","role":"def","routeType":"block","x":50,"y":19,"path":[[50,19],[50,20]],"routeName":"","routeYards":0}]}'

    const bsbTemplate = '{"formation":"PLAYNAME","snapPoint":0.2,"duration":3000,"players":[{"id":"P","label":"P","role":"off","routeType":"block","x":50,"y":30,"path":[[50,30],[50,30]],"routeName":"Pitch","routeYards":0},{"id":"C","label":"C","role":"off","routeType":"block","x":50,"y":42,"path":[[50,42],[50,42]],"routeName":"Receive","routeYards":0},{"id":"1B","label":"1B","role":"off","routeType":"block","x":75,"y":42,"path":[[75,42],[75,42]],"routeName":"Hold","routeYards":0},{"id":"2B","label":"2B","role":"off","routeType":"block","x":65,"y":28,"path":[[65,28],[65,28]],"routeName":"Cover","routeYards":0},{"id":"SS","label":"SS","role":"off","routeType":"block","x":38,"y":30,"path":[[38,30],[38,30]],"routeName":"Cover","routeYards":0},{"id":"3B","label":"3B","role":"off","routeType":"block","x":25,"y":42,"path":[[25,42],[25,42]],"routeName":"Hold","routeYards":0},{"id":"LF","label":"LF","role":"off","routeType":"block","x":20,"y":12,"path":[[20,12],[20,12]],"routeName":"Pos","routeYards":0},{"id":"CF","label":"CF","role":"off","routeType":"block","x":50,"y":8,"path":[[50,8],[50,8]],"routeName":"Pos","routeYards":0},{"id":"RF","label":"RF","role":"off","routeType":"block","x":80,"y":12,"path":[[80,12],[80,12]],"routeName":"Pos","routeYards":0},{"id":"BAT","label":"B","role":"def","routeType":"route","x":50,"y":44,"path":[[50,44],[60,38]],"routeName":"Run","routeYards":0},{"id":"R1","label":"R","role":"def","routeType":"route","x":25,"y":42,"path":[[25,42],[25,42]],"routeName":"","routeYards":0}]}'

    const footballPrompt = 'Generate football play diagram for: ' + play.name + ' (' + play.type + '). ' + play.note + ' CRITICAL RULES: (1) QB: on RUN plays set routeName to "Handoff" and path is a 2-unit fake toward RB then stop. On PASS plays set routeName to "Dropback" and show 3-step drop (path moves upward/away from LOS). On KEEPER plays show QB running outside. (2) Ball carrier (RB/QB): path must show the FULL run lane all the way past the line of scrimmage, minimum 8-10 units past y=38. (3) Pulling guards: if this is a sweep/power play, guards should have paths around the edge (not just forward). (4) Receivers: each has a named route (Curl, Slant, Post, Out, Corner, Go, Cross, Flat) with routeYards. Return ONLY raw JSON using this template: ' + fbTemplate.replace('PLAYNAME', play.name)

    const basketballPrompt = 'Generate basketball play diagram for: ' + play.name + ' (' + play.type + '). ' + play.note + ' CRITICAL: (1) ONE player routeName starts with BALL: - they have the ball, path shows dribble. (2) ONE player routeName starts with SHOOT: - they receive the pass for the shot, path ends near where BALL player path ends. (3) BALL player path must end within 10 units of SHOOT player path end. (4) Others use CUT: or MOVE: or SCREEN. (5) snapPoint 0.12. Return ONLY raw JSON using this template: ' + bbTemplate.replace('PLAYNAME', play.name)

    const baseballPrompt = 'Generate baseball defensive positioning and play diagram for: ' + play.name + ' (' + play.type + '). ' + play.note + ' Show 9 fielders in correct positions on a baseball diamond. Show movement paths for relevant players. Return ONLY raw JSON using this template, customize paths to show this play: ' + bsbTemplate.replace('PLAYNAME', play.name)

    const isDefense = play._isDefense === true
    const isDisguise = play._isDisguise === true
    const defensePrompt = 'Generate a DEFENSIVE football diagram for: ' + play.name + ' (' + play.type + '). ' + play.note +
    ' Show 11 defenders with assignments. Include 4-7 offensive linemen as STATIC reference only (no paths). ' +
    'DEFENDER routeNames must describe zone or assignment: use "Gap A", "Gap B", "Gap C" for DL, "Hook Zone", "Flat Zone", "Deep Half", "Deep Third", "Man Coverage", "Blitz" for others. ' +
    'DL players: label as DE or DT. LB players: label as WLB, MLB, SLB or LB. DBs: label as CB, SS, FS. ' +
    'Return ONLY raw JSON using this template and customize ALL defender positions and paths for this specific defense: ' +
    '{"formation":"' + play.name.replace(/"/g,"") + '","snapPoint":0.15,"duration":3000,"players":[' +
    '{"id":"DEa","label":"DE","role":"def","routeType":"block","x":38,"y":35,"path":[[38,35],[35,38]],"routeName":"Gap B","routeYards":0},' +
    '{"id":"DTa","label":"DT","role":"def","routeType":"block","x":45,"y":35,"path":[[45,35],[45,38]],"routeName":"Gap A","routeYards":0},' +
    '{"id":"DTb","label":"DT","role":"def","routeType":"block","x":55,"y":35,"path":[[55,35],[55,38]],"routeName":"Gap A","routeYards":0},' +
    '{"id":"DEb","label":"DE","role":"def","routeType":"block","x":62,"y":35,"path":[[62,35],[65,38]],"routeName":"Gap B","routeYards":0},' +
    '{"id":"WLB","label":"WLB","role":"def","routeType":"route","x":34,"y":28,"path":[[34,28],[30,34]],"routeName":"Flat Zone","routeYards":0},' +
    '{"id":"MLB","label":"MLB","role":"def","routeType":"route","x":50,"y":27,"path":[[50,27],[50,33]],"routeName":"Hook Zone","routeYards":0},' +
    '{"id":"SLB","label":"SLB","role":"def","routeType":"route","x":66,"y":28,"path":[[66,28],[70,34]],"routeName":"Flat Zone","routeYards":0},' +
    '{"id":"CBa","label":"CB","role":"def","routeType":"route","x":12,"y":35,"path":[[12,35],[12,24]],"routeName":"Man Coverage","routeYards":0},' +
    '{"id":"CBb","label":"CB","role":"def","routeType":"route","x":88,"y":35,"path":[[88,35],[88,24]],"routeName":"Man Coverage","routeYards":0},' +
    '{"id":"SS","label":"SS","role":"def","routeType":"route","x":66,"y":20,"path":[[66,20],[58,26]],"routeName":"Deep Half","routeYards":0},' +
    '{"id":"FS","label":"FS","role":"def","routeType":"route","x":50,"y":14,"path":[[50,14],[50,20]],"routeName":"Deep Middle","routeYards":0},' +
    '{"id":"OTa","label":"T","role":"off","routeType":"block","x":38,"y":38,"path":[[38,38],[38,38]],"routeName":"","routeYards":0},' +
    '{"id":"OGa","label":"G","role":"off","routeType":"block","x":44,"y":38,"path":[[44,38],[44,38]],"routeName":"","routeYards":0},' +
    '{"id":"OC","label":"C","role":"off","routeType":"block","x":50,"y":38,"path":[[50,38],[50,38]],"routeName":"","routeYards":0},' +
    '{"id":"OGb","label":"G","role":"off","routeType":"block","x":56,"y":38,"path":[[56,38],[56,38]],"routeName":"","routeYards":0},' +
    '{"id":"OTb","label":"T","role":"off","routeType":"block","x":62,"y":38,"path":[[62,38],[62,38]],"routeName":"","routeYards":0}' +
    ']}'

    const disguisePrompt = 'Generate a DISGUISE defensive diagram for: ' + play.name + '. ' + play.note +
    ' Show defenders in their PRE-SNAP fake look for the first 40% of the animation, then moving to their TRUE assignment. ' +
    ' routeName format: use FAKE: for pre-snap deception (e.g. FAKE: Walk up LB), TRUE: for real assignment (e.g. TRUE: Deep Half). ' +
    ' snapPoint should be 0.40 so fake is shown clearly before the snap. ' +
    ' Customize all 11 defenders to show the specific disguise described. Return ONLY raw JSON using same template as defense: ' +
    '{"formation":"' + play.name.replace(/"/g,"") + '","snapPoint":0.40,"duration":3500,"players":[' +
    '{"id":"DEa","label":"DE","role":"def","routeType":"route","x":38,"y":35,"path":[[38,35],[42,32],[42,32],[38,38]],"routeName":"FAKE: Walk up","routeYards":0},' +
    '{"id":"DTa","label":"DT","role":"def","routeType":"block","x":45,"y":35,"path":[[45,35],[45,38]],"routeName":"TRUE: Gap A","routeYards":0},' +
    '{"id":"DTb","label":"DT","role":"def","routeType":"block","x":55,"y":35,"path":[[55,35],[55,38]],"routeName":"TRUE: Gap A","routeYards":0},' +
    '{"id":"DEb","label":"DE","role":"def","routeType":"route","x":62,"y":35,"path":[[62,35],[58,32],[58,32],[62,38]],"routeName":"FAKE: Show Blitz","routeYards":0},' +
    '{"id":"WLB","label":"WLB","role":"def","routeType":"route","x":34,"y":28,"path":[[34,28],[34,32],[34,32],[30,34]],"routeName":"FAKE: Press Man","routeYards":0},' +
    '{"id":"MLB","label":"MLB","role":"def","routeType":"route","x":50,"y":27,"path":[[50,27],[50,27],[50,27],[50,33]],"routeName":"TRUE: Hook Zone","routeYards":0},' +
    '{"id":"SLB","label":"SLB","role":"def","routeType":"route","x":66,"y":28,"path":[[66,28],[66,32],[66,32],[70,34]],"routeName":"FAKE: Show Blitz","routeYards":0},' +
    '{"id":"CBa","label":"CB","role":"def","routeType":"route","x":12,"y":35,"path":[[12,35],[12,30],[12,30],[12,24]],"routeName":"FAKE: Press Zone","routeYards":0},' +
    '{"id":"CBb","label":"CB","role":"def","routeType":"route","x":88,"y":35,"path":[[88,35],[88,30],[88,30],[88,24]],"routeName":"FAKE: Press Zone","routeYards":0},' +
    '{"id":"SS","label":"SS","role":"def","routeType":"route","x":66,"y":20,"path":[[66,20],[58,24],[58,24],[58,26]],"routeName":"FAKE: Man then Half","routeYards":0},' +
    '{"id":"FS","label":"FS","role":"def","routeType":"route","x":50,"y":14,"path":[[50,14],[50,14],[50,14],[50,20]],"routeName":"TRUE: Deep Middle","routeYards":0},' +
    '{"id":"OC","label":"C","role":"off","routeType":"block","x":50,"y":38,"path":[[50,38],[50,38]],"routeName":"","routeYards":0},' +
    '{"id":"OTa","label":"T","role":"off","routeType":"block","x":38,"y":38,"path":[[38,38],[38,38]],"routeName":"","routeYards":0},' +
    '{"id":"OTb","label":"T","role":"off","routeType":"block","x":62,"y":38,"path":[[62,38],[62,38]],"routeName":"","routeYards":0}' +
    ']}'

    const prompt = isDefense ? (isDisguise ? disguisePrompt : defensePrompt) : isBasketball ? basketballPrompt : isBaseball ? baseballPrompt : footballPrompt
    try {
      const raw = await callAI(prompt)
      const data = parseJSON(raw)
      if (!data.players || data.players.length === 0) throw new Error('No players returned')
      data._sportType = isBasketball ? 'basketball' : isBaseball ? 'baseball' : 'football'
      try { sessionStorage.setItem(cacheKey, JSON.stringify(data)) } catch(e) {}
      data._sport = isBasketball ? 'basketball' : isBaseball ? 'baseball' : 'football'
      try { sessionStorage.setItem(cacheKey, JSON.stringify(data)) } catch(e) {}
      data._sport = isBasketball ? 'basketball' : isBaseball ? 'baseball' : 'football'
      try { sessionStorage.setItem(cacheKey, JSON.stringify(data)) } catch(e) {}
      setParsed(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  useEffect(() => {
    if (!parsed || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const sx = x => (x / 100) * W
    const sy = y => (y / 60) * H
    const dur = parsed.duration || 3000
    const snap = parsed.snapPoint || 0.18
    let startTime = null

    function lerp(a, b, t) { return a + (b-a)*t }

    function getPos(player, t) {
      const path = player.path
      if (!path || path.length < 2) return { x: sx(player.x), y: sy(player.y) }
      if (t < snap) return { x: sx(path[0][0]), y: sy(path[0][1]) }
      const pt = Math.min((t - snap) / (1 - snap), 1)
      const segs = path.length - 1
      const seg = Math.min(Math.floor(pt * segs), segs - 1)
      const st = pt * segs - seg
      return {
        x: sx(lerp(path[seg][0], path[seg+1][0], st)),
        y: sy(lerp(path[seg][1], path[seg+1][1], st))
      }
    }

    function drawArrow(ctx, ex, ey, nx, ny, size) {
      const angle = Math.atan2(ny, nx)
      const a = 0.45
      ctx.beginPath()
      ctx.moveTo(ex, ey)
      ctx.lineTo(ex - size*Math.cos(angle-a), ey - size*Math.sin(angle-a))
      ctx.lineTo(ex - size*Math.cos(angle+a), ey - size*Math.sin(angle+a))
      ctx.closePath()
      ctx.fill()
    }

    function drawPerp(ctx, ex, ey, nx, ny, size) {
      const px = -ny, py = nx
      ctx.beginPath()
      ctx.moveTo(ex - px*size, ey - py*size)
      ctx.lineTo(ex + px*size, ey + py*size)
      ctx.stroke()
    }

    const isBBall = sportType === 'basketball'
    const isBSB = sportType === 'baseball'

    function drawBasketballCourt() {
      // Wood floor
      ctx.fillStyle = '#c4893e'
      ctx.fillRect(0, 0, W, H)
      // Floor grain
      ctx.strokeStyle = 'rgba(0,0,0,0.05)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < 14; i++) {
        ctx.beginPath(); ctx.moveTo(0, H*i/14); ctx.lineTo(W, H*i/14); ctx.stroke()
      }
      // Court boundary
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'
      ctx.lineWidth = 2
      ctx.strokeRect(sx(4), sy(3), sx(92), sy(94))

      // Key/paint - proportional rectangle
      // Key is 16ft wide, free throw line is 15ft from basket
      // Basket at y=6, key goes from y=6 to y=30 (free throw line)
      ctx.fillStyle = 'rgba(160,50,50,0.2)'
      ctx.fillRect(sx(37), sy(6), sx(26), sy(24))
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      ctx.lineWidth = 1.5
      ctx.strokeRect(sx(37), sy(6), sx(26), sy(24))

      // Free throw line at y=30
      ctx.beginPath(); ctx.moveTo(sx(37), sy(30)); ctx.lineTo(sx(63), sy(30)); ctx.stroke()

      // Free throw circle - centered on free throw line
      ctx.beginPath()
      ctx.arc(sx(50), sy(30), sx(12), 0, Math.PI*2)
      ctx.stroke()

      // Restricted arc near basket
      ctx.strokeStyle = 'rgba(255,255,255,0.5)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(sx(50), sy(6), sx(5), 0, Math.PI)
      ctx.stroke()

      // Basket at top center
      ctx.fillStyle = '#e05020'
      ctx.beginPath(); ctx.arc(sx(50), sy(6), sx(2.5), 0, Math.PI*2); ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.arc(sx(50), sy(6), sx(2.5), 0, Math.PI*2); ctx.stroke()

      // Backboard
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'
      ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.moveTo(sx(41), sy(3.5)); ctx.lineTo(sx(59), sy(3.5)); ctx.stroke()

      // Three point line - arc centered on basket (y=6), radius ~23.75ft
      // In our coords: basket at x=50,y=6. Three point radius = ~31 units
      ctx.strokeStyle = 'rgba(255,255,255,0.65)'
      ctx.lineWidth = 1.5
      // Corner three straight portions
      ctx.beginPath(); ctx.moveTo(sx(7), sy(3)); ctx.lineTo(sx(7), sy(34)); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sx(93), sy(3)); ctx.lineTo(sx(93), sy(34)); ctx.stroke()
      // Arc connecting corners - must pass through y=34 at x=7 and x=93
      // Center at basket x=50,y=6. Radius to hit x=7,y=34: sqrt(43^2+28^2) = 51 units
      ctx.beginPath()
      const r3 = Math.sqrt(Math.pow(sx(50)-sx(7),2) + Math.pow(sy(6)-sy(34),2))
      const startAngle = Math.atan2(sy(34)-sy(6), sx(7)-sx(50))
      const endAngle = Math.atan2(sy(34)-sy(6), sx(93)-sx(50))
      ctx.arc(sx(50), sy(6), r3, startAngle, endAngle, false)
      ctx.stroke()
    }

    function drawBaseballField() {
      // Grass green outfield
      ctx.fillStyle = '#2d7a2d'
      ctx.fillRect(0, 0, W, H)
      // Infield dirt diamond
      ctx.fillStyle = '#c4955a'
      ctx.beginPath()
      ctx.moveTo(sx(50), sy(42)) // home plate
      ctx.lineTo(sx(75), sy(28)) // first base
      ctx.lineTo(sx(50), sy(14)) // second base
      ctx.lineTo(sx(25), sy(28)) // third base
      ctx.closePath()
      ctx.fill()
      // Infield dirt circle
      ctx.fillStyle = '#c4955a'
      ctx.beginPath()
      ctx.arc(sx(50), sy(28), sx(18), 0, Math.PI*2)
      ctx.fill()
      // Foul lines
      ctx.strokeStyle = 'rgba(255,255,255,0.7)'
      ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(sx(50), sy(42)); ctx.lineTo(sx(5), sy(5)); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sx(50), sy(42)); ctx.lineTo(sx(95), sy(5)); ctx.stroke()
      // Outfield arc
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(sx(50), sy(42), sy(40), Math.PI*1.2, Math.PI*1.8, false)
      ctx.stroke()
      // Bases
      const bases = [[50,42,'HP'],[75,28,'1B'],[50,14,'2B'],[25,28,'3B']]
      bases.forEach(([bx,by,lbl]) => {
        ctx.fillStyle = lbl === 'HP' ? '#aaa' : 'white'
        ctx.strokeStyle = 'rgba(0,0,0,0.5)'
        ctx.lineWidth = 1
        const s = sx(2.5)
        ctx.save()
        ctx.translate(sx(bx), sy(by))
        ctx.rotate(Math.PI/4)
        ctx.fillRect(-s/2, -s/2, s, s)
        ctx.strokeRect(-s/2, -s/2, s, s)
        ctx.restore()
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.font = `bold ${Math.round(sx(2))}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText(lbl, sx(bx), sy(by) - sx(3))
      })
      // Pitcher mound
      ctx.fillStyle = '#b8885a'
      ctx.beginPath()
      ctx.arc(sx(50), sy(28), sx(3), 0, Math.PI*2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(sx(50), sy(28), sx(3), 0, Math.PI*2)
      ctx.stroke()
    }

        function drawFootballField() {
      ctx.fillStyle = '#f8f8f4'
      ctx.fillRect(0, 0, W, H)
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'
      ctx.lineWidth = 1
      for (let y = 0; y <= 60; y += 6) {
        ctx.beginPath(); ctx.moveTo(0, sy(y)); ctx.lineTo(W, sy(y)); ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.12)'
      ctx.lineWidth = 0.5
      for (let y = 0; y <= 60; y += 3) {
        ctx.beginPath(); ctx.moveTo(sx(36), sy(y)); ctx.lineTo(sx(40), sy(y)); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(sx(60), sy(y)); ctx.lineTo(sx(64), sy(y)); ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.2)'
      ctx.lineWidth = 2
      ctx.beginPath(); ctx.moveTo(sx(2), 0); ctx.lineTo(sx(2), H); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(sx(98), 0); ctx.lineTo(sx(98), H); ctx.stroke()
      ctx.strokeStyle = 'rgba(0,0,0,0.5)'
      ctx.lineWidth = 1.5
      ctx.setLineDash([8, 5])
      ctx.beginPath(); ctx.moveTo(0, sy(38)); ctx.lineTo(W, sy(38)); ctx.stroke()
      ctx.setLineDash([])
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H)
      if (isBBall) { drawBasketballCourt() } else if (isBSB) { drawBaseballField() } else { drawFootballField() }

      const r = W * 0.016  // player radius

      // Defense-specific: draw coverage zone ovals before routes/players
      const defPlayers = (parsed.players||[]).filter(p => p.role==='def')
      const offPlayers = (parsed.players||[]).filter(p => p.role==='off')
      const isDefDiagram = defPlayers.length >= offPlayers.length

      if (isDefDiagram && !isBBall && !isBSB) {
        defPlayers.forEach(player => {
          if (!player.routeName) return
          const pos = getPos(player, t < snap ? 0 : t)
          const rn = (player.routeName || '').toLowerCase()
          const isDeep = rn.includes('deep') || rn.includes('half') || rn.includes('cover 2') || rn.includes('cover 3') || rn.includes('quarter') || player.label === 'FS' || player.label === 'SS'
          const isMid = rn.includes('hook') || rn.includes('curl') || rn.includes('mid') || rn.includes('middle') || player.label === 'MLB' || player.label === 'ILB'
          const isFlat = rn.includes('flat') || rn.includes('out') || rn.includes('corner') || player.label === 'WLB' || player.label === 'OLB' || player.label === 'SLB'
          const isManCov = rn.includes('man') || rn.includes('press') || rn.includes('shadow')
          const isBlitz = rn.includes('blitz') || rn.includes('rush') || rn.includes('stunt')

          if (isDeep || isMid || isFlat) {
            const zoneW = isDeep ? sx(26) : isFlat ? sx(15) : sx(18)
            const zoneH = isDeep ? sy(9) : isFlat ? sy(7) : sy(8)
            const zoneColor = isDeep ? 'rgba(30,80,220,0.18)' : isMid ? 'rgba(180,160,0,0.18)' : 'rgba(0,140,90,0.18)'
            const borderColor = isDeep ? 'rgba(30,80,220,0.55)' : isMid ? 'rgba(180,160,0,0.6)' : 'rgba(0,140,90,0.55)'
            const yOffset = isDeep ? -sy(5) : isMid ? -sy(3) : -sy(2.5)
            ctx.save()
            ctx.translate(pos.x, pos.y + yOffset)
            ctx.scale(1, 0.52)
            ctx.fillStyle = zoneColor
            ctx.strokeStyle = borderColor
            ctx.lineWidth = 1.5
            ctx.setLineDash([5, 3])
            ctx.beginPath()
            ctx.ellipse(0, 0, zoneW, zoneH, 0, 0, Math.PI*2)
            ctx.fill(); ctx.stroke()
            ctx.setLineDash([])
            ctx.restore()
            // Coverage label inside oval
            ctx.fillStyle = borderColor
            ctx.font = `bold ${Math.round(r * 1.1)}px sans-serif`
            ctx.textAlign = 'center'
            const label = isDeep ? 'DEEP' : isMid ? 'HOOK' : 'FLAT'
            ctx.fillText(label, pos.x, pos.y + yOffset * 0.4)
          }

          // Gap letter above DL
          if ((player.label==='DE'||player.label==='DT'||player.label==='NT'||player.label==='DL') && player.routeName) {
            const gapLetter = (player.routeName.match(/Gap ([A-Z]+)/i)||[])[1] || ''
            if (gapLetter) {
              ctx.fillStyle = 'rgba(180,30,30,0.9)'
              ctx.font = `bold ${Math.round(r*1.5)}px sans-serif`
              ctx.textAlign = 'center'
              ctx.fillText(gapLetter, pos.x, pos.y - r*2.4)
            }
          }

          // Blitz path arrow indicator
          if (isBlitz) {
            ctx.fillStyle = 'rgba(220,80,0,0.8)'
            ctx.font = `bold ${Math.round(r*1.8)}px sans-serif`
            ctx.textAlign = 'center'
            ctx.fillText('B!', pos.x + r*1.4, pos.y - r*1.2)
          }
        })
      }


      const pr = parseInt(P.slice(1,3),16)
      const pg = parseInt(P.slice(3,5),16)
      const pb = parseInt(P.slice(5,7),16)

      // Helper: draw arrowhead
      function arrow(ex, ey, nx, ny, size) {
        const angle = Math.atan2(ny, nx)
        const a = 0.45
        ctx.beginPath()
        ctx.moveTo(ex, ey)
        ctx.lineTo(ex - size*Math.cos(angle-a), ey - size*Math.sin(angle-a))
        ctx.lineTo(ex - size*Math.cos(angle+a), ey - size*Math.sin(angle+a))
        ctx.closePath(); ctx.fill()
      }

      // Helper: draw perpendicular (block) marker
      function perp(ex, ey, nx, ny, size) {
        const px = -ny, py = nx
        ctx.beginPath()
        ctx.moveTo(ex - px*size, ey - py*size)
        ctx.lineTo(ex + px*size, ey + py*size)
        ctx.stroke()
      }

      // Helper: draw pass arc between two points
      function drawPassArc(x1, y1, x2, y2, color) {
        const mx = (x1+x2)/2, my = (y1+y2)/2 - Math.abs(x2-x1)*0.3
        ctx.strokeStyle = color
        ctx.lineWidth = 1.5
        ctx.setLineDash([5, 3])
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.quadraticCurveTo(mx, my, x2, y2)
        ctx.stroke()
        ctx.setLineDash([])
        // Arrow at end
        const dx = x2 - mx, dy = y2 - my
        const dl = Math.sqrt(dx*dx+dy*dy)||1
        ctx.fillStyle = color
        arrow(x2, y2, dx/dl, dy/dl, r*1.2)
      }

      // Helper: draw start position dot
      function startDot(x, y, color) {
        ctx.fillStyle = color
        ctx.globalAlpha = 0.3
        ctx.beginPath(); ctx.arc(x, y, r*1.4, 0, Math.PI*2); ctx.fill()
        ctx.globalAlpha = 1
        ctx.strokeStyle = color
        ctx.lineWidth = 1
        ctx.setLineDash([2,2])
        ctx.beginPath(); ctx.arc(x, y, r*1.4, 0, Math.PI*2); ctx.stroke()
        ctx.setLineDash([])
      }
      // Basketball role detection
      function getBBRole(player) {
        const rn = player.routeName || ''
        if (rn.startsWith('BALL:')) return 'ball'
        if (rn.startsWith('SHOOT:')) return 'shooter'
        if (rn.startsWith('PASS:')) return 'pass'
        if (rn === 'SCREEN') return 'screen'
        if (rn.startsWith('CUT:')) return 'cut'
        return 'move'
      }

      // ── PRE-SNAP: show ghost start positions + full route preview ──
      if (t < snap) {
        parsed.players.forEach(player => {
          if (player.role !== 'off') return
          const path = player.path
          if (!path || path.length < 2) return
          const isLineman = ['C','G','T'].includes(player.label)
          const isBlock = player.routeType === 'block' || isLineman
          const bbRole = isBBall ? getBBRole(player) : null

          // Route color
          const routeColor = isLineman
            ? 'rgba(100,100,100,0.5)'
            : isBBall
              ? (bbRole==='ball'?'rgba(245,158,11,0.8)':bbRole==='shooter'?'rgba(74,222,128,0.8)':`rgba(${pr},${pg},${pb},0.7)`)
              : `rgba(${pr},${pg},${pb},0.75)`

          // Draw full route
          ctx.strokeStyle = routeColor
          ctx.lineWidth = isLineman ? 1 : 2
          ctx.setLineDash(isLineman ? [3,3] : [])
          ctx.beginPath()
          ctx.moveTo(sx(path[0][0]), sy(path[0][1]))
          for (let i = 1; i < path.length; i++) {
            ctx.lineTo(sx(path[i][0]), sy(path[i][1]))
          }
          ctx.stroke()
          ctx.setLineDash([])

          // End marker
          const ep = path[path.length-1]
          const pp = path[path.length-2]
          const dx = ep[0]-pp[0], dy = ep[1]-pp[1]
          const dl = Math.sqrt(dx*dx+dy*dy)||1
          const ex = sx(ep[0]), ey = sy(ep[1])

          if (isBlock) {
            ctx.strokeStyle = routeColor; ctx.lineWidth = 1.8
            perp(ex, ey, dx/dl, dy/dl, r*1.4)
          } else {
            ctx.fillStyle = routeColor
            arrow(ex, ey, dx/dl, dy/dl, r*1.8)
          }

          // Route name + yardage label
          if (!isBlock && (player.routeName || player.routeYards > 0)) {
            const midIdx = Math.max(0, Math.floor(path.length/2) - 1)
            const lx = sx(path[midIdx][0])
            const ly = sy(path[midIdx][1]) - r*2
            ctx.fillStyle = isBBall ? 'rgba(200,200,200,0.9)' : `rgba(${pr},${pg},${pb},0.9)`
            ctx.font = `bold ${Math.round(r*1.8)}px sans-serif`
            ctx.textAlign = 'center'
            // Show clean route name
            const displayName = player.routeName
              ? player.routeName.replace(/^(BALL:|SHOOT:|PASS:|CUT:)/,'').trim()
              : ''
            const displayText = player.routeYards > 0
              ? (displayName ? displayName + ' ' + player.routeYards+'yd' : player.routeYards+'yd')
              : displayName
            if (displayText) ctx.fillText(displayText, lx, ly)
          }
        })
      }

      // ── POST-SNAP: animate routes ──
      if (t >= snap) {
        const pt = Math.min((t - snap) / (1 - snap), 1)

        // Ball handler and pass targets
        const ballHolder = parsed.players.find(p => p.role==='off' && getBBRole(p)==='ball')
        const shooter = parsed.players.find(p => p.role==='off' && getBBRole(p)==='shooter')
        const passTargets = parsed.players.filter(p => p.role==='off' && getBBRole(p)==='pass')
        const qb = !isBBall && !isBSB ? parsed.players.find(p => p.id==='QB') : null
        const rb = !isBBall && !isBSB ? parsed.players.find(p => p.id==='RB') : null

        // PASS ARC: draw animated pass at 55% of play
        const passTime = 0.55
        if (isBBall && ballHolder && shooter && pt >= passTime) {
          // Start pos of ball holder at pass time, end pos of shooter
          const passProgress = Math.min(1, (pt - passTime) / 0.25)
          const startPos = getPos(ballHolder, snap + (passTime) * (1-snap))
          const endPos = getPos(shooter, t)
          // Animate the arc drawing progressively
          const mx = startPos.x + (endPos.x - startPos.x) * passProgress
          const my = startPos.y + (endPos.y - startPos.y) * passProgress - 30 * passProgress * (1-passProgress) * 4
          ctx.strokeStyle = `rgba(255,220,50,${0.9})`
          ctx.lineWidth = 2
          ctx.setLineDash([6, 3])
          ctx.beginPath()
          ctx.moveTo(startPos.x, startPos.y)
          // Draw partial arc
          const steps = 20
          for (let i = 1; i <= Math.round(steps * passProgress); i++) {
            const frac = i / steps
            const bx = startPos.x + (endPos.x - startPos.x) * frac
            const by = startPos.y + (endPos.y - startPos.y) * frac - 30 * frac * (1-frac) * 4
            ctx.lineTo(bx, by)
          }
          ctx.stroke()
          ctx.setLineDash([])
          // Ball travels along the arc
          if (passProgress < 1) {
            const ballFrac = passProgress
            const bx = startPos.x + (endPos.x - startPos.x) * ballFrac
            const by = startPos.y + (endPos.y - startPos.y) * ballFrac - 30 * ballFrac * (1-ballFrac) * 4
            ctx.fillStyle = '#f59e0b'
            ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1
            ctx.beginPath(); ctx.arc(bx, by, r*0.55, 0, Math.PI*2)
            ctx.fill(); ctx.stroke()
          }
          // Arrowhead at destination when pass arrives
          if (passProgress >= 0.9) {
            const dx = endPos.x - startPos.x, dy = endPos.y - startPos.y
            const dl = Math.sqrt(dx*dx+dy*dy)||1
            ctx.fillStyle = 'rgba(255,220,50,0.9)'
            arrow(endPos.x, endPos.y, dx/dl, dy/dl, r*1.5)
          }
        }

        // Football handoff: show ball traveling from QB to RB
        if (!isBBall && !isBSB && qb && rb) {
          const qbRouteName = qb.routeName || ''
          const isHandoff = qbRouteName.includes('Handoff') || qbRouteName.includes('handoff')
          if (isHandoff && pt >= 0.1 && pt <= 0.4) {
            const handoffProgress = Math.min(1, (pt - 0.1) / 0.2)
            const qbPos = getPos(qb, t)
            const rbPos = getPos(rb, t)
            // Ball travels from QB to RB
            const bx = qbPos.x + (rbPos.x - qbPos.x) * handoffProgress
            const by = qbPos.y + (rbPos.y - qbPos.y) * handoffProgress
            ctx.fillStyle = '#b45309'
            ctx.strokeStyle = 'rgba(255,200,50,0.8)'; ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.arc(bx, by, r*0.6, 0, Math.PI*2)
            ctx.fill(); ctx.stroke()
            // Arrow showing handoff direction
            if (handoffProgress < 0.8) {
              const dx = rbPos.x - qbPos.x, dy = rbPos.y - qbPos.y
              const dl = Math.sqrt(dx*dx+dy*dy)||1
              ctx.fillStyle = 'rgba(255,200,50,0.7)'
              arrow(bx + dx/dl*r, by + dy/dl*r, dx/dl, dy/dl, r*1.2)
            }
          }
        }

        parsed.players.forEach(player => {
          if (player.role !== 'off') return
          const path = player.path
          if (!path || path.length < 2) return
          const segs = path.length - 1
          const totalDraw = pt * segs
          const isLineman = ['C','G','T'].includes(player.label)
          const isBlock = player.routeType === 'block' || isLineman
          const bbRole = isBBall ? getBBRole(player) : null

          const routeColor = isLineman
            ? 'rgba(100,100,100,0.8)'
            : isBBall
              ? (bbRole==='ball'?`rgba(245,158,11,0.95)`:bbRole==='shooter'?`rgba(74,222,128,0.95)`:`rgba(${pr},${pg},${pb},0.9)`)
              : `rgba(${pr},${pg},${pb},0.95)`

          ctx.strokeStyle = routeColor
          ctx.lineWidth = isLineman ? 1.2 : 2
          ctx.setLineDash([])
          ctx.beginPath()
          ctx.moveTo(sx(path[0][0]), sy(path[0][1]))
          for (let s = 0; s < segs; s++) {
            const sp = Math.max(0, Math.min(1, totalDraw - s))
            if (sp <= 0) break
            ctx.lineTo(sx(lerp(path[s][0],path[s+1][0],sp)), sy(lerp(path[s][1],path[s+1][1],sp)))
          }
          ctx.stroke()

          // End marker when route mostly done
          if (totalDraw >= segs * 0.88) {
            const ep = path[path.length-1]
            const pp2 = path[path.length-2]
            const dx = ep[0]-pp2[0], dy = ep[1]-pp2[1]
            const dl = Math.sqrt(dx*dx+dy*dy)||1
            const ex = sx(ep[0]), ey = sy(ep[1])
            if (isBlock) {
              ctx.strokeStyle = routeColor; ctx.lineWidth = 2
              perp(ex, ey, dx/dl, dy/dl, r*1.4)
            } else {
              ctx.fillStyle = routeColor
              arrow(ex, ey, dx/dl, dy/dl, r*1.8)
            }
            // Yardage at end of route
            if (!isBlock && player.routeYards > 0) {
              ctx.fillStyle = routeColor
              ctx.font = `bold ${Math.round(r*1.7)}px sans-serif`
              ctx.textAlign = 'left'
              ctx.fillText(player.routeYards+'yd', ex+r*1.2, ey)
            }
          }
        })
      }

      // ── DRAW ALL PLAYERS ──
      parsed.players.forEach(player => {
        const pos = getPos(player, t)
        const isOff = player.role === 'off'
        const isLineman = ['C','G','T'].includes(player.label)
        const bbRole = isBBall ? getBBRole(player) : null

        // Show ghost start position if player has moved significantly
        if (isOff && t >= snap) {
          const startX = sx(player.path[0][0])
          const startY = sy(player.path[0][1])
          const dist = Math.sqrt(Math.pow(pos.x-startX,2)+Math.pow(pos.y-startY,2))
          if (dist > r * 2) {
            ctx.globalAlpha = 0.2
            ctx.fillStyle = isLineman ? '#888' : P
            if (isLineman) {
              const s = r * 0.85
              ctx.fillRect(startX-s, startY-s, s*2, s*2)
            } else {
              ctx.beginPath(); ctx.arc(startX, startY, r*0.9, 0, Math.PI*2); ctx.fill()
            }
            ctx.globalAlpha = 1
          }
        }

        if (isOff) {
          if (isBBall) {
            const isBallHolder = bbRole === 'ball'
            const isShooter = bbRole === 'shooter'
            const isPassTarget = bbRole === 'pass'
            const isScreener = bbRole === 'screen'

            // Glow ring for key players
            if (isBallHolder || isShooter) {
              const glowColor = isBallHolder ? 'rgba(245,158,11,0.25)' : 'rgba(74,222,128,0.2)'
              ctx.fillStyle = glowColor
              ctx.beginPath(); ctx.arc(pos.x, pos.y, r*2.4, 0, Math.PI*2); ctx.fill()
            }

            // Player circle
            ctx.fillStyle = isBallHolder ? '#f59e0b' : isShooter ? '#4ade80' : isScreener ? '#888' : P
            ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI*2)
            ctx.fill(); ctx.stroke()

            // Ball indicator on ball holder - disappears after pass
            const passTime2 = 0.55
            const hasPassed = isBBall && shooter && pt >= passTime2 + 0.25
            if (isBallHolder && !hasPassed) {
              ctx.fillStyle = '#f59e0b'
              ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 0.5
              ctx.beginPath(); ctx.arc(pos.x + r*0.95, pos.y - r*0.95, r*0.52, 0, Math.PI*2)
              ctx.fill(); ctx.stroke()
              ctx.strokeStyle = 'rgba(139,69,19,0.8)'; ctx.lineWidth = 0.5
              ctx.beginPath(); ctx.arc(pos.x + r*0.95, pos.y - r*0.95, r*0.52, 0, Math.PI)
              ctx.stroke()
            }
            // Shooter gets ball after pass arrives
            if (isShooter && isBBall && shooter && pt >= passTime2 + 0.25) {
              ctx.fillStyle = '#f59e0b'
              ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 0.5
              ctx.beginPath(); ctx.arc(pos.x + r*0.95, pos.y - r*0.95, r*0.52, 0, Math.PI*2)
              ctx.fill(); ctx.stroke()
            }

            // Star marker for shooter
            if (isShooter) {
              ctx.fillStyle = '#4ade80'
              ctx.font = `bold ${Math.round(r*1.4)}px sans-serif`
              ctx.textAlign = 'center'
              ctx.fillText('*', pos.x + r*1.0, pos.y - r*1.1)
            }

            // Player number
            ctx.fillStyle = isBallHolder || isShooter ? '#000' : 'white'
            ctx.font = `bold ${Math.round(r*1.05)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)

            // Role tag below player
            const tag = isBallHolder ? 'BALL' : isShooter ? 'SHOOT' : isPassTarget ? 'PASS' : isScreener ? 'SCREEN' : ''
            if (tag) {
              const tagColor = isBallHolder ? '#f59e0b' : isShooter ? '#4ade80' : '#6b9fff'
              ctx.fillStyle = tagColor
              ctx.font = `bold ${Math.round(r*0.9)}px sans-serif`
              ctx.textAlign = 'center'; ctx.textBaseline = 'top'
              ctx.fillText(tag, pos.x, pos.y + r*1.2)
            }

          } else if (isLineman) {
            // Square for linemen
            ctx.fillStyle = P; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.2
            const s = r * 0.92
            ctx.fillRect(pos.x-s, pos.y-s, s*2, s*2)
            ctx.strokeRect(pos.x-s, pos.y-s, s*2, s*2)
            ctx.fillStyle = 'white'
            ctx.font = `bold ${Math.round(r)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          } else {
            // Circle for skill players
            ctx.fillStyle = P; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 1.2
            ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI*2)
            ctx.fill(); ctx.stroke()

            // QB handoff indicator
            if (!isBBall && !isBSB && player.id === 'QB' && player.routeName && player.routeName.includes('Handoff') && t >= snap && t < snap + 0.25) {
              ctx.fillStyle = 'rgba(255,200,50,0.9)'
              ctx.font = `bold ${Math.round(r*1.5)}px sans-serif`
              ctx.textAlign = 'center'; ctx.textBaseline = 'bottom'
              ctx.fillText('HAND OFF', pos.x, pos.y - r*1.5)
            }

            ctx.fillStyle = 'white'
            ctx.font = `bold ${Math.round(r*1.0)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          }
        } else {
          // Defense rendering - solid in defensive diagrams, hollow in offensive
          if (isDefDiagram && !isBBall && !isBSB) {
            const rn = (player.routeName||'').toLowerCase()
            const isDL = ['DE','DT','NT','DL'].includes(player.label)
            const isBlitz = rn.includes('blitz') || rn.includes('rush')
            const pr2=parseInt(P.slice(1,3),16),pg2=parseInt(P.slice(3,5),16),pb2=parseInt(P.slice(5,7),16)
            ctx.fillStyle = isBlitz ? 'rgba(220,80,0,0.9)' : `rgba(${pr2},${pg2},${pb2},0.9)`
            ctx.strokeStyle = 'white'; ctx.lineWidth = 1.5
            if (isDL) {
              const s = r * 0.92
              ctx.fillRect(pos.x-s, pos.y-s, s*2, s*2)
              ctx.strokeRect(pos.x-s, pos.y-s, s*2, s*2)
            } else {
              ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI*2); ctx.fill(); ctx.stroke()
            }
            ctx.fillStyle = 'white'
            ctx.font = `bold ${Math.round(r*0.85)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          } else {
            const defColor = isBBall ? 'rgba(120,120,120,0.7)' : 'rgba(60,60,60,0.75)'
            ctx.strokeStyle = defColor; ctx.fillStyle = isBBall ? 'rgba(120,120,120,0.08)' : 'rgba(60,60,60,0.08)'
            ctx.lineWidth = 1.2
            ctx.beginPath(); ctx.arc(pos.x, pos.y, r*0.82, 0, Math.PI*2)
            ctx.fill(); ctx.stroke()
            ctx.fillStyle = defColor
            ctx.font = `${Math.round(r*0.85)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          }
        }
      })

      // Snap flash
      if (!isBBall && !isBSB && t >= snap && t < snap + 0.07) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)'
        ctx.font = `bold ${Math.round(H*0.045)}px sans-serif`
        ctx.textAlign = 'center'
        ctx.fillText('SNAP', W/2, isBSB ? sy(46) : sy(38)-10)
      }
    }

    if (playing) {
      startTime = null
      if (animRef.current) cancelAnimationFrame(animRef.current)
      function frame(ts) {
        if (!startTime) startTime = ts
        const t = Math.min((ts-startTime)/dur, 1)
        setProgress(t)
        draw(t)
        if (t < 1) { animRef.current = requestAnimationFrame(frame) }
        else { setPlaying(false) }
      }
      animRef.current = requestAnimationFrame(frame)
    } else {
      draw(0)
    }

    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [parsed, playing, P])

  function replay() {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    setProgress(0); setPlaying(true)
  }

  return (
    <div style={{ marginTop:10, background:'#f0f0ec', borderRadius:10, border:`1px solid rgba(${pr},${pg},${pb},0.3)`, overflow:'hidden' }}>
      <div style={{ padding:'9px 13px', borderBottom:'1px solid rgba(0,0,0,0.1)', display:'flex', alignItems:'center', gap:8, background:'white' }}>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, color:'#222', flex:1 }}>{play.name}</span>
        <span style={{ fontSize:10, color:'#888', fontFamily:"'DM Mono',monospace" }}>{play.type}</span>
        {!parsed && !loading && !autoLoad && (
          <button onClick={generateAnim} style={{ padding:'4px 12px', background:P, border:'none', borderRadius:6, color:'white', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:1 }}>ANIMATE</button>
        )}
        {parsed && (
          <button onClick={replay} disabled={playing} style={{ padding:'4px 12px', background:playing?'#ccc':P, border:'none', borderRadius:6, color:'white', fontSize:10, fontWeight:700, cursor:playing?'not-allowed':'pointer', fontFamily:'inherit', letterSpacing:1 }}>{playing?'PLAYING':'REPLAY'}</button>
        )}
      </div>
      {loading && <div style={{ padding:14, textAlign:'center', color:'#666', fontSize:12 }}>Generating play diagram...</div>}
      {error && <div style={{ padding:10, color:'#c00', fontSize:11 }}>Error: {error}</div>}
      {parsed && (
        <div style={{ position:'relative' }}>
          <canvas ref={canvasRef} width={500} height={300} style={{ width:'100%', display:'block' }} />
          <div style={{ position:'absolute', bottom:6, right:8, background:'rgba(0,0,0,0.4)', borderRadius:4, padding:'1px 6px', fontSize:9, color:'white' }}>{Math.round(progress*100)}%</div>
        </div>
      )}
    </div>
  )
}

// -- DEFENSIVE FORMATION CARD --
function DefFormationCard({ formation: f, S, P, al, callAI, parseJSON, sport }) {
  const [expanded, setExpanded] = useState(false)
  const [showAnim, setShowAnim] = useState(false)
  const [steps, setSteps] = useState(null)
  const [stepsLoading, setStepsLoading] = useState(false)
  const [qaHistory, setQAHistory] = useState([])
  const [question, setQuestion] = useState('')
  const [qaLoading, setQALoading] = useState(false)
  const [disguise, setDisguise] = useState(null)
  const [disguiseLoading, setDisguiseLoading] = useState(false)
  const [showDisguise, setShowDisguise] = useState(false)

  const defPlay = { name: f.name, type: f.type, note: f.assignment, _isDefense: true }
  // Only show disguise for 11-12 and up
  const ageGroup = f.ageGroup || ''
  const showDisguiseFeature = !ageGroup || !ageGroup.includes('6-8') && !ageGroup.includes('9-10')
  const pr = parseInt(S.slice(1,3),16), pg = parseInt(S.slice(3,5),16), pb = parseInt(S.slice(5,7),16)

  async function loadSteps() {
    if (steps) return
    setStepsLoading(true)
    try {
      const sportLabel = sport || 'football'
      const raw = await callAI(
        'You are a youth ' + sportLabel + ' defensive coordinator educator. Break down this defensive formation for coaches AND players: "' + f.name + '" (' + f.type + '). Assignment: ' + f.assignment + '. When to use: ' + f.whenToUse +
        ' Return ONLY valid JSON: {"keyAssignment":"the single most important assignment every player must understand","coverageType":"zone, man, or combination - explained simply","steps":["Step 1: pre-snap alignment","Step 2: at the snap","Step 3: key reads","Step 4: what makes it work","Step 5: common mistakes"],"keyCoachingPoints":["point 1","point 2","point 3"],"whyItWorks":"why this defense is effective in the stated situation","playerRoles":[{"position":"DL","job":"their assignment","whyTheyDoIt":"explain to a 12yr old why their gap control matters"},{"position":"LB","job":"their assignment","whyTheyDoIt":"explain why"},{"position":"CB","job":"their assignment","whyTheyDoIt":"explain why"},{"position":"Safety","job":"their assignment","whyTheyDoIt":"explain why"}],"huddleCard":[{"player":"DL","instruction":"one sentence defensive assignment","termNote":"explain any jargon or empty string"},{"player":"LB","instruction":"one sentence assignment","termNote":"explain any jargon"},{"player":"CB","instruction":"one sentence assignment","termNote":"explain any jargon"},{"player":"S","instruction":"one sentence assignment","termNote":"explain any jargon"}]}'
      )
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setSteps(JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1)))
    } catch(e) { setSteps({ error: e.message }) }
    setStepsLoading(false)
  }

  async function askQuestion() {
    if (!question.trim()) return
    const q = question.trim(); setQuestion(''); setQALoading(true)
    const history = qaHistory.map(i => 'Q: '+i.q+'\nA: '+i.a).join('\n\n')
    const ctx = history ? 'Previous questions:\n'+history+'\n\n' : ''
    try {
      const raw = await callAI('You are a youth ' + (sport||'football') + ' defensive coordinator educator. Formation: "' + f.name + '" - ' + f.assignment + '\n\n' + ctx + 'Coach question: "' + q + '" Answer in 2-4 sentences using defensive terminology. Be practical.')
      setQAHistory(prev => [...prev, { q, a: raw.trim() }])
    } catch(e) { setQAHistory(prev => [...prev, { q, a: 'Error: '+e.message }]) }
    setQALoading(false)
  }

  async function loadDisguise() {
    if (disguise) { setShowDisguise(s=>!s); return }
    setDisguiseLoading(true)
    try {
      const raw = await callAI(
        'You are a defensive coordinator teaching disguise techniques for this defense: "' + f.name + '" (' + f.type + '). ' + f.assignment +
        ' Explain how to disguise this coverage pre-snap so the offense cannot identify it. Return ONLY valid JSON: {' +
        '"presnap":"what defenders should show pre-snap (alignment, stance, eye direction) to fool the offense",' +
        '"fakeAlignment":"the false look to present - what it should look like to the QB",' +
        '"snapTrigger":"what happens at the snap that reveals the true assignment",' +
        '"qbReads":"what this disguise forces the QB to think and why that helps the defense",' +
        '"coachingCue":"exact words to use when teaching disguise to players",' +
        '"techniques":[{"player":"position","action":"specific pre-snap movement or look","purpose":"why this fools the offense"},' +
        '{"player":"position","action":"action","purpose":"purpose"},' +
        '{"player":"position","action":"action","purpose":"purpose"}]}'
      )
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setDisguise(JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1)))
      setShowDisguise(true)
    } catch(e) { setDisguise({ error: e.message }); setShowDisguise(true) }
    setDisguiseLoading(false)
  }

  return (
    <div style={{ borderBottom:'1px solid #1e2330' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 0', cursor:'pointer' }} onClick={() => { const n=!expanded; setExpanded(n); if(n) loadSteps() }}>
        <div style={{ width:22, height:22, minWidth:22, background:S, color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{f.number}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{f.name}</div>
          <div style={{ fontSize:10, color:S, fontFamily:"'DM Mono',monospace", marginTop:1 }}>{f.type}</div>
          <div style={{ fontSize:11, color:'#f2f4f8', marginTop:3, lineHeight:1.4 }}>{f.assignment}</div>
          <div style={{ fontSize:11, color:'#6b7a96', marginTop:3, fontStyle:'italic' }}>When: {f.whenToUse}</div>
          <div style={{ fontSize:10, color:S, marginTop:4 }}>{expanded ? '▲ Collapse' : '▼ Expand breakdown + diagram'}</div>
        </div>
        <button onClick={e=>{e.stopPropagation();setShowAnim(a=>!a);setExpanded(true);loadSteps()}} style={{ padding:'4px 9px', background:showAnim?S:`rgba(${pr},${pg},${pb},0.12)`, border:`1px solid ${S}`, borderRadius:6, color:showAnim?'white':S, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:0.5, whiteSpace:'nowrap', flexShrink:0 }}>
          {showAnim ? 'HIDE' : 'DIAGRAM'}
        </button>
      </div>

      {expanded && (
        <div style={{ paddingBottom:14, animation:'fadeIn 0.2s ease' }}>
          {showAnim && <div style={{ marginBottom:12 }}><PlayAnimator play={defPlay} P={S} callAI={callAI} parseJSON={parseJSON} autoLoad={true} /></div>}

          {stepsLoading && <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, display:'flex', alignItems:'center', gap:10 }}><div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${S}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} /><div style={{ fontSize:12, color:'#6b7a96' }}>Generating breakdown...</div></div>}

          {steps && steps.huddleCard && steps.huddleCard.length > 0 && (
            <div style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.04))', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, padding:12, marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                <span style={{ fontSize:14 }}>📋</span>
                <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f59e0b', fontWeight:700 }}>Huddle Card — Read This at the Line</div>
              </div>
              <div style={{ fontSize:10, color:'#6b7a96', marginBottom:8 }}>One job per player. Any technical term explained in <span style={{ fontStyle:'italic' }}>italics</span>.</div>
              {steps.huddleCard.map((item, i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
                  <div style={{ minWidth:32, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:5, padding:'2px 4px', textAlign:'center', fontSize:9, fontWeight:800, color:'#f59e0b', flexShrink:0, marginTop:1 }}>{item.player}</div>
                  <div style={{ flex:1 }}>
                    <span style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{item.instruction}</span>
                    {item.termNote && <span style={{ fontSize:11, color:'#6b7a96', fontStyle:'italic' }}> ({item.termNote})</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {steps && !steps.error && (
            <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, border:`1px solid rgba(${pr},${pg},${pb},0.2)` }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:S, fontWeight:700, marginBottom:10 }}>Defensive Breakdown</div>
              {steps.keyAssignment && <div style={{ padding:'8px 10px', background:`rgba(${pr},${pg},${pb},0.1)`, border:`1px solid rgba(${pr},${pg},${pb},0.25)`, borderRadius:8, marginBottom:8 }}><div style={{ fontSize:9, letterSpacing:1.5, color:S, fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Key Assignment</div><div style={{ fontSize:12, color:'#f2f4f8', fontWeight:600 }}>{steps.keyAssignment}</div></div>}
              {steps.coverageType && <div style={{ padding:'8px 10px', background:'rgba(107,154,255,0.08)', borderRadius:8, marginBottom:8, border:'1px solid rgba(107,154,255,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#6b9fff', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Coverage Type</div><div style={{ fontSize:12, color:'#f2f4f8' }}>{steps.coverageType}</div></div>}
              {(steps.steps||[]).map((step, i) => (<div key={i} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:i<steps.steps.length-1?'1px solid #1e2330':'none' }}><div style={{ width:18, height:18, minWidth:18, background:'#0f1117', border:`1px solid ${S}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:S, flexShrink:0, marginTop:1 }}>{i+1}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{step}</div></div>))}
              {steps.keyCoachingPoints && steps.keyCoachingPoints.length > 0 && (<div style={{ marginTop:10, padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, border:'1px solid rgba(74,222,128,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#4ade80', fontWeight:700, marginBottom:6 }}>Key Coaching Points</div>{steps.keyCoachingPoints.map((pt,i) => <div key={i} style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5, marginBottom:3 }}>• {pt}</div>)}</div>)}
              {steps.whyItWorks && (<div style={{ marginTop:10, padding:'10px 12px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:5 }}>Why This Works</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{steps.whyItWorks}</div></div>)}
              {steps.playerRoles && steps.playerRoles.length > 0 && (<div style={{ marginTop:10 }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:8 }}>What to Tell Each Player</div>{steps.playerRoles.map((role,i) => (<div key={i} style={{ marginBottom:8, padding:'10px 12px', background:'rgba(245,158,11,0.06)', borderRadius:8, border:'1px solid rgba(245,158,11,0.15)' }}><div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}><div style={{ width:26, height:26, minWidth:26, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', color:'#f59e0b', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>{role.position}</div><div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{role.job}</div></div><div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.6, paddingLeft:34, fontStyle:'italic' }}>"Tell your player: {role.whyTheyDoIt}"</div></div>))}</div>)}
            </div>
          )}

          <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12 }}>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:8 }}>Ask About This Formation</div>
            {qaHistory.map((item,i) => (<div key={i} style={{ marginBottom:10 }}><div style={{ fontSize:11, fontWeight:600, color:S, marginBottom:3 }}>Q: {item.q}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.6, padding:'6px 10px', background:'rgba(255,255,255,0.04)', borderRadius:6 }}>{item.a}</div></div>))}
            {qaLoading && <div style={{ fontSize:11, color:'#6b7a96', marginBottom:8 }}>Getting answer...</div>}
            <div style={{ display:'flex', gap:7 }}>
              <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&question.trim())askQuestion()}} placeholder={qaHistory.length>0?"Ask a follow-up...":"e.g. What is the CB responsible for? How do we handle a TE?"} style={{ flex:1, background:'#0f1117', border:'1px solid #1e2330', borderRadius:7, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
              <button onClick={askQuestion} disabled={qaLoading||!question.trim()} style={{ padding:'0 12px', background:qaLoading||!question.trim()?'#3d4559':S, color:'white', border:'none', borderRadius:7, fontFamily:"'Bebas Neue',sans-serif", fontSize:12, letterSpacing:1, cursor:qaLoading||!question.trim()?'not-allowed':'pointer', flexShrink:0 }}>ASK</button>
            </div>
          </div>

          {/* DISGUISE COVERAGE - 11-12 yrs and up only */}
          {showDisguiseFeature && (
            <div>
              <button
                onClick={loadDisguise}
                disabled={disguiseLoading}
                style={{ width:'100%', padding:'10px 14px', background:showDisguise?'rgba(180,0,220,0.12)':'#161922', border:`1px solid ${showDisguise?'rgba(180,0,220,0.4)':'#1e2330'}`, borderRadius:10, color:showDisguise?'#c084fc':'#6b7a96', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, cursor:disguiseLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}
              >
                <span style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:15 }}>🎭</span>
                  {disguiseLoading ? 'GENERATING DISGUISE...' : 'DISGUISE THIS COVERAGE'}
                </span>
                <span style={{ fontSize:11 }}>{showDisguise ? '▲ HIDE' : '▼ HOW TO FOOL THE QB'}</span>
              </button>

              {showDisguise && disguise && !disguise.error && (
                <div style={{ marginTop:8, background:'rgba(180,0,220,0.06)', border:'1px solid rgba(180,0,220,0.25)', borderRadius:10, padding:14, animation:'fadeIn 0.2s ease' }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#c084fc', fontWeight:700, marginBottom:10 }}>Pre-Snap Disguise</div>

                  <div style={{ padding:'8px 10px', background:'rgba(180,0,220,0.08)', borderRadius:8, marginBottom:8, borderLeft:'3px solid rgba(180,0,220,0.5)' }}>
                    <div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>What to Show Pre-Snap</div>
                    <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{disguise.presnap}</div>
                  </div>

                  {/* Disguise diagram - shows fake pre-snap then true assignment */}
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>Disguise Movement Diagram</div>
                    <PlayAnimator
                      play={{
                        name: f.name + ' DISGUISE',
                        type: 'DISGUISE',
                        note: 'Pre-snap: ' + (disguise.fakeAlignment||'') + '. At snap: ' + (disguise.snapTrigger||'') + '. True assignment: ' + f.assignment,
                        _isDefense: true,
                        _isDisguise: true
                      }}
                      P="rgba(180,0,220,0.9)"
                      callAI={callAI}
                      parseJSON={parseJSON}
                      autoLoad={true}
                    />
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                    <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.25)', borderRadius:8 }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Fake Look</div>
                      <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{disguise.fakeAlignment}</div>
                    </div>
                    <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.25)', borderRadius:8 }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>At Snap</div>
                      <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{disguise.snapTrigger}</div>
                    </div>
                  </div>

                  {disguise.qbReads && (
                    <div style={{ padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, marginBottom:10, border:'1px solid rgba(74,222,128,0.15)' }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, color:'#4ade80', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>What the QB Sees</div>
                      <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{disguise.qbReads}</div>
                    </div>
                  )}

                  {disguise.techniques && disguise.techniques.length > 0 && (
                    <div style={{ marginBottom:10 }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>Player-by-Player Disguise Moves</div>
                      {disguise.techniques.map((t,i) => (
                        <div key={i} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:i<disguise.techniques.length-1?'1px solid rgba(180,0,220,0.15)':'none' }}>
                          <div style={{ width:26, height:26, minWidth:26, background:'rgba(180,0,220,0.15)', border:'1px solid rgba(180,0,220,0.3)', color:'#c084fc', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, flexShrink:0 }}>{t.player}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:11, color:'#f2f4f8', fontWeight:600, marginBottom:2 }}>{t.action}</div>
                            <div style={{ fontSize:10, color:'#6b7a96', lineHeight:1.4 }}>{t.purpose}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {disguise.coachingCue && (
                    <div style={{ padding:'8px 10px', background:'rgba(180,0,220,0.08)', borderRadius:8, borderLeft:'3px solid rgba(180,0,220,0.5)' }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Coaching Cue</div>
                      <div style={{ fontSize:12, color:'#f2f4f8', fontStyle:'italic' }}>"{disguise.coachingCue}"</div>
                    </div>
                  )}
                </div>
              )}
              {showDisguise && disguise && disguise.error && (
                <div style={{ marginTop:8, padding:10, background:'#161922', borderRadius:8, fontSize:11, color:'#6b7a96' }}>Could not load disguise. Try again.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// -- PLAYBOOK PLAY CARD (in More tab, with diagram) --
function PlaybookCard({ play, packageName, packageIndex, P, S, al, callAI, parseJSON }) {
  const [showAnim, setShowAnim] = useState(false)

  return (
    <div style={{ background:'#0f1117', border:'1px solid #1e2330', borderRadius:10, overflow:'hidden', marginBottom:8 }}>
      <div style={{ padding:'12px 14px', display:'flex', alignItems:'flex-start', gap:10 }}>
        <div style={{ width:22, height:22, minWidth:22, background:al(P,0.15), border:`1px solid ${P}`, color:P, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{play.number}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{play.name}</div>
            <span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background:al(P,0.15), color:P }}>{play.type}</span>
            <span style={{ fontSize:9, color:'#3d4559' }}>Pkg #{packageIndex}</span>
          </div>
          <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.4, marginBottom:3 }}>{play.note}</div>
          <div style={{ fontSize:10, color:'#3d4559' }}>{packageName}</div>
        </div>
        <button onClick={()=>setShowAnim(a=>!a)} style={{ padding:'4px 9px', background:showAnim?P:al(P,0.12), border:`1px solid ${P}`, borderRadius:6, color:showAnim?'white':P, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:0.5, whiteSpace:'nowrap', flexShrink:0 }}>
          {showAnim ? 'HIDE' : 'DIAGRAM'}
        </button>
      </div>
      {showAnim && (
        <PlayAnimator play={play} P={P} callAI={callAI} parseJSON={parseJSON} autoLoad={true} />
      )}
    </div>
  )
}

// -- DEFENSIVE SCHEME GENERATOR --
function DefenseGen({ sport, P, S, al, callAI, parseJSON }) {
  const isFB = sport === 'Football'
  const isBB = sport === 'Basketball'
  const isBSB = sport === 'Baseball'

  const fbFields = [
    {id:'formation',label:'Opponent Offensive Formation',opts:['Unknown / Scout First','Spread','Wing-T','I-Formation','Single Wing','Pistol','Double Wing','Option','Flexbone']},
    {id:'personnel',label:'Their Key Threat',opts:['Dual Threat QB / Scrambler','Big Physical RB','Speed Receivers','Multiple TE Sets','Strong OL Run Game','Pass Heavy No Run','Option/Triple Option']},
    {id:'age',label:'Age Group',opts:['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School JV','High School Varsity']},
    {id:'skill',label:'Your Defensive Skill',opts:['First Year / Beginner','2nd-3rd Year Average','Experienced / Athletic','Elite / Competitive']},
    {id:'dline',label:'Your D-Line Strength',opts:['Big and Physical','Quick and Agile','Average Size','Undersized but Fast','Overpowering']},
    {id:'style',label:'Defensive Identity',opts:['Gap Control / Physical','Speed and Pursuit','Bend Dont Break','Aggressive Blitz Heavy','Zone Heavy','Man Coverage Heavy','Multiple / Disguise']},
  ]
  const bbFields = [
    {id:'offense',label:'Opponent Offense',opts:['Unknown / Scout First','Motion Heavy','Pick and Roll Heavy','Isolation / Star Player','Drive and Kick','Three Point Heavy','Post Dominant']},
    {id:'personnel',label:'Their Key Threat',opts:['Elite Ball Handler','Dominant Big Man','Three Point Shooter','Athletic Wing','Balanced Team','Physical Post']},
    {id:'roster',label:'Your Roster Size',opts:['6-8 players','9-10 players','10-12 players']},
    {id:'age',label:'Age Group',opts:['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School']},
    {id:'skill',label:'Your Defensive Skill',opts:['Beginner','Average','Athletic']},
    {id:'style',label:'Defensive Style',opts:['Man to Man Pressure','2-3 Zone','1-3-1 Zone','Full Court Press','Matchup Zone','Pack the Paint']},
  ]
  const bsbFields = [
    {id:'batting',label:'Opponent Batting Style',opts:['Unknown / Scout First','Pull Hitters Heavy','Spray Hitters','Bunt Heavy / Small Ball','Power Hitters','Speed and Baserunning','Mixed Approach']},
    {id:'personnel',label:'Their Key Threat',opts:['Elite Leadoff Hitter','Cleanup Power Hitter','Fast Baserunners','Contact Hitters','Patient / Walk Heavy','Switch Hitters']},
    {id:'roster',label:'Your Roster Size',opts:['9-11 players','12-14 players','15+ players']},
    {id:'age',label:'Age Group',opts:['7-8 yrs Coach Pitch','9-10 yrs','11-12 yrs','13-14 yrs','High School']},
    {id:'skill',label:'Your Defensive Skill',opts:['Beginner','Average','Competitive']},
    {id:'style',label:'Pitching Approach',opts:['Fastball First','Breaking Ball Setup','Change of Speed','Attack the Zone','Work the Corners','Keep Off Balance']},
  ]

  const cfg = isBB ? bbFields : isBSB ? bsbFields : fbFields
  const initF = () => { const f={}; cfg.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [fields, setFields] = useState(initF)
  const [prevSport, setPrevSport] = useState(sport)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  if (sport !== prevSport) {
    setPrevSport(sport)
    setFields(initF())
    setResult(null)
    setError('')
  }

  const activeCfg = isBB ? bbFields : isBSB ? bsbFields : fbFields

  async function generate() {
    setLoading(true); setResult(null); setError('')
    const label = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
    const inputSummary = Object.keys(fields).map(k => k + ': ' + fields[k]).join(', ')

    const prompt = isFB
      ? 'You are an elite youth football defensive coordinator. Build a defensive game plan. ' + inputSummary + '. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive formation name","type":"BASE or NICKEL or BLITZ or ZONE or MAN","assignment":"specific gap assignments and coverage responsibilities","whenToUse":"exact game situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"the single most important thing to stop their offense","adjustmentTip":"how to adjust at halftime if they are moving the ball","coachingCue":"memorable defensive phrase for players"}'
      : isBB
      ? 'You are an elite youth basketball defensive coach. Build a defensive game plan. ' + inputSummary + '. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive scheme name","type":"MAN or ZONE or PRESS or TRAP","assignment":"specific player assignments and rotations","whenToUse":"exact game situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"the most important thing to take away","adjustmentTip":"halftime adjustment if they are scoring easily","coachingCue":"defensive motto for players"}'
      : 'You are an elite youth baseball manager. Build a defensive game plan for this opponent. ' + inputSummary + '. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive alignment name","type":"STANDARD or SHIFT or WHEEL or FIVE MAN INFIELD or OUTFIELD DEPTH","assignment":"specific positioning for all fielders and pitcher strategy","whenToUse":"exact count or game situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"most important out to get","adjustmentTip":"how to adjust if they are hitting well","coachingCue":"defensive focus phrase"}'

    try {
      const raw = await callAI(prompt)
      const data = parseJSON(raw)
      if (!data.formations) throw new Error('No formations in response')
      setResult(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  const icon = isBB ? '🛡' : isBSB ? '⚾' : '🛡'
  const title = isBSB ? sport + ' Defensive Positioning' : sport + ' Defensive Scheme Generator'
  const btnText = isBSB ? 'BUILD DEFENSIVE PLAN' : 'BUILD DEFENSIVE SCHEME'

  return (
    <Card>
      <div style={{ padding:'12px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${S}`, cursor:'pointer' }} onClick={() => setExpanded(e=>!e)}>
        <span style={{ fontSize:15 }}>🛡</span>
        <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:1, color:'#f2f4f8', flex:1 }}>{title}</span>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:1, padding:'2px 7px', borderRadius:10, background:al(S,0.15), color:S }}>DEFENSIVE</span>
        <span style={{ fontSize:12, color:'#6b7a96' }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div style={{ padding:14, animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            {activeCfg.map(f => (
              <Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />
            ))}
          </div>
          <PBtn onClick={generate} disabled={loading} color={S}>{loading ? 'BUILDING...' : btnText}</PBtn>
          {loading && <Shimmer />}
          {error && <ErrBox msg={error} />}
          {result && (
            <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(S,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:1, color:S, marginBottom:8 }}>{result.packageName}</div>
              <p style={{ fontSize:12, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>{result.summary}</p>

              {/* Key stop */}
              {result.keyStop && (
                <div style={{ padding:'8px 12px', background:al(S,0.1), border:`1px solid ${al(S,0.25)}`, borderRadius:8, marginBottom:10 }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Primary Assignment — Stop This</div>
                  <div style={{ fontSize:13, color:'#f2f4f8', fontWeight:600 }}>{result.keyStop}</div>
                </div>
              )}

              {(result.formations||[]).map(f => (
                <DefFormationCard key={f.number} formation={f} S={S} P={P} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} />
              ))}

              {result.adjustmentTip && (
                <div style={{ marginTop:10, padding:10, background:'#0f1117', borderRadius:8, border:'1px solid #1e2330' }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Halftime Adjustment</div>
                  <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{result.adjustmentTip}</div>
                </div>
              )}
              {result.coachingCue && (
                <div style={{ marginTop:8, padding:10, background:al(S,0.1), borderRadius:8 }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Defensive Cue</div>
                  <div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic', fontWeight:500 }}>"{result.coachingCue}"</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

// -- SITUATIONAL PANEL (sport-aware) --
function SituationalPanel({ sport, P, S, al, callAI }) {
  const isFB = sport === 'Football'
  const isBB = sport === 'Basketball'
  const isBSB = sport === 'Baseball'

  // Football state
  const [down, setDown] = useState('3rd')
  const [distance, setDistance] = useState('5')
  const [fieldPos, setFieldPos] = useState('OPP 28')
  const [score, setScore] = useState('UP 3')
  const [timeLeft, setTimeLeft] = useState('4:22')
  const [fbRec, setFbRec] = useState([
    {n:'1',top:true,name:'Slot Cross / Hi-Lo',why:'Attacks Cover 2 void in the middle',pct:'84%'},
    {n:'2',top:false,name:'QB Draw',why:'Exploit aggressive pass rush',pct:'61%'},
    {n:'3',top:false,name:'Four Verticals',why:'Force single coverage - big play potential',pct:'43%'},
  ])
  const [fbLoading, setFbLoading] = useState(false)

  // Basketball state
  const [quarter, setQuarter] = useState('3rd')
  const [bbScore, setBbScore] = useState('UP 4')
  const [possession, setPossession] = useState('Offense')
  const [fouls, setFouls] = useState('2 team fouls')
  const [timeouts, setTimeouts] = useState('2 remaining')
  const [shotClock, setShotClock] = useState('14s')
  const [bbRec, setBbRec] = useState(null)
  const [bbLoading, setBbLoading] = useState(false)

  // Baseball state
  const [inning, setInning] = useState('5th')
  const [halfInning, setHalfInning] = useState('Top')
  const [outs, setOuts] = useState('1')
  const [balls, setBalls] = useState('2')
  const [strikes, setStrikes] = useState('1')
  const [runners, setRunners] = useState('Runner on 1st')
  const [bsbRec, setBsbRec] = useState(null)
  const [bsbLoading, setBsbLoading] = useState(false)

  async function getFbRec() {
    setFbLoading(true)
    try {
      const raw = await callAI(
        'You are a football offensive coordinator. Situation: ' + down + ' and ' + distance +
        ', field position: ' + fieldPos + ', score: ' + score + ', time: ' + timeLeft +
        '. Give top 3 play recommendations. Return ONLY valid JSON: ' +
        '{"plays":[{"name":"play name","why":"one sentence reason","confidence":"pct like 87%"},' +
        '{"name":"play name","why":"reason","confidence":"pct"},' +
        '{"name":"play name","why":"reason","confidence":"pct"}]}'
      )
      const data = JSON.parse(raw.replace(/```[^`]*```/g,'').trim().slice(raw.indexOf('{'),raw.lastIndexOf('}')+1))
      if (data.plays) setFbRec(data.plays.map((p,i) => ({n:String(i+1),top:i===0,name:p.name,why:p.why,pct:p.confidence})))
    } catch(e) {}
    setFbLoading(false)
  }

  async function getBbRec() {
    setBbLoading(true)
    try {
      const raw = await callAI(
        'You are a basketball coach. Situation: ' + quarter + ' quarter, score ' + bbScore +
        ', ' + possession + ', shot clock ' + shotClock + ', ' + fouls + ', ' + timeouts +
        '. Give 3 specific play call recommendations for this exact situation. Return ONLY valid JSON: ' +
        '{"calls":[{"name":"play or action name","why":"specific tactical reason","urgency":"HIGH or MED or LOW"},' +
        '{"name":"name","why":"reason","urgency":"level"},' +
        '{"name":"name","why":"reason","urgency":"level"}]}'
      )
      const s = raw.replace(/```[^`]*```/g,'').trim()
      const data = JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1))
      setBbRec(data)
    } catch(e) {}
    setBbLoading(false)
  }

  async function getBsbRec() {
    setBsbLoading(true)
    try {
      const raw = await callAI(
        'You are a baseball manager. Situation: ' + halfInning + ' of ' + inning + ' inning, ' +
        outs + ' out(s), count: ' + balls + '-' + strikes + ', ' + runners +
        '. Give 3 specific strategic recommendations for this at-bat situation. Return ONLY valid JSON: ' +
        '{"moves":[{"action":"specific action","reason":"why this makes sense now","type":"OFFENSE or DEFENSE or PITCHING"},' +
        '{"action":"action","reason":"reason","type":"type"},' +
        '{"action":"action","reason":"reason","type":"type"}]}'
      )
      const s = raw.replace(/```[^`]*```/g,'').trim()
      const data = JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1))
      setBsbRec(data)
    } catch(e) {}
    setBsbLoading(false)
  }

  const statBox = (label, value, onChange, opts) => (
    <div key={label} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px' }}>
      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#3d4559', fontWeight:600, marginBottom:3 }}>{label}</div>
      {opts ? (
        <select value={value} onChange={e=>onChange(e.target.value)} style={{ background:'transparent', border:'none', color:'#f2f4f8', fontFamily:"'Bebas Neue',sans-serif", fontSize:18, outline:'none', width:'100%', cursor:'pointer' }}>
          {opts.map(o => <option key={o} style={{background:'#161922'}}>{o}</option>)}
        </select>
      ) : (
        <input value={value} onChange={e=>onChange(e.target.value)} style={{ background:'transparent', border:'none', color:'#f2f4f8', fontFamily:"'Bebas Neue',sans-serif", fontSize:18, outline:'none', width:'100%' }} />
      )}
    </div>
  )

  if (isFB) return (
    <Card>
      <CardHead icon="🎯" title="Situational Play Caller" tag="REAL-TIME" tagColor={S} accent={S} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:11 }}>
          {statBox('Down', down, setDown, ['1st','2nd','3rd','4th'])}
          {statBox('Distance', distance, setDistance, ['1','2','3','4','5','6','7','8','9','10','12','15','20+'])}
          {statBox('Field Position', fieldPos, setFieldPos)}
          {statBox('Score', score, setScore, ['UP 1','UP 3','UP 7','UP 10','TIED','DOWN 1','DOWN 3','DOWN 7','DOWN 10'])}
          {statBox('Time Left', timeLeft, setTimeLeft)}
          <div style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <button onClick={getFbRec} disabled={fbLoading} style={{ background:fbLoading?'#3d4559':P, border:'none', borderRadius:6, color:'white', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, padding:'6px 14px', cursor:fbLoading?'not-allowed':'pointer', width:'100%' }}>{fbLoading ? 'THINKING...' : 'GET RECS'}</button>
          </div>
        </div>
        {fbRec.map(r => (
          <div key={r.n} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:23, width:22, textAlign:'center', lineHeight:1, color:r.top?P:'#6b7a96' }}>{r.n}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{r.name}</div><div style={{ fontSize:11, color:'#6b7a96', marginTop:2 }}>{r.why}</div></div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:r.top?P:'#6b7a96' }}>{r.pct}</div>
          </div>
        ))}
      </div>
    </Card>
  )

  if (isBB) return (
    <Card>
      <CardHead icon="🏀" title="Live Game Adjustments" tag="IN-GAME" tagColor={S} accent={S} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7, marginBottom:11 }}>
          {statBox('Quarter', quarter, setQuarter, ['1st','2nd','3rd','4th','OT'])}
          {statBox('Score', bbScore, setBbScore, ['UP 1','UP 3','UP 5','UP 8','UP 10','TIED','DOWN 1','DOWN 3','DOWN 5','DOWN 8','DOWN 10'])}
          {statBox('Possession', possession, setPossession, ['Offense','Defense','After Timeout','After Made Basket','Inbound'])}
          {statBox('Shot Clock', shotClock, setShotClock, ['24s','20s','14s','10s','7s','Under 5s','Off'])}
          {statBox('Team Fouls', fouls, setFouls, ['0 fouls','1 foul','2 fouls','3 fouls','4 fouls','Bonus','Double Bonus'])}
          {statBox('Timeouts', timeouts, setTimeouts, ['3 remaining','2 remaining','1 remaining','None left'])}
        </div>
        <button onClick={getBbRec} disabled={bbLoading} style={{ width:'100%', background:bbLoading?'#3d4559':S, border:'none', borderRadius:8, color:'white', fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:2, padding:'11px', cursor:bbLoading?'not-allowed':'pointer', marginBottom:11 }}>{bbLoading ? 'THINKING...' : '⚡ GET COACHING CALLS'}</button>
        {bbRec && bbRec.calls && (
          <>
            <div style={{ background:al(S,0.1), border:`2px solid ${S}`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:S, fontWeight:700, marginBottom:6 }}>Primary Call — Best Option Now</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#f2f4f8' }}>{bbRec.calls[0].name}</div>
                <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:4, background:bbRec.calls[0].urgency==='HIGH'?al(P,0.25):al(S,0.2), color:bbRec.calls[0].urgency==='HIGH'?P:S }}>{bbRec.calls[0].urgency}</span>
              </div>
              <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{bbRec.calls[0].why}</div>
            </div>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:8 }}>Also Consider</div>
            {bbRec.calls.slice(1).map((c,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, width:20, textAlign:'center', lineHeight:1, color:'#6b7a96', marginTop:2, flexShrink:0 }}>{i+2}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{c.name}</div>
                    <span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background:c.urgency==='HIGH'?al(P,0.2):al(S,0.15), color:c.urgency==='HIGH'?P:S }}>{c.urgency}</span>
                  </div>
                  <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.4 }}>{c.why}</div>
                </div>
              </div>
            ))}
          </>
        )}
        {!bbRec && !bbLoading && <div style={{ fontSize:11, color:'#6b7a96', textAlign:'center', padding:'10px 0' }}>Set the game situation above and get AI coaching recommendations.</div>}
      </div>
    </Card>
  )

  if (isBSB) return (
    <Card>
      <CardHead icon="⚾" title="Count & Situation Manager" tag="AT-BAT" tagColor={S} accent={S} />
      <div style={{ padding:14 }}>
        {/* Count display */}
        <div style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:10, padding:'12px 14px', marginBottom:11 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', marginBottom:4 }}>Balls</div>
              <div style={{ display:'flex', gap:5 }}>
                {[0,1,2,3].map(i => <div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(balls)?'#4ade80':'#1e2330', border:'1px solid #3d4559' }} />)}
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', marginBottom:4 }}>Strikes</div>
              <div style={{ display:'flex', gap:5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(strikes)?P:'#1e2330', border:'1px solid #3d4559' }} />)}
              </div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', marginBottom:4 }}>Outs</div>
              <div style={{ display:'flex', gap:5 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(outs)?'#f59e0b':'#1e2330', border:'1px solid #3d4559' }} />)}
              </div>
            </div>
          </div>
          {/* Baseball diamond runner indicator */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
            <div style={{ position:'relative', width:80, height:80 }}>
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%) rotate(45deg)', width:50, height:50, border:'1px solid #3d4559' }} />
              {[['2nd',{top:2,left:'50%',transform:'translateX(-50%)'}],['3rd',{top:'50%',left:2,transform:'translateY(-50%)'}],['1st',{top:'50%',right:2,transform:'translateY(-50%)'}],['HP',{bottom:2,left:'50%',transform:'translateX(-50%)'}]].map(([base,style]) => {
                const active = runners.includes(base==='HP'?'Batter':base)
                return <div key={base} style={{ position:'absolute', width:14, height:14, background:active?P:'#1e2330', border:`1px solid ${active?P:'#3d4559'}`, borderRadius:2, ...style }} />
              })}
            </div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:11 }}>
          {statBox('Inning', inning, setInning, ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','Extra'])}
          {statBox('Half', halfInning, setHalfInning, ['Top','Bottom'])}
          {statBox('Balls', balls, setBalls, ['0','1','2','3'])}
          {statBox('Strikes', strikes, setStrikes, ['0','1','2'])}
          {statBox('Outs', outs, setOuts, ['0','1','2'])}
          {statBox('Runners', runners, setRunners, ['Bases Empty','Runner on 1st','Runner on 2nd','Runner on 3rd','1st & 2nd','1st & 3rd','2nd & 3rd','Bases Loaded'])}
        </div>
        <button onClick={getBsbRec} disabled={bsbLoading} style={{ width:'100%', background:bsbLoading?'#3d4559':S, border:'none', borderRadius:8, color:'white', fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:2, padding:'11px', cursor:bsbLoading?'not-allowed':'pointer', marginBottom:11 }}>{bsbLoading ? 'THINKING...' : '⚡ GET STRATEGIC MOVES'}</button>
        {bsbRec && bsbRec.moves && (
          <>
            {/* Primary recommendation - highlighted */}
            <div style={{ background:al(P,0.08), border:`2px solid ${P}`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:P, fontWeight:700, marginBottom:6 }}>Primary Move — Best Option Here</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#f2f4f8', marginBottom:4 }}>{bsbRec.moves[0].action}</div>
              <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5, marginBottom:6 }}>{bsbRec.moves[0].reason}</div>
              <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:4, background:al(S,0.25), color:S }}>{bsbRec.moves[0].type}</span>
            </div>
            {/* Secondary options */}
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:8 }}>Also Consider</div>
            {bsbRec.moves.slice(1).map((m,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, width:20, textAlign:'center', lineHeight:1, color:'#6b7a96', marginTop:2, flexShrink:0 }}>{i+2}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{m.action}</div>
                    <span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background:'rgba(107,154,255,0.15)', color:'#6b9fff' }}>{m.type}</span>
                  </div>
                  <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.4 }}>{m.reason}</div>
                </div>
              </div>
            ))}
          </>
        )}
        {!bsbRec && !bsbLoading && <div style={{ fontSize:11, color:'#6b7a96', textAlign:'center', padding:'10px 0' }}>Set the count and situation above and get manager recommendations.</div>}
      </div>
    </Card>
  )

  return null
}

// -- HOME PAGE --
function HomePage({ P, S, al, dk, lastName, sport, sportColors, schemes, iq, gauntlets, callAI, parseJSON, onScheme, playbook, setPlaybook, schemeResult, setSchemeResult, schemeFields, setSchemeFields, schemeSport, setSchemeSport, genHistory, setGenHistory }) {
  const SC = sportColors?.[sport] || { primary: P, secondary: S }
  const sportEmoji = sport==='Football' ? '🏈' : sport==='Basketball' ? '🏀' : '⚾'
  const fieldColor = sport==='Football' ? '#1a3a12' : sport==='Basketball' ? '#7a4a1a' : '#1a3a0a'

  // Feed state
  const [feed, setFeed] = useState(null)
  const [feedLoading, setFeedLoading] = useState(false)

  // Scheme gen state (inline, no separate component)
  const cfg = SPORTS[sport] || SPORTS.Football
  const initFields = () => { const f={}; cfg.fields.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [fields, setFields] = useState(() => (schemeSport===sport && schemeFields) ? schemeFields : initFields())
  const [prevSport, setPrevSport] = useState(sport)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState((schemeSport===sport && schemeResult) ? schemeResult : null)
  const [error, setError] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [activeMode, setActiveMode] = useState('dashboard') // 'dashboard' | 'schemes' | 'defense' | 'situational'

  if (sport !== prevSport) {
    setPrevSport(sport)
    setFields((schemeSport===sport && schemeFields) ? schemeFields : initFields())
    setResult((schemeSport===sport && schemeResult) ? schemeResult : null)
    setError('')
    setFeed(null)
    setActiveMode('dashboard')
  }

  useEffect(() => {
    if (!feed && !feedLoading) loadFeed()
  }, [sport])

  async function loadFeed() {
    setFeedLoading(true)
    try {
      const raw = await callAI(
        'You are a sports coaching knowledge curator. Generate a daily coaching feed for a youth ' + sport + ' coach. ' +
        'Include real, proven concepts from notable coaches and sports science. Do NOT plagiarize — rewrite all concepts in your own words and credit the source coach or institution by name. ' +
        'Return ONLY valid JSON: {"items":[' +
        '{"type":"drill","title":"Drill of the Day","body":"describe a specific proven drill in 2 sentences, mention the coach or program it comes from","source":"coach or program name"},' +
        '{"type":"science","title":"Coaching Science","body":"a real sports science finding relevant to youth ' + sport + ' in 2 sentences, mention the study or institution","source":"institution or researcher"},' +
        '{"type":"concept","title":"Concept Spotlight","body":"explain a famous ' + sport + ' scheme or philosophy from a noted coach, applied to youth coaching in 2 sentences","source":"coach name"}' +
        ']}'
      )
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      const data = JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1))
      setFeed(data)
    } catch(e) { setFeed({ items: [] }) }
    setFeedLoading(false)
  }

  async function generate() {
    setLoading(true); setResult(null); setError('')
    try {
      const activeCfg = SPORTS[sport] || SPORTS.Football
      const raw = await callAI(activeCfg.buildPrompt(fields))
      const data = parseJSON(raw)
      if (!data.plays) throw new Error('No plays in response')
      // Save to generation history (auto, silent)
      const historyEntry = { ...data, _sport: sport, _inputs: Object.entries(fields).map(([k,v])=>v).join(' · '), _ts: Date.now() }
      setGenHistory(prev => ({ ...prev, [sport]: [historyEntry, ...(prev[sport]||[])].slice(0,20) }))
      setResult(data)
      setSchemeResult(data); setSchemeFields(fields); setSchemeSport(sport)
      if (onScheme) onScheme()
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  function saveToPlaybook() {
    if (!result) return
    const entry = { ...result, _sport: sport, _inputs: Object.entries(fields).map(([k,v])=>v).join(' · '), _savedAt: Date.now() }
    setPlaybook(pb => ({ ...pb, [sport]: [...(pb[sport]||[]), entry] }))
  }
  const isAlreadySaved = result && (playbook[sport]||[]).some(p => p.packageName === result.packageName && p._inputs === Object.entries(fields).map(([k,v])=>v).join(' · '))

  const feedTypeColor = (t) => t==='drill' ? P : t==='science' ? '#6b9fff' : '#4ade80'
  const feedTypeLabel = (t) => t==='drill' ? 'Drill of the Day' : t==='science' ? 'Coaching Science' : 'Concept Spotlight'
  const sportHistory = (genHistory[sport]||[])

  // DASHBOARD VIEW
  if (activeMode === 'dashboard') return (
    <>
      {/* Team hero band — diagonal cut bottom edge */}
      <div style={{ position:'relative', overflow:'hidden', marginBottom:0, borderRadius:4 }}>
        <div style={{ background:`linear-gradient(135deg,${dk(P,50)} 0%,${P} 100%)`, padding:'14px 16px 26px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-10, bottom:-15, fontSize:90, opacity:0.08, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>{sportEmoji}</div>
          <div style={{ position:'absolute', bottom:-1, left:0, right:0, height:18, background:'#07090d', clipPath:'polygon(0 100%,100% 0,100% 100%)' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>{cfg.team}</div>
            <div style={{ fontFamily:"'Sacramento',cursive", fontSize:22, color:'white', letterSpacing:'-0.5px', lineHeight:1.1, marginBottom:10 }}>Coach {lastName}</div>
            <div style={{ display:'flex', gap:7 }}>
              {[[schemes,'Schemes'],[iq,'IQ'],[(playbook[sport]||[]).length,'Saved']].map(([v,l]) => (
                <div key={l} style={{ background:'rgba(0,0,0,0.3)', padding:'6px 10px', flex:1, clipPath:'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)' }}>
                  <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:18, color:'white', lineHeight:1 }}>{v}</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'1px', marginTop:1 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live ticker */}
      <div style={{ background:'#0a0c14', display:'flex', alignItems:'center', overflow:'hidden', borderTop:'1px solid #0e1220', borderBottom:'1px solid #0e1220', height:26 }}>
        <div style={{ background:P, padding:'0 8px 0 10px', height:'100%', display:'flex', alignItems:'center', flexShrink:0, clipPath:'polygon(0 0,100% 0,calc(100% - 6px) 100%,0 100%)', paddingRight:14 }}>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, color:'white', letterSpacing:'1.5px' }}>LIVE</span>
        </div>
        <div style={{ overflow:'hidden', flex:1 }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4a5470', whiteSpace:'nowrap', animation:'ticker 28s linear infinite', letterSpacing:'0.5px' }}>
            {feed && feed.items && feed.items.length > 0
              ? feed.items.map(i=>`${i.title}: ${i.body}`).join(' · ')
              : `🏈 Tennessee Rip drill eliminates hesitation · 🧠 NSCA: 15-min focused reps beat 60-min mixed sessions · ${sport} coaching intelligence live`}
          </div>
        </div>
      </div>

      {/* Tools section */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}>
          <div style={{ width:3, height:12, background:P, transform:'skewX(-15deg)', flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:'2px', textTransform:'uppercase', color:'#3a4260' }}>TOOLS</span>
        </div>

        {/* SCHEMES — hero card, gradient fill, most visual weight */}
        <div
          onClick={() => setActiveMode('schemes')}
          style={{ background:'linear-gradient(135deg,#1a0404,#1e0808)', border:'1px solid rgba(192,57,43,0.25)', borderRadius:4, padding:'13px 14px', cursor:'pointer', position:'relative', overflow:'hidden' }}
        >
          <div style={{ position:'absolute', bottom:-10, right:-10, fontSize:60, opacity:0.06, lineHeight:1, pointerEvents:'none' }}>📋</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:32, height:32, background:'rgba(192,57,43,0.15)', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>📋</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:'#dde1f0', letterSpacing:'0.5px' }}>Schemes</div>
              <div style={{ fontSize:9, color:'rgba(192,57,43,0.65)', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.5px' }}>Offense + Defense</div>
            </div>
            <div style={{ background:'rgba(192,57,43,0.9)', padding:'3px 10px', clipPath:'polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)' }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, color:'white', letterSpacing:'1px' }}>OPEN</span>
            </div>
          </div>
          {/* Play chips */}
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
            {(result?.plays?.slice(0,2) || []).map((p,i) => (
              <span key={i} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, padding:'2px 7px', background:'rgba(192,57,43,0.12)', borderLeft:'2px solid #C0392B', color:'#C0392B', letterSpacing:'0.5px' }}>{p.name}</span>
            ))}
            {(!result || !result.plays) && (
              <>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, padding:'2px 7px', background:'rgba(192,57,43,0.12)', borderLeft:'2px solid #C0392B', color:'#C0392B' }}>Belly Handoff</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, padding:'2px 7px', background:'#0a0c14', borderLeft:'2px solid #1c2235', color:'#6b7896' }}>Sweep Right</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, padding:'2px 7px', background:'#0a0c14', borderLeft:'2px solid #1c2235', color:'#3a4260' }}>+tap to generate</span>
              </>
            )}
          </div>
          {/* Mini diagram preview */}
          <div style={{ background:'rgba(0,0,0,0.35)', borderRadius:3, padding:'7px 10px', display:'flex', alignItems:'center', gap:9 }}>
            <svg width="42" height="26" viewBox="0 0 42 26">
              <line x1="0" y1="13" x2="42" y2="13" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
              <circle cx="21" cy="16" r="3" fill={P}/>
              <circle cx="11" cy="16" r="2" fill={P} opacity="0.5"/>
              <circle cx="31" cy="16" r="2" fill={P} opacity="0.5"/>
              <path d="M21 16 L21 6" stroke={P} strokeWidth="1.5" opacity="0.7"/>
              <path d="M11 16 L7 8" stroke={P} strokeWidth="1" opacity="0.4"/>
              <path d="M31 16 L35 8" stroke={P} strokeWidth="1" opacity="0.4"/>
            </svg>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:P, fontWeight:700, letterSpacing:'0.5px' }}>AI Diagrams included</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'#3a4260', letterSpacing:'0.3px' }}>Animated plays + educator mode</div>
            </div>
          </div>
        </div>

        {/* GAUNTLET + SITUATIONAL — compact 2-col row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <div onClick={() => setActiveMode('gauntlet')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'11px 12px', cursor:'pointer' }}>
            <div style={{ fontSize:15, marginBottom:6 }}>⚡</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0', marginBottom:6, letterSpacing:'0.5px' }}>Gauntlet</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, marginBottom:3 }}>
              <span style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:22, color:'#f59e0b', lineHeight:1 }}>{iq}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'#3a4260', textTransform:'uppercase' }}>IQ</span>
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4ade80', letterSpacing:'0.5px' }}>🔥 {gauntlets} streak</div>
          </div>
          <div onClick={() => setActiveMode('situational')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'11px 12px', cursor:'pointer' }}>
            <div style={{ fontSize:15, marginBottom:6 }}>🎯</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0', marginBottom:6, letterSpacing:'0.5px' }}>Situational</div>
            <div style={{ background:'#0a0c14', borderRadius:3, padding:'5px 7px' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4ade80', fontWeight:700, letterSpacing:'0.5px' }}>
                {sport==='Basketball' ? 'Q3 · UP 4' : sport==='Baseball' ? '5th · 1 out' : '3rd & 5'}
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'#6b7896', marginTop:1 }}>
                {sport==='Basketball' ? 'Half Court Set' : sport==='Baseball' ? 'Runner on 1st' : 'Slot Cross · 84%'}
              </div>
            </div>
          </div>
        </div>

        {/* FILM ROOM — slim single row */}
        <div onClick={() => setActiveMode('film')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'11px 14px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
          <div style={{ fontSize:15 }}>🎥</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0', letterSpacing:'0.5px' }}>Film Room</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4a5470', letterSpacing:'0.3px' }}>Describe · Upload · AI Diagnose</div>
          </div>
          <div style={{ fontSize:11, color:'#3a4260' }}>›</div>
        </div>

      </div>

      {/* Coaching Feed */}
      <div style={{ marginTop:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <div style={{ width:3, height:12, background:'#4ade80', transform:'skewX(-15deg)', flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:'2px', textTransform:'uppercase', color:'#4ade80' }}>Coaching Feed</span>
          <button onClick={loadFeed} style={{ marginLeft:'auto', fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#6b7a96', background:'transparent', border:'0.5px solid #1e2330', borderRadius:2, padding:'2px 8px', cursor:'pointer', letterSpacing:'0.5px' }}>Refresh</button>
        </div>
        {feedLoading && <div style={{ padding:'16px', background:'#0f1219', borderRadius:4, border:'0.5px solid #1e2330', textAlign:'center' }}><div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 6px' }} /><div style={{ fontSize:11, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif" }}>Loading {sport} coaching content...</div></div>}
        {feed && (feed.items||[]).map((item,i) => (
          <div key={i} style={{ background:'#0f1219', border:'0.5px solid #1e2330', borderRadius:4, padding:'10px 12px', marginBottom:7, borderLeft:`2px solid ${feedTypeColor(item.type)}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, color:feedTypeColor(item.type), textTransform:'uppercase', letterSpacing:'1px' }}>{feedTypeLabel(item.type)}</span>
              {item.source && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'#3d4559' }}>· {item.source}</span>}
            </div>
            <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{item.body}</div>
          </div>
        ))}
      </div>

      {/* Generation History */}
      {sportHistory.length > 0 && (
        <div style={{ marginTop:6 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8, cursor:'pointer' }} onClick={() => setShowHistory(h=>!h)}>
            <div style={{ width:3, height:12, background:'#3a4260', transform:'skewX(-15deg)', flexShrink:0 }} />
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:'2px', textTransform:'uppercase', color:'#6b7a96', flex:1 }}>Generation History ({sportHistory.length})</span>
            <span style={{ fontSize:11, color:'#6b7a96' }}>{showHistory ? '▲' : '▼'}</span>
          </div>
          {showHistory && sportHistory.map((h,i) => (
            <div key={i} style={{ background:'#0a0c10', border:'0.5px solid #1e2330', borderRadius:4, padding:'10px 12px', marginBottom:6, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0' }}>{h.packageName}</div>
                <div style={{ fontSize:10, color:'#6b7a96', marginTop:1 }}>{h._inputs}</div>
              </div>
              <button onClick={() => { setResult(h); setActiveMode('schemes') }} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, color:P, background:al(P,0.1), border:`0.5px solid ${al(P,0.3)}`, borderRadius:2, padding:'4px 10px', cursor:'pointer', letterSpacing:'1px', whiteSpace:'nowrap' }}>View</button>
            </div>
          ))}
        </div>
      )}
    </>
  )

  // SCHEMES MODE
  if (activeMode === 'schemes') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <button onClick={() => setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport} Scheme Generator</span>
      </div>
      <Card>
        <div style={{ padding:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            {(SPORTS[sport]||SPORTS.Football).fields.map(f => (
              <Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />
            ))}
          </div>
          <PBtn onClick={generate} disabled={loading} color={P}>{loading ? 'GENERATING...' : sport==='Baseball' ? 'GENERATE GAME PLAN' : 'GENERATE SCHEME'}</PBtn>
          {loading && <Shimmer />}
          {error && <ErrBox msg={error} />}
          {result && (
            <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:1, color:P, marginBottom:4 }}>{result.packageName}</div>
              <p style={{ fontSize:12, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>{result.summary}</p>
              {(result.plays||[]).map(p => <PlayCard key={p.number} play={p} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} />)}
              {result.defenseTip && <div style={{ marginTop:10, padding:10, background:'#0f1117', borderRadius:8, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Defense Tip</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{result.defenseTip}</div></div>}
              {result.coachingCue && <div style={{ marginTop:8, padding:10, background:al(P,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Coaching Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic', fontWeight:500 }}>"{result.coachingCue}"</div></div>}
              {/* SAVE BUTTON */}
              <div style={{ marginTop:12, display:'flex', gap:8 }}>
                <button onClick={() => { setResult(null); setError('') }} style={{ flex:1, padding:'10px', background:'transparent', border:'0.5px solid #1e2330', borderRadius:8, color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1 }}>REGENERATE</button>
                <button onClick={saveToPlaybook} disabled={isAlreadySaved} style={{ flex:2, padding:'10px', background:isAlreadySaved?'#1a2a1a':P, border:'none', borderRadius:8, color:isAlreadySaved?'#4ade80':'white', fontSize:12, fontWeight:600, cursor:isAlreadySaved?'default':'pointer', fontFamily:"'Bebas Neue',sans-serif", letterSpacing:1 }}>
                  {isAlreadySaved ? '✓ SAVED TO PLAYBOOK' : 'SAVE TO PLAYBOOK +'}
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  )

  // GAUNTLET MODE (inline from home)
  if (activeMode === 'gauntlet') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <button onClick={() => setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport} Gauntlet</span>
      </div>
      <GauntletPage P={P} S={S} al={al} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} />
    </>
  )

  // FILM MODE (inline from home)
  if (activeMode === 'film') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <button onClick={() => setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>Film Room</span>
      </div>
      <FilmPage P={P} S={S} al={al} dk={dk} sport={sport} callAI={callAI} parseJSON={parseJSON} />
    </>
  )

  // DEFENSE MODE
  if (activeMode === 'defense') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <button onClick={() => setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport} Defensive Schemes</span>
      </div>
      <DefenseGen sport={sport} P={P} S={'#6b9fff'} al={al} callAI={callAI} parseJSON={parseJSON} inlineMode={true} />
    </>
  )

  // SITUATIONAL MODE
  if (activeMode === 'situational') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
        <button onClick={() => setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>
          {sport==='Football' ? 'Situational Play Caller' : sport==='Basketball' ? 'Live Game Adjustments' : 'Count & Situation Manager'}
        </span>
      </div>
      <SituationalPanel sport={sport} P={P} S={S} al={al} callAI={callAI} />
    </>
  )

  return null
}


function GauntletPage({ P, S, al, sport, iq, setIQ, gauntlets, setGauntlets, callAI, parseJSON }) {
  const [diff, setDiff] = useState('varsity')
  const [loading, setLoading] = useState(false)
  const [scenario, setScenario] = useState(null)
  const [error, setError] = useState('')
  const [picked, setPicked] = useState(null)
  const [streak, setStreak] = useState([])
  const [coordStarted, setCoordStarted] = useState(false)
  const [coordSide, setCoordSide] = useState('offense')
  const [coordPlan, setCoordPlan] = useState('')
  const [coordMsgs, setCoordMsgs] = useState([])
  const [coordLoading, setCoordLoading] = useState(false)
  const [coordQ, setCoordQ] = useState(1)
  const [reply, setReply] = useState('')
  const chatRef = useRef(null)

  useEffect(() => { loadScenario() }, [sport])
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [coordMsgs])

  const cfg = SPORTS[sport] || SPORTS.Football

  async function loadScenario() {
    setLoading(true); setScenario(null); setError(''); setPicked(null)
    const cfg = SPORTS[sport] || SPORTS.Football
    try {
      const raw = await callAI(cfg.scenarioPrompt(diff))
      const data = parseJSON(raw)
      if (!data.question || !data.options) throw new Error('Incomplete scenario')
      setScenario(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  function pick(opt) {
    if (picked) return
    setPicked(opt.letter)
    const ok = opt.correct === true
    setStreak(prev => { const n=[...prev,ok?'ok':'bad']; return n.length>5?n.slice(-5):n })
    setIQ(v => Math.max(0,Math.min(999,v+(ok?5:-3))))
    if (ok) setGauntlets(g=>g+1)
  }

  async function startMatchup() {
    if (!coordPlan.trim()) { alert('Describe your game plan first.'); return }
    setCoordLoading(true)
    const msgs = [{ role:'user', content:coordPlan, lbl:'Your Game Plan' }]
    setCoordMsgs(msgs)
    setCoordStarted(true)
    const matchupRole = sport==='Baseball' ? 'manager' : sport==='Basketball' ? 'head coach' : 'coordinator'
    const oppSide = coordSide==='offense' ? (sport==='Baseball'?'pitching/defense':sport==='Basketball'?'defense':'DEFENSE') : (sport==='Baseball'?'batting/offense':sport==='Basketball'?'offense':'OFFENSE')
    const prompt = `You are an elite opposing ${sport} ${matchupRole}. The coach described their ${coordSide} game plan: "${coordPlan}". You handle the ${oppSide} side. Use ${sport}-specific terminology only - no football terms if this is basketball or baseball. Tell them specifically how you will stop or exploit their approach. Under 150 words. End with a specific challenge.`
    try {
      const raw = await callAI(prompt)
      setCoordMsgs([...msgs, { role:'ai', content:raw, lbl:'Q1 - Opposing Coordinator' }])
    } catch(e) { setCoordMsgs([...msgs, { role:'error', content:'Error: '+e.message }]) }
    setCoordLoading(false)
  }

  async function sendReply() {
    if (!reply.trim()) return
    const newMsgs = [...coordMsgs, { role:'user', content:reply, lbl:'Your Adjustment' }]
    setCoordMsgs(newMsgs)
    setReply('')
    setCoordLoading(true)
    const newQ = newMsgs.filter(m=>m.role==='ai').length % 2 === 0 && coordQ < 4 ? coordQ+1 : coordQ
    setCoordQ(newQ)
    const history = newMsgs.map(m=>(m.role==='user'?'COACH: ':'OPPOSING COORDINATOR: ')+m.content).filter(Boolean).join('\n\n')
    const replyRole = sport==='Baseball' ? 'manager' : sport==='Basketball' ? 'head coach' : 'coordinator'
    const prompt = 'You are an elite opposing ' + sport + ' ' + replyRole + '. Conversation:\n\n' + history + '\n\nMake a counter-adjustment using only ' + sport + ' terminology. Under 150 words. End with a challenge.'
    try {
      const raw = await callAI(prompt)
      setCoordMsgs(prev => [...prev, { role:'ai', content:raw, lbl:'Q'+newQ+' - Opposing '+replyRole }])
    } catch(e) { setCoordMsgs(prev => [...prev, { role:'error', content:'Error: '+e.message }]) }
    setCoordLoading(false)
  }

  return (
    <>
      <Hero greet={sport==='Baseball'?'Test Your Manager IQ':sport==='Basketball'?'Test Your Coaching IQ':'Test Your Coaching IQ'} left="Gauntlet" right="Mode" P={P} S={S} dk={c=>c} />

      {/* SCENARIO */}
      <Card>
        <CardHead icon="VS" title="AI Scenario Challenge" tag={`${cfg.emoji} ${sport.toUpperCase()}`} tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <span style={{ fontSize:10, color:'#3d4559', letterSpacing:1, textTransform:'uppercase' }}>Difficulty</span>
            <div style={{ display:'flex', gap:5 }}>
              {['rookie','varsity','elite'].map(d => (
                <button key={d} onClick={() => setDiff(d)} style={{ padding:'4px 10px', borderRadius:12, fontSize:10, fontWeight:700, border:`1px solid ${diff===d?S:'#1e2330'}`, color:diff===d?'white':'#6b7a96', background:diff===d?S:'transparent', cursor:'pointer', fontFamily:'inherit' }}>{d.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:10, color:'#6b7a96' }}>Streak</span>
            <div style={{ display:'flex', gap:4 }}>
              {Array(5).fill(0).map((_,i) => <div key={i} style={{ width:10, height:10, borderRadius:'50%', background:streak[i]==='ok'?'#4ade80':streak[i]==='bad'?P:'#1e2330', transition:'background 0.3s' }} />)}
            </div>
          </div>
          <div style={{ background:`linear-gradient(135deg,${al(S,0.12)},${al(P,0.1)})`, border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:13, marginBottom:12, minHeight:90 }}>
            {loading && <div style={{ fontSize:12, color:'#6b7a96' }}>Generating your scenario...</div>}
            {error && <div style={{ fontSize:12, color:'#6b7a96' }}>Error: {error}</div>}
            {scenario && !loading && (
              <>
                <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:9, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', background:al(P,0.15), color:P, padding:'2px 7px', borderRadius:4 }}>{cfg.emoji} {scenario.phase}</span>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:'#6b7a96' }}>{scenario.situation}</span>
                </div>
                <div style={{ fontSize:13, lineHeight:1.65, color:'#f2f4f8', fontWeight:500 }}>{scenario.question}</div>
              </>
            )}
          </div>
          {scenario && !loading && (scenario.options||[]).map(opt => {
            let extra = {}
            if (picked) {
              if (opt.correct === true) extra = { borderColor:'#4ade80', color:'#4ade80', background:'rgba(74,222,128,0.06)', fontWeight:600 }
              else if (opt.letter === picked) extra = { borderColor:P, color:P, background:al(P,0.1), textDecoration:'line-through' }
              else extra = { opacity:0.35 }
            }
            return (
              <div key={opt.letter} onClick={() => pick(opt)} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'11px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:8, cursor:picked?'default':'pointer', fontSize:13, color:'#6b7a96', lineHeight:1.4, marginBottom:7, ...extra }}>
                <div style={{ width:22, height:22, minWidth:22, border:'1.5px solid currentColor', borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0, marginTop:1 }}>{opt.letter}</div>
                {opt.text}
              </div>
            )
          })}
          {picked && scenario && <div style={{ background:'#0f1117', border:'1px solid #1e2330', borderRadius:8, padding:'11px 12px', marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:5 }}>Coaches Explanation</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{scenario.explanation}</div></div>}
          {error && <PBtn onClick={loadScenario} color={P}>Try Again</PBtn>}
          {!error && scenario && picked && <button onClick={loadScenario} style={{ width:'100%', padding:10, background:'#161922', border:'1px solid #1e2330', borderRadius:8, color:'#6b7a96', fontFamily:'inherit', fontSize:13, fontWeight:600, cursor:'pointer', marginTop:4 }}>Next Scenario</button>}
          {!error && !scenario && !loading && <PBtn onClick={loadScenario} color={P}>Load Scenario</PBtn>}
        </div>
      </Card>

      {/* COORDINATOR MATCHUP */}
      <Card>
        <CardHead icon="VS" title="Coordinator Matchup" tag="LIVE BATTLE" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          {!coordStarted ? (
            <>
              <div style={{ background:al(P,0.08), border:`1px solid ${al(P,0.2)}`, borderRadius:10, padding:12, marginBottom:12 }}>
                <div style={{ fontSize:11, color:P, fontWeight:700, letterSpacing:1, marginBottom:6, textTransform:'uppercase' }}>How It Works</div>
                <div style={{ fontSize:12, color:'#6b7a96', lineHeight:1.6 }}>{sport==='Football' && 'Describe your scheme. An AI opposing coordinator attacks it. You adapt. Keep going as long as you want.'}{sport==='Basketball' && 'Describe your offensive set or defensive scheme. An AI opposing coach counters it. You make adjustments.'}{sport==='Baseball' && 'Describe your pitching approach or offensive game plan. An AI opposing manager counters it. You adapt.'}</div>
              </div>
              <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                {['offense','defense'].map(s => (
                  <button key={s} onClick={() => setCoordSide(s)} style={{ flex:1, padding:9, borderRadius:8, border:`1px solid ${coordSide===s?P:'#1e2330'}`, background:coordSide===s?al(P,0.15):'transparent', color:coordSide===s?P:'#6b7a96', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, cursor:'pointer' }}>
                    {s==='offense'
                      ? (sport==='Baseball'?'BATTING/OFFENSE':sport==='Basketball'?'ON OFFENSE':'ON OFFENSE')
                      : (sport==='Baseball'?'PITCHING/DEFENSE':sport==='Basketball'?'ON DEFENSE':'ON DEFENSE')}
                  </button>
                ))}
              </div>
              <label style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>Describe your {coordSide} game plan</label>
              <textarea value={coordPlan} onChange={e=>setCoordPlan(e.target.value)} placeholder={
                      sport==='Basketball'
                        ? (coordSide==='offense'?'e.g. We run motion offense with 13-year-olds. Our strength is ball movement and the pick and roll...':'e.g. We play man-to-man defense. We want to deny the ball to their best scorer...')
                        : sport==='Baseball'
                        ? (coordSide==='offense'?'e.g. We are a small ball team. We like to move runners with contact hitting and smart baserunning...':'e.g. Our pitcher throws 70% fastballs. We struggle with left-handed hitters...')
                        : (coordSide==='offense'?'e.g. We run a Wing-T with 13-year-olds. Our strength is the buck sweep...':'e.g. We run a 4-3 defense. We plan to stop the run first...')
                    } style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', resize:'vertical', minHeight:90, lineHeight:1.5, marginBottom:10 }} />
              <PBtn onClick={startMatchup} disabled={coordLoading||!coordPlan.trim()} color={P}>{coordLoading?'OPPONENT THINKING...':'START MATCHUP'}</PBtn>
              {coordLoading && <Shimmer />}
            </>
          ) : (
            <>
              <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                <div style={{ flex:1, background:al(P,0.1), border:`1px solid ${al(P,0.2)}`, borderRadius:8, padding:'8px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:9, color:P, letterSpacing:1, textTransform:'uppercase', marginBottom:2 }}>Quarter</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24 }}>Q{coordQ}</div>
                </div>
                <div style={{ flex:1, background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'8px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:9, color:'#6b7a96', letterSpacing:1, textTransform:'uppercase', marginBottom:2 }}>Sport</div>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24 }}>{sport.toUpperCase()}</div>
                </div>
              </div>
              <div ref={chatRef} style={{ maxHeight:350, overflowY:'auto', display:'flex', flexDirection:'column', gap:10, marginBottom:12 }}>
                {coordMsgs.map((m,i) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:m.role==='user'?'flex-end':'flex-start' }}>
                    <div style={{ fontSize:9, color:'#6b7a96', letterSpacing:1, marginBottom:3, textTransform:'uppercase' }}>{m.lbl||''}</div>
                    <div style={{ maxWidth:'85%', padding:'10px 12px', borderRadius:m.role==='user'?'12px 12px 2px 12px':'12px 12px 12px 2px', background:m.role==='user'?al(P,0.15):'rgba(255,68,68,0.08)', border:`1px solid ${m.role==='user'?al(P,0.3):'rgba(255,68,68,0.2)'}`, fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {coordLoading && <div style={{ display:'flex', alignItems:'flex-start' }}><div style={{ padding:'10px 12px', borderRadius:'12px 12px 12px 2px', background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.2)', fontSize:12, color:'#6b7a96' }}>Opponent adjusting...</div></div>}
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <textarea value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&reply.trim()){e.preventDefault();sendReply()}}} placeholder="Describe your adjustment..." style={{ flex:1, background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', resize:'none', minHeight:44, lineHeight:1.5 }} />
                <button onClick={sendReply} disabled={coordLoading||!reply.trim()} style={{ padding:'0 14px', background:coordLoading||!reply.trim()?'#3d4559':P, color:'white', border:'none', borderRadius:8, fontFamily:"'Bebas Neue',sans-serif", fontSize:14, letterSpacing:1, cursor:coordLoading||!reply.trim()?'not-allowed':'pointer', flexShrink:0, opacity:coordLoading||!reply.trim()?0.6:1 }}>SEND</button>
              </div>
              <div style={{ fontSize:10, color:'#6b7a96', marginTop:6, textAlign:'center' }}>Enter to send - Shift+Enter for new line</div>
              <button onClick={()=>{setCoordStarted(false);setCoordMsgs([]);setCoordPlan('');setReply('');setCoordQ(1)}} style={{ width:'100%', marginTop:10, padding:8, background:'transparent', border:'1px solid #1e2330', borderRadius:8, color:'#6b7a96', fontFamily:'inherit', fontSize:12, cursor:'pointer' }}>Start New Matchup</button>
            </>
          )}
        </div>
      </Card>

      {/* IQ SCORE */}
      <Card>
        <CardHead icon="🧠" title={sport==='Baseball'?'Your Manager IQ':sport==='Basketball'?'Your Coach IQ':'Your Coach IQ'} tag="TOP 12%" tagColor={S} accent={S} />
        <div style={{ padding:14 }}>
          <div style={{ background:`linear-gradient(135deg,${al(S,0.12)},${al(P,0.1)})`, borderRadius:10, padding:15, display:'flex', alignItems:'center', gap:13, marginBottom:13 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:68, color:P, letterSpacing:2, lineHeight:1 }}>{iq}</div>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:1 }}>
                {sport==='Basketball'?'Advanced Coach':sport==='Baseball'?'Advanced Manager':'Advanced Coordinator'}
              </div>
              <div style={{ fontSize:11, color:'#6b7a96', marginTop:4, lineHeight:1.5 }}>
                Strongest: Situational IQ<br />
                Improve: {sport==='Basketball'?'Timeout Management':sport==='Baseball'?'Bullpen Strategy':'Halftime Adjustments'}
              </div>
            </div>
          </div>
          {(sport==='Basketball'
            ? [['Play Calling',88,P],['Situational IQ',92,P],['Scheme Knowledge',85,S],['Timeout Management',71,'#6b7a96'],['Opponent Reading',79,S]]
            : sport==='Baseball'
            ? [['Pitch Sequencing',88,P],['Situational IQ',92,P],['Lineup Management',85,S],['Bullpen Strategy',71,'#6b7a96'],['Opponent Reading',79,S]]
            : [['Play Calling',88,P],['Situational IQ',92,P],['Scheme Knowledge',85,S],['Halftime Adjustments',71,'#6b7a96'],['Opponent Reading',79,S]]
          ).map(([l,v,c]) => (
            <div key={l} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <div style={{ fontSize:11, color:'#6b7a96', width:140, flexShrink:0 }}>{l}</div>
              <div style={{ flex:1, height:5, background:'#161922', borderRadius:3, overflow:'hidden' }}><div style={{ height:'100%', borderRadius:3, background:c, width:`${v}%` }} /></div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#f2f4f8', width:24, textAlign:'right' }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

// -- FILM PAGE --
function FilmPage({ P, S, al, dk, sport, callAI, parseJSON }) {
  const [tab, setTab] = useState('describe')
  const [problem, setProblem] = useState('')
  const [pos, setPos] = useState('')
  const [age, setAge] = useState('11-12 yrs')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoNote, setVideoNote] = useState('')
  const [vidResult, setVidResult] = useState(null)
  const [vidError, setVidError] = useState('')
  const [vidLoading, setVidLoading] = useState(false)
  const [imageData, setImageData] = useState(null)

  const cfg = SPORTS[sport] || SPORTS.Football

  async function diagnose() {
    if (!problem.trim()) { alert('Please describe what you are seeing.'); return }
    setLoading(true); setResult(null); setError('')
    const prompt = `You are an elite ${sport} coordinator diagnosing player performance at youth level. Problem with ${pos||cfg.positions[0]} age ${age}: "${problem}". Return ONLY valid JSON: {"rootCause":"1-sentence diagnosis","pattern":"what coach would see on film","fix":"actionable correction","drill":"drill name and description","coachingCue":"exact words to say to player","timeline":"realistic improvement timeline"}`
    try {
      const raw = await callAI(prompt)
      setResult(parseJSON(raw))
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  async function analyzeVideo() {
    if (!imageData) { alert('Please upload a file first.'); return }
    setVidLoading(true); setVidResult(null); setVidError('')
    const focusNote = videoNote.trim() ? `\nCoach focus: ${videoNote}` : ''
    const prompt = `You are an elite ${sport} coaching analyst. Position: ${pos||cfg.positions[0]}, age: ${age}.${focusNote}\n\nAnalyze this footage:\n1. WHAT YOU SEE: Describe the play and key actions\n2. ISSUES IDENTIFIED: Technique or decision problems\n3. STRENGTHS: What is being done well\n4. COACHING PRIORITIES: Top 2-3 things to address at practice\n5. DRILL RECOMMENDATION: One specific drill\n\nBe specific and age-appropriate.`
    try {
      const raw = await callAI(prompt, imageData)
      setVidResult(raw)
    } catch(e) { setVidError(e.message) }
    setVidLoading(false)
  }

  function handleUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setVideoFile(file)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = ev => setImageData({ b64: ev.target.result.split(',')[1], mime: file.type })
      reader.readAsDataURL(file)
    } else {
      const url = URL.createObjectURL(file)
      const video = document.createElement('video')
      video.src = url; video.muted = true
      video.onloadeddata = () => { video.currentTime = Math.min(2, video.duration * 0.25) }
      video.onseeked = () => {
        const canvas = document.createElement('canvas')
        canvas.width = Math.min(video.videoWidth, 1280)
        canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth))
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
        setImageData({ b64: canvas.toDataURL('image/jpeg', 0.85).split(',')[1], mime: 'image/jpeg' })
        URL.revokeObjectURL(url)
      }
    }
  }

  const diagRows = result ? [['Root Cause',result.rootCause],['Pattern',result.pattern],['The Fix',result.fix],['Drill',result.drill],['Coaching Cue',result.coachingCue?`"${result.coachingCue}"`:''],['Timeline',result.timeline]] : []

  return (
    <>
      <Hero greet={sport==='Baseball'?'Break down any situation':sport==='Basketball'?'No film needed':'No camera needed'} left="Film" right={sport==='Baseball'?'Analyzer':'Translator'} P={P} S={S} dk={dk} />
      <Card>
        <CardHead icon="🎥" title={sport==='Baseball'?'Situation Analyzer':sport==='Basketball'?'Film Translator':'Film Translator'} tag="AI DIAGNOSIS" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ display:'flex', borderRadius:8, overflow:'hidden', border:'1px solid #1e2330', marginBottom:12 }}>
            {[['describe', sport==='Baseball'?'SITUATION':'DESCRIBE'],['upload','UPLOAD CLIP']].map(([t,lbl]) => (
              <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:9, background:tab===t?P:'#161922', color:tab===t?'white':'#6b7a96', border:'none', cursor:'pointer', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, transition:'all 0.15s' }}>{lbl}</button>
            ))}
          </div>

          {tab === 'describe' && (
            <>
              <label style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>{sport==='Baseball'?'Describe the situation or player issue':sport==='Basketball'?'Describe what you are seeing':'Describe the problem'}</label>
              <textarea value={problem} onChange={e=>setProblem(e.target.value)} placeholder={sport==='Baseball'?'e.g. My pitcher keeps throwing balls when ahead in the count. His mechanics look off...':sport==='Basketball'?'e.g. My point guard keeps losing the ball on drives to the basket. Not sure if it is handles or decision making...':'e.g. My QB keeps throwing into double coverage on 3rd down...'} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', resize:'vertical', minHeight:72, lineHeight:1.5, marginBottom:10 }} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                <Sel label="Position" value={pos||cfg.positions[0]} onChange={setPos} options={cfg.positions} />
                <Sel label="Age Group" value={age} onChange={setAge} options={['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School']} />
              </div>
              <PBtn onClick={diagnose} disabled={loading} color={P}>{loading?(sport==='Baseball'?'ANALYZING...':'DIAGNOSING...'):(sport==='Baseball'?'ANALYZE SITUATION':'DIAGNOSE')}</PBtn>
              {loading && <Shimmer />}
              {error && <ErrBox msg={error} />}
              {result && (
                <div style={{ marginTop:10, background:'#161922', border:'1px solid rgba(0,40,104,0.4)', borderRadius:10, padding:12, animation:'fadeIn 0.25s ease' }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:1, color:'#6b9fff', marginBottom:10 }}>Film Session Report</div>
                  {diagRows.filter(([,v])=>v).map(([l,v]) => (
                    <div key={l} style={{ display:'flex', gap:8, padding:'7px 0', borderBottom:'1px solid #1e2330', fontSize:12, lineHeight:1.5 }}>
                      <span style={{ color:P, flexShrink:0, fontSize:13, marginTop:1 }}>!</span>
                      <span style={{ color:'#6b7a96' }}><strong style={{ color:'#f2f4f8' }}>{l}:</strong> {v}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'upload' && (
            <>
              <div onClick={()=>document.getElementById('vid-input').click()} style={{ background:'#161922', border:'2px dashed #1e2330', borderRadius:10, padding:20, textAlign:'center', marginBottom:12, cursor:'pointer' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>🎬</div>
                <div style={{ fontSize:13, color:'#f2f4f8', fontWeight:600, marginBottom:4 }}>{videoFile ? videoFile.name : 'Upload a game clip or image'}</div>
                <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.5 }}>Tap to select from your device. AI will analyze the footage.</div>
                <input id="vid-input" type="file" accept="video/*,image/*" onChange={handleUpload} style={{ display:'none' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                <Sel label="Position" value={pos||cfg.positions[0]} onChange={setPos} options={cfg.positions} />
                <Sel label="Age Group" value={age} onChange={setAge} options={['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School']} />
              </div>
              <div style={{ marginBottom:10 }}>
                <label style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>What should AI look for? (optional)</label>
                <textarea value={videoNote} onChange={e=>setVideoNote(e.target.value)} placeholder="e.g. Focus on footwork and read progression..." style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', resize:'none', minHeight:55, lineHeight:1.5 }} />
              </div>
              <PBtn onClick={analyzeVideo} disabled={vidLoading||!imageData} color={P}>{vidLoading?'ANALYZING...':'ANALYZE CLIP'}</PBtn>
              {vidLoading && <Shimmer />}
              {vidError && <ErrBox msg={vidError} />}
              {vidResult && (
                <div style={{ marginTop:10, background:'#161922', border:'1px solid rgba(0,40,104,0.4)', borderRadius:10, padding:12, animation:'fadeIn 0.25s ease' }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:1, color:'#6b9fff', marginBottom:10 }}>Clip Analysis Report</div>
                  <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{vidResult}</div>
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </>
  )
}

// -- SCHEME FOLDER (playbook folder view) --
function SchemeFolder({ scheme, P, S, al, callAI, parseJSON, filterType }) {
  const [open, setOpen] = useState(false)
  const isOffense = !scheme.packageName?.toLowerCase().includes('defense') && !scheme.packageName?.toLowerCase().includes('defensive')
  const icon = isOffense ? '📋' : '🛡'
  const borderColor = isOffense ? P : '#6b9fff'
  const plays = (scheme.plays||[]).filter(p => filterType==='All' || p.type===filterType)

  // Play type summary tags
  const typeCounts = plays.reduce((acc,p) => { acc[p.type||'OTHER'] = (acc[p.type||'OTHER']||0)+1; return acc }, {})

  return (
    <div style={{ marginBottom:10, borderRadius:12, overflow:'hidden', border:`0.5px solid ${al(borderColor,0.3)}` }}>
      {/* Folder header - tap to open */}
      <div onClick={() => setOpen(o=>!o)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:`linear-gradient(135deg,${al(borderColor,0.1)},#0f1117)`, cursor:'pointer' }}>
        <div style={{ width:38, height:38, minWidth:38, background:al(borderColor,0.15), borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8', marginBottom:2 }}>{scheme.packageName}</div>
          <div style={{ fontSize:10, color:'#6b7a96' }}>{scheme._inputs || ''}</div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ fontSize:12, fontWeight:700, color:borderColor }}>{plays.length} plays</div>
          <div style={{ fontSize:11, color:'#6b7a96', marginTop:1 }}>{open ? '▲' : '▼'}</div>
        </div>
      </div>

      {/* Play type badges always visible */}
      {!open && (
        <div style={{ padding:'6px 14px 10px', display:'flex', gap:5, flexWrap:'wrap', background:'#0a0c10' }}>
          {Object.entries(typeCounts).slice(0,4).map(([type,count]) => (
            <span key={type} style={{ fontSize:9, padding:'2px 7px', background:'#1e2330', color:'#6b7a96', borderRadius:4 }}>{type} ×{count}</span>
          ))}
        </div>
      )}

      {/* Expanded plays */}
      {open && (
        <div style={{ background:'#08090d', borderTop:`0.5px solid ${al(borderColor,0.15)}` }}>
          {plays.map((p, pi) => (
            <PlaybookCard key={pi} play={{...p, number:p.number||pi+1}} packageName={scheme.packageName} packageIndex={scheme.packageIndex} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} />
          ))}
          {plays.length === 0 && <div style={{ padding:'12px 14px', fontSize:11, color:'#6b7a96', textAlign:'center' }}>No plays match this filter.</div>}
        </div>
      )}
    </div>
  )
}

// -- PLAYBOOK PAGE (tab 2) --
function PlaybookPage({ P, S, al, dk, cfg, setCfg, playbook, sport, callAI, parseJSON }) {
  const [sortBy, setSortBy] = useState('recent')
  const [filterType, setFilterType] = useState('All')
  const sportSchemes = (playbook?.[sport] || [])
  const byPackage = sportSchemes.map((scheme, idx) => ({
    ...scheme, packageIndex: idx + 1,
    plays: (scheme.plays||[]).map(p => ({ ...p, packageName: scheme.packageName, packageIndex: idx+1, schemeInputs: scheme._inputs || '' }))
  }))
  const allPlayItems = byPackage.flatMap(s => s.plays)
  const typeOptions = ['All', ...new Set(allPlayItems.map(p => p.type).filter(Boolean))]
  const filteredByPackage = byPackage.filter(scheme =>
    filterType === 'All' || (scheme.plays||[]).some(p => p.type === filterType)
  )

  return (
    <>
      {/* Header band */}
      <div style={{ position:'relative', overflow:'hidden', borderRadius:4 }}>
        <div style={{ background:`linear-gradient(135deg,${dk(P,50)} 0%,${P} 100%)`, padding:'14px 16px 26px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-10, bottom:-15, fontSize:90, opacity:0.08, lineHeight:1, userSelect:'none', pointerEvents:'none' }}>📖</div>
          <div style={{ position:'absolute', bottom:-1, left:0, right:0, height:18, background:'#07090d', clipPath:'polygon(0 100%,100% 0,100% 100%)' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>{sport} Playbook</div>
            <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:28, color:'white', lineHeight:1, marginBottom:8 }}>{allPlayItems.length} <span style={{ fontSize:16, fontWeight:500, opacity:0.7 }}>plays · {sportSchemes.length} packages</span></div>
          </div>
        </div>
      </div>

      {sportSchemes.length === 0 ? (
        <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'32px 20px', textAlign:'center', marginTop:8 }}>
          <div style={{ fontSize:32, marginBottom:12 }}>📖</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, letterSpacing:'1px', marginBottom:8, textTransform:'uppercase' }}>No {sport} Schemes Saved</div>
          <div style={{ fontSize:12, color:'#6b7a96', lineHeight:1.6 }}>Generate a scheme on the Home tab and tap "Save to Playbook" to build your collection.</div>
        </div>
      ) : (
        <>
          <div style={{ display:'flex', gap:8, marginTop:8, marginBottom:10, flexWrap:'wrap' }}>
            <div style={{ flex:1, minWidth:120 }}>
              <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Sort</label>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
                <option value="package">By Package</option>
                <option value="name">Name A-Z</option>
                <option value="type">Play Type</option>
              </select>
            </div>
            <div style={{ flex:1, minWidth:120 }}>
              <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Filter</label>
              <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
                {typeOptions.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          {filteredByPackage.map((scheme, si) => (
            <SchemeFolder key={si} scheme={scheme} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} filterType={filterType} />
          ))}
        </>
      )}
    </>
  )
}

// -- MORE PAGE (tab 3) --
function MorePage({ P, S, al, dk, cfg, setCfg, playbook, sport, callAI, parseJSON }) {
  const [moreTab, setMoreTab] = useState('features')

  return (
    <>
      <Hero greet="Everything else" left="More" right="Tools" P={P} S={S} dk={dk} />

      {/* Sub tabs */}
      <div style={{ display:'flex', borderRadius:4, overflow:'hidden', border:'1px solid #1e2330' }}>
        {[['features','Features'],['settings','Settings']].map(([t,lbl]) => (
          <button key={t} onClick={()=>setMoreTab(t)} style={{ flex:1, padding:'10px', background:moreTab===t?P:'#161922', color:moreTab===t?'white':'#6b7a96', border:'none', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'1.5px', textTransform:'uppercase' }}>{lbl}</button>
        ))}
      </div>

      {/* FEATURES TAB */}
      {moreTab === 'features' && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4, marginBottom:10 }}>
            <div style={{ width:3, height:12, background:P, transform:'skewX(-15deg)', flexShrink:0 }} />
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:'2px', textTransform:'uppercase', color:'#3a4260' }}>Coming Soon — Elite Plan</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[['🏟','Game Day Mode','Sideline ready',true],['👥','Roster Manager','14 players',true],['📅','Season Planner','Week 6 of 10',true],['🎨','Play Designer','Coming soon',true],['🏆','Certifications','Coming soon',true],['📊','Analytics','Coming soon',true]].map(([ico,ttl,sub,locked]) => (
              <div key={ttl} style={{ background:'#0f1219', border:`1px solid ${locked?'#1e2330':al(P,0.25)}`, borderRadius:4, padding:'14px 12px', textAlign:'center', opacity:locked?0.55:1 }}>
                <div style={{ fontSize:24, marginBottom:5 }}>{ico}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'0.5px', textTransform:'uppercase' }}>{ttl}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:locked?'#3a4260':P, marginTop:3, letterSpacing:'0.5px' }}>{sub}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* SETTINGS TAB */}
      {moreTab === 'settings' && (
        <Card>
          <CardHead icon="🎨" title="Team Colors" tag="LIVE" tagColor={P} accent={P} />
          <div style={{ padding:14 }}>
            {[['Primary Color',cfg.primary,'primary'],['Secondary Color',cfg.secondary,'secondary']].map(([lbl,val,key]) => (
              <div key={lbl} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid #1e2330' }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:13 }}>{lbl}</span>
                <div style={{ display:'flex', gap:9, alignItems:'center' }}>
                  <div style={{ width:30, height:30, borderRadius:4, border:'2px solid #1e2330', background:val, cursor:'pointer', position:'relative', overflow:'hidden' }}>
                    <input type="color" value={val} onChange={e=>setCfg(c=>({...c,[key]:e.target.value}))} style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%' }} />
                  </div>
                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:'#6b7a96' }}>{val}</span>
                </div>
              </div>
            ))}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0' }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:13 }}>{cfg.team}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:P, cursor:'pointer', letterSpacing:'0.5px' }} onClick={()=>{const n=prompt('Team name:');if(n)setCfg(c=>({...c,team:n}))}}>Edit</span>
            </div>
          </div>
        </Card>
      )}
    </>
  )
}