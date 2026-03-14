import procedureVariantsTraumaAndOrthopaedics from "../../data/procedure_variants/trauma_and_orthopaedics/procedure_variants_trauma_and_orthopaedics.json";
import procedureVariantsGeneralSurgery from "../../data/procedure_variants/general_surgery/procedure_variants_general_surgery.json";
import procedureVariantsUrology from "../../data/procedure_variants/urology/procedure_variants_urology.json";
import procedureVariantsGynaecology from "../../data/procedure_variants/gynaecology/procedure_variants_gynaecology.json";
import procedureVariantsNeurosurgery from "../../data/procedure_variants/neurosurgery/procedure_variants_neurosurgery.json";
import procedureVariantsCardiothoracic from "../../data/procedure_variants/cardiothoracic/procedure_variants_cardiothoracic.json";
import procedureVariantsVascular from "../../data/procedure_variants/vascular/procedure_variants_vascular.json";
import procedureVariantsOtolaryngology from "../../data/procedure_variants/otolaryngology/procedure_variants_otolaryngology.json";
import procedureVariantsOmfs from "../../data/procedure_variants/oral_and_maxillofacial/procedure_variants_oral_and_maxillofacial.json";
import procedureVariantsPlastics from "../../data/procedure_variants/plastic_and_reconstructive/procedure_variants_plastic_and_reconstructive.json";
import procedureVariantsAnaesthesia from "../../data/procedure_variants/anaesthesia/procedure_variants_anaesthesia.json";
import procedureVariantsObstetrics from "../../data/procedure_variants/obstetrics/procedure_variants_obstetrics.json";
import procedureVariantsOphthalmology from "../../data/procedure_variants/opthalmology/procedure_variants_opthalmology.json";
import procedureVariantsPaediatric from "../../data/procedure_variants/paediatric/procedure_variants_paediatric.json";
import procedureVariantsPodiatric from "../../data/procedure_variants/podiatric/procedure_variants_podiatric.json";
import procedureVariantsDental from "../../data/procedure_variants/dental_and_oral/procedure_variants_dental_and_oral.json";
import procedureVariantSystemMap from "../../data/systems/procedure_variant_system_map.json";
import systemsData from "../../data/systems/systems.json";
import suppliersData from "../../data/suppliers/suppliers.json";
import traumaAndOrthopaedicsLiveMapping from "../../data/systems/trauma_and_orthopaedics_full_live_mapping.json";

export type ProcedureVariant = {
  id: string;
  procedure_id: string;
  setting?: string;
  specialty_id?: string;
  service_line_id?: string;
  anatomy_id?: string;
  name: string;
  variant_type?: string;
  variant_value?: string;
  approach?: string;
  description?: string;
  sort_order?: number;
  status?: string;
};

export type ProcedureVariantSystemMapRow = {
  id: string;
  procedure_variant_id: string;
  system_id: string;
  is_default?: boolean;
  status?: string;
};

export type System = {
  id: string;
  name: string;
  supplier_id?: string;
  specialty_id?: string;
  service_line_ids?: string[];
  anatomy_ids?: string[];
  system_type?: string;
  category?: string;
  aliases?: string[];
  description?: string;
  status?: string;
};

export type Supplier = {
  id: string;
  name: string;
  aliases?: string[];
  status?: string;
};

export type SystemWithSupplier = System & {
  supplier?: Supplier | null;
  is_default?: boolean;
};

export type VariantWithSystems = ProcedureVariant & {
  systems: SystemWithSupplier[];
};

type HipMappingSystem = {
  system_id: string;
  system_name: string;
  supplier_name: string;
  supplier_tier: string;
  fixation_class: string;
  procedure_class: string;
  mapping_status: string;
  active_status: string;
  notes: string;
  approach_compatibility: string[];
};

type HipMappingVariant = {
  variant_id: string;
  variant_name: string;
  systems: HipMappingSystem[];
};

type HipMappingProcedure = {
  procedure_id: string;
  procedure_name: string;
  variants: HipMappingVariant[];
};

type HipMappingSubanatomy = {
  name: string;
  procedures: HipMappingProcedure[];
};

type BranchMappingFile = {
  specialty: string;
  subspecialty: string;
  service_line_id?: string;
  anatomy: string;
  anatomy_id?: string;
  subanatomy_groups: HipMappingSubanatomy[];
};

const procedureVariants: ProcedureVariant[] = [
  ...((procedureVariantsTraumaAndOrthopaedics as ProcedureVariant[]) || []),
  ...((procedureVariantsGeneralSurgery as ProcedureVariant[]) || []),
  ...((procedureVariantsUrology as ProcedureVariant[]) || []),
  ...((procedureVariantsGynaecology as ProcedureVariant[]) || []),
  ...((procedureVariantsNeurosurgery as ProcedureVariant[]) || []),
  ...((procedureVariantsCardiothoracic as ProcedureVariant[]) || []),
  ...((procedureVariantsVascular as ProcedureVariant[]) || []),
  ...((procedureVariantsOtolaryngology as ProcedureVariant[]) || []),
  ...((procedureVariantsOmfs as ProcedureVariant[]) || []),
  ...((procedureVariantsPlastics as ProcedureVariant[]) || []),
  ...((procedureVariantsAnaesthesia as ProcedureVariant[]) || []),
  ...((procedureVariantsObstetrics as ProcedureVariant[]) || []),
  ...((procedureVariantsOphthalmology as ProcedureVariant[]) || []),
  ...((procedureVariantsPaediatric as ProcedureVariant[]) || []),
  ...((procedureVariantsPodiatric as ProcedureVariant[]) || []),
  ...((procedureVariantsDental as ProcedureVariant[]) || []),
];

const variantSystemMap: ProcedureVariantSystemMapRow[] =
  ((procedureVariantSystemMap as ProcedureVariantSystemMapRow[]) || []).filter(
    (row) => row.status !== "inactive",
  );

const systems: System[] = ((systemsData as System[]) || []).filter(
  (system) => system.status !== "inactive",
);

const suppliers: Supplier[] = ((suppliersData as Supplier[]) || []).filter(
  (supplier) => supplier.status !== "inactive",
);

const procedureVariantById = new Map<string, ProcedureVariant>(
  procedureVariants.map((variant) => [variant.id, variant]),
);

const systemById = new Map<string, System>(
  systems.map((system) => [system.id, system]),
);

const supplierById = new Map<string, Supplier>(
  suppliers.map((supplier) => [supplier.id, supplier]),
);

const branchMappings = traumaAndOrthopaedicsLiveMapping as BranchMappingFile[];

const branchMappingVariantById = new Map<string, HipMappingVariant>();
const branchMappingProcedureById = new Map<string, HipMappingProcedure>();
const branchMappingSystemById = new Map<string, HipMappingSystem>();
const branchMetadataByVariantId = new Map<string, { service_line_id: string; anatomy_id: string }>();

for (const branchMapping of branchMappings) {
  for (const subanatomy of branchMapping.subanatomy_groups || []) {
    for (const procedure of subanatomy.procedures || []) {
      branchMappingProcedureById.set(procedure.procedure_id, procedure);
      for (const variant of procedure.variants || []) {
        branchMappingVariantById.set(variant.variant_id, variant);
        branchMetadataByVariantId.set(variant.variant_id, {
          service_line_id: branchMapping.service_line_id ?? "SL_ARTHROPLASTY",
          anatomy_id: branchMapping.anatomy_id ?? "",
        });
        for (const system of variant.systems || []) {
          if (!branchMappingSystemById.has(system.system_id)) {
            branchMappingSystemById.set(system.system_id, system);
          }
        }
      }
    }
  }
}

const supplementalBranchVariants: ProcedureVariant[] = Array.from(
  branchMappingProcedureById.values(),
).flatMap((procedure) =>
  procedure.variants
    .filter((variant) => !procedureVariantById.has(variant.variant_id))
    .map((variant, index) => ({
      id: variant.variant_id,
      procedure_id: procedure.procedure_id,
      setting: "operating_theatre",
      specialty_id: "SPEC_TRAUMA_ORTHOPAEDICS",
      service_line_id: branchMetadataByVariantId.get(variant.variant_id)?.service_line_id ?? "SL_ARTHROPLASTY",
      anatomy_id: branchMetadataByVariantId.get(variant.variant_id)?.anatomy_id ?? "",
      name: variant.variant_name,
      variant_type: "approach",
      variant_value: variant.variant_name,
      description: `${procedure.procedure_name} via ${variant.variant_name.toLowerCase()}.`,
      sort_order: 100 + index,
      status: "active",
    })),
);

for (const variant of supplementalBranchVariants) {
  procedureVariants.push(variant);
  procedureVariantById.set(variant.id, variant);
}

function sortByOrderThenName<T extends { sort_order?: number; name?: string }>(
  a: T,
  b: T,
): number {
  const aOrder = a.sort_order ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.sort_order ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) return aOrder - bOrder;

  return (a.name || "").localeCompare(b.name || "");
}

function normalizeKey(value?: string): string {
  return (value || "").trim().toLowerCase();
}

function dedupeSystemsByName(
  systemsList: SystemWithSupplier[],
): SystemWithSupplier[] {
  const grouped = new Map<string, SystemWithSupplier[]>();

  for (const system of systemsList) {
    const key = normalizeKey(system.name);
    const list = grouped.get(key) ?? [];
    list.push(system);
    grouped.set(key, list);
  }

  const deduped = Array.from(grouped.values()).map((candidates) => {
    const preferredRich = candidates.find(
      (system) =>
        Boolean(system.specialty_id) ||
        (system.service_line_ids?.length ?? 0) > 0 ||
        (system.anatomy_ids?.length ?? 0) > 0,
    );
    const preferredDefault = candidates.find((system) => system.is_default);
    return preferredRich ?? preferredDefault ?? candidates[0];
  });

  return deduped.sort((a, b) => {
    if ((a.is_default ?? false) !== (b.is_default ?? false)) {
      return a.is_default ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

function createSyntheticSupplier(name: string): Supplier {
  return {
    id: `SUP_${name.toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "")}`,
    name,
    aliases: [],
    status: "active",
  };
}

function getBranchMappedSystemsWithSuppliers(variantId: string): SystemWithSupplier[] {
  const variant = branchMappingVariantById.get(variantId);
  if (!variant) return [];

  return variant.systems.map((mappedSystem) => {
    const existing = systemById.get(mappedSystem.system_id);
    const supplier =
      existing?.supplier_id
        ? supplierById.get(existing.supplier_id) ?? null
        : createSyntheticSupplier(mappedSystem.supplier_name);

    return {
      id: mappedSystem.system_id,
      name: mappedSystem.system_name,
      supplier_id: existing?.supplier_id,
      specialty_id: existing?.specialty_id ?? "SPEC_TRAUMA_ORTHOPAEDICS",
      service_line_ids: existing?.service_line_ids ?? [branchMetadataByVariantId.get(variantId)?.service_line_id ?? "SL_ARTHROPLASTY"],
      anatomy_ids: existing?.anatomy_ids ?? [branchMetadataByVariantId.get(variantId)?.anatomy_id ?? ""],
      system_type: existing?.system_type ?? "implant",
      category: existing?.category ?? mappedSystem.procedure_class.replaceAll("_", " "),
      aliases: existing?.aliases ?? [],
      description: existing?.description ?? mappedSystem.notes,
      status: existing?.status ?? "active",
      supplier,
      is_default: mappedSystem.mapping_status === "confirmed" && variant.systems.findIndex((item) => item.system_id === mappedSystem.system_id) === 0,
      mapping_status: mappedSystem.mapping_status,
      supplier_tier: mappedSystem.supplier_tier,
      fixation_class: mappedSystem.fixation_class,
      procedure_class: mappedSystem.procedure_class,
      active_status: mappedSystem.active_status,
      review_notes: mappedSystem.notes,
      approach_compatibility: mappedSystem.approach_compatibility,
    } as SystemWithSupplier;
  });
}

export function getAllProcedureVariants(): ProcedureVariant[] {
  return [...procedureVariants].sort(sortByOrderThenName);
}

export function getProcedureVariantById(
  variantId: string,
): ProcedureVariant | null {
  return procedureVariantById.get(variantId) ?? null;
}

export function getVariantsByProcedure(procedureId: string): ProcedureVariant[] {
  return procedureVariants
    .filter(
      (variant) =>
        variant.procedure_id === procedureId && variant.status !== "inactive",
    )
    .sort(sortByOrderThenName);
}

export function getActiveVariantSystemMapByVariant(
  variantId: string,
): ProcedureVariantSystemMapRow[] {
  return variantSystemMap.filter(
    (row) =>
      row.procedure_variant_id === variantId && row.status !== "inactive",
  );
}

export function getSystemsByVariant(variantId: string): System[] {
  const branchMappedSystems = getBranchMappedSystemsWithSuppliers(variantId);
  if (branchMappedSystems.length > 0) {
    return dedupeSystemsByName(branchMappedSystems).sort((a, b) => a.name.localeCompare(b.name));
  }

  const linkedSystemIds = getActiveVariantSystemMapByVariant(variantId).map(
    (row) => row.system_id,
  );

  const uniqueSystemIds = [...new Set(linkedSystemIds)];

  return uniqueSystemIds
    .map((systemId) => systemById.get(systemId))
    .filter((system): system is System => Boolean(system))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getSystemsWithSuppliers(
  variantId: string,
): SystemWithSupplier[] {
  const branchMappedSystems = getBranchMappedSystemsWithSuppliers(variantId);
  if (branchMappedSystems.length > 0) {
    return dedupeSystemsByName(branchMappedSystems);
  }

  const rows = getActiveVariantSystemMapByVariant(variantId);

  const mapped = rows
    .map((row) => {
      const system = systemById.get(row.system_id);
      if (!system) return null;

      const result: SystemWithSupplier = {
        ...system,
        supplier: system.supplier_id
          ? supplierById.get(system.supplier_id) ?? null
          : null,
        is_default: row.is_default ?? false,
      };
      return result;
    })
    .filter((item): item is SystemWithSupplier => item !== null);

  return dedupeSystemsByName(mapped);
}

export function getVariantsForProcedureWithSystems(
  procedureId: string,
): VariantWithSystems[] {
  const variants = getVariantsByProcedure(procedureId);
  const grouped = new Map<string, ProcedureVariant[]>();

  for (const variant of variants) {
    const key = normalizeKey(variant.name);
    const list = grouped.get(key) ?? [];
    list.push(variant);
    grouped.set(key, list);
  }

  const merged = Array.from(grouped.values()).map((group) => {
    const representative = [...group].sort(sortByOrderThenName)[0];
    const systems = dedupeSystemsByName(
      group.flatMap((variant) => getSystemsWithSuppliers(variant.id)),
    );

    const descriptions = group
      .map((variant) => variant.description)
      .filter((value): value is string => Boolean(value && value.trim()))
      .sort((a, b) => b.length - a.length);

    return {
      ...representative,
      description: descriptions[0] ?? representative.description,
      systems,
    };
  });

  return merged.sort(sortByOrderThenName);
}

const GENERIC_SYNTHETIC_VARIANTS = new Set([
  "flexible scope",
  "rigid scope",
  "holmium laser",
  "thulium laser",
  "open approach",
  "laparoscopic approach",
  "robotic approach",
]);

function looksSyntheticVariant(variant: VariantWithSystems): boolean {
  const name = normalizeKey(variant.name);
  const description = normalizeKey(variant.description);
  return (
    GENERIC_SYNTHETIC_VARIANTS.has(name) &&
    (!!description && description.endsWith("variant"))
  );
}

export function hasOnlySyntheticBranching(
  procedureId: string,
  procedureName: string,
): boolean {
  const variants = getVariantsForProcedureWithSystems(procedureId);
  if (variants.length === 0) return false;
  const allSynthetic = variants.every(looksSyntheticVariant);
  if (!allSynthetic) return false;

  const text = normalizeKey(procedureName);
  return !/(hip|knee|shoulder|elbow|ankle|arthroplasty|replacement|revision|fusion|fixation)/.test(
    text,
  );
}

export function getCuratedVariantsForProcedureWithSystems(
  procedureId: string,
  procedureName: string,
): VariantWithSystems[] {
  const variants = getVariantsForProcedureWithSystems(procedureId);
  if (variants.length === 0) return variants;

  const allSynthetic = variants.every(looksSyntheticVariant);
  if (!allSynthetic) return variants;

  const text = normalizeKey(procedureName);

  if (
    /(circumcision|vasectomy|frenuloplasty|orchidopexy|orchidectomy|hydrocele)/.test(
      text,
    )
  ) {
    return variants.filter((variant) => normalizeKey(variant.name) === "open approach");
  }

  if (
    /(transurethral|cystoscopy|ureteroscopy|ureterorenoscopy|pcnl|nephrolithotomy|lithotripsy|endoscopic|bladder|prostate|stone)/.test(
      text,
    )
  ) {
    const allowed = variants.filter((variant) =>
      ["flexible scope", "rigid scope", "holmium laser", "thulium laser"].includes(
        normalizeKey(variant.name),
      ),
    );

    if (/holmium/.test(text)) {
      return allowed.filter((variant) =>
        ["flexible scope", "rigid scope", "holmium laser"].includes(
          normalizeKey(variant.name),
        ),
      );
    }

    if (/thulium/.test(text)) {
      return allowed.filter((variant) =>
        ["flexible scope", "rigid scope", "thulium laser"].includes(
          normalizeKey(variant.name),
        ),
      );
    }

    return allowed.length > 0 ? allowed : variants;
  }

  if (
    /(laparoscopic|robotic|colectomy|gastrectomy|nephrectomy|prostatectomy|hysterectomy|hernia)/.test(
      text,
    )
  ) {
    const allowed = variants.filter((variant) =>
      ["open approach", "laparoscopic approach", "robotic approach"].includes(
        normalizeKey(variant.name),
      ),
    );
    return allowed.length > 0 ? allowed : variants;
  }

  return variants;
}

export function hasVariantsForProcedure(procedureId: string): boolean {
  return procedureVariants.some(
    (variant) =>
      variant.procedure_id === procedureId && variant.status !== "inactive",
  );
}

export function hasSystemsForVariant(variantId: string): boolean {
  return variantSystemMap.some(
    (row) =>
      row.procedure_variant_id === variantId && row.status !== "inactive",
  );
}

export function getDefaultSystemForVariant(
  variantId: string,
): SystemWithSupplier | null {
  return (
    getSystemsWithSuppliers(variantId).find((system) => system.is_default) ??
    null
  );
}

export function getProcedureVariantsBySetting(
  setting: string,
): ProcedureVariant[] {
  return procedureVariants
    .filter(
      (variant) =>
        variant.setting === setting && variant.status !== "inactive",
    )
    .sort(sortByOrderThenName);
}

export function getProcedureVariantsBySpecialty(
  specialtyId: string,
): ProcedureVariant[] {
  return procedureVariants
    .filter(
      (variant) =>
        variant.specialty_id === specialtyId && variant.status !== "inactive",
    )
    .sort(sortByOrderThenName);
}

export function getProcedureVariantsByServiceLine(
  serviceLineId: string,
): ProcedureVariant[] {
  return procedureVariants
    .filter(
      (variant) =>
        variant.service_line_id === serviceLineId &&
        variant.status !== "inactive",
    )
    .sort(sortByOrderThenName);
}

export function getProcedureVariantsByAnatomy(
  anatomyId: string,
): ProcedureVariant[] {
  return procedureVariants
    .filter(
      (variant) =>
        variant.anatomy_id === anatomyId && variant.status !== "inactive",
    )
    .sort(sortByOrderThenName);
}

export function getSystemById(systemId: string): System | null {
  const existing = systemById.get(systemId);
  if (existing) return existing;

  const branchMapped = branchMappingSystemById.get(systemId);
  if (!branchMapped) return null;

  return {
    id: branchMapped.system_id,
    name: branchMapped.system_name,
    specialty_id: "SPEC_TRAUMA_ORTHOPAEDICS",
    service_line_ids: ["SL_ARTHROPLASTY"],
    anatomy_ids: [],
    system_type: "implant",
    category: branchMapped.procedure_class.replaceAll("_", " "),
    aliases: [],
    description: branchMapped.notes,
    status: "active",
  };
}
