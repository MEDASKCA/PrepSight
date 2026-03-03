import { Surgeon, SurgeonProcedure } from "./types"

// ── Surgeon Registry ──────────────────────────────────────────────────────────
// These are the "drivers". Each surgeon can be assigned to multiple procedures.
// Multiple surgeons can share the same procedure (different garage, same car model).

export const surgeons: Surgeon[] = [

  // ── Orthopaedics ────────────────────────────────────────────────────────────
  { id: "mr-wilson",    name: "Mr James Wilson",    shortName: "Wilson",    initials: "JW", specialty: "Orthopaedics",      grade: "Consultant" },
  { id: "mr-patel-d",   name: "Mr Deven Patel",     shortName: "Patel",     initials: "DP", specialty: "Orthopaedics",      grade: "Consultant" },
  { id: "mr-okafor",    name: "Mr Taiwo Okafor",    shortName: "Okafor",    initials: "TO", specialty: "Orthopaedics",      grade: "Consultant" },
  { id: "ms-nair",      name: "Ms Priya Nair",      shortName: "Nair",      initials: "PN", specialty: "Orthopaedics",      grade: "Consultant" },
  { id: "mr-henderson", name: "Mr Craig Henderson", shortName: "Henderson", initials: "CH", specialty: "Orthopaedics",      grade: "Consultant" },

  // ── General Surgery ─────────────────────────────────────────────────────────
  { id: "ms-haines",    name: "Ms Sarah Haines",    shortName: "Haines",    initials: "SH", specialty: "General Surgery",   grade: "Consultant" },
  { id: "mr-khan",      name: "Mr Ahmed Khan",       shortName: "Khan",      initials: "AK", specialty: "General Surgery",   grade: "Consultant" },
  { id: "mr-thomas",    name: "Mr David Thomas",     shortName: "Thomas",    initials: "DT", specialty: "General Surgery",   grade: "Consultant" },

  // ── Urology ─────────────────────────────────────────────────────────────────
  { id: "mr-bradshaw",  name: "Mr Tom Bradshaw",     shortName: "Bradshaw",  initials: "TB", specialty: "Urology",           grade: "Consultant" },
  { id: "ms-farouk",    name: "Ms Leila Farouk",     shortName: "Farouk",    initials: "LF", specialty: "Urology",           grade: "Consultant" },

  // ── Gynaecology ─────────────────────────────────────────────────────────────
  { id: "ms-thornton",  name: "Ms Emma Thornton",    shortName: "Thornton",  initials: "ET", specialty: "Gynaecology",       grade: "Consultant" },
  { id: "ms-obi",       name: "Ms Jasmine Obi",      shortName: "Obi",       initials: "JO", specialty: "Gynaecology",       grade: "Consultant" },

  // ── ENT ─────────────────────────────────────────────────────────────────────
  { id: "mr-fraser",    name: "Mr Colin Fraser",     shortName: "Fraser",    initials: "CF", specialty: "ENT",               grade: "Consultant" },
  { id: "mr-anand",     name: "Mr Deepak Anand",     shortName: "Anand",     initials: "DA", specialty: "ENT",               grade: "Consultant" },

  // ── Ophthalmology ───────────────────────────────────────────────────────────
  { id: "mr-lee",       name: "Mr Christopher Lee",  shortName: "Lee",       initials: "CL", specialty: "Ophthalmology",     grade: "Consultant" },
  { id: "ms-reyes",     name: "Ms Marina Reyes",     shortName: "Reyes",     initials: "MR", specialty: "Ophthalmology",     grade: "Consultant" },

  // ── Vascular Surgery ────────────────────────────────────────────────────────
  { id: "mr-hughes",    name: "Mr Oliver Hughes",    shortName: "Hughes",    initials: "OH", specialty: "Vascular Surgery",  grade: "Consultant" },
  { id: "ms-chukwu",    name: "Ms Diana Chukwu",     shortName: "Chukwu",    initials: "DC", specialty: "Vascular Surgery",  grade: "Consultant" },

  // ── Cardiothoracic Surgery ──────────────────────────────────────────────────
  { id: "mr-porter",    name: "Mr Andrew Porter",    shortName: "Porter",    initials: "AP", specialty: "Cardiothoracic",    grade: "Consultant" },
  { id: "mr-tanaka",    name: "Mr Yuki Tanaka",      shortName: "Tanaka",    initials: "YT", specialty: "Cardiothoracic",    grade: "Consultant" },

  // ── Neurosurgery ────────────────────────────────────────────────────────────
  { id: "mr-bergmann",  name: "Mr Felix Bergmann",   shortName: "Bergmann",  initials: "FB", specialty: "Neurosurgery",      grade: "Consultant" },
  { id: "ms-musa",      name: "Ms Aisha Musa",       shortName: "Musa",      initials: "AM", specialty: "Neurosurgery",      grade: "Consultant" },

  // ── Plastics & Reconstructive ───────────────────────────────────────────────
  { id: "ms-kim",       name: "Ms Rachel Kim",       shortName: "Kim",       initials: "RK", specialty: "Plastics",          grade: "Consultant" },
  { id: "mr-novak",     name: "Mr Stefan Novak",     shortName: "Novak",     initials: "SN", specialty: "Plastics",          grade: "Consultant" },
]

// ── Surgeon Garages ───────────────────────────────────────────────────────────
// Each entry = one surgeon's assignment of one procedure template.
// Same procedure can appear in multiple surgeons' garages.
// Optional fields override the template default for that surgeon.

export const surgeonProcedures: SurgeonProcedure[] = [

  // ── Mr James Wilson (Orthopaedics — arthroplasty) ──────────────────────────
  { id: "wilson-thr",  surgeonId: "mr-wilson", procedureId: "thr-posterior",      implantSystem: "Exeter / Trident" },
  { id: "wilson-tkr",  surgeonId: "mr-wilson", procedureId: "tkr",                implantSystem: "ATTUNE" },
  { id: "wilson-ukr",  surgeonId: "mr-wilson", procedureId: "ukr",                implantSystem: "Oxford Phase 3" },

  // ── Mr Deven Patel (Orthopaedics — knee specialist) ────────────────────────
  { id: "patel-thr",   surgeonId: "mr-patel-d", procedureId: "thr-posterior",     implantSystem: "Corail / Pinnacle" },
  { id: "patel-tkr",   surgeonId: "mr-patel-d", procedureId: "tkr",               implantSystem: "Persona" },
  { id: "patel-acl",   surgeonId: "mr-patel-d", procedureId: "acl-reconstruction" },

  // ── Mr Taiwo Okafor (Orthopaedics — trauma) ────────────────────────────────
  { id: "okafor-nail", surgeonId: "mr-okafor", procedureId: "im-nail-femur",      implantSystem: "Stryker Gamma3" },
  { id: "okafor-dhs",  surgeonId: "mr-okafor", procedureId: "dhs",                implantSystem: "Synthes DHS" },
  { id: "okafor-tlif", surgeonId: "mr-okafor", procedureId: "tlif" },

  // ── Ms Priya Nair (Orthopaedics — upper limb & sports) ─────────────────────
  { id: "nair-tsa",    surgeonId: "ms-nair", procedureId: "tsa",                   implantSystem: "Aequalis Ascend Flex" },
  { id: "nair-acl",    surgeonId: "ms-nair", procedureId: "acl-reconstruction",    notes: "Prefers hamstring autograft. Graft board to be set up before list starts." },
  { id: "nair-ankle",  surgeonId: "ms-nair", procedureId: "ankle-arthroplasty",    implantSystem: "INFINITY Total Ankle" },

  // ── Mr Craig Henderson (Orthopaedics — spine & trauma) ─────────────────────
  { id: "hend-tlif",   surgeonId: "mr-henderson", procedureId: "tlif" },
  { id: "hend-dhs",    surgeonId: "mr-henderson", procedureId: "dhs" },
  { id: "hend-ukr",    surgeonId: "mr-henderson", procedureId: "ukr",              implantSystem: "Repicci II" },

  // ── Ms Sarah Haines (General Surgery — laparoscopic) ───────────────────────
  { id: "haines-chole",  surgeonId: "ms-haines", procedureId: "lap-chole" },
  { id: "haines-app",    surgeonId: "ms-haines", procedureId: "appendicectomy-lap" },
  { id: "haines-hernia", surgeonId: "ms-haines", procedureId: "inguinal-hernia-lap" },

  // ── Mr Ahmed Khan (General Surgery — colorectal) ───────────────────────────
  { id: "khan-hartmann",  surgeonId: "mr-khan", procedureId: "hartmanns" },
  { id: "khan-hemi",      surgeonId: "mr-khan", procedureId: "right-hemicolectomy" },
  { id: "khan-ar",        surgeonId: "mr-khan", procedureId: "anterior-resection" },
  { id: "khan-thyroid",   surgeonId: "mr-khan", procedureId: "thyroidectomy" },

  // ── Mr David Thomas (General Surgery — general) ────────────────────────────
  { id: "thomas-chole",   surgeonId: "mr-thomas", procedureId: "lap-chole" },
  { id: "thomas-app",     surgeonId: "mr-thomas", procedureId: "open-appendicectomy" },
  { id: "thomas-hernia",  surgeonId: "mr-thomas", procedureId: "inguinal-hernia-open" },

  // ── Mr Tom Bradshaw (Urology — endourology) ────────────────────────────────
  { id: "bradshaw-turp",  surgeonId: "mr-bradshaw", procedureId: "turp" },
  { id: "bradshaw-pcnl",  surgeonId: "mr-bradshaw", procedureId: "pcnl" },
  { id: "bradshaw-cysto", surgeonId: "mr-bradshaw", procedureId: "cystoscopy-bimanual" },
  { id: "bradshaw-urs",   surgeonId: "mr-bradshaw", procedureId: "ureteroscopy-laser" },

  // ── Ms Leila Farouk (Urology — oncology & laparoscopic) ────────────────────
  { id: "farouk-nephr",   surgeonId: "ms-farouk", procedureId: "nephrectomy-lap" },
  { id: "farouk-rarp",    surgeonId: "ms-farouk", procedureId: "radical-prostatectomy-robotic" },
  { id: "farouk-urs",     surgeonId: "ms-farouk", procedureId: "ureteroscopy-laser" },

  // ── Ms Emma Thornton (Gynaecology — laparoscopic) ──────────────────────────
  { id: "thornton-hyst",  surgeonId: "ms-thornton", procedureId: "laparoscopic-hysterectomy" },
  { id: "thornton-myo",   surgeonId: "ms-thornton", procedureId: "lap-myomectomy" },
  { id: "thornton-dye",   surgeonId: "ms-thornton", procedureId: "laparoscopy-dye" },

  // ── Ms Jasmine Obi (Gynaecology — open & urogynaecology) ───────────────────
  { id: "obi-hyst",       surgeonId: "ms-obi", procedureId: "abdominal-hysterectomy" },
  { id: "obi-lletz",      surgeonId: "ms-obi", procedureId: "lletz" },
  { id: "obi-tvt",        surgeonId: "ms-obi", procedureId: "tension-free-vaginal-tape" },

  // ── Mr Colin Fraser (ENT — paediatric & otology) ───────────────────────────
  { id: "fraser-tonsil",  surgeonId: "mr-fraser", procedureId: "tonsillectomy" },
  { id: "fraser-grommets", surgeonId: "mr-fraser", procedureId: "grommets" },
  { id: "fraser-septum",  surgeonId: "mr-fraser", procedureId: "septoplasty" },

  // ── Mr Deepak Anand (ENT — rhinology & head/neck) ──────────────────────────
  { id: "anand-fess",     surgeonId: "mr-anand", procedureId: "functional-ess" },
  { id: "anand-pinna",    surgeonId: "mr-anand", procedureId: "pinnaplasty" },
  { id: "anand-subman",   surgeonId: "mr-anand", procedureId: "submandibular-gland" },
  { id: "anand-tonsil",   surgeonId: "mr-anand", procedureId: "tonsillectomy" },

  // ── Mr Christopher Lee (Ophthalmology — anterior segment) ──────────────────
  { id: "lee-phaco",      surgeonId: "mr-lee", procedureId: "phacoemulsification" },
  { id: "lee-trab",       surgeonId: "mr-lee", procedureId: "trabeculectomy" },

  // ── Ms Marina Reyes (Ophthalmology — vitreoretinal) ────────────────────────
  { id: "reyes-vitrec",   surgeonId: "ms-reyes", procedureId: "vitrectomy-ppv" },
  { id: "reyes-strab",    surgeonId: "ms-reyes", procedureId: "strabismus-repair" },
  { id: "reyes-phaco",    surgeonId: "ms-reyes", procedureId: "phacoemulsification" },

  // ── Mr Oliver Hughes (Vascular — open & EVAR) ──────────────────────────────
  { id: "hughes-cea",     surgeonId: "mr-hughes", procedureId: "carotid-endarterectomy" },
  { id: "hughes-evar",    surgeonId: "mr-hughes", procedureId: "evar" },
  { id: "hughes-bypass",  surgeonId: "mr-hughes", procedureId: "fem-pop-bypass" },

  // ── Ms Diana Chukwu (Vascular — peripheral & amputation) ───────────────────
  { id: "chukwu-vv",      surgeonId: "ms-chukwu", procedureId: "varicose-veins-tevlar" },
  { id: "chukwu-bka",     surgeonId: "ms-chukwu", procedureId: "below-knee-amputation" },
  { id: "chukwu-bypass",  surgeonId: "ms-chukwu", procedureId: "fem-pop-bypass" },

  // ── Mr Andrew Porter (Cardiothoracic — cardiac) ────────────────────────────
  { id: "porter-cabg",    surgeonId: "mr-porter", procedureId: "cabg" },
  { id: "porter-avr",     surgeonId: "mr-porter", procedureId: "avr" },

  // ── Mr Yuki Tanaka (Cardiothoracic — thoracic) ─────────────────────────────
  { id: "tanaka-vats",    surgeonId: "mr-tanaka", procedureId: "lobectomy-vats" },
  { id: "tanaka-pneumo",  surgeonId: "mr-tanaka", procedureId: "pneumonectomy" },
  { id: "tanaka-drain",   surgeonId: "mr-tanaka", procedureId: "thoracic-drainage" },

  // ── Mr Felix Bergmann (Neurosurgery — cranial & shunt) ─────────────────────
  { id: "berg-cranio",    surgeonId: "mr-bergmann", procedureId: "craniotomy-tumour" },
  { id: "berg-burr",      surgeonId: "mr-bergmann", procedureId: "burr-hole-haematoma" },
  { id: "berg-shunt",     surgeonId: "mr-bergmann", procedureId: "vp-shunt" },

  // ── Ms Aisha Musa (Neurosurgery — spine & cranial) ─────────────────────────
  { id: "musa-disc",      surgeonId: "ms-musa", procedureId: "lumbar-discectomy" },
  { id: "musa-cranio",    surgeonId: "ms-musa", procedureId: "craniotomy-tumour" },

  // ── Ms Rachel Kim (Plastics — reconstructive) ──────────────────────────────
  { id: "kim-ssg",        surgeonId: "ms-kim", procedureId: "split-skin-graft" },
  { id: "kim-ftg",        surgeonId: "ms-kim", procedureId: "full-thickness-graft" },
  { id: "kim-diep",       surgeonId: "ms-kim", procedureId: "diep-flap" },

  // ── Mr Stefan Novak (Plastics — hand surgery) ──────────────────────────────
  { id: "novak-cts",      surgeonId: "mr-novak", procedureId: "carpal-tunnel-release" },
  { id: "novak-dup",      surgeonId: "mr-novak", procedureId: "dupuytren-fasciectomy" },
  { id: "novak-ftg",      surgeonId: "mr-novak", procedureId: "full-thickness-graft" },
]

// ── Helper functions ──────────────────────────────────────────────────────────

export function getSurgeonById(id: string): Surgeon | undefined {
  return surgeons.find((s) => s.id === id)
}

export function getSurgeonsBySpecialty(specialty: string): Surgeon[] {
  return surgeons.filter((s) => s.specialty === specialty)
}

/** All procedure assignments for a given surgeon (their "garage") */
export function getSurgeonLibrary(surgeonId: string): SurgeonProcedure[] {
  return surgeonProcedures.filter((sp) => sp.surgeonId === surgeonId)
}

/** All surgeons who have a given procedure in their garage */
export function getSurgeonsForProcedure(procedureId: string): Surgeon[] {
  const ids = new Set(
    surgeonProcedures
      .filter((sp) => sp.procedureId === procedureId)
      .map((sp) => sp.surgeonId)
  )
  return surgeons.filter((s) => ids.has(s.id))
}

/** Specific surgeon-procedure assignment (their version of that car) */
export function getSurgeonProcedure(surgeonId: string, procedureId: string): SurgeonProcedure | undefined {
  return surgeonProcedures.find(
    (sp) => sp.surgeonId === surgeonId && sp.procedureId === procedureId
  )
}
