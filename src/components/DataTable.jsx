import React, { useState } from 'react';
import { ArrowUpDown, ChevronDown, ChevronUp, MoreHorizontal, Search } from 'lucide-react';

export default function DataTable({ columns = [], data = [], title = 'Data' }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [search, setSearch] = useState('');

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (search) {
      sortableItems = sortableItems.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
    }
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig, search]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h3 className="text-lg font-semibold text-on-background">{title}</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 rounded-lg bg-surface border border-outline-variant text-sm outline-none focus:border-primary transition-colors w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full">
          <thead className="bg-surface-container">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-secondary border-b border-outline-variant"
                >
                  {col.sortable ? (
                    <button
                      onClick={() => requestSort(col.key)}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      {col.label}
                      <ArrowUpDown className="w-4 h-4" />
                      {sortConfig.key === col.key && (
                        sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  ) : col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right border-b border-outline-variant">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {sortedData.map((row, idx) => (
              <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm text-on-background">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-right">
                  <button className="p-1 hover:bg-surface-container rounded-md transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-secondary" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
