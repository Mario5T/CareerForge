import React from 'react';
import { cn } from '../../lib/utils';

const LoadingSpinner = ({ className, fullScreen = false }) => (
  <div className={cn(
    'flex items-center justify-center',
    fullScreen ? 'h-screen w-screen' : 'h-full w-full',
    className
  )}>
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default LoadingSpinner;
