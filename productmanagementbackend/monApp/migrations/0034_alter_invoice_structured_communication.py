# Generated by Django 4.2.6 on 2024-04-18 10:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('monApp', '0033_alter_invoice_total_amount_exc_vat_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='structured_communication',
            field=models.CharField(max_length=20, unique=True),
        ),
    ]