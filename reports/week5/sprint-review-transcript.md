# Sprint Review Transcript

This file contains the sanitized English transcript of the Sprint Review meeting.

Recording publication was approved by the customer (see lines in transcript regarding consent).

## Transcript

**Date:** 2026-07-03

---

## 00:00

Recording permission requested by Fedor. Nikolay confirmed consent for publication.

Fedor begins screen sharing.

## 00:26

**Sprint Goal review — MVP v2 delivered.**

Fedor summarises completed items: Fear & Greed Index and trading volume indicators added. ML model reports now display properly with descriptions and confidence scores. The product is essentially feature-complete for MVP v2.

## 00:51

**RSI sub-chart discussion.**

Fedor mentions RSI is not working — rendering issue with the TradingView library. The implementation approach (manual overlay) failed.

Nikolay asks why — wasn't the library researched and confirmed to cover all needs?

Fedor acknowledges, admits he initially considered RSI optional.

Nikolay clarifies: RSI was listed in the initial functional requirements — it is not optional. Must be included.

Fedor confirms he will re-implement using a specialised library.

## 02:26

**ML model accuracy and pattern filtering.**

Fedor reports ML model accuracy at ~57%. Daniel will provide more details.

Nikolay asks if filtering for specific patterns exists.

Fedor: No, but can add it.

Nikolay requests: confidence threshold setting and pattern-type toggle visibility controls, placed on the side panel.

Fedor agrees to implement both.

## 03:25

**Chart switching and UI polish.**

Fedor explains chart type switching (candle/line/area) works but glitches occasionally during switching or element movement — needs refinement. Shows revamped toolbar with integrated open-source drawing library.

Nikolay asks: if a custom library was used for drawings, why is RSI still problematic?

Fedor: attempted manual RSI implementation; hasn't tried a specialised library yet. That is the plan.

## 04:15

**Additional coin metrics.**

Fedor shows 24-hour price change icon. Asks if more coin metrics (24h change, 5m change) would be useful.

Nikolay: yes, if time permits.

## 04:42

**Analysis range and database storage.**

Fedor demonstrates configurable analysis range slider — 3,000 candles processed instantly, 10,000 slightly longer. 3,000 is sufficient. Saving analysis results to database not yet implemented — planned for this sprint.

## 05:40

**WebSocket live updates.**

Fedor: prices update every second via WebSocket channels from Bybit and Binance APIs. Candlestick storage is working — all historical candles saved to the database.

Nikolay asks about data flow: frontend gets data from exchanges directly or from database?

Fedor: initially loaded from database, then latest updates via WebSocket. Daily data fetched entirely from database. Caching implemented — revisiting a chart loads quickly. Drawings preserved on refresh (stored in cache).

## 07:18

**Action items summary.**

Fedor summarises remaining work: add RSI, additional coin metrics (if time), pattern filtering, minor bug fixes.

Nikolay acknowledges.

## 08:01

**Transition to ML model discussion.**

## 08:09

**ML model — new patterns in progress.**

Daniel reports: work begun on Double Top and Double Bottom model. Pipeline established. Team is labelling data — expected completion next week. Next meeting should show a model capable of distinguishing these new patterns.

Nikolay asks about timing.

Daniel: next week or week after. Scope limited to noise detection plus four patterns: Double Top, Double Bottom, Head and Shoulders, Inverse Head and Shoulders. Next week focuses on Double Top. In two weeks, porting detection to other timeframes.

## 09:19

**Semester deadlines and scope.**

Nikolay asks about semester end.

Daniel: end of July. Project presentations in ~3 weeks. Final version will detect four patterns and support 1–2 additional timeframes beyond 5m.

Nikolay confirms all four originally agreed patterns will be ready.

Daniel acknowledges — initial scope was ideal. Data collection and labelling took longer than expected. Scope adjusted due to resource constraints.

Nikolay re-confirms: Head and Shoulders, Inverse Head and Shoulders, Double Top, Double Bottom will all be ready. 50-coin support is feasible with proper optimisation.

## 12:09

**Presentation format.**

Fedor: team will prepare a presentation and likely demonstrate the live project. Defence before the Teaching Assistant. Intermediate defence already occurred.

Nikolay: was not informed about a presentation in front of him — will check. Offers assistance if needed but believes the team can handle it.

## 13:02

**Closing.**

Fedor proposes concluding the call. Nikolay agrees. Wishes everyone a great weekend.
