import pandas as pd

# Load the cleaned CSV with sentiment scores
cleaned_file_path = "/Users/wavy/Documents/Internshit/dataorbit/FINAL/Sentimented_cleaned_complied_sample.csv"  # Update this path after you run sentiment analysis
cleaned_df = pd.read_csv(cleaned_file_path)

# Load the original uncleaned CSV
original_file_path = "/Users/wavy/Documents/Internshit/dataorbit/FINAL/complied_sample.csv"
original_df = pd.read_csv(original_file_path)

# Extract title index from the ID column in cleaned CSV
cleaned_df["title_index"] = cleaned_df["id"].apply(lambda x: int(x.split("-")[0]))  # Extract 'a' from 'a-b'

# Create a dictionary mapping (id → sentiment_score)
sentiment_mapping = dict(zip(cleaned_df["id"], cleaned_df["sentiment_score"]))

# Insert sentiment scores next to respective columns
original_df.insert(original_df.columns.get_loc("title") + 1, "sentiment_title", None)
for i in range(1, 11):
    comment_col = f"comment{i}"
    sentiment_col = f"sentiment_comment{i}"
    if comment_col in original_df.columns:
        original_df.insert(original_df.columns.get_loc(comment_col) + 1, sentiment_col, None)

# Assign sentiment scores
for index, row in original_df.iterrows():
    title_id = f"{index+1}-0"  # Title ID in the cleaned CSV
    original_df.at[index, "sentiment_title"] = sentiment_mapping.get(title_id, None)  # Map title sentiment

    for i in range(1, 11):  # Iterate through comments
        comment_id = f"{index+1}-{i}"
        sentiment_col = f"sentiment_comment{i}"
        if sentiment_col in original_df.columns:
            original_df.at[index, sentiment_col] = sentiment_mapping.get(comment_id, None)  # Map comment sentiment

# Save the updated dataset
output_merged_path = "/Users/wavy/Documents/Internshit/dataorbit/FINAL/complied_sample_sentiment.csv"
original_df.to_csv(output_merged_path, index=False)

# Provide the download link
output_merged_path
