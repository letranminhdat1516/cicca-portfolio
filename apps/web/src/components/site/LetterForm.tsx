"use client";

import { useId, useState, type FormEvent } from "react";
import styles from "./LetterForm.module.css";
import { ERROR_TEXT, LIMITS, SENT_TEXT, sendLetter, type LetterError } from "./letter";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; error: LetterError };

const EMPTY = { name: "", email: "", message: "", website: "" };

/**
 * "Dear Dat, I am ___, reach me at ___, and I'd like to talk about ___".
 * The letter's phrases are the real <label>s, with a hidden hint naming each
 * field for screen readers. Posts to the API's public /contact endpoint.
 */
export function LetterForm({ email }: { email?: string }) {
  const id = useId();
  const [fields, setFields] = useState(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const sending = status.kind === "sending";
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setStatus({ kind: "sending" });
    const out = await sendLetter(fields);
    if (out.ok) {
      setFields(EMPTY);
      setStatus({ kind: "sent" });
    } else {
      setStatus({ kind: "error", error: out.error });
    }
  }

  const mailto = email ? (
    <a href={`mailto:${email}`}>or email me directly</a>
  ) : null;

  if (status.kind === "sent") {
    return (
      <div className={styles.paper}>
        <p className={styles.salute}>Signed, sealed, delivered.</p>
        <p className={styles.sent} role="status">
          {SENT_TEXT}
        </p>
        <button type="button" className={styles.again} onClick={() => setStatus({ kind: "idle" })}>
          Write another letter
        </button>
      </div>
    );
  }

  return (
    <form className={styles.paper} onSubmit={onSubmit} aria-labelledby={`${id}-to`}>
      <p className={styles.salute} id={`${id}-to`}>
        Dear Dat,
      </p>
      <p className={styles.body}>
        <label htmlFor={`${id}-name`} className={styles.phrase}>
          I am<span className={styles.srOnly}> (your name)</span>
        </label>
        <input
          id={`${id}-name`}
          name="name"
          className={styles.blank}
          type="text"
          autoComplete="name"
          placeholder="your name"
          required
          maxLength={LIMITS.name}
          value={fields.name}
          onChange={set("name")}
          disabled={sending}
        />
        <span className={styles.phrase}>, </span>
        <label htmlFor={`${id}-email`} className={styles.phrase}>
          reach me at<span className={styles.srOnly}> (your email)</span>
        </label>
        <input
          id={`${id}-email`}
          name="email"
          className={styles.blank}
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          required
          maxLength={LIMITS.email}
          value={fields.email}
          onChange={set("email")}
          disabled={sending}
        />
        <span className={styles.phrase}>, </span>
        <label htmlFor={`${id}-message`} className={styles.phrase}>
          and I&apos;d like to talk about<span className={styles.srOnly}> (your message)</span>
        </label>
      </p>
      <textarea
        id={`${id}-message`}
        name="message"
        className={styles.area}
        rows={3}
        placeholder="a role, a system that needs to reach production, a wild idea…"
        required
        minLength={LIMITS.messageMin}
        maxLength={LIMITS.messageMax}
        value={fields.message}
        onChange={set("message")}
        disabled={sending}
      />

      <div className={styles.trap} aria-hidden="true">
        <label htmlFor={`${id}-website`}>Leave this field empty</label>
        <input
          id={`${id}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={set("website")}
        />
      </div>

      {status.kind === "error" && (
        <p className={styles.error} role="alert">
          {ERROR_TEXT[status.error]}
          {mailto ? <> — {mailto}.</> : "."}
        </p>
      )}

      <div className={styles.foot}>
        <span className={styles.sign}>I read every letter · GMT+7</span>
        <button type="submit" className={styles.send} disabled={sending} aria-busy={sending}>
          {sending ? "Sending…" : "Send the letter"}
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </form>
  );
}
