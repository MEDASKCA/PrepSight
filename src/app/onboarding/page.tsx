"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { saveProfile, hasProfile } from "@/lib/profile"
import { ClinicalRole, PrepSightProfile } from "@/lib/types"
import { SETTING_SPECIALTIES } from "@/lib/settings"

const NHS_TRUSTS = [
  "Addenbrooke's Hospital",
  "Alder Hey Children's",
  "Barnet Hospital",
  "Birmingham Queen Elizabeth",
  "Blackpool Victoria",
  "Bristol Royal Infirmary",
  "Chelsea & Westminster",
  "Chesterfield Royal",
  "Derby Teaching Hospitals",
  "East Surrey Hospital",
  "Epsom & St Helier",
  "Frimley Park Hospital",
  "George Eliot Hospital",
  "Guy's & St Thomas'",
  "Harrogate & District",
  "Homerton University Hospital",
  "Hull Royal Infirmary",
  "James Cook University Hospital",
  "King's College Hospital",
  "Leeds Teaching Hospitals",
  "Leicester Royal Infirmary",
  "Liverpool University Hospitals",
  "Luton & Dunstable",
  "Manchester University Hospitals",
  "Morriston Hospital",
  "Newcastle upon Tyne Hospitals",
  "Norfolk & Norwich",
  "North Bristol NHS Trust",
  "Northampton General",
  "Oxford University Hospitals",
  "Pinderfields Hospital",
  "Plymouth Hospitals NHS Trust",
  "Princess Royal University Hospital",
  "Queen Alexandra Hospital Portsmouth",
  "Queen Elizabeth Hospital Birmingham",
  "Royal Cornwall",
  "Royal Devon & Exeter",
  "Royal Free London",
  "Royal Liverpool",
  "Royal Victoria Infirmary Newcastle",
  "Salford Royal",
  "Sheffield Teaching Hospitals",
  "Southmead Hospital Bristol",
  "St George's London",
  "Surrey & Sussex Healthcare",
  "Taunton & Somerset",
  "University College London Hospitals",
  "University Hospital Southampton",
  "Warwick Hospital",
  "York Teaching Hospital",
]

const DEPARTMENTS = [
  "Theatres",
  "Endoscopy",
  "ICU / Critical Care",
  "Emergency Department",
  "Ward",
  "Clinic / Outpatients",
  "Maternity",
  "Interventional Radiology",
  "Other",
]

const ROLES: ClinicalRole[] = [
  "Consultant",
  "Registrar",
  "SHO",
  "Scrub Nurse",
  "Scout Nurse",
  "ODP",
  "Anaesthetist",
  "Endoscopy Nurse",
  "ICU Nurse",
  "Ward Nurse",
  "Charge Nurse",
  "Sister",
  "Other",
]

const DEPT_TO_SPECIALTY: Record<string, string[]> = {
  "Theatres":                   [...SETTING_SPECIALTIES["Operating Theatre"]],
  "Endoscopy":                  [...SETTING_SPECIALTIES["Endoscopy Suite"]],
  "ICU / Critical Care":        [...SETTING_SPECIALTIES["Intensive Care Unit"]],
  "Emergency Department":       [...SETTING_SPECIALTIES["Emergency Department"]],
  "Ward":                       [...SETTING_SPECIALTIES["Ward"]],
  "Clinic / Outpatients":       [...SETTING_SPECIALTIES["Outpatient / Clinic"]],
  "Maternity":                  [...SETTING_SPECIALTIES["Maternity & Obstetrics"]],
  "Interventional Radiology":   [...SETTING_SPECIALTIES["Interventional Radiology / Cath Lab"]],
}

const TOTAL_STEPS = 5

const CHIP_BASE = "border rounded-xl px-3 py-2 text-sm font-medium cursor-pointer select-none transition-colors"
const CHIP_ON   = "border-[#4DA3FF] bg-[#EFF8FF] text-[#2F8EF7]"
const CHIP_OFF  = "border-[#D5DCE3] text-[#64748b] hover:border-[#4DA3FF] hover:text-[#2F8EF7]"

function Chip({ label, selected, onToggle }: { label: string; selected: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${CHIP_BASE} ${selected ? CHIP_ON : CHIP_OFF}`}
    >
      {selected && <Check size={12} className="inline mr-1" />}
      {label}
    </button>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Form state
  const [hospital, setHospital]     = useState("")
  const [hospitalSuggestions, setHospitalSuggestions] = useState<string[]>([])
  const [departments, setDepartments]       = useState<string[]>([])
  const [role, setRole]                     = useState<ClinicalRole | "">("")
  const [specialties, setSpecialties]       = useState<string[]>([])

  useEffect(() => {
    if (hasProfile()) router.replace("/")
  }, [router])

  // Derive available specialties from selected departments
  const availableSpecialties = Array.from(
    new Set(
      departments.flatMap((d) => DEPT_TO_SPECIALTY[d] ?? [])
    )
  )

  function handleHospitalInput(val: string) {
    setHospital(val)
    if (val.trim().length < 2) { setHospitalSuggestions([]); return }
    const q = val.toLowerCase()
    setHospitalSuggestions(NHS_TRUSTS.filter((t) => t.toLowerCase().includes(q)).slice(0, 6))
  }

  function toggleDept(d: string) {
    setDepartments((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }

  function toggleSpecialty(s: string) {
    setSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  function canAdvance() {
    if (step === 1) return hospital.trim().length > 0
    if (step === 2) return departments.length > 0
    if (step === 3) return role !== ""
    return true
  }

  function handleFinish() {
    if (!role) return
    const profile: PrepSightProfile = {
      hospital: hospital.trim(),
      departments,
      role: role as ClinicalRole,
      specialtiesOfInterest: specialties,
      completedAt: new Date().toISOString(),
    }
    saveProfile(profile)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col">
      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-10 pb-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i + 1 === step ? "bg-[#4DA3FF]" : i + 1 < step ? "bg-[#2F8EF7]" : "bg-[#D5DCE3]"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-6 pb-24">
        <div className="w-full max-w-sm">

          {/* Step 1 — Hospital */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-[#3F4752] mb-1">Your hospital or trust</h2>
              <p className="text-sm text-[#64748b] mb-4">We use this to help you find relevant content.</p>
              <div className="relative">
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => handleHospitalInput(e.target.value)}
                  placeholder="e.g. Leeds Teaching Hospitals"
                  className="w-full px-4 py-3 border border-[#D5DCE3] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF]"
                  autoFocus
                />
                {hospitalSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#D5DCE3] rounded-xl shadow-md z-10 overflow-hidden">
                    {hospitalSuggestions.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setHospital(t); setHospitalSuggestions([]) }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#3F4752] hover:bg-[#F4F7FA] transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Clinical area */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-[#3F4752] mb-1">Clinical area</h2>
              <p className="text-sm text-[#64748b] mb-4">Select all areas where you work.</p>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((d) => (
                  <Chip key={d} label={d} selected={departments.includes(d)} onToggle={() => toggleDept(d)} />
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Role */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-[#3F4752] mb-1">Your role</h2>
              <p className="text-sm text-[#64748b] mb-4">Select the one that best describes you.</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <Chip key={r} label={r} selected={role === r} onToggle={() => setRole(r)} />
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Specialties */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-[#3F4752] mb-1">Specialties of interest</h2>
              <p className="text-sm text-[#64748b] mb-4">Optional — helps filter your view.</p>
              {availableSpecialties.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableSpecialties.map((s) => (
                    <Chip key={s} label={s} selected={specialties.includes(s)} onToggle={() => toggleSpecialty(s)} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#94a3b8]">Select clinical areas in step 2 to see relevant specialties.</p>
              )}
            </div>
          )}

          {/* Step 5 — Review */}
          {step === 5 && (
            <div>
              <h2 className="text-xl font-bold text-[#3F4752] mb-1">Ready to go</h2>
              <p className="text-sm text-[#64748b] mb-5">Review your profile before entering PrepSight.</p>
              <div className="bg-white border border-[#D5DCE3] rounded-xl divide-y divide-[#F4F7FA]">
                <div className="px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Hospital</p>
                  <p className="text-sm font-semibold text-[#3F4752] mt-0.5">{hospital}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Clinical areas</p>
                  <p className="text-sm font-semibold text-[#3F4752] mt-0.5">{departments.join(", ") || "—"}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Role</p>
                  <p className="text-sm font-semibold text-[#3F4752] mt-0.5">{role || "—"}</p>
                </div>
                {specialties.length > 0 && (
                  <div className="px-4 py-3">
                    <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Specialties</p>
                    <p className="text-sm font-semibold text-[#3F4752] mt-0.5">{specialties.join(", ")}</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Fixed bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D5DCE3] px-4 py-4 flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1 px-4 py-3 border border-[#D5DCE3] rounded-xl text-sm font-semibold text-[#64748b] hover:bg-[#F4F7FA] transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance()}
            className="flex-1 flex items-center justify-center gap-1 bg-[#4DA3FF] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#2F8EF7] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="flex-1 flex items-center justify-center gap-2 bg-[#4DA3FF] text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-[#2F8EF7] transition-colors"
          >
            <Check size={16} /> Enter PrepSight
          </button>
        )}
      </div>
    </div>
  )
}
