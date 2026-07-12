import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminDetail({ onLogout }) {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyEmail, setCompanyEmail] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then(res => {
        setApplication(res.data);
        setCompanyEmail(res.data.companyEmail || '');
      })
      .catch(() => setError('Failed to load application'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSaveEmail = async () => {
    setSaving(true);
    try {
      await api.put(`/applications/${id}/company-email`, { companyEmail });
      setApplication(prev => ({ ...prev, companyEmail }));
      setEditingEmail(false);
    } catch {
      alert('Failed to save email');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      window.location.href = '/admin';
    } catch {
      alert('Failed to delete application');
    }
  };

  const handleSendToCompany = async () => {
    if (!application.companyEmail) {
      alert('Please set a company email first.');
      return;
    }
    setSending(true);
    setSendResult(null);
    try {
      const res = await api.post(`/applications/${id}/send`);
      setSendResult({ success: true, message: res.data.message });
    } catch (err) {
      setSendResult({ success: false, message: err.response?.data?.error || 'Failed to send email' });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!application) return <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message="Application not found" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/admin" className="text-blue-600 hover:text-blue-700 text-sm">
          &larr; Back to Applications
        </Link>
        <button
          onClick={() => { localStorage.removeItem('hiremzanzi_admin_auth'); onLogout(); }}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-gray-900">{application.fullName}</h1>
              {application.verified ? (
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Unverified
                </span>
              )}
            </div>
            <p className="text-gray-500">{application.email}</p>
            {application.phone && <p className="text-gray-400 text-sm">{application.phone}</p>}
          </div>
          <span className="text-xs text-gray-400">
            Applied {application.createdDate ? new Date(application.createdDate).toLocaleString() : 'N/A'}
          </span>
        </div>

        <div className="border-t pt-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Position</p>
              <p className="font-medium text-gray-900">{application.vacancyTitle}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500 mb-1">Company</p>
              <p className="font-medium text-gray-900">{application.companyName}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cover Letter</h2>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {application.coverLetter || 'No cover letter provided.'}
            </p>
          </div>
        </div>

        <div className="border-t pt-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resume</h2>
          {application.cvFileName ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{application.cvFileName}</span>
              <a
                href={`/api/applications/${application.id}/cv`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
              >
                Download CV
              </a>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No CV uploaded</p>
          )}
        </div>

        <div className="border-t pt-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Email</h2>
          <div className="flex items-center gap-3">
            {editingEmail ? (
              <>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  placeholder="company@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  onClick={handleSaveEmail}
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditingEmail(false); setCompanyEmail(application.companyEmail || ''); }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="text-gray-700">{application.companyEmail || 'Not set'}</span>
                <button
                  onClick={() => setEditingEmail(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        {sendResult && (
          <div className={`border-t pt-6 mb-6`}>
            <div className={`rounded-lg p-4 text-sm ${sendResult.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              {sendResult.message}
            </div>
          </div>
        )}

        <div className="border-t pt-6 flex gap-3">
          <button
            onClick={handleSendToCompany}
            disabled={sending || !application.companyEmail}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending...' : 'Send to Company'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Delete Application
          </button>
        </div>
      </div>
    </div>
  );
}
