import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
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
          <h1 className="text-display-lg font-bold text-gray-900 mb-4">Something went wrong</h1>
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
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

export default appWithTranslation(App);
