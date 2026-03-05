"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"
import { getAnatomyForServiceLine } from "@/lib/operating-theatre-taxonomy"

interface SpecialtyTab {
  name: string
  subspecialtyCount: number
  serviceLines: { id: string; name: string }[]
}

interface Props {
  tabs: SpecialtyTab[]
  initialExpanded?: string
  selectedServiceLineId?: string
}

function formatSubspecialtyLabel(name: string): string {
  if (name.endsWith("General Surgery")) return name
  return name.endsWith(" Surgery") ? name.slice(0, -8) : name
}

export default function OperatingTheatreTabs({ tabs, initialExpanded, selectedServiceLineId }: Props) {
  const [expanded, setExpanded] = useState<string | null>(initialExpanded ?? null)
  const [selectedLineId, setSelectedLineId] = useState<string | null>(selectedServiceLineId ?? null)

  const sortedTabs = useMemo(() => tabs, [tabs])

  useEffect(() => {
    setExpanded(initialExpanded ?? null)
  }, [initialExpanded])
  useEffect(() => {
    setSelectedLineId(selectedServiceLineId ?? null)
  }, [selectedServiceLineId])

  function toggleServiceLine(serviceLineId: string) {
    setSelectedLineId((prev) => (prev === serviceLineId ? null : serviceLineId))
  }

  return (
    <div className="space-y-2">
      {sortedTabs.map((tab) => {
        const isOpen = expanded === tab.name
        return (
          <div key={tab.name} className="bg-white border border-[#D5DCE3] rounded-xl overflow-hidden shadow-sm">
            <button
              onClick={() => setExpanded(isOpen ? null : tab.name)}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#4DA3FF] hover:bg-[#2F8EF7] transition-colors text-white text-sm font-semibold text-left"
            >
              <span className="flex-1 min-w-0 whitespace-normal break-words leading-snug">{tab.name}</span>
              <span className="text-xs text-white/80 tabular-nums text-right min-w-[6rem] shrink-0">
                {tab.subspecialtyCount} {tab.subspecialtyCount === 1 ? "subspecialty" : "subspecialties"}
              </span>
              {isOpen ? (
                <ChevronUp size={16} className="shrink-0 text-white/80" />
              ) : (
                <ChevronDown size={16} className="shrink-0 text-white/80" />
              )}
            </button>

            {isOpen && (
              <div className="divide-y divide-[#E6EEF7]">
                {tab.serviceLines.map((line) => (
                  <div key={line.id} className="bg-[#F8FBFF]">
                    <button
                      type="button"
                      onClick={() => toggleServiceLine(line.id)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors ${
                        selectedLineId === line.id
                          ? "bg-[#DCEEFF] text-[#1E3A5F] font-semibold"
                          : "text-[#334155] hover:bg-[#EEF6FF]"
                      }`}
                    >
                      <span className="flex-1 min-w-0 whitespace-normal break-words leading-snug">
                        {formatSubspecialtyLabel(line.name)}
                      </span>
                      {selectedLineId === line.id ? (
                        <ChevronDown size={14} className="shrink-0 text-[#64748b]" />
                      ) : (
                        <ChevronRight size={14} className="shrink-0 text-[#94a3b8]" />
                      )}
                    </button>
                    {selectedLineId === line.id && (
                      <div className="px-4 pb-3 space-y-2 bg-[#EEF6FF] border-t border-[#D5E6F8]">
                        {getAnatomyForServiceLine(line.id).map((node) => (
                          <div
                            key={node.id}
                            className="bg-white border border-[#D5DCE3] rounded-lg overflow-hidden"
                          >
                            <div className="w-full flex items-center gap-3 px-3 py-2.5 bg-[#4DA3FF] text-white font-semibold text-sm">
                              <span className="flex-1 min-w-0 whitespace-normal break-words leading-snug">{node.name}</span>
                              <span className="text-[11px] text-white/80">Anatomy</span>
                            </div>
                          </div>
                        ))}
                        {getAnatomyForServiceLine(line.id).length === 0 && (
                          <p className="bg-white rounded-lg border border-[#D5DCE3] px-3 py-2 text-sm text-[#94a3b8]">
                            No anatomy nodes mapped for this subspecialty yet.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {tab.serviceLines.length === 0 && (
                  <p className="px-4 py-3 text-sm text-[#94a3b8]">No service lines yet.</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
