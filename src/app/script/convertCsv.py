import praw
from textblob import TextBlob  # or use vaderSentiment if preferred
import datetime

# Set up your Reddit API credentials (you need to register an app on Reddit)
reddit = praw.Reddit(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    user_agent='YOUR_USER_AGENT'
)

# Choose a subreddit or a set of posts
subreddit = reddit.subreddit('example_subreddit')  # replace with your subreddit of choice

# Iterate over a selection of posts (e.g., top 10 hot posts)
for post in subreddit.hot(limit=10):
    # Extract post creation date
    post_date = datetime.datetime.fromtimestamp(post.created_utc)
    
    # Extract upvotes (score)
    upvotes = post.score
    
    # Ensure all comments are loaded (including nested ones)
    post.comments.replace_more(limit=None)
    all_comments = post.comments.list()
    
    # Calculate sentiment for each comment using TextBlob
    sentiment_scores = []
    for comment in all_comments:
        # Sometimes there can be 'more comments' placeholders; skip those
        if hasattr(comment, 'body'):
            # Compute the polarity (range: -1.0 to 1.0)
            sentiment = TextBlob(comment.body).sentiment.polarity
            sentiment_scores.append(sentiment)
    
    # Calculate the average sentiment score for the post's comments
    avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0

    # Output the results
    print(f"Post Title: {post.title}")
    print(f"Date: {post_date}")
    print(f"Upvotes: {upvotes}")
    print(f"Average Comment Sentiment: {avg_sentiment:.3f}")
    print("-" * 40)
