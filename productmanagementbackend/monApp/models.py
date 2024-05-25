from django.db import models
import uuid

class UploadedFile(models.Model):
    file = models.FileField(upload_to='bills_order_form/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    

class Supplier(models.Model):
    supplier_number = models.fields.CharField(max_length=30, unique=True)
    supplier_name = models.fields.CharField(max_length=30)
    vat_number = models.fields.CharField(max_length=30)

class Vat_Type(models.Model):
    vat_type = models.CharField(max_length=30, unique=True)

class Item(models.Model):
    vat_type_id = models.ForeignKey(Vat_Type, null=True, on_delete=models.SET_NULL, related_name='items')
    supplier_id = models.ForeignKey(Supplier, null=True, on_delete=models.SET_NULL, related_name='items')
    item_number = models.fields.CharField(max_length=30, unique=True)
    supplier_number = models.fields.CharField(max_length=30, unique=True)
    barcode = models.CharField(max_length=13, unique=True)
    product_description = models.fields.CharField(max_length=100, unique=True)
    price = models.fields.DecimalField(max_digits=10,decimal_places=2)
    purchase_price = models.fields.DecimalField(max_digits=10,decimal_places=2)


class Country(models.Model):
    country = models.fields.CharField(max_length=40)
    iso_code = models.fields.CharField(max_length=6)

class City(models.Model):
    country_id = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
    city = models.fields.CharField(max_length=40)
    zip_code = models.fields.CharField(max_length=40)

class Category(models.Model):    
    category = models.fields.CharField(max_length=40)

class Payment_terms(models.Model):
    payment_term = models.fields.CharField(max_length=40)
    payment_term_code = models.fields.CharField(max_length=40)

class Address(models.Model):
    city_id = models.ForeignKey(City, null=True, on_delete=models.SET_NULL)
    address =  models.fields.CharField(max_length=30)
    address_number = models.fields.IntegerField()
    address_box = models.fields.CharField(max_length=30)
    address_complement = models.fields.CharField(max_length=30)
    longitude = models.fields.DecimalField(max_digits=5,decimal_places=2)
    latitude = models.fields.DecimalField(max_digits=5,decimal_places=2)


class Customer(models.Model):
    category_id = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
    payment_term_id = models.ForeignKey(Payment_terms, null=True, on_delete=models.SET_NULL)
    customer_number = models.fields.CharField(max_length=20,unique=True)
    customer_name = models.fields.CharField(max_length=40)
    phone_number = models.fields.CharField(max_length=20)
    fax_number = models.fields.CharField(max_length=20)
    mail = models.fields.EmailField(max_length=50)
    vat_number = models.fields.CharField(max_length=30)
    registered_vat = models.fields.CharField(max_length=30)
    is_active = models.fields.BooleanField(default=True)


class Companie(models.Model):
    company_name = models.fields.CharField(max_length=40)
    vat_number = models.fields.CharField(max_length=30, unique=True)
    phone_number_general = models.fields.CharField(max_length=20)
    mail_general = models.fields.EmailField(max_length=50)
    bank_name = models.fields.CharField(max_length=40)
    bank_iban = models.fields.CharField(max_length=40)
    bank_bic = models.fields.CharField(max_length=40)

class Contact(models.Model):
    address_id = models.ForeignKey(Address, null=True, on_delete=models.SET_NULL)
    name = models.fields.CharField(max_length=40)
    client = models.fields.CharField(max_length=40)
    phone_number_private =  models.fields.CharField(max_length=20)
    mail_private = models.fields.EmailField(max_length=50)

class Invoice(models.Model):
    customer_id = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)
    invoice_number = models.fields.CharField(max_length=40, unique=True)
    invoice_date = models.fields.DateField()
    due_date = models.fields.DateField()
    total_amount_exc_vat = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount_vat = models.fields.DecimalField(max_digits=10,decimal_places=2)
    flag_accounting = models.fields.CharField(max_length=20)
    communication = models.fields.TextField(blank=True)
    structured_communication = models.CharField(max_length=20, unique=True)  
    discount_total = models.fields.DecimalField(max_digits=5,decimal_places=2)
    uploaded_file = models.ForeignKey(UploadedFile, null=True, blank=True, on_delete=models.SET_NULL)


class Invoice_item(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, unique=True)
    invoice_id = models.ForeignKey(Invoice, null=True, on_delete=models.SET_NULL)
    item_id = models.ForeignKey(Item, null=True, on_delete=models.SET_NULL)
    vat_type_id = models.ForeignKey(Vat_Type, null=True, on_delete=models.SET_NULL)
    vat_value = models.DecimalField(max_digits=10,decimal_places=2, default=0.00)
    quantity = models.DecimalField(max_digits=10,decimal_places=2)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    purchase_price = models.DecimalField(max_digits=10,decimal_places=2)
    discount = models.DecimalField(max_digits=5,decimal_places=2)

class Companie_Contact(models.Model):
    company_id = models.ForeignKey(Companie, null=True, on_delete=models.SET_NULL)
    contact_id = models.ForeignKey(Contact, null=True, on_delete=models.SET_NULL)
    phone_number_pro = models.fields.CharField(max_length=20)
    mail_pro = models.fields.EmailField(max_length=50)

class Contact_Customer(models.Model):
    customer_id = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)
    contact_id = models.ForeignKey(Contact, null=True, on_delete=models.SET_NULL)
    phone_number_pro = models.fields.CharField(max_length=20)
    mail_pro = models.fields.EmailField(max_length=50)

class Contact_Supplier(models.Model):
    supplier_id = models.ForeignKey(Supplier, null=True, on_delete=models.SET_NULL)
    contact_id = models.ForeignKey(Contact, null=True, on_delete=models.SET_NULL)
    phone_number_pro = models.fields.CharField(max_length=20)
    mail_pro = models.fields.EmailField(max_length=50)

class Address_Types(models.Model):
    address_type = models.fields.CharField(max_length=30)

class Address_Address_Type_Supplier(models.Model):
    address_id = models.ForeignKey(Address, null=True, on_delete=models.SET_NULL)
    address_type_id = models.ForeignKey(Address_Types, null=True, on_delete=models.SET_NULL)
    supplier_id = models.ForeignKey(Supplier, null=True, on_delete=models.SET_NULL)

class Address_Address_Type_Company(models.Model):
    address_id = models.ForeignKey(Address, null=True, on_delete=models.SET_NULL)
    address_type_id = models.ForeignKey(Address_Types, null=True, on_delete=models.SET_NULL)
    company_id = models.ForeignKey(Companie, null=True, on_delete=models.SET_NULL)

class Address_Address_Type_Customer(models.Model):
    address_id = models.ForeignKey(Address, null=True, on_delete=models.SET_NULL)
    address_type_id = models.ForeignKey(Address_Types, null=True, on_delete=models.SET_NULL)
    customer_id = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)

class Vat_Value(models.Model):
    country_id = models.ForeignKey(Country, null=True, on_delete=models.SET_NULL)
    vat_type_id = models.ForeignKey(Vat_Type, null=True, on_delete=models.SET_NULL)
    vat_value = models.fields.DecimalField(max_digits=5,decimal_places=2)


