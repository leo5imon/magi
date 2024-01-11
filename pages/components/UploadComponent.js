import React, { useState }from 'react';
import axios from 'axios';
import Dropzone from './Dropzone';

const UploadComponent = () => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (files) => {
    setUploading(true);
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
      setUploadProgress(prevProgress => ({
        ...prevProgress,
        [file.name]: { state: 'pending', percentage: 0 }
      }));
    });
  
    try {
      const response = await axios.post('api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          files.forEach(file => {
            setUploadProgress(prevProgress => ({
              ...prevProgress,
              [file.name]: { state: 'uploading', percentage: percentCompleted }
            }));
            setUploading(false);
          });
        }
      });
  
      // Update progress to complete on success
      // ...
  
    } catch (error) {
      setUploading(false);
      // Handle error...
    }
  };

  return (
    <div>
      <h1>Upload an Image</h1>
      <Dropzone onUpload={handleUpload} />
      {uploading && (
        <div>
          {Object.keys(uploadProgress).map(fileName => {
            const progress = uploadProgress[fileName];
            return (
              <div key={fileName}>
                <span>{fileName}</span>
                <div>
                  <div style={{ width: `${progress.percentage}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Other UI elements */}
    </div>
  );  
};

export default UploadComponent;