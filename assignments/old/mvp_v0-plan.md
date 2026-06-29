# MVP V0 PLAN

## Frontend
* 5 min chart with 200 cadles, there should be a gap at the top and the bottom sizing 1/3 of chart height
* Horisontal time bar at the bottom and vertical price bar at the left connected in grid. Spaces for grid: vertical lines on every 1 hour and horisontal lines on every 100$ bitcoin
* Button "Analize for patterns" at the top left corner
* Displayed result of ML for the last 50 cadles, two vertical lines at the edges of a 50 candle segment, centered result below the chart (for ex: "H&S 99%")
* the chart should move right after new candle have appeared

## Backend
* Database for 201 candles OR Cashed 201 cadles which deletes data then new 5 min cadle is created
* Download last 200 cadles (200*5 min) data from Bybit API into DB and make the app update last candle every 1 min.
* Button "Analize for patterns" makes call to ML with data from last 50 candles and returns response from it

## Repo and assignment changes
* Change reports/week2 file contents based on changes made in the development
* Make MVP v0 Access and Smoke-Check Evaluation Guide based on required format from Assignment_02.md. Template:
```
\section{MVP v0 Access and Smoke-Check Evaluation Guide}
To evaluate the underlying technical codebase foundation compiled for MVP v0, the Teaching Assistant (TA) can quickly spin up and execute the repeatable smoke-test script using any standard bash container environment:

\begin{verbatim}
# 1. Pull the official submission tree matching the target commit hash
git clone https://github.com/DaniilJechev/SWP_TickFrame_28_team.git
cd SWP_TickFrame_28_team
git checkout YOUR_FULL_COMMIT_HASH_HERE

# 2. Replicate the environment architecture structure using the sanitized mock layout
cp .env.example .env

# 3. Initialize execution of the repeatable internal smoke check command logic
python main.py --symbol BTC/USDT --smoke-check
\end{verbatim}

\textbf{Expected Smoke Check Output Logs:} The execution engine will initialize data-broker connection channels, parse mock environment configuration arrays without leaking personal identifiable data (PII) or secrets, and print a terminal success statement verifying code health.

\vspace{0.8cm}
```
