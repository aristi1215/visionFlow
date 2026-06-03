/**
 * Cartage-inspired design system reference.
 *
 * Brand direction: elegant enterprise logistics — warm orange CTAs,
 * rich brown neutrals, deep black foundations. Full light/dark support.
 *
 * Typography:
 * - Display: Newsreader (headings, editorial feel)
 * - UI/Body: Inter (interface, data, forms)
 *
 * Semantic tokens (use these in components):
 * - bg-background, text-foreground
 * - bg-card, text-card-foreground
 * - bg-primary, text-primary-foreground (orange CTA)
 * - bg-secondary, text-secondary-foreground (brown neutral)
 * - bg-muted, text-muted-foreground
 * - border-border, ring-ring
 * - bg-sidebar, text-sidebar-foreground (dark nav)
 *
 * Raw palette:
 * - orange-50 … orange-900
 * - brown-50 … brown-900
 * - black, white
 */

export const designSystem = {
  brand: {
    name: 'Vision Flow',
    tone: 'Video workflow AI',
  },
  fonts: {
    display: 'Newsreader',
    sans: 'Inter',
  },
  colors: {
    orange: {
      primary: '#d95f2b',
      light: '#e8784a',
      dark: '#b84a1f',
    },
    brown: {
      light: '#f0ebe4',
      mid: '#5c4a3a',
      dark: '#1a1410',
    },
    black: '#0a0a0a',
    cream: '#faf8f5',
  },
} as const
