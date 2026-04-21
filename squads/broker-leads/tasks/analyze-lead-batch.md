# analyze-lead-batch

## Objetivo
Processa um lote de leads (CSV, JSON ou lista inline) e retorna scoring estruturado.

## Inputs
- `source`: caminho pro arquivo OU JSON inline
- `franchisee_profile` (opcional): perfil do franqueado-alvo pra contextualizar ICP

## Steps

1. **Carregar lote** — suportar CSV, JSON, JSONL.
2. **Deduplicar** — por e-mail + CNPJ + telefone (janela 30 dias).
3. **Enriquecer** (se disponível):
   - Validar CNPJ (situação ativa na Receita)
   - Classificar CNAE vs. ICP
4. **Aplicar rubrica** (do agent YAML) — firmographic + behavioral − risk_flags.
5. **Classificar em band** — hot / warm / cold / disqualified.
6. **Gerar output** em Markdown + JSON estruturado.

## Output

### Tabela (Markdown)
```
| lead_id | nome | cnpj | score | band | razão_principal |
|---------|------|------|-------|------|-----------------|
```

### JSON
```json
{
  "batch_id": "...",
  "total": N,
  "by_band": { "hot": X, "warm": Y, "cold": Z, "disqualified": W },
  "source_quality_flag": "ok | warn | alert",
  "scored_leads": [...]
}
```

### Alertas
- `source_quality_flag: alert` se > 30% em cold
- listar leads disqualified com motivo

## Próximo passo
Repassa `scored_leads` pro `pricing-strategist` via workflow `leads-pipeline`.
