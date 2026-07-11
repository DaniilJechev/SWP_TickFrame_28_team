# Week 6 Transcript

## Progress Update

### 00:01:20

**Customer:** Could you summarize the progress made since our previous meeting?

**Team:** The planned functionality is almost complete. The project currently includes:

* a machine learning module with four trading patterns;
* RSI and Volume indicators;
* the Fear & Greed indicator;
* support for ten cryptocurrencies with their configured timeframes;
* a drawing toolbar integrated into the chart.

The remaining work is limited to completing the final two ML patterns and implementing the requested pattern filtering functionality. Both tasks are planned for completion next week.

---

## Technical Indicator Library

### 00:02:09

**Team:** Regarding the indicators, during the previous meeting we discussed the difficulties of implementing RSI manually. Based on your recommendation, we searched for an open-source library instead.

We found a suitable library containing approximately **445 technical indicators**. Rather than exposing only RSI, we integrated the complete library. RSI remains enabled by default, while users can search for and enable any of the available indicators.

### 00:02:19

**Team:** We'd like to confirm whether including the entire indicator library is acceptable for the final product.

**Customer:** Yes, that's an improvement.

### 00:02:43

**Customer:** Could you explain how this library works internally? What input does it receive, and how does it generate the indicator values?

### 00:02:45

**Team:** The chart itself is rendered using the TradingView charting library, but the indicator library is separate. It is an independent open-source package that performs the indicator calculations locally.

### 00:02:54

**Customer:** Does it communicate with TradingView through an API, or does it calculate everything on its own?

### 00:03:00

**Team:** No TradingView API calls are involved. The TradingView library is only responsible for rendering the charts. The indicator library is installed locally and calculates indicators using the market data already available within the application.

### 00:03:08

**Customer:** What exactly does the indicator library use internally? Does it still rely on external APIs to obtain RSI and other indicator values?

### 00:03:27

**Team:** No. It is an independent open-source library containing implementations of the indicator algorithms. We provide it with the candle data, and it computes the requested indicators locally.

### 00:03:44

**Customer:** What data do you pass into the library? How do you obtain the values required to calculate the indicators?

### 00:03:57

**Team:** The backend provides the historical candle data. The library receives this data as input and calculates the indicator values based on the mathematical formulas implemented within the library.

### 00:04:14

**Customer:** Could you either show the library call in the code or explain the data flow in more detail? We're interested in understanding whether this library could become a performance bottleneck.

### 00:04:38

**Team:** I can't demonstrate the code immediately because I wasn't prepared for that today, but I can show the implementation during the next meeting.

### 00:04:46

**Customer:** Have you performed any measurements? Did you observe any noticeable delays while calculating the indicators?

### 00:04:59

**Team:** The only noticeable delay occurs while loading the main chart. Indicator calculations themselves are performed separately and have not introduced any significant performance issues during testing.

### 00:05:11

**Customer:** Is the indicator calculation performed instantly, or is there a noticeable delay compared to rendering the chart?

**Team:** The indicator calculations are performed almost instantly because they are based on mathematical formulas. The only noticeable delay is loading the chart itself. Once the market data is available, the indicator values are calculated immediately.

### 00:05:35

**Customer:** Does the library generate the indicator values itself, or does it retrieve them from another service?

**Team:** The library performs the calculations locally. It receives the candle data that has already been loaded into the application and computes the indicator values without contacting external services.

### 00:05:58

**Customer:** So the workflow is: the application loads the market data, passes it to the library, and the library returns the calculated indicator values?

**Team:** Exactly. The library processes the candle data that is already available in the application and returns the calculated indicator values, which are then displayed on the chart.

### 00:06:26

**Customer:** How many candles are processed when calculating the indicators?

**Team:** Approximately **55,000 candles** are processed. Despite the amount of data, the calculations remain fast because each indicator consists primarily of mathematical formulas.

### 00:06:46

**Customer:** The additional indicators are a useful improvement. The filtering functionality can be completed next week together with the remaining machine learning patterns.

**Team:** Yes. The remaining pattern filtering functionality and the final two machine learning patterns are scheduled for completion before the next meeting.

---

## Machine Learning Discussion

### 00:07:15

**Customer:** Could you demonstrate the pattern detection?

**Team:** Certainly. Pattern detection is currently operational.

### 00:07:44

**Customer:** I noticed that the patterns only work on the **5-minute timeframe**. Why don't they work on the 15-minute or 1-hour charts?

### 00:07:58

**Team:** Each timeframe requires its own trained machine learning model. At the moment we only have a properly trained model for the 5-minute timeframe.

### 00:08:20

**Customer:** Have you tried evaluating the existing model on larger timeframes, even as an experiment?

**Team:** We considered it, but it would not produce meaningful results because each timeframe has different statistical characteristics. A model trained on 5-minute candles cannot be expected to perform reliably on 15-minute or hourly data.

### 00:08:55

**Team:** Supporting additional timeframes requires collecting and manually annotating entirely new datasets. Although we could technically extend the pipeline, preparing the required labelled data is the primary bottleneck.

### 00:09:33

**Team:** Data annotation is a time-consuming manual process. Every timeframe requires its own labelled dataset, and there is currently no practical way to automate this work. Within the scope of the project, we decided to prioritise delivering a reliable model for the 5-minute timeframe rather than incomplete support for multiple intervals.

### 00:10:18

**Customer:** That explanation makes sense. It is better to deliver one properly trained model than several models with unreliable predictions.
## Deployment Discussion

### 00:10:45

**Customer:** Will the application be deployed before the final review?

**Team:** Yes. The application has already been deployed. I'll share the deployment link again in our Telegram chat after the meeting.

**Customer:** I was asking because the demonstration is running locally rather than on the deployed instance.

**Team:** I haven't updated the virtual machine with the latest version yet. Once the remaining functionality is completed, we'll deploy it and provide the updated link.

### 00:11:28

**Customer:** Please send the deployment link as soon as the remaining machine learning patterns are finished. We would like to review the completed product before the next meeting.

**Team:** Certainly. The next meeting should already present the finished version of the project.

### 00:12:02

**Customer:** We'd also like the application to be ready for handover. That includes clear deployment instructions so another developer or customer can launch the system without additional assistance.

**Team:** We already have deployment instructions prepared. We'll review them again and expand them if anything is missing.

### 00:12:45

**Customer:** The documentation should describe any prerequisites before running Docker Compose. If additional software or configuration is required, it should be clearly documented.

**Team:** We'll review the documentation and include any missing setup requirements before the final submission.

### 00:13:20

**Customer:** Ideally, launching the project should require nothing more than running Docker Compose.

**Team:** That's the goal. The project is designed so that Docker Compose starts all required services.

---

## Environment Configuration Review

### 00:13:58

**Customer:** Where are the environment variables stored? In particular, where are the API keys and database credentials configured?

**Team:** At the moment the database runs locally during development. External API keys are optional because public market data can be accessed without authentication for the current functionality.

### 00:14:36

**Customer:** Let's clarify exactly what happens when someone runs Docker Compose. Which containers are started?

**Team:** The backend service and the machine learning service are started automatically. The database is currently handled separately in the development environment.

### 00:15:18

**Customer:** That's something we'll need to revisit during the architecture review. A complete deployment should include every required service, including the database.
## Architecture Review

### 00:15:42

**Customer:** Before the final handover, we'd like to review the backend architecture in more detail. In particular, we'd like to understand how the environment variables, database, and deployment configuration are organized.

**Team:** The project can be started using Docker Compose. Optional API keys can be provided, but the application can also operate without them because the required market data is publicly available.

### 00:16:38

**Customer:** Which services are actually started when Docker Compose is executed?

**Team:** The backend service and the machine learning service are started automatically.

**Customer:** What about the database? Where are its credentials configured?

**Team:** During development the database is created locally on the machine where the application is running.

---

### 00:17:35

**Customer:** Let's inspect the configuration files. Please open the `.env.example` file.

The configuration already contains variables such as `DB_HOST` and `DB_PORT`, but database authentication parameters are missing. If the application is intended to support an external database server, the username and password should also be configurable.

### 00:18:24

**Customer:** Now let's look at the Docker Compose configuration.

I can see the backend service and the machine learning service, but I don't see a database container.

Where is the database running?

**Team:** At the moment the project relies on SQLite during development.

### 00:19:05

**Customer:** During our previous meetings we agreed that project data would be stored in PostgreSQL. The current configuration doesn't reflect that architecture.

Let's inspect the backend implementation to see how the database is actually used.

---

### 00:20:02

**Customer:** Please open the database service implementation.

From the code it appears that the application is using **SQLite** rather than **PostgreSQL**.

**Team:** Yes, that's correct. SQLite is currently used during development.

### 00:20:48

**Customer:** That isn't the architecture we discussed.

For the final version, I'd like you to:

* deploy a dedicated **PostgreSQL 17** container;
* include it in Docker Compose;
* configure database credentials through environment variables;
* initialize the database using migrations instead of creating tables directly from the application code.

### 00:21:45

**Customer:** Fortunately, this shouldn't require a major rewrite. Your application already communicates with the database through SQL, so migrating from SQLite to PostgreSQL should mainly involve updating the infrastructure and initialization process rather than redesigning the backend.

**Team:** Understood. We'll migrate the project to PostgreSQL, update Docker Compose, and introduce startup migrations before the next meeting.
## Database Implementation Review

### 00:22:18

**Customer:** Let's continue reviewing how the database is actually implemented.

From the current implementation it appears that the application writes data to a local SQLite database rather than a PostgreSQL server.

**Team:** Yes, that's correct. At the moment the application uses SQLite during development.

### 00:22:55

**Customer:** That explains why Docker Compose doesn't include a database container. However, this isn't the architecture we agreed on earlier in the project.

For the final version we'd like to see a dedicated PostgreSQL service running as part of the deployment.

### 00:23:34

**Customer:** Please configure PostgreSQL as a separate Docker container, expose the required credentials through environment variables, and initialize the schema using database migrations instead of creating tables directly from the application code.

**Team:** Understood. We'll replace the current SQLite setup with PostgreSQL before the final review.

### 00:24:18

**Customer:** Since your backend already communicates with the database using SQL, this migration shouldn't require major changes to the business logic. Most of the work is infrastructure and initialization rather than rewriting application code.

---

## Persistence Discussion

### 00:25:02

**Customer:** I'd like to understand how persistent storage currently works. Is the data actually written to disk, or does it exist only while the application is running?

### 00:25:19

**Team:** The application writes its data into the local SQLite database file while it is running.

### 00:25:42

**Customer:** Then there should be a database file somewhere in the project. Can you locate it?

The goal is to verify exactly where the data is stored and how the database is initialized.

### 00:26:11

**Team:** We believe the SQLite database file is created automatically during application startup, although we haven't inspected it directly during today's demonstration.

### 00:26:45

**Customer:** That's an important debugging skill for every developer. You should always be able to determine:

* where your database is created;
* how it is initialized;
* when data is written;
* and what happens during application startup.

Understanding these details makes diagnosing problems much easier.

### 00:27:36

**Customer:** Looking through the code, I can already see the database initialization methods. Following those methods makes it possible to identify where the SQLite file is created and how the application connects to it.

**Team:** That makes sense. We'll investigate the initialization process in more detail and make the storage mechanism clearer while migrating to PostgreSQL.

---

## Machine Learning Backend Review

### 00:28:18

**Customer:** Now that we've reviewed the database layer, let's look at the machine learning backend.

I'd like to understand how the ML service receives its input data and how pattern detection is triggered.

### 00:28:45

**Team:** The backend communicates with a separate ML service. Candle data is retrieved from the database and sent to the ML service through its API for analysis.

### 00:29:17

**Customer:** I can see an asynchronous method called `AnalyzeCandles`. It accepts both the candle data and a `timeFrame` parameter.

Earlier you mentioned that only the 5-minute timeframe is currently supported. Was this interface designed with future expansion in mind?

### 00:29:54

**Team:** Yes. The architecture was originally designed to support multiple timeframes. We expected to train models for 15-minute, hourly, and additional intervals, so the API already includes the timeframe parameter. However, only the 5-minute model was completed during this project.

If another timeframe is requested, the request is rejected because no trained model currently exists.

### 00:30:26

**Customer:** I noticed that the `AnalyzeCandles` method accepts a `timeFrame` parameter. Earlier you mentioned that only the 5-minute model is currently supported. Why is the parameter already part of the API?

**Team:** The architecture was originally designed to support multiple timeframes. The intention was to train separate models for 15-minute, hourly, and additional intervals. Although that functionality wasn't completed within the project timeframe, the API was designed to support future expansion.

### 00:31:05

**Team:** As an additional safety measure, the service validates incoming requests. If a timeframe other than the supported 5-minute interval is requested, the request is rejected rather than producing unreliable predictions.

### 00:31:32

**Customer:** Please scroll a little further so we can review the remainder of the implementation and understand how the prediction pipeline is organized.

**Team:** Certainly.

---

## Closing Remarks

### 00:31:48

**Customer:** Overall, the project has made significant progress since the previous review. Most of the remaining work is no longer focused on implementing new functionality but on preparing the project for final delivery.

The remaining priorities before the final presentation are:

* complete the remaining two machine learning patterns;
* implement pattern filtering;
* migrate from SQLite to PostgreSQL;
* include a PostgreSQL container in Docker Compose;
* introduce database migrations;
* ensure deployment is reproducible using the provided documentation.

### 00:32:20

**Team:** Understood. We'll complete the remaining functionality, update the deployment, and prepare the project for the final review.

---
