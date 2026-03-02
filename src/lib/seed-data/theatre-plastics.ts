import { Procedure } from "../types"

function sk(id: string, name: string, approach?: string, implantSystem?: string): Procedure {
  return {
    id, name,
    setting: "Operating Theatre",
    specialty: "Plastics & Reconstructive",
    approach,
    implantSystem,
    sections: [
      { id: "ppe", title: "PPE", sectionType: "ppe", items: [
        { id: "gown",   name: "Surgical Gown",   sku: "Proxima OR",    defaultQty: 3 },
        { id: "gloves", name: "Surgical Gloves", sku: "Biogel Eclipse", defaultQty: 2 },
        { id: "loupe",  name: "Surgical Loupe",   sku: "Keeler 3.5×",   description: "Magnification for anastomosis", defaultQty: 1 },
      ]},
      { id: "devices", title: "Equipment & Devices", sectionType: "equipment_devices", items: [
        { id: "diathermy",    name: "Diathermy Unit",          sku: "Valleylab FT10", defaultQty: 1 },
        { id: "doppler",      name: "Handheld Doppler",        sku: "Hadeco ES-100V3", description: "Perforator mapping", defaultQty: 1 },
        { id: "tourniquet",   name: "Pneumatic Tourniquet",    sku: "ATS 3000",        defaultQty: 1 },
      ]},
      { id: "nurse-notes", title: "Nurse Prep Notes", sectionType: "nurse_prep_notes",
        nurseNotes: "Loupe use — no sudden movements. Microsurgery: dedicated microsurgery tray. Flap monitoring post-op by nursing team.",
        items: [],
      },
    ],
  }
}

export const theatrePlastics: Procedure[] = [
  sk("split-skin-graft",      "Split-Thickness Skin Graft (STSG)",    "Donor + recipient sites"),
  sk("full-thickness-graft",  "Full-Thickness Skin Graft (FTSG)",     "Donor + recipient sites"),
  sk("diep-flap",             "DIEP Flap Breast Reconstruction",       "Free flap"),
  sk("carpal-tunnel-release", "Carpal Tunnel Release",                 "Open / endoscopic"),
  sk("dupuytren-fasciectomy", "Dupuytren's Fasciectomy",               "Zigzag / Bruner incision"),
]
