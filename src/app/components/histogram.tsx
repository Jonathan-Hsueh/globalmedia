'use client'
import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { PageContent } from '../components/pagecontent';
import { ChartData, ChartDataset } from '@/app/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function HistogramGraph() {
  const [histogramData, setHistogramData] = useState<ChartData>({ 
    labels: [], 
    datasets: [] 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('data/redditdata.csv');
        const text = await response.text();
        const lines = text.split('\n');
        
        // Parse sentiment values
        const sentiments = lines.slice(1)
          .map(line => {
            const parts = line.trim().split(' ');
            return parts.length === 3 ? parseFloat(parts[2]) : null;
          })
          .filter((sentiment): sentiment is number => sentiment !== null);

        // Calculate histogram bins
        const numBins = 20;
        const binWidth = 2 / numBins;
        const bins = new Array(numBins).fill(0);
        
        sentiments.forEach(sentiment => {
          const binIndex = Math.min(Math.floor((sentiment + 1) / binWidth), numBins - 1);
          bins[binIndex]++;
        });

        // Calculate normal distribution curve
        const mean = sentiments.reduce((a, b) => a + b, 0) / sentiments.length;
        const stdDev = Math.sqrt(sentiments.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / sentiments.length);
        
        // Generate curve points
        const curvePoints = Array.from({ length: 100 }, (_, i) => {
          const x = -1 + (i * 2) / 99;
          return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mean, 2) / (2 * stdDev * stdDev));
        });

        // Scale curve to match histogram
        const maxCount = Math.max(...bins);
        const maxDensity = Math.max(...curvePoints);
        const scaleFactor = maxCount / maxDensity;

        // Create labels for bins
        const histogramLabels = bins.map((_, i) => {
          const lower = -1 + i * binWidth;
          return `${lower.toFixed(1)} - ${(lower + binWidth).toFixed(1)}`;
        });

        const datasets: ChartDataset[] = [
          {
            type: 'bar',
            label: 'Frequency',
            data: bins,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            type: 'line',
            label: 'Normal Distribution',
            data: curvePoints.map(p => p * scaleFactor),
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointRadius: 0,
          }
        ];

        setHistogramData({
          labels: histogramLabels,
          datasets
        });
      } catch (err) {
        console.error('Error fetching or parsing data:', err);
      }
    };

    fetchData();
  }, []);

  const histogramOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }
    },
    scales: {
      y: {
        title: { display: true, text: 'Frequency' },
        grid: { color: 'rgba(0,0,0,0.05)' },
        beginAtZero: true
      },
      x: { 
        title: { display: true, text: 'Sentiment Range' },
        grid: { display: false } 
      }
    }
  };

  return (
    <PageContent>
      <div className="p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Sentiment Distribution Analysis
        </h1>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sentiment Histogram with Normal Distribution Curve</h3>
          <div className="h-96">
            <Chart
              type='bar'
              data={histogramData}
              options={histogramOptions}
            />
          </div>
        </div>
      </div>
    </PageContent>
  );
}

export default HistogramGraph;