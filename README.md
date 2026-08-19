
# BookScout

A lightweight React + Vite app that searches and explores books using the Open Library API. Shows search results, discovery/category lists, and detailed book pages with community ratings, publication info, and cover images.

## Setup Instructions

- **Prerequisites:** Node.js 18+ and npm (or pnpm/yarn).
- **Clone:**
  - `git clone <repo-url>`
  - `cd bookscout`
- **Install:**
  - `npm install`
- **Run (development):**
  - `npm run dev`
- **Build (production):**
  - `npm run build`
- **Preview build:**
  - `npm run preview`

### Where to Look

- **Start page:** Open the local development URL shown by Vite.
- **Main source:** `src`
- **Components:** `src/components`
- **Views:** `src/views`
- **API helpers:** `src/bookApi.js`

## API Used & Endpoints

### API Provider

[Open Library](https://openlibrary.org)

**Base URL:**

`https://openlibrary.org`

### Search Books

**Endpoint:**

```text
GET https://openlibrary.org/search.json?q={query}&fields={fields}&limit={n}
````

Example fields the app requests:

```text
key
title
author_name
first_publish_year
cover_i
subject
ratings_average
publisher
number_of_pages_median
language
isbn
```

The endpoint returns search results in `docs[]`.

The app normalizes fields for use in the UI:

* `first_publish_year` → `publishedDate`
* `ratings_average` → `rating`

### Work Details

**Endpoint:**

```text
GET https://openlibrary.org/works/{workId}.json
```

Used to fetch full book descriptions, covers, and additional metadata for the details view.

### Subject Discovery

**Endpoint:**

```text
GET https://openlibrary.org/subjects/{subject}.json?limit={n}&offset={offset}
```

Used to populate the Home page and category discovery grids.

### Author Lookup

**Endpoint:**

```text
GET https://openlibrary.org/authors/{authorId}.json
```

Used when work objects contain author keys rather than human-readable author names.

### Covers

**Base URL:**

```text
https://covers.openlibrary.org/b/id/{coverId}-{size}.jpg
```

Available sizes:

* `S` — Small
* `M` — Medium
* `L` — Large

The app uses `M` for book grids and `L` for book details.

## How the App Merges Data

Search results often include community ratings and first publication year, while the details endpoint may omit some of these fields.

The app normalizes and combines data from multiple sources. Where possible, missing UI fields are filled from cached search results or navigation state.

This allows the details page to display information such as:

* Community Rating
* Published Year
* Publisher

even while the details request is loading.

## Features

* Search for books
* Browse book discovery/category lists
* View book covers
* View detailed book pages
* View book descriptions
* View authors
* View publication information
* View publishers
* View community ratings
* View additional book metadata
* Responsive React interface
* Open Library API integration
* No API key required

## Project Structure

```text
src/
├── components/
├── views/
└── bookApi.js
```

* `components/` — Reusable UI components
* `views/` — Application pages and views
* `bookApi.js` — Open Library API helpers

## Quick Usage / Test Steps

### 1. Run the Development Server

```bash
npm run dev
```

### 2. Search for a Book

Open the application and use the search bar.

Verify that search results display:

* Book title
* Author
* Cover image
* Community rating
* Publication year

### 3. View Book Details

Click on a book from the search or discovery results.

Verify that the details page displays:

* Book title
* Cover image
* Description
* Author
* Community Rating
* Published year
* Publisher

The app uses cached/search data as a fallback when some fields are not returned by the details endpoint.

## Troubleshooting

### Details Show `N/A`

If the details page shows `N/A` for information such as the rating or publication year after directly navigating to a details URL:

1. Return to the search or discovery page.
2. Search for the book.
3. Open the book from the results.

The app can use the search result as a fallback when the detailed work endpoint does not provide certain fields.

A hard refresh of a details URL may cause this fallback data to be unavailable if it was not previously cached.

### CORS or Network Errors

BookScout uses the public Open Library API.

If API requests fail:

1. Open the browser's developer tools.
2. Check the **Network** and **Console** tabs.
3. Verify that requests to Open Library are succeeding.
4. Check whether the API is temporarily rate-limiting requests.
5. Try again after a short period.

No API key is required for the endpoints used by the application.

## Credits

### Data

Book data is provided by [Open Library](https://openlibrary.org).

### Icons

UI icons are provided by `lucide-react`.

## AUTHOR

Amos Kiplangat

```
```
