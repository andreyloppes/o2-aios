# Healthcare Squad - Example Prompts

## 1. New Clinic System
```
/pro:squad healthcare Build a complete clinic management system for a small primary care practice
with 3 physicians, 2 NPs, and 15 staff. They currently use paper charts and want to go digital.
Need patient registration, scheduling, SOAP notes, basic billing, and a patient portal.
```

## 2. HIPAA Compliance Audit
```
/pro:squad healthcare vera Review our existing patient portal codebase for HIPAA compliance.
Check authentication, PHI handling, audit logging, encryption, and access controls.
Generate a compliance report with severity-rated findings.
```

## 3. EHR Data Migration
```
/pro:squad healthcare nexus Design a migration plan to move patient records from our legacy
HL7 v2 system to a new FHIR R4-based platform. We have 50,000 patient records,
200,000 encounters, and 1.5 million observations. Need zero-downtime migration.
```

## 4. Appointment Scheduling Module
```
/pro:squad healthcare clinix Build an appointment scheduling module with these requirements:
- 5 providers with different schedules and appointment types
- Online patient self-scheduling with availability rules
- Automated SMS/email reminders (no PHI in messages)
- Waitlist management for cancelled slots
- No-show tracking and reporting
```

## 5. Clinical Documentation System
```
/pro:squad healthcare medis Analyze and design a clinical documentation workflow for a
multi-specialty clinic (cardiology, endocrinology, orthopedics). Each specialty needs
custom SOAP note templates, specialty-specific order sets, and clinical decision support rules.
```

## 6. Telemedicine Integration
```
/pro:squad healthcare Add telemedicine capabilities to our existing clinic system. Need video
consultation with screen sharing, virtual waiting room, consent collection,
SOAP note integration, e-prescribing post-visit, and billing with telehealth-specific codes.
```

## 7. Medical Billing Optimization
```
/pro:squad healthcare medis Analyze our revenue cycle and design improvements. Current metrics:
Days in A/R is 52, clean claim rate is 78%, denial rate is 18%.
Need to identify bottlenecks and design an optimized billing workflow.
```

## 8. Patient Portal Development
```
/pro:squad healthcare clinix Build a patient-facing portal with: appointment booking,
secure messaging with providers, lab results viewing (with provider release workflow),
medication list, bill pay (PCI-DSS compliant), and health record download (C-CDA format).
```

## 9. Lab Integration
```
/pro:squad healthcare nexus Design and implement HL7 v2 interfaces for lab integration:
- Outbound ORM messages for lab orders
- Inbound ORU messages for results
- Result matching and auto-filing to patient records
- Critical value alerting to ordering provider
- Interface monitoring and error handling
```

## 10. Compliance-First Architecture
```
/pro:squad healthcare vera Design the security architecture for a new healthcare SaaS platform
that will store PHI for multiple clinic tenants. Need: tenant isolation strategy,
encryption architecture, audit logging design, access control model,
backup/DR strategy, and incident response plan. Must pass SOC 2 Type II audit.
```
