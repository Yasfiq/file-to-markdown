import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { FileUpload } from '../../src/components/FileUpload';

afterEach(() => cleanup());

describe('FileUpload', () => {
  it('exposes accessible keyboard-operable file picker (AC-01)', () => {
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} isProcessing={false} error={null} />);

    const dropzone = screen.getByRole('button', { name: 'Pilih file PPTX' });
    expect(dropzone.getAttribute('tabindex')).toBe('0');
    expect(screen.getByLabelText('Pilih file PPTX')).toBe(dropzone);
  });

  it('passes dropped PPTX file to callback (AC-01)', () => {
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} isProcessing={false} error={null} />);
    const file = new File(['data'], 'deck.pptx', { type: 'application/octet-stream' });

    fireEvent.drop(screen.getByRole('button', { name: 'Pilih file PPTX' }), {
      dataTransfer: { files: [file] },
    });

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('announces clear error through alert (AC-02)', () => {
    render(
      <FileUpload
        onFileSelect={vi.fn()}
        isProcessing={false}
        error="Hanya file berekstensi .pptx yang didukung."
      />
    );

    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Hanya file berekstensi .pptx yang didukung.');
  });

  it('disables interaction while processing', () => {
    const onFileSelect = vi.fn();
    render(<FileUpload onFileSelect={onFileSelect} isProcessing error={null} />);
    
    const file = new File(['data'], 'deck.pptx');
    const dropzone = screen.getByRole('button', { name: 'Pilih file PPTX' });
    
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(onFileSelect).not.toHaveBeenCalled();
  });
});
