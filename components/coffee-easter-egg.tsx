"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee } from "lucide-react";

const TRIGGER = "coffee";

/**
 * Type the word "coffee" anywhere on the site to trigger a tiny moment.
 * Listens globally, ignores typing inside inputs/textareas/the command palette.
 */
export function CoffeeEasterEgg() {
  const [visible, setVisible] = useState(false);
  const buffer = useRef("");
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isEditable) return;
      if (e.key.length !== 1) return;

      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer.current === TRIGGER) {
        setVisible(true);
        buffer.current = "";
        clearTimeout(timeout.current);
        timeout.current = setTimeout(() => setVisible(false), 2200);
      }
    };

    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 26 }}
          className="pointer-events-none fixed bottom-8 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border border-mist bg-paper px-4 py-2.5 shadow-lg"
          role="status"
        >
          <Coffee size={16} className="text-roast" />
          <span className="label text-ink">you found the coffee.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
