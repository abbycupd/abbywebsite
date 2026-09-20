type ClassValue = string | number | null | boolean | undefined | ClassValue[];

function flatten(value: ClassValue, into: string[]) {
  if (!value && value !== 0) return;
  if (Array.isArray(value)) {
    value.forEach((v) => flatten(v, into));
    return;
  }
  into.push(String(value));
}

/** Tiny classnames joiner — no dependency needed for this project's needs. */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  values.forEach((v) => flatten(v, out));
  return out.join(" ");
}
