/**
 * First date you count as shipping professionally (used for “n+ years” copy site-wide).
 * Anniversary-based: adjust to your real first day for an accurate count.
 */
export const CAREER_SHIPPING_START = new Date('2020-06-01T12:00:00.000Z');

/** Whole calendar years completed between `start` and `ref` (anniversary-based). */
export function fullYearsSince(start: Date, ref: Date = new Date()): number {
  let years = ref.getFullYear() - start.getFullYear();
  const md = ref.getMonth() - start.getMonth();
  if (md < 0 || (md === 0 && ref.getDate() < start.getDate())) years -= 1;
  return Math.max(0, years);
}

export function shippingFullYears(ref: Date = new Date()): number {
  return fullYearsSince(CAREER_SHIPPING_START, ref);
}

/** Integer used in “{n}+” marketing copy; at least 1. */
export function shippingYearsPlus(ref: Date = new Date()): number {
  return Math.max(1, shippingFullYears(ref));
}

/** e.g. "6+" */
export function shippingYearsLabel(ref: Date = new Date()): string {
  return `${shippingYearsPlus(ref)}+`;
}

/** e.g. "6+ years" (for sentences) */
export function shippingYearsProse(ref: Date = new Date()): string {
  return `${shippingYearsLabel(ref)} years`;
}

/** About-card: compact line, no start year */
export function shippingSinceCardLine(ref: Date = new Date()): string {
  return `${shippingYearsProse(ref)} of experience`;
}
