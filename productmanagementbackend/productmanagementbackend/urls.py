"""
URL configuration for productmanagementbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from monApp.views import home
from monApp.views import InvoiceListView
from monApp.views import PaymentTermsList
from monApp.views import CustomerList
from monApp.views import ItemList
from monApp.views import Vat_TypeList
from monApp.views import FileUploadView
from monApp.views import DeleteFileAPIView
from monApp.views import SaveInvoiceAPIView
from monApp.views import InvoiceDataView
from monApp.views import UpdateInvoiceView



urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/payment-terms-list/', PaymentTermsList.as_view(), name='payments-terms-list'),
    path('api/customers-list/', CustomerList.as_view(), name='customers-list'),
    path('api/invoices-list/', InvoiceListView.as_view(), name='invoices-list'),
    path('api/items-list/', ItemList.as_view(), name='items-list'),
    path('api/vat_types-list/', Vat_TypeList.as_view(), name='vat_types_list'),
    path('api/upload-file/', FileUploadView.as_view(), name='file-upload'),
    path('api/delete-file/<int:file_id>/', DeleteFileAPIView.as_view(), name='delete-file'),
    path('api/save-invoice/', SaveInvoiceAPIView.as_view(), name='save-invoice'),
    path('api/invoice/<str:invoice_number>/', InvoiceDataView.as_view(), name='get_invoice_data'),
    path('api/update_invoice/<str:invoice_number>/', UpdateInvoiceView.as_view(), name='update_invoice'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
