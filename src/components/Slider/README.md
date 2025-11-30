# Slider Component — Usage Guide

This document explains how to reuse the Slider component at `src/components/Slider/Slider.jsx` across the project.

**Purpose**
- The `Slider` is a UI-only, reusable wrapper that groups its children into carousel slides.
- It is i18n-aware (RTL/LTR) and uses `react-bootstrap`'s `Carousel` internally.

**Location**
- Component: `src/components/Slider/Slider.jsx`
- Styles: `src/components/Slider/Slider.module.css`

**Import**
Use a relative import appropriate for your file location. Example from root-aware paths:

```jsx
import Slider from 'src/components/Slider/Slider';
// or a relative path from your file, e.g.:
// import Slider from '../../components/Slider/Slider';
```

**Basic Usage**
- Wrap the card components (or any nodes) you want inside the `Slider`.
- The `perSlide` prop controls how many children are shown per carousel slide. Default: `2`.

```jsx
<Slider perSlide={2}>
  <ReviewCard {...propsForCard1} />
  <ReviewCard {...propsForCard2} />
  <ReviewCard {...propsForCard3} />
  <ReviewCard {...propsForCard4} />
</Slider>
```

The `Slider` will group children into slides: every `perSlide` children form one slide.

**Props**
- `children` (React nodes): the card components or elements you want to display.
- `perSlide` (number, optional): number of children per slide (default `2`).

**perSlide and responsive columns**
- The `Slider` computes Bootstrap column classes for each child based on `perSlide` so slides are responsive.
- It uses `col-12` for extra-small screens and `col-md-${Math.floor(12/perSlide)}` for medium+.
- Examples:
  - `perSlide={1}` → children render inside `col-12 col-md-12` (full-width on desktop)
  - `perSlide={2}` → children render inside `col-12 col-md-6`
  - `perSlide={3}` → children render inside `col-12 col-md-4`
- If you need different breakpoints or custom column sizes, edit `src/components/Slider/Slider.jsx` where the `colClass` is computed.

**RTL / i18n**
- The slider reads writing direction from `react-i18next` (`i18n.dir()`): no extra config required.
- Icons and `dir` attribute are set automatically to match RTL or LTR.

**Styling & Customization**
- Base styles are in `src/components/Slider/Slider.module.css`.
- To change button colors or sizes, edit the module CSS classes (`.blueBtn`, `.grayBtn`, `.arrowBtn`, etc.).
- If you need to make the component accept custom class names, you can extend the component to accept a `className` prop and forward it to the container.

**Migrating from the old API**
If you previously used a pattern like this (old API that accepted `reviews` + `renderReview`):

```jsx
// old pattern (example)
<Slider reviews={groupedReviews} renderReview={renderReview} />
```

Convert it to the wrapper pattern by building the card elements first and passing them as children:

```jsx
const cards = groupedReviews.flat().map((r, i) => (
  <ReviewCard key={i} {...r} />
));

return (
  <Slider perSlide={2}>
    {cards}
  </Slider>
);
```

(See `src/features/reviews/components/Reviews.jsx` for a concrete example in this repo.)

**Accessibility**
- Navigation buttons have `aria-label`s and are disabled appropriately when there is no previous/next slide.
- If you need keyboard navigation or ARIA region roles, extend the component with those as needed.

**Troubleshooting**
- If slides appear full width, check your layout containers. The slider uses bootstrap grid classes internally; you can change the column classes inside `Slider.jsx` if you want different sizing (e.g., `col-md-4`).
- If RTL icon direction looks wrong, ensure `react-i18next` is configured and `i18n.dir()` returns `'rtl'` for the active locale.

**Run / Preview**
Open a PowerShell in the project root and run:

```powershell
npm run dev
# open the local dev URL shown by Vite
```

To run linter checks:

```powershell
npm run lint
```

**Next steps / Extensions**
- Add an optional `className` and `style` props to `Slider` to allow consumers to control layout without modifying module CSS.
- Add props for navigation placement, autoplay, or transition timing if needed.

---

If you want, I can:
- Add `className` and `style` props to `Slider` and update the README with examples.
- Update other component usages to the wrapper pattern across the codebase.

File created: `src/components/Slider/README.md`
