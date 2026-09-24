# Noor — Portfolio Website

A complete static portfolio in warm cream, terracotta and charcoal. No build step, package installation, API keys or backend are required.

## Add to a GitHub repository

Extract the ZIP and upload its **contents** to the repository root. Keep `index.html`, `.nojekyll` and the `assets/` folder together. All asset URLs are relative, so the site works under a repository subpath as well as at a domain root.

This ZIP contains the source files, not a deployed website. To host it, configure your static hosting service to serve the repository root.

## Preview locally

From the folder containing `index.html`, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Edit the site

- `index.html`: page copy, navigation, hero workflow labels and project popup templates.
- `assets/noor-theme.css`: final colour theme, logo treatment, regular-weight workflow text and responsive overrides.
- `assets/workflow-animation.js`: the synchronized hero animation.
- `assets/process-animation.js`: the process section animation.
- `assets/work-sheets.js`: project popup and image zoom behavior.
- `assets/portfolio/`: full-resolution sample screenshots and thumbnails.
- `assets/logos/` and `assets/tool-logos/`: company and software logos.
- `assets/favicon.svg`: lowercase n browser-tab icon in the website colours.
- `assets/noor-header-logo.webp`: supplied Noor wordmark, recoloured for the theme by CSS.

The two contact buttons link to:
https://www.upwork.com/freelancers/~01ed14a1af49f7bd6f

The workflow keeps original brand-icon colours and uses editable regular-weight SVG text. VoicePatrol displays in black. The Smartlead logo in “Behind the lists” uses the same monochrome theme colour as HubSpot and the other tool logos.

Animations respect the browser's reduced-motion preference. The site includes the twelve existing project previews; the export preserves the full-resolution images.

The desktop hero uses the available viewport height for the navigation, introduction, workflow and company strip. On narrow screens these elements stack without clipping. The header wordmark is 104px on desktop and 90px on mobile.
