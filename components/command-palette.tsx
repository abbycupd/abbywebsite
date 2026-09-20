"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  Coffee,
  GraduationCap,
  Mail,
  User,
  Github,
  Linkedin,
  Briefcase,
  NotebookPen,
  Search,
} from "lucide-react";
import { contact } from "@/data/contact";

type Item = {
  label: string;
  hint?: string;
  icon: React.ReactNode;
  action: () => void;
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const go = (hash: string) => {
    setOpen(false);
    if (window.location.pathname !== "/") {
      router.push(`/${hash}`);
    } else {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", hash);
    }
  };

  const open_ = (href: string) => {
    setOpen(false);
    if (href) window.open(href, "_blank", "noopener,noreferrer");
  };

  const items: Item[] = [
    { label: "Cupd.", hint: "coffee, captured.", icon: <Coffee size={16} />, action: () => go("#cupd") },
    {
      label: "StudyNI",
      hint: "know what to revise next.",
      icon: <GraduationCap size={16} />,
      action: () => go("#projects"),
    },
    { label: "About Abby", icon: <User size={16} />, action: () => go("#about") },
    { label: "Experience", icon: <Briefcase size={16} />, action: () => go("#experience") },
    { label: "Notes", icon: <NotebookPen size={16} />, action: () => router.push("/notes") },
    { label: "Contact", icon: <Mail size={16} />, action: () => go("#contact") },
    ...contact.links
      .filter((l) => l.label === "GitHub" || l.label === "LinkedIn")
      .map((l) => ({
        label: l.label,
        hint: l.handle,
        icon: l.label === "GitHub" ? <Github size={16} /> : <Linkedin size={16} />,
        action: () => open_(l.href),
      })),
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="label group inline-flex items-center gap-2 rounded-full border border-mist bg-paper px-3 py-1.5 transition-colors hover:border-ink/30"
        aria-label="Open command palette"
      >
        <Search size={13} className="text-graphite" />
        <span>search</span>
        <kbd className="ml-1 rounded border border-mist bg-cream px-1.5 py-0.5 text-[11px]">
          ⌘K
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Command palette"
        className="fixed inset-0 z-[90]"
      >
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          aria-hidden
        />
        <div className="fixed left-1/2 top-[18%] z-[91] w-[92vw] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-mist bg-paper shadow-2xl">
          <div className="flex items-center gap-2 border-b border-mist px-4 py-3">
            <Search size={15} className="text-graphite" />
            <Command.Input
              placeholder="Jump to…"
              className="w-full bg-transparent font-sans text-[15px] text-ink outline-none placeholder:text-graphite"
            />
          </div>
          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-graphite">
              Nothing found.
            </Command.Empty>
            {items.map((item) => (
              <Command.Item
                key={item.label}
                onSelect={item.action}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-ink data-[selected=true]:bg-cream"
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
                {item.hint && <span className="label text-xs">{item.hint}</span>}
              </Command.Item>
            ))}
          </Command.List>
        </div>
      </Command.Dialog>
    </>
  );
}
