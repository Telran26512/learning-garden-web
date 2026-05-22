import { contentTypes } from "../model/editor-fixtures";
import type {
  StudioContentType,
  StudioDraft,
} from "../model/studio-editor-model";
import { SidebarLabel } from "./studio-fields";

export function StudioSidebar({
  currentDraft,
  drafts,
  onCreateDraft,
  onDraftSelect,
  onTypeSelect,
}: {
  currentDraft: StudioDraft;
  drafts: StudioDraft[];
  onCreateDraft: () => void;
  onDraftSelect: (id: string) => void;
  onTypeSelect: (contentType: StudioContentType) => void;
}) {
  return (
    <aside className="sticky top-0 min-h-0 h-full overflow-y-auto border-r border-[var(--syn-hairline-dark)] bg-[var(--syn-working-bg)] px-3 py-5">
      {/* §4 label 只保留中文，无大写英文/letter-spacing */}
      <SidebarLabel>类型</SidebarLabel>
      <div className="space-y-1">
        {contentTypes.map(([name, description]) => {
          const active = currentDraft.contentType === name;

          return (
            <button
              className="relative block w-full rounded-[var(--syn-radius)] bg-transparent px-3 py-2.5 text-left transition hover:bg-white/[0.03]"
              key={name}
              onClick={() => onTypeSelect(name)}
              title={description}
              type="button"
            >
              {active ? (
                <span className="absolute left-0 top-2.5 h-7 w-0.5 rounded-full bg-white" />
              ) : null}
              <span
                className={
                  active
                    ? "block text-[12.5px] font-medium text-[var(--syn-working-ink)]"
                    : "block text-[12.5px] font-medium text-[var(--syn-working-secondary)]"
                }
              >
                {name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <SidebarLabel>草稿 · {drafts.length}</SidebarLabel>
        <ul className="space-y-1">
          {drafts.map((draft) => {
            const active = currentDraft.id === draft.id;

            return (
              <li key={draft.id}>
                <button
                  className="relative block w-full rounded-[var(--syn-radius)] bg-transparent px-3 py-2 text-left transition hover:bg-white/[0.03]"
                  onClick={() => onDraftSelect(draft.id)}
                  type="button"
                >
                  {/* §1.j 当前草稿选中态改为竖线 + 白字，不再边框包围 */}
                  {active ? (
                    <span className="absolute left-0 top-2 h-7 w-0.5 rounded-full bg-white" />
                  ) : null}
                  <span
                    className={
                      active
                        ? "block text-[12px] font-medium text-[var(--syn-working-ink)]"
                        : "block text-[12px] text-[var(--syn-working-secondary)]"
                    }
                  >
                    {draft.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-[var(--syn-working-muted)]">
                    {draft.updatedAtLabel}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <button
        className="mt-5 inline-flex items-center gap-1.5 bg-transparent px-0 py-1.5 text-[14px] text-[var(--syn-working-muted)] transition hover:text-[var(--syn-working-ink)]"
        onClick={onCreateDraft}
        type="button"
      >
        {/* §5 Add 按钮改为克制的 inline 文字按钮，无边框无背景 */}
        <span>+</span>
        新建草稿
      </button>
    </aside>
  );
}
