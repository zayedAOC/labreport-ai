import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a PDF, JPG, or PNG file only.';
    }

    if (file.size > maxSize) {
      return 'File size must be less than 10MB.';
    }

    return null;
  };

  const handleFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    
    if (validationError) {
      setError(validationError);
      return;
    }

    onFileUpload(file);
  }, [onFileUpload]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Lab Report</h2>
      <p className="text-gray-600 mb-8">
        Support for PDF, JPG, and PNG files up to 10MB
      </p>

      <div
        className={`border-2 border-dashed rounded-xl p-12 transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleInputChange}
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center">
            {error ? (
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            ) : (
              <div className="relative">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <FileText className="w-8 h-8 text-blue-600 absolute -bottom-2 -right-2" />
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {dragActive ? 'Drop your file here' : 'Choose file or drag and drop'}
            </h3>
            
            {error ? (
              <p className="text-red-600 font-medium">{error}</p>
            ) : (
              <p className="text-gray-500">
                PDF, JPG, PNG up to 10MB
              </p>
            )}
          </div>
        </label>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Privacy Note:</strong> Your personal information (name, DOB, MRN) will be automatically 
          removed before analysis. We only process the medical values for educational purposes.
        </p>
      </div>
    </div>
  );
};

export default FileUploader;