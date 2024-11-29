import type { Config } from "tailwindcss";
import formsPlugin from '@tailwindcss/forms'
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyanBlue: 'hsl(191 91% 50% / 1)',
        cyanBlueLight: 'hsl(191 91% 69% / 1)',
        cyanBlueSupLight: 'hsl(191 91% 95% / 1)',
        darkBlue: 'hsl(228, 39%, 23%)',
        darkGrayishBlue: 'hsl(277,12%,61%)',
        veryDarkBlue: 'hsl(233,12%,13%)',
        veryPaleRed: 'hsl(13, 100%, 96%)',
        veryLightGray: 'hsl(0,0%,98%)'
      },
      container: {
        center: true,
      },
    },
  },
  plugins: [formsPlugin],
} satisfies Config;
