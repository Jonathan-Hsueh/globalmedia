import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateMockData } from '@/app/utilities/mockData'; // Import the utility function

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Define the path to the CSV file
    const csvFilePath: string = 'data/redditdata.csv';

    if (req.method === 'POST') {
        try {
            // Parse the incoming request body
            const { entries, startDate, outputFile } = req.body;

            // Validate the input
            if (!entries || !startDate || !outputFile) {
                return res.status(400).json({ error: 'Missing required fields: entries, startDate, or outputFile' });
            }

            // Generate mock data using the utility function
            generateMockData({
                entries: parseInt(entries, 10),
                startDate: new Date(startDate),
                outputFile: csvFilePath,
            });

            // Read the generated CSV file
            const csvData = fs.readFileSync(csvFilePath, 'utf-8');

            // Return the CSV data as a response
            return res.status(200).json({
                message: 'Mock data generated successfully',
                data: csvData,
            });
        } catch (error) {
            console.error('Error generating mock data:', error);
            return res.status(500).json({ error: 'Failed to generate mock data' });
        }
    } else {
        // Handle non-POST requests
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }
}