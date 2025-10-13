import { useState, useCallback } from "react";

const useFetch = <T = any>(cb: (...args: any[]) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  const fn = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await cb(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [cb]
  );

  return { data, loading, error, fn };
};

export default useFetch;
