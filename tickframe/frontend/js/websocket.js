const FALLBACK_HTTP_ORIGIN = "http://127.0.0.1:8000";

function getApiBase() {
  const origin = window.location.origin;
  if (origin && origin.startsWith("http")) {
    return origin;
  }
  return FALLBACK_HTTP_ORIGIN;
}

function getWsBase() {
  return getApiBase().replace(/^http/, "ws");
}

function parseJson(event) {
  try {
    return JSON.parse(event.data);
  } catch {
    return null;
  }
}

class ManagedSocket {
  constructor(url, handlers = {}) {
    this.url = url;
    this.handlers = handlers;
    this.socket = null;
    this.reconnectDelayMs = Number(handlers.reconnectDelayMs || 5000);
    this.shouldReconnect = true;
    this.reconnectTimer = null;
  }

  connect() {
    this.shouldReconnect = true;
    this.clearReconnectTimer();
    this.close(false);
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      console.log("[WS] connected", this.url);
      this.handlers.onStatus?.("online");
    };
    this.socket.onclose = () => {
      console.warn("[WS] disconnected", this.url);
      this.handlers.onStatus?.("offline");
      this.scheduleReconnect();
    };
    this.socket.onerror = (event) => {
      console.error("[WS] error", this.url, event);
      this.handlers.onStatus?.("offline");
    };
    this.socket.onmessage = (event) => {
      const payload = parseJson(event);
      if (!payload) {
        console.warn("[WS] unable to parse payload", this.url, event.data);
        return;
      }
      this.handlers.onMessage?.(payload);
    };
    return this.socket;
  }

  close(allowReconnect = false) {
    this.shouldReconnect = allowReconnect;
    this.clearReconnectTimer();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  scheduleReconnect() {
    if (!this.shouldReconnect || this.reconnectTimer) {
      return;
    }
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      console.log("[WS] reconnecting", this.url);
      this.connect();
    }, this.reconnectDelayMs);
  }

  clearReconnectTimer() {
    if (!this.reconnectTimer) {
      return;
    }
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }
}

window.ManagedSocket = ManagedSocket;
window.MarketSocket = class MarketSocket extends ManagedSocket {
  constructor(handlers = {}) {
    super(`${getWsBase()}/ws/market`, handlers);
  }
};
window.CandleSocket = class CandleSocket extends ManagedSocket {
  constructor(symbol, interval, limit, handlers = {}) {
    const query = new URLSearchParams({ interval, limit: String(limit) });
    super(`${getWsBase()}/ws/candles/${encodeURIComponent(symbol)}?${query.toString()}`, handlers);
  }
};
window.apiBaseUrl = function () {
  return getApiBase();
};
