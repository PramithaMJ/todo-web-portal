/**
 * useLocalStorage Hook
 * Type-safe hook for localStorage with JSON serialization
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting state in localStorage
 * @param key Storage key
 * @param initialValue Initial value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Allow value to be a function for same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch custom event for cross-tab synchronization
        window.dispatchEvent(
          new CustomEvent('localStorage', {
            detail: { key, value: valueToStore },
          })
        );
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      window.dispatchEvent(
        new CustomEvent('localStorage', {
          detail: { key, value: null },
        })
      );
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent) {
        if (e.key === key && e.newValue !== null) {
          try {
            setStoredValue(JSON.parse(e.newValue) as T);
          } catch (error) {
            console.error(`Error parsing storage event for key "${key}":`, error);
          }
        }
      } else if (e.detail?.key === key) {
        setStoredValue(e.detail.value as T);
      }
    };

    window.addEventListener('storage', handleStorageChange as EventListener);
    window.addEventListener('localStorage', handleStorageChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener);
      window.removeEventListener('localStorage', handleStorageChange as EventListener);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
}
