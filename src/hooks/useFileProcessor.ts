import { useState } from 'react';
import { validateFile } from '../lib/validator/file-validator';
import { parsePptx } from '../lib/parser/pptx-adapter';
import { renderToMarkdown } from '../lib/renderer/markdown-renderer';

type Status = 'idle' | 'processing' | 'success' | 'error';

interface ProcessorState {
  status: Status;
  markdown: string | null;
  error: string | null;
  warnings: number;
}

interface UseFileProcessorReturn extends ProcessorState {
  processFile: (file: File) => Promise<void>;
  reset: () => void;
}

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_TYPE: 'Hanya file berekstensi .pptx yang didukung.',
  FILE_TOO_LARGE: 'Ukuran file melebihi batas maksimum 25 MB.',
  CORRUPTED_FILE: 'File PPTX rusak atau tidak dapat dibaca.',
  NO_SLIDES: 'File tidak berisi slide yang dapat diekstrak.',
  PARSE_FAILURE: 'Gagal memproses file. Pastikan file adalah PPTX yang valid.',
};

/**
 * Hook for processing PPTX files through validation → parse → render pipeline.
 */
export function useFileProcessor(): UseFileProcessorReturn {
  const [state, setState] = useState<ProcessorState>({
    status: 'idle',
    markdown: null,
    error: null,
    warnings: 0,
  });

  const processFile = async (file: File): Promise<void> => {
    setState({ status: 'processing', markdown: null, error: null, warnings: 0 });

    const validationResult = validateFile(file);
    if (!validationResult.success) {
      setState({
        status: 'error',
        markdown: null,
        error: ERROR_MESSAGES[validationResult.error.code] ?? validationResult.error.message,
        warnings: 0,
      });
      return;
    }

    const parseResult = await parsePptx(file);
    if (!parseResult.success) {
      setState({
        status: 'error',
        markdown: null,
        error: ERROR_MESSAGES[parseResult.error.code] ?? parseResult.error.message,
        warnings: 0,
      });
      return;
    }

    const markdown = renderToMarkdown(parseResult.data);
    const warningCount = parseResult.data.slides.reduce((sum, slide) => sum + slide.warnings.length, 0);

    setState({
      status: 'success',
      markdown,
      error: null,
      warnings: warningCount,
    });
  };

  const reset = (): void => {
    setState({ status: 'idle', markdown: null, error: null, warnings: 0 });
  };

  return { ...state, processFile, reset };
}
