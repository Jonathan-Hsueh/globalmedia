// app/api/generate-mock-data/route.ts
import { NextResponse } from 'next/server';
import { generateMockData } from '@/app/utilities/mockData';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { entries, startDate, outputFile } = body;

    // Validate input
    if (!entries || !startDate || !outputFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure output directory exists
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Generate mock data
    generateMockData({
      entries: parseInt(entries, 10),
      startDate: new Date(startDate),
      outputFile,
    });

    // Verify file creation
    if (!fs.existsSync(outputFile)) {
      throw new Error('File creation failed');
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Generated ${entries} entries`,
      filePath: outputFile
    });

  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
/*
curl command for testing: 

curl -X POST http://localhost:3000/api/generate-mock-data \
  -H "Content-Type: application/json" \
  -d '{
    "entries": 100,
    "startDate": "2025-01-01",
    "outputFile": "data/redditdata.csv"
  }'
*/ 