import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVacancies } from '../services/api';
import VacancyCard from '../components/VacancyCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVacancies()
      .then((res) => setVacancies(res.data.slice(0, 6)))
      .catch(() => setError('Failed to load vacancies'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job</h1>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Browse through hundreds of job opportunities across South Africa
          </p>
          <Link
            to="/vacancies"
            className="bg-white text-emerald-600 px-8 py-3 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
          >
            Browse All Vacancies
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Vacancies</h2>
        {loading && <Loading />}
        {error && <ErrorMessage message={error} />}
        {!loading && !error && vacancies.length === 0 && (
          <p className="text-gray-500 text-center py-10">No vacancies available yet.</p>
        )}
        {!loading && !error && vacancies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vacancies.map((v) => (
              <VacancyCard key={v.id} vacancy={v} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
