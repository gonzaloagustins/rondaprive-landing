import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * The other side of the counter, in one tablet.
 *
 * Compra y Retira ends with the customer holding an order number, which only
 * means something because someone at the bar is looking at the same number.
 * This is the handoff to that page — a teaser, not a section: one screen, no
 * queue of waiting tickets and no status columns, because that is the content
 * of the bar and kitchen page and repeating it here would make this a second
 * walkthrough on a page that already has one.
 *
 * The ticket is deliberately the same order as steps 02 and 03: same number,
 * same two items. Continuity is the whole argument — one order, two screens.
 *
 * It is in preparation, so nothing here is green. Green is the signal the
 * customer's phone gives when the order is ready, and it only means that
 * because it is never used for anything else.
 *
 * Layout mirrors the walkthrough — visual left, text right — so the two blocks
 * read as different things rather than a repeat.
 */

interface KitchenTeaserProps {
  /** Already-localized href for the bar & kitchen page. */
  to: string;
}

const KitchenTeaser = ({ to }: KitchenTeaserProps) => {
  const { t } = useTranslation();
  const c = (key: string) => t(`product.pickup.kitchenTeaser.${key}`);
  const s = (key: string) => t(`product.pickup.screens.${key}`);

  // Same two items, and the same number the phone shows once the order is
  // placed — read from the walkthrough's own keys so they cannot drift.
  const items = [s("item1Name"), s("item2Name")];

  return (
    <section className="pb-16">
      <div className="section-container">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
          {/* Tablet. Decorative: the copy beside it already says what it shows. */}
          <div aria-hidden className="flex-shrink-0">
            <div className="relative w-[300px] h-[188px] rounded-[1.25rem] bg-[#1A1814] p-2.5 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.4)]">
              <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/25" />
              <div className="w-full h-full rounded-[0.85rem] bg-background overflow-hidden flex flex-col px-3.5 py-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[11px] font-bold tracking-tight">
                    Ronda
                  </span>
                  <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {s("barName")}
                  </span>
                </div>

                <div className="mt-2 flex-1 rounded-xl border border-border bg-muted/40 p-3 flex flex-col">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {c("ticketLabel")}
                      </p>
                      <p className="font-display text-xl font-bold leading-none mt-0.5">
                        #{s("orderNumber").replace(/^[A-Za-z]/, "")}
                      </p>
                    </div>
                    {/* Neutral chip, not green: this one is still being made. */}
                    <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      {s("preparingBanner")}
                    </span>
                  </div>

                  <ul className="mt-2 space-y-0.5">
                    {items.map((name) => (
                      <li
                        key={name}
                        className="flex items-center justify-between text-[9px]"
                      >
                        <span className="font-medium truncate">{name}</span>
                        <span className="text-muted-foreground flex-shrink-0">×1</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto rounded-lg bg-primary px-3 py-1.5 text-center text-[10px] font-semibold text-primary-foreground">
                    {c("action")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-xl">
            <h2 className="text-xl font-bold">{c("title")}</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              {c("description")}
            </p>
            <Link
              to={to}
              className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            >
              {c("link")}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KitchenTeaser;
