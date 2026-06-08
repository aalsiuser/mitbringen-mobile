export const Colors = {
  bg:         '#ece8df',
  appBg:      '#faf8f3',
  card:       '#ffffff',
  ink:        '#23231f',
  ink2:       '#6f6d64',
  ink3:       '#a3a195',
  line:       '#ece7dc',
  line2:      '#e0dacc',
  green:      '#1f8a5b',
  greenDeep:  '#156b46',
  greenSoft:  '#e9f3ec',
  greenTint:  '#f1f7f2',
  amber:      '#e0a43a',
  amberSoft:  '#f7eed9',
  danger:     '#c0563f',
  store: {
    hofer: '#d8462a',
    lidl:  '#2a64b4',
    spar:  '#1f8a5b',
    billa: '#e0a43a',
  },
} as const

export const Shadows = {
  card: {
    shadowColor: '#23231f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  pop: {
    shadowColor: '#23231f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 8,
  },
  green: {
    shadowColor: '#1f8a5b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
} as const

// Keep default export so existing template imports don't break
export default Colors
