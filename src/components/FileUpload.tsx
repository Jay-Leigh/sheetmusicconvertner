import React, { useCallback, useState } from 'react';
import { Upload, FileMusic, AlertCircle, FileImage, FileText, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, options: ProcessingOptions) => void;
  isProcessing: boolean;
  maxFileSize?: number;
}

interface ProcessingOptions {
  preferredTempo?: number;
  preferredKey?: string;
  selectedPages?: number[];
  processingMode: 'standard' | 'enhanced' | 'manual_assist';
  includeChords: boolean;
  includeLyrics: boolean;
  separateTracks: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  isProcessing, 
  maxFileSize = 10 * 1024 * 1024 // 10MB
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<ProcessingOptions>({
    processingMode: 'standard',
    includeChords: true,
    includeLyrics: false,
    separateTracks: true
  });

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (file.size > maxFileSize) {
      return { valid: false, error: `File size exceeds ${Math.round(maxFileSize / 1024 / 1024)}MB limit` };
    }

    const validTypes = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif',
      'application/pdf', 'image/tiff', 'image/bmp'
    ];

    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Unsupported file format. Please use PNG, JPG, PDF, or TIFF files.' };
    }

    return { valid: true };
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
        setShowOptions(true);
      } else {
        alert(validation.error);
      }
    }
  }, [maxFileSize]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (validation.valid) {
        setSelectedFile(file);
        setShowOptions(true);
      } else {
        alert(validation.error);
      }
    }
  };

  const handleProcess = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, options);
      setShowOptions(false);
      setSelectedFile(null);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (file.type.includes('image')) return <FileImage className="w-6 h-6 text-blue-500" />;
    return <FileMusic className="w-6 h-6 text-purple-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragOver 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-white/30 hover:border-blue-400/50'
        } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Upload Sheet Music
            </h3>
            <p className="text-blue-200 mb-4">
              Drag and drop your sheet music files here, or click to browse
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-blue-200">
            <div className="flex items-center space-x-2">
              <FileImage className="w-4 h-4" />
              <span>Images: PNG, JPG, TIFF</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Documents: PDF</span>
            </div>
          </div>

          <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Choose Files
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileInput}
              disabled={isProcessing}
            />
          </label>

          <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-900/30 px-3 py-2 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>Maximum file size: {Math.round(maxFileSize / 1024 / 1024)}MB</span>
          </div>
        </div>
      </div>

      {/* Processing Options Modal */}
      {showOptions && selectedFile && (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Processing Options</h3>
            <button
              onClick={() => setShowOptions(false)}
              className="text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-6 p-3 bg-white/5 rounded-lg">
            {getFileIcon(selectedFile)}
            <div>
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-blue-200 text-sm">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Processing Mode</label>
              <select
                value={options.processingMode}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  processingMode: e.target.value as any 
                }))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="standard">Standard (Fastest)</option>
                <option value="enhanced">Enhanced (More Accurate)</option>
                <option value="manual_assist">Manual Assist (Interactive)</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Preferred Tempo (BPM)</label>
              <input
                type="number"
                min="40"
                max="200"
                value={options.preferredTempo || ''}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  preferredTempo: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="Auto-detect"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50"
              />
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={options.includeChords}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  includeChords: e.target.checked 
                }))}
                className="rounded"
              />
              <span className="text-white">Include chord symbols</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={options.includeLyrics}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  includeLyrics: e.target.checked 
                }))}
                className="rounded"
              />
              <span className="text-white">Include lyrics (if present)</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={options.separateTracks}
                onChange={(e) => setOptions(prev => ({ 
                  ...prev, 
                  separateTracks: e.target.checked 
                }))}
                className="rounded"
              />
              <span className="text-white">Separate tracks by clef/instrument</span>
            </label>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={() => setShowOptions(false)}
              className="flex-1 bg-white/10 text-white py-3 px-6 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleProcess}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Process File
            </button>
          </div>
        </div>
      )}
    </div>
  );
};