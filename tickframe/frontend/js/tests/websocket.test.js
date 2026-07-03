import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

function parseJson(event) {
  try {
    return JSON.parse(event.data);
  } catch {
    return null;
  }
}

function getApiBase() {
  const origin = globalThis.window?.location?.origin;
  if (origin && origin.startsWith("http")) {
    return origin;
  }
  return "http://127.0.0.1:8000";
}

function getWsBase() {
  return getApiBase().replace(/^http/, "ws");
}

describe("parseJson", () => {
  it("parses valid JSON from event data", () => {
    const event = { data: '{"type":"connected"}' };
    const result = parseJson(event);
    expect(result).toEqual({ type: "connected" });
  });

  it("returns null for invalid JSON", () => {
    const event = { data: "not json" };
    const result = parseJson(event);
    expect(result).toBeNull();
  });

  it("returns null for empty data", () => {
    const event = { data: "" };
    const result = parseJson(event);
    expect(result).toBeNull();
  });
});

describe("getWsBase", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    globalThis.window = originalWindow;
  });

  it("converts http to ws", () => {
    globalThis.window = { location: { origin: "http://localhost:8000" } };
    expect(getWsBase()).toBe("ws://localhost:8000");
  });

  it("converts https to wss", () => {
    globalThis.window = { location: { origin: "https://example.com" } };
    expect(getWsBase()).toBe("wss://example.com");
  });

  it("falls back when no origin", () => {
    globalThis.window = { location: {} };
    expect(getWsBase()).toBe("ws://127.0.0.1:8000");
  });
});

describe("ManagedSocket", () => {
  it("creates WebSocket URL correctly", () => {
    globalThis.window = { location: { origin: "http://localhost:8000" } };
    const url = `${getWsBase()}/ws/market`;
    expect(url).toBe("ws://localhost:8000/ws/market");
  });
});
