import cardsData from "../../data/cards/cards.json"
import suppliersData from "../../data/suppliers/suppliers.json"
import systemsData from "../../data/systems/systems.json"
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

type RawSystemRecord = {
  id: string
  name: string
  supplier_id?: string
  system_type?: string
  category?: string
  aliases?: string[]
  description?: string
  status?: string
}

type RawSupplierRecord = {
  id: string
  name: string
  aliases?: string[]
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

const activeSystems = (systemsData as RawSystemRecord[]).filter(
  (system) => system.status !== "inactive",
)
const activeSuppliers = (suppliersData as RawSupplierRecord[]).filter(
  (supplier) => supplier.status !== "inactive",
)

const systemById = new Map(activeSystems.map((system) => [system.id, system]))
const supplierById = new Map(
  activeSuppliers.map((supplier) => [supplier.id, supplier]),
)

function labelForSectionType(sectionType: SectionType): string {
  return (
    SECTION_TYPE_CATALOGUE.find((entry) => entry.type === sectionType)?.label ??
    sectionType
  )
}

function getSystemMetadata(systemId: string) {
  const system = systemById.get(systemId) ?? null
  const supplier =
    system?.supplier_id ? supplierById.get(system.supplier_id) ?? null : null

  return { system, supplier }
}

function splitSystemName(value: string): string[] {
  return value
    .split(/\s*\/\s*|\s*\+\s*|\s*,\s*/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function replaceSystemReferences(
  text: string,
  sourceSystemName: string,
  targetSystemName: string,
): string {
  let result = text.replaceAll(sourceSystemName, targetSystemName)
  const sourceParts = splitSystemName(sourceSystemName)
  const targetParts = splitSystemName(targetSystemName)

  sourceParts.forEach((sourcePart, index) => {
    const targetPart =
      targetParts[index] ?? targetParts[targetParts.length - 1] ?? targetSystemName
    result = result.replaceAll(sourcePart, targetPart)
  })

  return result
}

function adaptCardTemplate(
  template: RawCardRecord,
  procedureName: string,
  variantName: string,
  sourceSystemName: string,
  targetSystemName: string,
  targetSystemId: string,
): RawCardRecord {
  const replace = (value?: string) =>
    value
      ? replaceSystemReferences(value, sourceSystemName, targetSystemName)
      : value
  const replaceArray = (values?: string[]) => values?.map(replace) as
    | string[]
    | undefined

  return {
    ...template,
    system_id: targetSystemId,
    name: `${procedureName} - ${variantName} - ${targetSystemName}`,
    operative_references: [
      `${procedureName} operative technique`,
      `${targetSystemName} system reference`,
      "WHO Surgical Safety Checklist",
    ],
    nurse_prep_notes: [
      `Confirm ${targetSystemName} implants, trials, and backup sizes are available before knife-to-skin.`,
      "Check all system-specific trays against the booking card and surgeon preference card.",
      "Escalate any missing implants, liners, screws, or disposable accessories before the patient enters theatre.",
    ],
    ppe: replaceArray(template.ppe),
    theatre_equipment: replaceArray(template.theatre_equipment),
    patient_positioning: replace(template.patient_positioning),
    sterile_field_and_draping: replace(template.sterile_field_and_draping),
    instrument_trays: replaceArray(template.instrument_trays),
    consumables: replaceArray(template.consumables),
    medications: replaceArray(template.medications),
    thromboprophylaxis: replace(template.thromboprophylaxis),
    local_anaesthetic: replace(template.local_anaesthetic),
    post_procedure_dressing: replace(template.post_procedure_dressing),
  }
}

function makeItem(
  id: string,
  name: string,
  description: string,
  defaultQty = 1,
  supplierName?: string,
) {
  return {
    id: `${id}-${slug(name)}`,
    name,
    description,
    defaultQty,
    ...(supplierName ? { supplier: { name: supplierName } } : {}),
  }
}

function dedupeItems(
  items: Array<ReturnType<typeof makeItem>>,
): Array<ReturnType<typeof makeItem>> {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = item.name.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function buildContextText(
  procedure: Procedure,
  variantName: string,
  systemName: string,
  systemDescription?: string,
) {
  return [
    procedure.name,
    variantName,
    systemName,
    systemDescription,
    (procedure as Procedure & { description?: string }).description,
    procedure.specialty,
    procedure.approach,
    procedure.implantSystem,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

function buildScaffoldSections(
  procedure: Procedure,
  variantName: string,
  systemId: string,
  systemName: string,
): Section[] {
  const { system, supplier } = getSystemMetadata(systemId)
  const procedureDescription = (
    procedure as Procedure & { description?: string }
  ).description
  const supplierName = supplier?.name
  const context = buildContextText(
    procedure,
    variantName,
    systemName,
    system?.description,
  )

  const isHip = /\bhip\b/.test(context)
  const isKnee = /\bknee\b/.test(context)
  const isShoulder = /\bshoulder\b/.test(context)
  const isSpine = /\bspine|lumbar|cervical|thoracic\b/.test(context)
  const isUrology = /\burology|bladder|ureter|kidney|prostate|urethra\b/.test(
    context,
  )
  const isGynae = /\bgynaec|uterus|ovary|pelvic floor|cervix|vagina\b/.test(
    context,
  )
  const isObstetric = /\bcaesarean|cesarean|obstetric|placenta|delivery\b/.test(
    context,
  )
  const isLaparoscopic = /\blaparoscopic|laparoscopic|robotic|minimally invasive\b/.test(
    context,
  )
  const usesFluoroscopy =
    /\bfluoro|image intensifier|nail|fracture|acetabular|spine|revision\b/.test(
      context,
    ) || isHip
  const position =
    /\bposterior\b/.test(context) && isHip
      ? "Lateral decubitus with the operative hip uppermost. Confirm pelvis is square, pad pressure areas, and check image intensifier access before draping."
      : /\banterior\b/.test(context) && isHip
        ? "Supine on a standard or traction table with both feet accessible. Confirm table attachments, pressure-area padding, and unrestricted fluoroscopy before prepping."
        : /\bdirect lateral|lateral approach\b/.test(context) && isHip
          ? "Lateral decubitus with careful support at pelvis and thorax. Confirm the patient is stable, padded, and accessible for limb manipulation during trialling."
          : isKnee
            ? "Supine with the operative leg in an adjustable leg holder. Ensure tourniquet position, heel support, and free flexion-extension before skin prep."
            : isShoulder
              ? "Beach-chair position with head neutral, operative shoulder at table edge, and all pressure areas padded. Confirm unrestricted arm movement before draping."
              : isObstetric
                ? "Supine with left lateral tilt where indicated. Confirm pressure-area protection, warming measures, and access for anaesthetic and neonatal teams."
                : isUrology || isGynae
                  ? "Lithotomy with secure leg supports, pressure-area padding, and confirmed access to all required imaging or endoscopic equipment."
                  : isSpine
                    ? "Position according to surgical level and approach, confirming pressure-area protection, head alignment, and imaging access before draping."
                    : `Position the patient according to the ${variantName.toLowerCase()} setup for ${procedure.name}. Confirm supports, pressure-area padding, and access for all equipment before draping.`

  const ppeItems = dedupeItems([
    makeItem("ppe", "Sterile gown", "Fluid-resistant sterile gown for scrub team.", 3),
    makeItem("ppe", "Sterile gloves", "Double-gloving recommended for implant and bone work.", 4),
    makeItem("ppe", "Eye protection", "Splash protection for scrub and circulating team."),
    ...(usesFluoroscopy
      ? [
          makeItem(
            "ppe",
            "Lead apron",
            "Radiation protection for cases requiring intraoperative imaging.",
            2,
          ),
        ]
      : []),
  ])

  const prepItems = dedupeItems([
    makeItem(
      "prep",
      "WHO checklist confirmation",
      "Confirm procedure, side/site, implants, blood products, and imaging requirements.",
    ),
    makeItem(
      "prep",
      "System availability check",
      `Confirm ${systemName} implants, trials, and compatible disposables are in theatre before patient arrival.`,
      1,
      supplierName,
    ),
    ...(isHip || isKnee || isShoulder || isSpine
      ? [
          makeItem(
            "prep",
            "Theatre warming and pressure care setup",
            "Prepare pressure-area padding, warming devices, and positioning supports before transfer.",
          ),
        ]
      : []),
    ...(isLaparoscopic
      ? [
          makeItem(
            "prep",
            "Laparoscopic tower check",
            "Power, light source, camera head, insufflation, and recording setup confirmed before knife-to-skin.",
          ),
        ]
      : []),
  ])

  const anaesthesiaItems = dedupeItems([
    makeItem(
      "anaes",
      isObstetric ? "Regional anaesthesia setup" : "Anaesthetic plan confirmation",
      isObstetric
        ? "Confirm spinal or epidural setup, vasopressors, and neonatal team readiness where applicable."
        : `Confirm local anaesthetic, block, or general anaesthetic plan for ${variantName.toLowerCase()} with the anaesthetic team.`,
    ),
    ...(isHip || isKnee || isShoulder
      ? [
          makeItem(
            "anaes",
            "Local infiltration or regional adjunct",
            "Confirm surgeon preference for local infiltration analgesia or regional block before draping.",
          ),
        ]
      : []),
  ])

  const drapingItems = dedupeItems([
    makeItem(
      "drape",
      isHip
        ? "Hip arthroplasty drape set"
        : isKnee
          ? "Knee arthroplasty drape set"
          : isShoulder
            ? "Shoulder drape set"
            : isObstetric
              ? "Abdominal obstetric drape set"
              : isUrology || isGynae
                ? "Urology / gynae drape set"
                : "Procedure-specific drape set",
      `Open the drape set routinely used for ${procedure.name} and confirm any adhesive or extremity-specific attachments are available.`,
    ),
    makeItem(
      "drape",
      "Adhesive incise drape",
      "Use according to local protocol and surgeon preference.",
    ),
  ])

  const trayItems = dedupeItems([
    makeItem(
      "tray",
      `${systemName} implant tray`,
      "System-specific instrumentation, trial components, and insertion tools.",
      1,
      supplierName,
    ),
    makeItem(
      "tray",
      `${procedure.name} basic set`,
      `Core instrumentation for ${procedure.name}.`,
    ),
    makeItem(
      "tray",
      "Backup implants and trials",
      "Keep additional sizes and compatible backup options immediately available.",
      1,
      supplierName,
    ),
  ])

  const equipmentItems = dedupeItems([
    ...(isLaparoscopic
      ? [
          makeItem(
            "equipment",
            "Laparoscopic tower",
            "Camera, light source, insufflator, and display stack for minimally invasive access.",
          ),
          makeItem(
            "equipment",
            "Diathermy unit",
            "Monopolar and bipolar energy source checked before incision.",
          ),
        ]
      : []),
    ...(isHip || isKnee || isShoulder || isSpine
      ? [
          makeItem(
            "equipment",
            "Operating table",
            "Configured for the planned approach and positioning supports.",
          ),
          makeItem(
            "equipment",
            "Suction unit",
            "Field clearance and lavage support.",
          ),
          makeItem(
            "equipment",
            "Diathermy unit",
            "Monopolar and bipolar energy source available and checked.",
          ),
        ]
      : []),
    ...(usesFluoroscopy
      ? [
          makeItem(
            "equipment",
            "Image intensifier",
            "Intraoperative imaging confirmed with compatible sterile cover.",
          ),
        ]
      : []),
    ...(isUrology
      ? [
          makeItem(
            "equipment",
            "Endoscopic stack",
            "Tower, camera, light source, irrigation, and display checked before start.",
          ),
        ]
      : []),
    ...(isObstetric
      ? [
          makeItem(
            "equipment",
            "Neonatal resuscitaire",
            "Prepared and checked before knife-to-skin.",
          ),
        ]
      : []),
  ])

  const implantItems = dedupeItems([
    makeItem(
      "implant",
      systemName,
      system?.description ??
        `${systemName} is the mapped system for this ${procedure.name.toLowerCase()} card.`,
      1,
      supplierName,
    ),
    makeItem(
      "implant",
      "Trial components",
      "Open or have immediately available the sizes needed for templating and intraoperative trialling.",
      1,
      supplierName,
    ),
    makeItem(
      "implant",
      "Backup component range",
      "Retain compatible backup sizes and accessories in theatre until the final implant is seated.",
      1,
      supplierName,
    ),
  ])

  const consumableItems = dedupeItems([
    makeItem("consumable", "Gauze swabs", "Standard scrub setup for field management.", 20),
    makeItem("consumable", "Suction tubing", "Connect and prime before patient enters theatre."),
    ...(isHip || isKnee || isShoulder
      ? [
          makeItem(
            "consumable",
            "Pulse lavage set",
            "Required for bone preparation and final washout.",
          ),
          makeItem(
            "consumable",
            "Bone cement and accessories",
            "Open if required by fixation plan and surgeon preference.",
          ),
        ]
      : []),
    ...(isLaparoscopic
      ? [
          makeItem(
            "consumable",
            "Insufflation tubing",
            "Compatible with laparoscopic tower and checked before start.",
          ),
          makeItem(
            "consumable",
            "Specimen retrieval bag",
            "Available where removal of tissue or calculi is anticipated.",
          ),
        ]
      : []),
  ])

  const medicationItems = dedupeItems([
    makeItem(
      "medication",
      "Antibiotic prophylaxis",
      "Administer according to local policy and timing for incision.",
    ),
    ...(isHip || isKnee || isShoulder
      ? [
          makeItem(
            "medication",
            "Tranexamic acid",
            "Use according to local arthroplasty or trauma protocol.",
          ),
        ]
      : []),
    ...(isObstetric
      ? [
          makeItem(
            "medication",
            "Uterotonics",
            "Prepare according to local caesarean or obstetric emergency protocol.",
          ),
        ]
      : []),
  ])

  const overviewSummary = [
    procedureDescription,
    `Configured for ${variantName} using ${systemName}.`,
    system?.description,
    supplierName ? `Primary supplier: ${supplierName}.` : null,
  ]
    .filter(Boolean)
    .join(" ")

  const notes = [
    `Confirm ${systemName} availability, backup sizes, and any special disposable requirements before the patient enters theatre.`,
    `Use the ${variantName.toLowerCase()} setup and verify all positioning supports before prep and drape.`,
    usesFluoroscopy
      ? "Ensure imaging is available, draped, and positioned before incision."
      : null,
    isLaparoscopic
      ? "Complete a full tower check, white balance, and insufflation check before transfer."
      : null,
  ]
    .filter(Boolean)
    .join("\n")

  const recoveryNotes = isHip || isKnee || isShoulder
    ? "Apply the local arthroplasty recovery pathway, confirm dressing and neurovascular observations, and hand over any implant-specific restrictions."
    : isObstetric
      ? "Follow local post-caesarean or operative delivery pathway, including recovery observations, uterotonic plan, and neonatal handover."
      : "Follow local recovery protocol, confirm dressing, documentation, and any system-specific postoperative requirements."

  return DEFAULT_SECTIONS_BY_SETTING[procedure.setting].map((sectionType) => {
    const title = labelForSectionType(sectionType)
    const base: Section = {
      id: `${sectionType}-${slug(variantName)}-${slug(systemName)}`,
      title,
      sectionType,
      items: [],
    }

    if (sectionType === "overview") {
      base.summary = overviewSummary
      return base
    }

    if (sectionType === "ppe") {
      base.items = ppeItems
      return base
    }

    if (sectionType === "patient_preparation") {
      base.items = prepItems
      return base
    }

    if (sectionType === "anaesthesia") {
      base.items = anaesthesiaItems
      return base
    }

    if (sectionType === "patient_positioning") {
      base.patientPositionInstructions = position
      return base
    }

    if (sectionType === "sterile_field_draping") {
      base.items = drapingItems
      return base
    }

    if (sectionType === "instrument_sets_trays") {
      base.items = trayItems
      return base
    }

    if (sectionType === "equipment_devices") {
      base.items = equipmentItems
      return base
    }

    if (sectionType === "implants_prosthetics") {
      base.items = implantItems
      return base
    }

    if (sectionType === "consumables_supplies") {
      base.items = consumableItems
      return base
    }

    if (sectionType === "medications_fluids") {
      base.items = medicationItems
      return base
    }

    if (sectionType === "procedure_reference") {
      base.externalLinks = [
        { label: `${procedure.name} operative technique`, url: "#" },
        { label: `${systemName} implant or system guide`, url: "#" },
        ...(supplierName
          ? [{ label: `${supplierName} product reference`, url: "#" }]
          : []),
      ]
      return base
    }

    if (sectionType === "nurse_prep_notes") {
      base.nurseNotes = notes
      return base
    }

    if (sectionType === "post_procedure_care") {
      base.recoveryNotes = recoveryNotes
      return base
    }

    return base
  })
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

  const templateForVariant = cardRecords.find(
    (record) => record.procedure_variant_id === variantId,
  )

  if (templateForVariant) {
    const sourceSystemName =
      getSystemMetadata(templateForVariant.system_id).system?.name ?? systemName
    const adaptedTemplate = adaptCardTemplate(
      templateForVariant,
      procedure.name,
      variantName,
      sourceSystemName,
      systemName,
      systemId,
    )
    return buildCardSectionsFromRecord(adaptedTemplate)
  }

  if (procedure.sections.length > 0) {
    return procedure.sections
  }

  return buildScaffoldSections(procedure, variantName, systemId, systemName)
}
