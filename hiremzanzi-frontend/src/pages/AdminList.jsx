import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminList({ onLogout }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    api.get('/applications')
      .then(res => setApplications(res.data))
      .catch(() => setError('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(app =>
    app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.vacancyTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const verifiedCount = applications.filter(a => a.verified).length;

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      setApplications(apps => apps.filter(a => a.id !== id));
    } catch {
      alert('Failed to delete application');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="max-w-6xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {applications.length} total &middot; {verifiedCount} verified &middot; {applications.length - verifiedCount} unverified
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            {applications.length} total
          </span>
          <button
            onClick={() => { localStorage.removeItem('hiremzanzi_admin_auth'); onLogout(); }}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, job title, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          No applications found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <div key={app.id} className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{app.fullName}</h3>
                    {app.verified ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Unverified
                      </span>
                    )}
                    <span className="text-sm text-gray-500">{app.email}</span>
                    {app.phone && <span className="text-sm text-gray-400">{app.phone}</span>}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                      {app.vacancyTitle}
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {app.companyName}
                    </span>
                    {app.cvFileName && (
                      <span className="text-sm bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        CV: {app.cvFileName}
                      </span>
                    )}
                    {app.companyEmail && (
                      <span className="text-sm bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {app.companyEmail}
                      </span>
                    )}
                  </div>

                  {app.coverLetter && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {app.coverLetter.substring(0, 200)}{app.coverLetter.length > 200 ? '...' : ''}
                    </p>
                  )}

                  <div className="text-xs text-gray-400">
                    Applied {app.createdDate ? new Date(app.createdDate).toLocaleString() : 'N/A'}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link
                    to={`/admin/${app.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
