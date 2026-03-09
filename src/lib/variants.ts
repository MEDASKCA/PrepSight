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

export type ProcedureVariant = {
  id: string;
  procedure_id: string;
  setting?: string;
  specialty_id?: string;
  service_line_id?: string;
  anatomy_id?: string;
  name: string;
  variant_type?: string;
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

function sortByOrderThenName<T extends { sort_order?: number; name?: string }>(
  a: T,
  b: T,
): number {
  const aOrder = a.sort_order ?? Number.MAX_SAFE_INTEGER;
  const bOrder = b.sort_order ?? Number.MAX_SAFE_INTEGER;

  if (aOrder !== bOrder) return aOrder - bOrder;

  return (a.name || "").localeCompare(b.name || "");
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

  return mapped.sort((a, b) => {
      if ((a.is_default ?? false) !== (b.is_default ?? false)) {
        return a.is_default ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
}

export function getVariantsForProcedureWithSystems(
  procedureId: string,
): VariantWithSystems[] {
  return getVariantsByProcedure(procedureId).map((variant) => ({
    ...variant,
    systems: getSystemsWithSuppliers(variant.id),
  }));
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
  return systemById.get(systemId) ?? null;
}
