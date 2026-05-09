import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            setStoredValue(prev => {
                const valueToStore = value instanceof Function ? value(prev) : value;
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
                window.dispatchEvent(new Event('auth-storage-change'));
                return valueToStore;
            });
        } catch (error) {
            console.error(error);
        }
    }, [key]);

    const removeValue = useCallback(() => {
        try {
            setStoredValue(() => {
                window.localStorage.removeItem(key);
                window.dispatchEvent(new Event('auth-storage-change'));
                return initialValue;
            });
        } catch (error) {
            console.error(error);
        }
    }, [key, initialValue]);

    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const item = window.localStorage.getItem(key);
                setStoredValue(item ? JSON.parse(item) : initialValue);
            } catch (error) {
                console.error(error);
            }
        };

        window.addEventListener('auth-storage-change', handleStorageChange);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('auth-storage-change', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue] as const;
}
