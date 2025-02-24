import { NextResponse } from 'next/server';
import { generateMockData } from '@/app/utilities/mockData';
import fs from 'fs';
import path from 'path';

interface RequestBody {
  entries: string;
  startDate: string;
  outputFile: string;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
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

  } catch (error) {
    console.error('Generation error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Generation failed' },
      { status: 500 }
    );
  }
}