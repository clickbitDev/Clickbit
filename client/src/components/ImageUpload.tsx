import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  uploadType: 'portfolio' | 'blog' | 'team';
  placeholder?: string;
  className?: string;
  multiple?: boolean;
  onMultipleChange?: (imageUrls: string[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  uploadType,
  placeholder = "Click to upload an image",
  className = "",
  multiple = false,
  onMultipleChange
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { token } = useAuth();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if (multiple) {
        handleFileUpload(Array.from(e.dataTransfer.files));
      } else {
        handleFileUpload([e.dataTransfer.files[0]]);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      if (multiple) {
        handleFileUpload(Array.from(e.target.files));
      } else {
        handleFileUpload([e.target.files[0]]);
      }
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!token) {
      setError('Authentication required');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      if (multiple && files.length > 1) {
        // Multiple file upload
        const formData = new FormData();
        files.forEach(file => {
          formData.append('images', file);
        });

        const response = await api.post(`/upload/${uploadType}/multiple`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        const imageUrls = response.data.images.map((img: any) => img.imageUrl);
        if (onMultipleChange) {
          onMultipleChange(imageUrls);
        }
      } else {
        // Single file upload
        const formData = new FormData();
        formData.append('image', files[0]);

        const response = await api.post(`/upload/${uploadType}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });

        onChange(response.data.imageUrl);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {error && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {value && !multiple ? (
        // Preview for single image
        <div className="relative group">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        // Upload area
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center space-y-2">
            {uploading ? (
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            ) : (
              <ImageIcon className="h-8 w-8 text-gray-400" />
            )}
            
            <div className="text-sm text-gray-600">
              {uploading ? (
                <span>Uploading...</span>
              ) : (
                <>
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    {placeholder}
                  </span>
                  <span> or drag and drop</span>
                </>
              )}
            </div>
            
            <div className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP up to 5MB
              {multiple && " (Multiple files allowed)"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;