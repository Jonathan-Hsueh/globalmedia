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
  LineElement,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { PageContent } from '../components/pagecontent';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
);

const sentimentColors = {
  positive: 'rgba(101, 116, 255, 0.8)',
  negative: 'rgba(255, 99, 132, 0.8)',
  neutral: 'rgba(75, 192, 192, 0.8)'
};

interface ChartData {
  date: string;
  upvotes: number;
  sentiment: number;
  month: string;
}

function GraphsPage() {
  const [lineData, setLineData] = useState<any>({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState<any>({ labels: [], datasets: [] });
  const [barData, setBarData] = useState<any>({ labels: [], datasets: [] });
  const [histogramData, setHistogramData] = useState<any>({ labels: [], datasets: [] });
  const [metrics, setMetrics] = useState({
    averageSentiment: 0,
    positivePercentage: 0,
    totalUpvotes: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('data/redditdata.csv');
        const text = await response.text();
        const lines = text.split('\n');
        
        const parsedData: ChartData[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line) {
            const parts = line.split(' ');
            if (parts.length !== 3) continue;
            const [date, upvotes, sentiment] = parts;
            parsedData.push({
              date,
              upvotes: parseInt(upvotes, 10),
              sentiment: parseFloat(sentiment),
              month: date.substring(0, 7),
            });
          }
        }

        // Process line chart data (sentiment trend)
        const months = [...new Set(parsedData.map(d => d.month))].sort();
        const monthlyAverages = months.map(month => {
          const monthData = parsedData.filter(d => d.month === month);
          return monthData.reduce((sum, curr) => sum + curr.sentiment, 0) / monthData.length;
        });

        // Process pie chart data (sentiment distribution)
        const positive = parsedData.filter(d => d.sentiment > 0).length;
        const negative = parsedData.filter(d => d.sentiment < 0).length;
        const neutral = parsedData.filter(d => d.sentiment === 0).length;

        // Process bar chart data (upvotes based on sentiment)
        const positiveUpvotes = months.map(month => 
          parsedData.filter(d => d.month === month && d.sentiment > 0)
            .reduce((sum, curr) => sum + curr.upvotes, 0)
        );
        const negativeUpvotes = months.map(month => 
          parsedData.filter(d => d.month === month && d.sentiment < 0)
            .reduce((sum, curr) => sum + curr.upvotes, 0)
        );

        // Calculate metrics
        const totalSentiment = parsedData.reduce((sum, curr) => sum + curr.sentiment, 0);
        const averageSentiment = totalSentiment / parsedData.length;
        const positivePercentage = (positive / parsedData.length) * 100;
        const totalUpvotes = parsedData.reduce((sum, curr) => sum + curr.upvotes, 0);

        // Create histogram bins for sentiment distribution
        const numBins = 20;
        const binWidth = 2 / numBins; // Since sentiment ranges from -1 to 1 (total range = 2)
        const bins = new Array(numBins).fill(0);
        parsedData.forEach(d => {
          let binIndex = Math.floor((d.sentiment + 1) / binWidth);
          if (binIndex >= numBins) binIndex = numBins - 1;
          bins[binIndex] += 1;
        });
        // Generate labels for each bin using midpoints
        const histogramLabels = bins.map((_, i) => {
          const lower = -1 + i * binWidth;
          const midpoint = lower + binWidth / 2;
          return midpoint.toFixed(1);
        });

        // Update state for all charts
        setLineData({
          labels: months,
          datasets: [{
            label: 'Average Sentiment',
            data: monthlyAverages,
            borderColor: sentimentColors.positive,
            backgroundColor: 'rgba(101, 116, 255, 0.2)',
            tension: 0.4,
            pointRadius: 4,
            borderWidth: 2
          }]
        });

        setPieData({
          labels: ['Positive', 'Negative', 'Neutral'],
          datasets: [{
            data: [positive, negative, neutral],
            backgroundColor: [
              sentimentColors.positive,
              sentimentColors.negative,
              sentimentColors.neutral
            ],
            borderWidth: 0,
            hoverOffset: 10
          }]
        });

        setBarData({
          labels: months,
          datasets: [
            {
              label: 'Positive Sentiment Upvotes',
              data: positiveUpvotes,
              backgroundColor: 'rgba(101, 116, 255, 0.8)',
              borderRadius: 6
            },
            {
              label: 'Negative Sentiment Upvotes',
              data: negativeUpvotes,
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
              borderRadius: 6
            }
          ]
        });

        setHistogramData({
          labels: histogramLabels,
          datasets: [
            {
              type: 'bar',
              label: 'Frequency',
              data: bins,
              backgroundColor: 'rgba(75, 192, 192, 0.8)',
              borderWidth: 1,
            },
            {
              type: 'line',
              label: 'Density Curve',
              data: bins,
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.4,
              fill: false,
              pointRadius: 0,
            }
          ]
        });

        setMetrics({
          averageSentiment,
          positivePercentage,
          totalUpvotes
        });

      } catch (error) {
        console.error('Error fetching or parsing data:', error);
      }
    };

    fetchData();
  }, []);

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }
    },
    scales: {
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        min: -1,
        max: 1,
        ticks: { stepSize: 0.5 }
      },
      x: { grid: { display: false } }
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }
    },
    scales: {
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        beginAtZero: true
      },
      x: { grid: { display: false } }
    }
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }
    }
  };

  const histogramOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: false }
    },
    scales: {
      y: {
        grid: { color: 'rgba(0,0,0,0.05)' },
        beginAtZero: true
      },
      x: { grid: { display: false } }
    }
  };

  return (
    <PageContent>
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-700 mb-8 text-center">
          Sentiment Analysis Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-700 text-lg font-semibold mb-4">Sentiment Trend</h3>
            <div className="h-full">
              <Line data={lineData} options={lineChartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-700 text-lg font-semibold mb-4">Sentiment Distribution</h3>
            <div className="h-80">
              <Pie data={pieData} options={pieChartOptions} />
            </div>
          </div>
            
            {/* Third graph: Bar chart */}
          <div className="col-span-full bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-700 text-lg font-semibold mb-4">Comparative Analysis</h3>
            <div className="flex justify-center items-center h-full w-full">
              <Bar data={barData} options={barChartOptions} />
            </div>
          </div>

          {/* Fourth graph: Histogram with curve */}
          <div className="col-span-full bg-white p-6 rounded-xl shadow-sm mt-6">
            <h3 className="text-gray-700 text-lg font-semibold mb-4">Sentiment Histogram</h3>
            <div className="flex justify-center items-center h-full w-full">
              <Bar data={histogramData} options={histogramOptions} />
            </div>
          </div>

        </div>
 

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { 
              title: 'Average Sentiment', 
              value: metrics.averageSentiment.toFixed(2), 
              color: 'bg-indigo-100' 
            },
            { 
              title: 'Positive Feedback', 
              value: `${metrics.positivePercentage.toFixed(1)}%`, 
              color: 'bg-green-100' 
            },
            { 
              title: 'Total Upvotes', 
              value: metrics.totalUpvotes.toLocaleString(), 
              color: 'bg-blue-100' 
            }
          ].map((item, i) => (
            <div key={i} className={`${item.color} p-4 rounded-lg`}>
              <p className="text-sm text-gray-600">{item.title}</p>
              <p className="text-2xl font-bold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </PageContent>
  );
}

export default GraphsPage;
