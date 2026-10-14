import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFileProcessor } from '../../src/hooks/useFileProcessor';
import { createMinimalPptx } from '../fixtures/create-pptx';

describe('useFileProcessor hook', () => {
  it('starts in idle state (AC-03)', () => {
    const { result } = renderHook(() => useFileProcessor());
    expect(result.current.status).toBe('idle');
    expect(result.current.markdown).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('transitions idle -> processing -> success for valid PPTX (AC-03)', async () => {
    const validFile = await createMinimalPptx('MyDeck');
    const { result } = renderHook(() => useFileProcessor());

    act(() => {
      void result.current.processFile(validFile);
    });

    expect(result.current.status).toBe('processing');

    await waitFor(() => {
      expect(result.current.status).toBe('success');
    });

    expect(result.current.markdown).toContain('# MyDeck');
    expect(result.current.markdown).toContain('## Slide 01 - MyDeck');
    expect(result.current.error).toBeNull();
  });

  it('sets error state without jargon for invalid file type (AC-02)', async () => {
    const invalidFile = new File(['plain text'], 'notes.txt', { type: 'text/plain' });
    const { result } = renderHook(() => useFileProcessor());

    act(() => {
      void result.current.processFile(invalidFile);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toBe('Hanya file berekstensi .pptx yang didukung.');
    expect(result.current.markdown).toBeNull();
  });

  it('sets error state when file exceeds 25MB (AC-02)', async () => {
    const oversizedFile = new File([new ArrayBuffer(26 * 1024 * 1024)], 'giant.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    const { result } = renderHook(() => useFileProcessor());

    act(() => {
      void result.current.processFile(oversizedFile);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toBe('Ukuran file melebihi batas maksimum 25 MB.');
    expect(result.current.markdown).toBeNull();
  });

  it('resets state back to idle on reset()', async () => {
    const invalidFile = new File(['x'], 'a.txt', { type: 'text/plain' });
    const { result } = renderHook(() => useFileProcessor());

    act(() => {
      void result.current.processFile(invalidFile);
    });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.error).toBeNull();
  });
});
