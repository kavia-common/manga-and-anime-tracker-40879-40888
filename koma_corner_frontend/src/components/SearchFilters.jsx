import React, { useEffect, useMemo, useState } from 'react';

// PUBLIC_INTERFACE
export default function SearchFilters({ initialQ = '', initialType = 'ANIME', initialSort = 'POPULARITY_DESC', onChange }) {
  /**
   * Search filters with debounced query input (300ms), type and sort select.
   * Emits { q, type, sort } via onChange.
   */
  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState(initialType);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => setQ(initialQ), [initialQ]);
  useEffect(() => setType(initialType), [initialType]);
  useEffect(() => setSort(initialSort), [initialSort]);

  const debounced = useDebouncedValue(q, 300);

  useEffect(() => {
    onChange?.({ q: debounced, type, sort });
  }, [debounced, type, sort, onChange]);

  return (
    <div className="filters">
      <div className="row">
        <input
          className="input"
          type="text"
          placeholder="Search by title..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search query"
        />
      </div>
      <div className="row">
        <label className="helper" htmlFor="type">Type</label>
        <select id="type" className="select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="ANIME">Anime</option>
          <option value="MANGA">Manga</option>
        </select>

        <label className="helper" htmlFor="sort">Sort</label>
        <select id="sort" className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="POPULARITY_DESC">Popularity</option>
          <option value="SCORE_DESC">Score</option>
        </select>
      </div>
    </div>
  );
}

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}
