"use client"

import { useDeferredValue, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type UIEvent } from "react"
import Fuse from "fuse.js"
import {
  Activity,
  ArrowUp,
  ArrowRightLeft,
  Baby,
  BedSingle,
  Bone,
  Brain,
  Building2,
  ChevronRight,
  Cross,
  Eye,
  FolderSearch2,
  HeartPulse,
  LayoutGrid,
  Pill,
  Plus,
  Package,
  Search,
  Scissors,
  ShoppingCart,
  Stethoscope,
  UserRound,
  Waves,
  Wrench,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { procedures } from "@/lib/data"
import { isAdminSession } from "@/lib/admin"
import { getHistory } from "@/lib/history"
import { getProfile, getRelevantSettings } from "@/lib/profile"
import { getProcedureVariantById, getSystemById } from "@/lib/variants"
import { hasVariantsForProcedure } from "@/lib/variants"
import {
  ClinicalSetting,
  PrepSightProfile,
  USER_ROLE_LABEL,
} from "@/lib/types"
import { SETTING_SPECIALTIES } from "@/lib/settings"
import { SPECIALTY_SVG_ICON, StomachIcon } from "@/components/SpecialtyIcons"

const WORKSPACE_META: Record<
  ClinicalSetting,
  { icon: typeof Stethoscope; tile: string; solid: string }
> = {
  "Operating Theatre": { icon: Stethoscope, tile: "bg-[#4DA3FF]", solid: "#4DA3FF" },
  "Endoscopy Suite": { icon: Waves, tile: "bg-[#14B8A6]", solid: "#14B8A6" },
  "Interventional Radiology / Cath Lab": { icon: Activity, tile: "bg-[#7C5CFC]", solid: "#7C5CFC" },
  "Emergency Department": { icon: HeartPulse, tile: "bg-[#F97316]", solid: "#F97316" },
  "Intensive Care Unit": { icon: BedSingle, tile: "bg-[#2563EB]", solid: "#2563EB" },
  Ward: { icon: Building2, tile: "bg-[#10B981]", solid: "#10B981" },
  "Outpatient / Clinic": { icon: Pill, tile: "bg-[#6366F1]", solid: "#6366F1" },
  "Maternity & Obstetrics": { icon: HeartPulse, tile: "bg-[#EC4899]", solid: "#EC4899" },
}

const SPECIALTY_TILE_COLOURS = [
  "#3B82F6",
  "#14B8A6",
  "#7C5CFC",
  "#F97316",
  "#2563EB",
  "#10B981",
  "#EC4899",
  "#F59E0B",
  "#06B6D4",
  "#8B5CF6",
  "#22C55E",
  "#EF4444",
  "#0EA5E9",
  "#A855F7",
  "#84CC16",
  "#F43F5E",
  "#6366F1",
  "#EAB308",
  "#14B8A6",
  "#FB7185",
]

const WORKFLOW_TOOLS = [
  {
    label: "New card",
    href: "/procedures/new",
    icon: Plus,
    tileColor: "#4DA3FF",
    available: true,
  },
  {
    label: "Catalogue",
    href: "/catalogue",
    icon: Package,
    tileColor: "#14B8A6",
    available: true,
  },
  {
    label: "Surgeons",
    href: "",
    icon: UserRound,
    tileColor: "#6366F1",
    available: false,
  },
  {
    label: "Directory",
    href: "",
    icon: Building2,
    tileColor: "#7C5CFC",
    available: false,
  },
  {
    label: "Implants",
    href: "",
    icon: LayoutGrid,
    tileColor: "#10B981",
    available: false,
  },
  {
    label: "Product ID",
    href: "",
    icon: FolderSearch2,
    tileColor: "#F97316",
    available: false,
  },
  {
    label: "Stockroom",
    href: "",
    icon: ShoppingCart,
    tileColor: "#8B5CF6",
    available: false,
  },
  {
    label: "Tray audit",
    href: "",
    icon: Wrench,
    tileColor: "#F59E0B",
    available: false,
  },
] as const

const WORKFLOW_IMAGE_MAP: Record<string, string> = {
  "New card": "/icons/workflow/new-card.png",
  Catalogue: "/icons/workflow/catalogue.png",
  Surgeons: "/icons/workflow/surgeons.png",
  Directory: "/icons/workflow/directory.png",
  Implants: "/icons/workflow/implants.png",
  "Product ID": "/icons/workflow/product-id.png",
  Stockroom: "/icons/workflow/stockroom.png",
  "Tray audit": "/icons/workflow/tray-audit.png",
}

const SPECIALTY_SHORT_LABELS: Record<string, string> = {
  "Trauma and Orthopaedics": "Ortho",
  "General Surgery": "GenSurg",
  Urology: "Urology",
  Obstetrics: "Obs",
  Gynecology: "Gynae",
  "Otolaryngology (Ear, Nose and Throat)": "ENT",
  "Oral and Maxillofacial": "OMFS",
  "Dental and Oral": "Dental",
  "Plastic and Reconstructive": "Plastics",
  Neurosurgery: "Neuro",
  Cardiothoracic: "Cardiac",
  Vascular: "Vascular",
  Paediatric: "Paeds",
  Ophthalmology: "Eyes",
  Podiatric: "Podiatry",
  Anaesthesia: "Anaes",
  "Upper GI": "Upper GI",
  "Lower GI": "Lower GI",
  Hepatobiliary: "HPB",
  Respiratory: "Resp",
  "Interventional Radiology": "IR",
  Cardiology: "Cards",
  Neuroradiology: "Neuro IR",
  Resuscitation: "Resus",
  Trauma: "Trauma",
  Procedural: "Procedural",
  "General ICU": "Gen ICU",
  "Cardiac ICU": "Card ICU",
  "Neuro ICU": "Neuro ICU",
  "General Ward": "Gen Ward",
  "Surgical Ward": "Surg Ward",
  "Medical Ward": "Med Ward",
  Outpatients: "OPD",
  "Minor Procedures": "Minor",
  "Specialist Clinic": "Clinic",
  "Labour Ward": "Labour",
  "Obstetric Theatre": "Obs Thtr",
  Postnatal: "Postnatal",
}

const SPECIALTY_IMAGE_MAP: Record<string, string> = {
  // Operating Theatre
  "Trauma and Orthopaedics":               "/icons/specialties/trauma-and-orthopaedics.png",
  "General Surgery":                        "/icons/specialties/general-surgery.png",
  "Urology":                                "/icons/specialties/urology.png",
  "Obstetrics":                             "/icons/specialties/obstetrics.png",
  "Gynecology":                             "/icons/specialties/gynecology.png",
  "Otolaryngology (Ear, Nose and Throat)":  "/icons/specialties/otolaryngology.png",
  "Oral and Maxillofacial":                 "/icons/specialties/oral-and-maxillofacial.png",
  "Dental and Oral":                        "/icons/specialties/dental-and-oral.png",
  "Plastic and Reconstructive":             "/icons/specialties/plastic-and-reconstructive.png",
  "Neurosurgery":                           "/icons/specialties/neurosurgery.png",
  "Cardiothoracic":                         "/icons/specialties/cardiothoracic.png",
  "Vascular":                               "/icons/specialties/vascular.png",
  "Paediatric":                             "/icons/specialties/paediatric.png",
  "Ophthalmology":                          "/icons/specialties/ophthalmology.png",
  "Podiatric":                              "/icons/specialties/podiatric.png",
  "Anaesthesia":                            "/icons/specialties/anaesthesia.png",
  // Endoscopy Suite
  "Upper GI":                               "/icons/specialties/upper-gi.png",
  "Lower GI":                               "/icons/specialties/lower-gi.png",
  "Hepatobiliary":                          "/icons/specialties/hepatobiliary.png",
  "Respiratory":                            "/icons/specialties/respiratory.png",
  // IR / Cath Lab
  "Interventional Radiology":               "/icons/specialties/interventional-radiology.png",
  "Cardiology":                             "/icons/specialties/cardiology.png",
  "Neuroradiology":                         "/icons/specialties/neuroradiology.png",
  // Emergency Department
  "Resuscitation":                          "/icons/specialties/resuscitation.png",
  "Trauma":                                 "/icons/specialties/trauma.png",
  "Procedural":                             "/icons/specialties/procedural.png",
  // ICU
  "General ICU":                            "/icons/specialties/general-icu.png",
  "Cardiac ICU":                            "/icons/specialties/cardiac-icu.png",
  "Neuro ICU":                              "/icons/specialties/neuro-icu.png",
  // Ward
  "General Ward":                           "/icons/specialties/general-ward.png",
  "Surgical Ward":                          "/icons/specialties/surgical-ward.png",
  "Medical Ward":                           "/icons/specialties/medical-ward.png",
  // Outpatient
  "Outpatients":                            "/icons/specialties/outpatients.png",
  "Minor Procedures":                       "/icons/specialties/minor-procedures.png",
  "Specialist Clinic":                      "/icons/specialties/specialist-clinic.png",
  // Maternity
  "Labour Ward":                            "/icons/specialties/labour-ward.png",
  "Obstetric Theatre":                      "/icons/specialties/obstetric-theatre.png",
  "Postnatal":                              "/icons/specialties/postnatal.png",
}

const SPECIALTY_ICON_MAP: Record<string, typeof Stethoscope> = {
  "Trauma and Orthopaedics": Bone,
  "General Surgery": Scissors,
  Urology: Pill,
  Obstetrics: Baby,
  Gynecology: Cross,
  "Otolaryngology (Ear, Nose and Throat)": Stethoscope,
  "Oral and Maxillofacial": Scissors,
  "Dental and Oral": Scissors,
  "Plastic and Reconstructive": Scissors,
  Neurosurgery: Brain,
  Cardiothoracic: HeartPulse,
  Vascular: Activity,
  Paediatric: Baby,
  Ophthalmology: Eye,
  Podiatric: Bone,
  Anaesthesia: Waves,
  "Upper GI": Pill,
  "Lower GI": Pill,
  Hepatobiliary: Pill,
  Respiratory: Waves,
  "Interventional Radiology": Activity,
  Cardiology: HeartPulse,
  Neuroradiology: Brain,
  Resuscitation: HeartPulse,
  Trauma: Cross,
  Procedural: Stethoscope,
  "General ICU": BedSingle,
  "Cardiac ICU": HeartPulse,
  "Neuro ICU": Brain,
  "General Ward": Building2,
  "Surgical Ward": Scissors,
  "Medical Ward": Pill,
  Outpatients: UserRound,
  "Minor Procedures": Scissors,
  "Specialist Clinic": UserRound,
  "Labour Ward": Baby,
  "Obstetric Theatre": Baby,
  Postnatal: Baby,
}

const MOBILE_SPECIALTY_SVG_ICON: Record<string, typeof StomachIcon> = {
  "General Surgery": StomachIcon,
}

const WORKSPACE_HERO_META: Record<
  ClinicalSetting,
  { surface: string; accent: string; glow: string; blip: string }
> = {
  "Operating Theatre": {
    surface: "from-[#0C3B68] via-[#135A9D] to-[#4DA3FF]",
    accent: "bg-[#7DD3FC]",
    glow: "bg-[#7DD3FC]/35",
    blip: "bg-[#BAE6FD]",
  },
  "Endoscopy Suite": {
    surface: "from-[#0A4D45] via-[#0F766E] to-[#14B8A6]",
    accent: "bg-[#5EEAD4]",
    glow: "bg-[#5EEAD4]/35",
    blip: "bg-[#99F6E4]",
  },
  "Interventional Radiology / Cath Lab": {
    surface: "from-[#392A7A] via-[#5B43C6] to-[#7C5CFC]",
    accent: "bg-[#C4B5FD]",
    glow: "bg-[#C4B5FD]/35",
    blip: "bg-[#DDD6FE]",
  },
  "Emergency Department": {
    surface: "from-[#7C2D12] via-[#C2410C] to-[#F97316]",
    accent: "bg-[#FDBA74]",
    glow: "bg-[#FDBA74]/35",
    blip: "bg-[#FED7AA]",
  },
  "Intensive Care Unit": {
    surface: "from-[#123B7A] via-[#1D4ED8] to-[#60A5FA]",
    accent: "bg-[#93C5FD]",
    glow: "bg-[#93C5FD]/35",
    blip: "bg-[#BFDBFE]",
  },
  Ward: {
    surface: "from-[#065F46] via-[#0F9F6E] to-[#34D399]",
    accent: "bg-[#86EFAC]",
    glow: "bg-[#86EFAC]/35",
    blip: "bg-[#BBF7D0]",
  },
  "Outpatient / Clinic": {
    surface: "from-[#3730A3] via-[#4F46E5] to-[#818CF8]",
    accent: "bg-[#C7D2FE]",
    glow: "bg-[#C7D2FE]/35",
    blip: "bg-[#E0E7FF]",
  },
  "Maternity & Obstetrics": {
    surface: "from-[#9D174D] via-[#DB2777] to-[#F472B6]",
    accent: "bg-[#F9A8D4]",
    glow: "bg-[#F9A8D4]/35",
    blip: "bg-[#FBCFE8]",
  },
}

const MOBILE_DOCK_KEY = "prepsight_mobile_dock"
const HOMEPAGE_IMAGES_KEY = "prepsight_homepage_images"
const DEFAULT_DOCK_ITEM_IDS = [
  "tool-new-card",
  "tool-catalogue",
  "tool-surgeons",
  "tool-directory",
]
const DRAGGABLE_ITEM_STYLE: CSSProperties = {
  WebkitTouchCallout: "none",
  touchAction: "none",
}

function withAlpha(hex: string, alpha: string): string {
  return /^#[0-9A-Fa-f]{6}$/.test(hex) ? `${hex}${alpha}` : hex
}

function mobileIconShellStyle(color: string): CSSProperties {
  return {
    background: `linear-gradient(180deg, ${withAlpha(color, "FF")} 0%, ${withAlpha(color, "F0")} 42%, ${withAlpha(color, "D2")} 100%)`,
    boxShadow: `0 10px 18px ${withAlpha(color, "24")}, inset 0 1px 0 rgba(255,255,255,0.34), inset 0 -12px 18px rgba(15,23,42,0.14)`,
  }
}

function mobileIconGlossStyle(color: string): CSSProperties {
  return {
    background: `linear-gradient(180deg, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0) 100%)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22)`,
  }
}

function mobileSpecialtyIconSize(label: string): number {
  if (label === "Trauma and Orthopaedics") return 26
  return 24
}

function mobileSpecialtyImageClassName(label: string): string {
  if (label === "Trauma and Orthopaedics") return "h-10 w-10 scale-[1.12] object-contain"
  if (label === "General Surgery") return "h-10 w-10 scale-[1.1] object-contain"
  if (label === "Urology") return "h-10 w-10 scale-[1.08] object-contain"
  if (label === "Obstetrics") return "h-9 w-9 scale-105 object-contain"
  return "h-10 w-10 scale-[1.1] object-contain"
}

function mobileWorkflowImageClassName(label: string): string {
  if (label === "New card") return "h-9 w-9 scale-105 object-contain"
  return "h-10 w-10 scale-[1.08] object-contain"
}

function getMobileSpecialtyImageSrc(src?: string): string | undefined {
  if (!src) return undefined
  return src.replace(/(\.[a-z0-9]+)$/i, "-1$1")
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning."
  if (h < 17) return "Good afternoon."
  return "Good evening."
}

function normalizeSearchText(value: string | undefined): string {
  return (value ?? "").toLowerCase().trim()
}

function getSearchableProcedureAliases(procedure: (typeof procedures)[number]): string[] {
  const aliases = (procedure as { aliases?: unknown }).aliases
  if (Array.isArray(aliases)) {
    return aliases
      .filter((alias): alias is string => typeof alias === "string")
      .map(normalizeSearchText)
      .filter(Boolean)
  }

  if (typeof aliases === "string") {
    const alias = normalizeSearchText(aliases)
    return alias ? [alias] : []
  }

  return []
}

function getSearchableProcedureDescription(procedure: (typeof procedures)[number]): string {
  const descriptionValue = "description" in procedure ? (procedure as { description?: unknown }).description : ""
  return typeof descriptionValue === "string"
    ? normalizeSearchText(descriptionValue)
    : normalizeSearchText(String(descriptionValue ?? ""))
}

const procedureLookup = new Map(procedures.map((procedure) => [procedure.id, procedure]))

const searchableProcedures = procedures.map((procedure) => ({
  id: procedure.id,
  name: normalizeSearchText(procedure.name),
  specialty: normalizeSearchText(procedure.specialty),
  setting: normalizeSearchText(procedure.setting),
  description: getSearchableProcedureDescription(procedure),
  aliases: getSearchableProcedureAliases(procedure),
}))

const procedureSearchIndex = new Fuse(searchableProcedures, {
  includeScore: true,
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 1,
  keys: [
    { name: "name", weight: 0.52 },
    { name: "aliases", weight: 0.24 },
    { name: "specialty", weight: 0.14 },
    { name: "description", weight: 0.07 },
    { name: "setting", weight: 0.03 },
  ],
})

function searchProcedures(rawQuery: string): Array<(typeof procedures)[number]> {
  const query = normalizeSearchText(rawQuery)
  if (query.length < 1) return []

  return procedureSearchIndex
    .search(query, { limit: 8 })
    .sort((a, b) => {
      const scoreDelta = (a.score ?? 1) - (b.score ?? 1)
      if (Math.abs(scoreDelta) > 0.015) return scoreDelta

      const aName = a.item.name
      const bName = b.item.name
      const aStarts = aName.startsWith(query) ? 1 : 0
      const bStarts = bName.startsWith(query) ? 1 : 0
      if (aStarts !== bStarts) return bStarts - aStarts

      const aIncludes = aName.includes(query) ? 1 : 0
      const bIncludes = bName.includes(query) ? 1 : 0
      if (aIncludes !== bIncludes) return bIncludes - aIncludes

      const aProcedure = procedureLookup.get(a.item.id)
      const bProcedure = procedureLookup.get(b.item.id)
      return (aProcedure?.name ?? a.item.name).localeCompare(bProcedure?.name ?? b.item.name)
    })
    .map((entry) => procedureLookup.get(entry.item.id))
    .filter((procedure): procedure is (typeof procedures)[number] => Boolean(procedure))
}

function getProcedureSearchHref(procedure: (typeof procedures)[number]): string {
  const params = new URLSearchParams({
    setting: procedure.setting,
    specialty: procedure.specialty,
  })

  const serviceLineId = "service_line_id" in procedure && typeof procedure.service_line_id === "string"
    ? procedure.service_line_id
    : null
  const anatomyId = "anatomy_id" in procedure && typeof procedure.anatomy_id === "string"
    ? procedure.anatomy_id
    : null

  if (serviceLineId) params.set("service_line", serviceLineId)
  if (anatomyId) params.set("anatomy", anatomyId)

  if (hasVariantsForProcedure(procedure.id) || anatomyId || serviceLineId) {
    return `/?${params.toString()}`
  }

  return `/procedures/${procedure.id}`
}

function getContextBadge(profile: PrepSightProfile): string {
  const parts: string[] = [USER_ROLE_LABEL[profile.role] ?? profile.role]
  if (profile.departments[0]) parts.push(profile.departments[0])
  if (profile.specialtiesOfInterest[0]) parts.push(profile.specialtiesOfInterest[0])
  return parts.join(" · ")
}

function formatRecentSubtitle(procedureName: string, variantName?: string | null): string {
  return variantName ? `${procedureName} ${variantName}` : procedureName
}

export default function HomeHero({
  initialWorkspace,
}: {
  initialWorkspace?: ClinicalSetting
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [showHomepageImages, setShowHomepageImages] = useState(false)
  const [profile] = useState<PrepSightProfile | null>(() => getProfile())
  const [recentEntries] = useState<ReturnType<typeof getHistory>>(() => getHistory())
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const [focused, setFocused] = useState(false)
  const [relevantSettings] = useState<ClinicalSetting[]>(() =>
    profile ? getRelevantSettings(profile) : [],
  )
  const [activeWorkspace, setActiveWorkspace] = useState<ClinicalSetting>(() =>
    initialWorkspace ?? relevantSettings[0] ?? "Operating Theatre",
  )
  const [launcherPage, setLauncherPage] = useState(0)
  const [dockItemIds, setDockItemIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_DOCK_ITEM_IDS
    const saved = window.localStorage.getItem(MOBILE_DOCK_KEY)
    if (!saved) return DEFAULT_DOCK_ITEM_IDS
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        return parsed.filter((value): value is string => typeof value === "string").slice(0, 4)
      }
    } catch {
      // Ignore invalid local state and fall back to defaults.
    }
    return DEFAULT_DOCK_ITEM_IDS
  })
  const [dragState, setDragState] = useState<{
    itemId: string
    origin: "launcher" | "dock"
    x: number
    y: number
  } | null>(null)
  const [dragHoverSlot, setDragHoverSlot] = useState<number | null>(null)
  const [launcherHoverTarget, setLauncherHoverTarget] = useState<{
    category: "specialty" | "workflow"
    index: number
  } | null>(null)
  const [specialtyOrderMap, setSpecialtyOrderMap] = useState<Record<string, string[]>>({})
  const [workflowOrder, setWorkflowOrder] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const launcherScrollerRef = useRef<HTMLDivElement>(null)
  const layoutNodeMapRef = useRef(new Map<string, HTMLElement>())
  const previousRectMapRef = useRef(new Map<string, DOMRect>())
  const activePointerIdRef = useRef<number | null>(null)
  const dragActiveRef = useRef(false)
  const pressTimerRef = useRef<number | null>(null)
  const suppressTapUntilRef = useRef(0)
  const pressMetaRef = useRef<{
    itemId: string
    origin: "launcher" | "dock"
    onTap: () => void
    startX: number
    startY: number
    pointerId: number
    target: HTMLElement
  } | null>(null)

  const results = deferredQuery.trim().length > 0
    ? searchProcedures(deferredQuery)
    : []

  const recentCards = recentEntries
    .map((entry) => {
      const procedure = procedures.find((p) => p.id === entry.procedureId)
      if (!procedure) return null

      const variant = entry.variantId
        ? getProcedureVariantById(entry.variantId)
        : null
      const system = entry.systemId
        ? getSystemById(entry.systemId)
        : null

      return {
        entry,
        procedure,
        variant,
        system,
        href:
          entry.variantId && entry.systemId
            ? `/procedures/${procedure.id}?variant=${encodeURIComponent(entry.variantId)}&system=${encodeURIComponent(entry.systemId)}`
          : `/procedures/${procedure.id}`,
      }
    })
    .filter(
      (
        card,
      ): card is {
        entry: (typeof recentEntries)[number]
        procedure: (typeof procedures)[number]
        variant: ReturnType<typeof getProcedureVariantById>
        system: ReturnType<typeof getSystemById>
        href: string
      } => card !== null,
    )

  const showResults = focused && query.trim().length > 0
  const workspaceSettings: ClinicalSetting[] = relevantSettings.length > 0
    ? relevantSettings
    : ["Operating Theatre"]

  const workspaceItems = workspaceSettings.map((setting) => ({
    id: `setting-${setting}`,
    label: setting
      .replace("Interventional Radiology / Cath Lab", "IR / Cath")
      .replace("Outpatient / Clinic", "Clinic")
      .replace("Maternity & Obstetrics", "Maternity")
      .replace("Intensive Care Unit", "ICU")
      .replace("Emergency Department", "ED")
      .replace("Operating Theatre", "Theatre")
      .replace("Endoscopy Suite", "Endoscopy"),
    href: `/?setting=${encodeURIComponent(setting)}`,
    icon: WORKSPACE_META[setting].icon,
    tile: WORKSPACE_META[setting].tile,
    solid: WORKSPACE_META[setting].solid,
  }))
  const activeWorkspaceItem = workspaceItems.find((item) => item.id === `setting-${activeWorkspace}`) ?? workspaceItems[0]
  const activeWorkspaceMeta = WORKSPACE_HERO_META[activeWorkspace]
  const hideHomepageImages = !showHomepageImages
  const canSwitchWorkspace = workspaceItems.length > 1
  const specialtyItems = (SETTING_SPECIALTIES[activeWorkspace] ?? []).map((specialty) => ({
    id: `${activeWorkspace}-${specialty}`,
    shortLabel: SPECIALTY_SHORT_LABELS[specialty] ?? specialty,
    fullLabel: specialty,
    href: `/?setting=${encodeURIComponent(activeWorkspace)}&specialty=${encodeURIComponent(specialty)}`,
    tileColor:
      SPECIALTY_TILE_COLOURS[
        (SETTING_SPECIALTIES[activeWorkspace] ?? []).indexOf(specialty) % SPECIALTY_TILE_COLOURS.length
      ] ?? "#3B82F6",
    icon: SPECIALTY_ICON_MAP[specialty] ?? Stethoscope,
    svgIcon: MOBILE_SPECIALTY_SVG_ICON[specialty] ?? SPECIALTY_SVG_ICON[specialty],
    imageSrc: getMobileSpecialtyImageSrc(SPECIALTY_IMAGE_MAP[specialty]),
    available: true,
    category: "specialty" as const,
  }))
  const workflowLauncherItems = WORKFLOW_TOOLS.map((tool) => ({
    id: `tool-${tool.label.toLowerCase().replace(/\s+/g, "-")}`,
    label: tool.label,
    href: tool.href,
    tileColor: tool.tileColor,
    icon: tool.icon,
    imageSrc: WORKFLOW_IMAGE_MAP[tool.label],
    available: tool.available,
    category: "workflow" as const,
  }))
  const iconPreloadSources = [
    ...specialtyItems.slice(0, 8).map((item) => item.imageSrc).filter((src): src is string => Boolean(src)),
    ...workflowLauncherItems.slice(0, 4).map((item) => item.imageSrc).filter((src): src is string => Boolean(src)),
  ]
  const iconPreloadKey = iconPreloadSources.join("|")
  const orderedSpecialtyIds = specialtyOrderMap[activeWorkspace] ?? specialtyItems.map((item) => item.id)
  const orderedSpecialtyItems = [
    ...orderedSpecialtyIds
      .map((id) => specialtyItems.find((item) => item.id === id))
      .filter((item): item is (typeof specialtyItems)[number] => Boolean(item)),
    ...specialtyItems.filter((item) => !orderedSpecialtyIds.includes(item.id)),
  ]
  const orderedWorkflowIds = workflowOrder.length > 0 ? workflowOrder : workflowLauncherItems.map((item) => item.id)
  const orderedWorkflowItems = [
    ...orderedWorkflowIds
      .map((id) => workflowLauncherItems.find((item) => item.id === id))
      .filter((item): item is (typeof workflowLauncherItems)[number] => Boolean(item)),
    ...workflowLauncherItems.filter((item) => !orderedWorkflowIds.includes(item.id)),
  ]
  const hiddenSpecialtyIds = orderedSpecialtyItems
    .filter((item) => dockItemIds.includes(item.id))
    .map((item) => item.id)
  const hiddenWorkflowIds = orderedWorkflowItems
    .filter((item) => dockItemIds.includes(item.id))
    .map((item) => item.id)
  const visibleSpecialtyItems = orderedSpecialtyItems.filter((item) => !dockItemIds.includes(item.id))
  const visibleWorkflowLauncherItems = orderedWorkflowItems.filter((item) => !dockItemIds.includes(item.id))
  const dockLibrary = [...specialtyItems, ...workflowLauncherItems]
  const dockLookup = Object.fromEntries(dockLibrary.map((item) => [item.id, item]))
  const dragPreviewItem = dragState ? dockLookup[dragState.itemId] : null
  const launcherSpecialtyBaseItems = dragState?.itemId
    ? visibleSpecialtyItems.filter((item) => item.id !== dragState.itemId)
    : visibleSpecialtyItems
  const launcherWorkflowBaseItems = dragState?.itemId
    ? visibleWorkflowLauncherItems.filter((item) => item.id !== dragState.itemId)
    : visibleWorkflowLauncherItems
  const previewDockSlots = (() => {
    const baseDockIds = dragState?.origin === "dock"
      ? dockItemIds.filter((id) => id !== dragState.itemId)
      : dockItemIds

    if (dragState && dragHoverSlot !== null) {
      const next = [...baseDockIds]
      const dragItem = dockLookup[dragState.itemId]
      const targetItemId = next[dragHoverSlot]
      const targetItem = targetItemId ? dockLookup[targetItemId] : null

      if (dragItem && targetItem && dragItem.category !== targetItem.category) {
        return baseDockIds
      }

      const boundedIndex = Math.max(0, Math.min(dragHoverSlot, Math.min(next.length, 3)))

      if (next.length >= 4) {
        next.splice(boundedIndex, 1, null as unknown as string)
        return next as Array<string | null>
      }

      next.splice(boundedIndex, 0, null as unknown as string)
      return next.slice(0, 4) as Array<string | null>
    }
    if (dragState) {
      const dragItem = dockLookup[dragState.itemId]
      const dockCategory = baseDockIds[0] ? dockLookup[baseDockIds[0]]?.category : dragItem?.category
      if (dragItem && dockCategory === dragItem.category && baseDockIds.length < 4) {
        return [...baseDockIds, null]
      }
    }
    return baseDockIds as Array<string | null>
  })()

  function submitSearch() {
    const topResult = results[0]
    if (!topResult) return
    setFocused(false)
    router.push(getProcedureSearchHref(topResult))
  }
  const dockRenderItems: Array<(typeof dockLibrary)[number] | null> = (
    previewDockSlots.length > 0 ? previewDockSlots : DEFAULT_DOCK_ITEM_IDS
  ).map((id) => (id ? dockLookup[id] ?? null : null))
  const visibleDockItems = dockRenderItems.filter(
    (item): item is (typeof dockLibrary)[number] => Boolean(item),
  )
  const specialtyRenderItems: Array<(typeof visibleSpecialtyItems)[number] | null> = (() => {
    if (!dragState || !launcherHoverTarget || launcherHoverTarget.category !== "specialty") {
      if (dragState && dockLookup[dragState.itemId]?.category === "specialty") {
        return [...launcherSpecialtyBaseItems, null]
      }
      return launcherSpecialtyBaseItems
    }
    const dragItem = dockLookup[dragState.itemId]
    if (!dragItem || dragItem.category !== "specialty") {
      return launcherSpecialtyBaseItems
    }
    const next: Array<(typeof visibleSpecialtyItems)[number] | null> = [...launcherSpecialtyBaseItems]
    const boundedIndex = Math.max(0, Math.min(launcherHoverTarget.index, next.length))
    next.splice(boundedIndex, 0, null)
    return next
  })()
  const workflowRenderItems: Array<(typeof visibleWorkflowLauncherItems)[number] | null> = (() => {
    if (!dragState || !launcherHoverTarget || launcherHoverTarget.category !== "workflow") {
      if (dragState && dockLookup[dragState.itemId]?.category === "workflow") {
        return [...launcherWorkflowBaseItems, null]
      }
      return launcherWorkflowBaseItems
    }
    const dragItem = dockLookup[dragState.itemId]
    if (!dragItem || dragItem.category !== "workflow") {
      return launcherWorkflowBaseItems
    }
    const next: Array<(typeof visibleWorkflowLauncherItems)[number] | null> = [...launcherWorkflowBaseItems]
    const boundedIndex = Math.max(0, Math.min(launcherHoverTarget.index, next.length))
    next.splice(boundedIndex, 0, null)
    return next
  })()

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem(MOBILE_DOCK_KEY, JSON.stringify(dockItemIds.slice(0, 4)))
  }, [dockItemIds])

  useEffect(() => {
    if (typeof window === "undefined") return

    const forceHideImages = searchParams.get("hideImages") === "1"
    const forceShowImages = searchParams.get("showImages") === "1"

    if (forceHideImages) {
      setShowHomepageImages(false)
      return
    }

    if (forceShowImages) {
      setShowHomepageImages(true)
      return
    }

    setShowHomepageImages(
      isAdminSession() && window.localStorage.getItem(HOMEPAGE_IMAGES_KEY) === "true",
    )
  }, [searchParams])

  useEffect(() => {
    if (typeof window === "undefined") return

    const imageNodes = iconPreloadSources.map((src) => {
      const image = new window.Image()
      image.decoding = "async"
      image.src = src
      return image
    })

    return () => {
      for (const image of imageNodes) {
        image.src = ""
      }
    }
  }, [iconPreloadKey])

  useLayoutEffect(() => {
    const nextRects = new Map<string, DOMRect>()
    layoutNodeMapRef.current.forEach((node, key) => {
      const nextRect = node.getBoundingClientRect()
      const prevRect = previousRectMapRef.current.get(key)
      if (prevRect) {
        const deltaX = prevRect.left - nextRect.left
        const deltaY = prevRect.top - nextRect.top
        if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
          node.animate(
            [
              { transform: `translate(${deltaX}px, ${deltaY}px)` },
              { transform: "translate(0, 0)" },
            ],
            {
              duration: 180,
              easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
            },
          )
        }
      }
      nextRects.set(key, nextRect)
    })
    previousRectMapRef.current = nextRects
  }, [specialtyRenderItems, workflowRenderItems, dockRenderItems, dragHoverSlot, launcherHoverTarget])

  function bindLayoutNode(key: string) {
    return (node: HTMLElement | null) => {
      if (node) {
        layoutNodeMapRef.current.set(key, node)
      } else {
        layoutNodeMapRef.current.delete(key)
        previousRectMapRef.current.delete(key)
      }
    }
  }

  function handleLauncherScroll(event: UIEvent<HTMLDivElement>) {
    const target = event.currentTarget
    const nextPage = Math.round(target.scrollLeft / Math.max(target.clientWidth, 1))
    setLauncherPage(nextPage)
  }

  function removeDockItem(itemId: string) {
    setDockItemIds((current) => current.filter((id) => id !== itemId))
  }

  function beginPress(
    event: ReactPointerEvent<HTMLElement>,
    itemId: string,
    origin: "launcher" | "dock",
    onTap: () => void,
  ) {
    event.preventDefault()
    activePointerIdRef.current = event.pointerId
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current)
    }
    pressMetaRef.current = {
      itemId,
      origin,
      onTap,
      startX: event.clientX,
      startY: event.clientY,
      pointerId: event.pointerId,
      target: event.currentTarget,
    }
    pressTimerRef.current = window.setTimeout(() => {
      const meta = pressMetaRef.current
      if (!meta) return
      try {
        meta.target.setPointerCapture(meta.pointerId)
      } catch {
        // Ignore capture failures on unsupported targets/browsers.
      }
      setDragState({
        itemId: meta.itemId,
        origin: meta.origin,
        x: meta.startX,
        y: meta.startY,
      })
      dragActiveRef.current = true
      if (meta.origin === "dock") {
        const sourceItem = dockLookup[meta.itemId]
        if (sourceItem?.category === "specialty") {
          setLauncherPage(0)
          launcherScrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" })
        } else if (sourceItem?.category === "workflow") {
          setLauncherPage(1)
          launcherScrollerRef.current?.scrollTo({
            left: launcherScrollerRef.current.clientWidth,
            behavior: "smooth",
          })
        }
      }
      suppressTapUntilRef.current = Date.now() + 400
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate(12)
      }
      pressTimerRef.current = null
    }, 240)
  }

  function movePress(event: ReactPointerEvent<HTMLElement>) {
    if (dragActiveRef.current) return
    if (!pressTimerRef.current || !pressMetaRef.current) return
    const deltaX = Math.abs(event.clientX - pressMetaRef.current.startX)
    const deltaY = Math.abs(event.clientY - pressMetaRef.current.startY)
    if (deltaX > 18 || deltaY > 18) {
      window.clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
      pressMetaRef.current = null
    }
  }

  function endPress() {
    if (dragActiveRef.current || dragState) {
      return
    }
    if (Date.now() < suppressTapUntilRef.current) {
      if (pressMetaRef.current) {
        try {
          pressMetaRef.current.target.releasePointerCapture(pressMetaRef.current.pointerId)
        } catch {
          // Ignore release failures on unsupported targets/browsers.
        }
      }
      pressMetaRef.current = null
      return
    }
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current)
      pressTimerRef.current = null
      const meta = pressMetaRef.current
      pressMetaRef.current = null
      meta?.onTap()
      return
    }
    if (pressMetaRef.current) {
      try {
        pressMetaRef.current.target.releasePointerCapture(pressMetaRef.current.pointerId)
      } catch {
        // Ignore release failures on unsupported targets/browsers.
      }
    }
    pressMetaRef.current = null
  }

  useEffect(() => {
    function handleGlobalMove(event: PointerEvent) {
      if (dragActiveRef.current) return
      if (!pressTimerRef.current || !pressMetaRef.current) return
      const deltaX = Math.abs(event.clientX - pressMetaRef.current.startX)
      const deltaY = Math.abs(event.clientY - pressMetaRef.current.startY)
      if (deltaX > 18 || deltaY > 18) {
        window.clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
        pressMetaRef.current = null
      }
    }

    function handleGlobalRelease() {
      if (pressTimerRef.current) {
        if (Date.now() < suppressTapUntilRef.current) {
          pressMetaRef.current = null
          return
        }
        window.clearTimeout(pressTimerRef.current)
        pressTimerRef.current = null
        const meta = pressMetaRef.current
        pressMetaRef.current = null
        meta?.onTap()
      }
    }

    window.addEventListener("pointermove", handleGlobalMove)
    window.addEventListener("pointerup", handleGlobalRelease)
    window.addEventListener("pointercancel", handleGlobalRelease)
    return () => {
      window.removeEventListener("pointermove", handleGlobalMove)
      window.removeEventListener("pointerup", handleGlobalRelease)
      window.removeEventListener("pointercancel", handleGlobalRelease)
    }
  }, [])

  useEffect(() => {
    if (!dragState) return
    const currentDrag = dragState

    function handlePointerMove(event: PointerEvent) {
      if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) {
        return
      }
      event.preventDefault()
      setDragState((current) =>
        current
          ? {
              ...current,
              x: event.clientX,
              y: event.clientY,
            }
          : current,
      )
      const hoverTarget = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-dock-slot]")
      if (hoverTarget) {
        const slot = Number((hoverTarget as HTMLElement).dataset.dockSlot)
        setDragHoverSlot(Number.isNaN(slot) ? null : slot)
        setLauncherHoverTarget(null)
      } else {
        setDragHoverSlot(null)
        const launcherTarget = document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest("[data-launcher-slot]")
        if (launcherTarget) {
          const el = launcherTarget as HTMLElement
          const index = Number(el.dataset.launcherSlot)
          const category = el.dataset.launcherCategory as "specialty" | "workflow" | undefined
          if (!Number.isNaN(index) && category) {
            setLauncherHoverTarget({ category, index })
          } else {
            setLauncherHoverTarget(null)
          }
        } else {
          setLauncherHoverTarget(null)
        }
      }
    }

    function handlePointerUp(event: PointerEvent) {
      if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) {
        return
      }
      const dropTarget = document.elementFromPoint(event.clientX, event.clientY)?.closest("[data-dock-slot]")
      if (dropTarget) {
        const slot = Number((dropTarget as HTMLElement).dataset.dockSlot)
        if (!Number.isNaN(slot)) {
          setDockItemIds((current) => {
            const next = [...current]
            const existingIndex = next.indexOf(currentDrag.itemId)
            const dragItem = dockLookup[currentDrag.itemId]
            const targetItemId = next[slot]
            const targetItem = targetItemId ? dockLookup[targetItemId] : null

            if (dragItem && targetItem && dragItem.category !== targetItem.category) {
              return current
            }

            if (existingIndex !== -1) {
              next.splice(existingIndex, 1)
            }

            const boundedIndex = Math.max(0, Math.min(slot, Math.min(next.length, 3)))

            if (existingIndex === -1 && next.length >= 4) {
              next.splice(boundedIndex, 1, currentDrag.itemId)
              return next
            }

            next.splice(boundedIndex, 0, currentDrag.itemId)
            return next.slice(0, 4)
          })
        }
      } else {
        const launcherTarget = document
          .elementFromPoint(event.clientX, event.clientY)
          ?.closest("[data-launcher-slot]") as HTMLElement | null
        const category = launcherTarget?.dataset.launcherCategory as "specialty" | "workflow" | undefined
        const index = launcherTarget ? Number(launcherTarget.dataset.launcherSlot) : NaN
        const dragItem = dockLookup[currentDrag.itemId]

        if (launcherTarget && category && !Number.isNaN(index) && dragItem?.category === category) {
          if (currentDrag.origin === "dock") {
            removeDockItem(currentDrag.itemId)
          }

          if (category === "specialty") {
            const nextVisible = visibleSpecialtyItems
              .map((item) => item.id)
              .filter((id) => id !== currentDrag.itemId)
            const boundedIndex = Math.max(0, Math.min(index, nextVisible.length))
            nextVisible.splice(boundedIndex, 0, currentDrag.itemId)
            setSpecialtyOrderMap((current) => ({
              ...current,
              [activeWorkspace]: [...nextVisible, ...hiddenSpecialtyIds.filter((id) => id !== currentDrag.itemId)],
            }))
          } else {
            const nextVisible = visibleWorkflowLauncherItems
              .map((item) => item.id)
              .filter((id) => id !== currentDrag.itemId)
            const boundedIndex = Math.max(0, Math.min(index, nextVisible.length))
            nextVisible.splice(boundedIndex, 0, currentDrag.itemId)
            setWorkflowOrder([...nextVisible, ...hiddenWorkflowIds.filter((id) => id !== currentDrag.itemId)])
          }
        } else if (currentDrag.origin === "dock") {
          removeDockItem(currentDrag.itemId)
        }
      }
      setDragState(null)
      setDragHoverSlot(null)
      setLauncherHoverTarget(null)
      dragActiveRef.current = false
      activePointerIdRef.current = null
      if (pressMetaRef.current) {
        try {
          pressMetaRef.current.target.releasePointerCapture(pressMetaRef.current.pointerId)
        } catch {
          // Ignore release failures on unsupported targets/browsers.
        }
      }
      pressMetaRef.current = null
      suppressTapUntilRef.current = Date.now() + 250
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: false })
    window.addEventListener("pointerup", handlePointerUp, { once: true })
    window.addEventListener("pointercancel", handlePointerUp, { once: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
      window.removeEventListener("pointercancel", handlePointerUp)
    }
  })

  useEffect(() => {
    if (typeof document === "undefined") return
    const previousTouchAction = document.body.style.touchAction
    const previousOverflow = document.body.style.overflow
    if (dragState) {
      document.body.style.touchAction = "none"
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.touchAction = previousTouchAction
      document.body.style.overflow = previousOverflow
    }
  }, [dragState])

  return (
    <div className="relative flex h-[calc(100dvh-61px)] max-w-xl flex-col overflow-hidden animate-step-in bg-[#E8EEF6] px-3 pb-24 pt-3 lg:h-auto lg:max-w-none lg:overflow-visible lg:bg-transparent lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(232,238,246,0.82)_38%,_rgba(221,231,244,0.9)_100%)]" />
        <div className="absolute -left-10 top-8 h-36 w-36 rounded-full bg-[#8EC5FF]/38 blur-3xl" />
        <div className="absolute right-[-24px] top-20 h-32 w-32 rounded-full bg-[#95EAD9]/30 blur-3xl" />
        <div className="absolute bottom-24 left-10 h-28 w-28 rounded-full bg-[#C7B9FF]/24 blur-3xl" />
      </div>
      <div className="mb-10 hidden lg:block">
        <div className="relative overflow-hidden rounded-[40px] border border-[#12304C] bg-[#07111E] shadow-[0_40px_90px_rgba(15,23,42,0.32)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(77,163,255,0.18),_transparent_30%),radial-gradient(circle_at_85%_12%,_rgba(20,184,166,0.14),_transparent_22%),linear-gradient(140deg,#07111E_0%,#091827_38%,#0C2237_100%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
          <div className="relative z-10 border-b border-white/10 px-8 py-5">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
              <div className="flex items-center gap-4">
                {hideHomepageImages ? (
                  <div className="flex h-16 min-w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-4">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[#7DD3FC]">PS</span>
                  </div>
                ) : (
                  <Image src="/AIchaticon.png" alt="" width={64} height={64} className="h-16 w-16 object-contain" />
                )}
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[#7DD3FC]">PS</p>
                  <p className="text-[28px] font-semibold tracking-[-0.05em] text-white">PrepSight</p>
                </div>
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/38" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  placeholder="Search procedure, anatomy, implant system, product, or catalogue item..."
                  className="w-full rounded-[22px] border border-white/10 bg-white/8 py-4 pl-13 pr-5 text-[15px] text-white placeholder:text-white/38 backdrop-blur-xl transition-colors focus:border-[#7DD3FC]/70 focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]/20"
                />

                {showResults && results.length > 0 && (
                  <div className="absolute inset-x-0 top-[calc(100%+16px)] z-30 overflow-hidden rounded-[26px] border border-white/10 bg-[#0D1926] shadow-[0_30px_70px_rgba(15,23,42,0.32)]">
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        href={getProcedureSearchHref(p)}
                        className="flex items-center justify-between border-b border-white/8 px-5 py-4 transition-colors last:border-0 hover:bg-white/5"
                      >
                        <div className="mr-3 min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                          <p className="mt-1 text-xs text-white/52">{p.specialty}</p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/74">
                          {p.setting}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {showResults && results.length === 0 && (
                  <div className="absolute inset-x-0 top-[calc(100%+16px)] z-30 rounded-[26px] border border-white/10 bg-[#0D1926] px-5 py-4 text-sm text-white/60 shadow-[0_30px_70px_rgba(15,23,42,0.32)]">
                    No procedures found.
                  </div>
                )}
              </div>

              <div className="justify-self-end text-right">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">{getGreeting().replace(".", "")}</p>
                <p className="mt-2 text-sm text-white/70">{profile ? getContextBadge(profile) : "Browse and reference"}</p>
                <div className="mt-5 inline-flex min-w-[220px] flex-col rounded-[24px] border border-white/10 bg-white/8 px-5 py-4 text-left shadow-[0_18px_34px_rgba(15,23,42,0.18)] backdrop-blur-xl">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">Procedure cards available</p>
                  <p className="mt-2 text-[40px] font-semibold leading-none tracking-[-0.06em] text-white">0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 px-8 pb-8 pt-7">
            <div className="grid grid-cols-[1.45fr_0.9fr] gap-6">
              <div className="min-w-0">
                <p className="text-[14px] font-medium tracking-[0.2em] text-white/42">Workspace</p>
                <h1 className="mt-4 max-w-[11ch] text-[78px] font-semibold leading-[0.92] tracking-[-0.07em] text-white">
                  {activeWorkspaceItem?.label ?? "Operating Theatre"}
                </h1>
                <p className="mt-5 max-w-2xl text-[16px] leading-8 text-[#B9CDE2]">
                  Open the current area like a browser engine for procedural knowledge. Move from specialty to anatomy to authored cards without losing the visual thread.
                </p>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/42">Registered areas</p>
                <div className="mt-5 grid gap-3">
                  {workspaceItems.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveWorkspace(item.id.replace("setting-", "") as ClinicalSetting)}
                      className="rounded-[24px] px-5 py-5 text-left text-white transition-transform hover:-translate-y-1 [animation:desktopCardRise_0.55s_cubic-bezier(0.2,0.8,0.2,1)_both]"
                      style={{
                        animationDelay: `${index * 60}ms`,
                        backgroundColor: item.solid,
                        boxShadow: `0 24px 40px ${item.solid}40`,
                      }}
                    >
                      <p className="text-[28px] font-semibold tracking-[-0.04em]">{item.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-[1.25fr_0.75fr] gap-6">
              <div>
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-[14px] font-medium tracking-[0.2em] text-white/42">Specialties</p>
                    <h2 className="mt-3 text-[42px] font-semibold tracking-[-0.06em] text-white">
                      {activeWorkspaceItem?.label ?? "Operating Theatre"}
                    </h2>
                  </div>
                  <p className="max-w-sm text-right text-sm leading-7 text-white/48">
                    Open any specialty as its own dedicated browser space.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {orderedSpecialtyItems.map((specialty, index) => (
                    <Link
                      key={specialty.id}
                      href={specialty.href}
                      className="relative min-h-[270px] overflow-hidden rounded-[30px] text-white transition-transform hover:-translate-y-1 [animation:desktopCardRise_0.55s_cubic-bezier(0.2,0.8,0.2,1)_both]"
                      style={{
                        animationDelay: `${index * 45}ms`,
                        background: `linear-gradient(145deg, ${specialty.tileColor} 0%, ${specialty.tileColor}DD 100%)`,
                        boxShadow: `0 30px 50px ${specialty.tileColor}3D`,
                      }}
                    >
                      {!hideHomepageImages && SPECIALTY_IMAGE_MAP[specialty.fullLabel] && !failedImages.has(specialty.fullLabel) ? (
                        <>
                          {/* Image centered, bleeds to edges */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={SPECIALTY_IMAGE_MAP[specialty.fullLabel]!}
                            alt=""
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] object-contain opacity-75"
                            style={{ width: 270, height: 270, mixBlendMode: "multiply" }}
                            onError={() => setFailedImages((prev) => new Set(prev).add(specialty.fullLabel))}
                          />
                          {/* Gradient scrim at bottom so text stays readable */}
                          <div
                            className="absolute inset-x-0 bottom-0 h-20 rounded-b-[30px]"
                            style={{ background: `linear-gradient(to top, ${specialty.tileColor}EE 0%, transparent 100%)` }}
                          />
                          {/* Text pinned bottom */}
                          <p className="absolute inset-x-0 bottom-0 px-5 pb-5 text-center font-semibold leading-tight tracking-[-0.03em]" style={{ fontSize: 32 }}>
                            {specialty.fullLabel}
                          </p>
                        </>
                      ) : hideHomepageImages ? (
                        <div className="flex h-full min-h-[270px] items-center justify-center px-8 py-8">
                          <p className="text-center text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                            {specialty.fullLabel}
                          </p>
                        </div>
                      ) : (
                        <div className="flex h-full min-h-[270px] flex-col items-center justify-center gap-5 px-6 py-6">
                          {(() => {
                            const SvgIcon = SPECIALTY_SVG_ICON[specialty.fullLabel]
                            if (SvgIcon) return <SvgIcon size={80} className="opacity-80" />
                            const LucideIcon = specialty.icon
                            return <LucideIcon size={64} strokeWidth={1.2} className="opacity-70" />
                          })()}
                          <p className="text-center text-[22px] font-semibold leading-tight tracking-[-0.03em]">
                            {specialty.fullLabel}
                          </p>
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid content-start gap-4">
                <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
                  <p className="text-[14px] font-medium tracking-[0.2em] text-white/42">Workflow tools</p>
                  <div className="mt-5 grid gap-3">
                    {WORKFLOW_TOOLS.map((tool, index) => (
                      <Link
                        key={tool.label}
                        href={tool.available && tool.href ? tool.href : "#"}
                        className={`rounded-[24px] px-5 py-5 text-white transition-transform hover:-translate-y-1 [animation:desktopCardRise_0.55s_cubic-bezier(0.2,0.8,0.2,1)_both] ${!tool.available ? "pointer-events-none opacity-55" : ""}`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          background: `linear-gradient(145deg, ${tool.tileColor} 0%, ${tool.tileColor}D9 100%)`,
                          boxShadow: `0 24px 40px ${tool.tileColor}38`,
                        }}
                      >
                        <p className="text-[25px] font-semibold tracking-[-0.04em]">{tool.label}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                {recentCards.length > 0 && (
                  <div className="rounded-[30px] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
                    <p className="text-[14px] font-medium tracking-[0.2em] text-white/42">Recently viewed</p>
                    <div className="mt-5 grid gap-3">
                      {recentCards.map((card, index) => (
                        <Link
                          key={`${card.entry.procedureId}-${card.entry.variantId ?? "base"}-${card.entry.systemId ?? "base"}`}
                          href={card.href}
                          className="rounded-[24px] border border-white/10 bg-white/6 px-5 py-5 text-white transition-colors hover:bg-white/10 [animation:desktopCardRise_0.55s_cubic-bezier(0.2,0.8,0.2,1)_both]"
                          style={{ animationDelay: `${index * 45}ms` }}
                        >
                          <p className="text-[24px] font-semibold tracking-[-0.04em]">
                            {card.system?.name ?? card.procedure.name}
                          </p>
                          <p className="mt-3 text-sm leading-7 text-white/62">
                            {formatRecentSubtitle(card.procedure.name, card.variant?.name)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col lg:hidden">
        <div className={`mb-3 overflow-visible rounded-[30px] bg-gradient-to-br ${activeWorkspaceMeta.surface} px-3 pb-2.5 pt-2.5 text-white shadow-[0_18px_38px_rgba(15,23,42,0.2)]`}>
          <div className="relative overflow-hidden rounded-[24px] border border-white/15 bg-white/8 px-3 py-2.5 backdrop-blur-[14px]">
            <div className={`pointer-events-none absolute -right-5 -top-5 h-16 w-16 rounded-full ${activeWorkspaceMeta.glow} blur-2xl`} />
            <div className={`pointer-events-none absolute bottom-2 right-6 h-10 w-10 rounded-full ${activeWorkspaceMeta.blip} opacity-25 blur-xl`} />
            <div className="relative z-10">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Workspace
                  </p>
                  <h2 className="mt-0.5 text-[18px] font-semibold leading-5">
                    {activeWorkspaceItem?.label ?? "Operating Theatre"}
                  </h2>
                </div>
                {canSwitchWorkspace ? (
                  <button
                    type="button"
                    onClick={() => {
                      const currentIndex = workspaceItems.findIndex((item) => item.id === `setting-${activeWorkspace}`)
                      const nextItem = workspaceItems[(currentIndex + 1) % workspaceItems.length] ?? workspaceItems[0]
                      const nextWorkspace = nextItem.id.replace("setting-", "") as ClinicalSetting
                      setActiveWorkspace(nextWorkspace)
                      setLauncherPage(0)
                      launcherScrollerRef.current?.scrollTo({ left: 0, behavior: "smooth" })
                    }}
                    className={`flex h-10 w-10 items-center justify-center rounded-[15px] ${activeWorkspaceMeta.accent} shadow-[0_10px_20px_rgba(15,23,42,0.16)]`}
                    aria-label="Switch workspace"
                  >
                    <ArrowRightLeft size={16} className="text-[#10243E]" />
                  </button>
                ) : null}
              </div>

              <div className="relative z-20">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/45"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      submitSearch()
                    }
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  placeholder="Search any keyword..."
                  className="w-full rounded-[16px] border border-white/12 bg-white/12 py-2.5 pl-10 pr-12 text-[13px] text-white placeholder:text-white/45 backdrop-blur-sm transition-colors focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/15"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={submitSearch}
                  disabled={results.length === 0}
                  aria-label="Search"
                  className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#10243E] shadow-[0_8px_18px_rgba(15,23,42,0.18)] transition-transform hover:scale-[1.03] disabled:cursor-default disabled:opacity-35"
                >
                  <ArrowUp size={14} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>

          {showResults && results.length > 0 && (
            <div className="pointer-events-auto absolute inset-x-2 top-[calc(100%-2px)] z-50 overflow-hidden rounded-[24px] border border-[#D5DCE3] bg-white shadow-[0_24px_44px_rgba(15,23,42,0.24)]">
              {results.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={getProcedureSearchHref(p)}
                  className="flex items-center justify-between border-b border-[#F4F7FA] px-4 py-3 transition-colors last:border-0 hover:bg-[#F8FBFF]"
                >
                  <div className="mr-3 min-w-0">
                    <p className="truncate text-sm font-semibold text-[#3F4752]">{p.name}</p>
                    <p className="text-xs text-[#94a3b8]">{p.specialty}</p>
                  </div>
                  <ChevronRight size={14} className="shrink-0 text-[#94a3b8]" />
                </Link>
              ))}
            </div>
          )}

          {showResults && results.length === 0 && (
            <p className="pointer-events-auto absolute inset-x-2 top-[calc(100%-2px)] z-50 rounded-[24px] border border-[#D5DCE3] bg-white px-4 py-3 text-sm text-[#94a3b8] shadow-[0_24px_44px_rgba(15,23,42,0.24)]">
              No procedures found.
            </p>
          )}
        </div>

        <div className="min-h-0 flex-1 px-0.5 pt-1">
          <div className="mb-1 px-1">
            <p className="text-sm font-semibold text-[#10243E]">
              {launcherPage === 0 ? "Specialties" : "Workflow tools"}
            </p>
          </div>
          <div className="mb-2 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-[#F8FBFF]/85 px-3 py-1.5 shadow-[0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl">
              {[0, 1].map((index) => (
                <span
                  key={`launcher-dot-${index}`}
                  className={`h-1.5 rounded-full transition-all ${
                    launcherPage === index ? "w-6 bg-[#10243E]" : "w-2 bg-[#CBD5E1]"
                  }`}
                />
              ))}
            </div>
          </div>
          <div
            ref={launcherScrollerRef}
            onScroll={handleLauncherScroll}
            className="-mx-1 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex">
              <div className="w-full shrink-0 snap-center px-1">
                <div className="grid grid-cols-4 gap-x-2.5 gap-y-4 rounded-[28px] bg-white/30 px-2 py-2.5 backdrop-blur-[6px]">
                  {specialtyRenderItems.map((specialty, index) => (
                    specialty ? (
                      <button
                        key={specialty.id}
                        ref={bindLayoutNode(`specialty-${specialty.id}`)}
                        type="button"
                        onPointerDown={(event) =>
                          beginPress(event, specialty.id, "launcher", () => router.push(specialty.href))
                        }
                        onPointerMove={movePress}
                        onPointerUp={endPress}
                        onPointerCancel={endPress}
                        onContextMenu={(event) => event.preventDefault()}
                        className={`group flex select-none flex-col items-center text-center ${dragState?.itemId === specialty.id ? "opacity-0" : ""}`}
                        data-launcher-slot={index}
                        data-launcher-category="specialty"
                        title={specialty.fullLabel}
                        style={DRAGGABLE_ITEM_STYLE}
                      >
                        <div
                          className="relative mb-1.5 flex h-14 w-14 items-center justify-center rounded-[20px] ring-1 ring-black/5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
                          style={mobileIconShellStyle(specialty.tileColor)}
                        >
                          <div
                            className="pointer-events-none absolute inset-x-1.5 top-1.5 h-5 rounded-[14px]"
                            style={mobileIconGlossStyle(specialty.tileColor)}
                          />
                          {specialty.imageSrc && !failedImages.has(specialty.fullLabel) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={specialty.imageSrc}
                              alt=""
                              loading="eager"
                              fetchPriority="high"
                              decoding="async"
                              className={`${mobileSpecialtyImageClassName(specialty.fullLabel)} drop-shadow-[0_1px_2px_rgba(15,23,42,0.22)]`}
                              onError={() => setFailedImages((prev) => new Set(prev).add(specialty.fullLabel))}
                            />
                          ) : specialty.svgIcon ? (
                            <specialty.svgIcon size={mobileSpecialtyIconSize(specialty.fullLabel)} className="text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.28)]" />
                          ) : (
                            <specialty.icon size={mobileSpecialtyIconSize(specialty.fullLabel)} className="text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.28)]" />
                          )}
                        </div>
                        <p className="line-clamp-1 text-[11px] font-semibold leading-4 text-[#1E293B]">
                          {specialty.shortLabel}
                        </p>
                      </button>
                    ) : (
                      <div
                        key={`specialty-placeholder-${index}`}
                        ref={bindLayoutNode(`specialty-slot-${index}`)}
                        data-launcher-slot={index}
                        data-launcher-category="specialty"
                        className="flex flex-col items-center text-center"
                      >
                        <div className={`mb-1.5 h-14 w-14 rounded-[20px] border-2 border-dashed shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] transition-all duration-150 ${launcherHoverTarget?.category === "specialty" && launcherHoverTarget.index === index ? "border-[#4DA3FF] bg-[#DCEEFF]/92 scale-105" : "border-[#93C5FD] bg-white/38"}`} />
                        <div className="h-4" />
                      </div>
                    )
                  ))}
                </div>
              </div>
              <div className="w-full shrink-0 snap-center px-1">
                <div className="grid grid-cols-4 gap-x-2.5 gap-y-4 rounded-[28px] bg-white/30 px-2 py-2.5 backdrop-blur-[6px]">
                  {workflowRenderItems.map((tool, index) => {
                    if (!tool) {
                      return (
                        <div
                          key={`workflow-placeholder-${index}`}
                          ref={bindLayoutNode(`workflow-slot-${index}`)}
                          data-launcher-slot={index}
                          data-launcher-category="workflow"
                          className="flex flex-col items-center text-center"
                        >
                          <div className={`mb-1.5 h-14 w-14 rounded-[20px] border-2 border-dashed shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)] transition-all duration-150 ${launcherHoverTarget?.category === "workflow" && launcherHoverTarget.index === index ? "border-[#14B8A6] bg-[#D6FCF6]/92 scale-105" : "border-[#5EEAD4] bg-white/38"}`} />
                          <div className="h-4" />
                        </div>
                      )
                    }

                    const Icon = tool.icon
                    const content = (
                      <>
                        <div
                          className="relative mb-1.5 flex h-14 w-14 items-center justify-center rounded-[20px] ring-1 ring-black/5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
                          style={mobileIconShellStyle(tool.tileColor)}
                        >
                          <div
                            className="pointer-events-none absolute inset-x-1.5 top-1.5 h-5 rounded-[14px]"
                            style={mobileIconGlossStyle(tool.tileColor)}
                          />
                          {tool.imageSrc && !failedImages.has(tool.id) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={tool.imageSrc}
                              alt=""
                              loading="eager"
                              fetchPriority="high"
                              decoding="async"
                              className={`${mobileWorkflowImageClassName(tool.label)} drop-shadow-[0_1px_2px_rgba(15,23,42,0.22)]`}
                              onError={() => setFailedImages((prev) => new Set(prev).add(tool.id))}
                            />
                          ) : (
                            <Icon size={24} className="text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.28)]" />
                          )}
                        </div>
                        <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-[#1E293B]">
                          {tool.label}
                        </p>
                      </>
                    )

                    return (
                      <button
                        key={`workflow-page-${tool.label}`}
                        ref={bindLayoutNode(`workflow-${tool.id}`)}
                        type="button"
                        onPointerDown={(event) =>
                          beginPress(event, tool.id, "launcher", () => {
                            if (tool.available && tool.href) {
                              router.push(tool.href)
                            }
                          })
                        }
                        onPointerMove={movePress}
                        onPointerUp={endPress}
                        onPointerCancel={endPress}
                        onContextMenu={(event) => event.preventDefault()}
                        className={`group flex select-none flex-col items-center text-center ${dragState?.itemId === tool.id ? "opacity-0" : ""}`}
                        data-launcher-slot={index}
                        data-launcher-category="workflow"
                        style={DRAGGABLE_ITEM_STYLE}
                      >
                        {content}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+14px)] pt-1 lg:hidden">
        <div
          className="rounded-[28px] bg-white/74 px-2.5 py-2 shadow-[0_12px_28px_rgba(15,23,42,0.12)] backdrop-blur-xl"
          data-dock-slot={Math.min(visibleDockItems.length, 3)}
        >
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${Math.max(dragState ? Math.max(dockRenderItems.length, 4) : dockRenderItems.length, 1)}, minmax(0, 1fr))` }}
          >
            {(dragState
              ? [...dockRenderItems, ...Array(Math.max(0, 4 - dockRenderItems.length)).fill(null)]
              : dockRenderItems
            ).map((item, index) => {
              return (
                <div
                  key={`dock-slot-${item ? item.id : index}`}
                  ref={bindLayoutNode(`dock-${item ? item.id : `slot-${index}`}`)}
                  data-dock-slot={index}
                  className={`flex justify-center rounded-[20px] transition-colors ${
                    dragHoverSlot === index ? "bg-[#DCEEFF]/85" : ""
                  }`}
                  style={dragState ? { marginTop: -24, paddingTop: 24 } : undefined}
                >
                  {item ? item.available ? (
                    <button
                      type="button"
                      onPointerDown={(event) =>
                        beginPress(event, item.id, "dock", () => router.push(item.href))
                      }
                      onPointerMove={movePress}
                      onPointerUp={endPress}
                      onPointerCancel={endPress}
                      onContextMenu={(event) => event.preventDefault()}
                      className={`group flex w-full select-none flex-col items-center px-1 py-1 text-center ${dragState?.itemId === item.id ? "opacity-0" : ""}`}
                      style={DRAGGABLE_ITEM_STYLE}
                    >
                      <div
                        className="relative mb-1 flex h-14 w-14 items-center justify-center rounded-[20px] transition-transform duration-200 ease-out"
                        style={mobileIconShellStyle(item.tileColor)}
                      >
                        <div
                          className="pointer-events-none absolute inset-x-1.5 top-1.5 h-5 rounded-[14px]"
                          style={mobileIconGlossStyle(item.tileColor)}
                        />
                        {"imageSrc" in item && "fullLabel" in item && item.imageSrc && !failedImages.has(item.fullLabel) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageSrc}
                            alt=""
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className={`${mobileSpecialtyImageClassName(item.fullLabel)} drop-shadow-[0_1px_2px_rgba(15,23,42,0.22)]`}
                            onError={() => setFailedImages((prev) => new Set(prev).add(item.fullLabel))}
                          />
                        ) : "imageSrc" in item && "label" in item && item.imageSrc && !failedImages.has(item.id) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageSrc}
                            alt=""
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className={`${mobileWorkflowImageClassName(item.label)} drop-shadow-[0_1px_2px_rgba(15,23,42,0.22)]`}
                            onError={() => setFailedImages((prev) => new Set(prev).add(item.id))}
                          />
                        ) : "svgIcon" in item && item.svgIcon ? (
                          <item.svgIcon size={"fullLabel" in item ? mobileSpecialtyIconSize(item.fullLabel) : 24} className="text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.28)]" />
                        ) : (
                          <item.icon size={"fullLabel" in item ? mobileSpecialtyIconSize(item.fullLabel) : 24} className="text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.28)]" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-[#10243E]">
                        {"shortLabel" in item ? item.shortLabel : item.label}
                      </p>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onPointerDown={(event) => beginPress(event, item.id, "dock", () => {})}
                      onPointerMove={movePress}
                      onPointerUp={endPress}
                      onPointerCancel={endPress}
                      onContextMenu={(event) => event.preventDefault()}
                      className={`group flex w-full select-none flex-col items-center px-1 py-1 text-center ${dragState?.itemId === item.id ? "opacity-0" : ""}`}
                      style={DRAGGABLE_ITEM_STYLE}
                    >
                      <div
                        className="relative mb-1 flex h-14 w-14 items-center justify-center rounded-[20px] transition-transform duration-200 ease-out"
                        style={mobileIconShellStyle(item.tileColor)}
                      >
                        <div
                          className="pointer-events-none absolute inset-x-1.5 top-1.5 h-5 rounded-[14px]"
                          style={mobileIconGlossStyle(item.tileColor)}
                        />
                        {"imageSrc" in item && "label" in item && item.imageSrc && !failedImages.has(item.id) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageSrc}
                            alt=""
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className={`${mobileWorkflowImageClassName(item.label)} drop-shadow-[0_1px_2px_rgba(15,23,42,0.22)]`}
                            onError={() => setFailedImages((prev) => new Set(prev).add(item.id))}
                          />
                        ) : (
                          <item.icon size={24} className="text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.28)]" />
                        )}
                      </div>
                      <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-[#10243E]">
                        {"shortLabel" in item ? item.shortLabel : item.label}
                      </p>
                    </button>
                  ) : (
                    <div className="flex min-h-[84px] w-full items-center justify-center rounded-[20px]">
                      <div className={`h-14 w-14 rounded-[20px] border-2 border-dashed transition-all duration-150 ${dragHoverSlot === index ? "border-[#4DA3FF] bg-[#DCEEFF]/92 scale-105" : "border-[#93C5FD] bg-white/28"}`} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {dragState && dragPreviewItem && (
        <div
          className="pointer-events-none fixed z-[60] lg:hidden"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${dragState.x - 32}px, ${dragState.y - 40}px, 0)`,
          }}
        >
          <div className="flex flex-col items-center text-center">
            <div
              className="relative mb-1 flex h-16 w-16 items-center justify-center rounded-[22px] shadow-[0_22px_40px_rgba(15,23,42,0.32)] ring-2 ring-white/80"
              style={mobileIconShellStyle(dragPreviewItem.tileColor)}
            >
              <div
                className="pointer-events-none absolute inset-x-2 top-2 h-6 rounded-[16px]"
                style={mobileIconGlossStyle(dragPreviewItem.tileColor)}
              />
              {"imageSrc" in dragPreviewItem && "fullLabel" in dragPreviewItem && dragPreviewItem.imageSrc && !failedImages.has(dragPreviewItem.fullLabel) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dragPreviewItem.imageSrc}
                  alt=""
                  className={`${mobileSpecialtyImageClassName(dragPreviewItem.fullLabel)} drop-shadow-[0_1px_2px_rgba(15,23,42,0.22)]`}
                  onError={() => setFailedImages((prev) => new Set(prev).add(dragPreviewItem.fullLabel))}
                />
              ) : "imageSrc" in dragPreviewItem && "label" in dragPreviewItem && dragPreviewItem.imageSrc && !failedImages.has(dragPreviewItem.id) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dragPreviewItem.imageSrc}
                  alt=""
                  className={`${mobileWorkflowImageClassName(dragPreviewItem.label)} drop-shadow-[0_1px_2px_rgba(15,23,42,0.22)]`}
                  onError={() => setFailedImages((prev) => new Set(prev).add(dragPreviewItem.id))}
                />
              ) : "svgIcon" in dragPreviewItem && dragPreviewItem.svgIcon ? (
                <dragPreviewItem.svgIcon
                  size={"fullLabel" in dragPreviewItem ? mobileSpecialtyIconSize(dragPreviewItem.fullLabel) : 24}
                  className="text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.28)]"
                />
              ) : (
                <dragPreviewItem.icon
                  size={"fullLabel" in dragPreviewItem ? mobileSpecialtyIconSize(dragPreviewItem.fullLabel) : 24}
                  className="text-white drop-shadow-[0_1px_2px_rgba(15,23,42,0.28)]"
                />
              )}
            </div>
            <p className="max-w-[64px] text-[10px] font-semibold leading-3 text-[#10243E]">
              {"shortLabel" in dragPreviewItem ? dragPreviewItem.shortLabel : dragPreviewItem.label}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
