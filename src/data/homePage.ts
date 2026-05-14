import { shippingYearsProse } from '../utils/experience';

export type SkillGroup = { group: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    group: 'Frontend',
    items: [
      'React',
      'TypeScript',
      'Next.js',
      'Remix',
      'React Native',
      'Tailwind',
      'Styled Components',
    ],
  },
  {
    group: 'Product systems',
    items: ['Design systems', 'Accessibility', 'Performance', 'DX', 'Storybook', 'Cypress'],
  },
  {
    group: 'AI product',
    items: ['LLM apps', 'RAG', 'Agents', 'pgvector', 'Prompt evaluation'],
  },
  {
    group: 'Backend & data',
    items: ['Node.js', 'GraphQL', 'REST', 'PostgreSQL', 'Python'],
  },
];

/** Longer pitch — hero terminal `cat intro`. */
export function heroIntroTerminalLines(): string[] {
  const yearsShipping = shippingYearsProse();
  return [
    'I build frontend systems for complex products. Most of my work is React, TypeScript, React Native, and product UI architecture; recently more AI-powered product flows too.',
    `${yearsShipping} across health, collaboration, and logistics. More in #experience.`,
  ];
}

export const heroWhoamiLine = 'saar — senior frontend engineer · Ramat Gan, IL';

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
