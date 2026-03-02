"use client"

import { useRef, useState } from "react"
import { ImagePlus, X, Flag, Pencil, Check, Clock } from "lucide-react"
import { Item } from "@/lib/types"

interface Props {
  item: Item
}

type UrgencyLevel = "info" | "advisory" | "urgent" | "critical"

interface Comment {
  id: string
  text: string
  urgency: UrgencyLevel
  date: string
}

const URGENCY: Record<UrgencyLevel, { label: string; colour: string }> = {
  info:     { label: "Info",     colour: "bg-sky-100 text-sky-700" },
  advisory: { label: "Advisory", colour: "bg-amber-100 text-amber-700" },
  urgent:   { label: "Urgent",   colour: "bg-orange-100 text-orange-700" },
  critical: { label: "Critical", colour: "bg-red-100 text-red-700" },
}

function today() {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default function ItemRow({ item }: Props) {
  const [showInfo, setShowInfo] = useState(false)
  const [localImage, setLocalImage] = useState<string | null>(item.imageUrl ?? null)
  const [showContact, setShowContact] = useState(false)

  const [showNotes, setShowNotes] = useState(false)
  const [instruction, setInstruction] = useState("")
  const [instructionDraft, setInstructionDraft] = useState("")
  const [editingInstruction, setEditingInstruction] = useState(false)
  const [instructionLastEdited, setInstructionLastEdited] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [newUrgency, setNewUrgency] = useState<UrgencyLevel>("info")

  const qty = item.defaultQty ?? "—"
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLocalImage(URL.createObjectURL(file))
    e.target.value = ""
  }

  function removeImage() {
    if (localImage?.startsWith("blob:")) URL.revokeObjectURL(localImage)
    setLocalImage(null)
  }

  function addComment() {
    if (!newComment.trim()) return
    setComments(prev => [{
      id: crypto.randomUUID(),
      text: newComment.trim(),
      urgency: newUrgency,
      date: today(),
    }, ...prev])
    setNewComment("")
  }

  function removeComment(id: string) {
    setComments(prev => prev.filter(c => c.id !== id))
  }

  const hasNotes = item.notes || instruction || comments.length > 0

  return (
    <>
      {/* ── Compact row ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 border-b border-[#D5DCE3] py-3">

        {/* Item name (hyperlink) + product name */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => setShowInfo(true)}
            className="text-sm font-semibold text-[#2F8EF7] underline underline-offset-2 truncate text-left w-full leading-snug"
          >
            {item.name}
          </button>
          {item.product && (
            <p className="text-xs text-[#94a3b8] truncate leading-snug mt-0.5">
              {item.product}
            </p>
          )}
        </div>

        {/* ⓘ — notes, instructions, comments */}
        <button
          onClick={() => setShowNotes(true)}
          className={[
            "shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold leading-none transition-colors",
            hasNotes
              ? "border-[#2F8EF7] text-[#2F8EF7]"
              : "border-[#94a3b8] text-[#94a3b8] hover:border-[#2F8EF7] hover:text-[#2F8EF7]",
          ].join(" ")}
          aria-label="Notes and comments"
        >
          i
        </button>

        {/* Qty — read only */}
        <span className="shrink-0 w-14 text-center text-sm font-medium text-[#3F4752]">
          {qty}
        </span>
      </div>

      {/* ── Info drawer (item name click) ────────────────────────────── */}
      {showInfo && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => { setShowInfo(false); setShowContact(false) }}
        >
          <div
            className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-6 shadow-xl max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#3F4752] text-lg leading-snug">{item.name}</h3>
                {item.sku && <p className="text-sm text-[#94a3b8] mt-0.5">{item.sku}</p>}
              </div>
              <button
                onClick={() => { setShowInfo(false); setShowContact(false) }}
                className="ml-3 shrink-0 w-8 h-8 rounded-full bg-[#F4F7FA] flex items-center justify-center text-[#64748b] hover:bg-[#D5DCE3] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Image */}
            <div className="mb-5">
              {localImage ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={localImage} alt={item.name} className="w-full h-40 object-cover rounded-xl border border-[#D5DCE3]" />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow text-[#64748b] hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 border border-dashed border-[#cbd5e1] rounded-xl py-6 text-sm text-[#94a3b8] hover:border-[#4DA3FF] hover:text-[#4DA3FF] transition-colors"
                >
                  <ImagePlus size={18} /> Add image
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-base text-[#475569] leading-relaxed mb-5">{item.description}</p>
            )}

            {/* Product + Supplier */}
            {(item.product || item.supplier) && (
              <div className="space-y-4">
                {item.product && (
                  <div>
                    <span className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1">Product</span>
                    <span className="text-base font-medium text-[#3F4752]">{item.product}</span>
                  </div>
                )}
                {item.supplier && (
                  <div>
                    <span className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1">Supplier</span>
                    <button
                      onClick={() => setShowContact(!showContact)}
                      className="text-base text-[#2F8EF7] font-semibold underline underline-offset-2"
                    >
                      {item.supplier.name}
                    </button>
                    {showContact && item.supplier.contact && (
                      <span className="block text-base text-[#475569] mt-1.5">{item.supplier.contact}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Notes / comments panel (ⓘ click) ────────────────────────── */}
      {showNotes && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setShowNotes(false)}
        >
          <div
            className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-6 shadow-xl max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#3F4752] text-lg leading-snug">{item.name}</h3>
                <p className="text-sm text-[#94a3b8] mt-0.5">Notes &amp; comments</p>
              </div>
              <button
                onClick={() => setShowNotes(false)}
                className="ml-3 shrink-0 w-8 h-8 rounded-full bg-[#F4F7FA] flex items-center justify-center text-[#64748b] hover:bg-[#D5DCE3] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Static notes */}
            {item.notes && (
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#D5DCE3] mb-5">
                <span className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">Notes</span>
                <p className="text-base text-[#475569] leading-relaxed">{item.notes}</p>
              </div>
            )}

            {/* Custom instructions */}
            <div className="mb-5 border border-[#D5DCE3] rounded-xl p-4 bg-[#f8fafc]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wide text-[#94a3b8]">
                  Custom instructions
                </span>
                {!editingInstruction && (
                  <button
                    onClick={() => { setInstructionDraft(instruction); setEditingInstruction(true) }}
                    className="flex items-center gap-1 text-xs text-[#2F8EF7] font-semibold"
                  >
                    <Pencil size={11} /> Edit
                  </button>
                )}
              </div>

              {editingInstruction ? (
                <>
                  <textarea
                    value={instructionDraft}
                    onChange={(e) => setInstructionDraft(e.target.value)}
                    placeholder="Add standing instructions for this item…"
                    rows={3}
                    className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] bg-white placeholder:text-[#cbd5e1]"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setInstruction(instructionDraft)
                        setInstructionLastEdited(today())
                        setEditingInstruction(false)
                      }}
                      className="flex items-center gap-1 bg-[#4DA3FF] text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-[#2F8EF7] transition-colors"
                    >
                      <Check size={13} /> Save
                    </button>
                    <button
                      onClick={() => setEditingInstruction(false)}
                      className="flex items-center gap-1 text-sm text-[#64748b] px-3 py-1.5 rounded-lg border border-[#D5DCE3] hover:bg-[#F4F7FA] transition-colors"
                    >
                      <X size={13} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-base text-[#475569] leading-relaxed whitespace-pre-wrap">
                    {instruction || <span className="text-[#cbd5e1]">No instructions added.</span>}
                  </p>
                  {instructionLastEdited && (
                    <p className="mt-2 text-xs text-[#94a3b8] flex items-center gap-1">
                      <Clock size={11} /> Last edited by You · {instructionLastEdited}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Add comment */}
            <div className="mb-5">
              <span className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-2">
                Add comment
              </span>
              {/* Urgency selector */}
              <div className="flex gap-1.5 mb-3">
                {(Object.keys(URGENCY) as UrgencyLevel[]).map((u) => (
                  <button
                    key={u}
                    onClick={() => setNewUrgency(u)}
                    className={[
                      "flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors",
                      newUrgency === u
                        ? URGENCY[u].colour + " border-transparent"
                        : "border-[#D5DCE3] text-[#94a3b8]",
                    ].join(" ")}
                  >
                    {URGENCY[u].label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addComment()}
                  placeholder="Write a comment…"
                  className="flex-1 text-base border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] focus:border-transparent placeholder:text-[#cbd5e1]"
                />
                <button
                  onClick={addComment}
                  className="shrink-0 bg-[#4DA3FF] text-white text-sm font-semibold px-4 rounded-xl hover:bg-[#2F8EF7] transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Comment list */}
            {comments.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wide text-[#94a3b8] block">Comments</span>
                {comments.map((c) => (
                  <div key={c.id} className="bg-[#f8fafc] rounded-xl p-4 border border-[#D5DCE3]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${URGENCY[c.urgency].colour}`}>
                          <Flag size={10} />
                          {URGENCY[c.urgency].label}
                        </span>
                        <span className="text-xs text-[#94a3b8]">{c.date}</span>
                      </div>
                      <button
                        onClick={() => removeComment(c.id)}
                        className="text-[#cbd5e1] hover:text-red-400 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-base text-[#475569] leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
