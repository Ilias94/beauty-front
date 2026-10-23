/**
 * Visual identity for a course category when the course has no photo:
 * a calm tint and a Material Symbol, instead of a random gradient.
 * Keys are the backend category labels.
 */
export interface CategoryVisual {
  icon: string;
  tint: string;
  ink: string;
}

const VISUALS: Record<string, CategoryVisual> = {
  'Makeup Artist':           { icon: 'brush',          tint: '#F3E4E2', ink: '#9B4F4A' },
  'Permanent Makeup Artist': { icon: 'stylus',         tint: '#F1E2E8', ink: '#8C2F4B' },
  'Nail Technician':         { icon: 'back_hand',      tint: '#F4E9DF', ink: '#9A6436' },
  'Lash Technician':         { icon: 'visibility',     tint: '#E9E5EF', ink: '#5E4D7A' },
  'Hairdresser':             { icon: 'content_cut',    tint: '#E6ECEF', ink: '#3F5F70' },
  'Hair Colorist':           { icon: 'palette',        tint: '#F2E8DA', ink: '#8B6326' },
  'Barber':                  { icon: 'content_cut',    tint: '#E4E7E2', ink: '#4D5D47' },
  'Esthetician':             { icon: 'spa',            tint: '#E5EEE7', ink: '#3E7B57' },
  'Skin Care Specialist':    { icon: 'water_drop',     tint: '#E4EDEE', ink: '#3A6B70' },
  'Massage Therapist':       { icon: 'self_improvement', tint: '#EEE8E1', ink: '#6E5A45' },
  'Wax Specialist':          { icon: 'auto_awesome',   tint: '#F5EADF', ink: '#8F5B2E' },
};

const FALLBACK: CategoryVisual = { icon: 'auto_awesome', tint: '#F4EEE7', ink: '#5E554E' };

export function categoryVisual(label?: string | null): CategoryVisual {
  return (label && VISUALS[label]) || FALLBACK;
}

/** Transloco key for a backend category label, e.g. "Makeup Artist" -> "categories.makeup_artist". */
export function categoryKey(label?: string | null): string {
  return 'categories.' + (label ?? '').toLowerCase().replace(/\s+/g, '_');
}
