# PrepSight Schema Proposal

## Purpose

This proposal separates PrepSight into four connected domains:

1. Clinical taxonomy
2. Product taxonomy
3. Mapping layer
4. Site configuration

The goal is to prevent clinical workflow structure and implant catalogue structure from collapsing into one nested tree.

## Migration Strategy

### Phase 1: Stabilise Current Clinical Tree

Keep current app navigation intact:

`specialty -> subspecialty -> anatomy -> procedure -> variant -> card`

Normalise:

- duplicate anatomy and subanatomy
- procedure vs variant errors
- subspecialty ownership
- missing anatomy links
- joint/system mismatches

### Phase 2: Introduce Separate Product Domain

Create a parallel master-data model for:

- supplier
- brand/platform
- system
- component family
- component
- SKU
- tray
- instrument

Then migrate current procedure-to-system links into explicit mapping tables.

### Phase 3: Add Site Configuration

After master data is stable, add:

- organisation
- hospital
- theatre
- enabled procedures
- enabled systems
- stocked SKUs
- available trays
- defaults

This keeps local stock reality separate from global catalogue structure.

## Clinical Domain

### `specialty`

- `id`
- `name`
- `slug`
- `description`
- `is_active`
- `sort_order`

### `subspecialty`

- `id`
- `specialty_id`
- `name`
- `slug`
- `description`
- `is_active`
- `sort_order`

### `anatomy`

- `id`
- `subspecialty_id`
- `name`
- `slug`
- `description`
- `is_active`
- `sort_order`

### `subanatomy_group`

This is a grouping/header layer, not a route.

- `id`
- `anatomy_id`
- `name`
- `slug`
- `description`
- `is_active`
- `sort_order`

### `procedure`

- `id`
- `subspecialty_id`
- `anatomy_id`
- `subanatomy_group_id`
- `name`
- `slug`
- `description`
- `clinical_summary`
- `is_active`
- `sort_order`

### `procedure_alias`

- `id`
- `procedure_id`
- `alias`
- `alias_type`

### `procedure_variant`

- `id`
- `procedure_id`
- `name`
- `variant_type`
- `variant_value`
- `description`
- `is_active`
- `sort_order`

Example `variant_type` values:

- `approach`
- `fixation`
- `stage`
- `implant_configuration`
- `indication_pattern`
- `technology_assist`

### `procedure_card`

- `id`
- `procedure_id`
- `variant_id` nullable
- `title`
- `summary`
- `status`
- `version`
- `is_default`

### `procedure_card_section`

- `id`
- `card_id`
- `section_key`
- `title`
- `body`
- `sort_order`

## Product Domain

### `supplier`

- `id`
- `name`
- `slug`
- `country`
- `website`
- `is_active`

### `brand_platform`

Useful when one supplier has multiple branded platforms.

- `id`
- `supplier_id`
- `name`
- `slug`
- `description`
- `is_active`

### `system`

Clinical-commercial implant system level.

- `id`
- `supplier_id`
- `brand_platform_id` nullable
- `name`
- `slug`
- `category`
- `joint_region`
- `description`
- `is_active`

Examples:

- `Accolade II / Trident II`
- `Persona Knee System`
- `Equinoxe Shoulder System`

### `component_family`

Groups parts within a system.

- `id`
- `system_id`
- `name`
- `slug`
- `family_type`
- `description`
- `sort_order`

Examples:

- `acetabular shell`
- `liner`
- `femoral stem`
- `femoral head`
- `tibial baseplate`
- `glenosphere`

### `component`

- `id`
- `component_family_id`
- `name`
- `slug`
- `component_type`
- `material` nullable
- `fixation_type` nullable
- `side` nullable
- `description`
- `is_active`
- `sort_order`

### `sku`

Orderable item level.

- `id`
- `component_id`
- `sku_code`
- `manufacturer_ref`
- `size_label` nullable
- `size_numeric` nullable
- `offset` nullable
- `length` nullable
- `diameter` nullable
- `laterality` nullable
- `material` nullable
- `sterile_pack` nullable
- `status`
- `description`

### `tray`

- `id`
- `system_id` nullable
- `supplier_id` nullable
- `name`
- `slug`
- `tray_code`
- `tray_role`
- `description`
- `is_active`

Example `tray_role` values:

- `primary`
- `femoral`
- `acetabular`
- `trial`
- `revision`
- `instruments`
- `ancillary`

### `instrument`

- `id`
- `tray_id`
- `name`
- `instrument_code` nullable
- `instrument_type`
- `description`
- `is_active`
- `sort_order`

## Mapping Domain

### `procedure_variant_to_system`

- `id`
- `procedure_id`
- `variant_id` nullable
- `system_id`
- `is_default`
- `compatibility_type`
- `notes`

Example `compatibility_type` values:

- `compatible`
- `preferred`
- `legacy`
- `restricted`

### `system_to_component_family`

Optional if family ownership is always implicit by foreign key.

- `id`
- `system_id`
- `component_family_id`
- `sort_order`

### `component_to_sku`

Optional if SKU ownership is always implicit by foreign key.

- `id`
- `component_id`
- `sku_id`
- `is_default`

### `system_to_tray`

- `id`
- `system_id`
- `tray_id`
- `requirement_type`
- `notes`

Example `requirement_type` values:

- `required`
- `optional`
- `revision_only`
- `approach_specific`

### `tray_to_instrument`

- `id`
- `tray_id`
- `instrument_id`
- `quantity`
- `is_optional`
- `notes`
- `sort_order`

### `procedure_variant_to_card`

- `id`
- `procedure_id`
- `variant_id` nullable
- `card_id`
- `is_default`

## Site Domain

### `organisation`

- `id`
- `name`
- `slug`
- `country`
- `is_active`

### `hospital`

- `id`
- `organisation_id`
- `name`
- `slug`
- `site_code` nullable
- `is_active`

### `theatre`

- `id`
- `hospital_id`
- `name`
- `slug`
- `theatre_type` nullable
- `is_active`

### `site_enabled_procedure`

- `id`
- `hospital_id`
- `procedure_id`
- `variant_id` nullable
- `status`
- `notes`

### `site_enabled_system`

- `id`
- `hospital_id`
- `system_id`
- `status`
- `notes`

### `site_stocked_sku`

- `id`
- `hospital_id`
- `sku_id`
- `stock_status`
- `par_level` nullable
- `notes`

### `site_available_tray`

- `id`
- `hospital_id`
- `tray_id`
- `availability_status`
- `notes`

### `site_default_mapping`

Lets a hospital set preferred defaults.

- `id`
- `hospital_id`
- `procedure_id`
- `variant_id` nullable
- `default_system_id` nullable
- `default_card_id` nullable
- `notes`

## Rules Codex Should Enforce

### Clinical Rules

- A procedure belongs to one primary subspecialty.
- A procedure belongs to one anatomy.
- A procedure may belong to one subanatomy group.
- A variant must never duplicate a procedure name.
- Approaches should usually live in `procedure_variant`, not `procedure`.

### Product Rules

- A system belongs to one supplier.
- A SKU belongs to one component.
- A tray may be linked to one or more systems via mapping.
- Instruments should not be attached directly to procedures.

### Mapping Rules

- A procedure variant can map to many systems.
- A system can map to many procedures and variants.
- A tray can be required by many systems.
- A hospital can enable only a subset of global systems, SKUs, and trays.

## Migration Path From Current Repo Data

### Step A: Freeze Current Identifiers

Keep existing source IDs during migration:

- procedure IDs
- variant IDs
- system IDs

These remain source identifiers and migration anchors.

### Step B: Normalise Clinical Domain First

Create canonical:

- subspecialty
- anatomy
- subanatomy group
- procedure
- procedure_variant

Map current records into this cleaned model.

### Step C: Move Current Linked Systems Into `procedure_variant_to_system`

Instead of treating systems as nested under variants in app logic, populate:

- `procedure_id`
- `variant_id`
- `system_id`
- `compatibility_type`

### Step D: Build Product Master Data From Current Systems

Split current system records into:

- supplier
- system
- component families
- trays later

Do not wait for full SKU completeness before creating this layer.

### Step E: Add Site Layer After Master Data Is Stable

Keep hospital-specific decisions out of the master catalogue until the catalogue is clean.

## Worked Example: Hip Arthroplasty

### Clinical

- Specialty: `Trauma and Orthopaedics`
- Subspecialty: `Arthroplasty`
- Anatomy: `Hip`
- Subanatomy group: `Whole Joint`
- Procedure: `Primary Total Hip Replacement`
- Variant: `Posterior Approach`
- Card: `Primary Total Hip Replacement - Posterior`

### Product

- Supplier: `Stryker`
- Brand/platform: `Accolade II / Trident II`
- System: `Accolade II / Trident II Total Hip System`
- Component families:
  - `Acetabular Shell`
  - `Acetabular Liner`
  - `Femoral Stem`
  - `Femoral Head`

### Mapping

- `procedure_variant_to_system`
  - procedure: `Primary Total Hip Replacement`
  - variant: `Posterior Approach`
  - system: `Accolade II / Trident II`
  - compatibility: `preferred`

- `system_to_tray`
  - `Acetabular Tray`
  - `Femoral Tray`
  - `Trial Tray`

### Site

Example local configuration:

- Hospital A enables `Primary Total Hip Replacement`
- Hospital A enables `Posterior Approach`
- Hospital A enables `Accolade II / Trident II`
- Hospital A stocks only selected head sizes and liners
- Hospital A has acetabular tray and femoral tray available

## Immediate Recommendation

The next concrete artifact after this file should be:

1. a normalized clinical registry for current Trauma and Orthopaedics data
2. a first-pass product registry extracted from current systems
3. a migration map from current `procedure -> variant -> system` links into mapping tables
