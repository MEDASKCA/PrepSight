"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink, Pencil, Check, X, Clock } from "lucide-react"
import ItemRow from "./ItemRow"
import { Section } from "@/lib/types"

interface Props {
  section: Section
  defaultOpen?: boolean
}

function today() {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default function KardexSection({ section, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  const [positionText, setPositionText] = useState(section.patientPositionInstructions ?? "")
  const [positionDraft, setPositionDraft] = useState(positionText)
  const [editingPosition, setEditingPosition] = useState(false)
  const [positionPending, setPositionPending] = useState(false)

  const [nurseNotes, setNurseNotes] = useState(section.nurseNotes ?? "")
  const [notesDraft, setNotesDraft] = useState(nurseNotes)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesLastEdited, setNotesLastEdited] = useState<string | null>(null)

  const isProcedureRef  = section.sectionType === "procedure_reference"
  const isNurseNotes    = section.sectionType === "nurse_prep_notes"
  const isPositioning   = section.sectionType === "patient_positioning"
  const isOverview      = section.sectionType === "overview"
  const isPostCare      = section.sectionType === "post_procedure_care"
  const isDischarge     = section.sectionType === "discharge_criteria"
  const isComplications = section.sectionType === "complications_escalation"

  return (
    <div className="bg-white border border-[#D5DCE3] rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-[#4DA3FF] hover:bg-[#2F8EF7] transition-colors text-white font-semibold text-base text-left"
      >
        <span>{section.title}</span>
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {open && (
        <div className="px-4 py-2">

          {/* ── OVERVIEW ───────────────────────────────────────────── */}
          {isOverview && (section.summary || section.duration || section.anaesthesiaType) && (
            <div className="py-2 space-y-2">
              {section.summary && (
                <p className="text-base text-[#475569] leading-relaxed">{section.summary}</p>
              )}
              <div className="flex flex-wrap gap-4">
                {section.duration && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Duration</p>
                    <p className="text-sm font-semibold text-[#3F4752]">{section.duration}</p>
                  </div>
                )}
                {section.anaesthesiaType && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Anaesthesia</p>
                    <p className="text-sm font-semibold text-[#3F4752]">{section.anaesthesiaType}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PROCEDURE REFERENCE ────────────────────────────────── */}
          {isProcedureRef && (
            <div className="py-2 space-y-4">
              {(section.operativeTechniqueUrl || section.implantGuideUrl || (section.externalLinks && section.externalLinks.length > 0)) && (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8]">References</p>
                  {section.operativeTechniqueUrl && (
                    <a
                      href={section.operativeTechniqueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base font-semibold text-[#2F8EF7] underline underline-offset-2"
                    >
                      <ExternalLink size={16} className="shrink-0" />
                      Operative Technique
                    </a>
                  )}
                  {section.implantGuideUrl && (
                    <a
                      href={section.implantGuideUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base font-semibold text-[#2F8EF7] underline underline-offset-2"
                    >
                      <ExternalLink size={16} className="shrink-0" />
                      Implant Guide / Catalogue
                    </a>
                  )}
                  {section.externalLinks?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-base font-semibold text-[#2F8EF7] underline underline-offset-2"
                    >
                      <ExternalLink size={16} className="shrink-0" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── NURSE PREP NOTES ───────────────────────────────────── */}
          {isNurseNotes && (
            <div className="border border-[#D5DCE3] rounded-xl p-4 bg-[#f8fafc] my-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Nurse prep notes</p>
                {!editingNotes && (
                  <button
                    onClick={() => { setNotesDraft(nurseNotes); setEditingNotes(true) }}
                    className="flex items-center gap-1 text-xs text-[#2F8EF7] font-semibold"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                )}
              </div>
              {editingNotes ? (
                <>
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    rows={5}
                    className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] bg-white"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setNurseNotes(notesDraft); setNotesLastEdited(today()); setEditingNotes(false) }}
                      className="flex items-center gap-1 bg-[#4DA3FF] text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-[#2F8EF7] transition-colors"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      onClick={() => setEditingNotes(false)}
                      className="flex items-center gap-1 text-sm text-[#64748b] px-3 py-1.5 rounded-lg border border-[#D5DCE3] hover:bg-[#F4F7FA] transition-colors"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-base text-[#475569] leading-relaxed whitespace-pre-wrap">
                    {nurseNotes || <span className="text-[#cbd5e1]">No prep notes added yet.</span>}
                  </p>
                  {notesLastEdited && (
                    <p className="mt-2 text-xs text-[#94a3b8] flex items-center gap-1">
                      <Clock size={11} /> Last edited by You · {notesLastEdited}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── PATIENT POSITIONING ────────────────────────────────── */}
          {isPositioning && (
            <div className="border border-[#D5DCE3] rounded-xl p-4 bg-[#f8fafc] mt-2 mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Patient positioning</p>
                {!editingPosition && (
                  <button
                    onClick={() => { setPositionDraft(positionText); setEditingPosition(true); setPositionPending(false) }}
                    className="flex items-center gap-1 text-xs text-[#2F8EF7] font-semibold"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                )}
              </div>
              {editingPosition ? (
                <>
                  <textarea
                    value={positionDraft}
                    onChange={(e) => setPositionDraft(e.target.value)}
                    rows={5}
                    className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#4DA3FF] bg-white"
                  />
                  <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                    ⚠ Changes to patient positioning require clinical approval before publishing.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => { setPositionText(positionDraft); setPositionPending(true); setEditingPosition(false) }}
                      className="flex items-center gap-1 bg-amber-500 text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-amber-600 transition-colors"
                    >
                      <Check size={14} /> Submit for approval
                    </button>
                    <button
                      onClick={() => setEditingPosition(false)}
                      className="flex items-center gap-1 text-sm text-[#64748b] px-3 py-1.5 rounded-lg border border-[#D5DCE3] hover:bg-[#F4F7FA] transition-colors"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-base text-[#475569] leading-relaxed whitespace-pre-wrap">
                    {positionText || <span className="text-[#cbd5e1]">No positioning instructions set.</span>}
                  </p>
                  {positionPending && (
                    <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                      <Clock size={11} /> Pending clinical approval
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── POST-PROCEDURE CARE ────────────────────────────────── */}
          {isPostCare && section.recoveryNotes && (
            <div className="border border-[#D5DCE3] rounded-xl p-4 bg-[#f8fafc] my-2">
              <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Recovery notes</p>
              <p className="text-base text-[#475569] leading-relaxed whitespace-pre-wrap">{section.recoveryNotes}</p>
            </div>
          )}

          {/* ── DISCHARGE CRITERIA ─────────────────────────────────── */}
          {isDischarge && section.dischargeCriteria && section.dischargeCriteria.length > 0 && (
            <div className="py-2">
              <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Discharge criteria</p>
              <ul className="space-y-1">
                {section.dischargeCriteria.map((criterion, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#475569]">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── COMPLICATIONS & ESCALATION ─────────────────────────── */}
          {isComplications && section.commonComplications && section.commonComplications.length > 0 && (
            <div className="py-2">
              <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Common complications</p>
              <ul className="space-y-1">
                {section.commonComplications.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#475569]">
                    <span className="text-amber-500 mt-0.5">⚠</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── ITEMS LIST ────────────────────────────────────────── */}
          {section.items.length > 0 && (
            <>
              <div className="flex items-center gap-2 pt-1 pb-1.5 text-xs uppercase tracking-wider text-[#94a3b8] border-b border-[#D5DCE3]">
                <div className="flex-1">Item</div>
                <div className="w-6 shrink-0" />
                <div className="w-14 shrink-0 text-center">Qty</div>
              </div>
              {section.items.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </>
          )}

        </div>
      )}
    </div>
  )
}
