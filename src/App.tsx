import { ExportButtons } from './components/ExportButtons';
import { FileUpload } from './components/FileUpload';
import { LimitationsSection } from './components/LimitationsSection';
import { PreviewPane } from './components/PreviewPane';
import { WarningList } from './components/WarningList';
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
        {processor.status === 'processing' && (
          <p className="text-sm text-gray-600" role="status">
            Memproses file, mohon tunggu.
          </p>
        )}
        {processor.status === 'success' && processor.markdown && (
          <>
            <ExportButtons markdown={processor.markdown} fileName={processor.fileName} />
            <PreviewPane markdown={processor.markdown} />
            <WarningList warnings={processor.warnings} />
          </>
        )}
        <LimitationsSection />
      </section>
    </main>
  );
}
