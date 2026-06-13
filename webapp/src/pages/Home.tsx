import { useEffect, useState } from 'react';

import SmoothieCard from '../components/SmoothieCard';

const Home = () => {
  const defaultAscending = { created_at: false, title: true, rating: false };

  const orderFields = [
    { field: 'created_at', label: 'Time created' },
    { field: 'title', label: 'Title' },
    { field: 'rating', label: 'Rating' }
  ];

  const [smoothies, setSmoothies] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [orderByAsc, setOrderByAsc] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSmoothies = async () => {
      try {
        setLoading(true);

        setSmoothies(null);
        setError(null);

        const res = await fetch(`/api/smoothies?orderBy=${orderBy}&ascending=${orderByAsc}`, {
          signal: controller.signal
        });

        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();

        setSmoothies(data);
        setError(null);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;

        setSmoothies(null);
        setError('Could not fetch smoothies.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchSmoothies();

    return () => controller.abort();
  }, [orderBy, orderByAsc]);

  const handleOrderBy = (field: string) => {
    if (field === orderBy) {
      setOrderByAsc(prev => !prev);
    } else {
      setOrderBy(field);
      setOrderByAsc(defaultAscending[field as keyof typeof defaultAscending]);
    }
  };

  const handleDelete = (id: any) => {
    setSmoothies((prev: any) => prev.filter((s: any) => s.id !== id));
  };

  return (
    <div className="page home">
      <div className="smoothies">
        <div className="order-by">
          <p>Order by</p>

          <div className="buttons">
            {orderFields.map(({ field, label }) => {
              const isActive = orderBy === field;
              const ascending = isActive ? orderByAsc : defaultAscending[field as keyof typeof defaultAscending];

              return (
                <button key={field} className={isActive ? 'active' : ''} onClick={() => handleOrderBy(field)}>
                  <span>{label}</span>
                  <i className="material-icons">{ascending ? 'arrow_downward' : 'arrow_upward'}</i>
                </button>
              );
            })}
          </div>
        </div>

        {loading && <p className="message">Loading...</p>}

        {error && <p className="error message">{error}</p>}

        {smoothies && smoothies.length === 0 && <p className="message">No smoothies yet.</p>}

        {smoothies && smoothies.length > 0 && (
          <div className="smoothie-grid">
            {smoothies.map((smoothie: any) => (
              <SmoothieCard key={smoothie.id} smoothie={smoothie} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
