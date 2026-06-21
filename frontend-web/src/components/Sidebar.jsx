import HistoryItem from "./HistoryItem";

function Sidebar({
  history,
  isOpen,
  apiUrl,
}) {
  return (
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <div className="sidebar-title">
        {isOpen ? "Upload History" : "📁"}
      </div>

      {isOpen && (
        <div className="history-list">
          {history.length === 0 ? (
            <p>No uploads yet.</p>
          ) : (
            history.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                apiUrl={apiUrl}
              />
            ))
          )}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;