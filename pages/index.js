import { useState, useEffect } from 'react';
import Head from 'next/head';

const SPORTS = {
  football: {
    levels: ['6U–8U Flag Football','8U–10U Youth Tackle','10U–12U Youth Tackle','12U–14U Youth Tackle','High School JV','High School Varsity'],
    types: ['Offensive Scheme','Defensive Scheme','Red Zone Offense','Red Zone Defense','2-Minute Drill','Goal Line Package','Blitz Package','Screen Game','Special Teams','Kickoff / Kick Return'],
    formations: ['I-Formation','Shotgun Spread','Wildcat / Single Wing','Double Wing','Option / Wing-T','Empty Set','Pro Set / 2-Back','4-3 Defense','3-4 Defense','4-2-5 Defense','5-2 Defense','Cover 2 Zone','Cover 3 Zone','Cover 4 / Quarters','Man Press','Prevent Defense'],
    oppTendencies: ['Balanced — no strong tendency','Run-heavy team','Pass-heavy / Spread offense','Dual-threat QB (run & pass)','Triple option / Wishbone','Air Raid / 5-wide sets','Physical smash-mouth running','Blitzes on nearly every down','Zone-heavy defense','Man press coverage every play','Prevent / soft coverage'],
    experienceLevels: ['First-year players (never played before)','Beginner (1 season of experience)','Intermediate (2–3 seasons)','Experienced (4+ seasons)','Mixed — wide range on the roster'],
  },
  basketball: {
    levels: ['6U–8U Youth','8U–10U Youth','10U–12U Youth','12U–14U Youth','High School JV','High School Varsity'],
    types: ['Half-Court Offense','Full-Court Press Offense','Zone Defense','Man-to-Man Defense','End-of-Game Set Play','Fast Break System','Inbound Plays','Box-and-1 Defense','Transition Defense','Late-Game Fouling Strategy'],
    formations: ['Motion Offense','Triangle Offense','Flex Offense','Princeton Offense','Dribble Drive Motion','4-Out 1-In','5-Out Open Post','2-3 Zone','1-3-1 Zone','3-2 Zone','Full-Court Man','3/4 Court Press','Matchup Zone'],
    oppTendencies: ['Balanced — no strong tendency','One dominant scorer (ISO-heavy)','Strong inside post game','Three-point shooting team','Fast break / transition heavy','Ball control / slow-pace offense','Full-court press every possession','Zone defense only','Aggressive man-to-man pressure','Weak ball-handlers under pressure'],
    experienceLevels: ['First-year players (never played before)','Beginner (1 season of experience)','Intermediate (2–3 seasons)','Experienced (4+ seasons)','Mixed — wide range on the roster'],
  },
  baseball: {
    levels: ['6U–8U Tee Ball','8U–10U Coach Pitch','10U–12U Youth','12U–14U Youth','High School JV','High School Varsity'],
    types: ['Batting Order Strategy','Pitching Rotation / Game Plan','Base Running Rules','Defensive Positioning','Situational Hitting','Bunt Game','First-and-Third Offense','First-and-Third Defense','Pickoff Plays','Intentional Walk Strategy'],
    formations: ['Standard Defensive Alignment','Infield Shift (pull hitter)','Corner Infield In (runner on 3rd)','Outfield Shaded Deep','Outfield Shaded In (shallow)','Hit-and-Run','Squeeze Play','Slash / Fake Bunt','Double Steal','Opener / Bulk Pitching'],
    oppTendencies: ['Balanced — no strong tendency','Pull-heavy hitters across lineup','Opposite field / gap hitters','Very fast team — steals often','Power hitting lineup','Weak contact — lots of strikeouts','Strong pitching / low scoring','Aggressive base running','Bunts often to move runners','Struggles with off-speed pitching'],
    experienceLevels: ['First-year players (never played before)','Beginner (1 season of experience)','Intermediate (2–3 seasons)','Experienced (4+ seasons)','Mixed — wide range on the roster'],
  },
};

export default function CoachIQ() {
  const [screen, setScreen] = useState('splash');
  const [page, setPage] = useState('home');
  const [sport, setSport] = useState('football');
  const [schemeLevel, setSchemeLevel] = useState('');
  const [schemeType, setSchemeType] = useState('');
  const [schemeForm, setSchemeForm] = useState('');
  const [schemeOpp, setSchemeOpp] = useState('');
  const [schemeExp, setSchemeExp] = useState('');
  const [schemeCtx, setSchemeCtx] = useState('');
  const [schemeOutput, setSchemeOutput] = useState('');
  const [schemeLoading, setSchemeLoading] = useState(false);
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [lastScheme, setLastScheme] = useState(null);
  const [teamName, setTeamName] = useState('My Team');
  const [iq, setIq] = useState(824);
  const [schemesBuilt, setSchemesBuilt] = useState(0);
  const [gFocus, setGFocus] = useState('');
  const [gPhase, setGPhase] = useState('start');
  const [gQuestions, setGQuestions] = useState([]);
  const [gIdx, setGIdx] = useState(0);
  const [gScore, setGScore] = useState(0);
  const [gChosen, setGChosen] = useState(null);
  const [gSport, setGSport] = useState('football');

  useEffect(() => {
    const d = SPORTS[sport];
    setSchemeLevel(d.levels[0]);
    setSchemeType(d.types[0]);
    setSchemeForm(d.formations[0]);
    setSchemeOpp(d.oppTendencies[0]);
    setSchemeExp(d.experienceLevels[0]);
  }, [sport]);

  async function callAI(prompt) {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API error');
    return data.result;
  }

  async function generateScheme() {
    setSchemeLoading(true);
    setSchemeOutput('');
    setLastScheme(null);
    const prompt = `You are CoachIQ, an expert youth sports coaching AI.

Generate a detailed ${schemeType} for a ${sport} team with the following details:
- Level: ${schemeLevel}
- Formation / Style: ${schemeForm}
- Player Experience: ${schemeExp}
- Opposing Team Tendency: ${schemeOpp}${schemeCtx ? '\n- Additional Notes: ' + schemeCtx : ''}

Format your response with these exact sections:
1. SCHEME NAME — a real, memorable name
2. CONCEPT — 2-3 sentences on the core idea and why it works at this level
3. FORMATION / ALIGNMENT — specific positions and exactly how they line up
4. KEY PLAYS — 3-4 specific named plays with brief execution notes
5. HOW IT ATTACKS THE OPPONENT — how this scheme exploits the opposing tendency listed above
6. PRACTICE INSTALLATION — 2 specific drills to install this fast with limited practice time
7. SMALL PROGRAM ADVANTAGE — why this works for teams with fewer resources or less experienced players

Be practical, specific, and direct. This coach has limited practice time and a developing roster.`;
    try {
      const result = await callAI(prompt);
      setSchemeOutput(result);
      setLastScheme({ sport, level: schemeLevel, type: schemeType, form: schemeForm, text: result, date: new Date().toLocaleDateString() });
      setSchemesBuilt(n => n + 1);
    } catch(e) {
      setSchemeOutput('Error: ' + e.message);
    }
    setSchemeLoading(false);
  }

  function saveScheme() {
    if (!lastScheme) return;
    setSavedSchemes(s => [...s, lastScheme]);
    setLastScheme(null);
    setPage('playbook');
  }

  async function startGauntlet(gs) {
    setGSport(gs);
    setGPhase('loading');
    setGQuestions([]);
    setGIdx(0);
    setGScore(0);
    setGChosen(null);
    const focusLine = gFocus.trim()
      ? `The coach specifically wants to work on: "${gFocus.trim()}". Tailor ALL 5 questions to this focus area.`
      : `Generate varied scenarios covering different situations a youth ${gs} coach faces.`;
    const prompt = `You are CoachIQ. Generate exactly 5 multiple-choice coaching scenario questions for a youth ${gs} coach.

${focusLine}

Requirements:
- Each question presents a realistic in-game or practice DECISION, not a trivia fact
- All 4 answer options must be plausible — no obviously wrong answers
- Focus on youth/small program realities: limited roster depth, limited practice time, mixed skill levels
- Difficulty should challenge an experienced youth coach

Return ONLY a valid JSON array. No markdown, no code fences, no explanation. Start with [ and end with ].

[
  {
    "question": "Full scenario description and the specific decision question",
    "context": "Any additional context, or empty string",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Why this answer is correct and the key coaching principle"
  }
]`;
    try {
      const raw = await callAI(prompt);
      const s = raw.indexOf('['), e = raw.lastIndexOf(']');
      if (s === -1 || e === -1) throw new Error('No JSON found in response');
      const qs = JSON.parse(raw.slice(s, e + 1));
      if (!qs.length) throw new Error('Empty questions array');
      setGQuestions(qs);
      setGPhase('question');
    } catch(err) {
      setGPhase('start');
      alert('Could not load questions: ' + err.message);
    }
  }

  function selectOption(chosen) {
    if (gChosen !== null) return;
    setGChosen(chosen);
    if (chosen === gQuestions[gIdx].correct) setGScore(s => s + 1);
  }

  function nextQuestion() {
    const isCorrect = gChosen === gQuestions[gIdx].correct;
    const finalScore = isCorrect ? gScore + 1 : gScore;
    const next = gIdx + 1;
    if (next >= gQuestions.length) {
      const pct = finalScore / gQuestions.length;
      const delta = Math.round((pct - 0.6) * 30);
      const newIq = Math.max(400, Math.min(999, iq + delta));
      setIq(newIq);
      setGPhase('start');
      alert(`Gauntlet Complete! 🏆\n\n${finalScore}/${gQuestions.length} correct\nNew CoachIQ: ${newIq}`);
    } else {
      setGIdx(next);
      setGChosen(null);
    }
  }

  function editTeam() {
    const name = window.prompt('Enter your team name:');
    if (name && name.trim()) setTeamName(name.trim());
  }

  const C = {
    bg:'#07090d',s1:'#0d1018',s2:'#141820',s3:'#1a1f2e',
    b1:'#1e2535',b2:'#252d40',
    t1:'#eef1f8',t2:'#8a93a8',t3:'#4a5268',
    p:'#CC1122',r:'12px',rs:'8px',
  };

  const selStyle = {
    width:'100%',background:C.s2,border:`1px solid ${C.b1}`,borderRadius:C.rs,
    padding:'12px 36px 12px 14px',fontFamily:"'DM Sans',sans-serif",fontSize:14,
    color:C.t1,outline:'none',appearance:'none',cursor:'pointer',marginBottom:14,
    backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234a5268' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
    backgroundRepeat:'no-repeat',backgroundPosition:'right 14px center',
  };
  const lblStyle = {
    fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:600,
    letterSpacing:'2px',textTransform:'uppercase',color:C.t3,display:'block',marginBottom:8,
  };
  const taStyle = {
    width:'100%',background:C.s2,border:`1px solid ${C.b1}`,borderRadius:C.rs,
    padding:'12px 14px',fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.t1,
    outline:'none',resize:'none',marginBottom:14,lineHeight:1.5,
  };

  const q = gQuestions[gIdx];

  return (
    <>
      <Head>
        <title>CoachIQ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@700&family=DM+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        html,body{background:#07090d;color:#eef1f8;font-family:'DM Sans',system-ui,sans-serif;height:100%;overflow:hidden;-webkit-font-smoothing:antialiased}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes splashIn{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        select option{background:#141820;color:#eef1f8}
        textarea::placeholder,input::placeholder{color:#4a5268}
        ::-webkit-scrollbar{display:none}
      `}</style>

      {screen==='splash'&&(
        <div style={{position:'fixed',inset:0,background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column'}}>
          <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 40% at 50% 30%,rgba(204,17,34,.12) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 20% 80%,rgba(0,40,104,.1) 0%,transparent 60%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1,display:'flex',flexDirection:'column',alignItems:'center',animation:'splashIn .7s cubic-bezier(.22,1,.36,1) both'}}>
            <div style={{fontFamily:"'Kalam',cursive",fontSize:64,color:C.p,lineHeight:1,letterSpacing:-1,textShadow:'0 0 40px rgba(204,17,34,.4)',marginBottom:8}}>CoachIQ</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:600,letterSpacing:'3.5px',textTransform:'uppercase',color:C.t3,marginBottom:52}}>Coaching Intelligence for Every Level</div>
            <div style={{width:40,height:2,background:'linear-gradient(90deg,transparent,#CC1122,transparent)',marginBottom:52}}/>
            <div style={{display:'flex',flexDirection:'column',gap:12,width:240}}>
              <button onClick={()=>setScreen('signin')} style={{background:C.p,color:'#fff',border:'none',borderRadius:C.rs,padding:'14px 20px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer'}}>Get Started</button>
              <button onClick={()=>setScreen('signin')} style={{background:'transparent',color:C.t2,border:`1px solid ${C.b2}`,borderRadius:C.rs,padding:'13px 20px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer'}}>Sign In</button>
            </div>
          </div>
        </div>
      )}

      {screen==='signin'&&(
        <div style={{position:'fixed',inset:0,background:C.bg,display:'flex',alignItems:'center',justifyContent:'center',padding:'24px 20px'}}>
          <div style={{width:'100%',maxWidth:360,background:C.s1,border:`1px solid ${C.b1}`,borderRadius:16,padding:'32px 28px',animation:'fadeUp .35s ease both'}}>
            <div style={{fontFamily:"'Kalam',cursive",fontSize:32,color:C.p,textAlign:'center',marginBottom:4}}>CoachIQ</div>
            <div style={{fontSize:13,color:C.t2,textAlign:'center',marginBottom:28}}>Welcome back, Coach</div>
            <input type="email" placeholder="Email address" style={{width:'100%',background:C.s2,border:`1px solid ${C.b1}`,borderRadius:C.rs,padding:'12px 14px',fontSize:14,color:C.t1,outline:'none',marginBottom:10}}/>
            <input type="password" placeholder="Password" style={{width:'100%',background:C.s2,border:`1px solid ${C.b1}`,borderRadius:C.rs,padding:'12px 14px',fontSize:14,color:C.t1,outline:'none',marginBottom:16}}/>
            <button onClick={()=>setScreen('app')} style={{width:'100%',background:C.p,color:'#fff',border:'none',borderRadius:C.rs,padding:14,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer'}}>Sign In</button>
            <div onClick={()=>setScreen('app')} style={{textAlign:'center',marginTop:16,fontSize:12,color:C.t3,cursor:'pointer',textDecoration:'underline',textUnderlineOffset:3}}>Skip — continue as test user</div>
          </div>
        </div>
      )}

      {screen==='app'&&(
        <div style={{position:'fixed',inset:0,background:C.bg,display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px 10px',borderBottom:`1px solid ${C.b1}`,flexShrink:0,background:C.bg,position:'relative'}}>
            <div style={{position:'absolute',bottom:-1,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#CC1122,transparent)',opacity:.5}}/>
            <div style={{fontFamily:"'Kalam',cursive",fontSize:22,color:C.p,lineHeight:1}}>CoachIQ</div>
            <div onClick={editTeam} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:C.t2,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>{teamName} <span style={{fontSize:10,color:C.t3}}>▾</span></div>
            <div style={{width:30,height:30,borderRadius:'50%',background:C.p,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:'#fff'}}>J</div>
          </div>

          <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch'}}>

            {page==='home'&&(
              <div style={{paddingBottom:90,animation:'fadeUp .25s ease both'}}>
                <div style={{padding:'22px 18px 18px',background:'linear-gradient(160deg,rgba(204,17,34,.06) 0%,transparent 50%)',borderBottom:`1px solid ${C.b1}`}}>
                  <div style={{fontSize:13,color:C.t2,marginBottom:4}}>Good to see you,</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,letterSpacing:.5,lineHeight:1.1,marginBottom:18}}>Coach — <span style={{color:C.p}}>ready to build?</span></div>
                  <div style={{display:'flex',gap:10}}>
                    {[[String(iq),'CoachIQ Score'],['7','Day Streak 🔥'],[String(schemesBuilt),'Schemes Built']].map(([val,lbl],i)=>(
                      <div key={i} style={{flex:1,background:C.s1,border:`1px solid ${C.b1}`,borderRadius:C.rs,padding:'12px 14px',position:'relative',overflow:'hidden'}}>
                        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:C.p,opacity:.6}}/>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:700,color:C.p,lineHeight:1}}>{val}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:C.t3,marginTop:3}}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{padding:'18px 18px 14px'}}>
                  <div style={{background:C.s1,border:`1px solid ${C.b1}`,borderRadius:C.r,padding:'14px 16px',display:'flex',alignItems:'center',gap:12}}>
                    <div style={{fontSize:26,flexShrink:0}}>🔥</div>
                    <div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700}}>7-Day Streak Active</div><div style={{fontSize:12,color:C.t2,marginTop:2}}>Keep it going — run Gauntlet today</div></div>
                  </div>
                </div>
                <div style={{padding:'0 18px'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.t3,marginBottom:14}}>Quick Actions</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {[{ic:'⚡',ttl:'Build a Scheme',sub:'AI-generated plays for your roster',pg:'schemes',feat:true},{ic:'🧠',ttl:'Gauntlet Mode',sub:'Test your coaching IQ',pg:'gauntlet'},{ic:'📋',ttl:'My Playbook',sub:'View saved schemes',pg:'playbook'},{ic:'📊',ttl:'My Progress',sub:'Stats and achievements',pg:'account'}].map(card=>(
                      <div key={card.pg} onClick={()=>setPage(card.pg)} style={{background:card.feat?'linear-gradient(135deg,rgba(204,17,34,.08) 0%,#0d1018 60%)':C.s1,border:card.feat?'1px solid rgba(204,17,34,.3)':`1px solid ${C.b1}`,borderRadius:C.r,padding:16,cursor:'pointer'}}>
                        <span style={{fontSize:24,display:'block',marginBottom:8}}>{card.ic}</span>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,marginBottom:4}}>{card.ttl}</div>
                        <div style={{fontSize:11,color:C.t3,lineHeight:1.4}}>{card.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{padding:'20px 18px 6px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.t3}}>Trending Schemes</div>
                    <div onClick={()=>setPage('schemes')} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:C.p,cursor:'pointer'}}>See All</div>
                  </div>
                  {[{ic:'🏈',ttl:'4-Wide Trips Formation',desc:'Spread concepts for 8U rosters with limited blocking'},{ic:'🏀',ttl:'Motion-Heavy Half Court',desc:'Keeps defenders guessing with constant player movement'}].map(t=>(
                    <div key={t.ttl} onClick={()=>setPage('schemes')} style={{background:C.s1,border:`1px solid ${C.b1}`,borderRadius:C.r,padding:16,cursor:'pointer',display:'flex',alignItems:'center',gap:14,marginBottom:8}}>
                      <div style={{fontSize:28,flexShrink:0}}>{t.ic}</div>
                      <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,marginBottom:3}}>{t.ttl}</div><div style={{fontSize:12,color:C.t2,lineHeight:1.4}}>{t.desc}</div></div>
                      <div style={{color:C.t3,fontSize:16}}>›</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {page==='schemes'&&(
              <div style={{paddingBottom:90,animation:'fadeUp .25s ease both'}}>
                <div style={{padding:'20px 18px 16px',borderBottom:`1px solid ${C.b1}`}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,letterSpacing:1,marginBottom:14}}>Scheme Generator</div>
                  <div style={{display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none'}}>
                    {['football','basketball','baseball'].map(sp=>(
                      <button key={sp} onClick={()=>setSport(sp)} style={{flexShrink:0,padding:'7px 14px',borderRadius:20,border:sport===sp?`1px solid ${C.p}`:`1px solid ${C.b1}`,background:sport===sp?C.p:'transparent',color:sport===sp?'#fff':C.t2,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',cursor:'pointer'}}>
                        {sp==='football'?'🏈 Football':sp==='basketball'?'🏀 Basketball':'⚾ Baseball'}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{padding:'18px 18px 0'}}>
                  <label style={lblStyle}>Age Group / Level</label>
                  <select value={schemeLevel} onChange={e=>setSchemeLevel(e.target.value)} style={selStyle}>{SPORTS[sport].levels.map(o=><option key={o} value={o} style={{background:C.s2}}>{o}</option>)}</select>

                  <label style={lblStyle}>Scheme Type</label>
                  <select value={schemeType} onChange={e=>setSchemeType(e.target.value)} style={selStyle}>{SPORTS[sport].types.map(o=><option key={o} value={o} style={{background:C.s2}}>{o}</option>)}</select>

                  <label style={lblStyle}>Formation / Style</label>
                  <select value={schemeForm} onChange={e=>setSchemeForm(e.target.value)} style={selStyle}>{SPORTS[sport].formations.map(o=><option key={o} value={o} style={{background:C.s2}}>{o}</option>)}</select>

                  <label style={lblStyle}>Opposing Team Tendency</label>
                  <select value={schemeOpp} onChange={e=>setSchemeOpp(e.target.value)} style={selStyle}>{SPORTS[sport].oppTendencies.map(o=><option key={o} value={o} style={{background:C.s2}}>{o}</option>)}</select>

                  <label style={lblStyle}>Your Players' Experience Level</label>
                  <select value={schemeExp} onChange={e=>setSchemeExp(e.target.value)} style={selStyle}>{SPORTS[sport].experienceLevels.map(o=><option key={o} value={o} style={{background:C.s2}}>{o}</option>)}</select>

                  <label style={lblStyle}>Anything else? <span style={{color:C.t3,fontWeight:400,fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:0,textTransform:'none'}}>(optional — roster notes, specific plays, game situation, etc.)</span></label>
                  <textarea value={schemeCtx} onChange={e=>setSchemeCtx(e.target.value)} placeholder="e.g. We have one very fast WR. Our QB is shaky under pressure. Need something we can install in 2 practices..." style={{...taStyle,height:90}}/>

                  <button onClick={generateScheme} disabled={schemeLoading} style={{width:'100%',background:schemeLoading?C.s3:C.p,color:schemeLoading?C.t3:'#fff',border:'none',borderRadius:C.rs,padding:14,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',cursor:schemeLoading?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,marginBottom:20}}>
                    {schemeLoading?'⏳ Generating...':'⚡ Generate Scheme'}
                  </button>
                </div>

                {(schemeLoading||schemeOutput)&&(
                  <div style={{margin:'0 18px 20px',background:C.s1,border:`1px solid ${C.b1}`,borderRadius:C.r,overflow:'hidden',animation:'fadeUp .3s ease both'}}>
                    <div style={{background:C.s2,borderBottom:`1px solid ${C.b1}`,padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:C.p}}>AI SCHEME</div>
                      <div style={{background:'rgba(204,17,34,.15)',border:'1px solid rgba(204,17,34,.3)',borderRadius:4,padding:'2px 8px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:C.p}}>COACHIQ AI</div>
                    </div>
                    {schemeLoading&&<div style={{padding:'24px 16px',display:'flex',flexDirection:'column',alignItems:'center',gap:12}}><div style={{width:28,height:28,border:`2px solid ${C.b2}`,borderTopColor:C.p,borderRadius:'50%',animation:'spin .7s linear infinite'}}/><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',color:C.t3,animation:'pulse 1.4s ease infinite'}}>Building your scheme...</div></div>}
                    {schemeOutput&&!schemeLoading&&(
                      <>
                        <div style={{padding:16,fontSize:14,lineHeight:1.7,color:C.t2,whiteSpace:'pre-wrap'}}>{schemeOutput}</div>
                        {lastScheme&&<div style={{padding:'0 16px 16px'}}><button onClick={saveScheme} style={{width:'100%',background:'transparent',border:`1px solid ${C.b2}`,borderRadius:C.rs,padding:10,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:C.t2,cursor:'pointer'}}>📋 Save to Playbook</button></div>}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {page==='gauntlet'&&(
              <div style={{paddingBottom:90,animation:'fadeUp .25s ease both'}}>
                <div style={{padding:'22px 18px 18px',background:'linear-gradient(160deg,rgba(204,17,34,.07) 0%,transparent 60%)',borderBottom:`1px solid ${C.b1}`,textAlign:'center'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',marginBottom:4}}>⚡ Gauntlet Mode</div>
                  <div style={{fontSize:13,color:C.t2,marginBottom:18}}>AI-generated coaching scenarios. No two sessions alike.</div>
                  <div style={{display:'inline-flex',flexDirection:'column',alignItems:'center',background:C.s1,border:`1px solid ${C.b1}`,borderRadius:C.r,padding:'14px 28px'}}>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:52,fontWeight:700,color:C.p,lineHeight:1}}>{iq}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',color:C.t3,marginTop:3}}>Current CoachIQ</div>
                  </div>
                </div>

                {gPhase==='start'&&(
                  <>
                    <div style={{padding:'18px 18px 0'}}>
                      <label style={lblStyle}>What do you want to work on? <span style={{color:C.t3,fontWeight:400,fontFamily:"'DM Sans',sans-serif",fontSize:11,letterSpacing:0,textTransform:'none'}}>(optional)</span></label>
                      <textarea value={gFocus} onChange={e=>setGFocus(e.target.value)} placeholder="e.g. red zone play calling, defending a dual-threat QB, 2-minute drill, reading zone defense..." style={{...taStyle,height:80}}/>
                      <div style={{fontSize:11,color:C.t3,marginBottom:16,lineHeight:1.5}}>Leave blank for random scenarios across all situations.</div>
                    </div>
                    <div style={{padding:'0 18px 20px',display:'flex',flexDirection:'column',gap:10}}>
                      {[{sp:'football',ic:'🏈',nm:'Football IQ',desc:'Formations, reads, defensive schemes, situational play-calling',feat:true},{sp:'basketball',ic:'🏀',nm:'Basketball IQ',desc:'Half-court sets, defensive rotations, late-game decisions'},{sp:'baseball',ic:'⚾',nm:'Baseball IQ',desc:'Situational hitting, pitching strategy, base management'}].map(m=>(
                        <div key={m.sp} onClick={()=>startGauntlet(m.sp)} style={{background:C.s1,border:m.feat?'1px solid rgba(204,17,34,.35)':`1px solid ${C.b1}`,borderRadius:C.r,padding:16,cursor:'pointer',display:'flex',alignItems:'center',gap:14}}>
                          <div style={{fontSize:28,flexShrink:0}}>{m.ic}</div>
                          <div style={{flex:1}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,marginBottom:3}}>{m.nm}</div><div style={{fontSize:12,color:C.t2,lineHeight:1.4}}>{m.desc}</div></div>
                          <div style={{color:C.t3,fontSize:16}}>›</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {gPhase==='loading'&&(
                  <div style={{padding:'40px 18px',display:'flex',flexDirection:'column',alignItems:'center',gap:14,textAlign:'center'}}>
                    <div style={{width:36,height:36,border:`3px solid ${C.b2}`,borderTopColor:C.p,borderRadius:'50%',animation:'spin .7s linear infinite'}}/>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',color:C.t3,animation:'pulse 1.4s ease infinite'}}>Generating your scenario...</div>
                    <div style={{fontSize:12,color:C.t3}}>CoachIQ AI is building a real coaching decision</div>
                  </div>
                )}

                {gPhase==='question'&&q&&(
                  <div style={{padding:'18px 18px 0',animation:'fadeUp .25s ease both'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18}}>
                      <div style={{flex:1,height:3,background:C.s3,borderRadius:2,overflow:'hidden'}}>
                        <div style={{height:'100%',background:C.p,borderRadius:2,width:`${(gIdx/gQuestions.length)*100}%`,transition:'width .4s ease'}}/>
                      </div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:600,letterSpacing:'1px',color:C.t3,whiteSpace:'nowrap'}}>{gIdx+1} / {gQuestions.length}</div>
                    </div>
                    <div style={{background:'rgba(204,17,34,.12)',border:'1px solid rgba(204,17,34,.25)',borderRadius:20,padding:'4px 12px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:C.p,display:'inline-block',marginBottom:12}}>{gSport.charAt(0).toUpperCase()+gSport.slice(1)}</div>
                    <div style={{fontSize:16,fontWeight:500,lineHeight:1.5,marginBottom:20}}>{q.question}</div>
                    {q.context&&q.context.trim()&&<div style={{background:C.s1,border:`1px solid ${C.b1}`,borderRadius:C.rs,padding:'12px 14px',fontSize:13,color:C.t2,lineHeight:1.5,marginBottom:16,fontStyle:'italic'}}>{q.context}</div>}
                    <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:16}}>
                      {q.options.map((opt,i)=>{
                        let border=`1px solid ${C.b1}`,bg=C.s1,ltBg=C.s3,ltColor=C.t3;
                        if(gChosen!==null){
                          if(i===q.correct){border='1px solid #22c55e';bg='rgba(34,197,94,.08)';ltBg='#22c55e';ltColor='#fff';}
                          else if(i===gChosen){border=`1px solid ${C.p}`;bg='rgba(204,17,34,.08)';ltBg=C.p;ltColor='#fff';}
                        }
                        return(
                          <button key={i} onClick={()=>selectOption(i)} disabled={gChosen!==null} style={{background:bg,border,borderRadius:C.rs,padding:'14px 16px',textAlign:'left',cursor:gChosen!==null?'not-allowed':'pointer',fontFamily:"'DM Sans',sans-serif",fontSize:14,color:C.t1,display:'flex',alignItems:'flex-start',gap:12,lineHeight:1.4,width:'100%'}}>
                            <span style={{width:24,height:24,minWidth:24,borderRadius:'50%',background:ltBg,border:`1px solid ${C.b2}`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,color:ltColor,flexShrink:0}}>{['A','B','C','D'][i]}</span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                    {gChosen!==null&&<div style={{background:C.s2,border:`1px solid ${C.b1}`,borderRadius:C.rs,padding:'14px 16px',marginBottom:14,animation:'fadeUp .25s ease both'}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,letterSpacing:'1px',textTransform:'uppercase',marginBottom:6,color:gChosen===q.correct?'#22c55e':C.p}}>{gChosen===q.correct?'✓ Correct':'✗ Not quite'}</div><div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>{q.explanation}</div></div>}
                    {gChosen!==null&&<button onClick={nextQuestion} style={{width:'100%',background:C.s2,border:`1px solid ${C.b2}`,borderRadius:C.rs,padding:13,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:C.t1,cursor:'pointer',marginBottom:4}}>{gIdx+1>=gQuestions.length?'Finish Gauntlet ✓':'Next Question →'}</button>}
                  </div>
                )}
              </div>
            )}

            {page==='playbook'&&(
              <div style={{paddingBottom:90,animation:'fadeUp .25s ease both'}}>
                <div style={{padding:'20px 18px 16px',borderBottom:`1px solid ${C.b1}`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:700,letterSpacing:1}}>My Playbook</div>
                  <button onClick={editTeam} style={{background:'transparent',border:`1px solid ${C.b2}`,borderRadius:20,padding:'6px 14px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:C.t2,cursor:'pointer'}}>+ Team</button>
                </div>
                {savedSchemes.length===0?(
                  <div style={{padding:'50px 18px',display:'flex',flexDirection:'column',alignItems:'center',gap:12,textAlign:'center'}}>
                    <div style={{fontSize:40,opacity:.4}}>📋</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:700,letterSpacing:1,color:C.t2}}>No schemes saved yet</div>
                    <div style={{fontSize:13,color:C.t3,lineHeight:1.5,maxWidth:220}}>Generate a scheme and save it here to build your playbook over time.</div>
                  </div>
                ):(
                  <div style={{padding:'16px 18px',display:'flex',flexDirection:'column',gap:10}}>
                    {savedSchemes.map((sc,i)=>(
                      <div key={i} style={{background:C.s1,border:`1px solid ${C.b1}`,borderRadius:C.r,padding:'14px 16px'}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:700,marginBottom:4}}>{sc.type} — {sc.form}</div>
                        <div style={{fontSize:11,color:C.t3}}>{sc.sport.charAt(0).toUpperCase()+sc.sport.slice(1)} · {sc.level} · {sc.date}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {page==='account'&&(
              <div style={{paddingBottom:90,animation:'fadeUp .25s ease both'}}>
                <div style={{padding:'28px 18px 20px',display:'flex',flexDirection:'column',alignItems:'center',gap:10,borderBottom:`1px solid ${C.b1}`,textAlign:'center'}}>
                  <div style={{width:64,height:64,borderRadius:'50%',background:C.p,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:700,color:'#fff',border:'3px solid rgba(204,17,34,.3)'}}>J</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:700}}>Coach Jayden</div>
                  <div style={{fontSize:13,color:C.t2}}>{teamName}</div>
                  <div style={{background:'linear-gradient(135deg,#f5a623,#e8901a)',borderRadius:12,padding:'4px 14px',fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#fff'}}>Pro Coach</div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',borderBottom:`1px solid ${C.b1}`}}>
                  {[[String(iq),'CoachIQ'],[String(schemesBuilt),'Schemes'],['7','Streak']].map(([v,l],i)=>(
                    <div key={l} style={{padding:'18px 12px',textAlign:'center',borderRight:i<2?`1px solid ${C.b1}`:'none'}}>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:700,color:C.p,lineHeight:1}}>{v}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:C.t3,marginTop:4}}>{l}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:'16px 18px',display:'flex',flexDirection:'column',gap:4}}>
                  {[['🏆','My Team',teamName.slice(0,14),editTeam],['🔔','Notifications','On',null],['⭐','Upgrade to Elite','View',null],['🚪','Sign Out','',()=>setScreen('splash')]].map(([ic,lbl,val,fn])=>(
                    <div key={lbl} onClick={fn||undefined} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:`1px solid ${C.b1}`,cursor:fn?'pointer':'default'}}>
                      <div style={{display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:18,width:22,textAlign:'center'}}>{ic}</span><span style={{fontSize:14,fontWeight:500}}>{lbl}</span></div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:600,letterSpacing:'1px',color:lbl==='Upgrade to Elite'?C.p:C.t3}}>{val} ›</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div style={{position:'fixed',bottom:0,left:0,right:0,background:C.s1,borderTop:`1px solid ${C.b1}`,display:'flex',alignItems:'center',justifyContent:'space-around',padding:'8px 0',zIndex:50}}>
            {[['home','🏠','Home'],['schemes','⚡','Schemes'],['gauntlet','🧠','Gauntlet'],['playbook','📋','Playbook'],['account','👤','Account']].map(([pg,ic,lb])=>(
              <div key={pg} onClick={()=>setPage(pg)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,flex:1,padding:'6px 4px',cursor:'pointer'}}>
                <span style={{fontSize:20,transform:page===pg?'scale(1.1)':'none',transition:'transform .15s'}}>{ic}</span>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,fontWeight:600,letterSpacing:'1px',textTransform:'uppercase',color:page===pg?C.p:C.t3}}>{lb}</span>
                <div style={{width:4,height:4,borderRadius:'50%',background:C.p,opacity:page===pg?1:0,transition:'opacity .15s'}}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}