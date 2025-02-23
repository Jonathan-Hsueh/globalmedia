'use client'
import { useState, useEffect } from 'react';
import { motion, Variants, Transition } from 'framer-motion';
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

const KEYWORDS = ['Trump', 'Politics', 'elonmusk', 'Trumpvirus', 'Economics'];
const COLORS = [
  'from-pink-500 to-purple-500',
  'from-cyan-500 to-blue-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-amber-500',
  'from-red-500 to-orange-500'
];

function Sentiment() {
  const [subreddit, setSubreddit] = useState('');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const floatVariants: Variants = {
    initial: { y: 0, x: 0, rotate: 0 },
    float: (i: number) => ({
      y: [0, -60, 0],
      x: Math.random() * 60 - 30,
      rotate: Math.random() * 4 - 2,
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut'
      } as Transition
    })
  };

  // Keep existing fetchSubredditPosts and handleScroll functions

  const fetchSubredditPosts = async (keyword: string, newSearch = true) => {
    const currentPage = newSearch ? 1 : page + 1;
    setSubreddit(keyword);
    if (!keyword) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${keyword}/hot.json?limit=50&count=${currentPage * 50}`
      );

      if (!response.ok) throw new Error('Failed to fetch subreddit');
      
      const data = await response.json();
      if (data.data.children.length === 0) {
        throw new Error('No posts found or invalid subreddit');
      }
      
      setPosts(prev => newSearch ? data.data.children : [...prev, ...data.data.children]);
      setPage(currentPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    fetchSubredditPosts(subreddit, false);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);

  return (
    <PageContent>
      <div className="min-h-screen bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500/30 blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-cyan-500/30 blur-[100px]" />
        </div>

        <div className="relative z-10 container mx-auto p-4">
          <div className="text-center mb-12 pt-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              Reddit Political Sentiment
            </motion.h1>

            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {KEYWORDS.map((keyword) => (
                  <motion.button
                    key={keyword}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchSubredditPosts(keyword)}
                    className={`px-5 py-2.5 rounded-full text-base font-medium
                              bg-gradient-to-r ${COLORS[KEYWORDS.indexOf(keyword) % COLORS.length]}
                              text-white shadow-xl hover:shadow-2xl transition-all`}
                  >
                    #{keyword}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 p-4">
            {posts.map((post, i) => (
              <motion.a
                key={`${post.data.id}-${i}`}
                href={`https://reddit.com${post.data.permalink}`}
                target="_blank"
                rel="noopener noreferrer"
                custom={i}
                variants={floatVariants}
                initial="initial"
                animate="float"
                whileHover={{ 
                  scale: 1.1,
                  zIndex: 50,
                  transition: { duration: 0.2 }
                }}
                className={`relative p-4 rounded-xl shadow-2xl cursor-pointer 
                          bg-gradient-to-br ${COLORS[i % COLORS.length]}
                          hover:shadow-glow transition-all duration-300
                          w-64 h-64 flex flex-col aspect-square`}
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-black/20">
                    <span className="text-white font-bold text-xs">R</span>
                  </div>
                  <span className="text-xs font-medium text-white/80">
                    u/{post.data.author}
                  </span>
                </div>
                <h3 className="font-semibold mb-3 line-clamp-4 text-white text-sm flex-1">
                  {post.data.title}
                </h3>
                <div className="flex justify-between text-xs text-white/60">
                  <span>⬆️ {post.data.score}</span>
                  <span>💬 {post.data.num_comments}</span>
                </div>
              </motion.a>
            ))}
          </div>

          {loading && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
            </div>
          )}
        </div>
      </div>
    </PageContent>
  );
}

// Keep existing fetchSubredditPosts, handleScroll, and useEffect implementations

export default Sentiment;