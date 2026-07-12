import { useState, useEffect, useCallback } from 'react';
import { getVacanciesPaged } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  'All', 'IT & Development', 'Cleaning & Facilities', 'Finance & Accounting',
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

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const expiry = new Date(dateStr);
  const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Closes today';
  if (diff === 1) return 'Closes tomorrow';
  return `${diff} days left`;
}

export default function Vacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const PAGE_SIZE = 15;

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    const catParam = category === 'All' ? null : category;
    const titleParam = search.trim() || null;

    getVacanciesPaged(page, PAGE_SIZE, catParam, titleParam)
      .then((res) => {
        setVacancies(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
        if (res.data.content.length > 0 && !selectedId) {
          setSelectedId(res.data.content[0].id);
        }
      })
      .catch(() => setError('Failed to load vacancies'))
      .finally(() => setLoading(false));
  }, [page, category, search, selectedId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setPage(0);
    setSelectedId(null);
  }, [category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    setSearchInput('');
    setSearch('');
    setPage(0);
    setSelectedId(null);
  };

  const selectedVacancy = vacancies.find(v => v.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Search and filters */}
      <div className="mb-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search job titles, companies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Find Jobs
          </button>
        </form>

        {/* Category pills - horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results header */}
      {!loading && !error && (
        <p className="text-sm text-gray-500 mb-3">
          {totalElements} {totalElements === 1 ? 'job' : 'jobs'} found
          {category !== 'All' && <> in <span className="font-medium text-gray-700">{category}</span></>}
          {search && <> matching "<span className="font-medium text-gray-700">{search}</span>"</>}
        </p>
      )}

      {error && <ErrorMessage message={error} />}

      {/* Main content: split view */}
      <div className="flex gap-0 border border-gray-200 rounded-lg overflow-hidden bg-white" style={{height: 'calc(100vh - 240px)', minHeight: '500px'}}>
        {/* LEFT: Job list */}
        <div className={`${showMobileDetail ? 'hidden md:flex' : 'flex'} flex-col border-r border-gray-200 w-full md:w-[420px] flex-shrink-0`}>
          {loading ? (
            <div className="flex-1 flex items-center justify-center"><Loading /></div>
          ) : vacancies.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">No vacancies found</div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {vacancies.map((v) => {
                  const isSelected = v.id === selectedId;
                  const expiryText = daysUntil(v.expiryDate);
                  const isExpired = expiryText === 'Expired';

                  return (
                    <div
                      key={v.id}
                      onClick={() => { setSelectedId(v.id); setShowMobileDetail(true); }}
                      className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border-l-4 border-l-blue-600'
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0 mt-0.5">
                          {v.companyName?.charAt(0) || '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`text-sm font-semibold leading-tight ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                            {v.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">{v.companyName}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{v.location}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            {v.salary && (
                              <span className="text-xs text-green-700 bg-green-50 px-1.5 py-0.5 rounded">
                                {v.salary}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-xs text-gray-400">{timeAgo(v.createdDate)}</span>
                            {expiryText && (
                              <span className={`text-xs ${isExpired ? 'text-red-500' : 'text-gray-400'}`}>
                                {' '}&middot; {expiryText}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    &larr; Prev
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {page + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT: Job detail */}
        <div className={`${showMobileDetail ? 'flex' : 'hidden md:flex'} flex-col flex-1 min-w-0`}>
          {selectedVacancy ? (
            <div className="flex-1 overflow-y-auto">
              {/* Mobile back button */}
              <button
                onClick={() => setShowMobileDetail(false)}
                className="md:hidden w-full text-left px-4 py-2 text-sm text-blue-600 border-b border-gray-200 font-medium"
              >
                &larr; Back to list
              </button>

              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-lg font-bold flex-shrink-0">
                    {selectedVacancy.companyName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedVacancy.title}</h2>
                    <p className="text-sm text-gray-500">{selectedVacancy.companyName}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedVacancy.category && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {selectedVacancy.category}
                    </span>
                  )}
                  {selectedVacancy.location && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                      {selectedVacancy.location}
                    </span>
                  )}
                  {selectedVacancy.salary && (
                    <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                      {selectedVacancy.salary}
                    </span>
                  )}
                </div>

                {/* Job info grid */}
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-400 block">Company</span>
                    <span className="text-gray-700 font-medium">{selectedVacancy.companyName}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <span className="text-xs text-gray-400 block">Location</span>
                    <span className="text-gray-700 font-medium">{selectedVacancy.location}</span>
                  </div>
                  {selectedVacancy.createdDate && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-400 block">Posted</span>
                      <span className="text-gray-700 font-medium">
                        {new Date(selectedVacancy.createdDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  {selectedVacancy.expiryDate && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <span className="text-xs text-gray-400 block">Closes</span>
                      <span className="text-gray-700 font-medium">
                        {new Date(selectedVacancy.expiryDate).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Job Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {selectedVacancy.description || 'No description provided.'}
                  </p>
                </div>

                {/* Requirements */}
                {selectedVacancy.requirements && selectedVacancy.requirements.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Requirements</h3>
                    <ul className="space-y-1.5">
                      {selectedVacancy.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact info */}
                {(selectedVacancy.contactEmail || selectedVacancy.contactWebsite) && (
                  <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wide">Contact</h3>
                    {selectedVacancy.contactEmail && (
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <a href={`mailto:${selectedVacancy.contactEmail}`} className="text-blue-600 hover:text-blue-700">{selectedVacancy.contactEmail}</a>
                      </div>
                    )}
                    {selectedVacancy.contactWebsite && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <a href={`https://${selectedVacancy.contactWebsite}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">{selectedVacancy.contactWebsite}</a>
                      </div>
                    )}
                  </div>
                )}

                {/* Apply button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a job to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
