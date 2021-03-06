# Generated by Django 3.2.9 on 2021-11-07 09:59

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fileManagement', '0005_alter_file_folder'),
    ]

    operations = [
        migrations.AddField(
            model_name='file',
            name='permission',
            field=models.ManyToManyField(blank=True, null=True, related_name='user_file', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='folder',
            name='permission',
            field=models.ManyToManyField(blank=True, null=True, related_name='user_folder', to=settings.AUTH_USER_MODEL),
        ),
    ]
