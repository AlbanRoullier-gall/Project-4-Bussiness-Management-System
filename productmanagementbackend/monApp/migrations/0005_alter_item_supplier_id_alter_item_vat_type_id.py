# Generated by Django 4.2.6 on 2024-01-13 15:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('monApp', '0004_remove_vat_type_vat_type_vat_type_vat_percentage_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='supplier_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='items', to='monApp.supplier'),
        ),
        migrations.AlterField(
            model_name='item',
            name='vat_type_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='items', to='monApp.vat_type'),
        ),
    ]