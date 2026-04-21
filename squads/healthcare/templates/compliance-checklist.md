# HIPAA/LGPD Compliance Checklist

## Usage
Use this checklist at the start (Phase 2: Compliance Assessment) and end (Phase 5: Compliance Review) of the Clinic System Setup workflow. Every item must be verified and documented.

---

## 1. Administrative Safeguards

### 1.1 Security Management
- [ ] Risk analysis conducted and documented
- [ ] Risk management plan established with remediation timeline
- [ ] Sanction policy defined for workforce violations
- [ ] Information system activity review process established

### 1.2 Workforce Security
- [ ] Authorization procedures for PHI access documented
- [ ] Workforce clearance procedures implemented
- [ ] Termination procedures include immediate access revocation
- [ ] Background checks required for roles with PHI access

### 1.3 Information Access Management
- [ ] Access authorization policies documented per role
- [ ] Role-based access control (RBAC) matrix defined
- [ ] Minimum necessary principle applied to all access
- [ ] Access review conducted quarterly

### 1.4 Security Awareness and Training
- [ ] Security training program established for all workforce
- [ ] Training covers: password management, phishing, PHI handling, incident reporting
- [ ] Training completion tracked and documented
- [ ] Annual refresher training scheduled

### 1.5 Incident Response
- [ ] Security incident procedures documented
- [ ] Incident response team identified with roles
- [ ] Breach notification procedures defined (60-day requirement)
- [ ] Incident tracking and documentation system in place
- [ ] Post-incident review process established

### 1.6 Contingency Plan
- [ ] Data backup plan implemented and tested
- [ ] Disaster recovery plan documented
- [ ] Emergency mode operation plan established
- [ ] Testing and revision schedule defined (annual minimum)
- [ ] Recovery Point Objective (RPO) and Recovery Time Objective (RTO) defined

### 1.7 Business Associate Agreements
- [ ] BAA inventory maintained for all third-party services
- [ ] BAAs include required HIPAA provisions
- [ ] Cloud provider BAA in place (AWS/GCP/Azure)
- [ ] Clearinghouse BAA in place
- [ ] Communication service BAAs in place (SMS, email)

---

## 2. Physical Safeguards

### 2.1 Facility Access Controls
- [ ] Server/data center physical access restricted
- [ ] Visitor access procedures documented
- [ ] Workstation positioning prevents unauthorized viewing
- [ ] Clean desk policy for areas with PHI

### 2.2 Workstation Security
- [ ] Workstation use policies defined
- [ ] Auto-lock screens configured (5 minutes max)
- [ ] Workstation encryption enabled (full-disk)
- [ ] Removable media controls implemented

### 2.3 Device and Media Controls
- [ ] Device disposal procedures include data wiping
- [ ] Media reuse procedures include secure erasure
- [ ] Encrypted portable devices only
- [ ] Lost/stolen device reporting procedures

---

## 3. Technical Safeguards

### 3.1 Access Control
- [ ] Unique user identification for every user (no shared accounts)
- [ ] Emergency access procedure (break-the-glass) implemented
- [ ] Automatic logoff after 15 minutes of inactivity
- [ ] Multi-factor authentication (MFA) required for all users
- [ ] Password policy: minimum 12 characters, complexity requirements
- [ ] Account lockout after 5 failed attempts
- [ ] Concurrent session limits enforced

### 3.2 Audit Controls
- [ ] Audit logging enabled for all PHI access (read, create, update, delete)
- [ ] Audit logs include: user ID, timestamp, action, resource, IP address
- [ ] Audit logs are immutable (append-only, no update/delete)
- [ ] Audit log retention: minimum 6 years
- [ ] Audit log review process established (automated alerts for anomalies)
- [ ] Audit logs stored separately from application data
- [ ] Tamper-evident logging mechanism implemented

### 3.3 Integrity Controls
- [ ] Data integrity verification mechanisms in place
- [ ] Input validation on all medical data fields
- [ ] Database constraints prevent invalid clinical data
- [ ] Checksums or digital signatures for critical records
- [ ] Clinical notes locked after provider signature (amendments only)

### 3.4 Transmission Security
- [ ] TLS 1.3 enforced for all data in transit
- [ ] No HTTP endpoints (HTTPS only, HSTS enabled)
- [ ] API authentication on all endpoints
- [ ] Certificate management and renewal process
- [ ] VPN or private connectivity for system-to-system integrations

### 3.5 Encryption
- [ ] AES-256 encryption at rest for all PHI
- [ ] Column-level encryption for high-sensitivity fields (SSN, MRN, genetic data)
- [ ] Database backup encryption enabled
- [ ] Key management procedures documented
- [ ] Key rotation schedule: every 90 days minimum
- [ ] Encryption keys stored in dedicated key management service (KMS)

---

## 4. Privacy Rule Compliance

### 4.1 Patient Rights
- [ ] Right to access PHI: patient can request and receive records
- [ ] Right to amendment: patient can request corrections
- [ ] Right to accounting of disclosures: system tracks all disclosures
- [ ] Right to restrict processing: opt-out mechanisms available
- [ ] Right to confidential communications: alternative contact methods supported
- [ ] Right to data portability: export in standard format (FHIR, C-CDA)

### 4.2 Minimum Necessary Standard
- [ ] Each role accesses only the PHI needed for their function
- [ ] API responses filtered by user role
- [ ] Reports use de-identified or aggregated data by default
- [ ] Database views restrict PHI by role

### 4.3 De-identification
- [ ] Safe Harbor method implemented (18 identifiers removed) for analytics
- [ ] De-identification verification process documented
- [ ] Re-identification risk assessment conducted
- [ ] De-identified datasets clearly labeled and segregated

---

## 5. LGPD Compliance (Brazilian Operations)

### 5.1 Legal Basis
- [ ] Legal basis documented for each data processing activity
- [ ] Explicit consent collected for health data processing
- [ ] Consent is granular, specific, and freely given
- [ ] Consent withdrawal mechanism implemented and accessible

### 5.2 Data Subject Rights
- [ ] Right to confirmation of processing
- [ ] Right to access personal data
- [ ] Right to correction of incomplete or inaccurate data
- [ ] Right to anonymization, blocking, or deletion of unnecessary data
- [ ] Right to data portability
- [ ] Right to information about third-party sharing
- [ ] Right to revoke consent

### 5.3 Data Protection
- [ ] Data Protection Impact Assessment (DPIA) completed for health data
- [ ] Data Protection Officer (DPO) designated
- [ ] Record of processing activities maintained
- [ ] International data transfer safeguards in place (if applicable)
- [ ] Data breach notification to ANPD within reasonable timeframe

---

## 6. Application-Specific Checks

### 6.1 User Interface
- [ ] No PHI displayed in browser title bar or tab name
- [ ] PHI masked by default with reveal-on-click (SSN, MRN)
- [ ] Print functionality includes confidentiality header/footer
- [ ] Copy/paste of PHI generates audit log entry
- [ ] Screen sharing warning when PHI is visible
- [ ] Mobile responsive design maintains PHI protection

### 6.2 API Security
- [ ] No PHI in URL parameters (use POST body or headers)
- [ ] API rate limiting implemented
- [ ] API versioning with deprecation policy
- [ ] Error responses do not expose PHI or system internals
- [ ] CORS configured to allow only authorized origins
- [ ] API keys/tokens expire and require renewal

### 6.3 Development Practices
- [ ] No real patient data in development/staging environments
- [ ] Synthetic test data generator available
- [ ] Code review checklist includes PHI security items
- [ ] Dependency scanning for known vulnerabilities
- [ ] Static Application Security Testing (SAST) integrated in CI/CD
- [ ] Dynamic Application Security Testing (DAST) performed before release

---

## Sign-Off

| Reviewer | Role | Date | Status |
|----------|------|------|--------|
| [Name] | Compliance Officer | [Date] | [ ] Approved / [ ] Findings |
| [Name] | Security Lead | [Date] | [ ] Approved / [ ] Findings |
| [Name] | Technical Lead | [Date] | [ ] Approved / [ ] Findings |

### Findings Summary
| # | Category | Finding | Severity | Remediation | Due Date | Status |
|---|----------|---------|----------|-------------|----------|--------|
| 1 | | | | | | |
