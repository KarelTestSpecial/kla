# 🧠 Athena CMS Factory - Kenniscentrum voor KDClaw

Dit document bevat de commerciële en technische kernwaarden van de Athena CMS Factory. KDClaw gebruikt dit om sites te genereren die perfect aansluiten bij de verkoopstrategie.

---

## 💎 Unieke Verkoopargumenten (USPs)
1.  **Google Sheets CMS**: De klant beheert zijn eigen content via een vertrouwde interface (Google Sheets). Geen ingewikkeld dashboard nodig.
2.  **Extreme Snelheid**: Levering van een professionele site binnen 24-48 uur.
3.  **Vaste Lage Prijs**: Duidelijke pakketten (750€ / 1495€ / 2495€) zonder verborgen maandelijkse kosten.
4.  **Zero-Maintenance**: Statische hosting (GitHub Pages) betekent geen updates, geen hacks, geen serverkosten voor de klant.
5.  **AI-Gedreven Content**: Automatische generatie van SEO-teksten en sector-specifieke beelden.

---

## 🛠️ Technische Blueprints (V9-Generatie / ACTUEEL)
*   **Architectuur**: React + Tailwind v4 + "Lego Edition" Componenten.
*   **Data-Pipeline**: .
*   **Engine Locatie**: .

## 🛠️ Technische Blueprints (y1-Generatie / LEGACY)
*   **Architectuur**: Vite + React + TailwindCSS.
*   **Data-Pipeline**: `Google Sheet -> JSON -> Vite Build -> GitHub Pages`.
*   **Engine Locatie**: `~/0-IT/3-DEV/y1/y/factory/factory/5-engine/`.

---

## 📈 Prijs- en Doelgroepstrategie
*   **Starter (750€)**: Voor freelancers en eenmanszaken (One-page).
*   **Professional (1495€)**: Voor KMO's, Horeca en Beauty (Multi-section, Visuele editor).
*   **Business (2495€)**: Voor webshops en meertalige bedrijven (Mollie integratie, Meertalig).

---

## 🚀 Operationele Commando's voor KDClaw
| Taak | Commando (relatief aan engine) |
|:---|:---|
| Nieuwe Site | `node 5-engine/wizards/site-wizard.js` |
| Sheet Koppelen | `node 5-engine/auto-sheet-provisioner.js [name] [email]` |
| Data Synchroniseren | `node 5-engine/sync-sheet-to-json.js [name]` |
| Site Rebuilden | `node 5-engine/rebuild-site.js [name]` |
| Deployen | `node 5-engine/sync-monorepo-to-github.js [name]` |

---
*Dit document is de basis voor de autonomie van KDClaw v1.0.*
