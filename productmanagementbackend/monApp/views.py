import json
import logging

# Créez un objet de journalisation pour cette vue
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

# Créez un gestionnaire de journalisation pour écrire dans un fichier
file_handler = logging.FileHandler('invoice_logs.log')
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(formatter)
logger.addHandler(file_handler)

# Ajoutez un gestionnaire de journalisation pour écrire dans la console
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

from .utils import delete_unused_files

from decimal import Decimal, ROUND_HALF_UP

from django.db import IntegrityError
from django.core.exceptions import ValidationError

from django.contrib.sites.shortcuts import get_current_site

from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse

from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics 
from rest_framework import status

from .models import Invoice
from .models import Invoice_item
from .models import Payment_terms
from .models import Customer
from .models import Item
from .models import Vat_Type
from .models import UploadedFile

from .serializers import InvoiceSerializer 
from .serializers import PaymentTermsSerializer
from .serializers import ItemSerializer 
from .serializers import CustomerSerializer 
from .serializers import Vat_TypeSerializer
from .serializers import UploadedFileSerializer 

def home(request):
    return render(request, 'home.html')

class InvoiceListView(APIView):
    def get(self, request):
        invoices = Invoice.objects.select_related('customer_id')
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

class PaymentTermsList(generics.ListAPIView):
    queryset = Payment_terms.objects.all()
    serializer_class = PaymentTermsSerializer

class ItemList(generics.ListAPIView):
    def get(self, request):
        items = Item.objects.select_related('vat_type_id')
        items = Item.objects.select_related('supplier_id')
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

class CustomerList(generics.ListAPIView):
    def get(self, request):
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

class Vat_TypeList(generics.ListAPIView):
    queryset = Vat_Type.objects.all()
    serializer_class = Vat_TypeSerializer

class FileUploadView(APIView):
    parser_classes = (MultiPartParser,)

    def post(self, request, *args, **kwargs):
        file_serializer = UploadedFileSerializer(data=request.data)

        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error('Error in file upload: {}'.format(file_serializer.errors))
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@method_decorator(csrf_exempt, name='dispatch')
class DeleteFileAPIView(APIView):
    def delete(self, request, file_id):
        try:
            file_to_delete = UploadedFile.objects.get(id=file_id)
            file_to_delete.file.delete()
            file_to_delete.delete()
            logger.info("File {} deleted successfully".format(file_id))
            return Response("File deleted successfully", status=status.HTTP_204_NO_CONTENT)
        except UploadedFile.DoesNotExist:
            logger.error("File with id {} not found".format(file_id))
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error("Error deleting file: {}".format(str(e)))
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def options(self, request, file_id):
        response = Response()
        response['Access-Control-Allow-Origin'] = '*'  
        response['Access-Control-Allow-Methods'] = 'DELETE, OPTIONS'  
        response['Access-Control-Allow-Headers'] = 'Content-Type, Accept, Authorization' 
        return response



class SaveInvoiceAPIView(APIView):
    
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)

            # Vérifier que tous les champs pertinents sont fournis
            required_fields = ['customer_id', 'invoice_number', 'invoice_date', 'due_date', 'total_amount_exc_vat', 'total_amount_vat', 'flag_accounting', 'structured_communication', 'discount_total']
            for field in required_fields:
                if field not in data:
                    error_msg = f'Le champ obligatoire {field} est manquant'
                    logger.error(error_msg)
                    return JsonResponse({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

            # Vérifier si une facture avec la même communication structurée existe déjà
            if Invoice.objects.filter(structured_communication=data['structured_communication']).exists():
                error_msg = 'Une facture avec la même communication structurée existe déjà'
                logger.error(error_msg)
                return JsonResponse({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

            # Retrouver l'instance du client en fonction de son identifaint
            try:
                customer = Customer.objects.get(customer_number=data['customer_id'])
            except Customer.DoesNotExist:
                error_msg = 'Le client avec le numéro spécifié n\'existe pas'
                logger.error(error_msg)
                return JsonResponse({'error': error_msg}, status=status.HTTP_404_NOT_FOUND)

            # Retrouver le fichier téléchargé
            uploaded_file_id = data.get('uploaded_file')

            # Convertir les valeur en decimal et faire en sorte qu'il y aient deux decimal maximum
            try:
                total_amount_exc_vat_decimal = Decimal(data['total_amount_exc_vat']).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
                total_amount_vat_decimal = Decimal(data['total_amount_vat']).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
                discount_total_decimal = Decimal(data['discount_total']).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
            except ValueError:
                logger.error('Les montants doivent être au format Decimal')
                return JsonResponse({'error': 'Les montants doivent être au format Decimal'}, status=status.HTTP_400_BAD_REQUEST)

            # Retrouver la ligne de detail
            invoice_items_data = data.get('invoice_items', [])
            invoice_items = []

            for item_data in invoice_items_data:
                if not all(key in item_data for key in ['lineDetail_id', 'item_id', 'vat_type_id', 'quantity', 'price', 'purchase_price']):
                    error_msg = 'Des informations sur l\'item sont manquantes'
                    logger.error(error_msg)
                    return JsonResponse({'error': error_msg}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    item = Item.objects.get(item_number=item_data['item_id'])
                    vat_type = Vat_Type.objects.get(vat_type=item_data['vat_type_id'])
                except (Item.DoesNotExist, Vat_Type.DoesNotExist):
                    error_msg = 'L\'item ou le type de TVA avec l\'ID spécifié n\'existe pas'
                    logger.error(error_msg)
                    return JsonResponse({'error': error_msg}, status=status.HTTP_404_NOT_FOUND)

                # Convertir les valeur en decimal et faire en sorte qu'il y aient deux decimal maximum
                try:
                    vat_value_decimal = Decimal(item_data.get('vat_value', 0)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
                    quantity_decimal = Decimal(item_data['quantity']).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
                    price_decimal = Decimal(item_data['price']).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
                    purchase_price_decimal = Decimal(item_data['purchase_price']).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
                    discount_decimal = Decimal(item_data.get('discount', 0)).quantize(Decimal('.01'), rounding=ROUND_HALF_UP)
                except ValueError:
                    logger.error('Les valeurs doivent être au format Decimal')
                    return JsonResponse({'error': 'Les valeurs doivent être au format Decimal'}, status=status.HTTP_400_BAD_REQUEST)

                # Créer la la ligne de facture en fonction de son uuid
                invoice_item = Invoice_item(
                    uuid=item_data['lineDetail_id'], 
                    invoice_id=None, 
                    item_id=item,
                    vat_type_id=vat_type,
                    vat_value=vat_value_decimal,
                    quantity=quantity_decimal,
                    price=price_decimal,
                    purchase_price=purchase_price_decimal,
                    discount=discount_decimal
                )
                invoice_items.append(invoice_item)

            # Créer l'objet facture
            invoice = Invoice(
                customer_id=customer,
                invoice_number=data['invoice_number'],
                invoice_date=data['invoice_date'],
                due_date=data['due_date'],
                total_amount_exc_vat=total_amount_exc_vat_decimal,
                total_amount_vat=total_amount_vat_decimal,
                flag_accounting=data['flag_accounting'],
                communication=data.get('communication', ''),  
                structured_communication=data['structured_communication'],
                discount_total=discount_total_decimal,
                uploaded_file_id=uploaded_file_id
            )

            # Valider que les valeurs soient décimales 
            try:
                invoice.full_clean()
            except ValidationError as e:
                error_message = "Les valeurs décimales ne respectent pas les contraintes : {}".format(e.message_dict)
                logger.error(error_message)
                return JsonResponse({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

            # Sauvegarder la facture
            invoice.save()

            # Associer la facture avec sa ligne de detail et la sauvegarder
            for invoice_item in invoice_items:
                invoice_item.invoice_id = invoice
                invoice_item.save()

            logger.info('Facture enregistrée avec succès')
            return JsonResponse({'message': 'Facture enregistrée avec succès'}, status=status.HTTP_201_CREATED)

        except json.JSONDecodeError:
            logger.error('Les données JSON sont mal formatées')
            return JsonResponse({'error': 'Les données JSON sont mal formatées'}, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as e:
            error_message = "Erreur d'intégrité lors de la sauvegarde de la facture : {}".format(str(e))
            logger.error(error_message)
            return JsonResponse({'error': error_message}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error('Une erreur s\'est produite lors de la sauvegarde de la facture : ' + str(e))
            return JsonResponse({'error': 'Une erreur s\'est produite lors de la sauvegarde de la facture : ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InvoiceDataView(APIView):
    def get(self, request, invoice_number):
        # Recherche de l'invoice en fonction du numéro de facture
        invoice = get_object_or_404(Invoice, invoice_number=invoice_number)
        
        # Récupération des items de la facture
        invoice_items = Invoice_item.objects.filter(invoice_id=invoice.id)
         
        # Construction des données de la facture
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

        return JsonResponse(invoice_data)

class UpdateInvoiceView(APIView):
    def put(self, request, invoice_number):
        # Recherche de l'objet Invoice correspondant au numéro de facture spécifié.
        invoice = get_object_or_404(Invoice, invoice_number=invoice_number)

        # Met à jour les informations de base de la facture.
        self.update_invoice_info(invoice, request.data)

        # Gère le fichier téléchargé associé à la facture.
        self.handle_uploaded_file(invoice, request.data)

        # Met à jour les éléments de la facture.
        self.update_invoice_items(invoice, request.data.get('invoice_items', []))

        # Supprime les fichiers non utilisés.
        delete_unused_files()

        # Renvoie une réponse indiquant que la facture a été mise à jour avec succès.
        return JsonResponse({"message": "Invoice updated successfully"}, status=status.HTTP_200_OK)

    def update_invoice_info(self, invoice, data):
        # Met à jour les informations de base de la facture avec les nouvelles données.
        customer_number = data.get('customer_number')
        customer = Customer.objects.filter(customer_number=customer_number).first()

        # Si le client n'existe pas, renvoie une erreur.
        if customer is None:
            return JsonResponse({"error": f"Customer with number {customer_number} does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Met à jour les informations de la facture avec les nouvelles données.
        invoice.customer_id = customer
        invoice.invoice_date = data.get('invoice_date')
        invoice.due_date = data.get('due_date')
        invoice.total_amount_exc_vat = data.get('total_amount_exc_vat')
        invoice.total_amount_vat = data.get('total_amount_vat')
        invoice.flag_accounting = data.get('flag_accounting')
        invoice.communication = data.get('communication')
        invoice.structured_communication = data.get('structured_communication')
        invoice.discount_total = data.get('discount_total')

        # Sauvegarde les modifications apportées à l'objet Invoice.
        invoice.save()

    def handle_uploaded_file(self, invoice, data):
        # Gère le fichier téléchargé associé à la facture.
        uploaded_file_id = data.get('uploaded_file')

        # Si un fichier est associé à la facture, l'associe à l'objet Invoice.
        if uploaded_file_id:
            try:
                uploaded_file = UploadedFile.objects.get(pk=uploaded_file_id)
                invoice.uploaded_file = uploaded_file
            except UploadedFile.DoesNotExist:
                # Si le fichier n'existe pas, renvoie une erreur.
                return JsonResponse({"error": f"Uploaded file with id {uploaded_file_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)

            # Sauvegarde les modifications apportées à l'objet Invoice.
            invoice.save()

    def update_invoice_items(self, invoice, invoice_items_data):
        # Met à jour les éléments de la facture avec les nouvelles données.
        updated_item_ids = set()

        # Pour chaque élément de la liste des données des éléments de la facture,
        # vérifie s'il existe déjà dans la base de données.
        for item_data in invoice_items_data:
            item_reference = item_data.get('item_reference') 
            if item_reference:
                try:
                    item = Item.objects.get(item_number=item_reference)  
                except Item.DoesNotExist:
                    # Si l'élément n'existe pas, renvoie une erreur.
                    return JsonResponse({"error": f"Item with reference {item_reference} does not exist"}, status=status.HTTP_404_NOT_FOUND)

                item_uuid = item_data.get('item_id') 
                if item_uuid:
                    try:
                        invoice_item = Invoice_item.objects.get(uuid=item_uuid, invoice_id=invoice.id)
                        # Si l'élément existe déjà, le met à jour.
                        self.update_existing_invoice_item(invoice_item, item, item_data)
                        updated_item_ids.add(item_uuid)
                    except Invoice_item.DoesNotExist:
                        # Sinon, crée un nouvel élément de facture.
                        self.create_invoice_item(invoice, item, item_data)
                        updated_item_ids.add(item_uuid)

        # Supprime les éléments de facture qui ne sont pas présents dans les nouvelles données.
        current_item_uuids = set(item_data.get('item_id') for item_data in invoice_items_data)
        invoice_items_to_delete = Invoice_item.objects.filter(invoice_id=invoice.id).exclude(uuid__in=current_item_uuids)
        invoice_items_to_delete.delete()

    def update_existing_invoice_item(self, invoice_item, item, item_data):
        # Met à jour un élément de facture existant avec de nouvelles données.
        invoice_item.item_id = item  
        invoice_item.quantity = item_data.get('quantity')
        invoice_item.price = item_data.get('price')
        invoice_item.purchase_price = item_data.get('purchase_price')
        invoice_item.discount = item_data.get('discount')
        vat_type_id = item_data.get('vat_type_id')  
        if vat_type_id:
            try:
                vat_type = Vat_Type.objects.get(vat_type=vat_type_id)
                invoice_item.vat_type_id = vat_type 
            except Vat_Type.DoesNotExist:
                # Si le type de TVA n'existe pas, renvoie une erreur.
                return JsonResponse({"error": f"Vat_Type with type {vat_type_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Sauvegarde les modifications apportées à l'élément de facture.
        invoice_item.save()

    def create_invoice_item(self, invoice, item, item_data):
        # Crée un nouvel élément de facture avec les données fournies.
        vat_type_id = item_data.get('vat_type_id')
        vat_type = None
        if vat_type_id:
            try:
                vat_type = Vat_Type.objects.get(vat_type=vat_type_id)
            except Vat_Type.DoesNotExist:
                # Si le type de TVA n'existe pas, renvoie une erreur.
                return JsonResponse({"error": f"Vat_Type with type {vat_type_id} does not exist"}, status=status.HTTP_404_NOT_FOUND)

        # Crée l'objet Invoice_item avec les données fournies.
        Invoice_item.objects.create(
            uuid=item_data.get('item_id'),
            invoice_id=invoice,
            item_id=item, 
            quantity=item_data.get('quantity'),
            price=item_data.get('price'),
            purchase_price=item_data.get('purchase_price'),
            discount=item_data.get('discount'),
            vat_type_id=vat_type  
        )



