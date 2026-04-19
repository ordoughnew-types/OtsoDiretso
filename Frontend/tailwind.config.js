/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Include your src folder
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'chat-gradient': 'linear-gradient(135deg, #1881b8, #8cb6dc, #8cb7da)',
      },
    },
  },
  plugins: [],
};
