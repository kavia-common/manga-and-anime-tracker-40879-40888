import React, { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '../lib/anilistClient';
import { SEARCH_MEDIA_QUERY } from '../api/anilistQueries';
import MediaCard from '../components/MediaCard';
import SearchFilters from '../components/SearchFilters';

function useQueryParams() {
  const location = useLocation();
  return useMemo(() => new URLSearchParams(location.search), [location.search]);
}

// PUBLIC_INTERFACE
export default function Search() {
  /** Search page: reads and writes query params ?q=, type=, sort=, page= */
  const params = useQueryParams();
  const navigate = useNavigate();

  const q = params.get('q') || '';
  const type = params.get('type') || 'ANIME';
  const sort = params.get('sort') || 'POPULARITY_DESC';
  const page = Number(params.get('page') || '1');

  const updateParams = useCallback((updates) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') {
        next.delete(k);
      } else {
        next.set(k, String(v));
      }
    });
    // Reset to page 1 when changing filters or q
    if ('q' in updates || 'type' in updates || 'sort' in updates) {
      next.set('page', '1');
    }
    navigate(`/search?${next.toString()}`, { replace: false });
  }, [params, navigate]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['search', q, type, sort, page],
    queryFn: async () => {
      const perPage = 20;
      const res = await gqlRequest(SEARCH_MEDIA_QUERY, {
        search: q || null,
        type,
        sort: [sort],
        page,
        perPage,
      });
      return res?.Page;
    },
    enabled: Boolean(q) || true, // allow empty to show nothing or popular if needed
    keepPreviousData: true,
  });

  const pageInfo = data?.pageInfo;
  const media = data?.media ?? [];

  return (
    <div className="page">
      <div className="container" style={{ display: 'grid', gap: 14 }}>
        <h2 className="section-title">Search</h2>
        <SearchFilters
          initialQ={q}
          initialType={type}
          initialSort={sort}
          onChange={({ q: nextQ, type: nextType, sort: nextSort }) => {
            updateParams({ q: nextQ, type: nextType, sort: nextSort });
          }}
        />
        {isLoading && <div className="helper">Loading results...</div>}
        {isError && <div className="helper" style={{ color: 'var(--color-error)' }}>{String(error)}</div>}
        {!isLoading && !isError && (
          <>
            <div className="row">
              <span className="helper">{pageInfo?.total ?? 0} results</span>
              <div className="spacer" />
              <div className="row">
                <button
                  className="btn"
                  disabled={!pageInfo?.hasPreviousPage && page <= 1}
                  onClick={() => updateParams({ page: Math.max(1, page - 1) })}
                >
                  Prev
                </button>
                <span className="helper">Page {pageInfo?.currentPage ?? page} / {pageInfo?.lastPage ?? '-'}</span>
                <button
                  className="btn"
                  disabled={!pageInfo?.hasNextPage}
                  onClick={() => updateParams({ page: (pageInfo?.currentPage || page) + 1 })}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="grid">
              {media.map((m) => (
                <MediaCard key={m.id} media={m} onDetails={() => {}} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
