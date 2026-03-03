"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  X, Save, LogOut, CheckCircle, AlertCircle, ChevronDown, ChevronRight,
  Hospital, FileText, ImageIcon, BarChart2, Trash2, Plus, Check, RefreshCw,
  Upload,
} from "lucide-react"
import { clearAdminSession, groupedContent, CONTENT_REGISTRY, type ContentEntry } from "@/lib/admin"
import {
  getAllAdminContent, saveAdminContent, deleteAdminContent,
  getFirestoreHospitals, addFirestoreHospital, approveFirestoreHospital, deleteFirestoreHospital,
  getFirestoreSurgeons, approveFirestoreSurgeon, deleteFirestoreSurgeon,
  type FirestoreHospital, type FirestoreSurgeon,
} from "@/lib/firestore"
import { auth, storage } from "@/lib/firebase"
import { procedures } from "@/lib/data"
import hospitalsSeed from "@/lib/hospitals.json"

// Firebase Storage (optional — only available when configured)
let uploadToStorage: ((file: File, path: string) => Promise<string>) | null = null
if (storage) {
  uploadToStorage = async (file: File, path: string) => {
    const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage")
    const storageRef = ref(storage!, path)
    await uploadBytes(storageRef, file)
    return getDownloadURL(storageRef)
  }
}

type Tab = "content" | "hospitals" | "surgeons" | "images" | "stats"

// ── Toast ─────────────────────────────────────────────────────────────────────
interface Toast { id: number; message: string; type: "ok" | "err" }

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const counter = useRef(0)

  function push(message: string, type: Toast["type"] = "ok") {
    const id = ++counter.current
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  return { toasts, push }
}

// ── Stat helpers ──────────────────────────────────────────────────────────────
function buildStats() {
  const settingMap: Record<string, number> = {}
  const specialtyMap: Record<string, number> = {}
  procedures.forEach((p) => {
    settingMap[p.setting]     = (settingMap[p.setting]     ?? 0) + 1
    specialtyMap[p.specialty] = (specialtyMap[p.specialty] ?? 0) + 1
  })
  return { settingMap, specialtyMap, total: procedures.length }
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter()
  const { toasts, push } = useToast()
  const [tab, setTab] = useState<Tab>("content")

  // Content state
  const [contentOverrides, setContentOverrides]   = useState<Record<string, string>>({})
  const [contentDrafts, setContentDrafts]         = useState<Record<string, string>>({})
  const [contentSaving, setContentSaving]         = useState<Record<string, boolean>>({})
  const [expandedPages, setExpandedPages]         = useState<Record<string, boolean>>({ Login: true })
  const [contentLoading, setContentLoading]       = useState(true)

  // Hospitals state
  const [fsHospitals, setFsHospitals]         = useState<FirestoreHospital[]>([])
  const [hospitalsLoading, setHospitalsLoading] = useState(false)
  const [newHospName, setNewHospName]           = useState("")
  const [newHospTrust, setNewHospTrust]         = useState("")
  const [hospAdding, setHospAdding]             = useState(false)

  // Surgeons state
  const [fsSurgeons, setFsSurgeons]           = useState<FirestoreSurgeon[]>([])
  const [surgeonsLoading, setSurgeonsLoading] = useState(false)

  // Images state
  const [imageUploading, setImageUploading] = useState<Record<string, boolean>>({})
  const [imageUrls, setImageUrls]           = useState<Record<string, string>>({})
  const fileRefs: Record<string, React.RefObject<HTMLInputElement | null>> = {
    disclaimer:    useRef<HTMLInputElement>(null),
    "logo-medaskca": useRef<HTMLInputElement>(null),
    "ps-mark":     useRef<HTMLInputElement>(null),
  }

  const uid = auth?.currentUser?.uid ?? "admin"

  // ── Load content overrides ────────────────────────────────────────────────
  useEffect(() => {
    setContentLoading(true)
    getAllAdminContent()
      .then((data) => {
        setContentOverrides(data)
        setContentDrafts(data)
      })
      .finally(() => setContentLoading(false))
  }, [])

  // ── Load hospitals ────────────────────────────────────────────────────────
  function loadHospitals() {
    setHospitalsLoading(true)
    getFirestoreHospitals()
      .then(setFsHospitals)
      .finally(() => setHospitalsLoading(false))
  }

  // ── Load surgeons ─────────────────────────────────────────────────────────
  function loadSurgeons() {
    setSurgeonsLoading(true)
    getFirestoreSurgeons()
      .then(setFsSurgeons)
      .finally(() => setSurgeonsLoading(false))
  }

  useEffect(() => {
    if (tab === "hospitals") loadHospitals()
    if (tab === "surgeons")  loadSurgeons()
  }, [tab])

  // ── Content actions ───────────────────────────────────────────────────────
  async function saveContent(key: string) {
    const value = contentDrafts[key]
    if (value === undefined) return
    setContentSaving((s) => ({ ...s, [key]: true }))
    try {
      await saveAdminContent(uid, key, value)
      setContentOverrides((o) => ({ ...o, [key]: value }))
      push("Saved")
    } catch {
      push("Save failed", "err")
    } finally {
      setContentSaving((s) => ({ ...s, [key]: false }))
    }
  }

  async function resetContent(key: string) {
    try {
      await deleteAdminContent(key)
      setContentOverrides((o) => { const n = { ...o }; delete n[key]; return n })
      setContentDrafts((d) => { const n = { ...d }; delete n[key]; return n })
      push("Reset to default")
    } catch {
      push("Reset failed", "err")
    }
  }

  // ── Hospital actions ──────────────────────────────────────────────────────
  async function addHospital() {
    if (!newHospName.trim()) return
    setHospAdding(true)
    try {
      await addFirestoreHospital(uid, newHospName.trim(), newHospTrust.trim() || undefined)
      setNewHospName("")
      setNewHospTrust("")
      push("Hospital added — pending approval")
      loadHospitals()
    } catch {
      push("Failed to add hospital", "err")
    } finally {
      setHospAdding(false)
    }
  }

  async function approveHospital(id: string) {
    await approveFirestoreHospital(uid, id)
    push("Hospital approved")
    loadHospitals()
  }

  async function deleteHospital(id: string) {
    await deleteFirestoreHospital(id)
    push("Hospital removed")
    loadHospitals()
  }

  // ── Surgeon actions ───────────────────────────────────────────────────────
  async function approveSurgeon(id: string) {
    await approveFirestoreSurgeon(uid, id)
    push("Surgeon approved")
    loadSurgeons()
  }

  async function deleteSurgeon(id: string) {
    await deleteFirestoreSurgeon(id)
    push("Surgeon removed")
    loadSurgeons()
  }

  // ── Image upload ──────────────────────────────────────────────────────────
  async function handleImageUpload(key: string, file: File) {
    if (!uploadToStorage) {
      push("Firebase Storage not configured", "err")
      return
    }
    setImageUploading((u) => ({ ...u, [key]: true }))
    try {
      const url = await uploadToStorage(file, `admin-images/${key}`)
      setImageUrls((u) => ({ ...u, [key]: url }))
      push("Image uploaded")
    } catch {
      push("Upload failed", "err")
    } finally {
      setImageUploading((u) => ({ ...u, [key]: false }))
    }
  }

  // ── Exit dev mode ─────────────────────────────────────────────────────────
  function exitDevMode() {
    clearAdminSession()
    router.replace("/")
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = buildStats()
  const grouped = groupedContent()

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">

      {/* Toast rack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium shadow-xl ${
              t.type === "ok"
                ? "bg-[#1a2a1a] border border-[#2a4a2a] text-[#4ade80]"
                : "bg-[#2a1a1a] border border-[#4a2a2a] text-[#f87171]"
            }`}
          >
            {t.type === "ok" ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#4DA3FF]/20 flex items-center justify-center">
            <span className="text-[10px] font-black text-[#4DA3FF]">PS</span>
          </div>
          <div>
            <p className="text-[10px] text-[#444] uppercase tracking-[0.2em]">PrepSight</p>
            <p className="text-sm font-bold text-white leading-none">Dev Mode</p>
          </div>
        </div>
        <button
          onClick={exitDevMode}
          className="flex items-center gap-2 text-xs text-[#555] hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[#222] hover:border-[#444]"
        >
          <LogOut size={13} />
          Exit dev mode
        </button>
      </header>

      {/* Tab bar */}
      <div className="border-b border-[#1a1a1a] px-6 flex gap-1 shrink-0 overflow-x-auto">
        {(
          [
            { id: "content",   label: "Content",   icon: FileText   },
            { id: "hospitals", label: "Hospitals",  icon: Hospital   },
            { id: "surgeons",  label: "Surgeons",   icon: BarChart2  },
            { id: "images",    label: "Images",     icon: ImageIcon  },
            { id: "stats",     label: "Data",       icon: BarChart2  },
          ] as { id: Tab; label: string; icon: React.ElementType }[]
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === id
                ? "border-[#4DA3FF] text-[#4DA3FF]"
                : "border-transparent text-[#555] hover:text-[#888]"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-3xl w-full mx-auto">

        {/* ── Content tab ────────────────────────────────────────────────── */}
        {tab === "content" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold">Page content</h2>
              {contentLoading && (
                <span className="text-xs text-[#555] flex items-center gap-1.5">
                  <RefreshCw size={12} className="animate-spin" /> Loading overrides…
                </span>
              )}
            </div>
            <p className="text-xs text-[#555] -mt-2 mb-4">
              Overrides are stored in Firestore and take precedence over the default values in code.
              Resetting reverts to the code default.
            </p>

            {Object.entries(grouped).map(([page, entries]) => (
              <ContentGroup
                key={page}
                page={page}
                entries={entries}
                drafts={contentDrafts}
                overrides={contentOverrides}
                saving={contentSaving}
                expanded={!!expandedPages[page]}
                onToggle={() => setExpandedPages((e) => ({ ...e, [page]: !e[page] }))}
                onChange={(key, val) => setContentDrafts((d) => ({ ...d, [key]: val }))}
                onSave={saveContent}
                onReset={resetContent}
              />
            ))}
          </div>
        )}

        {/* ── Hospitals tab ───────────────────────────────────────────────── */}
        {tab === "hospitals" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold mb-1">Hospitals</h2>
              <p className="text-xs text-[#555]">
                Seed hospitals come from <code className="text-[#4DA3FF]">hospitals.json</code> and are read-only.
                User-added hospitals below require approval before appearing in onboarding.
              </p>
            </div>

            {/* Add hospital */}
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-xs text-[#555] uppercase tracking-widest mb-4">Add hospital</p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newHospName}
                  onChange={(e) => setNewHospName(e.target.value)}
                  placeholder="Hospital name"
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#383838] focus:outline-none focus:border-[#4DA3FF] transition-colors"
                />
                <input
                  type="text"
                  value={newHospTrust}
                  onChange={(e) => setNewHospTrust(e.target.value)}
                  placeholder="Trust / health system (optional)"
                  className="w-full bg-[#181818] border border-[#282828] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-[#383838] focus:outline-none focus:border-[#4DA3FF] transition-colors"
                />
                <button
                  onClick={addHospital}
                  disabled={hospAdding || !newHospName.trim()}
                  className="flex items-center gap-2 bg-[#4DA3FF] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#2F8EF7] transition-colors disabled:opacity-40"
                >
                  {hospAdding ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  Add hospital
                </button>
              </div>
            </div>

            {/* Firestore hospitals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[#555] uppercase tracking-widest">User-added ({fsHospitals.length})</p>
                <button
                  onClick={loadHospitals}
                  className="text-xs text-[#555] hover:text-white transition-colors flex items-center gap-1"
                >
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
              {hospitalsLoading ? (
                <p className="text-sm text-[#444]">Loading…</p>
              ) : fsHospitals.length === 0 ? (
                <p className="text-sm text-[#444]">No user-added hospitals yet.</p>
              ) : (
                <div className="space-y-2">
                  {fsHospitals.map((h) => (
                    <div key={h.id} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{h.name}</p>
                        {h.trust && <p className="text-xs text-[#555] truncate">{h.trust}</p>}
                        <p className="text-[10px] text-[#333] mt-0.5">
                          Added {new Date(h.addedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          {h.approved ? " · Approved" : " · Pending"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!h.approved && (
                          <button
                            onClick={() => approveHospital(h.id)}
                            className="flex items-center gap-1 text-xs text-[#4ade80] border border-[#2a4a2a] px-2.5 py-1.5 rounded-lg hover:bg-[#1a2a1a] transition-colors"
                          >
                            <Check size={12} /> Approve
                          </button>
                        )}
                        <button
                          onClick={() => deleteHospital(h.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#555] hover:text-red-400 hover:bg-[#2a1a1a] transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Seed hospitals count */}
            <div className="text-xs text-[#333] border-t border-[#1a1a1a] pt-4">
              Seed: {(hospitalsSeed as { hospital: string }[]).length} hospitals loaded from hospitals.json
            </div>
          </div>
        )}

        {/* ── Surgeons tab ────────────────────────────────────────────────── */}
        {tab === "surgeons" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold mb-1">Surgeons</h2>
              <p className="text-xs text-[#555]">
                Surgeons are user-generated (Waze model). Review and approve submissions here.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-[#555] uppercase tracking-widest">Submissions ({fsSurgeons.length})</p>
              <button
                onClick={loadSurgeons}
                className="text-xs text-[#555] hover:text-white transition-colors flex items-center gap-1"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {surgeonsLoading ? (
              <p className="text-sm text-[#444]">Loading…</p>
            ) : fsSurgeons.length === 0 ? (
              <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-8 text-center">
                <p className="text-sm text-[#444]">No surgeon submissions yet.</p>
                <p className="text-xs text-[#333] mt-1">
                  Surgeons will appear here when users add them to procedure cards.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {fsSurgeons.map((s) => (
                  <div key={s.id} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#1a1a2a] flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-[#4DA3FF]">
                        {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{s.name}</p>
                      <p className="text-xs text-[#555]">{s.specialty}{s.grade ? ` · ${s.grade}` : ""}</p>
                      <p className="text-[10px] text-[#333] mt-0.5">
                        {s.approved ? "Approved" : "Pending"} ·{" "}
                        {new Date(s.addedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!s.approved && (
                        <button
                          onClick={() => approveSurgeon(s.id)}
                          className="flex items-center gap-1 text-xs text-[#4ade80] border border-[#2a4a2a] px-2.5 py-1.5 rounded-lg hover:bg-[#1a2a1a] transition-colors"
                        >
                          <Check size={12} /> Approve
                        </button>
                      )}
                      <button
                        onClick={() => deleteSurgeon(s.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#555] hover:text-red-400 hover:bg-[#2a1a1a] transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Images tab ──────────────────────────────────────────────────── */}
        {tab === "images" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold mb-1">Images</h2>
              <p className="text-xs text-[#555]">
                Upload replacement images to Firebase Storage.
                {!storage && (
                  <span className="text-amber-400"> Firebase Storage is not configured — uploads unavailable.</span>
                )}
              </p>
            </div>

            {(
              [
                { key: "disclaimer",     label: "Disclaimer image",      path: "/disclaimer.png",     note: "Shown on onboarding step 3" },
                { key: "logo-medaskca",  label: "MEDASKCA logo",         path: "/logo-medaskca.png",  note: "Shown on loading screen" },
                { key: "ps-mark",        label: "PrepSight mark",         path: "/ps-mark.png",        note: "Shown in mobile drawer header" },
              ] as { key: string; label: string; path: string; note: string }[]
            ).map(({ key, label, path, note }) => (
              <div key={key} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-xl bg-[#181818] border border-[#282828] flex items-center justify-center overflow-hidden shrink-0">
                    {imageUrls[key] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrls[key]} alt={label} className="w-full h-full object-contain" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={path} alt={label} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white mb-0.5">{label}</p>
                    <p className="text-xs text-[#555] mb-1">{note}</p>
                    <p className="text-[10px] text-[#333] font-mono">{path}</p>
                    {imageUrls[key] && (
                      <p className="text-[10px] text-[#4DA3FF] mt-1 truncate">Storage URL saved</p>
                    )}
                    <button
                      onClick={() => fileRefs[key]?.current?.click()}
                      disabled={!storage || imageUploading[key]}
                      className="mt-3 flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#282828] text-[#888] hover:text-white hover:border-[#444] transition-colors disabled:opacity-40"
                    >
                      {imageUploading[key]
                        ? <RefreshCw size={12} className="animate-spin" />
                        : <Upload size={12} />}
                      {imageUploading[key] ? "Uploading…" : "Upload replacement"}
                    </button>
                    <input
                      ref={fileRefs[key]}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(key, file)
                        e.target.value = ""
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Stats / Data tab ────────────────────────────────────────────── */}
        {tab === "stats" && (
          <div className="space-y-6">
            <h2 className="text-base font-bold">Data overview</h2>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Procedures",  value: stats.total },
                { label: "Settings",    value: Object.keys(stats.settingMap).length },
                { label: "Specialties", value: Object.keys(stats.specialtyMap).length },
                { label: "Seed hospitals", value: (hospitalsSeed as unknown[]).length },
                { label: "Content keys",   value: CONTENT_REGISTRY.length },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-4">
                  <p className="text-2xl font-black text-white">{value}</p>
                  <p className="text-xs text-[#555] mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Procedures by setting */}
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-xs text-[#555] uppercase tracking-widest mb-4">Procedures by setting</p>
              <div className="space-y-2">
                {Object.entries(stats.settingMap)
                  .sort(([, a], [, b]) => b - a)
                  .map(([setting, count]) => (
                    <div key={setting} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#888] truncate">{setting}</span>
                          <span className="text-xs text-white font-semibold ml-2 shrink-0">{count}</span>
                        </div>
                        <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4DA3FF] rounded-full"
                            style={{ width: `${(count / stats.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Procedures by specialty */}
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-xs text-[#555] uppercase tracking-widest mb-4">Procedures by specialty</p>
              <div className="space-y-2">
                {Object.entries(stats.specialtyMap)
                  .sort(([, a], [, b]) => b - a)
                  .map(([spec, count]) => (
                    <div key={spec} className="flex items-center justify-between py-1.5 border-b border-[#111] last:border-0">
                      <span className="text-xs text-[#888]">{spec}</span>
                      <span className="text-xs text-white font-semibold">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* All procedure IDs */}
            <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-5">
              <p className="text-xs text-[#555] uppercase tracking-widest mb-4">All procedures</p>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {procedures.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-[#333] shrink-0 w-48 truncate">{p.id}</span>
                    <span className="text-xs text-[#888] truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Content group sub-component ───────────────────────────────────────────────
interface ContentGroupProps {
  page:      string
  entries:   ContentEntry[]
  drafts:    Record<string, string>
  overrides: Record<string, string>
  saving:    Record<string, boolean>
  expanded:  boolean
  onToggle:  () => void
  onChange:  (key: string, val: string) => void
  onSave:    (key: string) => void
  onReset:   (key: string) => void
}

function ContentGroup({
  page, entries, drafts, overrides, saving, expanded, onToggle, onChange, onSave, onReset,
}: ContentGroupProps) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#111] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">{page}</span>
          <span className="text-xs text-[#555]">{entries.length} fields</span>
          {entries.some((e) => overrides[e.key] !== undefined) && (
            <span className="text-[10px] bg-[#4DA3FF]/20 text-[#4DA3FF] px-2 py-0.5 rounded-full">
              {entries.filter((e) => overrides[e.key] !== undefined).length} overridden
            </span>
          )}
        </div>
        {expanded ? <ChevronDown size={16} className="text-[#555]" /> : <ChevronRight size={16} className="text-[#555]" />}
      </button>

      {expanded && (
        <div className="border-t border-[#1a1a1a] divide-y divide-[#111]">
          {entries.map((entry) => {
            const isOverridden = overrides[entry.key] !== undefined
            const draft        = drafts[entry.key] ?? entry.defaultValue
            const isDirty      = draft !== (overrides[entry.key] ?? entry.defaultValue)

            return (
              <div key={entry.key} className="px-5 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-semibold text-[#888]">{entry.label}</p>
                    <p className="text-[10px] text-[#333] font-mono mt-0.5">{entry.key}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {isOverridden && (
                      <button
                        onClick={() => onReset(entry.key)}
                        className="text-[10px] text-[#555] hover:text-[#888] transition-colors"
                      >
                        Reset default
                      </button>
                    )}
                    <button
                      onClick={() => onSave(entry.key)}
                      disabled={saving[entry.key] || !isDirty}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#4DA3FF] text-white hover:bg-[#2F8EF7] transition-colors disabled:opacity-40"
                    >
                      {saving[entry.key]
                        ? <RefreshCw size={11} className="animate-spin" />
                        : <Save size={11} />}
                      Save
                    </button>
                  </div>
                </div>

                {entry.multiline ? (
                  <textarea
                    value={draft}
                    onChange={(e) => onChange(entry.key, e.target.value)}
                    rows={3}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-4 py-3 text-sm text-white resize-none focus:outline-none focus:border-[#4DA3FF] transition-colors leading-relaxed placeholder:text-[#333]"
                  />
                ) : (
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => onChange(entry.key, e.target.value)}
                    className="w-full bg-[#181818] border border-[#282828] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#4DA3FF] transition-colors placeholder:text-[#333]"
                  />
                )}

                {!isOverridden && (
                  <p className="mt-1.5 text-[10px] text-[#333]">Using code default</p>
                )}
                {isOverridden && !isDirty && (
                  <p className="mt-1.5 text-[10px] text-[#4DA3FF]">Overridden in Firestore</p>
                )}
                {isDirty && (
                  <p className="mt-1.5 text-[10px] text-amber-400">Unsaved changes</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
