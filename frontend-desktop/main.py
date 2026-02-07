from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import matplotlib.pyplot as plt
import sys
import requests
import os

from PyQt5.QtWidgets import (
    QApplication,
    QWidget,
    QLabel,
    QPushButton,
    QVBoxLayout,
    QFileDialog,
    QMessageBox,
    QHBoxLayout
)

API_URL = "http://127.0.0.1:8000/api/upload/"
HISTORY_URL = "http://127.0.0.1:8000/api/history/"
USERNAME = os.getenv("APP_USERNAME", "")
PASSWORD = os.getenv("APP_PASSWORD", "")



class MainWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Chemical Equipment Visualizer (Desktop)")
        self.setGeometry(100, 100, 900, 700)

        self.layout = QVBoxLayout()
        self.history_layout = QVBoxLayout()

        self.label = QLabel("No CSV file selected.")
        self.label.setStyleSheet("font-size: 14px;")

        self.button_select = QPushButton("Select CSV File")
        self.button_select.clicked.connect(self.select_file)

        self.button_upload = QPushButton("Upload CSV")
        self.button_upload.setEnabled(False)
        self.button_upload.clicked.connect(self.upload_file)
        self.summary_label = QLabel("")
        self.summary_label.setStyleSheet("font-size: 13px;")
        self.layout.addWidget(self.summary_label)
        self.figure = Figure(figsize=(8,6), dpi=100)
        self.canvas = FigureCanvas(self.figure)
        self.layout.addWidget(self.canvas)

        self.history_title = QLabel("Upload History")
        self.history_title.setStyleSheet("""
                    font-size: 20px;
                    font-weight: bold;
                    margin-top: 15px;
                """)
        self.layout.addWidget(self.history_title)
        self.layout.addLayout(self.history_layout)

        self.layout.addWidget(self.label)
        self.layout.addWidget(self.button_select)
        self.layout.addWidget(self.button_upload)

        self.setLayout(self.layout)

        self.file_path = None

    def select_file(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select CSV File",
            "",
            "CSV Files (*.csv)"
        )

        if file_path:
            self.file_path = file_path
            self.label.setText(f"Selected file:\n{file_path}")
            self.button_upload.setEnabled(True)

    def upload_file(self):
        if not self.file_path:
            return

        try:
            with open(self.file_path, "rb") as f:
                files = {"file": f}
                if not USERNAME or not PASSWORD:
                    QMessageBox.critical(
                        self,
                        "Auth Error",
                        "Username or password not set in environment variables."
            )
                    return

                response = requests.post(
                    API_URL,
                    files=files,
                    auth=(USERNAME, PASSWORD),
                    timeout=30,
               )

            if response.status_code in (200, 201):
                data = response.json()

                summary_text = (
                    f"<b>Total Equipment:</b> {data['total_count']}<br>"
                    f"<b>Avg Flowrate:</b> {data['avg_flowrate']:.2f}<br>"
                    f"<b>Avg Pressure:</b> {data['avg_pressure']:.2f}<br>"
                    f"<b>Avg Temperature:</b> {data['avg_temperature']:.2f}"
             )  

                self.summary_label.setText(summary_text)
                self.summary_label.setStyleSheet("""
                    QLabel {
                        font-size: 20px;
                        padding: 15px;
                    }
                    """)
                type_dist = data["type_distribution"]

                self.figure.clear()
                ax = self.figure.add_subplot(111)

                ax.bar(
                    type_dist.keys(), 
                    type_dist.values(),
                    color=["#4e79a7", "#59a14f", "#f28e2b", "#e15759", "#76b7b2", "#edc949"]
                    )
                ax.set_title("Equipment Type Distribution")
                ax.set_ylabel("Count")
                ax.set_xlabel("Equipment Type")
                ax.tick_params(axis='x', rotation=20, labelsize=12)
                ax.tick_params(axis='y', labelsize=12)
                
                plt.tight_layout()

                self.canvas.draw()

                self.load_history()
                QMessageBox.information(
                    self,
                    "Success",
                    "CSV uploaded successfully!"
        )

            else:
                QMessageBox.critical(
                    self,
                    "Error",
                    f"Upload failed:\n{response.text}"
              )

        except Exception as e:
            QMessageBox.critical(
                self,
                "Error",
                str(e)
            )

    def load_history(self):
        try:
            response = requests.get(
                HISTORY_URL,
                auth=(USERNAME, PASSWORD),
                timeout=10
            )

            if response.status_code == 200:
                history = response.json()

                # Clear old history
                while self.history_layout.count():
                    item = self.history_layout.takeAt(0)
                    if item.widget():
                        item.widget().deleteLater()

                for item in history:
                    row = QHBoxLayout()

                    label = QLabel(
                        f"{item['file_name']} — {item['uploaded_at']}"
                    )
                    label.setStyleSheet("font-size: 12px;")

                    btn = QPushButton("Download PDF")
                    btn.clicked.connect(
                        lambda _, id=item["id"]:
                        os.system(f'start http://127.0.0.1:8000/api/pdf/{id}/')
                    )

                    row.addWidget(label)
                    row.addWidget(btn)
                    self.history_layout.addLayout(row)

        except Exception as e:
            print("History load failed:", e)

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
