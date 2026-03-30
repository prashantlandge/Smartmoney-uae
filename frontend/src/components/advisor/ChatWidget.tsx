import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAdvisorChat } from '@/hooks/useAdvisorChat';

export default function ChatWidget() {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, suggestions, sendMessage } = useAdvisorChat(locale || 'en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestion = (text: string) => {
    sendMessage(text);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 end-6 z-50 w-14 h-14 bg-brand-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-brand-primary/90 transition-all hover:scale-105"
        aria-label="Open chat"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 end-6 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col" style={{ maxHeight: '70vh' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-brand-primary text-white rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full" />
          <span className="text-sm font-semibold">{t('chat_title')}</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3" style={{ minHeight: 200, maxHeight: 400 }}>
        {messages.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500 mb-3">{t('chat_placeholder')}</p>
            <div className="space-y-2">
              {(t('chat_suggestions', { returnObjects: true }) as string[] || []).map((suggestion: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(suggestion)}
                  className="block w-full text-start px-3 py-2 text-xs bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-brand-primary text-white rounded-se-none'
                  : 'bg-gray-100 text-gray-800 rounded-ss-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-3 py-2 rounded-lg rounded-ss-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        {/* Follow-up suggestions */}
        {suggestions.length > 0 && !loading && messages.length > 0 && (
          <div className="space-y-1">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(s)}
                className="block w-full text-start px-2 py-1.5 text-xs bg-brand-primary/5 rounded-lg hover:bg-brand-primary/10 text-brand-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat_placeholder')}
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-brand-primary text-white rounded-lg text-sm disabled:opacity-50 hover:bg-brand-primary/90 transition-colors"
          >
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
