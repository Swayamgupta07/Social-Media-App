'use client';

import { useEffect, useState } from 'react';
import { Subject } from '../lib/reactive';

// Custom hook for connecting ViewModels to React components
export function useObservable<T>(observable: Subject<T>): T {
  const [value, setValue] = useState<T>(observable.value);
  
  useEffect(() => {
    const unsubscribe = observable.subscribe(setValue);
    return unsubscribe;
  }, [observable]);
  
  return value;
}