
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { TOOLS } from '../constants';
import { Tool } from '../types';
import FileUpload from '../components/FileUpload';
import ScanTool from '../components/ScanTool';
import { useAuth } from '../contexts/AuthContext';
import { LockIcon } from '../components/icons';

enum ProcessingState {
  Idle,
  Processing,
  Success,
  Error
}

const getOutputFormat = (toolId: string): { ext: string; mime: string } => {
  switch (toolId) {
    // PDF Output
    case 'merge-pdf':
    case 'compress-pdf':
    case 'word-to-pdf':
    case 'powerpoint-to-pdf':
    case 'excel-to-pdf':
    case 'jpg-to-pdf':
    case 'html-to-pdf':
    case 'edit-pdf':
    case 'page-numbers':
    case 'watermark-pdf':
    case 'rotate-pdf':
    case 'unlock-pdf':
    case 'protect-pdf':
    case 'organize-pdf':
    case 'repair-pdf':
    case 'scan-to-pdf':
    case 'pdf-to-pdfa':
    case 'ocr-pdf':
    case 'compare-pdf':
    case 'redact-pdf':
    case 'crop-pdf':
      return { ext: 'pdf', mime: 'application/pdf' };

    // ZIP Output (for multiple files)
    case 'split-pdf':
    case 'pdf-to-jpg':
      return { ext: 'zip', mime: 'application/zip' };

    // Office Document Output
    case 'pdf-to-word':
      return { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
    case 'pdf-to-powerpoint':
      return { ext: 'pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' };
    case 'pdf-to-excel':
      return { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' };

    // Default fallback
    default:
      return { ext: 'dat', mime: 'application/octet-stream' };
  }
};


const ToolPage: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tool, setTool] = useState<Tool | null>(null);
  const [state, setState] = useState<ProcessingState>(ProcessingState.Idle);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const currentTool = TOOLS.find(t => t.id === toolId);
    if (currentTool) {
      setTool(currentTool);
      setState(ProcessingState.Idle); // Reset state on tool change
    } else {
      // Handle tool not found, e.g., redirect to home
      navigate('/');
    }
  }, [toolId, navigate]);

  useEffect(() => {
    if (state !== ProcessingState.Processing) {
      return;
    }

    setProgress(0);
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setState(ProcessingState.Success), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => {
      clearInterval(timer);
    };
  }, [state]);

  const handleProcess = (files: File[]) => {
    if (files.length > 0) {
      setState(ProcessingState.Processing);
    }
  };
  
  const handleReset = () => {
    setState(ProcessingState.Idle);
    setProgress(0);
  };

  const handleDownload = () => {
    if (!tool) return;
    
    const { ext, mime } = getOutputFormat(tool.id);
    const dummyContent = `This is a processed file from ILovePDFLY's ${tool.title} tool. The content inside is for demonstration only.`;
    const blob = new Blob([dummyContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const filename = `${tool.id}-processed.${ext}`;
    link.setAttribute('download', filename);

    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  if (!tool) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-red"></div>
        </div>
    );
  }

  const isPremiumRequired = tool.isPremium && !user?.isPremium;

  const renderContent = () => {
    if (isPremiumRequired) {
      return (
        <div className="w-full max-w-lg text-center bg-white dark:bg-black p-10 rounded-lg shadow-xl border border-yellow-400 dark:border-yellow-600">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/50 mb-6">
            <LockIcon className="h-9 w-9 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">This is a Premium Feature</h3>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Upgrade your account to use the "{tool.title}" tool and unlock all other premium features.</p>
          <Link
            to="/pricing"
            className="mt-8 inline-block w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Upgrade to Premium
          </Link>
          {!user && (
            <p className="text-sm mt-4 text-gray-500 dark:text-gray-400">
              Already have Premium? <Link to="/login" className="text-brand-red font-semibold hover:underline">Log In</Link>
            </p>
          )}
        </div>
      );
    }

    switch (state) {
      case ProcessingState.Processing:
        return (
          <div className="w-full max-w-lg text-center bg-white dark:bg-gray-900 p-12 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Processing...</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Your files are being processed. Please wait.</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mt-8 overflow-hidden">
              <div
                className={`h-4 rounded-full ${tool.color} transition-all duration-150`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="mt-2 text-lg font-semibold tabular-nums dark:text-gray-200">{progress}%</p>
          </div>
        );
      case ProcessingState.Success:
        return (
          <div className="w-full max-w-lg text-center bg-white dark:bg-gray-900 p-12 rounded-lg shadow-xl">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/50">
                <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-6">Success!</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Your files have been processed successfully.</p>
            <button
              onClick={handleDownload}
              className={`mt-8 w-full ${tool.color} ${tool.hoverColor} text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors`}
            >
              Download Processed Files
            </button>
            <button onClick={handleReset} className="mt-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                Process more files
            </button>
          </div>
        );
      case ProcessingState.Idle:
      default:
        if (tool.id === 'scan-to-pdf') {
          return <ScanTool tool={tool} onProcess={handleProcess} />;
        }
        return <FileUpload tool={tool} onProcess={handleProcess} />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center py-12 px-6">
      <div className="text-center mb-10">
        <h1 className={`text-4xl font-extrabold ${tool.textColor}`}>{tool.title}</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">{tool.description}</p>
      </div>
      {renderContent()}
       <div className="mt-12 text-center">
        <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red font-medium transition-colors">
          &larr; Back to all tools
        </Link>
      </div>
    </div>
  );
};

export default ToolPage;