module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    colors: {
      /* brand */
      primary: "#9333EA",
      "primary-accent": "#6D28D9",
      "primary-ghost": "#E7DBF9",
      secondary: "#000A88",
      "secordary-accent": "#00075D",
      "off-white": "#E2DCC9",
      /* App */
      charcoal: "#262626",
      paper: "#FFFCF7",
      warm: "rgba(120, 113, 103, .2)",
      cool: "rgba(29, 31, 64, .2)",
      "charcoal-ghost": "#7D7D7D",
      dark: "#000437",
      "dark-light": "#383A52",
      none: "rgba(255, 252, 247, 0)",

      //utility
      red: "#DC2626",
      "light-red": "#E3BFBF",
      green: "#16A34A",
      "light-green": "#BBD8C6",
      blue: "#0EA5E9",
      "light-blue": "#BAD8E6",
      amber: "#F59E0B",
      "light-amber": "#FDECCE",
    },
    fontFamily: {
      sans: ["Montserrat", "sans-serif"],
      mono: ["IBM Plex Mono", "mono"],
      serif: ["Georgia", "serif"],

      script: ["Dancing Script", "script"],

      alt: ["Montserrat Alternates", "sans-serif"],
    },
    fontSize: {
      callout: "4em", //72px
      brand: "1.39rem",
      title: "2.822rem", //50px
      h1: "1.68rem", //36px
      h2: "1.4132rem", //30px
      h3: "1.1888rem", //25px
      base: "1rem", //18px -- at base 18px
      sub: ".75rem", //15px
    },
    letterSpacing: {
      heading: "-.03em",
      base: "0",
      sub: ".03em",
      brand: ".12em",
    },
    lineHeight: {
      heading: "1.54em",
      base: "1.3em",
      sub: "1.1em",
    },
    fontWeight: {
      thin: 100,
      "extra-light": 200,
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      "extra-bold": 800,
      black: 900,
    },
    spacing: {
      0: "0px",
      1: "1px",
      2: "2px",
      3: "3px",
      5: "5px",
      8: "8px",
      12: "12px",
      20: "20px",
      34: "34px",
      50: "50px",
      85: "85px",
    },
    minWidth: {
      0: "0",
    },
    minHeight: {
      0: "0",
    },
    width: {
      0: "0",
      page: "60ch",
      screen: "100vw",
      full: "100%",
    },
    height: {
      0: "0",
      screen: "100vh",
      full: "100%",
    },
    borderRadius: {
      0: "0",
      sub: "1px",
      mention: "3px",
      5: "5px",
      12: "12px",
      20: "20px",
      50: "50px",
      85: "85px",
      full: "100%",
    },
    boxShadow: {
      base: "0px 4px 8px 0px #26262633",
      bookmark: "2px 0px 2px rgba(38, 38, 38, 0.25)",
      landing: "3px 3px 0 rgba(38, 38, 38, 0.60)",
      "landing-inset": "inset 3px 3px 0 rgba(38, 38, 38, 0.60)",
      lab: "2px 3px 0 #262626",
      "lab-inset": "inset 2px 3px 0 #262626",
      primary: "3px 3px 0px #4D1C99",
      "primary-inset": "inset 3px 3px 0px #4D1C99",
      danger: "3px 3px 0px #DC2626",
      "danger-inset": "inset 3px 3px 0px #DC2626",
    },
    extend: {
      borderWidth: {
        1: "1px",
        2: "2px",
        3: "3px",
      },
    },
  },
  plugins: [
    function ({ addBase, addUtilities, addComponents }) {
      addBase({
        /* Typography */
        /* Font Varients */
        ".font-btn": {
          "font-variant": "all-small-caps",
        },
        ".mention": {
          "@apply text-base leading-base tracking-base": {},
        },
        ".sub": {
          "@apply text-sub tracking-sub leading-sub": {},
        },
        ".hero": {
          "@apply text-callout leading-heading tracking-heading font-light": {},
        },

        ".title": {
          "@apply text-title tracking-heading leading-heading font-light": {},
        },

        ".digital": {
          "@apply text-sub tracking-sub leading-sub font-mono": {},
        },

        ".page": {
          "@apply font-alt font-medium tracking-base": {},
        },

        ".lead": {
          "@apply font-semibold": {},
        },
        /* Sub */
        ".p-sub": {
          "@apply px-sub py-sub": {},
        },
        ".px-sub": {
          "@apply px-3": {},
        },
        ".py-sub": {
          "@apply py-1": {},
        },
        ".m-sub": {
          "@apply mx-sub my-sub": {},
        },
        ".mx-sub": {
          "@apply mx-3": {},
        },
        ".my-sub": {
          "@apply my-1": {},
        },
        ".icon-sm": {
          "@apply rounded-sub p-1 flex items-center justify-center": {},
          width: "19px",
          height: "19px",
        },
        /* Mention */
        ".gap-mention": {
          "@apply gap-3": {},
        },
        ".p-mention": {
          "@apply px-mention py-mention": {},
        },
        ".m-mention": {
          "@apply mx-mention px-mention": {},
        },
        ".px-mention": {
          "@apply px-3": {},
        },
        ".py-mention": {
          "@apply py-1": {},
        },
        ".mx-mention": {
          "@apply mx-3": {},
        },
        ".my-mention": {
          "@apply my-1": {},
        },
        ".icon-base": {
          "@apply flex items-center justify-center p-3 rounded-mention": {},
          width: "23px",
          height: "23px",
        },
        ".icon-base.m-mention": {
          "@apply m-1": {},
        },
        /* Cell */
        ".m-cell": {
          "@apply mx-cell my-cell": {},
        },
        ".mx-cell": {
          "@apply mx-12": {},
        },
        ".my-cell": {
          "@apply my-8": {},
        },
        ".p-cell": {
          "@apply px-cell py-cell": {},
        },
        ".px-cell": {
          "@apply px-12": {},
        },
        ".py-cell": {
          "@apply py-8": {},
        },
        ".gap-cell": {
          "@apply gap-5": {},
        },
        ".px-page": {
          "@apply px-50": {},
        },
        ".mx-page": {
          "@apply mx-50": {},
        },
      });
      addUtilities({
        ".ellipsis": {
          "@apply whitespace-nowrap overflow-hidden overflow-ellipsis": {},
        },
        ".clickable": {
          "@apply hover:bg-warm focus:bg-cool cursor-pointer": {},
        },
      });
    },
  ],
};
