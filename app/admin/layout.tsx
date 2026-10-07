import type { Metadata } from "next";

// Kept out of search engines and link previews. There's no public nav entry
// to /admin either — it's reached by typing the URL directly.
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
