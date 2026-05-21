import { SynapseLogo } from "@/components/ui/synapse-logo";

export function LandingNav() {
  return (
    <header className="sn-nav">
      <a className="sn-brand" href="#top" aria-label="Synapse 首页">
        <SynapseLogo size={22} />
        <span className="sn-brand-name">Synapse</span>
        <span className="sn-beta">BETA</span>
      </a>
      <nav className="sn-nav-links" aria-label="首页导航">
        <a href="#product">产品</a>
        <a href="#community">社区 Explore</a>
        <a href="#workflow">文档</a>
        <a href="#pricing">定价</a>
        <a href="#faq">更新日志</a>
      </nav>
      <div className="sn-nav-actions">
        <a
          className="text-sm font-normal text-text-muted transition-colors hover:text-neutral-dark"
          href="/auth?mode=login"
        >
          Log in
        </a>
      </div>
    </header>
  );
}
