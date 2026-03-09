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
        <radialGradient id="bubbleFill" cx="28%" cy="18%" r="85%">
          <stop offset="0%" stopColor="#87F7F1" />
          <stop offset="38%" stopColor="#42D8F4" />
          <stop offset="72%" stopColor="#1E8CF4" />
          <stop offset="100%" stopColor="#1557D6" />
        </radialGradient>
        <linearGradient id="bubbleEdge" x1="12%" y1="10%" x2="86%" y2="88%">
          <stop offset="0%" stopColor="#67F4EF" />
          <stop offset="50%" stopColor="#2EC4F3" />
          <stop offset="100%" stopColor="#1B67DF" />
        </linearGradient>
        <filter id="starGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.8" result="blurA">
            <animate
              attributeName="stdDeviation"
              values="2.2;4.2;2.2"
              dur="2.8s"
              repeatCount="indefinite"
            />
          </feGaussianBlur>
          <feColorMatrix
            in="blurA"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
          />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bubbleShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="5" stdDeviation="4" floodColor="#0F2F7A" floodOpacity="0.24" />
        </filter>
      </defs>

      <g filter="url(#bubbleShadow)">
        <path
          d="M48 10c22.6 0 39.2 12.2 39.2 31.1 0 18.8-16.6 31.5-39 31.5-4.4 0-8.2-.4-12.2-1.2l-10.2 6.8c-2.8 1.8-6.4-.8-5.6-4l2-7.6C14.6 61.1 8.8 51.7 8.8 41.1 8.8 22.2 25.4 10 48 10Z"
          fill="url(#bubbleFill)"
          stroke="url(#bubbleEdge)"
          strokeWidth="3"
        />
        <path
          d="M20 53c3.8 4.8 9.6 8.2 16 9.6"
          fill="none"
          stroke="#D7FFFF"
          strokeLinecap="round"
          strokeOpacity="0.22"
          strokeWidth="2"
        />
        <path
          d="M23 23c6-5.2 15.2-8.2 25.6-8.2"
          fill="none"
          stroke="#FFFFFF"
          strokeLinecap="round"
          strokeOpacity="0.42"
          strokeWidth="4"
        />
      </g>

      <g fill="#FFFFFF" filter="url(#starGlow)">
        <path d="M47 27c1.8 8.8 3.4 10.4 12.2 12.2-8.8 1.8-10.4 3.4-12.2 12.2-1.8-8.8-3.4-10.4-12.2-12.2 8.8-1.8 10.4-3.4 12.2-12.2Z">
          <animate attributeName="opacity" values="0.82;1;0.82" dur="2.2s" repeatCount="indefinite" />
        </path>
        <path d="M66 23c1 4.8 1.8 5.6 6.6 6.6-4.8 1-5.6 1.8-6.6 6.6-1-4.8-1.8-5.6-6.6-6.6 4.8-1 5.6-1.8 6.6-6.6Z">
          <animate attributeName="opacity" values="0.68;0.96;0.68" dur="1.8s" repeatCount="indefinite" />
        </path>
        <path d="M31 44c1 4.6 1.8 5.4 6.2 6.2-4.4.8-5.2 1.6-6.2 6.2-1-4.6-1.8-5.4-6.2-6.2 4.4-.8 5.2-1.6 6.2-6.2Z">
          <animate attributeName="opacity" values="0.62;0.9;0.62" dur="2.6s" repeatCount="indefinite" />
        </path>
      </g>

      <g fill="#E9FFFF">
        <circle cx="55" cy="33" r="1.4">
          <animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="62" cy="48" r="1.8">
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.1s" repeatCount="indefinite" />
        </circle>
        <circle cx="43" cy="31" r="1.6">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.9s" repeatCount="indefinite" />
        </circle>
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
