import {
  FaIndustry,
  FaTemperatureHigh,
  FaWind,
  FaCompressArrowsAlt,
} from "react-icons/fa";

function SummaryCards({ summary }) {
  if (!summary) return null;

  const cards = [
    {
      icon: <FaIndustry />,
      title: "Total Equipment",
      value: summary.total_count,
    },
    {
      icon: <FaWind />,
      title: "Avg Flow Rate",
      value: `${summary.avg_flowrate.toFixed(2)} L/min`,
    },
    {
      icon: <FaCompressArrowsAlt />,
      title: "Avg Pressure",
      value: `${summary.avg_pressure.toFixed(2)} bar`,
    },
    {
      icon: <FaTemperatureHigh />,
      title: "Avg Temperature",
      value: `${summary.avg_temperature.toFixed(2)} °C`,
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, index) => (
        <div className="summary-card" key={index}>
          <div className="summary-icon">
            {card.icon}
          </div>

          <div>
            <h3>{card.value}</h3>
            <p>{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;