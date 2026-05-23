import { useState, useEffect, useRef } from "react";

function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdatedAt = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (lastUpdatedAt.current === null || now - lastUpdatedAt.current >= interval) {
      // 인터벌이 충분히 지났으면 즉시 반영 (leading edge)
      lastUpdatedAt.current = now;
      setThrottledValue(value);
    } else {
      // 인터벌 안에 들어온 변경은 남은 시간 이후에 반영 (trailing edge)
      const remaining = interval - (now - lastUpdatedAt.current);
      const timer = setTimeout(() => {
        lastUpdatedAt.current = Date.now();
        setThrottledValue(value);
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;
