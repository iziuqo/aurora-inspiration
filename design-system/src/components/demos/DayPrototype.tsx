import { useEffect, useRef, useState } from 'react';
import { Timeline, TimelineRow, Gap, Held } from '../aurora/Timeline';
import { AskBar } from '../aurora/AskBar';
import { Label } from '../aurora/Label';
import { SegmentedControl } from '../aurora/SegmentedControl';
import { QuietState } from '../aurora/QuietState';
import { OpenSlot } from './OpenSlot';
import { DAY } from './day-data';
import './DayPrototype.css';

/** The Aurora inspiration surface, rebuilt entirely from system components. */
export default function DayPrototype({ withSwitch = true }: { withSwitch?: boolean }) {
  const [view, setView] = useState<'day' | 'quiet'>('day');
  const [status, setStatus] = useState({ text: 'Aurora is watching the week', busy: false });
  const [run, setRun] = useState(0);
  const screen = useRef<HTMLDivElement>(null);
  const [tight, setTight] = useState(false);
  const [fade, setFade] = useState(1);

  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const onScroll = () => {
      const p = Math.min(1, el.scrollTop / 110);
      setFade(1 - p);
      setTight(p > 0.5);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [view]);

  const switchTo = (v: string) => {
    setView(v as 'day' | 'quiet');
    setRun((r) => r + 1);
    setStatus({ text: 'Aurora is watching the week', busy: false });
    screen.current?.scrollTo({ top: 0 });
  };

  return (
    <div className="dp">
      {withSwitch && (
        <SegmentedControl
          label="Prototype state"
          value={view}
          onChange={switchTo}
          options={[{ value: 'day', label: 'Thursday' }, { value: 'quiet', label: 'A quiet day' }]}
        />
      )}
      <div className="d-phone dp__phone">
        <div className="dp__bar" data-tight={tight || undefined}>
          <span>9.41</span>
          <span className="dp__compact">{view === 'quiet' ? 'Tuesday 4 August' : 'Thursday 30 July'}</span>
          <span>London</span>
        </div>
        <div className="dp__screen" ref={screen} key={`${view}-${run}`}>
          {view === 'quiet' ? (
            <QuietState
              context="London · Tuesday 4 August"
              title="Nothing worth moving today. Your day is already what it should be."
              holding={{ line: 'Two things for Saturday' }}
            />
          ) : (
            <>
              <div className="dp__notice" style={{ opacity: fade, transform: `translateY(${-16 * (1 - fade)}px) scale(${1 - 0.035 * (1 - fade)})` }}>
                <Label as="div">London · Thursday 30 July</Label>
                <h2 className="dp__greeting">You landed at six. There are three hours at eleven, and the evening is yours.</h2>
              </div>
              <div className="dp__prog">
                <Timeline>
                  {DAY.map((item) =>
                    item.kind === 'row' ? (
                      <TimelineRow key={item.time} time={item.time} title={item.title} detail={item.detail} state={item.state} />
                    ) : item.kind === 'held' ? (
                      <Gap key={item.time} time={item.time} span={item.span}><Held why={item.why} /></Gap>
                    ) : (
                      <OpenSlot key={item.time} item={item} onStatus={(text, busy) => setStatus({ text, busy: !!busy })} />
                    )
                  )}
                </Timeline>
              </div>
            </>
          )}
        </div>
        <div className="dp__ask">
          <AskBar status={status.text} busy={status.busy} onClick={() => setStatus({ text: 'Aurora, how can I help?', busy: false })} />
        </div>
      </div>
    </div>
  );
}
