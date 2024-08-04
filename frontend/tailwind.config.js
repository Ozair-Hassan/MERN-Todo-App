/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '640px',
      md: '768px',
      m: '896px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      // Add more custom screen sizes here
    },
    extend: {
      titleGradient: {
        'text-gradient': 'linear-gradient(to right, #57ba46 50%, #8f8f8e 50%,)',
      },
      subtitleGradient: {
        'text-gradient': 'linear-gradient(to right, #57ba46, #8f8f8e)',
      },
      placeholderColor: (theme) => ({
        error: theme('colors.red.500'),
      }),
    },
  },
  plugins: [],
}
