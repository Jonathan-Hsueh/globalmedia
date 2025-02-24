import { NextApiRequest, NextApiResponse } from 'next';
import { WhiteHousePost, EnhancedWhiteHousePost } from '@/app/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<EnhancedWhiteHousePost[] | { error: string }>) {
  try {
    const response = await fetch('https://www.whitehouse.gov/wp-json/wp/v2/posts?per_page=20');
    const posts: WhiteHousePost[] = await response.json();

    const enhancedData: EnhancedWhiteHousePost[] = posts.map((post) => ({
      date: post.date,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      url: post.link,
      popularity: Math.min(
        (post.comment_count / 100 + post.content.rendered.length / 5000),
        1
      )
    }));

    res.status(200).json(enhancedData);
  } catch {
    res.status(500).json({ error: 'Failed to fetch White House updates' });
  }
}