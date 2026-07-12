import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function AdminDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyEmail, setCompanyEmail] = useState('');
  const [editingEmail, setEditingEmail] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendEmail, setSendEmail] = useState('');

  useEffect(() => {
    api.get(`/applications/${id}`)
      .then(res => {
        setApplication(res.data);
        setCompanyEmail(res.data.companyEmail || '');
        setSendEmail(res.data.companyEmail || '');
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

  const handleSendEmail = () => {
    const subject = encodeURIComponent(`Job Application - ${application.vacancyTitle} at ${application.companyName}`);
    const body = encodeURIComponent(
      `Dear Hiring Manager,\n\n` +
      `Please find attached the application for the position of ${application.vacancyTitle} at ${application.companyName}.\n\n` +
      `Applicant: ${application.fullName}\n` +
      `Email: ${application.email}\n` +
      `Phone: ${application.phone || 'N/A'}\n\n` +
      `Cover Letter:\n${application.coverLetter || 'N/A'}\n\n` +
      `Best regards`
    );
    window.open(`mailto:${sendEmail}?subject=${subject}&body=${body}`, '_blank');
    setShowSendModal(false);
  };

  if (loading) return <Loading />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!application) return <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message="Application not found" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/admin" className="text-blue-600 hover:text-blue-700 text-sm mb-6 inline-block">
        &larr; Back to Applications
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{application.fullName}</h1>
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

        <div className="border-t pt-6 flex gap-3">
          <button
            onClick={() => setShowSendModal(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Send to Company
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Delete Application
          </button>
        </div>
      </div>

      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Send Application</h3>
            <p className="text-sm text-gray-600 mb-4">
              Send <strong>{application.fullName}</strong>'s application for <strong>{application.vacancyTitle}</strong> to:
            </p>
            <input
              type="email"
              value={sendEmail}
              onChange={(e) => setSendEmail(e.target.value)}
              placeholder="company@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSendModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmail}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
              >
                Open Email Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
