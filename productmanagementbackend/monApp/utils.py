from .models import UploadedFile, Invoice

def delete_unused_files():
    # Obtient tous les objets UploadedFile
    all_files = UploadedFile.objects.all()
    
    # Parcours tous les fichiers
    for file in all_files:
        # Vérifie si l'identifiant du fichier est associé à aucune facture
        if not Invoice.objects.filter(uploaded_file_id=file.id).exists():
            # Supprime le fichier s'il n'est pas associé à aucune facture
            file.delete()
