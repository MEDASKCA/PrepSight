"use client"

import { useState } from "react"
import { BotMessageSquare, Paperclip, SendHorizonal, Sparkles, X } from "lucide-react"
import Link from "next/link"
import ProfileButton from "./ProfileButton"

export default function MobileDrawer() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        data-dev-trigger
        className="sticky top-0 z-40 grid grid-cols-3 items-center border-b border-[#D5DCE3] bg-white px-4 py-3 lg:hidden"
      >
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI assistant"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D5DCE3] bg-[#F8FBFF] transition-colors hover:bg-[#EFF8FF]"
        >
          <Sparkles size={18} className="text-[#4DA3FF]" />
        </button>

        <Link href="/" className="flex justify-center">
          <span className="text-base font-bold text-[#00B4D8]">PrepSight</span>
        </Link>

        <div className="flex justify-end">
          <ProfileButton />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-[320px] flex-col bg-white shadow-xl transition-transform duration-200 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-[320px]"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#D5DCE3] px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#B8DBFF] bg-[#EAF7FF] text-[#1D8DCC]">
              <BotMessageSquare size={18} />
            </div>
            <div>
              <p className="leading-none text-base font-bold tracking-tight text-[#00B4D8]">PrepSight AI</p>
              <p className="mt-0.5 text-xs text-[#94a3b8]">Contextual clinical assist</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close AI assistant"
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[#F4F7FA]"
          >
            <X size={18} className="text-[#64748b]" />
          </button>
        </div>

        <div className="border-b border-[#D5DCE3] bg-gradient-to-b from-[#F8FBFF] to-white px-4 py-4">
          <div className="space-y-3">
            <div className="max-w-[85%] rounded-[20px] rounded-tl-md bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#475569]">
              Hi. I can help with procedure summaries, implant sizes, tray items, and supplier product lookup.
            </div>
            <div className="ml-auto max-w-[78%] rounded-[20px] rounded-tr-md bg-[#1E293B] px-4 py-3 text-sm leading-6 text-white">
              What can you help me with for this card?
            </div>
            <div className="max-w-[88%] rounded-[20px] rounded-tl-md bg-[#EAF7FF] px-4 py-3 text-sm leading-6 text-[#1E293B]">
              Try asking:
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Summarise this card",
                  "Check implant sizes",
                  "Find tray items",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="rounded-full border border-[#B8DBFF] bg-white px-3 py-1.5 text-[11px] font-medium text-[#1D8DCC]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 bg-[#F8FAFC] px-4 py-4">
          <div className="flex h-full flex-col rounded-[28px] border border-[#D5DCE3] bg-white shadow-sm">
            <div className="border-b border-[#EEF2F6] px-4 py-3">
              <p className="text-sm font-semibold text-[#1E293B]">Conversation</p>
              <p className="mt-1 text-xs text-[#94a3b8]">
                Context-aware clinical assist
              </p>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <div className="max-w-[88%] rounded-[20px] rounded-tl-md bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#475569]">
                I can use the current page context to answer questions about cards, equipment, products, and preparation.
              </div>

              <div className="ml-auto max-w-[78%] rounded-[20px] rounded-tr-md bg-[#EAF7FF] px-4 py-3 text-sm leading-6 text-[#1E293B]">
                Show me the implant sizes I should have ready.
              </div>

              <div className="max-w-[88%] rounded-[20px] rounded-tl-md bg-[#F8FAFC] px-4 py-3 text-sm leading-6 text-[#475569]">
                I would list the common implant size range, related trials, and linked supplier items from the catalogue.
              </div>
            </div>

            <div className="border-t border-[#EEF2F6] px-3 py-3">
              <div className="flex items-end gap-2 rounded-[24px] border border-[#D5DCE3] bg-[#F8FAFC] px-3 py-2">
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-[#64748b] transition-colors hover:bg-white hover:text-[#1D8DCC]"
                  aria-label="Attach"
                >
                  <Paperclip size={16} />
                </button>
                <textarea
                  rows={1}
                  placeholder="Message PrepSight..."
                  className="max-h-28 min-h-[36px] flex-1 resize-none border-0 bg-transparent px-1 py-1.5 text-sm text-[#1E293B] placeholder-[#94a3b8] focus:outline-none"
                />
                <button
                  type="button"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#1E293B] text-white transition-colors hover:bg-[#162033]"
                  aria-label="Send"
                >
                  <SendHorizonal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D5DCE3] px-4 py-3">
          <p className="text-xs text-[#94a3b8]">PrepSight · v0.4</p>
        </div>
      </div>
    </>
  )
}
