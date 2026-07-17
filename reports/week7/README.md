# Week 7 Report — ML Dual-Model Integration

## Scope

The `feature/dtdb-numba-optimization` branch delivers the DT/DB detector
integration and performance work for the ML microservice:

- H&S and DT/DB XGBoost detectors run from one `/predict` request.
- The response identifies the producing detector and reports processing times.
- DT/DB feature order, classes, thresholds, NMS, and candle minimum are
  documented and implemented.
- Numba accelerates extrema selection, with a portable fallback and startup
  warmup.

## Traceability

- [PBI-134 / Issue #226](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/226)
- [DOC / Issue #227](https://github.com/Fedos113/SWP_TickFrame_28_team/issues/227)
- [Architecture report](../../docs/architecture/dtdb-integration-decisions.md)
- [Assignment 7 context](../../assignments/7/context.md)
- [Architecture index](../../docs/architecture/README.md)
- [Dual-model CLI](../../ml_service/app/test_dual_model_cli.py)

## Verification

Python syntax compilation, feature-contract checks, linter checks, and
whitespace validation passed. After Numba warmup, the shared feature pipeline
processed 10,000 synthetic candles in approximately 49 ms on Windows.

Full Docker/CI endpoint verification and review are pending. No PR or release
has been created yet, and the changes have not been merged to `main`.

## Artifact and Privacy Notes

The report contains no credentials, private links, customer-identifying data,
or presentation artifacts. Synthetic candles were used for performance
verification.
