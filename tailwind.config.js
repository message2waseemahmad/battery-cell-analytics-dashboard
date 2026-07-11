/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        primary:          '#000000',
        secondary:        '#36444B',
        tertiary:         '#626262',
        quaternary:       '#FFFFFF',
        'quaternary-2':   '#E9E9E9',
        'quaternary-3':   '#F8F8F8',
        quinary:          '#F5F5F5',

        // Purple brand
        unique:           '#A96FF0',
        'unique-2':       '#6C21CA',
        'unique-light':   '#FAFAFF',

        // Buttons
        button:           '#6C21CA',
        'button-2':       '#A96FF0',
        'primary-button': '#FFFFFF',
        'secondary-button': '#5411A7',

        // UI accents
        misty:            '#B7C0C6',
        opal:             '#F2F2F7',
        gray:             '#EBEEEF',
        'gray-medium':    '#DBDFE2',
        placeholder:      '#D9D9D9',
        star:             '#7E8F99',

        // Status
        danger:           '#FF0000',
        green:            '#4CB57B',
        'pink-red':       '#F1416C',
        'light-green':    '#E8FFF3',
        'light-pink-red': '#FFF5F8',
      },
      fontSize: {
        xs:   '0.75rem',
        sm:   '0.875rem',
        base: '1rem',
        lg:   '1.125rem',
        xl:   '1.25rem',
        '2xl':'1.5rem',
      },
      borderWidth: {
        '1': '1px',
      },
    },
  },
  plugins: [],
};
