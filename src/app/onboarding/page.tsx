"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight, Check, Search } from "lucide-react"
import { saveProfile, hasProfile, resolveProfile } from "@/lib/profile"
import { UserRole, PrepSightProfile } from "@/lib/types"
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

const USE_CASES: { label: string; role: UserRole }[] = [
  { label: "Browse and reference procedures",    role: "viewer" },
  { label: "Manage or update procedure content", role: "editor" },
  { label: "Review and sign off procedures",     role: "clinical_author" },
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
const DEFAULT_HOSPITAL_SUGGESTIONS = HOSPITALS.slice(0, 8)

const CTA_LABELS = [
  "This is where I work",
  "Understood, continue",
  "I understand, continue",
  "This is me, continue",
  "Enter PrepSight",
]

// ── Chip ─────────────────────────────────────────────────────────────────────

const CHIP_BASE = "border rounded-xl px-4 py-2 text-sm font-medium cursor-pointer select-none transition-all chip-reveal"
const CHIP_ON   = "bg-[#4DA3FF] border-[#4DA3FF] text-white shadow-sm"
const CHIP_OFF  = "bg-white border-[#E2E8F0] text-[#475569] hover:border-[#4DA3FF] hover:bg-[#F0F8FF]"

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
  const [role,                setRole]                = useState<UserRole | "">("")
  const [departments,         setDepartments]         = useState<string[]>([])
  const [specialties,         setSpecialties]         = useState<string[]>([])
  const [specialtySearch,     setSpecialtySearch]     = useState("")
  const [saving,              setSaving]              = useState(false)

  const hospitalWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => { if (hasProfile()) router.replace("/") }, [router])
  useEffect(() => { return onAuthChange((u) => setUser(u ?? null)) }, [])
  useEffect(() => {
    if (!user) return
    resolveProfile(user.uid)
      .then((profile) => {
        if (profile) router.replace("/")
      })
      .catch(() => null)
  }, [user, router])

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
    if (val.trim().length < 2) {
      setHospitalSuggestions(DEFAULT_HOSPITAL_SUGGESTIONS)
      setShowSuggestions(true)
      return
    }
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
    if (!role || saving) return
    setSaving(true)
    const profile: PrepSightProfile = {
      hospital: hospital.trim(),
      departments,
      role: role as UserRole,
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
      <div className="mt-[env(safe-area-inset-top,0px)] h-0.5 bg-[#E2E8F0] lg:mt-0">
        <div
          className="h-full bg-[#4DA3FF] transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-28 pt-8 sm:pt-10 lg:pt-10">
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
                PrepSight works best when it knows where you are. Tell us your trust or hospital and we&apos;ll build your view around it.
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
                  onFocus={() => {
                    if (hospitalSuggestions.length === 0) {
                      setHospitalSuggestions(DEFAULT_HOSPITAL_SUGGESTIONS)
                    }
                    setShowSuggestions(true)
                  }}
                  placeholder="Search for your hospital or trust"
                  className="w-full rounded-xl border border-[#D5DCE3] bg-white px-4 py-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] transition-shadow lg:text-sm"
                  autoFocus
                />
                {showSuggestions && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#D5DCE3] rounded-xl shadow-lg z-20 overflow-hidden">
                    {hospitalSuggestions.map((h, i) => (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => { setHospital(h.hospital); setShowSuggestions(false) }}
                        className="w-full px-4 py-3 text-left text-[15px] transition-colors hover:bg-[#F4F7FA] lg:text-sm"
                      >
                        <p className="text-[#3F4752] font-medium">{h.hospital}</p>
                        <p className="text-xs text-[#94a3b8] mt-0.5">{h.trust}{h.postcode ? ` · ${h.postcode}` : ""}</p>
                      </button>
                    ))}
                  </div>
                )}
                <p className="mt-2 text-[13px] text-[#94a3b8] lg:text-xs">
                  Not listed? Type it in and it will be saved as entered.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 2 — What PrepSight is ────────────────────────────── */}
          {step === 2 && (
            <div className="animate-step-in">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ps-mark.png" alt="P.S." className="h-14 w-auto mb-5" />

              <h2 className="text-2xl font-bold text-[#3F4752] mb-2">
                A procedure card. Reimagined.
              </h2>
              <p className="text-sm text-[#64748b] mb-6">
                Preparation information has a habit of living everywhere. A notebook somewhere. A screenshot on a phone. A preference list saved in a folder. And occasionally... memory! We bring it together in one place. Each card acts as a guide to the key details used to prepare procedures, organised by setting and specialty.
              </p>

              <div className="space-y-4">
                {[
                  "Each card brings the key preparation details together in one place.",
                  "Cards are organised by setting and specialty, so you find what you need quickly.",
                  "PrepSight supports your preparation. Your trust&apos;s policy and your clinical judgement always come first.",
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
              <div className="flex justify-center mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/disclaimer.png" alt="" className="w-28 h-28" />
              </div>
              <h2 className="text-2xl font-bold text-[#3F4752] mb-2">
                One thing before you continue.
              </h2>
              <p className="text-sm text-[#64748b] mb-6">
                Please take a moment to read this.
              </p>

              <div className="space-y-3">
                <p className="text-sm text-[#475569]">
                  PrepSight is a preparation and reference aid.
                </p>
                <p className="text-sm text-[#475569]">
                  It reflects established practice, but it does not replace the policies, protocols, or clinical judgement of your trust.
                </p>
                <ul className="space-y-1.5 list-disc list-inside">
                  {[
                    "Always follow your local guidelines",
                    "Clinical judgement takes precedence",
                    "Cards are reviewed periodically but may not reflect the most recent local changes",
                  ].map((item) => (
                    <li key={item} className="text-sm text-[#475569]">
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
                Let&apos;s set up your view.
              </h2>
              <p className="text-sm text-[#64748b] mb-6">
                PrepSight will show you the most relevant procedures first.
              </p>

              {/* Role — always shown */}
              <div className="mb-7">
                <p className="text-2xl font-bold text-[#3F4752] mb-1">How will you use PrepSight?</p>
                <p className="text-xs text-[#94a3b8] mb-4">This helps us set up your access. You can change this at any time.</p>
                <div className="flex flex-col gap-2">
                  {USE_CASES.map((uc, i) => (
                    <button
                      key={uc.role}
                      type="button"
                      onClick={() => setRole(uc.role)}
                      className={`chip-reveal flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all text-left ${
                        role === uc.role
                          ? "bg-[#4DA3FF] text-white shadow-md"
                          : "bg-white border border-[#E2E8F0] text-[#3F4752] hover:border-[#4DA3FF] hover:bg-[#F0F8FF]"
                      }`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <span>{uc.label}</span>
                      {role === uc.role && <Check size={13} className="shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Area — revealed after role selected */}
              {role !== "" && (
                <div className="mb-7 animate-step-in">
                  <p className="text-sm font-semibold text-[#3F4752] mb-1">Where do you work?</p>
                  <p className="text-xs text-[#94a3b8] mb-3">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-2">
                    {DEPARTMENTS.map((d, i) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setSpecialtySearch("")
                          setDepartments((prev) =>
                            prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
                          )
                        }}
                        className={`chip-reveal flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left ${
                          departments.includes(d)
                            ? "bg-[#4DA3FF] text-white shadow-md"
                            : "bg-white border border-[#E2E8F0] text-[#3F4752] hover:border-[#4DA3FF] hover:bg-[#F0F8FF]"
                        }`}
                        style={{ animationDelay: `${i * 25}ms` }}
                      >
                        <span>{d}</span>
                        {departments.includes(d) && <Check size={13} className="shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specialty — keyword search + chips */}
              {departments.length > 0 && availableSpecialties.length > 0 && (
                <div className="animate-step-in">
                  <p className="text-sm font-semibold text-[#3F4752] mb-1">
                    Any specialties? <span className="text-xs font-normal text-[#94a3b8]">optional</span>
                  </p>
                  <p className="text-xs text-[#94a3b8] mb-3">
                    You can always browse everything. This just helps us prioritise.
                  </p>
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input
                      type="text"
                      placeholder="Filter specialties…"
                      value={specialtySearch}
                      onChange={(e) => setSpecialtySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-[#D5DCE3] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] transition-shadow"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableSpecialties
                      .filter((s) => !specialtySearch || s.toLowerCase().includes(specialtySearch.toLowerCase()))
                      .map((s, i) => (
                        <Chip
                          key={s}
                          label={s}
                          selected={specialties.includes(s)}
                          onToggle={() => setSpecialties((prev) =>
                            prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
                          )}
                          delay={i * 20}
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
              <h2 className="text-2xl font-bold text-[#3F4752] mb-1">You&apos;re set up.</h2>
              <p className="text-sm text-[#64748b] mb-6">
                Your view is personalised. Cards most relevant to your role and area will appear first.
              </p>

              <div className="bg-white border border-[#D5DCE3] rounded-xl divide-y divide-[#F4F7FA]">
                {[
                  { label: "Role",     value: role || "-" },
                  { label: "Area",     value: departments.join(", ") || "-" },
                  { label: "Hospital", value: hospital || "-" },
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
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#D5DCE3] bg-white/95 px-6 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-4 backdrop-blur lg:py-4">
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
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#4DA3FF] text-white px-4 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2F8EF7] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {CTA_LABELS[step - 1]} <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#4DA3FF] text-white px-4 py-3.5 rounded-xl text-sm font-semibold hover:bg-[#2F8EF7] transition-colors pulse-once disabled:opacity-60"
            >
              {saving
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Check size={15} /> {CTA_LABELS[4]}</>
              }
            </button>
          )}

        </div>
      </div>
    </div>
  )
}
