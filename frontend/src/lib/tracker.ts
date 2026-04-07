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

  // Send event to Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventType, eventData);

    // Enhanced ecommerce-style event for affiliate clicks
    if (eventType === 'click_product' || eventType === 'click_provider') {
      (window as any).gtag('event', 'select_item', {
        item_list_name: eventData.provider_name || eventData.product_type || 'unknown',
        items: [
          {
            item_id: eventData.product_id || eventData.provider_id || undefined,
            item_name: eventData.product_name || eventData.provider_name || undefined,
            item_category: eventData.product_type || eventData.category || undefined,
            item_brand: eventData.provider_name || undefined,
            affiliation: 'SmartMoney UAE',
          },
        ],
      });
    }
  }

  // Debounce: flush every 5 seconds
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, 5000);
}

export function trackRecommendationClick(
  productId: string,
  score: number,
  source: 'quiz' | 'chat' | 'comparison' | 'organic' = 'organic',
) {
  trackEvent('click_recommendation', {
    product_id: productId,
    recommendation_score: score,
    source,
  });
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flush);
}
