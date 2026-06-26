# TradingView Charting Library Setup

The TradingView Advanced Charts widget requires a proprietary library.
Without it, the app falls back to **lightweight-charts** (free, open-source) which has no drawing toolbar.

## How to enable the advanced chart + toolbar

1. Go to https://www.tradingview.com/HTML5-stock-forex-bitcoin-charting-library/
2. Click "Get free access" and complete the registration
3. Download the package (a ZIP file)
4. Extract the `charting_library` folder into this directory

   Final structure must be:
   ```
   lib/charting_library/
   ├── charting_library.min.js      ← main library (required)
   ├── charting_library.min.css     ← styles (auto-loaded by widget)
   ├── static/                      ← icons, fonts, etc.
   │   ├── img/                     ← toolbar icons
   │   └── ...                      ← other assets
   └── README.md                    ← this file
   ```

5. Restart the app — the toolbar (drawing tools, Fibonacci, brush) appears automatically

## Verify it works

Open the browser console (`F12`). If you see:
- `TradingView is not undefined` — the library loaded successfully
- `charting_library.min.js 404` — the file is not in the right place

## Why is this needed?

TradingView's Charting Library is a **free** but proprietary product that requires
a license agreement with TradingView. The lightweight-charts fallback provides basic
charting without any license requirements.
