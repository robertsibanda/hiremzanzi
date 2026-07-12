import { useState, useEffect } from 'react';
import { getVacancies, getVacanciesByCategory, searchVacancies } from '../services/api';
import VacancyCard from '../components/VacancyCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ['All', 'IT', 'Finance', 'Marketing', 'Engineering', 'Healthcare', 'Education'];

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchVacancies = () => {
    setLoading(true);
    setError(null);

    if (search.trim()) {
      searchVacancies(search)
        .then((res) => setVacancies(res.data))
        .catch(() => setError('Failed to search vacancies'))
        .finally(() => setLoading(false));
    } else if (category !== 'All') {
      getVacanciesByCategory(category)
        .then((res) => setVacancies(res.data))
        .catch(() => setError('Failed to load vacancies'))
        .finally(() => setLoading(false));
    } else {
      getVacancies()
        .then((res) => setVacancies(res.data))
        .catch(() => setError('Failed to load vacancies'))
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVacancies();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Vacancies</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSearch(''); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && vacancies.length === 0 && (
        <p className="text-gray-500 text-center py-10">No vacancies found.</p>
      )}
      {!loading && !error && vacancies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vacancies.map((v) => (
            <VacancyCard key={v.id} vacancy={v} />
          ))}
        </div>
      )}
    </div>
  );
}
