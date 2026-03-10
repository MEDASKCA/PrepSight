import { decorateCardSections, getCatalogueItems, searchCatalogueItems } from "./catalogue"
import { getProcedureById, getProceduresBySpecialty } from "./data"
import {
  getAnatomyForServiceLine,
  getAnatomyNameById,
  getDescendantAnatomyIds,
  getOperatingTheatreSpecialtyIdByLabel,
  getServiceLineNameById,
  getServiceLinesForSpecialty,
} from "./operating-theatre-taxonomy"
import { CLINICAL_SETTINGS, SETTING_SPECIALTIES } from "./settings"
import { buildSystemCardSections } from "./system-card"
import type { ClinicalSetting, Section } from "./types"
import {
  getCuratedVariantsForProcedureWithSystems,
  getProcedureVariantById,
  getSystemById,
  hasVariantsForProcedure,
} from "./variants"

export interface AssistantAction {
  label: string
  href: string
  tone?: "primary" | "secondary"
}

export interface AssistantTable {
  title?: string
  columns: string[]
  rows: string[][]
}

export interface AssistantStat {
  label: string
  value: string
}

export interface AssistantReply {
  text: string
  actions?: AssistantAction[]
  table?: AssistantTable
  stats?: AssistantStat[]
  chips?: string[]
}

export interface AssistantContext {
  pageKind: "home" | "setting" | "specialty" | "anatomy" | "card" | "catalogue" | "unknown"
  title: string
  description: string
  setting?: ClinicalSetting
  specialty?: string
  serviceLine?: string
  anatomy?: string
  procedureId?: string
  procedureName?: string
  variantId?: string
  variantName?: string
  systemId?: string
  systemName?: string
  sections?: Section[]
  stats?: AssistantStat[]
}

function normalize(value: string): string {
  return value.trim().toLowerCase()
}

function titleCase(value: string): string {
  return value
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function buildHipSizeTable(systemName: string): AssistantTable {
  return {
    title: `${systemName} prep ladder`,
    columns: ["Group", "Have ready", "Notes"],
    rows: [
      ["Acetabular cups", "46-60 mm", "Include adjacent backup sizes"],
      ["Liners", "Standard + elevated", "Match shell and head options"],
      ["Femoral stems", "Common primary size run", "Include one size above and below expected"],
      ["Heads", "32 / 36 mm", "Neutral and offset options ready"],
    ],
  }
}

function buildKneeSizeTable(systemName: string): AssistantTable {
  return {
    title: `${systemName} prep ladder`,
    columns: ["Group", "Have ready", "Notes"],
    rows: [
      ["Femoral", "Expected size run + backups", "Keep one size above and below"],
      ["Tibial trays", "Expected size run + backups", "Confirm compatible inserts"],
      ["Poly inserts", "Thickness ladder", "Keep adjacent thicknesses open-ready"],
      ["Patella", "Primary sizes", "Only if surgeon routinely resurfaces"],
    ],
  }
}

function buildShoulderSizeTable(systemName: string): AssistantTable {
  return {
    title: `${systemName} prep ladder`,
    columns: ["Group", "Have ready", "Notes"],
    rows: [
      ["Humeral stems", "Expected size run + backups", "Check press-fit vs cemented plan"],
      ["Heads", "Diameter and height options", "Keep adjacent head sizes available"],
      ["Glenoid components", "Primary size range", "Confirm pegged vs keeled preference"],
      ["Augments", "As indicated", "Useful for revision or bone-loss cases"],
    ],
  }
}

function buildGenericSizeTable(systemName: string): AssistantTable {
  return {
    title: `${systemName} prep ladder`,
    columns: ["Area", "What to have ready", "Notes"],
    rows: [
      ["Trials", "Full expected run", "Keep adjacent sizes immediately available"],
      ["Final implants", "Booked sizes + backups", "Avoid opening until decision is made"],
      ["Ancillaries", "System-specific screws / liners / heads", "Confirm compatibility before incision"],
      ["Rescue options", "Backup sizes and compatible alternatives", "Escalate early if anything is missing"],
    ],
  }
}

function buildSizeTable(
  procedureName: string,
  variantName: string | undefined,
  systemName: string,
): AssistantTable {
  const context = normalize([procedureName, variantName, systemName].filter(Boolean).join(" "))
  if (context.includes("hip")) return buildHipSizeTable(systemName)
  if (context.includes("knee")) return buildKneeSizeTable(systemName)
  if (context.includes("shoulder")) return buildShoulderSizeTable(systemName)
  return buildGenericSizeTable(systemName)
}

function buildSectionTable(section: Section, title?: string): AssistantTable | undefined {
  if (!section.items.length) return undefined
  return {
    title: title ?? section.title,
    columns: ["Item", "Qty", "Notes"],
    rows: section.items.slice(0, 12).map((item) => [
      item.name,
      String(item.defaultQty ?? 1),
      item.supplier?.name ?? item.description ?? item.product ?? "Ready",
    ]),
  }
}

function findSection(sections: Section[] | undefined, key: string): Section | undefined {
  return sections?.find((section) => normalize(section.title).includes(key))
}

function matchRouteTarget(query: string): AssistantAction[] {
  const actions: AssistantAction[] = []
  const normalized = normalize(query)

  if (normalized.includes("catalogue") || normalized.includes("supplier")) {
    actions.push({ label: "Open catalogue", href: "/catalogue", tone: "primary" })
  }

  for (const setting of CLINICAL_SETTINGS) {
    const shortForms = [
      setting,
      setting.replace("Operating Theatre", "Theatre"),
      setting.replace("Interventional Radiology / Cath Lab", "IR / Cath"),
      setting.replace("Outpatient / Clinic", "Clinic"),
      setting.replace("Maternity & Obstetrics", "Maternity"),
    ]
    if (shortForms.some((value) => normalized.includes(normalize(value)))) {
      actions.push({
        label: `Open ${setting}`,
        href: `/?setting=${encodeURIComponent(setting)}`,
        tone: actions.length === 0 ? "primary" : "secondary",
      })
    }
  }

  for (const specialty of SETTING_SPECIALTIES["Operating Theatre"]) {
    const aliases = [
      specialty,
      specialty.replace("Trauma and Orthopaedics", "Ortho"),
      specialty.replace("General Surgery", "GenSurg"),
      specialty.replace("Gynecology", "Gynae"),
    ]
    if (aliases.some((value) => normalized.includes(normalize(value)))) {
      actions.push({
        label: `Open ${specialty}`,
        href: `/?setting=${encodeURIComponent("Operating Theatre")}&specialty=${encodeURIComponent(specialty)}`,
        tone: actions.length === 0 ? "primary" : "secondary",
      })
    }
  }

  return actions.slice(0, 3)
}

export function buildAssistantContext(
  pathname: string,
  searchParams: URLSearchParams,
): AssistantContext {
  if (pathname === "/catalogue") {
    const catalogueItems = getCatalogueItems()
    const uniqueCategories = new Set(catalogueItems.map((item) => item.category))
    return {
      pageKind: "catalogue",
      title: "Catalogue",
      description: "You're in the product catalogue. I can help you find items, group them, or turn the results into a prep table.",
      stats: [
        { label: "Items", value: String(catalogueItems.length) },
        { label: "Categories", value: String(uniqueCategories.size) },
      ],
    }
  }

  if (pathname.startsWith("/procedures/")) {
    const parts = pathname.split("/")
    const procedureId = decodeURIComponent(parts[parts.length - 1] ?? "")
    const procedure = getProcedureById(procedureId)
    if (procedure) {
      const variantId = searchParams.get("variant") ?? undefined
      const systemId = searchParams.get("system") ?? undefined
      const variant = variantId ? getProcedureVariantById(variantId) : null
      const system = systemId ? getSystemById(systemId) : null
      const sections = decorateCardSections(
        variant && system
          ? buildSystemCardSections(procedure, variant.id, variant.name, system.id, system.name)
          : procedure.sections,
      )

      const fixedCount = sections.filter((section) => section.contentMode === "fixed").length
      const editableCount = sections.filter((section) => section.contentMode !== "fixed").length

      return {
        pageKind: "card",
        title: procedure.name,
        description: `You're on the card for ${[procedure.name, variant?.name, system?.name].filter(Boolean).join(" · ")}.`,
        setting: procedure.setting,
        specialty: procedure.specialty,
        procedureId: procedure.id,
        procedureName: procedure.name,
        variantId: variant?.id ?? undefined,
        variantName: variant?.name ?? undefined,
        systemId: system?.id ?? undefined,
        systemName: system?.name ?? undefined,
        sections,
        stats: [
          { label: "Sections", value: String(sections.length) },
          { label: "Fixed", value: String(fixedCount) },
          { label: "Editable", value: String(editableCount) },
        ],
      }
    }
  }

  if (pathname === "/") {
    const setting = searchParams.get("setting") as ClinicalSetting | null
    const specialty = searchParams.get("specialty") ?? undefined
    const serviceLineId = searchParams.get("service_line") ?? undefined
    const anatomyId = searchParams.get("anatomy") ?? undefined

    if (!setting) {
      return {
        pageKind: "home",
        title: "Home",
        description: "You're on the mobile launcher. I can open settings, specialties, cards, or the catalogue.",
      }
    }

    if (setting && specialty && anatomyId) {
      const serviceLine = serviceLineId
        ? getServiceLineNameById(serviceLineId) ?? serviceLineId
        : undefined
      const anatomy = getAnatomyNameById(anatomyId) ?? anatomyId
      const allowedAnatomy = new Set([anatomyId, ...getDescendantAnatomyIds(anatomyId)])
      const procedures = getProceduresBySpecialty(setting, specialty).filter((procedure) => {
        const anatomyValue = (procedure as { anatomy_id?: string }).anatomy_id
        if (!anatomyValue) return false
        return allowedAnatomy.has(anatomyValue) && (hasVariantsForProcedure(procedure.id) || procedure.sections.length > 0)
      })
      const variantCount = procedures.reduce(
        (count, procedure) => count + getCuratedVariantsForProcedureWithSystems(procedure.id, procedure.name).length,
        0,
      )

      return {
        pageKind: "anatomy",
        title: serviceLine ? `${serviceLine}: ${anatomy}` : anatomy,
        description: `You're in ${specialty}, looking at ${serviceLine ? `${serviceLine} · ` : ""}${anatomy}.`,
        setting,
        specialty,
        serviceLine,
        anatomy,
        stats: [
          { label: "Procedures", value: String(procedures.length) },
          { label: "Variants", value: String(variantCount) },
        ],
      }
    }

    if (setting && specialty) {
      const specialtyId = getOperatingTheatreSpecialtyIdByLabel(specialty)
      const serviceLines = specialtyId ? getServiceLinesForSpecialty(specialtyId) : []
      const anatomyCount = serviceLines.reduce(
        (count, line) => count + getAnatomyForServiceLine(line.id).length,
        0,
      )

      return {
        pageKind: "specialty",
        title: specialty,
        description: `You're in the ${specialty} browse page.`,
        setting,
        specialty,
        stats: [
          { label: "Subspecialties", value: String(serviceLines.length) },
          { label: "Anatomy views", value: String(anatomyCount) },
        ],
      }
    }

    return {
      pageKind: "setting",
      title: setting,
      description: `You're browsing ${setting}. I can help you jump to a specialty or summarise what's available here.`,
      setting,
      stats: [
        { label: "Specialties", value: String(SETTING_SPECIALTIES[setting]?.length ?? 0) },
      ],
    }
  }

  return {
    pageKind: "unknown",
    title: "PrepSight",
    description: "I'm ready. Ask me about this page, a procedure, a product, or tell me where you want to go.",
  }
}

export function buildAssistantWelcome(context: AssistantContext): AssistantReply {
  const quick =
    context.pageKind === "card"
      ? ["Summarise this card", "Show implant sizes", "List tray items", "I can take you there"]
      : context.pageKind === "catalogue"
        ? ["Find hip implants", "Make a table", "Show supplier items", "Open theatre"]
        : ["Where am I?", "Show me visually", "Open catalogue", "Take me to Ortho"]

  return {
    text: `${context.description} Ask naturally. I can answer, turn things into a table, or take you straight to the right page.`,
    stats: context.stats,
    chips: quick,
  }
}

function buildVisualReply(context: AssistantContext): AssistantReply {
  return {
    text:
      context.stats && context.stats.length > 0
        ? `Here’s the quickest visual read of this page.`
        : `I don't have a meaningful visual summary for this page yet, but I can still summarise it or take you somewhere else.`,
    stats: context.stats,
  }
}

function buildSummaryReply(context: AssistantContext): AssistantReply {
  if (context.pageKind === "card") {
    const sections = context.sections ?? []
    const fixed = sections.filter((section) => section.contentMode === "fixed").length
    const editable = sections.filter((section) => section.contentMode !== "fixed").length
    return {
      text: `You're on the ${[context.procedureName, context.variantName, context.systemName].filter(Boolean).join(" · ")} card. It currently has ${sections.length} sections, with ${fixed} supplier-fixed sections and ${editable} sections that local teams can tailor.`,
      actions: [
        { label: "Open catalogue", href: "/catalogue", tone: "secondary" },
      ],
      stats: context.stats,
    }
  }

  if (context.pageKind === "catalogue") {
    return {
      text: "This is the central product catalogue. It's the reusable bank for implants, trays, consumables, and equipment that cards can pull from.",
      stats: context.stats,
    }
  }

  return {
    text: context.description,
    stats: context.stats,
  }
}

function buildNavigationReply(query: string): AssistantReply {
  const actions = matchRouteTarget(query)
  if (actions.length === 0) {
    return {
      text: "I can take you there, but I need a clearer target. Try something like 'open catalogue', 'take me to Ortho', or 'show Operating Theatre'.",
    }
  }

  return {
    text: "I can take you there.",
    actions,
  }
}

function buildCatalogueReply(query: string): AssistantReply {
  const cleaned = query
    .replace(/show|find|search|catalogue|catalog|table|for/gi, " ")
    .trim()
  const results = searchCatalogueItems(cleaned).slice(0, 8)

  if (results.length === 0) {
    return {
      text: `I couldn't find a catalogue match for "${cleaned || query}". Try a supplier, product family, or SKU fragment.`,
      actions: [{ label: "Open catalogue", href: "/catalogue", tone: "primary" }],
    }
  }

  return {
    text: `I found ${results.length} relevant catalogue items. I can take you into the catalogue if you want the full list.`,
    table: {
      title: cleaned ? titleCase(cleaned) : "Catalogue results",
      columns: ["Item", "Category", "Supplier / product"],
      rows: results.map((item) => [
        item.name,
        titleCase(item.category.replace(/_/g, " ")),
        item.supplier?.name ?? item.product ?? item.manufacturer ?? "PrepSight catalogue",
      ]),
    },
    actions: [{ label: "Open catalogue", href: "/catalogue", tone: "primary" }],
  }
}

export function buildAssistantReply(
  context: AssistantContext,
  prompt: string,
): AssistantReply {
  const query = normalize(prompt)

  if (!query) {
    return buildAssistantWelcome(context)
  }

  if (/(where am i|what page|what am i looking at)/.test(query)) {
    return buildSummaryReply(context)
  }

  if (/(show visually|visual|dashboard|overview)/.test(query)) {
    return buildVisualReply(context)
  }

  if (/(summaris|summary|what's on this card|what is on this card)/.test(query)) {
    return buildSummaryReply(context)
  }

  if (/(take me|open|go to|show me)/.test(query) && /(catalogue|supplier|theatre|ortho|orthopaedics|urology|gynae|gynae|home|operating theatre)/.test(query)) {
    return buildNavigationReply(query)
  }

  if (/(catalogue|sku|supplier|product)/.test(query)) {
    return buildCatalogueReply(prompt)
  }

  if (/(implant size|implant sizes|sizes|size ladder|trials)/.test(query) && context.pageKind === "card") {
    const systemName = context.systemName ?? "current system"
    return {
      text: `I don't have exact hospital-picked size links for this system yet, but this is the prep ladder I'd stage at the table.`,
      table: buildSizeTable(context.procedureName ?? context.title, context.variantName, systemName),
    }
  }

  if (/(tray|instrument|sets)/.test(query) && context.pageKind === "card") {
    const traySection = findSection(context.sections, "tray")
    const table = traySection ? buildSectionTable(traySection) : undefined
    return table
      ? {
          text: "Here are the tray and set items I can see on this card.",
          table,
        }
      : {
          text: "I don't have a tray list on this card yet, but I can still take you to the catalogue or summarise the card.",
        }
  }

  if (/(consumable|drape|ppe|medication|fluids)/.test(query) && context.pageKind === "card") {
    const section =
      findSection(context.sections, "consumable") ??
      findSection(context.sections, "drap") ??
      findSection(context.sections, "ppe") ??
      findSection(context.sections, "medication")
    const table = section ? buildSectionTable(section) : undefined
    return table
      ? {
          text: `Here’s the quickest way to review that section.`,
          table,
        }
      : {
          text: "That section isn't authored strongly enough yet, but I can still search the catalogue for you.",
          actions: [{ label: "Open catalogue", href: "/catalogue", tone: "primary" }],
        }
  }

  return {
    text: `I can help with this page. Try asking me to summarise it, show a table, find supplier products, check implant sizes, or tell me where you want to go and I'll take you there.`,
    chips: buildAssistantWelcome(context).chips,
  }
}
