import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = ({ title, description, variant = 'default' }) => {
    setToast({ title, description, variant });
  
    setTimeout(() => {
      setToast(null);
    }, 5000);
  };

  const Toast = () => {
    if (!toast) return null;

    const variants = {
      default: 'bg-white border border-gray-200',
      destructive: 'bg-red-50 border border-red-200',
    };

    const textVariants = {
      default: 'text-gray-800',
      destructive: 'text-red-800',
    };

    return (
      <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${variants[toast.variant]}`}>
        <h3 className={`font-medium ${textVariants[toast.variant]}`}>
          {toast.title}
        </h3>
        {toast.description && (
          <p className={`mt-1 text-sm ${textVariants[toast.variant]}`}>
            {toast.description}
          </p>
        )}
      </div>
    );
  };

  return {
    toast: showToast,
    Toast,
  };
}

export default useToast;
