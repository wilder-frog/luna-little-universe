// ---------------------------------------------------------------------------
//  A tiny pixel-art toolkit.
//
//  Everything in the game is drawn by plotting exact pixels into an ImageData
//  buffer — no canvas arcs, no antialiasing, no blurry edges. Textures are
//  authored at their true pixel size (16x16 tiles, 16x16 sprite frames, small
//  props) and Phaser scales them up with nearest-neighbour filtering.
// ---------------------------------------------------------------------------

export const PALETTE = {
  transparent: null,
  milk: "#FFE7F0",
  powder: "#F8BBD0",
  rose: "#EA84AC",
  deepRose: "#C85E8A",
  mauve: "#B76E98",
  lavender: "#D7C4F2",
  deepLavender: "#9F86C8",
  cream: "#FFF9F6",
  plum: "#443452",
  night: "#37304F",
  nightDeep: "#2A2440",
  white: "#FFFFFF",
  ink: "#56394A",
  outline: "#8A5A74",
  outlineDark: "#5E3B52",
  leaf: "#8FBF8F",
  leafDark: "#6B9E6E",
  gold: "#F2C879",
  goldDark: "#D1A253",
  water: "#8FB7E8",
  waterDeep: "#6E8FC9",
  glow: "#FFF3C4",
  blush: "#F8BBD0",
  grey: "#B9AEC4",
  greyDark: "#8C8299"
};

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * A fixed-size pixel buffer you plot into, then hand to Phaser as a texture.
 */
export class PixelCanvas {
  constructor(width, height) {
    this.w = width;
    this.h = height;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.ctx.imageSmoothingEnabled = false;
    this.data = this.ctx.createImageData(width, height);
  }

  px(x, y, color, alpha = 255) {
    if (!color) return this;
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return this;
    const [r, g, b] = hexToRgb(color);
    const i = (y * this.w + x) * 4;
    const d = this.data.data;
    if (alpha >= 255) {
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = 255;
      return this;
    }
    // Simple source-over blend so we can do soft glows and water sheen.
    const a = alpha / 255;
    const ba = d[i + 3] / 255;
    const outA = a + ba * (1 - a);
    if (outA <= 0) return this;
    d[i] = (r * a + d[i] * ba * (1 - a)) / outA;
    d[i + 1] = (g * a + d[i + 1] * ba * (1 - a)) / outA;
    d[i + 2] = (b * a + d[i + 2] * ba * (1 - a)) / outA;
    d[i + 3] = outA * 255;
    return this;
  }

  rect(x, y, w, h, color, alpha) {
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) this.px(x + i, y + j, color, alpha);
    }
    return this;
  }

  frame(x, y, w, h, color, alpha) {
    this.hline(x, y, w, color, alpha);
    this.hline(x, y + h - 1, w, color, alpha);
    this.vline(x, y, h, color, alpha);
    this.vline(x + w - 1, y, h, color, alpha);
    return this;
  }

  hline(x, y, len, color, alpha) {
    for (let i = 0; i < len; i++) this.px(x + i, y, color, alpha);
    return this;
  }

  vline(x, y, len, color, alpha) {
    for (let i = 0; i < len; i++) this.px(x, y + i, color, alpha);
    return this;
  }

  /** Bresenham line — used for paths, bows, constellation strokes. */
  line(x0, y0, x1, y1, color, alpha) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    for (;;) {
      this.px(x0, y0, color, alpha);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
    return this;
  }

  /** Midpoint circle, filled. Crisp edges, no AA. */
  disc(cx, cy, r, color, alpha) {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        if (x * x + y * y <= r * r + r * 0.4) this.px(cx + x, cy + y, color, alpha);
      }
    }
    return this;
  }

  ring(cx, cy, r, color, alpha) {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        const d = x * x + y * y;
        if (d <= r * r + r * 0.4 && d >= (r - 1) * (r - 1)) {
          this.px(cx + x, cy + y, color, alpha);
        }
      }
    }
    return this;
  }

  /** Filled ellipse — rounded roofs, pool basins, cat heads. */
  ellipse(cx, cy, rx, ry, color, alpha) {
    for (let y = -ry; y <= ry; y++) {
      for (let x = -rx; x <= rx; x++) {
        if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1.08) {
          this.px(cx + x, cy + y, color, alpha);
        }
      }
    }
    return this;
  }

  /** A little pixel heart, width 7 at scale 1. */
  heart(cx, cy, scale, color, alpha) {
    const rows = [
      "0110110",
      "1111111",
      "1111111",
      "0111110",
      "0011100",
      "0001000"
    ];
    rows.forEach((row, j) => {
      [...row].forEach((ch, i) => {
        if (ch === "1") {
          for (let sy = 0; sy < scale; sy++) {
            for (let sx = 0; sx < scale; sx++) {
              this.px(
                cx - Math.floor((7 * scale) / 2) + i * scale + sx,
                cy + j * scale + sy,
                color,
                alpha
              );
            }
          }
        }
      });
    });
    return this;
  }

  /** A four-point sparkle star. */
  sparkle(cx, cy, r, color, alpha) {
    this.px(cx, cy, color, alpha);
    for (let i = 1; i <= r; i++) {
      const a = alpha === undefined ? 255 : alpha;
      const fade = Math.round(a * (1 - (i - 1) / (r + 1)));
      this.px(cx + i, cy, color, fade);
      this.px(cx - i, cy, color, fade);
      this.px(cx, cy + i, color, fade);
      this.px(cx, cy - i, color, fade);
    }
    return this;
  }

  /** A five-point-ish star blob for the sky and HUD. */
  star(cx, cy, color, alpha) {
    const rows = ["00100", "01110", "11111", "01110", "00100"];
    rows.forEach((row, j) => {
      [...row].forEach((ch, i) => {
        if (ch === "1") this.px(cx - 2 + i, cy - 2 + j, color, alpha);
      });
    });
    return this;
  }

  /** Deterministic speckle, so ground texture is stable between reloads. */
  speckle(seed, count, color, alpha) {
    let s = seed;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    for (let i = 0; i < count; i++) {
      this.px(
        Math.floor(rnd() * this.w),
        Math.floor(rnd() * this.h),
        color,
        alpha
      );
    }
    return this;
  }

  /**
   * Draw a string-matrix sprite. `rows` is an array of equal-length strings,
   * `map` turns each character into a palette colour. "." / " " = transparent.
   */
  matrix(rows, map, ox = 0, oy = 0) {
    rows.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch === "." || ch === " ") return;
        const color = map[ch];
        if (color) this.px(ox + x, oy + y, color);
      });
    });
    return this;
  }

  /** Commit the buffer and register it with Phaser under `key`. */
  commit(scene, key) {
    this.ctx.putImageData(this.data, 0, 0);
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addCanvas(key, this.canvas);
    return key;
  }

  /** Commit as a spritesheet of frameW x frameH cells. */
  commitSheet(scene, key, frameW, frameH) {
    this.ctx.putImageData(this.data, 0, 0);
    if (scene.textures.exists(key)) scene.textures.remove(key);
    scene.textures.addSpriteSheet(key, this.canvas, {
      frameWidth: frameW,
      frameHeight: frameH
    });
    return key;
  }

  /** Data URL, for drawing the same art inside DOM overlays. */
  toDataURL() {
    this.ctx.putImageData(this.data, 0, 0);
    return this.canvas.toDataURL();
  }
}

export function pc(w, h) {
  return new PixelCanvas(w, h);
}
