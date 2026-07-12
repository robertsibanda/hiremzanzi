import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-emerald-600">Hire</span>
            <span className="text-2xl font-bold text-gray-900">Mzanzi</span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/vacancies"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/vacancies'
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              All Vacancies
            </Link>
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'text-emerald-600'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
