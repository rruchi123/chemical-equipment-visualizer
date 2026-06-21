import { FaFlask, FaBars } from "react-icons/fa";

function Navbar({ toggleSidebar }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <div className="logo">
          <FaFlask />
        </div>

        <div>
          <h1>Chemical Equipment Visualizer</h1>
          <p>Industrial Analytics Dashboard</p>
        </div>
      </div>

      <div className="navbar-right">
      </div>
    </header>
  );
}

export default Navbar;