# SkillMatch Design System

## Overview
SkillMatch is a modern, professional skill-matching platform designed for professionals and job seekers. This design system establishes consistent patterns, components, and visual language across the platform.

---

## 🎨 Color Palette

### Primary Colors (Blue)
- **Primary 50**: `#f0f5ff` - Lightest background
- **Primary 500**: `#6366f1` - Main brand color
- **Primary 600**: `#4f46e5` - Interactive states
- **Primary 700**: `#4338ca` - Hover/pressed states
- **Primary 900**: `#312e81` - Dark text on light

### Accent Colors (Purple)
- **Accent 500**: `#8b5cf6` - Secondary brand color
- **Accent 600**: `#7c3aed` - Interactive states
- **Accent 700**: `#6d28d9` - Hover/pressed states

### Neutral Colors
- **White**: `#ffffff` - Default background
- **Gray 50**: `#f9fafb` - Secondary background
- **Gray 600**: `#4b5563` - Secondary text
- **Gray 900**: `#111827` - Primary text

---

## 📝 Typography

### Font Families
- **Display**: Cal Sans, Inter (headings, large text)
- **Body**: Inter (body text, UI labels)
- **Mono**: System monospace (code, data)

### Type Scale
| Size | Line Height | Usage |
|------|-------------|-------|
| 48px | 52px | Page titles (h1) |
| 36px | 40px | Section titles (h2) |
| 24px | 32px | Subsection titles (h3) |
| 20px | 28px | Feature titles |
| 18px | 28px | Large body text |
| 16px | 24px | **Body text (default)** |
| 14px | 20px | Small text, labels |
| 12px | 16px | Tiny text, hints |

### Font Weights
- **Bold (700)**: Headings, section titles
- **Semibold (600)**: Feature titles, callouts
- **Medium (500)**: Labels, interactive elements
- **Regular (400)**: Body text, descriptions

---

## 🎯 Spacing Scale

All spacing uses an 8px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Micro spacing (gaps, insets) |
| `sm` | 8px | Small padding, gaps |
| `md` | 12px | Standard padding |
| `lg` | 16px | Default padding, gaps |
| `xl` | 24px | Large padding, section spacing |
| `2xl` | 32px | Component separation |
| `3xl` | 48px | Section separation |
| `4xl` | 64px | Major section separation |

### Padding & Margin Rules
- **Components**: 8px-16px padding
- **Sections**: 16px-32px horizontal padding; 24px-64px vertical padding
- **Container**: Max-width 1280px with centered alignment

---

## 🔘 Button Styles

### Primary Button
```tsx
className="btn-primary"
// Gradient background, white text, hover elevation
// Used for main CTAs: "Get Started", "Start Matching Today"
```

### Secondary Button
```tsx
className="btn-secondary"
// Light background with primary color text
// Used for secondary actions: "Watch Demo"
```

### Outline Button
```tsx
className="btn-outline"
// Border-based button for tertiary actions
// Used for: "Sign In", "Learn More"
```

### Button States
- **Default**: Full opacity, hover shadow
- **Hover**: Shadow elevation, color shift (darker)
- **Active**: Scale down (95%)
- **Disabled**: 50% opacity, no interaction

---

## 📦 Component Library

### Header
- Sticky positioning (z-50)
- Logo + navigation menu
- Mobile hamburger at md breakpoint
- CTA buttons: Sign In + Get Started

### Hero Section
- Large heading with gradient text
- Subheading and two-button CTA
- Stats row (Users, Success Rate, Rating)
- Dashboard placeholder preview
- Animated decorative backgrounds

### Features Grid
- 6 features in 1/2/3 column layout by breakpoint
- Icon emoji, title, description per feature
- Hover: scale icon, border color change
- Icon animation on hover (scale-110)

### Testimonials
- 4 testimonials in 1/2 column layout
- Star rating display
- Author avatar emoji + name/role
- Hover shadow elevation

### CTA Section
- Gradient background (primary to accent)
- Large heading and subheading
- Two-button CTA
- Trust badge with company logos

### Footer
- Dark background (gray-900)
- 4-column link structure: Brand, Product, Company, Legal
- Bottom divider with copyright + social icons
- Responsive to single column on mobile

---

## 🎨 Effects & Animations

### Shadows
- **xs**: `0 1px 2px rgba(0,0,0,0.05)`
- **sm**: `0 1px 3px rgba(0,0,0,0.1)`
- **md**: `0 4px 6px rgba(0,0,0,0.1)` ← Default hover
- **lg**: `0 10px 15px rgba(0,0,0,0.1)` ← Elevated
- **elevation**: `0 16px 40px rgba(0,0,0,0.12)` ← Maximum

### Animations
| Name | Duration | Usage |
|------|----------|-------|
| `fade-in` | 300ms | Component entrance |
| `slide-up` | 400ms | Staggered stat entrance |
| `gradient-shift` | 8s infinite | Decorative gradient (future) |

### Motion Principles
- **Duration**: 150-300ms for micro-interactions, 400ms for transitions
- **Easing**: ease-in-out for natural feel
- **Stagger**: 0.1s between items in grids/lists
- **Active State**: scale-95 on press for tactile feedback

---

## 📱 Responsive Breakpoints

| Size | Width | Usage |
|------|-------|-------|
| **Mobile** | <640px | Single column, large touch targets |
| **Tablet** | 640-1024px | 2-3 column grids |
| **Desktop** | ≥1024px | 3+ column grids, full navigation |

### Mobile-First Approach
- Default: mobile styling
- `sm:` (640px+): tablet adjustments
- `md:` (768px+): desktop adjustments
- `lg:` (1024px+): large desktop adjustments

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Text Contrast**: ≥4.5:1 for body text, ≥3:1 for UI components
- **Focus States**: Visible focus rings on all interactive elements
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Alt Text**: Decorative emojis use sr-only labels or skip
- **Semantic HTML**: Proper heading hierarchy, form labels

### Touch Targets
- Minimum **44×44px** for interactive elements on mobile
- Minimum **8px spacing** between touch targets
- Extended hit areas on smaller icons via padding

### Accessibility Features
- Mobile menu toggle with aria-label
- Semantic button text ("Get Started" vs "Click Here")
- Color + text for all information (ratings, stats)
- Keyboard focus visible on navigation links

---

## 🎯 Best Practices

### Do's ✅
- Use design tokens (colors, spacing, typography)
- Maintain 8px baseline grid alignment
- Test on mobile (375px), tablet (768px), desktop (1440px)
- Use semantic HTML and ARIA labels
- Batch animations with stagger timing
- Respect prefers-reduced-motion for animations

### Don'ts ❌
- Don't hardcode hex values; use Tailwind classes
- Don't mix spacing increments (avoid 10px, 13px)
- Don't disable zoom or change viewport settings
- Don't use color alone to convey information
- Don't block user input during animations
- Don't forget alt text and labels on interactive elements

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Styling**: Tailwind CSS 4
- **Build**: Vite
- **Animations**: CSS animations + Tailwind utilities
- **Icons**: Emoji + SVG (future: Heroicons/Phosphor)

---

## 📋 Component Checklist

- [x] Header (sticky, responsive nav, CTA buttons)
- [x] Hero (large heading, CTA, stats, preview)
- [x] Features Grid (6 features, hover animations)
- [x] Testimonials (4 cards, star ratings, author info)
- [x] CTA Section (gradient background, two CTAs)
- [x] Footer (4-column, links, copyright)

---

## 🚀 Future Enhancements

- [ ] Replace emoji icons with Heroicons/Phosphor SVG set
- [ ] Add dark mode toggle with persistent preference
- [ ] Implement form validation and error states
- [ ] Create reusable component library (Button, Card, Input, etc.)
- [ ] Add interactive dashboard preview (replace emoji placeholder)
- [ ] Implement analytics tracking
- [ ] Add newsletter signup form
- [ ] Create multi-page routing structure
