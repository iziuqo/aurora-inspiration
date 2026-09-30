import { useState } from 'react';
import './EasingLab.css';

const curves = [
  { name: 'glide', v: [0.32, 0.72, 0, 1], use: 'Anything that moves or changes size.' },
  { name: 'soft', v: [0.4, 0, 0.2, 1], use: 'Colour, opacity and borders.' },
  { name: 'out', v: [0.25, 1, 0.5, 1], use: 'Content arriving.' },
  { name: 'linear', v: [0, 0, 1, 1], use: 'Only progress that tracks a held gesture.' },
] as const;

/** Plots each curve and races a dot along it, so the difference is felt, not described. */
export default function EasingLab() {
  const [run, setRun] = useState(0);
  const [dur, setDur] = useState(900);
  return (
    <div className="el">
      <div className="el__grid">
        {curves.map((c) => {
          const [x1, y1, x2, y2] = c.v;
          const S = 120;
          const P = (x: number, y: number) => `${x * S} ${S - y * S}`;
          return (
            <div className="el__item" key={c.name}>
              <svg className="el__plot" viewBox="-8 -8 136 136" aria-hidden="true">
                <rect x="0" y="0" width={S} height={S} fill="none" stroke="var(--au-border-hairline)" />
                <line x1="0" y1={S} x2={x1 * S} y2={S - y1 * S} stroke="var(--au-border-strong)" />
                <line x1={S} y1="0" x2={x2 * S} y2={S - y2 * S} stroke="var(--au-border-strong)" />
                <circle cx={x1 * S} cy={S - y1 * S} r="3" fill="var(--au-bg-ground)" stroke="var(--au-text-tertiary)" />
                <circle cx={x2 * S} cy={S - y2 * S} r="3" fill="var(--au-bg-ground)" stroke="var(--au-text-tertiary)" />
                <path d={`M${P(0, 0)} C${P(x1, y1)} ${P(x2, y2)} ${P(1, 1)}`} fill="none" stroke="url(#el-g)" strokeWidth="1.6" />
                <defs><linearGradient id="el-g" x1="0" x2="1"><stop stopColor="var(--au-light-lo)" /><stop offset="1" stopColor="var(--au-light-hi)" /></linearGradient></defs>
              </svg>
              <div className="el__track">
                <i key={run} className="el__dot" style={{ animationTimingFunction: `cubic-bezier(${c.v.join(',')})`, animationDuration: `${dur}ms`, animationPlayState: run ? 'running' : 'paused' }} />
              </div>
              <div className="el__name"><code>ease-{c.name}</code></div>
              <div className="el__v">{c.v.join(', ')}</div>
              <div className="el__use">{c.use}</div>
            </div>
          );
        })}
      </div>
      <div className="el__bar">
        <div className="el__durs" role="radiogroup" aria-label="Duration">
          {[340, 600, 900].map((d) => (
            <button key={d} type="button" role="radio" aria-checked={dur === d} onClick={() => { setDur(d); setRun((r) => r + 1); }}>{d}ms</button>
          ))}
        </div>
        <button className="au-button" data-variant="secondary" data-size="sm" type="button" onClick={() => setRun((r) => r + 1)}>
          <span className="au-button__label">{run ? 'Replay' : 'Play'}</span>
        </button>
      </div>
    </div>
  );
}
