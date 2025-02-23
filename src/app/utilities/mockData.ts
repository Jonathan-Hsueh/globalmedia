// generate-mock-data.ts
import { writeFileSync } from 'fs';
import { format, addDays } from 'date-fns';

interface MockDataConfig {
  entries?: number;
  startDate?: Date;
  outputFile?: string;
}

export function generateMockData(config: MockDataConfig = {}) {
  const {
    entries = 20,
    startDate = new Date(2025, 0, 1), // January 1, 2025
    outputFile = 'mock_redditdata.csv'
  } = config;

  let currentDate = new Date(startDate);
  const dataLines: string[] = [];

  // Helper functions
  const randomInt = (min: number, max: number) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateSentiment = () => {
    // Generate values with tendency toward extremes
    const rand = Math.random();
    let value: number;

    if (rand < 0.6) { // 60% chance of extreme values
      const sign = Math.random() < 0.5 ? -1 : 1;
      value = sign * (0.8 + Math.random() * 0.19); // -0.99 to -0.8 or 0.8 to 0.99
    } else if (rand < 0.9) { // 30% chance of moderate values
      value = Math.random() * 1.6 - 0.8; // -0.8 to 0.8
    } else { // 10% chance of neutral values
      value = Math.random() * 0.2 - 0.1; // -0.1 to 0.1
    }

    return parseFloat(value.toFixed(2));
  };

  // Generate data lines
  for (let i = 0; i < entries; i++) {
    // Add random days between 1-14
    currentDate = addDays(currentDate, randomInt(1, 14));
    
    // Generate upvotes with realistic distribution
    const upvotes = randomInt(1000, 10000);
    
    // Generate sentiment with controlled distribution
    const sentiment = generateSentiment();
    
    // Format date
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    
    dataLines.push(`${dateStr} ${upvotes} ${sentiment}`);
  }

  // Write to file
  writeFileSync(outputFile, dataLines.join('\n'));
  console.log(`Generated ${entries} entries in ${outputFile}`);
}

// Execute only if run directly
if (require.main === module) {
  generateMockData({
    entries: 20,
    startDate: new Date(2025, 0, 1), // January 1, 2025
    outputFile: 'redditdata.csv'
  });
}