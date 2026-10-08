# Maeghen's Unicorns

A field guide to the animal that never was — and never went away.

An animated, interactive single-page site about the unicorn: its origins in history,
its many forms across cultures, the great tapestries, and its life in fiction.

**Live:** https://georges-sr.github.io/maeghens-unicorns/

## Run locally

No build step. Serve the folder with any static server:

```sh
python -m http.server 8000
# then open http://localhost:8000
```

## Structure

```
index.html          all content (works without JavaScript)
css/style.css       "midnight tapestry" design system
js/main.js          starfield & constellation, timeline, tapestry hotspots, gallery, quiz
assets/img/         public-domain artworks (WebP, ≤1400px)
.github/workflows/  GitHub Pages deployment on every push to main
PLAN.md             design & development plan
```

## Credits

All artworks are in the public domain or released under CC0, obtained via Wikimedia Commons.

| File | Work | Source |
|------|------|--------|
| `captivity.webp` | *The Unicorn in Captivity*, Unicorn Tapestries, 1495–1505 | The Metropolitan Museum of Art, Gift of John D. Rockefeller Jr., 1937 (CC0) |
| `found.webp` | *The Unicorn Purifies Water* (*The Unicorn is Found*), 1495–1505 | The Met (CC0) |
| `hunters.webp` | *The Hunters Enter the Woods*, 1495–1505 | The Met (CC0) |
| `desire.webp` | *À mon seul désir*, The Lady and the Unicorn, c. 1500 | Musée de Cluny, Paris (public domain) |
| `sight.webp` | *Sight*, The Lady and the Unicorn, c. 1500 | Musée de Cluny, Paris (public domain) |
| `raphael.webp` | Raphael, *Young Woman with Unicorn*, c. 1505–06 | Galleria Borghese, Rome (public domain) |
| `bestiary.webp` | Aberdeen Bestiary, f. 15r, c. 1200 | University of Aberdeen (public domain) |
| `indus-seal.webp` | Mold of an Indus Valley “unicorn” seal | Wikimedia Commons (CC0) |
| `giraffe.webp` | *Tribute Giraffe with Attendant*, after Shen Du, Ming dynasty | Philadelphia Museum of Art (public domain) |

Fonts: Cormorant Garamond and Inter, via Google Fonts (SIL Open Font License).
