import { useState } from "react";
import { FAQ_ITEMS } from "../../data/faq";
import { SectionEyebrow } from "../primitives/section-eyebrow";

export function LandingFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="sn-section sn-section-quiet sn-reveal">
      <div className="sn-shell sn-faq-shell">
        <div className="sn-quiet-heading">
          <SectionEyebrow>06 / 支持</SectionEyebrow>
          <h2 className="sn-section-title sn-section-title-small">问题</h2>
        </div>
        <div className="sn-faq-panel">
          {FAQ_ITEMS.map((item, index) => (
            <div key={item.question} className="sn-faq-item">
              <button
                type="button"
                onClick={() => setOpen(open === index ? -1 : index)}
                className="sn-faq-button"
              >
                <span>{item.question}</span>
                <span
                  className={[
                    "sn-faq-icon",
                    open === index ? "sn-faq-icon-open" : "",
                  ].join(" ")}
                >
                  +
                </span>
              </button>
              {open === index ? (
                <div className="sn-faq-answer">
                  {item.answer.length === 1
                    ? item.answer[0]
                    : item.answer.map((paragraph, paragraphIndex) => (
                        <p
                          key={paragraph}
                          className={[
                            "sn-faq-paragraph",
                            paragraphIndex === 0
                              ? ""
                              : "sn-faq-paragraph-spaced",
                          ].join(" ")}
                        >
                          {paragraph}
                        </p>
                      ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
