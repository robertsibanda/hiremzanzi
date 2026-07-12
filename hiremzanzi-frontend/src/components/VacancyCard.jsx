import { Link } from 'react-router-dom';

export default function VacancyCard({ vacancy }) {
  const isExpired = vacancy.expiryDate && new Date(vacancy.expiryDate) < new Date();

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 ${
      isExpired ? 'border-gray-300 opacity-60' : 'border-emerald-500'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
          {vacancy.title}
        </h3>
        {isExpired && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Expired</span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-2">{vacancy.companyName}</p>
      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{vacancy.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {vacancy.category && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
            {vacancy.category}
          </span>
        )}
        {vacancy.location && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {vacancy.location}
          </span>
        )}
        {vacancy.salary && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
            {vacancy.salary}
          </span>
        )}
      </div>
      <Link
        to={`/vacancies/${vacancy.id}`}
        className="inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
      >
        View Details &rarr;
      </Link>
    </div>
  );
}
