export type ReaderAction = "bookmark" | "comment" | "follow" | "like" | "share";

type RunReaderActionOptions = {
  action: ReaderAction;
  execute: () => Promise<unknown>;
  refresh: () => Promise<unknown>;
  setNotice: (value: string) => void;
  setPendingAction: (value: ReaderAction | null) => void;
};

const actionLabels: Record<ReaderAction, string> = {
  bookmark: "Bookmark",
  comment: "评论",
  follow: "关注",
  like: "Like",
  share: "Share",
};

export async function runReaderAction({
  action,
  execute,
  refresh,
  setNotice,
  setPendingAction,
}: RunReaderActionOptions) {
  setPendingAction(action);

  try {
    await execute();
    await refresh();
    return true;
  } catch (error) {
    setNotice(readerActionFailureMessage(action, error));
    return false;
  } finally {
    setPendingAction(null);
  }
}

export function readerActionFailureMessage(
  action: ReaderAction,
  error: unknown,
) {
  const message = error instanceof Error ? error.message : "操作失败";
  const label = actionLabels[action];
  const suffix = /^[A-Za-z]/u.test(label) ? " 失败" : "失败";

  return `${label}${suffix}：${message}`;
}
