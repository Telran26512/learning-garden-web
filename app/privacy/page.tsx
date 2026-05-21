import Link from "next/link";
import { SynapseLogo } from "@/components/ui/synapse-logo";

export default function PrivacyPage() {
  return (
    <main className="sn-legal-page">
      <Link className="sn-auth-brand" href="/">
        <SynapseLogo size={24} />
        <span>Synapse</span>
      </Link>
      <article className="sn-legal-card">
        <p className="sn-auth-eyebrow">Privacy</p>
        <h1>隐私政策</h1>
        <p>
          Synapse
          默认把你的账号、handle、头像和公开内容作为社区资料展示。私密内容不会进入公开浏览、推荐或图谱。
        </p>
        <p>
          登录会话使用短期 access token 和 httpOnly refresh
          cookie。你可以退出登录使 refresh token 失效。
        </p>
      </article>
    </main>
  );
}
