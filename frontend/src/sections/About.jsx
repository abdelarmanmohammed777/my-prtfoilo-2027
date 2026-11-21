import React from "react";
import { Tilt, Spot, DevImg } from "../lib.jsx";

const FOCUS = [
  ["HTML5", "Semantic, accessible markup"],
  ["CSS3", "Flexbox, Grid and responsive layouts"],
  ["JavaScript", "ES6+, DOM and async logic"],
  ["UI Toolkits", "Bootstrap, Tailwind CSS and React"],
];

export function About({ p }) {
  return (
    <section id="about">
      <h2 className="rv"><b>01.</b> About me</h2>
      <p className="sub rv">{p.school}</p>
      <div className="about-grid">
        <Spot className="card about-bio rv">
          <p className="lead">Frontend developer first, <em>full stack</em> in progress.</p>
          <p>I'm an Information Technology student at WE Applied Technology School. My craft is the <b>frontend</b>: clean, modern, fully responsive interfaces built with HTML, CSS and JavaScript, backed by a solid base in OOP, data structures, algorithms and SQL.</p>
          <p>On the server side I'm learning <b>PHP, Laravel and Node.js</b>, and connecting REST APIs to the interfaces I build.</p>
          <dl className="facts">
            {[["Based in", p.location], ["Main focus", "Frontend development"], ["Growing into", "Full-stack development"], ["Status", p.status]].map(([k, v]) => <div key={k}><dt className="mono">{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </Spot>
        <div className="about-side">
          <div className="focus rv">{FOCUS.map(([t, d], i) => <Spot className="card focus-item" key={t}><span className="mono">{"0" + (i + 1)}</span><h3>{t}</h3><p>{d}</p></Spot>)}</div>
          <Spot className="card timeline rv">
            <h3 className="kicker mono">Roadmap</h3>
            {p.roadmap.map((r) => <div className="step" key={r.year}><b className="mono">{r.year}</b><div><h4>{r.title}</h4><p>{r.text}</p></div></div>)}
          </Spot>
        </div>
      </div>
    </section>
  );
}

const BRAND = { html5: "#e34f26", css3: "#1572b6", javascript: "#f7df1e", bootstrap: "#7952b3", react: "#61dafb", tailwindcss: "#06b6d4", php: "#777bb4", laravel: "#ff2d20", nodejs: "#68a063", python: "#3776ab", mysql: "#4479a1", sqlite: "#0f80cc", git: "#f05032", github: "#8b949e", vscode: "#007acc", pycharm: "#21d789" };

export function TechStack({ p }) {
  const items = p.stack.flatMap((g) => g.items);
  const row = (list, cls) => <div className={"marq-row " + cls}>{[...list, ...list].map(([n, l], i) => <span className="mi" key={i} style={{ "--b": BRAND[l] || "#67e8f9" }}><DevImg name={l} alt="" /><b className="mono">{n}</b></span>)}</div>;
  return (
    <section id="stack">
      <h2 className="rv"><b>02.</b> Tech Stack &amp; Expertise</h2>
      <p className="sub rv">The technologies, tools and languages I use to bring ideas to life — from pixel-perfect UI to backend logic and databases.</p>
      <div className="grid4 stk">{p.stack.map((g, i) => (
        <div className="rv" key={g.title} style={{ transitionDelay: i * 80 + "ms" }}><Tilt className="card grp" max={7}>
          <span className="grp-num mono">{g.icon}</span><h3>{g.title}</h3><p>{g.text}</p>
          <div className="logos">{g.items.map(([n, l]) => <div className="lg" key={n} title={n} style={{ "--b": BRAND[l] || "#67e8f9" }}><div className="tile"><span>{n.slice(0, 2)}</span><DevImg name={l} alt={n} /></div><small>{n}</small></div>)}</div>
        </Tilt></div>))}
      </div>
      <div className="chips rv">{p.concepts.map((t) => <span className="chip" key={t}>{t}</span>)}</div>
      <div className="marq rv">{row(items, "")}{row([...items].reverse(), "rev")}</div>
    </section>
  );
}
