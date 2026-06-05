/**
 * Vision Flow design system reference.
 *
 * Brand direction: Vercel-inspired minimal — neutral zinc palette,
 * blue accent, restrained gradients and motion. Full light/dark support.
 *
 * Typography:
 * - UI/Body/Headings: Geist (fallback Inter)
 *
 * Semantic tokens (use these in components):
 * - bg-background, text-foreground
 * - bg-card, text-card-foreground
 * - bg-primary, text-primary-foreground (blue accent)
 * - bg-secondary, text-secondary-foreground
 * - bg-muted, text-muted-foreground
 * - border-border, ring-ring
 * - bg-sidebar, text-sidebar-foreground
 *
 * Gradients (CSS custom properties):
 * - var(--gradient-hero) — radial mesh for hero sections
 * - var(--gradient-border) — subtle linear for featured cards
 */

export const designSystem = {
  brand: {
    name: 'Vision Flow',
    tone: 'Video workflow AI',
  },
  fonts: {
    sans: 'Geist',
  },
  colors: {
    accent: {
      light: '#0070f3',
      dark: '#3291ff',
    },
    neutral: {
      light: '#fafafa',
      mid: '#71717a',
      dark: '#09090b',
    },
    destructive: '#ef4444',
  },
} as const
