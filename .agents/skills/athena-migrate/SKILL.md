# 🚜 Athena Factory Migration Skill

## Description
This skill automates the migration of a local site from the **Kla Workspace** (`~/kla/sites/`) to the **Athena V9 Active Factory** (`~/0-IT/4-pj/x-v9/athena/sites/`), including GitHub synchronization (Subtree Push) and Archival in the **Vault**.

## Workflow
1. **Pre-Migration Check**: Ensure the site is complete and the `athena-config.json` is correctly set for V9.2.
2. **Execution**: Run the `scripts/athena-migrate.sh` script to perform the move and the GitHub push.
3. **GitHub Sync**: The script handles the dual-push (Monorepo commit + individual Site Repo subtree push).
4. **Vault Archival**: Post-migration, the site is promoted to the permanent **Vault** storage using the forklift `push.sh`.

## Tool Usage
### athena-migrate.sh
- Purpose: Move source to factory and push to GitHub.
- Args: `site_name` (e.g. `kdclaw-premium-v9`).
- Features: Handles organizational repo creation and subtree pushing.

### forklift push.sh
- Purpose: Move factory site to cold-storage Vault.
- Args: `site_name` and optionally `--yes` for auto-confirmation.

## Troubleshooting
- **Permission Errors**: Ensure the `gh auth` is set to `athenacmsfactory` when creating repositories in the `athenasitesy` organization.
- **Path Mismatch**: Verify the `athena/` and `vault/` paths exist in the `x-v9` root.

---
*Created for the KDClaw Athena Factory ecosystem.*
