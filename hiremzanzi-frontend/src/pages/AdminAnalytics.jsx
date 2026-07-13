import { useState, useEffect } from 'react';
import api from '../services/api';
import Loading from '../components/Loading';

export default function AdminAnalytics() {
  const [hits, setHits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hits')
      .then(res => setHits(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const totalHits = hits.length;

  const pathCounts = {};
  hits.forEach(h => {
    const p = h.path || '/';
    pathCounts[p] = (pathCounts[p] || 0) + 1;
  });
  const topPages = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const ipCounts = {};
  hits.forEach(h => {
    const ip = h.ipAddress || 'unknown';
    ipCounts[ip] = (ipCounts[ip] || 0) + 1;
  });
  const topIPs = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const locationCounts = {};
  hits.forEach(h => {
    const loc = [h.city, h.region, h.country].filter(Boolean).join(', ') || 'Unknown';
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  });
  const topLocations = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const today = new Date().toDateString();
  const todayHits = hits.filter(h => new Date(h.timestamp).toDateString() === today).length;

  const sorted = [...hits].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Page Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Total Page Hits</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalHits}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Today&apos;s Hits</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{todayHits}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500">Unique IPs</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{Object.keys(ipCounts).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {topPages.map(([path, count]) => (
              <div key={path} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-mono truncate max-w-[200px]">{path}</span>
                <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{count}</span>
              </div>
            ))}
            {topPages.length === 0 && <p className="text-sm text-gray-400">No data yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
          <div className="space-y-3">
            {topLocations.map(([loc, count]) => (
              <div key={loc} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 truncate max-w-[200px]">{loc}</span>
                <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{count}</span>
              </div>
            ))}
            {topLocations.length === 0 && <p className="text-sm text-gray-400">No data yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top IPs</h3>
          <div className="space-y-3">
            {topIPs.map(([ip, count]) => (
              <div key={ip} className="flex justify-between items-center">
                <span className="text-sm text-gray-700 font-mono truncate max-w-[160px]">{ip}</span>
                <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{count}</span>
              </div>
            ))}
            {topIPs.length === 0 && <p className="text-sm text-gray-400">No data yet</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Visits</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 font-medium text-gray-500">Time</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Path</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">IP Address</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Location</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.slice(0, 50).map(hit => (
                <tr key={hit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
                    {hit.timestamp ? new Date(hit.timestamp).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-3 text-gray-700 font-mono text-xs">{hit.path}</td>
                  <td className="px-6 py-3 text-gray-700 font-mono text-xs">{hit.ipAddress}</td>
                  <td className="px-6 py-3 text-gray-700">
                    {[hit.city, hit.region, hit.country].filter(Boolean).join(', ') || '-'}
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs max-w-[200px] truncate">{hit.userAgent}</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No page hits recorded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
