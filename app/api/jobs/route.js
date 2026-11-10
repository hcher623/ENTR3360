import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const what = searchParams.get('what')?.trim() || '';
  const where = searchParams.get('where')?.trim() || '';
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const resultsPerPage = Math.min(20, Math.max(1, Number(searchParams.get('results_per_page') || '5')));
  const fullTime = searchParams.get('full_time') === 'true' ? '1' : null;
  const sortBy = searchParams.get('sort_by') || 'date';

  const appId = process.env.ADZUNA_APP_ID;
  const apiKey = process.env.ADZUNA_API_KEY;
  const country = process.env.ADZUNA_COUNTRY || 'us';

  if (!appId || !apiKey) {
    return NextResponse.json(
      {
        error: 'Missing Adzuna credentials. Add ADZUNA_APP_ID and ADZUNA_API_KEY to your environment variables.'
      },
      { status: 500 }
    );
  }

  if (!what && !where) {
    return NextResponse.json(
      {
        error: 'Please provide a job keyword or location to search.'
      },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    app_id: appId,
    app_key: apiKey,
    results_per_page: String(resultsPerPage),
    sort_by: sortBy,
    page: String(page),
  });

  if (what) params.set('what', what);
  if (where) params.set('where', where);
  if (fullTime) params.set('full_time', fullTime);

  const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?${params.toString()}`;

  try {
    const response = await fetch(adzunaUrl, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Adzuna request failed (${response.status}). ${errorText || 'Please check your API credentials or query.'}`
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const results = (data.results || []).map((job) => ({
      id: job.id || `${job.company?.display_name || 'job'}-${job.title || 'role'}`,
      title: job.title || 'Role title unavailable',
      company: job.company?.display_name || 'Unknown company',
      location: job.location?.display_name || 'Location unavailable',
      description: job.description || 'No summary available for this role.',
      url: job.redirect_url || '#',
      salaryMin: job.salary_min ?? null,
      salaryMax: job.salary_max ?? null,
      created: job.created || null,
      contractType: job.contract_type || null,
      category: job.category?.label || null,
      isRemote: Boolean(job.location?.display_name?.toLowerCase().includes('remote')),
    }));

    return NextResponse.json({
      results,
      count: data.count || 0,
      mean: data.mean || null,
      page,
      country,
      search: {
        what,
        where,
      },
    });
  } catch (error) {
    console.error('Adzuna fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to reach Adzuna. Please try again in a moment.'
      },
      { status: 500 }
    );
  }
}
