
from django.db import models, IntegrityError, transaction
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from rest_framework import status

import uuid
from decimal import Decimal, ROUND_HALF_UP


class UploadedFile(models.Model):
    file = models.FileField(upload_to='bills_order_form/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def delete_file(self):
        try:
            self.file.delete()
            self.delete()
            return "File deleted successfully", status.HTTP_204_NO_CONTENT
        except ObjectDoesNotExist:
            return "File not found", status.HTTP_404_NOT_FOUND
        except Exception as e:
            return str(e), status.HTTP_500_INTERNAL_SERVER_ERROR
        
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

    @staticmethod
    def validate_data(data):
        required_fields = [
            'customer_id', 'invoice_number', 'invoice_date', 'due_date', 'total_amount_exc_vat', 
            'total_amount_vat', 'flag_accounting', 'structured_communication', 'discount_total'
        ]
        for field in required_fields:
            if field not in data:
                raise ValidationError(f'Le champ obligatoire {field} est manquant')

    @staticmethod
    def check_unique_communication(structured_communication):
        if Invoice.objects.filter(structured_communication=structured_communication).exists():
            raise IntegrityError('Une facture avec la même communication structurée existe déjà')

    @staticmethod
    def get_customer(customer_id):
        try:
            return Customer.objects.get(customer_number=customer_id)
        except Customer.DoesNotExist:
            raise ValidationError('Le client avec le numéro spécifié n\'existe pas')

    @staticmethod
    def to_decimal(value):
        try:
            return Decimal(value).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
        except ValueError:
            raise ValidationError('Les montants doivent être au format Decimal')

    def validate(self):
        try:
            self.full_clean()
        except ValidationError as e:
            raise ValidationError(f"Les valeurs décimales ne respectent pas les contraintes : {e.message_dict}")

    @classmethod
    @transaction.atomic
    def create(cls, data):
        cls.validate_data(data)
        cls.check_unique_communication(data['structured_communication'])
        customer = cls.get_customer(data['customer_id'])

        invoice = cls(
            customer_id=customer,
            invoice_number=data['invoice_number'],
            invoice_date=data['invoice_date'],
            due_date=data['due_date'],
            total_amount_exc_vat=cls.to_decimal(data['total_amount_exc_vat']),
            total_amount_vat=cls.to_decimal(data['total_amount_vat']),
            flag_accounting=data['flag_accounting'],
            communication=data.get('communication', ''),
            structured_communication=data['structured_communication'],
            discount_total=cls.to_decimal(data['discount_total']),
            uploaded_file_id=data.get('uploaded_file')
        )

        invoice.validate()
        invoice.save()

        invoice_items_data = data.get('invoice_items', [])
        for item_data in invoice_items_data:
            Invoice_item.create(invoice, item_data)

        return invoice

    @classmethod
    def search(cls, invoice_number):
        invoice = cls.objects.get(invoice_number=invoice_number)
        invoice_items = Invoice_item.objects.filter(invoice_id=invoice.id)

        invoice_data = {
            'customer_id': invoice.customer_id.customer_number,
            'invoice_number': invoice.invoice_number,
            'invoice_date': invoice.invoice_date,
            'due_date': invoice.due_date,
            'total_amount_exc_vat': float(invoice.total_amount_exc_vat),
            'total_amount_vat': float(invoice.total_amount_vat),
            'discount_total': float(invoice.discount_total),
            'flag_accounting': invoice.flag_accounting,
            'communication': invoice.communication,
            'structured_communication': invoice.structured_communication,
            'uploaded_file_id': invoice.uploaded_file.id if invoice.uploaded_file else None,
            'uploaded_file_url': f'{invoice.uploaded_file.file.url}' if invoice.uploaded_file else None,
            'invoice_items': [{
                'uuid': str(item.uuid),
                'item_id': item.item_id.item_number,
                'quantity': float(item.quantity),
                'price': float(item.price),
                'purchase_price': float(item.purchase_price),
                'discount': float(item.discount),
                'vat_value': float(item.vat_value),
                'vat_type_id': item.vat_type_id.vat_type,
                'supplier_number': item.item_id.supplier_number,
                'product_description': item.item_id.product_description,
            } for item in invoice_items]
        }

        return invoice_data


    def update_invoice_info(self, data):
        # Met à jour les informations de base de la facture avec les nouvelles données.
        customer_number = data.get('customer_number')
        customer = Customer.objects.filter(customer_number=customer_number).first()

        # Vérifie si le client existe
        if customer is None:
            return False, {"error": f"Le client avec le numéro {customer_number} n'existe pas"}


        # Met à jour les informations de la facture avec les nouvelles données.
        self.customer_id = customer
        self.invoice_date = data.get('invoice_date')
        self.due_date = data.get('due_date')
        self.total_amount_exc_vat = data.get('total_amount_exc_vat')
        self.total_amount_vat = data.get('total_amount_vat')
        self.flag_accounting = data.get('flag_accounting')
        self.communication = data.get('communication')
        self.structured_communication = data.get('structured_communication')
        self.discount_total = data.get('discount_total')

        # Sauvegarde les modifications apportées à l'objet Invoice.
        self.save()
        return True, None

    def handle_uploaded_file(self, uploaded_file_id):
        # Gère le fichier téléchargé associé à la facture.
        if uploaded_file_id:
            try:
                uploaded_file = UploadedFile.objects.get(pk=uploaded_file_id)
                self.uploaded_file = uploaded_file
                self.save()
                return True, None
            except UploadedFile.DoesNotExist:
                return False, {"error": f"Le fichier téléchargé avec l'identifiant {uploaded_file_id} n'existe pas"}

    def update_invoice_items(self, invoice_items_data):
        # Met à jour les lignes de details de la facture avec les nouvelles données.
        updated_item_ids = set()
        for item_data in invoice_items_data:
            item_reference = item_data.get('item_reference')
            if item_reference:
                try:
                    item = Item.objects.get(item_number=item_reference)
                except Item.DoesNotExist:
                    return False, {"error": f"L'article avec la référence {item_reference} n'existe pas"}

                item_uuid = item_data.get('item_id')
                if item_uuid:
                    try:
                        invoice_item = Invoice_item.objects.get(uuid=item_uuid, invoice_id=self.id)
                        invoice_item.update(item, item_data)
                        updated_item_ids.add(item_uuid)
                    except Invoice_item.DoesNotExist:
                        Invoice_item.add_invoice_item(self, item, item_data)
                        updated_item_ids.add(item_uuid)

        # Supprime les  lignes de details de facture qui ne sont pas présentes dans les nouvelles données.
        current_item_uuids = set(item_data.get('item_id') for item_data in invoice_items_data)
        invoice_items_to_delete = Invoice_item.objects.filter(invoice_id=self.id).exclude(uuid__in=current_item_uuids)
        invoice_items_to_delete.delete()
        return True, None


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

    @staticmethod
    def validate_item_data(item_data):
        required_item_fields = ['lineDetail_id', 'item_id', 'vat_type_id', 'quantity', 'price', 'purchase_price']
        if not all(field in item_data for field in required_item_fields):
            raise ValidationError('Des informations sur l\'item sont manquantes')

    @staticmethod
    def get_item(item_id):
        try:
            return Item.objects.get(item_number=item_id)
        except Item.DoesNotExist:
            raise ValidationError('L\'item avec l\'ID spécifié n\'existe pas')

    @staticmethod
    def get_vat_type(vat_type_id):
        try:
            return Vat_Type.objects.get(vat_type=vat_type_id)
        except Vat_Type.DoesNotExist:
            raise ValidationError('Le type de TVA avec l\'ID spécifié n\'existe pas')

    @staticmethod
    def to_decimal(value):
        try:
            return Decimal(value).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
        except ValueError:
            raise ValidationError('Les valeurs doivent être au format Decimal')

    @classmethod
    def create(cls, invoice, item_data):
        cls.validate_item_data(item_data)
        item = cls.get_item(item_data['item_id'])
        vat_type = cls.get_vat_type(item_data['vat_type_id'])

        invoice_item = cls(
            uuid=item_data['lineDetail_id'],
            invoice_id=invoice,
            item_id=item,
            vat_type_id=vat_type,
            vat_value=cls.to_decimal(item_data.get('vat_value', 0)),
            quantity=cls.to_decimal(item_data['quantity']),
            price=cls.to_decimal(item_data['price']),
            purchase_price=cls.to_decimal(item_data['purchase_price']),
            discount=cls.to_decimal(item_data.get('discount', 0))
        )

        invoice_item.save()


    def update(self, item, item_data):
        # Met à jour une ligne de facture existante avec de nouvelles données.
        self.item_id = item
        self.quantity = item_data.get('quantity')
        self.price = item_data.get('price')
        self.purchase_price = item_data.get('purchase_price')
        self.discount = item_data.get('discount')
        vat_type_id = item_data.get('vat_type_id')
        if vat_type_id:
            try:
                vat_type = Vat_Type.objects.get(vat_type=vat_type_id)
                self.vat_type_id = vat_type
            except Vat_Type.DoesNotExist:
                return False, {"error": f"Le type de TVA avec le code {vat_type_id} n'existe pas"}
        self.save()
        return True, None

    @classmethod
    def add_invoice_item(cls, invoice, item, item_data):
        # Crée une nouvelle ligne de facture avec les données fournies.
        vat_type_id = item_data.get('vat_type_id')
        vat_type = None
        if vat_type_id:
            try:
                vat_type = Vat_Type.objects.get(vat_type=vat_type_id)
            except Vat_Type.DoesNotExist:
                return False, {"error": f"Le type de TVA avec le code {vat_type_id} n'existe pas"}

        # Crée l'objet Invoice_item avec les données fournies.
        cls.objects.create(
            uuid=item_data.get('item_id'),
            invoice_id=invoice,
            item_id=item,
            quantity=item_data.get('quantity'),
            price=item_data.get('price'),
            purchase_price=item_data.get('purchase_price'),
            discount=item_data.get('discount'),
            vat_type_id=vat_type
        )
        return True, None

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


