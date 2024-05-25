from django.contrib import admin
from django.utils.html import mark_safe

from .models import (
    Supplier, Vat_Type, Item, Country, City, Category, Payment_terms, 
    Address, Customer, Companie, Contact, Invoice, Invoice_item, 
    Companie_Contact, Contact_Customer, Contact_Supplier,
    Address_Types, Address_Address_Type_Supplier,
    Address_Address_Type_Company, Address_Address_Type_Customer,
    Vat_Value, UploadedFile
)

class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ('file_link', 'uploaded_at')
    readonly_fields = ['file_link']

    def file_link(self, obj):
        if obj.file:
            file_url = obj.file.url
            return mark_safe('<a href="{0}" target="_blank">{1}</a>'.format(file_url, obj.file.name.split('/')[-1]))
        else:
            return ''
    file_link.short_description = 'File'

    def get_readonly_fields(self, request, obj=None):
        return [field.name for field in self.model._meta.fields if field.name != 'file']

    def delete_model(self, request, obj):
        # Supprimer le fichier du dossier media
        if obj.file:
            obj.file.delete(save=False)  # Supprimer le fichier physique
        obj.delete()  # Supprimer l'objet de la base de données

admin.site.register(UploadedFile, UploadedFileAdmin)
admin.site.register(Supplier)
admin.site.register(Vat_Type)
admin.site.register(Item)
admin.site.register(Country)
admin.site.register(City)
admin.site.register(Category)
admin.site.register(Payment_terms)
admin.site.register(Address)
admin.site.register(Customer)
admin.site.register(Companie)
admin.site.register(Contact)
admin.site.register(Invoice)
admin.site.register(Invoice_item)
admin.site.register(Companie_Contact)
admin.site.register(Contact_Customer)
admin.site.register(Contact_Supplier)
admin.site.register(Address_Types)
admin.site.register(Address_Address_Type_Supplier)
admin.site.register(Address_Address_Type_Company)
admin.site.register(Address_Address_Type_Customer)
admin.site.register(Vat_Value)
