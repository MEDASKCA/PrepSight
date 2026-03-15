"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink, Save, Check, Clock, SquarePen, Plus, Trash2 } from "lucide-react"
import ItemRow from "./ItemRow"
import CataloguePickerModal from "./CataloguePickerModal"
import ImplantCheckPanel from "./ImplantCheckPanel"
import { Section, Item } from "@/lib/types"

interface Props {
  section: Section
  defaultOpen?: boolean
  anchorId?: string
  showChecks?: boolean
  checkedItems?: Set<string>
  onItemCheck?: (itemId: string) => void
  implantSystem?: string
  procedureId?: string
  procedureName?: string
  uid?: string | null
  onSave?: () => void
  onSectionChange?: (section: Section) => void
}

function today() {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export default function KardexSection({
  section,
  defaultOpen = false,
  anchorId,
  showChecks = false,
  checkedItems,
  onItemCheck,
  implantSystem,
  procedureId,
  procedureName,
  uid,
  onSave,
  onSectionChange,
}: Props) {
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
  const [showCataloguePicker, setShowCataloguePicker] = useState(false)

  function handleEditSave() {
    if (!canEditSection) return
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
      emitSectionChange({
        items: localItems,
        nurseNotes: notesDraft,
        patientPositionInstructions: positionDraft,
        operativeTechniqueUrl: localOpTechUrl,
        implantGuideUrl: localImplantUrl,
        externalLinks: localExternalLinks,
      })
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
    setLocalItems((prev) => {
      const next = prev.filter((i) => i.id !== id)
      onSectionChange?.({ ...section, items: next })
      return next
    })
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

  function addItemFromCatalogue(item: Item) {
    setLocalItems((prev) => {
      const next = [...prev, item]
      onSectionChange?.({ ...section, items: next })
      return next
    })
    setShowCataloguePicker(false)
  }

  const isProcedureRef  = section.sectionType === "procedure_reference"
  const isNurseNotes    = section.sectionType === "nurse_prep_notes"
  const isPositioning   = section.sectionType === "patient_positioning"
  const isOverview      = section.sectionType === "overview"
  const isPostCare      = section.sectionType === "post_procedure_care"
  const isDischarge     = section.sectionType === "discharge_criteria"
  const isComplications = section.sectionType === "complications_escalation"
  const isHandover      = section.sectionType === "handover_notes"
  const isImplants      = section.sectionType === "implants_prosthetics"
  const canEditSection  = section.contentMode !== "fixed"


  function emitSectionChange(overrides?: Partial<Section>) {
    onSectionChange?.({
      ...section,
      items: localItems,
      nurseNotes,
      patientPositionInstructions: positionText,
      operativeTechniqueUrl: localOpTechUrl,
      implantGuideUrl: localImplantUrl,
      externalLinks: localExternalLinks,
      ...overrides,
    })
  }

  return (
    <div id={anchorId} className="kardex-section mb-1 lg:mb-0 lg:border-b lg:border-white/8 scroll-mt-24">
      <div className="kardex-section-header flex items-center bg-[#4DA3FF] lg:bg-transparent lg:border-b lg:border-white/10 transition-colors">
        <button
          onClick={() => setOpen(!open)}
          className="flex-1 flex items-center gap-3 px-4 py-3.5 text-left text-base font-semibold text-white transition-colors hover:bg-[#2F8EF7] lg:px-7 lg:py-4 lg:text-[15px] lg:font-bold lg:uppercase lg:tracking-[0.06em] lg:text-white/60 lg:hover:bg-transparent lg:hover:text-white"
        >
          <span className="flex-1">{section.title}</span>
        </button>

        {open && canEditSection && (
          savedFeedback ? (
            <div className="ml-2 mr-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
              <Check size={14} className="text-white" />
            </div>
          ) : (
            <button
              onClick={handleEditSave}
              className={`ml-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors shrink-0 lg:mr-2 lg:px-4 lg:py-2 lg:text-sm ${
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
          className="px-4 py-3.5 text-white transition-colors hover:bg-[#2F8EF7] lg:px-6"
        >
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {open && (
        <div className="kardex-section-body px-4 py-2 lg:px-7 lg:py-6 lg:text-white/78">

          {/* ── OVERVIEW ───────────────────────────────────────────── */}
          {isOverview && (section.summary || section.duration || section.anaesthesiaType || section.primarySystem || section.alternatives?.length) && (
            <div className="py-2 space-y-3">
              {section.summary && (
                <p className="text-base leading-relaxed text-[#475569] lg:text-lg lg:leading-8 lg:text-white/72">{section.summary}</p>
              )}
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {section.duration && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#94a3b8] lg:text-white/38">Duration</p>
                    <p className="text-sm font-semibold text-[#3F4752] lg:text-white">{section.duration}</p>
                  </div>
                )}
                {section.anaesthesiaType && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#94a3b8] lg:text-white/38">Anaesthesia</p>
                    <p className="text-sm font-semibold text-[#3F4752] lg:text-white">{section.anaesthesiaType}</p>
                  </div>
                )}
                {section.primarySystem && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-[#94a3b8] lg:text-white/38">System</p>
                    <p className="text-sm font-semibold text-[#3F4752] lg:text-white">{section.primarySystem}</p>
                  </div>
                )}
              </div>
              {section.alternatives && section.alternatives.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8] lg:text-white/38 mb-1">Alternatives</p>
                  <div className="flex flex-wrap gap-1.5">
                    {section.alternatives.map((alt) => (
                      <span
                        key={alt}
                        className="rounded-full border border-[#D5DCE3] px-2.5 py-0.5 text-xs font-medium text-[#475569] lg:border-white/14 lg:text-white/70"
                      >
                        {alt}
                      </span>
                    ))}
                  </div>
                </div>
              )}
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
                        className="w-full rounded-xl border border-[#D5DCE3] px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F87171] placeholder:text-[#D5DCE3] lg:border-white/10 lg:bg-white/6 lg:text-white"
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
                        className="w-full rounded-xl border border-[#D5DCE3] px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F87171] placeholder:text-[#D5DCE3] lg:border-white/10 lg:bg-white/6 lg:text-white"
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
                          className="w-full rounded-xl border border-[#D5DCE3] px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F87171] placeholder:text-[#D5DCE3] lg:border-white/10 lg:bg-white/6 lg:text-white"
                        />
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateExternalLink(i, "url", e.target.value)}
                          placeholder="https://"
                          className="w-full rounded-xl border border-[#D5DCE3] px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F87171] placeholder:text-[#D5DCE3] lg:border-white/10 lg:bg-white/6 lg:text-white"
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
            <div className="my-2 rounded-xl border border-[#D5DCE3] bg-[#f8fafc] p-4 lg:border-white/10 lg:bg-white/6">
              <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Nurse prep notes</p>
              {editMode ? (
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-[#D5DCE3] bg-white px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#F87171] lg:border-white/10 lg:bg-white/6 lg:text-white"
                />
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-[#475569] lg:text-white/72">
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
            <div className="mt-2 mb-3 rounded-xl border border-[#D5DCE3] bg-[#f8fafc] p-4 lg:border-white/10 lg:bg-white/6">
              <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Patient positioning</p>
              {editMode ? (
                <>
                  <textarea
                    value={positionDraft}
                    onChange={(e) => setPositionDraft(e.target.value)}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-[#D5DCE3] bg-white px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#F87171] lg:border-white/10 lg:bg-white/6 lg:text-white"
                  />
                  <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                    ⚠ Changes to patient positioning require clinical approval before publishing.
                  </p>
                </>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-[#475569] lg:text-white/72">
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
            <div className="my-2 rounded-xl border border-[#D5DCE3] bg-[#f8fafc] p-4 lg:border-white/10 lg:bg-white/6">
              <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Recovery notes</p>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-[#475569] lg:text-white/72">{section.recoveryNotes}</p>
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

          {/* ── HANDOVER NOTES ─────────────────────────────────────── */}
          {isHandover && (
            <div className="space-y-4 py-2">
              {section.recoveryNotes && (
                <div className="rounded-xl border border-[#D5DCE3] bg-[#f8fafc] p-4 lg:border-white/10 lg:bg-white/6">
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Post-op care</p>
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-[#475569] lg:text-white/72">{section.recoveryNotes}</p>
                </div>
              )}
              {section.dischargeCriteria && section.dischargeCriteria.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Discharge criteria</p>
                  <ul className="space-y-1">
                    {section.dischargeCriteria.map((criterion, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#475569] lg:text-white/72">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        {criterion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {section.commonComplications && section.commonComplications.length > 0 && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#94a3b8] mb-2">Complications & escalation</p>
                  <ul className="space-y-1">
                    {section.commonComplications.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#475569] lg:text-white/72">
                        <span className="text-amber-500 mt-0.5">⚠</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ── IMPLANTS STOCK CHECK ──────────────────────────────── */}
          {isImplants && implantSystem && (
            <ImplantCheckPanel
              implantSystem={implantSystem}
              procedureId={procedureId ?? "unknown"}
              procedureName={procedureName ?? ""}
              uid={uid ?? null}
            />
          )}

          {/* ── ITEMS LIST ────────────────────────────────────────── */}
          {/* Suppress scaffold placeholder items in the implants section — the ImplantCheckPanel is the checklist */}
          {isImplants && implantSystem && !editMode ? null : (
          <>
          {editMode && canEditSection && (
            <div className="mb-3 flex justify-end">
              <button
                onClick={() => setShowCataloguePicker(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#E7F1FB] px-3 py-1.5 text-xs font-semibold text-[#1E293B] transition-colors hover:bg-[#D8E9FA]"
              >
                <Plus size={13} /> Add from catalogue
              </button>
            </div>
          )}

          {localItems.length > 0 && (
            <>
              {localItems.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  editMode={editMode}
                  allowEdit={!item.isFixed}
                  onDelete={() => deleteItem(item.id)}
                  isChecked={showChecks ? (checkedItems?.has(item.id) ?? false) : false}
                  onCheck={showChecks && onItemCheck ? () => onItemCheck(item.id) : undefined}
                />
              ))}
            </>
          )}
          </>
          )}

        </div>
      )}

      {showCataloguePicker && (
        <CataloguePickerModal
          sectionType={section.sectionType}
          onClose={() => setShowCataloguePicker(false)}
          onSelect={addItemFromCatalogue}
        />
      )}
    </div>
  )
}
