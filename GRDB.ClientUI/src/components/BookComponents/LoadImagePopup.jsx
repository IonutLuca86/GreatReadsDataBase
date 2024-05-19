import React, { useState } from 'react';
import './LoadImagePopup.css'
import uploadImage from '../Functions/UploadImage';
import tokenValidation from '../Functions/TokenValidation';
import { useNavigate } from 'react-router-dom';

export default function LoadImagePopup({ isOpen, onClose, onImageSelected }){

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onload = (e) => setPreviewImage(e.target.result);
          reader.readAsDataURL(file);
        } else {
          setSelectedFile(null);
          setPreviewImage(null); // Clear preview if invalid file
        }
      };
    
      const handleImageUpload =async () => {
        if (selectedFile) {
            const token = tokenValidation(navigate);
            if(token)
              { 
              
                const imageUrl = await uploadImage(selectedFile,token)
                onImageSelected(imageUrl);
              }
            
          
          onClose(); 
        }
      };
    
      return (
        <div className={`image-upload-popup ${isOpen ? 'active' : ''}`}>
          <div className="popup-content">
            <h2>Upload Image</h2>
            <div className="file-input-wrapper">
              <label htmlFor="image-upload">Select Image:</label>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleInputChange}
              />
              {selectedFile && (
                <div className="file-info">
                  <span>{selectedFile.name}</span>
                  <button onClick={() => setSelectedFile(null)}>Remove</button>
                </div>
              )}
            </div>
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Selected Image" />
              </div>
            )}
            <div className="button-wrapper">
              <button type="button" onClick={onClose} >
                Cancel
              </button>
              <button type="button" onClick={handleImageUpload} disabled={!selectedFile}>
                Upload
              </button>
            </div>
          </div>
        </div>
      );

}