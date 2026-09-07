import { ImageResponse } from "next/og";

import { site } from "@/content/site";

export const alt = `${site.name} – ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background:
          "linear-gradient(135deg, #0b1219 0%, #1a2838 60%, #33414f 100%)",
        color: "#f4f6f8",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 10,
            background: "#f59e0b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#0b1219",
            fontSize: 44,
            fontWeight: 800,
          }}
        >
          T
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
            TEKKO
          </div>
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#a3b3c2",
            }}
          >
            Engineering Group
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {site.tagline}
        </div>
        <div style={{ fontSize: 26, color: "#c9d3dc", maxWidth: 1000 }}>
          Hydropower rehabilitation · Reverse engineering · Component
          manufacturing · Fabrication · Project management · QA &amp; FAT
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 20,
          color: "#7890a4",
        }}
      >
        <span>Ghana · Canada · Italy · Turkey · India</span>
        <span>{site.url.replace(/^https?:\/\//, "")}</span>
      </div>
    </div>,
    { ...size },
  );
}
