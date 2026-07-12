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

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {vacancy.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}
