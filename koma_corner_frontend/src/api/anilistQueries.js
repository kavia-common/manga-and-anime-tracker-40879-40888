//
// Sample AniList GraphQL queries: search and trending
//

export const SEARCH_MEDIA_QUERY = `
  query SearchMedia($search: String, $type: MediaType, $sort: [MediaSort], $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(search: $search, type: $type, sort: $sort) {
        id
        title {
          userPreferred
          romaji
          english
        }
        coverImage {
          large
          medium
          color
        }
        format
        status
        type
        episodes
        chapters
        averageScore
      }
    }
  }
`;

export const TRENDING_MEDIA_QUERY = `
  query TrendingMedia($type: MediaType, $page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        perPage
        currentPage
        lastPage
        hasNextPage
      }
      media(type: $type, sort: TRENDING_DESC) {
        id
        title {
          userPreferred
          romaji
          english
        }
        coverImage {
          large
          medium
          color
        }
        format
        status
        type
        episodes
        chapters
        averageScore
      }
    }
  }
`;
