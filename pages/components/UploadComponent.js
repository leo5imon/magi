import React, { useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import styles from "./UploadComponent.module.css";

const UploadComponent = () => {
  const handleUpload = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      await axios.post("/api/upload", formData);
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

  // Apply different styles when dragging files over the component
  const dynamicDropzoneStyle = isDragActive
    ? `${styles.dropzone} ${styles.dragActive}`
    : styles.dropzone;

  return (
    <div {...getRootProps({ className: dynamicDropzoneStyle })}>
      <input {...getInputProps()} />
    </div>
  );
};

export default UploadComponent;