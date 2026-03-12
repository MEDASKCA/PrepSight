"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUp, Paperclip, Sparkles, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import ProfileButton from "./ProfileButton"
import {
  type AssistantReply,
  buildAssistantContext,
  buildAssistantReply,
  buildAssistantWelcome,
} from "@/lib/assistant"

interface ChatMessage {
  id: string
  role: "assistant" | "user"
  reply: AssistantReply
}

function AIIcon({ className = "h-[92px] w-[92px]" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/ps-mark.png"
      alt="P.S."
      aria-hidden="true"
      className={`${className} object-contain [animation:aiIconSurge_1.8s_ease-in-out_infinite]`}
    />
  )
}

function AssistantBubble({
  message,
  onAction,
  onPrompt,
}: {
  message: ChatMessage
  onAction: (href: string) => void
  onPrompt: (prompt: string) => void
}) {
  const isAssistant = message.role === "assistant"

  return (
    <div className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[88%] overflow-hidden rounded-[24px] border px-4 py-3 shadow-sm ${
          isAssistant
            ? "rounded-tl-md border-[#D7E6F4] bg-white text-[#1E293B]"
            : "rounded-tr-md border-[#1E293B] bg-[#1E293B] text-white"
        }`}
      >
        <p className="text-[14px] leading-6">{message.reply.text}</p>

        {message.reply.stats && message.reply.stats.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {message.reply.stats.map((stat) => (
              <div
                key={`${message.id}-${stat.label}`}
                className="rounded-2xl border border-[#E2E8F0] bg-[#F8FBFF] px-3 py-2"
              >
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#94A3B8]">
                  {stat.label}
                </p>
                <p className="mt-1 text-base font-semibold text-[#0F172A]">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {message.reply.table && (
          <div className="mt-3 overflow-hidden rounded-2xl border border-[#D7E6F4] bg-[#F8FBFF]">
            {message.reply.table.title && (
              <div className="border-b border-[#D7E6F4] bg-white px-3 py-2">
                <p className="text-xs font-semibold text-[#0F172A]">
                  {message.reply.table.title}
                </p>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-white text-[#64748B]">
                  <tr>
                    {message.reply.table.columns.map((column) => (
                      <th key={`${message.id}-${column}`} className="px-3 py-2 font-medium">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {message.reply.table.rows.map((row, rowIndex) => (
                    <tr key={`${message.id}-row-${rowIndex}`} className="border-t border-[#E2E8F0]">
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${message.id}-${rowIndex}-${cellIndex}`}
                          className="px-3 py-2 align-top text-[#0F172A]"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {message.reply.actions && message.reply.actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.reply.actions.map((action) => (
              <button
                key={`${message.id}-${action.label}-${action.href}`}
                type="button"
                onClick={() => onAction(action.href)}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  action.tone === "primary"
                    ? "bg-[#0F172A] text-white"
                    : "border border-[#BFD8F2] bg-white text-[#1D4ED8]"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {message.reply.chips && message.reply.chips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.reply.chips.map((chip) => (
              <button
                key={`${message.id}-${chip}`}
                type="button"
                onClick={() => onPrompt(chip)}
                className="rounded-full border border-[#CFE3F7] bg-white px-3 py-2 text-[11px] font-medium text-[#0F4C81]"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MobileDrawer() {
  const [open, setOpen] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const messageSeed = useRef(0)

  const context = useMemo(
    () => buildAssistantContext(pathname, new URLSearchParams(searchParams.toString())),
    [pathname, searchParams],
  )

  useEffect(() => {
    if (!open) return
    const welcome = buildAssistantWelcome(context)
    setMessages([
      {
        id: `assistant-${++messageSeed.current}`,
        role: "assistant",
        reply: welcome,
      },
    ])
  }, [context, open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open || !scrollerRef.current) return
    scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight
  }, [messages, open])

  function appendUserMessage(text: string) {
    setMessages((current) => [
      ...current,
      {
        id: `user-${++messageSeed.current}`,
        role: "user",
        reply: { text },
      },
    ])
  }

  function appendAssistantReply(reply: AssistantReply) {
    setMessages((current) => [
      ...current,
      {
        id: `assistant-${++messageSeed.current}`,
        role: "assistant",
        reply,
      },
    ])
  }

  function handleSend(nextPrompt?: string) {
    const value = (nextPrompt ?? prompt).trim()
    if (!value) return
    appendUserMessage(value)
    setPrompt("")
    const reply = buildAssistantReply(context, value)
    appendAssistantReply(reply)
  }

  function handleAction(href: string) {
    setOpen(false)
    router.push(href)
  }

  return (
    <>
      <div
        data-dev-trigger
        className="sticky top-0 z-40 grid grid-cols-3 items-center overflow-visible border-b border-[#D5DCE3] bg-white px-4 py-0.5 lg:hidden"
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          className="relative -my-6 -ml-3 flex h-[102px] w-[102px] items-center justify-center transition-transform active:scale-95"
        >
          <AIIcon className="h-[108px] w-[108px]" />
        </button>

        <Link href="/" className="flex justify-center">
          <span className="text-base font-bold text-[#00B4D8]">PrepSight</span>
        </Link>

        <div className="flex justify-end">
          <ProfileButton />
        </div>
      </div>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Close AI assistant overlay"
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 flex h-[100dvh] w-[min(94vw,390px)] flex-col overflow-hidden border-r border-white/20 bg-[#EEF5FB] shadow-[0_20px_60px_rgba(15,23,42,0.28)] transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-[102%]"
        }`}
      >
        <div className="relative overflow-hidden border-b border-[#D5E3EF] bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_42%),linear-gradient(180deg,#0F172A_0%,#12263A_58%,#17324A_100%)] px-4 pb-4 pt-4 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AIIcon className="mt-[-8px] h-[68px] w-[68px] shrink-0" />
              <div className="pt-1">
                <p className="text-xs uppercase tracking-[0.24em] text-white/50">Assistant</p>
                <p className="mt-2 max-w-[220px] text-sm leading-6 text-white/80">
                  {context.title}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI assistant"
              className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="mt-3 rounded-[24px] border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
              <Sparkles size={12} />
              Context aware
            </div>
            <p className="mt-2 text-sm leading-6 text-white/82">
              {context.description}
            </p>
          </div>
        </div>

        <div ref={scrollerRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
          {messages.map((message) => (
            <AssistantBubble
              key={message.id}
              message={message}
              onAction={handleAction}
              onPrompt={handleSend}
            />
          ))}
        </div>

        <div className="border-t border-[#D5E3EF] bg-white/90 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)] pt-3 backdrop-blur-xl">
          <div className="flex items-end gap-2 rounded-[26px] border border-[#D5E3EF] bg-[#F8FBFF] px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
            <button
              type="button"
              aria-label="Attach"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[#64748B]"
            >
              <Paperclip size={17} />
            </button>

            <textarea
              rows={1}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Ask naturally. I can answer, show a table, or take you there."
              className="max-h-28 min-h-[38px] flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              aria-label="Send"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-white transition-colors hover:bg-[#162033]"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
