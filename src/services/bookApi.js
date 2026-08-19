const BASE_URL = 'https://openlibrary.org';
const COVERS_URL = 'https://covers.openlibrary.org/b/id';

// Custom headers: Avoid sending a `User-Agent` header from browser environments
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
const FETCH_HEADERS = isBrowser
  ? { 'Accept': 'application/json' }
  : { 'User-Agent': 'BookScoutCapstone/1.0 (AceDominator@example.com)', 'Accept': 'application/json' };

// In-memory cache for instant loads on repeated searches/category toggles
const apiCache = new Map();

// Simple author name cache to avoid repeated author lookups
const authorCache = new Map();

async function getAuthorName(authorKey, signal) {
  if (!authorKey) return null;
  const id = String(authorKey).replace('/authors/', '').replace(/^\//, '');
  const cacheKey = `author_${id}`;
  if (authorCache.has(cacheKey)) return authorCache.get(cacheKey);

  try {
    const res = await fetch(`${BASE_URL}/authors/${id}.json`, { signal, headers: FETCH_HEADERS });
    if (!res.ok) throw new Error('Author fetch failed');
    const ad = await res.json();
    const name = ad.name || id;
    authorCache.set(cacheKey, name);
    return name;
  } catch (e) {
    // fallback to id when name not available
    authorCache.set(cacheKey, id);
    return id;
  }
}

/**
 * Normalizes raw API objects into a consistent client schema across all Open Library endpoints.
 * @param {Object} rawItem - Raw object from Open Library API.
 * @param {'grid' | 'details'} targetSize - Governs image resolution selection (-M vs -L).
 */
function normalizeBookData(rawItem, targetSize = 'grid') {
  const key = rawItem.key || '';
  const id = key.replace('/works/', '').replace('/books/', '');
  const imageSuffix = targetSize === 'details' ? 'L' : 'M';
  
  // Unified cover ID extraction across Search (cover_i), Subjects (cover_id), and Works (covers array)
  let coverId = rawItem.cover_i || rawItem.cover_id;
  
  if (!coverId && Array.isArray(rawItem.covers) && rawItem.covers.length > 0 && rawItem.covers[0] > 0) {
    coverId = rawItem.covers[0];
  }

  let coverImage = null;
  if (coverId) {
    coverImage = `${COVERS_URL}/${coverId}-${imageSuffix}.jpg`;
  }

  // Handle authors array or string formats
  let authors = ['Unknown Author'];
  if (Array.isArray(rawItem.author_name) && rawItem.author_name.length > 0) {
    authors = rawItem.author_name;
  } else if (Array.isArray(rawItem.authors) && rawItem.authors.length > 0) {
    authors = rawItem.authors.map(a => typeof a === 'string' ? a : (a.name || a.author?.key || 'Unknown Author'));
  }

  // Extract ratings
  const rating = rawItem.ratings_average ? Number(rawItem.ratings_average.toFixed(1)) : null;
  const ratingsCount = rawItem.ratings_count || null;

  // Description extraction
  let description = 'No detailed description available for this title.';
  if (typeof rawItem.description === 'string') {
    description = rawItem.description;
  } else if (rawItem.description && typeof rawItem.description.value === 'string') {
    description = rawItem.description.value;
  }

  return {
    id: id || String(Math.random()),
    rawKey: key,
    title: rawItem.title || 'Untitled Work',
    authors: authors,
    description: description,
    categories: Array.isArray(rawItem.subject) ? rawItem.subject.slice(0, 5) : [],
    coverImage: coverImage,
    publishedDate: rawItem.first_publish_year || rawItem.publish_date || 'N/A',
    publisher: Array.isArray(rawItem.publisher) ? rawItem.publisher[0] : (rawItem.publisher || 'N/A'),
    pageCount: rawItem.number_of_pages_median || rawItem.number_of_pages || null,
    language: Array.isArray(rawItem.language) ? rawItem.language[0].toUpperCase() : 'EN',
    rating: rating,
    ratingsCount: ratingsCount,
    isbn: Array.isArray(rawItem.isbn) ? rawItem.isbn[0] : null,
    externalUrl: key ? `https://openlibrary.org${key}` : 'https://openlibrary.org'
  };
}

/**
 * Searches books by keyword, title, or author.
 * Employs field limiting & in-memory caching.
 */
export async function searchBooks(query, signal) {
  if (!query || query.trim() === '') return [];
  
  const cleanQuery = query.trim().toLowerCase();
  const cacheKey = `search_${cleanQuery}`;

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const fields = 'key,title,author_name,first_publish_year,cover_i,subject,ratings_average,publisher,number_of_pages_median,language,isbn';
  
  const response = await fetch(
    `${BASE_URL}/search.json?q=${encodedQuery}&fields=${fields}&limit=20`,
    {
      signal,
      headers: FETCH_HEADERS
    }
  );
  
  if (!response.ok) {
    throw new Error(`Search request failed with status: ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.docs) return [];
  
  const results = data.docs.map(doc => normalizeBookData(doc, 'grid'));
  
  apiCache.set(cacheKey, results);
  return results;
}

/**
 * Fetch discovery books by subject genre with pagination (offset) support & caching.
 */
export async function fetchBooksByCategory(subject = 'fiction', offset = 0, limit = 12, signal) {
  const normalizedSubject = subject.toLowerCase().replace(/\s+/g, '_');
  const cacheKey = `cat_${normalizedSubject}_off${offset}_lim${limit}`;

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const response = await fetch(
    `${BASE_URL}/subjects/${normalizedSubject}.json?limit=${limit}&offset=${offset}`,
    {
      signal,
      headers: FETCH_HEADERS
    }
  );
  
  if (!response.ok) {
    throw new Error(`Category fetch failed for subject: ${subject}`);
  }
  
  const data = await response.json();
  if (!data.works) return [];
  
  const results = data.works.map((work) => normalizeBookData({
    ...work,
    author_name: work.authors ? work.authors.map(a => a.name) : ['Unknown Author']
  }, 'grid'));

  apiCache.set(cacheKey, results);
  return results;
}

/**
  Alias for fetching popular/trending books by subject.
  Signature matches: (offset, limit, signal)
 */
export async function getTrendingBooks(offset = 0, limit = 12, signal) {
  return fetchBooksByCategory('fiction', offset, limit, signal);
}


// Retrieve full details for a specific work ID .
export async function getBookDetails(workId, signal) {
  if (!workId) throw new Error('Work ID is required');
  
  const cleanId = workId.replace('/works/', '');
  const cacheKey = `details_${cleanId}`;

  if (apiCache.has(cacheKey)) {
    return apiCache.get(cacheKey);
  }

  const response = await fetch(`${BASE_URL}/works/${cleanId}.json`, {
    signal,
    headers: FETCH_HEADERS
  });
  
  if (!response.ok) {
    throw new Error(`Failed to load book details for ID: ${workId}`);
  }
  
  const data = await response.json();
  // If the work has authors with only keys, try to resolve human-readable names
  if (Array.isArray(data.authors) && data.authors.length > 0) {
    try {
      const names = await Promise.all(
        data.authors.map(async (a) => {
          const key = a.author?.key || a.key || null;
          if (!key) return null;
          // normalize to /authors/ID or ID
          const cleaned = String(key).replace(/^https?:\/\//, '').replace(/^openlibrary.org/, '').replace(/^\//, '');
          // cleaned might be like 'authors/OL24638A'; extract id portion after '/'
          const parts = cleaned.split('/');
          const id = parts.length > 1 ? parts[1] : parts[0];
          return await getAuthorName(`/authors/${id}`, signal);
        })
      );

      // attach an author_name array the normalizer knows about
      data.author_name = names.filter(Boolean);
    } catch (e) {
      // ignore and continue with whatever data we have
    }
  }

  const normalizedDetails = normalizeBookData(data, 'details');
  // If normalize produced author keys instead of names, try resolving them now
  if (Array.isArray(normalizedDetails.authors) && normalizedDetails.authors.length > 0) {
    const needResolve = normalizedDetails.authors.some(a => typeof a === 'string' && /(^\/?authors\/|^OL\w+)/i.test(a));
    if (needResolve) {
      try {
        const resolved = await Promise.all(normalizedDetails.authors.map(async (a) => {
          if (typeof a !== 'string') return a;
          // if already a readable name (contains space), keep it
          if (/\s/.test(a)) return a;
          // ensure it has /authors/ prefix
          const key = a.startsWith('/') ? a : (a.startsWith('authors/') ? `/${a}` : `/authors/${a}`);
          return await getAuthorName(key, signal);
        }));
        normalizedDetails.authors = resolved.filter(Boolean);
      } catch (e) {
        // ignore resolution errors
      }
    }
  }

  apiCache.set(cacheKey, normalizedDetails);
  return normalizedDetails;
}