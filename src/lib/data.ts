import { ClinicalSetting, Procedure } from "./types"
import { canonicalSpecialtyName } from "./specialty-normalization"
import specialties from "../../data/taxonomy/specialties.json"
import { procedures as seedProcedures } from "./seed-data/index"

import traumaOrthopaedics from "../../data/procedures/trauma_and_orthopaedics/procedures_trauma_and_orthopaedics.json"
import generalSurgery from "../../data/procedures/general_surgery/procedures_general_surgery.json"
import urology from "../../data/procedures/urology/procedures_urology.json"
import gynecology from "../../data/procedures/gynaecology/procedures_gynaecology.json"
import obstetrics from "../../data/procedures/obstetrics/procedures_obstetrics.json"
import ent from "../../data/procedures/otolaryngology/procedures_otolaryngology.json"
import omfs from "../../data/procedures/oral_and_maxillofacial/procedures_oral_and_maxillofacial.json"
import dental from "../../data/procedures/dental_and_oral/procedures_dental_and_oral.json"
import plastics from "../../data/procedures/plastic_and_reconstructive/procedures_plastic_and_reconstructive.json"
import neurosurgery from "../../data/procedures/neurosurgery/procedures_neurosurgery.json"
import cardiothoracic from "../../data/procedures/cardiothoracic/procedures_cardiothoracic.json"
import vascular from "../../data/procedures/vascular/procedures_vascular.json"
import paediatric from "../../data/procedures/paediatric/procedures_paediatric.json"
import ophthalmology from "../../data/procedures/opthalmology/procedures_opthalmology.json"
import podiatric from "../../data/procedures/podiatric/procedures_podiatric.json"
import anaesthesia from "../../data/procedures/anaesthesia/procedures_anaesthesia.json"

interface TaxonomySpecialtyRecord {
  id: string
  name: string
  category: string
}

function normalizeText(v?: string): string {
  return (v ?? "").trim().toLowerCase()
}

const specialtyNameById = new Map<string, string>()
for (const row of specialties as TaxonomySpecialtyRecord[]) {
  specialtyNameById.set(row.id, row.name)
}

function normalizeProcedure(p: any): Procedure {
  const rawSpecialtyName =
    specialtyNameById.get(p.specialty_id) ??
    p.specialty ??
    p.specialty_id ??
    "Unknown"

  const normalizedSpecialty = canonicalSpecialtyName(
    "Operating Theatre",
    rawSpecialtyName
  )

  return {
    ...p,
    setting: "Operating Theatre" as ClinicalSetting,
    specialty: normalizedSpecialty,
    sections: p.sections ?? [],
  }
}

const jsonProcedures: Procedure[] = [
  ...traumaOrthopaedics,
  ...generalSurgery,
  ...urology,
  ...gynecology,
  ...obstetrics,
  ...ent,
  ...omfs,
  ...dental,
  ...plastics,
  ...neurosurgery,
  ...cardiothoracic,
  ...vascular,
  ...paediatric,
  ...ophthalmology,
  ...podiatric,
  ...anaesthesia,
].map(normalizeProcedure)

// Seed-data procedures have full authored sections (kardex cards).
// They take priority: if a seed-data ID matches a JSON procedure ID, the seed version wins.
const seedIds = new Set(seedProcedures.map((p) => normalizeText(p.id)))

export const procedures: Procedure[] = [
  ...seedProcedures,
  ...jsonProcedures.filter((p) => !seedIds.has(normalizeText(p.id))),
]

export function getProcedureById(id: string): Procedure | undefined {
  return procedures.find((p) => normalizeText(p.id) === normalizeText(id))
}

export function getProceduresBySettingAndSpecialty(): Map<ClinicalSetting, Map<string, Procedure[]>> {
  const outer = new Map<ClinicalSetting, Map<string, Procedure[]>>()

  for (const p of procedures) {
    if (!outer.has(p.setting)) {
      outer.set(p.setting, new Map())
    }

    const inner = outer.get(p.setting)!
    const specialty = canonicalSpecialtyName(p.setting, p.specialty)

    const list = inner.get(specialty) ?? []
    list.push(p)
    inner.set(specialty, list)
  }

  return outer
}

export function getProceduresBySetting(setting: ClinicalSetting): Procedure[] {
  return procedures.filter((p) => p.setting === setting)
}

export function getProceduresBySpecialty(setting: ClinicalSetting, specialty: string): Procedure[] {
  const requestedSpecialty = canonicalSpecialtyName(setting, specialty)

  return procedures.filter(
    (p) =>
      p.setting === setting &&
      canonicalSpecialtyName(p.setting, p.specialty) === requestedSpecialty
  )
}