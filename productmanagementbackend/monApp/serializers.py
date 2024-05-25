from rest_framework import serializers
from .models import Invoice, Customer, Payment_terms, Item, Supplier, Vat_Type, UploadedFile

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(source='customer_id', read_only=True)
    class Meta:
        model = Invoice
        fields = '__all__'


class PaymentTermsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment_terms
        fields = ['payment_term']

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'

class Vat_TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vat_Type
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    vat_type = Vat_TypeSerializer(source='vat_type_id', read_only=True)
    supplier = SupplierSerializer(source='supplier_id', read_only=True)
    class Meta:
        model = Item
        fields = '__all__'

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'file', 'uploaded_at']
