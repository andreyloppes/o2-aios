---
name: workflows:deploy-pipeline
description: "Full CI/CD orchestration: validate, quality gate, staging, production, verify"
---

You are now executing the **Deploy Pipeline Workflow** — a comprehensive 5-phase deployment process with quality gates and rollback plans.

## Workflow Overview

```
Phase 1: Pre-Flight Validation  → /agents:devops (Gage) + /agents:architect (Aria)
Phase 2: Quality Gate           → /agents:qa (Quinn) + /agents:dev (Dex)
Phase 3: Staging Deploy         → /agents:devops (Gage)
Phase 4: Production Deploy      → /agents:devops (Gage)
Phase 5: Post-Deploy Verify     → /agents:qa (Quinn) + /pro:report status
```

## Your Role
You are the deployment coordinator. You will:
1. Ensure every gate is passed before proceeding
2. Block deployment if any phase fails
3. Maintain a rollback plan at every stage
4. Generate deployment report after completion

## Phase Detection
Check the project state:
- No build artifacts → Start at Phase 1
- Build passes, no tests → Phase 1 partial
- All tests pass → Phase 2 ready
- Deployed to staging → Phase 3 complete
- Deployed to production → Phase 4 complete
- Verified in production → Phase 5 complete

## Phase 1: Pre-Flight Validation
**Goal:** Verify everything is ready for deployment

### Step 1.1: Environment Check
**Agent:** `/agents:devops` (Gage)
**Actions:**
1. Verify all environment variables are set
2. Check that secrets/credentials are configured
3. Verify build dependencies are installed
4. Check disk space and system resources
5. Verify target environments are reachable
**Gate:** ALL checks must pass. Any failure = ABORT.

### Step 1.2: Architecture Compliance
**Agent:** `/agents:architect` (Aria)
**Actions:**
1. Verify no architectural regressions since last deploy
2. Check for breaking API changes
3. Verify database migrations are reversible
4. Confirm no new security vulnerabilities
**Gate:** No critical issues. Warnings can proceed with acknowledgment.

## Phase 2: Quality Gate
**Goal:** Ensure code quality meets deployment standards

### Step 2.1: Automated Checks
**Agent:** `/agents:dev` (Dex)
**Actions:**
1. Run linter: `npm run lint` (or equivalent)
2. Run type checker: `npm run typecheck` (or equivalent)
3. Run test suite: `npm test`
4. Run build: `npm run build`
5. Record results: all must pass
**Gate:** ZERO lint errors, ZERO type errors, ALL tests pass, build succeeds.

### Step 2.2: Code Review
**Agent:** `/agents:qa` (Quinn)
**Actions:**
1. Review all changes since last deploy (`git diff` against last tag)
2. Check for: security issues, performance regressions, missing error handling
3. Verify test coverage for new code
4. Produce QA verdict: PASS / CONCERNS / FAIL
**Gate:** Must be PASS. CONCERNS requires user acknowledgment. FAIL = ABORT.

## Phase 3: Staging Deploy
**Goal:** Deploy to staging and validate

### Step 3.1: Deploy to Staging
**Agent:** `/agents:devops` (Gage)
**Actions:**
1. Create git tag: `v[version]-rc1`
2. Deploy to staging environment
3. Run database migrations
4. Verify application starts correctly
5. Record deployment timestamp and version

### Step 3.2: Smoke Tests
**Agent:** `/agents:qa` (Quinn)
**Actions:**
1. Verify core user flows work in staging
2. Check API endpoints respond correctly
3. Verify database migrations applied correctly
4. Check for console errors or warnings
5. Test critical business logic
**Gate:** All smoke tests pass. Any failure = fix and retry or ABORT.

### Step 3.3: User Acceptance (Optional)
**Actions:**
1. Notify user that staging is ready for review
2. Provide staging URL and test credentials
3. Wait for user approval or issue reports
**Gate:** User approval to proceed to production.

## Phase 4: Production Deploy
**Goal:** Deploy to production with rollback plan

### Step 4.1: Rollback Plan
**Agent:** `/agents:devops` (Gage)
**Actions:**
1. Document current production version (for rollback)
2. Create database backup
3. Record rollback command sequence
4. Estimate rollback time

### Step 4.2: Deploy
**Agent:** `/agents:devops` (Gage)
**Actions:**
1. Create release tag: `v[version]`
2. Deploy to production
3. Run database migrations
4. Verify application health check passes
5. Monitor for errors in first 5 minutes

### Step 4.3: Rollback (if needed)
**Trigger:** Health check fails or critical errors detected
**Actions:**
1. Execute rollback commands
2. Restore database backup if needed
3. Verify rollback succeeded
4. Document what went wrong

## Phase 5: Post-Deploy Verification
**Goal:** Confirm production is healthy and generate report

### Step 5.1: Production Verification
**Agent:** `/agents:qa` (Quinn)
**Actions:**
1. Run production smoke tests
2. Verify monitoring dashboards show healthy metrics
3. Check error rates are normal
4. Verify all integrations are working

### Step 5.2: Release Notes
**Agent:** `/agents:dev` (Dex)
**Actions:**
1. Generate release notes from git log since last tag
2. List: new features, bug fixes, breaking changes
3. Document known issues

### Step 5.3: Deployment Report
**Command:** `/pro:report status`
**Actions:**
1. Generate deployment report with:
   - Version deployed
   - Changes included
   - Test results summary
   - Deployment timeline
   - Rollback plan status

## Activation
1. Ask the user what they want to deploy and to which environment
2. Start Phase 1 pre-flight validation
3. Progress through gates — STOP if any gate fails
4. Complete deployment and generate report

**CRITICAL:** Never skip a gate. Never deploy without QA approval. Always have a rollback plan.
