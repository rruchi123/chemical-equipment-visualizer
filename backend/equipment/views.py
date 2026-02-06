from django.http import HttpResponse
from reportlab.pdfgen import canvas


# Create your views here.
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Dataset
from .serializers import DatasetSerializer


class UploadCSVView(APIView):
    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "No file uploaded"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        df = pd.read_csv(file)

        total_count = len(df)

        summary = {
            "total_count": total_count,
            "avg_flowrate": df["Flowrate"].mean(),
            "avg_pressure": df["Pressure"].mean(),
            "avg_temperature": df["Temperature"].mean(),
            "type_distribution": df["Type"].value_counts().to_dict(),
        }

        dataset = Dataset.objects.create(
            file_name=file.name,
            **summary,
        )

        # keep only last 5 uploads
        excess = Dataset.objects.order_by("-uploaded_at")[5:]
        if excess:
            for d in excess:
                d.delete()

        serializer = DatasetSerializer(dataset)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class DatasetHistoryView(APIView):
    def get(self, request):
        datasets = Dataset.objects.order_by("-uploaded_at")[:5]
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data)
    
class DatasetPDFView(APIView):
    def get(self, request, dataset_id):
        try:
            dataset = Dataset.objects.get(id=dataset_id)
        except Dataset.DoesNotExist:
            return Response({"error": "Dataset not found"}, status=404)

        response = HttpResponse(content_type="application/pdf")
        response["Content-Disposition"] = (
            f'attachment; filename="dataset_{dataset_id}_report.pdf"'
        )

        p = canvas.Canvas(response)
        p.setFont("Helvetica", 12)

        y = 800
        lines = [
            f"File Name: {dataset.file_name}",
            f"Uploaded At: {dataset.uploaded_at}",
            f"Total Count: {dataset.total_count}",
            f"Average Flowrate: {dataset.avg_flowrate:.2f}",
            f"Average Pressure: {dataset.avg_pressure:.2f}",
            f"Average Temperature: {dataset.avg_temperature:.2f}",
            "",
            "Type Distribution:",
        ]

        for line in lines:
            p.drawString(50, y, line)
            y -= 20

        for equipment_type, count in dataset.type_distribution.items():
            p.drawString(70, y, f"{equipment_type}: {count}")
            y -= 20

        p.showPage()
        p.save()

        return response




