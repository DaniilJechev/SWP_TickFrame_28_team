from __future__ import annotations

import logging
import os
from typing import Any

import httpx

LOGGER = logging.getLogger("tickframe.ml_client")

ML_API_URL = os.getenv("ML_API_URL", "http://ml-service:8001/predict")
ML_CONFIDENCE_THRESHOLD = float(os.getenv("ML_CONFIDENCE_THRESHOLD", "0.60"))
ML_REQUEST_TIMEOUT = float(os.getenv("ML_REQUEST_TIMEOUT", "30.0"))


class MlClient:
    def __init__(self, predict_url: str = ML_API_URL, timeout: float = ML_REQUEST_TIMEOUT):
        primary = predict_url.rstrip("/")
        self._urls = [primary]
        fallback = "http://127.0.0.1:8001/predict"
        if primary != fallback:
            self._urls.append(fallback)
        self._timeout = timeout
        self._client = httpx.AsyncClient(timeout=timeout)

    async def aclose(self) -> None:
        await self._client.aclose()

    async def analyze_candles(
        self,
        symbol: str,
        timeframe: str,
        candles: list[dict[str, Any]],
        threshold: float | None = None,
    ) -> list[dict[str, Any]]:
        if len(candles) < 99:
            LOGGER.warning("Not enough candles for ML analysis: %s (min 99)", len(candles))
            return []

        threshold = threshold if threshold is not None else ML_CONFIDENCE_THRESHOLD

        payload = {
            "timeframe": timeframe,
            "symbol": symbol,
            "candles": candles,
        }

        for url in self._urls:
            try:
                response = await self._client.post(url, json=payload)
                response.raise_for_status()
                data = response.json()
            except httpx.ConnectError:
                LOGGER.warning("ML service unreachable at %s", url)
                continue
            except httpx.TimeoutException:
                LOGGER.warning("ML request timed out after %ss", self._timeout)
                return []
            except httpx.HTTPStatusError as exc:
                LOGGER.warning("ML returned status %s: %s", exc.response.status_code, exc.response.text)
                return []
            except Exception as exc:
                LOGGER.warning("ML request failed: %s", exc)
                return []
            else:
                patterns = data.get("patterns_found", [])
                filtered = [p for p in patterns if p.get("confidence", 0) >= threshold]
                LOGGER.info(
                    "ML analysis: %d patterns found, %d above threshold %.2f",
                    len(patterns),
                    len(filtered),
                    threshold,
                )
                return filtered

        LOGGER.warning("All ML URLs exhausted, service unavailable")
        return []
