from django.core.files.storage import FileSystemStorage
from django.db import models
from django.contrib.auth import get_user_model as User
from django.conf import settings


class Folder(models.Model):
    user = models.ForeignKey(User(), on_delete=models.CASCADE)
    sub_folder = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name='child_folder')
    name = models.CharField(max_length=100)
    size = models.DecimalField(max_digits=9, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    permission = models.ManyToManyField(User(), related_name='user_folder', null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['sub_folder', 'name'],
                name='unique name'
            )
        ]


class File(models.Model):
    folder = models.ForeignKey(Folder, related_name='file', on_delete=models.CASCADE, null=True, blank=True)
    user = models.ForeignKey(User(), on_delete=models.CASCADE)
    content = models.FileField()
    name = models.CharField(max_length=100)
    size = models.DecimalField(max_digits=9, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    permission = models.ManyToManyField(User(), related_name='user_file', null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['folder', 'name'],
                name='unique file'
            )
        ]

    def __str__(self):
        return self.name

