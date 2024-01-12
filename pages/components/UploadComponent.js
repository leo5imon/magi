import React, { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import styles from "./UploadComponent.module.css";

const UploadComponent = () => {
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const router = useRouter();

  const handleUpload = async (files) => {
    const formData = new FormData();
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    const maxFileSize = 10 * 1024 * 1024;

    for (const file of files) {
      if (!allowedFormats.includes(file.type)) {
        toast("Invalid file format. Please upload a JPEG, PNG, or WEBM image.");
        continue;
      }

      if (file.size > maxFileSize) {
        toast("File size exceeds the maximum allowed (10 MB).");
        continue;
      }

      formData.append("files", file);
    }

    try {
      const uploadedFilesCount = formData.getAll("files").length;
      if (uploadedFilesCount > 0) {
        if (uploadedFilesCount === 1) {
          toast("1 image is being uploaded...");
        } else {
          toast(`${uploadedFilesCount} images are being uploaded...`);
        }
        const response = await axios.post("/api/upload", formData);

        if (response.data.shouldRefresh) {
          setShouldRefresh(true);
        }
      }
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

  if (shouldRefresh) {
    router.reload();
  }

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
