export type Theme = {
  accent: string;
  text: string;
  muted: string;
  shimmer: string;
  base: string;
  operational: string;
  partial: string;
  major: string;
};

export const darkTheme: Theme = {
  accent: '#c15f3c',
  text: '#FFFFFF',
  muted: '#666666',
  shimmer: '#dcdcdc',
  base: '#acacac',
  operational: 'green',
  partial: 'yellow',
  major: 'red',
};

export const lightTheme: Theme = {
  accent: '#c15f3c',
  text: '#000000',
  muted: '#404040',
  shimmer: '#000000',
  base: '#262626',
  operational: '#006400',
  partial: '#856404',
  major: '#b22222',
};

export async function detectTheme(): Promise<Theme> {
  const colorFGBG = process.env['COLORFGBG'];
  if (colorFGBG) {
    const bg = parseInt(colorFGBG.split(';')[1] || '');
    if (!isNaN(bg) && (bg <= 6 || bg === 8)) return darkTheme;
    return lightTheme;
  }
  if (!process.stdin.isTTY) return darkTheme;

  // Fallback to detection logic
  return new Promise(resolve => {
    process.stdin.setRawMode(true);
    process.stdout.write('\x1b]11;?\x1b\\');
    process.stdin.once('data', data => {
      process.stdin.setRawMode(false);
      const res = data ? data.toString() : '';
      const match = res.match(/rgb:([0-9a-f]+)\/([0-9a-f]+)\/([0-9a-f]+)/i);
      if (match) {
        const r = parseInt(match[1]!, 16) / 65535;
        const g = parseInt(match[2]!, 16) / 65535;
        const b = parseInt(match[3]!, 16) / 65535;
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        resolve(luminance > 0.5 ? lightTheme : darkTheme);
      } else {
        resolve(darkTheme);
      }
    });
  });
}
