import { useState, useEffect, useRef, useCallback } from 'react'

// ─── APP VERSION & FEATURE FLAGS ─────────────────────────────────────────────
// Update APP_VERSION with each major push.
// STATUS: 'live' | 'beta' | 'coming_soon' | 'planned'
// TIER: 'free' | 'founding' | 'pro' | 'league'
const APP_VERSION = '1.5.2'
const FEATURES = {
  hub:               { status:'live',        name:'C·IQ Hub',                  tier:'free'     },
  schemes_offense:   { status:'live',        name:'Offense Scheme Generator',  tier:'free'     },
  schemes_defense:   { status:'live',        name:'Defense Scheme Generator',  tier:'free'     },
  play_name_builder: { status:'live',        name:'Play Name Builder',         tier:'free'     },
  gauntlet:          { status:'live',        name:'Coaching Gauntlet',         tier:'free'     },
  rulebook:          { status:'live',        name:'Rulebook',                  tier:'free'     },
  news_feed:         { status:'live',        name:'Sport News Feed',           tier:'free'     },
  weather:           { status:'live',        name:'Weather Intelligence',      tier:'free'     },
  situational:       { status:'live',        name:'Situational Advisor',       tier:'free'     },
  film_room:         { status:'live',        name:'Film Room',                 tier:'free'     },
  team_management:   { status:'live',        name:'Team Management',           tier:'free'     },
  roster:            { status:'live',        name:'Roster',                    tier:'free'     },
  schedule:          { status:'live',        name:'Schedule',                  tier:'free'     },
  live_scoring:      { status:'live',        name:'Live Scoring',              tier:'free'     },
  analytics:         { status:'live',        name:'Analytics',                 tier:'free'     },
  practice_plans:    { status:'live',        name:'Practice Plans',            tier:'free'     },
  post_game:         { status:'live',        name:'Post-Game Summary',         tier:'free'     },
  playbook:          { status:'live',        name:'Playbook',                  tier:'free'     },
  scout:             { status:'live',        name:'Scout Reports',             tier:'free'     },
  lineup_builder:    { status:'live',        name:'Lineup Builder',            tier:'free'     },
  print_wristbands:  { status:'live',        name:'Print / Wristbands',        tier:'free'     },
  sport_football:    { status:'live',        name:'Football',                  tier:'free'     },
  sport_basketball:  { status:'live',        name:'Basketball',                tier:'free'     },
  sport_baseball:    { status:'live',        name:'Baseball',                  tier:'free'     },
  sport_soccer:      { status:'live',        name:'Soccer',                    tier:'free'     },
  sport_softball:    { status:'live',        name:'Softball',                  tier:'free'     },
  sport_flag:        { status:'coming_soon', name:'Flag Football',             tier:'free'     },
  athlete_iq:        { status:'planned',     name:'AthleteIQ',                 tier:'pro'      },
  coach_network:     { status:'planned',     name:'Coach Network',             tier:'pro'      },
  league_manager:    { status:'planned',     name:'League Manager',            tier:'league'   },
  certifications:    { status:'planned',     name:'Coaching Certifications',   tier:'pro'      },
  advanced_analytics:{ status:'planned',     name:'Advanced Analytics',        tier:'founding' },
}
// ─────────────────────────────────────────────────────────────────────────────


function useWindowSize() {
  const [size, setSize] = useState({ w: 375, h: 812 })
  useEffect(() => {
    function update() { setSize({ w: window.innerWidth, h: window.innerHeight }) }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}
// w < 480 = phone, 480-1024 = tablet, > 1024 = desktop
function useBreakpoint() {
  const { w } = useWindowSize()
  return { isPhone: w < 480, isTablet: w >= 480 && w <= 1024, isDesktop: w > 1024, w }
}


import Head from 'next/head'

// ─── BRAND CONFIG ────────────────────────────────────────────────────────────
const BRAND_PALETTES = {
  'Red — C+IQ colored':   { accent: '#C0392B', accentOn: 'CIQ', name: 'Red — C+IQ colored' },
  'Red — oach colored':   { accent: '#C0392B', accentOn: 'oach', name: 'Red — oach colored' },
  'Blue — C+IQ colored':  { accent: '#1565C0', accentOn: 'CIQ', name: 'Blue — C+IQ colored' },
  'Blue — oach colored':  { accent: '#1565C0', accentOn: 'oach', name: 'Blue — oach colored' },
  'Gold — C+IQ colored':  { accent: '#f59e0b', accentOn: 'CIQ', name: 'Gold — C+IQ colored' },
}


// ─── MASCOTS ──────────────────────────────────────────────────────────────────
const MASCOT_SVGS = {
  eagles: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_eagles" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_eagles" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_eagles" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_eagles)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#292F33" d="M7.042 26c.33 0 .651.121.963.331 1.368-8.106 20.362-8.248 21.755-.29 1.666.412 3.08 4.378 3.748 9.959h-31c.793-5.899 2.522-10 4.534-10z"/><path fill="#E1E8ED" d="M7.043 23.688C10.966 12.533 6.508 3 17.508 3s8.736 8.173 13.193 19.125c1.119 2.75-1.443 5.908-1.443 5.908s-2.612-4.756-4.75-5.846c-.591 3.277-1.75 6.938-1.75 6.938s-2.581-2.965-5.587-5.587c-.879 1.009-2.065 2.183-3.663 3.462-.349-1.048-.943-2.339-1.568-3.576-1.468 2.238-3.182 4.951-3.182 4.951s-2.507-2.435-1.715-4.687z"/><path fill="#FFCC4D" d="M11.507 5c-4.36 3.059-5.542 2.16-7.812 3.562-2.125 1.312-2 4.938-.125 8.062.579-2.661-.5-3.149 6.938-3.149 5 0 7.928.289 7-1-.927-1.289-10.027.459-6.001-7.475z"/><path fill="#292F33" d="M16.535 7.517a1.483 1.483 0 1 1-2.967 0c0-.157.031-.305.076-.446h2.816c.044.141.075.289.075.446z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_eagles)"/><circle cx="30" cy="30" r="24" fill="url(#sh_eagles)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  tigers: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_tigers" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_tigers" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_tigers" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_tigers)" transform="translate(7.0,5.0) scale(1.2778)"><circle cx="7" cy="6" r="6" fill="#FFCC4D"/><circle cx="18" cy="30" r="6" fill="#FFCC4D"/><circle cx="18" cy="30" r="4" fill="#DD2E44"/><circle cx="29" cy="6" r="6" fill="#FFCC4D"/><circle cx="7" cy="6" r="4" fill="#E6AAAA"/><circle cx="29" cy="6" r="4" fill="#E6AAAA"/><path fill="#FFCC4D" d="M34 22c0 7-4.923 7-4.923 7H6.923S2 29 2 22C2 22 3.231 0 18 0c14.77 0 16 22 16 22z"/><path fill="#272B2B" d="M11 17s0-2 2-2 2 2 2 2v2s0 2-2 2-2-2-2-2v-2zm10 0s0-2 2-2 2 2 2 2v2s0 2-2 2-2-2-2-2v-2z"/><path fill="#FFF" d="M23.678 23c-2.402 0-4.501.953-5.678 2.378C16.823 23.953 14.723 23 12.321 23 2 23 2.043 23.421 2 26.182c-.087 5.61 6.63 6.9 10.321 6.818 2.401-.053 4.502-.989 5.679-2.397 1.177 1.408 3.276 2.345 5.678 2.397 3.691.082 10.409-1.208 10.321-6.818-.043-2.761 0-3.182-10.321-3.182z"/><path fill="#272B2B" d="M33.66 25.242c.204.279.333.588.339.939.03 1.905-.745 3.303-1.915 4.327L26.999 31l6.661-5.758zM15 25c-1 1 2 4 3 4s4-3 3-4-5-1-6 0zM10 3c2.667 2 8 4 8 4s5.333-2 8-4l-8 1-8-1zm8-1s1.652-.62 3.576-1.514C20.48.178 19.295 0 18 0s-2.481.178-3.576.486C16.348 1.38 18 2 18 2zm-7 7c3 2 7 4 7 4s4-2 7-4l-7 1-7-1zm20.645 2.285L27 15l6.006.75a36.407 36.407 0 0 0-1.361-4.465zm1.911 7.159L28 24h5.835A11.73 11.73 0 0 0 34 22s-.081-1.43-.444-3.556zm-31.112 0C2.082 20.57 2 22 2 22c0 .748.063 1.405.165 2H8l-5.556-5.556zm-.105 6.798c-.204.279-.333.588-.339.94-.03 1.905.745 3.303 1.916 4.327L9 31l-6.661-5.758zM9 15l-4.644-3.715a36.194 36.194 0 0 0-1.361 4.466L9 15z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_tigers)"/><circle cx="30" cy="30" r="24" fill="url(#sh_tigers)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  lions: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_lions" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_lions" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_lions" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_lions)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#662113" d="M32.325 10.958s2.315.024 3.511 1.177c-.336-4.971-2.104-8.249-5.944-10.13-3.141-1.119-6.066 1.453-6.066 1.453s.862-1.99 2.19-2.746C23.789.236 21.146 0 18 0c-3.136 0-5.785.227-8.006.701 1.341.745 2.215 2.758 2.215 2.758S9.194.803 6 2.053C2.221 3.949.481 7.223.158 12.174c1.183-1.19 3.55-1.215 3.55-1.215S-.105 13.267.282 16.614c.387 2.947 1.394 5.967 2.879 8.722C3.039 22.15 5.917 20 5.917 20s-2.492 5.96-.581 8.738c1.935 2.542 4.313 4.641 6.976 5.916-.955-1.645-.136-3.044-.103-2.945.042.125.459 3.112 2.137 3.743 1.178.356 2.4.548 3.654.548 1.292 0 2.55-.207 3.761-.583 1.614-.691 2.024-3.585 2.064-3.708.032-.098.843 1.287-.09 2.921 2.706-1.309 5.118-3.463 7.064-6.073 1.699-2.846-.683-8.557-.683-8.557s2.85 2.13 2.757 5.288c1.556-2.906 2.585-6.104 2.911-9.2-.035-3.061-3.459-5.13-3.459-5.13z"/><path fill="#FFCC4D" d="M13.859 9.495c.596 2.392.16 4.422-2.231 5.017-2.392.596-6.363.087-6.958-2.304-.596-2.392.469-5.39 1.81-5.724 1.341-.334 6.784.62 7.379 3.011zm9.104 18.432a4.964 4.964 0 1 1-9.927-.001 4.964 4.964 0 0 1 9.927.001z"/><path fill="#DD2E44" d="M21.309 27.927a3.309 3.309 0 1 1-6.618 0 3.309 3.309 0 0 1 6.618 0z"/><path fill="#E6AAAA" d="M11.052 8.997a2.976 2.976 0 0 1-.946 4.1c-1.394.871-2.608.797-3.479-.596-.871-1.394-.186-4.131.324-4.45.51-.319 3.23-.448 4.101.946z"/><path fill="#FFCC4D" d="M22.141 9.495c-.596 2.392-.159 4.422 2.232 5.017 2.392.596 6.363.087 6.959-2.304.596-2.392-.47-5.39-1.811-5.724-1.342-.334-6.786.62-7.38 3.011z"/><path fill="#E6AAAA" d="M24.948 8.997a2.976 2.976 0 0 0 .945 4.1c1.394.871 2.608.797 3.479-.596.871-1.394.185-4.131-.324-4.45-.51-.319-3.229-.448-4.1.946z"/><path fill="#FFCC4D" d="M18 7.125h-.002C5.167 7.126 7.125 12.083 8.5 18.667 9.875 25.25 10.384 27 10.384 27h15.228s.51-1.75 1.885-8.333C28.872 12.083 30.829 7.126 18 7.125z"/><path fill="#272B2B" d="M12 16s0-1.5 1.5-1.5S15 16 15 16v1.5s0 1.5-1.5 1.5-1.5-1.5-1.5-1.5V16zm9 0s0-1.5 1.5-1.5S24 16 24 16v1.5s0 1.5-1.5 1.5-1.5-1.5-1.5-1.5V16z"/><path fill="#FFE8B6" d="M20.168 21.521c-1.598 0-1.385.848-2.168 2.113-.783-1.266-.571-2.113-2.168-2.113-6.865 0-6.837.375-6.865 2.828-.058 4.986 2.802 6.132 5.257 6.06 1.597-.048 2.994-.88 3.777-2.131.783 1.251 2.179 2.083 3.776 2.131 2.455.072 5.315-1.073 5.257-6.06-.029-2.453-.001-2.828-6.866-2.828z"/><path fill="#272B2B" d="M14.582 21.411c-1.14.233 2.279 4.431 3.418 4.431s4.559-4.198 3.419-4.431c-1.14-.232-5.698-.232-6.837 0z"/><circle cx="11.5" cy="24.5" r=".5" fill="#D99E82"/><circle cx="10.5" cy="26.5" r=".5" fill="#D99E82"/><circle cx="12.5" cy="27.5" r=".5" fill="#D99E82"/><circle cx="24.5" cy="24.5" r=".5" fill="#D99E82"/><circle cx="25.5" cy="26.5" r=".5" fill="#D99E82"/><circle cx="23.5" cy="27.5" r=".5" fill="#D99E82"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_lions)"/><circle cx="30" cy="30" r="24" fill="url(#sh_lions)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  bears: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_bears" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_bears" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_bears" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_bears)" transform="translate(7.0,5.0) scale(1.2778)"><circle cx="7" cy="6" r="6" fill="#C1694F"/><circle cx="29" cy="6" r="6" fill="#C1694F"/><circle cx="7" cy="6" r="4" fill="#E6AAAA"/><circle cx="29" cy="6" r="4" fill="#E6AAAA"/><path fill="#C1694F" d="M35 22S33.692 0 18 0 1 22 1 22c0 5.872 4.499 10.323 12.216 11.61a5.982 5.982 0 0 0 9.568 0C30.501 32.323 35 27.872 35 22z"/><circle cx="18" cy="30" r="4" fill="#DD2E44"/><path fill="#D99E82" d="M18 20S7 23.687 7 27a6 6 0 0 0 11 3.315A6 6 0 0 0 29 27c0-3.313-11-7-11-7z"/><path fill="#272B2B" d="M11 17s0-2 2-2 2 2 2 2v2s0 2-2 2-2-2-2-2v-2zm10 0s0-2 2-2 2 2 2 2v2s0 2-2 2-2-2-2-2v-2zm-7.875 8c-1.624 1 3.25 4 4.875 4s6.499-3 4.874-4-8.124-1-9.749 0z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_bears)"/><circle cx="30" cy="30" r="24" fill="url(#sh_bears)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  wolves: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_wolves" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_wolves" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_wolves" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_wolves)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#66757F" d="M14.858 9.497c.475 2.326-.182 4.236-2.921 4.638-2.741.403-6.7 3.898-8.848-1.798C1.844 9.038 1.092 2.234 2.628 2.009c1.537-.226 11.756 5.162 12.23 7.488z"/><path fill="#CCD6DD" d="M12.784 9.851c.865 1.392-2.205 3.833-3.844 4.568-1.639.736-2.915-.66-4.173-4.1-.55-1.503-1.234-5.532-.634-5.802.599-.268 7.785 3.942 8.651 5.334z"/><path fill="#66757F" d="M21.372 9.497c-.458 2.326.176 4.236 2.818 4.638 2.644.403 6.464 3.898 8.536-1.798 1.201-3.3 1.927-10.103.445-10.329-1.483-.225-11.342 5.163-11.799 7.489z"/><path fill="#CCD6DD" d="M23.373 9.851c-.835 1.392 2.127 3.833 3.708 4.568 1.581.736 2.812-.66 4.026-4.1.531-1.503 1.19-5.532.611-5.802-.577-.268-7.509 3.942-8.345 5.334z"/><path fill="#66757F" d="M32.347 26.912c0-.454-.188-1.091-.407-1.687.585.028 1.519.191 2.77.817a4.003 4.003 0 0 0-.273-1.393c.041.02.075.034.116.055-1.104-3.31-3.309-5.517-3.309-5.517h2.206c-2.331-4.663-4.965-8.015-8.075-9.559-1.39-.873-3.688-1.338-7.373-1.339h-.003c-3.696 0-5.996.468-7.385 1.346-3.104 1.547-5.734 4.896-8.061 9.552H4.76s-2.207 2.206-3.311 5.517l.084-.039a2.685 2.685 0 0 0-.282 1.377c1.263-.632 2.217-.792 2.813-.818-.189.513-.343 1.044-.386 1.475a3.146 3.146 0 0 0-.135 1.343c3.207-1.458 4.707-1.25 6.457-.375C11.213 31.29 14.206 34 18.001 34c3.793 0 6.746-2.794 7.958-6.416 1.458-1.25 3.708-.875 6.416.416a2.844 2.844 0 0 0-.036-1.093l.008.005z"/><path fill="#CCD6DD" d="M34.553 24.704c-.437-1.313-3.665-3.101-6.973-4.513.26-.664.42-1.401.42-2.191 0-2.761-1.791-5-4-5s-4 2.239-4 5c0 3 4 10-2.001 11.118-5.125-.955-2.954-6.201-2.212-9.58.072-.276.125-.559.158-.853.034-.245.055-.476.055-.685 0-2.761-1.791-5-4-5s-4 2.239-4 5c0 .79.16 1.527.421 2.191-3.308 1.412-6.535 3.2-6.973 4.513C3.655 23.6 4.759 23.6 4.759 23.6s-1.104 2.208-1.104 3.312c2.67-1.78 5.339-2.122 7.429-.452C12.297 30.083 14 33 18.001 30.124c3.999 2.876 5.7-.04 6.912-3.662 2.092-1.673 4.763-1.33 7.434.45 0-1.104-1.103-3.312-1.103-3.312s1.103.001 3.309 1.104z"/><path fill="#292F33" d="M11 17s0-1.5 1.5-1.5S14 17 14 17v1.5s0 1.5-1.5 1.5-1.5-1.5-1.5-1.5V17zm11 0s0-1.5 1.5-1.5S25 17 25 17v1.5s0 1.5-1.5 1.5-1.5-1.5-1.5-1.5V17zm-7.061 9.156c-1.021.208 2.041 3.968 3.062 3.968 1.02 0 4.082-3.76 3.062-3.968s-5.103-.208-6.124 0z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_wolves)"/><circle cx="30" cy="30" r="24" fill="url(#sh_wolves)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  sharks: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_sharks" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_sharks" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_sharks" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_sharks)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#66757F" d="M36 21c0 5-3 9-11 11-7.062 1.766-21-.934-21-2 0-1.129 2.503-1.371 6.812-1.125 10.938.625 13.75-3.857 12-5.25-3.062-2.437-6.437.375-12.062-.125C3.782 22.881 0 17.472 0 16c0-2 11.716-8 20-8s16 4.25 16 13z"/><path fill="#292F33" d="M15 12.5a1.5 1.5 0 1 1-3 0c0-.829.671-.5 1.5-.5s1.5-.329 1.5.5z"/><path fill="#66757F" d="M14 9c2-5 5.291-9 7.958-9S21 2 26 10 14 9 14 9zM3 30c0-4-1.04-6 .146-6s6.011 4.031 6.011 6.24c0 2.209-4.826 5.76-6.011 5.76C1.96 36 3 34 3 30z"/><path fill="#292F33" d="m26.921 22.5 7.996 7.5s-3.242 1.833-7.996-7.5z"/><path fill="#66757F" d="m26.921 22.5 5.537-3.833S36.333 28.584 34.917 30c-2.583-1-7.996-7.5-7.996-7.5z"/><path fill="#FFF" d="M9 20.307c0 .493-.508 2.673-1 2.673s-1-2.18-1-2.673v-1.779c0-.493.508.889 1 .889s1-1.382 1-.889v1.779zm3 0c0 .493-.508 2.673-1 2.673s-1-2.18-1-2.673v-1.779c0-.493.508.889 1 .889s1-1.382 1-.889v1.779zm3-1c0 .493-.508 2.673-1 2.673s-1-2.18-1-2.673v-1.779c0-.493.508.889 1 .889s1-1.382 1-.889v1.779zm3 0c0 .493-.508 2.673-1 2.673s-1-2.18-1-2.673v-1.779c0-.493.508.889 1 .889s1-1.382 1-.889v1.779z"/><path fill="#66757F" d="m6 20 7-1h6v-2H6z"/><path fill="#292F33" d="M18.417 19.167c-4-2.083-13.385-.011-14.917 1.513.469.36.988.707 1.547 1.028 6.109-3.281 14.082-2.169 13.37-2.541z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_sharks)"/><circle cx="30" cy="30" r="24" fill="url(#sh_sharks)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  dragons: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_dragons" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_dragons" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_dragons" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_dragons)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#3E721D" d="M12.434 29.833c.626-6.708-4.417-7.542-6.417-6.083-1.097.8-1.353 2.323-.479 1.521 1.542-1.416 2.083-.375.917.375s-1.375 2.145-.083 1.188c1.292-.958 1.646-.334.646.895-.605.744.042 1.438 1.167-.062.938-1.251 3.2-1.294 2.662 2.99-.222 1.756 1.453.608 1.587-.824zm7.941-21.022c-.583-3.5-1.125-5.248-4.625-5.832s-6.417 1.75-6.417 1.75.583-3.5 2.333-4.667c.686-.458 1.167 1.75 1.75 1.75s1.167-1.75 2.917-1.75c.583 0 .583 1.75 1.167 1.75.583 0 2.243-.577 2.333 0 .126.812-.167 1.729.292 2.104s1.553-.148 1.901.489c.349.636-.61 1.553-.526 1.97s.719.583.526 1.375-.65.833-.692 1.417.885 1.081.692 1.686c-.192.606-.651.688-.859 1.459-.208.771.541.649.333 1.439-.208.79-.958.991-1.208 1.766-.25.774.666.941.208 1.691s-1.291.875-1.333 1.333.209.818.042 1.555c-.167.736-1.126.362-1.209.945s.209.875.209 1.583-.709.834-.625 1.542.75.167 1.167 1-.249 1.583.209 2.083 1.083-.667 1.708-.25c.625.417.677 1.25 1.359 1.375s.891-1.292 1.391-1.25 1.625.709 2.208.417.541-1.459 1-1.959 1.042-.041 1.458-.583-.145-1.175-.062-1.967.854-1.241.812-1.866-.667-.625-.917-1.292.458-1.25.208-1.875-1.332-.833-1.291-1.458.459-1.333.25-2.042-1.084-1.166-1.042-1.707.499-1.25.583-1.646-.749-.812-.666-1.479.624-.621.832-1.223c.208-.602-.749-.901-.249-1.672s.751-.27 1.167-.688c.416-.417-.001-1.334.416-1.542.417-.208 1.25-.042 1.667-.333s.417-.708.875-.875c.458-.167 1.042.542 1.417.542s1.041-.708 1.541-.542c.5.167 1.584 1.333.917 1.688s-5.751.605-5.792 2.938 2.793 12.917 1.959 15.583-4.291 8.334-8.25 7.25c-3.959-1.084-8.667-3.501-7.542-7.209 1.125-3.709 4.749-11.296 5.458-14.773z"/><path fill="#77B255" d="M21 7.897c0 3.978-2.382 8.144-5.833 7.566-5.323-.89-5.606-2.587-6.417-1.546-2.917 3.743-4.644-.485-5.307-1.186C3.276 12.555 0 11.59 0 9.744c0-1.197 1.75-2.418 2.917-1.231 1.722-.043 8.167-6.156 12.25-6.156C19.25 2.356 21 5.435 21 7.897z"/><path fill="#292F33" d="M14.583 7.062a1.168 1.168 0 1 1-2.335-.001 1.168 1.168 0 0 1 2.335.001z"/><path fill="#3E721D" d="M2.917 10.271c0 .483-.392.292-.875.292s-.875.191-.875-.292a.875.875 0 0 1 1.75 0z"/><path fill="#FFF" d="M11.083 11.144c0 .645-.392.583-.875.583s-.875.061-.875-.583c0-.644.392-2.333.875-2.333s.875 1.689.875 2.333zm-2.333.583c0 .645-.392.583-.875.583-.483.001-.875.062-.875-.583 0-.644.392-2.333.875-2.333s.875 1.689.875 2.333z"/><path fill="#3E721D" d="M11.001 11.152c-3.095.442-6.215 1.224-7.558 1.579.167.177.403.579.709 1.021 1.472-.38 4.253-1.051 7.015-1.444a.585.585 0 0 0-.166-1.156z"/><path fill="#77B255" d="M20.946 8.937c0 4.375-1.714 8.201-2.946 11.17-1.333 3.212-1 9 4 9s6.511-3.191 7-5c1.358-5.021-2-8-2-13 0-9 8-7 8-6s-6.934 1.374-3 9S36 36 22 36 8 27.107 10 23.107c1.416-2.832 4-7.107.5-9.045-2.282-1.263 10.446-5.125 10.446-5.125z"/><path fill="#3E721D" d="M11.335 7.771a.999.999 0 0 1-.707-1.707c.083-.083 2.081-2.043 5.374-2.043a1 1 0 0 1 0 2c-2.435 0-3.945 1.442-3.96 1.457a.997.997 0 0 1-.707.293z"/><path fill="#5C913B" d="M10.708 25.333c.627-6.708-5.417-7.542-7.417-6.083-1.097.8-1.353 2.323-.479 1.521 1.542-1.416 2.083-.375.917.375-1.167.75-1.375 2.146-.083 1.188s1.646-.334.646.895c-.605.744.042 1.438 1.167-.062.938-1.251 4.2-1.294 3.662 2.99-.222 1.756 1.454.608 1.587-.824z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_dragons)"/><circle cx="30" cy="30" r="24" fill="url(#sh_dragons)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  bulls: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_bulls" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_bulls" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_bulls" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_bulls)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#C1694F" d="M33.912 14.37C33.588 12.602 31.976 11 30 11H9c-1 0-5.325.035-6 2L.691 19.305C.016 21.27 1 24.087 3.027 24.087c1.15 0 2.596-.028 3.998-.052C10.016 28.046 12.898 36 14 36c.849 0 1.572-3.414 1.862-6h11.25c.234 2.528.843 6 1.888 6 .954 0 2.977-4.301 4.136-10.917.431-1.901.726-4.418.824-7.647.024.172.04.356.04.564v9a1 1 0 1 0 2 0v-9c0-1.807-.749-3.053-2.088-3.63z"/><path fill="#CCD6DD" d="M10 12c-2 2-4.791-1-7-1-2.209 0-3-.434-3-.969 0-.535 1.791-.969 4-.969S12 10 10 12z"/><circle cx="6" cy="16" r="1" fill="#292F33"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_bulls)"/><circle cx="30" cy="30" r="24" fill="url(#sh_bulls)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  knights: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_knights" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_knights" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_knights" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_knights)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#CCD6DD" d="M33 3c-7-3-15-3-15-3S10 0 3 3C0 18 3 31 18 36c15-5 18-18 15-33z"/><path fill="#55ACEE" d="M18 33.884C6.412 29.729 1.961 19.831 4.76 4.444 11.063 2.029 17.928 2 18 2c.071 0 6.958.04 13.24 2.444 2.799 15.387-1.652 25.285-13.24 29.44z"/><path fill="#269" d="M31.24 4.444C24.958 2.04 18.071 2 18 2v31.884c11.588-4.155 16.039-14.053 13.24-29.44z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_knights)"/><circle cx="30" cy="30" r="24" fill="url(#sh_knights)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  hawks: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_hawks" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_hawks" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_hawks" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_hawks)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#FFAC33" d="M8.916 12.88c-.111 1.652 1.768 3.126-.712 2.959-2.48-.167-7.836-2.533-7.768-3.53s3.708-2.757 6.188-2.59c2.48.166 2.404 1.508 2.292 3.161zm20.122 16.049a.966.966 0 0 0-.564.095c-2.325.232-3.225-1.885-3.225-1.885-.439-.336-.981-2.009-1.589-1.215l.187 1.402c.187 1.402 2.57 3.224 2.57 3.224l-1.215 1.589a1 1 0 1 0 1.589 1.215l.673-.88-.039.249a1 1 0 1 0 1.976.314l.47-2.963a1.003 1.003 0 0 0-.833-1.145zm-6.278.623a.984.984 0 0 0-.572.018c-2.335-.082-2.944-2.3-2.944-2.3-.39-.392-.703-2.123-1.412-1.417l-.003 1.414c-.003 1.414 2.115 3.539 2.115 3.539l-1.417 1.412a.999.999 0 1 0 1.411 1.417l.785-.782-.073.242a1 1 0 0 0 1.916.576l.862-2.873a.996.996 0 0 0-.668-1.246z"/><path fill="#DD2E44" d="M35.009 6.729c-.383-.17-.758-.057-1.05.244-.054.056-4.225 6.306-14.532 4.944-.34-.045 3.139 11.968 3.199 11.962.124-.014 3.07-.368 6.14-2.553 2.818-2.005 6.284-5.991 6.797-13.598.028-.418-.171-.828-.554-.999z"/><path fill="#DD2E44" d="M34.477 21.108c-.204-.336-.59-.56-.979-.471-1.293.295-3.197.543-4.53.453-6.357-.428-9.361-4.129-9.392-4.16-.275-.282.466 11.552.816 11.576 9.194.62 13.862-6.027 14.057-6.31.222-.326.233-.751.028-1.088z"/><path fill="#DD2E44" d="M24.586 19.016c-.371 5.51 1.316 9.861-4.194 9.489-5.51-.371-10.145-4.92-9.774-10.431s14.34-4.568 13.968.942z"/><path fill="#DD2E44" d="M23.257 12.412c-.353 5.235-3.922 9.257-9.156 8.904-5.235-.353-9.193-4.882-8.84-10.117.353-5.235 4.832-8.444 10.067-8.091 4.001.269 8.24 4.683 7.929 9.304z"/><circle cx="10.67" cy="8.989" r="2" fill="#292F33"/><path fill="#A0041E" d="M18.179 16.645s7.63 5.648 12.387-4.459c.396-.842 1.685.793.099 4.162s-8.175 6.44-12.04 1.536c-.815-1.035-.446-1.239-.446-1.239z"/><path fill="#DD2E44" d="M15.327 3.107s6.246.254 7.798-.477.136 2.932-3.262 3.789-4.536-3.312-4.536-3.312z"/><path fill="#DD2E44" d="M17.428 5.788s4.501.136 6.054-.594.136 2.932-3.262 3.789c-3.399.857-2.792-3.195-2.792-3.195z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_hawks)"/><circle cx="30" cy="30" r="24" fill="url(#sh_hawks)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  falcons: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_falcons" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_falcons" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_falcons" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_falcons)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#5C913B" d="M.794 16.112c1 0 5.875 1.344 6.5 2.312L6.013 18.3s-3.906-1.25-4.906-1.25c-1.001 0-.313-.938-.313-.938z"/><path fill="#99AAB5" d="M11 2c1 1 3 7 3 10s-2 6 2 8 5.001-1 5.001-5S20 7 19 5s-2 0-2 0-1-4-2-4-1 2-1 2-2-2-3-2 0 1 0 1z"/><path fill="#CCD6DD" d="M10 15c3 0 4 4 6 4s1-3 3-3 10-5 10-11 3-3 3-1c1 0 2 1.586 2 3 0 1 0 2-1 3 1 0 2 2 1 3 1 3-1 6-3 7 0 1-2 3-4 2 0 0-1 3-3 2 0 0 3.052 1.684 4 2 3 1 7 1 7 1s0 1-2 2c0 0 1 1 0 2s-2 1-2 1 1 2-2 1-6-4-6-4-5 1-9-1-6-6-6-8-3-1-4-1 2-2 3-2c0 0 0-2 3-2z"/><path fill="#5C913B" d="M6.95 18.019s5.438 2.625 7.938 6.656c1.9 3.064 2.782 8.656 2.782 8.656s.043.564-.907-2.281c-1-3-2.217-6.288-4.312-8.188-3.344-3.031-4.75-3.5-6.062-4.25-.332-.189.217-.687.561-.593z"/><path fill="#5C913B" d="M16.198 28.54s2.038.103 3.107 2.139c1.068 2.036-.053 4.914-.053 4.914s-2.75-1.268-3.462-2.947c-.712-1.68.408-4.106.408-4.106zm-2.133-4.778s1.274 1.437 3.558 1.705c2.284.269 4.121-1.379 4.121-1.379s-2.144-1.97-3.968-2.033c-1.823-.065-3.711 1.707-3.711 1.707zm-4.047-3.148s-2.015.329-2.85 2.472.425 4.01.425 4.01 2.534-.848 3.055-2.597c.521-1.747-.63-3.885-.63-3.885z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_falcons)"/><circle cx="30" cy="30" r="24" fill="url(#sh_falcons)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  ravens: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_ravens" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_ravens" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_ravens" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_ravens)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#66757F" d="M23 21c0 6.352-3 10-5 10s-5-3.648-5-10 2.239-7 5-7c2.762 0 5 .648 5 7z"/><circle cx="18" cy="11" r="4" fill="#66757F"/><path fill="#66757F" d="M14 11c-2-5 1-7 1-7s2 1 2 4-3 3-3 3z"/><path fill="#546066" d="M14.668 9.904c-.776-2.457-.119-3.896.403-4.58C15.486 5.773 16 6.608 16 8c0 1.268-.739 1.734-1.332 1.904z"/><path fill="#66757F" d="M22 11c2-5-1-7-1-7s-2 1-2 4 3 3 3 3zm-5.984 3c-1.62 1.157-10 2-9-5 .142-.99-1-1-2 0-3 3-6 7.834-4 20 3-5 6-4 7 1 3-4 6-2 8 0 3-3 0-16 0-16zm3.937 0c1.62 1.157 10 2 9-5-.142-.99 1-1 2 0 3 3 6 7.834 4 20-3-5-6-4-7 1-3-4-6-2-8 0-3-3 0-16 0-16z"/><circle cx="16" cy="11" r="1" fill="#292F33"/><circle cx="20" cy="11" r="1" fill="#292F33"/><path fill="#546066" d="M21.332 9.904c.775-2.457.118-3.896-.403-4.58C20.514 5.773 20 6.608 20 8c0 1.268.739 1.734 1.332 1.904z"/><path fill="#99AAB5" d="M7.996 26.91c.892-2.691.573-5.988-.996-9.91-1.487-3.719-1.315-6.329-1.129-7.423-.049.041-.096.078-.148.13C3.017 12.414.477 16.531 1.66 26.436c1.276-1.379 2.412-1.723 3.228-1.723 1.265 0 2.333.783 3.108 2.197z"/><path fill="#99AAB5" d="M6.832 13.25c-.019-.03-.041-.058-.06-.087C7 16 8.4 17.001 9 20c.588 2.94.476 5.519.088 7.564.839-.571 1.726-.874 2.656-.874 1.264 0 2.548.538 3.895 1.627C14 19 9 17 6.832 13.25zm21.172 13.66c-.893-2.691-.572-5.988.996-9.91 1.487-3.719 1.315-6.329 1.129-7.423.049.041.097.078.148.13 2.706 2.707 5.246 6.824 4.063 16.729-1.275-1.379-2.412-1.723-3.227-1.723-1.266 0-2.334.783-3.109 2.197z"/><path fill="#99AAB5" d="m29.168 13.25.061-.087C29 16 27.6 17.001 27 20c-.588 2.94-.477 5.519-.088 7.564-.84-.571-1.726-.874-2.656-.874-1.264 0-2.548.538-3.895 1.627C22 19 27 17 29.168 13.25zm-10.48-.144a.975.975 0 0 1-1.375 0l-.57-.571c-.378-.378-.25-.688.285-.688h1.945c.535 0 .664.309.285.688l-.57.571z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_ravens)"/><circle cx="30" cy="30" r="24" fill="url(#sh_ravens)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  cardinals: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_cardinals" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_cardinals" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_cardinals" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_cardinals)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#FFAC33" d="M24.88 33.097a.977.977 0 0 0-.418-.391C22.865 31 24 28.999 24 28.999c0-.553 1-2 0-2l-1 1c-1 1-1 4-1 4h-2a1 1 0 1 0 0 2h1.107l-.222.12a1 1 0 1 0 .952 1.759l2.639-1.427a.998.998 0 0 0 .404-1.354zm-7 0a.974.974 0 0 0-.417-.391C15.866 31 17 28.999 17 28.999c0-.553 1-2 0-2l-1 1c-1 1-1 4-1 4h-2a1 1 0 1 0 0 2h1.108l-.222.12a1 1 0 1 0 .952 1.759l2.639-1.427a.998.998 0 0 0 .403-1.354zM7.516 10c0 1.104-1.119 2-2.5 2s-3.5-1-3.5-2 2.119-2 3.5-2c1.38 0 2.5.896 2.5 2z"/><path fill="#DD2E44" d="M13.516 2c-2-1-3 1-3 1s0-3-3-3-3 3-3 3-3-.938-3 2c0 1.482 1.101 2.411 2.484 2.387V12c0 1 .263 3-.737 4s-2.484 4 .516 4 3-4 3-7c1 1 4 1 4-4 0-.867-.213-1.512-.55-2h1.287c4 0 4-4 2-5z"/><path fill="#E1E8ED" d="M32.516 9c4 10 0 22-13 22-7.732 0-13-6-14-11-1.177-5.883-1-8-1-12 0-2.738 2.118-4.824 5-4 7 2 5 10 12 10 10 0 8.23-11.923 11-5z"/><circle cx="7.516" cy="8" r="1" fill="#292F33"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_cardinals)"/><circle cx="30" cy="30" r="24" fill="url(#sh_cardinals)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  owls: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_owls" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_owls" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_owls" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_owls)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#662113" d="M7.317 11c-5.723 9.083.958 18 .958 18s2.874-.442 6.875-5.2c4-4.758-7.833-12.8-7.833-12.8zm21.342 0c5.723 9.083-.958 18-.958 18s-2.874-.442-6.875-5.2C16.825 19.042 28.659 11 28.659 11z"/><path fill="#FFAC33" d="M15.203 31.557a1.22 1.22 0 0 0-.531-.496c-2.032-2.172-.589-4.717-.589-4.717 0-.703 1.271-2.544 0-2.544l-1.272 1.272c-1.272 1.271-1.272 5.089-1.272 5.089H8.995a1.27 1.27 0 1 0 0 2.543h1.408l-.282.153a1.274 1.274 0 0 0 1.21 2.24l3.357-1.816a1.274 1.274 0 0 0 .515-1.724zm5.596 0c.123-.229.317-.384.53-.496 2.033-2.172.589-4.717.589-4.717 0-.703-1.271-2.544 0-2.544l1.272 1.272c1.273 1.271 1.273 5.089 1.273 5.089h2.544a1.27 1.27 0 0 1 1.271 1.272 1.27 1.27 0 0 1-1.271 1.271h-1.408l.281.153a1.273 1.273 0 1 1-1.211 2.24l-3.356-1.816a1.272 1.272 0 0 1-.514-1.724z"/><path fill="#662113" d="M28.278 11.292c2.891-6.092 0-10.542 0-10.542s-5.781.959-6.744 2.875c-1.219 2.424 6.744 7.667 6.744 7.667z"/><path fill="#662113" d="M29.562 12.738c0 10.297-3.152 20.595-11.562 20.595-8.409 0-11.563-10.298-11.563-20.595C6.437 2.44 11.614 2.083 18 2.083c6.387 0 11.562.357 11.562 10.655z"/><path fill="#C1694F" d="M27.666 17.738c0 10.297-7.774 14.595-9.666 14.595s-9.666-4.298-9.666-14.595c0-10.298 19.332-10.298 19.332 0z"/><path fill="#662113" d="M7.722 11.292C4.831 5.2 7.722.75 7.722.75s5.782.959 6.746 2.875c1.218 2.424-6.746 7.667-6.746 7.667z"/><path fill="#C1694F" d="M14.929 4.373C10.702 2.789 7.722.75 7.722.75s-2.076 3.221-.928 7.926c.446 2.137 1.94 4.195 3.904 4.662 2.637.627 7.302-.049 7.302-3.963 0-2.695-1.074-4.252-3.071-5.002zm6.142 0C25.298 2.789 28.277.75 28.277.75s2.076 3.221.928 7.926c-.445 2.137-1.939 4.195-3.902 4.662-2.638.627-7.303-.049-7.303-3.963 0-2.695 1.074-4.252 3.071-5.002z"/><path fill="#FFD983" d="M16.083 8.417a3.833 3.833 0 1 1-7.666 0 3.833 3.833 0 0 1 7.666 0zm11.5 0a3.833 3.833 0 1 1-7.666 0 3.833 3.833 0 0 1 7.666 0z"/><path fill="#292F33" d="M14.167 8.417a1.917 1.917 0 1 1-3.833 0 1.917 1.917 0 0 1 3.833 0zm11.5 0a1.917 1.917 0 1 1-3.833 0 1.917 1.917 0 0 1 3.833 0z"/><path fill="#FFCC4D" d="M20.875 12.729c0 2.382-2.875 3.354-2.875 3.354s-2.875-.973-2.875-3.354S18 9.375 18 9.375s2.875.972 2.875 3.354z"/><path fill="#F4900C" d="M20.875 12.729c0 2.382-2.875 3.354-2.875 3.354s-2.875-.973-2.875-3.354C16.323 13.927 18 14.167 18 14.167s1.677-.24 2.875-1.438z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_owls)"/><circle cx="30" cy="30" r="24" fill="url(#sh_owls)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  panthers: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_panthers" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_panthers" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_panthers" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_panthers)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#292F33" d="M10.478 22.439s.702 2.281-.337 7.993c-.186 1.025-.46 2.072-.599 2.93-1.757 0-1.851 2.002-1.478 2.002h2.094c1.337 0 2.971-3.334 3.854-7.961s-3.534-4.964-3.534-4.964zm13.042 3.702s2.272 1.22 2.188 4.081c-.033 1.131-.249 2.091-.355 3.024-1.832 0-1.839 1.985-1.305 1.985h1.856c.923 0 3.001-3.158 3.379-7.281.379-4.122-5.763-1.809-5.763-1.809z"/><path fill="#292F33" d="M36 8.447C36 3.525 31.859 1 27 1a1 1 0 1 0 0 2c1.804 0 6.717.934 6.717 5.447 0 2.881-1.567 5.462-3.77 5.982-.164-.073-.345-.104-.509-.192-7.239-3.917-13.457.902-15.226-.29-1.752-1.182-.539-3.255-2.824-5.243-.33-1.841-1.073-4.477-1.794-4.477-.549 0-1.265 1.825-1.74 3.656-.591-1.381-1.363-2.756-1.86-2.756-.64 0-1.278 2.273-1.594 4.235-1.68 1.147-2.906 2.809-2.906 4.765 0 2.7 4.05 3.357 5.4 3.411 1.35.054 3.023 3.562 3.585 5.072 1.242 4.367 2.051 8.699 2.698 11.183-1.649 0-1.804 2.111-1.348 2.111.713 0 1.953-.003 2.225 0 1.381.014 2.026-4.706 2.026-8.849 0-.212-.011-.627-.011-.627s1.93.505 6.038-.208c2.444-.424 5.03.849 5.746 3.163.527 1.704 1.399 3.305 1.868 4.484-1.589 0-1.545 2.037-1.084 2.037.787 0 1.801.014 2.183 0 1.468-.055.643-7.574 1.03-10.097s1.267-5.578-.229-8.797C34.857 15.236 36 11.505 36 8.447z"/><circle cx="5.994" cy="11.768" r=".9" fill="#C3C914"/><path fill="#66757F" d="M2.984 12.86c-.677.423-.677 1.777-1.015 1.777S.954 13.841.954 12.86c-.001-.981 2.862-.52 2.03 0zm3.594 1.483c-.041.026-.09.036-.142.026-.018-.004-1.548-.241-2.545.146-.129.05-.341-.023-.413-.191s.023-.365.152-.415c1.44-.569 2.857-.234 2.934-.218.139.029.195.19.188.372-.004.114-.104.235-.174.28zm-.472 2.339a.186.186 0 0 1-.141-.031c-.015-.01-1.331-.83-2.402-.853-.138-.003-.305-.154-.305-.341 0-.186.165-.335.304-.333 1.552.024 2.724.891 2.789.937.117.082.104.255.027.424-.049.107-.189.182-.272.197z"/><path fill="#7F676D" d="M7.854 7.881s.372-.039.859.033c.217-.46.585-.887.585-.887s.281.668.386 1.179c.025.12.218.117.322.189 0 0 .038-3.463-.863-3.836.001-.002-.755 1.124-1.289 3.322zM4.399 9.36s.384-.267.883-.574c.217-.624.568-1.333.568-1.333s.307.602.345.81c.21-.114.21-.106.403-.19 0 0-.114-2.286-1.099-2.527 0 0-.732 1.372-1.1 3.814z"/><path fill="#66757F" d="M18.45 23.644c-2.649.57-2.38 2.782-2.38 2.782s1.93.505 6.038-.208a5.542 5.542 0 0 1 3.107.377c-1.607-3.047-4.315-3.479-6.765-2.951z"/><path fill="#292F33" d="M5.976 10.982s.333.347.319.778c-.014.43-.25.833-.25.833s-.292-.347-.319-.826c-.027-.48.25-.785.25-.785z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_panthers)"/><circle cx="30" cy="30" r="24" fill="url(#sh_panthers)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  cougars: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_cougars" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_cougars" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_cougars" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_cougars)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#FFCC4D" d="M32.855 16.484A8.216 8.216 0 0 0 32 16c-2-1-5 0-9 0-2 0-4.901-3-10-3-.801 0-2.256.635-4.341.89C8.62 12.837 8.044 12 7.333 12 6.597 12 6 12.895 6 14c0 .051.007.1.01.15C3.19 14.916 0 18.589 0 20.375 0 22.375 2 24 2 24s1 0 3-2c1.581-1.581 5-1 5-1l1 12s-1 1-2 1-1 2-1 2h6l1-9h3c2 0 7-1 7-1 2 3 4 4 4 4v3l-2 1c-2 1-1 2-1 2h6s1-8 2-13v5a1 1 0 1 0 2 0v-7c0-2.666-1.357-3.928-3.145-4.516z"/><circle cx="4" cy="17" r="1" fill="#292F33"/><path fill="#292F33" d="M0 20s0 2 1 2c0-2 1-2 1-2s-1-1-2 0z"/><g fill="#F4900C"><circle cx="10.5" cy="16.5" r="2"/><circle cx="17.5" cy="16.5" r="2"/><circle cx="14.5" cy="21.5" r="2"/><circle cx="21.5" cy="23.5" r="2"/><circle cx="24.5" cy="18.5" r="2"/><circle cx="28.5" cy="23.5" r="2"/><circle cx="31.5" cy="18.5" r="2"/></g><g fill="#FFAC33"><circle cx="10.5" cy="16.5" r="1"/><circle cx="17.5" cy="16.5" r="1"/><circle cx="14.5" cy="21.5" r="1"/><circle cx="21.5" cy="23.5" r="1"/><circle cx="24.5" cy="18.5" r="1"/><circle cx="28.5" cy="23.5" r="1"/><circle cx="31.5" cy="18.5" r="1"/></g></g><circle cx="30" cy="30" r="24" fill="url(#sp_cougars)"/><circle cx="30" cy="30" r="24" fill="url(#sh_cougars)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  jaguars: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_jaguars" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_jaguars" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_jaguars" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_jaguars)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#31373D" d="M5 16c0-4-5-3-4 1s3 5 3 5l1-6zm26 0c0-4 5-3 4 1s-3 5-3 5l-1-6z"/><path fill="#31373D" d="M32.65 21.736c0 10.892-4.691 14.087-14.65 14.087-9.958 0-14.651-3.195-14.651-14.087S8.042.323 18 .323c9.959 0 14.65 10.521 14.65 21.413z"/><path fill="#66757F" d="M27.567 23c1.49-4.458 2.088-7.312-.443-7.312H8.876c-2.532 0-1.933 2.854-.444 7.312C3.504 34.201 17.166 34.823 18 34.823S32.303 33.764 27.567 23z"/><path fill="#31373D" d="M15 18.003a2 2 0 0 1-4 0c0-1.104.896-1 2-1s2-.105 2 1zm10 0a2 2 0 0 1-4 0c0-1.104.896-1 2-1s2-.105 2 1z"/><ellipse cx="15.572" cy="23.655" fill="#31373D" rx="1.428" ry="1"/><path fill="#31373D" d="M21.856 23.655c0 .553-.639 1-1.428 1-.79 0-1.429-.447-1.429-1 0-.553.639-1 1.429-1s1.428.448 1.428 1z"/><path fill="#99AAB5" d="M21.02 21.04c-1.965-.26-3.02.834-3.02.834s-1.055-1.094-3.021-.834c-3.156.417-3.285 3.287-1.939 3.105.766-.104.135-.938 1.713-1.556 1.579-.616 3.247.66 3.247.66s1.667-1.276 3.246-.659.947 1.452 1.714 1.556c1.346.181 1.218-2.689-1.94-3.106z"/><path fill="#31373D" d="M24.835 30.021c-1.209.323-3.204.596-6.835.596s-5.625-.272-6.835-.596c-3.205-.854-1.923-1.735 0-1.477 1.923.259 3.631.415 6.835.415 3.205 0 4.914-.156 6.835-.415 1.923-.258 3.204.623 0 1.477z"/><path fill="#66757F" d="M4.253 16.625c1.403-1.225-1.078-3.766-2.196-2.544-.341.373.921-.188 1.336 1.086.308.942.001 2.208.86 1.458zm27.493 0c-1.402-1.225 1.078-3.766 2.196-2.544.341.373-.921-.188-1.337 1.086-.306.942 0 2.208-.859 1.458z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_jaguars)"/><circle cx="30" cy="30" r="24" fill="url(#sh_jaguars)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  huskies: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_huskies" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_huskies" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_huskies" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_huskies)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#D99E82" d="M31.034 14.374c3.508-.65 3.587-6.297-.051-6.254-2.847.034-2.56 2.795-2.945 2.252-.748-1.055-.989-3.769 1.862-4.894 2.461-.971 5.846.996 6.063 4.591.139 2.302-1.297 6.554-6.453 5.846-7.222-.991-1.983-.892 1.524-1.541z"/><path fill="#C1694F" d="M10.321 21.935s1.016 2.352.676 8.242c-.061 1.057-.209 2.136-.242 3.022-1.812 0-1.652 2.064-1.268 2.064h2.902c.683 0 1.893-3.438 2.212-8.209.319-4.772-4.28-5.119-4.28-5.119zm11.89-.331s.575 3.528 3.651 6.413c.257 1.163.769 4.232.949 5.195-1.889 0-1.282 2.047-.731 2.047h2.646c.951 0 1.092-3.442.206-7.694-.885-4.251-6.721-5.961-6.721-5.961z"/><path fill="#D99E82" d="M32.202 15.654c-1.253-3.752-7.214-3.628-13.997-2.765-3.055.389-3.64-4.453-3.64-5.286 0-3.626-3.244-5.455-6.496-4.229-.779.293-1.402 1.33-1.754 1.872-1.977 3.037-4.658.015-4.917 2.822-.313 3.395 1.721 4.534 5.051 4.821 1.892.163 3.459 1.095 3.871 5.044.154 1.472-.295 5.644 2.388 7.076.78 2.959 1.836 6.615 2.25 8.475-2.252.476-1.341 2.179-1.341 2.179s3.151-.043 3.836-.043c.814 0 .191-5.976-.935-9.787 4.764.043 7.828-1.337 8.799-1.762 1.028 2.96 4.152 3.633 4.851 4.892.433.78 1.878 3.383 2.001 4.496-1.602.52-1.091 1.732-.909 2.122 1.083-.043 3.22-.043 3.498-.043 1.11 0-1.137-6.904-2.083-8.713-1.082-2.071.781-7.419-.473-11.171z"/><path fill="#F4C7B5" d="M16.266 24.464c.044.371.141.891.253 1.369 4.764.043 7.828-1.337 8.799-1.762-.215-.78-.23-1.27-.171-1.538-3.394.557-4.548 2.205-8.881 1.931zM6.449 12.889c1.892.163 2.425 1.069 2.838 5.018.154 1.472.739 5.67 3.421 7.102-.72-2.788-1.959-12.388-6.259-12.12z"/><path fill="#F4C7B5" d="M3.153 6.665c-2.793 0-1.909.526-2.002 1.692-.093 1.166-.074 2.976.776 3.929 1.127 1.262 3.858 1.266 5.215.277s-.424-5.898-3.989-5.898z"/><path fill="#272B2B" d="M2.503 8.326c-.109.762-.494 1.192-.879 1.133C.864 9.342.232 8.372.232 7.603s.624-.963 1.392-.928c1.043.048 1.002.788.879 1.651z"/><path fill="#662113" d="M15.167 9.026c.348 2.515-1.157 2.898-2.383 2.898s-3.054-1.25-2.748-3.77c.134-1.107.555-2.193.809-3.175.336-1.303 1.199-1.732 1.894-1.367 1.665.874 2.203 3.797 2.428 5.414z"/><circle cx="8.069" cy="6.675" r=".928" fill="#292F33"/><path fill="#C1694F" d="M19.035 12.789c.073 1.532.906 3.178 2.733 3.663 1.901.505 4.12.127 4.67-2.475.091-.43.13-1.224.073-1.514-2.151-.179-4.73 0-7.476.326z"/><circle cx="3.053" cy="10.503" r=".488" fill="#D99E82"/><circle cx="3.695" cy="9.804" r=".269" fill="#D99E82"/><circle cx="4.1" cy="10.503" r=".269" fill="#D99E82"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_huskies)"/><circle cx="30" cy="30" r="24" fill="url(#sh_huskies)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  bulldogs: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_bulldogs" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_bulldogs" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_bulldogs" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_bulldogs)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#D99E82" d="M31.034 14.374c3.508-.65 3.587-6.297-.051-6.254-2.847.034-2.56 2.795-2.945 2.252-.748-1.055-.989-3.769 1.862-4.894 2.461-.971 5.846.996 6.063 4.591.139 2.302-1.297 6.554-6.453 5.846-7.222-.991-1.983-.892 1.524-1.541z"/><path fill="#C1694F" d="M10.321 21.935s1.016 2.352.676 8.242c-.061 1.057-.209 2.136-.242 3.022-1.812 0-1.652 2.064-1.268 2.064h2.902c.683 0 1.893-3.438 2.212-8.209.319-4.772-4.28-5.119-4.28-5.119zm11.89-.331s.575 3.528 3.651 6.413c.257 1.163.769 4.232.949 5.195-1.889 0-1.282 2.047-.731 2.047h2.646c.951 0 1.092-3.442.206-7.694-.885-4.251-6.721-5.961-6.721-5.961z"/><path fill="#D99E82" d="M32.202 15.654c-1.253-3.752-7.214-3.628-13.997-2.765-3.055.389-3.64-4.453-3.64-5.286 0-3.626-3.244-5.455-6.496-4.229-.779.293-1.402 1.33-1.754 1.872-1.977 3.037-4.658.015-4.917 2.822-.313 3.395 1.721 4.534 5.051 4.821 1.892.163 3.459 1.095 3.871 5.044.154 1.472-.295 5.644 2.388 7.076.78 2.959 1.836 6.615 2.25 8.475-2.252.476-1.341 2.179-1.341 2.179s3.151-.043 3.836-.043c.814 0 .191-5.976-.935-9.787 4.764.043 7.828-1.337 8.799-1.762 1.028 2.96 4.152 3.633 4.851 4.892.433.78 1.878 3.383 2.001 4.496-1.602.52-1.091 1.732-.909 2.122 1.083-.043 3.22-.043 3.498-.043 1.11 0-1.137-6.904-2.083-8.713-1.082-2.071.781-7.419-.473-11.171z"/><path fill="#F4C7B5" d="M16.266 24.464c.044.371.141.891.253 1.369 4.764.043 7.828-1.337 8.799-1.762-.215-.78-.23-1.27-.171-1.538-3.394.557-4.548 2.205-8.881 1.931zM6.449 12.889c1.892.163 2.425 1.069 2.838 5.018.154 1.472.739 5.67 3.421 7.102-.72-2.788-1.959-12.388-6.259-12.12z"/><path fill="#F4C7B5" d="M3.153 6.665c-2.793 0-1.909.526-2.002 1.692-.093 1.166-.074 2.976.776 3.929 1.127 1.262 3.858 1.266 5.215.277s-.424-5.898-3.989-5.898z"/><path fill="#272B2B" d="M2.503 8.326c-.109.762-.494 1.192-.879 1.133C.864 9.342.232 8.372.232 7.603s.624-.963 1.392-.928c1.043.048 1.002.788.879 1.651z"/><path fill="#662113" d="M15.167 9.026c.348 2.515-1.157 2.898-2.383 2.898s-3.054-1.25-2.748-3.77c.134-1.107.555-2.193.809-3.175.336-1.303 1.199-1.732 1.894-1.367 1.665.874 2.203 3.797 2.428 5.414z"/><circle cx="8.069" cy="6.675" r=".928" fill="#292F33"/><path fill="#C1694F" d="M19.035 12.789c.073 1.532.906 3.178 2.733 3.663 1.901.505 4.12.127 4.67-2.475.091-.43.13-1.224.073-1.514-2.151-.179-4.73 0-7.476.326z"/><circle cx="3.053" cy="10.503" r=".488" fill="#D99E82"/><circle cx="3.695" cy="9.804" r=".269" fill="#D99E82"/><circle cx="4.1" cy="10.503" r=".269" fill="#D99E82"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_bulldogs)"/><circle cx="30" cy="30" r="24" fill="url(#sh_bulldogs)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  vipers: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_vipers" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_vipers" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_vipers" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_vipers)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#DD2E44" d="M11.84 7.634c-.719 0-2.295 2.243-3.567 1.029-.44-.419 1.818-1.278 1.727-2.017-.075-.607-2.842-1.52-1.875-2.099.967-.578 2.418.841 3.513.866 2.382.055 4.212-.853 4.238-.866a1.082 1.082 0 0 1 1.464.496c.27.547.051 1.213-.488 1.486-.131.066-2.225 1.105-5.012 1.105z"/><path fill="#77B255" d="M27.818 36c-3.967 0-8.182-2.912-8.182-8.308 0-1.374-.89-1.661-1.637-1.661-.746 0-1.636.287-1.636 1.661 0 5.396-4.216 8.308-8.182 8.308S0 33.23 0 27.692C0 14.4 14.182 12.565 14.182 14.4c0 1.835-7.636-1.107-7.636 12.185 0 2.215.89 2.769 1.636 2.769.747 0 1.637-.287 1.637-1.661 0-5.395 4.215-8.308 8.182-8.308 3.966 0 8.182 2.912 8.182 8.308 0 1.374.89 1.661 1.637 1.661s1.636-.287 1.636-1.661V11.077c0-3.855-3.417-4.431-5.454-4.431 0 0-3.272 1.108-6.545 1.108s-4.364-2.596-4.364-4.431C13.091 1.488 17.455 0 24 0c6.546 0 12 4.451 12 11.077v16.615C36 33.088 31.784 36 27.818 36z"/><circle cx="19" cy="3" r="1" fill="#292F33"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_vipers)"/><circle cx="30" cy="30" r="24" fill="url(#sh_vipers)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  cobras: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_cobras" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_cobras" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_cobras" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_cobras)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#583529" d="M18.72 26.403c-.467 2.46 1.725 5.179 1.725 5.179s-.424-3.209.806-4.842c.847-1.126.247-2.372-.451-2.466-.7-.093-1.817.745-2.08 2.129z"/><path fill="#583529" d="M15.625 26.48c-2.522 1.884-4.935.761-6.144-1.08C8.274 23.558 7 24.61 8.2 26.604c1.199 1.992 4.824 4.955 9.171 1.585 3.299-2.554-.959-2.296-1.746-1.709z"/><path fill="#7C533E" d="M9.639 26.106C8.07 28.335 3.92 27.8 2.316 24.095c-1.55-3.582-.344-6.84.463-7.849.329-.41-.512 4.813 2.237 6.252 1.205.63-2.445-3.399-.695-7.133.525-1.12-.049 3.787 3.263 5.195 1.445.614 4.356 2.281 2.055 5.546zm2.675-4.273c.594-.753 1.641-1.554 8.499-1.554 5.125 0 6.58-2.417 8.287-3.02 5.838-2.061 3.757 11.752-5.972 11.752-9.73.001-11.612-6.168-10.814-7.178z"/><path fill="#7C533E" d="M23.172 20.081c6.388-1.071 8.032-8.666 5.911-12.581-1.99-3.674-6.98-5.397-11.153-1.958.159 1.028.505 5.625-3.341 6.183 1.227-2.514-2.538-4.374-1.394-7.633 1.146-3.259 4.257-2.477 4.523-1.631 3.157-2.543 7.24-2.793 8.832-1.21 4.747.042 7.714 3.234 7.712 5.582 2.738 2.729 1.372 9.473.226 10.217.512 4.034-.661 7.755-5.112 9.043-.769.223-11.916-5.054-6.204-6.012z"/><path fill="#AF7E57" d="M18.013 25.546c-1.06 1.73-2.948 2.413-4.773 2.201-2.481-.287-2.49 1.587.117 1.991 1.498.232 3.868.012 5.635-1.425 2.247-1.829-.369-3.769-.979-2.767z"/><path fill="#AF7E57" d="M13.97 28.123c.798 2.984-2.683 6.209-7.073 4.911-4.244-1.255-6.203-4.67-6.493-6.106-.117-.583 3.816 3.943 7.065 2.597 1.423-.59-4.735-.345-6.713-4.58-.593-1.269 3.259 2.795 6.891.938 1.587-.812 5.151-2.134 6.323 2.24z"/><path fill="#292F33" d="M17.066 22.725a1.275 1.275 0 1 1-2.55 0 1.275 1.275 0 0 1 2.55 0z"/><path fill="#AF7E57" d="M30.741 25.573c1.428 2.058.53 5.433.53 5.433s-.917-3.104-2.705-4.096c-1.231-.685-1.19-2.067-.59-2.437.602-.369 1.962-.058 2.765 1.1zm-2.846 1.579c1.113 2.243-.265 5.452-.265 5.452s-.457-3.204-2.081-4.445c-1.119-.856-.878-2.218-.23-2.496.648-.279 1.95.227 2.576 1.489zm-3.283 1.085c.468 2.46-1.725 5.179-1.725 5.179s.424-3.209-.806-4.842c-.848-1.126-.247-2.372.451-2.466.701-.093 1.819.745 2.08 2.129z"/><path fill="#583529" d="M29.5 14.325c-.229-.013-1.15 1.68-1.082 2.023.226 1.132 4.854 1.277 6.07.702.907-.428 1.383-2.55 1.261-3.529-2.024 1-5.739.833-6.249.804zm3.567-10.287c-.208 1.04-2.927 2.868-4.142 3.139-.188.042.386 1.495.705 1.685.32.19 4.456-1.02 4.631-2.031.098-.565-.23-2.237-1.194-2.793zM26.55 1.25c-.001-.226-.785-1.018-2.098-.93.423 1.477-.405 2.898-.814 3.413-.136.171 1.449.508 1.687.429.427-.142 1.228-1.766 1.225-2.912z"/><path fill="#292F33" d="M17.896 2.458c-.542-1.097-2.417-1.437-3.792-.062s-1.646 3.167-.792 4.958c.854 1.792 1.854 2.938 1.062 4.5 2.042-.271 3.279-2.199 3.625-3.167.626-1.749.751-4.499-.103-6.229z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_cobras)"/><circle cx="30" cy="30" r="24" fill="url(#sh_cobras)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  gators: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_gators" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_gators" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_gators" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_gators)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#3E721D" d="M19 32c0 1-1.723 3-3.334 3C14.056 35 14 33.657 14 32s1.306-3 2.916-3C18.527 29 19 30.343 19 32zm11 0c0 1-1.723 3-3.334 3C25.056 35 25 33.657 25 32s1.306-3 2.916-3C29.527 29 30 30.343 30 32z"/><path fill="#5C913B" d="M36 25c0-6-3.172-9.171-6-12-1-1-1.399.321-1 1 .508.862 3 8-2 8h-2c-5 0-6.172-1.172-9-4-4.5-4.5-7 0-9 0-6 0-7-1.812-7 2 0 3 3 4 6 4s3 1 5 4c1.071 1.606 2.836 3.211 5.023 4.155.232 1.119 2.774 3.845 4.311 3.845C21.944 36 22 34.657 22 33h5c.034 0 .066-.01.101-.01.291.005.587.01.899.01 0 1 1.723 3 3.334 3C32.944 36 33 34.657 33 33c0-.302-.057-.587-.137-.861C34.612 31.193 36 29.209 36 25z"/><path fill="#292F33" d="M10 18.123a1.5 1.5 0 1 0 3 0c0-.829-.671 0-1.5 0s-1.5-.829-1.5 0z"/><g fill="#77B255"><ellipse cx="27.5" cy="24" rx="1.5" ry="1"/><ellipse cx="23.5" cy="24" rx="1.5" ry="1"/><ellipse cx="19.5" cy="24" rx="1.5" ry="1"/><ellipse cx="21.5" cy="26" rx="1.5" ry="1"/><ellipse cx="25.5" cy="26" rx="1.5" ry="1"/></g><path fill="#FFF" d="M6 22c-.389 0-1-1-1-1h2s-.611 1-1 1zm-2 .469C3.611 22.469 3 21 3 21h2s-.611 1.469-1 1.469zM2 23c-.389 0-1-2-1-2h2s-.611 2-1 2z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_gators)"/><circle cx="30" cy="30" r="24" fill="url(#sh_gators)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  mustangs: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_mustangs" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_mustangs" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_mustangs" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_mustangs)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#292F33" d="M28.721 12.849s3.809 1.643 5.532.449c1.723-1.193 2.11-2.773 1.159-4.736-.951-1.961-3.623-2.732-3.712-5.292 0 0-.298 4.141 1.513 5.505 2.562 1.933-.446 4.21-3.522 3.828-3.078-.382-.97.246-.97.246z"/><path fill="#8A4B38" d="M23.875 19.375s-.628 2.542.187 5.03c.145.341.049.556-.208.678-.256.122-4.294 1.542-4.729 1.771-.396.208-1.142 1.78-1.208 2.854.844.218 1.625.104 1.625.104s.025-1.915.208-2.042c.183-.127 5.686-1.048 6.062-1.771s1.611-3.888.812-5.292c-.225-.395-.637-1.15-.637-1.15l-2.112-.182z"/><path fill="#292F33" d="M17.917 29.708s-.616 1.993.008 2.138c.605.141 1.694-.388 1.755-.646.081-.343.216-1.179.098-1.366-.118-.186-1.861-.126-1.861-.126z"/><path fill="#8A4B38" d="m11.812 21.875-.75-2.562s-2.766 2.105-3.938 3.594c-.344.437-1.847 3.198-1.722 4.413.05.488.474 2.583.474 2.583l1.651-.465s-1.312-1.896-1.021-2.562c1.428-3.263 5.306-5.001 5.306-5.001z"/><path fill="#292F33" d="M7.679 29.424c-.172-.139-1.803.479-1.803.479s.057 2.085.695 2.022c.618-.061 1.48-.912 1.455-1.175-.034-.351-.175-1.187-.347-1.326z"/><path fill="#C1694F" d="M27.188 11.188c-3.437.156-7.207.438-9.5.438-3.655 0-5.219-1.428-6.562-2.625C8.838 6.964 8.167 4.779 6 5.501c0 0-.632-.411-1.247-.778l-.261-.152a7.231 7.231 0 0 0-.656-.347c-.164-.072-.258-.087-.228-.01.019.051.093.143.236.286.472.472.675.95.728 1.395-2.01 1.202-2.093 2.276-2.871 3.552-.492.807-1.36 2.054-1.56 2.515-.412.948 1.024 2.052 1.706 1.407.893-.845.961-1.122 2.032-1.744.983-.016 1.975-.416 2.308-1.02 0 0 .938 2.083 1.938 3.583s2.5 3.125 2.5 3.125c-.131 1.227.12 2.176.549 2.922-.385.757-.924 1.807-1.417 2.745-.656 1.245-1.473 3.224-1.208 3.618.534.798 2.719 2.926 4.137 3.311 1.03.28 2.14.437 2.14.437l-.193-1.574s-1.343.213-1.875-.083c-1.427-.795-2.666-2.248-2.708-2.542-.07-.487 3.841-2.868 5.14-3.645 2.266.097 6.022-.369 8.626-1.702.958 1.86 2.978 2.513 2.978 2.513s.667 2.208 1.375 4.125c-1.017.533-4.468 3.254-4.975 3.854-.456.54-.856 2.49-.856 2.49.82.375 1.57.187 1.57.187s.039-1.562.385-2.073c.346-.511 4.701-2.559 5.958-3.458.492-.352.404-.903.262-1.552-.321-1.471-.97-4.781-.971-4.782 5.146-2.979 6.458-11.316-2.354-10.916z"/><path fill="#292F33" d="M22.336 33.782s-.616 1.993.008 2.138c.605.141 1.694-.388 1.755-.646.081-.343.216-1.179.098-1.366-.118-.187-1.861-.126-1.861-.126zm-7.676-5.296c-.167.146.164 1.859.164 1.859s2.064.299 2.111-.34c.045-.62-.647-1.614-.91-1.634-.351-.027-1.198-.031-1.365.115z"/><circle cx="4.25" cy="8.047" r=".349" fill="#292F33"/><path fill="#292F33" d="M12.655 9.07c1.773 1.446 3.147.322 3.147.322-1.295-.271-2.056-.867-2.708-1.562.835-.131 1.287-.666 1.287-.666-1.061-.013-1.824-.3-2.485-.699-.565-.614-1.233-1.202-2.254-1.631a4.926 4.926 0 0 0-.922-.276c-.086-.025-.178-.063-.258-.073a4.125 4.125 0 0 0-2.737.603c-.322.2-.214.639.117.623 1.741-.085 2.866.582 3.47 1.633 2.169 3.772 5.344 3.875 5.344 3.875s-1.29-.688-2.001-2.149z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_mustangs)"/><circle cx="30" cy="30" r="24" fill="url(#sh_mustangs)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  stallions: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_stallions" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_stallions" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_stallions" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_stallions)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#292F33" d="M28.721 12.849s3.809 1.643 5.532.449c1.723-1.193 2.11-2.773 1.159-4.736-.951-1.961-3.623-2.732-3.712-5.292 0 0-.298 4.141 1.513 5.505 2.562 1.933-.446 4.21-3.522 3.828-3.078-.382-.97.246-.97.246z"/><path fill="#8A4B38" d="M23.875 19.375s-.628 2.542.187 5.03c.145.341.049.556-.208.678-.256.122-4.294 1.542-4.729 1.771-.396.208-1.142 1.78-1.208 2.854.844.218 1.625.104 1.625.104s.025-1.915.208-2.042c.183-.127 5.686-1.048 6.062-1.771s1.611-3.888.812-5.292c-.225-.395-.637-1.15-.637-1.15l-2.112-.182z"/><path fill="#292F33" d="M17.917 29.708s-.616 1.993.008 2.138c.605.141 1.694-.388 1.755-.646.081-.343.216-1.179.098-1.366-.118-.186-1.861-.126-1.861-.126z"/><path fill="#8A4B38" d="m11.812 21.875-.75-2.562s-2.766 2.105-3.938 3.594c-.344.437-1.847 3.198-1.722 4.413.05.488.474 2.583.474 2.583l1.651-.465s-1.312-1.896-1.021-2.562c1.428-3.263 5.306-5.001 5.306-5.001z"/><path fill="#292F33" d="M7.679 29.424c-.172-.139-1.803.479-1.803.479s.057 2.085.695 2.022c.618-.061 1.48-.912 1.455-1.175-.034-.351-.175-1.187-.347-1.326z"/><path fill="#C1694F" d="M27.188 11.188c-3.437.156-7.207.438-9.5.438-3.655 0-5.219-1.428-6.562-2.625C8.838 6.964 8.167 4.779 6 5.501c0 0-.632-.411-1.247-.778l-.261-.152a7.231 7.231 0 0 0-.656-.347c-.164-.072-.258-.087-.228-.01.019.051.093.143.236.286.472.472.675.95.728 1.395-2.01 1.202-2.093 2.276-2.871 3.552-.492.807-1.36 2.054-1.56 2.515-.412.948 1.024 2.052 1.706 1.407.893-.845.961-1.122 2.032-1.744.983-.016 1.975-.416 2.308-1.02 0 0 .938 2.083 1.938 3.583s2.5 3.125 2.5 3.125c-.131 1.227.12 2.176.549 2.922-.385.757-.924 1.807-1.417 2.745-.656 1.245-1.473 3.224-1.208 3.618.534.798 2.719 2.926 4.137 3.311 1.03.28 2.14.437 2.14.437l-.193-1.574s-1.343.213-1.875-.083c-1.427-.795-2.666-2.248-2.708-2.542-.07-.487 3.841-2.868 5.14-3.645 2.266.097 6.022-.369 8.626-1.702.958 1.86 2.978 2.513 2.978 2.513s.667 2.208 1.375 4.125c-1.017.533-4.468 3.254-4.975 3.854-.456.54-.856 2.49-.856 2.49.82.375 1.57.187 1.57.187s.039-1.562.385-2.073c.346-.511 4.701-2.559 5.958-3.458.492-.352.404-.903.262-1.552-.321-1.471-.97-4.781-.971-4.782 5.146-2.979 6.458-11.316-2.354-10.916z"/><path fill="#292F33" d="M22.336 33.782s-.616 1.993.008 2.138c.605.141 1.694-.388 1.755-.646.081-.343.216-1.179.098-1.366-.118-.187-1.861-.126-1.861-.126zm-7.676-5.296c-.167.146.164 1.859.164 1.859s2.064.299 2.111-.34c.045-.62-.647-1.614-.91-1.634-.351-.027-1.198-.031-1.365.115z"/><circle cx="4.25" cy="8.047" r=".349" fill="#292F33"/><path fill="#292F33" d="M12.655 9.07c1.773 1.446 3.147.322 3.147.322-1.295-.271-2.056-.867-2.708-1.562.835-.131 1.287-.666 1.287-.666-1.061-.013-1.824-.3-2.485-.699-.565-.614-1.233-1.202-2.254-1.631a4.926 4.926 0 0 0-.922-.276c-.086-.025-.178-.063-.258-.073a4.125 4.125 0 0 0-2.737.603c-.322.2-.214.639.117.623 1.741-.085 2.866.582 3.47 1.633 2.169 3.772 5.344 3.875 5.344 3.875s-1.29-.688-2.001-2.149z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_stallions)"/><circle cx="30" cy="30" r="24" fill="url(#sh_stallions)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  broncos: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_broncos" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_broncos" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_broncos" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_broncos)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#292F33" d="M28.721 12.849s3.809 1.643 5.532.449c1.723-1.193 2.11-2.773 1.159-4.736-.951-1.961-3.623-2.732-3.712-5.292 0 0-.298 4.141 1.513 5.505 2.562 1.933-.446 4.21-3.522 3.828-3.078-.382-.97.246-.97.246z"/><path fill="#8A4B38" d="M23.875 19.375s-.628 2.542.187 5.03c.145.341.049.556-.208.678-.256.122-4.294 1.542-4.729 1.771-.396.208-1.142 1.78-1.208 2.854.844.218 1.625.104 1.625.104s.025-1.915.208-2.042c.183-.127 5.686-1.048 6.062-1.771s1.611-3.888.812-5.292c-.225-.395-.637-1.15-.637-1.15l-2.112-.182z"/><path fill="#292F33" d="M17.917 29.708s-.616 1.993.008 2.138c.605.141 1.694-.388 1.755-.646.081-.343.216-1.179.098-1.366-.118-.186-1.861-.126-1.861-.126z"/><path fill="#8A4B38" d="m11.812 21.875-.75-2.562s-2.766 2.105-3.938 3.594c-.344.437-1.847 3.198-1.722 4.413.05.488.474 2.583.474 2.583l1.651-.465s-1.312-1.896-1.021-2.562c1.428-3.263 5.306-5.001 5.306-5.001z"/><path fill="#292F33" d="M7.679 29.424c-.172-.139-1.803.479-1.803.479s.057 2.085.695 2.022c.618-.061 1.48-.912 1.455-1.175-.034-.351-.175-1.187-.347-1.326z"/><path fill="#C1694F" d="M27.188 11.188c-3.437.156-7.207.438-9.5.438-3.655 0-5.219-1.428-6.562-2.625C8.838 6.964 8.167 4.779 6 5.501c0 0-.632-.411-1.247-.778l-.261-.152a7.231 7.231 0 0 0-.656-.347c-.164-.072-.258-.087-.228-.01.019.051.093.143.236.286.472.472.675.95.728 1.395-2.01 1.202-2.093 2.276-2.871 3.552-.492.807-1.36 2.054-1.56 2.515-.412.948 1.024 2.052 1.706 1.407.893-.845.961-1.122 2.032-1.744.983-.016 1.975-.416 2.308-1.02 0 0 .938 2.083 1.938 3.583s2.5 3.125 2.5 3.125c-.131 1.227.12 2.176.549 2.922-.385.757-.924 1.807-1.417 2.745-.656 1.245-1.473 3.224-1.208 3.618.534.798 2.719 2.926 4.137 3.311 1.03.28 2.14.437 2.14.437l-.193-1.574s-1.343.213-1.875-.083c-1.427-.795-2.666-2.248-2.708-2.542-.07-.487 3.841-2.868 5.14-3.645 2.266.097 6.022-.369 8.626-1.702.958 1.86 2.978 2.513 2.978 2.513s.667 2.208 1.375 4.125c-1.017.533-4.468 3.254-4.975 3.854-.456.54-.856 2.49-.856 2.49.82.375 1.57.187 1.57.187s.039-1.562.385-2.073c.346-.511 4.701-2.559 5.958-3.458.492-.352.404-.903.262-1.552-.321-1.471-.97-4.781-.971-4.782 5.146-2.979 6.458-11.316-2.354-10.916z"/><path fill="#292F33" d="M22.336 33.782s-.616 1.993.008 2.138c.605.141 1.694-.388 1.755-.646.081-.343.216-1.179.098-1.366-.118-.187-1.861-.126-1.861-.126zm-7.676-5.296c-.167.146.164 1.859.164 1.859s2.064.299 2.111-.34c.045-.62-.647-1.614-.91-1.634-.351-.027-1.198-.031-1.365.115z"/><circle cx="4.25" cy="8.047" r=".349" fill="#292F33"/><path fill="#292F33" d="M12.655 9.07c1.773 1.446 3.147.322 3.147.322-1.295-.271-2.056-.867-2.708-1.562.835-.131 1.287-.666 1.287-.666-1.061-.013-1.824-.3-2.485-.699-.565-.614-1.233-1.202-2.254-1.631a4.926 4.926 0 0 0-.922-.276c-.086-.025-.178-.063-.258-.073a4.125 4.125 0 0 0-2.737.603c-.322.2-.214.639.117.623 1.741-.085 2.866.582 3.47 1.633 2.169 3.772 5.344 3.875 5.344 3.875s-1.29-.688-2.001-2.149z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_broncos)"/><circle cx="30" cy="30" r="24" fill="url(#sh_broncos)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  rams: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_rams" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_rams" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_rams" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_rams)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#292F33" d="M25 35c-2.75 0-2-6-2-6 0-1.104 2.646-2 3.75-2S30 26.896 30 28c0 0-2.25 7-5 7z"/><path fill="#66757F" d="M28 36c-2.75 0-2-6-2-6 0-1.104 2.646-2 3.75-2S33 27.896 33 29c0 0-2.25 7-5 7z"/><path fill="#292F33" d="M14 35c-2.75 0-4-6-4-6 0-1.104 2.646-2 3.75-2S17 26.896 17 28c0 0-.25 7-3 7z"/><path fill="#66757F" d="M17 36c-2.75 0-4-6-4-6 0-1.104 2.646-2 3.75-2S20 27.896 20 29c0 0-.25 7-3 7z"/><path fill="#E1E8ED" d="M35.75 21.384c0 7.782-4.495 11.408-14.519 11.408-10.023 0-13.481-3.626-13.481-11.408 0-7.783 3.458-11.407 13.481-11.407 10.024 0 14.519 3.624 14.519 11.407z"/><path fill="#99AAB5" d="M17 17.667C17 27 12.345 29 8.042 29 3.738 29 1 22.36 1 17.667 1 12.973 3.738 12 8.042 12c4.303 0 8.958.973 8.958 5.667z"/><circle cx="4.5" cy="20.5" r="1.5" fill="#292F33"/><path fill="#E1E8ED" d="M15.75 12.75C14 16 13.622 15.356 8.622 17.356 5.545 18.587 0 18.25 0 13.5 0 11.567 3.687 11 7 11c3.314 0 10.409-1.332 8.75 1.75z"/><path fill="#FFCC4D" d="M16 13.696c3.353 2.427 5.43 6.139 3.724 11.089-1.367 3.967-6.816 3.115-9.616 1.127-2.799-1.988-2.643-4.792-1.733-6.291.909-1.497 4.158-1.229 6.024.097.934.663.287 1.559-.721 1.068-2.292-1.118-3.037 1.443-1.246 2.882 1.266 1.016 3.275 1.049 3.655-1.01.671-3.63-3.505-6.274-7.465-5.302C11 16 13.161 11.641 16 13.696z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_rams)"/><circle cx="30" cy="30" r="24" fill="url(#sh_rams)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  bison: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_bison" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_bison" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_bison" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_bison)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#C1694F" d="M33.912 14.37C33.883 13.35 32.276 12.308 30 11S17.039 5.534 10.763 7.791C8.701 8.533 9.129 11 8.565 11c-1 0-2.732-.344-4.958-.127C1.351 11.094.691 12.561.691 15s.558 7.98 1.87 9.525c1.653 1.947 5.849 1.954 6.752-.673.686.122 1.12.178 1.815 1.067C13.248 29.325 14.048 36 15 36c.964 0 2.529-4.409 2.913-7l9.124-1.448C27.184 30.032 27.808 36 29 36c1.016 0 3.24-4.883 4.347-12.238.315-1.625.532-3.697.615-6.319.023.17.038.352.038.557v8a1 1 0 1 0 2 0v-8c0-1.807-.749-3.053-2.088-3.63z"/><path fill="#662113" d="M1.063 19.629s-1.925-6.816.083-9.086 7.727 0 7.727 0-.187-2.972 1.588-3.592S19.279 5.259 27.359 9.8c-3.398.867-4.306 2.56-3.935 6.358S22.48 28.417 18 29.529s-7.978.4-8.687-5.677 1.033-8.39-1.325-10.106c-6.316-.909-6.925 5.883-6.925 5.883z"/><circle cx="7" cy="18" r="1" fill="#292F33"/><path fill="#D99E82" d="M3.69 22.213c0 1.094.296 1.789-.798 1.789S.91 22.956.718 21.828c-.184-1.079.612-.978 1.706-.978s1.266.268 1.266 1.363z"/><path fill="#99AAB5" d="M7.474 13.216c1.739-.554 2.791-2.421 2.329-4.073-.218-.78-1.275-2.379-1.854-2.194s1.597 3.135-1.793 4.133c-1.168.344.158 2.504 1.318 2.134z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_bison)"/><circle cx="30" cy="30" r="24" fill="url(#sh_bison)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  warriors: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_warriors" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_warriors" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_warriors" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_warriors)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#9AAAB4" d="M23.378 19.029C22.67 19.736 16.305 31.757.75 36c1.414-1.415 19.54-21.691 19.54-21.691l3.088 4.72z"/><path fill="#CCD6DD" d="M17.72 13.371C17.013 14.078 4.992 20.444.75 36l21.213-21.214-4.243-1.415z"/><path fill="#D99E82" d="M20.549 11.957c-.781.781-.655 2.174.283 3.112l.848.849c.938.937 2.33 1.063 3.112.282l7.778-7.778c.781-.781.654-2.174-.283-3.111l-.848-.848c-.938-.938-2.331-1.064-3.111-.283l-7.779 7.777z"/><path fill="#BF6952" d="m28.892 12.1-7.071-1.414-1.271 1.271c-.133.133-.23.288-.311.452l6.954 1.391 1.699-1.7zm-7.212 3.818c.938.938 2.331 1.063 3.112.282l.826-.826-5.328-1.065c.131.27.312.529.543.76l.847.849zm8.911-5.518 1.7-1.699-7.071-1.414-1.7 1.699zm2.423-3.793a2.704 2.704 0 0 0-.727-1.297l-.848-.848a2.87 2.87 0 0 0-.325-.275l-2.11-.422c-.252.084-.483.22-.676.414l-1.242 1.242 5.928 1.186z"/><circle cx="31.858" cy="4.896" r="4" fill="#8A4633"/><path fill="#FFAC33" d="M16.306 9.836a1.5 1.5 0 0 1 2.121 0l8.839 8.839a1.5 1.5 0 1 1-2.121 2.121l-8.839-8.839a1.5 1.5 0 0 1 0-2.121z"/><circle cx="27.266" cy="20.796" r="2.5" fill="#FFAC33"/><circle cx="16.306" cy="9.836" r="2.5" fill="#FFAC33"/><circle cx="27.266" cy="20.796" r="1.5" fill="#FFCC4D"/><circle cx="16.306" cy="9.836" r="1.5" fill="#FFCC4D"/><path fill="#FFAC33" d="M26.566 3.803a1.066 1.066 0 0 1 1.509 0l4.865 4.866a1.066 1.066 0 1 1-1.509 1.509l-4.865-4.866a1.066 1.066 0 0 1 0-1.509z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_warriors)"/><circle cx="30" cy="30" r="24" fill="url(#sh_warriors)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  spartans: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_spartans" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_spartans" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_spartans" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_spartans)" transform="translate(7.0,5.0) scale(1.2778)"><g fill="#FFCC4D"><path d="m7 22.266-.01.001.01.003zm22.062.004.01-.003-.01-.001z"/><path d="M35.905 19.613c-1.774 1.072-3.839 1.977-6.833 2.653.017.002.082.009.046.02-.268.068-.411.135-.687.197-1.046.204-2.587.296-2.08-1.095l2.131-2.906L29 19l4.5-4.5L29 10l-4.5 4.5 2.551 2.551-2.221 3.029-.002-.002c-1.672 2-4.781 1.328-4.781-1.078H20v-6l5.5-5.5L18 0l-7.5 7.5L16 13v6.19c-.164 2.246-3.14 2.832-4.766.888l-.002.002-2.248-3.065L11.5 14.5 7 10l-4.5 4.5L7 19l.554-.554 2.157 2.942c.507 1.391-1.034 1.299-2.081 1.095-.274-.062-.418-.129-.686-.197-.036-.011.028-.017.045-.02-2.994-.676-5.058-1.581-6.833-2.653-.008.151-.095.301-.095.455 0 3.481 6.245 10.923 14.623 12.586L18 35.984l3.346-3.33C29.725 30.991 36 23.55 36 20.068c0-.154-.087-.303-.095-.455z"/></g></g><circle cx="30" cy="30" r="24" fill="url(#sp_spartans)"/><circle cx="30" cy="30" r="24" fill="url(#sh_spartans)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  titans: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_titans" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_titans" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_titans" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_titans)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#292F33" d="M19.083 35.5 12.25 12.292s-1.42.761-2.604 1.637c-.313.231-1.977 2.79-2.312 3.04-1.762 1.315-3.552 2.841-3.792 3.167C3.083 20.76 0 36 0 36l19.083-.5z"/><path fill="#4B545D" d="m26.5 15.25-7.312-9.212L18 2.25l-5.373 6.484-.971 1.172C11.25 10.688 10 15.25 10 15.25L8.75 20 3.252 30.054.917 34.791 32 35l-5.5-19.75z"/><path fill="#292F33" d="M12 34h2l2-15.75 1.234-1.797 3.578-5.234.094-1.469-3.287 4.454L15 17.752l-2.388 7.362L12 27l-1.791 3.134L8 34zm12.059-17.616-1.965 5.897L21 26l2.792 7.625 3.552-.062S23 26.625 23 26c0-.12.625-2.687.625-2.687l1.094-4.531L25 17.25l-.941-.866z"/><path fill="#292F33" d="M36 36s-.384-3.845-.854-7.083c0 0-.146-3.885-1.271-5.167-1.049-1.195-2.624-1.875-2.833-1.962l-1.229-3.523L27.953 13l-2.422-2.125-1.844-1.626-.505-.621L18 2.25l2.289 7.299.524 1.67 3.246 5.165.66 2.397 1.438 2.281.774 2.701L28 27.5 26 34l10 2z"/><path fill="#5C903F" d="M33.708 32.438c-1.345 0-4.958.562-5.458.562-2 0-4.25-1.75-5.25-1.75S19.406 33 17.406 33c-1.688 0-2.406-.812-4.719-.812-.748 0-4.096.871-4.812.781C6.052 32.741 5.115 32 4.656 32 2 32 0 36 0 36h36s-.875-3.562-2.292-3.562z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_titans)"/><circle cx="30" cy="30" r="24" fill="url(#sh_titans)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  giants: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_giants" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_giants" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_giants" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_giants)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#662113" d="M9.396 20.496s2.053 6.29 2.053 8.144.023 3.271-.374 4.463c-.397 1.192-.066 1.523 1.523 1.589 1.589.066 3.774 0 3.973-1.192.199-1.192-.156-1.55-.089-2.742.066-1.192.331-4.37.53-4.701.199-.331 3.906.662 4.635.927s3.046.265 3.112 1.059c.066.795.487 4.86.288 5.655-.199.795.397.993 2.251.927 1.986-.071 3.112-.463 2.979-1.324-.132-.861-.222-2.146.043-3.139s1.258-3.84 1.324-4.767c0 0 .927-2.053.861-3.575-.066-1.523-.651-3.477-2.522-5.575-1.28-1.435-3.196-1.466-5.579-2.194s-4.461-1.581-5.454-2.508c-.993-.927-3.694-1.065-5.078-.439-1.362.616-6.059 10.788-4.476 9.392z"/><path fill="#C1694F" d="M35.627 28.281c-.53-1.523-.993-3.906-1.059-5.429-.029-.661-.076-1.581-.263-2.576l.619.435c-.104-1.144-1.069-2.108-1.069-2.108l1.126-.118c-.28-.504-1.854-1.338-1.854-1.338l1.283-.318c-.56-.84-2.03-.98-2.03-.98l.318-.504c-.402-.281-1.209-.247-2.149-.532-1.02-.603-2.203-1.096-3.576-1.515-1.12-.342-2.124-.907-2.984-1.504l1.289-.444s-1.157-.459-1.628-.619c-.378-.129-.988-.154-1.217-.16l-.026-.023 1.32-.401c-.413-.558-2.555-.759-2.555-.759s.988-.197 1.139-.287c-.755-.574-2.112-.319-2.112-.319l.995-.859c-.583-.077-2.719.602-2.719.602l.582-.999c-.734.013-1.586 1.026-2.27 1.061-.051.003-.097.011-.147.016-.489-.106-.982-.292-1.425-.68-.497-.435-1.054-.86-1.638-1.183-.757-.419-1.558-.666-2.326-.539-1.195.199-1.565 1.223-2.53 1.674a1.648 1.648 0 0 0-.304.184c-.828.376-1.435.846-1.641 1.093l.802.059s-1.661.726-2.02 1.188l1.042-.031s-.926.655-1.131 1.22l.772.012s-1.279 1.13-1.485 1.592l.971-.258-.704 1.654.543-.055a18.22 18.22 0 0 0-.187 1.012c-.039.12-.067.266-.074.455-.031.811-1.09 1.688-1.09 1.688l.541.609s-.565 1.302-.883 1.674c0 0 .931-.215 1.09-.481 0 0-.297 1.16-.52 2.022l.777-.481c.164 2.254.028 5.167-.987 6.98-1.031 1.843-2.782 2.646-3.715 3.193-.933.547.109 3.102.733 3.012.624-.09 2.429-.561 4.762-2.374a12.22 12.22 0 0 0 1.14-1.01l.201.67c.445-.683.799-1.769.799-1.769l.799.4v-1.598l.799.285s-.483-1.41-.24-2.181c.39-1.353 1.351-2.888 2.309-3.965.588 1.9 1.691 5.641 1.691 7.001 0 1.854.023 3.271-.374 4.463s-.066 1.523 1.523 1.589 3.774 0 3.973-1.192c.199-1.192-.156-1.55-.089-2.742.065-1.168.2-3.8.392-4.216l.403.587.645-.751.02.001.479 2.204.529-1.925.498.897.692-.957.449 2.156.562-1.64.693 1.069.601-.935.564 1.634.481-1.388c.06.025.118.049.175.075l.522.995c.035-.012.215-.165.422-.405.129.133.225.27.237.417.066.795.398 4.328.199 5.123-.199.795.397.993 2.251.927 1.986-.071 3.112-.463 2.979-1.324-.132-.861-.222-2.146.043-3.139.265-.993 1.258-3.84 1.324-4.767 0 0 .07 1.396.596 2.185 1.195 1.784 1.857 1.188 1.327-.335z"/><path fill="#DA9E82" d="M9.808 21.064s-1.305 3.179-2.829 3.704c-1.857.64-4.21.573-4.917-.904-.748-1.564-.534-3.186.46-4.254.412-.443-.03-.645-.567-.31-1.484.926-2 2.417-1.777 4.256.188 1.544 1.681 3.207 3.59 3.465s4.308.127 6.011-1.73c1.283-1.399 1.78-2.374 2.118-2.947.316-.539-1.879-1.763-2.089-1.28z"/><path fill="#FFE9B7" d="M9.808 21.064s-1.45 3.394-2.973 3.92c-1.857.64-4.283.497-4.99-.98-.749-1.564-.727-3.209.267-4.277.412-.443.2-.542-.297-.149C.538 20.588.136 21.69.36 23.528c.188 1.544 1.596 3.069 3.505 3.327 1.909.258 4.119.283 5.822-1.574 1.283-1.399 1.872-2.364 2.209-2.937.317-.539-1.878-1.763-2.088-1.28z"/><circle cx="11" cy="14" r="1" fill="#292F33"/><path fill="#662113" d="M15.552 10.936c.068.616.89 1.848 1.369 2.258.479.411.616 1.574-.205 2.532s-1.095 2.532-1.848 3.148-1.779.137-1.984-.342c0 0-.411.958.753 1.232 1.163.274 1.848.068 2.463-1.095.616-1.163 1.437-2.326 2.053-3.148.616-.821.479-2.395-.274-2.874-.754-.48-2.327-1.711-2.327-1.711z"/><path fill="#662113" d="M30.355 17.471c.175.738.01 1.891-.319 1.115s-.49-2.059-.49-2.059.634.205.809.944zm1.691 1.199s.119 1.173.43 2.049.395-.374.215-1.196c-.179-.822-.645-.853-.645-.853zm.581 4.422s.013.997.228 2.011c.215 1.013.472.175.398-.76s-.626-1.251-.626-1.251zm-3.314 1.979s.024 1.299.227 2.122.535-.031.475-.792c-.06-.761-.702-1.33-.702-1.33zm1.971 2.413s-.233 1.278-.197 2.125c.036.846.531.076.622-.682.091-.758-.425-1.443-.425-1.443zm-3.123-8.993s.009 1.086.223 2.099c.215 1.013.567.018.493-.917-.074-.935-.716-1.182-.716-1.182zm-.371 4.332s-.327.753-.255 1.787c.072 1.033.56.096.616-.84.057-.936-.361-.947-.361-.947zm2.948-1.222s-.055.874.305 1.845.578.202.369-.712c-.21-.914-.674-1.133-.674-1.133zm-4.319-6.013s-.066.762.268 1.742.498-.137.336-1.057c-.162-.92-.604-.685-.604-.685zm-4.664-2.692s.533.878 1.09 1.545.402-.278.012-.955c-.389-.678-1.102-.59-1.102-.59zm1.136 3.228s.029.94.325 1.757.473-.125.337-.894c-.135-.769-.662-.863-.662-.863zm-.872 4.083s-.16.921-.006 1.776.568.425.564-.356-.558-1.42-.558-1.42zm3.283 4.984s-.056.822.098 1.678c.154.855.487-.043.484-.824s-.582-.854-.582-.854zm-5.278-1.775s-.294.818-.229 1.684c.065.866.428.51.505-.267a2.688 2.688 0 0 0-.276-1.417zm-1.474 1.519s-.294.818-.229 1.684c.065.866.428.51.505-.267a2.685 2.685 0 0 0-.276-1.417zm5.181.848s-.294.818-.229 1.684c.065.866.428.51.505-.267a2.688 2.688 0 0 0-.276-1.417zm-6.063-5.633s-.205 1.204-.14 2.071c.065.866.398.391.475-.386.077-.778-.335-1.685-.335-1.685zm-3.681 4.336c.132.77.548 1.608.522.745s-.283-1.826-.283-1.826-.371.31-.239 1.081zm1.713 2.67c.132.77.548 1.608.522.745s-.323-1.807-.323-1.807-.331.292-.199 1.062zm-1.295 3.171c.132.77.548 1.608.522.745s-.273-1.673-.273-1.673-.381.158-.249.928zm5.334-18.798s.49 1.29.926 2.041.443-.207.173-.94c-.27-.732-1.099-1.101-1.099-1.101zm-.063 6.407s.08 1.378.27 2.226c.191.848.485-.064.447-.844s-.717-1.382-.717-1.382zm5.426.772s.253 1.357.549 2.174c.296.817.473-.125.337-.894-.135-.77-.886-1.28-.886-1.28zm-1.42 2.546s-.09 1.071.096 1.92.485-.061.452-.842c-.032-.78-.548-1.078-.548-1.078zM7.259 14.74s-.67.491-.938 1.027c-.268.536-.089 1.072.223.536.313-.536.715-1.563.715-1.563zm1.161-4.422s-.715.134-1.117.491-.313.849.134.491c.447-.357.983-.982.983-.982zm-1.563 2.769c.402-.447 1.921-1.608 1.206-1.429-.715.179-1.295.938-1.295.938-.269.312-.313.938.089.491zm2.769-4.154c.536-.402 1.34-.804 1.34-.804s-.448.061-1.206.313c-.536.179-.67.893-.134.491zm-2.412 8.084s-.581.223-.938 1.027c-.357.804-.179 1.251.134.625.313-.624.804-1.652.804-1.652zm.536 2.323s-.581.402-.804 1.027c-.223.625-.089 1.251.134.625.223-.625.67-1.652.67-1.652zm1.697-1.653s-.402.759-.447 1.295c-.045.536.268.983.313.357.045-.624.134-1.652.134-1.652zm-2.456 4.69s-.581.313-.938.804c-.357.491-.223 1.251.089.67.313-.581.849-1.474.849-1.474zm.178 7.191c-.045.67.536.134.536-.447s-.178-1.251-.178-1.251-.313 1.028-.358 1.698zm-2.724 0s-.491.134-.983.313c-.491.179-1.072 1.027-.491.759s1.474-1.072 1.474-1.072zm-.313 2.322s-.536.402-1.117.581c-.581.179-.357.67.357.313.716-.358.76-.894.76-.894zM14.449 8.576c.804.536.759.223.491-.223-.268-.447-1.519-.625-1.519-.625s.224.312 1.028.848zm-.808 2.433c.466.549.513-.414.028-.823s-1.122-.654-1.122-.654.628.928 1.094 1.477zm-.666 5.964c.22.686.559.028.268-.536s-.687-.837-.687-.837.2.687.419 1.373zm1.564-2.546c.22.686.559.028.268-.536s-.687-.837-.687-.837.199.687.419 1.373zm13.264 1.474c.22.686.559.028.268-.536s-.687-.837-.687-.837.2.687.419 1.373zm.626 15.41c.102.713.547.121.354-.484-.193-.605-.537-.94-.537-.94s.081.711.183 1.424zm-11.16 1.26c-.081.716.499.255.464-.379-.034-.634-.284-1.045-.284-1.045s-.1.708-.18 1.424zM11.055 10.05s-.983.357-1.251.759-.089.938.179.491c.268-.446 1.072-1.25 1.072-1.25z" opacity=".6"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_giants)"/><circle cx="30" cy="30" r="24" fill="url(#sh_giants)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  rockets: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_rockets" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_rockets" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_rockets" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_rockets)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#A0041E" d="m1 17 8-7 16 1 1 16-7 8s.001-5.999-6-12-12-6-12-6z"/><path fill="#FFAC33" d="M.973 35s-.036-7.979 2.985-11S15 21.187 15 21.187 14.999 29 11.999 32c-3 3-11.026 3-11.026 3z"/><circle cx="8.999" cy="27" r="4" fill="#FFCC4D"/><path fill="#55ACEE" d="M35.999 0s-10 0-22 10c-6 5-6 14-4 16s11 2 16-4c10-12 10-22 10-22z"/><path d="M26.999 5a3.996 3.996 0 0 0-3.641 2.36A3.969 3.969 0 0 1 24.999 7a4 4 0 0 1 4 4c0 .586-.133 1.139-.359 1.64A3.993 3.993 0 0 0 30.999 9a4 4 0 0 0-4-4z"/><path fill="#A0041E" d="M8 28s0-4 1-5 13.001-10.999 14-10-9.001 13-10.001 14S8 28 8 28z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_rockets)"/><circle cx="30" cy="30" r="24" fill="url(#sh_rockets)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  blazers: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_blazers" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_blazers" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_blazers" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_blazers)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#F4900C" d="M35 19a16.96 16.96 0 0 0-1.04-5.868c-.46 5.389-3.333 8.157-6.335 6.868-2.812-1.208-.917-5.917-.777-8.164.236-3.809-.012-8.169-6.931-11.794 2.875 5.5.333 8.917-2.333 9.125-2.958.231-5.667-2.542-4.667-7.042-3.238 2.386-3.332 6.402-2.333 9 1.042 2.708-.042 4.958-2.583 5.208-2.84.28-4.418-3.041-2.963-8.333A16.936 16.936 0 0 0 1 19c0 9.389 7.611 17 17 17s17-7.611 17-17z"/><path fill="#FFCC4D" d="M28.394 23.999c.148 3.084-2.561 4.293-4.019 3.709-2.106-.843-1.541-2.291-2.083-5.291s-2.625-5.083-5.708-6c2.25 6.333-1.247 8.667-3.08 9.084-1.872.426-3.753-.001-3.968-4.007A11.964 11.964 0 0 0 6 30c0 .368.023.73.055 1.09C9.125 34.124 13.342 36 18 36s8.875-1.876 11.945-4.91c.032-.36.055-.722.055-1.09 0-2.187-.584-4.236-1.606-6.001z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_blazers)"/><circle cx="30" cy="30" r="24" fill="url(#sh_blazers)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  thunder: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_thunder" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_thunder" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_thunder" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_thunder)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#F4900C" d="M13.917 36a.417.417 0 0 1-.371-.607L17 29h-5.078c-.174 0-.438-.031-.562-.297-.114-.243-.057-.474.047-.703L15 19c.078-.067 6.902.393 7 .393a.417.417 0 0 1 .369.608l-3.817 6h5.032c.174 0 .329.108.391.271a.418.418 0 0 1-.119.461l-9.666 9.166a.422.422 0 0 1-.273.101z"/><path fill="#E1E8ED" d="M28 4c-.825 0-1.62.125-2.369.357A6.498 6.498 0 0 0 19.5 0c-3.044 0-5.592 2.096-6.299 4.921A4.459 4.459 0 0 0 10.5 4 4.5 4.5 0 0 0 6 8.5c0 .604.123 1.178.339 1.704A4.98 4.98 0 0 0 5 10c-2.762 0-5 2.238-5 5s2.238 5 5 5h23a8 8 0 1 0 0-16z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_thunder)"/><circle cx="30" cy="30" r="24" fill="url(#sh_thunder)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  storm: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_storm" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_storm" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_storm" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_storm)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#55ACEE" d="M35.782 24.518a1.699 1.699 0 0 0-.821-1.016c-.802-.436-1.879-.116-2.316.683a13.975 13.975 0 0 1-8.372 6.757 14.096 14.096 0 0 1-10.698-1.144 10.83 10.83 0 0 1-5.242-6.493c-.74-2.514-.495-5.016.552-7.033a9.739 9.739 0 0 0 .164 4.908 9.699 9.699 0 0 0 4.701 5.823 11.84 11.84 0 0 0 8.979.961 11.716 11.716 0 0 0 7.026-5.672 14.217 14.217 0 0 0 1.165-10.898 14.225 14.225 0 0 0-6.883-8.529 17.535 17.535 0 0 0-13.299-1.419A17.358 17.358 0 0 0 .332 9.843a1.71 1.71 0 0 0 .681 2.317c.804.439 1.884.117 2.319-.682a13.959 13.959 0 0 1 8.371-6.755 14.12 14.12 0 0 1 10.699 1.142 10.833 10.833 0 0 1 5.239 6.495c.741 2.514.496 5.017-.552 7.033a9.751 9.751 0 0 0-.162-4.911 9.73 9.73 0 0 0-4.702-5.824 11.856 11.856 0 0 0-8.98-.959A11.716 11.716 0 0 0 6.22 13.37a14.218 14.218 0 0 0-1.165 10.897 14.22 14.22 0 0 0 6.883 8.529 17.479 17.479 0 0 0 8.341 2.141c1.669 0 3.337-.242 4.958-.72a17.351 17.351 0 0 0 10.406-8.399c.219-.399.269-.862.139-1.3zM16.784 14.002c.373-.11.758-.166 1.143-.166a4.063 4.063 0 0 1 3.875 2.901 4.049 4.049 0 0 1-3.879 5.186 4.064 4.064 0 0 1-3.875-2.902 4.047 4.047 0 0 1 2.736-5.019z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_storm)"/><circle cx="30" cy="30" r="24" fill="url(#sh_storm)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  cyclones: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_cyclones" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_cyclones" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_cyclones" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_cyclones)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#8899A6" d="M12.125 32.667s3.583-5.792 2.667-11.084c-.711-4.106-3.387-4.937-6.042-8.583-3.125-4.292-3.444-7.461-2.5-9C7.375 2.167 11.583 0 21 0c6.042 0 8.794 1.622 9.708 3.417 1.125 2.208.459 9.583-2.208 14.666C24.11 26.45 19.25 32.042 14.75 34c-3.553 1.546-2.625-1.333-2.625-1.333z"/><g fill="#66757F"><path d="M17.137 7.999c4.885-.263 8.732-1.577 9.572-3.269.288-.581.251-1.213-.103-1.734-.94-1.388-4.231-1.683-9.773-1.058-1.681.189-3.854.513-3.791 1.062.063.549 2.417.312 3.976.202a54.253 54.253 0 0 1 1.939-.104c3.787-.135 5.773.256 5.836.904.07.719-3.192 1.753-7.762 2-8.958.485-10.596-1.011-10.885-1.481a.527.527 0 0 1-.07-.18c-.272.625-.368 1.452-.225 2.457 1.578.862 4.19 1.298 7.931 1.298 1.034 0 2.152-.033 3.355-.097zm4.988 6.689c.531-.15 2.41-.897 2.297-1.438-.141-.672-2.664.037-3.203.141-8.814 1.695-12.304-.676-13.37-1.725.271.432.567.875.901 1.334.662.91 1.326 1.644 1.961 2.298 1.229.321 2.733.534 4.566.534 1.928 0 3.973-.332 6.848-1.144z"/><path d="M30.375 5.228c-.954 1.504-3.5 3.944-14.297 4.975-.608.058-2.734.156-2.688.766.072.94 2.777.673 2.797.672 7.749-.465 12.588-1.745 15.028-4.268.05-1.466-.062-2.71-.337-3.532a3.238 3.238 0 0 1-.503 1.387zM14.792 21.583c.047.271.075.545.099.818.966.337 2.237.567 3.939.567.799 0 1.692-.053 2.687-.161.811-.088 2.013-.555 1.951-1.103-.062-.549-1.597-.352-2.156-.344-4.707.066-6.424-.947-7.044-1.602.223.536.404 1.131.524 1.825zm5.849-4.505c-.55.048-2.172.141-2.219.734-.07.889 2.252.782 2.266.781 4.058-.165 6.849-1.289 8.708-2.482a26.165 26.165 0 0 0 1.087-3.508c-.831 1.169-3.415 3.912-9.842 4.475zm-1.766 12.078c-.031-.391-.5-.453-1.703-.547-1.203-.094-1.715-.606-2.154-1.079a2.043 2.043 0 0 1-.468-.91 20.114 20.114 0 0 1-.723 2.42c.791.67 1.83.985 3.236 1.053.529.026 1.877-.126 1.812-.937zm7.056-6.577c-.984.907-3.054 2.199-7.04 2.484-.543.039-1.829.089-1.859.641-.03.552 1.175.891 1.727.92.336.019.661.027.977.027 1.479 0 2.719-.201 3.77-.504a53.79 53.79 0 0 0 2.425-3.568z"/></g><path fill="#788895" d="M12.167 1.917c6.245-1.849 14.208-1.5 17.542.292.026.014.046.019.071.032C28.371.971 25.672 0 21 0 11.583 0 7.375 2.167 6.25 4c-.065.105-.122.22-.174.341a.557.557 0 0 0 .071.181c.288.47 1.927 1.965 10.883 1.48 4.57-.247 7.833-1.281 7.762-2-.063-.648-2.049-1.039-5.836-.904 4.492-.008 4.414 1.142 2.003 1.486-10.553 1.507-14.001-1.126-8.792-2.667z"/><path fill="#CCD6DD" d="M28.642 36c.01-.083.025-.164.025-.25 0-.979-.652-1.795-1.542-2.064-.211-1.952-1.846-3.478-3.854-3.478a3.881 3.881 0 0 0-3.312 1.867 2.895 2.895 0 0 0-1.543-.45 2.902 2.902 0 0 0-2.546 1.521 2.857 2.857 0 0 0-2.078-.896c-.288 0-.56.055-.822.134a2.72 2.72 0 0 0-1.171-.504 4.097 4.097 0 0 0-7.841.651c-.104-.012-.206-.031-.312-.031a2.48 2.48 0 0 0-2.479 2.479c0 .365.084.709.226 1.021h27.249z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_cyclones)"/><circle cx="30" cy="30" r="24" fill="url(#sh_cyclones)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  tornados: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_tornados" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_tornados" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_tornados" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_tornados)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#8899A6" d="M12.125 32.667s3.583-5.792 2.667-11.084c-.711-4.106-3.387-4.937-6.042-8.583-3.125-4.292-3.444-7.461-2.5-9C7.375 2.167 11.583 0 21 0c6.042 0 8.794 1.622 9.708 3.417 1.125 2.208.459 9.583-2.208 14.666C24.11 26.45 19.25 32.042 14.75 34c-3.553 1.546-2.625-1.333-2.625-1.333z"/><g fill="#66757F"><path d="M17.137 7.999c4.885-.263 8.732-1.577 9.572-3.269.288-.581.251-1.213-.103-1.734-.94-1.388-4.231-1.683-9.773-1.058-1.681.189-3.854.513-3.791 1.062.063.549 2.417.312 3.976.202a54.253 54.253 0 0 1 1.939-.104c3.787-.135 5.773.256 5.836.904.07.719-3.192 1.753-7.762 2-8.958.485-10.596-1.011-10.885-1.481a.527.527 0 0 1-.07-.18c-.272.625-.368 1.452-.225 2.457 1.578.862 4.19 1.298 7.931 1.298 1.034 0 2.152-.033 3.355-.097zm4.988 6.689c.531-.15 2.41-.897 2.297-1.438-.141-.672-2.664.037-3.203.141-8.814 1.695-12.304-.676-13.37-1.725.271.432.567.875.901 1.334.662.91 1.326 1.644 1.961 2.298 1.229.321 2.733.534 4.566.534 1.928 0 3.973-.332 6.848-1.144z"/><path d="M30.375 5.228c-.954 1.504-3.5 3.944-14.297 4.975-.608.058-2.734.156-2.688.766.072.94 2.777.673 2.797.672 7.749-.465 12.588-1.745 15.028-4.268.05-1.466-.062-2.71-.337-3.532a3.238 3.238 0 0 1-.503 1.387zM14.792 21.583c.047.271.075.545.099.818.966.337 2.237.567 3.939.567.799 0 1.692-.053 2.687-.161.811-.088 2.013-.555 1.951-1.103-.062-.549-1.597-.352-2.156-.344-4.707.066-6.424-.947-7.044-1.602.223.536.404 1.131.524 1.825zm5.849-4.505c-.55.048-2.172.141-2.219.734-.07.889 2.252.782 2.266.781 4.058-.165 6.849-1.289 8.708-2.482a26.165 26.165 0 0 0 1.087-3.508c-.831 1.169-3.415 3.912-9.842 4.475zm-1.766 12.078c-.031-.391-.5-.453-1.703-.547-1.203-.094-1.715-.606-2.154-1.079a2.043 2.043 0 0 1-.468-.91 20.114 20.114 0 0 1-.723 2.42c.791.67 1.83.985 3.236 1.053.529.026 1.877-.126 1.812-.937zm7.056-6.577c-.984.907-3.054 2.199-7.04 2.484-.543.039-1.829.089-1.859.641-.03.552 1.175.891 1.727.92.336.019.661.027.977.027 1.479 0 2.719-.201 3.77-.504a53.79 53.79 0 0 0 2.425-3.568z"/></g><path fill="#788895" d="M12.167 1.917c6.245-1.849 14.208-1.5 17.542.292.026.014.046.019.071.032C28.371.971 25.672 0 21 0 11.583 0 7.375 2.167 6.25 4c-.065.105-.122.22-.174.341a.557.557 0 0 0 .071.181c.288.47 1.927 1.965 10.883 1.48 4.57-.247 7.833-1.281 7.762-2-.063-.648-2.049-1.039-5.836-.904 4.492-.008 4.414 1.142 2.003 1.486-10.553 1.507-14.001-1.126-8.792-2.667z"/><path fill="#CCD6DD" d="M28.642 36c.01-.083.025-.164.025-.25 0-.979-.652-1.795-1.542-2.064-.211-1.952-1.846-3.478-3.854-3.478a3.881 3.881 0 0 0-3.312 1.867 2.895 2.895 0 0 0-1.543-.45 2.902 2.902 0 0 0-2.546 1.521 2.857 2.857 0 0 0-2.078-.896c-.288 0-.56.055-.822.134a2.72 2.72 0 0 0-1.171-.504 4.097 4.097 0 0 0-7.841.651c-.104-.012-.206-.031-.312-.031a2.48 2.48 0 0 0-2.479 2.479c0 .365.084.709.226 1.021h27.249z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_tornados)"/><circle cx="30" cy="30" r="24" fill="url(#sh_tornados)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  comets: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_comets" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_comets" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_comets" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_comets)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#5DADEC" d="M33.662.049c-1.148-.077-5.869-.75-17.522 6.665C4.488 14.129-1.646 26.609 3.604 33.329c1.104 1.413 5.518 4.283 10.682.53 3.247-2.359 4.242-7.52 7.15-14.434 1.986-4.723 6.444-13.594 12.668-17.611 1.942-.97.22-1.72-.442-1.765z"/><path fill="#8CCAF7" d="M16.625 13.651c-.265-1.059.971-4.281 1.324-5.164-6.437 2.929-12.509 11.616-12.47 13.18.006.227.139.305.42.193 5.398-2.166 8.882 1.07 9.807 3.751.095.274.214.414.339.44.171.036.352-.15.494-.557C18.565 19.675 23.112 9.055 27.835 5c-2.648 1.28-10.106 6.797-11.21 8.651z"/><path fill="#BDDDF4" d="M14.242 12.989c-1.737.827-7.275 6.192-8.762 8.678.006.227.139.305.42.193 5.398-2.166 8.882 1.07 9.807 3.751.095.274.214.414.339.44.057-2.328-.092-7.616 2.213-11.561-4.061 3.707-5.076 3.618-4.017-1.501z"/><path fill="#F5F8FA" d="M8.725 23.663a5.297 5.297 0 1 0 0 10.594 5.297 5.297 0 0 0 0-10.594z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_comets)"/><circle cx="30" cy="30" r="24" fill="url(#sh_comets)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  jets: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_jets" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_jets" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_jets" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_jets)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#66757F" d="M30 23.828a.997.997 0 0 1-1.414 0l-1.414-1.414a.997.997 0 0 1 0-1.414L30 18.172a.999.999 0 0 1 1.414 0l1.414 1.414a.997.997 0 0 1 0 1.414L30 23.828zm-15-15a.997.997 0 0 1-1.414 0l-1.414-1.414a.997.997 0 0 1 0-1.414L15 3.172a.999.999 0 0 1 1.414 0l1.414 1.414a.997.997 0 0 1 0 1.414L15 8.828z"/><path fill="#55ACEE" d="M2 22c2 0 11 1 11 1s1 9 1 11-2 2-3 1-4-6-4-6-5-3-6-4-1-3 1-3zM4 6.039C7 6 29 7 29 7s.924 22 .962 25c.038 3-2.763 4.002-3.862.001S21 15 21 15 7.045 10.583 3.995 9.898C0 9 .999 6.077 4 6.039z"/><path fill="#CCD6DD" d="M27 3c2-2 7-3 8-2s0 6-2 8-19 18-19 18-6.5 4.5-8 3 3-8 3-8S25 5 27 3z"/><path fill="#66757F" d="M14 22s.5.5-4 5-5 4-5 4-.5-.5 4-5 5-4 5-4zM29 4a3 3 0 0 1 3 3h.805c.114-.315.195-.645.195-1a3 3 0 0 0-3-3c-.355 0-.685.081-1 .195V4z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_jets)"/><circle cx="30" cy="30" r="24" fill="url(#sh_jets)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  phantoms: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_phantoms" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_phantoms" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_phantoms" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_phantoms)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#E1E8ED" d="M36 11a2 2 0 0 0-4 0s-.011 3.285-3 3.894V12c0-6.075-4.925-11-11-11S7 5.925 7 12v3.237C1.778 16.806 0 23.231 0 27a2 2 0 0 0 4 0s.002-3.54 3.336-3.958C7.838 27.883 8.954 33 11 33h1c4 0 3 2 7 2s3-2 6-2 2.395 2 6 2a3 3 0 0 0 3-3c0-.675-2.274-4.994-3.755-9.268C35.981 21.348 36 14.58 36 11z"/><circle cx="13" cy="12" r="2" fill="#292F33"/><circle cx="23" cy="12" r="4" fill="#292F33"/><circle cx="23" cy="13" r="2" fill="#9AAAB4"/><path fill="#292F33" d="M22.192 19.491c2.65 1.987 3.591 5.211 2.1 7.199-1.491 1.988-4.849 1.988-7.5 0-2.65-1.987-3.591-5.211-2.1-7.199 1.492-1.989 4.849-1.988 7.5 0z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_phantoms)"/><circle cx="30" cy="30" r="24" fill="url(#sh_phantoms)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  chargers: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_chargers" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_chargers" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_chargers" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_chargers)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#FFAC33" d="M32.938 15.651A1.002 1.002 0 0 0 32 15H19.925L26.89 1.458A.999.999 0 0 0 26 0a1 1 0 0 0-.653.243L18 6.588 3.347 19.243A1 1 0 0 0 4 21h12.075L9.11 34.542A.999.999 0 0 0 10 36a1 1 0 0 0 .653-.243L18 29.412l14.653-12.655a1 1 0 0 0 .285-1.106z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_chargers)"/><circle cx="30" cy="30" r="24" fill="url(#sh_chargers)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  patriots: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_patriots" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_patriots" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_patriots" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_patriots)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#88C9F9" d="M36 32a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v28z"/><path fill="#157569" d="M26.496 9.174 32 0h-2l-6.38 7.292a12.885 12.885 0 0 0-3.741-1.141L19 0h-2l-.879 6.151a12.857 12.857 0 0 0-3.676 1.109L7 0H5l4.561 9.123a13.061 13.061 0 0 0-2.38 2.673L0 10v2l5.819 2.494A12.93 12.93 0 0 0 5 19c-.001.098-.013.191-.017.288l-2.748.393c-.078-.225-.156-.444-.235-.681-1-2.999-2-5-2-5v18c0 4 4 4 4 4h28s-.465-1.044 0-2c.179-.368 1.447-.658 1-2-.709-2.129-1.417-6.767-1.769-10H36v-2l-4.992-.713A7.902 7.902 0 0 1 31 19c0-1.587-.299-3.1-.818-4.506L36 12v-2l-7.182 1.796a13.037 13.037 0 0 0-2.322-2.622zM4 24s-.372-.747-.886-2h1.483C4.319 23.181 4 24 4 24z"/><path fill="#3FC9B9" d="M7 18s.422-3.316 4-6c4-3 6-2 6-1s-3 1-6 3-4 4-4 4zm22 0s-.423-3.316-4-6c-4-3-6-2.001-6-1 0 1 3 1 6 3s4 4 4 4zm-11-4c-6 0-8 4-8 4s2-2 4-2 2 2 2 2v2c0 1 2 1 2 1s2 0 2-1v-2s0-2 2-2 4 2 4 2-2-4-8-4z"/><path fill="#3FC9B9" d="M23 20c-2 0-2-1-2-1s-.083 2.815-1 4h-4c-.918-1.185-1-4-1-4s0 1-2 1-4-1-4-1 0 9 2 10c1.265.633 4-1 7-1s5.735 1.633 7 1c2-1 2-10 2-10s-2 1-4 1z"/><path fill="#157569" d="M15 25h6s-1-1-3-1-3 1-3 1z"/><path fill="#3FC9B9" d="M2 23c-1 5 .215 10.177 1 9 2-3 2 0 2 1s.526 4.211 2 2c1.401-2.101 6.368-.281 9.225 1h1.154C15.31 34.605 10.456 33.638 8 32c-3-2-6-9-6-9z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_patriots)"/><circle cx="30" cy="30" r="24" fill="url(#sh_patriots)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  rebels: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_rebels" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_rebels" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_rebels" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_rebels)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#8899A6" d="M5 36a2 2 0 0 1-2-2V3a2 2 0 0 1 4 0v31a2 2 0 0 1-2 2z"/><path fill="#AAB8C2" d="M5 1a2 2 0 0 0-2 2v31a.5.5 0 0 0 1 0V4.414C4 3.633 4.633 3 5.414 3H7a2 2 0 0 0-2-2z"/><path fill="#8899A6" d="M5 36a2 2 0 0 1-2-2V3a2 2 0 0 1 4 0v31a2 2 0 0 1-2 2z"/><path fill="#AAB8C2" d="M5 1a2 2 0 0 0-2 2v31a.5.5 0 0 0 1 0V4.414C4 3.633 4.633 3 5.414 3H7a2 2 0 0 0-2-2z"/><path fill="#31373D" d="M32.415 3.09c-1.752-.799-3.615-1.187-5.698-1.187-2.518 0-5.02.57-7.438 1.122-2.418.551-4.702 1.072-6.995 1.072-1.79 0-3.382-.329-4.868-1.006A1 1 0 0 0 6 4v19c0 .392.229.747.585.91 1.752.799 3.616 1.187 5.698 1.187 2.518 0 5.02-.57 7.438-1.122 2.418-.551 4.702-1.071 6.995-1.071 1.79 0 3.383.329 4.868 1.007A1.003 1.003 0 0 0 33 23V4a1 1 0 0 0-.585-.91z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_rebels)"/><circle cx="30" cy="30" r="24" fill="url(#sh_rebels)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  trojans: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_trojans" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_trojans" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_trojans" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_trojans)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#CCD6DD" d="M33 3c-7-3-15-3-15-3S10 0 3 3C0 18 3 31 18 36c15-5 18-18 15-33z"/><path fill="#55ACEE" d="M18 33.884C6.412 29.729 1.961 19.831 4.76 4.444 11.063 2.029 17.928 2 18 2c.071 0 6.958.04 13.24 2.444 2.799 15.387-1.652 25.285-13.24 29.44z"/><path fill="#269" d="M31.24 4.444C24.958 2.04 18.071 2 18 2v31.884c11.588-4.155 16.039-14.053 13.24-29.44z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_trojans)"/><circle cx="30" cy="30" r="24" fill="url(#sh_trojans)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  vikings: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_vikings" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_vikings" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_vikings" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_vikings)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#F4900C" d="m35.22 30.741-.024.024c-.97.97-2.542.97-3.511 0L7.835 6.915a1.49 1.49 0 0 1 0-2.107l1.429-1.429a1.49 1.49 0 0 1 2.107 0l23.85 23.85c.969.97.969 2.542-.001 3.512z"/><path fill="#66757F" d="M17.765 6.946 14.229 3.41a1.5 1.5 0 0 0-2.121 0L8.573 6.946c-2.128 2.092-3.85 3.015-6.055 3.056-.171 1.573.665 5.193 1.967 6.652 1.692 1.896 4.545 2.495 7.223 2.454-.134-2.363.437-4.422 2.521-6.506l3.535-3.536a1.497 1.497 0 0 0 .001-2.12z"/><path fill="#CCD6DD" d="M2.518 10.002C1.767 10.016.962 9.93.064 9.75c-.707 4.95 7.071 12.728 12.021 12.021-.193-.937-.328-1.819-.376-2.663-4.418-1.409-8.107-5.072-9.191-9.106z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_vikings)"/><circle cx="30" cy="30" r="24" fill="url(#sh_vikings)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  pirates: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_pirates" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_pirates" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_pirates" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_pirates)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#CCD6DD" d="M34 16C34 6 26.837 0 18 0 9.164 0 2 6 2 16c0 5.574.002 10.388 6 12.64V33a3 3 0 1 0 6 0v-3.155c.324.027.659.05 1 .07V33a3 3 0 1 0 6 0v-3.085c.342-.021.676-.043 1-.07V33a3 3 0 0 0 6 0v-4.36c5.998-2.252 6-7.066 6-12.64z"/><circle cx="11" cy="14" r="5" fill="#292F33"/><circle cx="25" cy="14" r="5" fill="#292F33"/><path fill="#292F33" d="M19.903 23.062C19.651 22.449 18.9 22 18 22s-1.652.449-1.903 1.062A1.494 1.494 0 0 0 15 24.5a1.5 1.5 0 0 0 1.5 1.5c.655 0 1.206-.422 1.41-1.007.03.001.059.007.09.007s.06-.006.09-.007a1.496 1.496 0 1 0 1.813-1.931z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_pirates)"/><circle cx="30" cy="30" r="24" fill="url(#sh_pirates)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  raiders: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_raiders" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_raiders" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_raiders" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_raiders)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#31373D" d="M34.157 20.709c-.807-1.404-1.932-2.604-3.565-3.526-.431-.244-1.826-.275-1.826-.275s-.707-.809-1.344-.978c-3.476-.923-8.798.434-10.427 1.086-1.628.652-1.914.299-3.995-.016a7.197 7.197 0 0 0-.918-.073c-.503-.431-.114-1.509-1.114-1.509S9.535 16.465 9 17a8.763 8.763 0 0 0-.688.125 9.082 9.082 0 0 0-.621.155c-.32-.673-.774-1.347-1.222-1.28-.402.06-.466 1.098-.421 1.943-.272.152-1.946 3.729-3.019 6.198-.092.212-1.882.83-2.064 1.011-.616.612-1.062 1.152-.653 1.642.631.757 2.649.694 3.91.505 1.261-.189 3.847-1.513 5.108-1.513 3.443 0 3.925 3.154 4.353 5.505.387 2.128.339 4.763 1.317 4.709s3-2 3-5c1 0 7.728.674 8 1s1 4 2 4 5-7 5-13c1 2 .668 4.172.668 4.878S34 30 35 30s1-2.009 1-3-.594-4.119-1.843-6.291z"/><path fill="#99AAB5" d="M32.62 20.788c-.43-1.59-1.333-2.86-2.031-3.598-.895-.506-1.934-.933-3.166-1.26.261 1.098-.923 6.903-8.923 11.133-.94.497.857 2.652 3.469 3.312 4.907 1.241 8.457.855 10.098-1.79.553-1.802.933-3.74.933-5.585.02.04.032.081.051.121v-.001a15.131 15.131 0 0 0-.431-2.332z"/><path fill="#E1E8ED" d="M4.958 22c.853-2.352 1.615-3.78 4.042-5-1.229.167-2.579.554-3.75 1.458-2.775 2.144-1.659 3.795-3.235 5.624-.329.381-.714.736-1.049 1.069C2.75 25 4.11 24.34 4.958 22zm11.596-3.809c-2.504.888-5.941 3.094-7.679 4.553C6.5 24.74 4.559 25.473 3.562 26c-1.631.863.755 1.177 3.438 0 2.108-.925 5.94-2.519 8.875-2.5 6.462.041 9.625-5.292 11.548-7.57-3.792-.334-8.162 1.301-10.869 2.261z"/><circle cx="7" cy="21" r="1" fill="#E1E8ED"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_raiders)"/><circle cx="30" cy="30" r="24" fill="url(#sh_raiders)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  colts: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_colts" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_colts" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_colts" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_colts)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#292F33" d="M28.721 12.849s3.809 1.643 5.532.449c1.723-1.193 2.11-2.773 1.159-4.736-.951-1.961-3.623-2.732-3.712-5.292 0 0-.298 4.141 1.513 5.505 2.562 1.933-.446 4.21-3.522 3.828-3.078-.382-.97.246-.97.246z"/><path fill="#8A4B38" d="M23.875 19.375s-.628 2.542.187 5.03c.145.341.049.556-.208.678-.256.122-4.294 1.542-4.729 1.771-.396.208-1.142 1.78-1.208 2.854.844.218 1.625.104 1.625.104s.025-1.915.208-2.042c.183-.127 5.686-1.048 6.062-1.771s1.611-3.888.812-5.292c-.225-.395-.637-1.15-.637-1.15l-2.112-.182z"/><path fill="#292F33" d="M17.917 29.708s-.616 1.993.008 2.138c.605.141 1.694-.388 1.755-.646.081-.343.216-1.179.098-1.366-.118-.186-1.861-.126-1.861-.126z"/><path fill="#8A4B38" d="m11.812 21.875-.75-2.562s-2.766 2.105-3.938 3.594c-.344.437-1.847 3.198-1.722 4.413.05.488.474 2.583.474 2.583l1.651-.465s-1.312-1.896-1.021-2.562c1.428-3.263 5.306-5.001 5.306-5.001z"/><path fill="#292F33" d="M7.679 29.424c-.172-.139-1.803.479-1.803.479s.057 2.085.695 2.022c.618-.061 1.48-.912 1.455-1.175-.034-.351-.175-1.187-.347-1.326z"/><path fill="#C1694F" d="M27.188 11.188c-3.437.156-7.207.438-9.5.438-3.655 0-5.219-1.428-6.562-2.625C8.838 6.964 8.167 4.779 6 5.501c0 0-.632-.411-1.247-.778l-.261-.152a7.231 7.231 0 0 0-.656-.347c-.164-.072-.258-.087-.228-.01.019.051.093.143.236.286.472.472.675.95.728 1.395-2.01 1.202-2.093 2.276-2.871 3.552-.492.807-1.36 2.054-1.56 2.515-.412.948 1.024 2.052 1.706 1.407.893-.845.961-1.122 2.032-1.744.983-.016 1.975-.416 2.308-1.02 0 0 .938 2.083 1.938 3.583s2.5 3.125 2.5 3.125c-.131 1.227.12 2.176.549 2.922-.385.757-.924 1.807-1.417 2.745-.656 1.245-1.473 3.224-1.208 3.618.534.798 2.719 2.926 4.137 3.311 1.03.28 2.14.437 2.14.437l-.193-1.574s-1.343.213-1.875-.083c-1.427-.795-2.666-2.248-2.708-2.542-.07-.487 3.841-2.868 5.14-3.645 2.266.097 6.022-.369 8.626-1.702.958 1.86 2.978 2.513 2.978 2.513s.667 2.208 1.375 4.125c-1.017.533-4.468 3.254-4.975 3.854-.456.54-.856 2.49-.856 2.49.82.375 1.57.187 1.57.187s.039-1.562.385-2.073c.346-.511 4.701-2.559 5.958-3.458.492-.352.404-.903.262-1.552-.321-1.471-.97-4.781-.971-4.782 5.146-2.979 6.458-11.316-2.354-10.916z"/><path fill="#292F33" d="M22.336 33.782s-.616 1.993.008 2.138c.605.141 1.694-.388 1.755-.646.081-.343.216-1.179.098-1.366-.118-.187-1.861-.126-1.861-.126zm-7.676-5.296c-.167.146.164 1.859.164 1.859s2.064.299 2.111-.34c.045-.62-.647-1.614-.91-1.634-.351-.027-1.198-.031-1.365.115z"/><circle cx="4.25" cy="8.047" r=".349" fill="#292F33"/><path fill="#292F33" d="M12.655 9.07c1.773 1.446 3.147.322 3.147.322-1.295-.271-2.056-.867-2.708-1.562.835-.131 1.287-.666 1.287-.666-1.061-.013-1.824-.3-2.485-.699-.565-.614-1.233-1.202-2.254-1.631a4.926 4.926 0 0 0-.922-.276c-.086-.025-.178-.063-.258-.073a4.125 4.125 0 0 0-2.737.603c-.322.2-.214.639.117.623 1.741-.085 2.866.582 3.47 1.633 2.169 3.772 5.344 3.875 5.344 3.875s-1.29-.688-2.001-2.149z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_colts)"/><circle cx="30" cy="30" r="24" fill="url(#sh_colts)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  lightning: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_lightning" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_lightning" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_lightning" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_lightning)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#FFAC33" d="M32.938 15.651A1.002 1.002 0 0 0 32 15H19.925L26.89 1.458A.999.999 0 0 0 26 0a1 1 0 0 0-.653.243L18 6.588 3.347 19.243A1 1 0 0 0 4 21h12.075L9.11 34.542A.999.999 0 0 0 10 36a1 1 0 0 0 .653-.243L18 29.412l14.653-12.655a1 1 0 0 0 .285-1.106z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_lightning)"/><circle cx="30" cy="30" r="24" fill="url(#sh_lightning)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
  plumes: (col='#C0392B') => {
    const _r=parseInt(col.slice(1,3),16),_g=parseInt(col.slice(3,5),16),_b=parseInt(col.slice(5,7),16)
    const cl=`#${Math.min(255,_r+Math.round((255-_r)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_g+Math.round((255-_g)*.45)).toString(16).padStart(2,'0')}${Math.min(255,_b+Math.round((255-_b)*.45)).toString(16).padStart(2,'0')}`
    const cd=`#${Math.round(_r*.35).toString(16).padStart(2,'0')}${Math.round(_g*.35).toString(16).padStart(2,'0')}${Math.round(_b*.35).toString(16).padStart(2,'0')}`
    return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><defs><filter id="ol_plumes" x="-15%" y="-15%" width="130%" height="130%"><feMorphology operator="dilate" radius="0.7" in="SourceAlpha" result="d"/><feFlood flood-color="#000" flood-opacity="0.9" result="b"/><feComposite in="b" in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter><radialGradient id="sp_plumes" cx="40%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient><radialGradient id="sh_plumes" cx="50%" cy="95%" r="50%"><stop offset="0%" stop-color="rgba(0,0,0,0.5)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.35)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}"/><path d="M 9 13 A 23 23 0 0 1 51 13" fill="none" stroke="${cl}" stroke-width="3" stroke-linecap="round" opacity="0.55"/><circle cx="30" cy="30" r="24.5" fill="#0c1016"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><g filter="url(#ol_plumes)" transform="translate(7.0,5.0) scale(1.2778)"><path fill="#C1694F" d="M4.048 29.644c-.811-.558-1.541-4.073-.936-4.404.738-.402.686.835 2.255 2.362 1.569 1.528 6.47.913 7.708 1.326 1.363.455-6.385 2.533-9.027.716z"/><path fill="#D99E82" d="M5.367 27.603C4 22 4.655 18.919 5.433 16.861 6.8 13.24 16.699 5.169 23.8 2.637 25.678 1.967 31.62 1 35 1c.589 2.332-1.174 6.717-1.62 7.518-1.009 1.81-3.564 4.273-8.646 9.482-.252.258-5.119-.46-5.376-.191-.283.296 4.044 1.579 3.755 1.889-.738.79-1.495 1.624-2.268 2.507-.172.196-8.311-.923-8.484-.722-.232.27 7.501 1.862 7.266 2.14-.645.765-1.299 1.564-1.959 2.397-1.725 2.178-12.301 1.583-12.301 1.583z"/><path fill="#C1694F" d="M19.15 12.787c1.588.966 5.331 1.943 8.316 2.422 1.898-1.937 3.299-3.378 4.302-4.529-2.259-.49-5.742-1.3-7.487-2.087l-.816-.403-4.872 4.17.557.427z"/><path fill="#662113" d="M35.088 1.514A3.85 3.85 0 0 0 35 1c-.378 0-.792.014-1.225.036-3.438.178-8.307 1.006-9.975 1.601-.345.123-.702.27-1.059.418-.478.198-.964.416-1.459.654.356 1.481 1.126 3.144 1.807 4.013a72.185 72.185 0 0 0-4.836 4.115C12.598 17.085 8.232 22.709 5.248 27.079c.04.174.076.344.12.524 0 0 .219.012.589.026 1.482-2.288 5.703-8.239 13.194-14.841a91.61 91.61 0 0 1 5.13-4.195c1.745.787 5.228 1.597 7.487 2.087.322-.369.606-.712.849-1.028.316-.412.569-.785.763-1.134.415-.746 1.969-4.594 1.708-7.004z"/><path fill="#C1694F" d="M35 1c-.369 0-.751-.003-1.138-.008-3.915 1.874-7.509 4.194-10.772 6.73-.68-.87-1.451-2.532-1.807-4.013a42.574 42.574 0 0 0-4.484 2.539c.309 1.911.852 4.377 1.455 5.589C6.827 22.441.638 34.605.553 34.776a.5.5 0 0 0 .895.448c.119-.238 12.144-23.883 33.659-33.72A7.693 7.693 0 0 0 35 1z"/></g><circle cx="30" cy="30" r="24" fill="url(#sp_plumes)"/><circle cx="30" cy="30" r="24" fill="url(#sh_plumes)"/><circle cx="21" cy="15" r="2" fill="white" opacity="0.1"/></svg>`
  },
}
function mascotPlaceholder(name, col='#C0392B') {
  const letter = (name||'?').charAt(0).toUpperCase()
  const r=parseInt((col||'#C0392B').slice(1,3)||'C0',16)
  const g=parseInt((col||'#C0392B').slice(3,5)||'39',16)
  const b=parseInt((col||'#C0392B').slice(5,7)||'2B',16)
  const cd=`#${Math.round(r*.35).toString(16).padStart(2,'0')}${Math.round(g*.35).toString(16).padStart(2,'0')}${Math.round(b*.35).toString(16).padStart(2,'0')}`
  return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="31" r="28" fill="rgba(0,0,0,0.3)"/><circle cx="30" cy="30" r="28.5" fill="${cd}"/><circle cx="30" cy="30" r="28" fill="${col}44"/><circle cx="30" cy="30" r="24" fill="#111820"/><circle cx="30" cy="30" r="23.5" fill="none" stroke="${col}" stroke-width="0.5" opacity="0.4"/><text x="30" y="35" textAnchor="middle" fontSize="22" fill="${col}" fontWeight="900" fontFamily="Arial Black,Impact,sans-serif" opacity="0.7">${letter}</text></svg>`
}

const MASCOTS = [
  { id:'eagles',   name:'Eagles',    tier:'free',    fn: MASCOT_SVGS.eagles },
  { id:'tigers',   name:'Tigers',    tier:'free',    fn: MASCOT_SVGS.tigers },
  { id:'lions',    name:'Lions',     tier:'free',    fn: MASCOT_SVGS.lions },
  { id:'bears',    name:'Bears',     tier:'free',    fn: MASCOT_SVGS.bears },
  { id:'wolves',   name:'Wolves',    tier:'free',    fn: MASCOT_SVGS.wolves },
  { id:'sharks',   name:'Sharks',    tier:'free',    fn: MASCOT_SVGS.sharks },
  { id:'dragons',  name:'Dragons',   tier:'free',    fn: MASCOT_SVGS.dragons },
  { id:'bulls',    name:'Bulls',     tier:'free',    fn: MASCOT_SVGS.bulls },
  { id:'knights',  name:'Knights',   tier:'free',    fn: MASCOT_SVGS.knights },
  { id:'hawks',    name:'Hawks',     tier:'free',    fn: MASCOT_SVGS.hawks },
  { id:'falcons',  name:'Falcons',   tier:'premium', fn: MASCOT_SVGS.falcons },
  { id:'ravens',   name:'Ravens',    tier:'premium', fn: MASCOT_SVGS.ravens },
  { id:'cardinals',name:'Cardinals', tier:'premium', fn: MASCOT_SVGS.cardinals },
  { id:'owls',     name:'Owls',      tier:'premium', fn: MASCOT_SVGS.owls },
  { id:'panthers', name:'Panthers',  tier:'premium', fn: MASCOT_SVGS.panthers },
  { id:'cougars',  name:'Cougars',   tier:'premium', fn: MASCOT_SVGS.cougars },
  { id:'jaguars',  name:'Jaguars',   tier:'premium', fn: MASCOT_SVGS.jaguars },
  { id:'huskies',  name:'Huskies',   tier:'premium', fn: MASCOT_SVGS.huskies },
  { id:'bulldogs', name:'Bulldogs',  tier:'premium', fn: MASCOT_SVGS.bulldogs },
  { id:'vipers',   name:'Vipers',    tier:'premium', fn: MASCOT_SVGS.vipers },
  { id:'cobras',   name:'Cobras',    tier:'premium', fn: MASCOT_SVGS.cobras },
  { id:'gators',   name:'Gators',    tier:'premium', fn: MASCOT_SVGS.gators },
  { id:'mustangs', name:'Mustangs',  tier:'premium', fn: MASCOT_SVGS.mustangs },
  { id:'stallions',name:'Stallions', tier:'premium', fn: MASCOT_SVGS.stallions },
  { id:'broncos',  name:'Broncos',   tier:'premium', fn: MASCOT_SVGS.broncos },
  { id:'rams',     name:'Rams',      tier:'premium', fn: MASCOT_SVGS.rams },
  { id:'bison',    name:'Bison',     tier:'premium', fn: MASCOT_SVGS.bison },
  { id:'warriors', name:'Warriors',  tier:'premium', fn: MASCOT_SVGS.warriors },
  { id:'spartans', name:'Spartans',  tier:'premium', fn: MASCOT_SVGS.spartans },
  { id:'titans',   name:'Titans',    tier:'premium', fn: MASCOT_SVGS.titans },
  { id:'giants',   name:'Giants',    tier:'premium', fn: MASCOT_SVGS.giants },
  { id:'rockets',  name:'Rockets',   tier:'premium', fn: MASCOT_SVGS.rockets },
  { id:'blazers',  name:'Blazers',   tier:'premium', fn: MASCOT_SVGS.blazers },
  { id:'thunder',  name:'Thunder',   tier:'premium', fn: MASCOT_SVGS.thunder },
  { id:'storm',    name:'Storm',     tier:'premium', fn: MASCOT_SVGS.storm },
  { id:'cyclones', name:'Cyclones',  tier:'premium', fn: MASCOT_SVGS.cyclones },
  { id:'tornados', name:'Tornados',  tier:'premium', fn: MASCOT_SVGS.tornados },
  { id:'comets',   name:'Comets',    tier:'premium', fn: MASCOT_SVGS.comets },
  { id:'jets',     name:'Jets',      tier:'premium', fn: MASCOT_SVGS.jets },
  { id:'phantoms', name:'Phantoms',  tier:'premium', fn: MASCOT_SVGS.phantoms },
  { id:'chargers', name:'Chargers',  tier:'premium', fn: MASCOT_SVGS.chargers },
  { id:'patriots', name:'Patriots',  tier:'premium', fn: MASCOT_SVGS.patriots },
  { id:'rebels',   name:'Rebels',    tier:'premium', fn: MASCOT_SVGS.rebels },
  { id:'trojans',  name:'Trojans',   tier:'premium', fn: MASCOT_SVGS.trojans },
  { id:'vikings',  name:'Vikings',   tier:'premium', fn: MASCOT_SVGS.vikings },
  { id:'pirates',  name:'Pirates',   tier:'premium', fn: MASCOT_SVGS.pirates },
  { id:'raiders',  name:'Raiders',   tier:'premium', fn: MASCOT_SVGS.raiders },
  { id:'colts',    name:'Colts',     tier:'premium', fn: MASCOT_SVGS.colts },
  { id:'lightning',name:'Lightning', tier:'premium', fn: MASCOT_SVGS.lightning },
  { id:'plumes',   name:'Plumes',    tier:'premium', fn: MASCOT_SVGS.plumes },
]

function MascotAvatar({ mascotId, color='#C0392B', size=40, locked=false, customMascot=null }) {
  // Handle custom mascots
  if (customMascot && customMascot.svgFn) {
    const lockStyle = locked ? { filter:'brightness(0.6) saturate(0.35) contrast(0.9)' } : {}
    return (
      <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
        <div style={{ width:size, height:size, ...lockStyle }} dangerouslySetInnerHTML={{ __html: customMascot.svgFn(color) }}/>
        {locked && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:size*0.3, lineHeight:1, filter:'brightness(2)' }}>🔒</span></div>}
      </div>
    )
  }
  const mascot = MASCOTS.find(m => m.id === mascotId)
  if (!mascot) return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:'#1e2330',
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.35, flexShrink:0 }}>🏆</div>
  )
  // Locked: visible at 60% brightness with saturation reduced — still recognizable
  const lockStyle = locked ? { filter:'brightness(0.6) saturate(0.35) contrast(0.9)' } : {}
  const svgStr = mascot.fn ? mascot.fn(color) : mascotPlaceholder(mascot.name, color)
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <div style={{ width:size, height:size, ...lockStyle }}
        dangerouslySetInnerHTML={{ __html: svgStr }}/>
      {locked && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
          justifyContent:'center', pointerEvents:'none' }}>
          <span style={{ fontSize:size*0.3, lineHeight:1, filter:'brightness(2)' }}>🔒</span>
        </div>
      )}
    </div>
  )
}

const TEAM_FONTS = [
  { id:'kalam',    name:'Kalam',           style:"'Kalam', cursive",                    preview:'Handwritten' },
  { id:'barlow',   name:'Barlow Condensed',style:"'Barlow Condensed', sans-serif",       preview:'Bold Athletic' },
  { id:'bigshoul', name:'Big Shoulders',   style:"'Big Shoulders Display', sans-serif",  preview:'BLOCK CAPS' },
  { id:'dmsans',   name:'DM Sans',         style:"'DM Sans', sans-serif",                preview:'Clean Modern' },
  { id:'mono',     name:'DM Mono',         style:"'DM Mono', monospace",                 preview:'Monospace' },
]

// ─── COACHING TIPS ────────────────────────────────────────────────────────────
const COACHING_TIPS = {
  Football: [
    "Pad level wins — the lower player wins the battle every time.",
    "Every play has a purpose. If you can't explain why, cut the play.",
    "Great teams win at the line of scrimmage, not the skill positions.",
    "Footwork is the foundation. Fix feet first, everything else follows.",
    "Never run a play in a game you haven't practiced 100 times.",
    "The offense sets the tempo. Make the defense react to you.",
    "A confused player is a slow player. Keep your playbook simple.",
    "Win the first three steps. That's where every play is decided.",
    "Teach your QB to read the safety first, every single pre-snap.",
    "Physicality is a skill. Train contact, don't avoid it in practice.",
    "The best block is a held block. Finish through the whistle.",
    "Run to daylight, not to the hole — teach your backs to see the field.",
    "Special teams wins games. Don't treat it as an afterthought.",
    "Defense is effort and assignment. Both are entirely coachable.",
    "The huddle is your locker room on the field. Own it.",
    "A 3rd and 1 play should be your most practiced play of the week.",
    "Celebrate great effort on bad plays. Culture starts with coaching.",
    "Your best player should also be your hardest worker. Set that standard.",
    "Pre-snap motion tells you everything about the defense.",
    "Great coaches communicate through players, not at them.",
  ],
  Basketball: [
    "Ball pressure changes everything. Make every dribble uncomfortable.",
    "The best pass is the one the defense didn't expect.",
    "Box out every single possession — it's a decision, not a skill.",
    "Spacing wins in basketball. Teach your players to read the floor.",
    "Great teams share the ball and share the credit.",
    "Teach players to use the backboard — youth shooters forget it exists.",
    "Defense is a mindset. You can play great defense with any roster.",
    "The paint is the most valuable real estate on the floor.",
    "A great screen is a great pass. Teach that connection.",
    "Transition defense starts with the shot — crash or sprint back.",
    "Every timeout is a teaching moment. Use every second.",
    "Make the simple play first. Great plays come from patience.",
    "Post entry passing is an underrated skill at every level.",
    "Help defense is a read, not a rule — teach your players to see it.",
    "Your point guard is your coach on the floor. Develop them that way.",
    "Free throws win close games. Practice them under pressure.",
    "Energy and communication are skills. Demand them every practice.",
    "The first pass after a rebound sets your entire offense.",
    "Teach ball reversal before isolation. Ball movement beats talent.",
    "A team that celebrates hustle plays wins the hustle war.",
  ],
  Baseball: [
    "Strike one is the most important pitch of every at-bat.",
    "Great fielding starts before the pitch — teach your players to anticipate.",
    "The catcher controls the game. Develop your catcher like a quarterback.",
    "Work the count. Walks are as good as singles for young hitters.",
    "Teach baserunning reads before you teach stealing.",
    "Every pitcher needs a second pitch they trust in a 2-strike count.",
    "Outfield communication prevents more errors than any drill.",
    "The cutoff man is only valuable if everyone hits him.",
    "Soft hands start with soft eyes — teach fielders to read hops early.",
    "Bunting is an offensive weapon. Don't let it become a lost art.",
    "A confident hitter stays in the box — teach plate presence.",
    "The first-to-third rule: always be thinking two bases ahead.",
    "Pitching to contact is a strategy, not a fallback.",
    "Catchers blocking in the dirt saves runs every single game.",
    "Know the situation before every pitch — runners, outs, count, score.",
    "Infield chatter keeps your defense alive and focused.",
    "A walked batter is a sin at the youth level. Throw strikes.",
    "Ground balls are your friend. Teach pitchers to stay down in the zone.",
    "The mental game starts between the ears, not in the batter's box.",
    "A team that communicates on defense makes half as many errors.",
  ],
  Soccer: [
    "Possession without purpose is just passing. Every touch should have intent.",
    "The best defenders win the ball cleanly. Slide tackles are a last resort.",
    "Width in attack creates depth. Stretch the defense before you penetrate it.",
    "The goalkeeper is your first attacker. Teach distribution from the back.",
    "Press as a unit or not at all. One player pressing alone opens gaps.",
    "Set pieces win games at every level. Dedicate real practice time to them.",
    "Quick restarts catch sleeping defenses. Spot them and take advantage.",
    "The third man run is soccer IQ. Teach players to move when off the ball.",
    "Compact shape defensively means no more than 25 yards between lines.",
    "Every player needs a strong first touch. Control the ball, control the game.",
    "Speed of play beats individual speed. Move the ball faster than they can run.",
    "Overlapping runs from fullbacks create numerical advantages wide.",
    "Counter-pressing after losing the ball is your best defensive weapon.",
    "The false nine creates confusion. Teach your striker to drop and connect.",
    "Switching the field quickly beats overloaded defenses every time.",
    "Goalkeepers command their box. Teach them to organize the defense with voice.",
    "One-touch finishing under pressure is a trained skill, not a talent.",
    "Defensive headers should be won early and cleared with purpose.",
    "The pivot player links defense and attack. Develop your sixes carefully.",
    "Celebrate recovery runs. Culture is built in the moments no one is watching.",
  ],
  Softball: [
    "The rise ball up in the zone is the most effective pitch in softball. Develop it.",
    "Slap hitting is a weapon. Speed plus contact beats power at most youth levels.",
    "The circle is the pitcher control zone. Know the rules and use them strategically.",
    "Catchers call the game in softball just like baseball. Develop that relationship.",
    "The drop ball away from a right-handed batter produces ground balls every time.",
    "No leading off until ball release. Teach your runners this from day one.",
    "The double first base bag protects both the runner and the first baseman.",
    "Bunt defense is a specialty. Practice corners and pitcher coverage every week.",
    "Change-up timing throws off even experienced hitters. Teach it early.",
    "Outfielders should get behind the ball, not just under it. Teach the approach.",
    "The safety squeeze is lower risk than the suicide squeeze at youth levels.",
    "Pitchers who hit corners and change speeds will always outperform power pitchers.",
    "First-and-third situations require practiced reads from every baserunner.",
    "The slap game with runners in motion is nearly impossible to defend when executed.",
    "Teach your hitters to use the whole field. Pull hitters are easy to defend.",
    "A strong relay from center field to home is a game-saving play. Practice it.",
    "The rise ball sets up the drop ball. Pitch sequencing matters from 10U onward.",
    "Every rundown should end in an out within two throws. Practice the technique.",
    "Winning the mental battle between pitcher and hitter wins games at every level.",
    "Fundamentals look boring in practice. They look like championships in games.",
  ],
}

function getRandomTip(sport) {
  const tips = COACHING_TIPS[sport] || COACHING_TIPS.Football
  return tips[Math.floor(Math.random() * tips.length)]
}

// ─── TUTORIAL DATA ────────────────────────────────────────────────────────────
const TUTORIAL_STEPS = [
  { tab:'home', icon:'\u{1F3E0}', title:'Welcome to CoachIQ', action:null, actionLabel:null,
    desc:'Your coaching assistant. This tour walks you through every feature. Tap Next to continue or Exit Tour anytime.',
    tip:'CoachIQ works for Football, Basketball, Baseball, Soccer, and Softball. Switch sports with the dropdown at the top left.' },
  { tab:'team', icon:'\u{1F3C6}', title:'Step 1 - Create Your Team', action:'team', actionLabel:'Go to Team Tab',
    desc:'Everything in CoachIQ is built around your team. Open the Team tab, fill in your team name, pick a mascot, choose your colors, and add your hometown.',
    tip:'You can create up to 5 teams per sport. Your team colors apply throughout the entire app.' },
  { tab:'team', icon:'\u{1F465}', title:'Step 2 - Build Your Roster', action:'team', actionLabel:'Open Team Tab',
    desc:'In the Team tab, tap Roster to add players. Enter first name, last name, jersey number, and up to 3 positions per player. Special teams positions like K, P, and LS are included.',
    tip:'Once your roster is built, assign players to field positions using the Lineup Builder tab.' },
  { tab:'schemes', icon:'\u{1F4CB}', title:'Step 3 - Generate a Scheme', action:'schemes', actionLabel:'Open Scheme Generator',
    desc:'Open the Scheme Generator. Fill out your offensive system, personnel, age group, and opponent defense, then hit Generate. You get 6 tailored plays with animated diagrams.',
    tip:'Each play comes with a step-by-step breakdown, huddle card, pro comparison, and variations. Everything is sport-specific.' },
  { tab:'schemes', icon:'\u{1F4D6}', title:'Step 4 - Save to Playbook', action:'schemes', actionLabel:'Open Scheme Generator',
    desc:'After generating a scheme, tap Save to Playbook on any play you like. Saved plays go into your Playbook where you can organize, review, and print wristbands.',
    tip:'You can generate both offense AND defense schemes. The Defense Generator creates a full game plan against a specific opponent look.' },
  { tab:'playbook', icon:'\u{1F4D4}', title:'Step 5 - Your Playbook', action:'playbook', actionLabel:'Open Playbook',
    desc:'Your saved plays live here. Tap any play to see its full diagram and breakdown. Use the Print tab to generate a printable wristband organized by situation.',
    tip:'Plays are organized into folders. You can move plays between folders and mark your most important ones.' },
  { tab:'learn', icon:'\u270F\uFE0F', title:'Step 6 - Play Name Builder', action:'learn', actionLabel:'Open Learn Tab',
    desc:'Want to understand how play calls work? Go to Learn and open the Play Name Builder. Walk through 8 steps to build a real NFL-style call with a live field diagram.',
    tip:'For Baseball and Softball, this becomes the Signal Creator. It generates real third-base coach touch sequences with an indicator system.' },
  { tab:'learn', icon:'\u26A1', title:'Step 7 - Coaching Gauntlet', action:'learn', actionLabel:'Open Learn Tab',
    desc:'Test your coaching IQ with the Gauntlet. Face AI-generated scenario questions at Rookie, Varsity, or Elite difficulty. Correct answers raise your IQ score.',
    tip:'Your IQ score starts at 500 and maxes at 1000. Streak bonuses apply: 3 correct in a row earns an extra +10 points.' },
  { tab:'news', icon:'\u{1F4F0}', title:'Step 8 - News and Feed', action:'news', actionLabel:'Open News Tab',
    desc:'The News tab has 5 channels: All, Sport Coaching, Youth Coaching Theory, Current Sports News, and All Sports News. Channels load independently and cache between sessions.',
    tip:'Tap Read more on any item to search Google. Tap Watch to find YouTube videos. Hit the refresh button for fresh content.' },
  { tab:'more', icon:'\u2699\uFE0F', title:'Step 9 - Settings', action:'more', actionLabel:'Open Settings',
    desc:'In More, then Settings, you can customize your CoachIQ logo color, set your home location for weather, adjust team colors, and control which widgets rotate on the home screen.',
    tip:'Set your Home Location to see live weather and game likelihood predictions on the home screen widget.' },
  { tab:'home', icon:'\u{1F389}', title:'You Are Ready to Coach!', action:null, actionLabel:null,
    desc:'That is the full tour. You have seen every major feature. Start by creating your team, generating your first scheme, and saving plays to your playbook.',
    tip:'Need help anytime? Go to Learn, then Help for a full feature guide with navigation links to every part of the app.' },
]

const FEATURE_GUIDE = [
  { section:'Scheme Generator', icon:'📋', items:[
    { name:'Offensive Schemes', desc:'Set your system, personnel, age, and opponent tendencies. AI generates 6 tailored plays.' },
    { name:'Defensive Schemes', desc:'Input the opponent offense and your defensive identity. AI builds a 4-formation game plan.' },
    { name:'Animated Diagrams', desc:'Tap Show Play on any play to see a live animated diagram with routes and assignments.' },
    { name:'Huddle Card', desc:'Exact words to say in the huddle for each player, with jargon explained.' },
    { name:'Educator Mode', desc:'Step-by-step breakdown of every play with coaching points and player roles explained in simple terms.' },
    { name:'Pro Comparison', desc:'See the NFL/NBA/MLB equivalent of your play, what matches, what differs, and what to develop toward.' },
    { name:'Variations', desc:'3 variations of every play that change one element — same concept, different look.' },
    { name:'Play Q&A', desc:'Ask any question about a play and get a direct answer.' },
  ]},
  { section:'Team Management', icon:'🏆', items:[
    { name:'Create a Team', desc:'Name, mascot, font, hometown, 4 color slots. Up to 5 teams per sport.' },
    { name:'Roster', desc:'Add players with name, position (up to 3), and jersey number.' },
    { name:'Schedule', desc:'Add games, practices, scrimmages, and tournaments with address search, arrival times, and notes.' },
    { name:'Practice Planner', desc:'AI generates a complete practice plan based on your team, focus area, duration, and upcoming opponent.' },
    { name:'Print Sheets', desc:'Generate print-ready wristbands, coach sheets, playbook sheets, and practice plans as PDFs.' },
  ]},
  { section:'Playbook', icon:'📖', items:[
    { name:'Team Folders', desc:'Switch between any team playbook using the dropdown. Each team has its own folders.' },
    { name:'Default Folders', desc:'Base Offense, Red Zone, 2-Minute Drill, Base Defense, Special Teams, My Favorites.' },
    { name:'Individual Play Creator', desc:'Build one specific play with situation-specific inputs — same full feature set as generated scheme plays.' },
    { name:'Copy Plays', desc:'Copy any play from one team playbook into another team folder.' },
  ]},
  { section:'Scout', icon:'🔍', items:[
    { name:'Opponent Scouting', desc:'Add opponent name (optional), fill structured tendency dropdowns, add free-form notes. AI generates a full report with key threats and a game plan.' },
    { name:'Self Scout / Film Room', desc:'Describe a problem your team is having or upload a clip. AI diagnoses the root cause and gives a specific drill to fix it.' },
  ]},
  { section:'Gauntlet', icon:'⚡', items:[
    { name:'Scenarios', desc:'AI-generated coaching situations at Rookie, Varsity, or Elite difficulty. Answer correctly to earn IQ points.' },
    { name:'Battle Mode', desc:'Go head-to-head in a strategic debate with an AI coordinator. Defend your scheme choices.' },
    { name:'Coach IQ', desc:'Your score tracks across sessions. Increases with correct answers, decreases with wrong ones.' },
  ]},
]



// ─── DEMO TEAMS (guest/just-exploring mode only — session only, never persisted) ──
const DEMO_TEAMS = {
  Football: {
    id: 'demo_football', name: 'Tolland Eagles', season: 'Fall 2025', mascot: 'eagles',
    teamFont: 'barlow', hometown: 'Tolland, CT', primary: '#C0392B', secondary: '#002868',
    accent1: '#f59e0b', accent2: '#1565C0', sport: 'Football', _isDemo: true,
    players: [
      {id:'dp1',name:'Marcus Williams',number:'12',position:'QB',active:true},
      {id:'dp2',name:'Jaylen Carter',number:'22',position:'RB',active:true},
      {id:'dp3',name:'Devon Brooks',number:'84',position:'WR',active:true},
      {id:'dp4',name:'Tyler Mason',number:'81',position:'WR',active:true},
      {id:'dp5',name:'Chris Hall',number:'88',position:'TE',active:true},
      {id:'dp6',name:'Jordan Lee',number:'74',position:'OL',active:true},
      {id:'dp7',name:'Sam Rivera',number:'75',position:'OL',active:true},
      {id:'dp8',name:'Mike Torres',number:'52',position:'DL',active:true},
      {id:'dp9',name:'Brandon King',number:'55',position:'LB',active:true},
      {id:'dp10',name:'Caleb Scott',number:'21',position:'CB',active:true},
      {id:'dp11',name:'Eli Parker',number:'32',position:'S',active:true},
      {id:'dp12',name:'Noah James',number:'44',position:'K',active:true},
    ],
    gameHistory: [
      {id:'dg1',opponent:'Ellington RoadRunners',date:'2025-09-06',us:21,them:14},
      {id:'dg2',opponent:'Coventry Patriots',date:'2025-09-13',us:7,them:14},
      {id:'dg3',opponent:'Stafford Bulldogs',date:'2025-09-20',us:28,them:6},
      {id:'dg4',opponent:'Mansfield Chiefs',date:'2025-09-27',us:14,them:10},
      {id:'dg5',opponent:'Somers Spartans',date:'2025-10-04',us:35,them:21},
    ],
    schedule: [
      {id:'ds1',type:'Game',opponent:'Bolton Bears',date:'2025-10-18',time:'10:00',homeAway:'Home',rsvp:'yes'},
      {id:'ds2',type:'Practice',opponent:'Practice',date:'2025-10-15',time:'17:00',homeAway:'Home',rsvp:'yes'},
    ],
    practicePlans: [{id:1728000000000,title:'Red Zone Offense',focus:'Red Zone',duration:60,segments:[{label:'Warm-up',duration:10},{label:'Goal line runs',duration:20},{label:'Pass routes in the red zone',duration:20},{label:'Cool-down',duration:10}]}],
  },
  Basketball: {
    id: 'demo_basketball', name: 'Tolland Huskies', season: 'Winter 2025', mascot: 'wolves',
    teamFont: 'barlow', hometown: 'Tolland, CT', primary: '#1565C0', secondary: '#C0392B',
    accent1: '#f59e0b', accent2: '#1e2330', sport: 'Basketball', _isDemo: true,
    players: [
      {id:'dbk1',name:'Isaiah Grant',number:'3',position:'PG',active:true},
      {id:'dbk2',name:'Marcus Webb',number:'5',position:'SG',active:true},
      {id:'dbk3',name:'Darius Cole',number:'23',position:'SF',active:true},
      {id:'dbk4',name:'Tyler Nash',number:'32',position:'PF',active:true},
      {id:'dbk5',name:'Jordan Pierce',number:'44',position:'C',active:true},
      {id:'dbk6',name:'Chris Owens',number:'11',position:'G',active:true},
      {id:'dbk7',name:'Kevin Hall',number:'15',position:'F',active:true},
      {id:'dbk8',name:'Brandon Young',number:'20',position:'G',active:true},
      {id:'dbk9',name:'Elijah Moore',number:'33',position:'F',active:true},
      {id:'dbk10',name:'Samuel Fox',number:'2',position:'G',active:true},
    ],
    gameHistory: [
      {id:'dbkg1',opponent:'Coventry Cardinals',date:'2025-12-06',us:54,them:42},
      {id:'dbkg2',opponent:'Stafford Bulldogs',date:'2025-12-13',us:48,them:51},
      {id:'dbkg3',opponent:'Ellington Eagles',date:'2025-12-20',us:61,them:44},
      {id:'dbkg4',opponent:'Mansfield Warriors',date:'2026-01-04',us:55,them:49},
      {id:'dbkg5',opponent:'Bolton Bears',date:'2026-01-11',us:70,them:58},
    ],
    schedule: [
      {id:'dbks1',type:'Game',opponent:'Somers Storm',date:'2026-01-25',time:'14:00',homeAway:'Away',rsvp:'yes'},
      {id:'dbks2',type:'Practice',opponent:'Practice',date:'2026-01-22',time:'16:30',homeAway:'Home',rsvp:'yes'},
    ],
    practicePlans: [{id:1728000000001,title:'Motion Offense Sets',focus:'Offense',duration:75,segments:[{label:'Warm-up',duration:10},{label:'Passing drills',duration:20},{label:'5-out motion sets',duration:30},{label:'Scrimmage',duration:15}]}],
  },
  Baseball: {
    id: 'demo_baseball', name: 'Tolland Bears', season: 'Spring 2026', mascot: 'bears',
    teamFont: 'barlow', hometown: 'Tolland, CT', primary: '#1B5E20', secondary: '#C0392B',
    accent1: '#f59e0b', accent2: '#1e2330', sport: 'Baseball', _isDemo: true,
    players: [
      {id:'dbb1',name:'Ryan Cooper',number:'10',position:'P',active:true},
      {id:'dbb2',name:'Jake Morris',number:'2',position:'C',active:true},
      {id:'dbb3',name:'Tyler Banks',number:'3',position:'1B',active:true},
      {id:'dbb4',name:'Marcus Lee',number:'4',position:'2B',active:true},
      {id:'dbb5',name:'Devon Cruz',number:'5',position:'3B',active:true},
      {id:'dbb6',name:'Chase Flynn',number:'6',position:'SS',active:true},
      {id:'dbb7',name:'Evan Ross',number:'7',position:'LF',active:true},
      {id:'dbb8',name:'Caleb West',number:'8',position:'CF',active:true},
      {id:'dbb9',name:'Noah Bell',number:'9',position:'RF',active:true},
      {id:'dbb10',name:'Aiden Clark',number:'18',position:'P',active:true},
      {id:'dbb11',name:'Mason Gray',number:'21',position:'UT',active:true},
      {id:'dbb12',name:'Logan Price',number:'25',position:'UT',active:true},
      {id:'dbb13',name:'Owen Reed',number:'33',position:'P',active:true},
      {id:'dbb14',name:'Finn Walsh',number:'14',position:'C',active:true},
    ],
    gameHistory: [
      {id:'dbbg1',opponent:'Coventry Cardinals',date:'2026-04-05',us:5,them:3},
      {id:'dbbg2',opponent:'Stafford Warriors',date:'2026-04-09',us:2,them:4},
      {id:'dbbg3',opponent:'Ellington Eagles',date:'2026-04-12',us:8,them:1},
      {id:'dbbg4',opponent:'Mansfield Chiefs',date:'2026-04-16',us:6,them:5},
      {id:'dbbg5',opponent:'Bolton Patriots',date:'2026-04-19',us:4,them:2},
      {id:'dbbg6',opponent:'Somers Falcons',date:'2026-04-23',us:1,them:3},
      {id:'dbbg7',opponent:'Andover Jaguars',date:'2026-04-26',us:9,them:0},
      {id:'dbbg8',opponent:'Union Warriors',date:'2026-04-30',us:3,them:4},
    ],
    schedule: [
      {id:'dbbs1',type:'Game',opponent:'Hebron Hawks',date:'2026-05-03',time:'10:00',homeAway:'Home',rsvp:'yes'},
      {id:'dbbs2',type:'Practice',opponent:'Practice',date:'2026-05-01',time:'15:30',homeAway:'Home',rsvp:'yes'},
    ],
    practicePlans: [],
  },
  Soccer: {
    id: 'demo_soccer', name: 'Tolland FC', season: 'Fall 2025', mascot: 'lions',
    teamFont: 'barlow', hometown: 'Tolland, CT', primary: '#0D6E3D', secondary: '#f5c518',
    accent1: '#f2f4f8', accent2: '#1e2330', sport: 'Soccer', _isDemo: true,
    players: [
      {id:'dsc1',name:'Mateo Silva',number:'1',position:'GK',active:true},
      {id:'dsc2',name:'Lucas Perez',number:'2',position:'RB',active:true},
      {id:'dsc3',name:'Ethan Cruz',number:'5',position:'CB',active:true},
      {id:'dsc4',name:'Noah Reyes',number:'6',position:'CB',active:true},
      {id:'dsc5',name:'Liam Rojas',number:'3',position:'LB',active:true},
      {id:'dsc6',name:'Carlos Diaz',number:'8',position:'CM',active:true},
      {id:'dsc7',name:'Diego Morales',number:'10',position:'CM',active:true},
      {id:'dsc8',name:'Adrian Torres',number:'7',position:'RM',active:true},
      {id:'dsc9',name:'Nico Vargas',number:'11',position:'LM',active:true},
      {id:'dsc10',name:'Ivan Ramos',number:'9',position:'ST',active:true},
      {id:'dsc11',name:'Sergio Flores',number:'17',position:'ST',active:true},
      {id:'dsc12',name:'Pablo Mendez',number:'4',position:'DEF',active:true},
      {id:'dsc13',name:'Miguel Santos',number:'14',position:'MID',active:true},
      {id:'dsc14',name:'Rafael Lima',number:'16',position:'MID',active:true},
      {id:'dsc15',name:'Andre Costa',number:'20',position:'FWD',active:true},
      {id:'dsc16',name:'Thiago Alves',number:'22',position:'GK',active:true},
    ],
    gameHistory: [
      {id:'dscg1',opponent:'Coventry FC',date:'2025-09-07',us:3,them:1},
      {id:'dscg2',opponent:'Stafford United',date:'2025-09-14',us:2,them:0},
      {id:'dscg3',opponent:'Ellington City',date:'2025-09-21',us:4,them:2},
      {id:'dscg4',opponent:'Mansfield Athletic',date:'2025-09-28',us:1,them:1},
      {id:'dscg5',opponent:'Bolton Rovers',date:'2025-10-05',us:3,them:0},
      {id:'dscg6',opponent:'Somers United',date:'2025-10-12',us:2,them:1},
    ],
    schedule: [
      {id:'dscs1',type:'Game',opponent:'Andover City',date:'2025-10-19',time:'11:00',homeAway:'Away',rsvp:'yes'},
      {id:'dscs2',type:'Practice',opponent:'Practice',date:'2025-10-17',time:'16:00',homeAway:'Home',rsvp:'yes'},
    ],
    practicePlans: [],
  },
  Softball: {
    id: 'demo_softball', name: 'Tolland Storm', season: 'Spring 2026', mascot: 'lightning',
    teamFont: 'barlow', hometown: 'Tolland, CT', primary: '#7B1FA2', secondary: '#f5c518',
    accent1: '#f2f4f8', accent2: '#1e2330', sport: 'Softball', _isDemo: true,
    players: [
      {id:'dsb1',name:'Emma Davis',number:'1',position:'P',active:true},
      {id:'dsb2',name:'Olivia Chen',number:'2',position:'C',active:true},
      {id:'dsb3',name:'Ava Johnson',number:'3',position:'1B',active:true},
      {id:'dsb4',name:'Mia Williams',number:'4',position:'2B',active:true},
      {id:'dsb5',name:'Sophia Brown',number:'5',position:'3B',active:true},
      {id:'dsb6',name:'Isabella Jones',number:'6',position:'SS',active:true},
      {id:'dsb7',name:'Charlotte Garcia',number:'7',position:'LF',active:true},
      {id:'dsb8',name:'Amelia Miller',number:'8',position:'CF',active:true},
      {id:'dsb9',name:'Harper Wilson',number:'9',position:'RF',active:true},
      {id:'dsb10',name:'Evelyn Moore',number:'10',position:'P',active:true},
      {id:'dsb11',name:'Abigail Taylor',number:'11',position:'UT',active:true},
      {id:'dsb12',name:'Emily Anderson',number:'12',position:'UT',active:true},
      {id:'dsb13',name:'Elizabeth Thomas',number:'13',position:'C',active:true},
      {id:'dsb14',name:'Sofia Jackson',number:'14',position:'IF',active:true},
    ],
    gameHistory: [
      {id:'dsbg1',opponent:'Coventry Cardinals',date:'2026-04-04',us:6,them:2},
      {id:'dsbg2',opponent:'Stafford Thunder',date:'2026-04-08',us:4,them:1},
      {id:'dsbg3',opponent:'Ellington Lightning',date:'2026-04-11',us:3,them:5},
      {id:'dsbg4',opponent:'Mansfield Flames',date:'2026-04-15',us:7,them:3},
      {id:'dsbg5',opponent:'Bolton Blaze',date:'2026-04-18',us:5,them:2},
      {id:'dsbg6',opponent:'Somers Surge',date:'2026-04-22',us:2,them:4},
    ],
    schedule: [
      {id:'dsbs1',type:'Game',opponent:'Hebron Hawks',date:'2026-04-25',time:'10:00',homeAway:'Home',rsvp:'yes'},
      {id:'dsbs2',type:'Practice',opponent:'Practice',date:'2026-04-23',time:'15:00',homeAway:'Home',rsvp:'yes'},
    ],
    practicePlans: [],
  },
}

// ─── SPORT COLORS ────────────────────────────────────────────────────────────
const SPORT_COLORS = {
  Football:   { primary: '#C0392B', secondary: '#1a3a1a', accent: '#e8f5e9', label: 'Football' },
  Basketball: { primary: '#D4600A', secondary: '#1a1208', accent: '#fff3e0', label: 'Basketball' },
  Baseball:   { primary: '#1B5E20', secondary: '#1a1208', accent: '#e8f5e9', label: 'Baseball' },
  Soccer:     { primary: '#0D6E3D', secondary: '#0a1a0a', accent: '#e8f5e9', label: 'Soccer' },
  Softball:   { primary: '#7B1FA2', secondary: '#1a081a', accent: '#f3e5f5', label: 'Softball' },
}

// ─── DEFAULT PLAYBOOK FOLDERS ────────────────────────────────────────────────
const DEFAULT_FOLDERS = {
  Football:   ['Base Offense','Red Zone','2-Minute Drill','Base Defense','Special Teams','My Favorites'],
  Basketball: ['Base Offense','End of Game','Press Break','Zone Attack','Inbounds','My Favorites'],
  Baseball:   ['Base Offense','Late Innings','Small Ball','Pitching Strategy','Defensive Sets','My Favorites'],
  Soccer:     ['Attacking Patterns','Set Pieces','Defensive Shape','Transitions','Restarts','My Favorites'],
  Softball:   ['Base Offense','Late Innings','Small Ball','Pitching Strategy','Defensive Sets','My Favorites'],
}

// ─── SPORTS CONFIG ───────────────────────────────────────────────────────────
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
      {id:'oppTendency',label:'Opponent Defensive Tendency',opts:['Unknown / Balanced','Cover 2 Zone','Cover 3 Zone','Cover 4 / Quarters','Man Press Every Down','Zone Blitz Heavy','Blitzes Every Down','Soft Zone / Prevent','Tampa 2','Quarters Robber']},
    ],
    positions:['Quarterback','Running Back','Wide Receiver','Offensive Line','Linebacker','Cornerback','Safety'],
    buildPrompt:(f)=>{const d=f.defense==='Unknown / Surprise Me'||f.defense==='Multiple / Varies'?'Best all-around scheme.':'Beat the '+f.defense+'.';const st=Object.keys(f).map(k=>k+': '+f[k]).join('; ');const ps='{"number":N,"name":"","type":"","note":"","presnap":"","audible":"","youthCue":"","mistake":""}';return 'Youth football OC: 6-play package. '+st+'. '+d+' Age/skill drive complexity. Types: RUN BASE,RUN PERIMETER,RUN MISDIRECTION,PASS PLAY ACTION,PASS QUICK GAME,RUN SHORT YARDAGE. JSON only: {"packageName":"","summary":"","plays":['+[1,2,3,4,5,6].map(n=>ps.replace('N',String(n))).join(',')+ '],"defenseTip":"","coachingCue":""}';},
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
    ],
    positions:['Point Guard','Shooting Guard','Small Forward','Power Forward','Center','Entire Team'],
    buildPrompt:(f)=>{const st=Object.keys(f).map(k=>k+': '+f[k]).join('; ');const ps='{"number":N,"name":"","type":"","note":"","presnap":"","audible":"","youthCue":"","mistake":""}';return 'Youth basketball coach: 5-play package. '+st+'. Age/skill drive complexity. Types: HALF COURT SET,TRANSITION,PRESS BREAK,OUT OF BOUNDS,QUICK HITTER. JSON only: {"packageName":"","summary":"","plays":['+[1,2,3,4,5].map(n=>ps.replace('N',String(n))).join(',')+ '],"defenseTip":"","coachingCue":""}';},
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
      {id:'defense',label:'Batting Order',opts:['Traditional Best at 3-4','Speedy Leadoff Heavy','Power Through Lineup','Youth Everyone Hits']},
      {id:'oppTendency',label:'Opponent Defensive Tendency',opts:['Unknown / Balanced','Standard Positioning','Pull-Side Shift Heavy','Five Man Infield Late','Aggressive Corner Charges','Outfield Plays Shallow','Pitcher Works Inside Heavy','Catcher Sets Up Away','Pitcher Changes Speeds Often','Challenges Hitters Early Count']},
    ],
    positions:['Pitcher','Catcher','First Baseman','Shortstop','Outfielder','Batter','Entire Team'],
    buildPrompt:(f)=>{const st=Object.keys(f).map(k=>k+': '+f[k]).join('; ');const ps='{"number":N,"name":"","type":"","note":"","presnap":"","audible":"","youthCue":"","mistake":""}';return 'Youth baseball coach: 5-play package. '+st+'. Age/skill drive complexity. Types: OFFENSIVE APPROACH,BASERUNNING SITUATION,BUNT PLAY,HIT AND RUN,FIRST AND THIRD. JSON only: {"packageName":"","summary":"","plays":['+[1,2,3,4,5].map(n=>ps.replace('N',String(n))).join(',')+ '],"defenseTip":"","coachingCue":""}';},
    scenarioPrompt:(diff)=>`You are a baseball coaching AI. Create a baseball scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. TOP 6TH RUNNER ON 2ND 1 OUT TIED 3-3","phase":"OFFENSE or PITCHING or DEFENSE or BULLPEN","question":"2-3 sentence baseball scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct.`,
  },
  Soccer: {
    emoji:'SC',
    formats:['11v11','9v9','7v7','5v5'],
    fields:[
      {id:'format',    label:'Game Format',       opts:['11v11 Standard','9v9 Youth','7v7 Youth','5v5 Futsal']},
      {id:'system',    label:'Playing Style',      opts:['Possession / Tiki-Taka','Direct / Counter','High Press','Park the Bus / Defensive','4-3-3 Attack','4-4-2 Classic','3-5-2 Wing Play']},
      {id:'age',       label:'Age Group',          opts:['U6-U8','U9-U10','U11-U12','U13-U14','U15-U16','High School']},
      {id:'skill',     label:'Skill Level',        opts:['Beginner','Average','Competitive','Elite']},
      {id:'focus',     label:'Training Focus',     opts:['Attacking Patterns','Defensive Shape','Set Pieces','Transitions','Pressing','Restarts','Goalkeeping']},
      {id:'formation', label:'Your Formation',     opts:['4-3-3','4-4-2','3-5-2','4-2-3-1','5-3-2','3-4-3','4-1-4-1']},
      {id:'oppShape',  label:'Opponent Shape',     opts:['Unknown / Balanced','4-4-2 Block','5-4-1 Defensive','4-3-3 High Press','4-2-3-1','3-5-2 Wings','Long Ball Direct']},
    ],
    positions:['Goalkeeper','Center Back','Full Back','Defensive Mid','Central Mid','Attacking Mid','Winger','Striker','Wing Back'],
    buildPrompt:(f)=>{const st=Object.keys(f).map(k=>k+': '+f[k]).join('; ');const ps='{"number":N,"name":"","type":"","note":"","presnap":"","audible":"","youthCue":"","mistake":""}';return 'Youth soccer coach: 5-play package. '+st+'. Age/skill drive complexity. Types: ATTACKING BUILDUP,SET PIECE ATTACK,CORNER KICK,FREE KICK,COUNTER ATTACK. JSON only: {"packageName":"","summary":"","plays":['+[1,2,3,4,5].map(n=>ps.replace('N',String(n))).join(',')+ '],"defenseTip":"","coachingCue":""}';},
    scenarioPrompt:(diff)=>`You are a soccer coaching AI. Create a youth soccer coaching scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. DOWN 1 GOAL 15 MIN LEFT ATTACKING","phase":"ATTACK or DEFENSE or SET PIECE or TRANSITION or TIMEOUT","question":"2-3 sentence scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct.`,
  },
  Softball: {
    emoji:'SB',
    fields:[
      {id:'system',    label:'Offensive Approach',  opts:['Small Ball','Power Hitting','Speed and Slap','Balanced','Bunting Focus','Rise Ball Heavy']},
      {id:'roster',    label:'Roster Size',         opts:['9-11 players','12-14 players','15+ players']},
      {id:'age',       label:'Age Group',           opts:['8U Coach Pitch','10U','12U','14U','16U','18U','High School']},
      {id:'skill',     label:'Skill Level',         opts:['Beginner','Average','Competitive']},
      {id:'focus',     label:'Defensive Focus',     opts:['Fundamentals First','Circle Defense','Outfield Reads','Bunt Defense','Slap Defense']},
      {id:'pitching',  label:'Pitching Style',      opts:['Rise Ball Dominant','Drop Ball Dominant','Change-Up Artist','Location Pitcher','Power Pitcher','Mixed Repertoire']},
      {id:'oppTendency',label:'Opponent Tendency',  opts:['Unknown / Balanced','Slap Hitters Heavy','Power Lineup','Bunt Every Opportunity','Free Swingers','Patient Takes Pitches','Aggressive First Pitch','Pull Hitters Only','Spray Hitters','Speed Team Steals Often']},
    ],
    positions:['Pitcher','Catcher','First Base','Second Base','Third Base','Shortstop','Left Field','Center Field','Right Field'],
    buildPrompt:(f)=>{const st=Object.keys(f).map(k=>k+': '+f[k]).join('; ');const ps='{"number":N,"name":"","type":"","note":"","presnap":"","audible":"","youthCue":"","mistake":""}';return 'Youth softball coach: 5-play package. '+st+'. Age/skill drive complexity. Types: OFFENSIVE APPROACH,BASERUNNING SITUATION,BUNT PLAY,HIT AND RUN,FIRST AND THIRD. JSON only: {"packageName":"","summary":"","plays":['+[1,2,3,4,5].map(n=>ps.replace('N',String(n))).join(',')+ '],"defenseTip":"","coachingCue":""}';},
    scenarioPrompt:(diff)=>`You are a softball coaching AI with knowledge of ASA/USA Softball rules. Create a coaching scenario. Difficulty: ${diff}. Return ONLY valid JSON: {"situation":"e.g. TOP 5TH RUNNER ON 2ND 1 OUT TIED 2-2","phase":"OFFENSE or PITCHING or DEFENSE or BASERUNNING","question":"2-3 sentence softball-specific scenario","options":[{"letter":"A","text":"option","correct":false},{"letter":"B","text":"option","correct":true},{"letter":"C","text":"option","correct":false},{"letter":"D","text":"option","correct":false}],"explanation":"2-3 sentence explanation"} Rules: exactly 1 correct.`,
  },

}


// ─── LOGO COMPONENT ──────────────────────────────────────────────────────────
function CoachIQLogo({ size=22, brand='Red — C+IQ colored' }) {
  const p = BRAND_PALETTES[brand] || BRAND_PALETTES['Red — C+IQ colored']
  const CIQ = p.accentOn === 'CIQ'
  const coloredC    = CIQ ? p.accent : '#f2f4f8'
  const coloredOach = CIQ ? '#f2f4f8' : p.accent
  const coloredIQ   = CIQ ? p.accent : '#f2f4f8'
  return (
    <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:size, letterSpacing:'-0.5px', lineHeight:1, whiteSpace:'nowrap', flexShrink:0 }}>
      <span style={{ color:coloredC }}>C</span>
      <span style={{ color:coloredOach }}>oach</span>
      <span style={{ color:coloredIQ }}>IQ</span>
    </div>
  )
}

// ─── SHARED UI ───────────────────────────────────────────────────────────────
function safeAccent(hex, fallback='#C0392B') {
  // Returns a version of hex that is always dark enough to be visible on dark backgrounds
  // and always different enough from white to be readable
  const h = safeHex(hex, fallback)
  const r = parseInt(h.slice(1,3),16)
  const g = parseInt(h.slice(3,5),16)
  const b = parseInt(h.slice(5,7),16)
  const luminance = (0.299*r + 0.587*g + 0.114*b) / 255
  if (luminance > 0.72) return fallback // too light — use fallback
  return h
}

function safeHex(val, fallback='#C0392B') {
  if (!val || typeof val !== 'string' || val === 'undefined' || val === 'null' || val.trim() === '') return fallback
  const v = val.trim()
  if (!v.startsWith('#')) return fallback
  if (v.length !== 4 && v.length !== 7) return fallback
  const full = v.length === 4 ? '#' + v[1]+v[1]+v[2]+v[2]+v[3]+v[3] : v
  const r = parseInt(full.slice(1,3),16)
  const g = parseInt(full.slice(3,5),16)
  const b = parseInt(full.slice(5,7),16)
  if ((r*299 + g*587 + b*114) / 1000 > 220) return fallback
  return full
}
function al(hex, a) {
  const h = safeHex(hex, '#000000')
  const r=parseInt(h.slice(1,3),16), g=parseInt(h.slice(3,5),16), b=parseInt(h.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}
function hexToRgba(hex, alpha) {
  const h = safeHex(hex, '#C0392B')
  const num = parseInt(h.slice(1), 16)
  return 'rgba(' + (num >> 16 & 255) + ',' + (num >> 8 & 255) + ',' + (num & 255) + ',' + alpha + ')'
}
function Card({ children, style={} }) {
  return <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, overflow:'hidden', animation:'fadeIn 0.3s ease', ...style }}>{children}</div>
}
function CardHead({ icon, title, tag, tagColor, accent='#C0392B' }) {
  const tc = tagColor||'#C0392B'
  return (
    <div style={{ padding:'11px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${accent||'#C0392B'}` }}>
      <span style={{ fontSize:15 }}>{icon}</span>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', color:'#f2f4f8', flex:1, textTransform:'uppercase' }}>{title}</span>
      {tag && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'1px', padding:'2px 7px', borderRadius:2, background:`rgba(${parseInt(tc.slice(1,3),16)},${parseInt(tc.slice(3,5),16)},${parseInt(tc.slice(5,7),16)},0.15)`, color:tc, textTransform:'uppercase' }}>{tag}</span>}
    </div>
  )
}
function PBtn({ onClick, disabled, children, color='#C0392B', style={} }) {
  const safeColor = color && color !== '' && color !== 'undefined' ? color : '#C0392B'
  return (
    <button onClick={onClick} disabled={disabled} style={{ width:'100%', background:disabled?'#3d4559':safeColor, color:'white', border:'none', borderRadius:4, padding:12, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'2px', cursor:disabled?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:disabled?0.6:1, textTransform:'uppercase', ...style }}>{children}</button>
  )
}
function Sel({ label, value, onChange, options }) {
  return (
    <div style={{ position:'relative', background:'#161922', border:'1px solid #1e2330', borderRadius:4 }}>
      <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, display:'block', paddingTop:6, paddingLeft:11, paddingRight:11 }}>{label}</label>
      <div style={{ position:'relative' }}>
        <select
          value={value}
          onChange={e=>onChange(e.target.value)}
          style={{
            width:'100%',
            padding:'10px 30px 10px 11px',
            color:'#f2f4f8',
            fontSize:13,
            background:'#161922',
            border:'none',
            borderRadius:4,
            outline:'none',
            appearance:'none',
            WebkitAppearance:'none',
            MozAppearance:'none',
            cursor:'pointer',
            minHeight:44,
            fontFamily:"'DM Sans',sans-serif",
            WebkitTapHighlightColor:'transparent',
          }}>
          {options.map(o => (
            <option key={o} value={o} style={{ background:'#161922', color:'#f2f4f8' }}>{o}</option>
          ))}
        </select>
        <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:9, color:'#8a94b0', pointerEvents:'none' }}>▾</span>
      </div>
    </div>
  )
}
function Shimmer() {
  return <div style={{ width:'100%', height:3, background:'linear-gradient(90deg,#C0392B,#002868,#C0392B)', backgroundSize:'200% 100%', borderRadius:0, margin:'10px 0', animation:'shimmer 1.2s linear infinite' }} />
}
function ErrBox({ msg }) {
  return <div style={{ marginTop:10, background:'#161922', border:'1px solid rgba(192,57,43,0.3)', borderRadius:4, padding:10, fontSize:11, color:'#8a94b0', wordBreak:'break-all' }}>Error: {msg}</div>
}

// ─── QUICK TOUR MODAL ─────────────────────────────────────────────────────────
function QuickTourModal({ onDone, P='#C0392B', al, setPage }) {
  const [step, setStep] = useState(0)
  const current = TUTORIAL_STEPS[step]
  const isLast = step === TUTORIAL_STEPS.length - 1
  const progress = ((step) / (TUTORIAL_STEPS.length - 1)) * 100

  function goTo(tabId) {
    if (tabId && setPage) setPage(tabId)
    if (!isLast) setStep(s => s + 1)
    else onDone()
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#0f1219', border:`1px solid ${al(P,0.4)}`, borderRadius:10, padding:24, width:'100%', maxWidth:400, animation:'fadeIn 0.2s ease' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', background:al(P,0.15), border:`2px solid ${P}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{current.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:al(P,0.7), letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Step {step + 1} of {TUTORIAL_STEPS.length}</div>
            <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:18, color:'#f2f4f8', lineHeight:1.1 }}>{current.title}</div>
          </div>
          <button onClick={onDone} style={{ background:'#161922', border:'none', color:'#5a6480', cursor:'pointer', fontSize:18, padding:4, flexShrink:0 }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ height:3, background:'#1e2330', borderRadius:2, marginBottom:16, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:P, borderRadius:2, transition:'width 0.3s ease' }}/>
        </div>

        {/* Description */}
        <div style={{ fontSize:13, color:'#dde1f0', lineHeight:1.7, marginBottom:14 }}>{current.desc}</div>

        {/* Tip */}
        {current.tip && (
          <div style={{ padding:'8px 12px', background:al(P,0.07), borderRadius:6, borderLeft:`3px solid ${al(P,0.4)}`, marginBottom:16 }}>
            <div style={{ fontSize:9, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:P, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:3 }}>💡 Coach Tip</div>
            <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.6 }}>{current.tip}</div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {current.action && (
            <button onClick={()=>goTo(current.action)} style={{ width:'100%', padding:'11px', background:P, border:'none', borderRadius:5, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:'1px' }}>
              {current.actionLabel || 'Go There →'}
            </button>
          )}
          <div style={{ display:'flex', gap:8 }}>
            {step > 0 && (
              <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:'9px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>← Back</button>
            )}
            <button onClick={()=>{ if(isLast) onDone(); else setStep(s=>s+1) }} style={{ flex:2, padding:'9px', background:current.action?'#0f1219':P, border:current.action?'1px solid #1e2330':'none', borderRadius:5, color:current.action?'#6b7a96':'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>
              {isLast ? 'Start Coaching! 🏈' : current.action ? 'Skip this step →' : 'Next →'}
            </button>
          </div>
          <button onClick={onDone} style={{ background:'#161922', border:'none', color:'#5a6480', cursor:'pointer', fontSize:11, fontFamily:"'Barlow Condensed',sans-serif", padding:'4px', textAlign:'center' }}>Exit tour</button>
        </div>
      </div>
    </div>
  )
}
function FeatureGuide({ P='#C0392B', al, onClose }) {
  const [activeSection, setActiveSection] = useState(0)

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:500, display:'flex', flexDirection:'column' }}>
      <div style={{ background:'#07090d', borderBottom:'1px solid #1e2330', padding:'14px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onClose} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#8a94b0', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>✕</button>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#f2f4f8', flex:1 }}>FEATURE GUIDE</div>
      </div>
      <div style={{ display:'flex', gap:0, overflowX:'auto', background:'#0a0c14', borderBottom:'1px solid #1e2330', padding:'8px 12px', flexShrink:0 }}>
        {FEATURE_GUIDE.map((s,i) => (
          <button key={i} onClick={()=>setActiveSection(i)} style={{ flexShrink:0, padding:'5px 12px', borderRadius:4, fontSize:11, border:`1px solid ${activeSection===i?P:'transparent'}`, background:activeSection===i?al(P,0.15):'transparent', color:activeSection===i?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginRight:4, whiteSpace:'nowrap' }}>
            {FEATURE_GUIDE[i].icon} {FEATURE_GUIDE[i].section}
          </button>
        ))}
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:16 }}>
        {FEATURE_GUIDE[activeSection].items.map((item,i) => (
          <div key={i} style={{ padding:'12px 14px', background:'#0f1219', border:'1px solid #1e2330', borderRadius:6, marginBottom:8, borderLeft:`3px solid ${P}` }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:'#f2f4f8', marginBottom:4 }}>{item.name}</div>
            <div style={{ fontSize:12, color:'#8a94b0', lineHeight:1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── FIRST-TIME WELCOME ───────────────────────────────────────────────────────
function FirstTimeWelcome({ onChoice, P, al }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:8, padding:28, width:'100%', maxWidth:360, textAlign:'center', animation:'fadeIn 0.3s ease' }}>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:32, marginBottom:6 }}>
          <span style={{ color:P }}>C</span><span style={{ color:'#f2f4f8' }}>oach</span><span style={{ color:P }}>IQ</span>
        </div>
        <div style={{ fontSize:13, color:'#8a94b0', lineHeight:1.6, marginBottom:24 }}>Welcome! How would you like to get started?</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={()=>onChoice('tour')} style={{ width:'100%', padding:'14px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:'1px' }}>⚡ QUICK TOUR — 6 steps</button>
          <button onClick={()=>onChoice('guide')} style={{ width:'100%', padding:'13px', background:'#0f1219', border:`1px solid ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:'1px' }}>📖 BROWSE FEATURE GUIDE</button>
          <button onClick={()=>onChoice('skip')} style={{ width:'100%', padding:'11px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#5a6480', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>Skip — I'll explore myself</button>
        </div>
      </div>
    </div>
  )
}


// ─── FOOTBALL HOLE NUMBER DIAGRAM ─────────────────────────────────────────────
function FootballHoleDiagram({ P }) {
  return (
    <div style={{ background:'#0f1117', borderRadius:6, padding:'10px 8px', marginTop:6 }}>
      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:P, fontWeight:700, marginBottom:6 }}>Hole Number Reference</div>
      <svg viewBox="0 0 280 80" style={{ width:'100%', maxWidth:280 }}>
        {/* Field line */}
        <line x1="10" y1="48" x2="270" y2="48" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4,3"/>
        {/* OL positions */}
        {[
          { x:80,  label:'LT' },
          { x:105, label:'LG' },
          { x:130, label:'C'  },
          { x:155, label:'RG' },
          { x:180, label:'RT' },
        ].map(pos => (
          <g key={pos.label}>
            <rect x={pos.x-10} y={38} width={20} height={20} rx={2} fill={P} opacity={0.85} />
            <text x={pos.x} y={52} textAnchor="middle" fill="white" fontSize={9} fontWeight="700" fontFamily="sans-serif">{pos.label}</text>
          </g>
        ))}
        {/* QB */}
        <circle cx={130} cy={68} r={9} fill={P} opacity={0.7} />
        <text x={130} y={72} textAnchor="middle" fill="white" fontSize={8} fontWeight="700" fontFamily="sans-serif">QB</text>
        {/* Hole numbers — between linemen */}
        {[
          { x:15,  n:'1', side:'L', color:'#4ade80' },
          { x:57,  n:'3', side:'L', color:'#4ade80' },
          { x:92,  n:'5', side:'L', color:'#4ade80' },
          { x:117, n:'1', side:'L', color:'#4ade80' },
          { x:142, n:'0', side:'',  color:'#f59e0b' },
          { x:167, n:'2', side:'R', color:'#6b9fff' },
          { x:192, n:'4', side:'R', color:'#6b9fff' },
          { x:217, n:'6', side:'R', color:'#6b9fff' },
          { x:255, n:'8', side:'R', color:'#6b9fff' },
        ].map((h, i) => (
          <g key={i}>
            <circle cx={h.x} cy={20} r={10} fill={h.color} opacity={0.2} />
            <text x={h.x} y={24} textAnchor="middle" fill={h.color} fontSize={11} fontWeight="900" fontFamily="sans-serif">{h.n}</text>
          </g>
        ))}
        {/* Labels */}
        <text x={50} y={12} textAnchor="middle" fill="#4ade80" fontSize={7} fontFamily="sans-serif" opacity={0.8}>ODD = LEFT</text>
        <text x={220} y={12} textAnchor="middle" fill="#6b9fff" fontSize={7} fontFamily="sans-serif" opacity={0.8}>EVEN = RIGHT</text>
        <text x={142} y={12} textAnchor="middle" fill="#f59e0b" fontSize={7} fontFamily="sans-serif" opacity={0.8}>0=QB SNEAK</text>
      </svg>
      <div style={{ fontSize:9, color:'#5a6480', marginTop:4, lineHeight:1.5 }}>Odd numbers run left, even numbers run right. The number tells the ball carrier which gap to hit.</div>
    </div>
  )
}


function PlayCard({ play, P='#C0392B', S='#002868', al, callAI, parseJSON, extraAction, preloadedDiagram=null }) {
  const [showSummary, setShowSummary] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showDiagram, setShowDiagram] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showRoles, setShowRoles] = useState(false)
  const [showVariations, setShowVariations] = useState(false)
  const [showNfl, setShowNfl] = useState(false)
  const [steps, setSteps] = useState(null)
  const [stepsLoading, setStepsLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [qaLoading, setQALoading] = useState(false)
  const [qaHistory, setQAHistory] = useState([])
  const [variations, setVariations] = useState(null)
  const [variationsLoading, setVariationsLoading] = useState(false)
  const [nflComp, setNflComp] = useState(null)
  const [nflLoading, setNflLoading] = useState(false)

  async function loadSteps() {
    if (steps) return
    // Check session cache first
    const stepsCacheKey = 'coachiq_steps_' + (play.name||'').replace(/\s/g,'_').slice(0,40)
    try {
      const cached = sessionStorage.getItem(stepsCacheKey)
      if (cached) { setSteps(JSON.parse(cached)); return }
    } catch(e) {}
    setStepsLoading(true)
    try {
      const isBBPlay = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('INBOUND') || play.type.includes('SET PLAY') || play.type.includes('FAST BREAK'))
      const isBSBPlay = !isBBPlay && play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING') || play.type.includes('OFFENSE SITUATIONAL') || play.type.includes('DEFENSE ALIGN'))
      const sportLabel = isBBPlay ? 'basketball' : isBSBPlay ? 'baseball' : 'football'
      const raw = await callAI('You are a youth ' + sportLabel + ' coach educator. Break down this play: ' + play.name + ' (' + play.type + '). ' + play.note + ' Return ONLY valid JSON with these exact keys: {"steps":["Step 1","Step 2","Step 3","Step 4","Step 5"],"keyCoachingPoints":["point 1","point 2"],"playerRoles":[{"position":"pos","job":"job","whyTheyDoIt":"explain why"},{"position":"pos2","job":"job","whyTheyDoIt":"explain why"},{"position":"pos3","job":"job","whyTheyDoIt":"explain why"}],"huddleCard":[{"player":"QB","instruction":"one sentence","termNote":""},{"player":"RB","instruction":"one sentence","termNote":""},{"player":"WR","instruction":"one sentence","termNote":""},{"player":"OL","instruction":"one sentence","termNote":""}]}')
      const parsedSteps = parseJSON(raw)
      try { sessionStorage.setItem(stepsCacheKey, JSON.stringify(parsedSteps)) } catch(e) {}
      setSteps(parsedSteps)
    } catch(e) { setSteps({ error: e.message }) }
    setStepsLoading(false)
  }

  async function loadVariations() {
    if (variations) { setShowVariations(true); return }
    const varCacheKey = 'coachiq_vars_' + (play.name||'').replace(/\s/g,'_').slice(0,40)
    try {
      const cached = sessionStorage.getItem(varCacheKey)
      if (cached) { setVariations(JSON.parse(cached)); setShowVariations(true); return }
    } catch(e) {}
    setVariationsLoading(true)
    try {
      const isBB = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('SET PLAY'))
      const isBSB = play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING'))
      const sportName = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
      const raw = await callAI('You are a ' + sportName + ' coordinator. Base play: "' + play.name + '" (' + play.type + '). ' + play.note + ' Generate 3 variations. Return ONLY valid JSON: {"variations":[{"name":"name","note":"what differs and when","changeFrom":"what changed"},{"name":"name","note":"note","changeFrom":"changed"},{"name":"name","note":"note","changeFrom":"changed"}]}')
      const parsedVars = parseJSON(raw).variations || []
      try { sessionStorage.setItem(varCacheKey, JSON.stringify(parsedVars)) } catch(e) {}
      setVariations(parsedVars)
      setShowVariations(true)
    } catch(e) { setVariations([]) }
    setVariationsLoading(false)
  }

  async function loadNflComp() {
    if (nflComp) { setShowNfl(true); return }
    setNflLoading(true)
    try {
      const isBB = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('SET PLAY'))
      const isBSB = play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING'))
      const league = isBB ? 'NBA' : isBSB ? 'MLB' : 'NFL'
      const sportName = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
      const raw = await callAI('Expert ' + sportName + ' analyst. Youth play: "' + play.name + '" (' + play.type + '). ' + play.note + ' Closest ' + league + ' equivalent. Return ONLY valid JSON: {"proPlay":"name","proTeam":"team","whatMatches":"what matches","keyDifference":"key diff","proTip":"one tip","watchFor":"YouTube search"}')
      setNflComp(parseJSON(raw))
      setShowNfl(true)
    } catch(e) { setNflComp({ error: e.message }); setShowNfl(true) }
    setNflLoading(false)
  }

  async function askQuestion() {
    if (!question.trim()) return
    setQALoading(true)
    const q = question.trim(); setQuestion('')
    try {
      const isBB = play.type && (play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') || play.type.includes('SET PLAY'))
      const isBSB = play.type && (play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('PITCHING'))
      const sportCtx = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
      const hist = qaHistory.map(i => 'Q: ' + i.q + '\nA: ' + i.a).join('\n\n')
      const raw = await callAI('Youth ' + sportCtx + ' coach on play "' + play.name + '" (' + play.type + '). ' + play.note + (hist ? '\n\nPrev:\n' + hist + '\n\n' : '\n\n') + 'Q: "' + q + '"\nAnswer in 2-4 sentences.')
      setQAHistory(prev => [...prev, { q, a: raw.trim() }])
    } catch(e) { setQAHistory(prev => [...prev, { q, a: 'Error: ' + e.message }]) }
    setQALoading(false)
  }

  function TabBtn({ label, active, onClick, color }) {
    const c = color || P
    return (
      <button onClick={onClick} style={{ padding:'5px 10px', background:active?c:'transparent', border:'1px solid ' + (active?c:'#1e2330'), borderRadius:4, color:active?'white':'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer', letterSpacing:'0.5px', whiteSpace:'nowrap', touchAction:'manipulation' }}>
        {label}
      </button>
    )
  }

  return (
    <div style={{ borderBottom:'1px solid #1e2330', padding:'12px 0' }}>

      {/* ── PLAY HEADER ── */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
        <div style={{ width:24, height:24, minWidth:24, background:P, color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{play.number}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#f2f4f8', lineHeight:1.2 }}>{play.name}</div>
          <div style={{ fontSize:10, color:'#8a94b0', fontFamily:"'DM Mono',monospace", marginTop:2 }}>{play.type}</div>
          <div style={{ fontSize:12, color:'#9aa0b0', marginTop:4, lineHeight:1.5 }}>{play.note}</div>
        </div>
        {extraAction && <span onClick={e=>e.stopPropagation()}>{extraAction}</span>}
      </div>

      {/* ── DIAGRAM — collapsed by default, expand on tap ── */}
      <div style={{ marginBottom:10 }}>
        {!showDiagram ? (
          /* ── Thumbnail preview — tap to expand ── */
          <div onClick={()=>setShowDiagram(true)} style={{ cursor:'pointer', position:'relative', borderRadius:6, overflow:'hidden', border:`1px solid ${hexToRgba(P,0.2)}`, background:'#0f1219' }}>
            {/* Mini static field */}
            <svg viewBox="0 0 280 100" style={{ width:'100%', display:'block', opacity:0.7 }}>
              <rect width="280" height="100" fill="#f4f4f0"/>
              {[0,1,2,3].map(i=><line key={i} x1={0} y1={20+i*22} x2={280} y2={20+i*22} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>)}
              <line x1={0} y1={64} x2={280} y2={64} stroke="rgba(0,0,0,0.3)" strokeWidth={1} strokeDasharray="6,4"/>
              <text x={8} y={61} fontSize={7} fill="rgba(0,0,0,0.25)">LOS</text>
              {/* Mini OL */}
              {[-24,-12,0,12,24].map((off,i)=>(
                <rect key={i} x={140+off-6} y={60} width={12} height={8} fill={P} rx={1} opacity={0.8}/>
              ))}
              {/* Mini skill players */}
              <circle cx={35} cy={62} r={5} fill={P} opacity={0.7}/>
              <circle cx={245} cy={62} r={5} fill={P} opacity={0.7}/>
              <circle cx={140} cy={74} r={5} fill={P} opacity={0.7}/>
              {/* Route suggestions */}
              <path d="M 35 57 L 35 35 L 55 22" fill="none" stroke={P} strokeWidth={1.5} opacity={0.5}/>
              <path d="M 245 57 L 245 35 L 225 22" fill="none" stroke={P} strokeWidth={1.5} opacity={0.5}/>
            </svg>
            {/* Overlay tap hint */}
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.35)' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:'1.5px', color:'white', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:14 }}>📐</span> TAP TO VIEW DIAGRAM
              </div>
            </div>
          </div>
        ) : (
          <div>
            <PlayAnimator play={play} P={P} callAI={callAI} parseJSON={parseJSON} autoLoad={true} key={play.name} preloadedData={preloadedDiagram} />
            <button onClick={()=>setShowDiagram(false)} style={{ width:'100%', marginTop:4, padding:'4px', background:'transparent', border:'none', color:'#5a6480', fontSize:10, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.5px' }}>▲ COLLAPSE DIAGRAM</button>
          </div>
        )}
      </div>

      {/* ── TOGGLE BUTTONS ── */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:(showSummary||showMore)?10:0 }}>
        <button onClick={()=>setShowSummary(v=>!v)} style={{ padding:'5px 12px', background:showSummary?P:'transparent', border:'1px solid ' + (showSummary?P:'#1e2330'), borderRadius:4, color:showSummary?'white':'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer' }}>
          📋 Summary {showSummary?'▲':'▼'}
        </button>
        <button onClick={()=>setShowMore(v=>!v)} style={{ padding:'5px 12px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer' }}>
          More {showMore?'▲':'▼'}
        </button>
      </div>

      {/* ── SUMMARY ── */}
      {showSummary && (
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:10, animation:'fadeIn 0.2s ease' }}>
          {play.presnap && (
            <div style={{ padding:'8px 10px', background:'rgba(74,222,128,0.06)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:6 }}>
              <div style={{ fontSize:10, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:3 }}>👁 Pre-Snap Read</div>
              <div style={{ fontSize:11, color:'#dde1f0', lineHeight:1.5 }}>{String(play.presnap||'')}</div>
            </div>
          )}
          {play.audible && (
            <div style={{ padding:'8px 10px', background:'rgba(251,191,36,0.06)', border:'1px solid rgba(251,191,36,0.2)', borderRadius:6 }}>
              <div style={{ fontSize:10, color:'#fbbf24', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:3 }}>📣 Audible</div>
              <div style={{ fontSize:11, color:'#dde1f0', lineHeight:1.5 }}>{String(play.audible||'')}</div>
            </div>
          )}
          {play.youthCue && (
            <div style={{ padding:'8px 10px', background:'rgba(107,154,255,0.06)', border:'1px solid rgba(107,154,255,0.2)', borderRadius:6 }}>
              <div style={{ fontSize:10, color:'#6b9fff', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:3 }}>🧒 Youth Cue</div>
              <div style={{ fontSize:11, color:'#dde1f0', lineHeight:1.5, fontStyle:'italic' }}>"{play.youthCue}"</div>
            </div>
          )}
          {play.mistake && (
            <div style={{ padding:'8px 10px', background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:6 }}>
              <div style={{ fontSize:10, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:3 }}>⚠️ Common Mistake</div>
              <div style={{ fontSize:11, color:'#dde1f0', lineHeight:1.5 }}>{String(play.mistake||'')}</div>
            </div>
          )}
        </div>
      )}

      {/* ── MORE ── */}
      {showMore && (
        <div style={{ animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
            <TabBtn label="Breakdown" active={showBreakdown} onClick={()=>{ const n=!showBreakdown; setShowBreakdown(n); if(n&&!steps) loadSteps() }} color='#6b9fff' />
            <TabBtn label="Player Roles" active={showRoles} onClick={()=>{ const n=!showRoles; setShowRoles(n); if(n&&!steps) loadSteps() }} color='#f59e0b' />
            <TabBtn label="Variations" active={showVariations||variationsLoading} onClick={()=>{ if(!showVariations&&!variationsLoading) loadVariations(); else { setShowVariations(false); } }} color='#c084fc' />
            <TabBtn label="Pro Look" active={showNfl} onClick={()=>{ if(!showNfl) loadNflComp(); else setShowNfl(false) }} color='#4ade80' />
          </div>

          {/* Breakdown */}
          {showBreakdown && (
            <div style={{ marginBottom:10 }}>
              {stepsLoading && (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0' }}>
                  <div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} />
                  <div style={{ fontSize:12, color:'#8a94b0' }}>Loading breakdown...</div>
                </div>
              )}
              {steps && !steps.error && steps.huddleCard && (
                <div style={{ background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:8, padding:12, marginBottom:8 }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:'#f59e0b', fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>📋 Huddle Card</div>
                  {steps.huddleCard.map((item,i) => (
                    <div key={i} style={{ display:'flex', gap:8, marginBottom:5, alignItems:'flex-start' }}>
                      <div style={{ minWidth:28, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:4, padding:'2px 4px', textAlign:'center', fontSize:9, fontWeight:800, color:'#f59e0b', flexShrink:0 }}>{item.player}</div>
                      <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5, flex:1 }}>{item.instruction}{item.termNote&&<span style={{ color:'#8a94b0', fontStyle:'italic' }}> ({item.termNote})</span>}</div>
                    </div>
                  ))}
                </div>
              )}
              {steps && !steps.error && steps.steps && (
                <div style={{ background:'#161922', borderRadius:8, padding:12, marginBottom:8 }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:P, fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>Step-by-Step</div>
                  {steps.steps.map((step,i) => (
                    <div key={i} style={{ display:'flex', gap:8, padding:'5px 0', borderBottom:i<steps.steps.length-1?'1px solid #1e2330':'none' }}>
                      <div style={{ width:16, height:16, minWidth:16, background:P, color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{i+1}</div>
                      <div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{step}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:8, padding:10 }}>
                <div style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Ask about this play</div>
                {qaHistory.map((item,i) => (
                  <div key={i} style={{ marginBottom:8 }}>
                    <div style={{ fontSize:11, color:P, fontWeight:600, marginBottom:2 }}>Q: {item.q}</div>
                    <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.5 }}>{item.a}</div>
                  </div>
                ))}
                <div style={{ display:'flex', gap:6 }}>
                  <input value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&question.trim())askQuestion()}} placeholder="e.g. Who runs the ball?" style={{ flex:1, background:'#0f1117', border:'1px solid #1e2330', borderRadius:5, padding:'7px 10px', color:'#f2f4f8', fontSize:12, outline:'none' }} />
                  <button onClick={askQuestion} disabled={qaLoading||!question.trim()} style={{ padding:'0 12px', background:qaLoading||!question.trim()?'#3d4559':P, color:'white', border:'none', borderRadius:5, fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, cursor:qaLoading||!question.trim()?'not-allowed':'pointer', flexShrink:0 }}>ASK</button>
                </div>
              </div>
            </div>
          )}

          {/* Player Roles */}
          {showRoles && (
            <div style={{ marginBottom:10 }}>
              {stepsLoading && (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0' }}>
                  <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid #f59e0b', borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} />
                  <div style={{ fontSize:12, color:'#8a94b0' }}>Loading player roles...</div>
                </div>
              )}
              {steps && !steps.error && steps.playerRoles && steps.playerRoles.map((role,i) => (
                <div key={i} style={{ marginBottom:8, padding:'10px 12px', background:'rgba(245,158,11,0.06)', borderRadius:8, border:'1px solid rgba(245,158,11,0.15)' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:4 }}>
                    <div style={{ background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', color:'#f59e0b', borderRadius:5, padding:'3px 6px', fontSize:9, fontWeight:800, flexShrink:0, maxWidth:72, lineHeight:1.3, textAlign:'center', wordBreak:'break-word' }}>{role.position}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8', flex:1, lineHeight:1.4 }}>{role.job}</div>
                  </div>
                  <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.6, paddingLeft:80, fontStyle:'italic' }}>"{role.whyTheyDoIt}"</div>
                </div>
              ))}
            </div>
          )}

          {/* Variations */}
          {(showVariations || variationsLoading) && (
            <div style={{ marginBottom:10 }}>
              {variationsLoading && (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0' }}>
                  <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid #c084fc', borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} />
                  <div style={{ fontSize:12, color:'#8a94b0' }}>Generating variations...</div>
                </div>
              )}
              {variations && variations.map((v,i) => (
                <div key={i} style={{ padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:8, marginBottom:6 }}>
                  <div style={{ display:'flex', gap:8, marginBottom:3 }}>
                    <div style={{ width:16, height:16, background:P, color:'white', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0 }}>{i+1}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#f2f4f8' }}>{v.name}</div>
                  </div>
                  {v.changeFrom && <div style={{ fontSize:10, color:P, marginBottom:2, paddingLeft:24 }}>Changed: {v.changeFrom}</div>}
                  <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.5, paddingLeft:24 }}>{v.note}</div>
                </div>
              ))}
            </div>
          )}

          {/* Pro Look */}
          {showNfl && (
            <div style={{ marginBottom:10 }}>
              {nflLoading && (
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0' }}>
                  <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid #4ade80', borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} />
                  <div style={{ fontSize:12, color:'#8a94b0' }}>Finding pro comparison...</div>
                </div>
              )}
              {nflComp && !nflComp.error && (
                <div style={{ background:'rgba(74,222,128,0.06)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:8, padding:12 }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:'#4ade80', fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>🏆 Pro Comparison</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#f2f4f8', marginBottom:2 }}>{nflComp.proPlay}</div>
                  {nflComp.proTeam && <div style={{ fontSize:11, color:'#4ade80', marginBottom:6 }}>{nflComp.proTeam}</div>}
                  {nflComp.whatMatches && <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.5, marginBottom:4 }}><span style={{ color:'#4ade80', fontWeight:600 }}>Matches: </span>{nflComp.whatMatches}</div>}
                  {nflComp.keyDifference && <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.5, marginBottom:4 }}><span style={{ color:'#ef4444', fontWeight:600 }}>Difference: </span>{nflComp.keyDifference}</div>}
                  {nflComp.proTip && <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.5 }}><span style={{ color:'#f59e0b', fontWeight:600 }}>Tip: </span>{nflComp.proTip}</div>}
                  {nflComp.watchFor && <a href={'https://www.youtube.com/results?search_query='+encodeURIComponent(nflComp.watchFor)} target="_blank" rel="noopener noreferrer" style={{ display:'block', marginTop:8, fontSize:10, color:'#ef4444', textDecoration:'none', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>▶ Watch: {nflComp.watchFor}</a>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

// ─── PLAY ANIMATOR ────────────────────────────────────────────────────────────
function PlayAnimator({ play, P='#C0392B', callAI, parseJSON, autoLoad=false, preloadedData=null }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const [parsed, setParsed] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const cacheKey = 'coachiq_anim2_' + (play?.name||'').replace(/\s/g,'_').slice(0,30)

  // Detect sport from play type
  const isBasketball = !!(play?.type && (
    play.type.includes('COURT') || play.type.includes('PRESS') || play.type.includes('BREAK') ||
    play.type.includes('INBOUND') || play.type.includes('SET PLAY') || play.type.includes('FAST BREAK') ||
    play.type.includes('TRANSITION') || play.type.includes('QUICK HITTER') || play.type.includes('MOTION') ||
    play.type.includes('HALF COURT') || play.type.includes('ZONE ATTACK')
  ))
  const isBaseball = !isBasketball && !!(play?.type && (
    play.type.includes('BATTING') || play.type.includes('BASERUN') || play.type.includes('BUNT') ||
    play.type.includes('HIT AND RUN') || play.type.includes('FIRST AND THIRD') || play.type.includes('STEAL') ||
    play.type.includes('PITCHING') || play.type.includes('DEFENSE ALIGN') || play.type.includes('OFFENSIVE APPROACH')
  ))

  useEffect(() => {
    if (preloadedData) { setParsed(preloadedData); return }
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) { setParsed(JSON.parse(cached)); return }
    } catch(e) {}
    if (autoLoad) generateAnim()
  }, [play?.name, preloadedData])

  async function generateAnim() {
    setLoading(true); setError(null); setParsed(null)

    // ── COORDINATE SYSTEM ────────────────────────────────────────────────────
    // x: 0=left, 100=right  (both sports)
    // y: 0=top of canvas, 60=bottom of canvas
    // FOOTBALL: offense lines up at y=42 (LOS=dashed line), attacks UPWARD toward y=0 (defense side)
    //   - Forward routes go to LOWER y values (y=30, y=20, y=10)
    //   - Defenders line up at y=34-38, safeties at y=14-24
    // BASKETBALL: basket at y=6 (top), offense attacks upward (lower y = closer to basket)
    // BASEBALL: diamond drawn with home at y=50, CF at y=8 (top)

    const fbTemplate = JSON.stringify({
      formation:"PLAYNAME", snapPoint:0.18, duration:3200,
      players:[
        {id:"QB",  label:"QB", role:"off", routeType:"route", x:50, y:44, path:[[50,44],[50,40]], routeName:"Handoff", routeYards:0},
        {id:"RB",  label:"RB", role:"off", routeType:"route", x:47, y:47, path:[[47,47],[44,41],[42,34],[42,26]], routeName:"Run", routeYards:8},
        {id:"WR1", label:"WR", role:"off", routeType:"route", x:18, y:42, path:[[18,42],[18,32],[24,26]], routeName:"Curl", routeYards:0},
        {id:"WR2", label:"WR", role:"off", routeType:"route", x:82, y:42, path:[[82,42],[82,26]], routeName:"Go", routeYards:0},
        {id:"TE",  label:"TE", role:"off", routeType:"block", x:64, y:42, path:[[64,42],[62,38]], routeName:"Block", routeYards:0},
        {id:"LT",  label:"T",  role:"off", routeType:"block", x:38, y:42, path:[[38,42],[38,38]], routeName:"", routeYards:0},
        {id:"LG",  label:"G",  role:"off", routeType:"block", x:44, y:42, path:[[44,42],[44,38]], routeName:"", routeYards:0},
        {id:"C",   label:"C",  role:"off", routeType:"block", x:50, y:42, path:[[50,42],[50,38]], routeName:"", routeYards:0},
        {id:"RG",  label:"G",  role:"off", routeType:"block", x:56, y:42, path:[[56,42],[56,38]], routeName:"", routeYards:0},
        {id:"RT",  label:"T",  role:"off", routeType:"block", x:62, y:42, path:[[62,42],[62,38]], routeName:"", routeYards:0},
        {id:"d1",  label:"D",  role:"def", routeType:"block", x:44, y:36, path:[[44,36],[44,38]], routeName:"Gap A", routeYards:0},
        {id:"d2",  label:"D",  role:"def", routeType:"block", x:50, y:36, path:[[50,36],[50,38]], routeName:"Gap A", routeYards:0},
        {id:"d3",  label:"D",  role:"def", routeType:"block", x:56, y:36, path:[[56,36],[56,38]], routeName:"Gap B", routeYards:0},
        {id:"d4",  label:"LB", role:"def", routeType:"route", x:42, y:28, path:[[42,28],[42,34]], routeName:"Hook Zone", routeYards:0},
        {id:"d5",  label:"LB", role:"def", routeType:"route", x:58, y:28, path:[[58,28],[58,34]], routeName:"Hook Zone", routeYards:0},
        {id:"d6",  label:"CB", role:"def", routeType:"route", x:18, y:38, path:[[18,38],[18,30]], routeName:"Man", routeYards:0},
        {id:"d7",  label:"CB", role:"def", routeType:"route", x:82, y:38, path:[[82,38],[82,30]], routeName:"Man", routeYards:0},
        {id:"d8",  label:"S",  role:"def", routeType:"route", x:50, y:18, path:[[50,18],[50,24]], routeName:"Deep Middle", routeYards:0}
      ]
    })

    const bbTemplate = JSON.stringify({
      formation:"PLAYNAME", snapPoint:0.15, duration:3500,
      players:[
        {id:"PG", label:"1", role:"off", routeType:"route", x:50, y:50, path:[[50,50],[50,38]], routeName:"BALL: Dribble up", routeYards:0},
        {id:"SG", label:"2", role:"off", routeType:"route", x:72, y:44, path:[[72,44],[78,30]], routeName:"CUT: Wing", routeYards:0},
        {id:"SF", label:"3", role:"off", routeType:"route", x:82, y:36, path:[[82,36],[85,24]], routeName:"SHOOT: Corner", routeYards:0},
        {id:"PF", label:"4", role:"off", routeType:"block", x:62, y:20, path:[[62,20],[62,20]], routeName:"SCREEN: High", routeYards:0},
        {id:"C5", label:"5", role:"off", routeType:"block", x:50, y:14, path:[[50,14],[50,14]], routeName:"MOVE: Post", routeYards:0},
        {id:"d1", label:"D", role:"def", routeType:"block", x:50, y:52, path:[[50,52],[50,53]], routeName:"", routeYards:0},
        {id:"d2", label:"D", role:"def", routeType:"block", x:72, y:46, path:[[72,46],[72,47]], routeName:"", routeYards:0},
        {id:"d3", label:"D", role:"def", routeType:"block", x:82, y:38, path:[[82,38],[82,39]], routeName:"", routeYards:0},
        {id:"d4", label:"D", role:"def", routeType:"block", x:62, y:22, path:[[62,22],[62,23]], routeName:"", routeYards:0},
        {id:"d5", label:"D", role:"def", routeType:"block", x:50, y:16, path:[[50,16],[50,17]], routeName:"", routeYards:0}
      ]
    })

    const bsbTemplate = JSON.stringify({
      formation:"PLAYNAME", snapPoint:0.2, duration:3000,
      players:[
        {id:"P",   label:"P",  role:"off", routeType:"block", x:50, y:28, path:[[50,28],[50,28]], routeName:"Pitch", routeYards:0},
        {id:"C",   label:"C",  role:"off", routeType:"block", x:50, y:44, path:[[50,44],[50,44]], routeName:"Receive", routeYards:0},
        {id:"1B",  label:"1B", role:"off", routeType:"block", x:74, y:38, path:[[74,38],[74,38]], routeName:"Hold", routeYards:0},
        {id:"2B",  label:"2B", role:"off", routeType:"block", x:64, y:26, path:[[64,26],[64,26]], routeName:"Cover", routeYards:0},
        {id:"SS",  label:"SS", role:"off", routeType:"block", x:38, y:28, path:[[38,28],[38,28]], routeName:"Cover", routeYards:0},
        {id:"3B",  label:"3B", role:"off", routeType:"block", x:26, y:38, path:[[26,38],[26,38]], routeName:"Hold", routeYards:0},
        {id:"LF",  label:"LF", role:"off", routeType:"block", x:20, y:10, path:[[20,10],[20,10]], routeName:"Pos", routeYards:0},
        {id:"CF",  label:"CF", role:"off", routeType:"block", x:50, y:6,  path:[[50,6],[50,6]],   routeName:"Pos", routeYards:0},
        {id:"RF",  label:"RF", role:"off", routeType:"block", x:80, y:10, path:[[80,10],[80,10]], routeName:"Pos", routeYards:0},
        {id:"BAT", label:"B",  role:"def", routeType:"route", x:50, y:46, path:[[50,46],[62,36]], routeName:"Run to 1B", routeYards:0}
      ]
    })

    const isDefPlay = play._isDefense === true
    const isDisguise = play._isDisguise === true

    let prompt
    if (isDisguise) {
      prompt = 'Generate a DISGUISE defensive football diagram for: ' + play.name + '. ' + play.note +
        ' COORDINATE SYSTEM: x=0-100 left-right, y=0-60 top-bottom. Offense at y=42 (LOS). Defense attacks DOWNWARD (higher y). Defenders start in fake look, then move to true assignment after snapPoint 0.40.' +
        ' routeName format: "FAKE: description" for pre-snap look, "TRUE: description" for real assignment.' +
        ' Return ONLY raw JSON: {"formation":"' + play.name.replace(/"/g,'') + '","snapPoint":0.40,"duration":3500,"players":[' +
        '{"id":"DEa","label":"DE","role":"def","routeType":"route","x":38,"y":34,"path":[[38,34],[42,30],[38,38]],"routeName":"FAKE: Walk up","routeYards":0},' +
        '{"id":"DTa","label":"DT","role":"def","routeType":"block","x":45,"y":34,"path":[[45,34],[45,38]],"routeName":"TRUE: Gap A","routeYards":0},' +
        '{"id":"MLB","label":"MLB","role":"def","routeType":"route","x":50,"y":26,"path":[[50,26],[50,26],[50,32]],"routeName":"TRUE: Hook Zone","routeYards":0},' +
        '{"id":"CBa","label":"CB","role":"def","routeType":"route","x":12,"y":34,"path":[[12,34],[12,28],[12,22]],"routeName":"FAKE: Press","routeYards":0},' +
        '{"id":"FS","label":"FS","role":"def","routeType":"route","x":50,"y":14,"path":[[50,14],[50,14],[50,20]],"routeName":"TRUE: Deep Middle","routeYards":0},' +
        '{"id":"OC","label":"C","role":"off","routeType":"block","x":50,"y":42,"path":[[50,42],[50,42]],"routeName":"","routeYards":0},' +
        '{"id":"OTa","label":"T","role":"off","routeType":"block","x":38,"y":42,"path":[[38,42],[38,42]],"routeName":"","routeYards":0},' +
        '{"id":"OTb","label":"T","role":"off","routeType":"block","x":62,"y":42,"path":[[62,42],[62,42]],"routeName":"","routeYards":0}]}'
    } else if (isDefPlay) {
      prompt = 'Generate DEFENSIVE football diagram for: ' + play.name + ' (' + play.type + '). ' + play.note +
        ' COORDINATE SYSTEM: x=0-100 left-right, y=0-60 top-bottom. Offense at y=42 (LOS). Defense lines up at y=34-38. Safeties at y=12-22. Deep zones at y=10-22. LBs at y=26-32.' +
        ' Defender movement: DL attack DOWNWARD (y increases toward offense). Coverage defenders drop UPWARD (y decreases = deeper).' +
        ' Include 5 static offensive linemen as reference. Return ONLY raw JSON: {"formation":"' + play.name.replace(/"/g,'') + '","snapPoint":0.15,"duration":3000,"players":[' +
        '{"id":"DEa","label":"DE","role":"def","routeType":"block","x":36,"y":34,"path":[[36,34],[34,38]],"routeName":"Gap B","routeYards":0},' +
        '{"id":"DTa","label":"DT","role":"def","routeType":"block","x":44,"y":34,"path":[[44,34],[44,38]],"routeName":"Gap A","routeYards":0},' +
        '{"id":"DTb","label":"DT","role":"def","routeType":"block","x":56,"y":34,"path":[[56,34],[56,38]],"routeName":"Gap A","routeYards":0},' +
        '{"id":"DEb","label":"DE","role":"def","routeType":"block","x":64,"y":34,"path":[[64,34],[66,38]],"routeName":"Gap B","routeYards":0},' +
        '{"id":"WLB","label":"WLB","role":"def","routeType":"route","x":34,"y":28,"path":[[34,28],[30,34]],"routeName":"Flat Zone","routeYards":0},' +
        '{"id":"MLB","label":"MLB","role":"def","routeType":"route","x":50,"y":26,"path":[[50,26],[50,32]],"routeName":"Hook Zone","routeYards":0},' +
        '{"id":"SLB","label":"SLB","role":"def","routeType":"route","x":66,"y":28,"path":[[66,28],[70,34]],"routeName":"Flat Zone","routeYards":0},' +
        '{"id":"CBa","label":"CB","role":"def","routeType":"route","x":14,"y":36,"path":[[14,36],[14,24]],"routeName":"Man Coverage","routeYards":0},' +
        '{"id":"CBb","label":"CB","role":"def","routeType":"route","x":86,"y":36,"path":[[86,36],[86,24]],"routeName":"Man Coverage","routeYards":0},' +
        '{"id":"SS","label":"SS","role":"def","routeType":"route","x":66,"y":20,"path":[[66,20],[58,26]],"routeName":"Deep Half","routeYards":0},' +
        '{"id":"FS","label":"FS","role":"def","routeType":"route","x":34,"y":14,"path":[[34,14],[42,20]],"routeName":"Deep Half","routeYards":0},' +
        '{"id":"OLT","label":"T","role":"off","routeType":"block","x":38,"y":42,"path":[[38,42],[38,42]],"routeName":"","routeYards":0},' +
        '{"id":"OLG","label":"G","role":"off","routeType":"block","x":44,"y":42,"path":[[44,42],[44,42]],"routeName":"","routeYards":0},' +
        '{"id":"OC","label":"C","role":"off","routeType":"block","x":50,"y":42,"path":[[50,42],[50,42]],"routeName":"","routeYards":0},' +
        '{"id":"ORG","label":"G","role":"off","routeType":"block","x":56,"y":42,"path":[[56,42],[56,42]],"routeName":"","routeYards:0},' +
        '{"id":"ORT","label":"T","role":"off","routeType":"block","x":62,"y":42,"path":[[62,42],[62,42]],"routeName":"","routeYards":0}]}'
    } else if (isBasketball) {
      prompt = 'Generate basketball play diagram for: ' + play.name + ' (' + play.type + '). ' + play.note +
        ' COORDINATE SYSTEM: x=0-100 left-right, y=0-60 top-bottom. Basket at y=6 (top). Half court line at y=55. Players attack UPWARD (toward lower y = toward basket).' +
        ' CRITICAL: ONE player routeName starts with BALL: (has ball), ONE starts with SHOOT: (receives for shot), others use CUT:, MOVE:, or SCREEN:.' +
        ' Return ONLY raw JSON using this template: ' + bbTemplate.replace('PLAYNAME', play.name)
    } else if (isBaseball) {
      prompt = 'Generate baseball/softball field diagram for: ' + play.name + ' (' + play.type + '). ' + play.note +
        ' COORDINATE SYSTEM: x=0-100 left-right, y=0-60 top-bottom. Home plate at y=50 x=50. First base at y=36 x=74. Second base at y=22 x=50. Third base at y=36 x=26. Pitcher mound at y=34 x=50. Show all 9 fielders in correct positions plus batter movement.' +
        ' Return ONLY raw JSON using this template: ' + bsbTemplate.replace('PLAYNAME', play.name)
    } else {
      prompt = 'You are an NFL offensive coordinator generating a precise football play diagram. Play: ' + play.name + ' (' + play.type + '). Description: ' + play.note +
        '\n\nCOORDINATE SYSTEM: x=0-100 left-right, y=0-60 top-bottom. LOS at y=42 (offense) and y=38 (dashed line). Attacking direction = LOWER y (toward y=0). Defenders at y=34-38, LBs at y=26-32, safeties y=12-22.' +
        '\n\nCRITICAL — DIAGRAM ACCURACY IS EVERYTHING: This diagram must be a direct, accurate schematic of the specific play called. Every player position, every route, every blocking assignment, every path must match what this play actually looks like when drawn up on a real whiteboard by an NFL or college coach. An NFL coach must be able to look at this and recognize it immediately.' +
        '\n\nSCHEME SPECIFICITY: The play was generated for a specific system, personnel, and age group as described in the play name and note. Honor this completely — a Wing-T play looks different from a Spread play. A youth 6-8yr play has simpler assignments than a High School Varsity play. The formation, personnel grouping, and blocking scheme must all reflect the actual system this play belongs to, not a generic template.' +
        '\n\nFORMATION AND ALIGNMENT: Place every player in their correct pre-snap alignment for this specific play and formation. Get the formation right first — spread, I-formation, pistol, shotgun, Wing-T, single wing, etc. Spacing between OL should be realistic (about 3 units apart). WRs split wide at x=10-20 and x=80-90 unless slot or tight formation. TE tight to tackle at x=65-68 or off-ball. FB lined up at y=47-48 directly behind C in I-formation, or offset in other sets. HB/RB at y=50-52 in I, or offset in other backfield sets. QB under center at y=44, or y=46 in shotgun with snap distance.' +
        '\n\nROUTE AND BLOCKING ACCURACY: Every route must match the actual route concept for this play. Inside zone = OL all step playside, no pulling. Outside zone = OL reach block playside. Counter = backside G and T pull. Power = one guard pulls, FB kicks out. Trap = opposite guard pulls and traps. Sweep = multiple blockers lead outside. Pass plays = correct route combinations (flood, mesh, smash, four verts, etc). Every assignment must be what a real coach would draw.' +
        '\n\nPATH RULES:' +
        '\n• All offense attacking forward (runs/routes/OL blocks) = LOWER y.' +
        '\n• QB DROPBACK = HIGHER y (moving away from LOS). 3-step: y=44→50. 5-step: y=44→53. 7-step: y=44→57. NEVER lower y on a pass drop.' +
        '\n• DL charge = higher y. Coverage drops = lower y (deeper).' +
        '\n\nROUTE SHAPE LIBRARY — use these exact shapes, scaled to the WR alignment:' +
        '\n• HITCH/COMEBACK: stem 4-6 yds upfield (lower y), then sharp break BACK toward LOS (higher y). Left WR hitch: [[18,42],[18,32],[18,38]]. Break back toward where they came from.' +
        '\n• SLANT: 2-step stem upfield (lower y by ~4), then sharp 45° diagonal break INWARD toward the middle of the field. Left WR slant: [[18,42],[18,38],[32,30]]. Right WR slant: [[82,42],[82,38],[68,30]]. Slant goes INSIDE toward center, never toward the sideline.' +
        '\n• OUT/QUICK OUT: stem 4-8 yds upfield (lower y), then sharp 90° break toward the SIDELINE (x decreases for left WR, x increases for right WR). Left WR out: [[18,42],[18,34],[8,34]]. Right WR out: [[82,42],[82,34],[92,34]].' +
        '\n• CURL/HOOK: stem 8-10 yds upfield (lower y), then curl back toward LOS facing QB. Left WR curl: [[18,42],[18,28],[18,34]]. The break back is less sharp than a hitch — receiver faces QB.' +
        '\n• DIG/IN/CROSS: stem 10-14 yds upfield, then sharp 90° break INWARD across the field. Left WR dig: [[18,42],[18,22],[55,22]]. Crosses the hash marks.' +
        '\n• POST: stem 10-12 yds upfield, then break diagonally INWARD toward the goalpost (lower y AND toward center). Left WR post: [[18,42],[18,22],[40,8]].' +
        '\n• CORNER: stem 10-12 yds upfield, then break diagonally OUTWARD toward the corner of the field (lower y AND toward sideline). Left WR corner: [[18,42],[18,22],[6,8]].' +
        '\n• FLY/GO: straight vertical, no break, just lower y continuously. [[18,42],[18,20],[18,6]].' +
        '\n• SEAM (TE/slot): straight vertical inside the numbers. [[65,42],[65,20],[65,8]].' +
        '\n• WHEEL (RB): flat route to the flat then vertical up the sideline. RB right wheel: [[52,50],[70,44],[70,26]].' +
        '\n• SWING/FLAT (RB): quick horizontal to the flat. RB right swing: [[52,50],[72,46],[78,42]].' +
        '\nADJUST depth and break point based on the specific play concept — a WR in tight slot alignment runs a shorter stem than one split wide. A 3-step game uses shallower depths than a 7-step concept. The play concept and formation drive the exact coordinates, not just these templates.' +
        '\n\npathDelay field rules — ONLY assign non-zero when the play actually requires it:' +
        '\n• DEFAULT is pathDelay:0 for almost every player on almost every play.' +
        '\n• Pulling linemen (G or T who pull on counter/power/trap): pathDelay:0. They fire ON the snap — they just pull laterally instead of straight ahead. Their path shows the pull route (lateral then upfield). NEVER negative pathDelay for any lineman.' +
        '\n• Ball carrier (RB on runs): pathDelay:0.10. Reads the block then hits the hole.' +
        '\n• Deep routes (post, corner, go over 12 yds): pathDelay:0.06. Stem before breaking.' +
        '\n• PRE-SNAP MOTION: ONLY assign pathDelay:-0.30 if the play name or description explicitly mentions motion (jet motion, fly motion, orbit motion, shifting). Motion is ONLY for eligible receivers (WR, TE, slot, H-back). NEVER for C, G, T, or QB. Motion path must be purely lateral (y stays flat) or backward (y increases). MOST PLAYS HAVE NO PRE-SNAP MOTION — default is no motion.' +
        '\n\nPRIMARY RECEIVER: On ALL pass plays, exactly ONE receiver must have routeYards > 0 — this marks them as the primary read/target. Set routeYards to the expected catch depth in yards (e.g. slant = 5, curl = 10, post = 18, go = 25). All other receivers get routeYards:0. This is critical for the throw animation to identify the target correctly.' +
        '\n\nRECEIVER ALIGNMENT AND COLLISION AVOIDANCE: WRs always start OUTSIDE the offensive tackles (OL occupies x=36-64). Left WR starts at x=10-22, right WR at x=78-90. Slot WR starts at x=24-34 or x=66-76. On short routes (slant, hitch, quick out, smoke under 6 yards): the receiver path must NEVER cross through x=36-64 (the OL body zone) — route must stay outside or above the OL. A slant from the left WR goes from x=18,y=42 diagonally to x=32,y=32 — staying outside-to-inside but ABOVE the LOS and outside OL. It does NOT cut through the linemen. On crossing routes (dig, mesh, cross over 8 yards): receiver crosses through x=36-64 only AFTER clearing y=32 (well past the OL line of engagement at y=38-42). Linemen never end up in front of skill players on pass plays.' +
        '\n\nPLAY ACTION — THE PLAY DICTATES EVERYTHING:' +
        '\n  The PA concept in the play name/description determines what the QB and RB do. Read the play description carefully.' +
        '\n  BOOTLEG/ROLLOUT: QB fakes in one direction, then rolls OUT to the opposite edge or same edge depending on the scheme. y INCREASES (moving backward). Left bootleg ends x=20-28, y=48-52. Right bootleg ends x=72-80, y=48-52.' +
        '\n  DROPBACK PA (pocket PA): QB fakes, then drops straight back. y increases. Ends x=50, y=52-56.' +
        '\n  QB FAKE PATH: 2-3 short steps toward the RB/run direction (x shifts, y stays ~44), then pivots to the drop/rollout.' +
        '\n  RB ROLE IS PLAY-SPECIFIC — the play description tells you what the RB does:' +
        '\n    • If RB is the run fake: RB drives hard in the primary run direction (lower y, toward run lane) for 3-4 steps, then stops or swings as checkdown.' +
        '\n    • If RB is a checkdown/wheel: RB swings to the flat on the bootleg side.' +
        '\n    • If RB is misdirection: RB goes opposite direction from QB.' +
        '\n    • Read the play name and description to determine which applies.' +
        '\n  QB and RB should NOT both go the same direction unless the play specifically calls for it (e.g. sprint draw fake where both initially go same way). On most PA bootlegs, QB fakes to the run side then rolls away, RB continues the fake into the run lane.' +
        '\n  NEVER lower y for QB on any pass play. routeName: "PA Bootleg Left", "PA Bootleg Right", or "PA Drop".' +
        '\n\nPA PASS THROW: On play action plays, the drawPassIndicator will fire — make sure one receiver has routeYards > 0 so the throw animates correctly. The primary target is typically a crossing route or the backside TE on a seam.' +
        '\n\nQB PURE DROPBACK: HIGHER y only (moving away from LOS). 3-step: [[50,44],[50,47],[50,50]]. 5-step: [[50,44],[50,48],[50,53]]. 7-step: [[50,44],[50,49],[50,56]]. NEVER lower y on any pure pass.' +
        '\n\nQB FOOTWORK ON RUN PLAYS — based on real NFL mechanics:' +
        '\nQB SNEAK / DIVE (play name contains sneak, dive, plunge, wedge, or short yardage QB run): QB is UNDER CENTER. QB starts at y=44 directly behind center. On a sneak, QB simply dives forward through the A-gap — path: [[50,44],[50,40],[50,36]]. No handoff, no fake. This is the ONLY play where QB goes to lower y with no fake. QB label stays at y=44 at snap.' +
        '\nUNDER CENTER HANDOFF (QB starts y=44): QB opens to playside (pivot), takes 1-2 short steps toward RB, extends ball at mesh point, then carries out FAKE in the OPPOSITE direction. Inside zone left: [[50,44],[47,43],[44,42],[48,43]].' +
        '\nPISTOL FORMATION (QB starts y=46-48, RB directly behind at y=52-54): QB is 3-4 yards off ball, closer than shotgun. Zone read pistol left: [[50,46],[47,46],[44,45],[48,46]].' +
        '\nSHOTGUN ZONE READ (QB starts y=50-52): J-step lateral (y stays ~50), holds for mesh, decoy step after. [[50,50],[47,50],[44,49],[48,50]] for zone read left.' +
        '\nCRITICAL: QB should NOT move forward toward LOS before handoff EXCEPT on a sneak/dive where the QB IS the ball carrier.' +
        '\nrouteName: "Handoff Left", "Handoff Right", "Zone Read Left", "Zone Read Right", "Reverse Pivot Left", "Reverse Pivot Right", "Pitch Left", "Pitch Right", "Keeper Left", "Keeper Right", "3-Step Drop", "5-Step Drop", "7-Step Drop", "PA Bootleg Left", "PA Bootleg Right".' +
        '\n\nReturn ONLY raw JSON using this template: ' + fbTemplate.replace('PLAYNAME', play.name)
    }

    try {
      const raw = await callAI(prompt)
      const data = parseJSON(raw)
      if (!data.players || data.players.length === 0) throw new Error('No players returned')
      data._sportType = isBasketball ? 'basketball' : isBaseball ? 'baseball' : 'football'
      try { sessionStorage.setItem(cacheKey, JSON.stringify(data)) } catch(e) {}
      // ── FULL DIAGRAM SANITIZER ──────────────────────────────────────────────
      // Enforces real football rules on AI-returned coordinates before rendering.
      // No matter what the model returns, these rules hold.
      if (data.players) {
        const snapY = 42  // LOS — offense lines up here
        const OL_LABELS = new Set(['C','G','T'])
        const DL_LABELS = new Set(['DE','DT','NT','DL','D'])
        const INELIGIBLE = new Set(['C','G','T','DE','DT','NT','DL','D'])

        data.players.forEach(p => {
          if (!p.path || p.path.length < 2) return

          // ── RULE 1: No OL, DL, or QB moves before the snap ──────────────────
          if ((INELIGIBLE.has(p.label) || p.label === 'QB') && (p.pathDelay || 0) < 0) {
            p.pathDelay = 0
          }

          // ── RULE 2: Offensive linemen on run plays must move FORWARD (lower y) ──
          // A blocker can never retreat backward — that's surrendering the block
          if (OL_LABELS.has(p.label) && p.role === 'off' && p.routeType === 'block') {
            for (let i = 1; i < p.path.length; i++) {
              // y must never increase from previous point (increasing y = backward)
              if (p.path[i][1] > p.path[i-1][1]) {
                p.path[i][1] = p.path[i-1][1] - 1  // force at least 1 unit forward
              }
              // Must move at least somewhat forward overall (end y < start y)
              if (i === p.path.length - 1 && p.path[i][1] >= p.path[0][1]) {
                p.path[i][1] = p.path[0][1] - 2
              }
            }
          }

          // ── RULE 3: RB/ball carrier run paths must continuously go forward ──
          // An RB path can have a single lateral jab step but must trend lower y
          if ((p.id === 'RB' || p.id === 'HB' || p.id === 'FB') && p.routeType === 'route' && p.role === 'off') {
            const isRunPlay = !isBasketball && !isBaseball
            if (isRunPlay) {
              // End point must be significantly forward of start
              const startY = p.path[0][1]
              const endY = p.path[p.path.length - 1][1]
              if (endY >= startY - 4) {
                // Force the run to go at least 8 units forward
                const midX = p.path[Math.floor(p.path.length / 2)][0]
                p.path[p.path.length - 1] = [midX, startY - 10]
              }
            }
          }

          // ── RULE 4: Defensive linemen must attack toward offense (higher y) ──
          if (DL_LABELS.has(p.label) && p.role === 'def') {
            for (let i = 1; i < p.path.length; i++) {
              if (p.path[i][1] < p.path[i-1][1]) {
                p.path[i][1] = p.path[i-1][1] + 1  // DL moves toward LOS = higher y
              }
            }
          }

          // ── RULE 5: Receivers on routes must end past the LOS ──
          // Only correct routes that end at or behind LOS (y >= 42) — not routes that
          // end between LOS and start (slants, outs, hitches all have valid short y values)
          const isReceiver = ['WR','TE','WR1','WR2','WR3','SL','SLT'].includes(p.label)
          if (isReceiver && p.routeType === 'route' && p.role === 'off') {
            const endY = p.path[p.path.length - 1][1]
            if (endY >= 40) {
              // Route ends behind or at LOS — force it at least 6 yards upfield
              p.path[p.path.length - 1][1] = 34
            }
          }

          // ── RULE 6: No player starts below y=55 or above y=5 ──
          p.path = p.path.map(pt => [
            Math.max(2, Math.min(98, pt[0])),
            Math.max(5, Math.min(57, pt[1]))
          ])
          p.x = Math.max(2, Math.min(98, p.x))
          p.y = Math.max(5, Math.min(57, p.y))

          // ── RULE 8: QB on pass plays must drop BACK (higher y), not forward ──
          if (p.label === 'QB' && p.role === 'off') {
            const qbRoute = (p.routeName || '').toLowerCase()
            const isPassDrop = (qbRoute.includes('drop') || qbRoute.includes('pa ') ||
                               qbRoute.includes('bootleg') || qbRoute.includes('pa boot') ||
                               qbRoute.includes('pass') || qbRoute.includes('throw')) &&
                               !qbRoute.includes('handoff') && !qbRoute.includes('zone read') &&
                               !qbRoute.includes('pitch') && !qbRoute.includes('keeper') &&
                               !qbRoute.includes('pivot') && !qbRoute.includes('sneak') &&
                               !qbRoute.includes('dive') && !qbRoute.includes('plunge')
            if (isPassDrop && p.path.length >= 2) {
              const startY = p.path[0][1]
              const endY = p.path[p.path.length - 1][1]
              // QB on pass must end BEHIND snap (higher y). If he's moving forward, fix it.
              if (endY < startY + 3) {
                // Force endpoint to be at least 6 units behind start (dropped back)
                const isBootlegLeft = qbRoute.includes('left')
                const isBootlegRight = qbRoute.includes('right')
                if (isBootlegLeft) {
                  p.path[p.path.length - 1] = [Math.min(28, p.path[p.path.length-1][0]), startY + 6]
                } else if (isBootlegRight) {
                  p.path[p.path.length - 1] = [Math.max(72, p.path[p.path.length-1][0]), startY + 6]
                } else {
                  p.path[p.path.length - 1] = [p.path[p.path.length-1][0], startY + 8]
                }
              }
            }
          }

          // ── RULE 7: Route shape enforcement ──
          const isRecv = ['WR','TE','WR1','WR2','WR3','SL'].includes(p.label)
          if (isRecv && p.routeType === 'route' && p.role === 'off' && !isBasketball && !isBaseball) {
            const startX = p.path[0][0]
            const endX = p.path[p.path.length - 1][0]
            const endY = p.path[p.path.length - 1][1]
            const routeName = (p.routeName || '').toLowerCase()

            // SLANT: must break INWARD (toward center). Left WR: endX > startX. Right WR: endX < startX.
            const isSlant = routeName.includes('slant')
            if (isSlant) {
              if (startX < 50 && endX <= startX) {
                // Left WR slant going outward — fix to go inward
                p.path[p.path.length - 1][0] = startX + 14
                p.path[p.path.length - 1][1] = Math.min(endY, startX - 12)
              } else if (startX > 50 && endX >= startX) {
                // Right WR slant going outward — fix to go inward
                p.path[p.path.length - 1][0] = startX - 14
                p.path[p.path.length - 1][1] = Math.min(endY, 100 - startX - 12)
              }
            }

            // OUT: must break OUTWARD (away from center). Left WR: endX < startX. Right WR: endX > startX.
            const isOut = routeName.includes(' out') || routeName.includes('quick out') || routeName.startsWith('out')
            if (isOut && !isSlant) {
              if (startX < 50 && endX > startX) {
                p.path[p.path.length - 1][0] = Math.max(2, startX - 10)
              } else if (startX > 50 && endX < startX) {
                p.path[p.path.length - 1][0] = Math.min(98, startX + 10)
              }
            }

            // Short route OL collision: push endpoint outside OL zone
            const isShortRoute = endY > 28
            const crossesOL = endX > 34 && endX < 66 && endY > 34
            if (isShortRoute && crossesOL && !isSlant) {
              if (startX < 50) {
                p.path[p.path.length - 1][0] = Math.min(endX, 32)
              } else {
                p.path[p.path.length - 1][0] = Math.max(endX, 68)
              }
            }
          }
        })
      }
      // ── END SANITIZER ────────────────────────────────────────────────────────
      setParsed(data)
    } catch(e) { setError(e.message) }
    setLoading(false)
  }

  useEffect(() => {
    if (!parsed || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    // x: 0-100 → 0-W, y: 0-60 → 0-H
    const sx = x => (x / 100) * W
    const sy = y => (y / 60) * H
    const dur = parsed.duration || 3200
    const snap = parsed.snapPoint || 0.18
    const sportType = parsed._sportType || 'football'
    const isBBall = sportType === 'basketball'
    const isBSB = sportType === 'baseball'
    const r = W * 0.018
    let startTime = null

    function lerp(a, b, t) { return a + (b - a) * t }

    function getPos(player, t) {
      const path = player.path
      if (!path || path.length < 2) return { x: sx(player.x), y: sy(player.y) }

      const delay = player.pathDelay || 0
      const segs = path.length - 1

      if (delay < 0) {
        // NEGATIVE delay: player starts moving BEFORE the snap
        const motionStart = snap + delay  // e.g. snap=0.18, delay=-0.30 → motionStart=-0.12 (clamped to 0)
        const effectiveStart = Math.max(0, motionStart)
        if (t < effectiveStart) return { x: sx(path[0][0]), y: sy(path[0][1]) }
        const pt = Math.min((t - effectiveStart) / (1 - effectiveStart), 1)
        const rawSeg = pt * segs
        const seg = Math.min(Math.floor(rawSeg), segs - 1)
        const segT = rawSeg - seg
        const rawX = lerp(path[seg][0], path[seg + 1][0], segT)
        const rawY = lerp(path[seg][1], path[seg + 1][1], segT)
        // ENFORCE pre-snap motion rule: before the snap, y must not decrease (no forward motion)
        // snap corresponds to a specific pt value: ptAtSnap = (snap - effectiveStart) / (1 - effectiveStart)
        const ptAtSnap = Math.min(1, Math.max(0, (snap - effectiveStart) / Math.max(0.001, 1 - effectiveStart)))
        const isPreSnap = pt < ptAtSnap
        const startY = path[0][1]
        const clampedY = isPreSnap ? Math.max(rawY, startY) : rawY  // pre-snap: y cannot go below startY (lower y = forward = illegal)
        return { x: sx(rawX), y: sy(clampedY) }
      } else {
        // ZERO or POSITIVE delay: player holds pre-snap, then starts moving at snap + delay
        if (t < snap) return { x: sx(path[0][0]), y: sy(path[0][1]) }
        const postSnap = (t - snap) / (1 - snap)
        if (postSnap < delay) return { x: sx(path[0][0]), y: sy(path[0][1]) }
        const pt = Math.min((postSnap - delay) / Math.max(0.001, 1 - delay), 1)
        const rawSeg = pt * segs
        const seg = Math.min(Math.floor(rawSeg), segs - 1)
        const segT = rawSeg - seg
        return {
          x: sx(lerp(path[seg][0], path[seg + 1][0], segT)),
          y: sy(lerp(path[seg][1], path[seg + 1][1], segT))
        }
      }
    }

    function arrow(fromX, fromY, toX, toY, size) {
      const dx = toX - fromX, dy = toY - fromY
      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const ux = dx / len, uy = dy / len
      const a = 0.42
      ctx.beginPath()
      ctx.moveTo(toX, toY)
      ctx.lineTo(toX - size * (ux * Math.cos(a) - uy * Math.sin(a)), toY - size * (uy * Math.cos(a) + ux * Math.sin(a)))
      ctx.lineTo(toX - size * (ux * Math.cos(a) + uy * Math.sin(a)), toY - size * (uy * Math.cos(a) - ux * Math.sin(a)))
      ctx.closePath()
      ctx.fill()
    }

    function perpMark(x, y, dx, dy, size) {
      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const px = -dy / len * size, py = dx / len * size
      ctx.beginPath()
      ctx.moveTo(x - px, y - py)
      ctx.lineTo(x + px, y + py)
      ctx.stroke()
    }

    // Ensure diagram accent is always visible on the light field (min contrast)
    function getDiagramAccent() {
      const hex = P.replace('#','')
      const r = parseInt(hex.slice(0,2),16)||0
      const g = parseInt(hex.slice(2,4),16)||0
      const b = parseInt(hex.slice(4,6),16)||0
      const luminance = (0.299*r + 0.587*g + 0.114*b) / 255
      // If color is too light (luminance > 0.6), use a darker version or fall back to team-toned dark
      if (luminance > 0.6) {
        // Darken by 60%
        const dr = Math.round(r * 0.35).toString(16).padStart(2,'0')
        const dg = Math.round(g * 0.35).toString(16).padStart(2,'0')
        const db = Math.round(b * 0.35).toString(16).padStart(2,'0')
        return '#' + dr + dg + db
      }
      return P
    }
    const DA = getDiagramAccent()  // diagram accent — always visible

    function drawField() {
      if (isBBall) {
        // Basketball court — hardwood, attacks toward top (y=6)
        ctx.fillStyle = '#c8904a'; ctx.fillRect(0, 0, W, H)
        // Court lines
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 2
        ctx.strokeRect(sx(4), sy(2), sx(92), sy(56))
        // Half court
        ctx.beginPath(); ctx.moveTo(sx(4), sy(55)); ctx.lineTo(sx(96), sy(55)); ctx.stroke()
        ctx.beginPath(); ctx.arc(sx(50), sy(55), sx(12), Math.PI, 0); ctx.stroke()
        // Key (lane) — top
        ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 1.5
        ctx.strokeRect(sx(36), sy(2), sx(28), sy(26))
        // Free throw line
        ctx.beginPath(); ctx.moveTo(sx(36), sy(28)); ctx.lineTo(sx(64), sy(28)); ctx.stroke()
        ctx.beginPath(); ctx.arc(sx(50), sy(28), sx(14), 0, Math.PI, false); ctx.stroke()
        // Three point arc
        ctx.beginPath(); ctx.moveTo(sx(6), sy(2)); ctx.lineTo(sx(6), sy(22)); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(sx(94), sy(2)); ctx.lineTo(sx(94), sy(22)); ctx.stroke()
        const r3 = Math.sqrt(Math.pow(sx(44), 2) + Math.pow(sy(20), 2))
        ctx.beginPath(); ctx.arc(sx(50), sy(6), r3, Math.PI * 1.08, Math.PI * 1.92, false); ctx.stroke()
        // Basket
        ctx.fillStyle = '#e05020'
        ctx.beginPath(); ctx.arc(sx(50), sy(4), sx(2), 0, Math.PI * 2); ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2
        ctx.beginPath(); ctx.arc(sx(50), sy(4), sx(2), 0, Math.PI * 2); ctx.stroke()
        // Backboard
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = 2.5
        ctx.beginPath(); ctx.moveTo(sx(40), sy(2.2)); ctx.lineTo(sx(60), sy(2.2)); ctx.stroke()
        // Lane dots
        ctx.fillStyle = 'rgba(255,255,255,0.4)'
        ;[[36,16],[36,20],[36,24],[64,16],[64,20],[64,24]].forEach(([bx,by]) => {
          ctx.beginPath(); ctx.arc(sx(bx), sy(by), sx(0.8), 0, Math.PI * 2); ctx.fill()
        })
      } else if (isBSB) {
        // Baseball field — green outfield, dirt infield diamond
        ctx.fillStyle = '#2e7d2e'; ctx.fillRect(0, 0, W, H)
        // Dirt infield (roughly diamond + arcs)
        ctx.fillStyle = '#c49055'
        ctx.beginPath()
        ctx.moveTo(sx(50), sy(50)) // home
        ctx.lineTo(sx(74), sy(36)) // 1B
        ctx.lineTo(sx(50), sy(22)) // 2B
        ctx.lineTo(sx(26), sy(36)) // 3B
        ctx.closePath(); ctx.fill()
        // Pitcher mound circle
        ctx.beginPath(); ctx.arc(sx(50), sy(36), sx(4), 0, Math.PI * 2); ctx.fill()
        // Foul lines
        ctx.strokeStyle = 'rgba(255,255,255,0.65)'; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(sx(50), sy(50)); ctx.lineTo(sx(3), sy(3)); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(sx(50), sy(50)); ctx.lineTo(sx(97), sy(3)); ctx.stroke()
        // Outfield warning track arc
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4])
        ctx.beginPath(); ctx.arc(sx(50), sy(50), sy(47), Math.PI * 1.18, Math.PI * 1.82); ctx.stroke()
        ctx.setLineDash([])
        // Bases
        ;[[50,50,'HP'],[74,36,'1B'],[50,22,'2B'],[26,36,'3B']].forEach(([bx, by, lbl]) => {
          const bs = sx(2.4)
          ctx.fillStyle = lbl === 'HP' ? '#bbb' : 'white'
          ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1
          ctx.save(); ctx.translate(sx(bx), sy(by)); ctx.rotate(Math.PI / 4)
          ctx.fillRect(-bs / 2, -bs / 2, bs, bs); ctx.strokeRect(-bs / 2, -bs / 2, bs, bs)
          ctx.restore()
          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.font = `bold ${Math.round(sx(2))}px sans-serif`; ctx.textAlign = 'center'
          ctx.fillText(lbl, sx(bx), sy(by) - sx(3.5))
        })
        // Pitcher rubber
        ctx.fillStyle = 'white'; ctx.fillRect(sx(49), sy(35.5), sx(2), sy(1))
      } else {
        // Football field — white background with yard lines
        ctx.fillStyle = '#f4f4f0'; ctx.fillRect(0, 0, W, H)
        // Yard lines (every 10 yards visual = 6 units)
        ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.lineWidth = 1
        for (let yv = 0; yv <= 60; yv += 6) {
          ctx.beginPath(); ctx.moveTo(0, sy(yv)); ctx.lineTo(W, sy(yv)); ctx.stroke()
        }
        // Hash marks
        ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 0.8
        for (let yv = 0; yv <= 60; yv += 2) {
          ctx.beginPath(); ctx.moveTo(sx(30), sy(yv)); ctx.lineTo(sx(35), sy(yv)); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(sx(65), sy(yv)); ctx.lineTo(sx(70), sy(yv)); ctx.stroke()
        }
        // Line of scrimmage (dashed)
        ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 1.5; ctx.setLineDash([10, 6])
        ctx.beginPath(); ctx.moveTo(0, sy(38)); ctx.lineTo(W, sy(38)); ctx.stroke()
        ctx.setLineDash([])
        // LOS label
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.font = `${Math.round(sx(2))}px sans-serif`
        ctx.textAlign = 'left'; ctx.fillText('LOS', sx(1), sy(37.2))
        // First down line (gold)
        ctx.strokeStyle = 'rgba(218,165,32,0.55)'; ctx.lineWidth = 1.5; ctx.setLineDash([8, 4])
        ctx.beginPath(); ctx.moveTo(0, sy(28)); ctx.lineTo(W, sy(28)); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = 'rgba(218,165,32,0.4)'; ctx.font = `${Math.round(sx(1.8))}px sans-serif`
        ctx.textAlign = 'left'; ctx.fillText('1D', sx(1), sy(27.2))
      }
    }

    function getBBRole(player) {
      const rn = player.routeName || ''
      if (rn.startsWith('BALL:')) return 'ball'
      if (rn.startsWith('SHOOT:')) return 'shooter'
      if (rn.startsWith('SCREEN:') || rn === 'SCREEN') return 'screen'
      if (rn.startsWith('CUT:')) return 'cut'
      return 'move'
    }

    function drawRoutes(t) {
      const isStatic = t < snap
      const pt = isStatic ? 0 : Math.min((t - snap) / (1 - snap), 1)

      ;(parsed.players || []).forEach(player => {
        if (player.role !== 'off') return
        const path = player.path
        if (!path || path.length < 2) return
        const isLineman = ['C', 'G', 'T'].includes(player.label)
        const isBlock = player.routeType === 'block' || isLineman
        const bbRole = isBBall ? getBBRole(player) : null

        const routeColor = isLineman
          ? 'rgba(120,120,120,0.65)'
          : isBBall
            ? (bbRole === 'ball' ? 'rgba(245,158,11,0.9)' : bbRole === 'shooter' ? 'rgba(74,222,128,0.9)' : hexToRgba(DA, 0.8))
            : hexToRgba(DA, 0.85)

        const segs = path.length - 1

        if (isStatic) {
          // ── STATIC VIEW: draw full route as ghost lines so coach can read the play ──
          // Full route — dashed for receivers, solid-thin for linemen/blockers
          ctx.strokeStyle = isLineman ? 'rgba(120,120,120,0.4)' : hexToRgba(P, isBBall ? 0.5 : 0.45)
          ctx.lineWidth = isLineman ? 1 : 1.8
          ctx.setLineDash(isBlock ? [4, 3] : [])
          ctx.beginPath()
          ctx.moveTo(sx(path[0][0]), sy(path[0][1]))
          for (let s = 1; s < path.length; s++) ctx.lineTo(sx(path[s][0]), sy(path[s][1]))
          ctx.stroke()
          ctx.setLineDash([])

          // Arrowhead or block mark at end of full route
          const ep = path[path.length - 1]
          const pp2 = path[path.length - 2]
          const endX = sx(ep[0]), endY = sy(ep[1])
          ctx.fillStyle = isLineman ? 'rgba(120,120,120,0.55)' : hexToRgba(P, 0.6)
          ctx.strokeStyle = isLineman ? 'rgba(120,120,120,0.55)' : hexToRgba(P, 0.6)
          ctx.lineWidth = 1.8
          if (isBlock) {
            perpMark(endX, endY, ep[0] - pp2[0], ep[1] - pp2[1], r * 1.4)
          } else {
            arrow(sx(pp2[0]), sy(pp2[1]), endX, endY, r * 1.9)
          }

          // Route labels collected — drawn as legend below (see drawRouteLegend)
        } else {
          // ── ANIMATED VIEW: draw the traveled portion of each route ──
          const traveled = pt * segs

          ctx.strokeStyle = routeColor
          ctx.lineWidth = isLineman ? 1.3 : 2.2
          ctx.setLineDash([])
          ctx.beginPath()
          ctx.moveTo(sx(path[0][0]), sy(path[0][1]))

          for (let s = 0; s < segs; s++) {
            const segProgress = Math.max(0, Math.min(1, traveled - s))
            if (segProgress <= 0) break
            const ex = lerp(path[s][0], path[s + 1][0], segProgress)
            const ey = lerp(path[s][1], path[s + 1][1], segProgress)
            ctx.lineTo(sx(ex), sy(ey))
          }
          ctx.stroke()

          // Arrowhead / block mark at end of traveled route
          const progress2 = Math.min(traveled / segs, 1)
          if (progress2 >= 0.82) {
            const ep = path[path.length - 1]
            const pp2 = path[path.length - 2]
            const endX = sx(ep[0]), endY = sy(ep[1])
            ctx.fillStyle = routeColor
            ctx.strokeStyle = routeColor
            ctx.lineWidth = 2
            if (isBlock) {
              perpMark(endX, endY, ep[0] - pp2[0], ep[1] - pp2[1], r * 1.5)
            } else {
              arrow(sx(pp2[0]), sy(pp2[1]), endX, endY, r * 2)
            }
          }
        }
      })
    }

    function drawDefenseZones(t) {
      if (isBBall || isBSB) return
      const defPlayers = (parsed.players || []).filter(p => p.role === 'def')
      const offPlayers = (parsed.players || []).filter(p => p.role === 'off')
      if (defPlayers.length < offPlayers.length) return // not a def diagram
      defPlayers.forEach(player => {
        if (!player.routeName) return
        const pos = getPos(player, t)
        const rn = (player.routeName || '').toLowerCase()
        const isDeep = rn.includes('deep') || rn.includes('half') || player.label === 'FS' || player.label === 'SS'
        const isMid = rn.includes('hook') || rn.includes('curl') || player.label === 'MLB'
        const isFlat = rn.includes('flat') || rn.includes('curl-flat') || player.label === 'WLB' || player.label === 'SLB'
        if (!isDeep && !isMid && !isFlat) return
        const zoneW = isDeep ? sx(26) : isFlat ? sx(14) : sx(17)
        const zoneH = isDeep ? sy(9) : isFlat ? sy(6) : sy(7)
        const zoneColor = isDeep ? 'rgba(30,80,220,0.15)' : isMid ? 'rgba(180,160,0,0.15)' : 'rgba(0,140,90,0.15)'
        const borderColor = isDeep ? 'rgba(30,80,220,0.5)' : isMid ? 'rgba(180,160,0,0.55)' : 'rgba(0,140,90,0.5)'
        const yOff = isDeep ? -sy(5) : isMid ? -sy(3) : -sy(2)
        ctx.save()
        ctx.translate(pos.x, pos.y + yOff)
        ctx.scale(1, 0.5)
        ctx.fillStyle = zoneColor; ctx.strokeStyle = borderColor; ctx.lineWidth = 1.5
        ctx.setLineDash([5, 3])
        ctx.beginPath(); ctx.ellipse(0, 0, zoneW, zoneH, 0, 0, Math.PI * 2)
        ctx.fill(); ctx.stroke()
        ctx.setLineDash([])
        ctx.restore()
      })
    }

    function drawBall(t) {
      if (isBSB || isBBall) return
      const qb = parsed.players.find(p => p.id === 'QB')
      const rb = parsed.players.find(p => p.id === 'RB')
      if (!qb || !rb) return
      const pt = t < snap ? 0 : Math.min((t - snap) / (1 - snap), 1)
      const isHandoff = (qb.routeName || '').includes('Handoff')
      if (isHandoff && pt >= 0.05 && pt <= 0.45) {
        const hp = Math.min(1, (pt - 0.05) / 0.3)
        const qbPos = getPos(qb, t)
        const rbPos = getPos(rb, t)
        const bx = qbPos.x + (rbPos.x - qbPos.x) * hp
        const by = qbPos.y + (rbPos.y - qbPos.y) * hp
        ctx.fillStyle = '#92400e'; ctx.strokeStyle = 'rgba(255,200,50,0.9)'; ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.arc(bx, by, r * 0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      }
    }

    function drawPassIndicator(t) {
      // Only on football pass plays, only after snap
      if (isBBall || isBSB) return
      const players = parsed.players || []
      const qb = players.find(p => p.label === 'QB' && p.role === 'off')
      if (!qb) return

      // Detect pass play: QB routeName indicates drop/PA, not a run
      const qbRoute = (qb.routeName || '').toLowerCase()
      const playType = (parsed.formation || '').toLowerCase()
      const isPassPlay = qbRoute.includes('drop') || qbRoute.includes('pa ') ||
                         qbRoute.includes('bootleg') || qbRoute.includes('pa boot') ||
                         qbRoute.includes('pass') || qbRoute.includes('throw') ||
                         playType.includes('pass') || playType.includes('action') ||
                         // Also detect by play type label from the play object
                         ((parsed._playType||'').toLowerCase().includes('pass'))
      if (!isPassPlay) return

      // Find primary receiver — prefer routeYards > 0, then first WR/TE with a route
      const receivers = players.filter(p =>
        p.role === 'off' && p.routeType === 'route' &&
        ['WR','TE','WR1','WR2','WR3','SL','RB','HB','FB'].includes(p.label)
      )
      if (!receivers.length) return

      const primary = receivers.find(p => (p.routeYards || 0) > 0) ||
                      receivers.find(p => (p.routeName || '').toLowerCase().includes('slant')) ||
                      receivers.find(p => (p.routeName || '').toLowerCase().includes('post')) ||
                      receivers[0]

      if (!primary) return

      const pt = t < snap ? 0 : Math.min((t - snap) / (1 - snap), 1)

      // Show throw arc after QB has had time to drop (pt > 0.45)
      const throwStart = 0.45
      if (pt < throwStart) return

      const throwPt = Math.min(1, (pt - throwStart) / 0.4)

      // QB release point — end of QB's drop path
      const qbPos = getPos(qb, t)

      // Target point — where the receiver is at catch time
      const catchT = Math.min(1, snap + (1 - snap) * 0.85)
      const targetPos = getPos(primary, catchT)

      // Draw dotted throw arc from QB to target
      const steps = 30
      const drawSteps = Math.round(steps * throwPt)
      const arcHeight = sy(6) // arc height for visual interest

      ctx.strokeStyle = 'rgba(245,158,11,0.85)'
      ctx.lineWidth = 2
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      ctx.moveTo(qbPos.x, qbPos.y)

      for (let i = 1; i <= drawSteps; i++) {
        const f = i / steps
        const arcY = qbPos.y + (targetPos.y - qbPos.y) * f - arcHeight * f * (1 - f) * 4
        const arcX = qbPos.x + (targetPos.x - qbPos.x) * f
        ctx.lineTo(arcX, arcY)
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Football at tip of arc
      if (throwPt < 1) {
        const f = throwPt
        const ballX = qbPos.x + (targetPos.x - qbPos.x) * f
        const ballY = qbPos.y + (targetPos.y - qbPos.y) * f - arcHeight * f * (1 - f) * 4
        ctx.fillStyle = '#92400e'
        ctx.strokeStyle = 'rgba(245,158,11,0.9)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(ballX, ballY, r * 0.55, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      } else {
        // Ball arrived — highlight target receiver
        const pos = getPos(primary, t)
        ctx.strokeStyle = 'rgba(245,158,11,0.9)'
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, r * 1.6, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    function drawBBPass(t) {
      if (!isBBall) return
      const ballHolder = parsed.players.find(p => p.role === 'off' && getBBRole(p) === 'ball')
      const shooter = parsed.players.find(p => p.role === 'off' && getBBRole(p) === 'shooter')
      if (!ballHolder || !shooter) return
      const pt = t < snap ? 0 : Math.min((t - snap) / (1 - snap), 1)
      const passTime = 0.55
      if (pt < passTime) {
        // Ball dot on ball handler
        const pos = getPos(ballHolder, t)
        ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1
        ctx.beginPath(); ctx.arc(pos.x + r, pos.y - r, r * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
      } else {
        // Pass arc in flight
        const pp2 = Math.min(1, (pt - passTime) / 0.3)
        const startPos = getPos(ballHolder, snap + passTime * (1 - snap))
        const endPos = getPos(shooter, t)
        ctx.strokeStyle = 'rgba(255,220,50,0.9)'; ctx.lineWidth = 2; ctx.setLineDash([6, 3])
        ctx.beginPath(); ctx.moveTo(startPos.x, startPos.y)
        const steps = 24
        for (let i = 1; i <= Math.round(steps * pp2); i++) {
          const f = i / steps
          ctx.lineTo(
            startPos.x + (endPos.x - startPos.x) * f,
            startPos.y + (endPos.y - startPos.y) * f - sy(8) * f * (1 - f) * 4
          )
        }
        ctx.stroke(); ctx.setLineDash([])
        if (pp2 < 1) {
          const f = pp2
          const bx = startPos.x + (endPos.x - startPos.x) * f
          const by = startPos.y + (endPos.y - startPos.y) * f - sy(8) * f * (1 - f) * 4
          ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1
          ctx.beginPath(); ctx.arc(bx, by, r * 0.55, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        } else {
          // Ball arrived — show on shooter
          const pos = getPos(shooter, t)
          ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 1
          ctx.beginPath(); ctx.arc(pos.x + r, pos.y - r, r * 0.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
        }
      }
    }

    function drawPlayers(t) {
      const defPlayers = (parsed.players || []).filter(p => p.role === 'def')
      const offPlayers = (parsed.players || []).filter(p => p.role === 'off')
      const isDefDiagram = defPlayers.length >= offPlayers.length

      ;(parsed.players || []).forEach(player => {
        const pos = getPos(player, t)
        const isOff = player.role === 'off'
        const isLineman = ['C', 'G', 'T'].includes(player.label)
        const bbRole = isBBall ? getBBRole(player) : null

        if (isOff) {
          if (isBBall) {
            // Basketball offensive players
            const isBH = bbRole === 'ball'
            const isShooter = bbRole === 'shooter'
            const isScreener = bbRole === 'screen'
            if (isBH || isShooter) {
              ctx.fillStyle = isBH ? 'rgba(245,158,11,0.2)' : 'rgba(74,222,128,0.15)'
              ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 2.5, 0, Math.PI * 2); ctx.fill()
            }
            ctx.fillStyle = isBH ? '#f59e0b' : isShooter ? '#4ade80' : isScreener ? '#999' : DA
            ctx.strokeStyle = 'white'; ctx.lineWidth = 1.8
            ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
            ctx.fillStyle = isBH || isShooter ? '#000' : 'white'
            ctx.font = `bold ${Math.round(r * 1.1)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          } else if (isLineman) {
            // Linemen = squares
            ctx.fillStyle = DA; ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 1.5
            const s = r * 0.95
            ctx.fillRect(pos.x - s, pos.y - s, s * 2, s * 2)
            ctx.strokeRect(pos.x - s, pos.y - s, s * 2, s * 2)
            ctx.fillStyle = 'white'; ctx.font = `bold ${Math.round(r * 1.0)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          } else {
            // Skill positions = circles
            ctx.fillStyle = DA; ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 1.5
            ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
            ctx.fillStyle = 'white'; ctx.font = `bold ${Math.round(r * 1.0)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          }
        } else {
          // Defensive players
          if (isDefDiagram && !isBBall && !isBSB) {
            const rn2 = (player.routeName || '').toLowerCase()
            const isDL = ['DE', 'DT', 'NT', 'DL', 'D'].includes(player.label)
            const isBlitz = rn2.includes('blitz') || rn2.includes('rush')
            ctx.fillStyle = isBlitz ? 'rgba(220,60,0,0.9)' : 'rgba(50,50,50,0.85)'
            ctx.strokeStyle = 'rgba(200,200,200,0.9)'; ctx.lineWidth = 1.5
            if (isDL) {
              const s = r * 0.95
              ctx.fillRect(pos.x - s, pos.y - s, s * 2, s * 2)
              ctx.strokeRect(pos.x - s, pos.y - s, s * 2, s * 2)
            } else {
              ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
            }
            ctx.fillStyle = 'white'; ctx.font = `bold ${Math.round(r * 0.85)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          } else {
            // Ghost defenders (reference only)
            ctx.strokeStyle = 'rgba(80,80,80,0.65)'; ctx.fillStyle = 'rgba(80,80,80,0.08)'; ctx.lineWidth = 1.2
            ctx.beginPath(); ctx.arc(pos.x, pos.y, r * 0.85, 0, Math.PI * 2); ctx.fill(); ctx.stroke()
            ctx.fillStyle = 'rgba(80,80,80,0.7)'; ctx.font = `${Math.round(r * 0.9)}px sans-serif`
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillText(player.label, pos.x, pos.y)
          }
        }
      })
    }

    function getPositionLabel(player) {
      // Returns a specific position label (LT, RT, LG, RG, X, Y, Z, etc.)
      const id = player.id || ''
      const lbl = player.label || ''
      // OL specific labels
      if (id === 'LT' || (lbl === 'T' && player.x < 45)) return 'LT'
      if (id === 'RT' || (lbl === 'T' && player.x > 55)) return 'RT'
      if (id === 'LG' || (lbl === 'G' && player.x < 48)) return 'LG'
      if (id === 'RG' || (lbl === 'G' && player.x > 52)) return 'RG'
      if (lbl === 'C') return 'C'
      // Receivers — X=split left, Z=split right, Y=TE/slot, H=HB/flexback
      if (lbl === 'WR' || lbl === 'WR1') return player.x < 40 ? 'X' : 'Z'
      if (lbl === 'WR2' || lbl === 'SL') return player.x < 50 ? 'Y' : 'H'
      if (lbl === 'WR3') return 'H'
      if (lbl === 'TE') return 'Y'
      if (lbl === 'QB') return 'QB'
      if (lbl === 'RB' || lbl === 'HB') return 'RB'
      if (lbl === 'FB') return 'FB'
      return lbl
    }

    function drawRouteLegend(t) {
      if (isBBall || isBSB) return
      const isStatic = t < snap
      if (!isStatic) return  // legend only on static view

      // Collect all non-lineman routes with names
      const entries = []
      ;(parsed.players || []).forEach(player => {
        if (player.role !== 'off') return
        const isLineman = ['C','G','T'].includes(player.label)
        if (isLineman) return
        if (!player.routeName) return
        const isMotion = player.routeName.startsWith('MOTION:')
        const displayName = player.routeName.replace(/^(BALL:|SHOOT:|PASS:|CUT:|MOVE:|SCREEN:|MOTION:)/, '').trim()
        const displayText = isMotion
          ? ('↔ ' + displayName)
          : player.routeYards > 0
            ? (displayName + (player.routeYards > 0 ? ' ' + player.routeYards + 'yd' : ''))
            : displayName
        if (!displayText || displayText.length < 2) return
        const posLabel = getPositionLabel(player)
        entries.push({ pos: posLabel, route: displayText, isMotion })
      })

      if (entries.length === 0) return

      // Draw legend box in bottom-left corner
      const lineH = H * 0.055
      const boxPad = W * 0.018
      const boxW = W * 0.34
      const boxH = entries.length * lineH + boxPad * 2
      const boxX = W * 0.01
      const boxY = H - boxH - H * 0.02

      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.beginPath()
      ctx.roundRect(boxX, boxY, boxW, boxH, 4)
      ctx.fill()

      const fontSize = Math.round(H * 0.044)
      entries.forEach((entry, i) => {
        const y = boxY + boxPad + (i + 0.75) * lineH
        // Position label in accent color
        ctx.fillStyle = entry.isMotion ? 'rgba(245,158,11,0.95)' : hexToRgba(DA, 0.95)
        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = 'left'
        ctx.fillText(entry.pos + ':', boxX + boxPad, y)
        // Route name in white
        ctx.fillStyle = 'rgba(220,220,220,0.9)'
        ctx.font = `${fontSize}px sans-serif`
        ctx.fillText(entry.route, boxX + boxPad + fontSize * 2.4, y)
      })
    }

    function drawSnapFlash(t) {
      if (!isBBall && !isBSB && t >= snap && t < snap + 0.06) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'
        ctx.font = `bold ${Math.round(H * 0.042)}px sans-serif`
        ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
        ctx.fillText('SNAP', W / 2, sy(37))
      }
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H)
      drawField()
      drawDefenseZones(t)
      drawRoutes(t)
      drawBall(t)
      drawBBPass(t)
      drawPassIndicator(t)
      drawPlayers(t)
      drawRouteLegend(t)
      drawSnapFlash(t)
    }

    // Cancel any in-flight animation
    if (animRef.current) cancelAnimationFrame(animRef.current)

    if (playing) {
      startTime = null
      function frame(ts) {
        if (!startTime) startTime = ts
        const t = Math.min((ts - startTime) / dur, 1)
        setProgress(t)
        draw(t)
        if (t < 1) {
          animRef.current = requestAnimationFrame(frame)
        } else {
          setPlaying(false)
          animRef.current = null
        }
      }
      animRef.current = requestAnimationFrame(frame)
    } else {
      draw(progress)
    }

    return () => {
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null }
    }
  }, [parsed, playing, P])

  function replay() {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null }
    setProgress(0)
    setPlaying(true)
  }

  function pause() {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null }
    setPlaying(false)
  }

  return (
    <div style={{ marginTop:10, background:'#0f1219', borderRadius:8, border:`1px solid ${hexToRgba(P,0.3)}`, overflow:'hidden' }}>
      <div style={{ padding:'8px 12px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', gap:8, background:'#161922' }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:1, color:'#f2f4f8', flex:1, textTransform:'uppercase' }}>{play.name}</span>
        <span style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>{play.type}</span>
        {!parsed && !loading && !autoLoad && (
          <button onClick={generateAnim} style={{ padding:'4px 12px', background:P, border:'none', borderRadius:4, color:'white', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>ANIMATE</button>
        )}
        {parsed && !playing && (
          <button onClick={replay} style={{ padding:'4px 12px', background:P, border:'none', borderRadius:4, color:'white', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>▶ PLAY</button>
        )}
        {parsed && playing && (
          <button onClick={pause} style={{ padding:'4px 12px', background:'#f59e0b', border:'none', borderRadius:4, color:'#000', fontSize:10, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>⏸ PAUSE</button>
        )}
      </div>
      {loading && <div style={{ padding:16, textAlign:'center', color:'#666', fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>Generating diagram…</div>}
      {error && <ErrBox msg={error} />}
      {parsed && (
        <div style={{ position:'relative' }}>
          <canvas ref={canvasRef} width={560} height={336} style={{ width:'100%', display:'block' }} />
          <div style={{ position:'absolute', bottom:6, right:8, background:'rgba(0,0,0,0.45)', borderRadius:3, padding:'2px 7px', fontSize:9, color:'white', fontFamily:"'DM Mono',monospace" }}>{Math.round(progress * 100)}%</div>
        </div>
      )}
    </div>
  )
}


function DefFormationCard({ formation: f, S, P='#C0392B', al, callAI, parseJSON, sport }) {
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

  async function loadSteps() {
    if (steps) return
    // Check session cache first
    const stepsCacheKey = 'coachiq_steps_' + (play.name||'').replace(/\s/g,'_').slice(0,40)
    try {
      const cached = sessionStorage.getItem(stepsCacheKey)
      if (cached) { setSteps(JSON.parse(cached)); return }
    } catch(e) {}
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
          <div style={{ fontSize:11, color:'#8a94b0', marginTop:3, fontStyle:'italic' }}>When: {f.whenToUse}</div>
          <div style={{ fontSize:10, color:S, marginTop:4 }}>{expanded ? '▲ Collapse' : '▼ Expand breakdown + diagram'}</div>
        </div>
        <button onClick={e=>{e.stopPropagation();setShowAnim(a=>!a);setExpanded(true);loadSteps()}} style={{ padding:'4px 9px', background:showAnim?S:hexToRgba(S,0.12), border:`1px solid ${S}`, borderRadius:6, color:showAnim?'white':S, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:0.5, whiteSpace:'nowrap', flexShrink:0 }}>{showAnim?'HIDE':'DIAGRAM'}</button>
      </div>
      {expanded && (
        <div style={{ paddingBottom:14, animation:'fadeIn 0.2s ease' }}>
          {showAnim && <div style={{ marginBottom:12 }}><PlayAnimator play={defPlay} P={S} callAI={callAI} parseJSON={parseJSON} autoLoad={true} /></div>}
          {stepsLoading && <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, display:'flex', alignItems:'center', gap:10 }}><div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${S}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} /><div style={{ fontSize:12, color:'#8a94b0' }}>Generating breakdown...</div></div>}
          {steps && steps.huddleCard && steps.huddleCard.length > 0 && (
            <div style={{ background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.04))', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, padding:12, marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}><span style={{ fontSize:14 }}>📋</span><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#f59e0b', fontWeight:700 }}>Huddle Card</div></div>
              {steps.huddleCard.map((item,i) => (<div key={i} style={{ display:'flex', gap:8, marginBottom:6, alignItems:'flex-start' }}><div style={{ minWidth:32, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', borderRadius:5, padding:'2px 4px', textAlign:'center', fontSize:9, fontWeight:800, color:'#f59e0b', flexShrink:0, marginTop:1 }}>{item.player}</div><div style={{ flex:1 }}><span style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{item.instruction}</span>{item.termNote&&<span style={{ fontSize:11, color:'#8a94b0', fontStyle:'italic' }}> ({item.termNote})</span>}</div></div>))}
            </div>
          )}
          {steps && !steps.error && (
            <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, border:`1px solid ${hexToRgba(S,0.2)}` }}>
              <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:S, fontWeight:700, marginBottom:10 }}>Defensive Breakdown</div>
              {steps.keyAssignment&&<div style={{ padding:'8px 10px', background:hexToRgba(S,0.1), border:`1px solid ${hexToRgba(S,0.25)}`, borderRadius:8, marginBottom:8 }}><div style={{ fontSize:9, letterSpacing:1.5, color:S, fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Key Assignment</div><div style={{ fontSize:12, color:'#f2f4f8', fontWeight:600 }}>{steps.keyAssignment}</div></div>}
              {steps.coverageType&&<div style={{ padding:'8px 10px', background:'rgba(107,154,255,0.08)', borderRadius:8, marginBottom:8, border:'1px solid rgba(107,154,255,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#6b9fff', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Coverage Type</div><div style={{ fontSize:12, color:'#f2f4f8' }}>{steps.coverageType}</div></div>}
              {(steps.steps||[]).map((step,i) => (<div key={i} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:i<steps.steps.length-1?'1px solid #1e2330':'none' }}><div style={{ width:18, height:18, minWidth:18, background:'#0f1117', border:`1px solid ${S}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:S, flexShrink:0, marginTop:1 }}>{i+1}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{step}</div></div>))}
              {steps.keyCoachingPoints&&steps.keyCoachingPoints.length>0&&(<div style={{ marginTop:10, padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, border:'1px solid rgba(74,222,128,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#4ade80', fontWeight:700, marginBottom:6 }}>Key Coaching Points</div>{steps.keyCoachingPoints.map((pt,i)=><div key={i} style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5, marginBottom:3 }}>• {pt}</div>)}</div>)}
              {steps.whyItWorks&&(<div style={{ marginTop:10, padding:'10px 12px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)' }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:5 }}>Why This Works</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{steps.whyItWorks}</div></div>)}
              {steps.playerRoles&&steps.playerRoles.length>0&&(<div style={{ marginTop:10 }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#f59e0b', fontWeight:700, marginBottom:8 }}>What to Tell Each Player</div>{steps.playerRoles.map((role,i)=>(<div key={i} style={{ marginBottom:8, padding:'10px 12px', background:'rgba(245,158,11,0.06)', borderRadius:8, border:'1px solid rgba(245,158,11,0.15)' }}><div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}><div style={{ width:26, height:26, minWidth:26, background:'rgba(245,158,11,0.2)', border:'1px solid rgba(245,158,11,0.4)', color:'#f59e0b', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>{role.position}</div><div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{role.job}</div></div><div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.6, paddingLeft:34, fontStyle:'italic' }}>"Tell your player: {role.whyTheyDoIt}"</div></div>))}</div>)}
            </div>
          )}
          <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12 }}>
            <div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:8 }}>Ask About This Formation</div>
            {qaHistory.map((item,i)=>(<div key={i} style={{ marginBottom:10 }}><div style={{ fontSize:11, fontWeight:600, color:S, marginBottom:3 }}>Q: {item.q}</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.6, padding:'6px 10px', background:'rgba(255,255,255,0.04)', borderRadius:6 }}>{item.a}</div></div>))}
            {qaLoading&&<div style={{ fontSize:11, color:'#8a94b0', marginBottom:8 }}>Getting answer...</div>}
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
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:10 }}>
                    <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.25)', borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>Fake Look</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{disguise.fakeAlignment}</div></div>
                    <div style={{ padding:'8px 10px', background:'rgba(0,0,0,0.25)', borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>At Snap</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.4 }}>{disguise.snapTrigger}</div></div>
                  </div>
                  {disguise.qbReads&&(<div style={{ padding:'8px 10px', background:'rgba(74,222,128,0.06)', borderRadius:8, marginBottom:10, border:'1px solid rgba(74,222,128,0.15)' }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#4ade80', fontWeight:700, marginBottom:3, textTransform:'uppercase' }}>What the QB Sees</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{disguise.qbReads}</div></div>)}
                  {disguise.techniques&&disguise.techniques.length>0&&(<div style={{ marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:1.5, color:'#c084fc', fontWeight:700, marginBottom:6, textTransform:'uppercase' }}>Player-by-Player Disguise Moves</div>{disguise.techniques.map((t,i)=>(<div key={i} style={{ display:'flex', gap:9, padding:'6px 0', borderBottom:i<disguise.techniques.length-1?'1px solid rgba(180,0,220,0.15)':'none' }}><div style={{ width:26, height:26, minWidth:26, background:'rgba(180,0,220,0.15)', border:'1px solid rgba(180,0,220,0.3)', color:'#c084fc', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, flexShrink:0 }}>{t.player}</div><div style={{ flex:1 }}><div style={{ fontSize:11, color:'#f2f4f8', fontWeight:600, marginBottom:2 }}>{t.action}</div><div style={{ fontSize:10, color:'#8a94b0', lineHeight:1.4 }}>{t.purpose}</div></div></div>))}</div>)}
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

function PlaybookCard({ play, packageName, packageIndex, P='#C0392B', S='#002868', al, callAI, parseJSON }) {
  const [showAnim, setShowAnim] = useState(false)
  return (
    <div style={{ background:'#0f1117', border:'1px solid #1e2330', borderRadius:10, overflow:'hidden', marginBottom:8 }}>
      <div style={{ padding:'12px 14px', display:'flex', alignItems:'flex-start', gap:10 }}>
        <div style={{ width:22, height:22, minWidth:22, background:al(P,0.15), border:`1px solid ${P}`, color:P, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0, marginTop:2 }}>{play.number}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{play.name}</div>
            <span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background:al(P,0.15), color:P }}>{play.type}</span>
            <span style={{ fontSize:9, color:'#5a6480' }}>Pkg #{packageIndex}</span>
          </div>
          <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.4, marginBottom:3 }}>{play.note}</div>
          <div style={{ fontSize:10, color:'#5a6480' }}>{packageName}</div>
        </div>
        <button onClick={()=>setShowAnim(a=>!a)} style={{ padding:'4px 9px', background:showAnim?P:al(P,0.12), border:`1px solid ${P}`, borderRadius:6, color:showAnim?'white':P, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:'inherit', letterSpacing:0.5, whiteSpace:'nowrap', flexShrink:0 }}>{showAnim?'HIDE':'DIAGRAM'}</button>
      </div>
      {showAnim && <PlayAnimator play={play} P={P} callAI={callAI} parseJSON={parseJSON} autoLoad={true} />}
    </div>
  )
}


function DefenseGen({ sport, P='#C0392B', S='#002868', al, callAI, parseJSON }) {
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
        <span style={{ fontSize:12, color:'#8a94b0' }}>{expanded?'▲':'▼'}</span>
      </div>
      {expanded && (
        <div style={{ padding:14, animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:10 }}>
            {activeCfg.map(f => (<Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />))}
          </div>
          <PBtn onClick={generate} disabled={loading} color={S}>{loading?'BUILDING...':btnText}</PBtn>
          {loading && <Shimmer />}
          {error && <ErrBox msg={error} />}
          {result && (
            <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(S,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, letterSpacing:1, color:S, marginBottom:8 }}>{result.packageName}</div>
              <p style={{ fontSize:12, color:'#8a94b0', marginBottom:10, lineHeight:1.5 }}>{result.summary}</p>
              {result.keyStop&&(<div style={{ padding:'8px 12px', background:al(S,0.1), border:`1px solid ${al(S,0.25)}`, borderRadius:8, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Primary Assignment</div><div style={{ fontSize:13, color:'#f2f4f8', fontWeight:600 }}>{result.keyStop}</div></div>)}
              {(result.formations||[]).map(f => (<DefFormationCard key={f.number} formation={f} S={S} P={P} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} />))}
              {result.adjustmentTip&&(<div style={{ marginTop:10, padding:10, background:'#0f1117', borderRadius:8, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, color:'#8a94b0', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Halftime Adjustment</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{result.adjustmentTip}</div></div>)}
              {result.coachingCue&&(<div style={{ marginTop:8, padding:10, background:al(S,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Defensive Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic', fontWeight:500 }}>"{result.coachingCue}"</div></div>)}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}


function SituationalPanel({ sport, P='#C0392B', S='#002868', al, callAI }) {
  const isFB=sport==='Football', isBB=sport==='Basketball', isBSB=sport==='Baseball'
  const [soccerScore, setSoccerScore] = useState('Tied'), [situation, setSituation] = useState('Open Play'), [pressure, setPressure] = useState('Mid Block'), [soccerRecs, setSoccerRecs] = useState(null)
  const [sbCount, setSbCount] = useState('0-0'), [sbOuts, setSbOuts] = useState('0 Outs'), [sbInning, setSbInning] = useState('1st'), [sbRunners, setSbRunners] = useState('None on'), [sbScore, setSbScore] = useState('Tied'), [sbHalf, setSbHalf] = useState('1st Half'), [sbTimeLeft, setSbTimeLeft] = useState('45+ min'), [sbRecs, setSbRecs] = useState(null)
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
      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#5a6480', fontWeight:600, marginBottom:3 }}>{label}</div>
      {opts ? (
        <select value={value} onChange={e=>onChange(e.target.value)} style={{ background:'#161922', border:'none', color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, outline:'none', width:'100%', cursor:'pointer' }}>{opts.map(o=><option key={o} style={{background:'#161922'}}>{o}</option>)}</select>
      ) : (
        <input value={value} onChange={e=>onChange(e.target.value)} style={{ background:'#0f1219', border:'none', color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, outline:'none', width:'100%' }} />
      )}
    </div>
  )

  if (isFB) return (
    <Card>
      <CardHead icon="🎯" title="Situational Play Caller" tag="REAL-TIME" tagColor={S} accent={S} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:7, marginBottom:11 }}>
          {statBox('Down',down,setDown,['1st','2nd','3rd','4th'])}
          {statBox('Distance',distance,setDistance,['1','2','3','4','5','6','7','8','9','10','12','15','20+'])}
          {statBox('Field Position',fieldPos,setFieldPos)}
          {statBox('Score',score,setScore,['UP 1','UP 3','UP 7','UP 10','TIED','DOWN 1','DOWN 3','DOWN 7','DOWN 10'])}
          {statBox('Time Left',timeLeft,setTimeLeft)}
          <div style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'9px 11px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <button onClick={getFbRec} disabled={fbLoading} style={{ background:fbLoading?'#3d4559':P, border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, letterSpacing:1, padding:'6px 14px', cursor:fbLoading?'not-allowed':'pointer', width:'100%' }}>{fbLoading?'THINKING...':'GET RECS'}</button>
          </div>
        </div>
        {fbRec.map(r => (<div key={r.n} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:23, width:22, textAlign:'center', lineHeight:1, color:r.top?P:'#6b7a96' }}>{r.n}</div><div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{r.name}</div><div style={{ fontSize:11, color:'#8a94b0', marginTop:2 }}>{r.why}</div></div><div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color:r.top?P:'#6b7a96' }}>{r.pct}</div></div>))}
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
          {bbRec.calls.slice(1).map((c,i)=>(<div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, width:20, textAlign:'center', lineHeight:1, color:'#8a94b0', marginTop:2, flexShrink:0 }}>{i+2}</div><div style={{ flex:1 }}><div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3 }}><div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{c.name}</div><span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background:c.urgency==='HIGH'?al(P,0.2):al(S,0.15), color:c.urgency==='HIGH'?P:S }}>{c.urgency}</span></div><div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.4 }}>{c.why}</div></div></div>))}
        </>)}
      </div>
    </Card>
  )

    const isSoccer = sport === 'Soccer'
  const isSoftball = sport === 'Softball'

  if (isSoccer) return (
    <Card>
      <CardHead icon="⚽" title="Match Situation" tag="LIVE" tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Score</label><select value={soccerScore} onChange={e=>setSoccerScore(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['UP 2','UP 1','Tied','DOWN 1','DOWN 2'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Half</label><select value={sbHalf} onChange={e=>setSbHalf(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['1st Half','2nd Half','Extra Time','Penalty Kicks'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Time Left</label><select value={sbTimeLeft} onChange={e=>setSbTimeLeft(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['45+ min','30 min','15 min','5 min','Stoppage'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:12 }}>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Situation</label><select value={situation} onChange={e=>setSituation(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['Open Play','Corner Kick','Free Kick','Throw-In','Goal Kick','Penalty Kick','Kickoff'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Pressure</label><select value={pressure} onChange={e=>setPressure(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['High Press','Mid Block','Low Block','Mixed'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <PBtn onClick={async()=>{ const r=await callAI('Soccer situational advice: Score '+score+', situation: '+situation+'. Give 3 specific tactical adjustments. Return JSON: {"recommendations":[{"name":"tactic","why":"reason","detail":"1 sentence"}]}'); try { const d=JSON.parse(r.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim().slice(r.indexOf('{'),r.lastIndexOf('}')+1)); setSoccerRecs(d.recommendations||[]) } catch(e){} }} color={P}>GET TACTICAL ADVICE</PBtn>
        {soccerRecs && soccerRecs.map((rec,i)=>(
          <div key={i} style={{ marginTop:8, padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, borderLeft:`3px solid ${P}` }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', marginBottom:3 }}>{rec.name}</div>
            <div style={{ fontSize:11, color:'#8a94b0' }}>{rec.why}</div>
            <div style={{ fontSize:11, color:'#dde1f0', marginTop:3 }}>{rec.detail}</div>
          </div>
        ))}
      </div>
    </Card>
  )

  if (isSoftball) return (
    <Card>
      <CardHead icon="🥎" title="Count and Situation" tag="AT-BAT" tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:12 }}>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Count</label><select value={sbCount} onChange={e=>setSbCount(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['0-0','1-0','2-0','3-0','0-1','1-1','2-1','3-1','0-2','1-2','2-2','3-2'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Outs</label><select value={sbOuts} onChange={e=>setSbOuts(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['0 Outs','1 Out','2 Outs'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Inning</label><select value={sbInning} onChange={e=>setSbInning(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['1st','2nd','3rd','4th','5th','6th','7th','Extra'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:12 }}>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Runners</label><select value={sbRunners} onChange={e=>setSbRunners(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['None on','Runner 1st','Runner 2nd','Runner 3rd','1st and 2nd','1st and 3rd','2nd and 3rd','Bases Loaded'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Score</label><select value={sbScore} onChange={e=>setSbScore(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['UP 3+','UP 2','UP 1','Tied','DOWN 1','DOWN 2','DOWN 3+'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <PBtn onClick={async()=>{ const r=await callAI('Softball situational advice per ASA/USA Softball rules: Count '+count+', Runners: '+runners+', Outs: '+outs+'. Give 3 recommendations. Return JSON: {"recommendations":[{"name":"play","why":"reason","pct":"success %"}]}'); try { const d=JSON.parse(r.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim().slice(r.indexOf('{'),r.lastIndexOf('}')+1)); setSbRecs(d.recommendations||[]) } catch(e){} }} color={P}>GET RECOMMENDATION</PBtn>
        {sbRecs && sbRecs.map((rec,i)=>(
          <div key={i} style={{ marginTop:8, padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, borderLeft:`3px solid ${P}` }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', marginBottom:2 }}>{rec.name}</div>
            <div style={{ fontSize:11, color:'#8a94b0' }}>{rec.why}</div>
            {rec.pct && <div style={{ fontSize:10, color:P, marginTop:2, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{rec.pct} success rate</div>}
          </div>
        ))}
      </div>
    </Card>
  )

  if (isBSB) return (
    <Card>
      <CardHead icon="⚾" title="Count & Situation Manager" tag="AT-BAT" tagColor={S} accent={S} />
      <div style={{ padding:14 }}>
        <div style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:10, padding:'12px 14px', marginBottom:11 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#8a94b0', marginBottom:4 }}>Balls</div><div style={{ display:'flex', gap:5 }}>{[0,1,2,3].map(i=><div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(balls)?'#4ade80':'#1e2330', border:'1px solid #3d4559' }} />)}</div></div>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#8a94b0', marginBottom:4 }}>Strikes</div><div style={{ display:'flex', gap:5 }}>{[0,1,2].map(i=><div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(strikes)?P:'#1e2330', border:'1px solid #3d4559' }} />)}</div></div>
            <div style={{ textAlign:'center' }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#8a94b0', marginBottom:4 }}>Outs</div><div style={{ display:'flex', gap:5 }}>{[0,1,2].map(i=><div key={i} style={{ width:16, height:16, borderRadius:'50%', background:i<parseInt(outs)?'#f59e0b':'#1e2330', border:'1px solid #3d4559' }} />)}</div></div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:7, marginBottom:11 }}>
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
          {bsbRec.moves.slice(1).map((m,i)=>(<div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#161922', borderRadius:8, border:'1px solid #1e2330', marginBottom:7 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, width:20, textAlign:'center', lineHeight:1, color:'#8a94b0', marginTop:2, flexShrink:0 }}>{i+2}</div><div style={{ flex:1 }}><div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:3, flexWrap:'wrap' }}><div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{m.action}</div><span style={{ fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background:'rgba(107,154,255,0.15)', color:'#6b9fff' }}>{m.type}</span></div><div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.4 }}>{m.reason}</div></div></div>))}
        </>)}
      </div>
    </Card>
  )

  return null
}


function GauntletPage({ P='#C0392B', S='#002868', al, sport, iq, setIQ, gauntlets, setGauntlets, callAI, parseJSON }) {
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
              <button key={d} onClick={() => setDifficulty(d)} style={{ flex:1, padding:'8px 4px', background:difficulty===d?diffMap[d].color:'#0f1219', border:`1px solid ${difficulty===d?diffMap[d].color:'#1e2330'}`, borderRadius:6, color:difficulty===d?'#07090d':diffMap[d].color, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:1 }}>{d.toUpperCase()}<div style={{ fontSize:9, fontWeight:400, opacity:0.8, marginTop:1 }}>+{diffMap[d].pts} IQ</div></button>
            ))}
          </div>
          <PBtn onClick={loadScenario} disabled={loading} color={P}>{loading ? 'LOADING...' : scenario ? 'NEXT SCENARIO' : 'START GAUNTLET'}</PBtn>
          {loading && <Shimmer />}
          {scenario && !scenario.error && (
            <div style={{ marginTop:12, animation:'fadeIn 0.3s ease' }}>
              <div style={{ background:'#161922', border:`1px solid ${al(P,0.2)}`, borderRadius:10, padding:13, marginBottom:10 }}>
                <div style={{ display:'flex', gap:10, marginBottom:8 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, padding:'3px 9px', background:al(P,0.15), color:P, borderRadius:4, letterSpacing:1 }}>{scenario.situation}</span>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, padding:'3px 9px', background:'#0f1117', color:'#8a94b0', borderRadius:4 }}>{scenario.phase}</span>
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
              <div style={{ textAlign:'center' }}><div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:22, color:P, lineHeight:1 }}>{score.correct}/{score.total}</div><div style={{ fontSize:9, color:'#8a94b0', textTransform:'uppercase', letterSpacing:1 }}>Correct</div></div>
              <div style={{ flex:1 }}>{iqBars.map(bar => (<div key={bar.label} style={{ marginBottom:5 }}><div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}><span style={{ fontSize:9, color:'#8a94b0' }}>{bar.label}</span><span style={{ fontSize:9, color:P }}>{bar.val}%</span></div><div style={{ height:3, background:'#1e2330', borderRadius:2 }}><div style={{ height:3, width:`${bar.val}%`, background:P, borderRadius:2, transition:'width 0.5s ease' }} /></div></div>))}</div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHead icon="🥊" title={`${coordinatorTitle} vs ${oppTitle}`} tag="BATTLE MODE" tagColor="#f59e0b" accent="#f59e0b" />
        <div style={{ padding:14 }}>
          {!battleStarted ? (
            <>
              <p style={{ fontSize:12, color:'#8a94b0', lineHeight:1.6, marginBottom:12 }}>Go head-to-head with an AI {oppTitle}. Defend your scheme, counter their tactics, and prove your football IQ.</p>
              <PBtn onClick={startBattle} disabled={battleLoading} color="#f59e0b">{battleLoading ? 'LOADING...' : `START BATTLE vs ${oppTitle.toUpperCase()}`}</PBtn>
            </>
          ) : (
            <>
              <div style={{ maxHeight:320, overflowY:'auto', display:'flex', flexDirection:'column', gap:8, marginBottom:10 }}>
                {battleHistory.map((msg, i) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:msg.role==='user'?'flex-end':'flex-start' }}>
                    <div style={{ fontSize:9, letterSpacing:1, color:'#5a6480', marginBottom:2 }}>{msg.role==='user'?'YOU':oppTitle.toUpperCase()}</div>
                    <div style={{ maxWidth:'85%', padding:'9px 12px', borderRadius:10, background:msg.role==='user'?al(P,0.15):'#161922', border:`1px solid ${msg.role==='user'?al(P,0.3):'#1e2330'}`, fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{msg.text}</div>
                  </div>
                ))}
                {battleLoading && <div style={{ fontSize:11, color:'#8a94b0', textAlign:'left', padding:'4px 8px' }}>...</div>}
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


function FilmPage({ P='#C0392B', S='#002868', al, sport, callAI, parseJSON }) {
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
        prompt = `You are an elite youth ${sportCtx} film analyst specializing in TEAM scheme and formation analysis. Analyze this team footage or play diagram. Important: focus on team-level execution, formations, assignments, and scheme - not individual player mechanics. Individual mechanical coaching belongs in separate athlete development. ${description ? 'Coach notes: '+description+'.' : ''} Identify: 1) What you see technically, 2) The key problem or strength, 3) Specific corrective coaching cues. Return ONLY valid JSON: {"headline":"one-line diagnosis","situation":"what is happening in the image","primaryIssue":"the main technical problem","coachingFix":"exact drill or correction","immediateRep":"what to do at very next practice","drillName":"name of the fix drill","drillSteps":["step 1","step 2","step 3"],"proReference":"how a pro coach would phrase this"}`
      } else {
        prompt = `You are an elite youth ${sportCtx} film analyst and master diagnostician specializing in TEAM scheme analysis. A coach describes this team-level problem: "${description}". Diagnose the root cause and give a complete fix. Return ONLY valid JSON: {"headline":"one-line diagnosis","rootCause":"the true underlying cause of the problem","whatYouSee":"what this looks like on film","coachingFix":"the specific correction technique","immediateRep":"exact rep to run at next practice","drillName":"best drill to fix this","drillSteps":["step 1","step 2","step 3"],"commonMistake":"what coaches usually try that doesn't work","proReference":"how an elite coach would address this"}`
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
              <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:6 }}>Describe the Problem</div>
              <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder={`e.g. "${problemExamples[0]}"`} rows={3} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:7, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', resize:'vertical' }} />
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ fontSize:9, color:'#8a94b0', marginBottom:6 }}>Quick examples:</div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {problemExamples.slice(0,3).map((ex,i) => (<div key={i} onClick={() => setDescription(ex)} style={{ fontSize:11, color:'#4a5470', cursor:'pointer', padding:'5px 8px', background:'#0f1117', borderRadius:4, border:'1px solid #1e2330' }}>{ex}</div>))}
              </div>
            </div>
          </>
        )}

        {mode === 'upload' && (
          <div style={{ marginBottom:12 }}>
            <div onClick={() => fileRef.current?.click()} style={{ border:`2px dashed ${al(P,0.3)}`, borderRadius:10, padding:'20px', textAlign:'center', cursor:'pointer', background:al(P,0.05), marginBottom:10 }}>
              {imagePreview ? (<img src={imagePreview} alt="preview" style={{ maxWidth:'100%', maxHeight:200, borderRadius:7, objectFit:'contain' }} />) : (<><div style={{ fontSize:28, marginBottom:6 }}>📎</div><div style={{ fontSize:12, color:'#8a94b0' }}>Tap to upload image or video frame</div><div style={{ fontSize:10, color:'#5a6480', marginTop:3 }}>JPG, PNG, or MP4 (first frame used)</div></>)}
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
            {analysis.whatYouSee && (<div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:10, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4 }}>What You See on Film</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{analysis.whatYouSee}</div></div>)}
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
function SchemePreviewMini({ type='offense', P='#C0392B', sport='Football' }) {
  const diagColor = safeHex(P, '#C0392B') // safeHex already rejects near-white
  const isOff = type === 'offense'
  const col = isOff ? P : '#6b9fff'

  // ── BASKETBALL — full court LANDSCAPE, numbered positions ─────────────────
  if (sport === 'Basketball') {
    return (
      <svg viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet" style={{ width:'100%', height:'100%', display:'block', maxWidth:'100%', overflow:'hidden' }}>
        <rect x="0" y="0" width="200" height="100" fill="#0a0a1f" rx="2"/>
        {/* Full court outline */}
        <rect x="3" y="4" width="194" height="92" rx="2" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
        {/* Half court line */}
        <line x1="100" y1="4" x2="100" y2="96" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
        {/* Centre circle */}
        <circle cx="100" cy="50" r="13" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
        {/* Left key */}
        <rect x="3" y="32" width="32" height="36" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
        <circle cx="35" cy="50" r="11" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6"/>
        <circle cx="7" cy="50" r="2.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
        {/* Right key */}
        <rect x="165" y="32" width="32" height="36" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
        <circle cx="165" cy="50" r="11" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6"/>
        <circle cx="193" cy="50" r="2.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
        {/* 3-point arcs */}
        <path d="M3 18 A46 46 0 0 1 3 82" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
        <path d="M197 18 A46 46 0 0 0 197 82" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
        {isOff ? (
          <>
            {/* 5-out motion offense — right half */}
            <circle cx={155} cy={50} r={6} fill={col} opacity={0.9}/>
            <text x={155} y={52.5} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">1</text>
            <circle cx={132} cy={22} r={6} fill={col} opacity={0.85}/>
            <text x={132} y={24.5} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">2</text>
            <circle cx={132} cy={78} r={6} fill={col} opacity={0.85}/>
            <text x={132} y={80.5} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">3</text>
            <circle cx={115} cy={32} r={6} fill={col} opacity={0.8}/>
            <text x={115} y={34.5} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">4</text>
            <circle cx={115} cy={68} r={6} fill={col} opacity={0.8}/>
            <text x={115} y={70.5} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">5</text>
            {/* Movement arrows */}
            <path d="M150 47 L136 26" stroke={col} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.5"/>
            <path d="M128 24 L118 30" stroke={col} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.5"/>
            {/* Labels */}
            <text x="136" y="14" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="4">SG</text>
            <text x="136" y="90" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="4">SF</text>
            <text x="161" y="50" textAnchor="start" fill="rgba(255,255,255,0.2)" fontSize="4">PG</text>
            <text x="107" y="32" textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="4">PF</text>
            <text x="107" y="70" textAnchor="end" fill="rgba(255,255,255,0.2)" fontSize="4">C</text>
          </>
        ) : (
          <>
            {/* 2-3 zone — right half defending */}
            <rect x={165} y={22} width={12} height={12} rx="2" fill={col} opacity={0.9}/>
            <text x={171} y={30} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">1</text>
            <rect x={182} y={22} width={12} height={12} rx="2" fill={col} opacity={0.9}/>
            <text x={188} y={30} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">2</text>
            <circle cx={170} cy={52} r={6} fill={col} opacity={0.85}/>
            <text x={170} y={54.5} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">3</text>
            <circle cx={150} cy={42} r={6} fill={col} opacity={0.8}/>
            <text x={150} y={44.5} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">4</text>
            <circle cx={150} cy={62} r={6} fill={col} opacity={0.8}/>
            <text x={150} y={64.5} textAnchor="middle" fill="white" fontSize="5.5" fontWeight="700">5</text>
            {/* Zone coverage lines */}
            <line x1="144" y1="52" x2="196" y2="52" stroke={col} strokeWidth="0.6" opacity="0.25" strokeDasharray="2,2"/>
          </>
        )}
      </svg>
    )
  }

  // ── BASEBALL / SOFTBALL — top-down diamond, home at bottom ─────────────────
  if (sport === 'Baseball' || sport === 'Softball') {
    return (
      <svg viewBox="0 0 160 150" style={{ width:'100%', height:'100%' }}>
        <rect x="0" y="0" width="160" height="150" fill="#0a1a0a" rx="2"/>
        {/* Outfield grass wedge */}
        <path d="M80 128 Q144 30 148 20 Q80 10 12 20 Q16 30 80 128Z" fill="rgba(74,120,50,0.12)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8"/>
        {/* Warning track suggestion */}
        <path d="M80 128 Q148 25 148 20 Q80 8 12 20 Q12 25 80 128Z" fill="none" stroke="rgba(180,140,80,0.1)" strokeWidth="3"/>
        {/* Infield dirt */}
        <path d="M80 128 L116 88 L80 48 L44 88 Z" fill="rgba(180,140,80,0.1)" stroke="rgba(255,255,255,0.13)" strokeWidth="1"/>
        {/* Foul lines */}
        <line x1="80" y1="128" x2="12" y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" strokeDasharray="5,3"/>
        <line x1="80" y1="128" x2="148" y2="20" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" strokeDasharray="5,3"/>
        {/* Bases */}
        <rect x="76" y="124" width="8" height="8" rx="1" fill="white" opacity="0.9"/>
        <rect x="112" y="84" width="8" height="8" rx="1" fill="white" opacity="0.75" transform="rotate(45 116 88)"/>
        <rect x="76" y="44" width="8" height="8" rx="1" fill="white" opacity="0.75" transform="rotate(45 80 48)"/>
        <rect x="40" y="84" width="8" height="8" rx="1" fill="white" opacity="0.75" transform="rotate(45 44 88)"/>
        {/* Pitcher mound */}
        <circle cx="80" cy="88" r="5" fill="rgba(180,140,80,0.15)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
        {/* Base labels */}
        <text x="80" y="146" textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="5">HOME</text>
        <text x="126" y="88" textAnchor="start" fill="rgba(255,255,255,0.18)" fontSize="5">1B</text>
        <text x="80" y="43" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="5">2B</text>
        <text x="34" y="88" textAnchor="end" fill="rgba(255,255,255,0.18)" fontSize="5">3B</text>
        {isOff ? (
          <>
            {/* Batter at home, runner on 1B */}
            <circle cx={80} cy={128} r={5} fill={col} opacity={0.9}/>
            <text x={80} y={130.5} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="700">2</text>
            <circle cx={116} cy={88} r={5} fill="#f59e0b" opacity={0.9}/>
            <text x={116} y={90.5} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="700">R</text>
            <circle cx={80} cy={88} r={4} fill={col} opacity={0.7}/>
            <text x={80} y={90} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">1</text>
            {/* Hit ball arrow */}
            <path d="M80 123 L44 55" stroke={col} strokeWidth="1.5" fill="none" strokeDasharray="3,2" opacity="0.7"/>
            {/* Base running arrow */}
            <path d="M116 83 L83 52" stroke="#f59e0b" strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.8"/>
          </>
        ) : (
          <>
            {/* All 9 fielders with position numbers */}
            {[[80,128,'2'],[80,88,'1'],[116,88,'3'],[100,100,'4'],[44,88,'5'],[60,100,'6'],[36,42,'7'],[80,28,'8'],[124,42,'9']].map(([cx,cy,num],i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={5} fill={col} opacity={i<2?0.85:0.8}/>
                <text x={cx} y={cy+2} textAnchor="middle" fill="white" fontSize="5" fontWeight="700">{num}</text>
              </g>
            ))}
          </>
        )}
      </svg>
    )
  }

  // ── SOCCER — LANDSCAPE full field (like reference image) ──────────────────
  if (sport === 'Soccer') {
    return (
      <svg viewBox="0 0 200 120" style={{ width:'100%', height:'100%' }}>
        <rect x="0" y="0" width="200" height="120" fill="#0d1a0d" rx="2"/>
        {/* Field outline */}
        <rect x="4" y="4" width="192" height="112" rx="2" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
        {/* Halfway line */}
        <line x1="100" y1="4" x2="100" y2="116" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
        {/* Centre circle */}
        <circle cx="100" cy="60" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
        <circle cx="100" cy="60" r="1.5" fill="rgba(255,255,255,0.2)"/>
        {/* Left penalty area */}
        <rect x="4" y="28" width="36" height="64" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
        {/* Left goal box */}
        <rect x="4" y="44" width="14" height="32" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
        {/* Left goal */}
        <rect x="1" y="48" width="5" height="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
        {/* Right penalty area */}
        <rect x="160" y="28" width="36" height="64" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
        {/* Right goal box */}
        <rect x="182" y="44" width="14" height="32" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6"/>
        {/* Right goal */}
        <rect x="194" y="48" width="5" height="24" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.7"/>
        {/* Corner arcs */}
        <path d="M4 8 A5 5 0 0 1 9 4" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
        <path d="M196 8 A5 5 0 0 0 191 4" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
        <path d="M4 112 A5 5 0 0 0 9 116" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
        <path d="M196 112 A5 5 0 0 1 191 116" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
        {isOff ? (
          <>
            {/* 4-3-3 attacking right to left (our team attacking left goal) */}
            <circle cx={175} cy={60} r={5} fill={col} opacity={0.5}/> {/* GK */}
            {[160,148,152,160].map((_,i) => null)}
            {/* 4 defenders */}
            {[20,34,46,34].map((y,i) => <circle key={i} cx={[148,148,152,148][i]+0} cy={[28,44,76,92][i]} r={5} fill={col} opacity={0.78}/>)}
            {/* 3 midfielders */}
            {[[120,22],[118,60],[120,98]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r={5} fill={col} opacity={0.85}/>)}
            {/* 3 forwards */}
            {[[88,18],[85,60],[88,102]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r={5} fill={col} opacity={0.92}/>)}
            {/* Attack arrows */}
            <path d="M85 58 L60 58" stroke={col} strokeWidth="1.3" fill="none" strokeDasharray="3,2" opacity="0.6"/>
            <path d="M85 18 L58 30" stroke={col} strokeWidth="1.1" fill="none" strokeDasharray="3,2" opacity="0.5"/>
            <path d="M85 102 L58 90" stroke={col} strokeWidth="1.1" fill="none" strokeDasharray="3,2" opacity="0.5"/>
          </>
        ) : (
          <>
            {/* 4-4-2 defensive block — compact, defending right goal */}
            <circle cx={25} cy={60} r={5} fill={col} opacity={0.5}/> {/* GK */}
            {/* 4 defenders */}
            {[[52,22],[52,44],[52,76],[52,98]].map(([cx,cy],i) => <rect key={i} x={cx-5} y={cy-5} width={10} height={10} rx="1.5" fill={col} opacity={0.9}/>)}
            {/* 4 midfielders */}
            {[[82,22],[82,46],[82,74],[82,98]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r={5} fill={col} opacity={0.82}/>)}
            {/* 2 forwards high */}
            {[[105,42],[105,78]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r={5} fill={col} opacity={0.75}/>)}
            {/* Compactness lines */}
            <line x1="47" y1="22" x2="47" y2="98" stroke={col} strokeWidth="0.6" opacity="0.2" strokeDasharray="2,3"/>
            <line x1="77" y1="22" x2="77" y2="98" stroke={col} strokeWidth="0.6" opacity="0.2" strokeDasharray="2,3"/>
          </>
        )}
      </svg>
    )
  }

  // ── FOOTBALL — landscape overhead, accurate formations ────────────────────
  return (
    <svg viewBox="0 0 200 110" style={{ width:'100%', height:'100%' }}>
      <rect x="0" y="0" width="200" height="110" fill="#0a1a0a" rx="2"/>
      {/* Hash marks */}
      {[50,100,150].map((x,i)=><line key={i} x1={x} y1="5" x2={x} y2="105" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="3,4"/>)}
      {/* LOS */}
      <line x1="5" y1="60" x2="195" y2="60" stroke="rgba(255,255,255,0.18)" strokeWidth="1"/>
      <text x="8" y="57" fill="rgba(255,255,255,0.2)" fontSize="4.5" fontFamily="monospace">LOS</text>
      {/* Opponent territory label */}
      <text x="100" y="20" textAnchor="middle" fill="rgba(255,255,255,0.06)" fontSize="8" fontFamily="monospace">OPPONENT</text>
      {isOff ? (
        <>
          {/* I-Formation offense — ALL behind LOS (y > 60) */}
          {[56,68,80,92,104].map((x,i)=>(
            <g key={i}>
              <rect x={x-6} y={60} width={12} height={9} rx="1.5" fill={col} opacity={0.9}/>
              <text x={x} y={66.5} textAnchor="middle" fill="white" fontSize="3.5">
                {['LT','LG','C','RG','RT'][i]}
              </text>
            </g>
          ))}
          {/* TE right */}
          <rect x={110} y={60} width={12} height={9} rx="1.5" fill={col} opacity={0.8}/>
          <text x={116} y={66.5} textAnchor="middle" fill="white" fontSize="3.5">TE</text>
          {/* WRs on the line */}
          <circle cx={18} cy={62} r={5.5} fill={col} opacity={0.85}/>
          <text x={18} y={64} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">X</text>
          <circle cx={150} cy={62} r={5.5} fill={col} opacity={0.85}/>
          <text x={150} y={64} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">Z</text>
          {/* QB behind LOS */}
          <circle cx={80} cy={72} r={5.5} fill={col} opacity={0.95}/>
          <text x={80} y={74} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="700">QB</text>
          {/* FB */}
          <circle cx={80} cy={82} r={4.5} fill={col} opacity={0.85}/>
          <text x={80} y={84} textAnchor="middle" fill="white" fontSize="4">FB</text>
          {/* HB */}
          <circle cx={80} cy={93} r={5.5} fill={col} opacity={0.9}/>
          <text x={80} y={95} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="700">HB</text>
          {/* Route arrows going TOWARD opponent (lower y = upfield) */}
          <path d="M18 56 L18 40 L38 40" stroke={col} strokeWidth="1.1" fill="none" strokeDasharray="3,2" opacity="0.55"/>
          <path d="M150 56 L150 40 L130 40" stroke={col} strokeWidth="1.1" fill="none" strokeDasharray="3,2" opacity="0.55"/>
        </>
      ) : (
        <>
          {/* 4-3 Defense — all IN FRONT of LOS (y < 60, opponent's side) */}
          {[50,65,95,110].map((x,i)=>(
            <g key={i}>
              <rect x={x-6} y={51} width={12} height={9} rx="1.5" fill={col} opacity={0.9}/>
              <text x={x} y={57.5} textAnchor="middle" fill="white" fontSize="3.5">
                {['DE','DT','DT','DE'][i]}
              </text>
            </g>
          ))}
          {/* LBs */}
          {[52,80,108].map((x,i)=>(
            <g key={i}>
              <circle cx={x} cy={41} r={5.5} fill={col} opacity={0.85}/>
              <text x={x} y={43} textAnchor="middle" fill="white" fontSize="3.5">
                {['OLB','MLB','OLB'][i]}
              </text>
            </g>
          ))}
          {/* CBs */}
          <circle cx={16} cy={36} r={5.5} fill={col} opacity={0.8}/>
          <text x={16} y={38} textAnchor="middle" fill="white" fontSize="3.5">CB</text>
          <circle cx={148} cy={36} r={5.5} fill={col} opacity={0.8}/>
          <text x={148} y={38} textAnchor="middle" fill="white" fontSize="3.5">CB</text>
          {/* Safeties */}
          <circle cx={56} cy={26} r={5.5} fill={col} opacity={0.75}/>
          <text x={56} y={28} textAnchor="middle" fill="white" fontSize="3.5">FS</text>
          <circle cx={104} cy={26} r={5.5} fill={col} opacity={0.75}/>
          <text x={104} y={28} textAnchor="middle" fill="white" fontSize="3.5">SS</text>
        </>
      )}
    </svg>
  )
}
function SchemesPage({ P='#C0392B', S='#002868', al, sport, callAI, parseJSON, playbook, setPlaybook, genHistory, setGenHistory, iq, setIQ, guestMode=false, guestSchemeCount=0, setGuestSchemeCount }) {
  const cfg = SPORTS[sport] || SPORTS.Football
  const initFields = () => { const f={}; cfg.fields.forEach(x=>{f[x.id]=x.opts[0]}); return f }
  const [offFields, setOffFields] = useState(initFields)
  const [offResult, setOffResult] = useState(null)
  const [offLoading, setOffLoading] = useState(false)
  const [offError, setOffError] = useState('')
  const [offOpen, setOffOpen] = useState(true)
  const [defOpen, setDefOpen] = useState(true)
  const [prevSport, setPrevSport] = useState(sport)
  const [diagrams, setDiagrams] = useState({}) // preloaded diagram data keyed by play.number

  if (sport !== prevSport) {
    setPrevSport(sport)
    setOffFields(initFields())
    setOffResult(null)
    setOffError('')
    setDiagrams({})
  }

  async function generateOffense() {
    setOffLoading(true); setOffResult(null); setOffError('')
    try {
      const raw = await callAI(cfg.buildPrompt(offFields), null, true) // fast=true: Haiku for structured JSON
      const data = parseJSON(raw)
      if (!data.plays || !data.plays.length) throw new Error('No plays returned — please try again.')
      setOffResult(data)
      setDiagrams({})
      setGenHistory(prev => ({ ...prev, [sport]: [{ ...data, _sport:sport, _ts:Date.now() }, ...(prev[sport]||[])].slice(0,20) }))
      // Pre-generate all play diagrams in parallel — ready before user taps any card
      if (data.plays && data.plays.length) {
        const sportCfg = SPORTS[sport] || SPORTS.Football
        const isBasketball = sport === 'Basketball'
        const isBaseball = sport === 'Baseball' || sport === 'Softball'
        data.plays.forEach((play, playIdx) => {
          const animatorPlay = { ...play }
          // Determine sport type detection same way PlayAnimator does
          const typeStr = play.type || ''
          const isBB = typeStr.includes('COURT')||typeStr.includes('PRESS')||typeStr.includes('BREAK')||typeStr.includes('INBOUND')||typeStr.includes('TRANSITION')||typeStr.includes('QUICK HITTER')||typeStr.includes('HALF COURT')
          const isBSB = !isBB && (typeStr.includes('BATTING')||typeStr.includes('BASERUN')||typeStr.includes('BUNT')||typeStr.includes('HIT AND RUN')||typeStr.includes('FIRST AND THIRD')||typeStr.includes('OFFENSIVE APPROACH'))
          const detectedSport = isBB ? 'basketball' : isBSB ? 'baseball' : 'football'
          const cacheKey = 'coachiq_anim2_' + (play.name||'').replace(/\s/g,'_').slice(0,30)
          // Check session cache first — skip API call if already cached
          try {
            const cached = sessionStorage.getItem(cacheKey)
            if (cached) { const parsed2 = JSON.parse(cached); setDiagrams(prev => ({ ...prev, [play.number]: parsed2 })); return }
          } catch(e) {}
          // Build same prompt PlayAnimator would build, fire in background
          // Stagger calls by 1.5s per play to avoid rate limiting
          ;(async () => {
            await new Promise(res => setTimeout(res, playIdx * 1500))
            try {
              const fbTemplate = JSON.stringify({formation:"PLAYNAME",snapPoint:0.18,duration:3200,players:[{id:"QB",label:"QB",role:"off",routeType:"route",x:50,y:44,path:[[50,44],[50,40]],routeName:"Handoff",routeYards:0},{id:"RB",label:"RB",role:"off",routeType:"route",x:47,y:47,path:[[47,47],[44,41],[42,34],[42,26]],routeName:"Run",routeYards:8},{id:"WR1",label:"WR",role:"off",routeType:"route",x:18,y:42,path:[[18,42],[18,32],[24,26]],routeName:"Curl",routeYards:0},{id:"WR2",label:"WR",role:"off",routeType:"route",x:82,y:42,path:[[82,42],[82,26]],routeName:"Go",routeYards:0},{id:"TE",label:"TE",role:"off",routeType:"block",x:64,y:42,path:[[64,42],[62,38]],routeName:"Block",routeYards:0},{id:"LT",label:"T",role:"off",routeType:"block",x:38,y:42,path:[[38,42],[38,38]],routeName:"",routeYards:0},{id:"LG",label:"G",role:"off",routeType:"block",x:44,y:42,path:[[44,42],[44,38]],routeName:"",routeYards:0},{id:"C",label:"C",role:"off",routeType:"block",x:50,y:42,path:[[50,42],[50,38]],routeName:"",routeYards:0},{id:"RG",label:"G",role:"off",routeType:"block",x:56,y:42,path:[[56,42],[56,38]],routeName:"",routeYards:0},{id:"RT",label:"T",role:"off",routeType:"block",x:62,y:42,path:[[62,42],[62,38]],routeName:"",routeYards:0},{id:"d1",label:"D",role:"def",routeType:"block",x:44,y:36,path:[[44,36],[44,38]],routeName:"Gap A",routeYards:0},{id:"d2",label:"D",role:"def",routeType:"block",x:50,y:36,path:[[50,36],[50,38]],routeName:"Gap A",routeYards:0},{id:"d3",label:"D",role:"def",routeType:"block",x:56,y:36,path:[[56,36],[56,38]],routeName:"Gap B",routeYards:0},{id:"d4",label:"LB",role:"def",routeType:"route",x:42,y:28,path:[[42,28],[42,34]],routeName:"Hook Zone",routeYards:0},{id:"d5",label:"LB",role:"def",routeType:"route",x:58,y:28,path:[[58,28],[58,34]],routeName:"Hook Zone",routeYards:0},{id:"d6",label:"CB",role:"def",routeType:"route",x:18,y:38,path:[[18,38],[18,30]],routeName:"Man",routeYards:0},{id:"d7",label:"CB",role:"def",routeType:"route",x:82,y:38,path:[[82,38],[82,30]],routeName:"Man",routeYards:0},{id:"d8",label:"S",role:"def",routeType:"route",x:50,y:18,path:[[50,18],[50,24]],routeName:"Deep Middle",routeYards:0}]})
              const bbTemplate = JSON.stringify({formation:"PLAYNAME",snapPoint:0.15,duration:3500,players:[{id:"PG",label:"1",role:"off",routeType:"route",x:50,y:50,path:[[50,50],[50,38]],routeName:"BALL: Dribble up",routeYards:0},{id:"SG",label:"2",role:"off",routeType:"route",x:72,y:44,path:[[72,44],[78,30]],routeName:"CUT: Wing",routeYards:0},{id:"SF",label:"3",role:"off",routeType:"route",x:82,y:36,path:[[82,36],[85,24]],routeName:"SHOOT: Corner",routeYards:0},{id:"PF",label:"4",role:"off",routeType:"block",x:62,y:20,path:[[62,20],[62,20]],routeName:"SCREEN: High",routeYards:0},{id:"C5",label:"5",role:"off",routeType:"block",x:50,y:14,path:[[50,14],[50,14]],routeName:"MOVE: Post",routeYards:0},{id:"d1",label:"D",role:"def",routeType:"block",x:50,y:52,path:[[50,52],[50,53]],routeName:"",routeYards:0},{id:"d2",label:"D",role:"def",routeType:"block",x:72,y:46,path:[[72,46],[72,47]],routeName:"",routeYards:0},{id:"d3",label:"D",role:"def",routeType:"block",x:82,y:38,path:[[82,38],[82,39]],routeName:"",routeYards:0},{id:"d4",label:"D",role:"def",routeType:"block",x:62,y:22,path:[[62,22],[62,23]],routeName:"",routeYards:0},{id:"d5",label:"D",role:"def",routeType:"block",x:50,y:16,path:[[50,16],[50,17]],routeName:"",routeYards:0}]})
              const bsbTemplate = JSON.stringify({formation:"PLAYNAME",snapPoint:0.2,duration:3000,players:[{id:"P",label:"P",role:"off",routeType:"block",x:50,y:28,path:[[50,28],[50,28]],routeName:"Pitch",routeYards:0},{id:"C",label:"C",role:"off",routeType:"block",x:50,y:44,path:[[50,44],[50,44]],routeName:"Receive",routeYards:0},{id:"1B",label:"1B",role:"off",routeType:"block",x:74,y:38,path:[[74,38],[74,38]],routeName:"Hold",routeYards:0},{id:"2B",label:"2B",role:"off",routeType:"block",x:64,y:26,path:[[64,26],[64,26]],routeName:"Cover",routeYards:0},{id:"SS",label:"SS",role:"off",routeType:"block",x:38,y:28,path:[[38,28],[38,28]],routeName:"Cover",routeYards:0},{id:"3B",label:"3B",role:"off",routeType:"block",x:26,y:38,path:[[26,38],[26,38]],routeName:"Hold",routeYards:0},{id:"LF",label:"LF",role:"off",routeType:"block",x:20,y:10,path:[[20,10],[20,10]],routeName:"Pos",routeYards:0},{id:"CF",label:"CF",role:"off",routeType:"block",x:50,y:6,path:[[50,6],[50,6]],routeName:"Pos",routeYards:0},{id:"RF",label:"RF",role:"off",routeType:"block",x:80,y:10,path:[[80,10],[80,10]],routeName:"Pos",routeYards:0},{id:"BAT",label:"B",role:"def",routeType:"route",x:50,y:46,path:[[50,46],[62,36]],routeName:"Run to 1B",routeYards:0}]})
              // pathDelay rules injected into every football prompt:
              // FB/pulling G = pathDelay -0.15 (fire before RB, lead the play)
              // RB = pathDelay 0.12 (waits for hole to open)
              // WRs/TEs running routes = pathDelay 0 (fire on snap)
              // Linemen blocking = pathDelay 0
              let prompt
              if (isBB) {
                prompt = 'Generate basketball play diagram for: ' + play.name + ' (' + (play.type||'') + '). ' + (play.note||'') + ' COORDINATE SYSTEM: x=0-100 left-right, y=0-60 top-bottom. Basket at y=6 (top). Players attack UPWARD (lower y = closer to basket). ONE player routeName starts with BALL:, ONE starts with SHOOT:, others use CUT:, MOVE:, or SCREEN:. Return ONLY raw JSON: ' + bbTemplate.replace('PLAYNAME', play.name)
              } else if (isBSB) {
                prompt = 'Generate baseball/softball field diagram for: ' + play.name + ' (' + (play.type||'') + '). ' + (play.note||'') + ' COORDINATE SYSTEM: x=0-100 left-right, y=0-60 top-bottom. Home plate at y=50 x=50. First base at y=36 x=74. Second base at y=22 x=50. Third base at y=36 x=26. Pitcher mound at y=34 x=50. Return ONLY raw JSON: ' + bsbTemplate.replace('PLAYNAME', play.name)
              } else {
                prompt = 'You are an NFL offensive coordinator generating a precise football play diagram. Play: ' + play.name + ' (' + (play.type||'') + '). Description: ' + (play.note||'') +
                  '\n\nCOORDINATE SYSTEM: x=0-100 left-right, y=0-60 top-bottom. LOS offense y=42, dashed y=38. Forward = LOWER y. Defenders y=34-38, LBs y=26-32, safeties y=12-22.' +
                  '\n\nDIAGRAM ACCURACY IS EVERYTHING. This must be a direct accurate schematic of this specific play as an NFL or college coach would draw it. Every alignment, route, blocking assignment, and path must be correct for this exact play concept.' +
                  '\n\nSCHEME SPECIFICITY: Honor the system, personnel, and age group from the play name and description. Wing-T looks different from Spread. Youth plays are simpler than varsity. The formation and blocking must match the actual system.' +
                  '\n\nFORMATION: Correct pre-snap alignment for this play. OL spaced ~3 units apart centered on C at x=50. WRs at x=10-20 and x=80-90 unless slot. TE at x=65-68. FB directly behind C at y=47-48 in I-formation. HB/RB at y=50-52 in I or offset. QB under center y=44, shotgun y=46.' +
                  '\n\nBLOCKING AND ROUTE ACCURACY: Inside zone = all OL step playside, no pulls. Outside zone = OL reach block. Counter = backside G and T pull through. Power = one G pulls, FB lead blocks. Trap = opposite G traps DL. Sweep = lead blockers outside. Pass plays = correct route combinations matching the concept (flood, mesh, smash, four verts, levels, etc).' +
                  '\n\nPATH RULES: Offense attacking = LOWER y. QB drop = HIGHER y (away from LOS). DL = higher y. Coverage = lower y.' +
                  '\n\nROUTE SHAPES — use these exact shapes:' +
                  '\n• SLANT: 2-step stem upfield, then 45° diagonal INWARD toward center. Left WR: [[18,42],[18,38],[32,30]]. Right WR: [[82,42],[82,38],[68,30]]. NEVER toward sideline.' +
                  '\n• HITCH: stem upfield, break BACK toward LOS. Left: [[18,42],[18,32],[18,38]].' +
                  '\n• OUT: stem upfield, 90° break TOWARD sideline. Left: [[18,42],[18,34],[8,34]]. Right: [[82,42],[82,34],[92,34]].' +
                  '\n• CURL: stem 8-10yds, curl back facing QB. Left: [[18,42],[18,28],[18,34]].' +
                  '\n• DIG/IN: stem 10-14yds, 90° break INWARD across field. [[18,42],[18,22],[55,22]].' +
                  '\n• POST: stem upfield, diagonal INWARD toward goalpost. [[18,42],[18,22],[40,8]].' +
                  '\n• CORNER: stem upfield, diagonal OUTWARD toward corner. Left: [[18,42],[18,22],[6,8]].' +
                  '\n• FLY/GO: straight vertical. [[18,42],[18,10]].' +
                  '\n• SEAM: vertical inside numbers. [[65,42],[65,8]].' +
                  '\n• SWING/FLAT RB: quick horizontal to flat. Right: [[52,50],[72,46],[78,42]].' +
                  '\nAdjust depth/break to match the play concept and formation — these are shapes, not fixed coordinates.' +
                  '\n\npathDelay — DEFAULT is 0. Only assign non-zero when the play specifically requires it.' +
                  '\n• Pulling G or T on counter/power/trap: pathDelay:0. They fire ON the snap and pull laterally — never before the snap. Path shows lateral pull route then upfield to block point. NEVER negative pathDelay for any lineman.' +
                  '\n• Ball carrier RB: pathDelay:0.10.' +
                  '\n• Deep routes over 12yd: pathDelay:0.06.' +
                  '\n• PRE-SNAP MOTION: ONLY if play name or description explicitly says motion/jet/fly/orbit. ONLY eligible receivers (WR, TE, slot, H-back). NEVER C, G, T, QB. Motion path must be purely lateral (y flat) or backward (y increases). MOST PLAYS HAVE ZERO PRE-SNAP MOTION.' +
                  '\n\nRECEIVER ALIGNMENT: WRs always outside OL (OL x=36-64). Left WR at x=10-22, right WR at x=78-90, slot at x=24-34 or x=66-76. Short routes (slant/hitch/quick-out under 6yd): path must never cross x=36-64 — stay outside. Slant from left WR: x=18,y=42 → x=32,y=32, staying outside OL. Crossing routes only enter OL x-zone after clearing y=32 (past OL engagement).' +
                  '\n\nPA: Play description dictates QB and RB roles. QB fakes toward run direction (y stays ~44, x shifts), then rolls out or drops back (y INCREASES). Left bootleg ends x=20-28 y=48-52. Right bootleg ends x=72-80 y=48-52. Pocket PA: y=52-56. RB role is play-specific: fake into run lane, checkdown flat, or misdirection opposite — read the play description. QB and RB should NOT go same direction unless play requires it. NEVER lower y for QB. Mark one receiver routeYards > 0.' +
                  '\n\nQB pure pass: HIGHER y. 3-step: [[50,44],[50,50]]. 5-step: [[50,44],[50,53]]. NEVER lower y on pass.' +
                  '\n\nQB run footwork (real NFL mechanics): Under center — opens to playside, 1-2 steps to mesh, fake opposite. Shotgun zone read — J-step lateral (y stays ~50), holds ball for mesh, then decoy step away from RB. QB does NOT move forward before handoff. Minimal footwork until after mesh. routeName: Handoff Left, Handoff Right, Zone Read Left, Zone Read Right, Pitch Left, Pitch Right, Keeper Left, Keeper Right, 3-Step Drop, 5-Step Drop, PA Bootleg Left, PA Bootleg Right.' +
                  '\n\nReturn ONLY raw JSON: ' + fbTemplate.replace('PLAYNAME', play.name)
              }
              const raw = await callAI(prompt)
              const parsed3 = parseJSON(raw)
              if (parsed3 && parsed3.players && parsed3.players.length > 0) {
                parsed3._sportType = detectedSport
                // ── SANITIZER (mirrors PlayAnimator sanitizer) ──────────────────
                const OL_SET = new Set(['C','G','T'])
                const DL_SET = new Set(['DE','DT','NT','DL','D'])
                const INELIG_SET = new Set(['C','G','T','DE','DT','NT','DL','D'])
                parsed3.players.forEach(p => {
                  if (!p.path || p.path.length < 2) return
                  // Rule 1: no pre-snap motion for ineligible players
                  if ((INELIG_SET.has(p.label) || p.label === 'QB') && (p.pathDelay || 0) < 0) p.pathDelay = 0
                  // Rule 2: OL blockers must move forward (lower y)
                  if (OL_SET.has(p.label) && p.role === 'off' && p.routeType === 'block') {
                    for (let i = 1; i < p.path.length; i++) {
                      if (p.path[i][1] > p.path[i-1][1]) p.path[i][1] = p.path[i-1][1] - 1
                    }
                    if (p.path[p.path.length-1][1] >= p.path[0][1]) p.path[p.path.length-1][1] = p.path[0][1] - 2
                  }
                  // Rule 3: RB/HB/FB run paths must end significantly forward
                  if (['RB','HB','FB'].includes(p.id) && p.routeType === 'route' && p.role === 'off') {
                    const startY3 = p.path[0][1], endY3 = p.path[p.path.length-1][1]
                    if (endY3 >= startY3 - 4) p.path[p.path.length-1] = [p.path[Math.floor(p.path.length/2)][0], startY3 - 10]
                  }
                  // Rule 4: DL must move toward LOS (higher y)
                  if (DL_SET.has(p.label) && p.role === 'def') {
                    for (let i = 1; i < p.path.length; i++) {
                      if (p.path[i][1] < p.path[i-1][1]) p.path[i][1] = p.path[i-1][1] + 1
                    }
                  }
                  // Rule 5: receivers must end past LOS — only correct if route ends at/behind LOS
                  if (['WR','TE','WR1','WR2','WR3'].includes(p.label) && p.routeType === 'route' && p.role === 'off') {
                    if (p.path[p.path.length-1][1] >= 40) p.path[p.path.length-1][1] = 34
                  }
                  // Rule 6: keep everyone on field
                  p.path = p.path.map(pt => [Math.max(2,Math.min(98,pt[0])), Math.max(5,Math.min(57,pt[1]))])
                  p.x = Math.max(2,Math.min(98,p.x)); p.y = Math.max(5,Math.min(57,p.y))
                  // Rule 8: QB on pass plays must end at higher y (dropped back)
                  if (p.label === 'QB' && p.role === 'off') {
                    const qbR = (p.routeName || '').toLowerCase()
                    const isPassQ = (qbR.includes('drop')||qbR.includes('pa ')||qbR.includes('bootleg')||qbR.includes('pass')) && !qbR.includes('handoff') && !qbR.includes('zone read') && !qbR.includes('pitch') && !qbR.includes('keeper') && !qbR.includes('sneak') && !qbR.includes('dive')
                    if (isPassQ && p.path.length >= 2) {
                      const sY = p.path[0][1], eY = p.path[p.path.length-1][1]
                      if (eY < sY + 3) {
                        const bl = p.path[p.path.length-1]
                        if (qbR.includes('left')) { bl[0] = Math.min(28, bl[0]); bl[1] = sY + 6 }
                        else if (qbR.includes('right')) { bl[0] = Math.max(72, bl[0]); bl[1] = sY + 6 }
                        else { bl[1] = sY + 8 }
                      }
                    }
                  }
                  // Rule 7: route shape + collision enforcement
                  const isRecv7 = ['WR','TE','WR1','WR2','WR3','SL'].includes(p.label)
                  if (isRecv7 && p.routeType === 'route' && p.role === 'off') {
                    const sx7 = p.path[0][0], lastPt = p.path[p.path.length-1]
                    const rn7 = (p.routeName||'').toLowerCase()
                    // Slant must go inward
                    if (rn7.includes('slant')) {
                      if (sx7 < 50 && lastPt[0] <= sx7) { lastPt[0] = sx7 + 14; lastPt[1] = Math.min(lastPt[1], 30) }
                      if (sx7 > 50 && lastPt[0] >= sx7) { lastPt[0] = sx7 - 14; lastPt[1] = Math.min(lastPt[1], 30) }
                    }
                    // Short route OL collision
                    if (!rn7.includes('slant') && lastPt[1] > 28 && lastPt[0] > 34 && lastPt[0] < 66 && lastPt[1] > 34) {
                      lastPt[0] = sx7 < 50 ? Math.min(lastPt[0], 32) : Math.max(lastPt[0], 68)
                    }
                  }
                })
                // ── END SANITIZER ────────────────────────────────────────────────
                try { sessionStorage.setItem(cacheKey, JSON.stringify(parsed3)) } catch(e) {}
                setDiagrams(prev => ({ ...prev, [play.number]: parsed3 }))
              }
            } catch(e) {} // silent fail — PlayAnimator will handle on demand if needed
          })()
        })
      }
      if (guestMode && setGuestSchemeCount) setGuestSchemeCount(n => n + 1)
    } catch(e) {
      const msg = e.message || 'Generation failed'
      if (msg.includes('timed out') || msg.includes('AbortError') || msg.includes('timeout')) {
        setOffError('This took too long to respond. This can happen on slow connections. Tap "Try Again" — it usually works on the second attempt.')
      } else {
        setOffError(msg)
      }
    }
    setOffLoading(false)
  }

  function addToPlaybook(play, folderName) {
    const sportFolders = playbook[sport] || {}
    const folder = sportFolders[folderName] || []
    setPlaybook(ppb => ({
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
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', color:'#f2f4f8', flex:1, textTransform:'uppercase' }}>{{ Football:'Offensive Scheme Generator', Basketball:'Offensive Scheme Generator', Baseball:'Game Plan Generator', Soccer:'Attacking Scheme Builder', Softball:'Game Plan Generator' }[sport] || 'Offensive Scheme Generator'}</span>
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'1px', padding:'2px 7px', borderRadius:2, background:al(P,0.15), color:P, textTransform:'uppercase' }}>{{ Football:'OFFENSE', Basketball:'OFFENSE', Baseball:'OFFENSE', Soccer:'ATTACK', Softball:'OFFENSE' }[sport]||'OFFENSE'}</span>
          <span style={{ fontSize:12, color:'#8a94b0', marginLeft:4 }}>{offOpen ? '▲' : '▼'}</span>
        </div>
        {offOpen && (
          <div style={{ padding:14, animation:'fadeIn 0.2s ease', background:'#0f1219' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:10 }}>
              {(() => { const skillVal = offFields['skill'] || offFields['teamSkill'] || (cfg.fields.find(x=>x.id==='skill'||x.id==='teamSkill')?.opts[0]||''); const isBeginner = skillVal.includes('First Year') || skillVal.includes('Beginner') || skillVal.includes('Recreational'); return cfg.fields.filter(f => !(f.id==='oppTendency' && isBeginner)).map(f => <Sel key={f.id} label={f.label} value={offFields[f.id]||f.opts[0]} onChange={v=>setOffFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />) })()} 
            </div>
            {guestMode && guestSchemeCount === 1 && (
              <div style={{ padding:'8px 12px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:6, marginBottom:8 }}>
                <div style={{ fontSize:10, color:'#f59e0b', fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>1 GENERATION REMAINING</div>
                <div style={{ fontSize:10, color:'#8a94b0', marginTop:2 }}>Create a free account to generate unlimited schemes.</div>
              </div>
            )}
            <PBtn onClick={generateOffense} disabled={offLoading} color={P}>{offLoading ? 'GENERATING...' : sport==='Baseball' ? 'GENERATE GAME PLAN' : 'GENERATE SCHEME'}</PBtn>
            {offLoading && (<div style={{ padding:'20px 16px', textAlign:'center', background:'#161922', borderRadius:6, border:'1px solid #1e2330', marginTop:8 }}><div style={{ width:20, height:20, borderRadius:'50%', border:`3px solid ${P}`, borderTopColor:'#0f1219', animation:'spin 0.8s linear infinite', margin:'0 auto 10px' }}/><div style={{ fontSize:12, color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:4 }}>Building your scheme...</div><div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5 }}>This takes 20–40 seconds. Please keep this screen open.</div></div>)}
            {offError && (
            <div style={{ marginTop:8, padding:'12px 14px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6 }}>
              <div style={{ fontSize:11, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:4 }}>Generation Failed</div>
              <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.5 }}>{offError}</div>
              <button onClick={()=>{ setOffError(''); generateOffense() }} style={{ marginTop:8, padding:'6px 12px', background:'#ef4444', border:'none', borderRadius:4, color:'white', fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Try Again</button>
            </div>
          )}
            {offResult && (
              <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, letterSpacing:1, color:P, marginBottom:6 }}>{offResult.packageName}</div>
                <p style={{ fontSize:12, color:'#8a94b0', marginBottom:10, lineHeight:1.5 }}>{offResult.summary}</p>
                {offResult.defenseTip && (<div style={{ padding:'8px 12px', background:'rgba(107,154,255,0.08)', border:'1px solid rgba(107,154,255,0.2)', borderRadius:8, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:'#6b9fff', textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Defensive Context</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{offResult.defenseTip}</div></div>)}
                {(offResult.plays||[]).map(play => (
                  <PlayCardWithSave key={play.number} play={play} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} playbook={playbook} onAddToPlaybook={addToPlaybook} onCreateAndAdd={createAndAdd} preloadedDiagram={diagrams[play.number]||null} />
                ))}
                {offResult.coachingCue && (<div style={{ marginTop:10, padding:10, background:al(P,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Coaching Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic' }}>"{offResult.coachingCue}"</div></div>)}
                {/* Coming Soon tease */}
                <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(245,158,11,0.06)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:8, display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:18, flexShrink:0 }}>📖</span>
                  <div>
                    <div style={{ fontSize:10, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:2 }}>COMING SOON — FULL PLAY BREAKDOWN</div>
                    <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.4 }}>Audible triggers, pre-snap reads, youth coaching cues, and mistake breakdowns — streaming live for every play.</div>
                  </div>
                </div>
              </div>
            )}
            {/* Recent generations */}
            {sportHistory.length > 0 && (
              <div style={{ marginTop:14 }}>
                <div style={{ fontSize:9, letterSpacing:2, color:'#5a6480', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Recent Generations</div>
                {sportHistory.slice(0,5).map((h,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#0f1117', border:'1px solid #1e2330', borderRadius:6, marginBottom:6 }}>
                    <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:600, color:'#dde1f0' }}>{h.packageName}</div><div style={{ fontSize:10, color:'#8a94b0', marginTop:1 }}>{h.plays?.length} plays</div></div>
                    <button onClick={() => setOffResult(h)} style={{ fontSize:9, color:P, background:al(P,0.1), border:`1px solid ${al(P,0.3)}`, borderRadius:3, padding:'3px 8px', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>VIEW</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* DEFENSIVE GENERATOR */}
      <DefenseGenCollapsible sport={sport} P={P} S={'#6b9fff'} al={al} callAI={callAI} parseJSON={parseJSON} defaultOpen={true} playbook={playbook} setPlaybook={setPlaybook} guestMode={guestMode} setGuestSchemeCount={setGuestSchemeCount} />

      <PlayNameBuilder P={P} S={S} al={al} sport={sport} />
    </div>
  )
}

// ─── PLAY CARD WITH SAVE TO PLAYBOOK ─────────────────────────────────────────
function PlayCardWithSave({ play, P='#C0392B', S='#002868', al, callAI, parseJSON, sport, playbook, onAddToPlaybook, onCreateAndAdd, preloadedDiagram=null }) {
  const [showSaveMenu, setShowSaveMenu] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const wrapRef = useRef(null)
  const sportFolders = playbook[sport] || {}
  const existingFolders = [...new Set([...DEFAULT_FOLDERS[sport]||[], ...Object.keys(sportFolders)])]
  const [saved, setSaved] = useState(false)

  function handleAdd(folder) {
    onAddToPlaybook(play, folder)
    setSaved(folder)
    setShowSaveMenu(false)
  }

  return (
    <div ref={wrapRef} style={{ position:'relative' }}>
      <PlayCard play={play} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} preloadedDiagram={preloadedDiagram} extraAction={
        <div style={{ position:'relative' }}>
          {saved ? (
            <span style={{ fontSize:9, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>✓ SAVED</span>
          ) : (
            <button onClick={e=>{e.stopPropagation();setShowSaveMenu(s=>!s)}} style={{ padding:'3px 8px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:3, color:P, fontSize:9, fontWeight:700, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, whiteSpace:'nowrap' }}>+ PLAYBOOK</button>
          )}
          {showSaveMenu && (
            <div style={{ position:'absolute', right:0, top:'100%', marginTop:4, background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:8, zIndex:50, minWidth:180, boxShadow:'0 8px 24px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:1.5, textTransform:'uppercase', fontWeight:700, marginBottom:6, padding:'0 4px' }}>Add to folder</div>
              {existingFolders.map(f => (
                <div key={f} onClick={()=>handleAdd(f)} style={{ padding:'7px 10px', fontSize:12, color:'#f2f4f8', cursor:'pointer', borderRadius:5, display:'flex', alignItems:'center', gap:6 }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'} onMouseLeave={e=>e.currentTarget.style.background='#161922'}>
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
function DefenseGenCollapsible({ sport, P='#C0392B', S='#002868', al, callAI, parseJSON, defaultOpen=true, playbook, setPlaybook, guestMode=false, setGuestSchemeCount }) {
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
      const raw = await callAI(prompt, null, true) // fast=true: Haiku for structured JSON
      setResult(data)
      if (guestMode && setGuestSchemeCount) setGuestSchemeCount(n => n + 1)
    } catch(e) {
      const msg = e.message || 'Generation failed'
      if (msg.includes('timed out') || msg.includes('timeout')) {
        setError('This took too long to respond. Tap "Retry" — it usually works on the second attempt.')
      } else {
        setError(msg)
      }
    }
    setLoading(false)
  }

  function addDefToPlaybook(formation, folderName) {
    const sportFolders = playbook[sport] || {}
    const folder = sportFolders[folderName] || []
    const play = { number: formation.number, name: formation.name, type: formation.type, note: formation.assignment, _isDefense: true, _fromPackage: result?.packageName, _addedAt: Date.now() }
    setPlaybook(ppb => ({ ...pb, [sport]: { ...sportFolders, [folderName]: [...folder, play] } }))
  }

  return (
    <Card>
      <div style={{ padding:'11px 14px', borderBottom: open ? '1px solid #1e2330' : 'none', display:'flex', alignItems:'center', gap:9, borderLeft:`3px solid ${S}`, cursor:'pointer' }} onClick={() => setOpen(o=>!o)}>
        <span style={{ fontSize:15 }}>🛡</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', color:'#f2f4f8', flex:1, textTransform:'uppercase' }}>{{ Football:'Defensive Scheme Generator', Basketball:'Defensive Scheme Generator', Baseball:'Defensive Positioning', Soccer:'Defensive Shape Builder', Softball:'Defensive Positioning' }[sport] || 'Defensive Scheme Generator'}</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, fontWeight:700, letterSpacing:'1px', padding:'2px 7px', borderRadius:2, background:al(S,0.15), color:S, textTransform:'uppercase' }}>DEFENSIVE</span>
        <span style={{ fontSize:12, color:'#8a94b0', marginLeft:4 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding:14, animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:10 }}>
            {activeCfg.map(f => (<Sel key={f.id} label={f.label} value={fields[f.id]||f.opts[0]} onChange={v=>setFields(prev=>({...prev,[f.id]:v}))} options={f.opts} />))}
          </div>
          <PBtn onClick={generate} disabled={loading} color={S}>{loading ? 'BUILDING...' : isBSB ? 'BUILD DEFENSIVE PLAN' : 'BUILD DEFENSIVE SCHEME'}</PBtn>
          {loading && <div style={{ padding:'20px 16px', textAlign:'center', background:'#161922', borderRadius:6, border:'1px solid #1e2330', marginTop:8 }}><div style={{ width:20, height:20, borderRadius:'50%', border:`3px solid ${S}`, borderTopColor:'#0f1219', animation:'spin 0.8s linear infinite', margin:'0 auto 10px' }}/><div style={{ fontSize:12, color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:4 }}>Building your defensive scheme...</div><div style={{ fontSize:11, color:'#8a94b0' }}>This takes 20–40 seconds. Please keep this screen open.</div></div>}
          {error && <ErrBox msg={error} />}
          {result && (
            <div style={{ marginTop:12, background:'#161922', border:`1px solid ${al(S,0.3)}`, borderRadius:10, padding:13, animation:'fadeIn 0.3s ease' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, letterSpacing:1, color:S, marginBottom:6 }}>{result.packageName}</div>
              <p style={{ fontSize:12, color:'#8a94b0', marginBottom:10, lineHeight:1.5 }}>{result.summary}</p>
              {result.keyStop && (<div style={{ padding:'8px 12px', background:al(S,0.1), border:`1px solid ${al(S,0.25)}`, borderRadius:8, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Primary Assignment</div><div style={{ fontSize:13, color:'#f2f4f8', fontWeight:600 }}>{result.keyStop}</div></div>)}
              {(result.formations||[]).map(f => (
                <DefFormationCardWithSave key={f.number} formation={f} S={S} P={P} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} playbook={playbook} onAddToPlaybook={addDefToPlaybook} />
              ))}
              {result.adjustmentTip && (<div style={{ marginTop:10, padding:10, background:'#0f1117', borderRadius:8, border:'1px solid #1e2330' }}><div style={{ fontSize:9, letterSpacing:2, color:'#8a94b0', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Halftime Adjustment</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{result.adjustmentTip}</div></div>)}
              {result.coachingCue && (<div style={{ marginTop:8, padding:10, background:al(S,0.1), borderRadius:8 }}><div style={{ fontSize:9, letterSpacing:2, color:S, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Defensive Cue</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic' }}>"{result.coachingCue}"</div></div>)}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

function DefFormationCardWithSave({ formation: f, S, P='#C0392B', al, callAI, parseJSON, sport, playbook, onAddToPlaybook }) {
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
                <div key={fn} onClick={()=>{onAddToPlaybook(f,fn);setSaved(fn);setShowSaveMenu(false)}} style={{ padding:'7px 10px', fontSize:12, color:'#f2f4f8', cursor:'pointer', borderRadius:5 }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'} onMouseLeave={e=>e.currentTarget.style.background='#161922'}>
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
function PlaybookPage({ P='#C0392B', S='#002868', al, sport, callAI, parseJSON, playbook, setPlaybook }) {
  const sportFolders = playbook[sport] || {}
  const allFolderNames = [...new Set([...DEFAULT_FOLDERS[sport]||[], ...Object.keys(sportFolders)])]
  const [activeFolder, setActiveFolder] = useState(allFolderNames[0] || 'My Favorites')
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)

  const folderPlays = sportFolders[activeFolder] || []

  function removePlay(idx) {
    const updated = folderPlays.filter((_,i)=>i!==idx)
    setPlaybook(ppb => ({ ...pb, [sport]: { ...sportFolders, [activeFolder]: updated } }))
  }

  function createFolder() {
    if (!newFolderName.trim()) return
    setActiveFolder(newFolderName.trim())
    setNewFolderName('')
    setShowNewFolder(false)
  }

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#5a6480', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Your saved plays</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Playbook</div>
      </div>

      {/* Folder tabs */}
      <div style={{ overflowX:'auto', display:'flex', gap:6, paddingBottom:4, marginBottom:12 }}>
        {allFolderNames.map(f => (
          <button key={f} onClick={()=>setActiveFolder(f)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:`1px solid ${activeFolder===f?P:'#1e2330'}`, background:activeFolder===f?al(P,0.15):'transparent', color:activeFolder===f?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px', whiteSpace:'nowrap' }}>
            {f} <span style={{ opacity:0.6, marginLeft:3 }}>{(sportFolders[f]||[]).length}</span>
          </button>
        ))}
        <button onClick={()=>setShowNewFolder(s=>!s)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:'1px dashed #1e2330', background:'#161922', color:'#5a6480', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ New Folder</button>
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
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#8a94b0', letterSpacing:'1px', marginBottom:6 }}>{activeFolder} is empty</div>
            <div style={{ fontSize:12, color:'#5a6480', lineHeight:1.6 }}>Generate a scheme in the Schemes tab and tap "+ Playbook" to add plays here.</div>
          </div>
        </Card>
      ) : (
        <div>
          <div style={{ fontSize:10, color:'#8a94b0', marginBottom:8 }}>{folderPlays.length} play{folderPlays.length!==1?'s':''} in {activeFolder}</div>
          {folderPlays.map((play, i) => (
            <div key={i} style={{ marginBottom:8, position:'relative' }}>
              <div style={{ position:'absolute', top:8, right:8, zIndex:10 }}>
                <button onClick={()=>removePlay(i)} style={{ padding:'3px 7px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:3, color:'#ef4444', fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>REMOVE</button>
              </div>
              <PlayCard play={play} P={play._isDefense?'#6b9fff':P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} />
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ─── SCOUT PAGE ────────────────────────────────────────────────────────────────
function ScoutPage({ P='#C0392B', S='#002868', al, sport, callAI, parseJSON }) {
  const [opponents, setOpponents] = useState([])
  const [activeOpp, setActiveOpp] = useState(null)
  const [newOppName, setNewOppName] = useState('')
  const [showAddOpp, setShowAddOpp] = useState(false)
  const [scoutLoading, setScoutLoading] = useState(false)
  const [scoutResult, setScoutResult] = useState(null)
  const [notes, setNotes] = useState({})
  const [tendencies, setTendencies] = useState({})
  const [newTendency, setNewTendency] = useState('')
  const [gameDate, setGameDate] = useState('')

  function addOpponent() {
    if (!newOppName.trim()) return
    const opp = { id: Date.now(), name: newOppName.trim(), sport, notes: '', tendencies: [] }
    setOpponents(prev => [...prev, opp])
    setActiveOpp(opp.id)
    setNewOppName('')
    setShowAddOpp(false)
  }

  const currentOpp = opponents.find(o=>o.id===activeOpp)

  async function generateScoutReport() {
    if (!currentOpp) return
    setScoutLoading(true); setScoutResult(null)
    const oppTendencies = tendencies[activeOpp] || []
    const oppNotes = notes[activeOpp] || ''
    try {
      const raw = await callAI(`You are an elite youth ${sport.toLowerCase()} scout. Generate a comprehensive opponent scouting report for: "${currentOpp.name}". Known tendencies: ${oppTendencies.join(', ') || 'None recorded yet'}. Coach notes: ${oppNotes || 'None'}. Return ONLY valid JSON: {"overview":"2-3 sentence opponent summary","keyThreats":[{"threat":"threat name","description":"what they do","howToStop":"counter strategy"},{"threat":"threat name","description":"what they do","howToStop":"counter strategy"},{"threat":"threat name","description":"what they do","howToStop":"counter strategy"}],"offensiveTendencies":["tendency 1","tendency 2","tendency 3"],"defensiveTendencies":["tendency 1","tendency 2","tendency 3"],"gameplan":"3-4 sentence overall game plan","keyAdjustment":"most important tactical adjustment","motivationalNote":"one line to tell your team"}`)
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setScoutResult(JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1)))
    } catch(e) { setScoutResult({ error: e.message }) }
    setScoutLoading(false)
  }

  function addTendency() {
    if (!newTendency.trim() || !activeOpp) return
    setTendencies(prev => ({ ...prev, [activeOpp]: [...(prev[activeOpp]||[]), newTendency.trim()] }))
    setNewTendency('')
  }

  function removeTendency(idx) {
    setTendencies(prev => ({ ...prev, [activeOpp]: (prev[activeOpp]||[]).filter((_,i)=>i!==idx) }))
  }

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#5a6480', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Game preparation</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Scout</div>
      </div>

      {/* Opponent selector */}
      <div style={{ overflowX:'auto', display:'flex', gap:6, paddingBottom:4, marginBottom:12 }}>
        {opponents.map(o => (
          <button key={o.id} onClick={()=>{setActiveOpp(o.id);setScoutResult(null)}} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:`1px solid ${activeOpp===o.id?P:'#1e2330'}`, background:activeOpp===o.id?al(P,0.15):'transparent', color:activeOpp===o.id?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>{o.name}</button>
        ))}
        <button onClick={()=>setShowAddOpp(s=>!s)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:'1px dashed #1e2330', background:'#161922', color:'#5a6480', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ Add Opponent</button>
      </div>

      {showAddOpp && (
        <div style={{ display:'flex', gap:7, marginBottom:10 }}>
          <input value={newOppName} onChange={e=>setNewOppName(e.target.value)} placeholder="Opponent team name..." onKeyDown={e=>e.key==='Enter'&&addOpponent()} style={{ flex:1, background:'#161922', border:`1px solid ${P}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
          <input value={gameDate} onChange={e=>setGameDate(e.target.value)} placeholder="Game date" style={{ width:110, background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
          <button onClick={addOpponent} style={{ padding:'0 14px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>ADD</button>
        </div>
      )}

      {!currentOpp ? (
        <Card>
          <div style={{ padding:'40px 20px', textAlign:'center' }}>
            <div style={{ fontSize:36, marginBottom:10 }}>🔍</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#8a94b0', letterSpacing:'1px', marginBottom:8 }}>No Opponents Added Yet</div>
            <div style={{ fontSize:12, color:'#5a6480', lineHeight:1.6, marginBottom:16 }}>Add an upcoming opponent to build a full AI scouting report, track their tendencies, and create a game plan.</div>
            <button onClick={()=>setShowAddOpp(true)} style={{ padding:'10px 20px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'1px', cursor:'pointer' }}>ADD FIRST OPPONENT</button>
          </div>
        </Card>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <Card>
            <CardHead icon="🔍" title={currentOpp.name} tag={sport.toUpperCase()} tagColor={P} accent={P} />
            <div style={{ padding:14 }}>
              {/* Notes */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:6 }}>Coach Notes</div>
                <textarea value={notes[activeOpp]||''} onChange={e=>setNotes(prev=>({...prev,[activeOpp]:e.target.value}))} placeholder="Add what you know about this team — formation tendencies, key players, things you've seen on film..." rows={3} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:6, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', resize:'vertical' }} />
              </div>
              {/* Tendencies */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:6 }}>Observed Tendencies</div>
                {(tendencies[activeOpp]||[]).map((t,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, marginBottom:5 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:P, flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:12, color:'#f2f4f8' }}>{t}</div>
                    <button onClick={()=>removeTendency(i)} style={{ background:'#161922', border:'none', color:'#5a6480', cursor:'pointer', fontSize:14, padding:0 }}>×</button>
                  </div>
                ))}
                <div style={{ display:'flex', gap:7 }}>
                  <input value={newTendency} onChange={e=>setNewTendency(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addTendency()} placeholder="e.g. Always runs on 1st down..." style={{ flex:1, background:'#161922', border:'1px solid #1e2330', borderRadius:5, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
                  <button onClick={addTendency} style={{ padding:'0 12px', background:al(P,0.15), border:`1px solid ${P}`, borderRadius:5, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>ADD</button>
                </div>
              </div>
              <PBtn onClick={generateScoutReport} disabled={scoutLoading} color={P}>{scoutLoading ? 'SCOUTING...' : '🔍 GENERATE SCOUT REPORT'}</PBtn>
            </div>
          </Card>

          {scoutLoading && <div style={{ padding:16, textAlign:'center' }}><div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 8px' }} /><div style={{ fontSize:12, color:'#8a94b0' }}>Building scouting report...</div></div>}

          {scoutResult && !scoutResult.error && (
            <div style={{ display:'flex', flexDirection:'column', gap:10, animation:'fadeIn 0.3s ease' }}>
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
                        <div style={{ fontSize:11, color:'#4ade80', lineHeight:1.4 }}>✓ Counter: {t.howToStop}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:12 }}>
                    <div style={{ background:'#161922', borderRadius:8, padding:10 }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, color:'#f59e0b', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Their Offense</div>
                      {(scoutResult.offensiveTendencies||[]).map((t,i) => <div key={i} style={{ fontSize:11, color:'#f2f4f8', marginBottom:4, lineHeight:1.4 }}>• {t}</div>)}
                    </div>
                    <div style={{ background:'#161922', borderRadius:8, padding:10 }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, color:'#6b9fff', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Their Defense</div>
                      {(scoutResult.defensiveTendencies||[]).map((t,i) => <div key={i} style={{ fontSize:11, color:'#f2f4f8', marginBottom:4, lineHeight:1.4 }}>• {t}</div>)}
                    </div>
                  </div>
                  <div style={{ background:al(P,0.08), border:`1px solid ${al(P,0.25)}`, borderRadius:8, padding:'10px 12px', marginBottom:10 }}>
                    <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:5 }}>Game Plan</div>
                    <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{scoutResult.gameplan}</div>
                  </div>
                  {scoutResult.keyAdjustment && (<div style={{ background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:8, padding:'10px 12px', marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:'#4ade80', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Key Adjustment</div><div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.5 }}>{scoutResult.keyAdjustment}</div></div>)}
                  {scoutResult.motivationalNote && (<div style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:'10px 12px', borderLeft:`3px solid ${P}` }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Tell Your Team</div><div style={{ fontSize:13, color:'#f2f4f8', fontStyle:'italic' }}>"{scoutResult.motivationalNote}"</div></div>)}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  )
}


// ─── MORE PAGE (restructured) ─────────────────────────────────────────────────
// ─── TEAM QUICK SWITCHER (top bar) ────────────────────────────────────────────
function TeamQuickSwitcher({ sport, teams, activeTeam, setActiveTeam, setCfg, setPage, P='#C0392B', al, iq }) {
  const [open, setOpen] = useState(false)
  const sportTeams = teams[sport] || []
  const current = activeTeam[sport]

  function switchTeam(t) {
    setActiveTeam(prev => ({ ...prev, [sport]: t }))
    const SPORT_DEFAULTS = { Football:{primary:'#C0392B',secondary:'#002868'}, Basketball:{primary:'#C0392B',secondary:'#002868'}, Baseball:{primary:'#003087',secondary:'#C0392B'}, Soccer:{primary:'#2d7a2d',secondary:'#f5c518'}, Softball:{primary:'#8B2FC9',secondary:'#FFD700'} }
    const def = SPORT_DEFAULTS[sport] || {primary:'#C0392B',secondary:'#002868'}
    setCfg(prev => ({ ...prev, primary:t.primary||def.primary, secondary:t.secondary||def.secondary, accent1:t.accent1||def.primary, accent2:t.accent2||def.secondary, teamId:t.id, teamName:t.name }))
    setOpen(false)
  }

  function deselect() {
    setActiveTeam(prev => ({ ...prev, [sport]: null }))
    setOpen(false)
  }

  return (
    <div style={{ position:'relative' }}>
      {/* Badge button */}
      <div onClick={()=>{ if(sportTeams.length===0){ setPage('team') } else { setOpen(o=>!o) } }}
        style={{ display:'flex', alignItems:'center', gap:5, background:current?al(P,0.12):'rgba(255,255,255,0.05)', border:`1px solid ${current?al(P,0.4):'rgba(255,255,255,0.12)'}`, borderRadius:3, padding:'4px 8px 4px 6px', cursor:'pointer', userSelect:'none', minWidth:0, maxWidth:130, overflow:'hidden', marginRight:2 }}>
        {current ? (
          <>
            <MascotAvatar mascotId={current.mascot} color={current.primary||P} size={22} />
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:P, fontWeight:700, letterSpacing:'0.5px', maxWidth:80, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, minWidth:0 }}>{current.name}</span>
            <span style={{ fontSize:10, color:'#8a94b0', marginLeft:'auto' }}>▾</span>
          </>
        ) : sportTeams.length === 0 ? (
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:P, fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>
            <span>➕</span> Create Team
          </span>
        ) : (
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:'#8a94b0', fontWeight:700, display:'flex', alignItems:'center', gap:5 }}>
            <span>🏆</span> Select Team <span style={{ fontSize:10 }}>▾</span>
          </span>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div style={{ position:'absolute', top:'calc(100% + 6px)', right:0, background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:6, minWidth:200, zIndex:200, boxShadow:'0 8px 24px rgba(0,0,0,0.6)', overflow:'hidden' }}>
          {/* Team list */}
          {sportTeams.map(t => (
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', borderBottom:'1px solid #1e2330', background:current?.id===t.id?al(P,0.08):'transparent', cursor:'pointer' }}
              onClick={()=>{ switchTeam(t); setPage('team') }}>
              <MascotAvatar mascotId={t.mascot} color={t.primary||P} size={28} />
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:current?.id===t.id?P:'#f2f4f8' }}>{t.name}</div>
                <div style={{ fontSize:9, color:'#8a94b0' }}>{t.season}{t.hometown?' · '+t.hometown:''}</div>
              </div>
              {current?.id===t.id && <span style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>ACTIVE</span>}
            </div>
          ))}
          {/* Actions */}
          <div style={{ padding:'6px 8px', display:'flex', gap:6 }}>
            <button onClick={()=>{ setOpen(false); setPage('team') }} style={{ flex:1, padding:'7px', background:al(P,0.1), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:10, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ New Team</button>
            {current && <button onClick={deselect} style={{ padding:'7px 10px', background:'rgba(255,255,255,0.05)', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontSize:10, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Deselect</button>}
          </div>
        </div>
      )}
      {open && <div style={{ position:'fixed', inset:0, zIndex:199 }} onClick={()=>setOpen(false)}/>}
    </div>
  )
}
function PlayNameBuilder({ P='#C0392B', S='#002868', al, sport }) {
  const [step, setStep] = useState(0)
  const [choices, setChoices] = useState({})
  const [result, setResult] = useState(null)

  const fbSteps = [
    { id:'personnel', label:'Personnel Group', optional:false,
      desc:'Who is on the field? Every defense identifies this first.',
      note:'11=1RB 1TE (most common spread). 12=1RB 2TE (power). 21=2RB 1TE (I-Form base). 22=2RB 2TE (heavy). Empty=no RBs, pure pass.',
      opts:[
        {v:'11',     label:'11 Personnel',   ex:'Most spread offenses'},
        {v:'12',     label:'12 Personnel',   ex:'Power run, misdirection'},
        {v:'21',     label:'21 Personnel',   ex:'I-Formation standard'},
        {v:'22',     label:'22 Personnel',   ex:'Heavy run, goal line'},
        {v:'10',     label:'Trips / 10',     ex:'3 WR spread, no TE'},
        {v:'00',     label:'Empty',          ex:'5 WR, pure pass only'},
        {v:'Heavy',  label:'Heavy / Jumbo',  ex:'Goal line, extra blocker'},
        {v:'Scatter',label:'Scatter',        ex:'No huddle chaos formation'},
      ]
    },
    { id:'formation', label:'Formation + Strength', optional:false,
      desc:'Where does everyone align? Strength tells the OL which side to favor.',
      note:'The tight end always goes to the strong side. "Right" = strong right. A short run call might just be "22 Power Right" — personnel + formation + play. Done.',
      opts:[
        {v:'Ace Right',        label:'Ace Right',         ex:'Single back, TE right'},
        {v:'Ace Left',         label:'Ace Left',          ex:'Single back, TE left'},
        {v:'I-Formation Right',label:'I Right',           ex:'Power run, strong right'},
        {v:'I-Formation Left', label:'I Left',            ex:'Power run, strong left'},
        {v:'Pro Set Right',    label:'Pro Set Right',     ex:'HB offset, FB flanking'},
        {v:'Shotgun Right',    label:'Shotgun Right',     ex:'QB 5 back, spread right'},
        {v:'Pistol Right',     label:'Pistol Right',      ex:'QB 3 back, HB behind'},
        {v:'Trips Right',      label:'Trips Right',       ex:'3 WRs bunched right'},
        {v:'Trips Left',       label:'Trips Left',        ex:'3 WRs bunched left'},
      ]
    },
    { id:'modifier', label:'Line or TE Modifier', optional:true,
      desc:'Adjust the TE or receiver alignment. Many calls skip this — only add it if it changes something.',
      note:'"Tight" = TE attached to OL for blocking. "Wing" = just outside tackle. "Flex" = split wide. Short calls like "22 Power Right" have no modifier.',
      opts:[
        {v:'',      label:'None — skip',    ex:'Base alignment, most calls'},
        {v:'Tight', label:'Tight',          ex:'TE attached to OL — run block'},
        {v:'Wing',  label:'Wing',           ex:'TE outside tackle — seal block'},
        {v:'Flex',  label:'Flex',           ex:'TE split wide as receiver'},
        {v:'Stack', label:'Stack',          ex:'Receivers stacked vertically'},
        {v:'Bunch', label:'Bunch',          ex:'3 receivers within 3 yards'},
        {v:'Nasty', label:'Nasty',          ex:'TE and WR in tight split'},
        {v:'Open',  label:'Open',           ex:'Spread the OL — pass protection'},
      ]
    },
    { id:'motion', label:'Pre-Snap Motion', optional:true,
      desc:'Move a player before the snap to force the defense to react. Not every play has motion.',
      note:'Player is named by letter (Z=slot WR, H=HB/FB, Y=TE, F=FB). Direction is where they go. Jet = full speed across formation, passes outside both tackles. Orbit = loops wide and back. H Motion = HB slides laterally.',
      opts:[
        {v:'',         label:'None — skip',   ex:'Static snap, no motion'},
        {v:'Z Jet',    label:'Z Jet',         ex:'Slot WR full speed across — outside tackles'},
        {v:'H Motion', label:'H Motion',      ex:'HB slides laterally across formation'},
        {v:'Y Shift',  label:'Y Shift',       ex:'TE shifts to opposite side pre-snap'},
        {v:'H Orbit',  label:'H Orbit',       ex:'HB wide arc then back inside'},
        {v:'F Arc',    label:'F Arc',         ex:'FB arcs out to the flat'},
        {v:'Fly',      label:'Fly Motion',    ex:'Any WR full speed across'},
        {v:'Zip',      label:'Zip',           ex:'Quick short shift, not full motion'},
      ]
    },
    { id:'playNum', label:'Play Number', optional:false,
      desc:'The core of the call. 2 or 3 digits: TENS = which gap is attacked, ONES = who carries the ball.',
      note:'Gap scheme (tens digit): 1=A-gap left, 2=A-gap right, 3=B-gap left, 4=B-gap right, 5=C-gap left, 6=C-gap right, 7=strong power, 8=counter/trap. Ball carrier (ones): 1=QB, 2=HB, 3=FB, 4=TE, 6=reverse. So "36" = off tackle left, HB. "47" = strong power, HB. "22" = dive A-gap right, HB.',
      opts:[
        {v:'22',  label:'22 — A-Gap Dive',     ex:'HB dives A-gap right — shortest run'},
        {v:'23',  label:'23 — B-Gap Left',     ex:'HB hits B-gap left side'},
        {v:'24',  label:'24 — B-Gap Right',    ex:'HB hits B-gap right side'},
        {v:'26',  label:'26 — Off Tackle R',   ex:'HB off right tackle — classic'},
        {v:'28',  label:'28 — Counter',        ex:'HB counter trap — misdirection'},
        {v:'32',  label:'32 — QB Sneak',       ex:'QB sneaks A-gap right'},
        {v:'36',  label:'36 — Off Tackle L',   ex:'HB off left tackle'},
        {v:'44',  label:'44 — FB B-Gap',       ex:'FB lead into B-gap — power'},
        {v:'47',  label:'47 — Power Right',    ex:'HB strong power block right'},
        {v:'374', label:'374 — Pro Power',     ex:'Series 3, strong power, HB — NFL standard'},
        {v:'96',  label:'96 — Pass Pattern',   ex:'9=pass series, 6=deep — e.g. six route'},
        {v:'999', label:'999 — Hot Route',     ex:'Full pass, audible at line'},
      ]
    },
    { id:'xRoute', label:'X Receiver Route', optional:true,
      desc:'Name the split end (X) route. Skip this for run plays — the X is blocking.',
      note:'Routes are named from the receiver\'s view. X = outside WR weak side. Call his route only when it matters — run plays skip this entirely.',
      opts:[
        {v:'',         label:'None — run play',  ex:'X is blocking'},
        {v:'X Slant',  label:'X Slant',          ex:'3 steps, 45-degree inside cut'},
        {v:'X Post',   label:'X Post',           ex:'Deep inside angle to goalpost'},
        {v:'X Curl',   label:'X Curl',           ex:'8 yards, curl back to QB'},
        {v:'X Hitch',  label:'X Hitch',          ex:'5 yards, stop and face'},
        {v:'X Go',     label:'X Go / Fly',       ex:'Vertical beat the CB deep'},
        {v:'X Cross',  label:'X Cross',          ex:'Deep cross over middle'},
        {v:'X Fade',   label:'X Fade',           ex:'Fade to back corner end zone'},
        {v:'X Whip',   label:'X Whip',           ex:'Double cut — elite separation'},
      ]
    },
    { id:'yzRoute', label:'Y or Z Route Tag', optional:true,
      desc:'Name the TE (Y) or slot/flanker (Z) route. This completes the route tree. Skip for runs.',
      note:'This is the most important part of a passing play name — it tells your QB his reads in order. "Y Stick Z Spot" is two reads: TE stick first, Z flat second. Jon Gruden\'s famous call ends with exactly this.',
      opts:[
        {v:'',          label:'None — skip',    ex:'Run play or base routes'},
        {v:'Y Stick',   label:'Y Stick',        ex:'TE: 6-yd hitch vs zone — QB read 1'},
        {v:'Y Seam',    label:'Y Seam',         ex:'TE: vertical up the seam'},
        {v:'Y Cross',   label:'Y Cross',        ex:'TE: crossing at 12 yards'},
        {v:'Y Corner',  label:'Y Corner',       ex:'TE: corner to end zone'},
        {v:'Z Spot',    label:'Z Spot',         ex:'Slot: spot route to flat — Gruden special'},
        {v:'Z Out',     label:'Z Out',          ex:'Slot: out route 8-12 yards'},
        {v:'Z In',      label:'Z In',           ex:'Slot: in cut over middle'},
        {v:'H Flat',    label:'H Flat',         ex:'HB/FB: flat — safety valve'},
        {v:'H Wheel',   label:'H Wheel',        ex:'HB: flat then vertical wheel'},
      ]
    },
    { id:'tag', label:'Call Tag or Alert', optional:true,
      desc:'One final word that modifies how the play is executed. Skip if the call is clean as-is.',
      note:'"Naked" = QB bootleg with no lead blockers — he\'s on his own. "Pass" = play action, fake run then throw. "Keep" = QB reads at mesh point and decides. "Check With Me" = QB calls the actual play at the line. Not every call needs a tag — "22 Power Right" is complete without one.',
      opts:[
        {v:'',              label:'None — clean call',   ex:'Play exactly as called'},
        {v:'Naked',         label:'Naked',               ex:'QB bootleg, no blockers — risky'},
        {v:'Pass',          label:'Pass / Play Action',  ex:'Fake run, throw — action pass'},
        {v:'Keep',          label:'Keep',                ex:'QB reads mesh — keep or hand off'},
        {v:'Counter',       label:'Counter',             ex:'Fake one direction, attack other'},
        {v:'Boot',          label:'Boot',                ex:'QB rolls out with lead blockers'},
        {v:'Check With Me', label:'Check With Me',       ex:'QB audibles at line of scrimmage'},
        {v:'Alert',         label:'Alert',               ex:'If defense shows X, switch to this route'},
      ]
    },
  ]

  const bbSteps = [
    { id:'setName', label:'Set or Play Name', optional:false,
      desc:'Real NBA play calls are named, not numbered. The name tells everyone which set to run.',
      note:'Sets like "Horns" mean two bigs at the elbows. "Floppy" means baseline pin-downs for a shooter. "Chicago" is a specific Bulls action. Coaches adapt these and name their own versions.',
      opts:[
        {v:'Horns',    label:'Horns',      ex:'Two bigs at elbows — attacks 2-3 zone'},
        {v:'Floppy',   label:'Floppy',     ex:'Baseline pin-downs — great for shooters'},
        {v:'Chicago',  label:'Chicago',    ex:'DHO into pick-and-roll — NBA classic'},
        {v:'Chin',     label:'Chin',       ex:'High ball screen into spread actions'},
        {v:'Hammer',   label:'Hammer',     ex:'Back screen to corner 3 — Spurs action'},
        {v:'Zipper',   label:'Zipper',     ex:'Wing cut to receive at top'},
        {v:'BLOB',     label:'BLOB',       ex:'Baseline out-of-bounds set play'},
        {v:'Transition',label:'Transition',ex:'Early offense — push pace'},
        {v:'Early',    label:'Early Offense',ex:'Attack before defense sets'},
        {v:'Box',      label:'Box',        ex:'4-corner box — inbound or half court'},
      ]
    },
    { id:'action', label:'Primary Action', optional:false,
      desc:'What is the first movement that triggers the play?',
      note:'The action determines what the defense must guard. A pick-and-roll forces a switch or hedge. A back screen forces a switch or chase. Knowing the action tells every player their job.',
      opts:[
        {v:'Pick and Roll',   label:'Pick and Roll',    ex:'Ball screen, roll to basket'},
        {v:'Pick and Pop',    label:'Pick and Pop',     ex:'Ball screen, pop to 3'},
        {v:'Back Screen',     label:'Back Screen',      ex:'Screen away from ball — lob or drive'},
        {v:'Pin Down',        label:'Pin Down',         ex:'Downscreen for shooter cutting up'},
        {v:'Cross Screen',    label:'Cross Screen',     ex:'Screen across the lane — post entry'},
        {v:'DHO',             label:'DHO',              ex:'Dribble hand-off — momentum play'},
        {v:'Elevator',        label:'Elevator',         ex:'Two screeners let shooter through'},
        {v:'Spain',           label:'Spain Pick and Roll',ex:'Back screen on the screener — NBA trending'},
      ]
    },
    { id:'read', label:'Ball Handler Read', optional:false,
      desc:'What does the ball handler do with the action?',
      note:'"Attack middle" means go downhill. "Reject" means go opposite the screen. "Pop" feeds the screener popping out. The ball handler read is the decision that makes the play work.',
      opts:[
        {v:'Attack',   label:'Attack Middle',  ex:'Drive downhill off screen'},
        {v:'Reject',   label:'Reject Screen',  ex:'Go opposite — catch defense cheating'},
        {v:'Pop',      label:'Feed the Pop',   ex:'Pass to screener popping out for 3'},
        {v:'Roll',     label:'Feed the Roll',  ex:'Pass to screener rolling to basket'},
        {v:'Slip',     label:'Slip — early',   ex:'Screener slips before contact'},
        {v:'Kick Out', label:'Kick Out',       ex:'Drive, kick to open corner'},
      ]
    },
    { id:'finish', label:'Finish', optional:false,
      desc:'How does the play end?',
      opts:[
        {v:'Lay-Up',         label:'Lay-Up Finish',      ex:'Get to the rim'},
        {v:'Mid Pull-Up',    label:'Mid-Range Pull-Up',  ex:'Pull up off the dribble'},
        {v:'Corner 3',       label:'Corner Three',       ex:'Kick to corner — highest % 3'},
        {v:'Lob',            label:'Lob Pass',           ex:'Alley-oop over help'},
        {v:'Dump Low',       label:'Dump to Post',       ex:'Feed the low post'},
        {v:'Curl',           label:'Curl and Shoot',     ex:'Curl off screen for mid-range'},
        {v:'Weak Side',      label:'Kick Weak Side',     ex:'Reverse to open wing'},
      ]
    },
    { id:'tag', label:'Adjustment Tag', optional:true,
      desc:'A word that flips or adjusts the play. Skip if the play is clean.',
      opts:[
        {v:'',        label:'None',    ex:'Play as called'},
        {v:'Strong',  label:'Strong',  ex:'Run to the strong side'},
        {v:'Weak',    label:'Weak',    ex:'Flip to weak side'},
        {v:'High',    label:'High',    ex:'Ball screen high'},
        {v:'Low',     label:'Low',     ex:'Ball screen low'},
        {v:'Reverse', label:'Reverse', ex:'Run action in reverse order'},
        {v:'Double',  label:'Double',  ex:'Double screen variation'},
      ]
    },
  ]

  const bsbSteps = [
    { id:'situation', label:'Game Situation', optional:false,
      desc:'Define the moment. In baseball the situation is everything — the sign you give depends entirely on this.',
      opts:[
        {v:'Lead-off 0 outs',   label:'Lead-off, 0 outs',   ex:'First batter of inning'},
        {v:'Runner 1st 0 outs', label:'Runner 1st, 0 outs',  ex:'Classic steal / H&R situation'},
        {v:'Runner 2nd 0 outs', label:'Runner 2nd, 0 outs',  ex:'Scoring position — contact first'},
        {v:'1st and 3rd',       label:'1st and 3rd',         ex:'Double steal or safety squeeze'},
        {v:'Bases loaded',      label:'Bases loaded',        ex:'Squeeze, sac fly, force situation'},
        {v:'2 outs any base',   label:'2 outs, runners on',  ex:'Run on contact — full go'},
        {v:'Must score now',    label:'Must score now',      ex:'Late innings, tie or down 1'},
        {v:'Big lead protect',  label:'Big lead, protect',   ex:'No mistakes mode'},
      ]
    },
    { id:'call', label:'The Offensive Call', optional:false,
      desc:'What play are you calling? This is what the signal will communicate.',
      opts:[
        {v:'Steal',          label:'Straight Steal',     ex:'Runner goes on first move of pitcher'},
        {v:'Delayed Steal',  label:'Delayed Steal',      ex:'Runner goes on catcher throw-back'},
        {v:'Hit and Run',    label:'Hit and Run',        ex:'Runner goes, batter swings through'},
        {v:'Run and Hit',    label:'Run and Hit',        ex:'Runner goes, batter swings if pitch good'},
        {v:'Safety Squeeze', label:'Safety Squeeze',     ex:'Bunt only if pitch is buntable, runner reads'},
        {v:'Suicide Squeeze',label:'Suicide Squeeze',    ex:'Runner goes on pitch, batter must bunt'},
        {v:'Take',           label:'Take a Strike',      ex:'Do not swing — work the count'},
        {v:'Swing Away',     label:'Swing Away — Green Light',ex:'Batter free to swing at anything'},
        {v:'Double Steal',   label:'Double Steal 1st+3rd',ex:'Both runners go simultaneously'},
      ]
    },
    { id:'indicator', label:'Signal Indicator (Key)', optional:false,
      desc:'The indicator is the touch that ACTIVATES the real sign. Everything before it is fake. This is the most important part of the signal system.',
      note:'The sequence works like this: coach gives several touches. Only the touch AFTER the indicator counts. Example: if indicator is belt, coach touches cap → ear → BELT (activates) → arm (this is the real sign) → wipe off.',
      opts:[
        {v:'belt',   label:'Belt',    ex:'Touch belt = indicator is live'},
        {v:'cap',    label:'Cap',     ex:'Touch cap = indicator is live'},
        {v:'chin',   label:'Chin',    ex:'Touch chin = indicator is live'},
        {v:'chest',  label:'Chest',   ex:'Touch chest = indicator is live'},
        {v:'ear',    label:'Ear',     ex:'Touch ear = indicator is live'},
        {v:'wrist',  label:'Wrist',   ex:'Touch wrist = indicator is live'},
      ]
    },
    { id:'wipeoff', label:'Wipe-Off Signal', optional:false,
      desc:'The wipe-off cancels ALL previous signs. If the coach gives the wipe-off, the play is OFF — go back to default.',
      note:'The wipe-off must be easy to remember and distinct from everything else. Common wipe-offs: wiping both hands together, touching both hands to thighs simultaneously, swiping across the letters on the jersey.',
      opts:[
        {v:'swipe jersey',  label:'Swipe Across Jersey',   ex:'Both hands swipe across chest — classic'},
        {v:'hands thighs',  label:'Both Hands to Thighs',  ex:'Simultaneous two-hand touch'},
        {v:'clap',          label:'Clap Hands',            ex:'One clap cancels all'},
        {v:'nose wipe',     label:'Wipe Nose',             ex:'Index finger across nose'},
        {v:'arm swipe',     label:'Swipe Arm',             ex:'Opposite hand swipes forearm'},
      ]
    },
  ]

  const soccerSteps = [
    { id:'phase', label:'Phase of Play', optional:false,
      desc:'Where on the field and what moment? Tactical calls are phase-specific.',
      opts:[
        {v:'Build-Up',      label:'Build-Up from Back',    ex:'GK or CBs starting the attack'},
        {v:'Combination',   label:'Midfield Combination',  ex:'Third-man runs, one-twos'},
        {v:'Final Third',   label:'Final Third Attack',    ex:'In or around the 18-yard box'},
        {v:'Corner',        label:'Corner Kick',           ex:'In-swinger, out-swinger, short'},
        {v:'Free Kick',     label:'Free Kick',             ex:'Direct, indirect, wall run'},
        {v:'Counter',       label:'Counter Attack',        ex:'Win ball, attack immediately'},
        {v:'Pressing',      label:'Pressing Trigger',      ex:'When to press as a unit'},
      ]
    },
    { id:'pattern', label:'Attacking Pattern', optional:false,
      desc:'The movement concept your team executes.',
      note:'Pep Guardiola names patterns like "Inside Channel" or "Half Space Overload." Klopp uses "Gegenpressing" as a trigger word. Real tactical names communicate the principle, not just the action.',
      opts:[
        {v:'Overlap',         label:'Overlap Wide',          ex:'FB overlaps winger — 2v1 wide'},
        {v:'Underlap',        label:'Underlap Inside',       ex:'FB cuts inside the winger'},
        {v:'Third Man',       label:'Third Man Run',         ex:'Pass, pass, run — third player arrives late'},
        {v:'Half Space',      label:'Half Space Overload',   ex:'Attack the channel between CB and FB'},
        {v:'Switch',          label:'Switch of Play',        ex:'Ball across to opposite side quickly'},
        {v:'False 9',         label:'False 9 Drop',          ex:'CF drops deep, creates space'},
        {v:'Wall Pass',       label:'Wall Pass 1-2',         ex:'Give-and-go into space'},
        {v:'Rotation',        label:'Positional Rotation',   ex:'Players swap positions to confuse defense'},
      ]
    },
    { id:'trigger', label:'Trigger / Entry Pass', optional:false,
      desc:'What action starts the pattern?',
      opts:[
        {v:'GK Long',     label:'GK Distribution',    ex:'Goalkeeper starts it'},
        {v:'Pivot Pass',  label:'Pivot Pass',          ex:'Ball to pivot player facing away'},
        {v:'Switch Ball', label:'Switch Ball',         ex:'Quick reversal triggers runs'},
        {v:'Through Ball',label:'Through Ball',        ex:'Ball played in behind defense'},
        {v:'Dummy Run',   label:'Dummy / Decoy Run',   ex:'Player runs to create space for others'},
        {v:'Set Piece',   label:'Set Piece Routine',   ex:'Pre-designed movement from dead ball'},
      ]
    },
    { id:'finish', label:'Final Action', optional:false,
      desc:'How does the pattern end?',
      opts:[
        {v:'Low Cross',   label:'Low Cross',          ex:'Ground ball across goal — hardest to defend'},
        {v:'High Cross',  label:'High Cross',         ex:'Aerial delivery for header'},
        {v:'Cut Inside',  label:'Cut Inside Shoot',   ex:'Winger cuts in on strong foot'},
        {v:'Recycle',     label:'Recycle and Reset',  ex:'Keep possession, find another angle'},
        {v:'Through',     label:'Through Ball Final', ex:'Final pass in behind for one-on-one'},
        {v:'Press',       label:'High Press Trigger', ex:'Immediately press after set trigger'},
      ]
    },
  ]

  const sbSteps = [
    { id:'situation', label:'Game Situation', optional:false,
      desc:'The situation drives everything in softball — what count, what base, what score.',
      opts:[
        {v:'Lead-off 0 outs',    label:'Lead-off, 0 outs',   ex:'Set the tone at top of inning'},
        {v:'Runner 1st 0 outs',  label:'Runner 1st, 0 outs', ex:'Steal or slap situation'},
        {v:'Runner 2nd 0 outs',  label:'Runner 2nd, 0 outs', ex:'Scoring position — make contact'},
        {v:'1st and 3rd',        label:'1st and 3rd',        ex:'Double steal or squeeze'},
        {v:'Bases loaded',       label:'Bases loaded',       ex:'Squeeze or gap shot'},
        {v:'2 outs runners on',  label:'2 outs, runners on', ex:'Run on contact'},
        {v:'Must score now',     label:'Must score now',     ex:'Late, close game — take chances'},
      ]
    },
    { id:'call', label:'Offensive Call', optional:false,
      desc:'What are you calling? Softball has unique options — especially the slap game.',
      opts:[
        {v:'Steal',          label:'Straight Steal',       ex:'Go on pitcher first move'},
        {v:'Slap Hit',       label:'Slap Hit (Left)',       ex:'Left-handed slapper, run-slap'},
        {v:'Drag Bunt',      label:'Drag Bunt Left',       ex:'Surprise bunt toward 1B — speed play'},
        {v:'Safety Squeeze', label:'Safety Squeeze',       ex:'Bunt only if buntable, runner reads'},
        {v:'Suicide Squeeze',label:'Suicide Squeeze',      ex:'Runner goes, batter must bunt'},
        {v:'Hit and Run',    label:'Hit and Run',          ex:'Runner goes, batter swings'},
        {v:'Take',           label:'Take — Work Count',    ex:'Do not swing — get a pitch'},
        {v:'Swing Away',     label:'Swing Away',           ex:'Green light — trust the hitter'},
        {v:'Double Steal',   label:'Double Steal 1st+3rd', ex:'Both runners move on pitch'},
      ]
    },
    { id:'indicator', label:'Signal Indicator (Key)', optional:false,
      desc:'The touch after the indicator is the real sign. Everything before it is decoy.',
      note:'This is how third base coaches communicate silently in real time. The indicator must be consistent and hidden in the sequence — same system as baseball.',
      opts:[
        {v:'belt',  label:'Belt',   ex:'Belt touch activates'},
        {v:'cap',   label:'Cap',    ex:'Cap touch activates'},
        {v:'chin',  label:'Chin',   ex:'Chin touch activates'},
        {v:'chest', label:'Chest',  ex:'Chest touch activates'},
        {v:'ear',   label:'Ear',    ex:'Ear touch activates'},
        {v:'wrist', label:'Wrist',  ex:'Wrist touch activates'},
      ]
    },
    { id:'wipeoff', label:'Wipe-Off Signal', optional:false,
      desc:'Cancel the sign. If wipe-off is given, the play is dead — do nothing.',
      opts:[
        {v:'swipe jersey', label:'Swipe Jersey',        ex:'Classic — hands across chest'},
        {v:'both thighs',  label:'Both Hands Thighs',   ex:'Two-hand simultaneous touch'},
        {v:'clap',         label:'Clap',                ex:'One clap cancels all'},
        {v:'nose',         label:'Wipe Nose',           ex:'Subtle, easy to hide'},
        {v:'arm swipe',    label:'Swipe Arm',           ex:'Opposite hand on forearm'},
      ]
    },
  ]

  const steps = sport==='Basketball' ? bbSteps
              : sport==='Baseball'   ? bsbSteps
              : sport==='Soccer'     ? soccerSteps
              : sport==='Softball'   ? sbSteps
              : fbSteps

  // ── SIGNAL CREATOR VISUAL (Baseball / Softball) ────────────────────────────
  function buildSignalSequence(indicator, call, wipeoff) {
    const bodyParts = ['cap','chin','ear','belt','chest','arm','wrist','letters','sleeve']
    const callToSign = {
      'Steal':           'ear',
      'Delayed Steal':   'wrist',
      'Hit and Run':     'chest',
      'Run and Hit':     'arm',
      'Safety Squeeze':  'chin',
      'Suicide Squeeze': 'cap',
      'Take':            'sleeve',
      'Swing Away':      'letters',
      'Double Steal':    'shoulder',
      'Slap Hit':        'ear',
      'Drag Bunt':       'wrist',
      'Double Steal 1st+3rd': 'shoulder',
    }
    const realSign = callToSign[call] || 'chest'
    // Build sequence: 2-3 decoys, indicator, real sign, 1-2 more decoys
    const decoys = bodyParts.filter(p => p !== realSign && p !== indicator && p !== wipeoff.split(' ')[0])
    const seq = [
      { touch: decoys[0], type: 'decoy', label: decoys[0] },
      { touch: decoys[1], type: 'decoy', label: decoys[1] },
      { touch: indicator, type: 'indicator', label: indicator + ' ← KEY' },
      { touch: realSign,  type: 'live',      label: realSign + ' ← LIVE SIGN' },
      { touch: decoys[2], type: 'decoy',     label: decoys[2] },
    ]
    return { sequence: seq, realSign, indicator, wipeoff, call }
  }

  // ── INCREMENTAL DIAGRAM ────────────────────────────────────────────────────
  function LiveDiagram() {
    // Ensure player color is visible on dark field background
    const diagColor = P === '#ffffff' || P === '#fff' || P === 'white' ? '#c0c0c0' : P
    if (sport === 'Baseball' || sport === 'Softball') {
      // Signal visual instead of field diagram
      if (!choices.indicator || !choices.call) {
        return (
          <svg viewBox="0 0 240 80" style={{ width:'100%', height:80 }}>
            <rect x="0" y="0" width="240" height="80" fill="#0a1a0a" rx="3"/>
            <text x="120" y="30" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="10">Signal sequence will appear here</text>
            <text x="120" y="50" textAnchor="middle" fill="rgba(255,255,255,0.12)" fontSize="8">Complete steps to generate your signal</text>
          </svg>
        )
      }
      const sig = buildSignalSequence(choices.indicator, choices.call, choices.wipeoff || 'swipe jersey')
      return (
        <div style={{ padding:'8px 4px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:4, flexWrap:'wrap' }}>
            {sig.sequence.map((s,i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                <div style={{ width:44, height:44, borderRadius:'50%', background: s.type==='indicator'?'rgba(245,158,11,0.2)':s.type==='live'?al(P,0.2):'rgba(255,255,255,0.06)', border: s.type==='indicator'?'2px solid #f59e0b':s.type==='live'?`2px solid ${P}`:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                  <span style={{ fontSize:9, color: s.type==='indicator'?'#f59e0b':s.type==='live'?P:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, textAlign:'center', lineHeight:1.2 }}>{s.touch.toUpperCase()}</span>
                </div>
                <span style={{ fontSize:9, color: s.type==='indicator'?'#f59e0b':s.type==='live'?P:'#3d4559', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, textAlign:'center', maxWidth:44 }}>{s.type==='indicator'?'KEY':s.type==='live'?'SIGN':'FAKE'}</span>
                {i < sig.sequence.length-1 && <div style={{ position:'absolute', right:-8, top:14, color:'#5a6480', fontSize:10 }}>→</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:6, fontSize:9, color:'#8a94b0' }}>
            After <span style={{ color:'#f59e0b', fontWeight:700 }}>{choices.indicator?.toUpperCase()}</span> → next touch is live → wipe-off: <span style={{ color:'#ef4444', fontWeight:700 }}>{choices.wipeoff}</span>
          </div>
        </div>
      )
    }

    if (sport === 'Basketball') {
      const hasAction = choices.action
      const hasRead = choices.read
      return (
        <svg viewBox="0 0 200 110" style={{ width:'100%', height:110 }}>
          <rect x="0" y="0" width="200" height="110" fill="#0a0a1f" rx="3"/>
          <path d="M12 105 Q100 8 188 105" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
          <line x1="12" y1="105" x2="188" y2="105" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
          <rect x="62" y="72" width="76" height="33" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
          <circle cx="100" cy="72" r="15" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
          <circle cx="104" cy="100" r="2.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
          {/* 5 players */}
          {[[100,90],[60,60],[140,60],[72,30],[128,30]].map(([cx,cy],i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={6} fill={P} opacity={i===0?0.95:0.8}/>
              <text x={cx} y={cy+2} textAnchor="middle" fill="white" fontSize="5" fontWeight="700">{['PG','SG','SF','PF','C'][i]}</text>
            </g>
          ))}
          {hasAction && (choices.action==='Pick and Roll'||choices.action==='Pick and Pop') && (
            <>
              <line x1="72" y1="30" x2="94" y2="84" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
              <path d="M96 84 L72 55" stroke={P} strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.7"/>
            </>
          )}
          {hasAction && choices.action==='Back Screen' && (
            <line x1="72" y1="30" x2="135" y2="58" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
          )}
          {hasRead && choices.read==='Kick Out' && (
            <path d="M100 84 L155 55" stroke={P} strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.7"/>
          )}
          {choices.setName && <text x="100" y="10" textAnchor="middle" fill={P} fontSize="6" fontWeight="700" fontFamily="monospace">{choices.setName.toUpperCase()}</text>}
        </svg>
      )
    }

    if (sport === 'Soccer') {
      return (
        <svg viewBox="0 0 120 160" style={{ width:'60%', height:140, display:'block', margin:'0 auto' }}>
          <rect x="0" y="0" width="120" height="160" fill="#0d1a0d" rx="3"/>
          <rect x="4" y="4" width="112" height="152" rx="2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
          <line x1="4" y1="80" x2="116" y2="80" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
          <circle cx="60" cy="80" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
          <rect x="32" y="4" width="56" height="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
          <rect x="32" y="134" width="56" height="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
          {/* 4-3-3 */}
          <circle cx={60} cy={150} r={5} fill={P} opacity={0.5}/>
          {[18,40,80,102].map((x,i)=><circle key={i} cx={x} cy={128} r={5} fill={P} opacity={0.8}/>)}
          {[30,60,90].map((x,i)=><circle key={i} cx={x} cy={104} r={5} fill={P} opacity={0.85}/>)}
          {[18,60,102].map((x,i)=><circle key={i} cx={x} cy={78} r={5} fill={P} opacity={0.9}/>)}
          {choices.pattern==='Overlap' && <path d="M18 128 L18 95 L30 78" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeDasharray="3,2"/>}
          {choices.pattern==='Switch' && <path d="M18 78 L102 78" stroke="#4ade80" strokeWidth="1.5" fill="none" strokeDasharray="3,2"/>}
          {choices.pattern==='Third Man' && <path d="M30 104 L60 104 M60 104 L90 78" stroke={P} strokeWidth="1.2" fill="none" strokeDasharray="3,2"/>}
          {choices.finish==='Through' && <path d="M60 72 L60 30" stroke={P} strokeWidth="1.5" fill="none" strokeDasharray="3,2"/>}
          {choices.phase && <text x="60" y="17" textAnchor="middle" fill={P} fontSize="5" fontWeight="700">{choices.phase.split('-')[0].toUpperCase()}</text>}
        </svg>
      )
    }

    // ── FOOTBALL DIAGRAM ─────────────────────────────────────────────────────
    const fmtPositions = {
      'Ace Right':          { wr:[[14,50],[148,50]], qb:[84,60], rb:[[84,72]], fb:[] },
      'Ace Left':           { wr:[[14,50],[148,50]], qb:[84,60], rb:[[84,72]], fb:[] },
      'I-Formation Right':  { wr:[[14,50],[148,50]], qb:[84,60], rb:[[84,76]], fb:[[84,67]] },
      'I-Formation Left':   { wr:[[14,50],[148,50]], qb:[84,58], rb:[[84,74]], fb:[[84,66]] },
      'Shotgun Right':      { wr:[[12,50],[148,50],[132,50],[36,50]], qb:[84,64], rb:[[110,64]], fb:[] },
      'Pistol Right':       { wr:[[12,50],[148,50]], qb:[84,60], rb:[[84,72]], fb:[] },
      'Trips Right':        { wr:[[12,50],[130,50],[146,50],[160,50]], qb:[84,58], rb:[[84,70]], fb:[] },
      'Trips Left':         { wr:[[10,50],[24,50],[38,50],[148,50]], qb:[84,60], rb:[[84,72]], fb:[] },
      'Pro Set Right':      { wr:[[12,50],[148,50]], qb:[84,58], rb:[[100,68]], fb:[[68,64]] },
    }
    const personnelDefaultFmt = {
      '11':'Ace Right', '12':'I-Formation Right', '21':'I-Formation Right',
      '22':'I-Formation Right', '10':'Trips Right', '00':'Shotgun Right',
      'Heavy':'I-Formation Right', 'Scatter':'Shotgun Right'
    }
    const defaultFmt = personnelDefaultFmt[choices.personnel] || 'Ace Right'
    const fmt = fmtPositions[choices.formation] || fmtPositions[defaultFmt] || fmtPositions['Ace Right']
    const gapMap = {
      '22':  {x:82,  side:'R', label:'A-Gap R'},
      '23':  {x:68,  side:'L', label:'B-Gap L'},
      '24':  {x:96,  side:'R', label:'B-Gap R'},
      '26':  {x:106, side:'R', label:'C-Gap R'},
      '28':  {x:96,  side:'R', label:'Counter R'},
      '32':  {x:84,  side:'C', label:'Sneak'},
      '36':  {x:62,  side:'L', label:'C-Gap L'},
      '44':  {x:75,  side:'L', label:'B-Gap L'},
      '47':  {x:100, side:'R', label:'Power R'},
      '374': {x:100, side:'R', label:'Pro Power R'},
      '96':  {x:148, side:'R', label:'Deep R'},
      '999': {x:84,  side:'C', label:'Audible'},
    }
    const gap = gapMap[choices.playNum]
    const motionMap = {
      'Z Jet':    {from:[148,48], to:[36,48], through:false},
      'H Motion': {from:[84,72],  to:[130,66], through:false},
      'Y Shift':  {from:[148,48], to:[18,48], through:false},
      'H Orbit':  {from:[84,72],  to:[14,56], through:false},
      'F Arc':    {from:[84,66],  to:[14,58], through:false},
      'Fly':      {from:[148,48], to:[36,48], through:false},
    }
    const motionPath = motionMap[choices.motion]
    const isPassPlay = choices.playNum && (choices.playNum.startsWith('9') || choices.playNum==='999')

    return (
      <svg viewBox="0 0 200 100" style={{ width:'100%', height:120 }}>
        <rect x="0" y="0" width="200" height="100" fill="#0a1a0a" rx="3"/>
        {[50,100,150].map((x,i)=><line key={i} x1={x} y1="4" x2={x} y2="96" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" strokeDasharray="3,3"/>)}
        {/* LOS */}
        <line x1="4" y1="50" x2="196" y2="50" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
        <text x="7" y="48" fill="rgba(255,255,255,0.35)" fontSize="5" fontFamily="monospace">LOS</text>
        {/* Strength indicator */}
        {choices.formation && (
          <text x={choices.formation.includes('Left')?20:176} y="15" textAnchor="middle" fill={P} fontSize="5" fontWeight="700" fontFamily="monospace">STR{choices.formation.includes('Left')?'◄':'►'}</text>
        )}
        {/* OL — 5 linemen always on LOS */}
        {[60,72,84,96,108].map((x,i)=>(
          <g key={i}>
            <rect x={x-6} y={50} width={12} height={9} rx="1.5" fill={diagColor} opacity={gap&&!isPassPlay&&Math.abs(x-gap.x)<15?1:0.85}
              stroke={gap&&!isPassPlay&&Math.abs(x-gap.x)<15?'#f59e0b':'rgba(255,255,255,0.4)'}
              strokeWidth={gap&&!isPassPlay&&Math.abs(x-gap.x)<15?1.5:0}/>
            <text x={x} y={56} textAnchor="middle" fill="white" fontSize="3.5" fontFamily="monospace">{['LT','LG','C','RG','RT'][i]}</text>
          </g>
        ))}
        {/* TE if tight modifier */}
        {choices.modifier==='Tight'&&<rect x={112} y={50} width={12} height={9} rx="1.5" fill={P} opacity={0.8}/>}
        {/* WRs */}
        {fmt.wr.map(([cx,cy],i)=>{
          const labels = ['X','Z','H','Y','W']
          const isHighlighted = (choices.xRoute && i===0) || (choices.yzRoute && i===1)
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={5.5} fill={isHighlighted?'#f59e0b':diagColor} opacity={0.9} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
              <text x={cx} y={cy+2} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="700">{labels[i]||'WR'}</text>
            </g>
          )
        })}
        {/* QB — BEHIND the LOS */}
        <circle cx={fmt.qb[0]} cy={fmt.qb[1]} r={5.5} fill={diagColor} opacity={0.95} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"/>
        <text x={fmt.qb[0]} y={fmt.qb[1]+2} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="700">QB</text>
        {/* Personnel label */}
        {choices.personnel && <text x="8" y="95" fill={P} fontSize="5" fontWeight="700" fontFamily="monospace" opacity="0.7">{choices.personnel}</text>}
        {/* FB */}
        {fmt.fb.map(([cx,cy],i)=>(
          <g key={i}><circle cx={cx} cy={cy} r={4} fill={P} opacity={0.8}/><text x={cx} y={cy+1.5} textAnchor="middle" fill="white" fontSize="3.5">FB</text></g>
        ))}
        {/* RBs */}
        {fmt.rb.map(([cx,cy],i)=>(
          <g key={i}>
            <circle cx={cx} cy={cy} r={5} fill={gap?'#f59e0b':P} opacity={0.9}/>
            <text x={cx} y={cy+2} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="700">HB</text>
          </g>
        ))}
        {/* Gap arrow */}
        {gap && !isPassPlay && (
          <g>
            <rect x={gap.x-5} y={47} width={10} height={12} rx="1" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1"/>
            <path d={`M${gap.x} 50 L${gap.x} 34`} stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#arr)"/>
            <text x={gap.x} y={35} textAnchor="middle" fill="#f59e0b" fontSize="5" fontWeight="700" fontFamily="monospace">{gap.label}</text>
          </g>
        )}
        {/* Motion arc */}
        {motionPath && choices.motion && choices.motion!=='' && (
          <path d={`M${motionPath.from[0]} ${motionPath.from[1]} Q${(motionPath.from[0]+motionPath.to[0])/2} ${motionPath.through?motionPath.from[1]-12:motionPath.from[1]-8} ${motionPath.to[0]} ${motionPath.to[1]}`}
            stroke="#c084fc" strokeWidth="1.2" fill="none" strokeDasharray="4,2" opacity="0.85"/>
        )}
        {/* Route arrows for pass plays */}
        {isPassPlay && choices.xRoute && choices.xRoute!=='' && (
          <path d={`M${fmt.wr[0][0]} ${fmt.wr[0][1]} L${fmt.wr[0][0]+30} ${fmt.wr[0][1]-18}`} stroke="#6b9fff" strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.8"/>
        )}
        {isPassPlay && choices.yzRoute && choices.yzRoute!=='' && (
          <path d={`M${fmt.wr[fmt.wr.length-1][0]} ${fmt.wr[fmt.wr.length-1][1]} L${fmt.wr[fmt.wr.length-1][0]-20} ${fmt.wr[fmt.wr.length-1][1]-15}`} stroke="#4ade80" strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.8"/>
        )}
        {/* Modifier label */}
        {choices.tag && choices.tag!=='' && (
          <text x="100" y="95" textAnchor="middle" fill="#c084fc" fontSize="5.5" fontWeight="700" fontFamily="monospace">{choices.tag.toUpperCase()}</text>
        )}
        <defs>
          <marker id="arr" markerWidth="5" markerHeight="5" refX="2.5" refY="2.5" orient="auto">
            <path d="M0,0 L5,2.5 L0,5 Z" fill="#f59e0b"/>
          </marker>
        </defs>
      </svg>
    )
  }

  function buildResult() {
    if (sport === 'Football') {
      const parts = []
      if (choices.personnel) parts.push(choices.personnel)
      if (choices.formation) parts.push(choices.formation)
      if (choices.modifier && choices.modifier!=='') parts.push(choices.modifier)
      if (choices.motion && choices.motion!=='') parts.push(choices.motion)
      if (choices.playNum) parts.push(choices.playNum)
      if (choices.xRoute && choices.xRoute!=='') parts.push(choices.xRoute)
      if (choices.yzRoute && choices.yzRoute!=='') parts.push(choices.yzRoute)
      if (choices.tag && choices.tag!=='') parts.push(choices.tag)
      const name = parts.join(' ')
      const isShort = parts.length <= 3
      const explanation = `"${choices.personnel}" = personnel group (${choices.personnel==='11'?'1 RB 1 TE':choices.personnel==='22'?'2 RBs 2 TEs':choices.personnel}). "${choices.formation}" = formation and strength. ${choices.modifier&&choices.modifier!==''?'"'+choices.modifier+'" = TE/line alignment. ':''}${choices.motion&&choices.motion!==''?'"'+choices.motion+'" = pre-snap motion. ':''}${choices.playNum?'"'+choices.playNum+'" = play number (gap attacked + ball carrier). ':''}${choices.xRoute&&choices.xRoute!==''?'"'+choices.xRoute+'" = X receiver route. ':''}${choices.yzRoute&&choices.yzRoute!==''?'"'+choices.yzRoute+'" = Y/Z receiver route. ':''}${choices.tag&&choices.tag!==''?'"'+choices.tag+'" = execution tag.':''}${isShort?' Note: Short calls like this are common and completely valid — every word earns its spot.':''}`
      setResult({ name, explanation, ytSearch: (choices.formation||'') + ' ' + (choices.playNum||'') + ' football play' })
    } else if (sport === 'Basketball') {
      const parts = [choices.setName, choices.action, choices.read, choices.finish]
      if (choices.tag && choices.tag!=='') parts.push(choices.tag)
      setResult({ name: parts.filter(Boolean).join(' '), explanation: `"${choices.setName}" = the set name tells everyone which series to run. "${choices.action}" = the primary screening/cutting action. "${choices.read}" = what the ball handler does. "${choices.finish}" = how the play ends.`, ytSearch: choices.setName + ' ' + choices.action + ' basketball' })
    } else if (sport === 'Baseball' || sport === 'Softball') {
      const sig = buildSignalSequence(choices.indicator||'belt', choices.call||'Take', choices.wipeoff||'swipe jersey')
      const seqStr = sig.sequence.map(s=>s.touch).join(' → ')
      setResult({
        name: choices.call || 'Signal',
        isSignal: true,
        signalData: sig,
        seqStr,
        explanation: `Situation: ${choices.situation}. Call: ${choices.call}. Indicator (key): touch ${choices.indicator} — everything after this is live. Signal sequence: ${seqStr}. Wipe-off: ${choices.wipeoff}.`,
        ytSearch: (choices.call||'') + ' ' + sport.toLowerCase() + ' third base coach signals'
      })
    } else {
      const parts = [choices.phase, choices.pattern, choices.trigger, choices.finish]
      setResult({ name: parts.filter(Boolean).join(' — '), explanation: `Phase: "${choices.phase}". Pattern: "${choices.pattern}". Triggered by: "${choices.trigger}". Finish: "${choices.finish}".`, ytSearch: choices.pattern + ' soccer tactical drill' })
    }
  }

  const currentStep = steps[step]
  const currentVal = choices[currentStep?.id] ?? null
  const canAdvance = currentVal !== null && currentVal !== undefined
  const isLastStep = step === steps.length - 1

  function reset() { setStep(0); setChoices({}); setResult(null) }

  return (
    <Card>
      <CardHead icon="✏️" title={sport==='Baseball'||sport==='Softball'?'Signal Creator':'Play Name Builder'} tag={sport==='Baseball'||sport==='Softball'?'SIGNAL CREATOR':'LEARN'} tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        <p style={{ fontSize:12, color:'#8a94b0', lineHeight:1.6, marginBottom:10 }}>{sport==='Baseball'||sport==='Softball'?'Define the situation, choose the play, and generate a real third-base coach signal sequence.':'Build a professional play call step by step. The diagram updates with every choice you make.'}</p>

        {!result ? (
          <>
            <div style={{ display:'flex', gap:3, marginBottom:10 }}>
              {steps.map((_,i)=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<step?P:i===step?P:'#1e2330', opacity:i===step?1:i<step?0.7:0.3, transition:'all 0.2s' }}/>)}
            </div>

            <div style={{ background:'#0a1a0a', borderRadius:6, border:'1px solid #1e2330', overflow:'hidden', marginBottom:10 }}>
              <div style={{ fontSize:9, letterSpacing:1.5, color:'#5a6480', textTransform:'uppercase', fontWeight:700, padding:'4px 10px', borderBottom:'1px solid #1e2330' }}>
                {sport==='Baseball'||sport==='Softball'?'Signal Preview — builds as you choose':'Live Diagram — updates with each selection'}
              </div>
              <div style={{ padding:'6px' }}><LiveDiagram /></div>
            </div>

            <div style={{ marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <div style={{ fontSize:9, letterSpacing:1.5, color:P, textTransform:'uppercase', fontWeight:700 }}>Step {step+1} of {steps.length} — {currentStep.label}</div>
                {currentStep.optional && <span style={{ fontSize:10, color:'#8a94b0', padding:'1px 6px', background:'#1e2330', borderRadius:3, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>OPTIONAL</span>}
              </div>
              <div style={{ fontSize:12, color:'#dde1f0', lineHeight:1.5, marginBottom:6 }}>{currentStep.desc}</div>
              {currentStep.note && (
                <div style={{ fontSize:10, color:'#8a94b0', lineHeight:1.5, padding:'6px 10px', background:'rgba(107,154,255,0.06)', borderRadius:4, borderLeft:'2px solid rgba(107,154,255,0.3)', marginBottom:8 }}>
                  💡 {currentStep.note}
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {currentStep.opts.map(opt => {
                  const val = typeof opt === 'string' ? opt : opt.v
                  const label = typeof opt === 'string' ? opt : opt.label
                  const ex = typeof opt === 'object' ? opt.ex : null
                  const isSelected = choices[currentStep.id] === val
                  return (
                    <div key={val} onClick={()=>setChoices(c=>({...c,[currentStep.id]:val}))} style={{ padding:'8px 12px', borderRadius:5, border:`1px solid ${isSelected?P:'#1e2330'}`, background:isSelected?al(P,0.12):'#161922', cursor:'pointer', display:'flex', alignItems:'center', gap:8, transition:'all 0.15s' }}>
                      <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${isSelected?P:'#3d4559'}`, background:isSelected?P:'#0f1219', flexShrink:0 }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, color:isSelected?P:'#f2f4f8', fontWeight:isSelected?700:400 }}>{label}</div>
                        {ex && <div style={{ fontSize:10, color:'#8a94b0', marginTop:1 }}>{ex}</div>}
                      </div>
                      {isSelected && <span style={{ fontSize:12, color:P }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {choices[currentStep?.id] !== undefined && choices[currentStep?.id] !== null && (
              <div style={{ marginTop:4, padding:'5px 10px', background:al(P,0.07), borderRadius:4, fontSize:10, color:P, fontFamily:"'Barlow Condensed',sans-serif" }}>
                {step > 0 ? <span style={{ color:'#8a94b0' }}>Built: </span> : null}
                {steps.slice(0,step+1).map(s=>choices[s.id]).filter(Boolean).join(' · ')}
              </div>
            )}

            <div style={{ display:'flex', gap:8, marginTop:10 }}>
              {step > 0 && <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:'10px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>← BACK</button>}
              {!isLastStep && (
                <button onClick={()=>{ if(canAdvance||currentStep.optional) setStep(s=>s+1) }} style={{ flex:2, padding:'10px', background:canAdvance?P:currentStep.optional?al(P,0.4):'#3d4559', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:(canAdvance||currentStep.optional)?'pointer':'not-allowed', letterSpacing:'1px' }}>
                  {currentStep.optional && !canAdvance ? 'SKIP →' : 'NEXT →'}
                </button>
              )}
              {isLastStep && (
                <button onClick={buildResult} style={{ flex:2, padding:'10px', background:canAdvance||currentStep.optional?P:'#3d4559', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:(canAdvance||currentStep.optional)?'pointer':'not-allowed', letterSpacing:'1px' }}>
                  {sport==='Baseball'||sport==='Softball'?'GENERATE SIGNAL →':'BUILD CALL →'}
                </button>
              )}
            </div>
          </>
        ) : (
          <div style={{ animation:'fadeIn 0.3s ease' }}>
            {result.isSignal ? (
              <>
                <div style={{ padding:'12px', background:al(P,0.1), border:`1px solid ${al(P,0.3)}`, borderRadius:8, marginBottom:10 }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Signal Sequence — {result.signalData.call}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', justifyContent:'center', padding:'8px 0' }}>
                    {result.signalData.sequence.map((s,i) => (
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <div style={{ padding:'8px 10px', borderRadius:6, background: s.type==='indicator'?'rgba(245,158,11,0.15)':s.type==='live'?al(P,0.15):'#161922', border: s.type==='indicator'?'2px solid #f59e0b':s.type==='live'?`2px solid ${P}`:'1px solid #1e2330', textAlign:'center', minWidth:52 }}>
                          <div style={{ fontSize:11, fontWeight:700, color:s.type==='indicator'?'#f59e0b':s.type==='live'?P:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif" }}>{s.touch.toUpperCase()}</div>
                          <div style={{ fontSize:10, color:s.type==='indicator'?'#f59e0b':s.type==='live'?P:'#3d4559', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginTop:2 }}>{s.type==='indicator'?'KEY':s.type==='live'?'SIGN':'FAKE'}</div>
                        </div>
                        {i < result.signalData.sequence.length-1 && <span style={{ color:'#5a6480', fontSize:14 }}>→</span>}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:8, padding:'6px 10px', background:'rgba(239,68,68,0.08)', borderRadius:4, border:'1px solid rgba(239,68,68,0.2)', textAlign:'center' }}>
                    <span style={{ fontSize:9, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>WIPE-OFF: </span>
                    <span style={{ fontSize:11, color:'#f2f4f8' }}>{result.signalData.wipeoff} — cancels all signs</span>
                  </div>
                </div>
                <div style={{ padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, marginBottom:10 }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, color:'#8a94b0', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>How It Works</div>
                  <div style={{ fontSize:12, color:'#dde1f0', lineHeight:1.7 }}>{result.explanation}</div>
                </div>
              </>
            ) : (
              <>
                <div style={{ padding:'12px', background:al(P,0.1), border:`1px solid ${al(P,0.3)}`, borderRadius:8, marginBottom:10, textAlign:'center' }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Your Play Call</div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, color:'#f2f4f8', letterSpacing:0.5, lineHeight:1.4 }}>{result.name}</div>
                </div>
                <div style={{ padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, marginBottom:10 }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, color:'#8a94b0', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Why It Is Called This</div>
                  <div style={{ fontSize:12, color:'#dde1f0', lineHeight:1.7 }}>{result.explanation}</div>
                </div>
              </>
            )}
            {result.ytSearch && (
              <a href={'https://www.youtube.com/results?search_query='+encodeURIComponent(result.ytSearch)} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, textDecoration:'none', marginBottom:10 }}>
                <span style={{ fontSize:16 }}>▶</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:9, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>WATCH ON YOUTUBE</div>
                  <div style={{ fontSize:11, color:'#8a94b0' }}>{result.ytSearch}</div>
                </div>
                <span style={{ fontSize:11, color:'#ef4444' }}>→</span>
              </a>
            )}
            <button onClick={reset} style={{ width:'100%', padding:'10px', background:'#0f1219', border:`1px solid ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>
              {sport==='Baseball'||sport==='Softball'?'BUILD ANOTHER SIGNAL →':'BUILD ANOTHER CALL →'}
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}


// ─── RULEBOOK LINKS ───────────────────────────────────────────────────────────
const RULEBOOK_LINKS = {
  Football: [
    { name:'NFHS Football Rules',   org:'National Federation of State High School Associations', url:'https://www.nfhs.org',       search:'NFHS football rules official',                  level:'High School' },
    { name:'Pop Warner Official',   org:'Pop Warner Little Scholars',                            url:'https://www.popwarner.com', search:'Pop Warner football rules youth',                level:'Youth' },
    { name:'USA Football',          org:'USA Football — NFL Development Partner',                url:'https://usafootball.com',   search:'USA Football rules youth tackle flag',           level:'Youth / All Levels' },
  ],
  Basketball: [
    { name:'NFHS Basketball Rules', org:'National Federation of State High School Associations', url:'https://www.nfhs.org',       search:'NFHS basketball rules official',                 level:'High School' },
    { name:'NBA Official Rules',    org:'National Basketball Association',                       url:'https://www.nba.com',        search:'NBA official rulebook basketball',               level:'Professional Reference' },
    { name:'USA Basketball',        org:'USA Basketball',                                        url:'https://www.usab.com',       search:'USA Basketball youth rules regulations',         level:'Youth / All Levels' },
  ],
  Baseball: [
    { name:'Official Baseball Rules',org:'Major League Baseball',                               url:'https://www.mlb.com',        search:'MLB official baseball rules rulebook',           level:'Official Rules' },
    { name:'Little League Rulebook', org:'Little League International',                          url:'https://www.littleleague.org',search:'Little League baseball playing rules official', level:'Youth' },
    { name:'NFHS Baseball Rules',   org:'National Federation of State High School Associations', url:'https://www.nfhs.org',       search:'NFHS baseball rules high school official',       level:'High School' },
  ],
  Soccer: [
    { name:'Laws of the Game (IFAB)',org:'FIFA / International Football Association Board',     url:'https://www.theifab.com',    search:'IFAB Laws of the Game soccer official rules',    level:'Official Rules' },
    { name:'US Youth Soccer',        org:'US Youth Soccer',                                      url:'https://www.usyouthsoccer.org',search:'US Youth Soccer rules regulations official',  level:'Youth' },
    { name:'AYSO Official Site',    org:'American Youth Soccer Organization',                   url:'https://www.ayso.org',       search:'AYSO soccer rules recreational youth official',  level:'Recreational Youth' },
  ],
  Softball: [
    { name:'USA Softball Official',  org:'USA Softball / ASA',                                  url:'https://www.usasoftball.com',search:'USA Softball ASA official rulebook',             level:'Official Rules' },
    { name:'Little League Softball', org:'Little League International',                          url:'https://www.littleleague.org',search:'Little League softball playing rules official', level:'Youth' },
    { name:'NFHS Softball Rules',   org:'National Federation of State High School Associations', url:'https://www.nfhs.org',       search:'NFHS softball rules high school official',       level:'High School' },
  ],
}


function RulebookPage({ sport, P='#C0392B', al, callAI }) {
  const [leagueSearch, setLeagueSearch] = useState('')
  const [leagueResult, setLeagueResult] = useState(null)
  const [searching, setSearching] = useState(false)
  const safeLinks = (typeof RULEBOOK_LINKS !== 'undefined' && RULEBOOK_LINKS[sport]) ? RULEBOOK_LINKS[sport] : []

  async function searchLeague() {
    if (!leagueSearch.trim() || !callAI) return
    setSearching(true)
    setLeagueResult(null)
    try {
      const raw = await callAI('A youth '+sport+' coach is looking for rules for their league: "'+leagueSearch+'". Give the governing body, 4 common youth rule modifications for '+sport+', and 2 safety rules. Return ONLY valid JSON: {"governingBody":"name","commonModifications":["mod 1","mod 2","mod 3","mod 4"],"safetyRules":["rule 1","rule 2"],"note":"caveat if uncertain"}')
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setLeagueResult(JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1)))
    } catch(e) {
      setLeagueResult({ governingBody:'Search failed', commonModifications:[], safetyRules:[], note:'Try searching your league website directly.' })
    }
    setSearching(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <Card>
        <CardHead icon="📜" title={sport+' Official Resources'} tag="RULES" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5, marginBottom:12, padding:'8px 10px', background:'rgba(245,158,11,0.06)', borderRadius:4, border:'1px solid rgba(245,158,11,0.15)' }}>⚠️ Links open official org homepages. Use Search for specific documents.</div>
          {safeLinks.map((link,i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#161922', border:`1px solid ${al(P,0.2)}`, borderRadius:6, marginBottom:8, borderLeft:`3px solid ${P}` }}>
              <span style={{ fontSize:16, flexShrink:0 }}>📋</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8', marginBottom:2 }}>{link.name}</div>
                <div style={{ fontSize:10, color:'#8a94b0' }}>{link.org}</div>
                <div style={{ fontSize:9, color:P, marginTop:2, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{link.level}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, padding:'3px 8px', border:`1px solid ${al(P,0.4)}`, borderRadius:3, textDecoration:'none', textAlign:'center' }}>VISIT →</a>
                <a href={'https://www.google.com/search?q='+encodeURIComponent(link.search)} target="_blank" rel="noopener noreferrer" style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, padding:'3px 8px', border:'1px solid #1e2330', borderRadius:3, textDecoration:'none', textAlign:'center' }}>SEARCH</a>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHead icon="🔍" title="Find Your League Rules" tag="AI SEARCH" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5, marginBottom:10 }}>Enter your league name to find rule modifications and governing body info.</div>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <input value={leagueSearch} onChange={e=>setLeagueSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchLeague()} placeholder={'e.g. Tolland Youth '+sport} style={{ flex:1, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
            <button onClick={searchLeague} disabled={searching||!leagueSearch.trim()} style={{ padding:'9px 14px', background:leagueSearch.trim()&&!searching?P:'#3d4559', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:leagueSearch.trim()&&!searching?'pointer':'not-allowed', whiteSpace:'nowrap' }}>{searching?'..':'SEARCH'}</button>
          </div>
          {searching && <div style={{ textAlign:'center', padding:'14px', color:'#8a94b0', fontSize:12 }}>Searching for {leagueSearch} rules...</div>}
          {leagueResult && !searching && (
            <div style={{ animation:'fadeIn 0.3s ease' }}>
              <div style={{ padding:'10px 12px', background:al(P,0.08), border:`1px solid ${al(P,0.25)}`, borderRadius:6, marginBottom:8 }}>
                <div style={{ fontSize:9, letterSpacing:1.5, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Governing Body</div>
                <div style={{ fontSize:13, color:'#f2f4f8', fontWeight:600, marginBottom:6 }}>{leagueResult.governingBody}</div>
                <a href={'https://www.google.com/search?q='+encodeURIComponent((leagueResult.governingBody||'')+(sport ? ' '+sport : '')+' official rules')} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:P, display:'inline-block', padding:'4px 10px', background:al(P,0.1), borderRadius:3, textDecoration:'none' }}>🔍 Search official rules →</a>
                <div style={{ fontSize:9, color:'#5a6480', marginTop:4, fontStyle:'italic' }}>Opens Google. CoachIQ is not responsible for third-party results.</div>
              </div>
              {leagueResult.commonModifications && leagueResult.commonModifications.length > 0 && (
                <div style={{ padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, marginBottom:8 }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, color:'#8a94b0', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Common Youth Rule Modifications</div>
                  {leagueResult.commonModifications.map((m,i) => <div key={i} style={{ fontSize:11, color:'#dde1f0', lineHeight:1.6, padding:'3px 0', borderBottom:i<leagueResult.commonModifications.length-1?'1px solid #1e2330':'none' }}>• {m}</div>)}
                </div>
              )}
              {leagueResult.safetyRules && leagueResult.safetyRules.length > 0 && (
                <div style={{ padding:'10px 12px', background:'rgba(74,222,128,0.05)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:6, marginBottom:8 }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, color:'#4ade80', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Safety Rules</div>
                  {leagueResult.safetyRules.map((r,i) => <div key={i} style={{ fontSize:11, color:'#dde1f0', lineHeight:1.6, padding:'3px 0' }}>✓ {r}</div>)}
                </div>
              )}
              {leagueResult.note && <div style={{ fontSize:10, color:'#8a94b0', fontStyle:'italic', lineHeight:1.5, padding:'8px 10px', background:'#161922', borderRadius:4 }}>Note: {leagueResult.note}</div>}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
// ─── NEWS PAGE ────────────────────────────────────────────────────────────────
function NewsPage({ P='#C0392B', S='#002868', al, sport, callAI }) {
  const [activeChannel, setActiveChannel] = useState('sport')
  const [newsItems, setNewsItems] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState(null)
  const [expandedDrill, setExpandedDrill] = useState(null)

  const CHANNELS = [
    { id:'sport',     label:sport+' Coaching', icon:'📋' },
    { id:'sportNews', label:sport+' News',      icon:'⚡' },
  ]

  // ── STATIC COACHING CONTENT — loads instantly, no AI needed ──
  const COACHING_CONTENT = {
    Football: [
      { title:'The 3-Step Drop', category:'DRILL', body:'QB takes a 3-step drop on short routes. Count 1-2-3 out loud, plant on the third step, and throw. Practice daily with targets at 5-7 yards. Builds rhythm and timing.', diagram:'🏈→QB steps back 3 times→throw to receiver at 6 yards' },
      { title:'Angle Tackling Drill', category:'DRILL', body:'Set up cones in a channel 5 yards wide. Ball carrier runs straight, defender attacks at an angle — not straight on. Focus on wrapping up with both arms, never leading with the head.', diagram:'📐Defender at 45° angle→wrap tackle→secure' },
      { title:'Run Blocking Fundamentals', category:'STRATEGY', body:'First step is the most important — it should always be toward the defender. Drive block: explode out of stance, aim for defender\'s numbers, drive feet on contact. Teach leverage before power.', diagram:'OL→short first step→hands inside→drive' },
      { title:'Cover 2 Explanation', category:'STRATEGY', body:'Two safeties split the deep field into halves. Corners jam receivers at the line and drop to the flat. Attack Cover 2 with corner routes and seam throws between the safety and linebacker.', diagram:'S  S\nCB  LB LB LB  CB\n——Cover 2——' },
      { title:'Red Zone Mindset', category:'GAME DAY', body:'In the red zone, the field is compressed. Switch from vertical to horizontal routes. Motion and misdirection create confusion. Pick plays that stress defenders laterally, not vertically.', diagram:'📍10 yards to endzone→spread the field→horizontal stress' },
      { title:'Pre-Snap Reads for QBs', category:'DEVELOPMENT', body:'Before the snap, find the safeties first. One high safety = Cover 1 or 3. Two high = Cover 2 or 4. Then identify the Mike linebacker — he sets the protection. Teach this at every age level.', diagram:'1 Safety high=Cover 1/3 | 2 Safeties high=Cover 2/4' },
      { title:'Zone Blocking Scheme', category:'STRATEGY', body:'All linemen step playside and block the area around them, not a specific person. Running back reads the first down lineman and cuts off his block. Great for youth teams because mistakes are less costly.', diagram:'OL all step right→RB reads cut lane→burst through' },
      { title:'Flat-Footed Stance', category:'DEVELOPMENT', body:'Youth players often default to standing straight up. Teach the athletic position: feet shoulder-width, slight bend in knees, weight on balls of feet, hands ready. Use it at every position, every play.' },
    ],
    Basketball: [
      { title:'Defensive Slide Drill', category:'DRILL', body:'Players start in defensive stance, slide laterally without crossing feet. Coach points left or right. Add a tennis ball toss to force heads up. 30 seconds on, 15 off. Never let feet touch.', diagram:'←Slide→←Slide→heads up, feet apart' },
      { title:'Pick and Roll Coverage', category:'STRATEGY', body:'Three options: go under (for poor shooters), go over (for shooters), or switch. Youth teams: default to switching to avoid confusion. Practice the verbal communication — "SCREEN LEFT!" every time.', diagram:'Ball handler + screener→defender goes over or switches' },
      { title:'Triple Threat Position', category:'DEVELOPMENT', body:'Every player who catches the ball should land in triple threat: one foot ahead, ball at hip, eyes up. From here you can shoot, pass, or drive. Make it a habit before anything else.', diagram:'Catch ball→feet set→ball at hip→read defense' },
      { title:'Motion Offense Basics', category:'STRATEGY', body:'No set plays — players read and react. Rule 1: if your defender helps on a drive, cut backdoor. Rule 2: if you pass, cut or screen. Rule 3: space the floor — never stand next to a teammate.', diagram:'Pass→cut or screen→space→read→repeat' },
      { title:'Free Throw Routine', category:'DEVELOPMENT', body:'Same routine every time: take the ball, two dribbles, spin it, one breath, shoot. The routine triggers muscle memory under pressure. Practice the routine as much as the shot itself.', diagram:'2 dribbles→spin→breath→bend→follow through' },
    ],
    Baseball: [
      { title:'Fielding Ground Balls', category:'DRILL', body:'Charge the ball — never wait for it to come to you. Get in front, low glove (thumb down for slow rollers), and field out front. Crow hop to throw. Practice 20 ground balls before every practice.', diagram:'Charge→glove low→field out front→crow hop→throw' },
      { title:'Two-Strike Approach', category:'STRATEGY', body:'With two strikes, shorten the swing. Choke up one inch, protect the outer half, put the ball in play. Strikeouts help nobody — groundouts and line outs keep innings alive.', diagram:'2 strikes→choke up→compact swing→contact focus' },
      { title:'Pitcher Fielding Practice', category:'DRILL', body:'After every pitch, the pitcher is a fielder. Practice comebackers, covering first on groundouts, and backing up bases. Run PFP drills for 10 minutes every practice — most youth teams skip this.', diagram:'Pitch→comebacker→throw to first→cover and back up' },
      { title:'First and Third Situation', category:'STRATEGY', body:'Runner on first steals second. Runner on third reads the catcher\'s throw. If throw goes to second, runner on third breaks. Defense must decide: let the steal happen or throw and risk a run.', diagram:'Runner 1st breaks→catcher throws?→runner 3rd reads and goes' },
    ],
    Soccer: [
      { title:'Rondo Passing Drill', category:'DRILL', body:'4v1 or 5v2 in a small grid. Defenders try to win the ball, attackers keep possession. One-touch or two-touch limit. Best drill for passing accuracy, movement, and decision speed. 10 minutes daily.', diagram:'4 players outside→1 inside→keep ball→switch on turnover' },
      { title:'Defensive Shape — 4-4-2', category:'STRATEGY', body:'Two banks of four stay compact. When ball is on one side, the opposite winger tucks in. Midfielders never ball-chase — they hold their line. No gaps between lines is the goal.', diagram:'GK\n4 defenders\n4 midfielders\n2 forwards — stay compact' },
      { title:'Corner Kick Attack', category:'STRATEGY', body:'Near post runner, far post runner, and a player at the top of the box for clearances. Near post flick-on is the most dangerous — practice the timing between the corner taker and near post attacker.', diagram:'Corner→near post flick or far post run→top of box cleanup' },
      { title:'1v1 Defending', category:'DRILL', body:'Stay on your feet. Jockey — delay and slow the attacker. Force them to their weak foot. Never dive in unless sure. Practice patience: let your teammates recover before committing to the tackle.' },
    ],
    Softball: [
      { title:'Windmill Pitching Mechanics', category:'DEVELOPMENT', body:'Full arm circle — wrist snap at release is the key to speed. Drive off the rubber with the push leg. Follow through across the body. Practice the wrist snap separately with a light ball before full throws.', diagram:'Wind up→full circle→snap wrist at hip→follow through' },
      { title:'Slap Hitting', category:'STRATEGY', body:'Left-handed hitters can use the running slap — start moving toward first base mid-swing. Contact point is out front, ball goes to the left side of the infield. Forces infield in and opens gaps.', diagram:'LHH steps→slap contact out front→ball to 3rd/SS→run' },
      { title:'Outfield Communication', category:'DRILL', body:'Any ball between two outfielders: center fielder has priority over all. Call "I got it!" twice, loudly. Practice fly ball communication daily — more errors come from miscommunication than misplays.', diagram:'CF calls twice→other OF peels off→CF catches' },
    ],
  }

  const drills = COACHING_CONTENT[sport] || COACHING_CONTENT.Football

  // RSS feed URLs
  const RSS_FEEDS = {
    Football:   ['https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/nfl/news'],
    Basketball: ['https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/nba/news'],
    Baseball:   ['https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/mlb/news'],
    Soccer:     ['https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/soccer/news'],
    Softball:   ['https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/mlb/news'],
  }

  function getCacheKey() { return `coachiq_rss_news_${sport}` }

  // Load news RSS — called on mount
  async function loadNews() {
    // Check cache first
    try {
      const cached = sessionStorage.getItem(getCacheKey())
      if (cached) {
        const { items: ci, ts } = JSON.parse(cached)
        if (Date.now() - ts < 30 * 60 * 1000 && ci?.length) {
          setNewsItems(ci); setNewsLoading(false); return
        }
      }
    } catch(e) {}

    setNewsLoading(true)
    setNewsError(null)
    const urls = RSS_FEEDS[sport] || RSS_FEEDS.Football
    try {
      const results = await Promise.allSettled(urls.map(url => fetch(url).then(r=>r.json())))
      const all = []
      for (const r of results) {
        if (r.status==='fulfilled' && r.value?.items?.length) all.push(...r.value.items)
      }
      if (!all.length) throw new Error('No articles found.')
      const seen = new Set()
      const deduped = all
        .filter(it => { const k=it.title?.trim(); if(!k||seen.has(k))return false; seen.add(k); return true })
        .sort((a,b) => new Date(b.pubDate||0) - new Date(a.pubDate||0))
        .slice(0,15)
      setNewsItems(deduped)
      try { sessionStorage.setItem(getCacheKey(), JSON.stringify({ items: deduped, ts: Date.now() })) } catch(e){}
    } catch(e) {
      setNewsError('Could not load news. Check your connection.')
    }
    setNewsLoading(false)
  }

  // Load news on mount and sport change — coaching content is instant/static
  useEffect(() => { loadNews() }, [sport])

  function formatDate(dateStr) {
    if (!dateStr) return ''
    // RSS2JSON returns dates like "2025-04-18 14:30:00" — treat as UTC
    const normalized = typeof dateStr === 'string' ? dateStr.replace(' ', 'T').replace(/([^Z])$/, '$1Z') : dateStr
    const d = new Date(normalized)
    if (isNaN(d.getTime())) return ''
    const now = new Date()
    const diff = now - d
    if (diff < 0) return d.toLocaleDateString([],{month:'short',day:'numeric'}) // future date — show date
    if (diff < 3600000) return Math.floor(diff/60000) + 'm ago'
    if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago'
    if (diff < 604800000) return Math.floor(diff/86400000) + 'd ago'
    return d.toLocaleDateString([],{month:'short',day:'numeric'})
  }

  function stripHtml(str) {
    return (str||'').replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&quot;/g,'"').trim()
  }

  const categoryColors = { DRILL:'#4ade80', STRATEGY:P, DEVELOPMENT:'#f59e0b', 'GAME DAY':'#c084fc' }

  return (
    <div style={{ padding:'16px 0 8px' }}>
      {/* Header */}
      <div style={{ marginBottom:14 }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#5a6480', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>{sport} · News + Coaching</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:28, lineHeight:1, color:'#f2f4f8' }}>News + Feed</div>
      </div>

      {/* Channel tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:14, overflowX:'auto', WebkitOverflowScrolling:'touch', paddingBottom:2 }}>
        {CHANNELS.map(ch => (
          <button key={ch.id} onClick={()=>setActiveChannel(ch.id)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:20, border:`1px solid ${activeChannel===ch.id?P:'#1e2330'}`, background:activeChannel===ch.id?P:'#0f1219', color:activeChannel===ch.id?'white':'#9aa0b0', fontSize:12, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px', WebkitTapHighlightColor:'transparent', flexShrink:0, touchAction:'manipulation' }}>
            <span>{ch.icon}</span>{ch.label}
          </button>
        ))}
        {activeChannel === 'sportNews' && (
          <button onClick={loadNews} style={{ padding:'7px 10px', borderRadius:20, border:'1px solid #1e2330', background:'#0f1219', color:'#8a94b0', fontSize:14, cursor:'pointer', WebkitTapHighlightColor:'transparent', flexShrink:0, touchAction:'manipulation' }}>⟳</button>
        )}
      </div>

      {/* ── COACHING TAB — static, instant, expandable ── */}
      {activeChannel === 'sport' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {drills.map((drill, i) => {
            const isOpen = expandedDrill === i
            const catColor = categoryColors[drill.category] || P
            return (
              <div key={i} onClick={()=>setExpandedDrill(isOpen ? null : i)}
                style={{ background:'#0f1219', border:`1px solid ${isOpen ? al(catColor,0.4) : '#1e2330'}`, borderRadius:8, overflow:'hidden', cursor:'pointer', borderLeft:`3px solid ${catColor}` }}>
                {/* Header row */}
                <div style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 6px', borderRadius:3, background:al(catColor,0.15), color:catColor, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>{drill.category}</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#f2f4f8', lineHeight:1.3 }}>{drill.title}</div>
                  </div>
                  <div style={{ fontSize:12, color:'#5a6480', flexShrink:0 }}>{isOpen ? '▲' : '▼'}</div>
                </div>
                {/* Expanded content */}
                {isOpen && (
                  <div style={{ padding:'0 14px 14px', borderTop:`1px solid ${al(catColor,0.15)}` }}>
                    <div style={{ fontSize:12, color:'#dde1f0', lineHeight:1.7, marginTop:10, marginBottom:drill.diagram?12:0 }}>
                      {drill.body}
                    </div>
                    {drill.diagram && (
                      <div style={{ marginTop:4 }}>
                        <div style={{ fontSize:9, color:catColor, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:4 }}>📐 DIAGRAM</div>
                        <CoachingDiagram diagramKey={drill.title} P={P} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          <div style={{ marginTop:4, fontSize:9, color:'#5a6480', textAlign:'center' }}>Tap any card to expand · More content coming</div>
        </div>
      )}

      {/* ── NEWS TAB — RSS, pre-loaded ── */}
      {activeChannel === 'sportNews' && (
        <div>
          {newsLoading && (
            <div style={{ padding:'40px 20px', textAlign:'center' }}>
              <div style={{ width:24, height:24, borderRadius:'50%', border:`3px solid ${P}`, borderTopColor:'#0f1219', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }}/>
              <div style={{ fontSize:12, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif" }}>Loading {sport} news...</div>
            </div>
          )}
          {!newsLoading && newsError && (
            <div style={{ padding:'20px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, marginBottom:12 }}>
              <div style={{ fontSize:11, color:'#ef4444', marginBottom:8, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Feed Error</div>
              <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.5, marginBottom:10 }}>{newsError}</div>
              <button onClick={loadNews} style={{ padding:'6px 14px', background:P, border:'none', borderRadius:4, color:'white', fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Retry</button>
            </div>
          )}
          {!newsLoading && !newsError && newsItems.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {newsItems.map((item, i) => (
                <div key={i}
                  onClick={()=>{ if(item.link) window.open(item.link,'_blank','noopener') }}
                  style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:8, padding:'12px 14px', cursor:item.link?'pointer':'default', WebkitTapHighlightColor:'transparent' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <span style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'1px', textTransform:'uppercase' }}>
                      {item.author || (item.link ? (() => { try { return new URL(item.link).hostname.replace('www.','') } catch(e) { return 'News' } })() : 'News')}
                    </span>
                    <span style={{ fontSize:9, color:'#5a6480' }}>{formatDate(item.pubDate)}</span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#f2f4f8', lineHeight:1.4, marginBottom:item.description?6:0 }}>
                    {stripHtml(item.title)}
                  </div>
                  {item.description && (
                    <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                      {stripHtml(item.description).slice(0,180)}
                    </div>
                  )}
                  {item.link && (
                    <div style={{ marginTop:8, fontSize:10, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>READ ARTICLE →</div>
                  )}
                </div>
              ))}
              <div style={{ marginTop:4, fontSize:9, color:'#5a6480', textAlign:'center' }}>Real-time news · Tap any article to read in full</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
function HelpPage({ P='#C0392B', al, setPage, sport }) {
  const [openSection, setOpenSection] = useState(null)

  const sections = [
    { id:'home',    icon:'🏠', title:'Home Screen',
      content: `The home screen is your coaching dashboard. At the top right, tap "News" to go to the news feed, or tap your team name to go directly to your team page. The hero card shows your team name, colors, and a rotating widget (weather, countdown, date/time, coaching tip). Tap the weather widget's "Set Location" prompt to configure your location in Settings. The collapsible team card lets you switch teams or tap to go to the Team page. Below is your coaching feed — tap "Read more" or "Watch" on any item for more info.` },
    { id:'schemes', icon:'📋', title:'Scheme Generator',
      content: `The Scheme Generator creates custom plays and formations tailored to your team. Fill out the form (offensive system, personnel, age group, etc.) and tap Generate. Each play card has: tap "Show Play" for an animated diagram, "Educator Mode" for a step-by-step breakdown, "Pro Comparison" to see how NFL teams run the same play, "Variations" for adjustments. Save any play to your Playbook. The Defense Generator works the same way. Team Skill Level now adapts the form — beginners see fewer fields.` },
    { id:'team',    icon:'🏆', title:'Team Management',
      content: `Create up to 5 teams per sport. Each team has a name, mascot, colors, hometown, and season. The Roster tab lets you add players with positions (up to 3 per player) and jersey numbers. The Lineup Builder shows a field diagram for your sport — tap any position slot to assign a player. Create multiple named lineups and star one as Game Day. The Schedule tab manages events with address search. Practice Plans generate AI-powered session outlines.` },
    { id:'news',    icon:'📰', title:'News + Feed',
      content: `The News tab has 5 channels: All (everything mixed), [Sport] Coaching (drills, schemes, science for your sport), Youth Coaching (general coaching theory), [Sport] News (pro + college headlines), All Sports News. Each channel loads independently and caches so switching is instant. Tap "Read more" to search Google for the full story. Tap "Watch" to find YouTube videos. Hit ↻ to refresh a channel.` },
    { id:'learn',   icon:'🎓', title:'Learn + Tools',
      content: `Play Name Builder walks you through constructing a real play call step by step — each choice updates the live field diagram. Football has 8 steps covering personnel, formation, motion, play number, and routes. Baseball/Softball has the Signal Creator which generates a real third-base coach touch sequence. The Coaching Gauntlet tests your IQ with scenario-based questions. Your IQ score starts at 500 and goes up or down based on difficulty and streaks.` },
    { id:'playnb',  icon:'✏️', title:'Play Name Builder Tips',
      content: `Step 1 (Personnel): Sets the base formation. 11 = spread, 22 = power. Step 2 (Formation): Adds the alignment and strength. Step 3 (Modifier): Optional TE/line adjustment. Step 4 (Motion): Optional pre-snap movement — always behind the LOS. Step 5 (Play Number): The core call — tens digit = gap, ones digit = ball carrier. Steps 6-8 are route tags for pass plays. Skip optional steps for shorter calls. Short calls like "22 Power Right" are completely valid.` },
    { id:'scout',   icon:'🔍', title:'Scout + Film',
      content: `The Scout page has two sections. Opponent Scout: build a scouting report on an upcoming opponent — describe their tendencies and get AI-generated defensive game plan suggestions. Film Room: log your team footage notes and tag plays by category. Individual player film analysis is on the roadmap as AthleteIQ.` },
    { id:'settings',icon:'⚙️', title:'Settings + Customization',
      content: `More → Settings has: CoachIQ Logo Style (choose your brand color palette), Home Location (for weather), Team Colors (adjust primary/secondary/accent colors), and Home Widget Settings (choose which widgets rotate, or pin one permanently). Your name is set during onboarding and shows in the welcome greeting.` },
    { id:'iq',      icon:'🧠', title:'Coach IQ Score',
      content: `Your Coach IQ starts at 500 (average). Answer Gauntlet questions correctly to earn points: Rookie = +8, Varsity = +15, Elite = +25. Wrong answers cost: Rookie = -4, Varsity = -7, Elite = -12. Every 3 correct answers in a row earns a +10 streak bonus. Score is capped at 1000 and floored at 100. Battle Mode in the Gauntlet lets you chain scenarios — your score updates live.` },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      <div style={{ padding:'14px 0 12px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#5a6480', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>documentation</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:24, color:'#dde1f0', lineHeight:1 }}>Help + Features</div>
        <div style={{ fontSize:11, color:'#5a6480', marginTop:6 }}>Tap any section to expand. Every feature explained.</div>
      </div>
      {sections.map((sec, i) => (
        <div key={sec.id} style={{ borderBottom:'1px solid #1e2330' }}>
          <div onClick={()=>setOpenSection(openSection===sec.id?null:sec.id)} style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 4px', cursor:'pointer' }}>
            <span style={{ fontSize:18, flexShrink:0 }}>{sec.icon}</span>
            <span style={{ flex:1, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:openSection===sec.id?P:'#f2f4f8', textTransform:'uppercase', letterSpacing:'0.5px' }}>{sec.title}</span>
            <span style={{ fontSize:12, color:'#5a6480', transition:'transform 0.2s', transform:openSection===sec.id?'rotate(180deg)':'rotate(0deg)', display:'inline-block' }}>▼</span>
          </div>
          {openSection === sec.id && (
            <div style={{ padding:'0 4px 16px 32px', animation:'fadeIn 0.2s ease' }}>
              <div style={{ fontSize:12, color:'#9aa0b0', lineHeight:1.8 }}>{sec.content}</div>
              {sec.id === 'home' && <button onClick={()=>setPage('home')} style={{ marginTop:10, padding:'6px 12px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>→ Go to Home</button>}
              {sec.id === 'schemes' && <button onClick={()=>setPage('schemes')} style={{ marginTop:10, padding:'6px 12px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>→ Open Schemes</button>}
              {sec.id === 'team' && <button onClick={()=>setPage('team')} style={{ marginTop:10, padding:'6px 12px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>→ Open Team</button>}
              {sec.id === 'news' && <button onClick={()=>setPage('news')} style={{ marginTop:10, padding:'6px 12px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>→ Open News</button>}
              {sec.id === 'learn' && <button onClick={()=>setPage('learn')} style={{ marginTop:10, padding:'6px 12px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>→ Open Learn</button>}
              {sec.id === 'settings' && <button onClick={()=>setPage('more')} style={{ marginTop:10, padding:'6px 12px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>→ Open Settings</button>}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}


// ─── COACHING DRILL DIAGRAM ───────────────────────────────────────────────────
function CoachingDiagram({ diagramKey, P='#C0392B' }) {
  const W = 320, H = 160
  const diagrams = {
    // ── FOOTBALL ──────────────────────────────────────────────────────────────
    'three_step_drop': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        {/* Field */}
        <rect width={W} height={H} fill="#f4f4f0" rx="4"/>
        {[0,1,2,3,4].map(i=><line key={i} x1={0} y1={32+i*26} x2={W} y2={32+i*26} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>)}
        <line x1={0} y1={106} x2={W} y2={106} stroke="rgba(0,0,0,0.4)" strokeWidth={1} strokeDasharray="8,5"/>
        <text x={8} y={103} fontSize={8} fill="rgba(0,0,0,0.3)">LOS</text>
        {/* QB drop steps */}
        {[0,1,2].map(i=>(
          <g key={i}>
            <circle cx={160} cy={112+i*16} r={5} fill="none" stroke={P} strokeWidth={1.5} strokeDasharray="3,2" opacity={0.5+i*0.15}/>
            <text x={170} y={116+i*16} fontSize={8} fill={P} opacity={0.7}>{i+1}</text>
          </g>
        ))}
        {/* QB at snap */}
        <circle cx={160} cy={110} r={9} fill={P} stroke="white" strokeWidth={1.5}/>
        <text x={160} y={114} fontSize={9} fill="white" textAnchor="middle" fontWeight="bold">QB</text>
        {/* After drop */}
        <circle cx={160} cy={150} r={8} fill="none" stroke={P} strokeWidth={2}/>
        <text x={160} y={154} fontSize={8} fill={P} textAnchor="middle" fontWeight="bold">QB</text>
        {/* Arrow down (drop) */}
        <line x1={160} y1={120} x2={160} y2={140} stroke={P} strokeWidth={2}/>
        <polygon points={`156,140 164,140 160,148`} fill={P}/>
        {/* Receiver */}
        <circle cx={220} cy={72} r={9} fill={P} stroke="white" strokeWidth={1.5}/>
        <text x={220} y={76} fontSize={9} fill="white" textAnchor="middle" fontWeight="bold">WR</text>
        {/* Route line */}
        <line x1={220} y1={106} x2={220} y2={72} stroke={P} strokeWidth={2}/>
        <polygon points={`216,76 224,76 220,68`} fill={P}/>
        {/* Throw arc */}
        <path d={`M 162 148 Q 200 100 215 76`} fill="none" stroke="rgba(245,158,11,0.8)" strokeWidth={2} strokeDasharray="5,3"/>
        <circle cx={215} cy={76} r={3} fill="#92400e"/>
        {/* Labels */}
        <text x={160} y={18} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">3-STEP DROP → PLANT → THROW</text>
        <text x={126} y={155} fontSize={8} fill={P} fontFamily="sans-serif">Plant here</text>
      </svg>
    ),
    'angle_tackle': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#f4f4f0" rx="4"/>
        {[0,1,2,3,4].map(i=><line key={i} x1={0} y1={20+i*28} x2={W} y2={20+i*28} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>)}
        {/* Cone channel */}
        <rect x={120} y={10} width={80} height={140} fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.4)" strokeWidth={1} strokeDasharray="4,3" rx={2}/>
        {/* Cones */}
        {[[120,10],[200,10],[120,150],[200,150]].map(([cx,cy],i)=>(
          <polygon key={i} points={`${cx},${cy+8} ${cx-5},${cy+16} ${cx+5},${cy+16}`} fill="#f59e0b"/>
        ))}
        {/* Ball carrier running down */}
        <circle cx={160} cy={30} r={9} fill="#666" stroke="white" strokeWidth={1.5}/>
        <text x={160} y={34} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">BC</text>
        <line x1={160} y1={40} x2={160} y2={90} stroke="#666" strokeWidth={2}/>
        <polygon points={`156,88 164,88 160,96`} fill="#666"/>
        {/* Defender angle approach */}
        <circle cx={80} cy={100} r={9} fill={P} stroke="white" strokeWidth={1.5}/>
        <text x={80} y={104} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">DEF</text>
        <line x1={89} y1={100} x2={147} y2={118} stroke={P} strokeWidth={2.5}/>
        <polygon points={`143,122 151,114 153,124`} fill={P}/>
        {/* Angle label */}
        <text x={98} y={96} fontSize={9} fill={P} fontFamily="sans-serif">45°</text>
        <path d="M 89 100 A 20 20 0 0 1 100 82" fill="none" stroke={P} strokeWidth={1} strokeDasharray="3,2"/>
        {/* Wrap label */}
        <text x={148} y={140} fontSize={8} fill="#5a6480" fontFamily="sans-serif" textAnchor="middle">Wrap up — both arms</text>
        <text x={160} y={14} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">5-YARD CHANNEL — ANGLE TACKLE</text>
      </svg>
    ),
    'run_blocking': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#f4f4f0" rx="4"/>
        {[0,1,2,3,4].map(i=><line key={i} x1={0} y1={20+i*28} x2={W} y2={20+i*28} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>)}
        <line x1={0} y1={90} x2={W} y2={90} stroke="rgba(0,0,0,0.35)" strokeWidth={1} strokeDasharray="8,5"/>
        <text x={8} y={87} fontSize={8} fill="rgba(0,0,0,0.3)">LOS</text>
        {/* OL */}
        {[[-80,-40,0,40,80]].flat().map((offset,i)=>(
          <g key={i}>
            <rect x={160+offset-10} y={84} width={20} height={14} fill={P} rx={2}/>
            <text x={160+offset} y={95} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">{['T','G','C','G','T'][i]}</text>
            {/* Forward step arrows */}
            <line x1={160+offset} y1={84} x2={160+offset} y2={66} stroke={P} strokeWidth={1.8}/>
            <polygon points={`${156+offset},68 ${164+offset},68 ${160+offset},62`} fill={P}/>
          </g>
        ))}
        {/* Defenders */}
        {[-60,-20,20,60].map((offset,i)=>(
          <circle key={i} cx={160+offset} cy={72} r={8} fill="none" stroke="#444" strokeWidth={1.5}/>
        ))}
        {/* Step labels */}
        <text x={160} y={150} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">First step toward defender → hands inside → drive</text>
        <text x={160} y={14} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">RUN BLOCKING — OL FIRE OUT</text>
      </svg>
    ),
    'cover_2': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#f4f4f0" rx="4"/>
        {[0,1,2,3].map(i=><line key={i} x1={0} y1={30+i*36} x2={W} y2={30+i*36} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>)}
        <line x1={0} y1={118} x2={W} y2={118} stroke="rgba(0,0,0,0.35)" strokeWidth={1} strokeDasharray="8,5"/>
        <text x={8} y={115} fontSize={8} fill="rgba(0,0,0,0.3)">LOS</text>
        {/* Deep half zones */}
        <ellipse cx={84} cy={46} rx={72} ry={28} fill="rgba(30,80,220,0.12)" stroke="rgba(30,80,220,0.4)" strokeWidth={1.5} strokeDasharray="5,3"/>
        <ellipse cx={236} cy={46} rx={72} ry={28} fill="rgba(30,80,220,0.12)" stroke="rgba(30,80,220,0.4)" strokeWidth={1.5} strokeDasharray="5,3"/>
        <text x={84} y={38} fontSize={8} fill="rgba(30,80,220,0.8)" textAnchor="middle">Deep Half</text>
        <text x={236} y={38} fontSize={8} fill="rgba(30,80,220,0.8)" textAnchor="middle">Deep Half</text>
        {/* Safeties */}
        <circle cx={84} cy={52} r={9} fill="#333" stroke="white" strokeWidth={1.5}/>
        <text x={84} y={56} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">SS</text>
        <circle cx={236} cy={52} r={9} fill="#333" stroke="white" strokeWidth={1.5}/>
        <text x={236} y={56} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">FS</text>
        {/* Flat zones */}
        <ellipse cx={46} cy={98} rx={38} ry={14} fill="rgba(0,140,90,0.12)" stroke="rgba(0,140,90,0.4)" strokeWidth={1} strokeDasharray="4,3"/>
        <ellipse cx={274} cy={98} rx={38} ry={14} fill="rgba(0,140,90,0.12)" stroke="rgba(0,140,90,0.4)" strokeWidth={1} strokeDasharray="4,3"/>
        <text x={46} y={100} fontSize={7} fill="rgba(0,140,90,0.8)" textAnchor="middle">Flat</text>
        <text x={274} y={100} fontSize={7} fill="rgba(0,140,90,0.8)" textAnchor="middle">Flat</text>
        {/* CBs */}
        <circle cx={30} cy={114} r={9} fill="#555" stroke="white" strokeWidth={1.5}/>
        <text x={30} y={118} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">CB</text>
        <circle cx={290} cy={114} r={9} fill="#555" stroke="white" strokeWidth={1.5}/>
        <text x={290} y={118} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">CB</text>
        {/* LBs */}
        {[120,160,200].map((cx,i)=>(
          <circle key={i} cx={cx} cy={90} r={8} fill="#555" stroke="white" strokeWidth={1.5}/>
        ))}
        <text x={160} y={155} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">CBs jam + drop to flat · Safeties own the deep halves</text>
        <text x={160} y={14} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">COVER 2 ZONE</text>
      </svg>
    ),
    'redzone': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#f4f4f0" rx="4"/>
        <rect x={0} y={0} width={W} height={H} fill="rgba(192,57,43,0.04)" rx="4"/>
        {[0,1,2].map(i=><line key={i} x1={0} y1={30+i*36} x2={W} y2={30+i*36} stroke="rgba(0,0,0,0.07)" strokeWidth={1}/>)}
        <line x1={0} y1={130} x2={W} y2={130} stroke="rgba(0,0,0,0.35)" strokeWidth={1} strokeDasharray="8,5"/>
        <text x={8} y={127} fontSize={8} fill="rgba(0,0,0,0.3)">LOS</text>
        <line x1={0} y1={10} x2={W} y2={10} stroke={P} strokeWidth={3}/>
        <text x={160} y={22} fontSize={9} fill={P} textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">END ZONE</text>
        {/* Compressed field indicator */}
        <rect x={20} y={10} width={280} height={120} fill="none" stroke={P} strokeWidth={1} strokeDasharray="4,3" opacity={0.3}/>
        <text x={8} y={70} fontSize={8} fill={P} opacity={0.6} transform="rotate(-90,8,70)">10 yds</text>
        {/* Horizontal routes spread */}
        {[[60,130,'WR'],[130,130,'TE'],[190,130,'WR'],[260,130,'WR']].map(([cx,cy,lbl],i)=>(
          <g key={i}>
            <circle cx={cx} cy={cy} r={8} fill={P} stroke="white" strokeWidth={1.5}/>
            <text x={cx} y={cy+4} fontSize={7} fill="white" textAnchor="middle" fontWeight="bold">{lbl}</text>
            <line x1={cx} y1={cy-8} x2={cx} y2={cy-8-(i===1?50:35)} stroke={P} strokeWidth={1.5}/>
            <line x1={cx} y1={cy-8-(i===1?50:35)} x2={cx+(i<2?30:-30)} y2={cy-8-(i===1?50:35)} stroke={P} strokeWidth={1.5}/>
            <polygon points={`${cx+(i<2?26:-26)},${cy-8-(i===1?50:35)-4} ${cx+(i<2?26:-26)},${cy-8-(i===1?50:35)+4} ${cx+(i<2?34:-34)},${cy-8-(i===1?50:35)}`} fill={P}/>
          </g>
        ))}
        <text x={160} y={155} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">Horizontal stress — stretch defense laterally</text>
      </svg>
    ),
    'presnap_reads': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#f4f4f0" rx="4"/>
        {[0,1,2,3].map(i=><line key={i} x1={0} y1={20+i*32} x2={W} y2={20+i*32} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>)}
        <line x1={0} y1={116} x2={W} y2={116} stroke="rgba(0,0,0,0.35)" strokeWidth={1} strokeDasharray="8,5"/>
        {/* 1-high safety (Cover 1/3) */}
        <text x={80} y={12} fontSize={8} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">1 HIGH = Cover 1/3</text>
        <circle cx={80} cy={32} r={9} fill="#333" stroke="white" strokeWidth={1.5}/>
        <text x={80} y={36} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">S</text>
        <circle cx={40} cy={80} r={8} fill="#555" stroke="white" strokeWidth={1.2}/>
        <text x={40} y={84} fontSize={7} fill="white" textAnchor="middle">CB</text>
        <circle cx={120} cy={80} r={8} fill="#555" stroke="white" strokeWidth={1.2}/>
        <text x={120} y={84} fontSize={7} fill="white" textAnchor="middle">CB</text>
        <line x1={80} y1={12} x2={80} y2={108} stroke="rgba(0,0,0,0.1)" strokeWidth={1} strokeDasharray="3,3"/>
        {/* 2-high safeties (Cover 2/4) */}
        <text x={240} y={12} fontSize={8} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">2 HIGH = Cover 2/4</text>
        <circle cx={210} cy={32} r={9} fill="#333" stroke="white" strokeWidth={1.5}/>
        <text x={210} y={36} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">S</text>
        <circle cx={270} cy={32} r={9} fill="#333" stroke="white" strokeWidth={1.5}/>
        <text x={270} y={36} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">S</text>
        <circle cx={200} cy={80} r={8} fill="#555" stroke="white" strokeWidth={1.2}/>
        <text x={200} y={84} fontSize={7} fill="white" textAnchor="middle">CB</text>
        <circle cx={280} cy={80} r={8} fill="#555" stroke="white" strokeWidth={1.2}/>
        <text x={280} y={84} fontSize={7} fill="white" textAnchor="middle">CB</text>
        <line x1={160} y1={0} x2={160} y2={H} stroke="rgba(0,0,0,0.12)" strokeWidth={1}/>
        {/* QB eye icon */}
        <text x={160} y={130} fontSize={11} textAnchor="middle">👁️</text>
        <text x={160} y={148} fontSize={8} fill={P} textAnchor="middle" fontFamily="sans-serif">QB: Find safeties first, then ID the Mike</text>
      </svg>
    ),
    'zone_blocking': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#f4f4f0" rx="4"/>
        {[0,1,2,3,4].map(i=><line key={i} x1={0} y1={20+i*28} x2={W} y2={20+i*28} stroke="rgba(0,0,0,0.06)" strokeWidth={1}/>)}
        <line x1={0} y1={104} x2={W} y2={104} stroke="rgba(0,0,0,0.35)" strokeWidth={1} strokeDasharray="8,5"/>
        <text x={8} y={101} fontSize={8} fill="rgba(0,0,0,0.3)">LOS</text>
        {/* Zone step arrows — all step right */}
        {[60,100,140,180,220].map((cx,i)=>(
          <g key={i}>
            <rect x={cx-10} y={97} width={20} height={14} fill={P} rx={2}/>
            <text x={cx} y={108} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">{['T','G','C','G','T'][i]}</text>
            <line x1={cx+10} y1={104} x2={cx+22} y2={94} stroke={P} strokeWidth={2}/>
            <polygon points={`${cx+18},${90} ${cx+26},${90} ${cx+26},${98}`} fill={P}/>
          </g>
        ))}
        {/* Defenders */}
        {[80,130,170,210].map((cx,i)=>(
          <circle key={i} cx={cx} cy={82} r={8} fill="none" stroke="#444" strokeWidth={1.5}/>
        ))}
        {/* RB reading the cut */}
        <circle cx={145} cy={130} r={9} fill={P} stroke="white" strokeWidth={1.5}/>
        <text x={145} y={134} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">RB</text>
        <path d="M 145 120 L 145 108 L 175 82" fill="none" stroke={P} strokeWidth={2} strokeDasharray="4,2"/>
        <polygon points={`170,78 180,80 175,88`} fill={P}/>
        <text x={160} y={155} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">All OL step playside → RB reads the cut lane</text>
        <text x={160} y={14} fontSize={9} fill="#5a6480" textAnchor="middle" fontFamily="sans-serif">ZONE BLOCKING — STEP & READ</text>
      </svg>
    ),
    // ── BASKETBALL ─────────────────────────────────────────────────────────────
    'defensive_slide': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#c8904a" rx="4"/>
        <rect x={20} y={10} width={280} height={140} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={1.5}/>
        {/* Player */}
        <circle cx={160} cy={85} r={12} fill={P} stroke="white" strokeWidth={2}/>
        <text x={160} y={89} fontSize={9} fill="white" textAnchor="middle" fontWeight="bold">DEF</text>
        {/* Slide arrows */}
        <path d="M 80 85 L 50 85" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={2}/>
        <polygon points={`54,81 46,85 54,89`} fill="rgba(255,255,255,0.8)"/>
        <path d="M 240 85 L 270 85" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={2}/>
        <polygon points={`266,81 274,85 266,89`} fill="rgba(255,255,255,0.8)"/>
        {/* Feet */}
        <ellipse cx={151} cy={100} rx={6} ry={4} fill="rgba(255,255,255,0.4)"/>
        <ellipse cx={169} cy={100} rx={6} ry={4} fill="rgba(255,255,255,0.4)"/>
        {/* Labels */}
        <text x={160} y={130} fontSize={9} fill="white" textAnchor="middle" opacity={0.9}>Feet never cross · Stay low · Head up</text>
        <text x={160} y={22} fontSize={9} fill="white" textAnchor="middle" opacity={0.8}>DEFENSIVE SLIDE DRILL</text>
      </svg>
    ),
    'pick_roll': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#c8904a" rx="4"/>
        <rect x={20} y={10} width={280} height={140} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={1.5}/>
        <circle cx={160} cy={10} r={8} fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.6)" strokeWidth={1.5}/>
        {/* Ball handler */}
        <circle cx={160} cy={110} r={10} fill={P} stroke="white" strokeWidth={2}/>
        <text x={160} y={114} fontSize={9} fill="white" textAnchor="middle" fontWeight="bold">1</text>
        {/* Screener */}
        <circle cx={160} cy={78} r={10} fill={P} stroke="white" strokeWidth={2}/>
        <text x={160} y={82} fontSize={9} fill="white" textAnchor="middle" fontWeight="bold">5</text>
        {/* Screen icon */}
        <rect x={152} y={60} width={16} height={22} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} strokeDasharray="3,2"/>
        {/* Ball handler drives */}
        <path d="M 160 100 L 200 68" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={2}/>
        <polygon points={`196,64 204,66 200,74`} fill="rgba(255,255,255,0.8)"/>
        {/* Roll */}
        <path d="M 160 68 L 160 40 L 200 40" fill="none" stroke="rgba(245,158,11,0.9)" strokeWidth={2} strokeDasharray="4,2"/>
        <polygon points={`196,36 204,40 196,44`} fill="rgba(245,158,11,0.9)"/>
        <text x={205} y={44} fontSize={8} fill="rgba(245,158,11,0.9)">Roll</text>
        {/* Defender options */}
        <circle cx={130} cy={95} r={8} fill="#333" stroke="white" strokeWidth={1.2}/>
        <text x={130} y={99} fontSize={7} fill="white" textAnchor="middle">D</text>
        <text x={160} y={150} fontSize={8} fill="white" textAnchor="middle" opacity={0.9}>Go over screen or switch — communicate!</text>
      </svg>
    ),
    // ── BASEBALL ───────────────────────────────────────────────────────────────
    'ground_balls': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#2e7d2e" rx="4"/>
        <rect x={100} y={20} width={120} height={120} fill="#c49055" transform="rotate(45,160,80)" rx="2"/>
        <circle cx={160} cy={130} r={6} fill="white" stroke="#888" strokeWidth={1}/>
        <text x={160} y={134} fontSize={6} fill="#333" textAnchor="middle">HP</text>
        <circle cx={205} cy={85} r={6} fill="white" stroke="#888" strokeWidth={1}/>
        <text x={205} y={89} fontSize={6} fill="#333" textAnchor="middle">1B</text>
        <circle cx={160} cy={40} r={6} fill="white" stroke="#888" strokeWidth={1}/>
        <text x={160} y={44} fontSize={6} fill="#333" textAnchor="middle">2B</text>
        <circle cx={115} cy={85} r={6} fill="white" stroke="#888" strokeWidth={1}/>
        <text x={115} y={89} fontSize={6} fill="#333" textAnchor="middle">3B</text>
        {/* Fielder */}
        <circle cx={160} cy={75} r={9} fill={P} stroke="white" strokeWidth={1.5}/>
        <text x={160} y={79} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">SS</text>
        {/* Ground ball */}
        <circle cx={160} cy={110} r={4} fill="white" stroke="#888" strokeWidth={1}/>
        <path d="M 160 110 L 160 84" fill="none" stroke="white" strokeWidth={1.5} strokeDasharray="3,2"/>
        {/* Charge arrow */}
        <path d="M 160 88 L 160 76" fill="none" stroke="rgba(255,200,50,0.9)" strokeWidth={2}/>
        <polygon points={`156,78 164,78 160,70`} fill="rgba(255,200,50,0.9)"/>
        {/* Throw to 1B */}
        <path d="M 160 70 Q 190 60 200 82" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeDasharray="4,2"/>
        <text x={160} y={152} fontSize={8} fill="white" textAnchor="middle" opacity={0.9}>Charge → glove low → field out front → throw</text>
      </svg>
    ),
    // ── SOFTBALL ───────────────────────────────────────────────────────────────
    'windmill': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#2e7d2e" rx="4"/>
        {/* Pitcher rubber */}
        <rect x={145} y={78} width={30} height={8} fill="white" rx={1}/>
        {/* Pitcher */}
        <circle cx={160} cy={68} r={12} fill={P} stroke="white" strokeWidth={2}/>
        <text x={160} y={72} fontSize={9} fill="white" textAnchor="middle" fontWeight="bold">P</text>
        {/* Windmill circle */}
        <circle cx={160} cy={68} r={32} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} strokeDasharray="4,3"/>
        {/* Arm positions */}
        {[[160,36,'12'],[192,68,'3'],[160,100,'6'],[128,68,'9']].map(([px,py,lbl],i)=>(
          <g key={i}>
            <circle cx={px} cy={py} r={4} fill="rgba(255,255,255,0.5)"/>
            <text x={px+8} y={py+4} fontSize={7} fill="rgba(255,255,255,0.7)">{lbl}</text>
          </g>
        ))}
        {/* Release arrow */}
        <path d="M 160 100 L 160 120" fill="none" stroke="rgba(245,158,11,0.9)" strokeWidth={2.5}/>
        <polygon points={`156,118 164,118 160,126`} fill="rgba(245,158,11,0.9)"/>
        <text x={185} y={124} fontSize={8} fill="rgba(245,158,11,0.9)">Snap wrist</text>
        <text x={160} y={148} fontSize={8} fill="white" textAnchor="middle" opacity={0.9}>Full circle → wrist snap at hip → follow through</text>
        <text x={160} y={18} fontSize={9} fill="white" textAnchor="middle" opacity={0.8}>WINDMILL PITCHING</text>
      </svg>
    ),
    // ── SOCCER ─────────────────────────────────────────────────────────────────
    'rondo': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#2e7d2e" rx="4"/>
        {/* Grid */}
        <rect x={80} y={20} width={160} height={120} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}/>
        {/* Outside players */}
        {[[80,20],[240,20],[80,140],[240,140],[160,20],[160,140],[80,80],[240,80]].slice(0,6).map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={10} fill={P} stroke="white" strokeWidth={2}/>
        ))}
        {/* Inside defenders */}
        <circle cx={145} cy={75} r={10} fill="#333" stroke="white" strokeWidth={2}/>
        <circle cx={175} cy={95} r={10} fill="#333" stroke="white" strokeWidth={2}/>
        {/* Pass lines */}
        <line x1={80} y1={20} x2={160} y2={20} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} strokeDasharray="4,3"/>
        <line x1={160} y1={20} x2={240} y2={80} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} strokeDasharray="4,3"/>
        <text x={160} y={155} fontSize={8} fill="white" textAnchor="middle" opacity={0.9}>Keep ball away from defenders · 1-2 touch max</text>
        <text x={160} y={13} fontSize={9} fill="white" textAnchor="middle" opacity={0.8}>RONDO — 4v2 POSSESSION</text>
      </svg>
    ),
    'defensive_shape': (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:'100%', height:'auto', display:'block' }}>
        <rect width={W} height={H} fill="#2e7d2e" rx="4"/>
        <text x={160} y={18} fontSize={9} fill="white" textAnchor="middle" opacity={0.8}>4-4-2 DEFENSIVE SHAPE</text>
        {/* GK */}
        <circle cx={160} cy={148} r={9} fill="#f59e0b" stroke="white" strokeWidth={1.5}/>
        <text x={160} y={152} fontSize={8} fill="white" textAnchor="middle" fontWeight="bold">GK</text>
        {/* 4 defenders */}
        {[60,113,207,260].map((cx,i)=>(
          <circle key={i} cx={cx} cy={122} r={9} fill="#333" stroke="white" strokeWidth={1.5}/>
        ))}
        {/* 4 midfielders */}
        {[60,113,207,260].map((cx,i)=>(
          <circle key={i} cx={cx} cy={88} r={9} fill="#555" stroke="white" strokeWidth={1.5}/>
        ))}
        {/* 2 forwards */}
        {[130,190].map((cx,i)=>(
          <circle key={i} cx={cx} cy={50} r={9} fill={P} stroke="white" strokeWidth={1.5}/>
        ))}
        {/* Compact shape lines */}
        <line x1={40} y1={88} x2={280} y2={88} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4,3"/>
        <line x1={40} y1={122} x2={280} y2={122} stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4,3"/>
        <text x={160} y={155} fontSize={8} fill="white" textAnchor="middle" opacity={0.9}>Stay compact · No gaps between lines</text>
      </svg>
    ),
  }

  // Map COACHING_CONTENT diagram keys to SVG keys
  const KEY_MAP = {
    'The 3-Step Drop': 'three_step_drop',
    'Angle Tackling Drill': 'angle_tackle',
    'Run Blocking Fundamentals': 'run_blocking',
    'Cover 2 Explanation': 'cover_2',
    'Red Zone Mindset': 'redzone',
    'Pre-Snap Reads for QBs': 'presnap_reads',
    'Zone Blocking Scheme': 'zone_blocking',
    'Defensive Slide Drill': 'defensive_slide',
    'Pick and Roll Coverage': 'pick_roll',
    'Fielding Ground Balls': 'ground_balls',
    'Windmill Pitching Mechanics': 'windmill',
    'Rondo Passing Drill': 'rondo',
    'Defensive Shape — 4-4-2': 'defensive_shape',
  }

  const key = KEY_MAP[diagramKey]
  const svg = key ? diagrams[key] : null
  if (!svg) return null

  return (
    <div style={{ marginTop:8, borderRadius:6, overflow:'hidden', border:'1px solid #1e2330' }}>
      {svg}
    </div>
  )
}


function LearnPage({ P='#C0392B', S='#002868', al, sport, iq, setIQ, gauntlets, setGauntlets, callAI, parseJSON, playbook, setPlaybook, setPage, guestMode=false, guestGauntletDone=false, setGuestGauntletDone, onGuestSignUp, initialMode=null }) {
  const [activeMode, setActiveMode] = useState(initialMode)

  const categories = [
    {
      id: 'interactive',
      label: '⚡ Interactive Tools',
      desc: 'Learn by doing — hands-on coaching simulators',
      color: P,
      tools: [
        { id:'playnames',   icon:'✏️', title: sport==='Baseball'||sport==='Softball' ? 'Signal Creator' : 'Play Name Builder', desc:'Build pro-level play calls step by step with live diagrams', tag: sport==='Baseball'||sport==='Softball'?'SIGNAL CREATOR':'INTERACTIVE' },
        { id:'gauntlet',    icon:'⚡', title:'Coaching Gauntlet', desc:'Scenario challenges that test your coaching IQ every session', tag:'IQ: '+iq },
        { id:'situational', icon:'🎯', title:sport==='Football'?'Situational Play Caller':sport==='Basketball'?'Live Game Adjustments':'Count & Situation Advisor', desc:'Real-time AI play recommendations based on score, down, and game situation', tag:'GAME DAY' },
        { id:'film',        icon:'🎥', title:'Film Room', desc:'Upload game footage notes, tag plays, and get AI breakdown of what you see', tag:'ANALYSIS' },
      ]
    },
    {
      id: 'reference',
      label: '📚 Reference & Resources',
      desc: 'Official rules, guides, news, and app resources',
      color: '#6b9fff',
      tools: [
        { id:'rulebook', icon:'📜', title:'Rulebook',       desc:'Official rules for '+sport+' with league search', tag:'RULES' },
        { id:'news',     icon:'📰', title:sport+' News Feed', desc:'Latest '+sport+' coaching tips, drills, and news', tag:'NEWS' },
        { id:'guide',    icon:'📖', title:'Feature Guide',  desc:'Complete walkthrough of every feature in CoachIQ', tag:'GUIDE' },
        { id:'tour',     icon:'🗺️', title:'App Tour',       desc:'Interactive tour of the entire app — great for new coaches', tag:'TOUR' },
        { id:'help',     icon:'❓', title:'Help + FAQ',     desc:'Answers to common questions and detailed feature explanations', tag:'HELP' },
      ]
    },
  ]

  if (activeMode === 'gauntlet') {
    if (guestMode && guestGauntletDone) return (
      <>
        <button onClick={()=>setActiveMode(null)} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'6px 12px', color:'#8a94b0', fontSize:12, cursor:'pointer', marginBottom:12, marginTop:8 }}>← Back to Learn</button>
        <GuestGate feature="Coaching Gauntlet" onSignUp={onGuestSignUp} />
      </>
    )
    return (
      <> <button onClick={()=>setActiveMode(null)} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'6px 12px', color:'#8a94b0', fontSize:12, cursor:'pointer', marginBottom:12, marginTop:8 }}>← Back to Learn</button>
      <GauntletPage P={P} S={S} al={al} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={(n)=>{ setGauntlets(n); if(guestMode && setGuestGauntletDone) setGuestGauntletDone(true) }} callAI={callAI} parseJSON={parseJSON} /> </>
    )
  }
  if (activeMode === 'playnames') return (
    <> <button onClick={()=>setActiveMode(null)} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'6px 12px', color:'#8a94b0', fontSize:12, cursor:'pointer', marginBottom:12, marginTop:8 }}>← Back to Learn</button>
    <PlayNameBuilder P={P} S={S} al={al} sport={sport} /> </>
  )
  if (activeMode === 'film') return (
    <> <button onClick={()=>setActiveMode(null)} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'6px 12px', color:'#8a94b0', fontSize:12, cursor:'pointer', marginBottom:12, marginTop:8 }}>← Back to Learn</button>
    <FilmPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} /> </>
  )
  if (activeMode === 'rulebook') return (
    <> <button onClick={()=>setActiveMode(null)} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'6px 12px', color:'#8a94b0', fontSize:12, cursor:'pointer', marginBottom:12, marginTop:8 }}>← Back to Learn</button>
    <RulebookPage sport={sport} P={P} al={al} callAI={callAI} /> </>
  )
  if (activeMode === 'guide') return ( <FeatureGuide P={P} al={al} onClose={()=>setActiveMode(null)} /> )
  if (activeMode === 'tour')  return ( <QuickTourModal onDone={()=>setActiveMode(null)} P={P} al={al} setPage={setPage} /> )
  if (activeMode === 'help')  return (
    <> <button onClick={()=>setActiveMode(null)} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'6px 12px', color:'#8a94b0', fontSize:12, cursor:'pointer', marginBottom:12, marginTop:8 }}>← Back to Learn</button>
    <HelpPage P={P} al={al} setPage={setPage} sport={sport} /> </>
  )

  return (
    <>
      <div style={{ padding:'14px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#5a6480', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>coaching education</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:24, color:'#dde1f0', lineHeight:1 }}>Learn</div>
      </div>
      {categories.map(cat => (
        <div key={cat.id} style={{ marginBottom:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:cat.color, textTransform:'uppercase', letterSpacing:'1px' }}>{cat.label}</div>
            <div style={{ flex:1, height:1, background:`${cat.color}22` }}/>
          </div>
          <div style={{ fontSize:10, color:'#5a6480', marginBottom:8 }}>{cat.desc}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {cat.tools.map(tool => (
              <div key={tool.id} onClick={()=>tool.id==='news' ? setPage('news') : setActiveMode(tool.id)}
                style={{ padding:'14px 16px', background:'#0f1219', border:`1px solid ${al(cat.color,0.2)}`, borderRadius:6, cursor:'pointer', display:'flex', alignItems:'center', gap:12, borderLeft:`3px solid ${cat.color}` }}
                onMouseEnter={e=>e.currentTarget.style.background=al(cat.color,0.06)}
                onMouseLeave={e=>e.currentTarget.style.background='#0f1219'}
              >
                <span style={{ fontSize:22, flexShrink:0 }}>{tool.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:'#f2f4f8', marginBottom:2 }}>{tool.title}</div>
                  <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.4 }}>{tool.desc}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
                  <span style={{ fontSize:10, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:cat.color, padding:'2px 6px', background:al(cat.color,0.1), borderRadius:3 }}>{tool.tag}</span>
                  <span style={{ fontSize:13, color:'#5a6480' }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
function MorePage({ P='#C0392B', S='#002868', al, cfg, setCfg, brand, setBrand, sport, homeLocation, setHomeLocation, callAI, activeTeam, setTeams, scrollToLocation=false, currentTeam }) {
  const [activeSection, setActiveSection] = useState('features')
  const [helpMode, setHelpMode] = useState(null)
  const locationRef = useRef(null)
  useEffect(() => {
    if (scrollToLocation && locationRef.current) {
      setTimeout(() => locationRef.current.scrollIntoView({ behavior:'smooth', block:'center' }), 200)
    }
  }, [scrollToLocation])
  const colorOptions = {
    primary: ['#C0392B','#E8460C','#D4600A','#1B5E20','#0066CC','#7B1FA2','#C8A400','#1565C0','#880E4F'],
    secondary: ['#002868','#1a3a6b','#37474f','#1B5E20','#4a0070','#1a1a1a','#5c3a00','#004d40','#6b0010'],
  }

  const coachFeatures = [
    { icon:'📊', title:'Advanced Analytics', desc:'Win probability models, tendency heat maps, and opponent pattern recognition across every game.', status:'COMING SOON', color:'#f59e0b' },
    { icon:'📖', title:'Full Play Breakdown', desc:'Every play with audible triggers, pre-snap reads, youth coaching cues, and "what can go wrong" — streaming in real time so you never wait.', status:'COMING SOON', color:'#C0392B' },
    { icon:'📋', title:'Printable Wristbands & Coach Sheets', desc:'Export your playbook into print-ready wristband cards, laminated coach sheets, and game-day checklists.', status:'IN PROGRESS', color:'#4ade80' },
    { icon:'🎥', title:'Film Upload & Breakdown', desc:'Upload full game film and get automatic play-by-play breakdowns, error detection, and opponent scouting.', status:'COMING SOON', color:'#6b9fff' },
    { icon:'🔁', title:'In-Game Adjustment Mode', desc:'Live sideline tool that tracks downs, suggests adjustments, and logs real-time game events.', status:'COMING SOON', color:'#c084fc' },
    { icon:'📆', title:'Practice Planner', desc:'Week-by-week practice schedules tailored to your upcoming opponent and team needs.', status:'COMING SOON', color:'#f59e0b' },
    { icon:'🤝', title:'Coach Network & Play Sharing', desc:'Share packages with other coaches, discover trending schemes, and follow elite youth coordinators.', status:'COMING SOON', color:'#6b9fff' },
    { icon:'🏆', title:'League & Season Manager', desc:'Track standings, schedule games, and manage your full season across multiple teams from one dashboard.', status:'COMING SOON', color:'#f87171' },
    { icon:'🎓', title:'Coaching Certification Path', desc:'Coursework with nationally recognized youth coaching certifications built in.', status:'COMING SOON', color:'#4ade80' },
  ]

  const bpDot = (color) => (
    <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:color, marginRight:5 }} />
  )

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#5a6480', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Platform & settings</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>More</div>
      </div>

      {/* Section switcher */}
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {[['features','🚀 Features'],['rulebook','📜 Rulebook'],['help','❓ Help'],['settings','⚙️ Settings']].map(([k,lbl]) => (
          <button key={k} onClick={()=>setActiveSection(k)} style={{ flex:1, padding:'9px', borderRadius:4, fontSize:11, border:`1px solid ${activeSection===k?P:'#1e2330'}`, background:activeSection===k?al(P,0.15):'transparent', color:activeSection===k?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>{lbl}</button>
        ))}
      </div>

      {activeSection === 'features' && (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ fontSize:10, color:'#8a94b0', lineHeight:1.6, marginBottom:4 }}>CoachIQ is being built for coaches. Here's what's coming next on the roadmap — tap any feature to learn more.</div>
          {coachFeatures.map((f,i) => (
            <div key={i} style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'13px 14px', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ fontSize:26, flexShrink:0, marginTop:2 }}>{f.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4, flexWrap:'wrap' }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:'#f2f4f8' }}>{f.title}</div>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:2, background:`rgba(${parseInt(f.color.slice(1,3),16)},${parseInt(f.color.slice(3,5),16)},${parseInt(f.color.slice(5,7),16)},0.15)`, color:f.color, letterSpacing:'0.5px' }}>{f.status}</span>
                </div>
                <div style={{ fontSize:12, color:'#8a94b0', lineHeight:1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === 'rulebook' && (
        <RulebookPage sport={sport} P={P} al={al} callAI={callAI} />
      )}
      {activeSection === 'help' && (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {helpMode === 'tour' && <QuickTourModal onDone={()=>setHelpMode(null)} P={P} al={al} />}
          {helpMode === 'guide' && <FeatureGuide P={P} al={al} onClose={()=>setHelpMode(null)} />}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:10 }}>
            <div onClick={()=>setHelpMode('tour')} style={{ padding:'18px 12px', background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:6, cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>⚡</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:P, marginBottom:4 }}>Quick Tour</div>
              <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5 }}>6-step walkthrough of every tab</div>
            </div>
            <div onClick={()=>setHelpMode('guide')} style={{ padding:'18px 12px', background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:6, cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📖</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:P, marginBottom:4 }}>Feature Guide</div>
              <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5 }}>Deep dive into every feature</div>
            </div>
          </div>
          <div style={{ padding:'12px 14px', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4 }}>
            <div style={{ fontSize:9, letterSpacing:1.5, color:'#8a94b0', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Feature Overview</div>
            {TUTORIAL_STEPS.map((step,i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<TUTORIAL_STEPS.length-1?'1px solid #1e2330':'none' }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{step.icon}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8', marginBottom:2 }}>{step.title}</div>
                  <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'settings' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Brand / Logo color */}
          <Card>
            <CardHead icon="🎨" title="CoachIQ Logo Style" accent={P} />
            <div style={{ padding:14 }}>
              <div style={{ fontSize:11, color:'#8a94b0', marginBottom:10, lineHeight:1.5 }}>Choose your brand palette for the CoachIQ logo across the app.</div>
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
                      <div style={{ flex:1, fontSize:12, color:'#8a94b0' }}>{palette.name}</div>
                      {brand===key && <span style={{ fontSize:14, color:'#4ade80' }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Personal Colors — fallback when no team selected */}
          <Card>
            <CardHead icon="🎨" title="Your Personal Colors" accent={P} />
            <div style={{ padding:14 }}>
              <div style={{ fontSize:11, color:'#8a94b0', marginBottom:4, lineHeight:1.5 }}>
                These colors appear when no team is selected. When a team is active, that team's colors take over automatically.
              </div>
              <div style={{ fontSize:10, color:P, fontWeight:700, marginBottom:12, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>
                {currentTeam ? `Currently showing: ${currentTeam.name} colors` : 'Currently showing: your personal colors'}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { key:'primary', label:'Primary Color', required:true },
                  { key:'secondary', label:'Secondary Color', required:true },
                  { key:'accent1', label:'Accent 1', required:false },
                  { key:'accent2', label:'Accent 2', required:false },
                ].map(({ key, label, required }) => {
                  const hasValue = cfg[key] && cfg[key] !== ''
                  const isNA = cfg[key] === 'na'
                  return (
                    <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#161922', borderRadius:6, border:'1px solid #1e2330' }}>
                      {!isNA ? (
                        <input type="color" value={hasValue && cfg[key] !== 'na' ? cfg[key] : '#C0392B'} onChange={e=>setCfg(c=>({...c,[key]:e.target.value}))} style={{ width:36, height:36, border:'none', borderRadius:4, cursor:'pointer', padding:0, flexShrink:0 }} />
                      ) : (
                        <div style={{ width:36, height:36, borderRadius:4, background:'#1e2330', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <span style={{ fontSize:9, color:'#5a6480', fontWeight:700 }}>N/A</span>
                        </div>
                      )}
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:11, color:'#f2f4f8', fontWeight:600 }}>{label}</div>
                        <div style={{ fontSize:9, color:'#8a94b0', fontFamily:'monospace' }}>{isNA ? 'Not set' : (cfg[key] || 'Not set')}</div>
                      </div>
                      {!required && (
                        <button onClick={()=>setCfg(c=>({...c,[key]:isNA?'#f59e0b':'na'}))} style={{ padding:'4px 8px', background:'transparent', border:`1px solid ${isNA?'#3d4559':'rgba(239,68,68,0.3)'}`, borderRadius:4, color:isNA?'#6b7a96':'#ef4444', fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, flexShrink:0 }}>
                          {isNA ? 'SET COLOR' : 'N/A'}
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Team Colors — edit active team's colors */}
          {currentTeam && (
            <Card>
              <CardHead icon="🏆" title={`${currentTeam.name} Colors`} accent={P} />
              <div style={{ padding:14 }}>
                <div style={{ fontSize:11, color:'#8a94b0', marginBottom:12, lineHeight:1.5 }}>
                  Edit this team's colors. Changes apply immediately across the app.
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    { key:'primary', label:'Primary Color' },
                    { key:'secondary', label:'Secondary Color' },
                    { key:'accent1', label:'Accent 1' },
                    { key:'accent2', label:'Accent 2' },
                  ].map(({ key, label }) => (
                    <div key={key} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:'#161922', borderRadius:6, border:'1px solid #1e2330' }}>
                      <input type="color" value={currentTeam[key] || '#C0392B'} onChange={e => {
                        const val = e.target.value
                        setTeams(prev => ({
                          ...prev,
                          [sport]: (prev[sport]||[]).map(t => t.id===currentTeam.id ? {...t,[key]:val} : t)
                        }))
                        if (key === 'primary' || key === 'secondary') {
                          setCfg(c => ({...c, [key]:val}))
                        }
                      }} style={{ width:36, height:36, border:'none', borderRadius:4, cursor:'pointer', padding:0, flexShrink:0 }} />
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:11, color:'#f2f4f8', fontWeight:600 }}>{label}</div>
                        <div style={{ fontSize:9, color:'#8a94b0', fontFamily:'monospace' }}>{currentTeam[key] || 'Not set'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Coach Name */}
          <Card>
            <CardHead icon="👤" title="Your Coach Name" accent={P} />
            <div style={{ padding:14 }}>
              <div style={{ fontSize:11, color:'#8a94b0', marginBottom:10, lineHeight:1.5 }}>This appears on your profile and throughout the app.</div>
              <input
                value={cfg.coach||''}
                onChange={e=>setCfg(c=>({...c,coach:e.target.value}))}
                placeholder="e.g. Coach Regisford"
                style={{ width:'100%', background:'#161922', border:`1px solid ${P}`, borderRadius:4, padding:'11px 12px', fontSize:14, color:'#f2f4f8', outline:'none', fontFamily:'inherit' }}
              />
            </div>
          </Card>

          <div ref={locationRef}><Card>
            <CardHead icon="📍" title="My Location" accent={P} />
            <div style={{ padding:14 }}>
              <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5, marginBottom:10 }}>Used for home weather when no team is selected. Auto-detects via GPS or enter manually.</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <AddressSearch
                  value={homeLocation||''}
                  onChange={v=>{ if(setHomeLocation) setHomeLocation(v) }}
                  placeholder="e.g. Tolland, CT or Tolland High School"
                  P={P}
                  al={al}
                />
                <button onClick={()=>{ if(!navigator.geolocation) return; navigator.geolocation.getCurrentPosition(pos=>{ fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+pos.coords.latitude+'&lon='+pos.coords.longitude).then(r=>r.json()).then(d=>{ const a=d.address||{}; const city=a.city||a.town||a.village||''; const state=a.state||''; if(setHomeLocation) setHomeLocation([city,state].filter(Boolean).join(', ')) }) }) }} style={{ padding:'9px 12px', background:al(P,0.15), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:12, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, alignSelf:'flex-start', WebkitTapHighlightColor:'transparent' }}>📍 USE MY LOCATION</button>
              </div>
            </div>
          </Card></div>
          

          {/* App info */}
          <div style={{ padding:'12px 14px', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, textAlign:'center' }}>
            <CoachIQLogo size={20} brand={brand} />
            <div style={{ fontSize:10, color:'#5a6480', marginTop:6 }}>v1.0 · Built for youth coaches</div>
          </div>
        </div>
      )}
    </>
  )
}


// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ P='#C0392B', S='#002868', al, lastName, sport, iq, setIQ, gauntlets, setGauntlets, callAI, parseJSON, brand, teams, setTeams, activeTeam, setActiveTeam, setSport, setCfg, homeLocation, setPage }) {
  const [feed, setFeed] = useState(null)
  const [feedLoading, setFeedLoading] = useState(false)
  const [activeMode, setActiveMode] = useState('dashboard')

  useEffect(() => { if (!feed && !feedLoading) loadFeed() }, [sport])

  async function loadFeed() {
    const cacheKey = 'coachiq_homefeed_'+sport
    const cached = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(cacheKey)
    if (cached) { try { const d=JSON.parse(cached); if(d&&d.items&&d.items.length>0){setFeed(d);return} } catch(e){} }
    setFeedLoading(true)
    try {
      const prompt = 'You are an expert '+sport+' coaching curator for youth coaches at all levels. Generate 6 coaching feed items. Mix these types: drills (with step-by-step instructions), play examples (real formations coaches use), practice plans (short specific drills used by college/NFL coaches), coaching science (research-based findings), and motivational concepts used by elite coaches like Nick Saban, John Wooden, Tony La Russa. EVERY item must be specific to '+sport+'. Each needs a searchQuery for Google and ytSearch for YouTube. Return ONLY valid JSON: {"items":[{"type":"drill","title":"...","body":"specific proven drill with clear instructions in 2-3 sentences","source":"coach or program","searchQuery":"specific google search","ytSearch":"youtube search"},{"type":"play","title":"...","body":"describe a specific formation or play concept and when to use it in 2 sentences","source":"team or coach","searchQuery":"...","ytSearch":"..."},{"type":"practice","title":"...","body":"short specific drill or routine used by a notable '+sport+' coach at any level in 2 sentences","source":"coach name and program","searchQuery":"...","ytSearch":"..."},{"type":"science","title":"...","body":"research finding relevant to youth '+sport+' performance in 2 sentences","source":"institution","searchQuery":"...","ytSearch":"..."},{"type":"concept","title":"...","body":"coaching philosophy or mental approach from an elite '+sport+' coach in 2 sentences","source":"coach name","searchQuery":"...","ytSearch":"..."},{"type":"drill","title":"...","body":"...","source":"...","searchQuery":"...","ytSearch":"..."}]}'
      const raw = await callAI(prompt)
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      const data = JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1))
      if (data && data.items && data.items.length > 0) {
        setFeed(data)
        try { sessionStorage.setItem(cacheKey, JSON.stringify(data)) } catch(e){}
      } else { setFeed(null) }
    } catch(e) { setFeed(null) }
    setFeedLoading(false)
  }

  const feedTypeColor = t => t==='drill'?P:t==='science'?'#6b9fff':t==='play'?'#f59e0b':t==='practice'?'#c084fc':'#4ade80'

  if (activeMode === 'schemes_offense' || activeMode === 'schemes_defense') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'#161922', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#8a94b0', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport} {activeMode==='schemes_offense'?'Offensive':'Defensive'} Schemes</span>
      </div>
      <SchemesPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} playbook={{Football:{},Basketball:{},Baseball:{}}} setPlaybook={()=>{}} genHistory={{Football:[],Basketball:[],Baseball:[]}} setGenHistory={()=>{}} iq={iq} setIQ={setIQ} defaultOpenOff={activeMode==='schemes_offense'} defaultOpenDef={activeMode==='schemes_defense'} />
    </>
  )

  if (activeMode === 'gauntlet') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'#161922', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#8a94b0', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport} Gauntlet</span>
      </div>
      <GauntletPage P={P} S={S} al={al} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} />
    </>
  )

  if (activeMode === 'film') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'#161922', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#8a94b0', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>Film Room</span>
      </div>
      <FilmPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} />
    </>
  )

  if (activeMode === 'situational') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'#161922', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#8a94b0', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport==='Football'?'Situational Play Caller':sport==='Basketball'?'Live Game Adjustments':'Count & Situation Manager'}</span>
      </div>
      <SituationalPanel sport={sport} P={P} S={S} al={al} callAI={callAI} />
    </>
  )

  // DASHBOARD
  return (
    <>
      {/* Team hero card */}
      {(() => {
        const ct = activeTeam[sport]
        const mascotObj = ct ? (MASCOTS||[]).find(m=>m.id===ct.mascot) : null
        const teamFont = ct ? ((TEAM_FONTS||[]).find(f=>f.id===ct.teamFont)?.style||"'Barlow Condensed',sans-serif") : null
        const nextEvt = ct && ct.schedule ? ct.schedule.filter(e => new Date(e.date+'T23:59:59') >= new Date()).sort((a,b) => new Date(a.date)-new Date(b.date))[0] : null
        const awayLoc = nextEvt && nextEvt.homeAway === 'Away' && nextEvt.location ? nextEvt.location : null
        const SPORT_BIG = { Football:'🏈', Basketball:'🏀', Baseball:'⚾' }
        return (
          <div style={{ marginTop:14, borderRadius:4, overflow:'hidden', border:`1px solid ${al(P,0.25)}`, position:'relative', background:ct?`linear-gradient(135deg,${ct.primary}22,${ct.secondary||'#07090d'}33,#07090d)`:'linear-gradient(135deg,#0f1219,#07090d)' }}>
            {/* Color bar */}
            <div style={{ height:3, background:ct?`linear-gradient(90deg,${ct.primary},${ct.secondary||P},${ct.accent1||P},${ct.accent2||P})`:`linear-gradient(90deg,${P},${S})` }} />
            {/* Mascot background — large, centered */}
            {ct && mascotObj && (
              <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', opacity:0.12, pointerEvents:'none', zIndex:0 }}>
                <MascotAvatar mascotId={ct.mascot} color={ct.primary||P} size={100} />
              </div>
            )}
            {!ct && (
              <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', fontSize:50, opacity:0.06, pointerEvents:'none', zIndex:0 }}>{SPORT_BIG[sport]||'🏈'}</div>
            )}
            <div style={{ padding: ct ? '14px 16px' : '10px 16px', display:'flex', alignItems:'center', gap:12, position:'relative', zIndex:1 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:al(P,0.7), letterSpacing:'2px', textTransform:'uppercase', marginBottom:1 }}>Welcome back</div>
                <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:ct?22:20, color:'#f2f4f8', lineHeight:1, marginBottom:ct?3:0 }}>Coach {lastName||'—'}</div>
                {ct && <div style={{ fontFamily:teamFont, fontStyle:'italic', fontSize:13, color:ct.primary, letterSpacing:'0.5px', marginBottom:2 }}>{mascotObj?.emoji} {ct.name}</div>}
                {ct?.season && <div style={{ fontSize:9, color:'#5a6480', fontFamily:"'Barlow Condensed',sans-serif" }}>{ct.season}{ct.hometown?' · '+ct.hometown:''}</div>}
              </div>
              <RotatingInfoWidget
                sport={sport}
                homeLocation={ct ? ct.hometown : homeLocation}
                awayLocation={awayLoc}
                nextEvent={nextEvt}
                P={P}
                al={al}
                onSetLocation={()=>{ setPage('more'); setScrollToLocation(true); setTimeout(()=>setScrollToLocation(false),1000) }}
              />
            </div>
          </div>
        )
      })()}

      {/* Ticker */}
      <div style={{ background:'#0a0c14', display:'flex', alignItems:'center', overflow:'hidden', borderTop:'1px solid #0e1220', borderBottom:'1px solid #0e1220', height:26, margin:'0 -14px' }}>
        <div style={{ background:P, padding:'0 10px 0 14px', height:'100%', display:'flex', alignItems:'center', flexShrink:0, clipPath:'polygon(0 0,100% 0,calc(100% - 6px) 100%,0 100%)' }}><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:'white', letterSpacing:'1.5px' }}>LIVE</span></div>
        <div style={{ overflow:'hidden', flex:1, paddingLeft:8 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4a5470', whiteSpace:'nowrap', animation:'ticker 90s linear infinite', letterSpacing:'0.5px' }}>{feed&&feed.items?.length>0?feed.items.map(i=>`${i.title}: ${i.body}`).join(' · '):`🏈 CoachIQ — Prepare. Lead. Inspire. · Generate schemes · Scout opponents · Build your playbook`}</div></div>
      </div>

      {/* Next Event Card — only shown when there's an upcoming event */}
      {(() => {
        const ct = activeTeam[sport]
        if (!ct) return null
        const upcoming = (ct.schedule||[]).filter(e => new Date(e.date+'T23:59:59') >= new Date()).sort((a,b) => new Date(a.date)-new Date(b.date))
        const next = upcoming[0]
        if (!next) return null
        const msUntil = new Date(next.date+'T'+(next.time||'12:00')+':00') - new Date()
        const daysUntil = Math.ceil(msUntil / (1000*60*60*24))
        const hoursUntil = Math.ceil(msUntil / (1000*60*60))
        const countdown = hoursUntil <= 24 ? (hoursUntil <= 1 ? 'Starting soon!' : `${hoursUntil}h away`) : (daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`)
        const isUrgent = hoursUntil <= 48
        const typeColor = { Game:P, Practice:'#4ade80', Scrimmage:'#f59e0b', Tournament:'#c084fc' }[next.type] || P
        const typeIcon = { Game:'🏆', Practice:'📋', Scrimmage:'⚡', Tournament:'🥇' }[next.type] || '📅'
        const rsvpColor = { yes:'#4ade80', maybe:'#f59e0b', no:'#e74c3c' }[next.rsvp]
        return (
          <div onClick={()=>setPage('team')} style={{ marginTop:12, background:isUrgent?`linear-gradient(135deg,${typeColor}18,#0d1117)`:'#0d1117', border:`1px solid ${al(typeColor, isUrgent?0.5:0.25)}`, borderRadius:8, padding:'12px 14px', cursor:'pointer', position:'relative', overflow:'hidden' }}>
            {isUrgent && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${typeColor},transparent)` }} />}
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ fontSize:24, flexShrink:0 }}>{typeIcon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9, color:typeColor, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:2 }}>{next.type.toUpperCase()} · {next.homeAway?.toUpperCase()}</div>
                <div style={{ fontSize:15, fontWeight:700, color:'#f2f4f8', lineHeight:1.1, marginBottom:2 }}>{next.opponent || next.type}</div>
                <div style={{ fontSize:10, color:'#8a94b0' }}>
                  {new Date(next.date+'T12:00:00').toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}
                  {next.time && ' · ' + next.time}
                  {next.location && ' · 📍 ' + next.location.split(',')[0]}
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:18, color:isUrgent?typeColor:'#f2f4f8', lineHeight:1 }}>{countdown}</div>
                {rsvpColor && <div style={{ fontSize:10, color:rsvpColor, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginTop:2 }}>{next.rsvp==='yes'?'✓ Going':next.rsvp==='no'?'✗ Out':'? Maybe'}</div>}
                {upcoming.length > 1 && <div style={{ fontSize:10, color:'#5a6480', marginTop:2 }}>+{upcoming.length-1} more</div>}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Team Manager Card */}
      <TeamManagerCard
        sport={sport}
        teams={teams}
        setTeams={setTeams}
        activeTeam={activeTeam}
        setActiveTeam={setActiveTeam}
        P={P}
        al={al}
        setCfg={setCfg}
        onOpenTeamTab={()=>setPage('team')}
      />

            {/* Scheme Generator Card — interactive preview */}
      <div style={{ marginTop:14 }}>
        <div onClick={()=>setActiveMode('schemes_offense')} style={{ background:'linear-gradient(135deg,#180303,#220606)', border:'1px solid rgba(192,57,43,0.3)', borderRadius:4, padding:'16px', position:'relative', overflow:'hidden', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:20, color:'#dde1f0', lineHeight:1, marginBottom:4 }}>Scheme Generator</div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12, color:'rgba(255,255,255,0.55)', lineHeight:1.5, maxWidth:200 }}>Build plays your athletes <span style={{ color:'#C0392B', fontWeight:600 }}>actually understand</span> — animated diagrams and coaching cues built in.</div>
            </div>
            <div style={{ display:'flex', gap:6, flexDirection:'column', alignItems:'flex-end' }}>
              <div onClick={()=>setActiveMode('schemes_offense')} style={{ background:'#C0392B', padding:'4px 10px', borderRadius:2, clipPath:'polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)', cursor:'pointer' }}><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, color:'white', letterSpacing:'1px' }}>OPEN →</span></div>
            </div>
          </div>
          {/* Interactive mini diagrams — click to navigate */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:10 }}>
            <div onClick={e=>{e.stopPropagation();setActiveMode('schemes_offense')}} style={{ background:'rgba(0,0,0,0.3)', borderRadius:6, overflow:'hidden', border:`1px solid ${al(P,0.2)}`, position:'relative', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:5, left:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:P, letterSpacing:'1px', zIndex:1 }}>OFFENSE ›</div>
              <div style={{ height:64, display:'flex', alignItems:'center', justifyContent:'center', padding:'4px', overflow:'hidden' }}><SchemePreviewMini type="offense" P={P} sport={sport} /></div>
            </div>
            <div onClick={e=>{e.stopPropagation();setActiveMode('schemes_defense')}} style={{ background:'rgba(0,0,0,0.3)', borderRadius:6, overflow:'hidden', border:'1px solid rgba(107,154,255,0.2)', position:'relative', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:5, left:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, fontWeight:700, color:'#6b9fff', letterSpacing:'1px', zIndex:1 }}>DEFENSE ›</div>
              <div style={{ height:64, display:'flex', alignItems:'center', justifyContent:'center', padding:'4px', overflow:'hidden' }}><SchemePreviewMini type="defense" P={P} sport={sport} /></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {['AI Diagrams','Educator Mode','Pro Comparison','Huddle Cards','Variations'].map(tag => (<span key={tag} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, padding:'2px 8px', background:'rgba(192,57,43,0.1)', borderLeft:'2px solid rgba(192,57,43,0.3)', color:'rgba(192,57,43,0.7)', letterSpacing:'0.5px' }}>{tag}</span>))}
          </div>
        </div>
      </div>

      {/* Quick access grid */}
      <div style={{ marginTop:8, display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:7 }}>
        <div onClick={()=>setActiveMode('gauntlet')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'12px', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}><span style={{ fontSize:16 }}>⚡</span><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0' }}>Gauntlet</div></div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'#4a5470', lineHeight:1.4, marginBottom:8 }}>Test your coaching IQ with live AI scenarios</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}><span style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:20, color:'#f59e0b', lineHeight:1 }}>{iq}</span><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:'#5a6480', textTransform:'uppercase' }}>IQ</span></div>
        </div>
        <div onClick={()=>setActiveMode('situational')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'12px', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}><span style={{ fontSize:16 }}>🎯</span><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0' }}>Situational</div></div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'#4a5470', lineHeight:1.4, marginBottom:8 }}>Real-time play calls by down, distance & score</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4ade80', fontWeight:700 }}>{sport==='Basketball'?'Live adjustments':sport==='Baseball'?'Count manager':'Live play caller'}</div>
        </div>
      </div>
      <div style={{ marginTop:7 }}>
        <div onClick={()=>setActiveMode('film')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'11px 14px', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
          <span style={{ fontSize:16 }}>🎥</span>
          <div style={{ flex:1 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0' }}>Film Room</div><div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'#4a5470' }}>Describe a problem or upload a clip — AI diagnoses it</div></div>
          <div style={{ fontSize:12, color:'#5a6480' }}>›</div>
        </div>
      </div>

      {/* Coaching Feed */}
      <div style={{ marginTop:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <div style={{ width:3, height:10, background:'#4ade80', transform:'skewX(-15deg)', flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:'2px', textTransform:'uppercase', color:'#4ade80' }}>Coaching Feed</span>
          <button onClick={loadFeed} style={{ marginLeft:'auto', fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#8a94b0', background:'#161922', border:'0.5px solid #1e2330', borderRadius:2, padding:'2px 8px', cursor:'pointer' }}>Refresh</button>
        </div>
        {feedLoading && <div style={{ padding:'16px', background:'#0f1219', borderRadius:4, border:'0.5px solid #1e2330', textAlign:'center' }}><div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 6px' }} /><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:'#8a94b0' }}>Loading {sport} coaching feed...</div></div>}
        {!feedLoading && !feed && <div style={{ padding:'20px', background:'#0f1219', borderRadius:4, border:'0.5px solid #1e2330', textAlign:'center' }}><div style={{ fontSize:11, color:'#5a6480', marginBottom:10 }}>Coaching content for {sport} coaches</div><button onClick={loadFeed} style={{ padding:'7px 16px', background:P, border:'none', borderRadius:4, color:'white', fontSize:12, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'1px' }}>LOAD FEED</button></div>}
        {feed && (feed.items||[]).map((item,i) => (
          <div key={i} style={{ background:'#0f1219', border:'0.5px solid #1e2330', borderRadius:4, padding:'10px 12px', marginBottom:7, borderLeft:`2px solid ${feedTypeColor(item.type)}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, color:feedTypeColor(item.type), textTransform:'uppercase', letterSpacing:'1px' }}>{item.type==='drill'?'Drill of the Day':item.type==='science'?'Coaching Science':item.type==='play'?'Play Concept':item.type==='practice'?'Practice Drill':'Coaching Concept'}</span>
              {item.source && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:'#5a6480' }}>· {item.source}</span>}
            </div>
            <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.6 }}>{item.body}</div>
            <div style={{ display:'flex', gap:6, marginTop:6, flexWrap:'wrap' }}>
              {item.searchQuery && <a href={'https://www.google.com/search?q='+encodeURIComponent(item.searchQuery+' coaching')} target="_blank" rel="noopener noreferrer" style={{ fontSize:9, color:'#6b9fff', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, padding:'2px 7px', background:'rgba(107,154,255,0.1)', borderRadius:3, border:'1px solid rgba(107,154,255,0.2)', textDecoration:'none' }}>🔍 Read more</a>}
              {item.ytSearch && <a href={'https://www.youtube.com/results?search_query='+encodeURIComponent(item.ytSearch+' '+sport)} target="_blank" rel="noopener noreferrer" style={{ fontSize:9, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, padding:'2px 7px', background:'rgba(239,68,68,0.1)', borderRadius:3, border:'1px solid rgba(239,68,68,0.2)', textDecoration:'none' }}>▶ Watch</a>}
            </div>
          </div>
        ))}
      </div>
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
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; } :root { color-scheme: dark; background-color: #07090d; } body { background-color: #07090d !important; overflow-x:hidden; min-height:100vh; min-height:-webkit-fill-available; } html { background-color: #07090d !important; color-scheme: dark; } html, body { background-color: #07090d !important; } #__next { background-color: #07090d; overflow-x:hidden; } @media all { :root { background-color: #07090d !important; color-scheme: dark !important; } }
        @keyframes float1 { 0%,100%{transform:translate(0,0) rotate(-22deg)} 33%{transform:translate(12px,-18px) rotate(-15deg)} 66%{transform:translate(-8px,10px) rotate(-28deg)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-14px,12px)} 75%{transform:translate(10px,-8px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0) rotate(12deg)} 40%{transform:translate(16px,-10px) rotate(20deg)} 80%{transform:translate(-6px,14px) rotate(6deg)} }
        @keyframes float4 { 0%,100%{transform:translate(0,0) rotate(10deg)} 50%{transform:translate(-10px,-16px) rotate(18deg)} }
        @keyframes float5 { 0%,100%{transform:translate(0,0)} 30%{transform:translate(8px,12px)} 70%{transform:translate(-12px,-6px)} }
        @keyframes float6 { 0%,100%{transform:translate(0,0)} 45%{transform:translate(14px,8px)} }
        @keyframes float7 { 0%,100%{transform:translate(0,0) rotate(-5deg)} 35%{transform:translate(-16px,6px) rotate(-12deg)} 70%{transform:translate(8px,-10px) rotate(0deg)} }
        @keyframes logoReveal { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes ctaReveal { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes qbThrow {
          0%   { transform: translate(-80px, 120px) scale(0.25) rotate(-30deg); opacity:0; }
          15%  { opacity:1; }
          45%  { transform: translate(20px, -30px) scale(1.15) rotate(340deg); opacity:1; }
          60%  { transform: translate(0px, 8px) scale(0.95) rotate(360deg); opacity:1; }
          72%  { transform: translate(0px, -4px) scale(1.02) rotate(360deg); opacity:1; }
          82%  { transform: translate(0px, 0px) scale(1.0) rotate(360deg); opacity:1; }
          100% { transform: translate(0px, 0px) scale(1.0) rotate(360deg); opacity:1; }
        }
        @keyframes splashFadeOut {
          0%   { opacity:1; }
          100% { opacity:0; }
        }
        @keyframes splashTextIn {
          0%   { opacity:0; transform:translateY(8px); }
          100% { opacity:1; transform:translateY(0); }
        }
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
      <div style={{ position:'relative', zIndex:2, textAlign:'center', animation:'qbThrow 1.4s cubic-bezier(0.22,0.61,0.36,1) forwards', marginBottom: phase === 'cta' ? 40 : 0 }}>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:64, lineHeight:1, letterSpacing:'-1px', marginBottom:10 }}>
          <span style={{ color:cC }}>C</span>
          <span style={{ color:cOach }}>oach</span>
          <span style={{ color:cIQ }}>IQ</span>
        </div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, letterSpacing:'5px', color:'#5a6480', textTransform:'uppercase' }}>Prepare. Lead. Inspire.</div>
      </div>

      {phase === 'cta' && (
        <div style={{ position:'relative', zIndex:2, width:'100%', maxWidth:380, display:'flex', flexDirection:'column', gap:10, animation:'ctaReveal 0.4s ease forwards' }}>
          <button onClick={() => onDone(false)} style={{ width:'100%', background:accent, border:'none', borderRadius:4, padding:'15px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'2px', color:'white', cursor:'pointer', textTransform:'uppercase' }}>Get Started — Free</button>
          <button onClick={() => onDone(false)} style={{ width:'100%', background:'#161922', border:'1px solid #1c2235', borderRadius:4, padding:'14px', fontFamily:"'DM Sans',sans-serif", fontSize:13, color:'#6b7896', cursor:'pointer' }}>Sign In</button>
          <div style={{ textAlign:'center', paddingTop:4 }}>
            <span onClick={() => onDone(true)} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, color:accent, fontWeight:600, cursor:'pointer', letterSpacing:'0.5px' }}>Preview first →</span>
          </div>
        </div>
      )}
    </div>
  )
}

function Onboarding({ onLaunch, onBack, brand='Red — C+IQ colored' }) {
  const [coachName, setCoachName] = useState('')
  const [step, setStep] = useState(1)
  const [philosophy, setPhilosophy] = useState({ priority:'Player development', measure:'Growth', who:'Mixed experience' })
  const p = BRAND_PALETTES[brand] || BRAND_PALETTES['Red — C+IQ colored']
  const accent = p.accent
  const CIQ = p.accentOn === 'CIQ'
  const cC = CIQ ? p.accent : '#f2f4f8'
  const cOach = CIQ ? '#f2f4f8' : p.accent
  const cIQ = CIQ ? p.accent : '#f2f4f8'

  function handleStart() {
    if (!coachName.trim()) return
    setStep(2)
  }

  function handleLaunch() {
    onLaunch({ coach: coachName.trim() || 'Coach', team:'', primary:'#C0392B', secondary:'#002868', sport:'Football', philosophy })
  }

  const PhilQ = ({ label, options, value, onChange }) => (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'2px', textTransform:'uppercase', color:'#8a94b0', marginBottom:8 }}>{label}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {options.map(opt => (
          <button key={opt} onClick={()=>onChange(opt)} style={{ width:'100%', padding:'10px 14px', background:value===opt?accent:'#161922', border:`1px solid ${value===opt?accent:'#1e2330'}`, borderRadius:6, color:value===opt?'white':'#9aa0b0', fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:'pointer', textAlign:'left', transition:'all 0.15s' }}>
            {value===opt ? '→ ' : ''}{opt}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, background:'#07090d', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 28px', fontFamily:"'DM Sans',sans-serif", overflowY:'auto' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@700&family=Barlow+Condensed:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap'); * { box-sizing:border-box; margin:0; padding:0; }`}</style>

      {/* Back button */}
      <button onClick={step===1?onBack:()=>setStep(1)} style={{ position:'absolute', top:20, left:20, background:'transparent', border:'none', color:'#5a6480', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:'1px', cursor:'pointer', display:'flex', alignItems:'center', gap:6, padding:'8px 4px' }}>
        ← Back
      </button>

      <div style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:40, lineHeight:1, marginBottom:8 }}>
          <span style={{ color:cC }}>C</span><span style={{ color:cOach }}>oach</span><span style={{ color:cIQ }}>IQ</span>
        </div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:'4px', color:'#5a6480', textTransform:'uppercase' }}>
          {step===1 ? 'Set up your profile' : 'Join the community'}
        </div>
        {step===2 && <div style={{ fontSize:11, color:'#5a6480', marginTop:6, maxWidth:280, margin:'6px auto 0' }}>This stays private. It helps CoachIQ understand what matters to you.</div>}
      </div>

      <div style={{ width:'100%', maxWidth:380 }}>
        {step === 1 ? (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'2px', textTransform:'uppercase', color:'#8a94b0', marginBottom:6 }}>Your name</div>
              <input value={coachName} onChange={e=>setCoachName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleStart()} placeholder="e.g. Coach Regisford" style={{ width:'100%', background:'#161922', border:`1px solid ${accent}`, borderRadius:4, padding:'13px 14px', fontSize:14, color:'#f2f4f8', outline:'none', fontFamily:'inherit' }} />
            </div>
            <button onClick={handleStart} disabled={!coachName.trim()} style={{ width:'100%', background:coachName.trim()?accent:'#3d4559', border:'none', borderRadius:4, padding:'14px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'2px', color:'white', cursor:coachName.trim()?'pointer':'not-allowed', textTransform:'uppercase', marginTop:6 }}>Next →</button>
            <div style={{ textAlign:'center' }}><span style={{ fontSize:11, color:'#5a6480' }}>You can create and manage teams from the home screen</span></div>
            <div style={{ textAlign:'center', paddingTop:4 }}>
              <span onClick={()=>onLaunch({ guest:true, sport:'Football' })} style={{ fontSize:11, color:'#5a6480', cursor:'pointer', letterSpacing:'0.5px' }}>Just exploring → limited access</span>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'2px', textTransform:'uppercase', color:'#8a94b0', marginBottom:10 }}>What matters most to you as a coach?</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  { val:'Player development', emoji:'🏆', count:'1,247' },
                  { val:'Having fun', emoji:'😄', count:'891' },
                  { val:'Building confidence', emoji:'💪', count:'634' },
                  { val:'Winning', emoji:'🥇', count:'503' },
                  { val:'A mix of all four', emoji:'⚖️', count:'728' },
                ].map(opt => (
                  <button key={opt.val} onClick={()=>setPhilosophy(p=>({...p,priority:opt.val}))} style={{ width:'100%', padding:'10px 14px', background:philosophy.priority===opt.val?accent:'#161922', border:`1px solid ${philosophy.priority===opt.val?accent:'#1e2330'}`, borderRadius:6, color:philosophy.priority===opt.val?'white':'#9aa0b0', fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', textAlign:'left' }}>
                    <span>{philosophy.priority===opt.val?'→ ':''}{opt.emoji} {opt.val}</span>
                    <span style={{ fontSize:10, opacity:0.55, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.5px' }}>{opt.count} coaches</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'2px', textTransform:'uppercase', color:'#8a94b0', marginBottom:10 }}>Who are you coaching?</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  { val:'First-timers / Brand new', emoji:'🌱', count:'412' },
                  { val:'Mixed experience levels', emoji:'🔄', count:'728' },
                  { val:'Competitive / Experienced', emoji:'🔥', count:'503' },
                ].map(opt => (
                  <button key={opt.val} onClick={()=>setPhilosophy(p=>({...p,who:opt.val}))} style={{ width:'100%', padding:'10px 14px', background:philosophy.who===opt.val?accent:'#161922', border:`1px solid ${philosophy.who===opt.val?accent:'#1e2330'}`, borderRadius:6, color:philosophy.who===opt.val?'white':'#9aa0b0', fontFamily:"'DM Sans',sans-serif", fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', textAlign:'left' }}>
                    <span>{philosophy.who===opt.val?'→ ':''}{opt.emoji} {opt.val}</span>
                    <span style={{ fontSize:10, opacity:0.55, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.5px' }}>{opt.count} coaches</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleLaunch} disabled={!philosophy.priority||!philosophy.who} style={{ width:'100%', background:philosophy.priority&&philosophy.who?accent:'#3d4559', border:'none', borderRadius:4, padding:'14px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, letterSpacing:'2px', color:'white', cursor:philosophy.priority&&philosophy.who?'pointer':'not-allowed', textTransform:'uppercase' }}>Enter CoachIQ</button>
          </div>
        )}
      </div>
    </div>
  )
}


// ─── C·IQ HUB PAGE ────────────────────────────────────────────────────────────
function HubPage({ P='#C0392B', S='#002868', al, sport, cfg, teams, activeTeam, genHistory, playbook, iq, setPage, setActiveMode, setLearnMode, callAI, homeLocation, setTeams, guestMode=false, guestDemoTeam, setGuestDemoTeam, onGuestSignUp }) {
  const currentTeam = (teams[sport]||[]).find(t=>t.id===activeTeam[sport]?.id) || activeTeam[sport]
  const gameHistory = currentTeam?.gameHistory || []
  const practicePlans = currentTeam?.practicePlans || []
  const schedule = currentTeam?.schedule || []
  const sportGenHistory = genHistory[sport] || []

  // Stats
  const wins = gameHistory.filter(g=>g.us>g.them).length
  const losses = gameHistory.filter(g=>g.us<=g.them).length
  const record = gameHistory.length > 0 ? `${wins}-${losses}` : '0-0'
  const ppg = gameHistory.length > 0 ? Math.round(gameHistory.reduce((s,g)=>s+g.us,0)/gameHistory.length) : null
  const papg = gameHistory.length > 0 ? Math.round(gameHistory.reduce((s,g)=>s+g.them,0)/gameHistory.length) : null
  const offSchemes = sportGenHistory.filter(h=>h.plays&&h.plays.length)
  const defSchemes = sportGenHistory.filter(h=>h.formations&&h.formations.length)
  const lastOffScheme = offSchemes[0]?.packageName || null
  const lastDefScheme = defSchemes[0]?.packageName || null
  const totalPlays = Object.values(playbook[sport]||{}).reduce((s,folder)=>s+(folder?.length||0),0)
  const now = new Date()
  const upcoming = schedule.filter(e=>new Date(e.date+'T23:59:59')>=now).sort((a,b)=>new Date(a.date)-new Date(b.date))
  const nextGame = upcoming.find(e=>e.type==='Game')
  const nextPractice = upcoming.find(e=>e.type==='Practice')
  const nextEvent = upcoming[0]
  const lastPlan = practicePlans[0]
  const daysSincePractice = lastPlan ? Math.floor((now-new Date(lastPlan.id))/(1000*60*60*24)) : null
  const nextOpponent = nextGame?.opponent || null
  const coachName = cfg?.coach || 'Coach'

  function daysUntil(dateStr) {
    if (!dateStr) return null
    const diff = Math.ceil((new Date(dateStr+'T23:59:59')-now)/(1000*60*60*24))
    return diff <= 0 ? 'Today' : diff === 1 ? '1d' : diff+'d'
  }

  // Greeting logic — updated with team-aware messaging
  function getGreeting() {
    const nextGameDays = nextGame ? Math.ceil((new Date(nextGame.date+'T23:59:59')-now)/(1000*60*60*24)) : null
    if (!currentTeam) return { label:'Welcome, Coach', msg:'Create a team to get started. Then add your schedule, roster, and build your first scheme.', btn1:{ label:'CREATE TEAM', action:()=>setPage('team') }, btn2:{ label:'EXPLORE SCHEMES', action:()=>{ setPage('schemes'); setActiveMode('schemes_offense') } } }
    if (nextGameDays !== null && nextGameDays <= 0) return { label:'Game day', msg:'It\'s game day, Coach. You\'ve prepared. Trust your players.', btn1:{ label:'SCORING', action:()=>setPage('team') }, btn2:{ label:'LINEUP', action:()=>setPage('team') } }
    if (nextGameDays !== null && nextGameDays <= 2) return { label:`${nextGameDays}d to game day`, msg:'Almost time. Is your scheme locked in and your lineup set?', btn1:{ label:'VIEW SCHEME', action:()=>{ setPage('schemes'); setActiveMode('schemes_offense') } }, btn2:{ label:'LINEUP', action:()=>setPage('team') } }
    if (nextGameDays !== null && nextGameDays <= 5) return { label:`${nextGameDays}d to game day`, msg:'Game week. Great time to run your scheme and build a practice plan.', btn1:{ label:'SCHEMES', action:()=>{ setPage('schemes'); setActiveMode('schemes_offense') } }, btn2:{ label:'PRACTICE', action:()=>setPage('team') } }
    if (!nextGame && schedule.length === 0) return { label:'Add your schedule', msg:'Add your schedule after creating a team. Great time to explore a new scheme or run the Gauntlet.', btn1:{ label:'ADD SCHEDULE', action:()=>setPage('team') }, btn2:{ label:'EXPLORE SCHEMES', action:()=>{ setPage('schemes'); setActiveMode('schemes_offense') } } }
    if (nextPractice) return { label:'Practice coming up', msg:'Have you built your practice plan yet? Sharp practices make sharp teams.', btn1:{ label:'PRACTICE PLAN', action:()=>setPage('team') }, btn2:{ label:'SCHEMES', action:()=>{ setPage('schemes'); setActiveMode('schemes_offense') } } }
    return { label:'Keep building', msg:'No game on the calendar. Great time to explore a new scheme, review your playbook, or run the Gauntlet.', btn1:{ label:'EXPLORE SCHEMES', action:()=>{ setPage('schemes'); setActiveMode('schemes_offense') } }, btn2:{ label:'GAUNTLET', action:()=>{ setPage('learn'); setActiveMode('gauntlet') } } }
  }

  const [showGreeting, setShowGreeting] = useState(true)
  const [weatherData, setWeatherData] = useState(null)
  const [weatherExpanded, setWeatherExpanded] = useState(false)
  const [weatherAction, setWeatherAction] = useState(null) // 'indoor'|'postpone'|'cancel'
  const [postponeDate, setPostponeDate] = useState('')
  const greeting = getGreeting()

  // Weather fetch for hub — debounced + cached
  useEffect(() => {
    if (!homeLocation) return
    const cacheKey = 'coachiq_wx_' + homeLocation.trim().toLowerCase().slice(0,30)
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) { const d = JSON.parse(cached); if (Date.now()-d.ts < 30*60*1000) { setWeatherData(d.data); return } }
    } catch(e) {}
    const timer = setTimeout(async () => {
      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(homeLocation)}&limit=1`)
        const geoData = await geoRes.json()
        if (!geoData[0]) return
        const { lat, lon } = geoData[0]
        const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m,precipitation_probability&daily=weathercode,precipitation_probability_max,windspeed_10m_max,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7&temperature_unit=fahrenheit&windspeed_unit=mph`)
        const wx = await wxRes.json()
        const data = { current: wx.current, daily: wx.daily, lat, lon }
        setWeatherData(data)
        try { sessionStorage.setItem(cacheKey, JSON.stringify({ data, ts:Date.now() })) } catch(e) {}
      } catch(e) {}
    }, 600)
    return () => clearTimeout(timer)
  }, [homeLocation])

  // Weather code to description
  function wxDesc(code) {
    if (code === 0) return 'Clear'
    if (code <= 3) return 'Partly cloudy'
    if (code <= 48) return 'Foggy'
    if (code <= 57) return 'Drizzle'
    if (code <= 67) return 'Rain'
    if (code <= 77) return 'Snow'
    if (code <= 82) return 'Showers'
    if (code <= 86) return 'Snow showers'
    if (code <= 99) return 'Thunderstorm'
    return 'Unknown'
  }

  function wxEmoji(code) {
    if (code === 0) return '☀️'
    if (code <= 3) return '⛅'
    if (code <= 48) return '🌫️'
    if (code <= 57) return '🌦️'
    if (code <= 67) return '🌧️'
    if (code <= 77) return '❄️'
    if (code <= 82) return '🌧️'
    if (code <= 86) return '🌨️'
    if (code <= 99) return '⛈️'
    return '🌡️'
  }

  // Sport-specific weather thresholds and indoor labels
  const sportWeatherConfig = {
    Football:   { threshold:65, lightRainOk:true,  indoorLabel:'Move to Indoor Turf / Facility', indoorNote:'Most football drills can continue on indoor turf.', cancelBias:'low' },
    Basketball: { threshold:100, lightRainOk:true, indoorLabel:'Already indoors — notify travel concerns', indoorNote:'Basketball is indoors. Check travel conditions for away games.', cancelBias:'none' },
    Baseball:   { threshold:40, lightRainOk:false, indoorLabel:'Move to Batting Cages / Indoor Facility', indoorNote:'Wet fields affect footing and ball grip. Move hitting/fielding drills to cages.', cancelBias:'high' },
    Soccer:     { threshold:45, lightRainOk:false, indoorLabel:'Move to Indoor Turf / Gymnasium', indoorNote:'Lightning on open fields is mandatory evacuation. Check lightning alerts.', cancelBias:'high' },
    Softball:   { threshold:40, lightRainOk:false, indoorLabel:'Move to Batting Cages / Indoor Facility', indoorNote:'Wet infields are hazardous. Move to batting cages or covered facility.', cancelBias:'high' },
  }
  const wxCfg = sportWeatherConfig[sport] || sportWeatherConfig.Football

  // Get weather prediction for next event
  function getEventWeatherPrediction() {
    if (!weatherData || !nextEvent) return null
    const eventDate = new Date(nextEvent.date+'T12:00:00')
    const today = new Date(); today.setHours(0,0,0,0)
    const dayIndex = Math.round((eventDate-today)/(1000*60*60*24))
    if (dayIndex < 0 || dayIndex >= 7) return null
    const daily = weatherData.daily
    const code = daily.weathercode[dayIndex]
    const precip = daily.precipitation_probability_max[dayIndex]
    const wind = daily.windspeed_10m_max[dayIndex]
    const maxTemp = daily.temperature_2m_max[dayIndex]
    const minTemp = daily.temperature_2m_min[dayIndex]
    const isThunder = code >= 95
    const isHeavyRain = code >= 61 && code <= 67
    const isAnyRain = code >= 51 && code <= 82
    const isSnow = code >= 71 && code <= 77
    let risk = 'low', riskLabel = '✓ Good conditions', riskColor = '#4ade80'
    if (isThunder) { risk = 'high'; riskLabel = '⚠️ Thunderstorm — likely impacted'; riskColor = '#ef4444' }
    else if (isSnow) { risk = 'high'; riskLabel = '⚠️ Snow expected — likely impacted'; riskColor = '#ef4444' }
    else if (isHeavyRain && !wxCfg.lightRainOk) { risk = 'high'; riskLabel = '⚠️ Heavy rain — likely impacted'; riskColor = '#f59e0b' }
    else if (isAnyRain && precip > wxCfg.threshold) { risk = 'medium'; riskLabel = '⚠️ Rain possible — may be affected'; riskColor = '#f59e0b' }
    else if (wind > 25 && sport === 'Football') { risk = 'low'; riskLabel = '🏈 High wind — favor run game'; riskColor = '#f59e0b' }
    let sportNote = ''
    if (sport === 'Football' && wind > 20) sportNote = `Wind ${Math.round(wind)}mph — consider run-heavy scheme`
    else if (sport === 'Baseball' || sport === 'Softball') sportNote = isAnyRain ? 'Wet field expected — prepare batting cage backup' : 'Field conditions look good'
    else if (sport === 'Soccer') sportNote = isThunder ? 'Lightning protocol required — mandatory evacuation' : isAnyRain ? 'Wet turf — tighten cleats, adjust passing game' : 'Pitch conditions look good'
    else if (sport === 'Basketball') sportNote = 'Indoor sport — check travel conditions for away games'
    return { code, precip, wind, maxTemp, minTemp, risk, riskLabel, riskColor, sportNote, dayIndex, desc: wxDesc(code), emoji: wxEmoji(code) }
  }

  const pred = getEventWeatherPrediction()

  // Postpone event (keeps it, removes date, marks as needs-rescheduling)
  function postponeEvent(eventId, newDate) {
    if (!currentTeam) return
    const updated = schedule.map(e => e.id===eventId ? { ...e, date: newDate||'', _postponed:true, _needsReschedule:!newDate } : e)
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===currentTeam.id ? {...t, schedule:updated} : t) }))
    setWeatherAction(null); setPostponeDate('')
  }

  function cancelEvent(eventId) {
    if (!currentTeam) return
    const updated = schedule.filter(e => e.id!==eventId)
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===currentTeam.id ? {...t, schedule:updated} : t) }))
    setWeatherAction(null); setWeatherExpanded(false)
  }

  // Sport-specific SVG card art
  function SportArt({ type }) {
    const isOff = type === 'offense'
    const isDef = type === 'defense'
    const isPrac = type === 'practice'
    const color = isOff ? '#C0392B' : isDef ? '#6b9fff' : isPrac ? '#4ade80' : '#f59e0b'

    // Plain function returning SVG group — not a component
    function dot(cx, cy, r, fill, stroke, label, labelDy=0) {
      return (
        <g key={cx+'-'+cy}>
          <circle cx={cx} cy={cy} r={r||4} fill={fill||'none'} stroke={stroke||color} strokeWidth="1.2"/>
          {label && <text x={cx} y={cy+(r||4)+8+labelDy} textAnchor="middle" fontSize="5" fill={color} opacity="0.75">{label}</text>}
        </g>
      )
    }

    if (sport === 'Football') {
      // Offense: 5 OL (12px apart), QB behind center, 2 WR wide, 1 TE
      if (isOff) return (
        <svg width="100%" height="56" viewBox="0 0 220 56" preserveAspectRatio="xMidYMid meet" style={{opacity:0.75}}>
          <line x1="0" y1="30" x2="220" y2="30" stroke={color} strokeWidth="0.6" strokeDasharray="4,3" opacity="0.3"/>
          {[74,86,98,110,122].map((x,i)=><circle key={i} cx={x} cy={30} r={4} fill={color} opacity="0.6"/>)}
          <circle cx={98} cy={43} r={5} fill={color} opacity="0.9"/>
          <circle cx={22} cy={30} r={4} stroke={color} strokeWidth="1.2" fill="none" opacity="0.8"/>
          <path d="M22,30 Q18,18 26,10" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7"/>
          <polygon points="26,10 22,15 28,15" fill={color} opacity="0.7"/>
          <circle cx={198} cy={30} r={4} stroke={color} strokeWidth="1.2" fill="none" opacity="0.8"/>
          <path d="M198,30 Q202,18 196,10" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7"/>
          <polygon points="196,10 192,15 198,15" fill={color} opacity="0.7"/>
          <circle cx={138} cy={30} r={4} stroke={color} strokeWidth="1.2" fill="none" opacity="0.8"/>
          <path d="M138,30 Q148,18 154,10" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7"/>
          <polygon points="154,10 150,15 156,15" fill={color} opacity="0.7"/>
        </svg>
      )
      // Defense: 4-3 base, spaced 20px apart, CBs wide, 2 safeties deep
      if (isDef) return (
        <svg width="100%" height="56" viewBox="0 0 220 56" preserveAspectRatio="xMidYMid meet" style={{opacity:0.75}}>
          <line x1="0" y1="34" x2="220" y2="34" stroke={color} strokeWidth="0.6" strokeDasharray="4,3" opacity="0.3"/>
          {[70,90,110,130].map((x,i)=><g key={i}><rect x={x-5} y={27} width={10} height={10} rx="1" fill="none" stroke={color} strokeWidth="1.2" opacity="0.8"/></g>)}
          {[80,100,120].map((x,i)=><g key={i}><rect x={x-4} y={16} width={9} height={9} rx="1" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7"/></g>)}
          <circle cx={28} cy={30} r={4} fill="none" stroke={color} strokeWidth="1.2" opacity="0.7"/>
          <circle cx={172} cy={30} r={4} fill="none" stroke={color} strokeWidth="1.2" opacity="0.7"/>
          <circle cx={82} cy={8} r={4} fill="none" stroke={color} strokeWidth="1.2" opacity="0.6"/>
          <circle cx={128} cy={8} r={4} fill="none" stroke={color} strokeWidth="1.2" opacity="0.6"/>
        </svg>
      )
      if (isPrac) return (
        <svg width="100%" height="56" viewBox="0 0 220 56" preserveAspectRatio="xMidYMid meet" style={{opacity:0.75}}>
          <circle cx={55} cy={44} r={4} fill={color} opacity="0.8"/>
          <circle cx={110} cy={18} r={4} fill={color} opacity="0.8"/>
          <circle cx={165} cy={44} r={4} fill={color} opacity="0.8"/>
          <path d="M55,44 L110,18 L165,44" stroke={color} strokeWidth="1.2" fill="none" strokeDasharray="4,3" opacity="0.6"/>
          <path d="M55,44 L78,36" stroke={color} strokeWidth="1.5" fill="none" opacity="0.8"/>
          <polygon points="78,36 73,39 79,42" fill={color} opacity="0.8"/>
          <text x="110" y="54" textAnchor="middle" fontSize="7" fill={color} opacity="0.5">TRIANGLE DRILL</text>
        </svg>
      )
      return (
        <svg width="100%" height="56" viewBox="0 0 220 56" preserveAspectRatio="xMidYMid meet" style={{opacity:0.75}}>
          <circle cx="110" cy="26" r="16" fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>
          <circle cx="110" cy="26" r="8" fill="none" stroke={color} strokeWidth="0.8" opacity="0.2"/>
          <path d="M96,12 L128,42" stroke={color} strokeWidth="1.5" opacity="0.6"/>
          <circle cx="131" cy="44" r="5" fill={color} opacity="0.7"/>
          <text x="110" y="52" textAnchor="middle" fontSize="7" fill={color} opacity="0.5">SCOUT REPORT</text>
        </svg>
      )
    }

    if (sport === 'Basketball') {
      // Half court: basket at TOP (y=10), players attack from BOTTOM (y=50+)
      function courtSVG() { return (
        <>
          <rect x="8" y="4" width="204" height="52" rx="1" fill="none" stroke={color} strokeWidth="0.7" opacity="0.2"/>
          <rect x="80" y="4" width="60" height="22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.35"/>
          <line x1="96" y1="4" x2="124" y2="4" stroke={color} strokeWidth="1.5" opacity="0.5"/>
          <circle cx="110" cy="11" r="5" fill="none" stroke={color} strokeWidth="1.2" opacity="0.7"/>
          <line x1="80" y1="26" x2="140" y2="26" stroke={color} strokeWidth="0.8" opacity="0.3"/>
          <path d="M80,26 Q110,14 140,26" fill="none" stroke={color} strokeWidth="0.6" strokeDasharray="2,2" opacity="0.25"/>
          <path d="M24,56 L24,36 Q24,4 110,4 Q196,4 196,36 L196,56" fill="none" stroke={color} strokeWidth="0.7" opacity="0.22"/>
        </>
      )
      }
      // 5-out motion: PG at top of key, wings wide, bigs at elbows — all clearly spaced
      if (isOff) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {courtSVG()}
          {dot(110,50,5,color,undefined,'PG',0)}
          {dot(38,42,4,color,undefined,'SF',0)}
          {dot(182,42,4,color,undefined,'SG',0)}
          {dot(74,32,4,color,undefined,'PF',0)}
          {dot(146,32,4,color,undefined,'C',0)}
          <path d="M105,50 L44,44" stroke={color} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.6"/>
          <polygon points="44,44 50,41 49,47" fill={color} opacity="0.6"/>
        </svg>
      )
      // 2-3 Zone: 2 guards near FT line, 3 across lane — correct positions
      if (isDef) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {courtSVG()}
          {dot(86,40,4,undefined,color,'G',0)}
          {dot(134,40,4,undefined,color,'G',0)}
          {dot(52,28,4,undefined,color,'F',0)}
          {dot(110,26,4,undefined,color,'C',0)}
          {dot(168,28,4,undefined,color,'F',0)}
          <text x="110" y="58" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">2-3 ZONE</text>
        </svg>
      )
      if (isPrac) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {courtSVG()}
          {dot(46,54,4,color,undefined,undefined,0)}
          {dot(110,54,4,color,undefined,undefined,0)}
          {dot(174,54,4,color,undefined,undefined,0)}
          <path d="M50,54 Q80,40 110,28" stroke={color} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.7"/>
          <path d="M110,54 Q80,42 46,34" stroke={color} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.5"/>
          <polygon points="110,28 106,34 113,34" fill={color} opacity="0.7"/>
          <text x="110" y="58" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">3-MAN WEAVE</text>
        </svg>
      )
      return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {courtSVG()}
          <circle cx="110" cy="30" r="14" fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>
          <path d="M98,18 L124,44" stroke={color} strokeWidth="1.5" opacity="0.6"/>
          <circle cx="126" cy="46" r="4" fill={color} opacity="0.7"/>
          <text x="110" y="58" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">SCOUT REPORT</text>
        </svg>
      )
    }

    if (sport === 'Baseball' || sport === 'Softball') {
      // Diamond: Home at bottom-center, 1B right, 2B top, 3B left
      function diamondSVG() { return (
        <>
          <path d="M15,58 Q110,2 205,58" fill="none" stroke={color} strokeWidth="0.7" opacity="0.2"/>
          <path d="M110,8 L176,38 L110,54 L44,38 Z" fill="none" stroke={color} strokeWidth="1" opacity="0.45"/>
          <rect x="107" y="5" width="6" height="6" rx="1" fill={color} opacity="0.55"/>
          <rect x="173" y="35" width="6" height="6" rx="1" fill={color} opacity="0.55"/>
          <rect x="107" y="51" width="6" height="6" rx="1" fill={color} opacity="0.55"/>
          <rect x="41" y="35" width="6" height="6" rx="1" fill={color} opacity="0.55"/>
          <circle cx="110" cy="31" r="3" fill={color} opacity="0.35"/>
        </>
      )
      }
      if (isOff) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {diamondSVG()}
          {dot(110,54,4,color,undefined,'C',0)}
          <path d="M116,51 Q148,40 173,38" stroke={color} strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.7"/>
          <polygon points="173,38 167,36 168,42" fill={color} opacity="0.7"/>
          <text x="110" y="6" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">HIT & RUN</text>
        </svg>
      )
      // All 9 fielders — placed at correct positions, NOT on top of bases
      if (isDef) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {diamondSVG()}
          {dot(110,31,3,color,undefined,'P',0)}
          {dot(110,54,3,color,undefined,'C',0)}
          {dot(182,30,3,color,undefined,'1B',0)}
          {dot(40,30,3,color,undefined,'3B',0)}
          {dot(132,22,3,color,undefined,'2B',0)}
          {dot(90,20,3,color,undefined,'SS',0)}
          {dot(50,10,3,color,undefined,'LF',0)}
          {dot(110,6,3,color,undefined,'CF',0)}
          {dot(170,10,3,color,undefined,'RF',0)}
        </svg>
      )
      if (isPrac) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {diamondSVG()}
          {dot(110,54,4,color,undefined,'Batter',0)}
          {dot(88,47,3,undefined,color,'Toss',0)}
          <path d="M93,48 L106,52" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7"/>
          <polygon points="106,52 101,50 103,56" fill={color} opacity="0.7"/>
          <text x="110" y="6" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">BATTING PRACTICE</text>
        </svg>
      )
      return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {diamondSVG()}
          <circle cx="110" cy="31" r="16" fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>
          <path d="M98,19 L124,46" stroke={color} strokeWidth="1.5" opacity="0.6"/>
          <circle cx="126" cy="48" r="4" fill={color} opacity="0.7"/>
          <text x="110" y="6" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">SCOUT REPORT</text>
        </svg>
      )
    }

    if (sport === 'Soccer') {
      // Half pitch: goal at LEFT, players attack right-to-left
      function pitchSVG() { return (
        <>
          <rect x="8" y="4" width="204" height="52" rx="1" fill="none" stroke={color} strokeWidth="0.7" opacity="0.2"/>
          <rect x="8" y="14" width="36" height="32" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3"/>
          <rect x="8" y="20" width="14" height="20" fill="none" stroke={color} strokeWidth="0.8" opacity="0.35"/>
          <rect x="3" y="22" width="5" height="16" rx="0" fill="none" stroke={color} strokeWidth="1.4" opacity="0.55"/>
          <circle cx="30" cy="30" r="1.5" fill={color} opacity="0.4"/>
        </>
      )
      }
      if (isOff) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {pitchSVG()}
          {dot(54,30,4,color,undefined,'ST',0)}
          {dot(90,12,4,color,undefined,'LW',0)}
          {dot(90,48,4,color,undefined,'RW',0)}
          {dot(124,18,4,color,undefined,'CM',0)}
          {dot(124,30,4,color,undefined,'CM',0)}
          {dot(124,42,4,color,undefined,'CM',0)}
          <path d="M90,12 Q70,20 58,28" stroke={color} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.6"/>
          <polygon points="58,28 64,25 63,31" fill={color} opacity="0.6"/>
          <text x="172" y="56" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">4-3-3 ATTACK</text>
        </svg>
      )
      if (isDef) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {pitchSVG()}
          {dot(162,30,4,undefined,color,'DM',0)}
          {dot(130,12,4,undefined,color,undefined,0)}
          {dot(130,26,4,undefined,color,undefined,0)}
          {dot(130,40,4,undefined,color,undefined,0)}
          {dot(98,6,4,undefined,color,undefined,0)}
          {dot(98,20,4,undefined,color,undefined,0)}
          {dot(98,36,4,undefined,color,undefined,0)}
          {dot(98,52,4,undefined,color,undefined,0)}
          <text x="175" y="56" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">4-4-2 BLOCK</text>
        </svg>
      )
      if (isPrac) return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {pitchSVG()}
          {dot(98,50,4,color,undefined,undefined,0)}
          {dot(150,50,4,color,undefined,undefined,0)}
          {dot(124,18,4,color,undefined,undefined,0)}
          <path d="M102,48 L146,48" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7"/>
          <path d="M150,46 L128,22" stroke={color} strokeWidth="1.2" fill="none" opacity="0.7"/>
          <path d="M120,22 L102,46" stroke={color} strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.5"/>
          <polygon points="146,48 140,45 140,51" fill={color} opacity="0.7"/>
          <text x="160" y="56" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">TRIANGLE PASSING</text>
        </svg>
      )
      return (
        <svg width="100%" height="60" viewBox="0 0 220 60" preserveAspectRatio="xMidYMid meet" style={{opacity:0.8}}>
          {pitchSVG()}
          <circle cx="130" cy="30" r="16" fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>
          <path d="M118,18 L144,44" stroke={color} strokeWidth="1.5" opacity="0.6"/>
          <circle cx="146" cy="46" r="4" fill={color} opacity="0.7"/>
          <text x="175" y="56" textAnchor="middle" fontSize="6" fill={color} opacity="0.5">SCOUT REPORT</text>
        </svg>
      )
    }

    return (
      <svg width="100%" height="48" viewBox="0 0 220 48" style={{opacity:0.5}}>
        <circle cx="70" cy="24" r="5" fill={color} opacity="0.7"/>
        <circle cx="110" cy="24" r="5" fill={color} opacity="0.7"/>
        <circle cx="150" cy="24" r="5" fill={color} opacity="0.7"/>
        <path d="M70,24 L110,24 L150,24" stroke={color} strokeWidth="1.5" fill="none" opacity="0.5"/>
      </svg>
    )
  }



  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>

      {/* TOP ROW — Weather + Greeting side by side */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>

        {/* WEATHER CARD */}
        <div onClick={()=>setWeatherExpanded(true)} style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:10, padding:'10px 12px', cursor:'pointer', position:'relative', overflow:'hidden' }}>
          {pred && pred.risk !== 'low' && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:pred.riskColor }} />}
          {weatherData ? (
            <>
              <div style={{ fontSize:20, marginBottom:2 }}>{wxEmoji(weatherData.current.weathercode)}</div>
              <div style={{ fontSize:18, fontWeight:900, color:'#f2f4f8', lineHeight:1 }}>{Math.round(weatherData.current.temperature_2m)}°</div>
              <div style={{ fontSize:10, color:'#8a94b0', marginTop:2, lineHeight:1.3 }}>{homeLocation ? homeLocation.split(',')[0] : 'Set location'}</div>
              {pred && (
                <div style={{ marginTop:6, fontSize:10, color:pred.riskColor, fontWeight:700, lineHeight:1.3 }}>{pred.riskLabel}</div>
              )}
              <div style={{ fontSize:9, color:'#5a6480', marginTop:4 }}>Tap for details</div>
            </>
          ) : (
            <>
              <div style={{ fontSize:20, marginBottom:4 }}>🌡️</div>
              <div style={{ fontSize:10, fontWeight:700, color:'#8a94b0', lineHeight:1.4 }}>Set your location for weather</div>
              <div style={{ fontSize:9, color:'#5a6480', marginTop:4 }}>Settings → Location</div>
            </>
          )}
        </div>

        {/* GREETING CARD */}
        {showGreeting && (
          <div style={{ background:'#0f1219', border:'1px solid rgba(192,57,43,0.3)', borderLeft:'3px solid #C0392B', borderRadius:10, padding:'10px 12px', position:'relative' }}>
            <button onClick={()=>setShowGreeting(false)} style={{ position:'absolute', top:6, right:8, background:'transparent', border:'none', color:'#5a6480', cursor:'pointer', fontSize:12, padding:2 }}>✕</button>
            <div style={{ fontSize:9, letterSpacing:2, color:'#C0392B', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>{greeting.label}</div>
            <div style={{ fontSize:10, color:'#f2f4f8', lineHeight:1.4, marginBottom:8, paddingRight:12 }}>{greeting.msg}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <button onClick={greeting.btn1.action} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'5px 6px', fontSize:10, fontWeight:700, color:'#6b9fff', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, cursor:'pointer' }}>{greeting.btn1.label}</button>
              <button onClick={greeting.btn2.action} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'5px 6px', fontSize:10, fontWeight:700, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, cursor:'pointer' }}>{greeting.btn2.label}</button>
            </div>
          </div>
        )}
        {!showGreeting && (
          <div onClick={()=>setShowGreeting(true)} style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:10, padding:'10px 12px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontSize:16, marginBottom:4 }}>💬</div>
            <div style={{ fontSize:10, color:'#5a6480', fontWeight:700, letterSpacing:1, textAlign:'center' }}>DAILY TIP</div>
          </div>
        )}
      </div>

      {/* WEATHER EXPANDED MODAL */}
      {weatherExpanded && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:100, display:'flex', alignItems:'flex-end', justifyContent:'center' }} onClick={()=>{ setWeatherExpanded(false); setWeatherAction(null) }}>
          <div onClick={e=>e.stopPropagation()} style={{ background:'#0d1117', borderRadius:'16px 16px 0 0', padding:'20px 16px 32px', width:'100%', maxWidth:480, maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:2, textTransform:'uppercase' }}>Weather Intelligence</div>
              <button onClick={()=>{ setWeatherExpanded(false); setWeatherAction(null) }} style={{ background:'transparent', border:'none', color:'#8a94b0', cursor:'pointer', fontSize:18 }}>✕</button>
            </div>

            {weatherData && (
              <>
                {/* Current conditions */}
                <div style={{ background:'#161922', borderRadius:8, padding:'12px 14px', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                    <div style={{ fontSize:32 }}>{wxEmoji(weatherData.current.weathercode)}</div>
                    <div>
                      <div style={{ fontSize:28, fontWeight:900, color:'#f2f4f8', lineHeight:1 }}>{Math.round(weatherData.current.temperature_2m)}°F</div>
                      <div style={{ fontSize:11, color:'#8a94b0' }}>{wxDesc(weatherData.current.weathercode)} · Wind {Math.round(weatherData.current.windspeed_10m)}mph</div>
                      <div style={{ fontSize:10, color:'#5a6480' }}>{homeLocation}</div>
                    </div>
                  </div>
                </div>

                {/* Next event prediction */}
                {pred && nextEvent && (
                  <div style={{ background:'#161922', borderRadius:8, padding:'12px 14px', marginBottom:12, borderLeft:`3px solid ${pred.riskColor}` }}>
                    <div style={{ fontSize:9, color:pred.riskColor, fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>
                      {nextEvent.type} · {new Date(nextEvent.date+'T12:00:00').toLocaleDateString([],{weekday:'long',month:'short',day:'numeric'})}
                    </div>
                    <div style={{ display:'flex', gap:10, marginBottom:8 }}>
                      <div style={{ textAlign:'center' }}>
                        <div style={{ fontSize:22 }}>{pred.emoji}</div>
                        <div style={{ fontSize:9, color:'#8a94b0' }}>{pred.desc}</div>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:pred.riskColor, marginBottom:3 }}>{pred.riskLabel}</div>
                        <div style={{ fontSize:11, color:'#8a94b0' }}>Rain chance: {pred.precip}% · Wind: {Math.round(pred.wind)}mph</div>
                        <div style={{ fontSize:11, color:'#8a94b0' }}>Hi {Math.round(pred.maxTemp)}° Lo {Math.round(pred.minTemp)}°</div>
                      </div>
                    </div>
                    {pred.sportNote && <div style={{ fontSize:10, color:'#f59e0b', fontStyle:'italic', lineHeight:1.4 }}>🏅 {pred.sportNote}</div>}

                    {/* Action buttons - only show if risk is medium or high */}
                    {pred.risk !== 'low' && !weatherAction && (
                      <div style={{ marginTop:12 }}>
                        <div style={{ fontSize:10, color:'#8a94b0', letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>What do you want to do?</div>
                        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                          {sport !== 'Basketball' && (
                            <button onClick={()=>setWeatherAction('indoor')} style={{ width:'100%', padding:'10px', background:'rgba(107,154,255,0.1)', border:'1px solid rgba(107,154,255,0.3)', borderRadius:6, color:'#6b9fff', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1, textAlign:'left' }}>
                              🏢 {wxCfg.indoorLabel}
                            </button>
                          )}
                          <button onClick={()=>setWeatherAction('postpone')} style={{ width:'100%', padding:'10px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:6, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1, textAlign:'left' }}>
                            📅 Postpone — pick a new date later
                          </button>
                          <button onClick={()=>setWeatherAction('cancel')} style={{ width:'100%', padding:'10px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1, textAlign:'left' }}>
                            ✕ Cancel this {nextEvent.type.toLowerCase()}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Indoor action */}
                    {weatherAction === 'indoor' && (
                      <div style={{ marginTop:12, padding:'10px 12px', background:'rgba(107,154,255,0.08)', borderRadius:8 }}>
                        <div style={{ fontSize:10, color:'#6b9fff', fontWeight:700, marginBottom:4 }}>Moving Indoors</div>
                        <div style={{ fontSize:11, color:'#9aa0b0', lineHeight:1.5, marginBottom:8 }}>{wxCfg.indoorNote}</div>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={()=>setWeatherAction(null)} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>BACK</button>
                          <button onClick={()=>{ setWeatherExpanded(false); setWeatherAction(null) }} style={{ flex:2, padding:'8px', background:'#6b9fff', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>GOT IT — STAYING ON SCHEDULE</button>
                        </div>
                      </div>
                    )}

                    {/* Postpone action */}
                    {weatherAction === 'postpone' && (
                      <div style={{ marginTop:12, padding:'10px 12px', background:'rgba(245,158,11,0.08)', borderRadius:8 }}>
                        <div style={{ fontSize:10, color:'#f59e0b', fontWeight:700, marginBottom:4 }}>Postpone {nextEvent.type}</div>
                        <div style={{ fontSize:11, color:'#9aa0b0', marginBottom:8 }}>Pick a new date now, or leave blank to reschedule later.</div>
                        <input type="date" value={postponeDate} onChange={e=>setPostponeDate(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:14, marginBottom:8, outline:'none' }} />
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={()=>setWeatherAction(null)} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>BACK</button>
                          <button onClick={()=>postponeEvent(nextEvent.id, postponeDate)} style={{ flex:2, padding:'8px', background:'#f59e0b', border:'none', borderRadius:4, color:'#0f1219', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>{postponeDate ? 'MOVE TO NEW DATE' : 'MARK NEEDS RESCHEDULE'}</button>
                        </div>
                      </div>
                    )}

                    {/* Cancel action */}
                    {weatherAction === 'cancel' && (
                      <div style={{ marginTop:12, padding:'10px 12px', background:'rgba(239,68,68,0.08)', borderRadius:8 }}>
                        <div style={{ fontSize:10, color:'#ef4444', fontWeight:700, marginBottom:4 }}>Cancel {nextEvent.type}?</div>
                        <div style={{ fontSize:11, color:'#9aa0b0', marginBottom:8 }}>This permanently removes the event from your schedule. This cannot be undone.</div>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={()=>setWeatherAction(null)} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>BACK</button>
                          <button onClick={()=>cancelEvent(nextEvent.id)} style={{ flex:2, padding:'8px', background:'#ef4444', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>YES, CANCEL IT</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!nextEvent && (
                  <div style={{ background:'#161922', borderRadius:8, padding:'10px 12px', marginBottom:12 }}>
                    <div style={{ fontSize:10, color:'#8a94b0' }}>No upcoming events to predict. Add a game or practice to your schedule to see weather impact.</div>
                  </div>
                )}
              </>
            )}

            {!weatherData && (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <div style={{ fontSize:13, color:'#8a94b0', marginBottom:8 }}>Set your location in Settings to enable weather forecasts and game-day predictions.</div>
                <button onClick={()=>{ setWeatherExpanded(false); setPage('more') }} style={{ padding:'10px 20px', background:P, border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:1 }}>GO TO SETTINGS</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COACH PROFILE CARD */}
      <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:10, padding:'12px 14px', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
          <div style={{ width:38, height:38, borderRadius:'50%', background:'#C0392B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:900, color:'white', flexShrink:0 }}>{(coachName||'C')[0].toUpperCase()}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#f2f4f8' }}>{coachName}</div>
            <div style={{ fontSize:10, color:'#8a94b0' }}>{currentTeam?.name || <span style={{color:'#f59e0b',cursor:'pointer'}} onClick={()=>setPage('team')}>+ Create your first team</span>} · {sport}</div>
          </div>
          <div style={{ background:'rgba(192,57,43,0.15)', border:'1px solid rgba(192,57,43,0.4)', borderRadius:4, padding:'3px 8px' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#C0392B', letterSpacing:1 }}>FREE</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
          <div style={{ background:'#161922', borderRadius:6, padding:'7px', textAlign:'center' }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#f2f4f8' }}>{iq}</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:1, marginTop:1 }}>IQ SCORE</div>
          </div>
          <div style={{ background:'#161922', borderRadius:6, padding:'7px', textAlign:'center' }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#f2f4f8' }}>{record}</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:1, marginTop:1 }}>RECORD</div>
          </div>
          <div style={{ background:'#161922', borderRadius:6, padding:'7px', textAlign:'center' }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#f2f4f8' }}>{totalPlays}</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:1, marginTop:1 }}>PLAYS SAVED</div>
          </div>
        </div>
      </div>

      {/* BEFORE THE GAME */}
      <div style={{ fontSize:10, letterSpacing:2, color:'#8a94b0', fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>Before the game</div>

      {/* OFFENSE CARD */}
      <div style={{ background:'linear-gradient(135deg,#1a0a08,#0f1219)', border:'1px solid rgba(192,57,43,0.5)', borderTop:'3px solid #C0392B', borderRadius:12, marginBottom:8, overflow:'hidden' }}>
        <div onClick={()=>{ setPage('schemes'); setActiveMode('schemes_offense') }} style={{ cursor:'pointer' }}>
          {/* Sport art header */}
          <div style={{ padding:'0 0 0 0', borderBottom:'1px solid rgba(192,57,43,0.15)' }}>
            <SportArt type="offense" />
          </div>
          <div style={{ padding:'10px 14px 8px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#f2f4f8' }}>{{ Football:'Offense', Basketball:'Offense', Baseball:'Game Plan', Soccer:'Attack', Softball:'Game Plan' }[sport]||'Offense'}</div>
                {nextGame && <div style={{ background:'#C0392B', borderRadius:3, padding:'1px 6px', fontSize:9, fontWeight:700, color:'white', letterSpacing:1 }}>GAME WEEK</div>}
              </div>
              <div style={{ fontSize:9, color:'rgba(192,57,43,0.9)', fontWeight:700 }}>{{ Football:'Build your attack →', Basketball:'Build your offense →', Baseball:'Build your game plan →', Soccer:'Build your attack →', Softball:'Build your game plan →' }[sport]||'Build your attack →'}</div>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', borderTop:'1px solid rgba(192,57,43,0.15)', borderBottom:'1px solid rgba(192,57,43,0.15)' }}>
          <div style={{ flex:1, padding:'9px 8px', textAlign:'center', borderRight:'1px solid rgba(192,57,43,0.15)' }}>
            <div style={{ fontSize:17, fontWeight:700, color: ppg!==null?'#f2f4f8':'#3d4559', lineHeight:1 }}>{ppg!==null?ppg:'—'}</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:'0.5px', marginTop:2 }}>{{ Football:'Off. PPG', Basketball:'Off. PPG', Baseball:'Runs/game', Soccer:'Goals/game', Softball:'Runs/game' }[sport]||'PPG'}</div>
          </div>
          <div style={{ flex:1, padding:'9px 8px', textAlign:'center', borderRight:'1px solid rgba(192,57,43,0.15)' }}>
            <div style={{ fontSize:17, fontWeight:700, color:'#5a6480', lineHeight:1 }}>—</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:'0.5px', marginTop:2 }}>{{ Football:'Yds/play', Basketball:'Pts/poss', Baseball:'Hits/game', Soccer:'Shots/game', Softball:'Hits/game' }[sport]||'Stat'}</div>
          </div>
          <div style={{ flex:1, padding:'9px 8px', textAlign:'center' }}>
            <div style={{ fontSize:lastOffScheme?9:14, fontWeight:700, color:lastOffScheme?'#C0392B':'#3d4559', lineHeight:1.2 }}>{lastOffScheme ? lastOffScheme.slice(0,14) : '—'}</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:'0.5px', marginTop:2 }}>Last scheme</div>
          </div>
        </div>
        <div style={{ padding:'7px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:9, color:'#8a94b0', fontStyle:'italic' }}>{{ Football:'Track offensive yards in Live Scoring to see this', Basketball:'Track possessions in Live Scoring to see this', Baseball:'Track hits in Live Scoring to see this', Soccer:'Track shots in Live Scoring to see this', Softball:'Track hits in Live Scoring to see this' }[sport]||'Track stats in Live Scoring'}</div>
          <div onClick={()=>setPage('team')} style={{ fontSize:9, color:'#C0392B', fontWeight:700, cursor:'pointer', flexShrink:0, marginLeft:8 }}>Analytics →</div>
        </div>
      </div>

      {/* DEFENSE CARD */}
      <div style={{ background:'linear-gradient(135deg,#080d1a,#0f1219)', border:'1px solid rgba(107,154,255,0.35)', borderTop:'3px solid #6b9fff', borderRadius:12, marginBottom:8, overflow:'hidden' }}>
        <div onClick={()=>{ setPage('schemes'); setActiveMode('schemes_defense') }} style={{ cursor:'pointer' }}>
          <div style={{ borderBottom:'1px solid rgba(107,154,255,0.15)' }}>
            <SportArt type="defense" />
          </div>
          <div style={{ padding:'10px 14px 8px' }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#f2f4f8', marginBottom:2 }}>{{ Football:'Defense', Basketball:'Defense', Baseball:'Pitching & Defense', Soccer:'Defensive Shape', Softball:'Pitching & Defense' }[sport]||'Defense'}</div>
            <div style={{ fontSize:9, color:'rgba(107,154,255,0.9)', fontWeight:700 }}>{{ Football:'Shut them down →', Basketball:'Lock it down →', Baseball:'Hold them here →', Soccer:'Keep the clean sheet →', Softball:'Hold them here →' }[sport]||'Shut them down →'}</div>
          </div>
        </div>
        <div style={{ display:'flex', borderTop:'1px solid rgba(107,154,255,0.15)', borderBottom:'1px solid rgba(107,154,255,0.15)' }}>
          <div style={{ flex:1, padding:'9px 8px', textAlign:'center', borderRight:'1px solid rgba(107,154,255,0.15)' }}>
            <div style={{ fontSize:17, fontWeight:700, color: papg!==null?'#f2f4f8':'#3d4559', lineHeight:1 }}>{papg!==null?papg:'—'}</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:'0.5px', marginTop:2 }}>{{ Football:'Pts allowed avg', Basketball:'Pts allowed avg', Baseball:'Runs allowed avg', Soccer:'Goals allowed avg', Softball:'Runs allowed avg' }[sport]||'Pts allowed'}</div>
          </div>
          <div style={{ flex:1, padding:'9px 8px', textAlign:'center', borderRight:'1px solid rgba(107,154,255,0.15)' }}>
            <div style={{ fontSize:17, fontWeight:700, color:'#5a6480', lineHeight:1 }}>—</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:'0.5px', marginTop:2 }}>{{ Football:'Yds allowed/play', Basketball:'Opp pts/poss', Baseball:'ERA', Soccer:'Shots allowed', Softball:'ERA' }[sport]||'Stat'}</div>
          </div>
          <div style={{ flex:1, padding:'9px 8px', textAlign:'center' }}>
            <div style={{ fontSize:lastDefScheme?9:14, fontWeight:700, color:lastDefScheme?'#6b9fff':'#3d4559', lineHeight:1.2 }}>{lastDefScheme ? lastDefScheme.slice(0,14) : '—'}</div>
            <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:'0.5px', marginTop:2 }}>Last scheme</div>
          </div>
        </div>
        <div style={{ padding:'7px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:9, color:'#8a94b0', fontStyle:'italic' }}>{{ Football:'Track yards allowed in Live Scoring to see this', Basketball:'Track opponent scoring in Live Scoring', Baseball:'Track runs allowed in Live Scoring to see this', Soccer:'Track shots allowed in Live Scoring', Softball:'Track runs allowed in Live Scoring to see this' }[sport]||'Track stats in Live Scoring'}</div>
          <div onClick={()=>setPage('team')} style={{ fontSize:9, color:'#6b9fff', fontWeight:700, cursor:'pointer', flexShrink:0, marginLeft:8 }}>Analytics →</div>
        </div>
      </div>

      {/* PRACTICE + SCOUT 2-col */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
        {/* Practice Plan */}
        <div onClick={()=>setPage('team')} style={{ background:'linear-gradient(135deg,#081a0d,#0f1219)', border:'1px solid rgba(74,222,128,0.3)', borderTop:'3px solid #4ade80', borderRadius:12, overflow:'hidden', cursor:'pointer' }}>
          <div style={{ borderBottom:'1px solid rgba(74,222,128,0.15)' }}>
            <SportArt type="practice" />
          </div>
          <div style={{ padding:'10px 12px 8px' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#f2f4f8', marginBottom:2 }}>Practice Plan</div>
            <div style={{ fontSize:9, color:'rgba(74,222,128,0.8)', fontWeight:700 }}>{{ Football:'Run a sharp session →', Basketball:'Run a sharp session →', Baseball:'Build your practice →', Soccer:'Run a sharp session →', Softball:'Build your practice →' }[sport]||'Run a sharp session →'}</div>
          </div>
          <div style={{ borderTop:'1px solid rgba(74,222,128,0.15)', padding:'8px 12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
              <div style={{ fontSize:10, color:'#8a94b0' }}>Plans saved</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#f2f4f8' }}>{practicePlans.length}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
              <div style={{ fontSize:10, color:'#8a94b0' }}>Last focus</div>
              <div style={{ fontSize:9, fontWeight:700, color:'#f2f4f8', textAlign:'right', maxWidth:70, lineHeight:1.2 }}>{lastPlan?.focus || '—'}</div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <div style={{ fontSize:10, color:'#8a94b0' }}>Since last</div>
              <div style={{ fontSize:13, fontWeight:700, color: daysSincePractice!==null&&daysSincePractice>5?'#f59e0b':'#f2f4f8' }}>{daysSincePractice!==null?daysSincePractice+'d':'—'}</div>
            </div>
            <div style={{ fontSize:10, color:'#4ade80', fontWeight:700 }}>View all plans →</div>
          </div>
        </div>

        {/* Scout */}
        <div onClick={()=>setPage('scout')} style={{ background:'linear-gradient(135deg,#150f08,#0f1219)', border:'1px solid rgba(245,158,11,0.3)', borderTop:'3px solid #f59e0b', borderRadius:12, overflow:'hidden', cursor:'pointer' }}>
          <div style={{ borderBottom:'1px solid rgba(245,158,11,0.15)' }}>
            <SportArt type="scout" />
          </div>
          <div style={{ padding:'10px 12px 8px' }}>
            <div style={{ fontSize:12, fontWeight:700, color:'#f2f4f8', marginBottom:2 }}>Scout</div>
            <div style={{ fontSize:9, color:'rgba(245,158,11,0.8)', fontWeight:700 }}>Know your opponent →</div>
          </div>
          <div style={{ borderTop:'1px solid rgba(245,158,11,0.15)', padding:'8px 12px' }}>
            {nextOpponent ? (
              <>
                <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:1, marginBottom:3 }}>NEXT OPPONENT</div>
                <div style={{ fontSize:11, fontWeight:700, color:'#f2f4f8', lineHeight:1.3, marginBottom:5 }}>{nextOpponent}</div>
                <div style={{ background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:4, padding:'3px 6px', textAlign:'center', marginBottom:6 }}>
                  <div style={{ fontSize:9, color:'#f59e0b', fontWeight:700 }}>NO SCOUT BUILT YET</div>
                </div>
                <div style={{ fontSize:10, color:'#f59e0b', fontWeight:700 }}>Build one now →</div>
              </>
            ) : (
              <>
                <div style={{ fontSize:10, color:'#5a6480', lineHeight:1.4, marginBottom:6 }}>Add a game to your schedule to prep a scout report</div>
                <div onClick={()=>setPage('team')} style={{ fontSize:10, color:'#f59e0b', fontWeight:700, cursor:'pointer' }}>Add to schedule →</div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* GAME DAY */}
      <div style={{ fontSize:10, letterSpacing:2, color:'#8a94b0', fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>Game day</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:14 }}>
        {[
          { icon:'🏟', label:'Scoring', sub:'Track live', action:()=>setPage('team') },
          { icon:'👥', label:'Lineup', sub:'Set positions', action:()=>setPage('team') },
          { icon:'🎯', label:'Situational', sub:'Play advisor', action:()=>{ setLearnMode('situational'); setPage('learn') } },
          { icon:'✏️', label:'Play Builder', sub:'Name plays', action:()=>{ setLearnMode('playnames'); setPage('learn') } },
        ].map(item => (
          <div key={item.label} onClick={item.action} style={{ background:'#0f1219', border:'1px solid rgba(107,154,255,0.2)', borderTop:'2px solid #6b9fff', borderRadius:10, padding:'12px 8px', textAlign:'center', cursor:'pointer' }}>
            <div style={{ fontSize:20, marginBottom:3 }}>{item.icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:'#6b9fff', marginBottom:2 }}>{item.label}</div>
            <div style={{ fontSize:9, color:'#5a6480' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* AFTER THE GAME */}
      <div style={{ fontSize:10, letterSpacing:2, color:'#8a94b0', fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>After the game</div>
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {[
          { icon:'📊', label:'Analytics', sub: record, action:()=>setPage('team') },
          { icon:'📖', label:'Playbook', sub: totalPlays+' plays', action:()=>{ setPage('schemes'); setActiveMode('playbook') } },
          { icon:'🎉', label:'Post-Game', sub: gameHistory.length>0 ? `Last: ${gameHistory[gameHistory.length-1].us}-${gameHistory[gameHistory.length-1].them}` : 'No games yet', action:()=>setPage('team') },
        ].map(item => (
          <div key={item.label} onClick={item.action} style={{ flex:1, background:'#0f1219', border:'1px solid rgba(74,222,128,0.2)', borderTop:'2px solid #4ade80', borderRadius:10, padding:'12px 8px', textAlign:'center', cursor:'pointer' }}>
            <div style={{ fontSize:20, marginBottom:3 }}>{item.icon}</div>
            <div style={{ fontSize:11, fontWeight:700, color:'#4ade80', marginBottom:2 }}>{item.label}</div>
            <div style={{ fontSize:9, color:'#5a6480' }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* ROADMAP */}
      <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:12, padding:'12px 14px', marginBottom:8 }}>
        <div style={{ fontSize:10, letterSpacing:2, color:'#f59e0b', fontWeight:700, textTransform:'uppercase', marginBottom:10 }}>What's coming</div>
        {[
          { color:'#4ade80', label:'Just added', items:'Live scoring · Practice plans · Post-game summary · Player editing · CoachIQ Hub · Film analysis · Wristband printing · Situational Advisor' },
          { color:'#f59e0b', label:'In progress', items:'Flag football · Full play breakdown · Position tracker · Yards tracking in live scoring' },
          { color:'#5a6480', label:'Planned', items:'AthleteIQ · Coach Network · League Manager · Advanced Analytics · Coaching Certifications' },
        ].map(row => (
          <div key={row.label} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:8 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:row.color, flexShrink:0, marginTop:3 }}></div>
            <div><span style={{ fontSize:9, fontWeight:700, color:row.color }}>{row.label} · </span><span style={{ fontSize:9, color:row.color==='#3d4559'?'#3d4559':'#6b7a96' }}>{row.items}</span></div>
          </div>
        ))}
      </div>

      {/* GUEST MODE — Demo Team + Sign Up */}
      {guestMode && (
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:0 }}>
          {!guestDemoTeam ? (
            <div style={{ background:'#0f1219', border:'1px solid rgba(192,57,43,0.3)', borderRadius:10, padding:'14px 16px' }}>
              <div style={{ fontSize:9, letterSpacing:2, color:'#C0392B', fontWeight:700, textTransform:'uppercase', marginBottom:6 }}>Try with a Demo Team</div>
              <div style={{ fontSize:11, color:'#8a94b0', lineHeight:1.5, marginBottom:10 }}>Load a pre-built {sport} team to explore the Hub with real stats, schedule, and roster — no account needed.</div>
              <button onClick={()=>setGuestDemoTeam(DEMO_TEAMS[sport]||DEMO_TEAMS.Football)} style={{ width:'100%', padding:'11px', background:'#C0392B', border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:1 }}>LOAD {sport.toUpperCase()} DEMO TEAM</button>
            </div>
          ) : (
            <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.3)', borderRadius:8, padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ flex:1, fontSize:10, color:'#4ade80', fontWeight:700 }}>Demo team loaded: {guestDemoTeam.name}</div>
              <button onClick={()=>setGuestDemoTeam(null)} style={{ fontSize:9, color:'#8a94b0', background:'transparent', border:'none', cursor:'pointer', padding:'4px 6px' }}>✕ Remove</button>
            </div>
          )}
          <button onClick={onGuestSignUp} style={{ width:'100%', padding:'13px', background:'#C0392B', border:'none', borderRadius:8, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1.5px', textTransform:'uppercase' }}>Create Free Coach Account →</button>
          <div style={{ textAlign:'center', fontSize:10, color:'#5a6480' }}>No credit card required · Unlock teams, roster, analytics & more</div>
        </div>
      )}

      {/* SETTINGS + HELP */}
      <div style={{ display:'flex', gap:8 }}>
        <div onClick={()=>setPage('more')} style={{ flex:1, background:'#0f1219', border:'1px solid #1e2330', borderRadius:8, padding:'10px 12px', display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
          <span style={{ fontSize:15 }}>⚙️</span>
          <span style={{ fontSize:11, fontWeight:700, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>SETTINGS</span>
        </div>
        <div onClick={()=>setPage('learn')} style={{ flex:1, background:'#0f1219', border:'1px solid #1e2330', borderRadius:8, padding:'10px 12px', display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
          <span style={{ fontSize:15 }}>❓</span>
          <span style={{ fontSize:11, fontWeight:700, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>HELP + TOUR</span>
        </div>
      </div>

    </div>
  )
}


// ─── GUEST MODE COMPONENTS ────────────────────────────────────────────────────
function GuestBanner({ onSignUp }) {
  return (
    <div style={{ background:'rgba(192,57,43,0.1)', border:'1px solid rgba(192,57,43,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:10, fontWeight:700, color:'#C0392B', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, marginBottom:2 }}>GUEST MODE — LIMITED ACCESS</div>
        <div style={{ fontSize:11, color:'#8a94b0' }}>Create a free account to unlock teams, roster, scheduling, analytics and more.</div>
      </div>
      <button onClick={onSignUp} style={{ flexShrink:0, padding:'8px 12px', background:'#C0392B', border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>FREE ACCOUNT →</button>
    </div>
  )
}

function GuestGate({ feature, onSignUp, children }) {
  // Wraps a feature — if guest hits a locked section, shows upgrade prompt instead
  return (
    <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:10, padding:'28px 20px', textAlign:'center' }}>
      <div style={{ fontSize:32, marginBottom:12 }}>🔒</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#f2f4f8', marginBottom:6, letterSpacing:1 }}>{feature} — Coaches Only</div>
      <div style={{ fontSize:12, color:'#8a94b0', lineHeight:1.6, marginBottom:16, maxWidth:280, margin:'0 auto 16px' }}>
        This feature is available to CoachIQ members. Create your free account to unlock teams, roster, scheduling, live scoring, analytics, and more.
      </div>
      <button onClick={onSignUp} style={{ width:'100%', maxWidth:280, padding:'13px', background:'#C0392B', border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:'1.5px', textTransform:'uppercase' }}>Create Free Account →</button>
      <div style={{ marginTop:10, fontSize:10, color:'#5a6480' }}>No credit card required</div>
    </div>
  )
}

// ─── GUEST TEAM PREVIEW (read-only demo team view for guest mode) ─────────────
function GuestTeamPreview({ team, sport, P='#C0392B', S='#002868', al, onSignUp }) {
  const [tab, setTab] = useState('roster')
  const players = team?.players || []
  const schedule = team?.schedule || []
  const gameHistory = team?.gameHistory || []
  const wins = gameHistory.filter(g=>g.us>g.them).length
  const losses = gameHistory.filter(g=>g.us<=g.them).length
  const ppg = gameHistory.length ? Math.round(gameHistory.reduce((s,g)=>s+g.us,0)/gameHistory.length) : 0
  const papg = gameHistory.length ? Math.round(gameHistory.reduce((s,g)=>s+g.them,0)/gameHistory.length) : 0
  const now = new Date()
  const upcoming = schedule.filter(e=>new Date(e.date+'T23:59:59')>=now)
  const typeIcons = { Game:'🏆', Practice:'📋', Scrimmage:'⚡', Tournament:'🥇' }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {/* Preview banner */}
      <div style={{ background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:16 }}>👁</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, marginBottom:2 }}>PREVIEW MODE — {team.name}</div>
          <div style={{ fontSize:11, color:'#8a94b0' }}>This is a demo team. Create a free account to build your own.</div>
        </div>
        <button onClick={onSignUp} style={{ flexShrink:0, padding:'7px 10px', background:'#C0392B', border:'none', borderRadius:5, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer', letterSpacing:1 }}>JOIN FREE</button>
      </div>

      {/* Tab switcher */}
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {[['roster','👥 Roster'],['schedule','📅 Schedule'],['analytics','📊 Analytics']].map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)} style={{ flex:1, padding:'9px 4px', borderRadius:6, fontSize:11, border:`1px solid ${tab===id?P:'#1e2330'}`, background:tab===id?al(P,0.15):'#0f1219', color:tab===id?P:'#8a94b0', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>{label}</button>
        ))}
      </div>

      {/* Roster tab */}
      {tab === 'roster' && (
        <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:8, overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', letterSpacing:1 }}>ROSTER — {players.length} PLAYERS</div>
            <div style={{ fontSize:9, color:'#5a6480', fontStyle:'italic' }}>Read-only preview</div>
          </div>
          <div style={{ padding:'8px 0' }}>
            {players.map((p,i) => (
              <div key={p.id||i} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 14px', borderBottom:i<players.length-1?'1px solid #1e2330':'none' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:al(P,0.15), border:`1px solid ${al(P,0.3)}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, color:P, flexShrink:0 }}>#{p.number||'—'}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{p.name}</div>
                  <div style={{ fontSize:10, color:'#8a94b0' }}>{p.position}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:'10px 14px', borderTop:'1px solid #1e2330', textAlign:'center' }}>
            <button onClick={onSignUp} style={{ padding:'8px 16px', background:P, border:'none', borderRadius:5, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>Create Your Roster — Free →</button>
          </div>
        </div>
      )}

      {/* Schedule tab */}
      {tab === 'schedule' && (
        <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:8, overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', letterSpacing:1 }}>SCHEDULE — {upcoming.length} UPCOMING</div>
            <div style={{ fontSize:9, color:'#5a6480', fontStyle:'italic' }}>Read-only preview</div>
          </div>
          <div style={{ padding:'8px 0' }}>
            {upcoming.length === 0 && <div style={{ padding:'18px 14px', fontSize:12, color:'#5a6480', textAlign:'center' }}>No upcoming events</div>}
            {upcoming.map((e,i)=>{
              const d = new Date(e.date+'T12:00:00')
              return (
                <div key={e.id||i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:i<upcoming.length-1?'1px solid #1e2330':'none' }}>
                  <span style={{ fontSize:16, flexShrink:0 }}>{typeIcons[e.type]||'📅'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{e.opponent||e.type}</div>
                    <div style={{ fontSize:10, color:'#8a94b0' }}>{d.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}{e.time?' · '+e.time:''}</div>
                  </div>
                  <div style={{ fontSize:10, fontWeight:700, color:P, fontFamily:"'Barlow Condensed',sans-serif" }}>{e.homeAway}</div>
                </div>
              )
            })}
          </div>
          <div style={{ padding:'10px 14px', borderTop:'1px solid #1e2330', textAlign:'center' }}>
            <button onClick={onSignUp} style={{ padding:'8px 16px', background:P, border:'none', borderRadius:5, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>Build Your Schedule — Free →</button>
          </div>
        </div>
      )}

      {/* Analytics tab */}
      {tab === 'analytics' && (
        <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:8, overflow:'hidden' }}>
          <div style={{ padding:'10px 14px', borderBottom:'1px solid #1e2330', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', letterSpacing:1 }}>SEASON ANALYTICS</div>
            <div style={{ fontSize:9, color:'#5a6480', fontStyle:'italic' }}>Read-only preview</div>
          </div>
          <div style={{ padding:'16px 14px' }}>
            {/* W/L display */}
            <div style={{ display:'flex', gap:0, background:'#161922', borderRadius:8, marginBottom:12, overflow:'hidden' }}>
              <div style={{ flex:1, padding:'14px 10px', textAlign:'center', borderRight:'1px solid #1e2330' }}>
                <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:40, fontWeight:900, color:'#4ade80', lineHeight:1 }}>{wins}</div>
                <div style={{ fontSize:10, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2 }}>WINS</div>
              </div>
              <div style={{ flex:1, padding:'14px 10px', textAlign:'center' }}>
                <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:40, fontWeight:900, color:'#e74c3c', lineHeight:1 }}>{losses}</div>
                <div style={{ fontSize:10, color:'#e74c3c', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2 }}>LOSSES</div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
              <div style={{ background:'#161922', borderRadius:6, padding:'12px', textAlign:'center' }}>
                <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:28, fontWeight:900, color:P, lineHeight:1 }}>{ppg}</div>
                <div style={{ fontSize:9, color:'#8a94b0', marginTop:2 }}>Pts Per Game</div>
              </div>
              <div style={{ background:'#161922', borderRadius:6, padding:'12px', textAlign:'center' }}>
                <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:28, fontWeight:900, color:'#e74c3c', lineHeight:1 }}>{papg}</div>
                <div style={{ fontSize:9, color:'#8a94b0', marginTop:2 }}>Allowed/Game</div>
              </div>
            </div>
            <div style={{ fontSize:9, color:'#5a6480', marginBottom:8 }}>GAME RESULTS</div>
            {[...gameHistory].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((g,i)=>{
              const r = g.us>g.them?'W':g.us<g.them?'L':'T'
              const rc = r==='W'?'#4ade80':r==='L'?'#e74c3c':'#f59e0b'
              return (
                <div key={g.id||i} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 10px', background:'#161922', borderRadius:5, marginBottom:5, borderLeft:`3px solid ${rc}` }}>
                  <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:14, color:rc, width:14 }}>{r}</div>
                  <div style={{ flex:1, fontSize:11, color:'#f2f4f8' }}>{g.opponent}</div>
                  <div style={{ fontSize:12, fontWeight:700, color:'#f2f4f8' }}>{g.us}–{g.them}</div>
                </div>
              )
            })}
          </div>
          <div style={{ padding:'10px 14px', borderTop:'1px solid #1e2330', textAlign:'center' }}>
            <button onClick={onSignUp} style={{ padding:'8px 16px', background:P, border:'none', borderRadius:5, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>Track Your Own Stats — Free →</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── NEWS TICKER ──────────────────────────────────────────────────────────────
function NewsTicker({ sport, P }) {
  const [headlines, setHeadlines] = useState([])
  const RSS_URLS = {
    Football:   'https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/nfl/news',
    Basketball: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/nba/news',
    Baseball:   'https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/mlb/news',
    Soccer:     'https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/soccer/news',
    Softball:   'https://api.rss2json.com/v1/api.json?rss_url=https://www.espn.com/espn/rss/mlb/news',
  }
  useEffect(() => {
    const cacheKey = 'coachiq_ticker_'+sport
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) { const {items,ts} = JSON.parse(cached); if (Date.now()-ts < 30*60*1000 && items?.length) { setHeadlines(items); return } }
    } catch(e) {}
    fetch(RSS_URLS[sport]||RSS_URLS.Football)
      .then(r=>r.json())
      .then(d=>{ const items=(d.items||[]).slice(0,8).map(i=>i.title?.replace(/<[^>]+>/g,'').trim()).filter(Boolean); setHeadlines(items); try { sessionStorage.setItem(cacheKey, JSON.stringify({items,ts:Date.now()})) } catch(e){} })
      .catch(()=>{})
  }, [sport])

  if (!headlines.length) return <div style={{ flex:1 }} />

  return (
    <div style={{ flex:1, overflow:'hidden', margin:'0 6px' }}>
      <div style={{ overflow:'hidden', whiteSpace:'nowrap' }}>
        <div style={{ display:'inline-block', animation:'ticker 120s linear infinite', fontSize:9, color:'#5a6480', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.3px' }}>
          {headlines.slice(0,5).join('   ·   ')}   ·   {headlines.slice(0,5).join('   ·   ')}
        </div>
      </div>
    </div>
  )
}

// ─── NAV BUTTON WITH LONG PRESS ──────────────────────────────────────────────
function NavButton({ id, icon, label, isActive, P='#C0392B', al, setPage, badge=0 }) {
  return (
    <div style={{ flex:1, position:'relative' }}>
      <button
        onClick={()=>setPage(id)}
        onTouchEnd={(e)=>{ e.preventDefault(); setPage(id) }}
        style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', padding:'10px 2px 6px', cursor:'pointer', gap:2, background:'none', border:'none', position:'relative', minHeight:54, WebkitTapHighlightColor:'transparent', touchAction:'manipulation', userSelect:'none', WebkitUserSelect:'none' }}>
        {isActive && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:20, height:2, background:P, borderRadius:1 }} />}
        <div style={{ position:'relative' }}>
          <span style={{ fontSize:16, color:isActive?P:'#5a6480' }}>{icon}</span>
          {badge > 0 && <div style={{ position:'absolute', top:-4, right:-6, width:14, height:14, borderRadius:'50%', background:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:8, color:'white', fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif" }}>{badge}</span></div>}
        </div>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:isActive?P:'#5a6480', fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase' }}>{label}</span>
      </button>
    </div>
  )
}
function getSpecialTheme() {
  const t=new Date(), m=t.getMonth()+1, d=t.getDate()
  if(m===11&&d>=20&&d<=28) return {badge:'🦃',msg:'Happy Thanksgiving, Coach!'}
  if(m===12&&d>=20)         return {badge:'🎄',msg:'Happy Holidays, Coach!'}
  if(m===1&&d<=5)           return {badge:'🎉',msg:'Happy New Year, Coach!'}
  if(m===7&&d===4)          return {badge:'🇺🇸',msg:'Happy 4th, Coach!'}
  return null
}


export default function CoachIQ() {
  // All hooks must be declared before any early returns (React Rules of Hooks)
  const [mounted, setMounted] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [guestMode, setGuestMode] = useState(false)
  const [guestSport, setGuestSport] = useState('Football')
  const [guestSchemeCount, setGuestSchemeCount] = useState(0)
  const [guestGauntletDone, setGuestGauntletDone] = useState(false)
  const [guestDemoTeam, setGuestDemoTeam] = useState(null) // session-only demo team
  const [tutorialState, setTutorialState] = useState('pending') // pending|tour|guide|done
  const [homeLocation, setHomeLocation] = useState('')
  const [showSplash, setShowSplash] = useState(() => {
    // Show splash every cold launch (sessionStorage clears on app close)
    // alreadyAuthed (launched) check lets returning users skip the CTA
    try { return !sessionStorage.getItem('coachiq_session_started') }
    catch(e) { return true }
  })
  const [cfg, setCfg] = useState(() => {
    try {
      const saved = localStorage.getItem('coachiq_cfg')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Sanitize — ensure primary/secondary are always valid hex
        return {
          ...parsed,
          primary: safeHex(parsed.primary, '#C0392B'),
          secondary: safeHex(parsed.secondary, '#002868'),
        }
      }
    } catch(e) {}
    return { coach:'', team:'', primary:'#C0392B', secondary:'#002868', accent1:'', accent2:'' }
  })
  const [brand, setBrand] = useState('Red — C+IQ colored')
  const [page, setPage] = useState('hub')
  const [activeMode, setActiveMode] = useState(null)
  const [learnMode, setLearnMode] = useState(null) // deep-link into Learn sub-sections
  const [scrollToLocation, setScrollToLocation] = useState(false) // scroll MorePage to location section
  const [sport, setSport] = useState('Football')
  const [iq, setIQ] = useState(500)
  const [gauntlets, setGauntlets] = useState(0)
  const [playbook, setPlaybook] = useState({ Football:{}, Basketball:{}, Baseball:{}, Soccer:{}, Softball:{} })
  const [genHistory, setGenHistory] = useState({ Football:[], Basketball:[], Baseball:[], Soccer:[], Softball:[] })
  const [teams, setTeams] = useState(() => {
    try {
      const s = localStorage.getItem('coachiq_teams')
      if (s) {
        const parsed = JSON.parse(s)
        // Sanitize team colors
        const sanitized = {}
        Object.keys(parsed).forEach(sport => {
          sanitized[sport] = (parsed[sport]||[]).map(t => ({
            ...t,
            primary: safeHex(t.primary, '#C0392B'),
            secondary: safeHex(t.secondary, '#002868'),
          }))
        })
        return sanitized
      }
    } catch(e) {}
    return { Football:[], Basketball:[], Baseball:[], Soccer:[], Softball:[] }
  })
  const [activeTeam, setActiveTeam] = useState(() => {
    try {
      const s = localStorage.getItem('coachiq_activeTeam')
      if (s) return JSON.parse(s)
    } catch(e) {}
    return { Football:null, Basketball:null, Baseball:null, Soccer:null, Softball:null }
  })

  // SSR guard - prevents crash during Next.js prerendering
  // ── PERSISTENCE — must be before any early returns (React Rules of Hooks) ──
  useEffect(() => { try { localStorage.setItem('coachiq_teams', JSON.stringify(teams)) } catch(e){} }, [teams])
  useEffect(() => { try { localStorage.setItem('coachiq_activeTeam', JSON.stringify(activeTeam)) } catch(e){} }, [activeTeam])
  useEffect(() => { try { localStorage.setItem('coachiq_cfg', JSON.stringify(cfg)) } catch(e){} }, [cfg])
  // Reset learnMode when navigating away from Learn so deep-links don't persist stale state
  useEffect(() => { if (page !== 'learn') setLearnMode(null) }, [page])

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const sportColors = SPORT_COLORS[sport] || SPORT_COLORS.Football
  const currentTeam = (teams[sport]||[]).find(t=>t.id===activeTeam[sport]?.id) || activeTeam[sport]
  // Color hierarchy: active team colors > personal colors from cfg > sport defaults
  // safeHex ensures we never get undefined/empty/invalid hex into the style system
  const P = safeAccent(safeHex(currentTeam?.primary || cfg.primary || sportColors.primary, '#C0392B'))
  const S = safeHex(currentTeam?.secondary || cfg.secondary || sportColors.secondary, '#002868')
  const lastName = cfg.coach.replace(/^Coach\s*/i,'').trim().split(' ').pop()

  async function callAI(prompt, imageData, fast=false) {
    const body = imageData
      ? { prompt, image: imageData, fast: false } // images always use Sonnet
      : { prompt, fast }
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), fast ? 45000 : 90000) // faster timeout for Haiku
    try {
      const res = await fetch('/api/ai', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify(body), signal:controller.signal })
      clearTimeout(timeout)
      const d = await res.json()
      if (!res.ok) {
        // Parse friendly error from raw JSON
        let errMsg = 'API error'
        try {
          const errData = typeof d.error === 'string' ? JSON.parse(d.error) : d.error
          if (errData?.error?.message) errMsg = errData.error.message
          else if (errData?.message) errMsg = errData.message
          else if (typeof d.error === 'string') errMsg = d.error
        } catch(e2) {
          errMsg = d.error || 'Request failed'
        }
        // Friendly messages for common errors
        if (errMsg.includes('credit balance') || errMsg.includes('too low')) 
          errMsg = 'API credits depleted. Please add credits at console.anthropic.com.'
        if (errMsg.includes('rate_limit') || errMsg.includes('rate limit'))
          errMsg = 'Too many requests — please wait 30 seconds and try again.'
        if (errMsg.includes('overloaded'))
          errMsg = 'AI is busy right now — please try again in a moment.'
        throw new Error(errMsg)
      }
      return d.result || d.text || ''
    } catch(e) {
      clearTimeout(timeout)
      if (e.name === 'AbortError') throw new Error('Request timed out — please check your connection and try again')
      throw e
    }
  }

  function parseJSON(raw) {
    let s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
    s = s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g,'')
    s = s.replace(/,\s*([\]}])/g,'$1')
    const a = s.indexOf('{'), b = s.lastIndexOf('}')
    if (a < 0 || b <= a) throw new Error('No JSON in response')
    try { return JSON.parse(s.slice(a,b+1)) }
    catch(e) {
      const lc = s.slice(a).lastIndexOf(',"')
      if (lc>0) { try { return JSON.parse(s.slice(a,a+lc)+']}') } catch(e2){} }
      throw new Error('Parse failed: '+e.message.slice(0,60))
    }
  }

  if (showSplash) return (
    <SplashScreen onDone={(skipToApp) => { 
      try { sessionStorage.setItem('coachiq_session_started','1') } catch(e){}
      try { localStorage.setItem('coachiq_ever_launched','1') } catch(e){}
      setShowSplash(false); if (skipToApp) setLaunched(true) 
    }} alreadyAuthed={launched} brand={brand} />
  )
  if (!launched && !guestMode) return (
    <Onboarding onLaunch={(c) => {
      if (c.guest) {
        setGuestMode(true)
        setGuestSport(c.sport || 'Football')
        setSport(c.sport || 'Football')
        setLaunched(true)
      } else {
        setCfg(c); if(c.sport) setSport(c.sport); setLaunched(true)
      }
    }} onBack={()=>setShowSplash(true)} brand={brand} />
  )

  // First-time tutorial flow — skip for guest mode
  if (!guestMode && tutorialState === 'pending') return (
    <FirstTimeWelcome onChoice={(c)=>setTutorialState(c==='skip'?'done':c)} P={P} al={al} />
  )
  if (!guestMode && tutorialState === 'tour') return (
    <QuickTourModal onDone={()=>setTutorialState('done')} P={P} al={al} setPage={setPage} />
  )
  if (!guestMode && tutorialState === 'guide') return (
    <FeatureGuide P={P} al={al} onClose={()=>setTutorialState('done')} />
  )

  const NAV_ITEMS = [
    { id:'hub',     label:'HUB'     },
    { id:'team',    icon:'🏆', label:'TEAM'    },
    { id:'schemes', icon:'📋', label:'SCHEMES' },
    { id:'learn',   icon:'🎓', label:'LEARN'   },
  ]

  return (
    <>
      <Head>
        <title>CoachIQ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CoachIQ" />
        <meta name="application-name" content="CoachIQ" />
        <meta name="theme-color" content="#07090d" />
        <meta name="description" content="CoachIQ — Prepare. Lead. Inspire. The coaching platform built for youth sports." />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </Head>
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#07090d', color:'#f2f4f8', fontFamily:"'DM Sans', system-ui, sans-serif", colorScheme:'dark', overflowX:'hidden', position:'relative', maxWidth:'100vw' }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Barlow+Condensed:wght@400;600;700&family=Big+Shoulders+Display:wght@500;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
          * { box-sizing:border-box; margin:0; padding:0; }
          ::-webkit-scrollbar { width:4px; }
          ::-webkit-scrollbar-thumb { background:#1e2330; border-radius:0; }
          select, select option { background:#161922 !important; color:#f2f4f8 !important; forced-color-adjust:none !important; } @media (forced-colors: active) { select { background:#161922 !important; color:#f2f4f8 !important; } }
          select:focus { outline:none !important; box-shadow:none !important; }
          select option:checked { background:#1e2330 !important; }
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
          @keyframes logoReveal { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
          @keyframes ctaReveal { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
          /* ── GLOBAL INPUT RESET — applies on ALL devices ── */
          input, select, textarea {
            -webkit-appearance: none !important;
            appearance: none !important;
            background-color: #161922 !important;
            color: #f2f4f8 !important;
            color-scheme: dark !important;
            border-radius: 4px;
            font-size: 16px;
          }
          input:focus, select:focus, textarea:focus {
            background-color: #161922 !important;
            color: #f2f4f8 !important;
            outline: none;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active,
          select:-webkit-autofill,
          textarea:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px #161922 inset !important;
            -webkit-text-fill-color: #f2f4f8 !important;
            caret-color: #f2f4f8 !important;
          }
          select option {
            background-color: #161922 !important;
            color: #f2f4f8 !important;
          }
          select:focus {
            outline: none;
            box-shadow: none;
          }
          /* Sel component native select — ensure readable on all platforms */
          select {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
          /* Desktop: reduce font size (mobile keeps 16px to prevent zoom) */
          @media (min-width: 768px) {
            input, select, textarea { font-size: 13px !important; }
            .scheme-grid { grid-template-columns: 1fr 1fr !important; }
          }
          button {
            -webkit-tap-highlight-color: transparent;
            touch-action: manipulation;
            user-select: none;
            -webkit-user-select: none;
          }
          a { -webkit-tap-highlight-color: transparent; }
          * { -webkit-text-size-adjust: 100%; }
          html, body, #__next { max-width: 100vw; overflow-x: hidden; }
          img, svg, video { max-width: 100%; height: auto; }
          @media (max-width: 480px) {
            .scheme-grid { grid-template-columns: 1fr !important; }
            .two-col { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* TOP BAR */}
        <div style={{ background:'#07090d', borderBottom:'1px solid #0e1220', padding:'10px 14px', display:'flex', alignItems:'center', gap:8, position:'relative', flexShrink:0 }}>
          {/* Smooth gradient blend using team colors */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${P}, ${S || '#002868'}, ${P}22)` }} />
          <CoachIQLogo size={22} brand={brand} />
          <div style={{ position:'relative', marginLeft:4 }}>
            <select value={sport} onChange={e=>{
              const newSport = e.target.value
              if (newSport !== sport && (teams[sport]||[]).length > 0) {
                if (window.confirm(`Switch to ${newSport}? Your active ${sport} team context will change.`)) setSport(newSport)
              } else {
                setSport(newSport)
              }
            }} style={{ background:'#161922', border:`1px solid ${al(P,0.35)}`, borderRadius:3, padding:'4px 22px 4px 6px', color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, letterSpacing:'0.3px', outline:'none', appearance:'none', cursor:'pointer', maxWidth:130 }}>
              {['Football','Basketball','Baseball','Soccer','Softball'].map(s=>(
                <option key={s} value={s}>{{ Football:'🏈', Basketball:'🏀', Baseball:'⚾', Soccer:'⚽', Softball:'🥎' }[s]} {s}</option>
              ))}
            </select>
            <span style={{ position:'absolute', right:7, top:'50%', transform:'translateY(-50%)', fontSize:9, color:P, pointerEvents:'none' }}>▾</span>
          </div>
          {/* NEWS TICKER */}
          <NewsTicker sport={sport} P={P} />
          <button onClick={()=>setPage('news')} style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(107,154,255,0.08)', border:'1px solid rgba(107,154,255,0.2)', borderRadius:3, padding:'4px 8px', cursor:'pointer', userSelect:'none', flexShrink:0, WebkitTapHighlightColor:'transparent' }}>
            <span style={{ fontSize:14 }}>📰</span>
          </button>
          <button onClick={()=>{ setPage('more'); }} title="Settings" style={{ display:'flex', alignItems:'center', background:'rgba(255,255,255,0.04)', border:'1px solid #1e2330', borderRadius:3, padding:'4px 7px', cursor:'pointer', flexShrink:0, WebkitTapHighlightColor:'transparent' }}>
            <span style={{ fontSize:14 }}>⚙️</span>
          </button>
          <TeamQuickSwitcher sport={sport} teams={teams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} setCfg={setCfg} setPage={setPage} P={P} al={al} iq={iq} />
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex:1, maxWidth:'min(640px, 100%)', margin:'0 auto', width:'100%', padding:'14px 14px 90px', display:'flex', flexDirection:'column', gap:14, background:'#07090d', overflowX:'hidden', boxSizing:'border-box' }}>
          {/* Guest banner — shown on every page in guest mode */}
          {guestMode && <GuestBanner onSignUp={()=>{ setGuestMode(false); setLaunched(false); setGuestDemoTeam(null) }} />}
          {page==='hub' && <HubPage P={P} S={S} al={al} sport={sport} cfg={cfg} teams={guestMode&&guestDemoTeam?{...teams,[sport]:[guestDemoTeam]}:teams} activeTeam={guestMode&&guestDemoTeam?{...activeTeam,[sport]:guestDemoTeam}:activeTeam} genHistory={genHistory} playbook={playbook} iq={iq} setPage={setPage} setActiveMode={setActiveMode} setLearnMode={setLearnMode} callAI={callAI} homeLocation={homeLocation} setTeams={setTeams} guestMode={guestMode} guestDemoTeam={guestDemoTeam} setGuestDemoTeam={setGuestDemoTeam} onGuestSignUp={()=>{ setGuestMode(false); setLaunched(false); setGuestDemoTeam(null) }} />}
          {page==='schemes' && (guestMode && guestSchemeCount >= 2
            ? <GuestGate feature="Scheme Generator" onSignUp={()=>{ setGuestMode(false); setLaunched(false); setGuestDemoTeam(null) }} />
            : <SchemesPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} playbook={playbook} setPlaybook={setPlaybook} genHistory={genHistory} setGenHistory={setGenHistory} iq={iq} setIQ={setIQ} guestMode={guestMode} guestSchemeCount={guestSchemeCount} setGuestSchemeCount={setGuestSchemeCount} />
          )}
          {page==='scout' && (guestMode
            ? <GuestGate feature="Scout Report" onSignUp={()=>{ setGuestMode(false); setLaunched(false); setGuestDemoTeam(null) }} />
            : <ScoutPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} />
          )}
          {page==='team' && (guestMode
            ? guestDemoTeam
              ? <GuestTeamPreview team={guestDemoTeam} sport={sport} P={P} S={S} al={al} onSignUp={()=>{ setGuestMode(false); setLaunched(false); setGuestDemoTeam(null) }} />
              : <GuestGate feature="Team Management" onSignUp={()=>{ setGuestMode(false); setLaunched(false); setGuestDemoTeam(null) }} />
            : <TeamPage P={P} S={S} al={al} sport={sport} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} callAI={callAI} parseJSON={parseJSON} setCfg={setCfg} setPage={setPage} playbook={playbook} />
          )}
          {page==='playbook' && (guestMode
            ? <GuestGate feature="Playbook" onSignUp={()=>{ setGuestMode(false); setLaunched(false); setGuestDemoTeam(null) }} />
            : <PlaybookPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} playbook={playbook} setPlaybook={setPlaybook} />
          )}
          {page==='news'  && <NewsPage  P={P} S={S} al={al} sport={sport} callAI={callAI} />}
          {page==='learn' && <LearnPage P={P} S={S} al={al} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} playbook={playbook} setPlaybook={setPlaybook} setPage={setPage} guestMode={guestMode} guestGauntletDone={guestGauntletDone} setGuestGauntletDone={setGuestGauntletDone} onGuestSignUp={()=>{ setGuestMode(false); setLaunched(false); setGuestDemoTeam(null) }} initialMode={learnMode} key={learnMode} />}
          {page==='more' && <MorePage P={P} S={S} al={al} cfg={cfg} setCfg={setCfg} brand={brand} setBrand={setBrand} sport={sport} homeLocation={homeLocation} setHomeLocation={setHomeLocation} callAI={callAI} activeTeam={activeTeam} setTeams={setTeams} scrollToLocation={scrollToLocation} currentTeam={currentTeam} />}
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:'min(640px,100%)', zIndex:50, background:'#07090d' }}>
          {/* Nav bar — 4 tabs, Hub first */}
          <div style={{ borderTop:'1px solid #0e1220', display:'flex', paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
            {/* C·IQ Hub button */}
            <div style={{ flex:1, position:'relative' }}>
              <button onClick={()=>setPage('hub')} style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 2px 5px', cursor:'pointer', gap:2, background:'none', border:'none', position:'relative', minHeight:54, WebkitTapHighlightColor:'transparent', touchAction:'manipulation' }}>
                {page==='hub' && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:28, height:2, background:'#C0392B', borderRadius:1 }} />}
                <div style={{ background:page==='hub'?'#C0392B':'#161922', border:`1px solid ${page==='hub'?'#C0392B':'#1e2330'}`, borderRadius:5, padding:'2px 7px', marginBottom:1 }}>
                  <span style={{ fontSize:11, fontWeight:900, color:'white', letterSpacing:'-0.5px', fontFamily:"'Barlow Condensed',sans-serif" }}>C·IQ</span>
                </div>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:page==='hub'?'#C0392B':'#5a6480', fontWeight:900, letterSpacing:'1px', textTransform:'uppercase' }}>HUB</span>
              </button>
            </div>
            {/* Other tabs */}
            {NAV_ITEMS.filter(n=>n.id!=='hub').map(({ id, icon, label }) => {
              const postponedCount = id === 'team' ? Object.values(teams).flat().reduce((sum, team) => sum + ((team?.schedule||[]).filter(e=>e._needsReschedule).length), 0) : 0
              return <NavButton key={id} id={id} icon={icon} label={label} isActive={page===id} P={P} al={al} setPage={setPage} badge={postponedCount} />
            })}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── TEAM MANAGER CARD ────────────────────────────────────────────────────────
function RosterSection({ team, P='#C0392B', al, teams, setTeams, sport }) {
  const players = team?.players || []
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newPos, setNewPos] = useState('')
  const [newNum, setNewNum] = useState('')
  const [posOpen, setPosOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editPosOpen, setEditPosOpen] = useState(false)

  const positions = {
    Football:   ['QB','RB','FB','WR','TE','OL','LT','LG','C','RG','RT','DL','DE','DT','NT','LB','MLB','OLB','CB','S','FS','SS','K','P','LS','H','KR','PR','Gunner','Upback','Personal Protector'],
    Basketball: ['PG','SG','SF','PF','C','6th Man','Shooting Specialist','Defensive Specialist'],
    Baseball:   ['P','C','1B','2B','3B','SS','LF','CF','RF','DH','Utility','Pinch Hitter','Pinch Runner','Closer','Setup','Long Relief'],
    Soccer:     ['GK','CB','LB','RB','LWB','RWB','CDM','CM','CAM','LM','RM','LW','RW','CF','ST','SS','Sweeper'],
    Softball:   ['P','C','1B','2B','3B','SS','LF','CF','RF','DP','FLEX','Utility'],
  }

  function updatePlayers(updated) {
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t, players:updated} : t) }))
  }

  function addPlayer() {
    if (!newFirstName.trim() && !newLastName.trim()) return
    const p = { id: Date.now(), firstName: newFirstName.trim(), lastName: newLastName.trim(), name: [newFirstName.trim(), newLastName.trim()].filter(Boolean).join(' '), position: newPos, number: newNum }
    updatePlayers([...players, p])
    setNewFirstName(''); setNewLastName(''); setNewPos(''); setNewNum('')
  }

  function removePlayer(id) { updatePlayers(players.filter(p=>p.id!==id)) }

  function startEdit(p) {
    setEditingId(p.id)
    setEditForm({ firstName:p.firstName||'', lastName:p.lastName||'', position:p.position||'', number:p.number||'' })
  }

  function saveEdit() {
    updatePlayers(players.map(p => p.id===editingId ? { ...p, ...editForm, name:[editForm.firstName,editForm.lastName].filter(Boolean).join(' ') } : p))
    setEditingId(null)
  }

  const posDropdown = (val, onChange, open, setOpen) => (
    <div onClick={()=>setOpen(o=>!o)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:val?'#f2f4f8':'#3d4559', fontFamily:'inherit', fontSize:12, cursor:'pointer', position:'relative', userSelect:'none' }}>
      {val||'—'}
      {open && (
        <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', top:'100%', left:0, right:0, background:'#161922', border:'1px solid #1e2330', borderRadius:4, zIndex:50, maxHeight:200, overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.8)' }}>
          {(positions[sport]||[]).map(pos => {
            const sel = val.split(',').map(s=>s.trim()).filter(Boolean)
            const isOn = sel.includes(pos)
            return (
              <div key={pos} onClick={()=>{ const cur=val.split(',').map(s=>s.trim()).filter(Boolean); onChange(isOn?cur.filter(p=>p!==pos).join(', '):[...cur,pos].slice(0,3).join(', ')) }} style={{ padding:'7px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, background:isOn?al(P,0.12):'transparent', borderBottom:'1px solid #1a1f2e' }}>
                <div style={{ width:13, height:13, borderRadius:3, border:`2px solid ${isOn?P:'#3d4559'}`, background:isOn?P:'#0f1219', flexShrink:0 }}/>
                <span style={{ fontSize:12, color:isOn?P:'#f2f4f8' }}>{pos}</span>
              </div>
            )
          })}
          <div onClick={()=>setOpen(false)} style={{ padding:'7px 12px', cursor:'pointer', fontSize:11, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, textAlign:'center', borderTop:'1px solid #1e2330' }}>✓ DONE</div>
        </div>
      )}
    </div>
  )

  return (
    <Card>
      <CardHead icon="👥" title="Roster" tag={`${players.length} players`} tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:7, marginBottom:12, alignItems:'end' }}>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>First</label>
            <input value={newFirstName||''} onChange={e=>setNewFirstName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPlayer()} placeholder="First" style={{ width:'100%', background:'#161922', border:`1px solid ${newFirstName?P:'#1e2330'}`, borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
          </div>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Last</label>
            <input value={newLastName||''} onChange={e=>setNewLastName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPlayer()} placeholder="Last" style={{ width:'100%', background:'#161922', border:`1px solid ${newLastName?P:'#1e2330'}`, borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
          </div>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Pos</label>
            {posDropdown(newPos, setNewPos, posOpen, setPosOpen)}
          </div>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>#</label>
            <input value={newNum} onChange={e=>setNewNum(e.target.value)} placeholder="00" maxLength={2} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', textAlign:'center' }} />
          </div>
          <button onClick={addPlayer} style={{ padding:'8px 12px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', marginTop:18 }}>+</button>
        </div>
        {players.length === 0 ? (
          <div style={{ textAlign:'center', padding:'20px 0', color:'#5a6480', fontSize:12 }}>No players added yet</div>
        ) : (
          <div>
            {players.map(p => (
              <div key={p.id}>
                {editingId === p.id ? (
                  <div style={{ background:'#161922', border:`1px solid ${P}`, borderRadius:6, padding:'10px 12px', marginBottom:6 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:6, marginBottom:8 }}>
                      <div>
                        <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>First</label>
                        <input value={editForm.firstName} onChange={e=>setEditForm(f=>({...f,firstName:e.target.value}))} style={{ width:'100%', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'6px 8px', color:'#f2f4f8', fontSize:12, outline:'none' }} />
                      </div>
                      <div>
                        <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Last</label>
                        <input value={editForm.lastName} onChange={e=>setEditForm(f=>({...f,lastName:e.target.value}))} style={{ width:'100%', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'6px 8px', color:'#f2f4f8', fontSize:12, outline:'none' }} />
                      </div>
                      <div>
                        <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>Pos</label>
                        {posDropdown(editForm.position, v=>setEditForm(f=>({...f,position:v})), editPosOpen, setEditPosOpen)}
                      </div>
                      <div>
                        <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:3, display:'block' }}>#</label>
                        <input value={editForm.number} onChange={e=>setEditForm(f=>({...f,number:e.target.value}))} maxLength={2} style={{ width:'100%', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'6px 8px', color:'#f2f4f8', fontSize:12, outline:'none', textAlign:'center' }} />
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>setEditingId(null)} style={{ flex:1, padding:'7px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>CANCEL</button>
                      <button onClick={saveEdit} style={{ flex:2, padding:'7px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>SAVE CHANGES</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, marginBottom:6 }}>
                    {p.number && <div style={{ width:28, height:28, borderRadius:'50%', background:al(P,0.15), border:`1px solid ${al(P,0.3)}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:13, color:P, flexShrink:0 }}>{p.number}</div>}
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, color:'#f2f4f8', fontWeight:500 }}>{p.lastName ? p.lastName+', '+p.firstName : p.name}</div>
                      {p.position&&<div style={{ fontSize:10, color:'#8a94b0' }}>{p.position}</div>}
                    </div>
                    <button onClick={()=>startEdit(p)} style={{ background:'transparent', border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, cursor:'pointer', fontSize:10, padding:'4px 8px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>EDIT</button>
                    <button onClick={()=>removePlayer(p.id)} style={{ background:'transparent', border:'none', color:'#5a6480', cursor:'pointer', fontSize:16, padding:'0 4px' }}>×</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

function PracticePlanSection({ team, P='#C0392B', S='#002868', al, callAI, parseJSON, sport, teams, setTeams }) {
  const plans = team?.practicePlans || []

  function updateTeam(updates) {
    if (!team || !setTeams) return
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t,...updates} : t) }))
  }

  function setPlanLinked(planId, evtId) {
    updateTeam({ practicePlans: plans.map(p => p.id===planId ? {...p,_linkedTo:evtId} : p) })
  }

  const [generating, setGenerating] = useState(false)
  const [planForm, setPlanForm] = useState({ focus:'', duration:'90 minutes', intensity:'Medium', opponent:'', date:'' })
  const [showForm, setShowForm] = useState(false)

  const focusOpts = {
    Football: ['Balanced / Full Team','Offense Only','Defense Only','Special Teams','Red Zone','Two-Minute Drill','Goal Line','Opening Drive','Game Preparation'],
    Basketball: ['Balanced / Full Team','Offense Only','Defense Only','Press Break','Transition','End of Game Situations','Free Throws','Post Play','Perimeter'],
    Baseball: ['Balanced / Full Team','Hitting Only','Pitching / Bullpen','Fielding / Defense','Baserunning','Situations','Batting Practice','Infield / Outfield'],
    Soccer: ['Balanced / Full Team','Attacking','Defending','Set Pieces','Transition','Pressing','Finishing','Passing & Possession'],
    Softball: ['Balanced / Full Team','Hitting Only','Pitching / Bullpen','Fielding / Defense','Baserunning','Situations'],
  }

  async function generatePlan() {
    setGenerating(true)
    const ctx = `Team: ${team.name}, Sport: ${sport}, Season: ${team.season}, Players: ${(team.players||[]).length} on roster.`
    const inputs = `Focus: ${planForm.focus||'Balanced'}, Duration: ${planForm.duration}, Intensity: ${planForm.intensity}${planForm.opponent?', Upcoming opponent: '+planForm.opponent:''}.`
    try {
      const raw = await callAI(`You are an elite youth ${sport.toLowerCase()} coach. Generate a detailed practice plan. ${ctx} ${inputs} Return ONLY valid JSON: {"title":"practice plan name","date":"${planForm.date||'Next Practice'}","duration":"${planForm.duration}","warmup":{"time":"X min","activities":["activity 1","activity 2"]},"segments":[{"name":"segment name","time":"X min","drill":"drill name","purpose":"why","coaching":"key coaching point","reps":"how many reps or time"},{"name":"segment 2","time":"X min","drill":"drill name","purpose":"why","coaching":"key coaching point","reps":"reps"},{"name":"segment 3","time":"X min","drill":"drill name","purpose":"why","coaching":"key coaching point","reps":"reps"},{"name":"segment 4","time":"X min","drill":"drill name","purpose":"why","coaching":"key coaching point","reps":"reps"}],"teamPeriod":{"time":"X min","activity":"full team activity","notes":"coaching emphasis"},"cooldown":{"time":"X min","activity":"cooldown activity"},"coachNote":"motivational note for the team"}`)
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      const plan = { ...JSON.parse(s.slice(s.indexOf('{'),s.lastIndexOf('}')+1)), id: Date.now(), _form: planForm }
      updateTeam({ practicePlans: [plan, ...plans] })
      setShowForm(false)
    } catch(e) { console.error(e) }
    setGenerating(false)
  }

  function removePlan(id) {
    updateTeam({ practicePlans: plans.filter(p => p.id !== id) })
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
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:10 }}>
                <Sel label="Focus Area" value={planForm.focus||focusOpts[sport][0]} onChange={v=>setPlanForm(f=>({...f,focus:v}))} options={focusOpts[sport]||focusOpts.Football} />
                <Sel label="Duration" value={planForm.duration} onChange={v=>setPlanForm(f=>({...f,duration:v}))} options={['45 minutes','60 minutes','75 minutes','90 minutes','2 hours','2.5 hours']} />
                <Sel label="Intensity" value={planForm.intensity} onChange={v=>setPlanForm(f=>({...f,intensity:v}))} options={['Light / Recovery','Medium','High / Game Prep','Game Week Intensity']} />
                <div>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Practice Date</label>
                  <input value={planForm.date} onChange={e=>setPlanForm(f=>({...f,date:e.target.value}))} placeholder="e.g. Monday 4/21" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Upcoming Opponent <span style={{ color:'#5a6480' }}>(optional)</span></label>
                  <input value={planForm.opponent} onChange={e=>setPlanForm(f=>({...f,opponent:e.target.value}))} placeholder="e.g. Coventry Eagles" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>setShowForm(false)} style={{ flex:1, padding:'10px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
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
              <div style={{ fontSize:10, color:'#8a94b0', marginTop:1 }}>{plan.date} · {plan.duration}</div>
            </div>
            {!plan._linkedTo && (team.schedule||[]).filter(e=>e.type==='Practice').length > 0 && (
              <select onChange={e=>{ if(e.target.value) setPlanLinked(plan.id, parseInt(e.target.value)) }} style={{ fontSize:10, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:3, color:P, padding:'3px 6px', cursor:'pointer', colorScheme:'dark', maxWidth:130 }}>
                <option value="">Link to practice...</option>
                {(team.schedule||[]).filter(e=>e.type==='Practice').map(e=><option key={e.id} value={e.id}>{new Date(e.date+'T12:00:00').toLocaleDateString([],{month:'short',day:'numeric'})}{e.time?' '+e.time:''}</option>)}
              </select>
            )}
            {plan._linkedTo && <span style={{ fontSize:9, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>✓ LINKED</span>}
            <button onClick={()=>removePlan(plan.id)} style={{ background:'transparent', border:'none', color:'#5a6480', cursor:'pointer', fontSize:16, padding:'0 0 0 6px', flexShrink:0 }}>×</button>
          </div>
          <div style={{ padding:14 }}>
            {plan.warmup && <div style={{ padding:'8px 12px', background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:8, marginBottom:10 }}><div style={{ fontSize:9, letterSpacing:2, color:'#4ade80', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Warmup — {plan.warmup.time}</div>{(plan.warmup.activities||[]).map((a,i)=><div key={i} style={{ fontSize:11, color:'#f2f4f8', marginBottom:2 }}>• {a}</div>)}</div>}
            {(plan.segments||[]).map((seg,i) => (
              <div key={i} style={{ padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:8, marginBottom:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                  <div style={{ width:22, height:22, minWidth:22, background:al(P,0.15), border:`1px solid ${al(P,0.3)}`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:P }}>{i+1}</div>
                  <div><div style={{ fontSize:12, fontWeight:700, color:'#f2f4f8' }}>{seg.name}</div><div style={{ fontSize:10, color:'#8a94b0' }}>{seg.time} · {seg.reps}</div></div>
                </div>
                <div style={{ fontSize:11, color:'#dde1f0', marginBottom:4, fontWeight:600 }}>📍 {seg.drill}</div>
                <div style={{ fontSize:11, color:'#8a94b0', marginBottom:4 }}>Purpose: {seg.purpose}</div>
                <div style={{ fontSize:11, color:P, fontStyle:'italic' }}>Coach: "{seg.coaching}"</div>
              </div>
            ))}
            {plan.teamPeriod && <div style={{ padding:'10px 12px', background:al(P,0.08), border:`1px solid ${al(P,0.25)}`, borderRadius:8, marginBottom:8 }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Team Period — {plan.teamPeriod.time}</div><div style={{ fontSize:12, color:'#f2f4f8', fontWeight:600, marginBottom:3 }}>{plan.teamPeriod.activity}</div><div style={{ fontSize:11, color:'#8a94b0' }}>{plan.teamPeriod.notes}</div></div>}
            {plan.coachNote && <div style={{ padding:'8px 12px', background:'rgba(0,0,0,0.3)', borderRadius:8, borderLeft:`3px solid ${P}` }}><div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Coach's Note</div><div style={{ fontSize:12, color:'#f2f4f8', fontStyle:'italic' }}>"{plan.coachNote}"</div></div>}
            {/* Print button */}
            <button onClick={()=>{
              const win = window.open('','_blank')
              const html = `<html><head><title>${plan.title}</title><style>body{font-family:Arial,sans-serif;padding:24px;max-width:800px;margin:0 auto;color:#111}h1{font-size:22px;margin-bottom:4px}h2{font-size:14px;color:#666;margin-bottom:16px;font-weight:normal}.section{margin-bottom:16px;padding:12px;border:1px solid #ddd;border-radius:6px}.section-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#999;margin-bottom:6px;font-weight:bold}.drill{font-size:13px;font-weight:bold;margin-bottom:3px}.detail{font-size:12px;color:#555;margin-bottom:2px}.num{display:inline-block;width:22px;height:22px;background:#C0392B;color:white;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:bold;margin-right:8px}.footer{margin-top:20px;font-size:10px;color:#999;border-top:1px solid #eee;padding-top:8px}@media print{body{padding:12px}}</style></head><body>
              <h1>${plan.title}</h1><h2>${plan.date} · ${plan.duration}${team?.name?' · '+team.name:''}</h2>
              ${plan.warmup?`<div class="section"><div class="section-title">Warmup — ${plan.warmup.time}</div>${(plan.warmup.activities||[]).map(a=>`<div class="detail">• ${a}</div>`).join('')}</div>`:''}
              ${(plan.segments||[]).map((seg,i)=>`<div class="section"><div class="section-title">Segment ${i+1} — ${seg.time}</div><div class="drill"><span class="num">${i+1}</span>${seg.drill}</div><div class="detail">Purpose: ${seg.purpose}</div><div class="detail">Reps: ${seg.reps}</div><div class="detail" style="color:#C0392B">Coach: "${seg.coaching}"</div></div>`).join('')}
              ${plan.teamPeriod?`<div class="section"><div class="section-title">Team Period — ${plan.teamPeriod.time}</div><div class="drill">${plan.teamPeriod.activity}</div><div class="detail">${plan.teamPeriod.notes}</div></div>`:''}
              ${plan.coachNote?`<div class="section" style="border-left:3px solid #C0392B"><div class="section-title">Coach's Note</div><div class="detail" style="font-style:italic">"${plan.coachNote}"</div></div>`:''}
              <div class="footer">Generated by CoachIQ · ${new Date().toLocaleDateString()}</div>
              <script>window.onload=()=>window.print()</script></body></html>`
              win.document.write(html); win.document.close()
            }} style={{ width:'100%', marginTop:12, padding:'10px', background:'transparent', border:`1px solid ${al(P,0.4)}`, borderRadius:6, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:1 }}>🖨 PRINT PRACTICE PLAN</button>
          </div>
        </Card>
      ))}
    </div>
  )
}

function AnalyticsSection({ team, P='#C0392B', al, teams, setTeams, sport }) {
  const history = team?.gameHistory || []
  const schedule = team?.schedule || []
  const [expandedGame, setExpandedGame] = useState(null)
  const [editGame, setEditGame] = useState({})

  function updateTeam(updates) {
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t,...updates} : t) }))
  }

  function saveGameEdit(gameId) {
    const updated = history.map(g => g.id===gameId ? { ...g, ...editGame } : g)
    updateTeam({ gameHistory: updated })
    setExpandedGame(null); setEditGame({})
  }

  function deleteGame(gameId) {
    updateTeam({ gameHistory: history.filter(g => g.id!==gameId) })
    setExpandedGame(null)
  }

  const wins   = history.filter(g => g.us > g.them).length
  const losses = history.filter(g => g.us < g.them).length
  const ties   = history.filter(g => g.us === g.them && history.length > 0).length
  const gamesPlayed = history.length
  const ptsFor  = history.reduce((s,g) => s + (g.us||0), 0)
  const ptsAgainst = history.reduce((s,g) => s + (g.them||0), 0)
  const ppg    = gamesPlayed ? (ptsFor / gamesPlayed).toFixed(1) : '—'
  const papg   = gamesPlayed ? (ptsAgainst / gamesPlayed).toFixed(1) : '—'
  const winPct = gamesPlayed ? Math.round((wins/gamesPlayed)*100) : null
  const streak = (() => {
    if (!history.length) return null
    const sorted = [...history].sort((a,b) => new Date(b.date)-new Date(a.date))
    const last = sorted[0].us > sorted[0].them ? 'W' : sorted[0].us < sorted[0].them ? 'L' : 'T'
    let count = 1
    for (let i=1;i<sorted.length;i++) {
      const r = sorted[i].us > sorted[i].them ? 'W' : sorted[i].us < sorted[i].them ? 'L' : 'T'
      if (r===last) count++; else break
    }
    return { type:last, count }
  })()
  const upcomingGames = schedule.filter(e=>e.type==='Game' && new Date(e.date+'T23:59:59')>=new Date()).length
  const rosterSize = team?.players?.length || 0

  const statCard = (icon, val, label, color=P, sub=null) => (
    <div style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:8, padding:'14px 12px' }}>
      <div style={{ fontSize:18, marginBottom:3 }}>{icon}</div>
      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:28, color, lineHeight:1, marginBottom:2 }}>{val}</div>
      <div style={{ fontSize:10, color:'#8a94b0', lineHeight:1.3 }}>{label}</div>
      {sub && <div style={{ fontSize:9, color:'#5a6480', marginTop:2 }}>{sub}</div>}
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <Card>
        <CardHead icon="📊" title="Season Record" tag={gamesPlayed ? `${gamesPlayed} games` : 'No games yet'} tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ background:'#0d1117', borderRadius:8, padding:'16px', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', gap:0 }}>
            <div style={{ textAlign:'center', flex:1 }}>
              <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:56, fontWeight:900, color:'#4ade80', lineHeight:1 }}>{wins}</div>
              <div style={{ fontSize:10, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2 }}>WINS</div>
            </div>
            <div style={{ textAlign:'center', flex:1 }}>
              <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:56, fontWeight:900, color:'#e74c3c', lineHeight:1 }}>{losses}</div>
              <div style={{ fontSize:10, color:'#e74c3c', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2 }}>LOSSES</div>
            </div>
            {ties > 0 && (
              <div style={{ textAlign:'center', flex:1 }}>
                <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:56, fontWeight:900, color:'#f59e0b', lineHeight:1 }}>{ties}</div>
                <div style={{ fontSize:10, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2 }}>TIES</div>
              </div>
            )}
          </div>

          {gamesPlayed > 0 && (
            <div style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>WIN RATE</span>
                <span style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800 }}>{winPct}%</span>
              </div>
              <div style={{ height:6, background:'#1e2330', borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${winPct}%`, background:winPct>=50?P:'#e74c3c', borderRadius:3, transition:'width 0.6s ease' }} />
              </div>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:gamesPlayed?12:0 }}>
            {statCard('⚡', ppg, 'Points Per Game', P, gamesPlayed?`${ptsFor} total pts for`:null)}
            {statCard('🛡', papg, 'Points Allowed/Game', '#e74c3c', gamesPlayed?`${ptsAgainst} total pts against`:null)}
            {statCard('📅', upcomingGames, 'Games Remaining', '#6b9fff')}
            {statCard('👥', rosterSize, 'Roster Players', '#c084fc')}
            {streak && statCard(
              streak.type==='W'?'🔥':streak.type==='L'?'❄️':'➡️',
              `${streak.count}${streak.type}`,
              'Current Streak',
              streak.type==='W'?'#4ade80':streak.type==='L'?'#e74c3c':'#f59e0b'
            )}
          </div>

          {/* Game log — inline editable */}
          {history.length > 0 && (
            <div>
              <div style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:8 }}>GAME RESULTS <span style={{ color:'#5a6480', fontWeight:400 }}>· tap to edit</span></div>
              {[...history].sort((a,b)=>new Date(b.date)-new Date(a.date)).map((g,i)=>{
                const result = g.us>g.them?'W':g.us<g.them?'L':'T'
                const rc = result==='W'?'#4ade80':result==='L'?'#e74c3c':'#f59e0b'
                const isExpanded = expandedGame === g.id
                return (
                  <div key={g.id||i} style={{ background:'#161922', border:`1px solid #1e2330`, borderRadius:6, marginBottom:6, borderLeft:`3px solid ${rc}`, overflow:'hidden' }}>
                    <div onClick={()=>{ setExpandedGame(isExpanded?null:g.id); setEditGame({ opponent:g.opponent, date:g.date, us:g.us, them:g.them }) }} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', cursor:'pointer' }}>
                      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:16, color:rc, width:16, textAlign:'center' }}>{result}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, color:'#f2f4f8', fontWeight:600 }}>{g.opponent}</div>
                        <div style={{ fontSize:10, color:'#8a94b0' }}>{g.date ? new Date(g.date+'T12:00:00').toLocaleDateString([],{month:'short',day:'numeric'}) : ''}</div>
                      </div>
                      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:16, color:'#f2f4f8' }}>{g.us}–{g.them}</div>
                      <span style={{ fontSize:10, color:'#5a6480', marginLeft:4 }}>{isExpanded?'▲':'✏️'}</span>
                    </div>
                    {isExpanded && (
                      <div style={{ borderTop:'1px solid #1e2330', padding:'10px 12px', background:'rgba(255,255,255,0.02)' }}>
                        <div style={{ fontSize:9, color:'#8a94b0', letterSpacing:2, fontWeight:700, marginBottom:8 }}>EDIT GAME</div>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
                          <div style={{ gridColumn:'1/-1' }}>
                            <label style={{ fontSize:9, color:'#8a94b0', display:'block', marginBottom:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>Opponent</label>
                            <input value={editGame.opponent||''} onChange={e=>setEditGame(g=>({...g,opponent:e.target.value}))} style={{ width:'100%', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:14, outline:'none' }} />
                          </div>
                          <div>
                            <label style={{ fontSize:9, color:'#8a94b0', display:'block', marginBottom:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>Date</label>
                            <input type="date" value={editGame.date||''} onChange={e=>setEditGame(g=>({...g,date:e.target.value}))} style={{ width:'100%', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:14, outline:'none' }} />
                          </div>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                            <div>
                              <label style={{ fontSize:9, color:'#4ade80', display:'block', marginBottom:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>Us</label>
                              <input type="number" min="0" value={editGame.us??''} onChange={e=>setEditGame(g=>({...g,us:Number(e.target.value)}))} style={{ width:'100%', background:'#0f1219', border:'1px solid rgba(74,222,128,0.3)', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:14, outline:'none', textAlign:'center' }} />
                            </div>
                            <div>
                              <label style={{ fontSize:9, color:'#e74c3c', display:'block', marginBottom:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>Them</label>
                              <input type="number" min="0" value={editGame.them??''} onChange={e=>setEditGame(g=>({...g,them:Number(e.target.value)}))} style={{ width:'100%', background:'#0f1219', border:'1px solid rgba(239,68,68,0.3)', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:14, outline:'none', textAlign:'center' }} />
                            </div>
                          </div>
                        </div>
                        <div style={{ display:'flex', gap:6 }}>
                          <button onClick={()=>{ setExpandedGame(null); setEditGame({}) }} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>CANCEL</button>
                          <button onClick={()=>deleteGame(g.id)} style={{ flex:1, padding:'8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:4, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>DELETE</button>
                          <button onClick={()=>saveGameEdit(g.id)} style={{ flex:2, padding:'8px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>SAVE CHANGES</button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {gamesPlayed === 0 && (
            <div style={{ textAlign:'center', padding:'18px 0', color:'#5a6480', fontSize:12 }}>
              No games recorded yet. Use Live Scoring to track your games and stats will appear here automatically.
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function PrintSection({ team, P='#C0392B', S='#002868', al, callAI, sport, playbook={} }) {
  // Read plays from app-level playbook[sport] — this is where saved plays live
  const sportPlaybook = playbook[sport] || {}
  const plays = Object.entries(sportPlaybook).reduce((acc, [folder, arr]) => {
    ;(arr||[]).forEach(p => { if (!acc.find(x=>x.name===p.name)) acc.push({...p, folder}) })
    return acc
  }, [])

  // Config state — mirrors Playmaker X options
  const [printType, setPrintType] = useState('wristband')
  const [wristWidth, setWristWidth] = useState('4.5')
  const [wristHeight, setWristHeight] = useState('2.25')
  const [playsPerCard, setPlaysPerCard] = useState(8)
  const [displayMode, setDisplayMode] = useState('text') // 'text' | 'both'
  const [labelStyle, setLabelStyle] = useState('number_name') // 'number' | 'name' | 'number_name'
  const [groupBy, setGroupBy] = useState('folder') // 'folder' | 'type' | 'all'
  const [selectedFolders, setSelectedFolders] = useState([])
  const [showPreview, setShowPreview] = useState(false)
  const [activeTab, setActiveTab] = useState('config') // 'config' | 'select'

  const allFolders = [...new Set((plays||[]).map(p=>p.folder).filter(Boolean))]
  const activeFolders = selectedFolders.length ? selectedFolders : allFolders
  const selectedPlays = plays.filter(p => !selectedFolders.length || selectedFolders.includes(p.folder))

  function toggleFolder(f) {
    setSelectedFolders(prev => prev.includes(f) ? prev.filter(x=>x!==f) : [...prev, f])
  }

  function getPlayLabel(play, idx) {
    const num = play.number ? `#${play.number}` : `${idx+1}`
    const name = play.name || 'Play'
    if (labelStyle === 'number') return num
    if (labelStyle === 'name') return name
    return `${num} ${name}`
  }

  function buildPrintHTML() {
    const chunks = []
    for (let i = 0; i < selectedPlays.length; i += playsPerCard) {
      chunks.push(selectedPlays.slice(i, i + playsPerCard))
    }

    const cardW = wristWidth + 'in'
    const cardH = wristHeight + 'in'
    const fontSize = playsPerCard <= 4 ? '13px' : playsPerCard <= 6 ? '11px' : '10px'
    const lineH = playsPerCard <= 4 ? '1.8' : '1.5'

    const cards = chunks.map((chunk, ci) => {
      const rows = chunk.map((play, i) => {
        const label = getPlayLabel(play, i)
        const note = play.note ? ` — ${play.note}` : ''
        const typeTag = play.type ? `<span style="color:#888;font-size:9px;margin-left:4px">[${play.type}]</span>` : ''
        return `<div style="display:flex;align-items:flex-start;gap:6px;padding:2px 0;border-bottom:1px solid #eee">
          <span style="font-weight:700;min-width:20px;font-size:${fontSize}">${i+1}.</span>
          <span style="font-size:${fontSize};line-height:${lineH};flex:1"><strong>${label}</strong>${typeTag}<br><span style="color:#555;font-size:9px">${note}</span></span>
        </div>`
      }).join('')

      const header = groupBy === 'folder' && chunk[0]?.folder
        ? `<div style="background:${P};color:white;padding:3px 8px;font-weight:700;font-size:10px;letter-spacing:1px;text-transform:uppercase;margin-bottom:4px">${chunk[0].folder}</div>`
        : ''

      return `<div style="width:${cardW};height:${cardH};border:1.5px solid #333;border-radius:4px;padding:6px 8px;page-break-inside:avoid;display:inline-block;margin:4px;vertical-align:top;overflow:hidden;font-family:Arial,sans-serif;box-sizing:border-box">
        <div style="border-bottom:2px solid ${P};padding-bottom:3px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center">
          <span style="font-weight:900;font-size:11px;color:${P}">${team.name}</span>
          <span style="font-size:9px;color:#888">Card ${ci+1}</span>
        </div>
        ${header}
        ${rows}
      </div>`
    }).join('\n')

    return `<!DOCTYPE html><html><head><title>${team.name} — Wristband</title>
    <style>
      body { margin:0; padding:12px; background:white; font-family:Arial,sans-serif; }
      @media print {
        body { padding:4px; }
        @page { margin:0.4in; size:letter; }
      }
    </style></head><body>
    <div style="margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid ${P}">
      <strong style="font-size:14px">${team.name}</strong>
      <span style="font-size:11px;color:#666;margin-left:8px">${sport} · ${team.season||''}</span>
      <span style="font-size:10px;color:#aaa;float:right">Generated by CoachIQ · ${new Date().toLocaleDateString()}</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      ${cards}
    </div>
    <script>window.onload=()=>window.print()<\/script>
    </body></html>`
  }

  function openPrint() {
    const html = buildPrintHTML()
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close() }
  }

  const noPlays = !plays || plays.length === 0

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <Card>
        <CardHead icon="🖨" title="Print & Wristbands" accent={P} />
        <div style={{ padding:14 }}>

          {/* Print type selector */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6, marginBottom:14 }}>
            {[
              { id:'wristband', icon:'📿', label:'Wristband Cards', desc:'Play call strips for players' },
              { id:'coach',     icon:'🗂', label:'Coach Sheet',     desc:'Sideline reference card' },
              { id:'playbook',  icon:'📋', label:'Playbook Sheet',  desc:'Full play list by category' },
              { id:'practice',  icon:'📆', label:'Practice Plan',   desc:'Today\'s practice schedule' },
            ].map(pt => (
              <div key={pt.id} onClick={()=>setPrintType(pt.id)} style={{ padding:'10px 12px', background:printType===pt.id?al(P,0.12):'#161922', border:`1px solid ${printType===pt.id?P:'#1e2330'}`, borderRadius:6, cursor:'pointer' }}>
                <div style={{ fontSize:16, marginBottom:3 }}>{pt.icon}</div>
                <div style={{ fontSize:12, fontWeight:700, color:'#f2f4f8', marginBottom:2 }}>{pt.label}</div>
                <div style={{ fontSize:10, color:'#8a94b0' }}>{pt.desc}</div>
              </div>
            ))}
          </div>

          {/* Wristband config — only shown for wristband type */}
          {printType === 'wristband' && (
            <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:8, padding:14, marginBottom:12 }}>
              <div style={{ fontSize:9, letterSpacing:2, color:'#8a94b0', fontWeight:700, textTransform:'uppercase', marginBottom:12 }}>Wristband Options</div>

              {/* Tab: Config / Select Plays */}
              <div style={{ display:'flex', gap:6, marginBottom:14 }}>
                {[['config','⚙️ Options'],['select','✅ Select Plays']].map(([id,lbl])=>(
                  <button key={id} onClick={()=>setActiveTab(id)} style={{ flex:1, padding:'7px', borderRadius:5, fontSize:11, border:`1px solid ${activeTab===id?P:'#1e2330'}`, background:activeTab===id?al(P,0.15):'transparent', color:activeTab===id?P:'#8a94b0', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{lbl}</button>
                ))}
              </div>

              {activeTab === 'config' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {/* Width */}
                  <div>
                    <div style={{ fontSize:10, color:'#8a94b0', marginBottom:6 }}>Width (inches)</div>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {['3','3.5','4','4.5','5'].map(w=>(
                        <button key={w} onClick={()=>setWristWidth(w)} style={{ padding:'6px 12px', borderRadius:4, fontSize:11, border:`1px solid ${wristWidth===w?P:'#1e2330'}`, background:wristWidth===w?al(P,0.2):'#161922', color:wristWidth===w?P:'#8a94b0', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{w}"</button>
                      ))}
                    </div>
                  </div>

                  {/* Height */}
                  <div>
                    <div style={{ fontSize:10, color:'#8a94b0', marginBottom:6 }}>Height (inches)</div>
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {['2','2.25','2.5','3'].map(h=>(
                        <button key={h} onClick={()=>setWristHeight(h)} style={{ padding:'6px 12px', borderRadius:4, fontSize:11, border:`1px solid ${wristHeight===h?P:'#1e2330'}`, background:wristHeight===h?al(P,0.2):'#161922', color:wristHeight===h?P:'#8a94b0', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{h}"</button>
                      ))}
                    </div>
                  </div>

                  {/* Plays per card */}
                  <div>
                    <div style={{ fontSize:10, color:'#8a94b0', marginBottom:6 }}>Plays per card</div>
                    <div style={{ display:'flex', gap:5 }}>
                      {[4,6,8,10].map(n=>(
                        <button key={n} onClick={()=>setPlaysPerCard(n)} style={{ flex:1, padding:'7px', borderRadius:4, fontSize:12, border:`1px solid ${playsPerCard===n?P:'#1e2330'}`, background:playsPerCard===n?al(P,0.2):'#161922', color:playsPerCard===n?P:'#8a94b0', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{n}</button>
                      ))}
                    </div>
                  </div>

                  {/* Label style */}
                  <div>
                    <div style={{ fontSize:10, color:'#8a94b0', marginBottom:6 }}>Play label style</div>
                    <div style={{ display:'flex', gap:5 }}>
                      {[['number','# Only'],['name','Name Only'],['number_name','# + Name']].map(([id,lbl])=>(
                        <button key={id} onClick={()=>setLabelStyle(id)} style={{ flex:1, padding:'7px 4px', borderRadius:4, fontSize:10, border:`1px solid ${labelStyle===id?P:'#1e2330'}`, background:labelStyle===id?al(P,0.2):'#161922', color:labelStyle===id?P:'#8a94b0', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, textAlign:'center' }}>{lbl}</button>
                      ))}
                    </div>
                  </div>

                  {/* Group by */}
                  <div>
                    <div style={{ fontSize:10, color:'#8a94b0', marginBottom:6 }}>Group by</div>
                    <div style={{ display:'flex', gap:5 }}>
                      {[['folder','Folder'],['type','Play Type'],['all','No grouping']].map(([id,lbl])=>(
                        <button key={id} onClick={()=>setGroupBy(id)} style={{ flex:1, padding:'7px 4px', borderRadius:4, fontSize:10, border:`1px solid ${groupBy===id?P:'#1e2330'}`, background:groupBy===id?al(P,0.2):'#161922', color:groupBy===id?P:'#8a94b0', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, textAlign:'center' }}>{lbl}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'select' && (
                <div>
                  <div style={{ fontSize:10, color:'#8a94b0', marginBottom:8 }}>Select folders to include (all selected by default)</div>
                  {allFolders.length === 0 && <div style={{ fontSize:11, color:'#5a6480', textAlign:'center', padding:'12px 0' }}>No saved plays yet. Add plays to your playbook first.</div>}
                  {allFolders.map(f => {
                    const count = plays.filter(p=>p.folder===f).length
                    const selected = !selectedFolders.length || selectedFolders.includes(f)
                    return (
                      <div key={f} onClick={()=>toggleFolder(f)} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', background:selected?al(P,0.08):'#161922', border:`1px solid ${selected?al(P,0.3):'#1e2330'}`, borderRadius:5, marginBottom:5, cursor:'pointer' }}>
                        <div style={{ width:16, height:16, borderRadius:3, border:`2px solid ${selected?P:'#3d4559'}`, background:selected?P:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          {selected && <span style={{ color:'white', fontSize:10, fontWeight:900 }}>✓</span>}
                        </div>
                        <div style={{ flex:1, fontSize:12, color:'#f2f4f8', fontWeight:600 }}>{f}</div>
                        <div style={{ fontSize:10, color:'#8a94b0' }}>{count} plays</div>
                      </div>
                    )
                  })}
                  {selectedPlays.length > 0 && (
                    <div style={{ marginTop:8, fontSize:10, color:'#4ade80', textAlign:'center' }}>{selectedPlays.length} plays selected · {Math.ceil(selectedPlays.length/playsPerCard)} card{Math.ceil(selectedPlays.length/playsPerCard)!==1?'s':''}</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Preview summary */}
          {printType === 'wristband' && selectedPlays.length > 0 && (
            <div style={{ background:'rgba(74,222,128,0.07)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:6, padding:'10px 12px', marginBottom:12 }}>
              <div style={{ fontSize:10, color:'#4ade80', fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, marginBottom:3 }}>READY TO PRINT</div>
              <div style={{ fontSize:11, color:'#f2f4f8' }}>{selectedPlays.length} plays · {Math.ceil(selectedPlays.length/playsPerCard)} wristband card{Math.ceil(selectedPlays.length/playsPerCard)!==1?'s':''} · {wristWidth}" × {wristHeight}"</div>
            </div>
          )}

          {printType === 'wristband' && noPlays && (
            <div style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:6, padding:'14px', marginBottom:12, textAlign:'center' }}>
              <div style={{ fontSize:12, color:'#5a6480' }}>No plays in playbook yet.</div>
              <div style={{ fontSize:11, color:'#8a94b0', marginTop:4 }}>Generate schemes and save plays to your playbook first.</div>
            </div>
          )}

          <button
            onClick={openPrint}
            disabled={printType === 'wristband' && noPlays}
            style={{ width:'100%', padding:'13px', background: printType==='wristband'&&noPlays ? '#3d4559' : P, border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor: printType==='wristband'&&noPlays ? 'not-allowed' : 'pointer', letterSpacing:'1.5px', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <span>🖨</span> OPEN PRINT DIALOG
          </button>
          <div style={{ marginTop:8, fontSize:10, color:'#5a6480', textAlign:'center' }}>Opens a print-ready page · Use your browser's Print dialog to save as PDF or print</div>
        </div>
      </Card>
    </div>
  )
}


// ─── TEAM PAGE ─────────────────────────────────────────────────────────────────
function TeamPage({ P='#C0392B', S='#002868', al, sport, teams, setTeams, activeTeam, setActiveTeam, callAI, parseJSON, setCfg, setPage, playbook={} }) {
  const [section, setSection] = useState('roster')
  const currentTeam = (teams[sport]||[]).find(t=>t.id===activeTeam[sport]?.id) || activeTeam[sport]
  const mascotObj = currentTeam ? (MASCOTS||[]).find(m=>m.id===currentTeam.mascot) : null

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#5a6480', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Team management</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Team</div>
      </div>

      <TeamManagerCard sport={sport} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} P={P} al={al} setCfg={setCfg} />

      {!currentTeam ? (
        <div style={{ marginTop:20, padding:'40px 20px', textAlign:'center', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🏆</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#8a94b0', letterSpacing:'1px', marginBottom:8 }}>No Team Selected</div>
          <div style={{ fontSize:12, color:'#5a6480', lineHeight:1.6 }}>Create or select a team above to access roster, schedule, practice plans, and more.</div>
        </div>
      ) : (
        <>
          {/* Slim team strip + tabs in one row */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, marginBottom:12, overflowX:'auto', paddingBottom:2, borderBottom:`1px solid ${al(P,0.15)}`, paddingBottom:10 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{mascotObj?.emoji||'🏆'}</span>
            <div style={{ flexShrink:0, minWidth:0 }}>
              <div style={{ fontFamily:(TEAM_FONTS||[]).find(f=>f.id===currentTeam.teamFont)?.style||"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:120 }}>{currentTeam.name}</div>
              <div style={{ fontSize:9, color:'#8a94b0', whiteSpace:'nowrap' }}>{currentTeam.season}</div>
            </div>
            <div style={{ width:1, height:28, background:'#1e2330', flexShrink:0 }} />
            <div style={{ display:'flex', gap:5, overflowX:'auto' }}>
              {[['roster','👥'],['schedule','📅'],['scoring','🏟'],['practice','📆'],['analytics','📊'],['print','🖨']].map(([s,ico])=>(
                <button key={s} onClick={()=>setSection(s)} style={{ flexShrink:0, padding:'6px 10px', borderRadius:4, fontSize:11, border:`1px solid ${section===s?P:'#1e2330'}`, background:section===s?al(P,0.15):'transparent', color:section===s?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
                  <span>{ico}</span>
                  <span style={{ textTransform:'uppercase', fontSize:10, letterSpacing:'0.5px' }}>{s.charAt(0).toUpperCase()+s.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          {section==='roster'   && <RosterSection   team={currentTeam} P={P} al={al} teams={teams} setTeams={setTeams} sport={sport} />}
          {section==='lineup'   && <LineupBuilder    team={currentTeam} sport={sport} P={P} S={S} al={al} teams={teams} setTeams={setTeams} />}
          {section==='schedule' && <ScheduleSection  team={currentTeam} P={P} al={al} teams={teams} setTeams={setTeams} sport={sport} />}
          {section==='scoring'  && <LiveScoringSection team={currentTeam} P={P} S={S} al={al} sport={sport} teams={teams} setTeams={setTeams} callAI={callAI} parseJSON={parseJSON} />}
          {section==='practice' && <PracticePlanSection team={currentTeam} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} teams={teams} setTeams={setTeams} />}
          {section==='analytics'&& <AnalyticsSection team={currentTeam} P={P} al={al} teams={teams} setTeams={setTeams} sport={sport} />}
          {section==='print'    && <PrintSection     team={currentTeam} P={P} S={S} al={al} callAI={callAI} sport={sport} playbook={playbook} />}
        </>
      )}
    </>
  )
}



// ─── CREATE-A-MASCOT BUILDER ──────────────────────────────────────────────────
function MascotBuilder({ P='#C0392B', al, onSave, onClose, currentColor }) {
  const [step, setStep] = useState(0) // 0=pick animal, 1=pick shape, 2=pick colors, 3=preview
  const [selected, setSelected] = useState({
    animal: null,
    shape: 'circle',
    primaryColor: currentColor || '#C0392B',
    secondaryColor: '#0f1219',
    label: '',
  })

  const ANIMAL_OPTIONS = [
    // Animals
    { id:'lion', emoji:'🦁', label:'Lion', cp:'1f981' },
    { id:'tiger', emoji:'🐯', label:'Tiger', cp:'1f42f' },
    { id:'bear', emoji:'🐻', label:'Bear', cp:'1f43b' },
    { id:'wolf', emoji:'🐺', label:'Wolf', cp:'1f43a' },
    { id:'eagle', emoji:'🦅', label:'Eagle', cp:'1f985' },
    { id:'shark', emoji:'🦈', label:'Shark', cp:'1f988' },
    { id:'dragon', emoji:'🐉', label:'Dragon', cp:'1f409' },
    { id:'snake', emoji:'🐍', label:'Snake', cp:'1f40d' },
    { id:'horse', emoji:'🐎', label:'Horse', cp:'1f40e' },
    { id:'gorilla', emoji:'🦍', label:'Gorilla', cp:'1f98d' },
    { id:'leopard', emoji:'🐆', label:'Leopard', cp:'1f406' },
    { id:'rhino', emoji:'🦏', label:'Rhino', cp:'1f98f' },
    { id:'croc', emoji:'🐊', label:'Gator', cp:'1f40a' },
    { id:'scorpion', emoji:'🦂', label:'Scorpion', cp:'1f982' },
    { id:'trex', emoji:'🦖', label:'T-Rex', cp:'1f996' },
    { id:'bat', emoji:'🦇', label:'Bat', cp:'1f987' },
    { id:'owl', emoji:'🦉', label:'Owl', cp:'1f989' },
    { id:'fox', emoji:'🦊', label:'Fox', cp:'1f98a' },
    { id:'mammoth', emoji:'🦣', label:'Mammoth', cp:'1f9a3' },
    { id:'boar', emoji:'🐗', label:'Boar', cp:'1f417' },
    // Symbols
    { id:'fire', emoji:'🔥', label:'Fire', cp:'1f525' },
    { id:'lightning', emoji:'⚡', label:'Lightning', cp:'26a1' },
    { id:'skull', emoji:'💀', label:'Skull', cp:'1f480' },
    { id:'sword', emoji:'🗡️', label:'Sword', cp:'1f5e1' },
    { id:'rocket', emoji:'🚀', label:'Rocket', cp:'1f680' },
    { id:'trident', emoji:'🔱', label:'Trident', cp:'1f531' },
    { id:'crown', emoji:'👑', label:'Crown', cp:'1f451' },
    { id:'axe', emoji:'🪓', label:'Axe', cp:'1fa93' },
    { id:'ghost', emoji:'👻', label:'Ghost', cp:'1f47b' },
    { id:'cyclone', emoji:'🌀', label:'Cyclone', cp:'1f300' },
  ]

  const SHAPE_OPTIONS = [
    { id:'circle', label:'Classic Circle', path:null },
    { id:'shield', label:'Shield', path:'M30 4 L54 14 L54 36 L30 56 L6 36 L6 14 Z' },
    { id:'diamond', label:'Diamond', path:'M30 4 L56 30 L30 56 L4 30 Z' },
    { id:'hex', label:'Hexagon', path:'M30 4 L54 17 L54 43 L30 56 L6 43 L6 17 Z' },
    { id:'star5', label:'Star', path:'M30 4 L35 22 L54 22 L39 33 L44 52 L30 41 L16 52 L21 33 L6 22 L25 22 Z' },
  ]

  const PRESET_COLORS = [
    '#C0392B','#e05c2b','#f59e0b','#2d7a2d','#1565C0','#7c3aed',
    '#0891b2','#be185d','#374151','#1a1a2e','#8B4513','#1a6b3a',
  ]

  function buildPreviewSVG(opts, size=80) {
    const mascot = MASCOT_SVGS[ANIMAL_OPTIONS.find(a=>a.id===opts.animal)?.id]
    if (!mascot) return ''
    const inner = mascot(opts.primaryColor)
    // For custom shapes, we just use the badge style but with a different shape
    return inner.replace('width:100%', `width:${size}px`).replace('height:100%', `height:${size}px`)
  }

  const steps = ['Pick Animal', 'Pick Colors', 'Add Label', 'Preview']

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.92)', zIndex:600, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'#0f1219', border:`1px solid ${al(P,0.4)}`, borderRadius:10, width:'100%', maxWidth:420, maxHeight:'90vh', overflow:'auto', animation:'fadeIn 0.2s' }}>
        {/* Header */}
        <div style={{ padding:'16px 16px 0', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:al(P,0.7), letterSpacing:'2px', textTransform:'uppercase' }}>Mascot Builder</div>
            <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:20, color:'#f2f4f8' }}>Create Your Mascot</div>
          </div>
          <button onClick={onClose} style={{ background:'#161922', border:'none', color:'#5a6480', cursor:'pointer', fontSize:20 }}>✕</button>
        </div>

        {/* Step indicator */}
        <div style={{ display:'flex', gap:4, padding:'12px 16px 0' }}>
          {steps.map((s,i) => (
            <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=step?P:'#1e2330', transition:'background 0.2s' }}/>
          ))}
        </div>
        <div style={{ padding:'4px 16px 12px', fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:al(P,0.8), fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>
          Step {step+1}: {steps[step]}
        </div>

        <div style={{ padding:'0 16px 16px' }}>

          {/* Step 0: Pick Animal */}
          {step === 0 && (
            <div>
              <div style={{ fontSize:11, color:'#8a94b0', marginBottom:12 }}>Choose the icon for your mascot badge.</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8 }}>
                {ANIMAL_OPTIONS.map(a => (
                  <div key={a.id} onClick={()=>setSelected(s=>({...s,animal:a.id}))}
                    style={{ padding:'8px 4px', borderRadius:6, border:`2px solid ${selected.animal===a.id?P:'#1e2330'}`, background:selected.animal===a.id?al(P,0.1):'#161922', cursor:'pointer', textAlign:'center', transition:'all 0.15s' }}>
                    <div style={{ fontSize:24, lineHeight:1.2 }}>{a.emoji}</div>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:selected.animal===a.id?P:'#6b7a96', fontWeight:700, marginTop:2 }}>{a.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Pick Colors */}
          {step === 1 && (
            <div>
              <div style={{ fontSize:11, color:'#8a94b0', marginBottom:14 }}>Set your mascot badge colors.</div>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#8a94b0', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:8, fontWeight:700 }}>Primary Color (ring + accent)</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:8 }}>
                  {PRESET_COLORS.map(c => (
                    <div key={c} onClick={()=>setSelected(s=>({...s,primaryColor:c}))}
                      style={{ width:32, height:32, borderRadius:4, background:c, cursor:'pointer', border:`3px solid ${selected.primaryColor===c?'white':'transparent'}`, transition:'border 0.15s' }}/>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <input type="color" value={selected.primaryColor} onChange={e=>setSelected(s=>({...s,primaryColor:e.target.value}))}
                    style={{ width:36, height:36, border:'none', borderRadius:4, cursor:'pointer', padding:0 }}/>
                  <span style={{ fontSize:11, color:'#8a94b0', fontFamily:'monospace' }}>Custom: {selected.primaryColor}</span>
                </div>
              </div>
              {/* Live preview */}
              <div style={{ textAlign:'center', padding:'16px', background:'#161922', borderRadius:8, border:'1px solid #1e2330' }}>
                <div style={{ display:'inline-block', width:80, height:80 }}
                  dangerouslySetInnerHTML={{ __html: MASCOT_SVGS[selected.animal]?.(selected.primaryColor) || '' }}/>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:'#8a94b0', marginTop:6 }}>Preview</div>
              </div>
            </div>
          )}

          {/* Step 2: Add Label */}
          {step === 2 && (
            <div>
              <div style={{ fontSize:11, color:'#8a94b0', marginBottom:14 }}>Optional: this label auto-fills from your team name. Leave blank to use the animal name.</div>
              <div style={{ marginBottom:16 }}>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, display:'block', marginBottom:6 }}>Badge Label (shows at bottom)</label>
                <input value={selected.label} onChange={e=>setSelected(s=>({...s,label:e.target.value.toUpperCase().slice(0,12)}))}
                  placeholder={ANIMAL_OPTIONS.find(a=>a.id===selected.animal)?.label?.toUpperCase() || 'TEAM NAME'}
                  style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'10px 12px', color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, letterSpacing:'2px', outline:'none' }}/>
                <div style={{ fontSize:10, color:'#5a6480', marginTop:4 }}>Max 12 characters · auto-UPPERCASE</div>
              </div>
              {/* Live preview */}
              <div style={{ textAlign:'center', padding:'16px', background:'#161922', borderRadius:8, border:'1px solid #1e2330' }}>
                <div style={{ display:'inline-block', width:80, height:80 }}
                  dangerouslySetInnerHTML={{ __html: MASCOT_SVGS[selected.animal]?.(selected.primaryColor) || '' }}/>
              </div>
            </div>
          )}

          {/* Step 3: Preview + Save */}
          {step === 3 && (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, color:'#8a94b0', marginBottom:16 }}>Your custom mascot is ready. Save it to use on your team.</div>
              <div style={{ display:'flex', justifyContent:'center', gap:16, marginBottom:16 }}>
                {[80, 52, 32].map(sz => (
                  <div key={sz}>
                    <div style={{ width:sz, height:sz, margin:'0 auto' }}
                      dangerouslySetInnerHTML={{ __html: MASCOT_SVGS[selected.animal]?.(selected.primaryColor) || '' }}/>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:'#5a6480', textAlign:'center', marginTop:4 }}>{sz}px</div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#161922', borderRadius:6, padding:'10px 14px', border:'1px solid #1e2330', marginBottom:16, textAlign:'left' }}>
                <div style={{ fontSize:10, color:'#8a94b0', marginBottom:4 }}>Mascot summary</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8' }}>
                  {ANIMAL_OPTIONS.find(a=>a.id===selected.animal)?.label} · {selected.primaryColor}
                </div>
                {selected.label && <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:P, marginTop:2 }}>Label: {selected.label}</div>}
              </div>
              <button onClick={()=>onSave({
                  type:'custom',
                  animalId: selected.animal,
                  primaryColor: selected.primaryColor,
                  label: selected.label || ANIMAL_OPTIONS.find(a=>a.id===selected.animal)?.label?.toUpperCase() || 'CUSTOM',
                  id: 'custom_'+Date.now(),
                  name: selected.label || ANIMAL_OPTIONS.find(a=>a.id===selected.animal)?.label || 'Custom',
                  svgFn: (col) => MASCOT_SVGS[selected.animal]?.(col || selected.primaryColor) || '',
                })}
                style={{ width:'100%', padding:'12px', background:P, border:'none', borderRadius:5, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:'1.5px', marginBottom:8 }}>
                SAVE MASCOT
              </button>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display:'flex', gap:8, marginTop:16 }}>
            {step > 0 && (
              <button onClick={()=>setStep(s=>s-1)}
                style={{ flex:1, padding:'10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>
                ← Back
              </button>
            )}
            {step < 3 && (
              <button onClick={()=>{ if(step===0&&!selected.animal) return; setStep(s=>s+1) }}
                disabled={step===0&&!selected.animal}
                style={{ flex:2, padding:'10px', background:step===0&&!selected.animal?'#2a3040':P, border:'none', borderRadius:5, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:step===0&&!selected.animal?'not-allowed':'pointer', opacity:step===0&&!selected.animal?0.5:1 }}>
                {step===0&&!selected.animal?'Select an animal first':'Next →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


// ─── MASCOT BUILDER ───────────────────────────────────────────────────────────

function TeamManagerCard({ sport, teams, setTeams, activeTeam, setActiveTeam, P='#C0392B', al, setCfg, onOpenTeamTab }) {
  const [mode, setMode] = useState('view')
  const [showMascotBuilder, setShowMascotBuilder] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [editingTeamId, setEditingTeamId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [form, setForm] = useState({ name:'', season:'', mascot:'eagles', teamFont:'kalam', hometown:'', primary:'#C0392B', secondary:'#002868', accent1:'#f59e0b', accent2:'#1565C0' })
  const [error, setError] = useState('')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const sportTeams = teams[sport] || []
  const current = activeTeam[sport]
  const MAX_TEAMS = 5
  const seasons = ['Fall 2025','Winter 2025','Spring 2026','Summer 2026','Fall 2026','Winter 2026','Spring 2027','Summer 2027','Year Round']
  const sportEmoji = { Football:'🏈', Basketball:'🏀', Baseball:'⚾' }

  function createTeam() {
    if (!form.name.trim()) { setError('Team name is required'); return }
    if (sportTeams.length >= MAX_TEAMS) { setError('Max '+MAX_TEAMS+' teams per sport'); return }
    const newTeam = { id:Date.now(), name:form.name.trim(), season:form.season||'Season N/A', mascot:form.mascot, teamFont:form.teamFont, hometown:form.hometown.trim(), primary:form.primary, secondary:form.secondary, accent1:form.accent1, accent2:form.accent2, sport, players:[], schedule:[] }
    setTeams(prev => ({ ...prev, [sport]:[...(prev[sport]||[]), newTeam] }))
    setActiveTeam(prev => ({ ...prev, [sport]:newTeam }))
    setCfg(prev => ({ ...prev, primary:newTeam.primary, secondary:newTeam.secondary }))
    setForm({ name:'', season:'', mascot:'eagles', teamFont:'kalam', hometown:'', primary:'#C0392B', secondary:'#002868', accent1:'#f59e0b', accent2:'#1565C0' })
    setMode('view'); setError('')
  }

  function startEditTeam(team) {
    setEditingTeamId(team.id)
    setEditForm({ name:team.name, season:team.season, hometown:team.hometown||'', primary:team.primary, secondary:team.secondary, accent1:team.accent1||'', accent2:team.accent2||'' })
  }

  function saveEditTeam() {
    setTeams(prev => ({
      ...prev,
      [sport]: (prev[sport]||[]).map(t => t.id===editingTeamId ? { ...t, ...editForm } : t)
    }))
    if (current?.id === editingTeamId) {
      setActiveTeam(prev => ({ ...prev, [sport]: { ...current, ...editForm } }))
      setCfg(prev => ({ ...prev, primary:editForm.primary, secondary:editForm.secondary }))
    }
    setEditingTeamId(null); setEditForm({})
  }

  function selectTeam(team) {
    setActiveTeam(prev => ({ ...prev, [sport]:team }))
    setCfg(prev => ({ ...prev, primary:team.primary, secondary:team.secondary }))
    setExpanded(false)
  }

  function deselectTeam() {
    setActiveTeam(prev => ({ ...prev, [sport]:null }))
    setExpanded(false)
  }

  function doDelete() {
    if (!deleteConfirm) return
    const updated = sportTeams.filter(t => t.id !== deleteConfirm.id)
    setTeams(prev => ({ ...prev, [sport]:updated }))
    if (current?.id === deleteConfirm.id) {
      const next = updated[0] || null
      setActiveTeam(prev => ({ ...prev, [sport]:next }))
      if (next) setCfg(prev => ({ ...prev, primary:next.primary, secondary:next.secondary }))
    }
    setDeleteConfirm(null)
  }

  const mascotObj = current ? (MASCOTS || []).find(m => m.id === current.mascot) : null
  const fontStyle = current ? ((TEAM_FONTS || []).find(f => f.id === current.teamFont)?.style || "'Barlow Condensed',sans-serif") : "'Barlow Condensed',sans-serif"

  return (
    <>
      {deleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#0f1219', border:'1px solid rgba(239,68,68,0.4)', borderRadius:8, padding:24, width:'100%', maxWidth:340 }}>
            <div style={{ fontSize:24, textAlign:'center', marginBottom:10 }}>⚠️</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, color:'#f2f4f8', textAlign:'center', marginBottom:6 }}>Delete Team?</div>
            <div style={{ fontSize:13, color:'#8a94b0', textAlign:'center', lineHeight:1.6, marginBottom:20 }}>This will permanently delete <span style={{ color:'#f2f4f8', fontWeight:600 }}>{deleteConfirm.name}</span>. This cannot be undone.</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:'11px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>CANCEL</button>
              <button onClick={doDelete} style={{ flex:1, padding:'11px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.5)', borderRadius:4, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>DELETE</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop:14 }}>
        <div onClick={()=>{
              if (current && onOpenTeamTab) {
                // Has team + on home page → go to team tab
                onOpenTeamTab()
              } else if (sportTeams.length === 0 && onOpenTeamTab) {
                // No teams + on home page → go to team tab to create
                onOpenTeamTab()
              } else if (sportTeams.length === 0 && !onOpenTeamTab) {
                // No teams + on team page → expand and open create form
                setExpanded(true)
                setMode('create')
              } else {
                // Has teams + on team page → toggle expand
                setExpanded(e=>!e)
              }
            }} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#0f1219', border:`1px solid ${current?al(P,0.3):'#1e2330'}`, borderRadius:expanded?'4px 4px 0 0':4, cursor:'pointer', borderLeft:`3px solid ${P}` }}>
          <MascotAvatar mascotId={current?.mascot} color={P} size={32} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:fontStyle, fontWeight:700, fontSize:current?15:13, color:'#f2f4f8', textTransform:'uppercase' }}>
              {current ? current.name : 'No '+sport+' Team Selected'}
            </div>
            {current && <div style={{ fontSize:10, color:'#8a94b0', marginTop:1 }}>{current.season}{current.hometown?' · '+current.hometown:''} · {sportTeams.length}/{MAX_TEAMS} teams</div>}
            {!current && <div style={{ fontSize:10, color:'#5a6480', marginTop:1 }}>Tap to create or select a team</div>}

          </div>
          {current && <div style={{ display:'flex', gap:3 }}>{[current.primary,current.secondary,current.accent1,current.accent2].filter(Boolean).map((c,i)=><div key={i} style={{ width:10,height:10,borderRadius:2,background:c }} />)}</div>}
          <span style={{ fontSize:12, color:'#8a94b0' }}>{expanded?'▲':'▼'}</span>
        </div>

        {expanded && (
          <div style={{ background:'#0d1017', border:`1px solid ${al(P,0.2)}`, borderTop:'none', borderRadius:'0 0 4px 4px', padding:14, animation:'fadeIn 0.2s ease' }}>
            {sportTeams.length > 0 && mode === 'view' && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:9, letterSpacing:2, color:'#8a94b0', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Your {sport} Teams</div>
                {sportTeams.map(team => {
                  const m = (MASCOTS||[]).find(x=>x.id===team.mascot)
                  const fs = (TEAM_FONTS||[]).find(f=>f.id===team.teamFont)?.style||"'Barlow Condensed',sans-serif"
                  const isEditing = editingTeamId === team.id
                  return (
                    <div key={team.id} style={{ background:current?.id===team.id?al(P,0.1):'#161922', border:`1px solid ${current?.id===team.id?al(P,0.4):'#1e2330'}`, borderRadius:6, marginBottom:6, overflow:'hidden' }}>
                      {!isEditing ? (
                        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', cursor:'pointer' }}>
                          <MascotAvatar mascotId={team.mascot} color={current?.id===team.id?P:'#607080'} size={32} />
                          <div style={{ flex:1 }} onClick={()=>{ selectTeam(team); setTimeout(()=>{ if(onOpenTeamTab) onOpenTeamTab() }, 50) }}>
                            <div style={{ fontFamily:fs, fontWeight:700, fontSize:13, color:'#f2f4f8' }}>{team.name}</div>
                            <div style={{ fontSize:10, color:'#8a94b0' }}>{team.season}{team.hometown?' · '+team.hometown:''}</div>
                          </div>
                          <div style={{ display:'flex', gap:4, alignItems:'center' }}>
                            {current?.id===team.id && <button onClick={deselectTeam} style={{ padding:'3px 7px', background:'rgba(107,154,255,0.1)', border:'1px solid rgba(107,154,255,0.3)', borderRadius:3, color:'#6b9fff', fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>DESELECT</button>}
                            <button onClick={()=>startEditTeam(team)} style={{ padding:'3px 7px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:3, color:'#f59e0b', fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>EDIT</button>
                            <button onClick={()=>setDeleteConfirm(team)} style={{ padding:'3px 7px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:3, color:'rgba(239,68,68,0.7)', fontSize:10, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>✕</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding:'12px' }}>
                          <div style={{ fontSize:9, color:'#f59e0b', letterSpacing:2, fontWeight:700, marginBottom:10 }}>EDIT TEAM</div>
                          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:8 }}>
                            <div>
                              <label style={{ fontSize:9, color:'#8a94b0', display:'block', marginBottom:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>Team Name</label>
                              <input value={editForm.name||''} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} style={{ width:'100%', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:14, outline:'none' }} />
                            </div>
                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                              <div>
                                <label style={{ fontSize:9, color:'#8a94b0', display:'block', marginBottom:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>Season</label>
                                <select value={editForm.season||''} onChange={e=>setEditForm(f=>({...f,season:e.target.value}))} style={{ width:'100%', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:13, outline:'none' }}>
                                  {seasons.map(s=><option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize:9, color:'#8a94b0', display:'block', marginBottom:4, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>Hometown</label>
                                <input value={editForm.hometown||''} onChange={e=>setEditForm(f=>({...f,hometown:e.target.value}))} style={{ width:'100%', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:14, outline:'none' }} />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize:9, color:'#8a94b0', display:'block', marginBottom:6, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1, textTransform:'uppercase' }}>Team Colors</label>
                              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
                                {[{key:'primary',label:'Primary'},{key:'secondary',label:'Secondary'},{key:'accent1',label:'Accent 1'},{key:'accent2',label:'Accent 2'}].map(({key,label})=>(
                                  <div key={key} style={{ textAlign:'center' }}>
                                    <input type="color" value={editForm[key]||'#C0392B'} onChange={e=>setEditForm(f=>({...f,[key]:e.target.value}))} style={{ width:'100%', height:32, border:'none', borderRadius:4, cursor:'pointer', padding:0 }} />
                                    <div style={{ fontSize:9, color:'#8a94b0', marginTop:2 }}>{label}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={()=>{ setEditingTeamId(null); setEditForm({}) }} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>CANCEL</button>
                            <button onClick={saveEditTeam} style={{ flex:2, padding:'8px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>SAVE CHANGES</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {mode === 'create' && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:12 }}>Create New Team</div>
                <div style={{ marginBottom:10 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Team Name *</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={'e.g. Tolland Youth '+sport} style={{ width:'100%', background:'#161922', border:`1px solid ${form.name?P:'#1e2330'}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:10 }}>
                  <Sel label="Season" value={form.season||seasons[0]} onChange={v=>setForm(f=>({...f,season:v}))} options={seasons} />
                  <div>
                    <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Hometown</label>
                    <CitySearch value={form.hometown} onChange={v=>setForm(f=>({...f,hometown:v}))} placeholder="e.g. Tolland, CT" P={P} al={al} />
                  </div>
                </div>
                <div onClick={()=>setShowMascotBuilder(true)} style={{ marginBottom:8, padding:'8px 12px', background:'linear-gradient(135deg,rgba(245,158,11,0.06),rgba(192,57,43,0.06))', border:'1px solid rgba(245,158,11,0.25)', borderRadius:6, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:15 }}>✏️</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, color:'#f59e0b', letterSpacing:'0.5px' }}>Create Custom Mascot</div>
                    <div style={{ fontSize:9, color:'#8a94b0', marginTop:1 }}>Design your own logo — Premium feature</div>
                  </div>
                  <span style={{ fontSize:13 }}>🔒</span>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:6, display:'block' }}>Team Mascot</label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:5, maxHeight:180, overflowY:'auto', padding:6, background:'#161922', borderRadius:6, border:'1px solid #1e2330' }}>
                    {(MASCOTS||[]).map(m=>{
                      const isLocked = m.tier === 'premium'
                      const isSelected = form.mascot === m.id
                      return (
                        <div key={m.id} onClick={()=>{ if(!isLocked) setForm(f=>({...f,mascot:m.id})); else setShowUpgrade(true) }} title={isLocked?m.name+' — Premium':m.name} style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'6px 2px', borderRadius:6, background:isSelected?al(P,0.2):isLocked?'rgba(255,255,255,0.02)':'transparent', border:`1px solid ${isSelected?P:isLocked?'rgba(255,255,255,0.06)':'transparent'}`, cursor:isLocked?'default':'pointer', position:'relative' }}>
                          <MascotAvatar mascotId={m.id} color={isSelected?P:'#607080'} size={36} locked={isLocked} />
                          <span style={{ fontSize:6, color:isLocked?'#2a3040':'#6b7a96', textAlign:'center', lineHeight:1.2, marginTop:2 }}>{m.name.slice(0,6)}</span>
                        </div>
                      )
                    })}
                  </div>
                  {showUpgrade && (
                    <div style={{ marginTop:8, padding:'8px 10px', background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:6, display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ fontSize:16 }}>⭐</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:11, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Premium Mascot</div>
                        <div style={{ fontSize:10, color:'#8a94b0' }}>40 more mascots available with CoachIQ Pro.</div>
                      </div>
                      <button onClick={()=>setShowUpgrade(false)} style={{ background:'#161922', border:'none', color:'#5a6480', cursor:'pointer', fontSize:14 }}>✕</button>
                    </div>
                  )}
                  {form.mascot && <div style={{ fontSize:10, color:P, marginTop:4, display:'flex', alignItems:'center', gap:6 }}><MascotAvatar mascotId={form.mascot} color={P} size={20}/> {(MASCOTS||[]).find(m=>m.id===form.mascot)?.name}</div>}
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:6, display:'block' }}>Team Name Font</label>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    {(TEAM_FONTS||[]).map(tf=>(
                      <div key={tf.id} onClick={()=>setForm(f=>({...f,teamFont:tf.id}))} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 12px', background:form.teamFont===tf.id?al(P,0.1):'#161922', border:`1px solid ${form.teamFont===tf.id?P:'#1e2330'}`, borderRadius:5, cursor:'pointer' }}>
                        <span style={{ fontFamily:tf.style, fontSize:15, color:'#f2f4f8', flex:1 }}>{form.name||'Team Name'}</span>
                        <span style={{ fontSize:9, color:'#8a94b0' }}>{tf.preview}</span>
                        {form.teamFont===tf.id && <span style={{ fontSize:11, color:'#4ade80' }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Create custom mascot button */}

                {/* Mascot Builder Modal */}
                {showMascotBuilder && <MascotBuilder P={P} al={al} onClose={()=>setShowMascotBuilder(false)} onSave={(customMascot)=>{ setForm(f=>({...f, mascot:customMascot.id, _customMascotSvg:customMascot.customSvg})); setShowMascotBuilder(false) }} />}
                {[['primary','Primary'],['secondary','Secondary'],['accent1','Accent 1'],['accent2','Accent 2']].map(([key,label])=>(
                  <div key={key} style={{ marginBottom:10 }}>
                    <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:5, display:'block' }}>{label} Color</label>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <input type="color" value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} style={{ width:34, height:34, border:'none', borderRadius:4, cursor:'pointer', padding:0 }} />
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {['#C0392B','#E8460C','#D4600A','#1B5E20','#0066CC','#7B1FA2','#C8A400','#1565C0','#880E4F','#00838F','#f59e0b','#374151'].map(c=>(
                          <div key={c} onClick={()=>setForm(f=>({...f,[key]:c}))} style={{ width:22,height:22,borderRadius:3,background:c,border:`2px solid ${form[key]===c?'white':'transparent'}`,cursor:'pointer' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ height:5, borderRadius:2, background:`linear-gradient(90deg,${form.primary} 25%,${form.secondary} 25%,${form.secondary} 50%,${form.accent1} 50%,${form.accent1} 75%,${form.accent2} 75%)`, marginBottom:12 }} />
                {error && <div style={{ fontSize:11, color:'#f87171', marginBottom:8 }}>{error}</div>}
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>{setMode('view');setError('')}} style={{ flex:1, padding:'10px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
                  <button onClick={createTeam} style={{ flex:2, padding:'10px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>CREATE TEAM</button>
                </div>
              </div>
            )}

            {mode === 'view' && sportTeams.length < MAX_TEAMS && (
              <button onClick={()=>setMode('create')} style={{ width:'100%', padding:'10px', background:'#0f1219', border:`1px dashed ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:'1px', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <span style={{ fontSize:16 }}>+</span> CREATE {sport.toUpperCase()} TEAM
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}


// ─── CITY SEARCH ─────────────────────────────────────────────────────────────
function CitySearch({ value, onChange, placeholder, P, al }) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    function h(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => { if (value !== query) setQuery(value || '') }, [value])

  function search(q) {
    setQuery(q)
    onChange(q)
    if (!q || q.length < 2) { setResults([]); setOpen(false); return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=8&featuretype=city&q='+encodeURIComponent(q), { headers:{'Accept-Language':'en'} })
        const data = await res.json()
        setResults(data || [])
        setOpen((data||[]).length > 0)
      } catch(e) { setResults([]) }
      setLoading(false)
    }, 100)
  }

  function select(item) {
    const a = item.address || {}
    const city = a.city||a.town||a.village||a.suburb||item.name||''
    const state = a.state||''
    const val = [city,state].filter(Boolean).join(', ')
    setQuery(val); onChange(val); setResults([]); setOpen(false)
  }

  return (
    <div ref={wrapRef} style={{ position:'relative' }}>
      <div style={{ position:'relative' }}>
        <input value={query} onChange={e=>search(e.target.value)} onFocus={()=>results.length>0&&setOpen(true)} placeholder={placeholder||'Search city or town...'} style={{ width:'100%', background:'#161922', border:`1px solid ${query?al(P,0.4):'#1e2330'}`, borderRadius:4, padding:'9px 32px 9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
        {loading ? <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:12, height:12, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.7s linear infinite' }}/> : <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:12, opacity:0.4 }}>🏙️</span>}
      </div>
      {open && results.length > 0 && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:'0 0 6px 6px', zIndex:100, maxHeight:180, overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.6)' }}>
          {results.map((item,i) => {
            const a = item.address||{}
            const city = a.city||a.town||a.village||item.name||''
            const state = a.state||''
            return (
              <div key={i} onMouseDown={()=>select(item)} style={{ padding:'8px 12px', borderBottom:i<results.length-1?'1px solid #1e2330':'none', cursor:'pointer' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={e=>e.currentTarget.style.background='#161922'}>
                <div style={{ fontSize:12, color:'#f2f4f8' }}>{city}{state?', '+state:''}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


// ─── ADDRESS SEARCH ───────────────────────────────────────────────────────────
function AddressSearch({ value, onChange, placeholder, P, al }) {
  const [query, setQuery] = useState(value || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const timerRef = useRef(null)
  const wrapRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handle(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    document.addEventListener('touchstart', handle)
    return () => { document.removeEventListener('mousedown', handle); document.removeEventListener('touchstart', handle) }
  }, [])

  // Sync if parent value changes
  useEffect(() => { if (value !== query) setQuery(value || '') }, [value])

  function search(q) {
    setQuery(q)
    if (!q.trim() || q.length < 3) { setResults([]); setOpen(false); return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=' + encodeURIComponent(q),
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        setResults(data || [])
        setOpen(data && data.length > 0)
      } catch(e) { setResults([]) }
      setLoading(false)
    }, 400)
  }

  function select(item) {
    const addr = item.address || {}
    // Build a clean display string
    const parts = []
    if (item.name && !item.display_name.startsWith(item.name + ',')) parts.push(item.name)
    if (addr.road) parts.push(addr.road)
    if (addr.house_number) parts[parts.length-1] = addr.house_number + ' ' + (addr.road || '')
    const city = addr.city || addr.town || addr.village || addr.county || ''
    const state = addr.state || ''
    const zip = addr.postcode || ''
    const cityLine = [city, state, zip].filter(Boolean).join(', ')
    const full = parts.length ? parts.join(', ') + (cityLine ? ', ' + cityLine : '') : item.display_name.split(',').slice(0,4).join(',').trim()
    setQuery(full)
    onChange(full)
    setResults([])
    setOpen(false)
  }

  return (
    <div ref={wrapRef} style={{ position:'relative' }}>
      <div style={{ position:'relative' }}>
        <input
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder || 'Search address or venue...'}
          style={{ width:'100%', background:'#161922', border:`1px solid ${query ? al(P,0.5) : '#1e2330'}`, borderRadius:4, padding:'9px 36px 9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }}
        />
        {loading ? (
          <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:14, height:14, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.7s linear infinite' }} />
        ) : (
          <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:14, opacity:0.4 }}>📍</span>
        )}
      </div>
      {open && results.length > 0 && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:'0 0 6px 6px', zIndex:100, maxHeight:240, overflowY:'auto', WebkitOverflowScrolling:'touch', boxShadow:'0 8px 24px rgba(0,0,0,0.6)' }}>
          {results.map((item, i) => {
            const addr = item.address || {}
            const city = addr.city || addr.town || addr.village || ''
            const state = addr.state || ''
            const mainText = item.name || item.display_name.split(',')[0]
            const subText = [city, state].filter(Boolean).join(', ')
            return (
              <div key={i}
                onMouseDown={()=>select(item)}
                onTouchEnd={(e)=>{ e.preventDefault(); select(item) }}
                style={{ padding:'12px 12px', borderBottom:i<results.length-1?'1px solid #1e2330':'none', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:8, minHeight:48, WebkitTapHighlightColor:'transparent' }}>
                <span style={{ fontSize:13, flexShrink:0, marginTop:1 }}>📍</span>
                <div>
                  <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.3 }}>{mainText}</div>
                  {subText && <div style={{ fontSize:10, color:'#8a94b0', marginTop:1 }}>{subText}</div>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


// ─── LINEUP BUILDER ───────────────────────────────────────────────────────────
const FIELD_POSITIONS = {
  Football: {
    offense: [
      {id:'LT',   x:28, y:52, label:'LT'},  {id:'LG',  x:38, y:52, label:'LG'},
      {id:'C',    x:50, y:52, label:'C'},   {id:'RG',  x:62, y:52, label:'RG'},
      {id:'RT',   x:72, y:52, label:'RT'},  {id:'QB',  x:50, y:62, label:'QB'},
      {id:'HB',   x:50, y:73, label:'HB'},  {id:'WR1', x:8,  y:52, label:'WR'},
      {id:'WR2',  x:92, y:52, label:'WR'},  {id:'TE',  x:82, y:52, label:'TE'},
      {id:'FB',   x:50, y:68, label:'FB'},
    ],
    defense: [
      {id:'DE1',  x:28, y:48, label:'DE'}, {id:'DT1', x:40, y:48, label:'DT'},
      {id:'DT2',  x:60, y:48, label:'DT'}, {id:'DE2', x:72, y:48, label:'DE'},
      {id:'OLB1', x:20, y:38, label:'OLB'},{id:'MLB', x:50, y:36, label:'MLB'},
      {id:'OLB2', x:80, y:38, label:'OLB'},{id:'CB1', x:8,  y:30, label:'CB'},
      {id:'CB2',  x:92, y:30, label:'CB'}, {id:'FS',  x:36, y:24, label:'FS'},
      {id:'SS',   x:64, y:24, label:'SS'},
    ],
    'special teams': [
      {id:'K',    x:50, y:68, label:'K'},   {id:'LS',  x:50, y:52, label:'LS'},
      {id:'H',    x:50, y:60, label:'H'},
      {id:'KR1',  x:50, y:88, label:'KR'},  {id:'KR2', x:35, y:82, label:'KR'},
      {id:'G1',   x:28, y:52, label:'G'},   {id:'G2',  x:38, y:52, label:'G'},
      {id:'G3',   x:62, y:52, label:'G'},   {id:'G4',  x:72, y:52, label:'G'},
      {id:'WU1',  x:8,  y:52, label:'WU'},  {id:'WU2', x:92, y:52, label:'WU'},
    ],
    punting: [
      {id:'P',    x:50, y:72, label:'P'},   {id:'LS2', x:50, y:52, label:'LS'},
      {id:'PG1',  x:28, y:52, label:'G'},   {id:'PG2', x:38, y:52, label:'G'},
      {id:'PG3',  x:62, y:52, label:'G'},   {id:'PG4', x:72, y:52, label:'G'},
      {id:'PW1',  x:8,  y:52, label:'W'},   {id:'PW2', x:92, y:52, label:'W'},
      {id:'PR1',  x:50, y:88, label:'PR'},  {id:'PR2', x:35, y:82, label:'PR'},
      {id:'PGL',  x:16, y:52, label:'GL'},  {id:'PGR', x:84, y:52, label:'GL'},
    ],
  },
  Basketball: {
    offense: [
      {id:'PG', x:50, y:78, label:'PG'}, {id:'SG', x:22, y:55, label:'SG'},
      {id:'SF', x:78, y:55, label:'SF'}, {id:'PF', x:32, y:35, label:'PF'},
      {id:'C',  x:68, y:35, label:'C'},
    ]
  },
  Baseball: {
    batting: [
      {id:'P',   x:50, y:50, label:'P'},   {id:'C',  x:50, y:78, label:'C'},
      {id:'1B',  x:72, y:56, label:'1B'},  {id:'2B', x:62, y:38, label:'2B'},
      {id:'3B',  x:28, y:56, label:'3B'},  {id:'SS', x:38, y:38, label:'SS'},
      {id:'LF',  x:18, y:22, label:'LF'},  {id:'CF', x:50, y:14, label:'CF'},
      {id:'RF',  x:82, y:22, label:'RF'},
    ]
  },
  Soccer: {
    '4-3-3': [
      {id:'GK',  x:50, y:88, label:'GK'},
      {id:'LB',  x:18, y:72, label:'LB'},  {id:'CB1', x:36, y:72, label:'CB'},
      {id:'CB2', x:64, y:72, label:'CB'},  {id:'RB',  x:82, y:72, label:'RB'},
      {id:'CDM', x:34, y:55, label:'CDM'}, {id:'CM',  x:50, y:52, label:'CM'},
      {id:'CDM2',x:66, y:55, label:'CM'},
      {id:'LW',  x:15, y:35, label:'LW'},  {id:'ST',  x:50, y:30, label:'ST'},
      {id:'RW',  x:85, y:35, label:'RW'},
    ]
  },
  Softball: {
    batting: [
      {id:'P',   x:50, y:50, label:'P'},   {id:'C',  x:50, y:78, label:'C'},
      {id:'1B',  x:72, y:56, label:'1B'},  {id:'2B', x:62, y:38, label:'2B'},
      {id:'3B',  x:28, y:56, label:'3B'},  {id:'SS', x:38, y:38, label:'SS'},
      {id:'LF',  x:18, y:22, label:'LF'},  {id:'CF', x:50, y:14, label:'CF'},
      {id:'RF',  x:82, y:22, label:'RF'},
    ]
  },
}

function LineupBuilder({ team, sport, P='#C0392B', S='#002868', al, teams, setTeams }) {
  const [lineups, setLineups] = useState(team.lineups || [])
  const [activeLineup, setActiveLineup] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [view, setView] = useState('offense')
  const [showNewLineup, setShowNewLineup] = useState(false)
  const [newLineupName, setNewLineupName] = useState('')
  const [isGameDay, setIsGameDay] = useState(false)

  const players = team.players || []
  const sportPositions = FIELD_POSITIONS[sport] || FIELD_POSITIONS.Football
  const currentPositions = sportPositions[view] || Object.values(sportPositions)[0]
  const currentLineup = lineups.find(l => l.id === activeLineup)

  function saveLineups(updated) {
    setLineups(updated)
    setTeams(prev => ({
      ...prev,
      [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t, lineups:updated} : t)
    }))
  }

  function createLineup() {
    if (!newLineupName.trim()) return
    const newL = { id:Date.now(), name:newLineupName.trim(), isGameDay:isGameDay, slots:{}, view }
    const updated = [...lineups, newL]
    if (isGameDay) {
      // Only one game day lineup
      updated.forEach(l => { if (l.id !== newL.id) l.isGameDay = false })
    }
    saveLineups(updated)
    setActiveLineup(newL.id)
    setNewLineupName('')
    setShowNewLineup(false)
    setIsGameDay(false)
  }

  function assignPlayer(slotId, playerId) {
    if (!currentLineup) return
    const updated = lineups.map(l => l.id===activeLineup ? {...l, slots:{...l.slots, [slotId]:playerId}} : l)
    saveLineups(updated)
    setSelectedSlot(null)
  }

  function setGameDayLineup(lineupId) {
    const updated = lineups.map(l => ({...l, isGameDay: l.id===lineupId}))
    saveLineups(updated)
  }

  function deleteLineup(lineupId) {
    const updated = lineups.filter(l => l.id !== lineupId)
    saveLineups(updated)
    if (activeLineup === lineupId) setActiveLineup(updated[0]?.id || null)
  }

  // Field background per sport
  function FieldBackground() {
    if (sport==='Basketball') return (
      <g>
        <rect x="4" y="4" width="92" height="92" rx="3" fill="#0a0a1f" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8"/>
        <path d="M4 72 Q50 10 96 72" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
        <rect x="32" y="68" width="36" height="28" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
        <circle cx="50" cy="68" r="13" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
        <circle cx="50" cy="92" r="2.5" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8"/>
        <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      </g>
    )
    if (sport==='Baseball'||sport==='Softball') return (
      <g>
        <rect x="0" y="0" width="100" height="100" fill="#0a1a0a" rx="3"/>
        <path d="M50 88 Q90 40 50 8 Q10 40 50 88Z" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
        <path d="M50 88 L90 60 L50 32 L10 60 Z" fill="rgba(180,140,80,0.08)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
        <line x1="50" y1="88" x2="10" y2="18" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" strokeDasharray="4,3"/>
        <line x1="50" y1="88" x2="90" y2="18" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" strokeDasharray="4,3"/>
        <circle cx="50" cy="50" r="4" fill="rgba(180,140,80,0.15)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      </g>
    )
    if (sport==='Soccer') return (
      <g>
        <rect x="2" y="2" width="96" height="96" fill="#0d1a0d" rx="3"/>
        <rect x="4" y="4" width="92" height="92" rx="2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
        <line x1="4" y1="50" x2="96" y2="50" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6"/>
        <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
        <rect x="28" y="4" width="44" height="18" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
        <rect x="28" y="78" width="44" height="18" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
      </g>
    )
    // Football
    return (
      <g>
        <rect x="0" y="0" width="100" height="100" fill="#0a1a0a" rx="3"/>
        {[25,50,75].map((x,i)=><line key={i} x1={x} y1="2" x2={x} y2="98" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" strokeDasharray="3,3"/>)}
        <line x1="2" y1={view==='offense'?55:55} x2="98" y2={view==='offense'?55:55} stroke="rgba(255,255,255,0.15)" strokeWidth="0.8"/>
        <text x="4" y={view==='offense'?53:57} fill="rgba(255,255,255,0.18)" fontSize="4" fontFamily="monospace">LOS</text>
      </g>
    )
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {/* Lineup list */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4 }}>
        {lineups.map(lineup => (
          <div key={lineup.id} onClick={()=>setActiveLineup(lineup.id)} style={{ flexShrink:0, padding:'6px 10px', borderRadius:6, border:`1px solid ${activeLineup===lineup.id?P:'#1e2330'}`, background:activeLineup===lineup.id?al(P,0.12):'#161922', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
            {lineup.isGameDay && <span style={{ fontSize:12 }}>⭐</span>}
            <span style={{ fontSize:11, color:activeLineup===lineup.id?P:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{lineup.name}</span>
            <button onClick={e=>{e.stopPropagation();deleteLineup(lineup.id)}} style={{ background:'#161922', border:'none', color:'#5a6480', cursor:'pointer', fontSize:12, padding:0 }}>✕</button>
          </div>
        ))}
        <button onClick={()=>setShowNewLineup(true)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:6, border:`1px dashed ${al(P,0.4)}`, background:'#161922', color:P, fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ New Lineup</button>
      </div>

      {/* New lineup form */}
      {showNewLineup && (
        <div style={{ padding:'10px 12px', background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:6, animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <input value={newLineupName} onChange={e=>setNewLineupName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&createLineup()} placeholder="e.g. Base Offense, 2-Minute, Nickel D" style={{ flex:1, background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:4, padding:'7px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }}/>
            <button onClick={createLineup} style={{ padding:'7px 12px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>CREATE</button>
            <button onClick={()=>{setShowNewLineup(false);setIsGameDay(false)}} style={{ padding:'7px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', cursor:'pointer', fontSize:12 }}>✕</button>
          </div>
          <div onClick={()=>setIsGameDay(g=>!g)} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${isGameDay?P:'#3d4559'}`, background:isGameDay?P:'#0f1219', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {isGameDay && <span style={{ fontSize:11, color:'white' }}>✓</span>}
            </div>
            <span style={{ fontSize:11, color:'#f2f4f8' }}>⭐ Set as Game Day Starter</span>
          </div>
        </div>
      )}

      {/* View tabs (Football only) */}
      {sport==='Football' && (
        <div style={{ display:'flex', gap:6 }}>
          {Object.keys(FIELD_POSITIONS[sport]||{}).map(v => (
            <button key={v} onClick={()=>setView(v)} style={{ padding:'5px 12px', borderRadius:4, fontSize:11, border:`1px solid ${view===v?P:'#1e2330'}`, background:view===v?al(P,0.15):'transparent', color:view===v?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, textTransform:'uppercase' }}>{v}</button>
          ))}
        </div>
      )}

      {currentLineup ? (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            <span style={{ fontSize:12, color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{currentLineup.name}</span>
            {!currentLineup.isGameDay && (
              <button onClick={()=>setGameDayLineup(currentLineup.id)} style={{ fontSize:9, color:'#f59e0b', padding:'2px 8px', background:'rgba(245,158,11,0.1)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:3, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>⭐ Set Game Day</button>
            )}
            {currentLineup.isGameDay && <span style={{ fontSize:9, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>⭐ GAME DAY STARTER</span>}
          </div>

          {/* Field diagram */}
          <div style={{ background:'#0a1a0a', borderRadius:8, overflow:'hidden', border:'1px solid #1e2330' }}>
            <svg viewBox="0 0 100 100" style={{ width:'100%', aspectRatio:'1', display:'block' }}>
              <FieldBackground />
              {currentPositions.map(pos => {
                const assignedId = currentLineup.slots[pos.id]
                const player = players.find(p => p.id === assignedId)
                const isSelected = selectedSlot === pos.id
                const hasPlayer = !!player
                return (
                  <g key={pos.id} onClick={()=>setSelectedSlot(isSelected?null:pos.id)} style={{ cursor:'pointer' }}>
                    <circle cx={pos.x} cy={pos.y} r={isSelected?7:6} fill={hasPlayer?P:al(P,0.2)} stroke={isSelected?'#f59e0b':hasPlayer?P:'rgba(255,255,255,0.2)'} strokeWidth={isSelected?1.5:1}/>
                    <text x={pos.x} y={pos.y+1.5} textAnchor="middle" fill="white" fontSize={hasPlayer?4:4.5} fontWeight="700" fontFamily="monospace">
                      {hasPlayer ? (player.lastName||player.firstName||'').slice(0,4).toUpperCase() : pos.label}
                    </text>
                    {hasPlayer && player.number && (
                      <text x={pos.x+7} y={pos.y-4} textAnchor="middle" fill={P} fontSize="3.5" fontFamily="monospace" opacity="0.8">#{player.number}</text>
                    )}
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Player assignment panel */}
          {selectedSlot && (
            <div style={{ padding:'10px 12px', background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:6, animation:'fadeIn 0.2s ease' }}>
              <div style={{ fontSize:9, letterSpacing:1.5, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>
                Assign player to {selectedSlot}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4, maxHeight:150, overflowY:'auto' }}>
                <div onClick={()=>assignPlayer(selectedSlot, null)} style={{ padding:'6px 10px', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, cursor:'pointer', fontSize:11, color:'#8a94b0' }}>— Remove assignment</div>
                {players.map(p => (
                  <div key={p.id} onClick={()=>assignPlayer(selectedSlot, p.id)} style={{ padding:'6px 10px', background:currentLineup.slots[selectedSlot]===p.id?al(P,0.12):'#0f1219', border:`1px solid ${currentLineup.slots[selectedSlot]===p.id?P:'#1e2330'}`, borderRadius:4, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:11, color:'#f2f4f8', fontWeight:500 }}>{p.lastName||''}{p.lastName&&p.firstName?', ':''}{p.firstName||''}</span>
                    {p.position && <span style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{p.position}</span>}
                    {p.number && <span style={{ fontSize:9, color:'#8a94b0', marginLeft:'auto' }}>#{p.number}</span>}
                  </div>
                ))}
                {players.length === 0 && <div style={{ fontSize:11, color:'#5a6480', padding:'6px' }}>No players in roster yet. Add players in the Roster tab.</div>}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign:'center', padding:'24px 0', color:'#5a6480', fontSize:12 }}>Create a lineup above to start assigning players to positions.</div>
      )}
    </div>
  )
}


// ─── SCHEDULE SECTION ─────────────────────────────────────────────────────────
// ─── LIVE SCORING SECTION ────────────────────────────────────────────────────
function LiveScoringSection({ team, P='#C0392B', S='#002868', al, sport, teams, setTeams, callAI, parseJSON }) {
  const EMPTY_GAME = {
    id: null, opponent:'', date:'', quarter:1, clock:'',
    us:0, them:0, timeoutsUs:3, timeoutsThem:3,
    quarters:{ us:[0,0,0,0], them:[0,0,0,0] },
    log:[], active:false, final:false
  }
  const [game, setGame] = useState(() => {
    if (!team) return EMPTY_GAME
    try {
      const s = localStorage.getItem('coachiq_live_' + team.id)
      if (s) return JSON.parse(s)
    } catch(e){}
    return EMPTY_GAME
  })
  const [setupMode, setSetupMode] = useState(!game.active && !game.final)
  const [setupForm, setSetupForm] = useState({ opponent: game.opponent||'', date: game.date||'' })
  const [showQB, setShowQB] = useState(false)
  const [scoreType, setScoreType] = useState('TD')
  const [scoreSide, setScoreSide] = useState('us')
  const [scoringPlayer, setScoringPlayer] = useState('')
  const [showLog, setShowLog] = useState(false)
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)

  const players = team?.players || []

  function persist(g) {
    if (!team) return
    try { localStorage.setItem('coachiq_live_' + team.id, JSON.stringify(g)) } catch(e){}
    setGame(g)
  }

  function startGame() {
    if (!setupForm.opponent.trim()) return
    const g = { ...EMPTY_GAME, id: Date.now(), opponent: setupForm.opponent.trim(), date: setupForm.date || new Date().toISOString().slice(0,10), active:true, final:false }
    persist(g)
    setSetupMode(false)
  }

  function endGame() {
    const g = { ...game, active:false, final:true }
    persist(g)
    // Save result to team schedule and game history
    if (team && teams && setTeams) {
      setTeams(prev => ({
        ...prev,
        [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {
          ...t,
          schedule: (t.schedule||[]).map(ev => {
            if (ev.type==='Game' && ev.opponent===game.opponent && ev.date===game.date) {
              return { ...ev, finalScoreUs:game.us, finalScoreThem:game.them }
            }
            return ev
          }),
          gameHistory: [...(t.gameHistory||[]), { id:game.id, opponent:game.opponent, date:game.date, us:game.us, them:game.them, log:game.log }]
        } : t)
      }))
    }
    // Auto-generate summary
    generateSummary(g)
  }

  function resetGame() {
    if (!window.confirm('Clear this game and start a new one?')) return
    persist(EMPTY_GAME)
    setSetupMode(true)
    setSetupForm({ opponent:'', date:'' })
  }

  function addScore() {
    const pts = { TD:6, FG:3, Safety:2, XP:1, '2PT':2 }[scoreType] || 0
    const label = { TD:'Touchdown', FG:'Field Goal', Safety:'Safety', XP:'Extra Point', '2PT':'2-Pt Conv' }[scoreType]
    const g = { ...game }
    const q = Math.min(g.quarter, 4) - 1
    if (scoreSide==='us') {
      g.us += pts
      g.quarters = { ...g.quarters, us: g.quarters.us.map((v,i)=>i===q?v+pts:v) }
    } else {
      g.them += pts
      g.quarters = { ...g.quarters, them: g.quarters.them.map((v,i)=>i===q?v+pts:v) }
    }
    const entry = { ts: Date.now(), side:scoreSide, type:scoreType, label, pts, player:scoringPlayer, quarter:g.quarter }
    g.log = [entry, ...g.log]
    persist(g)
    setShowQB(false)
    setScoringPlayer('')
  }

  function setQuarter(q) { persist({ ...game, quarter: q }) }
  function useTimeout(side) {
    if (side==='us' && game.timeoutsUs===0) return
    if (side==='them' && game.timeoutsThem===0) return
    persist({ ...game, timeoutsUs: side==='us'?game.timeoutsUs-1:game.timeoutsUs, timeoutsThem: side==='them'?game.timeoutsThem-1:game.timeoutsThem })
  }
  function setClock(v) { persist({ ...game, clock:v }) }

  async function generateSummary(g) {
    setSummaryLoading(true)
    setSummary(null)
    const result = g.us > g.them ? 'WIN' : g.us < g.them ? 'LOSS' : 'TIE'
    const scorers = g.log.filter(e=>e.side==='us'&&e.player).map(e=>`${e.player} (${e.label}, Q${e.quarter})`).join('; ') || 'Not recorded'
    const scoreByQ = `Q1: ${g.quarters.us[0]}-${g.quarters.them[0]}, Q2: ${g.quarters.us[1]}-${g.quarters.them[1]}, Q3: ${g.quarters.us[2]}-${g.quarters.them[2]}, Q4: ${g.quarters.us[3]}-${g.quarters.them[3]}`
    const prompt = `You are an encouraging youth ${sport} coach writing a brief post-game summary. Team: ${team?.name||'Us'}. Opponent: ${g.opponent}. Final: ${g.us}–${g.them} (${result}). Scoring by quarter: ${scoreByQ}. Scoring plays: ${scorers}. Return ONLY valid JSON: {"headline":"one energetic headline line","recap":"2-3 sentence game recap mentioning specific scores and key moments","standout":"one standout performer or play (can be team-level if no individual stats)","positives":["positive 1","positive 2","positive 3"],"focusNext":"one specific thing to work on next practice based on the game","motivationalClose":"one short inspiring line for the team"}`
    try {
      const raw = await callAI(prompt)
      const data = parseJSON(raw)
      setSummary(data)
    } catch(e) { setSummary({ headline:'Game Complete', recap:`Final score: ${team?.name||'Us'} ${g.us}, ${g.opponent} ${g.them}.`, positives:['Great effort by the team'], focusNext:'Review game film and prepare for next week', motivationalClose:'Keep grinding, champions are made in practice!' }) }
    setSummaryLoading(false)
  }

  const btn = (label, onClick, color=P, disabled=false, size=14) => (
    <button onClick={onClick} disabled={disabled} style={{ padding:'13px 10px', background:disabled?'#1e2330':color, border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:size, cursor:disabled?'not-allowed':'pointer', letterSpacing:'1px', opacity:disabled?0.4:1, touchAction:'manipulation', minHeight:50, userSelect:'none' }}>{label}</button>
  )

  const bigScore = (val, side) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flex:1 }}>
      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:72, fontWeight:900, color:side==='us'?P:'#f2f4f8', lineHeight:1 }}>{val}</div>
    </div>
  )

  if (!team) return (
    <Card><div style={{ padding:24, textAlign:'center', color:'#5a6480', fontSize:13 }}>Select or create a team to use live scoring.</div></Card>
  )

  if (setupMode) return (
    <Card>
      <CardHead icon="🏟" title="Live Scoring" tag="Game Setup" tagColor={P} accent={P} />
      <div style={{ padding:16 }}>
        {game.final && (
          <div style={{ background:al(P,0.1), border:`1px solid ${al(P,0.3)}`, borderRadius:6, padding:'10px 14px', marginBottom:14, fontSize:12, color:'#f2f4f8' }}>
            Last game: <strong>{game.opponent}</strong> — {team.name} {game.us}, {game.opponent} {game.them}
          </div>
        )}
        <div style={{ display:'grid', gap:10, marginBottom:14 }}>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Opponent *</label>
            <input value={setupForm.opponent} onChange={e=>setSetupForm(f=>({...f,opponent:e.target.value}))} placeholder="e.g. Westport Eagles" style={{ width:'100%', background:'#161922', border:`1px solid ${setupForm.opponent?P:'#1e2330'}`, borderRadius:4, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
          </div>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Game Date</label>
            <input type="date" value={setupForm.date} onChange={e=>setSetupForm(f=>({...f,date:e.target.value}))} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
          </div>
        </div>
        <button onClick={startGame} disabled={!setupForm.opponent.trim()} style={{ width:'100%', padding:'14px', background:setupForm.opponent.trim()?P:'#3d4559', border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:16, cursor:setupForm.opponent.trim()?'pointer':'not-allowed', letterSpacing:'2px', minHeight:52 }}>⚡ START GAME</button>
        {game.log && game.log.length > 0 && (
          <button onClick={()=>{setSetupMode(false)}} style={{ width:'100%', marginTop:8, padding:'11px', background:'transparent', border:`1px solid ${al(P,0.4)}`, borderRadius:6, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>RESUME LAST GAME</button>
        )}
      </div>
    </Card>
  )

  return (
    <Card>
      <CardHead icon="🏟" title={game.final ? 'Final Score' : '🔴 LIVE'} tag={game.opponent} tagColor={game.final?'#4ade80':P} accent={P} />
      <div style={{ padding:14 }}>

        {/* SCOREBOARD */}
        <div style={{ background:'#0d1117', borderRadius:8, padding:'16px 12px', marginBottom:12, border:`1px solid ${al(P,0.2)}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
            {bigScore(game.us,'us')}
            <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontSize:36, fontWeight:900, color:'#5a6480' }}>—</div>
            {bigScore(game.them,'them')}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontSize:10, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>{team.name?.toUpperCase()}</div>
            <div style={{ fontSize:10, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>{game.opponent?.toUpperCase()}</div>
          </div>

          {/* Quarter box scores */}
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr 1fr 1fr auto', gap:4, fontSize:10, textAlign:'center', color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>
            {['','Q1','Q2','Q3','Q4','TOT'].map((h,i)=><div key={i} style={{ fontWeight:700, color:i===0||i===5?'#3d4559':'#6b7a96' }}>{h}</div>)}
            {[team.name?.slice(0,4)||'US', ...game.quarters.us, game.us].map((v,i)=><div key={'u'+i} style={{ color:i===0?P:'#f2f4f8', fontWeight:i===5?800:600 }}>{v}</div>)}
            {[game.opponent?.slice(0,4)||'THM', ...game.quarters.them, game.them].map((v,i)=><div key={'t'+i} style={{ color:i===0?'#a0aec0':'#f2f4f8', fontWeight:i===5?800:600 }}>{v}</div>)}
          </div>
        </div>

        {/* QUARTER + CLOCK CONTROLS */}
        {!game.final && (
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:6 }}>QUARTER</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:10 }}>
              {[1,2,3,4].map(q=>(
                <button key={q} onClick={()=>setQuarter(q)} style={{ padding:'10px 0', background:game.quarter===q?P:'#161922', border:`1px solid ${game.quarter===q?P:'#1e2330'}`, borderRadius:6, color:game.quarter===q?'white':'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:14, cursor:'pointer', minHeight:46, touchAction:'manipulation' }}>Q{q}</button>
              ))}
            </div>
            <div>
              <div style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:4 }}>CLOCK</div>
              <input value={game.clock} onChange={e=>setClock(e.target.value)} placeholder="e.g. 4:32" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'10px 12px', color:'#f2f4f8', fontFamily:"'Big Shoulders Display',sans-serif", fontSize:20, fontWeight:900, outline:'none', textAlign:'center' }} />
            </div>
          </div>
        )}

        {/* TIMEOUTS */}
        {!game.final && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
            {[['us', team.name?.slice(0,10)||'Us'], ['them', game.opponent?.slice(0,10)||'Them']].map(([side, label])=>(
              <div key={side} style={{ background:'#161922', border:'1px solid #1e2330', borderRadius:6, padding:'10px 12px' }}>
                <div style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1, marginBottom:6 }}>{label.toUpperCase()}</div>
                <div style={{ display:'flex', gap:5, marginBottom:6 }}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{ width:14, height:14, borderRadius:'50%', background:i<(side==='us'?game.timeoutsUs:game.timeoutsThem)?P:'#1e2330', border:`1px solid ${al(P,0.4)}` }} />
                  ))}
                </div>
                <button onClick={()=>useTimeout(side)} disabled={(side==='us'?game.timeoutsUs:game.timeoutsThem)===0} style={{ width:'100%', padding:'7px 0', background:'transparent', border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer', letterSpacing:1, opacity:(side==='us'?game.timeoutsUs:game.timeoutsThem)===0?0.3:1, minHeight:36 }}>USE TIMEOUT</button>
              </div>
            ))}
          </div>
        )}

        {/* SCORE BUTTONS */}
        {!game.final && !showQB && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
            {btn(`+ Score ${team.name?.slice(0,8)||'Us'}`, ()=>{setScoreSide('us');setShowQB(true)}, P)}
            {btn(`+ Score ${game.opponent?.slice(0,8)||'Them'}`, ()=>{setScoreSide('them');setShowQB(true)}, '#e74c3c')}
          </div>
        )}

        {/* SCORE ENTRY PANEL */}
        {!game.final && showQB && (
          <div style={{ background:'#0d1117', border:`1px solid ${al(scoreSide==='us'?P:'#e74c3c',0.4)}`, borderRadius:8, padding:14, marginBottom:12 }}>
            <div style={{ fontSize:11, color:scoreSide==='us'?P:'#e74c3c', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, letterSpacing:2, marginBottom:10 }}>
              {scoreSide==='us'?`${team.name?.toUpperCase()||'US'} SCORE`:`${game.opponent?.toUpperCase()||'THEM'} SCORE`}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:10 }}>
              {['TD','FG','Safety','XP','2PT'].map(t=>(
                <button key={t} onClick={()=>setScoreType(t)} style={{ padding:'11px 0', background:scoreType===t?(scoreSide==='us'?P:'#e74c3c'):'#161922', border:`1px solid ${scoreType===t?(scoreSide==='us'?P:'#e74c3c'):'#1e2330'}`, borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:12, cursor:'pointer', minHeight:44, touchAction:'manipulation' }}>
                  {t}<br/><span style={{ fontSize:9, fontWeight:400, color:scoreType===t?'rgba(255,255,255,0.8)':'#6b7a96' }}>({({TD:6,FG:3,Safety:2,XP:1,'2PT':2})[t]}pts)</span>
                </button>
              ))}
            </div>
            {players.length > 0 && scoreSide==='us' && (
              <div style={{ marginBottom:10 }}>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Scored by (optional)</label>
                <select value={scoringPlayer} onChange={e=>setScoringPlayer(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }}>
                  <option value="">—</option>
                  {players.map(p=><option key={p.id} value={`#${p.jersey} ${p.firstName}`}>#{p.jersey} {p.firstName} {p.lastName}</option>)}
                </select>
              </div>
            )}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <button onClick={()=>{setShowQB(false);setScoringPlayer('')}} style={{ padding:'12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', minHeight:48 }}>CANCEL</button>
              <button onClick={addScore} style={{ padding:'12px', background:scoreSide==='us'?P:'#e74c3c', border:'none', borderRadius:6, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:13, cursor:'pointer', letterSpacing:1, minHeight:48 }}>CONFIRM +{({TD:6,FG:3,Safety:2,XP:1,'2PT':2})[scoreType]}</button>
            </div>
          </div>
        )}

        {/* PLAY LOG */}
        {game.log && game.log.length > 0 && (
          <div style={{ marginBottom:12 }}>
            <button onClick={()=>setShowLog(v=>!v)} style={{ width:'100%', textAlign:'left', background:'transparent', border:'none', color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, letterSpacing:2, cursor:'pointer', padding:'6px 0', display:'flex', justifyContent:'space-between' }}>
              <span>SCORE LOG ({game.log.length})</span><span>{showLog?'▲':'▼'}</span>
            </button>
            {showLog && (
              <div style={{ background:'#0d1117', borderRadius:6, padding:'8px 10px', maxHeight:200, overflowY:'auto' }}>
                {game.log.map((entry,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid #1e2330', fontSize:11 }}>
                    <span style={{ fontSize:14 }}>{entry.side==='us'?'🟢':'🔴'}</span>
                    <span style={{ color:'#f2f4f8', fontWeight:600 }}>{entry.label}</span>
                    <span style={{ color:entry.side==='us'?P:'#e74c3c', fontWeight:800 }}>+{entry.pts}</span>
                    {entry.player && <span style={{ color:'#8a94b0' }}>{entry.player}</span>}
                    <span style={{ color:'#5a6480', marginLeft:'auto', fontSize:9 }}>Q{entry.quarter}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* END GAME / RESET */}
        <div style={{ display:'grid', gridTemplateColumns: game.final ? '1fr' : '1fr 1fr', gap:8 }}>
          <button onClick={resetGame} style={{ padding:'11px', background:'transparent', border:'1px solid #1e2330', borderRadius:6, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:1, minHeight:46 }}>NEW GAME</button>
          {!game.final && (
            <button onClick={endGame} style={{ padding:'11px', background:'#161922', border:`1px solid ${al('#4ade80',0.4)}`, borderRadius:6, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:12, cursor:'pointer', letterSpacing:1, minHeight:46 }}>✓ END GAME</button>
          )}
        </div>
        {game.final && (
          <div style={{ textAlign:'center', marginTop:10, fontSize:11, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>
            FINAL — {game.us > game.them ? '🏆 WIN' : game.us < game.them ? 'LOSS' : 'TIE'} · {game.us}–{game.them}
          </div>
        )}

        {/* POST-GAME AI SUMMARY */}
        {game.final && (
          <div style={{ marginTop:14 }}>
            {!summary && !summaryLoading && (
              <button onClick={()=>generateSummary(game)} style={{ width:'100%', padding:'13px', background:al(P,0.12), border:`1px dashed ${al(P,0.4)}`, borderRadius:8, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:14, cursor:'pointer', letterSpacing:'1.5px', minHeight:52 }}>⚡ GENERATE POST-GAME SUMMARY</button>
            )}
            {summaryLoading && (
              <div style={{ padding:'16px', background:'#0d1117', border:`1px solid ${al(P,0.2)}`, borderRadius:8, textAlign:'center' }}>
                <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 8px' }} />
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:'#8a94b0', letterSpacing:1 }}>AI ANALYZING GAME DATA...</div>
              </div>
            )}
            {summary && (
              <div style={{ background:'#0d1117', border:`1px solid ${al(P,0.3)}`, borderRadius:8, overflow:'hidden', animation:'fadeIn 0.3s ease' }}>
                {/* Header */}
                <div style={{ background:al(P,0.1), borderBottom:`1px solid ${al(P,0.2)}`, padding:'12px 14px' }}>
                  <div style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:4 }}>⚡ POST-GAME AI SUMMARY</div>
                  <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:18, color:'#f2f4f8', lineHeight:1.2 }}>{summary.headline}</div>
                </div>
                <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:12 }}>
                  {/* Recap */}
                  <div style={{ fontSize:12, color:'#dde1f0', lineHeight:1.6 }}>{summary.recap}</div>

                  {/* Standout */}
                  {summary.standout && (
                    <div style={{ padding:'8px 12px', background:al('#f59e0b',0.08), border:`1px solid ${al('#f59e0b',0.25)}`, borderRadius:6, borderLeft:`3px solid #f59e0b` }}>
                      <div style={{ fontSize:9, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:3 }}>⭐ STANDOUT</div>
                      <div style={{ fontSize:12, color:'#f2f4f8' }}>{summary.standout}</div>
                    </div>
                  )}

                  {/* Positives */}
                  {summary.positives && summary.positives.length > 0 && (
                    <div>
                      <div style={{ fontSize:9, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:6 }}>✓ WHAT WENT WELL</div>
                      {summary.positives.map((p,i) => (
                        <div key={i} style={{ display:'flex', gap:8, marginBottom:4, alignItems:'flex-start' }}>
                          <div style={{ width:4, height:4, borderRadius:'50%', background:'#4ade80', marginTop:5, flexShrink:0 }} />
                          <div style={{ fontSize:11, color:'#dde1f0', lineHeight:1.5 }}>{p}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Focus next */}
                  {summary.focusNext && (
                    <div style={{ padding:'8px 12px', background:al('#6b9fff',0.08), border:`1px solid ${al('#6b9fff',0.25)}`, borderRadius:6, borderLeft:`3px solid #6b9fff` }}>
                      <div style={{ fontSize:9, color:'#6b9fff', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:3 }}>📋 NEXT PRACTICE FOCUS</div>
                      <div style={{ fontSize:12, color:'#f2f4f8' }}>{summary.focusNext}</div>
                    </div>
                  )}

                  {/* Motivational close */}
                  {summary.motivationalClose && (
                    <div style={{ textAlign:'center', padding:'8px 0 4px', borderTop:'1px solid #1e2330' }}>
                      <div style={{ fontFamily:"'Kalam',cursive", fontSize:14, color:P, fontWeight:700, lineHeight:1.4 }}>"{summary.motivationalClose}"</div>
                    </div>
                  )}

                  <button onClick={()=>generateSummary(game)} style={{ width:'100%', padding:'8px', background:'transparent', border:`1px solid ${al(P,0.3)}`, borderRadius:6, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer', letterSpacing:1 }}>↺ REGENERATE</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}


// ─── SCHEDULE SECTION ────────────────────────────────────────────────────────
function ScheduleSection({ team, P='#C0392B', al, teams, setTeams, sport }) {
  const [showAdd, setShowAdd] = useState(false)
  const [savedOpponents, setSavedOpponents] = useState([])
  const [expandedEvent, setExpandedEvent] = useState(null)
  const [postponingId, setPostponingId] = useState(null)
  const [postponeDate, setPostponeDate] = useState('')
  const [cancelConfirmId, setCancelConfirmId] = useState(null)
  const [form, setForm] = useState({ type:'Game', opponent:'', date:'', time:'', arrivalTime:'', location:'', homeAway:'Home', notes:'' })

  const schedule = team?.schedule || []

  function updateTeam(updates) {
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t,...updates} : t) }))
  }

  function saveEvent() {
    if (!form.date) return
    const event = { id:Date.now(), ...form, rsvp:'yes' }
    const updated = [...schedule, event].sort((a,b) => new Date(a.date) - new Date(b.date))
    updateTeam({ schedule: updated })
    if (form.opponent && !savedOpponents.includes(form.opponent)) setSavedOpponents(prev => [...prev, form.opponent])
    setForm({ type:'Game', opponent:'', date:'', time:'', arrivalTime:'', location:'', homeAway:'Home', notes:'' })
    setShowAdd(false)
  }

  function removeEvent(id) {
    updateTeam({ schedule: schedule.filter(e => e.id !== id) })
    if (expandedEvent === id) setExpandedEvent(null)
    setCancelConfirmId(null)
  }

  function postponeEvent(id, newDate) {
    const updated = schedule.map(e => e.id===id ? { ...e, date: newDate||'', _postponed:true, _needsReschedule:!newDate } : e)
    updateTeam({ schedule: updated.sort((a,b) => new Date(a.date||'9999')-new Date(b.date||'9999')) })
    setPostponingId(null); setPostponeDate('')
  }

  function setRsvp(id, status) {
    updateTeam({ schedule: schedule.map(e => e.id===id ? {...e, rsvp:status} : e) })
  }

  const typeColors = { Game:P, Practice:'#4ade80', Scrimmage:'#f59e0b', Tournament:'#c084fc' }
  const typeIcons  = { Game:'🏆', Practice:'📋', Scrimmage:'⚡', Tournament:'🥇' }
  const now = new Date()
  const upcoming = schedule.filter(e => !e._needsReschedule && new Date((e.date||'9999')+'T23:59:59') >= now)
  const needsReschedule = schedule.filter(e => e._needsReschedule)
  const past = schedule.filter(e => !e._needsReschedule && new Date((e.date||'9999')+'T23:59:59') < now)

  function openInMaps(location) {
    const q = encodeURIComponent(location)
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) window.open(`maps://maps.apple.com/?q=${q}`)
    else window.open(`https://maps.google.com/?q=${q}`)
  }

  const rsvpColor = { yes:'#4ade80', no:'#e74c3c', maybe:'#f59e0b' }
  const rsvpLabel = { yes:'✓ Going', no:'✗ Can\'t Go', maybe:'? Maybe' }

  return (
    <Card>
      <CardHead icon="📅" title="Schedule" tag={upcoming.length + ' upcoming'} tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        {!showAdd ? (
          <button onClick={()=>setShowAdd(true)} style={{ width:'100%', padding:'10px', background:al(P,0.08), border:`1px dashed ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:'1px', marginBottom: upcoming.length ? 12 : 0 }}>+ ADD EVENT</button>
        ) : (
          <div style={{ animation:'fadeIn 0.2s ease', marginBottom:12 }}>
            <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Add Event</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,minmax(0,1fr))', gap:8, marginBottom:8 }}>
              <Sel label="Type" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={['Game','Practice','Scrimmage','Tournament']} />
              <Sel label="Home / Away" value={form.homeAway} onChange={v=>setForm(f=>({...f,homeAway:v}))} options={['Home','Away','Neutral']} />
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Opponent / Event Name</label>
                <input value={form.opponent} onChange={e=>setForm(f=>({...f,opponent:e.target.value}))} placeholder={form.type==='Practice' ? 'Practice session' : 'e.g. Westport Eagles'} list="saved-opps-list" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
                <datalist id="saved-opps-list">{savedOpponents.map(o=><option key={o} value={o}/>)}</datalist>
              </div>
              <div>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Date *</label>
                <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ width:'100%', background:'#161922', border:`1px solid ${form.date?P:'#1e2330'}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Start Time</label>
                <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Arrive By</label>
                <input type="time" value={form.arrivalTime} onChange={e=>setForm(f=>({...f,arrivalTime:e.target.value}))} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Location / Address</label>
                <AddressSearch value={form.location} onChange={v=>setForm(f=>({...f,location:v}))} placeholder={form.homeAway==='Home' ? (team.hometown||'Search home field address...') : 'Search away venue address...'} P={P} al={al} />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#8a94b0', fontWeight:700, marginBottom:4, display:'block' }}>Notes</label>
                <input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="e.g. Wear red jerseys, bring extra water" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:16, outline:'none' }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setShowAdd(false)} style={{ flex:1, padding:'9px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
              <button onClick={saveEvent} disabled={!form.date} style={{ flex:2, padding:'9px', background:form.date?P:'#3d4559', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:form.date?'pointer':'not-allowed', letterSpacing:'1px' }}>SAVE EVENT</button>
            </div>
          </div>
        )}

        {/* Needs Rescheduling */}
        {needsReschedule.length > 0 && (
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:10, letterSpacing:2, color:'#f59e0b', fontWeight:700, textTransform:'uppercase', marginBottom:6 }}>Needs Rescheduling</div>
            {needsReschedule.map(event => (
              <div key={event.id} style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:8, padding:'10px 12px', marginBottom:6 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:14 }}>{typeIcons[event.type]||'📅'}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{event.opponent || event.type}</div>
                    <div style={{ fontSize:9, color:'#f59e0b', fontWeight:700 }}>📅 POSTPONED — needs new date</div>
                  </div>
                  <button onClick={()=>removeEvent(event.id)} style={{ background:'transparent', border:'none', color:'#5a6480', cursor:'pointer', fontSize:16, padding:0 }}>×</button>
                </div>
                {postponingId === event.id ? (
                  <div>
                    <input type="date" value={postponeDate} onChange={e=>setPostponeDate(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 10px', color:'#f2f4f8', fontSize:14, marginBottom:6, outline:'none' }} />
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>setPostponingId(null)} style={{ flex:1, padding:'7px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer' }}>CANCEL</button>
                      <button onClick={()=>postponeEvent(event.id, postponeDate)} disabled={!postponeDate} style={{ flex:2, padding:'7px', background:postponeDate?'#f59e0b':'#3d4559', border:'none', borderRadius:4, color:'#0f1219', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:postponeDate?'pointer':'not-allowed', letterSpacing:1 }}>SET NEW DATE</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={()=>{ setPostponingId(event.id); setPostponeDate('') }} style={{ width:'100%', padding:'7px', background:'#f59e0b', border:'none', borderRadius:4, color:'#0f1219', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>SET NEW DATE →</button>
                )}
              </div>
            ))}
          </div>
        )}

        {upcoming.length === 0 && !showAdd && needsReschedule.length === 0 && (
          <div style={{ textAlign:'center', padding:'18px 0', color:'#5a6480', fontSize:12 }}>No upcoming events — tap above to add your schedule</div>
        )}

        {upcoming.map(event => {
          const tc = typeColors[event.type] || P
          const d = new Date(event.date + 'T12:00:00')
          const isExpanded = expandedEvent === event.id
          const rsvp = event.rsvp || null
          const isConfirmCancel = cancelConfirmId === event.id
          const isPostponing = postponingId === event.id
          return (
            <div key={event.id} style={{ background:'#161922', border:`1px solid ${al(tc,0.25)}`, borderRadius:8, marginBottom:8, borderLeft:`3px solid ${tc}`, overflow:'hidden' }}>
              <div onClick={()=>setExpandedEvent(isExpanded?null:event.id)} style={{ padding:'10px 12px', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:8 }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{typeIcons[event.type]||'📅'}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:2 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{event.opponent || event.type}</div>
                    <span style={{ fontSize:10, fontWeight:700, padding:'1px 5px', borderRadius:2, background:al(tc,0.15), color:tc, fontFamily:"'Barlow Condensed',sans-serif" }}>{event.type} · {event.homeAway}</span>
                    {rsvp && <span style={{ fontSize:10, fontWeight:700, padding:'1px 5px', borderRadius:2, background:al(rsvpColor[rsvp],0.15), color:rsvpColor[rsvp], fontFamily:"'Barlow Condensed',sans-serif" }}>{rsvpLabel[rsvp]}</span>}
                  </div>
                  <div style={{ fontSize:11, color:'#8a94b0' }}>
                    {d.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}
                    {event.time && ' · ' + event.time}
                    {event.arrivalTime && ' · Arrive ' + event.arrivalTime}
                  </div>
                  {event.location && <div style={{ fontSize:10, color:'#5a6480', marginTop:1 }}>📍 {event.location}</div>}
                </div>
                <span style={{ color:'#5a6480', fontSize:12, flexShrink:0 }}>{isExpanded?'▲':'▼'}</span>
              </div>

              {isExpanded && (
                <div style={{ borderTop:`1px solid ${al(tc,0.15)}`, padding:'10px 12px', background:al(tc,0.04) }}>
                  {event.notes && <div style={{ fontSize:11, color:'#a0aec0', marginBottom:10, fontStyle:'italic', lineHeight:1.4 }}>📝 {event.notes}</div>}

                  {/* RSVP */}
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:9, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:2, marginBottom:6 }}>YOUR RSVP</div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
                      {[['yes','✓ Going','#4ade80'],['maybe','? Maybe','#f59e0b'],['no','✗ Can\'t','#e74c3c']].map(([status,label,color])=>(
                        <button key={status} onClick={()=>setRsvp(event.id,status)} style={{ padding:'9px 0', background:rsvp===status?al(color,0.2):'#161922', border:`1px solid ${rsvp===status?color:'#1e2330'}`, borderRadius:6, color:rsvp===status?color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', minHeight:40, touchAction:'manipulation' }}>{label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Postpone flow */}
                  {isPostponing ? (
                    <div style={{ marginBottom:8 }}>
                      <div style={{ fontSize:9, color:'#f59e0b', fontWeight:700, letterSpacing:1, marginBottom:6 }}>POSTPONE — Pick new date or leave blank to reschedule later</div>
                      <input type="date" value={postponeDate} onChange={e=>setPostponeDate(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontSize:14, marginBottom:6, outline:'none' }} />
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>setPostponingId(null)} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>BACK</button>
                        <button onClick={()=>postponeEvent(event.id, postponeDate)} style={{ flex:2, padding:'8px', background:'#f59e0b', border:'none', borderRadius:4, color:'#0f1219', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>{postponeDate ? 'MOVE TO NEW DATE' : 'MARK AS POSTPONED'}</button>
                      </div>
                    </div>
                  ) : isConfirmCancel ? (
                    <div style={{ marginBottom:8, padding:'10px', background:'rgba(239,68,68,0.08)', borderRadius:6 }}>
                      <div style={{ fontSize:10, color:'#ef4444', fontWeight:700, marginBottom:6 }}>Cancel this {event.type.toLowerCase()}? This cannot be undone.</div>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={()=>setCancelConfirmId(null)} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid #1e2330', borderRadius:4, color:'#8a94b0', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>BACK</button>
                        <button onClick={()=>removeEvent(event.id)} style={{ flex:2, padding:'8px', background:'#ef4444', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer', letterSpacing:1 }}>YES, CANCEL IT</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display:'flex', gap:6 }}>
                      {event.location && <button onClick={()=>openInMaps(event.location)} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, color:'#6b9fff', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer', letterSpacing:1, minHeight:38 }}>📍 DIRECTIONS</button>}
                      <button onClick={()=>{ setPostponingId(event.id); setPostponeDate(''); setCancelConfirmId(null) }} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid rgba(245,158,11,0.4)', borderRadius:6, color:'#f59e0b', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer', letterSpacing:1, minHeight:38 }}>📅 POSTPONE</button>
                      <button onClick={()=>{ setCancelConfirmId(event.id); setPostponingId(null) }} style={{ flex:1, padding:'8px', background:'#161922', border:'1px solid rgba(239,68,68,0.3)', borderRadius:6, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, cursor:'pointer', letterSpacing:1, minHeight:38 }}>✕ CANCEL</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {past.length > 0 && (
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, color:'#5a6480', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>PAST EVENTS ({past.length})</summary>
            <div style={{ marginTop:6, opacity:0.5 }}>
              {past.map(event => (
                <div key={event.id} style={{ padding:'7px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, marginBottom:5, fontSize:11, color:'#8a94b0', display:'flex', alignItems:'center', gap:8 }}>
                  <span>{typeIcons[event.type]||'📅'}</span>
                  <span>{event.opponent || event.type}</span>
                  <span style={{ marginLeft:'auto' }}>{new Date(event.date+'T12:00:00').toLocaleDateString([],{month:'short',day:'numeric'})}</span>
                  <button onClick={()=>removeEvent(event.id)} style={{ background:'#161922', border:'none', color:'#5a6480', cursor:'pointer', fontSize:14, padding:0 }}>×</button>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </Card>
  )
}



// ─── WEATHER UTILITIES ────────────────────────────────────────────────────────
const GAME_THRESHOLDS = {
  Football:   { thunderstorm:10, heavyRain:60, lightRain:85, snow:70, wind:5  },
  Basketball: { thunderstorm:100,heavyRain:100,lightRain:100,snow:100,wind:100 },
  Baseball:   { thunderstorm:5,  heavyRain:20, lightRain:70, snow:15, wind:80  },
  Soccer:     { thunderstorm:5,  heavyRain:40, lightRain:80, snow:30, wind:60  },
  Softball:   { thunderstorm:5,  heavyRain:20, lightRain:70, snow:15, wind:80  },
}

function getGameLikelihood(sport, weatherCode, windSpeed) {
  const t = GAME_THRESHOLDS[sport] || GAME_THRESHOLDS.Football
  if (weatherCode >= 200 && weatherCode < 300) return t.thunderstorm
  if (weatherCode >= 500 && weatherCode < 502) return t.lightRain
  if (weatherCode >= 502 && weatherCode < 600) return t.heavyRain
  if (weatherCode >= 300 && weatherCode < 400) return t.lightRain
  if (weatherCode >= 600 && weatherCode < 700) return t.snow
  if (windSpeed > 35) return t.wind
  return 95
}

function weatherEmoji(code) {
  if (code === 0) return '☀️'
  if (code <= 3)  return '⛅'
  if (code <= 49) return '🌫️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '❄️'
  if (code <= 99) return '⛈️'
  return '🌡️'
}

function useWeather(location) {
  const [weather, setWeather] = useState(null)
  useEffect(() => {
    if (!location || !location.trim()) return
    let cancelled = false
    const run = async () => {
      try {
        const geo = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(location) + '&count=1&language=en&format=json')
        const geoData = await geo.json()
        if (cancelled || !geoData.results || !geoData.results.length) return
        const { latitude, longitude, name } = geoData.results[0]
        const wx = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current=temperature_2m,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph')
        const wxData = await wx.json()
        if (cancelled) return
        const c = wxData.current
        setWeather({ temp: Math.round(c.temperature_2m), code: c.weather_code, wind: Math.round(c.wind_speed_10m), city: name })
      } catch(e) { /* silent fail - weather is non-critical */ }
    }
    run()
    return () => { cancelled = true }
  }, [location])
  return weather
}

// ─── ROTATING INFO WIDGET ─────────────────────────────────────────────────────
function RotatingInfoWidget({ sport, homeLocation, awayLocation, nextEvent, P='#C0392B', al, onSetLocation }) {
  const [slot, setSlot] = useState(0)
  const [now, setNow] = useState(() => new Date())
  const [currentTip, setCurrentTip] = useState(() => getRandomTip(sport))
  const homeWeather = useWeather(homeLocation)
  const awayWeather = useWeather(awayLocation !== homeLocation ? awayLocation : null)

  useEffect(() => {
    const t1 = setInterval(() => { setSlot(s => (s + 1) % 5); if(slot % 5 === 3) setCurrentTip(getRandomTip(sport)) }, 4000)
    const t2 = setInterval(() => setNow(new Date()), 30000)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  function getCountdown() {
    if (!nextEvent || !nextEvent.date) return null
    const diff = new Date(nextEvent.date + 'T12:00:00') - now
    if (diff < 0) return null
    const days = Math.floor(diff / 86400000)
    const hrs  = Math.floor((diff % 86400000) / 3600000)
    if (days > 0) return days + 'd ' + hrs + 'h'
    if (hrs > 0)  return hrs + 'h'
    return 'Today!'
  }

  // Only show game likelihood within 24 hours of a scheduled game
  const hoursUntilGame = nextEvent && nextEvent.date ? 
    (new Date(nextEvent.date+'T12:00:00') - new Date()) / 3600000 : Infinity
  const likelihood = homeWeather && hoursUntilGame <= 24 && hoursUntilGame >= -2 ? 
    getGameLikelihood(sport, homeWeather.code, homeWeather.wind) : null

  const slots = [
    homeWeather ? (
      <div key="hw" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
        <div style={{ fontSize:18 }}>{weatherEmoji(homeWeather.code)}</div>
        <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:16, color:'#f2f4f8', lineHeight:1 }}>{homeWeather.temp}°</div>
        <div style={{ fontSize:9, color:'#8a94b0', textAlign:'center', lineHeight:1.2, maxWidth:60 }}>{homeWeather.city}</div>
        {likelihood !== null && (
          <div style={{ fontSize:10, color: likelihood > 70 ? '#4ade80' : likelihood > 40 ? '#f59e0b' : '#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginTop:1 }}>{likelihood}% on</div>
        )}
      </div>
    ) : (
      <div key="noloc" onClick={onSetLocation} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer' }}>
        <div style={{ fontSize:16 }}>🌤️</div>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#8a94b0', fontWeight:700, textAlign:'center', lineHeight:1.3 }}>Add location for weather</div>
      </div>
    ),

    awayWeather && awayLocation && awayLocation !== homeLocation ? (
      <div key="aw" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
        <div style={{ fontSize:18 }}>{weatherEmoji(awayWeather.code)}</div>
        <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:16, color:'#f2f4f8', lineHeight:1 }}>{awayWeather.temp}°</div>
        <div style={{ fontSize:9, color:'#8a94b0', textAlign:'center', lineHeight:1.2, maxWidth:60 }}>{awayWeather.city}</div>
        <div style={{ fontSize:9, color:'#6b9fff', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Away</div>
      </div>
    ) : null,

    <div key="evt" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
      <div style={{ fontSize:14 }}>{nextEvent && nextEvent.type === 'Practice' ? '📋' : '🏆'}</div>
      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:13, color:P, lineHeight:1, textAlign:'center' }}>{getCountdown() || '—'}</div>
      <div style={{ fontSize:9, color:'#8a94b0', textAlign:'center', lineHeight:1.3, maxWidth:64 }}>{nextEvent ? (nextEvent.opponent || nextEvent.type) : 'No events'}</div>
    </div>,

    <div key="dt" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
      <div style={{ fontSize:14 }}>📅</div>
      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:13, color:'#f2f4f8', lineHeight:1 }}>{now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
      <div style={{ fontSize:9, color:'#8a94b0', textAlign:'center' }}>{now.toLocaleDateString([],{month:'short',day:'numeric'})}</div>
    </div>,

    <div key="tip" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      <div style={{ fontSize:14 }}>💡</div>
      <div style={{ fontSize:10, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>Coach Tip</div>
      <div style={{ fontSize:10, color:'#dde1f0', textAlign:'center', lineHeight:1.4, maxWidth:72 }}>{currentTip}</div>
    </div>,
  ].filter(Boolean)

  if (slots.length === 0) return null

  const activeSlot = slots[slot % slots.length]

  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
      <div style={{ width:70, display:'flex', alignItems:'center', justifyContent:'center', minHeight:60 }} key={'slot-' + slot}>
        {activeSlot}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
        {slots.map((_,i) => (
          <div key={i} style={{ width:3, height:3, borderRadius:'50%', background: i === (slot % slots.length) ? P : '#3d4559', transition:'background 0.3s' }} />
        ))}
      </div>
    </div>
  )
}