import { useEffect, useState } from 'react';
// First, import Crown icon
import { MoreHorizontal, Plus, Edit, Trash, Users, Crown } from 'lucide-react';
import Loader from '../../components/Loader';
import { getGuides } from '../../api/Admin/getGuide';
import { Pagination } from '@mui/material';
import AddGuide from './AddGuide';
import EditGuide from './EditGuide';
import DeleteGuide from './DeleteGuide';

interface Guide {
  id: string;
  name: string;
  email: string;
  // image: string | null;
  // is_admin: string;
}

export const Guides = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDropdownGuideId, setOpenDropdownGuideId] = useState<string | null>(null);
  
  const [editGuide, setEditGuide] = useState<Guide | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  // New state for deletion modal
  const [deleteGuideModalOpen, setDeleteGuideModalOpen] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState<Guide | null>(null);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await getGuides(currentPage, 10);
      setGuides(response.data);
      setTotalPages(response.pagination.last_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [currentPage]);

  if (loading) return <Loader />;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  const handleEdit = (guide: Guide) => {
    setEditGuide(guide);
    setEditModalOpen(true);
    setOpenDropdownGuideId(null);
  };

  const handleDeleteClick = (guide: Guide) => {
    setGuideToDelete(guide);
    setDeleteGuideModalOpen(true);
    setOpenDropdownGuideId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">All Guides</h1>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Guide
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto p-4 relative">
          <table className="min-w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">NOME</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">E-MAIL</th>
                {/* <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Image</th> */}
                {/* <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Admin</th> */}
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Azioni</th>
              </tr>
            </thead>
            
            <tbody>
              {guides.length > 0 ? (
                guides.map((guide) => (
                  <tr key={guide.id} className="border-b hover:bg-gray-50 transition-colors relative">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {guide.is_admin === "1" && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                        <span className={guide.is_admin === "1" ? "text-blue-600 font-medium" : ""}>
                          {guide.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{guide.email}</td>
                    <td className="py-3 px-4 relative">
                      <button
                        onClick={() =>
                          setOpenDropdownGuideId(openDropdownGuideId === guide.id ? null : guide.id)
                        }
                        className="p-1 rounded hover:bg-gray-200"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      {openDropdownGuideId === guide.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded z-10">
                          <button
                            onClick={() => handleEdit(guide)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(guide)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Trash className="w-4 h-4 mr-2" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={48} className="text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-600 mb-1">No Guides Found</p>
                      <p className="text-sm text-gray-400">
                        Click the "Add Guide" button to create a new guide
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4 flex justify-center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, page) => setCurrentPage(page)}
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '0.875rem',
                  '&.Mui-selected': {
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* AddGuide Modal */}
      <AddGuide
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        refreshGuides={fetchGuides}
      />

      {/* EditGuide Modal */}
      <EditGuide
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        guide={editGuide}
        refreshGuides={fetchGuides}
      />

      {/* DeleteGuide Modal */}
      <DeleteGuide
        open={deleteGuideModalOpen}
        onClose={() => setDeleteGuideModalOpen(false)}
        guide={guideToDelete}
        refreshGuides={fetchGuides}
      />
    </div>
  );
};
