import { useState, useMemo, useCallback } from 'react';

// ── tree data ──────────────────────────────────────────────────────────────
interface TreeNode { id: number; name: string; children: TreeNode[]; depth?: number; leafCount?: number; }

function makeTree(): TreeNode {
  let id = 0;
  const n = (name: string, children: TreeNode[] = []): TreeNode => ({ id: id++, name, children });
  return n('App', [
    n('Header', [n('Logo'), n('Link'), n('Link')]),
    n('Hero',   [n('Title')]),
    n('Grid',   [n('Card'), n('Card')]),
    n('Footer'),
  ]);
}

function assignMeta(node: TreeNode, depth: number) {
  node.depth = depth;
  if (!node.children.length) { node.leafCount = 1; return; }
  let sum = 0;
  node.children.forEach(c => { assignMeta(c, depth + 1); sum += c.leafCount!; });
  node.leafCount = sum;
}

interface LayoutNode { id: number; name: string; x: number; y: number; depth: number; parentId: number | null; }
interface Edge { fromId: number; toId: number; }

function layoutTree(root: TreeNode) {
  assignMeta(root, 0);
  const nodes: LayoutNode[] = [], edges: Edge[] = [];
  let maxDepth = 0;
  const findMax = (n: TreeNode) => { maxDepth = Math.max(maxDepth, n.depth!); n.children.forEach(findMax); };
  findMax(root);
  const padX = 6, padY = 20;
  const yFor = (d: number) => maxDepth === 0 ? 50 : padY + (100 - padY * 2) * d / maxDepth;
  function place(node: TreeNode, x0: number, x1: number, par: LayoutNode | null) {
    const cx = (x0 + x1) / 2;
    const ln: LayoutNode = { id: node.id, name: node.name, x: cx, y: yFor(node.depth!), depth: node.depth!, parentId: par ? par.id : null };
    nodes.push(ln);
    if (par) edges.push({ fromId: par.id, toId: node.id });
    if (node.children.length) {
      let cur = x0;
      node.children.forEach(c => {
        const w = (x1 - x0) * c.leafCount! / node.leafCount!;
        place(c, cur, cur + w, ln);
        cur += w;
      });
    }
  }
  place(root, padX, 100 - padX, null);
  return { nodes, edges, maxDepth };
}

const TREE_LAYOUT = layoutTree(makeTree());
const PALETTE = ['#A855F7', '#22D3EE', '#FFB800', '#C6F432', '#FF2D87'];
const nodeColor = (d: number) => PALETTE[d % PALETTE.length];
const GRID_BG = 'repeating-linear-gradient(0deg,transparent 0 23px,rgba(248,241,255,.05) 23px 24px),repeating-linear-gradient(90deg,transparent 0 23px,rgba(248,241,255,.05) 23px 24px)';

// ── component ──────────────────────────────────────────────────────────────
export default function ComponentTree() {
  const [hoverId, setHoverId] = useState<number | null>(null);
  const [flashes, setFlashes] = useState<Record<number, number>>({});
  const { nodes, edges, maxDepth } = TREE_LAYOUT;

  const descendants = useMemo(() => {
    if (hoverId == null) return null;
    const s = new Set([hoverId]);
    let added = true;
    while (added) {
      added = false;
      edges.forEach(e => { if (s.has(e.fromId) && !s.has(e.toId)) { s.add(e.toId); added = true; } });
    }
    return s;
  }, [hoverId, edges]);

  const flash = useCallback((rootId: number) => {
    const s = new Set([rootId]);
    let added = true;
    while (added) {
      added = false;
      edges.forEach(e => { if (s.has(e.fromId) && !s.has(e.toId)) { s.add(e.toId); added = true; } });
    }
    const now = Date.now();
    setFlashes(prev => { const n = { ...prev }; s.forEach(id => { n[id] = now; }); return n; });
    setTimeout(() => setFlashes(prev => {
      const out = { ...prev };
      Object.keys(out).forEach(k => { if (out[+k] === now) delete out[+k]; });
      return out;
    }), 700);
  }, [edges]);

  const remount = useCallback(() => {
    const now = Date.now(), all: Record<number,number> = {};
    nodes.forEach(n => { all[n.id] = now; });
    setFlashes(all);
    setTimeout(() => setFlashes({}), 700);
  }, [nodes]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1.25/1', background: '#15091F', border: '1px solid rgba(168,85,247,.35)', borderRadius: 14, boxShadow: '0 0 60px rgba(168,85,247,.2), inset 0 1px 0 rgba(248,241,255,.06)', overflow: 'hidden' }}>
      {/* title bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(248,241,255,.08)', background: 'rgba(0,0,0,.4)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(248,241,255,.6)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
        </div>
        <span>react devtools — saar.tsx</span>
        <span style={{ opacity: 0.75 }}>{nodes.length} nodes · demo</span>
      </div>

      {/* canvas */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 38px)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: GRID_BG }} />

        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {edges.map((ed, i) => {
            const from = nodes.find(n => n.id === ed.fromId)!;
            const to   = nodes.find(n => n.id === ed.toId)!;
            const dim  = descendants && !descendants.has(to.id);
            return <line key={i} x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`} stroke={nodeColor(to.depth)} strokeWidth="1.5" strokeDasharray="6 4" opacity={dim ? 0.08 : 0.45} style={{ transition: 'opacity 200ms' }} />;
          })}
        </svg>

        {nodes.map(n => {
          const c        = nodeColor(n.depth);
          const flashing = !!flashes[n.id];
          const dim      = descendants && !descendants.has(n.id);
          const isHover  = hoverId === n.id;
          const scale    = n.depth === 0 ? 1.15 : n.depth === maxDepth ? 0.85 : 1;
          return (
            <button type="button" key={n.id}
              className="component-tree-node"
              onMouseEnter={() => setHoverId(n.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => flash(n.id)}
              title={`<${n.name} />`}
              style={{
                position: 'absolute', left: `${n.x}%`, top: `${n.y}%`,
                transform: `translate(-50%,-50%) scale(${flashing ? 1.12 : isHover ? 1.05 : 1}) scale(${scale})`,
                width: 76, height: 28, borderRadius: 6,
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.02em',
                opacity: dim ? 0.2 : 1, cursor: 'pointer', padding: '0 8px',
                display: 'grid', placeItems: 'center', textAlign: 'center',
                transition: 'transform 180ms cubic-bezier(.34,1.56,.64,1), opacity 180ms, box-shadow 250ms, background 200ms, border-color 200ms, color 200ms',
                zIndex: (isHover || flashing) ? 3 : 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                background: (isHover || flashing) ? c : 'rgba(248,241,255,.06)',
                border: `1px solid ${(flashing || isHover) ? c : 'rgba(248,241,255,.18)'}`,
                boxShadow: flashing ? `0 0 18px ${c}cc` : 'none',
                color: (isHover || flashing) ? '#0A0512' : 'var(--ink)',
                fontWeight: 600,
              }}
            >{`<${n.name}/>`}</button>
          );
        })}

        <div style={{ position: 'absolute', bottom: 10, left: 14, right: 14, fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(248,241,255,.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', letterSpacing: '.04em' }}>
          <span>hover subtree · click node to pulse branch</span>
          <button type="button" onClick={remount} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', background: 'rgba(248,241,255,.06)', color: 'var(--ink)', border: '1px solid rgba(248,241,255,.2)', padding: '4px 10px', borderRadius: 999, cursor: 'pointer' }}>↻ pulse all</button>
        </div>
      </div>
    </div>
  );
}
