import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    try {
        const response = await fetch(
        "https://www.whitehouse.gov/wp-json/wp/v2/posts?per_page=10"
        );
        const posts = await response.json();
    
        const enhancedData = posts.map((post: any) => ({
            date: post.date,
            title: post.title.rendered,
            excerpt: post.excerpt.rendered,
            url: post.link,
            popularity: Math.min(
                post.comment_count / 100 + post.content.rendered.length / 5000,
                1
            ),
        }));
        
        res.status(200).json(enhancedData);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch White House updates" });
    }
}
