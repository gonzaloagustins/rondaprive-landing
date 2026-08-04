import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

/**
 * Before and after, four lines each.
 *
 * A real <table>: this is tabular data — two conditions compared across four
 * dimensions — and the header cells are what tell a screen reader which column
 * a sentence belongs to. Faking it with divs would lose that.
 *
 * No check or cross icons, and no green or red. A comparison drawn in state
 * colour reads as scoring rather than describing, and this page already spends
 * green on one thing only: an order that is ready. The hierarchy comes from
 * type — muted on the left, foreground weight on the right — and from the tint
 * behind the right column.
 *
 * On mobile the table stops being a table: every row becomes its own stacked
 * pair, with the column names repeated small above each half, because a
 * two-column table at 375px is four columns of one word each. The layout
 * switches with display utilities rather than a second copy of the markup, so
 * there is one DOM and one source of the strings.
 */
const PickupComparison = () => {
  const { t } = useTranslation();
  const before = t("product.pickup.comparison.before");
  const after = t("product.pickup.comparison.after");
  const rows = t("product.pickup.comparison.rows", {
    returnObjects: true,
    defaultValue: [],
  }) as { before: string; after: string }[];

  if (rows.length === 0) return null;

  const columnLabel = "text-[10px] font-semibold uppercase tracking-[0.14em]";

  return (
    <section className="pb-16">
      <div className="section-container">
        <table className="w-full border-collapse text-left">
          <thead className="hidden md:table-header-group">
            <tr>
              <th
                scope="col"
                className={cn(columnLabel, "w-1/2 pb-3 pr-8 text-muted-foreground")}
              >
                {before}
              </th>
              <th
                scope="col"
                className={cn(
                  columnLabel,
                  "w-1/2 rounded-t-xl bg-secondary/60 px-6 pt-4 pb-3 text-foreground",
                )}
              >
                {after}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const last = i === rows.length - 1;
              return (
                <tr
                  key={row.after}
                  className="block md:table-row [&:not(:last-child)]:mb-6 md:[&:not(:last-child)]:mb-0"
                >
                  <td className="block border-t border-border/50 py-3 pr-8 align-top text-muted-foreground md:table-cell">
                    <span className={cn(columnLabel, "mb-1 block md:hidden")}>
                      {before}
                    </span>
                    {row.before}
                  </td>
                  <td
                    className={cn(
                      "block rounded-xl bg-secondary/60 px-6 py-3 align-top font-medium md:table-cell md:rounded-none",
                      last && "md:rounded-b-xl",
                    )}
                  >
                    <span
                      className={cn(
                        columnLabel,
                        "mb-1 block text-muted-foreground md:hidden",
                      )}
                    >
                      {after}
                    </span>
                    {row.after}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PickupComparison;
