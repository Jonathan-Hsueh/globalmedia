import pandas as pd

# Load the CSV file
file_path = "/Users/wavy/Documents/Internshit/dataorbit/FINAL/complied_sample.csv"  # Change this to your actual file path
df = pd.read_csv(file_path)

# Identify relevant columns
title_column = "title"
comment_columns = [col for col in df.columns if col.startswith("comment")]

# Prepare data for new CSV
new_data = []

# Iterate over rows and restructure the data
for index, row in df.iterrows():
    title_id = index + 1  # Titles are numbered from 1 to total number of titles
    
    # Add title with id
    new_data.append([f"{title_id}-0", row[title_column]])
    
    # Add comments with respective ids
    for i, comment_col in enumerate(comment_columns, start=1):
        new_data.append([f"{title_id}-{i}", row[comment_col]])

# Create a new DataFrame
new_df = pd.DataFrame(new_data, columns=["id", "post_texts"])

# Save cleaned data
output_file_path = "/Users/wavy/Documents/Internshit/dataorbit/FINAL/cleaned_complied_sample.csv"  # Change this to desired output path
new_df.to_csv(output_file_path, index=False)

print(f"Cleaned CSV saved to {output_file_path}")
