import globals from "globals";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        LightweightCharts: "readonly",
        TradingView: "readonly",
        TickFrameDatafeed: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "semi": ["warn", "always"],
    },
  },
];
