import React, { useState, useEffect, useRef } from "react";

export const API = window.PORTFOLIO_API ?? "";
export const toast = (msg, kind = "ok") => window.dispatchEvent(new CustomEvent("toast", { detail: { msg, kind } }));

// fetch wrapper: 3s timeout, JSON errors, skips network on file:// (static demo mode)
export async function call(path, opt) {
  if (location.protocol === "file:" && !window.PORTFOLIO_API) throw new Error("offline");
  const c = new AbortController(), t = setTimeout(() => c.abort(), 3000);
  try {
    const r = await fetch(API + path, { ...opt, signal: c.signal }), j = await r.json();
    if (!r.ok) throw Object.assign(new Error(j.error || r.status), { status: r.status });
    return j;
  } finally { clearTimeout(t); }
}

// Loads from the Node backend; instantly shows bundled data, swaps to live data when API answers.
export function useApi(path, fallback) {
  const [d, setD] = useState(fallback), [ok, setOk] = useState(null);
  useEffect(() => { call(path).then((j) => { setD(j); setOk(true); }).catch(() => setOk(false)); }, [path]);
  return [d, ok];
}

export function useReveal(dep) {
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.1 });
    document.querySelectorAll(".rv:not(.in)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

export function useTyper(words) {
  const [txt, setTxt] = useState("");
  useEffect(() => {
    let i = 0, j = 0, del = false, t;
    const tick = () => {
      const w = words[i]; j += del ? -1 : 1; setTxt(w.slice(0, j));
      let d = del ? 40 : 90;
      if (!del && j === w.length) { del = true; d = 1400; } else if (del && j === 0) { del = false; i = (i + 1) % words.length; d = 300; }
      t = setTimeout(tick, d);
    };
    tick(); return () => clearTimeout(t);
  }, [words.join()]);
  return txt;
}

export function Tilt({ children, className = "", max = 12 }) {
  const ref = useRef();
  const move = (e) => {
    const r = ref.current.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    ref.current.style.transform = `perspective(900px) rotateY(${(x - 0.5) * max * 2}deg) rotateX(${(0.5 - y) * max * 2}deg) scale(1.02)`;
    ref.current.style.setProperty("--mx", x * 100 + "%"); ref.current.style.setProperty("--my", y * 100 + "%");
  };
  return <div ref={ref} className={"tilt " + className} onMouseMove={move} onMouseLeave={() => (ref.current.style.transform = "")}>{children}</div>;
}

export function Count({ to, suffix = "" }) {
  const [n, setN] = useState(0), ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now(), step = (t) => { const p = Math.min((t - t0) / 1400, 1); setN(Math.round((1 - Math.pow(1 - p, 3)) * to)); p < 1 && requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }); io.observe(ref.current); return () => io.disconnect();
  }, [to]);
  return <span ref={ref}>{n}{suffix}</span>;
}

export const hl = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/("[^"]*")(\s*:)?/g, (_, a, b) => `<span class="${b ? "f" : "s"}">${a}</span>${b || ""}`).replace(/\b(true|false|null)\b/g, '<span class="n">$1</span>');
export const copy = async (t) => { try { await navigator.clipboard.writeText(t); toast("Copied: " + t); } catch { toast("Copy failed", "err"); } };

// Card wrapper that tracks the pointer so CSS can paint a soft spotlight under it.
export function Spot({ className = "", children, ...rest }) {
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", e.clientX - r.left + "px"); e.currentTarget.style.setProperty("--my", e.clientY - r.top + "px"); };
  return <div className={"spot " + className} onMouseMove={move} {...rest}>{children}</div>;
}

// Devicon logo with graceful fallback: original -> plain -> renders nothing (caller shows its own fallback)
export const DEV = (n, v = "original") => `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${n}/${n}-${v}.svg`;
export function DevImg({ name, alt = "", className = "", title }) {
  const [v, setV] = useState("original"), [dead, setDead] = useState(false);
  if (dead) return null;
  return <img className={className} src={DEV(name, v)} alt={alt} title={title} loading="lazy" onError={() => (v === "original" ? setV("plain") : setDead(true))} />;
}
