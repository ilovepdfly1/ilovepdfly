
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloudIcon, FileIcon } from './icons';
import { Tool } from '../types';

interface FileUploadProps {
  tool: Tool;
  onProcess: (files: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ tool, onProcess }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    setIsDragging(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  });
  
  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {files.length === 0 ? (
        <div 
          {...getRootProps()} 
          className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragActive || isDragging ? 'border-brand-red bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900'}`}
        >
          <input {...getInputProps()} />
          <div className={`${tool.color} p-4 rounded-full`}>
            <UploadCloudIcon className="h-12 w-12 text-white" />
          </div>
          <p className="mt-6 text-2xl font-bold dark:text-gray-100">Drag and drop files here</p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">or</p>
          <button type="button" className={`mt-4 ${tool.color} ${tool.hoverColor} text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors`}>
            Select Files
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full">
            <div className="max-h-64 overflow-y-auto pr-4">
            {files.map(file => (
                <div key={file.name} className="flex items-center justify-between p-3 mb-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center space-x-3">
                        <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium truncate">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(file.name)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
            </div>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div {...getRootProps()} className="inline-block">
                <input {...getInputProps()} />
                <button type="button" className="text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold py-3 px-6 rounded-lg transition-colors">
                    Add more files
                </button>
            </div>
            <button
              onClick={() => onProcess(files)}
              className={`${tool.color} ${tool.hoverColor} text-white font-bold py-3 px-12 rounded-lg text-lg transition-colors`}
            >
              Process
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;