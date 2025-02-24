import pandas as pd
import requests
import time
import re

# Load dataset
file_path = "/Users/wavy/Documents/Internshit/dataorbit/FINAL/cleaned_complied_sample.csv"
df = pd.read_csv(file_path)

# Define neutral keywords
neutral_keywords = {"[0]", "deleted", "removed", "neutral", "a reminder that comments do need to be on-topic and engage", "NaN", "     ", "welcome to r/trumpvirus"}

# Function to call Groq's API with batch processing and rate limit handling
def groq_sentiment_batch(texts):
    api_url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {"Authorization": "Bearer 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"}
    
    few_shot_examples = """
    Here are some example sentiment scores:
    1. Economist Warns That Elon Musk Is About Cause "Deep, Deep Recession" → 0.0
    2. I was wondering someone was going explain laying off firing thousands upon thousands people is good economy. I’m waiting... → -0.8
    3. Gee I wonder who wins recession? Surely not already wealthy. I’ll never understand anyone trusts fucking billionaire. only way you make that kind money is using people.... → -0.9
    4. It's feature, not bug. He said it happen. wealthy make money bull markets, but become wealthy bear markets. He's going crash everything, buy it cheap bring back gilded age top 9% owned 75% countries wealth. → -0.7
    5. I mean, oh well. don’t know what say this point. many people bought Trump’s campaign hook, line, sinker now those people suffer most. This country likely needs hit rock bottom before it be rebuilt. → -0.9
    """
    
    numbered_texts = "\n".join([f"{i+1}. {text}" for i, text in enumerate(texts)])
    messages = [{"role": "user", "content": f"""I’m working on a sentiment analysis project. I have a set of sentences, and I need your help rating how pro- or anti-Trump each one feels. Instead of just -1 (anti) or 1 (pro), I want it to be continuous, so you can rate anywhere between -1 (strongly anti) and 1 (strongly pro), with neutral being 0. You can go up to two decimal places (e.g., -0.73 or 0.14) and don’t have to stick to rounded numbers like -0.75 or 0.25. Just go with whatever feels right. Only return a **list of numbers**, each corresponding to the numbered sentence, **nothing else**.

{few_shot_examples}

Now analyze the following statements:
{numbered_texts}"""}]
    
    data = {"model": "llama-3.2-1b-preview", "messages": messages}
    
    while True:
        try:
            response = requests.post(api_url, json=data, headers=headers)
            if response.status_code == 200:
                result = response.json()
                content = result.get('choices', [{}])[0].get('message', {}).get('content', '').strip()
                
                # Extract only numbers from response
                matches = re.findall(r"-?\d*\.\d+|-?\d+", content)
                scores = [float(match) for match in matches]
                
                # Ensure we return exactly len(texts) scores
                if len(scores) < len(texts):
                    print(f"Warning: Expected {len(texts)} scores but received {len(scores)}. Padding with None.")
                    scores.extend([None] * (len(texts) - len(scores)))
                elif len(scores) > len(texts):
                    scores = scores[:len(texts)]
                
                return scores
            elif response.status_code == 429:
                retry_time = 10
                try:
                    retry_message = response.json().get("error", {}).get("message", "")
                    retry_time = float(re.search(r"in (\d+\.\d+)s", retry_message).group(1))
                except:
                    pass
                print(f"Rate limit reached. Retrying in {retry_time} seconds...")
                time.sleep(retry_time)
            else:
                print(f"Groq API request failed with status {response.status_code}: {response.text}")
                return [None] * len(texts)
        except Exception as e:
            print(f"Error calling Groq API: {e}")
            return [None] * len(texts)

# Batch process items with a max token limit of 3100
batch_size = 5
context_data = []
for i in range(0, len(df), batch_size):
    batch = df.iloc[i:i+batch_size]
    batch_ids = batch['id'].tolist()
    batch_texts = batch['post_texts'].astype(str).tolist()
    
    # Cap total input length to prevent exceeding token limits
    total_tokens = sum(len(text.split()) for text in batch_texts)
    if total_tokens > 3100:
        batch_texts = batch_texts[:max(1, len(batch_texts) * 3100 // total_tokens)]
    
    # Apply neutral keyword check
    scores = [0.0 if any(word in text.lower() for word in neutral_keywords) or not text.strip() else None for text in batch_texts]
    texts_to_process = [text for text, score in zip(batch_texts, scores) if score is None]
    
    if texts_to_process:
        batch_scores = groq_sentiment_batch(texts_to_process)
        index = 0
        for j, score in enumerate(scores):
            if score is None and index < len(batch_scores):
                scores[j] = batch_scores[index]
                index += 1
    
    context_data.extend(zip(batch_ids, batch_texts, scores))

# Convert results into a DataFrame
final_df = pd.DataFrame(context_data, columns=["id", "text", "sentiment_score"])

# Save to CSV
final_df.to_csv("/Users/wavy/Documents/Internshit/dataorbit/FINAL/Sentimented_cleaned_complied_sample.csv", index=False)

print(final_df.head())  # Prints first few rows instead
