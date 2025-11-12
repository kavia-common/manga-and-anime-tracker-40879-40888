import React from 'react';

// PUBLIC_INTERFACE
export default function MediaCard({ media, onDetails }) {
  /**
   * Renders a media item with cover, title, and meta.
   * media: AniList media object subset
   */
  const title =
    media?.title?.userPreferred ||
    media?.title?.english ||
    media?.title?.romaji ||
    'Untitled';

  const img = media?.coverImage?.large || media?.coverImage?.medium;
  const format = media?.format || '-';
  const status = media?.status || '-';

  return (
    <div className="card">
      {img ? (
        <img className="card-media" src={img} alt={title} loading="lazy" />
      ) : (
        <div className="card-media" />
      )}
      <div className="card-body">
        <div className="card-title" title={title}>{title}</div>
        <div className="meta">{format} • {status}</div>
        <button className="btn" onClick={() => onDetails?.(media)}>Details</button>
      </div>
    </div>
  );
}
