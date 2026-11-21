import React, { useState } from "react";
import { Tilt, call, toast, DevImg } from "../lib.jsx";
import { ICONS } from "../icons.jsx";

function CertIcon({ c }) {
  return <>{ICONS[c.icon] || ICONS.code}{c.logo && <DevImg name={c.logo} alt="" className="cert-logo" />}</>;
}

export function Projects({ projects }) {
  const [f, setF] = useState("All"), tags = ["All", ...new Set(projects.flatMap((p) => p.stack))];
  return (
    <section id="projects">
      <h2 className="rv"><b>04.</b> Projects</h2><p className="sub rv">Things I've built so far — filter by technology.</p>
      <div className="tabs rv">{tags.map((t) => <button key={t} className={f === t ? "on" : ""} onClick={() => setF(t)}>{t}</button>)}</div>
      <div className="two">{projects.filter((p) => f === "All" || p.stack.includes(f)).map((p) => <div className="rv in" key={p.id}><Tilt className="card proj" max={8}><h3>{p.title}</h3><p>{p.desc}</p><div className="chips">{p.stack.map((s) => <span className="chip" key={s}>{s}</span>)}</div><a className="btn" href={p.github} target="_blank" rel="noreferrer" style={{ alignSelf: "flex-start" }}>View on GitHub ↗</a></Tilt></div>)}</div>
    </section>
  );
}

export function Certs({ certs }) {
  return (
    <section id="certs">
      <h2 className="rv"><b>05.</b> Certifications</h2>
      <p className="sub rv">Courses and credentials documenting my learning journey.</p>
      <div className="cert-grid">
        {certs.map((c, i) => (
          <article className="card cert-card rv" key={c.title}>
            <div className="cert-top">
              <span className="cert-index mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="cert-mark" aria-hidden="true"><CertIcon c={c} /></span>
            </div>
            <div className="cert-copy">
              <p className="cert-kicker mono">CERTIFICATION</p>
              <h3>{c.title}</h3>
              <p className="cert-issuer">{c.issuer}</p>
            </div>
            <div className="cert-bottom">
              <span className="cert-date mono">{c.date}</span>
              <div className="btns cert-actions">
                {c.file && <a className="btn sm" href={c.file} target="_blank" rel="noreferrer">View certificate <span aria-hidden="true">↗</span></a>}
                {c.verify && <a className="cert-verify" href={c.verify} target="_blank" rel="noreferrer">Verify credential ↗</a>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Contact({ p, online }) {
  const [f, setF] = useState({ name: "", email: "", message: "", website: "" }), [busy, setBusy] = useState(false), [done, setDone] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { const r = await call("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }); toast(r.message || "Sent!"); setDone(true); setF({ name: "", email: "", message: "", website: "" }); }
    catch (x) {
      if (x.status) toast(x.message, "err"); // validation / rate-limit error from the API
      else { toast("Backend offline — opening your email app instead"); location.href = `mailto:${p.email}?subject=${encodeURIComponent("Portfolio message from " + f.name)}&body=${encodeURIComponent(f.message + "\n\n" + f.name + " (" + f.email + ")")}`; }
    }
    setBusy(false);
  };
  return (
    <section id="contact">
      <div className="card contact rv"><span className="tag mono">Open to work</span><h2>Let's build something <em>great</em> together</h2>
        <p className="sub">Send me a message — it goes straight to my Node.js backend.</p>
        {done ? <p className="mono">✔ Message sent. I'll get back to you soon!</p> :
          <form className="cf" onSubmit={submit}>
            <input placeholder="Your name" value={f.name} onChange={set("name")} required aria-label="Name" />
            <input type="email" placeholder="Your email" value={f.email} onChange={set("email")} required aria-label="Email" />
            <textarea placeholder="Your message…" rows={4} value={f.message} onChange={set("message")} required aria-label="Message" />
            <input name="website" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" className="todo-hp" aria-hidden="true" />
            <button className="btn p" disabled={busy} >{busy ? "Sending…" : "Send message"}</button>
          </form>}
        <div className="links"><a className="btn" href={"mailto:" + p.email}>Email</a><a className="btn" href={p.github} target="_blank" rel="noreferrer">GitHub</a><a className="btn" href={p.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div></div>
      <footer className="mono">© {new Date().getFullYear()} {p.name} · React + Node.js · API: {online === null ? "checking" : online ? "live" : "static mode"}</footer>
    </section>
  );
}
