"use client"

import { useEffect, useState, useTransition } from "react"
import { CheckSquare, ClipboardCheck, Loader2 } from "lucide-react"
import { onAuthChange } from "@/lib/auth"
import { getCardChecklist, saveCardChecklist } from "@/lib/firestore"
import type { ChecklistEntry, Section } from "@/lib/types"

interface Props {
  cardKey: string
  sections: Section[]
}

function nowIso() {
  return new Date().toISOString()
}

function buildDefaultEntries(sections: Section[]): ChecklistEntry[] {
  return sections
    .filter((section) => section.contentMode === "fixed")
    .flatMap((section) =>
      section.items.map((item) => ({
        catalogueItemId: item.catalogueItemId,
        itemName: item.name,
        sectionType: section.sectionType,
        requiredQty: item.defaultQty ?? 1,
        checkedQty: 0,
        checked: false,
        note: "",
        updatedAt: nowIso(),
      })),
    )
}

function sectionLabel(sectionType: ChecklistEntry["sectionType"]) {
  return sectionType
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function ChecklistPanel({ cardKey, sections }: Props) {
  const [uid, setUid] = useState<string | null>(null)
  const [entries, setEntries] = useState<ChecklistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => onAuthChange((user) => setUid(user?.uid ?? null)), [])

  useEffect(() => {
    let cancelled = false
    const defaults = buildDefaultEntries(sections)

    async function load() {
      if (!uid) {
        if (!cancelled) {
          setEntries(defaults)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      const remote = await getCardChecklist(uid, cardKey)
      if (cancelled) return
      setEntries(remote.length > 0 ? remote : defaults)
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [cardKey, sections, uid])

  function persist(nextEntries: ChecklistEntry[]) {
    setEntries(nextEntries)
    if (!uid) return
    startTransition(() => {
      void saveCardChecklist(uid, cardKey, nextEntries)
    })
  }

  function toggleEntry(index: number) {
    const nextEntries = entries.map((entry, idx) =>
      idx === index
        ? {
            ...entry,
            checked: !entry.checked,
            checkedQty: !entry.checked ? entry.requiredQty ?? 1 : 0,
            updatedAt: nowIso(),
            updatedBy: uid ?? undefined,
          }
        : entry,
    )
    persist(nextEntries)
  }

  const completed = entries.filter((entry) => entry.checked).length

  if (entries.length === 0) {
    return null
  }

  return (
    <section className="mb-4 rounded-2xl border border-[#D5DCE3] bg-white shadow-sm lg:mb-6 lg:rounded-[30px] lg:border-[#14304B] lg:bg-[#08131F] lg:shadow-[0_28px_64px_rgba(15,23,42,0.24)]">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#E7F1FB] px-4 py-3 lg:border-white/10 lg:bg-[#0B1C2B] lg:px-7 lg:py-5">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={18} className="text-[#1E293B] lg:text-[#7DD3FC]" />
          <div>
            <h2 className="text-sm font-bold text-[#1E293B] lg:text-[24px] lg:font-semibold lg:tracking-[-0.04em] lg:text-white">Case Prep Checklist</h2>
            <p className="text-xs text-slate-500 lg:text-sm lg:text-white/52">
              Supplier-fixed items for this card
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 lg:text-sm lg:text-white/56">
          {loading || isPending ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <CheckSquare size={14} className="text-emerald-600" />
          )}
          <span>
            {completed}/{entries.length} checked
          </span>
        </div>
      </div>

      <div className="divide-y divide-[#EEF2F6] lg:divide-white/8">
        {entries.map((entry, index) => (
          <label
            key={`${entry.sectionType}-${entry.itemName}-${index}`}
            className="flex cursor-pointer items-start gap-3 px-4 py-3 lg:px-7 lg:py-5"
          >
            <input
              type="checkbox"
              checked={entry.checked}
              onChange={() => toggleEntry(index)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-[#4DA3FF] focus:ring-[#4DA3FF]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800 lg:text-[22px] lg:font-semibold lg:tracking-[-0.03em] lg:text-white">{entry.itemName}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-slate-500 lg:mt-2 lg:text-sm lg:text-white/56">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 lg:border lg:border-white/10 lg:bg-white/8 lg:text-white/66">
                  {sectionLabel(entry.sectionType)}
                </span>
                <span>Qty: {entry.requiredQty ?? 1}</span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </section>
  )
}
