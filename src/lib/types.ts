export type ClinicalSetting =
  | "Operating Theatre"
  | "Endoscopy Suite"
  | "Interventional Radiology / Cath Lab"
  | "Emergency Department"
  | "Intensive Care Unit"
  | "Ward"
  | "Outpatient / Clinic"
  | "Maternity & Obstetrics"

export type SectionType =
  | "overview"
  | "consent_documentation"
  | "pre_procedure_assessment"
  | "ppe"
  | "patient_preparation"
  | "anaesthesia"
  | "patient_positioning"
  | "sterile_field_draping"
  | "instrument_sets_trays"
  | "equipment_devices"
  | "implants_prosthetics"
  | "consumables_supplies"
  | "medications_fluids"
  | "specimen_collection"
  | "procedure_reference"
  | "nurse_prep_notes"
  | "post_procedure_care"
  | "discharge_criteria"
  | "complications_escalation"
  | "patient_information"

export interface Supplier {
  name: string
  contact?: string
  url?: string
}

export interface Item {
  id: string
  name: string
  sku?: string
  description?: string
  product?: string
  supplier?: Supplier
  imageUrl?: string
  notes?: string
  defaultQty?: number
  location?: string
}

export interface Section {
  id: string
  title: string
  sectionType: SectionType
  items: Item[]
  // patient_positioning
  patientPositionInstructions?: string
  // procedure_reference
  operativeTechniqueUrl?: string
  implantGuideUrl?: string
  externalLinks?: { label: string; url: string }[]
  // nurse_prep_notes
  nurseNotes?: string
  // overview
  summary?: string
  duration?: string
  anaesthesiaType?: string
  // post_procedure_care
  recoveryNotes?: string
  // discharge_criteria
  dischargeCriteria?: string[]
  // complications_escalation
  commonComplications?: string[]
}

export interface ProcedureFamily {
  id: string              // "total-hip-replacement"
  name: string            // "Total Hip Replacement"
  specialty: string       // "Orthopaedics"
  setting: ClinicalSetting
  description?: string    // brief summary shown on family page
  tags?: string[]         // searchable aliases e.g. ["THR", "hip arthroplasty"]
}

export interface Procedure {
  id: string
  familyId: string        // links to ProcedureFamily
  variantLabel?: string   // what makes this variant unique e.g. "Posterior — Exeter / Trident"
  name: string            // procedure name (usually = family name)
  setting: ClinicalSetting
  specialty: string
  approach?: string
  implantSystem?: string
  sections: Section[]
  createdAt?: string
  updatedAt?: string
}

export interface Surgeon {
  id: string
  name: string        // "Mr James Wilson"
  shortName: string   // "Wilson" — for compact display
  initials: string    // "JW" — for avatar badges
  specialty: string
  grade?: string      // "Consultant", "Associate Specialist"
}

export interface SurgeonProcedure {
  id: string            // unique assignment e.g. "wilson-thr"
  surgeonId: string     // references Surgeon.id
  procedureId: string   // references Procedure.id
  implantSystem?: string  // surgeon's preferred system (overrides template)
  notes?: string          // surgeon-specific prep notes
}

/** How the user intends to use PrepSight — stored internally, not shown verbatim */
export type UserRole = "viewer" | "editor" | "clinical_author"

export const USER_ROLE_LABEL: Record<UserRole, string> = {
  viewer:          "Browse & Reference",
  editor:          "Content Manager",
  clinical_author: "Clinical Author",
}

export interface PrepSightProfile {
  hospital: string
  departments: string[]
  role: UserRole
  jobTitle?: string            // optional — collected later via profile settings
  name?: string                // optional — "First Last", used for edit attribution
  specialtiesOfInterest: string[]
  completedAt: string
}
