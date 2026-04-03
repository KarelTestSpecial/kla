# 📜 Project-specifiek Protocol: Maestro & Conductor Bridge

Dit document dient als de centrale "wet" voor de interactie tussen de Maestro Orchestrator en de Conductor Project Manager binnen dit project.

## 🤝 Samenwerkingsregels
1. **Orchestratie**: Maestro is de primaire orchestrator voor technische taken en de aansturing van sub-agents.
2. **Projectstructuur**: Conductor beheert de overkoepelende projectstructuur ("tracks"). Alle project-gerelateerde status en plannen worden centraal opgeslagen in de `conductor/` map.
3. **State Directory**: De Maestro state directory is vastgelegd op `conductor/maestro`. Dit zorgt ervoor dat beide extensies binnen dezelfde sandbox opereren.

## 🛡️ Policy & Plan Mode Protocol
Om "Policy Denials" en blokkades in Plan Mode te voorkomen:
- Plannen worden **altijd** eerst geschreven naar het tijdelijke pad van Maestro: `~/.gemini/tmp/kla/plans/plan.md`.
- Pas na goedkeuring (`exit_plan_mode`) worden de plannen door de orchestrator verplaatst naar de definitieve locatie in `conductor/maestro/plans/`.
- Gebruik **geen** directe schrijfacties naar de root of `conductor/` directory zolang de CLI in Plan Mode staat.

## 🏗️ Architectuur Status (Maart 2026)
- **Actieve Engine**: Athena V9 (`~/0-IT/4-pj/x-v9/`).
- **Showcase**: De oude `0-it/2-productie/athena` map is een **bevroren showcase** en mag niet meer voor actieve ontwikkeling worden gebruikt.

---
*Vastgelegd door KDClaw voor een conflictvrije workflow.*
