import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { matingService, type MatingPair } from '../api/matingService';
import ErrorMessage from '../components/ErrorMessage';
import ConfirmDialog from '../components/ConfirmDialog';

type SortField = 'startDate' | 'status' | 'ram' | 'ewe';
type SortOrder = 'asc' | 'desc';
type StatusFilter = 'all' | MatingPair['status'];

const ITEMS_PER_PAGE = 10;

const MatingPairs: React.FC = () => {
  const navigate = useNavigate();
  const [matingPairs, setMatingPairs] = useState<MatingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortField, setSortField] = useState<SortField>('startDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pairToDelete, setPairToDelete] = useState<MatingPair | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchMatingPairs();
  }, []);

  const fetchMatingPairs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await matingService.getAllMatingPairs();
      setMatingPairs(data);
    } catch (err) {
      console.error('Error fetching mating pairs:', err);
      setError('Failed to load mating pairs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (pair: MatingPair) => {
    setPairToDelete(pair);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pairToDelete) return;

    try {
      setDeletingId(pairToDelete.id);
      await matingService.deleteMatingPair(pairToDelete.id);
      setMatingPairs(pairs => pairs.filter(pair => pair.id !== pairToDelete.id));
    } catch (err) {
      console.error('Error deleting mating pair:', err);
      setError('Failed to delete mating pair. Please try again.');
    } finally {
      setDeletingId(null);
      setShowDeleteDialog(false);
      setPairToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setPairToDelete(null);
  };

  const getStatusColor = (status: MatingPair['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAndSortedPairs = useMemo(() => {
    return matingPairs
      .filter(pair => {
        const matchesSearch = searchTerm === '' || 
          pair.ram?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pair.ewe?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pair.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || pair.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'startDate':
            comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            break;
          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;
          case 'ram':
            comparison = (a.ram?.name || '').localeCompare(b.ram?.name || '');
            break;
          case 'ewe':
            comparison = (a.ewe?.name || '').localeCompare(b.ewe?.name || '');
            break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [matingPairs, searchTerm, statusFilter, sortField, sortOrder]);

  const paginatedPairs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedPairs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedPairs, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPairs.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Ram', 'Ewe', 'Start Date', 'End Date', 'Status', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedPairs.map(pair => [
        pair.ram?.name || '',
        pair.ewe?.name || '',
        new Date(pair.startDate).toLocaleDateString(),
        pair.endDate ? new Date(pair.endDate).toLocaleDateString() : '',
        pair.status,
        pair.notes || ''
      ].map(field => `"${field.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `mating-pairs-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mating Pairs</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Export CSV
          </button>
          <button
            onClick={() => navigate('/mating/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create New Mating Pair
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchMatingPairs} />}

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by ram, ewe, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {filteredAndSortedPairs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No mating pairs found.</p>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 sm:px-6">
              <div className="flex items-center text-sm font-medium text-gray-500">
                <button
                  onClick={() => handleSort('ram')}
                  className="flex-1 text-left hover:text-gray-700"
                >
                  Ram {sortField === 'ram' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('ewe')}
                  className="flex-1 text-left hover:text-gray-700"
                >
                  Ewe {sortField === 'ewe' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('startDate')}
                  className="flex-1 text-left hover:text-gray-700"
                >
                  Start Date {sortField === 'startDate' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('status')}
                  className="flex-1 text-left hover:text-gray-700"
                >
                  Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <div className="w-24"></div>
              </div>
            </div>
            <ul className="divide-y divide-gray-200">
              {paginatedPairs.map((pair) => (
                <li key={pair.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-lg font-medium text-gray-900 truncate">
                            {pair.ram?.name} × {pair.ewe?.name}
                          </p>
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(pair.status)}`}>
                            {pair.status}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <p>
                            Started: {new Date(pair.startDate).toLocaleDateString()}
                            {pair.endDate && ` • Ended: ${new Date(pair.endDate).toLocaleDateString()}`}
                          </p>
                        </div>
                        {pair.notes && (
                          <p className="mt-2 text-sm text-gray-500">{pair.notes}</p>
                        )}
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => navigate(`/mating/${pair.id}/edit`)}
                          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(pair)}
                          disabled={deletingId === pair.id}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deletingId === pair.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedPairs.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredAndSortedPairs.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          page === currentPage
                            ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Mating Pair"
        message={`Are you sure you want to delete the mating pair between ${pairToDelete?.ram?.name} and ${pairToDelete?.ewe?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        type="danger"
      />
    </div>
  );
};

export default MatingPairs; 