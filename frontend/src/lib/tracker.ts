import { getSessionId } from './session';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

let eventQueue: Array<{ session_id: string; event_type: string; event_data: Record<string, unknown> }> = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

async function flush() {
  if (eventQueue.length === 0) return;
  const batch = [...eventQueue];
  eventQueue = [];

  try {
    await fetch(`${API_BASE}/api/events/track/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    });
  } catch {
    // Silently fail
  }
}

export function trackEvent(eventType: string, eventData: Record<string, unknown> = {}) {
  const sessionId = getSessionId();
  if (!sessionId) return;

  eventQueue.push({ session_id: sessionId, event_type: eventType, event_data: eventData });

  // Debounce: flush every 5 seconds
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, 5000);
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flush);
}
