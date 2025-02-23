import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    // Define the path to the CSV file
    const csvFilePath: string = 'data/redditdata.csv';
    
}