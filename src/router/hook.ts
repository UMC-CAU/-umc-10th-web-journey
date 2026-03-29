import { useState, useEffect } from 'react';
import { getCurrentPath } from './utils';

export const useCurrentPath = () => {
  const [path, setPath] = useState(getCurrentPath());

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(getCurrentPath());
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return path;
};