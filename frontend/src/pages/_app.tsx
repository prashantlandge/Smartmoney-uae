import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import '@/styles/globals.css';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center font-sans">
          <h1 className="text-display-lg font-bold text-brand-dark mb-4">Something went wrong</h1>
          <p className="text-body-sm text-gray-500 mb-4">{this.state.error}</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: '' }); window.location.reload(); }}
            className="btn-primary"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <motion.div
          key={router.asPath}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <Component {...pageProps} />
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default appWithTranslation(App);
