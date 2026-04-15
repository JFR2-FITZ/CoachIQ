import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

// ─── MASCOTS ─────────────────────────────────────────────────────────────────
const MASCOTS = [
  { id:'eagles',    name:'Eagles',    emoji:'🦅' },
  { id:'hawks',     name:'Hawks',     emoji:'🦆' },
  { id:'falcons',   name:'Falcons',   emoji:'🦅' },
  { id:'ravens',    name:'Ravens',    emoji:'🐦‍⬛' },
  { id:'cardinals', name:'Cardinals', emoji:'🐦' },
  { id:'owls',      name:'Owls',      emoji:'🦉' },
  { id:'tigers',    name:'Tigers',    emoji:'🐯' },
  { id:'lions',     name:'Lions',     emoji:'🦁' },
  { id:'bears',     name:'Bears',     emoji:'🐻' },
  { id:'panthers',  name:'Panthers',  emoji:'🐆' },
  { id:'cougars',   name:'Cougars',   emoji:'🦓' },
  { id:'jaguars',   name:'Jaguars',   emoji:'🐆' },
  { id:'wolves',    name:'Wolves',    emoji:'🐺' },
  { id:'huskies',   name:'Huskies',   emoji:'🐕' },
  { id:'bulldogs',  name:'Bulldogs',  emoji:'🐶' },
  { id:'vipers',    name:'Vipers',    emoji:'🐍' },
  { id:'cobras',    name:'Cobras',    emoji:'🐍' },
  { id:'gators',    name:'Gators',    emoji:'🐊' },
  { id:'dragons',   name:'Dragons',   emoji:'🐉' },
  { id:'mustangs',  name:'Mustangs',  emoji:'🐎' },
  { id:'stallions', name:'Stallions', emoji:'🐎' },
  { id:'broncos',   name:'Broncos',   emoji:'🐴' },
  { id:'rams',      name:'Rams',      emoji:'🐏' },
  { id:'bulls',     name:'Bulls',     emoji:'🐂' },
  { id:'bison',     name:'Bison',     emoji:'🦬' },
  { id:'sharks',    name:'Sharks',    emoji:'🦈' },
  { id:'barracudas',name:'Barracudas',emoji:'🐟' },
  { id:'warriors',  name:'Warriors',  emoji:'⚔️' },
  { id:'knights',   name:'Knights',   emoji:'🛡️' },
  { id:'spartans',  name:'Spartans',  emoji:'🗡️' },
  { id:'titans',    name:'Titans',    emoji:'💪' },
  { id:'giants',    name:'Giants',    emoji:'🏔️' },
  { id:'rockets',   name:'Rockets',   emoji:'🚀' },
  { id:'blazers',   name:'Blazers',   emoji:'🔥' },
  { id:'thunder',   name:'Thunder',   emoji:'⚡' },
  { id:'storm',     name:'Storm',     emoji:'🌩️' },
  { id:'lightning', name:'Lightning', emoji:'⚡' },
  { id:'cyclones',  name:'Cyclones',  emoji:'🌀' },
  { id:'tornados',  name:'Tornados',  emoji:'🌪️' },
  { id:'comets',    name:'Comets',    emoji:'☄️' },
  { id:'jets',      name:'Jets',      emoji:'✈️' },
  { id:'phantoms',  name:'Phantoms',  emoji:'👻' },
  { id:'chargers',  name:'Chargers',  emoji:'⚡' },
  { id:'colts',     name:'Colts',     emoji:'🐴' },
  { id:'patriots',  name:'Patriots',  emoji:'🦅' },
  { id:'rebels',    name:'Rebels',    emoji:'🔱' },
  { id:'trojans',   name:'Trojans',   emoji:'🏛️' },
  { id:'vikings',   name:'Vikings',   emoji:'🪓' },
  { id:'pirates',   name:'Pirates',   emoji:'🏴‍☠️' },
  { id:'raiders',   name:'Raiders',   emoji:'💀' },
]

// ─── TEAM NAME FONTS ──────────────────────────────────────────────────────────
const TEAM_FONTS = [
  { id:'kalam',     name:'Kalam',          style:"'Kalam', cursive",                    preview:'Handwritten' },
  { id:'barlow',    name:'Barlow Condensed',style:"'Barlow Condensed', sans-serif",      preview:'Bold Athletic' },
  { id:'bigshoul',  name:'Big Shoulders',  style:"'Big Shoulders Display', sans-serif", preview:'BLOCK CAPS' },
  { id:'dmsans',    name:'DM Sans',        style:"'DM Sans', sans-serif",               preview:'Clean Modern' },
  { id:'mono',      name:'DM Mono',        style:"'DM Mono', monospace",                preview:'Monospace' },
]

// ─── BRAND CONFIG ─────────────────────────────────────────────────────────────
const BRAND_PALETTES = {
  'Red — C+IQ colored':  { accent:'#C0392B', accentOn:'CIQ',  name:'Red — C+IQ colored' },
  'Red — oach colored':  { accent:'#C0392B', accentOn:'oach', name:'Red — oach colored' },
  'Blue — C+IQ colored': { accent:'#1565C0', accentOn:'CIQ',  name:'Blue — C+IQ colored' },
  'Blue — oach colored': { accent:'#1565C0', accentOn:'oach', name:'Blue — oach colored' },
  'Gold — C+IQ colored': { accent:'#f59e0b', accentOn:'CIQ',  name:'Gold — C+IQ colored' },
}

// ─── SPORT COLORS ─────────────────────────────────────────────────────────────
const SPORT_COLORS = {
  Football:   { primary:'#C0392B', secondary:'#1a3a1a', label:'Football' },
  Basketball: { primary:'#D4600A', secondary:'#1a1208', label:'Basketball' },
  Baseball:   { primary:'#1B5E20', secondary:'#1a1208', label:'Baseball' },
}

// ─── DEFAULT PLAYBOOK FOLDERS ─────────────────────────────────────────────────
const DEFAULT_FOLDERS = {
  Football:   ['Base Offense','Red Zone','2-Minute Drill','Base Defense','Special Teams','My Favorites'],
  Basketball: ['Base Offense','End of Game','Press Break','Zone Attack','Inbounds','My Favorites'],
  Baseball:   ['Base Offense','Late Innings','Small Ball','Pitching Strategy','Defensive Sets','My Favorites'],
}

// ─── WEATHER GAME LIKELIHOOD ──────────────────────────────────────────────────
const GAME_THRESHOLDS = {
  Football:   { lightRain:85, heavyRain:60, thunderstorm:10, snow:70, wind:75, extreme:5 },
  Basketball: { lightRain:100, heavyRain:100, thunderstorm:100, snow:100, wind:100, extreme:100 }, // indoor
  Baseball:   { lightRain:70, heavyRain:20, thunderstorm:5, snow:15, wind:80, extreme:5 },
}

function getGameLikelihood(sport, weatherCode, windSpeed) {
  const t = GAME_THRESHOLDS[sport] || GAME_THRESHOLDS.Football
  if (weatherCode >= 200 && weatherCode < 300) return t.thunderstorm // thunderstorm
  if (weatherCode >= 300 && weatherCode < 400) return t.lightRain    // drizzle
  if (weatherCode >= 500 && weatherCode < 502) return t.lightRain    // light rain
  if (weatherCode >= 502 && weatherCode < 600) return t.heavyRain    // heavy rain
  if (weatherCode >= 600 && weatherCode < 700) return t.snow         // snow
  if (windSpeed > 35) return t.wind
  if (weatherCode >= 771 || weatherCode === 781) return t.extreme    // squall/tornado
  return 95
}


// ─── SPORTS CONFIG ────────────────────────────────────────────────────────────
const SPORTS = {
  Football: {
    emoji:'FB',
    fields:[
      {id:'system',label:'Offensive System',opts:['Wing-T','Spread','I-Formation','Single Wing','Pistol','Power I','Double Wing','Flexbone','Run and Shoot']},
      {id:'personnel',label:'Your Best Personnel',opts:['Athletic QB / Dual Threat','Big Physical RB','Fast Skill Players','Strong Offensive Line','Well-Balanced','Small But Fast Team','Big But Slower Team']},
      {id:'age',label:'Age Group',opts:['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School JV','High School Varsity']},
      {id:'skill',label:'Team Skill Level',opts:['First Year / Beginner','2nd-3rd Year Average','Experienced / Athletic','Elite / Competitive']},
      {id:'focus',label:'Offensive Philosophy',opts:['Balanced Attack','Ground and Pound','Air It Out','Misdirection Heavy','Option / Read Heavy','Two Minute Drill']},
      {id:'defense',label:'Opponent Formation',opts:['Unknown / Surprise Me','4-3','3-4','5-2','6-2 Youth','4-2-5','46 Bear','Multiple / Varies']},
      {id:'oppTendency',label:'Opponent Defensive Tendency',opts:['Unknown / Balanced','Cover 2 Zone','Cover 3 Zone','Cover 4 / Quarters','Man Press Every Down','Zone Blitz Heavy','Blitzes Every Down','Soft Zone / Prevent','Tampa 2','Quarters Robber']},
      {id:'experience',label:'Your Players Experience',opts:['First Year / Never Played','Beginner — 1 Season','Average — 2-3 Seasons','Experienced — 4+ Seasons','Mixed Skill Levels on Roster']},
    ],
    positions:['Quarterback','Running Back','Wide Receiver','Offensive Line','Linebacker','Cornerback','Safety'],
    buildPrompt:(f)=>`You are an elite youth football coordinator. Generate a scheme package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Tailor to attack the ${f.defense} formation against their ${f.oppTendency} coverage. Return 6 plays mixing runs and passes. Use types: RUN BASE, RUN PERIMETER, RUN MISDIRECTION, PASS PLAY ACTION, PASS QUICK GAME, RUN SHORT YARDAGE. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explain in simple terms why this play is called this name — break down each word for a youth coach"},{"number":2,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":3,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":4,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":5,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":6,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"}],"defenseTip":"tip","coachingCue":"phrase"}`,
    scenarioPrompt:(diff)=>`You are a football coaching AI. Create a football coaching scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. 3RD AND 7 OWN 35 DOWN 4","phase":"OFFENSE or DEFENSE","question":"2-3 sentence scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct, randomize which letter.`,
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
      {id:'oppTendency',label:'Opponent Defensive Tendency',opts:['Unknown / Balanced','Aggressive On-Ball Pressure','Sags Off Shooters','Overplays Passing Lanes','Help Side Heavy','No Rotation / Ball Watching','Switches Everything','Traps Ball Handlers','Packs the Paint','Gambles for Steals']},
      {id:'experience',label:'Your Players Experience',opts:['First Year / Never Played','Beginner — 1 Season','Average — 2-3 Seasons','Experienced — 4+ Seasons','Mixed Skill Levels on Roster']},
    ],
    positions:['Point Guard','Shooting Guard','Small Forward','Power Forward','Center','Entire Team'],
    buildPrompt:(f)=>`You are an elite youth basketball coordinator. Generate a scheme package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Return 6 plays. Use types: SET PLAY HALF COURT, INBOUND BASELINE, PRESS BREAK, FAST BREAK, ZONE ATTACK, END OF GAME. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explain why this play is called this name in simple terms a youth coach would understand"},{"number":2,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":3,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":4,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":5,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":6,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"}],"defenseTip":"tip","coachingCue":"phrase"}`,
    scenarioPrompt:(diff)=>`You are a basketball coaching AI. Create a basketball coaching scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. Q4 DOWN 2 8 SECONDS LEFT","phase":"OFFENSE or DEFENSE or TIMEOUT or INBOUND","question":"2-3 sentence basketball scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct.`,
  },
  Baseball: {
    emoji:'BSB',
    fields:[
      {id:'system',label:'Offensive Approach',opts:['Small Ball','Power Hitting','Speed and Baserunning','Balanced','Bunting Focus']},
      {id:'roster',label:'Roster Size',opts:['9-11 players','12-14 players','15+ players']},
      {id:'age',label:'Age Group',opts:['7-8 yrs Coach Pitch','9-10 yrs','11-12 yrs','13-14 yrs','High School']},
      {id:'skill',label:'Skill Level',opts:['Beginner','Average','Competitive']},
      {id:'focus',label:'Defensive Focus',opts:['Fundamentals First','Outfield Positioning','Infield Shifts','Pitching Strategy','Rundowns']},
      {id:'defense',label:'Batting Order Style',opts:['Traditional Best at 3-4','Speedy Leadoff Heavy','Power Through Lineup','Youth Everyone Hits']},
      {id:'oppTendency',label:'Opponent Defensive Tendency',opts:['Unknown / Balanced','Standard Positioning','Pull-Side Shift Heavy','Five Man Infield Late','Aggressive Corner Charges','Outfield Plays Shallow','Pitcher Works Inside Heavy','Catcher Sets Up Away','Pitcher Changes Speeds Often','Challenges Hitters Early Count']},
      {id:'experience',label:'Your Players Experience',opts:['First Year / Never Played','Beginner — 1 Season','Average — 2-3 Seasons','Experienced — 4+ Seasons','Mixed Skill Levels on Roster']},
    ],
    positions:['Pitcher','Catcher','First Baseman','Shortstop','Outfielder','Batter','Entire Team'],
    buildPrompt:(f)=>`You are an elite youth baseball coordinator. Generate a game plan package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Return 6 situational strategies. Use types: OFFENSE SITUATIONAL, DEFENSE ALIGNMENT, BASERUNNING RULE, PITCHING STRATEGY, INFIELD COVERAGE, BATTING APPROACH. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explain why this strategy is called this name in simple terms"},{"number":2,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":3,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":4,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":5,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":6,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"}],"defenseTip":"tip","coachingCue":"phrase"}`,
    scenarioPrompt:(diff)=>`You are a baseball coaching AI. Create a baseball scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. TOP 6TH RUNNER ON 2ND 1 OUT TIED 3-3","phase":"OFFENSE or PITCHING or DEFENSE or BULLPEN","question":"2-3 sentence baseball scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct.`,
  },
}


// ─── LOGO COMPONENT ───────────────────────────────────────────────────────────
function CoachIQLogo({ size=22, brand='Red — C+IQ colored' }) {
  const p = BRAND_PALETTES[brand] || BRAND_PALETTES['Red — C+IQ colored']
  const CIQ = p.accentOn === 'CIQ'
  return (
    <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:size, letterSpacing:'-0.5px', lineHeight:1, whiteSpace:'nowrap', flexShrink:0 }}>
      <span style={{ color: CIQ ? p.accent : '#f2f4f8' }}>C</span>
      <span style={{ color: CIQ ? '#f2f4f8' : p.accent }}>oach</span>
      <span style={{ color: CIQ ? p.accent : '#f2f4f8' }}>IQ</span>
    </div>
  )
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function al(hex, a) {
  if (!hex||hex.length<7) return `rgba(0,0,0,${a})`
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}
function dk(hex, amt) {
  if (!hex||hex.length<7) return hex
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  return '#'+[r,g,b].map(x=>Math.max(0,x-amt).toString(16).padStart(2,'0')).join('')
}
function Card({ children, style={} }) {
  return <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, overflow:'hidden', animation:'fadeIn 0.3s ease', ...style }}>{children}</div>
}
function CardHead({ icon, title, tag, tagColor, accent }) {
  const tc=tagColor||'#C0392B'
  return (
    <div style={{ padding:'11px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${accent||'#C0392B'}` }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', color:'#f2f4f8', flex:1, textTransform:'uppercase' }}>{title}</span>
      {tag && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'1px', padding:'2px 7px', borderRadius:2, background:al(tc,0.15), color:tc, textTransform:'uppercase' }}>{tag}</span>}
    </div>
  )
}
function PBtn({ onClick, disabled, children, color='#C0392B', style={} }) {
  return <button onClick={onClick} disabled={disabled} style={{ width:'100%', background:disabled?'#3d4559':color, color:'white', border:'none', borderRadius:4, padding:12, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'2px', cursor:disabled?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:disabled?0.6:1, textTransform:'uppercase', ...style }}>{children}</button>
}
function Sel({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
        {options.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  )
}
function Shimmer() {
  return <div style={{ width:'100%', height:3, background:'linear-gradient(90deg,#C0392B,#002868,#C0392B)', backgroundSize:'200% 100%', margin:'10px 0', animation:'shimmer 1.2s linear infinite' }} />
}
function ErrBox({ msg }) {
  return <div style={{ marginTop:10, background:'#161922', border:'1px solid rgba(192,57,43,0.3)', borderRadius:4, padding:10, fontSize:11, color:'#6b7a96' }}>Error: {msg}</div>
}

// ─── WEATHER HOOK ─────────────────────────────────────────────────────────────
function useWeather(location) {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!location) return
    setLoading(true)
    // Use Open-Meteo (free, no key required) with geocoding
    const fetchWeather = async () => {
      try {
        // Geocode location name to lat/lon
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`)
        const geoData = await geoRes.json()
        if (!geoData.results?.length) return
        const { latitude, longitude, name, admin1 } = geoData.results[0]
        const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,precipitation&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch`)
        const wxData = await wxRes.json()
        const c = wxData.current
        setWeather({ temp: Math.round(c.temperature_2m), code: c.weather_code, wind: Math.round(c.wind_speed_10m), precip: c.precipitation, city: name, state: admin1 })
      } catch(e) { console.error('Weather fetch failed:', e) }
      setLoading(false)
    }
    fetchWeather()
  }, [location])

  return { weather, loading }
}

function weatherDesc(code) {
  if (!code && code !== 0) return 'Unknown'
  if (code === 0) return 'Clear'
  if (code <= 3) return 'Partly Cloudy'
  if (code <= 49) return 'Foggy'
  if (code <= 69) return 'Rainy'
  if (code <= 79) return 'Snowy'
  if (code <= 99) return 'Thunderstorm'
  return 'Unknown'
}

function weatherEmoji(code) {
  if (!code && code !== 0) return '🌡️'
  if (code === 0) return '☀️'
  if (code <= 3) return '⛅'
  if (code <= 49) return '🌫️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '❄️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

// ─── ROTATING INFO WIDGET ─────────────────────────────────────────────────────
function RotatingInfoWidget({ sport, homeLocation, awayLocation, nextEvent, P, al }) {
  const [slot, setSlot] = useState(0)
  const [now, setNow] = useState(new Date())
  const { weather: homeWeather } = useWeather(homeLocation)
  const { weather: awayWeather } = useWeather(awayLocation)
  const SPORT_BALL = { Football:'🏈', Basketball:'🏀', Baseball:'⚾' }

  useEffect(() => {
    const t = setInterval(() => setSlot(s => (s+1) % 4), 4000)
    const tc = setInterval(() => setNow(new Date()), 60000)
    return () => { clearInterval(t); clearInterval(tc) }
  }, [])

  const likelihood = homeWeather ? getGameLikelihood(sport, homeWeather.code, homeWeather.wind) : null

  function getCountdown() {
    if (!nextEvent?.date) return null
    const diff = new Date(nextEvent.date) - now
    if (diff < 0) return null
    const days = Math.floor(diff / 86400000)
    const hrs = Math.floor((diff % 86400000) / 3600000)
    if (days > 0) return `${days}d ${hrs}h`
    if (hrs > 0) return `${hrs}h`
    return 'Today!'
  }

  const slots = [
    // Slot 0: Home weather + game likelihood
    homeWeather ? (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
        <div style={{ fontSize:16 }}>{weatherEmoji(homeWeather.code)}</div>
        <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:15, color:'#f2f4f8', lineHeight:1 }}>{homeWeather.temp}°F</div>
        <div style={{ fontSize:8, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.5px', textAlign:'center', lineHeight:1.2 }}>{homeWeather.city}</div>
        {likelihood !== null && <div style={{ fontSize:8, color: likelihood > 70 ? '#4ade80' : likelihood > 40 ? '#f59e0b' : '#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{likelihood}% game on</div>}
      </div>
    ) : <div style={{ fontSize:18 }}>🌡️</div>,

    // Slot 1: Away weather (if different location)
    awayWeather && awayLocation !== homeLocation ? (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
        <div style={{ fontSize:16 }}>{weatherEmoji(awayWeather.code)}</div>
        <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:15, color:'#f2f4f8', lineHeight:1 }}>{awayWeather.temp}°F</div>
        <div style={{ fontSize:8, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.5px', textAlign:'center', lineHeight:1.2 }}>{awayWeather.city} (Away)</div>
      </div>
    ) : null,

    // Slot 2: Next event countdown
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
      <div style={{ fontSize:14 }}>{nextEvent?.type==='practice'?'📋':'🏆'}</div>
      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:13, color:P, lineHeight:1, textAlign:'center' }}>{getCountdown() || '—'}</div>
      <div style={{ fontSize:8, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.5px', textAlign:'center', lineHeight:1.3, maxWidth:60 }}>{nextEvent ? nextEvent.opponent || nextEvent.type : 'No events'}</div>
    </div>,

    // Slot 3: Date/time
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
      <div style={{ fontSize:14 }}>📅</div>
      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:14, color:'#f2f4f8', lineHeight:1 }}>{now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
      <div style={{ fontSize:8, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.5px', textAlign:'center' }}>{now.toLocaleDateString([],{month:'short',day:'numeric'})}</div>
    </div>,
  ].filter(Boolean)

  const activeSlot = slots[slot % slots.length]

  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ fontSize:22, lineHeight:1, opacity:0.7 }}>{SPORT_BALL[sport]||'🏈'}</div>
      <div style={{ minWidth:68, display:'flex', alignItems:'center', justifyContent:'center', animation:'fadeIn 0.4s ease' }} key={slot}>
        {activeSlot}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
        {slots.map((_,i) => <div key={i} style={{ width:3, height:3, borderRadius:'50%', background: i===slot%slots.length ? P : '#3d4559' }} />)}
      </div>
    </div>
  )
}


// ─── TEAM MANAGER CARD ────────────────────────────────────────────────────────
function TeamManagerCard({ sport, teams, setTeams, activeTeam, setActiveTeam, P, al, setCfg, onOpenTeamTab }) {
  const [mode, setMode] = useState('view')
  const [expanded, setExpanded] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [form, setForm] = useState({ name:'', season:'', mascot:'eagles', teamFont:'kalam', hometown:'', primary:'#C0392B', secondary:'#002868', accent1:'#f59e0b', accent2:'#1565C0' })
  const [error, setError] = useState('')

  const sportTeams = teams[sport] || []
  const current = activeTeam[sport]
  const MAX_TEAMS = 5
  const seasons = ['Fall 2025','Winter 2025','Spring 2026','Summer 2026','Fall 2026','Winter 2026','Spring 2027','Summer 2027','Year Round']
  const sportEmoji = { Football:'🏈', Basketball:'🏀', Baseball:'⚾' }
  const currentMascot = MASCOTS.find(m=>m.id===current?.mascot) || null

  function createTeam() {
    if (!form.name.trim()) { setError('Team name is required'); return }
    if (sportTeams.length >= MAX_TEAMS) { setError(`Max ${MAX_TEAMS} teams per sport`); return }
    const newTeam = { id:Date.now(), name:form.name.trim(), season:form.season||'Season N/A', mascot:form.mascot, teamFont:form.teamFont, hometown:form.hometown.trim(), primary:form.primary, secondary:form.secondary, accent1:form.accent1, accent2:form.accent2, sport, players:[], schedule:[] }
    const updated = { ...teams, [sport]:[...sportTeams, newTeam] }
    setTeams(updated)
    setActiveTeam(prev=>({...prev,[sport]:newTeam}))
    setCfg(prev=>({...prev, primary:newTeam.primary, secondary:newTeam.secondary}))
    setForm({ name:'', season:'', mascot:'eagles', teamFont:'kalam', hometown:'', primary:'#C0392B', secondary:'#002868', accent1:'#f59e0b', accent2:'#1565C0' })
    setMode('view'); setError('')
  }

  function selectTeam(team) {
    setActiveTeam(prev=>({...prev,[sport]:team}))
    setCfg(prev=>({...prev, primary:team.primary, secondary:team.secondary}))
    setExpanded(false)
  }

  function deselectTeam() {
    setActiveTeam(prev=>({...prev,[sport]:null}))
    setExpanded(false)
  }

  function confirmDelete(team) { setDeleteConfirm(team) }

  function doDelete() {
    if (!deleteConfirm) return
    const updated = sportTeams.filter(t=>t.id!==deleteConfirm.id)
    setTeams(prev=>({...prev,[sport]:updated}))
    if (current?.id===deleteConfirm.id) {
      const next = updated[0]||null
      setActiveTeam(prev=>({...prev,[sport]:next}))
      if (next) setCfg(prev=>({...prev, primary:next.primary, secondary:next.secondary}))
    }
    setDeleteConfirm(null)
  }

  return (
    <>
      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#0f1219', border:'1px solid rgba(239,68,68,0.4)', borderRadius:8, padding:24, width:'100%', maxWidth:340 }}>
            <div style={{ fontSize:24, textAlign:'center', marginBottom:10 }}>⚠️</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, color:'#f2f4f8', textAlign:'center', marginBottom:6 }}>Delete Team?</div>
            <div style={{ fontSize:13, color:'#6b7a96', textAlign:'center', lineHeight:1.6, marginBottom:20 }}>This will permanently delete <span style={{ color:'#f2f4f8', fontWeight:600 }}>{deleteConfirm.name}</span> and all associated data. This cannot be undone.</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:'11px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>CANCEL</button>
              <button onClick={doDelete} style={{ flex:1, padding:'11px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.5)', borderRadius:4, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>DELETE</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop:14 }}>
        <div onClick={()=>setExpanded(e=>!e)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#0f1219', border:`1px solid ${current?al(P,0.3):'#1e2330'}`, borderRadius:expanded?'4px 4px 0 0':4, cursor:'pointer', borderLeft:`3px solid ${P}` }}>
          <span style={{ fontSize:16 }}>{current ? (MASCOTS.find(m=>m.id===current.mascot)?.emoji||sportEmoji[sport]) : sportEmoji[sport]}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:current?(TEAM_FONTS.find(f=>f.id===current.teamFont)?.style||"'Barlow Condensed',sans-serif"):"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:current?15:13, letterSpacing:'0.5px', color:'#f2f4f8', textTransform:'uppercase' }}>
              {current ? current.name : `No ${sport} Team Selected`}
            </div>
            {current && <div style={{ fontSize:10, color:'#6b7a96', marginTop:1 }}>{current.season} · {sportTeams.length}/{MAX_TEAMS} teams</div>}
            {!current && <div style={{ fontSize:10, color:'#3d4559', marginTop:1 }}>Tap to create or select a team</div>}
          </div>
          {current && <div style={{ display:'flex', gap:3 }}>{[current.primary,current.secondary,current.accent1,current.accent2].filter(Boolean).map((c,i)=><div key={i} style={{ width:10, height:10, borderRadius:2, background:c }} />)}</div>}
          <span style={{ fontSize:12, color:'#6b7a96' }}>{expanded?'▲':'▼'}</span>
        </div>

        {expanded && (
          <div style={{ background:'#0d1017', border:`1px solid ${al(P,0.2)}`, borderTop:'none', borderRadius:'0 0 4px 4px', padding:14, animation:'fadeIn 0.2s ease' }}>

            {/* Team list */}
            {sportTeams.length>0 && mode==='view' && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Your {sport} Teams</div>
                {sportTeams.map(team => {
                  const mascot = MASCOTS.find(m=>m.id===team.mascot)
                  const fontStyle = TEAM_FONTS.find(f=>f.id===team.teamFont)?.style||"'Barlow Condensed',sans-serif"
                  return (
                    <div key={team.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:current?.id===team.id?al(P,0.1):'#161922', border:`1px solid ${current?.id===team.id?al(P,0.4):'#1e2330'}`, borderRadius:6, marginBottom:6 }}>
                      <span style={{ fontSize:18, flexShrink:0 }}>{mascot?.emoji||'🏆'}</span>
                      <div style={{ flex:1, cursor:'pointer' }} onClick={()=>selectTeam(team)}>
                        <div style={{ fontFamily:fontStyle, fontWeight:700, fontSize:13, color:'#f2f4f8' }}>{team.name}</div>
                        <div style={{ fontSize:10, color:'#6b7a96' }}>{team.season}{team.hometown?` · ${team.hometown}`:''}</div>
                      </div>
                      <div style={{ display:'flex', gap:3, flexShrink:0 }}>
                        {[team.primary,team.secondary].map((c,i)=><div key={i} style={{ width:12,height:12,borderRadius:2,background:c }} />)}
                      </div>
                      {current?.id===team.id && (
                        <button onClick={deselectTeam} style={{ padding:'3px 7px', background:'rgba(107,154,255,0.1)', border:'1px solid rgba(107,154,255,0.3)', borderRadius:3, color:'#6b9fff', fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>DESELECT</button>
                      )}
                      {onOpenTeamTab && current?.id===team.id && (
                        <button onClick={onOpenTeamTab} style={{ padding:'3px 7px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:3, color:P, fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>OPEN →</button>
                      )}
                      <button onClick={()=>confirmDelete(team)} style={{ padding:'3px 7px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:3, color:'rgba(239,68,68,0.7)', fontSize:10, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>✕</button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Create form */}
            {mode==='create' && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:12 }}>Create New Team</div>
                {/* Name + Season */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Team Name *</label>
                    <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={`e.g. Tolland Youth ${sport}`} style={{ width:'100%', background:'#161922', border:`1px solid ${form.name?P:'#1e2330'}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                  </div>
                  <Sel label="Season" value={form.season||seasons[0]} onChange={v=>setForm(f=>({...f,season:v}))} options={seasons} />
                  <div>
                    <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Hometown / City</label>
                    <input value={form.hometown} onChange={e=>setForm(f=>({...f,hometown:e.target.value}))} placeholder="e.g. Tolland, CT" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                  </div>
                </div>

                {/* Mascot picker */}
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:6, display:'block' }}>Team Mascot</label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:4, maxHeight:120, overflowY:'auto', padding:4, background:'#161922', borderRadius:6, border:'1px solid #1e2330' }}>
                    {MASCOTS.map(m => (
                      <div key={m.id} onClick={()=>setForm(f=>({...f,mascot:m.id}))} title={m.name} style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'6px 2px', borderRadius:4, background:form.mascot===m.id?al(P,0.2):'transparent', border:`1px solid ${form.mascot===m.id?P:'transparent'}`, cursor:'pointer', gap:1 }}>
                        <span style={{ fontSize:18 }}>{m.emoji}</span>
                        <span style={{ fontSize:6, color:'#6b7a96', textAlign:'center', lineHeight:1.1 }}>{m.name.slice(0,6)}</span>
                      </div>
                    ))}
                  </div>
                  {form.mascot && <div style={{ fontSize:11, color:P, marginTop:4, fontFamily:"'Barlow Condensed',sans-serif" }}>Selected: {MASCOTS.find(m=>m.id===form.mascot)?.emoji} {MASCOTS.find(m=>m.id===form.mascot)?.name}</div>}
                </div>

                {/* Font picker */}
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:6, display:'block' }}>Team Name Font</label>
                  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                    {TEAM_FONTS.map(tf => (
                      <div key={tf.id} onClick={()=>setForm(f=>({...f,teamFont:tf.id}))} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:form.teamFont===tf.id?al(P,0.1):'#161922', border:`1px solid ${form.teamFont===tf.id?P:'#1e2330'}`, borderRadius:5, cursor:'pointer' }}>
                        <span style={{ fontFamily:tf.style, fontSize:16, color:'#f2f4f8', flex:1 }}>{form.name||'Team Name'}</span>
                        <span style={{ fontSize:9, color:'#6b7a96' }}>{tf.preview}</span>
                        {form.teamFont===tf.id && <span style={{ fontSize:12, color:'#4ade80' }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4 color pickers */}
                {[['primary','Primary'],['secondary','Secondary'],['accent1','Accent 1'],['accent2','Accent 2']].map(([key,label]) => (
                  <div key={key} style={{ marginBottom:10 }}>
                    <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:6, display:'block' }}>{label} Color</label>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <input type="color" value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={{ width:36, height:36, border:'none', borderRadius:4, cursor:'pointer', padding:0, background:'none' }} />
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                        {['#C0392B','#E8460C','#D4600A','#1B5E20','#0066CC','#7B1FA2','#C8A400','#1565C0','#880E4F','#00838F','#f59e0b','#374151'].map(c => (
                          <div key={c} onClick={()=>setForm(f=>({...f,[key]:c}))} style={{ width:22, height:22, borderRadius:3, background:c, border:`2px solid ${form[key]===c?'white':'transparent'}`, cursor:'pointer' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Color preview */}
                <div style={{ height:5, borderRadius:2, background:`linear-gradient(90deg,${form.primary} 25%,${form.secondary} 25%,${form.secondary} 50%,${form.accent1} 50%,${form.accent1} 75%,${form.accent2} 75%)`, marginBottom:12 }} />

                {error && <div style={{ fontSize:11, color:'#f87171', marginBottom:8 }}>{error}</div>}
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>{setMode('view');setError('')}} style={{ flex:1, padding:'10px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
                  <button onClick={createTeam} style={{ flex:2, padding:'10px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>CREATE TEAM</button>
                </div>
              </div>
            )}

            {/* Add button */}
            {mode==='view' && sportTeams.length<MAX_TEAMS && (
              <button onClick={()=>setMode('create')} style={{ width:'100%', padding:'10px', background:'transparent', border:`1px dashed ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:'1px', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <span style={{ fontSize:16 }}>+</span> CREATE {sport.toUpperCase()} TEAM
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}


// ─── SCHEDULE SECTION ─────────────────────────────────────────────────────────
function ScheduleSection({ team, P, al, teams, setTeams, sport }) {
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ type:'Game', opponent:'', date:'', time:'', arrivalTime:'', location:'', homeAway:'Home', notes:'' })
  const [savedOpponents, setSavedOpponents] = useState([])

  const schedule = team.schedule || []

  function saveEvent() {
    if (!form.date) return
    const event = { id:Date.now(), ...form }
    const updated = [...schedule, event].sort((a,b)=>new Date(a.date)-new Date(b.date))
    updateTeam({ schedule: updated })
    // Save opponent for reuse
    if (form.opponent && !savedOpponents.includes(form.opponent)) {
      setSavedOpponents(prev=>[...prev, form.opponent])
    }
    setForm({ type:'Game', opponent:'', date:'', time:'', arrivalTime:'', location:'', homeAway:'Home', notes:'' })
    setShowAdd(false)
  }

  function removeEvent(id) {
    updateTeam({ schedule: schedule.filter(e=>e.id!==id) })
  }

  function updateTeam(updates) {
    setTeams(prev=>({ ...prev, [sport]: (prev[sport]||[]).map(t=>t.id===team.id ? {...t,...updates} : t) }))
  }

  const typeColors = { Game:P, Practice:'#4ade80', Scrimmage:'#f59e0b', Tournament:'#c084fc' }
  const typeIcons = { Game:'🏆', Practice:'📋', Scrimmage:'⚡', Tournament:'🥇' }

  const upcoming = schedule.filter(e=>new Date(e.date)>=new Date())
  const past = schedule.filter(e=>new Date(e.date)<new Date())

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <Card>
        <CardHead icon="📅" title="Schedule" tag={`${upcoming.length} upcoming`} tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          {!showAdd ? (
            <button onClick={()=>setShowAdd(true)} style={{ width:'100%', padding:'10px', background:al(P,0.1), border:`1px dashed ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:'1px', marginBottom:upcoming.length?12:0 }}>+ ADD EVENT</button>
          ) : (
            <div style={{ animation:'fadeIn 0.2s ease', marginBottom:12 }}>
              <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Add Event</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                <Sel label="Type" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={['Game','Practice','Scrimmage','Tournament']} />
                <Sel label="Home / Away" value={form.homeAway} onChange={v=>setForm(f=>({...f,homeAway:v}))} options={['Home','Away','Neutral']} />
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Opponent / Event Name</label>
                  <input value={form.opponent} onChange={e=>setForm(f=>({...f,opponent:e.target.value}))} placeholder={form.type==='Practice'?'Practice session':'e.g. Westport Eagles'} list="saved-opps" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                  <datalist id="saved-opps">{savedOpponents.map(o=><option key={o} value={o}/>)}</datalist>
                </div>
                <div>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Date</label>
                  <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ width:'100%', background:'#161922', border:`1px solid ${form.date?P:'#1e2330'}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                </div>
                <div>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Start Time</label>
                  <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                </div>
                <div>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Arrival Time</label>
                  <input type="time" value={form.arrivalTime} onChange={e=>setForm(f=>({...f,arrivalTime:e.target.value}))} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                </div>
                <div>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Location / City</label>
                  <input value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder={form.homeAway==='Home'?team.hometown||'Home field':'e.g. Westport, CT'} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Notes</label>
                  <input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="e.g. Bring extra water, wear red jerseys" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>setShowAdd(false)} style={{ flex:1, padding:'9px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
                <button onClick={saveEvent} disabled={!form.date} style={{ flex:2, padding:'9px', background:form.date?P:'#3d4559', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:form.date?'pointer':'not-allowed', letterSpacing:'1px' }}>SAVE EVENT</button>
              </div>
            </div>
          )}

          {upcoming.length===0 && !showAdd && (
            <div style={{ textAlign:'center', padding:'16px 0', color:'#3d4559', fontSize:12 }}>No upcoming events — add your schedule above</div>
          )}

          {upcoming.map(event => {
            const tc = typeColors[event.type]||P
            return (
              <div key={event.id} style={{ padding:'10px 12px', background:'#161922', border:`1px solid ${al(tc,0.25)}`, borderRadius:6, marginBottom:8, borderLeft:`3px solid ${tc}` }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{typeIcons[event.type]||'📅'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
                      <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{event.opponent||event.type}</div>
                      <span style={{ fontSize:8, fontWeight:700, padding:'1px 5px', borderRadius:2, background:al(tc,0.15), color:tc, fontFamily:"'Barlow Condensed',sans-serif" }}>{event.type} · {event.homeAway}</span>
                    </div>
                    <div style={{ fontSize:11, color:'#6b7a96', marginTop:2 }}>
                      {new Date(event.date+'T12:00:00').toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}
                      {event.time && ` · ${event.time}`}
                      {event.arrivalTime && ` · Arrive ${event.arrivalTime}`}
                    </div>
                    {event.location && <div style={{ fontSize:10, color:'#3d4559', marginTop:1 }}>📍 {event.location}</div>}
                    {event.notes && <div style={{ fontSize:10, color:'#3d4559', marginTop:1, fontStyle:'italic' }}>{event.notes}</div>}
                  </div>
                  <button onClick={()=>removeEvent(event.id)} style={{ background:'transparent', border:'none', color:'#3d4559', cursor:'pointer', fontSize:14, flexShrink:0 }}>×</button>
                </div>
              </div>
            )
          })}

          {past.length>0 && (
            <details style={{ marginTop:8 }}>
              <summary style={{ fontSize:10, color:'#3d4559', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>PAST EVENTS ({past.length})</summary>
              <div style={{ marginTop:6, opacity:0.5 }}>
                {past.map(event => (
                  <div key={event.id} style={{ padding:'7px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, marginBottom:5, fontSize:11, color:'#6b7a96' }}>
                    {typeIcons[event.type]} {event.opponent||event.type} · {new Date(event.date+'T12:00:00').toLocaleDateString([],{month:'short',day:'numeric'})}
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      </Card>
    </div>
  )
}

function PlayCard({ play, P, S, al, callAI, parseJSON, extraAction }) {
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
      const isBBPlay = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('SET PLAY') || play.type.includes('FAST BREAK'))
      const isBSBPlay = !isBBPlay && play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING') || play.type.includes('OFFENSE SITUATIONAL') || play.type.includes('DEFENSE ALIGN'))
      const sportLabel = isBBPlay ? 'basketball' : isBSBPlay ? 'baseball' : 'football'
      const jsonSchema = '{"ballCarrier":"key player role","blockingScheme":"core concept","steps":["Step 1","Step 2","Step 3","Step 4","Step 5"],"keyCoachingPoints":["point 1","point 2","point 3"],"whyItWorks":"why this works tactically","playerRoles":[{"position":"pos1","job":"their job","whyTheyDoIt":"explain to a 12yr old why"},{"position":"pos2","job":"their job","whyTheyDoIt":"explain why"},{"position":"pos3","job":"their job","whyTheyDoIt":"explain why"}],"huddleCard":[{"player":"QB","instruction":"one sentence","termNote":"explain jargon or empty string"},{"player":"RB","instruction":"one sentence","termNote":""},{"player":"WR","instruction":"one sentence","termNote":""},{"player":"OL","instruction":"one sentence","termNote":""}]}'
      const breakdownPrompt = 'You are a youth ' + sportLabel + ' coach educator. Break down this play: ' + play.name + ' (' + play.type + '). ' + play.note + ' Return ONLY valid JSON matching this structure: ' + jsonSchema
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
      const raw = await callAI('You are a ' + sportName + ' coordinator. The base play is: "' + play.name + '" (' + play.type + '). ' + play.note + ' Generate exactly 3 play variations that use the same core concept but change one element each time. Return ONLY valid JSON: {"variations":[{"name":"variation name","type":"' + play.type + '","note":"what is different and when to use it","changeFrom":"what changed"},{"name":"variation name","type":"' + play.type + '","note":"what is different and when to use it","changeFrom":"what changed"},{"name":"variation name","type":"' + play.type + '","note":"what is different and when to use it","changeFrom":"what changed"}]}')
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
      const raw = await callAI('You are an expert ' + sportName + ' analyst. A youth coach is running: "' + play.name + '" (' + play.type + '). ' + play.note + ' Find the closest real ' + league + ' equivalent. Return ONLY valid JSON: {"proPlay":"exact name","proTeam":"team most known for it","famousExample":"specific famous game moment","whatMatches":"what the youth version gets right","keyDifference":"main tactical difference","proTip":"one thing pros do that youth can develop toward","watchFor":"YouTube search term"}')
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setNflComp(JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1)))
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
      const isBB = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('SET PLAY'))
      const isBSB = play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING') || play.type.includes('OFFENSE SITUATIONAL'))
      const sportCtx = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
      const history = qaHistory.map(item => 'Q: ' + item.q + '\nA: ' + item.a).join('\n\n')
      const context = history ? 'Previous questions:\n' + history + '\n\n' : ''
      const raw = await callAI('You are a youth ' + sportCtx + ' coach educator discussing the play "' + play.name + '" (' + play.type + '). ' + play.note + '\n\n' + context + 'New question: "' + q + '"\n\nAnswer in 2-4 sentences. Be direct and practical.')
      setQAHistory(prev => [...prev, { q, a: raw.trim() }])
    } catch(e) {
      setQAHistory(prev => [...prev, { q, a: 'Error: ' + e.message }])
    }
    setQALoading(false)
  }

  return (
    <div style={{ borderBottom:'1px solid #1e2330' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 0', cursor:'pointer' }} onClick={() => { const newExp = !expanded; setExpanded(newExp); if (newExp) loadSteps() }}>
        <div style={{ width:22, height:22, minWidth:22, background:P, color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{play.number}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{play.name}</div>
          <div style={{ fontSize:10, color:'#6b7a96', fontFamily:"'DM Mono',monospace", marginTop:1 }}>{play.type}</div>
          <div style={{ fontSize:11, color:'#6b7a96', marginTop:3, lineHeight:1.4 }}>{play.note}</div>
          <div style={{ fontSize:10, color:P, marginTop:4 }}>{expanded ? '▲ Tap to collapse' : '▼ Tap to expand breakdown + diagram'}</div>
        </div>
        <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
          {extraAction && <span onClick={e=>e.stopPropagation()}>{extraAction}</span>}
          <button onClick={e => { e.stopPropagation(); setShowAnim(a => !a); if (!expanded) setExpanded(true) }} style={{ padding:'4px 9px', background:showAnim ? P : `rgba(${pr},${pg},${pb},0.12)`, border:`1px solid ${P}`, borderRadius:6, color:showAnim?'white':P, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:0.5, whiteSpace:'nowrap' }}>{showAnim ? 'HIDE PLAY' : 'SHOW PLAY'}</button>
          <span style={{ fontSize:14, color:'#6b7a96', userSelect:'none' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={{ paddingBottom:14, animation:'fadeIn 0.2s ease' }}>
          {showAnim && <div style={{ marginBottom:12 }}><PlayAnimator play={play} P={P} callAI={callAI} parseJSON={parseJSON} autoLoad={showAnim} key={showAnim?'shown':'hidden'} /></div>}

          {stepsLoading && <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, display:'flex', alignItems:'center', gap:10 }}><div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} /><div style={{ fontSize:12, color:'#6b7a96' }}>Generating step-by-step breakdown...</div></div>}

          {steps && steps.huddleCard && steps.huddleCard.length > 0 && (
            <div style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.04))', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, padding:12, marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}><span style={{ fontSize:14 }}>📋</span><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f59e0b', fontWeight:700 }}>Huddle Card — Read This in the Huddle</div></div>
              {steps.huddleCard.map((item, i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}>
                  <div style={{ minWidth:32, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:5, padding:'2px 4px', textAlign:'center', fontSize:9, fontWeight:800, color:'#f59e0b', flexShrink:0, marginTop:1 }}>{item.player}</div>
                  <div style={{ flex:1 }}><span style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{item.instruction}</span>{item.termNote && <span style={{ fontSize:11, color:'#6b7a96', fontStyle:'italic' }}> ({item.termNote})</span>}</div>
                </div>
              ))}
            </div>
          )}

          {steps && !steps.error && (
            <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, border:`1px solid ${al(P,0.2)}` }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:P, fontWeight:700, marginBottom:10 }}>Step-by-Step Breakdown</div>
              {steps.ballCarrier && <div style={{ display:'flex', gap:8, marginBottom:8, padding:'8px 10px', background:`rgba(${pr},${pg},${pb},0.1)`, borderRadius:8, border:`1px solid rgba(${pr},${pg},${pb},0.2)` }}><span style={{ fontSize:11, fontWeight:700, color:P, flexShrink:0 }}>Key Player:</span><span style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{steps.ballCarrier}</span></div>}
              {steps.blockingScheme && <div style={{ display:'flex', gap:8, marginBottom:10, padding:'8px 10px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)' }}><span style={{ fontSize:11, fontWeight:700, color:'#6b9fff', flexShrink:0 }}>Core Concept:</span><span style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{steps.blockingScheme}</span></div>}
              {(steps.steps||[]).map((step, i) => (<div key={i} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:i < steps.steps.length-1 ? '1px solid #1e2330' : 'none' }}><div style={{ width:18, height:18, minWidth:18, background:'#0f1117', border:`1px solid ${P}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:P, flexShrink:0, marginTop:1 }}>{i+1}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{step}</div></div>))}
              {steps.keyCoachingPoints && steps.keyCoachingPoints.length > 0 && (<div style={{ marginTop:10, padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, border:'1px solid rgba(74,222,128,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#4ade80', fontWeight:700, marginBottom:6 }}>Key Coaching Points</div>{steps.keyCoachingPoints.map((pt,i) => <div key={i} style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5, marginBottom:3 }}>• {pt}</div>)}</div>)}
              {steps.whyItWorks && (<div style={{ marginTop:10, padding:'10px 12px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:5 }}>Why This Works</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{steps.whyItWorks}</div></div>)}
              {steps.playerRoles && steps.playerRoles.length > 0 && (<div style={{ marginTop:10 }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:8 }}>Player Roles — What to Tell Each Player</div>{steps.playerRoles.map((role, i) => (<div key={i} style={{ marginBottom:8, padding:'10px 12px', background:'rgba(245,158,11,0.06)', borderRadius:8, border:'1px solid rgba(245,158,11,0.15)' }}><div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}><div style={{ width:26, height:26, minWidth:26, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', color:'#f59e0b', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>{role.position}</div><div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{role.job}</div></div><div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.6, paddingLeft:34, fontStyle:'italic' }}>"Tell your player: {role.whyTheyDoIt}"</div></div>))}</div>)}
            </div>
          )}

          <div style={{ marginBottom:12 }}>
            <button onClick={() => { if(showVariations) { setShowVariations(false) } else { loadVariations() } }} disabled={variationsLoading} style={{ width:'100%', padding:'10px 14px', background:showVariations?al(P,0.15):'#161922', border:`1px solid ${showVariations?P:'#1e2330'}`, borderRadius:10, color:showVariations?P:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:1, cursor:variationsLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
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

          <div style={{ marginBottom:12 }}>
            <button onClick={() => showNfl ? setShowNfl(false) : loadNflComp()} disabled={nflLoading} style={{ width:'100%', padding:'10px 14px', background:showNfl?'rgba(255,215,0,0.1)':'#161922', border:`1px solid ${showNfl?'rgba(255,215,0,0.5)':'#1e2330'}`, borderRadius:10, color:showNfl?'#f59e0b':'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:1, cursor:nflLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:16 }}>{play.type&&(play.type.includes('COURT')||play.type.includes('INBOUND')||play.type.includes('SET PLAY'))?'🏀':play.type&&(play.type.includes('BATTING')||play.type.includes('BASERUN')||play.type.includes('PITCHING'))?'⚾':'🏈'}</span>{nflLoading ? 'FINDING PRO EQUIVALENT...' : 'PRO COMPARISON'}</span>
              <span style={{ fontSize:11 }}>{showNfl ? '▲ HIDE' : '▼ SEE NFL/NBA/MLB VERSION'}</span>
            </button>
            {showNfl && nflComp && !nflComp.error && (
              <div style={{ marginTop:8, background:'linear-gradient(135deg,rgba(255,215,0,0.06),rgba(255,165,0,0.04))', border:'1px solid rgba(255,215,0,0.25)', borderRadius:10, padding:14, animation:'fadeIn 0.2s ease' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:3 }}>Pro Equivalent</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, letterSpacing:1, color:'#f2f4f8' }}>{nflComp.proPlay}</div>
                    <div style={{ fontSize:12, color:'#f59e0b', marginTop:2 }}>{nflComp.proTeam}</div>
                  </div>
                  <div style={{ width:44, height:44, background:'rgba(255,215,0,0.15)', border:'1px solid rgba(255,215,0,0.3)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>⭐</div>
                </div>
                {nflComp.famousExample && (<div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.3)', borderRadius:8, marginBottom:10, borderLeft:'3px solid #f59e0b' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:3 }}>Famous Example</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{nflComp.famousExample}</div></div>)}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                  <div style={{ padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, border:'1px solid rgba(74,222,128,0.15)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#4ade80', fontWeight:700, marginBottom:4 }}>What Matches</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{nflComp.whatMatches}</div></div>
                  <div style={{ padding:'8px 10px', background:'rgba(208,2,27,0.06)', borderRadius:8, border:'1px solid rgba(208,2,27,0.15)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#ff6b6b', fontWeight:700, marginBottom:4 }}>Key Difference</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{nflComp.keyDifference}</div></div>
                </div>
                {nflComp.proTip && (<div style={{ padding:'8px 10px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)', marginBottom:8 }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:4 }}>Pro Tip</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{nflComp.proTip}</div></div>)}
                {nflComp.watchFor && (<div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.3)', borderRadius:8, display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:16 }}>▶</span><div><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:2 }}>Search on YouTube</div><div style={{ fontSize:12, color:'#f59e0b', fontWeight:600 }}>{nflComp.watchFor}</div></div></div>)}
              </div>
            )}
          </div>

          <div style={{ background:'#161922', borderRadius:10, padding:12 }}>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:8 }}>Ask About This Play</div>
            {qaHistory.map((item, i) => (<div key={i} style={{ marginBottom:10 }}><div style={{ fontSize:11, fontWeight:600, color:P, marginBottom:3 }}>Q: {item.q}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.6, padding:'6px 10px', background:'rgba(255,255,255,0.04)', borderRadius:6 }}>{item.a}</div></div>))}
            {qaLoading && <div style={{ fontSize:11, color:'#6b7a96', marginBottom:8 }}>Getting answer...</div>}
            <div style={{ display:'flex', gap:7 }}>
              <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && question.trim()) askQuestion() }} placeholder={qaHistory.length > 0 ? "Ask a follow-up question..." : "e.g. Who runs the ball? Why does the receiver go that way?"} style={{ flex:1, background:'#0f1117', border:'1px solid #1e2330', borderRadius:7, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
              <button onClick={askQuestion} disabled={qaLoading || !question.trim()} style={{ padding:'0 12px', background:qaLoading||!question.trim()?'#3d4559':P, color:'white', border:'none', borderRadius:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:1, cursor:qaLoading||!question.trim()?'not-allowed':'pointer', flexShrink:0 }}>ASK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


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

  const pr = parseInt(P.slice(1,3),16)
  const pg = parseInt(P.slice(3,5),16)
  const pb = parseInt(P.slice(5,7),16)

  useEffect(() => { if (autoLoad && !parsed) generateAnim() }, [autoLoad])

  async function generateAnim() {
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) { const data = JSON.parse(cached); setParsed(data); setSportType(data._sportType || 'football'); return }
    } catch(e) {}
    setLoading(true); setError(''); setParsed(null); setPlaying(false)
    const isBasketball = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('ZONE ATT') || play.type.includes('SET PLAY') || play.type.includes('FAST BREAK') || play.type.includes('HALF COURT'))
    const isBaseball = play.type && (play.type.includes('BASERUN') || play.type.includes('PITCHING') || play.type.includes('INFIELD') || play.type.includes('BATTING') || play.type.includes('OFFENSE SITUATIONAL') || play.type.includes('DEFENSE ALIGN'))
    setSportType(isBasketball ? 'basketball' : isBaseball ? 'baseball' : 'football')

    const fbTemplate = '{"formation":"PLAYNAME","snapPoint":0.18,"duration":3000,"players":[{"id":"LT","label":"T","role":"off","routeType":"block","x":38,"y":38,"path":[[38,38],[35,34]],"routeName":"Block","routeYards":0},{"id":"LG","label":"G","role":"off","routeType":"block","x":42,"y":38,"path":[[42,38],[40,34]],"routeName":"Block","routeYards":0},{"id":"C","label":"C","role":"off","routeType":"block","x":50,"y":38,"path":[[50,38],[50,34]],"routeName":"Block","routeYards":0},{"id":"RG","label":"G","role":"off","routeType":"block","x":58,"y":38,"path":[[58,38],[60,34]],"routeName":"Block","routeYards":0},{"id":"RT","label":"T","role":"off","routeType":"block","x":62,"y":38,"path":[[62,38],[65,34]],"routeName":"Block","routeYards":0},{"id":"QB","label":"QB","role":"off","routeType":"block","x":50,"y":42,"path":[[50,42],[50,44]],"routeName":"Handoff","routeYards":0},{"id":"RB","label":"RB","role":"off","routeType":"route","x":50,"y":46,"path":[[50,46],[52,42],[58,36]],"routeName":"Run","routeYards":7},{"id":"X","label":"X","role":"off","routeType":"route","x":12,"y":38,"path":[[12,38],[12,30]],"routeName":"Go","routeYards":10},{"id":"Z","label":"Z","role":"off","routeType":"route","x":88,"y":38,"path":[[88,38],[88,30]],"routeName":"Go","routeYards":10},{"id":"TE","label":"Y","role":"off","routeType":"block","x":66,"y":38,"path":[[66,38],[66,34]],"routeName":"Block","routeYards":0},{"id":"D1","label":"D","role":"def","routeType":"block","x":42,"y":35,"path":[[42,35],[42,37]],"routeName":"","routeYards":0},{"id":"D2","label":"D","role":"def","routeType":"block","x":50,"y":35,"path":[[50,35],[50,37]],"routeName":"","routeYards":0},{"id":"D3","label":"D","role":"def","routeType":"block","x":58,"y":35,"path":[[58,35],[58,37]],"routeName":"","routeYards":0},{"id":"LB1","label":"LB","role":"def","routeType":"block","x":40,"y":30,"path":[[40,30],[40,32]],"routeName":"","routeYards":0},{"id":"LB2","label":"LB","role":"def","routeType":"block","x":60,"y":30,"path":[[60,30],[60,32]],"routeName":"","routeYards":0},{"id":"CB1","label":"CB","role":"def","routeType":"block","x":12,"y":30,"path":[[12,30],[12,32]],"routeName":"","routeYards":0},{"id":"CB2","label":"CB","role":"def","routeType":"block","x":88,"y":30,"path":[[88,30],[88,32]],"routeName":"","routeYards":0},{"id":"S1","label":"S","role":"def","routeType":"block","x":35,"y":22,"path":[[35,22],[35,24]],"routeName":"","routeYards":0},{"id":"S2","label":"S","role":"def","routeType":"block","x":65,"y":22,"path":[[65,22],[65,24]],"routeName":"","routeYards":0}]}'
    const bbTemplate = '{"formation":"PLAYNAME","snapPoint":0.15,"duration":3500,"players":[{"id":"PG","label":"1","role":"off","routeType":"route","x":50,"y":48,"path":[[50,48],[50,40]],"routeName":"BALL: Dribble","routeYards":0},{"id":"SG","label":"2","role":"off","routeType":"route","x":72,"y":44,"path":[[72,44],[78,32]],"routeName":"CUT: Wing","routeYards":0},{"id":"SF","label":"3","role":"off","routeType":"route","x":82,"y":38,"path":[[82,38],[85,26]],"routeName":"SHOOT: Corner","routeYards":0},{"id":"PF","label":"4","role":"off","routeType":"block","x":62,"y":22,"path":[[62,22],[62,22]],"routeName":"SCREEN: High","routeYards":0},{"id":"C5","label":"5","role":"off","routeType":"block","x":50,"y":17,"path":[[50,17],[50,17]],"routeName":"MOVE: Post","routeYards":0},{"id":"d1","label":"D","role":"def","routeType":"block","x":50,"y":50,"path":[[50,50],[50,51]],"routeName":"","routeYards":0},{"id":"d2","label":"D","role":"def","routeType":"block","x":72,"y":46,"path":[[72,46],[72,47]],"routeName":"","routeYards":0},{"id":"d3","label":"D","role":"def","routeType":"block","x":82,"y":40,"path":[[82,40],[82,41]],"routeName":"","routeYards":0},{"id":"d4","label":"D","role":"def","routeType":"block","x":62,"y":24,"path":[[62,24],[62,25]],"routeName":"","routeYards":0},{"id":"d5","label":"D","role":"def","routeType":"block","x":50,"y":19,"path":[[50,19],[50,20]],"routeName":"","routeYards":0}]}'
    const bsbTemplate = '{"formation":"PLAYNAME","snapPoint":0.2,"duration":3000,"players":[{"id":"P","label":"P","role":"off","routeType":"block","x":50,"y":30,"path":[[50,30],[50,30]],"routeName":"Pitch","routeYards":0},{"id":"C","label":"C","role":"off","routeType":"block","x":50,"y":42,"path":[[50,42],[50,42]],"routeName":"Receive","routeYards":0},{"id":"1B","label":"1B","role":"off","routeType":"block","x":75,"y":42,"path":[[75,42],[75,42]],"routeName":"Hold","routeYards":0},{"id":"2B","label":"2B","role":"off","routeType":"block","x":65,"y":28,"path":[[65,28],[65,28]],"routeName":"Cover","routeYards":0},{"id":"SS","label":"SS","role":"off","routeType":"block","x":38,"y":30,"path":[[38,30],[38,30]],"routeName":"Cover","routeYards":0},{"id":"3B","label":"3B","role":"off","routeType":"block","x":25,"y":42,"path":[[25,42],[25,42]],"routeName":"Hold","routeYards":0},{"id":"LF","label":"LF","role":"off","routeType":"block","x":20,"y":12,"path":[[20,12],[20,12]],"routeName":"Pos","routeYards":0},{"id":"CF","label":"CF","role":"off","routeType":"block","x":50,"y":8,"path":[[50,8],[50,8]],"routeName":"Pos","routeYards":0},{"id":"RF","label":"RF","role":"off","routeType":"block","x":80,"y":12,"path":[[80,12],[80,12]],"routeName":"Pos","routeYards":0},{"id":"BAT","label":"B","role":"def","routeType":"route","x":50,"y":44,"path":[[50,44],[60,38]],"routeName":"Run","routeYards":0},{"id":"R1","label":"R","role":"def","routeType":"route","x":25,"y":42,"path":[[25,42],[25,42]],"routeName":"","routeYards":0}]}'

    const isDefense = play._isDefense === true
    const isDisguise = play._isDisguise === true

    let prompt
    if (isDisguise) {
      prompt = 'Generate a DISGUISE defensive diagram for: ' + play.name + '. ' + play.note + ' Show defenders in PRE-SNAP fake look for first 40% then moving to TRUE assignment. routeName format: FAKE: for pre-snap, TRUE: for real assignment. snapPoint 0.40. Return ONLY raw JSON using this template: {"formation":"' + play.name.replace(/"/g,"") + '","snapPoint":0.40,"duration":3500,"players":[{"id":"DEa","label":"DE","role":"def","routeType":"route","x":38,"y":35,"path":[[38,35],[42,32],[42,32],[38,38]],"routeName":"FAKE: Walk up","routeYards":0},{"id":"DTa","label":"DT","role":"def","routeType":"block","x":45,"y":35,"path":[[45,35],[45,38]],"routeName":"TRUE: Gap A","routeYards":0},{"id":"DTb","label":"DT","role":"def","routeType":"block","x":55,"y":35,"path":[[55,35],[55,38]],"routeName":"TRUE: Gap A","routeYards":0},{"id":"DEb","label":"DE","role":"def","routeType":"route","x":62,"y":35,"path":[[62,35],[58,32],[58,32],[62,38]],"routeName":"FAKE: Show Blitz","routeYards":0},{"id":"WLB","label":"WLB","role":"def","routeType":"route","x":34,"y":28,"path":[[34,28],[34,32],[34,32],[30,34]],"routeName":"FAKE: Press Man","routeYards":0},{"id":"MLB","label":"MLB","role":"def","routeType":"route","x":50,"y":27,"path":[[50,27],[50,27],[50,27],[50,33]],"routeName":"TRUE: Hook Zone","routeYards":0},{"id":"SLB","label":"SLB","role":"def","routeType":"route","x":66,"y":28,"path":[[66,28],[66,32],[66,32],[70,34]],"routeName":"FAKE: Show Blitz","routeYards":0},{"id":"CBa","label":"CB","role":"def","routeType":"route","x":12,"y":35,"path":[[12,35],[12,30],[12,30],[12,24]],"routeName":"FAKE: Press Zone","routeYards":0},{"id":"CBb","label":"CB","role":"def","routeType":"route","x":88,"y":35,"path":[[88,35],[88,30],[88,30],[88,24]],"routeName":"FAKE: Press Zone","routeYards":0},{"id":"SS","label":"SS","role":"def","routeType":"route","x":66,"y":20,"path":[[66,20],[58,24],[58,24],[58,26]],"routeName":"FAKE: Man then Half","routeYards":0},{"id":"FS","label":"FS","role":"def","routeType":"route","x":50,"y":14,"path":[[50,14],[50,14],[50,14],[50,20]],"routeName":"TRUE: Deep Middle","routeYards":0},{"id":"OC","label":"C","role":"off","routeType":"block","x":50,"y":38,"path":[[50,38],[50,38]],"routeName":"","routeYards":0},{"id":"OTa","label":"T","role":"off","routeType":"block","x":38,"y":38,"path":[[38,38],[38,38]],"routeName":"","routeYards":0},{"id":"OTb","label":"T","role":"off","routeType":"block","x":62,"y":38,"path":[[62,38],[62,38]],"routeName":"","routeYards":0}]}'
    } else if (isDefense) {
      prompt = 'Generate a DEFENSIVE football diagram for: ' + play.name + ' (' + play.type + '). ' + play.note + ' Show 11 defenders with assignments. Include 5 offensive linemen as STATIC reference. Defender routeNames: use Gap A/B/C for DL, Hook Zone/Flat Zone/Deep Half/Deep Third/Man Coverage/Blitz for others. Return ONLY raw JSON: {"formation":"' + play.name.replace(/"/g,"") + '","snapPoint":0.15,"duration":3000,"players":[{"id":"DEa","label":"DE","role":"def","routeType":"block","x":38,"y":35,"path":[[38,35],[35,38]],"routeName":"Gap B","routeYards":0},{"id":"DTa","label":"DT","role":"def","routeType":"block","x":45,"y":35,"path":[[45,35],[45,38]],"routeName":"Gap A","routeYards":0},{"id":"DTb","label":"DT","role":"def","routeType":"block","x":55,"y":35,"path":[[55,35],[55,38]],"routeName":"Gap A","routeYards":0},{"id":"DEb","label":"DE","role":"def","routeType":"block","x":62,"y":35,"path":[[62,35],[65,38]],"routeName":"Gap B","routeYards":0},{"id":"WLB","label":"WLB","role":"def","routeType":"route","x":34,"y":28,"path":[[34,28],[30,34]],"routeName":"Flat Zone","routeYards":0},{"id":"MLB","label":"MLB","role":"def","routeType":"route","x":50,"y":27,"path":[[50,27],[50,33]],"routeName":"Hook Zone","routeYards":0},{"id":"SLB","label":"SLB","role":"def","routeType":"route","x":66,"y":28,"path":[[66,28],[70,34]],"routeName":"Flat Zone","routeYards":0},{"id":"CBa","label":"CB","role":"def","routeType":"route","x":12,"y":35,"path":[[12,35],[12,24]],"routeName":"Man Coverage","routeYards":0},{"id":"CBb","label":"CB","role":"def","routeType":"route","x":88,"y":35,"path":[[88,35],[88,24]],"routeName":"Man Coverage","routeYards":0},{"id":"SS","label":"SS","role":"def","routeType":"route","x":66,"y":20,"path":[[66,20],[58,26]],"routeName":"Deep Half","routeYards":0},{"id":"FS","label":"FS","role":"def","routeType":"route","x":50,"y":14,"path":[[50,14],[50,20]],"routeName":"Deep Middle","routeYards":0},{"id":"OTa","label":"T","role":"off","routeType":"block","x":38,"y":38,"path":[[38,38],[38,38]],"routeName":"","routeYards":0},{"id":"OGa","label":"G","role":"off","routeType":"block","x":44,"y":38,"path":[[44,38],[44,38]],"routeName":"","routeYards":0},{"id":"OC","label":"C","role":"off","routeType":"block","x":50,"y":38,"path":[[50,38],[50,38]],"routeName":"","routeYards":0},{"id":"OGb","label":"G","role":"off","routeType":"block","x":56,"y":38,"path":[[56,38],[56,38]],"routeName":"","routeYards":0},{"id":"OTb","label":"T","role":"off","routeType":"block","x":62,"y":38,"path":[[62,38],[62,38]],"routeName":"","routeYards":0}]}'
    } else if (isBasketball) {
      prompt = 'Generate basketball play diagram for: ' + play.name + ' (' + play.type + '). ' + play.note + ' CRITICAL: ONE player routeName starts with BALL: (has ball), ONE starts with SHOOT: (receives for shot), others use CUT:, MOVE:, or SCREEN. snapPoint 0.12. Return ONLY raw JSON using this template: ' + bbTemplate.replace('PLAYNAME', play.name)
    } else if (isBaseball) {
      prompt = 'Generate baseball defensive positioning diagram for: ' + play.name + ' (' + play.type + '). ' + play.note + ' Show 9 fielders in correct positions. Return ONLY raw JSON using this template: ' + bsbTemplate.replace('PLAYNAME', play.name)
    } else {
      prompt = 'Generate football play diagram for: ' + play.name + ' (' + play.type + '). ' + play.note + ' CRITICAL: QB on RUN plays set routeName to Handoff. Ball carrier path must show FULL run lane past y=38 minimum 8-10 units. Each receiver has named route (Curl, Slant, Post, Out, Corner, Go, Cross, Flat). Return ONLY raw JSON using this template: ' + fbTemplate.replace('PLAYNAME', play.name)
    }

    try {
      const raw = await callAI(prompt)
      const data = parseJSON(raw)
      if (!data.players || data.players.length === 0) throw new Error('No players returned')
      data._sportType = isBasketball ? 'basketball' : isBaseball ? 'baseball' : 'football'
      try { sessionStorage.setItem(cacheKey, JSON.stringify(data)) } catch(e) {}
      setParsed(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  useEffect(() => {
    if (!parsed || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
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
      return { x: sx(lerp(path[seg][0], path[seg+1][0], st)), y: sy(lerp(path[seg][1], path[seg+1][1], st)) }
    }

    const isBBall = sportType === 'basketball'
    const isBSB = sportType === 'baseball'
    const r = W * 0.016

    function arrow(ctx, ex, ey, nx, ny, size) {
      const angle = Math.atan2(ny, nx), a = 0.45
      ctx.beginPath(); ctx.moveTo(ex, ey)
      ctx.lineTo(ex - size*Math.cos(angle-a), ey - size*Math.sin(angle-a))
      ctx.lineTo(ex - size*Math.cos(angle+a), ey - size*Math.sin(angle+a))
      ctx.closePath(); ctx.fill()
    }
    function perp(ctx, ex, ey, nx, ny, size) {
      const px = -ny, py = nx
      ctx.beginPath(); ctx.moveTo(ex - px*size, ey - py*size); ctx.lineTo(ex + px*size, ey + py*size); ctx.stroke()
    }

    function drawField() {
      if (isBBall) {
        ctx.fillStyle = '#c4893e'; ctx.fillRect(0,0,W,H)
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 2; ctx.strokeRect(sx(4),sy(3),sx(92),sy(94))
        ctx.fillStyle = 'rgba(160,50,50,0.2)'; ctx.fillRect(sx(37),sy(6),sx(26),sy(24))
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5; ctx.strokeRect(sx(37),sy(6),sx(26),sy(24))
        ctx.beginPath(); ctx.moveTo(sx(37),sy(30)); ctx.lineTo(sx(63),sy(30)); ctx.stroke()
        ctx.beginPath(); ctx.arc(sx(50),sy(30),sx(12),0,Math.PI*2); ctx.stroke()
        ctx.fillStyle = '#e05020'; ctx.beginPath(); ctx.arc(sx(50),sy(6),sx(2.5),0,Math.PI*2); ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(sx(50),sy(6),sx(2.5),0,Math.PI*2); ctx.stroke()
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(sx(41),sy(3.5)); ctx.lineTo(sx(59),sy(3.5)); ctx.stroke()
        ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(sx(7),sy(3)); ctx.lineTo(sx(7),sy(34)); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(sx(93),sy(3)); ctx.lineTo(sx(93),sy(34)); ctx.stroke()
        const r3 = Math.sqrt(Math.pow(sx(50)-sx(7),2)+Math.pow(sy(6)-sy(34),2))
        const sa = Math.atan2(sy(34)-sy(6),sx(7)-sx(50)), ea = Math.atan2(sy(34)-sy(6),sx(93)-sx(50))
        ctx.beginPath(); ctx.arc(sx(50),sy(6),r3,sa,ea,false); ctx.stroke()
      } else if (isBSB) {
        ctx.fillStyle = '#2d7a2d'; ctx.fillRect(0,0,W,H)
        ctx.fillStyle = '#c4955a'
        ctx.beginPath(); ctx.moveTo(sx(50),sy(42)); ctx.lineTo(sx(75),sy(28)); ctx.lineTo(sx(50),sy(14)); ctx.lineTo(sx(25),sy(28)); ctx.closePath(); ctx.fill()
        ctx.beginPath(); ctx.arc(sx(50),sy(28),sx(18),0,Math.PI*2); ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(sx(50),sy(42)); ctx.lineTo(sx(5),sy(5)); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(sx(50),sy(42)); ctx.lineTo(sx(95),sy(5)); ctx.stroke()
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(sx(50),sy(42),sy(40),Math.PI*1.2,Math.PI*1.8,false); ctx.stroke()
        [[50,42,'HP'],[75,28,'1B'],[50,14,'2B'],[25,28,'3B']].forEach(([bx,by,lbl]) => {
          ctx.fillStyle = lbl==='HP'?'#aaa':'white'; ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1
          const bs = sx(2.5); ctx.save(); ctx.translate(sx(bx),sy(by)); ctx.rotate(Math.PI/4); ctx.fillRect(-bs/2,-bs/2,bs,bs); ctx.strokeRect(-bs/2,-bs/2,bs,bs); ctx.restore()
          ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.font=`bold ${Math.round(sx(2))}px sans-serif`; ctx.textAlign='center'; ctx.fillText(lbl,sx(bx),sy(by)-sx(3))
        })
        ctx.fillStyle='#b8885a'; ctx.beginPath(); ctx.arc(sx(50),sy(28),sx(3),0,Math.PI*2); ctx.fill()
      } else {
        ctx.fillStyle = '#f8f8f4'; ctx.fillRect(0,0,W,H)
        ctx.strokeStyle='rgba(0,0,0,0.08)'; ctx.lineWidth=1
        for (let y=0;y<=60;y+=6) { ctx.beginPath(); ctx.moveTo(0,sy(y)); ctx.lineTo(W,sy(y)); ctx.stroke() }
        ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1.5; ctx.setLineDash([8,5])
        ctx.beginPath(); ctx.moveTo(0,sy(38)); ctx.lineTo(W,sy(38)); ctx.stroke(); ctx.setLineDash([])
      }
    }

    function getBBRole(player) {
      const rn = player.routeName || ''
      if (rn.startsWith('BALL:')) return 'ball'
      if (rn.startsWith('SHOOT:')) return 'shooter'
      if (rn.startsWith('PASS:')) return 'pass'
      if (rn === 'SCREEN' || rn.startsWith('SCREEN:')) return 'screen'
      if (rn.startsWith('CUT:')) return 'cut'
      return 'move'
    }

    function draw(t) {
      ctx.clearRect(0,0,W,H); drawField()

      const defPlayers = (parsed.players||[]).filter(p=>p.role==='def')
      const offPlayers = (parsed.players||[]).filter(p=>p.role==='off')
      const isDefDiagram = defPlayers.length >= offPlayers.length

      if (isDefDiagram && !isBBall && !isBSB) {
        defPlayers.forEach(player => {
          if (!player.routeName) return
          const pos = getPos(player, t < snap ? 0 : t)
          const rn = (player.routeName||'').toLowerCase()
          const isDeep = rn.includes('deep') || rn.includes('half') || player.label==='FS' || player.label==='SS'
          const isMid = rn.includes('hook') || rn.includes('mid') || player.label==='MLB'
          const isFlat = rn.includes('flat') || rn.includes('out') || player.label==='WLB' || player.label==='SLB'
          if (isDeep || isMid || isFlat) {
            const zoneW = isDeep?sx(26):isFlat?sx(15):sx(18)
            const zoneH = isDeep?sy(9):isFlat?sy(7):sy(8)
            const zoneColor = isDeep?'rgba(30,80,220,0.18)':isMid?'rgba(180,160,0,0.18)':'rgba(0,140,90,0.18)'
            const borderColor = isDeep?'rgba(30,80,220,0.55)':isMid?'rgba(180,160,0,0.6)':'rgba(0,140,90,0.55)'
            const yOff = isDeep?-sy(5):isMid?-sy(3):-sy(2.5)
            ctx.save(); ctx.translate(pos.x,pos.y+yOff); ctx.scale(1,0.52)
            ctx.fillStyle=zoneColor; ctx.strokeStyle=borderColor; ctx.lineWidth=1.5; ctx.setLineDash([5,3])
            ctx.beginPath(); ctx.ellipse(0,0,zoneW,zoneH,0,0,Math.PI*2); ctx.fill(); ctx.stroke(); ctx.setLineDash([]); ctx.restore()
          }
        })
      }

      if (t < snap) {
        parsed.players.forEach(player => {
          if (player.role !== 'off') return
          const path = player.path; if (!path || path.length < 2) return
          const isLineman = ['C','G','T'].includes(player.label)
          const isBlock = player.routeType==='block' || isLineman
          const bbRole = isBBall ? getBBRole(player) : null
          const routeColor = isLineman?'rgba(100,100,100,0.5)':isBBall?(bbRole==='ball'?'rgba(245,158,11,0.8)':bbRole==='shooter'?'rgba(74,222,128,0.8)':`rgba(${pr},${pg},${pb},0.7)`): `rgba(${pr},${pg},${pb},0.75)`
          ctx.strokeStyle=routeColor; ctx.lineWidth=isLineman?1:2; ctx.setLineDash([])
          ctx.beginPath(); ctx.moveTo(sx(path[0][0]),sy(path[0][1]))
          for (let i=1;i<path.length;i++) ctx.lineTo(sx(path[i][0]),sy(path[i][1]))
          ctx.stroke()
          const ep=path[path.length-1], pp=path[path.length-2]
          const dx=ep[0]-pp[0], dy=ep[1]-pp[1], dl=Math.sqrt(dx*dx+dy*dy)||1
          const ex=sx(ep[0]), ey=sy(ep[1])
          if (isBlock) { ctx.strokeStyle=routeColor; ctx.lineWidth=1.8; perp(ctx,ex,ey,dx/dl,dy/dl,r*1.4) }
          else { ctx.fillStyle=routeColor; arrow(ctx,ex,ey,dx/dl,dy/dl,r*1.8) }
          if (!isBlock && player.routeName) {
            const midIdx = Math.max(0,Math.floor(path.length/2)-1)
            const lx=sx(path[midIdx][0]), ly=sy(path[midIdx][1])-r*2
            ctx.fillStyle=isBBall?'rgba(200,200,200,0.9)':`rgba(${pr},${pg},${pb},0.9)`
            ctx.font=`bold ${Math.round(r*1.8)}px sans-serif`; ctx.textAlign='center'
            const displayName = player.routeName.replace(/^(BALL:|SHOOT:|PASS:|CUT:|MOVE:|SCREEN:)/,'').trim()
            const displayText = player.routeYards>0?(displayName?displayName+' '+player.routeYards+'yd':player.routeYards+'yd'):displayName
            if (displayText) ctx.fillText(displayText,lx,ly)
          }
        })
      }

      if (t >= snap) {
        const pt = Math.min((t-snap)/(1-snap),1)
        const ballHolder = parsed.players.find(p=>p.role==='off'&&getBBRole(p)==='ball')
        const shooter = parsed.players.find(p=>p.role==='off'&&getBBRole(p)==='shooter')
        const qb = !isBBall&&!isBSB?parsed.players.find(p=>p.id==='QB'):null
        const rb = !isBBall&&!isBSB?parsed.players.find(p=>p.id==='RB'):null
        const passTime = 0.55
        if (isBBall && ballHolder && shooter && pt>=passTime) {
          const pp2 = Math.min(1,(pt-passTime)/0.25)
          const startPos = getPos(ballHolder, snap+(passTime)*(1-snap))
          const endPos = getPos(shooter, t)
          ctx.strokeStyle=`rgba(255,220,50,0.9)`; ctx.lineWidth=2; ctx.setLineDash([6,3])
          ctx.beginPath(); ctx.moveTo(startPos.x,startPos.y)
          const steps=20
          for (let i=1;i<=Math.round(steps*pp2);i++) { const f=i/steps; ctx.lineTo(startPos.x+(endPos.x-startPos.x)*f, startPos.y+(endPos.y-startPos.y)*f-30*f*(1-f)*4) }
          ctx.stroke(); ctx.setLineDash([])
          if (pp2<1) { const f=pp2; const bx=startPos.x+(endPos.x-startPos.x)*f, by=startPos.y+(endPos.y-startPos.y)*f-30*f*(1-f)*4; ctx.fillStyle='#f59e0b'; ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(bx,by,r*0.55,0,Math.PI*2); ctx.fill(); ctx.stroke() }
        }
        if (!isBBall&&!isBSB&&qb&&rb) {
          const qbRN=qb.routeName||''; const isHandoff=qbRN.includes('Handoff')
          if (isHandoff&&pt>=0.1&&pt<=0.4) {
            const hp=Math.min(1,(pt-0.1)/0.2), qbPos=getPos(qb,t), rbPos=getPos(rb,t)
            const bx=qbPos.x+(rbPos.x-qbPos.x)*hp, by=qbPos.y+(rbPos.y-qbPos.y)*hp
            ctx.fillStyle='#b45309'; ctx.strokeStyle='rgba(255,200,50,0.8)'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(bx,by,r*0.6,0,Math.PI*2); ctx.fill(); ctx.stroke()
          }
        }
        parsed.players.forEach(player => {
          if (player.role!=='off') return
          const path=player.path; if (!path||path.length<2) return
          const segs=path.length-1, totalDraw=pt*segs
          const isLineman=['C','G','T'].includes(player.label)
          const isBlock=player.routeType==='block'||isLineman
          const bbRole=isBBall?getBBRole(player):null
          const routeColor=isLineman?'rgba(100,100,100,0.8)':isBBall?(bbRole==='ball'?`rgba(245,158,11,0.95)`:bbRole==='shooter'?`rgba(74,222,128,0.95)`:`rgba(${pr},${pg},${pb},0.9)`): `rgba(${pr},${pg},${pb},0.95)`
          ctx.strokeStyle=routeColor; ctx.lineWidth=isLineman?1.2:2; ctx.setLineDash([])
          ctx.beginPath(); ctx.moveTo(sx(path[0][0]),sy(path[0][1]))
          for (let s=0;s<segs;s++) { const sp=Math.max(0,Math.min(1,totalDraw-s)); if(sp<=0)break; ctx.lineTo(sx(lerp(path[s][0],path[s+1][0],sp)),sy(lerp(path[s][1],path[s+1][1],sp))) }
          ctx.stroke()
          if (totalDraw>=segs*0.88) {
            const ep=path[path.length-1],pp2=path[path.length-2]
            const dx=ep[0]-pp2[0],dy=ep[1]-pp2[1],dl=Math.sqrt(dx*dx+dy*dy)||1
            const ex=sx(ep[0]),ey=sy(ep[1])
            if (isBlock) { ctx.strokeStyle=routeColor; ctx.lineWidth=2; perp(ctx,ex,ey,dx/dl,dy/dl,r*1.4) }
            else { ctx.fillStyle=routeColor; arrow(ctx,ex,ey,dx/dl,dy/dl,r*1.8) }
            if (!isBlock&&player.routeYards>0) { ctx.fillStyle=routeColor; ctx.font=`bold ${Math.round(r*1.7)}px sans-serif`; ctx.textAlign='left'; ctx.fillText(player.routeYards+'yd',ex+r*1.2,ey) }
          }
        })
      }

      parsed.players.forEach(player => {
        const pos = getPos(player, t)
        const isOff = player.role==='off'
        const isLineman = ['C','G','T'].includes(player.label)
        const bbRole = isBBall?getBBRole(player):null
        const defPlayers2 = (parsed.players||[]).filter(p=>p.role==='def')
        const offPlayers2 = (parsed.players||[]).filter(p=>p.role==='off')
        const isDefDiagram2 = defPlayers2.length >= offPlayers2.length

        if (isOff) {
          if (isBBall) {
            const isBallHolder=bbRole==='ball', isShooter=bbRole==='shooter', isScreener=bbRole==='screen'
            const hasPassed=isBBall&&shooter&&t>=snap+(0.55+0.25)*(1-snap)
            if (isBallHolder||isShooter) { ctx.fillStyle=isBallHolder?'rgba(245,158,11,0.25)':'rgba(74,222,128,0.2)'; ctx.beginPath(); ctx.arc(pos.x,pos.y,r*2.4,0,Math.PI*2); ctx.fill() }
            ctx.fillStyle=isBallHolder?'#f59e0b':isShooter?'#4ade80':isScreener?'#888':P; ctx.strokeStyle='white'; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(pos.x,pos.y,r,0,Math.PI*2); ctx.fill(); ctx.stroke()
            if (isBallHolder&&!hasPassed) { ctx.fillStyle='#f59e0b'; ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.arc(pos.x+r*0.95,pos.y-r*0.95,r*0.52,0,Math.PI*2); ctx.fill(); ctx.stroke() }
            if (isShooter&&hasPassed) { ctx.fillStyle='#f59e0b'; ctx.strokeStyle='rgba(0,0,0,0.5)'; ctx.lineWidth=0.5; ctx.beginPath(); ctx.arc(pos.x+r*0.95,pos.y-r*0.95,r*0.52,0,Math.PI*2); ctx.fill(); ctx.stroke() }
            ctx.fillStyle=isBallHolder||isShooter?'#000':'white'; ctx.font=`bold ${Math.round(r*1.05)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(player.label,pos.x,pos.y)
          } else if (isLineman) {
            ctx.fillStyle=P; ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=1.2
            const s=r*0.92; ctx.fillRect(pos.x-s,pos.y-s,s*2,s*2); ctx.strokeRect(pos.x-s,pos.y-s,s*2,s*2)
            ctx.fillStyle='white'; ctx.font=`bold ${Math.round(r)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(player.label,pos.x,pos.y)
          } else {
            ctx.fillStyle=P; ctx.strokeStyle='rgba(255,255,255,0.9)'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.arc(pos.x,pos.y,r,0,Math.PI*2); ctx.fill(); ctx.stroke()
            ctx.fillStyle='white'; ctx.font=`bold ${Math.round(r*1.0)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(player.label,pos.x,pos.y)
          }
        } else {
          if (isDefDiagram2&&!isBBall&&!isBSB) {
            const rn2=(player.routeName||'').toLowerCase()
            const isDL=['DE','DT','NT','DL'].includes(player.label)
            const isBlitz2=rn2.includes('blitz')||rn2.includes('rush')
            ctx.fillStyle=isBlitz2?'rgba(220,80,0,0.9)':`rgba(${pr},${pg},${pb},0.9)`; ctx.strokeStyle='white'; ctx.lineWidth=1.5
            if (isDL) { const s=r*0.92; ctx.fillRect(pos.x-s,pos.y-s,s*2,s*2); ctx.strokeRect(pos.x-s,pos.y-s,s*2,s*2) }
            else { ctx.beginPath(); ctx.arc(pos.x,pos.y,r,0,Math.PI*2); ctx.fill(); ctx.stroke() }
            ctx.fillStyle='white'; ctx.font=`bold ${Math.round(r*0.85)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(player.label,pos.x,pos.y)
          } else {
            ctx.strokeStyle=isBBall?'rgba(120,120,120,0.7)':'rgba(60,60,60,0.75)'; ctx.fillStyle=isBBall?'rgba(120,120,120,0.08)':'rgba(60,60,60,0.08)'; ctx.lineWidth=1.2
            ctx.beginPath(); ctx.arc(pos.x,pos.y,r*0.82,0,Math.PI*2); ctx.fill(); ctx.stroke()
            ctx.fillStyle=isBBall?'rgba(120,120,120,0.7)':'rgba(60,60,60,0.75)'; ctx.font=`${Math.round(r*0.85)}px sans-serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(player.label,pos.x,pos.y)
          }
        }
      })

      if (!isBBall&&!isBSB&&t>=snap&&t<snap+0.07) { ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.font=`bold ${Math.round(H*0.045)}px sans-serif`; ctx.textAlign='center'; ctx.fillText('SNAP',W/2,sy(38)-10) }
    }

    if (playing) {
      startTime = null
      if (animRef.current) cancelAnimationFrame(animRef.current)
      function frame(ts) {
        if (!startTime) startTime = ts
        const t = Math.min((ts-startTime)/dur, 1)
        setProgress(t); draw(t)
        if (t < 1) { animRef.current = requestAnimationFrame(frame) } else { setPlaying(false) }
      }
      animRef.current = requestAnimationFrame(frame)
    } else { draw(0) }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current) }
  }, [parsed, playing, P])

  function replay() { if (animRef.current) cancelAnimationFrame(animRef.current); setProgress(0); setPlaying(true) }

  return (
    <div style={{ marginTop:10, background:'#f0f0ec', borderRadius:10, border:`1px solid rgba(${pr},${pg},${pb},0.3)`, overflow:'hidden' }}>
      <div style={{ padding:'9px 13px', borderBottom:'1px solid rgba(0,0,0,0.1)', display:'flex', alignItems:'center', gap:8, background:'white' }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:1, color:'#222', flex:1 }}>{play.name}</span>
        <span style={{ fontSize:10, color:'#888', fontFamily:"'DM Mono',monospace" }}>{play.type}</span>
        {!parsed && !loading && !autoLoad && (<button onClick={generateAnim} style={{ padding:'4px 12px', background:P, border:'none', borderRadius:6, color:'white', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:1 }}>ANIMATE</button>)}
        {parsed && (<button onClick={replay} disabled={playing} style={{ padding:'4px 12px', background:playing?'#ccc':P, border:'none', borderRadius:6, color:'white', fontSize:10, fontWeight:700, cursor:playing?'not-allowed':'pointer', fontFamily:'inherit', letterSpacing:1 }}>{playing?'PLAYING':'REPLAY'}</button>)}
      </div>
      {loading && <div style={{ padding:14, textAlign:'center', color:'#666', fontSize:12 }}>Generating play diagram...</div>}
      {error && <div style={{ padding:10, color:'#c00', fontSize:11 }}>Error: {error}</div>}
      {parsed && (<div style={{ position:'relative' }}><canvas ref={canvasRef} width={500} height={300} style={{ width:'100%', display:'block' }} /><div style={{ position:'absolute', bottom:6, right:8, background:'rgba(0,0,0,0.4)', borderRadius:4, padding:'1px 6px', fontSize:9, color:'white' }}>{Math.round(progress*100)}%</div></div>)}
    </div>
  )
}


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
  const ageGroup = f.ageGroup || ''
  const showDisguiseFeature = !ageGroup || (!ageGroup.includes('6-8') && !ageGroup.includes('9-10'))
  const pr = parseInt(S.slice(1,3),16), pg = parseInt(S.slice(3,5),16), pb = parseInt(S.slice(5,7),16)

  async function loadSteps() {
    if (steps) return
    setStepsLoading(true)
    try {
      const sportLabel = sport || 'football'
      const raw = await callAI('You are a youth ' + sportLabel + ' defensive coordinator educator. Break down this defensive formation: "' + f.name + '" (' + f.type + '). Assignment: ' + f.assignment + '. When to use: ' + f.whenToUse + ' Return ONLY valid JSON: {"keyAssignment":"most important assignment","coverageType":"zone, man, or combination","steps":["Step 1","Step 2","Step 3","Step 4","Step 5"],"keyCoachingPoints":["point 1","point 2","point 3"],"whyItWorks":"why this defense works","playerRoles":[{"position":"DL","job":"assignment","whyTheyDoIt":"explain to a 12yr old"},{"position":"LB","job":"assignment","whyTheyDoIt":"explain why"},{"position":"CB","job":"assignment","whyTheyDoIt":"explain why"},{"position":"Safety","job":"assignment","whyTheyDoIt":"explain why"}],"huddleCard":[{"player":"DL","instruction":"one sentence","termNote":"explain jargon or empty string"},{"player":"LB","instruction":"one sentence","termNote":""},{"player":"CB","instruction":"one sentence","termNote":""},{"player":"S","instruction":"one sentence","termNote":""}]}')
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
      const raw = await callAI('You are a youth ' + (sport||'football') + ' defensive coordinator educator. Formation: "' + f.name + '" - ' + f.assignment + '\n\n' + ctx + 'Coach question: "' + q + '" Answer in 2-4 sentences.')
      setQAHistory(prev => [...prev, { q, a: raw.trim() }])
    } catch(e) { setQAHistory(prev => [...prev, { q, a: 'Error: '+e.message }]) }
    setQALoading(false)
  }

  async function loadDisguise() {
    if (disguise) { setShowDisguise(s=>!s); return }
    setDisguiseLoading(true)
    try {
      const raw = await callAI('You are a defensive coordinator teaching disguise for: "' + f.name + '" (' + f.type + '). ' + f.assignment + ' Return ONLY valid JSON: {"presnap":"what to show pre-snap","fakeAlignment":"the false look","snapTrigger":"what happens at snap","qbReads":"what QB thinks","coachingCue":"exact words to say","techniques":[{"player":"position","action":"pre-snap movement","purpose":"why it fools offense"},{"player":"position","action":"action","purpose":"purpose"},{"player":"position","action":"action","purpose":"purpose"}]}')
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
        <button onClick={e=>{e.stopPropagation();setShowAnim(a=>!a);setExpanded(true);loadSteps()}} style={{ padding:'4px 9px', background:showAnim?S:`rgba(${pr},${pg},${pb},0.12)`, border:`1px solid ${S}`, borderRadius:6, color:showAnim?'white':S, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:0.5, whiteSpace:'nowrap', flexShrink:0 }}>{showAnim?'HIDE':'DIAGRAM'}</button>
      </div>
      {expanded && (
        <div style={{ paddingBottom:14, animation:'fadeIn 0.2s ease' }}>
          {showAnim && <div style={{ marginBottom:12 }}><PlayAnimator play={defPlay} P={S} callAI={callAI} parseJSON={parseJSON} autoLoad={true} /></div>}
          {stepsLoading && <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, display:'flex', alignItems:'center', gap:10 }}><div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${S}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} /><div style={{ fontSize:12, color:'#6b7a96' }}>Generating breakdown...</div></div>}
          {steps && steps.huddleCard && steps.huddleCard.length > 0 && (
            <div style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.04))', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, padding:12, marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}><span style={{ fontSize:14 }}>📋</span><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f59e0b', fontWeight:700 }}>Huddle Card</div></div>
              {steps.huddleCard.map((item,i) => (<div key={i} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}><div style={{ minWidth:32, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:5, padding:'2px 4px', textAlign:'center', fontSize:9, fontWeight:800, color:'#f59e0b', flexShrink:0, marginTop:1 }}>{item.player}</div><div style={{ flex:1 }}><span style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{item.instruction}</span>{item.termNote&&<span style={{ fontSize:11, color:'#6b7a96', fontStyle:'italic' }}> ({item.termNote})</span>}</div></div>))}
            </div>
          )}
          {steps && !steps.error && (
            <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, border:`1px solid rgba(${pr},${pg},${pb},0.2)` }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:S, fontWeight:700, marginBottom:10 }}>Defensive Breakdown</div>
              {steps.keyAssignment&&<div style={{ padding:'8px 10px', background:`rgba(${pr},${pg},${pb},0.1)`, border:`1px solid rgba(${pr},${pg},${pb},0.25)`, borderRadius:8, marginBottom:8 }}><div style={{ fontSize:9, letterSpacing:1.5, color:S, fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Key Assignment</div><div style={{ fontSize:12, color:'#f2f4f8', fontWeight:600 }}>{steps.keyAssignment}</div></div>}
              {steps.coverageType&&<div style={{ padding:'8px 10px', background:'rgba(107,154,255,0.08)', borderRadius:8, marginBottom:8, border:'1px solid rgba(107,154,255,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#6b9fff', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Coverage Type</div><div style={{ fontSize:12, color:'#f2f4f8' }}>{steps.coverageType}</div></div>}
              {(steps.steps||[]).map((step,i) => (<div key={i} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:i<steps.steps.length-1?'1px solid #1e2330':'none' }}><div style={{ width:18, height:18, minWidth:18, background:'#0f1117', border:`1px solid ${S}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:S, flexShrink:0, marginTop:1 }}>{i+1}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{step}</div></div>))}
              {steps.keyCoachingPoints&&steps.keyCoachingPoints.length>0&&(<div style={{ marginTop:10, padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, border:'1px solid rgba(74,222,128,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#4ade80', fontWeight:700, marginBottom:6 }}>Key Coaching Points</div>{steps.keyCoachingPoints.map((pt,i)=><div key={i} style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5, marginBottom:3 }}>• {pt}</div>)}</div>)}
              {steps.whyItWorks&&(<div style={{ marginTop:10, padding:'10px 12px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:5 }}>Why This Works</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{steps.whyItWorks}</div></div>)}
              {steps.playerRoles&&steps.playerRoles.length>0&&(<div style={{ marginTop:10 }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:8 }}>What to Tell Each Player</div>{steps.playerRoles.map((role,i)=>(<div key={i} style={{ marginBottom:8, padding:'10px 12px', background:'rgba(245,158,11,0.06)', borderRadius:8, border:'1px solid rgba(245,158,11,0.15)' }}><div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}><div style={{ width:26, height:26, minWidth:26, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', color:'#f59e0b', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>{role.position}</div><div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{role.job}</div></div><div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.6, paddingLeft:34, fontStyle:'italic' }}>"Tell your player: {role.whyTheyDoIt}"</div></div>))}</div>)}
            </div>
          )}
          <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12 }}>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:8 }}>Ask About This Formation</div>
            {qaHistory.map((item,i)=>(<div key={i} style={{ marginBottom:10 }}><div style={{ fontSize:11, fontWeight:600, color:S, marginBottom:3 }}>Q: {item.q}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.6, padding:'6px 10px', background:'rgba(255,255,255,0.04)', borderRadius:6 }}>{item.a}</div></div>))}
            {qaLoading&&<div style={{ fontSize:11, color:'#6b7a96', marginBottom:8 }}>Getting answer...</div>}
            <div style={{ display:'flex', gap:7 }}>
              <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&question.trim())askQuestion()}} placeholder="e.g. What is the CB responsible for?" style={{ flex:1, background:'#0f1117', border:'1px solid #1e2330', borderRadius:7, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
              <button onClick={askQuestion} disabled={qaLoading||!question.trim()} style={{ padding:'0 12px', background:qaLoading||!question.trim()?'#3d4559':S, color:'white', border:'none', borderRadius:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, letterSpacing:1, cursor:qaLoading||!question.trim()?'not-allowed':'pointer', flexShrink:0 }}>ASK</button>
            </div>
          </div>
          {showDisguiseFeature && (
            <div>
              <button onClick={loadDisguise} disabled={disguiseLoading} style={{ width:'100%', padding:'10px 14px', background:showDisguise?'rgba(180,0,220,0.12)':'#161922', border:`1px solid ${showDisguise?'rgba(180,0,220,0.4)':'#1e2330'}`, borderRadius:10, color:showDisguise?'#c084fc':'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:1, cursor:disguiseLoading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ fontSize:15 }}>🎭</span>{disguiseLoading?'GENERATING DISGUISE...':'DISGUISE THIS COVERAGE'}</span>
                <span style={{ fontSize:11 }}>{showDisguise?'▲ HIDE':'▼ HOW TO FOOL THE QB'}</span>
              </button>
              {showDisguise&&disguise&&!disguise.error&&(
                <div style={{ marginTop:8, background:'rgba(180,0,220,0.06)', border:'1px solid rgba(180,0,220,0.25)', borderRadius:10, padding:14, animation:'fadeIn 0.2s ease' }}>
                  <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#c084fc', fontWeight:700, marginBottom:10 }}>Pre-Snap Disguise</div>
                  <div style={{ padding:'8px 10px', background:'rgba(180,0,220,0.08)', borderRadius:8, marginBottom:8, borderLeft:'3px solid rgba(180,0,220,0.5)' }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>What to Show Pre-Snap</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{disguise.presnap}</div></div>
                  <div style={{ marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>Disguise Movement Diagram</div><PlayAnimator play={{ name:f.name+' DISGUISE', type:'DISGUISE', note:'Pre-snap: '+(disguise.fakeAlignment||'')+'. At snap: '+(disguise.snapTrigger||'')+'. True assignment: '+f.assignment, _isDefense:true, _isDisguise:true }} P="rgba(180,0,220,0.9)" callAI={callAI} parseJSON={parseJSON} autoLoad={true} /></div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                    <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.25)', borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Fake Look</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{disguise.fakeAlignment}</div></div>
                    <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.25)', borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>At Snap</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{disguise.snapTrigger}</div></div>
                  </div>
                  {disguise.qbReads&&(<div style={{ padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, marginBottom:10, border:'1px solid rgba(74,222,128,0.15)' }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#4ade80', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>What the QB Sees</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{disguise.qbReads}</div></div>)}
                  {disguise.techniques&&disguise.techniques.length>0&&(<div style={{ marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>Player-by-Player Disguise Moves</div>{disguise.techniques.map((t,i)=>(<div key={i} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:i<disguise.techniques.length-1?'1px solid rgba(180,0,220,0.15)':'none' }}><div style={{ width:26, height:26, minWidth:26, background:'rgba(180,0,220,0.15)', border:'1px solid rgba(180,0,220,0.3)', color:'#c084fc', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, flexShrink:0 }}>{t.player}</div><div style={{ flex:1 }}><div style={{ fontSize:11, color:'#f2f4f8', fontWeight:600, marginBottom:2 }}>{t.action}</div><div style={{ fontSize:10, color:'#6b7a96', lineHeight:1.4 }}>{t.purpose}</div></div></div>))}</div>)}
                  {disguise.coachingCue&&(<div style={{ padding:'8px 10px', background:'rgba(180,0,220,0.08)', borderRadius:8, borderLeft:'3px solid rgba(180,0,220,0.5)' }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Coaching Cue</div><div style={{ fontSize:12, color:'#f2f4f8', fontStyle:'italic' }}>"{disguise.coachingCue}"</div></div>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

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
        <button onClick={()=>setShowAnim(a=>!a)} style={{ padding:'4px 9px', background:showAnim?P:al(P,0.12), border:`1px solid ${P}`, borderRadius:6, color:showAnim?'white':P, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:0.5, whiteSpace:'nowrap', flexShrink:0 }}>{showAnim?'HIDE':'DIAGRAM'}</button>
      </div>
      {showAnim && <PlayAnimator play={play} P={P} callAI={callAI} parseJSON={parseJSON} autoLoad={true} />}
    </div>
  )
}


function DefenseGen({ sport, P, S, al, callAI, parseJSON }) {
  const isFB = sport==='Football', isBB = sport==='Basketball', isBSB = sport==='Baseball'
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
  const cfg = isBB?bbFields:isBSB?bsbFields:fbFields
  const initF = () => { const f={}; cfg.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [fields, setFields] = useState(initF)
  const [prevSport, setPrevSport] = useState(sport)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)

  if (sport !== prevSport) { setPrevSport(sport); setFields(initF()); setResult(null); setError('') }
  const activeCfg = isBB?bbFields:isBSB?bsbFields:fbFields

  async function generate() {
    setLoading(true); setResult(null); setError('')
    const inputSummary = Object.keys(fields).map(k=>k+': '+fields[k]).join(', ')
    const prompt = isFB
      ? 'You are an elite youth football defensive coordinator. Build a defensive game plan. '+inputSummary+'. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive formation name","type":"BASE or NICKEL or BLITZ or ZONE or MAN","assignment":"specific gap assignments and coverage responsibilities","whenToUse":"exact game situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"most important thing to stop","adjustmentTip":"halftime adjustment","coachingCue":"defensive phrase"}'
      : isBB
      ? 'You are an elite youth basketball defensive coach. Build a defensive game plan. '+inputSummary+'. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive scheme name","type":"MAN or ZONE or PRESS or TRAP","assignment":"specific player assignments and rotations","whenToUse":"exact game situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"most important thing to take away","adjustmentTip":"halftime adjustment","coachingCue":"defensive motto"}'
      : 'You are an elite youth baseball manager. Build a defensive game plan. '+inputSummary+'. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive alignment name","type":"STANDARD or SHIFT or WHEEL or FIVE MAN INFIELD or OUTFIELD DEPTH","assignment":"specific positioning for all fielders and pitcher strategy","whenToUse":"exact count or game situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"most important out to get","adjustmentTip":"adjustment if they hit well","coachingCue":"defensive focus phrase"}'
    try {
      const raw = await callAI(prompt)
      const data = parseJSON(raw)
      if (!data.formations) throw new Error('No formations in response')
      setResult(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  const title = isBSB?sport+' Defensive Positioning':sport+' Defensive Scheme Generator'
  const btnText = isBSB?'BUILD DEFENSIVE PLAN':'BUILD DEFENSIVE SCHEME'

  return (
    <Card>
      <div style={{ padding:'12px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${S}`, cursor:'pointer' }} onClick={() => setExpanded(e=>!e)}>
        <span style={{ fontSize:15 }}>🛡</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:1, color:'#f2f4f8', flex:1 }}>{title}</span>
        <span style={{ fontSize:9, fontWeight:700, letterSpacing:1, padding:'2px 7px', borderRadius:10, background:al(S,0.15), color:S }}>DEFENSIVE</span>
        <span style={{ fontSize:12, color:'#6b7a96' }}>{expanded?'▲':'▼'}</span>
      </div>
      {expanded && (
        <div style={{ padding:14, animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            {activeCfg.map(f => (<Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />))}
          </div>
          <PBtn onClick={generate} disabled={loading} color={S}>{loading?'BUILDING...':btnText}</PBtn>
          {loading && <Shimmer />}
          {error && <ErrBox msg={error} />}
          {result && (
            <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(S,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, letterSpacing:1, color:S, marginBottom:8 }}>{result.packageName}</div>
              <p style={{ fontSize:12, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>{result.summary}</p>
              {result.keyStop&&(<div style={{ padding:'8px 12px', background:al(S,0.1), border:`1px solid ${al(S,0.25)}`, borderRadius:8, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Primary Assignment</div><div style={{ fontSize:13, color:'#f2f4f8', fontWeight:600 }}>{result.keyStop}</div></div>)}
              {(result.formations||[]).map(f => (<DefFormationCard key={f.number} formation={f} S={S} P={P} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} />))}
              {result.adjustmentTip&&(<div style={{ marginTop:10, padding:10, background:'#0f1117', borderRadius:8, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Halftime Adjustment</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{result.adjustmentTip}</div></div>)}
              {result.coachingCue&&(<div style={{ marginTop:8, padding:10, background:al(S,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Defensive Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic', fontWeight:500 }}>"{result.coachingCue}"</div></div>)}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}


function SituationalPanel({ sport, P, S, al, callAI }) {
  const isFB=sport==='Football', isBB=sport==='Basketball', isBSB=sport==='Baseball'
  const [down,setDown]=useState('3rd'), [distance,setDistance]=useState('5'), [fieldPos,setFieldPos]=useState('OPP 28'), [score,setScore]=useState('UP 3'), [timeLeft,setTimeLeft]=useState('4:22')
  const [fbRec,setFbRec]=useState([{n:'1',top:true,name:'Slot Cross / Hi-Lo',why:'Attacks Cover 2 void',pct:'84%'},{n:'2',top:false,name:'QB Draw',why:'Exploit aggressive pass rush',pct:'61%'},{n:'3',top:false,name:'Four Verticals',why:'Force single coverage',pct:'43%'}])
  const [fbLoading,setFbLoading]=useState(false)
  const [quarter,setQuarter]=useState('3rd'), [bbScore,setBbScore]=useState('UP 4'), [possession,setPossession]=useState('Offense'), [fouls,setFouls]=useState('2 team fouls'), [timeouts,setTimeouts]=useState('2 remaining'), [shotClock,setShotClock]=useState('14s')
  const [bbRec,setBbRec]=useState(null), [bbLoading,setBbLoading]=useState(false)
  const [inning,setInning]=useState('5th'), [halfInning,setHalfInning]=useState('Top'), [outs,setOuts]=useState('1'), [balls,setBalls]=useState('2'), [strikes,setStrikes]=useState('1'), [runners,setRunners]=useState('Runner on 1st')
  const [bsbRec,setBsbRec]=useState(null), [bsbLoading,setBsbLoading]=useState(false)

  async function getFbRec() {
    setFbLoading(true)
    try {
      const raw = await callAI('You are a football offensive coordinator. Situation: '+down+' and '+distance+', field position: '+fieldPos+', score: '+score+', time: '+timeLeft+'. Give top 3 play recommendations. Return ONLY valid JSON: {"plays":[{"name":"play name","why":"one sentence reason","confidence":"pct like 87%"},{"name":"play name","why":"reason","confidence":"pct"},{"name":"play name","why":"reason","confidence":"pct"}]}')
      const d = JSON.parse(raw.replace(/```[^`]*```/g,'').trim().slice(raw.indexOf('{'),raw.lastIndexOf('}')+1))
      if (d.plays) setFbRec(d.plays.map((p,i)=>({n:String(i+1),top:i===0,name:p.name,why:p.why,pct:p.confidence})))
    } catch(e) {}
    setFbLoading(false)
  }

  async function getBbRec() {
    setBbLoading(true)
    try {
      const raw = await callAI('You are a basketball coach. Situation: '+quarter+' quarter, score '+bbScore+', '+possession+', shot clock '+shotClock+', '+fouls+', '+timeouts+'. Give 3 specific play call recommendations. Return ONLY valid JSON: {"calls":[{"name":"play or action name","why":"specific tactical reason","urgency":"HIGH or MED or LOW"},{"name":"name","why":"reason","urgency":"level"},{"name":"name","why":"reason","urgency":"level"}]}')
      const s=raw.replace(/```[^`]*```/g,'').trim(); setBbRec(JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1)))
    } catch(e) {}
    setBbLoading(false)
  }

  async function getBsbRec() {
    setBsbLoading(true)
    try {
      const raw = await callAI('You are a baseball manager. Situation: '+halfInning+' of '+inning+' inning, '+outs+' out(s), count: '+balls+'-'+strikes+', '+runners+'. Give 3 specific strategic recommendations. Return ONLY valid JSON: {"moves":[{"action":"specific action","reason":"why this makes sense now","type":"OFFENSE or DEFENSE or PITCHING"},{"action":"action","reason":"reason","type":"type"},{"action":"action","reason":"reason","type":"type"}]}')
      const s=raw.replace(/```[^`]*```/g,'').trim(); setBsbRec(JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1)))
    } catch(e) {}
    setBsbLoading(false)
  }

  const statBox = (label,value,onChange,opts) => (
    <div key={label} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px' }}>
      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#3d4559', fontWeight:600, marginBottom:3 }}>{label}</div>
      {opts ? (
        <select value={value} onChange={e=>onChange(e.target.value)} style={{ background:'transparent', border:'none', color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, outline:'none', width:'100%', cursor:'pointer' }}>{opts.map(o=><option key={o} style={{background:'#161922'}}>{o}</option>)}</select>
      ) : (
        <input value={value} onChange={e=>onChange(e.target.value)} style={{ background:'transparent', border:'none', color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, outline:'none', width:'100%' }} />
      )}
    </div>
  )

  if (isFB) return (
    <Card>
      <CardHead icon="🎯" title="Situational Play Caller" tag="REAL-TIME" tagColor={S} accent={S} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:11 }}>
          {statBox('Down',down,setDown,['1st','2nd','3rd','4th'])}
          {statBox('Distance',distance,setDistance,['1','2','3','4','5','6','7','8','9','10','12','15','20+'])}
          {statBox('Field Position',fieldPos,setFieldPos)}
          {statBox('Score',score,setScore,['UP 1','UP 3','UP 7','UP 10','TIED','DOWN 1','DOWN 3','DOWN 7','DOWN 10'])}
          {statBox('Time Left',timeLeft,setTimeLeft)}
          <div style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <button onClick={getFbRec} disabled={fbLoading} style={{ background:fbLoading?'#3d4559':P, border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:1, padding:'6px 14px', cursor:fbLoading?'not-allowed':'pointer', width:'100%' }}>{fbLoading?'THINKING...':'GET RECS'}</button>
          </div>
        </div>
        {fbRec.map(r => (<div key={r.n} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:23, width:22, textAlign:'center', lineHeight:1, color:r.top?P:'#6b7a96' }}>{r.n}</div><div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{r.name}</div><div style={{ fontSize:11, color:'#6b7a96', marginTop:2 }}>{r.why}</div></div><div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:r.top?P:'#6b7a96' }}>{r.pct}</div></div>))}
      </div>
    </Card>
  )

  if (isBB) return (
    <Card>
      <CardHead icon="🏀" title="Live Game Adjustments" tag="IN-GAME" tagColor={S} accent={S} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:7, marginBottom:11 }}>
          {statBox('Quarter',quarter,setQuarter,['1st','2nd','3rd','4th','OT'])}
          {statBox('Score',bbScore,setBbScore,['UP 1','UP 3','UP 5','UP 8','UP 10','TIED','DOWN 1','DOWN 3','DOWN 5','DOWN 8','DOWN 10'])}
          {statBox('Possession',possession,setPossession,['Offense','Defense','After Timeout','After Made Basket','Inbound'])}
          {statBox('Shot Clock',shotClock,setShotClock,['24s','20s','14s','10s','7s','Under 5s','Off'])}
          {statBox('Team Fouls',fouls,setFouls,['0 fouls','1 foul','2 fouls','3 fouls','4 fouls','Bonus','Double Bonus'])}
          {statBox('Timeouts',timeouts,setTimeouts,['3 remaining','2 remaining','1 remaining','None left'])}
        </div>
        <button onClick={getBbRec} disabled={bbLoading} style={{ width:'100%', background:bbLoading?'#3d4559':S, border:'none', borderRadius:8, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, letterSpacing:2, padding:'11px', cursor:bbLoading?'not-allowed':'pointer', marginBottom:11 }}>{bbLoading?'THINKING...':'⚡ GET COACHING CALLS'}</button>
        {bbRec&&bbRec.calls&&(<>
          <div style={{ background:al(S,0.1), border:`2px solid ${S}`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:S, fontWeight:700, marginBottom:6 }}>Primary Call</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}><div style={{ fontSize:14, fontWeight:700, color:'#f2f4f8' }}>{bbRec.calls[0].name}</div><span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:4, background:bbRec.calls[0].urgency==='HIGH'?al(P,0.25):al(S,0.2), color:bbRec.calls[0].urgency==='HIGH'?P:S }}>{bbRec.calls[0].urgency}</span></div>
            <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{bbRec.calls[0].why}</div>
          </div>
          {bbRec.calls.slice(1).map((c,i)=>(<div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, width:20, textAlign:'center', lineHeight:1, color:'#6b7a96', marginTop:2, flexShrink:0 }}>{i+2}</div><div style={{ flex:1 }}><div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}><div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{c.name}</div><span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background:c.urgency==='HIGH'?al(P,0.2):al(S,0.15), color:c.urgency==='HIGH'?P:S }}>{c.urgency}</span></div><div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.4 }}>{c.why}</div></div></div>))}
        </>)}
      </div>
    </Card>
  )

  if (isBSB) return (
    <Card>
      <CardHead icon="⚾" title="Count & Situation Manager" tag="AT-BAT" tagColor={S} accent={S} />
      <div style={{ padding:14 }}>
        <div style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:10, padding:'12px 14px', marginBottom:11 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', marginBottom:4 }}>Balls</div><div style={{ display:'flex', gap:5 }}>{[0,1,2,3].map(i=><div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(balls)?'#4ade80':'#1e2330', border:'1px solid #3d4559' }} />)}</div></div>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', marginBottom:4 }}>Strikes</div><div style={{ display:'flex', gap:5 }}>{[0,1,2].map(i=><div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(strikes)?P:'#1e2330', border:'1px solid #3d4559' }} />)}</div></div>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', marginBottom:4 }}>Outs</div><div style={{ display:'flex', gap:5 }}>{[0,1,2].map(i=><div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(outs)?'#f59e0b':'#1e2330', border:'1px solid #3d4559' }} />)}</div></div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:11 }}>
          {statBox('Inning',inning,setInning,['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','Extra'])}
          {statBox('Half',halfInning,setHalfInning,['Top','Bottom'])}
          {statBox('Balls',balls,setBalls,['0','1','2','3'])}
          {statBox('Strikes',strikes,setStrikes,['0','1','2'])}
          {statBox('Outs',outs,setOuts,['0','1','2'])}
          {statBox('Runners',runners,setRunners,['Bases Empty','Runner on 1st','Runner on 2nd','Runner on 3rd','1st & 2nd','1st & 3rd','2nd & 3rd','Bases Loaded'])}
        </div>
        <button onClick={getBsbRec} disabled={bsbLoading} style={{ width:'100%', background:bsbLoading?'#3d4559':S, border:'none', borderRadius:8, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, letterSpacing:2, padding:'11px', cursor:bsbLoading?'not-allowed':'pointer', marginBottom:11 }}>{bsbLoading?'THINKING...':'⚡ GET STRATEGIC MOVES'}</button>
        {bsbRec&&bsbRec.moves&&(<>
          <div style={{ background:al(P,0.08), border:`2px solid ${P}`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:P, fontWeight:700, marginBottom:6 }}>Primary Move</div>
            <div style={{ fontSize:14, fontWeight:700, color:'#f2f4f8', marginBottom:4 }}>{bsbRec.moves[0].action}</div>
            <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5, marginBottom:6 }}>{bsbRec.moves[0].reason}</div>
            <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:4, background:al(S,0.25), color:S }}>{bsbRec.moves[0].type}</span>
          </div>
          {bsbRec.moves.slice(1).map((m,i)=>(<div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, width:20, textAlign:'center', lineHeight:1, color:'#6b7a96', marginTop:2, flexShrink:0 }}>{i+2}</div><div style={{ flex:1 }}><div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}><div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{m.action}</div><span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background:'rgba(107,154,255,0.15)', color:'#6b9fff' }}>{m.type}</span></div><div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.4 }}>{m.reason}</div></div></div>))}
        </>)}
      </div>
    </Card>
  )

  return null
}


function GauntletPage({ P, S, al, sport, iq, setIQ, gauntlets, setGauntlets, callAI, parseJSON }) {
  const [difficulty, setDifficulty] = useState('Varsity')
  const [scenario, setScenario] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [battleMode, setBattleMode] = useState(false)
  const [battleMsg, setBattleMsg] = useState('')
  const [battleHistory, setBattleHistory] = useState([])
  const [battleInput, setBattleInput] = useState('')
  const [battleLoading, setBattleLoading] = useState(false)
  const [battleStarted, setBattleStarted] = useState(false)

  const diffMap = { Rookie: { label: 'Rookie', color: '#4ade80', pts: 5 }, Varsity: { label: 'Varsity', color: '#f59e0b', pts: 10 }, Elite: { label: 'Elite', color: P, pts: 20 } }

  const coordinatorTitle = sport === 'Basketball' ? 'Head Coach' : sport === 'Baseball' ? 'Manager' : 'Offensive Coordinator'
  const oppTitle = sport === 'Basketball' ? 'Opposing Coach' : sport === 'Baseball' ? 'Opposing Manager' : 'Defensive Coordinator'

  async function loadScenario() {
    setLoading(true); setScenario(null); setSelected(null); setRevealed(false)
    const cfg = SPORTS[sport] || SPORTS.Football
    try {
      const raw = await callAI(cfg.scenarioPrompt(difficulty))
      const data = parseJSON(raw)
      if (!data.question || !data.options) throw new Error('Invalid scenario format')
      setScenario(data)
    } catch(e) { setScenario({ error: e.message }) }
    setLoading(false)
  }

  function answer(opt) {
    if (revealed) return
    setSelected(opt.letter); setRevealed(true)
    const correct = opt.correct
    setScore(s => ({ correct: s.correct + (correct?1:0), total: s.total + 1 }))
    if (correct) {
      const pts = diffMap[difficulty]?.pts || 10
      setIQ(q => q + pts)
      setGauntlets(g => g + 1)
    } else {
      setIQ(q => Math.max(0, q - 5))
    }
  }

  async function startBattle() {
    setBattleStarted(true); setBattleLoading(true)
    const opener = sport === 'Baseball'
      ? `You are an aggressive ${oppTitle} in a youth ${sport} game. Start a strategic debate with the ${coordinatorTitle}. Open with a specific tactical challenge about ${sport} strategy. Keep it under 3 sentences. Be competitive but educational.`
      : `You are an aggressive ${oppTitle} in a youth ${sport} game. Start a trash talk / strategic debate with the ${coordinatorTitle}. Open with a specific tactical challenge about ${sport} strategy. Keep it under 3 sentences. Be competitive but educational.`
    try {
      const raw = await callAI(opener)
      const msg = { role: 'opp', text: raw.trim() }
      setBattleHistory([msg])
    } catch(e) { setBattleHistory([{ role: 'opp', text: `Think you can out-scheme me? Let's see what you've got, Coach.` }]) }
    setBattleLoading(false)
  }

  async function sendBattle() {
    if (!battleInput.trim()) return
    const userMsg = battleInput.trim(); setBattleInput('')
    const newHistory = [...battleHistory, { role: 'user', text: userMsg }]
    setBattleHistory(newHistory); setBattleLoading(true)
    const histText = newHistory.map(m => (m.role==='opp'?oppTitle:'Coach')+': '+m.text).join('\n')
    try {
      const raw = await callAI(`You are an aggressive ${oppTitle} debating ${sport} strategy with a ${coordinatorTitle}. Conversation so far:\n${histText}\n\nRespond to the coach's last message. Stay in character. 2-3 sentences max. Be tactical and competitive.`)
      setBattleHistory(h => [...h, { role: 'opp', text: raw.trim() }])
    } catch(e) { setBattleHistory(h => [...h, { role: 'opp', text: 'Nice try, Coach.' }]) }
    setBattleLoading(false)
  }

  const iqBars = [
    { label: 'Situational IQ', val: Math.min(100, Math.round((score.correct / Math.max(score.total,1)) * 100)) },
    { label: 'Decision Speed', val: Math.min(100, 60 + score.total * 5) },
    { label: 'Scheme Knowledge', val: Math.min(100, 50 + (iq - 800) / 10) },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <Card>
        <CardHead icon="⚡" title={`${sport} Gauntlet`} tag={difficulty.toUpperCase()} tagColor={diffMap[difficulty]?.color || P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ display:'flex', gap:7, marginBottom:12 }}>
            {Object.keys(diffMap).map(d => (
              <button key={d} onClick={() => setDifficulty(d)} style={{ flex:1, padding:'8px 4px', background:difficulty===d?diffMap[d].color:'transparent', border:`1px solid ${difficulty===d?diffMap[d].color:'#1e2330'}`, borderRadius:6, color:difficulty===d?'#07090d':diffMap[d].color, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:1 }}>{d.toUpperCase()}<div style={{ fontSize:9, fontWeight:400, opacity:0.8, marginTop:1 }}>+{diffMap[d].pts} IQ</div></button>
            ))}
          </div>
          <PBtn onClick={loadScenario} disabled={loading} color={P}>{loading ? 'LOADING...' : scenario ? 'NEXT SCENARIO' : 'START GAUNTLET'}</PBtn>
          {loading && <Shimmer />}
          {scenario && !scenario.error && (
            <div style={{ marginTop:12, animation:'fadeIn 0.3s ease' }}>
              <div style={{ background:'#161922', border:`1px solid ${al(P,0.2)}`, borderRadius:10, padding:13, marginBottom:10 }}>
                <div style={{ display:'flex', gap:10, marginBottom:8 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, padding:'3px 9px', background:al(P,0.15), color:P, borderRadius:4, letterSpacing:1 }}>{scenario.situation}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, padding:'3px 9px', background:'#0f1117', color:'#6b7a96', borderRadius:4 }}>{scenario.phase}</span>
                </div>
                <div style={{ fontSize:13, color:'#f2f4f8', lineHeight:1.6 }}>{scenario.question}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:10 }}>
                {(scenario.options||[]).map(opt => {
                  let bg = '#161922', border = '1px solid #1e2330', color = '#f2f4f8'
                  if (revealed) {
                    if (opt.correct) { bg = 'rgba(74,222,128,0.1)'; border = '1px solid rgba(74,222,128,0.5)'; color = '#4ade80' }
                    else if (opt.letter === selected) { bg = 'rgba(239,68,68,0.1)'; border = '1px solid rgba(239,68,68,0.4)'; color = '#ef4444' }
                    else { color = '#3d4559' }
                  } else if (opt.letter === selected) { bg = al(P, 0.15); border = `1px solid ${P}`; color = P }
                  return (
                    <div key={opt.letter} onClick={() => answer(opt)} style={{ display:'flex', gap:10, padding:'10px 12px', background:bg, border, borderRadius:8, cursor:revealed?'default':'pointer', transition:'all 0.15s' }}>
                      <div style={{ width:22, height:22, minWidth:22, borderRadius:4, background:revealed&&opt.correct?'rgba(74,222,128,0.2)':revealed&&opt.letter===selected&&!opt.correct?'rgba(239,68,68,0.2)':al(P,0.1), border:`1px solid ${color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color, flexShrink:0 }}>{opt.letter}</div>
                      <div style={{ fontSize:12, color, lineHeight:1.5 }}>{opt.text}</div>
                      {revealed && opt.correct && <span style={{ marginLeft:'auto', fontSize:16, flexShrink:0 }}>✓</span>}
                      {revealed && opt.letter===selected && !opt.correct && <span style={{ marginLeft:'auto', fontSize:16, flexShrink:0 }}>✗</span>}
                    </div>
                  )
                })}
              </div>
              {revealed && scenario.explanation && (
                <div style={{ background:'rgba(107,154,255,0.08)', border:'1px solid rgba(107,154,255,0.2)', borderRadius:10, padding:12, animation:'fadeIn 0.2s ease' }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:'#6b9fff', fontWeight:700, textTransform:'uppercase', marginBottom:5 }}>Explanation</div>
                  <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{scenario.explanation}</div>
                </div>
              )}
            </div>
          )}
          {scenario?.error && <ErrBox msg={scenario.error} />}
          {score.total > 0 && (
            <div style={{ marginTop:12, padding:'10px 12px', background:'#161922', borderRadius:8, display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ textAlign:'center' }}><div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:22, color:P, lineHeight:1 }}>{score.correct}/{score.total}</div><div style={{ fontSize:9, color:'#6b7a96', textTransform:'uppercase', letterSpacing:1 }}>Correct</div></div>
              <div style={{ flex:1 }}>{iqBars.map(bar => (<div key={bar.label} style={{ marginBottom:5 }}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}><span style={{ fontSize:9, color:'#6b7a96' }}>{bar.label}</span><span style={{ fontSize:9, color:P }}>{bar.val}%</span></div><div style={{ height:3, background:'#1e2330', borderRadius:2 }}><div style={{ height:3, width:`${bar.val}%`, background:P, borderRadius:2, transition:'width 0.5s ease' }} /></div></div>))}</div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHead icon="🥊" title={`${coordinatorTitle} vs ${oppTitle}`} tag="BATTLE MODE" tagColor="#f59e0b" accent="#f59e0b" />
        <div style={{ padding:14 }}>
          {!battleStarted ? (
            <>
              <p style={{ fontSize:12, color:'#6b7a96', lineHeight:1.6, marginBottom:12 }}>Go head-to-head with an AI {oppTitle}. Defend your scheme, counter their tactics, and prove your football IQ.</p>
              <PBtn onClick={startBattle} disabled={battleLoading} color="#f59e0b">{battleLoading ? 'LOADING...' : `START BATTLE vs ${oppTitle.toUpperCase()}`}</PBtn>
            </>
          ) : (
            <>
              <div style={{ maxHeight:320, overflowY:'auto', display:'flex', flexDirection:'column', gap:8, marginBottom:10 }}>
                {battleHistory.map((msg, i) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:msg.role==='user'?'flex-end':'flex-start' }}>
                    <div style={{ fontSize:9, letterSpacing:1, color:'#3d4559', marginBottom:2 }}>{msg.role==='user'?'YOU':oppTitle.toUpperCase()}</div>
                    <div style={{ maxWidth:'85%', padding:'9px 12px', borderRadius:10, background:msg.role==='user'?al(P,0.15):'#161922', border:`1px solid ${msg.role==='user'?al(P,0.3):'#1e2330'}`, fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{msg.text}</div>
                  </div>
                ))}
                {battleLoading && <div style={{ fontSize:11, color:'#6b7a96', textAlign:'left', padding:'4px 8px' }}>...</div>}
              </div>
              <div style={{ display:'flex', gap:7 }}>
                <input value={battleInput} onChange={e=>setBattleInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&battleInput.trim())sendBattle()}} placeholder="Counter their argument..." style={{ flex:1, background:'#161922', border:'1px solid #1e2330', borderRadius:7, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
                <button onClick={sendBattle} disabled={battleLoading||!battleInput.trim()} style={{ padding:'0 14px', background:battleLoading||!battleInput.trim()?'#3d4559':'#f59e0b', color:'#07090d', border:'none', borderRadius:7, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:1, cursor:battleLoading||!battleInput.trim()?'not-allowed':'pointer', flexShrink:0 }}>SEND</button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}


function FilmPage({ P, S, al, dk, sport, callAI, parseJSON }) {
  const [mode, setMode] = useState('describe')
  const [description, setDescription] = useState('')
  const [imageData, setImageData] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const isFB = sport==='Football', isBB = sport==='Basketball', isBSB = sport==='Baseball'
  const positionLabel = isBB ? 'player' : isBSB ? 'fielder/batter' : 'player'
  const problemExamples = isBB
    ? ['My point guard keeps turning over the ball in the half court', 'Our zone defense is giving up too many corner threes', 'Players hesitate on the fast break', 'We can\'t execute the pick and roll consistently']
    : isBSB
    ? ['Our pitcher is struggling with command in the strike zone', 'Infield keeps missing cutoff throws', 'Batters are late on fastballs', 'Outfielders aren\'t hitting the cutoff man']
    : ['My offensive line keeps missing their blocks on outside runs', 'Our QB is holding the ball too long under pressure', 'The defense keeps getting beat over the top', 'We\'re fumbling too much on handoffs']

  function handleFile(e) {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target.result
      setImagePreview(result)
      setImageData({ b64: result.split(',')[1], mime: file.type.startsWith('video') ? 'image/jpeg' : file.type })
    }
    reader.readAsDataURL(file)
  }

  async function analyze() {
    setLoading(true); setAnalysis(null); setError('')
    const sportCtx = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
    try {
      let prompt
      if (imageData) {
        prompt = `You are an elite youth ${sportCtx} film analyst. Analyze this ${positionLabel} or play diagram image. ${description ? 'Coach notes: '+description+'.' : ''} Identify: 1) What you see technically, 2) The key problem or strength, 3) Specific corrective coaching cues. Return ONLY valid JSON: {"headline":"one-line diagnosis","situation":"what is happening in the image","primaryIssue":"the main technical problem","coachingFix":"exact drill or correction","immediateRep":"what to do at very next practice","drillName":"name of the fix drill","drillSteps":["step 1","step 2","step 3"],"proReference":"how a pro coach would phrase this"}`
      } else {
        prompt = `You are an elite youth ${sportCtx} film analyst and master diagnostician. A coach describes this problem: "${description}". Diagnose the root cause and give a complete fix. Return ONLY valid JSON: {"headline":"one-line diagnosis","rootCause":"the true underlying cause of the problem","whatYouSee":"what this looks like on film","coachingFix":"the specific correction technique","immediateRep":"exact rep to run at next practice","drillName":"best drill to fix this","drillSteps":["step 1","step 2","step 3"],"commonMistake":"what coaches usually try that doesn't work","proReference":"how an elite coach would address this"}`
      }
      const raw = await callAI(prompt, imageData || undefined)
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setAnalysis(JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1)))
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  return (
    <Card>
      <CardHead icon="🎥" title="Film Room" tag={sport.toUpperCase()} tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        <div style={{ display:'flex', gap:7, marginBottom:12 }}>
          {[['describe','✏️ Describe Problem'],['upload','📎 Upload Clip']].map(([m,lbl]) => (
            <button key={m} onClick={() => setMode(m)} style={{ flex:1, padding:'9px', background:mode===m?al(P,0.15):'transparent', border:`1px solid ${mode===m?P:'#1e2330'}`, borderRadius:7, color:mode===m?P:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:0.5 }}>{lbl}</button>
          ))}
        </div>

        {mode === 'describe' && (
          <>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:6 }}>Describe the Problem</div>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder={`e.g. "${problemExamples[0]}"`} rows={3} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:7, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', resize:'vertical' }} />
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:9, color:'#6b7a96', marginBottom:6 }}>Quick examples:</div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {problemExamples.slice(0,3).map((ex,i) => (<div key={i} onClick={() => setDescription(ex)} style={{ fontSize:11, color:'#4a5470', cursor:'pointer', padding:'5px 8px', background:'#0f1117', borderRadius:4, border:'1px solid #1e2330' }}>{ex}</div>))}
              </div>
            </div>
          </>
        )}

        {mode === 'upload' && (
          <div style={{ marginBottom:12 }}>
            <div onClick={() => fileRef.current?.click()} style={{ border:`2px dashed ${al(P,0.3)}`, borderRadius:10, padding:'20px', textAlign:'center', cursor:'pointer', background:al(P,0.05), marginBottom:10 }}>
              {imagePreview ? (<img src={imagePreview} alt="preview" style={{ maxWidth:'100%', maxHeight:200, borderRadius:7, objectFit:'contain' }} />) : (<><div style={{ fontSize:28, marginBottom:6 }}>📎</div><div style={{ fontSize:12, color:'#6b7a96' }}>Tap to upload image or video frame</div><div style={{ fontSize:10, color:'#3d4559', marginTop:3 }}>JPG, PNG, or MP4 (first frame used)</div></>)}
            </div>
            <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} style={{ display:'none' }} />
            <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Optional: add context about what you're seeing..." rows={2} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:7, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', resize:'none' }} />
          </div>
        )}

        <PBtn onClick={analyze} disabled={loading || (!description.trim() && !imageData)} color={P}>{loading ? 'ANALYZING...' : '🎥 ANALYZE FILM'}</PBtn>
        {loading && <Shimmer />}
        {error && <ErrBox msg={error} />}

        {analysis && (
          <div style={{ marginTop:12, animation:'fadeIn 0.3s ease' }}>
            <div style={{ background:al(P,0.1), border:`1px solid ${al(P,0.3)}`, borderRadius:10, padding:'12px 14px', marginBottom:10 }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:P, fontWeight:700, marginBottom:4 }}>Diagnosis</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, letterSpacing:1, color:'#f2f4f8', lineHeight:1.2 }}>{analysis.headline}</div>
            </div>
            {(analysis.rootCause || analysis.situation) && (<div style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:12, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f87171', fontWeight:700, marginBottom:4 }}>Root Cause</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{analysis.rootCause || analysis.situation}</div></div>)}
            {analysis.whatYouSee && (<div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:10, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4 }}>What You See on Film</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{analysis.whatYouSee}</div></div>)}
            <div style={{ background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:10, padding:12, marginBottom:10 }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#4ade80', fontWeight:700, marginBottom:4 }}>The Fix</div>
              <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6, marginBottom:8 }}>{analysis.coachingFix}</div>
              <div style={{ background:'rgba(74,222,128,0.1)', borderRadius:8, padding:'8px 10px' }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#4ade80', fontWeight:700, marginBottom:3 }}>Do This at Practice Today</div><div style={{ fontSize:12, color:'#f2f4f8', fontWeight:600 }}>{analysis.immediateRep}</div></div>
            </div>
            {analysis.drillName && (<div style={{ background:'rgba(107,154,255,0.07)', border:'1px solid rgba(107,154,255,0.2)', borderRadius:10, padding:12, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:6 }}>Fix Drill: {analysis.drillName}</div>{(analysis.drillSteps||[]).map((step,i) => (<div key={i} style={{ display:'flex', gap:8, marginBottom:5 }}><div style={{ width:18, height:18, minWidth:18, background:'rgba(107,154,255,0.15)', border:'1px solid rgba(107,154,255,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:'#6b9fff', flexShrink:0, marginTop:1 }}>{i+1}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{step}</div></div>))}</div>)}
            {analysis.commonMistake && (<div style={{ background:'rgba(245,158,11,0.07)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:10, padding:12, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:4 }}>Common Coaching Mistake</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{analysis.commonMistake}</div></div>)}
            {analysis.proReference && (<div style={{ background:'rgba(0,0,0,0.3)', borderRadius:10, padding:12, borderLeft:`3px solid ${P}` }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:P, fontWeight:700, marginBottom:4 }}>How the Pros Say It</div><div style={{ fontSize:12, color:'#f2f4f8', fontStyle:'italic', lineHeight:1.6 }}>"{analysis.proReference}"</div></div>)}
          </div>
        )}
      </div>
    </Card>
  )
}


// ─── SCHEME PREVIEW (mini interactive diagrams for home card) ─────────────────
function SchemePreviewMini({ type='offense', P }) {
  const isOff = type === 'offense'
  const color = isOff ? P : '#6b9fff'
  return (
    <svg viewBox="0 0 100 60" style={{ width:'100%', height:'100%' }}>
      {/* field lines */}
      <rect width="100" height="60" fill={isOff ? '#1a2a1a' : '#0d1520'} rx="3"/>
      <line x1="0" y1="38" x2="100" y2="38" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" strokeDasharray="4,3"/>
      {isOff ? (
        <>
          {/* OL */}
          {[38,43,50,57,62].map(x => <rect key={x} x={x-3} y={35} width="6" height="6" fill={color} opacity="0.9" rx="1"/>)}
          {/* QB */}
          <circle cx="50" cy="44" r="3.5" fill={color} opacity="0.9"/>
          {/* RB */}
          <circle cx="50" cy="52" r="3" fill={color} opacity="0.7"/>
          {/* WR */}
          <circle cx="12" cy="36" r="3" fill={color} opacity="0.7"/>
          <circle cx="88" cy="36" r="3" fill={color} opacity="0.7"/>
          {/* routes */}
          <path d="M12 36 L12 24" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
          <path d="M88 36 L88 24" stroke={color} strokeWidth="1.5" fill="none" opacity="0.6"/>
          <path d="M50 52 L56 40" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5" strokeDasharray="2,1"/>
          {/* arrows */}
          <polygon points="12,23 10,27 14,27" fill={color} opacity="0.6"/>
          <polygon points="88,23 86,27 90,27" fill={color} opacity="0.6"/>
          {/* defenders */}
          {[40,50,60].map(x => <circle key={x} cx={x} cy={31} r="2.5" fill="none" stroke="rgba(200,200,200,0.4)" strokeWidth="1"/>)}
          {[35,50,65].map(x => <circle key={x+'lb'} cx={x} cy={24} r="2.5" fill="none" stroke="rgba(200,200,200,0.3)" strokeWidth="1"/>)}
        </>
      ) : (
        <>
          {/* defense diagram */}
          {/* DL */}
          {[38,44,56,62].map(x => <rect key={x} x={x-3} y={33} width="6" height="6" fill={color} opacity="0.9" rx="1"/>)}
          {/* LBs */}
          {[34,50,66].map(x => <circle key={x} cx={x} cy={25} r="3.5" fill={color} opacity="0.85"/>)}
          {/* DBs */}
          {[12,30,70,88].map(x => <circle key={x} cx={x} cy={16} r="3" fill={color} opacity="0.6"/>)}
          {/* coverage zones */}
          <ellipse cx="50" cy="20" rx="28" ry="8" fill="none" stroke={color} strokeWidth="0.8" opacity="0.25" strokeDasharray="3,2"/>
          {/* offense ref */}
          {[38,43,50,57,62].map(x => <rect key={x} x={x-3} y={40} width="6" height="5" fill="rgba(255,255,255,0.12)" rx="1"/>)}
          {/* assignment lines */}
          <line x1="38" y1="33" x2="34" y2="29" stroke={color} strokeWidth="1" opacity="0.5"/>
          <line x1="62" y1="33" x2="66" y2="29" stroke={color} strokeWidth="1" opacity="0.5"/>
        </>
      )}
    </svg>
  )
}

// ─── SCHEMES PAGE ─────────────────────────────────────────────────────────────

// ─── INDIVIDUAL PLAY CREATOR ──────────────────────────────────────────────────
function IndividualPlayCreator({ sport, P, S, al, callAI, parseJSON, onSavePlay }) {
  const isFB = sport==='Football', isBB = sport==='Basketball', isBSB = sport==='Baseball'

  const fbFields = [
    {id:'formation',label:'Offensive Formation',opts:['I-Formation','Shotgun','Pistol','Single Back','Under Center','Wildcat','Empty Set']},
    {id:'playType',label:'Play Type',opts:['Run — Inside','Run — Outside','Run — Misdirection','Pass — Quick Game','Pass — Play Action','Pass — Deep Shot','Special Teams','Two-Point Conversion','Goal Line']},
    {id:'situation',label:'Situation',opts:['1st & 10','2nd & Short (1-3)','2nd & Medium (4-7)','2nd & Long (8+)','3rd & Short (1-3)','3rd & Medium (4-7)','3rd & Long (8+)','4th Down','Red Zone (inside 20)','Goal Line (inside 5)','2-Minute Drill','Opening Drive']},
    {id:'personnel',label:'Personnel Package',opts:['11 Personnel (3 WR)','12 Personnel (2 WR 1 TE)','21 Personnel (2 RB)','Jumbo / Heavy','Empty Backfield','Trips Formation','Bunch Formation']},
    {id:'defense',label:'Expected Defense',opts:['Unknown','4-3 Base','3-4 Base','Nickel','Dime','Cover 2','Cover 3','Cover 4','Man Press','Blitz Package','Zone Blitz']},
    {id:'age',label:'Age Group',opts:['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School JV','High School Varsity']},
  ]
  const bbFields = [
    {id:'setType',label:'Play / Set Type',opts:['Half Court Set','Inbound — Baseline','Inbound — Sideline','Press Break','Fast Break Sequence','End of Game','Zone Attack','Pick & Roll','Isolation','Horns Set','Box Set']},
    {id:'situation',label:'Situation',opts:['Opening Possession','Up by 1-5 (protect)','Down by 1-5 (attack)','Tie Game','Final Possession','After Timeout','After Made Basket','Bonus Situation','Full Court Press Situation','Transition']},
    {id:'personnel',label:'Primary Option',opts:['Best Ball Handler','Dominant Big','Best Shooter','Athletic Wing','Balanced — No Star','Post Entry','Perimeter Drive']},
    {id:'defense',label:'Expected Defense',opts:['Man-to-Man','2-3 Zone','1-3-1 Zone','3-2 Zone','Full Court Press','Half Court Trap','Box-and-One','Triangle-and-Two']},
    {id:'age',label:'Age Group',opts:['6-8 yrs','9-10 yrs','11-12 yrs','13-14 yrs','High School']},
  ]
  const bsbFields = [
    {id:'playType',label:'Play / Strategy Type',opts:['Hit and Run','Bunt — Sacrifice','Bunt — Squeeze','Stolen Base','Delayed Steal','First and Third','Double Steal','Walk-Up Hitter Approach','Defensive Shift','Intentional Walk','Pitching Change','Pinch Hitter']},
    {id:'situation',label:'Situation',opts:['Leadoff Inning','Runner on 1st','Runner on 2nd','Runner on 3rd','1st & 2nd','1st & 3rd','Bases Loaded','2 Outs','Less than 2 Outs','Tie Game Late','Up by 1 Late','Down by 1 Late']},
    {id:'count',label:'Count',opts:['0-0','1-0','2-0','3-0','0-1','0-2','1-2','2-2','3-2','Full Count']},
    {id:'inning',label:'Inning',opts:['1st','2nd','3rd','4th','5th','6th','7th','Extra Innings']},
    {id:'age',label:'Age Group',opts:['7-8 yrs Coach Pitch','9-10 yrs','11-12 yrs','13-14 yrs','High School']},
  ]

  const activeCfg = isBB ? bbFields : isBSB ? bsbFields : fbFields
  const initF = () => { const f={}; activeCfg.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [fields, setFields] = useState(initF)
  const [playName, setPlayName] = useState('')
  const [customNotes, setCustomNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  async function generate() {
    if (!playName.trim()) { setError('Give your play a name first'); return }
    setLoading(true); setResult(null); setError(''); setSaved(false)
    const inputSummary = Object.keys(fields).map(k=>k+': '+fields[k]).join(', ')
    const extraNotes = customNotes.trim() ? ' Additional coach notes: '+customNotes : ''
    const sportLabel = isBB?'basketball':isBSB?'baseball':'football'
    const typeHint = isBB?'SET PLAY HALF COURT or INBOUND BASELINE or PRESS BREAK or FAST BREAK or ZONE ATTACK or END OF GAME':isBSB?'OFFENSE SITUATIONAL or DEFENSE ALIGNMENT or BASERUNNING RULE or PITCHING STRATEGY or BATTING APPROACH':'RUN BASE or RUN PERIMETER or RUN MISDIRECTION or PASS PLAY ACTION or PASS QUICK GAME or RUN SHORT YARDAGE'
    const prompt = `You are an elite youth ${sportLabel} coordinator. Design ONE specific play called "${playName.trim()}". Inputs: ${inputSummary}.${extraNotes} Return ONLY valid JSON: {"number":1,"name":"${playName.trim()}","type":"${typeHint.split(' or ')[0]}","note":"precise when-to-use description","summary":"2-3 sentence tactical overview","keyPlayers":["role 1","role 2","role 3"],"coachingCue":"exact phrase to say in huddle"}`
    try {
      const raw = await callAI(prompt)
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      const data = JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1))
      setResult(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  function handleSave(folderName, teamId) {
    if (!result) return
    onSavePlay({ ...result, _individual: true, _sport: sport, _savedAt: Date.now() }, folderName, teamId)
    setSaved(true)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <Card>
        <CardHead icon="✏️" title="Create Individual Play" tag={sport.toUpperCase()} tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ marginBottom:10 }}>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Play Name *</label>
            <input value={playName} onChange={e=>{setPlayName(e.target.value);setError('')}} placeholder={isBB?"e.g. Horns Flare":isBSB?"e.g. First & Third Squeeze":"e.g. Power 34 Counter"} style={{ width:'100%', background:'#161922', border:`1px solid ${playName?P:'#1e2330'}`, borderRadius:4, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            {activeCfg.map(f => (<Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />))}
          </div>
          <div style={{ marginBottom:10 }}>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Additional Notes <span style={{ color:'#3d4559', fontSize:8 }}>(optional — describe anything specific)</span></label>
            <textarea value={customNotes} onChange={e=>setCustomNotes(e.target.value)} placeholder="e.g. My best receiver runs a skinny post, QB is left-handed, defender always jumps routes..." rows={2} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', resize:'vertical' }} />
          </div>
          {error && <div style={{ fontSize:11, color:'#f87171', marginBottom:8 }}>{error}</div>}
          <PBtn onClick={generate} disabled={loading||!playName.trim()} color={P}>{loading?'CREATING PLAY...':'CREATE PLAY'}</PBtn>
          {loading && <Shimmer />}
        </div>
      </Card>

      {result && (
        <div style={{ animation:'fadeIn 0.3s ease' }}>
          <div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Your Play — Full Breakdown</div>
          <PlayCardWithSave play={result} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} playbook={{[sport]:{}}} onAddToPlaybook={handleSave} onCreateAndAdd={handleSave} />
          {saved && <div style={{ marginTop:8, padding:'8px 12px', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:6, fontSize:12, color:'#4ade80', textAlign:'center' }}>✓ Play saved to playbook</div>}
        </div>
      )}
    </div>
  )
}

function SchemesPage({ P, S, al, sport, callAI, parseJSON, playbook, setPlaybook, genHistory, setGenHistory, iq, setIQ }) {
  const cfg = SPORTS[sport] || SPORTS.Football
  const initFields = () => { const f={}; cfg.fields.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [offFields, setOffFields] = useState(initFields)
  const [offResult, setOffResult] = useState(null)
  const [offLoading, setOffLoading] = useState(false)
  const [offError, setOffError] = useState('')
  const [offOpen, setOffOpen] = useState(true)
  const [defOpen, setDefOpen] = useState(true)
  const [prevSport, setPrevSport] = useState(sport)

  if (sport !== prevSport) {
    setPrevSport(sport)
    setOffFields(initFields())
    setOffResult(null)
    setOffError('')
  }

  async function generateOffense() {
    setOffLoading(true); setOffResult(null); setOffError('')
    try {
      const raw = await callAI(cfg.buildPrompt(offFields))
      const data = parseJSON(raw)
      if (!data.plays) throw new Error('No plays returned')
      setOffResult(data)
      setGenHistory(prev => ({ ...prev, [sport]: [{ ...data, _sport:sport, _ts:Date.now() }, ...(prev[sport]||[])].slice(0,20) }))
    } catch(e) { setOffError(e.message) }
    setOffLoading(false)
  }

  function addToPlaybook(play, folderName) {
    const sportFolders = playbook[sport] || {}
    const folder = sportFolders[folderName] || []
    setPlaybook(pb => ({
      ...pb,
      [sport]: { ...sportFolders, [folderName]: [...folder, { ...play, _fromPackage: offResult?.packageName, _addedAt: Date.now() }] }
    }))
  }

  function createAndAdd(play, newFolderName) {
    if (!newFolderName?.trim()) return
    addToPlaybook(play, newFolderName.trim())
  }

  const sportHistory = genHistory[sport] || []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {/* OFFENSIVE GENERATOR */}
      <Card>
        <div style={{ padding:'11px 14px', borderBottom: offOpen ? '1px solid #1e2330' : 'none', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${P}`, cursor:'pointer' }} onClick={() => setOffOpen(o=>!o)}>
          <span style={{ fontSize:15 }}>📋</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', color:'#f2f4f8', flex:1, textTransform:'uppercase' }}>Offensive Scheme Generator</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'1px', padding:'2px 7px', borderRadius:2, background:al(P,0.15), color:P, textTransform:'uppercase' }}>{cfg.emoji}</span>
          <span style={{ fontSize:12, color:'#6b7a96', marginLeft:4 }}>{offOpen ? '▲' : '▼'}</span>
        </div>
        {offOpen && (
          <div style={{ padding:14, animation:'fadeIn 0.2s ease' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
              {cfg.fields.map(f => (<Sel key={f.id} label={f.label} value={offFields[f.id]||f.opts[0]} onChange={v=>setOffFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />))}
            </div>
            <PBtn onClick={generateOffense} disabled={offLoading} color={P}>{offLoading ? 'GENERATING...' : sport==='Baseball' ? 'GENERATE GAME PLAN' : 'GENERATE SCHEME'}</PBtn>
            {offLoading && <Shimmer />}
            {offError && <ErrBox msg={offError} />}
            {offResult && (
              <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, letterSpacing:1, color:P, marginBottom:6 }}>{offResult.packageName}</div>
                <p style={{ fontSize:12, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>{offResult.summary}</p>
                {offResult.defenseTip && (<div style={{ padding:'8px 12px', background:'rgba(107,154,255,0.08)', border:'1px solid rgba(107,154,255,0.2)', borderRadius:8, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:'#6b9fff', textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Defensive Context</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{offResult.defenseTip}</div></div>)}
                {(offResult.plays||[]).map(play => (
                  <PlayCardWithSave key={play.number} play={play} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} playbook={playbook} onAddToPlaybook={addToPlaybook} onCreateAndAdd={createAndAdd} />
                ))}
                {offResult.coachingCue && (<div style={{ marginTop:10, padding:10, background:al(P,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Coaching Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic' }}>"{offResult.coachingCue}"</div></div>)}
              </div>
            )}
            {/* Recent generations */}
            {sportHistory.length > 0 && (
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:9, letterSpacing:2, color:'#3d4559', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Recent Generations</div>
                {sportHistory.slice(0,5).map((h,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#0f1117', border:'1px solid #1e2330', borderRadius:6, marginBottom:6 }}>
                    <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:600, color:'#dde1f0' }}>{h.packageName}</div><div style={{ fontSize:10, color:'#6b7a96', marginTop:1 }}>{h.plays?.length} plays</div></div>
                    <button onClick={() => setOffResult(h)} style={{ fontSize:9, color:P, background:al(P,0.1), border:`1px solid ${al(P,0.3)}`, borderRadius:3, padding:'3px 8px', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>VIEW</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* DEFENSIVE GENERATOR */}
      <DefenseGenCollapsible sport={sport} P={P} S={'#6b9fff'} al={al} callAI={callAI} parseJSON={parseJSON} defaultOpen={true} playbook={playbook} setPlaybook={setPlaybook} />
    </div>
  )
}

// ─── PLAY CARD WITH SAVE TO PLAYBOOK ─────────────────────────────────────────
function PlayCardWithSave({ play, P, S, al, callAI, parseJSON, sport, playbook, onAddToPlaybook, onCreateAndAdd }) {
  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const sportFolders = playbook[sport] || {}
  const existingFolders = [...new Set([...DEFAULT_FOLDERS[sport]||[], ...Object.keys(sportFolders)])]
  const [saved, setSaved] = useState(false)

  function handleAdd(folder) {
    onAddToPlaybook(play, folder)
    setSaved(folder)
    setShowSaveMenu(false)
  }

  return (
    <div style={{ position:'relative' }}>
      <PlayCard play={play} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} extraAction={
        <div style={{ position:'relative' }}>
          {saved ? (
            <span style={{ fontSize:9, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>✓ SAVED</span>
          ) : (
            <button onClick={e=>{e.stopPropagation();setShowSaveMenu(s=>!s)}} style={{ padding:'3px 8px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:3, color:P, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, whiteSpace:'nowrap' }}>+ PLAYBOOK</button>
          )}
          {showSaveMenu && (
            <div style={{ position:'absolute', right:0, top:'100%', marginTop:4, background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:8, zIndex:50, minWidth:180, boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize:9, color:'#6b7a96', letterSpacing:1.5, textTransform:'uppercase', fontWeight:700, marginBottom:6, padding:'0 4px' }}>Add to folder</div>
              {existingFolders.map(f => (
                <div key={f} onClick={()=>handleAdd(f)} style={{ padding:'7px 10px', fontSize:12, color:'#f2f4f8', cursor:'pointer', borderRadius:5, display:'flex', alignItems:'center', gap:6 }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <span style={{ fontSize:11 }}>📁</span> {f}
                </div>
              ))}
              <div style={{ borderTop:'1px solid #1e2330', marginTop:6, paddingTop:6 }}>
                <div style={{ display:'flex', gap:6 }}>
                  <input value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} placeholder="New folder name..." style={{ flex:1, background:'#0f1117', border:'1px solid #1e2330', borderRadius:4, padding:'5px 8px', color:'#f2f4f8', fontSize:11, outline:'none', fontFamily:'inherit' }} onKeyDown={e=>{if(e.key==='Enter'&&newFolderName.trim()){onCreateAndAdd(play,newFolderName);setSaved(newFolderName);setNewFolderName('');setShowSaveMenu(false)}}} />
                  <button onClick={()=>{if(newFolderName.trim()){onCreateAndAdd(play,newFolderName);setSaved(newFolderName);setNewFolderName('');setShowSaveMenu(false)}}} style={{ padding:'5px 8px', background:P, border:'none', borderRadius:4, color:'white', fontSize:10, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>
      } />
    </div>
  )
}

// ─── DEFENSIVE GEN COLLAPSIBLE ────────────────────────────────────────────────
function DefenseGenCollapsible({ sport, P, S, al, callAI, parseJSON, defaultOpen=true, playbook, setPlaybook }) {
  const [open, setOpen] = useState(defaultOpen)
  const isFB=sport==='Football', isBB=sport==='Basketball', isBSB=sport==='Baseball'
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
  const activeCfg = isBB?bbFields:isBSB?bsbFields:fbFields
  const initF = () => { const f={}; activeCfg.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [fields, setFields] = useState(initF)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true); setResult(null); setError('')
    const inputSummary = Object.keys(fields).map(k=>k+': '+fields[k]).join(', ')
    const prompt = isFB
      ? 'You are an elite youth football defensive coordinator. Build a defensive game plan. '+inputSummary+'. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive formation name","type":"BASE or NICKEL or BLITZ or ZONE or MAN","assignment":"specific gap assignments and coverage","whenToUse":"exact situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"most important thing to stop","adjustmentTip":"halftime adjustment","coachingCue":"phrase"}'
      : isBB
      ? 'You are an elite youth basketball defensive coach. Build a defensive game plan. '+inputSummary+'. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive scheme name","type":"MAN or ZONE or PRESS or TRAP","assignment":"specific assignments and rotations","whenToUse":"exact situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"most important thing to take away","adjustmentTip":"halftime adjustment","coachingCue":"phrase"}'
      : 'You are an elite youth baseball manager. Build a defensive game plan. '+inputSummary+'. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","formations":[{"number":1,"name":"defensive alignment name","type":"STANDARD or SHIFT or WHEEL or FIVE MAN INFIELD","assignment":"specific positioning for all fielders","whenToUse":"exact situation"},{"number":2,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":3,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"},{"number":4,"name":"name","type":"type","assignment":"assignments","whenToUse":"when"}],"keyStop":"most important out to get","adjustmentTip":"adjustment tip","coachingCue":"phrase"}'
    try {
      const raw = await callAI(prompt)
      const data = parseJSON(raw)
      if (!data.formations) throw new Error('No formations in response')
      setResult(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  function addDefToPlaybook(formation, folderName) {
    const sportFolders = playbook[sport] || {}
    const folder = sportFolders[folderName] || []
    const play = { number: formation.number, name: formation.name, type: formation.type, note: formation.assignment, _isDefense: true, _fromPackage: result?.packageName, _addedAt: Date.now() }
    setPlaybook(pb => ({ ...pb, [sport]: { ...sportFolders, [folderName]: [...folder, play] } }))
  }

  return (
    <Card>
      <div style={{ padding:'11px 14px', borderBottom: open ? '1px solid #1e2330' : 'none', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${S}`, cursor:'pointer' }} onClick={() => setOpen(o=>!o)}>
        <span style={{ fontSize:15 }}>🛡</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', color:'#f2f4f8', flex:1, textTransform:'uppercase' }}>{isBSB ? 'Defensive Positioning' : 'Defensive Scheme Generator'}</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'1px', padding:'2px 7px', borderRadius:2, background:al(S,0.15), color:S, textTransform:'uppercase' }}>DEFENSIVE</span>
        <span style={{ fontSize:12, color:'#6b7a96', marginLeft:4 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding:14, animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            {activeCfg.map(f => (<Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />))}
          </div>
          <PBtn onClick={generate} disabled={loading} color={S}>{loading ? 'BUILDING...' : isBSB ? 'BUILD DEFENSIVE PLAN' : 'BUILD DEFENSIVE SCHEME'}</PBtn>
          {loading && <Shimmer />}
          {error && <ErrBox msg={error} />}
          {result && (
            <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(S,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, letterSpacing:1, color:S, marginBottom:6 }}>{result.packageName}</div>
              <p style={{ fontSize:12, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>{result.summary}</p>
              {result.keyStop && (<div style={{ padding:'8px 12px', background:al(S,0.1), border:`1px solid ${al(S,0.25)}`, borderRadius:8, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Primary Assignment</div><div style={{ fontSize:13, color:'#f2f4f8', fontWeight:600 }}>{result.keyStop}</div></div>)}
              {(result.formations||[]).map(f => (
                <DefFormationCardWithSave key={f.number} formation={f} S={S} P={P} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} playbook={playbook} onAddToPlaybook={addDefToPlaybook} />
              ))}
              {result.adjustmentTip && (<div style={{ marginTop:10, padding:10, background:'#0f1117', borderRadius:8, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Halftime Adjustment</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{result.adjustmentTip}</div></div>)}
              {result.coachingCue && (<div style={{ marginTop:8, padding:10, background:al(S,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Defensive Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic' }}>"{result.coachingCue}"</div></div>)}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

function DefFormationCardWithSave({ formation: f, S, P, al, callAI, parseJSON, sport, playbook, onAddToPlaybook }) {
  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [saved, setSaved] = useState(false)
  const sportFolders = playbook[sport] || {}
  const existingFolders = [...new Set([...DEFAULT_FOLDERS[sport]||[], ...Object.keys(sportFolders)])]

  return (
    <div style={{ position:'relative' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
        <div style={{ flex:1 }}><DefFormationCard formation={f} S={S} P={P} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} /></div>
        <div style={{ flexShrink:0 }}>
          {saved ? (
            <span style={{ fontSize:9, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>✓</span>
          ) : (
            <button onClick={()=>setShowSaveMenu(s=>!s)} style={{ padding:'3px 7px', background:al(S,0.12), border:`1px solid ${al(S,0.3)}`, borderRadius:3, color:S, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif" }}>+PB</button>
          )}
          {showSaveMenu && (
            <div style={{ position:'absolute', right:0, top:'100%', marginTop:4, background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:8, zIndex:50, minWidth:180, boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }}>
              {existingFolders.map(fn => (
                <div key={fn} onClick={()=>{onAddToPlaybook(f,fn);setSaved(fn);setShowSaveMenu(false)}} style={{ padding:'7px 10px', fontSize:12, color:'#f2f4f8', cursor:'pointer', borderRadius:5 }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <span style={{ fontSize:11 }}>📁</span> {fn}
                </div>
              ))}
              <div style={{ borderTop:'1px solid #1e2330', marginTop:6, paddingTop:6, display:'flex', gap:6 }}>
                <input value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} placeholder="New folder..." style={{ flex:1, background:'#0f1117', border:'1px solid #1e2330', borderRadius:4, padding:'5px 8px', color:'#f2f4f8', fontSize:11, outline:'none', fontFamily:'inherit' }} onKeyDown={e=>{if(e.key==='Enter'&&newFolderName.trim()){onAddToPlaybook(f,newFolderName.trim());setSaved(newFolderName.trim());setNewFolderName('');setShowSaveMenu(false)}}} />
                <button onClick={()=>{if(newFolderName.trim()){onAddToPlaybook(f,newFolderName.trim());setSaved(newFolderName.trim());setNewFolderName('');setShowSaveMenu(false)}}} style={{ padding:'5px 8px', background:S, border:'none', borderRadius:4, color:'white', fontSize:10, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


// ─── PLAYBOOK PAGE (restructured) ────────────────────────────────────────────
function PlaybookPage({ P, S, al, sport, callAI, parseJSON, playbook, setPlaybook, teams, activeTeam }) {
  const sportTeams = teams[sport] || []
  // Active team for playbook view — default to active team, or first team, or null
  const [viewingTeam, setViewingTeam] = useState(() => activeTeam[sport]?.id || null)
  const [playMode, setPlayMode] = useState('browse') // browse | create
  const [activeFolder, setActiveFolder] = useState(DEFAULT_FOLDERS[sport]?.[0] || 'My Favorites')
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [copyTarget, setCopyTarget] = useState(null) // { play, fromTeamId, fromFolder }

  // Determine which playbook we're viewing
  const teamKey = viewingTeam ? `team_${viewingTeam}` : 'general'
  const currentPb = playbook[sport]?.[teamKey] || {}
  const allFolderNames = [...new Set([...(DEFAULT_FOLDERS[sport]||[]), ...Object.keys(currentPb)])]
  const folderPlays = currentPb[activeFolder] || []

  const viewingTeamName = sportTeams.find(t=>t.id===viewingTeam)?.name || 'General Playbook'

  function removePlay(idx) {
    const updated = folderPlays.filter((_,i)=>i!==idx)
    setPlaybook(pb => ({
      ...pb,
      [sport]: { ...(pb[sport]||{}), [teamKey]: { ...currentPb, [activeFolder]: updated } }
    }))
  }

  function createFolder() {
    if (!newFolderName.trim()) return
    setActiveFolder(newFolderName.trim())
    setNewFolderName('')
    setShowNewFolder(false)
  }

  function copyPlay(play, targetTeamId, targetFolder) {
    const targetKey = targetTeamId ? `team_${targetTeamId}` : 'general'
    const targetPb = playbook[sport]?.[targetKey] || {}
    const targetFolderPlays = targetPb[targetFolder] || []
    setPlaybook(pb => ({
      ...pb,
      [sport]: {
        ...(pb[sport]||{}),
        [targetKey]: { ...targetPb, [targetFolder]: [...targetFolderPlays, { ...play, _copiedFrom: viewingTeamName, _copiedAt: Date.now() }] }
      }
    }))
    setCopyTarget(null)
  }

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Saved plays · {sport}</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Playbook</div>
      </div>

      {/* Team playbook switcher */}
      <div style={{ marginBottom:10 }}>
        <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Viewing playbook for</label>
        <select value={viewingTeam||''} onChange={e=>{ setViewingTeam(e.target.value||null); setActiveFolder(DEFAULT_FOLDERS[sport]?.[0]||'My Favorites') }} style={{ width:'100%', background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
          <option value="">General Playbook (no team)</option>
          {sportTeams.map(t => <option key={t.id} value={t.id}>{t.name} — {t.season}</option>)}
        </select>
      </div>

      {/* Mode switcher */}
      <div style={{ display:'flex', gap:6, marginBottom:12 }}>
        {[['browse','📖 Browse Plays'],['create','✏️ Create Play']].map(([m,lbl]) => (
          <button key={m} onClick={()=>setPlayMode(m)} style={{ flex:1, padding:'9px', borderRadius:4, fontSize:11, border:`1px solid ${playMode===m?P:'#1e2330'}`, background:playMode===m?al(P,0.15):'transparent', color:playMode===m?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>{lbl}</button>
        ))}
      </div>

      {playMode === 'create' && (
        <IndividualPlayCreator
          sport={sport} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON}
          onSavePlay={(play, folder) => {
            const f = folder || activeFolder
            const existing = currentPb[f] || []
            setPlaybook(pb => ({
              ...pb,
              [sport]: { ...(pb[sport]||{}), [teamKey]: { ...currentPb, [f]: [...existing, play] } }
            }))
          }}
        />
      )}

      {playMode === 'browse' && (
        <>
          {/* Folder tabs */}
          <div style={{ overflowX:'auto', display:'flex', gap:6, paddingBottom:4, marginBottom:10 }}>
            {allFolderNames.map(f => (
              <button key={f} onClick={()=>setActiveFolder(f)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:`1px solid ${activeFolder===f?P:'#1e2330'}`, background:activeFolder===f?al(P,0.15):'transparent', color:activeFolder===f?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>
                {f} <span style={{ opacity:0.6 }}>{(currentPb[f]||[]).length}</span>
              </button>
            ))}
            <button onClick={()=>setShowNewFolder(s=>!s)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:'1px dashed #1e2330', background:'transparent', color:'#3d4559', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ New</button>
          </div>

          {showNewFolder && (
            <div style={{ display:'flex', gap:7, marginBottom:10 }}>
              <input value={newFolderName} onChange={e=>setNewFolderName(e.target.value)} placeholder="Folder name..." onKeyDown={e=>e.key==='Enter'&&createFolder()} style={{ flex:1, background:'#161922', border:`1px solid ${P}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
              <button onClick={createFolder} style={{ padding:'0 16px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CREATE</button>
            </div>
          )}

          {folderPlays.length === 0 ? (
            <Card>
              <div style={{ padding:'32px 20px', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#6b7a96', letterSpacing:'1px', marginBottom:6 }}>{activeFolder} is empty</div>
                <div style={{ fontSize:12, color:'#3d4559', lineHeight:1.6, marginBottom:12 }}>Generate a scheme in Schemes tab or create an individual play above, then save it here.</div>
                <button onClick={()=>setPlayMode('create')} style={{ padding:'9px 18px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:'1px' }}>CREATE A PLAY</button>
              </div>
            </Card>
          ) : (
            <div>
              <div style={{ fontSize:10, color:'#6b7a96', marginBottom:8 }}>{folderPlays.length} play{folderPlays.length!==1?'s':''} · {viewingTeamName} · {activeFolder}</div>
              {folderPlays.map((play, i) => (
                <div key={i} style={{ marginBottom:8, position:'relative' }}>
                  <div style={{ position:'absolute', top:8, right:8, zIndex:10, display:'flex', gap:5 }}>
                    <button onClick={()=>setCopyTarget({ play, fromFolder:activeFolder })} style={{ padding:'3px 7px', background:'rgba(107,154,255,0.1)', border:'1px solid rgba(107,154,255,0.3)', borderRadius:3, color:'#6b9fff', fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>COPY</button>
                    <button onClick={()=>removePlay(i)} style={{ padding:'3px 7px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:3, color:'#ef4444', fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>✕</button>
                  </div>
                  <PlayCard play={play} P={play._isDefense?'#6b9fff':P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} />
                </div>
              ))}
            </div>
          )}

          {/* Copy play modal */}
          {copyTarget && (
            <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
              <div style={{ background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:8, padding:20, width:'100%', maxWidth:380 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#f2f4f8', marginBottom:4 }}>Copy "{copyTarget.play.name}"</div>
                <div style={{ fontSize:11, color:'#6b7a96', marginBottom:14 }}>Choose destination team and folder</div>
                <div style={{ marginBottom:10 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Destination Team</label>
                  <select id="copyTeamSel" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
                    <option value="">General Playbook</option>
                    {sportTeams.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Destination Folder</label>
                  <select id="copyFolderSel" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none' }}>
                    {(DEFAULT_FOLDERS[sport]||[]).map(f=><option key={f}>{f}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>setCopyTarget(null)} style={{ flex:1, padding:'10px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
                  <button onClick={()=>{ const ts=document.getElementById('copyTeamSel'); const fs=document.getElementById('copyFolderSel'); copyPlay(copyTarget.play, ts?.value||null, fs?.value||DEFAULT_FOLDERS[sport]?.[0]) }} style={{ flex:2, padding:'10px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>COPY PLAY</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}


// ─── SCOUT PAGE (rebuilt with dropdowns + film) ────────────────────────────────
function ScoutPage({ P, S, al, sport, callAI, parseJSON, teams, activeTeam }) {
  const [scoutMode, setScoutMode] = useState('opponent') // opponent | self
  const [opponents, setOpponents] = useState([])
  const [activeOpp, setActiveOpp] = useState(null)
  const [showAddOpp, setShowAddOpp] = useState(false)
  const [scoutLoading, setScoutLoading] = useState(false)
  const [scoutResult, setScoutResult] = useState(null)
  const [notes, setNotes] = useState({})
  const [tendencies, setTendencies] = useState({})
  const [newTendency, setNewTendency] = useState('')

  const isFB = sport==='Football', isBB = sport==='Basketball', isBSB = sport==='Baseball'
  const currentTeam = activeTeam[sport]

  // Structured scouting dropdowns
  const [oppForm, setOppForm] = useState({
    offStyle: '', defStyle: '', keyThreat: '', tempo: '', specialty: ''
  })

  const fbOppOpts = {
    offStyle: ['Unknown','Spread / Pass Heavy','Wing-T / Misdirection','Power Run','Option / Read Heavy','Balanced','Air It Out'],
    defStyle: ['Unknown','4-3 Base','3-4 Base','5-2 Youth','Blitz Heavy','Zone Heavy','Man Press','Multiple'],
    keyThreat: ['Unknown','Elite QB / Scrambler','Power RB','Speed Receivers','Big Physical OL','Multiple Threats','No Clear Star'],
    tempo: ['Unknown','Hurry-Up / No Huddle','Slow / Methodical','Balanced','Two-Minute Style'],
    specialty: ['None Known','Strong Special Teams','Trick Plays Heavy','Goal Line Package','Screen Game Heavy','Jet Sweeps'],
  }
  const bbOppOpts = {
    offStyle: ['Unknown','Motion / Ball Movement','ISO / Star Player','Pick & Roll Heavy','Drive & Kick','Post Dominant','Transition Heavy'],
    defStyle: ['Unknown','Man-to-Man','2-3 Zone','1-3-1 Zone','Full Court Press','Matchup Zone','Switching Everything'],
    keyThreat: ['Unknown','Elite Ball Handler','Dominant Big','3-Point Shooter','Athletic Wing','Balanced Team'],
    tempo: ['Unknown','Fast Pace / Push It','Slow / Grind','Balanced','End of Shot Clock'],
    specialty: ['None Known','Trap Heavy','Technical Fouls / Physical','Zone Trap','Pressing Every Possession','Hack-a-Player'],
  }
  const bsbOppOpts = {
    offStyle: ['Unknown','Pull Hitters','Spray Hitters','Small Ball / Bunts','Power Lineup','Speed & Steals','Patient / Walk Heavy'],
    defStyle: ['Unknown','Standard Alignments','Heavy Shifting','Five Man Infield Late','Aggressive Outfield','Wheel Play Heavy'],
    keyThreat: ['Unknown','Elite Leadoff Hitter','Cleanup Power Hitter','Speed on Bases','Strong Pitching','Balanced Lineup'],
    tempo: ['Unknown','Aggressive Base Running','Conservative','Steal on 1st Pitch','Take Pitches'],
    specialty: ['None Known','Strong Bullpen','Knuckleball / Junk','Elite Defense','Hit & Run Heavy'],
  }
  const oppOpts = isBB ? bbOppOpts : isBSB ? bsbOppOpts : fbOppOpts

  const [newOppName, setNewOppName] = useState('')
  const [gameDate, setGameDate] = useState('')

  function addOpponent() {
    if (!newOppName.trim()) return
    const opp = { id: Date.now(), name: newOppName.trim(), sport, gameDate, teamId: currentTeam?.id || null }
    setOpponents(prev => [...prev, opp])
    setActiveOpp(opp.id)
    setNewOppName(''); setGameDate('')
    setShowAddOpp(false)
  }

  const currentOpp = opponents.find(o => o.id === activeOpp)

  async function generateScoutReport() {
    if (!currentOpp) return
    setScoutLoading(true); setScoutResult(null)
    const structured = Object.entries(oppForm).filter(([,v])=>v).map(([k,v])=>k+': '+v).join(', ')
    const freeNotes = notes[activeOpp] || ''
    const tendList = (tendencies[activeOpp]||[]).join(', ')
    const teamCtx = currentTeam ? `Scouting for team: ${currentTeam.name} (${sport}).` : ''
    try {
      const raw = await callAI(`You are an elite youth ${sport.toLowerCase()} scout. ${teamCtx} Generate a comprehensive opponent scouting report for: "${currentOpp.name}". Structured info: ${structured||'None'}. Observed tendencies: ${tendList||'None'}. Coach notes: ${freeNotes||'None'}. Return ONLY valid JSON: {"overview":"2-3 sentence opponent summary","keyThreats":[{"threat":"name","description":"what they do","howToStop":"counter"},{"threat":"name","description":"what they do","howToStop":"counter"},{"threat":"name","description":"what they do","howToStop":"counter"}],"offensiveTendencies":["t1","t2","t3"],"defensiveTendencies":["t1","t2","t3"],"gameplan":"3-4 sentence overall game plan","keyAdjustment":"most important tactical adjustment","motivationalNote":"one line for your team"}`)
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setScoutResult(JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1)))
    } catch(e) { setScoutResult({ error: e.message }) }
    setScoutLoading(false)
  }

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Game preparation</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Scout</div>
      </div>

      {/* Mode switcher */}
      <div style={{ display:'flex', gap:6, marginBottom:12 }}>
        {[['opponent','🔍 Opponent Scout'],['self','🎥 Self Scout / Film']].map(([m,lbl]) => (
          <button key={m} onClick={()=>setScoutMode(m)} style={{ flex:1, padding:'9px', borderRadius:4, fontSize:11, border:`1px solid ${scoutMode===m?P:'#1e2330'}`, background:scoutMode===m?al(P,0.15):'transparent', color:scoutMode===m?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{lbl}</button>
        ))}
      </div>

      {scoutMode === 'self' && (
        <FilmPage P={P} S={S} al={al} dk={(h,a)=>h} sport={sport} callAI={callAI} parseJSON={parseJSON} teamContext={currentTeam} />
      )}

      {scoutMode === 'opponent' && (
        <>
          {currentTeam && <div style={{ padding:'6px 10px', background:al(P,0.08), border:`1px solid ${al(P,0.2)}`, borderRadius:4, marginBottom:10, fontSize:11, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Scouting for: {currentTeam.name} — {currentTeam.season}</div>}

          {/* Opponent tabs */}
          <div style={{ overflowX:'auto', display:'flex', gap:6, paddingBottom:4, marginBottom:10 }}>
            {opponents.filter(o=>o.sport===sport&&(!currentTeam||o.teamId===currentTeam?.id||!o.teamId)).map(o => (
              <button key={o.id} onClick={()=>{setActiveOpp(o.id);setScoutResult(null)}} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:`1px solid ${activeOpp===o.id?P:'#1e2330'}`, background:activeOpp===o.id?al(P,0.15):'transparent', color:activeOpp===o.id?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>{o.name}</button>
            ))}
            <button onClick={()=>setShowAddOpp(s=>!s)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:'1px dashed #1e2330', background:'transparent', color:'#3d4559', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ Add Opponent</button>
          </div>

          {showAddOpp && (
            <div style={{ display:'flex', gap:7, marginBottom:10, flexWrap:'wrap' }}>
              <input value={newOppName} onChange={e=>setNewOppName(e.target.value)} placeholder="Opponent name (optional)..." onKeyDown={e=>e.key==='Enter'&&addOpponent()} style={{ flex:2, minWidth:140, background:'#161922', border:`1px solid ${P}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
              <input value={gameDate} onChange={e=>setGameDate(e.target.value)} placeholder="Game date" style={{ flex:1, minWidth:100, background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
              <button onClick={addOpponent} style={{ padding:'0 14px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>ADD</button>
            </div>
          )}

          {!currentOpp ? (
            <Card>
              <div style={{ padding:'40px 20px', textAlign:'center' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#6b7a96', letterSpacing:'1px', marginBottom:8 }}>No Opponent Added Yet</div>
                <div style={{ fontSize:12, color:'#3d4559', lineHeight:1.6, marginBottom:16 }}>Add an upcoming opponent to build a full AI scouting report. Opponent name is optional — you can scout anonymously.</div>
                <button onClick={()=>setShowAddOpp(true)} style={{ padding:'10px 20px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', cursor:'pointer' }}>ADD OPPONENT</button>
              </div>
            </Card>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <Card>
                <CardHead icon="🔍" title={currentOpp.name || 'Next Opponent'} tag={sport.toUpperCase()} tagColor={P} accent={P} />
                <div style={{ padding:14 }}>
                  {/* Structured dropdowns */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Scouting Profile</div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {Object.entries(oppOpts).map(([key, opts]) => (
                        <Sel key={key} label={key.replace(/([A-Z])/g,' $1').trim()} value={oppForm[key]||opts[0]} onChange={v=>setOppForm(f=>({...f,[key]:v}))} options={opts} />
                      ))}
                    </div>
                  </div>
                  {/* Observed tendencies */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Observed Tendencies <span style={{ color:'#3d4559', fontSize:8 }}>(add anything not in dropdowns)</span></div>
                    {(tendencies[activeOpp]||[]).map((t,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, marginBottom:5 }}>
                        <div style={{ width:6, height:6, borderRadius:'50%', background:P, flexShrink:0 }} />
                        <div style={{ flex:1, fontSize:12, color:'#f2f4f8' }}>{t}</div>
                        <button onClick={()=>setTendencies(prev=>({...prev,[activeOpp]:(prev[activeOpp]||[]).filter((_,j)=>j!==i)}))} style={{ background:'transparent', border:'none', color:'#3d4559', cursor:'pointer', fontSize:14 }}>×</button>
                      </div>
                    ))}
                    <div style={{ display:'flex', gap:7 }}>
                      <input value={newTendency} onChange={e=>setNewTendency(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&newTendency.trim()){setTendencies(prev=>({...prev,[activeOpp]:[...(prev[activeOpp]||[]),newTendency.trim()]}));setNewTendency('')}}} placeholder="e.g. Always runs on 1st down, QB scrambles left..." style={{ flex:1, background:'#161922', border:'1px solid #1e2330', borderRadius:5, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
                      <button onClick={()=>{if(newTendency.trim()){setTendencies(prev=>({...prev,[activeOpp]:[...(prev[activeOpp]||[]),newTendency.trim()]}));setNewTendency('')}}} style={{ padding:'0 12px', background:al(P,0.15), border:`1px solid ${P}`, borderRadius:5, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>ADD</button>
                    </div>
                  </div>
                  {/* Free-form notes */}
                  <div style={{ marginBottom:12 }}>
                    <div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Coach Notes</div>
                    <textarea value={notes[activeOpp]||''} onChange={e=>setNotes(prev=>({...prev,[activeOpp]:e.target.value}))} placeholder="Add anything else you know — personnel, tendencies, coaches, film observations..." rows={3} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:6, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', resize:'vertical' }} />
                  </div>
                  <PBtn onClick={generateScoutReport} disabled={scoutLoading} color={P}>{scoutLoading?'SCOUTING...':'🔍 GENERATE SCOUT REPORT'}</PBtn>
                </div>
              </Card>

              {scoutLoading && <div style={{ padding:16, textAlign:'center' }}><div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 8px' }} /><div style={{ fontSize:12, color:'#6b7a96' }}>Building scouting report...</div></div>}

              {scoutResult && !scoutResult.error && (
                <Card>
                  <CardHead icon="📊" title="Scouting Report" accent={P} />
                  <div style={{ padding:14 }}>
                    <p style={{ fontSize:13, color:'#f2f4f8', lineHeight:1.6, marginBottom:12 }}>{scoutResult.overview}</p>
                    <div style={{ marginBottom:12 }}>
                      <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Key Threats</div>
                      {(scoutResult.keyThreats||[]).map((t,i) => (
                        <div key={i} style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:8, padding:'10px 12px', marginBottom:8 }}>
                          <div style={{ fontSize:12, fontWeight:700, color:'#f87171', marginBottom:3 }}>⚠ {t.threat}</div>
                          <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5, marginBottom:5 }}>{t.description}</div>
                          <div style={{ fontSize:11, color:'#4ade80' }}>✓ Counter: {t.howToStop}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
                      <div style={{ background:'#161922', borderRadius:8, padding:10 }}>
                        <div style={{ fontSize:9, letterSpacing:1.5, color:'#f59e0b', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Their Offense</div>
                        {(scoutResult.offensiveTendencies||[]).map((t,i)=><div key={i} style={{ fontSize:11, color:'#f2f4f8', marginBottom:4, lineHeight:1.4 }}>• {t}</div>)}
                      </div>
                      <div style={{ background:'#161922', borderRadius:8, padding:10 }}>
                        <div style={{ fontSize:9, letterSpacing:1.5, color:'#6b9fff', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Their Defense</div>
                        {(scoutResult.defensiveTendencies||[]).map((t,i)=><div key={i} style={{ fontSize:11, color:'#f2f4f8', marginBottom:4, lineHeight:1.4 }}>• {t}</div>)}
                      </div>
                    </div>
                    <div style={{ background:al(P,0.08), border:`1px solid ${al(P,0.25)}`, borderRadius:8, padding:'10px 12px', marginBottom:10 }}>
                      <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:5 }}>Game Plan</div>
                      <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{scoutResult.gameplan}</div>
                    </div>
                    {scoutResult.keyAdjustment && <div style={{ background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:8, padding:'10px 12px', marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:'#4ade80', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Key Adjustment</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{scoutResult.keyAdjustment}</div></div>}
                    {scoutResult.motivationalNote && <div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:'10px 12px', borderLeft:`3px solid ${P}` }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Tell Your Team</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic' }}>"{scoutResult.motivationalNote}"</div></div>}
                  </div>
                </Card>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}


// ─── TEAM TAB PAGE ────────────────────────────────────────────────────────────
function TeamPage({ P, S, al, sport, teams, setTeams, activeTeam, setActiveTeam, callAI, parseJSON, setCfg, brand }) {
  const [section, setSection] = useState('roster') // roster | practice | analytics | print
  const currentTeam = activeTeam[sport]
  const sportTeams = teams[sport] || []

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Team management</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Team</div>
      </div>

      {/* Team Manager (create/switch) */}
      <TeamManagerCard sport={sport} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} P={P} al={al} setCfg={setCfg} />

      {!currentTeam ? (
        <div style={{ marginTop:20, padding:'40px 20px', textAlign:'center', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🏆</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#6b7a96', letterSpacing:'1px', marginBottom:8 }}>No Team Selected</div>
          <div style={{ fontSize:12, color:'#3d4559', lineHeight:1.6 }}>Create or select a team above to access practice plans, analytics, and printable sheets.</div>
        </div>
      ) : (
        <>
          {/* Section nav */}
          <div style={{ display:'flex', gap:6, marginTop:14, marginBottom:14, overflowX:'auto', paddingBottom:2 }}>
            {[['roster','👥 Roster'],['practice','📆 Practice'],['analytics','📊 Analytics'],['print','🖨 Print']].map(([s,lbl]) => (
              <button key={s} onClick={()=>setSection(s)} style={{ flexShrink:0, padding:'8px 14px', borderRadius:4, fontSize:11, border:`1px solid ${section===s?P:'#1e2330'}`, background:section===s?al(P,0.15):'transparent', color:section===s?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>{lbl}</button>
            ))}
          </div>

          {section === 'roster' && <RosterSection team={currentTeam} P={P} al={al} teams={teams} setTeams={setTeams} sport={sport} />}
          {section === 'practice' && <PracticePlanSection team={currentTeam} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} />}
          {section === 'analytics' && <AnalyticsSection team={currentTeam} P={P} al={al} />}
          {section === 'print' && <PrintSection team={currentTeam} P={P} S={S} al={al} callAI={callAI} sport={sport} />}
        </>
      )}
    </>
  )
}

function RosterSection({ team, P, al, teams, setTeams, sport }) {
  const [players, setPlayers] = useState(team.players || [])
  const [newName, setNewName] = useState('')
  const [newPos, setNewPos] = useState('')
  const [newNum, setNewNum] = useState('')

  const positions = {
    Football: ['QB','RB','WR','TE','OL','DL','LB','CB','S','K','P'],
    Basketball: ['PG','SG','SF','PF','C'],
    Baseball: ['P','C','1B','2B','3B','SS','LF','CF','RF','DH'],
  }

  function addPlayer() {
    if (!newName.trim()) return
    const p = { id: Date.now(), name: newName.trim(), position: newPos, number: newNum }
    const updated = [...players, p]
    setPlayers(updated)
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t, players:updated} : t) }))
    setNewName(''); setNewPos(''); setNewNum('')
  }

  function removePlayer(id) {
    const updated = players.filter(p=>p.id!==id)
    setPlayers(updated)
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t, players:updated} : t) }))
  }

  return (
    <Card>
      <CardHead icon="👥" title="Roster" tag={`${players.length} players`} tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:7, marginBottom:12, alignItems:'end' }}>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Name</label>
            <input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPlayer()} placeholder="Player name" style={{ width:'100%', background:'#161922', border:`1px solid ${newName?P:'#1e2330'}`, borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
          </div>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Pos</label>
            <select value={newPos} onChange={e=>setNewPos(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 6px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', appearance:'none' }}>
              <option value="">—</option>
              {(positions[sport]||[]).map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>#</label>
            <input value={newNum} onChange={e=>setNewNum(e.target.value)} placeholder="00" maxLength={2} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', textAlign:'center' }} />
          </div>
          <button onClick={addPlayer} style={{ padding:'8px 12px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', marginTop:18 }}>+</button>
        </div>
        {players.length === 0 ? (
          <div style={{ textAlign:'center', padding:'20px 0', color:'#3d4559', fontSize:12 }}>No players added yet</div>
        ) : (
          <div>
            {players.map(p => (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, marginBottom:6 }}>
                {p.number && <div style={{ width:28, height:28, borderRadius:'50%', background:al(P,0.15), border:`1px solid ${al(P,0.3)}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:13, color:P, flexShrink:0 }}>{p.number}</div>}
                <div style={{ flex:1 }}><div style={{ fontSize:13, color:'#f2f4f8', fontWeight:500 }}>{p.name}</div>{p.position&&<div style={{ fontSize:10, color:'#6b7a96' }}>{p.position}</div>}</div>
                <button onClick={()=>removePlayer(p.id)} style={{ background:'transparent', border:'none', color:'#3d4559', cursor:'pointer', fontSize:14 }}>×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

function PracticePlanSection({ team, P, S, al, callAI, parseJSON, sport }) {
  const [plans, setPlans] = useState([])
  const [generating, setGenerating] = useState(false)
  const [planForm, setPlanForm] = useState({ focus:'', duration:'90 minutes', intensity:'Medium', opponent:'', date:'' })
  const [showForm, setShowForm] = useState(false)

  const focusOpts = {
    Football: ['Balanced / Full Team','Offense Only','Defense Only','Special Teams','Red Zone','Two-Minute Drill','Goal Line','Opening Drive','Game Preparation'],
    Basketball: ['Balanced / Full Team','Offense Only','Defense Only','Press Break','Transition','End of Game Situations','Free Throws','Post Play','Perimeter'],
    Baseball: ['Balanced / Full Team','Hitting Only','Pitching / Bullpen','Fielding / Defense','Baserunning','Situations','Batting Practice','Infield / Outfield'],
  }

  async function generatePlan() {
    setGenerating(true)
    const ctx = `Team: ${team.name}, Sport: ${sport}, Season: ${team.season}, Players: ${(team.players||[]).length} on roster.`
    const inputs = `Focus: ${planForm.focus||'Balanced'}, Duration: ${planForm.duration}, Intensity: ${planForm.intensity}${planForm.opponent?', Upcoming opponent: '+planForm.opponent:''}.`
    try {
      const raw = await callAI(`You are an elite youth ${sport.toLowerCase()} coach. Generate a detailed practice plan. ${ctx} ${inputs} Return ONLY valid JSON: {"title":"practice plan name","date":"${planForm.date||'Next Practice'}","duration":"${planForm.duration}","warmup":{"time":"X min","activities":["activity 1","activity 2"]},"segments":[{"name":"segment name","time":"X min","drill":"drill name","purpose":"why","coaching":"key coaching point","reps":"how many reps or time"},{"name":"segment 2","time":"X min","drill":"drill name","purpose":"why","coaching":"key coaching point","reps":"reps"},{"name":"segment 3","time":"X min","drill":"drill name","purpose":"why","coaching":"key coaching point","reps":"reps"},{"name":"segment 4","time":"X min","drill":"drill name","purpose":"why","coaching":"key coaching point","reps":"reps"}],"teamPeriod":{"time":"X min","activity":"full team activity","notes":"coaching emphasis"},"cooldown":{"time":"X min","activity":"cooldown activity"},"coachNote":"motivational note for the team"}`)
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      const plan = { ...JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1)), id: Date.now(), _form: planForm }
      setPlans(prev => [plan, ...prev])
      setShowForm(false)
    } catch(e) { console.error(e) }
    setGenerating(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <Card>
        <CardHead icon="📆" title="Practice Planner" accent={P} />
        <div style={{ padding:14 }}>
          {!showForm ? (
            <button onClick={()=>setShowForm(true)} style={{ width:'100%', padding:'11px', background:al(P,0.12), border:`1px dashed ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>+ GENERATE PRACTICE PLAN</button>
          ) : (
            <div style={{ animation:'fadeIn 0.2s ease' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                <Sel label="Focus Area" value={planForm.focus||focusOpts[sport][0]} onChange={v=>setPlanForm(f=>({...f,focus:v}))} options={focusOpts[sport]||focusOpts.Football} />
                <Sel label="Duration" value={planForm.duration} onChange={v=>setPlanForm(f=>({...f,duration:v}))} options={['45 minutes','60 minutes','75 minutes','90 minutes','2 hours','2.5 hours']} />
                <Sel label="Intensity" value={planForm.intensity} onChange={v=>setPlanForm(f=>({...f,intensity:v}))} options={['Light / Recovery','Medium','High / Game Prep','Game Week Intensity']} />
                <div>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Practice Date</label>
                  <input value={planForm.date} onChange={e=>setPlanForm(f=>({...f,date:e.target.value}))} placeholder="e.g. Monday 4/21" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Upcoming Opponent <span style={{ color:'#3d4559' }}>(optional)</span></label>
                  <input value={planForm.opponent} onChange={e=>setPlanForm(f=>({...f,opponent:e.target.value}))} placeholder="e.g. Coventry Eagles" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>setShowForm(false)} style={{ flex:1, padding:'10px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
                <button onClick={generatePlan} disabled={generating} style={{ flex:2, padding:'10px', background:generating?'#3d4559':P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:generating?'not-allowed':'pointer', letterSpacing:'1px' }}>{generating?'GENERATING...':'GENERATE PLAN'}</button>
              </div>
              {generating && <Shimmer />}
            </div>
          )}
        </div>
      </Card>

      {plans.map(plan => (
        <Card key={plan.id}>
          <div style={{ padding:'11px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${P}` }}>
            <span style={{ fontSize:15 }}>📋</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase' }}>{plan.title}</div>
              <div style={{ fontSize:10, color:'#6b7a96', marginTop:1 }}>{plan.date} · {plan.duration}</div>
            </div>
          </div>
          <div style={{ padding:14 }}>
            {plan.warmup && <div style={{ padding:'8px 12px', background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:8, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:'#4ade80', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Warmup — {plan.warmup.time}</div>{(plan.warmup.activities||[]).map((a,i)=><div key={i} style={{ fontSize:11, color:'#f2f4f8', marginBottom:2 }}>• {a}</div>)}</div>}
            {(plan.segments||[]).map((seg,i) => (
              <div key={i} style={{ padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:8, marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ width:22, height:22, minWidth:22, background:al(P,0.15), border:`1px solid ${al(P,0.3)}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:P }}>{i+1}</div>
                  <div><div style={{ fontSize:12, fontWeight:700, color:'#f2f4f8' }}>{seg.name}</div><div style={{ fontSize:10, color:'#6b7a96' }}>{seg.time} · {seg.reps}</div></div>
                </div>
                <div style={{ fontSize:11, color:'#dde1f0', marginBottom:4, fontWeight:600 }}>📍 {seg.drill}</div>
                <div style={{ fontSize:11, color:'#6b7a96', marginBottom:4 }}>Purpose: {seg.purpose}</div>
                <div style={{ fontSize:11, color:P, fontStyle:'italic' }}>Coach: "{seg.coaching}"</div>
              </div>
            ))}
            {plan.teamPeriod && <div style={{ padding:'10px 12px', background:al(P,0.08), border:`1px solid ${al(P,0.25)}`, borderRadius:8, marginBottom:8 }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Team Period — {plan.teamPeriod.time}</div><div style={{ fontSize:12, color:'#f2f4f8', fontWeight:600, marginBottom:3 }}>{plan.teamPeriod.activity}</div><div style={{ fontSize:11, color:'#6b7a96' }}>{plan.teamPeriod.notes}</div></div>}
            {plan.coachNote && <div style={{ padding:'8px 12px', background:'rgba(0,0,0,0.3)', borderRadius:8, borderLeft:`3px solid ${P}` }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Coach's Note</div><div style={{ fontSize:12, color:'#f2f4f8', fontStyle:'italic' }}>"{plan.coachNote}"</div></div>}
          </div>
        </Card>
      ))}
    </div>
  )
}

function AnalyticsSection({ team, P, al }) {
  const metrics = [
    { label:'Schemes Generated', val: 0, color: P, icon:'📋' },
    { label:'Plays in Playbook', val: 0, color:'#4ade80', icon:'📖' },
    { label:'Gauntlet Score', val: 847, color:'#f59e0b', icon:'⚡' },
    { label:'Scout Reports', val: 0, color:'#6b9fff', icon:'🔍' },
    { label:'Practice Plans', val: 0, color:'#c084fc', icon:'📆' },
  ]
  return (
    <Card>
      <CardHead icon="📊" title="Analytics" tag="COMING SOON" tagColor="#f59e0b" accent={P} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {metrics.map((m,i) => (
            <div key={i} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:6, padding:'12px' }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{m.icon}</div>
              <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:24, color:m.color, lineHeight:1, marginBottom:3 }}>{m.val}</div>
              <div style={{ fontSize:10, color:'#6b7a96' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ padding:'12px', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:8, textAlign:'center' }}>
          <div style={{ fontSize:12, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1, marginBottom:4 }}>FULL ANALYTICS COMING SOON</div>
          <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.5 }}>Win probability models, tendency heat maps, opponent pattern recognition, and season-wide performance tracking.</div>
        </div>
      </div>
    </Card>
  )
}

function PrintSection({ team, P, S, al, callAI, sport }) {
  const [printType, setPrintType] = useState('wristband')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(null)

  const printTypes = [
    { id:'wristband', label:'📿 Wristband', desc:'QR/play call strips for game day' },
    { id:'playbook', label:'📋 Playbook Sheet', desc:'Full play diagrams for your playbook' },
    { id:'coach', label:'🗂 Coach Sheet', desc:'Sideline reference sheet' },
    { id:'practice', label:'📆 Practice Plan', desc:'Print-ready practice schedule' },
  ]

  async function generatePDF() {
    setGenerating(true)
    try {
      const content = await callAI(`You are a ${sport} coordinator. Generate content for a ${printType} sheet for team: ${team.name}, ${team.season}. Return a plain text formatted document suitable for printing. Include team name, sport, season, and relevant ${printType} content with clear sections and formatting. Keep it concise and professional.`)
      setGenerated({ type: printType, team: team.name, content, generatedAt: new Date().toLocaleString() })
    } catch(e) { console.error(e) }
    setGenerating(false)
  }

  function downloadAsPDF() {
    if (!generated) return
    const printWindow = window.open('', '_blank')
    const scriptTag = '<scr' + 'ipt>window.onload=()=>{window.print()}</scr' + 'ipt>'
    const html = [
      '<html><head><title>' + team.name + ' — ' + generated.type + '</title>',
      '<style>',
      'body { font-family: Arial, sans-serif; padding: 24px; max-width: 800px; margin: 0 auto; color: #111; }',
      'h1 { font-size: 22px; margin-bottom: 4px; }',
      'h2 { font-size: 14px; color: #555; margin-bottom: 16px; font-weight: normal; }',
      'pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; line-height: 1.6; }',
      '.header { border-bottom: 3px solid ' + P + '; padding-bottom: 12px; margin-bottom: 16px; }',
      '.footer { margin-top: 24px; font-size: 11px; color: #888; border-top: 1px solid #ddd; padding-top: 8px; }',
      '@media print { body { padding: 12px; } }',
      '</style></head><body>',
      '<div class="header"><h1>' + team.name + '</h1>',
      '<h2>' + sport + ' · ' + (team.season||'') + ' · ' + generated.type.toUpperCase() + ' SHEET</h2></div>',
      '<pre>' + generated.content + '</pre>',
      '<div class="footer">Generated by CoachIQ · ' + generated.generatedAt + '</div>',
      scriptTag,
      '</body></html>'
    ].join('')
    printWindow.document.write(html)
    printWindow.document.close()
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <Card>
        <CardHead icon="🖨" title="Printable Sheets" accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
            {printTypes.map(pt => (
              <div key={pt.id} onClick={()=>setPrintType(pt.id)} style={{ padding:'10px 12px', background:printType===pt.id?al(P,0.12):'#161922', border:`1px solid ${printType===pt.id?P:'#1e2330'}`, borderRadius:6, cursor:'pointer' }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8', marginBottom:3 }}>{pt.label}</div>
                <div style={{ fontSize:10, color:'#6b7a96', lineHeight:1.4 }}>{pt.desc}</div>
              </div>
            ))}
          </div>
          <PBtn onClick={generatePDF} disabled={generating} color={P}>{generating?'GENERATING...':'GENERATE '+printType.toUpperCase()}</PBtn>
          {generating && <Shimmer />}
          {generated && (
            <div style={{ marginTop:12, animation:'fadeIn 0.2s ease' }}>
              <div style={{ padding:'10px 12px', background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:8, marginBottom:10 }}>
                <div style={{ fontSize:9, letterSpacing:2, color:'#4ade80', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Ready to Print</div>
                <div style={{ fontSize:12, color:'#f2f4f8' }}>{team.name} — {generated.type} sheet generated</div>
              </div>
              <button onClick={downloadAsPDF} style={{ width:'100%', padding:'11px', background:'linear-gradient(135deg,#1B5E20,#2e7d32)', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:'1px', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <span>🖨</span> OPEN PRINT DIALOG (PDF)
              </button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )

// ─── TEAM PAGE (updated with schedule tab) ────────────────────────────────────
function TeamPage({ P, S, al, sport, teams, setTeams, activeTeam, setActiveTeam, callAI, parseJSON, setCfg, brand }) {
  const [section, setSection] = useState('roster')
  const currentTeam = activeTeam[sport]

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Team management</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Team</div>
      </div>

      <TeamManagerCard sport={sport} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} P={P} al={al} setCfg={setCfg} />

      {!currentTeam ? (
        <div style={{ marginTop:20, padding:'40px 20px', textAlign:'center', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🏆</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#6b7a96', letterSpacing:'1px', marginBottom:8 }}>No Team Selected</div>
          <div style={{ fontSize:12, color:'#3d4559', lineHeight:1.6 }}>Create or select a team above to access roster, schedule, practice plans, and printable sheets.</div>
        </div>
      ) : (
        <>
          <div style={{ display:'flex', gap:6, marginTop:14, marginBottom:14, overflowX:'auto', paddingBottom:2 }}>
            {[['roster','👥 Roster'],['schedule','📅 Schedule'],['practice','📆 Practice'],['analytics','📊 Analytics'],['print','🖨 Print']].map(([s,lbl]) => (
              <button key={s} onClick={()=>setSection(s)} style={{ flexShrink:0, padding:'8px 12px', borderRadius:4, fontSize:11, border:`1px solid ${section===s?P:'#1e2330'}`, background:section===s?al(P,0.15):'transparent', color:section===s?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>{lbl}</button>
            ))}
          </div>
          {section==='roster'   && <RosterSection team={currentTeam} P={P} al={al} teams={teams} setTeams={setTeams} sport={sport} />}
          {section==='schedule' && <ScheduleSection team={currentTeam} P={P} al={al} teams={teams} setTeams={setTeams} sport={sport} />}
          {section==='practice' && <PracticePlanSection team={currentTeam} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} schedule={currentTeam.schedule||[]} />}
          {section==='analytics'&& <AnalyticsSection team={currentTeam} P={P} al={al} />}
          {section==='print'    && <PrintSection team={currentTeam} P={P} S={S} al={al} callAI={callAI} sport={sport} />}
        </>
      )}
    </>
  )
}

function SplashScreen({ onDone, alreadyAuthed, brand='Red — C+IQ colored' }) {
  const [phase, setPhase] = useState('logo')

  useEffect(() => {
    const t = setTimeout(() => {
      if (alreadyAuthed) { onDone(true) } else { setPhase('cta') }
    }, 1600)
    return () => clearTimeout(t)
  }, [])

  const p = BRAND_PALETTES[brand] || BRAND_PALETTES['Red — C+IQ colored']
  const CIQ = p.accentOn === 'CIQ'
  const cC   = CIQ ? p.accent : '#f2f4f8'
  const cOach = CIQ ? '#f2f4f8' : p.accent
  const cIQ  = CIQ ? p.accent : '#f2f4f8'
  const accent = p.accent

  const bs = (anim, pos) => ({ position:'absolute', ...pos, animation:`${anim} ease-in-out infinite`, opacity:0.28, zIndex:0, pointerEvents:'none' })

  return (
    <div style={{ position:'fixed', inset:0, background:'#07090d', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px', overflow:'hidden', zIndex:999 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Barlow+Condensed:wght@600;700&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(-22deg)} 33%{transform:translate(12px,-18px) rotate(-15deg)} 66%{transform:translate(-8px,10px) rotate(-28deg)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-14px,12px)} 75%{transform:translate(10px,-8px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0) rotate(12deg)} 40%{transform:translate(16px,-10px) rotate(20deg)} 80%{transform:translate(-6px,14px) rotate(6deg)} }
        @keyframes float4 { 0%,100%{transform:translate(0,0) rotate(10deg)} 50%{transform:translate(-10px,-16px) rotate(18deg)} }
        @keyframes float5 { 0%,100%{transform:translate(0,0)} 30%{transform:translate(8px,12px)} 70%{transform:translate(-12px,-6px)} }
        @keyframes float6 { 0%,100%{transform:translate(0,0)} 45%{transform:translate(14px,8px)} }
        @keyframes float7 { 0%,100%{transform:translate(0,0) rotate(-5deg)} 35%{transform:translate(-16px,6px) rotate(-12deg)} 70%{transform:translate(8px,-10px) rotate(0deg)} }
        @keyframes logoReveal { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes ctaReveal { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Floating balls - full screen coverage */}
      <div style={bs('float1 7s',{left:'5%',top:'10%'})}><svg width="88" height="56" viewBox="0 0 88 56"><path d="M4 28 Q22 4 44 4 Q66 4 84 28 Q66 52 44 52 Q22 52 4 28Z" fill="#8B4513"/><path d="M4 28 Q22 6 44 4" stroke="white" strokeWidth="1.5" fill="none"/><path d="M84 28 Q66 6 44 4" stroke="white" strokeWidth="1.5" fill="none"/><path d="M4 28 Q22 50 44 52" stroke="white" strokeWidth="1.5" fill="none"/><path d="M84 28 Q66 50 44 52" stroke="white" strokeWidth="1.5" fill="none"/><line x1="38" y1="19" x2="50" y2="19" stroke="white" strokeWidth="2"/><line x1="38" y1="24" x2="50" y2="24" stroke="white" strokeWidth="2"/><line x1="44" y1="17" x2="44" y2="39" stroke="white" strokeWidth="1.5"/></svg></div>
      <div style={bs('float2 9s',{right:'6%',top:'15%'})}><svg width="74" height="74" viewBox="0 0 70 70"><circle cx="35" cy="35" r="32" fill="#C85A00"/><line x1="3" y1="35" x2="67" y2="35" stroke="#1a0a00" strokeWidth="2"/><line x1="35" y1="3" x2="35" y2="67" stroke="#1a0a00" strokeWidth="2"/><path d="M35 3 Q18 14 12 35 Q18 56 35 67" stroke="#1a0a00" strokeWidth="2" fill="none"/><path d="M35 3 Q52 14 58 35 Q52 56 35 67" stroke="#1a0a00" strokeWidth="2" fill="none"/></svg></div>
      <div style={bs('float3 8s',{left:'8%',bottom:'22%'})}><svg width="64" height="64" viewBox="0 0 56 56"><circle cx="28" cy="28" r="25" fill="#f8f4e8"/><path d="M13 9 Q5 28 13 47" stroke="#C0392B" strokeWidth="1.8" fill="none"/><path d="M43 9 Q51 28 43 47" stroke="#C0392B" strokeWidth="1.8" fill="none"/><line x1="13" y1="20" x2="19" y2="22" stroke="#C0392B" strokeWidth="1.2"/><line x1="10" y1="27" x2="16" y2="29" stroke="#C0392B" strokeWidth="1.2"/><line x1="43" y1="20" x2="37" y2="22" stroke="#C0392B" strokeWidth="1.2"/><line x1="46" y1="27" x2="40" y2="29" stroke="#C0392B" strokeWidth="1.2"/></svg></div>
      <div style={bs('float4 11s',{right:'10%',top:'5%'})}><svg width="56" height="56" viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="#f0f0f0"/><polygon points="26,5 31,16 21,16" fill="#222"/><polygon points="9,17 19,15 17,25 8,27" fill="#222"/><polygon points="43,17 33,15 35,25 44,27" fill="#222"/><polygon points="12,40 17,30 25,34 25,44" fill="#222"/><polygon points="40,40 35,30 27,34 27,44" fill="#222"/></svg></div>
      <div style={bs('float5 6.5s',{left:'50%',top:'8%'})}><svg width="48" height="48" viewBox="0 0 42 42"><circle cx="21" cy="21" r="19" fill="#c8d400"/><path d="M3 14 Q21 21 3 30" stroke="white" strokeWidth="2" fill="none"/><path d="M39 14 Q21 21 39 30" stroke="white" strokeWidth="2" fill="none"/></svg></div>
      <div style={bs('float6 10s',{right:'5%',bottom:'30%'})}><svg width="58" height="58" viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="#f0e8d0"/><path d="M3 19 Q26 26 3 35" stroke="#3a6ad4" strokeWidth="2" fill="none"/><path d="M49 19 Q26 26 49 35" stroke="#C0392B" strokeWidth="2" fill="none"/><line x1="3" y1="26" x2="49" y2="26" stroke="#888" strokeWidth="1.2"/></svg></div>
      <div style={bs('float7 12s',{left:'12%',top:'50%'})}><svg width="62" height="62" viewBox="0 0 54 54"><circle cx="27" cy="27" r="24" fill="#f0f0e8"/><circle cx="19" cy="15" r="1.8" fill="#d0d0c8"/><circle cx="27" cy="13" r="1.8" fill="#d0d0c8"/><circle cx="35" cy="15" r="1.8" fill="#d0d0c8"/><circle cx="15" cy="22" r="1.8" fill="#d0d0c8"/><circle cx="23" cy="20" r="1.8" fill="#d0d0c8"/><circle cx="31" cy="20" r="1.8" fill="#d0d0c8"/><circle cx="39" cy="22" r="1.8" fill="#d0d0c8"/><circle cx="13" cy="29" r="1.8" fill="#d0d0c8"/><circle cx="21" cy="27" r="1.8" fill="#d0d0c8"/><circle cx="29" cy="27" r="1.8" fill="#d0d0c8"/><circle cx="37" cy="27" r="1.8" fill="#d0d0c8"/><circle cx="41" cy="29" r="1.8" fill="#d0d0c8"/><circle cx="19" cy="41" r="1.8" fill="#d0d0c8"/><circle cx="27" cy="43" r="1.8" fill="#d0d0c8"/><circle cx="35" cy="41" r="1.8" fill="#d0d0c8"/></svg></div>
      <div style={bs('float2 8s',{left:'30%',bottom:'8%'})}><svg width="52" height="52" viewBox="0 0 88 56"><path d="M4 28 Q22 4 44 4 Q66 4 84 28 Q66 52 44 52 Q22 52 4 28Z" fill="#8B4513"/><line x1="38" y1="24" x2="50" y2="24" stroke="white" strokeWidth="2"/><line x1="44" y1="17" x2="44" y2="39" stroke="white" strokeWidth="1.5"/></svg></div>

      {/* Gradient overlays for depth */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'30%', background:'linear-gradient(180deg,rgba(7,9,13,0.7),transparent)', zIndex:1, pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'30%', background:'linear-gradient(0deg,rgba(7,9,13,0.7),transparent)', zIndex:1, pointerEvents:'none' }} />

      {/* Logo */}
      <div style={{ position:'relative', zIndex:2, textAlign:'center', animation:'logoReveal 0.7s ease forwards', marginBottom: phase === 'cta' ? 40 : 0 }}>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:64, lineHeight:1, letterSpacing:'-1px', marginBottom:10 }}>
          <span style={{ color:cC }}>C</span>
          <span style={{ color:cOach }}>oach</span>
          <span style={{ color:cIQ }}>IQ</span>
        </div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:'5px', color:'#3a4260', textTransform:'uppercase' }}>AI Coaching Intelligence</div>
      </div>

      {phase === 'cta' && (
        <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:10, animation:'ctaReveal 0.4s ease forwards' }}>
          <button onClick={() => onDone(false)} style={{ width:'100%', background:accent, border:'none', borderRadius:4, padding:'15px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'2px', color:'white', cursor:'pointer', textTransform:'uppercase' }}>Get Started — Free</button>
          <button onClick={() => onDone(false)} style={{ width:'100%', background:'transparent', border:'1px solid #1c2235', borderRadius:4, padding:'14px', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7896', cursor:'pointer' }}>Sign In</button>
          <div style={{ textAlign:'center', paddingTop:4 }}>
            <span onClick={() => onDone(true)} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, color:accent, fontWeight:600, cursor:'pointer', letterSpacing:'0.5px' }}>Preview first →</span>
          </div>
        </div>
      )}
    </div>
  )
}

function Onboarding({ onLaunch, brand='Red — C+IQ colored' }) {
  const [coachName, setCoachName] = useState('')
  const p = BRAND_PALETTES[brand] || BRAND_PALETTES['Red — C+IQ colored']
  const accent = p.accent
  const CIQ = p.accentOn === 'CIQ'
  const cC = CIQ ? p.accent : '#f2f4f8'
  const cOach = CIQ ? '#f2f4f8' : p.accent
  const cIQ = CIQ ? p.accent : '#f2f4f8'

  function handleStart() {
    onLaunch({ coach: coachName.trim() || 'Coach', team:'', primary:'#C0392B', secondary:'#002868', sport:'Football' })
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'#07090d', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 28px', fontFamily:"'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@700&family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing:border-box; margin:0; padding:0; }`}</style>
      <div style={{ textAlign:'center', marginBottom:36 }}>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:44, lineHeight:1, marginBottom:8 }}>
          <span style={{ color:cC }}>C</span>
          <span style={{ color:cOach }}>oach</span>
          <span style={{ color:cIQ }}>IQ</span>
        </div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:'4px', color:'#3a4260', textTransform:'uppercase' }}>Set up your profile</div>
      </div>
      <div style={{ width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:12 }}>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'2px', textTransform:'uppercase', color:'#6b7a96', marginBottom:6 }}>Your name</div>
          <input
            value={coachName}
            onChange={e=>setCoachName(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleStart()}
            placeholder="e.g. Coach Regisford"
            style={{ width:'100%', background:'#161922', border:`1px solid ${accent}`, borderRadius:4, padding:'13px 14px', fontSize:14, color:'#f2f4f8', outline:'none', fontFamily:'inherit' }}
          />
        </div>
        <button onClick={handleStart} style={{ width:'100%', background:accent, border:'none', borderRadius:4, padding:'14px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'2px', color:'white', cursor:'pointer', textTransform:'uppercase', marginTop:6 }}>Enter CoachIQ</button>
        <div style={{ textAlign:'center' }}>
          <span style={{ fontSize:11, color:'#3d4559' }}>You can create and manage teams from the home screen</span>
        </div>
      </div>
    </div>
  )
}


// ─── MORE PAGE ────────────────────────────────────────────────────────────────
function MorePage({ P, al, cfg, setCfg, brand, setBrand }) {
  const [section, setSection] = useState('settings')
  const colorOptions = {
    primary: ['#C0392B','#E8460C','#D4600A','#1B5E20','#0066CC','#7B1FA2','#C8A400','#1565C0','#880E4F','#00838F','#E91E63','#FF6F00'],
    secondary: ['#002868','#1a3a6b','#37474f','#1B5E20','#4a0070','#1a1a1a','#5c3a00','#004d40','#6b0010','#0d2137','#3e0a1e','#1a1200'],
  }
  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Platform & settings</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>More</div>
      </div>
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {[['settings','⚙️ Settings'],['about','ℹ️ About']].map(([k,lbl]) => (
          <button key={k} onClick={()=>setSection(k)} style={{ flex:1, padding:'9px', borderRadius:4, fontSize:11, border:`1px solid ${section===k?P:'#1e2330'}`, background:section===k?al(P,0.15):'transparent', color:section===k?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{lbl}</button>
        ))}
      </div>
      {section === 'settings' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card>
            <CardHead icon="🎨" title="CoachIQ Logo Style" accent={P} />
            <div style={{ padding:14 }}>
              <div style={{ fontSize:11, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>Choose logo color orientation — applies everywhere in the app.</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {Object.entries(BRAND_PALETTES).map(([key, palette]) => {
                  const isCIQ = palette.accentOn === 'CIQ'
                  return (
                    <div key={key} onClick={()=>setBrand(key)} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:brand===key?al(P,0.08):'#161922', border:`1px solid ${brand===key?P:'#1e2330'}`, borderRadius:6, cursor:'pointer' }}>
                      <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:20, lineHeight:1, whiteSpace:'nowrap' }}>
                        <span style={{ color:isCIQ?palette.accent:'#f2f4f8' }}>C</span>
                        <span style={{ color:isCIQ?'#f2f4f8':palette.accent }}>oach</span>
                        <span style={{ color:isCIQ?palette.accent:'#f2f4f8' }}>IQ</span>
                      </div>
                      <div style={{ flex:1, fontSize:12, color:'#6b7a96' }}>{palette.name}</div>
                      {brand===key && <span style={{ fontSize:14, color:'#4ade80' }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
          <Card>
            <CardHead icon="🏷" title="Team Colors" accent={P} />
            <div style={{ padding:14 }}>
              <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:10 }}>Primary Color</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
                {colorOptions.primary.map(c => (<div key={c} onClick={()=>setCfg(prev=>({...prev,primary:c}))} style={{ width:32, height:32, borderRadius:4, background:c, border:`3px solid ${cfg.primary===c?'white':'transparent'}`, cursor:'pointer' }} />))}
              </div>
              <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:10 }}>Secondary Color</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:14 }}>
                {colorOptions.secondary.map(c => (<div key={c} onClick={()=>setCfg(prev=>({...prev,secondary:c}))} style={{ width:32, height:32, borderRadius:4, background:c, border:`3px solid ${cfg.secondary===c?'white':'transparent'}`, cursor:'pointer' }} />))}
              </div>
              <div style={{ height:6, borderRadius:3, background:`linear-gradient(90deg,${cfg.primary||P} 55%,${cfg.secondary||'#002868'} 55%)` }} />
            </div>
          </Card>
        </div>
      )}
      {section === 'about' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ padding:'20px', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, textAlign:'center' }}>
            <CoachIQLogo size={28} brand={brand} />
            <div style={{ fontSize:10, color:'#3d4559', marginTop:8 }}>v2.0 · Built for youth coaches</div>
          </div>
          {[
            { icon:'📋', title:'Printable Wristbands & Coach Sheets', status:'IN PROGRESS', color:'#4ade80' },
            { icon:'📊', title:'Advanced Analytics Dashboard', status:'COMING SOON', color:'#f59e0b' },
            { icon:'🎥', title:'Full Game Film Upload & AI Breakdown', status:'COMING SOON', color:'#6b9fff' },
            { icon:'🔁', title:'In-Game Live Adjustment Mode', status:'COMING SOON', color:'#c084fc' },
            { icon:'🤝', title:'Coach Network & Play Sharing', status:'COMING SOON', color:'#6b9fff' },
            { icon:'🎓', title:'Coaching Certification Path', status:'COMING SOON', color:'#4ade80' },
          ].map((f,i) => (
            <div key={i} style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'12px 14px', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ fontSize:22, flexShrink:0 }}>{f.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap', marginBottom:3 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8' }}>{f.title}</div>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, padding:'2px 6px', borderRadius:2, background:al(f.color,0.15), color:f.color }}>{f.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ P, S, al, dk, lastName, sport, iq, setIQ, gauntlets, setGauntlets, callAI, parseJSON, brand, teams, setTeams, activeTeam, setActiveTeam, setSport, setCfg, setPage }) {
  const [feed, setFeed] = useState(null)
  const [feedLoading, setFeedLoading] = useState(false)
  const [activeMode, setActiveMode] = useState('dashboard')
  const currentTeam = activeTeam[sport]
  const mascot = currentTeam ? MASCOTS.find(m=>m.id===currentTeam.mascot) : null
  const teamFont = currentTeam ? (TEAM_FONTS.find(f=>f.id===currentTeam.teamFont)?.style || "'Barlow Condensed',sans-serif") : null

  // Get next upcoming event for the current team
  const nextEvent = currentTeam?.schedule?.filter(e=>new Date(e.date)>=new Date()).sort((a,b)=>new Date(a.date)-new Date(b.date))[0] || null
  const awayLocation = nextEvent?.homeAway==='Away' && nextEvent?.location ? nextEvent.location : null

  useEffect(() => { if (!feed && !feedLoading) loadFeed() }, [sport])

  async function loadFeed() {
    setFeedLoading(true)
    try {
      const raw = await callAI('Generate a daily coaching feed for a youth '+sport+' coach. Return ONLY valid JSON: {"items":[{"type":"drill","title":"Drill of the Day","body":"2 sentences","source":"source"},{"type":"science","title":"Coaching Science","body":"2 sentences","source":"source"},{"type":"concept","title":"Concept Spotlight","body":"2 sentences","source":"source"}]}')
      const s=raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setFeed(JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1)))
    } catch(e) { setFeed({ items:[] }) }
    setFeedLoading(false)
  }

  const feedTypeColor = t => t==='drill'?P:t==='science'?'#6b9fff':'#4ade80'

  if (activeMode==='gauntlet') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport} Gauntlet</span>
      </div>
      <GauntletPage P={P} S={S} al={al} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} />
    </>
  )
  if (activeMode==='situational') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>Situational</span>
      </div>
      <SituationalPanel sport={sport} P={P} S={S} al={al} callAI={callAI} />
    </>
  )

  return (
    <>
      {/* Welcome hero card */}
      <div style={{ marginTop:14, borderRadius:4, overflow:'hidden', border:`1px solid ${al(P,0.25)}`, position:'relative', minHeight:90, background: currentTeam ? `linear-gradient(135deg,${currentTeam.primary}22,${currentTeam.secondary||'#07090d'}44,#07090d)` : 'linear-gradient(135deg,#0f1219,#07090d)' }}>
        {/* Mascot watermark */}
        {mascot && (
          <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:64, opacity:0.15, pointerEvents:'none', userSelect:'none', lineHeight:1 }}>{mascot.emoji}</div>
        )}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background: currentTeam ? `linear-gradient(90deg,${currentTeam.primary},${currentTeam.secondary||P},${currentTeam.accent1||P},${currentTeam.accent2||P})` : `linear-gradient(90deg,${P},${S})` }} />
        <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:12, position:'relative', zIndex:1 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:al(P,0.7), letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Welcome back</div>
            <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:24, color:'#f2f4f8', lineHeight:1, marginBottom: currentTeam ? 4 : 0 }}>Coach {lastName||'—'}</div>
            {currentTeam && (
              <div style={{ fontFamily:teamFont, fontStyle:'italic', fontSize:14, color:currentTeam.primary, letterSpacing:'0.5px' }}>
                {mascot?.emoji} {currentTeam.name}
              </div>
            )}
            {currentTeam?.season && <div style={{ fontSize:10, color:'#3d4559', marginTop:2, fontFamily:"'Barlow Condensed',sans-serif" }}>{currentTeam.season}{currentTeam.hometown?` · ${currentTeam.hometown}`:''}</div>}
          </div>
          {/* Rotating info widget */}
          <RotatingInfoWidget
            sport={sport}
            homeLocation={currentTeam?.hometown || null}
            awayLocation={awayLocation}
            nextEvent={nextEvent}
            P={P}
            al={al}
          />
        </div>
      </div>

      {/* Live ticker */}
      <div style={{ background:'#0a0c14', display:'flex', alignItems:'center', overflow:'hidden', borderTop:'1px solid #0e1220', borderBottom:'1px solid #0e1220', height:26, margin:'0 -14px' }}>
        <div style={{ background:P, padding:'0 10px 0 14px', height:'100%', display:'flex', alignItems:'center', flexShrink:0, clipPath:'polygon(0 0,100% 0,calc(100% - 6px) 100%,0 100%)' }}><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, color:'white', letterSpacing:'1.5px' }}>LIVE</span></div>
        <div style={{ overflow:'hidden', flex:1, paddingLeft:8 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4a5470', whiteSpace:'nowrap', animation:'ticker 28s linear infinite' }}>{feed&&feed.items?.length>0?feed.items.map(i=>`${i.title}: ${i.body}`).join(' · '):'CoachIQ — AI Coaching Intelligence · Schemes · Scout · Playbook · Team Management'}</div></div>
      </div>

      {/* Team Manager card */}
      <TeamManagerCard sport={sport} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} P={P} al={al} setCfg={setCfg} onOpenTeamTab={()=>setPage('team')} />

      {/* Scheme Generator card */}
      <div style={{ marginTop:10 }}>
        <div onClick={()=>setPage('schemes')} style={{ background:'linear-gradient(135deg,#180303,#220606)', border:'1px solid rgba(192,57,43,0.3)', borderRadius:4, padding:'16px', cursor:'pointer', overflow:'hidden', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:20, color:'#dde1f0', lineHeight:1, marginBottom:4 }}>Scheme Generator</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.5, maxWidth:200 }}>Build plays your athletes <span style={{ color:'#C0392B', fontWeight:600 }}>actually understand</span> — animated diagrams and coaching cues built in.</div>
            </div>
            <div style={{ background:'#C0392B', padding:'4px 10px', borderRadius:2, clipPath:'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)', flexShrink:0 }}><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, color:'white', letterSpacing:'1px' }}>OPEN →</span></div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <div onClick={e=>{e.stopPropagation();setPage('schemes')}} style={{ background:'rgba(0,0,0,0.3)', borderRadius:6, overflow:'hidden', border:`1px solid ${al(P,0.2)}`, position:'relative', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:5, left:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, color:P, letterSpacing:'1px', zIndex:1 }}>OFFENSE ›</div>
              <div style={{ height:72, padding:'18px 6px 6px' }}><SchemePreviewMini type="offense" P={P} /></div>
            </div>
            <div onClick={e=>{e.stopPropagation();setPage('schemes')}} style={{ background:'rgba(0,0,0,0.3)', borderRadius:6, overflow:'hidden', border:'1px solid rgba(107,154,255,0.2)', position:'relative', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:5, left:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, color:'#6b9fff', letterSpacing:'1px', zIndex:1 }}>DEFENSE ›</div>
              <div style={{ height:72, padding:'18px 6px 6px' }}><SchemePreviewMini type="defense" P={P} /></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {['AI Diagrams','Educator Mode','Pro Comparison','Huddle Cards','Variations'].map(tag=><span key={tag} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, padding:'2px 8px', background:'rgba(192,57,43,0.1)', borderLeft:'2px solid rgba(192,57,43,0.3)', color:'rgba(192,57,43,0.7)' }}>{tag}</span>)}
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div style={{ marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
        <div onClick={()=>setActiveMode('gauntlet')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'12px', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}><span style={{ fontSize:16 }}>⚡</span><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0' }}>Gauntlet</div></div>
          <div style={{ fontSize:10, color:'#4a5470', lineHeight:1.4, marginBottom:6 }}>Test your coaching IQ with live AI scenarios</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}><span style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:20, color:'#f59e0b', lineHeight:1 }}>{iq}</span><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'#3a4260', textTransform:'uppercase' }}>IQ</span></div>
        </div>
        <div onClick={()=>setActiveMode('situational')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'12px', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}><span style={{ fontSize:16 }}>🎯</span><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0' }}>Situational</div></div>
          <div style={{ fontSize:10, color:'#4a5470', lineHeight:1.4, marginBottom:6 }}>Real-time play calls by situation</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4ade80', fontWeight:700 }}>{sport==='Basketball'?'Live adjustments':sport==='Baseball'?'Count manager':'Live play caller'}</div>
        </div>
      </div>

      {/* Coaching feed */}
      <div style={{ marginTop:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <div style={{ width:3, height:10, background:'#4ade80', transform:'skewX(-15deg)', flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:'2px', textTransform:'uppercase', color:'#4ade80' }}>Coaching Feed</span>
          <button onClick={loadFeed} style={{ marginLeft:'auto', fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#6b7a96', background:'transparent', border:'0.5px solid #1e2330', borderRadius:2, padding:'2px 8px', cursor:'pointer' }}>Refresh</button>
        </div>
        {feedLoading && <div style={{ padding:'16px', background:'#0f1219', borderRadius:4, textAlign:'center' }}><div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 6px' }} /><div style={{ fontSize:11, color:'#6b7a96' }}>Loading {sport} coaching content...</div></div>}
        {feed&&(feed.items||[]).map((item,i) => (
          <div key={i} style={{ background:'#0f1219', border:'0.5px solid #1e2330', borderRadius:4, padding:'10px 12px', marginBottom:7, borderLeft:`2px solid ${feedTypeColor(item.type)}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, color:feedTypeColor(item.type), textTransform:'uppercase', letterSpacing:'1px' }}>{item.type==='drill'?'Drill of the Day':item.type==='science'?'Coaching Science':'Concept Spotlight'}</span>
              {item.source&&<span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'#3d4559' }}>· {item.source}</span>}
            </div>
            <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{item.body}</div>
          </div>
        ))}
      </div>
    </>
  )
}


}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function CoachIQ() {
  const [launched, setLaunched] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [cfg, setCfg] = useState({ coach:'', primary:'#C0392B', secondary:'#002868' })
  const [brand, setBrand] = useState('Red — C+IQ colored')
  const [page, setPage] = useState('home')
  const [sport, setSport] = useState('Football')
  const [iq, setIQ] = useState(847)
  const [gauntlets, setGauntlets] = useState(0)
  const [playbook, setPlaybook] = useState({ Football:{}, Basketball:{}, Baseball:{} })
  const [genHistory, setGenHistory] = useState({ Football:[], Basketball:[], Baseball:[] })
  const [teams, setTeams] = useState({ Football:[], Basketball:[], Baseball:[] })
  const [activeTeam, setActiveTeam] = useState({ Football:null, Basketball:null, Baseball:null })

  const ALL_SPORTS = ['Football','Basketball','Baseball']
  const SPORT_ICONS = { Football:'🏈', Basketball:'🏀', Baseball:'⚾' }

  const sportColors = SPORT_COLORS[sport] || SPORT_COLORS.Football
  const currentTeam = activeTeam[sport]
  const P = currentTeam?.primary || sportColors.primary
  const S = currentTeam?.secondary || sportColors.secondary
  const lastName = cfg.coach.replace(/^Coach\s*/i,'').trim().split(' ').pop()

  async function callAI(prompt, imageData) {
    const messages = imageData
      ? [{ role:'user', content:[{ type:'image', source:{ type:'base64', media_type:imageData.mime, data:imageData.b64 }},{ type:'text', text:prompt }]}]
      : [{ role:'user', content:prompt }]
    const res = await fetch('/api/ai', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ messages }) })
    const d = await res.json()
    if (!res.ok) throw new Error(d.error||'API error')
    return d.text
  }

  function parseJSON(raw) {
    const s=raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
    const a=s.indexOf('{'), b=s.lastIndexOf('}')
    if (a<0||b<=a) throw new Error('No JSON in response')
    return JSON.parse(s.slice(a,b+1))
  }

  if (showSplash) return <SplashScreen onDone={(skip)=>{ setShowSplash(false); if(skip) setLaunched(true) }} alreadyAuthed={launched} brand={brand} />
  if (!launched) return <Onboarding onLaunch={(c)=>{ setCfg(c); setLaunched(true) }} brand={brand} />

  const NAV = [
    { id:'home',    icon:'🏠', label:'HOME' },
    { id:'schemes', icon:'📋', label:'SCHEMES' },
    { id:'team',    icon:'🏆', label:'TEAM' },
    { id:'playbook',icon:'📖', label:'PLAYBOOK' },
    { id:'scout',   icon:'🔍', label:'SCOUT' },
    { id:'more',    icon:'⋯',  label:'MORE' },
  ]

  return (
    <>
      <Head><title>CoachIQ</title></Head>
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#07090d', color:'#f2f4f8', fontFamily:"'DM Sans',system-ui,sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Barlow+Condensed:wght@400;600;700&family=Big+Shoulders+Display:wght@500;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
          * { box-sizing:border-box; margin:0; padding:0; }
          ::-webkit-scrollbar { width:4px; }
          ::-webkit-scrollbar-thumb { background:#1e2330; }
          select option { background:#161922; }
          @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
          @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes ticker { 0%{transform:translateX(100%)} 100%{transform:translateX(-100%)} }
          @keyframes floatA { 0%,100%{transform:translate(0,0) rotate(-8deg)} 50%{transform:translate(6px,-12px) rotate(-3deg)} }
          @keyframes floatB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-8px,8px)} }
          @keyframes floatC { 0%,100%{transform:translate(0,0) rotate(10deg)} 50%{transform:translate(10px,-6px) rotate(16deg)} }
        `}</style>

        {/* TOP BAR */}
        <div style={{ background:'#07090d', borderBottom:'1px solid #0e1220', padding:'10px 14px', display:'flex', alignItems:'center', gap:8, position:'relative', flexShrink:0 }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${P},${S})` }} />
          <CoachIQLogo size={22} brand={brand} />
          <div style={{ position:'relative', marginLeft:4 }}>
            <select value={sport} onChange={e=>setSport(e.target.value)} style={{ background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:3, padding:'4px 28px 4px 8px', color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:'0.5px', outline:'none', appearance:'none', cursor:'pointer' }}>
              {ALL_SPORTS.map(s=><option key={s} value={s}>{SPORT_ICONS[s]} {s}</option>)}
            </select>
            <span style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', fontSize:9, color:P, pointerEvents:'none' }}>▾</span>
          </div>
          {/* Top right: active team accent strip */}
          {currentTeam && (
            <div style={{ display:'flex', alignItems:'center', gap:4, marginLeft:'auto', background:al(P,0.1), border:`1px solid ${al(P,0.25)}`, borderRadius:3, padding:'3px 8px' }}>
              <span style={{ fontSize:12 }}>{MASCOTS.find(m=>m.id===currentTeam.mascot)?.emoji||'🏆'}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:P, fontWeight:700, letterSpacing:'0.5px', maxWidth:80, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{currentTeam.name}</span>
            </div>
          )}
          {!currentTeam && <div style={{ marginLeft:'auto' }} />}
        </div>

        {/* CONTENT */}
        <div style={{ flex:1, maxWidth:640, margin:'0 auto', width:'100%', padding:'14px 14px 90px', display:'flex', flexDirection:'column', gap:14 }}>
          {page==='home'     && <HomePage P={P} S={S} al={al} dk={dk} lastName={lastName} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} brand={brand} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} setSport={setSport} setCfg={setCfg} setPage={setPage} />}
          {page==='schemes'  && <SchemesPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} playbook={playbook} setPlaybook={setPlaybook} genHistory={genHistory} setGenHistory={setGenHistory} iq={iq} setIQ={setIQ} />}
          {page==='team'     && <TeamPage P={P} S={S} al={al} sport={sport} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} callAI={callAI} parseJSON={parseJSON} setCfg={setCfg} brand={brand} />}
          {page==='playbook' && <PlaybookPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} playbook={playbook} setPlaybook={setPlaybook} teams={teams} activeTeam={activeTeam} />}
          {page==='scout'    && <ScoutPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} teams={teams} activeTeam={activeTeam} />}
          {page==='more'     && <MorePage P={P} al={al} cfg={cfg} setCfg={setCfg} brand={brand} setBrand={setBrand} />}
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:640, background:'#07090d', borderTop:'1px solid #0e1220', display:'flex', zIndex:50 }}>
          {NAV.map(({ id, icon, label }) => (
            <button key={id} onClick={()=>setPage(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 1px 6px', cursor:'pointer', gap:1, background:'none', border:'none', position:'relative' }}>
              {page===id && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:20, height:2, background:P }} />}
              <span style={{ fontSize:12, color:page===id?P:'#3d4559' }}>{icon}</span>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:7, color:page===id?P:'#3d4559', fontWeight:700, letterSpacing:'0.5px', textTransform:'uppercase' }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}