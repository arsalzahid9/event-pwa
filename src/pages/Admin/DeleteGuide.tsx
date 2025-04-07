import { useState } from 'react';
import { deleteGuide } from '../../api/Admin/deleteGuide';

interface Guide {
  id: string;
  name: string;
}

export default function DeleteGuide({ open, onClose, guide, refreshGuides }: {
  open: boolean;
  onClose: () => void;
  guide: Guide | null;
  refreshGuides: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!guide) return;
    
    setLoading(true);
    try {
      await deleteGuide(guide.id);
      refreshGuides();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete guide');
    } finally {
      setLoading(false);
    }
  };

  if (!open || !guide) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Delete Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete guide <strong>{guide.name}</strong>?
          </p>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-gray-400 hover:bg-red-700"
            >
              {loading ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}