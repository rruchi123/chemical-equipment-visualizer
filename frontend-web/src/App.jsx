import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const username = import.meta.env.VITE_API_USERNAME;
const password = import.meta.env.VITE_API_PASSWORD;


const AUTH_HEADER = {
  Authorization: "Basic " + btoa(`${username}:${password}`),
};


function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/history/`, {
        headers: AUTH_HEADER,
      });
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to load history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file first.");
      return;
    }

    if (!username || !password) {
      alert("API credentials not set in environment variables");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/`, {
        method: "POST",
        headers: AUTH_HEADER,
        body: formData,
      });

      if (!response.ok) throw new Error();

      const data = await response.json();
      setSummary(data);
      setMessage("CSV uploaded successfully!");
      fetchHistory();
    } catch {
      setMessage("Error uploading CSV");
    }
  };

  const chartData =
    summary && {
      labels: Object.keys(summary.type_distribution),
      datasets: [
        {
          label: "Equipment Count",
          data: Object.values(summary.type_distribution),
          backgroundColor: [
            "#4e79a7",
            "#59a14f",
            "#f28e2b",
            "#e15759",
            "#76b7b2",
            "#edc949",
          ],
          borderColor: "#333",
          borderWidth: 1,
        },
      ],
    };



  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#e0e0e0",
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#e0e0e0",
          font: {
            size: 12,
          },
          stepSize: 1,
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };


  return (
    <div style={{ padding: "20px" }} className="app-container">
      <h2>Chemical Equipment Parameter Visualizer</h2>

      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload CSV</button>

      <p>{message}</p>

      {summary && (
        <div className="section">
          <h3>Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <strong>Total Equipment:</strong> {summary.total_count}
            </div>
            <div className="summary-item">
              <strong>Avg Flowrate:</strong> {summary.avg_flowrate.toFixed(2)}
            </div>
            <div className="summary-item">
              <strong>Avg Pressure:</strong> {summary.avg_pressure.toFixed(2)}
            </div>
            <div className="summary-item">
              <strong>Avg Temperature:</strong> {summary.avg_temperature.toFixed(2)}
            </div>
          </div>


          <h3>Equipment Type Distribution</h3>
          <div style={{ height: "320px", marginTop: "10px" }}>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      )}

      <hr />

      <div className="section">
        <h3>Upload History</h3>
        <ul>
          {history.map((item) => (
            <li key={item.id}>
              {item.file_name} — {item.uploaded_at}{" "}
              <button
                onClick={() =>
                  window.open(
                    `${API_BASE_URL}/api/pdf/${item.id}/`,
                    "_blank"
                  )
                }
              >
                Download PDF
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default App;
