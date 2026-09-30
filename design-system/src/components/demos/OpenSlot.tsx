import { useState } from 'react';
import { Gap, Held } from '../aurora/Timeline';
import type { GapState } from '../aurora/Timeline';
import { SuggestionCard } from '../aurora/SuggestionCard';
import { ExecutionSteps } from '../aurora/ExecutionSteps';
import { Morph } from '../aurora/Morph';
import type { DayItem } from './day-data';

type Open = Extract<DayItem, { kind: 'open' }>;
type Phase = 'offer' | 'working' | 'settled' | 'declined';

/** One open gap, wired end to end: offer → hold → work → settle, or leave it open. */
export function OpenSlot({ item, onStatus, defaultOpen }: { item: Open; onStatus?: (s: string, busy?: boolean) => void; defaultOpen?: boolean }) {
  const [phase, setPhase] = useState<Phase>('offer');
  const [charging, setCharging] = useState(false);

  const confirm = () => {
    setPhase('working');
    onStatus?.('Arranging', true);
    window.setTimeout(() => { setPhase('settled'); onStatus?.('Aurora is handling it'); }, item.steps.length * 460 + 1100);
  };

  const state: GapState = phase === 'settled' ? 'settled' : phase === 'working' ? 'working' : charging ? 'charging' : 'idle';

  const content =
    phase === 'offer' ? (
      <SuggestionCard
        because={item.because}
        what={item.what}
        detail={item.detail}
        signals={item.signals}
        defaultOpen={defaultOpen}
        onChargeChange={setCharging}
        onConfirm={confirm}
        onDecline={() => setPhase('declined')}
      />
    ) : phase === 'working' ? (
      <ExecutionSteps steps={item.steps} />
    ) : phase === 'settled' ? (
      <div className="au-row__entry" style={{ paddingLeft: 0 }}>
        <div className="au-row__title" style={{ color: 'var(--au-text-primary)' }}>{item.done.title}</div>
        <div className="au-row__detail" style={{ color: 'var(--au-text-tertiary)' }}>{item.done.detail}</div>
      </div>
    ) : (
      <Held why="Not today. Aurora won’t raise this one again." />
    );

  return (
    <Gap time={item.time} span={item.span} state={state}>
      <Morph contentKey={phase}>{content}</Morph>
    </Gap>
  );
}
