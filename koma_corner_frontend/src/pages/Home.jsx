import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { gqlRequest } from '../lib/anilistClient';
import { TRENDING_MEDIA_QUERY } from '../api/anilistQueries';
import MediaCard from '../components/MediaCard';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page shows trending media (default to ANIME). */
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['trending', 'ANIME', 1],
    queryFn: async () => {
      const perPage = 20;
      const res = await gqlRequest(TRENDING_MEDIA_QUERY, { type: 'ANIME', page: 1, perPage });
      return res?.Page;
    },
  });

  return (
    <div className="page">
      <div className="container">
        <h2 className="section-title">Trending</h2>
        {isLoading && <div className="helper">Loading trending...</div>}
        {isError && <div className="helper" style={{ color: 'var(--color-error)' }}>{String(error)}</div>}
        {!isLoading && !isError && (
          <div className="grid">
            {(data?.media ?? []).map((m) => (
              <MediaCard key={m.id} media={m} onDetails={() => {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
