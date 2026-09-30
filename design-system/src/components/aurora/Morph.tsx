import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import './Morph.css';

export interface MorphProps {
  /** Change this to morph. The box keeps its place, glides to the new height, and cross-dissolves. */
  contentKey: string;
  children: ReactNode;
  className?: string;
  onDone?: () => void;
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The one motion primitive everything else is built from.
 * Nothing is ever swapped: the container glides from its old height to its new one
 * while the old contents dissolve into the new ones.
 */
export function Morph({ contentKey, children, className, onDone }: MorphProps) {
  const [layers, setLayers] = useState<{ key: string; node: ReactNode }[]>([{ key: contentKey, node: children }]);
  const box = useRef<HTMLDivElement>(null);
  const incoming = useRef<HTMLDivElement>(null);
  const prevKey = useRef(contentKey);

  // Keep the current layer's children live when they change without a key change.
  if (prevKey.current === contentKey && layers.length === 1 && layers[0].node !== children) {
    setLayers([{ key: contentKey, node: children }]);
  }

  useLayoutEffect(() => {
    if (prevKey.current === contentKey) return;
    prevKey.current = contentKey;
    const el = box.current;
    if (!el || reduced()) { setLayers([{ key: contentKey, node: children }]); onDone?.(); return; }
    el.style.height = `${el.offsetHeight}px`;
    setLayers((l) => [l[l.length - 1], { key: contentKey, node: children }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentKey]);

  useLayoutEffect(() => {
    if (layers.length < 2) return;
    const el = box.current, inc = incoming.current;
    if (!el || !inc) return;
    const h1 = inc.offsetHeight;
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'height 660ms var(--au-ease-glide)';
      el.style.height = `${h1}px`;
      el.dataset.morphing = 'true';
    });
    const t = window.setTimeout(() => {
      el.style.transition = '';
      el.style.height = '';
      delete el.dataset.morphing;
      setLayers((l) => [l[l.length - 1]]);
      onDone?.();
    }, 700);
    return () => { cancelAnimationFrame(raf); window.clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers.length]);

  const morphing = layers.length > 1;
  return (
    <div ref={box} className={['au-morph', className].filter(Boolean).join(' ')} style={{ position: 'relative', overflow: morphing ? 'hidden' : undefined }}>
      {layers.map((layer, i) => {
        const isOut = morphing && i === 0;
        const isIn = morphing && i === 1;
        return (
          <div
            key={layer.key}
            ref={isIn ? incoming : undefined}
            aria-hidden={isOut || undefined}
            className={isOut ? 'au-morph__out' : isIn ? 'au-morph__in' : undefined}
            style={morphing ? { position: 'absolute', left: 0, right: 0, top: 0 } : undefined}
          >
            {layer.node}
          </div>
        );
      })}
    </div>
  );
}
