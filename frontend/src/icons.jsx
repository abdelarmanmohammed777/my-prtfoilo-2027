import React from "react";

// Shared line icons (24x24). Used by certificates and the Skills section.
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
const svg = (children) => <svg viewBox="0 0 24 24" {...P}>{children}</svg>;

export const ICONS = {
  database: svg(<><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>),
  chip: svg(<><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" /></>),
  code: svg(<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />),
  monitor: svg(<><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>),
  chart: svg(<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8" />),
  ai: svg(<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3zM18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15z" />),
  puzzle: svg(<path d="M10 4a2 2 0 114 0v1h3a1 1 0 011 1v3h-1a2 2 0 100 4h1v3a1 1 0 01-1 1h-3v-1a2 2 0 10-4 0v1H7a1 1 0 01-1-1v-3h1a2 2 0 100-4H6V6a1 1 0 011-1h3V4z" />),
  users: svg(<><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 5.5a3 3 0 010 5.5M18 14.5c1.8.7 3 2.4 3 4.5" /></>),
  trend: svg(<path d="M3 17l6-6 4 4 8-8M15 7h6v6" />),
  book: svg(<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h13" />),
  git: svg(<><circle cx="6" cy="6" r="2" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="8" r="2" /><path d="M6 8v8M18 10c0 4-6 3-12 6" /></>),
};
