import { useState } from 'react';
import { Timeline, TimelineRow, Gap, Held } from '../aurora/Timeline';
import { HoldButton } from '../aurora/HoldButton';
import { Tally } from '../aurora/Tally';
import { Button } from '../aurora/Button';

/** The four places light is allowed, side by side. */
export default function LightDemos() {
  const [charging, setCharging] = useState(false);
  const [key, setKey] = useState(0);
  return (
    <div className="ld">
      <figure className="ld__cell">
        <div className="ld__stage" style={{ width: 260 }}>
          <Timeline><TimelineRow time="14.00" title="Fund review" /><Gap time="16.00" span="Open"><Held why="Left open on purpose." /></Gap></Timeline>
        </div>
        <figcaption><b>1 · Open time</b> The rule breaks and light fills the break. The beam drifts slowly, so open time feels alive, not empty.</figcaption>
      </figure>
      <figure className="ld__cell">
        <div className="ld__stage"><Button variant="secondary" className="ld__focus">Focused control</Button></div>
        <figcaption><b>2 · Focus</b> A 1px mint ring, 3px out. The keyboard user’s attention is where the light is.</figcaption>
      </figure>
      <figure className="ld__cell">
        <div className="ld__stage" style={{ width: 240, flexDirection: 'column', gap: 14 }}>
          <div className="ld__beam" data-charging={charging || undefined} />
          <HoldButton key={key} block onChargeChange={setCharging} onConfirm={() => window.setTimeout(() => setKey((k) => k + 1), 1200)} />
        </div>
        <figcaption><b>3 · Commitment</b> Hold the button. The light charges while you commit, and settles when you let go.</figcaption>
      </figure>
      <figure className="ld__cell">
        <div className="ld__stage"><Tally items={[{ value: 21, label: 'Booking' }, { value: 16, label: 'Airbnb' }, { value: 1, label: 'Aurora', highlight: true }]} /></div>
        <figcaption><b>4 · The figure that is ours</b> In a comparison, one number may carry light on its rule. Only one.</figcaption>
      </figure>
    </div>
  );
}
