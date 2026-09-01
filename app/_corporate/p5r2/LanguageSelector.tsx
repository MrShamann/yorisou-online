"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./site.module.css";
import selector from "./selector.module.css";
import { PUBLIC_LOCALES, localeEntry, localeHref } from "../i18n/locales";

/**
 * CORP-P5R2 — the global language selector.
 *
 * Appears on EVERY corporate page at every width, not just the homepage. It has to present 21
 * languages — and remain usable if that becomes 40 — so it is a dialog with a filter rather than a
 * row of links or a native select.
 *
 * Accessibility contract, all implemented rather than asserted:
 *   - a real <button> with aria-haspopup/aria-expanded, never hover-only
 *   - Escape closes and returns focus to the trigger
 *   - focus moves into the filter on open and is trapped within the dialog while open
 *   - a click outside closes
 *   - the current language is marked with aria-current, not by colour alone
 *   - every option is a real link with hrefLang, so it works without JavaScript once rendered
 *   - languages are listed by ENDONYM (what speakers call their own language), never by flag
 *
 * No flag is used anywhere: flags denote countries, not languages.
 */
export default function LanguageSelector({
  locale,
  path,
  labels,
}: {
  locale: string;
  /** Current corporate path, so switching language keeps the visitor on the same page. */
  path: string;
  labels: { langLabel: string; langHeading: string; langSearch: string; langCurrent: string; close: string };
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const current = localeEntry(locale);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        btnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (
        dialogRef.current &&
        !dialogRef.current.contains(e.target as Node) &&
        !btnRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  /*
   * CORP-v1.4 — every reachable locale, read from the registry rather than filtered here.
   *
   * This line was `LOCALES.filter((l) => l.status === "published")`, which meant Japanese and
   * English and nothing else. It dated from CORP-P5R2, when "published" meant "built"; CORP-v1.2R1
   * later reused the same field to mean "cleared for Production", and this filter silently narrowed
   * from twenty-one languages to two. Nineteen complete, rendering, claim-guarded locales became
   * unreachable, and no test noticed — the selector had no coverage at all.
   *
   * Access now comes from the registry's own `access` axis, so a change to review policy cannot
   * take a language away from the people who read it. `localeSelector.test.ts` asserts the count.
   */
  const published = PUBLIC_LOCALES;
  const needle = q.trim().toLowerCase();
  const shown = needle
    ? published.filter(
        (l) =>
          l.nativeName.toLowerCase().includes(needle) ||
          l.englishName.toLowerCase().includes(needle) ||
          l.code.toLowerCase().includes(needle),
      )
    : published;

  return (
    <div className={selector.wrap}>
      <button
        ref={btnRef}
        type="button"
        className={`${styles.iconBtn} ${selector.trigger}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${labels.langLabel}: ${current.nativeName}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={selector.glyph} aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="8" cy="8" r="6.4" />
            <path d="M1.6 8h12.8M8 1.6c1.7 1.9 2.6 4 2.6 6.4S9.7 12.5 8 14.4C6.3 12.5 5.4 10.4 5.4 8S6.3 3.5 8 1.6Z" />
          </svg>
        </span>
        <span lang={current.code}>{current.nativeName}</span>
      </button>

      {open && (
        <div
          ref={dialogRef}
          className={selector.dialog}
          role="dialog"
          aria-modal="false"
          aria-label={labels.langHeading}
        >
          <div className={selector.head}>
            <p className={selector.heading}>{labels.langHeading}</p>
            <button
              type="button"
              className={selector.close}
              onClick={() => {
                setOpen(false);
                btnRef.current?.focus();
              }}
              aria-label={labels.close}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          <input
            ref={inputRef}
            type="search"
            className={selector.search}
            placeholder={labels.langSearch}
            aria-label={labels.langSearch}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <ul className={selector.list}>
            {shown.map((l) => {
              const isCurrent = l.code === locale;
              return (
                <li key={l.code}>
                  <a
                    className={selector.option}
                    href={localeHref(path, l.code)}
                    hrefLang={l.code}
                    lang={l.code}
                    dir={l.direction}
                    aria-current={isCurrent ? "true" : undefined}
                  >
                    <span className={selector.native}>{l.nativeName}</span>
                    <span className={selector.english}>{l.englishName}</span>
                    {isCurrent && <span className={selector.tick} aria-label={labels.langCurrent}>✓</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
