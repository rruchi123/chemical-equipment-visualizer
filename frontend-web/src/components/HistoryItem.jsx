function HistoryItem({ item, apiUrl }) {
  return (
    <div className="history-card">
      <div>
        <h4>{item.file_name}</h4>

        <p>
          {new Date(item.uploaded_at).toLocaleString()}
        </p>
      </div>

      <button
        className="download-btn"
        onClick={() =>
          window.open(`${apiUrl}/api/pdf/${item.id}/`, "_blank")
        }
      >
        Download PDF
      </button>
    </div>
  );
}

export default HistoryItem;