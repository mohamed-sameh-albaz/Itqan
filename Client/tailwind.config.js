const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Adjust the path according to your project structure
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000B58',
        }
      },
      // fontFamily: {
      //   sans: ['Lalezar', 'sans-serif'], // Set Lalezar as the default font
      // },
    },
  },
  plugins: [],
});
