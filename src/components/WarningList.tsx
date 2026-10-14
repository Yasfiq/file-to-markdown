import type { ExtractionWarning } from '../lib/parser/types';

interface WarningListProps {
  warnings: ExtractionWarning[];
}

export function WarningList({ warnings }: WarningListProps) {
  if (warnings.length === 0) return null;

  const bySlide = new Map<number, ExtractionWarning[]>();
  for (const warning of warnings) {
    const slideWarnings = bySlide.get(warning.slideNumber) ?? [];
    slideWarnings.push(warning);
    bySlide.set(warning.slideNumber, slideWarnings);
  }

  return (
    <section className="w-full border-t border-gray-200 pt-5" aria-labelledby="warnings-title">
      <h2 id="warnings-title" className="text-lg font-medium">
        {warnings.length} peringatan
      </h2>
      <ul className="mt-3 space-y-3">
        {[...bySlide.entries()].sort(([a], [b]) => a - b).map(([slideNumber, items]) => (
          <li key={slideNumber}>
            <h3 className="font-medium">Slide {slideNumber}</h3>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
              {items.map((warning, index) => (
                <li key={`${warning.elementType}-${index}`}>{warning.message}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
