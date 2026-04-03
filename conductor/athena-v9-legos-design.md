# Design: Athena V9 Legoblokken (Batch 1)

## 🎯 Doelstelling
Het ontwikkelen van een eerste set modulaire, herbruikbare UI-secties ("legoblokken") voor de Athena V9 engine. Deze blokken moeten visueel geinspecteerd kunnen worden in een dedicated playground in de `werkplaats`.

## 🏛️ Architectuur Standaarden
- **Framework**: React 19 (Server Components ready).
- **Styling**: Tailwind CSS v4 (CSS-first approach).
- **Data Model**: Dual-Data (Mock JSON vs Engine Props).
- **Taal**: Alle CMS-velden zijn in het Nederlands (bv. `hoofdtitel`, `actie_knop_tekst`).
- **Interactie**: `Shift + Click` activatie voor de Athena Dock editor.

## 📦 Component Specificaties

### 1. HeroLegoV9
- **Velden**: `hoofdtitel`, `ondertitel`, `knop_tekst`, `knop_link`, `achtergrond_afbeelding`.
- **Layout**: Centraal uitgelijnd met een subtiele overlay voor tekstleesbaarheid.

### 2. BenefitsLegoV9
- **Velden**: `sectie_titel`, `voordelen` (Array van: `icoon`, `titel`, `tekst`).
- **Layout**: Grid van 3 of 4 kolommen, responsief naar 1 kolom op mobiel.

### 3. FeatureLegoV9
- **Velden**: `titel`, `beschrijving`, `afbeelding_url`, `afbeelding_positie` (links/rechts).
- **Layout**: Split-view met visuele balans tussen tekst en beeld.

## 🛠️ Visualisatie Strategie (The Playground)
- **Locatie**: `~/0-IT/4-pj/x-v9/werkplaats/athena-v9-playground/`
- **Preview**: Een Vite dev server op poort 5173.
- **Inspectie**: Automatische screenshots van elk nieuw blok op Desktop en Mobiel.

## ✅ Acceptatie Criteria
- [ ] Componenten renderen zonder errors in React 19.
- [ ] Tailwind v4 utility classes worden correct toegepast.
- [ ] Alle data-velden zijn correct gekoppeld aan de mock-data.
- [ ] Visuele inspectie via screenshots is succesvol.
