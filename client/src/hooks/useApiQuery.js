import { useState, useEffect } from 'react';

export function useApiQuery(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fn().then((res) => { if (mounted) setData(res); }).catch((e) => { if (mounted) setError(e); }).finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error };
}

export default useApiQuery;
