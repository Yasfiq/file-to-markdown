interface PreviewPaneProps {
  markdown: string;
}

export function PreviewPane({ markdown }: PreviewPaneProps) {
  return (
    <section className="w-full" aria-label="Markdown hasil konversi">
      <h2 className="mb-2 text-lg font-medium">Hasil Markdown</h2>
      <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-gray-300 bg-white p-4 font-mono text-sm text-gray-900">
        {markdown}
      </pre>
    </section>
  );
}
