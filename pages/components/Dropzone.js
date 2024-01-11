import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const Dropzone = ({ onUpload }) => {
    const dropzoneCallback = useCallback(acceptedFiles => {
      onUpload(acceptedFiles);
    }, [onUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: dropzoneCallback,
    multiple: true,
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag and drop some files here, or click to select files</p>
    </div>
  );
};

export default Dropzone;