function UploadCard({
  file,
  message,
  handleFileChange,
  handleUpload,
}) {
  return (
    <div className="dashboard-card">

      <h2>Upload Equipment CSV</h2>

      <p>
        Select a CSV file containing equipment parameters.
      </p>

      <div className="upload-area">

        <label className="choose-file-btn">
          Choose File
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <span className="filename">
            {file.name}
          </span>
        )}

        <button
          className="upload-btn"
          onClick={handleUpload}
        >
          Upload Dataset
        </button>

      </div>

      {message && (
        <div className="message-box">
          {message}
        </div>
      )}

    </div>
  );
}

export default UploadCard;