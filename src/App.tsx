import { useState, useEffect, useRef, useMemo } from 'react'

// ── Personalize here ───────────────────────────────────────────────────────
const HER_NAME = 'Leounda'
const YOUR_NAME = 'WDC'
const COUNTDOWN_DATE = new Date('2026-08-15T19:00:00')
const SURPRISE_MESSAGE =
  "Every single moment with you is my favorite memory. I love you to the moon and back — and then some. Thank you for existing. 🌙"

// ── Types ──────────────────────────────────────────────────────────────────
type ParticleData = {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  kind: 'petal' | 'star'
  rotation: number
}

type Movie = {
  title: string
  year: number
  director: string
  quote: string
  character: string
  accentColor: string
  labelColor: string
}

// ── Hooks ──────────────────────────────────────────────────────────────────
function useCountdown(target: Date) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return setT({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      setT({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

// ── SVG Atoms ──────────────────────────────────────────────────────────────
function StarShape({ size, opacity = 0.8, color = '#D4A843' }: { size: number; opacity?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <polygon
        points="12,2 14.4,9.6 22,9.6 15.8,14.4 18.2,22 12,17.2 5.8,22 8.2,14.4 2,9.6 9.6,9.6"
        fill={color}
        opacity={opacity}
      />
    </svg>
  )
}

function Petal({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 20 30" style={{ display: 'block' }}>
      <ellipse cx="10" cy="15" rx="7" ry="13" fill={color} opacity="0.8" />
    </svg>
  )
}

function Moon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      {/* Outer glow */}
      <circle cx="40" cy="40" r="38" fill="rgba(255,243,205,0.18)" />
      {/* Moon body */}
      <circle cx="40" cy="40" r="32" fill="#FFF3CD" opacity="0.92" />
      {/* Shadow crescent */}
      <circle cx="52" cy="30" r="27" fill="#FDF6EE" />
      {/* Subtle craters */}
      <circle cx="25" cy="48" r="3" fill="rgba(212,168,67,0.15)" />
      <circle cx="32" cy="36" r="1.8" fill="rgba(212,168,67,0.12)" />
      <circle cx="20" cy="38" r="2.2" fill="rgba(212,168,67,0.1)" />
    </svg>
  )
}

// ── Floral Wreath (for "18") ───────────────────────────────────────────────
function FloralWreath() {
  const count = 14
  const r = 80
  const petals = Array.from({ length: count }, (_, i) => {
    const angle = (i * 360) / count
    const rad = (angle * Math.PI) / 180
    const x = 100 + r * Math.cos(rad)
    const y = 100 + r * Math.sin(rad)
    return { x, y, angle }
  })
  return (
    <svg
      viewBox="0 0 200 200"
      width="230"
      height="230"
      style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 }}
    >
      {petals.map((p, i) => (
        <g key={i} transform={`translate(${p.x},${p.y}) rotate(${p.angle + 90})`}>
          {/* Large petal */}
          <ellipse cx="0" cy="0" rx="7" ry="12" fill={i % 3 === 0 ? '#E8829A' : '#F9D5DF'} opacity="0.7" />
          {/* Small inner dot */}
          <circle cx="0" cy="0" r="2" fill="#D4A843" opacity="0.6" />
        </g>
      ))}
      {/* Connecting circle */}
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="rgba(212,168,67,0.25)"
        strokeWidth="1"
        strokeDasharray="4 6"
      />
      {/* Small stars at cardinal points */}
      {[0, 90, 180, 270].map((a, i) => {
        const rad = (a * Math.PI) / 180
        const sx = 100 + (r + 16) * Math.cos(rad)
        const sy = 100 + (r + 16) * Math.sin(rad)
        return (
          <polygon
            key={i}
            points="0,-5 1.5,-1.5 5,-1.5 2.5,1 3.5,5 0,2.5 -3.5,5 -2.5,1 -5,-1.5 -1.5,-1.5"
            transform={`translate(${sx},${sy})`}
            fill="#D4A843"
            opacity="0.6"
          />
        )
      })}
    </svg>
  )
}

// ── Falling Petals ─────────────────────────────────────────────────────────
const FALL_PETAL_COLORS = ['#F2A7B7', '#F9D5DF', '#C4B5D0', '#EDD5E0', '#FBBFD4', '#F0C4D0']

function FallingPetals() {
  const petals = useMemo(() => {
    const positions = [5, 12, 21, 28, 37, 44, 53, 60, 69, 76, 85, 92]
    return positions.map((left, i) => ({
      id: i,
      left,
      size: 8 + (i % 4) * 3,
      duration: 8 + (i % 5) * 2,
      delay: i * 1.1,
      color: FALL_PETAL_COLORS[i % FALL_PETAL_COLORS.length],
    }))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: 0,
            animation: `petalFall ${p.duration}s ease-in infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <Petal size={p.size} color={p.color} />
        </div>
      ))}
    </div>
  )
}

// ── Floating Stars (hero) ──────────────────────────────────────────────────
function FloatingParticles() {
  const particles = useMemo<ParticleData[]>(() => {
    const seeds = [13, 27, 41, 8, 55, 19, 62, 33, 7, 48, 22, 37, 14, 59, 31, 46, 5, 28, 53, 17]
    return seeds.map((s, i) => ({
      id: i,
      x: (s * 17 + i * 11) % 100,
      y: (s * 13 + i * 7) % 100,
      size: (s % 9) + 8,
      duration: (s % 6) + 7,
      delay: (i * 0.31) % 5,
      kind: i % 3 === 0 ? 'star' : 'petal',
      rotation: (s * 7) % 360,
    }))
  }, [])

  const petalColors = ['#F2A7B7', '#F9D5DF', '#EDD5E0', '#C4B5D0', '#FBBFD4']

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `floatParticle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        >
          {p.kind === 'star' ? (
            <StarShape size={p.size} opacity={0.55} />
          ) : (
            <Petal size={p.size} color={petalColors[p.id % petalColors.length]} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Constellation ─────────────────────────────────────────────────────────
function Constellation() {
  // Fixed star positions (x%, y% of hero)
  const stars = [
    { x: 8, y: 14, s: 4 }, { x: 14, y: 8, s: 3 }, { x: 22, y: 18, s: 2.5 },
    { x: 88, y: 20, s: 3.5 }, { x: 82, y: 12, s: 2.5 }, { x: 75, y: 25, s: 3 },
    { x: 10, y: 72, s: 3 }, { x: 18, y: 80, s: 2 }, { x: 90, y: 75, s: 3.5 },
    { x: 85, y: 83, s: 2.5 }, { x: 50, y: 6, s: 3 }, { x: 56, y: 3, s: 2 },
  ]
  const lines: [number, number][] = [
    [0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [8, 9], [10, 11],
  ]

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {lines.map(([a, b], i) => (
        <line
          key={i}
          x1={`${stars[a].x}%`} y1={`${stars[a].y}%`}
          x2={`${stars[b].x}%`} y2={`${stars[b].y}%`}
          stroke="rgba(212,168,67,0.2)"
          strokeWidth="0.8"
        />
      ))}
      {stars.map((st, i) => (
        <circle
          key={i}
          cx={`${st.x}%`}
          cy={`${st.y}%`}
          r={st.s}
          fill="#D4A843"
          opacity="0.5"
          style={{
            animation: `twinkle ${2.5 + (i % 4) * 0.6}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </svg>
  )
}

// ── Floral Divider ─────────────────────────────────────────────────────────
function FloralDivider({ light = false }: { light?: boolean }) {
  const lineColor = light ? 'rgba(249,213,223,0.4)' : 'rgba(196,181,208,0.4)'
  const petalFill = light ? '#F9D5DF' : '#F2A7B7'
  const centerFill = light ? '#EDD5E0' : '#E8829A'
  return (
    <div className="flex items-center justify-center gap-3 my-3">
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${lineColor})` }} />
      <svg width="64" height="32" viewBox="0 0 64 32">
        <circle cx="32" cy="16" r="4" fill={centerFill} opacity="0.9" />
        <ellipse cx="19" cy="10" rx="7.5" ry="4" fill={petalFill} opacity="0.8" transform="rotate(-30 19 10)" />
        <ellipse cx="45" cy="10" rx="7.5" ry="4" fill={petalFill} opacity="0.8" transform="rotate(30 45 10)" />
        <ellipse cx="19" cy="22" rx="7.5" ry="4" fill={petalFill} opacity="0.8" transform="rotate(30 19 22)" />
        <ellipse cx="45" cy="22" rx="7.5" ry="4" fill={petalFill} opacity="0.8" transform="rotate(-30 45 22)" />
        <ellipse cx="32" cy="5" rx="5" ry="3" fill={petalFill} opacity="0.6" />
        <ellipse cx="32" cy="27" rx="5" ry="3" fill={petalFill} opacity="0.6" />
        <ellipse cx="5" cy="16" rx="5" ry="3" fill={petalFill} opacity="0.6" transform="rotate(90 5 16)" />
        <ellipse cx="59" cy="16" rx="5" ry="3" fill={petalFill} opacity="0.6" transform="rotate(90 59 16)" />
      </svg>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${lineColor})` }} />
    </div>
  )
}

// ── Film Strip ─────────────────────────────────────────────────────────────
function FilmStrip() {
  return (
    <div className="flex gap-1 opacity-40" style={{ minWidth: 'max-content' }}>
      {Array.from({ length: 28 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <div className="w-4 h-3 rounded-sm" style={{ background: '#8B6040' }} />
          <div className="w-4 h-8" style={{ background: '#6B4A30' }} />
          <div className="w-4 h-3 rounded-sm" style={{ background: '#8B6040' }} />
        </div>
      ))}
    </div>
  )
}

// ── Polaroid ───────────────────────────────────────────────────────────────
function Polaroid({ src, caption, rotation, alt }: {
  src: string; caption: string; rotation: number; alt: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="relative inline-block cursor-pointer select-none"
      style={{
        transform: hovered ? 'rotate(0deg) scale(1.06)' : `rotate(${rotation}deg) scale(1)`,
        transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
        zIndex: hovered ? 10 : 1,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="p-3 pb-10"
        style={{
          background: '#FFFCF8',
          boxShadow: hovered
            ? '4px 8px 28px rgba(74,49,40,0.24)'
            : '2px 4px 14px rgba(74,49,40,0.14)',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <div className="w-44 h-44 overflow-hidden" style={{ background: '#F9D5DF' }}>
          <img src={src} alt={alt} className="w-full h-full object-cover" />
        </div>
        <p
          className="absolute bottom-2 left-0 right-0 text-center"
          style={{ fontFamily: "'Great Vibes', cursive", color: '#7A5246', fontSize: '15px' }}
        >
          {caption}
        </p>
      </div>
    </div>
  )
}

// ── Cassette Tape ──────────────────────────────────────────────────────────
function CassetteTape() {
  return (
    <svg
      viewBox="0 0 300 170"
      width="300"
      height="170"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(58,36,24,0.3))' }}
    >
      <rect x="4" y="8" width="292" height="154" rx="14" fill="#2E1E16" />
      <rect x="14" y="18" width="272" height="134" rx="10" fill="#3D2414" />
      <rect x="60" y="26" width="180" height="90" rx="8" fill="#FDF6EE" />
      <rect x="64" y="30" width="172" height="82" rx="6" fill="#FFFAF4" />
      <text x="150" y="60" textAnchor="middle" fontFamily="Georgia, serif" fontSize="13" fill="#8B4A55" fontStyle="italic">
        Our Soundtrack
      </text>
      <line x1="72" y1="70" x2="228" y2="70" stroke="#F2A7B7" strokeWidth="0.8" />
      <text x="150" y="84" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#C4B5D0" fontStyle="italic">
        — forever playing —
      </text>
      <line x1="72" y1="94" x2="228" y2="94" stroke="#F2A7B7" strokeWidth="0.5" />
      <text x="150" y="106" textAnchor="middle" fontFamily="Georgia, serif" fontSize="8" fill="#D4A843">
        ♥ SIDE A ♥
      </text>
      <circle cx="88" cy="130" r="24" fill="#1E1008" />
      <circle cx="88" cy="130" r="17" fill="#2E1E16" />
      <circle cx="88" cy="130" r="7" fill="#C4956A" />
      <line x1="88" y1="113" x2="88" y2="147" stroke="#3D2414" strokeWidth="2" />
      <line x1="73" y1="121" x2="103" y2="139" stroke="#3D2414" strokeWidth="2" />
      <line x1="73" y1="139" x2="103" y2="121" stroke="#3D2414" strokeWidth="2" />
      <circle cx="212" cy="130" r="24" fill="#1E1008" />
      <circle cx="212" cy="130" r="17" fill="#2E1E16" />
      <circle cx="212" cy="130" r="7" fill="#C4956A" />
      <line x1="212" y1="113" x2="212" y2="147" stroke="#3D2414" strokeWidth="2" />
      <line x1="197" y1="121" x2="227" y2="139" stroke="#3D2414" strokeWidth="2" />
      <line x1="197" y1="139" x2="227" y2="121" stroke="#3D2414" strokeWidth="2" />
      <rect x="116" y="115" width="68" height="32" rx="4" fill="#1E1008" />
      <path d="M 124 131 Q 150 124 176 131" stroke="#6B4A30" strokeWidth="2.5" fill="none" />
      <circle cx="28" cy="32" r="5" fill="#1E1008" />
      <circle cx="272" cy="32" r="5" fill="#1E1008" />
      <circle cx="28" cy="152" r="5" fill="#1E1008" />
      <circle cx="272" cy="152" r="5" fill="#1E1008" />
    </svg>
  )
}

// ── Movie Ticket Card ──────────────────────────────────────────────────────
function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  const [hovered, setHovered] = useState(false)
  const isEven = index % 2 === 0

  return (
    <div
      className="relative flex overflow-hidden"
      style={{
        borderRadius: '16px',
        background: hovered ? 'rgba(255,252,248,0.07)' : 'rgba(255,252,248,0.04)',
        border: '1px solid rgba(255,252,248,0.1)',
        transform: hovered ? (isEven ? 'translateX(6px)' : 'translateX(-6px)') : 'translateX(0)',
        transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: hovered ? '0 8px 40px rgba(0,0,0,0.3)' : '0 2px 12px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Accent stripe */}
      <div
        style={{
          width: '5px',
          flexShrink: 0,
          background: `linear-gradient(180deg, ${movie.accentColor}, ${movie.accentColor}88)`,
        }}
      />

      {/* Main content */}
      <div className="flex-1 px-6 py-5 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <h3
              className="font-bold leading-tight"
              style={{ color: '#FDF6EE', fontSize: 'clamp(1rem, 3vw, 1.25rem)', fontFamily: "'Nunito', sans-serif" }}
            >
              {movie.title}
            </h3>
            <p
              className="mt-0.5 uppercase tracking-widest"
              style={{ color: movie.accentColor, fontSize: '0.65rem', opacity: 0.85, letterSpacing: '0.2em' }}
            >
              {movie.year} · dir. {movie.director}
            </p>
          </div>
          {/* Film reel icon */}
          <svg width="28" height="28" viewBox="0 0 28 28" style={{ flexShrink: 0, opacity: 0.35 }}>
            <circle cx="14" cy="14" r="12" fill="none" stroke="#FDF6EE" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="5" fill="none" stroke="#FDF6EE" strokeWidth="1.5" />
            <circle cx="14" cy="7" r="2.2" fill="#FDF6EE" />
            <circle cx="14" cy="21" r="2.2" fill="#FDF6EE" />
            <circle cx="7" cy="14" r="2.2" fill="#FDF6EE" />
            <circle cx="21" cy="14" r="2.2" fill="#FDF6EE" />
          </svg>
        </div>

        {/* Perforated separator */}
        <div
          className="my-3"
          style={{
            borderTop: '1px dashed rgba(255,252,248,0.15)',
          }}
        />

        {/* Quote */}
        <blockquote
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)',
            color: '#F9D5DF',
            lineHeight: 1.45,
            fontStyle: 'normal',
          }}
        >
          "{movie.quote}"
        </blockquote>

        {/* Citation */}
        <p
          className="mt-2"
          style={{
            color: movie.accentColor,
            fontSize: '0.72rem',
            opacity: 0.8,
            letterSpacing: '0.08em',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          — {movie.character}, <em>{movie.title}</em> ({movie.year})
        </p>
      </div>

      {/* Right stub */}
      <div
        className="flex flex-col items-center justify-center px-3 py-4"
        style={{
          borderLeft: '1px dashed rgba(255,252,248,0.12)',
          flexShrink: 0,
          width: '44px',
        }}
      >
        <p
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '0.55rem',
            letterSpacing: '0.18em',
            color: 'rgba(253,246,238,0.3)',
            textTransform: 'uppercase',
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          ADMIT ONE
        </p>
        <div className="mt-3 w-5 h-5 rounded-full" style={{ background: movie.accentColor, opacity: 0.4 }} />
      </div>
    </div>
  )
}

// ── Teddy Bear ─────────────────────────────────────────────────────────────
function TeddyBear({ happy }: { happy: boolean }) {
  return (
    <svg viewBox="0 0 130 155" width="170" height="202" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" fill="#C4956A" />
      <circle cx="32" cy="32" r="12" fill="#D4A87A" />
      <circle cx="98" cy="32" r="20" fill="#C4956A" />
      <circle cx="98" cy="32" r="12" fill="#D4A87A" />
      <ellipse cx="65" cy="60" rx="42" ry="40" fill="#C4956A" />
      <ellipse cx="65" cy="68" rx="26" ry="20" fill="#D4A87A" />
      <circle cx="50" cy="54" r="6" fill="#2A1A10" />
      <circle cx="80" cy="54" r="6" fill="#2A1A10" />
      <circle cx="52" cy="52" r="2" fill="white" />
      <circle cx="82" cy="52" r="2" fill="white" />
      <ellipse cx="65" cy="68" rx="7" ry="5" fill="#7A3E1A" />
      {happy ? (
        <path d="M52 77 Q65 90 78 77" stroke="#7A3E1A" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M55 78 Q65 84 75 78" stroke="#7A3E1A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      <circle cx="40" cy="72" r="9" fill="#F2A7B7" opacity="0.45" />
      <circle cx="90" cy="72" r="9" fill="#F2A7B7" opacity="0.45" />
      <ellipse cx="65" cy="118" rx="34" ry="30" fill="#C4956A" />
      <ellipse cx="65" cy="120" rx="20" ry="18" fill="#D4A87A" />
      <ellipse cx="24" cy="110" rx="15" ry="10" fill="#C4956A" transform="rotate(-25 24 110)" />
      <ellipse cx="106" cy="110" rx="15" ry="10" fill="#C4956A" transform="rotate(25 106 110)" />
      <ellipse cx="48" cy="144" rx="14" ry="11" fill="#C4956A" />
      <ellipse cx="82" cy="144" rx="14" ry="11" fill="#C4956A" />
      {happy && (
        <>
          <path d="M50 97 L58 104 L65 97 L72 104 L80 97" fill="#F2A7B7" />
          <circle cx="65" cy="97" r="5" fill="#E8829A" />
          <text x="57" y="126" fontSize="16" fill="#E8829A" opacity="0.9">♥</text>
        </>
      )}
    </svg>
  )
}

// ── Countdown Unit ─────────────────────────────────────────────────────────
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold"
        style={{
          background: 'rgba(242,167,183,0.15)',
          border: '1px solid rgba(242,167,183,0.35)',
          color: '#F9D5DF',
          fontFamily: "'Nunito', sans-serif",
          letterSpacing: '-0.02em',
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs tracking-widest uppercase" style={{ color: '#C4B5D0' }}>
        {label}
      </span>
    </div>
  )
}

// ── Song Row ───────────────────────────────────────────────────────────────
function SongRow({ index, title, artist, note }: {
  index: number; title: string; artist: string; note: string
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{
        background: hovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
        border: '1px solid rgba(196,181,208,0.3)',
        backdropFilter: 'blur(10px)',
        transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
        style={{ background: 'linear-gradient(135deg, #F2A7B7, #C4B5D0)', color: 'white' }}
      >
        {index}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate" style={{ color: '#4A3128', fontSize: '0.95rem' }}>{title}</p>
        <p className="text-sm truncate" style={{ color: '#8B6E6A', opacity: 0.75 }}>{artist}</p>
      </div>
      <p
        className="text-sm italic hidden sm:block flex-shrink-0"
        style={{ fontFamily: "'Great Vibes', cursive", color: '#C4B5D0', fontSize: '1rem' }}
      >
        {note}
      </p>
      <span style={{ color: '#F2A7B7', fontSize: '1.1rem', flexShrink: 0 }}>♥</span>
    </div>
  )
}

// ── Confetti ───────────────────────────────────────────────────────────────
const CONFETTI_GLYPHS = ['🌸', '⭐', '💕', '✨', '🌹', '💖', '🌷', '🎀']

function Confetti({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 36 }).map((_, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${(i * 37 + 5) % 100}%`,
            top: '-5%',
            fontSize: `${1.2 + (i % 3) * 0.4}rem`,
            animation: `confettiFall ${1.4 + (i % 4) * 0.4}s ease-in forwards`,
            animationDelay: `${(i * 0.08) % 1.2}s`,
          }}
        >
          {CONFETTI_GLYPHS[i % CONFETTI_GLYPHS.length]}
        </span>
      ))}
    </div>
  )
}

// ── Section Heading ────────────────────────────────────────────────────────
function SectionHeading({ eyebrow, title, light = false }: {
  eyebrow: string; title: string; light?: boolean
}) {
  return (
    <div className="text-center mb-10 md:mb-12">
      <p
        className="uppercase tracking-widest mb-2"
        style={{ fontSize: '0.68rem', letterSpacing: '0.3em', color: light ? '#C4B5D0' : '#9B7A76' }}
      >
        {eyebrow}
      </p>
      <h2 style={{
        fontFamily: "'Great Vibes', cursive",
        fontSize: 'clamp(2.4rem, 8vw, 3.5rem)',
        color: light ? '#F9D5DF' : '#8B4A55',
        lineHeight: 1.1,
      }}>
        {title}
      </h2>
      <FloralDivider light={light} />
    </div>
  )
}

// ── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [surpriseOpen, setSurpriseOpen] = useState(false)
  const [teddyHappy, setTeddyHappy] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const timeLeft = useCountdown(COUNTDOWN_DATE)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && e.target.classList.add('section-visible'))
      },
      { threshold: 0.07 },
    )
    sectionRefs.current.forEach((r) => r && observer.observe(r))
    return () => observer.disconnect()
  }, [])

  const handleTeddyClick = () => {
    if (surpriseOpen) return
    setTeddyHappy(true)
    setSurpriseOpen(true)
    setConfetti(true)
    setTimeout(() => setConfetti(false), 3200)
  }

  const photos = [
    { src: 'https://images.unsplash.com/photo-1554486840-db3a33d9318e?w=400&h=400&fit=crop&auto=format', caption: 'forever in bloom', rotation: -3, alt: 'Pink flowers' },
    { src: 'https://images.unsplash.com/photo-1771598480268-b8da5af0c67c?w=400&h=400&fit=crop&auto=format', caption: 'our golden hour', rotation: 2.5, alt: 'Couple at sunset' },
    { src: 'https://images.unsplash.com/photo-1615919737249-965d68c7e439?w=400&h=400&fit=crop&auto=format', caption: 'soft as petals', rotation: -1.5, alt: 'Pink rose' },
    { src: 'https://images.unsplash.com/photo-1749566787207-bd56427f4454?w=400&h=400&fit=crop&auto=format', caption: 'you & me', rotation: 3, alt: 'Two figures at sunset' },
    { src: 'https://images.unsplash.com/photo-1589458456444-f7158a7e8a4f?w=400&h=400&fit=crop&auto=format', caption: 'wild & beautiful', rotation: -2.5, alt: 'Pink roses' },
    { src: 'https://images.unsplash.com/photo-1766156124803-4c11960cd4d5?w=400&h=400&fit=crop&auto=format', caption: 'into the light', rotation: 1.5, alt: 'Silhouette at sunset' },
  ]

  const songs = [
    { title: "I Won't Give Up", artist: 'Jason Mraz', note: 'because I never will' },
    { title: 'Talking to the Moon', artist: 'Bruno Mars', note: 'thinking of you, always' },
    { title: 'Ano tavela', artist: 'Lion Hill', note: 'Mandrakizay tsy agnambela' },
    { title: 'Make You Feel My Love', artist: 'Adele', note: 'no matter what' },
    { title: 'Bloom', artist: 'The Paper Kites', note: 'you bloom so beautifully' },
  ]

  const movies: Movie[] = [
    {
      title: 'La La Land',
      year: 2016,
      director: 'Damien Chazelle',
      quote: "Here's to the ones who dream, foolish as they may seem.",
      character: 'Mia Dolan',
      accentColor: '#F5C842',
      labelColor: '#FFF8D0',
    },
    {
      title: 'Forrest Gump',
      year: 1994,
      director: 'Robert Zemeckis',
      quote: 'Life is like a box of chocolates — you never know what you\'re gonna get.',
      character: 'Mrs. Gump',
      accentColor: '#7BC4D4',
      labelColor: '#D0F0F8',
    },
    {
      title: 'The Notebook',
      year: 2004,
      director: 'Nick Cassavetes',
      quote: "I am nothing special, of this I am sure. I am a common man — but I've loved another with all my heart, and to me, this has always been enough.",
      character: 'Noah Calhoun',
      accentColor: '#F2A7B7',
      labelColor: '#FFD5DF',
    },
    {
      title: 'Before Sunrise',
      year: 1995,
      director: 'Richard Linklater',
      quote: 'If there\'s any kind of magic in this world, it must be in the attempt of understanding someone.',
      character: 'Celine',
      accentColor: '#A8C67C',
      labelColor: '#D8F0B8',
    },
    {
      title: 'A Walk to Remember',
      year: 2002,
      director: 'Adam Shankman',
      quote: 'Love is always patient and kind. It is never jealous. Love is never boastful or conceited.',
      character: 'Jamie Sullivan',
      accentColor: '#C4A8D4',
      labelColor: '#EDD5FF',
    },
    {
      title: 'Eternal Sunshine of the Spotless Mind',
      year: 2004,
      director: 'Michel Gondry',
      quote: 'How happy is the blameless vestal\'s lot! The world forgetting, by the world forgot. Eternal sunshine of the spotless mind!',
      character: 'Clementine',
      accentColor: '#8AADD0',
      labelColor: '#C8DEFF',
    },
  ]

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: '#FDF6EE', color: '#4A3128' }}>
      <Confetti active={confetti} />

      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO — Cinematic & layered
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: '#FCE4EC' }}
      >
        {/* Multi-layer gradient background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(155deg, #FCE4EC 0%, #FFF8E7 28%, #FFF3CD 50%, #F3E5F5 76%, #EDE7F6 100%)',
        }} />

        {/* Drifting background blobs */}
        <div
          className="absolute"
          style={{
            width: '70vw', height: '70vw', maxWidth: 600, maxHeight: 600,
            top: '-15%', left: '-15%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(242,167,183,0.28) 0%, transparent 70%)',
            animation: 'blobDrift1 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '60vw', height: '60vw', maxWidth: 520, maxHeight: 520,
            bottom: '-12%', right: '-12%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,181,208,0.32) 0%, transparent 70%)',
            animation: 'blobDrift2 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute"
          style={{
            width: '45vw', height: '45vw', maxWidth: 400, maxHeight: 400,
            top: '20%', right: '10%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,243,205,0.4) 0%, transparent 70%)',
            animation: 'blobDrift1 14s ease-in-out infinite 4s',
          }}
        />

        {/* Falling petals */}
        <FallingPetals />

        {/* Constellation stars */}
        <Constellation />

        {/* Floating ambient particles */}
        <FloatingParticles />

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(139,74,85,0.08) 100%)',
            zIndex: 2,
          }}
        />

        {/* Cinematic letterbox bars */}
        <div className="absolute top-0 left-0 right-0 h-2 z-10" style={{ background: 'rgba(58,26,20,0.5)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-2 z-10" style={{ background: 'rgba(58,26,20,0.5)' }} />

        {/* Moon — top right, larger & more detailed */}
        <div
          className="absolute"
          style={{ top: '5%', right: '4%', zIndex: 3, opacity: 0.85, animation: 'twinkle 8s ease-in-out infinite' }}
        >
          <Moon size={80} />
        </div>

        {/* Small accent stars near moon */}
        <div className="absolute" style={{ top: '14%', right: '13%', zIndex: 3, animation: 'twinkle 3s ease-in-out infinite 1s' }}>
          <StarShape size={10} opacity={0.55} />
        </div>
        <div className="absolute" style={{ top: '8%', right: '17%', zIndex: 3, animation: 'twinkle 4.5s ease-in-out infinite 0.5s' }}>
          <StarShape size={7} opacity={0.4} />
        </div>

        {/* Center content */}
        <div className="relative z-10 text-center px-6 max-w-2xl w-full" style={{ paddingTop: '2vh', paddingBottom: '2vh' }}>

          {/* Eyebrow with ornamental lines */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 md:w-20" style={{ background: 'rgba(139,74,85,0.25)' }} />
            <p
              className="uppercase tracking-widest flex-shrink-0"
              style={{ color: '#9B7A76', fontSize: '0.66rem', letterSpacing: '0.32em' }}
            >
              a love letter for
            </p>
            <div className="h-px w-12 md:w-20" style={{ background: 'rgba(139,74,85,0.25)' }} />
          </div>

          {/* Her name */}
          <h1
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(4.5rem, 17vw, 8rem)',
              color: '#8B4A55',
              lineHeight: 1.0,
              animation: 'heroNameGlow 4s ease-in-out infinite',
            }}
          >
            {HER_NAME}
          </h1>

          {/* "18" inside floral wreath */}
          <div
            className="relative inline-flex items-center justify-center my-2"
            style={{ width: 230, height: 230 }}
            aria-label="18"
          >
            <FloralWreath />
            {/* Shadow copy */}
            <span
              aria-hidden
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 'clamp(5rem, 18vw, 9rem)',
                color: '#D4A843',
                position: 'relative',
                zIndex: 1,
                lineHeight: 1,
                animation: 'numberShimmer 3.5s ease-in-out infinite',
              }}
            >
              18
            </span>
            {/* Stroke echo */}
            <span
              aria-hidden
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 'clamp(5rem, 18vw, 9rem)',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(212,168,67,0.4)',
                position: 'absolute',
                top: '6px',
                left: '6px',
                zIndex: 0,
                lineHeight: 1,
              }}
            >
              18
            </span>
          </div>

          <FloralDivider />

          {/* Tagline */}
          <p
            className="mt-3"
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: 'clamp(1.3rem, 4.5vw, 1.9rem)',
              color: '#8B6E6A',
              lineHeight: 1.5,
              opacity: 0.88,
            }}
          >
            today you bloom into everything you were always meant to be
          </p>

          {/* Date tag */}
          <p
            className="mt-4 uppercase tracking-widest"
            style={{ fontSize: '0.62rem', color: '#9B7A76', letterSpacing: '0.3em', opacity: 0.65 }}
          >
            July 26 · 2026
          </p>

          {/* Scroll hint */}
          <div className="mt-10 flex flex-col items-center gap-2 opacity-45 animate-bounce">
            <p style={{ fontSize: '0.58rem', letterSpacing: '0.3em', color: '#9B7A76', textTransform: 'uppercase' }}>
              scroll
            </p>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
              <path d="M6 1 L6 17 M1 12 L6 17 L11 12" stroke="#C4B5D0" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. LOVE LETTER
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[0] = el }}
        className="section-fade py-20 md:py-28 px-4"
        style={{ background: '#FDF6EE' }}
      >
        <div className="max-w-2xl mx-auto">
          <SectionHeading eyebrow="written from the heart" title="A Letter, Just for You" />

          <div
            className="relative rounded-3xl px-8 py-10 md:px-14 md:py-12"
            style={{
              background: '#FFFDF8',
              boxShadow: '0 6px 36px rgba(74,49,40,0.09), inset 0 0 0 1px rgba(212,168,67,0.16)',
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, rgba(196,181,208,0.22) 31px, rgba(196,181,208,0.22) 32px)',
            }}
          >
            <div className="absolute top-0 bottom-0" style={{ left: '56px', width: '1px', background: 'rgba(242,167,183,0.28)' }} />
            <p className="text-right mb-4" style={{ color: '#9B7A76', fontSize: '0.82rem', opacity: 0.7 }}>July 26th, 2026</p>
            <p className="mb-7" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2rem', color: '#8B4A55', lineHeight: 1.4 }}>
              My dearest {HER_NAME},
            </p>
            <div className="space-y-5" style={{ color: '#5C3D35', fontSize: '1rem', lineHeight: '2rem' }}>
              <p>There are 18 candles on your cake today, but in my heart every single one is a story I've been lucky enough to share with you — a laugh in the hallway, a moment where you looked at something ordinary and made it luminous.</p>
              <p>You have this rare, quiet magic. You make people feel seen without even trying. You carry whole worlds inside you — your kindness, your humor, that slightly dramatic reaction to good food, your way of caring so deeply it sometimes looks like stubbornness from the outside.</p>
              <p>I am so unbearably proud of the person you've become. And today, on this threshold — standing at the edge of all the years ahead — I want you to know that wherever life takes you, you take my whole heart with you.</p>
              <p>Happy 18th birthday, love. This year, and every year after it, is yours.</p>
            </div>
            <p className="mt-9 text-right" style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2.1rem', color: '#D4A843', lineHeight: 1.3 }}>
              Always yours, {YOUR_NAME} ♥
            </p>
            <div className="flex justify-center mt-7">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-xl"
                style={{
                  background: 'radial-gradient(circle at 40% 36%, #E8C060 0%, #C49030 60%, #A07020 100%)',
                  boxShadow: '0 3px 12px rgba(212,168,67,0.4)',
                  color: 'white',
                }}
              >
                ♥
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. PHOTO GALLERY
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[1] = el }}
        className="section-fade py-16 md:py-24 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #FDF6EE 0%, #FFF0F3 100%)' }}
      >
        <div className="overflow-hidden mb-10"><FilmStrip /></div>
        <div className="px-4 max-w-5xl mx-auto">
          <SectionHeading eyebrow="our story in frames" title="Memories We'll Keep Forever" />
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 pb-4">
            {photos.map((p, i) => <Polaroid key={i} {...p} />)}
          </div>
        </div>
        <div className="overflow-hidden mt-10"><FilmStrip /></div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. MUSIC
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[2] = el }}
        className="section-fade py-20 md:py-28 px-4"
        style={{ background: '#F5EEF8' }}
      >
        <div className="max-w-xl mx-auto">
          <SectionHeading eyebrow="songs that sound like us" title="Our Playlist" />
          <div className="flex justify-center mb-10"><CassetteTape /></div>
          <div className="space-y-3">
            {songs.map((s, i) => <SongRow key={i} index={i + 1} {...s} />)}
          </div>
          <p className="text-center mt-7 opacity-45 italic text-sm" style={{ color: '#8B6E6A' }}>
            — made with love, played on repeat —
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. MOVIES — Cinematic ticket stubs
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[3] = el }}
        className="section-fade py-20 md:py-28 px-4 overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1A1008 0%, #2A1418 40%, #1C1226 100%)',
          animation: 'filmFlicker 12s ease-in-out infinite',
        }}
      >
        {/* Subtle film grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <SectionHeading eyebrow="films that move us" title="Our Cinema" light />

          {/* Film strip accent */}
          <div className="flex justify-center gap-2 mb-8 opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <div className="w-3 h-2 rounded-sm" style={{ background: '#8B6040' }} />
                <div className="w-3 h-6" style={{ background: '#6B4A30' }} />
                <div className="w-3 h-2 rounded-sm" style={{ background: '#8B6040' }} />
              </div>
            ))}
          </div>

          {/* Movie cards */}
          <div className="space-y-4">
            {movies.map((m, i) => (
              <MovieCard key={i} movie={m} index={i} />
            ))}
          </div>

          {/* Footer note */}
          <p
            className="text-center mt-10 opacity-35 italic"
            style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.4rem', color: '#F9D5DF' }}
          >
            every frame a feeling, every film a memory
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. SURPRISE
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[4] = el }}
        className="section-fade py-20 md:py-28 px-4"
        style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FFF8E7 100%)' }}
      >
        <div className="max-w-md mx-auto text-center">
          <SectionHeading eyebrow="psst… there's a secret" title="A Little Surprise" />
          <p className="mb-8" style={{ color: '#8B6E6A', fontSize: '0.95rem', opacity: 0.75, marginTop: '-1rem' }}>
            {surpriseOpen ? 'He told you a secret ♥' : 'Give the bear a hug to find out...'}
          </p>
          <button
            onClick={handleTeddyClick}
            className="mx-auto block border-0 bg-transparent p-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
            style={{
              cursor: surpriseOpen ? 'default' : 'pointer',
              animation: teddyHappy ? 'teddyDance 0.55s ease-in-out 3' : 'teddyBob 3.2s ease-in-out infinite',
              filter: 'drop-shadow(0 10px 22px rgba(196,149,106,0.32))',
            }}
            aria-label="Click the teddy bear for a surprise"
          >
            <TeddyBear happy={teddyHappy} />
          </button>
          {surpriseOpen && (
            <div
              className="mt-8 p-8 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, rgba(242,167,183,0.13), rgba(212,168,67,0.09))',
                border: '1px solid rgba(212,168,67,0.28)',
                animation: 'fadeInUp 0.65s ease-out',
              }}
            >
              <div className="text-4xl mb-4">💌</div>
              <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(1.5rem, 5vw, 2rem)', color: '#8B4A55', lineHeight: 1.55 }}>
                {SURPRISE_MESSAGE}
              </p>
              <div className="flex justify-center gap-2 mt-5">
                {['♥', '★', '♥', '★', '♥'].map((g, i) => (
                  <span key={i} style={{ fontSize: '1.25rem', color: i % 2 === 0 ? '#F2A7B7' : '#D4A843', animation: `twinkle ${1.2 + i * 0.35}s ease-in-out infinite`, display: 'inline-block' }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          7. CLOSING / COUNTDOWN
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={(el) => { sectionRefs.current[5] = el }}
        className="section-fade py-20 md:py-28 px-4"
        style={{ background: 'linear-gradient(155deg, #3D2014 0%, #5A2E3E 45%, #2E2040 100%)', color: '#FDF6EE' }}
      >
        <div className="max-w-lg mx-auto text-center">
          <div className="flex justify-center gap-3 mb-4">
            {[20, 13, 24, 11, 18, 15, 22].map((s, i) => (
              <div key={i} style={{ animation: `twinkle ${2.2 + i * 0.45}s ease-in-out infinite`, animationDelay: `${i * 0.3}s`, opacity: 0.75 }}>
                <StarShape size={s} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mb-4" style={{ opacity: 0.88 }}><Moon size={64} /></div>
          <SectionHeading eyebrow="something is coming" title="Until Our Next Adventure" light />
          <p className="mb-10" style={{ color: '#EDD5E0', fontSize: '0.95rem', lineHeight: 1.85, opacity: 0.8 }}>
            Something special is waiting.<br />
            Something I've been planning just for you.<br />
            Count the seconds with me.
          </p>
          <div className="flex justify-center gap-3 md:gap-6 mb-12">
            <CountdownUnit value={timeLeft.days} label="days" />
            <CountdownUnit value={timeLeft.hours} label="hrs" />
            <CountdownUnit value={timeLeft.minutes} label="min" />
            <CountdownUnit value={timeLeft.seconds} label="sec" />
          </div>
          <FloralDivider light />
          <p className="mt-8" style={{ fontFamily: "'Great Vibes', cursive", fontSize: 'clamp(2rem, 7vw, 3rem)', color: '#D4A843', lineHeight: 1.4 }}>
            Happy Birthday, my love.
          </p>
          <p className="mt-3 uppercase tracking-widest" style={{ fontSize: '0.62rem', color: '#C4B5D0', letterSpacing: '0.28em', opacity: 0.6 }}>
            made with every piece of my heart
          </p>
          <div className="mt-8 inline-block" style={{ fontSize: '2.8rem', animation: 'heartbeat 1.6s ease-in-out infinite' }}>
            ♥
          </div>
        </div>
      </section>
    </div>
  )
}
