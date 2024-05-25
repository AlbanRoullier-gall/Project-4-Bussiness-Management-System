# Generated by Django 4.2.6 on 2024-05-16 13:18

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('monApp', '0034_alter_invoice_structured_communication'),
    ]

    operations = [
        migrations.AddField(
            model_name='invoice_item',
            name='uuid',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
    ]
