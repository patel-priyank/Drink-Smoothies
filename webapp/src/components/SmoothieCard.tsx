import { useState } from 'react';
import { Link } from 'react-router-dom';

interface SmoothieCardProps {
  smoothie: any;
  onDelete: (smoothie: any) => void;
}

const SmoothieCard = ({ smoothie, onDelete }: SmoothieCardProps) => {
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    const confirmDeletion = window.confirm(`Delete ${smoothie.title}?`);

    if (confirmDeletion) {
      try {
        setDeleting(true);

        const res = await fetch(`/api/smoothies/${smoothie.id}`, {
          method: 'DELETE'
        });

        if (!res.ok) {
          throw new Error();
        }

        onDelete(smoothie.id);
      } catch {
        alert(`Could not delete ${smoothie.title}.`);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div className={`smoothie-card ${deleting ? 'deleting' : ''}`}>
      <h3>{smoothie.title}</h3>

      <p>{smoothie.method}</p>

      <div className="footer">
        <p className="created-at">
          {new Date(smoothie.created_at).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          })}
        </p>

        <div className="buttons">
          <Link
            to={'/' + smoothie.id}
            title="Edit"
            tabIndex={deleting ? -1 : undefined}
            onClick={(e: any) => deleting && e.preventDefault()}
          >
            <i className="material-icons edit">edit</i>
          </Link>

          <button title="Delete" disabled={deleting} onClick={handleDelete}>
            <i className="material-icons delete">delete</i>
          </button>
        </div>
      </div>

      <div className="rating">{smoothie.rating}</div>
    </div>
  );
};

export default SmoothieCard;
