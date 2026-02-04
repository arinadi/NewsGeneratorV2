'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload } from 'lucide-react';

interface GlobalDropzoneProps {
  onFileDropped: (file: File) => void;
  children: React.ReactNode;
}

export default function GlobalDropzone({ onFileDropped, children }: GlobalDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    
    if (e.dataTransfer?.types.includes('Files')) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsDragging(false);
      }
      return newCount;
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      // Only accept supported file types
      if (['txt', 'pdf', 'docx'].includes(extension || '')) {
        onFileDropped(file);
      }
    }
  }, [onFileDropped]);

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  return (
    <>
      {children}
      
      {/* Global Dropzone Overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-blue-600/20 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-3xl p-12 shadow-2xl flex flex-col items-center gap-4 animate-pulse">
            <div className="bg-blue-100 p-6 rounded-full">
              <Upload className="w-12 h-12 text-blue-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Lepaskan file di sini
              </h3>
              <p className="text-sm text-slate-500">
                Format: TXT, PDF, DOCX
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
