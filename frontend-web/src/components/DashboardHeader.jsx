import { FaIndustry } from "react-icons/fa";

function DashboardHeader() {
  return (
    <div className="dashboard-header">

      <div className="header-left">

        <p className="dashboard-tag">
          CHEMICAL EQUIPMENT ANALYTICS
        </p>

        <h2>
          Equipment Performance Dashboard
        </h2>

        <p className="dashboard-description">
          Upload a CSV dataset to analyze chemical equipment parameters, visualize performance metrics, and generate meaningful operational insights through interactive dashboards.
        </p>

      </div>

      <div className="header-icon">

        <FaIndustry />

      </div>

    </div>
  );
}

export default DashboardHeader;