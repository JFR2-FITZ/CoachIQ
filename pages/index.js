import { useState, useEffect, useRef } from 'react'
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
// ─── SVG MASCOT LIBRARY ───────────────────────────────────────────────────────
// First 10 = free. 11-50 = premium (shown grayed with lock)
// SVGs are head/bust style — fierce, accurate to real sports logos

const MASCOT_SVGS = {
  eagles: (col='#C0392B') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <!-- Eagle head facing right, fierce expression -->
    <ellipse cx="32" cy="28" rx="14" ry="12" fill="${col}"/>
    <!-- Beak -->
    <path d="M44 26 L52 24 L50 28 L44 28Z" fill="#f59e0b"/>
    <!-- Eye -->
    <circle cx="40" cy="22" r="3.5" fill="white"/>
    <circle cx="41" cy="22" r="2" fill="#1a1a1a"/>
    <circle cx="41.5" cy="21.5" r="0.6" fill="white"/>
    <!-- Fierce brow -->
    <path d="M36 18 L44 20" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    <!-- White head patch -->
    <ellipse cx="33" cy="24" rx="8" ry="6" fill="white" opacity="0.9"/>
    <!-- Wing suggestion -->
    <path d="M20 32 Q14 40 18 48 Q24 44 28 36" fill="${col}" opacity="0.9"/>
    <path d="M18 34 Q10 42 15 50 Q22 46 26 38" fill="${col}" opacity="0.7"/>
  </svg>`,

  hawks: (col='#D4600A') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <ellipse cx="31" cy="27" rx="13" ry="11" fill="${col}"/>
    <path d="M43 25 L51 22 L49 27 L43 27Z" fill="#f59e0b"/>
    <circle cx="39" cy="21" r="3.5" fill="white"/>
    <circle cx="40" cy="21" r="2" fill="#1a1a1a"/>
    <circle cx="40.5" cy="20.5" r="0.6" fill="white"/>
    <path d="M35 17 L43 19" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 32 Q12 38 16 48 Q24 44 28 34" fill="${col}" opacity="0.85"/>
    <ellipse cx="32" cy="23" rx="7" ry="5" fill="#f59e0b" opacity="0.6"/>
  </svg>`,

  tigers: (col='#f59e0b') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <!-- Tiger head — round, fierce -->
    <circle cx="30" cy="30" r="18" fill="${col}"/>
    <!-- Stripes -->
    <path d="M18 22 Q22 25 18 30" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M42 22 Q38 25 42 30" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M24 16 Q27 20 24 24" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M36 16 Q33 20 36 24" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <!-- White face mask -->
    <ellipse cx="30" cy="33" rx="10" ry="9" fill="white" opacity="0.9"/>
    <!-- Eyes -->
    <ellipse cx="24" cy="26" rx="4" ry="3" fill="#1a6b1a"/>
    <circle cx="24" cy="26" r="2" fill="#1a1a1a"/>
    <circle cx="24.5" cy="25.5" r="0.6" fill="white"/>
    <ellipse cx="36" cy="26" rx="4" ry="3" fill="#1a6b1a"/>
    <circle cx="36" cy="26" r="2" fill="#1a1a1a"/>
    <circle cx="36.5" cy="25.5" r="0.6" fill="white"/>
    <!-- Nose -->
    <ellipse cx="30" cy="32" rx="3" ry="2" fill="#e88b00"/>
    <!-- Mouth -->
    <path d="M27 35 Q30 38 33 35" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M30 35 L30 38" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round"/>
    <!-- Ears -->
    <path d="M17 18 L20 12 L25 18" fill="${col}"/>
    <path d="M43 18 L40 12 L35 18" fill="${col}"/>
    <path d="M18 18 L20 14 L24 18" fill="#d4600a"/>
    <path d="M42 18 L40 14 L36 18" fill="#d4600a"/>
    <!-- Whisker dots -->
    <circle cx="22" cy="33" r="0.8" fill="#1a1a1a"/>
    <circle cx="24" cy="34" r="0.8" fill="#1a1a1a"/>
    <circle cx="38" cy="33" r="0.8" fill="#1a1a1a"/>
    <circle cx="36" cy="34" r="0.8" fill="#1a1a1a"/>
  </svg>`,

  lions: (col='#C0392B') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <!-- Mane -->
    <circle cx="30" cy="30" r="20" fill="#8B4513"/>
    <!-- Mane detail -->
    ${Array.from({length:12},(_,i)=>`<ellipse cx="${30+18*Math.cos(i*30*Math.PI/180)}" cy="${30+18*Math.sin(i*30*Math.PI/180)}" rx="5" ry="3" fill="#6B3410" transform="rotate(${i*30} ${30+18*Math.cos(i*30*Math.PI/180)} ${30+18*Math.sin(i*30*Math.PI/180)})"/>`).join('')}
    <!-- Face -->
    <circle cx="30" cy="30" r="14" fill="${col}"/>
    <ellipse cx="30" cy="33" rx="10" ry="9" fill="#f59e0b" opacity="0.6"/>
    <!-- Eyes -->
    <ellipse cx="24" cy="26" rx="3.5" ry="3" fill="#f0c040"/>
    <circle cx="24" cy="26" r="2" fill="#1a1a1a"/>
    <circle cx="24.5" cy="25.5" r="0.6" fill="white"/>
    <ellipse cx="36" cy="26" rx="3.5" ry="3" fill="#f0c040"/>
    <circle cx="36" cy="26" r="2" fill="#1a1a1a"/>
    <circle cx="36.5" cy="25.5" r="0.6" fill="white"/>
    <!-- Brow -->
    <path d="M21 22 L27 24" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M39 22 L33 24" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round"/>
    <!-- Nose -->
    <ellipse cx="30" cy="32" rx="3.5" ry="2.5" fill="#8B3010"/>
    <!-- Mouth -->
    <path d="M26 36 Q30 40 34 36" stroke="#1a1a1a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M30 35 L30 38" stroke="#1a1a1a" strokeWidth="1" strokeLinecap="round"/>
  </svg>`,

  bears: (col='#8B4513') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <circle cx="30" cy="30" r="18" fill="${col}"/>
    <!-- Ears -->
    <circle cx="18" cy="16" r="7" fill="${col}"/>
    <circle cx="42" cy="16" r="7" fill="${col}"/>
    <circle cx="18" cy="16" r="4" fill="#5a2d0c"/>
    <circle cx="42" cy="16" r="4" fill="#5a2d0c"/>
    <!-- Face -->
    <ellipse cx="30" cy="33" rx="11" ry="9" fill="#c08040"/>
    <!-- Eyes -->
    <circle cx="24" cy="26" r="4" fill="#1a1a1a"/>
    <circle cx="36" cy="26" r="4" fill="#1a1a1a"/>
    <circle cx="24.8" cy="25.2" r="1.2" fill="white"/>
    <circle cx="36.8" cy="25.2" r="1.2" fill="white"/>
    <!-- Brow - fierce -->
    <path d="M20 21 L28 24" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
    <path d="M40 21 L32 24" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
    <!-- Snout -->
    <ellipse cx="30" cy="33" rx="7" ry="5" fill="#a06030"/>
    <ellipse cx="30" cy="31" rx="4" ry="2.5" fill="#1a1a1a"/>
    <!-- Mouth -->
    <path d="M26 36 Q30 40 34 36" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M30 35 L30 37" stroke="#1a1a1a" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>`,

  wolves: (col='#607080') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <!-- Wolf head — elongated snout -->
    <ellipse cx="30" cy="28" rx="16" ry="14" fill="${col}"/>
    <!-- Ears pointy -->
    <path d="M17 20 L14 8 L22 16" fill="${col}"/>
    <path d="M43 20 L46 8 L38 16" fill="${col}"/>
    <path d="M18 19 L15 10 L21 16" fill="#3a2a2a"/>
    <path d="M42 19 L45 10 L39 16" fill="#3a2a2a"/>
    <!-- Face -->
    <ellipse cx="30" cy="32" rx="12" ry="10" fill="#9090a0"/>
    <!-- Eyes - yellow, fierce -->
    <ellipse cx="24" cy="25" rx="4" ry="3.5" fill="#c0a000"/>
    <ellipse cx="24" cy="25" rx="2" ry="2.5" fill="#1a1a1a"/>
    <circle cx="24.5" cy="24" r="0.8" fill="white"/>
    <ellipse cx="36" cy="25" rx="4" ry="3.5" fill="#c0a000"/>
    <ellipse cx="36" cy="25" rx="2" ry="2.5" fill="#1a1a1a"/>
    <circle cx="36.5" cy="24" r="0.8" fill="white"/>
    <!-- Brow -->
    <path d="M20 20 L27 23" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M40 20 L33 23" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round"/>
    <!-- Snout elongated -->
    <ellipse cx="30" cy="34" rx="8" ry="6" fill="#b0b0c0"/>
    <ellipse cx="30" cy="30" rx="4.5" ry="3" fill="#1a1a1a"/>
    <!-- Teeth showing -->
    <path d="M25 38 Q30 42 35 38" stroke="#1a1a1a" strokeWidth="1" fill="none"/>
    <rect x="27" y="37" width="2.5" height="3" rx="0.5" fill="white"/>
    <rect x="30.5" y="37" width="2.5" height="3" rx="0.5" fill="white"/>
  </svg>`,

  sharks: (col='#1565C0') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <!-- Shark head facing right -->
    <ellipse cx="32" cy="30" rx="18" ry="11" fill="${col}"/>
    <!-- Dorsal fin -->
    <path d="M28 19 L32 6 L38 19" fill="${col}"/>
    <!-- White belly -->
    <ellipse cx="32" cy="34" rx="14" ry="7" fill="white" opacity="0.85"/>
    <!-- Eye black small -->
    <circle cx="38" cy="26" r="3" fill="#1a1a1a"/>
    <circle cx="38.5" cy="25.5" r="0.8" fill="white"/>
    <!-- Mouth with teeth -->
    <path d="M44 28 Q50 30 44 34" fill="white" opacity="0.9"/>
    <path d="M44 28 L50 30 L44 34" fill="${col}"/>
    <!-- Teeth -->
    <path d="M44 28 L47 31 L44 32" fill="white"/>
    <path d="M47 29 L50 30 L47 33" fill="white"/>
    <!-- Gills -->
    <path d="M22 24 Q20 30 22 36" stroke="#0d4a8b" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
    <path d="M25 23 Q23 30 25 37" stroke="#0d4a8b" strokeWidth="1" fill="none" strokeLinecap="round"/>
    <!-- Pectoral fin -->
    <path d="M20 32 Q10 38 14 46 Q22 42 24 36" fill="${col}" opacity="0.85"/>
  </svg>`,

  dragons: (col='#C0392B') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <!-- Dragon head -->
    <ellipse cx="31" cy="28" rx="16" ry="12" fill="${col}"/>
    <!-- Horns -->
    <path d="M22 18 L18 8 L25 15" fill="#8B1a1a"/>
    <path d="M38 18 L42 8 L35 15" fill="#8B1a1a"/>
    <!-- Spiky ridge -->
    <path d="M20 16 L23 10 L26 16 L29 10 L32 16 L35 10 L38 16" fill="#8B1a1a" stroke="none"/>
    <!-- Face -->
    <ellipse cx="31" cy="31" rx="12" ry="9" fill="#a02020"/>
    <!-- Eyes - glowing green -->
    <ellipse cx="24" cy="25" rx="4" ry="3.5" fill="#00c040"/>
    <ellipse cx="24" cy="25" rx="2" ry="2.8" fill="#1a1a1a"/>
    <circle cx="24.5" cy="24" r="0.8" fill="white"/>
    <ellipse cx="38" cy="25" rx="4" ry="3.5" fill="#00c040"/>
    <ellipse cx="38" cy="25" rx="2" ry="2.8" fill="#1a1a1a"/>
    <circle cx="38.5" cy="24" r="0.8" fill="white"/>
    <!-- Snout -->
    <ellipse cx="31" cy="33" rx="9" ry="6" fill="#b02828"/>
    <path d="M26 30 L24 28" stroke="#8B1a1a" strokeWidth="1" strokeLinecap="round"/>
    <path d="M36 30 L38 28" stroke="#8B1a1a" strokeWidth="1" strokeLinecap="round"/>
    <!-- Nostrils with fire hint -->
    <circle cx="28" cy="32" r="1.5" fill="#1a1a1a"/>
    <circle cx="34" cy="32" r="1.5" fill="#1a1a1a"/>
    <!-- Fire breath -->
    <path d="M31 36 Q34 40 32 44 Q36 42 36 38 Q40 43 38 48" stroke="#f59e0b" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
    <path d="M31 36 Q28 40 30 44 Q26 42 26 38" stroke="#ef4444" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
  </svg>`,

  bulls: (col='#C0392B') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <!-- Bull head — wide, powerful -->
    <ellipse cx="30" cy="32" rx="18" ry="14" fill="#2a1a0a"/>
    <!-- Horns -->
    <path d="M14 24 Q8 14 16 12 Q20 18 20 22" fill="#c8a040" stroke="#a08020" strokeWidth="0.5"/>
    <path d="M46 24 Q52 14 44 12 Q40 18 40 22" fill="#c8a040" stroke="#a08020" strokeWidth="0.5"/>
    <!-- Face -->
    <ellipse cx="30" cy="33" rx="14" ry="12" fill="#3a2010"/>
    <!-- Eyes red/angry -->
    <ellipse cx="23" cy="27" rx="4" ry="3.5" fill="#c00000"/>
    <circle cx="23" cy="27" r="2.2" fill="#1a1a1a"/>
    <circle cx="23.6" cy="26.4" r="0.7" fill="white"/>
    <ellipse cx="37" cy="27" rx="4" ry="3.5" fill="#c00000"/>
    <circle cx="37" cy="27" r="2.2" fill="#1a1a1a"/>
    <circle cx="37.6" cy="26.4" r="0.7" fill="white"/>
    <!-- Fierce brow -->
    <path d="M19 22 L27 25" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M41 22 L33 25" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"/>
    <!-- Nose ring -->
    <ellipse cx="30" cy="36" rx="7" ry="5" fill="#4a2818"/>
    <ellipse cx="30" cy="34" rx="5" ry="3" fill="#1a1a1a"/>
    <path d="M26 36 Q30 39 34 36" stroke="#c0c0c0" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <!-- Snort lines -->
    <path d="M18 30 Q14 28 12 32" stroke="#c0c0c0" strokeWidth="0.8" fill="none" opacity="0.4"/>
    <path d="M42 30 Q46 28 48 32" stroke="#c0c0c0" strokeWidth="0.8" fill="none" opacity="0.4"/>
  </svg>`,

  knights: (col='#607080') => `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <!-- Knight helmet -->
    <rect x="16" y="12" width="28" height="32" rx="4" fill="${col}"/>
    <!-- Visor slit -->
    <rect x="18" y="26" width="24" height="4" rx="1" fill="#1a1a1a"/>
    <!-- Helmet dome -->
    <ellipse cx="30" cy="14" rx="14" ry="6" fill="${col}"/>
    <!-- Crest/plume -->
    <path d="M30 8 Q25 4 22 6 Q26 10 30 12 Q34 10 38 6 Q35 4 30 8Z" fill="${col}"/>
    <path d="M30 6 Q26 2 23 4 Q27 8 30 10 Q33 8 37 4 Q34 2 30 6Z" fill="#8B0000"/>
    <!-- Helmet details -->
    <line x1="30" y1="12" x2="30" y2="44" stroke="#4a5a6a" strokeWidth="1.5"/>
    <line x1="16" y1="28" x2="44" y2="28" stroke="#4a5a6a" strokeWidth="1"/>
    <!-- Visor -->
    <rect x="18" y="22" width="24" height="10" rx="2" fill="#2a3a4a"/>
    <rect x="20" y="24" width="20" height="6" rx="1" fill="#1a1a1a"/>
    <!-- Eye glow through visor -->
    <rect x="22" y="25.5" width="6" height="3" rx="1" fill="#ef4444" opacity="0.7"/>
    <rect x="32" y="25.5" width="6" height="3" rx="1" fill="#ef4444" opacity="0.7"/>
    <!-- Chin guard -->
    <rect x="20" y="38" width="20" height="6" rx="2" fill="#4a5a6a"/>
    <!-- Rivets -->
    <circle cx="20" cy="15" r="1.5" fill="#4a5a6a"/>
    <circle cx="40" cy="15" r="1.5" fill="#4a5a6a"/>
    <circle cx="18" cy="32" r="1.5" fill="#4a5a6a"/>
    <circle cx="42" cy="32" r="1.5" fill="#4a5a6a"/>
  </svg>`,
}

// Generate placeholder SVG for mascots without full illustration
function mascotPlaceholder(name, emoji, col='#C0392B') {
  return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#0f1219" stroke="${col}" strokeWidth="1.5"/>
    <text x="30" y="36" textAnchor="middle" fontSize="24">${emoji}</text>
  </svg>`
}

// Full mascot data with SVG
const MASCOTS = [
  // FREE TIER (1-10)
  { id:'eagles',    name:'Eagles',     emoji:'🦅', tier:'free',    svg: MASCOT_SVGS.eagles },
  { id:'tigers',    name:'Tigers',     emoji:'🐯', tier:'free',    svg: MASCOT_SVGS.tigers },
  { id:'lions',     name:'Lions',      emoji:'🦁', tier:'free',    svg: MASCOT_SVGS.lions },
  { id:'bears',     name:'Bears',      emoji:'🐻', tier:'free',    svg: MASCOT_SVGS.bears },
  { id:'wolves',    name:'Wolves',     emoji:'🐺', tier:'free',    svg: MASCOT_SVGS.wolves },
  { id:'sharks',    name:'Sharks',     emoji:'🦈', tier:'free',    svg: MASCOT_SVGS.sharks },
  { id:'dragons',   name:'Dragons',    emoji:'🐉', tier:'free',    svg: MASCOT_SVGS.dragons },
  { id:'bulls',     name:'Bulls',      emoji:'🐂', tier:'free',    svg: MASCOT_SVGS.bulls },
  { id:'knights',   name:'Knights',    emoji:'🛡️', tier:'free',    svg: MASCOT_SVGS.knights },
  { id:'hawks',     name:'Hawks',      emoji:'🪶', tier:'free',    svg: MASCOT_SVGS.hawks },
  // PREMIUM TIER (11-50) — shown grayed with lock
  { id:'falcons',   name:'Falcons',    emoji:'🦜', tier:'premium', svg: (c)=>mascotPlaceholder('Falcons','🦜',c) },
  { id:'ravens',    name:'Ravens',     emoji:'🐦‍⬛', tier:'premium', svg: (c)=>mascotPlaceholder('Ravens','🐦‍⬛',c) },
  { id:'cardinals', name:'Cardinals',  emoji:'🔴', tier:'premium', svg: (c)=>mascotPlaceholder('Cardinals','🔴',c) },
  { id:'owls',      name:'Owls',       emoji:'🦉', tier:'premium', svg: (c)=>mascotPlaceholder('Owls','🦉',c) },
  { id:'panthers',  name:'Panthers',   emoji:'🐆', tier:'premium', svg: (c)=>mascotPlaceholder('Panthers','🐆',c) },
  { id:'cougars',   name:'Cougars',    emoji:'🐈‍⬛', tier:'premium', svg: (c)=>mascotPlaceholder('Cougars','🐈‍⬛',c) },
  { id:'jaguars',   name:'Jaguars',    emoji:'🐱', tier:'premium', svg: (c)=>mascotPlaceholder('Jaguars','🐱',c) },
  { id:'huskies',   name:'Huskies',    emoji:'🐕', tier:'premium', svg: (c)=>mascotPlaceholder('Huskies','🐕',c) },
  { id:'bulldogs',  name:'Bulldogs',   emoji:'🦮', tier:'premium', svg: (c)=>mascotPlaceholder('Bulldogs','🦮',c) },
  { id:'vipers',    name:'Vipers',     emoji:'🐍', tier:'premium', svg: (c)=>mascotPlaceholder('Vipers','🐍',c) },
  { id:'cobras',    name:'Cobras',     emoji:'🪱', tier:'premium', svg: (c)=>mascotPlaceholder('Cobras','🪱',c) },
  { id:'gators',    name:'Gators',     emoji:'🐊', tier:'premium', svg: (c)=>mascotPlaceholder('Gators','🐊',c) },
  { id:'mustangs',  name:'Mustangs',   emoji:'🐎', tier:'premium', svg: (c)=>mascotPlaceholder('Mustangs','🐎',c) },
  { id:'stallions', name:'Stallions',  emoji:'🏇', tier:'premium', svg: (c)=>mascotPlaceholder('Stallions','🏇',c) },
  { id:'broncos',   name:'Broncos',    emoji:'🤠', tier:'premium', svg: (c)=>mascotPlaceholder('Broncos','🤠',c) },
  { id:'rams',      name:'Rams',       emoji:'🐏', tier:'premium', svg: (c)=>mascotPlaceholder('Rams','🐏',c) },
  { id:'bison',     name:'Bison',      emoji:'🦬', tier:'premium', svg: (c)=>mascotPlaceholder('Bison','🦬',c) },
  { id:'warriors',  name:'Warriors',   emoji:'⚔️', tier:'premium', svg: (c)=>mascotPlaceholder('Warriors','⚔️',c) },
  { id:'spartans',  name:'Spartans',   emoji:'🗡️', tier:'premium', svg: (c)=>mascotPlaceholder('Spartans','🗡️',c) },
  { id:'titans',    name:'Titans',     emoji:'💪', tier:'premium', svg: (c)=>mascotPlaceholder('Titans','💪',c) },
  { id:'giants',    name:'Giants',     emoji:'🏔️', tier:'premium', svg: (c)=>mascotPlaceholder('Giants','🏔️',c) },
  { id:'rockets',   name:'Rockets',    emoji:'🚀', tier:'premium', svg: (c)=>mascotPlaceholder('Rockets','🚀',c) },
  { id:'blazers',   name:'Blazers',    emoji:'🔥', tier:'premium', svg: (c)=>mascotPlaceholder('Blazers','🔥',c) },
  { id:'thunder',   name:'Thunder',    emoji:'⛈️', tier:'premium', svg: (c)=>mascotPlaceholder('Thunder','⛈️',c) },
  { id:'storm',     name:'Storm',      emoji:'🌩️', tier:'premium', svg: (c)=>mascotPlaceholder('Storm','🌩️',c) },
  { id:'cyclones',  name:'Cyclones',   emoji:'🌀', tier:'premium', svg: (c)=>mascotPlaceholder('Cyclones','🌀',c) },
  { id:'tornados',  name:'Tornados',   emoji:'💨', tier:'premium', svg: (c)=>mascotPlaceholder('Tornados','💨',c) },
  { id:'comets',    name:'Comets',     emoji:'☄️', tier:'premium', svg: (c)=>mascotPlaceholder('Comets','☄️',c) },
  { id:'jets',      name:'Jets',       emoji:'✈️', tier:'premium', svg: (c)=>mascotPlaceholder('Jets','✈️',c) },
  { id:'phantoms',  name:'Phantoms',   emoji:'👻', tier:'premium', svg: (c)=>mascotPlaceholder('Phantoms','👻',c) },
  { id:'chargers',  name:'Chargers',   emoji:'🔋', tier:'premium', svg: (c)=>mascotPlaceholder('Chargers','🔋',c) },
  { id:'patriots',  name:'Patriots',   emoji:'🎖️', tier:'premium', svg: (c)=>mascotPlaceholder('Patriots','🎖️',c) },
  { id:'rebels',    name:'Rebels',     emoji:'🏴', tier:'premium', svg: (c)=>mascotPlaceholder('Rebels','🏴',c) },
  { id:'trojans',   name:'Trojans',    emoji:'🏛️', tier:'premium', svg: (c)=>mascotPlaceholder('Trojans','🏛️',c) },
  { id:'vikings',   name:'Vikings',    emoji:'🪓', tier:'premium', svg: (c)=>mascotPlaceholder('Vikings','🪓',c) },
  { id:'pirates',   name:'Pirates',    emoji:'☠️', tier:'premium', svg: (c)=>mascotPlaceholder('Pirates','☠️',c) },
  { id:'raiders',   name:'Raiders',    emoji:'💀', tier:'premium', svg: (c)=>mascotPlaceholder('Raiders','💀',c) },
  { id:'colts',     name:'Colts',      emoji:'🐴', tier:'premium', svg: (c)=>mascotPlaceholder('Colts','🐴',c) },
  { id:'lightning', name:'Lightning',  emoji:'🌪️', tier:'premium', svg: (c)=>mascotPlaceholder('Lightning','🌪️',c) },
]

// ─── MASCOT AVATAR (renders the SVG) ─────────────────────────────────────────
function MascotAvatar({ mascotId, color='#C0392B', size=40, locked=false }) {
  const mascot = MASCOTS.find(m => m.id === mascotId)
  if (!mascot) return <div style={{ width:size, height:size, borderRadius:'50%', background:'#1e2330', display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.45 }}>🏆</div>

  const svgStr = mascot.svg(color)
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <div
        style={{ width:size, height:size, filter: locked ? 'grayscale(100%) brightness(0.4)' : 'none', transition:'filter 0.2s' }}
        dangerouslySetInnerHTML={{ __html: svgStr }}
      />
      {locked && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:size*0.3, lineHeight:1 }}>🔒</span>
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
  { tab:'home',     icon:'🏠', title:'Home',             desc:'Your coaching dashboard. See the live coaching feed, quick-access Gauntlet and Situational modes, and your active team card. Everything starts here.' },
  { tab:'schemes',  icon:'📋', title:'Scheme Generator', desc:'Build AI-powered schemes for Football, Basketball, Baseball, Soccer, or Softball. Get 6 plays with animated diagrams, step-by-step breakdowns, huddle cards, pro comparisons, and variations. Everything is sport-specific.' },
  { tab:'team',     icon:'🏆', title:'Team',             desc:'Create and manage your teams. Add players with positions, build your schedule, generate practice plans, view analytics, and print coach sheets and wristbands.' },
  { tab:'playbook', icon:'📖', title:'Playbook',         desc:'Your saved plays organized in folders. Browse schemes you have saved, create individual plays with the same full feature set as the scheme generator, and copy plays across teams.' },
  { tab:'scout',    icon:'🔍', title:'Scout',            desc:'Two modes: Opponent Scouting builds a full AI scouting report with key threats and a game plan. Self Scout (Film Room) lets you describe or upload a clip and get AI coaching feedback.' },
  { tab:'more',     icon:'⋯',  title:'More',             desc:'Settings for your logo style, team colors, home location for weather, and account preferences. The Help section explains every feature in detail.' },
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
      {id:'experience',label:'Your Players Experience',opts:['First Year / Never Played','Beginner — 1 Season','Average — 2-3 Seasons','Experienced — 4+ Seasons','Mixed Skill Levels on Roster']},
    ],
    positions:['Quarterback','Running Back','Wide Receiver','Offensive Line','Linebacker','Cornerback','Safety'],
    buildPrompt:(f)=>`You are an elite youth football coordinator. Generate a scheme package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. ${f.defense==='Unknown / Surprise Me'||f.defense==='Multiple / Varies'?'Generate the best all-around scheme.':'Tailor to attack the '+f.defense+' defense.'} Return 6 plays mixing runs and passes. Use types: RUN BASE, RUN PERIMETER, RUN MISDIRECTION, PASS PLAY ACTION, PASS QUICK GAME, RUN SHORT YARDAGE. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explain in simple words why this play has this name — break down each word for a youth coach"},{"number":2,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":3,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":4,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":5,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":6,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"}],"defenseTip":"tip","coachingCue":"phrase"}`,
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
    buildPrompt:(f)=>`You are an elite youth basketball coordinator. Generate a scheme package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Return 6 plays. Use types: SET PLAY HALF COURT, INBOUND BASELINE, PRESS BREAK, FAST BREAK, ZONE ATTACK, END OF GAME. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explain in simple words why this play has this name — break down each word for a youth coach"},{"number":2,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":3,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":4,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":5,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":6,"name":"play name","type":"TYPE","note":"when to use","nameExplanation":"explanation"}],"defenseTip":"tip","coachingCue":"phrase"}`,
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
      {id:'experience',label:'Your Players Experience',opts:['First Year / Never Played','Beginner — 1 Season','Average — 2-3 Seasons','Experienced — 4+ Seasons','Mixed Skill Levels on Roster']},
    ],
    positions:['Pitcher','Catcher','First Baseman','Shortstop','Outfielder','Batter','Entire Team'],
    buildPrompt:(f)=>`You are an elite youth baseball coordinator. Generate a game plan package. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Return 6 situational strategies. Use types: OFFENSE SITUATIONAL, DEFENSE ALIGNMENT, BASERUNNING RULE, PITCHING STRATEGY, INFIELD COVERAGE, BATTING APPROACH. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":2,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":3,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":4,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":5,"name":"strategy name","type":"TYPE","note":"when to use"},{"number":6,"name":"strategy name","type":"TYPE","note":"when to use"}],"defenseTip":"tip","coachingCue":"phrase"}`,
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
      {id:'experience',label:'Player Experience',  opts:['First Year / Never Played','Beginner 1 Season','Average 2-3 Seasons','Experienced 4+ Seasons','Mixed Levels']},
    ],
    positions:['Goalkeeper','Center Back','Full Back','Defensive Mid','Central Mid','Attacking Mid','Winger','Striker','Wing Back'],
    buildPrompt:(f)=>`You are an elite youth soccer coach. Generate a tactical session plan. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Format: ${f.format||'11v11'}. Return 6 tactical patterns/set pieces. Use types: ATTACKING PATTERN, DEFENSIVE SHAPE, SET PIECE ATTACK, SET PIECE DEFENSE, TRANSITION, PRESSING TRIGGER. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"pattern name","type":"TYPE","note":"when to use","nameExplanation":"explain this tactical concept in simple terms for a youth coach"},{"number":2,"name":"pattern name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":3,"name":"pattern name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":4,"name":"pattern name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":5,"name":"pattern name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":6,"name":"pattern name","type":"TYPE","note":"when to use","nameExplanation":"explanation"}],"defenseTip":"tip","coachingCue":"phrase"}`,
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
      {id:'experience',label:'Player Experience',   opts:['First Year / Never Played','Beginner 1 Season','Average 2-3 Seasons','Experienced 4+ Seasons','Mixed Levels']},
    ],
    positions:['Pitcher','Catcher','First Base','Second Base','Third Base','Shortstop','Left Field','Center Field','Right Field'],
    buildPrompt:(f)=>`You are an elite youth softball coach with expertise in ASA/USA Softball rules. Generate a game plan. ${Object.keys(f).map(k=>k+': '+f[k]).join(', ')}. Key softball rules: underhand pitching, no leading off until pitch release, double first base safety bag. Return 6 situational strategies. Use types: OFFENSE SITUATIONAL, SLAP/BUNT GAME, PITCHING STRATEGY, CIRCLE DEFENSE, OUTFIELD COVERAGE, BASERUNNING RULE. Return ONLY valid JSON: {"packageName":"name","summary":"1-2 sentences","plays":[{"number":1,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explain this softball concept simply"},{"number":2,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":3,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":4,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":5,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"},{"number":6,"name":"strategy name","type":"TYPE","note":"when to use","nameExplanation":"explanation"}],"defenseTip":"tip","coachingCue":"phrase"}`,
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
function al(hex, a) {
  if (!hex || hex.length < 7) return `rgba(0,0,0,${a})`
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  return `rgba(${r},${g},${b},${a})`
}
function dk(hex, amt) {
  if (!hex || hex.length < 7) return hex
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16)
  return '#'+[r,g,b].map(x=>Math.max(0,x-amt).toString(16).padStart(2,'0')).join('')
}
function Card({ children, style={} }) {
  return <div style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, overflow:'hidden', animation:'fadeIn 0.3s ease', ...style }}>{children}</div>
}
function CardHead({ icon, title, tag, tagColor, accent }) {
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
  return (
    <button onClick={onClick} disabled={disabled} style={{ width:'100%', background:disabled?'#3d4559':color, color:'white', border:'none', borderRadius:4, padding:12, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'2px', cursor:disabled?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:disabled?0.6:1, textTransform:'uppercase', ...style }}>{children}</button>
  )
}
function Sel({ label, value, onChange, options }) {
  return (
    <div>
      <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 11px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none', appearance:'none', WebkitAppearance:'none', colorScheme:'dark' }}>
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

// ─── QUICK TOUR MODAL ─────────────────────────────────────────────────────────
function QuickTourModal({ onDone, P, al, setPage }) {
  const [step, setStep] = useState(0)
  const current = TUTORIAL_STEPS[step]
  const isLast = step === TUTORIAL_STEPS.length - 1

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#0f1219', border:`1px solid ${al(P,0.4)}`, borderRadius:8, padding:24, width:'100%', maxWidth:380, animation:'fadeIn 0.2s ease' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:al(P,0.15), border:`2px solid ${P}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{current.icon}</div>
          <div>
            <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:2 }}>Step {step+1} of {TUTORIAL_STEPS.length}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:18, color:'#f2f4f8' }}>{current.title}</div>
          </div>
        </div>
        <p style={{ fontSize:13, color:'#dde1f0', lineHeight:1.7, marginBottom:20 }}>{current.desc}</p>
        {/* Progress dots */}
        <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:20 }}>
          {TUTORIAL_STEPS.map((_,i) => (
            <div key={i} onClick={()=>setStep(i)} style={{ width:i===step?20:7, height:7, borderRadius:4, background:i===step?P:'#1e2330', cursor:'pointer', transition:'all 0.2s' }} />
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {step > 0 && <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:'10px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>← BACK</button>}
          {!isLast && <button onClick={()=>setStep(s=>s+1)} style={{ flex:2, padding:'10px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>NEXT →</button>}
          {isLast && (
            <button onClick={()=>{ if(setPage) setPage(current.tab); onDone() }} style={{ flex:2, padding:'10px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>GET STARTED →</button>
          )}
          <button onClick={onDone} style={{ padding:'10px 12px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#3d4559', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, cursor:'pointer' }}>SKIP</button>
        </div>
      </div>
    </div>
  )
}

// ─── FEATURE GUIDE ────────────────────────────────────────────────────────────
function FeatureGuide({ P, al, onClose }) {
  const [activeSection, setActiveSection] = useState(0)

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', zIndex:500, display:'flex', flexDirection:'column' }}>
      <div style={{ background:'#07090d', borderBottom:'1px solid #1e2330', padding:'14px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onClose} style={{ background:'transparent', border:'1px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>✕</button>
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
            <div style={{ fontSize:12, color:'#6b7a96', lineHeight:1.6 }}>{item.desc}</div>
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
        <div style={{ fontSize:13, color:'#6b7a96', lineHeight:1.6, marginBottom:24 }}>Welcome! How would you like to get started?</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={()=>onChoice('tour')} style={{ width:'100%', padding:'14px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:'1px' }}>⚡ QUICK TOUR — 6 steps</button>
          <button onClick={()=>onChoice('guide')} style={{ width:'100%', padding:'13px', background:'transparent', border:`1px solid ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer', letterSpacing:'1px' }}>📖 BROWSE FEATURE GUIDE</button>
          <button onClick={()=>onChoice('skip')} style={{ width:'100%', padding:'11px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#3d4559', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>Skip — I'll explore myself</button>
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
      <div style={{ fontSize:9, color:'#3d4559', marginTop:4, lineHeight:1.5 }}>Odd numbers run left, even numbers run right. The number tells the ball carrier which gap to hit.</div>
    </div>
  )
}


function PlayCard({ play, P, S, al, callAI, parseJSON, extraAction }) {
  const [expanded, setExpanded] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
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
      const raw = await callAI('You are an expert ' + sportName + ' analyst. A youth coach is running: "' + play.name + '" (' + play.type + '). ' + play.note + ' Find the closest real ' + league + ' equivalent. If there is no perfect match, explain exactly why it differs. Return ONLY valid JSON: {"proPlay":"exact name or closest equivalent","proTeam":"team most known for it","famousExample":"specific famous game moment","whatMatches":"what the youth version gets right","keyDifference":"the most important tactical difference between this play and the pro version","gapExplanation":"explain specifically what the youth coach would need to change or develop to run the true pro version — be honest if it cannot be replicated at youth level","proTip":"one concrete thing to develop toward the pro version","watchFor":"YouTube search term"}')
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
          {play.nameExplanation && (
            <div style={{ marginTop:5, padding:'5px 8px', background:`rgba(${parseInt(P.slice(1,3),16)||192},${parseInt(P.slice(3,5),16)||57},${parseInt(P.slice(5,7),16)||43},0.08)`, borderRadius:4, borderLeft:`2px solid ${P}` }}>
              <div style={{ fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:P, fontWeight:700, marginBottom:2 }}>Why this name?</div>
              <div style={{ fontSize:11, color:'#dde1f0', lineHeight:1.5 }}>{play.nameExplanation}</div>
              {(play.type||'').includes('RUN') && /\b[0-9]+\b/.test(play.nameExplanation||play.name||'') && (
                <FootballHoleDiagram P={P} />
              )}
            </div>
          )}
          <div style={{ display:'flex', gap:10, marginTop:5, flexWrap:'wrap' }}>
            <span style={{ fontSize:10, color:P, cursor:'pointer' }} onClick={()=>setExpanded(e=>!e)}>{expanded?'▲ Collapse':'▼ Show diagram'}</span>
            {expanded && <span style={{ fontSize:10, color:'#6b9fff', cursor:'pointer' }} onClick={e=>{e.stopPropagation();const nb=!showBreakdown;setShowBreakdown(nb);if(nb&&!steps)loadSteps()}}>{showBreakdown?'▲ Hide breakdown':'▼ Show breakdown'}</span>}
          </div>
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

          {showBreakdown && stepsLoading && <div style={{ background:'#161922', borderRadius:10, padding:12, marginBottom:12, display:'flex', alignItems:'center', gap:10 }}><div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', flexShrink:0 }} /><div style={{ fontSize:12, color:'#6b7a96' }}>Generating step-by-step breakdown...</div></div>}

          {showBreakdown && steps && steps.huddleCard && steps.huddleCard.length > 0 && (
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
                {nflComp.gapExplanation && (<div style={{ padding:'8px 10px', background:'rgba(239,68,68,0.07)', borderRadius:8, border:'1px solid rgba(239,68,68,0.2)', marginBottom:8 }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#f87171', fontWeight:700, marginBottom:4 }}>The Gap — What Needs to Change</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{nflComp.gapExplanation}</div></div>)}
                {nflComp.proTip && (<div style={{ padding:'8px 10px', background:'rgba(107,154,255,0.08)', borderRadius:8, border:'1px solid rgba(107,154,255,0.2)', marginBottom:8 }}><div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#6b9fff', fontWeight:700, marginBottom:4 }}>One Thing to Work Toward</div><div style={{ fontSize:11, color:'#f2f4f8', lineHeight:1.5 }}>{nflComp.proTip}</div></div>)}
                {nflComp.watchFor && (
                  <a href={'https://www.youtube.com/results?search_query='+encodeURIComponent(nflComp.watchFor)} target="_blank" rel="noopener noreferrer" style={{ padding:'8px 10px', background:'rgba(239,68,68,0.08)', borderRadius:8, display:'flex', alignItems:'center', gap:8, textDecoration:'none', border:'1px solid rgba(239,68,68,0.2)', marginBottom:8 }}>
                    <span style={{ fontSize:16 }}>▶</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#ef4444', fontWeight:700, marginBottom:2 }}>Watch on YouTube</div>
                      <div style={{ fontSize:12, color:'#f59e0b', fontWeight:600 }}>{nflComp.watchFor}</div>
                    </div>
                    <span style={{ fontSize:11, color:'#ef4444' }}>→</span>
                  </a>
                )}
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
  const [showUpgrade, setShowUpgrade] = useState(false)
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

    const isSoccer = sport === 'Soccer'
  const isSoftball = sport === 'Softball'

  if (isSoccer) return (
    <Card>
      <CardHead icon="⚽" title="Match Situation" tag="LIVE" tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Score</label><select value={soccerScore} onChange={e=>setSoccerScore(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['UP 2','UP 1','Tied','DOWN 1','DOWN 2'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Half</label><select value={sbHalf} onChange={e=>setSbHalf(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['1st Half','2nd Half','Extra Time','Penalty Kicks'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Time Left</label><select value={sbTimeLeft} onChange={e=>setSbTimeLeft(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['45+ min','30 min','15 min','5 min','Stoppage'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Situation</label><select value={situation} onChange={e=>setSituation(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['Open Play','Corner Kick','Free Kick','Throw-In','Goal Kick','Penalty Kick','Kickoff'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Pressure</label><select value={pressure} onChange={e=>setPressure(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['High Press','Mid Block','Low Block','Mixed'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <PBtn onClick={async()=>{ const r=await callAI('Soccer situational advice: Score '+score+', situation: '+situation+'. Give 3 specific tactical adjustments. Return JSON: {"recommendations":[{"name":"tactic","why":"reason","detail":"1 sentence"}]}'); try { const d=JSON.parse(r.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim().slice(r.indexOf('{'),r.lastIndexOf('}')+1)); setSoccerRecs(d.recommendations||[]) } catch(e){} }} color={P}>GET TACTICAL ADVICE</PBtn>
        {soccerRecs && soccerRecs.map((rec,i)=>(
          <div key={i} style={{ marginTop:8, padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, borderLeft:`3px solid ${P}` }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', marginBottom:3 }}>{rec.name}</div>
            <div style={{ fontSize:11, color:'#6b7a96' }}>{rec.why}</div>
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
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Count</label><select value={sbCount} onChange={e=>setSbCount(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['0-0','1-0','2-0','3-0','0-1','1-1','2-1','3-1','0-2','1-2','2-2','3-2'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Outs</label><select value={sbOuts} onChange={e=>setSbOuts(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['0 Outs','1 Out','2 Outs'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Inning</label><select value={sbInning} onChange={e=>setSbInning(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['1st','2nd','3rd','4th','5th','6th','7th','Extra'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Runners</label><select value={sbRunners} onChange={e=>setSbRunners(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['None on','Runner 1st','Runner 2nd','Runner 3rd','1st and 2nd','1st and 3rd','2nd and 3rd','Bases Loaded'].map(o=><option key={o}>{o}</option>)}</select></div>
          <div><label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:3, display:'block' }}>Score</label><select value={sbScore} onChange={e=>setSbScore(e.target.value)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'7px 8px', color:'#f2f4f8', fontSize:12, outline:'none', colorScheme:'dark' }}>{['UP 3+','UP 2','UP 1','Tied','DOWN 1','DOWN 2','DOWN 3+'].map(o=><option key={o}>{o}</option>)}</select></div>
        </div>
        <PBtn onClick={async()=>{ const r=await callAI('Softball situational advice per ASA/USA Softball rules: Count '+count+', Runners: '+runners+', Outs: '+outs+'. Give 3 recommendations. Return JSON: {"recommendations":[{"name":"play","why":"reason","pct":"success %"}]}'); try { const d=JSON.parse(r.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim().slice(r.indexOf('{'),r.lastIndexOf('}')+1)); setSbRecs(d.recommendations||[]) } catch(e){} }} color={P}>GET RECOMMENDATION</PBtn>
        {sbRecs && sbRecs.map((rec,i)=>(
          <div key={i} style={{ marginTop:8, padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, borderLeft:`3px solid ${P}` }}>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', marginBottom:2 }}>{rec.name}</div>
            <div style={{ fontSize:11, color:'#6b7a96' }}>{rec.why}</div>
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
function SchemePreviewMini({ type='offense', P, sport='Football' }) {
  const isOff = type === 'offense'
  const col = isOff ? P : '#6b9fff'

  if (sport === 'Basketball') {
    return (
      <svg viewBox="0 0 160 90" style={{ width:'100%', height:'100%' }}>
        <rect x="0" y="0" width="160" height="90" fill="#0a0a1f" rx="2"/>
        <rect x="3" y="3" width="154" height="84" rx="2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
        <path d="M3 22 A50 50 0 0 1 3 68" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="0.8"/>
        <rect x="3" y="32" width="36" height="26" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
        <circle cx="39" cy="45" r="11" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
        <circle cx="6" cy="45" r="3" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
        <line x1="3" y1="45" x2="12" y2="45" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7"/>
        <line x1="80" y1="3" x2="80" y2="87" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
        {isOff ? (
          <>
            <circle cx={108} cy={45} r={5} fill={col} opacity={0.9}/>
            <text x={108} y={47} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">PG</text>
            <circle cx={84} cy={20} r={5} fill={col} opacity={0.85}/>
            <text x={84} y={22} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">SG</text>
            <circle cx={84} cy={70} r={5} fill={col} opacity={0.85}/>
            <text x={84} y={72} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">SF</text>
            <circle cx={58} cy={30} r={5} fill={col} opacity={0.8}/>
            <text x={58} y={32} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">PF</text>
            <circle cx={58} cy={60} r={5} fill={col} opacity={0.8}/>
            <text x={58} y={62} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">C</text>
            <path d="M103 43 L88 24" stroke={col} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.55"/>
            <path d="M81 20 L63 28" stroke={col} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.55"/>
          </>
        ) : (
          <>
            <rect x={93} y={18} width={10} height={10} rx="1.5" fill={col} opacity={0.9}/>
            <text x={98} y={25} textAnchor="middle" fill="white" fontSize="4">2</text>
            <rect x={113} y={18} width={10} height={10} rx="1.5" fill={col} opacity={0.9}/>
            <text x={118} y={25} textAnchor="middle" fill="white" fontSize="4">1</text>
            <circle cx={78} cy={46} r={5} fill={col} opacity={0.8}/>
            <text x={78} y={48} textAnchor="middle" fill="white" fontSize="4">3</text>
            <circle cx={54} cy={36} r={5} fill={col} opacity={0.75}/>
            <text x={54} y={38} textAnchor="middle" fill="white" fontSize="4">4</text>
            <circle cx={54} cy={57} r={5} fill={col} opacity={0.75}/>
            <text x={54} y={59} textAnchor="middle" fill="white" fontSize="4">5</text>
          </>
        )}
      </svg>
    )
  }

  if (sport === 'Baseball' || sport === 'Softball') {
    return (
      <svg viewBox="0 0 130 130" style={{ width:'100%', height:'100%' }}>
        <rect x="0" y="0" width="130" height="130" fill="#0a1a0a" rx="2"/>
        <path d="M10 120 Q65 15 120 120 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"/>
        <path d="M65 110 L105 70 L65 30 L25 70 Z" fill="rgba(180,140,80,0.08)" stroke="rgba(255,255,255,0.14)" strokeWidth="1"/>
        <line x1="65" y1="110" x2="10" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" strokeDasharray="4,3"/>
        <line x1="65" y1="110" x2="120" y2="20" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6" strokeDasharray="4,3"/>
        <rect x="61" y="106" width="8" height="8" rx="1" fill="white" opacity="0.85"/>
        <rect x="101" y="66" width="8" height="8" rx="1" fill="white" opacity="0.75" transform="rotate(45 105 70)"/>
        <rect x="61" y="26" width="8" height="8" rx="1" fill="white" opacity="0.75" transform="rotate(45 65 30)"/>
        <rect x="21" y="66" width="8" height="8" rx="1" fill="white" opacity="0.75" transform="rotate(45 25 70)"/>
        <circle cx="65" cy="70" r="4" fill="rgba(180,140,80,0.15)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
        <text x="65" y="125" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="4.5">HOME</text>
        <text x="115" y="69" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="4.5">1B</text>
        <text x="65" y="24" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="4.5">2B</text>
        <text x="15" y="69" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="4.5">3B</text>
        {isOff ? (
          <>
            <circle cx={65} cy={110} r={5} fill={col} opacity={0.9}/>
            <circle cx={105} cy={70} r={4} fill="#f59e0b" opacity={0.8}/>
            <circle cx={65} cy={70} r={4} fill={col} opacity={0.7}/>
            <path d="M65 105 L38 52" stroke={col} strokeWidth="1.5" fill="none" strokeDasharray="3,2" opacity="0.7"/>
            <path d="M107 65 L70 33" stroke="#f59e0b" strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.8"/>
          </>
        ) : (
          <>
            {[[65,110],[105,70],[65,30],[25,70],[65,70],[18,52],[112,52],[65,18],[42,52],[88,52]].map(([cx,cy],i)=>(
              <circle key={i} cx={cx} cy={cy} r={i===0?5:4} fill={col} opacity={i<4?0.85:0.7}/>
            ))}
          </>
        )}
      </svg>
    )
  }

  if (sport === 'Soccer') {
    return (
      <svg viewBox="0 0 80 130" style={{ width:'100%', height:'100%' }}>
        <rect x="0" y="0" width="80" height="130" fill="#0d1a0d" rx="2"/>
        <rect x="3" y="3" width="74" height="124" rx="2" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
        <line x1="3" y1="65" x2="77" y2="65" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7"/>
        <circle cx="40" cy="65" r="12" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.6"/>
        <rect x="22" y="3" width="36" height="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
        <rect x="30" y="1" width="20" height="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
        <rect x="22" y="109" width="36" height="18" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6"/>
        <rect x="30" y="124" width="20" height="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6"/>
        {isOff ? (
          <>
            <circle cx={40} cy={122} r={4} fill={col} opacity={0.55}/>
            {[14,30,50,66].map((x,i)=><circle key={i} cx={x} cy={106} r={4} fill={col} opacity={0.8}/>)}
            {[22,40,58].map((x,i)=><circle key={i} cx={x} cy={88} r={4} fill={col} opacity={0.85}/>)}
            {[14,40,66].map((x,i)=><circle key={i} cx={x} cy={68} r={4} fill={col} opacity={0.9}/>)}
            <path d="M38 68 L18 50" stroke={col} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.55"/>
            <path d="M42 68 L62 50" stroke={col} strokeWidth="1" fill="none" strokeDasharray="3,2" opacity="0.55"/>
            <path d="M40 64 L40 30" stroke={col} strokeWidth="1.2" fill="none" strokeDasharray="3,2" opacity="0.6"/>
          </>
        ) : (
          <>
            <circle cx={40} cy={8} r={4} fill={col} opacity={0.55}/>
            {[14,30,50,66].map((x,i)=><rect key={i} x={x-4} y={22} width={8} height={8} rx="1" fill={col} opacity={0.9}/>)}
            {[14,30,50,66].map((x,i)=><circle key={i} cx={x} cy={44} r={4} fill={col} opacity={0.8}/>)}
            {[28,52].map((x,i)=><circle key={i} cx={x} cy={58} r={4} fill={col} opacity={0.75}/>)}
            <line x1="10" y1="44" x2="70" y2="44" stroke={col} strokeWidth="0.7" opacity="0.3" strokeDasharray="2,2"/>
          </>
        )}
      </svg>
    )
  }

  // Football (landscape) — default
  return (
    <svg viewBox="0 0 160 90" style={{ width:'100%', height:'100%' }}>
      <rect x="0" y="0" width="160" height="90" fill="#0a1a0a" rx="2"/>
      {[40,80,120].map((x,i)=><line key={i} x1={x} y1="4" x2={x} y2="86" stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" strokeDasharray="3,3"/>)}
      <line x1="4" y1="54" x2="156" y2="54" stroke="rgba(255,255,255,0.15)" strokeWidth="0.9"/>
      <text x="7" y="51" fill="rgba(255,255,255,0.2)" fontSize="4.5" fontFamily="monospace">LOS</text>
      {isOff ? (
        <>
          {[52,64,76,88,100].map((x,i)=><rect key={i} x={x-5} y={47} width={10} height={9} rx="1.5" fill={col} opacity={0.9}/>)}
          <rect x={109} y={47} width={10} height={9} rx="1.5" fill={col} opacity={0.8}/>
          <circle cx={24} cy={47} r={5} fill={col} opacity={0.8}/>
          <circle cx={146} cy={47} r={5} fill={col} opacity={0.8}/>
          <circle cx={76} cy={63} r={5} fill={col} opacity={0.9}/>
          <text x={76} y={65} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">QB</text>
          <circle cx={76} cy={75} r={4} fill={col} opacity={0.8}/>
          <text x={76} y={77} textAnchor="middle" fill="white" fontSize="3.5">FB</text>
          <circle cx={76} cy={84} r={5} fill={col} opacity={0.85}/>
          <text x={76} y={86} textAnchor="middle" fill="white" fontSize="4" fontWeight="700">HB</text>
          <path d="M24 42 L24 28 L42 28" stroke={col} strokeWidth="1.1" fill="none" strokeDasharray="3,2" opacity="0.55"/>
          <path d="M146 42 L146 28 L128 28" stroke={col} strokeWidth="1.1" fill="none" strokeDasharray="3,2" opacity="0.55"/>
          <text x={58} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">LT</text>
          <text x={70} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">LG</text>
          <text x={82} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">C</text>
          <text x={94} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">RG</text>
          <text x={106} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">RT</text>
        </>
      ) : (
        <>
          {[44,64,88,108].map((x,i)=><rect key={i} x={x-5} y={47} width={10} height={9} rx="1.5" fill={col} opacity={0.9}/>)}
          {[50,76,102].map((x,i)=><circle key={i} cx={x} cy={36} r={5} fill={col} opacity={0.85}/>)}
          <circle cx={20} cy={30} r={5} fill={col} opacity={0.8}/>
          <circle cx={140} cy={30} r={5} fill={col} opacity={0.8}/>
          <circle cx={56} cy={20} r={5} fill={col} opacity={0.75}/>
          <circle cx={100} cy={20} r={5} fill={col} opacity={0.75}/>
          <text x={50} y={38} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">OLB</text>
          <text x={76} y={38} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">MLB</text>
          <text x={102} y={38} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">OLB</text>
          <text x={56} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">DE</text>
          <text x={70} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">DT</text>
          <text x={94} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">DT</text>
          <text x={114} y={53} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">DE</text>
          <text x={56} y={22} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">FS</text>
          <text x={100} y={22} textAnchor="middle" fill="white" fontSize="3" opacity="0.7">SS</text>
        </>
      )}
    </svg>
  )
}
function SchemesPage({ P, S, al, dk, sport, callAI, parseJSON, playbook, setPlaybook, genHistory, setGenHistory, iq, setIQ }) {
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

      <PlayNameBuilder P={P} S={S} al={al} sport={sport} />
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
    <div ref={wrapRef} style={{ position:'relative' }}>
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
function PlaybookPage({ P, S, al, sport, callAI, parseJSON, playbook, setPlaybook }) {
  const sportFolders = playbook[sport] || {}
  const allFolderNames = [...new Set([...DEFAULT_FOLDERS[sport]||[], ...Object.keys(sportFolders)])]
  const [activeFolder, setActiveFolder] = useState(allFolderNames[0] || 'My Favorites')
  const [newFolderName, setNewFolderName] = useState('')
  const [showNewFolder, setShowNewFolder] = useState(false)

  const folderPlays = sportFolders[activeFolder] || []

  function removePlay(idx) {
    const updated = folderPlays.filter((_,i)=>i!==idx)
    setPlaybook(pb => ({ ...pb, [sport]: { ...sportFolders, [activeFolder]: updated } }))
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
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Your saved plays</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Playbook</div>
      </div>

      {/* Folder tabs */}
      <div style={{ overflowX:'auto', display:'flex', gap:6, paddingBottom:4, marginBottom:12 }}>
        {allFolderNames.map(f => (
          <button key={f} onClick={()=>setActiveFolder(f)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:`1px solid ${activeFolder===f?P:'#1e2330'}`, background:activeFolder===f?al(P,0.15):'transparent', color:activeFolder===f?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px', whiteSpace:'nowrap' }}>
            {f} <span style={{ opacity:0.6, marginLeft:3 }}>{(sportFolders[f]||[]).length}</span>
          </button>
        ))}
        <button onClick={()=>setShowNewFolder(s=>!s)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:'1px dashed #1e2330', background:'transparent', color:'#3d4559', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ New Folder</button>
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
            <div style={{ fontSize:12, color:'#3d4559', lineHeight:1.6 }}>Generate a scheme in the Schemes tab and tap "+ Playbook" to add plays here.</div>
          </div>
        </Card>
      ) : (
        <div>
          <div style={{ fontSize:10, color:'#6b7a96', marginBottom:8 }}>{folderPlays.length} play{folderPlays.length!==1?'s':''} in {activeFolder}</div>
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
function ScoutPage({ P, S, al, sport, callAI, parseJSON }) {
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
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Game preparation</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Scout</div>
      </div>

      {/* Opponent selector */}
      <div style={{ overflowX:'auto', display:'flex', gap:6, paddingBottom:4, marginBottom:12 }}>
        {opponents.map(o => (
          <button key={o.id} onClick={()=>{setActiveOpp(o.id);setScoutResult(null)}} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:`1px solid ${activeOpp===o.id?P:'#1e2330'}`, background:activeOpp===o.id?al(P,0.15):'transparent', color:activeOpp===o.id?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>{o.name}</button>
        ))}
        <button onClick={()=>setShowAddOpp(s=>!s)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:4, fontSize:10, border:'1px dashed #1e2330', background:'transparent', color:'#3d4559', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ Add Opponent</button>
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
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#6b7a96', letterSpacing:'1px', marginBottom:8 }}>No Opponents Added Yet</div>
            <div style={{ fontSize:12, color:'#3d4559', lineHeight:1.6, marginBottom:16 }}>Add an upcoming opponent to build a full AI scouting report, track their tendencies, and create a game plan.</div>
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
                <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:6 }}>Coach Notes</div>
                <textarea value={notes[activeOpp]||''} onChange={e=>setNotes(prev=>({...prev,[activeOpp]:e.target.value}))} placeholder="Add what you know about this team — formation tendencies, key players, things you've seen on film..." rows={3} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:6, padding:'10px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none', resize:'vertical' }} />
              </div>
              {/* Tendencies */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:6 }}>Observed Tendencies</div>
                {(tendencies[activeOpp]||[]).map((t,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, marginBottom:5 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:P, flexShrink:0 }} />
                    <div style={{ flex:1, fontSize:12, color:'#f2f4f8' }}>{t}</div>
                    <button onClick={()=>removeTendency(i)} style={{ background:'transparent', border:'none', color:'#3d4559', cursor:'pointer', fontSize:14, padding:0 }}>×</button>
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

          {scoutLoading && <div style={{ padding:16, textAlign:'center' }}><div style={{ width:20, height:20, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 8px' }} /><div style={{ fontSize:12, color:'#6b7a96' }}>Building scouting report...</div></div>}

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
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:12 }}>
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
function TeamQuickSwitcher({ sport, teams, activeTeam, setActiveTeam, setCfg, setPage, P, al, iq }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const current = activeTeam[sport]

  useEffect(() => {
    function handleClick(e) { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])
  const sportTeams = teams[sport] || []
  const mascotObj = current ? (MASCOTS||[]).find(m=>m.id===current.mascot) : null

  function switchTeam(team) {
    setActiveTeam(prev => ({ ...prev, [sport]: team }))
    setCfg(prev => ({ ...prev, primary: team.primary, secondary: team.secondary }))
    setOpen(false)
  }

  function deselect() {
    setActiveTeam(prev => ({ ...prev, [sport]: null }))
    setOpen(false)
  }

  return (
    <div style={{ position:'relative' }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display:'flex', alignItems:'center', gap:5, background: current ? al(P,0.12) : `rgba(${parseInt(P.slice(1,3),16)||192},${parseInt(P.slice(3,5),16)||57},${parseInt(P.slice(5,7),16)||43},0.12)`, border:`1px solid ${al(P,0.3)}`, borderRadius:3, padding:'3px 9px', cursor:'pointer', userSelect:'none' }}
      >
        {current ? (
          <>
            <span style={{ fontSize:13 }}>{mascotObj?.emoji||'🏆'}</span>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:P, fontWeight:700, letterSpacing:'0.5px', maxWidth:75, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{current.name}</span>
            <span style={{ fontSize:8, color:al(P,0.6), marginLeft:1 }}>▾</span>
          </>
        ) : (
          <>
            <span style={{ fontSize:12 }}>📰</span>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:10, color:P, fontWeight:700, letterSpacing:'0.5px' }}>Feed</span>
          </>
        )}
      </div>

      {open && (
        <div style={{ position:'absolute', top:'100%', right:0, marginTop:4, background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:6, minWidth:180, zIndex:100, boxShadow:'0 8px 24px rgba(0,0,0,0.6)', overflow:'hidden' }}>
          <div style={{ padding:'7px 12px', fontSize:8, letterSpacing:2, color:'#3d4559', textTransform:'uppercase', fontWeight:700, borderBottom:'1px solid #1e2330' }}>Switch Team</div>
          {sportTeams.map(team => {
            const m = (MASCOTS||[]).find(x=>x.id===team.mascot)
            const isCurrent = current?.id === team.id
            return (
              <div key={team.id} onClick={()=>{ if(isCurrent){ setPage('team'); setOpen(false) } else switchTeam(team) }} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', cursor:'pointer', background:isCurrent?al(P,0.1):'transparent', borderBottom:'1px solid #1e2330' }} onMouseEnter={e=>e.currentTarget.style.background=al(P,0.08)} onMouseLeave={e=>e.currentTarget.style.background=isCurrent?al(P,0.1):'transparent'}>
                <span style={{ fontSize:16 }}>{m?.emoji||'🏆'}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8' }}>{team.name}</div>
                  <div style={{ fontSize:9, color:'#6b7a96' }}>{team.season}</div>
                </div>
                {isCurrent && <span style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>ACTIVE ›</span>}
              </div>
            )
          })}
          {current && (
            <div onClick={deselect} style={{ padding:'9px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }} onMouseEnter={e=>e.currentTarget.style.background='rgba(107,154,255,0.08)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ fontSize:14 }}>↩</span>
              <span style={{ fontSize:12, color:'#6b9fff' }}>Deselect team</span>
            </div>
          )}
          {sportTeams.length === 0 && (
            <div onClick={()=>{ setPage('team'); setOpen(false) }} style={{ padding:'9px 12px', cursor:'pointer', fontSize:12, color:P }}>+ Create a team</div>
          )}
          <div onClick={()=>{ setPage('team'); setOpen(false) }} style={{ padding:'9px 12px', cursor:'pointer', borderTop:'1px solid #1e2330', display:'flex', alignItems:'center', gap:8 }} onMouseEnter={e=>e.currentTarget.style.background=al(P,0.06)} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
            <span style={{ fontSize:14 }}>🏆</span>
            <span style={{ fontSize:12, color:'#6b7a96' }}>Manage teams</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PLAY NAME BUILDER ────────────────────────────────────────────────────────
// ─── PLAY NAME BUILDER ────────────────────────────────────────────────────────
function PlayNameBuilder({ P, S, al, sport }) {
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
                <span style={{ fontSize:7, color: s.type==='indicator'?'#f59e0b':s.type==='live'?P:'#3d4559', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, textAlign:'center', maxWidth:44 }}>{s.type==='indicator'?'KEY':s.type==='live'?'SIGN':'FAKE'}</span>
                {i < sig.sequence.length-1 && <div style={{ position:'absolute', right:-8, top:14, color:'#3d4559', fontSize:10 }}>→</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:6, fontSize:9, color:'#6b7a96' }}>
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
      'Ace Right':          { wr:[[18,38],[148,38],[148,28]], qb:[84,58], rb:[[84,68]], fb:[] },
      'Ace Left':           { wr:[[18,38],[18,28],[148,38]], qb:[84,58], rb:[[84,68]], fb:[] },
      'I-Formation Right':  { wr:[[18,38],[148,38]], qb:[84,55], rb:[[84,68]], fb:[[84,62]] },
      'I-Formation Left':   { wr:[[18,38],[148,38]], qb:[84,55], rb:[[84,68]], fb:[[84,62]] },
      'Shotgun Right':      { wr:[[12,38],[148,38],[136,38],[34,38]], qb:[84,62], rb:[[110,62]], fb:[] },
      'Pistol Right':       { wr:[[12,38],[148,38]], qb:[84,58], rb:[[84,68]], fb:[] },
      'Trips Right':        { wr:[[12,38],[130,38],[144,30],[156,38]], qb:[84,58], rb:[[84,68]], fb:[] },
      'Trips Left':         { wr:[[10,38],[24,30],[36,38],[148,38]], qb:[84,58], rb:[[84,68]], fb:[] },
      'Pro Set Right':      { wr:[[12,38],[148,38]], qb:[84,55], rb:[[100,65]], fb:[[68,62]] },
    }
    const fmt = fmtPositions[choices.formation] || fmtPositions['Ace Right']
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
      'Z Jet':    {from:[148,38], to:[40,38], through:true},
      'H Motion': {from:[84,68],  to:[130,62], through:false},
      'Y Shift':  {from:[148,38], to:[18,38], through:false},
      'H Orbit':  {from:[84,68],  to:[18,48], through:false},
      'F Arc':    {from:[84,62],  to:[18,55], through:false},
      'Fly':      {from:[148,38], to:[40,38], through:true},
    }
    const motionPath = motionMap[choices.motion]
    const isPassPlay = choices.playNum && (choices.playNum.startsWith('9') || choices.playNum==='999')

    return (
      <svg viewBox="0 0 200 100" style={{ width:'100%', height:120 }}>
        <rect x="0" y="0" width="200" height="100" fill="#0a1a0a" rx="3"/>
        {[50,100,150].map((x,i)=><line key={i} x1={x} y1="4" x2={x} y2="96" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" strokeDasharray="3,3"/>)}
        {/* LOS */}
        <line x1="4" y1="48" x2="196" y2="48" stroke="rgba(255,255,255,0.18)" strokeWidth="0.9"/>
        <text x="7" y="45" fill="rgba(255,255,255,0.22)" fontSize="5" fontFamily="monospace">LOS</text>
        {/* Strength indicator */}
        {choices.formation && (
          <text x={choices.formation.includes('Left')?20:176} y="15" textAnchor="middle" fill={P} fontSize="5" fontWeight="700" fontFamily="monospace">STR{choices.formation.includes('Left')?'◄':'►'}</text>
        )}
        {/* OL — 5 linemen always on LOS */}
        {[60,72,84,96,108].map((x,i)=>(
          <g key={i}>
            <rect x={x-6} y={40} width={12} height={9} rx="1.5" fill={P} opacity={gap&&!isPassPlay&&Math.abs(x-gap.x)<15?1:0.85}
              stroke={gap&&!isPassPlay&&Math.abs(x-gap.x)<15?'#f59e0b':'none'}
              strokeWidth={gap&&!isPassPlay&&Math.abs(x-gap.x)<15?1.5:0}/>
            <text x={x} y={47} textAnchor="middle" fill="white" fontSize="3.5" fontFamily="monospace">{['LT','LG','C','RG','RT'][i]}</text>
          </g>
        ))}
        {/* TE if tight modifier */}
        {choices.modifier==='Tight'&&<rect x={112} y={40} width={12} height={9} rx="1.5" fill={P} opacity={0.8}/>}
        {/* WRs */}
        {fmt.wr.map(([cx,cy],i)=>(
          <circle key={i} cx={cx} cy={cy} r={5} fill={choices.xRoute&&i===0?'#f59e0b':P} opacity={0.85}/>
        ))}
        {/* QB — BEHIND the LOS */}
        <circle cx={fmt.qb[0]} cy={fmt.qb[1]} r={5.5} fill={P} opacity={0.95}/>
        <text x={fmt.qb[0]} y={fmt.qb[1]+2} textAnchor="middle" fill="white" fontSize="4.5" fontWeight="700">QB</text>
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
            <rect x={gap.x-5} y={38} width={10} height={13} rx="1" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" strokeWidth="1"/>
            <path d={`M${gap.x} 50 L${gap.x} 65`} stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#arr)"/>
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
      <CardHead icon="✏️" title="Play Name Builder" tag={sport==='Baseball'||sport==='Softball'?'SIGNAL CREATOR':'LEARN'} tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        <p style={{ fontSize:12, color:'#6b7a96', lineHeight:1.6, marginBottom:10 }}>{sport==='Baseball'||sport==='Softball'?'Define the situation, choose the play, and generate a real third-base coach signal sequence.':'Build a professional play call step by step. The diagram updates with every choice you make.'}</p>

        {!result ? (
          <>
            <div style={{ display:'flex', gap:3, marginBottom:10 }}>
              {steps.map((_,i)=><div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<step?P:i===step?P:'#1e2330', opacity:i===step?1:i<step?0.7:0.3, transition:'all 0.2s' }}/>)}
            </div>

            <div style={{ background:'#0a1a0a', borderRadius:6, border:'1px solid #1e2330', overflow:'hidden', marginBottom:10 }}>
              <div style={{ fontSize:7, letterSpacing:1.5, color:'#3d4559', textTransform:'uppercase', fontWeight:700, padding:'4px 10px', borderBottom:'1px solid #1e2330' }}>
                {sport==='Baseball'||sport==='Softball'?'Signal Preview — builds as you choose':'Live Diagram — updates with each selection'}
              </div>
              <div style={{ padding:'6px' }}><LiveDiagram /></div>
            </div>

            <div style={{ marginBottom:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <div style={{ fontSize:9, letterSpacing:1.5, color:P, textTransform:'uppercase', fontWeight:700 }}>Step {step+1} of {steps.length} — {currentStep.label}</div>
                {currentStep.optional && <span style={{ fontSize:8, color:'#6b7a96', padding:'1px 6px', background:'#1e2330', borderRadius:3, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>OPTIONAL</span>}
              </div>
              <div style={{ fontSize:12, color:'#dde1f0', lineHeight:1.5, marginBottom:6 }}>{currentStep.desc}</div>
              {currentStep.note && (
                <div style={{ fontSize:10, color:'#6b7a96', lineHeight:1.5, padding:'6px 10px', background:'rgba(107,154,255,0.06)', borderRadius:4, borderLeft:'2px solid rgba(107,154,255,0.3)', marginBottom:8 }}>
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
                      <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${isSelected?P:'#3d4559'}`, background:isSelected?P:'transparent', flexShrink:0 }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:12, color:isSelected?P:'#f2f4f8', fontWeight:isSelected?700:400 }}>{label}</div>
                        {ex && <div style={{ fontSize:10, color:'#6b7a96', marginTop:1 }}>{ex}</div>}
                      </div>
                      {isSelected && <span style={{ fontSize:12, color:P }}>✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {choices[currentStep?.id] !== undefined && choices[currentStep?.id] !== null && (
              <div style={{ marginTop:4, padding:'5px 10px', background:al(P,0.07), borderRadius:4, fontSize:10, color:P, fontFamily:"'Barlow Condensed',sans-serif" }}>
                {step > 0 ? <span style={{ color:'#6b7a96' }}>Built: </span> : null}
                {steps.slice(0,step+1).map(s=>choices[s.id]).filter(Boolean).join(' · ')}
              </div>
            )}

            <div style={{ display:'flex', gap:8, marginTop:10 }}>
              {step > 0 && <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, padding:'10px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>← BACK</button>}
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
                          <div style={{ fontSize:8, color:s.type==='indicator'?'#f59e0b':s.type==='live'?P:'#3d4559', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginTop:2 }}>{s.type==='indicator'?'KEY':s.type==='live'?'SIGN':'FAKE'}</div>
                        </div>
                        {i < result.signalData.sequence.length-1 && <span style={{ color:'#3d4559', fontSize:14 }}>→</span>}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:8, padding:'6px 10px', background:'rgba(239,68,68,0.08)', borderRadius:4, border:'1px solid rgba(239,68,68,0.2)', textAlign:'center' }}>
                    <span style={{ fontSize:9, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>WIPE-OFF: </span>
                    <span style={{ fontSize:11, color:'#f2f4f8' }}>{result.signalData.wipeoff} — cancels all signs</span>
                  </div>
                </div>
                <div style={{ padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, marginBottom:10 }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>How It Works</div>
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
                  <div style={{ fontSize:9, letterSpacing:1.5, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Why It Is Called This</div>
                  <div style={{ fontSize:12, color:'#dde1f0', lineHeight:1.7 }}>{result.explanation}</div>
                </div>
              </>
            )}
            {result.ytSearch && (
              <a href={'https://www.youtube.com/results?search_query='+encodeURIComponent(result.ytSearch)} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:6, textDecoration:'none', marginBottom:10 }}>
                <span style={{ fontSize:16 }}>▶</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:9, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>WATCH ON YOUTUBE</div>
                  <div style={{ fontSize:11, color:'#6b7a96' }}>{result.ytSearch}</div>
                </div>
                <span style={{ fontSize:11, color:'#ef4444' }}>→</span>
              </a>
            )}
            <button onClick={reset} style={{ width:'100%', padding:'10px', background:'transparent', border:`1px solid ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>
              {sport==='Baseball'||sport==='Softball'?'BUILD ANOTHER SIGNAL →':'BUILD ANOTHER CALL →'}
            </button>
          </div>
        )}
      </div>
    </Card>
  )
}


function RulebookPage({ sport, P, al, callAI }) {
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
          <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.5, marginBottom:12, padding:'8px 10px', background:'rgba(245,158,11,0.06)', borderRadius:4, border:'1px solid rgba(245,158,11,0.15)' }}>⚠️ Links open official org homepages. Use Search for specific documents.</div>
          {safeLinks.map((link,i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#161922', border:`1px solid ${al(P,0.2)}`, borderRadius:6, marginBottom:8, borderLeft:`3px solid ${P}` }}>
              <span style={{ fontSize:16, flexShrink:0 }}>📋</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8', marginBottom:2 }}>{link.name}</div>
                <div style={{ fontSize:10, color:'#6b7a96' }}>{link.org}</div>
                <div style={{ fontSize:9, color:P, marginTop:2, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{link.level}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
                <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, padding:'3px 8px', border:`1px solid ${al(P,0.4)}`, borderRadius:3, textDecoration:'none', textAlign:'center' }}>VISIT →</a>
                <a href={'https://www.google.com/search?q='+encodeURIComponent(link.search)} target="_blank" rel="noopener noreferrer" style={{ fontSize:9, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, padding:'3px 8px', border:'1px solid #1e2330', borderRadius:3, textDecoration:'none', textAlign:'center' }}>SEARCH</a>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <CardHead icon="🔍" title="Find Your League Rules" tag="AI SEARCH" tagColor={P} accent={P} />
        <div style={{ padding:14 }}>
          <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.5, marginBottom:10 }}>Enter your league name to find rule modifications and governing body info.</div>
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <input value={leagueSearch} onChange={e=>setLeagueSearch(e.target.value)} onKeyDown={e=>e.key==='Enter'&&searchLeague()} placeholder={'e.g. Tolland Youth '+sport} style={{ flex:1, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
            <button onClick={searchLeague} disabled={searching||!leagueSearch.trim()} style={{ padding:'9px 14px', background:leagueSearch.trim()&&!searching?P:'#3d4559', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:leagueSearch.trim()&&!searching?'pointer':'not-allowed', whiteSpace:'nowrap' }}>{searching?'..':'SEARCH'}</button>
          </div>
          {searching && <div style={{ textAlign:'center', padding:'14px', color:'#6b7a96', fontSize:12 }}>Searching for {leagueSearch} rules...</div>}
          {leagueResult && !searching && (
            <div style={{ animation:'fadeIn 0.3s ease' }}>
              <div style={{ padding:'10px 12px', background:al(P,0.08), border:`1px solid ${al(P,0.25)}`, borderRadius:6, marginBottom:8 }}>
                <div style={{ fontSize:9, letterSpacing:1.5, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Governing Body</div>
                <div style={{ fontSize:13, color:'#f2f4f8', fontWeight:600, marginBottom:6 }}>{leagueResult.governingBody}</div>
                <a href={'https://www.google.com/search?q='+encodeURIComponent((leagueResult.governingBody||'')+(sport ? ' '+sport : '')+' official rules')} target="_blank" rel="noopener noreferrer" style={{ fontSize:11, color:P, display:'inline-block', padding:'4px 10px', background:al(P,0.1), borderRadius:3, textDecoration:'none' }}>🔍 Search official rules →</a>
                <div style={{ fontSize:9, color:'#3d4559', marginTop:4, fontStyle:'italic' }}>Opens Google. CoachIQ is not responsible for third-party results.</div>
              </div>
              {leagueResult.commonModifications && leagueResult.commonModifications.length > 0 && (
                <div style={{ padding:'10px 12px', background:'#161922', border:'1px solid #1e2330', borderRadius:6, marginBottom:8 }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Common Youth Rule Modifications</div>
                  {leagueResult.commonModifications.map((m,i) => <div key={i} style={{ fontSize:11, color:'#dde1f0', lineHeight:1.6, padding:'3px 0', borderBottom:i<leagueResult.commonModifications.length-1?'1px solid #1e2330':'none' }}>• {m}</div>)}
                </div>
              )}
              {leagueResult.safetyRules && leagueResult.safetyRules.length > 0 && (
                <div style={{ padding:'10px 12px', background:'rgba(74,222,128,0.05)', border:'1px solid rgba(74,222,128,0.2)', borderRadius:6, marginBottom:8 }}>
                  <div style={{ fontSize:9, letterSpacing:1.5, color:'#4ade80', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Safety Rules</div>
                  {leagueResult.safetyRules.map((r,i) => <div key={i} style={{ fontSize:11, color:'#dde1f0', lineHeight:1.6, padding:'3px 0' }}>✓ {r}</div>)}
                </div>
              )}
              {leagueResult.note && <div style={{ fontSize:10, color:'#6b7a96', fontStyle:'italic', lineHeight:1.5, padding:'8px 10px', background:'#161922', borderRadius:4 }}>Note: {leagueResult.note}</div>}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
function MorePage({ P, S, al, cfg, setCfg, brand, setBrand, sport, homeLocation, setHomeLocation, callAI }) {
  const [activeSection, setActiveSection] = useState('features')
  const [helpMode, setHelpMode] = useState(null)
  const colorOptions = {
    primary: ['#C0392B','#E8460C','#D4600A','#1B5E20','#0066CC','#7B1FA2','#C8A400','#1565C0','#880E4F'],
    secondary: ['#002868','#1a3a6b','#37474f','#1B5E20','#4a0070','#1a1a1a','#5c3a00','#004d40','#6b0010'],
  }

  const coachFeatures = [
    { icon:'📊', title:'Advanced Analytics', desc:'Win probability models, tendency heat maps, and opponent pattern recognition across every game.', status:'COMING SOON', color:'#f59e0b' },
    { icon:'📋', title:'Printable Wristbands & Coach Sheets', desc:'Export your playbook into print-ready wristband cards, laminated coach sheets, and game-day checklists.', status:'IN PROGRESS', color:'#4ade80' },
    { icon:'🎥', title:'Film Upload & AI Breakdown', desc:'Upload full game film and get automatic play-by-play breakdowns, error detection, and opponent scouting.', status:'COMING SOON', color:'#6b9fff' },
    { icon:'🔁', title:'In-Game Adjustment Mode', desc:'Live sideline tool that tracks downs, suggests adjustments, and logs real-time game events.', status:'COMING SOON', color:'#c084fc' },
    { icon:'📆', title:'Practice Planner', desc:'AI-generated week-by-week practice schedules tailored to your upcoming opponent and team needs.', status:'COMING SOON', color:'#f59e0b' },
    { icon:'🤝', title:'Coach Network & Play Sharing', desc:'Share packages with other coaches, discover trending schemes, and follow elite youth coordinators.', status:'COMING SOON', color:'#6b9fff' },
    { icon:'🏆', title:'League & Season Manager', desc:'Track standings, schedule games, and manage your full season across multiple teams from one dashboard.', status:'COMING SOON', color:'#f87171' },
    { icon:'🎓', title:'Coaching Certification Path', desc:'AI-powered coursework with nationally recognized youth coaching certifications built in.', status:'COMING SOON', color:'#4ade80' },
  ]

  const bpDot = (color) => (
    <span style={{ display:'inline-block', width:7, height:7, borderRadius:'50%', background:color, marginRight:5 }} />
  )

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Platform & settings</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>More</div>
      </div>

      {/* Section switcher */}
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {[['features','🚀 Features'],['rulebook','📜 Rules'],['help','❓ Help'],['settings','⚙️ Settings']].map(([k,lbl]) => (
          <button key={k} onClick={()=>setActiveSection(k)} style={{ flex:1, padding:'9px', borderRadius:4, fontSize:11, border:`1px solid ${activeSection===k?P:'#1e2330'}`, background:activeSection===k?al(P,0.15):'transparent', color:activeSection===k?P:'#6b7a96', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>{lbl}</button>
        ))}
      </div>

      {activeSection === 'features' && (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ fontSize:10, color:'#6b7a96', lineHeight:1.6, marginBottom:4 }}>CoachIQ is being built for coaches. Here's what's coming next on the roadmap — tap any feature to learn more.</div>
          {coachFeatures.map((f,i) => (
            <div key={i} style={{ background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, padding:'13px 14px', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ fontSize:26, flexShrink:0, marginTop:2 }}>{f.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4, flexWrap:'wrap' }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:'#f2f4f8' }}>{f.title}</div>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, padding:'2px 7px', borderRadius:2, background:`rgba(${parseInt(f.color.slice(1,3),16)},${parseInt(f.color.slice(3,5),16)},${parseInt(f.color.slice(5,7),16)},0.15)`, color:f.color, letterSpacing:'0.5px' }}>{f.status}</span>
                </div>
                <div style={{ fontSize:12, color:'#6b7a96', lineHeight:1.5 }}>{f.desc}</div>
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
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <div onClick={()=>setHelpMode('tour')} style={{ padding:'18px 12px', background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:6, cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>⚡</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:P, marginBottom:4 }}>Quick Tour</div>
              <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.5 }}>6-step walkthrough of every tab</div>
            </div>
            <div onClick={()=>setHelpMode('guide')} style={{ padding:'18px 12px', background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:6, cursor:'pointer', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:8 }}>📖</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:P, marginBottom:4 }}>Feature Guide</div>
              <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.5 }}>Deep dive into every feature</div>
            </div>
          </div>
          <div style={{ padding:'12px 14px', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4 }}>
            <div style={{ fontSize:9, letterSpacing:1.5, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Feature Overview</div>
            {TUTORIAL_STEPS.map((step,i) => (
              <div key={i} style={{ display:'flex', gap:10, padding:'8px 0', borderBottom:i<TUTORIAL_STEPS.length-1?'1px solid #1e2330':'none' }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{step.icon}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#f2f4f8', marginBottom:2 }}>{step.title}</div>
                  <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.5 }}>{step.desc}</div>
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
              <div style={{ fontSize:11, color:'#6b7a96', marginBottom:10, lineHeight:1.5 }}>Choose your brand palette for the CoachIQ logo across the app.</div>
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

          {/* Team colors */}
          <Card>
            <CardHead icon="📍" title="My Location" accent={P} />
            <div style={{ padding:14 }}>
              <div style={{ fontSize:11, color:'#6b7a96', lineHeight:1.5, marginBottom:10 }}>Used for home weather when no team is selected. Auto-detects via GPS or enter manually.</div>
              <div style={{ display:'flex', gap:8 }}>
                <input value={homeLocation||''} onChange={e=>setHomeLocation&&setHomeLocation(e.target.value)} placeholder="e.g. Tolland, CT" style={{ flex:1, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                <button onClick={()=>{ if(navigator.geolocation){ navigator.geolocation.getCurrentPosition(pos=>{ fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat='+pos.coords.latitude+'&lon='+pos.coords.longitude).then(r=>r.json()).then(d=>{ const a=d.address||{}; const city=a.city||a.town||a.village||''; const state=a.state||''; if(setHomeLocation) setHomeLocation([city,state].filter(Boolean).join(', ')) }) }) }}} style={{ padding:'9px 12px', background:al(P,0.15), border:`1px solid ${al(P,0.3)}`, borderRadius:4, color:P, fontSize:12, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>📍 AUTO</button>
              </div>
            </div>
          </Card>
          <Card>
            <CardHead icon="🏷" title="Team Colors" accent={P} />
            <div style={{ padding:14 }}>
              <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:10 }}>Primary Color</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
                {colorOptions.primary.map(c => (<div key={c} onClick={() => setCfg(prev=>({...prev,primary:c}))} style={{ width:32, height:32, borderRadius:4, background:c, border:`3px solid ${cfg.primary===c?'white':'transparent'}`, cursor:'pointer' }} />))}
              </div>
              <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:10 }}>Secondary Color</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
                {colorOptions.secondary.map(c => (<div key={c} onClick={() => setCfg(prev=>({...prev,secondary:c}))} style={{ width:32, height:32, borderRadius:4, background:c, border:`3px solid ${cfg.secondary===c?'white':'transparent'}`, cursor:'pointer' }} />))}
              </div>
              <div style={{ height:6, borderRadius:3, background:`linear-gradient(90deg,${P} 55%,${cfg.secondary||'#002868'} 55%)` }} />
            </div>
          </Card>

          {/* App info */}
          <div style={{ padding:'12px 14px', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, textAlign:'center' }}>
            <CoachIQLogo size={20} brand={brand} />
            <div style={{ fontSize:10, color:'#3d4559', marginTop:6 }}>v1.0 · Built for youth coaches</div>
          </div>
        </div>
      )}
    </>
  )
}


// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ P, S, al, dk, lastName, sport, iq, setIQ, gauntlets, setGauntlets, callAI, parseJSON, brand, teams, setTeams, activeTeam, setActiveTeam, setSport, setCfg, homeLocation, setPage }) {
  const [feed, setFeed] = useState(null)
  const [feedLoading, setFeedLoading] = useState(false)
  const [activeMode, setActiveMode] = useState('dashboard')

  useEffect(() => { if (!feed && !feedLoading) loadFeed() }, [sport])

  async function loadFeed() {
    setFeedLoading(true)
    try {
      const raw = await callAI('You are an expert '+sport+' coaching knowledge curator. Generate a daily coaching feed SPECIFICALLY for youth '+sport+' coaches. Every item must be specific to '+sport+'. Include a searchQuery (Google search terms) and ytSearch (YouTube terms) for each item. Return ONLY valid JSON: {"items":[{"type":"drill","title":"Drill of the Day","body":"describe a specific proven drill in 2 sentences","source":"coach or program name"},{"type":"science","title":"Coaching Science","body":"a real sports science finding relevant to youth '+sport+' in 2 sentences","source":"institution or researcher"},{"type":"concept","title":"Concept Spotlight","body":"explain a famous '+sport+' scheme or philosophy in 2 sentences","source":"coach name"}]}')
      const s = raw.replace(/```[\w]*\n?/gi,'').replace(/```/g,'').trim()
      setFeed(JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}')+1)))
    } catch(e) { setFeed({ items: [] }) }
    setFeedLoading(false)
  }

  const feedTypeColor = t => t==='drill'?P:t==='science'?'#6b9fff':'#4ade80'

  if (activeMode === 'schemes_offense' || activeMode === 'schemes_defense') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport} {activeMode==='schemes_offense'?'Offensive':'Defensive'} Schemes</span>
      </div>
      <SchemesPage P={P} S={S} al={al} dk={dk} sport={sport} callAI={callAI} parseJSON={parseJSON} playbook={{Football:{},Basketball:{},Baseball:{}}} setPlaybook={()=>{}} genHistory={{Football:[],Basketball:[],Baseball:[]}} setGenHistory={()=>{}} iq={iq} setIQ={setIQ} defaultOpenOff={activeMode==='schemes_offense'} defaultOpenDef={activeMode==='schemes_defense'} />
    </>
  )

  if (activeMode === 'gauntlet') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>{sport} Gauntlet</span>
      </div>
      <GauntletPage P={P} S={S} al={al} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} />
    </>
  )

  if (activeMode === 'film') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, letterSpacing:'1px', color:'#f2f4f8', textTransform:'uppercase', flex:1 }}>Film Room</span>
      </div>
      <FilmPage P={P} S={S} al={al} dk={dk} sport={sport} callAI={callAI} parseJSON={parseJSON} />
    </>
  )

  if (activeMode === 'situational') return (
    <>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, paddingTop:16 }}>
        <button onClick={()=>setActiveMode('dashboard')} style={{ background:'transparent', border:'0.5px solid #1e2330', borderRadius:4, padding:'5px 10px', color:'#6b7a96', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>← Back</button>
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
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:al(P,0.7), letterSpacing:'2px', textTransform:'uppercase', marginBottom:1 }}>Welcome back</div>
                <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:ct?22:20, color:'#f2f4f8', lineHeight:1, marginBottom:ct?3:0 }}>Coach {lastName||'—'}</div>
                {ct && <div style={{ fontFamily:teamFont, fontStyle:'italic', fontSize:13, color:ct.primary, letterSpacing:'0.5px', marginBottom:2 }}>{mascotObj?.emoji} {ct.name}</div>}
                {ct?.season && <div style={{ fontSize:9, color:'#3d4559', fontFamily:"'Barlow Condensed',sans-serif" }}>{ct.season}{ct.hometown?' · '+ct.hometown:''}</div>}
              </div>
              <RotatingInfoWidget
                sport={sport}
                homeLocation={ct ? ct.hometown : homeLocation}
                awayLocation={awayLoc}
                nextEvent={nextEvt}
                P={P}
                al={al}
              />
            </div>
          </div>
        )
      })()}

      {/* Ticker */}
      <div style={{ background:'#0a0c14', display:'flex', alignItems:'center', overflow:'hidden', borderTop:'1px solid #0e1220', borderBottom:'1px solid #0e1220', height:26, margin:'0 -14px' }}>
        <div style={{ background:P, padding:'0 10px 0 14px', height:'100%', display:'flex', alignItems:'center', flexShrink:0, clipPath:'polygon(0 0,100% 0,calc(100% - 6px) 100%,0 100%)' }}><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, color:'white', letterSpacing:'1.5px' }}>LIVE</span></div>
        <div style={{ overflow:'hidden', flex:1, paddingLeft:8 }}><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#4a5470', whiteSpace:'nowrap', animation:'ticker 28s linear infinite', letterSpacing:'0.5px' }}>{feed&&feed.items?.length>0?feed.items.map(i=>`${i.title}: ${i.body}`).join(' · '):`🏈 CoachIQ — AI Coaching Intelligence · Generate schemes · Scout opponents · Build your playbook`}</div></div>
      </div>

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
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
            <div onClick={e=>{e.stopPropagation();setActiveMode('schemes_offense')}} style={{ background:'rgba(0,0,0,0.3)', borderRadius:6, overflow:'hidden', border:`1px solid ${al(P,0.2)}`, position:'relative', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:5, left:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, color:P, letterSpacing:'1px', zIndex:1 }}>OFFENSE ›</div>
              <div style={{ height:72, padding:'18px 6px 6px' }}><SchemePreviewMini type="offense" P={P} sport={sport} /></div>
            </div>
            <div onClick={e=>{e.stopPropagation();setActiveMode('schemes_defense')}} style={{ background:'rgba(0,0,0,0.3)', borderRadius:6, overflow:'hidden', border:'1px solid rgba(107,154,255,0.2)', position:'relative', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:5, left:7, fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, fontWeight:700, color:'#6b9fff', letterSpacing:'1px', zIndex:1 }}>DEFENSE ›</div>
              <div style={{ height:72, padding:'18px 6px 6px' }}><SchemePreviewMini type="defense" P={P} sport={sport} /></div>
            </div>
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
            {['AI Diagrams','Educator Mode','Pro Comparison','Huddle Cards','Variations'].map(tag => (<span key={tag} style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, padding:'2px 8px', background:'rgba(192,57,43,0.1)', borderLeft:'2px solid rgba(192,57,43,0.3)', color:'rgba(192,57,43,0.7)', letterSpacing:'0.5px' }}>{tag}</span>))}
          </div>
        </div>
      </div>

      {/* Quick access grid */}
      <div style={{ marginTop:8, display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
        <div onClick={()=>setActiveMode('gauntlet')} style={{ background:'#0f1219', border:'1px solid #1c2235', borderRadius:4, padding:'12px', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}><span style={{ fontSize:16 }}>⚡</span><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#dde1f0' }}>Gauntlet</div></div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:'#4a5470', lineHeight:1.4, marginBottom:8 }}>Test your coaching IQ with live AI scenarios</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:4 }}><span style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:20, color:'#f59e0b', lineHeight:1 }}>{iq}</span><span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'#3a4260', textTransform:'uppercase' }}>IQ</span></div>
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
          <div style={{ fontSize:12, color:'#3a4260' }}>›</div>
        </div>
      </div>

      {/* Coaching Feed */}
      <div style={{ marginTop:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
          <div style={{ width:3, height:10, background:'#4ade80', transform:'skewX(-15deg)', flexShrink:0 }} />
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, letterSpacing:'2px', textTransform:'uppercase', color:'#4ade80' }}>Coaching Feed</span>
          <button onClick={loadFeed} style={{ marginLeft:'auto', fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#6b7a96', background:'transparent', border:'0.5px solid #1e2330', borderRadius:2, padding:'2px 8px', cursor:'pointer' }}>Refresh</button>
        </div>
        {feedLoading && <div style={{ padding:'16px', background:'#0f1219', borderRadius:4, border:'0.5px solid #1e2330', textAlign:'center' }}><div style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', margin:'0 auto 6px' }} /><div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, color:'#6b7a96' }}>Loading {sport} coaching content...</div></div>}
        {feed && (feed.items||[]).map((item,i) => (
          <div key={i} style={{ background:'#0f1219', border:'0.5px solid #1e2330', borderRadius:4, padding:'10px 12px', marginBottom:7, borderLeft:`2px solid ${feedTypeColor(item.type)}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:8, color:feedTypeColor(item.type), textTransform:'uppercase', letterSpacing:'1px' }}>{item.type==='drill'?'Drill of the Day':item.type==='science'?'Coaching Science':'Concept Spotlight'}</span>
              {item.source && <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:8, color:'#3d4559' }}>· {item.source}</span>}
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


// ─── NAV BUTTON WITH LONG PRESS ──────────────────────────────────────────────
function NavButton({ id, icon, label, submenu, isActive, P, al, setPage }) {
  const [showSub, setShowSub] = useState(false)
  const pressTimer = useRef(null)

  function handlePressStart() {
    if (!submenu || submenu.length === 0) return
    pressTimer.current = setTimeout(() => setShowSub(true), 450)
  }

  function handlePressEnd() {
    clearTimeout(pressTimer.current)
  }

  function handleClick() {
    if (!showSub) setPage(id)
  }

  return (
    <div style={{ flex:1, position:'relative' }}>
      {showSub && (
        <>
          <div onClick={()=>setShowSub(false)} style={{ position:'fixed', inset:0, zIndex:90 }} />
          <div style={{ position:'absolute', bottom:'100%', left:'50%', transform:'translateX(-50%)', background:'#0f1219', border:`1px solid ${al(P,0.35)}`, borderRadius:8, padding:6, zIndex:100, minWidth:110, boxShadow:'0 -8px 24px rgba(0,0,0,0.7)', animation:'fadeIn 0.15s ease', marginBottom:6 }}>
            <div style={{ fontSize:8, letterSpacing:1.5, color:'#3d4559', textTransform:'uppercase', fontWeight:700, padding:'3px 8px 5px', borderBottom:'1px solid #1e2330', marginBottom:4 }}>{label}</div>
            {(submenu||[]).map((item,i) => (
              <div key={i} onClick={()=>{ setPage(id); setShowSub(false) }} style={{ padding:'7px 10px', cursor:'pointer', fontSize:12, color:'#f2f4f8', borderRadius:4, display:'flex', alignItems:'center', gap:6 }} onMouseEnter={e=>e.currentTarget.style.background=al(P,0.1)} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                {item.label}
              </div>
            ))}
          </div>
        </>
      )}
      <button
        onClick={handleClick}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', padding:'8px 4px 6px', cursor:'pointer', gap:2, background:'none', border:'none', position:'relative', minHeight:50 }}
      >
        {isActive && <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:24, height:2, background:P }} />}
        <span style={{ fontSize:14, color:isActive?P:'#3d4559' }}>{icon}</span>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:7, color:isActive?P:'#3d4559', fontWeight:700, letterSpacing:'0.8px', textTransform:'uppercase' }}>{label}</span>
      </button>
    </div>
  )
}


export default function CoachIQ() {
  // All hooks must be declared before any early returns (React Rules of Hooks)
  const [mounted, setMounted] = useState(false)
  const [launched, setLaunched] = useState(false)
  const [tutorialState, setTutorialState] = useState('pending') // pending|tour|guide|done
  const [homeLocation, setHomeLocation] = useState('')
  const [showSplash, setShowSplash] = useState(true)
  const [cfg, setCfg] = useState({ coach:'', team:'', primary:'#C0392B', secondary:'#002868' })
  const [brand, setBrand] = useState('Red — C+IQ colored')
  const [page, setPage] = useState('home')
  const [sport, setSport] = useState('Football')
  const [iq, setIQ] = useState(847)
  const [gauntlets, setGauntlets] = useState(0)
  const [playbook, setPlaybook] = useState({ Football:{}, Basketball:{}, Baseball:{}, Soccer:{}, Softball:{} })
  const [genHistory, setGenHistory] = useState({ Football:[], Basketball:[], Baseball:[], Soccer:[], Softball:[] })
  const [teams, setTeams] = useState({ Football:[], Basketball:[], Baseball:[], Soccer:[], Softball:[] })
  const [activeTeam, setActiveTeam] = useState({ Football:null, Basketball:null, Baseball:null, Soccer:null, Softball:null })

  // SSR guard - prevents crash during Next.js prerendering
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null


  const sportColors = SPORT_COLORS[sport] || SPORT_COLORS.Football
  const currentTeam = activeTeam[sport]
  const P = currentTeam?.primary || sportColors.primary
  const S = currentTeam?.secondary || sportColors.secondary
  const lastName = cfg.coach.replace(/^Coach\s*/i,'').trim().split(' ').pop()

  async function callAI(prompt, imageData) {
    const messages = imageData
      ? [{ role:'user', content:[{ type:'image', source:{ type:'base64', media_type:imageData.mime, data:imageData.b64 } },{ type:'text', text:prompt }] }]
      : [{ role:'user', content:prompt }]
    const res = await fetch('/api/ai', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ messages }) })
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

  if (showSplash) return (
    <SplashScreen onDone={(skipToApp) => { setShowSplash(false); if (skipToApp) setLaunched(true) }} alreadyAuthed={launched} brand={brand} />
  )
  if (!launched) return (
    <Onboarding onLaunch={(c) => { setCfg(c); if(c.sport) setSport(c.sport); setLaunched(true) }} brand={brand} />
  )

  // First-time tutorial flow
  if (tutorialState === 'pending') return (
    <FirstTimeWelcome onChoice={(c)=>setTutorialState(c==='skip'?'done':c)} P={P} al={al} />
  )
  if (tutorialState === 'tour') return (
    <QuickTourModal onDone={()=>setTutorialState('done')} P={P} al={al} setPage={setPage} />
  )
  if (tutorialState === 'guide') return (
    <FeatureGuide P={P} al={al} onClose={()=>setTutorialState('done')} />
  )

  const NAV_ITEMS = [
    { id:'home',   icon:'🏠', label:'HOME' },
    { id:'schemes',icon:'📋', label:'SCHEMES' },
    { id:'team',   icon:'🏆', label:'TEAM'    },
    { id:'scout',  icon:'🔍', label:'SCOUT' },
    { id:'playbook',icon:'📖',label:'PLAYBOOK' },
    { id:'more',   icon:'⋯',  label:'MORE' },
  ]

  return (
    <>
      <Head>
        <title>CoachIQ</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:'#07090d', color:'#f2f4f8', fontFamily:"'DM Sans', system-ui, sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Barlow+Condensed:wght@400;600;700&family=Big+Shoulders+Display:wght@500;900&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
          * { box-sizing:border-box; margin:0; padding:0; }
          ::-webkit-scrollbar { width:4px; }
          ::-webkit-scrollbar-thumb { background:#1e2330; border-radius:0; }
          select, select option { background:#161922 !important; color:#f2f4f8 !important; }
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
          /* Mobile responsive */
          input, select, textarea { font-size:16px; }
          @media (min-width:768px) {
            input, select, textarea { font-size:13px !important; }
            .scheme-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (min-width:768px) { input, select, textarea { font-size:13px !important; } }
          button { -webkit-tap-highlight-color:transparent; }
          * { -webkit-text-size-adjust:100%; }
        `}</style>

        {/* TOP BAR */}
        <div style={{ background:'#07090d', borderBottom:'1px solid #0e1220', padding:'10px 14px', display:'flex', alignItems:'center', gap:8, position:'relative', flexShrink:0 }}>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${P} 55%,${cfg.secondary||'#002868'} 55%)` }} />
          <CoachIQLogo size={22} brand={brand} />
          <div style={{ position:'relative', marginLeft:4 }}>
            <select value={sport} onChange={e=>setSport(e.target.value)} style={{ background:'#161922', border:`1px solid ${al(P,0.35)}`, borderRadius:3, padding:'4px 26px 4px 8px', color:'#f2f4f8', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:'0.5px', outline:'none', appearance:'none', cursor:'pointer' }}>
              {['Football','Basketball','Baseball','Soccer','Softball'].map(s=>(
                <option key={s} value={s}>{{ Football:'🏈', Basketball:'🏀', Baseball:'⚾', Soccer:'⚽', Softball:'🥎' }[s]} {s}</option>
              ))}
            </select>
            <span style={{ position:'absolute', right:7, top:'50%', transform:'translateY(-50%)', fontSize:9, color:P, pointerEvents:'none' }}>▾</span>
          </div>
          <div onClick={()=>setPage('home')} style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(107,154,255,0.08)', border:'1px solid rgba(107,154,255,0.2)', borderRadius:3, padding:'3px 9px', cursor:'pointer', userSelect:'none', marginLeft:4 }}>
            <span style={{ fontSize:11 }}>📰</span>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#6b9fff', fontWeight:700, letterSpacing:'0.5px' }}>Feed</span>
          </div>
          <TeamQuickSwitcher
            sport={sport}
            teams={teams}
            activeTeam={activeTeam}
            setActiveTeam={setActiveTeam}
            setCfg={setCfg}
            setPage={setPage}
            P={P}
            al={al}
            iq={iq}
          />
        </div>

        {/* PAGE CONTENT */}
        <div style={{ flex:1, maxWidth:'min(640px, 100%)', margin:'0 auto', width:'100%', padding:'14px 14px 90px', display:'flex', flexDirection:'column', gap:14 }}>
          {page==='home' && <HomePage P={P} S={S} al={al} dk={dk} lastName={lastName} sport={sport} iq={iq} setIQ={setIQ} gauntlets={gauntlets} setGauntlets={setGauntlets} callAI={callAI} parseJSON={parseJSON} brand={brand} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} setSport={setSport} setCfg={setCfg} homeLocation={homeLocation} setPage={setPage} />}
          {page==='schemes' && <SchemesPage P={P} S={S} al={al} dk={dk} sport={sport} callAI={callAI} parseJSON={parseJSON} playbook={playbook} setPlaybook={setPlaybook} genHistory={genHistory} setGenHistory={setGenHistory} iq={iq} setIQ={setIQ} />}
          {page==='scout' && <ScoutPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} />}
          {page==='team'     && <TeamPage P={P} S={S} al={al} sport={sport} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} callAI={callAI} parseJSON={parseJSON} setCfg={setCfg} />}
          {page==='playbook' && <PlaybookPage P={P} S={S} al={al} sport={sport} callAI={callAI} parseJSON={parseJSON} playbook={playbook} setPlaybook={setPlaybook} />}
          {page==='more' && <MorePage P={P} S={S} al={al} cfg={cfg} setCfg={setCfg} brand={brand} setBrand={setBrand} sport={sport} homeLocation={homeLocation} setHomeLocation={setHomeLocation} callAI={callAI} />}
        </div>

        {/* BOTTOM NAV */}
        <div style={{ position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)', width:'100%', maxWidth:'min(640px,100%)', background:'#07090d', borderTop:'1px solid #0e1220', display:'flex', zIndex:50 }}>
          {NAV_ITEMS.map(({ id, icon, label, submenu }) => (
            <NavButton key={id} id={id} icon={icon} label={label} submenu={submenu} isActive={page===id} P={P} al={al} setPage={setPage} />
          ))}
        </div>
      </div>
    </>
  )
}

// ─── TEAM MANAGER CARD ────────────────────────────────────────────────────────
function RosterSection({ team, P, al, teams, setTeams, sport }) {
  const [players, setPlayers] = useState(team.players || [])
  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')
  const [newPos, setNewPos] = useState('')
  const [newNum, setNewNum] = useState('')
  const [posOpen, setPosOpen] = useState(false)

  const positions = {
    Football:   ['QB','RB','FB','WR','TE','OL','LT','LG','C','RG','RT','DL','DE','DT','NT','LB','MLB','OLB','CB','S','FS','SS','K','P','LS'],
    Basketball: ['PG','SG','SF','PF','C','6th Man'],
    Baseball:   ['P','C','1B','2B','3B','SS','LF','CF','RF','DH','Utility'],
    Soccer:     ['GK','CB','LB','RB','LWB','RWB','CDM','CM','CAM','LM','RM','LW','RW','SS','ST','CF'],
    Softball:   ['P','C','1B','2B','3B','SS','LF','CF','RF','DP','FLEX','Utility'],
  }

  function addPlayer() {
    if (!newFirstName.trim() && !newLastName.trim()) return
    const p = { id: Date.now(), firstName: newFirstName.trim(), lastName: newLastName.trim(), name: [newFirstName.trim(), newLastName.trim()].filter(Boolean).join(' '), position: newPos, number: newNum }
    const updated = [...players, p]
    setPlayers(updated)
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t, players:updated} : t) }))
    setNewFirstName(''); setNewLastName(''); setNewPos(''); setNewNum('')
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
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:7, marginBottom:12, alignItems:'end' }}>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>First Name</label>
            <input value={newFirstName||''} onChange={e=>setNewFirstName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPlayer()} placeholder="First" style={{ width:'100%', background:'#161922', border:`1px solid ${newFirstName?P:'#1e2330'}`, borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
          </div>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Last Name</label>
            <input value={newLastName||''} onChange={e=>setNewLastName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addPlayer()} placeholder="Last" style={{ width:'100%', background:'#161922', border:`1px solid ${newLastName?P:'#1e2330'}`, borderRadius:4, padding:'8px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }} />
          </div>
          <div>
            <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Pos</label>
            <div onClick={()=>setPosOpen(o=>!o)} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'8px 10px', color:newPos?'#f2f4f8':'#3d4559', fontFamily:'inherit', fontSize:12, cursor:'pointer', position:'relative', userSelect:'none' }}>
              {newPos||'—'}
              {posOpen && (
                <div onClick={e=>e.stopPropagation()} style={{ position:'absolute', top:'100%', left:0, right:0, background:'#161922', border:'1px solid #1e2330', borderRadius:4, zIndex:50, maxHeight:200, overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.8)' }}>
                  {(positions[sport]||[]).map(pos => {
                    const sel = newPos.split(',').map(s=>s.trim()).filter(Boolean)
                    const isOn = sel.includes(pos)
                    return (
                      <div key={pos} onClick={()=>{ const cur=newPos.split(',').map(s=>s.trim()).filter(Boolean); if(isOn){ setNewPos(cur.filter(p=>p!==pos).join(', ')) } else if(cur.length<3){ setNewPos([...cur,pos].join(', ')) }}} style={{ padding:'7px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:8, background:isOn?al(P,0.12):'transparent', borderBottom:'1px solid #1a1f2e' }}>
                        <div style={{ width:13, height:13, borderRadius:3, border:`2px solid ${isOn?P:'#3d4559'}`, background:isOn?P:'transparent', flexShrink:0 }}/>
                        <span style={{ fontSize:12, color:isOn?P:'#f2f4f8' }}>{pos}</span>
                      </div>
                    )
                  })}
                  <div onClick={()=>setPosOpen(false)} style={{ padding:'7px 12px', cursor:'pointer', fontSize:11, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, textAlign:'center', borderTop:'1px solid #1e2330' }}>✓ DONE</div>
                </div>
              )}
            </div>
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
                <div style={{ flex:1 }}><div style={{ fontSize:13, color:'#f2f4f8', fontWeight:500 }}>{p.lastName ? p.lastName+', '+p.firstName : p.name}</div>{p.position&&<div style={{ fontSize:10, color:'#6b7a96' }}>{p.position}</div>}</div>
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
  function setPlanLinked(planId, evtId) {
    setPlans(prev => prev.map(p => p.id===planId ? {...p,_linkedTo:evtId} : p))
  }
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
            {!plan._linkedTo && (team.schedule||[]).filter(e=>e.type==='Practice').length > 0 && (
              <select onChange={e=>{ if(e.target.value) setPlanLinked(plan.id, parseInt(e.target.value)) }} style={{ fontSize:10, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:3, color:P, padding:'3px 6px', cursor:'pointer', colorScheme:'dark', maxWidth:130 }}>
                <option value="">Link to practice...</option>
                {(team.schedule||[]).filter(e=>e.type==='Practice').map(e=><option key={e.id} value={e.id}>{new Date(e.date+'T12:00:00').toLocaleDateString([],{month:'short',day:'numeric'})}{e.time?' '+e.time:''}</option>)}
              </select>
            )}
            {plan._linkedTo && <span style={{ fontSize:9, color:'#4ade80', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, whiteSpace:'nowrap' }}>✓ LINKED</span>}
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
      '<html><head><title>' + team.name + ' - ' + generated.type + '</title>',
      '<style>body{font-family:Arial,sans-serif;padding:24px;max-width:800px;margin:0 auto}pre{white-space:pre-wrap;font-size:13px;line-height:1.6}.header{border-bottom:3px solid ' + P + ';padding-bottom:12px;margin-bottom:16px}@media print{body{padding:12px}}</style></head><body>',
      '<div class="header"><h1>' + team.name + '</h1><h2>' + sport + ' - ' + (team.season||'') + ' - ' + (generated.type||'').toUpperCase() + '</h2></div>',
      '<pre>' + (generated.content||'') + '</pre>',
      '<div style="margin-top:20px;font-size:11px;color:#888">Generated by CoachIQ</div>',
      scriptTag,'</body></html>'
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
}


// ─── TEAM PAGE ─────────────────────────────────────────────────────────────────
function TeamPage({ P, S, al, sport, teams, setTeams, activeTeam, setActiveTeam, callAI, parseJSON, setCfg }) {
  const [section, setSection] = useState('roster')
  const currentTeam = activeTeam[sport]
  const mascotObj = currentTeam ? (MASCOTS||[]).find(m=>m.id===currentTeam.mascot) : null

  return (
    <>
      <div style={{ padding:'16px 0 8px' }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, color:'#3a4260', letterSpacing:'2px', textTransform:'uppercase', marginBottom:2 }}>Team management</div>
        <div style={{ fontFamily:"'Kalam',cursive", fontWeight:700, fontSize:26, color:'#dde1f0', lineHeight:1 }}>Team</div>
      </div>

      <TeamManagerCard sport={sport} teams={teams} setTeams={setTeams} activeTeam={activeTeam} setActiveTeam={setActiveTeam} P={P} al={al} setCfg={setCfg} onOpenTeamTab={()=>setPage('team')} />

      {!currentTeam ? (
        <div style={{ marginTop:20, padding:'40px 20px', textAlign:'center', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4 }}>
          <div style={{ fontSize:36, marginBottom:10 }}>🏆</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#6b7a96', letterSpacing:'1px', marginBottom:8 }}>No Team Selected</div>
          <div style={{ fontSize:12, color:'#3d4559', lineHeight:1.6 }}>Create or select a team above to access roster, schedule, practice plans, and more.</div>
        </div>
      ) : (
        <>
          {/* Slim team strip + tabs in one row */}
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10, marginBottom:12, overflowX:'auto', paddingBottom:2, borderBottom:`1px solid ${al(P,0.15)}`, paddingBottom:10 }}>
            <span style={{ fontSize:20, flexShrink:0 }}>{mascotObj?.emoji||'🏆'}</span>
            <div style={{ flexShrink:0, minWidth:0 }}>
              <div style={{ fontFamily:(TEAM_FONTS||[]).find(f=>f.id===currentTeam.teamFont)?.style||"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:'#f2f4f8', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:120 }}>{currentTeam.name}</div>
              <div style={{ fontSize:9, color:'#6b7a96', whiteSpace:'nowrap' }}>{currentTeam.season}</div>
            </div>
            <div style={{ width:1, height:28, background:'#1e2330', flexShrink:0 }} />
            <div style={{ display:'flex', gap:5, overflowX:'auto' }}>
              {[['roster','👥'],['schedule','📅'],['practice','📆'],['analytics','📊'],['print','🖨']].map(([s,ico])=>(
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
          {section==='practice' && <PracticePlanSection team={currentTeam} P={P} S={S} al={al} callAI={callAI} parseJSON={parseJSON} sport={sport} />}
          {section==='analytics'&& <AnalyticsSection team={currentTeam} P={P} al={al} />}
          {section==='print'    && <PrintSection     team={currentTeam} P={P} S={S} al={al} callAI={callAI} sport={sport} />}
        </>
      )}
    </>
  )
}


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
            <div style={{ fontSize:13, color:'#6b7a96', textAlign:'center', lineHeight:1.6, marginBottom:20 }}>This will permanently delete <span style={{ color:'#f2f4f8', fontWeight:600 }}>{deleteConfirm.name}</span>. This cannot be undone.</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setDeleteConfirm(null)} style={{ flex:1, padding:'11px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>CANCEL</button>
              <button onClick={doDelete} style={{ flex:1, padding:'11px', background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.5)', borderRadius:4, color:'#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, cursor:'pointer' }}>DELETE</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop:14 }}>
        <div onClick={()=>setExpanded(e=>!e)} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#0f1219', border:`1px solid ${current?al(P,0.3):'#1e2330'}`, borderRadius:expanded?'4px 4px 0 0':4, cursor:'pointer', borderLeft:`3px solid ${P}` }}>
          <MascotAvatar mascotId={current?.mascot} color={P} size={32} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:fontStyle, fontWeight:700, fontSize:current?15:13, color:'#f2f4f8', textTransform:'uppercase' }}>
              {current ? current.name : 'No '+sport+' Team Selected'}
            </div>
            {current && <div style={{ fontSize:10, color:'#6b7a96', marginTop:1 }}>{current.season}{current.hometown?' · '+current.hometown:''} · {sportTeams.length}/{MAX_TEAMS} teams</div>}
            {!current && <div style={{ fontSize:10, color:'#3d4559', marginTop:1 }}>Tap to create or select a team</div>}
          </div>
          {current && <div style={{ display:'flex', gap:3 }}>{[current.primary,current.secondary,current.accent1,current.accent2].filter(Boolean).map((c,i)=><div key={i} style={{ width:10,height:10,borderRadius:2,background:c }} />)}</div>}
          <span style={{ fontSize:12, color:'#6b7a96' }}>{expanded?'▲':'▼'}</span>
        </div>

        {expanded && (
          <div style={{ background:'#0d1017', border:`1px solid ${al(P,0.2)}`, borderTop:'none', borderRadius:'0 0 4px 4px', padding:14, animation:'fadeIn 0.2s ease' }}>
            {sportTeams.length > 0 && mode === 'view' && (
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:9, letterSpacing:2, color:'#6b7a96', textTransform:'uppercase', fontWeight:700, marginBottom:8 }}>Your {sport} Teams</div>
                {sportTeams.map(team => {
                  const m = (MASCOTS||[]).find(x=>x.id===team.mascot)
                  const fs = (TEAM_FONTS||[]).find(f=>f.id===team.teamFont)?.style||"'Barlow Condensed',sans-serif"
                  return (
                    <div key={team.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:current?.id===team.id?al(P,0.1):'#161922', border:`1px solid ${current?.id===team.id?al(P,0.4):'#1e2330'}`, borderRadius:6, marginBottom:6 }}>
                      <MascotAvatar mascotId={team.mascot} color={current?.id===team.id?P:'#607080'} size={32} />
                      <div style={{ flex:1, cursor:'pointer' }} onClick={()=>{ selectTeam(team); setTimeout(()=>{ if(onOpenTeamTab) onOpenTeamTab() }, 50) }}>
                        <div style={{ fontFamily:fs, fontWeight:700, fontSize:13, color:'#f2f4f8' }}>{team.name}</div>
                        <div style={{ fontSize:10, color:'#6b7a96' }}>{team.season}{team.hometown?' · '+team.hometown:''}</div>
                      </div>
                      {current?.id===team.id && <button onClick={deselectTeam} style={{ padding:'3px 7px', background:'rgba(107,154,255,0.1)', border:'1px solid rgba(107,154,255,0.3)', borderRadius:3, color:'#6b9fff', fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>DESELECT</button>}
                      {current?.id===team.id && onOpenTeamTab && <button onClick={onOpenTeamTab} style={{ padding:'3px 7px', background:al(P,0.12), border:`1px solid ${al(P,0.3)}`, borderRadius:3, color:P, fontSize:9, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>OPEN →</button>}
                      <button onClick={()=>setDeleteConfirm(team)} style={{ padding:'3px 7px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:3, color:'rgba(239,68,68,0.7)', fontSize:10, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>✕</button>
                    </div>
                  )
                })}
              </div>
            )}

            {mode === 'create' && (
              <div style={{ animation:'fadeIn 0.2s ease' }}>
                <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:12 }}>Create New Team</div>
                <div style={{ marginBottom:10 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Team Name *</label>
                  <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={'e.g. Tolland Youth '+sport} style={{ width:'100%', background:'#161922', border:`1px solid ${form.name?P:'#1e2330'}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                  <Sel label="Season" value={form.season||seasons[0]} onChange={v=>setForm(f=>({...f,season:v}))} options={seasons} />
                  <div>
                    <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Hometown</label>
                    <CitySearch value={form.hometown} onChange={v=>setForm(f=>({...f,hometown:v}))} placeholder="e.g. Tolland, CT" P={P} al={al} />
                  </div>
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:6, display:'block' }}>Team Mascot</label>
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
                        <div style={{ fontSize:10, color:'#6b7a96' }}>40 more mascots available with CoachIQ Pro.</div>
                      </div>
                      <button onClick={()=>setShowUpgrade(false)} style={{ background:'transparent', border:'none', color:'#3d4559', cursor:'pointer', fontSize:14 }}>✕</button>
                    </div>
                  )}
                  {form.mascot && <div style={{ fontSize:10, color:P, marginTop:4, display:'flex', alignItems:'center', gap:6 }}><MascotAvatar mascotId={form.mascot} color={P} size={20}/> {(MASCOTS||[]).find(m=>m.id===form.mascot)?.name}</div>}
                </div>
                <div style={{ marginBottom:12 }}>
                  <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:6, display:'block' }}>Team Name Font</label>
                  <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                    {(TEAM_FONTS||[]).map(tf=>(
                      <div key={tf.id} onClick={()=>setForm(f=>({...f,teamFont:tf.id}))} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 12px', background:form.teamFont===tf.id?al(P,0.1):'#161922', border:`1px solid ${form.teamFont===tf.id?P:'#1e2330'}`, borderRadius:5, cursor:'pointer' }}>
                        <span style={{ fontFamily:tf.style, fontSize:15, color:'#f2f4f8', flex:1 }}>{form.name||'Team Name'}</span>
                        <span style={{ fontSize:9, color:'#6b7a96' }}>{tf.preview}</span>
                        {form.teamFont===tf.id && <span style={{ fontSize:11, color:'#4ade80' }}>✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
                {[['primary','Primary'],['secondary','Secondary'],['accent1','Accent 1'],['accent2','Accent 2']].map(([key,label])=>(
                  <div key={key} style={{ marginBottom:10 }}>
                    <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:5, display:'block' }}>{label} Color</label>
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
                  <button onClick={()=>{setMode('view');setError('')}} style={{ flex:1, padding:'10px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
                  <button onClick={createTeam} style={{ flex:2, padding:'10px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer', letterSpacing:'1px' }}>CREATE TEAM</button>
                </div>
              </div>
            )}

            {mode === 'view' && sportTeams.length < MAX_TEAMS && (
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
        const res = await fetch('https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q='+encodeURIComponent(q)+'+city&countrycodes=us', { headers:{'Accept-Language':'en'} })
        const data = await res.json()
        setResults(data || [])
        setOpen((data||[]).length > 0)
      } catch(e) { setResults([]) }
      setLoading(false)
    }, 380)
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
        <input value={query} onChange={e=>search(e.target.value)} onFocus={()=>results.length>0&&setOpen(true)} placeholder={placeholder||'Search city or town...'} style={{ width:'100%', background:'#161922', border:`1px solid ${query?al(P,0.4):'#1e2330'}`, borderRadius:4, padding:'9px 32px 9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
        {loading ? <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:12, height:12, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.7s linear infinite' }}/> : <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:12, opacity:0.4 }}>🏙️</span>}
      </div>
      {open && results.length > 0 && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:'0 0 6px 6px', zIndex:100, maxHeight:180, overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.6)' }}>
          {results.map((item,i) => {
            const a = item.address||{}
            const city = a.city||a.town||a.village||item.name||''
            const state = a.state||''
            return (
              <div key={i} onMouseDown={()=>select(item)} style={{ padding:'8px 12px', borderBottom:i<results.length-1?'1px solid #1e2330':'none', cursor:'pointer' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
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
    return () => document.removeEventListener('mousedown', handle)
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
          style={{ width:'100%', background:'#161922', border:`1px solid ${query ? al(P,0.5) : '#1e2330'}`, borderRadius:4, padding:'9px 36px 9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }}
        />
        {loading ? (
          <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', width:14, height:14, borderRadius:'50%', border:`2px solid ${P}`, borderTopColor:'transparent', animation:'spin 0.7s linear infinite' }} />
        ) : (
          <span style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', fontSize:14, opacity:0.4 }}>📍</span>
        )}
      </div>
      {open && results.length > 0 && (
        <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:'0 0 6px 6px', zIndex:100, maxHeight:200, overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.6)' }}>
          {results.map((item, i) => {
            const addr = item.address || {}
            const city = addr.city || addr.town || addr.village || ''
            const state = addr.state || ''
            const mainText = item.name || item.display_name.split(',')[0]
            const subText = [city, state].filter(Boolean).join(', ')
            return (
              <div key={i} onMouseDown={()=>select(item)} style={{ padding:'9px 12px', borderBottom:i<results.length-1?'1px solid #1e2330':'none', cursor:'pointer', display:'flex', alignItems:'flex-start', gap:8 }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                <span style={{ fontSize:13, flexShrink:0, marginTop:1 }}>📍</span>
                <div>
                  <div style={{ fontSize:12, color:'#f2f4f8', lineHeight:1.3 }}>{mainText}</div>
                  {subText && <div style={{ fontSize:10, color:'#6b7a96', marginTop:1 }}>{subText}</div>}
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
    ]
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

function LineupBuilder({ team, sport, P, S, al, teams, setTeams }) {
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
            <button onClick={e=>{e.stopPropagation();deleteLineup(lineup.id)}} style={{ background:'transparent', border:'none', color:'#3d4559', cursor:'pointer', fontSize:12, padding:0 }}>✕</button>
          </div>
        ))}
        <button onClick={()=>setShowNewLineup(true)} style={{ flexShrink:0, padding:'6px 12px', borderRadius:6, border:`1px dashed ${al(P,0.4)}`, background:'transparent', color:P, fontSize:11, cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>+ New Lineup</button>
      </div>

      {/* New lineup form */}
      {showNewLineup && (
        <div style={{ padding:'10px 12px', background:'#161922', border:`1px solid ${al(P,0.3)}`, borderRadius:6, animation:'fadeIn 0.2s ease' }}>
          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
            <input value={newLineupName} onChange={e=>setNewLineupName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&createLineup()} placeholder="e.g. Base Offense, 2-Minute, Nickel D" style={{ flex:1, background:'#0f1219', border:`1px solid ${al(P,0.3)}`, borderRadius:4, padding:'7px 10px', color:'#f2f4f8', fontFamily:'inherit', fontSize:12, outline:'none' }}/>
            <button onClick={createLineup} style={{ padding:'7px 12px', background:P, border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer' }}>CREATE</button>
            <button onClick={()=>{setShowNewLineup(false);setIsGameDay(false)}} style={{ padding:'7px 10px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', cursor:'pointer', fontSize:12 }}>✕</button>
          </div>
          <div onClick={()=>setIsGameDay(g=>!g)} style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
            <div style={{ width:18, height:18, borderRadius:4, border:`2px solid ${isGameDay?P:'#3d4559'}`, background:isGameDay?P:'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
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
                <div onClick={()=>assignPlayer(selectedSlot, null)} style={{ padding:'6px 10px', background:'#0f1219', border:'1px solid #1e2330', borderRadius:4, cursor:'pointer', fontSize:11, color:'#6b7a96' }}>— Remove assignment</div>
                {players.map(p => (
                  <div key={p.id} onClick={()=>assignPlayer(selectedSlot, p.id)} style={{ padding:'6px 10px', background:currentLineup.slots[selectedSlot]===p.id?al(P,0.12):'#0f1219', border:`1px solid ${currentLineup.slots[selectedSlot]===p.id?P:'#1e2330'}`, borderRadius:4, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:11, color:'#f2f4f8', fontWeight:500 }}>{p.lastName||''}{p.lastName&&p.firstName?', ':''}{p.firstName||''}</span>
                    {p.position && <span style={{ fontSize:9, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{p.position}</span>}
                    {p.number && <span style={{ fontSize:9, color:'#6b7a96', marginLeft:'auto' }}>#{p.number}</span>}
                  </div>
                ))}
                {players.length === 0 && <div style={{ fontSize:11, color:'#3d4559', padding:'6px' }}>No players in roster yet. Add players in the Roster tab.</div>}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign:'center', padding:'24px 0', color:'#3d4559', fontSize:12 }}>Create a lineup above to start assigning players to positions.</div>
      )}
    </div>
  )
}


// ─── SCHEDULE SECTION ─────────────────────────────────────────────────────────
function ScheduleSection({ team, P, al, teams, setTeams, sport }) {
  const [showAdd, setShowAdd] = useState(false)
  const [savedOpponents, setSavedOpponents] = useState([])
  const [form, setForm] = useState({ type:'Game', opponent:'', date:'', time:'', arrivalTime:'', location:'', homeAway:'Home', notes:'' })

  const schedule = team.schedule || []

  function updateTeam(updates) {
    setTeams(prev => ({ ...prev, [sport]: (prev[sport]||[]).map(t => t.id===team.id ? {...t,...updates} : t) }))
  }

  function saveEvent() {
    if (!form.date) return
    const event = { id:Date.now(), ...form }
    const updated = [...schedule, event].sort((a,b) => new Date(a.date) - new Date(b.date))
    updateTeam({ schedule: updated })
    if (form.opponent && !savedOpponents.includes(form.opponent)) {
      setSavedOpponents(prev => [...prev, form.opponent])
    }
    setForm({ type:'Game', opponent:'', date:'', time:'', arrivalTime:'', location:'', homeAway:'Home', notes:'' })
    setShowAdd(false)
  }

  function removeEvent(id) {
    updateTeam({ schedule: schedule.filter(e => e.id !== id) })
  }

  const typeColors = { Game:P, Practice:'#4ade80', Scrimmage:'#f59e0b', Tournament:'#c084fc' }
  const typeIcons  = { Game:'🏆', Practice:'📋', Scrimmage:'⚡', Tournament:'🥇' }
  const now = new Date()
  const upcoming = schedule.filter(e => new Date(e.date+'T23:59:59') >= now)
  const past     = schedule.filter(e => new Date(e.date+'T23:59:59') < now)

  return (
    <Card>
      <CardHead icon="📅" title="Schedule" tag={upcoming.length + ' upcoming'} tagColor={P} accent={P} />
      <div style={{ padding:14 }}>
        {!showAdd ? (
          <button onClick={()=>setShowAdd(true)} style={{ width:'100%', padding:'10px', background:al(P,0.08), border:`1px dashed ${al(P,0.4)}`, borderRadius:4, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:'1px', marginBottom: upcoming.length ? 12 : 0 }}>+ ADD EVENT</button>
        ) : (
          <div style={{ animation:'fadeIn 0.2s ease', marginBottom:12 }}>
            <div style={{ fontSize:9, letterSpacing:2, color:P, textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Add Event</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:8 }}>
              <Sel label="Type" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={['Game','Practice','Scrimmage','Tournament']} />
              <Sel label="Home / Away" value={form.homeAway} onChange={v=>setForm(f=>({...f,homeAway:v}))} options={['Home','Away','Neutral']} />
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Opponent / Event Name</label>
                <input value={form.opponent} onChange={e=>setForm(f=>({...f,opponent:e.target.value}))} placeholder={form.type==='Practice' ? 'Practice session' : 'e.g. Westport Eagles'} list="saved-opps-list" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
                <datalist id="saved-opps-list">{savedOpponents.map(o=><option key={o} value={o}/>)}</datalist>
              </div>
              <div>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Date *</label>
                <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ width:'100%', background:'#161922', border:`1px solid ${form.date?P:'#1e2330'}`, borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Start Time</label>
                <input type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Arrive By</label>
                <input type="time" value={form.arrivalTime} onChange={e=>setForm(f=>({...f,arrivalTime:e.target.value}))} style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
              </div>
              <div>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Location / Address</label>
                <AddressSearch
                  value={form.location}
                  onChange={v=>setForm(f=>({...f,location:v}))}
                  placeholder={form.homeAway==='Home' ? (team.hometown||'Search home field address...') : 'Search away venue address...'}
                  P={P}
                  al={al}
                />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:9, letterSpacing:'1.5px', textTransform:'uppercase', color:'#6b7a96', fontWeight:700, marginBottom:4, display:'block' }}>Notes</label>
                <input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="e.g. Wear red jerseys, bring extra water" style={{ width:'100%', background:'#161922', border:'1px solid #1e2330', borderRadius:4, padding:'9px 12px', color:'#f2f4f8', fontFamily:'inherit', fontSize:13, outline:'none' }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setShowAdd(false)} style={{ flex:1, padding:'9px', background:'transparent', border:'1px solid #1e2330', borderRadius:4, color:'#6b7a96', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:'pointer' }}>CANCEL</button>
              <button onClick={saveEvent} disabled={!form.date} style={{ flex:2, padding:'9px', background:form.date?P:'#3d4559', border:'none', borderRadius:4, color:'white', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, cursor:form.date?'pointer':'not-allowed', letterSpacing:'1px' }}>SAVE EVENT</button>
            </div>
          </div>
        )}

        {upcoming.length === 0 && !showAdd && (
          <div style={{ textAlign:'center', padding:'18px 0', color:'#3d4559', fontSize:12 }}>No upcoming events — tap above to add your schedule</div>
        )}

        {upcoming.map(event => {
          const tc = typeColors[event.type] || P
          const d = new Date(event.date + 'T12:00:00')
          return (
            <div key={event.id} style={{ padding:'10px 12px', background:'#161922', border:`1px solid ${al(tc,0.25)}`, borderRadius:6, marginBottom:8, borderLeft:`3px solid ${tc}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{typeIcons[event.type]||'📅'}</span>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:2 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:'#f2f4f8' }}>{event.opponent || event.type}</div>
                    <span style={{ fontSize:8, fontWeight:700, padding:'1px 5px', borderRadius:2, background:al(tc,0.15), color:tc, fontFamily:"'Barlow Condensed',sans-serif" }}>{event.type} · {event.homeAway}</span>
                  </div>
                  <div style={{ fontSize:11, color:'#6b7a96' }}>
                    {d.toLocaleDateString([],{weekday:'short',month:'short',day:'numeric'})}
                    {event.time && ' · ' + event.time}
                    {event.arrivalTime && ' · Arrive ' + event.arrivalTime}
                  </div>
                  {event.location && <div style={{ fontSize:10, color:'#3d4559', marginTop:1 }}>📍 {event.location}</div>}
                  {event.notes && <div style={{ fontSize:10, color:'#3d4559', marginTop:1, fontStyle:'italic' }}>{event.notes}</div>}
                </div>
                <button onClick={()=>removeEvent(event.id)} style={{ background:'transparent', border:'none', color:'#3d4559', cursor:'pointer', fontSize:16, flexShrink:0, padding:0 }}>×</button>
              </div>
            </div>
          )
        })}

        {past.length > 0 && (
          <details style={{ marginTop:8 }}>
            <summary style={{ fontSize:10, color:'#3d4559', cursor:'pointer', fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:1 }}>PAST EVENTS ({past.length})</summary>
            <div style={{ marginTop:6, opacity:0.5 }}>
              {past.map(event => (
                <div key={event.id} style={{ padding:'7px 10px', background:'#161922', border:'1px solid #1e2330', borderRadius:5, marginBottom:5, fontSize:11, color:'#6b7a96', display:'flex', alignItems:'center', gap:8 }}>
                  <span>{typeIcons[event.type]||'📅'}</span>
                  <span>{event.opponent || event.type}</span>
                  <span style={{ marginLeft:'auto' }}>{new Date(event.date+'T12:00:00').toLocaleDateString([],{month:'short',day:'numeric'})}</span>
                  <button onClick={()=>removeEvent(event.id)} style={{ background:'transparent', border:'none', color:'#3d4559', cursor:'pointer', fontSize:14, padding:0 }}>×</button>
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
function RotatingInfoWidget({ sport, homeLocation, awayLocation, nextEvent, P, al }) {
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

  const likelihood = homeWeather ? getGameLikelihood(sport, homeWeather.code, homeWeather.wind) : null

  const slots = [
    homeWeather ? (
      <div key="hw" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
        <div style={{ fontSize:18 }}>{weatherEmoji(homeWeather.code)}</div>
        <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:16, color:'#f2f4f8', lineHeight:1 }}>{homeWeather.temp}°</div>
        <div style={{ fontSize:7, color:'#6b7a96', textAlign:'center', lineHeight:1.2, maxWidth:60 }}>{homeWeather.city}</div>
        {likelihood !== null && (
          <div style={{ fontSize:8, color: likelihood > 70 ? '#4ade80' : likelihood > 40 ? '#f59e0b' : '#ef4444', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginTop:1 }}>{likelihood}% on</div>
        )}
      </div>
    ) : null,

    awayWeather && awayLocation && awayLocation !== homeLocation ? (
      <div key="aw" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
        <div style={{ fontSize:18 }}>{weatherEmoji(awayWeather.code)}</div>
        <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:16, color:'#f2f4f8', lineHeight:1 }}>{awayWeather.temp}°</div>
        <div style={{ fontSize:7, color:'#6b7a96', textAlign:'center', lineHeight:1.2, maxWidth:60 }}>{awayWeather.city}</div>
        <div style={{ fontSize:7, color:'#6b9fff', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>Away</div>
      </div>
    ) : null,

    <div key="evt" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
      <div style={{ fontSize:14 }}>{nextEvent && nextEvent.type === 'Practice' ? '📋' : '🏆'}</div>
      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:13, color:P, lineHeight:1, textAlign:'center' }}>{getCountdown() || '—'}</div>
      <div style={{ fontSize:7, color:'#6b7a96', textAlign:'center', lineHeight:1.3, maxWidth:64 }}>{nextEvent ? (nextEvent.opponent || nextEvent.type) : 'No events'}</div>
    </div>,

    <div key="dt" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
      <div style={{ fontSize:14 }}>📅</div>
      <div style={{ fontFamily:"'Big Shoulders Display',sans-serif", fontWeight:900, fontSize:13, color:'#f2f4f8', lineHeight:1 }}>{now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
      <div style={{ fontSize:7, color:'#6b7a96', textAlign:'center' }}>{now.toLocaleDateString([],{month:'short',day:'numeric'})}</div>
    </div>,

    <div key="tip" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
      <div style={{ fontSize:14 }}>💡</div>
      <div style={{ fontSize:8, color:P, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:'0.5px' }}>Coach Tip</div>
      <div style={{ fontSize:8, color:'#dde1f0', textAlign:'center', lineHeight:1.4, maxWidth:72 }}>{currentTip}</div>
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