import { useState } from 'react';
import { validateFile } from '../lib/validator/file-validator';
import { parsePptx } from '../lib/parser/pptx-adapter';
import { renderToMarkdown } from '../lib/renderer/markdown-renderer';
import type { ExtractionWarning } from '../lib/parser/types';

type Status = 'idle' | 'processing' | 'success' | 'error';

interface ProcessorState {
  status: Status;
  markdown: string | null;
  error: string | null;
  warnings: ExtractionWarning[];
  fileName: string | null;
}

interface UseFileProcessorReturn extends ProcessorState {
  processFile: (file: File) => Promise<void>;
  reset: () => void;
}

const IDLE_STATE: ProcessorState = { status: 'idle', markdown: null, error: null, warnings: [], fileName: null };
const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TYPE: 'Hanya file berekstensi .pptx yang didukung.',
  FILE_TOO_LARGE: 'Ukuran file melebihi batas maksimum 25 MB.',
  CORRUPTED_FILE: 'File PPTX rusak atau tidak dapat dibaca.',
  NO_SLIDES: 'File tidak berisi slide yang dapat diekstrak.',
  PARSE_FAILURE: 'Gagal memproses file. Pastikan file adalah PPTX yang valid.',
};

export function useFileProcessor(): UseFileProcessorReturn {
  const [state, setState] = useState<ProcessorState>(IDLE_STATE);

  const processFile = async (file: File): Promise<void> => {
    setState({ status: 'processing', markdown: null, error: null, warnings: [], fileName: file.name });
    const validationResult = validateFile(file);
    if (!validationResult.success) {
      setState({ status: 'error', markdown: null, error: ERROR_MESSAGES[validationResult.error.code] ?? validationResult.error.message, warnings: [], fileName: file.name });
      return;
    }
    const parseResult = await parsePptx(file);
    if (!parseResult.success) {
      setState({ status: 'error', markdown: null, error: ERROR_MESSAGES[parseResult.error.code] ?? parseResult.error.message, warnings: [], fileName: file.name });
      return;
    }
    const warnings = parseResult.data.slides.flatMap((slide) => slide.warnings);
    setState({ status: 'success', markdown: renderToMarkdown(parseResult.data), error: null, warnings, fileName: file.name });
  };

  const reset = (): void => setState(IDLE_STATE);
  return { ...state, processFile, reset };
}
