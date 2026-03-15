"use client"

import { useState, useMemo } from "react"
import { Check, ChevronDown, ChevronRight, Minus, Plus, AlertTriangle, RotateCcw } from "lucide-react"
import { getStockForSystem, getStockStatus, StockItem, StockStatus } from "@/lib/stockroom-data"
import { db } from "@/lib/firebase"
import { doc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore"
import { getProfile } from "@/lib/profile"

interface CheckRow {
  id: string
  physicalQty: number
  verified: boolean
}

interface SubmitResult {
  by: string
  at: string
  verifiedCount: number
  adjustedCount: number
  total: number
}

interface Props {
  implantSystem: string
  procedureId: string
  procedureName: string
  uid: string | null
}

function statusBadge(s: StockStatus) {
  if (s === "Out")      return <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-red-100 text-red-700">Out</span>
  if (s === "Critical") return <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-red-50 text-red-600">Critical</span>
  if (s === "Low")      return <span className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700">Low</span>
  return null
}

function worstGroupStatus(items: StockItem[], checks: CheckRow[]): StockStatus {
  const statuses = items.map((item) => {
    const c = checks.find((r) => r.id === item.id)
    return getStockStatus(c ? c.physicalQty : item.qty, item.par)
  })
  if (statuses.includes("Out"))      return "Out"
  if (statuses.includes("Critical")) return "Critical"
  if (statuses.includes("Low"))      return "Low"
  return "OK"
}

function formatName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length < 2) return parts[0]
  return `${parts[0][0]}. ${parts[parts.length - 1]}`
}

export default function ImplantCheckPanel({ implantSystem, procedureId, procedureName, uid }: Props) {
  const stockItems = useMemo(() => getStockForSystem(implantSystem), [implantSystem])

  const [expanded, setExpanded] = useState(false)
  const [checks, setChecks] = useState<CheckRow[]>(() =>
    stockItems.map((item) => ({ id: item.id, physicalQty: item.qty, verified: false })),
  )
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)

  // Derive unique groups in order
  const groups = useMemo(() => {
    const seen = new Set<string>()
    const out: string[] = []
    for (const item of stockItems) {
      if (item.group && !seen.has(item.group)) {
        seen.add(item.group)
        out.push(item.group)
      }
    }
    return out
  }, [stockItems])

  const verifiedCount = checks.filter((c) => c.verified).length
  const adjustedCount = checks.filter((c) => {
    const item = stockItems.find((i) => i.id === c.id)
    return item && c.physicalQty !== item.qty
  }).length

  function getCheck(id: string): CheckRow {
    return checks.find((c) => c.id === id)!
  }

  function toggleVerified(id: string) {
    setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c)))
  }

  function adjustQty(id: string, delta: number) {
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, physicalQty: Math.max(0, c.physicalQty + delta) } : c)),
    )
  }

  function resetCheck() {
    setResult(null)
    setChecks(stockItems.map((item) => ({ id: item.id, physicalQty: item.qty, verified: false })))
  }

  async function handleSubmit() {
    setSubmitting(true)
    const profile = getProfile()
    const by = profile?.name ? formatName(profile.name) : "Unknown"
    const now = new Date()
    const at = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) +
      " · " + now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

    try {
      if (db) {
        // 1. Write audit doc
        await addDoc(collection(db, "implant_checks"), {
          procedureId,
          procedureName,
          implantSystem,
          uid,
          submittedBy: by,
          submittedAt: serverTimestamp(),
          items: checks.map((c) => {
            const item = stockItems.find((i) => i.id === c.id)!
            return {
              id: c.id,
              sku: item.sku,
              label: `${item.group ?? ""} — ${item.name}`,
              verified: c.verified,
              stockQty: item.qty,
              physicalQty: c.physicalQty,
              adjusted: c.physicalQty !== item.qty,
            }
          }),
        })

        // 2. Update stockroom for any qty discrepancies
        const changed = checks.filter((c) => {
          const item = stockItems.find((i) => i.id === c.id)!
          return c.physicalQty !== item.qty
        })
        for (const c of changed) {
          const item = stockItems.find((i) => i.id === c.id)!
          await setDoc(
            doc(db, "stockroom_items", item.sku),
            { qty: c.physicalQty, lastEdit: { by, uid, updatedAt: serverTimestamp() } },
            { merge: true },
          )
        }
      }

      setResult({ by, at, verifiedCount, adjustedCount, total: checks.length })
      setExpanded(false)
    } catch (err) {
      console.warn("[PrepSight] Implant check save failed", err)
    } finally {
      setSubmitting(false)
    }
  }

  if (stockItems.length === 0) {
    return (
      <div className="mb-3 rounded-xl border border-[#D5DCE3] px-4 py-3 lg:border-white/10">
        <p className="text-xs font-semibold text-[#3F4752] lg:text-white">Implant stock check</p>
        <p className="mt-1 text-xs text-[#94a3b8] lg:text-white/40">
          Stockroom not yet mapped for <span className="font-medium">{implantSystem}</span> — verify implant availability manually before knife-to-skin.
        </p>
      </div>
    )
  }

  // ── Submitted state ───────────────────────────────────────────────────────
  if (result) {
    return (
      <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 lg:border-emerald-500/20 lg:bg-emerald-500/10">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Check size={14} className="text-emerald-600 shrink-0 lg:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 lg:text-emerald-300">
                Implant check submitted
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 lg:text-emerald-400">
              By {result.by} · {result.at}
            </p>
            <p className="text-[11px] text-emerald-600 lg:text-emerald-400">
              {result.verifiedCount}/{result.total} items verified
              {result.adjustedCount > 0 && ` · ${result.adjustedCount} qty updated in stockroom`}
            </p>
          </div>
          <button
            onClick={resetCheck}
            className="flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-800 shrink-0 lg:text-emerald-400"
          >
            <RotateCcw size={11} /> Redo
          </button>
        </div>
      </div>
    )
  }

  // ── Checklist ─────────────────────────────────────────────────────────────
  const hasIssues = checks.some((c) => {
    const item = stockItems.find((i) => i.id === c.id)!
    const s = getStockStatus(c.physicalQty, item.par)
    return s === "Out" || s === "Critical"
  })

  return (
    <div className="mb-3 rounded-xl border border-[#D5DCE3] overflow-hidden lg:border-white/10">

      {/* Collapsed header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#f8fafc] text-left lg:bg-white/5"
      >
        <div className="flex items-center gap-2 min-w-0">
          {expanded ? <ChevronDown size={14} className="shrink-0 text-[#64748b]" /> : <ChevronRight size={14} className="shrink-0 text-[#64748b]" />}
          <span className="text-sm font-semibold text-[#3F4752] lg:text-white">Implant stock check</span>
          {hasIssues && !expanded && (
            <AlertTriangle size={13} className="text-amber-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {verifiedCount > 0 && (
            <span className="text-[11px] text-[#64748b] lg:text-white/50">
              {verifiedCount}/{checks.length}
            </span>
          )}
          <span className="text-[11px] text-[#94a3b8] lg:text-white/38">
            {groups.length} group{groups.length !== 1 ? "s" : ""} · {stockItems.length} items
          </span>
        </div>
      </button>

      {/* Expanded checklist */}
      {expanded && (
        <>
          {groups.map((group) => {
            const groupItems = stockItems.filter((i) => i.group === group)
            const worst = worstGroupStatus(groupItems, checks)
            const allGroupVerified = groupItems.every((i) => getCheck(i.id).verified)

            return (
              <div key={group} className="border-t border-[#D5DCE3] lg:border-white/10">
                {/* Group header */}
                <div className="flex items-center justify-between gap-2 px-4 py-2 bg-[#f0f4f8] lg:bg-white/4">
                  <div className="flex items-center gap-1.5">
                    {allGroupVerified && (
                      <Check size={12} className="text-emerald-500 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-[#526579] lg:text-white/60">{group}</span>
                  </div>
                  {statusBadge(worst)}
                </div>

                {/* Item rows */}
                {groupItems.map((item) => {
                  const c = getCheck(item.id)
                  const s = getStockStatus(c.physicalQty, item.par)
                  const changed = c.physicalQty !== item.qty

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3 border-t border-[#D5DCE3]/60 lg:border-white/6"
                    >
                      {/* Verify checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleVerified(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          c.verified
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-[#D5DCE3] hover:border-[#94a3b8] lg:border-white/20"
                        }`}
                      >
                        {c.verified && <Check size={10} className="text-white" />}
                      </button>

                      {/* Name + location */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#3F4752] lg:text-white leading-snug">{item.name}</p>
                        <p className="text-[11px] text-[#94a3b8] mt-0.5 lg:text-white/38 truncate">{item.location}</p>
                      </div>

                      {/* Status + qty controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        {statusBadge(s)}
                        {changed && (
                          <span className="text-[10px] text-amber-600 font-medium">was {item.qty}</span>
                        )}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => adjustQty(item.id, -1)}
                            disabled={c.physicalQty === 0}
                            className="w-6 h-6 rounded-md border border-[#D5DCE3] flex items-center justify-center text-[#526579] hover:bg-[#f0f4f8] disabled:opacity-30 transition-colors lg:border-white/10 lg:text-white/50"
                          >
                            <Minus size={10} />
                          </button>
                          <span className={`w-6 text-center text-sm font-semibold tabular-nums ${
                            s === "Out" ? "text-red-600" : s === "Critical" ? "text-red-500" : s === "Low" ? "text-amber-600" : "text-[#3F4752] lg:text-white"
                          }`}>
                            {c.physicalQty}
                          </span>
                          <button
                            type="button"
                            onClick={() => adjustQty(item.id, 1)}
                            className="w-6 h-6 rounded-md border border-[#D5DCE3] flex items-center justify-center text-[#526579] hover:bg-[#f0f4f8] transition-colors lg:border-white/10 lg:text-white/50"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* Submit bar */}
          <div className="border-t border-[#D5DCE3] px-4 py-3 flex items-center justify-between gap-3 bg-[#f8fafc] lg:border-white/10 lg:bg-white/5">
            <p className="text-xs text-[#64748b] lg:text-white/50">
              {verifiedCount === checks.length
                ? "All items verified"
                : `${verifiedCount} of ${checks.length} verified`}
              {adjustedCount > 0 && ` · ${adjustedCount} qty to update`}
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || verifiedCount === 0}
              className="rounded-lg bg-[#4DA3FF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2F8EF7] disabled:opacity-40 transition-colors shrink-0"
            >
              {submitting ? "Saving…" : "Submit check"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
