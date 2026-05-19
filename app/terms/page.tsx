import Link from "next/link";
import { SynapseLogo } from "@/components/synapse/synapse-logo";

export default function TermsPage() {
  return (
    <main className="sn-legal-page">
      <Link className="sn-auth-brand" href="/">
        <SynapseLogo size={24} />
        <span>Synapse</span>
      </Link>
      <article className="sn-legal-card">
        <p className="sn-auth-eyebrow">Terms</p>
        <h1>服务条款</h1>
        <p>
          Synapse
          当前处于早期开发阶段。请仅上传你有权保存、展示或分享的学习内容。
          公开发布的内容可能被其他用户浏览、评论、引用或收藏。
        </p>
        <p>
          你需要对账号安全和发布内容负责。平台会保留处理滥用、侵权、垃圾信息和安全风险的权利。
        </p>
      </article>
    </main>
  );
}
