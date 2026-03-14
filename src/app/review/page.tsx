"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
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
  buildSystemMappingId,
  getReviewActor,
  getReviewerStatus,
  getSystemMappingHistory,
  getSystemMappingReviewSnapshot,
  isTrustedReviewer,
  reviewSystemMapping,
  setReviewerStatus,
  subscribeToSystemMappingReviews,
  voteOnSystemMapping,
  type MappingStatus,
  type ReviewerStatus,
} from "@/lib/system-mapping-review"
import { getProfile } from "@/lib/profile"
import type { PrepSightProfile } from "@/lib/types"

type ReviewTab = "systems" | "trays" | "implants" | "skus" | "cards"

const INCORRECT_REASON_OPTIONS = [
  { value: "procedure_mapping", label: "Procedure mapping" },
  { value: "implant_type", label: "Implant type" },
  { value: "missing_information", label: "Missing information" },
  { value: "other", label: "Other" },
] as const

type ReviewableSectionKey = "systems" | "trays" | "skus"
type SectionAnswer = "" | "correct" | "incorrect" | "not_sure"
type SectionIssue = (typeof INCORRECT_REASON_OPTIONS)[number]["value"] | ""
type ImproveMode = "" | "flag_only" | "suggest_correction" | "add_missing"

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

function ReviewSection({
  title,
  subtitle,
  status,
  open,
  onToggle,
  children,
}: {
  title: string
  subtitle?: string
  status?: "Unverified" | "Reviewed" | "Needs review"
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  const statusClass =
    status === "Reviewed"
      ? "bg-emerald-500/18 text-white"
      : status === "Needs review"
        ? "bg-rose-500/18 text-white"
        : "bg-white/18 text-white"

  return (
    <div className="kardex-section mt-4 overflow-hidden rounded-xl border border-[#D5DCE3] bg-white lg:rounded-[30px] lg:border-[#14304B] lg:bg-[#08131F] lg:shadow-[0_28px_64px_rgba(15,23,42,0.24)]">
      <div className="kardex-section-header flex items-center bg-[#4DA3FF] transition-colors">
        <button
          type="button"
          onClick={onToggle}
          className="flex-1 px-4 py-3.5 text-left text-base font-semibold text-white transition-colors hover:bg-[#2F8EF7] lg:px-7 lg:py-6 lg:text-[30px] lg:font-semibold lg:tracking-[-0.05em]"
        >
          <span className="block">{title}</span>
          {subtitle ? <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-white/78 lg:text-[13px]">{subtitle}</span> : null}
        </button>

        {status ? (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide lg:px-4 lg:py-1.5 lg:text-[11px] ${statusClass}`}>
            {status}
          </span>
        ) : null}

        <button
          type="button"
          onClick={onToggle}
          className="px-4 py-3.5 text-white transition-colors hover:bg-[#2F8EF7] lg:px-6"
        >
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      {open ? <div className="kardex-section-body px-4 py-2 lg:px-7 lg:py-6 lg:text-white/78">{children}</div> : null}
    </div>
  )
}

function ValidationChoices({
  value,
  onChange,
}: {
  value: SectionAnswer
  onChange: (value: SectionAnswer) => void
}) {
  return (
    <div className="grid gap-3">
      {[
        { value: "correct" as const, label: "Correct", active: "border-emerald-500 bg-emerald-50 text-emerald-800" },
        { value: "incorrect" as const, label: "Incorrect", active: "border-rose-500 bg-rose-50 text-rose-800" },
        { value: "not_sure" as const, label: "Not sure", active: "border-amber-500 bg-amber-50 text-amber-800" },
      ].map((option) => (
        <label
          key={option.value}
          className={`flex min-h-[56px] items-center gap-3 rounded-[18px] border px-4 py-3 text-[16px] font-medium ${
            value === option.value ? option.active : "border-[#D8E3EE] bg-white text-[#334155]"
          }`}
        >
          <input
            type="radio"
            name={`section_answer_${option.value}`}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="h-4 w-4 border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
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
  const [sectionReviews, setSectionReviews] = useState<Record<
    ReviewableSectionKey,
    {
      answer: SectionAnswer
      issue: SectionIssue
      note: string
      improveMode: ImproveMode
      procedureVariant: string
      implantType: string
      sourceRationale: string
      trayName: string
      trayCategory: string
      traySupplier: string
      skuCode: string
      productName: string
      skuCategory: string
    }
  >>({
    systems: {
      answer: "",
      issue: "",
      note: "",
      improveMode: "",
      procedureVariant: "",
      implantType: "",
      sourceRationale: "",
      trayName: "",
      trayCategory: "",
      traySupplier: "",
      skuCode: "",
      productName: "",
      skuCategory: "",
    },
    trays: {
      answer: "",
      issue: "",
      note: "",
      improveMode: "",
      procedureVariant: "",
      implantType: "",
      sourceRationale: "",
      trayName: "",
      trayCategory: "",
      traySupplier: "",
      skuCode: "",
      productName: "",
      skuCategory: "",
    },
    skus: {
      answer: "",
      issue: "",
      note: "",
      improveMode: "",
      procedureVariant: "",
      implantType: "",
      sourceRationale: "",
      trayName: "",
      trayCategory: "",
      traySupplier: "",
      skuCode: "",
      productName: "",
      skuCategory: "",
    },
  })
  const [openSections, setOpenSections] = useState({
    systems: true,
    trays: false,
    skus: false,
    cards: false,
    reviews: false,
    revisions: false,
  })

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
    setOpenSections({
      systems: true,
      trays: false,
      skus: false,
      cards: false,
      reviews: false,
      revisions: false,
    })
    setSectionReviews({
      systems: {
        answer:
          selectedRow.mappingStatus === "confirmed"
            ? "correct"
            : selectedRow.mappingStatus === "rejected"
              ? "incorrect"
              : "",
        issue: "",
        note: selectedRow.reviewNotes,
        improveMode: "",
        procedureVariant: selectedRow.variant || "",
        implantType: selectedRow.fixationClass !== "unknown" ? formatFixationLabel(selectedRow.fixationClass) : "",
        sourceRationale: "",
        trayName: "",
        trayCategory: "",
        traySupplier: selectedRow.supplier,
        skuCode: "",
        productName: "",
        skuCategory: "",
      },
      trays: {
        answer: "",
        issue: "",
        note: "",
        improveMode: "",
        procedureVariant: "",
        implantType: "",
        sourceRationale: "",
        trayName: "",
        trayCategory: "",
        traySupplier: selectedRow.supplier,
        skuCode: "",
        productName: "",
        skuCategory: "",
      },
      skus: {
        answer: "",
        issue: "",
        note: "",
        improveMode: "",
        procedureVariant: "",
        implantType: "",
        sourceRationale: "",
        trayName: "",
        trayCategory: "",
        traySupplier: selectedRow.supplier,
        skuCode: "",
        productName: "",
        skuCategory: "",
      },
    })
  }, [selectedRow])

  function setSectionReviewValue(
    section: ReviewableSectionKey,
    updates: Partial<{
      answer: SectionAnswer
      issue: SectionIssue
      note: string
      improveMode: ImproveMode
      procedureVariant: string
      implantType: string
      sourceRationale: string
      trayName: string
      trayCategory: string
      traySupplier: string
      skuCode: string
      productName: string
      skuCategory: string
    }>,
  ) {
    setSectionReviews((current) => ({
      ...current,
      [section]: {
        ...current[section],
        ...updates,
      },
    }))
  }

  function saveSectionReview(section: ReviewableSectionKey) {
    if (!selectedRow) return
    const current = sectionReviews[section]

    if (current.answer === "incorrect" && !current.issue) {
      if (typeof window !== "undefined") window.alert("Choose what is wrong before saving.")
      return
    }

    const issueLabel = INCORRECT_REASON_OPTIONS.find((option) => option.value === current.issue)?.label ?? "Other"

    if (section === "systems" && current.answer === "correct") {
      voteOnSystemMapping(selectedRow.mappingId, "up", {
        actor: reviewerName,
        reason: "Systems section marked correct",
      })
      reviewSystemMapping(selectedRow.mappingId, {
        mapping_status: "confirmed",
        review_notes: current.note.trim(),
        approved_by_admin: canModerate ? true : undefined,
      })
      return
    }

    if (current.answer === "incorrect") {
      voteOnSystemMapping(selectedRow.mappingId, "down", {
        actor: reviewerName,
        reason: `${section}: ${issueLabel}`,
      })

      if (current.improveMode === "suggest_correction") {
        const summary =
          section === "systems"
            ? `Proposed correction for Systems: variant ${current.procedureVariant || "n/a"}, implant type ${current.implantType || "n/a"}${current.sourceRationale ? `. ${current.sourceRationale}` : ""}${current.note.trim() ? `. ${current.note.trim()}` : ""}`
            : section === "trays"
              ? `Proposed correction for Trays: ${current.trayName || "n/a"}${current.trayCategory ? `, ${current.trayCategory}` : ""}${current.traySupplier ? `, ${current.traySupplier}` : ""}${current.note.trim() ? `. ${current.note.trim()}` : ""}`
              : `Proposed correction for SKUs: ${current.skuCode || "n/a"}${current.productName ? `, ${current.productName}` : ""}${current.skuCategory ? `, ${current.skuCategory}` : ""}${current.note.trim() ? `. ${current.note.trim()}` : ""}`
        addSystemMappingRevision(selectedRow.mappingId, summary, "suggestion")
      } else if (current.improveMode === "add_missing") {
        const summary =
          section === "systems"
            ? `Proposed addition for Systems: variant ${current.procedureVariant || "n/a"}, implant type ${current.implantType || "n/a"}${current.sourceRationale ? `. ${current.sourceRationale}` : ""}${current.note.trim() ? `. ${current.note.trim()}` : ""}`
            : section === "trays"
              ? `Proposed addition for Trays: ${current.trayName || "n/a"}${current.trayCategory ? `, ${current.trayCategory}` : ""}${current.traySupplier ? `, ${current.traySupplier}` : ""}${current.note.trim() ? `. ${current.note.trim()}` : ""}`
              : `Proposed addition for SKUs: ${current.skuCode || "n/a"}${current.productName ? `, ${current.productName}` : ""}${current.skuCategory ? `, ${current.skuCategory}` : ""}${current.note.trim() ? `. ${current.note.trim()}` : ""}`
        addSystemMappingRevision(selectedRow.mappingId, summary, "suggestion")
      } else {
        addSystemMappingRevision(
          selectedRow.mappingId,
          current.note.trim() ? `${section}: flagged as incorrect (${issueLabel}). ${current.note.trim()}` : `${section}: flagged as incorrect (${issueLabel})`,
          "suggestion",
        )
      }
    }

    if (section !== "systems" && current.answer === "correct") {
      addSystemMappingRevision(
        selectedRow.mappingId,
        `${section}: marked correct`,
        "suggestion",
      )
    }

    if (section === "systems") {
      reviewSystemMapping(selectedRow.mappingId, {
        mapping_status: current.answer === "correct" ? "confirmed" : "review_required",
        review_notes: current.note.trim(),
        approved_by_admin: canModerate && current.answer === "correct" ? true : undefined,
      })
    }
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

  const selectedHistory = useMemo(() => {
    if (!selectedRow) {
      return { reviewHistory: [], revisionHistory: [] }
    }
    return getSystemMappingHistory(selectedRow.mappingId)
  }, [selectedRow, rows])

  const validationSummary = useMemo(() => {
    const reviewableSections: ReviewableSectionKey[] = ["systems", "trays", "skus"]
    const reviewedCount = reviewableSections.filter((section) => sectionReviews[section].answer !== "").length
    const correctCount = reviewableSections.filter((section) => sectionReviews[section].answer === "correct").length
    const incorrectCount = reviewableSections.filter((section) => sectionReviews[section].answer === "incorrect").length

    let label = "Unverified"
    if (incorrectCount > 0) {
      label = "Needs review"
    } else if (correctCount === 3) {
      label = "Validated"
    } else if (reviewedCount > 0) {
      label = "Partially validated"
    }

    return { label, reviewedCount, correctCount, incorrectCount }
  }, [sectionReviews])

  const sectionStatus = useMemo(() => {
    const toStatus = (answer: SectionAnswer): "Unverified" | "Reviewed" | "Needs review" => {
      if (answer === "") return "Unverified"
      if (answer === "incorrect") return "Needs review"
      return "Reviewed"
    }

    return {
      systems: toStatus(sectionReviews.systems.answer),
      trays: toStatus(sectionReviews.trays.answer),
      skus: toStatus(sectionReviews.skus.answer),
    }
  }, [sectionReviews])

  function toggleSection(section: keyof typeof openSections) {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }))
  }

  return (
    <main className="min-h-screen bg-[#F4F8FB] text-[#10243E]">
      <div className="mx-auto max-w-7xl px-4 pb-5 pt-[calc(env(safe-area-inset-top)+1.5rem)] lg:px-8 lg:pb-8 lg:pt-8">
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F4F8FB] text-[#10243E]">
          <div className="mx-auto min-h-screen w-full max-w-4xl">
            <div className="sticky top-0 z-10 border-b border-[#D8E3EE] bg-white/95 backdrop-blur">
              <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+12px)] lg:px-6 lg:pb-5 lg:pt-5">
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
            </div>

            <div className="px-4 py-4 lg:px-6 lg:py-6">
            <div className="rounded-[20px] border border-[#D8E3EE] bg-white px-4 py-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0891B2]">Record validation</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {validationSummary.label === "Validated" ? (
                    <Check size={16} className="text-emerald-600" />
                  ) : validationSummary.label === "Needs review" ? (
                    <CircleAlert size={16} className="text-rose-600" />
                  ) : validationSummary.label === "Partially validated" ? (
                    <ScanSearch size={16} className="text-sky-600" />
                  ) : (
                    <CircleAlert size={16} className="text-amber-600" />
                  )}
                  <p className="text-[22px] font-semibold tracking-[-0.03em] text-[#10243E]">{validationSummary.label}</p>
                </div>
                <StatusPill status={selectedRow.mappingStatus} revisionCount={selectedRow.revisionCount} reviewCount={selectedRow.reviewCount} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-[#64748B]">
                <span>{validationSummary.reviewedCount} of 3 sections reviewed</span>
                <span className="text-[#CBD5E1]">•</span>
                <span>{validationSummary.correctCount} correct</span>
                {validationSummary.incorrectCount > 0 ? (
                  <>
                    <span className="text-[#CBD5E1]">•</span>
                    <span>{validationSummary.incorrectCount} need review</span>
                  </>
                ) : null}
              </div>
            </div>

            <ReviewSection
              title="Systems"
              subtitle="Linked system data"
              status={sectionStatus.systems}
              open={openSections.systems}
              onToggle={() => toggleSection("systems")}
            >
              <div className="rounded-[18px] border border-[#D8E3EE] bg-white px-4 py-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0891B2]">Currently held</p>
                <div className="mt-3 space-y-2 text-[15px] leading-6 text-[#475569]">
                  <p>
                    <span className="font-semibold text-[#10243E]">Supplier:</span> {selectedRow.supplier}
                  </p>
                  <p>
                    <span className="font-semibold text-[#10243E]">Portfolio / item name:</span> {selectedRow.system}
                  </p>
                  <p>
                    <span className="font-semibold text-[#10243E]">Procedure variant:</span> {selectedRow.variant || "Not specified"}
                  </p>
                  <p>
                    <span className="font-semibold text-[#10243E]">Implant type:</span>{" "}
                    {selectedRow.fixationClass !== "unknown" ? formatFixationLabel(selectedRow.fixationClass) : "Not specified"}
                  </p>
                  {selectedRow.reviewNotes ? (
                    <p>
                      <span className="font-semibold text-[#10243E]">Note / source context:</span> {selectedRow.reviewNotes}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-[17px] font-semibold text-[#10243E]">Is this section correct?</p>
                </div>
                <ValidationChoices
                  value={sectionReviews.systems.answer}
                  onChange={(value) => setSectionReviewValue("systems", { answer: value, issue: value === "incorrect" ? sectionReviews.systems.issue : "", note: sectionReviews.systems.note })}
                />
              </div>

              {sectionReviews.systems.answer === "incorrect" ? (
                <fieldset className="mt-4 block">
                  <legend className="text-[13px] font-semibold text-[#475569]">What is wrong?</legend>
                  <div className="mt-2 grid gap-2">
                    {INCORRECT_REASON_OPTIONS.map((option) => (
                      <label key={option.value} className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-[#D8E3EE] bg-white px-4 py-2 text-[15px] text-[#334155]">
                        <input
                          type="radio"
                          name="systems_incorrect_reason"
                          checked={sectionReviews.systems.issue === option.value}
                          onChange={() => setSectionReviewValue("systems", { issue: option.value })}
                          className="h-4 w-4 border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {sectionReviews.systems.answer === "incorrect" ? (
                <fieldset className="mt-4 block">
                  <legend className="text-[13px] font-semibold text-[#475569]">Help improve this section</legend>
                  <div className="mt-2 grid gap-2">
                    {[
                      { value: "suggest_correction" as const, label: "Suggest correction" },
                      { value: "add_missing" as const, label: "Add missing data" },
                      { value: "flag_only" as const, label: "Flag only" },
                    ].map((option) => (
                      <label key={option.value} className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-[#D8E3EE] bg-white px-4 py-2 text-[15px] text-[#334155]">
                        <input
                          type="radio"
                          name="systems_improve_mode"
                          checked={sectionReviews.systems.improveMode === option.value}
                          onChange={() => setSectionReviewValue("systems", { improveMode: option.value })}
                          className="h-4 w-4 border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {sectionReviews.systems.improveMode === "suggest_correction" || sectionReviews.systems.improveMode === "add_missing" ? (
                <div className="mt-4 grid gap-4">
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">Procedure variant</span>
                    <input
                      value={sectionReviews.systems.procedureVariant}
                      onChange={(event) => setSectionReviewValue("systems", { procedureVariant: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">Implant type</span>
                    <input
                      value={sectionReviews.systems.implantType}
                      onChange={(event) => setSectionReviewValue("systems", { implantType: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">Source / rationale (optional)</span>
                    <input
                      value={sectionReviews.systems.sourceRationale}
                      onChange={(event) => setSectionReviewValue("systems", { sourceRationale: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                </div>
              ) : null}

              <label className="mt-4 block">
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#475569]">
                  Add note or correction (optional)
                </span>
                <textarea
                  value={sectionReviews.systems.note}
                  onChange={(event) => setSectionReviewValue("systems", { note: event.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                />
              </label>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => saveSectionReview("systems")}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#06B6D4] px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white"
                >
                  <Check size={13} />
                  {sectionReviews.systems.improveMode === "suggest_correction" || sectionReviews.systems.improveMode === "add_missing" ? "Submit suggestion" : "Save review"}
                </button>
              </div>
            </ReviewSection>

            <ReviewSection
              title="Trays"
              subtitle="Held tray data"
              status={sectionStatus.trays}
              open={openSections.trays}
              onToggle={() => toggleSection("trays")}
            >
              <div className="rounded-[18px] border border-[#D8E3EE] bg-white px-4 py-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0891B2]">Current linked data</p>
                <p className="mt-3 text-[15px] leading-6 text-[#475569]">No tray data is linked to this record yet.</p>
              </div>

              <div className="mt-4 space-y-4">
                <p className="text-[17px] font-semibold text-[#10243E]">Is this section correct?</p>
                <ValidationChoices
                  value={sectionReviews.trays.answer}
                  onChange={(value) => setSectionReviewValue("trays", { answer: value, issue: value === "incorrect" ? sectionReviews.trays.issue : "" })}
                />
              </div>

              {sectionReviews.trays.answer === "incorrect" ? (
                <fieldset className="mt-4 block">
                  <legend className="text-[13px] font-semibold text-[#475569]">What is wrong?</legend>
                  <div className="mt-2 grid gap-2">
                    {INCORRECT_REASON_OPTIONS.map((option) => (
                      <label key={option.value} className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-[#D8E3EE] bg-white px-4 py-2 text-[15px] text-[#334155]">
                        <input
                          type="radio"
                          name="trays_incorrect_reason"
                          checked={sectionReviews.trays.issue === option.value}
                          onChange={() => setSectionReviewValue("trays", { issue: option.value })}
                          className="h-4 w-4 border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {sectionReviews.trays.answer === "incorrect" ? (
                <fieldset className="mt-4 block">
                  <legend className="text-[13px] font-semibold text-[#475569]">Help improve this section</legend>
                  <div className="mt-2 grid gap-2">
                    {[
                      { value: "suggest_correction" as const, label: "Suggest correction" },
                      { value: "add_missing" as const, label: "Add missing data" },
                      { value: "flag_only" as const, label: "Flag only" },
                    ].map((option) => (
                      <label key={option.value} className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-[#D8E3EE] bg-white px-4 py-2 text-[15px] text-[#334155]">
                        <input
                          type="radio"
                          name="trays_improve_mode"
                          checked={sectionReviews.trays.improveMode === option.value}
                          onChange={() => setSectionReviewValue("trays", { improveMode: option.value })}
                          className="h-4 w-4 border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {sectionReviews.trays.improveMode === "suggest_correction" || sectionReviews.trays.improveMode === "add_missing" ? (
                <div className="mt-4 grid gap-4">
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">Tray name</span>
                    <input
                      value={sectionReviews.trays.trayName}
                      onChange={(event) => setSectionReviewValue("trays", { trayName: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">Tray type / category (optional)</span>
                    <input
                      value={sectionReviews.trays.trayCategory}
                      onChange={(event) => setSectionReviewValue("trays", { trayCategory: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">Supplier (optional)</span>
                    <input
                      value={sectionReviews.trays.traySupplier}
                      onChange={(event) => setSectionReviewValue("trays", { traySupplier: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                </div>
              ) : null}

              <label className="mt-4 block">
                <span className="text-[13px] font-semibold text-[#475569]">Add note or correction (optional)</span>
                <textarea
                  value={sectionReviews.trays.note}
                  onChange={(event) => setSectionReviewValue("trays", { note: event.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                />
              </label>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => saveSectionReview("trays")} className="inline-flex items-center gap-1.5 rounded-full bg-[#06B6D4] px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
                  <Check size={13} />
                  {sectionReviews.trays.improveMode === "suggest_correction" || sectionReviews.trays.improveMode === "add_missing" ? "Submit suggestion" : "Save review"}
                </button>
              </div>
            </ReviewSection>

            <ReviewSection
              title="SKUs"
              subtitle="Held SKU data"
              status={sectionStatus.skus}
              open={openSections.skus}
              onToggle={() => toggleSection("skus")}
            >
              <div className="rounded-[18px] border border-[#D8E3EE] bg-white px-4 py-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0891B2]">Current linked data</p>
                <p className="mt-3 text-[15px] leading-6 text-[#475569]">No SKU data is linked to this record yet.</p>
              </div>

              <div className="mt-4 space-y-4">
                <p className="text-[17px] font-semibold text-[#10243E]">Is this section correct?</p>
                <ValidationChoices
                  value={sectionReviews.skus.answer}
                  onChange={(value) => setSectionReviewValue("skus", { answer: value, issue: value === "incorrect" ? sectionReviews.skus.issue : "" })}
                />
              </div>

              {sectionReviews.skus.answer === "incorrect" ? (
                <fieldset className="mt-4 block">
                  <legend className="text-[13px] font-semibold text-[#475569]">What is wrong?</legend>
                  <div className="mt-2 grid gap-2">
                    {INCORRECT_REASON_OPTIONS.map((option) => (
                      <label key={option.value} className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-[#D8E3EE] bg-white px-4 py-2 text-[15px] text-[#334155]">
                        <input
                          type="radio"
                          name="skus_incorrect_reason"
                          checked={sectionReviews.skus.issue === option.value}
                          onChange={() => setSectionReviewValue("skus", { issue: option.value })}
                          className="h-4 w-4 border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {sectionReviews.skus.answer === "incorrect" ? (
                <fieldset className="mt-4 block">
                  <legend className="text-[13px] font-semibold text-[#475569]">Help improve this section</legend>
                  <div className="mt-2 grid gap-2">
                    {[
                      { value: "suggest_correction" as const, label: "Suggest correction" },
                      { value: "add_missing" as const, label: "Add missing data" },
                      { value: "flag_only" as const, label: "Flag only" },
                    ].map((option) => (
                      <label key={option.value} className="flex min-h-[48px] items-center gap-3 rounded-[16px] border border-[#D8E3EE] bg-white px-4 py-2 text-[15px] text-[#334155]">
                        <input
                          type="radio"
                          name="skus_improve_mode"
                          checked={sectionReviews.skus.improveMode === option.value}
                          onChange={() => setSectionReviewValue("skus", { improveMode: option.value })}
                          className="h-4 w-4 border-slate-300 text-[#06B6D4] focus:ring-[#06B6D4]"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {sectionReviews.skus.improveMode === "suggest_correction" || sectionReviews.skus.improveMode === "add_missing" ? (
                <div className="mt-4 grid gap-4">
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">SKU / product code</span>
                    <input
                      value={sectionReviews.skus.skuCode}
                      onChange={(event) => setSectionReviewValue("skus", { skuCode: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">Product name</span>
                    <input
                      value={sectionReviews.skus.productName}
                      onChange={(event) => setSectionReviewValue("skus", { productName: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[13px] font-semibold text-[#475569]">Category (optional)</span>
                    <input
                      value={sectionReviews.skus.skuCategory}
                      onChange={(event) => setSectionReviewValue("skus", { skuCategory: event.target.value })}
                      className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                    />
                  </label>
                </div>
              ) : null}

              <label className="mt-4 block">
                <span className="text-[13px] font-semibold text-[#475569]">Add note or correction (optional)</span>
                <textarea
                  value={sectionReviews.skus.note}
                  onChange={(event) => setSectionReviewValue("skus", { note: event.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-[16px] border border-[#D8E3EE] bg-white px-3 py-2.5 text-[16px] text-[#334155] outline-none"
                />
              </label>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => saveSectionReview("skus")} className="inline-flex items-center gap-1.5 rounded-full bg-[#06B6D4] px-4 py-2.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
                  <Check size={13} />
                  {sectionReviews.skus.improveMode === "suggest_correction" || sectionReviews.skus.improveMode === "add_missing" ? "Submit suggestion" : "Save review"}
                </button>
              </div>
            </ReviewSection>

            <ReviewSection
              title="Cards"
              subtitle="Linked card content"
              open={openSections.cards}
              onToggle={() => toggleSection("cards")}
            >
              <div className="rounded-[18px] border border-[#D8E3EE] bg-white px-4 py-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0891B2]">Current linked data</p>
                <p className="mt-3 text-[15px] leading-6 text-[#475569]">No linked cards are shown for this record yet.</p>
              </div>
            </ReviewSection>

            <ReviewSection
              title="Reviews"
              subtitle={`${selectedHistory.reviewHistory.length} recorded`}
              open={openSections.reviews}
              onToggle={() => toggleSection("reviews")}
            >
              <div className="mt-3 overflow-hidden rounded-[16px] border border-[#D8E3EE] bg-white">
                <div className="grid grid-cols-[1.2fr,1fr,1fr] gap-2 border-b border-[#E2E8F0] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                  <span>Reviewer</span>
                  <span>Outcome</span>
                  <span>Date</span>
                </div>
                {selectedHistory.reviewHistory.length > 0 ? (
                  selectedHistory.reviewHistory
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <div key={`${entry.actor}-${entry.reviewed_at}-${index}`} className="grid grid-cols-[1.2fr,1fr,1fr] gap-2 border-b border-[#EEF2F7] px-3 py-2 text-[13px] text-[#334155] last:border-b-0">
                        <span>{entry.actor}</span>
                        <span>{entry.outcome.replaceAll("_", " ")}</span>
                        <span>{new Date(entry.reviewed_at).toLocaleDateString("en-GB")}</span>
                      </div>
                    ))
                ) : (
                  <p className="px-3 py-3 text-[13px] text-[#64748B]">No reviews yet.</p>
                )}
              </div>
            </ReviewSection>

            <ReviewSection
              title="Revisions"
              subtitle={`${selectedHistory.revisionHistory.length} recorded`}
              open={openSections.revisions}
              onToggle={() => toggleSection("revisions")}
            >
              <div className="mt-3 overflow-hidden rounded-[16px] border border-[#D8E3EE] bg-white">
                <div className="grid grid-cols-[1fr,1.4fr,1fr] gap-2 border-b border-[#E2E8F0] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
                  <span>Revised by</span>
                  <span>Change</span>
                  <span>Date</span>
                </div>
                {selectedHistory.revisionHistory.length > 0 ? (
                  selectedHistory.revisionHistory
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <div key={`${entry.actor}-${entry.revised_at}-${index}`} className="grid grid-cols-[1fr,1.4fr,1fr] gap-2 border-b border-[#EEF2F7] px-3 py-2 text-[13px] text-[#334155] last:border-b-0">
                        <span>{entry.actor}</span>
                        <span>{entry.summary}</span>
                        <span>{new Date(entry.revised_at).toLocaleDateString("en-GB")}</span>
                      </div>
                    ))
                ) : (
                  <p className="px-3 py-3 text-[13px] text-[#64748B]">No revisions yet.</p>
                )}
              </div>
            </ReviewSection>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
