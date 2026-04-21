# SOAP Note Data Structure Template

## Overview
The SOAP note (Subjective, Objective, Assessment, Plan) is the standard clinical documentation format used by healthcare providers to document patient encounters.

---

## Data Model

### SOAP Note Entity
```typescript
interface SOAPNote {
  id: string;                    // UUID
  encounterId: string;           // Reference to Encounter
  patientId: string;             // Reference to Patient
  practitionerId: string;        // Reference to Practitioner (author)
  status: 'in-progress' | 'preliminary' | 'final' | 'amended';
  dateTime: string;              // ISO 8601 datetime of documentation
  signedAt?: string;             // When provider signed/locked the note
  amendedAt?: string;            // When amendment was added
  amendmentReason?: string;      // Required if amended

  subjective: SubjectiveSection;
  objective: ObjectiveSection;
  assessment: AssessmentSection;
  plan: PlanSection;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;             // User ID
  updatedBy: string;             // User ID
}
```

### Subjective Section (S)
Patient's self-reported symptoms, history, and concerns.

```typescript
interface SubjectiveSection {
  chiefComplaint: string;          // Primary reason for visit (free text, max 200 chars)
  hpiNarrative: string;           // History of Present Illness (free text)
  hpiStructured?: {
    onset: string;                // When symptoms started
    location: string;             // Body area affected
    duration: string;             // How long symptoms last
    character: string;            // Description of symptoms (sharp, dull, etc.)
    aggravatingFactors: string[]; // What makes it worse
    relievingFactors: string[];   // What makes it better
    severity: number;             // Pain scale 0-10
    timing: string;               // Pattern (constant, intermittent, etc.)
  };
  reviewOfSystems: {
    system: string;               // constitutional, eyes, ent, cardiovascular, respiratory, etc.
    findings: string;             // Positive and pertinent negatives
    isPositive: boolean;
  }[];
  pastMedicalHistory?: string;
  pastSurgicalHistory?: string;
  familyHistory?: string;
  socialHistory?: string;         // Smoking, alcohol, drugs, occupation, exercise
  currentMedications?: string;    // Reviewed/reconciled medication list
  allergies?: string;             // Verified allergy list with reactions
}
```

### Objective Section (O)
Measurable, observable clinical findings.

```typescript
interface ObjectiveSection {
  vitals: {
    bloodPressureSystolic: number;   // mmHg
    bloodPressureDiastolic: number;  // mmHg
    heartRate: number;               // bpm
    respiratoryRate: number;         // breaths/min
    temperature: number;             // Celsius
    temperatureRoute: 'oral' | 'tympanic' | 'axillary' | 'rectal' | 'temporal';
    oxygenSaturation: number;        // % SpO2
    height: number;                  // cm
    weight: number;                  // kg
    bmi: number;                     // calculated
    painScale?: number;              // 0-10
  };
  physicalExam: {
    system: string;                  // general, heent, neck, cardiovascular, etc.
    findings: string;                // Examination findings
    isNormal: boolean;               // Quick flag for normal findings
  }[];
  labResults?: {
    testName: string;
    loincCode: string;               // LOINC code for the test
    value: number | string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
    collectedAt: string;
  }[];
  imagingResults?: {
    modality: string;                // XR, CT, MR, US
    bodyPart: string;
    findings: string;
    impression: string;
    performedAt: string;
  }[];
  diagnosticResults?: string;        // Other diagnostic test results
}
```

### Assessment Section (A)
Clinical assessment and diagnoses.

```typescript
interface AssessmentSection {
  diagnoses: {
    code: string;                // ICD-10 code (e.g., "J06.9")
    display: string;             // Human-readable name (e.g., "Acute upper respiratory infection")
    type: 'primary' | 'secondary' | 'rule-out';
    status: 'active' | 'resolved' | 'recurrence';
    clinicalNotes?: string;      // Provider's clinical reasoning
  }[];
  clinicalImpression: string;    // Free-text clinical reasoning/summary
  differentialDiagnosis?: string[]; // Other conditions considered
  prognosis?: string;            // Expected outcome
}
```

### Plan Section (P)
Treatment plan, orders, and follow-up.

```typescript
interface PlanSection {
  medications: {
    action: 'start' | 'continue' | 'modify' | 'discontinue';
    medicationName: string;
    dosage: string;              // e.g., "500mg"
    route: string;               // oral, IV, IM, topical, etc.
    frequency: string;           // e.g., "BID", "Q8H", "PRN"
    duration?: string;           // e.g., "10 days", "ongoing"
    quantity?: number;
    refills?: number;
    instructions?: string;       // Patient instructions
    rxNormCode?: string;         // RxNorm code for medication
  }[];
  labOrders?: {
    testName: string;
    loincCode: string;
    priority: 'routine' | 'urgent' | 'stat';
    instructions?: string;
    fasting?: boolean;
  }[];
  imagingOrders?: {
    modality: string;
    bodyPart: string;
    indication: string;          // Clinical reason for ordering
    priority: 'routine' | 'urgent' | 'stat';
  }[];
  referrals?: {
    specialty: string;
    reason: string;
    urgency: 'routine' | 'urgent' | 'emergent';
    preferredProvider?: string;
  }[];
  procedures?: {
    procedureName: string;
    cptCode: string;
    notes: string;
  }[];
  patientEducation?: string[];   // Education topics discussed
  followUp: {
    timeframe: string;           // e.g., "2 weeks", "1 month", "PRN"
    reason: string;              // Reason for follow-up
    instructions: string;        // Return precautions, what to watch for
  };
  returnPrecautions?: string;    // When to seek immediate care
}
```

---

## Workflow Rules

1. **Creation**: SOAP note created automatically when encounter starts (status: `in-progress`)
2. **Editing**: Only the assigned practitioner can edit while status is `in-progress`
3. **Signing**: Provider electronically signs, status changes to `final`, note is locked
4. **Amendment**: After signing, only amendments are allowed (append-only, with reason required)
5. **Co-signing**: Some notes require attending physician co-signature (residents, NPs)
6. **Audit**: Every view, edit, sign, and amendment action is logged

## Validation Rules

- Chief complaint is required before signing
- At least one diagnosis (ICD-10) is required in Assessment
- Vitals must be recorded in Objective section
- Follow-up plan is required
- All ICD-10 codes must be valid and current
- Pain scale must be 0-10 if provided
- Temperature must be within physiological range (30-45 Celsius)
