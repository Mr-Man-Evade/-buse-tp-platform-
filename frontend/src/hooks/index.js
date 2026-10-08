/**
 * Hooks - Central export point for all custom hooks
 */

export { useAuth } from './useAuth';
export { useApiQuery, useApiMutation, useGet, usePost, usePut, useDelete } from './useApi';
export { useForm } from './useForm';
export { useLocalStorage } from './useLocalStorage';
export { default as useModal } from './useModal';

// Additional hooks
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * usePrevious Hook - Get previous value
 */
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * useAsync Hook - Handle async operations
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);
    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
      return response;
    } catch (err) {
      setError(err);
      setStatus('error');
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
};

/**
 * useDebounce Hook - Debounce value changes
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

/**
 * useThrottle Hook - Throttle value changes
 */
export const useThrottle = (value, interval) => {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
};

/**
 * useMount Hook - Run effect on component mount
 */
export const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, [callback]);
};

/**
 * useUnmount Hook - Run effect on component unmount
 */
export const useUnmount = (callback) => {
  useEffect(() => {
    return () => callback();
  }, [callback]);
};

/**
 * useWindowSize Hook - Get window dimensions
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

/**
 * useIsMobile Hook - Check if screen is mobile
 */
export const useIsMobile = (breakpoint = 768) => {
  const { width } = useWindowSize();
  return width < breakpoint;
};

/**
 * useCopyToClipboard Hook - Copy text to clipboard
 */
export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }, []);

  return { copy, isCopied };
};

/**
 * useToggle Hook - Toggle boolean state
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle, setValue];
};

/**
 * useCounter Hook - Simple counter with increment/decrement
 */
export const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);

  const increment = useCallback(() => setCount(c => c + 1), []);
  const decrement = useCallback(() => setCount(c => c - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { count, increment, decrement, reset, setCount };
};
