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

export interface Procedure {
  id: string
  name: string
  setting: ClinicalSetting
  specialty: string
  approach?: string
  implantSystem?: string
  consultant?: string
  sections: Section[]
  createdAt?: string
  updatedAt?: string
}

export type ClinicalRole =
  | "Consultant"
  | "Registrar"
  | "SHO"
  | "Scrub Nurse"
  | "Scout Nurse"
  | "ODP"
  | "Anaesthetist"
  | "Endoscopy Nurse"
  | "ICU Nurse"
  | "Ward Nurse"
  | "Charge Nurse"
  | "Sister"
  | "Other"

export interface PrepSightProfile {
  hospital: string
  departments: string[]
  role: ClinicalRole
  specialtiesOfInterest: string[]
  completedAt: string
}
