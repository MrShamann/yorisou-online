# Yorisou Persona Asset Storage Standard

## Purpose
This storage standard exists so manually generated Yorisou persona images can be saved in stable local paths before being approved and wired into the product.

The folders here are for governed storage only. They are not the product UI, and they do not change scoring, routing, or result logic.

## Manual Insertion Workflow
1. Generate an image manually using ChatGPT Image or another approved image tool.
2. Save the file into the correct local folder.
3. Use the exact filename convention below.
4. Run the asset validation script.
5. Review mobile crop, framing, and result/share-card fit.
6. Only after approval, update the registry status from `fallback_css` to `approved_static`.

## Asset Classes
Use exactly these canonical asset classes:
- `portrait`
- `crest`
- `result_hero`
- `share_accent`
- `oracle_motif`
- `motion_seed`

## Canonical Folders
Use exactly these canonical folders:
- `public/assets/yorisou/personas/portraits`
- `public/assets/yorisou/personas/crests`
- `public/assets/yorisou/personas/result-heroes`
- `public/assets/yorisou/personas/share-accents`
- `public/assets/yorisou/personas/oracle-motifs`
- `public/assets/yorisou/video-thumbnails`

## Naming Pattern
Use this naming pattern:

`PXX_romaji_assetclass_gYY_variant_vZZ.ext`

Examples:
- `P01_kebaiyomi_portrait_g00_core_v01.png`
- `P01_kebaiyomi_crest_g00_core_v01.svg`
- `P01_kebaiyomi_result_hero_g00_core_v01.png`
- `P01_kebaiyomi_share_accent_g00_core_v01.png`
- `P01_kebaiyomi_oracle_motif_g00_core_v01.svg`
- `P01_kebaiyomi_motion_seed_g00_core_v01.png`

## Generation Slot Model
Use exactly these generation slots:
- `g00_core`
- `g01_mode_calm`
- `g02_mode_active`
- `g03_mode_opening`
- `g04_line_scene`
- `g05_group_scene`
- `g06_solitude_scene`
- `g07_work_decision_scene`
- `g08_seasonal_campaign`
- `g09_premium_deep_report`

## Approval States
Use exactly these approval states:
- `fallback_css`
- `manual_candidate`
- `needs_review`
- `approved_static`
- `rejected`

## P0 Persona Batch Order
1. `P01_kebaiyomi`
2. `P07_kirigiri`
3. `P09_koraekomi`
4. `P11_dandori`
5. `P02_hitsuke`
6. `P03_shizumoe`
7. `P19_anshinmachi` optional

## Hard Prohibitions
Do not store:
- secrets
- provider keys
- raw prompt experiments as canonical truth
- unreviewed random generations as approved assets
- copyrighted anime/IP-derived images
- shrine/temple imitation assets
- Western stock-looking default portraits
- childish mascot assets
- images with burned-in text unless explicitly approved
