import { NextResponse } from 'next/server';

const NEWS_API_KEY = 'b950f4a331314baa9be26a74e241008c';
const NEWS_API_URL = `https://newsapi.org/v2/everything?q=trump&pageSize=15`;

export async function GET() {
  try {
    const response = await fetch(NEWS_API_URL, {
      headers: {
        'X-Api-Key': NEWS_API_KEY,
      },
      next: {
        revalidate: 3600 // Revalidate every hour
      }
    });

    if (!response.ok) {
      throw new Error(`News API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
}