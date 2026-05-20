import type { ReactNode } from "react";
import { SynapseLogo } from "@/components/synapse/synapse-logo";
import { FOOTER_GROUPS } from "../data/footer";

export function LandingFooter() {
  return (
    <footer className="sn-footer">
      <div className="sn-shell">
        <div className="relative">
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <FooterSocialLink href="https://x.com" label="Twitter / X">
              <path d="M13.6 2h2.1l-4.7 5.4 5.5 7.3h-4.3L8.9 10.3 5 14.7H2.9l5-5.7L2.6 2h4.4l3 4 3.6-4Zm-.7 11.4h1.2L6.4 3.2H5.1l7.8 10.2Z" />
            </FooterSocialLink>
            <FooterSocialLink href="https://discord.com" label="Discord">
              <path d="M13.5 4.1A11 11 0 0 0 10.8 3l-.1.2c-.1.2-.2.4-.3.6a10.2 10.2 0 0 0-3 0 4.8 4.8 0 0 0-.4-.8 11 11 0 0 0-2.7 1.1A11.5 11.5 0 0 0 2.3 12c1.1.8 2.2 1.3 3.3 1.7l.7-1.1-1.1-.5.3-.2c2.1 1 4.3 1 6.4 0l.3.2-1.1.5.7 1.1c1.1-.3 2.2-.9 3.3-1.7a11.5 11.5 0 0 0-1.6-7.9ZM6.8 10.4c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3c.7 0 1.2.6 1.2 1.3s-.5 1.3-1.2 1.3Zm4.4 0c-.7 0-1.2-.6-1.2-1.3s.5-1.3 1.2-1.3c.6 0 1.1.6 1.1 1.3s-.5 1.3-1.1 1.3Z" />
            </FooterSocialLink>
            <FooterSocialLink href="mailto:hello@synapse.dev" label="Email">
              <path d="M2.5 3.5h11A1.5 1.5 0 0 1 15 5v6a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 11V5a1.5 1.5 0 0 1 1.5-1.5Zm.2 1.3 5.3 4 5.3-4H2.7Zm11 1.2-5.2 3.9a.8.8 0 0 1-1 0L2.3 6V11c0 .1.1.2.2.2h11c.1 0 .2-.1.2-.2V6Z" />
            </FooterSocialLink>
          </div>
          <div className="sn-footer-grid">
            <div>
              <div className="sn-footer-logo-row">
                <SynapseLogo size={20} />
                <span className="sn-footer-brand-name">Synapse</span>
              </div>
              <p className="sn-footer-tagline">
                让你的 AI 学习不再是孤岛。数学 ↔ 代码 ↔ 论文
                三位一体的学习社区。
              </p>
            </div>
            {FOOTER_GROUPS.map(([group, links]) => (
              <div key={group}>
                <div className="sn-footer-group-title">{group}</div>
                <ul className="sn-footer-links">
                  {links.map((item) => (
                    <li key={item} className="sn-footer-link-item">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="sn-footer-bottom">
          <div>© 2026 Synapse · Made in Hangzhou · v0.7.2</div>
          <div className="sn-footer-locale">
            <span>中文</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterSocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      aria-label={label}
      className="inline-flex size-4 text-text-muted transition-colors hover:text-white"
      href={href}
    >
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 16 16">
        {children}
      </svg>
    </a>
  );
}
