import { useState, useEffect } from "react";

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import UploadCard from "./components/UploadCard";
import SummaryCards from "./components/SummaryCards";
import GraphCard from "./components/GraphCard";
import DashboardHeader from "./components/DashboardHeader";
import Insights from "./components/Insights";
import Footer from "./components/Footer";

import "./App.css";

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

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [file, setFile] = useState(null);

  const [message, setMessage] = useState("");

  const [summary, setSummary] = useState(null);

  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/history/`,
        {
          headers: AUTH_HEADER,
        }
      );

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
      alert("API credentials are missing.");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      const response = await fetch(
        `${API_BASE_URL}/api/upload/`,
        {
          method: "POST",
          headers: AUTH_HEADER,
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      setSummary(data);

      setMessage("CSV uploaded successfully!");

      fetchHistory();

    } catch (err) {

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
            "#3B82F6",
            "#06B6D4",
            "#10B981",
            "#F59E0B",
            "#EF4444",
            "#8B5CF6",
          ],
          borderRadius: 8,
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

    },

    scales: {

      x: {
        ticks: {
          color: "#dbeafe",
        },

        grid: {
          display: false,
        },
      },

      y: {

        ticks: {
          color: "#dbeafe",
          stepSize: 1,
        },

        grid: {
          color: "rgba(255,255,255,0.08)",
        },
      },

    },

  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app">

      <Navbar toggleSidebar={toggleSidebar} />

      <div className="dashboard-layout">

        <Sidebar
          history={history}
          isOpen={sidebarOpen}
          apiUrl={API_BASE_URL}
        />

        <main className="dashboard-content">
          <DashboardHeader />
          <UploadCard
            file={file}
            message={message}
            handleFileChange={handleFileChange}
            handleUpload={handleUpload}
          />

          <SummaryCards
            summary={summary}
          />

          <GraphCard
            summary={summary}
            chartData={chartData}
            chartOptions={chartOptions}
          />

          <Insights summary={summary} />

          <Footer />

        </main>

      </div>

    </div>
  );
}

export default App;