# 🏗️ Athena CMS Factory: Repository Architectuur

Dit document beschrijft de structurele verbondenheid tussen de lokale ontwikkelomgeving op de Chromebook en de GitHub-infrastructuren.

---

## 🎨 Visueel Overzicht (Architectuur)

```mermaid
graph TD
    subgraph "💻 LOKALE CHROMEOBOOK"
        V9_DEV["~/0-IT/4-pj/x-v9/ (ACTUEEL)"]
        Y1_DEV["~/0-IT/3-DEV/y1/"]
        PROD_A["~/0-IT/2-Productie/athena/ (FROZEN SHOWCASE)"]
        PROD_X["~/0-IT/2-Productie/athena-x/"]
        PROD_Y["~/0-IT/2-Productie/athena-y/"]
    end

    subgraph "🐙 GITHUB MONOREPOS (athenacmsfactory)"
        MF_V9["athena-v9-factory"]
        MF_Y1_S["athena-y1-sites"]
        MF_Y1_F["athena-y1-factory"]
        MF_Y1_L["athena-y1-forklift"]
        MF_A["athena"]
        MF_X["athena-x"]
        MF_Y["athena-y"]
    end

    subgraph "🚀 GITHUB DEPLOYMENT ORGS (Subtrees)"
        ORG_V9["athenasitesy/[site] (V9)"]
        ORG_Y1["athenasitesy/[site]"]
        ORG_A["athena-cms-factory/[site]"]
        ORG_X["athena-x-factory/[site]"]
        ORG_Y["athena-y-factory/[site]"]
    end

    %% V9 Pipeline
    V9_DEV -->|Push| MF_V9
    MF_V9 -->|git subtree push| ORG_V9

    %% Y1 Pipeline
    Y1_DEV -->|Push sites/| MF_Y1_S
    Y1_DEV -->|Push y/factory/| MF_Y1_F
    Y1_DEV -->|Push forklift/| MF_Y1_L
    MF_Y1_S -->|git subtree push| ORG_Y1

    %% Athena Pipeline
    PROD_A -->|Push| MF_A
    MF_A -->|git subtree push| ORG_A

    %% Athena-X Pipeline
    PROD_X -->|Push| MF_X
    MF_X -->|git subtree push| ORG_X

    %% Athena-Y Pipeline
    PROD_Y -->|Push| MF_Y
    MF_Y -->|git subtree push| ORG_Y
```

---

## 📋 Gedetailleerde Verbindingsmatrix

### 1. Generatie Athena V9 (ACTUEEL)
| Lokaal Pad | GitHub Monorepo | Deployment Org |
|:---|:---|:---|
| `~/0-IT/4-pj/x-v9/` | `athenacmsfactory/athena-v9-factory` | `athenasitesy/` |

### 2. Generatie Y1 (Modern / DEV)
| Lokaal Pad | GitHub Monorepo | Deployment Org |
|:---|:---|:---|
| `~/0-IT/3-DEV/y1/sites` | `athenacmsfactory/athena-y1-sites` | `athenasitesy/` |
| `~/0-IT/3-DEV/y1/y/factory` | `athenacmsfactory/athena-y1-factory` | *(Engine Only)* |
| `~/0-IT/3-DEV/y1/forklift` | `athenacmsfactory/athena-y1-forklift` | *(Tools Only)* |

### 3. Generatie Athena (V1 / BEVROREN SHOWCASE)
| Lokaal Pad | GitHub Monorepo | Deployment Org |
|:---|:---|:---|
| `~/0-IT/2-Productie/athena` | `athenacmsfactory/athena` | `athena-cms-factory/` |

### 4. Generatie Athena-X (Experimenteel)
| Lokaal Pad | GitHub Monorepo | Deployment Org |
|:---|:---|:---|
| `~/0-IT/2-Productie/athena-x` | `athenacmsfactory/athena-x` | `athena-x-factory/` |

### 5. Generatie Athena-Y (Vroegere Productie)
| Lokaal Pad | GitHub Monorepo | Deployment Org |
|:---|:---|:---|
| `~/0-IT/2-Productie/athena-y` | `athenacmsfactory/athena-y` | `athena-y-factory/` |

---

## 🛠️ Gebruikte Technieken & Commando's

### 📡 SSH Identiteit
De factory gebruikt een gespecialiseerde SSH host (`github-athena`) om toegang te krijgen tot de repositories van de Athena organisatie.
*   **Host:** `github-athena`
*   **User:** `git`
*   **IdentityFile:** Wordt beheerd in `~/.ssh/config`

### 🌿 Git Subtree Workflow
Voor het pushen van individuele sites vanuit de monorepo naar hun eigen repositories wordt het volgende patroon gebruikt:
```bash
git subtree push --prefix sites/[site-name] git@github.com:[org]/[site-repo].git main
```

---

## 🚀 Toekomst & Automatisering (KDClaw)
KDClaw is geconfigureerd om deze paden te herkennen en kan de volgende taken automatiseren:
1.  **Backup**: Automatisch backups maken van de monorepo's naar `0-IT/4-BACKUP/`.
2.  **Sync**: Het pushen van wijzigingen naar de monorepo's en subtrees in één commando.
3.  **Audit**: Controleren of de lokale staat nog matcht met de GitHub status.

*Gegenereerd door KDClaw voor Strategische Re-integratie.*
