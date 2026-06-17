export const Colors = {
  // App backgrounds
  bg:          '#e9edf4',
  surface:     '#ffffff',
  inset:       '#f4f6fa',

  // Text
  ink:         '#0d1220',
  ink2:        '#586172',
  ink3:        '#9aa3b2',

  // Dividers
  line:        '#eef1f6',
  line2:       '#e3e8ef',

  // Blue brand accent
  blue:        '#2461ff',
  blueDeep:    '#1748d8',
  blueSoft:    '#eaf0ff',

  // Green — savings/money only
  green:       '#12a150',
  greenSoft:   '#e6f5ec',
  greenTint:   '#f1f9f4',

  // Coral — scan/bill accent
  coral:       '#ff6a4d',
  coralSoft:   '#fff0ec',

  // Violet — goal accent
  violet:      '#7b61ff',
  violetSoft:  '#f1ecff',

  // Amber — warnings / Billa brand
  amber:       '#f5a623',
  amberSoft:   '#fef3c7',

  // Legacy aliases for components that still reference these
  appBg:       '#e9edf4',
  card:        '#ffffff',
  danger:      '#c0563f',

  // Store brand colors
  store: {
    hofer:      '#e2342b',
    lidl:       '#2660c9',
    spar:       '#1f8a4d',
    billa:      '#e0a01e',
    billa_plus: '#e0a01e',
  },
} as const

export const Shadows = {
  card: {
    shadowColor: '#0d1220',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  cardMd: {
    shadowColor: '#0d1220',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  pop: {
    shadowColor: '#0d1220',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 10,
  },
  blue: {
    shadowColor: '#2461ff',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  green: {
    shadowColor: '#12a150',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
} as const

export default Colors
