// Glow-AI — design tokens & theme
window.GlowTheme = {
  light: {
    // surfaces
    bg: "#f7f2ea",          // cream base
    bgElevated: "#fdfaf4",  // card cream
    bgSubtle: "#efe6d8",    // darker sand
    ink: "#1a1612",         // near-black
    inkSoft: "#4a4238",     // secondary text
    inkMuted: "#8a8074",    // tertiary
    hairline: "rgba(26,22,18,0.08)",
    hairlineStrong: "rgba(26,22,18,0.14)",

    // accents
    green: "#4a6b4a",       // botanical
    greenSoft: "#dfe6d8",
    greenDeep: "#2f4a31",
    rose: "#e8c9c2",        // rose suave
    roseSoft: "#f3dfd8",
    sand: "#d9c9a8",
    warn: "#d08a48",        // orange for expiry
    warnSoft: "#f3e0c9",

    white: "#ffffff",
  },
  dark: {
    bg: "#0f0d0b",          // grafito deep
    bgElevated: "#1a1714",
    bgSubtle: "#252119",
    ink: "#f5efe4",
    inkSoft: "#c4bcae",
    inkMuted: "#8a8074",
    hairline: "rgba(245,239,228,0.08)",
    hairlineStrong: "rgba(245,239,228,0.16)",

    green: "#8fa888",
    greenSoft: "#2f3b2f",
    greenDeep: "#c0d0b8",
    rose: "#b88a82",
    roseSoft: "#3a2a27",
    sand: "#8a7a5a",
    warn: "#d4a472",
    warnSoft: "#3a2d1f",

    white: "#2a2520",
  },
  font: {
    serif: '"Fraunces", "Cormorant Garamond", Georgia, serif',
    sans:  '"Inter", -apple-system, system-ui, sans-serif',
    mono:  '"JetBrains Mono", ui-monospace, monospace',
  },
  radius: { sm: 10, md: 16, lg: 22, xl: 28, xxl: 34, pill: 999 },
  shadow: {
    soft: "0 1px 2px rgba(26,22,18,0.04), 0 8px 24px rgba(26,22,18,0.06)",
    lift: "0 2px 6px rgba(26,22,18,0.06), 0 18px 44px rgba(26,22,18,0.10)",
    pop:  "0 10px 40px rgba(26,22,18,0.18), 0 2px 8px rgba(26,22,18,0.10)",
  },
};

// Icons — simple strokes, no fills
window.GlowIcon = ({ name, size = 20, color = "currentColor", strokeWidth = 1.6 }) => {
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    home:     <><path {...p} d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1V10z"/></>,
    shelf:    <><rect {...p} x="3" y="4" width="18" height="5" rx="1"/><rect {...p} x="3" y="10" width="18" height="5" rx="1"/><rect {...p} x="3" y="16" width="18" height="5" rx="1"/></>,
    routine:  <><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M12 7v5l3 2"/></>,
    profile:  <><circle {...p} cx="12" cy="8" r="4"/><path {...p} d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
    camera:   <><path {...p} d="M4 8a2 2 0 0 1 2-2h2l2-2h4l2 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z"/><circle {...p} cx="12" cy="13" r="3.5"/></>,
    sun:      <><circle {...p} cx="12" cy="12" r="4"/><path {...p} d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/></>,
    moon:     <><path {...p} d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></>,
    check:    <><path {...p} d="M4 12l5 5L20 6"/></>,
    plus:     <><path {...p} d="M12 5v14M5 12h14"/></>,
    chevron:  <><path {...p} d="M9 6l6 6-6 6"/></>,
    close:    <><path {...p} d="M6 6l12 12M18 6L6 18"/></>,
    sparkle:  <><path {...p} d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></>,
    drop:     <><path {...p} d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z"/></>,
    flame:    <><path {...p} d="M12 3s4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4-1 2 0 3 2 3s3-2 0-7z"/></>,
    bell:     <><path {...p} d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2z"/><path {...p} d="M10 20a2 2 0 0 0 4 0"/></>,
    leaf:     <><path {...p} d="M4 20s0-9 8-13c6-3 8 2 8 2s-1 11-8 13c-4 1-8-2-8-2z"/><path {...p} d="M4 20c4-6 8-8 12-10"/></>,
    settings: <><circle {...p} cx="12" cy="12" r="3"/><path {...p} d="M19 12a7 7 0 0 0-.1-1.3l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2.3-1.3L14 3h-4l-.3 2.4a7 7 0 0 0-2.3 1.3l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .5 0 .9.1 1.3l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2.3 1.3L10 21h4l.3-2.4a7 7 0 0 0 2.3-1.3l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.3z"/></>,
    scan:     <><path {...p} d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M4 12h16"/></>,
    flash:    <><path {...p} d="M13 3L5 14h6l-1 7 8-11h-6l1-7z"/></>,
    heart:    <><path {...p} d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></>,
    star:     <><path {...p} d="M12 3l2.6 5.7 6.2.7-4.6 4.3 1.2 6.2L12 17l-5.4 2.9 1.2-6.2L3.2 9.4l6.2-.7z"/></>,
    info:     <><circle {...p} cx="12" cy="12" r="9"/><path {...p} d="M12 11v5M12 8v.5"/></>,
    weather:  <><path {...p} d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 10 1 3 3 0 0 1 0 7z"/></>,
    edit:     <><path {...p} d="M4 20h4l10-10-4-4L4 16v4zM13 7l4 4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      {paths[name]}
    </svg>
  );
};
