import { useRef, type DragEvent, type ChangeEvent, type KeyboardEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error: string | null;
}

/**
 * File upload component with drag-and-drop + click-to-browse.
 * Keyboard accessible via native input.
 */
export function FileUpload({ onFileSelect, isProcessing, error }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    if (isProcessing) return;
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file after an error
    if (file) onFileSelect(file);
  };

  const handleClick = (): void => {
    inputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div
        role="button"
        tabIndex={0}
        aria-label="Pilih file PPTX"
        aria-disabled={isProcessing}
        aria-describedby={error ? 'upload-error' : undefined}
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-400 p-8 text-center hover:border-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:p-12"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pptx"
          onChange={handleChange}
          disabled={isProcessing}
          tabIndex={-1}
          className="sr-only"
        />
        <div className="space-y-2">
          <p className="text-lg text-gray-800" aria-live="polite">
            {isProcessing ? 'Memproses...' : 'Pilih file PPTX atau seret ke sini'}
          </p>
          <p className="text-sm text-gray-600">Maksimum 25 MB</p>
        </div>
      </div>

      {error && (
        <div id="upload-error" role="alert" className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
