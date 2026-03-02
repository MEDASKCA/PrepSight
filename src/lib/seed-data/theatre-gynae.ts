import { Procedure } from "../types"

function sk(id: string, name: string, approach?: string, implantSystem?: string): Procedure {
  return {
    id, name,
    setting: "Operating Theatre",
    specialty: "Gynaecology",
    approach,
    implantSystem,
    sections: [
      { id: "ppe", title: "PPE", sectionType: "ppe", items: [
        { id: "gown",   name: "Surgical Gown",   sku: "Proxima OR",    defaultQty: 3 },
        { id: "gloves", name: "Surgical Gloves", sku: "Biogel Eclipse", defaultQty: 2 },
        { id: "visor",  name: "Face Visor",       sku: "SafeSight",      defaultQty: 1 },
      ]},
      { id: "devices", title: "Equipment & Devices", sectionType: "equipment_devices", items: [
        { id: "diathermy",       name: "Diathermy Unit",       sku: "Valleylab FT10",    defaultQty: 1 },
        { id: "laparoscopy-stack", name: "Laparoscopy Stack",   sku: "Stryker 1588",      defaultQty: 1 },
        { id: "uterine-manip",   name: "Uterine Manipulator",  sku: "Rumi Manipulator",  defaultQty: 1 },
      ]},
      { id: "nurse-notes", title: "Nurse Prep Notes", sectionType: "nurse_prep_notes",
        nurseNotes: "Confirm procedure at WHO sign-in. Lithotomy position required for most gynaecology. Check specimen containers labelled correctly.",
        items: [],
      },
    ],
  }
}

export const theatreGynae: Procedure[] = [
  sk("laparoscopic-hysterectomy", "Laparoscopic Hysterectomy",         "Laparoscopic"),
  sk("lap-myomectomy",            "Laparoscopic Myomectomy",            "Laparoscopic"),
  sk("laparoscopy-dye",           "Diagnostic Laparoscopy + Dye Test",  "Laparoscopic"),
  sk("abdominal-hysterectomy",    "Total Abdominal Hysterectomy",       "Pfannenstiel / Midline"),
  sk("lletz",                     "LLETZ / Large Loop Excision",        "Colposcopy"),
  sk("tension-free-vaginal-tape", "Tension-Free Vaginal Tape (TVT)",    "Retropubic", "Gynecare TVT"),
]
