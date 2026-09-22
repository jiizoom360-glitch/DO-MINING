/**
 * DO-Mining Design Tokens
 * Source de vérité unique de l'identité visuelle de DO-Mining.
 * Strictly provider-agnostic.
 */

export const TOKENS = {
  colors: {
    primary: '#08AFC1',
    primaryDeep: '#075A70',
    primarySoft: '#DDF8FA',
    accent: '#F4C542',
    white: '#FFFFFF',
    ink: '#12242B',
    muted: '#667A82',
    surface: '#F5FAFB',
    border: '#DCE7EA',
  },
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  radii: {
    xs: '0.25rem',  // 4px
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    full: '9999px',
  },
  shadows: {
    subtle: '0 1px 2px 0 rgba(18, 36, 43, 0.05)',
    card: '0 1px 3px 0 rgba(18, 36, 43, 0.06), 0 1px 2px -1px rgba(18, 36, 43, 0.06)',
    elevated: '0 4px 6px -1px rgba(18, 36, 43, 0.07), 0 2px 4px -2px rgba(18, 36, 43, 0.05)',
  },
  transitions: {
    default: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type TokenColorKey = keyof typeof TOKENS.colors;
