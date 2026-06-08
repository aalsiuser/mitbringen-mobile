/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg:          '#ece8df',
        'app-bg':    '#faf8f3',
        card:        '#ffffff',
        ink:         '#23231f',
        'ink-2':     '#6f6d64',
        'ink-3':     '#a3a195',
        line:        '#ece7dc',
        'line-2':    '#e0dacc',
        green:       '#1f8a5b',
        'green-deep':'#156b46',
        'green-soft':'#e9f3ec',
        'green-tint':'#f1f7f2',
        amber:       '#e0a43a',
        'amber-soft':'#f7eed9',
        danger:      '#c0563f',
        // store brand colours
        'hofer':     '#d8462a',
        'lidl':      '#2a64b4',
        'spar':      '#1f8a5b',
        'billa':     '#e0a43a',
      },
      fontFamily: {
        sans:    ['HankenGrotesk_400Regular'],
        medium:  ['HankenGrotesk_500Medium'],
        semibold:['HankenGrotesk_600SemiBold'],
        bold:    ['HankenGrotesk_700Bold'],
        display: ['SpaceGrotesk_600SemiBold'],
      },
      borderRadius: {
        app:  40,
        card: 22,
        sm:   14,
        btn:  16,
        input:14,
      },
    },
  },
  plugins: [],
}
