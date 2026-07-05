import globals from "globals";

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        LightweightCharts: "readonly",
        TradingView: "readonly",
        TickFrameDatafeed: "readonly",
        loadFearAndGreed: "readonly",
        DrawingController: "readonly",
        DrawingLib: "readonly",
        DrawingState: "readonly",
        DrawingEvents: "readonly",
        DrawingSettings: "readonly",
        DrawingToolbar: "readonly",
        DrawingProperties: "readonly",
        TOOL_GROUPS: "readonly",
        lucide: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "semi": ["warn", "always"],
    },
  },
];
