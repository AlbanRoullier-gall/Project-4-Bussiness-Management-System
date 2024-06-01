import json
from .utils import delete_unused_files

from django.db import IntegrityError
from django.core.exceptions import ValidationError
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
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@method_decorator(csrf_exempt, name='dispatch')
class DeleteFileAPIView(APIView):
    def delete(self, request, file_id):
        try:
            file_to_delete = UploadedFile.objects.get(id=file_id)
            message, status_code = file_to_delete.delete_file()
            return Response(message, status=status_code)
        except UploadedFile.DoesNotExist:
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)

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
            try:
                invoice = Invoice.create(data)
                return JsonResponse({'message': 'Facture enregistrée avec succès'}, status=status.HTTP_201_CREATED)

            except ValidationError as e:
                return JsonResponse({'error': e.message}, status=status.HTTP_400_BAD_REQUEST)

            except IntegrityError as e:
                return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Les données JSON sont mal formatées'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return JsonResponse({'error': f'Une erreur s\'est produite lors de la sauvegarde de la facture : {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class InvoiceDataView(APIView):
    def get(self, request, invoice_number):
        invoice_data = Invoice.search(invoice_number)
        return JsonResponse(invoice_data)


class UpdateInvoiceView(APIView):
    def put(self, request, invoice_number):
        invoice = get_object_or_404(Invoice, invoice_number=invoice_number)

        # Met à jour les informations de base de la facture.
        success, error = invoice.update_invoice_info(request.data)
        if not success:
            return JsonResponse(error, status=status.HTTP_400_BAD_REQUEST)

        # Gère le fichier téléchargé associé à la facture.
        uploaded_file_id = request.data.get('uploaded_file')
        if uploaded_file_id:
            success, error = invoice.handle_uploaded_file(uploaded_file_id)
            if not success:
                return JsonResponse(error, status=status.HTTP_400_BAD_REQUEST)

        # Met à jour les éléments de la facture.
        success, error = invoice.update_invoice_items(request.data.get('invoice_items', []))
        if not success:
            return JsonResponse(error, status=status.HTTP_400_BAD_REQUEST)

        # Supprime les fichiers non utilisés.
        delete_unused_files()

        # Renvoie une réponse indiquant que la facture a été mise à jour avec succès.
        return JsonResponse({"message": "Facture mise à jour avec succès"}, status=status.HTTP_200_OK)
