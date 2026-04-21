# simulate-fiscal-scenario

## Objetivo
Simula a carga tributária para um cenário dado (faturamento, município, ano) usando o cérebro tributário.

## Inputs
- `faturamento_anual`: R$ (ex: "10M", "4.8M", "78M")
- `municipio` (opcional, default: atual da sede): impacta ISS (2%-5%)
- `ano` (default: 2026): impacta Reforma Tributária
- `incluir_ads` (bool): se true, calcula imposto embutido em gasto de Meta/Google Ads

## Steps

1. **Carregar cérebro** — `squads/broker-leads/data/cerebro-tributario.md`.
2. **Validar enquadramento** — faturamento entre 4,8M e 78M (Lucro Presumido).
3. **Calcular base** — presunção 32% sobre receita para IRPJ/CSLL.
4. **Somar tributos**:
   - IRPJ 15% sobre base
   - Adicional IRPJ 10% sobre excedente > R$60k/trimestre
   - CSLL 9% sobre base
   - PIS 0,65% sobre receita
   - COFINS 3% sobre receita
   - ISS conforme município (default 2%)
5. **Se incluir_ads=true** — aplicar imposto embutido sobre Meta/Google Ads (tabela no cérebro).
6. **Se ano ≥ 2027** — aplicar alíquotas-teste da Reforma (CBS 0,9% + IBS 0,1% informativas em 2026; reais crescendo).

## Output

### Tabela (Markdown)
```
| Tributo | Alíquota | Base | Valor R$ | % s/ receita |
|---------|----------|------|----------|--------------|
```

### Resumo
- `carga_total_efetiva`: X% sobre receita bruta
- `carga_total_R$`: R$ N
- `margem_liquida_apos_fiscal`: Y%
- `alerta_reforma`: se houver mudança projetada próxima

## Regras
- Sempre citar linha do cérebro como fonte (#seção, #tabela).
- Nunca inventar alíquota — se não estiver no cérebro, responder "fora do escopo".
