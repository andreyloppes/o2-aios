# Healthcare Squad

Specialized squad for building HIPAA/LGPD-compliant healthcare applications, clinic management systems, and medical data platforms.

## Agents

| Agent | Name | Base | Specialty |
|-------|------|------|-----------|
| clinical-dev | Clinix | dev | HIPAA-aware full stack development, EHR integration |
| compliance-qa | Vera | qa | Healthcare compliance review, security audits |
| health-analyst | Medis | analyst | Clinical workflow analysis, patient journey mapping |
| ehr-data-engineer | Nexus | data-engineer | HL7/FHIR schemas, medical data modeling |

## Workflow

**Clinic System Setup** (`workflows/clinic-setup.md`)
Multi-phase workflow: Intake > Compliance Assessment > Schema Design > Implementation > Compliance Review

## Templates

- **PRD Clinic** — Pre-filled PRD with healthcare epics (Patient Management, Scheduling, Clinical Records, Billing, Reports)
- **SOAP Note** — SOAP note data structure for clinical documentation
- **Compliance Checklist** — HIPAA/LGPD compliance verification checklist

## Usage

```
/pro:squad healthcare — Load the full healthcare squad
/pro:squad healthcare clinix — Load only the clinical developer overlay
```

## Compliance Standards

This squad enforces:
- HIPAA (Health Insurance Portability and Accountability Act)
- LGPD (Lei Geral de Protecao de Dados)
- HL7 FHIR R4 data standards
- DICOM for imaging data
- ICD-10 coding standards
