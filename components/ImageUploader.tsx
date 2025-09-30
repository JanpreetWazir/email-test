
import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageChange: (file: File | null, base64: string | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // remove the data:image/...;base64, prefix
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const base64 = await fileToBase64(file);
      onImageChange(file, base64);
    }
  };
  
  // FIX: Changed event type from React.DragEvent<HTMLLabelElement> to React.DragEvent<HTMLDivElement> to match the `div` element it is attached to.
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  // FIX: Changed event type from React.DragEvent<HTMLLabelElement> to React.DragEvent<HTMLDivElement> to match the `div` element it is attached to.
  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        setImagePreview(URL.createObjectURL(file));
        const base64 = await fileToBase64(file);
        onImageChange(file, base64);
    }
  }, [onImageChange]);


  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label 
        htmlFor="image-upload" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Upload a photo of your room
      </label>
      <div
        className="group relative flex justify-center items-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors duration-300"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Room preview" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
          </div>
        )}
        <input
          id="image-upload"
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/jpg"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
