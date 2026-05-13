import { useId, useMemo, useState } from 'react';

/**
 * Illustrative performance budget tied to the Affilomania bundle story (~50% cut).
 * Values are synthetic; the slider explores the tradeoff space.
 */
export default function PerfBudgetLab() {
  const id = useId();
  const [bundlePct, setBundlePct] = useState(38);

  const metrics = useMemo(() => {
    const b = bundlePct / 100;
    const jsMb = 0.35 + b * 1.85;
    const lcpMs = Math.round(900 + b * 2200);
    const inpMs = Math.round(80 + b * 240);
    const parseMs = Math.round(120 + b * 900);
    const budgetOk = bundlePct <= 42;
    return { jsMb, lcpMs, inpMs, parseMs, budgetOk };
  }, [bundlePct]);

  const barColor = (over: boolean) => (over ? 'var(--accent)' : 'var(--cyan)');

  return (
    <div
      className="perf-lab"
      style={{
        marginTop: 8,
        padding: '28px 26px 26px',
        borderRadius: 14,
        border: '1px solid rgba(248, 241, 255, 0.12)',
        background: 'rgba(248, 241, 255, 0.03)',
        maxWidth: 720,
      }}
    >
      <p
        style={{
          margin: '0 0 18px',
          fontSize: 15,
          lineHeight: 1.65,
          color: 'var(--dim)',
        }}
      >
        At <strong style={{ color: 'var(--ink)' }}>Affilomania</strong> we cut shipped JS roughly in half with Vite tuning, tighter dependency boundaries, and better tree-shaking. This panel is a{' '}
        <em>toy model</em>, not field data — drag the slider to see how “more bundle” pressures the same three levers I watch on real products: LCP, interaction readiness, and parse cost.
      </p>

      <div style={{ marginBottom: 20 }}>
        <label
          htmlFor={id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: 12,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--dim)',
            marginBottom: 10,
          }}
        >
          <span>Shipped JS footprint (index)</span>
          <span style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}>{bundlePct}%</span>
        </label>
        <input
          id={id}
          type="range"
          min={18}
          max={100}
          value={bundlePct}
          onChange={(e) => setBundlePct(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--accent)',
            cursor: 'pointer',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.12em',
            color: 'rgba(248, 241, 255, 0.35)',
            marginTop: 6,
          }}
        >
          <span>leaner</span>
          <span>heavier</span>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 14,
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
        }}
      >
        <MeterRow
          label="Est. main-thread parse"
          value={`~${metrics.parseMs} ms`}
          pct={Math.min(100, (metrics.parseMs / 1200) * 100)}
          over={metrics.parseMs > 520}
          color={barColor(metrics.parseMs > 520)}
        />
        <MeterRow
          label="Lab-ish LCP (slow 4G)"
          value={`~${metrics.lcpMs} ms`}
          pct={Math.min(100, (metrics.lcpMs / 4200) * 100)}
          over={metrics.lcpMs > 2500}
          color={barColor(metrics.lcpMs > 2500)}
        />
        <MeterRow
          label="Interaction budget (INP-ish)"
          value={`~${metrics.inpMs} ms`}
          pct={Math.min(100, (metrics.inpMs / 320) * 100)}
          over={metrics.inpMs > 200}
          color={barColor(metrics.inpMs > 200)}
        />
      </div>

      <div
        style={{
          marginTop: 18,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: metrics.budgetOk ? 'var(--lime)' : 'var(--accent)',
          }}
        >
          {metrics.budgetOk ? 'Inside illustrative budget' : 'Over illustrative budget'}
        </span>
        <span style={{ fontSize: 13, color: 'var(--dim)' }}>
          ~{metrics.jsMb.toFixed(2)} MB JS (gzip, modeled)
        </span>
      </div>
    </div>
  );
}

function MeterRow({
  label,
  value,
  pct,
  over,
  color,
}: {
  label: string;
  value: string;
  pct: number;
  over: boolean;
  color: string;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, color: 'var(--dim)' }}>
        <span>{label}</span>
        <span style={{ color: over ? 'var(--accent)' : 'var(--ink)' }}>{value}</span>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 999,
          background: 'rgba(248, 241, 255, 0.08)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}, color-mix(in srgb, ${color} 55%, transparent))`,
            transition: 'width 120ms ease-out',
          }}
        />
      </div>
    </div>
  );
}
