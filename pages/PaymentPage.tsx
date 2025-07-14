
import React, { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../contexts/AuthContext';
import { UploadCloudIcon, CheckCircleIcon } from '../components/icons';

const plansDetails = {
    'premium-monthly': { name: 'Premium Monthly', price: '$1' },
    'premium-yearly': { name: 'Premium Yearly', price: '$5' },
    'pro-lifetime': { name: 'Pro Lifetime', price: '$10' },
};

const PaymentPage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const plan = useMemo(() => {
    return planId && plansDetails[planId as keyof typeof plansDetails] 
      ? { id: planId, ...plansDetails[planId as keyof typeof plansDetails] } 
      : null;
  }, [planId]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setError('');
    if (fileRejections.length > 0) {
        setError('Please upload a valid image file (PNG, JPG) under 5MB.');
        return;
    }
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });
  
  const handleConfirm = () => {
    // In a real app, you would upload the file to a server here.
    // For this mock, we just redirect.
    window.location.href = 'https://wa.me/message/JYA22CVSYSZ4N1';
  }

  if (!user) {
    return (
        <div className="py-16 md:py-24 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Please log in to continue</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">You need to be logged in to make a purchase.</p>
            <div className="mt-6 space-x-4">
                <Link to={`/login?plan=${planId}`} className="bg-brand-red hover:bg-brand-red-dark text-white font-bold py-2 px-6 rounded-md transition-colors">Login</Link>
                <Link to={`/signup?plan=${planId}`} className="text-brand-red font-semibold hover:underline">Create an Account</Link>
            </div>
        </div>
    );
  }

  if (!plan) {
    return (
        <div className="py-16 md:py-24 text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Invalid Plan</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">The selected plan does not exist.</p>
            <Link to="/pricing" className="mt-6 inline-block text-brand-red font-semibold hover:underline">
                &larr; Back to Pricing
            </Link>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-black py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">Complete Your Purchase</h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">You're one step away from unlocking premium features.</p>
          </div>

          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left side: Instructions and QR */}
              <div className="border-r-0 md:border-r md:pr-8 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">Your Plan</h3>
                <div className="flex justify-between items-baseline mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    <span className="text-xl font-semibold text-brand-red">{plan.name}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Instructions</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Scan the eSewa QR code to pay <strong className="text-gray-800 dark:text-white">{plan.price}</strong>.</li>
                  <li>Take a screenshot of the successful payment.</li>
                  <li>Upload the screenshot on this page.</li>
                  <li>Click "Confirm & Contact" to verify on WhatsApp.</li>
                </ol>

                <div className="mt-6">
                  <img src="https://i.ibb.co/ZRvhBsMf/esewa-qr.jpg" alt="eSewa QR Code for Payment" className="w-full max-w-xs mx-auto rounded-lg border-4 border-gray-200 dark:border-gray-700" />
                  <p className="text-center text-sm text-gray-500 mt-2">Scan with your eSewa app</p>
                </div>
              </div>

              {/* Right side: Screenshot Upload */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Upload Payment Proof</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please upload a screenshot of your payment confirmation.</p>

                {error && <p className="text-center text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md mb-4">{error}</p>}
                
                {preview ? (
                    <div className="text-center">
                        <img src={preview} alt="Payment Preview" className="max-w-full h-auto max-h-60 mx-auto rounded-md border-2 border-green-500" />
                         <div className="mt-2 text-center text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                            <CheckCircleIcon className="w-5 h-5" />
                            <span className="font-semibold">Image selected!</span>
                        </div>
                    </div>
                ) : (
                    <div 
                        {...getRootProps()} 
                        className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ${isDragActive ? 'border-brand-red bg-red-50 dark:bg-red-900/20' : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'}`}
                        >
                        <input {...getInputProps()} />
                        <UploadCloudIcon className="h-12 w-12 text-gray-400" />
                        <p className="mt-4 font-semibold text-gray-700 dark:text-gray-200">Drag & drop or click</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">to upload screenshot</p>
                    </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <button 
                onClick={handleConfirm}
                disabled={!file}
                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-md transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Confirm & Contact Support
              </button>
              <p className="text-xs text-gray-500 mt-3">You will be redirected to WhatsApp to finalize your activation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
