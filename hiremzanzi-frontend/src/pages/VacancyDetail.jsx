import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVacancyById } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function VacancyDetail() {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVacancyById(id)
      .then((res) => setVacancy(res.data))
      .catch(() => setError('Failed to load vacancy'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message={error} /></div>;
  if (!vacancy) return <div className="max-w-4xl mx-auto px-4 py-8"><ErrorMessage message="Vacancy not found" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/vacancies" className="text-emerald-600 hover:text-emerald-700 text-sm mb-6 inline-block">
        &larr; Back to Vacancies
      </Link>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{vacancy.title}</h1>
            <p className="text-lg text-gray-500">{vacancy.companyName}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {vacancy.category && (
            <span className="text-sm bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
              {vacancy.category}
            </span>
          )}
          {vacancy.location && (
            <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {vacancy.location}
            </span>
          )}
          {vacancy.salary && (
            <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              {vacancy.salary}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-gray-600">
          {vacancy.createdDate && (
            <div><span className="font-medium">Posted:</span> {new Date(vacancy.createdDate).toLocaleDateString()}</div>
          )}
          {vacancy.expiryDate && (
            <div><span className="font-medium">Expires:</span> {new Date(vacancy.expiryDate).toLocaleDateString()}</div>
          )}
        </div>

        <div className="border-t pt-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {vacancy.description || 'No description provided.'}
          </p>
        </div>

        {vacancy.requirements && vacancy.requirements.length > 0 && (
          <div className="border-t pt-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-2">
              {vacancy.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(vacancy.contactEmail || vacancy.contactWebsite) && (
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {vacancy.contactEmail && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${vacancy.contactEmail}`} className="text-blue-600 hover:text-blue-700">
                    {vacancy.contactEmail}
                  </a>
                </div>
              )}
              {vacancy.contactWebsite && (
                <div className="flex items-center gap-2 text-sm">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={`https://${vacancy.contactWebsite}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    {vacancy.contactWebsite}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
