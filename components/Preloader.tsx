
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 animate-pulse">
            <span className="text-4xl md:text-5xl font-bold text-brand-red">♥</span>
            <span className="text-4xl md:text-5xl font-extrabold text-gray-100 tracking-tight">ILovePDFLY</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
