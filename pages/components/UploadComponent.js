import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import styles from "./UploadComponent.module.css";

const UploadComponent = () => {
  const [isFileDragged, setIsFileDragged] = useState(false);

  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post("/api/upload", formData);
      toast("Image is being uploaded.");
    } catch (error) {
      toast("Oops, something went wrong.");
    }
  };

  const dropzoneCallback = useCallback((acceptedFiles) => {
    handleUpload(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: dropzoneCallback,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  useEffect(() => {
    const handleDrag = (e) => {
      e.preventDefault();
      setIsFileDragged(e.type === "dragover");
    };

    window.addEventListener("dragover", handleDrag);
    window.addEventListener("dragleave", handleDrag);
    window.addEventListener("drop", handleDrag);

    return () => {
      window.removeEventListener("dragover", handleDrag);
      window.removeEventListener("dragleave", handleDrag);
      window.removeEventListener("drop", handleDrag);
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