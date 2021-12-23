from django.urls import path, include
from .views import FolderView, PermittedFile, FileView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'folder', FolderView, basename='base_folder')
router.register(r'file', FileView, basename='file')

app_name = 'fileManagement'

urlpatterns = [
    path('', include(router.urls)),
    path('shared/files/', PermittedFile.as_view())
]