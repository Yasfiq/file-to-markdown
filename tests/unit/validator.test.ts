import { describe, it, expect } from 'vitest';
import { validateFile } from '../../src/lib/validator/file-validator';

const VALID_MIME = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';

function makeMockFile(name: string, sizeBytes: number, type: string): File {
  const blob = new Blob(['x'.repeat(Math.min(sizeBytes, 1024))], { type });
  const file = new File([blob], name, { type });
  Object.defineProperty(file, 'size', { value: sizeBytes });
  return file;
}

describe('validateFile', () => {
  it('passes on valid .pptx file under 25MB', () => {
    const file = makeMockFile('deck.pptx', 1024 * 1024, VALID_MIME);
    const result = validateFile(file);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.file.name).toBe('deck.pptx');
    }
  });

  it('rejects wrong extension with INVALID_TYPE', () => {
    const file = makeMockFile('notes.pdf', 1024, 'application/pdf');
    const result = validateFile(file);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_TYPE');
      expect(result.error.message).toMatch(/pptx/i);
    }
  });

  it('rejects file larger than 25MB with FILE_TOO_LARGE', () => {
    const overLimit = 25 * 1024 * 1024 + 1;
    const file = makeMockFile('huge.pptx', overLimit, VALID_MIME);
    const result = validateFile(file);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('FILE_TOO_LARGE');
      expect(result.error.message).toMatch(/25/);
    }
  });

  it('rejects 0-byte file with INVALID_TYPE', () => {
    const empty = makeMockFile('empty.pptx', 0, VALID_MIME);
    const result = validateFile(empty);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('INVALID_TYPE');
    }
  });
});
