"use client";

import { useState } from "react";

import styles from "./site.module.css";
import form from "./form.module.css";
/**
 * The EXACT data this form needs, and nothing else.
 *
 * It previously received the whole `SiteCopy`, which carries interpolation helpers such as
 * `common.readMore(name)`. Functions cannot cross the Server/Client boundary, so every locale of
 * /contact returned HTTP 500. Narrowing the contract fixes that at the root rather than by making
 * the translation object serializable: the client is handed plain strings, the payload shipped to
 * the browser shrinks to what is rendered, and a function added to `SiteCopy` later cannot
 * reintroduce the fault.
 */
export type ContactFormCopy = {
  fields: {
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    org: string;
    orgPlaceholder: string;
    type: string;
    message: string;
    messagePlaceholder: string;
  };
  types: readonly { value: string; label: string }[];
  required: string;
  submit: string;
  sending: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
  privacyNote: string;
};

/**
 * CORP-P5R2 — the corporate contact form.
 *
 * The only secret-bearing work happens server-side in /api/corporate-contact. Nothing here holds a
 * key, a destination address, or any private mailbox: the browser posts a plain JSON body and the
 * server decides where it goes. The Founder's personal address never reaches the client bundle.
 *
 * `company_website` is a honeypot — invisible to people, attractive to bots. It is kept out of the
 * accessibility tree and out of the tab order rather than merely hidden with CSS.
 */
export default function ContactForm({ copy, locale }: { copy: ContactFormCopy; locale: string }) {
  const c = copy;
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/corporate-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          org: String(fd.get("org") ?? ""),
          type: String(fd.get("type") ?? "general"),
          message: String(fd.get("message") ?? ""),
          company_website: String(fd.get("company_website") ?? ""),
          locale,
        }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className={form.result} role="status" aria-live="polite">
        <p className={form.resultTitle}>{c.successTitle}</p>
        <p className={form.resultBody}>{c.successBody}</p>
      </div>
    );
  }

  return (
    <form className={form.form} onSubmit={onSubmit} noValidate={false}>
      <div className={form.row}>
        <label className={form.label} htmlFor="cf-name">
          {c.fields.name} <span className={form.req}>{c.required}</span>
        </label>
        <input className={form.input} id="cf-name" name="name" required autoComplete="name" placeholder={c.fields.namePlaceholder} />
      </div>

      <div className={form.row}>
        <label className={form.label} htmlFor="cf-email">
          {c.fields.email} <span className={form.req}>{c.required}</span>
        </label>
        <input className={form.input} id="cf-email" name="email" type="email" required autoComplete="email" placeholder={c.fields.emailPlaceholder} />
      </div>

      <div className={form.row}>
        <label className={form.label} htmlFor="cf-org">{c.fields.org}</label>
        <input className={form.input} id="cf-org" name="org" autoComplete="organization" placeholder={c.fields.orgPlaceholder} />
      </div>

      <div className={form.row}>
        <label className={form.label} htmlFor="cf-type">{c.fields.type}</label>
        <select className={form.input} id="cf-type" name="type" defaultValue="general">
          {c.types.map((t) => (
            <option value={t.value} key={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className={form.row}>
        <label className={form.label} htmlFor="cf-message">
          {c.fields.message} <span className={form.req}>{c.required}</span>
        </label>
        <textarea className={`${form.input} ${form.textarea}`} id="cf-message" name="message" required rows={7} placeholder={c.fields.messagePlaceholder} />
      </div>

      {/* honeypot: removed from the a11y tree and the tab order, not just visually hidden */}
      <div className={form.trap} aria-hidden="true">
        <label htmlFor="cf-company-website">Company website</label>
        <input id="cf-company-website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      {state === "error" && (
        <div className={form.error} role="alert">
          <p className={form.resultTitle}>{c.errorTitle}</p>
          <p className={form.resultBody}>{c.errorBody}</p>
        </div>
      )}

      <div className={form.actions}>
        <button className={styles.btn} type="submit" disabled={state === "sending"}>
          {state === "sending" ? c.sending : c.submit}
        </button>
        <p className={form.privacy}>{c.privacyNote}</p>
      </div>
    </form>
  );
}
