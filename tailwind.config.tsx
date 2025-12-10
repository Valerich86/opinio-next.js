// module.exports = {
//   content: [
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: "#FBFFF1",
//         secondary: "#3C3744",
//         delete: "#B4C5E4",
//         create: "#3066BE",
//         accent: "#090C9B",
//       },
//     },
//   },
// };

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FBFFF1",
        secondary: "#3C3744",
        delete: "#B4C5E4",
        create: "#3066BE",
        accent: "#090C9B",
      },
    },
  },
  plugins: [],
};

export default config;
