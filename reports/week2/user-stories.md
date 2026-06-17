# Week 2 User Stories

## Initial proposed MVP v1 scope

- US-01
- US-02
- US-03
- US-04
- US-05

## User stories

## US-01: Detect chart patterns with ML support
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a trader,
I want the system to detect predefined chart patterns using machine learning,
so that I can prioritize the most promising market opportunities.

### Notes and constraints
- The pattern detector may use XGBoost or another supervised model.
- Current implementation: mock ML detector returns a predefined pattern name (Head and Shoulders, Double Bottom, Bull Flag, etc.) with a randomized confidence score (75–99%) for the last 50 candles. Real XGBoost model integration is pending for MVP v1.
- Accessible via `tickframe analyze` CLI command and "Analyze for patterns" button in the web dashboard.

## US-02: View scan results in a report-friendly format
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a team member,
I want to export scan results to a readable report,
so that the TA and customer can evaluate the output easily.

### Notes and constraints
- The initial output may be a Markdown report or JSON summary.
- The report should include timestamps, symbols, and detected patterns.
- Current implementation: output available in four formats: (1) formatted OHLCV table in terminal (`scan`), (2) JSON file (`scan --output`), (3) Markdown report file (`report`), (4) interactive candlestick chart in web dashboard (`serve`).

## US-03: Maintain a public repository with MIT license
**Requirement status:** Done
**MoSCoW priority:** Must Have

As a course participant,
I want the product repository to be public and MIT licensed,
so that the project complies with the assignment requirements.

### Notes and constraints
- The repository must include `LICENSE`, `.gitignore`, and `.env.example`.

## US-04: Provide a reusable environment variable template
**Requirement status:** Completed
**MoSCoW priority:** Should Have

As a developer,
I want a sanitized `.env.example` file,
so that I can set up the local environment without exposing secrets.

### Notes and constraints
- Real credentials must never be committed.
- Add `.env` to `.gitignore`.

## US-05: Keep a PR template for review consistency
**Requirement status:** Done
**MoSCoW priority:** Could Have

As a reviewer,
I want a standardized PR description template,
so that every team PR includes summary, tests, and review checklist.

### Notes and constraints
- Use `.github/pull_request_template.md`.

## US-06: Sidebar with 10 trading pairs and actual prices
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a trader,
I want a sidebar displaying 10 trading pairs with their actual prices,
so that I can monitor multiple instruments at a glance.

### Notes and constraints
- The sidebar should show real-time or latest-known prices for each pair.
- Pairs should be configurable (e.g., BTC/USD, ETH/USD, etc.).
- Accessible from the main trading dashboard.

## US-07: Choose timeframes of the chart
**Requirement status:** Active
**MoSCoW priority:** Must Have

As a trader,
I want to select different timeframes for the chart (e.g., 1m, 5m, 15m, 1h, 4h, 1d),
so that I can analyse price action at my preferred granularity.

### Notes and constraints
- Standard timeframes: 1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w.
- Changing the timeframe should reload/resample candlestick data accordingly.
- The current timeframe should be visually highlighted.

## US-08: Toolbar with drawing figures, Fibonacci, and brush
**Requirement status:** Active
**MoSCoW priority:** Should Have

As a trader,
I want a toolbar with drawing tools (figures, Fibonacci retracement, and brush),
so that I can mark support/resistance levels and perform technical analysis on the chart.

### Notes and constraints
- Drawing figures include trend lines, rectangles, and horizontal/vertical lines.
- Fibonacci retracement levels (0.0, 0.236, 0.382, 0.5, 0.618, 0.786, 1.0) should be supported.
- Brush tool allows selecting a time range on the chart for focused analysis.

## US-09: View chart for different time periods
**Requirement status:** Active
**MoSCoW priority:** Should Have

As a trader and chart analyst,
I want to view the chart for different historical time periods (e.g., 1 day, 1 week, 1 month, 1 year),
so that I can analyse market trends over short and long horizons.

### Notes and constraints
- Time period presets: 24h, 7d, 30d, 90d, 1y, All.
- Combined with timeframe selection (e.g., 1h candles over 30 days).
- Should preserve drawing annotations when switching periods where possible.

## US-10: Volume chart below the main chart
**Requirement status:** Active
**MoSCoW priority:** Should Have

As a quantitative analyst,
I want a volume histogram displayed below the main price chart,
so that I can assess the strength behind price movements.

### Notes and constraints
- Volume bars should align with the candlestick periods of the main chart.
- Colour convention: green for up-volume, red for down-volume.
- The volume sub-chart should share the same x-axis (time) as the price chart.

## US-11: RSI chart below the main chart
**Requirement status:** Active
**MoSCoW priority:** Should Have

As a quantitative analyst,
I want an RSI indicator displayed as a sub-chart below the main price chart,
so that I can identify overbought and oversold market conditions.

### Notes and constraints
- Standard RSI period of 14 with overbought (70) and oversold (30) threshold lines.
- RSI values should update in real-time as new price data arrives.
- The RSI sub-chart should share the same x-axis (time) as the price chart.

## US-12: Crypto Fear and Greed Index
**Requirement status:** Active
**MoSCoW priority:** Could Have

As an investor,
I want to see the Crypto Fear and Greed Index in the dashboard,
so that I can gauge market sentiment before making trading decisions.

### Notes and constraints
- The index should be fetched from a public API (e.g., alternative.me).
- Display the current value, label (Fear / Greed / Neutral), and a historical trend if available.
- Cache the result to avoid excessive API calls.

## US-13: Toggle between day theme and night theme
**Requirement status:** Active
**MoSCoW priority:** Could Have

As a night theme enjoyer,
I want to switch between day and night themes in the application,
so that I can use the app comfortably in different lighting conditions.

### Notes and constraints
- Theme toggle should persist between sessions (e.g., stored in localStorage or user preferences).
- All UI components should respect the active theme.
- Default to the system preference (prefers-color-scheme) on first visit.

## US-14: Customise chart colors in settings
**Requirement status:** Active
**MoSCoW priority:** Could Have

As a trader,
I want to customise chart colours (candles, background, grid, indicators) in the settings,
so that I can personalise the visual appearance to my preference.

### Notes and constraints
- Colour pickers for: bullish candle, bearish candle, background, grid lines, volume bars, and indicator lines.
- Changes should apply immediately to the chart without a page reload.
- Settings should be persisted across sessions.
