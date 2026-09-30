import { useState } from 'react';
import { HoldButton } from '../aurora/HoldButton';
import { SegmentedControl } from '../aurora/SegmentedControl';
import { Timeline, TimelineRow, Gap, Held } from '../aurora/Timeline';
import type { GapState } from '../aurora/Timeline';
import { SuggestionCard } from '../aurora/SuggestionCard';
import { ExecutionSteps } from '../aurora/ExecutionSteps';
import { AskBar } from '../aurora/AskBar';
import { Button } from '../aurora/Button';
import { Label } from '../aurora/Label';
import { OpenSlot } from './OpenSlot';
import { DAY } from './day-data';

const recovery = DAY.find((d) => d.kind === 'open')!;
const dinner = DAY.filter((d) => d.kind === 'open')[1]!;

export function HoldDemo() {
  const [n, setN] = useState(0);
  const [msg, setMsg] = useState('Press and hold. Let go early to cancel.');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, width: 280 }}>
      <HoldButton
        key={n}
        block
        onChargeChange={(c) => c && setMsg('Keep holding…')}
        onConfirm={() => { setMsg('Confirmed. Resetting in a moment.'); window.setTimeout(() => { setN((k) => k + 1); setMsg('Press and hold. Let go early to cancel.'); }, 1600); }}
      />
      <Label as="div">{msg}</Label>
    </div>
  );
}

export function SegmentedDemo() {
  const [v, setV] = useState('day');
  return (
    <div style={{ width: 340, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <SegmentedControl label="View" value={v} onChange={setV} options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
      <Label as="div" tone="secondary">Showing the {v}</Label>
    </div>
  );
}

export function GapStatesDemo() {
  const [s, setS] = useState<GapState>('idle');
  return (
    <div style={{ width: 360, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <SegmentedControl label="Gap state" value={s} onChange={(v) => setS(v as GapState)} options={[{ value: 'idle', label: 'Idle' }, { value: 'charging', label: 'Charging' }, { value: 'working', label: 'Working' }, { value: 'settled', label: 'Settled' }]} />
      <Timeline key={s === 'settled' ? 'settled' : 'live'}>
        <TimelineRow time="09.30" title="Board meeting" detail="Berkeley Square" state="present" />
        <Gap time="11.00" span="Three hours" state={s}>
          {s === 'settled' ? (
            <div className="au-row__entry" style={{ paddingLeft: 0 }}><div className="au-row__title">Recovery, Surrenne</div><div className="au-row__detail">Booked · car at 11.10</div></div>
          ) : s === 'working' ? (
            <ExecutionSteps steps={['Slot held', 'Car at 11.10', 'Board told you leave at 11']} />
          ) : (
            <Held line="Three hours, open." why="Aurora is looking. Nothing needs you until two." />
          )}
        </Gap>
        <TimelineRow time="14.00" title="Fund review" detail="Call, 90 minutes" />
      </Timeline>
    </div>
  );
}

export function SuggestionDemo({ which = 'recovery' }: { which?: 'recovery' | 'dinner' }) {
  const [run, setRun] = useState(0);
  const item = which === 'dinner' ? dinner : recovery;
  if (item.kind !== 'open') return null;
  return (
    <div style={{ width: 360 }}>
      <Timeline key={run}>
        <TimelineRow time="14.00" title="Fund review" detail="Call, 90 minutes" />
        <OpenSlot item={item} />
      </Timeline>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <Button variant="quiet" size="sm" onClick={() => setRun((r) => r + 1)}>Reset</Button>
      </div>
    </div>
  );
}

export function CardOnlyDemo() {
  const [key, setKey] = useState(0);
  const [note, setNote] = useState('');
  if (recovery.kind !== 'open') return null;
  return (
    <div style={{ width: 320 }}>
      <SuggestionCard
        key={key}
        because={recovery.because}
        what={recovery.what}
        detail={recovery.detail}
        signals={recovery.signals}
        onConfirm={() => { setNote('Confirmed'); window.setTimeout(() => { setKey((k) => k + 1); setNote(''); }, 1400); }}
        onDecline={() => { setNote('Left open'); window.setTimeout(() => { setKey((k) => k + 1); setNote(''); }, 1400); }}
      />
      <div style={{ marginTop: 4 }}><Label as="div" tone="secondary">{note || 'Tap to open · hold to confirm · push left to leave open'}</Label></div>
    </div>
  );
}

export function StepsDemo() {
  const [run, setRun] = useState(0);
  return (
    <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Timeline>
        <Gap key={run} time="11.00" state="working"><ExecutionSteps steps={['Slot held', 'Car at 11.10', 'Board told you leave at 11']} /></Gap>
      </Timeline>
      <div><Button variant="quiet" size="sm" onClick={() => setRun((r) => r + 1)}>Replay</Button></div>
    </div>
  );
}

const statuses: [string, boolean][] = [['Aurora is watching the week', false], ['Arranging', true], ['Aurora is handling it', false], ['Aurora, how can I help?', false]];
export function AskDemo() {
  const [i, setI] = useState(0);
  const [s, busy] = statuses[i];
  return (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <AskBar status={s} busy={busy} onClick={() => setI((k) => (k + 1) % statuses.length)} />
      <Label as="div">Click to step through its states</Label>
    </div>
  );
}
