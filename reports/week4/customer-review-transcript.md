# Customer Review Transcript

This file contains the sanitized English transcript of the customer review meeting.

Recording publication was approved by the customer (see lines in transcript regarding consent).

## Transcript

**Date:** 2026-06-26

---

## 00:00

Recording permission requested. Customer confirmed consent for publication on Moodle for TAs.

## 00:30

Frontend developer presented the drawing toolbar implementation.

TradingView API discussed: it has a separate library for tools but it comes with a restrictive license. The team therefore used an open-source charting library instead. This aligns with project requirements — licensed proprietary libraries cannot be used.

The toolbar includes: Fibonacci retracements, Price Range, standard lines (vertical, horizontal), and additional drawing tools. All elements are editable and customizable — colors, line width, line style (solid, dashed, dotted).

## 02:30

Question from customer regarding data retrieval:

- Is the data real-time? Yes — live data from Bybit.
- It updates every minute on the five-minute chart.
- All ten assets are loaded and display current charts.
- For now, only the five-minute timeframe is available.

## 04:00

"Analyze Patterns" button discussed.

- The button is functional but not fully tested.
- Patterns will be displayed with boundaries, pattern name, and confidence score below.
- Pattern analysis uses the entire dataset — 150,000 candles at five-minute intervals.

Customer calculated the time range: 150,000 × 5 = 750,000 minutes ≈ 12,500 hours ≈ 1.5 years.

Customer questioned whether this is excessive. The developer acknowledged and agreed to reduce the range. Initial testing with 15,000 candles found no patterns, which is expected for a small range.

## 06:30

Settings demonstrated:

- Theme switching (light/dark) available.
- Confidence threshold slider — patterns below the threshold are not displayed on the chart.
- Customer confirmed the threshold setting is useful.

## 07:30

Drawing persistence discussed:

- All drawings and settings are saved locally (SQLite).
- On page reload, settings and drawings are restored.
- Customer asked for clarification: "not a screenshot of the chart, but the positions of all the shapes remain?" — confirmed.

Customer feedback: drawing tools (Fibonacci, Price Range, standard lines) are sufficient for now.

## 09:15

Question about chart customization:

- Can candlestick colors be changed? Not yet — only overall theme switching is available.
- Drawing shapes are fully customizable: highlight colors, line width, line style.

## 10:00

Data source discussion:

- Data is fetched from Bybit's public REST API endpoints.
- Not using WebSockets — using manual GET requests.
- Customer questioned why WebSockets were not chosen: "with WebSockets, you receive data instantly — it is pushed to your channel, you just read it and update your state."
- Developer agreed to investigate WebSocket integration.

## 11:30

Metrics discussion:

- Customer asked about RSI, Volume, and High/Low metrics.
- These have not been implemented yet.
- Developer confirmed they will be added in the next sprint version.
- Customer requested this be recorded in the backlog and prioritized.

## 12:30

Customer asked about latency metrics — time from data fetch from Bybit to rendering on frontend.

- First 2,000 candles load almost instantly.
- Remaining candles load gradually in the background while the user views earlier candles.
- No database caching yet — all candles are fetched from Bybit on every page visit.
- Customer flagged this as a priority: "That definitely needs to be changed. Please create a task."
- Developer confirmed database caching is currently in development.

## 14:00

ML model presentation by the ML engineer.

Initial basic version completed. Identifies:

- Noise filtering
- Head and Shoulders pattern
- Inverse Head and Shoulders pattern

Key metrics:

- Model filters out 99.75% of noise — remaining 0.25% are pattern candidates.
- Among candidates, ~19% are actual Head and Shoulders patterns.
- Rule-based (non-ML) algorithm had 30% precision — but only found ~800 patterns.
- ML model finds ~480 real patterns (19% of ~2,500 candidates).
- ML model generates 10–13% more noise but has ~6–7× higher recall than rule-based.

Precision limitation explained: very little training data available. Team spent ~7 hours labelling 3–5 patterns per algorithm run. Current training set: 400 patterns for Head and Shoulders, 400 for Inverse Head and Shoulders.

Implementation: runs as a separate microservice on the server. Processes ~15,000 five-minute candles per second on local hardware (may be faster on server). Can handle 50-coin comparison as requested.

## 18:00

Customer asked about formal accuracy metric.

Accuracy on validation set (20% of data): ~48%. However, only 30 patterns were labelled in the validation set while the model selected 2,000–3,000 candidates. Among those, ~19% were verified as real patterns. Practical precision among candidates is 19–25%.

ML approach chosen over rule-based because:

- Rule-based is difficult to tune for variations.
- ML model learns general rules — handles micro/macro variations (e.g., 0.5% shoulder shift).
- Rule-based has strict conditions — would miss shifted patterns or give low confidence.

## 20:30

Pattern analysis range decision:

- Developer proposed analyzing the last 50,000 candles.
- ML model processes 15,000 candles/second, checking every 5 candles with step 5.
- Expected processing time for 50,000 candles: ~1 second.
- Customer suggested analyzing only the visible viewport range.
- Team discussed: visible range has too few candles to find patterns reliably.
- Consensus: analyze last 50,000 candles, display number of patterns found. User can scroll to view patterns.
- Team members agreed 50,000 is appropriate — sufficient range, fast processing.

## 23:00

Pattern display format:

- Wherever a pattern is detected within the 50,000-candle range, boundaries will be drawn on the chart.
- This display method applies uniformly to all pattern types.
- Different graphical representations per pattern type would require additional AI logic — deemed too complex for current scope.

## 24:00

Sprint direction confirmed as satisfactory.

Action items for next sprint:

1. Metrics implementation (RSI, Volume, High/Low)
2. Database caching for candle persistence
3. WebSocket migration for real-time data delivery
4. Pattern integration with ML model

## 25:30

Detailed data pipeline discussion:

- Currently: frontend receives data pushed from backend, not via polling.
- Backend fetches 150,000 candles from Bybit → pushes to frontend.
- No database — in-memory cache only.
- Customer recommended: check Bybit WebSocket documentation, subscribe to parameterized channel, store in database, serve from database.
- Purpose: reduce latency, streamline frontend-backend communication.

## 28:00

Pattern integration timeline:

- Developer offered to finish pattern integration by end of day.
- Customer requested at least stubs connected to ML model for the next review.

## 29:00

Anomaly detection discussion:

- Customer asked if anomaly detection will be implemented.
- ML engineer: unclear what constitutes an anomaly or how to detect it. Priority is finalizing the main pattern detection model.
- Decision: anomaly detection will most likely not be implemented.

## 30:00

Closing discussion:

- Stakeholder asked if the current session satisfies the user story demonstration requirement.
- Team confirmed all discussed improvements cover the relevant user stories.
- Session deemed productive — all necessary fixes and improvements were identified.
