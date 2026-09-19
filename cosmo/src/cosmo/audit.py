"""Independent arithmetic reconciliation of produced journals (no dispatch calls)."""
from decimal import Decimal, localcontext


def audit_result(result):
    if result.get("physical") is None or result.get("economics", {}).get("total_mln") is None:
        return {"status": "NOT_APPLICABLE", "checks": 0, "errors": ["No complete journals to reconcile"]}
    with localcontext() as ctx:
        ctx.prec = 28
        errors, count = [], 0

        def equal(label, left, right, tol=Decimal("1e-9")):
            nonlocal count
            count += 1
            if abs(left - right) > tol:
                errors.append(f"{label}: {left} != {right}")

        rows = result["physical"]["intervals"]
        for i, row in enumerate(rows):
            equal(f"mass:{i}", row["opening_t"] + row["gross_t"] - row["losses_t"]
                  - row.get("curtailed_inventory_t", Decimal(0)) - row["served_t"], row["closing_t"])
            equal(f"inflow:{i}", row.get("offered_gross_t", row["gross_t"]),
                  row["gross_t"] + row.get("rejected_gross_t", Decimal(0)))
            equal(f"demand:{i}", row["served_t"] + row["shortage_t"], row["demand_t"])
            equal(f"critical:{i}", row["served_critical_t"] + row["shortage_critical_t"], row["critical_demand_t"])
            dt = row["until"] - row["at"]
            area = (row["opening_t"] - row.get("curtailed_inventory_t", Decimal(0))
                    + row["gross_t"] - row["losses_t"] + row["closing_t"]) * Decimal(dt.numerator) / Decimal(dt.denominator) / 730
            equal(f"stock_time:{i}", area, row["inventory_t_year"])
            if i:
                equal(f"continuity:{i}", rows[i - 1]["closing_t"], row["opening_t"])
        for year in result["physical"]["annual"]:
            subset = [r for r in rows if r["year"] == year["year"]]
            for field in ("offered_gross_t", "gross_t", "rejected_gross_t", "curtailed_inventory_t",
                          "losses_t", "served_t", "served_critical_t", "shortage_t", "holding_mln"):
                equal(f"year:{year['year']}:{field}", sum((r[field] for r in subset), Decimal(0)), year[field])
            equal(f"year_balance:{year['year']}", year["opening_t"] + year["gross_t"] - year["losses_t"]
                  - year["curtailed_inventory_t"] - year["served_t"], year["closing_t"])
        money = result["economics"]
        equal("money_total", sum((p.amount_mln for p in money["payments"]), Decimal(0)), money["total_mln"])
        equal("money_components", sum(money["components_mln"].values(), Decimal(0)), money["total_mln"])
        for category, total in money["components_mln"].items():
            equal("money:" + category, sum((p.amount_mln for p in money["payments"] if p.category == category), Decimal(0)), total)
        return {"status": "PASS" if not errors else "FAIL", "checks": count, "errors": errors}
