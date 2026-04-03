# 📜 Project-specifiek Protocol: KDClaw Workspace (Kla)

Dit document dient als de centrale **Master Index** en de "wet" voor de interactie tussen KDClaw, de AI-agent en de Athena Factory.

## 🤝 Samenwerking & Architectuur
1. **Developer Skills**: DevOps en migratie-instructies bevinden zich in `.agents/skills/`. Gebruik de `athena-migrate` skill voor site-lifecycles.
2. **Backend Features**: Aanvullende server-side functies en dynamische tools zijn te vinden in `server/skills/`.
3. **Core Knowledge**: De commerciële USPs, prijsstrategieën en technische blauwdrukken worden bewaard in `server/memory/ATHENA_KNOWLEDGE.md`.

## 🏗️ Architectuur Status (Maart 2026)
- **Actieve Engine**: Athena V9 (`~/0-IT/4-pj/x-v9/athena`).
- **Werkplaats**: Root-level symlink `~/0-IT/4-pj/x-v9/werkplaats` wijst naar de actieve `athena/sites`.
- **Kla Workspace**: `~/kla` is de primaire sandbox voor nieuwe sites.
- **Vault (Cold Storage)**: Archiveer-locatie in `~/0-IT/4-pj/x-v9/vault`.

## 🛡️ Policy & Plan Mode Protocol
Om "Policy Denials" en blokkades in Plan Mode te voorkomen:
- Plannen worden **altijd** eerst geschreven naar het tijdelijke pad van Maestro: `~/.gemini/tmp/kla/plans/plan.md`.
- Pas na goedkeuring (`exit_plan_mode`) worden de plannen door de orchestrator verplaatst naar de definitieve locatie in `conductor/maestro/plans/`.
- Gebruik **geen** directe schrijfacties naar de root of `conductor/` directory zolang de CLI in Plan Mode staat.

## 🚀 Factorkraan (Migration Skill)
Gebruik de skill in `~/kla/.agents/skills/athena-migrate/` voor de volledige lifecycle van een site:
1. **Migratie**: Van `~/kla` naar de Factory (`athena/sites`).
2. **GitHub Sync**: Monorepo push + Subtree push naar de `athenasitesy` organisatie.
3. **Parking**: Gebruik de gemoderniseerde `push.sh` in `control/forklift/` om sites naar de **Vault** te parkeren.

---
*Vastgelegd door KDClaw voor een conflictvrije en autonome workflow.*
