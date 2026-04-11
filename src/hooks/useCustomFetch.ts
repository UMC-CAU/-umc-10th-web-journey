import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useCustomFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            setLoading(true);
            setError(false);
            try {
                const response = await axios.get<T>(url, {
                    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
                });
                setData(response.data);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}
