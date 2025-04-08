import { useState, useEffect } from 'react';
import { getGuideEditDetail } from '../../api/Admin/getGuideEditDetail';
import { updateGuideEditDetail } from '../../api/Admin/updateGuideEditDetail';

interface Guide {
  id: string;
  name: string;
  email: string;
  // image: string | null;
}

export default function EditGuide({ open, onClose, guide, refreshGuides }: {
  open: boolean;
  onClose: () => void;
  guide: Guide | null;
  refreshGuides: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // const [existingImage, setExistingImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuideDetails = async () => {
      if (guide && open) {
        try {
          const response = await getGuideEditDetail(guide.id);
          setName(response.data.name);
          setEmail(response.data.email);
          // setExistingImage(response.data.image);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load guide details');
        }
      }
    };

    fetchGuideDetails();
  }, [open, guide]); // Run when modal opens or guide changes

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guide) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      // if (image) formData.append('image', image);
      
      await updateGuideEditDetail(guide.id, formData);
      refreshGuides();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update guide');
    } finally {
      setLoading(false);
    }
  };

  if (!open || !guide) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Guide</h2>
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
            {existingImage && !image && (
              <img
                src={existingImage}
                alt="Current profile"
                className="mt-2 h-20 w-20 object-cover rounded"
              />
            )}
          </div> */}

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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}