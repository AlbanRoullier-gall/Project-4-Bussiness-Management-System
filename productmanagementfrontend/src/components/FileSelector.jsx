import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux'; 
import { uploadFile, deleteFile } from '../services/api';
import { setFileSelectorData, clearFileSelectorData, setFileURL, setId } from '../redux/fileSelectorSlice'; 
import './FileSelector.css';

const FileSelector = () => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();
  const fileId = useSelector((state) => state.fileSelector.fileId);
  const fileURL = useSelector((state) => state.fileSelector.fileURL); 

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = async (e) => {
    const selectedFile = e.target.files[0];
    setSelectedFile(selectedFile);
  
    try {
      const { id, fileURL } = await uploadFile(selectedFile);
      dispatch(setId(id));
      console.log('Selected File:', { selectedFile, id, fileURL }); 
      dispatch(setFileSelectorData({ fileName: selectedFile.name, fileURL: fileURL }));
      dispatch(setFileURL(fileURL)); 
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleClearFile = async () => {
    // Ajouter une confirmation avant de supprimer le fichier
    const confirmDelete = window.confirm("Si vous supprimez le fichier, l'application n'en aura plus de trace même en base de données et même sans modification de votre facture afin de garantir le non-eregistrement de fichier personnel. Êtes-vous sûr de vouloir continuer?");
    if (confirmDelete) {
      if (fileId) {
        try {
          await deleteFile(fileId); 
          console.log('File deleted successfully');
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      setSelectedFile(null);
      fileInputRef.current.value = null;
      dispatch(clearFileSelectorData()); 
    }
  };
  
  const openFileInPopup = () => {
    if (fileURL !== null) {
      window.open(fileURL, '_blank', 'height=600,width=800');
    } else if (selectedFile !== null) {
      const urlToOpen = URL.createObjectURL(selectedFile);
      window.open(urlToOpen, '_blank', 'height=600,width=800');
    }
  };

  const truncateFileName = (fileName, maxLength) => {
    if (fileName.length > maxLength) {
      return fileName.substring(0, maxLength) + '...';
    }
    return fileName;
  };

  return (
    <div className='container-file-main'>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelected}
      />
      {fileURL ? (
        <div>
          <button className='button-link' onClick={openFileInPopup} title={truncateFileName(fileURL, 20)}>
            {truncateFileName(fileURL.replace('http://localhost:8000/media/uploaded_files/', ''), 20)}
          </button>
          <button className='button-delete' onClick={handleClearFile}>
            <FontAwesomeIcon icon={faTrash} className="faTrash" />
          </button>
        </div>
      ) : (
        <button className='button-file-selector' onClick={handleFileUpload}>
          <FontAwesomeIcon icon={faFile} className="faFile" />
        </button>
      )}
    </div>
  );
};

export default FileSelector;
