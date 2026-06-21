import {
    FaCheckCircle,
    FaInfoCircle,
    FaIndustry,
} from "react-icons/fa";

function Insights({ summary }) {
    if (!summary) return null;

    const equipmentTypes = Object.keys(summary.type_distribution || {});
    const equipmentCount = equipmentTypes.length;

    const dominantEquipment =
        equipmentTypes.length > 0
            ? equipmentTypes.reduce((a, b) =>
                summary.type_distribution[a] >
                    summary.type_distribution[b]
                    ? a
                    : b
            )
            : "N/A";

    const insights = [
        {
            icon: <FaCheckCircle />,
            color: "#22c55e",
            text: `Analysis completed for ${summary.total_count} equipment records.`,
        },
        {
            icon: <FaInfoCircle />,
            color: "#38bdf8",
            text: `Average operating pressure: ${summary.avg_pressure.toFixed(
                2
            )} bar.`,
        },
        {
            icon: <FaInfoCircle />,
            color: "#38bdf8",
            text: `Average operating temperature: ${summary.avg_temperature.toFixed(
                2
            )} °C.`,
        },
        {
            icon: <FaInfoCircle />,
            color: "#38bdf8",
            text: `Average flow rate: ${summary.avg_flowrate.toFixed(
                2
            )} L/min.`,
        },
        {
            icon: <FaInfoCircle />,
            color: "#38bdf8",
            text: `Detected ${equipmentCount} equipment categories.`,
        },
        {
            icon: <FaIndustry />,
            color: "#38bdf8",
            text: `Most common equipment type: ${dominantEquipment}.`,
        },
    ];

    return (
        <div className="dashboard-card">
            <h2>Operational Insights</h2>

            <p className="insights-subtitle">
                Automatically generated observations based on the uploaded dataset.
            </p>

            <div className="insights-list">
                {insights.map((item, index) => (
                    <div className="insight-item" key={index}>
                        <span
                            className="insight-icon"
                            style={{ color: item.color }}
                        >
                            {item.icon}
                        </span>

                        <p>{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Insights;