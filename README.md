# Made by Kingsley

A dependency-free personal landing page for GitHub Pages. Plain HTML, CSS, and JavaScript; no build step, framework, external fonts, or runtime services.

## Preview

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. GitHub Pages can serve the repository root directly. `CNAME` retains `madebykingsley.com`.

## Editing

- `index.html`: copy, contact links, social metadata.
- `styles.css`: responsive layout, typography, and visual treatment.
- `script.js`: Canvas 2D light ribbons and pointer-driven portrait depth. Ribbon colors and movement live in the `ribbons` array.
- `assets/memoji.webp`: optimized transparent Memoji (900 × 900, approximately 105 KB).
- `assets/social-preview.jpg`: original supplied Vision Pro Memoji image, optimized for social sharing.
- `assets/favicon.png` and `assets/favicon.ico`: Memoji browser icons.
- `assets/apple-touch-icon.png`: 180px Memoji home-screen icon.

Motion uses one requestAnimationFrame loop and stops in hidden tabs. Reduced-motion preferences keep the scene still and respond to system preference changes. Touch input retains normal scrolling. With JavaScript disabled, content and links remain available against a static gradient.

## Typography

The headline uses the native SF variable font on Apple platforms with a 125% width axis and bold weight, inspired by WWDC title slides. Regular-width SF handles the greeting and interface text; `ui-monospace` / SF Mono handles the platform labels. Optical sizing is automatic. No Apple font files are bundled or fetched. Devices without SF use their system sans-serif and monospace fallbacks; expanded width depends on the available font and browser.

## Asset provenance

The Memoji cutout was prepared with the built-in image-generation tool from the supplied `Vision Pro Memoji.png`, then resized and encoded as WebP. The original supplied files, including the photographic avatar, were not modified. The light ribbons are drawn in code using the supplied `header.png` as their color and shape reference.

Final image-edit prompt:

> Use case: background-extraction. Edit target: supplied Vision Pro Memoji. Remove only the colorful background and produce a clean transparent-background cutout of this exact character for a website hero. Preserve identity, face, gaze, pose, long hair, beard, clothes, entire headset and its existing colored reflections exactly as closely as possible. Preserve current square framing and bottom crop; no new elements, no text, no shadow backdrop, no redesign. Actual alpha transparency outside the subject, with clean natural hair edges.

## Validation

Checked in local Chrome: responsive widths from 320 to 1440 CSS pixels, landscape and a viewport equivalent to 200% browser zoom, image loading, contact URLs, pointer tracking and reset, reduced-motion preference changes, simulated document visibility changes, touch scrolling, and the no-JavaScript fallback. No JavaScript console errors. Real iOS/Safari device behavior should be checked before broad release.

## Header signature

The 106px header badge pairs original SVG monoline lettering with an SF wordmark. The two centerline paths write “made” and “by” in sequence, hold for nine seconds, then fade and restart on a 14-second cycle. It shares the existing animation clock and pauses in hidden tabs. Reduced-motion preferences and the no-JavaScript fallback show the complete signature. The script is 70% of the badge width; the badge sits at the top left on desktop with left-aligned script, and both the badge and script are centered on mobile. Spacing above the wordmark is tightened. The greeting remains unchanged.
