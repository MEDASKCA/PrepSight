# Trauma and Orthopaedics Full Tree

Specialty: Trauma and Orthopaedic Surgery

## Counts
- Service Lines: 13
- Anatomy Nodes: 129
- Procedures: 597
- Variants: 227
- Systems: 424

## Subspecialty: Arthroplasty (SL_ARTHROPLASTY)

### Anatomy: Hip (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HIP)
- Subanatomy: Acetabulum, Whole Joint, Femoral Head, Femoral Neck, Proximal Femur
#### Procedure: Hip Resurfacing (PROC_HIP_RESURFACING)
- Description: Bone-conserving arthroplasty of the hip.
- Variant: Posterior Approach (PV_HIP_RESURFACING_POSTERIOR)
  Description: Hip resurfacing performed through a posterior approach.
  Systems: Birmingham Hip Resurfacing, Conserve Plus
- Variant: Direct Lateral Approach (PV_HIP_RESURFACING_LATERAL)
  Description: Hip resurfacing performed through a direct lateral approach.
  Systems: Birmingham Hip Resurfacing, Conserve Plus

#### Procedure: Primary Total Hip Replacement (PROC_PRIMARY_TOTAL_HIP_REPLACEMENT)
- Description: Primary replacement of the hip joint with prosthetic components.
- Aliases: Total Hip Replacement, Total Hip Arthroplasty, THR, THA
- Variant: Posterior Approach (PV_PRIMARY_THR_POSTERIOR)
  Description: Primary total hip replacement performed through a posterior approach.
  Systems: Exeter / Trident, Corail / Pinnacle, Polar / R3, Taperloc / G7, ACTIS / Pinnacle, Accolade II / Trident II, C-stem AMT / Pinnacle, CPT / Trident, Continuum / Taperloc
- Variant: Anterior Approach (PV_PRIMARY_THR_ANTERIOR)
  Description: Primary total hip replacement performed through an anterior approach.
  Systems: Corail / Pinnacle, Polar / R3, Taperloc / G7, ACTIS / Pinnacle, Accolade II / Trident II, Continuum / Taperloc
- Variant: Direct Lateral Approach (PV_PRIMARY_THR_LATERAL)
  Description: Primary total hip replacement performed through a direct lateral approach.
  Systems: Corail / Pinnacle, Exeter / Trident, Polar / R3, Taperloc / G7, ACTIS / Pinnacle, Accolade II / Trident II, C-stem AMT / Pinnacle, CPT / Trident, Continuum / Taperloc

#### Procedure: Revision Total Hip Replacement (PROC_REVISION_TOTAL_HIP_REPLACEMENT)
- Description: Revision of a previous total hip replacement.
- Aliases: Revision THR
- Variant: Posterior Approach (PV_REVISION_THR_POSTERIOR)
  Description: Revision total hip replacement performed through a posterior approach.
  Systems: Exeter / Trident, Corail / Pinnacle, Exeter Revision Stem, Restoration Modular, ARCOS Modular
- Variant: Extended Trochanteric Osteotomy Approach (PV_REVISION_THR_ETO)
  Description: Revision total hip replacement using an extended trochanteric osteotomy approach for femoral exposure.
  Systems: Exeter Revision Stem, Restoration Modular, ARCOS Modular

#### Procedure: Two-Stage Revision Total Hip Replacement (PROC_TWO_STAGE_REVISION_TOTAL_HIP_REPLACEMENT)
- Description: Staged revision total hip replacement, commonly for prosthetic joint infection.
- Variant: Stage One Explant and Spacer (PV_TWO_STAGE_REVISION_THR_STAGE_ONE)
  Description: First stage revision total hip replacement with explantation and spacer insertion.
  Systems: Exeter Revision Stem, Restoration Modular, ARCOS Modular
- Variant: Stage Two Reimplantation (PV_TWO_STAGE_REVISION_THR_STAGE_TWO)
  Description: Second stage revision total hip replacement with definitive reimplantation.
  Systems: Exeter Revision Stem, Restoration Modular, ARCOS Modular


### Anatomy: Knee (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_KNEE)
- Subanatomy: Patella, Whole Joint, Distal Femur, Proximal Tibia, Patellofemoral Joint, Medial Compartment, Lateral Compartment
#### Procedure: Primary Total Knee Replacement (PROC_PRIMARY_TOTAL_KNEE_REPLACEMENT)
- Description: Primary replacement of the knee joint with prosthetic components.
- Aliases: Total Knee Replacement, Total Knee Arthroplasty, TKR, TKA
- Variant: Medial Parapatellar Approach (PV_PRIMARY_TKR_MEDIAL_PARAPATELLAR)
  Description: Primary total knee replacement via a medial parapatellar approach.
  Systems: Attune Knee System, Triathlon Knee System, Persona Knee System, NexGen Knee System, LEGION Total Knee System
- Variant: Subvastus Approach (PV_PRIMARY_TKR_SUBVASTUS)
  Description: Primary total knee replacement via a subvastus approach.
  Systems: Attune Knee System, Triathlon Knee System, Persona Knee System, NexGen Knee System, LEGION Total Knee System
- Variant: Midvastus Approach (PV_PRIMARY_TKR_MIDVASTUS)
  Description: Primary total knee replacement via a midvastus approach.
  Systems: Attune Knee System, Triathlon Knee System, Persona Knee System, NexGen Knee System, LEGION Total Knee System

#### Procedure: Revision Total Knee Replacement (PROC_REVISION_TOTAL_KNEE_REPLACEMENT)
- Description: Revision of a previous total knee replacement.
- Aliases: Revision TKR
- Variant: Two-Component Revision (PV_REVISION_TKR_TWO_COMPONENT)
  Description: Revision total knee replacement using revision of both femoral and tibial components.
  Systems: TC3 Revision Knee System, Triathlon TS, Vanguard 360 Revision, LEGION Revision Knee
- Variant: Constrained / Hinged Revision (PV_REVISION_TKR_CONSTRAINED_HINGE)
  Description: Revision total knee replacement using a constrained condylar or hinged construct.
  Systems: Triathlon TS, Vanguard 360 Revision, LEGION Revision Knee

#### Procedure: Unicompartmental Knee Replacement (PROC_UNICOMPARTMENTAL_KNEE_REPLACEMENT)
- Description: Replacement of a single compartment of the knee.
- Aliases: Partial Knee Replacement
- Variant: Medial Fixed-Bearing (PV_UKR_MEDIAL_FIXED)
  Description: Unicompartmental knee replacement using a medial fixed-bearing construct.
  Systems: Journey Uni, Vanguard M / Microplasty
- Variant: Medial Mobile-Bearing (PV_UKR_MEDIAL_MOBILE)
  Description: Unicompartmental knee replacement using a medial mobile-bearing construct.
  Systems: Oxford Unicompartmental
- Variant: Lateral Unicompartmental (PV_UKR_LATERAL)
  Description: Unicompartmental knee replacement of the lateral compartment.
  Systems: Oxford Unicompartmental


### Anatomy: Shoulder (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_SHOULDER)
- Subanatomy: Whole Joint, Glenoid, Humeral Head, Proximal Humerus
#### Procedure: Hemiarthroplasty of Shoulder (PROC_HEMIARTHROPLASTY_OF_SHOULDER)
- Description: Partial replacement of the shoulder joint.
- Variant: Fracture Hemiarthroplasty (PV_SHOULDER_HEMI_FRACTURE)
  Description: Shoulder hemiarthroplasty performed for proximal humeral fracture.
  Systems: Global FX Fracture System, Ascend Flex
- Variant: Elective Hemiarthroplasty (PV_SHOULDER_HEMI_ELECTIVE)
  Description: Shoulder hemiarthroplasty performed electively for glenohumeral pathology.
  Systems: Global Advantage / Delta XTEND, Ascend Flex

#### Procedure: Primary Total Shoulder Replacement (PROC_PRIMARY_TOTAL_SHOULDER_REPLACEMENT)
- Description: Primary replacement of the glenohumeral joint.
- Variant: Stemmed Anatomic Shoulder Replacement (PV_PRIMARY_TSR_STEMMED)
  Description: Primary total shoulder replacement using a stemmed anatomic implant.
  Systems: Global Advantage / Delta XTEND, Ascend Flex, Equinoxe Shoulder System, Comprehensive Shoulder
- Variant: Stemless Anatomic Shoulder Replacement (PV_PRIMARY_TSR_STEMLESS)
  Description: Primary total shoulder replacement using a stemless anatomic implant.
  Systems: Eclipse Stemless Shoulder, Sidus Stem-Free Shoulder

#### Procedure: Reverse Total Shoulder Replacement (PROC_REVERSE_TOTAL_SHOULDER_REPLACEMENT)
- Description: Reverse geometry shoulder replacement.
- Variant: Cemented (VAR_CEMENTED)
  Description: Cemented construct option
  Systems: Avenir Complete / G7 Total Hip System, Arcos / G7 Revision Hip System, Persona Knee System, Oxford Partial Knee System, Comprehensive Shoulder System, Comprehensive Reverse Shoulder System
- Variant: Cementless (VAR_CEMENTLESS)
  Description: Cementless construct option
  Systems: Insignia / Trident II Total Hip System, Restoration / Trident Revision Hip System, Triathlon Knee System, Partial Knee Portfolio, Tornier Aequalis Shoulder System, Tornier Perform Reversed / Aequalis Reversed
- Variant: Deltopectoral Approach (PV_RTSA_DELTOPECTORAL)
  Description: Reverse total shoulder replacement via a deltopectoral approach.
  Systems: Delta XTEND Reverse Shoulder, Ascend Flex, Equinoxe Shoulder System, Comprehensive Shoulder
- Variant: Superolateral Approach (PV_RTSA_SUPEROLATERAL)
  Description: Reverse total shoulder replacement via a superolateral approach.
  Systems: Delta XTEND Reverse Shoulder, Ascend Flex, Equinoxe Shoulder System, Comprehensive Shoulder


### Anatomy: Elbow (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_ELBOW)
- Subanatomy: Whole Joint, Distal Humerus, Proximal Ulna, Radial Head
#### Procedure: Primary Total Elbow Replacement (PROC_PRIMARY_TOTAL_ELBOW_REPLACEMENT)
- Description: Primary total elbow arthroplasty.
- Variant: Linked Total Elbow Replacement (PV_PRIMARY_TER_LINKED)
  Description: Primary total elbow replacement using a linked prosthesis.
  Systems: Coonrad-Morrey Total Elbow
- Variant: Unlinked Total Elbow Replacement (PV_PRIMARY_TER_UNLINKED)
  Description: Primary total elbow replacement using an unlinked prosthesis.
  Systems: Latitude EV Total Elbow


### Anatomy: Ankle (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_ANKLE)
- Subanatomy: Whole Joint, Distal Tibia, Talus, Tibial Plafond, Tibiotalar Joint, Whole Joint, Distal Fibula, Syndesmosis
#### Procedure: Primary Total Ankle Replacement (PROC_PRIMARY_TOTAL_ANKLE_REPLACEMENT)
- Description: Primary total ankle arthroplasty.
- Variant: Fixed-Bearing Total Ankle Replacement (PV_PRIMARY_TAR_FIXED)
  Description: Primary total ankle replacement using a fixed-bearing construct.
  Systems: INFINITY Total Ankle, Vantage Total Ankle, SALTO Talaris
- Variant: Mobile-Bearing Total Ankle Replacement (PV_PRIMARY_TAR_MOBILE)
  Description: Primary total ankle replacement using a mobile-bearing construct.
  Systems: STAR Total Ankle, Zenith Total Ankle


### Anatomy: Wrist (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_WRIST)
- Subanatomy: Whole Joint, Distal Radius, Radiocarpal Joint, Carpal Bones
- Procedures: none linked

### Anatomy: Hand (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HAND)
- Subanatomy: Digits, Thumb CMC Joint, Metacarpophalangeal (MCP) Joints, Proximal Interphalangeal (PIP) Joints, Distal Interphalangeal (DIP) Joints
- Procedures: none linked

### Anatomy: Foot (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FOOT)
- Subanatomy: Hindfoot, Midfoot, Forefoot, First Metatarsophalangeal (MTP) Joint, Lesser Metatarsophalangeal Joints, Interphalangeal Joints, Subtalar Joint, Midfoot Joints
- Procedures: none linked

### Anatomy: Acetabulum (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_ACETABULUM)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Acetabular Revision of Hip Replacement (PROC_ACETABULAR_REVISION_OF_HIP_REPLACEMENT)
- Description: Revision of the acetabular component of a hip replacement.
- Variant: Isolated Cup Revision (PV_ACETABULAR_REVISION_ISOLATED_CUP)
  Description: Acetabular revision focused on isolated cup/component revision.
  Systems: Pinnacle / Sector Augments, Continuum / Taperloc
- Variant: Cup-Cage Reconstruction (PV_ACETABULAR_REVISION_CUP_CAGE)
  Description: Acetabular revision using cup-cage reconstruction for major bone loss.
  Systems: Pinnacle / Sector Augments, Continuum / Taperloc


### Anatomy: Ankle (ANAT_ANKLE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Total Ankle Arthroplasty with Patient Specific Instrumentation (PROC_TOTAL_ANKLE_ARTHROPLASTY_WITH_PATIENT_SPECIFIC_INSTRUMENTATION)
- Description: Primary total ankle replacement using PSI.
- Variants: none linked


### Anatomy: Elbow (ANAT_ELBOW)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Distal Humeral Hemiarthroplasty (PROC_DISTAL_HUMERAL_HEMIARTHROPLASTY)
- Description: Partial elbow arthroplasty of distal humerus.
- Variants: none linked

#### Procedure: Radial Head Arthroplasty (PROC_RADIAL_HEAD_ARTHROPLASTY)
- Description: Replacement arthroplasty of radial head.
- Variants: none linked

#### Procedure: Revision Radial Head Arthroplasty (PROC_REVISION_RADIAL_HEAD_ARTHROPLASTY)
- Description: Revision radial head replacement.
- Variants: none linked

#### Procedure: Revision Total Elbow Replacement (PROC_REVISION_TOTAL_ELBOW_REPLACEMENT)
- Description: Revision total elbow arthroplasty.
- Variants: none linked


### Anatomy: Femur (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FEMUR)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Femoral Revision of Hip Replacement (PROC_FEMORAL_REVISION_OF_HIP_REPLACEMENT)
- Description: Revision of the femoral component of a hip replacement.
- Variant: Cemented Stem Revision (PV_FEMORAL_REVISION_CEMENTED)
  Description: Femoral revision using a cemented revision stem construct.
  Systems: Exeter Revision Stem
- Variant: Tapered Fluted Stem Revision (PV_FEMORAL_REVISION_TAPERED_FLUTED)
  Description: Femoral revision using a tapered fluted revision stem.
  Systems: Restoration Modular, ARCOS Modular


### Anatomy: Hip (ANAT_HIP)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Bipolar Hemiarthroplasty of Hip (PROC_BIPOLAR_HEMIARTHROPLASTY_OF_HIP)
- Description: Bipolar hemiarthroplasty of the hip for fracture.
- Aliases: Bipolar Hemiarthroplasty
- Variants: none linked

#### Procedure: Cemented Total Hip Replacement (PROC_CEMENTED_TOTAL_HIP_REPLACEMENT)
- Description: Fully cemented total hip arthroplasty.
- Variants: none linked

#### Procedure: Cementless Total Hip Replacement (PROC_CEMENTLESS_TOTAL_HIP_REPLACEMENT)
- Description: Uncemented total hip arthroplasty.
- Variants: none linked

#### Procedure: Ceramic-on-Ceramic Total Hip Replacement (PROC_CERAMIC_ON_CERAMIC_TOTAL_HIP_REPLACEMENT)
- Description: THR using ceramic articulation.
- Variants: none linked

#### Procedure: Constrained Liner Revision of Hip Arthroplasty (PROC_CONSTRAINED_LINER_REVISION_OF_HIP_ARTHROPLASTY)
- Description: Revision hip procedure using constrained acetabular liner.
- Variants: none linked

#### Procedure: Conversion of Hip Hemiarthroplasty to Total Hip Replacement (PROC_CONVERSION_OF_HIP_HEMIARTHROPLASTY_TO_TOTAL_HIP_REPLACEMENT)
- Description: Conversion of prior hemiarthroplasty to total hip replacement.
- Variants: none linked

#### Procedure: Direct Anterior Total Hip Replacement (PROC_DIRECT_ANTERIOR_TOTAL_HIP_REPLACEMENT)
- Description: Primary THR via direct anterior approach.
- Variants: none linked

#### Procedure: Dual Mobility Revision Hip Arthroplasty (PROC_DUAL_MOBILITY_REVISION_HIP_ARTHROPLASTY)
- Description: Revision THR using dual-mobility construct.
- Variants: none linked

#### Procedure: Femoral Head Exchange in Total Hip Replacement (PROC_FEMORAL_HEAD_EXCHANGE_IN_TOTAL_HIP_REPLACEMENT)
- Description: Exchange of femoral head component in THR revision.
- Variants: none linked

#### Procedure: Femoral Osteochondroplasty of Hip (PROC_FEMORAL_OSTEOCHONDROPLASTY_OF_HIP)
- Description: Arthroscopic femoral osteochondroplasty.
- Variants: none linked

#### Procedure: Femoral Stem Revision of Hip Arthroplasty (PROC_FEMORAL_STEM_REVISION_OF_HIP_ARTHROPLASTY)
- Description: Isolated femoral stem revision procedure.
- Variants: none linked

#### Procedure: Hip Arthroscopy for Femoroacetabular Impingement (PROC_HIP_ARTHROSCOPY_FOR_FEMOROACETABULAR_IMPINGEMENT)
- Description: Arthroscopic cam/pincer impingement treatment.
- Variants: none linked

#### Procedure: Hip Capsular Reconstruction (PROC_HIP_CAPSULAR_RECONSTRUCTION)
- Description: Capsular reconstruction for instability or revision arthroscopy.
- Variants: none linked

#### Procedure: Hybrid Total Hip Replacement (PROC_HYBRID_TOTAL_HIP_REPLACEMENT)
- Description: Hybrid fixation total hip arthroplasty.
- Variants: none linked

#### Procedure: Impaction Bone Grafting in Revision Hip Arthroplasty (PROC_IMPACTION_BONE_GRAFTING_IN_REVISION_HIP_ARTHROPLASTY)
- Description: Revision hip arthroplasty with bone graft impaction.
- Variants: none linked

#### Procedure: Isolated Acetabular Liner Exchange (PROC_ISOLATED_ACETABULAR_LINER_EXCHANGE)
- Description: Exchange of acetabular liner during revision hip surgery.
- Variants: none linked

#### Procedure: Labral Repair of Hip (PROC_LABRAL_REPAIR_OF_HIP)
- Description: Arthroscopic repair of acetabular labrum.
- Variants: none linked

#### Procedure: Periprosthetic Fracture Fixation Around Total Hip Replacement (PROC_PERIPROSTHETIC_FRACTURE_FIXATION_AROUND_TOTAL_HIP_REPLACEMENT)
- Description: Fixation of femoral fracture around a THR.
- Variants: none linked

#### Procedure: Posterior Approach Total Hip Replacement (PROC_POSTERIOR_APPROACH_TOTAL_HIP_REPLACEMENT)
- Description: Primary THR via posterior approach.
- Variants: none linked

#### Procedure: Resection Arthroplasty of Hip (PROC_RESECTION_ARTHROPLASTY_OF_HIP)
- Description: Excision arthroplasty / Girdlestone-type procedure.
- Aliases: Girdlestone Procedure
- Variants: none linked

#### Procedure: Robotic-Assisted Total Hip Replacement (PROC_ROBOTIC_ASSISTED_TOTAL_HIP_REPLACEMENT)
- Description: Primary THR with robotic or navigation-assisted workflow.
- Variants: none linked

#### Procedure: Surgical Hip Dislocation with Osteochondroplasty (PROC_SURGICAL_HIP_DISLOCATION_WITH_OSTEOCHONDROPLASTY)
- Description: Open joint-preserving hip procedure.
- Variants: none linked

#### Procedure: Total Hip Replacement with Dual Mobility Construct (PROC_TOTAL_HIP_REPLACEMENT_WITH_DUAL_MOBILITY_CONSTRUCT)
- Description: Primary THR using dual-mobility articulation.
- Variants: none linked

#### Procedure: Trochanteric Fixation in Revision Hip Arthroplasty (PROC_TROCHANTERIC_FIXATION_IN_REVISION_HIP_ARTHROPLASTY)
- Description: Trochanteric claw/cable fixation in revision hip arthroplasty.
- Variants: none linked


### Anatomy: Knee (ANAT_KNEE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Cemented Total Knee Replacement (PROC_CEMENTED_TOTAL_KNEE_REPLACEMENT)
- Description: Cemented primary TKR.
- Variants: none linked

#### Procedure: Cementless Total Knee Replacement (PROC_CEMENTLESS_TOTAL_KNEE_REPLACEMENT)
- Description: Cementless primary TKR.
- Variants: none linked

#### Procedure: Constrained Condylar Knee Replacement (PROC_CONSTRAINED_CONDYLAR_KNEE_REPLACEMENT)
- Description: Constrained condylar total knee arthroplasty.
- Variants: none linked

#### Procedure: Distal Femoral Replacement (PROC_DISTAL_FEMORAL_REPLACEMENT)
- Description: Megaprosthetic reconstruction of distal femur around knee.
- Variants: none linked

#### Procedure: Extensor Mechanism Reconstruction After Knee Arthroplasty (PROC_EXTENSOR_MECHANISM_RECONSTRUCTION_AFTER_KNEE_ARTHROPLASTY)
- Description: Reconstruction of extensor mechanism after TKR.
- Variants: none linked

#### Procedure: Isolated Polyethylene Exchange of Total Knee Replacement (PROC_ISOLATED_POLYETHYLENE_EXCHANGE_OF_TOTAL_KNEE_REPLACEMENT)
- Description: Revision knee arthroplasty with isolated insert exchange.
- Variants: none linked

#### Procedure: Lateral Unicompartmental Knee Replacement (PROC_LATERAL_UNICOMPARTMENTAL_KNEE_REPLACEMENT)
- Description: Lateral compartment unicompartmental knee arthroplasty.
- Variants: none linked

#### Procedure: Medial Unicompartmental Knee Replacement (PROC_MEDIAL_UNICOMPARTMENTAL_KNEE_REPLACEMENT)
- Description: Medial compartment unicompartmental knee arthroplasty.
- Variants: none linked

#### Procedure: Oxford-Style Partial Knee Replacement (PROC_OXFORD_STYLE_PARTIAL_KNEE_REPLACEMENT)
- Description: Mobile-bearing partial knee replacement.
- Variants: none linked

#### Procedure: Patellar Resurfacing in Total Knee Replacement (PROC_PATELLAR_RESURFACING_IN_TOTAL_KNEE_REPLACEMENT)
- Description: Patellar resurfacing component use during TKR.
- Variants: none linked

#### Procedure: Patellofemoral Arthroplasty (PROC_PATELLOFEMORAL_ARTHROPLASTY)
- Description: Isolated patellofemoral arthroplasty.
- Variants: none linked

#### Procedure: Periprosthetic Fracture Fixation Around Total Knee Replacement (PROC_PERIPROSTHETIC_FRACTURE_FIXATION_AROUND_TOTAL_KNEE_REPLACEMENT)
- Description: Fixation of fracture around a TKR.
- Variants: none linked

#### Procedure: Primary Stemmed Total Knee Replacement (PROC_PRIMARY_STEMMED_TOTAL_KNEE_REPLACEMENT)
- Description: Primary TKR using stemmed components.
- Variants: none linked

#### Procedure: Proximal Tibial Replacement (PROC_PROXIMAL_TIBIAL_REPLACEMENT)
- Description: Megaprosthetic reconstruction of proximal tibia around knee.
- Variants: none linked

#### Procedure: Revision Rotating Platform Knee Arthroplasty (PROC_REVISION_ROTATING_PLATFORM_KNEE_ARTHROPLASTY)
- Description: Revision TKR using rotating-platform design.
- Variants: none linked

#### Procedure: Revision Sleeve and Cone Reconstruction of Knee (PROC_REVISION_SLEEVE_AND_CONE_RECONSTRUCTION_OF_KNEE)
- Description: Revision knee arthroplasty using sleeves/cones for bone loss.
- Variants: none linked

#### Procedure: Robotic-Assisted Total Knee Replacement (PROC_ROBOTIC_ASSISTED_TOTAL_KNEE_REPLACEMENT)
- Description: Primary total knee replacement with robotic assistance.
- Variants: none linked

#### Procedure: Robotic-Assisted Unicompartmental Knee Replacement (PROC_ROBOTIC_ASSISTED_UNICOMPARTMENTAL_KNEE_REPLACEMENT)
- Description: UKR with robotic assistance.
- Variants: none linked

#### Procedure: Rotating Hinge Total Knee Replacement (PROC_ROTATING_HINGE_TOTAL_KNEE_REPLACEMENT)
- Description: Constrained rotating-hinge knee arthroplasty.
- Variants: none linked


### Anatomy: Patella (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_PATELLA)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Patellofemoral Joint Replacement (PROC_PATELLOFEMORAL_JOINT_REPLACEMENT)
- Description: Replacement of the patellofemoral compartment of the knee.
- Variant: Isolated Patellofemoral Arthroplasty (PV_PFJR_ISOLATED)
  Description: Patellofemoral joint replacement performed as an isolated arthroplasty.
  Systems: Journey PFJ System
- Variant: Patellofemoral Arthroplasty with Realignment (PV_PFJR_WITH_REALIGNMENT)
  Description: Patellofemoral joint replacement combined with extensor mechanism realignment.
  Systems: Journey PFJ System


### Anatomy: Pelvis (ANAT_PELVIS)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Periacetabular Osteotomy (PROC_PERIACETABULAR_OSTEOTOMY)
- Description: Reorientation osteotomy for acetabular dysplasia.
- Variants: none linked


### Anatomy: Shoulder (ANAT_SHOULDER)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Anatomic Total Shoulder Arthroplasty (PROC_ANATOMIC_TOTAL_SHOULDER_ARTHROPLASTY)
- Description: Primary anatomic shoulder arthroplasty.
- Variants: none linked

#### Procedure: Augmented Glenoid Total Shoulder Arthroplasty (PROC_AUGMENTED_GLENOID_TOTAL_SHOULDER_ARTHROPLASTY)
- Description: Shoulder arthroplasty using augmented glenoid.
- Variants: none linked

#### Procedure: Convertible Shoulder Arthroplasty (PROC_CONVERTIBLE_SHOULDER_ARTHROPLASTY)
- Description: Shoulder arthroplasty platform convertible from anatomic to reverse.
- Variants: none linked

#### Procedure: Revision Glenoid Component of Shoulder Arthroplasty (PROC_REVISION_GLENOID_COMPONENT_OF_SHOULDER_ARTHROPLASTY)
- Description: Isolated revision of glenoid side of shoulder arthroplasty.
- Variants: none linked

#### Procedure: Revision Humeral Component of Shoulder Arthroplasty (PROC_REVISION_HUMERAL_COMPONENT_OF_SHOULDER_ARTHROPLASTY)
- Description: Isolated revision of humeral side of shoulder arthroplasty.
- Variants: none linked

#### Procedure: Revision Reverse Total Shoulder Replacement (PROC_REVISION_REVERSE_TOTAL_SHOULDER_REPLACEMENT)
- Description: Revision of reverse shoulder arthroplasty.
- Variants: none linked

#### Procedure: Revision Total Shoulder Replacement (PROC_REVISION_TOTAL_SHOULDER_REPLACEMENT)
- Description: Revision of an anatomic total shoulder replacement.
- Variants: none linked

#### Procedure: Shoulder Hemiarthroplasty for Fracture (PROC_SHOULDER_HEMIARTHROPLASTY_FOR_FRACTURE)
- Description: Hemiarthroplasty for proximal humerus fracture.
- Aliases: Fracture Shoulder Hemiarthroplasty
- Variants: none linked

#### Procedure: Stemless Total Shoulder Arthroplasty (PROC_STEMLESS_TOTAL_SHOULDER_ARTHROPLASTY)
- Description: Stemless anatomic shoulder arthroplasty.
- Variants: none linked


### Anatomy: Wrist (ANAT_WRIST)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Total Wrist Arthroplasty (PROC_TOTAL_WRIST_ARTHROPLASTY)
- Description: Total wrist joint replacement.
- Variants: none linked


## Subspecialty: Foot & Ankle (SL_FOOT_AND_ANKLE_SURGERY)

### Anatomy: Ankle (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_ANKLE)
- Subanatomy: Whole Joint, Distal Tibia, Talus, Tibial Plafond, Tibiotalar Joint, Whole Joint, Distal Fibula, Syndesmosis
#### Procedure: Ankle Fusion (PROC_ANKLE_FUSION)
- Description: Arthrodesis of the ankle joint.
- Aliases: Ankle Arthrodesis
- Variant: Open Ankle Fusion (PV_ANKLE_FUSION_OPEN)
  Description: Ankle fusion performed through an open approach.
  Systems: none linked
- Variant: Arthroscopic Ankle Fusion (PV_ANKLE_FUSION_ARTHROSCOPIC)
  Description: Ankle fusion performed arthroscopically.
  Systems: none linked

#### Procedure: Diagnostic Ankle Arthroscopy (PROC_DIAGNOSTIC_ANKLE_ARTHROSCOPY)
- Description: Diagnostic arthroscopy of the ankle.
- Variant: Anterior Arthroscopy (PV_DIAGNOSTIC_ANKLE_ANTERIOR)
  Description: Diagnostic ankle arthroscopy using anterior portals.
  Systems: none linked
- Variant: Posterior Arthroscopy (PV_DIAGNOSTIC_ANKLE_POSTERIOR)
  Description: Diagnostic ankle arthroscopy using posterior portals.
  Systems: none linked


### Anatomy: Digits (ANAT_DIGITS)
#### Procedure: Hallux Interphalangeal Joint Fusion (PROC_HALLUX_INTERPHALANGEAL_JOINT_FUSION)
- Description: Arthrodesis of hallux IP joint.
- Variants: none linked

#### Procedure: Second Toe PIP Fusion (PROC_SECOND_TOE_PIP_FUSION)
- Description: Fusion for hammertoe of second toe.
- Variants: none linked


### Anatomy: Foot (ANAT_FOOT)
#### Procedure: Achilles Tendon Reconstruction (PROC_ACHILLES_TENDON_RECONSTRUCTION)
- Description: Reconstruction of chronic Achilles rupture.
- Variants: none linked

#### Procedure: Cavovarus Foot Reconstruction (PROC_CAVOVARUS_FOOT_RECONSTRUCTION)
- Description: Reconstruction for cavovarus foot deformity.
- Variants: none linked

#### Procedure: Cotton Osteotomy (PROC_COTTON_OSTEOTOMY)
- Description: Medial cuneiform opening wedge osteotomy.
- Variants: none linked

#### Procedure: Flatfoot Reconstruction (PROC_FLATFOOT_RECONSTRUCTION)
- Description: Multiplanar reconstruction for adult-acquired flatfoot.
- Variants: none linked

#### Procedure: Flexor Hallucis Longus Transfer (PROC_FLEXOR_HALLUCIS_LONGUS_TRANSFER)
- Description: Tendon transfer commonly used in Achilles reconstruction.
- Variants: none linked

#### Procedure: Gastrocnemius Recession (PROC_GASTROCNEMIUS_RECESSION)
- Description: Lengthening of gastrocnemius aponeurosis.
- Variants: none linked

#### Procedure: Jones Fracture Fixation (PROC_JONES_FRACTURE_FIXATION)
- Description: Fixation of proximal fifth metatarsal fracture.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Talonavicular Fusion Nonunion (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_TALONAVICULAR_FUSION_NONUNION)
- Description: Revision fixation/fusion for talonavicular nonunion.
- Variants: none linked

#### Procedure: Peroneal Groove Deepening (PROC_PERONEAL_GROOVE_DEEPENING)
- Description: Surgical deepening for peroneal tendon instability.
- Variants: none linked

#### Procedure: Peroneal Retinaculum Repair (PROC_PERONEAL_RETINACULUM_REPAIR)
- Description: Repair of superior peroneal retinaculum.
- Variants: none linked

#### Procedure: Peroneal Tendon Repair (PROC_PERONEAL_TENDON_REPAIR)
- Description: Repair of torn peroneal tendon.
- Variants: none linked

#### Procedure: Peroneal Tendon Transfer (PROC_PERONEAL_TENDON_TRANSFER)
- Description: Tendon transfer for foot/ankle dysfunction.
- Variants: none linked

#### Procedure: Plantar Fascia Release (PROC_PLANTAR_FASCIA_RELEASE)
- Description: Operative release for recalcitrant plantar fasciitis.
- Variants: none linked

#### Procedure: Spring Ligament Reconstruction (PROC_SPRING_LIGAMENT_RECONSTRUCTION)
- Description: Reconstruction for flatfoot deformity.
- Variants: none linked


### Anatomy: Forefoot (ANAT_FOREFOOT)
#### Procedure: Akin Osteotomy (PROC_AKIN_OSTEOTOMY)
- Description: Proximal phalanx osteotomy for hallux valgus.
- Variants: none linked

#### Procedure: Bunionette Correction (PROC_BUNIONETTE_CORRECTION)
- Description: Correction of tailor's bunion deformity.
- Variants: none linked

#### Procedure: Cheilectomy of First MTP Joint (PROC_CHEILECTOMY_OF_FIRST_MTP_JOINT)
- Description: Dorsal osteophyte excision for hallux rigidus.
- Variants: none linked

#### Procedure: Chevron Osteotomy for Hallux Valgus (PROC_CHEVRON_OSTEOTOMY_FOR_HALLUX_VALGUS)
- Description: Distal metatarsal osteotomy for bunion correction.
- Variants: none linked

#### Procedure: First MTP Joint Arthroplasty (PROC_FIRST_MTP_JOINT_ARTHROPLASTY)
- Description: Implant arthroplasty of first MTP joint.
- Variants: none linked

#### Procedure: First Metatarsophalangeal Joint Fusion (PROC_FIRST_MTP_FUSION)
- Description: Arthrodesis of the first metatarsophalangeal joint.
- Aliases: First MTP Joint Fusion
- Variants: none linked

#### Procedure: First Ray Dorsiflexion Osteotomy (PROC_FIRST_RAY_DORSIFLEXION_OSTEOTOMY)
- Description: Corrective osteotomy of first metatarsal.
- Variants: none linked

#### Procedure: Forefoot Plantar Plate Reconstruction (PROC_FOREFOOT_PLANTAR_PLATE_RECONSTRUCTION)
- Description: Reconstruction of plantar plate insufficiency.
- Variants: none linked

#### Procedure: Jones Fracture Intramedullary Screw Fixation (PROC_JONES_FRACTURE_INTRAMEDULLARY_SCREW_FIXATION)
- Description: Intramedullary screw fixation for proximal fifth metatarsal fracture.
- Variants: none linked

#### Procedure: Lapidus Procedure (PROC_LAPIDUS_PROCEDURE)
- Description: First tarsometatarsal fusion for hallux valgus.
- Variants: none linked

#### Procedure: Lapiplasty-Style First TMT Fusion (PROC_LAPIPLASTY_STYLE_FIRST_TMT_FUSION)
- Description: Triplanar bunion correction with first TMT fusion.
- Variants: none linked

#### Procedure: Lesser Metatarsal Osteotomy (PROC_LESSER_METATARSAL_OSTEOTOMY)
- Description: Weil or shortening osteotomy of lesser metatarsals.
- Variants: none linked

#### Procedure: Lesser Toe Hammertoe Correction (PROC_LESSER_TOE_HAMMERTOE_CORRECTION)
- Description: PIP arthroplasty or fusion for hammertoe.
- Variants: none linked

#### Procedure: Metatarsal Head Resection Arthroplasty (PROC_METATARSAL_HEAD_RESECTION_ARTHROPLASTY)
- Description: Resection arthroplasty of lesser metatarsal heads.
- Variants: none linked

#### Procedure: Metatarsophalangeal Joint Capsulotomy (PROC_METATARSOPHALANGEAL_JOINT_CAPSULOTOMY)
- Description: Soft tissue release at lesser MTP joint.
- Variants: none linked

#### Procedure: Minimally Invasive Chevron-Akin Bunion Correction (PROC_MINIMALLY_INVASIVE_CHEVRON_AKIN_BUNION_CORRECTION)
- Description: Percutaneous hallux valgus correction.
- Variants: none linked

#### Procedure: Plantar Plate Repair (PROC_PLANTAR_PLATE_REPAIR)
- Description: Repair of plantar plate tear.
- Variants: none linked

#### Procedure: Revision Hallux Valgus Correction (PROC_REVISION_HALLUX_VALGUS_CORRECTION)
- Description: Revision surgery for recurrent hallux valgus.
- Variants: none linked

#### Procedure: Revision Lapidus Fusion (PROC_REVISION_LAPIDUS_FUSION)
- Description: Revision of first TMT fusion nonunion.
- Variants: none linked

#### Procedure: Scarf Osteotomy for Hallux Valgus (PROC_SCARF_OSTEOTOMY_FOR_HALLUX_VALGUS)
- Description: Shaft osteotomy bunion correction.
- Variants: none linked

#### Procedure: Sesamoidectomy of Foot (PROC_SESAMOIDECTOMY_OF_FOOT)
- Description: Excision of sesamoid bone.
- Variants: none linked

#### Procedure: Tailors Bunion Osteotomy (PROC_TAILORS_BUNION_OSTEOTOMY)
- Description: Osteotomy for bunionette correction.
- Variants: none linked

#### Procedure: Weil Osteotomy (PROC_WEIL_OSTEOTOMY)
- Description: Metatarsal shortening osteotomy for metatarsalgia.
- Variants: none linked


### Anatomy: Hindfoot (ANAT_HINDFOOT)
#### Procedure: Achilles Insertional Debridement and Repair (PROC_ACHILLES_INSERTIONAL_DEBRIDEMENT_AND_REPAIR)
- Description: Debridement/reattachment for insertional Achilles tendinopathy.
- Variants: none linked

#### Procedure: Calcaneal Osteotomy (PROC_CALCANEAL_OSTEOTOMY)
- Description: Corrective osteotomy of calcaneus.
- Variants: none linked

#### Procedure: Calcaneal Spur Excision (PROC_CALCANEAL_SPUR_EXCISION)
- Description: Excision of posterosuperior calcaneal prominence.
- Variants: none linked

#### Procedure: Calcaneonavicular Coalition Excision (PROC_CALCANEONAVICULAR_COALITION_EXCISION)
- Description: Excision of tarsal coalition.
- Variants: none linked

#### Procedure: Dwyer Osteotomy (PROC_DWYER_OSTEOTOMY)
- Description: Lateral closing wedge calcaneal osteotomy.
- Variants: none linked

#### Procedure: Evans Lateral Column Lengthening (PROC_EVANS_LATERAL_COLUMN_LENGTHENING)
- Description: Calcaneal lengthening osteotomy.
- Variants: none linked

#### Procedure: Flexor Hallucis Longus Transfer for Achilles (PROC_FLEXOR_HALLUCIS_LONGUS_TRANSFER_FOR_ACHILLES)
- Description: Tendon transfer to augment Achilles reconstruction.
- Variants: none linked

#### Procedure: Subtalar Arthroscopy (PROC_SUBTALAR_ARTHROSCOPY)
- Description: Arthroscopy of subtalar joint.
- Variants: none linked

#### Procedure: Tibiotalocalcaneal Fusion with Hindfoot Nail (PROC_TIBIOTALOCALCANEAL_FUSION_WITH_HINDFOOT_NAIL)
- Description: Fusion using hindfoot intramedullary nail.
- Aliases: TTC Fusion
- Variants: none linked


### Anatomy: Midfoot (ANAT_MIDFOOT)
#### Procedure: Calcaneocuboid Fusion (PROC_CALCANEOCUBOID_FUSION)
- Description: Fusion of calcaneocuboid joint.
- Variants: none linked

#### Procedure: Lapidus Revision Fusion (PROC_LAPIDUS_REVISION_FUSION)
- Description: Revision first TMT fusion procedure.
- Variants: none linked

#### Procedure: Lisfranc Arthrodesis (PROC_LISFRANC_ARTHRODESIS)
- Description: Arthrodesis of injured Lisfranc joints.
- Variants: none linked

#### Procedure: Midfoot Osteotomy for Cavus Deformity (PROC_MIDFOOT_OSTEOTOMY_FOR_CAVUS_DEFORMITY)
- Description: Corrective midfoot osteotomy in cavus foot.
- Variants: none linked

#### Procedure: Naviculocuneiform Fusion (PROC_NAVICULOCUNEIFORM_FUSION)
- Description: Fusion of naviculocuneiform joints.
- Variants: none linked

#### Procedure: Naviculocuneiform Reconstruction (PROC_NAVICULOCUNEIFORM_RECONSTRUCTION)
- Description: Reconstruction/fusion of naviculocuneiform joint complex.
- Variants: none linked

#### Procedure: Talonavicular Fusion (PROC_TALONAVICULAR_FUSION)
- Description: Fusion of talonavicular joint.
- Variants: none linked


### Anatomy: Digits / Toes (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_DIGITS_TOES)
- Subanatomy: Proximal Phalanx, Middle Phalanx, Distal Phalanx, Proximal Interphalangeal (PIP) Joint, Distal Interphalangeal (DIP) Joint
- Procedures: none linked

### Anatomy: Ankle (ANAT_ANKLE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Ankle Arthroscopic Fusion (PROC_ANKLE_ARTHROSCOPIC_FUSION)
- Description: Arthroscopic tibiotalar arthrodesis.
- Variants: none linked

#### Procedure: Ankle Arthroscopy with Debridement (PROC_ANKLE_ARTHROSCOPY_WITH_DEBRIDEMENT)
- Description: Debridement for impingement or synovitis.
- Variants: none linked

#### Procedure: Arthroscopic Brostrom Procedure (PROC_ARTHROSCOPIC_BROSTROM_PROCEDURE)
- Description: Arthroscopic-assisted lateral ligament repair.
- Variants: none linked

#### Procedure: Arthroscopic Lateral Ligament Reconstruction of Ankle (PROC_ARTHROSCOPIC_LATERAL_LIGAMENT_RECONSTRUCTION_OF_ANKLE)
- Description: Arthroscopic-assisted ankle instability reconstruction.
- Variants: none linked

#### Procedure: Arthroscopic Reduction of Ankle Fracture (PROC_ARTHROSCOPIC_REDUCTION_OF_ANKLE_FRACTURE)
- Description: Arthroscopy-assisted reduction/fixation of ankle fracture.
- Variants: none linked

#### Procedure: Brostrom Lateral Ligament Reconstruction (PROC_BROSTROM_LATERAL_LIGAMENT_RECONSTRUCTION)
- Description: Anatomic repair/reconstruction of lateral ankle ligaments.
- Variants: none linked

#### Procedure: Deltoid Ligament Reconstruction of Ankle (PROC_DELTOID_LIGAMENT_RECONSTRUCTION_OF_ANKLE)
- Description: Reconstruction of medial ankle ligament complex.
- Variants: none linked

#### Procedure: Lateral Process Talus Fixation (PROC_LATERAL_PROCESS_TALUS_FIXATION)
- Description: Fixation of lateral process talus fracture.
- Variants: none linked

#### Procedure: Microfracture of Talus (PROC_MICROFRACTURE_OF_TALUS)
- Description: Marrow stimulation for osteochondral lesion.
- Variants: none linked

#### Procedure: Osteochondral Lesion Repair of Talus (PROC_OSTEOCHONDRAL_LESION_REPAIR_OF_TALUS)
- Description: Treatment of talar dome osteochondral lesion.
- Aliases: OLT Repair
- Variants: none linked

#### Procedure: Posterior Malleolus Fixation (PROC_POSTERIOR_MALLEOLUS_FIXATION)
- Description: Fixation of posterior malleolar fracture fragment.
- Variants: none linked

#### Procedure: Primary Total Ankle Replacement (PROC_TOTAL_ANKLE_REPLACEMENT)
- Description: Primary total ankle arthroplasty.
- Aliases: TAR
- Variants: none linked

#### Procedure: Revision Total Ankle Replacement (PROC_REVISION_TOTAL_ANKLE_REPLACEMENT)
- Description: Revision ankle arthroplasty procedure.
- Variants: none linked

#### Procedure: Subfibular Impingement Decompression (PROC_SUBFIBULAR_IMPINGEMENT_DECOMPRESSION)
- Description: Decompression for subfibular impingement in valgus ankle.
- Variants: none linked

#### Procedure: Supramalleolar Osteotomy (PROC_SUPRAMALLEOLAR_OSTEOTOMY)
- Description: Realignment osteotomy for ankle arthritis/malunion.
- Variants: none linked

#### Procedure: Syndesmotic Tightrope Stabilisation (PROC_SYNDESMOTIC_TIGHTROPE_STABILISATION)
- Description: Suture-button stabilisation of syndesmosis.
- Variants: none linked


### Anatomy: Foot (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FOOT)
- Subanatomy: Hindfoot, Midfoot, Forefoot, First Metatarsophalangeal (MTP) Joint, Lesser Metatarsophalangeal Joints, Interphalangeal Joints, Subtalar Joint, Midfoot Joints
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Tibialis Posterior Tendon Reconstruction (PROC_TIBIALIS_POSTERIOR_TENDON_RECONSTRUCTION)
- Description: Reconstruction for tibialis posterior tendon dysfunction.
- Variant: FDL Transfer with Medialising Calcaneal Osteotomy (PV_TPT_RECON_FDL_CALCANEAL)
  Description: Tibialis posterior tendon reconstruction using FDL transfer with medialising calcaneal osteotomy.
  Systems: none linked
- Variant: Reconstruction with Spring Ligament Augmentation (PV_TPT_RECON_SPRING)
  Description: Tibialis posterior tendon reconstruction with spring ligament augmentation.
  Systems: none linked


### Anatomy: Forefoot (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FOREFOOT)
- Subanatomy: Metatarsals, Metatarsophalangeal (MTP) Joints, Sesamoids
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: First Metatarsophalangeal Joint Fusion (PROC_FIRST_METATARSOPHALANGEAL_JOINT_FUSION)
- Description: Arthrodesis of the first metatarsophalangeal joint.
- Aliases: First MTP Joint Fusion
- Variant: Dorsal Plate and Compression Screw (PV_FIRST_MTP_FUSION_PLATE)
  Description: First MTP fusion using a dorsal plate with compression screw.
  Systems: none linked
- Variant: Crossed Screw Fixation (PV_FIRST_MTP_FUSION_CROSSED)
  Description: First MTP fusion using crossed screw fixation.
  Systems: none linked

#### Procedure: Hallux Valgus Correction (PROC_HALLUX_VALGUS_CORRECTION)
- Description: Corrective surgery for hallux valgus deformity.
- Aliases: Bunion Correction
- Variant: Chevron Osteotomy (PV_HALLUX_VALGUS_CHEVRON)
  Description: Hallux valgus correction using a chevron osteotomy.
  Systems: none linked
- Variant: Scarf Osteotomy (PV_HALLUX_VALGUS_SCARF)
  Description: Hallux valgus correction using a scarf osteotomy.
  Systems: none linked
- Variant: Lapidus Procedure (PV_HALLUX_VALGUS_LAPIDUS)
  Description: Hallux valgus correction using a Lapidus-type first ray fusion procedure.
  Systems: none linked


### Anatomy: Hindfoot (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HINDFOOT)
- Subanatomy: Calcaneus, Talus, Subtalar Joint, Talocalcaneal Joint
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Achilles Tendon Repair (PROC_ACHILLES_TENDON_REPAIR)
- Description: Repair of ruptured Achilles tendon.
- Variant: Open Repair (PV_ACHILLES_OPEN)
  Description: Achilles tendon repair performed through an open approach.
  Systems: none linked
- Variant: Minimally Invasive Repair (PV_ACHILLES_MIN_INV)
  Description: Achilles tendon repair performed using a minimally invasive technique.
  Systems: none linked

#### Procedure: Subtalar Fusion (PROC_SUBTALAR_FUSION)
- Description: Arthrodesis of the subtalar joint.
- Aliases: Subtalar Arthrodesis
- Variant: Open Subtalar Fusion (PV_SUBTALAR_FUSION_OPEN)
  Description: Subtalar fusion performed through an open approach.
  Systems: none linked
- Variant: Arthroscopic-Assisted Subtalar Fusion (PV_SUBTALAR_FUSION_ARTHROSCOPIC)
  Description: Subtalar fusion performed with arthroscopic assistance.
  Systems: none linked

#### Procedure: Triple Fusion (PROC_TRIPLE_FUSION)
- Description: Arthrodesis of the subtalar, talonavicular, and calcaneocuboid joints.
- Aliases: Triple Arthrodesis
- Variant: Standard Triple Fusion (PV_TRIPLE_FUSION_STANDARD)
  Description: Triple fusion performed using a standard dual-incision approach.
  Systems: none linked
- Variant: Triple Fusion with Deformity Correction (PV_TRIPLE_FUSION_WITH_CORRECTION)
  Description: Triple fusion combined with adjunctive deformity correction.
  Systems: none linked


### Anatomy: Midfoot (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_MIDFOOT)
- Subanatomy: Navicular, Cuboid, Medial Cuneiform, Intermediate Cuneiform, Lateral Cuneiform, Tarsometatarsal (Lisfranc) Joint
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Midfoot Fusion (PROC_MIDFOOT_FUSION)
- Description: Arthrodesis of one or more midfoot joints.
- Aliases: Midfoot Arthrodesis
- Variant: Percutaneous (VAR_PERCUTANEOUS)
  Description: Percutaneous reconstruction option
  Systems: Ankle Fusion Portfolio, Ankle Arthroscopy Portfolio, INBONE / STAR Total Ankle Portfolio, Flatfoot Reconstruction Portfolio, Toe / MTP Fusion Portfolio, Bunion and Forefoot Portfolio, Achilles Repair Portfolio, Subtalar Fusion Portfolio, Hindfoot Fusion Portfolio, Midfoot Fusion Portfolio
- Variant: Tarsometatarsal Fusion (PV_MIDFOOT_FUSION_TMT)
  Description: Midfoot fusion focused on one or more tarsometatarsal joints.
  Systems: none linked
- Variant: Naviculocuneiform Fusion (PV_MIDFOOT_FUSION_NAVICULOCUNEIFORM)
  Description: Midfoot fusion focused on the naviculocuneiform joint complex.
  Systems: none linked


## Subspecialty: Hand & Wrist (SL_HAND_AND_WRIST_SURGERY)

### Anatomy: Forearm (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FOREARM)
- Procedures: none linked

### Anatomy: Digits (ANAT_DIGITS)
#### Procedure: DIP Joint Fusion (PROC_DIP_JOINT_FUSION)
- Description: Arthrodesis of distal interphalangeal joint.
- Variants: none linked

#### Procedure: Digital Artery Repair (PROC_DIGITAL_ARTERY_REPAIR)
- Description: Microsurgical digital artery repair.
- Variants: none linked

#### Procedure: MCP Joint Arthroplasty (PROC_MCP_JOINT_ARTHROPLASTY)
- Description: Metacarpophalangeal joint arthroplasty.
- Variants: none linked

#### Procedure: MCP Joint Fusion (PROC_MCP_JOINT_FUSION)
- Description: Arthrodesis of MCP joint.
- Variants: none linked

#### Procedure: PIP Joint Arthroplasty (PROC_PIP_JOINT_ARTHROPLASTY)
- Description: Proximal interphalangeal joint arthroplasty.
- Variants: none linked

#### Procedure: PIP Joint Fusion (PROC_PIP_JOINT_FUSION)
- Description: Arthrodesis of PIP joint.
- Variants: none linked

#### Procedure: Pulley Reconstruction of Finger (PROC_PULLEY_RECONSTRUCTION_OF_FINGER)
- Description: Flexor pulley reconstruction.
- Variants: none linked

#### Procedure: Ray Amputation of Finger (PROC_RAY_AMPUTATION_OF_FINGER)
- Description: Ray resection/amputation procedure.
- Variants: none linked

#### Procedure: Replantation of Finger (PROC_REPLANTATION_OF_FINGER)
- Description: Microsurgical replantation of amputated digit.
- Variants: none linked

#### Procedure: Revision Thumb Basal Joint Arthroplasty (PROC_REVISION_THUMB_BASAL_JOINT_ARTHROPLASTY)
- Description: Revision of prior CMC arthroplasty.
- Variants: none linked

#### Procedure: Revision Trigger Finger Release (PROC_REVISION_TRIGGER_FINGER_RELEASE)
- Description: Revision release for recurrent trigger finger.
- Variants: none linked

#### Procedure: Sagittal Band Reconstruction (PROC_SAGITTAL_BAND_RECONSTRUCTION)
- Description: Reconstruction for extensor tendon subluxation.
- Variants: none linked

#### Procedure: Silicone MCP Arthroplasty (PROC_SILICONE_MCP_ARTHROPLASTY)
- Description: Silicone arthroplasty of MCP joint.
- Variants: none linked

#### Procedure: Thumb CMC Suspensionplasty (PROC_THUMB_CMC_SUSPENSIONPLASTY)
- Description: Ligament reconstruction/interposition for basal thumb arthritis.
- Variants: none linked

#### Procedure: Thumb MCP Ulnar Collateral Ligament Reconstruction (PROC_THUMB_MCP_ULNAR_COLLATERAL_LIGAMENT_RECONSTRUCTION)
- Description: Reconstruction for chronic thumb MCP instability.
- Variants: none linked


### Anatomy: Hand (ANAT_HAND)
#### Procedure: CMC Joint Fusion of Thumb (PROC_CMC_JOINT_FUSION_OF_THUMB)
- Description: Arthrodesis of thumb carpometacarpal joint.
- Variants: none linked

#### Procedure: Digital Nerve Grafting (PROC_DIGITAL_NERVE_GRAFTING)
- Description: Nerve graft reconstruction of digital nerve defect.
- Variants: none linked

#### Procedure: Extensor Tendon Repair of Hand (PROC_EXTENSOR_TENDON_REPAIR)
- Description: Repair of extensor tendon injury in the hand.
- Variants: none linked

#### Procedure: First Dorsal Compartment Reconstruction (PROC_FIRST_DORSAL_COMPARTMENT_RECONSTRUCTION)
- Description: Reconstruction for chronic De Quervain or tendon instability.
- Variants: none linked

#### Procedure: First Web Space Deepening (PROC_FIRST_WEB_SPACE_DEEPENING)
- Description: Contracture release / deepening of thumb web space.
- Variants: none linked

#### Procedure: Flexor Tendon Repair of Hand (PROC_FLEXOR_TENDON_REPAIR)
- Description: Repair of flexor tendon injury in the hand.
- Variants: none linked

#### Procedure: Guyons Canal Release (PROC_GUYONS_CANAL_RELEASE)
- Description: Decompression of ulnar nerve at the wrist.
- Variants: none linked

#### Procedure: Metacarpophalangeal Joint Synovectomy (PROC_METACARPOPHALANGEAL_JOINT_SYNOVECTOMY)
- Description: Open synovectomy of MCP joints.
- Variants: none linked

#### Procedure: Needle Aponeurotomy for Dupuytren Disease (PROC_NEEDLE_APONEUROTOMY_FOR_DUPUYTREN_DISEASE)
- Description: Percutaneous fasciotomy for Dupuytren disease.
- Variants: none linked

#### Procedure: Nerve Repair of Hand (PROC_NERVE_REPAIR_OF_HAND)
- Description: Primary repair of digital or palmar nerve injury.
- Variants: none linked

#### Procedure: Palmar Fasciectomy for Dupuytren Disease (PROC_PALMAR_FASCIECTOMY_FOR_DUPUYTREN_DISEASE)
- Description: Regional fasciectomy for Dupuytren disease.
- Variants: none linked

#### Procedure: Revision Carpal Tunnel Release (PROC_REVISION_CARPAL_TUNNEL_RELEASE)
- Description: Revision decompression of median nerve.
- Variants: none linked

#### Procedure: Tendon Transfer for Radial Nerve Palsy (PROC_TENDON_TRANSFER_FOR_RADIAL_NERVE_PALSY)
- Description: Tendon transfers for radial nerve palsy.
- Variants: none linked

#### Procedure: Tendon Transfer for Ulnar Nerve Palsy (PROC_TENDON_TRANSFER_FOR_ULNAR_NERVE_PALSY)
- Description: Tendon transfers for ulnar nerve palsy.
- Variants: none linked

#### Procedure: Thenar Release and Opposition Transfer (PROC_THENAR_RELEASE_AND_OPPOSITION_TRANSFER)
- Description: Tendon transfer for median nerve palsy.
- Variants: none linked

#### Procedure: Thumb MCP Joint Fusion (PROC_THUMB_MCP_JOINT_FUSION)
- Description: Arthrodesis of thumb metacarpophalangeal joint.
- Variants: none linked

#### Procedure: Zone II Flexor Tendon Repair (PROC_ZONE_II_FLEXOR_TENDON_REPAIR)
- Description: Primary repair of flexor tendon in zone II.
- Variants: none linked

#### Procedure: Zone V Extensor Tendon Repair (PROC_ZONE_V_EXTENSOR_TENDON_REPAIR)
- Description: Primary extensor tendon repair in zone V.
- Variants: none linked


### Anatomy: Wrist (ANAT_WRIST)
#### Procedure: DRUJ Arthroplasty (PROC_DRUJ_ARTHROPLASTY)
- Description: Distal radioulnar joint arthroplasty.
- Variants: none linked

#### Procedure: Darrach Procedure (PROC_DARRACH_PROCEDURE)
- Description: Distal ulna resection procedure.
- Variants: none linked

#### Procedure: First Extensor Compartment Reconstruction (PROC_FIRST_EXTENSOR_COMPARTMENT_RECONSTRUCTION)
- Description: Reconstruction following failed De Quervain procedures.
- Variants: none linked

#### Procedure: Four-Corner Fusion (PROC_FOUR_CORNER_FUSION)
- Description: Partial wrist fusion after SNAC/SLAC wrist.
- Variants: none linked

#### Procedure: Ganglion Excision of Wrist (PROC_GANGLION_EXCISION_OF_WRIST)
- Description: Excision of dorsal or volar wrist ganglion.
- Variants: none linked

#### Procedure: Lunotriquetral Fusion (PROC_LUNOTRIQUETRAL_FUSION)
- Description: Partial wrist fusion of LT joint.
- Variants: none linked

#### Procedure: Lunotriquetral Ligament Reconstruction (PROC_LUNOTRIQUETRAL_LIGAMENT_RECONSTRUCTION)
- Description: Reconstruction for lunotriquetral instability.
- Variants: none linked

#### Procedure: Radial Styloidectomy (PROC_RADIAL_STYLOIDECTOMY)
- Description: Excision of radial styloid.
- Variants: none linked

#### Procedure: Revision Scapholunate Reconstruction (PROC_REVISION_SCAPHOLUNATE_RECONSTRUCTION)
- Description: Revision reconstruction for SL dissociation.
- Variants: none linked

#### Procedure: SLAC Wrist Proximal Row Carpectomy (PROC_SLAC_WRIST_PROXIMAL_ROW_CARPECTOMY)
- Description: PRC for scapholunate advanced collapse wrist.
- Variants: none linked

#### Procedure: SNAC Wrist Four-Corner Fusion (PROC_SNAC_WRIST_FOUR_CORNER_FUSION)
- Description: Four-corner fusion for scaphoid nonunion advanced collapse.
- Variants: none linked

#### Procedure: Sauve-Kapandji Procedure (PROC_SAUVE_KAPANDJI_PROCEDURE)
- Description: DRUJ salvage procedure with arthrodesis and pseudoarthrosis.
- Variants: none linked

#### Procedure: Scaphoid Excision and Four-Corner Fusion (PROC_SCAPHOID_EXCISION_AND_FOUR_CORNER_FUSION)
- Description: Salvage procedure for degenerative wrist collapse.
- Variants: none linked

#### Procedure: Scaphoid Excision with Capitolunate Fusion (PROC_SCAPHOID_EXCISION_WITH_CAPITOLUNATE_FUSION)
- Description: Partial wrist salvage fusion.
- Variants: none linked

#### Procedure: Scaphoid Nonunion Bone Grafting (PROC_SCAPHOID_NONUNION_BONE_GRAFTING)
- Description: Open reduction and bone grafting of scaphoid nonunion.
- Variants: none linked

#### Procedure: Scapholunate Ligament Reconstruction (PROC_SCAPHOLUNATE_LIGAMENT_RECONSTRUCTION)
- Description: Reconstruction for chronic scapholunate instability.
- Variants: none linked

#### Procedure: Scapholunate Ligament Repair (PROC_SCAPHOLUNATE_LIGAMENT_REPAIR)
- Description: Repair of scapholunate ligament injury.
- Variants: none linked

#### Procedure: TFCC Repair (PROC_TFCC_REPAIR)
- Description: Triangular fibrocartilage complex repair.
- Variants: none linked

#### Procedure: Total Wrist Denervation (PROC_TOTAL_WRIST_DENERVATION)
- Description: Denervation procedure for painful wrist arthritis.
- Variants: none linked

#### Procedure: Ulnar Shortening Osteotomy (PROC_ULNAR_SHORTENING_OSTEOTOMY)
- Description: Ulnar shortening for ulnocarpal impaction.
- Variants: none linked

#### Procedure: Vascularized Bone Grafting for Scaphoid Nonunion (PROC_VASCULARIZED_BONE_GRAFTING_FOR_SCAPHOID_NONUNION)
- Description: Vascularized grafting for scaphoid nonunion.
- Variants: none linked

#### Procedure: Wrist Arthroscopic Synovectomy (PROC_WRIST_ARTHROSCOPIC_SYNOVECTOMY)
- Description: Arthroscopic synovectomy of wrist.
- Variants: none linked

#### Procedure: Wrist Arthroscopic TFCC Debridement (PROC_WRIST_ARTHROSCOPIC_TFCC_DEBRIDEMENT)
- Description: Debridement of central TFCC tear.
- Variants: none linked

#### Procedure: Wrist Arthroscopy (PROC_WRIST_ARTHROSCOPY)
- Description: Diagnostic or therapeutic wrist arthroscopy.
- Variants: none linked


### Anatomy: Digits (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_DIGITS)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Thumb Basal Joint Arthroplasty (PROC_THUMB_BASAL_JOINT_ARTHROPLASTY)
- Description: Arthroplasty for thumb carpometacarpal joint arthritis.
- Aliases: Thumb CMC Arthroplasty
- Variant: Trapeziectomy with LRTI (PV_THUMB_BASAL_LRTI)
  Description: Thumb basal joint arthroplasty using trapeziectomy with ligament reconstruction and tendon interposition.
  Systems: none linked
- Variant: Trapeziectomy with Suspensionplasty (PV_THUMB_BASAL_SUSPENSION)
  Description: Thumb basal joint arthroplasty using trapeziectomy with suspensionplasty.
  Systems: none linked

#### Procedure: Trigger Finger Release (PROC_TRIGGER_FINGER_RELEASE)
- Description: Release of stenosing tenosynovitis of a finger or thumb.
- Variant: Open A1 Pulley Release (PV_TRIGGER_FINGER_OPEN)
  Description: Trigger finger release performed through an open A1 pulley release.
  Systems: none linked
- Variant: Percutaneous Release (PV_TRIGGER_FINGER_PERCUTANEOUS)
  Description: Trigger finger release performed percutaneously.
  Systems: none linked


### Anatomy: Hand (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HAND)
- Subanatomy: Digits, Thumb CMC Joint, Metacarpophalangeal (MCP) Joints, Proximal Interphalangeal (PIP) Joints, Distal Interphalangeal (DIP) Joints
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Dupuytren Fasciectomy (PROC_DUPUYTREN_FASCIECTOMY)
- Description: Excision of diseased palmar fascia for Dupuytren disease.
- Variant: Limited Fasciectomy (PV_DUPUYTREN_LIMITED)
  Description: Dupuytren surgery using a limited fasciectomy technique.
  Systems: none linked
- Variant: Dermofasciectomy (PV_DUPUYTREN_DERMOFASCIECTOMY)
  Description: Dupuytren surgery using dermofasciectomy with skin management.
  Systems: none linked

#### Procedure: Extensor Tendon Repair of Hand (PROC_EXTENSOR_TENDON_REPAIR_OF_HAND)
- Description: Repair of extensor tendon injury in the hand.
- Variant: Primary Direct Repair (PV_EXTENSOR_TENDON_PRIMARY)
  Description: Extensor tendon repair using direct primary repair.
  Systems: none linked
- Variant: Repair with Supplemental K-Wire Protection (PV_EXTENSOR_TENDON_WITH_PROTECTION)
  Description: Extensor tendon repair with supplemental K-wire protection where indicated.
  Systems: none linked

#### Procedure: Flexor Tendon Repair of Hand (PROC_FLEXOR_TENDON_REPAIR_OF_HAND)
- Description: Repair of flexor tendon injury in the hand.
- Variant: Four-Strand Core Repair (PV_FLEXOR_TENDON_4_STRAND)
  Description: Flexor tendon repair using a four-strand core suture configuration.
  Systems: none linked
- Variant: Six-Strand Core Repair (PV_FLEXOR_TENDON_6_STRAND)
  Description: Flexor tendon repair using a six-strand core suture configuration.
  Systems: none linked


### Anatomy: Wrist (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_WRIST)
- Subanatomy: Whole Joint, Distal Radius, Radiocarpal Joint, Carpal Bones
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Carpal Tunnel Release (PROC_CARPAL_TUNNEL_RELEASE)
- Description: Decompression of the median nerve at the carpal tunnel.
- Variant: Open Release (PV_CARPAL_TUNNEL_OPEN)
  Description: Carpal tunnel release performed through an open approach.
  Systems: none linked
- Variant: Endoscopic Release (PV_CARPAL_TUNNEL_ENDOSCOPIC)
  Description: Carpal tunnel release performed endoscopically.
  Systems: none linked

#### Procedure: De Quervain Release (PROC_DE_QUERVAIN_RELEASE)
- Description: Release of first dorsal compartment for De Quervain tenosynovitis.
- Variant: Open Release (PV_DE_QUERVAIN_OPEN)
  Description: De Quervain release performed through an open approach.
  Systems: none linked
- Variant: Endoscopic-Assisted Release (PV_DE_QUERVAIN_ENDOSCOPIC_ASSISTED)
  Description: De Quervain release performed with endoscopic assistance.
  Systems: none linked

#### Procedure: Proximal Row Carpectomy (PROC_PROXIMAL_ROW_CARPECTOMY)
- Description: Excision of proximal carpal row for wrist arthritis or collapse.
- Variant: Standard Proximal Row Carpectomy (PV_PRC_STANDARD)
  Description: Proximal row carpectomy performed as a standard excisional procedure.
  Systems: none linked
- Variant: Proximal Row Carpectomy with Capsular Interposition (PV_PRC_WITH_INTERPOSITION)
  Description: Proximal row carpectomy with capsular interposition.
  Systems: none linked

#### Procedure: Wrist Fusion (PROC_WRIST_FUSION)
- Description: Arthrodesis of the wrist joint.
- Aliases: Wrist Arthrodesis
- Variant: Total Wrist Fusion (PV_WRIST_FUSION_TOTAL)
  Description: Wrist fusion performed as a total wrist arthrodesis.
  Systems: none linked
- Variant: Partial Wrist Fusion (PV_WRIST_FUSION_PARTIAL)
  Description: Wrist fusion performed as a limited or partial arthrodesis.
  Systems: none linked


## Subspecialty: Hip Preservation (SL_HIP_PRESERVATION)

## Subspecialty: Limb Reconstruction / Deformity (SL_LIMB_RECONSTRUCTION_DEFORMITY)

## Subspecialty: Orthopaedic Infection (SL_ORTHOPAEDIC_INFECTION)

## Subspecialty: Orthopaedic Oncology (SL_ORTHOPAEDIC_ONCOLOGY)

### Anatomy: Bone (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_BONE)
#### Procedure: Endoprosthetic Reconstruction after Tumour Resection (PROC_ENDOPROSTHETIC_RECONSTRUCTION_AFTER_TUMOUR_RESECTION)
- Description: Reconstruction using an endoprosthesis after tumour resection.
- Variant: Modular Endoprosthetic Reconstruction (PV_ENDOPROSTHETIC_STANDARD)
  Description: Endoprosthetic reconstruction using a modular tumour prosthesis.
  Systems: GMRS Modular Endoprosthesis, MUTARS Endoprosthesis
- Variant: Expandable Endoprosthetic Reconstruction (PV_ENDOPROSTHETIC_EXPANDABLE)
  Description: Endoprosthetic reconstruction using an expandable prosthesis where indicated.
  Systems: GMRS Modular Endoprosthesis, MUTARS Endoprosthesis

#### Procedure: Excision of Bone Tumour (PROC_EXCISION_OF_BONE_TUMOUR)
- Description: Excision of primary or secondary bone tumour.
- Variant: Intralesional Curettage (PV_BONE_TUMOUR_CURETTAGE)
  Description: Excision of bone tumour using intralesional curettage.
  Systems: none linked
- Variant: Wide Resection (PV_BONE_TUMOUR_WIDE)
  Description: Excision of bone tumour using a wide resection.
  Systems: none linked

#### Procedure: Fixation for Metastatic Bone Disease (PROC_METASTATIC_BONE_DISEASE_FIXATION)
- Description: Stabilisation procedure for metastatic bone disease.
- Variant: Intramedullary Fixation (PV_MBD_IM)
  Description: Fixation for metastatic bone disease using intramedullary fixation.
  Systems: none linked
- Variant: Plate Fixation with Cement Augmentation (PV_MBD_PLATE_CEMENT)
  Description: Fixation for metastatic bone disease using plate fixation with cement augmentation.
  Systems: none linked

#### Procedure: Limb Salvage Resection and Reconstruction (PROC_LIMB_SALVAGE_RESECTION_AND_RECONSTRUCTION)
- Description: Limb salvage tumour resection with reconstruction.
- Variant: Biological Reconstruction (PV_LIMB_SALVAGE_BIOLOGICAL)
  Description: Limb salvage resection followed by biological reconstruction.
  Systems: none linked
- Variant: Endoprosthetic Reconstruction (PV_LIMB_SALVAGE_ENDOPROSTHETIC)
  Description: Limb salvage resection followed by endoprosthetic reconstruction.
  Systems: GMRS Modular Endoprosthesis, MUTARS Endoprosthesis


### Anatomy: Acetabulum (ANAT_ACETABULUM)
#### Procedure: Pathologic Acetabular Reconstruction (PROC_PATHOLOGIC_ACETABULAR_RECONSTRUCTION)
- Description: Reconstruction for metastatic or primary acetabular destruction.
- Variants: none linked


### Anatomy: Femur (ANAT_FEMUR)
#### Procedure: Distal Femoral Endoprosthetic Reconstruction (PROC_DISTAL_FEMORAL_ENDOPROSTHETIC_RECONSTRUCTION)
- Description: Megaprosthetic reconstruction of distal femur.
- Variants: none linked

#### Procedure: Distal Femoral Tumour Resection and Reconstruction (PROC_DISTAL_FEMORAL_TUMOUR_RESECTION_AND_RECONSTRUCTION)
- Description: Resection and reconstruction of distal femoral tumour.
- Variants: none linked

#### Procedure: Proximal Femoral Endoprosthetic Reconstruction (PROC_PROXIMAL_FEMORAL_ENDOPROSTHETIC_RECONSTRUCTION)
- Description: Megaprosthetic reconstruction of proximal femur.
- Variants: none linked

#### Procedure: Segmental Femoral Resection and Reconstruction (PROC_SEGMENTAL_FEMORAL_RESECTION_AND_RECONSTRUCTION)
- Description: Segmental resection with reconstruction for bone tumour.
- Variants: none linked


### Anatomy: Humerus (ANAT_HUMERUS)
#### Procedure: Proximal Humeral Endoprosthetic Reconstruction (PROC_PROXIMAL_HUMERAL_ENDOPROSTHETIC_RECONSTRUCTION)
- Description: Megaprosthetic reconstruction of proximal humerus.
- Variants: none linked

#### Procedure: Proximal Humeral Tumour Resection and Reconstruction (PROC_PROXIMAL_HUMERAL_TUMOUR_RESECTION_AND_RECONSTRUCTION)
- Description: Resection and reconstruction of proximal humeral tumour.
- Variants: none linked


### Anatomy: Pelvis (ANAT_PELVIS)
#### Procedure: Internal Hemipelvectomy (PROC_INTERNAL_HEMIPELVECTOMY)
- Description: Limb-sparing resection of pelvic tumour.
- Variants: none linked

#### Procedure: Pelvic Reconstruction with Custom Implant (PROC_PELVIC_RECONSTRUCTION_WITH_CUSTOM_IMPLANT)
- Description: Custom implant reconstruction after tumour resection.
- Variants: none linked

#### Procedure: Periacetabular Endoprosthetic Reconstruction (PROC_PERIACETABULAR_ENDOPROSTHETIC_RECONSTRUCTION)
- Description: Reconstruction after pelvic tumour resection.
- Variants: none linked


### Anatomy: Shoulder (ANAT_SHOULDER)
#### Procedure: Scapular Tumour Resection (PROC_SCAPULAR_TUMOUR_RESECTION)
- Description: Scapulectomy or partial scapular tumour resection.
- Variants: none linked


### Anatomy: Soft Tissue (ANAT_SOFT_TISSUE)
#### Procedure: Excision of Soft Tissue Tumour (PROC_EXCISION_SOFT_TISSUE_TUMOUR)
- Description: Excision of benign or malignant soft tissue tumour.
- Variant: Modular (VAR_MODULAR)
  Description: Modular reconstruction construct
  Systems: Oncology Endoprosthetic Portfolio, Oncology / Limb Salvage Portfolio, Pathologic Fracture / Oncology Stabilisation Portfolio, Limb Salvage / OSS Oncology Portfolio, Pelvic Oncology Reconstruction Portfolio, Soft Tissue Reconstruction Portfolio
- Variant: Custom (VAR_CUSTOM)
  Description: Custom reconstruction construct
  Systems: Oncology Endoprosthetic Portfolio, Oncology / Tumour Reconstruction Portfolio, Oncology Stabilisation Portfolio, GMRS / Oncology Reconstruction Portfolio, Pelvic Oncology Reconstruction Portfolio, UK Oncology Distribution Portfolio

#### Procedure: Wide Excision of Soft Tissue Sarcoma (PROC_WIDE_EXCISION_OF_SOFT_TISSUE_SARCOMA)
- Description: Wide resection of sarcoma with limb preservation.
- Variants: none linked


### Anatomy: Spine (ANAT_SPINE)
#### Procedure: Spinal Tumour Decompression and Stabilisation (PROC_SPINAL_TUMOUR_DECOMPRESSION_AND_STABILISATION)
- Description: Decompression and instrumented stabilisation for tumour.
- Variants: none linked


### Anatomy: Tibia (ANAT_TIBIA)
#### Procedure: Proximal Tibial Endoprosthetic Reconstruction (PROC_PROXIMAL_TIBIAL_ENDOPROSTHETIC_RECONSTRUCTION)
- Description: Megaprosthetic reconstruction of proximal tibia.
- Variants: none linked

#### Procedure: Proximal Tibial Tumour Resection and Reconstruction (PROC_PROXIMAL_TIBIAL_TUMOUR_RESECTION_AND_RECONSTRUCTION)
- Description: Resection and reconstruction of proximal tibial tumour.
- Variants: none linked


### Anatomy: Bone (ANAT_BONE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Allograft-Prosthetic Composite Reconstruction (PROC_ALLOGRAFT_PROSTHETIC_COMPOSITE_RECONSTRUCTION)
- Description: Composite reconstruction using allograft and prosthesis.
- Variants: none linked

#### Procedure: Amputation for Musculoskeletal Tumour (PROC_AMPUTATION_FOR_MUSCULOSKELETAL_TUMOUR)
- Description: Ablative surgery for unreconstructable tumour.
- Variants: none linked

#### Procedure: Cementoplasty of Bone Metastasis (PROC_CEMENTOPLASTY_OF_BONE_METASTASIS)
- Description: Percutaneous cement augmentation of metastatic lesion.
- Variants: none linked

#### Procedure: Curettage and Cementation of Giant Cell Tumour (PROC_CURETTAGE_AND_CEMENTATION_OF_GIANT_CELL_TUMOUR)
- Description: Intralesional curettage and PMMA augmentation for GCT.
- Variants: none linked

#### Procedure: Curettage of Benign Bone Tumour with Bone Grafting (PROC_CURETTAGE_OF_BENIGN_BONE_TUMOUR_WITH_BONE_GRAFTING)
- Description: Intralesional curettage and grafting.
- Variants: none linked

#### Procedure: Curettage of Benign Bone Tumour with Cement Augmentation (PROC_CURETTAGE_OF_BENIGN_BONE_TUMOUR_WITH_CEMENT_AUGMENTATION)
- Description: Intralesional curettage and cementation.
- Variants: none linked

#### Procedure: Excision of Bone Tumour (PROC_EXCISION_BONE_TUMOUR)
- Description: Excision of primary or secondary bone tumour.
- Variants: none linked

#### Procedure: Expandable Endoprosthetic Reconstruction in Growing Child (PROC_EXPANDABLE_ENDOPROSTHETIC_RECONSTRUCTION_IN_GROWING_CHILD)
- Description: Extendible megaprosthesis for paediatric tumour surgery.
- Variants: none linked

#### Procedure: Fixation for Metastatic Bone Disease (PROC_FIXATION_FOR_METASTATIC_BONE_DISEASE)
- Description: Stabilisation procedure for metastatic bone disease.
- Variants: none linked

#### Procedure: Intercalary Endoprosthetic Reconstruction (PROC_INTERCALARY_ENDOPROSTHETIC_RECONSTRUCTION)
- Description: Intercalary segment replacement after tumour resection.
- Variants: none linked

#### Procedure: Intralesional Curettage of Aneurysmal Bone Cyst (PROC_INTRALESIONAL_CURETTAGE_OF_ANEURYSMAL_BONE_CYST)
- Description: Curettage of ABC with adjuvant treatment.
- Variants: none linked

#### Procedure: Pathological Fracture Fixation for Bone Tumour (PROC_PATHOLOGICAL_FRACTURE_FIXATION_FOR_BONE_TUMOUR)
- Description: Fixation of tumour-related pathologic fracture.
- Variants: none linked

#### Procedure: Prophylactic Intramedullary Nailing for Metastatic Lesion (PROC_PROPHYLACTIC_INTRAMEDULLARY_NAILING_FOR_METASTATIC_LESION)
- Description: Preventive fixation for impending pathologic fracture.
- Variants: none linked

#### Procedure: Prophylactic Plate Fixation for Bone Metastasis (PROC_PROPHYLACTIC_PLATE_FIXATION_FOR_BONE_METASTASIS)
- Description: Prophylactic plating of impending pathologic fracture.
- Variants: none linked

#### Procedure: Resection of Metastatic Lesion with Endoprosthetic Reconstruction (PROC_RESECTION_OF_METASTATIC_LESION_WITH_ENDOPROSTHETIC_RECONSTRUCTION)
- Description: Excision of metastatic lesion with prosthetic reconstruction.
- Variants: none linked

#### Procedure: Rotationplasty (PROC_ROTATIONPLASTY)
- Description: Rotationplasty for limb salvage in selected patients.
- Variants: none linked

#### Procedure: Wide Excision of Bone Sarcoma (PROC_WIDE_EXCISION_OF_BONE_SARCOMA)
- Description: Wide oncologic resection of primary bone sarcoma.
- Variants: none linked


### Anatomy: Pelvis (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_PELVIS)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Pelvic Tumour Resection (PROC_PELVIC_TUMOUR_RESECTION)
- Description: Resection of tumour involving the pelvis.
- Variant: Internal Hemipelvectomy (PV_PELVIC_TUMOUR_INTERNAL_HEMI)
  Description: Pelvic tumour resection performed as an internal hemipelvectomy.
  Systems: none linked
- Variant: Pelvic Tumour Resection with Reconstruction (PV_PELVIC_TUMOUR_WITH_RECON)
  Description: Pelvic tumour resection combined with reconstruction.
  Systems: none linked


### Anatomy: Soft Tissue (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_SOFT_TISSUE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Excision of Soft Tissue Tumour (PROC_EXCISION_OF_SOFT_TISSUE_TUMOUR)
- Description: Excision of benign or malignant soft tissue tumour.
- Variant: Marginal Excision (PV_SOFT_TISSUE_TUMOUR_MARGINAL)
  Description: Excision of soft tissue tumour using a marginal excision.
  Systems: none linked
- Variant: Wide Excision (PV_SOFT_TISSUE_TUMOUR_WIDE)
  Description: Excision of soft tissue tumour using a wide excision.
  Systems: none linked


## Subspecialty: Orthopaedic Trauma (SL_ORTHOPAEDIC_TRAUMA_SURGERY)

### Anatomy: Pelvis (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_PELVIS)
#### Procedure: Pelvic Ring Fixation (PROC_PELVIC_RING_FIXATION)
- Description: Operative fixation of pelvic ring injury.
- Variant: Anterior Ring Fixation (PV_PELVIC_RING_ANTERIOR)
  Description: Pelvic ring fixation focused on the anterior ring.
  Systems: none linked
- Variant: Posterior Ring Fixation (PV_PELVIC_RING_POSTERIOR)
  Description: Pelvic ring fixation focused on the posterior ring.
  Systems: none linked


### Anatomy: Acetabulum (ANAT_ACETABULUM)
#### Procedure: Anterior Column Acetabular Fixation (PROC_ANTERIOR_COLUMN_ACETABULAR_FIXATION)
- Description: Fixation of anterior column acetabular fracture.
- Variants: none linked

#### Procedure: Posterior Wall Acetabular Fixation (PROC_POSTERIOR_WALL_ACETABULAR_FIXATION)
- Description: Fixation of posterior wall acetabular fracture.
- Variants: none linked


### Anatomy: Ankle (ANAT_ANKLE)
#### Procedure: Deltoid Ligament Repair with Ankle Fracture Fixation (PROC_DELTOID_LIGAMENT_REPAIR_WITH_ANKLE_FRACTURE_FIXATION)
- Description: Adjunct soft-tissue repair with ankle fracture surgery.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Ankle Fracture (PROC_ORIF_ANKLE)
- Description: Open reduction and internal fixation of ankle fracture.
- Aliases: Ankle ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Bimalleolar Ankle Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_BIMALLEOLAR_ANKLE_FRACTURE)
- Description: ORIF of bimalleolar ankle fracture.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Pilon Fracture (PROC_ORIF_PILON)
- Description: Open reduction and internal fixation of tibial plafond fracture.
- Aliases: Pilon ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Trimalleolar Ankle Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_TRIMALLEOLAR_ANKLE_FRACTURE)
- Description: ORIF of trimalleolar ankle fracture.
- Variants: none linked

#### Procedure: Syndesmosis Fixation of Ankle Injury (PROC_SYNDESMOSIS_FIXATION_OF_ANKLE_INJURY)
- Description: Stabilisation of distal tibiofibular syndesmosis.
- Variants: none linked


### Anatomy: Bone (ANAT_BONE)
#### Procedure: Debridement and Temporary External Fixation for Open Fracture (PROC_DEBRIDEMENT_AND_TEMPORARY_EXTERNAL_FIXATION_FOR_OPEN_FRACTURE)
- Description: Initial damage control management of open fracture.
- Variants: none linked

#### Procedure: Exchange Nailing for Fracture Nonunion (PROC_EXCHANGE_NAILING_FOR_FRACTURE_NONUNION)
- Description: Exchange nailing procedure for aseptic nonunion.
- Variants: none linked

#### Procedure: Management of Open Fracture (PROC_MANAGEMENT_OPEN_FRACTURE)
- Description: Operative debridement and stabilisation for open fracture.
- Variants: none linked

#### Procedure: Plate Fixation for Fracture Nonunion (PROC_PLATE_FIXATION_FOR_FRACTURE_NONUNION)
- Description: Compression plating and grafting for fracture nonunion.
- Variants: none linked


### Anatomy: Clavicle (ANAT_CLAVICLE)
#### Procedure: Open Reduction and Internal Fixation of Clavicle Fracture (PROC_ORIF_CLAVICLE)
- Description: Open reduction and internal fixation of clavicle fracture.
- Aliases: Clavicle ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Distal Clavicle Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_DISTAL_CLAVICLE_FRACTURE)
- Description: ORIF of distal clavicle fracture.
- Variants: none linked


### Anatomy: Digits (ANAT_DIGITS)
#### Procedure: Central Slip Repair of Finger (PROC_CENTRAL_SLIP_REPAIR_OF_FINGER)
- Description: Repair of extensor central slip injury.
- Variants: none linked

#### Procedure: Closed Reduction and Percutaneous Pinning of Phalangeal Fracture (PROC_CLOSED_REDUCTION_AND_PERCUTANEOUS_PINNING_OF_PHALANGEAL_FRACTURE)
- Description: CRPP of phalangeal fracture.
- Variants: none linked

#### Procedure: Mallet Finger Fracture Fixation (PROC_MALLET_FINGER_FRACTURE_FIXATION)
- Description: Operative fixation of bony mallet injury.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Phalangeal Fracture (PROC_ORIF_PHALANGEAL)
- Description: Open reduction and internal fixation of phalangeal fracture.
- Aliases: Phalangeal ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Toe Phalanx Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_TOE_PHALANX_FRACTURE)
- Description: ORIF of toe phalanx fracture.
- Variants: none linked


### Anatomy: Distal Femur (ANAT_DISTAL_FEMUR)
#### Procedure: Open Reduction and Internal Fixation of Distal Femur Fracture (PROC_ORIF_DISTAL_FEMUR)
- Description: Open reduction and internal fixation of distal femur fracture.
- Aliases: Distal Femur ORIF
- Variants: none linked


### Anatomy: Distal Tibia (ANAT_DISTAL_TIBIA)
#### Procedure: Open Reduction and Internal Fixation of Distal Tibia Fracture (PROC_ORIF_DISTAL_TIBIA)
- Description: Open reduction and internal fixation of distal tibia fracture.
- Aliases: Distal Tibia ORIF
- Variants: none linked


### Anatomy: Elbow (ANAT_ELBOW)
#### Procedure: Open Reduction and Internal Fixation of Coronoid Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_CORONOID_FRACTURE)
- Description: ORIF of coronoid process fracture.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Distal Humerus Fracture (PROC_ORIF_DISTAL_HUMERUS)
- Description: Open reduction and internal fixation of distal humerus fracture.
- Aliases: Distal Humerus ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Olecranon Fracture (PROC_ORIF_OLECRANON)
- Description: Open reduction and internal fixation of olecranon fracture.
- Aliases: Olecranon ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Radial Head Fracture (PROC_ORIF_RADIAL_HEAD)
- Description: Open reduction and internal fixation of radial head fracture.
- Aliases: Radial Head ORIF
- Variants: none linked

#### Procedure: Terrible Triad Reconstruction of Elbow (PROC_TERRIBLE_TRIAD_RECONSTRUCTION_OF_ELBOW)
- Description: Combined fixation/replacement/ligament reconstruction for terrible triad injury.
- Variants: none linked

#### Procedure: Total Elbow Replacement for Distal Humerus Fracture (PROC_TOTAL_ELBOW_REPLACEMENT_FOR_DISTAL_HUMERUS_FRACTURE)
- Description: Acute total elbow arthroplasty for complex distal humerus fracture.
- Variants: none linked


### Anatomy: Femur (ANAT_FEMUR)
#### Procedure: Cephalomedullary Nail Fixation of Intertrochanteric Fracture (PROC_CEPHALOMEDULLARY_NAIL_FIXATION)
- Description: Cephalomedullary nailing of intertrochanteric femoral fracture.
- Aliases: Proximal Femoral Nail Fixation
- Variants: none linked

#### Procedure: Intramedullary Nailing of Femoral Shaft Fracture (PROC_INTRAMEDULLARY_NAILING_FEMORAL_SHAFT)
- Description: Intramedullary fixation of femoral shaft fracture.
- Variants: none linked

#### Procedure: Intramedullary Nailing of Subtrochanteric Femur Fracture (PROC_INTRAMEDULLARY_NAILING_SUBTROCHANTERIC_FEMUR)
- Description: Intramedullary fixation of subtrochanteric femur fracture.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Periprosthetic Femur Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PERIPROSTHETIC_FEMUR_FRACTURE)
- Description: ORIF of femoral fracture around arthroplasty.
- Variants: none linked

#### Procedure: Proximal Femur Locking Plate Fixation (PROC_PROXIMAL_FEMUR_LOCKING_PLATE_FIXATION)
- Description: Locking plate fixation of proximal femur fracture.
- Variants: none linked

#### Procedure: Retrograde Intramedullary Nailing of Distal Femur Fracture (PROC_RETROGRADE_INTRAMEDULLARY_NAILING_OF_DISTAL_FEMUR_FRACTURE)
- Description: Retrograde intramedullary fixation of distal femur fracture.
- Variants: none linked


### Anatomy: Forearm (ANAT_FOREARM)
#### Procedure: Open Reduction and Internal Fixation of Forearm Shaft Fracture (PROC_ORIF_FOREARM_SHAFT)
- Description: Open reduction and internal fixation of radius and/or ulna shaft fracture.
- Aliases: Forearm Shaft ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Galeazzi Fracture-Dislocation (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_GALEAZZI_FRACTURE_DISLOCATION)
- Description: Reconstruction of Galeazzi injury.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Monteggia Fracture-Dislocation (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_MONTEGGIA_FRACTURE_DISLOCATION)
- Description: Reconstruction of Monteggia injury.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Radial Shaft Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_RADIAL_SHAFT_FRACTURE)
- Description: ORIF of isolated radial shaft fracture.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Ulnar Shaft Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_ULNAR_SHAFT_FRACTURE)
- Description: ORIF of isolated ulnar shaft fracture.
- Variants: none linked


### Anatomy: Forefoot (ANAT_FOREFOOT)
#### Procedure: Open Reduction and Internal Fixation of Metatarsal Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_METATARSAL_FRACTURE)
- Description: ORIF of metatarsal fracture.
- Variants: none linked


### Anatomy: Hand (ANAT_HAND)
#### Procedure: Closed Reduction and Percutaneous Pinning of Metacarpal Fracture (PROC_CLOSED_REDUCTION_AND_PERCUTANEOUS_PINNING_OF_METACARPAL_FRACTURE)
- Description: CRPP of metacarpal fracture.
- Variants: none linked

#### Procedure: Collateral Ligament Repair of Thumb MCP Joint (PROC_COLLATERAL_LIGAMENT_REPAIR_OF_THUMB_MCP_JOINT)
- Description: Repair/reconstruction of skier's/gamekeeper's thumb.
- Aliases: UCL Repair of Thumb
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Metacarpal Fracture (PROC_ORIF_METACARPAL)
- Description: Open reduction and internal fixation of metacarpal fracture.
- Aliases: Metacarpal ORIF
- Variants: none linked


### Anatomy: Hindfoot (ANAT_HINDFOOT)
#### Procedure: Open Reduction and Internal Fixation of Calcaneal Fracture (PROC_ORIF_CALCANEUS)
- Description: Open reduction and internal fixation of calcaneal fracture.
- Aliases: Calcaneus ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Talar Fracture (PROC_ORIF_TALUS)
- Description: Open reduction and internal fixation of talar fracture.
- Aliases: Talus ORIF
- Variants: none linked

#### Procedure: Percutaneous Fixation of Calcaneal Fracture (PROC_PERCUTANEOUS_FIXATION_OF_CALCANEAL_FRACTURE)
- Description: Percutaneous fixation of calcaneus fracture.
- Variants: none linked


### Anatomy: Hip (ANAT_HIP)
#### Procedure: Cannulated Screw Fixation of Intracapsular Femoral Neck Fracture (PROC_CANNULATED_SCREW_FIXATION_OF_INTRACAPSULAR_FEMORAL_NECK_FRACTURE)
- Description: Internal fixation of femoral neck fracture with cannulated screws.
- Variants: none linked

#### Procedure: Dynamic Hip Screw Fixation of Intertrochanteric Fracture (PROC_DYNAMIC_HIP_SCREW_FIXATION)
- Description: Dynamic hip screw fixation for intertrochanteric femoral fracture.
- Aliases: DHS Fixation
- Variants: none linked

#### Procedure: Sliding Hip Screw with Trochanteric Stabilisation Plate (PROC_SLIDING_HIP_SCREW_WITH_TROCHANTERIC_STABILISATION_PLATE)
- Description: DHS plus TSP for unstable pertrochanteric fracture.
- Variants: none linked


### Anatomy: Humerus (ANAT_HUMERUS)
#### Procedure: Open Reduction and Internal Fixation of Humeral Shaft Fracture (PROC_ORIF_HUMERAL_SHAFT)
- Description: Open reduction and internal fixation of humeral shaft fracture.
- Aliases: Humeral Shaft ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Proximal Humerus Fracture (PROC_ORIF_PROXIMAL_HUMERUS)
- Description: Open reduction and internal fixation of proximal humerus fracture.
- Aliases: Proximal Humerus ORIF
- Variant: Low Profile (VAR_LOW_PROFILE)
  Description: Low-profile plate option
  Systems: LCP Clavicle Plate System, Elbow Fracture Fixation Portfolio, Olecranon / Proximal Ulna Fixation, Radial Head Fixation Portfolio, Tornier Radial Head Portfolio, LC-DCP / LCP Forearm Portfolio, Broad / Narrow LCP Humeral Shaft Portfolio, Proximal Humerus Plating System


### Anatomy: Knee (ANAT_KNEE)
#### Procedure: Open Reduction and Internal Fixation of Tibial Plateau Fracture (PROC_ORIF_TIBIAL_PLATEAU)
- Description: Open reduction and internal fixation of tibial plateau fracture.
- Aliases: Tibial Plateau ORIF
- Variants: none linked


### Anatomy: Midfoot (ANAT_MIDFOOT)
#### Procedure: Open Reduction and Internal Fixation of Lisfranc Injury (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_LISFRANC_INJURY)
- Description: Fixation of tarsometatarsal fracture-dislocation.
- Aliases: Lisfranc ORIF
- Variants: none linked


### Anatomy: Patella (ANAT_PATELLA)
#### Procedure: Open Reduction and Internal Fixation of Patella Fracture (PROC_ORIF_PATELLA)
- Description: Open reduction and internal fixation of patella fracture.
- Aliases: Patella ORIF
- Variants: none linked


### Anatomy: Shoulder (ANAT_SHOULDER)
#### Procedure: Percutaneous Fixation of Proximal Humerus Fracture (PROC_PERCUTANEOUS_FIXATION_OF_PROXIMAL_HUMERUS_FRACTURE)
- Description: Percutaneous fixation of proximal humerus fracture.
- Variants: none linked

#### Procedure: Reverse Total Shoulder Replacement for Proximal Humerus Fracture (PROC_REVERSE_TOTAL_SHOULDER_REPLACEMENT_FOR_PROXIMAL_HUMERUS_FRACTURE)
- Description: Reverse shoulder arthroplasty for complex proximal humerus fracture.
- Variants: none linked


### Anatomy: Tibia (ANAT_TIBIA)
#### Procedure: Circular Frame Fixation of Tibial Fracture (PROC_CIRCULAR_FRAME_FIXATION_OF_TIBIAL_FRACTURE)
- Description: Ring-fixator treatment of complex tibial fracture.
- Variants: none linked

#### Procedure: Intramedullary Nailing of Tibial Shaft Fracture (PROC_INTRAMEDULLARY_NAILING_TIBIAL_SHAFT)
- Description: Intramedullary fixation of tibial shaft fracture.
- Variant: Non-locking (VAR_NONLOCKING)
  Description: Non-locking fixation construct
  Systems: Acetabular Fracture Fixation Portfolio, VariAx Distal Tibia / Pilon Plating, Hoffmann External Fixation System, Open Fracture Stabilisation Portfolio, VA-LCP Condylar / Distal Femur Plate, VA-LCP Distal Tibia Plate, TFNA Proximal Femoral Nailing System, Femoral Expert Nail / RFN-Advanced, TFNA Long Nail System, InterTAN / Hip Fracture Fixation Portfolio, Hip Fracture / Hemiarthroplasty Portfolio, VA-LCP Proximal Tibia Plating, Patella Plating / Cerclage Portfolio, Pelvic System / 3.5 Reconstruction, Expert Tibial Nail System

#### Procedure: Masquelet Reconstruction of Tibial Bone Defect (PROC_MASQUELET_RECONSTRUCTION_OF_TIBIAL_BONE_DEFECT)
- Description: Staged reconstruction of tibial segmental bone loss.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Proximal Tibia Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PROXIMAL_TIBIA_FRACTURE)
- Description: ORIF of proximal tibia fracture.
- Variants: none linked

#### Procedure: Suprapatellar Tibial Nailing (PROC_SUPRAPATELLAR_TIBIAL_NAILING)
- Description: Suprapatellar approach tibial intramedullary nailing.
- Variants: none linked


### Anatomy: Wrist (ANAT_WRIST)
#### Procedure: External Fixation of Distal Radius Fracture (PROC_EXTERNAL_FIXATION_OF_DISTAL_RADIUS_FRACTURE)
- Description: Bridging external fixation of distal radius fracture.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Distal Radius Fracture (PROC_ORIF_DISTAL_RADIUS)
- Description: Open reduction and internal fixation of distal radius fracture.
- Aliases: Distal Radius ORIF
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Distal Ulna Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_DISTAL_ULNA_FRACTURE)
- Description: ORIF of distal ulna fracture.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Perilunate Fracture-Dislocation (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PERILUNATE_FRACTURE_DISLOCATION)
- Description: ORIF for perilunate fracture-dislocation.
- Variants: none linked

#### Procedure: Open Reduction and Internal Fixation of Scaphoid Fracture (PROC_ORIF_SCAPHOID)
- Description: Open reduction and internal fixation of scaphoid fracture.
- Aliases: Scaphoid ORIF
- Variants: none linked

#### Procedure: Percutaneous Fixation of Scaphoid Fracture (PROC_PERCUTANEOUS_FIXATION_SCAPHOID)
- Description: Percutaneous fixation of scaphoid fracture.
- Variant: Locking (VAR_LOCKING)
  Description: Locking hand and wrist fixation construct
  Systems: Pelvic / Acetabular Plating System, Gorilla Ankle Fracture Plating System, Gorilla Pilon / Ankle Fracture Plating System, TrueLok / External Fixation System, Damage Control / External Fixation Portfolio, Clavicle Plating System, Aptus Hand / Phalangeal Fixation, AxSOS / VariAx Distal Femur Plating, AxSOS Distal Tibia Plate, Distal Humerus Plating System, Olecranon Plating System, Radial Head / Neck Fixation Portfolio, Anatomic Radial Head System, Gamma4 Hip Fracture Nail System, T2 Alpha Femur Nail System, Gamma4 Long Nail System, Forearm Shaft Plating System, Aptus Hand / Metacarpal Fixation, Gorilla Calcaneal Fracture Plating, Gorilla Talus / Hindfoot Fixation Portfolio, DHS Plate and Screw System, Hip Fracture / Hemiarthroplasty Portfolio, Humeral Shaft Plating System, T2 Proximal Humerus / Plating Portfolio, AxSOS Tibial Plateau Plating, Patella Fracture / FiberTape Cerclage Portfolio, Pelvic Fixation Portfolio, T2 Alpha Tibia Nail System, Acu-Loc Distal Radius System, Acutrak / Scaphoid Compression Screw System, Acutrak Percutaneous Scaphoid Fixation
- Variant: Compression (VAR_COMPRESSION)
  Description: Compression screw construct
  Systems: VariAx Ankle Fracture System, Digit Fracture Fixation Portfolio, Hand Fracture Fixation Portfolio, VariAx Calcaneus Plating, Talus / Hindfoot Fixation Portfolio, Geminus Distal Radius System, Scaphoid Screw System, Percutaneous Scaphoid Screw Portfolio

#### Procedure: Scaphoid Nonunion Reconstruction with Bone Graft (PROC_SCAPHOID_NONUNION_RECONSTRUCTION_WITH_BONE_GRAFT)
- Description: Fixation and grafting for scaphoid nonunion.
- Variants: none linked


### Anatomy: Fibula (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FIBULA)
- Procedures: none linked

### Anatomy: Foot (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FOOT)
- Subanatomy: Hindfoot, Midfoot, Forefoot, First Metatarsophalangeal (MTP) Joint, Lesser Metatarsophalangeal Joints, Interphalangeal Joints, Subtalar Joint, Midfoot Joints
- Procedures: none linked

### Anatomy: Acetabulum (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_ACETABULUM)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Acetabular Fracture Fixation (PROC_ACETABULAR_FRACTURE_FIXATION)
- Description: Operative fixation of acetabular fracture.
- Variant: Anterior Column / Ilioinguinal-Type Approach (PV_ACETABULAR_FRACTURE_ANTERIOR)
  Description: Acetabular fracture fixation using an anterior exposure strategy.
  Systems: none linked
- Variant: Posterior Column / Kocher-Langenbeck Approach (PV_ACETABULAR_FRACTURE_POSTERIOR)
  Description: Acetabular fracture fixation using a posterior exposure strategy.
  Systems: none linked


### Anatomy: Ankle (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_ANKLE)
- Subanatomy: Whole Joint, Distal Tibia, Talus, Tibial Plafond, Tibiotalar Joint, Whole Joint, Distal Fibula, Syndesmosis
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Ankle Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_ANKLE_FRACTURE)
- Description: Open reduction and internal fixation of ankle fracture.
- Aliases: Ankle ORIF
- Variant: Bimalleolar / Trimalleolar Fixation (PV_ANKLE_ORIF_BIMALLEOLAR)
  Description: Ankle fracture ORIF for bimalleolar or trimalleolar injury patterns.
  Systems: LCP Fibula / Distal Fibula
- Variant: Ankle ORIF with Syndesmotic Fixation (PV_ANKLE_ORIF_WITH_SYNDESMOSIS)
  Description: Ankle fracture ORIF including syndesmotic stabilisation.
  Systems: LCP Fibula / Distal Fibula

#### Procedure: Open Reduction and Internal Fixation of Pilon Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PILON_FRACTURE)
- Description: Open reduction and internal fixation of tibial plafond fracture.
- Aliases: Pilon ORIF
- Variant: Staged Definitive Fixation (PV_PILON_ORIF_STAGED)
  Description: Pilon fracture managed with staged definitive fixation after soft-tissue optimisation.
  Systems: LCP Distal Tibia Plate
- Variant: Limited Open / Percutaneous Fixation (PV_PILON_ORIF_LIMITED_OPEN)
  Description: Pilon fracture ORIF using limited open or percutaneous fixation techniques.
  Systems: LCP Distal Tibia Plate


### Anatomy: Bone (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_BONE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: External Fixation of Fracture (PROC_EXTERNAL_FIXATION_OF_FRACTURE)
- Description: Application of external fixation for fracture stabilisation.
- Variant: Spanning External Fixator (PV_EXTERNAL_FIX_SPANNING)
  Description: Fracture stabilisation using a spanning external fixator construct.
  Systems: none linked
- Variant: Ring External Fixator (PV_EXTERNAL_FIX_RING)
  Description: Fracture stabilisation using a circular or ring fixator construct.
  Systems: none linked

#### Procedure: Management of Open Fracture (PROC_MANAGEMENT_OF_OPEN_FRACTURE)
- Description: Operative debridement and stabilisation for open fracture.
- Variant: Damage-Control Debridement and Temporary Stabilisation (PV_OPEN_FRACTURE_DAMAGE_CONTROL)
  Description: Open fracture management with debridement and temporary stabilisation.
  Systems: none linked
- Variant: Definitive Fixation after Debridement (PV_OPEN_FRACTURE_DEFINITIVE)
  Description: Open fracture management proceeding to definitive fixation after debridement.
  Systems: none linked


### Anatomy: Bone (ANAT_GENERIC_BONE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Calcaneus Plate Fixation (PROC_CALCANEUS_PLATE_FIXATION)
- Description: Calcaneus Plate Fixation using internal fixation system.
- Variants: none linked

#### Procedure: Clavicle Plate Fixation (PROC_CLAVICLE_PLATE_FIXATION)
- Description: Clavicle Plate Fixation using internal fixation system.
- Variants: none linked

#### Procedure: Distal Radius Volar Plating (PROC_DISTAL_RADIUS_VOLAR_PLATING)
- Description: Distal Radius Volar Plating using internal fixation system.
- Variants: none linked

#### Procedure: Fibula Plate Fixation (PROC_FIBULA_PLATE_FIXATION)
- Description: Fibula Plate Fixation using internal fixation system.
- Variants: none linked

#### Procedure: Intramedullary Nailing of Humerus (PROC_INTRAMEDULLARY_NAILING_HUMERUS)
- Description: Intramedullary Nailing of Humerus using internal fixation system.
- Variants: none linked

#### Procedure: Metatarsal Fracture Fixation (PROC_METATARSAL_FIXATION)
- Description: Metatarsal Fracture Fixation using internal fixation system.
- Variants: none linked

#### Procedure: Phalanx Fracture Fixation (PROC_PHALANX_FIXATION)
- Description: Phalanx Fracture Fixation using internal fixation system.
- Variants: none linked

#### Procedure: Scapula Fracture Fixation (PROC_SCAPULA_FRACTURE_FIXATION)
- Description: Scapula Fracture Fixation using internal fixation system.
- Variants: none linked

#### Procedure: Talus Fracture Fixation (PROC_TALUS_FIXATION)
- Description: Talus Fracture Fixation using internal fixation system.
- Variants: none linked

#### Procedure: Tibial Plate Fixation (PROC_TIBIAL_PLATE_FIXATION)
- Description: Tibial Plate Fixation using internal fixation system.
- Variants: none linked


### Anatomy: Clavicle (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_CLAVICLE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Clavicle Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_CLAVICLE_FRACTURE)
- Description: Open reduction and internal fixation of clavicle fracture.
- Aliases: Clavicle ORIF
- Variant: Superior Plating (PV_CLAVICLE_ORIF_SUPERIOR)
  Description: Clavicle fracture ORIF using superior plate placement.
  Systems: LCP Clavicle Plate
- Variant: Anteroinferior Plating (PV_CLAVICLE_ORIF_ANTEROINFERIOR)
  Description: Clavicle fracture ORIF using anteroinferior plate placement.
  Systems: LCP Clavicle Plate


### Anatomy: Digits (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_DIGITS)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Phalangeal Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PHALANGEAL_FRACTURE)
- Description: Open reduction and internal fixation of phalangeal fracture.
- Aliases: Phalangeal ORIF
- Variant: Plate Fixation (PV_PHALANGEAL_ORIF_PLATE)
  Description: Phalangeal fracture ORIF using plate fixation.
  Systems: none linked
- Variant: Percutaneous K-Wire Fixation (PV_PHALANGEAL_ORIF_KWIRE)
  Description: Phalangeal fracture fixation using percutaneous K-wires.
  Systems: none linked


### Anatomy: Elbow (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_ELBOW)
- Subanatomy: Whole Joint, Distal Humerus, Proximal Ulna, Radial Head
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Distal Humerus Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_DISTAL_HUMERUS_FRACTURE)
- Description: Open reduction and internal fixation of distal humerus fracture.
- Aliases: Distal Humerus ORIF
- Variant: Olecranon Osteotomy Approach (PV_DISTAL_HUMERUS_ORIF_OSTEOTOMY)
  Description: Distal humerus fracture ORIF using an olecranon osteotomy for articular exposure.
  Systems: LCP Distal Humerus Plate
- Variant: Triceps-Sparing Approach (PV_DISTAL_HUMERUS_ORIF_TRICEPS_SPARING)
  Description: Distal humerus fracture ORIF using a triceps-sparing approach.
  Systems: LCP Distal Humerus Plate

#### Procedure: Open Reduction and Internal Fixation of Olecranon Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_OLECRANON_FRACTURE)
- Description: Open reduction and internal fixation of olecranon fracture.
- Aliases: Olecranon ORIF
- Variant: Tension Band Wiring (PV_OLECRANON_ORIF_TENSION_BAND)
  Description: Olecranon fracture ORIF using tension band wiring.
  Systems: none linked
- Variant: Plate Fixation (PV_OLECRANON_ORIF_PLATE)
  Description: Olecranon fracture ORIF using plate fixation.
  Systems: none linked

#### Procedure: Open Reduction and Internal Fixation of Radial Head Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_RADIAL_HEAD_FRACTURE)
- Description: Open reduction and internal fixation of radial head fracture.
- Aliases: Radial Head ORIF
- Variant: Kocher Approach (PV_RADIAL_HEAD_ORIF_KOCHER)
  Description: Radial head fracture ORIF through a Kocher interval.
  Systems: none linked
- Variant: Kaplan Approach (PV_RADIAL_HEAD_ORIF_KAPLAN)
  Description: Radial head fracture ORIF through a Kaplan interval.
  Systems: none linked

#### Procedure: Radial Head Replacement (PROC_RADIAL_HEAD_REPLACEMENT)
- Description: Replacement of the radial head, commonly for complex fracture.
- Variant: Monopolar Implant (PV_RADIAL_HEAD_REPLACEMENT_MONOPOLAR)
  Description: Radial head replacement using a monopolar implant.
  Systems: Acumed Modular Radial Head, Katalyst Radial Head
- Variant: Bipolar Implant (PV_RADIAL_HEAD_REPLACEMENT_BIPOLAR)
  Description: Radial head replacement using a bipolar implant.
  Systems: Acumed Modular Radial Head, Katalyst Radial Head


### Anatomy: Femur (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FEMUR)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Cephalomedullary Nail Fixation of Intertrochanteric Fracture (PROC_CEPHALOMEDULLARY_NAIL_FIXATION_OF_INTERTROCHANTERIC_FRACTURE)
- Description: Cephalomedullary nailing of intertrochanteric femoral fracture.
- Aliases: Proximal Femoral Nail Fixation
- Variant: Short Cephalomedullary Nail (PV_CMN_SHORT)
  Description: Intertrochanteric fracture fixation using a short cephalomedullary nail.
  Systems: Gamma Nail System, PFNA Nail System, TFN-ADVANCED Nail System, InterTAN Nail System, TRIGEN META-NAIL
- Variant: Long Cephalomedullary Nail (PV_CMN_LONG)
  Description: Intertrochanteric fracture fixation using a long cephalomedullary nail.
  Systems: Gamma Nail System, PFNA Nail System, TFN-ADVANCED Nail System, InterTAN Nail System, TRIGEN META-NAIL

#### Procedure: Intramedullary Nailing of Femoral Shaft Fracture (PROC_INTRAMEDULLARY_NAILING_OF_FEMORAL_SHAFT_FRACTURE)
- Description: Intramedullary fixation of femoral shaft fracture.
- Variant: Antegrade Nailing (PV_FEMORAL_SHAFT_IM_ANTEGRADE)
  Description: Femoral shaft fracture fixation using antegrade intramedullary nailing.
  Systems: Expert Femoral Nail (EFN), T2 Femoral Nail, TRIGEN Femoral Nail
- Variant: Retrograde Nailing (PV_FEMORAL_SHAFT_IM_RETROGRADE)
  Description: Femoral shaft fracture fixation using retrograde intramedullary nailing.
  Systems: Expert Femoral Nail (EFN), T2 Femoral Nail, TRIGEN Femoral Nail

#### Procedure: Intramedullary Nailing of Subtrochanteric Femur Fracture (PROC_INTRAMEDULLARY_NAILING_OF_SUBTROCHANTERIC_FEMUR_FRACTURE)
- Description: Intramedullary fixation of subtrochanteric femur fracture.
- Variant: Long Cephalomedullary Nail (PV_SUBTROCH_IM_NAIL_LONG_CMN)
  Description: Subtrochanteric femur fracture fixation using a long cephalomedullary nail.
  Systems: Gamma Nail System, PFNA Nail System, TFN-ADVANCED Nail System, InterTAN Nail System, TRIGEN META-NAIL
- Variant: Reconstruction Nail (PV_SUBTROCH_IM_RECON)
  Description: Subtrochanteric femur fracture fixation using a reconstruction nail construct.
  Systems: Expert Femoral Nail (EFN), T2 Femoral Nail

#### Procedure: Open Reduction and Internal Fixation of Distal Femur Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_DISTAL_FEMUR_FRACTURE)
- Description: Open reduction and internal fixation of distal femur fracture.
- Aliases: Distal Femur ORIF
- Variant: Lateral Locked Plating (PV_DISTAL_FEMUR_ORIF_LATERAL_LOCKED)
  Description: Distal femur fracture ORIF using a lateral locked plate.
  Systems: LCP Distal Femoral Plate, NCB Distal Femoral Plate
- Variant: Dual Plating (PV_DISTAL_FEMUR_ORIF_DUAL_PLATE)
  Description: Distal femur fracture ORIF using dual plate fixation.
  Systems: LCP Distal Femoral Plate, NCB Distal Femoral Plate


### Anatomy: Forearm (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FOREARM)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Forearm Shaft Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_FOREARM_SHAFT_FRACTURE)
- Description: Open reduction and internal fixation of radius and/or ulna shaft fracture.
- Aliases: Forearm Shaft ORIF
- Variant: Volar Henry / Anterior Approach (PV_FOREARM_SHAFT_ORIF_VOLAR_HENRY)
  Description: Forearm shaft fracture ORIF using an anterior approach for the radius with standard ulna exposure.
  Systems: LCP Radius / Ulna Plates
- Variant: Dorsal Thompson / Posterior Approach (PV_FOREARM_SHAFT_ORIF_DORSAL_THOMPSON)
  Description: Forearm shaft fracture ORIF using a dorsal/posterior approach for the radius with standard ulna exposure.
  Systems: LCP Radius / Ulna Plates


### Anatomy: Hand (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HAND)
- Subanatomy: Digits, Thumb CMC Joint, Metacarpophalangeal (MCP) Joints, Proximal Interphalangeal (PIP) Joints, Distal Interphalangeal (DIP) Joints
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Metacarpal Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_METACARPAL_FRACTURE)
- Description: Open reduction and internal fixation of metacarpal fracture.
- Aliases: Metacarpal ORIF
- Variant: Plate Fixation (PV_METACARPAL_ORIF_PLATE)
  Description: Metacarpal fracture ORIF using plate fixation.
  Systems: none linked
- Variant: Intramedullary Fixation (PV_METACARPAL_ORIF_INTRAMEDULLARY)
  Description: Metacarpal fracture ORIF using an intramedullary fixation device.
  Systems: none linked


### Anatomy: Hindfoot (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HINDFOOT)
- Subanatomy: Calcaneus, Talus, Subtalar Joint, Talocalcaneal Joint
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Calcaneal Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_CALCANEAL_FRACTURE)
- Description: Open reduction and internal fixation of calcaneal fracture.
- Aliases: Calcaneus ORIF
- Variant: Extensile Lateral Approach (PV_CALCANEUS_ORIF_EXTENSILE)
  Description: Calcaneal fracture ORIF through an extensile lateral approach.
  Systems: LCP Calcaneal Plate, PerilLoc Calcaneal Plate
- Variant: Sinus Tarsi Approach (PV_CALCANEUS_ORIF_SINUS_TARSI)
  Description: Calcaneal fracture ORIF through a sinus tarsi approach.
  Systems: LCP Calcaneal Plate, PerilLoc Calcaneal Plate

#### Procedure: Open Reduction and Internal Fixation of Talar Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_TALAR_FRACTURE)
- Description: Open reduction and internal fixation of talar fracture.
- Aliases: Talus ORIF
- Variant: Anteromedial Approach (PV_TALUS_ORIF_ANTEROMEDIAL)
  Description: Talar fracture ORIF through an anteromedial approach.
  Systems: none linked
- Variant: Dual Anterior Approach (PV_TALUS_ORIF_DUAL)
  Description: Talar fracture ORIF using combined anterior approaches for exposure.
  Systems: none linked


### Anatomy: Hip (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HIP)
- Subanatomy: Acetabulum, Whole Joint, Femoral Head, Femoral Neck, Proximal Femur
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Dynamic Hip Screw Fixation of Intertrochanteric Fracture (PROC_DYNAMIC_HIP_SCREW_FIXATION_OF_INTERTROCHANTERIC_FRACTURE)
- Description: Dynamic hip screw fixation for intertrochanteric femoral fracture.
- Aliases: DHS Fixation
- Variant: Standard DHS (PV_DHS_STANDARD)
  Description: Intertrochanteric fracture fixation using a standard dynamic hip screw construct.
  Systems: DHS — Dynamic Hip Screw
- Variant: DHS with Trochanteric Stabilisation Plate (PV_DHS_WITH_TSP)
  Description: Dynamic hip screw fixation supplemented with a trochanteric stabilisation plate.
  Systems: DHS — Dynamic Hip Screw

#### Procedure: Hemiarthroplasty of Hip (PROC_HEMIARTHROPLASTY_OF_HIP)
- Description: Hemiarthroplasty of the hip, commonly for intracapsular femoral neck fracture.
- Aliases: Hip Hemiarthroplasty
- Variant: Cemented Stem (PV_HIP_HEMI_CEMENTED)
  Description: Hip hemiarthroplasty using a cemented femoral stem.
  Systems: Exeter / Bipolar Head, CPT / Bipolar Head
- Variant: Uncemented Stem (PV_HIP_HEMI_UNCEMENTED)
  Description: Hip hemiarthroplasty using an uncemented femoral stem.
  Systems: Corail / Bipolar Head, Accolade II / Trident II


### Anatomy: Humerus (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HUMERUS)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Humeral Shaft Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_HUMERAL_SHAFT_FRACTURE)
- Description: Open reduction and internal fixation of humeral shaft fracture.
- Aliases: Humeral Shaft ORIF
- Variant: Anterolateral Approach (PV_HUMERAL_SHAFT_ORIF_ANTEROLATERAL)
  Description: Humeral shaft fracture ORIF through an anterolateral approach.
  Systems: Expert Humeral Nail (EHN), T2 Humeral Nail, LCP Humeral Shaft Plate
- Variant: Posterior Approach (PV_HUMERAL_SHAFT_ORIF_POSTERIOR)
  Description: Humeral shaft fracture ORIF through a posterior approach.
  Systems: Expert Humeral Nail (EHN), T2 Humeral Nail, LCP Humeral Shaft Plate

#### Procedure: Open Reduction and Internal Fixation of Proximal Humerus Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PROXIMAL_HUMERUS_FRACTURE)
- Description: Open reduction and internal fixation of proximal humerus fracture.
- Aliases: Proximal Humerus ORIF
- Variant: Deltopectoral Approach (PV_PROX_HUMERUS_ORIF_DELTOPECTORAL)
  Description: Proximal humerus fracture ORIF through a deltopectoral approach.
  Systems: PHILOS Proximal Humeral Plate, NCB Proximal Humerus Plate, MultiLoc Proximal Humeral Nail
- Variant: Deltoid-Splitting Approach (PV_PROX_HUMERUS_ORIF_DELTOID_SPLIT)
  Description: Proximal humerus fracture ORIF through a deltoid-splitting approach.
  Systems: PHILOS Proximal Humeral Plate, NCB Proximal Humerus Plate, MultiLoc Proximal Humeral Nail


### Anatomy: Knee (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_KNEE)
- Subanatomy: Patella, Whole Joint, Distal Femur, Proximal Tibia, Patellofemoral Joint, Medial Compartment, Lateral Compartment
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Tibial Plateau Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_TIBIAL_PLATEAU_FRACTURE)
- Description: Open reduction and internal fixation of tibial plateau fracture.
- Aliases: Tibial Plateau ORIF
- Variant: Lateral Plateau Fixation (PV_TIBIAL_PLATEAU_ORIF_LATERAL)
  Description: Tibial plateau fracture ORIF using a lateral approach and fixation strategy.
  Systems: LCP Tibial Plateau Plate, NCB Tibial Plateau Plate
- Variant: Bicondylar Dual-Incision Fixation (PV_TIBIAL_PLATEAU_ORIF_BICONDYLAR)
  Description: Tibial plateau fracture ORIF using dual-incision bicondylar fixation.
  Systems: LCP Tibial Plateau Plate, NCB Tibial Plateau Plate


### Anatomy: Patella (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_PATELLA)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Patella Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PATELLA_FRACTURE)
- Description: Open reduction and internal fixation of patella fracture.
- Aliases: Patella ORIF
- Variant: Tension Band Fixation (PV_PATELLA_ORIF_TENSION_BAND)
  Description: Patella fracture ORIF using tension band fixation.
  Systems: none linked
- Variant: Plate Fixation (PV_PATELLA_ORIF_PLATE)
  Description: Patella fracture ORIF using plate fixation.
  Systems: none linked


### Anatomy: Pelvis (ANAT_PELVIS)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Pubic Symphysis Diastasis (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PUBIC_SYMPHYSIS_DIASTASIS)
- Description: Fixation of anterior pelvic ring disruption.
- Variants: none linked

#### Procedure: Sacroiliac Screw Fixation (PROC_SACROILIAC_SCREW_FIXATION)
- Description: Percutaneous screw fixation of posterior pelvic ring.
- Variants: none linked


### Anatomy: Tibia (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_TIBIA)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Intramedullary Nailing of Tibial Shaft Fracture (PROC_INTRAMEDULLARY_NAILING_OF_TIBIAL_SHAFT_FRACTURE)
- Description: Intramedullary fixation of tibial shaft fracture.
- Variant: Suprapatellar Nailing (PV_TIBIAL_SHAFT_IM_SUPRAPATELLAR)
  Description: Tibial shaft fracture fixation using a suprapatellar intramedullary nailing approach.
  Systems: Expert Tibial Nail (ETN), T2 Tibial Nail
- Variant: Infrapatellar Nailing (PV_TIBIAL_SHAFT_IM_INFRAPATELLAR)
  Description: Tibial shaft fracture fixation using an infrapatellar intramedullary nailing approach.
  Systems: Expert Tibial Nail (ETN), T2 Tibial Nail

#### Procedure: Open Reduction and Internal Fixation of Distal Tibia Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_DISTAL_TIBIA_FRACTURE)
- Description: Open reduction and internal fixation of distal tibia fracture.
- Aliases: Distal Tibia ORIF
- Variant: Medial Approach (PV_DISTAL_TIBIA_ORIF_MEDIAL)
  Description: Distal tibia fracture ORIF through a medial approach.
  Systems: LCP Distal Tibia Plate
- Variant: Anterolateral Approach (PV_DISTAL_TIBIA_ORIF_ANTEROLATERAL)
  Description: Distal tibia fracture ORIF through an anterolateral approach.
  Systems: LCP Distal Tibia Plate


### Anatomy: Wrist (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_WRIST)
- Subanatomy: Whole Joint, Distal Radius, Radiocarpal Joint, Carpal Bones
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Open Reduction and Internal Fixation of Distal Radius Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_DISTAL_RADIUS_FRACTURE)
- Description: Open reduction and internal fixation of distal radius fracture.
- Aliases: Distal Radius ORIF
- Variant: Volar Plate Fixation (PV_DISTAL_RADIUS_ORIF_VOLAR)
  Description: Distal radius fracture ORIF using a volar plate.
  Systems: LCP Distal Radius Plate, VariAx Distal Radius Plate
- Variant: Dorsal / Dorsal Spanning Fixation (PV_DISTAL_RADIUS_ORIF_DORSAL)
  Description: Distal radius fracture ORIF using dorsal plating or dorsal spanning fixation.
  Systems: LCP Distal Radius Plate

#### Procedure: Open Reduction and Internal Fixation of Scaphoid Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_SCAPHOID_FRACTURE)
- Description: Open reduction and internal fixation of scaphoid fracture.
- Aliases: Scaphoid ORIF
- Variant: Volar Approach (PV_SCAPHOID_ORIF_VOLAR)
  Description: Scaphoid fracture ORIF through a volar approach.
  Systems: none linked
- Variant: Dorsal Approach (PV_SCAPHOID_ORIF_DORSAL)
  Description: Scaphoid fracture ORIF through a dorsal approach.
  Systems: none linked

#### Procedure: Percutaneous Fixation of Scaphoid Fracture (PROC_PERCUTANEOUS_FIXATION_OF_SCAPHOID_FRACTURE)
- Description: Percutaneous fixation of scaphoid fracture.
- Variant: Volar Percutaneous (PV_SCAPHOID_PERC_VOLAR)
  Description: Scaphoid fracture fixation using a volar percutaneous technique.
  Systems: none linked
- Variant: Dorsal Percutaneous (PV_SCAPHOID_PERC_DORSAL)
  Description: Scaphoid fracture fixation using a dorsal percutaneous technique.
  Systems: none linked


## Subspecialty: Paediatric Orthopaedics (SL_PAEDIATRIC_ORTHOPAEDIC_SURGERY)

### Anatomy: Hip (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_HIP)
- Subanatomy: Acetabulum, Whole Joint, Femoral Head, Femoral Neck, Proximal Femur
#### Procedure: Reduction of Developmental Dysplasia of Hip (PROC_REDUCTION_OF_DEVELOPMENTAL_DYSPLASIA_OF_HIP)
- Description: Operative reduction for developmental dysplasia of the hip.
- Variant: Closed Reduction (PV_DDH_CLOSED)
  Description: Developmental dysplasia of hip treated with closed reduction.
  Systems: none linked
- Variant: Open Reduction (PV_DDH_OPEN)
  Description: Developmental dysplasia of hip treated with open reduction.
  Systems: none linked


### Anatomy: Elbow (ANAT_ELBOW)
#### Procedure: Open Reduction and Internal Fixation of Paediatric Lateral Condyle Fracture (PROC_OPEN_REDUCTION_AND_INTERNAL_FIXATION_OF_PAEDIATRIC_LATERAL_CONDYLE_FRACTURE)
- Description: Fixation of paediatric lateral condyle fracture.
- Variants: none linked

#### Procedure: Open Reduction of Paediatric Radial Neck Fracture (PROC_OPEN_REDUCTION_OF_PAEDIATRIC_RADIAL_NECK_FRACTURE)
- Description: Operative treatment of paediatric radial neck fracture.
- Variants: none linked

#### Procedure: Percutaneous Pinning of Supracondylar Humerus Fracture (PROC_PERCUTANEOUS_PINNING_OF_SUPRACONDYLAR_HUMERUS_FRACTURE)
- Description: CRPP of paediatric supracondylar fracture.
- Variants: none linked


### Anatomy: Femur (ANAT_FEMUR)
#### Procedure: Elastic Intramedullary Nailing of Paediatric Femoral Fracture (PROC_ELASTIC_INTRAMEDULLARY_NAILING_OF_PAEDIATRIC_FEMORAL_FRACTURE)
- Description: Flexible nailing of paediatric femoral shaft fracture.
- Variants: none linked

#### Procedure: Femoral Derotation Osteotomy (PROC_FEMORAL_DEROTATION_OSTEOTOMY)
- Description: Corrective rotational osteotomy of femur.
- Variants: none linked

#### Procedure: Paediatric Proximal Femoral Epiphysiodesis (PROC_PAEDIATRIC_PROXIMAL_FEMORAL_EPIPHYSIODESIS)
- Description: Growth arrest/epiphysiodesis procedure.
- Variants: none linked

#### Procedure: Supracondylar Femoral Osteotomy in Cerebral Palsy (PROC_SUPRACONDYLAR_FEMORAL_OSTEOTOMY_IN_CEREBRAL_PALSY)
- Description: Distal femoral extension osteotomy.
- Variants: none linked

#### Procedure: Temporary Guided Growth of Distal Femur (PROC_TEMPORARY_GUIDED_GROWTH_OF_DISTAL_FEMUR)
- Description: Hemiepiphysiodesis of distal femur.
- Variants: none linked

#### Procedure: Varus Derotation Osteotomy of Femur (PROC_VARUS_DEROTATION_OSTEOTOMY_OF_FEMUR)
- Description: Proximal femoral varus derotation osteotomy.
- Aliases: VDRO
- Variants: none linked


### Anatomy: Foot (ANAT_FOOT)
#### Procedure: Calcaneal Lengthening Osteotomy in Paediatric Flatfoot (PROC_CALCANEAL_LENGTHENING_OSTEOTOMY_IN_PAEDIATRIC_FLATFOOT)
- Description: Evans-type osteotomy for flexible flatfoot.
- Variants: none linked

#### Procedure: Clubfoot Anterior Tibial Tendon Transfer (PROC_CLUBFOOT_ANTERIOR_TIBIAL_TENDON_TRANSFER)
- Description: Tendon transfer for relapsed clubfoot.
- Variants: none linked

#### Procedure: Clubfoot Posteromedial Release (PROC_CLUBFOOT_POSTEROMEDIAL_RELEASE)
- Description: Extensive soft-tissue release for clubfoot.
- Variants: none linked

#### Procedure: Ponseti Achilles Tenotomy (PROC_PONSETI_ACHILLES_TENOTOMY)
- Description: Percutaneous tenotomy for clubfoot treatment.
- Variants: none linked

#### Procedure: Vertical Talus Reconstruction (PROC_VERTICAL_TALUS_RECONSTRUCTION)
- Description: Operative reconstruction for congenital vertical talus.
- Variants: none linked


### Anatomy: Forearm (ANAT_FOREARM)
#### Procedure: Elastic Intramedullary Nailing of Paediatric Forearm Fracture (PROC_ELASTIC_INTRAMEDULLARY_NAILING_OF_PAEDIATRIC_FOREARM_FRACTURE)
- Description: Flexible nailing of radius/ulna fracture.
- Variants: none linked

#### Procedure: Paediatric Forearm Osteotomy (PROC_PAEDIATRIC_FOREARM_OSTEOTOMY)
- Description: Corrective osteotomy of radius/ulna in child.
- Variants: none linked


### Anatomy: Humerus (ANAT_HUMERUS)
#### Procedure: Paediatric Humeral Osteotomy (PROC_PAEDIATRIC_HUMERAL_OSTEOTOMY)
- Description: Corrective osteotomy of humerus in child.
- Variants: none linked


### Anatomy: Knee (ANAT_KNEE)
#### Procedure: Growth Plate Sparing ACL Reconstruction (PROC_GROWTH_PLATE_SPARING_ACL_RECONSTRUCTION)
- Description: Physeal-sparing ACL reconstruction in skeletally immature patient.
- Variants: none linked

#### Procedure: Paediatric Tibial Spine Avulsion Fixation (PROC_PAEDIATRIC_TIBIAL_SPINE_AVULSION_FIXATION)
- Description: Fixation of tibial spine avulsion fracture.
- Variants: none linked


### Anatomy: Lower Limb (ANAT_LOWER_LIMB)
#### Procedure: Limb Lengthening with External Fixator (PROC_LIMB_LENGTHENING_WITH_EXTERNAL_FIXATOR)
- Description: Distraction osteogenesis using external fixator.
- Variants: none linked

#### Procedure: Limb Lengthening with Intramedullary Device (PROC_LIMB_LENGTHENING_WITH_INTRAMEDULLARY_DEVICE)
- Description: Magnetic or motorized internal lengthening nail.
- Variants: none linked

#### Procedure: Open Achilles Lengthening in Cerebral Palsy (PROC_OPEN_ACHILLES_LENGTHENING_IN_CEREBRAL_PALSY)
- Description: Achilles lengthening for equinus contracture.
- Variants: none linked

#### Procedure: Semitendinosus Transfer in Cerebral Palsy (PROC_SEMITENDINOSUS_TRANSFER_IN_CEREBRAL_PALSY)
- Description: Tendon transfer/lengthening for gait correction.
- Variants: none linked

#### Procedure: Temporary Epiphysiodesis for Leg Length Discrepancy (PROC_TEMPORARY_EPIPHYSIODESIS_FOR_LEG_LENGTH_DISCREPANCY)
- Description: Growth modulation for limb length discrepancy.
- Variants: none linked

#### Procedure: Tendon Lengthening for Cerebral Palsy (PROC_TENDON_LENGTHENING_CP)
- Description: Soft tissue lengthening procedure for spastic deformity.
- Variants: none linked


### Anatomy: Pelvis (ANAT_PELVIS)
#### Procedure: Pelvic Osteotomy for Developmental Dysplasia of Hip (PROC_PELVIC_OSTEOTOMY_FOR_DEVELOPMENTAL_DYSPLASIA_OF_HIP)
- Description: Acetabular/pelvic osteotomy for DDH.
- Variants: none linked


### Anatomy: Spine (ANAT_SPINE)
#### Procedure: Definitive Posterior Spinal Fusion for Adolescent Idiopathic Scoliosis (PROC_DEFINITIVE_POSTERIOR_SPINAL_FUSION_FOR_ADOLESCENT_IDIOPATHIC_SCOLIOSIS)
- Description: Posterior deformity correction/fusion for AIS.
- Variants: none linked

#### Procedure: Growing Rod Revision Surgery (PROC_GROWING_ROD_REVISION_SURGERY)
- Description: Lengthening or revision of growing rod construct.
- Variants: none linked

#### Procedure: Magnetically Controlled Growing Rod Insertion (PROC_MAGNETICALLY_CONTROLLED_GROWING_ROD_INSERTION)
- Description: Insertion of MCGR for early onset scoliosis.
- Variants: none linked

#### Procedure: Vertical Expandable Prosthetic Titanium Rib Procedure (PROC_VERTICAL_EXPANDABLE_PROSTHETIC_TITANIUM_RIB_PROCEDURE)
- Description: Growth-friendly thoracic insufficiency procedure.
- Variants: none linked


### Anatomy: Tibia (ANAT_TIBIA)
#### Procedure: Elastic Stable Intramedullary Nailing of Paediatric Tibial Fracture (PROC_ELASTIC_STABLE_INTRAMEDULLARY_NAILING_OF_PAEDIATRIC_TIBIAL_FRACTURE)
- Description: Flexible nailing of paediatric tibia fracture.
- Variants: none linked

#### Procedure: Guided Growth for Blount Disease (PROC_GUIDED_GROWTH_FOR_BLOUNT_DISEASE)
- Description: Hemiepiphysiodesis for infantile/adolescent tibia vara.
- Variants: none linked

#### Procedure: Guided Growth for Genu Valgum (PROC_GUIDED_GROWTH_FOR_GENU_VALGUM)
- Description: Temporary hemiepiphysiodesis for genu valgum.
- Variants: none linked

#### Procedure: Guided Growth for Genu Varum (PROC_GUIDED_GROWTH_FOR_GENU_VARUM)
- Description: Temporary hemiepiphysiodesis for genu varum.
- Variants: none linked

#### Procedure: Tibial Derotation Osteotomy (PROC_TIBIAL_DEROTATION_OSTEOTOMY)
- Description: Corrective rotational osteotomy of tibia.
- Variants: none linked


### Anatomy: Wrist (ANAT_WRIST)
#### Procedure: Closed Reduction and Pinning of Paediatric Distal Radius Fracture (PROC_CLOSED_REDUCTION_AND_PINNING_OF_PAEDIATRIC_DISTAL_RADIUS_FRACTURE)
- Description: CRPP of paediatric distal radius fracture.
- Variants: none linked


### Anatomy: Upper Limb (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_UPPER_LIMB)
- Subanatomy: Shoulder, Clavicle, Scapula, Humerus, Elbow, Forearm, Wrist, Hand
- Procedures: none linked

### Anatomy: Femur (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_FEMUR)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Femoral Osteotomy (PROC_FEMORAL_OSTEOTOMY)
- Description: Corrective osteotomy of the femur.
- Variant: Varus Derotation Osteotomy (PV_FEMORAL_OSTEOTOMY_VDRO)
  Description: Femoral osteotomy performed as a varus derotation osteotomy.
  Systems: none linked
- Variant: Alternative Corrective Femoral Osteotomy (PV_FEMORAL_OSTEOTOMY_OTHER)
  Description: Femoral osteotomy performed for corrective alignment outside a standard VDRO pattern.
  Systems: none linked


### Anatomy: Hip (ANAT_HIP)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Closed Reduction of Developmental Dysplasia of Hip (PROC_CLOSED_REDUCTION_OF_DEVELOPMENTAL_DYSPLASIA_OF_HIP)
- Description: Closed reduction for DDH.
- Variants: none linked

#### Procedure: Femoral VDRO with Pelvic Osteotomy (PROC_FEMORAL_VDRO_WITH_PELVIC_OSTEOTOMY)
- Description: Combined varus derotation osteotomy and pelvic osteotomy.
- Variants: none linked

#### Procedure: In Situ Pinning of Slipped Capital Femoral Epiphysis (PROC_IN_SITU_PINNING_OF_SLIPPED_CAPITAL_FEMORAL_EPIPHYSIS)
- Description: Fixation of SCFE.
- Aliases: SCFE Pinning
- Variants: none linked

#### Procedure: Open Reduction and Femoral Osteotomy for DDH (PROC_OPEN_REDUCTION_AND_FEMORAL_OSTEOTOMY_FOR_DDH)
- Description: Combined open hip reduction and femoral osteotomy.
- Variants: none linked

#### Procedure: Open Reduction of Developmental Dysplasia of Hip (PROC_OPEN_REDUCTION_OF_DEVELOPMENTAL_DYSPLASIA_OF_HIP)
- Description: Open reduction for DDH.
- Variants: none linked

#### Procedure: Reduction of Developmental Dysplasia of Hip (PROC_REDUCTION_DDH)
- Description: Operative reduction for developmental dysplasia of the hip.
- Variants: none linked


### Anatomy: Lower Limb (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_LOWER_LIMB)
- Subanatomy: Hip and Pelvis, Femur, Knee, Tibia, Fibula, Ankle, Foot
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Hemiepiphysiodesis (PROC_HEMIEPIPHYSIODESIS)
- Description: Growth modulation procedure for angular deformity correction.
- Aliases: Guided Growth Procedure
- Variant: Tension-Band Plate Guided Growth (PV_HEMIEPIPHYSIODESIS_PLATE)
  Description: Hemiepiphysiodesis using a tension-band plate construct.
  Systems: none linked
- Variant: Transphyseal Screw Guided Growth (PV_HEMIEPIPHYSIODESIS_SCREW)
  Description: Hemiepiphysiodesis using a transphyseal screw technique.
  Systems: none linked

#### Procedure: Tendon Lengthening for Cerebral Palsy (PROC_TENDON_LENGTHENING_FOR_CEREBRAL_PALSY)
- Description: Soft tissue lengthening procedure for spastic deformity.
- Variant: Single-Event Multilevel Surgery (PV_CP_TENDON_LENGTHENING_SEMLS)
  Description: Tendon lengthening for cerebral palsy performed as part of SEMLS.
  Systems: none linked
- Variant: Isolated Tendon Lengthening (PV_CP_TENDON_LENGTHENING_ISOLATED)
  Description: Tendon lengthening for cerebral palsy performed as an isolated procedure.
  Systems: none linked


### Anatomy: Spine (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_SPINE)
- Subanatomy: Cervical Spine, Thoracic Spine, Lumbar Spine, Sacrum
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Paediatric Spinal Deformity Correction (PROC_PAEDIATRIC_SPINAL_DEFORMITY_CORRECTION)
- Description: Correction of paediatric spinal deformity.
- Variant: Growth-Friendly Instrumentation (PV_PAEDS_SPINE_GROWING_RODS)
  Description: Paediatric spinal deformity correction using growth-friendly constructs such as growing rods.
  Systems: none linked
- Variant: Definitive Posterior Fusion (PV_PAEDS_SPINE_DEFINITIVE)
  Description: Paediatric spinal deformity correction using definitive posterior fusion.
  Systems: none linked


### Anatomy: Tibia (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_TIBIA)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Tibial Osteotomy (PROC_TIBIAL_OSTEOTOMY)
- Description: Corrective osteotomy of the tibia.
- Variant: Left (VAR_LEFT)
  Description: Left-sided configuration where applicable
  Systems: Paediatric Osteotomy / Plate Portfolio, Paediatric Hip Portfolio, Guided Growth / PediPlates Portfolio, Paediatric Soft Tissue Portfolio
- Variant: Right (VAR_RIGHT)
  Description: Right-sided configuration where applicable
  Systems: Paediatric Osteotomy Portfolio, UK Paediatric Orthopaedic Distribution Portfolio, Paediatric Deformity Correction Portfolio, UK Paediatric Soft Tissue Distribution Portfolio, Paediatric Tibial Osteotomy Portfolio
- Variant: Proximal Tibial Osteotomy (PV_TIBIAL_OSTEOTOMY_PROXIMAL)
  Description: Tibial osteotomy performed proximally for deformity correction.
  Systems: none linked
- Variant: Distal Tibial Osteotomy (PV_TIBIAL_OSTEOTOMY_DISTAL)
  Description: Tibial osteotomy performed distally for deformity correction.
  Systems: none linked


## Subspecialty: Revision Arthroplasty (SL_REVISION_ARTHROPLASTY)

## Subspecialty: Shoulder & Elbow (SL_SHOULDER_AND_ELBOW_SURGERY)

### Anatomy: Shoulder (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_SHOULDER)
- Subanatomy: Whole Joint, Glenoid, Humeral Head, Proximal Humerus
#### Procedure: Arthroscopic Rotator Cuff Repair (PROC_ARTHROSCOPIC_ROTATOR_CUFF_REPAIR)
- Description: Arthroscopic repair of rotator cuff tear.
- Variant: Single-Row Repair (PV_RCR_SINGLE_ROW)
  Description: Arthroscopic rotator cuff repair using a single-row construct.
  Systems: FiberTak Anchor System, SwiveLock Anchor, Healix Advance Anchor, Q-FIX Suture Anchor
- Variant: Double-Row Repair (PV_RCR_DOUBLE_ROW)
  Description: Arthroscopic rotator cuff repair using a double-row construct.
  Systems: FiberTak Anchor System, SwiveLock Anchor, Healix Advance Anchor, Q-FIX Suture Anchor
- Variant: Suture-Bridge Repair (PV_RCR_SUTURE_BRIDGE)
  Description: Arthroscopic rotator cuff repair using a suture-bridge construct.
  Systems: FiberTak Anchor System, SwiveLock Anchor, Healix Advance Anchor, Q-FIX Suture Anchor

#### Procedure: Latarjet Procedure (PROC_LATARJET_PROCEDURE)
- Description: Coracoid transfer procedure for anterior shoulder instability.
- Variant: Open Latarjet (PV_LATARJET_OPEN)
  Description: Latarjet procedure performed through an open approach.
  Systems: none linked
- Variant: Arthroscopic-Assisted Latarjet (PV_LATARJET_ARTHROSCOPIC_ASSISTED)
  Description: Latarjet procedure performed with arthroscopic assistance.
  Systems: none linked

#### Procedure: Shoulder Stabilisation (PROC_SHOULDER_STABILISATION)
- Description: Operative stabilisation for recurrent shoulder instability.
- Variant: Arthroscopic Bankart Repair (PV_SHOULDER_STAB_ARTHROSCOPIC_BANKART)
  Description: Shoulder stabilisation using arthroscopic Bankart repair.
  Systems: FiberTak Anchor System, SwiveLock Anchor, Healix Advance Anchor
- Variant: Open Bankart / Capsular Shift (PV_SHOULDER_STAB_OPEN_BANKART)
  Description: Shoulder stabilisation using an open Bankart repair or capsular shift.
  Systems: FiberTak Anchor System, SwiveLock Anchor, Healix Advance Anchor

#### Procedure: Subacromial Decompression (PROC_SUBACROMIAL_DECOMPRESSION)
- Description: Decompression procedure for subacromial impingement.
- Variant: Single-Row (VAR_SINGLE_ROW)
  Description: Single-row anchor configuration
  Systems: AC TightRope / AC Joint Reconstruction, SpeedBridge / SwiveLock / FiberTak, Latarjet Instrumentation / Fixation Portfolio, Labral Repair / Glenoid Stabilisation Portfolio, Arthroscopic Burr / Resection Portfolio
- Variant: Double-Row (VAR_DOUBLE_ROW)
  Description: Double-row anchor configuration
  Systems: AC Joint Reconstruction Portfolio, HEALICOIL / Q-FIX / MULTIFIX, Latarjet Portfolio, Shoulder Instability Portfolio, Arthroscopy Resection Portfolio
- Variant: Arthroscopic Bursectomy and Acromioplasty (PV_SUBACROMIAL_DECOMPRESSION_STANDARD)
  Description: Subacromial decompression with arthroscopic bursectomy and acromioplasty.
  Systems: none linked
- Variant: Decompression with AC Joint Excision (PV_SUBACROMIAL_DECOMPRESSION_WITH_AC)
  Description: Subacromial decompression combined with distal clavicle excision.
  Systems: none linked


### Anatomy: Clavicle (ANAT_CLAVICLE)
#### Procedure: Acromioclavicular Joint Reconstruction (PROC_AC_JOINT_RECONSTRUCTION)
- Description: Reconstruction for acromioclavicular joint instability.
- Variants: none linked

#### Procedure: Acromioclavicular Joint TightRope Reconstruction (PROC_ACROMIOCLAVICULAR_JOINT_TIGHTROPE_RECONSTRUCTION)
- Description: Suspensory fixation for AC joint disruption.
- Variants: none linked


### Anatomy: Elbow (ANAT_ELBOW)
#### Procedure: Distal Biceps Reconstruction with Allograft (PROC_DISTAL_BICEPS_RECONSTRUCTION_WITH_ALLOGRAFT)
- Description: Allograft reconstruction of distal biceps tendon.
- Variants: none linked

#### Procedure: Distal Biceps Tendon Repair (PROC_DISTAL_BICEPS_TENDON_REPAIR)
- Description: Repair of distal biceps tendon rupture.
- Variants: none linked

#### Procedure: Elbow Arthroscopy (PROC_ELBOW_ARTHROSCOPY)
- Description: Diagnostic and therapeutic arthroscopy of the elbow.
- Variants: none linked

#### Procedure: Elbow Contracture Release (PROC_ELBOW_CONTRACTURE_RELEASE)
- Description: Open or arthroscopic release for elbow stiffness.
- Variants: none linked

#### Procedure: Elbow MCL Repair (PROC_ELBOW_MCL_REPAIR)
- Description: Repair of medial collateral ligament of elbow.
- Variants: none linked

#### Procedure: Elbow Osteocapsular Arthroplasty (PROC_ELBOW_OSTEOCAPSULAR_ARTHROPLASTY)
- Description: Open debridement arthroplasty for elbow arthritis.
- Variants: none linked

#### Procedure: Interposition Arthroplasty of Elbow (PROC_INTERPOSITION_ARTHROPLASTY_OF_ELBOW)
- Description: Interposition arthroplasty for elbow arthritis.
- Variants: none linked

#### Procedure: LUCL Reconstruction of Elbow (PROC_LUCL_RECONSTRUCTION_OF_ELBOW)
- Description: Lateral ulnar collateral ligament reconstruction.
- Variants: none linked

#### Procedure: Lateral Epicondyle Debridement (PROC_LATERAL_EPICONDYLE_DEBRIDEMENT)
- Description: Operative treatment of tennis elbow.
- Variants: none linked

#### Procedure: Medial Epicondyle Debridement (PROC_MEDIAL_EPICONDYLE_DEBRIDEMENT)
- Description: Operative treatment of golfer's elbow.
- Variants: none linked

#### Procedure: Olecranon Bursectomy (PROC_OLECRANON_BURSECTOMY)
- Description: Excision of olecranon bursa.
- Variants: none linked

#### Procedure: Posterior Interosseous Nerve Release (PROC_POSTERIOR_INTEROSSEOUS_NERVE_RELEASE)
- Description: Decompression of PIN.
- Variants: none linked

#### Procedure: Radial Tunnel Release (PROC_RADIAL_TUNNEL_RELEASE)
- Description: Decompression of posterior interosseous nerve/radial tunnel.
- Variants: none linked

#### Procedure: Revision Ulnar Nerve Transposition (PROC_REVISION_ULNAR_NERVE_TRANSPOSITION)
- Description: Revision cubital tunnel surgery with transposition.
- Variants: none linked

#### Procedure: Triceps Tendon Reconstruction (PROC_TRICEPS_TENDON_RECONSTRUCTION)
- Description: Reconstruction for chronic distal triceps insufficiency.
- Variants: none linked

#### Procedure: Triceps Tendon Repair at Elbow (PROC_TRICEPS_TENDON_REPAIR_AT_ELBOW)
- Description: Repair of distal triceps tendon rupture.
- Variants: none linked

#### Procedure: Ulnar Collateral Ligament Reconstruction of Elbow (PROC_ULNAR_COLLATERAL_LIGAMENT_RECONSTRUCTION_OF_ELBOW)
- Description: Tommy John / UCL reconstruction.
- Variants: none linked

#### Procedure: Ulnar Nerve Decompression at Elbow (PROC_ULNAR_NERVE_DECOMPRESSION)
- Description: Decompression of the ulnar nerve at the elbow.
- Aliases: Cubital Tunnel Decompression
- Variant: Arthroscopic (VAR_ARTHROSCOPIC)
  Description: Arthroscopic elbow approach
  Systems: Elbow Arthroscopy Portfolio, UK Elbow / Hand Distribution Portfolio


### Anatomy: Scapula (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_SCAPULA)
- Procedures: none linked

### Anatomy: Clavicle (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_CLAVICLE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Acromioclavicular Joint Reconstruction (PROC_ACROMIOCLAVICULAR_JOINT_RECONSTRUCTION)
- Description: Reconstruction for acromioclavicular joint instability.
- Variant: Hook Plate Reconstruction (PV_ACJ_RECON_HOOK_PLATE)
  Description: Acromioclavicular joint reconstruction using a hook plate construct.
  Systems: none linked
- Variant: Suspensory Fixation Reconstruction (PV_ACJ_RECON_SUSPENSORY)
  Description: Acromioclavicular joint reconstruction using suspensory fixation devices.
  Systems: TightRope ACL / AC System


### Anatomy: Elbow (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_ELBOW)
- Subanatomy: Whole Joint, Distal Humerus, Proximal Ulna, Radial Head
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Elbow Arthrolysis (PROC_ELBOW_ARTHROLYSIS)
- Description: Release procedure for stiff elbow.
- Variant: Open Arthrolysis (PV_ELBOW_ARTHROLYSIS_OPEN)
  Description: Elbow arthrolysis performed through an open approach.
  Systems: none linked
- Variant: Arthroscopic Arthrolysis (PV_ELBOW_ARTHROLYSIS_ARTHROSCOPIC)
  Description: Elbow arthrolysis performed arthroscopically.
  Systems: none linked

#### Procedure: Ulnar Nerve Decompression at Elbow (PROC_ULNAR_NERVE_DECOMPRESSION_AT_ELBOW)
- Description: Decompression of the ulnar nerve at the elbow.
- Aliases: Cubital Tunnel Decompression
- Variant: In-Situ Decompression (PV_ULNAR_NERVE_IN_SITU)
  Description: Ulnar nerve decompression performed in situ at the elbow.
  Systems: none linked
- Variant: Anterior Transposition (PV_ULNAR_NERVE_TRANSPOSITION)
  Description: Ulnar nerve decompression with anterior transposition.
  Systems: none linked


### Anatomy: Shoulder (ANAT_SHOULDER)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Arthroscopic Acromioplasty (PROC_ARTHROSCOPIC_ACROMIOPLASTY)
- Description: Arthroscopic acromioplasty/decompression.
- Variants: none linked

#### Procedure: Arthroscopic Bankart Repair (PROC_ARTHROSCOPIC_BANKART_REPAIR)
- Description: Arthroscopic labral repair for anterior instability.
- Variants: none linked

#### Procedure: Arthroscopic Capsular Shift of Shoulder (PROC_ARTHROSCOPIC_CAPSULAR_SHIFT_OF_SHOULDER)
- Description: Capsular plication/capsular shift for instability.
- Variants: none linked

#### Procedure: Arthroscopic Labral Repair of Shoulder (PROC_ARTHROSCOPIC_LABRAL_REPAIR_OF_SHOULDER)
- Description: Labral repair for shoulder instability.
- Variants: none linked

#### Procedure: Arthroscopic Posterior Capsulolabral Shift (PROC_ARTHROSCOPIC_POSTERIOR_CAPSULOLABRAL_SHIFT)
- Description: Capsulolabral repair for posterior instability.
- Variants: none linked

#### Procedure: Arthroscopic Posterior Labral Repair of Shoulder (PROC_ARTHROSCOPIC_POSTERIOR_LABRAL_REPAIR_OF_SHOULDER)
- Description: Repair of posterior labral tear.
- Variants: none linked

#### Procedure: Biceps Tenodesis (PROC_BICEPS_TENODESIS)
- Description: Fixation of long head of biceps to humerus.
- Variants: none linked

#### Procedure: Biceps Tenotomy (PROC_BICEPS_TENOTOMY)
- Description: Release of long head of biceps tendon.
- Variants: none linked

#### Procedure: Capsular Release for Frozen Shoulder (PROC_CAPSULAR_RELEASE_FOR_FROZEN_SHOULDER)
- Description: Arthroscopic capsular release for adhesive capsulitis.
- Variants: none linked

#### Procedure: Distal Clavicle Excision (PROC_DISTAL_CLAVICLE_EXCISION)
- Description: Excision of distal clavicle for AC pain.
- Variants: none linked

#### Procedure: Distal Clavicle Resection (PROC_DISTAL_CLAVICLE_RESECTION)
- Description: Resection arthroplasty of AC joint.
- Variants: none linked

#### Procedure: Glenoid Fracture Fixation (PROC_GLENOID_FRACTURE_FIXATION)
- Description: ORIF of glenoid fracture.
- Variants: none linked

#### Procedure: Latissimus Dorsi Tendon Transfer to Shoulder (PROC_LATISSIMUS_DORSI_TENDON_TRANSFER_TO_SHOULDER)
- Description: Tendon transfer for irreparable cuff tear.
- Variants: none linked

#### Procedure: Lower Trapezius Tendon Transfer to Shoulder (PROC_LOWER_TRAPEZIUS_TENDON_TRANSFER_TO_SHOULDER)
- Description: Tendon transfer for posterosuperior cuff deficiency.
- Variants: none linked

#### Procedure: Open Bankart Repair (PROC_OPEN_BANKART_REPAIR)
- Description: Open stabilization procedure for anterior instability.
- Variants: none linked

#### Procedure: Open Rotator Cuff Repair (PROC_OPEN_ROTATOR_CUFF_REPAIR)
- Description: Open repair of rotator cuff tear.
- Variants: none linked

#### Procedure: Partial Rotator Cuff Repair (PROC_PARTIAL_ROTATOR_CUFF_REPAIR)
- Description: Partial repair of massive cuff tear.
- Variants: none linked

#### Procedure: Partial Thickness Rotator Cuff Repair (PROC_PARTIAL_THICKNESS_ROTATOR_CUFF_REPAIR)
- Description: Repair of partial articular or bursal-sided cuff tear.
- Variants: none linked

#### Procedure: Patch Augmented Rotator Cuff Repair (PROC_PATCH_AUGMENTED_ROTATOR_CUFF_REPAIR)
- Description: Rotator cuff repair with biologic/synthetic patch augmentation.
- Variants: none linked

#### Procedure: Pectoralis Major Tendon Repair (PROC_PECTORALIS_MAJOR_TENDON_REPAIR)
- Description: Repair of pectoralis major rupture.
- Variants: none linked

#### Procedure: Pectoralis Minor Release (PROC_PECTORALIS_MINOR_RELEASE)
- Description: Soft tissue release around coracoid/pectoralis minor.
- Variants: none linked

#### Procedure: Remplissage Procedure (PROC_REMPLISSAGE_PROCEDURE)
- Description: Capsulotenodesis for engaging Hill-Sachs lesion.
- Variants: none linked

#### Procedure: SLAP Repair (PROC_SLAP_REPAIR)
- Description: Superior labrum anterior-posterior repair.
- Variants: none linked

#### Procedure: Scapular Spine Fracture Fixation (PROC_SCAPULAR_SPINE_FRACTURE_FIXATION)
- Description: ORIF of scapular spine fracture.
- Variants: none linked

#### Procedure: Scapulothoracic Bursectomy (PROC_SCAPULOTHORACIC_BURSECTOMY)
- Description: Arthroscopic or open bursectomy for snapping scapula.
- Variants: none linked

#### Procedure: Subpectoral Biceps Tenodesis (PROC_SUBPECTORAL_BICEPS_TENODESIS)
- Description: Open subpectoral fixation of long head biceps.
- Variants: none linked

#### Procedure: Superior Capsular Reconstruction (PROC_SUPERIOR_CAPSULAR_RECONSTRUCTION)
- Description: Reconstruction for irreparable rotator cuff tear.
- Aliases: SCR
- Variants: none linked

#### Procedure: Suprapectoral Biceps Tenodesis (PROC_SUPRAPECTORAL_BICEPS_TENODESIS)
- Description: Arthroscopic or mini-open suprapectoral tenodesis.
- Variants: none linked


## Subspecialty: Spine (SL_SPINE_SURGERY)

### Anatomy: Cervical Spine (ANAT_CERVICAL_SPINE)
#### Procedure: Anterior Cervical Corpectomy and Fusion (PROC_ANTERIOR_CERVICAL_CORPECTOMY_AND_FUSION)
- Description: ACCF procedure.
- Aliases: ACCF
- Variants: none linked

#### Procedure: C1-C2 Fusion (PROC_C1_C2_FUSION)
- Description: Atlantoaxial fusion procedure.
- Variants: none linked

#### Procedure: Cervical Disc Arthroplasty (PROC_CERVICAL_DISC_ARTHROPLASTY)
- Description: Cervical total disc replacement.
- Variants: none linked

#### Procedure: Cervical Laminoforaminotomy (PROC_CERVICAL_LAMINOFORAMINOTOMY)
- Description: Posterior cervical foraminal decompression.
- Variants: none linked

#### Procedure: Cervical Laminoplasty (PROC_CERVICAL_LAMINOPLASTY)
- Description: Motion-preserving decompression via laminoplasty.
- Variants: none linked

#### Procedure: Cervicothoracic Fusion (PROC_CERVICOTHORACIC_FUSION)
- Description: Long fusion across cervicothoracic junction.
- Variants: none linked

#### Procedure: Multilevel ACDF (PROC_MULTILEVEL_ACDF)
- Description: Two or more level anterior cervical discectomy and fusion.
- Variants: none linked

#### Procedure: Occipitocervical Fusion (PROC_OCCIPITOCERVICAL_FUSION)
- Description: Fusion from occiput to upper cervical spine.
- Variants: none linked

#### Procedure: Posterior Cervical Decompression and Fusion (PROC_POSTERIOR_CERVICAL_DECOMPRESSION_AND_FUSION)
- Description: Posterior cervical laminectomy/fusion.
- Variants: none linked

#### Procedure: Posterior Cervical Foraminotomy (PROC_POSTERIOR_CERVICAL_FORAMINOTOMY)
- Description: Posterior decompression for cervical radiculopathy.
- Variants: none linked

#### Procedure: Posterior Cervical Fusion (PROC_POSTERIOR_CERVICAL_FUSION)
- Description: Posterior instrumented cervical fusion.
- Variants: none linked


### Anatomy: Lumbar Spine (ANAT_LUMBAR_SPINE)
#### Procedure: Anterior Lumbar Interbody Fusion (PROC_ANTERIOR_LUMBAR_INTERBODY_FUSION)
- Description: ALIF procedure.
- Aliases: ALIF
- Variants: none linked

#### Procedure: Lateral Lumbar Interbody Fusion (PROC_LATERAL_LUMBAR_INTERBODY_FUSION)
- Description: LLIF / XLIF-style lateral lumbar fusion.
- Aliases: LLIF
- Variants: none linked

#### Procedure: Lumbar Corpectomy and Reconstruction (PROC_LUMBAR_CORPECTOMY_AND_RECONSTRUCTION)
- Description: Corpectomy with cage/rod reconstruction.
- Variants: none linked

#### Procedure: Lumbar Disc Arthroplasty (PROC_LUMBAR_DISC_ARTHROPLASTY)
- Description: Lumbar total disc replacement.
- Variants: none linked

#### Procedure: Lumbar Facetectomy and Fusion (PROC_LUMBAR_FACETECTOMY_AND_FUSION)
- Description: Decompression with facetectomy and fusion.
- Variants: none linked

#### Procedure: Lumbar Foraminotomy (PROC_LUMBAR_FORAMINOTOMY)
- Description: Decompression of lumbar neural foramen.
- Variants: none linked

#### Procedure: Lumbar Laminectomy (PROC_LUMBAR_LAMINECTOMY)
- Description: Open lumbar decompression via laminectomy.
- Variants: none linked

#### Procedure: Lumbar Microdiscectomy (PROC_LUMBAR_MICRODISCECTOMY)
- Description: Minimally invasive lumbar discectomy.
- Variants: none linked

#### Procedure: Minimally Invasive TLIF (PROC_MINIMALLY_INVASIVE_TLIF)
- Description: MIS transforaminal lumbar interbody fusion.
- Variants: none linked

#### Procedure: Posterior Instrumented Fusion for Spondylolisthesis (PROC_POSTERIOR_INSTRUMENTED_FUSION_FOR_SPONDYLOLISTHESIS)
- Description: Instrumented lumbar fusion for spondylolisthesis.
- Variants: none linked

#### Procedure: Posterior Lumbar Interbody Fusion (PROC_POSTERIOR_LUMBAR_INTERBODY_FUSION)
- Description: PLIF procedure.
- Aliases: PLIF
- Variants: none linked

#### Procedure: Posterolateral Lumbar Fusion (PROC_POSTEROLATERAL_LUMBAR_FUSION)
- Description: Posterolateral instrumented lumbar fusion.
- Variants: none linked

#### Procedure: Revision Lumbar Fusion (PROC_REVISION_LUMBAR_FUSION)
- Description: Revision surgery for failed lumbar fusion.
- Variants: none linked

#### Procedure: Revision TLIF (PROC_REVISION_TLIF)
- Description: Revision transforaminal lumbar interbody fusion.
- Variants: none linked

#### Procedure: Stand-Alone ALIF (PROC_STAND_ALONE_ALIF)
- Description: Anterior lumbar interbody fusion with stand-alone cage.
- Variants: none linked

#### Procedure: Transforaminal Lumbar Interbody Fusion (PROC_TRANSFORAMINAL_LUMBAR_INTERBODY_FUSION)
- Description: TLIF procedure.
- Aliases: TLIF
- Variants: none linked


### Anatomy: Spine (ANAT_SPINE)
#### Procedure: Adjunct Bone Morphogenetic Protein Use in Spinal Fusion (PROC_ADJUNCT_BONE_MORPHOGENETIC_PROTEIN_USE_IN_SPINAL_FUSION)
- Description: Biologic adjunct to spinal fusion.
- Variants: none linked

#### Procedure: Balloon Kyphoplasty with Cement Augmentation (PROC_BALLOON_KYPHOPLASTY_WITH_CEMENT_AUGMENTATION)
- Description: Balloon-assisted vertebral augmentation.
- Variants: none linked

#### Procedure: Expandable Cage Reconstruction After Corpectomy (PROC_EXPANDABLE_CAGE_RECONSTRUCTION_AFTER_CORPECTOMY)
- Description: Vertebral body replacement with expandable cage.
- Variants: none linked

#### Procedure: Growing Rod Insertion for Early Onset Scoliosis (PROC_GROWING_ROD_INSERTION_FOR_EARLY_ONSET_SCOLIOSIS)
- Description: Traditional or magnetically controlled growing rod construct.
- Variants: none linked

#### Procedure: Growing Rod Lengthening Procedure (PROC_GROWING_ROD_LENGTHENING_PROCEDURE)
- Description: Planned lengthening of growth-friendly construct.
- Variants: none linked

#### Procedure: Hemivertebra Excision and Fusion (PROC_HEMIVERTEBRA_EXCISION_AND_FUSION)
- Description: Congenital deformity correction with hemivertebra excision.
- Variants: none linked

#### Procedure: Iliosacral Pelvic Fixation in Spine Deformity (PROC_ILIOSACRAL_PELVIC_FIXATION_IN_SPINE_DEFORMITY)
- Description: Pelvic fixation for deformity constructs.
- Variants: none linked

#### Procedure: Minimally Invasive Lumbar Decompression (PROC_MINIMALLY_INVASIVE_LUMBAR_DECOMPRESSION)
- Description: Tubular or MIS decompression procedure.
- Variants: none linked

#### Procedure: Navigation-Assisted Pedicle Screw Instrumentation (PROC_NAVIGATION_ASSISTED_PEDICLE_SCREW_INSTRUMENTATION)
- Description: Instrumented spine surgery using navigation / robotics.
- Variants: none linked

#### Procedure: Navigation-Guided Sacroiliac Fusion (PROC_NAVIGATION_GUIDED_SACROILIAC_FUSION)
- Description: SI fusion using navigation.
- Variants: none linked

#### Procedure: Pelvic Fixation with Iliac Screws (PROC_PELVIC_FIXATION_WITH_ILIAC_SCREWS)
- Description: Long-construct pelvic fixation.
- Variants: none linked

#### Procedure: Percutaneous Pedicle Screw Fixation (PROC_PERCUTANEOUS_PEDICLE_SCREW_FIXATION)
- Description: Percutaneous posterior spinal fixation.
- Variants: none linked

#### Procedure: Revision Pseudarthrosis Repair of Spine Fusion (PROC_REVISION_PSEUDARTHROSIS_REPAIR_OF_SPINE_FUSION)
- Description: Revision surgery for pseudarthrosis after fusion.
- Variants: none linked

#### Procedure: Revision Scoliosis Instrumentation (PROC_REVISION_SCOLIOSIS_INSTRUMENTATION)
- Description: Revision deformity surgery with instrumentation exchange.
- Variants: none linked

#### Procedure: Robotic-Assisted Spinal Fusion (PROC_ROBOTIC_ASSISTED_SPINAL_FUSION)
- Description: Spinal fusion using robotic guidance.
- Variants: none linked

#### Procedure: Sacroiliac Joint Fusion (PROC_SACROILIAC_JOINT_FUSION)
- Description: Fusion of sacroiliac joint.
- Aliases: SI Joint Fusion
- Variants: none linked

#### Procedure: Schwab Grade 3 Pedicle Subtraction Osteotomy (PROC_SCHWAB_GRADE_3_PEDICLE_SUBTRACTION_OSTEOTOMY)
- Description: Three-column osteotomy for sagittal correction.
- Variants: none linked

#### Procedure: Spinal Cord Stimulator Permanent Implantation (PROC_SPINAL_CORD_STIMULATOR_PERMANENT_IMPLANTATION)
- Description: Permanent SCS implantation.
- Variants: none linked

#### Procedure: Spinal Cord Stimulator Trial Lead Placement (PROC_SPINAL_CORD_STIMULATOR_TRIAL_LEAD_PLACEMENT)
- Description: Trial placement for neuromodulation.
- Variants: none linked

#### Procedure: Spinopelvic Fixation (PROC_SPINOPELVIC_FIXATION)
- Description: Long construct fixation to pelvis.
- Variants: none linked

#### Procedure: Vertebral Body Tether Revision (PROC_VERTEBRAL_BODY_TETHER_REVISION)
- Description: Revision of anterior vertebral body tether.
- Variants: none linked

#### Procedure: Vertebral Body Tethering (PROC_VERTEBRAL_BODY_TETHERING)
- Description: Anterior vertebral body tethering for scoliosis.
- Aliases: VBT
- Variants: none linked

#### Procedure: Vertebral Column Resection for Deformity (PROC_VERTEBRAL_COLUMN_RESECTION_FOR_DEFORMITY)
- Description: Three-column osteotomy / vertebral column resection.
- Variants: none linked


### Anatomy: Thoracic Spine (ANAT_THORACIC_SPINE)
#### Procedure: Thoracic Corpectomy and Reconstruction (PROC_THORACIC_CORPECTOMY_AND_RECONSTRUCTION)
- Description: Thoracic vertebral body resection with reconstruction.
- Variants: none linked

#### Procedure: Thoracic Decompression (PROC_THORACIC_DECOMPRESSION)
- Description: Decompression in thoracic spine.
- Variants: none linked

#### Procedure: Thoracic Instrumented Fusion (PROC_THORACIC_INSTRUMENTED_FUSION)
- Description: Posterior thoracic spinal fusion.
- Variants: none linked

#### Procedure: Thoracic Laminectomy (PROC_THORACIC_LAMINECTOMY)
- Description: Open thoracic decompression laminectomy.
- Variants: none linked

#### Procedure: Thoracolumbar Junction Fracture Stabilisation (PROC_THORACOLUMBAR_JUNCTION_FRACTURE_STABILISATION)
- Description: Instrumentation for thoracolumbar fracture.
- Variants: none linked


### Anatomy: Sacrum (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_SACRUM)
- Procedures: none linked

### Anatomy: Cervical Spine (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_CERVICAL_SPINE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Cervical Decompression (PROC_CERVICAL_DECOMPRESSION)
- Description: Cervical decompression procedure for neural element compression.
- Variant: Anterior Cervical Decompression / Corpectomy (PV_CERVICAL_DECOMPRESSION_ANTERIOR)
  Description: Cervical decompression performed through an anterior approach.
  Systems: none linked
- Variant: Posterior Cervical Decompression (PV_CERVICAL_DECOMPRESSION_POSTERIOR)
  Description: Cervical decompression performed through a posterior approach.
  Systems: none linked

#### Procedure: Cervical Discectomy and Fusion (PROC_CERVICAL_DISCECTOMY_AND_FUSION)
- Description: Anterior cervical discectomy and fusion.
- Aliases: ACDF
- Variant: Single-Level ACDF (PV_ACDF_SINGLE)
  Description: Cervical discectomy and fusion performed at a single level.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System
- Variant: Multilevel ACDF (PV_ACDF_MULTI)
  Description: Cervical discectomy and fusion performed across multiple levels.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System


### Anatomy: Lumbar Spine (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_LUMBAR_SPINE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Lumbar Decompression (PROC_LUMBAR_DECOMPRESSION)
- Description: Posterior decompression procedure in the lumbar spine.
- Variant: Open Laminectomy / Decompression (PV_LUMBAR_DECOMPRESSION_OPEN)
  Description: Lumbar decompression performed as an open laminectomy or decompression.
  Systems: none linked
- Variant: Unilateral Laminotomy for Bilateral Decompression (PV_LUMBAR_DECOMPRESSION_ULBD)
  Description: Lumbar decompression performed through a unilateral laminotomy approach.
  Systems: none linked

#### Procedure: Lumbar Discectomy (PROC_LUMBAR_DISCECTOMY)
- Description: Removal of lumbar disc material compressing a neural structure.
- Variant: Open Microdiscectomy (PV_LUMBAR_DISCECTOMY_MICRO)
  Description: Lumbar discectomy performed as an open microdiscectomy.
  Systems: none linked
- Variant: Endoscopic Discectomy (PV_LUMBAR_DISCECTOMY_ENDOSCOPIC)
  Description: Lumbar discectomy performed endoscopically.
  Systems: none linked

#### Procedure: Lumbar Spinal Fusion (PROC_LUMBAR_SPINAL_FUSION)
- Description: Fusion of lumbar spinal segments.
- Aliases: Lumbar Fusion
- Variant: Posterolateral Fusion (PV_LUMBAR_FUSION_POSTEROLATERAL)
  Description: Lumbar spinal fusion performed as a posterolateral fusion.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System
- Variant: Transforaminal Lumbar Interbody Fusion (TLIF) (PV_LUMBAR_FUSION_TLIF)
  Description: Lumbar spinal fusion performed as a transforaminal lumbar interbody fusion.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System
- Variant: Anterior Lumbar Interbody Fusion (ALIF) (PV_LUMBAR_FUSION_ALIF)
  Description: Lumbar spinal fusion performed as an anterior lumbar interbody fusion.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System


### Anatomy: Spine (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_SPINE)
- Subanatomy: Cervical Spine, Thoracic Spine, Lumbar Spine, Sacrum
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Kyphoplasty (PROC_KYPHOPLASTY)
- Description: Balloon-assisted vertebral body augmentation.
- Variant: Unipedicular Kyphoplasty (PV_KYPHOPLASTY_UNIPEDICULAR)
  Description: Kyphoplasty performed through a unipedicular access route.
  Systems: Stryker Kyphon Balloon
- Variant: Bipedicular Kyphoplasty (PV_KYPHOPLASTY_BIPEDICULAR)
  Description: Kyphoplasty performed through a bipedicular access route.
  Systems: Stryker Kyphon Balloon

#### Procedure: Scoliosis Correction and Fusion (PROC_SCOLIOSIS_CORRECTION_AND_FUSION)
- Description: Corrective deformity surgery with spinal fusion.
- Variant: Posterior-Only Correction and Fusion (PV_SCOLIOSIS_POSTERIOR_ONLY)
  Description: Scoliosis correction and fusion performed through a posterior-only strategy.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System
- Variant: Combined Anterior and Posterior Correction and Fusion (PV_SCOLIOSIS_COMBINED)
  Description: Scoliosis correction and fusion performed with combined anterior and posterior procedures.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System

#### Procedure: Vertebroplasty (PROC_VERTEBROPLASTY)
- Description: Cement augmentation of vertebral body fracture.
- Variant: Unipedicular Vertebroplasty (PV_VERTEBROPLASTY_UNIPEDICULAR)
  Description: Vertebroplasty performed through a unipedicular access route.
  Systems: none linked
- Variant: Bipedicular Vertebroplasty (PV_VERTEBROPLASTY_BIPEDICULAR)
  Description: Vertebroplasty performed through a bipedicular access route.
  Systems: none linked


### Anatomy: Thoracic Spine (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_THORACIC_SPINE)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Thoracolumbar Fusion (PROC_THORACOLUMBAR_FUSION)
- Description: Fusion across thoracolumbar spinal segments.
- Variant: Open (VAR_OPEN)
  Description: Open spinal approach
  Systems: Pilon Fusion / TTC Fusion Portfolio, Ankle Arthroscopy Portfolio, APEX 3D Total Ankle Replacement System, Flatfoot Reconstruction / Tendon Transfer Portfolio, First MTP Fusion Portfolio, Bunion / Hallux Valgus Correction Portfolio, Achilles Midsubstance SpeedBridge, Subtalar Fusion Portfolio, Hindfoot / Triple Fusion Portfolio, Midfoot Fusion Portfolio, Elbow Arthroscopy / Release Portfolio, Peripheral Nerve / Hand Surgery Portfolio, Cervical Decompression Portfolio, Prestige / Divergence / ACDF Portfolio, Lumbar Decompression Portfolio, Lumbar Decompression / Discectomy Portfolio, CD Horizon / Catalyft Lumbar Fusion Portfolio, Kyphon / Kyphoplasty Portfolio, Deformity / Scoliosis Fusion Portfolio, Vertebral Augmentation Portfolio, Thoracolumbar Fusion Portfolio
- Variant: Minimally Invasive (VAR_MIS)
  Description: Minimally invasive spinal approach
  Systems: Cervical Decompression Portfolio, Xtend / Coalition ACDF Portfolio, Lumbar Decompression Portfolio, Lumbar Discectomy Portfolio, Creo / SABLE Lumbar Fusion Portfolio, Kyphoplasty Portfolio, Deformity / Scoliosis Fusion Portfolio, Vertebral Augmentation Portfolio, Thoracolumbar Fusion Portfolio
- Variant: Open Posterior Fusion (PV_THORACOLUMBAR_FUSION_OPEN)
  Description: Thoracolumbar fusion performed through an open posterior approach.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System
- Variant: Minimally Invasive Percutaneous Fusion (PV_THORACOLUMBAR_FUSION_MIS)
  Description: Thoracolumbar fusion performed using minimally invasive percutaneous techniques.
  Systems: Expedium Spine System, CD HORIZON LEGACY Spine, Solera Spine System, Sequoia Spine System, Armada Spine System


## Subspecialty: Sports & Knee (SL_SPORTS_AND_KNEE_SURGERY)

### Anatomy: Knee (ANAT_KNEE)
#### Procedure: All-Inside Anterior Cruciate Ligament Reconstruction (PROC_ALL_INSIDE_ANTERIOR_CRUCIATE_LIGAMENT_RECONSTRUCTION)
- Description: All-inside ACL reconstruction technique.
- Variants: none linked

#### Procedure: Anterior Cruciate Ligament Reconstruction (PROC_ACL_RECONSTRUCTION)
- Description: Reconstruction of the anterior cruciate ligament.
- Aliases: ACL Reconstruction
- Variants: none linked

#### Procedure: Anterior Cruciate Ligament Reconstruction with LET (PROC_ANTERIOR_CRUCIATE_LIGAMENT_RECONSTRUCTION_WITH_LET)
- Description: ACL reconstruction combined with lateral extra-articular tenodesis.
- Variants: none linked

#### Procedure: Arthroscopic Lateral Release of Patella (PROC_ARTHROSCOPIC_LATERAL_RELEASE_OF_PATELLA)
- Description: Arthroscopic lateral retinacular release.
- Variants: none linked

#### Procedure: Arthroscopic Loose Body Removal from Knee (PROC_ARTHROSCOPIC_LOOSE_BODY_REMOVAL_FROM_KNEE)
- Description: Removal of loose body via knee arthroscopy.
- Variants: none linked

#### Procedure: Arthroscopic Notchplasty of Knee (PROC_ARTHROSCOPIC_NOTCHPLASTY_OF_KNEE)
- Description: Arthroscopic notchplasty.
- Variants: none linked

#### Procedure: Arthroscopic Removal of Cyclops Lesion (PROC_ARTHROSCOPIC_REMOVAL_OF_CYCLOPS_LESION)
- Description: Arthroscopic removal of cyclops lesion after ACL.
- Variants: none linked

#### Procedure: Arthroscopic Synovectomy of Knee (PROC_ARTHROSCOPIC_SYNOVECTOMY_OF_KNEE)
- Description: Arthroscopic synovectomy for inflammatory or proliferative disease.
- Variants: none linked

#### Procedure: Autologous Chondrocyte Implantation of Knee (PROC_AUTOLOGOUS_CHONDROCYTE_IMPLANTATION_OF_KNEE)
- Description: Cartilage restoration procedure using autologous chondrocytes.
- Aliases: ACI
- Variants: none linked

#### Procedure: Autologous Matrix-Induced Chondrogenesis of Knee (PROC_AUTOLOGOUS_MATRIX_INDUCED_CHONDROGENESIS_OF_KNEE)
- Description: Scaffold-assisted marrow stimulation.
- Variants: none linked

#### Procedure: BioCartilage Augmentation of Knee (PROC_BIOCARTILAGE_AUGMENTATION_OF_KNEE)
- Description: Biologic augmentation of cartilage repair.
- Variants: none linked

#### Procedure: Bone Patellar Tendon Bone ACL Reconstruction (PROC_BONE_PATELLAR_TENDON_BONE_ACL_RECONSTRUCTION)
- Description: ACL reconstruction using BTB autograft.
- Variants: none linked

#### Procedure: Combined ACL and Anterolateral Ligament Reconstruction (PROC_COMBINED_ACL_AND_ANTEROLATERAL_LIGAMENT_RECONSTRUCTION)
- Description: Combined ACL/ALL reconstruction.
- Variants: none linked

#### Procedure: Discoid Meniscus Saucerization (PROC_DISCOID_MENISCUS_SAUCERIZATION)
- Description: Saucerization for symptomatic discoid meniscus.
- Variants: none linked

#### Procedure: Distal Femoral Osteotomy (PROC_DISTAL_FEMORAL_OSTEOTOMY)
- Description: Varus-producing distal femoral osteotomy.
- Aliases: DFO
- Variants: none linked

#### Procedure: Hamstring Autograft ACL Reconstruction (PROC_HAMSTRING_AUTOGRAFT_ACL_RECONSTRUCTION)
- Description: ACL reconstruction using hamstring autograft.
- Variants: none linked

#### Procedure: High Tibial Osteotomy (PROC_HIGH_TIBIAL_OSTEOTOMY)
- Description: Valgus-producing proximal tibial osteotomy.
- Aliases: HTO
- Variants: none linked

#### Procedure: Inside-Out Meniscal Repair (PROC_INSIDE_OUT_MENISCAL_REPAIR)
- Description: Meniscal repair using inside-out technique.
- Variants: none linked

#### Procedure: Knee Manipulation Under Anaesthesia (PROC_KNEE_MANIPULATION_UNDER_ANAESTHESIA)
- Description: Manipulation for postoperative stiffness.
- Aliases: MUA Knee
- Variants: none linked

#### Procedure: Lateral Extra-Articular Tenodesis (PROC_LATERAL_EXTRA_ARTICULAR_TENODESIS)
- Description: Adjunct lateral extra-articular tenodesis with ACL surgery.
- Aliases: LET
- Variants: none linked

#### Procedure: Lateral Meniscal Root Repair (PROC_LATERAL_MENISCAL_ROOT_REPAIR)
- Description: Repair of posterior or anterior lateral meniscal root.
- Variants: none linked

#### Procedure: Matrix-Induced Chondrogenesis of Knee (PROC_MATRIX_INDUCED_CHONDROGENESIS_OF_KNEE)
- Description: Cartilage repair using scaffold-augmented marrow stimulation.
- Aliases: AMIC
- Variants: none linked

#### Procedure: Medial Collateral Ligament Reconstruction of Knee (PROC_MEDIAL_COLLATERAL_LIGAMENT_RECONSTRUCTION_OF_KNEE)
- Description: Reconstruction of medial collateral ligament.
- Aliases: MCL Reconstruction
- Variants: none linked

#### Procedure: Medial Meniscal Root Repair (PROC_MEDIAL_MENISCAL_ROOT_REPAIR)
- Description: Repair of medial meniscal root tear.
- Variants: none linked

#### Procedure: Medial Patellofemoral Ligament Reconstruction (PROC_MEDIAL_PATELLOFEMORAL_LIGAMENT_RECONSTRUCTION)
- Description: Reconstruction of the MPFL for patellar instability.
- Aliases: MPFL Reconstruction
- Variants: none linked

#### Procedure: Meniscal Allograft Transplantation (PROC_MENISCAL_ALLOGRAFT_TRANSPLANTATION)
- Description: Meniscal transplantation for symptomatic meniscal deficiency.
- Variants: none linked

#### Procedure: Meniscal Centralization Procedure (PROC_MENISCAL_CENTRALIZATION_PROCEDURE)
- Description: Centralization of extruded meniscus.
- Variants: none linked

#### Procedure: Microfracture of Knee (PROC_MICROFRACTURE_OF_KNEE)
- Description: Arthroscopic marrow stimulation for cartilage lesion.
- Variants: none linked

#### Procedure: Multi-Ligament Knee Repair (PROC_MULTI_LIGAMENT_KNEE_REPAIR)
- Description: Repair/reconstruction of multiple knee ligaments.
- Variants: none linked

#### Procedure: Osteochondral Allograft Transplantation of Knee (PROC_OSTEOCHONDRAL_ALLOGRAFT_TRANSPLANTATION_OF_KNEE)
- Description: Open osteochondral allograft transplantation.
- Variants: none linked

#### Procedure: Osteochondral Repair of Knee (PROC_OSTEOCHONDRAL_REPAIR_KNEE)
- Description: Repair of focal osteochondral defect of the knee.
- Variants: none linked

#### Procedure: Outside-In Meniscal Repair (PROC_OUTSIDE_IN_MENISCAL_REPAIR)
- Description: Meniscal repair using outside-in technique.
- Variants: none linked

#### Procedure: Partial Lateral Meniscectomy (PROC_PARTIAL_LATERAL_MENISCECTOMY)
- Description: Resection of torn lateral meniscus portion.
- Variants: none linked

#### Procedure: Partial Medial Meniscectomy (PROC_PARTIAL_MEDIAL_MENISCECTOMY)
- Description: Resection of torn medial meniscus portion.
- Variants: none linked

#### Procedure: Particulated Juvenile Cartilage Implantation (PROC_PARTICULATED_JUVENILE_CARTILAGE_IMPLANTATION)
- Description: Cartilage defect resurfacing using juvenile cartilage allograft.
- Variants: none linked

#### Procedure: Patellar Tendon Repair (PROC_PATELLAR_TENDON_REPAIR)
- Description: Repair of patellar tendon rupture.
- Variants: none linked

#### Procedure: Plica Excision of Knee (PROC_PLICA_EXCISION_OF_KNEE)
- Description: Arthroscopic plica resection.
- Variants: none linked

#### Procedure: Posterior Capsule Release of Knee (PROC_POSTERIOR_CAPSULE_RELEASE_OF_KNEE)
- Description: Arthroscopic/open posterior capsular release for stiffness.
- Variants: none linked

#### Procedure: Posterior Cruciate Ligament Augmentation (PROC_POSTERIOR_CRUCIATE_LIGAMENT_AUGMENTATION)
- Description: Augmentation of partial PCL injury.
- Variants: none linked

#### Procedure: Posterior Cruciate Ligament Reconstruction (PROC_PCL_RECONSTRUCTION)
- Description: Reconstruction of the posterior cruciate ligament.
- Aliases: PCL Reconstruction
- Variants: none linked

#### Procedure: Posterior Horn Repair of Lateral Meniscus (PROC_POSTERIOR_HORN_REPAIR_OF_LATERAL_MENISCUS)
- Description: Focused repair of posterior horn lateral meniscus.
- Variants: none linked

#### Procedure: Posterior Horn Repair of Medial Meniscus (PROC_POSTERIOR_HORN_REPAIR_OF_MEDIAL_MENISCUS)
- Description: Focused repair of posterior horn medial meniscus.
- Variants: none linked

#### Procedure: Posterolateral Corner Reconstruction of Knee (PROC_POSTEROLATERAL_CORNER_RECONSTRUCTION_OF_KNEE)
- Description: Reconstruction of knee posterolateral corner.
- Aliases: PLC Reconstruction
- Variants: none linked

#### Procedure: Posteromedial Corner Reconstruction of Knee (PROC_POSTEROMEDIAL_CORNER_RECONSTRUCTION_OF_KNEE)
- Description: Reconstruction of posteromedial corner.
- Variants: none linked

#### Procedure: Quadriceps Tendon Autograft ACL Reconstruction (PROC_QUADRICEPS_TENDON_AUTOGRAFT_ACL_RECONSTRUCTION)
- Description: ACL reconstruction using quadriceps tendon autograft.
- Variants: none linked

#### Procedure: Quadriceps Tendon Repair (PROC_QUADRICEPS_TENDON_REPAIR)
- Description: Repair of quadriceps tendon rupture.
- Variants: none linked

#### Procedure: Revision Anterior Cruciate Ligament Reconstruction (PROC_REVISION_ANTERIOR_CRUCIATE_LIGAMENT_RECONSTRUCTION)
- Description: Revision ACL reconstruction.
- Variants: none linked

#### Procedure: Synovectomy of Knee (PROC_SYNOVECTOMY_OF_KNEE)
- Description: Arthroscopic or open knee synovectomy.
- Variants: none linked

#### Procedure: Tibial Tubercle Osteotomy (PROC_TIBIAL_TUBERCLE_OSTEOTOMY)
- Description: Realignment osteotomy of tibial tubercle.
- Aliases: TTO
- Variants: none linked

#### Procedure: Trochlear Osteochondral Allograft Reconstruction (PROC_TROCHLEAR_OSTEOCHONDRAL_ALLOGRAFT_RECONSTRUCTION)
- Description: Allograft reconstruction of trochlear osteochondral defect.
- Variants: none linked

#### Procedure: Trochleoplasty (PROC_TROCHLEOPLASTY)
- Description: Trochlear groove deepening procedure for instability.
- Variants: none linked


### Anatomy: Patella (ANAT_PATELLA)
#### Procedure: Fresh Osteochondral Allograft Transplantation of Patella (PROC_FRESH_OSTEOCHONDRAL_ALLOGRAFT_TRANSPLANTATION_OF_PATELLA)
- Description: Patellar osteochondral allograft transplantation.
- Variants: none linked

#### Procedure: Medial Patellofemoral Ligament Repair (PROC_MEDIAL_PATELLOFEMORAL_LIGAMENT_REPAIR)
- Description: Repair of MPFL for instability.
- Variants: none linked


### Anatomy: Knee (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_KNEE)
- Subanatomy: Patella, Whole Joint, Distal Femur, Proximal Tibia, Patellofemoral Joint, Medial Compartment, Lateral Compartment
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Anterior Cruciate Ligament Reconstruction (PROC_ANTERIOR_CRUCIATE_LIGAMENT_RECONSTRUCTION)
- Description: Reconstruction of the anterior cruciate ligament.
- Aliases: ACL Reconstruction
- Variant: Hamstring Autograft (PV_ACL_HAMSTRING)
  Description: ACL reconstruction using a hamstring autograft.
  Systems: Endobutton CL, TightRope ACL / AC System, RigidFix Cross-Pin System
- Variant: Bone-Patellar Tendon-Bone Autograft (PV_ACL_BTB)
  Description: ACL reconstruction using a bone-patellar tendon-bone autograft.
  Systems: Endobutton CL, TightRope ACL / AC System
- Variant: Quadriceps Tendon Autograft (PV_ACL_QUADRICEPS)
  Description: ACL reconstruction using a quadriceps tendon autograft.
  Systems: Endobutton CL, TightRope ACL / AC System

#### Procedure: Diagnostic Knee Arthroscopy (PROC_DIAGNOSTIC_KNEE_ARTHROSCOPY)
- Description: Diagnostic arthroscopy of the knee.
- Variant: Standard Anteromedial / Anterolateral Portals (PV_DIAGNOSTIC_KNEE_STANDARD)
  Description: Diagnostic knee arthroscopy using standard anterior portals.
  Systems: none linked
- Variant: Standard Portals with Accessory Posterior Portals (PV_DIAGNOSTIC_KNEE_EXTENDED)
  Description: Diagnostic knee arthroscopy using standard anterior portals with accessory posterior portals.
  Systems: none linked

#### Procedure: Meniscal Repair (PROC_MENISCAL_REPAIR)
- Description: Repair of meniscal tear.
- Variant: Inside-Out Repair (PV_MENISCAL_REPAIR_INSIDE_OUT)
  Description: Meniscal repair performed using an inside-out technique.
  Systems: none linked
- Variant: All-Inside Repair (PV_MENISCAL_REPAIR_ALL_INSIDE)
  Description: Meniscal repair performed using an all-inside technique.
  Systems: FastFix 360 Meniscal Repair, Meniscal Cinch Repair
- Variant: Meniscal Root Repair (PV_MENISCAL_REPAIR_ROOT)
  Description: Meniscal root repair using transtibial or equivalent fixation.
  Systems: FastFix 360 Meniscal Repair, Meniscal Cinch Repair

#### Procedure: Multiligament Knee Reconstruction (PROC_MULTILIGAMENT_KNEE_RECONSTRUCTION)
- Description: Reconstruction of multiple injured knee ligaments.
- Variant: Single-Stage Reconstruction (PV_MULTILIGAMENT_SINGLE_STAGE)
  Description: Multiligament knee reconstruction performed in a single stage.
  Systems: none linked
- Variant: Staged Reconstruction (PV_MULTILIGAMENT_STAGED)
  Description: Multiligament knee reconstruction performed in staged procedures.
  Systems: none linked

#### Procedure: Osteochondral Repair of Knee (PROC_OSTEOCHONDRAL_REPAIR_OF_KNEE)
- Description: Repair of focal osteochondral defect of the knee.
- Variant: Microfracture (PV_OSTEOCHONDRAL_MICROFRACTURE)
  Description: Osteochondral repair of the knee using microfracture.
  Systems: none linked
- Variant: OATS / Mosaicplasty (PV_OSTEOCHONDRAL_OATS)
  Description: Osteochondral repair of the knee using osteochondral autograft transfer.
  Systems: none linked
- Variant: Cell-Based Cartilage Repair (PV_OSTEOCHONDRAL_CELL_BASED)
  Description: Osteochondral repair of the knee using a cell-based or scaffold-assisted technique.
  Systems: none linked

#### Procedure: Partial Meniscectomy (PROC_PARTIAL_MENISCECTOMY)
- Description: Arthroscopic resection of damaged meniscal tissue.
- Variant: Medial Meniscectomy (PV_PARTIAL_MENISCECTOMY_MEDIAL)
  Description: Partial meniscectomy of the medial meniscus.
  Systems: none linked
- Variant: Lateral Meniscectomy (PV_PARTIAL_MENISCECTOMY_LATERAL)
  Description: Partial meniscectomy of the lateral meniscus.
  Systems: none linked

#### Procedure: Posterior Cruciate Ligament Reconstruction (PROC_POSTERIOR_CRUCIATE_LIGAMENT_RECONSTRUCTION)
- Description: Reconstruction of the posterior cruciate ligament.
- Aliases: PCL Reconstruction
- Variant: Single-Bundle Reconstruction (PV_PCL_SINGLE_BUNDLE)
  Description: PCL reconstruction using a single-bundle technique.
  Systems: none linked
- Variant: Double-Bundle Reconstruction (PV_PCL_DOUBLE_BUNDLE)
  Description: PCL reconstruction using a double-bundle technique.
  Systems: none linked


### Anatomy: Patella (ANAT_SPEC_TRAUMA_AND_ORTHOPAEDIC_SURGERY_PATELLA)
- Note: Procedure anatomy present in data but not currently mapped in service_line_anatomy_map.
#### Procedure: Patellofemoral Stabilisation (PROC_PATELLOFEMORAL_STABILISATION)
- Description: Operative stabilisation for recurrent patellar instability.
- Variant: Soft Tissue Fixation (VAR_SOFT_TISSUE)
  Description: Soft tissue fixation configuration
  Systems: ACL TightRope / GraftLink / FiberTag System, 4K Arthroscopy / Scope System, FiberStitch / Meniscal Repair System, Multiligament Knee Reconstruction Portfolio, BioCartilage / Chondral Repair Portfolio, Arthroscopic Resection / Meniscectomy Portfolio, PCL TightRope / Button Fixation Portfolio, MPFL / Patellar Stabilisation Portfolio
- Variant: Bone-Tunnel / Bony Fixation (VAR_BONY_FIXATION)
  Description: Bony fixation configuration
  Systems: ULTRABUTTON / BIOSURE / ACL Portfolio, Arthroscopy Visualization / Pump System, FAST-FIX Meniscal Repair System, Knee Ligament Portfolio, Cartilage Repair Portfolio, Werewolf / Meniscectomy Portfolio, PCL Reconstruction Portfolio, Patellar Stabilisation Portfolio
- Variant: Isolated MPFL Reconstruction (PV_PATELLOFEMORAL_MPFL)
  Description: Patellofemoral stabilisation using isolated MPFL reconstruction.
  Systems: none linked
- Variant: MPFL Reconstruction with Tibial Tubercle Osteotomy (PV_PATELLOFEMORAL_MPFL_TTO)
  Description: Patellofemoral stabilisation combining MPFL reconstruction with tibial tubercle osteotomy.
  Systems: none linked

