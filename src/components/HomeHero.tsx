"use client"

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type UIEvent } from "react"
import {
  Activity,
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
import { useRouter } from "next/navigation"
import { procedures } from "@/lib/data"
import { getHistory } from "@/lib/history"
import { getProfile, getRelevantSettings } from "@/lib/profile"
import { getProcedureVariantById, getSystemById } from "@/lib/variants"
import {
  ClinicalSetting,
  PrepSightProfile,
  USER_ROLE_LABEL,
} from "@/lib/types"
import { SETTING_COLOUR, SETTING_SPECIALTIES } from "@/lib/settings"

const WORKSPACE_META: Record<
  ClinicalSetting,
  { icon: typeof Stethoscope; tile: string }
> = {
  "Operating Theatre": { icon: Stethoscope, tile: "bg-[#4DA3FF]" },
  "Endoscopy Suite": { icon: Waves, tile: "bg-[#14B8A6]" },
  "Interventional Radiology / Cath Lab": { icon: Activity, tile: "bg-[#7C5CFC]" },
  "Emergency Department": { icon: HeartPulse, tile: "bg-[#F97316]" },
  "Intensive Care Unit": { icon: BedSingle, tile: "bg-[#2563EB]" },
  Ward: { icon: Building2, tile: "bg-[#10B981]" },
  "Outpatient / Clinic": { icon: Pill, tile: "bg-[#6366F1]" },
  "Maternity & Obstetrics": { icon: HeartPulse, tile: "bg-[#EC4899]" },
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
  Cardiothoracic: "CTS",
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

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return "Good morning."
  if (h < 17) return "Good afternoon."
  return "Good evening."
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

export default function HomeHero() {
  const router = useRouter()
  const [profile] = useState<PrepSightProfile | null>(() => getProfile())
  const [recentEntries] = useState<ReturnType<typeof getHistory>>(() => getHistory())
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const [relevantSettings] = useState<ClinicalSetting[]>(() =>
    profile ? getRelevantSettings(profile) : [],
  )
  const [activeWorkspace, setActiveWorkspace] = useState<ClinicalSetting>(() =>
    relevantSettings[0] ?? "Operating Theatre",
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

  const results = query.trim().length > 1
    ? procedures.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.specialty.toLowerCase().includes(query.toLowerCase()),
      ).slice(0, 8)
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

  const showResults = focused && query.trim().length > 1
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
  }))
  const activeWorkspaceItem = workspaceItems.find((item) => item.id === `setting-${activeWorkspace}`) ?? workspaceItems[0]
  const activeWorkspaceMeta = WORKSPACE_HERO_META[activeWorkspace]
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
    available: true,
    category: "specialty" as const,
  }))
  const workflowLauncherItems = WORKFLOW_TOOLS.map((tool) => ({
    id: `tool-${tool.label.toLowerCase().replace(/\s+/g, "-")}`,
    label: tool.label,
    href: tool.href,
    tileColor: tool.tileColor,
    icon: tool.icon,
    available: tool.available,
    category: "workflow" as const,
  }))
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
    <div className="relative flex h-[calc(100dvh-61px)] max-w-xl flex-col overflow-hidden animate-step-in bg-[#E8EEF6] px-3 pb-24 pt-3 lg:h-auto lg:max-w-xl lg:overflow-visible lg:bg-transparent lg:px-8 lg:py-12">
      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_rgba(232,238,246,0.82)_38%,_rgba(221,231,244,0.9)_100%)]" />
        <div className="absolute -left-10 top-8 h-36 w-36 rounded-full bg-[#8EC5FF]/38 blur-3xl" />
        <div className="absolute right-[-24px] top-20 h-32 w-32 rounded-full bg-[#95EAD9]/30 blur-3xl" />
        <div className="absolute bottom-24 left-10 h-28 w-28 rounded-full bg-[#C7B9FF]/24 blur-3xl" />
      </div>
      <div className="mb-8 hidden lg:block">
        <h1 className="mb-2.5 text-2xl font-bold text-[#3F4752]">
          {getGreeting()}
        </h1>
        {profile && (
          <span className="inline-block rounded-full border border-[#D5DCE3] bg-white px-3 py-1.5 text-xs font-semibold text-[#64748b]">
            {getContextBadge(profile)}
          </span>
        )}
      </div>

      <div className="mb-6 hidden overflow-hidden rounded-2xl border border-[#D5DCE3] bg-white shadow-sm lg:block">
        <div className="bg-[#1E293B] px-5 py-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/50">
            Find a procedure
          </p>
          <p className="text-base font-semibold text-white">
            Search by name or specialty.
          </p>
        </div>

        <div className="p-5">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="e.g. Total knee replacement, Orthopaedics..."
              className="w-full rounded-xl border border-[#D5DCE3] bg-[#F8FBFF] py-3 pl-10 pr-4 text-sm text-[#3F4752] placeholder-[#94a3b8] transition-colors focus:border-[#4DA3FF] focus:outline-none focus:ring-2 focus:ring-[#CFE6FF]"
            />
          </div>
        </div>

        {showResults && results.length > 0 && (
          <div className="mx-5 mb-5 overflow-hidden rounded-xl border border-[#D5DCE3] bg-white">
            {results.map((p) => (
              <Link
                key={p.id}
                href={`/procedures/${p.id}`}
                className="flex items-center justify-between border-b border-[#F4F7FA] px-4 py-3 transition-colors last:border-0 hover:bg-[#F4F7FA]"
              >
                <div className="mr-3 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#3F4752]">
                    {p.name}
                  </p>
                  <p className="text-xs text-[#94a3b8]">{p.specialty}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${SETTING_COLOUR[p.setting] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {p.setting.split(" ")[0]}
                </span>
              </Link>
            ))}
          </div>
        )}

        {showResults && results.length === 0 && (
          <p className="mx-5 mb-5 text-sm text-[#94a3b8]">No procedures found.</p>
        )}
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
                <div className={`flex h-10 w-10 items-center justify-center rounded-[15px] ${activeWorkspaceMeta.accent} shadow-[0_10px_20px_rgba(15,23,42,0.16)]`}>
                  {activeWorkspaceItem && (
                    <activeWorkspaceItem.icon size={16} className="text-[#10243E]" />
                  )}
                </div>
              </div>

              <div className="mb-1.5 flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {workspaceItems.map((item) => {
                  const active = item.id === `setting-${activeWorkspace}`
                  return (
                    <button
                      key={`workspace-chip-${item.id}`}
                      type="button"
                      onClick={() => {
                        const nextWorkspace = item.id.replace("setting-", "") as ClinicalSetting
                        setActiveWorkspace(nextWorkspace)
                        setLauncherPage(0)
                        if (launcherScrollerRef.current) {
                          launcherScrollerRef.current.scrollTo({ left: 0, behavior: "smooth" })
                        }
                      }}
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors ${
                        active
                          ? "bg-white text-[#10243E] shadow-[0_8px_18px_rgba(15,23,42,0.16)]"
                          : "bg-white/12 text-white/82"
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
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
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  placeholder="Search procedure or specialty..."
                  className="w-full rounded-[16px] border border-white/12 bg-white/12 py-2.5 pl-10 pr-3 text-[13px] text-white placeholder:text-white/45 backdrop-blur-sm transition-colors focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/15"
                />
              </div>
            </div>
          </div>

          {showResults && results.length > 0 && (
            <div className="absolute inset-x-4 top-[calc(100%-6px)] z-30 overflow-hidden rounded-[24px] border border-[#D5DCE3] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
              {results.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={`/procedures/${p.id}`}
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
            <p className="absolute inset-x-4 top-[calc(100%-6px)] z-30 rounded-[24px] border border-[#D5DCE3] bg-white px-4 py-3 text-sm text-[#94a3b8] shadow-[0_18px_40px_rgba(15,23,42,0.22)]">
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
                          className="mb-1.5 flex h-14 w-14 items-center justify-center rounded-[20px] shadow-[0_10px_22px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
                          style={{ backgroundColor: specialty.tileColor }}
                        >
                          <specialty.icon size={20} className="text-white" />
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
                          className="mb-1.5 flex h-14 w-14 items-center justify-center rounded-[20px] shadow-[0_10px_22px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition-transform duration-200 ease-out group-hover:-translate-y-0.5"
                          style={{ backgroundColor: tool.tileColor }}
                        >
                          <Icon size={20} className="text-white" />
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

      <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] pt-1 lg:hidden">
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
                        className="mb-1 flex h-14 w-14 items-center justify-center rounded-[20px] shadow-[0_10px_24px_rgba(15,23,42,0.14)] transition-transform duration-200 ease-out"
                        style={{ backgroundColor: item.tileColor }}
                      >
                        <item.icon size={20} className="text-white" />
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
                        className="mb-1 flex h-14 w-14 items-center justify-center rounded-[20px] shadow-[0_10px_24px_rgba(15,23,42,0.14)] transition-transform duration-200 ease-out"
                        style={{ backgroundColor: item.tileColor }}
                      >
                        <item.icon size={20} className="text-white" />
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

      <div className="hidden rounded-[24px] border border-[#D5DCE3] bg-white px-3 py-3 shadow-sm lg:block">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Workflow tools
          </p>
        </div>
        <div className="grid grid-cols-4 gap-x-2.5 gap-y-3">
          {WORKFLOW_TOOLS.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.label}
                href={tool.href || "#"}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="mb-1.5 flex h-14 w-14 items-center justify-center rounded-[20px] shadow-[0_10px_22px_rgba(15,23,42,0.12)] ring-1 ring-black/5"
                  style={{ backgroundColor: tool.tileColor }}
                >
                  <Icon size={20} className="text-white" />
                </div>
                <p className="line-clamp-2 text-[11px] font-semibold leading-4 text-[#1E293B]">
                  {tool.label}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {recentCards.length > 0 && (
        <div className="hidden lg:block">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
            Recently viewed
          </p>
          <div className="space-y-1.5">
            {recentCards.map((card) => (
              <Link
                key={`${card.entry.procedureId}-${card.entry.variantId ?? "base"}-${card.entry.systemId ?? "base"}`}
                href={card.href}
                className="flex items-center justify-between rounded-lg px-1 py-1.5 transition-colors hover:bg-[#EFF8FF]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1E293B]">
                    {card.system?.name ?? card.procedure.name}
                  </p>
                  <p className="text-xs text-[#64748b]">
                    {formatRecentSubtitle(
                      card.procedure.name,
                      card.variant?.name,
                    )}
                  </p>
                </div>
                <ChevronRight size={14} className="shrink-0 text-[#94a3b8]" />
              </Link>
            ))}
          </div>
        </div>
      )}

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
              className="mb-1 flex h-16 w-16 items-center justify-center rounded-[22px] shadow-[0_22px_40px_rgba(15,23,42,0.32)] ring-2 ring-white/80"
              style={{ backgroundColor: dragPreviewItem.tileColor }}
            >
              <dragPreviewItem.icon size={20} className="text-white" />
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
