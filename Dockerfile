# ---- Build stage: compile drawing bundle ----
FROM node:20-alpine AS builder
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY tickframe/frontend/js/drawing-overlay-src.js tickframe/frontend/js/
RUN npx esbuild tickframe/frontend/js/drawing-overlay-src.js \
    --bundle --format=iife --global-name=DrawingLib \
    --outfile=tickframe/frontend/js/drawing-bundle.js

# ---- Runtime stage ----
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY --from=builder /build/tickframe/frontend/js/drawing-bundle.js tickframe/frontend/js/drawing-bundle.js

EXPOSE 8080

CMD ["uvicorn", "tickframe.backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
