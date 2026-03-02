import { ClinicalSetting, Procedure } from "./types"

export { procedures } from "./seed-data/index"
import { procedures } from "./seed-data/index"

export function getProcedureById(id: string): Procedure | undefined {
  return procedures.find((p) => p.id === id)
}

export function getProceduresBySettingAndSpecialty(): Map<ClinicalSetting, Map<string, Procedure[]>> {
  const outer = new Map<ClinicalSetting, Map<string, Procedure[]>>()
  for (const p of procedures) {
    if (!outer.has(p.setting)) outer.set(p.setting, new Map())
    const inner = outer.get(p.setting)!
    const list = inner.get(p.specialty) ?? []
    list.push(p)
    inner.set(p.specialty, list)
  }
  return outer
}

export function getProceduresBySetting(setting: ClinicalSetting): Procedure[] {
  return procedures.filter((p) => p.setting === setting)
}

export function getProceduresBySpecialty(setting: ClinicalSetting, specialty: string): Procedure[] {
  return procedures.filter((p) => p.setting === setting && p.specialty === specialty)
}
