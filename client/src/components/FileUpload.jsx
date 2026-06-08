import React, { useState } from 'react';
import toast from 'react-hot-toast';

const FileUpload = ({ onUpload, currentFile, accept = ".pdf,.doc,.docx", maxSizeMB = 5 }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File is too large. Maximum size allowed is ${maxSizeMB}MB.`);
      return;
    }
    onUpload(file);
  };

  return (
    <div 
      className={`file-upload-container ${dragActive ? 'drag-active' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      style={{
        border: '2px dashed var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '24px',
        textAlign: 'center',
        background: 'var(--bg-input)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        borderColor: dragActive ? 'var(--accent-primary)' : 'var(--border-light)'
      }}
    >
      <input
        type="file"
        id="file-upload-input"
        multiple={false}
        accept={accept}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="file-upload-input" style={{ cursor: 'pointer', display: 'block' }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📤</div>
        <p style={{ fontWeight: 600, marginBottom: '4px' }}>
          {currentFile ? 'Replace your file' : 'Drag & drop your file here'}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          or click to browse ({accept.toUpperCase()} up to {maxSizeMB}MB)
        </p>
      </label>
    </div>
  );
};

export default FileUpload;
