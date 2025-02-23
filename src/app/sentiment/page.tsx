'use client'
import { useState } from 'react';
import { PageContent } from '../components/pagecontent';

interface RedditPost {
  data: {
    id: string;
    title: string;
    author: string;
    score: number;
    num_comments: number;
    url: string;
    permalink: string;
    created_utc: number;
  };
}

function Sentiment() {
  const [subreddit, setSubreddit] = useState('');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSubredditPosts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subreddit) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=100`
      );

      if (!response.ok) throw new Error('Failed to fetch subreddit');
      
      const data = await response.json();
      if (data.data.children.length === 0) {
        throw new Error('No posts found or invalid subreddit');
      }
      
      setPosts(data.data.children);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <PageContent>
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Subreddit Sentiment Analyzer</h1>
          
          <form onSubmit={fetchSubredditPosts} className="flex gap-4 mb-4">
            <input
              type="text"
              value={subreddit}
              onChange={(e) => setSubreddit(e.target.value)}
              placeholder="Enter subreddit name..."
              className="flex-1 p-2 border rounded-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Loading...' : 'Analyze'}
            </button>
          </form>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.data.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h2 className="text-lg font-semibold mb-2">{post.data.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>Author: u/{post.data.author}</div>
                  <div>Score: {post.data.score}</div>
                  <div>Comments: {post.data.num_comments}</div>
                  <div>
                    <a
                      href={`https://reddit.com${post.data.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Post
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContent>
    </div>
  );
}

export default Sentiment;