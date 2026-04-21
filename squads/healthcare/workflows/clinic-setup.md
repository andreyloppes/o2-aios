---
name: workflows:healthcare:clinic-setup
description: "Multi-phase workflow for setting up a clinic management system from intake through compliance-verified deployment"
---

You are now executing the **Clinic System Setup** workflow for building a HIPAA/LGPD-compliant clinic management system.

## Workflow Overview

This workflow takes a clinic from initial requirements through a fully compliant, production-ready system.

**Participants:** Medis (analyst) > Vera (qa) > Nexus (data-engineer) > Clinix (dev) > Vera (qa)

---

## Phase 1: Intake & Requirements (Agent: Medis)

**Objective:** Gather clinic profile, workflows, and business requirements.

**Inputs:**
- Clinic type and size
- Number of providers and staff
- Existing systems (if brownfield)
- Key pain points and priorities

**Activities:**
1. Conduct stakeholder interview using the Clinic Profile template
2. Map existing patient journey and identify automation opportunities
3. Document appointment types, durations, and scheduling rules
4. Catalog insurance/payer requirements
5. Identify integration needs (lab systems, pharmacy, imaging)
6. Define reporting and analytics requirements
7. Produce prioritized epic/story backlog

**Outputs:**
- Completed PRD using `templates/prd-clinic.md`
- Patient journey map with touchpoints
- Prioritized feature backlog
- Stakeholder sign-off document

**Transition Criteria:** PRD approved by clinic stakeholders

---

## Phase 2: Compliance Assessment (Agent: Vera)

**Objective:** Evaluate compliance requirements and establish security framework.

**Inputs:**
- Completed PRD from Phase 1
- Clinic's current compliance status
- Applicable regulations (HIPAA, LGPD, state-specific)

**Activities:**
1. Review PRD for compliance gaps using `templates/compliance-checklist.md`
2. Classify all data elements as PHI/non-PHI
3. Define encryption requirements per data category
4. Establish access control matrix (roles x resources x permissions)
5. Define audit logging requirements
6. Specify BAA (Business Associate Agreement) requirements for third parties
7. Document incident response procedures
8. Set data retention and destruction policies

**Outputs:**
- Compliance requirements document
- Data classification matrix
- Access control matrix
- Audit logging specification
- Security architecture recommendations

**Transition Criteria:** All HIPAA/LGPD requirements documented and approved

---

## Phase 3: Schema Design (Agent: Nexus)

**Objective:** Design the database schema and data integration layer.

**Inputs:**
- PRD from Phase 1
- Compliance requirements from Phase 2
- Integration requirements (HL7/FHIR, labs, pharmacy)

**Activities:**
1. Design core clinical schema (patients, encounters, observations, medications)
2. Design scheduling schema (appointments, slots, providers, rooms)
3. Design billing schema (claims, payments, insurance)
4. Implement PHI encryption strategy at column level
5. Design audit log tables (append-only, tamper-evident)
6. Design FHIR resource mappings for interoperability
7. Create SOAP note data model using `templates/soap-note.md`
8. Define migration strategy and seed data approach

**Outputs:**
- Complete database schema (DDL scripts)
- FHIR resource mapping documentation
- Data migration plan
- Encryption key management design
- Database access policies (row-level security)

**Transition Criteria:** Schema review approved by Vera (compliance) and Medis (requirements)

---

## Phase 4: Implementation (Agent: Clinix)

**Objective:** Build the clinic management system with full compliance.

**Inputs:**
- PRD, compliance requirements, database schema
- Technology stack decisions

**Activities:**
1. Set up project with HIPAA-compliant infrastructure (encrypted storage, VPC, WAF)
2. Implement authentication (MFA, RBAC, session management)
3. Build patient management module (registration, demographics, insurance)
4. Build scheduling module (appointment CRUD, conflict detection, reminders)
5. Build clinical documentation module (SOAP notes, orders, referrals)
6. Build billing module (charge capture, claim generation, payment tracking)
7. Build reporting module (de-identified analytics, operational dashboards)
8. Implement audit logging middleware (all PHI access/modification)
9. Build patient portal (secure messaging, appointment booking, bill pay)
10. Implement FHIR API endpoints for interoperability

**Outputs:**
- Working application with all modules
- API documentation
- Unit and integration test suite
- Deployment configuration
- User documentation

**Transition Criteria:** All features implemented and passing automated tests

---

## Phase 5: Compliance Review (Agent: Vera)

**Objective:** Final security audit and compliance verification.

**Inputs:**
- Completed application from Phase 4
- Compliance requirements from Phase 2
- Test results

**Activities:**
1. Execute full compliance checklist verification
2. Perform security penetration testing (PHI exposure, access control bypass)
3. Verify audit log completeness and immutability
4. Test encryption at rest and in transit
5. Verify patient rights workflows (access, amendment, deletion)
6. Test break-the-glass emergency access procedures
7. Review error messages for PHI leakage
8. Validate de-identification for reporting/analytics
9. Test backup and disaster recovery procedures
10. Generate compliance certification report

**Outputs:**
- Compliance audit report
- Security findings with severity ratings
- Remediation items (if any, return to Phase 4)
- Final compliance certification
- Go-live approval

**Transition Criteria:** Zero critical/high findings; all medium findings have remediation plan

---

## Iteration Protocol

If Phase 5 identifies issues:
1. Critical/High findings: Return to Phase 4 for immediate remediation
2. Medium findings: Document remediation plan with timeline, conditional go-live
3. Low findings: Document in backlog, proceed with go-live

**Maximum iterations:** 3 (Phase 4-5 cycles before escalation to stakeholders)
