import type { Signal } from '../aurora/ReasoningTrace';

export type DayItem =
  | { kind: 'row'; time: string; title: string; detail: string; state?: 'past' | 'present' }
  | { kind: 'held'; time: string; span: string; why: string }
  | {
      kind: 'open'; time: string; span: string; because: string; what: string; detail: string;
      signals: Signal[]; steps: string[]; done: { title: string; detail: string };
    };

const sig = (pairs: [string, string][]): Signal[] => pairs.map(([key, value]) => ({ key, value }));

export const DAY: DayItem[] = [
  { kind: 'row', time: '06.40', title: 'Landed, BA 286 from San Francisco', detail: 'Heathrow, Terminal 5', state: 'past' },
  { kind: 'row', time: '09.30', title: 'Board meeting', detail: 'Berkeley Square', state: 'present' },
  {
    kind: 'open', time: '11.00', span: 'Three hours',
    because: 'Your third red-eye this month, and nothing needs you until two.',
    what: 'Contrast and lymphatic recovery, 75 minutes.',
    detail: 'Surrenne, Knightsbridge. Nine minutes from Berkeley Square.',
    signals: sig([
      ['Calendar', 'Clear 11.00 to 14.00, no travel either side'],
      ['Health', 'Recovery 31%, three nights under five hours'],
      ['Pattern', 'You book recovery after long-hauls, eight times in nine'],
      ['Access', 'Held for you until 10.30'],
    ]),
    steps: ['Slot held', 'Car at 11.10', 'Board told you leave at 11'],
    done: { title: 'Recovery, Surrenne', detail: 'Booked · car at 11.10' },
  },
  { kind: 'row', time: '14.00', title: 'Fund review', detail: 'Call, 90 minutes' },
  { kind: 'held', time: '16.00', span: 'Open', why: 'You have been on calls before seven four mornings running. Aurora found two things worth doing here and judged neither worth this afternoon.' },
  {
    kind: 'open', time: '19.30', span: 'Evening',
    because: 'Sarah lands from Milan at six. You have not had dinner together since the third.',
    what: 'Two seats at Tanaka’s counter, eight o’clock.',
    detail: 'Released twenty minutes ago. He has cooked for you both before.',
    signals: sig([
      ['Calendar', 'Sarah, Linate to City, lands 18.05, evening clear'],
      ['History', 'Last dinner together 3 March, twenty-seven days'],
      ['Access', 'Counter cancellation, two seats, unlisted'],
      ['Judgement', 'Not a Michelin night. A reconnection one.'],
    ]),
    steps: ['Counter held for two', 'Car at 19.40', 'Sarah sent the time'],
    done: { title: 'Dinner with Sarah, Tanaka', detail: 'Booked · car at 19.40' },
  },
];
