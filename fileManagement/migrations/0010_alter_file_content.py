# Generated by Django 3.2.9 on 2021-11-15 21:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fileManagement', '0009_alter_file_content'),
    ]

    operations = [
        migrations.AlterField(
            model_name='file',
            name='content',
            field=models.ImageField(upload_to=''),
        ),
    ]