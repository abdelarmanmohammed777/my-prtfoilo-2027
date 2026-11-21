import React, { useState, useEffect } from "react";
import { Tilt, useTyper, hl, copy, toast, Count, DevImg } from "../lib.jsx";

export function Hero({ p, projects, certs }) {
  const role = useTyper(p.roles);
  const coreIcons = { "HTML / CSS": "html5", CSS: "css3", JavaScript: "javascript", "Bootstrap / Tailwind": "bootstrap", "Tailwind CSS": "tailwindcss", "PHP / Laravel": "php", Laravel: "laravel", React: "react", "Node.js": "nodejs", Python: "python", PyCharm: "pycharm", MySQL: "mysql", SQLite: "sqlite", "VS Code": "vscode" };
  const full = JSON.stringify({ name: p.name, title: p.title, location: p.location, stack: p.core.map((c) => c.name), available: true }, null, 2);
  const [n, setN] = useState(0);
  useEffect(() => { const t = setInterval(() => setN((x) => (x >= full.length ? (clearInterval(t), x) : x + 1)), 28); return () => clearInterval(t); }, [full]);
  const share = async () => {
    const d = { title: p.name + " — Portfolio", text: p.title, url: location.href };
    try { navigator.share ? await navigator.share(d) : (await navigator.clipboard.writeText(d.url), toast("Link copied!")); } catch {}
  };
  const stats = [[3, "", "Years Learning"], [projects.length, "", "Projects"], [certs.length, "", "Certifications"], [100, "%", "Passion & Code"]];
  return (<>
    <section id="home" className="hero">
      <div>
        <span className="tag mono rv">{p.status}</span>
        <p className="where mono rv">{p.location}</p>
        <h1 className="rv">Hi, I'm <span className="name">{p.name.split(" ")[0]}</span>.</h1>
        <p className="role mono rv"><em>&gt;</em> <span className="cur">{role}</span></p>
        <p className="lede rv">I'm a frontend developer who builds clean, responsive interfaces, and I'm expanding into full-stack development — one project, one commit at a time.</p>
        <div className="btns rv"><a className="btn p" href="#projects">View my work</a><a className="btn" href="#contact">Get in touch</a><a className="btn" href={p.cv} target="_blank" rel="noreferrer">Download CV</a></div>
        <div className="btns rv">
          <button className="btn sm" onClick={() => copy(p.email)}>{p.email}</button><a className="btn sm" href={p.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a><button className="btn sm" onClick={share}>Share</button>
        </div>
      </div>
      <div className="rv">
        <Tilt className="card term"><div className="dots"><i /><i /><i /><span className="mono">profile.json</span></div>
          <pre dangerouslySetInnerHTML={{ __html: hl(full.slice(0, n)) + '<span class="cur"></span>' }} /></Tilt>
      </div>
    </section>
    <div className="stats">{stats.map(([n, s, l]) => <div className="card stat rv" key={l}><b><Count to={n} suffix={s} /></b><span>{l}</span></div>)}</div>
    <div className="tech-logos">
      {p.core.map((tech) => coreIcons[tech.name] && <DevImg key={tech.name} name={coreIcons[tech.name]} alt={tech.name} title={tech.name} className="tech-logo" />)}
    </div>
  </>);
}
