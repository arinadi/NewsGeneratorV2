'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

interface FileUploadZoneProps {
  onTextExtracted?: (text: string, fileName: string) => void;
  onFileSelected?: (file: File) => void;
  className?: string;
}

export default function FileUploadZone({ onTextExtracted, onFileSelected, className = '' }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setCurrentFile(file.name);

    // Priority: If parent wants the raw file, give it to them
    if (onFileSelected) {
      try {
        await onFileSelected(file);
        setIsProcessing(false);
        return;
      } catch (err) {
        // If parent fails, we might want to show error or fallback
        console.error('External file handling failed:', err);
        setError('Gagal memproses file.');
        setIsProcessing(false);
        return;
      }
    }

    // Fallback: Internal processing (legacy)
    if (!onTextExtracted) {
      setIsProcessing(false);
      return;
    }

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'txt') {
        // Handle TXT files
        const text = await file.text();
        onTextExtracted(text, file.name);
      } else if (extension === 'pdf') {
        // Handle PDF files - lazy load pdfjs-dist
        try {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(' ');
            fullText += pageText + '\n\n';
          }

          onTextExtracted(fullText.trim(), file.name);
        } catch (pdfError) {
          console.error('PDF parsing error:', pdfError);
          setError('Gagal membaca PDF. Pastikan file tidak terproteksi.');
        }
      } else if (extension === 'docx') {
        // Handle DOCX files - lazy load mammoth
        try {
          const mammoth = await import('mammoth');
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          onTextExtracted(result.value, file.name);
        } catch (docxError) {
          console.error('DOCX parsing error:', docxError);
          setError('Gagal membaca DOCX. Pastikan file valid.');
        }
      } else {
        setError(`Format file .${extension} tidak didukung. Gunakan TXT, PDF, atau DOCX.`);
      }
    } catch (err) {
      console.error('File processing error:', err);
      setError('Gagal memproses file. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  }, [onTextExtracted, onFileSelected]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const clearFile = () => {
    setCurrentFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer transition-all duration-200
          border-2 border-dashed rounded-xl p-4
          flex items-center justify-center gap-3
          ${isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-stone-200 hover:border-blue-400 hover:bg-stone-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-600 font-medium">Membaca {currentFile}...</span>
          </>
        ) : currentFile && !error ? (
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">{currentFile}</span>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="p-1 hover:bg-stone-200 rounded"
            >
              <X className="w-3 h-3 text-stone-500" />
            </button>
          </div>
        ) : (
          <>
            <Upload className={`w-5 h-5 ${isDragging ? 'text-blue-500' : 'text-stone-400'}`} />
            <div className="text-sm">
              <span className={isDragging ? 'text-blue-600 font-medium' : 'text-stone-500'}>
                {isDragging ? 'Lepaskan file di sini' : 'Drag & drop atau '}
              </span>
              {!isDragging && (
                <span className="text-blue-600 font-medium hover:underline">pilih file</span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 uppercase">.txt .pdf .docx</span>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
          <X className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
