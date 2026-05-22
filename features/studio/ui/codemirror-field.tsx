"use client";

import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { python } from "@codemirror/lang-python";
import { basicSetup, EditorView } from "codemirror";
import { useEffect, useMemo, useRef } from "react";

import { normalizeCodeLanguage } from "../model/block-editor-model";

export function CodeMirrorField({
  editable,
  language,
  minHeight = 160,
  onChange,
  value,
}: {
  editable: boolean;
  language: string;
  minHeight?: number;
  onChange: (value: string) => void;
  value: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const latestValueRef = useRef(value);
  const onChangeRef = useRef(onChange);
  const applyingExternalUpdateRef = useRef(false);

  useEffect(() => {
    latestValueRef.current = value;
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const baseExtensions = useMemo(
    () => [
      basicSetup,
      languageExtension(language),
      EditorView.lineWrapping,
      EditorView.editable.of(editable),
      EditorView.theme({
        "&": {
          backgroundColor: "transparent",
          minHeight: `${minHeight}px`,
        },
        ".cm-content": {
          caretColor: "var(--syn-working-ink)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "12px",
          lineHeight: "1.7",
          padding: "12px 0",
        },
        ".cm-gutters": {
          backgroundColor: "transparent",
          borderRight: "1px solid var(--syn-hairline-dark)",
          color: "var(--syn-working-muted)",
        },
        ".cm-line": {
          color: "var(--syn-working-ink)",
          padding: "0 14px",
        },
        ".cm-scroller": {
          fontFamily: "var(--font-mono), monospace",
        },
        "&.cm-focused": {
          outline: "none",
        },
      }),
    ],
    [editable, language, minHeight],
  );

  useEffect(() => {
    const parent = containerRef.current;

    if (!parent) {
      return;
    }

    const view = new EditorView({
      doc: latestValueRef.current,
      extensions: [
        ...baseExtensions,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !applyingExternalUpdateRef.current) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
      ],
      parent,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [baseExtensions]);

  useEffect(() => {
    const view = viewRef.current;

    if (!view || view.state.doc.toString() === value) {
      return;
    }

    applyingExternalUpdateRef.current = true;
    view.dispatch({
      changes: {
        from: 0,
        insert: value,
        to: view.state.doc.length,
      },
    });
    applyingExternalUpdateRef.current = false;
  }, [value]);

  return <div className="syn-codemirror-field" ref={containerRef} />;
}

function languageExtension(language: string) {
  const normalized = normalizeCodeLanguage(language);

  if (normalized === "javascript") {
    return javascript({ jsx: true });
  }

  if (normalized === "typescript") {
    return javascript({ jsx: true, typescript: true });
  }

  if (normalized === "markdown") {
    return markdown();
  }

  if (normalized === "python") {
    return python();
  }

  return [];
}
