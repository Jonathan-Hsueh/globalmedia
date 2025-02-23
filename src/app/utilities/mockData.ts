// generate-mock-data.ts
import { writeFileSync } from 'fs';
import { format, addDays } from 'date-fns';

interface MockDataConfig {
  entries?: number;
  startDate?: Date;
  outputFile?: string;
}

// Fisher-Yates shuffle implementation
function fisherYatesShuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function generateMockData(config: MockDataConfig = {}) {
  const {
    entries = 20,
    startDate = new Date(2025, 0, 1),
    outputFile = 'mock_redditdata.csv'
  } = config;

  let currentDate = new Date(startDate);
  const dataLines: string[] = [];

  // Helper functions
  const randomInt = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  // Create sentiment pool with original distribution ratios
  const createSentimentPool = (count: number) => {
    const pool: number[] = [];
    const extremeCount = Math.round(count * 0.6);
    const moderateCount = Math.round(count * 0.3);
    const neutralCount = count - extremeCount - moderateCount;

    // Generate extreme values (both positive and negative)
    for (let i = 0; i < extremeCount; i++) {
      const sign = Math.random() < 0.5 ? -1 : 1;
      pool.push(parseFloat((sign * (0.8 + Math.random() * 0.19)).toFixed(2)));
    }

    // Generate moderate values
    for (let i = 0; i < moderateCount; i++) {
      pool.push(parseFloat((Math.random() * 1.6 - 0.8).toFixed(2)));
    }

    // Generate neutral values
    for (let i = 0; i < neutralCount; i++) {
      pool.push(parseFloat((Math.random() * 0.2 - 0.1).toFixed(2)));
    }

    return fisherYatesShuffle(pool);
  };

  // Generate shuffled sentiment values
  const sentimentPool = createSentimentPool(entries);

  // Generate data lines with shuffled sentiments
  for (let i = 0; i < entries; i++) {
    // Add random days between 1-14
    currentDate = addDays(currentDate, randomInt(1, 14));
    
    // Generate upvotes with realistic distribution
    const upvotes = randomInt(1000, 10000);
    
    // Get shuffled sentiment
    const sentiment = sentimentPool[i];
    
    // Format date
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    dataLines.push(`${dateStr} ${upvotes} ${sentiment}`);
  }

  // Write to file
  const absolutePath = 'public/data/redditdata.csv';
  writeFileSync(absolutePath, dataLines.join('\n'));
  console.log(`Generated ${entries} entries in ${outputFile}`);
}

// Execute only if run directly
if (require.main === module) {
  generateMockData({
    entries: 20,
    startDate: new Date(2025, 0, 1),
    outputFile: 'redditdata.csv'
  });
}