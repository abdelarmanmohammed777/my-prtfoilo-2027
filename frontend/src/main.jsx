import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import profile0 from "../../backend/data/profile.json";
import projects0 from "../../backend/data/projects.json";
import certs0 from "../../backend/data/certifications.json";
import "./styles/index.css";
import { useApi, useReveal, copy } from "./lib.jsx";
import { Backdrop, Splash, Nav, Toasts, Palette, Cursor } from "./sections/Chrome.jsx";
import { Hero } from "./sections/Hero.jsx";
import { About, TechStack } from "./sections/About.jsx";
import { Skills } from "./sections/Skills.jsx";
import { Projects, Certs, Contact } from "./sections/Rest.jsx";

function App() {
  const [p, online] = useApi("/api/profile", profile0), [projects] = useApi("/api/projects", projects0), [certs] = useApi("/api/certifications", certs0);
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("theme") || "dark"; } catch { return "dark"; } });
  const [pal, setPal] = useState(false);
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem("theme", theme); } catch {} }, [theme]);
  useEffect(() => { const k = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPal((v) => !v); } }; addEventListener("keydown", k); return () => removeEventListener("keydown", k); }, []);
  useReveal(projects.length + certs.length);
  const go = (id) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const actions = [
    ...[["home", "01"], ["about", "02"], ["stack", "03"], ["skills", "04"], ["projects", "05"], ["certs", "06"], ["contact", "07"]].map(([s, i]) => ({ l: "Go to " + s, i, run: go(s) })),
    { l: "Toggle dark / light theme", i: "◐", run: () => setTheme((t) => (t === "dark" ? "light" : "dark")) },
    { l: "Copy email", i: "@", run: () => copy(p.email) },
    { l: "Open GitHub", i: "GH", run: () => open(p.github, "_blank") },
    { l: "Open LinkedIn", i: "in", run: () => open(p.linkedin, "_blank") },
    { l: "Download CV", i: "CV", run: () => open(p.cv, "_blank") },
  ];
  return (<>
    <Splash /><Cursor /><Backdrop /><Nav theme={theme} setTheme={setTheme} openPalette={() => setPal(true)} /><Toasts /><Palette open={pal} setOpen={setPal} actions={actions} />
    <main><Hero p={p} projects={projects} certs={certs} /><About p={p} /><TechStack p={p} /><Skills p={p} /><Projects projects={projects} /><Certs certs={certs} /><Contact p={p} online={online} /></main>
  </>);
}
createRoot(document.getElementById("root")).render(<App />);
