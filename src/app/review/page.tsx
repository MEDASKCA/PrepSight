"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CircleAlert,
  Info,
  Package,
  PillBottle,
  ScanSearch,
  ShieldCheck,
  SquareStack,
  Tags,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react"
import liveMapping from "../../../data/systems/trauma_and_orthopaedics_full_live_mapping.json"
import {
  addSystemMappingRevision,
  FIXATION_LABELS,
  buildSystemMappingId,
  getReviewActor,
  getReviewerStatus,
  getSystemMappingReviewSnapshot,
  isTrustedReviewer,
  reviewSystemMapping,
  setReviewerStatus,
  setSystemFixationLabel,
  subscribeToSystemMappingReviews,
  voteOnSystemMapping,
  type FixationLabel,
  type MappingStatus,
  type ReviewerStatus,
} from "@/lib/system-mapping-review"
import { getProfile } from "@/lib/profile"
import type { PrepSightProfile } from "@/lib/types"

type ReviewTab = "systems" | "trays" | "implants" | "skus" | "cards"

const POSITIVE_FEEDBACK_OPTIONS = [
  "Commonly used for this branch",
  "Clinically appropriate",
  "Matches current practice",
  "Supported by supplier documentation",
  "Seen in real cases",
  "Other",
] as const

const NEGATIVE_FEEDBACK_OPTIONS = [
  "Wrong procedure match",
  "Wrong approach",
  "Wrong anatomy or joint",
  "Legacy system",
  "Duplicate mapping",
  "Site-specific only",
  "Needs evidence",
  "Other",
] as const

const IMPLANT_TYPE_OPTIONS = [...FIXATION_LABELS, "other"] as const

type LiveBranch = (typeof liveMapping)[number]
type LiveSystem = LiveBranch["subanatomy_groups"][number]["procedures"][number]["variants"][number]["systems"][number]

type ReviewRow = {
  mappingId: string
  specialty: string
  subspecialty: string
  anatomy: string
  subanatomyGroup: string
  procedureId: string
  procedure: string
  variantId: string
  variant: string
  systemId: string
  system: string
  supplier: string
  mappingStatus: MappingStatus
  fixationClass: string
  activeStatus: string
  reviewNotes: string
  approvedByAdmin: boolean
  upvotes: number
  downvotes: number
  confidencePercent: number
  latestDownvoteReason: string
  reviewCount: number
  revisionCount: number
  lastReviewedBy: string
  hasProof: boolean
}

const TABS: Array<{ id: ReviewTab; label: string; icon: typeof ShieldCheck }> = [
  { id: "systems", label: "Systems", icon: ShieldCheck },
  { id: "trays", label: "Trays", icon: Package },
  { id: "implants", label: "Implants", icon: PillBottle },
  { id: "skus", label: "SKUs", icon: Tags },
  { id: "cards", label: "Cards", icon: SquareStack },
]

function formatFixationLabel(value: string): string {
  return value.replaceAll("_", " ")
}

function normalizeMappingStatus(value: string | null | undefined): MappingStatus {
  if (value === "confirmed" || value === "rejected") return value
  return "review_required"
}

function InfoHint({ text }: { text: string }) {
  return (
    <button
      type="button"
      title={text}
      aria-label={text}
      className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#D8E3EE] bg-white text-[#64748B]"
    >
      <Info size={12} />
    </button>
  )
}

function buildRows(): ReviewRow[] {
  const snapshot = getSystemMappingReviewSnapshot()
  const rows: ReviewRow[] = []

  for (const branch of liveMapping as LiveBranch[]) {
    for (const subanatomy of branch.subanatomy_groups || []) {
      for (const procedure of subanatomy.procedures || []) {
        for (const variant of procedure.variants || []) {
          for (const system of variant.systems || []) {
            const mappingId = buildSystemMappingId(variant.variant_id, system.system_id)
            const stored = snapshot[mappingId]
            rows.push({
              mappingId,
              specialty: branch.specialty,
              subspecialty: branch.subspecialty,
              anatomy: branch.anatomy,
              subanatomyGroup: subanatomy.name,
              procedureId: procedure.procedure_id ?? "",
              procedure: procedure.procedure_name,
              variantId: variant.variant_id ?? "",
              variant: variant.variant_name,
              systemId: system.system_id ?? "",
              system: system.system_name,
              supplier: system.supplier_name,
              mappingStatus: normalizeMappingStatus(stored?.mapping_status ?? system.mapping_status),
              fixationClass: String(stored?.fixation_label ?? system.fixation_class ?? "unknown"),
              activeStatus: String(system.active_status ?? "active"),
              reviewNotes: String(stored?.review_notes ?? system.notes ?? ""),
              approvedByAdmin: Boolean(stored?.approved_by_admin ?? (system.mapping_status === "confirmed")),
              upvotes: Number(stored?.upvotes ?? 0),
              downvotes: Number(stored?.downvotes ?? 0),
              confidencePercent: Math.round(
                (Number(stored?.upvotes ?? 0) / Math.max(1, Number(stored?.upvotes ?? 0) + Number(stored?.downvotes ?? 0))) * 100,
              ),
              latestDownvoteReason:
                stored?.vote_history?.slice().reverse().find((entry) => entry.direction === "down" && entry.reason?.trim())?.reason ?? "",
              reviewCount: Number(stored?.review_history?.length ?? 0),
              revisionCount: Number(stored?.revision_history?.length ?? 0),
              lastReviewedBy:
                stored?.review_history?.slice().reverse()[0]?.actor ??
                stored?.vote_history?.slice().reverse()[0]?.actor ??
                stored?.suggested_by_users?.slice().reverse()[0] ??
                (stored?.approved_by_admin ? "Trusted reviewer" : ""),
              hasProof: Boolean(stored?.evidence_links?.length),
            })
          }
        }
      }
    }
  }

  return rows.sort((a, b) =>
    [
      a.subspecialty,
      a.anatomy,
      a.subanatomyGroup,
      a.procedure,
      a.variant,
      a.system,
    ]
      .join("|")
      .localeCompare(
        [
          b.subspecialty,
          b.anatomy,
          b.subanatomyGroup,
          b.procedure,
          b.variant,
          b.system,
        ].join("|"),
      ),
  )
}

function StatusPill({
  status,
  revisionCount,
  reviewCount,
}: {
  status: MappingStatus
  revisionCount: number
  reviewCount: number
}) {
  if (status === "confirmed") {
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">Confirmed</span>
  }

  if (status === "rejected") {
    return <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-rose-700">Rejected</span>
  }

  if (revisionCount > 0) {
    return <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-cyan-700">View Revisions</span>
  }

  if (reviewCount > 0) {
    return <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700">View Reviews</span>
  }

  return null
}

function rowMetaBarClass(status: MappingStatus, revisionCount: number, reviewCount: number): string {
  if (status === "confirmed") return "border-emerald-200 bg-emerald-50 text-emerald-800"
  if (status === "rejected") return "border-rose-200 bg-rose-50 text-rose-800"
  if (revisionCount > 0) return "border-cyan-200 bg-cyan-50 text-cyan-800"
  if (reviewCount > 0) return "border-sky-200 bg-sky-50 text-sky-800"
  return "border-amber-200 bg-amber-50 text-amber-800"
}

function rowContainerClass(status: MappingStatus, revisionCount: number, reviewCount: number): string {
  if (status === "confirmed") return "border-emerald-200 bg-emerald-50/45 hover:border-emerald-300"
  if (status === "rejected") return "border-rose-200 bg-rose-50/45 hover:border-rose-300"
  if (revisionCount > 0) return "border-cyan-200 bg-cyan-50/45 hover:border-cyan-300"
  if (reviewCount > 0) return "border-sky-200 bg-sky-50/45 hover:border-sky-300"
  return "border-amber-200 bg-amber-50/45 hover:border-amber-300"
}

export default function ReviewPage() {
  const [activeTab, setActiveTab] = useState<ReviewTab>("systems")
  const [rows, setRows] = useState<ReviewRow[]>([])
  const [statusFilter, setStatusFilter] = useState<"all" | MappingStatus>("review_required")
  const [query, setQuery] = useState("")
  const [profile, setProfile] = useState<PrepSightProfile | null>(null)
  const [reviewerName, setReviewerName] = useState("")
  const [reviewerStatus, setLocalReviewerStatus] = useState<ReviewerStatus>("active")
  const [selectedRow, setSelectedRow] = useState<ReviewRow | null>(null)
  const [voteDirection, setVoteDirection] = useState<"up" | "down">("up")
  const [voteReason, setVoteReason] = useState("")
  const [positiveReason, setPositiveReason] = useState<string>("Commonly used for this branch")
  const [negativeReason, setNegativeReason] = useState<string>("Wrong procedure match")
  const [customReason, setCustomReason] = useState("")
  const [reviewStatusInput, setReviewStatusInput] = useState<MappingStatus>("review_required")
  const [fixationInput, setFixationInput] = useState<FixationLabel>("unknown")
  const [customImplantType, setCustomImplantType] = useState("")
  const [reviewNotesInput, setReviewNotesInput] = useState("")
  const [variantValidation, setVariantValidation] = useState<"correct" | "incorrect">("correct")
  const [implantValidation, setImplantValidation] = useState<"correct" | "incorrect">("correct")
  const [correctedVariant, setCorrectedVariant] = useState("")

  useEffect(() => {
    const currentProfile = getProfile()
    const actor = getReviewActor(currentProfile)
    setProfile(currentProfile)
    setReviewerName(actor)
    setLocalReviewerStatus(getReviewerStatus(actor))
    setRows(buildRows())
    return subscribeToSystemMappingReviews(() => {
      const updatedProfile = getProfile()
      const actorName = getReviewActor(updatedProfile)
      setProfile(updatedProfile)
      setReviewerName(actorName)
      setLocalReviewerStatus(getReviewerStatus(actorName))
      const nextRows = buildRows()
      setRows(nextRows)
      setSelectedRow((current) => nextRows.find((row) => row.mappingId === current?.mappingId) ?? null)
    })
  }, [])

  const canModerate = isTrustedReviewer(profile)

  function handleVote(mappingId: string, direction: "up" | "down") {
    if (reviewerStatus === "banned") {
      if (typeof window !== "undefined") window.alert("Reviewer is banned from voting.")
      return
    }

    if (direction === "down") {
      const reason =
        typeof window !== "undefined"
          ? window.prompt("Reason for low confidence is required.")
          : null
      if (!reason?.trim()) return
      voteOnSystemMapping(mappingId, "down", { reason, actor: reviewerName })
      return
    }

    voteOnSystemMapping(mappingId, "up", { actor: reviewerName })
  }

  useEffect(() => {
    if (!selectedRow) return
    setVoteDirection("up")
    setVoteReason("")
    setPositiveReason("Commonly used for this branch")
    setNegativeReason("Wrong procedure match")
    setCustomReason("")
    setReviewStatusInput(selectedRow.mappingStatus)
    setFixationInput((selectedRow.fixationClass as FixationLabel) || "unknown")
    setCustomImplantType("")
    setReviewNotesInput(selectedRow.reviewNotes)
    setVariantValidation("correct")
    setImplantValidation("correct")
    setCorrectedVariant(selectedRow.variant)
  }, [selectedRow])

  function submitReviewForm() {
    if (!selectedRow) return

    const resolvedReason =
      voteDirection === "up"
        ? (positiveReason === "Other" ? customReason.trim() : positiveReason)
        : (negativeReason === "Other" ? customReason.trim() : negativeReason)

    if (voteDirection === "down") {
      if (!resolvedReason) {
        if (typeof window !== "undefined") window.alert("Reason for low confidence is required.")
        return
      }
      voteOnSystemMapping(selectedRow.mappingId, "down", {
        actor: reviewerName,
        reason: resolvedReason,
      })
    } else {
      if (!resolvedReason) {
        if (typeof window !== "undefined") window.alert("Reason for high confidence is required.")
        return
      }
      voteOnSystemMapping(selectedRow.mappingId, "up", { actor: reviewerName, reason: resolvedReason })
    }

    const implantTypeChanged =
      implantValidation === "incorrect" &&
      ((customImplantType.trim() && customImplantType.trim().toLowerCase() !== selectedRow.fixationClass.toLowerCase()) ||
        (!customImplantType.trim() && fixationInput !== selectedRow.fixationClass))

    const variantChanged =
      variantValidation === "incorrect" &&
      correctedVariant.trim() &&
      correctedVariant.trim() !== selectedRow.variant

    const notesChanged = reviewNotesInput.trim() !== selectedRow.reviewNotes.trim()
    const statusChanged = reviewStatusInput !== selectedRow.mappingStatus

    if (implantTypeChanged && !customImplantType.trim()) {
      setSystemFixationLabel(selectedRow.mappingId, fixationInput)
    }

    if (implantTypeChanged) {
      addSystemMappingRevision(
        selectedRow.mappingId,
        customImplantType.trim()
          ? `Suggested implant type: ${customImplantType.trim()}`
          : `Implant type changed to ${fixationInput.replaceAll("_", " ")}`,
        "fixation",
      )
    }

    if (variantChanged) {
      addSystemMappingRevision(
        selectedRow.mappingId,
        `Suggested procedure variant: ${correctedVariant.trim()}`,
        "suggestion",
      )
    }

    reviewSystemMapping(selectedRow.mappingId, {
      mapping_status: reviewStatusInput,
      review_notes: reviewNotesInput.trim(),
      approved_by_admin: canModerate ? reviewStatusInput === "confirmed" : undefined,
    })

    setSelectedRow(null)
  }

  function revertReviewForm() {
    if (!selectedRow) return
    setVoteDirection("up")
    setVoteReason("")
    setPositiveReason("Commonly used for this branch")
    setNegativeReason("Wrong procedure match")
    setCustomReason("")
    setReviewStatusInput(selectedRow.mappingStatus)
    setFixationInput((selectedRow.fixationClass as FixationLabel) || "unknown")
    setCustomImplantType("")
    setReviewNotesInput(selectedRow.reviewNotes)
    setVariantValidation("correct")
    setImplantValidation("correct")
    setCorrectedVariant(selectedRow.variant)
  }

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.mappingStatus !== statusFilter) return false
      if (!query.trim()) return true
      const text = `${row.subspecialty} ${row.anatomy} ${row.procedure} ${row.variant} ${row.system} ${row.supplier}`.toLowerCase()
      return text.includes(query.trim().toLowerCase())
    })
  }, [query, rows, statusFilter])

  const summary = useMemo(() => {
    const counts = {
      total: rows.length,
      confirmed: rows.filter((row) => row.mappingStatus === "confirmed").length,
      review: rows.filter((row) => row.mappingStatus === "review_required").length,
      rejected: rows.filter((row) => row.mappingStatus === "rejected").length,
    }
    return counts
  }, [rows])

  return (
    <main className="min-h-screen bg-[#F4F8FB] text-[#10243E]">
      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-8 lg:py-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-[16px] border border-[#D8E3EE] bg-white">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0891B2]">Data Review</p>
              <h1 className="text-[28px] font-semibold tracking-[-0.04em]">Systems Review</h1>
            </div>
          </div>
          <Link href="/admin" className="rounded-full bg-[#06B6D4] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
            Suppliers
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            {
              value: "all" as const,
              label: "Total",
              count: summary.total,
              icon: ScanSearch,
              activeClass: "border-[#10243E] bg-[#10243E] text-white",
              idleClass: "border-[#D8E3EE] bg-white text-[#475569]",
              labelClass: statusFilter === "all" ? "text-white/80" : "text-[#64748B]",
            },
            {
              value: "confirmed" as const,
              label: "Confirmed",
              count: summary.confirmed,
              icon: ThumbsUp,
              activeClass: "border-emerald-600 bg-emerald-600 text-white",
              idleClass: "border-emerald-200 bg-emerald-50 text-emerald-800",
              labelClass: "",
            },
            {
              value: "review_required" as const,
              label: "Review",
              count: summary.review,
              icon: CircleAlert,
              activeClass: "border-amber-500 bg-amber-500 text-white",
              idleClass: "border-amber-200 bg-amber-50 text-amber-800",
              labelClass: "",
            },
            {
              value: "rejected" as const,
              label: "Rejected",
              count: summary.rejected,
              icon: ThumbsDown,
              activeClass: "border-rose-600 bg-rose-600 text-white",
              idleClass: "border-rose-200 bg-rose-50 text-rose-800",
              labelClass: "",
            },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setStatusFilter(item.value)}
              className={`flex items-center justify-between rounded-[16px] border px-3 py-2.5 text-[13px] transition-colors ${
                statusFilter === item.value ? item.activeClass : item.idleClass
              }`}
            >
              <span className={`flex items-center gap-1.5 uppercase tracking-[0.12em] ${item.labelClass}`}>
                <item.icon size={14} />
                {item.label}
              </span>
              <span className="text-[14px] font-semibold">{item.count}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] ${
                  activeTab === tab.id ? "bg-[#06B6D4] text-white" : "border border-[#D8E3EE] bg-white text-[#475569]"
                }`}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px]">
          <span className="rounded-full border border-[#D8E3EE] bg-white px-3 py-1.5 text-[#334155]">
            Reviewer <span className="font-semibold">{reviewerName}</span>
          </span>
          <span
            className={`rounded-full px-3 py-1.5 font-semibold uppercase tracking-[0.08em] ${
              reviewerStatus === "banned"
                ? "bg-rose-100 text-rose-700"
                : reviewerStatus === "restricted"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {reviewerStatus}
          </span>
          {canModerate ? (
            <select
              value={reviewerStatus}
              onChange={(event) => {
                const nextStatus = event.target.value as ReviewerStatus
                setReviewerStatus(reviewerName, nextStatus)
                setLocalReviewerStatus(nextStatus)
              }}
              className="rounded-full border border-[#D8E3EE] bg-white px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#334155]"
            >
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
              <option value="banned">Banned</option>
            </select>
          ) : null}
        </div>

        {activeTab !== "systems" ? (
          <div className="mt-5 rounded-[26px] border border-[#D8E3EE] bg-white px-5 py-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0891B2]">{TABS.find((tab) => tab.id === activeTab)?.label}</p>
            <p className="mt-3 text-[15px] text-[#475569]">This review area is reserved and wired for the next product-depth pass.</p>
            <p className="mt-1 text-[14px] text-[#64748B]">Systems are live now. Trays, implants, SKUs, and cards will plug into this same workspace once their datasets are loaded.</p>
          </div>
        ) : (
          <div className="mt-5 rounded-[26px] border border-[#D8E3EE] bg-white p-4 lg:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search procedure, variant, system, supplier"
                className="w-full rounded-[16px] border border-[#D8E3EE] bg-[#F8FBFD] px-4 py-2.5 text-sm outline-none lg:max-w-md"
              />
            </div>

            <div className="mt-4 space-y-2">
              {filteredRows.map((row) => (
                <button
                  key={row.mappingId}
                  type="button"
                  onClick={() => setSelectedRow(row)}
                  className={`relative w-full rounded-[20px] border px-4 py-3 text-left transition-colors ${rowContainerClass(row.mappingStatus, row.revisionCount, row.reviewCount)}`}
                >
                  <div className="flex justify-end">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.08em]">
                      {row.confidencePercent}% confidence
                    </span>
                  </div>
                  <div className="pb-6">
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-[18px] font-semibold tracking-[-0.03em]">{row.system}</p>
                      <StatusPill status={row.mappingStatus} revisionCount={row.revisionCount} reviewCount={row.reviewCount} />
                    </div>
                    <div className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-semibold uppercase tracking-[0.08em] ${rowMetaBarClass(row.mappingStatus, row.revisionCount, row.reviewCount)}`}>
                      <span>Reviews {row.reviewCount}</span>
                      <span>Revisions {row.revisionCount}</span>
                      {row.hasProof ? <span>Proof</span> : null}
                      {row.lastReviewedBy ? <span>{row.lastReviewedBy}</span> : null}
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-4 flex items-center gap-x-3 gap-y-1 text-[13px] font-semibold uppercase tracking-[0.08em]">
                    <span className="inline-flex items-center gap-1">
                      <ThumbsUp size={13} />
                      {row.upvotes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <ThumbsDown size={13} />
                      {row.downvotes}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedRow ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0F172A]/40 p-3 lg:items-center">
          <div className="w-full max-w-2xl rounded-[28px] border border-[#D8E3EE] bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.22)] lg:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0891B2]">Data Review</p>
                <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.04em] text-[#10243E]">{selectedRow.system}</h2>
                <p className="mt-1 text-[15px] text-[#64748B]">{selectedRow.supplier}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                className="rounded-full border border-[#D8E3EE] bg-white px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#475569]"
              >
                Close
              </button>
            </div>


            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusPill status={selectedRow.mappingStatus} revisionCount={selectedRow.revisionCount} reviewCount={selectedRow.reviewCount} />
              <span className="rounded-full bg-[#EEF4F8] px-2.5 py-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#334155]">
                Poll {selectedRow.confidencePercent}%
              </span>
            </div>

            <div className="mt-4 space-y-2 text-[15px] leading-6 text-[#475569]">
              <p>
                <span className="font-semibold text-[#10243E]">Subspecialty:</span> {selectedRow.subspecialty}
              </p>
              <p>
                <span className="font-semibold text-[#10243E]">Anatomy:</span> {selectedRow.anatomy}
              </p>
              <p>
                <span className="font-semibold text-[#10243E]">Subclass:</span> {selectedRow.subanatomyGroup}
              </p>
              <p>
                <span className="font-semibold text-[#10243E]">Procedure name:</span> {selectedRow.procedure}
              </p>
              <p>
                <span className="font-semibold text-[#10243E]">Procedure variant:</span> {selectedRow.variant || "Not specified"}
              </p>
              <p>
                <span className="font-semibold text-[#10243E]">Implant type:</span>{" "}
                {selectedRow.fixationClass !== "unknown" ? formatFixationLabel(selectedRow.fixationClass) : "Not specified"}
              </p>
              {selectedRow.reviewNotes ? <p className="text-[#64748B]">{selectedRow.reviewNotes}</p> : null}
              {selectedRow.latestDownvoteReason ? <p className="text-amber-700">Latest concern: {selectedRow.latestDownvoteReason}</p> : null}
            </div>

            <div className="mt-5 rounded-[22px] border border-[#E2E8F0] bg-[#F8FBFD] p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    Confidence vote
                    <InfoHint text="Choose whether you feel confident or concerned about this system being listed under this procedure branch." />
                  </span>
                  <select
                    value={voteDirection}
                    onChange={(event) => setVoteDirection(event.target.value as "up" | "down")}
                    className="mt-1 w-full rounded-[14px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                  >
                    <option value="up">High confidence</option>
                    <option value="down">Low confidence</option>
                  </select>
                </label>

                <label className="block">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    Review outcome
                    <InfoHint text="Set the current outcome for this system: keep under review, confirm it, or reject it." />
                  </span>
                  <select
                    value={reviewStatusInput}
                    onChange={(event) => setReviewStatusInput(event.target.value as MappingStatus)}
                    className="mt-1 w-full rounded-[14px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                  >
                    <option value="review_required">Needs review</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    {voteDirection === "up" ? "Why it looks right" : "Reason for concern"}
                    <InfoHint
                      text={
                        voteDirection === "up"
                          ? "Choose the best reason why this mapping looks correct."
                          : "Choose the main reason why this mapping looks wrong or uncertain."
                      }
                    />
                  </span>
                  <select
                    value={voteDirection === "up" ? positiveReason : negativeReason}
                    onChange={(event) => {
                      setVoteReason(event.target.value)
                      if (voteDirection === "up") {
                        setPositiveReason(event.target.value)
                      } else {
                        setNegativeReason(event.target.value)
                      }
                    }}
                    className="mt-1 w-full rounded-[14px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                  >
                    {(voteDirection === "up" ? POSITIVE_FEEDBACK_OPTIONS : NEGATIVE_FEEDBACK_OPTIONS).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="block">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    Procedure variant looks correct?
                    <InfoHint text="If this variant is wrong, choose incorrect and enter the corrected variant." />
                  </span>
                  <div className="mt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVariantValidation("correct")
                        setCorrectedVariant(selectedRow.variant)
                      }}
                      className={variantValidation === "correct" ? "rounded-full bg-emerald-600 px-3 py-2 text-[14px] font-semibold text-white" : "rounded-full border border-[#D8E3EE] bg-white px-3 py-2 text-[14px] font-semibold text-[#475569]"}
                    >
                      Correct
                    </button>
                    <button
                      type="button"
                      onClick={() => setVariantValidation("incorrect")}
                      className={variantValidation === "incorrect" ? "rounded-full bg-amber-500 px-3 py-2 text-[14px] font-semibold text-white" : "rounded-full border border-[#D8E3EE] bg-white px-3 py-2 text-[14px] font-semibold text-[#475569]"}
                    >
                      Incorrect
                    </button>
                  </div>
                </div>

                <div className="block">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    Implant type looks correct?
                    <InfoHint text="If this implant type is wrong, choose incorrect and select the correct implant type." />
                  </span>
                  <div className="mt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImplantValidation("correct")
                        setCustomImplantType("")
                        setFixationInput((selectedRow.fixationClass as FixationLabel) || "unknown")
                      }}
                      className={implantValidation === "correct" ? "rounded-full bg-emerald-600 px-3 py-2 text-[14px] font-semibold text-white" : "rounded-full border border-[#D8E3EE] bg-white px-3 py-2 text-[14px] font-semibold text-[#475569]"}
                    >
                      Correct
                    </button>
                    <button
                      type="button"
                      onClick={() => setImplantValidation("incorrect")}
                      className={implantValidation === "incorrect" ? "rounded-full bg-amber-500 px-3 py-2 text-[14px] font-semibold text-white" : "rounded-full border border-[#D8E3EE] bg-white px-3 py-2 text-[14px] font-semibold text-[#475569]"}
                    >
                      Incorrect
                    </button>
                  </div>
                </div>
              </div>

              {variantValidation === "incorrect" ? (
                <label className="mt-4 block">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    What should the procedure variant be?
                    <InfoHint text="Enter the corrected procedure variant if the current one is wrong." />
                  </span>
                  <input
                    value={correctedVariant}
                    onChange={(event) => setCorrectedVariant(event.target.value)}
                    className="mt-1 w-full rounded-[14px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                  />
                </label>
              ) : null}

              {implantValidation === "incorrect" ? (
                <label className="mt-4 block">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    What should the implant type be?
                    <InfoHint text="Choose the corrected implant type for this mapping." />
                  </span>
                  <select
                    value={customImplantType ? "other" : fixationInput}
                    onChange={(event) => {
                      if (event.target.value === "other") {
                        setCustomImplantType(" ")
                        return
                      }
                      setCustomImplantType("")
                      setFixationInput(event.target.value as FixationLabel)
                    }}
                    className="mt-1 w-full rounded-[14px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                  >
                    {IMPLANT_TYPE_OPTIONS.map((label) => (
                      <option key={label} value={label}>
                        {label === "other" ? "Other" : formatFixationLabel(label)}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {implantValidation === "incorrect" && customImplantType !== "" ? (
                <label className="mt-4 block">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    What implant type should be added?
                    <InfoHint text="Use this when the implant type you need is not in the list." />
                  </span>
                  <input
                    value={customImplantType.trimStart()}
                    onChange={(event) => setCustomImplantType(event.target.value)}
                    className="mt-1 w-full rounded-[14px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                  />
                </label>
              ) : null}

              {((voteDirection === "up" && positiveReason === "Other") || (voteDirection === "down" && negativeReason === "Other")) ? (
                <label className="mt-4 block">
                  <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                    Add detail
                    <InfoHint text="Use this only when the standard feedback options do not fit." />
                  </span>
                  <input
                    value={customReason}
                    onChange={(event) => setCustomReason(event.target.value)}
                    className="mt-1 w-full rounded-[14px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                  />
                </label>
              ) : null}

              <label className="mt-4 block">
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                  Review notes
                  <InfoHint text="Add anything helpful for future reviewers, such as site-specific use, uncertainty, or context." />
                </span>
                <textarea
                  value={reviewNotesInput}
                  onChange={(event) => setReviewNotesInput(event.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                />
              </label>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={submitReviewForm}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#06B6D4] px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white"
                >
                  <Check size={13} />
                  Save Review
                </button>
                <button
                  type="button"
                  onClick={revertReviewForm}
                  className="inline-flex items-center gap-1 rounded-full bg-[#E6F9FD] px-3 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#0891B2]"
                >
                  Cancel changes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
