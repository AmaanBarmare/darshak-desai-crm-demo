---
name: Darshak Desai CRM
colors:
  surface: '#f9f9fe'
  surface-dim: '#dad9de'
  surface-bright: '#f9f9fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f8'
  surface-container: '#eeedf2'
  surface-container-high: '#e8e8ed'
  surface-container-highest: '#e2e2e7'
  on-surface: '#1a1c1f'
  on-surface-variant: '#43474f'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f1f0f5'
  outline: '#737780'
  outline-variant: '#c3c6d1'
  surface-tint: '#3a5f94'
  primary: '#001e40'
  on-primary: '#ffffff'
  primary-container: '#003366'
  on-primary-container: '#799dd6'
  inverse-primary: '#a7c8ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#381300'
  on-tertiary: '#ffffff'
  tertiary-container: '#592300'
  on-tertiary-container: '#d8885c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a7c8ff'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#1f477b'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb690'
  on-tertiary-fixed: '#341100'
  on-tertiary-fixed-variant: '#723610'
  background: '#f9f9fe'
  on-background: '#1a1c1f'
  surface-variant: '#e2e2e7'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Manrope
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding: 16px
  card-gap: 12px
  section-margin: 24px
  touch-target: 48px
---

## Brand & Style

The design system is engineered to project **Institutional Trust** through a **Modern Minimalist** lens. Designed primarily for a mobile-first PWA, it balances the gravity of financial advisory services in the Indian market with the frictionless experience of a high-end fintech application.

The aesthetic emphasizes clarity and precision. By utilizing generous whitespace and a card-based architecture, the interface reduces cognitive load, allowing clients to focus on their portfolios. The style avoids unnecessary decoration, relying instead on high-quality typography, subtle depth, and a disciplined color application to evoke a sense of "Premium Reliability."

## Colors

The palette is anchored by **Deep Navy (#003366)**, a color synonymous with stability and professional authority in the financial sector. 

- **Primary:** Used for key actions, navigation headers, and primary branding elements.
- **Surfaces:** A clean white base is supplemented by **Slate Gray (#F8FAFC)** to define card backgrounds and separate content sections without using heavy lines.
- **Categorization:** Product tags (LIC, GIC, MF, Forex) use distinct, saturated hues to ensure quick visual scanning on mobile screens.
- **Prestige Badges:** Champion and Prime statuses use metallic-inspired tones (Gold and Silver) to denote tier hierarchy and client value.

## Typography

This design system utilizes **Manrope**, a modern geometric sans-serif that excels in legibility and professional tone. 

The hierarchy is structured for mobile consumption:
- **Headlines** use semi-bold and bold weights to provide clear entry points into content blocks.
- **Body text** maintains a generous line height (1.5x) to ensure financial data and terms are easy to read on small screens.
- **Labels** are used for data descriptors and product tags, occasionally utilizing uppercase styling with increased letter spacing for distinction at small sizes.

## Layout & Spacing

The design system follows a **4-column fluid grid** for mobile, transitioning to a centered **fixed-width container** for tablet and desktop views to maintain focus.

- **Spacing Rhythm:** An 8px linear scale drives all padding and margins, ensuring a consistent visual beat.
- **Safe Areas:** A minimum 16px horizontal margin is maintained on all mobile screens.
- **Horizontal Scrollers:** Used for product categories or featured insights to maximize vertical screen real estate. These should always show a "peek" of the next item to signify scrollability.
- **Interactive Zones:** All clickable elements (chips, nav items, buttons) must maintain a minimum 48px touch target to ensure the PWA feels like a native application.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layering** rather than heavy borders.

- **Level 0 (Background):** The base layer uses `#F8FAFC`.
- **Level 1 (Cards):** Primary content containers are pure white (`#FFFFFF`) with a very soft, diffused shadow (`Y: 4px, Blur: 12px, Opacity: 4% Black`).
- **Level 2 (Floating Action Button):** The FAB and active modals use a more pronounced shadow (`Y: 8px, Blur: 20px, Opacity: 8% Primary Color`) to pull the element significantly forward.
- **Transitions:** Elements should lift slightly (increase shadow depth) on interaction to provide tactile feedback in the PWA environment.

## Shapes

The shape language is defined by **Soft Geometric Curves**. 

- **Standard Elements:** Buttons, input fields, and standard cards utilize a 0.5rem (8px) radius.
- **Large Containers:** Bottom sheets and prominent dashboard cards use a 1rem (16px) radius to feel more approachable.
- **Pills & Tags:** Product tags and filter chips are fully rounded (pill-shaped) to distinguish them from interactive buttons and structural cards.

## Components

### Cards
Cards are the primary unit of information. They feature a white background, 8px corner radius, and 12px internal padding. Lists of cards should be separated by an 8px gap.

### Floating Action Button (FAB)
The FAB is the primary entry point for "Add New Lead" or "Quick Calculation." It must be a circle, 56px in diameter, using the Primary Deep Navy color with a white icon.

### Bottom Navigation
A fixed navigation bar with 4-5 icons. Active states are indicated by the Primary color and a subtle 2pt top-border or icon fill.

### Tags & Badges
- **Product Pills:** Small (10px label), bold text on a light tinted background of the product color (e.g., LIC tag has a light blue background with dark blue text).
- **Status Badges:** Positioned in the top-right corner of cards to indicate client "Champion" or "Prime" status.

### Input Fields
Outlined style with a 1px border in Slate-200. On focus, the border thickens to 2px and changes to the Primary Deep Navy.

### Filter Chips
Small, horizontally scrolling pill-shaped buttons. Unselected chips have a light gray background; selected chips use the Primary Navy with white text.