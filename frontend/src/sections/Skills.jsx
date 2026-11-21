import React from "react";
import { Spot } from "../lib.jsx";
import { ICONS } from "../icons.jsx";

export function Skills({ p }) {
  return (
    <section id="skills">
      <h2 className="rv"><b>03.</b> Skills</h2>
      <p className="sub rv">What I bring beyond the tools, and what I enjoy outside the code editor.</p>

      <div className="skills-grid">
        {p.softSkills.map((s, i) => (
          <div className="rv" key={s.title} style={{ transitionDelay: i * 90 + "ms" }}>
            <Spot className="card skill">
              <span className="skill-idx mono">{"0" + (i + 1)}</span>
              <span className="skill-ico">{ICONS[s.icon]}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <i className="skill-bar" />
            </Spot>
          </div>
        ))}
      </div>

      <h3 className="subhead mono rv">Interests &amp; hobbies</h3>
      <div className="hobbies">
        {p.interests.map((h, i) => (
          <div className="rv" key={h.title} style={{ transitionDelay: i * 80 + "ms" }}>
            <div className="card hobby">
              <span className="hobby-ico">{ICONS[h.icon]}</span>
              <div><h4>{h.title}</h4><p>{h.text}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
