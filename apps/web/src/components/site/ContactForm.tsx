"use client";

import { useId, useState, type FormEvent } from "react";
import styles from "./ContactForm.module.css";
import {
  LIMITS,
  SENT_TEXT,
  SENT_TITLE,
  TOPICS,
  errorMessage,
  isBusy,
  sendContact,
  submitLabel,
  type ContactInput,
  type ContactStatus,
} from "./contact";

const EMPTY: ContactInput = { name: "", email: "", topic: "", message: "", website: "" };

/**
 * The form inside the contact dialog: Name + Email, optional topic chips (a radio
 * group), message, honeypot, inline errors and a success panel. Posts to the
 * API's public /contact. `initialStatus` exists so each state can be rendered in tests.
 */
export function ContactForm({
  email,
  onClose,
  onSent,
  initialStatus = { kind: "idle" },
}: {
  email?: string;
  onClose?: () => void;
  onSent?: () => void;
  initialStatus?: ContactStatus;
}) {
  const id = useId();
  const [fields, setFields] = useState<ContactInput>(EMPTY);
  const [status, setStatus] = useState<ContactStatus>(initialStatus);
  const sending = isBusy(status);
  const error = errorMessage(status);
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
      onSent?.();
    } else {
      setStatus({ kind: "error", error: out.error });
    }
  }

  if (status.kind === "sent") {
    return (
      <div className={styles.sent} role="status">
        <span className={styles.check} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className={styles.sentTitle}>{SENT_TITLE}</h3>
        <p className={styles.sentText}>{SENT_TEXT}</p>
        {onClose && (
          <button type="button" className={styles.send} onClick={onClose}>
            Close
          </button>
        )}
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} aria-busy={sending}>
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
          Topic <span className={styles.optional}>(optional)</span>
        </legend>
        <div className={styles.chips}>
          {TOPICS.map((t) => (
            <label key={t.value} className={styles.chip}>
              <input
                type="radio"
                name="topic"
                value={t.value}
                className={styles.radio}
                checked={fields.topic === t.value}
                onChange={() => setFields((f) => ({ ...f, topic: t.value }))}
              />
              <span className={styles.chipText}>{t.label}</span>
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

      {error && (
        <p className={styles.error} role="alert">
          {error}.
        </p>
      )}

      <button type="submit" className={styles.send} disabled={sending}>
        {sending && <span className={styles.spinner} aria-hidden="true" />}
        {submitLabel(status)}
      </button>
      {email && (
        <p className={styles.alt}>
          or email me at <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}
    </form>
  );
}
