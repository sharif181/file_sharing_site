# Generated by Django 3.2.9 on 2021-11-04 19:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('fileManagement', '0002_alter_file_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='folder',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='file', to='fileManagement.folder'),
        ),
        migrations.AlterField(
            model_name='folder',
            name='sub_folder',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='child_folder', to='fileManagement.folder'),
        ),
    ]