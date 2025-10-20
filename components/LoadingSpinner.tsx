import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Memuat data...', 
  submessage = 'Mohon tunggu sebentar',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 sm:h-8 sm:w-8',
    md: 'h-10 w-10 sm:h-12 sm:w-12 md:h-10 md:w-10',
    lg: 'h-12 w-12 sm:h-14 sm:w-14 md:h-12 md:w-12 lg:h-14 lg:w-14'
  };

  const borderClasses = {
    sm: 'border-2 sm:border-3',
    md: 'border-3 sm:border-3 md:border-3',
    lg: 'border-3 sm:border-3 md:border-3'
  };

  const textSizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base md:text-sm lg:text-base',
    lg: 'text-base sm:text-lg md:text-base lg:text-lg'
  };

  const subTextSizeClasses = {
    sm: 'text-[10px] sm:text-xs',
    md: 'text-xs sm:text-sm md:text-xs',
    lg: 'text-xs sm:text-sm md:text-xs'
  };

  const dotSizeClasses = {
    sm: 'w-1 h-1 sm:w-1.5 sm:h-1.5',
    md: 'w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-1.5 md:h-1.5',
    lg: 'w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-2 md:h-2'
  };

  const centerDotClasses = {
    sm: 'w-1.5 h-1.5 sm:w-2 sm:h-2',
    md: 'w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-2 md:h-2',
    lg: 'w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-2.5 md:h-2.5'
  };

  return (
    <div className="flex items-center justify-center py-8 sm:py-12 md:py-10 lg:py-12 px-4">
      <div className="text-center max-w-md">
        {/* Animated Spinner */}
        <div className="relative inline-block mb-3 sm:mb-4 md:mb-6">
          {/* Outer ring */}
          <div className={`${sizeClasses[size]} ${borderClasses[size]} rounded-full border-blue-100 absolute inset-0 animate-ping opacity-20`}></div>
          
          {/* Middle ring */}
          <div className={`${sizeClasses[size]} ${borderClasses[size]} rounded-full border-blue-200 border-t-blue-600 animate-spin`}></div>
          
          {/* Inner pulse */}
          <div className={`${sizeClasses[size]} ${borderClasses[size]} rounded-full border-blue-300 opacity-30 absolute inset-0 animate-pulse`}></div>
          
          {/* Center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${centerDotClasses[size]} bg-blue-600 rounded-full animate-bounce`}></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-1 sm:space-y-2 px-2">
          <p className={`${textSizeClasses[size]} text-gray-700 font-semibold animate-pulse leading-tight`}>
            {message}
          </p>
          {submessage && (
            <p className={`${subTextSizeClasses[size]} text-gray-500 animate-fade-in leading-tight`}>
              {submessage}
            </p>
          )}
        </div>

        {/* Loading dots animation */}
        <div className="flex justify-center items-center space-x-1.5 sm:space-x-2 mt-3 sm:mt-4">
          <div className={`${dotSizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`${dotSizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
          <div className={`${dotSizeClasses[size]} bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
