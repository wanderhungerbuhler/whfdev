import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        gray: {
          100: '#F0F0F5',
          200: '#DADADA',
          300: '#7D7D7D',
          400: '#343541',
        },
        auxiliary: {
          success: '#15BC87',
          info: '#4C72DC',
          warning: '#FFB728',
          danger: '#F35663',
        },
      },
    },
  },
  plugins: [],
}
export default config
