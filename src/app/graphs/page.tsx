'use client'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

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

function GraphsPage() {
  // Sentiment timeline data
  const dates = ['2023-01', '2023-02', '2023-03', '2023-04', '2023-05', '2023-06'];
  const sentimentData = [4.2, 3.8, 4.5, 3.2, 4.1, 3.9]; // Sentiment scores (0-5 scale)

  const lineChartData = {
    labels: dates,
    datasets: [{
      label: 'Sentiment Score',
      data: sentimentData,
      borderColor: sentimentColors.positive,
      backgroundColor: 'rgba(101, 116, 255, 0.2)',
      tension: 0.4,
      pointRadius: 4,
      borderWidth: 2
    }]
  };

  // Sentiment distribution data
  const pieChartData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      data: [45, 35, 20],
      backgroundColor: [
        sentimentColors.positive,
        sentimentColors.negative,
        sentimentColors.neutral
      ],
      borderWidth: 0,
      hoverOffset: 10
    }]
  };

  // Comparative analysis data
  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [{
      label: 'Positive Sentiment',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(101, 116, 255, 0.8)',
      borderRadius: 6
    },
    {
      label: 'Negative Sentiment',
      data: [35, 41, 20, 19, 44, 45],
      backgroundColor: 'rgba(255, 99, 132, 0.8)',
      borderRadius: 6
    }]
  };

  const chartOptions = {
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
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Sentiment Analysis Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sentiment Trend</h3>
          <div className="h-80">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
          <div className="h-80">
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </div>

        <div className="col-span-full bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Comparative Analysis</h3>
          <div className="h-96">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Modern annotation boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {[
          { title: 'Average Sentiment', value: '4.1/5.0', color: 'bg-indigo-100' },
          { title: 'Positive Feedback', value: '78%', color: 'bg-green-100' },
          { title: 'Response Rate', value: '92%', color: 'bg-blue-100' }
        ].map((item, i) => (
          <div key={i} className={`${item.color} p-4 rounded-lg`}>
            <p className="text-sm text-gray-600">{item.title}</p>
            <p className="text-2xl font-bold text-gray-800">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GraphsPage;