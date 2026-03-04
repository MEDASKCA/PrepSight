"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink, Save, Check, X, Clock, SquarePen, Plus, Trash2 } from "lucide-react"
import ItemRow from "./ItemRow"
import { Section, Item } from "@/lib/types"

interface Props {
  section: Section
  defaultOpen?: boolean
  onSave?: () => void
}

function today() {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default function KardexSection({ section, defaultOpen = false, onSave }: Props) {
  const [open, setOpen]             = useState(defaultOpen)
  const [editMode, setEditMode]     = useState(false)
  const [savedFeedback, setSavedFeedback] = useState(false)
  const [localItems, setLocalItems] = useState<Item[]>(section.items)

  // Nurse prep notes
  const [nurseNotes, setNurseNotes]             = useState(section.nurseNotes ?? "")
  const [notesDraft, setNotesDraft]             = useState(section.nurseNotes ?? "")
  const [notesLastEdited, setNotesLastEdited]   = useState<string | null>(null)

  // Patient positioning
  const [positionText, setPositionText]   = useState(section.patientPositionInstructions ?? "")
  const [positionDraft, setPositionDraft] = useState(section.patientPositionInstructions ?? "")
  const [positionPending, setPositionPending] = useState(false)

  // Procedure reference links
  const [localOpTechUrl,      setLocalOpTechUrl]      = useState(section.operativeTechniqueUrl ?? "")
  const [localImplantUrl,     setLocalImplantUrl]      = useState(section.implantGuideUrl ?? "")
  const [localExternalLinks,  setLocalExternalLinks]   = useState<{ url: string; label: string }[]>(
    section.externalLinks ?? []
  )

  function handleEditSave() {
    if (editMode) {
      // Commit nurse notes
      if (notesDraft !== nurseNotes) {
        setNurseNotes(notesDraft)
        setNotesLastEdited(today())
      }
      // Commit positioning
      if (positionDraft !== positionText) {
        setPositionText(positionDraft)
        setPositionPending(true)
      }
      // TODO: persist all changes to Firestore proposed_changes
      setEditMode(false)
      setSavedFeedback(true)
      setTimeout(() => setSavedFeedback(false), 1500)
      onSave?.()
    } else {
      // Enter edit mode — sync drafts from committed values
      setNotesDraft(nurseNotes)
      setPositionDraft(positionText)
      setEditMode(true)
    }
  }

  function deleteItem(id: string) {
    setLocalItems((prev) => prev.filter((i) => i.id !== id))
  }

  function addExternalLink() {
    setLocalExternalLinks((prev) => [...prev, { label: "", url: "" }])
  }

  function updateExternalLink(i: number, field: "label" | "url", value: string) {
    setLocalExternalLinks((prev) =>
      prev.map((link, idx) => (idx === i ? { ...link, [field]: value } : link))
    )
  }

  function removeExternalLink(i: number) {
    setLocalExternalLinks((prev) => prev.filter((_, idx) => idx !== i))
  }

  const isProcedureRef  = section.sectionType === "procedure_reference"
  const isNurseNotes    = section.sectionType === "nurse_prep_notes"
  const isPositioning   = section.sectionType === "patient_positioning"
  const isOverview      = section.sectionType === "overview"
  const isPostCare      = section.sectionType === "post_procedure_care"
  const isDischarge     = section.sectionType === "discharge_criteria"
  const isComplications = section.sectionType === "complications_escalation"

  return (
    <div className="bg-white border border-[#D5DCE3] rounded-xl overflow-hidden mb-3">
      <div className="flex items-center bg-[#4DA3FF] transition-colors">
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-3 px-4 py-3.5 hover:bg-[#2F8EF7] transition-colors text-white font-semibold text-base text-left"
        >
          <span className="flex-1">{section.title}</span>
        </button>

        {open && (
          savedFeedback ? (
            <div className="ml-2 mr-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check size={14} className="text-white" />
            </div>
          ) : (
            <button
              onClick={handleEditSave}
              className={`ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                editMode
                  ? "bg-[#F87171] text-white hover:bg-[#ef4444]"
                  : "bg-white/20 text-white hover:bg-white/35"
              }`}
              aria-label={editMode ? "Save changes" : "Edit section"}
            >
              {editMode
                ? <><Save size={13} /> Save</>
                : <><SquarePen size={13} /> Edit</>
              }
            </button>
          )
        )}

        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-3.5 hover:bg-[#2F8EF7] transition-colors text-white"
        >
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

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
              {editMode ? (
                /* Edit mode — link inputs */
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8]">Edit references</p>

                  <div>
                    <label className="text-xs text-[#64748b] font-medium block mb-1.5">
                      Operative Technique URL
                    </label>
                    <input
                      type="url"
                      value={localOpTechUrl}
                      onChange={(e) => setLocalOpTechUrl(e.target.value)}
                      placeholder="https://"
                      className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#64748b] font-medium block mb-1.5">
                      Implant Guide / Catalogue URL
                    </label>
                    <input
                      type="url"
                      value={localImplantUrl}
                      onChange={(e) => setLocalImplantUrl(e.target.value)}
                      placeholder="https://"
                      className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                    />
                  </div>

                  {localExternalLinks.map((link, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateExternalLink(i, "label", e.target.value)}
                          placeholder="Link label"
                          className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateExternalLink(i, "url", e.target.value)}
                          placeholder="https://"
                          className="w-full text-sm border border-[#D5DCE3] rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#F87171] focus:border-transparent placeholder:text-[#D5DCE3]"
                        />
                      </div>
                      <button
                        onClick={() => removeExternalLink(i)}
                        className="mt-1 w-7 h-7 rounded-full bg-[#F87171]/10 flex items-center justify-center text-[#F87171] hover:bg-[#F87171]/20 transition-colors shrink-0"
                        aria-label="Remove link"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={addExternalLink}
                    className="flex items-center gap-1.5 text-sm text-[#2F8EF7] font-semibold"
                  >
                    <Plus size={14} /> Add link
                  </button>
                </div>
              ) : (
                /* View mode — link list */
                (localOpTechUrl || localImplantUrl || localExternalLinks.some((l) => l.url)) && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-[#94a3b8]">References</p>
                    {localOpTechUrl && (
                      <a
                        href={localOpTechUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-base font-semibold text-[#2F8EF7] underline underline-offset-2"
                      >
                        <ExternalLink size={16} className="shrink-0" />
                        Operative Technique
                      </a>
                    )}
                    {localImplantUrl && (
                      <a
                        href={localImplantUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-base font-semibold text-[#2F8EF7] underline underline-offset-2"
                      >
                        <ExternalLink size={16} className="shrink-0" />
                        Implant Guide / Catalogue
                      </a>
                    )}
                    {localExternalLinks.filter((l) => l.url).map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-base font-semibold text-[#2F8EF7] underline underline-offset-2"
                      >
                        <ExternalLink size={16} className="shrink-0" />
                        {link.label || link.url}
                      </a>
                    ))}
                  </div>
                )
              )}
            </div>
          )}

          {/* ── NURSE PREP NOTES ───────────────────────────────────── */}
          {isNurseNotes && (
            <div className="border border-[#D5DCE3] rounded-xl p-4 bg-[#f8fafc] my-2">
              <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Nurse prep notes</p>
              {editMode ? (
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={5}
                  className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#F87171] bg-white"
                />
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
              <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Patient positioning</p>
              {editMode ? (
                <>
                  <textarea
                    value={positionDraft}
                    onChange={(e) => setPositionDraft(e.target.value)}
                    rows={5}
                    className="w-full text-base border border-[#D5DCE3] rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#F87171] bg-white"
                  />
                  <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                    ⚠ Changes to patient positioning require clinical approval before publishing.
                  </p>
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
          {localItems.length > 0 && (
            <>
              <div className="flex items-center pt-1 pb-1.5 text-xs uppercase tracking-wider text-[#94a3b8] border-b border-[#D5DCE3]">
                <div className="flex-1">Item</div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-14 text-center">Loc</div>
                  <div className="w-10 text-center">Qty</div>
                  {editMode && <div className="w-[60px]" />}
                </div>
              </div>
              {localItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  editMode={editMode}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
            </>
          )}

        </div>
      )}
    </div>
  )
}
