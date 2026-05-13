import { shippingYearsProse } from '../utils/experience';

export type SkillGroup = { group: string; items: string[] };

export const skills: SkillGroup[] = [
  { group: 'Foundations', items: ['TypeScript', 'JavaScript', 'Node.js', 'Python', 'CSS', 'Tailwind'] },
  { group: 'Frameworks', items: ['React', 'Next.js', 'Remix', 'React Native', 'Solid', 'Styled Components'] },
  { group: 'Build & APIs', items: ['Vite', 'Cypress', 'Turborepo', 'Storybook', 'GraphQL', 'REST', 'TanStack Start', 'DatoCMS'] },
  { group: 'AI product', items: ['LLM apps', 'RAG', 'Agents', 'pgvector', 'Prompt eval', 'TanStack Query', 'MobX'] },
];

export const craftBrands = ['monday.com', 'Healthy.io', 'Autofleet', 'Enpitech'] as const;

export type CraftPillar = {
  slug: string;
  n: string;
  category: string;
  project: string;
  body: string;
  dot: string;
};

export const craftPillars: CraftPillar[] = [
  {
    slug: 'monday-nested-blocks',
    n: '01',
    category: 'Scale',
    project: 'monday Workdocs · Block-in-Block & Callout',
    body: 'Shipped to 300k+ active users. The real work was protecting a document model from invalid states — not drawing nested UI.',
    dot: 'var(--accent)',
  },
  {
    slug: 'healthy-io-marketing',
    n: '02',
    category: 'Regulated',
    project: 'Healthy.io · FDA-cleared home urinalysis',
    body: 'Global Next.js + DatoCMS surfaces where SEO, accessibility, localization, and clinical clarity all had to hold together.',
    dot: 'var(--cyan)',
  },
  {
    slug: 'bottom-sheet',
    n: '03',
    category: 'Architecture',
    project: 'Autofleet · React Native + MobX',
    body: 'A @gorhom/bottom-sheet upgrade that looked like a version bump and behaved like a platform migration — weeks of reconciling new internals against legacy seams.',
    dot: 'var(--lime)',
  },
];

/** Long hero copy — read in the terminal via `cat intro`. */
export function heroIntroTerminalLines(): string[] {
  const yearsShipping = shippingYearsProse();
  return [
    'I build polished product interfaces and the AI workflows behind them — React, TypeScript, Next.js, Node.js, RAG, agents, and eval loops when the product needs them.',
    `${yearsShipping} shipping front-end systems across health, collaboration, logistics, and consulting. These days I’m especially interested in AI features that feel like product work, not demos: retrieval that earns trust, agents with visible boundaries, and interfaces that help people understand what the model is doing. The full thread lives in #work.`,
  ];
}

export const heroWhoamiLine =
  'saar — frontend engineer · AI product builder · Ramat Gan, IL';

export type BeyondBlock = { title: string; body: string };

/** Off the clock — campus history and dance floor. */
export const beyondBlocks: BeyondBlock[] = [
  {
    title: 'Founder — Colman Dev Club',
    body: 'Started and led the first official developer club at the College of Management, growing a community of hundreds of students around weekly workshops, practical projects, and the confidence to build in public.',
  },
  {
    title: 'Lead organizer — Hackathons',
    body: 'Led Colman Hack 2021 and MTA Hack 2019: large 24-hour build events with technical logistics, sponsorships, mentors, and hundreds of participants moving from idea to demo.',
  },
  {
    title: 'Zouk dancer & DJ',
    body: 'Away from the keyboard I social-dance Zouk and sometimes DJ for rooms I care about — reading a floor, building energy, and handing people a shared release at the end of a long week.',
  },
];
