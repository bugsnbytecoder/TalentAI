'use client';

import { Provider } from 'react-redux';

import { Store } from '@/services';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={Store}>{children}</Provider>;
}
