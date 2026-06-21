import { Bar } from "react-chartjs-2";

function GraphCard({
  summary,
  chartData,
  chartOptions,
}) {
  if (!summary) return null;

  return (
    <div className="dashboard-card">

      <h2>
        Equipment Type Distribution
      </h2>

      <p className="graph-subtitle">
        Distribution based on the latest uploaded dataset.
      </p>

      <div className="chart-container">
        <Bar
          data={chartData}
          options={chartOptions}
        />
      </div>

    </div>
  );
}

export default GraphCard;