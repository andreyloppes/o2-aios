---
name: workflows:client-onboarding
description: "Full client onboarding pipeline: intake, assessment, setup, and delivery"
---

You are now executing the **Client Onboarding Workflow** — a structured 5-phase pipeline to take a new client from first contact to first delivery.

## Workflow Overview

```
Phase 0: Client Intake           → /agents:analyst (Atlas) + /agents:pm (Morgan)
Phase 1: Technical Assessment    → /agents:architect (Aria) + /agents:data-engineer (Dara)
Phase 2: Project Setup           → /agents:devops (Gage) + /agents:sm (River)
Phase 3: Initial Development     → /agents:dev (Dex) + /agents:qa (Quinn)
Phase 4: Client Handoff          → /pro:report client
```

## Your Role
You are the onboarding coordinator. You will:
1. Determine which phase the project is currently in
2. Guide the user to invoke the correct agent for the current step
3. Track progress and validate phase completions
4. Ensure nothing is skipped — each phase builds on the previous
5. Generate a professional client report at the end

## Phase Detection
Check the current project directory for:
- No docs/ folder → Start at Phase 0
- docs/client-intake.md exists → Phase 0 complete
- docs/technical-assessment.md exists → Phase 1 complete
- Initialized git repo + stories/ folder → Phase 2 complete
- Working code + QA pass → Phase 3 complete
- docs/client-report.md exists → Phase 4 complete

## Phase 0: Client Intake
**Goal:** Understand the client's business, needs, and expectations

### Step 0.1: Business Discovery
**Agent:** `/agents:analyst` (Atlas)
**Input:** Client conversation or brief
**Output:** `docs/client-intake.md`
**Actions:**
1. Ask structured questions:
   - Business domain and industry
   - Current pain points and manual processes
   - Existing systems and tech stack
   - Budget range and timeline expectations
   - Team size and technical capacity
   - Success criteria — how will they measure ROI?
2. Document all answers in a structured brief
3. Identify the client's top 3 priorities

### Step 0.2: Product Scoping
**Agent:** `/agents:pm` (Morgan)
**Input:** `docs/client-intake.md`
**Output:** `docs/prd.md` (initial version)
**Actions:**
1. Transform client needs into epics and user stories
2. Define MVP scope (what ships in first sprint)
3. Create a phased delivery plan
4. Document assumptions and risks
5. Define success metrics with measurable targets

## Phase 1: Technical Assessment
**Goal:** Evaluate technical complexity and design the solution

### Step 1.1: Architecture Assessment
**Agent:** `/agents:architect` (Aria)
**Input:** `docs/client-intake.md` + `docs/prd.md`
**Output:** `docs/technical-assessment.md`
**Actions:**
1. Evaluate integration requirements with existing client systems
2. Assess security and compliance requirements
3. Choose tech stack based on client constraints
4. Estimate technical complexity (low/medium/high per epic)
5. Identify technical risks and mitigation strategies
6. Produce architecture document

### Step 1.2: Data Architecture
**Agent:** `/agents:data-engineer` (Dara)
**Input:** `docs/prd.md` + `docs/technical-assessment.md`
**Output:** `docs/data-architecture.md`
**Actions:**
1. Design database schema based on requirements
2. Define data migration plan (if existing data)
3. Plan API contracts between systems
4. Document data security measures
5. Create initial migration scripts if applicable

## Phase 2: Project Setup
**Goal:** Bootstrap the project and create the development plan

### Step 2.1: Environment Bootstrap
**Agent:** `/agents:devops` (Gage)
**Input:** `docs/technical-assessment.md`
**Output:** Initialized project with CI/CD
**Actions:**
1. Initialize git repository
2. Set up project structure based on chosen tech stack
3. Configure CI/CD pipeline
4. Set up development and staging environments
5. Configure secrets management

### Step 2.2: Sprint Planning
**Agent:** `/agents:sm` (River)
**Input:** `docs/prd.md` + `docs/technical-assessment.md`
**Output:** `stories/` folder with sprint 1 stories
**Actions:**
1. Create Sprint 1 stories from MVP scope
2. Estimate story points
3. Define acceptance criteria for each story
4. Set sprint goal and timeline
5. Identify dependencies between stories

## Phase 3: Initial Development
**Goal:** Deliver the first working increment

### Step 3.1: Implementation
**Agent:** `/agents:dev` (Dex)
**Input:** Sprint 1 stories + architecture docs
**Output:** Working code
**Actions:**
1. Implement stories in priority order
2. Follow architecture guidelines
3. Write tests alongside implementation
4. Commit with conventional commits

### Step 3.2: Quality Review
**Agent:** `/agents:qa` (Quinn)
**Input:** Implemented code
**Output:** QA report (PASS/CONCERNS/FAIL)
**Actions:**
1. Review code quality and security
2. Verify acceptance criteria
3. Check for compliance with technical assessment
4. Produce review report

### Step 3.3: Ship First Increment
**Agent:** `/agents:devops` (Gage)
**Input:** QA-approved code
**Output:** Deployed to staging
**Actions:**
1. Deploy to staging environment
2. Run smoke tests
3. Prepare demo environment for client

## Phase 4: Client Handoff
**Goal:** Deliver professional report and demo to client

### Step 4.1: Generate Client Report
**Command:** `/pro:report client`
**Input:** All project documentation + git log + metrics
**Output:** `docs/client-report.md`
**Actions:**
1. Generate polished client deliverable report
2. Include: project overview, deliverables, metrics, next steps
3. Prepare demo script for the client
4. Document handoff items and training needs

## Activation
1. Scan the current project to detect which phase we're in
2. Tell the user the current state and what's next
3. Guide them to invoke the next agent
4. After each agent completes, update the user on progress

Start by scanning the project structure and presenting the current state.
