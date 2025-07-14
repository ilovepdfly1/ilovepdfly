
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Tool } from '../types';
import { CameraIcon, UploadCloudIcon, FlipCameraIcon } from './icons';

interface ScanToolProps {
  tool: Tool;
  onProcess: (files: File[]) => void;
}

type ScanState = 'idle' | 'camera' | 'preview';

const ScanTool: React.FC<ScanToolProps> = ({ tool, onProcess }) => {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);
  
  const startCamera = async (mode: 'user' | 'environment') => {
    stopCamera(); 
    setError('');
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode },
      });
      setStream(newStream);
      setScanState('camera');
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError('Could not access the camera. Please ensure you have granted permission and that your camera is not in use by another application.');
      setScanState('idle');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if(context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImageSrc(dataUrl);
        setScanState('preview');
        stopCamera();
      }
    }
  };
  
  const handleFlipCamera = () => {
      const newMode = facingMode === 'user' ? 'environment' : 'user';
      setFacingMode(newMode);
      startCamera(newMode);
  };
  
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError('');
    if (fileRejections.length > 0) {
        setError('Please upload a valid image file (PNG, JPG, etc.).');
        return;
    }
    if (acceptedFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
        setScanState('preview');
      };
      reader.readAsDataURL(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    multiple: false,
  });
  
  const handleProcessImage = () => {
    if (!imageSrc) return;
    fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], `scanned-document.jpg`, { type: 'image/jpeg' });
            onProcess([file]);
        });
  };

  const resetState = () => {
    stopCamera();
    setImageSrc(null);
    setError('');
    setScanState('idle');
  }

  const renderIdle = () => (
    <div className="w-full max-w-2xl mx-auto space-y-4">
       {error && <p className="text-center text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button onClick={() => startCamera(facingMode)} className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700 rounded-lg hover:border-brand-red hover:text-brand-red transition-colors group">
          <CameraIcon className="h-16 w-16 text-gray-400 group-hover:text-brand-red transition-colors" />
          <span className="mt-4 text-lg font-semibold">Use Camera</span>
        </button>
        <div {...getRootProps()} className={`flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-900 border-2 border-dashed rounded-lg hover:border-brand-red hover:text-brand-red transition-colors group cursor-pointer ${isDragActive ? 'border-brand-red' : 'border-gray-300 dark:border-gray-700'}`}>
          <input {...getInputProps()} />
          <UploadCloudIcon className="h-16 w-16 text-gray-400 group-hover:text-brand-red transition-colors" />
          <span className="mt-4 text-lg font-semibold">Upload Image</span>
        </div>
      </div>
    </div>
  );
  
  const renderCamera = () => (
    <div className="w-full max-w-3xl mx-auto">
        <div className="relative bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
            <div className="absolute top-2 right-2">
                <button onClick={handleFlipCamera} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                    <FlipCameraIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
        <div className="flex justify-center gap-4 mt-4">
             <button onClick={resetState} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Cancel
            </button>
            <button onClick={handleCapture} className={`w-20 h-20 rounded-full ${tool.color} flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-lg`}>
                <div className="w-16 h-16 rounded-full bg-white/80"></div>
            </button>
        </div>
    </div>
  );
  
  const renderPreview = () => (
    <div className="w-full max-w-3xl mx-auto">
        <p className="text-center mb-4 font-semibold text-gray-600 dark:text-gray-300">Preview of your scanned document:</p>
        <div className="bg-white dark:bg-gray-900 p-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg">
             <img src={imageSrc || ''} alt="Preview" className="w-full h-auto rounded" style={{filter: 'grayscale(1) contrast(1.5) brightness(1.1)'}} />
        </div>
        <div className="flex justify-center gap-4 mt-6">
            <button onClick={resetState} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Retake / Cancel
            </button>
            <button onClick={handleProcessImage} className={`${tool.color} ${tool.hoverColor} text-white font-bold py-3 px-12 rounded-lg text-lg transition-colors`}>
                Process
            </button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
    </div>
  );

  switch (scanState) {
    case 'camera':
      return renderCamera();
    case 'preview':
      return renderPreview();
    case 'idle':
    default:
      return renderIdle();
  }
};

export default ScanTool;