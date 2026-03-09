"use client"

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react"

const BUTTON_SIZE = 64
const EDGE_GAP = 16
const BOTTOM_GAP = 20

function clampPosition(x: number, y: number) {
  if (typeof window === "undefined") {
    return { x, y }
  }

  const maxX = window.innerWidth - BUTTON_SIZE - EDGE_GAP
  const maxY = window.innerHeight - BUTTON_SIZE - BOTTOM_GAP

  return {
    x: Math.min(Math.max(EDGE_GAP, x), maxX),
    y: Math.min(Math.max(EDGE_GAP, y), maxY),
  }
}

function AiBubbleIcon() {
  return (
    <svg viewBox="0 0 96 96" className="h-[60px] w-[60px]" aria-hidden="true">
      <defs>
        <linearGradient id="iconStroke" x1="10%" y1="22%" x2="88%" y2="76%">
          <stop offset="0%" stopColor="#16B6FF" />
          <stop offset="100%" stopColor="#20E7C7" />
        </linearGradient>
        <filter id="iconGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#17CFFF" floodOpacity="0.35" />
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#19E5D0" floodOpacity="0.18" />
        </filter>
      </defs>

      <g
        fill="none"
        stroke="url(#iconStroke)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#iconGlow)"
      >
        <path
          d="M22 47c0-15.4 11.8-27 27.9-27 13.9 0 24.6 8.3 27.5 20.7"
          strokeWidth="6"
        />
        <path
          d="M77.4 42.5c.4 1.6.6 3 .6 4.5 0 11.8-9.4 21-22 21H45.5l-8.4 7v-7.1C28.1 66.1 22 57.6 22 47"
          strokeWidth="6"
        />
        <path
          d="M16 42v11"
          strokeWidth="6"
        />
        <path d="M82 42v11" strokeWidth="6" />
        <rect x="12" y="41" width="8" height="14" rx="4" strokeWidth="4" />
        <rect x="78" y="41" width="8" height="14" rx="4" strokeWidth="4" />
      </g>

      <g
        fill="none"
        stroke="url(#iconStroke)"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#iconGlow)"
        strokeWidth="6"
      >
        <path d="M33 58V37l15 13 15-13v21" />
        <path d="M33 37h11L48 50l4-13h11" />
        <path d="M33 58h11l4-8 4 8h11" />
      </g>
    </svg>
  )
}

export default function FloatingChatButton() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(() => {
    if (typeof window === "undefined") return null
    return clampPosition(
      window.innerWidth - BUTTON_SIZE - EDGE_GAP,
      window.innerHeight - BUTTON_SIZE - BOTTOM_GAP,
    )
  })
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const draggingRef = useRef(false)

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      if (!draggingRef.current) return

      const next = clampPosition(
        event.clientX - dragOffsetRef.current.x,
        event.clientY - dragOffsetRef.current.y,
      )
      setPosition(next)
    }

    function handleUp() {
      draggingRef.current = false
    }

    window.addEventListener("pointermove", handleMove)
    window.addEventListener("pointerup", handleUp)

    return () => {
      window.removeEventListener("pointermove", handleMove)
      window.removeEventListener("pointerup", handleUp)
    }
  }, [])

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    dragOffsetRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }
    draggingRef.current = true
  }

  if (!position) return null

  return (
    <button
      type="button"
      aria-label="Open AI assistant"
      onPointerDown={handlePointerDown}
      className="fixed z-50 flex touch-none items-center justify-center rounded-full transition-transform active:scale-[0.98] lg:hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${BUTTON_SIZE}px`,
        height: `${BUTTON_SIZE}px`,
      }}
    >
      <AiBubbleIcon />
    </button>
  )
}
