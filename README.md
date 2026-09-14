# Pixel Perfect Rebuild

I have an existing website built in HTML, CSS, and JavaScript hosted on GitHub.
Repository: [https://github.com/salahjuniordev/salahjuniordev.git]

Your mission is to fully rebuild this website using a modern tech stack while
preserving 100% of the original design, layout, typography, color system,
animations, and text content.

---

## TECH STACK TO USE
- Framework: React + Vite
- Styling: Tailwind CSS
- UI Components: shadcn/ui where appropriate
- Routing: React Router DOM
- Backend / Database: Supabase (for any dynamic content, forms, or auth)
- Deployment target: Vercel

---

## WHAT TO PRESERVE EXACTLY
1. Visual design — colors, gradients, shadows, border radius, spacing, font
   sizes, font weights. Match pixel-for-pixel.
2. Typography — use the exact same fonts (check the HTML <head> for Google
   Fonts or @import in CSS and replicate them).
3. Layout — every section, grid, flexbox structure, card layout, hero,
   navbar, footer must be reproduced identically.
4. Text content — copy every heading, paragraph, label, button text, nav
   item, footer link, and CTA exactly as written. Do not rewrite or summarize.
5. Animations & transitions — replicate all hover effects, scroll animations,
   fade-ins, and interactive states.
6. Responsiveness — the site must be fully responsive across mobile, tablet,
   and desktop, matching the original breakpoints.

---

## IMAGES & VIDEOS — PLACEHOLDER STRATEGY
- Do NOT use any placeholder services (no picsum, no lorempixel).
- For every image, create a styled placeholder 

 with:
    - The exact same dimensions as the original image container
    - Background color: #e2e8f0 (light gray)
    - A centered label like: [IMAGE: hero-banner] or [IMAGE: product-card-1]
    - The label text should match the original filename or alt text from the HTML
- For every video, create a placeholder 

 with:
    - Same dimensions as the original video container
    - Background: #1e293b (dark)
    - Centered label: [VIDEO: section-name]
    - A play icon (▶) centered inside
- Use consistent naming so I can swap real assets later in one pass.

---

## COMPONENT ARCHITECTURE
- Break the UI into clean, reusable React components per section
  (e.g. , , , , 

)
- Each component in its own file under /src/components/
- Pages go in /src/pages/
- Keep all color tokens and font definitions in a central
  tailwind.config.js theme extension — do not hardcode values inline

---

## WHAT TO IGNORE / SKIP
- Do not rebuild any backend logic from the original JS (form handlers,
  analytics scripts, old jQuery plugins) — we will rewrite these cleanly
  in React with Supabase
- Do not install unnecessary dependencies — keep the bundle lean
- Do not change any wording, correct grammar, or "improve" the copy —
  preserve the original text exactly, even if it seems informal

---

## DELIVERABLE CHECKLIST
Before considering the build complete, verify:
[ ] All sections from the original site are present
[ ] Colors match (check with browser devtools against the original)
[ ] Fonts load correctly
[ ] All original text is present word-for-word
[ ] All image/video slots have properly labeled placeholders
[ ] Site is responsive on mobile (375px) and desktop (1440px)
[ ] No console errors
[ ] Supabase client is initialized and ready for future integration
[ ] React Router is set up for multi-page navigation (if site has multiple pages)

---

Start by reading the full repository structure, then identify all HTML pages,
the CSS files (especially custom properties / variables), and the JS files.
Map the sections before writing any code. Begin with the global layout
(Navbar + Footer), then build page by page.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/417687a7-78d2-408e-b2a8-615b6df1ffc9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
