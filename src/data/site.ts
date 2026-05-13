/** Work cards: newest → oldest (reverse chronological). */
export type ProjectSection = {
  heading: string;
  text: string;
  caseStudySlug?: string;
};

export type ProjectWithSections = {
  tag: string;
  year: string;
  role: string;
  title: string;
  sections: ProjectSection[];
  stack: string[];
};

export type ProjectWithBlurb = {
  tag: string;
  year: string;
  role: string;
  title: string;
  blurb: string;
  caseStudySlug?: string;
  stack: string[];
};

export type Project = ProjectWithSections | ProjectWithBlurb;

export const projects: Project[] = [
  {
    tag: 'Enpitech',
    year: '2023 — now',
    role: 'Senior Frontend · AI product',
    title: 'Enpitech — product engineering across mobile, web, and AI',
    sections: [
      {
        heading: 'Autofleet',
        text: 'Built a new React Native app with TypeScript and MobX on top of an existing product that still carried legacy constraints. It was the faster path to ship fleet operations, automated IRS reporting, driver maintenance, and Cypress regression coverage — but the new work had to live with the old seams. The deepest story was a @gorhom/bottom-sheet upgrade that looked small on paper and behaved like a platform migration — case study below.',
        caseStudySlug: 'bottom-sheet',
      },
      {
        heading: 'Affilomania',
        text: 'Cut bundle size by roughly half with Vite tuning, tighter dependency boundaries, and tree-shaking that made the product feel lighter without changing what users came for.',
      },
      {
        heading: 'Enpitech.dev',
        text: 'Built and shipped the company marketing site in Remix and Tailwind, balancing Core Web Vitals, typography, motion, and a handoff that another team could actually live with.',
      },
    ],
    stack: ['React Native', 'TypeScript', 'Node.js', 'MobX', 'Remix', 'Tailwind', 'Cypress', 'Vite'],
  },
  {
    tag: 'Workdocs · monday.com',
    year: '2022',
    role: 'Full-stack',
    title: 'monday.com — doc building blocks',
    blurb:
      'Worked on monday Workdocs, shipping Block-in-Block and Callout blocks used by 300k+ active users. The work was less about drawing nested UI and more about protecting a document model from invalid states.',
    caseStudySlug: 'monday-nested-blocks',
    stack: ['React', 'Node.js', 'SASS', 'GraphQL', 'Redux'],
  },
  {
    tag: 'Digital health',
    year: '2021 — 22',
    role: 'Frontend',
    title: 'Healthy.io — marketing & regulated product UI',
    blurb:
      'Maintained and improved global Next.js and DatoCMS properties where SEO, accessibility, localization, and content velocity all mattered. Also contributed to internal and patient-facing product surfaces for FDA-cleared home urinalysis, where UI states had to be clear and careful.',
    caseStudySlug: 'healthy-io-marketing',
    stack: ['Next.js', 'Node.js', 'DatoCMS', 'React', 'Styled Components', 'GraphQL'],
  },
  {
    tag: 'Social impact',
    year: '2020 — 21',
    role: 'Full-stack',
    title: 'DonateIt — donation MVP',
    blurb:
      'Early-career full-stack MVP for a social donation platform: real-time contribution tracking, donor-facing flows, and the first lessons in turning messy product needs into something people can use.',
    stack: ['React', 'Node.js', 'REST'],
  },
];

/**
 * Section ids must match `id=""` on the homepage (index.astro).
 * Aliases are extra tokens for `open <name>` (all matched lowercase).
 */
export const siteSectionAnchors: { id: string; aliases?: string[] }[] = [
  { id: 'about', aliases: ['me', 'bio'] },
  { id: 'craft', aliases: ['proof', 'receipts', 'cases', 'stats'] },
  { id: 'work', aliases: ['projects', 'shipping', 'portfolio'] },
  { id: 'beyond', aliases: ['life', 'outside'] },
  { id: 'stack', aliases: ['skills', 'tools', 'tech'] },
  { id: 'contact', aliases: ['touch', 'hello', 'hire', 'linkedin', 'email'] },
];

/** Flat map: token (lowercase) → canonical section id for `open`. */
export function sectionOpenTokenToId(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const { id, aliases = [] } of siteSectionAnchors) {
    out[id.toLowerCase()] = id;
    for (const a of aliases) {
      out[a.toLowerCase()] = id;
    }
  }
  return out;
}

/** Short lines for `cat bio` / `cat README.md` in the hero terminal. */
export const heroTerminalBioLines: string[] = [
  'Frontend engineer based in Ramat Gan, Israel.',
  'Ships React / TypeScript / Next.js interfaces and the AI workflows behind them.',
  'Care about retrieval people can trust, agents with boundaries, and evals tied to real tasks.',
  'For the longer hero pitch: cat intro',
];

export function collectCaseStudySlugs(project: Project): string[] {
  if ('sections' in project) {
    return project.sections.flatMap((s) => (s.caseStudySlug ? [s.caseStudySlug] : []));
  }
  return project.caseStudySlug ? [project.caseStudySlug] : [];
}

export function allCaseStudySlugs(projectsList: Project[]): string[] {
  const set = new Set<string>();
  for (const p of projectsList) {
    for (const slug of collectCaseStudySlugs(p)) {
      set.add(slug);
    }
  }
  return [...set];
}
