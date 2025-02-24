import { ChartData as ChartJSData, ChartDataset as ChartJSDataset } from 'chart.js';

// WhiteHouse News Post Interface
export interface WhiteHousePost {
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  link: string;
  comment_count: number;
}

export interface EnhancedWhiteHousePost {
  date: string;
  title: string;
  excerpt: string;
  url: string;
  popularity: number;
}

// Chart Data Interfaces
export interface ChartDataset {
  type?: 'line' | 'bar' | 'pie';
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  tension?: number;
  fill?: boolean;
  pointRadius?: number;
  hoverOffset?: number;
  borderRadius?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

// Specific Chart Type Interfaces
export interface LineChartData extends ChartJSData<'line', number[], string> {
  datasets: ChartJSDataset<'line', number[]>[];
}

export interface BarChartData extends ChartJSData<'bar', number[], string> {
  datasets: ChartJSDataset<'bar', number[]>[];
}

export interface PieChartData extends ChartJSData<'pie', number[], string> {
  datasets: ChartJSDataset<'pie', number[]>[];
}

// Reddit Data Interfaces
export interface RedditDataPoint {
  date: string;
  upvotes: number;
  sentiment: number;
  month: string;
}

export interface SentimentMetrics {
  averageSentiment: number;
  positivePercentage: number;
  totalUpvotes: number;
}