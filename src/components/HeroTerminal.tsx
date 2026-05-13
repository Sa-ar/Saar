import { useCallback, useEffect, useRef, useState } from 'react';
import { runCommand, type CommandNavigate, type TerminalProjectRow } from '../utils/terminalCommands';

const TRANSCRIPT_CAP = 180;
const WELCOME_LINES = ['Shell ready.', 'help — command list'];

const srOnly: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export type HeroTerminalProps = {
  projects: TerminalProjectRow[];
  bioLines: string[];
  introLines: string[];
  whoamiLine: string;
  knownSlugs: string[];
  openSectionTokens: Record<string, string>;
  sectionIds: string[];
};

function applyNavigate(nav: CommandNavigate) {
  if (nav.kind === 'hash') {
    const id = nav.value.replace(/^#/, '');
    window.location.hash = id;
    return;
  }
  window.location.assign(nav.value);
}

function pushLines(prev: string[], additions: string[]): string[] {
  const next = [...prev, ...additions];
  if (next.length <= TRANSCRIPT_CAP) return next;
  return next.slice(next.length - TRANSCRIPT_CAP);
}

export default function HeroTerminal({
  projects,
  bioLines,
  introLines,
  whoamiLine,
  knownSlugs,
  openSectionTokens,
  sectionIds,
}: HeroTerminalProps) {
  const slugSet = useRef(new Set(knownSlugs));
  useEffect(() => {
    slugSet.current = new Set(knownSlugs);
  }, [knownSlugs]);

  const [lines, setLines] = useState<string[]>(() => [...WELCOME_LINES]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIndex, setHistIndex] = useState<number | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = transcriptRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [lines]);

  const exec = useCallback(
    (raw: string) => {
      const ctx = {
        projects,
        bioLines,
        introLines,
        whoamiLine,
        knownSlugs: slugSet.current,
        openSectionTokens,
        sectionIds,
      };
      const echo = `$ ${raw.trimEnd()}`;
      const trimmed = raw.trim();
      if (trimmed) {
        setHistory((h) => [...h, trimmed].slice(-80));
      }
      setHistIndex(null);

      if (!trimmed) {
        setLines((prev) => pushLines(prev, [echo, '']));
        return;
      }

      const result = runCommand(trimmed, ctx);
      if (result.lines[0] === '__CLEAR__') {
        setLines([...WELCOME_LINES]);
        return;
      }

      const out = [...result.lines];
      if (result.navigate) {
        queueMicrotask(() => applyNavigate(result.navigate!));
      }
      setLines((prev) => pushLines(prev, [echo, ...out, '']));
    },
    [projects, bioLines, introLines, whoamiLine, openSectionTokens, sectionIds],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const v = input;
      setInput('');
      exec(v);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      setHistIndex((i) => {
        const next = i === null ? history.length - 1 : Math.max(0, i - 1);
        setInput(history[next] ?? '');
        return next;
      });
      return;
    }
    if (e.key === 'ArrowDown' && histIndex !== null) {
      e.preventDefault();
      setHistIndex((i) => {
        if (i === null) return null;
        if (i >= history.length - 1) {
          setInput('');
          return null;
        }
        const next = i + 1;
        setInput(history[next] ?? '');
        return next;
      });
    }
  };

  return (
    <div className="hero-terminal-root">
      <div className="hero-terminal-panel">
        <div className="hero-terminal-sheen" aria-hidden />
        <div className="hero-terminal-body">
          <div className="hero-terminal-chrome">
            <span className="hero-terminal-traffic" aria-hidden>
              <span className="hero-terminal-traffic-dot hero-terminal-traffic-dot--r" />
              <span className="hero-terminal-traffic-dot hero-terminal-traffic-dot--a" />
              <span className="hero-terminal-traffic-dot hero-terminal-traffic-dot--g" />
            </span>
            <span className="hero-terminal-path">
              saar<span className="hero-terminal-path-muted">@</span>portfolio{' '}
              <span className="hero-terminal-path-cwd">~</span>
            </span>
            <span className="hero-terminal-chrome-spacer" aria-hidden />
          </div>
          <div
            ref={transcriptRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            className="hero-terminal-transcript"
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`hero-terminal-line${line.startsWith('$ ') ? ' hero-terminal-line--cmd' : ''}`}
              >
                {line}
              </div>
            ))}
          </div>
          <div className="hero-terminal-input-row">
            <span className="hero-terminal-prompt" aria-hidden>
              {'›'}
            </span>
            <label htmlFor="hero-terminal-input" style={srOnly}>
              Terminal command line
            </label>
            <input
              id="hero-terminal-input"
              className="hero-terminal-input"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="help"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
