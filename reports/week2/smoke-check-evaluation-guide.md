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
python main.py --symbol BTCUSDT --smoke-check
\end{verbatim}

\textbf{Expected Smoke Check Output Logs:} The execution engine will initialize data-broker connection channels (Bybit REST API), fetch real OHLCV candlestick data, parse mock environment configuration arrays without leaking personal identifiable data (PII) or secrets, run the mock ML pattern detection pipeline, and print a terminal success statement verifying code health.

\vspace{0.8cm}
