import React, { useState, useEffect, useRef } from "react";
import { toast } from "../lib.jsx";

export function Backdrop() { return <div className="bg" aria-hidden="true"><i /><i /><i /><b /></div>; }

export function Splash() {
  const [n, setN] = useState(0), [out, setOut] = useState(false), [gone, setGone] = useState(false);
  const steps = ["Booting environment…", "Loading components…", "Connecting to API…", "Ready ✔"];
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const fast = matchMedia("(prefers-reduced-motion: reduce)").matches, t = setInterval(() => setN((v) => Math.min(v + 2, 100)), fast ? 4 : 28);
    return () => { clearInterval(t); document.body.style.overflow = ""; };
  }, []);
  useEffect(() => { if (n >= 100) { const a = setTimeout(() => setOut(true), 250), b = setTimeout(() => { setGone(true); document.body.style.overflow = ""; }, 950); return () => { clearTimeout(a); clearTimeout(b); }; } }, [n]);
  if (gone) return null;
  const skip = () => { setN(100); };
  return (<div className={"splash" + (out ? " out" : "")} onClick={skip} role="status" aria-label="Loading">
    <div className="slogo mono">{"{ "}<span>AM</span>{" }"}</div>
    <div className="sbar"><div style={{ width: n + "%" }} /></div>
    <div className="mono sinfo"><span>{steps[Math.min(Math.floor(n / 26), 3)]}</span><span>{n}%</span></div>
  </div>);
}

export function Nav({ theme, setTheme, openPalette }) {
  const [prog, setProg] = useState(0), [on, setOn] = useState("home"), [top, setTop] = useState(false), cur = useRef();
  useEffect(() => {
    const sc = () => { setProg((scrollY / (document.body.scrollHeight - innerHeight)) * 100); setTop(scrollY > 600); };
    const mv = (e) => cur.current && (cur.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`);
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setOn(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section[id]").forEach((s) => io.observe(s));
    addEventListener("scroll", sc); addEventListener("mousemove", mv);
    return () => { removeEventListener("scroll", sc); removeEventListener("mousemove", mv); io.disconnect(); };
  }, []);
  return (<>
    <div id="bar" style={{ width: prog + "%" }} /><div id="cur" ref={cur} />
    <nav>
      <a className="brand mono" href="#home" aria-label="Home">AM<span>.</span></a>
      <div className="nav-links">
        {[["home","Home"],["about","About"],["stack","Stack"],["skills","Skills"],["projects","Projects"],["certs","Certificates"],["contact","Contact"]].map(([s, l]) => <a key={s} href={"#" + s} className={on === s ? "on" : ""}>{l}</a>)}
      </div>
      <button className="ib command-btn" onClick={openPalette} title="Command palette (Ctrl+K)" aria-label="Command palette">⌘ K</button>
      <button className="ib theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} title="Toggle theme" aria-label="Toggle theme">{theme === "dark" ? "Light" : "Dark"}</button>
    </nav>
    <button className={"totop" + (top ? " show" : "")} onClick={() => scrollTo({ top: 0 })} aria-label="Back to top">↑</button>
  </>);
}

export function Toasts() {
  const [list, setList] = useState([]);
  useEffect(() => {
    const h = (e) => { const id = Math.random(); setList((l) => [...l, { id, ...e.detail }]); setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 3200); };
    addEventListener("toast", h); return () => removeEventListener("toast", h);
  }, []);
  return <div className="toasts" aria-live="polite">{list.map((t) => <div key={t.id} className={"toast card " + t.kind}>{t.msg}</div>)}</div>;
}

export function Palette({ open, setOpen, actions }) {
  const [q, setQ] = useState(""), [i, setI] = useState(0);
  useEffect(() => { setQ(""); setI(0); }, [open]);
  useEffect(() => setI(0), [q]);
  if (!open) return null;
  const list = actions.filter((a) => a.l.toLowerCase().includes(q.toLowerCase())), run = (a) => { setOpen(false); a && a.run(); };
  const key = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setI((i + 1) % Math.max(list.length, 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setI((i - 1 + list.length) % Math.max(list.length, 1)); }
    else if (e.key === "Enter") run(list[i]); else if (e.key === "Escape") setOpen(false);
  };
  return (<div className="pal" onClick={() => setOpen(false)}><div className="card pbox" onClick={(e) => e.stopPropagation()}>
    <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={key} placeholder="Type a command… (try “projects”)" aria-label="Command" />
    <ul>{list.map((a, n) => <li key={a.l} className={n === i ? "on" : ""} onMouseEnter={() => setI(n)} onClick={() => run(a)}><span>{a.i}</span> {a.l}</li>)}{!list.length && <li className="mono">No results</li>}</ul>
  </div></div>);
}

// Custom cursor: gradient ring + dot, grows over links, ripples on click, buttons are magnetic.
// Only mounts on devices with a real mouse; touch devices keep their normal behaviour.
export function Cursor() {
  const dot = useRef(), ring = useRef();
  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y, raf, shown = false, magnet = null;
    const LINK = "a, button, [role=button], .lg, .mi, .chip, .step, .skill, .hobby, .cert-card, .proj, .stat";
    const reset = (el) => { el && el.style.removeProperty("--tx"); el && el.style.removeProperty("--ty"); };
    const move = (e) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; rx = x; ry = y; root.classList.add("cursor-on"); }
      dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      const t = e.target.closest ? e.target : e.target.parentElement;
      root.dataset.cs = t.closest("input, textarea") ? "text" : t.closest(LINK) ? "link" : "";
      const b = t.closest(".btn");
      if (magnet && magnet !== b) { reset(magnet); magnet = null; }
      if (b) { const r = b.getBoundingClientRect(); b.style.setProperty("--tx", (x - r.left - r.width / 2) * 0.22 + "px"); b.style.setProperty("--ty", (y - r.top - r.height / 2) * 0.3 + "px"); magnet = b; }
    };
    const down = () => {
      root.dataset.down = "1";
      const r = document.createElement("div"); r.className = "c-ripple"; r.style.left = x + "px"; r.style.top = y + "px";
      document.body.appendChild(r); setTimeout(() => r.remove(), 700);
    };
    const up = () => delete root.dataset.down;
    const hide = () => root.classList.remove("cursor-on");
    const show = () => shown && root.classList.add("cursor-on");
    const loop = () => { rx += (x - rx) * 0.17; ry += (y - ry) * 0.17; ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`; raf = requestAnimationFrame(loop); };
    loop();
    addEventListener("mousemove", move); addEventListener("mousedown", down); addEventListener("mouseup", up);
    document.addEventListener("mouseleave", hide); document.addEventListener("mouseenter", show);
    return () => {
      cancelAnimationFrame(raf); root.classList.remove("has-cursor", "cursor-on"); reset(magnet);
      removeEventListener("mousemove", move); removeEventListener("mousedown", down); removeEventListener("mouseup", up);
      document.removeEventListener("mouseleave", hide); document.removeEventListener("mouseenter", show);
    };
  }, []);
  return <><div ref={ring} className="c-ring"><i /></div><div ref={dot} className="c-dot"><i /></div></>;
}
