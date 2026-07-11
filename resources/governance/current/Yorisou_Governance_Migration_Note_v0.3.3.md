# Yorisou Governance Migration Note v0.3.3

**Status:** Approved  
**Approved Date:** 2026-07-11  
**Owner / Approver:** Edward

## What v0.3.3 is

v0.3.3 is an evidence amendment release on top of the approved v0.3.1 pack. It does not rewrite doctrine. It adds three documents and appends a "v0.3.3 Evidence Amendment (2026-07-11)" section to six existing documents so that no active document leaves runtime/harness implementation attribution in a state that conflicts with the verified implementation.

## Amendment mechanism

- Existing approved documents keep their canonical filenames and full original text. The appended amendment section takes precedence over conflicting runtime-implementation wording inside the same document.
- New in v0.3.3: `Yorisou_Current_Implementation_Baseline_v0.3.3.md` (authoritative statuses), `Yorisou_Founder_Decision_Record_v0.3.3.md`, and this migration note.
- Amended in v0.3.3: `Yorisou_Agent_Skill_OpenClaw_and_Hermes_Governance_v0.3.md`, `Yorisou_Project_Constitution_v0.3.1.md`, `Yorisou_Technical_Architecture_and_Execution_Protocol_v0.3.1.md`, `Yorisou_AI_Native_Product_and_Agent_Capability_Map_v0.3.1.md`, `Yorisou_Business_Model_and_Platform_Architecture_Doctrine_v0.3.1.md`, `Yorisou_Agent_Operating_System_Execution_Blueprint_v0.3.md`, plus the pack `README.md` index.

## Precedence order

1. `Yorisou_Current_Implementation_Baseline_v0.3.3.md`
2. v0.3.3 Evidence Amendment sections inside amended documents
3. Original v0.3.x document bodies

## Replacement instructions (ChatGPT Project Resources)

1. Remove all current YORISOU Project Resource files.
2. Upload the complete v0.3.3 replacement package contents (all Markdown files listed in `RESOURCE_MANIFEST.md` of the package).
3. Verify file count and `SHA256SUMS.txt` before use.
4. Do not keep any v0.3.1-only copy active beside the v0.3.3 set.

## Runtime integrity

The repository runtime validates this pack via `lib/server/agent-runtime/governance-checksums.json` and `lib/server/agent-runtime/governanceResources.ts`. Any file change in `resources/governance/current/` must ship with regenerated checksums in the same pull request.
