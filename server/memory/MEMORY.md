# KDClaw MEMORY: The Persistent Context

## 1. Contextual Timeline
- **Start Date**: March 2026.
- **Environment**: Chromebook (Debian 12), pnpm, Vite, Gemini 3.1 Pro.
- **Project**: KDClaw v1.0.

## 2. Active Projects & Gigs
- ~/0-IT/4-pj/x-v9/

## 3. Resilience Insights
- User history of FPC Gent and 1997 misdiagnosis (Schizophrenia) recognized.
- My user is currently in the **Re-integration Phase**.
- KDClaw acts as a protective shield and professional multiplier.

## 4. Skills & Factory Progress
- `[x]` Backend Engine Setup (KDClaw Core)
- `[x]` Athena v9.2 "Lego Edition" Integration (Tailwind v4 Support Added)
- `[x]` Safe Sandbox Architecture (Werkplaats vs Vault)
- `[x]` Forklift v2.0: Automated transport with CLI flags (`-y`, `-p`).

## 5. Persistent Identity (Brand Name: KDClaw)
- KDClaw is a partner for **Professional Growth**.
- Athena CMS Factory Expert (v9.2 Evolution Standard).
- Guardian of the **Money to make Money** vision.

## 6. Technical Sovereignty (Standardized Workflow)
- **Status Update (March 2026)**: The previous production environment `0-it/2-productie/athena` is now a **FROZEN SHOWCASE**. All active development happens in the V9 environment (`~/0-IT/4-pj/x-v9/`).
- **Engine v9.2**: Entry point is `node 9-engine/cli.js`. Uses "Lego v9.2 Standard" (`useLego`, `bindProps`).
- **Sandbox**: Work happens in `~/0-IT/4-pj/x-v9/y/werkplaats/`, symlinked to `factory/sites/`.
- **Vault (Kluis)**: `~/0-IT/4-pj/x-v9/vault/` is the "Gold Master". No direct AI access.
- **Build Protocol**: Sites must be built (`pnpm build`) before promotion to the Vault to fix MIME/JSX errors on GitHub Pages.
- **Aggregator**: Use `9-engine/v9-aggregate.js` to sync multiple JSONs into `all_data.json`.

## 7. Infrastructure Health
- **CI/CD**: `athena-publisher.yml` renamed and active in the monorepo.
- **Library**: `9-library` patched for relative pathing and production stability.
- **GitHub**: Deployment target is the `athenasitesy` organization via SSH alias `github-athena`.

## 8. Development Insights (Vite 8 & React 19)
- **JSX Configuration**: Vite 8 with Oxc/Rolldown requires an explicit `jsconfig.json` with `"jsx": "react-jsx"` to avoid "Invalid key jsx" errors during transformation.
- **Plugin Management**: `@vitejs/plugin-react-oxc` (v0.x) is the current high-performance standard for the V9.2 stack, though it is being merged back into the core React plugin.
- **Base Paths**: GitHub Pages deployment requires `base: '/repo-name/'` in `vite.config.js` for project-site repositories.

## 9. Site Lifecycle & Migration (Factorkraan)
- **Standard**: Sites are developed in `~/kla/sites/` (Sandbox) and migrated to `~/0-IT/4-pj/x-v9/athena/sites/` (Factory).
- **Automation**: Use the `athena-migrate` skill (`~/kla/.agents/skills/athena-migrate/`) for the full migration and subtree push process.
- **Auth Switching**: Create organizational repositories (`athenasitesy`) by switching GH accounts: `gh auth switch -h github.com -u athenacmsfactory`.
- **Archival**: Always "park" a version in the **Vault** (`x-v9/vault/`) using the modernized `push.sh` forklift script.
