import { useState } from 'react';
import { createGuide } from '../../api/Admin/createGuide';

export default function AddGuide({ open, onClose, refreshGuides }: {
  open: boolean;
  onClose: () => void;
  refreshGuides: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [image, setImage] = useState<File | null>(null);
  // Remove isAdmin state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      // Remove is_admin from form data
      // if (image) formData.append('image', image);
      
      await createGuide(formData);
      refreshGuides();
      onClose();
      // Remove isAdmin from reset
      setName('');
      setEmail('');
      // setImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create guide');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Guide</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
            />
          </div> */}

          {/* Remove admin privileges checkbox section */}

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
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              {loading ? 'Adding...' : 'Add Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}