from collections import namedtuple
from rest_framework import viewsets, generics, mixins, status, decorators, permissions
from rest_framework.response import Response
from itertools import chain

from django.contrib.auth import get_user_model as User

from .serializers import FolderSerializer, SubFolderDetailsSerializer, \
    FileSerializer
from .models import Folder, File
from django.core.mail import send_mail
from FileSharingPlatform.settings import EMAIL_HOST


# class FolderViews(viewsets.ModelViewSet):
#     serializer_class = SubFolderDetailsSerializer
#     # queryset = Folder.objects.all()
#
#     # def get_queryset(self):
#     #     print("kalsdj ", Folder.objects.filter(sub_folder_id=self.request.query_params.get('folder')))
#     #     return Folder.objects.filter(sub_folder_id=self.request.query_params.get('folder'))
#
#     FolderDetails = namedtuple('FolderDetails', ('folder', 'file'))
#
#     def list(self, request, *args, **kwargs):
#         is_sub_folder = request.query_params.get('folder')
#         folder_details = self.FolderDetails(
#             folder=Folder.objects.all(),
#             file=File.objects.all(),
#         )
#         if is_sub_folder:
#             folder_details = self.FolderDetails(
#                 folder=Folder.objects.filter(user=self.request.user, sub_folder=is_sub_folder),
#                 file=File.objects.filter(folder_id=is_sub_folder),
#             )
#         serializer = self.get_serializer(folder_details)
#         return Response(serializer.data)
#
#     # def get_queryset(self):
#     #     is_sub_folder = self.request.query_params.get('folder')
#     #     folder_details = self.FolderDetails(
#     #         folder=Folder.objects.all(),
#     #         file=File.objects.all(),
#     #     )
#     #     if is_sub_folder:
#     #         return self.FolderDetails(
#     #             folder=Folder.objects.filter(user=self.request.user, sub_folder=is_sub_folder),
#     #             file=File.objects.filter(folder_id=is_sub_folder),
#     #         )
#     #     return folder_details
#
#     # def get_serializer(self, *args, **kwargs):


class FolderView(viewsets.ModelViewSet):
    serializer_class = FolderSerializer
    queryset = Folder.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_context(self):
        context = super(FolderView, self).get_serializer_context()
        context.update({"request": self.request})
        return context

    def get_queryset(self):
        is_sub_folder = self.request.query_params.get('folder')
        if is_sub_folder:
            return self.queryset.filter(id=is_sub_folder)
        return self.queryset.filter(sub_folder=None)

    def get_serializer_class(self):
        is_sub_folder = self.request.query_params.get('folder')
        if is_sub_folder:
            return SubFolderDetailsSerializer
        return self.serializer_class

    def list(self, request, *args, **kwargs):
        if not request.query_params.get('folder'):
            folder = Folder.objects.filter(user=request.user, sub_folder=None)
            file = File.objects.filter(user=request.user, folder=None)
            folder_serializer = FolderSerializer(data=folder, many=True)
            file_serializer = FileSerializer(context={'request': request}, data=file, many=True)
            folder_serializer.is_valid()
            file_serializer.is_valid()
            serializer = [{'folder': folder_serializer.data, 'file': file_serializer.data}]
            return Response(serializer)
        else:
            return super().list(request, *args, **kwargs)


class FileView(viewsets.ModelViewSet):
    serializer_class = FileSerializer
    queryset = File.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.query_params.get('share'):
            return File.objects.filter(permission=self.request.user)
        return self.queryset

    # def get_object(self):
    #     return super().get_object()

    @decorators.action(methods=['POST'], detail=True, url_path="share")
    def share_file(self, request, pk=None):
        file = self.get_object()
        url = request.META.get('HTTP_HOST')+"/show/"+str(file.pk)
        email = request.data
        user = User().objects.filter(email=email).first()
        if not user:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            file.permission.add(user)
        message = f"Dear {user.name}, {request.user.name} are shared a file with you.\n file link: {url}"
        send_mail('Welcome To File Sharing Platform', message, EMAIL_HOST, [user.email, ])
        return Response({"Success": "File Share Successfully"}, status=status.HTTP_200_OK)


class PermittedFile(generics.ListAPIView):
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return File.objects.filter(permission=self.request.user)
