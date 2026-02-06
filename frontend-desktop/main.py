from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
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
)

API_URL = "http://127.0.0.1:8000/api/upload/"
USERNAME = os.getenv("APP_USERNAME", "")
PASSWORD = os.getenv("APP_PASSWORD", "")



class MainWindow(QWidget):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Chemical Equipment Visualizer (Desktop)")
        self.setGeometry(100, 100, 500, 300)

        self.layout = QVBoxLayout()

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
        self.figure = Figure(figsize=(5, 3))
        self.canvas = FigureCanvas(self.figure)
        self.layout.addWidget(self.canvas)



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
                    f"Total Equipment: {data['total_count']}\n"
                    f"Avg Flowrate: {data['avg_flowrate']:.2f}\n"
                    f"Avg Pressure: {data['avg_pressure']:.2f}\n"
                    f"Avg Temperature: {data['avg_temperature']:.2f}"
             )  

                self.summary_label.setText(summary_text)
                type_dist = data["type_distribution"]

                self.figure.clear()
                ax = self.figure.add_subplot(111)

                ax.bar(type_dist.keys(), type_dist.values())
                ax.set_title("Equipment Type Distribution")
                ax.set_ylabel("Count")
                ax.set_xlabel("Equipment Type")
                ax.tick_params(axis='x', rotation=30)

                self.canvas.draw()


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

def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())

if __name__ == "__main__":
    main()
