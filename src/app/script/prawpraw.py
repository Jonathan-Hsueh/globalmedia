import praw
import pandas as pd
import time
import datetime


# Reddit API setup
reddit = praw.Reddit(
    client_id="gMivq5e65aDdYlCfGSCg4w",
    client_secret="GgTMYQTocEE7QRROFMj1jrZN8VJLaA",
    user_agent="script:reddit_scraper:v1.0 (by /u/Prestigious-Day6297)"
)


def get_posts_with_comments(subreddits, post_limit=500, comment_limit=5):
    # Initialize an empty list to store post data
    posts_data = []
   
    # Define the target date range (UTC)
    start_date = datetime.datetime(2025, 1, 20, 0, 0, 0)
    end_date = datetime.datetime(2025, 2, 20, 23, 59, 59)
    start_timestamp = start_date.timestamp()
    end_timestamp = end_date.timestamp()
   
    # Loop through each subreddit
    for subreddit_name in subreddits:
        # Try to access the subreddit and retrieve posts
        try:

            # Access the subreddit
            subreddit = reddit.subreddit(subreddit_name)
            print(f"Scraping r/{subreddit_name}...")
            count = 0
           
            # Use the 'month' filter to retrieve posts from roughly the past month.
            # We fetch extra posts (limit set to post_limit*2) to account for those outside the date range.
            for submission in subreddit.top(time_filter='month', limit=post_limit*2):
                if count >= post_limit:
                    break
               
                if start_timestamp <= submission.created_utc <= end_timestamp:
                    # Format the post's creation date
                    post_date = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(submission.created_utc))
                   
                    # Initialize dictionary with post details
                    post_dict = {
                        "subreddit": subreddit_name,
                        "date": post_date,
                        "title": submission.title,
                        "text": submission.selftext,
                        "scorepost": submission.score
                    }
                   
                    # Set default empty values for comment and score columns
                    for i in range(1, comment_limit+1):
                        post_dict[f"comment{i}"] = ""
                        post_dict[f"scorecomment{i}"] = ""
                   
                    # Load comments and remove "MoreComments" objects
                    submission.comments.replace_more(limit=0)
                   
                    # Sort top-level comments by score (highest first)
                    comments = sorted(submission.comments, key=lambda c: c.score, reverse=True)
                   
                    # Get up to 'comment_limit' comments
                    for i, comment in enumerate(comments[:comment_limit], start=1):
                        # Replace newlines to keep CSV cell integrity
                        post_dict[f"comment{i}"] = comment.body.replace('\n', ' ').strip()
                        post_dict[f"scorecomment{i}"] = comment.score
                   
                    posts_data.append(post_dict)
                    count += 1
                   
                    # Brief pause to respect rate limits
                    time.sleep(1)
                   
            print(f"Collected {count} posts from r/{subreddit_name}.")
        except Exception as e:
            print(f"Error scraping r/{subreddit_name}: {str(e)}")
   
    return posts_data


if __name__ == "__main__":
    # Target subreddits
    SUBREDDITS = ['US_Politics']
   
    # Retrieve posts with comments
    posts_data = get_posts_with_comments(SUBREDDITS, post_limit=500, comment_limit=5)
   
    # Save the results to a CSV file with the desired columns
    df = pd.DataFrame(posts_data)
    df.to_csv("reddit_data.csv", index=False)
    print(f"Saved {len(posts_data)} posts to reddit_data.csv")



