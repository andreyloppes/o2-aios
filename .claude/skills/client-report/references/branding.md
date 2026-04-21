# Branding Customization Guide

How to customize reports to match client or company identity.

---

## Required Customizations

Every report needs these four elements configured before delivery.

### 1. Company Name

Appears in:
- Report footer: `*[Company Name] — Confidential*`
- Header attribution: `Prepared by: [Team Name] at [Company Name]`

**Setup:** Replace all `[COMPANY NAME]` placeholders in templates.

### 2. Project Name

Appears in:
- Report title: `# [Report Type] — [Project Name]`
- References throughout the body

**Setup:** Replace all `[PROJECT NAME]` placeholders.

### 3. Author / Team Name

Appears in:
- `Prepared by:` field
- Sign-off sections (deliverable reports)

**Setup:** Replace all `[NAME/TEAM]` placeholders. Use consistent naming:
- Individual: "Jane Silva"
- Team: "Engineering Team"
- Company: "Acme Development"

### 4. Confidentiality Notice

Default: `*[Company Name] — Confidential*`

Options:
- `*Confidential — For internal use only*`
- `*[Company] — Client Confidential — Do not distribute*`
- `*Public — No restrictions*`
- Custom text per client agreement

---

## Optional Customizations

### Client Terminology

Different clients use different terms. Map internal vocabulary to client preferences before report generation.

**Create a terminology file** per client:

```markdown
# Client: [Client Name] — Terminology

| Internal Term | Client Term |
|---------------|-------------|
| Sprint | Iteration |
| Story | Work Item |
| Epic | Initiative |
| Agent | Team Member |
| Deployment | Release |
| Technical Debt | Maintenance |
| Backlog | Pipeline |
| Standup | Daily Check-in |
| Retrospective | Review Session |
| Velocity | Delivery Rate |
```

Apply these substitutions consistently across all reports for the given client.

### Date Format

Default: YYYY-MM-DD (ISO 8601).

Some clients prefer:
- US: MM/DD/YYYY
- EU: DD/MM/YYYY
- Long: February 17, 2026

Choose one format and use it consistently throughout all reports for that client.

### Currency

Default: USD ($).

For international clients:
- EUR: Replace $ with Euro symbol
- GBP: Replace $ with Pound symbol
- BRL: Replace $ with R$
- Custom: As specified by client

### Metric Preferences

Some clients prefer specific metric presentations:

| Preference | Default | Alternative |
|-----------|---------|------------|
| Percentages | 75% | 0.75 |
| Trends | +15% | up arrow or "improving" |
| Status | On Track / At Risk | Green / Yellow / Red |
| Time | hours | business days |

---

## Advanced: HTML Report Branding

When generating HTML reports (instead of markdown), additional branding is possible.

### Color Scheme

Define primary and secondary brand colors:

```css
:root {
  --brand-primary: #2563eb;    /* Headers, links, emphasis */
  --brand-secondary: #1e40af;  /* Hover states, accents */
  --brand-text: #1e293b;       /* Body text */
  --brand-muted: #64748b;      /* Secondary text */
  --brand-surface: #f8fafc;    /* Background */
  --brand-border: #e2e8f0;     /* Table borders, dividers */
}
```

### Logo Placement

If client provides a logo:
- Place in report header, left-aligned
- Maximum height: 40px
- Format: SVG preferred, PNG acceptable
- Reference: `![Company Logo](path/to/logo.svg)`

### Font

If client specifies a brand font:
- Use for headings and body text
- Fallback to system fonts: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Do not use decorative fonts in data-heavy reports

---

## Per-Client Configuration Template

Save this as a configuration for each client:

```markdown
# Report Configuration — [Client Name]

## Identity
- **Company:** [Your company name]
- **Client:** [Client company name]
- **Project:** [Project name]
- **Author:** [Default author name]

## Format
- **Date format:** YYYY-MM-DD
- **Currency:** USD ($)
- **Status style:** On Track / At Risk / Blocked
- **Confidentiality:** "[Company] — Client Confidential"

## Terminology
| Internal | Client |
|----------|--------|
| Sprint | [client term] |
| Story | [client term] |
| Deployment | [client term] |

## Branding (HTML only)
- **Primary color:** [hex]
- **Logo path:** [path or URL]
- **Font:** [font name]

## Notes
- [Any client-specific preferences or requirements]
```

---

## Checklist Before First Delivery

1. Company name replaced in all templates
2. Project name set
3. Author/team name configured
4. Confidentiality notice appropriate
5. Terminology mapped if client uses non-standard terms
6. Date format confirmed with client
7. Currency confirmed
8. Metric presentation preferences checked
9. Sample report reviewed for brand consistency
