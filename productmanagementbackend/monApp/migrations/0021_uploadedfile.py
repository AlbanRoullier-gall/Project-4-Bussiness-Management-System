# Generated by Django 4.2.6 on 2024-02-01 08:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monApp', '0020_alter_item_supplier_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='uploaded_files/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]