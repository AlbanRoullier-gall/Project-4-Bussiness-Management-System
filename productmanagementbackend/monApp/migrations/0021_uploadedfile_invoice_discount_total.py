# Generated by Django 4.2.6 on 2024-04-04 11:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monApp', '0020_alter_item_supplier_number'),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFile',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('file', models.FileField(upload_to='uploaded_files/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='invoice',
            name='discount_total',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=5),
            preserve_default=False,
        ),
    ]