import { SectionEyebrow } from "../primitives/section-eyebrow";
import { PRICING_PLANS } from "../data/pricing";

export function LandingPricing() {
  return (
    <section id="pricing" className="sn-section sn-section-quiet sn-reveal">
      <div className="sn-shell">
        <div className="sn-quiet-heading">
          <SectionEyebrow>05 / 账户</SectionEyebrow>
          <h2 className="sn-section-title sn-section-title-small">
            Beta 期间的账户规则。
          </h2>
          <p>
            免费层先保证能长期使用；Pro 和 Team
            只把更重的导出、协作和部署能力放进去。
          </p>
        </div>
        <div className="sn-grid-3 sn-pricing-grid sn-reveal sn-reveal-list">
          {PRICING_PLANS.map((plan) => (
            <article
              key={plan.name}
              className={[
                "sn-card sn-pricing-card",
                plan.highlight ? "sn-pricing-card-highlight" : "",
              ].join(" ")}
            >
              {plan.highlight ? (
                <div className="mb-5 inline-flex rounded bg-surface-strong px-3 py-1.5 text-[11px] font-medium text-white">
                  最适合工程师 / 研究生
                </div>
              ) : null}
              <div className="sn-pricing-name">{plan.name}</div>
              <div className="sn-pricing-price">{plan.price}</div>
              <div className="sn-pricing-sub">{plan.sub}</div>
              <a
                className={[
                  "mt-5 flex h-10 w-full items-center justify-center rounded-[8px] text-[13px] font-medium transition-colors",
                  plan.highlight
                    ? "bg-elevated text-white hover:bg-surface-strong"
                    : "border border-border-emphasis text-white hover:bg-surface-strong",
                ].join(" ")}
                href="#faq"
              >
                {plan.cta}
              </a>
              <ul className="sn-pricing-features">
                {plan.feats.map((feature) => (
                  <li key={feature} className="sn-pricing-feature">
                    <span className="sn-pricing-check">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
