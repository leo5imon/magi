import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from "sonner";
import { useDropzone } from 'react-dropzone';
import styles from './UploadComponent.module.css';

const UploadComponent = () => {
    const [isFileDragged, setIsFileDragged] = useState(false);

    const handleUpload = async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post('api/upload', formData);
            toast("Image is being uploaded.");
        } catch (error) {
            toast("Oops, something went wrong.");
        }
    };

    const dropzoneCallback = useCallback(acceptedFiles => {
        handleUpload(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: dropzoneCallback,
        multiple: true,
        noClick: true,  // Disable click to open file dialog
        noKeyboard: true // Disable keyboard interaction
    });

    useEffect(() => {
      const handleDragOver = (e) => {
          e.preventDefault();
          setIsFileDragged(true);
      };

      const handleDragLeave = (e) => {
          e.preventDefault();
          setIsFileDragged(false);
      };

      window.addEventListener('dragover', handleDragOver);
      window.addEventListener('dragleave', handleDragLeave);
      window.addEventListener('drop', handleDragLeave);

      return () => {
          window.removeEventListener('dragover', handleDragOver);
          window.removeEventListener('dragleave', handleDragLeave);
          window.removeEventListener('drop', handleDragLeave);
      };

      const handleDragEnter = (e) => {
            e.preventDefault();
            setIsFileDragged(true);
        };
  }, []);

    return (
      <>
          {isFileDragged && (
              <div {...getRootProps()} className={styles.dropzone}>
                  <input {...getInputProps()} />
                  <p>Drop the files here...</p>
              </div>
          )}
          {/* Rest of your page content */}
      </>
  );  
};

export default UploadComponent;