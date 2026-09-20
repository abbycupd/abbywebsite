import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

// No `runtime = "edge"` here — static export has no server/edge runtime at
// all. Next still generates this as a static PNG at build time since it
// takes no params; it just does it once, up front, instead of per-request.
export const alt = "Abby Brennan — Software Developer & Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#F6F2E9",
          color: "#17160F",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "-0.01em",
            color: "#6B6A61",
            marginBottom: 28,
          }}
        >
          computer science &amp; coffee
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            maxWidth: 950,
          }}
        >
          {profile.headline}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            marginTop: 40,
            color: "#6B4423",
            fontWeight: 600,
          }}
        >
          Abby Brennan
        </div>
      </div>
    ),
    { ...size }
  );
}
