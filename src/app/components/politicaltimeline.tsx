'use client';
import { useRef } from 'react';
import useSWR from 'swr';

type TimelineEvent = {
  date: string;
  title: string;
  excerpt: string;
  url: string;
  popularity: number;
};

// Replace with your NewsAPI key
const NEWS_API_KEY = 'b950f4a331314baa9be26a74e241008c';
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=trump&pageSize=15&apiKey=${NEWS_API_KEY}`;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type NewsAPIArticle = {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};

// Update the transformNewsData function signature
const transformNewsData = (articles: NewsAPIArticle[]): TimelineEvent[] => {
  return articles.map((article) => ({
    date: article.publishedAt,
    title: article.title,
    excerpt: article.description || '',
    url: article.url,
    popularity: Math.random(),
  }));
};

export default function PoliticalTimeline() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch data and refresh every 24 hours (86400000 milliseconds)
  const { data, error } = useSWR(NEWS_API_URL, fetcher, {
    refreshInterval: 86400000, // Refresh every 24 hours
    revalidateOnFocus: false, // Don't refresh on window focus
  });

  const transformedData = data ? transformNewsData(data.articles) : [];

  return (
    <section className="relative h-[600px] bg-gray-50 overflow-hidden isolate">
      {/* Simplified USA Map Background */}
      <svg
        viewBox="0 0 1200 800"
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        aria-hidden="true"
      >
        <path
          d="M120 40 L220 100 L300 60 L400 120 L500 80 L600 140 L700 100 L800 160 L900 120 L1000 180 L1100 140 L1200 200"
          className="stroke-gray-300 fill-none"
          strokeWidth="2"
        />
        {/* Add more path elements for state outlines */}
      </svg>

      {/* Scrollable Timeline */}
      <div
        ref={scrollRef}
        className="flex h-full gap-8 px-8 pb-12 overflow-x-auto scroll-snap-x-mandatory snap-center"
      >
        {error && (
          <div className="flex items-center justify-center w-full h-full">
            <p className="text-red-500">Failed to load news updates</p>
          </div>
        )}

        {!data && !error &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-80 snap-center">
              <div className="h-full p-6 bg-white rounded-xl shadow-lg animate-pulse">
                <div className="h-4 mb-4 bg-gray-200 rounded w-1/3" />
                <div className="h-6 mb-4 bg-gray-200 rounded w-2/3" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                  <div className="h-3 bg-gray-200 rounded w-4/6" />
                </div>
                <div className="flex gap-4 mt-6">
                  <div className="w-24 h-8 bg-gray-200 rounded-lg" />
                  <div className="w-20 h-2 bg-gray-200 rounded-full mt-3" />
                </div>
              </div>
            </div>
          ))}

        {transformedData.map((event) => (
          <article
            key={event.url}
            className="relative flex-shrink-0 w-80 snap-center group"
          >
            <div className="absolute inset-0 transition-transform -translate-x-4 -translate-y-4 bg-blue-50/50 group-hover:translate-x-0 group-hover:translate-y-0" />

            <div className="relative h-full p-6 bg-white shadow-lg rounded-xl transition-all duration-300 group-hover:shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <time className="text-sm font-medium text-gray-500">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-800">
                  {event.popularity > 0.5 ? 'Trending' : 'Recent'}
                </span>
              </div>

              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                {event.title}
              </h3>

              <p
                className="mb-4 text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: event.excerpt }}
              />

              <div className="flex items-center justify-between mt-auto">
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-lg text-cyan-800 bg-cyan-50 hover:bg-cyan-100"
                >
                  Read Article
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Impact:</span>
                  <div className="relative w-20 h-1.5 bg-gray-200 rounded-full">
                    <div
                      className="absolute h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(event.popularity * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>


      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-4">
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
          aria-label="Scroll left"
        >
          ←
        </button>
        <button
          onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
          aria-label="Scroll right"
        >
          →
        </button>
      </div>
    </section>
  );
}