"use client";
import { useState } from "react";
import Link from "next/link";
import { REPO_TREE, type RepoNode } from "@/data/home";
import { FolderIcon, LinkOutIcon, LockIcon, MONO } from "./ui";

const pad = (depth: number) => `${24 + depth * 26}px`;

function RepoLink({ node, depth }: { node: RepoNode; depth: number }) {
  const href = node.href ?? "#desk";
  const external = /^https?:/.test(href);
  const style = {
    ...MONO,
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 10,
    minHeight: 44,
    padding: `0 24px 0 ${pad(depth)}`,
    fontSize: 13,
    color: "#C9D4F2",
  } as const;
  const inner = (
    <>
      <FolderIcon />
      <span style={{ flex: "1 1 auto" }}>{node.name}</span>
      {!node.public && !node.soon && <LockIcon />}
      {node.public && <LinkOutIcon />}
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noopener" style={style}>
      {inner}
    </a>
  ) : (
    <Link href={href} style={style}>
      {inner}
    </Link>
  );
}

/** "Repos I'm in" — folders collapse/expand; leaves link to repos or case studies. */
export function RepoTree() {
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  const rows: React.ReactNode[] = [];
  const walk = (nodes: RepoNode[], depth: number) =>
    nodes.forEach((n) => {
      if (n.children) {
        const id = n.id ?? n.name;
        const open = !closed[id];
        const groupId = `repo-group-${id}`;
        rows.push(
          <li key={`g-${id}`} style={{ borderBottom: "1px solid rgba(111,168,255,0.08)" }}>
            <button
              type="button"
              className="btn-reset"
              aria-expanded={open}
              aria-controls={groupId}
              onClick={() => setClosed((c) => ({ ...c, [id]: open }))}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                minHeight: 46,
                padding: `0 24px 0 ${pad(depth)}`,
                fontSize: 16,
                fontWeight: 600,
                color: "#E8EEFF",
              }}
            >
              <svg
                aria-hidden="true"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E8EEFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: `rotate(${open ? "0deg" : "-90deg"})`, transition: "transform .2s ease" }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
              <FolderIcon size={20} fill={open ? "rgba(47,123,255,0.35)" : "none"} stroke="#6FA8FF" width={1.6} />
              <span>{n.name}</span>
            </button>
            {open && (
              <ul id={groupId} style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {n.children.map((c) =>
                  c.children ? null : (
                    <li key={c.name} style={{ borderTop: "1px solid rgba(111,168,255,0.08)" }}>
                      <RepoLink node={c} depth={depth + 1} />
                    </li>
                  ),
                )}
              </ul>
            )}
          </li>,
        );
      } else {
        rows.push(
          <li key={n.name} style={{ borderBottom: "1px solid rgba(111,168,255,0.08)" }}>
            <RepoLink node={n} depth={depth} />
          </li>,
        );
      }
    });
  walk(REPO_TREE, 0);

  return (
    <ul aria-label="Repositories" style={{ margin: 0, padding: 0, listStyle: "none" }}>
      {rows}
    </ul>
  );
}
