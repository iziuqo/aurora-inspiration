import { useState } from 'react';
import { Morph } from '../aurora/Morph';
import { ExecutionSteps } from '../aurora/ExecutionSteps';
import { Button } from '../aurora/Button';

/** A box that changes into another box. Toggle to see the height glide while the contents dissolve. */
export default function MorphDemo() {
  const [k, setK] = useState<'a' | 'b'>('a');
  return (
    <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ border: '1px solid var(--au-border-hairline)', borderRadius: 6, background: 'var(--au-bg-raised)', padding: '0 18px' }}>
        <Morph contentKey={k}>
          {k === 'a' ? (
            <div style={{ padding: '18px 0' }}>
              <div style={{ fontFamily: 'var(--au-font-serif)', fontSize: 14, color: 'var(--au-text-tertiary)', paddingBottom: 12, marginBottom: 12, borderBottom: '1px solid var(--au-border-hairline)' }}>Nothing needs you until two.</div>
              <div style={{ fontFamily: 'var(--au-font-serif)', fontSize: 20, lineHeight: 1.3, color: 'var(--au-text-primary)' }}>Contrast and lymphatic recovery, 75 minutes.</div>
              <div style={{ fontSize: 13, color: 'var(--au-text-label)', marginTop: 8 }}>Surrenne, Knightsbridge.</div>
            </div>
          ) : (
            <div style={{ paddingLeft: 11 }}><ExecutionSteps steps={['Slot held', 'Car at 11.10', 'Board told you leave at 11']} /></div>
          )}
        </Morph>
      </div>
      <Button variant="secondary" size="sm" onClick={() => setK((v) => (v === 'a' ? 'b' : 'a'))}>{k === 'a' ? 'Morph to the work' : 'Morph back'}</Button>
    </div>
  );
}
