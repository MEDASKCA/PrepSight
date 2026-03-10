"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, FolderOpen } from "lucide-react"
import { getAnatomyForServiceLine } from "@/lib/operating-theatre-taxonomy"

interface SpecialtyTab {
  name: string
  subspecialtyCount: number
  serviceLines: { id: string; name: string }[]
  palette?: {
    header: string
    hover: string
    soft: string
    softBorder: string
    softText: string
  }
}

function formatSubspecialtyLabel(name: string): string {
  if (name.endsWith("General Surgery")) return name
  return name.endsWith(" Surgery") ? name.slice(0, -8) : name
}

function AnatomyOutline({ name, color }: { name: string; color: string }) {
  const key = name.toLowerCase()

  if (key.includes("hip") || key.includes("acetabul")) {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
        <path d="M28 18c3 9 3 19-2 27l-5 9c-3 5-1 11 5 14" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M52 18c-3 9-3 19 2 27l5 9c3 5 1 11-5 14" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="28" cy="56" r="7" stroke={color} strokeWidth="3" />
        <circle cx="52" cy="56" r="7" stroke={color} strokeWidth="3" />
        <path d="M34 33h12" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  if (key.includes("knee") || key.includes("patella")) {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
        <path d="M34 14v22c0 5 5 9 11 9h4" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M46 66V44c0-5-5-9-11-9h-4" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="40" r="8" stroke={color} strokeWidth="3" />
      </svg>
    )
  }

  if (key.includes("shoulder")) {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
        <path d="M16 48c7-15 16-24 24-24s17 9 24 24" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M28 24l10 11" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M52 24L42 35" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  if (key.includes("elbow")) {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
        <path d="M24 18v18c0 7 5 12 12 12h10" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M56 62V44c0-7-5-12-12-12H34" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <circle cx="40" cy="40" r="7" stroke={color} strokeWidth="3" />
      </svg>
    )
  }

  if (key.includes("ankle") || key.includes("foot")) {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
        <path d="M34 16v26l18 13c5 3 5 9 0 12H29" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M34 42l-9 18" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  if (key.includes("wrist") || key.includes("hand")) {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
        <path d="M26 54V30m8 24V26m8 28V28m8 26V34" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M24 54c0 8 7 12 16 12s16-4 16-12" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  if (key.includes("pelvis") || key.includes("femur")) {
    return (
      <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
        <path d="M26 20c4 8 4 18 0 26m28-26c-4 8-4 18 0 26" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M26 46c4 8 8 14 14 18m14-18c-4 8-8 14-14 18" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <path d="M32 32h16" stroke={color} strokeWidth="3" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
      <path d="M20 56c6-20 15-32 20-32s14 12 20 32" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <circle cx="40" cy="24" r="8" stroke={color} strokeWidth="3" />
    </svg>
  )
}

export default function OperatingTheatreTabs({
  tabs = [],
  initialExpanded,
  selectedServiceLineId,
  specialtyFirst = false,
}: {
  tabs?: SpecialtyTab[]
  initialExpanded?: string
  selectedServiceLineId?: string
  specialtyFirst?: boolean
}) {
  const searchParams = useSearchParams()

  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(
    initialExpanded ?? null,
  )
  const [expandedServiceLine, setExpandedServiceLine] = useState<string | null>(
    selectedServiceLineId ?? null,
  )

  const sortedTabs = useMemo(() => tabs, [tabs])
  const defaultDesktopServiceLine = selectedServiceLineId ?? sortedTabs[0]?.serviceLines[0]?.id ?? null

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
    setExpandedServiceLine((prev) => (prev === serviceLineId ? null : serviceLineId))
  }

  return (
    <div className="space-y-2 lg:space-y-6">
      {sortedTabs.map((tab) => {
        const isOpen = specialtyFirst || expandedSpecialty === tab.name
        const palette = tab.palette ?? {
          header: "#4DA3FF",
          hover: "#2F8EF7",
          soft: "#C7ECE8",
          softBorder: "#99D8D1",
          softText: "#134E4A",
        }
        const activeDesktopServiceLine = expandedServiceLine ?? defaultDesktopServiceLine
        const activeDesktopIndex = tab.serviceLines.findIndex(
          (serviceLine) => serviceLine.id === activeDesktopServiceLine,
        )

        return (
          <div
            key={tab.name}
            className="overflow-hidden rounded-xl border border-[#D5DCE3] bg-white shadow-sm lg:rounded-[36px] lg:border-[#14304B] lg:bg-[#08131F] lg:shadow-[0_30px_70px_rgba(15,23,42,0.26)]"
          >
            {specialtyFirst ? null : (
              <button
                onClick={() => toggleSpecialty(tab.name)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-semibold text-white transition-colors lg:px-8 lg:py-8 lg:text-[42px] lg:font-semibold lg:tracking-[-0.06em]"
                style={{ backgroundColor: palette.header }}
                onMouseEnter={(event) => {
                  ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = palette.hover
                }}
                onMouseLeave={(event) => {
                  ;(event.currentTarget as HTMLButtonElement).style.backgroundColor = palette.header
                }}
              >
                <span className="min-w-0 flex-1 whitespace-normal break-words leading-snug">
                  {tab.name}
                </span>
                {isOpen ? (
                  <ChevronUp size={16} className="shrink-0 text-white/80 lg:hidden" />
                ) : (
                  <ChevronDown size={16} className="shrink-0 text-white/80 lg:hidden" />
                )}
              </button>
            )}

            {isOpen && (
              <div className="divide-y divide-[#E6EEF7] lg:divide-y-0 lg:bg-[#08131F] lg:p-6">
                {specialtyFirst && (
                  <div className="hidden lg:block">
                    <div className="mb-5 flex items-end justify-between gap-6">
                      <div>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-white/40">
                          Subspecialties
                        </p>
                        <p className="mt-2 text-[18px] leading-8 text-white/62">
                          Slide through the subspecialty rail and open anatomy files below.
                        </p>
                      </div>
                      <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">
                        {tab.serviceLines.length} folders
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[40px] border border-white/8 bg-[#0B1724] px-10 py-10">
                      <button
                        type="button"
                        onClick={() => {
                          const nextIndex =
                            activeDesktopIndex <= 0 ? tab.serviceLines.length - 1 : activeDesktopIndex - 1
                          setExpandedServiceLine(tab.serviceLines[nextIndex]?.id ?? defaultDesktopServiceLine)
                        }}
                        className="absolute left-6 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/76 transition hover:bg-white/14"
                        aria-label="Previous subspecialty"
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const nextIndex =
                            activeDesktopIndex === -1 || activeDesktopIndex >= tab.serviceLines.length - 1
                              ? 0
                              : activeDesktopIndex + 1
                          setExpandedServiceLine(tab.serviceLines[nextIndex]?.id ?? defaultDesktopServiceLine)
                        }}
                        className="absolute right-6 top-1/2 z-30 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/76 transition hover:bg-white/14"
                        aria-label="Next subspecialty"
                      >
                        <ChevronRight size={24} />
                      </button>

                      <div className="relative flex h-[400px] items-center justify-center" style={{ perspective: "2600px" }}>
                        {tab.serviceLines.map((line, index) => {
                          const anatomyNodes = getAnatomyForServiceLine(line.id)
                          const isActiveLine = activeDesktopServiceLine === line.id
                          const rawOffset =
                            activeDesktopIndex === -1
                              ? 0
                              : index - activeDesktopIndex
                          const wrappedOffset =
                            rawOffset > tab.serviceLines.length / 2
                              ? rawOffset - tab.serviceLines.length
                              : rawOffset < -tab.serviceLines.length / 2
                                ? rawOffset + tab.serviceLines.length
                                : rawOffset
                          const absOffset = Math.abs(wrappedOffset)

                          if (absOffset > 2) {
                            return null
                          }

                          const translateXMap: Record<number, string> = {
                            0: "0px",
                            1: "470px",
                            2: "880px",
                            [-1]: "-470px",
                            [-2]: "-880px",
                          }
                          const rotateYMap: Record<number, string> = {
                            0: "0deg",
                            1: "-52deg",
                            2: "-78deg",
                            [-1]: "52deg",
                            [-2]: "78deg",
                          }
                          const scaleMap: Record<number, number> = {
                            0: 3,
                            1: 0.9,
                            2: 0.8,
                            [-1]: 0.9,
                            [-2]: 0.8,
                          }
                          const opacityMap: Record<number, number> = {
                            0: 1,
                            1: 1,
                            2: 1,
                            [-1]: 1,
                            [-2]: 1,
                          }
                          const depthMap: Record<number, string> = {
                            0: "0px",
                            1: "-40px",
                            2: "-100px",
                            [-1]: "-40px",
                            [-2]: "-100px",
                          }
                          const zIndexMap: Record<number, number> = {
                            0: 30,
                            1: 20,
                            2: 10,
                            [-1]: 20,
                            [-2]: 10,
                          }

                          return (
                            <button
                              key={`desktop-line-${line.id}`}
                              type="button"
                              onClick={() => setExpandedServiceLine(line.id)}
                              className="group absolute left-1/2 top-1/2 w-[420px] -translate-y-1/2 overflow-visible text-left transition-all duration-500"
                              style={{
                                transform: `translate(-50%, -50%) translateX(${translateXMap[wrappedOffset]}) translateZ(${depthMap[wrappedOffset]}) rotateY(${rotateYMap[wrappedOffset]}) scale(${scaleMap[wrappedOffset]})`,
                                transformStyle: "preserve-3d",
                                boxShadow: isActiveLine
                                  ? `0 40px 70px ${palette.header}42`
                                  : "0 24px 44px rgba(15,23,42,0.18)",
                                opacity: opacityMap[wrappedOffset],
                                zIndex: zIndexMap[wrappedOffset],
                              }}
                            >
                              <div
                                className="absolute inset-y-5 -left-4 w-5 rounded-l-[18px]"
                                style={{
                                  backgroundColor: isActiveLine ? palette.hover : "#10243E",
                                  transform: "rotateY(90deg) translateZ(2px)",
                                  transformOrigin: "left center",
                                }}
                              />
                              <div
                                className="absolute inset-y-5 -right-4 w-5 rounded-r-[18px]"
                                style={{
                                  backgroundColor: isActiveLine ? palette.hover : "#10243E",
                                  transform: "rotateY(-90deg) translateZ(2px)",
                                  transformOrigin: "right center",
                                }}
                              />
                              <div
                                className="relative overflow-hidden rounded-[36px] border px-8 py-8"
                                style={{
                                  background: isActiveLine
                                    ? `linear-gradient(145deg, ${palette.header} 0%, ${palette.hover} 100%)`
                                    : "linear-gradient(145deg, #1A2B3D 0%, #102030 100%)",
                                  borderColor: isActiveLine ? `${palette.softBorder}99` : "rgba(255,255,255,0.14)",
                                }}
                              >
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0))]" />
                                <div className="relative">
                                <div className="flex items-start justify-between gap-4">
                                  <div
                                    className="flex h-16 w-16 items-center justify-center rounded-[22px]"
                                    style={{
                                      backgroundColor: isActiveLine ? "rgba(255,255,255,0.16)" : palette.soft,
                                      color: isActiveLine ? "white" : palette.softText,
                                    }}
                                  >
                                    <FolderOpen size={24} />
                                  </div>
                                  <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                                    isActiveLine ? "border border-white/16 bg-white/10 text-white/76" : ""
                                  }`}
                                  style={
                                    isActiveLine
                                      ? undefined
                                      : { backgroundColor: palette.soft, color: palette.softText }
                                  }>
                                    {anatomyNodes.length} anatomy
                                  </span>
                                </div>
                                <p className={`mt-7 font-semibold leading-[1.02] tracking-[-0.05em] text-white ${
                                  isActiveLine ? "text-[40px]" : "text-[32px]"
                                }`}>
                                  {formatSubspecialtyLabel(line.name)}
                                </p>
                                <p className={`mt-3 text-sm leading-7 ${isActiveLine ? "text-white/76" : "text-white/50"}`}>
                                  Select this folder to browse its anatomy files.
                                </p>
                              </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {tab.serviceLines.map((line) => {
                  const mobileOpen = expandedServiceLine === line.id
                  const isSelectedLine = specialtyFirst
                    ? (expandedServiceLine ?? defaultDesktopServiceLine) === line.id
                    : mobileOpen
                  const anatomyNodes = getAnatomyForServiceLine(line.id)

                  return (
                    <div key={line.id} className={`bg-white lg:bg-transparent ${specialtyFirst ? "hidden lg:block" : ""} ${specialtyFirst && !isSelectedLine ? "lg:hidden" : ""}`}>
                      {specialtyFirst ? (
                        <div className="hidden lg:block">
                          <div className="mb-4 flex items-end justify-between gap-6">
                            <div className="flex items-center gap-4">
                              <div
                                className="flex h-14 w-14 items-center justify-center rounded-[20px]"
                                style={{ backgroundColor: palette.soft, color: palette.softText }}
                              >
                                <FolderOpen size={24} />
                              </div>
                              <div>
                                <p className="text-[38px] font-semibold tracking-[-0.06em] text-white">
                                  {formatSubspecialtyLabel(line.name)}
                                </p>
                                <p className="mt-1 text-sm text-white/58">
                                  Anatomy files within this subspecialty.
                                </p>
                              </div>
                            </div>
                            <span
                              className="rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                              style={{ backgroundColor: palette.soft, color: palette.softText }}
                            >
                              {anatomyNodes.length} anatomy
                            </span>
                          </div>

                          <div
                            className="rounded-[34px] border p-5"
                            style={{ borderColor: `${palette.softBorder}88`, backgroundColor: "rgba(255,255,255,0.03)" }}
                          >
                            {anatomyNodes.length > 0 ? (
                              <div className={`grid gap-4 ${anatomyNodes.length >= 4 ? "grid-cols-4" : anatomyNodes.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
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
                                      className={`group min-h-[250px] rounded-[28px] px-6 py-6 transition-transform hover:-translate-y-1 ${
                                        isActiveAnatomy ? "ring-2 ring-white/32" : ""
                                      }`}
                                      style={{
                                        background: isActiveAnatomy
                                          ? `linear-gradient(155deg, ${palette.soft} 0%, ${palette.softBorder} 100%)`
                                          : `linear-gradient(155deg, ${palette.soft}E6 0%, ${palette.softBorder}CC 100%)`,
                                        color: palette.softText,
                                        boxShadow: "0 24px 52px rgba(15,23,42,0.22)",
                                      }}
                                    >
                                      <div className="flex h-full flex-col justify-between">
                                        <AnatomyOutline name={node.name} color={palette.softText} />
                                        <div>
                                          <p className="text-[30px] font-semibold leading-[1.02] tracking-[-0.05em]">
                                            {node.name}
                                          </p>
                                          <p className="mt-3 text-sm leading-7 opacity-76">
                                            Open the procedure files for this anatomy.
                                          </p>
                                        </div>
                                      </div>
                                    </Link>
                                  )
                                })}
                              </div>
                            ) : (
                              <p className="px-2 py-6 text-base text-white/48">
                                No anatomy nodes mapped for this subspecialty yet.
                              </p>
                            )}
                          </div>
                        </div>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => toggleServiceLine(line.id)}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-colors lg:hidden"
                        style={{
                          backgroundColor: palette.soft,
                          color: palette.softText,
                          borderLeft: `4px solid ${palette.softBorder}`,
                        }}
                      >
                        <span className="min-w-0 flex-1 text-left whitespace-normal break-words leading-snug font-medium">
                          {formatSubspecialtyLabel(line.name)}
                        </span>

                        {mobileOpen ? (
                          <ChevronDown size={14} className="shrink-0" style={{ color: palette.softText }} />
                        ) : (
                          <ChevronRight size={14} className="shrink-0" style={{ color: palette.softText }} />
                        )}
                      </button>

                      {!specialtyFirst && isSelectedLine && (
                        <div className="border-t border-[#E6EEF7] bg-white lg:hidden">
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
                                    style={{
                                      backgroundColor: isActiveAnatomy ? "#E7F2FF" : undefined,
                                    }}
                                  >
                                    <span className="min-w-0 flex-1 whitespace-normal break-words leading-snug">
                                      {node.name}
                                    </span>
                                    <ChevronRight
                                      size={14}
                                      className={`shrink-0 ${isActiveAnatomy ? "text-[#64748b]" : "text-[#94a3b8]"}`}
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
