import { FileUpload } from './components/FileUpload';
import { useFileProcessor } from './hooks/useFileProcessor';

export default function App() {
  const processor = useFileProcessor();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12 text-gray-900">
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-semibold">PPTX ke Markdown</h1>
          <p className="mt-2 text-gray-600">Konversi presentasi secara lokal di browser.</p>
          <p className="mt-1 text-sm text-gray-600">Draf tanpa arahan desain.</p>
        </header>
        <FileUpload
          onFileSelect={(file) => void processor.processFile(file)}
          isProcessing={processor.status === 'processing'}
          error={processor.error}
        />
        {processor.status === 'success' && processor.markdown && (
          <section className="w-full" aria-label="Markdown hasil konversi">
            <h2 className="mb-2 text-lg font-medium">Hasil Markdown</h2>
            <pre className="max-h-[32rem] overflow-auto rounded-lg border border-gray-200 bg-white p-4 text-sm whitespace-pre-wrap">
              {processor.markdown}
            </pre>
          </section>
        )}
      </section>
    </main>
  );
}
