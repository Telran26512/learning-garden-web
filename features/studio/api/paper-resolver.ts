import type { PaperBlockAttrs } from "../model/tiptap-block-schema";
import { studioRequest } from "./studio-request";

export type ResolvedPaper = {
  abstract: string;
  authors: string[];
  canonicalKey: string;
  doiUrl?: string;
  id: string;
  pdfUrl?: string;
  ref: string;
  source: "arxiv" | "doi" | "manual";
  title: string;
};

export async function resolvePaperReference(value: string) {
  const ref = value.trim();
  if (!ref) {
    throw new Error("请输入 arXiv 或 DOI");
  }

  return studioRequest<ResolvedPaper>(
    `/api/v1/papers/resolve?ref=${encodeURIComponent(ref)}`,
  );
}

export function paperBlockAttrsFromResolvedPaper(
  paper: ResolvedPaper,
  existingQuote = "",
): Pick<PaperBlockAttrs, "quote" | "ref" | "source" | "title"> {
  return {
    quote: existingQuote.trim() || paper.abstract || "",
    ref: paper.ref,
    source: normalizePaperSource(paper.source),
    title: paper.title || paper.ref,
  };
}

function normalizePaperSource(value: string): PaperBlockAttrs["source"] {
  if (value === "arxiv" || value === "doi") {
    return value;
  }

  return "manual";
}
