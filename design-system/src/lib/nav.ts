export interface NavItem {
  title: string;
  href: string;
  /** One line, used by search and index cards. */
  summary: string;
  status?: 'stable' | 'new' | 'beta';
}
export interface NavGroup { title: string; items: NavItem[] }

export const nav: NavGroup[] = [
  {
    title: 'Start',
    items: [
      { title: 'Overview', href: '/', summary: 'What Aurora is, who it is for, and how the system is organised.' },
      { title: 'Principles', href: '/principles', summary: 'Six rules every decision in the system traces back to.' },
      { title: 'Getting started', href: '/getting-started', summary: 'Install the tokens and components, or open the Figma library.' },
    ],
  },
  {
    title: 'Foundations',
    items: [
      { title: 'Color', href: '/foundations/color', summary: 'A four-step night ramp, warm bone ink, and two colours of light.' },
      { title: 'Typography', href: '/foundations/typography', summary: 'A serif for what Aurora says, a sans for the machinery.' },
      { title: 'Spacing and layout', href: '/foundations/spacing', summary: 'A 4px scale, the timeline grid, and breakpoints.' },
      { title: 'Hairlines and radius', href: '/foundations/hairlines', summary: 'Structure from 1px rules, never from shadows.' },
      { title: 'Motion', href: '/foundations/motion', summary: 'Three curves, one rule: nothing overshoots.' },
      { title: 'Light', href: '/foundations/light', summary: 'The aurora gradient, and the only places it may appear.' },
      { title: 'Voice and writing', href: '/foundations/voice', summary: 'How Aurora speaks: the reason first, specific, never urgent.' },
      { title: 'Accessibility', href: '/foundations/accessibility', summary: 'Contrast, keyboard, reduced motion and screen readers.' },
    ],
  },
  {
    title: 'Components',
    items: [
      { title: 'Button', href: '/components/button', summary: 'Four intents at two sizes, sharing one optical centre.' },
      { title: 'Hold button', href: '/components/hold-button', summary: 'Confirm by holding. The fill charges; release early and nothing is spent.' },
      { title: 'Segmented control', href: '/components/segmented-control', summary: 'Switch between two to four views of the same thing.' },
      { title: 'Label', href: '/components/label', summary: 'Uppercase, tracked metadata with optical edge trimming.' },
      { title: 'Rule', href: '/components/rule', summary: 'The 1px line that holds every layout together.' },
      { title: 'Timeline', href: '/components/timeline', summary: 'A day, top to bottom, with committed time in grey.' },
      { title: 'Gap', href: '/components/gap', summary: 'Open time: the rule breaks and light fills the break.' },
      { title: 'Suggestion card', href: '/components/suggestion-card', summary: 'One proposal for a gap, with the reason before the thing.' },
      { title: 'Reasoning trace', href: '/components/reasoning-trace', summary: 'The evidence behind a suggestion, as a ledger.' },
      { title: 'Execution steps', href: '/components/execution-steps', summary: 'The work Aurora is doing, struck as points down the beam.' },
      { title: 'Ask bar', href: '/components/ask-bar', summary: 'The quiet way back to conversation.' },
      { title: 'Tally', href: '/components/tally', summary: 'A few numbers side by side, one of them highlighted.' },
      { title: 'Quote', href: '/components/quote', summary: 'Someone else’s words, held between two rules.' },
      { title: 'Quiet state', href: '/components/quiet-state', summary: 'A first-class empty state that reads as judgement.' },
    ],
  },
  {
    title: 'Patterns',
    items: [
      { title: 'Hold to confirm', href: '/patterns/hold-to-confirm', summary: 'Why commitment is a gesture, and how the whole sequence plays out.' },
      { title: 'Morph', href: '/patterns/morph', summary: 'The motion primitive: boxes change shape, they are never swapped.' },
      { title: 'Leave it open', href: '/patterns/leave-it-open', summary: 'Dismissing by pushing aside, and designing for restraint.' },
      { title: 'The quiet day', href: '/patterns/quiet-day', summary: 'When the right answer is nothing, and how to say so.' },
      { title: 'Showcase', href: '/patterns/showcase', summary: 'A complete product screen built only from Aurora.' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { title: 'Tokens', href: '/resources/tokens', summary: 'Every token, its value and its CSS variable. Download as CSS or JSON.' },
      { title: 'Figma library', href: '/resources/figma', summary: 'Variables, text styles and components, mirrored from code.' },
      { title: 'Case study', href: '/resources/case-study', summary: 'How the system was extracted, decided and built.' },
      { title: 'Changelog', href: '/resources/changelog', summary: 'What changed, and when.' },
    ],
  },
];

export const flatNav = nav.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title })));

export function neighbours(href: string) {
  const i = flatNav.findIndex((n) => n.href === href);
  return { prev: i > 0 ? flatNav[i - 1] : null, next: i >= 0 && i < flatNav.length - 1 ? flatNav[i + 1] : null };
}

export const REPO = 'https://github.com/iziuqo/aurora-inspiration/tree/main/design-system';
export const FIGMA = 'https://www.figma.com/design/8yACQWbJrGKKR9o2Igqubw/Aurora-Design-System';

/** Header meta for a component page. */
export const componentMeta = (file: string, extra: { label: string; value: string }[] = []) => [
  { label: 'Status', value: 'Stable', dot: 'stable' as const },
  ...extra,
  { label: 'Source', value: `${file}.tsx`, href: `${REPO}/src/components/aurora/${file}.tsx` },
  { label: 'Figma', value: 'Library', href: '/resources/figma' },
];
