import pandas as pd

# Read the CSV file
df = pd.read_csv('reddit_data.csv')

# Convert date string to datetime format
df['date'] = pd.to_datetime(df['date'])

# Sort by date (oldest first)
df_sorted = df.sort_values(by='date', ascending=True)

# If you want newest first instead, use ascending=False
# df_sorted = df.sort_values(by='date', ascending=False)

# Save sorted data to new CSV
df_sorted.to_csv('repubsfinal.csv', index=False)

print("Data sorted and saved to sorted_reddit_posts.csv")  
