# Customer Review Transcript

This file contains the sanitized English transcript of the customer review meeting.

## Transcript

**Date:** 2026-06-19

---

## 00:00

The team presented the Figma design containing all previously defined user stories.

Questions were raised regarding additional dashboard components.

## 00:50

Figma access was requested. Access permissions will be granted later.

## 01:50

Requirements confirmed:

* Add Fear & Greed Index
* Add volume chart
* Add RSI indicator
* Add drawing toolbar
* Support theme switching

## 03:30

Additional UI customization requirements:

* Allow light and dark themes
* Allow candle color customization

## 04:00

The possibility of using the TradingView API was discussed.

Advantages mentioned:

* Faster chart implementation
* Built-in indicators
* Built-in drawing tools
* Easier customization

A final decision was postponed pending technical research.

## 05:30

The current MVP implementation was demonstrated.

Pattern analysis functionality was discussed.

The current UI contains an "Analyze Patterns" action, but ML integration has not yet been completed.

## 06:20

Discussion about pattern visualization.

Two approaches were considered:

* Highlight patterns directly on the chart
* Display pattern information separately

If direct visualization is not possible, display:

* Pattern type
* Confidence score
* Detected range

## 07:10

The possibility of future chart customization was discussed.

The team was asked to verify whether TradingView allows sufficient customization and future extensibility.

## 08:45

Researching TradingView capabilities became the highest priority.

If TradingView is insufficient, alternative technologies should be considered.

Potential alternatives:

* Canvas-based implementation
* Alternative chart libraries
* Fully custom implementation

## 09:45

Repository organization was discussed.

Temporary separate repositories may be used due to development requirements and later merged into the main repository.

## 11:10

Task tracking was discussed.

A recommendation was made to use a Kanban-style board.

GitHub Projects was suggested because of its integration with pull requests.

## 13:40

Feedback on the Figma design:

* Additional screens are required
* Authentication is unnecessary for MVP

## 14:30

Pattern visualization needs more detailed mockups.

Additional designs should demonstrate:

* Pattern appearance
* Metric placement
* Different application states

## 15:30

Suggestion:

Add a dedicated pattern list.

Users should be able to:

* Select a pattern
* Highlight its location
* Display occurrence information

## 16:20

Current ML behavior:

* Analyze the latest 50 candles

Target behavior:

* Continuously scan the entire chart using rolling windows

## 17:15

Additional UI examples are required.

Every approved metric and pattern should have a dedicated visual example in Figma.

## 18:10

Current proposal:

Use two vertical boundaries to indicate the beginning and end of a pattern.

More examples are required, especially for multiple simultaneous patterns.

## 19:00

Decision:

Update Figma designs and continue discussions asynchronously.
