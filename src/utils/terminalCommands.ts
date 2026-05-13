export type TerminalProjectRow = {
  title: string;
  year: string;
  tag: string;
  role: string;
  caseStudySlugs: string[];
};

export type RunCommandContext = {
  projects: TerminalProjectRow[];
  bioLines: string[];
  introLines: string[];
  whoamiLine: string;
  knownSlugs: Set<string>;
  /** Lowercase token → section id (e.g. contact → contact) */
  openSectionTokens: Record<string, string>;
  /** Canonical homepage section ids (for prefix match) */
  sectionIds: string[];
};

export type CommandNavigate = { kind: 'hash'; value: string } | { kind: 'path'; value: string };

export type CommandResult = {
  lines: string[];
  navigate?: CommandNavigate;
};

const MAX_HELP_WIDTH = 72;
const WRAP_WIDTH = 78;

function padRight(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

/** Greedy word-wrap for transcript readability. */
function wrapParagraph(text: string, width = WRAP_WIDTH): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length <= width) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = w.length > width ? `${w.slice(0, width - 1)}…` : w;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function flattenIntro(lines: string[]): string[] {
  const out: string[] = [];
  for (const para of lines) {
    out.push(...wrapParagraph(para));
    out.push('');
  }
  return out.length ? out.slice(0, -1) : out;
}

function projectMatchesLsQuery(p: TerminalProjectRow, needle: string): boolean {
  const n = needle.toLowerCase();
  if (!n) return true;
  if (p.tag.toLowerCase().includes(n)) return true;
  if (p.title.toLowerCase().includes(n)) return true;
  if (p.role.toLowerCase().includes(n)) return true;
  for (const s of p.caseStudySlugs) {
    const sl = s.toLowerCase();
    if (sl === n || sl.includes(n)) return true;
    const slCompact = sl.replace(/-/g, '');
    const nCompact = n.replace(/-/g, '');
    if (nCompact.length >= 2 && slCompact.includes(nCompact)) return true;
  }
  return false;
}

function formatProjectTable(rows: TerminalProjectRow[]): string[] {
  if (rows.length === 0) {
    return ['(no matching projects)'];
  }
  const slugW = Math.min(
    28,
    Math.max(
      10,
      ...rows.map((p) => (p.caseStudySlugs.length ? p.caseStudySlugs.join(',').length : 2)),
    ),
  );
  const titleW = Math.min(
    MAX_HELP_WIDTH,
    Math.max(12, ...rows.map((p) => p.title.length)),
  );
  const yearW = Math.max(4, ...rows.map((p) => p.year.length));
  const head = `${padRight('TITLE', titleW)}  ${padRight('YEAR', yearW)}  ${padRight('SLUGS', slugW)}  TAG`;
  const sep = `${'-'.repeat(titleW)}  ${'-'.repeat(yearW)}  ${'-'.repeat(slugW)}  ${'-'.repeat(20)}`;
  const lines = rows.map((p) => {
    const t = p.title.length > titleW ? `${p.title.slice(0, titleW - 1)}…` : padRight(p.title, titleW);
    const y = padRight(p.year, yearW);
    const slugCell = p.caseStudySlugs.length ? padRight(p.caseStudySlugs.join(', '), slugW) : padRight('—', slugW);
    return `${t}  ${y}  ${slugCell}  ${p.tag}`;
  });
  return [head, sep, ...lines];
}

function tryUniqueSlug(t: string, slugs: Set<string>): { slug: string } | { ambiguous: string[] } | null {
  if (slugs.has(t)) return { slug: t };
  const arr = [...slugs].sort();
  const starts = arr.filter((s) => s.startsWith(t));
  if (starts.length === 1) return { slug: starts[0]! };
  if (starts.length > 1) return { ambiguous: starts };
  if (t.length < 2) return null;
  const subs = arr.filter((s) => s.includes(t));
  if (subs.length === 1) return { slug: subs[0]! };
  if (subs.length > 1) return { ambiguous: subs };
  return null;
}

function trySectionHash(
  t: string,
  tokenToId: Record<string, string>,
  sectionIds: string[],
): { id: string } | { ambiguous: string[] } | null {
  const direct = tokenToId[t];
  if (direct) return { id: direct };

  const idStarts = sectionIds.filter((id) => id.startsWith(t));
  if (idStarts.length === 1) return { id: idStarts[0]! };
  if (idStarts.length > 1) return { ambiguous: idStarts };

  if (t.length < 3) return null;
  const idSubs = sectionIds.filter((id) => id.includes(t));
  if (idSubs.length === 1) return { id: idSubs[0]! };
  if (idSubs.length > 1) return { ambiguous: idSubs };

  return null;
}

function openUnknownLines(t: string, ctx: RunCommandContext): string[] {
  const sections = [...ctx.sectionIds].sort().join(', ');
  const slugs = [...ctx.knownSlugs].sort().join(', ');
  return [
    `open: no match for "${t}".`,
    `Homepage sections: ${sections} (try open contact, open stack, …)`,
    ctx.knownSlugs.size > 0 ? `Case studies: ${slugs}` : 'No case study routes in data.',
    'Type routes for a full list.',
  ];
}

export function runCommand(raw: string, ctx: RunCommandContext): CommandResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { lines: [] };
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  const cmd = parts[0]!.toLowerCase();
  const arg = parts.slice(1).join(' ').trim();
  const argLower = arg.toLowerCase();

  if (cmd === 'clear') {
    return { lines: ['__CLEAR__'] };
  }

  // Undocumented
  if (cmd === 'claude' && !arg) {
    return { lines: ['No, my name is Saar.'] };
  }

  if (cmd === 'help') {
    const sections = [...ctx.sectionIds].sort().join(', ');
    const slugs = [...ctx.knownSlugs].sort().join(', ');
    return {
      lines: [
        'Commands:',
        '  help              Show this list',
        '  routes            All open targets (sections + case studies)',
        '  ls [filter]       Projects (optional: tag, title, role, or case-study slug substring)',
        '  whoami            One-line identity',
        '  cat bio           Short bio (same as cat README.md)',
        '  cat intro         Longer hero pitch (moved from the hero)',
        '  open <target>     Scroll to #section or open /work/<slug> (prefix & fuzzy)',
        '  clear             Clear the transcript',
        '',
        `Sections: ${sections}`,
        ctx.knownSlugs.size > 0 ? `Case study slugs: ${slugs}` : 'Case studies: (none in data)',
      ],
    };
  }

  if (cmd === 'routes') {
    const rows: string[] = ['#sections', ...[...ctx.sectionIds].sort().map((id) => `  #${id}`), ''];
    if (ctx.knownSlugs.size > 0) {
      rows.push('/work/*');
      for (const s of [...ctx.knownSlugs].sort()) {
        rows.push(`  /work/${s}`);
      }
    } else {
      rows.push('(no /work case studies in data)');
    }
    return { lines: rows };
  }

  if (cmd === 'whoami') {
    return { lines: [ctx.whoamiLine] };
  }

  if (cmd === 'cat') {
    const target = argLower;
    if (target === 'bio' || target === 'readme.md' || target === 'readme') {
      return { lines: [...ctx.bioLines] };
    }
    if (target === 'intro' || target === 'pitch.txt' || target === 'hero.txt') {
      return { lines: flattenIntro(ctx.introLines) };
    }
    return {
      lines: [
        `cat: ${arg || '(nothing)'}: No such file`,
        'Try: cat bio | cat README.md | cat intro',
      ],
    };
  }

  if (cmd === 'ls') {
    if (ctx.projects.length === 0) {
      return { lines: ['(no projects)'] };
    }
    const listAll = !argLower || argLower === 'projects' || argLower === 'project';
    const filtered = listAll
      ? ctx.projects
      : ctx.projects.filter((p) => projectMatchesLsQuery(p, arg.trim()));
    const table = formatProjectTable(filtered);
    if (!listAll && filtered.length === 0) {
      return {
        lines: [
          `ls: no projects match "${arg}".`,
          'Try: ls (all rows), or a tag / title / slug fragment (e.g. ls Enpitech, ls bottom).',
        ],
      };
    }
    if (!listAll) {
      return { lines: [`ls: filter "${arg}"`, '', ...table] };
    }
    return { lines: table };
  }

  if (cmd === 'open') {
    const t = argLower.replace(/^#/, '');
    if (t === '') {
      return {
        lines: ['Opening #work …'],
        navigate: { kind: 'hash', value: 'work' },
      };
    }

    const slugTry = tryUniqueSlug(t, ctx.knownSlugs);
    if (slugTry && 'slug' in slugTry) {
      const slug = slugTry.slug;
      return {
        lines: [`Opening /work/${slug} …`],
        navigate: { kind: 'path', value: `/work/${slug}` },
      };
    }
    if (slugTry && 'ambiguous' in slugTry) {
      return {
        lines: [
          `open: "${arg}" matches multiple case studies:`,
          ...slugTry.ambiguous.map((s) => `  ${s}`),
          'Type a longer prefix or the full slug.',
        ],
      };
    }

    const secTry = trySectionHash(t, ctx.openSectionTokens, ctx.sectionIds);
    if (secTry && 'id' in secTry) {
      return {
        lines: [`Opening #${secTry.id} …`],
        navigate: { kind: 'hash', value: secTry.id },
      };
    }
    if (secTry && 'ambiguous' in secTry) {
      return {
        lines: [
          `open: "${arg}" matches multiple sections:`,
          ...secTry.ambiguous.map((s) => `  #${s}`),
        ],
      };
    }

    return { lines: openUnknownLines(t, ctx) };
  }

  return {
    lines: [
      `command not found: ${parts[0]}`,
      'Type help for a list of commands.',
    ],
  };
}
