import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchSmoothie = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/smoothies/${id}`);

        if (!res.ok) {
          throw new Error();
        }

        const data = await res.json();

        setTitle(data.title);
        setMethod(data.method);
        setRating(data.rating);
      } catch {
        setError('Smoothie not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchSmoothie();
  }, [id, navigate]);

  useEffect(() => {
    setFormError(null);
  }, [title, method, rating]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!title || !method || !rating) {
      setFormError('All fields need to be filled.');
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(`/api/smoothies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          method: method.trim(),
          rating
        })
      });

      if (!res.ok) {
        throw new Error();
      }

      navigate('/');
    } catch {
      setFormError('Could not update smoothie.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page update">
      {loading && <p className="message">Loading...</p>}

      {!loading && error && <p className="error message">{error}</p>}

      {!loading && !error && (
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" maxLength={50} value={title} onChange={e => setTitle(e.target.value)} />
            <span>{title.length}/50</span>
          </div>

          <div className="form-control">
            <label htmlFor="method">Method</label>
            <textarea id="method" maxLength={250} value={method} onChange={e => setMethod(e.target.value)} />
            <span>{method.length}/250</span>
          </div>

          <div className="form-control">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              min={1}
              max={10}
              value={rating}
              onChange={e => setRating(e.target.value)}
            />
          </div>

          <button disabled={saving}>{saving ? 'Updating...' : 'Update Smoothie'}</button>

          {formError && <p className="error">{formError}</p>}
        </form>
      )}
    </div>
  );
};

export default Update;
