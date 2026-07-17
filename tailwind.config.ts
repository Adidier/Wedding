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
        wedding: {
          primary: '#B42150',      // Rojo/Vino oscuro principal
          accent: '#F2B705',       // Dorado
          light: '#F7F2E7',        // Beige claro
          sand: '#CFC3BC',         // Gris beige
          gray: '#AFA6A1',         // Gris oscuro
          rose: '#F9B2A0',         // Rosa pastel
        },
      },
    },
  },
  plugins: [],
}
export default config
