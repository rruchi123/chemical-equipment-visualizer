from django.urls import path
from .views import UploadCSVView, DatasetHistoryView, DatasetPDFView

urlpatterns = [
    path("upload/", UploadCSVView.as_view(), name="upload-csv"),
    path("history/", DatasetHistoryView.as_view(), name="dataset-history"),
    path("pdf/<int:dataset_id>/", DatasetPDFView.as_view(), name="dataset-pdf"),
]


