/** Work cards: newest → oldest (reverse chronological). */
export type ProjectSection = {
  heading: string;
  text: string;
  /** Supplementary line (e.g. other work), visually de-emphasized */
  aside?: string;
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
    role: 'Senior Frontend Engineer',
    title: 'Enpitech — client product teams, web and mobile',
    sections: [
      {
        heading: 'Autofleet',
        text: 'At Enpitech, I worked inside client product teams across web and mobile. At Autofleet, I worked on a React Native product with legacy constraints. One notable project was a Bottom Sheet upgrade that exposed hidden coupling across navigation, keyboard behavior, gestures, and layout.',
        aside:
          'Other work included reporting flows, maintenance history, regression coverage, and web performance improvements.',
        caseStudySlug: 'bottom-sheet',
      },
      {
        heading: 'Affilomania',
        text: 'Roughly halved bundle size with Vite tuning, tighter dependency boundaries, and tree-shaking.',
      },
      {
        heading: 'Enpitech.dev',
        text: 'Company marketing site in Remix and Tailwind: Core Web Vitals, typography, motion, and a maintainable handoff.',
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
      'At monday.com, I worked on Workdocs, a production-scale React editor. One of the main projects was NestedBlock: extending the editor architecture so some blocks could contain other blocks, without allowing invalid document states.',
    caseStudySlug: 'monday-nested-blocks',
    stack: ['React', 'Node.js', 'SASS', 'GraphQL', 'Redux'],
  },
  {
    tag: 'Digital health',
    year: '2021 — 22',
    role: 'Frontend',
    title: 'Healthy.io — marketing & product UI',
    blurb:
      'At Healthy.io, I worked on frontend surfaces in a regulated health-tech environment. The work included marketing systems, product UI, SEO-sensitive pages, accessibility, and localization concerns.',
    caseStudySlug: 'healthy-io-marketing',
    stack: ['Next.js', 'Node.js', 'DatoCMS', 'React', 'Styled Components', 'GraphQL'],
  },
  {
    tag: 'Social impact',
    year: '2020 — 21',
    role: 'Full-stack',
    title: 'DonateIt — donation MVP',
    blurb:
      'Full-stack MVP for a social donation platform: contributions, donor flows, and early lessons in turning vague product asks into something shippable.',
    stack: ['React', 'Node.js', 'REST'],
  },
];

/**
 * Section ids must match `id=""` on the homepage section components.
 * Aliases are extra tokens for `open <name>` (all matched lowercase).
 */
export const siteSectionAnchors: { id: string; aliases?: string[] }[] = [
  {
    id: 'proof',
    aliases: ['mix', 'uncommon', 'receipts', 'craft', 'cases', 'stats'],
  },
  { id: 'about', aliases: ['me', 'bio'] },
  {
    id: 'experience',
    aliases: ['work', 'projects', 'shipping', 'portfolio'],
  },
  { id: 'stack', aliases: ['skills', 'tools', 'tech'] },
  { id: 'contact', aliases: ['touch', 'hello', 'hire', 'linkedin', 'email'] },
  { id: 'beyond', aliases: ['life', 'outside'] },
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
  'Senior frontend engineer based in Ramat Gan, Israel.',
  'Mostly React, TypeScript, React Native, and product UI architecture; some AI-powered product flows lately.',
  'For a bit more: cat intro',
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
