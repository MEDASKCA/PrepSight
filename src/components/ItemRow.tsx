"use client"

import { useRef, useState, useEffect } from "react"
import { ImagePlus, X, Flag, Pencil, Save, Check, Clock, Trash2, Loader2 } from "lucide-react"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"
import { storage, db } from "@/lib/firebase"
import { Item } from "@/lib/types"

interface Props {
  item: Item
  editMode?: boolean
  onDelete?: () => void
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

export default function ItemRow({ item, editMode = false, onDelete }: Props) {
  const [showInfo, setShowInfo]             = useState(false)
  const [localImage, setLocalImage]         = useState<string | null>(item.imageUrl ?? null)
  const [pendingImage, setPendingImage]     = useState<string | null>(null)
  const [confirmDeleteImg, setConfirmDeleteImg] = useState(false)
  const [savingImage, setSavingImage]       = useState(false)
  const [deletingImage, setDeletingImage]   = useState(false)
  const [imageError, setImageError]         = useState<string | null>(null)
  const [showContact, setShowContact]       = useState(false)

  // Load persisted image from Firestore on mount
  useEffect(() => {
    if (!db || item.imageUrl) return
    getDoc(doc(db, "item_images", item.id)).then((snap) => {
      if (snap.exists()) setLocalImage(snap.data().url as string)
    }).catch(() => {})
  }, [item.id, item.imageUrl])

  const [showNotes, setShowNotes]                   = useState(false)
  const [instruction, setInstruction]               = useState("")
  const [instructionDraft, setInstructionDraft]     = useState("")
  const [editingInstruction, setEditingInstruction] = useState(false)
  const [instructionLastEdited, setInstructionLastEdited] = useState<string | null>(null)
  const [comments, setComments]   = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [newUrgency, setNewUrgency] = useState<UrgencyLevel>("info")

  // Committed display values (updated when modal is saved)
  const [localName,     setLocalName]     = useState(item.name)
  const [localQty,      setLocalQty]      = useState(item.defaultQty != null ? String(item.defaultQty) : "")
  const [localProduct,  setLocalProduct]  = useState(item.product ?? "")
  const [localSupplier, setLocalSupplier] = useState(item.supplier?.name ?? "")
  const [localContact,  setLocalContact]  = useState(item.supplier?.contact ?? "")
  const [localLocation, setLocalLocation] = useState(item.location ?? "")

  // Modal draft values
  const [showEditModal, setShowEditModal] = useState(false)
  const [draftName,     setDraftName]     = useState("")
  const [draftQty,      setDraftQty]      = useState("")
  const [draftProduct,  setDraftProduct]  = useState("")
  const [draftSupplier, setDraftSupplier] = useState("")
  const [draftContact,  setDraftContact]  = useState("")
  const [draftLocFloor, setDraftLocFloor] = useState("")
  const [draftLocRoom,  setDraftLocRoom]  = useState("")
  const [draftLocShelf, setDraftLocShelf] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  function openEditModal() {
    setDraftName(localName)
    setDraftQty(localQty)
    setDraftProduct(localProduct)
    setDraftSupplier(localSupplier)
    setDraftContact(localContact)
    const locParts = localLocation.split("/")
    setDraftLocFloor(locParts[0]?.trim() ?? "")
    setDraftLocRoom(locParts[1]?.trim() ?? "")
    setDraftLocShelf(locParts[2]?.trim() ?? "")
    setShowEditModal(true)
  }

  function saveEdit() {
    setLocalName(draftName)
    setLocalQty(draftQty)
    setLocalProduct(draftProduct)
    setLocalSupplier(draftSupplier)
    setLocalContact(draftContact)
    setLocalLocation([draftLocFloor, draftLocRoom, draftLocShelf].filter(Boolean).join("/"))
    setShowEditModal(false)
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (pendingImage?.startsWith("blob:")) URL.revokeObjectURL(pendingImage)
    setPendingImage(URL.createObjectURL(file))
    e.target.value = ""
  }

  async function saveImage() {
    if (!pendingImage) return
    setSavingImage(true)
    setImageError(null)
    try {
      if (storage && db) {
        const blob = await fetch(pendingImage).then((r) => r.blob())
        const storageRef = ref(storage, `item-images/${item.id}`)

        // Timeout wrapper — Firebase Storage can hang silently if rules block or bucket unreachable
        const timeout = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Upload timed out — check Firebase Storage rules are set to allow writes.")), 10000)
        )

        await Promise.race([uploadBytes(storageRef, blob), timeout])
        const url = await getDownloadURL(storageRef)
        await setDoc(doc(db, "item_images", item.id), { url })
        if (localImage?.startsWith("blob:")) URL.revokeObjectURL(localImage)
        setLocalImage(url)
        if (pendingImage.startsWith("blob:")) URL.revokeObjectURL(pendingImage)
        setPendingImage(null)
      } else {
        setLocalImage(pendingImage)
        setPendingImage(null)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error("Image upload failed:", err)
      setImageError(msg)
    } finally {
      setSavingImage(false)
    }
  }

  function cancelPendingImage() {
    if (pendingImage?.startsWith("blob:")) URL.revokeObjectURL(pendingImage)
    setPendingImage(null)
  }

  async function removeImage() {
    setDeletingImage(true)
    try {
      if (storage && db) {
        try {
          await deleteObject(ref(storage, `item-images/${item.id}`))
        } catch {}
        await deleteDoc(doc(db, "item_images", item.id))
      }
      if (localImage?.startsWith("blob:")) URL.revokeObjectURL(localImage)
      setLocalImage(null)
      setConfirmDeleteImg(false)
    } finally {
      setDeletingImage(false)
    }
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
      <div className={`flex items-center gap-2 border-b border-[#D5DCE3] py-2.5 ${editMode ? "bg-[#fff8f5]" : ""}`}>

        {editMode ? (
          /* ── Edit mode — clean row with action icons ──────────────── */
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#3F4752] truncate">{localName}</p>
              {localProduct && (
                <p className="text-xs text-[#94a3b8] truncate leading-snug mt-0.5">{localProduct}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-14 text-center">
                {localLocation
                  ? localLocation.split("/").map((part, i) => (
                      <span key={i} className="text-[10px] text-[#64748b] leading-tight block">
                        {part.trim()}
                      </span>
                    ))
                  : <span className="text-[10px] text-[#D5DCE3]">-</span>
                }
              </div>
              <div className="w-10 text-center text-sm font-medium text-[#3F4752]">
                {localQty || "-"}
              </div>
              <button
                onClick={openEditModal}
                className="w-7 h-7 shrink-0 rounded-full bg-[#F87171]/10 flex items-center justify-center text-[#F87171] hover:bg-[#F87171]/20 transition-colors"
                aria-label="Edit item"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={onDelete}
                className="w-7 h-7 shrink-0 rounded-full bg-[#F87171]/10 flex items-center justify-center text-[#F87171] hover:bg-[#F87171]/20 transition-colors"
                aria-label="Remove item"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </>
        ) : (
          /* ── View mode ─────────────────────────────────────────────── */
          <>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <button
                  onClick={() => setShowInfo(true)}
                  className="text-sm font-semibold text-[#2F8EF7] underline underline-offset-2 truncate text-left leading-snug min-w-0"
                >
                  {localName}
                </button>
                <button
                  onClick={() => setShowNotes(true)}
                  className={[
                    "shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold leading-none transition-colors",
                    hasNotes
                      ? "border-[#2F8EF7] text-[#2F8EF7]"
                      : "border-[#94a3b8] text-[#94a3b8] hover:border-[#2F8EF7] hover:text-[#2F8EF7]",
                  ].join(" ")}
                  aria-label="Notes and comments"
                >
                  i
                </button>
              </div>
              {localProduct && (
                <p className="text-xs text-[#94a3b8] truncate leading-snug mt-0.5">
                  {localProduct}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="w-14 text-center">
                {localLocation
                  ? localLocation.split("/").map((part, i) => (
                      <span key={i} className="text-[10px] text-[#64748b] leading-tight block">
                        {part.trim()}
                      </span>
                    ))
                  : <span className="text-[10px] text-[#D5DCE3]">-</span>
                }
              </div>
              <div className="w-10 text-center text-sm font-medium text-[#3F4752]">
                {localQty || "-"}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Edit modal ──────────────────────────────────────────────── */}
      {showEditModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-1">Edit item</p>
                <h3 className="font-bold text-[#3F4752] text-lg leading-snug">{localName}</h3>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="ml-3 shrink-0 w-8 h-8 rounded-full bg-[#F4F7FA] flex items-center justify-center text-[#64748b] hover:bg-[#D5DCE3] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">Item name</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent"
                />
              </div>

              {/* Location — 3 parts */}
              <div>
                <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">Location</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <input
                      type="text"
                      value={draftLocFloor}
                      onChange={(e) => setDraftLocFloor(e.target.value)}
                      maxLength={10}
                      placeholder="Floor / Bldg"
                      className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                    />
                    <p className="text-[10px] text-[#94a3b8] mt-1 px-1">Floor / Bldg</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={draftLocRoom}
                      onChange={(e) => setDraftLocRoom(e.target.value)}
                      maxLength={10}
                      placeholder="Room"
                      className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                    />
                    <p className="text-[10px] text-[#94a3b8] mt-1 px-1">Room</p>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={draftLocShelf}
                      onChange={(e) => setDraftLocShelf(e.target.value)}
                      maxLength={10}
                      placeholder="Shelf / Drawer"
                      className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                    />
                    <p className="text-[10px] text-[#94a3b8] mt-1 px-1">Shelf / Drawer</p>
                  </div>
                </div>
              </div>

              <div className="w-1/3">
                <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">Qty</label>
                <input
                  type="number"
                  value={draftQty}
                  onChange={(e) => setDraftQty(e.target.value)}
                  placeholder="1"
                  className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">Product ref</label>
                <input
                  type="text"
                  value={draftProduct}
                  onChange={(e) => setDraftProduct(e.target.value)}
                  placeholder="e.g. REF-12345"
                  className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">Supplier</label>
                <input
                  type="text"
                  value={draftSupplier}
                  onChange={(e) => setDraftSupplier(e.target.value)}
                  placeholder="e.g. Stryker"
                  className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1.5">Supplier contact</label>
                <input
                  type="text"
                  value={draftContact}
                  onChange={(e) => setDraftContact(e.target.value)}
                  placeholder="e.g. 0800 123 456"
                  className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={saveEdit}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F87171] text-white font-semibold py-3 rounded-xl hover:bg-[#ef4444] transition-colors"
              >
                <Save size={16} /> Save changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-3 rounded-xl border border-[#D5DCE3] text-[#64748b] font-semibold hover:bg-[#F4F7FA] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                <h3 className="font-bold text-[#3F4752] text-lg leading-snug">{localName}</h3>
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
              {pendingImage ? (
                /* Pending — awaiting save */
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pendingImage} alt={localName} className="w-full h-40 object-cover rounded-xl border border-[#D5DCE3] mb-3" />
                  <div className="flex gap-2">
                    <button
                      onClick={saveImage}
                      disabled={savingImage}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-600 transition-colors text-sm disabled:opacity-60"
                    >
                      {savingImage ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                      {savingImage ? "Saving…" : "Save image"}
                    </button>
                    <button
                      onClick={cancelPendingImage}
                      disabled={savingImage}
                      className="px-4 py-2.5 rounded-xl border border-[#D5DCE3] text-[#64748b] font-semibold text-sm hover:bg-[#F4F7FA] transition-colors disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                  {imageError && (
                    <p className="text-xs text-red-500 mt-2 text-center">{imageError}</p>
                  )}
                </div>
              ) : localImage ? (
                confirmDeleteImg ? (
                  /* Confirm delete */
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={localImage} alt={localName} className="w-full h-40 object-cover rounded-xl border border-[#D5DCE3] opacity-40 mb-3" />
                    <p className="text-sm font-semibold text-[#3F4752] mb-3 text-center">Delete this image?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={removeImage}
                        disabled={deletingImage}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#F87171] text-white font-semibold py-2.5 rounded-xl hover:bg-[#ef4444] transition-colors text-sm disabled:opacity-60"
                      >
                        {deletingImage ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                        {deletingImage ? "Deleting…" : "Yes, delete"}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteImg(false)}
                        disabled={deletingImage}
                        className="px-4 py-2.5 rounded-xl border border-[#D5DCE3] text-[#64748b] font-semibold text-sm hover:bg-[#F4F7FA] transition-colors disabled:opacity-60"
                      >
                        Keep it
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Image saved — show with delete button */
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={localImage} alt={localName} className="w-full h-40 object-cover rounded-xl border border-[#D5DCE3] mb-3" />
                    <button
                      onClick={() => setConfirmDeleteImg(true)}
                      className="w-full flex items-center justify-center gap-2 border border-dashed border-[#F87171] text-[#F87171] rounded-xl py-2 text-sm font-semibold hover:bg-[#fef2f2] transition-colors"
                    >
                      <Trash2 size={14} /> Delete image
                    </button>
                  </div>
                )
              ) : (
                /* No image */
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
            {(localProduct || localSupplier) && (
              <div className="space-y-4">
                {localProduct && (
                  <div>
                    <span className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1">Product</span>
                    <span className="text-base font-medium text-[#3F4752]">{localProduct}</span>
                  </div>
                )}
                {localSupplier && (
                  <div>
                    <span className="text-xs uppercase tracking-wide text-[#94a3b8] block mb-1">Supplier</span>
                    <button
                      onClick={() => setShowContact(!showContact)}
                      className="text-base text-[#2F8EF7] font-semibold underline underline-offset-2"
                    >
                      {localSupplier}
                    </button>
                    {showContact && localContact && (
                      <span className="block text-base text-[#475569] mt-1.5">{localContact}</span>
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
                <h3 className="font-bold text-[#3F4752] text-lg leading-snug">{localName}</h3>
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
