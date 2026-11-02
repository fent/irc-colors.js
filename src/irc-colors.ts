export type ForegroundColor =
  | 'white'
  | 'black'
  | 'navy'
  | 'green'
  | 'red'
  | 'brown'
  | 'maroon'
  | 'purple'
  | 'violet'
  | 'olive'
  | 'yellow'
  | 'lightgreen'
  | 'lime'
  | 'teal'
  | 'bluecyan'
  | 'cyan'
  | 'aqua'
  | 'blue'
  | 'royal'
  | 'pink'
  | 'lightpurple'
  | 'fuchsia'
  | 'gray'
  | 'grey'
  | 'lightgray'
  | 'lightgrey'
  | 'silver';

export type BackgroundColor = `bg${ForegroundColor}`;

export type StyleName =
  | 'normal'
  | 'underline'
  | 'bold'
  | 'italic'
  | 'inverse'
  | 'strikethrough'
  | 'monospace';

export type ExtraName = 'stripColors' | 'stripStyle' | 'stripColorsAndStyle';

export type Category = 'fg' | 'bg' | 'styles' | 'custom' | 'extras';

export type CategoryColorMap = {
  fg: ForegroundColor;
  bg: BackgroundColor;
  styles: StyleName;
  custom: 'rainbow';
  extras: ExtraName;
};

export type ChainedColorFunction<Remaining extends Category = Category> = ((
  str: string,
) => string) & {
  [C in Remaining as CategoryColorMap[C]]: ChainedColorFunction<
    Exclude<Remaining, C>
  >;
};

export type RainbowFunction = ((str: string, colorArr?: string[]) => string) & {
  [C in Exclude<
    Category,
    'custom'
  > as CategoryColorMap[C]]: ChainedColorFunction<
    Exclude<Category, 'custom' | C>
  >;
};

export type ColorFunction = ChainedColorFunction;

export type ChainedGlobalFunction<Remaining extends Category = Category> =
  (() => string) & {
    [C in Remaining as CategoryColorMap[C]]: ChainedGlobalFunction<
      Exclude<Remaining, C>
    >;
  };

export type GlobalColorFunction = ChainedGlobalFunction;

export type GlobalIrcColors = {
  [C in Category as CategoryColorMap[C]]: ChainedGlobalFunction<
    Exclude<Category, C>
  >;
};

export type IrcColors = {
  [C in Exclude<
    Category,
    'custom'
  > as CategoryColorMap[C]]: ChainedColorFunction<Exclude<Category, C>>;
} & {
  rainbow: RainbowFunction;
  global(): void;
};

declare global {
  interface String {
    irc: GlobalIrcColors;
  }
}

interface StylePosition {
  char: string;
  pos: number;
}

const colors: Record<string, ForegroundColor[]> = {
  '00': ['white'],
  '01': ['black'],
  '02': ['navy'],
  '03': ['green'],
  '04': ['red'],
  '05': ['brown', 'maroon'],
  '06': ['purple', 'violet'],
  '07': ['olive'],
  '08': ['yellow'],
  '09': ['lightgreen', 'lime'],
  '10': ['teal', 'bluecyan'],
  '11': ['cyan', 'aqua'],
  '12': ['blue', 'royal'],
  '13': ['pink', 'lightpurple', 'fuchsia'],
  '14': ['gray', 'grey'],
  '15': ['lightgray', 'lightgrey', 'silver'],
};

const styles: Record<StyleName, string> = {
  normal: '\x0F',
  underline: '\x1F',
  bold: '\x02',
  italic: '\x1D',
  inverse: '\x16',
  strikethrough: '\x1E',
  monospace: '\x11',
};

const styleNames = Object.keys(styles) as StyleName[];
const styleChars: Record<string, boolean> = {};
for (const key of styleNames) {
  styleChars[styles[key]] = true;
}

// Coloring character.
const colorChar = '\x03';
const zeroWidthBold = styles.bold + styles.bold;
const leadingCommaDigitPattern = /^,\d/;
const colorCodeStr = new RegExp(`^${colorChar}\\d\\d`);

const allColors: Record<Category, string[]> = {
  fg: [],
  bg: [],
  styles: styleNames,
  custom: [],
  extras: [],
};

const categoryKeys = Object.keys(allColors) as Category[];

const colorsModule = {} as IrcColors;

// Make color functions for both foreground and background.
for (const code of Object.keys(colors)) {
  // Foreground.
  // If the string begins with /,\d/,
  // it can undesirably apply a background color.
  const fg = ((str: string) =>
    colorChar +
    code +
    (leadingCommaDigitPattern.test(str) ? zeroWidthBold : '') +
    str +
    colorChar) as ColorFunction;

  // Background.
  const bg = ((str: string) => {
    // If the string begins with a foreground color already applied,
    // use it to save string space.
    if (colorCodeStr.test(str)) {
      const str2 = str.slice(3);
      return (
        str.slice(0, 3) +
        ',' +
        code +
        (str2.startsWith(zeroWidthBold)
          ? str2.slice(zeroWidthBold.length)
          : str2)
      );
    }
    return `${colorChar}01,${code}${str}${colorChar}`;
  }) as ColorFunction;

  for (const color of colors[code]) {
    const bgColor: BackgroundColor = `bg${color}`;
    allColors.fg.push(color);
    allColors.bg.push(bgColor);
    colorsModule[color] = fg;
    colorsModule[bgColor] = bg;
  }
}

// Style functions.
for (const style of styleNames) {
  const code = styles[style];
  colorsModule[style] = ((str: string) => code + str + code) as ColorFunction;
}

// Some custom helpers.
const defaultRainbowPalette: ForegroundColor[] = [
  'red',
  'olive',
  'yellow',
  'green',
  'blue',
  'navy',
  'violet',
];

const custom = {
  rainbow: ((str: string, colorArr?: string[]) => {
    const palette = (colorArr as ForegroundColor[]) || defaultRainbowPalette;
    const len = palette.length;
    let i = 0;

    return str
      .split('')
      .map((char) =>
        char !== ' '
          ? colorsModule[palette[i++ % len] as ForegroundColor](char)
          : char,
      )
      .join('');
  }) as RainbowFunction,
};

for (const extra of Object.keys(custom) as (keyof typeof custom)[]) {
  allColors.custom.push(extra);
  colorsModule[extra] = custom[extra];
}

// Extras.
const extras: Record<ExtraName, ColorFunction> = {
  stripColors: ((str: string) =>
    str.replace(/\x03\d{0,2}(,\d{0,2}|\x02\x02)?/g, '')) as ColorFunction,

  stripStyle: ((str: string) => {
    const delimiterStack: StylePosition[] = [];
    for (let i = 0, len = str.length; i < len; i++) {
      const char = str[i];
      if (styleChars[char] || char === colorChar) {
        const lastEntry = delimiterStack[delimiterStack.length - 1];
        if (lastEntry && lastEntry.char === char) {
          const startPos = lastEntry.pos;
          // Don't strip out styles with no characters inbetween.
          // And don't strip out color codes.
          if (i - startPos > 1 && char !== colorChar) {
            str =
              str.slice(0, startPos) +
              str.slice(startPos + 1, i) +
              str.slice(i + 1);
            i -= 2;
          }
          delimiterStack.pop();
        } else {
          delimiterStack.push({ char: str[i], pos: i });
        }
      }
    }

    // Remove any unmatching style characters.
    // Traverse list backwards to make removing less complicated.
    for (const entry of delimiterStack.reverse()) {
      if (entry.char !== colorChar) {
        str = str.slice(0, entry.pos) + str.slice(entry.pos + 1);
      }
    }
    return str;
  }) as ColorFunction,

  stripColorsAndStyle: ((str: string) =>
    extras.stripColors(extras.stripStyle(str))) as ColorFunction,
};

for (const extra of Object.keys(extras) as ExtraName[]) {
  allColors.extras.push(extra);
  colorsModule[extra] = extras[extra];
}

type ColorTransform = (s: string) => string;

// Adds all functions to each other so they can be chained.
const addGetters = (
  fn: ColorFunction | GlobalColorFunction,
  types: Category[],
) => {
  const target = fn as unknown as Record<string, unknown>;
  for (const type of categoryKeys) {
    if (types.includes(type)) {
      continue;
    }
    for (const color of allColors[type]) {
      if (target[color] != null) {
        continue;
      }
      const colorFn = colorsModule[
        color as keyof IrcColors
      ] as unknown as ColorTransform;
      Object.defineProperty(fn, color, {
        get: () => {
          const chainedFn = ((str: string) =>
            colorFn((fn as ColorFunction)(str))) as unknown as ColorFunction;
          addGetters(chainedFn, types.concat(type));
          return chainedFn;
        },
      });
    }
  }
};

for (const type of categoryKeys) {
  for (const color of allColors[type]) {
    addGetters(
      colorsModule[color as keyof IrcColors] as unknown as ColorFunction,
      [type],
    );
  }
}

// Adds functions to global String object.
colorsModule.global = () => {
  let currentStr = '';
  const irc = {} as GlobalIrcColors;

  Object.defineProperty(String.prototype, 'irc', {
    get(this: string) {
      currentStr = this;
      return irc;
    },
    configurable: true,
  });

  for (const type of categoryKeys) {
    for (const color of allColors[type]) {
      const colorFn = colorsModule[
        color as keyof IrcColors
      ] as unknown as ColorTransform;
      const fn = (() => colorFn(currentStr)) as unknown as GlobalColorFunction;
      addGetters(fn, [type]);
      (irc as unknown as Record<string, unknown>)[color] = fn;
    }
  }
};

export const {
  white,
  black,
  navy,
  green,
  red,
  brown,
  maroon,
  purple,
  violet,
  olive,
  yellow,
  lightgreen,
  lime,
  teal,
  bluecyan,
  cyan,
  aqua,
  blue,
  royal,
  pink,
  lightpurple,
  fuchsia,
  gray,
  grey,
  lightgray,
  lightgrey,
  silver,
  bgwhite,
  bgblack,
  bgnavy,
  bggreen,
  bgred,
  bgbrown,
  bgmaroon,
  bgpurple,
  bgviolet,
  bgolive,
  bgyellow,
  bglightgreen,
  bglime,
  bgteal,
  bgbluecyan,
  bgcyan,
  bgaqua,
  bgblue,
  bgroyal,
  bgpink,
  bglightpurple,
  bgfuchsia,
  bggray,
  bggrey,
  bglightgray,
  bglightgrey,
  bgsilver,
  normal,
  underline,
  bold,
  italic,
  inverse,
  strikethrough,
  monospace,
  rainbow,
  stripColors,
  stripStyle,
  stripColorsAndStyle,
  global,
} = colorsModule;

export default colorsModule;
