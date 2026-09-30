import { useEffect, useMemo, useRef, useState } from 'react';

interface Page { title: string; href: string; summary: string; group: string }

/** ⌘K search across every page. Matches titles first, then summaries. */
export default function SearchPalette({ pages }: { pages: Page[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((o) => !o); }
      else if (e.key === '/' && !(e.target as HTMLElement).closest('input, textarea')) { e.preventDefault(); setOpen(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) { setQ(''); setActive(0); requestAnimationFrame(() => input.current?.focus()); }
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return pages;
    const score = (p: Page) => {
      const t = p.title.toLowerCase();
      if (t.startsWith(s)) return 3;
      if (t.includes(s)) return 2;
      if (p.summary.toLowerCase().includes(s) || p.group.toLowerCase().includes(s)) return 1;
      return 0;
    };
    return pages.map((p) => [p, score(p)] as const).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([p]) => p);
  }, [q, pages]);

  const go = (p?: Page) => { if (p) window.location.href = p.href; };

  return (
    <>
      <button className="d-search" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label="Search the system">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><circle cx="5.6" cy="5.6" r="4.3" stroke="currentColor" /><path d="m8.8 8.8 3 3" stroke="currentColor" /></svg>
        <span className="d-search__text">Search the system</span>
        <kbd className="d-kbd">{mac ? '⌘' : 'Ctrl'} K</kbd>
      </button>
      {open && (
        <div className="d-palette" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="d-palette__panel">
            <div className="d-palette__field">
              <svg width="15" height="15" viewBox="0 0 13 13" fill="none" aria-hidden="true"><circle cx="5.6" cy="5.6" r="4.3" stroke="currentColor" /><path d="m8.8 8.8 3 3" stroke="currentColor" /></svg>
              <input
                ref={input}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpen(false);
                  else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
                  else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
                  else if (e.key === 'Enter') go(results[active]);
                }}
                placeholder="Components, foundations, patterns…"
                role="combobox"
                aria-expanded="true"
                aria-controls="d-palette-list"
                aria-activedescendant={results[active] ? `d-palette-${active}` : undefined}
                aria-autocomplete="list"
              />
              <kbd className="d-kbd">Esc</kbd>
            </div>
            <ul className="d-palette__list" id="d-palette-list" role="listbox">
              {results.length === 0 && <li className="d-palette__empty">Nothing matches “{q}”. Try a component name, or “colour”.</li>}
              {results.map((p, i) => (
                <li
                  key={p.href}
                  id={`d-palette-${i}`}
                  role="option"
                  aria-selected={i === active}
                  className="d-palette__item"
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(p)}
                >
                  <span className="d-palette__group">{p.group}</span>
                  <span className="d-palette__title">{p.title}</span>
                  <span className="d-palette__summary">{p.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
