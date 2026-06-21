import { FaReact } from "react-icons/fa";
import { SiDjango, SiChartdotjs } from "react-icons/si";

function Footer() {
  return (
    <footer className="dashboard-footer">

      <div className="footer-left">

        <h3>Chemical Equipment Parameter Visualizer</h3>

        <p>
          Interactive dashboard for visualizing and analyzing
          chemical equipment operational parameters from uploaded
          CSV datasets.
        </p>

      </div>

      <div className="footer-right">

        <span>
          <FaReact /> React
        </span>

        <span>
          <SiDjango /> Django
        </span>

        <span>
          <SiChartdotjs /> Chart.js
        </span>

      </div>

    </footer>
  );
}

export default Footer;