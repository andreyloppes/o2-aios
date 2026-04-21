---
name: pro:squad
description: "Activate an industry-specific agent squad configuration"
argument-hint: "<industry> [agent]"
---

You are now executing the **PRO Squad Activation** system.

## Available Squads

| Industry | Squad Path | Agents |
|----------|-----------|--------|
| `healthcare` | `pro/squads/healthcare/` | Clinix, Vera, Medis, Nexus |
| `marketing-agency` | `pro/squads/marketing-agency/` | Pixel, Dash, Campfire, Prism |
| `saas-startup` | `pro/squads/saas-startup/` | Scaler, Pulse, Tenon, Funnel |
| `ecommerce` | `pro/squads/ecommerce/` | Shelf, Catalog, Convert, Gate |
| `freelancer` | `pro/squads/freelancer/` | Solo, Brief, Scope, Ledger |

## How It Works

### Usage 1: `/pro:squad` (no arguments)
List all available squads with their descriptions and agent compositions.

### Usage 2: `/pro:squad <industry>` (e.g., `/pro:squad healthcare`)
1. Read the squad manifest from `~/AIOS-MASTER/pro/squads/<industry>/squad.yaml`
2. Present the squad composition, capabilities, and available workflows
3. List the industry-specific agents and their overlays
4. Show available templates and example prompts
5. Ask which agent the user wants to activate or if they want to run the squad workflow

### Usage 3: `/pro:squad <industry> <overlay>` (e.g., `/pro:squad healthcare clinix`)
1. Read `~/AIOS-MASTER/pro/squads/<industry>/squad.yaml` and map the overlay alias to its squad agent entry (e.g., `clinix` -> `clinical-dev`, base `dev`)
2. Read the resolved base agent from `~/AIOS-MASTER/commands/agents/<base>.md`
3. Read the resolved industry overlay from `~/AIOS-MASTER/pro/squads/<industry>/agents/<overlay-file>.md`
4. **Combine both**: load the base agent persona FIRST, then inject the industry overlay as additional context
5. The result is the base agent augmented with industry-specific knowledge

## Squad Overlay Pattern

Industry agents are NOT replacements — they are **augmentation overlays**:

```
Base Agent (e.g., Dex - Full Stack Developer)
  + Industry Overlay (e.g., Clinix - HIPAA-Aware Developer)
  = Combined Agent with base skills + industry expertise
```

The overlay adds:
- Domain-specific terminology and concepts
- Compliance requirements (HIPAA, PCI-DSS, GDPR, etc.)
- Industry-standard data formats and patterns
- Prohibited actions specific to the domain
- Industry-specific templates and examples

## Activation

If arguments are provided, execute the corresponding usage above.
If no arguments, list all available squads and ask the user which to activate.
