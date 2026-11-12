import { NextResponse } from 'next/server';

const MAX_PAGE = 10;
const MAX_RESULTS_PER_PAGE = 20;
const NON_LOCATION_VALUES = new Set(['remote', 'hybrid', 'office', 'in-person', 'onsite', 'on-site', 'no preference']);
const VALID_SORT_OPTIONS = new Set(['date', 'salary', 'relevance']);

function positiveInteger(value, fallback, max) {
  const parsed = Number.parseInt(value || '', 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(parsed, max);
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const what = (searchParams.get('what') || '').trim().slice(0, 120);
  let where = (searchParams.get('where') || '').trim().slice(0, 120);
  const page = positiveInteger(searchParams.get('page'), 1, MAX_PAGE);
  const resultsPerPage = positiveInteger(
    searchParams.get('results_per_page'),
    5,
    MAX_RESULTS_PER_PAGE
  );
  const sortByParam = (searchParams.get('sort_by') || 'date').toLowerCase();
  const sortBy = VALID_SORT_OPTIONS.has(sortByParam) ? sortByParam : 'date';
  const fullTime = searchParams.get('full_time') === 'true';

  // Adzuna's `where` parameter is a geographic location, not a work arrangement.
  // The app's career data includes values like "Remote" and "Office"; don't
  // accidentally send those as locations and filter away otherwise relevant jobs.
  if (NON_LOCATION_VALUES.has(where.toLowerCase())) where = '';

  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;
  const country = (process.env.ADZUNA_COUNTRY || 'us').trim().toLowerCase();

  if (!appId || !apiKey) {
    return NextResponse.json(
      { error: 'Adzuna search is not configured. Check the server environment variables.' },
      { status: 503 }
    );
  }

  if (!/^[a-z]{2}$/.test(country)) {
    return NextResponse.json(
      { error: 'ADZUNA_COUNTRY must be a two-letter country code, such as us or gb.' },
      { status: 500 }
    );
  }

  if (!what) {
    return NextResponse.json(
      { error: 'Enter a job title or keyword to search.' },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: apiKey,
    what,
    results_per_page: String(resultsPerPage),
    sort_by: sortBy,
  });

  if (where) params.set('where', where);
  if (fullTime) params.set('full_time', '1');

  const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${params.toString()}`;

  try {
    const response = await fetch(adzunaUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      // Avoid relaying upstream response bodies, which may contain implementation
      // details. Keep the upstream status so configuration errors are diagnosable.
      console.error(`Adzuna returned HTTP ${response.status}`);
      return NextResponse.json(
        { error: `Adzuna could not complete the search (HTTP ${response.status}). Check the API credentials and country setting.` },
        { status: response.status >= 400 && response.status < 600 ? response.status : 502 }
      );
    }

    const data = await response.json();
    const results = (Array.isArray(data.results) ? data.results : []).map((job) => ({
      id: String(job.id || `${job.title || 'job'}-${job.company?.display_name || 'company'}`),
      title: job.title || 'Role title unavailable',
      company: job.company?.display_name || 'Company not listed',
      location: job.location?.display_name || 'Location not listed',
      description: job.description || 'No summary available for this role.',
      url: typeof job.redirect_url === 'string' && job.redirect_url.startsWith('https://')
        ? job.redirect_url
        : null,
      salaryMin: Number.isFinite(job.salary_min) ? job.salary_min : null,
      salaryMax: Number.isFinite(job.salary_max) ? job.salary_max : null,
      created: job.created || null,
      contractType: job.contract_type || null,
      category: job.category?.label || null,
    }));

    return NextResponse.json({
      results,
      count: Number.isFinite(data.count) ? data.count : results.length,
      page,
      country,
      search: { what, where },
    });
  } catch (error) {
    console.error('Adzuna fetch failed:', error);
    return NextResponse.json(
      { error: 'Could not reach Adzuna. Please try again shortly.' },
      { status: 502 }
    );
  }
}
