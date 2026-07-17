# ---- Build stage: compile drawing bundle & install lightweight-charts ----
FROM node:20-alpine AS builder
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
# Copy lightweight-charts standalone to the frontend lib dir (so it's served locally)
RUN node -e "var fs=require('fs'),path=require('path');var src=path.resolve('/build/node_modules/lightweight-charts/dist');var dst=path.resolve('/build/tickframe/frontend/lib/lightweight-charts');fs.mkdirSync(dst,{recursive:true});['lightweight-charts.standalone.production.js'].forEach(function(f){var s=path.join(src,f);if(fs.existsSync(s)){fs.copyFileSync(s,path.join(dst,f));console.log('Copied '+f);}})"
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
COPY --from=builder /build/tickframe/frontend/lib/lightweight-charts/ tickframe/frontend/lib/lightweight-charts/

EXPOSE 8080

CMD ["uvicorn", "tickframe.backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
