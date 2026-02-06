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
      const res = await fetch("http://127.0.0.1:8000/api/history/", {
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
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
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
        },
      ],
    };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chemical Equipment Parameter Visualizer</h2>

      <input type="file" accept=".csv" onChange={handleFileChange} />
      <br /><br />
      <button onClick={handleUpload}>Upload CSV</button>

      <p>{message}</p>

      {summary && (
        <>
          <h3>Summary</h3>
          <p>Total Equipment: {summary.total_count}</p>
          <p>Avg Flowrate: {summary.avg_flowrate.toFixed(2)}</p>
          <p>Avg Pressure: {summary.avg_pressure.toFixed(2)}</p>
          <p>Avg Temperature: {summary.avg_temperature.toFixed(2)}</p>

          <h3>Equipment Type Distribution</h3>
          <Bar data={chartData} />
        </>
      )}

      <hr />

      <h3>Upload History</h3>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            {item.file_name} — {item.uploaded_at}{" "}
            <button
              onClick={() =>
                window.open(
                  `http://127.0.0.1:8000/api/pdf/${item.id}/`,
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
  );
}

export default App;
