import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVacanciesPaged } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  'IT & Development', 'Cleaning & Facilities', 'Finance & Accounting',
  'Marketing', 'Engineering', 'Healthcare', 'Education & Training',
  'Sales', 'Admin & Office', 'Construction', 'Transport & Logistics',
  'Hospitality & Tourism', 'Retail', 'Manufacturing', 'Security',
  'Customer Service', 'Government & NGO', 'Legal', 'Human Resources', 'Agriculture'
];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

export default function Home() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVacanciesPaged(0, 6)
      .then((res) => setVacancies(res.data.content))
      .catch(() => setError('Failed to load vacancies'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Find Your Dream Job in South Africa</h1>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Browse {800}+ job opportunities across 20 categories
          </p>
          <Link
            to="/vacancies"
            className="bg-white text-blue-700 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
          >
            Browse All Jobs
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Jobs</h2>
          <Link to="/vacancies" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all &rarr;
          </Link>
        </div>

        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && vacancies.length === 0 && (
          <p className="text-gray-500 text-center py-10">No vacancies available yet.</p>
        )}
        {!loading && !error && vacancies.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            {vacancies.map((v, i) => (
              <Link
                key={v.id}
                to="/vacancies"
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  i < vacancies.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                  {v.companyName?.charAt(0) || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{v.title}</h3>
                  <p className="text-xs text-gray-500">{v.companyName} &middot; {v.location}</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  {v.salary && (
                    <p className="text-xs text-green-700 font-medium">{v.salary}</p>
                  )}
                  <p className="text-xs text-gray-400">{timeAgo(v.createdDate)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to="/vacancies"
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-200"
              >
                <span className="text-sm font-medium text-gray-700">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
