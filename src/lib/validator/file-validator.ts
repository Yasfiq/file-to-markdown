import type { Result, ErrorCode } from '../parser/types';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ALLOWED_MIME = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
const ALLOWED_EXTENSION = '.pptx';

/**
 * Validate uploaded file for PPTX processing.
 * 
 * @param file - File object from user upload
 * @returns Result with validated file or error details
 */
export function validateFile(file: File): Result<{ file: File }> {
  // Check empty file
  if (file.size === 0) {
    return {
      success: false,
      error: {
        code: 'INVALID_TYPE' as ErrorCode,
        message: 'File kosong. Pilih file PPTX yang valid.',
      },
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = Math.round(file.size / (1024 * 1024));
    return {
      success: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: `File terlalu besar (${sizeMB}MB). Maksimum 25MB.`,
      },
    };
  }

  // Check extension
  if (!file.name.toLowerCase().endsWith(ALLOWED_EXTENSION)) {
    return {
      success: false,
      error: {
        code: 'INVALID_TYPE',
        message: 'File harus berekstensi .pptx',
      },
    };
  }

  // Check MIME type
  if (file.type !== ALLOWED_MIME && file.type !== '') {
    // file.type can be empty string on some browsers; allow it if extension correct
    return {
      success: false,
      error: {
        code: 'INVALID_TYPE',
        message: 'File harus .pptx (format Office Open XML).',
      },
    };
  }

  return { success: true, data: { file } };
}
