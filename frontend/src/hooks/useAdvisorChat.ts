import { useState, useCallback } from 'react';
import { getSessionId } from '@/lib/session';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useAdvisorChat(language: string = 'en') {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/advisor/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: getSessionId(),
          message: text,
          language,
        }),
      });

      const data = await res.json();
      const assistantMsg: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMsg]);
      setSuggestions(data.suggestions || []);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [language]);

  return { messages, loading, suggestions, sendMessage };
}
