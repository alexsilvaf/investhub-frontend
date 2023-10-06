// color.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private defaultColors = [
    'rgb(208, 100, 100)',
    'rgb(94, 208, 144)',
    'rgb(90, 144, 208)',
    'rgb(238, 238, 90)',
    'rgb(235, 114, 74)',
    'rgb(204, 204, 204)'
  ];

  private hueStep = 35; // Adjust this value to change the hue step for harmonious colors

  constructor() { }

  getColorForIndex(index: number): string {
    if (index < this.defaultColors.length) {
      return this.defaultColors[index];
    } else {
      const baseColor = this.rgbToHsl(this.defaultColors[0]);
      const newHue = (baseColor.h + this.hueStep * (index - this.defaultColors.length + 1)) % 360;
      return this.hslToRgb({ h: newHue, s: baseColor.s, l: baseColor.l });
    }
  }

  private rgbToHsl(rgb: string): { h: number, s: number, l: number } {
    // Convert the RGB format string into R, G, B values
    const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
    const r = parseInt(result[1], 10) / 255;
    const g = parseInt(result[2], 10) / 255;
    const b = parseInt(result[3], 10) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private hslToRgb(hsl: { h: number, s: number, l: number }): string {
    let r, g, b;
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  }
}
