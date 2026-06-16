---
name: Warm Minimalism
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#47464c'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#78767d'
  outline-variant: '#c8c5cd'
  surface-tint: '#5d5c74'
  primary: '#00000b'
  on-primary: '#ffffff'
  primary-container: '#1a1a2e'
  on-primary-container: '#83829b'
  inverse-primary: '#c6c4df'
  secondary: '#745a34'
  on-secondary: '#ffffff'
  secondary-container: '#fedaab'
  on-secondary-container: '#785e38'
  tertiary: '#000100'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1b'
  on-tertiary-container: '#848482'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e0fc'
  primary-fixed-dim: '#c6c4df'
  on-primary-fixed: '#1a1a2e'
  on-primary-fixed-variant: '#45455b'
  secondary-fixed: '#ffddb1'
  secondary-fixed-dim: '#e3c193'
  on-secondary-fixed: '#291800'
  on-secondary-fixed-variant: '#5a431f'
  tertiary-fixed: '#e4e2df'
  tertiary-fixed-dim: '#c8c6c4'
  on-tertiary-fixed: '#1b1c1a'
  on-tertiary-fixed-variant: '#474745'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style
The design system is built on a "Warm Minimalism" aesthetic, balancing the high-end editorial feel of luxury beauty brands with the functional precision of modern technology. It targets a discerning audience looking for premium self-care experiences.

The visual direction blends **Minimalism** with **Modern Corporate** sensibilities. It prioritizes expansive white space, intentional use of high-contrast serif typography, and a "glossy" yet professional finish. The emotional goal is to evoke a sense of calm, confidence, and invitation—transforming the utility of booking an appointment into a ritual of self-care.

## Colors
The palette is rooted in a high-contrast foundation of Deep Navy and Warm Off-white. 

- **Primary (Deep Navy):** Used for core branding, primary actions, and heavy navigation elements to ground the UI.
- **Accent (Warm Gold):** Reserved for highlights, active states, and premium "member-only" features. It should be used sparingly to maintain its impact.
- **Surface & Card:** The background uses a soft off-white to reduce eye strain, while cards use pure white to "pop" and create distinct containers for salon imagery.
- **Text Hierarchy:** Deep Navy or Soft Black for readability; Muted Gray for secondary metadata and de-emphasized labels.

## Typography
The typography system uses a pairing of a high-contrast Serif for expression and a neutral Sans-Serif for utility.

- **Headlines:** Playfair Display provides an editorial, sophisticated feel. Use it for page titles, section headers, and promotional banners.
- **Body & Labels:** Inter is used for all functional text to ensure maximum legibility at small sizes. 
- **Scale:** A 14px base size ensures density without clutter. Letter spacing is slightly increased for uppercase labels to enhance the premium feel.

## Layout & Spacing
The layout follows a strict **8px grid system** to maintain mathematical harmony.

- **Philosophy:** A fixed-width approach for desktop centered containers, and a fluid-width approach for mobile.
- **Grid:** Use a 12-column grid for desktop and a 4-column grid for mobile.
- **Rhythm:** Vertical rhythm should be driven by the 8px increments. Use `16px` for internal card padding and `24px` for spacing between distinct content sections.
- **Safe Areas:** On mobile, maintain a minimum of 20px side margins to prevent content from feeling cramped against the screen edges.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Ambient Shadows**.

- **Surfaces:** Use the Warm Off-white (`#FAF8F5`) for the base canvas and pure White (`#FFFFFF`) for elevated elements like cards and modals.
- **Shadows:** Avoid harsh, dark shadows. Use a soft, diffused "Lift" for cards: `0 2px 16px rgba(0,0,0,0.06)`.
- **Modals:** Use a semi-transparent backdrop blur (10px) behind modals to maintain context while focusing the user's attention.
- **Interaction:** Buttons should subtly deepen in shadow or shift in opacity on hover to provide tactile feedback without breaking the minimalist aesthetic.

## Shapes
The shape language is "Soft-Modern," utilizing rounded corners to feel approachable yet structured.

- **Cards:** Use `12px` (rounded-lg) for salon listings and service containers.
- **Buttons:** Use `8px` (standard) for a crisp, professional look that isn't too "bubbly."
- **Modals & Sheets:** Use `24px` (rounded-xl) for top corners of bottom sheets and full-screen modals to emphasize a soft, premium feel.
- **Inputs:** Follow the button rounding of `8px`.

## Components
Consistent component styling reinforces the "Sephora meets Apple" vibe.

- **Buttons:** 
  - *Primary:* Deep Navy background, white text, 8px radius. 
  - *Secondary:* Warm Gold border, Warm Gold text, no fill.
- **Cards:** Pure white background, 12px radius, subtle lift shadow. Imagery should have a 1:1 or 4:3 aspect ratio with slightly rounded top corners.
- **Inputs:** 1px border in Muted Gray, 8px radius. On focus, the border shifts to Warm Gold or Deep Navy.
- **Chips/Tags:** Used for "Available Today" or "Top Rated." Use a light tint of the Accent color with 100px (pill) radius and 12px Inter bold text.
- **Navigation:** A clean bottom tab bar on mobile with thin icons and 10px labels. Active state indicated by a Deep Navy icon and a small dot indicator.
- **Booking Bar:** A persistent footer bar on salon detail pages that feels "docked," using a white background and a primary action button.