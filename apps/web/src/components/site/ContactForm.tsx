"use client";

import { useId, useState, type FormEvent } from "react";
import styles from "./ContactForm.module.css";
import { ERROR_TEXT, LIMITS, SENT_TEXT, TOPICS, sendContact, type ContactError, type ContactInput } from "./contact";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; error: ContactError };

const EMPTY: ContactInput = { name: "", email: "", topic: "", message: "", website: "" };

/**
 * Contact card on the blue CTA band: labelled fields, an optional topic radio
 * group styled as pills, and a mailto fallback. Posts to the API's public /contact.
 */
export function ContactForm({ email }: { email?: string }) {
  const id = useId();
  const [fields, setFields] = useState<ContactInput>(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const sending = status.kind === "sending";
  const set = (k: Exclude<keyof ContactInput, "topic">) => (e: { target: { value: string } }) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setStatus({ kind: "sending" });
    const out = await sendContact(fields);
    if (out.ok) {
      setFields(EMPTY);
      setStatus({ kind: "sent" });
    } else {
      setStatus({ kind: "error", error: out.error });
    }
  }

  const mailto = email ? <a href={`mailto:${email}`}>or email me directly</a> : null;

  if (status.kind === "sent") {
    return (
      <div className={styles.card}>
        <h3 className={styles.title}>Message sent</h3>
        <p className={styles.sent} role="status">
          {SENT_TEXT}
        </p>
        <button type="button" className={styles.again} onClick={() => setStatus({ kind: "idle" })}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className={styles.card} onSubmit={onSubmit} aria-labelledby={`${id}-title`} aria-describedby={`${id}-sub`}>
      <h3 className={styles.title} id={`${id}-title`}>
        Send a message
      </h3>
      <p className={styles.sub} id={`${id}-sub`}>
        I usually reply within 1–2 days (GMT+7).
      </p>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor={`${id}-name`} className={styles.label}>
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            className={styles.input}
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITS.name}
            value={fields.name}
            onChange={set("name")}
            disabled={sending}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor={`${id}-email`} className={styles.label}>
            Email
          </label>
          <input
            id={`${id}-email`}
            name="email"
            className={styles.input}
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
        </div>
      </div>

      <fieldset className={styles.topics} disabled={sending}>
        <legend className={styles.label}>
          What&apos;s it about? <span className={styles.optional}>(optional)</span>
        </legend>
        <div className={styles.pills}>
          {TOPICS.map((t) => (
            <label key={t.value} className={styles.pill}>
              <input
                type="radio"
                name="topic"
                value={t.value}
                className={styles.radio}
                checked={fields.topic === t.value}
                onChange={() => setFields((f) => ({ ...f, topic: t.value }))}
              />
              <span className={styles.pillText}>{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label htmlFor={`${id}-message`} className={styles.label}>
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          className={`${styles.input} ${styles.area}`}
          rows={5}
          placeholder="A few lines about what you have in mind"
          required
          minLength={LIMITS.messageMin}
          maxLength={LIMITS.messageMax}
          aria-describedby={`${id}-message-hint`}
          value={fields.message}
          onChange={set("message")}
          disabled={sending}
        />
        <p className={styles.hint} id={`${id}-message-hint`}>
          At least {LIMITS.messageMin} characters.
        </p>
      </div>

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
        <button type="submit" className={styles.send} disabled={sending} aria-busy={sending}>
          {sending ? "Sending…" : "Send message"}
        </button>
        {mailto && <span className={styles.alt}>{mailto}</span>}
      </div>
    </form>
  );
}
