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
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
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
          {page === 'home' && <HomePage P={P} S={S} al={al} dk={dk} lastName={lastName} sport={sport} schemes={schemes} iq={iq} gauntlets={gauntlets} callAI={callAI} parseJSON={parseJSON} onScheme={() => setSchemes(s=>s+1)} playbook={playbook} setPlaybook={setPlaybook} schemeResult={schemeResult} setSchemeResult={setSchemeResult} schemeFields={schemeFields} setSchemeFields={setSchemeFields} schemeSport={schemeSport} setSchemeSport={setSchemeSport} />}
          {page === 'gauntlet' && <GauntletPage P={P} S={S} al={al} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} />}
          {page === 'film' && <FilmPage P={P} S={S} al={al} dk={dk} sport={sport} callAI={callAI} parseJSON={parseJSON} />}
          {page === 'more' && <MorePage P={P} S={S} al={al} dk={dk} cfg={cfg} setCfg={setCfg} playbook={playbook} sport={sport} callAI={callAI} parseJSON={parseJSON} />}
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:640, background:'#0f1117', borderTop:`2px solid ${P}`, display:'flex', zIndex:50 }}>
          {[['home','H','Home'],['gauntlet','G','Gauntlet'],['film','F','Film'],['more','M','More']].map(([p,ico,lbl]) => (
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

// -- ONBOARDING --
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

// -- SHARED COMPONENTS --
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
      const breakdownPrompt = 'You are a youth ' + sportLabel + ' coach educator. Break down this play for coaches AND players: ' + play.name + ' (' + play.type + '). ' + play.note + ' Include: why it works tactically, AND what to tell each key player about their role in simple terms a 12-year-old can understand. Return ONLY valid JSON matching this structure: ' + jsonSchema
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

    const prompt = isDefense ? defensePrompt : isBasketball ? basketballPrompt : isBaseball ? baseballPrompt : footballPrompt
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
        ' Return ONLY valid JSON: {"keyAssignment":"the single most important assignment every player must understand","coverageType":"zone, man, or combination - explained simply","steps":["Step 1: pre-snap alignment","Step 2: at the snap","Step 3: key reads","Step 4: what makes it work","Step 5: common mistakes"],"keyCoachingPoints":["point 1","point 2","point 3"],"whyItWorks":"why this defense is effective in the stated situation","playerRoles":[{"position":"DL","job":"their assignment","whyTheyDoIt":"explain to a 12yr old why their gap control matters"},{"position":"LB","job":"their assignment","whyTheyDoIt":"explain why"},{"position":"CB","job":"their assignment","whyTheyDoIt":"explain why"},{"position":"Safety","job":"their assignment","whyTheyDoIt":"explain why"}]}'
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
function HomePage({ P, S, al, dk, lastName, sport, schemes, iq, gauntlets, callAI, parseJSON, onScheme, playbook, setPlaybook, schemeResult, setSchemeResult, schemeFields, setSchemeFields, schemeSport, setSchemeSport }) {
  const cfg = SPORTS[sport] || SPORTS.Football
  const initFields = () => { const f={}; cfg.fields.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [fields, setFields] = useState(() => (schemeSport===sport && schemeFields) ? schemeFields : initFields())
  const [prevSport, setPrevSport] = useState(sport)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState((schemeSport===sport && schemeResult) ? schemeResult : null)
  const [error, setError] = useState('')

  if (sport !== prevSport) {
    setPrevSport(sport)
    setFields((schemeSport===sport && schemeFields) ? schemeFields : initFields())
    setResult((schemeSport===sport && schemeResult) ? schemeResult : null)
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
      if (setSchemeResult) {
        setSchemeResult(data); setSchemeFields(fields); setSchemeSport(sport)
        const schemeWithMeta = { ...data, _sport: sport, _inputs: Object.entries(fields).map(([k,v])=>v).join(' · ') }
        if(setPlaybook) setPlaybook(pb => ({...pb, [sport]: [...(pb[sport]||[]), schemeWithMeta]}))
      }
      if (onScheme) onScheme()
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  return (
    <>
      <Hero greet={sport==='Baseball'?'Welcome back, Manager':'Welcome back'} left={sport==='Baseball'?'Manager':'Coach'} right={lastName} P={P} S={S} dk={dk}>
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
        <CardHead icon={activeCfg.emoji} title={sport==="Baseball"?"Baseball Offensive Game Plan Generator":sport+" Offensive Scheme Generator"} tag="AI POWERED" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            {activeCfg.fields.map(f => (
              <Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />
            ))}
          </div>
          <PBtn onClick={generate} disabled={loading} color={P}>{loading ? 'GENERATING...' : sport==='Baseball' ? 'GENERATE GAME PLAN' : 'GENERATE SCHEME'}</PBtn>
          {loading && <Shimmer />}
          {error && <ErrBox msg={error} />}
          {result && (
            <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:17, letterSpacing:1, color:P, marginBottom:8 }}>{result.packageName}</div>
              <p style={{ fontSize:12, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>{result.summary}</p>
              {(result.plays||[]).map(p => <PlayCard key={p.number} play={p} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} />)}
              {result.defenseTip && <div style={{ marginTop:10, padding:10, background:'#0f1117', borderRadius:8, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Defense Tip</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{result.defenseTip}</div></div>}

              {result.coachingCue && <div style={{ marginTop:8, padding:10, background:al(P,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Coaching Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic', fontWeight:500 }}>"{result.coachingCue}"</div></div>}
            </div>
          )}
        </div>
      </Card>

      <DefenseGen sport={sport} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} />
      <SituationalPanel sport={sport} P={P} S={S} al={al} callAI={callAI} />
    </>
  )
}

// -- GAUNTLET PAGE --
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

// -- MORE PAGE --
function MorePage({ P, S, al, dk, cfg, setCfg, playbook, sport, callAI, parseJSON }) {
  const [moreTab, setMoreTab] = useState('playbook')
  const [sortBy, setSortBy] = useState('recent')
  const [filterType, setFilterType] = useState('All')

  // Only show schemes for the currently selected sport
  const sportSchemes = (playbook?.[sport] || [])
  // Group by package for "by package" view
  const byPackage = sportSchemes.map((scheme, idx) => ({
    ...scheme,
    packageIndex: idx + 1,
    plays: (scheme.plays||[]).map(p => ({ ...p, packageName: scheme.packageName, packageIndex: idx+1, schemeInputs: scheme._inputs || '' }))
  }))
  const allPlayItems = byPackage.flatMap(s => s.plays)
  const typeOptions = ['All', ...new Set(allPlayItems.map(p => p.type).filter(Boolean))]
  const filteredByPackage = byPackage.filter(scheme =>
    filterType === 'All' || (scheme.plays||[]).some(p => p.type === filterType)
  )
  const filteredPlays = allPlayItems
    .filter(p => filterType === 'All' || p.type === filterType)
    .sort((a,b) =>
      sortBy === 'name' ? a.name.localeCompare(b.name) :
      sortBy === 'type' ? (a.type||'').localeCompare(b.type||'') :
      sortBy === 'package' ? a.packageIndex - b.packageIndex : 0
    )

  return (
    <>
      <Hero greet="Pro Plan - All Features" left="Your" right="Playbook" P={P} S={S} dk={dk} />

      {/* Sub tabs */}
      <div style={{ display:'flex', borderRadius:10, overflow:'hidden', border:'1px solid #1e2330' }}>
        {[['playbook','Playbook'],['features','Features'],['settings','Settings']].map(([t,lbl]) => (
          <button key={t} onClick={()=>setMoreTab(t)} style={{ flex:1, padding:'9px', background:moreTab===t?P:'#161922', color:moreTab===t?'white':'#6b7a96', border:'none', cursor:'pointer', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, transition:'all 0.15s' }}>{lbl}</button>
        ))}
      </div>

      {/* PLAYBOOK TAB */}
      {moreTab === 'playbook' && (
        <div>
          {allPlayItems.length === 0 ? (
            <div style={{ background:'#0f1117', border:'1px solid #1e2330', borderRadius:12, padding:'32px 20px', textAlign:'center' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>📖</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:1, marginBottom:8 }}>Your Playbook is Empty</div>
              <div style={{ fontSize:12, color:'#6b7a96', lineHeight:1.6 }}>Generate schemes on the Home tab and your plays will automatically be saved here, organized and sortable.</div>
            </div>
          ) : (
            <>
              {/* Sort and filter controls */}
              <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap' }}>
                <div style={{ flex:1, minWidth:120 }}>
                  <label style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>Sort By</label>
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
                    <option value="package">By Package</option>
                    <option value="name">Name A-Z</option>
                    <option value="type">Play Type</option>
                  </select>
                </div>
                <div style={{ flex:1, minWidth:120 }}>
                  <label style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:600, marginBottom:4, display:'block' }}>Filter Type</label>
                  <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
                    {typeOptions.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ fontSize:11, color:'#6b7a96', marginBottom:10 }}>
                {sortBy === 'package' ? `${filteredByPackage.length} package${filteredByPackage.length!==1?'s':''} · ${allPlayItems.length} plays` : `${filteredPlays.length} play${filteredPlays.length!==1?'s':''}`} saved in {sport}
              </div>

              {sortBy === 'package' ? (
                // Package view - grouped
                filteredByPackage.map((scheme, si) => (
                  <div key={si} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:`linear-gradient(135deg,${al(P,0.12)},${al(S,0.08)})`, border:`1px solid ${al(P,0.3)}`, borderRadius:'10px 10px 0 0' }}>
                      <div style={{ width:26, height:26, minWidth:26, background:P, color:'white', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontSize:13, fontWeight:800, flexShrink:0 }}>#{scheme.packageIndex}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:15, letterSpacing:1, color:'#f2f4f8' }}>{scheme.packageName}</div>
                        {scheme.schemeInputs && <div style={{ fontSize:10, color:'#6b7a96', marginTop:1 }}>{scheme.schemeInputs}</div>}
                      </div>
                      <div style={{ fontSize:10, color:P, fontWeight:700 }}>{(scheme.plays||[]).length} PLAYS</div>
                    </div>
                    {(scheme.plays||[]).filter(p => filterType==='All'||p.type===filterType).map((p,pi) => (
                      <PlaybookCard key={pi} play={{...p, number:p.number||pi+1}} packageName={scheme.packageName} packageIndex={scheme.packageIndex} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} />
                    ))}
                  </div>
                ))
              ) : (
                // Flat view - name or type sorted
                filteredPlays.map((p,i) => (
                  <PlaybookCard key={i} play={{...p, number:p.number||i+1}} packageName={p.packageName} packageIndex={p.packageIndex} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} />
                ))
              )}
            </>
          )}
        </div>
      )}

      {/* FEATURES TAB */}
      {moreTab === 'features' && <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[['📖','Playbook Builder','63 plays saved',false],['🏟','Game Day Mode','Sideline ready',false],['👥','Roster Manager','14 players',false],['📅','Season Planner','Week 6 of 10',false],['🎨','Play Designer','COMING SOON',true],['🏆','Certifications','COMING SOON',true]].map(([ico,ttl,sub,hi]) => (
          <div key={ttl} style={{ background:'#0f1117', border:`1px solid ${hi?al(P,0.25):'#1e2330'}`, borderRadius:12, padding:'15px 11px', textAlign:'center', cursor:'pointer' }}>
            <div style={{ fontSize:24, marginBottom:5 }}>{ico}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1 }}>{ttl}</div>
            <div style={{ fontSize:10, color:hi?P:'#6b7a96', marginTop:2 }}>{sub}</div>
          </div>
        ))}
      </div>}

      {/* SETTINGS TAB */}
      {moreTab === 'settings' && <Card>
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
      </Card>}
    </>
  )
}