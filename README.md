# AWeSome Gebra

Bring a ruler, protractor, grid and graph paper to any web page. Draw, measure and plot right on top of it.

- Ruler you slide and rotate, protractor with a measuring arm
- Square, dots, isometric and polar grids, with numbered axes
- Pen that draws freely, or snaps to an instrument edge or a grid node
- Notes you can type in or write on by hand
- Function plotting, drawn true to the grid
- Stylus and touch: pressure, palm rejection, two finger gestures
- English, Arabic and Spanish

## Install

```bash
git clone https://github.com/HamzhStudios/AWeSome_Gebra.git
```

Or Code, Download ZIP, and extract. Then in Chrome:

1. Go to `chrome://extensions`
2. Turn on Developer mode
3. Load unpacked, and select the folder containing `manifest.json`
4. Click the icon on any page, or press `Alt+Shift+R`

Works in Chrome, Edge, Brave and Opera. Not on `chrome://` pages or the Web Store.

To update, pull or download again, then press reload on the extension card and refresh your tab.

## Using it

**Zoom** sets how many pixels a unit is worth, from 10 to 400 percent. The grid, the ruler, your drawing and any plotted function all follow it together.

**Snap** has three states. Free means nothing pulls the pen. Ruler pins it to the nearest instrument edge, including the protractor's baseline and arm. Grid puts every point on a node.

**Off** hides the grid, backdrop and ink so you can use the page normally. Your work comes back when you pick a drawing tool.

Each grid type keeps its own drawing, notes and undo history. Everything lives in memory for the life of the page, so a reload clears it. Settings are saved.

**Save PNG** exports the grid, ink and notes onto a solid background, into a folder inside your downloads directory that you can change in settings.

## Plotting

Switch Mode to **Gebra** in settings, then type an expression into Plot and press Enter.

```
x^2        2x + 1       sin(x)       3sin(2x)
1/x        sqrt(x)      ln(x)        e^(-x^2)
|x| + 1    x!           min(x,2)     cbrt(x)
```

- `y =` is optional. `2x`, `3(x+1)` and `2|x|` work as they do on paper
- Operators `+ - * / % ^` and a postfix `!`. `^` is right associative
- One argument: sin cos tan sec csc cot asin acos atan sinh cosh tanh asinh acosh atanh sqrt cbrt abs exp ln log10 log2 floor ceil round sign gamma
- Two or more: atan2, mod, pow, nroot, min, max, hypot, log(x, base)
- Constants: pi, e, tau, phi
- Radians by default. Settings has a degrees switch

Asymptotes break the curve instead of drawing through it, and points outside the domain are skipped. Only `y = f(x)` is supported, so circles and parametric curves are out.

Use `cbrt(x)` rather than `x^(1/3)` for cube roots, since a negative base with a fractional exponent has no real value.

## Shortcuts

| Key | Action |
| --- | --- |
| `Alt+Shift+R` | Show or hide |
| `Alt+D` | Drawing on or off |
| `Alt+S` | Cycle snap |
| `Alt+G` | Grid on or off |
| `Alt+B` | Backdrop |
| `Alt+R` | Ruler |
| `Alt+P` | Protractor |
| `Alt+Z` | Undo |
| `Alt+[` `Alt+]` | Rotate the ruler 1 degree |

## Ownership

Copyright 2026 Hamzh Studios. All rights reserved.

This repository is public so the extension can be read and installed. It is not open source and carries no licence. Beyond what GitHub's terms allow for a public repository, no permission is granted to copy, modify, redistribute or publish this code in whole or in part.

The name Hamzh Studios, the name AWeSome Gebra and the extension's icons are not covered by any grant and may not be reused.

## Contact

contact@hamzhstudios.com
