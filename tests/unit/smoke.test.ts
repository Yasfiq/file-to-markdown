import { describe, it, expect } from 'vitest';
import App from '../../src/App';

describe('App shell', () => {
  it('exports a React component function', () => {
    expect(typeof App).toBe('function');
  });
});
