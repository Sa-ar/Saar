import { useEffect, useMemo, useRef, useState } from 'react';

export interface SkillGroup {
  group: string;
  items: string[];
}

const GROUP_ACCENTS = ['var(--accent)', 'var(--cyan)', 'var(--violet)', 'var(--lime)'] as const;
const PILL_ACCENTS = ['var(--accent)', 'var(--cyan)', 'var(--lime)', 'var(--violet)'] as const;

export default function StackShowcase({ skills }: { skills: SkillGroup[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  const orbitLabels = useMemo(() => {
    const flat = skills.flatMap((g) => g.items);
    return flat.length ? [...flat, ...flat] : [];
  }, [skills]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const bump = () => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setOn(true);
    };
    bump();
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="stack-showcase-wrap">
      {orbitLabels.length > 0 && (
        <div className="stack-showcase-orbit" aria-hidden="true">
          <div className="stack-showcase-orbit-track">
            {orbitLabels.map((label, i) => (
              <span key={`${label}-${i}`} className="stack-orbit-chip">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="stack-showcase-grid">
        {skills.map((g, gi) => {
          const accent = GROUP_ACCENTS[gi % GROUP_ACCENTS.length];
          return (
            <div
              key={g.group}
              className="stack-showcase-card"
              style={{ ['--g-accent' as string]: accent }}
            >
              <div className="stack-showcase-group-head">
                <span className="stack-showcase-dot" style={{ background: accent, boxShadow: `0 0 12px ${accent}` }} />
                <span className="stack-showcase-group-label">{g.group}</span>
              </div>
              <ul className="stack-pill-list">
                {g.items.map((it, ii) => {
                  const pillAccent = PILL_ACCENTS[(gi + ii) % PILL_ACCENTS.length];
                  return (
                    <li key={it}>
                      <span
                        className={`stack-pill${on ? ' stack-pill--in' : ''}`}
                        style={{
                          ['--pill-accent' as string]: pillAccent,
                          transitionDelay: on ? `${gi * 70 + ii * 55}ms` : '0ms',
                        }}
                      >
                        {it}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
