
import { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const DonationChart = ({
  type = 'line',
  data = {},
  options = {},
  className = '',
  height = 300,
  ...props
}) => {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  // Default data if not provided
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Blood Donations',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(220, 38, 38, 0.2)',
        borderColor: 'rgb(220, 38, 38)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Funding (BDT)',
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  }

  // Default options
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7280',
          font: {
            family: "'Poppins', sans-serif"
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          family: "'Poppins', sans-serif"
        },
        bodyFont: {
          family: "'Poppins', sans-serif"
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: "'Poppins', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280',
          font: {
            family: "'Poppins', sans-serif"
          }
        }
      }
    }
  }

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      // Create new chart instance
      const ctx = chartRef.current.getContext('2d')
      chartInstance.current = new Chart(ctx, {
        type,
        data: data.labels ? data : defaultData,
        options: { ...defaultOptions, ...options }
      })
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [type, data, options])

  return (
    <div className={`relative ${className}`} style={{ height: `${height}px` }} {...props}>
      <canvas ref={chartRef} />
    </div>
  )
}

// Pre-configured chart components
export const DonationTrendChart = ({ data, ...props }) => (
  <DonationChart
    type="line"
    data={data}
    options={{
      plugins: {
        title: {
          display: true,
          text: 'Monthly Donation Trends',
          color: '#1f2937',
          font: {
            size: 16,
            family: "'Poppins', sans-serif",
            weight: 'bold'
          }
        }
      }
    }}
    {...props}
  />
)

export const DonationPieChart = ({ data, ...props }) => (
  <DonationChart
    type="pie"
    data={data}
    options={{
      plugins: {
        title: {
          display: true,
          text: 'Blood Group Distribution',
          color: '#1f2937',
          font: {
            size: 16,
            family: "'Poppins', sans-serif",
            weight: 'bold'
          }
        }
      }
    }}
    {...props}
  />
)

export const DonationBarChart = ({ data, ...props }) => (
  <DonationChart
    type="bar"
    data={data}
    options={{
      plugins: {
        title: {
          display: true,
          text: 'Donations by District',
          color: '#1f2937',
          font: {
            size: 16,
            family: "'Poppins', sans-serif",
            weight: 'bold'
          }
        }
      }
    }}
    {...props}
  />
)

export default DonationChart