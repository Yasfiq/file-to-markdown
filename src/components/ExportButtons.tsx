import { useState } from 'react';

interface ExportButtonsProps {
  markdown: string;
  fileName: string | null;
}

export function ExportButtons({ markdown, fileName }: ExportButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ponytail: fallback if clipboard permissions fail in certain browsers
    }
  };

  const handleDownload = (): void => {
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, '') : 'presentation';
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${baseName}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        aria-label={copied ? 'Tersalin' : 'Salin Markdown'}
      >
        {copied ? 'Tersalin' : 'Salin Markdown'}
      </button>

      <button
        type="button"
        onClick={handleDownload}
        className="rounded-md border border-gray-400 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2"
        aria-label="Unduh .md"
      >
        Unduh .md
      </button>
    </div>
  );
}
