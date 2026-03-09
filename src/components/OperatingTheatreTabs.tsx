"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"
import { getAnatomyForServiceLine } from "@/lib/operating-theatre-taxonomy"

interface SpecialtyTab {
  name: string
  subspecialtyCount: number
  serviceLines: { id: string; name: string }[]
}

function formatSubspecialtyLabel(name: string): string {
  if (name.endsWith("General Surgery")) return name
  return name.endsWith(" Surgery") ? name.slice(0, -8) : name
}

export default function OperatingTheatreTabs({
  tabs = [],
  initialExpanded,
  selectedServiceLineId,
}: {
  tabs?: SpecialtyTab[]
  initialExpanded?: string
  selectedServiceLineId?: string
}) {
  const searchParams = useSearchParams()

  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(
    initialExpanded ?? null,
  )
  const [expandedServiceLine, setExpandedServiceLine] = useState<string | null>(
    selectedServiceLineId ?? null,
  )

  const sortedTabs = useMemo(() => tabs, [tabs])

  const currentSetting = searchParams.get("setting") ?? "Operating Theatre"
  const currentSpecialty = searchParams.get("specialty") ?? initialExpanded ?? ""
  const currentAnatomy = searchParams.get("anatomy")

  function buildHref(params: Record<string, string | null | undefined>) {
    const next = new URLSearchParams(searchParams.toString())

    Object.entries(params).forEach(([key, value]) => {
      if (!value) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })

    return `/?${next.toString()}`
  }

  function toggleSpecialty(name: string) {
    setExpandedSpecialty((prev) => (prev === name ? null : name))
    setExpandedServiceLine(null)
  }

  function toggleServiceLine(serviceLineId: string) {
    setExpandedServiceLine((prev) =>
      prev === serviceLineId ? null : serviceLineId,
    )
  }

  return (
    <div className="space-y-2">
      {sortedTabs.map((tab) => {
        const isOpen = expandedSpecialty === tab.name

        return (
          <div
            key={tab.name}
            className="overflow-hidden rounded-xl border border-[#D5DCE3] bg-white shadow-sm"
          >
            <button
              onClick={() => toggleSpecialty(tab.name)}
              className="flex w-full items-center gap-3 bg-[#4DA3FF] px-4 py-3.5 text-left text-sm font-semibold text-white transition-colors hover:bg-[#2F8EF7]"
            >
              <span className="min-w-0 flex-1 whitespace-normal break-words leading-snug">
                {tab.name}
              </span>

              <span className="min-w-[6rem] shrink-0 text-right text-xs tabular-nums text-white/80">
                {tab.subspecialtyCount}{" "}
                {tab.subspecialtyCount === 1 ? "subspecialty" : "subspecialties"}
              </span>

              {isOpen ? (
                <ChevronUp size={16} className="shrink-0 text-white/80" />
              ) : (
                <ChevronDown size={16} className="shrink-0 text-white/80" />
              )}
            </button>

            {isOpen && (
              <div className="divide-y divide-[#E6EEF7]">
                {tab.serviceLines.map((line) => {
                  const isSelectedLine = expandedServiceLine === line.id
                  const anatomyNodes = getAnatomyForServiceLine(line.id)

                  return (
                    <div key={line.id} className="bg-white">
                      <button
                        type="button"
                        onClick={() => toggleServiceLine(line.id)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#134E4A] transition-colors"
                        style={{
                          backgroundColor: "#C7ECE8",
                        }}
                      >
                        <span className="min-w-0 flex-1 text-left whitespace-normal break-words leading-snug font-medium">
                          {formatSubspecialtyLabel(line.name)}
                        </span>

                        {isSelectedLine ? (
                          <ChevronDown
                            size={14}
                            className="shrink-0 text-[#0F766E]"
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                            className="shrink-0 text-[#0F766E]"
                          />
                        )}
                      </button>

                      {isSelectedLine && (
                        <div className="border-t border-[#E6EEF7] bg-white">
                          {anatomyNodes.length > 0 ? (
                            <div className="divide-y divide-[#DCEAF8]">
                              {anatomyNodes.map((node) => {
                                const isActiveAnatomy = currentAnatomy === node.id

                                return (
                                  <Link
                                    key={node.id}
                                    href={buildHref({
                                      setting: currentSetting,
                                      specialty: currentSpecialty || tab.name,
                                      service_line: line.id,
                                      anatomy: node.id,
                                    })}
                                    className={`flex w-full items-center gap-2 px-6 py-2.5 text-sm transition-colors ${
                                      isActiveAnatomy
                                        ? "bg-[#E7F2FF] font-semibold text-[#1E3A5F]"
                                        : "text-[#334155] hover:bg-[#F8FBFF]"
                                    }`}
                                  >
                                    <span className="min-w-0 flex-1 whitespace-normal break-words leading-snug">
                                      {node.name}
                                    </span>

                                    <ChevronRight
                                      size={14}
                                      className={`shrink-0 ${
                                        isActiveAnatomy
                                          ? "text-[#64748b]"
                                          : "text-[#94a3b8]"
                                      }`}
                                    />
                                  </Link>
                                )
                              })}
                            </div>
                          ) : (
                            <p className="px-6 py-3 text-sm text-[#94a3b8]">
                              No anatomy nodes mapped for this subspecialty yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                {tab.serviceLines.length === 0 && (
                  <p className="px-4 py-3 text-sm text-[#94a3b8]">
                    No service lines yet.
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
