import cardsData from "../../data/cards/cards.json"
import { DEFAULT_SECTIONS_BY_SETTING, SECTION_TYPE_CATALOGUE } from "./settings"
import type { Procedure, Section, SectionType } from "./types"

type RawCardRecord = {
  procedure_variant_id: string
  system_id: string
  name?: string
  ppe?: string[]
  operative_references?: string[]
  nurse_prep_notes?: string[]
  theatre_equipment?: string[]
  patient_positioning?: string
  sterile_field_and_draping?: string
  instrument_trays?: string[]
  consumables?: string[]
  medications?: string[]
  thromboprophylaxis?: string
  local_anaesthetic?: string
  post_procedure_dressing?: string
  status?: string
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function itemsFromNames(values: string[] | undefined, prefix: string) {
  return (values ?? []).map((name, index) => ({
    id: `${prefix}-${slug(name)}-${index}`,
    name,
    defaultQty: 1,
  }))
}

function labelForSectionType(sectionType: SectionType): string {
  return (
    SECTION_TYPE_CATALOGUE.find((entry) => entry.type === sectionType)?.label ??
    sectionType
  )
}

function buildCardSectionsFromRecord(record: RawCardRecord): Section[] {
  const sections: Section[] = []

  if ((record.ppe ?? []).length > 0) {
    sections.push({
      id: "ppe",
      title: "PPE",
      sectionType: "ppe",
      items: itemsFromNames(record.ppe, "ppe"),
    })
  }

  sections.push({
    id: "overview",
    title: "Overview",
    sectionType: "overview",
    summary:
      record.name ??
      "System-specific procedure card scaffold generated from the taxonomy mapping.",
    items: [],
  })

  if ((record.operative_references ?? []).length > 0) {
    sections.push({
      id: "procedure-reference",
      title: "Operative References",
      sectionType: "procedure_reference",
      externalLinks: (record.operative_references ?? []).map((label, index) => ({
        label,
        url: `#reference-${index + 1}`,
      })),
      items: [],
    })
  }

  if ((record.nurse_prep_notes ?? []).length > 0) {
    sections.push({
      id: "nurse-prep-notes",
      title: "Nurse Prep Notes",
      sectionType: "nurse_prep_notes",
      nurseNotes: (record.nurse_prep_notes ?? []).join("\n"),
      items: [],
    })
  }

  if ((record.theatre_equipment ?? []).length > 0) {
    sections.push({
      id: "equipment-devices",
      title: "Equipment & Devices",
      sectionType: "equipment_devices",
      items: itemsFromNames(record.theatre_equipment, "equipment"),
    })
  }

  if (record.patient_positioning) {
    sections.push({
      id: "patient-positioning",
      title: "Patient Positioning",
      sectionType: "patient_positioning",
      patientPositionInstructions: record.patient_positioning,
      items: [],
    })
  }

  if (record.sterile_field_and_draping) {
    sections.push({
      id: "sterile-field-draping",
      title: "Sterile Field & Draping",
      sectionType: "sterile_field_draping",
      items: [
        {
          id: "standard-drape",
          name: record.sterile_field_and_draping,
          defaultQty: 1,
        },
      ],
    })
  }

  if ((record.instrument_trays ?? []).length > 0) {
    sections.push({
      id: "instrument-trays",
      title: "Instrument Sets & Trays",
      sectionType: "instrument_sets_trays",
      items: itemsFromNames(record.instrument_trays, "tray"),
    })
  }

  if ((record.consumables ?? []).length > 0) {
    sections.push({
      id: "consumables-supplies",
      title: "Consumables & Supplies",
      sectionType: "consumables_supplies",
      items: itemsFromNames(record.consumables, "consumable"),
    })
  }

  if ((record.medications ?? []).length > 0) {
    sections.push({
      id: "medications-fluids",
      title: "Medications & Fluids",
      sectionType: "medications_fluids",
      items: itemsFromNames(record.medications, "medication"),
    })
  }

  if (record.thromboprophylaxis) {
    sections.push({
      id: "thromboprophylaxis",
      title: "Thromboprophylaxis",
      sectionType: "medications_fluids",
      items: [
        {
          id: "thromboprophylaxis-item",
          name: record.thromboprophylaxis,
          defaultQty: 1,
        },
      ],
    })
  }

  if (record.local_anaesthetic) {
    sections.push({
      id: "local-anaesthetic",
      title: "Local Anaesthetic Infiltration",
      sectionType: "anaesthesia",
      items: [
        {
          id: "local-anaesthetic-item",
          name: record.local_anaesthetic,
          defaultQty: 1,
        },
      ],
    })
  }

  if (record.post_procedure_dressing) {
    sections.push({
      id: "post-procedure-care",
      title: "Post-procedure Care & Dressing",
      sectionType: "post_procedure_care",
      recoveryNotes: record.post_procedure_dressing,
      items: [],
    })
  }

  return sections
}

function buildScaffoldSections(
  procedure: Procedure,
  variantName: string,
  systemName: string,
): Section[] {
  return DEFAULT_SECTIONS_BY_SETTING[procedure.setting].map((sectionType) => {
    const title = labelForSectionType(sectionType)
    const base: Section = {
      id: `${sectionType}-${slug(variantName)}-${slug(systemName)}`,
      title,
      sectionType,
      items: [],
    }

    if (sectionType === "overview") {
      base.summary = `${procedure.name} configured for ${variantName} using ${systemName}.`
    }

    if (sectionType === "nurse_prep_notes") {
      base.nurseNotes = `Placeholder card for ${procedure.name}. Confirm ${systemName} trays, implants, and supporting consumables with the operating surgeon before the list.`
    }

    if (sectionType === "patient_positioning") {
      base.patientPositionInstructions = `Use the standard ${variantName.toLowerCase()} setup for ${procedure.name}. Confirm positioning, supports, and pressure-area protection according to local protocol.`
    }

    if (sectionType === "procedure_reference") {
      base.externalLinks = [
        { label: `${systemName} operative reference`, url: "#" },
      ]
    }

    if (sectionType === "post_procedure_care") {
      base.recoveryNotes = `Post-procedure care should follow the local pathway for ${procedure.name} and any system-specific surgeon preferences.`
    }

    return base
  })
}

export function buildSystemCardSections(
  procedure: Procedure,
  variantId: string,
  variantName: string,
  systemId: string,
  systemName: string,
): Section[] {
  const cardRecords = (cardsData as RawCardRecord[]).filter(
    (record) => record.status !== "inactive",
  )

  const exactCard = cardRecords.find(
    (record) =>
      record.procedure_variant_id === variantId && record.system_id === systemId,
  )

  if (exactCard) {
    return buildCardSectionsFromRecord(exactCard)
  }

  if (procedure.sections.length > 0) {
    return procedure.sections
  }

  return buildScaffoldSections(procedure, variantName, systemName)
}
