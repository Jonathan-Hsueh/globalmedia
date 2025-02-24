import pandas as pd
import re

def clean_csv(input_file_path, output_file_path):
    """
    Cleans a CSV file by:
      - Removing line breaks and URLs from all cells,
      - Removing gif patterns that appear in the form: "![gif](giphy|...)".
      - Dropping rows where any key text columns contain "[deleted]" or "[removed]".
      - Converting all text to lowercase.
      - Sorting the DataFrame by date in ascending order.
      
    Parameters:
      input_file_path (str): Path to input CSV file.
      output_file_path (str): Path to save cleaned CSV file.
    """
    # Read CSV file
    df = pd.read_csv(input_file_path, dtype=str)
    
    # Regular expressions:
    url_pattern = re.compile(r'https?://\S+')
    gif_pattern = re.compile(r'!\[gif\]\(giphy\|[^)]+\)')
    
    def clean_text(text):
        if pd.isna(text):
            return text
        cleaned = str(text)
        # Remove line breaks
        cleaned = cleaned.replace('\r', ' ').replace('\n', ' ')
        # Remove URLs
        cleaned = url_pattern.sub('', cleaned)
        # Remove gif patterns
        cleaned = gif_pattern.sub('', cleaned)
        # Convert text to lowercase
        cleaned = cleaned.lower()
        return cleaned.strip()
    
    # Apply cleaning to every cell in the DataFrame
    df = df.applymap(clean_text)
    
    # Function to check if a cell contains deletion markers anywhere
    def contains_deletion(cell):
        if pd.isna(cell):
            return False
        cell_lower = str(cell).lower()
        return "[deleted]" in cell_lower or "[removed]" in cell_lower
    
    # Specify the columns to check for deletion markers
    columns_to_check = ['title', 'text', 'comment1', 'comment2', 'comment3']
    
    # Create a mask for rows where any specified column contains deletion markers
    deletion_mask = df[columns_to_check].applymap(contains_deletion).any(axis=1)
    
    # Drop rows that have deletion markers in any of the key columns
    df_cleaned = df[~deletion_mask]
    
    # Convert 'date' column to datetime for proper sorting
    df_cleaned['date'] = pd.to_datetime(df_cleaned['date'], errors='coerce')
    
    # Sort the DataFrame by date in ascending order (oldest first)
    df_cleaned = df_cleaned.sort_values('date', ascending=True)
    
    # Save the cleaned DataFrame
    df_cleaned.to_csv(output_file_path, index=False, encoding='utf-8')
    print(f"Successfully cleaned and saved to {output_file_path}")

# Example usage:
clean_csv('repubsff.csv', 'rff.csv')


