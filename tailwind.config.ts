import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#343541',
        gray: {
          100: '#F0F0F5',
          200: '#DADADA',
          300: '#7D7D7D',
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
