import fluid, { extract } from "fluid-tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: ["./index.html", "./src/**/*.{js,vue}"],
    extract,
  },
  theme: {
    extend: {},
  },
  plugins: [fluid],
};
