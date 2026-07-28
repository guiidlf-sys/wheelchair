import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** Either a static fallback, or a function that also receives the caught error — useful to surface a real diagnostic detail to users who can't open devtools (e.g. tablets). */
  fallback: ReactNode | ((error: unknown) => ReactNode);
}

interface State {
  hasError: boolean;
  error: unknown;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    console.error('ErrorBoundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return typeof this.props.fallback === 'function' ? this.props.fallback(this.state.error) : this.props.fallback;
    }
    return this.props.children;
  }
}
