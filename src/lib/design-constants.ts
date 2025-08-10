/**
 * Design System Constants
 * Centralized design tokens for consistent UI across the chat application
 */

export const DESIGN_TOKENS = {
  // Spacing
  spacing: {
    xs: 'gap-1', // 4px
    sm: 'gap-2', // 8px
    md: 'gap-3', // 12px
    lg: 'gap-4', // 16px
    xl: 'gap-6', // 24px
  },

  // Padding
  padding: {
    xs: 'p-1', // 4px
    sm: 'p-2', // 8px
    md: 'p-3', // 12px
    lg: 'p-4', // 16px
    xl: 'p-6', // 24px
  },

  // Icon sizes
  iconSize: {
    xs: 'h-3 w-3', // 12px
    sm: 'h-4 w-4', // 16px
    md: 'h-5 w-5', // 20px
    lg: 'h-6 w-6', // 24px
    xl: 'h-8 w-8', // 32px
  },

  // Button sizes
  buttonSize: {
    sm: 'h-7 w-7', // 28px
    md: 'h-8 w-8', // 32px
    lg: 'h-9 w-9', // 36px
  },

  // Border radius
  radius: {
    sm: 'rounded-md', // 6px
    md: 'rounded-lg', // 8px
    lg: 'rounded-xl', // 12px
    full: 'rounded-full',
  },

  // Typography
  text: {
    xs: 'text-xs', // 12px
    sm: 'text-sm', // 14px
    base: 'text-base', // 16px
    lg: 'text-lg', // 18px
    xl: 'text-xl', // 20px
  },

  // Transitions
  transition: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-200',
    slow: 'transition-all duration-300',
  },

  // Avatar sizes
  avatar: {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  },

  // Common hover states
  hover: {
    button: 'hover:bg-muted transition-colors',
    subtle: 'hover:bg-muted/60 transition-colors',
    scale: 'hover:scale-105 transition-transform',
  },
} as const;

// Component-specific design patterns
export const COMPONENT_STYLES = {
  // Action buttons (like in chat items, message actions)
  actionButton: `${DESIGN_TOKENS.buttonSize.sm} p-0 ${DESIGN_TOKENS.radius.full} ${DESIGN_TOKENS.hover.button}`,

  // Icon buttons in headers/navbars
  iconButton: `${DESIGN_TOKENS.buttonSize.sm} p-0 ${DESIGN_TOKENS.hover.button}`,

  // Chat message containers
  messageContainer: `${DESIGN_TOKENS.padding.lg} ${DESIGN_TOKENS.spacing.lg}`,

  // Sidebar menu items
  sidebarMenuItem: `${DESIGN_TOKENS.padding.md} ${DESIGN_TOKENS.radius.md} ${DESIGN_TOKENS.hover.subtle}`,

  // Avatar standard
  avatarStandard: `${DESIGN_TOKENS.avatar.md} ${DESIGN_TOKENS.radius.full}`,

  // Standard icons
  iconStandard: DESIGN_TOKENS.iconSize.sm,

  // Text content
  textContent: `${DESIGN_TOKENS.text.sm} leading-relaxed`,

  // Muted text
  textMuted: `${DESIGN_TOKENS.text.xs} text-muted-foreground`,
} as const;

// Utility functions for consistent styling
export const createButtonClass = (
  size: keyof typeof DESIGN_TOKENS.buttonSize = 'sm',
  variant: 'default' | 'ghost' = 'ghost'
) => {
  const baseClass = `${DESIGN_TOKENS.buttonSize[size]} p-0 ${DESIGN_TOKENS.radius.full} ${DESIGN_TOKENS.transition.normal}`;

  if (variant === 'ghost') {
    return `${baseClass} ${DESIGN_TOKENS.hover.button}`;
  }

  return baseClass;
};

export const createIconClass = (
  size: keyof typeof DESIGN_TOKENS.iconSize = 'sm'
) => {
  return DESIGN_TOKENS.iconSize[size];
};
