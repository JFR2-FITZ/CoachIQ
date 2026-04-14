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

  const P = cfg.primary
  const S = cfg.secondary

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
    <Onboarding onLaunch={(c) => { setCfg(c); setLaunched(true) }} />
  )

  return (
    <>
      <Head><title>CoachIQ</title></Head>
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#080a0e', color:'#f2f4f8', fontFamily:"'DM Sans', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 2px; }
          select option { background: #161922; }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        `}</style>

        {/* TOPBAR */}
        <div style={{ background:'#0f1117', borderBottom:'1px solid #1e2330', padding:'10px 16px', display:'flex', alignItems:'center', gap:10, position:'sticky', top:0, zIndex:50 }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${P},${S})` }} />
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:2, color:P }}>CoachIQ</div>
          <div style={{ fontSize:11, fontWeight:600, color:'#6b7a96', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{cfg.team}</div>
          <div style={{ display:'flex', gap:4 }}>
            {[['FB','Football'],['BB','Basketball'],['BSB','Baseball']].map(([lbl,s]) => (
              <button key={lbl} onClick={() => setSport(s)} style={{ padding:'3px 9px', borderRadius:20, fontSize:10, fontWeight:700, border:`1px solid ${sport===s?P:'#1e2330'}`, color:sport===s?'white':'#6b7a96', background:sport===s?P:'transparent', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>{lbl}</button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4, background:'#161922', border:'1px solid #1e2330', borderRadius:20, padding:'3px 10px' }}>
            <span style={{ fontSize:9, color:'#6b7a96', letterSpacing:1, textTransform:'uppercase' }}>IQ</span>
            <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, color:P, letterSpacing:1 }}>{iq}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, maxWidth:640, margin:'0 auto', width:'100%', padding:'14px 14px 90px', display:'flex', flexDirection:'column', gap:14 }}>
          {page === 'home' && <HomePage P={P} S={S} al={al} dk={dk} lastName={lastName} sport={sport} schemes={schemes} iq={iq} gauntlets={gauntlets} callAI={callAI} parseJSON={parseJSON} onScheme={() => setSchemes(s=>s+1)} />}
          {page === 'gauntlet' && <GauntletPage P={P} S={S} al={al} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} />}
          {page === 'film' && <FilmPage P={P} S={S} al={al} dk={dk} sport={sport} callAI={callAI} parseJSON={parseJSON} />}
          {page === 'more' && <MorePage P={P} S={S} al={al} dk={dk} cfg={cfg} setCfg={setCfg} />}
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:640, background:'#0f1117', borderTop:`2px solid ${P}`, display:'flex', zIndex:50 }}>
          {[['home','⚡','Home'],['gauntlet','⚔️','Gauntlet'],['film','🎥','Film'],['more','☰','More']].map(([p,ico,lbl]) => (
            <button key={p} onClick={() => setPage(p)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'9px 4px 5px', cursor:'pointer', gap:3, background:'none', border:'none', position:'relative' }}>
              <span style={{ fontSize:17, color:page===p?P:'#3d4559' }}>{ico}</span>
              <span style={{ fontSize:9, color:page===p?P:'#3d4559', fontWeight:600, letterSpacing:0.5, textTransform:'uppercase', fontFamily:'inherit' }}>{lbl}</span>
              {p==='gauntlet' && <div style={{ position:'absolute', top:6, right:'calc(50% - 14px)', width:6, height:6, background:P, borderRadius:'50%', border:'1.5px solid #0f1117' }} />}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

// ── ONBOARDING ──
function Onboarding({ onLaunch }) {
  const [coach, setCoach] = useState('Coach Regisford')
  const [team, setTeam] = useState('Tolland Youth Football')
  const [primary, setPrimary] = useState('#D0021B')
  const [secondary, setSecondary] = useState('#002868')
  const PP = ['#D0021B','#E8460C','#FF6B00','#1a7a3c','#0066CC','#8B0014','#C8A400','#4a0080']
  const SP = ['#002868','#1a3a6b','#0a4d2e','#3a0060','#1a1a1a','#5c3a00','#004d40','#6b0010']
  const inp = { width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:14, outline:'none', marginBottom:12 }
  return (
    <div style={{ minHeight:'100vh', background:'#080a0e', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, fontFamily:"'DM Sans',system-ui,sans-serif", color:'#f2f4f8' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap'); *{box-sizing:border-box}`}</style>
      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:48, letterSpacing:4, color:primary, marginBottom:6 }}>CoachIQ</div>
      <div style={{ fontSize:11, color:'#6b7a96', letterSpacing:3, textTransform:'uppercase', marginBottom:28 }}>AI Coaching Intelligence Platform</div>
      <div style={{ width:'100%', maxWidth:380, background:'#0f1117', border:'1px solid #1e2330', borderRadius:16, padding:24 }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:22, letterSpacing:1.5, marginBottom:4 }}>Build Your Experience</div>
        <div style={{ fontSize:12, color:'#6b7a96', marginBottom:18, lineHeight:1.5 }}>Your team colors theme the entire app.</div>
        <label style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>Coach Name</label>
        <input value={coach} onChange={e=>setCoach(e.target.value)} style={inp} />
        <label style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>Team Name</label>
        <input value={team} onChange={e=>setTeam(e.target.value)} style={inp} />
        {[[primary,setPrimary,PP,'Primary'],[secondary,setSecondary,SP,'Secondary']].map(([val,set,presets,lbl]) => (
          <div key={lbl} style={{ marginBottom:14 }}>
            <label style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:5, display:'block' }}>{lbl} Color</label>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{ width:34, height:34, borderRadius:8, border:'2px solid white', background:val }} />
                <input type="color" value={val} onChange={e=>set(e.target.value)} style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%' }} />
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                {presets.map(c => <div key={c} onClick={()=>set(c)} style={{ width:26, height:26, borderRadius:6, cursor:'pointer', border:val===c?'2px solid white':'2px solid transparent', background:c }} />)}
              </div>
            </div>
          </div>
        ))}
        <label style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:6, display:'block' }}>Preview</label>
        <div style={{ width:'100%', height:36, borderRadius:8, marginBottom:16, overflow:'hidden', display:'flex', border:'1px solid #1e2330' }}>
          <div style={{ flex:1, background:primary }} /><div style={{ flex:1, background:'white' }} /><div style={{ flex:1, background:secondary }} />
        </div>
        <button onClick={() => onLaunch({coach,team,primary,secondary})} style={{ width:'100%', background:primary, color:'white', border:'none', borderRadius:8, padding:13, fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:2, cursor:'pointer' }}>
          LETS COACH
        </button>
      </div>
    </div>
  )
}

// ── SHARED COMPONENTS ──
function Card({ children, style={} }) {
  return <div style={{ background:'#0f1117', border:'1px solid #1e2330', borderRadius:12, overflow:'hidden', animation:'fadeIn 0.3s ease', ...style }}>{children}</div>
}
function CardHead({ icon, title, tag, tagColor, accent, tagVariant }) {
  const tc = tagColor || '#D0021B'
  return (
    <div style={{ padding:'12px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${accent||'#D0021B'}` }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:1, color:'#f2f4f8', flex:1 }}>{title}</span>
      {tag && <span style={{ fontSize:9, fontWeight:700, letterSpacing:1, padding:'2px 7px', borderRadius:10, background:`rgba(${parseInt(tc.slice(1,3),16)},${parseInt(tc.slice(3,5),16)},${parseInt(tc.slice(5,7),16)},0.15)`, color:tc }}>{tag}</span>}
    </div>
  )
}
function PBtn({ onClick, disabled, children, color='#D0021B', style={} }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ width:'100%', background:disabled?'#3d4559':color, color:'white', border:'none', borderRadius:8, padding:12, fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:2, cursor:disabled?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:disabled?0.6:1, ...style }}>
      {children}
    </button>
  )
}
function Sel({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}
function Shimmer() {
  return <div style={{ width:'100%', height:3, background:'linear-gradient(90deg,#D0021B,#002868,#D0021B)', backgroundSize:'200% 100%', borderRadius:2, margin:'10px 0', animation:'shimmer 1.2s linear infinite' }} />
}
function ErrBox({ msg }) {
  return <div style={{ marginTop:10, background:'#161922', border:'1px solid rgba(208,2,27,0.3)', borderRadius:10, padding:10, fontSize:11, color:'#6b7a96', wordBreak:'break-all' }}>Error: {msg}</div>
}
function Hero({ greet, left, right, P, S, dk, children }) {
  return (
    <div style={{ borderRadius:12, padding:'16px 15px', position:'relative', overflow:'hidden', border:'1px solid #1e2330', background:`linear-gradient(135deg,${dk(S,40)} 0%,#080a0e 65%)` }}>
      <div style={{ position:'absolute', top:0, right:0, width:5, height:'100%', background:P }} />
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ fontSize:10, color:'#6b7a96', letterSpacing:2, textTransform:'uppercase', marginBottom:2 }}>{greet}</div>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, letterSpacing:1.5, lineHeight:1, marginBottom:children?11:0 }}>{left} <span style={{ color:P }}>{right}</span></div>
        {children}
      </div>
    </div>
  )
}

// ── SPORT CONFIG ──
const SPORTS = {
  Football: {
    emoji:'🏈',
    fields:[
      {id:'system',label:'Offensive System',opts:['Wing-T','Spread','I-Formation','Single Wing','Pistol','Power I','Double Wing']},
      {id:'roster',label:'Roster Size',opts:['8-10 players','11-14 players','15-18 players','18+ players']},
      {id:'age',label:'Age Group',opts:['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School']},
      {id:'skill',label:'Skill Level',opts:['Beginner','Average','Athletic']},
      {id:'focus',label:'Offensive Focus',opts:['Balanced','Run Heavy','Pass Heavy','Option/Read']},
      {id:'defense',label:'Opponent Defense',opts:['Unknown / Surprise Me','4-3','3-4','5-2','6-2 Youth','4-2-5','Multiple / Varies']},
    ],
    positions:['Quarterback','Running Back','Wide Receiver','Offensive Line','Linebacker','Cornerback','Safety'],
    buildPrompt:(f)=>`You are an elite youth football coordinator. Generate a scheme package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. ${f.defense==='Unknown / Surprise Me'||f.defense==='Multiple / Varies'?'Generate the best all-around scheme for this teams personnel.':'Tailor to attack the '+f.defense+' defense.'} Return 6 plays mixing runs and passes. Use types like: RUN BASE, RUN PERIMETER, RUN MISDIRECTION, PASS PLAY ACTION, PASS QUICK GAME, RUN SHORT YARDAGE. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"play name","type":"TYPE","note":"when to use"},{"number":2,"name":"play name","type":"TYPE","note":"when to use"},{"number":3,"name":"play name","type":"TYPE","note":"when to use"},{"number":4,"name":"play name","type":"TYPE","note":"when to use"},{"number":5,"name":"play name","type":"TYPE","note":"when to use"},{"number":6,"name":"play name","type":"TYPE","note":"when to use"}],"defenseTip":"tip","coachingCue":"phrase"}`,
    scenarioPrompt:(diff)=>`You are a coaching intelligence AI. Create a football coaching scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"game situation","phase":"OFFENSE","question":"2-3 sentence scenario asking what coach should do","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct, randomize which letter, make wrong answers plausible.`,
  },
  Basketball: {
    emoji:'🏀',
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
    scenarioPrompt:(diff)=>`You are a coaching intelligence AI. Create a basketball coaching scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"game situation","phase":"OFFENSE","question":"2-3 sentence scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct, randomize which letter.`,
  },
  Baseball: {
    emoji:'⚾',
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
    scenarioPrompt:(diff)=>`You are a coaching intelligence AI. Create a baseball coaching scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"game situation","phase":"OFFENSE","question":"2-3 sentence scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct, randomize which letter.`,
  },
}

// ── HOME PAGE ──
function HomePage({ P, S, al, dk, lastName, sport, schemes, iq, gauntlets, callAI, parseJSON, onScheme }) {
  const cfg = SPORTS[sport] || SPORTS.Football
  const initFields = () => { const f={}; cfg.fields.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [fields, setFields] = useState(initFields)
  const [prevSport, setPrevSport] = useState(sport)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  if (sport !== prevSport) {
    setPrevSport(sport)
    setFields(initFields())
    setResult(null)
    setError('')
  }

  const activeCfg = SPORTS[sport] || SPORTS.Football

  async function generate() {
    setLoading(true); setResult(null); setError('')
    try {
      const raw = await callAI(activeCfg.buildPrompt(fields))
      const data = parseJSON(raw)
      if (!data.plays) throw new Error('No plays in response')
      setResult(data)
      onScheme()
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  return (
    <>
      <Hero greet="Welcome back" left="Coach" right={lastName} P={P} S={S} dk={dk}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7 }}>
          {[[schemes,P,'Schemes'],[iq,'white','IQ Score'],[gauntlets,'#6b9fff','Gauntlets']].map(([v,c,l]) => (
            <div key={l} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, padding:'9px 7px', textAlign:'center' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:25, letterSpacing:1, lineHeight:1, color:c }}>{v}</div>
              <div style={{ fontSize:9, color:'#6b7a96', letterSpacing:1, textTransform:'uppercase', marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </Hero>
      <div style={{ height:5, borderRadius:3, background:`linear-gradient(90deg,${P} 33%,white 33%,white 66%,${S} 66%)` }} />

      {/* SCHEME GENERATOR */}
      <Card>
        <CardHead icon={activeCfg.emoji} title={`${sport} Scheme Generator`} tag="AI POWERED" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            {activeCfg.fields.map(f => (
              <Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />
            ))}
          </div>
          <PBtn onClick={generate} disabled={loading} color={P}>{loading ? 'GENERATING...' : '⚡ GENERATE SCHEME'}</PBtn>
          {loading && <Shimmer />}
          {error && <ErrBox msg={error} />}
          {result && (
            <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:1, color:P, marginBottom:8 }}>{result.packageName}</div>
              <p style={{ fontSize:12, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>{result.summary}</p>
              {(result.plays||[]).map(p => (
                <div key={p.number} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'8px 0', borderBottom:'1px solid #1e2330' }}>
                  <div style={{ width:22, height:22, minWidth:22, background:P, color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{p.number}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{p.name}</div>
                    <div style={{ fontSize:10, color:'#6b7a96', fontFamily:"'DM Mono',monospace", marginTop:1 }}>{p.type}</div>
                    <div style={{ fontSize:11, color:'#6b7a96', marginTop:3, lineHeight:1.4 }}>{p.note}</div>
                  </div>
                </div>
              ))}
              {result.defenseTip && <div style={{ marginTop:10, padding:10, background:'#0f1117', borderRadius:8, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Defense Tip</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{result.defenseTip}</div></div>}
              {result.coachingCue && <div style={{ marginTop:8, padding:10, background:al(P,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Coaching Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic', fontWeight:500 }}>"{result.coachingCue}"</div></div>}
            </div>
          )}
        </div>
      </Card>

      {/* PLAY CALLER */}
      <Card>
        <CardHead icon="🎯" title="Situational Play Caller" tag="REAL-TIME" tagColor={S} accent={S} />
        <div style={{ padding:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:11 }}>
            {[['Down & Distance','3RD & 5'],['Field Position','OPP 28'],['Score','UP 3'],['Time Left','4:22']].map(([l,v]) => (
              <div key={l} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px' }}>
                <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#3d4559', fontWeight:600 }}>{l}</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:21, letterSpacing:1 }}>{v}</div>
              </div>
            ))}
          </div>
          {[['1',true,'Slot Cross / Hi-Lo','Attacks Cover 2 void in the middle','84%'],['2',false,'QB Draw','Exploit aggressive pass rush','61%'],['3',false,'Four Verticals','Force single coverage - big play potential','43%']].map(([n,top,name,why,pct]) => (
            <div key={n} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:23, width:22, textAlign:'center', lineHeight:1, color:top?P:'#6b7a96' }}>{n}</div>
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{name}</div><div style={{ fontSize:11, color:'#6b7a96', marginTop:2 }}>{why}</div></div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:top?P:'#6b7a96' }}>{pct}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

// ── GAUNTLET PAGE ──
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

  useEffect(() => { loadScenario() }, [])
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight }, [coordMsgs])

  const cfg = SPORTS[sport] || SPORTS.Football

  async function loadScenario() {
    setLoading(true); setScenario(null); setError(''); setPicked(null)
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
    const prompt = `You are an elite opposing ${sport} coordinator. The coach shared their ${coordSide} game plan: "${coordPlan}". You play ${coordSide==='offense'?'DEFENSE':'OFFENSE'} against them. This is Q1. Tell them specifically how you will attack or stop their scheme. Under 150 words. End with a challenge that forces them to adapt.`
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
    const prompt = `You are an elite opposing ${sport} coordinator. Conversation:\n\n${history}\n\nNow Q${newQ}. Make a counter-adjustment. Tactical, specific. Under 150 words. End with a challenge.`
    try {
      const raw = await callAI(prompt)
      setCoordMsgs(prev => [...prev, { role:'ai', content:raw, lbl:`Q${newQ} - Opposing Coordinator` }])
    } catch(e) { setCoordMsgs(prev => [...prev, { role:'error', content:'Error: '+e.message }]) }
    setCoordLoading(false)
  }

  return (
    <>
      <Hero greet="Test Your Coaching IQ" left="Gauntlet" right="Mode" P={P} S={S} dk={c=>c} />

      {/* SCENARIO */}
      <Card>
        <CardHead icon="⚔️" title="AI Scenario Challenge" tag={`${cfg.emoji} ${sport.toUpperCase()}`} tagColor={P} accent={P} />
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
        <CardHead icon="⚔️" title="Coordinator Matchup" tag="LIVE BATTLE" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          {!coordStarted ? (
            <>
              <div style={{ background:al(P,0.08), border:`1px solid ${al(P,0.2)}`, borderRadius:10, padding:12, marginBottom:12 }}>
                <div style={{ fontSize:11, color:P, fontWeight:700, letterSpacing:1, marginBottom:6, textTransform:'uppercase' }}>How It Works</div>
                <div style={{ fontSize:12, color:'#6b7a96', lineHeight:1.6 }}>Describe your game plan. An AI opposing coordinator tells you exactly how they will stop you. You adapt. The battle continues as long as you want.</div>
              </div>
              <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                {['offense','defense'].map(s => (
                  <button key={s} onClick={() => setCoordSide(s)} style={{ flex:1, padding:9, borderRadius:8, border:`1px solid ${coordSide===s?P:'#1e2330'}`, background:coordSide===s?al(P,0.15):'transparent', color:coordSide===s?P:'#6b7a96', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, cursor:'pointer' }}>
                    {s==='offense'?'ON OFFENSE':'ON DEFENSE'}
                  </button>
                ))}
              </div>
              <label style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>Describe your {coordSide} game plan</label>
              <textarea value={coordPlan} onChange={e=>setCoordPlan(e.target.value)} placeholder={coordSide==='offense'?'e.g. We run a Wing-T with 13-year-olds. Our strength is the buck sweep...':'e.g. We run a 4-3 defense. We plan to stop the run first...'} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', resize:'vertical', minHeight:90, lineHeight:1.5, marginBottom:10 }} />
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
        <CardHead icon="🧠" title="Your Coach IQ" tag="TOP 12%" tagColor={S} accent={S} />
        <div style={{ padding:14 }}>
          <div style={{ background:`linear-gradient(135deg,${al(S,0.12)},${al(P,0.1)})`, borderRadius:10, padding:15, display:'flex', alignItems:'center', gap:13, marginBottom:13 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:68, color:P, letterSpacing:2, lineHeight:1 }}>{iq}</div>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:1 }}>Advanced Coordinator</div>
              <div style={{ fontSize:11, color:'#6b7a96', marginTop:4, lineHeight:1.5 }}>Strongest: Situational IQ<br />Improve: Halftime Adjustments</div>
            </div>
          </div>
          {[['Play Calling',88,P],['Situational IQ',92,P],['Scheme Knowledge',85,S],['Halftime Adjustments',71,'#6b7a96'],['Opponent Reading',79,S]].map(([l,v,c]) => (
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

// ── FILM PAGE ──
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
      <Hero greet="No camera needed" left="Film" right="Translator" P={P} S={S} dk={dk} />
      <Card>
        <CardHead icon="🎥" title="Film Translator" tag="AI DIAGNOSIS" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ display:'flex', borderRadius:8, overflow:'hidden', border:'1px solid #1e2330', marginBottom:12 }}>
            {[['describe','DESCRIBE'],['upload','UPLOAD CLIP']].map(([t,lbl]) => (
              <button key={t} onClick={()=>setTab(t)} style={{ flex:1, padding:9, background:tab===t?P:'#161922', color:tab===t?'white':'#6b7a96', border:'none', cursor:'pointer', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, transition:'all 0.15s' }}>{lbl}</button>
            ))}
          </div>

          {tab === 'describe' && (
            <>
              <label style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>Describe the problem</label>
              <textarea value={problem} onChange={e=>setProblem(e.target.value)} placeholder="e.g. My QB keeps throwing into double coverage on 3rd down..." style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', resize:'vertical', minHeight:72, lineHeight:1.5, marginBottom:10 }} />
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                <Sel label="Position" value={pos||cfg.positions[0]} onChange={setPos} options={cfg.positions} />
                <Sel label="Age Group" value={age} onChange={setAge} options={['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School']} />
              </div>
              <PBtn onClick={diagnose} disabled={loading} color={P}>{loading?'DIAGNOSING...':'DIAGNOSE'}</PBtn>
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

// ── MORE PAGE ──
function MorePage({ P, S, al, dk, cfg, setCfg }) {
  return (
    <>
      <Hero greet="Pro Plan - All Features" left="Your" right="Playbook" P={P} S={S} dk={dk} />
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[['📖','Playbook Builder','63 plays saved',false],['🏟','Game Day Mode','Sideline ready',false],['👥','Roster Manager','14 players',false],['📅','Season Planner','Week 6 of 10',false],['🎨','Play Designer','COMING SOON',true],['🏆','Certifications','COMING SOON',true]].map(([ico,ttl,sub,hi]) => (
          <div key={ttl} style={{ background:'#0f1117', border:`1px solid ${hi?al(P,0.25):'#1e2330'}`, borderRadius:12, padding:'15px 11px', textAlign:'center', cursor:'pointer' }}>
            <div style={{ fontSize:24, marginBottom:5 }}>{ico}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1 }}>{ttl}</div>
            <div style={{ fontSize:10, color:hi?P:'#6b7a96', marginTop:2 }}>{sub}</div>
          </div>
        ))}
      </div>
      <Card>
        <CardHead icon="🎨" title="Team Colors" tag="LIVE" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          {[['Primary Color',cfg.primary,'primary'],['Secondary Color',cfg.secondary,'secondary']].map(([lbl,val,key]) => (
            <div key={lbl} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0', borderBottom:'1px solid #1e2330' }}>
              <span style={{ fontSize:13 }}>{lbl}</span>
              <div style={{ display:'flex', gap:9, alignItems:'center' }}>
                <div style={{ width:30, height:30, borderRadius:7, border:'2px solid #1e2330', background:val, cursor:'pointer', position:'relative', overflow:'hidden' }}>
                  <input type="color" value={val} onChange={e=>setCfg(c=>({...c,[key]:e.target.value}))} style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%' }} />
                </div>
                <span style={{ fontSize:12, color:'#6b7a96' }}>{val}</span>
              </div>
            </div>
          ))}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 0' }}>
            <span style={{ fontSize:13 }}>{cfg.team}</span>
            <span style={{ fontSize:12, color:P, fontWeight:600, cursor:'pointer' }} onClick={()=>{const n=prompt('Team name:');if(n)setCfg(c=>({...c,team:n}))}}>Edit</span>
          </div>
        </div>
      </Card>
    </>
  )
}