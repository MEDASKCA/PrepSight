"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Check } from "lucide-react"
import { saveProfile, hasProfile } from "@/lib/profile"
import { ClinicalRole, PrepSightProfile } from "@/lib/types"
import { SETTING_SPECIALTIES } from "@/lib/settings"
import { onAuthChange, type User } from "@/lib/auth"
import hospitalsData from "@/lib/hospitals.json"

// ── Data ─────────────────────────────────────────────────────────────────────

const HOSPITALS = hospitalsData

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
  "Theatres":                [...SETTING_SPECIALTIES["Operating Theatre"]],
  "Endoscopy":               [...SETTING_SPECIALTIES["Endoscopy Suite"]],
  "ICU / Critical Care":     [...SETTING_SPECIALTIES["Intensive Care Unit"]],
  "Emergency Department":    [...SETTING_SPECIALTIES["Emergency Department"]],
  "Ward":                    [...SETTING_SPECIALTIES["Ward"]],
  "Clinic / Outpatients":    [...SETTING_SPECIALTIES["Outpatient / Clinic"]],
  "Maternity":               [...SETTING_SPECIALTIES["Maternity & Obstetrics"]],
  "Interventional Radiology":[...SETTING_SPECIALTIES["Interventional Radiology / Cath Lab"]],
}

// Step 1: hospital · Step 2: what PrepSight is · Step 3: safety · Step 4: role+area · Step 5: confirm
const TOTAL_STEPS = 5

const CTA_LABELS = [
  "This is where I work",
  "Understood — continue",
  "I understand — continue",
  "This is me — continue",
  "Enter PrepSight",
]

// ── Chip ─────────────────────────────────────────────────────────────────────

const CHIP_BASE = "border rounded-xl px-5 py-3 text-sm font-medium cursor-pointer select-none transition-colors chip-reveal"
const CHIP_ON   = "border-[#4DA3FF] bg-[#EFF8FF] text-[#2F8EF7]"
const CHIP_OFF  = "border-[#D5DCE3] text-[#64748b] hover:border-[#4DA3FF] hover:text-[#2F8EF7]"

function Chip({
  label, selected, onToggle, delay = 0,
}: {
  label: string; selected: boolean; onToggle: () => void; delay?: number
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${CHIP_BASE} ${selected ? CHIP_ON : CHIP_OFF}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {selected && <Check size={12} className="inline mr-1.5" />}
      {label}
    </button>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [user, setUser]       = useState<User | null | undefined>(undefined)
  const [step, setStep]       = useState(1)
  const [animKey, setAnimKey] = useState(0)

  // Form state
  const [hospital,            setHospital]            = useState("")
  const [hospitalSuggestions, setHospitalSuggestions] = useState<typeof HOSPITALS>([])
  const [showSuggestions,     setShowSuggestions]     = useState(false)
  const [role,                setRole]                = useState<ClinicalRole | "">("")
  const [departments,         setDepartments]         = useState<string[]>([])
  const [specialties,         setSpecialties]         = useState<string[]>([])

  const hospitalWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (hasProfile()) router.replace("/") }, [router])
  useEffect(() => { return onAuthChange((u) => setUser(u ?? null)) }, [])

  // Close suggestions on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (!hospitalWrapRef.current?.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const availableSpecialties = Array.from(
    new Set(departments.flatMap((d) => DEPT_TO_SPECIALTY[d] ?? []))
  )

  function handleHospitalInput(val: string) {
    setHospital(val)
    if (val.trim().length < 2) { setHospitalSuggestions([]); setShowSuggestions(false); return }
    const q = val.toLowerCase()
    const matches = HOSPITALS.filter((h) => h.hospital.toLowerCase().includes(q) || h.trust.toLowerCase().includes(q) || (h.postcode && h.postcode.toLowerCase().includes(q))).slice(0, 5)
    setHospitalSuggestions(matches)
    setShowSuggestions(matches.length > 0)
  }

  function canAdvance() {
    if (step === 1) return hospital.trim().length > 0
    if (step === 4) return role !== "" && departments.length > 0
    return true
  }

  function goNext() { setStep((s) => s + 1); setAnimKey((k) => k + 1) }
  function goBack()  { setStep((s) => s - 1); setAnimKey((k) => k + 1) }

  async function handleFinish() {
    if (!role) return
    const profile: PrepSightProfile = {
      hospital: hospital.trim(),
      departments,
      role: role as ClinicalRole,
      specialtiesOfInterest: specialties,
      completedAt: new Date().toISOString(),
    }
    await saveProfile(profile, user?.uid)
    router.push("/")
  }

  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Progress bar */}
      <div className="h-0.5 bg-[#E2E8F0]">
        <div
          className="h-full bg-[#4DA3FF] transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-28 pt-10">
        <div className="w-full max-w-md" key={animKey}>

          {/* ── Step 1 — Clinical environment ─────────────────────────── */}
          {step === 1 && (
            <div>
              {/* Line-by-line heading */}
              <div className="mb-6">
                {["Your procedures.", "Your hospital.", "Your PrepSight."].map((line, i) => (
                  <p
                    key={line}
                    className="text-3xl font-bold text-[#3F4752] leading-tight line-reveal"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <p
                className="text-sm text-[#64748b] mb-6 line-reveal"
                style={{ animationDelay: "420ms" }}
              >
                PrepSight works best when it knows where you are. Tell us your trust or hospital and we'll build your view around it.
              </p>

              {/* Hospital input */}
              <div
                ref={hospitalWrapRef}
                className="relative line-reveal"
                style={{ animationDelay: "560ms" }}
              >
                <input
                  type="text"
                  value={hospital}
                  onChange={(e) => handleHospitalInput(e.target.value)}
                  onFocus={() => { if (hospitalSuggestions.length > 0) setShowSuggestions(true) }}
                  placeholder="Search for your hospital or trust"
                  className="w-full px-4 py-3.5 border border-[#D5DCE3] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] transition-shadow"
                  autoFocus
                />
                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#D5DCE3] rounded-xl shadow-lg z-20 overflow-hidden">
                    {hospitalSuggestions.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => { setHospital(h.hospital); setShowSuggestions(false) }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-[#F4F7FA] transition-colors"
                      >
                        <p className="text-[#3F4752] font-medium">{h.hospital}</p>
                        <p className="text-xs text-[#94a3b8] mt-0.5">{h.trust}{h.postcode ? ` · ${h.postcode}` : ""}</p>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-[#94a3b8] mt-2">
                  Not listed? Type the name — it will be saved as entered.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2 — What PrepSight is ────────────────────────────── */}
          {step === 2 && (
            <div className="animate-step-in">
              <h2 className="text-2xl font-bold text-[#3F4752] mb-2">
                A procedure card. Reimagined.
              </h2>
              <p className="text-sm text-[#64748b] mb-6">
                You already know what a Kardex is. PrepSight does the same job — digitally, consistently, and always with you.
              </p>

              <div className="space-y-4">
                {[
                  "Every procedure has a structured card covering equipment, instruments, positioning, medications, and more.",
                  "Cards are organised by setting, specialty, and surgeon — so you find what you need quickly.",
                  "PrepSight supports your preparation. Your trust's policy and your clinical judgement always come first.",
                ].map((point, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 line-reveal"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <ChevronRight size={16} className="text-[#4DA3FF] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#475569]">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3 — Safety & responsibility ─────────────────────── */}
          {step === 3 && (
            <div className="animate-step-in">
              <h2 className="text-2xl font-bold text-[#3F4752] mb-2">
                One thing before you continue.
              </h2>
              <p className="text-sm text-[#64748b] mb-6">
                Please take a moment to read this.
              </p>

              {/* Left-border card */}
              <div className="bg-white border border-[#D5DCE3] border-l-4 border-l-[#4DA3FF] rounded-xl px-5 py-5 space-y-3">
                <p className="text-sm text-[#475569]">
                  PrepSight is a preparation and reference aid.
                </p>
                <p className="text-sm text-[#475569]">
                  It reflects established practice — but it does not replace the policies, protocols, or clinical judgement of your trust.
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Always follow your local guidelines",
                    "Clinical judgement takes precedence",
                    "Cards are reviewed periodically but may not reflect the most recent local changes",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#475569]">
                      <span className="text-[#94a3b8] mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-semibold text-[#3F4752] pt-1">
                  PrepSight supports you. It does not override you.
                </p>
              </div>

              <p className="text-xs text-[#94a3b8] mt-3">
                By continuing, you confirm you have read this notice.
              </p>
            </div>
          )}

          {/* ── Step 4 — Role, area, specialties (progressive) ─────────── */}
          {step === 4 && (
            <div className="animate-step-in">
              <h2 className="text-2xl font-bold text-[#3F4752] mb-1">
                Let's set up your view.
              </h2>
              <p className="text-sm text-[#64748b] mb-6">
                PrepSight will show you the most relevant procedures first.
              </p>

              {/* Role — always shown */}
              <div className="mb-6">
                <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-3">Your role</p>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r, i) => (
                    <Chip
                      key={r}
                      label={r}
                      selected={role === r}
                      onToggle={() => setRole(r)}
                      delay={i * 30}
                    />
                  ))}
                </div>
              </div>

              {/* Area — revealed after role selected */}
              {role !== "" && (
                <div className="mb-6 animate-step-in">
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-3">Where you work</p>
                  <div className="flex flex-wrap gap-2">
                    {DEPARTMENTS.map((d, i) => (
                      <Chip
                        key={d}
                        label={d}
                        selected={departments.includes(d)}
                        onToggle={() => setDepartments((prev) =>
                          prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                        )}
                        delay={i * 30}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Specialty — revealed after area selected */}
              {departments.length > 0 && availableSpecialties.length > 0 && (
                <div className="animate-step-in">
                  <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wide mb-1">
                    Any specialties? <span className="normal-case font-normal text-[#94a3b8]">(optional)</span>
                  </p>
                  <p className="text-xs text-[#94a3b8] mb-3">
                    You can always browse everything — this just helps us prioritise.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSpecialties.map((s, i) => (
                      <Chip
                        key={s}
                        label={s}
                        selected={specialties.includes(s)}
                        onToggle={() => setSpecialties((prev) =>
                          prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                        )}
                        delay={i * 25}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 5 — Confirm ──────────────────────────────────────── */}
          {step === 5 && (
            <div className="animate-step-in">
              <h2 className="text-2xl font-bold text-[#3F4752] mb-1">You're set up.</h2>
              <p className="text-sm text-[#64748b] mb-6">
                Your view is personalised. Cards most relevant to your role and area will appear first.
              </p>

              <div className="bg-white border border-[#D5DCE3] rounded-xl divide-y divide-[#F4F7FA]">
                {[
                  { label: "Role",     value: role || "—" },
                  { label: "Area",     value: departments.join(", ") || "—" },
                  { label: "Hospital", value: hospital || "—" },
                  ...(specialties.length > 0 ? [{ label: "Specialties", value: specialties.join(", ") }] : []),
                ].map(({ label, value }, i) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 px-4 py-3.5 line-reveal"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <Check size={14} className="text-[#4DA3FF] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#94a3b8]">{label}</p>
                      <p className="text-sm font-semibold text-[#3F4752] mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#94a3b8] mt-3">
                You can update these at any time in your profile.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Fixed bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-[#D5DCE3] px-6 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">

          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="text-sm font-semibold text-[#64748b] hover:text-[#3F4752] transition-colors px-2 py-3 shrink-0"
            >
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance()}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#003366] text-white px-4 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#002244] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {CTA_LABELS[step - 1]} <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#4DA3FF] text-white px-4 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2F8EF7] transition-colors pulse-once"
            >
              <Check size={15} /> {CTA_LABELS[4]}
            </button>
          )}

        </div>
      </div>
    </div>
  )
}
