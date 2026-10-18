"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent, type MouseEvent } from "react";
import styles from "./ContactDialog.module.css";
import { ContactForm } from "./ContactForm";
import { CONTACT_DIALOG_ID, CONTACT_OPEN_ATTR } from "./contact";

const visible = (el: Element | null): el is HTMLElement =>
  el instanceof HTMLElement && el.isConnected && el.getClientRects().length > 0;

/**
 * One contact dialog for the whole site, mounted once in the layout. Any element
 * with `data-contact-open` (nav link, mobile-menu link, CTA button) opens it; those
 * keep a real href (/#contact or mailto:) as the no-JS fallback.
 *
 * Native <dialog> + showModal(): focus trap, Esc and the inert page come for free.
 * On top: page scroll lock, backdrop click to close, focus back to the opener.
 */
export function ContactDialog({ email }: { email?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const downOnBackdrop = useRef(false);
  const sent = useRef(false);
  const [formKey, setFormKey] = useState(0);

  const close = useCallback(() => ref.current?.close(), []);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const root = document.documentElement;
    let prevOverflow = "";

    const open = (trigger: HTMLElement) => {
      if (dialog.open) return;
      // A link inside the (now closing) mobile menu is gone; fall back to whatever has focus.
      opener.current = visible(trigger) ? trigger : visible(document.activeElement) ? document.activeElement : null;
      prevOverflow = root.style.overflow;
      root.style.overflow = "hidden";
      dialog.showModal();
    };

    const onClick = (e: globalThis.MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const trigger = (e.target as Element | null)?.closest?.(`[${CONTACT_OPEN_ATTR}]`);
      if (!(trigger instanceof HTMLElement)) return;
      // Capture phase, before React: next/link sees defaultPrevented and skips navigating,
      // while the trigger's own onClick (e.g. closing the mobile menu) still runs.
      e.preventDefault();
      setTimeout(() => open(trigger), 0);
    };

    const onClose = () => {
      root.style.overflow = prevOverflow;
      const back = opener.current;
      opener.current = null;
      if (visible(back)) back.focus({ preventScroll: true });
      if (sent.current) {
        // next open starts with a fresh form instead of the success panel
        sent.current = false;
        setFormKey((k) => k + 1);
      }
    };

    document.addEventListener("click", onClick, true);
    dialog.addEventListener("close", onClose);
    return () => {
      document.removeEventListener("click", onClick, true);
      dialog.removeEventListener("close", onClose);
      if (dialog.open) dialog.close();
      root.style.overflow = prevOverflow;
    };
  }, []);

  // The panel fills the <dialog>, so a click whose target is the dialog itself
  // landed on ::backdrop. Require the press to start there too (no drag-to-close).
  const onPointerDown = (e: PointerEvent<HTMLDialogElement>) => {
    downOnBackdrop.current = e.target === e.currentTarget;
  };
  const onBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (downOnBackdrop.current && e.target === e.currentTarget) close();
    downOnBackdrop.current = false;
  };

  return (
    <dialog
      ref={ref}
      id={CONTACT_DIALOG_ID}
      className={styles.dialog}
      aria-labelledby={`${CONTACT_DIALOG_ID}-title`}
      aria-describedby={`${CONTACT_DIALOG_ID}-sub`}
      onPointerDown={onPointerDown}
      onClick={onBackdropClick}
    >
      <div className={styles.panel}>
        <div className={styles.head}>
          <div>
            <h2 className={styles.title} id={`${CONTACT_DIALOG_ID}-title`}>
              Let&apos;s talk
            </h2>
            <p className={styles.sub} id={`${CONTACT_DIALOG_ID}-sub`}>
              I usually reply within 1–2 days (GMT+7).
            </p>
          </div>
          <button type="button" className={styles.close} aria-label="Close" onClick={close}>
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ContactForm
          key={formKey}
          email={email}
          onClose={close}
          onSent={() => {
            sent.current = true;
          }}
        />
      </div>
    </dialog>
  );
}

/** The CTA band's single primary action: a white pill that opens the dialog. */
export function ContactButton({ email, label = "Contact me" }: { email?: string; label?: string }) {
  return (
    <a
      href={email ? `mailto:${email}` : "/#contact"}
      className={styles.ctaButton}
      aria-haspopup="dialog"
      {...{ [CONTACT_OPEN_ATTR]: "" }}
    >
      {label}
      <span aria-hidden="true">→</span>
    </a>
  );
}
